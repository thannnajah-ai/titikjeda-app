import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabase';

export default function BloodOath() {
  const sigCanvas = useRef(null);
  const navigate = useNavigate();
  const setOathSignature = useAppStore(state => state.setOathSignature);
  const oathSignature = useAppStore(state => state.oathSignature);
  
  // If already signed, show the Certificate Mode instead of the signing form
  if (oathSignature) {
    return (
      <div className="max-w-2xl mx-auto mt-6 md:mt-12 p-5 md:p-8 bg-white border-4 md:border-[8px] border-zinc-950 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-zinc-950 mb-6 tracking-tighter">Kontrak Absolut</h2>
        <p className="text-zinc-800 text-center font-mono leading-relaxed mb-8 md:mb-12 text-sm md:text-base">
          SAYA TELAH MENGIKATKAN DIRI PADA SUMPAH INI.<br/>
          SAYA TIDAK AKAN MUNDUR, BERHENTI, ATAU MENGELUH.<br/>
          SAYA AKAN MENCAPAI TARGET SAYA.
        </p>
        <div className="w-full max-w-sm border-b-2 border-zinc-950 flex justify-center mb-4">
          <img src={oathSignature} alt="Tanda Tangan" className="h-24 md:h-32 object-contain mix-blend-multiply" />
        </div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sah dan Permanen</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-8 md:mt-12 w-full bg-zinc-950 text-white font-black py-4 uppercase tracking-widest active:scale-97"
        >
          Kembali ke Loker
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      if (sigCanvas.current.isEmpty()) {
        alert("Tanda tangan tidak boleh kosong.");
        return;
      }
      
      const dataURL = sigCanvas.current.getCanvas().toDataURL('image/png');
      setOathSignature(dataURL); // Langsung simpan lokal agar UI instan berubah
      
      // Integrasi Task 4: Upload ke Supabase (jika .env sudah dikonfigurasi)
      if (import.meta.env.VITE_SUPABASE_URL) {
        try {
          // Konversi Base64 ke Blob
          const blob = await (await fetch(dataURL)).blob();
          const filename = `oath_${Date.now()}.png`;
          
          // Asumsi: Bucket bernama 'oaths' sudah dibuat di Supabase
          const { data, error } = await supabase.storage
            .from('oaths')
            .upload(filename, blob, { contentType: 'image/png' });
            
          if (error) {
            console.error("Gagal upload ke Storage:", error.message);
          } else {
            console.log("Tanda tangan berhasil di-upload secara online!", data);
            // Anda bisa mengekstrak Public URL dan menyimpannya ke tabel database di sini
          }
        } catch (uploadError) {
          console.error("Error saat proses upload:", uploadError);
        }
      }
      
    } catch (error) {
      alert("Error menyimpan tanda tangan: " + error.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
      className="max-w-2xl mx-auto mt-4 md:mt-12"
    >
      <div className="bg-white border-8 md:border-[12px] border-zinc-950 p-4 sm:p-6 md:p-10 relative">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-950 uppercase mb-6 md:mb-8 text-center leading-[0.9]">
          Kontrak<br/>Sumpah Darah
        </h2>
        
        <div className="text-zinc-900 font-mono text-xs md:text-base leading-relaxed space-y-4 md:space-y-6 mb-8 md:mb-12 text-justify">
          <p>
            DENGAN INI SAYA MENYATAKAN BAHWA SAYA SEPENUHNYA BERTANGGUNG JAWAB ATAS MASA DEPAN SAYA SENDIRI.
          </p>
          <p>
            SAYA MENYADARI BAHWA RASA MALAS, KECEMASAN, DAN ALASAN-ALASAN KECIL ADALAH MUSUH UTAMA SAYA. SAYA BERJANJI TIDAK AKAN MENYERAH SEBELUM TARGET SAYA TERCAPAI, APA PUN KENDALANYA.
          </p>
          <p>
            KONTRAK INI BERSIFAT MENGIKAT SECARA PSIKOLOGIS DAN TIDAK DAPAT DIBATALKAN ATAU DIHAPUS SETELAH DITANDATANGANI.
          </p>
        </div>

        <div className="mb-6 md:mb-8">
          <label className="block text-xs font-black text-zinc-950 mb-2 uppercase tracking-widest">
            Bubuhkan Tanda Tangan Anda
          </label>
          {/* Canvas Wrapper - touch-none stops touch scrolling so stroke drawing works on phones */}
          <div className="bg-white border-4 border-zinc-950 w-full rounded-none relative z-10 touch-none">
            <SignatureCanvas 
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                className: 'w-full h-44 md:h-64 cursor-crosshair'
              }}
            />
          </div>
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => sigCanvas.current.clear()}
              className="text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-950 active:scale-[0.97] transition-transform"
            >
              Ulangi Coretan
            </button>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-[#ff0033] text-white font-black text-lg md:text-xl py-4 md:py-6 uppercase tracking-widest active:scale-[0.97] transition-transform cursor-pointer relative z-20"
        >
          SAH
        </button>
      </div>
    </motion.div>
  );
}
