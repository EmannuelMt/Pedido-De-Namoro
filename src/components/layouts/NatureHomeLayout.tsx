import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Wind, Sun, ArrowDown } from 'lucide-react';

export const NatureHomeLayout = ({ setView, GALLERY_DATA, ALBUMS_DATA }: any) => {
  return (
    <div className="w-full bg-[var(--bg)] text-[var(--text)] font-sans font-light">
      {/* Hero Zen */}
      <section className="h-screen w-full flex flex-col items-center justify-center p-8 relative">
        <motion.div 
           animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }} 
           transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-[100px]"
        />
        <motion.div 
           animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }} 
           transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
           className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-emerald-500/5 rounded-full blur-[120px]"
        />

         <div className="text-center z-10 max-w-3xl">
            <Leaf size={48} className="mx-auto mb-12 text-[var(--primary)] opacity-80" strokeWidth={1} />
            <h1 className="text-5xl md:text-8xl font-serif mb-8 text-[var(--text)] tracking-wider">
               Serenidade.
            </h1>
            <p className="text-lg md:text-2xl text-[var(--text-muted)] leading-loose mb-16 px-4">
               Uma coleção de momentos que crescem e florescem com o tempo. Respire, observe e sinta.
            </p>
            <motion.div 
               animate={{ y: [0, 10, 0] }} 
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="flex justify-center"
            >
               <ArrowDown className="text-[var(--text-muted)] opacity-50" strokeWidth={1} />
            </motion.div>
         </div>
      </section>

      {/* Breathing Grid */}
      <section className="py-32 px-8 sm:px-16 max-w-7xl mx-auto space-y-32">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[5s] ease-out grayscale hover:grayscale-0" alt="Nature" />
            </div>
            <div className="space-y-12">
               <Wind size={40} className="text-[var(--primary)]" strokeWidth={1} />
               <h2 className="text-4xl md:text-6xl font-serif text-[var(--text)]">Onde as raízes<br/>se encontram.</h2>
               <p className="text-xl text-[var(--text-muted)] leading-loose">
                  {ALBUMS_DATA?.length || 0} capítulos da nossa história plantados e cultivados com cuidado.
               </p>
               <button onClick={() => setView('historia')} className="text-sm tracking-[0.2em] uppercase border-b border-[var(--primary)] pb-2 hover:text-[var(--primary)] transition-colors">
                  Caminhar pela floresta de memórias
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="order-2 md:order-1 space-y-12 text-right">
               <Sun size={40} className="text-[var(--primary)] ml-auto" strokeWidth={1} />
               <h2 className="text-4xl md:text-6xl font-serif text-[var(--text)]">Dias de Sol.</h2>
               <p className="text-xl text-[var(--text-muted)] leading-loose">
                  Nossa galeria de {GALLERY_DATA?.length || 0} folhas ao vento, capturadas na luz do agora.
               </p>
               <button onClick={() => setView('galeria')} className="text-sm tracking-[0.2em] uppercase border-b border-[var(--primary)] pb-2 hover:text-[var(--primary)] transition-colors">
                  Contemplar a Galeria
               </button>
            </div>
            <div className="order-1 md:order-2 aspect-[4/5] rounded-[3rem] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[5s] ease-out grayscale hover:grayscale-0" alt="Sunlight" />
            </div>
         </div>
      </section>

      {/* Footer Request */}
      <section className="py-40 flex flex-col items-center justify-center text-center px-4 bg-[var(--bg-alt)] border-t border-black/5">
         <h2 className="text-4xl font-serif mb-12">Há uma semente rara esperando por você.</h2>
         <button onClick={() => setView('pedido')} className="px-16 py-6 bg-[var(--primary)] text-white/90 rounded-full text-xs uppercase tracking-[0.3em] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors">
            Descobrir
         </button>
      </section>
    </div>
  );
};
