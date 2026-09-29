import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Sparkles, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  AlertTriangle, 
  BookOpen, 
  Flame,
  Copy,
  Check
} from 'lucide-react';
import { analyzeQuestionWithAI, PRESET_SAMPLE_QUESTIONS } from '../lib/deconstructEngine';

export default function DeconstructSoal() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Twin Question Interactive State
  const [twinSelectedOption, setTwinSelectedOption] = useState(null);
  const [twinSubmitted, setTwinSubmitted] = useState(false);
  const [twinTimer, setTwinTimer] = useState(60);
  const [isTwinTimerActive, setIsTwinTimerActive] = useState(false);
  const [copiedFastWay, setCopiedFastWay] = useState(false);

  // Twin timer countdown
  useEffect(() => {
    let interval = null;
    if (isTwinTimerActive && twinTimer > 0 && !twinSubmitted) {
      interval = setInterval(() => {
        setTwinTimer(prev => prev - 1);
      }, 1000);
    } else if (twinTimer === 0 && !twinSubmitted) {
      setTwinSubmitted(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTwinTimerActive, twinTimer, twinSubmitted]);

  // Handle analysis trigger
  const handleAnalyze = async (textToAnalyze) => {
    const target = textToAnalyze || inputText;
    if (!target.trim() || isLoading) return;

    setIsLoading(true);
    setAnalysisResult(null);
    setTwinSelectedOption(null);
    setTwinSubmitted(false);
    setTwinTimer(60);
    setIsTwinTimerActive(false);

    try {
      const res = await analyzeQuestionWithAI(target);
      setAnalysisResult(res);
      // Auto start twin timer when analysis loads
      setIsTwinTimerActive(true);
    } catch (e) {
      console.error("Deconstruct error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Load preset sample
  const handleLoadPreset = (preset) => {
    setInputText(preset.text);
    handleAnalyze(preset.text);
  };

  // Copy fast-way text
  const handleCopyFastWay = () => {
    if (!analysisResult?.fastWay) return;
    navigator.clipboard.writeText(analysisResult.fastWay).then(() => {
      setCopiedFastWay(true);
      setTimeout(() => setCopiedFastWay(false), 2000);
    });
  };

  return (
    <div className="space-y-8 font-mono max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b-4 md:border-b-8 border-zinc-950 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-3 bg-red-600 rounded-none animate-pulse"></span>
          <span className="text-xs font-black uppercase tracking-widest text-red-600">
            ARSENAL TAKTIS // PRINSIP PARETO 80/20
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-none">
          BEDAH SOAL AI
        </h1>
        <p className="text-xs md:text-sm text-zinc-600 font-bold uppercase tracking-wider mt-3 max-w-2xl">
          Dekonstruksi soal rumit menjadi jalan pintas &lt; 60 detik. Bongkar cara konvensional sekolah yang buang waktu dan uji pemahaman langsung dengan 1 soal kembaran.
        </p>
      </div>

      {/* Preset Quick Loader Buttons */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
          COBA CONTOH SOAL UTBK NYATA (KLIK 1 KALI):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {PRESET_SAMPLE_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadPreset(item)}
              className="bg-zinc-50 hover:bg-zinc-950 hover:text-white border-2 border-zinc-950 p-2.5 text-left text-xs font-bold uppercase transition-colors active:scale-95 cursor-pointer flex flex-col justify-between"
            >
              <span className="text-[9px] text-zinc-400 block">{item.subtest}</span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Question Input Box */}
      <div className="bg-white border-4 md:border-8 border-zinc-950 p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-950 block mb-2 flex items-center justify-between">
          <span>INPUT TEKS SOAL (PASTE DARI TRYOUT / BUKU BIMBEL ANDA):</span>
          <span className="text-[10px] text-zinc-400 font-normal">Ketik atau paste teks soal lengkap</span>
        </label>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Contoh: 'Persamaan kuadrat 2x² - 8x + 3 = 0 memiliki akar-akar p dan q. Berapakah nilai dari 1/p + 1/q?' atau paste teks soal bacaan/silogisme..."
          rows={5}
          className="w-full bg-zinc-50 border-2 border-zinc-950 p-4 text-xs md:text-sm font-mono text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:bg-white resize-y"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <p className="text-[10px] text-zinc-500 font-bold uppercase">
            AI menganalisis konsep inti, memangkas langkah lambat, dan menyusun soal kembaran.
          </p>
          <button
            onClick={() => handleAnalyze()}
            disabled={!inputText.trim() || isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 border-4 border-zinc-950 font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform ${
              !inputText.trim() || isLoading
                ? 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white active:scale-95 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin inline-block"></span>
                <span>MEMBEDAH SOAL...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-400" />
                <span>BEDAH JALAN PINTAS (&lt; 60s)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output Section */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top Badge Classification */}
          <div className="bg-zinc-950 text-white p-4 border-4 border-zinc-950 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-red-600 text-white px-2.5 py-1 text-xs font-black uppercase">
                {analysisResult.subtest}
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300">
                {analysisResult.subtopic}
              </span>
            </div>
            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-amber-400">
              {analysisResult.difficulty}
            </span>
          </div>

          {/* Core Concept Banner */}
          <div className="bg-amber-400 border-4 border-zinc-950 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-950 block mb-1">
              💡 INTISARI KONSEP PARETO:
            </span>
            <p className="text-xs md:text-sm font-black uppercase text-zinc-950 leading-relaxed">
              {analysisResult.coreConcept}
            </p>
          </div>

          {/* Comparison Bento: Slow Way vs Fast Way */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The Slow Way */}
            <div className="bg-zinc-100 border-4 border-zinc-950 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-zinc-300">
                <span className="text-lg">🐢</span>
                <div>
                  <h3 className="font-black text-xs uppercase text-zinc-700">CARA KONVENSIONAL SEKOLAH</h3>
                  <span className="text-[9px] text-red-600 font-bold uppercase">Memakan 3 - 4 menit // Buang Waktu</span>
                </div>
              </div>
              <p className="text-xs text-zinc-700 font-mono leading-relaxed whitespace-pre-wrap">
                {analysisResult.slowWay}
              </p>
            </div>

            {/* The Fast Way Pareto */}
            <div className="bg-white border-4 border-zinc-950 p-5 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] relative">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-zinc-950">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <div>
                    <h3 className="font-black text-xs uppercase text-zinc-950">JALAN PINTAS PARETO</h3>
                    <span className="text-[9px] text-emerald-600 font-black uppercase">Tuntas dalam &lt; 60 Detik</span>
                  </div>
                </div>
                <button
                  onClick={handleCopyFastWay}
                  className="text-[10px] font-black uppercase flex items-center gap-1 text-zinc-500 hover:text-zinc-950"
                  title="Salin Jalan Pintas"
                >
                  {copiedFastWay ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFastWay ? 'TERSALIN' : 'SALIN'}</span>
                </button>
              </div>
              <p className="text-xs md:text-sm text-zinc-950 font-mono font-bold leading-relaxed whitespace-pre-wrap">
                {analysisResult.fastWay}
              </p>
            </div>
          </div>

          {/* Trap Explanation */}
          <div className="bg-red-50 border-4 border-red-600 p-5 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <h3 className="font-black text-xs uppercase">JEBAKAN PEMBUAT SOAL UTBK</h3>
            </div>
            <p className="text-xs text-red-900 font-bold leading-relaxed">
              {analysisResult.trapExplanation}
            </p>
          </div>

          {/* Interactive Twin Question Section */}
          {analysisResult.twinQuestion && (
            <div className="bg-white border-4 md:border-8 border-zinc-950 p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Twin Header & Timer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-zinc-950 pb-4 mb-6 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      DRILL VERIFIKASI PEMAHAMAN
                    </span>
                  </div>
                  <h3 className="font-black text-lg md:text-xl uppercase tracking-tight text-zinc-950">
                    SOAL KEMBARAN // TUNTASKAN &lt; 60 DETIK
                  </h3>
                </div>

                <div className={`flex items-center gap-2 border-2 md:border-4 border-zinc-950 px-4 py-1.5 font-black text-sm md:text-base ${
                  twinTimer <= 15 ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-950 text-white'
                }`}>
                  <Timer className="w-4 h-4" />
                  <span>00:{twinTimer.toString().padStart(2, '0')}</span>
                </div>
              </div>

              {/* Twin Question Text */}
              <div className="mb-6">
                <p className="text-xs md:text-sm text-zinc-950 font-bold leading-relaxed whitespace-pre-wrap">
                  {analysisResult.twinQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5 mb-6">
                {analysisResult.twinQuestion.options.map((opt, optIdx) => {
                  const isSelected = twinSelectedOption === optIdx;
                  const isCorrect = optIdx === analysisResult.twinQuestion.correctIndex;

                  let optClass = "bg-zinc-50 text-zinc-800 border-zinc-300 hover:border-zinc-950";
                  if (twinSubmitted) {
                    if (isCorrect) {
                      optClass = "bg-emerald-600 text-white border-emerald-600 font-black";
                    } else if (isSelected && !isCorrect) {
                      optClass = "bg-red-600 text-white border-red-600";
                    } else {
                      optClass = "bg-zinc-100 text-zinc-400 border-zinc-200 opacity-60";
                    }
                  } else if (isSelected) {
                    optClass = "bg-zinc-950 text-white border-zinc-950 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]";
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={twinSubmitted}
                      onClick={() => setTwinSelectedOption(optIdx)}
                      className={`w-full text-left p-3.5 border-2 md:border-4 font-bold text-xs md:text-sm uppercase transition-all flex items-center gap-3 cursor-pointer ${optClass}`}
                    >
                      <span className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 font-black text-xs ${
                        isSelected ? 'bg-red-600 text-white border-red-600' : 'bg-white text-zinc-900 border-zinc-950'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Twin Submit Button or Result Card */}
              {!twinSubmitted ? (
                <div className="flex justify-end">
                  <button
                    disabled={twinSelectedOption === null}
                    onClick={() => setTwinSubmitted(true)}
                    className={`px-8 py-3 border-4 border-zinc-950 font-black text-xs uppercase tracking-widest cursor-pointer ${
                      twinSelectedOption === null
                        ? 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95'
                    }`}
                  >
                    KUNCI JAWABAN ({60 - twinTimer} DETIK)
                  </button>
                </div>
              ) : (
                <div className="border-t-4 border-zinc-950 pt-5 space-y-4">
                  {twinSelectedOption === analysisResult.twinQuestion.correctIndex ? (
                    <div className="bg-emerald-500 border-4 border-zinc-950 p-4 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                        <div>
                          <h4 className="font-black text-sm uppercase leading-none">
                            LUAR BIASA! JAWABAN TEPAT!
                          </h4>
                          <p className="text-[10px] font-bold uppercase text-zinc-900 mt-1">
                            Kamu menuntaskan soal kembaran dalam waktu {60 - twinTimer} detik. Pola Pareto berhasil diserap!
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-600 border-4 border-zinc-950 p-4 text-white flex items-center gap-2">
                      <XCircle className="w-6 h-6 text-white shrink-0" />
                      <div>
                        <h4 className="font-black text-sm uppercase leading-none">
                          BELUM TEPAT ATAU WAKTU HABIS
                        </h4>
                        <p className="text-[10px] font-bold uppercase text-red-100 mt-1">
                          Kunci Benar: {analysisResult.twinQuestion.options[analysisResult.twinQuestion.correctIndex]}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Fast Solution breakdown */}
                  <div className="bg-zinc-50 border-2 border-zinc-950 p-4">
                    <span className="text-[10px] font-black uppercase text-zinc-500 block mb-1">
                      PEMBAHASAN KILAT SOAL KEMBARAN:
                    </span>
                    <p className="text-xs text-zinc-900 font-mono font-bold leading-relaxed">
                      {analysisResult.twinQuestion.fastSolution}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
