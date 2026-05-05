import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, HeartHandshake, ArrowRight, Star } from 'lucide-react';

interface TruthOrDareProps {
  onFinish?: (stats: any) => void;
}

const TRUTHS = [
  "Qual foi a sua primeira impressão de mim?",
  "O que você mais admira em nós?",
  "Qual a nossa memória que você guarda com mais carinho?",
  "Se pudéssemos viajar para qualquer lugar agora, para onde iríamos?",
  "O que eu faço que te deixa com mais vergonha (no bom sentido)?",
  "Qual sua música favorita que te lembra a gente?"
];

const DARES = [
  "Faça uma massagem nos meus ombros por 2 minutos.",
  "Fale com uma voz engraçada até a próxima rodada.",
  "Me elogie em 3 idiomas diferentes (ou invente!).",
  "Tente não sorrir enquanto eu tento te fazer rir por 30 segundos.",
  "Mande um áudio declarando seu amor e poste no status (ou finja).",
  "Dance sem música por 1 minuto enquanto eu gravo."
];

export const TruthOrDareGame: React.FC<TruthOrDareProps> = ({ onFinish }) => {
  const [currentCard, setCurrentCard] = useState<{ type: 'truth' | 'dare', text: string } | null>(null);
  const [turn, setTurn] = useState<number>(1);
  const [score, setScore] = useState<{ truths: number, dares: number }>({ truths: 0, dares: 0 });

  const getCard = (type: 'truth' | 'dare') => {
    const list = type === 'truth' ? TRUTHS : DARES;
    const random = list[Math.floor(Math.random() * list.length)];
    setCurrentCard({ type, text: random });
    
    // Update stats
    setScore(prev => ({
      ...prev,
      [type === 'truth' ? 'truths' : 'dares']: prev[type === 'truth' ? 'truths' : 'dares'] + 1
    }));
  };

  const nextTurn = () => {
    setCurrentCard(null);
    setTurn(turn + 1);
    
    // Auto-finish after 10 turns just to log stats
    if (turn > 10 && onFinish) {
       onFinish({ type: 'Truth or Dare', totalTurns: turn, ...score });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto luxury-card p-10 md:p-16 relative overflow-hidden flex flex-col justify-center items-center min-h-[600px]">
      
      <div className="text-center mb-16 relative z-10 w-full">
        <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tighter italic mb-4">
          Verdade ou <span className="text-glow text-[var(--primary)]">Desafio</span>
        </h2>
        <p className="text-white/40 font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-4">
          Rodada {turn} <Star size={12} className="text-[var(--primary)]" /> Revelações
        </p>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!currentCard ? (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <button
                onClick={() => getCard('truth')}
                className="group relative h-80 rounded-[3rem] p-10 bg-white/5 border border-white/10 flex flex-col justify-center items-center hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all duration-500 overflow-hidden text-center"
              >
                <div className="absolute inset-0 bg-[var(--primary)] opacity-0 group-hover:opacity-10 transition-opacity" />
                <HeartHandshake size={64} className="mb-6 text-white group-hover:scale-110 transition-transform duration-500 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,1)]" />
                <span className="text-3xl font-serif italic text-white mb-2">Verdade</span>
                <span className="text-white/40 font-mono text-xs uppercase tracking-widest group-hover:text-white/80">Conexão Profunda</span>
              </button>

              <button
                onClick={() => getCard('dare')}
                className="group relative h-80 rounded-[3rem] p-10 bg-white/5 border border-white/10 flex flex-col justify-center items-center hover:bg-rose-500 hover:border-rose-500 transition-all duration-500 overflow-hidden text-center"
              >
                <div className="absolute inset-0 bg-rose-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <ShieldAlert size={64} className="mb-6 text-white group-hover:scale-110 transition-transform duration-500 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,1)]" />
                <span className="text-3xl font-serif italic text-white mb-2">Desafio</span>
                <span className="text-white/40 font-mono text-xs uppercase tracking-widest group-hover:text-white/80">Saindo da Rotina</span>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="card"
              initial={{ opacity: 0, y: 50, rotateX: 90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -50, rotateX: -90 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className={`w-full p-16 rounded-[4rem] flex flex-col justify-center items-center text-center shadow-extreme border ${
                currentCard.type === 'truth' ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30' : 'bg-rose-500/10 border-rose-500/30'
              }`}
            >
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-10 ${
                  currentCard.type === 'truth' ? 'bg-[var(--primary)] text-white shadow-[0_0_30px_var(--primary-glow)]' : 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.5)]'
               }`}>
                  {currentCard.type === 'truth' ? <HeartHandshake size={32} /> : <ShieldAlert size={32} />}
               </div>
               
               <h3 className="text-3xl md:text-5xl font-serif italic text-white mb-16 leading-relaxed">
                 "{currentCard.text}"
               </h3>
               
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={nextTurn}
                 className="px-10 py-5 bg-white text-black rounded-full font-mono text-sm uppercase tracking-widest flex items-center gap-4 transition-all hover:bg-black hover:text-white shadow-2xl"
               >
                 Próximo Turno <ArrowRight size={16} />
               </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
