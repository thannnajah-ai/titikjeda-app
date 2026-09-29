import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { supabase } from '../lib/supabase';

const DEFAULT_POSTS = [
  { id: 1, text: "Gue bener-bener capek disuruh les terus padahal otak gue udah gak masuk apa-apa.", hugs: 12 },
  { id: 2, text: "Tryout hari ini hancur banget. Rasanya mau nyerah aja.", hugs: 5 },
];

const STORAGE_KEY = 'titikjeda-void-posts';

export default function TheVoid() {
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Gagal membaca storage The Void:", e);
    }
    return DEFAULT_POSTS;
  });
  const [newPost, setNewPost] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [channel, setChannel] = useState(null);
  
  const controls = useAnimation();

  // Sinkronisasi otomatis ke localStorage setiap kali posts berubah
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error("Gagal menyimpan ke storage The Void:", e);
    }
  }, [posts]);

  useEffect(() => {
    // Inisialisasi Realtime Channel
    const ch = supabase.channel('the-void-room', {
      config: { presence: { key: 'user_' + Math.random() } }
    });

    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState();
      setOnlineUsers(Object.keys(state).length || 1);
    })
    .on('broadcast', { event: 'new-post' }, (payload) => {
      if (payload?.payload) {
        setPosts((current) => {
          if (current.some(p => p.id === payload.payload.id)) return current;
          return [payload.payload, ...current];
        });
      }
    })
    .on('broadcast', { event: 'new-hug' }, (payload) => {
      if (payload?.payload?.id) {
        setPosts((current) => current.map(p => p.id === payload.payload.id ? { ...p, hugs: (p.hugs || 0) + 1 } : p));
      }
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await ch.track({ online_at: new Date().toISOString() });
      }
    });

    setChannel(ch);

    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    const textToSubmit = newPost;
    
    // Animasi terbang ke atas (membuang beban)
    await controls.start({ y: -100, opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: "easeIn" } });
    
    const postData = { id: Date.now(), text: textToSubmit, hugs: 0 };
    setPosts((current) => [postData, ...current]);
    setNewPost('');

    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'new-post',
        payload: postData
      });
    }

    controls.set({ y: 50, opacity: 0, scale: 0.9 });
    controls.start({ y: 0, opacity: 1, scale: 1, transition: { type: "spring", bounce: 0, duration: 0.3 } });
  };

  const handleHug = (id) => {
    setPosts((current) => current.map(p => p.id === id ? { ...p, hugs: p.hugs + 1 } : p));
    
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'new-hug',
        payload: { id }
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="max-w-2xl mx-auto space-y-10"
    >
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4">
          <h2 className="text-5xl font-black tracking-tighter text-zinc-950 uppercase leading-none">The Void</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border-4 border-zinc-950">
            <span className="w-2 h-2 bg-white animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">{onlineUsers} JIWA ONLINE</span>
          </div>
        </div>
        <p className="text-zinc-600 font-mono font-bold uppercase tracking-widest text-sm">Lempar rasa lelahmu ke kehampaan. Anonim dan rahasia.</p>
      </div>

      <motion.form animate={controls} onSubmit={handlePost} className="relative border-4 border-zinc-950 bg-white p-2">
        <textarea 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="APA YANG MEMBUATMU MUAK HARI INI?"
          className="w-full bg-zinc-50 border-4 border-transparent p-4 min-h-[120px] focus:outline-none focus:border-zinc-950 resize-none text-zinc-950 font-mono font-bold text-lg uppercase placeholder-zinc-300 transition-colors"
          spellCheck={false}
        />
        <div className="flex justify-end mt-2">
          <button 
            type="submit"
            disabled={!newPost.trim()}
            className="px-8 py-3 bg-zinc-950 text-white font-black uppercase tracking-widest active:scale-[0.97] transition-transform disabled:opacity-50"
          >
            LEPASKAN
          </button>
        </div>
      </motion.form>

      <div className="space-y-4">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={post.id} 
              className="p-6 bg-white border-4 border-zinc-950 hover:bg-zinc-50 transition-colors"
            >
              <p className="text-zinc-950 font-mono font-bold uppercase leading-relaxed text-lg mb-6">{post.text}</p>
              <div className="flex items-center gap-4 border-t-4 border-zinc-950 pt-4">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleHug(post.id)}
                  className="flex items-center gap-2 text-zinc-600 hover:text-zinc-950 transition-colors bg-zinc-200 px-4 py-1 font-black uppercase tracking-widest text-sm"
                >
                  <span>🫂</span>
                  <span>{post.hugs} Pelukan</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
