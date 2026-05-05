import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { MenuItems } from './DevSidebar';

export const CinematicSidebar = ({ currentView, onNavigate }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-8 right-8 z-[100] text-white/50 hover:text-white transition-colors"
      >
         <Menu size={32} />
      </button>

      <AnimatePresence>
         {isOpen && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-8"
           >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              >
                 <X size={32} />
              </button>

              <div className="flex flex-col items-center gap-8">
                 <p className="text-white/30 uppercase tracking-[0.5em] font-serif italic text-sm mb-8">Navegação</p>
                 
                 {MenuItems.map((item, idx) => {
                   const isActive = currentView === item.view;
                   return (
                     <motion.button
                       key={item.view}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.1 }}
                       onClick={() => {
                          onNavigate(item.view);
                          setIsOpen(false);
                       }}
                       className={`text-2xl md:text-5xl font-serif tracking-widest uppercase transition-all flex items-center gap-6 group ${
                          isActive ? 'text-white' : 'text-white/30 hover:text-white/70'
                       }`}
                     >
                        {isActive && <motion.div layoutId="cinema-dot" className="w-3 h-3 bg-white rounded-full" />}
                        {item.label}
                     </motion.button>
                   );
                 })}
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </>
  );
};
