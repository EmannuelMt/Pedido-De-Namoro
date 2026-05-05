import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, ArrowRight, Heart } from 'lucide-react';

const STORY_NODES: Record<string, any> = {
  start: {
    text: "Você acorda em uma dimensão onde todas as memórias estão fragmentadas flutuando no ar. Um caminho de estrelas guia você para duas portas.",
    choices: [
      { text: "Entrar na Porta das Risadas", next: "laugh" },
      { text: "Seguir pelo Caminho do Silêncio Confortável", next: "silence" }
    ]
  },
  laugh: {
    text: "A porta se abre para um eco das piadas internas de vocês. A aura vibra em tons dourados. De repente, um Guardião da Memória bloqueia a passagem: 'Só quem sabe a data exata do primeiro abraço pode passar.'",
    choices: [
      { text: "Responder com confiança", next: "success" },
      { text: "Tentar distrair o Guardião com um beijo", next: "kiss_guard" }
    ]
  },
  silence: {
    text: "O caminho é calmo. Você vê projeções de tardes no sofá, assistindo séries. A tranquilidade aumenta a sua conexão mental com ela(e).",
    choices: [
      { text: "Sentar e absorver a paz", next: "success" },
      { text: "Gritar 'eu te amo' para ver o eco", next: "echo" }
    ]
  },
  kiss_guard: {
    text: "O Guardião sorri (ou seria você beijando a(o) sua/seu parceira(o)?). O caminho se abre, revelando um baú de cristal.",
    choices: [
      { text: "Abrir o Baú", next: "end" }
    ]
  },
  echo: {
    text: "O eco volta multiplicado milhares de vezes. O labirinto inteiro acende na cor rosa neon.",
    choices: [
      { text: "Avançar para o centro da luz", next: "end" }
    ]
  },
  success: {
    text: "Sua aura se sincroniza com o universo. Uma fusão de almas acontece.",
    choices: [
      { text: "Abraçar sua/seu parceira(o) na realidade", next: "end" }
    ]
  },
  end: {
    text: "Uma nova memória foi selada no Labirinto de Aura. Fim da Exploração Diária.",
    choices: []
  }
};

export const RelationshipJourneyGame = ({ onFinish }: { onFinish: (stats: any) => void }) => {
  const [currentNode, setCurrentNode] = useState('start');
  const [history, setHistory] = useState<string[]>(['start']);

  const handleChoice = (next: string) => {
    setCurrentNode(next);
    setHistory([...history, next]);

    if (STORY_NODES[next].choices.length === 0) {
      setTimeout(() => {
        onFinish({ pathTaken: [...history, next].join(' > ') });
      }, 3000);
    }
  };

  const node = STORY_NODES[currentNode];

  return (
    <div className="w-full max-w-3xl mx-auto min-h-[60vh] flex flex-col items-center justify-center p-8">
      <Compass size={48} className="text-[var(--primary)] mb-12 animate-spin-slow" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNode}
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
          className="text-center w-full"
        >
          <div className="luxury-glass p-12 rounded-[3.5rem] border border-white/10 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--primary)]/5" />
            <p className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed relative z-10">
              "{node.text}"
            </p>
          </div>

          <div className="flex flex-col gap-4 max-w-xl mx-auto">
            {node.choices.map((choice: any, idx: number) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice(choice.next)}
                className="w-full text-left p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] hover:border-[var(--primary)]/50 transition-all group flex justify-between items-center"
              >
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                  {choice.text}
                </span>
                <ArrowRight size={16} className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
              </motion.button>
            ))}

            {node.choices.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 flex flex-col items-center justify-center text-[var(--primary)]"
              >
                <Heart size={32} className="animate-pulse mb-4" />
                <span className="font-mono text-[10px] uppercase tracking-[0.5em]">Lembrança Registrada</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
