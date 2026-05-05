import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../contexts/MusicContext';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Maximize2, Minimize2 } from 'lucide-react';

export const GlobalMusicPlayer = ({ themeMode }: { themeMode: string }) => {
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, prevTrack, currentLyric, currentTime, duration, seek, volume, setVolume } = useMusic();
  const [expanded, setExpanded] = useState(false);

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isRomantic = themeMode === 'romantic' || themeMode === 'luxury';
  const isGamer = themeMode === 'retro_gamer' || themeMode === 'retro';
  const isDev = themeMode === 'sci_fi_tech' || themeMode === 'sci_fi';

  return (
    <>
      {/* Immersive Lyrics Overlay when Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[400] flex flex-col items-center justify-center p-8 backdrop-blur-3xl ${
              isRomantic ? 'bg-black/70' : isGamer ? 'bg-blue-950/80' : isDev ? 'bg-black/95' : 'bg-black/80'
            }`}
          >
            <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
            
            <div className="absolute top-8 right-8 z-50">
              <button onClick={() => setExpanded(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-md border border-white/10 hover:scale-110">
                <Minimize2 size={24} />
              </button>
            </div>

            {/* Visualizer / Particles Placeholder */}
            {isRomantic && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    scale: isPlaying ? [1, 1.1, 1] : 1, 
                    opacity: isPlaying ? [0.1, 0.25, 0.1] : 0.05,
                    rotate: isPlaying ? [0, 90, 180, 270, 360] : 0 
                  }}
                  transition={{ 
                    scale: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
                    opacity: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
                    rotate: { repeat: Infinity, duration: 20, ease: 'linear' }
                  }}
                  className="w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] rounded-full bg-[var(--primary)] blur-[120px]"
                />
              </div>
            )}

            <div className={`relative z-10 w-full max-w-4xl text-center flex flex-col items-center justify-center min-h-[50vh]`}>
              {currentTrack.source === 'local' ? (
                <AnimatePresence mode="wait">
                  {currentLyric ? (
                    <motion.div
                      key={currentLyric}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 1.05 }}
                      transition={{ duration: 0.8 }}
                      className={`
                        ${isRomantic ? 'text-4xl md:text-6xl font-serif italic text-white text-[text-shadow:0_0_20px_var(--primary)]' : ''}
                        ${isGamer ? 'text-4xl md:text-5xl font-mono text-yellow-400 uppercase tracking-widest' : ''}
                        ${isDev ? 'text-2xl md:text-4xl font-mono text-green-400' : ''}
                        ${!isRomantic && !isGamer && !isDev ? 'text-3xl md:text-5xl font-bold text-white tracking-tight' : ''}
                        max-w-3xl leading-relaxed
                      `}
                    >
                      {isDev && <span className="opacity-50 mr-4">{`>`}</span>}
                      {currentLyric}
                      {isDev && <span className="animate-pulse ml-2">_</span>}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      className="text-white/30 font-serif italic text-2xl"
                    >
                      ...
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : (
                <div className="w-full max-w-2xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] bg-black/50 border border-white/10 flex items-center justify-center relative">
                  {currentTrack.source === 'youtube' ? (
                    <iframe
                      src={currentTrack.embedUrl}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <iframe
                      src={currentTrack.embedUrl}
                      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                      className="w-full h-full"
                      style={{ border: 0 }}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="absolute bottom-12 left-0 w-full px-8 md:px-24">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                {currentTrack.source === 'local' && (
                  <div className="flex-1 w-full flex items-center gap-4">
                    <span className="text-white/50 font-mono text-xs">{formatTime(currentTime)}</span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      seek(percent * duration);
                    }}>
                      <div className="h-full bg-[var(--primary)]" style={{ width: `${(currentTime / duration) * 100}%` }} />
                    </div>
                    <span className="text-white/50 font-mono text-xs">{formatTime(duration)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-6 mx-auto">
                  <button onClick={prevTrack} className="text-white/70 hover:text-white transition-all"><SkipBack size={24} /></button>
                  {currentTrack.source === 'local' && (
                    <button onClick={togglePlayPause} className="w-16 h-16 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-[var(--primary)]/30">
                      {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-1" />}
                    </button>
                  )}
                  <button onClick={nextTrack} className="text-white/70 hover:text-white transition-all"><SkipForward size={24} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Player */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-[300]"
          >
            <div className={`p-4 flex items-center gap-4 cursor-pointer
              ${isDev ? 'glass-card border-green-500/30 bg-black/90' : 'luxury-card'}
            `} onClick={(e) => {
              if ((e.target as HTMLElement).closest('button')) return;
              setExpanded(true);
            }}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                ${isPlaying ? 'bg-[var(--primary)] text-[var(--bg)] animate-pulse' : 'bg-white/10 text-white'}
              `}>
                <Music size={20} />
              </div>

              <div className="flex-1 min-w-[120px] max-w-[200px] overflow-hidden">
                <div className="whitespace-nowrap animate-marquee">
                  <span className={`font-bold text-sm ${isDev ? 'font-mono text-green-400' : 'text-white'}`}>{currentTrack.title}</span>
                </div>
                <p className={`text-[10px] truncate ${isDev ? 'font-mono text-green-400/50' : 'text-white/50'}`}>{currentTrack.artist}</p>
                {currentLyric && (
                  <p className="text-[9px] text-white/40 italic truncate mt-1">"{currentLyric}"</p>
                )}
              </div>

              <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                {currentTrack.source === 'local' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                    className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-all"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); nextTrack(); }}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all hidden sm:flex"
                >
                  <SkipForward size={16} />
                </button>
              </div>
              
              {currentTrack.source === 'local' && (
                <div className="absolute top-0 left-0 w-full h-0.5 bg-white/5 overflow-hidden rounded-t-3xl">
                   <div className="h-full bg-[var(--primary)] transition-all duration-300" style={{ width: `${(currentTime / duration) * 100}%` }} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
