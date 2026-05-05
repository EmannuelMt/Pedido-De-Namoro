import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, ArrowDown, HeartHandshake, BookOpen } from 'lucide-react';

export const TimelineStoryLayout = ({ setView, GALLERY_DATA, ALBUMS_DATA }: any) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="w-full bg-[var(--bg)] text-[var(--text)] font-sans">
      <div className="fixed inset-y-0 left-1/2 w-px bg-[var(--primary)]/30 -translate-x-1/2 z-0" />

      {/* Intro */}
      <section className="h-screen relative flex items-center justify-center p-8 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)] to-transparent z-10">
        <div className="text-center max-w-2xl bg-[var(--bg)] p-8 rounded-full border border-[var(--primary)]/20 shadow-[-10px_0_50px_rgba(var(--primary-rgb),0.1)]">
           <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4">O Começo</p>
           <h1 className="text-5xl md:text-7xl font-serif italic mb-6">Nossa História</h1>
           <p className="text-lg text-[var(--text-muted)]">Cada momento nos trouxe a este exato instante.</p>
           <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-8 flex justify-center text-[var(--primary)]">
             <ArrowDown />
           </motion.div>
        </div>
      </section>

      {/* Chapters */}
      <section className="relative z-10 pb-32">
         {[1, 2, 3].map((chapter, index) => (
           <div key={chapter} className="min-h-screen flex items-center w-full">
              <div className={`w-1/2 p-8 md:p-16 flex flex-col justify-center ${index % 2 === 0 ? 'text-right items-end pr-12 md:pr-24' : 'order-2 text-left items-start pl-12 md:pl-24'}`}>
                 <BookOpen size={32} className="text-[var(--primary)] mb-6 opacity-50" />
                 <h2 className="text-3xl md:text-5xl font-serif mb-4">Capítulo {chapter}</h2>
                 <p className="text-lg text-[var(--text-muted)] max-w-md">
                   Revisitando memórias inesquecíveis gravadas na linha do tempo da nossa jornada.
                 </p>
              </div>
              <div className={`w-1/2 p-8 md:p-16 flex items-center justify-center ${index % 2 === 0 ? 'pl-12 md:pl-24' : 'order-1 pr-12 md:pr-24'}`}>
                  <div className="w-full aspect-[3/4] bg-[var(--primary)]/10 rounded-2xl border border-[var(--primary)]/30 overflow-hidden relative group cursor-pointer hover:shadow-[0_0_40px_var(--primary-glow)] transition-all" onClick={() => setView('historia')}>
                     <img src={`https://images.unsplash.com/photo-1518199266791-739d6ffecf0b?w=800&q=${chapter}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Memory" />
                  </div>
              </div>
           </div>
         ))}
      </section>
    </div>
  );
};
