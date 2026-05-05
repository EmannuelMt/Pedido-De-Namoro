import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Trophy, Target, Shield, Zap } from 'lucide-react';

export const GameHomeLayout = ({ setView, SHARED_GAMES, GALLERY_DATA }: any) => {
  return (
    <div className="relative w-full min-h-screen bg-[var(--bg)] text-[var(--text)] font-mono overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] z-0" />
      
      <div className="relative z-10 px-6 sm:px-12 py-24 max-w-7xl mx-auto flex flex-col items-center">
         
         {/* Top HUD */}
         <div className="w-full flex justify-between items-center mb-24 border-b-2 border-[var(--primary)]/30 pb-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-[var(--primary)] text-black flex items-center justify-center font-bold text-xl rounded">P2</div>
               <div>
                  <p className="text-xs text-[var(--primary)] uppercase tracking-widest">Player 1 & 2</p>
                  <div className="h-2 w-32 bg-[var(--primary)]/20 mt-1 rounded"><div className="h-full w-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)] rounded" /></div>
               </div>
            </div>
            <div className="text-right">
               <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">Score / XP</p>
               <p className="text-2xl font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.5)]">999,999</p>
            </div>
         </div>

         {/* Hero Header */}
         <div className="text-center mb-32 relative">
            <motion.div 
               animate={{ opacity: [0.5, 1, 0.5] }} 
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -inset-10 bg-[var(--primary)]/10 blur-3xl rounded-full z-0 pointer-events-none" 
            />
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-4 drop-shadow-[0_0_20px_var(--primary-glow)]">
               Player <span className="text-[var(--primary)]">1</span>
            </h1>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-[var(--text-muted)] italic">
               Ready.
            </h2>
         </div>

         {/* Mission Select Grid */}
         <div className="w-full">
            <h3 className="text-xl text-[var(--primary)] uppercase tracking-widest mb-8 border-l-4 border-[var(--primary)] pl-4 flex items-center gap-4">
               <Target size={24} /> Select Mission
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <button onClick={() => setView('jogos')} className="group border-2 border-[var(--primary)] bg-[var(--primary)]/5 p-8 relative overflow-hidden text-left hover:bg-[var(--primary)] hover:text-black transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><Gamepad2 size={48} /></div>
                  <h4 className="text-3xl font-black uppercase tracking-tighter mb-2 group-hover:text-black">Arcade</h4>
                  <p className="text-sm font-bold text-[var(--primary)] group-hover:text-black/70 uppercase">Mini-games & Stats</p>
                  <p className="text-xs mt-8 opacity-60">Jogos Desbloqueados: {SHARED_GAMES?.length || 0}</p>
               </button>

               <button onClick={() => setView('historia')} className="group border-2 border-white/10 bg-white/5 p-8 relative overflow-hidden text-left hover:border-[var(--primary)] hover:shadow-[0_0_30px_var(--primary-glow)] transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><Trophy size={48} /></div>
                  <h4 className="text-3xl font-black uppercase tracking-tighter mb-2">Campaign</h4>
                  <p className="text-sm text-[var(--text-muted)] uppercase">Main Storyline</p>
                  <p className="text-xs mt-8 text-white/40">Progresso contínuo...</p>
               </button>

               <button onClick={() => setView('galeria')} className="group border-2 border-white/10 bg-white/5 p-8 relative overflow-hidden text-left hover:border-[var(--primary)] hover:shadow-[0_0_30px_var(--primary-glow)] transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><Shield size={48} /></div>
                  <h4 className="text-3xl font-black uppercase tracking-tighter mb-2">Inventory</h4>
                  <p className="text-sm text-[var(--text-muted)] uppercase">Photos & Memories</p>
                  <p className="text-xs mt-8 text-white/40">Itens: {GALLERY_DATA?.length || 0}</p>
               </button>
            </div>
         </div>

         {/* Boss Fight CTA */}
         <div className="w-full mt-32 border border-rose-500/30 bg-rose-500/5 p-12 text-center relative overflow-hidden">
            <Zap size={100} className="absolute left-0 top-1/2 -translate-y-1/2 text-rose-500/10 -translate-x-1/2" />
            <Zap size={100} className="absolute right-0 top-1/2 -translate-y-1/2 text-rose-500/10 translate-x-1/2" />
            <h3 className="text-3xl font-black uppercase tracking-tighter text-rose-400 mb-6 flex justify-center items-center gap-4">
               ⚠️ Special Event ⚠️
            </h3>
            <button onClick={() => setView('pedido')} className="px-12 py-4 bg-rose-500 text-white font-black text-xl uppercase tracking-widest border-b-4 border-rose-700 hover:translate-y-1 hover:border-b-0 transition-all">
               Desbloquear Surpresa
            </button>
         </div>

      </div>
    </div>
  );
};
