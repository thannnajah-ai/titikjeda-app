# Spec: Anti-Zombie / Alibi Journal

## Objective
Mengubah modul *Alibi Journal* (Jurnal Alibi) dari V2 menjadi tembok pertahanan **Anti-Zombie Scroll** berstandar V3. Tujuan utamanya adalah memaksa pengguna untuk mengetikkan secara spesifik "apa yang mau mereka kerjakan hari ini" sebelum mereka diizinkan mengakses fitur utama. Ini mencegah fenomena membuka web tanpa kesadaran penuh (*zombie scrolling*).

## Current Issues (V2)
- Antarmuka berbentuk *modal pop-up* yang bulat, empuk, dan transparan (`backdrop-blur-md`, `rounded-2xl`). Desain ini terlalu "sopan".
- Kurang mengintimidasi. Pengguna tidak merasakan beban psikologis saat ditanya.

## Tech Stack & Refactor Plan
- **Framework:** React + Vite
- **Styling (Taste-Skills & Brutalist):** Secara mutlak mematuhi *Industrial Brutalist UI*. 
  - Tidak boleh ada *overlay* transparan (`backdrop-blur` dilarang). Tembok ini harus menutupi layar sepenuhnya dengan warna hitam mutlak.
  - Kotak *input* berbentuk persegi kaku (`rounded-none`), dengan garis pembatas super tebal (`border-4` atau `border-8`).
  - *Font monospace* kapital untuk instruksi. Area ketik (*textarea*) juga harus terasa seperti mesin ketik atau *console log*.
- **Motion (Emil-Skills):** Tombol *submit* harus keras (`active:scale-[0.97]`). Tidak boleh ada animasi pelan saat jurnal ini muncul. Muncul secara instan saat sesi baru dimulai.
- **Logika Validasi:** Tetap mempertahankan panjang minimal teks (misalnya 20 karakter). Jika kurang, tolak secara visual dengan kasar (misal: perbatasan berubah merah kaku tanpa animasi *fade-in*).

## Boundaries & Constraints
- Modul ini akan menyita seluruh layar. Pengguna tidak bisa klik di luar kotak untuk menutupnya.
- Satu-satunya jalan keluar adalah mengetik niat yang jelas.

## Success Criteria
- Modul berbentuk mesin interogasi militer/brutalist.
- Mencegah pengguna lewat sebelum mengetik 20 karakter.
- Begitu tersimpan, layar terbuka ke aplikasi utama.

## Logika Validasi Anti-Gibberish
Selain syarat minimal 20 karakter, teks juga wajib mengandung minimal **3 spasi**. Ini memastikan pengguna menuliskan sebuah kalimat utuh (yang terdiri dari beberapa kata), bukan sekadar menekan tombol *keyboard* secara acak seperti *"asdasdasdasdasdasdas"*.
