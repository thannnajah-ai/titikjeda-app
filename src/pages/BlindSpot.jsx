import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, TrendingDown, AlertOctagon, CheckCircle2 } from 'lucide-react';

const analyzeReality = (scoreNum, campusTarget) => {
  const targetLower = (campusTarget || '').toLowerCase();
  
  // Deteksi estimasi passing grade rata-rata kampus
  let targetThreshold = 650;
  const campusClean = (campusTarget || 'KAMPUS TARGET').trim().toUpperCase();

  if (targetLower.includes('itb') || targetLower.includes('ui') || targetLower.includes('ugm')) {
    targetThreshold = 695;
  } else if (targetLower.includes('its') || targetLower.includes('unair') || targetLower.includes('undip') || targetLower.includes('unpad') || targetLower.includes('brawijaya') || targetLower.includes('ub')) {
    targetThreshold = 645;
  } else if (targetLower.includes('ipb') || targetLower.includes('uns') || targetLower.includes('upi') || targetLower.includes('unj') || targetLower.includes('unhas') || targetLower.includes('usu')) {
    targetThreshold = 615;
  } else {
    targetThreshold = 630;
  }

  const gap = targetThreshold - scoreNum;

  if (scoreNum >= targetThreshold + 25) {
    return {
      status: 'ZONA AMAN SEMENTARA',
      statusColor: 'text-emerald-600',
      borderColor: 'border-emerald-600',
      bgTag: 'bg-emerald-600 text-white',
      message: `Skor lu ${scoreNum} udah surplus +${scoreNum - targetThreshold} poin di atas estimasi batas aman ${campusClean} (~${targetThreshold}). Tapi jangan keburu jumawa; di sistem IRT UTBK, selisih nol koma bisa menggeser ribuan ranking dalam sekejap.\n\nTerapkan hukum Pareto 80/20: pertahankan 20% tipe soal paling krusial di Penalaran Matematika dan Literasi Bahasa Inggris yang jadi penentu peringkat kuartil atas. Jangan biarkan ritme lu kendor sehari pun!`
    };
  } else if (scoreNum >= targetThreshold - 35) {
    return {
      status: 'ZONA PERSAINGAN KETAT',
      statusColor: 'text-amber-600',
      borderColor: 'border-amber-500',
      bgTag: 'bg-amber-500 text-black',
      message: `Skor ${scoreNum} buat masuk ${campusClean} (estimasi ~${targetThreshold}) ada di zona paling berdarah: lu cuma selisih tipis (${gap > 0 ? '-' + gap : '+' + Math.abs(gap)} poin) dari ambang batas aman. Di zona ini ada puluhan ribu pejuang lain dengan nilai yang identik.\n\nStop buang waktu menghafal rumus-rumus langka yang jarang keluar. Sikat 20% materi dengan frekuensi kemunculan tertinggi: Fungsi Kuadrat, Silogisme Kategorial, dan PUEBI Kalimat Efektif agar skor terdongkrak menembus 720+!`
    };
  } else if (scoreNum >= 480) {
    return {
      status: 'ZONA RAWAN GAGAL',
      statusColor: 'text-red-600',
      borderColor: 'border-red-600',
      bgTag: 'bg-red-600 text-white',
      message: `Tamparan realita: skor ${scoreNum} vs target ${campusClean} (~${targetThreshold}) memiliki gap defisit -${gap} poin. Ini bukan jarak yang bisa ditutup hanya dengan doa atau sekadar menonton video santai tanpa corat-coret sendiri.\n\nEksekusi Pareto 80/20: kuasai tuntas 20% konsep fundamental yang PASTI menyumbang poin di UTBK (Aljabar dasar, Modus Ponens/Tollens, dan Ide Pokok Teks). Wajib selesaikan minimal 3 paket soal tuntas per hari mulai sekarang!`
    };
  } else {
    return {
      status: 'ALARM BAHAYA MUTLAK',
      statusColor: 'text-red-600',
      borderColor: 'border-red-600',
      bgTag: 'bg-red-600 text-white',
      message: `Alarm bahaya mutlak: skor ${scoreNum} dengan target ${campusClean} (~${targetThreshold}) adalah sinyal darurat (defisit -${gap} poin). Jika gaya belajar lu masih pasif layaknya zombie scrolling medsos, mimpi ini akan kandas sebelum hari ujian tiba.\n\nLu masih kehilangan poin di soal-soal termudah yang seharusnya jadi lumbung nilai gratis. Matikan notifikasi HP, hentikan semua alasan, dan babat konsep dasar dari nol sekarang juga!`
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

    // Snappy micro-computation 280ms agar terasa ada kalkulasi tanpa delay
    await new Promise(resolve => setTimeout(resolve, 280));

    const scoreNum = Number(score);
    const analysis = analyzeReality(scoreNum, campus);
    setResultData(analysis);
    setLoading(false);
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
