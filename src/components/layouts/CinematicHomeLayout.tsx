import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Camera, Clapperboard, Film, PlayCircle, Clock } from 'lucide-react';

export const CinematicHomeLayout = ({ setView, GALLERY_DATA, ALBUMS_DATA }: any) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative w-full bg-[var(--bg)] text-[var(--text)] overflow-hidden font-sans">
      {/* Film Reel Lines */}
      <div className="fixed inset-x-0 top-0 h-8 border-b border-white/10 flex items-center justify-around opacity-20 pointer-events-none z-50">
         {[...Array(20)].map((_, i) => <div key={i} className="w-1 h-4 bg-white/50" />)}
      </div>
      <div className="fixed inset-x-0 bottom-0 h-8 border-t border-white/10 flex items-center justify-around opacity-20 pointer-events-none z-50">
         {[...Array(20)].map((_, i) => <div key={i} className="w-1 h-4 bg-white/50" />)}
      </div>

      {/* Intro Scene (Hero) */}
      <section className="h-screen w-full flex items-end p-12 md:p-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-black z-0">
           {/* Mock background covering full screen */}
           <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600')] bg-cover bg-center grayscale" />
        </div>
        
        <div className="relative z-20 flex flex-col md:flex-row items-end justify-between w-full gap-8">
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="max-w-4xl"
           >
              <div className="flex items-center gap-4 mb-6">
                 <Clapperboard size={20} className="text-[var(--primary)]" />
                 <span className="font-mono text-xs uppercase tracking-[0.5em] text-[var(--text-muted)]">Apresentando</span>
              </div>
              <h1 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter leading-none mb-6">
                Nossa <span className="text-[var(--primary)]">História</span>
              </h1>
              <p className="text-xl md:text-2xl text-[var(--text-muted)] max-w-2xl font-serif italic">
                Um filme de amor interativo, onde cada clique revela a próxima cena da nossa jornada.
              </p>
           </motion.div>
           
           <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('historia')}
              className="flex items-center gap-4 group"
           >
              <div className="w-20 h-20 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
                 <PlayCircle size={32} className="ml-1" />
              </div>
              <div className="text-left">
                 <p className="font-bold uppercase tracking-widest text-sm">Reproduzir</p>
                 <p className="font-mono text-xs text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors">Próximo Capítulo</p>
              </div>
           </motion.button>
        </div>
      </section>

      {/* Horizontal Scroller (Cinematic Strip) */}
      <section className="h-[200vh] relative">
         <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
            <div className="pl-12 md:pl-24 mb-12">
               <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-2">Cenas Destacadas</h2>
               <p className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">Acervo Oficial — {ALBUMS_DATA?.length || 0} Registros</p>
            </div>
            
            <motion.div 
              style={{ x: useTransform(scrollYProgress, [0.3, 0.7], ["0%", "-50%"]) }}
              className="flex gap-8 px-12 md:px-24"
            >
               {ALBUMS_DATA?.map((album: any, idx: number) => (
                  <div key={album.id} onClick={() => setView('albuns')} className="w-[80vw] md:w-[40vw] aspect-video shrink-0 relative group cursor-pointer border border-white/10 rounded-xl overflow-hidden bg-white/5">
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all z-10 duration-700" />
                     {/* Mock poster */}
                     <div className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518199266791-739d6ffecf0b?w=800)' }} />
                     
                     <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black to-transparent transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <p className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-widest mb-2 font-bold">Cena {idx + 1}</p>
                        <h3 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">{album.title}</h3>
                        <p className="text-white/60 font-serif italic text-sm">{album.photos?.length || 0} fotografias</p>
                     </div>
                  </div>
               ))}
            </motion.div>
         </div>
      </section>

      <section className="min-h-screen p-12 md:p-24 border-t border-white/5">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div>
               <h2 className="text-7xl font-bold uppercase tracking-tighter mb-12">Bastidores.</h2>
               <div className="space-y-8">
                  <div className="border border-white/10 p-8 rounded-xl bg-white/5 hover:border-[var(--primary)]/50 transition-colors cursor-pointer" onClick={() => setView('galeria')}>
                     <Camera className="text-[var(--primary)] mb-6" size={32} />
                     <h3 className="text-2xl font-bold uppercase mb-2">Galeria Bruta</h3>
                     <p className="text-[var(--text-muted)] font-serif italic">Nossas fotos sem filtro, do jeito que o diretor (a vida) gravou.</p>
                  </div>
                  <div className="border border-white/10 p-8 rounded-xl bg-white/5 hover:border-[var(--primary)]/50 transition-colors cursor-pointer" onClick={() => setView('playlist')}>
                     <Film className="text-[var(--primary)] mb-6" size={32} />
                     <h3 className="text-2xl font-bold uppercase mb-2">Trilha Sonora</h3>
                     <p className="text-[var(--text-muted)] font-serif italic">A música tema do nosso romance, tocando em loop.</p>
                  </div>
               </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center p-12 border border-white/10 rounded-2xl bg-[var(--primary)]/5">
               <Clock size={48} className="text-[var(--primary)] mb-8" />
               <p className="font-mono text-sm uppercase tracking-widest text-[var(--text-muted)] mb-4">Rolos de filme disponíveis</p>
               <p className="text-8xl font-bold tracking-tighter mb-8 leading-none">∞</p>
               <button onClick={() => setView('pedido')} className="px-8 py-4 bg-[var(--text)] text-[var(--bg)] font-bold uppercase tracking-widest text-sm rounded hover:bg-[var(--primary)] hover:text-white transition-all w-full">
                  Ver Surpresa (Pós-Créditos)
               </button>
            </div>
         </div>
      </section>
    </div>
  );
};
