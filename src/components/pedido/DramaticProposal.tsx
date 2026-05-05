import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, HeartPulse, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DramaticProposal = ({ onAccept }: any) => {
  const [phase, setPhase] = useState(0);

  const handleNext = () => {
     if (phase < 3) setPhase(p => p + 1);
     if (phase === 2) {
        confetti({
          particleCount: 300,
          spread: 160,
          origin: { y: 0.5 },
          colors: ['#ff0000', '#000000', '#ffffff'],
          startVelocity: 60,
        });
     }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-red-950 p-8 font-serif text-white relative overflow-hidden">
       {/* Intensely Dramatic Background */}
       <motion.div 
         animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
         className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.3)_0%,transparent_70%)] pointer-events-none" 
       />
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=1200&q=80')] bg-cover opacity-10 mix-blend-multiply pointer-events-none" />

       <div className="z-10 text-center max-w-3xl w-full">
          <AnimatePresence mode="wait">
             {phase === 0 && (
                <motion.div
                  key="phase0"
                  initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="space-y-12"
                >
                   <Flame size={80} className="mx-auto text-orange-500 animate-pulse" />
                   <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]">
                      A HORA CHEGOU!
                   </h2>
                   <p className="text-2xl italic font-light">Eu não posso mais esconder esse sentimento avassalador.</p>
                   <button 
                     onClick={handleNext}
                     className="px-12 py-6 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(220,38,38,0.6)]"
                   >
                     REVELAR A VERDADE
                   </button>
                </motion.div>
             )}

             {phase === 1 && (
                <motion.div
                  key="phase1"
                  initial={{ opacity: 0, x: -100, skewX: 20 }}
                  animate={{ opacity: 1, x: 0, skewX: 0 }}
                  exit={{ opacity: 0, x: 100, skewX: -20 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="space-y-12"
                >
                   <Zap size={80} className="mx-auto text-yellow-500" />
                   <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white drop-shadow-[0_10px_0_rgba(220,38,38,1)]">
                      É VOCÊ!
                   </h2>
                   <p className="text-3xl italic">Sempre foi você.</p>
                   <p className="text-xl max-w-lg mx-auto font-sans font-bold uppercase tracking-widest text-red-300">
                      O destino não nos deu escolha. Nossas almas estão entrelaçadas pela eternidade!
                   </p>
                   <button 
                     onClick={handleNext}
                     className="px-12 py-6 bg-yellow-500 text-red-950 font-black uppercase tracking-[0.3em] hover:scale-110 transition-transform"
                   >
                     VER O ÚLTIMO ATO
                   </button>
                </motion.div>
             )}

             {phase === 2 && (
                <motion.div
                  key="phase2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 10 }}
                  className="space-y-12"
                >
                   <HeartPulse size={120} className="mx-auto text-red-500 animate-bounce drop-shadow-[0_0_50px_rgba(255,0,0,1)]" />
                   <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white">
                      ACEITA NAMORAR COMIGO?!
                   </h2>
                   <div className="flex flex-col sm:flex-row gap-8 justify-center mt-16">
                      <button 
                        onClick={handleNext}
                        className="w-full sm:w-auto px-16 py-8 bg-red-600 hover:bg-red-500 text-white font-black text-2xl uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(255,0,0,0.8)] border border-white"
                      >
                        SIM, MIL VEZES SIM!
                      </button>
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
                   <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-red-500 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]">
                      VÍTÓRIA DO AMOR!
                   </h2>
                   <button 
                     onClick={onAccept}
                     className="px-8 py-4 bg-transparent border-2 border-red-500 text-red-500 font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
                   >
                     Fugir para o horizonte (Menu)
                   </button>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </div>
  );
};
