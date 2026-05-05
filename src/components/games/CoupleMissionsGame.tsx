import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, CheckCircle, Flame, Gift } from 'lucide-react';

const MISSIONS = [
  { id: 1, title: 'Mensagem Surpresa', desc: 'Envie uma mensagem dizendo o que mais admira nela(e) do nada.' },
  { id: 2, title: 'Dia da Foto', desc: 'Tire uma foto engraçada de vocês dois hoje e adicione à galeria.' },
  { id: 3, title: 'Sessão Nostalgia', desc: 'Passem 10 minutos lembrando da primeira vez que saíram juntos.' },
  { id: 4, title: 'Favorito do Dia', desc: 'Compre ou faça a comida favorita dela(e) hoje.' },
  { id: 5, title: 'Sem Telas', desc: '1 hora juntos sem olhar para nenhum celular.' }
];

export const CoupleMissionsGame = ({ onFinish }: { onFinish: (stats: any) => void }) => {
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [streak, setStreak] = useState(3); // Mocked streak

  const handleComplete = (id: number) => {
    if (!completedMissions.includes(id)) {
      const newCompleted = [...completedMissions, id];
      setCompletedMissions(newCompleted);

      if (newCompleted.length === MISSIONS.length) {
        setTimeout(() => {
          onFinish({ missionsAccomplished: newCompleted.length, streak: streak + 1 });
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-5xl font-serif text-white italic">Missões do Casal</h2>
        <div className="flex items-center justify-center gap-4 text-[var(--primary)] font-mono text-[10px] uppercase tracking-widest font-bold">
          <Flame size={16} className="animate-pulse" /> {streak} Dias de Fogo <Flame size={16} className="animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MISSIONS.map((mission) => {
          const isCompleted = completedMissions.includes(mission.id);
          return (
            <motion.div
              key={mission.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-8 rounded-[2rem] border transition-all duration-500 cursor-pointer ${
                isCompleted 
                  ? 'bg-[var(--primary)]/[0.05] border-[var(--primary)]/30' 
                  : 'bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.05]'
              }`}
              onClick={() => handleComplete(mission.id)}
            >
              <div className="flex justify-between items-start mb-6">
                <Target size={24} className={isCompleted ? 'text-[var(--primary)]' : 'text-white/30'} />
                {isCompleted && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle size={24} className="text-[var(--primary)]" />
                  </motion.div>
                )}
              </div>
              <h3 className={`text-xl font-serif italic mb-2 ${isCompleted ? 'text-white line-through opacity-50' : 'text-white'}`}>
                {mission.title}
              </h3>
              <p className={`text-sm font-mono opacity-60 ${isCompleted ? 'line-through' : ''}`}>
                {mission.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {completedMissions.length === MISSIONS.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 luxury-glass border border-[var(--primary)]/50 rounded-[3rem] text-center mt-12 shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]"
        >
          <Gift size={48} className="text-[var(--primary)] mx-auto mb-6" />
          <h3 className="text-3xl font-serif italic text-white mb-4">Todas Missões Cumpridas!</h3>
          <p className="text-white/50 font-mono text-xs uppercase tracking-widest">O universo de vocês está mais forte hoje.</p>
        </motion.div>
      )}
    </div>
  );
};
