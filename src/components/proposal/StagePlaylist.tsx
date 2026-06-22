import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, Music, Heart, ArrowRight } from 'lucide-react';

interface StageProps {
  onNext: () => void;
}

interface CoupleTrack {
  title: string;
  artist: string;
  lyrics: string;
  meaning: string;
  color: string;
}

const MEMORY_PLAYLIST: CoupleTrack[] = [
  {
    title: 'Yellow',
    artist: 'Coldplay',
    lyrics: "Look at the stars, look how they shine for you, and all the things that you do...",
    meaning: 'Nos lembra das primeiras noites calmas conversando sobre sonhos e de como tudo ao seu redor brilha mais forte.',
    color: '#f9c74f'
  },
  {
    title: 'Stand by Me',
    artist: 'Ben E. King',
    lyrics: "No, I won't be afraid, just as long as you stand, stand by me...",
    meaning: 'Representa a nossa lealdade. Juntos enfrentamos qualquer tempestade intergaláctica que aparecer.',
    color: '#f94144'
  },
  {
    title: 'My Girl',
    artist: 'The Temptations',
    lyrics: "I've got sunshine on a cloudy day, when it's cold outside, I've got the month of May...",
    meaning: 'Você é o sol dos meus dias nublados, aquecendo meu casaco no inverno de forma inexplicável.',
    color: '#43aa8b'
  }
];

export const StagePlaylist: React.FC<StageProps> = ({ onNext }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);

  const activeTrack = MEMORY_PLAYLIST[currentTrackIdx];

  const handleNextTrack = () => {
    setCurrentTrackIdx(prev => (prev + 1) % MEMORY_PLAYLIST.length);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#fcf5e9] overflow-y-auto py-12 px-4 select-none flex flex-col justify-between" id="stage-playlist">
      <div className="absolute inset-0 bg-[#f4ebdc]/50 bg-[radial-gradient(#f9c74f_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Header element */}
      <div className="z-10 text-center max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border-2 border-black rounded-full text-amber-700 text-[10px] font-black uppercase tracking-widest font-mono shadow-[2px_2px_0px_#000]">
          🎵 ETAPA 05 — NOSSA SINTONIA
        </span>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#4A3B3B] mt-2 font-sans">
          Estética: Music Universe
        </h2>
      </div>

      {/* Player Frame UI */}
      <div className="w-full max-w-4xl mx-auto my-auto z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center px-4 sm:px-8">
        
        {/* Left column: Cartoon Vinyl Turntable Disc */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-[#1a1a1a] rounded-full border-[8px] border-[#333] shadow-[8px_8px_0px_rgba(74,59,59,1)] flex items-center justify-center overflow-hidden">
            
            {/* Spinning Groove lines */}
            <div className="absolute inset-4 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/5" />
            <div className="absolute inset-16 rounded-full border border-white/5" />
            <div className="absolute inset-24 rounded-full border border-white/10" />

            {/* Glowing theme center label sticker */}
            <motion.div 
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="w-24 h-24 rounded-full border-4 border-black shadow-inner flex flex-col items-center justify-center text-center p-2"
              style={{ backgroundColor: activeTrack.color || '#ff7b89' }}
            >
              <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
              <span className="text-[7px] font-black uppercase text-black tracking-wider leading-none mt-1 select-none truncate max-w-[65px]">
                {activeTrack.title}
              </span>
            </motion.div>

            {/* Tone arm slider needle overlay */}
            <div className="absolute top-0 right-4 w-12 h-20 origin-top rotate-[15deg] pointer-events-none transition-transform z-35 bg-transparent">
              <div className="w-1.5 h-16 bg-[#aaa] border border-black rounded-full relative">
                <div className="absolute bottom-0 -left-1.5 w-4 h-4 bg-[#777] border border-black rounded-sm" />
              </div>
            </div>
          </div>

          {/* Player core control buttons bar */}
          <div className="mt-6 flex items-center gap-4 bg-white border-3 border-black px-6 py-2.5 rounded-2xl shadow-[3px_3px_0px_#000]">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-xl border-2 border-black transition-transform active:scale-95 ${
                isPlaying ? 'bg-red-200 text-black' : 'bg-green-200'
              }`}
            >
              {isPlaying ? <Pause size={14} className="stroke-[3px]" /> : <Play size={14} className="stroke-[3px]" />}
            </button>
            
            <button 
              onClick={handleNextTrack}
              className="p-2 bg-stone-100 hover:bg-stone-200 border-2 border-black rounded-xl transition-transform active:scale-95"
              title="Próxima faixa"
            >
              <SkipForward size={14} />
            </button>

            <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#4A3B3B] block">
              {isPlaying ? '• REPRODUZINDO' : '• PAUSADO'}
            </span>
          </div>
        </div>

        {/* Right column: Album Details & Lyrics meanings card */}
        <div className="md:col-span-7 bg-white border-3 border-black p-6 rounded-3xl shadow-[5px_5px_0px_rgba(74,59,59,1)] space-y-4">
          <div className="pb-3 border-b-2 border-dashed border-stone-200 flex items-center justify-between">
            <div>
              <span className="inline-block bg-[#ffccd5] border border-black text-[#e84e4e] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                FAIXA ESPECIAL {currentTrackIdx + 1}/3
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase leading-tight mt-1">
                {activeTrack.title}
              </h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                {activeTrack.artist}
              </p>
            </div>
            <Music className="w-7 h-7 text-[#ff7b89] animate-bounce" />
          </div>

          {/* Highlighted text lyrics */}
          <div className="bg-amber-50 border-2 border-black p-4 rounded-xl relative overflow-hidden">
            <span className="absolute top-1 right-2 text-[8px] font-mono font-black uppercase text-amber-500">LETRA</span>
            <p className="text-xs sm:text-sm font-semibold font-serif italic text-amber-950 leading-relaxed pt-2.5">
              &ldquo;{activeTrack.lyrics}&rdquo;
            </p>
          </div>

          {/* Meaning review comment box */}
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-black uppercase tracking-wider text-stone-400">Significado para nós</span>
            <p className="text-xs text-stone-700 leading-relaxed font-semibold bg-stone-50 border-2 border-black p-3.5 rounded-xl">
              ❤️ {activeTrack.meaning}
            </p>
          </div>
        </div>
      </div>

      {/* Footer trigger button block */}
      <div className="z-10 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#4A3B3B] hover:bg-black text-white border-2 border-black font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-[4px_4px_0px_#ffccd5] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          DESBRAVAR OS DESAFIOS 🎮 <ArrowRight className="w-4 h-4 text-amber-300" />
        </motion.button>
      </div>
    </div>
  );
};
