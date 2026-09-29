import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Volume2, VolumeX, Sliders, X } from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';
import SoundscapeMixer from './SoundscapeMixer';
import { motion, AnimatePresence } from 'motion/react';

export default function SilentRadio() {
  const [isPlaying, setIsPlaying] = useState(soundEngine.isPlaying);
  const [listeners, setListeners] = useState(1);
  const [channel, setChannel] = useState(null);
  const [showMixerModal, setShowMixerModal] = useState(false);

  useEffect(() => {
    // Inisialisasi Realtime Channel khusus radio
    const ch = supabase.channel('radio-room', {
      config: { presence: { key: 'listener_' + Math.random() } }
    });

    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState();
      setListeners(Object.keys(state).length || 1);
    })
    .subscribe();

    setChannel(ch);

    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const togglePlay = async () => {
    const newState = soundEngine.toggleMaster();
    setIsPlaying(newState);

    if (newState) {
      if (channel) await channel.track({ online_at: new Date().toISOString() });
    } else {
      if (channel) await channel.untrack();
    }
  };

  return (
    <>
      <div className="fixed bottom-3 right-3 md:bottom-6 md:right-6 z-40 flex items-stretch bg-white border-4 border-zinc-950 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-none font-mono">
        <button 
          onClick={togglePlay}
          className="w-12 md:w-16 flex items-center justify-center bg-zinc-950 text-white hover:bg-zinc-800 active:scale-[0.97] transition-transform cursor-pointer"
          aria-label="Toggle Silent Radio"
        >
          {isPlaying ? <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" strokeWidth={3} /> : <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-red-500" strokeWidth={3} />}
        </button>

        <div 
          onClick={() => setShowMixerModal(true)}
          className="flex flex-col justify-center px-3 py-2 md:px-4 md:py-3 border-l-4 border-zinc-950 min-w-[130px] md:min-w-[170px] cursor-pointer hover:bg-zinc-50 transition-colors"
          title="Klik untuk membuka Mixer Gelombang Otak"
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] md:text-xs font-black text-zinc-950 uppercase tracking-widest leading-none">
              Radio Senyap
            </span>
            <Sliders className="w-3 h-3 text-zinc-600" />
          </div>
          {isPlaying ? (
            <span className="text-[10px] md:text-xs font-mono font-bold text-zinc-950 uppercase flex items-center gap-1.5 md:gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 animate-pulse"></span>
              [{listeners}] Mengudara
            </span>
          ) : (
            <span className="text-[10px] md:text-xs font-mono font-bold text-zinc-500 uppercase flex items-center gap-1">
              <span>Mati</span>
              <span className="text-[9px] text-zinc-400">// Klik Mixer</span>
            </span>
          )}
        </div>
      </div>

      {/* Floating Soundscape Mixer Modal */}
      <AnimatePresence>
        {showMixerModal && (
          <div 
            className="fixed inset-0 z-50 bg-zinc-950/80 flex items-center justify-center p-3 sm:p-6"
            onClick={() => setShowMixerModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto"
            >
              <div className="relative">
                <button 
                  onClick={() => setShowMixerModal(false)}
                  className="absolute top-4 right-4 z-10 bg-zinc-950 text-white p-2 border-2 border-white hover:bg-red-600 transition-colors cursor-pointer"
                  aria-label="Tutup Mixer"
                >
                  <X className="w-5 h-5" />
                </button>
                <SoundscapeMixer />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
