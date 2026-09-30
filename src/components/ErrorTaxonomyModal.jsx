import React from 'react';
import { 
  EyeOff, 
  ZapOff, 
  TimerOff, 
  Check, 
  BrainCircuit,
  X 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const TAXONOMY_CONFIG = {
  BLIND_SPOT: {
    type: 'BLIND_SPOT',
    label: '[BLIND_SPOT]',
    title: 'BUTA KONSEP / BELUM BELAJAR',
    desc: 'Materi asing, belum pernah mempelajari rumus dasarnya atau salah total memahami konsep.',
    badgeClass: 'bg-red-100 text-red-700 border-red-500',
    color: 'text-red-600',
    icon: EyeOff
  },
  RUSH_ERROR: {
    type: 'RUSH_ERROR',
    label: '[RUSH_ERROR]',
    title: 'CEROBOH / TERBURU-BURU',
    desc: 'Paham materinya, tetapi tidak teliti membaca kata negasi, jebakan kata, atau salah hitung dasar.',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-500',
    color: 'text-amber-500',
    icon: ZapOff
  },
  TIME_PANIC: {
    type: 'TIME_PANIC',
    label: '[TIME_PANIC]',
    title: 'KEPANIKAN WAKTU (>90 DETIK)',
    desc: 'Bisa menyelesaikan jika waktu tak terbatas, namun panik saat detik hitung mundur menipis.',
    badgeClass: 'bg-zinc-200 text-zinc-800 border-zinc-500',
    color: 'text-zinc-600',
    icon: TimerOff
  }
};

export default function ErrorTaxonomyModal({ isOpen, onClose, targetError }) {
  const assignErrorTaxonomy = useAppStore((state) => state.assignErrorTaxonomy);

  if (!isOpen || !targetError) return null;

  const handleSelect = (taxonomyType) => {
    assignErrorTaxonomy(targetError.id, taxonomyType);
    onClose();
  };

  const options = Object.values(TAXONOMY_CONFIG);

  return (
    <div 
      className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-mono"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white border-4 md:border-8 border-zinc-950 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-zinc-950 text-white p-4 flex items-center justify-between border-b-4 border-zinc-950">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-red-500" />
            <span className="text-xs font-black uppercase tracking-widest text-white">
              AUDIT KOGNITIF // AKAR KESALAHAN
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white font-black text-xs uppercase cursor-pointer"
          >
            [ESC]
          </button>
        </div>

        {/* Question Snapshot */}
        <div className="p-4 bg-zinc-100 border-b-2 border-zinc-300">
          <span className="text-[10px] font-black uppercase text-zinc-500 block mb-1">
            SOAL TERDAMPAK ({targetError.code || targetError.subject}):
          </span>
          <p className="text-xs font-bold text-zinc-900 line-clamp-2 leading-relaxed">
            "{targetError.question}"
          </p>
        </div>

        {/* Option Selection Matrix */}
        <div className="p-4 md:p-6 space-y-3">
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-1">
            MENGAPA ANDA GAGAL DI BUTIR SOAL INI?
          </span>

          {options.map((opt) => {
            const Icon = opt.icon;
            const isCurrent = targetError.taxonomy === opt.type;

            return (
              <button
                key={opt.type}
                onClick={() => handleSelect(opt.type)}
                className={`w-full text-left p-3.5 border-2 md:border-4 border-zinc-950 transition-all cursor-pointer flex items-start gap-3 active:scale-[0.98] ${
                  isCurrent 
                    ? 'bg-zinc-950 text-white shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]' 
                    : 'bg-white hover:bg-zinc-50 text-zinc-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <div className={`p-2 border-2 border-zinc-950 shrink-0 mt-0.5 ${
                  isCurrent ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-950'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-black uppercase tracking-wider">
                      {opt.label} {opt.title}
                    </span>
                    {isCurrent && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className={`text-[11px] font-bold uppercase leading-relaxed ${
                    isCurrent ? 'text-zinc-300' : 'text-zinc-600'
                  }`}>
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Warning */}
        <div className="p-3 bg-zinc-50 border-t-2 border-zinc-200 text-center">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
            Jujur pada diri sendiri. Data ini mengkalibrasi strategi Pareto Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
