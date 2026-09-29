import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Swords, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Flag, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  AlertTriangle, 
  Flame, 
  Share2, 
  Check, 
  BookOpen,
  Volume2,
  VolumeX
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { SPRINT_QUESTIONS, calculateIrtScore } from '../data/sprintQuestions';
import { useAppStore } from '../store/useAppStore';
import soundEngine from '../lib/soundEngine';

const TOTAL_TIME_SECONDS = 600; // 10 menit

export default function TryoutKilat() {
  const [stage, setStage] = useState('intro'); // 'intro' | 'in_progress' | 'result'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [flagged, setFlagged] = useState({}); // { [questionId]: boolean }
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [latestResult, setLatestResult] = useState(null);
  const [showAllExplanations, setShowAllExplanations] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isClockTicking, setIsClockTicking] = useState(false);

  const saveTryoutResult = useAppStore(state => state.saveTryoutResult);
  const tryoutHistory = useAppStore(state => state.tryoutHistory) || [];

  const timerRef = useRef(null);

  // Timer Countdown Logic
  useEffect(() => {
    if (stage === 'in_progress') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishExam();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, answers]);

  // Audio Ticking Clock toggle
  const toggleClockSound = () => {
    try {
      soundEngine.init();
      if (!isClockTicking) {
        soundEngine.toggleTrack('clock', true, 0.4);
        setIsClockTicking(true);
      } else {
        soundEngine.toggleTrack('clock', false);
        setIsClockTicking(false);
      }
    } catch (e) {
      console.warn("Audio toggle error:", e);
    }
  };

  // Start exam
  const handleStartExam = () => {
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setTimeLeft(TOTAL_TIME_SECONDS);
    setTimeSpent(0);
    setIsConfirmOpen(false);
    setLatestResult(null);
    setShowAllExplanations(false);
    setStage('in_progress');
  };

  // Answer selection
  const handleSelectOption = (questionId, optIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optIndex
    }));
  };

  // Toggle flag/doubt
  const handleToggleFlag = (questionId) => {
    setFlagged(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Finish exam and calculate score
  const finishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isClockTicking) {
      soundEngine.toggleTrack('clock', false);
      setIsClockTicking(false);
    }

    const result = calculateIrtScore({
      answers,
      timeSpentSeconds: timeSpent
    });

    setLatestResult(result);
    saveTryoutResult({
      ...result,
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      timeSpentSeconds: timeSpent
    });

    setIsConfirmOpen(false);
    setStage('result');
  };

  const currentQ = SPRINT_QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = SPRINT_QUESTIONS.length - answeredCount;

  // Format time MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Share text copy
  const handleShare = () => {
    if (!latestResult) return;
    const text = `⚔️ HASIL TRYOUT KILAT PARETO // TITIKJEDA\n` +
      `Skor IRT: ${latestResult.score} / 1000\n` +
      `Status: ${latestResult.tier}\n` +
      `Akurasi: ${latestResult.accuracy}% (${latestResult.correctCount}/${SPRINT_QUESTIONS.length} Soal Benar)\n` +
      `Waktu: ${formatTime(timeSpent)} / 10:00\n\n` +
      `#ZenUTBK #TitikJeda #DisiplinPareto`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    });
  };

  // ==========================================
  // 1. INTRO STAGE
  // ==========================================
  if (stage === 'intro') {
    return (
      <div className="space-y-8 font-mono max-w-4xl mx-auto">
        {/* Banner Title */}
        <div className="border-b-4 md:border-b-8 border-zinc-950 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 bg-red-600 rounded-none animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-red-600">
              SIMULASI UJIAN KILAT // TEORI RESPON BUTIR (IRT)
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-none">
            TRYOUT KILAT PARETO
          </h1>
          <p className="text-xs md:text-sm text-zinc-600 font-bold uppercase tracking-wider mt-3 max-w-2xl">
            10 soal berbobot tinggi dalam 10 menit (60 detik/soal). Uji ketahanan mental, presisi logika, dan ketajaman waktu ujian nyata.
          </p>
        </div>

        {/* Tactical Rules Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-4 border-zinc-950 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-2 text-zinc-950">
              <Timer className="w-5 h-5 text-red-600" />
              <h3 className="font-black text-sm uppercase">10 MENIT MUTLAK</h3>
            </div>
            <p className="text-xs text-zinc-600 font-bold uppercase leading-relaxed">
              Waktu 600 detik berjalan tanpa jeda. Selesai atau tidak, sistem otomatis mengumpulkan pada detik 00:00.
            </p>
          </div>

          <div className="bg-white border-4 border-zinc-950 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-2 text-zinc-950">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-sm uppercase">KALKULASI SKOR IRT</h3>
            </div>
            <p className="text-xs text-zinc-600 font-bold uppercase leading-relaxed">
              Skor standar 200 - 1000. Soal Tier-3 memberi bobot lebih tinggi. Jawaban sembrono dikenai penalti kemampuan laten.
            </p>
          </div>

          <div className="bg-white border-4 border-zinc-950 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-2 text-zinc-950">
              <Flame className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-sm uppercase">PROTEKSI STREAK</h3>
            </div>
            <p className="text-xs text-zinc-600 font-bold uppercase leading-relaxed">
              Raih skor ≥ 600 untuk otomatis mengamankan status streak harian Anda di Heatmap Konsistensi!
            </p>
          </div>
        </div>

        {/* Start Button */}
        <div className="bg-zinc-950 text-white border-4 md:border-8 border-zinc-950 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]">
          <div>
            <div className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">
              [PROTOKOL PERANG SIAP]
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              KONSENTRASI PENUH. JANGAN MENYERAH.
            </h2>
            <p className="text-xs text-zinc-400 font-bold uppercase mt-1">
              Siapkan kertas buram & pulpen. Matikan notifikasi lain.
            </p>
          </div>
          <button
            onClick={handleStartExam}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-black px-8 py-5 text-base md:text-lg uppercase tracking-widest border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:scale-95 transition-transform flex items-center justify-center gap-3 shrink-0 cursor-pointer"
          >
            <Swords className="w-6 h-6" />
            <span>MULAI SPRINT SEKARANG</span>
          </button>
        </div>

        {/* Previous Runs History */}
        {tryoutHistory.length > 0 && (
          <div className="bg-zinc-50 border-4 border-zinc-950 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-sm uppercase tracking-widest text-zinc-950 mb-4 flex items-center gap-2">
              <span>📋</span> RIWAYAT SPRINT SEBELUMNYA ({tryoutHistory.length} SESI)
            </h3>
            <div className="space-y-2">
              {tryoutHistory.slice(0, 5).map((item, idx) => (
                <div key={idx} className="bg-white border-2 border-zinc-950 p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-black text-zinc-950 mr-3">{item.date}</span>
                    <span className="text-zinc-500 font-bold uppercase mr-2">{item.tier}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-600 font-bold">{item.correctCount}/10 BENAR</span>
                    <span className="font-black text-sm bg-zinc-950 text-white px-2.5 py-1">
                      {item.score} / 1000
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 2. IN-PROGRESS EXAM STAGE
  // ==========================================
  if (stage === 'in_progress') {
    const isFlagged = flagged[currentQ.id];
    const selectedOption = answers[currentQ.id];

    return (
      <div className="space-y-6 font-mono max-w-4xl mx-auto pb-12">
        {/* Top Tactical Status Bar */}
        <div className="bg-white border-4 md:border-8 border-zinc-950 p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-zinc-950 text-white font-black text-xs md:text-sm px-3 py-1 uppercase">
                SOAL {currentIndex + 1} / {SPRINT_QUESTIONS.length}
              </span>
              <span className="text-xs font-black uppercase text-zinc-500">
                {currentQ.code}
              </span>
              <span className="hidden md:inline-block text-[10px] font-black uppercase px-2 py-0.5 border border-zinc-950 bg-zinc-100">
                {currentQ.difficulty}
              </span>
            </div>

            {/* Timer + Audio Controls */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                onClick={toggleClockSound}
                className={`p-2 border-2 border-zinc-950 text-xs font-black uppercase flex items-center gap-1.5 transition-colors ${
                  isClockTicking ? 'bg-amber-400 text-black' : 'bg-zinc-100 text-zinc-600'
                }`}
                title="Detik Jam Analog (Sound Engine)"
              >
                {isClockTicking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">DETIK JAM</span>
              </button>

              <div className={`flex items-center gap-2 border-4 border-zinc-950 px-4 py-1.5 font-black text-lg md:text-xl tracking-wider ${
                timeLeft <= 60 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : timeLeft <= 180 
                    ? 'bg-amber-400 text-black' 
                    : 'bg-zinc-950 text-white'
              }`}>
                <Timer className="w-5 h-5 shrink-0" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigator 1-10 */}
          <div className="flex items-center gap-1.5 md:gap-2 mt-4 pt-4 border-t-2 border-zinc-200 overflow-x-auto pb-1 scrollbar-hide">
            {SPRINT_QUESTIONS.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isItemFlagged = flagged[q.id];
              const isCurrent = idx === currentIndex;

              let btnStyle = "bg-white text-zinc-700 border-zinc-300";
              if (isAnswered) btnStyle = "bg-zinc-950 text-white border-zinc-950";
              if (isItemFlagged) btnStyle = "bg-amber-400 text-black border-amber-600";
              if (isCurrent) btnStyle += " ring-2 ring-red-600 ring-offset-2 scale-105 font-black";

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 md:w-10 md:h-10 border-2 font-mono text-xs md:text-sm font-bold flex items-center justify-center shrink-0 cursor-pointer transition-transform ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Area Box */}
        <div className="bg-white border-4 md:border-8 border-zinc-950 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {/* Subtopic and Flag Action */}
          <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-3 mb-6">
            <div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500 block">
                SUBTES // {currentQ.subject}
              </span>
              <h2 className="text-sm md:text-base font-black uppercase text-zinc-950">
                {currentQ.subtopic}
              </h2>
            </div>
            <button
              onClick={() => handleToggleFlag(currentQ.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase border-2 transition-transform active:scale-95 ${
                isFlagged 
                  ? 'bg-amber-400 text-black border-zinc-950' 
                  : 'bg-zinc-100 text-zinc-600 border-zinc-300 hover:border-zinc-950'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-black' : ''}`} />
              <span>{isFlagged ? 'DITANDAI RAGU' : 'TANDAI RAGU'}</span>
            </button>
          </div>

          {/* Question Text */}
          <div className="mb-8">
            <p className="text-sm md:text-base text-zinc-950 font-bold leading-relaxed whitespace-pre-wrap">
              {currentQ.question}
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`w-full text-left p-4 md:p-5 border-2 md:border-4 font-bold text-xs md:text-sm uppercase tracking-wide transition-all active:scale-[0.99] flex items-start gap-4 cursor-pointer ${
                    isSelected 
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]' 
                      : 'bg-zinc-50 text-zinc-800 border-zinc-300 hover:border-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  <span className={`w-6 h-6 border-2 flex items-center justify-center shrink-0 font-black text-xs ${
                    isSelected 
                      ? 'bg-red-600 text-white border-red-600' 
                      : 'bg-white text-zinc-900 border-zinc-950'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="leading-snug pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Nav Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 border-4 border-zinc-950 font-black text-xs uppercase ${
                currentIndex === 0 
                  ? 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed' 
                  : 'bg-white hover:bg-zinc-100 text-zinc-950 active:scale-95 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>SEBELUMNYA</span>
            </button>

            <button
              onClick={() => setCurrentIndex(prev => Math.min(SPRINT_QUESTIONS.length - 1, prev + 1))}
              disabled={currentIndex === SPRINT_QUESTIONS.length - 1}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 border-4 border-zinc-950 font-black text-xs uppercase ${
                currentIndex === SPRINT_QUESTIONS.length - 1 
                  ? 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed' 
                  : 'bg-white hover:bg-zinc-100 text-zinc-950 active:scale-95 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <span>SELANJUTNYA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsConfirmOpen(true)}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3.5 text-xs md:text-sm uppercase tracking-widest border-4 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>SELESAIKAN SPRINT ({answeredCount}/10 TERISI)</span>
          </button>
        </div>

        {/* Finish Confirmation Modal */}
        <AnimatePresence>
          {isConfirmOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border-4 md:border-8 border-zinc-950 p-6 md:p-8 max-w-lg w-full font-mono shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex items-center gap-3 text-red-600 mb-4">
                  <AlertTriangle className="w-7 h-7 shrink-0" />
                  <h3 className="font-black text-xl uppercase tracking-tighter text-zinc-950">
                    KONFIRMASI PENGUMPULAN
                  </h3>
                </div>

                {unansweredCount > 0 ? (
                  <div className="bg-amber-100 border-2 border-amber-500 p-4 mb-6 text-xs text-amber-950 font-bold uppercase leading-relaxed">
                    ⚠️ PERHATIAN: Masih ada {unansweredCount} soal yang belum Anda jawab. Soal kosong tidak menambah poin IRT. Yakin ingin mengumpulkan sekarang?
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600 font-bold uppercase mb-6 leading-relaxed">
                    Semua 10 soal telah terisi. Sistem akan mengalkulasi skor kemampuan laten IRT dan menyusun evaluasi kelemahan Anda.
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    onClick={() => setIsConfirmOpen(false)}
                    className="w-full sm:w-auto px-5 py-2.5 border-2 border-zinc-950 font-black text-xs uppercase hover:bg-zinc-100 cursor-pointer"
                  >
                    KEMBALI KE SOAL
                  </button>
                  <button
                    onClick={finishExam}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black px-6 py-2.5 border-2 border-zinc-950 text-xs uppercase tracking-widest cursor-pointer"
                  >
                    KUMPULKAN & LIHAT RAPOR
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ==========================================
  // 3. RESULT EVALUATION STAGE (RAPOR IRT)
  // ==========================================
  if (stage === 'result' && latestResult) {
    const isStreakSaved = latestResult.score >= 600;

    return (
      <div className="space-y-8 font-mono max-w-4xl mx-auto pb-16">
        {/* Header Rapor */}
        <div className="border-b-4 md:border-b-8 border-zinc-950 pb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 bg-red-600 rounded-none"></span>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                RAPOR KELULUSAN // SIMULASI IRT
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-none">
              HASIL SPRINT KILAT
            </h1>
            <p className="text-xs md:text-sm text-zinc-600 font-bold uppercase tracking-wider mt-2">
              Waktu pengerjaan: {formatTime(timeSpent)} / 10:00. Evaluasi kemampuan laten terhitung.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="bg-white hover:bg-zinc-100 border-4 border-zinc-950 px-4 py-2.5 text-xs font-black uppercase flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 cursor-pointer"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedShare ? 'TERSALIN!' : 'BAGIKAN RAPOR'}</span>
            </button>
            <button
              onClick={handleStartExam}
              className="bg-zinc-950 hover:bg-zinc-800 text-white border-4 border-zinc-950 px-5 py-2.5 text-xs font-black uppercase flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>COBA LAGI</span>
            </button>
          </div>
        </div>

        {/* Master Score Board */}
        <div className="bg-zinc-950 text-white border-4 md:border-8 border-zinc-950 p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b-2 border-zinc-800">
            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
                PREDIKSI SKOR UTBK 2026
              </span>
              <div className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
                {latestResult.score}
                <span className="text-xl md:text-2xl text-zinc-500 font-normal"> / 1000</span>
              </div>
            </div>

            <div className={`p-4 border-4 max-w-sm ${latestResult.badgeColor}`}>
              <span className="text-xs font-black uppercase tracking-widest block mb-1">
                {latestResult.tier}
              </span>
              <p className="text-xs leading-relaxed font-bold">
                {latestResult.tierDesc}
              </p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-center">
            <div className="bg-zinc-900 border-2 border-zinc-800 p-3">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">BENAR</span>
              <span className="text-2xl font-black text-emerald-400">{latestResult.correctCount} / 10</span>
            </div>
            <div className="bg-zinc-900 border-2 border-zinc-800 p-3">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">SALAH</span>
              <span className="text-2xl font-black text-red-400">{latestResult.wrongCount} / 10</span>
            </div>
            <div className="bg-zinc-900 border-2 border-zinc-800 p-3">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">AKURASI</span>
              <span className="text-2xl font-black text-amber-400">{latestResult.accuracy}%</span>
            </div>
            <div className="bg-zinc-900 border-2 border-zinc-800 p-3">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">WAKTU TEMPUH</span>
              <span className="text-2xl font-black text-white">{formatTime(timeSpent)}</span>
            </div>
          </div>
        </div>

        {/* Streak Impact Notification */}
        {isStreakSaved ? (
          <div className="bg-amber-400 border-4 md:border-8 border-zinc-950 p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-zinc-950 shrink-0 animate-bounce" />
              <div>
                <h3 className="font-black text-base md:text-lg uppercase text-zinc-950 leading-none">
                  STREAK KONSISTENSI HARI INI TERAMANKAN!
                </h3>
                <p className="text-xs font-bold uppercase text-zinc-900 mt-1">
                  Skor Anda ≥ 600. Poin disiplin otomatis dicatat di Heatmap Konsistensi.
                </p>
              </div>
            </div>
            <NavLink
              to="/streak"
              className="bg-zinc-950 text-white font-black px-4 py-2 text-xs uppercase tracking-widest shrink-0"
            >
              LIHAT HEATMAP ↗
            </NavLink>
          </div>
        ) : (
          <div className="bg-zinc-100 border-4 border-zinc-950 p-4 text-xs font-bold uppercase text-zinc-700 flex items-center justify-between">
            <span>Skor di bawah 600 belum memenuhi syarat proteksi streak otomatis. Selesaikan '1 Soal Sehari' untuk menyelamatkan streak!</span>
            <NavLink to="/one" className="text-red-600 font-black underline ml-2 shrink-0">
              KERJAKAN 1 SOAL →
            </NavLink>
          </div>
        )}

        {/* Subtest Accuracy Breakdown */}
        <div className="bg-white border-4 md:border-8 border-zinc-950 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-lg uppercase tracking-tight text-zinc-950 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-zinc-950" />
            DIAGNOSIS KELEMAHAN PER SUBTES
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(latestResult.subtestBreakdown).map(([sub, data]) => {
              const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              const isPerfect = pct === 100;
              return (
                <div key={sub} className="bg-zinc-50 border-2 border-zinc-950 p-3">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">{sub}</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-black text-zinc-950">{data.correct}/{data.total}</span>
                    <span className={`text-xs font-black ${isPerfect ? 'text-emerald-600' : 'text-red-600'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 h-2 mt-2">
                    <div 
                      className={`h-2 ${pct >= 70 ? 'bg-zinc-950' : 'bg-red-600'}`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complete Solutions / Explanations */}
        <div className="bg-white border-4 md:border-8 border-zinc-950 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-zinc-950 pb-4 mb-6">
            <div>
              <h3 className="font-black text-xl uppercase tracking-tighter text-zinc-950">
                BEDAH KUNCI JAWABAN & JEBAKAN
              </h3>
              <p className="text-xs text-zinc-600 font-bold uppercase mt-0.5">
                Kupas tuntas 10 soal untuk membasmi blindspot Anda sebelum UTBK resmi.
              </p>
            </div>
            <button
              onClick={() => setShowAllExplanations(prev => !prev)}
              className="bg-zinc-200 hover:bg-zinc-300 font-black text-xs uppercase px-4 py-2 border-2 border-zinc-950 cursor-pointer"
            >
              {showAllExplanations ? 'TUTUP SEMUA' : 'BUKA SEMUA PEMBAHASAN'}
            </button>
          </div>

          <div className="space-y-6">
            {SPRINT_QUESTIONS.map((q, idx) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correctIndex;
              const isUnanswered = userAns === undefined;

              return (
                <div 
                  key={q.id}
                  className={`border-4 p-5 ${
                    isCorrect 
                      ? 'border-emerald-600 bg-emerald-50/30' 
                      : 'border-red-600 bg-red-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 text-white font-black text-xs flex items-center justify-center ${
                        isCorrect ? 'bg-emerald-600' : 'bg-red-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-black text-xs uppercase text-zinc-950">
                        {q.code} // {q.subtopic}
                      </span>
                    </div>

                    <div className="text-xs font-black uppercase">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> BENAR
                        </span>
                      ) : isUnanswered ? (
                        <span className="text-zinc-500">TIDAK DIJAWAB</span>
                      ) : (
                        <span className="text-red-700 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> SALAH
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-zinc-950 font-bold mb-4 whitespace-pre-wrap">
                    {q.question}
                  </p>

                  <div className="text-xs font-bold space-y-1 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">JAWABAN ANDA:</span>
                      <span className={isCorrect ? 'text-emerald-700 font-black' : 'text-red-600 font-black'}>
                        {userAns !== undefined ? q.options[userAns] : '[KOSONG]'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">KUNCI BENAR:</span>
                        <span className="text-zinc-950 font-black">{q.options[q.correctIndex]}</span>
                      </div>
                    )}
                  </div>

                  {/* Explanation Steps */}
                  <div className="bg-white border-2 border-zinc-950 p-4 space-y-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                        KONSEP KUNCI:
                      </span>
                      <span className="text-xs font-black uppercase text-zinc-950">
                        {q.explanation.keyConcept}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                        LANGKAH PENALARAN:
                      </span>
                      <div className="space-y-1">
                        {q.explanation.steps.map((st, sIdx) => (
                          <p key={sIdx} className="text-xs text-zinc-800 font-mono">
                            {st}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-zinc-200 pt-2 text-xs text-red-600 font-bold">
                      <span className="font-black uppercase mr-1">⚠️ JEBAKAN UTAMA:</span>
                      {q.explanation.trap}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
