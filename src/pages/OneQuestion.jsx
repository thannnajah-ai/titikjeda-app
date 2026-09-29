import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabase';
import { getDailyQuestion } from '../data/dailyQuestions';
import { HelpCircle, CheckCircle2, AlertOctagon, RotateCcw } from 'lucide-react';

export default function OneQuestion() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);
  const [showHint, setShowHint] = useState(false);
  const setDailyStatus = useAppStore(state => state.setDailyStatus);
  const setLastAnswerDate = useAppStore(state => state.setLastAnswerDate);
  const dailyStatus = useAppStore(state => state.dailyStatus);
  const lastAnswerDate = useAppStore(state => state.lastAnswerDate);
  const today = new Date().toLocaleDateString('id-ID');

  const currentQuestion = getDailyQuestion();

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
    if (index === currentQuestion.correctIndex) {
      handlePass();
    } else {
      handleFail();
    }
  };

  // Layar jika sudah lolos hari ini
  if (lastAnswerDate === today && dailyStatus === 'passed') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mt-6 bg-white text-zinc-950 border-[10px] border-zinc-950 p-6 md:p-12 space-y-8"
      >
        <div className="border-b-8 border-zinc-950 pb-6 text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-950 text-white font-mono font-black text-xs uppercase px-4 py-1.5 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            STATUS: LOLOS HARI INI
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-2">
            TUNTAS.
          </h1>
          <p className="font-mono font-bold text-sm md:text-base uppercase tracking-widest text-zinc-600">
            TUGAS DISIPLIN SELESAI. KEMBALI BESOK PUKUL 00:00.
          </p>
        </div>

        {/* Pembahasan Soal */}
        <div className="border-4 border-zinc-950 bg-zinc-50 p-5 md:p-6 space-y-4 font-mono">
          <div className="flex justify-between items-center border-b-2 border-zinc-950 pb-3">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
              {currentQuestion.code} // {currentQuestion.subject}
            </span>
            <span className="text-xs font-black bg-zinc-950 text-white px-2 py-0.5 uppercase">
              KUNCI: {currentQuestion.options[currentQuestion.correctIndex].substring(0, 2)}
            </span>
          </div>

          <p className="text-sm font-bold text-zinc-800 whitespace-pre-line leading-relaxed">
            {currentQuestion.question}
          </p>

          <div className="border-t-2 border-zinc-950 pt-4 space-y-3">
            <div className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              // KONSEP KUNCI: {currentQuestion.explanation.keyConcept}
            </div>

            <div className="space-y-1.5 bg-white border-2 border-zinc-950 p-4">
              <div className="text-xs font-black uppercase text-zinc-950 mb-2">// LANGKAH PEMBUKTIAN:</div>
              {currentQuestion.explanation.steps.map((st, i) => (
                <div key={i} className="text-xs font-bold text-zinc-800 leading-relaxed">
                  {st}
                </div>
              ))}
            </div>

            <div className="border-l-4 border-red-600 bg-red-50 p-3 text-xs font-black text-red-950 uppercase leading-relaxed">
              ⚠️ JEBAKAN UTAMA: {currentQuestion.explanation.trap}
            </div>
          </div>
        </div>

        {/* Dev Reset Option */}
        <div className="text-center pt-2">
          <button
            onClick={() => setDailyStatus(null)}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-zinc-400 hover:text-zinc-950 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            [DEV] COBA LAGI (RESET STATUS HARI INI)
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto mt-6 bg-white text-zinc-950 border-[10px] border-zinc-950 p-6 md:p-12 relative"
    >
      {/* Header Info */}
      <div className="flex justify-between items-start border-b-8 border-zinc-950 pb-6 mb-8">
        <div>
          <div className="text-xs font-mono font-black uppercase tracking-widest text-zinc-500 mb-1">
            {currentQuestion.code} // {currentQuestion.subject}
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
            Satu<br/>Soal
          </h1>
          <p className="text-xs font-mono font-bold uppercase text-zinc-600 mt-2">
            TOPIK: {currentQuestion.subtopic}
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Waktu Tersisa</div>
          <div className={`text-5xl md:text-6xl font-black font-mono tracking-tighter leading-none ${timeLeft <= 15 ? 'text-red-600 animate-pulse' : 'text-zinc-950'}`}>
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Pertanyaan */}
      <div className="font-mono font-bold text-base md:text-lg leading-relaxed mb-6 text-justify whitespace-pre-line">
        {currentQuestion.question}
      </div>

      {/* Petunjuk Taktis (Hint) */}
      <div className="mb-8">
        <button
          onClick={() => setShowHint(!showHint)}
          className="inline-flex items-center gap-2 border-2 border-zinc-950 px-3 py-1 text-xs font-mono font-bold uppercase hover:bg-zinc-950 hover:text-white active:scale-[0.97] transition-transform cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          {showHint ? "SEMBUNYIKAN PETUNJUK" : "LIHAT PETUNJUK TAKTIS"}
        </button>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-3"
            >
              <div className="border-4 border-zinc-950 bg-zinc-100 p-4 font-mono text-xs font-bold leading-relaxed text-zinc-950">
                <span className="font-black bg-zinc-950 text-white px-1.5 py-0.5 mr-2 uppercase">PETUNJUK</span>
                {currentQuestion.hint}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Opsi Jawaban */}
      <div className="space-y-4">
        {currentQuestion.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="w-full text-left font-mono font-bold text-base md:text-lg p-4 md:p-5 border-4 border-zinc-950 bg-white hover:bg-zinc-950 hover:text-white active:scale-[0.97] transition-transform cursor-pointer flex items-center justify-between group"
          >
            <span>{opt}</span>
            <span className="text-xs font-mono font-black opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
              PILIH ↵
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

