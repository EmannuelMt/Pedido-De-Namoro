import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, ShieldAlert, ArrowRight } from 'lucide-react';

export const PlayfulProposal = ({ onAccept }: any) => {
  const [lines, setLines] = useState<string[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [step, setStep] = useState(0);

  const SEQUENCE = [
    "> root@universe:~# ./init_love_protocol.sh",
    "> Inicializando módulos emocionais...",
    "[OK] Módulo de Compatibilidade carregado (100%).",
    "[OK] Cache de Memórias verificado (999+ itens).",
    "> Analisando probabilidade de sucesso...",
    "> Mapeando sorriso.dll...",
    "[WARN] Risco extremo de dependência emocional detectado.",
    "> Deseja ignorar o alerta e prosseguir? (y/n)",
    "> y",
    "> Compilando sentimentos finais...",
    "> RESULTADO: [PERFECT_MATCH]",
  ];

  useEffect(() => {
    if (accepted) return;
    if (step < SEQUENCE.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, SEQUENCE[step]]);
        setStep(s => s + 1);
      }, step === 0 ? 1000 : 800 + Math.random() * 500);
      return () => clearTimeout(timer);
    }
  }, [step, accepted]);

  return (
    <div className="flex-1 flex items-center justify-center bg-black p-4 font-mono">
       <div className="w-full max-w-2xl bg-black border border-green-500/30 p-6 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6 border-b border-green-500/20 pb-4">
             <Terminal className="text-green-500" size={24} />
             <h2 className="text-green-500 uppercase tracking-widest text-sm font-bold">Terminal de Atualização de Status</h2>
          </div>

          <div className="space-y-2 min-h-[300px] text-green-400/80 text-sm md:text-base leading-relaxed">
             <AnimatePresence>
                {lines.map((text, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${text.includes('[OK]') ? 'text-green-300' : text.includes('[WARN]') ? 'text-yellow-400' : ''}`}
                  >
                     {text}
                  </motion.div>
                ))}
             </AnimatePresence>

             {step === SEQUENCE.length && !accepted && (
                <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   transition={{ delay: 1 }}
                   className="pt-8 border-t border-green-500/20 mt-8"
                >
                   <p className="text-green-300 font-bold mb-6 text-xl">EXECUTION REQUIRED: Quer namorar comigo?</p>
                   <div className="flex gap-6">
                      <button 
                         onClick={() => setAccepted(true)}
                         className="px-6 py-2 bg-green-500 text-black font-bold uppercase hover:bg-green-400 transition-colors"
                      >
                         ./accept.sh
                      </button>
                      <button className="px-6 py-2 border border-green-500/30 text-green-500/50 uppercase cursor-not-allowed">
                         ./deny.sh (Permission Denied)
                      </button>
                   </div>
                </motion.div>
             )}

             {accepted && (
                <motion.div
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="pt-8 mt-8 border-t border-green-500/20 text-center"
                >
                   <ShieldAlert className="mx-auto text-green-500 mb-4" size={48} />
                   <h3 className="text-2xl font-bold text-green-400 mb-2">SISTEMA ATUALIZADO</h3>
                   <p className="text-green-500/70 mb-8">Status alterado para: Em um relacionamento sério.</p>
                   <button
                     onClick={onAccept}
                     className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded font-mono uppercase tracking-widest text-xs transition-colors mx-auto flex items-center gap-3"
                   >
                     Reboot System <ArrowRight size={16} />
                   </button>
                </motion.div>
             )}
          </div>
       </div>
    </div>
  );
};
