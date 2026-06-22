import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface StageProps {
  onNext: () => void;
}

export const StageBoasVindas: React.FC<StageProps> = ({ onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="text-center max-w-2xl space-y-8 z-10 p-4"
    >
      <div className="w-24 h-24 bg-white border border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_#e84e4e]">
        <Heart className="w-12 h-12 text-[#e84e4e]" fill="currentColor" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a]">Olá ❤️</h1>
      <p className="text-xl text-[#1a1a1a] opacity-80 leading-relaxed font-serif">
        Preparei algo especial para você.<br />
        Quero que percorra cada etapa antes de descobrir o motivo.
      </p>
      <button
        onClick={onNext}
        className="mt-8 px-10 py-5 bg-[#e84e4e] text-white border border-black font-black uppercase text-xl hover:bg-black transition-all shadow-[8px_8px_0px_0px_#1a1a1a] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_#1a1a1a]"
      >
        Começar Jornada →
      </button>
    </motion.div>
  );
};
