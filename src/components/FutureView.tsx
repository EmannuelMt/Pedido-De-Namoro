import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Lock, Unlock, Eye, EyeOff, Send, Heart, X, MessageSquare, Key } from 'lucide-react';
import { PageLayout } from '../App';

export const FutureView = ({ 
  secrets,
  onAddSecret,
  onNavigate
}: { 
  secrets: any[], 
  onAddSecret: (secret: any) => void,
  onNavigate: (view: any) => void
}) => {
  const [isWriting, setIsWriting] = useState(false);
  const [newSecret, setNewSecret] = useState('');
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  const handleReveal = (id: string, e: any) => {
    e.stopPropagation();
    setRevealedSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!newSecret.trim()) return;
    onAddSecret({ content: newSecret });
    setNewSecret('');
    setIsWriting(false);
  };

  return (
    <PageLayout 
      title="Câmara dos" 
      subtitle="Segredos" 
      description="Aquilo que só nós sabemos. Confissões trancadas à sete chaves no nosso universo."
      onNavigate={onNavigate}
      currentView="perfil > segredos"
    >
      <div className="relative w-full max-w-7xl mx-auto px-4 pb-40">
        
        {/* Header Action */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-12 relative z-10">
           <div className="flex items-center gap-8">
             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-black border border-[var(--primary)]/50 flex items-center justify-center text-[var(--primary)] relative shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] group overflow-hidden">
               <div className="absolute inset-0 bg-white/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <Key size={32} className="relative z-10 drop-shadow-md" />
               <div className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_#f43f5e]" />
             </div>
             <div className="text-left">
               <h3 className="text-[var(--primary)] font-sans font-semibold text-[11px] uppercase tracking-[0.5em] mb-2 opacity-80 decoration-[var(--primary)] underline-offset-4 line-through drop-shadow-md">Confidencial</h3>
               <p className="text-white font-editorial italic text-3xl md:text-5xl tracking-tight leading-none text-glow-premium drop-shadow-lg">O que seu coração esconde?</p>
             </div>
           </div>

           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setIsWriting(true)}
             className="px-10 py-5 bg-white/5 backdrop-blur-md border border-[var(--primary)]/30 text-white rounded-full font-sans text-xs uppercase tracking-[0.3em] font-medium shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all flex items-center gap-4 group"
           >
             Guardar um Segredo <Lock size={16} className="group-hover:scale-110 transition-transform duration-500" />
           </motion.button>
        </div>

        {/* Secrets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
           {secrets.map((secret, i) => {
             const isRevealed = revealedSecrets[secret.id || i];
             return (
               <motion.div
                 key={secret.id || i}
                 layout
                 initial={{ opacity: 0, y: 30, scale: 0.98 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                 className={`luxury-card relative p-10 border hover:border-[var(--primary)]/50 overflow-hidden transition-all duration-700 h-[340px] flex flex-col justify-between group shadow-xl hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.15)] ${isRevealed ? 'border-[var(--primary)] bg-black/60' : 'border-white/5 bg-black/40'}`}
               >
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                 <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                       <span className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]" />
                       <span className="text-[var(--primary)] font-sans font-semibold text-[10px] uppercase tracking-[0.4em] drop-shadow-md">
                         {secret.createdAt?.toDate ? secret.createdAt.toDate().toLocaleDateString('pt-BR') : 'Agora'}
                       </span>
                    </div>
                    <button 
                      onClick={(e) => handleReveal(secret.id || i, e)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 shadow-sm ${isRevealed ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/50' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'}`}
                    >
                      {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>

                 <div className="flex-1 relative z-10 flex flex-col justify-center">
                    {isRevealed ? (
                      <motion.p 
                        initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }} 
                        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }} 
                        transition={{ duration: 0.8 }}
                        className="text-white font-editorial italic text-3xl leading-tight drop-shadow-md"
                      >
                        "{secret.content}"
                      </motion.p>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-6 text-white/20">
                         <Lock size={40} className="group-hover:scale-110 transition-transform duration-700 drop-shadow-md" />
                         <span className="font-sans font-medium text-[10px] uppercase tracking-[0.6em] drop-shadow-sm">Confidencial</span>
                      </div>
                    )}
                 </div>

                 <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex justify-between items-center group-hover:border-white/20 transition-colors">
                    <span className="text-white/40 font-sans font-medium text-[10px] uppercase tracking-[0.3em]">{secret.authorName || 'Anônimo'}</span>
                    <Heart size={16} className={`transition-colors duration-700 ${isRevealed ? "text-rose-500 drop-shadow-[0_0_10px_#f43f5e] fill-rose-500/50" : "text-white/20"}`} />
                 </div>

                 {/* Decors */}
                 <div className={`absolute -bottom-20 -right-20 w-64 h-64 bg-[var(--primary)]/20 rounded-full blur-[80px] transition-opacity duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'} pointer-events-none`} />
               </motion.div>
             )
           })}

           {secrets.length === 0 && (
             <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-50">
               <Lock size={48} className="mb-6 opacity-50" />
               <p className="font-serif italic text-2xl mb-2">Nenhum segredo guardado.</p>
               <p className="font-mono text-[10px] uppercase tracking-[0.4em]">Seja o primeiro a confessar.</p>
             </div>
           )}
        </div>
      </div>

      {/* Writing Modal */}
      <AnimatePresence>
        {isWriting && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
               onClick={() => setIsWriting(false)}
             />
             
             <motion.div 
               initial={{ opacity: 0, y: 50, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 20, scale: 0.95 }}
               className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-extreme z-10"
             >
                <button 
                  onClick={() => setIsWriting(false)}
                  className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="mb-10 text-center">
                   <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 mx-auto flex items-center justify-center text-[var(--primary)] mb-6">
                     <MessageSquare size={24} />
                   </div>
                   <h2 className="text-3xl font-serif text-white italic tracking-tighter mb-2">Seu Segredo</h2>
                   <p className="text-white/40 font-mono text-[9px] uppercase tracking-[0.4em]">Estará sintonizado apenas conosco</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="space-y-4">
                      <textarea
                        value={newSecret}
                        onChange={e => setNewSecret(e.target.value)}
                        placeholder="Escreva algo que você nunca me contou..."
                        className="w-full bg-black/50 border border-white/5 rounded-2xl p-6 text-white text-lg font-serif italic outline-none focus:border-[var(--primary)]/50 transition-colors resize-none placeholder:text-white/20 h-48"
                        required
                        autoFocus
                      />
                   </div>

                   <button 
                     type="submit"
                     disabled={!newSecret.trim()}
                     className="w-full py-5 bg-white text-black rounded-full font-mono text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-[var(--primary)] hover:text-white transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     Trancar Segredo <Lock size={16} />
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};
