import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { FrameCustomization, ProfileFrame } from '../data/frames';
import { Heart, Sparkles, Trophy, ShieldAlert, BadgeCheck, Zap, Star, Cpu } from 'lucide-react';

interface AvatarWithFrameProps {
  src?: string;
  partnerSrc?: string; // Optional partner profile photo for connected couple frames
  frameId?: string | null;
  customization?: FrameCustomization;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarWithFrame({
  src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
  partnerSrc,
  frameId,
  customization,
  size = 'md',
  className
}: AvatarWithFrameProps) {
  // Size layout helpers
  const sizeMap = {
    xs: { container: 'w-10 h-10', border: 'border-2', avatarSize: 'w-[calc(100%-8px)] h-[calc(100%-8px)]', padding: 'p-1', partnerSize: 'w-4 h-4', shift: 'translate-x-2' },
    sm: { container: 'w-16 h-16', border: 'border-2', avatarSize: 'w-[calc(100%-12px)] h-[calc(100%-12px)]', padding: 'p-1.5', partnerSize: 'w-6 h-6', shift: 'translate-x-[15px]' },
    md: { container: 'w-28 h-28', border: 'border-[3px]', avatarSize: 'w-[calc(100%-16px)] h-[calc(100%-16px)]', padding: 'p-2', partnerSize: 'w-10 h-10', shift: 'translate-x-[24px]' },
    lg: { container: 'w-40 h-40', border: 'border-4', avatarSize: 'w-[calc(100%-24px)] h-[calc(100%-24px)]', padding: 'p-3', partnerSize: 'w-14 h-14', shift: 'translate-x-[35px]' },
    xl: { container: 'w-48 h-48', border: 'border-4', avatarSize: 'w-[calc(100%-32px)] h-[calc(100%-32px)]', padding: 'p-4', partnerSize: 'w-16 h-16', shift: 'translate-x-[42px]' }
  };

  const layout = sizeMap[size];

  // Default customization
  const activeCustom: FrameCustomization = {
    color: customization?.color || '#e84e4e',
    thickness: customization?.thickness || 'medium',
    effect: customization?.effect || 'none',
    transparency: customization?.transparency ?? 0
  };

  // Border thickness mapper
  const thicknessMap = {
    thin: 'border-2',
    medium: 'border-4',
    thick: 'border-8'
  };
  const borderThickness = thicknessMap[activeCustom.thickness];

  // Frame Transparency
  const frameOpacity = (100 - activeCustom.transparency) / 100;

  // Render overlay background/style per frameId
  const getFrameStyle = (): { gradientClass?: string; inlineStyle?: React.CSSProperties; decoration?: React.ReactNode } => {
    let gradientClass = '';
    let inlineStyle: React.CSSProperties = { opacity: frameOpacity };
    let decoration: React.ReactNode = null;

    if (!frameId || frameId === 'none') {
      return {};
    }

    // Interactive customization override color if provided
    const userColor = activeCustom.color;

    switch (frameId) {
      // --- BÁSICAS ---
      case 'silver':
        gradientClass = 'bg-gradient-to-tr from-slate-400 via-slate-100 to-slate-400 border-[#9ca3af]';
        break;
      case 'gold':
        gradientClass = 'bg-gradient-to-tr from-amber-600 via-yellow-105 to-amber-500 border-[#f59e0b]';
        break;
      case 'bronze':
        gradientClass = 'bg-gradient-to-tr from-[#914d1d] via-[#e5a676] to-[#7f411b]';
        break;
      case 'diamond':
        gradientClass = 'bg-gradient-to-tr from-cyan-400 via-sky-100 to-cyan-300';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 10px rgba(165, 243, 252, 0.6)' };
        break;
      case 'ruby':
        gradientClass = 'bg-gradient-to-tr from-rose-700 via-[#e84e4e] to-red-800';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 12px rgba(232, 78, 78, 0.5)' };
        break;
      case 'emerald':
        gradientClass = 'bg-gradient-to-tr from-emerald-700 via-emerald-355 to-green-700';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' };
        break;
      case 'sapphire':
        gradientClass = 'bg-gradient-to-tr from-blue-700 via-indigo-300 to-blue-800';
        break;
      // --- ROMANCE ---
      case 'coracoes':
        gradientClass = 'border-pink-400 bg-pink-955/20 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 10px rgba(244, 114, 182, 0.5)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 absolute -top-1 right-2 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 absolute -bottom-1 left-2 animate-pulse" />
            <motion.span 
              className="absolute text-[8px] top-6 left-1 text-pink-300"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💕
            </motion.span>
          </div>
        );
        break;
      case 'rosas':
        gradientClass = 'border-rose-700 bg-rose-955/20 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 12px rgba(225, 29, 72, 0.4)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 flex items-center justify-center">
            <span className="text-md absolute -top-2.5 left-1/2 -translate-x-1/2 filter drop-shadow">🌹</span>
            <span className="text-xs absolute -bottom-2 left-3 transform -rotate-12 filter drop-shadow">🌹</span>
            <span className="text-xs absolute -bottom-2 right-3 transform rotate-12 filter drop-shadow">🌹</span>
          </div>
        );
        break;
      case 'tulipas':
        gradientClass = 'border-amber-500 bg-amber-955/15 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="text-sm absolute -top-2.5 right-3 filter drop-shadow">🌷</span>
            <span className="text-sm absolute -bottom-2.5 left-3 filter drop-shadow">🌷</span>
            <span className="text-xs absolute top-1/2 -left-2 -translate-y-1/2 filter drop-shadow">🌷</span>
          </div>
        );
        break;
      case 'laco_vermelho':
        gradientClass = 'border-rose-600 bg-red-955/15 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 15px rgba(225, 29, 72, 0.5)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 flex flex-col justify-end items-center">
            <span className="text-2xl leading-none absolute -bottom-3 text-red-500 filter drop-shadow animate-pulse">🎀</span>
            <span className="absolute text-[8px] top-3 left-3 text-red-400 animate-ping">✨</span>
          </div>
        );
        break;
      case 'aliancas':
        gradientClass = 'bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-500 border-yellow-600 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 15px rgba(245, 158, 11, 0.6)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="text-lg absolute -top-3.5 left-1/2 -translate-x-1/2 filter drop-shadow animate-bounce">💍</span>
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -bottom-1 right-2 animate-pulse" />
          </div>
        );
        break;
      case 'ornate_gold':
        gradientClass = 'border-double border-[6px] border-amber-500 bg-amber-950/10';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 15px #f59e0b, inset 0 0 10px #f59e0b', borderRadius: '15% 85% 15% 85% / 15% 85% 15% 85%' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xl filter drop-shadow">⚜️</span>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-md filter drop-shadow">⚜️</span>
          </div>
        );
        break;
      case 'cyber_hex':
        gradientClass = 'border-4 border-cyan-400 bg-zinc-955/40';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 15px rgba(34, 211, 238, 0.8)', borderRadius: '20% 80% 20% 80% / 20% 80% 20% 80%' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="text-[7px] text-cyan-300 bg-cyan-950 px-1 border border-cyan-400 absolute -top-1.5 -right-1 font-mono rounded">HEX_01</span>
            <div className="absolute bottom-1 left-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
        );
        break;
      case 'soft_squircle':
        gradientClass = 'border-[5px] border-fuchsia-400 bg-fuchsia-955/20';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 15px rgba(217, 70, 239, 0.7)', borderRadius: '35% 65% 35% 65% / 35% 65% 35% 65%' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="text-[8px] absolute top-2 right-2 text-fuchsia-300 animate-pulse">✦</span>
            <Heart className="w-3.5 h-3.5 text-fuchsia-400 fill-fuchsia-500 absolute -bottom-1.5 -left-1 transform -rotate-12 animate-bounce" />
          </div>
        );
        break;
      case 'casal_love':
        gradientClass = 'border-pink-500 bg-pink-955/20 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 14px #ec4899', borderRadius: '48% 52% 50% 50% / 40% 45% 55% 60%' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 flex justify-between items-center h-full">
            <span className="absolute -top-1.5 left-2 animate-bounce">💕</span>
            <span className="absolute bottom-1.5 right-1 animate-pulse">❤️</span>
            <Heart size={14} className="text-white fill-pink-500 absolute -bottom-1.5 left-1.5" />
          </div>
        );
        break;

      // --- DESENVOLVEDOR ---
      case 'dev_react':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-2 pointer-events-none z-10 flex items-center justify-center">
              <div className="absolute inset-2 rounded-full border border-cyan-400/30" />
              <motion.svg 
                className="w-full h-full absolute opacity-80" 
                viewBox="0 0 100 100"
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              >
                <ellipse cx="50" cy="50" rx="46" ry="16" stroke="#22d3ee" strokeWidth="2.5" fill="none" transform="rotate(30, 50, 50)" />
                <ellipse cx="50" cy="50" rx="46" ry="16" stroke="#22d3ee" strokeWidth="2.5" fill="none" transform="rotate(90, 50, 50)" />
                <ellipse cx="50" cy="50" rx="46" ry="16" stroke="#22d3ee" strokeWidth="2.5" fill="none" transform="transform-rotate(150, 50, 50)" />
              </motion.svg>
              <motion.div 
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute top-0 left-1/2 -translate-x-1/2 shadow-lg shadow-cyan-400 border border-white animate-pulse" />
              </motion.div>
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[7px] bg-cyan-955 border border-cyan-400 text-cyan-400 px-1 font-mono font-black rounded uppercase tracking-wider shadow">
                REACT
              </span>
            </div>
          )
        };
      case 'dev_node':
        gradientClass = 'border-green-500 bg-[#1e293b]/60 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 12px rgba(34, 197, 94, 0.4)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="absolute bottom-0 right-0 bg-green-600 border border-green-400 text-white px-1 font-mono font-bold rounded-sm text-[8px] tracking-wide shadow-sm">NODE</span>
            <span className="absolute -top-1 left-2 text-[9px] text-green-400 font-mono animate-pulse">🌿</span>
          </div>
        );
        break;
      case 'dev_js':
        gradientClass = 'border-yellow-500 bg-yellow-955/15 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 14px rgba(234, 179, 8, 0.5)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="absolute bottom-0 right-0 bg-[#f7df1e] text-black font-sans text-[8px] font-black px-1.2 py-0.5 border border-black rounded-sm shadow-sm z-20">JS</span>
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-mono bg-slate-905 border border-yellow-500 text-yellow-500 px-1 rounded shadow-sm">ES6</span>
          </div>
        );
        break;
      case 'dev_ts':
        gradientClass = 'border-blue-500 bg-blue-955/15 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 14px rgba(59, 130, 246, 0.5)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="absolute bottom-0 right-0 bg-[#3178c6] text-white font-sans text-[8px] font-black px-1.2 py-0.5 border border-black rounded-sm shadow-sm z-20">TS</span>
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-mono bg-slate-905 border border-blue-500 text-blue-400 px-1 rounded shadow-sm">STRICT</span>
          </div>
        );
        break;
      case 'dev_html':
        gradientClass = 'border-orange-500 bg-orange-955/20 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 12px rgba(249, 115, 22, 0.4)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm scale-95 uppercase tracking-wide">HTML5</span>
            <span className="absolute bottom-1 left-2 text-[8px] font-mono text-orange-400">&lt;&gt;</span>
          </div>
        );
        break;
      case 'dev_css':
        gradientClass = 'border-blue-500 bg-blue-955/10 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm scale-95 uppercase tracking-wide">CSS3</span>
            <span className="absolute bottom-1 right-2 text-[7px] font-mono text-blue-400">#id</span>
          </div>
        );
        break;
      case 'dev_github':
        gradientClass = 'border-zinc-700 bg-zinc-950 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 12px rgba(63, 63, 70, 0.6)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg filter drop-shadow animate-pulse">🐱</span>
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[7px] font-mono bg-zinc-800 text-zinc-350 px-1 border border-zinc-700 rounded shadow animate-pulse">MAIN</span>
          </div>
        );
        break;
      case 'dev_terminal':
        gradientClass = 'border-emerald-500 bg-[#161616] border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 14px rgba(16, 185, 129, 0.5)' };
        decoration = (
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-black border border-emerald-500 text-[8px] text-emerald-400 font-mono px-2 py-0.5 rounded shadow whitespace-nowrap scale-90 tracking-wider">
            $ react-app --run
          </div>
        );
        break;
      case 'dev_matrix':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              <svg className="w-full h-full absolute" viewBox="0 0 100 100">
                <defs>
                  <filter id="matrix-glow">
                    <feGaussianBlur stdDeviation="2" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="50" cy="50" r="46" stroke="#22c55e" strokeWidth="4" strokeDasharray="3 3 10 3" fill="none" filter="url(#matrix-glow)" />
              </svg>
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <motion.div 
                  className="absolute text-[6px] text-green-400 font-mono font-bold"
                  animate={{ y: [-10, 30], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  style={{ top: 10, left: 16 }}
                >
                  1
                </motion.div>
                <motion.div 
                  className="absolute text-[6px] text-emerald-400 font-mono font-bold"
                  animate={{ y: [-15, 25], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.3, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                  style={{ top: 15, right: 18 }}
                >
                  0
                </motion.div>
                <motion.div 
                  className="absolute text-[5px] text-green-300 font-mono font-bold animate-pulse"
                  style={{ top: 10, left: '45%' }}
                >
                  []
                </motion.div>
              </div>
              <div className="absolute -bottom-1.5 bg-black border border-green-500 text-[7px] text-green-400 font-mono px-1.5 py-0.5 rounded leading-none font-bold uppercase tracking-widest scale-90">
                CODE
              </div>
            </div>
          )
        };
      case 'gamer_cyberpunk':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, transform: 'skewX(-2deg)' },
          decoration: (
            <div className="absolute -inset-2 pointer-events-none z-10 flex items-center justify-center">
              <svg className="w-full h-full absolute" viewBox="0 0 120 120">
                <defs>
                  <filter id="cyber-glow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path d="M 20 10 L 10 20 M 10 20 L 10 40" stroke="#facc15" strokeWidth="3" fill="none" filter="url(#cyber-glow)" />
                <path d="M 100 10 L 110 20 M 110 20 L 110 40" stroke="#22d3ee" strokeWidth="3" fill="none" filter="url(#cyber-glow)" />
                <path d="M 10 100 L 10 110 M 10 110 L 30 110" stroke="#22d3ee" strokeWidth="3" fill="none" filter="url(#cyber-glow)" />
                <path d="M 110 100 L 110 110 M 110 110 L 90 110" stroke="#e84e4e" strokeWidth="3" fill="none" filter="url(#cyber-glow)" />
              </svg>
              <div className="absolute inset-2 border-2 border-dashed border-cyan-400/30 rounded-full animate-pulse" />
              <div className="absolute inset-1.5 border border-yellow-400/50 rounded-full" />
              <span className="absolute -top-1.5 right-2 bg-yellow-400 text-black text-[7px] font-black tracking-wider px-1 font-mono rounded select-none uppercase shadow">2077</span>
              <div className="absolute -bottom-1 left-4 bg-cyan-950 border border-cyan-400 text-cyan-400 text-[6px] font-mono font-black tracking-widest px-1 uppercase scale-90">SYS_ERR</div>
            </div>
          )
        };
      case 'gamer_pixel':
        gradientClass = 'border-[6px] border-amber-900 bg-amber-955/30';
        inlineStyle = { ...inlineStyle, imageRendering: 'pixelated', boxShadow: '0 0 10px rgba(0,0,0,0.4)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 font-sans">
            <span className="absolute -top-2.5 left-1 translate-x-1 text-[9px] bg-amber-655 border border-black px-1 text-white font-mono rounded shadow">8-BIT</span>
            <span className="absolute -bottom-1 right-1 text-md filter drop-shadow">👾</span>
          </div>
        );
        break;
      case 'gamer_rpg':
        gradientClass = 'border-stone-600 bg-amber-900/10 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 12px rgba(120, 113, 108, 0.4)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 flex justify-between h-full w-full">
            <span className="absolute -top-3.5 left-1 text-lg filter drop-shadow-md rotate-12">⚔️</span>
            <span className="absolute -bottom-2 right-1 text-lg filter drop-shadow-md">🛡️</span>
          </div>
        );
        break;
      case 'gamer_fps':
        gradientClass = 'border-red-500 bg-red-955/20 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)' };
        decoration = (
          <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
            <div className="absolute inset-0 border border-red-500/40 rounded-full" />
            <div className="absolute inset-1.5 border border-dashed border-red-500/20 rounded-full animate-spin [animation-duration:30s]" />
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
            <span className="absolute -top-2 bg-red-600 px-1 border border-red-400 text-white text-[7px] font-mono font-bold rounded">HUD_LOCK</span>
          </div>
        );
        break;
      case 'gamer_arcade':
        gradientClass = 'border-fuchsia-500 bg-indigo-955/30 border-double border-[6px]';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 16px #d946ef, inset 0 0 8px #3b82f6' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 flex items-center justify-center">
            <span className="absolute -top-2 text-md filter drop-shadow text-yellow-300 font-sans">🕹️</span>
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-900 border border-fuchsia-500 text-fuchsia-400 text-[6px] font-mono px-1 font-bold rounded leading-none">INSERT COIN</span>
          </div>
        );
        break;
      case 'gamer_levelup':
        gradientClass = 'border-emerald-500 bg-emerald-950/25 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 15px #10b981' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 border border-emerald-300 text-white text-[8px] leading-none font-black px-1.5 py-1 rounded shadow z-20 animate-bounce">
              LVL UP 🚀
            </div>
            <span className="absolute top-1 right-2 text-[8px] text-emerald-300 animate-pulse">XP+99</span>
          </div>
        );
        break;
      // --- ANIME ---
      case 'anime_sakura':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              <div className="absolute inset-1.5 border border-pink-400/40 rounded-full" />
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <motion.div 
                  className="absolute text-[11px]"
                  animate={{ y: [-10, 40], x: [-5, 12], rotate: [0, 180], opacity: [0, 1, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ top: 2, left: 14 }}
                >
                  🌸
                </motion.div>
                <motion.div 
                  className="absolute text-[9px]"
                  animate={{ y: [-5, 45], x: [10, -8], rotate: [45, 225], opacity: [0, 0.9, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  style={{ top: 4, right: 12 }}
                >
                  🌸
                </motion.div>
              </div>
              <span className="text-pink-405 absolute -top-1.5 -right-0.5 animate-bounce">🌸</span>
              <span className="text-pink-300 absolute -bottom-1 -left-0.5 animate-pulse">🌸</span>
            </div>
          )
        };
      case 'anime_kawaii':
        gradientClass = 'border-rose-300 bg-pink-500/15 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 12px rgba(244, 63, 94, 0.4)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl filter drop-shadow animate-bounce">🐰</span>
            <span className="absolute -bottom-1.5 left-3 text-[10px] animate-pulse">✨</span>
            <span className="absolute -bottom-1.5 right-3 text-[10px] animate-pulse">⭐</span>
          </div>
        );
        break;
      case 'anime_neko':
        gradientClass = 'border-amber-500 bg-amber-955/20 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="absolute -top-[14px] -left-1.5 text-lg rotate-12 scale-x-[-1] filter drop-shadow">🐱</span>
            <span className="absolute -top-[14px] -right-1.5 text-lg -rotate-12 filter drop-shadow">🐱</span>
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-xs animate-bounce">🔔</span>
            <span className="absolute top-1/2 -left-2 -translate-y-1/2 text-[9px]">🐾</span>
            <span className="absolute top-1/2 -right-2 -translate-y-1/2 text-[9px]">🐾</span>
          </div>
        );
        break;
      case 'anime_spirit':
        gradientClass = 'border-purple-500 bg-slate-950 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 15px rgba(168, 85, 247, 0.7), inset 0 0 8px rgba(168, 85, 247, 0.4)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-sm filter drop-shadow animate-pulse">👻</span>
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
          </div>
        );
        break;

      // --- TECNOLOGIA ---
      case 'tec_circuit':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              <svg className="w-full h-full absolute" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" stroke="#fbbf24" strokeWidth="3.5" strokeDasharray="16 8 4 8" fill="none" />
                <path d="M 50 4 L 50 12" stroke="#fbbf24" strokeWidth="2.5" />
                <path d="M 54 12 L 64 12" stroke="#fbbf24" strokeWidth="2" />
                <path d="M 4 50 L 12 50" stroke="#fbbf24" strokeWidth="2.5" />
              </svg>
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[7px] bg-slate-909 border border-amber-500 font-mono text-amber-500 px-1 rounded font-bold uppercase tracking-wider">CHIP_v2</span>
              <Cpu className="w-4 h-4 text-amber-400 absolute -bottom-2 left-1/2 -translate-x-1/2 animate-pulse" />
            </div>
          )
        };
      case 'tec_ai':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-2 pointer-events-none z-10 flex items-center justify-center">
              <svg className="w-full h-full absolute" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="ai-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                  <filter id="ai-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                  </filter>
                </defs>
                <circle cx="50" cy="50" r="46" stroke="url(#ai-glow-grad)" strokeWidth="4.5" fill="none" />
                <circle cx="50" cy="50" r="46" stroke="#22d3ee" strokeWidth="9" fill="none" opacity="0.3" filter="url(#ai-glow)" />
              </svg>
              <Zap size={14} className="text-cyan-455 absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce fill-cyan-400" />
              <div className="absolute -bottom-1.5 bg-cyan-950 border border-indigo-400 px-1.5 py-0.5 rounded shadow text-[7px] text-indigo-300 font-mono font-black animate-pulse tracking-widest uppercase">
                COGNITIVE
              </div>
            </div>
          )
        };

      // --- PIXELREPO GAMES & DESIGNS ---
      case 'pixel_slime':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              {/* Outer retro pixel wood frame */}
              <div className="absolute inset-1.5 border-4 border-[#3f1c06] rounded-full" />
              <div className="absolute inset-[9px] border-2 border-[#854d0e]/60 rounded-full" />
              
              {/* Bouncing Slime bottom-right */}
              <motion.div 
                className="absolute bottom-[-2px] right-2 w-5 h-4 bg-green-500 rounded-t-lg flex flex-col items-center justify-center border-2 border-[#14532d] shadow-sm"
                animate={{ scaleY: [1, 0.7, 1.1, 1], y: [0, 2, -4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ originY: 1 }}
              >
                {/* Slime face */}
                <div className="flex gap-1.5 -mt-1">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  <span className="w-1 h-1 bg-black rounded-full" />
                </div>
                <div className="w-1.5 h-[1px] bg-red-400 rounded-full mt-0.5" />
              </motion.div>

              {/* Bouncing Slime top-left */}
              <motion.div 
                className="absolute top-[-3px] left-2 w-4.5 h-3.5 bg-emerald-400 rounded-t-lg flex flex-col items-center justify-center border-2 border-[#064e3b] shadow-sm"
                animate={{ scaleY: [1, 0.8, 1.15, 1], y: [0, 3, -5, 0] }}
                transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                style={{ originY: 1 }}
              >
                <div className="flex gap-1 -mt-1.5">
                  <span className="w-0.5 h-0.5 bg-black rounded-full" />
                  <span className="w-0.5 h-0.5 bg-black rounded-full" />
                </div>
              </motion.div>

              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[7px] font-mono bg-[#14532d] border border-green-400 text-green-300 px-1.5 rounded font-black shadow uppercase tracking-wide">SLIME</span>
            </div>
          )
        };

      case 'pixel_potion_hp':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              {/* Dark Gothic frame */}
              <div className="absolute inset-1.5 border-4 border-[#1e1b4b] rounded-full" />
              <div className="absolute inset-[9px] border-2 border-[#4338ca]/50 rounded-full" />
              
              {/* Steaming liquid particles */}
              <div className="absolute inset-0 overflow-hidden rounded-full font-serif">
                <motion.div 
                  className="absolute w-1.5 h-1.5 bg-red-400 rounded-full" 
                  animate={{ y: [45, 10], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  style={{ left: '40%' }}
                />
                <motion.div 
                  className="absolute w-1 h-1 bg-red-500 rounded-full" 
                  animate={{ y: [40, 15], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                  style={{ right: '35%' }}
                />
              </div>

              {/* HP Potion Bottle bottom-right */}
              <motion.div 
                className="absolute bottom-[-4px] right-2 w-5 h-6 bg-slate-100 border-2 border-[#1e1b4b] rounded-md flex flex-col items-center justify-end overflow-hidden shadow-md"
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ originY: 1 }}
              >
                {/* Wood cork */}
                <div className="w-2.5 h-1.5 bg-amber-800 border-b border-[#1e1b4b] absolute top-0" />
                {/* Red animated fluid content */}
                <motion.div 
                  className="w-full bg-red-500"
                  animate={{ height: ['45%', '65%', '45%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>

              <span className="absolute -top-1.5 right-4 text-[7px] bg-red-900 border border-red-500 text-white font-mono rounded px-1 scale-90">POTION_HP</span>
            </div>
          )
        };

      case 'pixel_potion_mp':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              <div className="absolute inset-1.5 border-4 border-[#0f172a] rounded-full" />
              <div className="absolute inset-[9px] border-2 border-[#1e3a8a]/50 rounded-full" />
              
              <div className="absolute inset-0 overflow-hidden rounded-full font-serif">
                <motion.div 
                  className="absolute w-1.5 h-1.5 bg-sky-400 rounded-full" 
                  animate={{ y: [45, 10], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.3, repeat: Infinity, ease: 'easeOut' }}
                  style={{ left: '35%' }}
                />
                <motion.div 
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full" 
                  animate={{ y: [35, 12], opacity: [0, 0.9, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                  style={{ right: '45%' }}
                />
              </div>

              {/* MP Potion Bottle bottom-left */}
              <motion.div 
                className="absolute bottom-[-4px] left-2 w-5 h-6 bg-slate-100 border-2 border-[#0f172a] rounded-md flex flex-col items-center justify-end overflow-hidden shadow-md"
                animate={{ rotate: [4, -4, 4] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                style={{ originY: 1 }}
              >
                <div className="w-2.5 h-1.5 bg-amber-800 border-b border-[#0f172a] absolute top-0" />
                <motion.div 
                  className="w-full bg-sky-500"
                  animate={{ height: ['50%', '70%', '50%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>

              <span className="absolute -top-1.5 left-4 text-[7px] bg-sky-900 border border-sky-450 text-white font-mono rounded px-1 scale-90">POTION_MP</span>
            </div>
          )
        };

      case 'pixel_shield_wood':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              {/* Medieval Wood planks background outline */}
              <div className="absolute inset-1.5 border-[5px] border-[#451a03] rounded-full" />
              <div className="absolute inset-[10px] border-2 border-[#d97706]/45 rounded-full" />
              
              {/* Corner rivets */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-slate-400 border border-slate-600 rounded-full" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-400 border border-slate-600 rounded-full" />
              
              {/* 8-bit shield at bottom right */}
              <motion.div 
                className="absolute bottom-[-3px] right-2 w-6 h-6 flex items-center justify-center"
                animate={{ y: [-1, 1, -1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-5 h-5 filter drop-shadow-sm" viewBox="0 0 16 16" fill="none">
                  {/* Outer shield grey border */}
                  <path d="M 1 1 L 15 1 L 15 8 C 15 12 8 15 8 15 C 8 15 1 12 1 8 Z" fill="#94a3b8" stroke="#1e293b" strokeWidth="1" />
                  {/* Central yellow emblem */}
                  <path d="M 4 4 L 12 4 L 12 7 C 12 10 8 12 8 12 C 8 12 4 10 4 7 Z" fill="#fbbf24" opacity="0.9" />
                </svg>
              </motion.div>

              {/* Crossed Sword at bottom left */}
              <motion.div 
                className="absolute bottom-[-2px] left-2 w-5 h-5 flex items-center justify-center"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                <span className="text-sm filter drop-shadow">⚔️</span>
              </motion.div>

              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] font-sans bg-[#451a03] border border-[#d97706] text-[#fef3c7] px-2 py-0.2 rounded font-black tracking-wider shadow">DEFENDER</span>
            </div>
          )
        };

      case 'pixel_magic_scroll':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              {/* Rough Papyrus/Scroll golden outline */}
              <div className="absolute inset-1.5 border-4 border-[#783510] rounded-full" />
              <div className="absolute inset-[9px] border-2 border-[#fef3c7]/60 rounded-full" />
              
              {/* Magical Arcane Glyphs drifting */}
              <div className="absolute inset-0 overflow-hidden rounded-full font-sans">
                <motion.span 
                  className="absolute text-[8px] text-purple-400 font-mono font-black"
                  animate={{ y: [42, 6], opacity: [0, 1, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                  style={{ left: 14 }}
                >
                  🜔
                </motion.span>
                <motion.span 
                  className="absolute text-[9px] text-purple-300 font-mono font-black animate-pulse"
                  animate={{ y: [35, -2], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', delay: 1 }}
                  style={{ right: 14 }}
                >
                  ✵
                </motion.span>
              </div>

              {/* Scroll paper tags */}
              <span className="absolute -top-[14px] left-1/2 -translate-x-1/2 text-[10px] filter drop-shadow">📜</span>
              <span className="absolute -bottom-2 text-[10px] filter drop-shadow">📜</span>

              <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
              <span className="absolute -top-2 left-2 text-[6px] font-mono bg-purple-950 border border-purple-400 text-purple-300 px-1 rounded uppercase tracking-widest leading-none">ARCANE</span>
            </div>
          )
        };

      case 'pixel_heart_hud':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              {/* Retro HUD Slate boundary */}
              <div className="absolute inset-1.5 border-4 border-slate-800 rounded-full" />
              <div className="absolute inset-[10px] border-2 border-slate-500/50 rounded-full" />
              
              {/* Life bar inside simulation */}
              <div className="absolute -top-[15px] left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-black/85 border border-[#fc1d49] px-2 py-0.5 rounded shadow z-40">
                <span className="text-[6px] font-mono text-white mr-1 uppercase scale-95 leading-none">LIFE</span>
                <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500 animate-pulse" />
                <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                </motion.div>
                <span className="text-[5px] text-zinc-400 font-mono ml-0.5 scale-90">3/3</span>
              </div>

              {/* Floating Pixel Hearts */}
              <div className="absolute inset-0 overflow-hidden rounded-full font-serif">
                <motion.div 
                  className="absolute text-[8px] text-rose-455 fill-rose-400"
                  animate={{ y: [35, 5], opacity: [0, 0.9, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
                  style={{ left: 12 }}
                >
                  ❤️
                </motion.div>
                <motion.div 
                  className="absolute text-[7px] text-rose-455 fill-rose-300"
                  animate={{ y: [42, 10], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: 1.2 }}
                  style={{ right: 12 }}
                >
                  ❤️
                </motion.div>
              </div>

              <span className="absolute -bottom-2.5 bg-red-600 border border-red-300 text-white text-[7px] font-mono font-bold uppercase rounded px-1.5 leading-none shadow scale-90">8-BIT STATS</span>
            </div>
          )
        };

      case 'pixel_crystal_socket':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              {/* Chiseled Solid-Gold block border */}
              <div className="absolute inset-1.5 border-4 border-amber-600 rounded-full" />
              <div className="absolute inset-[10px] border-2 border-yellow-400/40 rounded-full" />
              
              {/* Shiny Gem rubis top left */}
              <div className="absolute top-1.5 left-2 w-2 h-2 bg-red-500 border border-red-800 rotate-45 animate-pulse" />
              {/* Sapphire top right */}
              <div className="absolute top-1.5 right-2 w-2 h-2 bg-blue-500 border border-blue-800 rotate-45" />

              {/* Big central rotating Emerald crystal at the bottom */}
              <motion.div 
                className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-4.5 h-5 bg-emerald-400 border border-emerald-800 shadow z-30 flex items-center justify-center"
                animate={{ rotate: [45, 225, 405] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              >
                <div className="w-2 h-2 bg-white/50 rounded-full" />
              </motion.div>

              <span className="absolute -top-[14px] left-1/2 -translate-x-1/2 text-sm">💎</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 absolute -bottom-1 right-2 animate-bounce" />
              <Sparkles className="w-3 h-3 text-emerald-300 absolute -bottom-1 left-2 animate-ping" />
            </div>
          )
        };

      case 'pixel_cyber_hacker':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              {/* Terminal Dark border */}
              <div className="absolute inset-1.5 border-4 border-[#06b6d4] rounded-full" />
              <div className="absolute inset-[9px] border-2 border-emerald-500/40 rounded-full" />
              
              {/* Green rain falling particles inside */}
              <div className="absolute inset-0 overflow-hidden rounded-full font-mono">
                <motion.div 
                  className="absolute text-[6px] text-green-400 font-mono font-extrabold"
                  animate={{ y: [-10, 35], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  style={{ left: '16%' }}
                >
                  1001
                </motion.div>
                <motion.div 
                  className="absolute text-[6px] text-emerald-400 font-mono font-extrabold"
                  animate={{ y: [-15, 28], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 0.6 }}
                  style={{ right: '18%' }}
                >
                  0110
                </motion.div>
              </div>

              {/* Bracket indicators */}
              <span className="absolute top-1 left-1.5 text-[8px] font-mono text-cyan-400 font-bold">&lt;_</span>
              <span className="absolute bottom-1 right-2 text-[8px] font-mono text-green-400 font-bold">&gt;</span>

              <span className="absolute -bottom-2 bg-black border border-[#06b6d4] text-[7px] text-[#06b6d4] font-mono px-2 py-0.5 rounded uppercase leading-none font-extrabold shadow scale-90 tracking-widest">CONSOLE</span>
            </div>
          )
        };

      // --- ANIMADAS: NEONS & AURAS ---
      case 'glow_azul':
        gradientClass = 'border-cyan-400 bg-cyan-950/20';
        inlineStyle = { ...inlineStyle, boxShadow: `0 0 20px ${userColor || '#38bdf8'}` };
        break;
      case 'glow_roxo':
        gradientClass = 'border-purple-500 bg-purple-950/20';
        inlineStyle = { ...inlineStyle, boxShadow: `0 0 20px ${userColor || '#c084fc'}` };
        break;
      case 'glow_verde':
        gradientClass = 'border-lime-500 bg-lime-950/20';
        inlineStyle = { ...inlineStyle, boxShadow: `0 0 20px ${userColor || '#84cc16'}` };
        break;
      case 'glow_dourado':
        gradientClass = 'border-amber-400 bg-amber-950/15';
        inlineStyle = { ...inlineStyle, boxShadow: `0 0 22px ${userColor || '#fbbf24'}` };
        break;
      case 'aura_roxa':
        gradientClass = 'border-indigo-600 bg-indigo-950/20';
        inlineStyle = { ...inlineStyle, boxShadow: `0 0 25px ${userColor || '#6366f1'}, inset 0 0 10px #818cf8` };
        break;
      case 'aura_azul':
        gradientClass = 'border-blue-600 bg-blue-950/25';
        inlineStyle = { ...inlineStyle, boxShadow: `0 0 25px ${userColor || '#2563eb'}, inset 0 0 10px #60a5fa` };
        break;
      case 'aura_vermelha':
        gradientClass = 'border-red-600 bg-red-950/25';
        inlineStyle = { ...inlineStyle, boxShadow: `0 0 30px ${userColor || '#dc2626'}, inset 0 0 12px #ef4444` };
        break;
      case 'aura_dourada':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <>
              <motion.div 
                className="absolute -inset-2 rounded-full border border-yellow-400 opacity-60 z-10"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div 
                className="absolute -inset-1 rounded-full border-4 border-yellow-500 z-10"
                style={{
                  boxShadow: '0 0 30px #f59e0b, inset 0 0 10px #facc15'
                }}
              />
              <span className="text-xs absolute -top-2 right-2 text-yellow-300">★</span>
            </>
          )
        };

      // --- CASAL EXTRAS ---
      case 'metade_coracao_esq':
        gradientClass = 'border-[#e84e4e] bg-[#e84e4e]/10';
        decoration = (
          <div className="absolute -right-2 top-11/12 -translate-y-1/2 bg-[#e84e4e] text-white px-1.5 py-0.5 rounded text-[8px] font-sans font-bold shadow-sm whitespace-nowrap z-30">
            ESQ 🧩
          </div>
        );
        break;
      case 'metade_coracao_dir':
        gradientClass = 'border-[#e84e4e] bg-[#e84e4e]/10';
        decoration = (
          <div className="absolute -left-2 top-11/12 -translate-y-1/2 bg-[#e84e4e] text-white px-1.5 py-0.5 rounded text-[8px] font-sans font-bold shadow-sm whitespace-nowrap z-30">
            DIR 🧩
          </div>
        );
        break;
      case 'alianca_💍':
        gradientClass = 'border-yellow-400 bg-amber-50';
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 flex justify-between">
            <span className="absolute -top-3 left-1 flex text-sm">💍</span>
            <span className="absolute -bottom-2 right-1 flex text-sm">💍</span>
          </div>
        );
        break;
      case 'alma_gemea':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-2 pointer-events-none z-10 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="alma-grad-svg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                  <filter id="glow-filter-alma" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="50" cy="50" r="45" stroke="url(#alma-grad-svg)" strokeWidth="4.5" fill="none" filter="url(#glow-filter-alma)" />
                <circle cx="50" cy="50" r="45" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.7" />
              </svg>
              <Heart className="w-4 h-4 text-white fill-rose-500 absolute -top-1.5 right-2 filter drop-shadow z-30 animate-pulse" />
              <Heart className="w-4 h-4 text-white fill-pink-500 absolute -top-1.5 left-2 filter drop-shadow z-30 animate-bounce" />
              <span className="text-[10px] absolute -bottom-2 bg-rose-600 border border-white/20 text-white rounded-full px-1.5 font-sans font-black tracking-widest leading-none z-30 shadow scale-90">
                SOUL
              </span>
            </div>
          )
        };

      // --- CONQUISTAS ---
      case 'bq_boas_vindas':
        gradientClass = 'border-emerald-400 bg-emerald-50';
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 pb-1 flex flex-col justify-end items-center">
            <span className="text-[8px] bg-emerald-600 border border-emerald-400 text-white px-1.5 py-0.5 rounded font-black uppercase whitespace-nowrap tracking-wide leading-none select-none scale-95 shadow">
              NÍVEL 1
            </span>
          </div>
        );
        break;
      case 'bq_profile_master':
        gradientClass = 'border-indigo-500 bg-indigo-50';
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 pb-1 flex flex-col justify-end items-center">
            <Trophy className="w-5 h-5 text-yellow-500 absolute -top-2 filter drop-shadow" />
            <span className="text-[8px] bg-indigo-700 text-white border border-indigo-400 px-1 py-0.5 rounded font-black uppercase tracking-wide leading-none scale-95 shadow">
              PRO MASTER
            </span>
          </div>
        );
        break;
      case 'bq_fotografo':
        gradientClass = 'border-blue-400 bg-sky-50';
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="text-xs absolute -top-1.5 -right-1 filter drop-shadow">📸</span>
          </div>
        );
        break;
      case 'bq_veterano':
        gradientClass = 'border-amber-500 bg-amber-50';
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-md filter drop-shadow">👑</span>
            <span className="text-[8px] bg-amber-600 border border-amber-400 text-white px-1.5 py-0.5 rounded font-black absolute bottom-0 left-1/2 -translate-x-1/2 tracking-wide leading-none shadow">
              VETERANO
            </span>
          </div>
        );
        break;
      case 'bq_love_verified':
        gradientClass = 'border-blue-500 bg-blue-50';
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <BadgeCheck className="w-5 h-5 text-blue-500 fill-white absolute -top-1 -right-1 filter drop-shadow" />
          </div>
        );
        break;

      // --- PREMIUM & EXTRA HIGH FIDELITY GAMING ---
      case 'p_galaxy':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <>
              <motion.div 
                className="absolute -inset-2 rounded-full border-2 border-purple-500 z-10"
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute inset-0 rounded-full border border-purple-300 animate-ping opacity-30" />
                <Star className="w-3 h-3 text-pink-400 fill-pink-400 absolute top-0 left-1/2 -translate-x-1/2 animate-bounce" />
              </motion.div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-950 via-purple-900 to-pink-900 opacity-20 z-0 animate-pulse" />
            </>
          )
        };
      case 'p_nebula':
        gradientClass = 'border-rose-500 bg-slate-950 border-4';
        inlineStyle = { 
          ...inlineStyle, 
          boxShadow: '0 0 25px rgba(244, 63, 94, 0.8), inset 0 0 10px rgba(168, 85, 247, 0.5)',
        };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 overflow-hidden rounded-full">
            <span className="absolute text-[8px] top-2 left-6 text-pink-300 animate-pulse">✦</span>
            <span className="absolute text-[6px] bottom-3 right-5 text-indigo-300 animate-pulse">✦</span>
          </div>
        );
        break;
      case 'p_cyber_neon':
        gradientClass = 'border-fuchsia-500 bg-slate-900 border-4';
        inlineStyle = { 
          ...inlineStyle, 
          boxShadow: '0 0 25px #d946ef, inset 0 0 10px #6366f1',
        };
        break;
      case 'p_crystal':
      case 'p_crystal_lapidado':
        gradientClass = 'border-cyan-300 bg-cyan-950/20 border-4';
        inlineStyle = { 
          ...inlineStyle, 
          borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
          boxShadow: '0 0 20px rgba(103, 232, 249, 0.9), inset 0 0 12px rgba(103, 232, 249, 0.6)' 
        };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="text-[10px] absolute -top-1 right-2 text-cyan-200">💎</span>
          </div>
        );
        break;
      case 'p_gold_crown':
        gradientClass = 'border-amber-400 bg-[#1e1b4b] border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 20px rgba(234, 179, 8, 0.7), inset 0 0 8px rgba(234, 179, 8, 0.4)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10">
            <span className="text-xl absolute -top-[14px] left-1/2 -translate-x-1/2 filter drop-shadow">👑</span>
          </div>
        );
        break;
      case 'p_legendary':
        gradientClass = 'border-red-600 bg-stone-950 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 30px #ef4444, inset 0 0 10px #facc15' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400 absolute -top-2 -right-2 animate-pulse fill-amber-400" />
            <Sparkles className="w-3.5 h-3.5 text-orange-400 absolute -bottom-1.5 -left-1.5 animate-bounce fill-orange-400" />
          </div>
        );
        break;
      case 'gamer_steam':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              <motion.svg 
                className="w-full h-full" 
                viewBox="0 0 100 100"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <defs>
                  <linearGradient id="steam-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="46" stroke="url(#steam-grad)" strokeWidth="4.5" fill="none" />
              </motion.svg>
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-pulse pointer-events-none" />
              <span className="text-[12px] absolute -bottom-1 -right-1 filter drop-shadow animate-bounce">🎮</span>
            </div>
          )
        };
      case 'love_story':
        gradientClass = 'border-red-500 bg-red-950/20 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 20px #ef4444, inset 0 0 8px #f43f5e' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 flex flex-col justify-end items-center">
            <span className="text-sm absolute -bottom-2 text-rose-500 animate-bounce">📖</span>
          </div>
        );
        break;
      case 'soulmate':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              <motion.svg 
                className="w-full h-full" 
                viewBox="0 0 100 100"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                <defs>
                  <linearGradient id="soulmate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="46" stroke="url(#soulmate-grad)" strokeWidth="4" strokeDasharray="8 4" fill="none" />
              </motion.svg>
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 absolute -top-1.5 -left-1.5 animate-pulse" />
              <Heart className="w-4 h-4 text-purple-400 fill-purple-400 absolute -bottom-1.5 -right-1.5 animate-bounce" />
            </div>
          )
        };
      case 'eterno_amor':
        gradientClass = 'border-rose-600 bg-gradient-to-tr from-rose-950/20 to-pink-950/20 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 25px rgba(225, 29, 72, 0.9)' };
        decoration = (
          <div className="absolute inset-0 select-none pointer-events-none z-10 overflow-hidden rounded-full font-sans">
            <motion.div 
              className="absolute text-rose-400 text-[10px] font-bold"
              animate={{ y: [-4, -30], x: [0, 8], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
              style={{ bottom: 10, left: 16 }}
            >
              ❤️
            </motion.div>
            <motion.div 
              className="absolute text-rose-400 text-[8px] font-bold"
              animate={{ y: [-4, -25], x: [0, -6], opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }}
              style={{ bottom: 12, right: 14 }}
            >
              ❤️
            </motion.div>
          </div>
        );
        break;
      case 'part_coracoes':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute inset-0 pointer-events-none z-10">
              <motion.div 
                className="absolute inset-0 rounded-full border border-rose-300 pointer-events-none"
                animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="absolute -top-1 left-2 animate-bounce text-sm">❤️</span>
              <span className="absolute bottom-2 -right-1 animate-pulse text-xs">💖</span>
              <span className="absolute bottom-5 -left-2 animate-bounce text-sm" style={{ animationDelay: '0.4s' }}>💕</span>
            </div>
          )
        };
      case 'part_estrelas':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute inset-0 pointer-events-none z-10">
              <motion.div 
                className="absolute inset-x-0 -top-1 text-yellow-300 text-xs text-center font-bold"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              >
                ★
              </motion.div>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 absolute -top-1.5 -right-1 animate-pulse" />
              <Sparkles className="w-3 h-3 text-yellow-200 fill-yellow-200 absolute -bottom-1 -left-1 animate-ping" />
            </div>
          )
        };
      case 'p_hologram':
        return {
          gradientClass: 'border-transparent',
          inlineStyle: { ...inlineStyle, boxShadow: 'none' },
          decoration: (
            <div className="absolute -inset-1.5 pointer-events-none z-10 flex items-center justify-center">
              <motion.svg 
                className="w-full h-full" 
                viewBox="0 0 100 100"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <defs>
                  <linearGradient id="holo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="33%" stopColor="#22d3ee" />
                    <stop offset="66%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="46" stroke="url(#holo-grad)" strokeWidth="4.5" fill="none" />
              </motion.svg>
              <span className="absolute -top-1 -right-1 text-cyan-300 text-[10px] animate-pulse">✨</span>
            </div>
          )
        };
      case 'dev_vscode':
        gradientClass = 'border-blue-500 bg-blue-950/20 border-4';
        inlineStyle = { ...inlineStyle, boxShadow: '0 0 15px rgba(59, 130, 246, 0.7)' };
        decoration = (
          <div className="absolute -top-1.5 right-1 text-[8px] font-mono bg-blue-600 border border-blue-400 text-white font-bold px-1 rounded shadow-sm">
            &lt;/&gt;
          </div>
        );
        break;

      default:
        break;
    }

    return { gradientClass, inlineStyle, decoration };
  };

  const frameStyle = getFrameStyle();

  // Custom modification effect classes
  const effectClass = activeCustom.effect === 'pulse' 
    ? 'animate-pulse' 
    : activeCustom.effect === 'rotate' 
      ? 'animate-[spin_10s_linear_infinite]' 
      : activeCustom.effect === 'float' 
        ? 'animate-[bounce_2s_infinite]' 
        : '';

  // Render the special "Casal Conectado" dual-avatar overlapping look
  if (frameId === 'casal_conectado' && partnerSrc) {
    return (
      <div className={cn("relative flex items-center justify-center pt-2 select-none", className)}>
        {/* Main User Avatar */}
        <div className={cn("relative rounded-full border-2 border-[#e84e4e] overflow-hidden bg-white shadow-md z-20", layout.container)}>
          <img src={src} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>

        {/* Partner User Avatar Overlap */}
        <div 
          className={cn(
            "absolute rounded-full border border-pink-400 overflow-hidden bg-white shadow-md z-10 transition-transform duration-500 hover:scale-105", 
            layout.container,
            layout.shift
          )}
        >
          <img src={partnerSrc} alt="Partner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>

        {/* Overlap Heart Decoration */}
        <Heart 
          size={layout.container === 'w-[10px]' ? 14 : 26} 
          className="absolute text-[#e84e4e] fill-[#e84e4e] z-30 filter drop-shadow animate-pulse"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.15)'
          }}
        />
      </div>
    );
  }

  const rawGradClass = frameStyle.gradientClass || '';
  const backdropBgClass = rawGradClass
    .replace(/border-[^\s]+/g, '')
    .replace(/\bborder\b/g, '')
    .replace(/\bborder-2\b/g, '')
    .replace(/\bborder-4\b/g, '')
    .replace(/\bborder-8\b/g, '')
    .replace(/\bborder-double\b/g, '')
    .trim();
  const borderRingClass = rawGradClass
    .replace(/bg-[^\s]+/g, '')
    .replace(/bg-gradient-[^\s]+/g, '')
    .replace(/from-[^\s]+/g, '')
    .replace(/via-[^\s]+/g, '')
    .replace(/to-[^\s]+/g, '')
    .trim();

  return (
    <div className={cn("relative flex items-center justify-center select-none", layout.container, className)}>
      
      {/* 1. Base Background Layer (z-0, sits behind the avatar, peeking around the edges) */}
      {frameId && frameId !== 'none' && backdropBgClass && (
        <div 
          className={cn(
            "absolute inset-0 rounded-full pointer-events-none transition-all duration-300 z-0",
            backdropBgClass,
            effectClass
          )}
          style={{
            opacity: frameOpacity,
            ...frameStyle.inlineStyle
          }}
        />
      )}

      {/* 2. Actual Avatar Image (z-10, sits on top of background layer to stay 100% visible) */}
      <div 
        className={cn(
          "rounded-full overflow-hidden bg-white border-2 border-black/10 flex items-center justify-center relative translate-y-0.2 select-none z-10",
          layout.avatarSize
        )}
      >
        <img 
          src={src} 
          alt="Avatar" 
          className="w-full h-full object-cover select-none pointer-events-none" 
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 3. Outer Border Ring (z-20, sits on top of the avatar's edges to frame it beautifully) */}
      {frameId && frameId !== 'none' && borderRingClass && (
        <div 
          className={cn(
            "absolute inset-0 rounded-full pointer-events-none transition-all duration-300 z-20",
            borderRingClass,
            effectClass,
            // custom thickness override
            borderThickness
          )}
          style={{
            borderColor: activeCustom.color || undefined,
            opacity: frameOpacity,
            ...frameStyle.inlineStyle
          }}
        />
      )}

      {/* 4. Extra Badges, Decors & Custom SVG Vectors (z-30, overlays on top of everything) */}
      {frameStyle.decoration && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {frameStyle.decoration}
        </div>
      )}

      {/* 5. Custom Glow Shadow if selected (z-0, sits behind backend) */}
      {activeCustom.effect === 'glow' && frameId && frameId !== 'none' && (
        <div 
          className="absolute inset-0 rounded-full blur-md opacity-70 pointer-events-none z-0" 
          style={{
            boxShadow: `0 0 24px 8px ${activeCustom.color || '#e84e4e'}`
          }}
        />
      )}
    </div>
  );
}
