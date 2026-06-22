import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Star } from 'lucide-react';
import { motion } from 'motion/react';

export function HistorySection() {
  const chapters = [
    {
      id: '01',
      title: 'Primeiro Encontro',
      emoji: '✨',
      location: 'Cafeteria Doce Vida',
      meta: 'Cap. 01 ☕',
      color: 'bg-rose-50',
      description: 'Aquele café no fim de tarde onde nossos olhares se cruzaram pela primeira vez. A ansiedade virou carinho eterno em segundos.'
    },
    {
      id: '02',
      title: 'Cinema de Sábado',
      emoji: '🍿',
      location: 'Sessão da Meia-Noite',
      meta: 'Cap. 02 🎬',
      color: 'bg-amber-50',
      description: 'Dividindo aquela pipoca gigante, cobertos com o casaco cinza e rindo baixinho de piadas que só nós dois entendemos no escuro.'
    },
    {
      id: '03',
      title: 'Viagem dos Sonhos',
      emoji: '🏔️',
      location: 'Serra da Mantiqueira',
      meta: 'Cap. 03 ✈️',
      color: 'bg-cyan-50',
      description: 'O frio aconchegante da serra, o chocolate quente cremoso e aquela fogueira que serviu de palco para promessas de amor eterno.'
    }
  ];

  return (
    <section className="space-y-20 pt-24 border-t-[4px] border-black max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-10">
        <div className="space-y-6">
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="font-sans text-[11px] uppercase font-black tracking-[0.3em] text-black flex items-center gap-4 bg-rose-400 border-[3px] border-black w-fit px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_#000]"
          >
            <Star className="w-5 h-5 fill-white" strokeWidth={3} />
            Cronologia do Amor
          </motion.span>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-black leading-none uppercase">
            Nossa <br/> <span className="bg-white px-3 border-[4px] border-black inline-block mt-2">História</span>
          </h2>
          <p className="font-sans text-xl text-black/60 font-bold max-w-2xl leading-tight">
            Cada capítulo registrado com sinceridade, para que possamos revisitar nosso começo sempre que o coração pedir.
          </p>
        </div>
        <Link 
          to="/historia" 
          className="group font-sans text-xs font-black uppercase tracking-widest text-white py-6 px-12 bg-black border-[4px] border-black hover:bg-stone-900 transition-all rounded-3xl shadow-[8px_8px_0px_0px_#000] flex items-center gap-4 w-fit hover:-translate-y-1 active:translate-y-1 active:shadow-none"
        >
          Explorar Biografia <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-8">
        {chapters.map((chapter, idx) => (
          <motion.div 
            key={chapter.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border-[4px] border-black p-10 shadow-[10px_10px_0px_0px_#000] rounded-[2.5rem] space-y-8 hover:-translate-y-3 transition-all duration-500 relative group"
          >
            <div className={`absolute right-8 top-8 font-sans text-[10px] font-black uppercase text-black/40 tracking-widest`}>
              {chapter.meta}
            </div>
            
            <div className="w-20 h-20 rounded-3xl bg-[#fcf9f2] border-[3px] border-black flex items-center justify-center text-4xl group-hover:scale-110 transition-all shadow-[4px_4px_0px_0px_#000]">
              {chapter.emoji}
            </div>

            <div className="space-y-6">
              <h4 className="font-sans font-black text-3xl tracking-tighter text-black uppercase leading-none">
                {chapter.title}
              </h4>
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-3 font-sans text-[10px] font-black uppercase bg-emerald-400 border-[2.5px] border-black text-black px-4 py-2 rounded-xl w-fit shadow-[3px_3px_0px_0px_#000]">
                  <MapPin className="w-4 h-4" /> {chapter.location}
                </div>
                <div className="inline-flex items-center gap-3 font-sans text-[10px] font-black uppercase bg-amber-400 border-[2.5px] border-black text-black px-4 py-2 rounded-xl w-fit shadow-[3px_3px_0px_0px_#000]">
                  <Clock className="w-4 h-4" /> Memória Eterna
                </div>
              </div>
            </div>

            <p className="font-sans text-lg text-black/60 font-bold leading-tight">
              {chapter.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
