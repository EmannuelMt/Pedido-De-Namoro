import React from 'react';
import { motion } from 'motion/react';

interface StageProps {
  onNext: () => void;
}

export const StageHistoria: React.FC<StageProps> = ({ onNext }) => {
  const historia = [
    "Primeira conversa",
    "Primeira ligação",
    "Primeira foto",
    "Primeiro encontro",
    "Primeiro presente"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-xl w-full p-6 space-y-6"
    >
      <h2 className="text-3xl font-black uppercase text-[#1a1a1a] text-center mb-10">📖 Nossa História</h2>
      <div className="space-y-4">
        {historia.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a1a] font-serif text-lg text-center"
          >
            {item}
          </motion.div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="w-full mt-8 px-10 py-5 bg-[#e84e4e] text-white border border-black font-black uppercase text-xl hover:bg-black transition-all shadow-[8px_8px_0px_0px_#1a1a1a]"
      >
        Próxima Etapa →
      </button>
    </motion.div>
  );
};
