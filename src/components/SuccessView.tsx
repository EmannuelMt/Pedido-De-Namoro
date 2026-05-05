import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { Heart, Sparkles, ArrowRight, Stars, Infinity as InfinityIcon } from 'lucide-react';
import { StarBackground } from './SharedComponents';

const BEAR_MESSAGES = [
  "Te amo infinitamente! ❤️",
  "Você é meu universo! ✨",
  "Para todo o sempre! ♾️",
  "Meu coração é seu! 🐻",
  "Juntos em cada estrela! 🌟",
  "Melhor escolha da minha vida! 💍",
  "Nosso amor é galáctico! 🌌"
];

const InteractiveBear = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.div
      animate={isActive ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : {}}
      className="relative w-48 h-48 md:w-64 md:h-64"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        {/* Bear Body */}
        <circle cx="100" cy="120" r="60" fill="#8B4513" />
        {/* Ears */}
        <circle cx="50" cy="70" r="25" fill="#8B4513" />
        <circle cx="150" cy="70" r="25" fill="#8B4513" />
        <circle cx="50" cy="70" r="15" fill="#A0522D" />
        <circle cx="150" cy="70" r="15" fill="#A0522D" />
        {/* Face */}
        <circle cx="100" cy="120" r="20" fill="#DEB887" />
        {/* Eyes */}
        <circle cx="80" cy="105" r="5" fill="#1a0f0a" />
        <circle cx="120" cy="105" r="5" fill="#1a0f0a" />
        {/* Nose */}
        <path d="M95 115 Q100 125 105 115" stroke="#1a0f0a" fill="none" strokeWidth="2" />
        
        {/* Arms and Heart Gesture */}
        <motion.g
          animate={isActive ? {
            x: [0, 10, 0],
            y: [0, -10, 0],
            rotate: [0, 45, 0]
          } : {}}
          style={{ originX: '40px', originY: '130px' }}
        >
          {/* Left Arm */}
          <rect x="30" y="120" width="30" height="50" rx="15" fill="#8B4513" />
        </motion.g>

        <motion.g
          animate={isActive ? {
            x: [0, -10, 0],
            y: [0, -10, 0],
            rotate: [0, -45, 0]
          } : {}}
          style={{ originX: '160px', originY: '130px' }}
        >
          {/* Right Arm */}
          <rect x="140" y="120" width="30" height="50" rx="15" fill="#8B4513" />
        </motion.g>

        {/* Central Heart that appears on active */}
        <AnimatePresence>
          {isActive && (
            <motion.path
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              d="M100 120 C 100 110, 115 110, 115 125 C 115 140, 100 150, 100 155 C 100 150, 85 140, 85 125 C 85 110, 100 110, 100 120"
              fill="var(--primary)"
            />
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
};

export const SuccessView = ({ setView }: { setView: (v: any) => void }) => {
  const [showPortal, setShowPortal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPortal(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      key="sucesso"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Deep Space Background */}
      <div className="absolute inset-0">
        <StarBackground />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-glow-rgb),0.2)_0%,transparent_70%)]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464802686167-b939a07883bc?w=1600')] bg-cover opacity-20 mix-blend-screen grayscale"
        />
      </div>
      
      <div className="relative z-10 w-full max-w-7xl px-8 flex flex-col items-center text-center">
        
        {/* The Transcendent Heart */}
        <div className="relative mb-32">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Heart size={200} className="text-white fill-white opacity-10 blur-3xl absolute inset-0" />
            <Heart size={200} className="text-[var(--primary)] fill-[var(--primary)] drop-shadow-[0_0_80px_var(--primary-glow)]" />
            
            {/* Particle Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-100px] border border-dashed border-white/5 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-160px] border border-dashed border-white/5 rounded-full"
            />
          </motion.div>

          {/* Floating Sacred Words */}
          <AnimatePresence>
            {showPortal && BEAR_MESSAGES.slice(0, 4).map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 0.4, y: -200 - (idx * 60), scale: 1 }}
                transition={{ 
                  duration: 4, 
                  delay: idx * 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-white font-serif italic text-3xl"
              >
                {msg}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Narrative Revelation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          className="space-y-12"
        >
          <div className="flex items-center gap-8 justify-center mb-12">
             <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
             <InfinityIcon size={32} className="text-white/20 animate-pulse" />
             <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <h1 className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-editorial italic text-white tracking-tighter leading-[0.9] drop-shadow-2xl text-glow-premium">
            Consummatum <br />
            <span className="text-[var(--primary)] drop-shadow-[0_0_80px_var(--primary-glow)]">Est.</span>
          </h1>

          <div className="flex flex-col items-center gap-10 mt-16">
            <p className="text-white/40 font-editorial italic text-3xl sm:text-5xl max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              "De todas as realidades possíveis, <br />
              <span className="text-white">escolhemos a eternidade.</span>"
            </p>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 3, duration: 2 }}
              className="w-64 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent"
            />
          </div>
        </motion.div>

        {/* The Portal Call */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 4 }}
           className="mt-32"
        >
           <button
             onClick={() => setView('home')}
             className="relative group px-12 py-5 overflow-hidden rounded-full transition-all border border-[var(--primary)]/30 hover:border-[var(--primary)] shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] bg-white/5 backdrop-blur-md"
           >
             <div className="absolute inset-0 bg-[var(--primary)] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
             <div className="relative flex items-center justify-center gap-6 text-white transition-colors duration-500 font-sans font-medium text-[10px] sm:text-xs uppercase tracking-[0.6em]">
               Voltar para o Início <ArrowRight size={16} className="group-hover:translate-x-4 transition-transform duration-500" />
             </div>
           </button>
        </motion.div>
      </div>

      {/* Extreme Aesthetic Overlays */}
      <div className="absolute bottom-12 right-12 p-8 opacity-10">
         <div className="text-[9px] font-mono text-white tracking-[1em] uppercase">Eternity Loop Initiated</div>
      </div>
    </motion.div>
  );
};
