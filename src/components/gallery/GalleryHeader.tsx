import React from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { Memory } from '../../types';

interface GalleryHeaderProps {
  memories: Memory[];
}

export function GalleryHeader({ memories }: GalleryHeaderProps) {
  const totalLikes = memories.reduce((acc, m) => acc + (m.likes || 0), 0);
  const totalMemories = memories.filter(m => m.story.length > 0).length;

  return (
    <div className="bg-white border-[6px] border-black p-10 md:p-14 rounded-[4rem] shadow-[24px_24px_0px_0px_#000] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 relative overflow-hidden group">
      {/* Decorative Background Element */}
      <div className="absolute -top-16 -right-16 opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:rotate-45">
        <Camera className="w-[400px] h-[400px] text-black" />
      </div>

      <div className="space-y-8 relative z-10">
        <div className="inline-flex items-center gap-3 bg-[#4ade80] border-[4px] border-black px-6 py-2.5 rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] -rotate-2">
          <Sparkles className="w-5 h-5 text-black animate-pulse" />
          <span className="text-xs font-black text-black uppercase tracking-[0.2em] italic">
            Mural de Recordações
          </span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] italic -rotate-1 transform-gpu">
          Nosso Jardim <br /> <span className="bg-[#ff90e8] px-5 py-2 border-[5px] border-black inline-block mt-4 rotate-2 shadow-[10px_10px_0px_0px_#000]">Eterno</span>
        </h1>
        <p className="max-w-xl text-black/40 font-black text-lg md:text-xl leading-snug uppercase tracking-tight italic">
          Cada pixel guardado aqui é uma semente que floresce no nosso álbum de aventuras. 
        </p>
      </div>

      {/* Stats Cards - Bento Style Sidebar inside header */}
      <div className="grid grid-cols-2 gap-6 shrink-0 w-full xl:w-auto relative z-10 pt-4">
        <div className="bg-[#fcf9f2] border-[4px] border-black p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_#000] rotate-2 flex flex-col items-center justify-center min-w-[160px] hover:-rotate-1 transition-transform">
          <span className="text-5xl font-black text-black">{memories.length}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mt-1">Frames</span>
        </div>
        <div className="bg-black border-[4px] border-black p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_#ff90e8] -rotate-3 flex flex-col items-center justify-center min-w-[160px] hover:rotate-1 transition-transform">
          <span className="text-5xl font-black text-white">{totalMemories}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">Histórias</span>
        </div>
        <div className="bg-[#ff90e8] border-[4px] border-black p-8 rounded-[2.5rem] shadow-[10px_10px_0px_0px_#000] -rotate-1 col-span-2 flex items-center justify-center gap-6 hover:scale-105 transition-transform">
          <span className="text-5xl font-black text-black">❤️ {totalLikes}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">Momentos de Amor</span>
        </div>
      </div>
    </div>
  );
}
