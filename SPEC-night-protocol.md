# Spec: Night Protocol (Protokol Jam 2 Pagi)

## Objective
Menghentikan kebiasaan belajar *zombie* (begadang yang tidak produktif). Pada rentang waktu 01.00 hingga 04.00 waktu lokal, pengguna tidak dapat menggunakan aplikasi sama sekali. Sistem akan menampilkan layar peringatan tegas yang memaksa mereka untuk tidur.

## Tech Stack
- **Framework:** React + Vite
- **Styling & Design (Taste):** Tailwind CSS. Mengikuti gaya "Dark Tech / Brutalist" (Background hitam pekat/off-black, kontras tinggi, tipografi tajam untuk kesan intervensi tegas). *Banned*: Efek *glassmorphism*, warna pastel, atau gradien generic AI.
- **Motion (Emil-Skills):** `motion/react` untuk animasi *overlay*. Animasi menggunakan kurva *ease-out* kustom (`cubic-bezier(0.23, 1, 0.32, 1)`) agar terasa instan dan *responsive* (< 300ms). Layar muncul dengan kombinasi `opacity: 0` dan `scale: 0.98` (tidak pernah muncul dari `scale(0)`).
- **Time Check:** Standard JavaScript `Date` API (Client-side)

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Project Structure
- `src/components/NightProtocol.jsx` → Komponen *overlay* layar penuh yang menangani logika pencegatan waktu dan tampilan teguran.
- `src/App.jsx` → Membungkus komponen utama dengan `NightProtocol` agar berlaku secara global.

## Code Style
Menggunakan komponen fungsional yang membungkus `children`.

```jsx
// Contoh pola
export default function NightProtocol({ children }) {
  const isNight = checkIsNight(); // helper return boolean

  if (isNight) {
    return <div className="fixed inset-0 bg-black text-red-500 z-50">Tidur.</div>;
  }
  return <>{children}</>;
}
```

## Testing Strategy
- **Manual Toggling**: Akan disediakan variabel boolean sementara di lingkungan Dev (seperti `const FORCE_NIGHT = true`) untuk menguji tampilan secara instan tanpa harus menunggu jam 1 pagi.
- **Visual Check**: Pastikan z-index cukup tinggi agar tidak ada komponen lain (modal, navbar) yang bisa "menembus" layar peringatan ini.

## Boundaries
- **Selalu**: Pastikan interval pengecekan waktu berjalan dinamis (misal, setiap 1 menit sekali nge-cek jam). Jika pengguna bermain sampai jam 00:59, pada jam 01:00 layar harus otomatis menutup paksa aplikasinya tanpa perlu *refresh*.
- **Tanya Dulu**: Jika membutuhkan *library* pihak ketiga untuk validasi *time zone*.
- **Jangan Pernah**: Membuat tombol "Lewati (Skip)" atau "Saya masih ingin belajar". Ini harus bersifat mutlak tak terbantahkan.

## Success Criteria
- Layar menjadi hitam penuh dengan teks teguran yang tajam saat jam komputer menunjukkan rentang 01:00 hingga 03:59.
- Tidak ada akses sama sekali ke fitur aplikasi yang tertutup.
- Otomatis kembali normal begitu waktu menginjak pukul 04:00.

## Open Questions
- Berapa interval waktu pengecekan (setInterval) yang ideal agar layar langsung ter-blokir tanpa membuat aplikasi menjadi berat? (Saya usulkan pengecekan setiap 10.000 ms atau 10 detik).
