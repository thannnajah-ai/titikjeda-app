import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

export default function AlibiJournal({ onComplete }) {
  const [logText, setLogText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const addAlibiLog = useAppStore(state => state.addAlibiLog);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmed = logText.trim();
    if (trimmed.length < 20) {
      setErrorMsg("TULIS MINIMAL 20 KARAKTER.");
      return;
    }
    
    // Anti-Gibberish Validation: minimal 3 spaces
    if (trimmed.split(' ').length <= 3) {
      setErrorMsg("KALIMAT TIDAK VALID (MINIMAL 3 SPASI). JANGAN MENGETIK SAMPAH.");
      return;
    }
    
    setErrorMsg('');
    addAlibiLog({
      date: new Date().toISOString(),
      text: trimmed
    });
    
    if (onComplete) onComplete();
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-zinc-950 flex flex-col items-center justify-center p-3 sm:p-6 md:p-12 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0, duration: 0.2 }}
        className="bg-white border-8 md:border-[12px] border-zinc-950 p-5 sm:p-8 md:p-12 w-full max-w-2xl relative my-auto"
      >
        <h2 className="text-3xl md:text-5xl font-black text-zinc-950 uppercase tracking-tighter mb-3 md:mb-4 leading-none">
          Interogasi<br/>Niat Belajar
        </h2>
        <p className="text-zinc-900 font-mono font-bold uppercase tracking-widest text-xs md:text-base leading-relaxed mb-6 md:mb-8 text-justify">
          SEBELUM MENGAKSES FASILITAS, JELASKAN APA TUJUAN SPESIFIK ANDA HARI INI. APA YANG INGIN DIKUASAI? APA YANG MASIH MENJADI KELEMAHAN?
        </p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={logText}
            onChange={(e) => {
              setLogText(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="CONTOH: HARI INI SAYA HARUS MENAKLUKKAN SOAL MATRIKS KARENA KEMARIN MASIH BANYAK SALAH DI BAGIAN INVERS..."
            className={`w-full bg-zinc-50 border-4 ${errorMsg ? 'border-red-600' : 'border-zinc-950'} p-3 md:p-6 min-h-[150px] md:min-h-[200px] text-zinc-950 font-mono font-bold text-base md:text-xl placeholder-zinc-400 focus:outline-none focus:ring-0 resize-none mb-2`}
            spellCheck={false}
          />
          
          <div className="min-h-6 mb-3">
            {errorMsg && (
              <span className="text-red-600 font-black uppercase tracking-widest text-xs md:text-sm animate-pulse">
                &gt; {errorMsg}
              </span>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-zinc-950 text-white font-black text-lg md:text-xl py-4 md:py-6 uppercase tracking-widest hover:bg-zinc-800 active:scale-[0.97] transition-transform cursor-pointer"
          >
            SIMPAN & MASUK
          </button>
        </form>
      </motion.div>
    </div>
  );
}
