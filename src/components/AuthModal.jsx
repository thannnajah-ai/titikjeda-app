import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Cloud, Mail, Lock, ArrowRight, Zap, Info } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthModal() {
  const isAuthModalOpen = useAuthStore(state => state.isAuthModalOpen);
  const closeAuthModal = useAuthStore(state => state.closeAuthModal);
  const smartAuthWithEmail = useAuthStore(state => state.smartAuthWithEmail);
  const signInDemoUser = useAuthStore(state => state.signInDemoUser);
  const signInWithGoogle = useAuthStore(state => state.signInWithGoogle);
  const isLoading = useAuthStore(state => state.isLoading);
  const authError = useAuthStore(state => state.authError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showGoogleNotice, setShowGoogleNotice] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await smartAuthWithEmail(email, password);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-4 md:border-8 border-zinc-950 p-6 md:p-8 max-w-md w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b-4 border-zinc-950 pb-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Cloud className="w-4 h-4 text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
              SINKRONISASI CLOUD // BRANKAS PEJUANG
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-zinc-950 leading-none">
            MASUK ATAU DAFTAR
          </h2>
          <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider mt-2">
            Amankan rekam jejak streak 84 hari, skor tryout IRT, dan target kampus Anda di cloud.
          </p>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="bg-red-50 border-2 border-red-600 p-3 mb-4 text-xs font-bold text-red-600 uppercase">
            ⚠️ {authError}
          </div>
        )}

        {/* 1-Click Demo Testing User Button */}
        <div className="mb-5">
          <button
            onClick={() => signInDemoUser()}
            disabled={isLoading}
            className="w-full bg-amber-400 hover:bg-amber-300 text-black font-black p-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-zinc-950 active:scale-95 transition-transform cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>MASUK INSTAN DENGAN AKUN DEMO</span>
          </button>
        </div>

        <div className="relative flex py-1 items-center mb-5">
          <div className="flex-grow border-t-2 border-zinc-200"></div>
          <span className="flex-shrink mx-3 text-[10px] font-black text-zinc-400 uppercase">ATAU EMAIL ANDA SENDIRI</span>
          <div className="flex-grow border-t-2 border-zinc-200"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-5">
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">
              ALAMAT EMAIL:
            </label>
            <div className="flex items-center border-2 border-zinc-950 bg-zinc-50 p-2.5">
              <Mail className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-zinc-950 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">
              KATA SANDI:
            </label>
            <div className="flex items-center border-2 border-zinc-950 bg-zinc-50 p-2.5">
              <Lock className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-zinc-950 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-black p-3.5 text-xs uppercase tracking-widest border-2 border-zinc-950 active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></span>
            ) : (
              <>
                <span>MASUK / DAFTAR OTOMATIS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth Section with clear status info */}
        <div className="border-t-2 border-zinc-200 pt-4">
          <button
            onClick={() => {
              setShowGoogleNotice(true);
              signInWithGoogle();
            }}
            disabled={isLoading}
            className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold p-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-zinc-300 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>Google Login</span>
          </button>

          {showGoogleNotice && (
            <p className="text-[10px] text-zinc-500 font-bold mt-2 leading-relaxed flex items-start gap-1">
              <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <span>Jika Google menampilkan pesan "provider not enabled", gunakan Email & Kata Sandi di atas atau aktifkan Google Provider di dashboard Supabase.</span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

