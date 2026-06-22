import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Star } from 'lucide-react';

interface StageProps {
  onAccept: () => void;
}

export const StagePedido: React.FC<StageProps> = ({ onAccept }) => {
  const [showQuestion, setShowQuestion] = useState(false);
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; delay: number; scale: number; speedY: number }[]>([]);

  useEffect(() => {
    // 3 seconds delay for "Então..." -> "Você aceita namorar comigo?"
    const timer = setTimeout(() => {
      setShowQuestion(true);
    }, 3500);

    // Make floating red rose petals for romantic theme
    const list = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: -10 - Math.random() * 30,
      delay: Math.random() * 6,
      scale: Math.random() * 0.9 + 0.4,
      speedY: Math.random() * 1.5 + 0.8
    }));
    setParticles(list);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full min-h-screen bg-[#050308] overflow-hidden flex items-center justify-center py-12 px-6" id="stage-pedido-10">
      
      {/* Cinematic dark star/fireworks ambient wrapper background */}
      <div className="absolute inset-0 bg-[#030105] opacity-90 pointing-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e11d48_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />

      {/* Floating Petals background stream */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: -40, rotate: 0 }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              y: ['0vh', '110vh'],
              x: ['0vw', `${Math.sin(p.id) * 10}vw`],
              rotate: [0, 360]
            }}
            transition={{
              duration: 9 + p.speedY * 3,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear'
            }}
            style={{
              left: `${p.left}%`,
              scale: p.scale
            }}
            className="absolute text-xl"
          >
            {p.id % 2 === 0 ? '🌹' : '🌸'}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!showQuestion ? (
          /* Mystical cinematic suspense screen */
          <motion.div
            key="suspense"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 1.5 }}
            className="text-center space-y-4 z-20"
          >
            <motion.h2
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.97, 1.03, 0.97] }}
              transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity }}
              className="text-4xl sm:text-6xl font-sans font-black tracking-widest text-slate-100 italic"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              Agora restou um último passo...
            </motion.h2>
            <p className="text-[#ff7b89] font-mono text-xs uppercase tracking-widest animate-pulse">
              ❤️ Chegamos na grande decisão
            </p>
          </motion.div>
        ) : (
          /* Final Royal Romance cinematic card */
          <motion.div
            key="final-proposal"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="max-w-xl w-full text-center z-20 space-y-8 p-6 sm:p-10 border-[4px] border-[#FFE599] bg-black/85 rounded-[36px] shadow-[0_0_60px_rgba(251,191,36,0.15)] relative"
          >
            {/* Visual top border sparkles decoration */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#312e81] border-2 border-[#FFE599] px-4 py-1 rounded-full text-[#FFE599] text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={11} className="animate-spin" style={{ animationDuration: '10s' }} /> ROYAL ROMANCE
            </div>

            {/* Pulsating glowing center heart */}
            <div className="relative inline-block mt-4">
              <div className="absolute inset-0 bg-red-600 rounded-full blur-2xl opacity-60 animate-ping" />
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="w-20 h-20 bg-rose-500 border-[3px] border-black rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000]"
              >
                <Heart size={36} className="text-white fill-white" />
              </motion.div>
            </div>

            {/* Core Message Text */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-[#FFE599] tracking-tight leading-tight uppercase font-sans">
                Quer namorar comigo?
              </h1>
              
              <p className="text-sm sm:text-lg font-serif italic text-white/90 leading-relaxed max-w-md mx-auto">
                &ldquo;Depois de tudo o que vivemos, de todas as risadas sinceras, fotos guardadas e sonhos planejados nas estrelas... Quer oficializar de vez o nosso amor?&rdquo; ❤️
              </p>
            </div>

            {/* 3 positive choices proposed in the stage specifications */}
            <div className="space-y-3.5 max-w-sm mx-auto pt-4 relative">
              
              {/* Option 1: Sim */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onAccept}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl border-[3px] border-white/20 shadow-[0_4px_15px_rgba(244,63,94,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>💖 SIM</span>
              </motion.button>

              {/* Option 2: Claro que sim */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onAccept}
                className="w-full py-3.5 bg-white text-rose-600 font-black uppercase text-xs tracking-widest rounded-2xl border-[3px] border-rose-100 shadow-[0_4px_12px_rgba(255,255,255,0.05)] hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🤍 CLARO QUE SIM</span>
              </motion.button>

              {/* Option 3: Com toda certeza */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onAccept}
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl border-[3px] border-white/20 shadow-[0_4px_15px_rgba(236,72,153,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>💞 COM TODA CERTEZA</span>
              </motion.button>

            </div>

            <div className="pt-2 text-[9px] font-mono text-stone-500 uppercase tracking-widest">
              Nossos corações batem na mesma frequência
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
