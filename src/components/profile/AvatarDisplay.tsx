import React from 'react';
import { motion } from 'motion/react';
import { FrameConfig } from '../../types';

interface AvatarDisplayProps {
  src?: string;
  frame: FrameConfig;
  className?: string;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ src, frame, className = "w-20 h-20" }) => {
  // Extract background classes and border classes to prevent covering the avatar photo
  const borderStyleStr = frame.borderStyle || '';
  const bgClasses = borderStyleStr.replace(/border-[^\s]+/g, '').replace(/border/g, '');
  const borderClasses = borderStyleStr.replace(/bg-[^\s]+/g, '').replace(/bg-gradient-[^\s]+/g, '').replace(/from-[^\s]+/g, '').replace(/via-[^\s]+/g, '').replace(/to-[^\s]+/g, '');

  return (
    <div className={`relative flex items-center justify-center ${className} select-none`}>
      {/* Glow Layer */}
      <motion.div 
        className="absolute inset-0 rounded-full blur-xl opacity-60 pointer-events-none"
        style={{ backgroundColor: frame.glowColor }}
        animate={frame.animation === 'pulse' ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Moldura Base Background Layer (z-0, sits behind avatar) */}
      {bgClasses && (
        <div className={`absolute inset-0 rounded-full z-0 pointer-events-none ${bgClasses}`} />
      )}

      {/* Actual Avatar Photo (z-10, sits above background wash) */}
      <div className="w-[85%] h-[85%] rounded-full overflow-hidden bg-white border border-black/10 flex items-center justify-center z-10 relative">
        <img 
          src={src || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200'} 
          alt="Avatar" 
          className="w-full h-full object-cover select-none pointer-events-none" 
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Moldura Border Outline Ring (z-20, sits on top of avatar) */}
      <motion.div 
        className={`absolute inset-0 border-4 rounded-full z-20 pointer-events-none ${borderClasses}`}
        animate={frame.animation === 'spin' ? { rotate: 360 } : {}}
        transition={frame.animation === 'spin' ? { duration: 10, repeat: Infinity, ease: 'linear' } : {}}
      />
    </div>
  );
};
