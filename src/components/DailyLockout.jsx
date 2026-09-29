import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

export default function DailyLockout() {
  const dailyStatus = useAppStore(state => state.dailyStatus);
  const lastAnswerDate = useAppStore(state => state.lastAnswerDate);
  const today = new Date().toLocaleDateString('id-ID');

  const isFailedToday = dailyStatus === 'failed' && lastAnswerDate === today;

  return (
    <AnimatePresence>
      {isFailedToday && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1, ease: 'easeOut' }} // Hukuman instan, no slow ease-in
          className="fixed inset-0 z-[10000] bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none"
        >
          <div className="max-w-3xl w-full border-4 border-red-600 p-12 bg-black relative">
            <h1 className="text-6xl md:text-8xl font-black mb-8 text-red-600 uppercase tracking-tighter leading-none">
              GAGAL.
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 font-mono uppercase tracking-widest leading-relaxed">
              Anda dinilai tidak layak hari ini.<br/><br/>
              Akses ditutup mutlak hingga 00:00.
            </p>
            
            {/* Dev Only Reset Button */}
            <button 
              onClick={() => useAppStore.getState().setDailyStatus(null)}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 text-xs font-mono text-zinc-600 hover:text-white border border-zinc-800 hover:border-zinc-600"
            >
              [DEV] RESET STATUS
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
