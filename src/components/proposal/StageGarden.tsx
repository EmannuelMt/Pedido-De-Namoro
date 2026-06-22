import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getStories, Story } from '../../lib/db';
import { Eye, ArrowRight, HeartPulse, Sparkles } from 'lucide-react';

interface StageProps {
  onNext: () => void;
}

interface AnimatedFlower {
  id: string;
  emoji: string;
  title: string;
  description: string;
  date: string;
  color: string;
  left: string;
  bottom: string;
  scale: number;
}

const DEFAULT_FLOWERS: AnimatedFlower[] = [
  {
    id: 'f1',
    emoji: '🌸',
    title: 'A primeira risada sincera',
    description: 'Aquele dia calmo quando você me fez rir tanto que minha barriga doeu. Ali percebi o quanto sua energia combina perfeitamente com a minha vida.',
    date: '15 Out 2025',
    color: 'from-pink-300 to-rose-400',
    left: '12%',
    bottom: '22%',
    scale: 1.2
  },
  {
    id: 'f2',
    emoji: '🌻',
    title: 'De mãos dadas no parque',
    description: 'Caminhando devagarinho, o sol se pondo no horizonte, e nossas mãos se encontraram em silêncio. Um frio na barriga maravilhoso que nunca vou esquecer.',
    date: '31 Out 2025',
    color: 'from-amber-200 to-orange-400',
    left: '38%',
    bottom: '18%',
    scale: 1.3
  },
  {
    id: 'f3',
    emoji: '🌹',
    title: 'Primeira declaração boba',
    description: 'Quando mandamos aquelas mensagens enormes na madrugada nos abrindo um para o outro e percebendo que já era amor há muito tempo.',
    date: '10 Nov 2025',
    color: 'from-rose-400 to-red-600',
    left: '65%',
    bottom: '26%',
    scale: 1.25
  },
  {
    id: 'f4',
    emoji: '🌷',
    title: 'O abraço quentinho de urso',
    description: 'Aquele aconchego que para o próprio tempo. Estar nos teus braços é o lugar mais seguro e cheio de paz de todo esse universo gigante.',
    date: '12 Dez 2025',
    color: 'from-fuchsia-300 to-indigo-450',
    left: '85%',
    bottom: '15%',
    scale: 1.15
  }
];

export const StageGarden: React.FC<StageProps> = ({ onNext }) => {
  const [flowers, setFlowers] = useState<AnimatedFlower[]>([]);
  const [selectedStory, setSelectedStory] = useState<AnimatedFlower | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const fetched = await getStories();
        if (fetched && fetched.length > 0) {
          const mapped: AnimatedFlower[] = fetched.slice(0, 4).map((s, idx) => {
            const emojis = ['🌸', '🌻', '🌹', '🌷'];
            const colors = [
              'from-pink-300 to-rose-400',
              'from-amber-200 to-orange-400',
              'from-rose-400 to-red-600',
              'from-fuchsia-300 to-indigo-450'
            ];
            const positions = [
              { left: '15%', bottom: '20%' },
              { left: '40%', bottom: '15%' },
              { left: '62%', bottom: '25%' },
              { left: '82%', bottom: '18%' }
            ];
            return {
              id: s.id || String(idx),
              emoji: emojis[idx % emojis.length],
              title: s.title,
              description: s.description,
              date: s.date || 'Algum momento fofo',
              color: colors[idx % colors.length],
              left: positions[idx % positions.length].left,
              bottom: positions[idx % positions.length].bottom,
              scale: 1.2
            };
          });
          setFlowers(mapped);
        } else {
          setFlowers(DEFAULT_FLOWERS);
        }
      } catch (e) {
        setFlowers(DEFAULT_FLOWERS);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#e3f0e5] to-[#f4fbf6] overflow-y-auto py-12 px-4 select-none flex flex-col justify-between" id="stage-garden">
      {/* Garden foliage & subtle trees elements */}
      <div className="absolute inset-0 bg-[#eef7f2] opacity-35 bg-[radial-gradient(#88a878_1.5px,transparent_1.5px)] [background-size:32px_32px] pointer-events-none" />

      {/* Title info block */}
      <div className="z-10 text-center max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#88a878]/20 border-2 border-[#3c5437] rounded-full text-[#3c5437] text-[10px] font-black uppercase tracking-widest font-mono shadow-[2px_2px_0px_#000]">
          🌸 ETAPA 04 — NOSSAS MEMÓRIAS
        </span>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#3c5437] mt-2 font-sans">
          Estética: Memory Garden
        </h2>
        <p className="text-[11px] font-black text-[#567a4e] uppercase tracking-widest mt-1">
          Regue o nosso jardim interativo! Clique em cada florzinha para ver desabrochar uma lembrança mágica.
        </p>
      </div>

      {/* Interactive Garden Scene Frame */}
      <div className="relative w-full max-w-4xl mx-auto my-auto h-[350px] z-10 border-4 border-black bg-gradient-to-t from-[#88a878]/30 via-[#cce0ce]/10 to-[#fafdfa]/20 rounded-3xl p-6 overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,1)]">
        
        {/* Floating clouds above */}
        <div className="absolute top-4 right-12 text-3xl opacity-20 animate-pulse">☁️</div>
        <div className="absolute top-8 left-16 text-2xl opacity-15 animate-bounce">☁️</div>

        {/* Garden green floor boundary */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#567a4e]/60 to-[#88a878]/40 border-t-3 border-[#3c5437]/20 pointer-events-none" />

        {/* Rendering Flowers */}
        {flowers.map((flo) => (
          <motion.button
            key={flo.id}
            whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
            onClick={() => setSelectedStory(flo)}
            style={{
              left: flo.left,
              bottom: flo.bottom,
              transform: `scale(${flo.scale})`
            }}
            className="absolute z-20 flex flex-col items-center justify-end select-none group focus:outline-none"
          >
            {/* Sparkling hover indicator */}
            <Sparkles className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1 animate-pulse" />
            
            {/* Visual flower bulb emoji with animated floating bounce effect */}
            <div className="text-5xl group-hover:drop-shadow-[0_4px_10px_rgba(255,100,100,0.5)] transition-all animate-bounce" style={{ animationDuration: '4s' }}>
              {flo.emoji}
            </div>

            {/* Stem and leaves connector */}
            <div className="w-1.5 h-10 bg-gradient-to-b from-[#88a878] to-[#3c5437] border-r border-[#243521]/10 rounded-full" />
            
            <div className="bg-white border-2 border-black rounded-lg px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#3c5437] mt-0.5 shadow-[1px_1px_0px_#000]">
              {flo.emoji} Florescer
            </div>
          </motion.button>
        ))}

        {/* Dynamic speech bubble popup overlay inside the garden */}
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute left-1/2 top-10 -translate-x-1/2 bg-white border-3 border-black p-4 rounded-2xl max-w-sm w-full mx-auto md:w-[320px] shadow-[4px_4px_0px_rgba(0,0,0,1)] z-30"
          >
            <div className="flex justify-between items-center pb-2 border-b-2 border-dashed border-stone-200">
              <span className="text-[9px] font-mono font-black text-[#567a4e] uppercase tracking-widest flex items-center gap-1">
                📅 {selectedStory.date}
              </span>
              <button 
                onClick={() => setSelectedStory(null)}
                className="text-[9px] text-[#e84e4e] font-black uppercase hover:underline"
              >
                Esconder ✕
              </button>
            </div>
            
            <div className="pt-2">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight text-stone-900 flex items-center gap-1.5">
                {selectedStory.emoji} {selectedStory.title}
              </h4>
              <p className="text-[11px] sm:text-xs font-serif italic text-stone-600 leading-relaxed mt-1.5 py-1">
                "{selectedStory.description}"
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Travel to next stage button */}
      <div className="z-10 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#567a4e] hover:bg-[#3c5437] text-white border-2 border-black font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-[4px_4px_0px_#e3f0e5] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          OUVIR NOSSA PLAYLIST 🎵 <ArrowRight className="w-4 h-4 text-amber-300" />
        </motion.button>
      </div>
    </div>
  );
};
