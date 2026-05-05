import React from 'react';
import { motion } from 'motion/react';
import { Hexagon, Lock, Cpu, Globe } from 'lucide-react';

export const HolographicUILayout = ({ setView }: any) => {
  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans overflow-hidden relative perspective-1000">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      
      {/* Orb Ambient */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,var(--primary-glow)_0%,transparent_50%)] opacity-30 pointer-events-none z-0 mix-blend-screen" />

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-8">
         <motion.div 
            initial={{ rotateX: 60, scale: 0.8, opacity: 0 }}
            animate={{ rotateX: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
            className="backdrop-blur-3xl bg-[var(--primary)]/5 border border-[var(--primary)]/30 p-12 md:p-24 rounded-3xl shadow-[0_0_100px_var(--primary-glow)] text-center relative"
         >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-50 rounded-3xl pointer-events-none" />
            
            <Globe className="mx-auto mb-8 text-[var(--primary)] animate-pulse" size={64} strokeWidth={1} />
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)] mb-6 drop-shadow-[0_0_15px_var(--primary-glow)]">
               Project: Love
            </h1>
            <p className="text-xl font-mono tracking-widest uppercase text-[var(--text-muted)] mb-12">
               Holographic Interface Active
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { id: 'perfil', icon: <Cpu />, label: 'SYSTEM' },
                 { id: 'jogos', icon: <Hexagon />, label: 'MODULES' },
                 { id: 'galeria', icon: <Globe />, label: 'RECORDS' },
                 { id: 'pedido', icon: <Lock />, label: 'TOP_SECRET' }
               ].map((item) => (
                 <button
                   key={item.id}
                   onClick={() => setView(item.id)}
                   className="group p-6 bg-white/5 border border-[var(--primary)]/20 hover:border-[var(--primary)] hover:bg-[var(--primary)]/20 transition-all rounded-xl relative overflow-hidden"
                 >
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                   <div className="flex flex-col items-center gap-4">
                      <div className="text-[var(--primary)] drop-shadow-[0_0_5px_var(--primary-glow)]">{item.icon}</div>
                      <span className="font-mono text-xs tracking-widest">{item.label}</span>
                   </div>
                 </button>
               ))}
            </div>
         </motion.div>
      </div>
    </div>
  );
};
