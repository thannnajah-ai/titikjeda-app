import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, MessagesSquare, Sparkles, Target, PenTool, BrainCircuit, FileText, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAdminStore } from '../store/useAdminStore';

export default function Layout() {
  const fastForward = useAppStore(state => state.fastForward);
  const resetAlibiStatus = useAppStore(state => state.resetAlibiStatus);
  const adminAnnouncement = useAdminStore(state => state.adminAnnouncement);
  const isAnnouncementActive = useAdminStore(state => state.isAnnouncementActive);
  
  const navItems = [
    { to: '/', label: 'Pita Suara', icon: BookOpen },
    { to: '/mentor', label: 'AI Mentor', icon: Sparkles },
    { to: '/void', label: 'The Void', icon: MessagesSquare },
    { to: '/blindspot', label: 'Titik Buta', icon: Target },
    { to: '/one', label: '1 Soal Sehari', icon: BrainCircuit },
    { to: '/oath', label: 'Sumpah Darah', icon: PenTool },
    { to: '/alibi', label: 'Jurnal Alibi', icon: FileText },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-white">
      {/* Mobile Top Brand Header */}
      <header className="md:hidden border-b-4 border-zinc-950 bg-zinc-50 px-4 py-3 flex items-center justify-between shrink-0 z-20">
        <div>
          <h1 className="text-xl font-black tracking-tighter text-zinc-950 uppercase leading-none">TitikJeda.</h1>
          <p className="text-[10px] text-zinc-600 font-mono font-bold tracking-widest uppercase">ZenUTBK V3</p>
        </div>
        <div className="flex items-center gap-3">
          <NavLink 
            to="/admin" 
            className="flex items-center gap-1 bg-zinc-950 text-white text-[10px] font-mono font-black uppercase px-2 py-1"
          >
            <ShieldAlert className="w-3 h-3 text-red-500" />
            <span>ADMIN</span>
          </NavLink>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-none animate-pulse"></span>
            <span className="text-[10px] font-mono font-black uppercase text-zinc-600">LIVE</span>
          </div>
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
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto hidden md:block pt-8 space-y-2">
           <button 
            onClick={fastForward}
            className="w-full text-left text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
           >
             [DEV] FAST FORWARD 90M
           </button>
           <button 
            onClick={resetAlibiStatus}
            className="w-full text-left text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
           >
             [DEV] RESET ALIBI (ANTI-ZOMBIE)
           </button>
           <button 
            onClick={() => useAppStore.getState().setDailyStatus(null)}
            className="w-full text-left text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
           >
             [DEV] RESET 1 SOAL (STATUS)
           </button>
           <button 
            onClick={() => {
              localStorage.removeItem('titikjeda-void-posts');
              window.location.reload();
            }}
            className="w-full text-left text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
           >
             [DEV] RESET THE VOID (POSTS)
           </button>
           <NavLink 
            to="/admin"
            className="w-full block text-left text-[11px] font-mono font-black uppercase tracking-widest text-red-600 hover:text-zinc-950 transition-colors pt-3 border-t-2 border-zinc-200"
           >
             [OTORITAS ADMIN]
           </NavLink>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-white overflow-x-hidden flex flex-col">
        {/* Admin Global Announcement Banner */}
        {isAnnouncementActive && adminAnnouncement && (
          <div className="bg-zinc-950 text-white font-mono text-[11px] md:text-xs font-black uppercase px-4 py-2 flex items-center justify-between border-b-4 border-zinc-950 relative z-20 shrink-0">
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
