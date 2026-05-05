import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowRight, Sparkles, Star, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const QUESTIONS = [
  { id: 'comida', label: 'Comida Favorita', placeholder: 'Sushi, Pizza, Hambúrguer...', type: 'text' },
  { id: 'jogos', label: 'Jogos Favoritos', placeholder: 'The Sims, Valorant, UNO...', type: 'text' },
  { id: 'lugares', label: 'Lugares que mais gosta', placeholder: 'Praia, Montanha, Shopping...', type: 'text' },
  { id: 'hobby', label: 'Um Hobby', placeholder: 'Desenhar, Ler, Dançar...', type: 'text' },
  { id: 'gostos', label: 'Gostos Pessoais', placeholder: 'Café, Chuva, Documentários...', type: 'text' },
  { id: 'momentos', label: 'Momentos Felizes (comigo ou no geral)', placeholder: 'Aquele dia no parque...', type: 'textarea' },
  { id: 'viagem', label: 'Viagem dos Sonhos', placeholder: 'Paris, Japão, Disney...', type: 'text' },
  { id: 'sonhos', label: 'Sonhos de Vida', placeholder: 'Ter 3 cachorros, Voar de balão...', type: 'textarea' },
  { id: 'filmes', label: 'Filmes Favoritos', placeholder: 'Interstellar, Barbie...', type: 'text' },
  { id: 'series', label: 'Séries Favoritas', placeholder: 'Stranger Things, Friends...', type: 'text' },
  { id: 'animes', label: 'Animes Favoritos', placeholder: 'Naruto, Demon Slayer...', type: 'text' },
];

const Formulario = ({ onFinish, onCancel }: { onFinish: (answers: Record<string, string>) => void, onCancel: () => void }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('pedidoAnswers', JSON.stringify(answers));
      onFinish(answers);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const q = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <motion.div
      key="formulario"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 1 } }}
      className="w-full max-w-6xl mx-auto px-6 z-10 relative py-10"
    >
      <div className="flex justify-start mb-6">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-mono text-[9px] uppercase tracking-[0.3em] transition-all flex items-center gap-2 group"
        >
          <ArrowRight size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Voltar para Home
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-[3rem] overflow-hidden mb-12 shadow-2xl border border-white/10 group shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <img 
            src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=2000" // Romance background
            className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-[3000ms]"
            alt="Nosso Banner"
        />
        <div className="absolute inset-0 p-10 md:p-16 flex flex-col justify-center z-20">
            <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex p-4 rounded-2xl bg-[var(--primary)]/20 border border-[var(--primary)]/30 mb-6 w-max backdrop-blur-sm"
            >
            <Sparkles size={24} className="text-[var(--primary)]" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white tracking-tighter italic mb-4 max-w-2xl leading-tight">
            Preparando o nosso <span className="text-[var(--primary)] drop-shadow-[0_0_20px_var(--primary-glow)]">Universo</span>
            </h1>
            <p className="text-white/60 font-mono text-[9px] md:text-xs uppercase tracking-[0.4em] max-w-xl">
            Uma chance de eternizar o que nos define
            </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Kitchen Moment Card */}
        <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 h-max">
           <div className="glass-card bg-white/[0.02] p-4 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative group">
              <div className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-80" />
                 <img 
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000"
                    alt="Momento na cozinha"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4000ms]"
                 />
                 <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                    <Heart size={20} className="text-[var(--primary)] mb-4 animate-pulse opacity-80" />
                    <h3 className="text-2xl font-serif text-white italic tracking-tight mb-2">A Receita Perfeita</h3>
                    <p className="text-white/60 font-mono uppercase tracking-widest text-[9px] leading-relaxed">
                       Entre risadas constantes, receitas que dão errado e aquele abraço que sempre dá certo.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Form (Quiz Style) */}
        <div className="flex-1 glass-card bg-white/[0.02] p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none grayscale invert rotate-12">
             <Star size={160} />
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-white/10 rounded-full mb-10 overflow-hidden relative z-10">
            <motion.div 
               className="h-full bg-gradient-to-r from-[var(--primary)] to-white"
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
             <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
               Questão {currentStep + 1} de {QUESTIONS.length}
             </span>
             {currentStep > 0 && (
                <button 
                  type="button" 
                  onClick={handlePrev}
                  className="text-white/40 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors"
                >
                  Voltar
                </button>
             )}
          </div>

          <AnimatePresence mode="wait">
             <motion.form 
                key={q.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleNext} 
                className="flex flex-col flex-1 relative z-10"
             >
                <div className="flex-1 space-y-6">
                   <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-8">
                      {q.label}
                   </h2>

                   {q.type === 'textarea' ? (
                     <textarea
                       required
                       autoFocus
                       value={answers[q.id] || ''}
                       onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                       placeholder={q.placeholder}
                       className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-white text-lg font-serif italic shadow-inner outline-none focus:border-[var(--primary)] focus:bg-white/10 transition-all min-h-[150px] resize-none"
                     />
                   ) : (
                     <input
                       required
                       autoFocus
                       value={answers[q.id] || ''}
                       onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                       placeholder={q.placeholder}
                       className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-white text-lg font-serif italic shadow-inner outline-none focus:border-[var(--primary)] focus:bg-white/10 transition-all"
                     />
                   )}
                </div>

                <div className="pt-12 flex justify-end">
                  <button 
                     type="submit"
                     className="px-12 py-5 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white rounded-full font-mono text-[10px] uppercase tracking-[0.4em] font-bold shadow-[0_0_30px_var(--primary-glow)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-4 group"
                  >
                     {currentStep < QUESTIONS.length - 1 ? (
                        <>Próximo <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" /></>
                     ) : (
                        <>Finalizar 💖 <Sparkles size={16} className="group-hover:rotate-12 transition-transform" /></>
                     )}
                  </button>
                </div>
             </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

const FlowerBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
           key={`flower-${i}`}
           initial={{ 
             y: -100, 
             x: Math.random() * window.innerWidth,
             opacity: 0,
             rotate: 0,
             scale: Math.random() * 0.5 + 0.2
           }}
           animate={{ 
             y: window.innerHeight + 100,
             x: `calc(${Math.random() * window.innerWidth}px + ${(Math.random() - 0.5) * 200}px)`,
             opacity: [0, 0.6, 0.6, 0],
             rotate: Math.random() * 360
           }}
           transition={{ 
             duration: 10 + Math.random() * 15, 
             repeat: Infinity,
             delay: Math.random() * 20,
             ease: "linear"
           }}
           className="absolute top-0 left-0 text-[var(--primary)]/30 blur-[1px]"
        >
           <Sparkles size={30} />
        </motion.div>
      ))}
    </div>
  )
}

const HeartDrawing = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-16">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(244,63,94,0.3)]">
         <motion.path
            d="M50 88 C 50 88, 15 55, 15 35 C 15 15, 40 10, 50 30 C 60 10, 85 15, 85 35 C 85 55, 50 88, 50 88 Z"
            fill="transparent"
            stroke="url(#heartGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            onAnimationComplete={onComplete}
         />
         <defs>
           <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
             <stop offset="0%" stopColor="var(--primary)" />
             <stop offset="100%" stopColor="var(--primary)" />
           </linearGradient>
         </defs>
      </svg>
    </motion.div>
  )
}

const PedidoFinal = ({ onAccept }: { onAccept: () => void }) => {
  const [showText, setShowText] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const moveNoButton = () => {
    if (accepted) return;
    const padding = 50;
    const maxX = 300;
    const maxY = 200;
    setNoPos({
      x: (Math.random() - 0.5) * maxX,
      y: (Math.random() - 0.5) * maxY
    });
  }

  const handleYes = () => {
    setAccepted(true);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#c084fc', '#ffffff']
    });
  }

  return (
    <motion.div
      key="pedidoFinal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto px-6 z-10 text-center relative"
      ref={containerRef}
    >
      <FlowerBackground />
      
      {!accepted ? (
        <>
          <HeartDrawing onComplete={() => setShowText(true)} />
          
          <div className="min-h-[200px]">
             {showText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2 }}
                  onAnimationComplete={() => setTimeout(() => setShowButtons(true), 1500)}
                  className="space-y-6"
                >
                  <p className="text-2xl md:text-4xl font-serif italic text-white/80 leading-relaxed">
                     Depois de conhecer um pouco mais do seu mundo...
                  </p>
                  <motion.p 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 2, duration: 2 }}
                     className="text-3xl md:text-5xl font-serif italic text-white leading-relaxed"
                  >
                     Eu percebi que quero fazer parte dele.
                  </motion.p>
                  <motion.p 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 4, duration: 1.5, type: "spring" }}
                     className="text-5xl md:text-7xl font-editorial italic text-[var(--primary)] tracking-tighter mt-8 drop-shadow-[0_0_20px_var(--primary-glow)]"
                  >
                     Você aceita namorar comigo?
                  </motion.p>
                </motion.div>
             )}
          </div>

          <AnimatePresence>
            {showButtons && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 flex items-center justify-center gap-12 relative h-32"
              >
                 <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleYes}
                    className="px-16 py-6 bg-gradient-to-r from-[var(--primary)] text-white rounded-full font-bold text-sm uppercase tracking-[0.3em] shadow-[0_0_40px_var(--primary-glow)] z-20"
                 >
                    SIM 💖
                 </motion.button>

                 <motion.button
                    animate={{ x: noPos.x, y: noPos.y }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onMouseEnter={moveNoButton}
                    onClick={moveNoButton}
                    className="px-12 py-5 bg-white/5 border border-white/10 text-white/50 hover:text-white rounded-full font-mono text-sm uppercase tracking-widest z-10 absolute pointer-events-auto"
                    style={{ right: 'calc(50% - 150px - 80px)' }} // Roughly position to the right initially
                 >
                    NÃO 😢
                 </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="flex flex-col items-center justify-center min-h-[60vh] space-y-12"
        >
           <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
           >
              <div className="absolute inset-0 bg-[var(--primary)]/20 blur-[50px] rounded-full" />
              <Heart size={120} className="text-[var(--primary)] fill-[var(--primary)]" />
           </motion.div>
           <h2 className="text-4xl md:text-6xl font-editorial italic text-white tracking-tighter">
              Agora oficialmente...
           </h2>
           <p className="text-2xl md:text-4xl font-serif italic text-[var(--primary)]">
              Você é minha pessoa favorita no mundo.
           </p>

           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="mt-12"
           >
              <button
                 onClick={onAccept}
                 className="px-12 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-mono text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 group mx-auto"
              >
                 Voltar para Home <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </button>
           </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export const EmotionalProposal = ({ onAccept, themeMode }: any) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <AnimatePresence mode="wait">
       {step === 1 && (
          <Formulario 
             onCancel={onAccept}
             onFinish={(ans) => {
                setAnswers(ans);
                setStep(2);
             }} 
          />
       )}
       {step === 2 && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen py-20">
             <PedidoFinal onAccept={onAccept} />
          </div>
       )}
    </AnimatePresence>
  );
};
