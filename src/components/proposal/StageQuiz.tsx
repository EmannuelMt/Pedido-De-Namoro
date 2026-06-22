import React, { useState } from 'react';
import { motion } from 'motion/react';

interface StageProps {
  onNext: () => void;
}

export const StageQuiz: React.FC<StageProps> = ({ onNext }) => {
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const perguntas = [
    { p: "Onde nos conhecemos?", r: "..." },
    { p: "Qual foi nosso primeiro passeio?", r: "..." },
    { p: "Qual meu apelido favorito?", r: "..." }
  ];

  return (
    <motion.div className="max-w-xl w-full p-6 space-y-6 text-center">
      <h2 className="text-3xl font-black uppercase text-[#1a1a1a] mb-10">🧠 Quiz do Casal</h2>
      {!finalizado ? (
        <div className="space-y-4">
          {perguntas.map((q, i) => (
            <div key={i} className="p-4 border-2 border-black bg-white">
              <p className="font-bold">{q.p}</p>
              <input type="text" className="w-full mt-2 p-2 border border-black" placeholder="Sua resposta..." />
            </div>
          ))}
          <button onClick={() => { setAcertos(10); setFinalizado(true); }} className="w-full px-6 py-3 bg-black text-white font-black uppercase">Finalizar Quiz</button>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-2xl font-black">Você acertou {acertos} de 10 ❤️</p>
          <button onClick={onNext} className="w-full mt-8 px-10 py-5 bg-[#e84e4e] text-white border border-black font-black uppercase text-xl hover:bg-black transition-all shadow-[8px_8px_0px_0px_#1a1a1a]">
            Continuar para Surpresa →
          </button>
        </div>
      )}
    </motion.div>
  );
};
