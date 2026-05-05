import React from 'react';
import { motion } from 'motion/react';
import { MenuItems } from './DevSidebar';

export const MinimalSidebar = ({ currentView, onNavigate }: any) => {
  return (
    <div className="fixed md:left-8 md:top-1/2 md:-translate-y-1/2 bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 z-[100] flex md:flex-col gap-6 items-center">
       {MenuItems.map((item) => {
          const isActive = currentView === item.view;
          return (
             <button
               key={item.view}
               onClick={() => onNavigate(item.view)}
               className={`relative group transition-all duration-500 ease-out flex items-center justify-center ${
                 isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
               }`}
             >
                <item.icon size={24} strokeWidth={1.5} className={`${isActive ? 'scale-110 drop-shadow-[0_0_10px_var(--primary)]' : ''}`} />
                {isActive && (
                  <motion.div layoutId="minimal-indicator" className="absolute -left-4 w-1 h-1 bg-[var(--primary)] rounded-full hidden md:block" />
                )}
                {/* Mobile indicator */}
                {isActive && (
                  <motion.div layoutId="minimal-indicator-mobile" className="absolute -bottom-4 w-1 h-1 bg-[var(--primary)] rounded-full md:hidden" />
                )}
             </button>
          )
       })}
    </div>
  )
};
