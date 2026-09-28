import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function TheVoid() {
  const [posts, setPosts] = useState([
    { id: 1, text: "Gue bener-bener capek disuruh les terus padahal otak gue udah gak masuk apa-apa.", hugs: 12 },
    { id: 2, text: "Tryout hari ini hancur banget. Rasanya mau nyerah aja.", hugs: 5 },
  ]);
  const [newPost, setNewPost] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [channel, setChannel] = useState(null);

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
      setPosts((current) => [payload.payload, ...current]);
    })
    .on('broadcast', { event: 'new-hug' }, (payload) => {
      setPosts((current) => current.map(p => p.id === payload.payload.id ? { ...p, hugs: p.hugs + 1 } : p));
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

  const handlePost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    const postData = { id: Date.now(), text: newPost, hugs: 0 };
    // Gunakan fungsi current agar selalu mendapat state terbaru
    setPosts((current) => [postData, ...current]);
    setNewPost('');

    // Broadcast ke user lain secara instan
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'new-post',
        payload: postData
      });
    }
  };

  const handleHug = (id) => {
    // Gunakan fungsi current agar tidak tertimpa state lama
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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto space-y-10"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold tracking-tight text-stone-100">The Void</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-stone-900 rounded-full border border-stone-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-stone-400">{onlineUsers} jiwa sedang online</span>
          </div>
        </div>
        <p className="text-stone-400">Lempar rasa lelahmu ke kehampaan. Anonim, aman, dan akan menghilang seiring waktu.</p>
      </div>

      <form onSubmit={handlePost} className="relative">
        <textarea 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Apa yang bikin kamu capek hari ini?"
          className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-stone-700 resize-none text-stone-100 placeholder-stone-600 transition-all"
        />
        <div className="flex justify-end mt-3">
          <button 
            type="submit"
            disabled={!newPost.trim()}
            className="px-6 py-2 bg-stone-400 text-stone-950 hover:bg-stone-300 font-semibold rounded-full active:scale-[0.97] transition-all duration-150 ease-out disabled:opacity-50"
          >
            Lepaskan
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={post.id} 
              className="p-6 bg-stone-900/40 backdrop-blur-sm rounded-2xl border border-stone-800/50 hover:border-stone-700/50 transition-colors"
            >
              <p className="text-stone-200 leading-relaxed text-lg mb-6">{post.text}</p>
              <div className="flex items-center gap-4 border-t border-stone-800/50 pt-4">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleHug(post.id)}
                  className="flex items-center gap-2 text-stone-400 hover:text-stone-100 transition-colors"
                >
                  <span className="text-xl">🫂</span>
                  <span className="font-medium">{post.hugs} Pelukan</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
