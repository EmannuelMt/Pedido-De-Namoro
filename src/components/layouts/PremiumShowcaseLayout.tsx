import React from 'react';
import { motion } from 'motion/react';
import { Diamond, Sparkles, MoveRight } from 'lucide-react';

export const PremiumShowcaseLayout = ({ setView, GALLERY_DATA }: any) => {
  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans antialiased">
      {/* Magazine Header */}
      <header className="w-full py-10 px-12 md:px-24 flex justify-between items-center border-b border-white/5">
         <span className="font-serif italic text-2xl tracking-wider">L'Amour</span>
         <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Edition Vol. 1</span>
      </header>

      <main className="px-12 md:px-24">
         {/* Hero Showcase */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-20 pb-32 items-center">
            <div className="lg:col-span-5 space-y-12">
               <Diamond size={24} className="text-[var(--primary)]" />
               <h1 className="text-6xl md:text-8xl font-serif text-[var(--text)] tracking-tight leading-none">
                 A Arte <br/><span className="text-[var(--text-muted)] italic">de Amar.</span>
               </h1>
               <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-md">
                 Explore nossa curadoria de momentos exclusivos, desenhados para durar a eternidade com classe e sofisticação.
               </p>
               <button onClick={() => setView('galeria')} className="group flex items-center gap-4 text-sm font-mono uppercase tracking-widest pb-3 border-b border-[var(--primary)] text-[var(--text)] hover:text-[var(--primary)] transition-colors">
                  Ver Coleção Exclusiva
                  <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
            <div className="lg:col-span-7 h-[70vh] bg-[var(--primary)]/5 rounded-sm p-4 border border-[var(--primary)]/10">
               <div className="w-full h-full bg-black/20 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1518199266791-739d6ffecf0b?w=1200" alt="Showcase" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[10s]" />
               </div>
            </div>
         </div>

         {/* Secondary Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-32 border-t border-white/5">
            {[ 
              { title: "Diário Finos", subtitle: "Nossas Cartas", id: 'cartas' },
              { title: "Acervo Acústico", subtitle: "Trilha Sonora", id: 'playlist' },
              { title: "A Grande Peça", subtitle: "Surpresa", id: 'pedido' }
            ].map((col, idx) => (
              <div key={idx} className="group cursor-pointer" onClick={() => setView(col.id)}>
                 <div className="w-full aspect-[3/4] bg-[var(--primary)]/10 mb-8 border border-white/5 overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=${idx}`} className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Category" />
                 </div>
                 <h3 className="font-serif italic text-2xl mb-2 group-hover:text-[var(--primary)] transition-colors">{col.title}</h3>
                 <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">{col.subtitle}</p>
              </div>
            ))}
         </div>
      </main>
    </div>
  );
};
