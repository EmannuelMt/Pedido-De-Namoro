import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Headphones, SkipBack, SkipForward, Repeat, Shuffle as ShuffleIcon, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export function PlaylistSection() {
  return (
    <section className="space-y-20 pt-24 border-t-[4px] border-black max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-10">
        <div className="space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-sans text-[11px] uppercase font-black tracking-[0.3em] text-black flex items-center gap-4 bg-cyan-400 border-[3px] border-black w-fit px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_#000]"
          >
            <Headphones className="w-5 h-5 fill-white" strokeWidth={3} />
            Exclusive Sync
          </motion.span>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-black leading-none uppercase">
            Nossa <br/> <span className="bg-white px-3 border-[4px] border-black inline-block mt-2">Playlist</span>
          </h2>
          <p className="font-sans text-xl text-black/60 font-bold max-w-2xl leading-tight">
            A música é a linguagem que nosso coração usa para dizer o que as palavras não conseguem expressar sozinho.
          </p>
        </div>
        <Link 
          to="/musicas" 
          className="group font-sans text-xs font-black uppercase tracking-widest text-black py-6 px-12 bg-[#ff90e8] border-[4px] border-black hover:bg-[#ff7edb] transition-all rounded-3xl shadow-[8px_8px_0px_0px_#000] flex items-center gap-4 w-fit hover:-translate-y-1 active:translate-y-1 active:shadow-none"
        >
          Ouvir Nossa Mix <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" strokeWidth={3} />
        </Link>
      </div>

      {/* Modern Player Interface - Cartoonized */}
      <div className="bg-white border-[5px] border-black rounded-[3.5rem] p-10 md:p-16 text-black relative overflow-hidden shadow-[12px_12px_0px_0px_#000] group/player">
         
         <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-12 text-center sm:text-left">
               
               {/* Album Art */}
               <div className="w-56 h-56 bg-emerald-400 border-[4px] border-black rounded-[2rem] flex items-center justify-center relative shrink-0 shadow-[8px_8px_0px_0px_#000] overflow-hidden group/art">
                  <img 
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                    alt="Album Art"
                  />
                  <div className="absolute inset-x-6 bottom-6 bg-white border-[3px] border-black rounded-2xl p-4 flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                    <Play className="w-8 h-8 fill-black text-black" strokeWidth={3} />
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                    <span className="font-sans text-[10px] font-black uppercase tracking-[0.2em] bg-red-400 border-[2.5px] border-black text-black px-4 py-2 rounded-xl flex items-center gap-2 shadow-[3px_3px_0px_0px_#000]">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse border border-black" />
                      Live Now
                    </span>
                    <span className="font-sans text-[10px] font-black uppercase tracking-[0.2em] bg-stone-100 border-[2.5px] border-black text-black/40 px-4 py-2 rounded-xl">
                      Master Quality
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-sans font-black text-6xl md:text-8xl tracking-tighter leading-none text-black uppercase">
                      Perfect
                    </h3>
                    <p className="font-sans text-xl uppercase font-black text-black/40 flex items-center gap-4 justify-center sm:justify-start tracking-widest">
                      Ed Sheeran <span className="w-2 h-2 bg-black rounded-full" /> 2017
                    </p>
                  </div>
               </div>
            </div>

            {/* Visualizer - Cartoon style */}
            <div className="flex items-end justify-center gap-3 h-32 bg-[#fcf9f2] border-[4px] border-black p-8 rounded-[2.5rem] w-full lg:w-auto shadow-[6px_6px_0px_0px_#000]">
               {[20, 60, 80, 40, 70, 30, 50, 35, 15, 65, 45, 25, 55, 38, 75].map((h, i) => (
                  <motion.span 
                    key={i} 
                    animate={{ height: [h, h*0.2, h*0.8, h] }}
                    transition={{ repeat: Infinity, duration: 0.6 + Math.random(), ease: "easeInOut" }}
                    className="w-3 bg-black border-[1.5px] border-black rounded-full" 
                    style={{ height: `${h}px` }}
                  />
               ))}
            </div>
         </div>

         {/* Player Controls */}
         <div className="mt-16 pt-12 border-t-[4px] border-black/5 space-y-10 relative z-10">
           <div className="space-y-6">
              <div className="w-full bg-stone-200 border-[3.5px] border-black h-7 rounded-full overflow-hidden relative p-1 shadow-[4px_4px_0px_0px_#000]">
                 <div className="h-full bg-amber-400 rounded-full border-[1.5px] border-black" style={{ width: '42%' }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-[3px] border-black rounded-full shadow-[2px_2px_0px_0px_#000]" />
                 </div>
              </div>
              <div className="flex justify-between font-sans text-xs font-black text-black/40 tracking-[0.2em] uppercase">
                <span>02:14</span>
                <span className="text-black/20">Synced to Heartbeat</span>
                <span>04:23</span>
              </div>
           </div>

           <div className="flex items-center justify-center gap-12 lg:gap-16">
              <button className="text-black/40 hover:text-black transition-colors"><ShuffleIcon size={24} strokeWidth={3} /></button>
              <button className="text-black hover:scale-110 transition-transform"><SkipBack size={36} fill="currentColor" strokeWidth={3} /></button>
              <button className="w-24 h-24 bg-rose-400 border-[4px] border-black rounded-full flex items-center justify-center text-black shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">
                <Play size={40} fill="currentColor" strokeWidth={3} className="ml-2" />
              </button>
              <button className="text-black hover:scale-110 transition-transform"><SkipForward size={36} fill="currentColor" strokeWidth={3} /></button>
              <button className="text-black/40 hover:text-black transition-colors"><Repeat size={24} strokeWidth={3} /></button>
           </div>
         </div>
      </div>
    </section>
  );
}
