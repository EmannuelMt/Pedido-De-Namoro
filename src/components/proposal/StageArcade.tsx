import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Gamepad2, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

interface StageProps {
  onNext: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctIdx: number;
  funFact: string;
}

const ARCADE_QUIZ: Question[] = [
  {
    question: "Qual era a comida favorita para dividirmos ou comentarmos nas conversas?",
    options: ["Pizza de quatro queijos bem quentinha 🍕", "Hambúrguer monstruoso repleto de queijo 🍔", "Sushi maravilhoso no final de semana 🍣", "Doces fofos e chocolate meio amargo 🍫"],
    correctIdx: 0,
    funFact: "Pizza sempre foi o nosso porto seguro! Divide corações e mata qualquer fome."
  },
  {
    question: "Se fossemos uma dupla de heróis nos videogames, seríamos:",
    options: ["Mario & Peach resgatando o reino 🏰", "Link & Zelda decifrando mistérios 🗡️", "Donkey Kong & Diddy Kong pegando bananas 🍌", "Dois gatinhos aventureiros bagunçando a sala 🐱"],
    correctIdx: 3,
    funFact: "Admitamos: o nosso nível de travessura e fofura é idêntico ao de gatinhos bagunceiros!"
  },
  {
    question: "Onde seria a viagem ideal dos nossos sonhos mais fofos?",
    options: ["Uma cabana aconchegante com neve caindo ❄️", "Tóquio iluminada comendo ramen delicioso 🇯🇵", "Uma praia calma assistindo as estrelas se acenderem 🌌", "Todas as anteriores, desde que estejamos de mãos dadas ❤️"],
    correctIdx: 3,
    funFact: "O destino nunca importou, porque o nosso verdadeiro lar é no abraço do outro!"
  }
];

export const StageArcade: React.FC<StageProps> = ({ onNext }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const activeQuestion = ARCADE_QUIZ[currentQuestionIdx];

  const handleOptionClick = (idx: number) => {
    if (selectedOptIdx !== null) return; // Prevent double select
    setSelectedOptIdx(idx);

    if (idx === activeQuestion.correctIdx) {
      setScore(prev => prev + 100);
      toast.success("+100 Pontos de Amor! 🎯", {
        style: {
          border: '3px solid #000',
          borderRadius: '16px',
          fontWeight: 'bold',
          fontFamily: 'Fredoka, sans-serif'
        }
      });
    } else {
      toast.error("Ops! Mas tudo bem, o importante é tentar! 😊");
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptIdx(null);
    if (currentQuestionIdx < ARCADE_QUIZ.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIdx(0);
    setSelectedOptIdx(null);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#351C75] text-[#FFE599] overflow-y-auto py-12 px-4 select-none flex flex-col justify-between" id="stage-arcade">
      {/* Heavy grid pixel synth overlay feel */}
      <div className="absolute inset-0 bg-[#351055] opacity-25 bg-[linear-gradient(#ff00aa_1px,transparent_1px),linear-gradient(90deg,#ff00aa_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Header arcade titles */}
      <div className="z-10 text-center max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff00aa]/20 border-2 border-[#ff00aa] rounded-full text-[#ffccd5] text-[10px] font-black uppercase tracking-widest font-mono shadow-[2px_2px_0px_#000]">
          🎮 ETAPA 06 — OS DESAFIOS
        </span>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#ffccd5] mt-2 font-sans" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
          Estética: Arcade Love
        </h2>
      </div>

      {/* Cabinet Frame Wrapper */}
      <div className="w-full max-w-md mx-auto my-auto z-10 px-1">
        <div className="border-[6px] border-black bg-slate-900 rounded-[32px] p-5 shadow-[8px_8px_0px_#000] relative overflow-hidden flex flex-col min-h-[440px] justify-between">
          
          {/* Upper Header Score strip */}
          <div className="bg-black border-2 border-dashed border-[#ff00aa]/40 p-2.5 rounded-xl flex items-center justify-between text-[11px] font-mono font-black uppercase tracking-widest">
            <span className="text-cyan-400">JOGADOR 1: ATIVO</span>
            <span className="text-yellow-400 flex items-center gap-1">
              <Trophy size={12} /> SCORE: {score}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {!quizCompleted ? (
              <motion.div 
                key={currentQuestionIdx}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="my-auto py-4 space-y-4 text-left"
              >
                <div className="bg-[#1f1a3a] border-2 border-[#ff00aa] p-4 rounded-2xl relative">
                  <span className="absolute -top-3 left-3 bg-[#ff00aa] text-white border-2 border-black px-2 py-0.5 rounded-md text-[8px] font-black">
                    PERGUNTA {currentQuestionIdx + 1}/3
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white leading-relaxed pt-1.5">
                    {activeQuestion.question}
                  </p>
                </div>

                {/* Multiple choices */}
                <div className="space-y-2">
                  {activeQuestion.options.map((opt, i) => {
                    const isSelected = selectedOptIdx === i;
                    const isCorrect = i === activeQuestion.correctIdx;
                    let bg = 'bg-slate-800 hover:bg-slate-700 text-white';
                    if (selectedOptIdx !== null) {
                      if (isCorrect) bg = 'bg-green-500 text-white';
                      else if (isSelected) bg = 'bg-red-500 text-white';
                    }

                    return (
                      <button
                        key={i}
                        disabled={selectedOptIdx !== null}
                        onClick={() => handleOptionClick(i)}
                        className={`w-full text-left px-4 py-2.5 border-2 border-black rounded-xl text-[11px] sm:text-xs font-semibold transition-all shadow-[2px_2px_0px_#000] flex justify-between items-center ${bg}`}
                      >
                        <span>{opt}</span>
                        {selectedOptIdx !== null && isCorrect && <CheckCircle2 size={12} className="text-white" />}
                      </button>
                    );
                  })}
                </div>

                {/* Question Feedback review facts */}
                {selectedOptIdx !== null && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#1a2e26] border-2 border-green-500 p-3 rounded-xl text-[11px] text-green-200 font-sans italic"
                  >
                    💡 {activeQuestion.funFact}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="my-auto text-center space-y-6 py-6"
              >
                <div className="w-20 h-20 bg-amber-400 border-3 border-black rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000] animate-bounce">
                  <Trophy size={40} className="text-slate-900" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase text-white tracking-widest">Sintonia Perfeita!</h3>
                  <p className="text-xs text-yellow-300 font-mono font-bold">ARCADE COMPLETADO COM SUCESSO</p>
                  <p className="text-[11px] opacity-80 max-w-xs mx-auto pt-2 text-indigo-200">
                    Sua pontuação final foi de <strong>{score} de 300 pontos</strong>. O amor supera qualquer desafio de fliperama!
                  </p>
                </div>

                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-[#ff00aa] text-white border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mx-auto shadow-[2px_2px_0px_#000] active:translate-y-0.5"
                >
                  <RotateCcw size={11} /> Jogar Novamente
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom control trigger if selection is completed */}
          <div className="pt-2 border-t border-dashed border-slate-700 flex justify-between items-center z-15">
            <span className="text-[8px] font-mono text-slate-400">COIN: 99x</span>
            
            {selectedOptIdx !== null && !quizCompleted && (
              <button 
                onClick={handleNextQuestion}
                className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-500 text-black border-2 border-black rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 transition-all shadow-[1px_1px_0px_#000]"
              >
                Avançar Pergunta &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer step button */}
      <div className="z-10 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          disabled={!quizCompleted}
          onClick={onNext}
          className={`inline-flex items-center gap-3 px-8 py-3.5 border-2 border-black font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-[4px_4px_0px_#ff00aa] transition-all cursor-pointer ${
            quizCompleted 
              ? 'bg-[#ffccd5] hover:bg-white text-black active:translate-y-1' 
              : 'bg-stone-800 text-stone-500 border-stone-700 shadow-none cursor-not-allowed opacity-50'
          }`}
        >
          EXPLORAR MEU MUNDO (RPG Map) 🗺️ <ArrowRight className="w-4 h-4 text-emerald-400" />
        </motion.button>
      </div>
    </div>
  );
};
