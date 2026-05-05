import React from 'react';
import { RomanticMenu } from './menus/RomanticMenu';
import { CinematicMenu } from './menus/CinematicMenu';
import { GameMenu } from './menus/GameMenu';
import { DevMenu } from './menus/DevMenu';
import { MinimalMenu } from './menus/MinimalMenu';

export type UserMenuVariant = "romantic" | "cinematic" | "game" | "dev" | "minimal";

export const UserMenuResolver = (props: any) => {
  const { layoutMode, themeMode, THEMES } = props;
  const currentTheme = THEMES && THEMES[themeMode] ? THEMES[themeMode] : null;
  const category = currentTheme?.category || 'romance';

  let activeMenu: UserMenuVariant = 'romantic';

  switch (layoutMode) {
    case 'holographic-ui':
    case 'cinema-scroll':
    case 'archive-view':
    case 'paper-scroll':
    case 'aura-flow':
    case 'ritual-circle':
    case 'energy-pulse':
    case 'liquid-layout':
    case 'glitch-grid':
    case 'interactive-chaos':
      activeMenu = 'cinematic';
      break;
    case 'game-hud':
    case 'rhythm-flow':
    case 'beat-grid':
      activeMenu = 'game';
      break;
    case 'dev-terminal':
    case 'dashboard-pro':
    case 'kanban-flow':
    case 'analytics-grid':
      activeMenu = 'dev';
      break;
    case 'zen-minimal':
    case 'letter-layout':
    case 'blur-focus':
      activeMenu = 'minimal';
      break;
    case 'romantic-center':
    case 'premium-showcase':
    case 'timeline-story':
    case 'emotion-scroll':
    case 'memory-stack':
    case 'travel-diary':
    case 'postcard-layout':
    case 'map-explorer':
    case 'wave-layout':
      activeMenu = 'romantic';
      break;
    default:
      switch (category) {
        case 'cinema':
        case 'special':
        case 'spiritual':
        case 'experimental':
        case 'classic':
          activeMenu = 'cinematic';
          break;
        case 'gamer':
        case 'music':
          activeMenu = 'game';
          break;
        case 'dev':
        case 'corporate':
          activeMenu = 'dev';
          break;
        case 'nature':
          activeMenu = 'minimal';
          break;
        case 'romance':
        case 'emotion':
        case 'travel':
        default:
          activeMenu = 'romantic';
          break;
      }
      break;
  }

  const renderMenu = () => {
    switch (activeMenu) {
      case 'cinematic': return <CinematicMenu {...props} />;
      case 'game': return <GameMenu {...props} />;
      case 'dev': return <DevMenu {...props} />;
      case 'minimal': return <MinimalMenu {...props} />;
      case 'romantic':
      default: return <RomanticMenu {...props} />;
    }
  };

  return renderMenu();
};
