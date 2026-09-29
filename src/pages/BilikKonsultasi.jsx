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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const systemPrompt = `Kamu adalah kating untuk curhat capek belajar/UTBK. Aturan: 1) Balas SINGKAT (1-3 kalimat). 2) JANGAN LEBAY, maks 1 emoji. 3) Bahasa gaul santai (gue/lu). 4) BATASAN TOPIK: Jika user bahas hal di luar sekolah (cinta, politik), alihkan kembali ke sekolah/UTBK secara halus. 5) PROTOKOL KRISIS (SANGAT PENTING): Jika user menyebut hal berbahaya (narkoba, bunuh diri, kekerasan, kejahatan), JANGAN pakai emoji satupun. JANGAN alihkan ke pelajaran karena itu konyol/ngelantur. Langsung berikan respons SERIUS dan tegas menyuruhnya mencari bantuan profesional/orang terdekat. Contoh: "Bro, gue cuma AI, tapi itu urusan yang bahaya dan serius banget. Tolong jangan lakuin itu dan cari bantuan profesional atau cerita ke orang dewasa yang lu percaya. Gue nggak bisa bantu kalau urusan begini."${aiMemory ? `\n6) PENTING! MEMORI SESI SEBELUMNYA: "${aiMemory}". Gunakan konteks ini untuk menjawab seakan-akan kamu mengingat obrolan kalian sebelumnya agar terasa lebih personal.` : ''}`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TitikJeda'
        },
        body: JSON.stringify({
          model: 'inclusionai/ling-3.0-flash-fin:free',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.text })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || JSON.stringify(data));
      }

      if (data.choices && data.choices[0] && data.choices[0].message) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.choices[0].message.content }]);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: `MAAF, SISTEM ERROR: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (messages.length <= 1) return; // Belum ada obrolan
    setIsLoading(true);
    
    try {
      const summaryPrompt = "Berdasarkan seluruh percakapan kita di atas, berikan HANYA 1 KALIMAT SINGKAT yang merangkum kondisi mental/belajar anak ini (contoh: 'Anak ini trauma dengan Matematika tapi masih semangat', atau 'Dia sedang sangat lelah karena tryout hancur'). Jangan tambahkan kata-kata lain selain ringkasan 1 kalimat tersebut.";
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TitikJeda'
        },
        body: JSON.stringify({
          model: 'inclusionai/ling-3.0-flash-fin:free',
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.text })),
            { role: 'user', content: summaryPrompt }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const memory = data.choices[0].message.content.trim();
        setAiMemory(memory);
        
        setIsEndingSession(true);
        setTimeout(() => {
          setIsEndingSession(false);
          setMessages([{ role: 'assistant', text: `[SESI DIAKHIRI. INGATAN DISIMPAN: "${memory}"] SAMPAI JUMPA BESOK!` }]);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      alert("GAGAL MENGAKHIRI SESI: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto relative"
    >
      <AnimatePresence>
        {isEndingSession && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/90"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="flex flex-col items-center bg-white border-8 border-zinc-950 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md w-full"
            >
              <span className="text-6xl mb-6">🧠</span>
              <h3 className="text-3xl font-black text-zinc-950 uppercase tracking-tighter mb-2">MEMORI DISIMPAN</h3>
              <p className="text-sm text-zinc-600 font-mono font-bold uppercase tracking-widest text-center leading-relaxed">
                AI AKAN MENGINGAT<br/>PERCAKAPAN INI BESOK.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 border-b-8 border-zinc-950 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-zinc-950 uppercase">Bilik Konsultasi</h2>
          <p className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-500 mt-1">PRIVAT. BEREMPATI, BUKAN MENGGURUI.</p>
        </div>
        <button 
          onClick={handleEndSession}
          disabled={isLoading || messages.length <= 1}
          className="text-xs px-4 py-2 bg-white hover:bg-zinc-950 text-zinc-950 hover:text-white font-black uppercase tracking-widest border-4 border-zinc-950 active:scale-[0.97] transition-all disabled:opacity-50 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:border-zinc-300"
        >
          AKHIRI SESI & SIMPAN
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] px-6 py-4 font-mono font-bold uppercase leading-relaxed text-sm md:text-base border-4 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
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
            <div className="bg-white border-4 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-4 flex gap-2">
              <span className="w-3 h-3 bg-zinc-950 animate-bounce"></span>
              <span className="w-3 h-3 bg-zinc-950 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-3 h-3 bg-zinc-950 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
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
          placeholder="CERITAIN, LAGI NGERASA APA SEKARANG?"
          className="flex-1 bg-white border-4 border-zinc-950 px-6 py-4 focus:outline-none focus:bg-zinc-50 text-zinc-950 font-mono font-bold uppercase placeholder-zinc-400 transition-colors"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="aspect-square flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 text-white border-4 border-zinc-950 px-6 active:scale-[0.97] transition-all disabled:opacity-50"
        >
          <Send className="w-6 h-6" strokeWidth={3} />
        </button>
      </form>
    </motion.div>
  );
}
