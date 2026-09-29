# Spec: Silent Radio (Radio Senyap)

## Objective
Mengubah modul *Silent Radio* peninggalan versi V2 agar selaras dengan pedoman desain V3 (Industrial Brutalist UI). Radio Senyap adalah pemutar audio latar (lofi/hujan) yang dilengkapi dengan **Supabase Presence** (memperlihatkan jumlah pengguna yang sedang mendengarkan bersama-sama secara *real-time*).

## Current Issues (V2)
- Desain masih menggunakan `rounded-full`, `backdrop-blur`, dan palet `stone-900` yang terlalu lembut.
- Tombol belum menggunakan *physics feedback* yang disyaratkan (Emil's Motion).
- Estetika terlalu mirip dengan aplikasi pemutar musik standar.

## Tech Stack & Refactor Plan
- **Framework:** React + Vite
- **Styling (Taste-Skills & Brutalist):** Secara ketat mengadopsi *Industrial Brutalist UI*. Hapus semua sudut membulat (*rounded corners*), bayangan jatuh, dan *glassmorphism*/*blur*. Wajib menggunakan kotak persegi bersudut tajam mutlak (`rounded-none`). Gunakan palet *Pure Monochrome* (`bg-white` dengan `border-4 border-zinc-950`). Tulisan menggunakan *monospace* yang menyerupai *blueprint* pabrik, ukuran ekstrem, dan *tracking* lebar. Segala desain UI yang ramah dan *bubbly* dilarang.
- **Motion (Emil-Skills):** Tombol main/jeda wajib menggunakan umpan balik fisika `active:scale-[0.97] transition-transform`. Transisi efek *hover* pada latar belakang harus *snappy* (tanpa jeda `duration` lambat).
- **Supabase Realtime:** Mempertahankan logika `supabase.channel('radio-room')` untuk melacak sesi pendengar aktif. Ini tidak perlu diubah, hanya memastikan keandalan *untrack* saat dihentikan.

## UI/UX Boundaries
- **Lokasi:** Tetap *fixed* di sudut kanan bawah, tetapi desainnya harus menyerupai panel instrumen atau tombol mesin pabrik.
- **Interaksi:** Tidak ada kontrol volume. Hanya *Play* dan *Pause*. Kesunyian (atau kebisingan terfokus) adalah pilihan biner mutlak.

## Success Criteria
- Modul berbentuk kotak tegas, tajam, dengan tipografi militer.
- Klik tombol terasa padat dan responsif.
- Indikator "X MENDENGARKAN" menggunakan huruf kapital *monospace* yang tegas.

## Open Questions
- Apakah kita ingin menambahkan efek *glitch* statis atau suara "klik mesin" setiap kali tombol ditekan, untuk menekankan nuansa mesin industri?
