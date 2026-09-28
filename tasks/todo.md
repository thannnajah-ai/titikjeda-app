- [ ] Task 1: Setup Supabase
  - Acceptance: Package `@supabase/supabase-js` ter-install, client terkonfigurasi di `src/lib/supabase.js`, env tersambung.
  - Verify: Web tidak error saat di-start.
  - Files: `package.json`, `.env`, `src/lib/supabase.js`

- [ ] Task 2: Implementasi Realtime The Void
  - Acceptance: Angka 'Hug' dan 'Online Users' terhubung ke channel Supabase (Broadcast & Presence).
  - Verify: Buka 2 tab browser, klik Hug di tab 1, angka di tab 2 ikut bertambah secara instan.
  - Files: `src/pages/TheVoid.jsx`

- [ ] Task 3: Setup Zustand Persist untuk AI Memory
  - Acceptance: File `useChatStore.js` dibuat dan bisa menyimpan data string ke LocalStorage.
  - Verify: Data string tidak hilang saat di-refresh.
  - Files: `src/store/useChatStore.js`

- [ ] Task 4: Logika Generate Summary AI
  - Acceptance: Tombol "Akhiri Sesi" memanggil API dengan prompt "Berikan ringkasan 1 kalimat" lalu menyimpannya ke Zustand.
  - Verify: Cek console / local storage untuk melihat hasil ringkasan.
  - Files: `src/pages/BilikKonsultasi.jsx`

- [ ] Task 5: Context Injection AI
  - Acceptance: Ringkasan dari hari sebelumnya disuntikkan ke System Prompt AI.
  - Verify: Minta pengguna melakukan tes ngobrol, lalu tanya "Apakah kamu ingat apa yang saya rasakan kemarin?".
  - Files: `src/pages/BilikKonsultasi.jsx`
