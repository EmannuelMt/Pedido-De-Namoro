import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Calendar, 
  Image as ImageIcon, 
  Music, 
  MessageCircle, 
  Gamepad2, 
  Heart, 
  User as UserIcon,
} from 'lucide-react';

export type View = 'home' | 'historia' | 'galeria' | 'playlist' | 'cartas' | 'jogos' | 'pedido' | 'perfil' | string;

interface FloatingSidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export const FloatingSidebar = ({ currentView, onNavigate }: FloatingSidebarProps) => {
  const menuItems = [
    { icon: Home, label: 'Home', view: 'home' },
    { icon: Calendar, label: 'Calendário', view: 'historia' },
    { icon: ImageIcon, label: 'Galeria', view: 'galeria' },
    { icon: Music, label: 'Música', view: 'playlist' },
    { icon: MessageCircle, label: 'Chat', view: 'cartas' },
    { icon: Gamepad2, label: 'Jogos', view: 'jogos' },
    { icon: Heart, label: 'Pedido', view: 'pedido' },
    { icon: UserIcon, label: 'Favoritos / Extras', view: 'perfil' },
  ];

  return (
    <>
      <div className="fixed md:left-6 lg:left-8 md:top-1/2 md:-translate-y-1/2 bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 z-[100] md:flex">
        {/* Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex md:flex-col flex-row items-center gap-1 sm:gap-2 md:gap-4 p-1.5 md:p-3 rounded-full bg-[#1c1c1e]/60 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-[95vw] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {/* Connection Line (Desktop only) */}
          <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-[1px] bg-white/5 pointer-events-none hidden md:block" />

          {menuItems.map((item, idx) => {
            const isActive = currentView === item.view;
            return (
              <div key={item.view} className="relative group perspective-1000 flex-shrink-0">
                <button
                  onClick={() => onNavigate(item.view as View)}
                  className={`relative w-[38px] h-[38px] md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-out z-10 ${
                    isActive 
                      ? 'text-[var(--bg)] shadow-[0_0_20px_var(--primary-glow)]' 
                      : 'text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon size={isActive ? 20 : 20} className={`relative z-10 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'} transition-transform duration-500`} strokeWidth={isActive ? 2.5 : 2} />
                  
                  {isActive && (
                    <motion.div
                      layoutId="ios-active-pill"
                      className="absolute inset-0 bg-[var(--primary)] rounded-full z-0"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                      style={{ 
                         boxShadow: '0 0 20px var(--primary-glow), inset 0 0 10px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  )}

                  {/* Desktop Tooltip */}
                  <div className="absolute left-[calc(100%+1.5rem)] px-4 py-2 bg-[#2c2c2e]/90 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 translate-x-[-10px] pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-2xl hidden md:block">
                    <span className="text-[11px] font-sans font-medium text-white whitespace-nowrap">{item.label}</span>
                    <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#2c2c2e]/90 border-l border-t border-white/10 rotate-[-45deg]" />
                  </div>
                  
                  {/* Mobile Tooltip (appears above) */}
                  <div className="absolute bottom-[calc(100%+1.5rem)] px-4 py-2 bg-[#2c2c2e]/90 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 translate-y-[10px] pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-2xl md:hidden block">
                    <span className="text-[11px] font-sans font-medium text-white whitespace-nowrap">{item.label}</span>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2c2c2e]/90 border-r border-b border-white/10 rotate-45" />
                  </div>
                </button>
                
                {/* Dots / Connection Indicator (Desktop) */}
                {idx < menuItems.length - 1 && (
                   <div className="hidden md:flex justify-center my-1 pointer-events-none">
                     <div className={`w-1 h-1 rounded-full transition-colors duration-500 ${isActive ? 'bg-white/40' : 'bg-white/10'}`} />
                   </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </>
  );
};
