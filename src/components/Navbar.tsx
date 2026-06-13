import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Heart, Image, Music, Gamepad2, Sparkles, FileText, Stars, Library, Menu, X, Infinity } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'home',        icon: Home,     label: 'Início',     color: 'group-hover:text-[var(--primary)]' },
  { id: 'pedido',      icon: Sparkles, label: 'Pedido',     color: 'group-hover:text-rose-400' },
  { id: 'historia',    icon: Heart,    label: 'História',   color: 'group-hover:text-red-400' },
  { id: 'galeria',     icon: Image,    label: 'Galeria',    color: 'group-hover:text-sky-400' },
  { id: 'albuns',      icon: Library,  label: 'Álbuns',     color: 'group-hover:text-emerald-400' },
  { id: 'playlist',    icon: Music,    label: 'Músicas',    color: 'group-hover:text-indigo-400' },
  { id: 'jogos',       icon: Gamepad2, label: 'Jogos',      color: 'group-hover:text-orange-400' },
  { id: 'cartas',      icon: FileText, label: 'Cartas',     color: 'group-hover:text-fuchsia-400' },
  { id: 'futuro',      icon: Stars,    label: 'Futuro',     color: 'group-hover:text-yellow-400' },
];

export function Navbar({ currentView, onNavigate, children }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-[150] transition-all duration-500 ease-out ${
          scrolled 
            ? 'h-16 lg:h-20 bg-neutral-950/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
            : 'h-20 lg:h-24 bg-gradient-to-b from-black/80 via-black/20 to-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:w-1/3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center rounded-2xl transition-all duration-500 overflow-hidden relative group ${
                scrolled ? 'w-10 h-10 bg-white/5 border border-white/10 text-white/80' : 'w-12 h-12 bg-white/10 border border-white/20 backdrop-blur-md text-white'
              }`}
              onClick={() => onNavigate('home')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Infinity size={scrolled ? 20 : 24} className="relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:text-[var(--primary)]" />
            </motion.button>
            <div className={`flex flex-col justify-center transition-all duration-500 origin-left hidden sm:flex ${scrolled ? 'scale-90 opacity-90' : 'scale-100'}`}>
              <span className="text-white font-medium tracking-tight text-lg leading-none">
                Connection<span className="text-[var(--primary)] font-bold">Established</span>
              </span>
              <span className="text-white/40 text-[9px] font-mono tracking-widest uppercase mt-1">Conexão Privada</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex justify-center items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)]">
            {MENU_ITEMS.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`group relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 z-10 ${
                    isActive 
                      ? 'text-white shadow-sm' 
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktop-active-pill"
                      className="absolute inset-0 bg-white/10 rounded-full -z-10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] border border-white/10 backdrop-blur-md"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon size={14} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-[var(--primary)]' : item.color}`} />
                  <span className={`text-[13px] relative z-10 tracking-wide font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-3 relative z-20 lg:w-1/3">
            <div className="hidden sm:flex items-center gap-2">
              {children}
            </div>
            
            {/* Mobile Actions Container (Compact) */}
            <div className="flex sm:hidden items-center gap-2">
               {children}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsOpen(true)}
              className="lg:hidden relative p-2 md:p-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[165] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-[100dvh] w-72 sm:w-80 z-[170] bg-neutral-900/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-white font-medium tracking-tight text-lg leading-none">
                    Navegação
                  </span>
                  <span className="text-[var(--primary)] text-[10px] font-mono tracking-widest uppercase mt-1.5">Painel Principal</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar space-y-1">
                {MENU_ITEMS.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsOpen(false);
                      }}
                      className={`relative w-full p-3.5 rounded-xl flex items-center gap-4 transition-all overflow-hidden group ${
                        isActive 
                          ? 'bg-white/10 text-white shadow-sm border border-white/5' 
                          : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary)] rounded-r-full shadow-[0_0_10px_var(--primary-glow)]" />
                      )}
                      
                      <div className={`p-2.5 rounded-lg transition-colors ${isActive ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-white/5 text-white/40 group-hover:text-white/80'}`}>
                        <item.icon size={18} className={isActive ? 'drop-shadow-[0_0_8px_currentColor]' : ''} />
                      </div>
                      <span className={`font-medium tracking-wide text-[15px] ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="p-6 border-t border-white/10 bg-black/20">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest text-center">ConnectionEstablished © {new Date().getFullYear()}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
