import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface UniverseEmptyStateProps {
  onStart: () => void;
}

export const UniverseEmptyState = ({ onStart }: UniverseEmptyStateProps) => {
  return (
    <div className="flex-1 min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-black text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-black to-black" />
        {/* Simple particle effect representation */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10 glass-card p-12 rounded-[3rem] border border-white/10"
      >
        <div className="w-20 h-20 mx-auto bg-rose-500/10 rounded-full flex items-center justify-center mb-8 border border-rose-500/20">
          <Sparkles className="text-rose-500 w-10 h-10 animate-pulse" />
        </div>
        
        <h2 className="text-3xl font-serif text-white mb-4 italic tracking-tight">
          Seu universo ainda não começou 💫
        </h2>
        
        <p className="text-white/50 font-mono text-[11px] uppercase tracking-widest leading-relaxed mb-10">
          Responda o formulário para criar<br/>
          uma experiência única.
        </p>

        <button 
          onClick={onStart}
          className="w-full py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
        >
          Preparando nosso Universo <Sparkles size={16} />
        </button>
      </motion.div>
    </div>
  );
};
