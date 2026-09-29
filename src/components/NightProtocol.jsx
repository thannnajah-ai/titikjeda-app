import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function NightProtocol({ children, forceShow = false }) {
  const [isNight, setIsNight] = useState(forceShow);

  useEffect(() => {
    // In dev mode with forceShow, bypass the real interval
    if (forceShow) {
      setIsNight(true);
      return;
    }

    const checkTime = () => {
      const hour = new Date().getHours();
      // Block between 01:00 and 03:59
      if (hour >= 1 && hour < 4) {
        setIsNight(true);
      } else {
        setIsNight(false);
      }
    };

    checkTime(); // Initial check
    const interval = setInterval(checkTime, 10000); // Check every 10 seconds (10000ms) per spec
    return () => clearInterval(interval);
  }, [forceShow]);

  return (
    <>
      <AnimatePresence>
        {isNight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{
              duration: 0.25,
              ease: [0.23, 1, 0.32, 1] // Emil's ease-out curve
            }}
            className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <div className="max-w-3xl w-full flex flex-col items-center">
              {/* Brutalist Warning Graphic/Text */}
              <div className="bg-red-600 text-zinc-950 font-mono text-[10px] md:text-xs font-black uppercase tracking-[0.2em] px-3 py-1 mb-12">
                System Override Active
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black mb-8 text-zinc-100 uppercase tracking-tighter leading-[1.1]">
                Tidur Sekarang.
              </h1>
              
              <p className="text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed max-w-[55ch] font-mono">
                Motivasi jam 2 pagi itu palsu. Anda hanya cemas. Jika Anda benar-benar niat belajar, Anda akan bangun jam 6 pagi besok dengan otak yang jernih.
              </p>
              
              <div className="border border-zinc-800 p-6 md:p-8 w-full max-w-lg bg-black text-left">
                <div className="text-zinc-500 font-mono text-xs uppercase tracking-wider mb-2">Status Terminal</div>
                <div className="text-red-500 font-mono text-sm">
                  &gt; Akses ke modul belajar ditolak.<br/>
                  &gt; Protokol penguncian aktif.<br/>
                  &gt; Sistem akan terbuka kembali pada pukul 04.00.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render app content normally behind the overlay */}
      {/* (When overlay is active, the z-index completely covers the children) */}
      {children}
    </>
  );
}
