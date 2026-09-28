import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
          className="fixed inset-0 z-[100] bg-stone-950/90 backdrop-blur-xl text-stone-100 flex flex-col items-center justify-center px-6 text-center"
        >
          <motion.div
            initial={{ y: -50, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.4, delay: 0.1 }}
            className="max-w-xl"
          >
            <Flame className="w-16 h-16 mx-auto mb-8 text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
              Kapasitas Otak Penuh.
            </h1>
            <p className="text-stone-300 text-lg md:text-xl mb-12 max-w-md mx-auto leading-relaxed">
              Kamu sudah belajar 90 menit tanpa henti. Website ini dikunci. Tutup laptopmu, pergi minum air, dan istirahatlah.
            </p>
            
            <button 
              onClick={resetLockout}
              className="px-6 py-3 rounded-full bg-stone-900 border border-stone-800 text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              (Dev Only) Buka Kunci
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
