import React from 'react';
import { motion } from 'motion/react';
import { MenuItems } from './DevSidebar';

export const GameSidebar = ({ currentView, onNavigate }: any) => {
  return (
    <div className="fixed md:left-4 md:top-1/2 md:-translate-y-1/2 bottom-4 left-1/2 -translate-x-1/2 md:translate-x-0 bg-[#0a0a1a]/95 border-2 border-blue-500/30 p-2 md:p-4 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.2)] z-[100] flex md:flex-col gap-2 overflow-x-auto max-w-[95vw] md:max-w-none">
       {/* HP Bar visual */}
       <div className="hidden md:block mb-4 p-2 border-b-2 border-blue-500/20">
          <p className="text-blue-400 font-mono text-[10px] mb-1">HP (Amor)</p>
          <div className="w-full h-2 bg-blue-950 rounded-full overflow-hidden">
             <div className="w-full h-full bg-blue-500 rounded-full animate-pulse" />
          </div>
       </div>

       {MenuItems.map((item) => {
          const isActive = currentView === item.view;
          return (
             <button
               key={item.view}
               onClick={() => onNavigate(item.view)}
               className={`relative p-3 md:p-4 border-2 flex items-center gap-3 transition-all group ${
                 isActive 
                   ? 'bg-blue-600 border-blue-400 scale-[1.05] shadow-[0_0_15px_rgba(59,130,246,0.6)] text-white' 
                   : 'bg-blue-950/50 border-blue-500/30 hover:border-blue-400 text-blue-200'
               }`}
             >
                <item.icon size={20} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                <span className="font-mono text-xs uppercase hidden md:inline-block tracking-widest">{item.label}</span>
                
                {/* Decoration corners */}
                {isActive && (
                  <>
                     <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white pointer-events-none" />
                     <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white pointer-events-none" />
                  </>
                )}
             </button>
          )
       })}
    </div>
  )
};
