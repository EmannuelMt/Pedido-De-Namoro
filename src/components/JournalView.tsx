import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { MessageCircle, Plus, Sparkles, ArrowRight, X, Heart, Feather, Trash2 } from 'lucide-react';
import { PageLayout } from '../App';

interface Letter {
  id: string | number;
  title: string;
  content: string;
  createdAt?: any;
}

export const JournalView = ({ 
  userLetters, 
  onWriteAction, 
  onNavigate,
  onDeleteLetter
}: { 
  userLetters: Letter[], 
  onWriteAction: () => void,
  onNavigate: (v: any) => void,
  onDeleteLetter?: (id: string | number) => void
}) => {
  const [activeLetter, setActiveLetter] = useState<Letter | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <PageLayout 
      title="Diário do" 
      subtitle="Coração" 
      description="Nossas cartas, segredos e promessas eternizadas em palavras."
      onNavigate={onNavigate}
      currentView="cartas"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto"
      >
        {/* Action Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-12 px-4 relative z-10">
           <div className="flex items-center gap-8">
             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-black flex items-center justify-center text-white shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] border border-[var(--primary)]/50 relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <Feather size={28} className="relative z-10 animate-pulse drop-shadow-md" />
             </div>
             <div className="text-left">
               <h3 className="text-[var(--primary)] font-sans font-semibold text-[11px] uppercase tracking-[0.5em] mb-2 opacity-80 decoration-[var(--primary)] underline-offset-4 line-through drop-shadow-md">Arquivo de Sentimentos</h3>
               <p className="text-white font-editorial italic text-3xl md:text-5xl tracking-tight leading-none text-glow-premium drop-shadow-lg">Escreva sua alma.</p>
             </div>
           </div>

           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={onWriteAction}
             className="px-12 py-5 bg-white/5 backdrop-blur-md border border-[var(--primary)]/30 text-white rounded-full font-sans text-xs uppercase tracking-[0.3em] font-medium shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all flex items-center gap-4 group"
           >
             Nova Confissão <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
           </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 px-4 relative z-10">
          {userLetters.map((letter) => (
            <motion.div
              key={letter.id}
              variants={itemVariants}
              onClick={() => setActiveLetter(letter)}
              className="group relative cursor-pointer"
            >
              <div className="luxury-card p-12 h-[480px] flex flex-col justify-between overflow-hidden border border-white/5 hover:border-[var(--primary)]/50 transition-all duration-700 shadow-xl hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)]">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-all duration-1000 group-hover:rotate-12 group-hover:scale-150 grayscale invert pointer-events-none drop-shadow-[0_0_15px_var(--primary)]">
                  <MessageCircle size={240} className="text-white" />
                </div>
                
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {onDeleteLetter && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLetter(letter.id);
                    }}
                    className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 p-3 text-white/30 hover:text-rose-500 glass-card bg-rose-500/10 border-rose-500/30 rounded-full transition-all duration-500 z-10 shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                
                <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-10">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_10px_var(--primary)]" />
                      <span className="text-[var(--primary)] font-sans font-semibold text-[10px] uppercase tracking-[0.4em] drop-shadow-md">
                        {letter.createdAt?.toDate ? letter.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) : 'Recente'}
                      </span>
                   </div>
                   <h3 className="text-4xl lg:text-5xl font-editorial text-white tracking-tight italic leading-[1.1] mb-6 group-hover:text-glow-premium transition-all duration-700 line-clamp-2 drop-shadow-md">
                     {letter.title}
                   </h3>
                   <div className="w-12 h-[1px] bg-gradient-to-r from-[var(--primary)] to-transparent group-hover:w-full transition-all duration-1000 opacity-50 group-hover:opacity-100" />
                </div>

                <div className="relative z-10 group-hover:translate-y-[-10px] transition-transform duration-700 mt-auto">
                  <p className="text-white/50 font-sans font-light leading-relaxed text-xl line-clamp-4 mb-8 group-hover:text-white/80 drop-shadow-sm transition-colors duration-500">
                    "{letter.content}"
                  </p>
                  <div className="flex items-center gap-3 text-[var(--primary)] font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Ler mais <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* If list is empty */}
          {userLetters.length === 0 && (
            <motion.div 
              variants={itemVariants}
              className="col-span-full py-40 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center px-8"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8">
                <Feather size={32} className="text-white/20" />
              </div>
              <h3 className="text-white/40 font-serif italic text-3xl tracking-tighter mb-4">O silêncio também fala...</h3>
              <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em] max-w-sm">Comece a preencher nossa história com suas palavras.</p>
            </motion.div>
          )}
        </div>

        {/* Navigation Shortcut */}
        <div className="mt-48 flex justify-center px-4">
           <button 
             onClick={() => onNavigate('futuro')}
             className="w-full max-w-3xl flex items-center justify-between p-12 luxury-glass border border-white/5 rounded-[4rem] group hover:border-[var(--primary)]/30 transition-all shadow-4xl"
           >
              <div className="text-left">
                <span className="text-[var(--primary)] font-mono text-[9px] uppercase tracking-[0.6em] mb-4 block">Próximo Passo</span>
                <h4 className="text-white font-serif italic text-4xl tracking-tighter">Nossos Amanhãs</h4>
              </div>
              <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:border-[var(--primary)] transition-all">
                <ArrowRight size={24} className="text-white group-hover:scale-125 transition-transform" />
              </div>
           </button>
        </div>
      </motion.div>

      {/* Letter Modal - Bespoke Editorial Feel */}
      <AnimatePresence>
        {activeLetter && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLetter(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 1.05 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-stone-50 text-stone-900 rounded-[2rem] shadow-extreme overflow-auto flex flex-col md:flex-row max-h-[90vh]"
            >
               {/* Left Decorative Column */}
               <div className="w-full md:w-32 bg-stone-200 flex flex-col items-center py-12 gap-8 border-b md:border-b-0 md:border-r border-stone-300">
                  <div className="w-12 h-12 rounded-full border border-stone-400 flex items-center justify-center text-stone-600">
                    <Heart size={20} />
                  </div>
                  <div className="h-px w-12 bg-stone-400 rotate-90" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.5em] rotate-90 whitespace-nowrap text-stone-500 py-12">Original Entry</span>
                  <div className="h-px w-12 bg-stone-400 rotate-90 mt-12" />
               </div>

               {/* Main Letter Content */}
               <div className="flex-1 p-10 md:p-24 relative overflow-y-auto">
                 {/* Action Buttons */}
                 <div className="absolute top-10 right-10 flex items-center gap-4">
                   {onDeleteLetter && activeLetter && (
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         onDeleteLetter(activeLetter.id);
                         setActiveLetter(null);
                       }}
                       className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-rose-500 hover:bg-stone-200 transition-all"
                     >
                       <Trash2 size={18} />
                     </button>
                   )}
                   <button 
                     onClick={() => setActiveLetter(null)}
                     className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-all"
                   >
                     <X size={20} />
                   </button>
                 </div>

                 <div className="max-w-2xl mx-auto">
                    <div className="mb-20">
                      <span className="text-stone-400 font-mono text-[10px] uppercase tracking-[0.6em] mb-4 block">Sincronia Estelar</span>
                      <h2 className="text-5xl md:text-7xl font-serif font-light tracking-tighter leading-none mb-4 italic">{activeLetter.title}</h2>
                      <div className="text-stone-400 font-serif italic text-lg">{activeLetter.createdAt?.toDate ? activeLetter.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Infinito'}</div>
                    </div>

                    <div className="space-y-8">
                       {activeLetter.content.split('\n').map((para, i) => (
                         <p key={i} className="text-stone-700 font-serif text-2xl md:text-3xl leading-[1.6] italic first-letter:text-5xl first-letter:font-bold first-letter:text-stone-900 first-letter:mr-1">
                           {para}
                         </p>
                       ))}
                    </div>

                    <div className="mt-32 pt-12 border-t border-stone-200 flex justify-between items-center">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white">
                           <Sparkles size={16} />
                         </div>
                         <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Com Amor Eterno</span>
                       </div>
                       <Sparkles size={24} className="text-stone-300" />
                    </div>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};
