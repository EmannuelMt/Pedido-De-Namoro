import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getPhotos, Photo } from '../../lib/db';
import { Eye, ArrowRight, HeartPulse, RefreshCw } from 'lucide-react';

interface StageProps {
  onNext: () => void;
}

interface InteractivePolaroid {
  id: string;
  url: string;
  caption: string;
  date: string;
  rotation: number;
  x: number;
  y: number;
}

const DEFAULT_POLAROIDS: InteractivePolaroid[] = [
  {
    id: 'p1',
    url: 'https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?q=80&w=600&auto=format&fit=crop',
    caption: 'Te ver sorrir é o meu momento predileto 🌸',
    date: 'Setembro 2025',
    rotation: -6,
    x: -40,
    y: 10
  },
  {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
    caption: 'Primeiro café da tarde juntos, cheio de beijos fofos ☕',
    date: 'Outubro 2025',
    rotation: 5,
    x: 60,
    y: -30
  },
  {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop',
    caption: 'Segurando sua mãozinha pela primeira vez debaixo da árvore 🌳',
    date: 'Novembro 2025',
    rotation: -3,
    x: -80,
    y: -80
  },
  {
    id: 'p4',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop',
    caption: 'O brilho no meu olhar que só você consegue tirar ✨',
    date: 'Dezembro 2025',
    rotation: 9,
    x: 80,
    y: 70
  }
];

export const StagePolaroid: React.FC<StageProps> = ({ onNext }) => {
  const [polaroids, setPolaroids] = useState<InteractivePolaroid[]>([]);
  const [activeItem, setActiveItem] = useState<InteractivePolaroid | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const fetched = await getPhotos();
        if (fetched && fetched.length > 0) {
          const mapped: InteractivePolaroid[] = fetched.slice(0, 5).map((p, index) => {
            const rotations = [-5, 6, -3, 8, -4];
            const xs = [-60, 60, -90, 80, 0];
            const ys = [20, -40, -90, 80, -20];
            return {
              id: p.id || String(index),
              url: p.imageUrl,
              caption: p.title || 'Infiltrado de amor 💖',
              date: p.date || 'Algum dia mágico',
              rotation: rotations[index % rotations.length],
              x: xs[index % xs.length],
              y: ys[index % ys.length]
            };
          });
          setPolaroids(mapped);
        } else {
          setPolaroids(DEFAULT_POLAROIDS);
        }
      } catch (err) {
        setPolaroids(DEFAULT_POLAROIDS);
      }
    };
    fetchPhotos();
  }, []);

  const handleShuffle = () => {
    setPolaroids(prev => prev.map(p => ({
      ...p,
      rotation: Math.random() * 20 - 10,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100
    })));
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#fcf9f2] overflow-y-auto py-12 px-4 select-none flex flex-col justify-between" id="stage-polaroid">
      {/* Board Texture details */}
      <div className="absolute inset-0 bg-[#f5efe2] opacity-40 bg-[linear-gradient(#4a3b3b_1px,transparent_1px),linear-gradient(90deg,#4a3b3b_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

      {/* Title block */}
      <div className="z-10 text-center max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/30 border-2 border-[#4a3b3b] rounded-full text-[#4a3b3b]/90 text-[10px] font-black uppercase tracking-widest font-mono shadow-[2px_2px_0px_#000]">
          📷 ETAPA 03 — DESCOBRINDO VOCÊ
        </span>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#4a3b3b] mt-2 font-sans">
          Estética: Polaroid Gallery
        </h2>
        <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest mt-1">
          Arraste as fotos para organizar o mural ou clique para ampliar!
        </p>
      </div>

      {/* Main Bulletin Canvas area */}
      <div className="relative w-full max-w-4xl mx-auto my-auto h-[380px] z-10 flex items-center justify-center border-4 border-dashed border-[#4a3b3b]/30 rounded-3xl p-6 overflow-hidden bg-white/40 backdrop-blur-[1px] shadow-inner">
        
        {/* Shuffle Buttons */}
        <button 
          onClick={handleShuffle}
          className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-white border-2 border-black rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-stone-100 shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
        >
          <RefreshCw size={11} className="animate-spin" style={{ animationDuration: '6s' }} /> Misturar Fotos
        </button>

        {polaroids.map((p) => (
          <motion.div
            key={p.id}
            drag
            dragConstraints={{ left: -300, right: 300, top: -160, bottom: 160 }}
            style={{
              rotate: `${p.rotation}deg`,
              x: p.x,
              y: p.y
            }}
            whileDrag={{ scale: 1.15, zIndex: 30 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveItem(p)}
            className="absolute bg-white border-[3px] border-black p-3 pb-6 rounded-sm shadow-[5px_5px_0px_rgba(0,0,0,0.15)] w-44 cursor-pointer hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
          >
            {/* Hanging Push Pin */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-lg filter drop-shadow-[1px_1px_1px_rgba(0,0,0,0.3)]">📌</div>
            
            {/* Main Picture Box */}
            <div className="w-full aspect-square border-2 border-black rounded bg-stone-100 overflow-hidden mt-1 pointer-events-none">
              <img src={p.url} alt={p.caption} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            {/* Polaroid handwritten captions feel */}
            <p className="mt-3 text-[10px] font-sans font-bold text-center leading-tight text-[#4a3b3b] truncate">
              {p.caption}
            </p>
          </motion.div>
        ))}

        {/* Modal Overlay Zoom detail view */}
        {activeItem && (
          <div className="absolute inset-0 bg-[#4a3b3b]/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border-4 border-black p-5 pb-8 rounded-sm max-w-sm w-full shadow-[8px_8px_0px_#000] rotate-1 relative"
            >
              <button 
                onClick={() => setActiveItem(null)}
                className="absolute top-3 right-3 text-xs bg-black text-white hover:bg-rose-500 font-sans font-black uppercase tracking-widest px-2.5 py-1.5 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] active:translate-y-0.5"
              >
                Fechar ✕
              </button>

              <div className="w-full aspect-square border-3 border-black rounded bg-stone-100 overflow-hidden my-3">
                <img src={activeItem.url} alt={activeItem.caption} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>

              <div className="text-center space-y-2">
                <span className="inline-block bg-red-100 border border-black text-red-700 text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  📅 {activeItem.date}
                </span>
                <p className="text-lg font-serif italic text-stone-900 leading-snug">
                  "{activeItem.caption}"
                </p>
                <div className="text-[10px] font-bold text-amber-800 uppercase tracking-widest pt-2 flex items-center justify-center gap-1">
                  <Eye size={12} /> Exibindo lembrança em alta definição
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div className="z-10 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#4a3b3b] hover:bg-black text-white border-2 border-black font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-[4px_4px_0px_#fff3e3] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          DESBRAVAR JARDIM DE MEMÓRIAS <ArrowRight className="w-4 h-4 text-amber-300" />
        </motion.button>
      </div>
    </div>
  );
};
