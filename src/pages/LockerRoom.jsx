import React from 'react';
import { motion } from 'framer-motion';

export default function LockerRoom() {
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
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
        }}
      >
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-stone-100">Pita Suara UTBK</h2>
        <p className="text-stone-400">Prinsip Pareto 80/20. Pelajari yang pasti keluar, lupakan sisanya.</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {[
          { title: 'Penalaran Umum', desc: 'Logika Silogisme, Analitik, & Pola Bilangan.' },
          { title: 'Pengetahuan Kuantitatif', desc: 'Fungsi Kuadrat, Peluang, & Statistika Dasar.' },
          { title: 'Literasi Bahasa Indonesia', desc: 'Ide Pokok, Simpulan Teks, & Majas.' },
          { title: 'Literasi Bahasa Inggris', desc: 'Main Idea, Inference, & Synonym.' },
        ].map((item, i) => (
          <motion.div 
            key={i} 
            variants={{
              hidden: { opacity: 0, y: 10, scale: 0.98 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } }
            }}
            className="p-6 rounded-2xl bg-stone-900 border border-stone-800/50 hover:bg-stone-800 active:scale-[0.98] transition-all hover:border-stone-700/50 flex flex-col"
          >
            <h3 className="font-semibold text-lg mb-2 text-stone-100">{item.title}</h3>
            <p className="text-sm text-stone-300 leading-relaxed mb-4 flex-1">{item.desc}</p>
            <button 
              onClick={() => alert('Materi Cheat-Sheet untuk ' + item.title + ' sedang disusun. Nantikan update berikutnya!')}
              className="text-sm font-medium text-stone-400 hover:text-stone-200 underline underline-offset-4 decoration-stone-700 hover:decoration-stone-400 transition-colors self-start"
            >
              Lihat Cheat-Sheet
            </button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.15 } }
        }}
        className="pt-8 border-t border-stone-800"
      >
        <h2 className="text-xl font-bold tracking-tight mb-4 text-stone-100">Locker Room (Agregator Gratis)</h2>
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
              className="p-4 rounded-xl border border-stone-800 bg-stone-900/50 hover:bg-stone-800 hover:border-stone-600 active:scale-[0.98] transition-all group flex flex-col"
            >
              <h3 className="font-semibold text-stone-200 group-hover:text-stone-50 transition-colors">{link.name} ↗</h3>
              <p className="text-xs text-stone-400 mt-1">{link.desc}</p>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
