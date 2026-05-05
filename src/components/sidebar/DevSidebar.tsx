import React from 'react';
import { motion } from 'motion/react';
import { Home, Calendar, Image as ImageIcon, Music, MessageCircle, Gamepad2, Heart, User as UserIcon, LogOut } from 'lucide-react';
import { View } from './FloatingSidebar'; // We'll export View from there or redefine it

export const MenuItems = [
  { icon: Home, label: 'Home', view: 'home' },
  { icon: Calendar, label: 'Calendário', view: 'historia' },
  { icon: ImageIcon, label: 'Galeria', view: 'galeria' },
  { icon: Music, label: 'Música', view: 'playlist' },
  { icon: MessageCircle, label: 'Cartas', view: 'cartas' },
  { icon: Gamepad2, label: 'Jogos', view: 'jogos' },
  { icon: Heart, label: 'Pedido', view: 'pedido' },
  { icon: UserIcon, label: 'Perfil', view: 'perfil' },
];

export const DevSidebar = ({ currentView, onNavigate }: any) => {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-black/90 border-r border-green-500/20 p-6 flex flex-col font-mono text-sm z-[100] hidden md:flex">
      <div className="text-green-500 mb-8 border-b border-green-500/20 pb-4">
        <p className="font-bold uppercase tracking-widest text-xs">ROOT_ACCESS</p>
        <p className="text-white/50 text-[10px]">v1.0.0 (stable)</p>
      </div>

      <div className="flex-1 space-y-2">
        {MenuItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`w-full text-left py-2 px-4 flex items-center gap-4 group transition-colors ${isActive ? 'bg-green-500/10 text-green-400 border-l-2 border-green-500' : 'text-green-500/50 hover:text-green-400 hover:bg-green-500/5 border-l-2 border-transparent'}`}
            >
               <span className="opacity-50">&gt;</span> {item.label.toLowerCase()}
               {isActive && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="ml-auto w-2 h-4 bg-green-500" />}
            </button>
          )
        })}
      </div>
    </div>
  );
};
