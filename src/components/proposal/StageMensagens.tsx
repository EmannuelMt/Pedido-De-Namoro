import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface StageProps {
  onNext: () => void;
}

export const StageMensagens: React.FC<StageProps> = ({ onNext }) => {
  const [aberta, setAberta] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-xl w-full p-6 space-y-6"
    >
      <h2 className="text-3xl font-black uppercase text-[#1a1a1a] text-center mb-10">💌 Cartas de Amor</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((carta) => (
          <motion.div
            key={carta}
            onClick={() => setAberta(aberta === carta ? null : carta)}
            className="p-6 border-2 border-black bg-white cursor-pointer shadow-[4px_4px_0px_0px_#1a1a1a] hover:bg-rose-50"
          >
            <h3 className="font-black">Carta {carta} {aberta === carta ? '↑' : '↓'}</h3>
            <AnimatePresence>
              {aberta === carta && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 font-serif italic text-neutral-700"
                >
                  Conteúdo emocionante da carta {carta}...
                </motion.p>
              )}
            </AnimatePresence>
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
