import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Star, Sparkles, Heart, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { PageLayout } from '../App';
import { audioManager } from '../lib/audioManager';

interface Question {
  q: string;
  options: string[];
  correct: number;
}

export const QuizView = ({ 
  questions, 
  onNavigate 
}: { 
  questions: Question[], 
  onNavigate: (v: any) => void 
}) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleAnswer = (ansIdx: number) => {
    setSelected(ansIdx);
    const isCorrect = ansIdx === questions[index].correct;
    
    if (isCorrect) {
      setScore(s => s + 1);
      audioManager.playSound('success');
    } else {
      audioManager.playSound('error');
    }
    
    setTimeout(() => {
      if (index < questions.length - 1) {
        setIndex(i => i + 1);
        setSelected(null);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        if (finalScore >= questions.length / 2) {
          audioManager.playSound('win');
        } else {
          audioManager.playSound('lose');
        }
        setShowResult(true);
      }
    }, 1000);
  };

  const reset = () => {
    setIndex(0);
    setScore(0);
    setShowResult(false);
    setSelected(null);
  };

  return (
    <PageLayout 
      title="Prova de" 
      subtitle="Sintonização" 
      description="O quanto nossas almas estão em ressonância? Teste seus conhecimentos sobre nós."
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-20 min-h-[600px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {/* Progress Detail */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                 <div>
                    <span className="text-[var(--primary)] font-sans font-semibold text-[10px] uppercase tracking-[0.5em] mb-4 block drop-shadow-md">Frequência Alpha</span>
                    <h3 className="text-white font-editorial italic text-5xl md:text-6xl drop-shadow-lg">Questão {index + 1} de {questions.length}</h3>
                 </div>
                 <div className="flex gap-3 pb-2">
                    {questions.map((_, i) => (
                      <div key={i} className={`w-12 h-1 rounded-full transition-all duration-700 ${i <= index ? 'bg-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)] scale-y-110' : 'bg-white/10'}`} />
                    ))}
                 </div>
              </div>

              {/* Question Card */}
              <div className="luxury-card p-12 md:p-20 border border-[var(--primary)]/20 relative overflow-hidden shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-white">
                    <Star size={180} />
                 </div>
                 
                 <h2 className="text-3xl md:text-5xl lg:text-6xl font-editorial text-white tracking-tight italic leading-[1.2] mb-16 relative z-10 drop-shadow-md">
                   "{questions[index].q}"
                 </h2>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {questions[index].options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => selected === null && handleAnswer(i)}
                        className={`p-8 rounded-3xl font-sans font-light text-xl text-left transition-all duration-500 border relative overflow-hidden group
                          ${selected === null 
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-white/70 hover:text-white shadow-md' 
                            : i === questions[index].correct 
                              ? 'bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)] shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]' 
                              : selected === i 
                                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                                : 'bg-white/5 border-white/5 opacity-30 text-white/30'
                          }
                        `}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                        <div className="flex items-center justify-between relative z-10">
                           <span className="leading-snug">{option}</span>
                           {selected !== null && i === questions[index].correct && <Sparkles size={20} className="animate-pulse drop-shadow-md" />}
                        </div>
                      </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-16"
            >
              <div className="relative inline-block mb-12">
                 <div className="absolute inset-0 bg-[var(--primary)] blur-[100px] opacity-30 animate-pulse" />
                 <div className="relative w-48 h-48 rounded-full border border-[var(--primary)]/30 bg-black/40 backdrop-blur-md flex items-center justify-center text-[var(--primary)] shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)] mx-auto">
                    <Trophy size={80} className="drop-shadow-lg" />
                 </div>
              </div>

              <h2 className="text-7xl md:text-9xl font-editorial italic text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
                Sincronia de <br />
                <span className="text-[var(--primary)] text-glow-premium drop-shadow-[0_0_40px_var(--primary-glow)]">{Math.round((score / questions.length) * 100)}%</span>
              </h2>

              <p className="text-white/60 font-sans font-light text-2xl md:text-3xl tracking-tight max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                {score === questions.length 
                  ? "Nossas almas vibram na exata mesma frequência. Somos uma unidade perfeita." 
                  : score > questions.length / 2 
                    ? "Uma conexão profunda, com apenas alguns fragmentos de mistério ainda por explorar."
                    : "A jornada da descoberta é infinita, e estou ansioso para aprender cada detalhe de você."
                }
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12">
                 <button 
                   onClick={reset}
                   className="px-12 py-6 luxury-glass border border-white/10 rounded-full text-white font-mono text-[10px] uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all flex items-center gap-4"
                 >
                   Mergulhar Novamente <RotateCcw size={14} />
                 </button>
                 <button 
                   onClick={() => onNavigate('home')}
                   className="px-12 py-6 bg-[var(--primary)] text-white rounded-full font-mono text-[10px] uppercase tracking-[0.5em] font-bold shadow-extreme hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                 >
                   Voltar ao Centro <ArrowRight size={14} />
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};
