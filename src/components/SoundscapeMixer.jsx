import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Sliders, Zap, CloudRain, Clock, Radio, Headphones } from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

export default function SoundscapeMixer() {
  const [isPlaying, setIsPlaying] = useState(soundEngine.isPlaying);
  const [masterVolume, setMasterVolume] = useState(80);
  const [tracks, setTracks] = useState({
    gamma: { active: false, volume: 50, name: '40Hz Gamma Focus', desc: 'Binaural Beat (Kognisi & Logika)', tag: '40 Hz' },
    alpha: { active: false, volume: 40, name: '10Hz Alpha Waves', desc: 'Meredakan Cemas & Menenangkan', tag: '10 Hz' },
    brown: { active: true, volume: 60, name: 'Deep Brown Noise', desc: 'Peredam Kebisingan Luar Total', tag: 'LOW-PASS' },
    rain: { active: false, volume: 50, name: 'Hujan di Kanvas', desc: 'Tekstur Suara Alam Penenang', tag: 'WHITE/PINK' },
    clock: { active: false, volume: 30, name: 'Detak Jam Analog', desc: 'Metronom Fokus Ritme Waktu', tag: '1.0 SEC' }
  });

  const toggleMaster = () => {
    const newState = soundEngine.toggleMaster();
    setIsPlaying(newState);
  };

  const handleTrackToggle = (key) => {
    const newActive = !tracks[key].active;
    const updated = {
      ...tracks,
      [key]: { ...tracks[key], active: newActive }
    };
    setTracks(updated);
    soundEngine.updateTrack(key, newActive, tracks[key].volume / 100);
    if (!isPlaying && newActive) {
      soundEngine.playAll();
      setIsPlaying(true);
    }
  };

  const handleTrackVolume = (key, val) => {
    const num = Number(val);
    const updated = {
      ...tracks,
      [key]: { ...tracks[key], volume: num }
    };
    setTracks(updated);
    soundEngine.updateTrack(key, tracks[key].active, num / 100);
  };

  const handleMasterVolume = (val) => {
    const num = Number(val);
    setMasterVolume(num);
    soundEngine.setMasterVolume(num / 100);
  };

  const applyPreset = (presetName) => {
    let newTracks = { ...tracks };
    if (presetName === 'focus') {
      newTracks.gamma = { ...newTracks.gamma, active: true, volume: 65 };
      newTracks.brown = { ...newTracks.brown, active: true, volume: 55 };
      newTracks.clock = { ...newTracks.clock, active: true, volume: 25 };
      newTracks.alpha = { ...newTracks.alpha, active: false };
      newTracks.rain = { ...newTracks.rain, active: false };
    } else if (presetName === 'shield') {
      newTracks.brown = { ...newTracks.brown, active: true, volume: 85 };
      newTracks.rain = { ...newTracks.rain, active: true, volume: 40 };
      newTracks.gamma = { ...newTracks.gamma, active: false };
      newTracks.alpha = { ...newTracks.alpha, active: false };
      newTracks.clock = { ...newTracks.clock, active: false };
    } else if (presetName === 'calm') {
      newTracks.alpha = { ...newTracks.alpha, active: true, volume: 65 };
      newTracks.rain = { ...newTracks.rain, active: true, volume: 70 };
      newTracks.brown = { ...newTracks.brown, active: false };
      newTracks.gamma = { ...newTracks.gamma, active: false };
      newTracks.clock = { ...newTracks.clock, active: false };
    }

    setTracks(newTracks);
    Object.keys(newTracks).forEach((k) => {
      soundEngine.updateTrack(k, newTracks[k].active, newTracks[k].volume / 100);
    });

    if (!isPlaying) {
      soundEngine.playAll();
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-white border-4 md:border-8 border-zinc-950 p-4 sm:p-6 md:p-8 font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
      {/* Header Rack Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-zinc-950 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-red-600 animate-pulse" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500">
              AUDIO SINTESIS OFFLINE // WEB AUDIO API
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-zinc-950 leading-none">
            MIXER GELOMBANG OTAK & NOISE
          </h2>
          <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider mt-1 flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-zinc-950" />
            Gunakan headphone stereo untuk efek binaural beats maksimal.
          </p>
        </div>

        {/* Master Power Button */}
        <button 
          onClick={toggleMaster}
          className={`flex items-center gap-2 px-5 py-3 border-4 border-zinc-950 font-black text-xs md:text-sm uppercase tracking-widest active:scale-95 transition-transform cursor-pointer shrink-0 ${
            isPlaying ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          {isPlaying ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-red-500" />}
          <span>{isPlaying ? 'MASTER ON' : 'MASTER OFF'}</span>
        </button>
      </div>

      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[10px] font-black text-zinc-500 uppercase mr-1">PRESET TAKTIS:</span>
        <button 
          onClick={() => applyPreset('focus')}
          className="bg-zinc-100 hover:bg-zinc-950 hover:text-white text-zinc-950 border-2 border-zinc-950 px-3 py-1 text-xs font-bold uppercase active:scale-95 transition-all cursor-pointer"
        >
          ⚡ DEEP FOCUS (40HZ)
        </button>
        <button 
          onClick={() => applyPreset('shield')}
          className="bg-zinc-100 hover:bg-zinc-950 hover:text-white text-zinc-950 border-2 border-zinc-950 px-3 py-1 text-xs font-bold uppercase active:scale-95 transition-all cursor-pointer"
        >
          🛡️ BLOKIR BISING (BROWN)
        </button>
        <button 
          onClick={() => applyPreset('calm')}
          className="bg-zinc-100 hover:bg-zinc-950 hover:text-white text-zinc-950 border-2 border-zinc-950 px-3 py-1 text-xs font-bold uppercase active:scale-95 transition-all cursor-pointer"
        >
          🌊 REDAKAN CEMAS (ALPHA+HUJAN)
        </button>
      </div>

      {/* Multi-Track Fader Strips */}
      <div className="space-y-4">
        {Object.entries(tracks).map(([key, t]) => (
          <div 
            key={key}
            className={`border-4 border-zinc-950 p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
              t.active && isPlaying ? 'bg-zinc-50 border-zinc-950' : 'bg-white opacity-70'
            }`}
          >
            {/* Track Info */}
            <div className="md:w-64 shrink-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[9px] font-black px-1.5 py-0.5 border ${
                  t.active && isPlaying ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-zinc-200 text-zinc-600 border-zinc-300'
                }`}>
                  {t.tag}
                </span>
                <span className="font-black text-sm uppercase text-zinc-950">{t.name}</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-bold uppercase">{t.desc}</p>
            </div>

            {/* Volume Fader Slider */}
            <div className="flex-1 flex items-center gap-3">
              <input 
                type="range"
                min="0"
                max="100"
                value={t.volume}
                disabled={!t.active}
                onChange={(e) => handleTrackVolume(key, e.target.value)}
                className="w-full accent-zinc-950 cursor-pointer disabled:opacity-30 h-3 bg-zinc-200 rounded-none border border-zinc-950"
              />
              <span className="w-10 text-right text-xs font-black text-zinc-950">{t.volume}%</span>
            </div>

            {/* Track Toggle Button */}
            <button 
              onClick={() => handleTrackToggle(key)}
              className={`px-4 py-2 border-2 md:border-4 border-zinc-950 text-xs font-black uppercase tracking-wider shrink-0 cursor-pointer active:scale-95 transition-transform ${
                t.active 
                  ? 'bg-emerald-600 text-white border-emerald-700' 
                  : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
              }`}
            >
              {t.active ? 'AKTIF' : 'MATI'}
            </button>
          </div>
        ))}
      </div>

      {/* Master Volume Footer */}
      <div className="mt-6 pt-5 border-t-4 border-zinc-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-zinc-950" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-950">MASTER OUTPUT:</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-72">
          <input 
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={(e) => handleMasterVolume(e.target.value)}
            className="w-full accent-zinc-950 cursor-pointer h-3 bg-zinc-200 rounded-none border border-zinc-950"
          />
          <span className="w-10 text-right text-xs font-black text-zinc-950">{masterVolume}%</span>
        </div>
      </div>
    </div>
  );
}
