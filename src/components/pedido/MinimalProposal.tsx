import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const MinimalProposal = ({ onAccept }: any) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg)] p-8 font-sans antialiased text-[var(--text)] relative">
       {/* Super minimal design, mostly white space */}
       
       <AnimatePresence mode="wait">
          {!accepted ? (
             <motion.div
               key="question"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               className="text-center max-w-2xl space-y-16"
             >
                <h2 className="text-3xl md:text-5xl font-light tracking-wide leading-relaxed">
                   De tudo que existe, escolho ficar aqui. Com você.
                </h2>
                
                <p className="text-sm tracking-[0.3em] uppercase text-[var(--text-muted)]">
                   Aceita namorar comigo?
                </p>

                <div className="flex justify-center gap-12 mt-16">
                   <button
                     onClick={() => setAccepted(true)}
                     className="text-sm uppercase tracking-[0.2em] pb-1 border-b border-[var(--text)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
                   >
                     Sim.
                   </button>
                   <button className="text-sm uppercase tracking-[0.2em] pb-1 text-[var(--text-muted)] opacity-50 cursor-not-allowed">
                     Não.
                   </button>
                </div>
             </motion.div>
          ) : (
             <motion.div
               key="accepted"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 2 }}
               className="text-center space-y-12"
             >
                <div className="w-1 h-16 bg-[var(--primary)] mx-auto mb-12 opacity-50" />
                <h2 className="text-3xl font-light tracking-wide text-[var(--text)]">
                   Que assim seja.
                </h2>
                <button
                  onClick={onAccept}
                  className="mt-16 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  Voltar ao início
                </button>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};
