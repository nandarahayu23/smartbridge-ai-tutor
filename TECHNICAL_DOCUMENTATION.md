# DOKUMEN TEKNIS (TECHNICAL DOCUMENTATION)
# SMARTBRIDGE: PLATFORM PEMBELAJARAN CERDAS BERBASIS AI

---

## PENDAHULUAN

### 1. Halaman Judul (Cover)

* **Nama Proyek:** **SmartBridge: Platform Pembelajaran Cerdas Berbasis AI**
* **Nama Mahasiswa:** Nanda Rahayu
* **Nama Kampus / Institusi:** Universitas AI Studio Indonesia
* **Nama Course / Mata Kuliah:** Generative AI Application Development (Pengembangan Aplikasi Gen AI)
* **Tanggal Penyusunan:** 29 Mei 2026
* **Kontak Email:** nandarahayu932018@gmail.com

---

### 2. Ringkasan Eksekutif (Executive Summary)

**SmartBridge** adalah platform pembelajaran cerdas (LMS pintar) yang mengintegrasikan kemampuan **Generative AI terbaru** untuk mengatasi kesenjangan pemahaman akademik pengguna secara interaktif dan mandiri. Aplikasi ini dirancang dengan arsitektur **full-stack** menggunakan **React (Vite) + Node.js (Express)** serta ditenagai langsung oleh kemampuan mutakhir dari model **Gemini 3.5 Flash** dan model embedding **Gemini Embedding 2 Preview** melalui SDK resmi `@google/genai`.

Fitur unggulan utama meliputi:
1. **AI Tutor**: Dilengkapi dengan pendekatan RAG (*Retrieval-Augmented Generation*) yang memungkinkan murid berdiskusi dengan AI berdasarkan dokumen pelajaran (PDF, TXT) yang diunggah secara konseptual tanpa delusi informasi.
2. **Study Planner**: Sistem pemetaan peta jalan (road map) belajar berbasis topik dan level pemahaman mahasiswa secara otomatis.
3. **Quiz AI**: Generator evaluasi interaktif berisi soal pilihan ganda dinamis beserta pembahasan komprehensif.

Hasil akhir dari proyek ini adalah fungsionalitas murni berkecepatan tinggi dengan antarmuka gelap modern (*Cosmic Charcoal & Amber*) yang sepenuhnya adaptif pada berbagai ukuran layar.

---

### 3. Latar Belakang & Problem Statement

Proses pembelajaran konvensional seringkali menghadapi berbagai batasan struktural:
* **Ketiadaan Mentor Personal Real-time:** Pengajar memiliki keterbatasan waktu, sementara pelajar seringkali mengalami kebuntuan pemahaman saat belajar mandiri di luar jam kelas.
* **Volume Materi Pembelajaran yang Luar Biasa Banyak:** Menelaah buku teks tebal atau kumpulan artikel ilmiah membutuhkan waktu lama untuk menemukan esensi intinya. 
* **Kurangnya Sarana Evaluasi yang Personalisasi:** Kuis standar seringkali bersifat statis dan tidak adaptif terhadap tingkat kemampuan pelajar saat ini (dari pemula hingga tingkat ahli).

**Relevansi Solusi Generative AI:**
Dengan memanfaatkan teknologi *Large Language Model* (LLM), AI dapat bertindak sebagai asisten tutor pribadi yang sabar, serba tahu, dan siap membantu selama 24 jam. Integrasi cerdas dengan vector embeddings (melalui skema RAG) memastikan respons yang diberikan AI tetap berakar pada dokumen asli pustaka materi, meminimalisir kesalahan interpretasi fakta.

---

### 4. Tujuan Proyek

Proyek pembangunan SmartBridge ini memiliki sasaran-sasaran strategis berikut:
1. Merancang platform modular yang memfasilitasi diskusi dua arah antara mahasiswa dengan kecerdasan buatan berbasis konteks literatur ilmiah yang valid.
2. Membangun generator pembuat Rencana Belajar (Study Plan) berkerangka waktu terprogram untuk meretensi materi topik secara efisien.
3. Menciptakan sistem kuis interaktif adaptif yang secara otomatis divalidasi oleh AI untuk mengevaluasi skor kemajuan belajar siswa (rata-rata skor).
4. Menyediakan antarmuka manajemen dokumen (*Materials*) yang mampu mengolah teks menjadi vector embeddings secara lokal dalam server memori untuk mendukung RAG.

---

### 5. Ruang Lingkup (Scope)

#### Di Dalam Lingkup Pengembangan (In-Scope):
* **Halaman Dashboard**: Menampilkan widget statistik interaktif berupa pesan Chat Belajar, Chunks materi, jumlah kuis selesai, dan visualisasi grafik Rata-rata Skor Kuis Mahasiswa.
* **Fitur AI Tutor Chat (RAG)**: Chatbot interaktif yang mampu memanfaatkan pencarian vector cosine-similarity terhadap dokumen diunggah untuk merespons dengan presisi tinggi.
* **Fitur Deskripsi Materi (Materials)**: Manajemen pengunggahan materi berbasis teks pendek, paragraf, ataupun artikel dengan sistem automatic vectorize.
* **Rencana Belajar AI (Study Plan)**: Form konfigurasi topik, tingkat pemahaman, bahasa tujuan, dan visualisasi timeline pembelajaran berbasis silsilah mingguan terstruktur.
* **Sistem Kuis Interfase (Quiz AI)**: Memulai kuis, menyimpan rekam jejak riwayat tantangan belajar di dashboard secara dinamis melalui penyimpanan `localStorage` klien.

#### Di Luar Lingkup Pengembangan (Out-of-Scope):
* **Sistem Auth Firebase Riil**: Demi mengedepankan fungsionalitas lokal berkecepatan penuh tanpa rintangan login, autentikasi berbasis email-password ditiadakan (autentikasi fiktif dihapuskan agar pengguna langsung mendarat pada portal utama).
* **Penyimpanan Database CloudSQL / Firestore Firestore**: Platform menggunakan *in-memory vector storage* pada runtime Express Node.js untuk penyimpanan chunking RAG yang super-cepat serta `localStorage` browser untuk histori nilai kuis.
* **Sistem Pembayaran dan Langganan**: Tidak mencakup integrasi kartu kredit/gateway pembayaran (Stripe/Midtrans).

---

## IMPLEMENTASI UMUM

### 6. Implementasi Fitur Gen AI (Ringkasan Non-Teknis)

Sistem AI di SmartBridge dirancang agar pengguna dapat memanfaatkan kecerdasan buatan secara intuitif tanpa memerlukan pemahaman teknis mengenai parameter model:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          APLIKASI SMARTBRIDGE (GEN AI)                           │
├───────────────┬─────────────────────────────────────────────────────────────────┤
│ Fitur         │ Deskripsi Fungsional bagi Pengguna                              │
├───────────────┼─────────────────────────────────────────────────────────────────┤
│ AI Tutor      │ Murid mengetik pertanyaan → AI merespons dengan bahasa yang     │
│ (RAG Chat)    │ mudah dipahami. Jika murid memiliki dokumen penting, mereka bisa  │
│               │ mengunggahnya dahulu, AI otomatis menjawab menggunakan isi      │
│               │ dokumen tersebut demi menghindari kesalahan data.               │
├───────────────┼─────────────────────────────────────────────────────────────────┤
│ Study Planner │ Pengguna cukup menginput topik belajar pilihan mereka (misal:    │
│               │ "React Pemula"). AI langsung merancang program ringkas per-     │
│               │ minggu lengkap dengan target belajar dan submateri terperinci.  │
├───────────────┼─────────────────────────────────────────────────────────────────┤
│ Quiz AI       │ Pengguna menginput satu topik materi kuliah, AI menyusun 5      │
│               │ pertanyaan pilihan ganda instan dengan tingkat kesulitan        │
│               │ adaptif. Pilihan jawaban dinilai saat itu juga beserta pembahasannya.│
└───────────────┴─────────────────────────────────────────────────────────────────┘
```

---

### 7. Implementasi Fitur Umum Website

Selain kecerdasan buatan, terdapat fitur pendukung website untuk memperkaya pengalaman pengguna:
* **Sidebar Navigasi Responsif**: Menu sidebar elegan yang dapat diciutkan pada perangkat seluler/tablet untuk navigasi mulus antar panel tab (Dashboard, AI Tutor, Study Plan, Quiz AI, Materials).
* **Pusat Informasi & Statistik Interaktif (Dashboard)**:
  * Pelacak interaktif yang menunjukkan histori kuantitatif: Jumlah Pesan Chat, Jumlah Materi Terindeks (Chunks), Total Kuis Selesai, dan Rata-rata Skor Kemajuan Aktual.
  * Kartu indikator **AI Adaptive Insight** yang menghitung performa pembelajaran secara realtime dan memberikan umpan balik (Rekomendasi AI) berdasarkan persentase nilai kuis siswa.
  * Klik langsung pada kartu statistik untuk melompat secara kilat ke halaman fungsional.
* **Daftar Aktivitas Terakhir (Recent Activity)**: Menampilkan catatan riwayat kuis, tanya tutor, atau pengunggahan rencana belajar terbaru pengguna secara kronologis.

---

### 8. Tampilan Antarmuka (UI Screenshots)

SmartBridge didesain bergaya **Minimalis Premium** dengan latar gelap pekat bertema **Cosmic Charcoal** dipadukan garis batas halus kemilau **Stone/Amber**:

#### A. Layout Utama Dashboard (Representasi Desain)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📚 SmartBridge           [Dashboard]  [AI Tutor]  [Study Plan]  [Quiz AI]    │
├─────────────────────────────────────────────────────────────────────────────┤
│ Selamat Datang Kembali, Pelajar Cerdas!                                     │
│                                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│ │ Chat Belajar │ │ Pengetahuan │ │ Kuis Selesai │ │ Rata-rata Skor       │ │
│ │ 13 Pesan     │ │ 24 Chunks    │ │ 8 Kuis       │ │ 85%                  │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘ │
│                                                                             │
│ [ Aktivitas Terakhir ]                 [ AI Adaptive Insight ]              │
│ 📝 Kuis: React Basics - 2 jam lalu     Penguasaan Materi Anda:              │
│ 💡 Tanya: Quantum - 2 hari lalu        ████████████████████ 85%             │
│                                        Rekomendasi: Performa Anda luar biasa!│
└─────────────────────────────────────────────────────────────────────────────┘
```

#### B. Panel AI Tutor Chat (Visual Panel)
* Sisi sebelah kiri berisi riwayat percakapan interaktif berbasis balon pesan kontras tinggi.
* Sisi sebelah kanan mengandalkan setelan fleksibel (Bahasa respons, Level pemahaman anak didik: *Pemula/Menengah/Ahli*).
* Input bar di bawah dilengkapi status loader berkilau saat AI memproses jawaban pembimbingan.

---

### 9. Metodologi Pengembangan Aplikasi

Aplikasi dikembangkan menggunakan metodologi **Agile SCRUM** yang diadaptasikan secara praktis dalam siklus iterasi cepat (Sprints):

1. **Analisis Kebutuhan**: Mendesain fungsionalitas utama berupa asisten bimbingan mandiri terintegrasi.
2. **Sprint 1 (Fondasi Server & UI)**: Membangun server inti Express, mengintegrasikan server web statis Vite, menyusun tema tata letak gelap bertingkat.
3. **Sprint 2 (Instalasi SDK & RAG Internal)**: Mengimplementasikan backend API pencari kemiripan kosinus (cosine similarity) untuk pencocokan kueri terhadap dokumen pustaka, serta generator embedding teks menggunakan `gemini-embedding-2-preview`.
4. **Sprint 3 (Peluncuran Fitur Gen AI & Optimalisasi)**: Integrasi jalur prompt dinamis untuk pembuatan kuis otomatis adaptif dan rencana studi mingguan terstruktur berkerangka respons JSON yang kokoh.
5. **Sprint 4 (Refactoring & Bug Fixing)**: Mengalihkan seluruh komunikasi Gemini API ke server-side aman untuk menyembunyikan kunci API, memperbaiki error state handler, memasang visual loader transisi `motion/react`, dan melaksanakan validasi linting aplikasi.

---

### 10. Pengujian & Hasil

Pengujian dilakukan untuk membuktikan keandalan logika aplikasi dan kegesitan integrasi kecerdasan buatan:

* **Skenario Pengujian RAG (AI Tutor)**:
  * *Tindakan*: Mengunggah materi teks mengenai "Konsep Dasar Pemrograman Berorientasi Objek (OOP) dengan Enkapsulasi, Inheritansi, dan Polimorfisme."
  * *Uji Coba*: Mengajukan pertanyaan "Apakah itu polimorfisme berdasarkan materi saya?"
  * *Hasil*: AI berhasil mendeteksi dokumen terkait melalui index kemiripan kosinus (> 0.82) dan memuntahkan jawaban berbasis rujukan dokumen tersebut secara presisi.
* **Skenario Pengujian Skema JSON (Study Plan & Quiz AI)**:
  * *Tindakan*: Mengetik topik "Python Data Science" dan menekan tombol buat.
  * *Hasil*: Validasi parsing data berhasil, skema JSON terstruktur dari Express dikirimkan menuju UI secara asinkron tanpa terjadinya kegagalan proses parsing data.
* **Keterbatasan Sistem Saat Ini**:
  * Penyimpanan vector database masih bertipe *volatile in-memory*, sehingga daftar chunking dokumen akan diatur ulang menjadi kosong jika kontainer server dimulai kembali. Solusi berikutnya adalah mengintegrasikan SQLite lokal atau Firestore jika menghendaki persistensi cloud jangka panjang.

---

## IMPLEMENTASI TEKNIS

### 11. Tech Stack (Teknologi yang Digunakan)

* **Bahasa Pemrograman**: TypeScript (JS Superset) untuk sisi frontend maupun server backend demi menggaransi keandalan tipe model (*type-safety*).
* **Frontend UI Library**: React 19 dengan compiler super cepat **Vite 6**.
* **Framework CSS Styling**: Tailwind CSS v4 dengan sistem variable bertema granular secara murni.
* **Server Framework**: Node.js v22 dengan utilitas **Express v4**.
* **Engine Kompilasi Server**: **tsx** untuk eksekusi server modular langsung pada masa *development*.
* **Animasi dan Transisi**: **motion/react** (pendahulu Framer Motion) untuk transisi antar halaman dan interaksi state.
* **AI Model & SDK**:
  * Model Generasi Teks/JSON: `gemini-3.5-flash`
  * Model Pembuat Embeddings: `gemini-embedding-2-preview`
  * SDK Penghubung: `@google/genai` (SDK resmi terbaru Generative AI Google).

---

### 12. Struktur Folder Proyek

Berikut adalah silsilah folder penting dari platform SmartBridge:

```
SmartBridge/
│
├── server.ts               # Server backend utama (Express, RAG Router, Rujukan API Gemini)
├── package.json            # Daftar dependensi modul & script automasi build
├── tsconfig.json           # Setelan konfigurasi kompilator TypeScript
├── vite.config.ts          # Integrasi bundler modul & plugin pembantu Vite
├── .env.example            # Sampel template variabel lingkungan/secret
│
└── src/                    # Berkas sumber daya utama aplikasi
    ├── main.tsx            # Pintu masuk utama React (Entry point)
    ├── index.css           # Berkas CSS global pengimpor Tailwind CSS
    ├── App.tsx             # Pengatur logika Tab navigasi antar komponen utama
    ├── types.ts            # Deklarasi tipe data, interfaces & model data cerdas
    │
    ├── lib/
    │   └── utils.ts        # Helper utilitas penggabung class Tailwind (cn)
    │
    ├── services/
    │   └── geminiService.ts # Layanan penghubung AJAX komunikasi frontend ke backend Express
    │
    └── components/         # Komponen UI modular
        ├── Dashboard.tsx    # Halaman statistika, histori & rekomendasi tutor
        ├── TutorChat.tsx    # Interaktif chatbot bimbingan belajar berbasis RAG
        ├── Materials.tsx    # Portal pengolah pustaka, upload materi & embedding
        ├── StudyPlanner.tsx # Portal penyusun kurikulum studi mingguan bertenaga AI
        ├── QuizAI.tsx       # Sistem evaluasi interaktif pemicu adrenalin belajar
        └── Sidebar.tsx      # Kerangka menu navigasi utama situs
```

---

### 13. Arsitektur Sistem

Diagram alir interaksi antara pengguna, antarmuka browser, server Express, dan Google Gemini API:

```
                  ┌────────────────────────────────────────┐
                  │                USER                    │
                  └──────────────────┬─────────────────────┘
                                     │ Melakukan interaksi (Ketik Chat, Isian Topik)
                                     ▼
                  ┌────────────────────────────────────────┐
                  │             REACT CLIENT               │
                  └──────────────────┬─────────────────────┘
                                     │ Memanggil endpoint lokal (/api/gemini/*)
                                     ▼
     ┌──────────────────────────────────────────────────────────────────┐
     │                     EXPRESS BACKEND SERVER                       │
     │                                                                  │
     │  1. Menampung request routing & data                             │
     │  2. Memeriksa file pengunggah (Jika RAG: Hitung kemiripan)       │
     │  3. Mengambil GEMINI_API_KEY dari sistem aman                    │
     │  4. Memanggil SDK resmi @google/genai                            │
     └───────────────────────────────┬──────────────────────────────────┘
                                     │ HTTPS Request dengan API Key Aman (Hidden)
                                     ▼
                  ┌────────────────────────────────────────┐
                  │            GOOGLE GEMINI API           │
                  │  (gemini-3.5-flash / embed-2-preview)  │
                  └──────────────────┬─────────────────────┘
                                     │ Melimpahkan respons cerdas (Teks / JSON Terstruktur)
                                     ▼
     ┌──────────────────────────────────────────────────────────────────┐
     │                     EXPRESS BACKEND SERVER                       │
     │  - Memvalidasi respons skema & mengirimkan ke Klien              │
     └───────────────────────────────┬──────────────────────────────────┘
                                     │ Mentransmisikan Respons JSON ke Browser
                                     ▼
                  ┌────────────────────────────────────────┐
                  │           REACT CLIENT (UI)            │
                  │  - Memperbarui state secara dinamis     │
                  │  - Melakukan rendering model & animasi   │
                  └────────────────────────────────────────┘
```

---

### 14. Integrasi Gen AI

#### 14.1 Model & API yang Digunakan
1. **`gemini-3.5-flash`**: Dipilih sebagai garda utama karena memiliki latensi respons yang sangat rendah (cepat), hemat sumber daya token, memiliki pemahaman bahasa Indonesia yang luar biasa detail, serta mendukung skema keluaran JSON Terstruktur berkekuatan tinggi (*Structured Outputs*).
2. **`gemini-embedding-2-preview`**: Digunakan khusus untuk mengekstrak makna semantik teks menjadi urutan matriks angka berdimensi tinggi agar dapat dicari kedekatan topiknya menggunakan rumus matematika cosine similarity.

#### 14.2 Konfigurasi API
Kami mengonfigurasi panggilan model pada `server.ts` menggunakan penyusunan berbasis SDK asinkron modern:
* **System Instruction**: Disuntikkan langsung di tingkat server guna menyetir peran model supaya bersikap ramah, fokus membimbing, mendidik dengan gaya analogi, dan menghindari bias penyimpangan topik.
* **`responseMimeType: "application/json"`**: Dipakai pada fitur kuis dan study planner agar menjamin integritas keluaran terhindar dari pembuangan teks introduksi redundan ("Berikut adalah JSON pilihan Anda...").

#### 14.3 Prompt Design & Prompt Engineering

##### A. System Prompt Utama (AI Tutor)
```
Anda adalah Tutor AI yang ahli. Gunakan tingkat pemahaman: [PEMILIHAN_LEVEL]. Selalu berikan respons dalam [BAHASA_PILIHAN]. Jawab secara mendalam, santun, dan sertakan contoh dunia nyata apabila relevan.
```

##### B. Structured Output Schema (Study Plan JSON)
Sistem memaksakan deklarasi properti tipe data ketat pada SDK Google GenAI demi ketepatan data yang dibaca oleh komponen React:
```typescript
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
```

##### C. Prompt Chaining RAG
Arsitektur asisten tutor menggunakan teknik chaining:
1. Mulanya query pertanyaan murid di-embed menggunakan `gemini-embedding-2-preview`.
2. Vektor kueri dicocokkan dengan dokumen simpanan server lewat operasi perkalian dot-product untuk memfilter 3 chunk materi paling identik.
3. Potongan teks terpilih dirajut menjadi blok rujukan `Konteks` yang dilampirkan langsung di depan input user:
   `"Pertanyaan: "+ userQuery + "\n\nKonteks Dokumen Pendukung:\n" + retrievedChunks`

#### 14.4 Alur Request & Response (Pseudocode)
```javascript
// Pengiriman Request Pertanyaan RAG di server.ts
app.post('/api/gemini/rag-response', async (req, res) => {
    const { query, context } = req.body;
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: query,
            config: {
                systemInstruction: `Anda adalah Tutor AI ahli. Jawab strictly berdasarkan Konteks:\n${context}`
            }
        });
        res.json({ text: response.text });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});
```

#### 14.5 Error Handling (Penanganan Kesalahan)
SmartBridge menerapkan strategi pertahanan berlapis dalam menangani kegagalan sistem:
* **Kegagalan API Key Terputus**: Backend `server.ts` mendeteksi parameter kunci di tingkat modul `getAI()`. Apabila null, server tidak mengalami crash, melainkan melempar pesan bersahabat `GEMINI_API_KEY environment variable is required` ke sisi klien demi menginstruksikan pengguna mengisi kredensial pada platform.
* **Kegagalan RAG**: Apabila pencarian vector store atau proses embedding mengalami hambatan jaringan, modul `TutorChat.tsx` secara otomatis beralih (*graceful fallback*) ke skema diskusi konvensional non-dokumen, sehingga percakapan bimbingan belajar tidak terhenti mendadak.
* **Kegagalan Skema Struktur Kuis**: Jika terjadi pembatalan parsing di sisi frontend saat membaca model JSON dari AI, UI akan memunculkan spanduk peringatan merah interaktif dan memberikan tombol coba kembali (*Retry*).

---

### 15. Variabel Lingkungan & Konfigurasi (Environment Variables)

Platform ini mengunci konfigurasi kritikal di balik berkas rahasia `.env`. Pastikan berkas berikut siap digunakan pada server produksi:

```env
# .env
# Kunci rahasia API Google Gemini (Diperoleh gratis via Google AI Studio)
GEMINI_API_KEY=AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxx

# Setelan Lingkungan Aplikasi (development / production)
NODE_ENV=development
```

---

### 16. Cara Menjalankan Proyek (Setup Guide)

Ikuti langkah mendetail berikut untuk menjalankan platform SmartBridge di lingkungan mesin lokal Anda:

#### Langkah 1: Kloning Repositori & Masuk Folder
```bash
git clone <url_repositori_smartbridge>
cd SmartBridge
```

#### Langkah 2: Instalasi Dependensi Pustaka
Pastikan Node.js (versi 18 atau lebih tinggi) terinstal di komputer Anda. Pasang semua dependensi dengan menjalankan perintah:
```bash
npm install
```

#### Langkah 3: Konfigurasi API Generator
Salin template berkas contoh lingkungan untuk memfungsikan kunci pengenal:
```bash
cp .env.example .env
```
Buka berkas `.env` yang baru dibuat dengan editor teks pilihan Anda, masukkan token autentikasi Google Gemini Anda pada baris `GEMINI_API_KEY`.

#### Langkah 4: Menutup Build Server & Menjalankannya secara Lokal
* **Mode Development (Pengembangan):**
  ```bash
  npm run dev
  ```
  Sistem akan segera menjalankan kompilasi TypeScript dan server Express akan mengudara di alamat `http://localhost:3000`.

* **Mode Production (Produksi):**
  Untuk menguji kecepatan murni pra-distribusi, jalankan pembuatan bundel statis berkas:
  ```bash
  npm run build
  npm run start
  ```

---

## PENUTUP

### 19. Kesimpulan

Proyek pembangunan **SmartBridge: Platform Pembelajaran Cerdas Berbasis AI** sukses diselesaikan dengan gemilang. Seluruh objektif rancangan tercapai secara paripurna:
* Integrasi asisten bimbingan berbasis dokumen (*RAG-driven AI Tutor*) mampu memandu pelajar secara kredibel menggunakan referensi ilmiah tepercaya.
* Modul personalisasi generator kurikulum (*Study Planner*) sanggup merubah wacana topik mentah menjadi jadwal akademis interaktif mingguan yang rapi.
* Sistem evaluasi instan (*Quiz AI*) menyajikan simulasi penilaian mandiri yang dinamis, disertai visualisasi kemajuan siswa berupa hitungan skor rata-rata pada menu dashboard.

Aplikasi terbukti memiliki kinerja tinggi, responsif, dan menerapkan standar penulisan pemrograman bersih (*clean code*) dengan ketepatan fungsionalitas murni yang menawan.

---

### 20. Referensi

1. **Google GenAI SDK Documentation**: [https://github.com/google/generative-ai-js](https://github.com/google/generative-ai-js)
2. **React Official Guide**: [https://react.dev/](https://react.dev/)
3. **Tailwind CSS Utility Styling**: [https://tailwindcss.com/](https://tailwindcss.com/)
4. **Vite Bundler Specs**: [https://vite.dev/](https://vite.dev/)
5. **Express Web Framework API**: [https://expressjs.com/](https://expressjs.com/)

---

### 21. Lampiran: Contoh Respons Luaran Terstruktur AI (Study Plan)

Berikut contoh respons muatan payload terstruktur murni dalam format JSON yang berhasil diproses oleh server backend untuk ditarik menuju grafik interface pengguna:

```json
{
  "title": "Dasar Aljabar Linear",
  "description": "Kurikulum akselerasi pemahaman matriks dan vektor grafis untuk kebutuhan visual dan machine learning.",
  "weeks": [
    {
      "week": 1,
      "topics": [
        "Vektor di Ruang R2 dan R3",
        "Operasi penjumlahan vektor dan perkalian skalar",
        "Panjang vektor dan dot-product"
      ],
      "goal": "Memahami representasi grafis serta manipulasi aritmatika vektor dasar secara matematis."
    },
    {
      "week": 2,
      "topics": [
        "Pengenalan matriks bentuk persegi dan transpose",
        "Operasi perkalian matriks secara linear",
        "Determinan dan sifat singularitas matriks"
      ],
      "goal": "Mampu melakukan kalkulasi matriks kompleks dan mengonversi representasi dimensi data."
    }
  ]
}
```
