import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { X, BookOpen, AlertTriangle } from 'lucide-react';
import HabitHeatmap from '../components/HabitHeatmap';
import SoundscapeMixer from '../components/SoundscapeMixer';

const CHEAT_SHEETS = [
  {
    id: 'pu',
    code: 'DOK-01 // PU',
    title: 'Penalaran Umum',
    desc: 'Logika Silogisme, Analitik, & Pola Bilangan.',
    sections: [
      {
        heading: '1. Tiga Hukum Penarikan Kesimpulan Mutlak',
        rules: [
          { label: 'Modus Ponens', formula: 'Premis: (p → q) & (p)  ==>  Kesimpulan: (q)', note: 'Jika p terjadi, maka q pasti terjadi.' },
          { label: 'Modus Tollens', formula: 'Premis: (p → q) & (~q) ==>  Kesimpulan: (~p)', note: 'Jika q tidak terjadi, maka p pasti tidak terjadi.' },
          { label: 'Silogisme', formula: 'Premis: (p → q) & (q → r) ==> Kesimpulan: (p → r)', note: 'Rantai sebab-akibat langsung.' },
        ],
        warning: 'JEBAKAN UTAMA: Jika p → q, dan diketahui ~p (p tidak terjadi), maka TIDAK DAPAT DISIMPULKAN ~q (q bisa saja tetap terjadi karena sebab lain).'
      },
      {
        heading: '2. Hukum Kuantor (Semua vs Sebagian)',
        rules: [
          { label: 'Semua (Universal)', formula: 'Semua anggota kelompok A memiliki sifat B.', note: 'Ingkaran: "Ada minimal satu anggota A yang TIDAK memiliki sifat B".' },
          { label: 'Sebagian / Beberapa', formula: 'Minimal ada satu anggota (≥ 1).', note: 'PERINGATAN: "Sebagian" BUKAN berarti "tidak semuanya". Jika semua A adalah B, pernyataan "sebagian A adalah B" tetap BENAR secara logika formal.' }
        ]
      },
      {
        heading: '3. Pola Barisan & Deret Cepat',
        rules: [
          { label: 'Uji Selisih Bertingkat', formula: 'Larik 1: beda beraturan (+2, +4, +6...). Larik 2: percepatan beda (+2, +2...).' },
          { label: 'Pola Melompat (Interleaved)', formula: 'Uji suku ganjil (1, 3, 5) dan suku genap (2, 4, 6) secara terpisah bila angka berfluktuasi naik-turun.' },
          { label: 'Operasi Campuran', formula: 'Pola berulang dua operasi bergantian: (×2, -3, ×2, -3).' }
        ]
      }
    ]
  },
  {
    id: 'pk',
    code: 'DOK-02 // PK',
    title: 'Pengetahuan Kuantitatif',
    desc: 'Fungsi Kuadrat, Peluang, & Statistika Dasar.',
    sections: [
      {
        heading: '1. Fungsi Kuadrat & Diskriminan (D = b² - 4ac)',
        rules: [
          { label: 'D > 0', formula: 'Grafik memotong sumbu-X di 2 titik berbeda real.' },
          { label: 'D = 0', formula: 'Grafik menyinggung sumbu-X di 1 titik (akar kembar).' },
          { label: 'D < 0', formula: 'Grafik tidak pernah memotong sumbu-X.' },
          { label: 'Definit Positif / Negatif', formula: 'D < 0 dan a > 0 ==> Selalu di atas sumbu-X (positif). D < 0 dan a < 0 ==> Selalu di bawah sumbu-X (negatif).' },
          { label: 'Titik Puncak (Xp, Yp)', formula: 'Xp = -b / (2a)  |  Yp = -D / (4a) atau f(Xp)' }
        ]
      },
      {
        heading: '2. Rumus Aljabar Sakti (Hemat 2 Menit)',
        rules: [
          { label: 'Selisih Kuadrat', formula: 'a² - b² = (a - b)(a + b)', note: 'Gunakan untuk menyederhanakan pecahan rumit seketika.' },
          { label: 'Kuadrat Suku Dua', formula: '(a ± b)² = a² ± 2ab + b²', note: 'Ingat: a² + b² = (a + b)² - 2ab' },
          { label: 'Selisih Pangkat Tiga', formula: 'a³ - b³ = (a - b)(a² + ab + b²)' }
        ]
      },
      {
        heading: '3. Kombinatorika & Pengaruh Transformasi Data',
        rules: [
          { label: 'Permutasi vs Kombinasi', formula: 'Urutan penting (Ketua/Wakil) = P(n, r) = n!/(n-r)! | Urutan bebas (Delegasi) = C(n, r) = n!/[r!(n-r)!]' },
          { label: 'Operasi Tambah/Kurang Data (+k)', formula: 'Rata-rata & Median BERUBAH (+k). Jangkauan & Simpangan Baku TETAP (tidak berubah!).' },
          { label: 'Operasi Kali/Bagi Data (×k)', formula: 'SEMUA ukuran pemusatan dan penyebaran (Mean, Median, Jangkauan, Simpangan) DIKALI k.' }
        ]
      }
    ]
  },
  {
    id: 'pbi',
    code: 'DOK-03 // LITINDO',
    title: 'Literasi Bahasa Indonesia',
    desc: 'Ide Pokok, Simpulan Teks, & Majas.',
    sections: [
      {
        heading: '1. Menemukan Gagasan Utama (Teknik Cepat)',
        rules: [
          { label: 'Paragraf Deduktif (Awal)', formula: 'Kalimat 1 adalah induk pikiran. Kalimat 2 berisi kata repetisi atau kata rujukan ("hal ini", "tersebut", "ia").' },
          { label: 'Paragraf Induktif (Akhir)', formula: 'Kalimat terakhir memuat konjungsi kesimpulan ("oleh karena itu", "dengan demikian", "jadi").' },
          { label: 'Penyaring Jawaban Salah', formula: 'Coret opsi yang "Terlalu Sempit" (hanya satu fakta penjelas) atau "Terlalu Luas" (melampaui topik bacaan).' }
        ]
      },
      {
        heading: '2. Inferensi Teks vs Asumsi Liar',
        rules: [
          { label: 'Hukum Pembuktian Teks', formula: 'Kesimpulan tersirat HARUS 100% didukung oleh data teks. Jangan memakai logika luar yang tidak tertulis!' },
          { label: 'Sikap / Nada Penulis (Tone)', formula: 'Objektif (fakta murni), Kritis (menyoroti kelemahan/risiko), Optimistis (menaruh harapan positif).' }
        ]
      },
      {
        heading: '3. Kalimat Efektif & PUEBI Krusial',
        rules: [
          { label: 'Wajib Ber-Subjek & Ber-Predikat', formula: 'Hindari kalimat buntung akibat subjek didahului preposisi ("Dalam penelitian ini menemukan..." -> SALAH. Hapus "Dalam").' },
          { label: 'Jebakan Perluasan "Yang"', formula: '"Siswa yang belajar di perpustakaan..." bukan kalimat utuh jika tidak ada predikat lanjutan.' },
          { label: 'Konjungsi Intrakalimat', formula: '"Sehingga", "sedangkan", "karena" TIDAK BOLEH diletakkan di awal kalimat setelah titik.' }
        ]
      }
    ]
  },
  {
    id: 'pbe',
    code: 'DOK-04 // LITING',
    title: 'Literasi Bahasa Inggris',
    desc: 'Main Idea, Inference, & Synonym.',
    sections: [
      {
        heading: '1. Main Idea & Author Purpose Tactics',
        rules: [
          { label: 'Skimming Taktis', formula: 'Baca 2 kalimat awal paragraf 1 + kalimat pertama tiap paragraf isi + kalimat terakhir paragraf penutup.' },
          { label: 'Purpose Verbs', formula: 'To illustrate (memberi contoh nyata), To convince (meyakinkan opini), To explain (memaparkan mekanisme), To contrast (membandingkan dua kutub).' }
        ]
      },
      {
        heading: '2. Inference & Implication Questions',
        rules: [
          { label: 'Kata Kunci Soal', formula: '"It can be inferred from...", "The passage implies that...", "Which of the following is most likely true?"' },
          { label: 'Eliminasi Opsi Ekstrem', formula: 'Hindari opsi yang mengandung kata mutlak tanpa alasan kuat: always, never, completely, impossible, only.' },
          { label: 'Restatement Trap', formula: 'Jawaban yang benar untuk soal inferensi biasanya BUKAN copas kata demi kata dari teks, melainkan parafrase logis.' }
        ]
      },
      {
        heading: '3. Vocabulary in Context',
        rules: [
          { label: 'Makna Kontekstual vs Literal', formula: 'Kata diuji BUKAN definisi kamus dasarnya, melainkan maknanya dalam relasi kalimat tersebut.' },
          { label: 'Clue Kata Penghubung', formula: 'Perhatikan konjungsi kontras (however, although, despite) vs penjelas (moreover, in other words) di sekitar kata uji.' }
        ]
      }
    ]
  }
];

export default function LockerRoom() {
  const bloodOath = useAppStore(state => state.bloodOath);
  const [activeCheatSheet, setActiveCheatSheet] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveCheatSheet(null);
      }
    };
    if (activeCheatSheet) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeCheatSheet]);
  
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.05 }
        }
      }}
      className="space-y-12"
    >
      {bloodOath && (
        <motion.div 
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            show: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0, duration: 0.3 } }
          }}
          className="bg-zinc-100 text-zinc-950 border-[6px] border-zinc-950 p-6 rotate-1 max-w-sm mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          style={{ fontFamily: "monospace" }}
        >
          <div className="border-b-4 border-zinc-950 pb-2 mb-4 text-center">
            <h3 className="font-black text-xl uppercase tracking-widest">Sumpah Darah</h3>
            <p className="text-xs text-zinc-600 font-bold">{bloodOath.date}</p>
          </div>
          <p className="text-sm leading-relaxed mb-6 font-bold uppercase">{bloodOath.target}</p>
          <div className="border-t-4 border-zinc-950 pt-4 flex flex-col items-center">
            <img src={bloodOath.signature} alt="Tanda Tangan" className="h-16 object-contain mb-2 opacity-80 mix-blend-multiply" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">JANJI MENGIKAT</p>
          </div>
        </motion.div>
      )}

      {/* Heatmap Konsistensi & Streak Disiplin */}
      <div>
        <HabitHeatmap />
      </div>

      {/* Soundscape & Binaural Beats Synthesizer */}
      <div>
        <SoundscapeMixer />
      </div>

      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
        }}
      >
        <h2 className="text-4xl font-black tracking-tighter mb-2 text-zinc-950 uppercase">Pita Suara UTBK</h2>
        <p className="text-zinc-600 font-mono font-bold uppercase tracking-widest text-sm">Prinsip Pareto 80/20. Pelajari yang pasti keluar, lupakan sisanya.</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {CHEAT_SHEETS.map((item) => (
          <motion.div 
            key={item.id} 
            variants={{
              hidden: { opacity: 0, y: 10, scale: 0.98 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } }
            }}
            onClick={() => setActiveCheatSheet(item)}
            className="p-6 border-4 border-zinc-950 bg-white hover:bg-zinc-950 hover:text-white group active:scale-[0.97] transition-transform flex flex-col cursor-pointer"
          >
            <div className="text-xs font-mono font-black text-zinc-400 group-hover:text-zinc-400 uppercase tracking-widest mb-1">
              {item.code}
            </div>
            <h3 className="font-black uppercase text-xl mb-2 text-zinc-950 group-hover:text-white">{item.title}</h3>
            <p className="text-sm text-zinc-600 group-hover:text-zinc-300 font-mono font-bold uppercase leading-relaxed mb-6 flex-1">{item.desc}</p>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setActiveCheatSheet(item); 
              }}
              className="text-sm font-black uppercase text-zinc-950 group-hover:text-white bg-zinc-200 group-hover:bg-zinc-800 px-4 py-2 self-start active:scale-[0.97] transition-transform"
            >
              LIHAT CHEAT-SHEET ↗
            </button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.15 } }
        }}
        className="pt-12 border-t-8 border-zinc-950"
      >
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-zinc-950">Locker Room (Agregator Gratis)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'MathCyber1997', url: 'https://mathcyber1997.com/', desc: 'Blog kumpulan soal UTBK/SNBT & pembahasan.' },
            { name: 'Cerebrum.id', url: 'https://cerebrum.id/', desc: 'Menyediakan paket tryout SNBT gratis.' },
            { name: 'Pintarly', url: 'https://pintarly.id/', desc: 'Puluhan paket gratis dengan penilaian IRT.' },
            { name: 'SNBT.id', url: 'https://snbt.id/', desc: 'Latihan soal dan tryout daring.' }
          ].map((link, i) => (
            <motion.a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noreferrer"
              variants={{
                hidden: { opacity: 0, x: -10 },
                show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } }
              }}
              className="p-5 border-4 border-zinc-950 bg-zinc-50 hover:bg-zinc-950 hover:text-white active:scale-[0.97] transition-transform group flex flex-col"
            >
              <h3 className="font-black uppercase text-lg text-zinc-950 group-hover:text-white flex justify-between items-center">
                {link.name} <span>↗</span>
              </h3>
              <p className="text-xs text-zinc-500 group-hover:text-zinc-400 font-mono font-bold mt-2 uppercase">{link.desc}</p>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Industrial Brutalist Cheat-Sheet Modal */}
      <AnimatePresence>
        {activeCheatSheet && (
          <div 
            className="fixed inset-0 z-50 bg-zinc-950/85 flex items-center justify-center p-2.5 sm:p-4 md:p-6"
            onClick={() => setActiveCheatSheet(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[90dvh] bg-white border-4 md:border-8 border-zinc-950 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-zinc-950 text-white p-4 md:p-6 border-b-4 md:border-b-6 border-zinc-950 flex justify-between items-start gap-3">
                <div>
                  <div className="font-mono text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">
                    {activeCheatSheet.code}
                  </div>
                  <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                    {activeCheatSheet.title}
                  </h3>
                  <p className="text-xs font-mono font-bold uppercase text-zinc-300 mt-1.5 md:mt-2">
                    {activeCheatSheet.desc}
                  </p>
                </div>
                <button
                  onClick={() => setActiveCheatSheet(null)}
                  className="bg-white text-zinc-950 border-2 border-white px-2.5 py-1 font-mono font-black text-xs uppercase hover:bg-zinc-200 active:scale-[0.97] transition-transform flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" strokeWidth={3} />
                  <span>[ESC]</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-3.5 sm:p-4 md:p-6 space-y-4 md:space-y-6 font-mono overscroll-contain">
                {activeCheatSheet.sections.map((sec, idx) => (
                  <div key={idx} className="border-2 md:border-4 border-zinc-950 bg-zinc-50 p-3.5 sm:p-4 md:p-5">
                    <div className="bg-zinc-950 text-white font-mono font-black text-xs md:text-sm uppercase px-2.5 py-1 inline-block mb-3 md:mb-4">
                      {sec.heading}
                    </div>

                    <div className="space-y-2.5 md:space-y-3">
                      {sec.rules.map((rule, rIdx) => (
                        <div key={rIdx} className="bg-white border-2 border-zinc-950 p-2.5 sm:p-3">
                          <div className="text-[10px] md:text-[11px] font-black uppercase text-zinc-500 mb-1 tracking-wider">
                            // {rule.label}
                          </div>
                          <div className="text-xs sm:text-sm font-black text-zinc-950 leading-relaxed">
                            {rule.formula}
                          </div>
                          {rule.note && (
                            <div className="text-[11px] sm:text-xs font-bold text-zinc-700 mt-1.5 pt-1.5 border-t border-zinc-200">
                              ℹ {rule.note}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {sec.warning && (
                      <div className="mt-3 md:mt-4 border-l-4 md:border-l-6 border-red-600 bg-red-50 p-2.5 sm:p-3 flex gap-2 items-start">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <div className="text-xs font-black text-red-950 leading-relaxed uppercase">
                          {sec.warning}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="border-t-4 border-zinc-950 p-3 sm:p-4 bg-zinc-100 flex items-center justify-between font-mono">
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-zinc-500">
                  TITIKJEDA PROTOKOL 80/20
                </span>
                <button
                  onClick={() => setActiveCheatSheet(null)}
                  className="bg-zinc-950 text-white px-4 md:px-5 py-1.5 md:py-2 font-black text-xs uppercase tracking-wider hover:bg-zinc-800 active:scale-[0.97] transition-transform cursor-pointer"
                >
                  TUTUP DOKUMEN
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

