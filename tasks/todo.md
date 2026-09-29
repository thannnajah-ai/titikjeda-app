# TODO: Anti-Zombie / Alibi

- [x] Task 1: Refactor UI ke Layar Penuh Industrial Brutalist
  - Acceptance: `AlibiJournal.jsx` berubah dari *modal* tembus pandang menjadi layar penuh hitam pekat (`bg-zinc-950`). Kotak input berbentuk persegi kaku (`rounded-none`), dengan garis pembatas tebal. Animasi pelan dihapus.
  - Verify: Muat aplikasi, *AlibiJournal* harus mengurung layar sepenuhnya bagaikan terminal interogasi. Tidak bisa diklik di luarnya untuk kabur.
  - Files: `src/components/AlibiJournal.jsx`

- [x] Task 2: Implementasi Logika "Anti-Gibberish" & Emil's Motion
  - Acceptance: Syarat validasi `logText.length >= 20` DAN `logText.split(' ').length > 3` (minimal 3 spasi). Jika gagal, *alert* bawaan diganti dengan tulisan peringatan merah tajam di bawah kotak input. Tombol simpan menggunakan efek `active:scale-[0.97]`.
  - Verify: Tes isi asal-asalan (tanpa spasi), sistem harus menolak. Tes isi kalimat utuh, sistem menerima dan layar interogasi hilang.
  - Files: `src/components/AlibiJournal.jsx`
