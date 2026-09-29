# Spec: Blood Oath (Sumpah Darah)

## Objective
Mengikat pengguna secara psikologis dengan komitmen belajar mereka sendiri. Pengguna diwajibkan menyetujui "kontrak" keras dan membubuhkan tanda tangan digital secara manual (menggunakan kursor/jari). Setelah disetujui, tanda tangan ini akan terpaku permanen di dashboard sebagai pengingat konstan akan komitmen awal mereka dan tidak bisa dihapus.

## Tech Stack
- **Framework:** React + Vite
- **Styling & Design (Taste-Skills):** Tailwind CSS v4. Tema *Pure Monochrome + Saturated Pop* (salah satu alternatif sah di panduan Taste). Background kanvas menggunakan warna putih absolut (`bg-white`) dengan bingkai hitam legam (`border-zinc-950`), dan SATU titik warna terang untuk penekanan (misal: tombol "SAH" berwarna *Electric Red* terang, BUKAN oxblood/merah bata yang dilarang). *Banned*: Kombinasi warna krem/bone/kertas hangat dengan merah darah gelap (melanggar aturan *Premium-Consumer Palette Ban*).
- **Motion (Emil-Skills):** `motion/react`. Interaksi sentuh/mouse pada kanvas akan dipadukan dengan *Spring Animations* kustom (`{ type: "spring", bounce: 0.2, duration: 0.5 }`) saat form kontrak muncul, sehingga terasa seperti meletakkan lembar fisik di atas meja. Tombol wajib menggunakan efek tekan instan `scale: 0.97` pada status `:active` untuk merespons klik dengan cepat (tidak boleh ada `transition: all`).
- **Canvas:** Paket *react-signature-canvas* untuk presisi coretan (terutama di layar sentuh).
- **State/Storage (Online):** Menggunakan **Supabase Storage** untuk menyimpan *file* gambar tanda tangan secara *online* di *cloud*. URL gambar yang dihasilkan (atau Base64-nya) kemudian akan dicatat di *database* Supabase (atau minimal disimpan di Zustand lokal yang mengambil dari tautan Supabase tersebut). Ini memungkinkan jejak komitmen pengguna terekam abadi di server, bukan hanya di *browser* yang bisa terhapus jika *clear cache*.

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Project Structure
- `src/components/BloodOath.jsx` → UI Utama untuk halaman Sumpah Darah (teks kontrak + Canvas).
- `src/components/OathCertificate.jsx` → Komponen *read-only* yang merender gambar Base64 tanda tangan di atas teks janji (terpaku di dashboard/LockerRoom).
- `src/store/useAppStore.js` → Akan ditambahkan atribut baru: `oathSignature` (string base64 | null).

## Code Style
```jsx
// Menyimpan tanda tangan ke global store
const handlePledge = () => {
  if (sigCanvas.isEmpty()) return;
  const dataURL = sigCanvas.getTrimmedCanvas().toDataURL('image/png');
  setOathSignature(dataURL);
};
```

## Testing Strategy
- **Canvas Validation**: Memastikan form tanda tangan tidak bisa dikirim jika *canvas* masih kosong (pengguna belum mencoret apa pun).
- **Persistence**: Melakukan *refresh* (F5) pada *browser*, tanda tangan yang telah tersimpan di `OathCertificate` tidak boleh hilang.

## Boundaries
- **Selalu**: Pastikan *Clear Button* disediakan di dalam modul kanvas, kalau pengguna merasa tanda tangannya jelek sebelum disimpan.
- **Tanya Dulu**: Jika ada kendala kompabilitas kanvas di perangkat *mobile* saat menggunakan *library* pihak ketiga.
- **Jangan Pernah**: Memberikan tombol "Hapus Sumpah" atau "Ganti Tanda Tangan" setelah kontrak disahkan. Sifatnya *immutable* (sekali seumur hidup aplikasi).

## Success Criteria
- Modul *Canvas* dapat dicoret dengan kursor (desktop) maupun sentuhan jari (mobile).
- Saat menekan tombol "Sah", coretan diubah menjadi gambar (Base64) dan disimpan ke *Local Storage*.
- Halaman UI berubah bentuk dari Mode Penandatanganan (Interaktif) menjadi Mode Sertifikat (Permanen Read-Only) begitu *state* `oathSignature` terisi.

## Open Questions
- Apakah kita ingin menambahkan *library* `react-signature-canvas`, atau murni membuat sistem *tracking path/mouse event* sendiri dengan *React Refs* + HTML5 `<canvas>` demi menghindari menambah *dependency* baru? (Saya sarankan memakai `react-signature-canvas` agar lebih stabil di layar sentuh).
