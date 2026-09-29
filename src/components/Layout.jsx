import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, MessagesSquare, Sparkles, PenTool, BrainCircuit, ShieldAlert, Flame, Swords, Zap, Compass, Cloud, BookX } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAdminStore } from '../store/useAdminStore';
import { useAuthStore } from '../store/useAuthStore';

export default function Layout() {
  const adminAnnouncement = useAdminStore(state => state.adminAnnouncement);
  const isAnnouncementActive = useAdminStore(state => state.isAnnouncementActive);

  const targetPTN = useAppStore(state => state.targetPTN);
  const targetScore = useAppStore(state => state.targetScore);
  const tryoutHistory = useAppStore(state => state.tryoutHistory) || [];
  const latestTryout = tryoutHistory.length > 0 ? tryoutHistory[0] : null;
  const errorLog = useAppStore(state => state.errorLog) || [];
  const unresolvedMistakesCount = errorLog.filter(e => e.status === 'unresolved').length;

  const user = useAuthStore(state => state.user);
  const openAuthModal = useAuthStore(state => state.openAuthModal);
  const signOut = useAuthStore(state => state.signOut);
  
  const navItems = [
    { to: '/', label: 'Pita Suara', icon: BookOpen },
    { to: '/rasionalisasi', label: 'Rasionalisasi PTN', icon: Compass },
    { to: '/tryout', label: 'Tryout Kilat', icon: Swords },
    { to: '/dosa', label: 'Buku Dosa', icon: BookX, badge: unresolvedMistakesCount },
    { to: '/bedah', label: 'Bedah Soal AI', icon: Zap },
    { to: '/streak', label: 'Streak & Heatmap', icon: Flame },
    { to: '/one', label: '1 Soal Sehari', icon: BrainCircuit },
    { to: '/mentor', label: 'AI Mentor', icon: Sparkles },
    { to: '/void', label: 'The Void', icon: MessagesSquare },
    { to: '/oath', label: 'Sumpah Darah', icon: PenTool },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-white">
      {/* Mobile Top Brand Header */}
      <header className="md:hidden border-b-4 border-zinc-950 bg-zinc-50 px-4 py-3 flex items-center justify-between shrink-0 z-20">
        <div>
          <h1 className="text-xl font-black tracking-tighter text-zinc-950 uppercase leading-none">TitikJeda.</h1>
          <p className="text-[10px] text-zinc-600 font-mono font-bold tracking-widest uppercase">ZenUTBK V3</p>
        </div>
        <div className="flex items-center gap-2">
          {!user ? (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1 bg-amber-400 text-black text-[10px] font-mono font-black uppercase px-2 py-1 border border-zinc-950 cursor-pointer active:scale-95"
            >
              <Cloud className="w-3 h-3 text-black" />
              <span>SIMPAN</span>
            </button>
          ) : (
            <button
              onClick={signOut}
              className="flex items-center gap-1 bg-zinc-200 text-zinc-800 text-[10px] font-mono font-bold uppercase px-2 py-1 border border-zinc-400"
              title="Klik untuk Keluar"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-none inline-block"></span>
              <span className="max-w-[70px] truncate">{user.email?.split('@')[0]}</span>
            </button>
          )}

          <NavLink 
            to="/admin" 
            className="flex items-center gap-1 bg-zinc-950 text-white text-[10px] font-mono font-black uppercase px-2 py-1"
          >
            <ShieldAlert className="w-3 h-3 text-red-500" />
            <span>ADMIN</span>
          </NavLink>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-zinc-950 bg-zinc-50 p-3 md:p-6 flex flex-col shrink-0 z-10">
        <div className="mb-12 hidden md:block">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase leading-none">TitikJeda.</h1>
          <p className="text-xs text-zinc-600 mt-1 font-mono font-bold tracking-widest uppercase">ZenUTBK V3</p>
        </div>
        
        <ul className="flex flex-row md:flex-col gap-2 md:gap-4 overflow-x-auto pb-1 md:pb-0 scrollbar-hide touch-pan-x">
          {navItems.map((item) => (
            <li key={item.to} className="shrink-0 md:shrink">
              <NavLink 
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 font-mono font-bold uppercase text-xs md:text-sm whitespace-nowrap md:whitespace-normal border-2
                  ${isActive 
                    ? 'bg-zinc-950 text-white border-zinc-950' 
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950 active:scale-[0.97] transition-transform'
                  }`
                }
              >
                <item.icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-none shrink-0 ml-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto hidden md:block pt-6">
          {!user ? (
            <button 
              onClick={openAuthModal}
              className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-mono font-black text-xs uppercase p-3 border-2 border-zinc-950 flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] active:scale-95 transition-transform mb-3"
            >
              <Cloud className="w-4 h-4 text-amber-400" />
              <span>SIMPAN PROGRES (CLOUD)</span>
            </button>
          ) : (
            <div className="bg-white border-2 border-zinc-950 p-2.5 mb-3 font-mono text-[10px]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-zinc-950 truncate max-w-[130px]" title={user.email}>
                  {user.email}
                </span>
                <span className="w-2 h-2 bg-emerald-500 rounded-none animate-pulse" title="Tersinkronisasi Cloud"></span>
              </div>
              <div className="flex items-center justify-between text-zinc-500 font-bold border-t border-zinc-200 pt-1 mt-1">
                <span className="text-emerald-600 font-black">SINKRON AKTIF 🟢</span>
                <button 
                  onClick={signOut} 
                  className="text-red-600 font-black hover:underline cursor-pointer"
                >
                  [KELUAR]
                </button>
              </div>
            </div>
          )}

           <NavLink 
            to="/admin"
            className="w-full flex items-center gap-2 text-left text-[11px] font-mono font-black uppercase tracking-widest text-zinc-500 hover:text-red-600 transition-colors pt-2 border-t-2 border-zinc-200 cursor-pointer"
           >
             <ShieldAlert className="w-4 h-4 text-red-600" />
             <span>[OTORITAS ADMIN]</span>
           </NavLink>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-white overflow-x-hidden flex flex-col">
        {/* Spartan HUD Ticker: Target PTN, Skor Saat Ini, & Defisit */}
        <div className="bg-zinc-950 text-white font-mono text-[10px] md:text-xs font-bold border-b-4 border-zinc-950 px-3 md:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 bg-red-600 rounded-none animate-pulse shrink-0"></span>
            <span className="text-zinc-400 uppercase shrink-0">TARGET:</span>
            <NavLink 
              to="/rasionalisasi" 
              className="text-amber-400 font-black uppercase hover:underline truncate"
              title="Klik untuk ubah target di Rasionalisasi PTN"
            >
              {targetPTN || 'STEI ITB'}
            </NavLink>
            <span className="text-zinc-500 hidden sm:inline">|</span>
            <span className="text-zinc-400 uppercase hidden sm:inline">AMAN: {targetScore || 735} PTS</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-zinc-400 uppercase hidden xs:inline">SKOR TO:</span>
            <span className="font-black text-white">
              {latestTryout ? `${latestTryout.score} PTS` : 'BELUM TO'}
            </span>
            {latestTryout && (
              <span className={`px-1.5 py-0.5 text-[9px] font-black uppercase border ${
                latestTryout.score >= targetScore 
                  ? 'bg-emerald-600 border-emerald-400 text-white' 
                  : 'bg-red-600 border-red-400 text-white'
              }`}>
                {latestTryout.score >= targetScore 
                  ? `+${latestTryout.score - targetScore} AMAN` 
                  : `${latestTryout.score - targetScore} PTS`}
              </span>
            )}
            <NavLink
              to="/rasionalisasi"
              className="ml-2 text-[9px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black px-2 py-0.5 uppercase border border-zinc-600"
            >
              CEK RASIONAL ↗
            </NavLink>
          </div>
        </div>

        {/* Admin Global Announcement Banner */}
        {isAnnouncementActive && adminAnnouncement && (
          <div className="bg-zinc-900 text-white font-mono text-[11px] md:text-xs font-black uppercase px-4 py-2 flex items-center justify-between border-b-4 border-zinc-950 relative z-20 shrink-0">
            <div className="flex items-center gap-2 overflow-hidden w-full">
              <span className="bg-red-600 text-white px-2 py-0.5 text-[9px] md:text-[10px] shrink-0 font-black animate-pulse">
                WARTA PUSAT
              </span>
              <span className="truncate tracking-wider">{adminAnnouncement}</span>
            </div>
          </div>
        )}

        {/* Subtle brutalist grid background pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="flex-1 max-w-4xl mx-auto w-full min-h-[calc(100dvh-5rem)] md:min-h-screen p-4 sm:p-6 md:p-12 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-12 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
