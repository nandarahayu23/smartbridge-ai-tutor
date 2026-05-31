import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory "vector store" for RAG demo
  let documents: { id: string; content: string; embedding: number[] }[] = [];

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/rag/documents', (req, res) => {
    res.json({ documents: documents.map(d => ({ id: d.id, content: d.content.substring(0, 100) + '...' })) });
  });

  app.delete('/api/rag/documents', (req, res) => {
    documents = [];
    res.json({ success: true });
  });

  // Mock Vector search endpoint
  app.post('/api/rag/ingest', (req, res) => {
    const { id, content, embedding } = req.body;
    documents.push({ id, content, embedding });
    res.json({ success: true });
  });

  app.post('/api/rag/search', (req, res) => {
    const { queryEmbedding, topK = 3 } = req.body;
    
    // Simple cosine similarity
    const results = documents
      .map(doc => ({
        ...doc,
        similarity: cosineSimilarity(queryEmbedding, doc.embedding)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    res.json({ results });
  });

  // Server-side Gemini Proxy routes
  app.post('/api/gemini/generate', async (req, res) => {
    try {
      const { prompt, level, language, systemInstruction } = req.body;
      const ai = getAI();
      const finalSystemInstruction = `${systemInstruction || 'Anda adalah Tutor AI yang ahli.'} Gunakan tingkat pemahaman: ${level || 'Intermediate'}. Selalu berikan respons dalam ${language || 'Indonesian'}.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: finalSystemInstruction,
        },
      });
      res.json({ text: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  app.post('/api/gemini/embed', async (req, res) => {
    try {
      const { text } = req.body;
      const ai = getAI();
      const result = await ai.models.embedContent({
        model: "gemini-embedding-2-preview",
        contents: [text],
      });
      res.json({ embedding: result.embeddings[0].values });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  app.post('/api/gemini/study-plan', async (req, res) => {
    try {
      const { topic, level, language } = req.body;
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Buatkan rencana belajar (study plan) yang detail untuk topik: ${topic}. Tingkat kesulitan: ${level}. Berikan dalam ${language}. Format dalam JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              weeks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    week: { type: Type.NUMBER },
                    topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                    goal: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  app.post('/api/gemini/quiz', async (req, res) => {
    try {
      const { topic, level, language, context } = req.body;
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Buatkan 5 soal kuis pilihan ganda tentang: ${topic}. Tingkat kesulitan: ${level}. Berikan dalam ${language}. ${context ? `Gunakan konteks berikut: ${context}` : ''} Format dalam JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              quizzes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    answerIndex: { type: Type.NUMBER },
                    explanation: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  app.post('/api/gemini/rag-response', async (req, res) => {
    try {
      const { query, context } = req.body;
      const ai = getAI();
      const systemInstruction = `Anda adalah Tutor AI yang ahli. Jawab pertanyaan pengguna hanya berdasarkan konteks yang diberikan. Jika jawaban tidak ada di konteks, katakan bahwa Anda tidak tahu.
  Konteks:
  ${context}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: query,
        config: {
          systemInstruction,
        },
      });
      res.json({ text: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  function cosineSimilarity(vecA: number[], vecB: number[]) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magA * magB);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
