import React from 'react';
import { FloatingSidebar } from './sidebar/FloatingSidebar';
import { CinematicSidebar } from './sidebar/CinematicSidebar';
import { GameSidebar } from './sidebar/GameSidebar';
import { DevSidebar } from './sidebar/DevSidebar';
import { MinimalSidebar } from './sidebar/MinimalSidebar';

export type SidebarVariant = "floating" | "cinematic" | "game" | "dev" | "minimal";

export const SidebarResolver = ({ currentView, onNavigate, layoutMode, themeMode, THEMES }: any) => {
  const currentTheme = THEMES && THEMES[themeMode] ? THEMES[themeMode] : null;
  const category = currentTheme?.category || 'romance';

  let activeSidebar: SidebarVariant = 'floating';

  // O layout dita o comportamento primário da interface
  switch (layoutMode) {
    case 'holographic-ui':
    case 'cinema-scroll':
      activeSidebar = 'cinematic';
      break;
    case 'game-hud':
      activeSidebar = 'game';
      break;
    case 'dev-terminal':
      activeSidebar = 'dev';
      break;
    case 'zen-minimal':
      activeSidebar = 'minimal';
      break;
    case 'romantic-center':
    case 'premium-showcase':
    case 'timeline-story':
      activeSidebar = 'floating';
      break;
    default:
      // Fallback para a categoria do tema se o layout for "auto"
      switch (category) {
        case 'cinema':
        case 'special':
          activeSidebar = 'cinematic';
          break;
        case 'gamer':
          activeSidebar = 'game';
          break;
        case 'dev':
          activeSidebar = 'dev';
          break;
        case 'nature':
          activeSidebar = 'minimal';
          break;
        case 'romance':
        default:
          activeSidebar = 'floating';
          break;
      }
      break;
  }

  const renderSidebar = () => {
    switch (activeSidebar) {
      case 'cinematic': return <CinematicSidebar currentView={currentView} onNavigate={onNavigate} />;
      case 'game': return <GameSidebar currentView={currentView} onNavigate={onNavigate} />;
      case 'dev': return <DevSidebar currentView={currentView} onNavigate={onNavigate} />;
      case 'minimal': return <MinimalSidebar currentView={currentView} onNavigate={onNavigate} />;
      case 'floating':
      default: return <FloatingSidebar currentView={currentView} onNavigate={onNavigate} />;
    }
  };

  return renderSidebar();
};
