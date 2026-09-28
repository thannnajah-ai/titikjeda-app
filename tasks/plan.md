# Plan: TitikJeda v2.0 (The Empathy Update)

## Architecture & Dependencies
1. **Supabase**: Butuh `@supabase/supabase-js` untuk manajemen WebSocket (Realtime).
2. **Zustand Persist**: Menggunakan `zustand/middleware` untuk menyimpan *state* memori ke LocalStorage.

## Implementation Order
1. **Setup Supabase & Dependencies**
   - Install package Supabase.
   - Buat `src/lib/supabase.js`.
   - Setup Environment Variables (Supabase URL & Anon Key).

2. **The Void (Supabase Realtime)**
   - Integrasikan `supabase.channel` ke `TheVoid.jsx`.
   - Gunakan fitur `broadcast` untuk mengirim event "Hug" antar klien.
   - Gunakan fitur `presence` untuk menghitung jumlah *user* yang sedang menatap The Void.

3. **AI Memory Store (Zustand)**
   - Buat `src/store/useChatStore.js` menggunakan *persist middleware*.
   - Simpan `aiMemory` (ringkasan 1 kalimat) dan `chatHistory` harian.

4. **Bilik Konsultasi (Summary Logic)**
   - Tambahkan tombol "Akhiri Sesi & Simpan Ingatan".
   - Saat diklik, panggil API OpenRouter dengan *prompt* khusus untuk men- *generate* kesimpulan 1 kalimat berdasarkan riwayat chat hari itu.
   - Simpan kesimpulan tersebut ke `useChatStore`.

5. **Bilik Konsultasi (Context Injection)**
   - Saat halaman dibuka keesokan harinya, masukkan `aiMemory` dari Zustand ke dalam *System Prompt* utama OpenRouter.
