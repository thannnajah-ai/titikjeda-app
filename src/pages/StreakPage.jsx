import React from 'react';
import { motion } from 'motion/react';
import { Flame, Trophy, Target, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import HabitHeatmap from '../components/HabitHeatmap';
import SoundscapeMixer from '../components/SoundscapeMixer';
import { useAppStore } from '../store/useAppStore';

export default function StreakPage() {
  const habitHistory = useAppStore(state => state.habitHistory) || {};
  const dailyStatus = useAppStore(state => state.dailyStatus);

  const totalPassed = Object.values(habitHistory).filter(s => s === 'passed').length;
  const isDoneToday = dailyStatus === 'passed';

  return (
    <div className="space-y-10 font-mono">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-3 bg-red-600 rounded-none animate-pulse"></span>
          <span className="text-xs font-black uppercase tracking-widest text-red-600">
            KONSISTENSI // DISIPLIN TINGKAT TINGGI
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 leading-none">
          STREAK & HEATMAP
        </h1>
        <p className="text-xs md:text-sm text-zinc-600 font-bold uppercase tracking-wider mt-2">
          Matriks kedisiplinan 84 hari pejuang UTBK. Satu hari bolos adalah langkah mundur ribuan peringkat.
        </p>
      </div>

      {/* Action Banner to protect streak today */}
      {!isDoneToday ? (
        <div className="bg-amber-400 border-4 md:border-8 border-zinc-950 p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Flame className="w-8 h-8 text-zinc-950 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-lg md:text-xl uppercase text-zinc-950 leading-none">
                STREAK HARI INI BELUM AMAN!
              </h3>
              <p className="text-xs font-bold uppercase text-zinc-900 mt-1">
                Selesaikan 1 Soal Sehari sekarang agar streak tidak terputus.
              </p>
            </div>
          </div>
          <NavLink 
            to="/one"
            className="bg-zinc-950 hover:bg-zinc-800 text-white font-black px-6 py-3 text-xs md:text-sm uppercase tracking-widest flex items-center gap-2 shrink-0 active:scale-95 transition-transform"
          >
            <span>KERJAKAN SOAL SEKARANG</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      ) : (
        <div className="bg-emerald-500 border-4 md:border-8 border-zinc-950 p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-zinc-950 shrink-0" />
            <div>
              <h3 className="font-black text-lg md:text-xl uppercase leading-none text-zinc-950">
                STREAK HARI INI AMAN!
              </h3>
              <p className="text-xs font-bold uppercase text-zinc-900 mt-1">
                Kamu telah menuntaskan 1 Soal Sehari. Lanjutkan fokus belajarmu dengan soundscape mixer di bawah.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1. Master Heatmap Component */}
      <HabitHeatmap />

      {/* 2. Soundscape & Binaural Beats Synthesizer */}
      <SoundscapeMixer />

      {/* Milestones & Badges */}
      <div className="bg-zinc-50 border-4 md:border-8 border-zinc-950 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black text-xl uppercase tracking-tighter text-zinc-950 mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          LENCANA PENCAPAIAN DISIPLIN
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 border-4 border-zinc-950 ${totalPassed >= 3 ? 'bg-white' : 'bg-zinc-200 opacity-60'}`}>
            <span className="text-2xl block mb-2">🥉</span>
            <h4 className="font-black text-sm uppercase text-zinc-950">PRAJURIT AWAL</h4>
            <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">Lolos minimal 3 soal harian (Status: {totalPassed}/3)</p>
          </div>
          <div className={`p-4 border-4 border-zinc-950 ${totalPassed >= 7 ? 'bg-white' : 'bg-zinc-200 opacity-60'}`}>
            <span className="text-2xl block mb-2">🥈</span>
            <h4 className="font-black text-sm uppercase text-zinc-950">BENTENG SEMINGGU</h4>
            <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">Lolos 7 soal harian tanpa bolos (Status: {totalPassed}/7)</p>
          </div>
          <div className={`p-4 border-4 border-zinc-950 ${totalPassed >= 14 ? 'bg-white' : 'bg-zinc-200 opacity-60'}`}>
            <span className="text-2xl block mb-2">🥇</span>
            <h4 className="font-black text-sm uppercase text-zinc-950">PETARUNG PARETO</h4>
            <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">Lolos 14 soal harian berturut-turut (Status: {totalPassed}/14)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
