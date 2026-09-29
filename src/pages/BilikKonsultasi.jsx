import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

export default function BilikKonsultasi() {
  const { aiMemory, setAiMemory } = useChatStore();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Halo. Aku Kakak tingkatmu. Nggak usah bahas belajar dulu kalau kamu lagi capek. Ada apa hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getContextualReply = (userMsg) => {
    const msg = userMsg.toLowerCase().trim();
    if (msg.includes('bunuh diri') || msg.includes('mati') || msg.includes('akhiri hidup') || msg.includes('self harm')) {
      return "Bro, dengerin gue baik-baik. Beban lu mungkin terasa berat banget sekarang, tapi tolong jangan sendirian. Hubungi orang dewasa yang lu percaya atau layanan konseling krisis sekarang. Hidup lu jauh lebih berharga daripada ujian apa pun.";
    }
    if (msg.includes('capek') || msg.includes('lelah') || msg.includes('burnout') || msg.includes('stres') || msg.includes('pusing') || msg.includes('berat')) {
      return "Gue paham banget rasanya. Belajar terus-terusan tanpa jeda emang bikin otak panas. Malam ini istirahat dulu, lu bukan robot. Lu mau cerita apa yang paling bikin lu kewalahan?";
    }
    if (msg.includes('takut') || msg.includes('cemas') || msg.includes('gagal') || msg.includes('pesimis') || msg.includes('anxiety') || msg.includes('insecure')) {
      return "Wajar banget punya rasa cemas, semua pejuang UTBK pasti ngerasain fase ini. Yang penting bukan menghilangkan takutnya, tapi tetap konsisten satu soal per hari. Apa bagian materi yang paling bikin lu minder?";
    }
    if (msg.includes('skor') || msg.includes('to') || msg.includes('tryout') || msg.includes('anjlok') || msg.includes('turun') || msg.includes('nilai')) {
      return "Skor TO naik turun itu hal biasa dalam proses adaptasi IRT. Jangan dinilai sebagai vonis kegagalan, tapi jadikan kompas evaluasi. Terapkan Pareto 80/20 di materi yang sering lu salah.";
    }
    if (msg.includes('halo') || msg.includes('hai') || msg.includes('hei') || msg.includes('test') || msg.length < 5) {
      return "Halo! Gue di sini, siap dengerin curhat lu. Ada uneg-uneg soal tryout, target kampus, atau lagi ngerasa stuck belajar hari ini?";
    }
    return "Gue dengerin kok. Wajar banget kalau proses persiapan UTBK ini bikin emosi naik-turun. Tarik napas dulu sejenak, jangan terlalu keras sama diri sendiri. Ceritain apa yang lagi ngeganjel di pikiran lu.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    try {
      const systemPrompt = `Kamu adalah kating untuk curhat capek belajar/UTBK. Aturan: 1) Balas SINGKAT (1-3 kalimat). 2) JANGAN LEBAY, maks 1 emoji. 3) Bahasa gaul santai (gue/lu). 4) BATASAN TOPIK: Jika user bahas hal di luar sekolah (cinta, politik), alihkan kembali ke sekolah/UTBK secara halus. 5) PROTOKOL KRISIS (SANGAT PENTING): Jika user menyebut hal berbahaya (narkoba, bunuh diri, kekerasan, kejahatan), JANGAN pakai emoji satupun. JANGAN alihkan ke pelajaran karena itu konyol/ngelantur. Langsung berikan respons SERIUS dan tegas menyuruhnya mencari bantuan profesional/orang terdekat. Contoh: "Bro, gue cuma AI, tapi itu urusan yang bahaya dan serius banget. Tolong jangan lakuin itu dan cari bantuan profesional atau cerita ke orang dewasa yang lu percaya. Gue nggak bisa bantu kalau urusan begini."${aiMemory ? `\n6) PENTING! MEMORI SESI SEBELUMNYA: "${aiMemory}". Gunakan konteks ini untuk menjawab seakan-akan kamu mengingat obrolan kalian sebelumnya agar terasa lebih personal.` : ''}`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TitikJeda'
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.text })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || JSON.stringify(data));
      }

      if (data.choices && data.choices[0] && data.choices[0].message) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.choices[0].message.content.trim() }]);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn("Using contextual mentor fallback:", error.message || error.name);
      const fallbackReply = getContextualReply(userMessage);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: fallbackReply 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (messages.length <= 1) return; // Belum ada obrolan
    setIsLoading(true);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const summaryPrompt = "Berdasarkan seluruh percakapan kita di atas, berikan HANYA 1 KALIMAT SINGKAT yang merangkum kondisi mental/belajar anak ini (contoh: 'Anak ini trauma dengan Matematika tapi masih semangat', atau 'Dia sedang sangat lelah karena tryout hancur'). Jangan tambahkan kata-kata lain selain ringkasan 1 kalimat tersebut.";
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TitikJeda'
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.text })),
            { role: 'user', content: summaryPrompt }
          ]
        })
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      let memory = "Siswa sedang berjuang mengatasi stres persiapan UTBK.";
      if (data.choices && data.choices[0] && data.choices[0].message) {
        memory = data.choices[0].message.content.trim();
      }
      
      setAiMemory(memory);
      setIsEndingSession(true);
      setTimeout(() => {
        setIsEndingSession(false);
        setMessages([{ role: 'assistant', text: `[SESI DIAKHIRI. INGATAN DISIMPAN: "${memory}"] SAMPAI JUMPA BESOK!` }]);
      }, 2000);
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn("Fallback summary used:", error.message || error.name);
      const fallbackMemory = "Siswa sedang berjuang mengatasi kelelahan belajar UTBK dan perlu fokus bertahap.";
      setAiMemory(fallbackMemory);
      setIsEndingSession(true);
      setTimeout(() => {
        setIsEndingSession(false);
        setMessages([{ role: 'assistant', text: `[SESI DIAKHIRI. INGATAN DISIMPAN: "${fallbackMemory}"] SAMPAI JUMPA BESOK!` }]);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col h-[calc(100dvh-11rem)] md:h-[calc(100dvh-8rem)] max-w-3xl mx-auto relative"
    >
      <AnimatePresence>
        {isEndingSession && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="flex flex-col items-center bg-white border-4 md:border-8 border-zinc-950 p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md w-full"
            >
              <span className="text-5xl md:text-6xl mb-4 md:mb-6">🧠</span>
              <h3 className="text-2xl md:text-3xl font-black text-zinc-950 uppercase tracking-tighter mb-2">MEMORI DISIMPAN</h3>
              <p className="text-xs md:text-sm text-zinc-600 font-mono font-bold uppercase tracking-widest text-center leading-relaxed">
                AI AKAN MENGINGAT<br/>PERCAKAPAN INI BESOK.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4 md:mb-6 border-b-4 md:border-b-8 border-zinc-950 pb-4 md:pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 md:gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-950 uppercase leading-none">Bilik Konsultasi</h2>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mt-1">PRIVAT. BEREMPATI, BUKAN MENGGURUI.</p>
        </div>
        <button 
          onClick={handleEndSession}
          disabled={isLoading || messages.length <= 1}
          className="text-xs px-3 py-1.5 md:px-4 md:py-2 bg-white hover:bg-zinc-950 text-zinc-950 hover:text-white font-black uppercase tracking-widest border-2 md:border-4 border-zinc-950 active:scale-[0.97] transition-all disabled:opacity-50 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:border-zinc-300 cursor-pointer"
        >
          AKHIRI SESI & SIMPAN
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 md:mb-6 pr-1 md:pr-2 space-y-4 md:space-y-6 scrollbar-hide overscroll-contain">
        {messages.map((msg, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[90%] md:max-w-[85%] px-4 py-3 md:px-6 md:py-4 font-mono font-bold uppercase leading-relaxed text-xs md:text-base border-2 md:border-4 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                ${msg.role === 'user' 
                  ? 'bg-zinc-950 text-white' 
                  : 'bg-white text-zinc-950'
                }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex justify-start"
          >
            <div className="bg-white border-2 md:border-4 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-3 md:px-6 md:py-4 flex gap-2">
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-zinc-950 animate-bounce"></span>
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-zinc-950 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-zinc-950 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto shrink-0 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="CERITAIN, LAGI NGERASA APA?"
          className="flex-1 bg-white border-4 border-zinc-950 px-4 md:px-6 py-3.5 md:py-4 focus:outline-none focus:bg-zinc-50 text-zinc-950 font-mono font-bold text-sm md:text-base uppercase placeholder-zinc-400 transition-colors"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="aspect-square flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 text-white border-4 border-zinc-950 px-4 md:px-6 active:scale-[0.97] transition-all disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </button>
      </form>
    </motion.div>
  );
}
