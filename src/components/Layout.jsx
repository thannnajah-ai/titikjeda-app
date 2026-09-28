import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, MessagesSquare, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Layout() {
  const fastForward = useAppStore(state => state.fastForward);
  
  const navItems = [
    { to: '/', label: 'Pita Suara', icon: BookOpen },
    { to: '/void', label: 'The Void', icon: MessagesSquare },
    { to: '/mentor', label: 'AI Mentor', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-800/50 bg-stone-950 p-6 flex flex-col shrink-0">
        <div className="mb-12 hidden md:block">
          <h1 className="text-xl font-bold tracking-tighter text-stone-100">TitikJeda.</h1>
          <p className="text-xs text-stone-400 mt-1 font-medium">ZenUTBK</p>
        </div>
        
        <ul className="flex flex-row md:flex-col gap-2 md:gap-4 overflow-x-auto pb-4 md:pb-0">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium whitespace-nowrap md:whitespace-normal
                  ${isActive 
                    ? 'bg-stone-900 text-stone-50 border border-stone-800/30' 
                    : 'text-stone-400 hover:bg-stone-900/50 hover:text-stone-200'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto hidden md:block pt-8">
           <button 
            onClick={fastForward}
            className="w-full text-left text-xs text-stone-600 hover:text-stone-400 transition-colors"
           >
             [Dev] Fast Forward 90m
           </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-stone-950">
        <div className="max-w-4xl mx-auto min-h-screen p-6 md:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
