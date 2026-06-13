import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Music, Plus, Play, Pause, ArrowLeft, Trash2, X, Search, Disc, Heart, MailOpen } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [showLetter, setShowLetter] = useState(false);
  
  useEffect(() => {
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

  const handlePlayTrack = (track: MusicTrack) => {
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
  };

  const filteredPlaylist = playlist.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTrack = playlist.find(t => t.id === selectedTrackId);

  return (
    <div className="min-h-screen bg-[#050505] text-white/90 flex flex-col font-sans selection:bg-[var(--primary)] selection:text-white relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[var(--primary)]/10 rounded-full blur-[150px] mix-blend-screen" />
         <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
         <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-8 md:py-12 gap-6 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <button 
            onClick={() => onNavigate('home')}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group shrink-0"
          >
            <ArrowLeft size={20} className="text-white/70 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-col">
             <h1 className="text-3xl md:text-4xl font-editorial italic font-bold tracking-tight text-white drop-shadow-md">
               Vitrine Musical
             </h1>
             <span className="text-xs uppercase font-mono tracking-[0.3em] text-[var(--primary)] mt-1">A Trilha Sonora da Nossa História</span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="relative group hidden sm:block">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[var(--primary)] transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--primary)]/50 focus:bg-white/10 transition-all placeholder:text-white/30"
            />
          </div>
          <button 
            onClick={() => { audioManager.playSound('click'); onAddMusic(); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-transparent border-2 border-[var(--primary)]/50 text-[var(--primary)] font-medium rounded-full text-sm hover:bg-[var(--primary)]/10 hover:border-[var(--primary)] transition-all uppercase tracking-widest font-mono shrink-0"
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>
      </header>

      {/* Main Showcase Grid */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 relative z-10 top-0">
        
        {filteredPlaylist.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mb-6 bg-white/5 shadow-inner">
                <Music size={32} className="text-white/20" />
              </div>
              <h2 className="text-2xl font-editorial italic text-white/70 mb-2">Acervo Vazio</h2>
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Nenhuma faixa encontrada na vitrine.</p>
           </div>
        ) : (
           <div className="w-full relative py-12 flex flex-col gap-8 md:gap-12">
             
             {/* Left Sound Wave SVG */}
             <div className="absolute top-0 bottom-0 left-4 md:left-12 w-[60px] pointer-events-none opacity-30 select-none hidden md:block">
                <svg width="100%" height="100%" preserveAspectRatio="none">
                   {/* Static squiggly wave */}
                   <path 
                     d={`M 30 0 ${Array(50).fill(0).map((_, i) => {
                        const y = i * 200;
                        return `C 60 ${y + 50}, 0 ${y + 100}, 30 ${y + 150} S 60 ${y + 200}, 30 ${y + 250}`;
                     }).join(' ')}`}
                     fill="none"
                     stroke="var(--primary)"
                     strokeWidth="1"
                     strokeDasharray="4 4"
                     vectorEffect="non-scaling-stroke"
                   />

                   <motion.path 
                     d={`M 30 0 ${Array(50).fill(0).map((_, i) => {
                        const y = i * 200;
                        return `C 60 ${y + 50}, 0 ${y + 100}, 30 ${y + 150} S 60 ${y + 200}, 30 ${y + 250}`;
                     }).join(' ')}`}
                     fill="none"
                     stroke="var(--primary)"
                     strokeWidth="3"
                     style={{ pathLength }}
                     vectorEffect="non-scaling-stroke"
                   />
                </svg>
             </div>

             {filteredPlaylist.map((track, i) => {
                const isCurrent = currentTrack?.id === track.id;
                const delay = (i % 5) * 0.1;
                
                return (
                  <div key={track.id} className="w-full flex md:justify-start relative justify-center md:pl-[120px]">
                     
                     {/* Node Dot for Desktop */}
                     <div className="absolute top-1/2 left-[46px] md:left-[104px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-[var(--primary)] z-20 hidden md:flex items-center justify-center shadow-[0_0_10px_var(--primary)]">
                        {isCurrent && isPlaying && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse" />}
                     </div>

                  <motion.div 
                    layoutId={`card-container-${track.id}`}
                    className={`group relative cursor-pointer flex flex-col md:flex-row p-6 rounded-3xl w-full transition-all hover:scale-[1.01] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] border ${isCurrent ? 'bg-[var(--primary)]/5 border-[var(--primary)]/30' : 'bg-[#111]/50 border-white/5 hover:bg-white/5 backdrop-blur-sm'}`}
                    onClick={() => {
                        audioManager.playSound('click');
                        setSelectedTrackId(track.id);
                    }}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay, duration: 0.5, ease: 'easeOut' }}
                  >
                     
                     {/* Compact Cover Art (Capa) */}
                     <motion.div 
                        layoutId={`vinyl-sleeve-${track.id}`}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border border-white/10 shadow-lg overflow-hidden relative bg-black flex items-center justify-center transform-gpu z-10 mb-5 md:mb-0 md:mr-8 shrink-0"
                     >
                        <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent z-10" />
                        <Disc size={32} className="text-white/20 z-0" />
                        
                        {/* Mini Vinyl peeking out on hover */}
                        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full bg-black border border-[#222] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center group-hover:translate-x-4">
                            <div className="w-1/3 aspect-square rounded-full bg-[var(--primary)]/30" />
                        </div>
                     </motion.div>

                     {/* Track Info */}
                     <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                         <motion.h3 layoutId={`title-${track.id}`} className="text-xl md:text-2xl font-editorial italic font-bold text-white mb-2 truncate group-hover:text-[var(--primary)] transition-colors">
                            {track.name}
                         </motion.h3>
                         <motion.p layoutId={`artist-${track.id}`} className="text-xs md:text-sm uppercase tracking-widest text-white/50 font-mono truncate mb-4">
                            {track.artist}
                         </motion.p>
                         
                         <p className="text-sm md:text-base text-white/70 italic line-clamp-2 opacity-80 leading-relaxed font-editorial max-w-3xl">
                            "{track.reason}"
                         </p>
                     </div>
                     
                     {/* Active Indicator */}
                     {isCurrent && isPlaying && (
                         <div className="absolute top-8 right-8 z-20 flex gap-1 items-end h-4">
                            <motion.div animate={{ height: [4, 12, 4] }} transition={{ duration: 1, repeat: Infinity }} className="w-1 bg-[var(--primary)] rounded-full" />
                            <motion.div animate={{ height: [8, 16, 8] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1 bg-[var(--primary)] rounded-full" />
                            <motion.div animate={{ height: [6, 10, 6] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1 bg-[var(--primary)] rounded-full" />
                         </div>
                     )}

                  </motion.div>
                 </div>
                );
             })}
           </div>
        )}

        {/* Ending styling */}
        {filteredPlaylist.length > 0 && (
           <div className="w-full flex flex-col items-center mt-10 mb-20 relative text-center">
              <div className="h-16 w-px bg-gradient-to-b from-[var(--primary)] to-transparent" />
              <h3 className="mt-8 font-editorial italic text-3xl text-white/40">A Trilha Sonora Continua...</h3>
              <p className="mt-2 text-xs font-mono uppercase tracking-[0.3em] text-white/20">{filteredPlaylist.length} Peças no Acervo</p>
           </div>
        )}
      </main>

      {/* Expanded Track Modal */}
      <AnimatePresence>
        {selectedTrack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 overflow-hidden"
          >
             {/* Background Layer: Blurred Photo Concept representing the memory */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.8 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=2000')`, filter: 'blur(40px) brightness(0.2)' }}
             />
             <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

             <button 
               onClick={() => {
                 setSelectedTrackId(null);
                 setShowLetter(false);
               }}
               className="absolute top-6 right-6 md:top-12 md:right-12 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors z-[60] bg-black/50 backdrop-blur-md"
             >
               <X size={20} />
             </button>

             {/* Expanded Card Structure */}
             <motion.div 
               layoutId={`card-container-${selectedTrack.id}`}
               className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-24 relative p-6 md:p-12 h-[100dvh] md:h-[80vh] md:max-h-[850px] overflow-y-auto hide-scrollbar pt-24 md:pt-12 items-start rounded-none md:rounded-[2.5rem] bg-[#050505] md:bg-[#0a0a0a]/80 md:backdrop-blur-3xl md:border md:border-white/10 md:shadow-[0_40px_100px_-20px_rgba(0,0,0,1)]"
             >
               {/* Left: Huge Vinyl / Cover art representation */}
               <div className="w-full md:w-1/2 flex items-center justify-center top-0 md:sticky md:h-[calc(80vh-6rem)] md:max-h-[calc(850px-6rem)] shrink-0 z-20">
                   <motion.div 
                      layoutId={`vinyl-sleeve-${selectedTrack.id}`}
                      className="w-full max-w-[300px] md:max-w-[400px] xl:max-w-[450px] aspect-square relative rounded-xl border border-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,1)] bg-[#0a0a0a] overflow-hidden flex-shrink-0 flex items-center justify-center"
                   >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--primary)]/20 via-transparent to-transparent z-10" />
                      
                      {/* The actual giant disc */}
                      <motion.div 
                        animate={{ rotate: currentTrack?.id === selectedTrack.id && isPlaying ? 360 : 0 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="w-[85%] aspect-square rounded-full bg-black border border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(0,0,0,1)] overflow-hidden relative flex items-center justify-center z-20"
                      >
                         <div className="absolute inset-0 rounded-full" style={{ background: 'repeating-radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px)' }} />
                         
                         {/* Label */}
                         <div className="w-[35%] aspect-square rounded-full bg-gradient-to-br from-[var(--primary)]/40 to-black backdrop-blur-sm border-2 border-[#111] flex items-center justify-center overflow-hidden relative">
                             <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                             <div className="w-4 h-4 rounded-full bg-[#111] border border-white/10 z-10 shadow-inner" />
                         </div>

                         {/* Reflection sweep */}
                         <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent w-[50%] h-[200%] origin-bottom-right opacity-20 mix-blend-overlay pointer-events-none" />
                      </motion.div>

                      {/* Play Action Button inside Modal */}
                      <motion.button
                         initial={{ opacity: 0, scale: 0.8 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ delay: 0.3 }}
                         onClick={() => {
                           if (currentTrack?.id === selectedTrack.id) {
                               togglePlayPause();
                           } else {
                               handlePlayTrack(selectedTrack);
                           }
                         }}
                         className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-30 w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-[0_0_30px_var(--primary)] hover:scale-105 transition-transform"
                      >
                         {currentTrack?.id === selectedTrack.id && isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                      </motion.button>

                   </motion.div>
               </div>

               {/* Right: The Meaning & Info */}
               <div className="w-full md:w-1/2 flex flex-col justify-center text-left relative pb-32 md:pb-0 shrink-0 md:shrink md:py-8 md:min-h-[calc(80vh-6rem)] md:max-h-max">
                  <AnimatePresence mode="wait">
                    {!showLetter ? (
                      <motion.div
                         key="info"
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                         transition={{ delay: 0.2, duration: 0.6 }}
                      >
                         <motion.p layoutId={`artist-${selectedTrack.id}`} className="text-sm md:text-base uppercase tracking-[0.4em] text-[var(--primary)] font-mono mb-4">
                            {selectedTrack.artist}
                         </motion.p>
                         <motion.h3 layoutId={`title-${selectedTrack.id}`} className="text-4xl md:text-6xl font-editorial italic font-bold text-white mb-10 drop-shadow-lg leading-tight">
                            {selectedTrack.name}
                         </motion.h3>

                         <div className="flex gap-3 mb-10 overflow-x-auto hide-scrollbar">
                           <span className="shrink-0 px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                             <Heart size={12} /> {(selectedTrack as any).emotion || 'Sentimento'}
                           </span>
                           <span className="shrink-0 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-mono uppercase tracking-widest">
                             Ouvida em {(selectedTrack as any).firstListened || '2024'}
                           </span>
                         </div>

                         <div className="relative border-l border-[var(--primary)]/30 pl-8 md:pl-12 py-4 mb-10">
                            <span className="absolute -left-3 top-0 w-6 h-px bg-[var(--primary)]/50" />
                            <span className="absolute -left-3 bottom-0 w-6 h-px bg-[var(--primary)]/50" />
                            
                            <h4 className="text-xs uppercase tracking-[0.2em] text-white/30 font-mono mb-6">Por que essa música é especial?</h4>
                            
                            <p className="text-xl md:text-2xl text-white/90 leading-[1.8] font-editorial" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)"}}>
                               "{selectedTrack.reason}"
                            </p>
                         </div>

                         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t border-white/10 pt-8 mt-4">
                            <button 
                               onClick={() => setShowLetter(true)}
                               className="px-6 py-3 rounded-full bg-white text-black font-medium text-sm flex items-center gap-2 hover:bg-white/90 transition-colors shadow-xl"
                            >
                               <MailOpen size={16} /> Carta Sobre Essa Música
                            </button>

                            {onDeleteMusic && (
                               <button 
                                 onClick={(e) => { 
                                   e.stopPropagation(); 
                                   onDeleteMusic(selectedTrack.id);
                                   setSelectedTrackId(null);
                                 }}
                                 className="flex items-center gap-2 text-sm text-red-400/50 hover:text-red-400 font-mono uppercase tracking-widest transition-colors"
                               >
                                 <Trash2 size={16} /> Remover
                               </button>
                            )}
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div
                         key="letter"
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         className="h-full flex flex-col"
                      >
                         <button 
                            onClick={() => setShowLetter(false)}
                            className="text-white/50 hover:text-white flex items-center gap-2 text-xs uppercase font-mono tracking-widest mb-8 transition-colors self-start"
                         >
                            <ArrowLeft size={14} /> Voltar para Música
                         </button>
                         
                         <div className="bg-[#fcf9f2] rounded-md p-8 md:p-12 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.25] mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8dcc6] rounded-full blur-[40px] opacity-50" />
                            
                            <h4 className="text-xs uppercase tracking-[0.3em] text-[#8b4513]/50 font-semibold mb-8 font-mono border-b border-[#8b4513]/10 pb-4">
                               Carta Aberta
                            </h4>
                            
                            <div className="text-lg md:text-xl text-[#3e2723] leading-loose font-editorial italic relative z-10" style={{ textShadow: "1px 1px 0 rgba(255,255,255,0.7)"}}>
                               "Toda vez que escuto essa melodia, eu volto no tempo.<br/><br/>
                               Como se o mundo lá fora parasse e fôssemos apenas nós dois novamente.<br/><br/>
                               {(selectedTrack as any).secretLetter || 'É difícil colocar em palavras exatamente o que sinto quando essa música toca. Ela marca um capítulo nosso que eu não quero esquecer nunca.'}"
                            </div>

                            <div className="mt-12 flex justify-end">
                               <div className="text-xs uppercase tracking-widest text-[#8b4513]/40 font-mono">
                                  Guardado com carinho
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


