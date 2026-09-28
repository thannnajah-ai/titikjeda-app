# TitikJeda (ZenUTBK) - Product Requirements Document (PRD)

## 1. Visi Produk
Platform "Robin Hood UTBK" yang 100% gratis, berfokus pada efisiensi belajar (Prinsip Pareto 80/20) dan memprioritaskan kesehatan mental siswa kelas 12 di atas segalanya. TitikJeda adalah antitesis dari *hustle culture* bimbel komersial, didesain untuk menjadi "ruang aman" bagi siswa yang mengalami *burnout*.

## 2. Target Pengguna
Siswa kelas 12 SMA/SMK di Indonesia (Gen Z) yang merasa tertekan, mengalami *burnout* akibat informasi berlebih (information overload), dan/atau tidak memiliki biaya untuk bimbingan belajar premium.

## 3. Core Values & Design Principles
- **Anti-Burnout:** Memaksa pengguna istirahat secara sistemik (bukan sekadar himbauan).
- **Minimalist, Brutalist & Editorial UI:** *Dark mode* by default. Menggunakan tipografi besar (seperti Inter atau Outfit), ruang kosong (*whitespace*) yang lega, elegan, dan fungsional. Tidak ada elemen "gamifikasi murahan" (koin, avatar, dll). Pembangunan UI **wajib** berpedoman pada skill `design-taste-frontend` untuk kualitas visual kelas atas.
- **Fluid & Meaningful Animation:** Semua elemen interaktif dan transisi harus menggunakan skill `emil-design-eng` sebagai referensi standar gerak (motion), agar aplikasi terasa *premium*, mulus, dan responsif.
- **Safe Space (Zero Multiplayer):** Tidak ada papan peringkat (*leaderboard*) publik atau fitur *share* nilai.
- **No-Nonsense:** Langsung ke inti materi, tidak ada basa-basi.

## 4. Daftar Fitur Utama (MVP)

### 4.1. Senjata Akademis
1. **Pita Suara UTBK (Materi 80/20)**
   - **Deskripsi:** Halaman *cheat-sheet* (rangkuman super inti) materi UTBK.
   - **Mekanisme:** Menampilkan ringkasan teks/tabel untuk sub-tes (Penalaran Umum, Pengetahuan Kuantitatif, dll). Menyortir hanya rumus atau pola soal yang secara historis paling sering keluar.
2. **Locker Room (Agregator Gratis)**
   - **Deskripsi:** Direktori *link* kurasi.
   - **Mekanisme:** Mengarahkan pengguna ke sumber tryout gratis, soal PDF, dan *thread* materi di platform luar (X/Twitter, Telegram) yang disusun rapi dalam satu tempat.
3. **Statistik Personal (Single-Player Tracker)**
   - **Deskripsi:** *Dashboard* progres nilai Tryout.
   - **Mekanisme:** Pengguna menginput skor tryout mereka, sistem membuat grafik progres personal menuju passing grade jurusan impian.

### 4.2. Ekosistem Anti-Burnout
4. **Forced Lockout (Pemblokir Otomatis)**
   - **Deskripsi:** Mekanisme pembatas waktu belajar untuk mencegah *burnout*.
   - **Mekanisme:** Jika pengguna berinteraksi di halaman materi selama 90 menit tanpa henti, aplikasi akan memunculkan *overlay* layar gelap yang menutupi seluruh website selama 30 menit. Teks: *"Kapasitas otakmu sudah penuh. Tutup laptopmu dan istirahat."*
5. **The Void (Dinding Anonim)**
   - **Deskripsi:** *Feed* sosial tanpa *toxic positivity* atau komentar.
   - **Mekanisme:** Pengguna bisa memposting curhatan *burnout* secara anonim. Pengguna lain **TIDAK BISA** membalas teks, hanya bisa memberikan reaksi klik: **"Hug 🫂"** atau **"Relate 🥲"**.
6. **Bilik Konsultasi (AI Mentor)**
   - **Deskripsi:** Chatbot privat berbasis persona empatik (Kakak Kelas).
   - **Mekanisme:** Prompt AI dikunci untuk **TIDAK** menyuruh belajar, melainkan memvalidasi stres siswa, memberikan porsi istirahat, dan teknik *calming* (seperti *box breathing*). Memiliki *kill-switch* peringatan jika ada *keyword* krisis mental ekstrem.

## 5. Arsitektur Teknis & Stack
- **Frontend Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS (fokus pada *aesthetic*, *dark theme*, dan *micro-interactions* halus).
- **State Management:** Zustand atau React Context.
- **Routing:** React Router DOM.
- **Storage (MVP - Hybrid):** 
  - **Lokal (LocalStorage/IndexedDB):** Digunakan untuk data nilai Tryout dan statistik personal. Aplikasi tetap super cepat, tidak perlu *login*, dan privasi 100% terjaga di perangkat masing-masing.
  - **Online (Supabase/Firebase):** Digunakan KHUSUS untuk fitur **The Void**. Ini memungkinkan *feed* curhatan dan hitungan tombol "Hug 🫂" tersinkronisasi secara *real-time* dengan pengguna lain di seluruh Indonesia, menciptakan rasa kebersamaan tanpa menghilangkan anonimitas.
- **AI Integration:** Penggunaan API LLM eksternal (seperti OpenAI/Gemini/Claude) untuk Bilik Konsultasi, dengan *system prompt* khusus.

## 6. Milestones Pelaksanaan
1. **Fase 1 (Foundation):** Setup proyek Vite + Tailwind, penerapan Design System (Warna, Tipografi, Komponen dasar).
2. **Fase 2 (UI Implementation):** Membangun kerangka halaman utama (Dashboard, Materi, The Void, AI Chat).
3. **Fase 3 (Core Logic):** Mengembangkan fungsionalitas utama (*Forced Lockout timer*, fungsionalitas klik *Hug* di The Void, input skor tryout).
4. **Fase 4 (Polish & AI):** Menyempurnakan animasi (Framer Motion), merapikan responsivitas *mobile*, dan menyambungkan API AI.
