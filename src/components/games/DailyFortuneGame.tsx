import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

const FORTUNES = [
  "Hoje é um ótimo dia para surpreender com um abraço silencioso.",
  "Seu amor por ela brilha mais do que qualquer estrela.",
  "Lembrem-se das primeiras mensagens que trocaram. Ri um pouco hoje.",
  "A paciência é o escudo do amor. Respire e ame.",
  "Um pequeno gesto hoje valerá como uma grande lembrança amanhã.",
  "Preparem a pipoca: hoje a sorte indica noite de filmes.",
  "Um elogio inesperado vai mudar o dia de vocês.",
  "O universo conspira a favor da felicidade de vocês hoje."
];

export const DailyFortuneGame = ({ onFinish }: { onFinish: (stats: any) => void }) => {
  const [opened, setOpened] = useState(false);
  const [fortune, setFortune] = useState('');

  const handleOpen = () => {
    if (!opened) {
      const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      setFortune(randomFortune);
      setOpened(true);
      setTimeout(() => {
        onFinish({ fortune: randomFortune });
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
      <h2 className="text-4xl font-serif text-white italic">Sorte do Dia</h2>
      <p className="text-white/40 font-mono text-xs uppercase tracking-widest">O que o universo reserva para vocês hoje?</p>

      {!opened ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="w-48 h-48 rounded-full border border-white/20 flex flex-col items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all cursor-pointer relative"
        >
          <div className="absolute inset-0 rounded-full border border-[var(--primary)]/30 animate-ping opacity-50" />
          <Sparkles size={40} className="mb-4" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Abrir Biscoito</span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="p-12 luxury-glass rounded-[3rem] max-w-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent pointer-events-none" />
          <Heart size={32} className="text-[var(--primary)] mx-auto mb-8 animate-pulse" />
          <h3 className="text-2xl font-serif text-white italic leading-relaxed">"{fortune}"</h3>
          <p className="mt-8 text-white/30 font-mono text-[10px] uppercase tracking-widest">Abençoado pelo universo da Aura</p>
        </motion.div>
      )}
    </div>
  );
};
