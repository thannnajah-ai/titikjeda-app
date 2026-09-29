import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, TrendingDown } from 'lucide-react';

export default function BlindSpot() {
  const [score, setScore] = useState('');
  const [campus, setCampus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!score || !campus) return;

    setLoading(true);
    try {
      const prompt = `User adalah siswa UTBK. Skor TO terakhir: ${score}. Target kampus/jurusan: ${campus}.
Tugas lu: Kasih tamparan realita yang obyektif dan instruksi Pareto 80/20. Jika skornya kurang jauh, bilang secara brutal bahwa dia harus kejar materi spesifik. 
Syarat:
1. Singkat (Maksimal 3-4 kalimat).
2. Gaya bahasa lu gue (kating galak tapi peduli).
3. Jangan pakai emoji berlebihan.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TitikJeda'
        },
        body: JSON.stringify({
          model: 'inclusionai/ling-3.0-flash-fin:free',
          messages: [{ role: 'system', content: prompt }]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setResult(data.choices[0].message.content.trim());
      }
    } catch (error) {
      setResult('Error menghubungi AI. Lu lagi hoki nggak diroasting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto space-y-8"
    >
      <div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-950 uppercase mb-2">Titik Buta</h2>
        <p className="text-zinc-600 font-mono font-bold uppercase tracking-widest text-xs md:text-sm">Kalkulator realita. Masukkan skor lu dan target lu. Jangan baper kalau jawabannya pedas.</p>
      </div>

      <form onSubmit={handleCheck} className="space-y-6 bg-white border-4 md:border-[8px] border-zinc-950 p-4 sm:p-6 md:p-8">
        <div>
          <label className="block text-xs md:text-sm font-black text-zinc-950 mb-2 uppercase tracking-widest">Skor TO Terakhir</label>
          <input 
            type="number" 
            inputMode="numeric"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="CONTOH: 450"
            className="w-full bg-zinc-50 border-4 border-zinc-950 rounded-none px-4 py-3 focus:outline-none focus:bg-white focus:ring-0 text-zinc-950 font-mono font-bold text-base md:text-lg uppercase placeholder-zinc-300"
          />
        </div>
        <div>
          <label className="block text-xs md:text-sm font-black text-zinc-950 mb-2 uppercase tracking-widest">Target Kampus & Jurusan</label>
          <input 
            type="text" 
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            placeholder="CONTOH: STEI ITB"
            className="w-full bg-zinc-50 border-4 border-zinc-950 rounded-none px-4 py-3 focus:outline-none focus:bg-white focus:ring-0 text-zinc-950 font-mono font-bold text-base md:text-lg uppercase placeholder-zinc-300"
          />
        </div>

        <button 
          type="submit"
          disabled={loading || !score || !campus}
          className="w-full bg-zinc-950 text-white font-black py-4 text-base md:text-xl uppercase tracking-widest active:scale-[0.97] transition-transform disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'MENGHITUNG...' : 'TAMPAR GUE DENGAN REALITA'}
        </button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white border-l-8 border-red-600 border-y-4 border-r-4 border-zinc-950 p-6"
          >
            <div className="flex items-start gap-4">
              <TrendingDown className="w-8 h-8 text-red-600 shrink-0 mt-1" strokeWidth={3} />
              <p className="text-zinc-950 font-mono font-bold uppercase leading-relaxed text-sm md:text-base">
                {result}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
