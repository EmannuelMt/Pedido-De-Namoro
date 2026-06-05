import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MoveRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomProposalView = ({ data, onAccept }: any) => {
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const steps = data?.steps || [
    { title: "Nossa História", text: "Um capítulo que começou de forma especial.", image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800" },
    { title: "Com Você", text: "Tudo fica mais bonito quando estamos juntos.", image: "https://images.unsplash.com/photo-1522673607200-1c4b9cdb480f?auto=format&fit=crop&q=80&w=800" }
  ];

  const handleNext = () => {
    if (step < steps.length) setStep(step + 1);
  };

  const handleAccept = () => {
    setAccepted(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#f43f5e', '#ec4899', '#db2777'] });
    setTimeout(() => onAccept(), 4000);
  };

  const handleDecline = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const x = Math.random() * (window.innerWidth - btn.offsetWidth);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight);
    btn.style.position = 'fixed';
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-80px)]">
      <AnimatePresence mode="wait">
        {step < steps.length ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            <div className="glass-card overflow-hidden shadow-2xl relative border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-fuchsia-500/10 z-0" />
              
              <div className="relative z-10 p-6 sm:p-10 flex flex-col items-center text-center gap-8">
                <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden relative shadow-lg">
                  <div className="absolute inset-0 bg-black/20 z-10" />
                  <img src={steps[step].image} alt={steps[step].title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-medium tracking-wide text-sm"
                  >
                    Fase {step + 1} de {steps.length}
                  </motion.div>
                  <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-fuchsia-400">
                    {steps[step].title}
                  </h2>
                  <p className="text-lg text-white/80 leading-relaxed max-w-lg mx-auto">
                    {steps[step].text}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="mt-4 px-8 py-4 bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-rose-500/20 flex items-center gap-3 transition-colors hover:from-rose-400 hover:to-fuchsia-400"
                >
                  Continuar <MoveRight size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="proposal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl text-center"
          >
            {!accepted ? (
              <div className="glass-card p-8 sm:p-12 relative overflow-hidden border border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-transparent to-fuchsia-500/20 animate-pulse" />
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="relative z-10 flex flex-col items-center">
                  <Heart className="w-20 h-20 text-rose-500 fill-rose-500 mb-6 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    {data?.question || 'Quer namorar comigo?'}
                  </h1>
                  
                  <p className="text-xl text-white/80 mb-12 max-w-md mx-auto">
                    {data?.proposal_text || 'Uma jornada inesquecível está apenas começando.'}
                  </p>

                  <div className="flex items-center justify-center gap-6 w-full">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAccept}
                      className="px-10 py-4 bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white rounded-full font-bold text-xl shadow-[0_0_30px_rgba(244,63,94,0.4)] flex items-center gap-2"
                    >
                      <Sparkles size={24} /> {data?.btnYes || 'Sim!'}
                    </motion.button>

                    <button onMouseEnter={handleDecline} className="px-8 py-4 bg-white/5 border border-white/10 text-white/50 rounded-full font-bold text-lg hover:bg-white/10 transition-all z-50 whitespace-nowrap cursor-not-allowed">
                      {data?.btnNo || 'Não'}
                    </button>
                  </div>
                </motion.div>
              </div>
            ) : (
               <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20">
                 <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                   <Heart className="w-32 h-32 text-rose-500 fill-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.8)]" />
                 </motion.div>
                 <h2 className="mt-8 text-4xl font-bold text-white text-center">Tudo pronto!</h2>
               </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
