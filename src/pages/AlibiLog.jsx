import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { FileText, ShieldAlert, CheckCircle2, Trash2, PenTool, Clock } from 'lucide-react';

export default function AlibiLog() {
  const alibiLogs = useAppStore(state => state.alibiLogs) || [];
  const hasDoneAlibiToday = useAppStore(state => state.hasDoneAlibiToday);
  const resetAlibiStatus = useAppStore(state => state.resetAlibiStatus);
  const clearAlibiLogs = useAppStore(state => state.clearAlibiLogs);

  // Balik urutan agar entri terbaru di atas
  const reversedLogs = [...alibiLogs].reverse();
  const latestLog = reversedLogs[0];

  // Hitung statistik
  const totalWords = alibiLogs.reduce((acc, curr) => acc + (curr.text ? curr.text.split(/\s+/).filter(Boolean).length : 0), 0);

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';
    } catch {
      return isoString;
    }
  };

  const handleClear = () => {
    if (window.confirm("KONFIRMASI: Apakah Anda yakin ingin memusnahkan seluruh rekam jejak Alibi? Tindakan ini tidak dapat dibatalkan.")) {
      clearAlibiLogs();
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.05 }
        }
      }}
      className="space-y-10"
    >
      {/* Header */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
        }}
      >
        <div className="text-[10px] md:text-xs font-mono font-black uppercase tracking-widest text-zinc-500 mb-1">
          MODUL-05 // ANTI-ZOMBIE ARCHIVE
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 leading-none mb-2">
          Jurnal Alibi
        </h1>
        <p className="text-zinc-600 font-mono font-bold uppercase tracking-widest text-xs md:text-sm">
          Tiada alasan tanpa bukti. Arsip niat dan komitmen belajar harian Anda.
        </p>
      </motion.div>

      {/* Hero: Status Alibi Hari Ini */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
        }}
      >
        {hasDoneAlibiToday && latestLog ? (
          <div className="border-4 md:border-8 border-zinc-950 bg-zinc-950 text-white p-4 sm:p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-zinc-800 pb-3 md:pb-4 mb-4">
              <span className="text-xs font-mono font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                // ALIBI AKTIF HARI INI
              </span>
              <span className="text-[11px] md:text-xs font-mono font-bold text-zinc-400 uppercase">
                {formatDate(latestLog.date)}
              </span>
            </div>
            <p className="font-mono font-bold text-base md:text-xl leading-relaxed whitespace-pre-line text-zinc-100">
              "{latestLog.text}"
            </p>
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono font-bold text-zinc-400">
              <span>STATUS: TERVERIFIKASI & MENGIKAT</span>
              <button
                onClick={resetAlibiStatus}
                className="text-xs font-black uppercase underline hover:text-white transition-colors cursor-pointer"
              >
                [UBAH / TULIS ULANG NIAT]
              </button>
            </div>
          </div>
        ) : (
          <div className="border-4 md:border-8 border-red-600 bg-red-50 p-4 sm:p-6 md:p-8 text-red-950">
            <div className="flex items-center gap-2.5 mb-2">
              <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-red-600 shrink-0" />
              <h3 className="font-black uppercase text-lg md:text-xl tracking-tight">ALIBI BELUM DITETAPKAN</h3>
            </div>
            <p className="font-mono font-bold text-xs md:text-sm uppercase leading-relaxed mb-4">
              Anda belum menetapkan niat belajar spesifik hari ini. Akses penuh memerlukan komitmen tertulis.
            </p>
            <button
              onClick={resetAlibiStatus}
              className="bg-red-600 text-white px-4 md:px-5 py-2 md:py-2.5 font-mono font-black text-xs uppercase tracking-wider hover:bg-red-700 active:scale-[0.97] transition-transform cursor-pointer"
            >
              ISI ALIBI SEKARANG ↵
            </button>
          </div>
        )}
      </motion.div>

      {/* Metrics Bar */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
        }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
      >
        <div className="border-2 md:border-4 border-zinc-950 bg-white p-4 md:p-5">
          <div className="text-[10px] md:text-xs font-mono font-bold uppercase text-zinc-500 mb-1">TOTAL SESI ALIBI</div>
          <div className="text-2xl md:text-3xl font-black font-mono text-zinc-950 leading-none">
            {alibiLogs.length} <span className="text-xs md:text-sm font-bold text-zinc-500">KALI</span>
          </div>
        </div>

        <div className="border-2 md:border-4 border-zinc-950 bg-white p-4 md:p-5">
          <div className="text-[10px] md:text-xs font-mono font-bold uppercase text-zinc-500 mb-1">TOTAL KATA TERTULIS</div>
          <div className="text-2xl md:text-3xl font-black font-mono text-zinc-950 leading-none">
            {totalWords} <span className="text-xs md:text-sm font-bold text-zinc-500">KATA</span>
          </div>
        </div>

        <div className="border-2 md:border-4 border-zinc-950 bg-white p-4 md:p-5">
          <div className="text-[10px] md:text-xs font-mono font-bold uppercase text-zinc-500 mb-1">STATUS DISIPLIN</div>
          <div className="text-lg md:text-xl font-black font-mono text-zinc-950 leading-none">
            {hasDoneAlibiToday ? "TERKUNCI AMAN" : "BUTUH TINDAKAN"}
          </div>
        </div>
      </motion.div>

      {/* Log Feed */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.05 } }
        }}
        className="pt-6 border-t-8 border-zinc-950 space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-950">
            Daftar Berkas Interogasi ({alibiLogs.length})
          </h2>
          {alibiLogs.length > 0 && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-red-600 hover:text-red-800 transition-colors border border-red-300 hover:border-red-600 px-3 py-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              MUSNAHKAN ARSIP
            </button>
          )}
        </div>

        {reversedLogs.length === 0 ? (
          <div className="border-4 border-zinc-950 bg-zinc-50 p-12 text-center">
            <FileText className="w-12 h-12 text-zinc-400 mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="font-black uppercase text-xl text-zinc-950 mb-2">ARSIP MASIH KOSONG</h3>
            <p className="font-mono font-bold text-sm uppercase text-zinc-500 max-w-md mx-auto">
              Belum ada riwayat alibi yang tercatat. Setiap kali Anda membuka aplikasi dan menyelesaikan interogasi harian, rekamannya akan tersimpan permanen di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reversedLogs.map((log, index) => {
              const wordCount = log.text ? log.text.split(/\s+/).filter(Boolean).length : 0;
              const charCount = log.text ? log.text.length : 0;
              const serialNumber = (reversedLogs.length - index).toString().padStart(3, '0');

              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } }
                  }}
                  className="border-4 border-zinc-950 bg-white p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:border-zinc-900 transition-all font-mono"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border-b-2 border-zinc-950 pb-3 mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-950 bg-zinc-200 px-2 py-0.5">
                      BERKAS-#{serialNumber}
                    </span>
                    <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(log.date)}
                    </span>
                  </div>

                  <p className="font-bold text-zinc-900 text-sm md:text-base leading-relaxed whitespace-pre-line mb-4">
                    {log.text}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] font-black uppercase text-zinc-400 pt-2 border-t border-zinc-100">
                    <span>{wordCount} KATA</span>
                    <span>•</span>
                    <span>{charCount} KARAKTER</span>
                    <span>•</span>
                    <span className="text-zinc-600">VALIDASI: ANTI-GIBBERISH LOLOS</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
