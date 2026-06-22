import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, UserCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function CtaSection() {
  return (
    <section className="max-w-7xl mx-auto mt-24 mb-32">
      <div className="bg-black border-[5px] border-black text-white p-12 md:p-24 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden rounded-[4rem] group transition-all duration-700 hover:-translate-y-2">
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <motion.div 
            whileInView={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="inline-flex items-center gap-4 px-8 py-3 bg-white border-[3px] border-black text-black font-sans text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-[4px_4px_0px_0px_rgba(255,144,232,1)]"
          >
            <Star size={20} className="fill-black" strokeWidth={3} /> 
            Contrato Vitalício 
            <Star size={20} className="fill-black" strokeWidth={3} />
          </motion.div>
          
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-white uppercase">
            O Futuro é <br/>
            <span className="bg-[#ff90e8] text-black px-4 border-[5px] border-black inline-block mt-4 rotate-1">Sempre Nosso</span>
          </h2>
          
          <p className="font-sans text-xl md:text-2xl font-black max-w-3xl mx-auto text-white/40 leading-tight py-4 uppercase">
            Se cada dia é uma pequena chance de te amar mais, cada página deste diário é o testemunho de que você é meu final feliz.
          </p>

          <div className="pt-8 flex flex-col lg:flex-row justify-center items-center gap-10 font-sans font-black uppercase tracking-widest text-xs">
            <Link 
              to="/pedido" 
              className="w-full lg:w-auto px-12 py-8 bg-white text-black rounded-[2rem] border-[4px] border-black hover:bg-rose-100 transition-all shadow-[8px_8px_0px_0px_#ff90e8] flex items-center justify-center gap-4 group/btn hover:-translate-y-1 active:translate-y-1 active:shadow-none"
            >
                <Heart className="w-7 h-7 fill-rose-500 text-rose-500 group-hover/btn:scale-110 transition-transform" strokeWidth={3} /> Reafirmar Meu Sim
            </Link>
            <Link 
              to="/painel?tab=geral" 
              className="w-full lg:w-auto px-12 py-8 bg-stone-900 text-white rounded-[2rem] border-[4px] border-stone-800 hover:bg-stone-800 transition-all flex items-center justify-center gap-4"
            >
                <UserCircle className="w-7 h-7 text-stone-500" strokeWidth={3} /> Painel de Controle
            </Link>
            <Link 
              to="/jogos" 
              className="w-full lg:w-auto group flex items-center gap-4 text-white/40 font-black hover:text-white transition-colors"
            >
              Mini Games <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" strokeWidth={3} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
