import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Flame, 
  ArrowRight, 
  Sliders, 
  Check, 
  Sparkles,
  School,
  Camera
} from 'lucide-react';
import { PTN_DATABASE, evaluatePtnChance } from '../data/ptnDatabase';
import { useAppStore } from '../store/useAppStore';
import StoryCardModal from '../components/StoryCardModal';

export default function RasionalisasiPTN() {
  const tryoutHistory = useAppStore(state => state.tryoutHistory) || [];
  const targetPTN = useAppStore(state => state.targetPTN);
  const targetScore = useAppStore(state => state.targetScore);
  const setTargetGoal = useAppStore(state => state.setTargetGoal);

  // Default to latest tryout score if available, else 650
  const latestTryoutScore = tryoutHistory.length > 0 ? tryoutHistory[0].score : 650;
  const [simulatedScore, setSimulatedScore] = useState(latestTryoutScore);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRumpun, setSelectedRumpun] = useState('ALL'); // 'ALL' | 'SAINTEK' | 'SOSHUM'
  const [selectedKampus, setSelectedKampus] = useState('ALL');
  const [selectedMajorId, setSelectedMajorId] = useState(PTN_DATABASE[0].id);
  const [syncedTargetNotice, setSyncedTargetNotice] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Unique Campus List for dropdown
  const kampusList = ['ALL', ...Array.from(new Set(PTN_DATABASE.map(p => p.kampusSingkat)))];

  // Filtered Majors
  const filteredMajors = PTN_DATABASE.filter(m => {
    const matchesSearch = m.prodi.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.ptn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRumpun = selectedRumpun === 'ALL' || m.rumpun === selectedRumpun;
    const matchesKampus = selectedKampus === 'ALL' || m.kampusSingkat === selectedKampus;
    return matchesSearch && matchesRumpun && matchesKampus;
  });

  const activeMajor = PTN_DATABASE.find(m => m.id === selectedMajorId) || PTN_DATABASE[0];
  const evaluation = evaluatePtnChance(simulatedScore, activeMajor);

  // Handle setting as Sumpah Darah Target
  const handleSetTarget = () => {
    setTargetGoal({
      targetPTN: `${activeMajor.kampusSingkat} - ${activeMajor.prodi}`,
      targetScore: activeMajor.passingScoreSafe
    });
    setSyncedTargetNotice(true);
    setTimeout(() => setSyncedTargetNotice(false), 2500);
  };

  // Find 2 alternative safe recommendations if in danger
  const alternativeMajors = PTN_DATABASE.filter(m => 
    m.id !== activeMajor.id && 
    m.rumpun === activeMajor.rumpun && 
    simulatedScore >= m.passingScoreMin
  ).slice(0, 3);

  return (
    <div className="space-y-8 font-mono max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b-4 md:border-b-8 border-zinc-950 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-3 bg-red-600 rounded-none animate-pulse"></span>
          <span className="text-xs font-black uppercase tracking-widest text-red-600">
            SIMULASI KELULUSAN // RASIONALISASI SNBT 2026
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-none">
          RASIONALISASI PTN
        </h1>
        <p className="text-xs md:text-sm text-zinc-600 font-bold uppercase tracking-wider mt-3 max-w-2xl">
          Bandingkan skor IRT Anda dengan ambang batas historis PTN favorit. Tentukan pilihan secara realistis, bukan berdasarkan angan-angan kosong.
        </p>
      </div>

      {/* Simulator Control Bar */}
      <div className="bg-zinc-950 text-white border-4 md:border-8 border-zinc-950 p-6 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b-2 border-zinc-800">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-1">
              SKOR UTBK SIMULASI ANDA
            </span>
            <div className="text-5xl md:text-7xl font-black tracking-tight text-white leading-none">
              {simulatedScore}
              <span className="text-lg md:text-xl text-zinc-500 font-normal"> / 1000 PTS</span>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
            {tryoutHistory.length > 0 && (
              <button
                onClick={() => setSimulatedScore(tryoutHistory[0].score)}
                className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-amber-400 border-2 border-amber-500 px-4 py-2.5 text-xs font-black uppercase cursor-pointer"
              >
                Gunakan Skor TO Terakhir ({tryoutHistory[0].score})
              </button>
            )}
            <div className="w-full sm:w-auto flex items-center gap-2 bg-zinc-900 border-2 border-zinc-700 p-2">
              <span className="text-[10px] font-black text-zinc-400 uppercase">GESER:</span>
              <input
                type="range"
                min="350"
                max="850"
                step="5"
                value={simulatedScore}
                onChange={(e) => setSimulatedScore(parseInt(e.target.value))}
                className="w-36 accent-red-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Current Sumpah Darah Target Indicator */}
        <div className="pt-4 flex flex-wrap items-center justify-between text-xs font-bold gap-2">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 uppercase">TARGET SUMPAH DARAH SAAT INI:</span>
            <span className="text-amber-400 font-black uppercase">{targetPTN}</span>
            <span className="text-zinc-500">({targetScore} PTS)</span>
          </div>
          <span className="text-[10px] text-zinc-400 uppercase">Ambangkan skor minimal +15 di atas batas aman</span>
        </div>
      </div>

      {/* Main Evaluator Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Major Selector & Search List */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white border-4 border-zinc-950 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-xs uppercase tracking-widest text-zinc-950 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-zinc-950" />
              PILIH JURUSAN & KAMPUS
            </h3>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Cari kedokteran, hukum, itb..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border-2 border-zinc-950 p-2 text-xs font-bold uppercase mb-3 focus:outline-none"
            />

            {/* Filter Rumpun Tabs */}
            <div className="grid grid-cols-3 gap-1 mb-3 text-[10px] font-black uppercase">
              {['ALL', 'SAINTEK', 'SOSHUM'].map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRumpun(r)}
                  className={`py-1.5 border-2 text-center cursor-pointer ${
                    selectedRumpun === r 
                      ? 'bg-zinc-950 text-white border-zinc-950' 
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:border-zinc-950'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Filter Kampus Dropdown */}
            <div className="mb-3">
              <select
                value={selectedKampus}
                onChange={(e) => setSelectedKampus(e.target.value)}
                className="w-full bg-zinc-50 border-2 border-zinc-950 p-2 text-xs font-bold uppercase focus:outline-none cursor-pointer"
              >
                {kampusList.map(k => (
                  <option key={k} value={k}>
                    {k === 'ALL' ? 'SEMUA KAMPUS TOP PTN' : `KAMPUS ${k}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Major Scroll List */}
            <div className="max-h-[360px] overflow-y-auto space-y-1.5 pr-1 scrollbar-hide">
              {filteredMajors.map(m => {
                const isSelected = m.id === activeMajor.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMajorId(m.id)}
                    className={`w-full text-left p-2.5 border-2 transition-transform active:scale-95 text-xs font-bold uppercase flex flex-col cursor-pointer ${
                      isSelected 
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]' 
                        : 'bg-zinc-50 text-zinc-900 border-zinc-200 hover:border-zinc-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] px-1 py-0.2 border ${
                        isSelected ? 'border-red-500 text-red-400' : 'border-zinc-400 text-zinc-500'
                      }`}>
                        {m.kampusSingkat}
                      </span>
                      <span className="text-[10px] font-black">{m.passingScoreSafe} PTS</span>
                    </div>
                    <span className="truncate mt-1">{m.prodi}</span>
                  </button>
                );
              })}
              {filteredMajors.length === 0 && (
                <p className="text-center text-xs text-zinc-400 p-4">Tidak ada prodi cocok.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: In-Depth Verdict & Probability Meter */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border-4 md:border-8 border-zinc-950 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            {/* Major Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-zinc-950 pb-4 mb-6 gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-red-600 tracking-widest block">
                  {activeMajor.ptn} // {activeMajor.rumpun}
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-950">
                  {activeMajor.prodi}
                </h2>
              </div>
              <span className={`px-3 py-1 text-xs font-black uppercase border-2 ${evaluation.badgeColor}`}>
                {evaluation.status}
              </span>
            </div>

            {/* Probability Gauge Bar */}
            <div className="mb-6 bg-zinc-50 border-2 border-zinc-950 p-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-black uppercase text-zinc-600">
                  ESTIMASI PROBABILITAS KELULUSAN:
                </span>
                <span className="text-3xl font-black text-zinc-950">
                  {evaluation.probabilityPct}%
                </span>
              </div>
              <div className="w-full bg-zinc-200 h-4 border-2 border-zinc-950 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    evaluation.probabilityPct >= 75 ? 'bg-emerald-500' :
                    evaluation.probabilityPct >= 45 ? 'bg-amber-400' : 'bg-red-600'
                  }`}
                  style={{ width: `${evaluation.probabilityPct}%` }}
                />
              </div>
            </div>

            {/* Score Comparison Ticker */}
            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div className="bg-zinc-50 border-2 border-zinc-950 p-3">
                <span className="text-[9px] text-zinc-500 font-bold uppercase block">SKOR ANDA</span>
                <span className="text-xl md:text-2xl font-black text-zinc-950">{simulatedScore}</span>
              </div>
              <div className="bg-zinc-50 border-2 border-zinc-950 p-3">
                <span className="text-[9px] text-zinc-500 font-bold uppercase block">BATAS RAWAN</span>
                <span className="text-xl md:text-2xl font-black text-amber-600">{activeMajor.passingScoreMin}</span>
              </div>
              <div className="bg-zinc-50 border-2 border-zinc-950 p-3">
                <span className="text-[9px] text-zinc-500 font-bold uppercase block">AMBANG AMAN</span>
                <span className="text-xl md:text-2xl font-black text-emerald-600">{activeMajor.passingScoreSafe}</span>
              </div>
            </div>

            {/* SNBT Metric Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6 py-3 border-y-2 border-zinc-200 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">DAYA TAMPUNG</span>
                <span className="font-black text-zinc-950">{activeMajor.dayaTampung} KURSI</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">PEMINAT LALU</span>
                <span className="font-black text-zinc-950">{activeMajor.peminat.toLocaleString('id-ID')} ORANG</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">KEKETATAN</span>
                <span className="font-black text-red-600">{activeMajor.keketatan}</span>
              </div>
            </div>

            {/* Strategic Verdict & Advice */}
            <div className={`p-4 border-4 mb-6 ${evaluation.statusColor}`}>
              <h4 className="font-black text-xs uppercase mb-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4 shrink-0" />
                ANALISIS STRATEGIS RASIONAL:
              </h4>
              <p className="text-xs font-bold leading-relaxed mb-2">
                {evaluation.verdict}
              </p>
              <div className="text-[11px] font-black uppercase text-zinc-900 border-t border-zinc-300 pt-2">
                REKOMENDASI SNBT: {evaluation.recommendation}
              </div>
            </div>

            {/* Set As Target Sumpah Darah Button */}
            {/* Set As Target Sumpah Darah & Poster Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSetTarget}
                  className="flex-1 sm:flex-none bg-zinc-950 hover:bg-zinc-800 text-white font-black px-5 py-3.5 text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer border-2 border-zinc-950 active:scale-95 transition-transform"
                >
                  {syncedTargetNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>TARGET BERHASIL DISINKRON!</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 text-amber-400" />
                      <span>JADIKAN TARGET SUMPAH</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsStoryModalOpen(true)}
                  className="flex-1 sm:flex-none bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black px-4 py-3.5 text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer border-2 border-zinc-950 active:scale-95 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Camera className="w-4 h-4" />
                  <span>KARTU TARGET (PNG)</span>
                </button>
              </div>

              <span className="text-[10px] text-zinc-500 font-bold uppercase text-center sm:text-right">
                Otomatis mengunci target di Spartan HUD bilah atas.
              </span>
            </div>
          </div>

          {/* Alternative Recommendations if current choice is tight/danger */}
          {alternativeMajors.length > 0 && evaluation.probabilityPct < 75 && (
            <div className="bg-zinc-50 border-4 border-zinc-950 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h4 className="font-black text-xs uppercase tracking-widest text-zinc-950 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                OPSI CADANGAN LEBIH AMAN (SESUAI SKOR {simulatedScore} PTS):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {alternativeMajors.map(alt => (
                  <button
                    key={alt.id}
                    onClick={() => setSelectedMajorId(alt.id)}
                    className="p-3 bg-white border-2 border-zinc-950 text-left hover:bg-zinc-950 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="text-[9px] font-black text-red-600 block">{alt.kampusSingkat}</span>
                    <h5 className="font-black text-xs uppercase truncate">{alt.prodi}</h5>
                    <span className="text-[10px] text-zinc-500 font-bold block mt-1">Aman: {alt.passingScoreSafe} pts</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Story & Poster Generator Modal */}
      <StoryCardModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        type="ptn"
        data={activeMajor}
      />
    </div>
  );
}
