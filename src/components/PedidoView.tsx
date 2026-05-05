import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../contexts/MusicContext';

export type ProposalVariant = "emotional" | "playful" | "cinematic" | "interactive" | "minimal" | "dramatic";

// Import all variants
import { EmotionalProposal } from './pedido/EmotionalProposal';
import { PlayfulProposal } from './pedido/PlayfulProposal';
import { CinematicProposal } from './pedido/CinematicProposal';
import { InteractiveProposal } from './pedido/InteractiveProposal';
import { MinimalProposal } from './pedido/MinimalProposal';
import { DramaticProposal } from './pedido/DramaticProposal';

export const PedidoView = ({ onAccept, themeMode, THEMES, proposalMode = 'auto' }: any) => {
  const currentTheme = THEMES && THEMES[themeMode] ? THEMES[themeMode] : null;
  const category = currentTheme?.category || 'romance';
  
  const { playTrack } = useMusic();

  useEffect(() => {
    // Play proposal music specifically when entering the proposal view
    playTrack({
      id: 'proposal_music',
      title: 'O Momento',
      artist: 'Rádio Astral Especial',
      source: 'local',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=piano-moment-9835.mp3',
      lyrics: [
        { time: 5, text: "Este é o momento..." },
        { time: 10, text: "Tudo o que vivemos nos trouxe até aqui." },
        { time: 15, text: "Cada risada..." },
        { time: 20, text: "Cada lágrima..." },
        { time: 25, text: "E o que eu mais quero agora..." }
      ]
    });
  }, [playTrack]);

  let activeMode = proposalMode;

  if (!activeMode || activeMode === 'auto') {
     switch (category) {
        case 'cinema': activeMode = 'cinematic'; break;
        case 'gamer': activeMode = 'interactive'; break;
        case 'dev': activeMode = 'playful'; break;
        case 'nature': activeMode = 'minimal'; break;
        case 'special': activeMode = 'dramatic'; break;
        case 'romance':
        default: activeMode = 'emotional'; break;
     }
  }

  const renderProposal = () => {
     switch (activeMode) {
       case 'playful': return <PlayfulProposal onAccept={onAccept} themeMode={themeMode} />;
       case 'cinematic': return <CinematicProposal onAccept={onAccept} themeMode={themeMode} />;
       case 'interactive': return <InteractiveProposal onAccept={onAccept} themeMode={themeMode} />;
       case 'minimal': return <MinimalProposal onAccept={onAccept} themeMode={themeMode} />;
       case 'dramatic': return <DramaticProposal onAccept={onAccept} themeMode={themeMode} />;
       case 'emotional':
       default: return <EmotionalProposal onAccept={onAccept} themeMode={themeMode} />;
     }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto overflow-x-hidden custom-scrollbar bg-[var(--bg)] text-[var(--fg)] min-h-screen">
       <div className="min-h-full flex flex-col justify-start">
          <AnimatePresence mode="wait">
             <motion.div key={activeMode} className="flex-1 flex flex-col min-h-screen">
                {renderProposal()}
             </motion.div>
          </AnimatePresence>
       </div>
    </div>
  );
};
