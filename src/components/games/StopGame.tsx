import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Square, RefreshCcw, Hand, Trophy, CheckCircle2 } from 'lucide-react';

interface StopGameProps {
  onFinish?: (stats: any) => void;
}

const CATEGORIES = [
  'Nome de Bebê',
  'Lugar para Viajar',
  'Comida',
  'Filme ou Série',
  'Um Elogio',
  'Objeto que tem em casa'
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const StopGame: React.FC<StopGameProps> = ({ onFinish }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'review'>('idle');
  const [letter, setLetter] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  
  // Confetti trigger
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleStop();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    // Pick random letter
    const randomLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    setLetter(randomLetter);
    setAnswers({});
    setTimeLeft(60); // 1 minute
    setGameState('playing');
    setScore(0);
    setShowConfetti(false);
  };

  const handleStop = () => {
    setGameState('review');
    
    // Simple scoring: 10 points for each filled category starting with the correct letter
    let newScore = 0;
    CATEGORIES.forEach(cat => {
      const ans = answers[cat] || '';
      if (ans.trim().toUpperCase().startsWith(letter)) {
        newScore += 10;
      }
    });
    setScore(newScore);
    setShowConfetti(true);

    if (onFinish) {
      onFinish({
        letter,
        score: newScore,
        answersCount: Object.keys(answers).length
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto luxury-card p-10 md:p-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12 scale-150 pointer-events-none">
        <Hand size={200} />
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tighter italic mb-4">
          Stop <span className="text-glow text-[var(--primary)]">do Casal</span>
        </h2>
        <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
          A clássica Adedonha com nosso toque.
        </p>
      </div>

      {gameState === 'idle' && (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-32 h-32 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-extreme group relative"
          >
            <div className="absolute inset-0 rounded-full border border-[var(--primary)] scale-150 opacity-0 group-hover:animate-ping" />
            <Play size={48} className="ml-2" />
          </motion.button>
          <p className="mt-8 text-white/50 font-serif italic text-xl">
            Clique para sortear a letra e começar
          </p>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="animate-fade-in relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-3xl p-8 mb-10">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] mb-2">Letra Sorteada</p>
              <div className="w-24 h-24 rounded-2xl bg-[var(--primary)]/20 border border-[var(--primary)] text-[var(--primary)] flex items-center justify-center text-6xl font-serif font-bold shadow-[0_0_30px_var(--primary-glow)]">
                {letter}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-6xl font-mono text-white tracking-tighter mb-4">
                {timeLeft}<span className="text-2xl text-white/40">s</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStop}
                className="px-10 py-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-mono text-sm uppercase tracking-widest flex items-center gap-4 transition-all shadow-[0_0_30px_rgba(244,63,94,0.3)]"
              >
                <Square size={16} className="fill-current" /> STOP!
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIES.map((cat) => (
              <div key={cat} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <label className="block text-white/60 font-serif italic text-lg mb-3">
                  {cat}
                </label>
                <input
                  type="text"
                  value={answers[cat] || ''}
                  onChange={(e) => setAnswers({ ...answers, [cat]: e.target.value })}
                  placeholder={`Palavra com ${letter}...`}
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-white font-mono text-xl focus:outline-none focus:border-[var(--primary)] transition-all placeholder:text-white/10"
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState === 'review' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          {showConfetti && (
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-full h-full bg-[var(--primary)]/10 blur-[100px] absolute" />
             </div>
          )}

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] mb-6">
              <Trophy size={40} />
            </div>
            <h3 className="text-5xl font-serif text-white italic mb-4">Tempo Esgotado!</h3>
            <p className="text-white/50 text-xl font-mono">Letra: <span className="text-[var(--primary)] font-bold text-3xl">{letter}</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {CATEGORIES.map((cat) => {
              const ans = answers[cat] || '';
              const isCorrect = ans.trim().toUpperCase().startsWith(letter);
              return (
                <div key={cat} className={`bg-white/5 border rounded-2xl p-6 flex justify-between items-center ${isCorrect ? 'border-[var(--primary)]/50' : 'border-rose-500/30'}`}>
                  <div>
                    <span className="block text-white/40 font-mono text-[10px] uppercase tracking-widest mb-2">{cat}</span>
                    <span className="text-white font-serif italic text-xl">
                      {ans || '-'}
                    </span>
                  </div>
                  {isCorrect ? (
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center">
                      <CheckCircle2 size={24} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold font-mono">
                      0
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-center border-t border-white/10 pt-10">
             <div className="text-8xl font-serif text-[var(--primary)] mb-8 drop-shadow-[0_0_30px_var(--primary-glow)]">
                {score} <span className="text-3xl text-white/30">pts</span>
             </div>
             
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={startGame}
               className="px-10 py-5 bg-white text-black rounded-full font-mono text-sm uppercase tracking-widest flex items-center gap-4 transition-all hover:bg-[var(--primary)] hover:text-white"
             >
               <RefreshCcw size={16} /> Jogar Novamente
             </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
