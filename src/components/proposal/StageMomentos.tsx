import React from 'react';
import { motion } from 'motion/react';

interface StageProps {
  onNext: () => void;
}

export const StageMomentos: React.FC<StageProps> = ({ onNext }) => {
  const fotos = [1, 2, 3, 4];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-2xl w-full p-6 space-y-6"
    >
      <h2 className="text-3xl font-black uppercase text-[#1a1a1a] text-center mb-8">📸 Momentos Especiais</h2>
      <div className="grid grid-cols-2 gap-4">
        {fotos.map((photo) => (
          <motion.div
            key={photo}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="aspect-square bg-neutral-200 border-2 border-black flex items-center justify-center cursor-pointer shadow-[4px_4px_0px_0px_#1a1a1a]"
          >
            Foto {photo}
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
