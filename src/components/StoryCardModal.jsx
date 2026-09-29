import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { 
  Download, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  Flame, 
  Target, 
  Swords, 
  PenTool, 
  Share2 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function StoryCardModal({ isOpen, onClose, type = 'tryout', data = {} }) {
  const cardRef = useRef(null);
  const [aspectRatio, setAspectRatio] = useState('story'); // 'story' (9:16) | 'square' (1:1)
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const targetPTN = useAppStore(state => state.targetPTN);
  const targetScore = useAppStore(state => state.targetScore);

  if (!isOpen) return null;

  // Download PNG file
  const handleDownload = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      // Small tick to ensure styles are rendered
      await new Promise(r => setTimeout(r, 100));
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2.5, // 2.5x retina quality for ultra crisp text
        cacheBust: true,
        style: {
          transform: 'none', // prevent transform scaling issues in capture
        }
      });

      const link = document.createElement('a');
      link.download = `TITIKJEDA-${type.toUpperCase()}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal export kartu:", err);
      alert("Gagal mengunduh gambar. Silakan coba kembali.");
    } finally {
      setIsExporting(false);
    }
  };

  // Copy PNG blob to clipboard for direct paste
  const handleCopyClipboard = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await new Promise(r => setTimeout(r, 100));
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      if (navigator.clipboard?.write && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      } else {
        // Fallback: trigger download
        handleDownload();
      }
    } catch (err) {
      console.warn("Clipboard copy not supported, falling back to download", err);
      handleDownload();
    } finally {
      setIsExporting(false);
    }
  };

  const todayDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  return (
    <div 
      className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white border-4 md:border-8 border-zinc-950 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col my-auto font-mono"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-zinc-950 text-white p-4 flex items-center justify-between border-b-4 border-zinc-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-none animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-white">
              STUDYGRAM // GENERATOR POSTER
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:text-red-500 font-black text-xs uppercase p-1 cursor-pointer"
          >
            [✕ TUTUP]
          </button>
        </div>

        {/* Controls Bar: Ratio Switch & Notice */}
        <div className="bg-zinc-100 p-3 border-b-2 border-zinc-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-zinc-500 uppercase text-[10px]">FORMAT:</span>
            <button
              onClick={() => setAspectRatio('story')}
              className={`px-3 py-1 font-black uppercase border-2 border-zinc-950 text-[11px] cursor-pointer transition-transform active:scale-95 ${
                aspectRatio === 'story'
                  ? 'bg-zinc-950 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-zinc-700'
              }`}
            >
              📱 IG STORY (9:16)
            </button>
            <button
              onClick={() => setAspectRatio('square')}
              className={`px-3 py-1 font-black uppercase border-2 border-zinc-950 text-[11px] cursor-pointer transition-transform active:scale-95 ${
                aspectRatio === 'square'
                  ? 'bg-zinc-950 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-zinc-700'
              }`}
            >
              ⬛ POSTER / X (1:1)
            </button>
          </div>

          <span className="text-[10px] text-zinc-500 font-bold uppercase hidden sm:inline">
            Resolusi Tinggi 2.5x HD
          </span>
        </div>

        {/* Preview Container */}
        <div className="p-4 sm:p-6 bg-zinc-200/60 overflow-y-auto max-h-[60vh] flex items-center justify-center">
          {/* THE CARD ITSELF - Rendered and Captured */}
          <div
            ref={cardRef}
            className={`bg-zinc-950 text-white border-4 md:border-8 border-zinc-950 p-6 sm:p-8 flex flex-col justify-between select-none relative overflow-hidden transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
              aspectRatio === 'story'
                ? 'w-[320px] min-h-[568px] sm:w-[360px] sm:min-h-[640px]'
                : 'w-[320px] min-h-[320px] sm:w-[380px] sm:min-h-[380px]'
            }`}
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          >
            {/* Top Bar Branding */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3 mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tighter uppercase leading-none text-white">
                    TITIKJEDA.
                  </h3>
                  <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">
                    ZENUTBK V3 // PROTOKOL PARETO
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase text-red-500 block">
                    {todayDate}
                  </span>
                  <span className="text-[8px] text-zinc-500 font-mono font-bold uppercase">
                    ID: #{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>
              </div>

              {/* CARD TYPE 1: TRYOUT KILAT RESULT */}
              {type === 'tryout' && (
                <div className="space-y-4">
                  <div className="inline-block bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-widest">
                    RAPOR EVALUASI IRT SPRINT
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                      PREDIKSI SKOR UTBK
                    </span>
                    <div className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-none my-1 flex items-baseline gap-2">
                      <span>{data.score || 720}</span>
                      <span className="text-lg text-zinc-500 font-bold">/ 1000</span>
                    </div>
                  </div>

                  {/* Tier Badge */}
                  <div className="p-3 border-2 border-zinc-800 bg-zinc-900/80">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block mb-0.5">
                      {data.tier || 'TIER 1 // ELITE NASIONAL'}
                    </span>
                    <p className="text-[10px] text-zinc-300 font-bold leading-relaxed uppercase">
                      {data.tierDesc || 'Kompetitif untuk jurusan papan atas top PTN se-Indonesia.'}
                    </p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="bg-zinc-900 border border-zinc-800 p-2">
                      <span className="text-[8px] text-zinc-500 font-black block">BENAR</span>
                      <span className="text-base font-black text-emerald-400">{data.correctCount || 8}/10</span>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-2">
                      <span className="text-[8px] text-zinc-500 font-black block">AKURASI</span>
                      <span className="text-base font-black text-amber-400">{data.accuracy || 80}%</span>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-2">
                      <span className="text-[8px] text-zinc-500 font-black block">WAKTU</span>
                      <span className="text-base font-black text-white">{data.timeFormatted || '06:42'}</span>
                    </div>
                  </div>

                  {/* Target Match */}
                  <div className="border-t-2 border-zinc-800 pt-3">
                    <span className="text-[8px] text-zinc-500 font-black uppercase block">TARGET KAMPUS:</span>
                    <span className="text-xs font-black text-white uppercase truncate block">
                      {targetPTN || 'STEI ITB - REKAYASA PERANGKAT LUNAK'}
                    </span>
                  </div>
                </div>
              )}

              {/* CARD TYPE 2: BLOOD OATH (SUMPAH DARAH) */}
              {type === 'oath' && (
                <div className="space-y-4">
                  <div className="inline-block bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-widest">
                    KONTRAK ABSOLUT // TANPA ALASAN
                  </div>

                  <p className="text-xs sm:text-sm font-black text-white leading-relaxed uppercase pt-2">
                    "SAYA TIDAK AKAN MUNDUR, BERHENTI, ATAU MENGELUH.<br/>
                    SAYA AKAN MENCAPAI TARGET SAYA APAPUN RISIKONYA."
                  </p>

                  <div className="border-2 border-zinc-800 bg-white p-3 flex flex-col items-center justify-center">
                    {data.oathSignature ? (
                      <img 
                        src={data.oathSignature} 
                        alt="Tanda Tangan" 
                        className="h-16 sm:h-20 object-contain mix-blend-multiply" 
                      />
                    ) : (
                      <div className="h-16 flex items-center justify-center text-zinc-400 text-xs font-bold uppercase">
                        [TERVALIDASI DIGITAL]
                      </div>
                    )}
                    <span className="text-[8px] text-zinc-600 font-black uppercase mt-1">
                      TANDA TANGAN SAH // TIDAK DAPAT DITARIK
                    </span>
                  </div>

                  <div className="border-t-2 border-zinc-800 pt-3">
                    <span className="text-[8px] text-zinc-500 font-black uppercase block">TARGET MUTLAK:</span>
                    <span className="text-xs font-black text-amber-400 uppercase truncate block">
                      {targetPTN} (MINIMAL {targetScore} POIN)
                    </span>
                  </div>
                </div>
              )}

              {/* CARD TYPE 3: RASIONALISASI PTN */}
              {type === 'ptn' && (
                <div className="space-y-4">
                  <div className="inline-block bg-amber-400 text-zinc-950 text-[9px] font-black uppercase px-2 py-0.5 tracking-widest">
                    ANALISIS PELUANG PTN 2026
                  </div>

                  <div>
                    <span className="text-[9px] text-zinc-400 font-bold uppercase block">PILIHAN TARGET</span>
                    <h4 className="text-lg sm:text-xl font-black text-white leading-tight uppercase mt-0.5">
                      {data.prodi || 'Ilmu Komputer'}
                    </h4>
                    <span className="text-xs font-bold text-amber-400 uppercase block">
                      {data.ptn || 'Universitas Indonesia (UI)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-1">
                    <div className="bg-zinc-900 border border-zinc-800 p-2">
                      <span className="text-[8px] text-zinc-500 font-black block">SKOR AMAN</span>
                      <span className="text-lg font-black text-emerald-400">{data.passingScoreSafe || 745}+</span>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-2">
                      <span className="text-[8px] text-zinc-500 font-black block">KEKETATAN</span>
                      <span className="text-lg font-black text-red-400">{data.keketatan || '2.79%'}</span>
                    </div>
                  </div>

                  <div className="p-3 border-2 border-zinc-800 bg-zinc-900 text-[10px] font-bold text-zinc-300 leading-relaxed uppercase">
                    ℹ {data.catatan || 'Kuasai subtes Kuantitatif & Penalaran Logika secara mutlak.'}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Card Footer Watermark */}
            <div className="border-t-2 border-zinc-800 pt-3 mt-4 flex items-center justify-between text-[8px] text-zinc-500 uppercase font-black">
              <span>titikjeda-app.vercel.app</span>
              <span className="text-zinc-400">#PejuangUTBK2026</span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 bg-zinc-100 border-t-4 border-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] font-bold text-zinc-600 uppercase text-center sm:text-left">
            Siap diposting di IG Story, Twitter/X @utbkfess, atau grup belajar.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyClipboard}
              disabled={isExporting}
              className="flex-1 sm:flex-none bg-white hover:bg-zinc-200 text-zinc-950 font-black px-4 py-2.5 text-xs uppercase border-2 border-zinc-950 active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copySuccess ? 'TERSALIN!' : 'SALIN GAMBAR'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex-1 sm:flex-none bg-zinc-950 hover:bg-zinc-800 text-white font-black px-5 py-2.5 text-xs uppercase border-2 border-zinc-950 active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]"
            >
              {isExporting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></span>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>UNDUH PNG</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
