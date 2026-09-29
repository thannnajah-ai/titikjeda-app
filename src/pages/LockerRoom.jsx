import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

export default function LockerRoom() {
  const bloodOath = useAppStore(state => state.bloodOath);
  
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
            className="p-6 border-4 border-zinc-950 bg-white hover:bg-zinc-950 hover:text-white group active:scale-[0.97] transition-transform flex flex-col cursor-pointer"
          >
            <h3 className="font-black uppercase text-xl mb-2 text-zinc-950 group-hover:text-white">{item.title}</h3>
            <p className="text-sm text-zinc-600 group-hover:text-zinc-300 font-mono font-bold uppercase leading-relaxed mb-6 flex-1">{item.desc}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); alert('Materi Cheat-Sheet untuk ' + item.title + ' sedang disusun. Nantikan update berikutnya!'); }}
              className="text-sm font-black uppercase text-zinc-950 group-hover:text-white bg-zinc-200 group-hover:bg-zinc-800 px-4 py-2 self-start active:scale-[0.97] transition-transform"
            >
              LIHAT CHEAT-SHEET
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
    </motion.div>
  );
}
