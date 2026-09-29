import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Flame } from 'lucide-react';

export default function LockoutOverlay() {
  const isLockedOut = useAppStore(state => state.isLockedOut);
  const resetLockout = useAppStore(state => state.resetLockout);

  return (
    <AnimatePresence>
      {isLockedOut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }} 
          className="fixed inset-0 z-[100] bg-zinc-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-y-auto"
        >
          {/* Noise background overlay */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

          <motion.div
            initial={{ y: -20, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.1 }}
            className="max-w-2xl w-full relative z-10 my-auto"
          >
            <div className="border-4 md:border-8 border-white p-6 sm:p-8 md:p-12 bg-zinc-950 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] md:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]">
              <Flame className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-6 md:mb-8 text-white stroke-[3] animate-pulse" />
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 md:mb-6 uppercase leading-none">
                KAPASITAS Penuh.
              </h1>
              <p className="text-zinc-400 font-mono font-bold uppercase tracking-widest text-xs sm:text-sm md:text-lg mb-8 md:mb-12 leading-relaxed max-w-lg mx-auto border-t-2 md:border-t-4 border-zinc-800 pt-4 md:pt-6">
                KAMU SUDAH BELAJAR 90 MENIT TANPA HENTI. SISTEM DIKUNCI. TUTUP LAYAR HP, MINUM AIR, DAN ISTIRAHATLAH.
              </p>
              
              <button 
                onClick={resetLockout}
                className="px-6 md:px-8 py-3.5 md:py-4 bg-white text-zinc-950 font-black text-sm md:text-base uppercase tracking-widest hover:bg-zinc-200 active:scale-[0.97] transition-all cursor-pointer"
              >
                (DEV) BUKA KUNCI
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
