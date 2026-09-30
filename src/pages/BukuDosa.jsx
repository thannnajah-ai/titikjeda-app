import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookX, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  RotateCcw, 
  ArrowRight, 
  Trash2, 
  Swords, 
  HelpCircle,
  Eye,
  EyeOff,
  Filter,
  Check,
  BrainCircuit
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import ErrorTaxonomyModal from '../components/ErrorTaxonomyModal';

export default function BukuDosa() {
  const errorLog = useAppStore(state => state.errorLog) || [];
  const redeemMistake = useAppStore(state => state.redeemMistake);
  const removeMistake = useAppStore(state => state.removeMistake);
  const clearErrorLog = useAppStore(state => state.clearErrorLog);

  // UI state
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'gauntlet'
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'unresolved' | 'redeemed'
  const [expandedExplanations, setExpandedExplanations] = useState({});
  const [taxonomyModalError, setTaxonomyModalError] = useState(null);

  // Gauntlet (Tebus Dosa Quiz) State
  const [gauntletIndex, setGauntletIndex] = useState(0);
  const [gauntletAnswer, setGauntletAnswer] = useState(null);
  const [gauntletSubmitted, setGauntletSubmitted] = useState(false);
  const [gauntletSuccess, setGauntletSuccess] = useState(false);

  // Metrics
  const totalErrors = errorLog.length;
  const unresolvedErrors = errorLog.filter(e => e.status === 'unresolved');
  const redeemedErrors = errorLog.filter(e => e.status === 'redeemed');
  const unresolvedCount = unresolvedErrors.length;
  const redeemedCount = redeemedErrors.length;
  const redemptionRate = totalErrors > 0 ? Math.round((redeemedCount / totalErrors) * 100) : 0;

  // Smart Trap Taxonomy Calculations
  const blindSpotCount = errorLog.filter(e => e.taxonomy === 'BLIND_SPOT').length;
  const rushErrorCount = errorLog.filter(e => e.taxonomy === 'RUSH_ERROR').length;
  const timePanicCount = errorLog.filter(e => e.taxonomy === 'TIME_PANIC').length;
  const taggedCount = blindSpotCount + rushErrorCount + timePanicCount;
  const blindSpotPct = taggedCount > 0 ? Math.round((blindSpotCount / taggedCount) * 100) : 0;
  const rushErrorPct = taggedCount > 0 ? Math.round((rushErrorCount / taggedCount) * 100) : 0;
  const timePanicPct = taggedCount > 0 ? Math.round((timePanicCount / taggedCount) * 100) : 0;

  // Filtered List
  const filteredErrors = errorLog.filter(item => {
    const matchSubject = selectedSubject === 'ALL' || item.subject === selectedSubject;
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchSubject && matchStatus;
  });

  const subjects = ['ALL', ...new Set(errorLog.map(e => e.subject).filter(Boolean))];

  // Toggle explanation expand
  const toggleExplanation = (id) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Gauntlet Quiz Flow
  const currentGauntletItem = unresolvedErrors[gauntletIndex] || null;

  const handleGauntletSubmit = () => {
    if (gauntletAnswer === null || !currentGauntletItem) return;
    setGauntletSubmitted(true);
    const isCorrect = gauntletAnswer === currentGauntletItem.correctIndex;
    setGauntletSuccess(isCorrect);
    if (isCorrect) {
      redeemMistake(currentGauntletItem.id);
    }
  };

  const handleNextGauntlet = () => {
    setGauntletAnswer(null);
    setGauntletSubmitted(false);
    setGauntletSuccess(false);
    if (gauntletIndex >= unresolvedErrors.length - 1) {
      setGauntletIndex(0);
      if (unresolvedErrors.length <= 1) {
        setActiveTab('catalog');
      }
    } else {
      setGauntletIndex(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header Banner */}
      <div className="border-4 md:border-8 border-zinc-950 bg-zinc-950 text-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-3 bg-red-600 rounded-none animate-ping"></span>
          <span className="text-xs font-black uppercase tracking-widest text-red-500">
            ARSIP KELEMAHAN // SPARTAN ERROR LOG
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
          BUKU DOSA UTBK
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 font-bold uppercase tracking-wider mt-3 max-w-2xl leading-relaxed">
          Katalog setiap soal yang pernah kamu gagal selesaikan. Di UTBK, bukan siapa yang paling pintar yang lolos, tapi siapa yang paling sedikit mengulangi kesalahan yang sama.
        </p>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t-2 border-zinc-800">
          <div className="bg-zinc-900 border-2 border-zinc-800 p-3">
            <span className="text-[10px] text-zinc-500 font-black uppercase block">TOTAL DOSA</span>
            <span className="text-2xl md:text-3xl font-black text-white">{totalErrors}</span>
          </div>
          <div className="bg-zinc-900 border-2 border-red-900/60 p-3">
            <span className="text-[10px] text-red-400 font-black uppercase block">BELUM DITEBUS</span>
            <span className="text-2xl md:text-3xl font-black text-red-500">{unresolvedCount}</span>
          </div>
          <div className="bg-zinc-900 border-2 border-emerald-900/60 p-3">
            <span className="text-[10px] text-emerald-400 font-black uppercase block">SUDAH DITEBUS</span>
            <span className="text-2xl md:text-3xl font-black text-emerald-400">{redeemedCount}</span>
          </div>
          <div className="bg-zinc-900 border-2 border-zinc-800 p-3">
            <span className="text-[10px] text-zinc-500 font-black uppercase block">RESOLUSI</span>
            <span className="text-2xl md:text-3xl font-black text-amber-400">{redemptionRate}%</span>
          </div>
        </div>

        {/* Smart Trap Matrix Widget */}
        {totalErrors > 0 && (
          <div className="bg-zinc-900 border-2 border-zinc-800 p-4 mt-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                SMART TRAP MATRIX // DISTRIBUSI AKAR KESALAHAN ({taggedCount}/{totalErrors} TERTANDAI)
              </span>
              <span className="text-[9px] text-zinc-400 uppercase font-bold">
                {taggedCount === 0 ? 'Belum ada soal yang dilabeli akar masalah' :
                 rushErrorPct >= 40 ? '⚠️ Dominan: Ceroboh / Terburu-buru' :
                 blindSpotPct >= 40 ? '⚠️ Dominan: Buta Konsep Dasar' :
                 timePanicPct >= 40 ? '⚠️ Dominan: Terjebak Waktu' : 'Kombinasi Faktor'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-zinc-950 border border-red-900/60 p-2.5">
                <div className="flex justify-between text-[10px] font-black uppercase text-red-400 mb-1">
                  <span>[BLIND_SPOT] BUTA KONSEP</span>
                  <span>{blindSpotPct}% ({blindSpotCount})</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 border border-zinc-700">
                  <div className="bg-red-600 h-full transition-all" style={{ width: `${blindSpotPct}%` }}></div>
                </div>
              </div>

              <div className="bg-zinc-950 border border-amber-900/60 p-2.5">
                <div className="flex justify-between text-[10px] font-black uppercase text-amber-400 mb-1">
                  <span>[RUSH_ERROR] CEROBOH</span>
                  <span>{rushErrorPct}% ({rushErrorCount})</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 border border-zinc-700">
                  <div className="bg-amber-500 h-full transition-all" style={{ width: `${rushErrorPct}%` }}></div>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-2.5">
                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-300 mb-1">
                  <span>[TIME_PANIC] PANIK WAKTU</span>
                  <span>{timePanicPct}% ({timePanicCount})</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 border border-zinc-700">
                  <div className="bg-zinc-400 h-full transition-all" style={{ width: `${timePanicPct}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mode Switch Tabs & Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b-4 border-zinc-950 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 border-zinc-950 flex items-center gap-2 cursor-pointer transition-transform active:scale-95 ${
              activeTab === 'catalog'
                ? 'bg-zinc-950 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <BookX className="w-4 h-4" />
            <span>KATALOG DOSA ({filteredErrors.length})</span>
          </button>

          <button
            onClick={() => {
              if (unresolvedCount > 0) {
                setActiveTab('gauntlet');
                setGauntletIndex(0);
                setGauntletAnswer(null);
                setGauntletSubmitted(false);
              }
            }}
            disabled={unresolvedCount === 0}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 border-zinc-950 flex items-center gap-2 transition-transform active:scale-95 ${
              unresolvedCount === 0
                ? 'opacity-40 cursor-not-allowed bg-zinc-100 text-zinc-400'
                : activeTab === 'gauntlet'
                ? 'bg-red-600 text-white border-red-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer'
                : 'bg-amber-400 text-zinc-950 hover:bg-amber-500 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>TEBUS DOSA ({unresolvedCount})</span>
          </button>
        </div>

        {totalErrors > 0 && activeTab === 'catalog' && (
          <button
            onClick={() => {
              if (window.confirm("Yakin ingin menghapus semua arsip Buku Dosa? Tindakan ini tidak bisa dibatalkan.")) {
                clearErrorLog();
              }
            }}
            className="text-[11px] font-black text-zinc-400 hover:text-red-600 uppercase flex items-center gap-1 self-end sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>KOSONGKAN ARSIP</span>
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: KATALOG DOSA (LIST VIEW) */}
      {/* ============================================================== */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {totalErrors === 0 ? (
            /* Clean State */
            <div className="border-4 md:border-8 border-zinc-950 bg-white p-8 md:p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-16 h-16 bg-emerald-100 border-4 border-zinc-950 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black uppercase text-zinc-950">ARSIP BERSIH // ZERO DEFECT</h3>
              <p className="text-xs md:text-sm text-zinc-600 font-bold uppercase mt-2 max-w-md mx-auto leading-relaxed">
                Belum ada catatan kesalahan di Buku Dosa. Ambil Tryout Kilat atau selesaikan 1 Soal Sehari untuk menguji batas kemampuanmu.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <NavLink
                  to="/tryout"
                  className="bg-zinc-950 hover:bg-zinc-800 text-white font-black px-6 py-3 text-xs uppercase tracking-widest border-2 border-zinc-950 active:scale-95 transition-transform"
                >
                  AMBIL TRYOUT KILAT ↗
                </NavLink>
                <NavLink
                  to="/one"
                  className="bg-white hover:bg-zinc-100 text-zinc-950 font-black px-6 py-3 text-xs uppercase tracking-widest border-2 border-zinc-950 active:scale-95 transition-transform"
                >
                  1 SOAL SEHARI ↗
                </NavLink>
              </div>
            </div>
          ) : (
            <>
              {/* Filter Bar */}
              <div className="bg-zinc-100 border-2 border-zinc-950 p-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 text-[11px] font-black uppercase text-zinc-600">
                  <Filter className="w-3.5 h-3.5" />
                  <span>FILTER:</span>
                </div>

                {/* Subtest Selector */}
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-white border-2 border-zinc-950 px-2.5 py-1 text-xs font-black uppercase cursor-pointer"
                >
                  {subjects.map(sub => (
                    <option key={sub} value={sub}>{sub === 'ALL' ? 'SEMUA SUBTES' : sub}</option>
                  ))}
                </select>

                {/* Status Selector */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border-2 border-zinc-950 px-2.5 py-1 text-xs font-black uppercase cursor-pointer"
                >
                  <option value="ALL">SEMUA STATUS</option>
                  <option value="unresolved">🔴 BELUM DITEBUS ({unresolvedCount})</option>
                  <option value="redeemed">🟢 SUDAH DITEBUS ({redeemedCount})</option>
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {filteredErrors.map((item) => {
                  const isRedeemed = item.status === 'redeemed';
                  const isExpanded = !!expandedExplanations[item.id];

                  return (
                    <div
                      key={item.id}
                      className={`border-4 border-zinc-950 bg-white p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors ${
                        isRedeemed ? 'border-zinc-300 bg-zinc-50/50' : 'border-zinc-950'
                      }`}
                    >
                      {/* Top Bar of Card */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-zinc-200">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 text-[10px] font-black uppercase border ${
                            isRedeemed 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-400' 
                              : 'bg-red-100 text-red-800 border-red-500'
                          }`}>
                            {isRedeemed ? '✓ SUDAH DITEBUS' : '⚠️ BELUM DITEBUS'}
                          </span>
                          <span className="text-[10px] font-black uppercase text-zinc-500">
                            {item.code || item.source}
                          </span>
                          <span className="text-[10px] font-black uppercase text-zinc-950 bg-zinc-200 px-1.5 py-0.5">
                            {item.subject}
                          </span>
                          {item.subtopic && (
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">
                              // {item.subtopic}
                            </span>
                          )}

                          {/* 3-Label Taxonomy Selector Trigger */}
                          <button
                            onClick={() => setTaxonomyModalError(item)}
                            className={`px-2 py-0.5 text-[9px] font-black uppercase border cursor-pointer active:scale-95 transition-transform ${
                              item.taxonomy === 'BLIND_SPOT' ? 'bg-red-100 text-red-700 border-red-500 font-black' :
                              item.taxonomy === 'RUSH_ERROR' ? 'bg-amber-100 text-amber-800 border-amber-500 font-black' :
                              item.taxonomy === 'TIME_PANIC' ? 'bg-zinc-200 text-zinc-800 border-zinc-500 font-black' :
                              'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-400'
                            }`}
                            title="Klik untuk mendiagnosis akar kesalahan"
                          >
                            {item.taxonomy ? `[ ${item.taxonomy} ]` : '+ LABELI AKAR MASALAH'}
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          {item.timesFailed > 1 && (
                            <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-300 px-1.5 py-0.5">
                              {item.timesFailed}X SALAH
                            </span>
                          )}
                          <button
                            onClick={() => removeMistake(item.id)}
                            className="text-zinc-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                            title="Hapus dari Buku Dosa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm md:text-base font-bold text-zinc-950 leading-relaxed whitespace-pre-line mb-4">
                        {item.question}
                      </p>

                      {/* Options Preview */}
                      {Array.isArray(item.options) && (
                        <div className="space-y-1.5 mb-4 text-xs font-bold">
                          {item.options.map((opt, oIdx) => {
                            const isCorrect = oIdx === item.correctIndex;
                            const isUserChoice = item.userSelected === oIdx;

                            return (
                              <div
                                key={oIdx}
                                className={`p-2 border ${
                                  isCorrect
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black'
                                    : isUserChoice
                                    ? 'bg-red-50 border-red-500 text-red-950 line-through'
                                    : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                                }`}
                              >
                                <span>{opt}</span>
                                {isCorrect && <span className="ml-2 text-emerald-600 font-black">[KUNCI BENAR]</span>}
                                {isUserChoice && !isCorrect && <span className="ml-2 text-red-600 font-black">[PILIHAN KAMU YANG SALAH]</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Toggle Bedah / Pembahasan */}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
                        <button
                          onClick={() => toggleExplanation(item.id)}
                          className="text-xs font-black uppercase text-zinc-800 hover:text-black flex items-center gap-1 cursor-pointer"
                        >
                          {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{isExpanded ? 'TUTUP BEDAH JEBAKAN' : 'LIHAT BEDAH JEBAKAN & RUMUS SAKTI'}</span>
                        </button>

                        {!isRedeemed ? (
                          <button
                            onClick={() => {
                              redeemMistake(item.id);
                            }}
                            className="text-xs font-black uppercase bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 border border-zinc-950 active:scale-95 transition-transform cursor-pointer"
                          >
                            TANDAI SUDAH PAHAM ✓
                          </button>
                        ) : (
                          <span className="text-[10px] font-black text-emerald-600 uppercase">
                            DITEBUS PADA {new Date(item.redeemedAt || item.failedAt).toLocaleDateString('id-ID')}
                          </span>
                        )}
                      </div>

                      {/* Expanded Explanation Box */}
                      {isExpanded && item.explanation && (
                        <div className="mt-4 p-4 border-2 border-zinc-950 bg-zinc-50 space-y-3">
                          {item.explanation.keyConcept && (
                            <div>
                              <span className="text-[10px] font-black uppercase text-zinc-500 block">KONSEP KUNCI:</span>
                              <span className="text-xs font-black text-zinc-950">{item.explanation.keyConcept}</span>
                            </div>
                          )}

                          {Array.isArray(item.explanation.steps) && (
                            <div>
                              <span className="text-[10px] font-black uppercase text-zinc-500 block mb-1">LANGKAH LOGIS:</span>
                              <ul className="space-y-1 text-xs text-zinc-800">
                                {item.explanation.steps.map((st, sIdx) => (
                                  <li key={sIdx}>{st}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.explanation.trap && (
                            <div className="p-2.5 bg-red-100 border-l-4 border-red-600 text-xs font-black text-red-950">
                              ⚠️ JEBAKAN UTAMA: {item.explanation.trap}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: TEBUS DOSA (GAUNTLET QUIZ MODE) */}
      {/* ============================================================== */}
      {activeTab === 'gauntlet' && (
        <div className="max-w-3xl mx-auto">
          {unresolvedCount === 0 || !currentGauntletItem ? (
            <div className="border-4 md:border-8 border-zinc-950 bg-white p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <Flame className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-2xl font-black uppercase text-zinc-950">SEMUA DOSA BERHASIL DITEBUS!</h3>
              <p className="text-xs font-bold text-zinc-600 uppercase mt-2">
                Tidak ada sisa kelemahan yang belum terselesaikan. Selamat atas disiplinmu!
              </p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="mt-6 bg-zinc-950 text-white font-black px-6 py-3 text-xs uppercase tracking-widest cursor-pointer"
              >
                KEMBALI KE KATALOG
              </button>
            </div>
          ) : (
            <div className="border-4 md:border-8 border-zinc-950 bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
              {/* Gauntlet Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-zinc-950">
                <div>
                  <span className="text-[10px] font-black uppercase text-red-600 tracking-widest block">
                    PENEBUSAN KE-{gauntletIndex + 1} DARI {unresolvedErrors.length}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black uppercase text-zinc-950">
                    {currentGauntletItem.subject}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs font-black uppercase text-zinc-500 hover:text-black cursor-pointer"
                >
                  [BATAL / KELUAR]
                </button>
              </div>

              {/* Question */}
              <div className="bg-zinc-50 border-2 border-zinc-950 p-4 md:p-5">
                <span className="text-[10px] font-black uppercase text-zinc-400 block mb-1">
                  {currentGauntletItem.code} // {currentGauntletItem.subtopic}
                </span>
                <p className="text-sm md:text-base font-bold text-zinc-950 leading-relaxed whitespace-pre-line">
                  {currentGauntletItem.question}
                </p>
              </div>

              {/* Interactive Options */}
              <div className="space-y-2">
                {Array.isArray(currentGauntletItem.options) && currentGauntletItem.options.map((opt, idx) => {
                  const isSelected = gauntletAnswer === idx;
                  const isCorrect = idx === currentGauntletItem.correctIndex;

                  let borderClass = 'border-2 border-zinc-950 hover:bg-zinc-100';
                  let bgClass = 'bg-white text-zinc-950';

                  if (gauntletSubmitted) {
                    if (isCorrect) {
                      bgClass = 'bg-emerald-500 text-white font-black border-2 border-emerald-600';
                    } else if (isSelected && !isCorrect) {
                      bgClass = 'bg-red-600 text-white font-black border-2 border-red-700';
                    } else {
                      bgClass = 'bg-zinc-100 text-zinc-400 opacity-60';
                    }
                  } else if (isSelected) {
                    bgClass = 'bg-zinc-950 text-white font-black';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={gauntletSubmitted}
                      onClick={() => setGauntletAnswer(idx)}
                      className={`w-full text-left p-3.5 text-xs md:text-sm font-bold uppercase transition-all cursor-pointer flex items-center justify-between ${borderClass} ${bgClass}`}
                    >
                      <span>{opt}</span>
                      {gauntletSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 shrink-0 ml-2" />}
                      {gauntletSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Result Banner */}
              {gauntletSubmitted && (
                <div className={`p-4 border-4 ${
                  gauntletSuccess 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950' 
                    : 'bg-red-50 border-red-600 text-red-950'
                }`}>
                  <div className="flex items-center gap-2 font-black uppercase text-sm mb-1">
                    {gauntletSuccess ? (
                      <>
                        <Flame className="w-5 h-5 text-emerald-600" />
                        <span>DOSA TERTEBUS! KELEMAHAN INI TELAH KAMU TAKLUKKAN.</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span>MASIH KELIRU! JANGAN DILEWATI BEGITU SAJA.</span>
                      </>
                    )}
                  </div>
                  {currentGauntletItem.explanation?.trap && (
                    <p className="text-xs font-bold mt-1">
                      ⚠️ Jebakan: {currentGauntletItem.explanation.trap}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t-2 border-zinc-950 flex items-center justify-between">
                {!gauntletSubmitted ? (
                  <button
                    disabled={gauntletAnswer === null}
                    onClick={handleGauntletSubmit}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-white font-black py-3.5 text-xs uppercase tracking-widest active:scale-95 transition-transform cursor-pointer border-2 border-zinc-950 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] flex items-center justify-center gap-2"
                  >
                    <span>KIRIM JAWABAN PENEBUSAN</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextGauntlet}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-black py-3.5 text-xs uppercase tracking-widest active:scale-95 transition-transform cursor-pointer border-2 border-zinc-950 flex items-center justify-center gap-2"
                  >
                    <span>LANJUT KE SOAL BERIKUTNYA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3-Label Cognitive Root Cause Taxonomy Modal */}
      <ErrorTaxonomyModal
        isOpen={!!taxonomyModalError}
        onClose={() => setTaxonomyModalError(null)}
        targetError={taxonomyModalError}
      />
    </div>
  );
}
