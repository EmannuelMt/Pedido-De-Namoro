import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Heart, Compass, ArrowRight, Lock } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="w-full bg-[#ff90e8] px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-20 md:py-32 overflow-hidden relative border-b-[6px] border-black">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      
      {/* Dynamic Badge */}
      <div className="absolute top-12 right-12 hidden xl:flex items-center gap-3 bg-white border-[4px] border-black p-4 rounded-2xl shadow-[6px_6px_0px_0px_#000] rotate-2 font-sans text-xs font-black uppercase tracking-widest text-black z-20">
        <span className="w-4 h-4 bg-emerald-400 border-[3px] border-black rounded-full animate-pulse" />
        Sincronizados Agora
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-20 relative z-10">
        {/* Left Content */}
        <div className="flex flex-col items-start text-left max-w-2xl space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 bg-white border-[4px] border-black rounded-2xl p-2 pr-6 shadow-[6px_6px_0px_0px_#000]"
          >
            <span className="bg-[#ff90e8] border-[3px] border-black text-black text-[10px] px-4 py-2 rounded-xl font-black tracking-widest uppercase shadow-[3px_3px_0px_0px_#000]">
              v2.0
            </span>
            <p className="flex items-center gap-2 text-black font-black text-[12px] uppercase tracking-wider">
              Exploração Particular <Compass className="w-5 h-5 text-rose-500 animate-[spin_10s_linear_infinite]" strokeWidth={3} />
            </p>
          </motion.div>

          <div className="space-y-6">
            <h1 className="text-black text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
              Nosso <br/>
              <span className="bg-white border-[6px] border-black px-4 py-2 inline-block shadow-[10px_10px_0px_0px_#000] -rotate-1 mt-4">Espaço</span>
            </h1>
            <p className="max-w-lg text-xl text-black font-bold leading-tight pt-4">
              "Cada pixel deste santuário foi desenhado pensando no nosso 'felizes para sempre'."
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 w-full pt-4">
            <Link 
              to="/pedido" 
              className="px-10 py-6 bg-rose-500 hover:bg-rose-600 text-white border-[4px] border-black font-sans text-sm uppercase tracking-[0.2em] font-black rounded-3xl transition-all flex items-center gap-4 shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none"
            >
              Nossa Promessa <Heart className="w-6 h-6 fill-current text-current" strokeWidth={3} />
            </Link>
            <Link 
              to="/painel" 
              className="px-10 py-6 bg-white hover:bg-stone-100 text-black border-[4px] border-black font-sans text-sm uppercase tracking-[0.2em] font-black rounded-3xl transition-all flex items-center gap-4 shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none"
            >
              Portal <ArrowRight className="w-6 h-6 text-black" strokeWidth={3} />
            </Link>
          </div>
        </div>

        {/* Right Visual */}
        <div className="w-full max-w-lg lg:max-w-xl relative">
          <div className="absolute -inset-4 bg-indigo-400 rounded-[3rem] border-[4px] border-black rotate-3 opacity-100 -z-10 shadow-[10px_10px_0px_0px_#000]" />
          
          <div className="relative">
            <div className="absolute inset-0 bg-white border-[5px] border-black p-4 rounded-3xl shadow-[10px_10px_0px_0px_#000] transform -rotate-6 translate-x-6 translate-y-6 opacity-100 hover:rotate-0 transition-all duration-500" />

            <div className="bg-white border-[6px] border-black p-6 rounded-[2.5rem] shadow-[15px_15px_0px_0px_#000] relative z-10 transition-all duration-500 hover:scale-[1.02]">
              <div className="relative aspect-[4/3] bg-stone-100 border-[4px] border-black rounded-2xl overflow-hidden group">
                <img 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                  src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop" 
                  alt="Front Memory" 
                />
                
                <div className="absolute bottom-6 left-6 bg-white border-[4px] border-black py-3 px-6 text-[10px] font-black uppercase tracking-widest text-black rounded-2xl shadow-[6px_6px_0px_0px_#000] z-20 flex items-center gap-3">
                  <span className="w-3 h-3 bg-rose-500 rounded-full border-[2.5px] border-black animate-ping" />
                  Momento Sagrado
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
