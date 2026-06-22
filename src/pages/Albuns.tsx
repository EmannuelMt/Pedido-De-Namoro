import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Heart, Plus, Search, BookOpen, Star, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Albuns() {
  const [activeFilter, setActiveFilter] = useState('Todos');

  const stats = [
    { label: 'Momentos', value: '2.350', icon: Camera, color: 'bg-rose-400' },
    { label: 'Álbuns', value: '12', icon: BookOpen, color: 'bg-emerald-400' },
    { label: 'Favoritos', value: '180', icon: Heart, color: 'bg-[#ff90e8]' },
  ];

  const filters = ['Todos', 'Favoritos', 'Viagens', 'Datas Especiais', 'Namoro'];

  return (
    <div className="min-h-screen bg-[#fcf9f2] pb-32 select-none">
      {/* Cinematic Background Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
      </div>

      <div className="w-full px-4 md:px-8 xl:px-12 pt-12 md:pt-20 space-y-16 md:space-y-24 relative z-10 pb-40">
        
        {/* Hero Section */}
        <section className="bg-white border-[6px] border-black p-8 md:p-14 lg:p-20 rounded-[4rem] shadow-[24px_24px_0px_0px_#000] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 relative overflow-hidden group w-full">
          <div className="absolute -top-16 -right-16 opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:rotate-45">
            <BookOpen className="w-[400px] h-[400px] text-black" />
          </div>

          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-3 bg-amber-400 border-[4px] border-black px-6 py-2.5 rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] -rotate-2">
              <Sparkles className="w-5 h-5 text-black animate-pulse" />
              <span className="text-xs font-black text-black uppercase tracking-[0.2em] italic">
                Nossa Biblioteca
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] italic -rotate-1 transform-gpu">
              Nossos <br /> <span className="bg-[#ff90e8] px-5 py-2 border-[5px] border-black inline-block mt-4 rotate-2 shadow-[10px_10px_0px_0px_#000]">Álbuns</span>
            </h1>
            <p className="max-w-xl text-black/40 font-black text-lg md:text-xl leading-snug uppercase tracking-tight italic">
              Reviva cada momento, descoberta e pequena aventura que guardamos com tanto carinho. 
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-6 shrink-0 w-full xl:w-auto relative z-10">
            {stats.map((s, i) => (
              <div key={i} className={`${s.color} border-[4px] border-black p-6 rounded-[2rem] shadow-[8px_8px_0px_0px_#000] flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-pointer ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                <div className="w-14 h-14 bg-white border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                  <s.icon className="w-8 h-8 text-black" strokeWidth={3} />
                </div>
                <div>
                  <div className="text-3xl font-black leading-none">{s.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filters & Actions */}
        <section className="space-y-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 bg-white border-[6px] border-black p-10 md:p-14 rounded-[4rem] shadow-[24px_24px_0px_0px_#000] w-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] group-hover:bg-emerald-400/20 transition-all pointer-events-none" />
            
            <div className="space-y-8 w-full relative z-10">
              <div className="inline-flex items-center gap-3 bg-cyan-400 border-[4px] border-black px-6 py-3 rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] -rotate-1">
                <Search className="w-6 h-6 text-black" strokeWidth={3} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black">Explorar Memórias</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-black italic">
                Filtrar Por <br /> <span className="bg-white px-5 py-2 border-[5px] border-black inline-block mt-3 rotate-1 transform-gpu shadow-[8px_8px_0px_0px_#000]">Categoria</span>
              </h2>
              <div className="flex flex-wrap gap-5 pt-4">
                 {filters.map(f => (
                   <button 
                     key={f}
                     onClick={() => setActiveFilter(f)} 
                     className={`px-8 py-5 border-[4px] border-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-none cursor-pointer ${activeFilter === f ? 'bg-black text-white shadow-[8px_8px_0px_0px_#ff90e8]' : 'bg-white text-black shadow-[6px_6px_0px_0px_#000]'}`}
                   >
                     {f}
                   </button>
                 ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 shrink-0 w-full lg:w-auto mt-6 lg:mt-0 relative z-10">
               <button 
                 className="flex-1 lg:flex-none justify-center bg-emerald-400 text-black border-[5px] border-black px-14 py-10 rounded-[3rem] font-black uppercase italic text-sm tracking-[0.2em] shadow-[12px_12px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-5 cursor-pointer group"
               >
                 <Plus className="w-10 h-10 text-black group-hover:rotate-90 transition-transform" strokeWidth={5} /> Novo Álbum
               </button>
            </div>
          </div>
        </section>

        {/* Albums Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 md:gap-12 pt-8 pb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? 1 : -1 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative p-6 border-[5px] border-black rounded-[2.5rem] transition-all hover:-translate-y-4 hover:shadow-[18px_18px_0px_0px_#000] shadow-[12px_12px_0px_0px_#000] cursor-pointer bg-white"
              >
                {/* Decorative Tape Sticker */}
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-10 border-[4px] border-black z-10 shadow-[4px_4px_0px_0px_#000] ${i % 2 === 0 ? 'bg-rose-400 -rotate-2' : 'bg-cyan-400 rotate-2'}`} />
                
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden border-[4px] border-black rounded-[1.5rem] mb-6">
                  <img src={`https://images.unsplash.com/photo-${1517457373958 + i}-b7bdd4587205?q=80&w=800&auto=format&fit=crop`} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt="Album cover" />
                  <div className="absolute top-4 right-4 bg-white border-[3px] border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_#000] rotate-12">
                     <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20">Coleção #{String(i).padStart(2, '0')}</span>
                     <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ff90e8]">
                        <Calendar className="w-4 h-4" /> JAN 2026
                     </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-black leading-none group-hover:text-rose-500 transition-colors">Viagem à Praia {i}</h3>
                  <p className="text-black/40 font-black uppercase text-[10px] tracking-widest italic">{12 * i} FOTOS CAPTURADAS</p>
                  
                  <div className="pt-4 border-t-[3px] border-black/5 flex items-center justify-between">
                    <Link to={`/albuns/${i}`} className="text-xs font-black uppercase underline decoration-[3px] underline-offset-8 decoration-emerald-400 hover:decoration-black transition-all">
                      Abrir Coleção &rarr;
                    </Link>
                    <div className="flex -space-x-4">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="w-10 h-10 rounded-full border-[3px] border-black bg-stone-100 overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                          <img src={`https://i.pravatar.cc/100?u=${i+j}`} className="w-full h-full object-cover" alt="User" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </section>
      </div>
    </div>
  );
}
