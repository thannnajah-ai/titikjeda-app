import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, TrendingDown, AlertOctagon, CheckCircle2 } from 'lucide-react';

const analyzeReality = (scoreNum, campusTarget) => {
  const targetLower = (campusTarget || '').toLowerCase();
  
  // Estimasi passing grade rata-rata kampus tier atas
  let targetThreshold = 660;
  if (targetLower.includes('itb') || targetLower.includes('ui') || targetLower.includes('ugm')) {
    targetThreshold = 690;
  } else if (targetLower.includes('its') || targetLower.includes('unair') || targetLower.includes('undip') || targetLower.includes('unpad') || targetLower.includes('brawijaya') || targetLower.includes('ub')) {
    targetThreshold = 640;
  }

  const gap = targetThreshold - scoreNum;

  if (scoreNum >= targetThreshold + 20) {
    return {
      status: 'ZONA AMAN SEMENTARA',
      statusColor: 'text-emerald-600',
      borderColor: 'border-emerald-600',
      bgTag: 'bg-emerald-600 text-white',
      message: `Skor lu ${scoreNum} udah melampaui estimasi passing grade ${campusTarget} (~${targetThreshold}). Tapi jangan sombong dulu; UTBK itu arena saling sikut antar orang pintar yang selisih nilainya cuma koma di sistem IRT. Terapkan Pareto 80/20: sikat habis 20% tipe soal paling krusial di Penalaran Matematika dan Literasi Inggris yang jadi penentu ranking atas. Lengah sehari lu bisa kegusur ribuan orang!`
    };
  } else if (scoreNum >= targetThreshold - 40) {
    return {
      status: 'ZONA PERSAINGAN KETAT',
      statusColor: 'text-amber-600',
      borderColor: 'border-amber-500',
      bgTag: 'bg-amber-500 text-black',
      message: `Skor ${scoreNum} buat masuk ${campusTarget} (estimasi ~${targetThreshold}) masih di zona abu-abu: tipis antara tembus dan terpental (gap ${gap > 0 ? '-' + gap : '+' + Math.abs(gap)} poin). Lu masih sering buang energi di 80% materi receh. Mulai sekarang fokus kuasai 20% materi dengan frekuensi kemunculan tertinggi (Fungsi Kuadrat, Silogisme kategorial, & Kalimat Efektif PUEBI) biar nilai lu terdongkrak menembus batas aman 720+!`
    };
  } else if (scoreNum >= 500) {
    return {
      status: 'ZONA RAWAN GAGAL',
      statusColor: 'text-red-600',
      borderColor: 'border-red-600',
      bgTag: 'bg-red-600 text-white',
      message: `Realita objektif: skor ${scoreNum} dengan target ${campusTarget} itu gap-nya masih lebar (${gap} poin di bawah rata-rata aman). Berhenti coba-coba latihan soal tingkat dewa yang bikin minder; kuasai dulu 20% konsep fundamental Pareto yang PASTI keluar di UTBK (aljabar dasar, penarikan kesimpulan modus ponens/tollens, dan ide pokok teks). Wajib selesaikan minimal 3 paket soal tuntas per hari!`
    };
  } else {
    return {
      status: 'ALARM BAHAYA MUTLAK',
      statusColor: 'text-red-600',
      borderColor: 'border-red-600',
      bgTag: 'bg-red-600 text-white',
      message: `Alarm bahaya: skor ${scoreNum} itu sinyal darurat jika target lu tetap ${campusTarget}. Kalau pola belajar lu masih pasif kayak zombie scrolling medsos, mimpi ini bakal tamat sebelum ujian dimulai. Lu kehilangan poin di soal-soal termudah yang seharusnya jadi lumbung nilai. Stop semua distraksi, matikan notifikasi HP, dan mulai babat konsep dasar dari nol sekarang juga!`
    };
  }
};

export default function BlindSpot() {
  const [score, setScore] = useState('');
  const [campus, setCampus] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!score || !campus) return;

    setLoading(true);
    setResultData(null);

    const scoreNum = Number(score);
    const localAnalysis = analyzeReality(scoreNum, campus);

    // Timeout cepat 3.5 detik untuk API eksternal agar UI tidak pernah macet
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const prompt = `User adalah siswa pejuang UTBK. Skor TO: ${score}. Target kampus: ${campus}.
Kasih tamparan realita objektif dan instruksi Pareto 80/20 tajam singkat (3 kalimat) gaya lu-gue kating galak tapi peduli.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TitikJeda'
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-3.5-lightning:free',
          messages: [{ role: 'system', content: prompt }]
        })
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (response.ok && data.choices && data.choices[0]?.message?.content) {
        setResultData({
          ...localAnalysis,
          message: data.choices[0].message.content.trim()
        });
      } else {
        setResultData(localAnalysis);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn("Fast Pareto Reality Engine activated:", error.name);
      setResultData(localAnalysis);
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
        {resultData && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`bg-white border-l-8 ${resultData.borderColor} border-y-4 border-r-4 border-zinc-950 p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-mono`}
          >
            <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-3 mb-4">
              <span className={`text-xs font-black uppercase px-2.5 py-1 ${resultData.bgTag}`}>
                {resultData.status}
              </span>
              <span className="text-xs font-bold text-zinc-500 uppercase">
                TARGET: {campus.toUpperCase()}
              </span>
            </div>

            <div className="flex items-start gap-4">
              <TrendingDown className="w-7 h-7 text-red-600 shrink-0 mt-0.5" strokeWidth={3} />
              <p className="text-zinc-950 font-bold uppercase leading-relaxed text-sm md:text-base whitespace-pre-line">
                {resultData.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
