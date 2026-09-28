import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

export default function BilikKonsultasi() {
  const { aiMemory, setAiMemory } = useChatStore();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Halo. Aku Kakak tingkatmu. Nggak usah bahas belajar dulu kalau kamu lagi capek. Ada apa hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      setMessages(prev => [...prev, { role: 'assistant', text: `Maaf ya, sistemku lagi error: ${error.message}` }]);
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
        setMessages([{ role: 'assistant', text: `[Sesi Diakhiri. Ingatan disimpan: "${memory}"] Sampai jumpa besok!` }]);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengakhiri sesi: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto"
    >
      <div className="mb-6 border-b border-stone-800 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-100">Bilik Konsultasi</h2>
          <p className="text-sm text-stone-400">Privat. AI ini diinstruksikan untuk berempati, bukan menggurui.</p>
        </div>
        <button 
          onClick={handleEndSession}
          disabled={isLoading || messages.length <= 1}
          className="text-xs px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 transition-colors disabled:opacity-50"
        >
          Akhiri Sesi & Simpan
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-5 py-3.5 leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-stone-400 text-stone-950 font-medium' 
                  : 'bg-stone-900 border border-stone-800 text-stone-200'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl px-5 py-3.5 flex gap-1">
              <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto shrink-0">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ceritain, lagi ngerasa apa sekarang?"
          className="w-full bg-stone-900 border border-stone-800 rounded-full px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-stone-600 text-stone-100 placeholder-stone-500 transition-all"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-stone-400 hover:bg-stone-300 text-stone-950 rounded-full disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4 ml-[-2px]" />
        </button>
      </form>
    </motion.div>
  );
}
