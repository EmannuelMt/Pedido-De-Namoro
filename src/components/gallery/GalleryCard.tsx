import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  MessageCircle,
  Eye,
  Trash2
} from 'lucide-react';
import { Memory } from '../../types';

interface GalleryCardProps {
  memory: Memory;
  idx: number;
  onClick: (memory: Memory) => void;
  onLike: (id: string, likes: number, e: React.MouseEvent) => void | Promise<void>;
  onDelete: (id: string, e: React.MouseEvent) => void | Promise<void>;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ memory, idx, onClick, onLike, onDelete }) => {
  
  const getThemeStyles = (theme: Memory['theme']) => {
    switch (theme) {
      case 'romance': return 'border-pink-400 bg-pink-50';
      case 'anime': return 'border-indigo-400 bg-indigo-50';
      case 'nature': return 'border-purple-200 bg-stone-50';
      case 'vintage': return 'border-stone-300 bg-white';
      default: return 'border-purple-400 bg-white';
    }
  };

  const getRandomRotation = () => {
    const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2'];
    return rotations[idx % rotations.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.4 }}
      onClick={() => onClick(memory)}
      className={`group relative p-6 border-[5px] border-black rounded-[2.5rem] transition-all hover:-translate-y-4 hover:shadow-[18px_18px_0px_0px_#000] shadow-[12px_12px_0px_0px_#000] cursor-pointer bg-white ${getRandomRotation()}`}
    >
      {/* Decorative Tape Sticker */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-10 bg-[#4ade80] border-[4px] border-black -rotate-2 z-10 shadow-[4px_4px_0px_0px_#000]" />

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden border-[4px] border-black rounded-[1.5rem] mb-6">
        <img 
          src={memory.imageUrl} 
          alt={memory.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <div className="bg-[#ff90e8] p-5 rounded-full border-[4px] border-black shadow-[6px_6px_0px_0px_#000] -rotate-12">
            <Eye className="w-8 h-8 text-black" strokeWidth={4} />
          </div>
        </div>

        {/* Sticker Badge */}
        <div className="absolute bottom-4 right-4 bg-black text-white border-[3px] border-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
          {memory.category.split(' ')[1] || 'PIC'}
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black truncate leading-none">
          {memory.title}
        </h3>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40">
            <Calendar className="w-4 h-4 text-[#ff90e8]" strokeWidth={4} />
            {memory.date}
          </div>
          {memory.location && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40">
              <MapPin className="w-4 h-4 text-[#4ade80]" strokeWidth={4} />
              {memory.location}
            </div>
          )}
        </div>

        {/* Interaction Bar */}
        <div className="flex items-center justify-between pt-4 border-t-[3px] border-black/5">
          <div className="flex items-center gap-5">
            <button 
              onClick={(e) => onLike(memory.id, memory.likes || 0, e)}
              className="flex items-center gap-2 group/btn"
            >
              <Heart 
                className={`w-5 h-5 transition-all ${memory.likes && memory.likes > 0 ? 'fill-rose-500 text-rose-500 scale-110' : 'text-black/20 group-hover/btn:text-rose-500 group-hover/btn:scale-110'}`} 
                strokeWidth={4} 
              />
              <span className="text-xs font-black uppercase">{memory.likes || 0}</span>
            </button>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-black/20" strokeWidth={4} />
              <span className="text-xs font-black uppercase">{memory.comments?.length || 0}</span>
            </div>
          </div>

          <button 
            onClick={(e) => onDelete(memory.id, e)}
            className="text-black/10 hover:text-rose-500 transition-colors p-2"
          >
            <Trash2 className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
