# Spec: One Question (Satu Soal Dewa)

## Objective
Menciptakan pertaruhan (*high stakes*) setiap hari. Pengguna hanya diberikan 1 soal UTBK tingkat kesulitan tinggi (HOTS) per hari. Jika benar, mereka diizinkan mengakses modul aplikasi lainnya. Jika salah, mereka dianggap tidak layak dan aplikasi akan **dikunci sepenuhnya** hingga tengah malam (besok hari). Ini memicu adrenalin dan mencegah belajar asal-asalan.

## Tech Stack
- **Framework:** React + Vite
- **Styling & Design (Taste-Skills & Brutalist):** Mengadopsi *Industrial Brutalist UI*. Antarmuka mekanikal mentah bergaya terminal (*grid* kaku, kontras skala huruf yang ekstrem, tata letak asimetris). Menggunakan palet *Pure Monochrome*. *Banned*: Sudut membulat (*soft rounded corners*), *glassmorphism*, bayangan jatuh (*drop shadows* yang halus), dan gradien. Segala bentuk estetika "AI yang ramah" dilarang.
- **Motion (Emil-Skills):** `motion/react`. Animasi hukuman (saat jawaban salah dan layar dikunci) TIDAK BOLEH lambat atau memiliki *ease-in*. Hukuman dijatuhkan secara instan dengan transisi yang keras (*snappy spring* atau *custom ease-out* `[0.23, 1, 0.32, 1]`). Tombol pilihan ganda wajib memiliki umpan balik sentuhan `active:scale-[0.97]` tanpa jeda transisi warna.
- **State/Storage (Online Sync):** Zustand (`useAppStore`) untuk kecepatan UI lokal, DIPADUKAN dengan **Supabase Database** secara *online*. Status harian (`lastAnswerDate` dan `dailyStatus`) wajib dikirim ke Supabase. Ini untuk memastikan pengguna tidak bisa berbuat curang (*cheat*) dengan cara menghapus *cache browser*; jika di *database* server statusnya sudah `'failed'`, mereka tetap akan terkunci di perangkat mana pun. 
- **Data Source:** Sebuah *array of objects* sederhana berisi daftar soal JSON lokal (karena ini *frontend focus*).

## Project Structure
- `src/pages/OneQuestion.jsx` → Halaman kuis satu soal (berisi timer mundur jika ada, pertanyaan, dan pilihan ganda).
- `src/components/DailyLockout.jsx` → *Overlay* absolut (mirip Night Protocol) yang hanya muncul jika status hari ini adalah `'failed'`.
- `src/store/useAppStore.js` → *Update state* `lastAnswerDate` dan status harian.

## Code Style / Logic
- Setiap kali komponen termuat, ia akan mengecek apakah tanggal hari ini sama dengan `lastAnswerDate`.
- Jika sama, ia akan mengecek apakah `dailyStatus` bernilai `'failed'`. Jika iya, *render* `DailyLockout`. Jika `'passed'`, tampilkan halaman sukses atau arahkan kembali ke loker.
- Jika tanggal berbeda (hari baru), *reset* status menjadi `null`.

## Boundaries & Constraints
- **Jangan Pernah:** Memberikan tombol "Coba Lagi" (kecuali jika dikontrol oleh sistem *Cheat* rahasia untuk fase dev). Sekali salah, kunci mutlak.
- **Jangan Pernah:** Menganimasikan transisi halaman dengan lambat. Hukumannya harus instan dan mengejutkan (Emil's principles: respons cepat, kurva *ease-out* atau *spring* kencang).

## Success Criteria
- Menampilkan satu soal acak per hari.
- Memilih jawaban salah langsung memunculkan layar hitam penguncian yang menutupi seluruh aplikasi, yang bertahan walaupun web di-*refresh*.
- Layar penguncian otomatis terlepas ketika jarum jam menyentuh pukul 00:00 keesokan harinya.

## Open Questions
- Apakah kita ingin menambahkan *Countdown Timer* (misal: 60 detik) untuk menjawab soal ini demi meningkatkan tekanan psikologis? (Jika waktu habis = salah). 
