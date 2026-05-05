import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Heart, Trophy, RotateCcw } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    question: "Onde foi o nosso primeiro encontro oficial?",
    options: ["Parque Ipiranga", "Jundiaí Shopping", "Brasil Park Shopping", "Sua Casa"],
    correct: 2,
    hint: "Tinha muita gente, mas eu só via você."
  },
  {
    question: "Qual projeto meu você mais me ajudou a pensar o nome?",
    options: ["Ecos da Realidade", "Aura do Universo", "Sintonia Alpha", "Portal do Coração"],
    correct: 0,
    hint: "Algo que ressoa..."
  },
  {
    question: "Qual é o nosso 'lanche' favorito de madrugada?",
    options: ["Pizza", "Hambúrguer", "Açaí", "Lamen"],
    correct: 1,
    hint: "Aquele com muito queijo."
  },
  {
    question: "Qual música nos define nesse momento?",
    options: ["Amanhecer - BK'", "Amor de Queima - Matuê", "Sintonia - Teto", "Nossa História - Orochi"],
    correct: 0,
    hint: "Esperança e superação."
  }
];

export const CoupleQuiz = ({ onFinish }: { onFinish?: (stats: any) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    const correct = index === QUIZ_QUESTIONS[currentStep].correct;
    setIsCorrect(correct);
    
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        setCurrentStep(s => s + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
        if (onFinish) {
          onFinish({ game: 'CoupleQuiz', score: score + (correct ? 1 : 0), total: QUIZ_QUESTIONS.length });
        }
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="flex justify-between items-end">
               <div className="text-left">
                  <span className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-[0.5em] mb-4 block">Pergunta {currentStep + 1} de {QUIZ_QUESTIONS.length}</span>
                  <h3 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">
                    {QUIZ_QUESTIONS[currentStep].question}
                  </h3>
               </div>
               <div className="hidden md:block text-right">
                  <p className="text-white/20 font-serif italic text-xl">Pontuação: {score}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {QUIZ_QUESTIONS[currentStep].options.map((option, idx) => (
                 <button
                   key={idx}
                   disabled={selectedOption !== null}
                   onClick={() => handleAnswer(idx)}
                   className={`p-8 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                     selectedOption === idx 
                       ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400')
                       : (selectedOption !== null && idx === QUIZ_QUESTIONS[currentStep].correct ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/[0.03] border-white/5 text-white/60 hover:bg-white/5 hover:border-white/10 hover:text-white')
                   }`}
                 >
                   <div className="flex items-center justify-between relative z-10">
                      <span className="text-2xl font-serif italic">{option}</span>
                      {selectedOption === idx && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          {isCorrect ? <Trophy size={24} /> : <Star size={24} />}
                        </motion.div>
                      )}
                   </div>
                   
                   {/* Progress fill animation on correct selection */}
                   {selectedOption === idx && isCorrect && (
                     <motion.div 
                       initial={{ width: 0 }} 
                       animate={{ width: '100%' }} 
                       className="absolute bottom-0 left-0 h-1 bg-emerald-500/30"
                     />
                   )}
                 </button>
               ))}
            </div>

            <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex items-start gap-5">
               <div className="p-3 bg-[var(--primary)]/10 rounded-xl text-[var(--primary)]">
                  <Heart size={20} />
               </div>
               <p className="text-[var(--text-muted)] italic text-lg leading-relaxed">
                 <span className="text-white font-bold opacity-40 uppercase text-[10px] tracking-widest block mb-2">Dica Sutil:</span>
                 {QUIZ_QUESTIONS[currentStep].hint}
               </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12"
          >
            <div className="relative inline-block mb-8">
               <div className="absolute inset-0 bg-[var(--primary)] blur-[100px] opacity-20 animate-pulse" />
               <Trophy size={120} className="text-[var(--primary)] mx-auto relative z-10" />
            </div>
            
            <div className="space-y-4">
               <h3 className="text-6xl md:text-8xl font-serif italic text-white tracking-tighter">
                 {score === QUIZ_QUESTIONS.length ? 'Perfeito!' : 'Incrível!'}
               </h3>
               <p className="text-white/40 font-serif italic text-2xl max-w-lg mx-auto leading-relaxed">
                 {score === QUIZ_QUESTIONS.length 
                   ? "Ninguém no mundo nos conhece melhor do que nós mesmos." 
                   : "Cada detalhe da nossa história é um degrau para o infinito."}
               </p>
            </div>

            <div className="bg-white/5 p-12 rounded-[4rem] border border-white/5 flex justify-center gap-16">
               <div className="text-center">
                  <p className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-widest mb-2 opacity-60">Acertos</p>
                  <p className="text-6xl font-serif italic text-white">{score}</p>
               </div>
               <div className="w-px h-24 bg-white/10" />
               <div className="text-center">
                  <p className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-widest mb-2 opacity-60">Sincronia</p>
                  <p className="text-6xl font-serif italic text-white">{Math.round((score / QUIZ_QUESTIONS.length) * 100)}%</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
               <button 
                 onClick={resetQuiz}
                 className="px-12 py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-4 group transition-all"
               >
                 <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" /> Tentar Novamente
               </button>
               <button 
                 className="px-12 py-6 bg-[var(--primary)] text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-4"
               >
                 Salvar no Diário <ArrowRight size={16} />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
