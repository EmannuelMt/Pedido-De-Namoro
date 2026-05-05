import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Shield, Heart, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const InteractiveProposal = ({ onAccept }: any) => {
  const [stage, setStage] = useState(0);

  const handleNextStage = () => {
     setStage(s => s + 1);
     if (stage === 1) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fff', '#3b82f6', '#facc15']
        });
     }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a1a] p-8 font-mono text-white relative overflow-hidden">
       {/* UI Grid Pattern */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />

       <div className="z-10 w-full max-w-3xl">
          {/* Top HUD */}
          <div className="flex justify-between items-center mb-12 pb-4 border-b-2 border-white/10">
             <div className="flex gap-4 items-center">
                <Gamepad2 className="text-blue-400" />
                <span className="text-sm tracking-widest text-blue-400">MAIN QUEST</span>
             </div>
             <div className="flex gap-4">
                <span className="text-xs text-white/50">LVL: MAX</span>
                <span className="text-xs text-white/50">HP: 9999/9999</span>
             </div>
          </div>

          <div className="bg-white/5 border-2 border-blue-500/30 p-8 rounded relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)]">
             <AnimatePresence mode="wait">
                {stage === 0 && (
                   <motion.div
                     key="stage0"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-8 text-center"
                   >
                      <Shield size={64} className="mx-auto text-blue-500 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                      <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-blue-100">Boss Final Encontrado</h2>
                      <p className="text-blue-200/70 max-w-lg mx-auto leading-relaxed">
                         Você navegou por todas as fases, coletou as melhores memórias e destrancou conquistas raras. Agora, o maior desafio aguarda.
                      </p>
                      <button
                        onClick={handleNextStage}
                        className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest transition-colors border-b-4 border-blue-800 hover:border-blue-600 hover:translate-y-[2px]"
                      >
                         Iniciar Fase Final
                      </button>
                   </motion.div>
                )}

                {stage === 1 && (
                   <motion.div
                     key="stage1"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 1.1 }}
                     className="space-y-8 text-center py-8"
                   >
                      <Heart size={80} className="mx-auto text-rose-500 animate-pulse drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]" />
                      <div className="space-y-4">
                         <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            Aceita ser meu / minha "Player 2" pra sempre?
                         </h2>
                         <p className="text-rose-300">Missão: Namorar Comigo. Recompensa: Uma vida inteira de aventuras.</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                         <button
                           onClick={handleNextStage}
                           className="px-12 py-5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xl uppercase tracking-widest transition-colors border-b-4 border-rose-800 hover:border-rose-600 hover:translate-y-[2px]"
                         >
                            ACEITAR QUEST
                         </button>
                         <button className="px-12 py-5 bg-gray-800 text-gray-500 font-bold text-xl uppercase tracking-widest cursor-not-allowed border-b-4 border-gray-900">
                            RECUSAR
                         </button>
                      </div>
                   </motion.div>
                )}

                {stage === 2 && (
                   <motion.div
                     key="stage2"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-8 text-center"
                   >
                      <Trophy size={80} className="mx-auto text-yellow-500 mb-6 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]" />
                      <h2 className="text-4xl font-black uppercase tracking-tighter text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                         QUEST CONCLUÍDA!
                      </h2>
                      <p className="text-xl text-yellow-200/80">Novo Título Adquirido: "Oficialmente Namorandos"</p>
                      
                      <button
                        onClick={onAccept}
                        className="mt-12 px-8 py-3 mx-auto bg-white/10 hover:bg-white/20 text-white transition-colors uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4"
                      >
                         Salvar Jogo <ArrowRight size={16} />
                      </button>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
       </div>
    </div>
  );
};
