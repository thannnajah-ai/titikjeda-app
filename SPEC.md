# Capability Map: TitikJeda V3.0 (The Stoic Update)

| Module id | Responsibility | Depends on |
|---|---|---|
| `night-protocol` | Pemblokiran aplikasi jam 01.00-04.00 (mengurangi binge-learning) | — |
| `blood-oath` | Tanda tangan digital dan komitmen permanen di dashboard | — |
| `silent-radio` | Sinkronisasi Supabase Realtime & Audio untuk white-noise komunal | `supabase-core` |
| `anti-zombie` | Intervensi Jurnal Alibi (prompt refleksi wajib setiap 90 menit) | — |
| `one-question` | Penyajian satu soal UTBK tersulit per hari (tanpa akses ulang) | — |
| `reality-check` | Kalkulator jarak skor + LLM Evaluasi keras (Titik Buta) | `openrouter-core` |

**Build order**: `night-protocol`, `blood-oath` → `silent-radio`, `one-question` → `anti-zombie`, `reality-check`

---
*Catatan: File ini sekarang berfungsi sebagai daftar indeks Capability Map sesuai standar Phase 0 spec-driven-development. Setiap modul akan memiliki file spesifikasi independen masing-masing (contoh: `SPEC-night-protocol.md`).*
