import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Calendar, CheckCircle2, AlertOctagon, Coffee, Trophy } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const DAYS_SHORT = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];

export default function HabitHeatmap() {
  const habitHistory = useAppStore(state => state.habitHistory) || {};
  const [selectedDay, setSelectedDay] = useState(null);

  // Generate 84 days (12 weeks x 7 days) ending on today
  const today = new Date();
  const daysList = [];
  
  // Calculate total days to render (12 weeks = 84 days)
  const totalDays = 84;
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const dayOfWeek = (d.getDay() + 6) % 7; // 0 = Senin, 6 = Minggu
    daysList.push({
      dateObj: d,
      dateKey: key,
      dayOfWeek,
      status: habitHistory[key] || null
    });
  }

  // Calculate Streak
  let streak = 0;
  for (let i = 0; i < totalDays; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const st = habitHistory[key];
    if (st === 'passed' || st === 'alibi') {
      streak++;
    } else {
      // If today hasn't been done yet, check if yesterday was active
      if (i === 0) continue;
      break;
    }
  }

  // Calculate Metrics
  const totalPassed = Object.values(habitHistory).filter(s => s === 'passed').length;
  const totalFailed = Object.values(habitHistory).filter(s => s === 'failed').length;
  const totalAlibi = Object.values(habitHistory).filter(s => s === 'alibi').length;
  const totalActiveDays = totalPassed + totalAlibi;
  const complianceRate = totalDays > 0 ? Math.round((totalActiveDays / 45) * 100) : 0;

  // Group by week (columns of 7 rows)
  const weeks = [];
  let currentWeek = [];
  daysList.forEach((day, idx) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || idx === daysList.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getCellColor = (status) => {
    switch (status) {
      case 'passed':
        return 'bg-zinc-950 border-zinc-950 text-white';
      case 'failed':
        return 'bg-red-600 border-red-600 text-white animate-pulse';
      case 'alibi':
        return 'bg-amber-400 border-amber-500 text-black';
      default:
        return 'bg-zinc-100 border-zinc-300 hover:border-zinc-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'passed':
        return { text: 'LOLOS 1 SOAL SEHARI', icon: CheckCircle2, color: 'text-zinc-950' };
      case 'failed':
        return { text: 'DIHUKUM / GAGAL WAKTU', icon: AlertOctagon, color: 'text-red-600' };
      case 'alibi':
        return { text: 'ALIBI RESMI TERCATAT', icon: Coffee, color: 'text-amber-600' };
      default:
        return { text: 'KOSONG / TIDAK ADA SESI', icon: Calendar, color: 'text-zinc-400' };
    }
  };

  return (
    <div className="bg-white border-4 md:border-8 border-zinc-950 p-4 sm:p-6 md:p-8 font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
      {/* Header Metric Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b-4 border-zinc-950 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-none"></span>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500">
              DISIPLIN PEJUANG // 12 MINGGU TERAKHIR
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-zinc-950 leading-none">
            HEATMAP KONSISTENSI
          </h2>
          <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider mt-1">
            Rekam jejak kepatuhan sumpah darah & pengerjaan soal harian.
          </p>
        </div>

        {/* Big Streak Badge */}
        <div className="flex items-center gap-3 bg-zinc-950 text-white p-3 border-4 border-zinc-950 shrink-0">
          <Flame className="w-7 h-7 text-amber-400 fill-amber-400 animate-bounce shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block leading-none">
              STREAK AKTIF
            </span>
            <span className="text-xl md:text-2xl font-black tracking-tight leading-none">
              {streak} HARI BERUNTUN
            </span>
          </div>
        </div>
      </div>

      {/* Grid Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-zinc-50 border-2 border-zinc-950 p-3">
          <span className="text-[10px] text-zinc-500 font-bold uppercase block">SOAL LOLOS</span>
          <span className="text-xl font-black text-zinc-950">{totalPassed} HARI</span>
        </div>
        <div className="bg-zinc-50 border-2 border-zinc-950 p-3">
          <span className="text-[10px] text-zinc-500 font-bold uppercase block">ALIBI TERCATAT</span>
          <span className="text-xl font-black text-amber-600">{totalAlibi} KALI</span>
        </div>
        <div className="bg-zinc-50 border-2 border-zinc-950 p-3">
          <span className="text-[10px] text-zinc-500 font-bold uppercase block">GAGAL / HUKUMAN</span>
          <span className="text-xl font-black text-red-600">{totalFailed} KALI</span>
        </div>
        <div className="bg-zinc-50 border-2 border-zinc-950 p-3">
          <span className="text-[10px] text-zinc-500 font-bold uppercase block">KEPATUHAN</span>
          <span className="text-xl font-black text-emerald-600">{Math.min(100, complianceRate)}%</span>
        </div>
      </div>

      {/* The Heatmap Grid */}
      <div className="overflow-x-auto pb-3 pt-1 scrollbar-hide">
        <div className="min-w-[620px]">
          {/* Day Rows + Week Columns */}
          <div className="flex gap-2">
            {/* Days of week labels on left */}
            <div className="flex flex-col gap-1.5 justify-between py-0.5 text-[9px] font-black text-zinc-400 pr-1 select-none">
              {DAYS_SHORT.map((day, i) => (
                <span key={i} className="h-5 flex items-center">{day}</span>
              ))}
            </div>

            {/* Weeks matrix */}
            <div className="flex-1 flex gap-1.5 justify-between">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5 flex-1">
                  {week.map((cell) => {
                    const isSelected = selectedDay?.dateKey === cell.dateKey;
                    return (
                      <button
                        key={cell.dateKey}
                        onClick={() => setSelectedDay(cell)}
                        className={`w-full aspect-square border-2 ${getCellColor(cell.status)} transition-transform active:scale-90 cursor-pointer relative ${
                          isSelected ? 'ring-2 ring-zinc-950 ring-offset-2 scale-110 z-10' : ''
                        }`}
                        title={`${cell.dateKey}: ${cell.status || 'kosong'}`}
                        aria-label={`Tanggal ${cell.dateKey}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Tooltip Detail */}
      {selectedDay && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-zinc-50 border-2 border-zinc-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
        >
          <div>
            <span className="font-black text-zinc-500 uppercase mr-2">
              TANGGAL: {selectedDay.dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <div className="flex items-center gap-2 mt-1">
              {(() => {
                const badge = getStatusLabel(selectedDay.status);
                const Icon = badge.icon;
                return (
                  <>
                    <Icon className={`w-4 h-4 ${badge.color}`} />
                    <span className={`font-black uppercase ${badge.color}`}>{badge.text}</span>
                  </>
                );
              })()}
            </div>
          </div>
          <button 
            onClick={() => setSelectedDay(null)}
            className="text-[10px] font-black uppercase text-zinc-400 hover:text-zinc-950 self-end sm:self-center"
          >
            [TUTUP DETAIL]
          </button>
        </motion.div>
      )}

      {/* Heatmap Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-4 border-t-2 border-zinc-200 text-[10px] font-black uppercase text-zinc-600">
        <span className="text-zinc-400">LEGENDA STATUS:</span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-zinc-950 border border-zinc-950 inline-block"></span>
            <span>LOLOS 1 SOAL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-amber-400 border border-amber-500 inline-block"></span>
            <span>ALIBI RESMI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-red-600 border border-red-600 inline-block"></span>
            <span>GAGAL/DIHUKUM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-zinc-100 border border-zinc-300 inline-block"></span>
            <span>KOSONG</span>
          </div>
        </div>
      </div>
    </div>
  );
}
