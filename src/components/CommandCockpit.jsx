import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Swords, 
  ArrowRight, 
  Target, 
  TrendingDown, 
  Flame, 
  ShieldAlert,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function CommandCockpit() {
  const navigate = useNavigate();
  const tryoutHistory = useAppStore((state) => state.tryoutHistory) || [];
  const targetPTN = useAppStore((state) => state.targetPTN) || 'STEI ITB - REKAYASA PERANGKAT LUNAK';
  const targetScore = useAppStore((state) => state.targetScore) || 735;
  const habitHistory = useAppStore((state) => state.habitHistory) || {};
  const errorLog = useAppStore((state) => state.errorLog) || [];
  
  const todayKey = new Date().toISOString().split('T')[0];
  const isDoneToday = habitHistory[todayKey] === 'passed';
  const unresolvedMistakes = errorLog.filter(e => e.status === 'unresolved').length;

  // Parsing target campus and prodi
  let campusName = 'STEI ITB';
  let prodiName = 'REKAYASA PERANGKAT LUNAK';
  if (typeof targetPTN === 'string') {
    const parts = targetPTN.split('-');
    if (parts.length > 1) {
      campusName = parts[0].trim();
      prodiName = parts.slice(1).join('-').trim();
    } else {
      campusName = targetPTN;
      prodiName = 'PILIHAN UTAMA';
    }
  } else if (typeof targetPTN === 'object' && targetPTN !== null) {
    campusName = targetPTN.campus || targetPTN.ptn || 'TARGET KAMPUS';
    prodiName = targetPTN.prodi || 'PROGRAM STUDI';
  }

  // Kalkulasi Skor Rata-rata 3 Tryout Terakhir
  const recentRuns = tryoutHistory.slice(0, 3);
  const currentAvgScore = recentRuns.length > 0
    ? Math.round(recentRuns.reduce((acc, r) => acc + r.score, 0) / recentRuns.length)
    : 620;

  const deficit = currentAvgScore - targetScore; // Nilai negatif menunjukkan kekurangan poin
  const isCritical = deficit < -80;
  const isWarning = deficit < 0 && deficit >= -80;
  const isSafe = deficit >= 0;

  // Analisis 2 Subtes Terlemah (Leak Breakdown)
  const latestRun = tryoutHistory[0];
  let subtestLeaks = [
    { subtest: 'Penalaran Umum (PU)', accuracy: 40, leak: -45, weakestTopic: 'Silogisme Negasi Rantai' },
    { subtest: 'Pengetahuan Kuantitatif (PK)', accuracy: 50, leak: -38, weakestTopic: 'Fungsi Kuadrat & Diskriminan' }
  ];

  if (latestRun && latestRun.subtestBreakdown) {
    const computedLeaks = Object.entries(latestRun.subtestBreakdown)
      .map(([name, data]) => {
        const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        const ptsLost = (data.total - data.correct) * 22;
        return {
          subtest: name,
          accuracy: acc,
          leak: -ptsLost,
          weakestTopic: acc < 60 ? 'Materi Fundamental Belum Mantap' : 'Perlu Efisiensi Waktu'
        };
      })
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 2);

    if (computedLeaks.length >= 2) {
      subtestLeaks = computedLeaks;
    }
  }

  return (
    <div className="border-4 md:border-8 border-zinc-950 bg-white font-mono shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-10">
      {/* Top Protocol Status Bar */}
      <div className="bg-zinc-950 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b-4 border-zinc-950">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-none ${isSafe ? 'bg-emerald-400' : 'bg-red-600 animate-ping'}`}></span>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-red-500">
            PUSAT KOMANDO OPERASIONAL // AUDIT DEFISIT SKOR REAL-TIME
          </span>
        </div>
        <div className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-3">
          <span>
            STREAK HARIAN:{' '}
            {isDoneToday ? (
              <span className="text-emerald-400 font-bold">TERKUNCI ✓</span>
            ) : (
              <span className="text-amber-400 font-bold animate-pulse">BELUM SELESAI ⚠️</span>
            )}
          </span>
          {unresolvedMistakes > 0 && (
            <span className="text-red-400 font-bold bg-red-950/80 px-1.5 py-0.5 border border-red-700">
              {unresolvedMistakes} DOSA BELUM DITEBUS
            </span>
          )}
        </div>
      </div>

      <div className="p-5 md:p-8 space-y-6">
        {/* Row 1: Target vs Realita */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-4 border-zinc-200 pb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-zinc-500 mb-1">
              <Target className="w-4 h-4 text-zinc-950" />
              <span>SASARAN UTBK PILIHAN ANDA</span>
              <button 
                onClick={() => navigate('/rasionalisasi')} 
                className="text-[10px] text-red-600 underline ml-2 font-black cursor-pointer hover:text-black"
              >
                [UBAH PILIHAN]
              </button>
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-zinc-950 tracking-tight leading-none">
              {campusName}
            </h2>
            <p className="text-xs md:text-sm font-bold uppercase text-zinc-600 mt-1.5">
              {prodiName} // SKOR AMAN KELULUSAN: <span className="text-zinc-950 font-black">{targetScore} PTS</span>
            </p>
          </div>

          {/* Deficit Badge Counter */}
          <div className="flex items-center gap-4 bg-zinc-50 border-4 border-zinc-950 p-4 shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-zinc-400 block">RATA-RATA ANDA</span>
              <span className="text-3xl md:text-4xl font-black text-zinc-950 leading-none">
                {currentAvgScore}
              </span>
            </div>

            <div className="h-10 w-0.5 bg-zinc-300"></div>

            <div>
              <span className="text-[10px] font-black uppercase text-red-600 block flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                DEFISIT SKOR
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl md:text-4xl font-black tracking-tighter leading-none ${
                  deficit < 0 ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {deficit > 0 ? `+${deficit}` : deficit}
                </span>
                <span className={`text-[10px] font-black uppercase px-1 py-0.5 border ${
                  isCritical ? 'bg-red-600 text-white border-red-700' :
                  isWarning ? 'bg-amber-400 text-black border-amber-600' :
                  'bg-emerald-500 text-white border-emerald-700'
                }`}>
                  {isCritical ? 'KRITIS' : isWarning ? 'RAWAN' : 'KOMPETITIF'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Diagnostic Leaks (Kebocoran Poin) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500 block">
              // DIAGNOSIS KEBOCORAN POIN UTAMA (2 SUBTES TERLEMAH SAAT INI)
            </span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase hidden sm:inline">
              Fokuskan 80% energi di sini
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subtestLeaks.map((item, idx) => (
              <div 
                key={idx} 
                className="border-2 md:border-4 border-zinc-950 p-4 bg-zinc-50 flex items-start justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <div>
                  <span className="text-[10px] font-black uppercase text-red-600 bg-red-100 px-1.5 py-0.5 border border-red-300 inline-block mb-1.5">
                    KEBOCORAN: {item.leak} PTS
                  </span>
                  <h4 className="font-black text-sm uppercase text-zinc-950 leading-tight">
                    {item.subtest}
                  </h4>
                  <p className="text-xs font-bold text-zinc-500 uppercase mt-1">
                    Titik Fatal: <span className="text-zinc-900 underline font-black">{item.weakestTopic}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-black text-zinc-400 uppercase block">AKURASI</span>
                  <span className="text-xl font-black text-red-600">{item.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Single Primary Directive CTA (Zero Decision Fatigue) */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/tryout')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 md:py-5 px-6 text-sm md:text-base uppercase tracking-widest border-4 border-zinc-950 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Swords className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
            <span>TUTUP DEFISIT SEKARANG (SPRINT 10 MENIT)</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform" />
          </button>
          
          <div className="flex flex-wrap items-center justify-between text-[10px] text-zinc-500 font-bold uppercase mt-2.5 px-1 gap-2">
            <span>Standar Evaluasi: Sprint 10 Soal Pareto</span>
            <span>Algoritma Penilaian: IRT Standar SNBT V3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
