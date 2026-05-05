import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X, ChevronRight, Home as HomeIcon, Heart, Unlock, Terminal, Star, Zap, Sparkles } from 'lucide-react';
import { audioManager } from '../lib/audioManager';

// --- Toast Context & Types ---
export type ToastType = 'info' | 'success' | 'warning' | 'love' | 'system' | 'unlock' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ 
  children: React.ReactNode
}> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [themeMode, setThemeMode] = useState<string>('luxury');
  const [layoutMode, setLayoutMode] = useState<string>('auto');
  const [category, setCategory] = useState<string>('romance');
  const [notifConfig, setNotifConfig] = useState({ enabled: true, sound: true, duration: 5000 });

  useEffect(() => {
    // Initialize from localStorage
    setThemeMode(localStorage.getItem('themeMode') || 'luxury');
    setLayoutMode(localStorage.getItem('layoutMode') || 'auto');
    const savedCat = localStorage.getItem('themeCategory');
    if (savedCat) setCategory(savedCat);
    
    const savedNotif = localStorage.getItem('notificationConfig');
    if (savedNotif) setNotifConfig(JSON.parse(savedNotif));

    const handleThemeChange = (e: any) => {
      setThemeMode(e.detail.themeMode);
      setCategory(e.detail.category || 'romance');
    };
    const handleLayoutChange = (e: any) => setLayoutMode(e.detail);
    const handleNotifConfigChange = (e: any) => setNotifConfig(e.detail);

    window.addEventListener('themeChanged', handleThemeChange);
    window.addEventListener('layoutChanged', handleLayoutChange);
    window.addEventListener('notificationConfigChanged', handleNotifConfigChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
      window.removeEventListener('layoutChanged', handleLayoutChange);
      window.removeEventListener('notificationConfigChanged', handleNotifConfigChange);
    };
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    setNotifConfig(currentConfig => {
      if (!currentConfig.enabled) return currentConfig;
      
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
      
      // Play sound based on type
      if (currentConfig.sound) {
        if (type === 'success') audioManager.playSound('success');
        else if (type === 'error') audioManager.playSound('error');
        else if (type === 'love') audioManager.playSound('success');
        else if (type === 'unlock') audioManager.playSound('success');
        else audioManager.playSound('feedback');
      }

      setTimeout(() => {
        removeToast(id);
      }, currentConfig.duration);
      
      return currentConfig;
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Determine variant
  let variant = 'romantic';
  if (category === 'game' || category === 'music') variant = 'game';
  else if (category === 'dev' || category === 'corporate') variant = 'dev';
  else if (category === 'cinema' || category === 'classic' || category === 'travel') variant = 'cinematic';
  else if (category === 'nature') variant = 'minimal';
  else if (category === 'spiritual' || category === 'experimental' || category === 'emotion') variant = 'spiritual';

  // Determine position
  let positionClass = "bottom-10 right-10";
  if (layoutMode === 'game-hud' || layoutMode === 'dev-terminal' || layoutMode === 'dashboard-pro' || layoutMode === 'analytics-grid') positionClass = "top-10 right-10";
  if (layoutMode === 'holographic-ui' || layoutMode === 'aura-flow' || layoutMode === 'ritual-circle' || layoutMode === 'energy-pulse') positionClass = "top-10 left-1/2 -translate-x-1/2";
  if (layoutMode === 'zen-minimal' || layoutMode === 'letter-layout' || layoutMode === 'blur-focus') positionClass = "bottom-10 left-10";

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className={`fixed z-[200] flex flex-col gap-4 pointer-events-none ${positionClass}`}>
        <AnimatePresence>
          {toasts.map((toast) => {
            
            // Render specific variants
            if (variant === 'game') {
              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="pointer-events-auto bg-[#0a0a1a] border-2 border-blue-500 text-blue-400 p-4 font-mono flex items-center gap-4 shadow-[0_0_15px_rgba(59,130,246,0.5)] transform -skew-x-6"
                >
                  <div className="bg-blue-600 text-white p-2">
                    {toast.type === 'unlock' ? <Unlock size={16} /> : <Zap size={16} />}
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-500 mb-1 uppercase">SYSTEM NOTIFICATION</p>
                    <p className="text-sm uppercase font-bold tracking-widest">{toast.message}</p>
                  </div>
                </motion.div>
              );
            }

            if (variant === 'dev') {
              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="pointer-events-auto bg-black/90 border border-green-500/30 text-green-400 p-4 font-mono flex flex-col gap-2 max-w-md w-80 shadow-xl"
                >
                  <div className="flex justify-between items-center text-xs opacity-50 border-b border-green-500/20 pb-1 mb-1">
                    <span>&gt; process.log()</span>
                    <span>[{toast.type.toUpperCase()}]</span>
                  </div>
                  <p className="text-sm">
                    <span className="text-white/50 mr-2">$</span>
                    {toast.message}
                  </p>
                </motion.div>
              );
            }

            if (variant === 'spiritual') {
              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8 }}
                  className="pointer-events-auto p-6 rounded-full flex items-center justify-center gap-4 min-w-[300px] max-w-md relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent backdrop-blur-xl border border-white/10 rounded-full" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
                  <Sparkles size={16} className="text-purple-300 relative z-10 animate-pulse" />
                  <p className="text-sm text-purple-100 font-serif italic relative z-10 tracking-widest text-center">{toast.message}</p>
                  <Sparkles size={16} className="text-blue-300 relative z-10 animate-pulse delay-700" />
                </motion.div>
              );
            }

            if (variant === 'cinematic') {
              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="pointer-events-auto px-12 py-6 bg-black/60 backdrop-blur-md flex items-center justify-center min-w-[300px]"
                >
                  <p className="text-lg text-white/80 font-serif tracking-[0.2em] uppercase text-center">{toast.message}</p>
                </motion.div>
              );
            }

            if (variant === 'minimal') {
              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-auto bg-white border border-gray-100 shadow-sm text-gray-800 px-6 py-3 rounded-md flex items-center gap-3 text-sm"
                >
                  {toast.type === 'success' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                  {toast.type === 'error' && <div className="w-2 h-2 rounded-full bg-red-500" />}
                  {toast.type === 'love' && <Heart size={14} className="text-gray-400" />}
                  <p>{toast.message}</p>
                </motion.div>
              );
            }

            // Default theme-integrated toast
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={`pointer-events-auto p-4 flex items-center gap-4 glass-card min-w-[280px] max-w-sm ${
                  toast.type === 'success' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                  toast.type === 'error' ? 'border-rose-500/30 text-rose-400 bg-rose-500/5' :
                  toast.type === 'love' ? 'border-pink-500/30 text-pink-400 bg-pink-500/5' :
                  'border-white/10 text-white bg-[var(--theme-card-bg)]'
                }`}
              >
                <div className="flex-shrink-0 drop-shadow-md">
                  {toast.type === 'success' && <CheckCircle2 size={20} />}
                  {toast.type === 'error' && <AlertCircle size={20} />}
                  {toast.type === 'love' && <Heart size={20} fill="currentColor" />}
                  {toast.type === 'info' && <Info size={20} />}
                  {toast.type === 'system' && <Star size={20} />}
                  {toast.type === 'unlock' && <Unlock size={20} />}
                  {(toast.type === 'warning') && <AlertCircle size={20} />}
                </div>
                <p className="flex-1 text-sm font-sans tracking-wide leading-snug">{toast.message}</p>
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors opacity-40 hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

// --- Breadcrumbs ---
export const Breadcrumbs = ({ currentView, onNavigate }: { currentView: string, onNavigate: (view: any) => void }) => {
  const parts = currentView.split(' > ').map(p => p.trim());
  
  return (
    <nav className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-none opacity-80 hover:opacity-100 transition-opacity duration-500">
      <button 
        onClick={() => {
            audioManager.playSound('click');
            onNavigate('home');
        }}
        className="p-2.5 rounded-full text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/5 flex items-center justify-center group shrink-0 shadow-sm"
      >
        <HomeIcon size={14} className="group-hover:scale-110 transition-transform" />
      </button>
      
      {parts.map((part, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={12} className="text-white/20 shrink-0" />
          <div className={`px-4 py-1.5 rounded-full border transition-all shrink-0 backdrop-blur-md ${
            idx === parts.length - 1
              ? 'bg-[var(--primary)]/10 border-[var(--primary)]/40 text-[var(--primary)] font-medium shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]'
              : 'bg-white/5 border-white/5 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/10 cursor-default'
          }`}>
             <span className="text-[9px] sm:text-[10px] font-sans font-semibold uppercase tracking-[0.25em] whitespace-nowrap">{part}</span>
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

// --- Skeleton Loaders ---
export const SkeletonRect = ({ className }: { className?: string }) => (
  <div className={`bg-white/5 rounded-2xl relative overflow-hidden ${className}`}>
    <motion.div
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
    />
  </div>
);

export const ViewSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto px-4 py-20 space-y-12">
    <div className="space-y-4">
      <SkeletonRect className="w-48 h-4" />
      <SkeletonRect className="w-full md:w-2/3 h-16 md:h-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="aspect-[4/5] md:aspect-square">
          <SkeletonRect className="w-full h-full" />
        </div>
      ))}
    </div>
  </div>
);

// --- Magnetic Interaction HoC ---
export const MagneticButton = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (clientX - centerX) * 0.4;
    const y = (clientY - centerY) * 0.4;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const Tooltip = ({ children, text, position = 'top' }: { children: React.ReactNode, text: string, position?: 'top' | 'bottom' | 'left' | 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--text)] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--text)] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--text)] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--text)] border-y-transparent border-l-transparent'
  };

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className={`absolute z-[200] px-4 py-2 bg-[var(--text)] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl pointer-events-none whitespace-nowrap ${positionClasses[position]}`}
          >
            <span className="text-[10px] font-mono text-[var(--bg)] uppercase tracking-widest">{text}</span>
            <div className={`absolute border-4 ${arrowClasses[position]}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
