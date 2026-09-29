import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Volume2, VolumeX } from 'lucide-react';

export default function SilentRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [listeners, setListeners] = useState(1);
  const [channel, setChannel] = useState(null);
  const audioRef = useRef(null);

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
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (channel) await channel.untrack();
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      if (channel) await channel.track({ online_at: new Date().toISOString() });
    }
  };

  return (
    <div className="fixed bottom-3 right-3 md:bottom-6 md:right-6 z-40 flex items-stretch bg-white border-4 border-zinc-950 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-none">
      <audio 
        ref={audioRef} 
        loop 
        src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=heavy-rain-nature-sounds-8186.mp3" 
      />
      
      <button 
        onClick={togglePlay}
        className="w-12 md:w-16 flex items-center justify-center bg-zinc-950 text-white hover:bg-zinc-800 active:scale-[0.97] transition-transform cursor-pointer"
        aria-label="Toggle Silent Radio"
      >
        {isPlaying ? <Volume2 className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} /> : <VolumeX className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />}
      </button>

      <div className="flex flex-col justify-center px-3 py-2 md:px-4 md:py-3 border-l-4 border-zinc-950 min-w-[120px] md:min-w-[160px]">
        <span className="text-[10px] md:text-xs font-black text-zinc-950 uppercase tracking-widest leading-none mb-1">
          Radio Senyap
        </span>
        {isPlaying ? (
          <span className="text-[10px] md:text-xs font-mono font-bold text-zinc-950 uppercase flex items-center gap-1.5 md:gap-2">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-zinc-950 animate-pulse"></span>
            [{listeners}] Mengudara
          </span>
        ) : (
          <span className="text-[10px] md:text-xs font-mono font-bold text-zinc-500 uppercase">
            Mati
          </span>
        )}
      </div>
    </div>
  );
}
