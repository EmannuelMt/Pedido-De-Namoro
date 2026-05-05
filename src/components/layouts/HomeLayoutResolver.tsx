import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RomanticHomeLayout } from './RomanticHomeLayout';
import { CinematicHomeLayout } from './CinematicHomeLayout';
import { GameHomeLayout } from './GameHomeLayout';
import { DevHomeLayout } from './DevHomeLayout';
import { NatureHomeLayout } from './NatureHomeLayout';
import { TimelineStoryLayout } from './TimelineStoryLayout';
import { HolographicUILayout } from './HolographicUILayout';
import { PremiumShowcaseLayout } from './PremiumShowcaseLayout';

export type LayoutType = 
  | 'auto' | 'romantic-center' | 'timeline-story' | 'game-hud' | 'dev-terminal' 
  | 'cinema-scroll' | 'zen-minimal' | 'holographic-ui' | 'premium-showcase'
  | 'aura-flow' | 'ritual-circle' | 'energy-pulse'
  | 'memory-stack' | 'emotion-scroll' | 'blur-focus'
  | 'dashboard-pro' | 'kanban-flow' | 'analytics-grid'
  | 'liquid-layout' | 'glitch-grid' | 'interactive-chaos'
  | 'rhythm-flow' | 'wave-layout' | 'beat-grid'
  | 'paper-scroll' | 'letter-layout' | 'archive-view'
  | 'postcard-layout' | 'travel-diary' | 'map-explorer';

export const HomeLayoutResolver = (props: any) => {
  const { themeMode, THEMES, layoutMode } = props;
  const currentTheme = THEMES[themeMode] || THEMES.luxury;
  const category = currentTheme.category;

  let activeLayout = layoutMode as LayoutType;
  // Handle legacy layout modes
  if (['romantic', 'cinematic', 'game', 'dev', 'nature'].includes(activeLayout)) {
     activeLayout = 'auto';
  }

  if (!activeLayout || activeLayout === 'auto') {
    switch (category) {
      case 'cinema': activeLayout = 'cinema-scroll'; break;
      case 'gamer': activeLayout = 'game-hud'; break;
      case 'dev': activeLayout = 'dev-terminal'; break;
      case 'nature': activeLayout = 'zen-minimal'; break;
      case 'special': activeLayout = 'holographic-ui'; break;
      case 'spiritual': activeLayout = 'aura-flow'; break;
      case 'emotion': activeLayout = 'emotion-scroll'; break;
      case 'corporate': activeLayout = 'dashboard-pro'; break;
      case 'experimental': activeLayout = 'glitch-grid'; break;
      case 'music': activeLayout = 'rhythm-flow'; break;
      case 'classic': activeLayout = 'archive-view'; break;
      case 'travel': activeLayout = 'postcard-layout'; break;
      case 'romance':
      default:
         if (['moonlight_date', 'sunset_glow'].includes(themeMode)) {
            activeLayout = 'timeline-story';
         } else if (['eternal_gold'].includes(themeMode)) {
            activeLayout = 'premium-showcase';
         } else {
            activeLayout = 'romantic-center';
         }
         break;
    }
  }

  const renderLayout = () => {
    switch (activeLayout) {
      case 'cinema-scroll':
      case 'archive-view':
      case 'paper-scroll':
        return <CinematicHomeLayout {...props} />;
      case 'game-hud':
      case 'rhythm-flow':
      case 'beat-grid':
        return <GameHomeLayout {...props} />;
      case 'dev-terminal':
      case 'dashboard-pro':
      case 'kanban-flow':
      case 'analytics-grid':
        return <DevHomeLayout {...props} />;
      case 'zen-minimal':
      case 'letter-layout':
      case 'blur-focus':
        return <NatureHomeLayout {...props} />;
      case 'timeline-story':
      case 'emotion-scroll':
      case 'memory-stack':
      case 'travel-diary':
        return <TimelineStoryLayout {...props} />;
      case 'holographic-ui':
      case 'aura-flow':
      case 'ritual-circle':
      case 'energy-pulse':
      case 'liquid-layout':
      case 'glitch-grid':
      case 'interactive-chaos':
        return <HolographicUILayout {...props} />;
      case 'premium-showcase':
        return <PremiumShowcaseLayout {...props} />;
      case 'romantic-center':
      case 'postcard-layout':
      case 'map-explorer':
      case 'wave-layout':
      default:
        return <RomanticHomeLayout {...props} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeLayout}
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.02, filter: 'blur(5px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        {renderLayout()}
      </motion.div>
    </AnimatePresence>
  );
};

