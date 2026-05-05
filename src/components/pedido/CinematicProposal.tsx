import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Clapperboard, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CinematicProposal = ({ onAccept }: any) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (phase === 0) {
      const t = setTimeout(() => setPhase(1), 3000);
      return () => clearTimeout(t);
    } else if (phase === 1) {
      const t = setTimeout(() => setPhase(2), 4000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleAccept = () => {
    setPhase(3);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#fff', '#ec4899', '#facc15']
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black p-8 font-serif text-white relative overflow-hidden">
       {/* Cinematic Bars */}
       <div className="fixed top-0 inset-x-0 h-[10vh] bg-black z-50 pointer-events-none" />
       <div className="fixed bottom-0 inset-x-0 h-[10vh] bg-black z-50 pointer-events-none" />

       {/* Grain effect */}
       <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen bg-[url('https://images.unsplash.com/photo-1621687947404-e41b91116057?w=1200&q=80')] bg-cover grayscale" />

       <div className="z-10 text-center max-w-4xl relative">
          <AnimatePresence mode="wait">
             {phase === 0 && (
                <motion.div
                  key="phase0"
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 2 }}
                >
                   <Clapperboard size={48} className="mx-auto mb-8 opacity-50" />
                   <p className="text-xl md:text-3xl tracking-[0.2em] uppercase font-light text-white/50">Cena Final</p>
                </motion.div>
             )}

             {phase === 1 && (
                <motion.div
                  key="phase1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 3 }}
                  className="space-y-6"
                >
                   <p className="text-3xl md:text-5xl italic font-light leading-relaxed">
                     "De todas as histórias que eu poderia viver..."
                   </p>
                </motion.div>
             )}

             {phase === 2 && (
                <motion.div
                  key="phase2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 3, ease: "easeOut" }}
                  className="space-y-16"
                >
                   <p className="text-4xl md:text-7xl italic font-light leading-tight">
                     "...é a nossa que eu quero continuar escrevendo."
                   </p>
                   
                   <div className="space-y-8">
                     <p className="text-xl uppercase tracking-[0.4em] font-mono mt-12 text-white/80">
                        Aceita namorar comigo?
                     </p>
                     <div className="flex items-center justify-center gap-12">
                        <button 
                          onClick={handleAccept}
                          className="px-12 py-4 bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-[0.2em] font-bold text-sm"
                        >
                          Sim
                        </button>
                     </div>
                   </div>
                </motion.div>
             )}

             {phase === 3 && (
                <motion.div
                   key="phase3"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 2 }}
                   className="space-y-12"
                >
                   <p className="text-white/50 uppercase tracking-[0.5em] font-mono text-sm">Fim da Introdução</p>
                   <h2 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter">O Fim<br/><span className="text-3xl font-light tracking-[0.2em]">(e o começo)</span></h2>
                   <button
                     onClick={onAccept}
                     className="mt-16 px-8 py-3 border border-white/30 hover:bg-white/10 transition-colors uppercase tracking-[0.3em] font-mono text-xs flex items-center justify-center gap-4 mx-auto"
                   >
                     Rolar Créditos <ArrowRight size={14} />
                   </button>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </div>
  );
};
