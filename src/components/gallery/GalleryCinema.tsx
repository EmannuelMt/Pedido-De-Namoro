import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Music, 
  Sparkles,
  Heart,
  Calendar,
  MapPin
} from 'lucide-react';
import { Memory } from '../../types';

interface CinemaModeProps {
  memories: Memory[];
  currentIndex: number;
  isPlaying: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onTogglePlay: () => void;
}

export function GalleryCinema({
  memories,
  currentIndex,
  isPlaying,
  onClose,
  onNext,
  onPrev,
  onTogglePlay
}: CinemaModeProps) {
  const current = memories[currentIndex];
  if (!current) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col overflow-hidden"
    >
      {/* Cinematic Background (Blurred/Darkened Image) */}
      <div className="absolute inset-0 opacity-20 blur-2xl scale-110 pointer-events-none">
        <img src={current.imageUrl} className="w-full h-full object-cover" alt="Cinema BG" />
      </div>

      {/* Header Controls */}
      <div className="relative z-10 flex items-center justify-between p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-500 border-[3px] border-white rounded-2xl flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.5)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white text-xl font-black uppercase italic tracking-tighter">Cine Amor Particular</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Recordando {currentIndex + 1} de {memories.length}</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="text-white hover:text-rose-500 transition-colors p-3 bg-white/5 rounded-full hover:bg-white/10"
        >
          <X className="w-8 h-8" strokeWidth={4} />
        </button>
      </div>

      {/* Main Movie Screen */}
      <div className="flex-1 relative flex items-center justify-center p-4 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div 
            key={current.id}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-5xl aspect-video md:aspect-[21/9] bg-stone-900 border-[6px] border-white/10 rounded-[48px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative group"
          >
            <img 
              src={current.imageUrl} 
              className="w-full h-full object-cover"
              alt="Scene"
            />
            
            {/* Cinematic Overlay UI */}
            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pt-32">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: 'auto' }}
                     className="bg-rose-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg overflow-hidden whitespace-nowrap"
                   >
                     {current.category}
                   </motion.div>
                   {current.songTitle && (
                     <div className="flex items-center gap-2 text-white/50 bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                        <Music className="w-3 h-3 text-amber-500" strokeWidth={3} />
                        {current.songTitle}
                     </div>
                   )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
                    {current.title}
                  </h3>
                  <div className="flex items-center gap-8 text-[12px] font-black uppercase tracking-widest text-stone-400 font-mono">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-rose-500" /> {current.date}</span>
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" /> {current.location}</span>
                  </div>
                </div>

                <p className="text-lg md:text-xl text-white/80 font-bold leading-relaxed max-w-3xl italic">
                  "{current.feeling}"
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute inset-x-12 flex justify-between pointer-events-none">
          <button 
            onClick={onPrev}
            className="pointer-events-auto p-6 bg-white/5 hover:bg-white/10 border-2 border-white/10 text-white rounded-full transition-all group active:scale-95"
          >
            <ChevronLeft className="w-10 h-10 group-hover:-translate-x-2 transition-transform" strokeWidth={4} />
          </button>
          <button 
            onClick={onNext}
            className="pointer-events-auto p-6 bg-white/5 hover:bg-white/10 border-2 border-white/10 text-white rounded-full transition-all group active:scale-95"
          >
            <ChevronRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" strokeWidth={4} />
          </button>
        </div>
      </div>

      {/* Progress Bar & Playback Controls */}
      <div className="relative z-10 p-12 bg-black">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="flex flex-col items-center gap-8">
            <button 
              onClick={onTogglePlay}
              className="w-24 h-24 bg-white hover:bg-rose-500 hover:text-white text-black border-[4px] border-black rounded-full flex items-center justify-center transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] active:translate-y-1 active:shadow-none cursor-pointer"
            >
              {isPlaying ? <Pause className="w-10 h-10" fill="currentColor" /> : <Play className="w-10 h-10" fill="currentColor" />}
            </button>

            {/* Scrubber */}
            <div className="w-full space-y-3">
              <div className="h-2 bg-white/10 border-2 border-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / memories.length) * 100}%` }}
                  className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]"
                />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-500">
                <span>CENA {currentIndex + 1}</span>
                <span>TOTAL {memories.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
