# Plan: Anti-Zombie / Alibi (Modul 5)

## 1. Komponen Utama
- `src/components/AlibiJournal.jsx`: Membongkar total desain modal pop-up lama menjadi benteng interogasi layar penuh (Industrial Brutalist).
- Logika Validasi: Menyempurnakan pengecekan string dengan regex sederhana (panjang >= 20 dan jumlah spasi >= 3).

## 2. Urutan Implementasi
1. **Refaktor UI & Styling:** 
   - Hapus `backdrop-blur` dan ganti menjadi latar belakang `bg-zinc-950` solid (hitam mutlak tanpa tembus pandang).
   - Ubah wadah (*container*) `AlibiJournal` menjadi layar penuh tanpa tombol silang (tidak bisa di-*close* kecuali valid).
   - Ubah *textarea* menjadi gaya mesin ketik (monokrom, *border* tebal, tulisan *monospace* tajam).
2. **Injeksi Emil's Motion:** 
   - Pastikan kemunculan *AlibiJournal* instan (menghapus *framer-motion* transisi lambat yang tidak perlu).
   - Tombol "SIMPAN JURNAL" menggunakan respons padat `active:scale-[0.97]` tanpa transisi perlambatan warna.
3. **Penyempurnaan Validasi:**
   - Menambahkan pengecekan: `logText.split(' ').length > 3`.
   - Mengganti `alert()` standar *browser* dengan penandaan visual brutalist (misal: warna *border* berubah jadi merah tajam dan teks peringatan menyala jika gagal).

## 3. Checkpoint Verifikasi
- Aplikasi dimuat untuk hari pertama.
- Layar tertutup balok hitam interogasi.
- Ketik "asdasdasdasd", klik simpan -> Ditolak karena kurang spasi.
- Ketik "Aku mau belajar matriks hari ini", klik simpan -> Lolos, aplikasi terbuka.
