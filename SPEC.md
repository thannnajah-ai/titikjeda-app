# Spec: TitikJeda v2.0 (The Empathy Update)

## Objective
Melanjutkan fondasi MVP v1.0, TitikJeda v2.0 berfokus pada dua peningkatan psikologis inti untuk membantu pejuang UTBK:
1. **AI Persistent Memory**: Bilik Konsultasi (AI) dapat mengingat rekam jejak emosional dan progres belajar pengguna dari sesi sebelumnya (tanpa server, murni *local storage*).
2. **The Void Real-Time**: Halaman The Void ditingkatkan menjadi *multiplayer realtime* anonim menggunakan **Supabase**. Angka tekanan dan pelukan (Hug) tersinkronisasi se-Indonesia.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS (Palet Stone/Warm Monochrome)
- **State & Storage**: Zustand (dilengkapi `persist` middleware untuk memori lokal)
- **BaaS (Backend as a Service)**: Supabase (khusus fitur *Realtime Channel/Presence*)
- **AI**: OpenRouter API (`inclusionai/ling-3.0-flash-fin:free`)

## Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Dev: `npm run dev`

## Project Structure (Perubahan)
- `src/store/useChatStore.js` → (Baru) State khusus untuk manajemen memori AI jangka panjang.
- `src/lib/supabase.js` → (Baru) Konfigurasi *client* Supabase.
- `src/pages/TheVoid.jsx` → (Update) Menyambungkan UI lama dengan WebSockets Supabase.

## Code Style
```javascript
// Contoh: Zustand dengan persist untuk memori AI agar tidak hilang saat refresh
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
  persist(
    (set) => ({
      userContext: "Belum ada data progres.",
      updateContext: (newContext) => set({ userContext: newContext }),
    }),
    { name: 'titikjeda-ai-memory' } // Disimpan aman di IndexedDB/LocalStorage browser
  )
);
```

## Testing Strategy
- **The Void**: Diuji dengan membuka dua jendela *browser* (Incognito & Normal). Saat satu sisi menekan tombol "Hug", sisi lain harus ter- *update* dalam < 500ms.
- **AI Memory**: Diuji dengan mengirim pesan, me- *refresh* halaman secara paksa, dan memastikan AI masih "ingat" topik pembicaraan terakhir.

## Boundaries
- **Selalu**: Menjaga anonimitas 100%. Tidak ada fitur Registrasi/Login.
- **Tanya Dulu**: Menambah dependensi pihak ketiga (NPM package) yang besar.
- **Jangan Pernah**: Menyimpan percakapan pribadi pengguna (Chat AI) ke dalam *database* Supabase. Semua chat dan memori AI **harus** tetap diamankan secara lokal di *browser* masing-masing anak. Supabase HANYA untuk penghitung angka *The Void*.

## Success Criteria
1. Pengguna membuka ulang web keesokan harinya, dan AI bisa menyapa berdasarkan riwayat keluh-kesahnya kemarin.
2. The Void menampilkan angka partisipan yang aktif (*online presence*) secara nyata (bukan *hardcode*).

## Open Questions
1. Untuk memori AI: Apakah lebih baik menyimpan **seluruh riwayat chat** (boros token API), atau kita minta AI membuat **kesimpulan/ringkasan (summary)** di akhir sesi untuk dijadikan memori di sesi berikutnya?
2. Kunci Supabase perlu dimasukkan. Apakah Anda sudah membuat akun Supabase?
