import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabase';

// Soal UTBK tingkat dewa palsu untuk contoh
const DAILY_QUESTION = {
  question: "Dalam sistem koordinat Kartesius, sebuah partikel bergerak sepanjang kurva y = x^3 - 3x^2 + 2x. Berapa percepatan partikel tersebut pada saat x = 2 jika kecepatan searah sumbu-x konstan 2 m/s?",
  options: [
    "A. 12 m/s²",
    "B. 24 m/s²",
    "C. 6 m/s²",
    "D. 18 m/s²",
    "E. 0 m/s²"
  ],
  correctIndex: 1 // 24 m/s^2
};

export default function OneQuestion() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);
  const setDailyStatus = useAppStore(state => state.setDailyStatus);
  const setLastAnswerDate = useAppStore(state => state.setLastAnswerDate);
  const dailyStatus = useAppStore(state => state.dailyStatus);
  const lastAnswerDate = useAppStore(state => state.lastAnswerDate);
  const today = new Date().toLocaleDateString('id-ID');

  useEffect(() => {
    // Hanya hitung mundur jika belum dihukum dan belum lolos
    if (lastAnswerDate === today && (dailyStatus === 'failed' || dailyStatus === 'passed')) return;
    
    if (timeLeft <= 0) {
      handleFail();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, lastAnswerDate, today, dailyStatus]);

  const handleFail = async () => {
    setLastAnswerDate(today);
    setDailyStatus('failed');
    
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        await supabase.from('user_progress').upsert({
          date: today,
          status: 'failed',
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.error("Gagal sync status failed ke Supabase", e);
      }
    }
  };

  const handlePass = async () => {
    setLastAnswerDate(today);
    setDailyStatus('passed');
    
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        await supabase.from('user_progress').upsert({
          date: today,
          status: 'passed',
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.error("Gagal sync status passed ke Supabase", e);
      }
    }
  };

  const handleAnswer = (index) => {
    if (index === DAILY_QUESTION.correctIndex) {
      handlePass();
    } else {
      handleFail();
    }
  };

  if (lastAnswerDate === today && dailyStatus === 'passed') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mt-12 bg-white text-zinc-950 border-[12px] border-zinc-950 p-8 md:p-16 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
          TUNTAS.
        </h1>
        <p className="font-mono font-bold text-lg md:text-xl uppercase tracking-widest text-zinc-600">
          TUGAS HARIAN SELESAI.<br/>
          KEMBALI LAGI BESOK.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto mt-12 bg-white text-zinc-950 border-[12px] border-zinc-950 p-6 md:p-12 relative"
    >
      <div className="flex justify-between items-end border-b-8 border-zinc-950 pb-6 mb-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
          Satu<br/>Soal
        </h1>
        <div className="text-right">
          <div className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Waktu Tersisa</div>
          <div className={`text-5xl md:text-6xl font-black font-mono tracking-tighter leading-none ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-zinc-950'}`}>
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="font-mono font-bold text-lg md:text-xl leading-relaxed mb-12 text-justify">
        {DAILY_QUESTION.question}
      </div>

      <div className="space-y-4">
        {DAILY_QUESTION.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="w-full text-left font-mono font-bold text-lg md:text-xl p-4 md:p-6 border-4 border-zinc-950 hover:bg-zinc-950 hover:text-white active:scale-[0.97] transition-transform cursor-pointer"
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
