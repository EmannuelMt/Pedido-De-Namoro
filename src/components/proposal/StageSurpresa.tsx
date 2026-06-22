import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface StageProps {
  onNext: () => void;
}

export const StageSurpresa: React.FC<StageProps> = ({ onNext }) => {
  const [contagem, setContagem] = useState(3);

  useEffect(() => {
    if (contagem > 0) {
      const timer = setTimeout(() => setContagem(contagem - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onNext();
    }
  }, [contagem, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex items-center justify-center z-50 text-white"
    >
      <motion.h1
        key={contagem}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 2, opacity: 1 }}
        exit={{ scale: 3, opacity: 0 }}
        className="text-9xl font-black"
      >
        {contagem > 0 ? contagem : "❤️"}
      </motion.h1>
    </motion.div>
  );
};
