import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageIcon, Plus, Sparkles, Camera, Heart, ArrowRight, X, Trash2, Filter, User as UserIcon, Type, FileText } from 'lucide-react';
import { PageLayout } from '../App';
import { audioManager } from '../lib/audioManager';

export interface Moment {
  id: string;
  url: string;
  title?: string;
  caption?: string;
  category?: string;
  author?: string;
  authorId?: string;
  createdAt?: any;
}

export const GalleryView = ({ 
  moments, 
  user,
  onAddMoment,
  onDeleteMoment,
  onNavigate 
}: { 
  moments: Moment[];
  user: any;
  onAddMoment: (v: any) => void;
  onDeleteMoment: (id: string) => void;
  onNavigate: (v: any) => void;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [newMoment, setNewMoment] = useState({
    url: '',
    title: '',
    caption: '',
    category: 'Viagem',
    author: user?.displayName || 'Anônimo'
  });

  const categories = ['Todos', 'Viagem', 'Aniversário', 'Cotidiano', 'Surpresa', 'Outros'];
  const formCategories = ['Viagem', 'Aniversário', 'Cotidiano', 'Surpresa', 'Outros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMoment.url || !newMoment.title) return;
    
    audioManager.playSound('data_sync');
    onAddMoment({
      ...newMoment,
      authorId: user?.uid
    });
    setNewMoment({ url: '', title: '', caption: '', category: 'Viagem', author: user?.displayName || 'Anônimo' });
    setIsAdding(false);
  };

  const handleFilterChange = (cat: string) => {
    audioManager.playSound('click');
    setActiveFilter(cat);
  };

  const toggleAdding = () => {
    audioManager.playSound('toggle');
    setIsAdding(!isAdding);
  };

  const filteredMoments = activeFilter === 'Todos' 
    ? moments 
    : moments.filter(m => m.category === activeFilter);

  return (
    <PageLayout 
      title="Nossos" 
      subtitle="Momentos" 
      description="Cada fragmento de luz e cor guarda um instante que nunca deve ser esquecido."
      onNavigate={onNavigate}
      currentView="galeria"
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-16 pb-40">
        
        {/* Banner Section */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-[3rem] overflow-hidden mb-20 shadow-2xl border border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          <motion.img 
             initial={{ scale: 1.1 }}
             animate={{ scale: 1 }}
             transition={{ duration: 10, ease: "easeOut" }}
             src="https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a?auto=format&fit=crop&q=80&w=2000"
             className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-[3000ms]"
             alt="Banner"
          />
          <div className="absolute top-0 left-0 w-full h-full p-10 md:p-16 flex flex-col justify-center z-20">
             <div className="flex items-center gap-3 mb-4">
               <Camera size={18} className="text-[var(--primary)]" />
               <span className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-[0.5em] opacity-80">Registros Atemporais</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tighter italic leading-none max-w-xl">
               Onde a luz toca, <br />
               <span className="text-glow text-[var(--primary)]">a história fica.</span>
             </h2>
          </div>
        </div>

        {/* Filters and Add Action */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto p-2 glass-card rounded-[2rem]">
             <Filter size={16} className="text-white/40 ml-4 mr-2 hidden sm:block" />
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => handleFilterChange(cat)}
                 className={`relative px-6 py-3 rounded-full font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-500 overflow-hidden ${
                   activeFilter === cat 
                     ? 'text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                     : 'text-white/50 hover:text-white/90 bg-white/5'
                 }`}
               >
                 {activeFilter === cat && (
                   <motion.div 
                    layoutId="activeFilterBg"
                    className="absolute inset-0 bg-white rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                 )}
                 <span className="relative z-10">{cat}</span>
               </button>
             ))}
           </div>
           
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={toggleAdding}
             className={`px-12 py-5 rounded-full font-sans text-xs uppercase tracking-[0.3em] font-medium transition-all duration-500 flex items-center gap-4 whitespace-nowrap w-full md:w-auto justify-center group ${
                isAdding 
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)] hover:bg-rose-500/20' 
                  : 'bg-white/5 backdrop-blur-md border border-[var(--primary)]/30 text-white shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] hover:bg-[var(--primary)] hover:border-[var(--primary)]'
             }`}
           >
             {isAdding ? <><X size={16} className="group-hover:rotate-90 transition-transform duration-500" /> Cancelar</> : <><Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" /> Adicionar Momento</>}
           </motion.button>
        </div>

        {/* Add Moment Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 80 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="luxury-card p-10 md:p-14 border border-[var(--primary)]/30 bg-black/40 relative">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none grayscale invert rotate-12">
                   <Camera size={180} className="text-[var(--primary)]" />
                </div>
                
                <h3 className="text-3xl font-serif italic text-white mb-8 tracking-tight flex items-center gap-4">
                  <span className="w-10 h-px bg-white/20" /> Eternizar Novo Fragmento
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-6">
                    <div className="space-y-3 p-1">
                      <label className="text-white/40 font-mono text-[9px] uppercase tracking-widest ml-2 flex items-center gap-2">
                         <ImageIcon size={12} /> URL da Imagem *
                      </label>
                      <input
                        type="url"
                        value={newMoment.url}
                        onChange={e => setNewMoment({...newMoment, url: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white/80 text-sm font-mono shadow-inner outline-none focus:border-[var(--primary)]/50 transition-colors"
                        placeholder="https://..."
                        required
                      />
                    </div>
                    
                    <div className="space-y-3 p-1">
                      <label className="text-white/40 font-mono text-[9px] uppercase tracking-widest ml-2 flex items-center gap-2">
                         <Type size={12} /> Título do Momento *
                      </label>
                      <input
                        type="text"
                        value={newMoment.title}
                        onChange={e => setNewMoment({...newMoment, title: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white/80 text-sm font-serif italic tracking-wide shadow-inner outline-none focus:border-[var(--primary)]/50 transition-colors"
                        placeholder="Uma tarde inesquecível..."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-6 flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-4 h-max">
                      <div className="space-y-3">
                        <label className="text-white/40 font-mono text-[9px] uppercase tracking-widest ml-2 flex items-center gap-2">
                           <Filter size={12} /> Filtro
                        </label>
                        <select
                          value={newMoment.category}
                          onChange={e => setNewMoment({...newMoment, category: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white/80 text-xs font-mono uppercase tracking-wider shadow-inner outline-none focus:border-[var(--primary)]/50 transition-colors cursor-pointer appearance-none"
                        >
                          {formCategories.map(cat => (
                            <option key={cat} value={cat} className="bg-stone-900 text-white">{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-white/40 font-mono text-[9px] uppercase tracking-widest ml-2 flex items-center gap-2">
                           <UserIcon size={12} /> Autor
                        </label>
                        <input
                          type="text"
                          value={newMoment.author}
                          onChange={e => setNewMoment({...newMoment, author: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-[var(--primary)] text-xs font-mono uppercase tracking-widest shadow-inner outline-none focus:border-[var(--primary)]/50 transition-colors"
                          placeholder="Quem capturou?"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3 flex-1 pt-2">
                      <label className="text-white/40 font-mono text-[9px] uppercase tracking-widest ml-2 flex items-center gap-2">
                         <FileText size={12} /> Descrição / Legenda
                      </label>
                      <textarea
                        value={newMoment.caption}
                        onChange={e => setNewMoment({...newMoment, caption: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white/60 text-sm font-serif italic shadow-inner outline-none focus:border-[var(--primary)]/50 transition-colors min-h-[120px] resize-none"
                        placeholder="Em poucas palavras, o que esse momento significa..."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                   <button 
                     type="submit"
                     className="px-14 py-5 bg-[var(--primary)] text-white rounded-2xl font-mono text-[10px] uppercase tracking-[0.4em] font-bold shadow-[0_0_30px_var(--primary-glow)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
                   >
                     Eternizar <Sparkles size={16} />
                   </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Masonry-style Bento Grid for Moments */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 auto-rows-[300px]">
          {moments.length === 0 ? (
            <div className="md:col-span-4 h-96 flex flex-col items-center justify-center space-y-8">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                <ImageIcon size={40} className="text-white/20" />
              </div>
              <p className="text-white/30 font-serif italic text-xl">Sintonizando memórias...</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredMoments.map((moment, i) => {
              const isLarge = i % 7 === 0;
              const isTall = i % 5 === 0;
              const isWide = i % 4 === 0 && !isLarge;

              return (
                <motion.div
                  layout
                  key={moment.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 8) * 0.1, duration: 0.5 }}
                  className={`group relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 bg-stone-900/40
                    ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
                    ${isTall && !isLarge ? 'md:row-span-2' : ''}
                    ${isWide ? 'md:col-span-2' : ''}
                  `}
                >
                  <div className="absolute inset-0 z-0 pointer-events-none">
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-1000" />
                     <img 
                       src={moment.url} 
                       alt={moment.title || moment.caption} 
                       className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105"
                     />
                  </div>

                  {onDeleteMoment && (
                    <button 
                      onClick={() => onDeleteMoment(moment.id)}
                      className="absolute top-6 right-6 z-30 opacity-0 group-hover:opacity-100 p-3 text-white/40 hover:text-rose-500 hover:bg-rose-500/20 rounded-full transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}

                  <div className="absolute top-6 left-6 z-20">
                     {moment.category && (
                       <span className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full font-mono text-[9px] uppercase tracking-widest text-white/80 border border-white/10">
                         {moment.category}
                       </span>
                     )}
                  </div>

                  <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end translate-y-6 group-hover:translate-y-0 transition-transform duration-700 pointer-events-none">
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 pointer-events-auto">
                        <div className="w-10 h-[2px] bg-[var(--primary)]/70 mb-4" />
                        {moment.title && (
                          <h4 className="text-white font-serif italic text-2xl lg:text-3xl leading-tight mb-2 drop-shadow-md">
                            {moment.title}
                          </h4>
                        )}
                        {moment.caption && (
                          <p className="text-white/60 font-serif italic text-sm lg:text-base leading-relaxed mb-4 line-clamp-2 lg:line-clamp-3">
                            "{moment.caption}"
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-[var(--primary)] font-mono text-[9px] uppercase tracking-widest mt-auto drop-shadow-lg">
                           <UserIcon size={12} />
                           <span>Eternizado por {moment.author || 'Nós'}</span>
                        </div>
                     </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
          )}
          
          {moments.length > 0 && filteredMoments.length === 0 && (
             <div className="col-span-1 md:col-span-4 h-full min-h-[300px] flex flex-col items-center justify-center opacity-40">
                <ImageIcon size={48} className="mb-6 opacity-30" />
                <p className="font-mono text-xs uppercase tracking-widest">Nenhum momento encontrado com este filtro.</p>
             </div>
          )}
        </div>
        
        {/* Call to action to continue */}
        <div className="mt-32 text-center">
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => onNavigate('playlist')}
             className="px-20 md:px-24 py-8 md:py-10 luxury-glass text-white border border-rose-500/10 rounded-[3rem] font-bold text-[10px] md:text-xs uppercase tracking-[0.5em] hover:bg-rose-600/20 hover:border-rose-500/40 transition-all shadow-extreme group"
           >
             Sintonizar Vibes <ArrowRight size={24} className="inline ml-6 group-hover:translate-x-3 transition-transform text-rose-500" />
           </motion.button>
        </div>
      </div>
    </PageLayout>
  );
};
