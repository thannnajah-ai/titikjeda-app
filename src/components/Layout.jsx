import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, MessagesSquare, Sparkles, Target, PenTool, BrainCircuit } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Layout() {
  const fastForward = useAppStore(state => state.fastForward);
  const resetAlibiStatus = useAppStore(state => state.resetAlibiStatus);
  
  const navItems = [
    { to: '/', label: 'Pita Suara', icon: BookOpen },
    { to: '/mentor', label: 'AI Mentor', icon: Sparkles },
    { to: '/void', label: 'The Void', icon: MessagesSquare },
    { to: '/blindspot', label: 'Titik Buta', icon: Target },
    { to: '/one', label: '1 Soal Sehari', icon: BrainCircuit },
    { to: '/oath', label: 'Sumpah Darah', icon: PenTool },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-zinc-950 bg-zinc-50 p-6 flex flex-col shrink-0 z-10">
        <div className="mb-12 hidden md:block">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase leading-none">TitikJeda.</h1>
          <p className="text-xs text-zinc-600 mt-1 font-mono font-bold tracking-widest uppercase">ZenUTBK V3</p>
        </div>
        
        <ul className="flex flex-row md:flex-col gap-2 md:gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 font-mono font-bold uppercase whitespace-nowrap md:whitespace-normal border-2
                  ${isActive 
                    ? 'bg-zinc-950 text-white border-zinc-950' 
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950 active:scale-[0.97] transition-transform'
                  }`
                }
              >
                <item.icon className="w-5 h-5" strokeWidth={2.5} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto hidden md:block pt-8 space-y-2">
           <button 
            onClick={fastForward}
            className="w-full text-left text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors"
           >
             [DEV] FAST FORWARD 90M
           </button>
           <button 
            onClick={resetAlibiStatus}
            className="w-full text-left text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors"
           >
             [DEV] RESET ALIBI (ANTI-ZOMBIE)
           </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-white overflow-hidden">
        {/* Subtle brutalist grid background pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-4xl mx-auto min-h-screen p-6 md:p-12 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
