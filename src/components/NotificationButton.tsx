import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ChevronRight } from 'lucide-react';

interface NotificationButtonProps {
  onClick?: () => void;
  hasUnread?: boolean;
}

export function NotificationButton({ onClick, hasUnread }: NotificationButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={`group flex items-center justify-between pl-4 pr-3 py-2 rounded-full transition-all duration-500 overflow-hidden backdrop-blur-lg border ${
        hasUnread 
          ? 'bg-neutral-900/80 border-[var(--primary)]/50 text-white shadow-[0_4px_24px_rgba(0,0,0,0.4)]' 
          : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:bg-neutral-800/80 hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-2.5 relative z-10">
        <div className="relative flex items-center justify-center">
          <Bell size={16} className={`transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${hasUnread ? 'rotate-12 scale-110 text-[var(--primary)]' : 'group-hover:rotate-12'}`} />
          <AnimatePresence>
            {hasUnread && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 w-[6px] h-[6px] bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary-glow)]" 
              />
            )}
          </AnimatePresence>
        </div>
        <span className="text-[11px] font-medium tracking-widest uppercase mt-0.5">Alertas</span>
      </div>
      
      <div className="flex items-center justify-center w-5 h-5 ml-4 rounded-full bg-white/5 opacity-50 group-hover:opacity-100 group-hover:bg-white/10 transition-all duration-300">
         <ChevronRight size={12} className="transform -translate-x-0.5 group-hover:translate-x-0 transition-transform duration-300" />
      </div>
    </motion.button>
  );
}
