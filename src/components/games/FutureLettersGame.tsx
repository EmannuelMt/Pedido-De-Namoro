import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Clock, Send, Lock } from 'lucide-react';

export const FutureLettersGame = ({ onFinish }: { onFinish: (stats: any) => void }) => {
  const [letter, setLetter] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (letter && unlockDate) {
      setSent(true);
      setTimeout(() => {
        onFinish({ unlockDate, length: letter.length });
      }, 3000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <Mail size={48} className="text-[var(--primary)] mx-auto mb-6" />
        <h2 className="text-4xl md:text-5xl font-serif text-white italic tracking-tighter mb-4">Cartas para o Amanhã</h2>
        <p className="text-white/40 font-mono text-xs uppercase tracking-widest">O que você diria para o futuro de vocês mesmos?</p>
      </div>

      {!sent ? (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSend} 
          className="w-full space-y-8 bg-white/[0.02] p-8 md:p-12 rounded-[3.5rem] border border-white/5"
        >
          <div className="space-y-4">
            <label className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-widest pl-4">A Mensagem</label>
            <textarea
              required
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              placeholder="Querido(a) eu do futuro..."
              className="w-full h-48 bg-black/40 border border-white/10 rounded-3xl p-6 text-white text-lg font-serif italic outline-none focus:border-[var(--primary)]/50 transition-colors resize-none placeholder:text-white/20"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-widest pl-4">Quando o selo deve ser quebrado?</label>
            <div className="relative">
              <input
                type="date"
                required
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-full px-8 py-5 text-white focus:border-[var(--primary)] outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
              <Clock className="absolute right-8 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={20} />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-white text-black rounded-full font-mono text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-[var(--primary)] hover:text-white transition-all shadow-2xl flex justify-center items-center gap-4"
          >
            Lançar no Tempo <Send size={16} />
          </button>
        </motion.form>
      ) : (
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="text-center bg-white/[0.02] p-16 rounded-[4rem] border border-[var(--primary)]/30"
        >
           <Lock size={48} className="text-[var(--primary)] mx-auto mb-6 animate-pulse" />
           <h3 className="text-3xl font-serif italic text-white mb-4">Selo Temporal Ativado</h3>
           <p className="text-white/50 font-mono text-[10px] uppercase tracking-[0.3em]">Esta mensagem só será revelada em {new Date(unlockDate).toLocaleDateString('pt-BR')}.</p>
        </motion.div>
      )}
    </div>
  );
};
