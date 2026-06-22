import React from 'react';
import { History, Sparkles, Wand2 } from 'lucide-react';

interface HistoryHeaderProps {
  totalMoments: number;
}

export function HistoryHeader({ totalMoments }: HistoryHeaderProps) {
  return (
    <div className="bg-white border-[5px] border-black p-8 md:p-12 rounded-[3.5rem] shadow-[15px_15px_0px_0px_#000] flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative overflow-hidden group">
      {/* Decorative Background Element */}
      <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
        <History className="w-80 h-80 rotate-12 text-black" />
      </div>

      <div className="space-y-6 relative z-10">
        <div className="inline-flex items-center gap-3 bg-[#ff90e8] border-[3px] border-black px-6 py-2 rounded-2xl shadow-[4px_4px_0px_0px_#000] -rotate-1">
          <Wand2 className="w-5 h-5 text-black animate-bounce" strokeWidth={3} />
          <span className="text-[11px] font-black text-black uppercase tracking-[0.2em] italic">
            Crônicas do Coração
          </span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] italic rotate-[-1deg] text-black">
          Nossa <br /> <span className="bg-cyan-400 px-4 border-[5px] border-black inline-block mt-2">Jornada</span> Épica
        </h1>
        <p className="max-w-2xl text-black/60 font-bold text-lg md:text-xl leading-tight uppercase tracking-tight">
          De cada palavra sussurrada a cada aventura, aqui jaz o manuscrito sagrado do nosso amor. 
          Escrito com a alma, selado com o tempo.
        </p>
      </div>

      {/* Quick Stats - Mini Bento Sidebar */}
      <div className="grid grid-cols-2 gap-6 shrink-0 w-full md:w-auto relative z-10">
        <div className="bg-amber-400 border-[4px] border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_#000] rotate-2 flex flex-col items-center justify-center min-w-[140px] hover:rotate-0 transition-transform">
          <span className="text-5xl font-black text-black">{totalMoments}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-black/60 mt-1">Capítulos</span>
        </div>
        <div className="bg-black border-[4px] border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_#ff90e8] -rotate-3 flex flex-col items-center justify-center min-w-[140px] hover:rotate-0 transition-transform">
          <div className="flex gap-1 mb-2">
            <Sparkles className="w-6 h-6 text-[#ff90e8] fill-[#ff90e8]" strokeWidth={3} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Infinito</span>
        </div>
      </div>
    </div>
  );
}
