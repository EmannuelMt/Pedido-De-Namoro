import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Plus, Play, Info, Sparkles, Heart, ArrowRight, X, Trash2, Pause } from 'lucide-react';
import { PageLayout } from '../App';
import { audioManager } from '../lib/audioManager';
import { useMusic } from '../contexts/MusicContext';

export interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  reason: string;
  spotify: string;
  lyrics: string;
  likedBy?: string[];
}

export const PlaylistView = ({ 
  playlist, 
  user,
  onAddMusic,
  onNavigate,
  onDeleteMusic,
  onToggleFavorite
}: { 
  playlist: MusicTrack[];
  user: any;
  onAddMusic: () => void;
  onNavigate: (v: any) => void;
  onDeleteMusic?: (id: string) => void;
  onToggleFavorite?: (id: string, currentlyLiked: boolean) => void;
}) => {
  const { playTrack, currentTrack, isPlaying, togglePlayPause, setPlaylist: setGlobalPlaylist } = useMusic();

  useEffect(() => {
    // Sync the local DB playlist to the global music context
    const globalTracks = playlist.map(t => {
      let source: 'local' | 'spotify' | 'youtube' = 'local';
      let embedUrl = '';
      if (t.spotify?.includes('spotify.com')) {
        source = 'spotify';
        embedUrl = t.spotify.replace('open.spotify.com/', 'open.spotify.com/embed/');
      } else if (t.spotify?.includes('youtube.com') || t.spotify?.includes('youtu.be')) {
        source = 'youtube';
        const videoId = t.spotify.includes('youtu.be') ? t.spotify.split('/').pop()?.split('?')[0] : new URL(t.spotify).searchParams.get('v');
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      
      return {
        id: t.id,
        title: t.name,
        artist: t.artist,
        source: source,
        audioUrl: source === 'local' ? 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_f5a89f92fc.mp3?filename=ambient-piano-amp-strings-10711.mp3' : undefined,
        embedUrl,
        lyrics: t.lyrics ? t.lyrics.split('\n').filter(l => l.trim()).map((line, i) => ({ time: i * 5, text: line })) : undefined
      };
    });
    setGlobalPlaylist(globalTracks);
  }, [playlist, setGlobalPlaylist]);

  const handlePlayClick = (e: React.MouseEvent, track: MusicTrack) => {
    e.preventDefault();
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      let source: 'local' | 'spotify' | 'youtube' = 'local';
      let embedUrl = '';
      if (track.spotify?.includes('spotify.com')) {
        source = 'spotify';
        embedUrl = track.spotify.replace('open.spotify.com/', 'open.spotify.com/embed/');
      } else if (track.spotify?.includes('youtube.com') || track.spotify?.includes('youtu.be')) {
        source = 'youtube';
        const videoId = track.spotify.includes('youtu.be') ? track.spotify.split('/').pop()?.split('?')[0] : new URL(track.spotify).searchParams.get('v');
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }

      const globalTrack = {
        id: track.id,
        title: track.name,
        artist: track.artist,
        source: source,
        audioUrl: source === 'local' ? 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_f5a89f92fc.mp3?filename=ambient-piano-amp-strings-10711.mp3' : undefined,
        embedUrl,
        lyrics: track.lyrics ? track.lyrics.split('\n').filter(l => l.trim()).map((line, i) => ({ time: i * 5, text: line })) : undefined
      };
      playTrack(globalTrack);
    }
  };
  return (
    <PageLayout 
      title="Frequências de" 
      subtitle="Ressonância" 
      description="Nossa trilha sonora particular. Cada batida, um sentimento compartilhado."
      onNavigate={onNavigate}
      currentView="playlist"
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-20 pb-40">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 relative z-10">
           <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-8">
                <Music size={16} className="text-[var(--primary)] animate-pulse" />
                <span className="text-[var(--primary)] font-sans text-[11px] font-semibold uppercase tracking-[0.4em] opacity-80 decoration-[var(--primary)] underline-offset-4 line-through">Rádio Astral</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-editorial text-white tracking-tighter italic leading-[0.9] text-glow-premium drop-shadow-2xl">Batidas <br /><span className="text-[var(--primary)]/90 drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]">Partilhadas.</span></h2>
           </div>
           
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => { audioManager.playSound('toggle'); onAddMusic(); }}
             className="px-12 py-5 bg-white/5 backdrop-blur-md border border-[var(--primary)]/30 text-white rounded-full font-sans text-xs uppercase tracking-[0.3em] font-medium shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all flex items-center gap-4 group"
           >
             <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" /> Sintonizar Nova
           </motion.button>
        </div>

        {/* Track List */}
        <div className="space-y-8 relative z-10">
          {playlist.map((track, idx) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
              className="group relative luxury-card p-8 md:p-14 transition-all duration-700 flex flex-col md:flex-row items-center gap-10 lg:gap-14 overflow-hidden"
            >
               {/* Background Accent */}
               <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-[var(--primary)] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
               <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:opacity-10 transition-all duration-1000 group-hover:scale-110 drop-shadow-[0_0_20px_var(--primary)]">
                  <Music size={160} />
               </div>

               {/* Track Visual */}
               <div className="w-32 h-32 md:w-56 md:h-56 rounded-[2.5rem] bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-[var(--primary)]/50 transition-all duration-700 shrink-0 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay" />
                  <Music className="text-white/20 group-hover:text-[var(--primary)] transition-colors duration-700 drop-shadow-md" size={70} />
                  
                  <motion.div
                    onClick={(e) => handlePlayClick(e as any, track)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer backdrop-blur-sm"
                  >
                     <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-500">
                        {currentTrack?.id === track.id && isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="translate-x-1" />}
                     </div>
                  </motion.div>
               </div>

               {/* Track Info */}
               <div className="flex-1 text-center md:text-left relative w-full flex flex-col justify-center">
                  <div className="flex items-center justify-center md:justify-between w-full mb-6">
                     <div className="flex items-center gap-4">
                        <span className="text-[var(--primary)] font-sans text-[10px] uppercase tracking-[0.4em] opacity-80 font-bold">Frequência {(idx + 1).toString().padStart(2, '0')}</span>
                        <div className="w-12 h-[1px] bg-gradient-to-r from-[var(--primary)] to-transparent opacity-50" />
                     </div>
                     {onDeleteMusic && (
                        <button 
                           onClick={() => onDeleteMusic(track.id)}
                           className="md:absolute md:top-0 md:right-0 opacity-0 group-hover:opacity-100 p-3 text-white/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all duration-500"
                        >
                           <Trash2 size={20} />
                        </button>
                     )}
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-editorial text-white tracking-tight italic mb-3 leading-tight group-hover:text-glow-premium transition-all duration-700">
                    {track.name}
                  </h3>
                  
                  <p className="text-white/50 font-sans font-light text-xl md:text-2xl mb-8">por {track.artist}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-auto">
                     {onToggleFavorite && (
                        <button 
                          onClick={() => { 
                            audioManager.playSound('feedback');
                            onToggleFavorite(track.id, Boolean(user?.uid && track.likedBy?.includes(user?.uid)));
                          }}
                          className={`px-5 py-2.5 rounded-full border flex items-center gap-2 transition-all duration-500 ${user?.uid && track.likedBy?.includes(user?.uid) ? 'border-rose-500 bg-rose-500/15 text-rose-400 font-medium shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'border-white/10 text-white/40 hover:text-rose-400 hover:border-rose-400/50 hover:bg-rose-500/5 font-sans font-medium'}`}
                        >
                          <Heart size={16} fill={user?.uid && track.likedBy?.includes(user?.uid) ? 'currentColor' : 'none'} className="drop-shadow-md" />
                          <span className="text-sm">{(track.likedBy?.length || 0) > 0 ? track.likedBy?.length : ''}</span>
                        </button>
                     )}
                     <div className="px-6 py-2.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-white/40 font-sans font-light text-sm md:text-base flex items-center gap-3 group-hover:text-white/70 group-hover:border-white/20 transition-all duration-500 shadow-sm">
                        <Info size={16} className="opacity-50" />
                        {track.reason}
                     </div>
                  </div>
               </div>

               {/* Lyrics Preview / Accent */}
               {track.lyrics && (
                 <div className="hidden xl:flex flex-col justify-center w-80 text-right pr-6">
                    <p className="text-white/20 font-serif italic text-xl leading-relaxed line-clamp-3 group-hover:text-white/50 transition-colors duration-700 drop-shadow-sm relative">
                      <span className="absolute -top-6 -left-4 text-6xl text-white/5 font-serif">"</span>
                      {track.lyrics}
                    </p>
                 </div>
               )}
            </motion.div>
          ))}
        </div>

        {/* Call to action to continue */}
        <div className="mt-40 text-center">
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => onNavigate('cartas')}
             className="px-24 py-10 luxury-glass text-white border border-rose-500/10 rounded-[3rem] font-bold text-xs uppercase tracking-[0.5em] hover:bg-rose-600/20 hover:border-rose-500/40 transition-all shadow-extreme group"
           >
             Abrir o Coração <ArrowRight size={24} className="inline ml-6 group-hover:translate-x-3 transition-transform text-rose-500" />
           </motion.button>
        </div>
      </div>
    </PageLayout>
  );
};
