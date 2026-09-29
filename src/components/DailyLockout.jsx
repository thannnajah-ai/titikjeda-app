import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { getDailyQuestion } from '../data/dailyQuestions';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function DailyLockout() {
  const dailyStatus = useAppStore(state => state.dailyStatus);
  const lastAnswerDate = useAppStore(state => state.lastAnswerDate);
  const today = new Date().toLocaleDateString('id-ID');
  const [showExplanation, setShowExplanation] = useState(false);

  const isFailedToday = dailyStatus === 'failed' && lastAnswerDate === today;
  const failedQuestion = getDailyQuestion();

  return (
    <AnimatePresence>
      {isFailedToday && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1, ease: 'easeOut' }} // Hukuman instan
          className="fixed inset-0 z-[10000] bg-black text-white flex flex-col items-center justify-center p-4 md:p-8 text-center select-none overflow-y-auto"
        >
          <div className="max-w-3xl w-full border-4 border-red-600 p-8 md:p-12 bg-black relative my-auto">
            <h1 className="text-6xl md:text-8xl font-black mb-6 text-red-600 uppercase tracking-tighter leading-none">
              GAGAL.
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 font-mono uppercase tracking-widest leading-relaxed mb-8">
              Anda dinilai tidak layak hari ini.<br/>
              Akses sistem ditutup mutlak hingga 00:00.
            </p>

            {/* Rekam Pembahasan Kesalahan */}
            <div className="text-left font-mono border-2 border-red-900 bg-zinc-950 p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  REKAM JEJAK KESALAHAN // {failedQuestion.code}
                </span>
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-xs font-bold uppercase underline text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {showExplanation ? 'TUTUP BEDAH SOAL' : 'LIHAT MENGAPA ANDA SALAH'}
                  {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showExplanation && (
                <div className="mt-4 pt-4 border-t border-red-900/60 space-y-4 text-xs">
                  <div>
                    <div className="text-zinc-500 uppercase font-black mb-1">// PERTANYAAN</div>
                    <div className="text-zinc-300 font-bold whitespace-pre-line leading-relaxed">{failedQuestion.question}</div>
                  </div>

                  <div className="bg-red-950/40 border border-red-700 p-3">
                    <span className="text-red-400 font-black uppercase mr-2">KUNCI JAWABAN BENAR:</span>
                    <span className="text-white font-bold">{failedQuestion.options[failedQuestion.correctIndex]}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-zinc-500 uppercase font-black">// LANGKAH PEMBUKTIAN</div>
                    {failedQuestion.explanation.steps.map((step, i) => (
                      <div key={i} className="text-zinc-300 leading-relaxed font-bold">{step}</div>
                    ))}
                  </div>

                  <div className="border-l-2 border-red-500 pl-3 text-red-400 font-bold">
                    ⚠️ JEBAKAN: {failedQuestion.explanation.trap}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

