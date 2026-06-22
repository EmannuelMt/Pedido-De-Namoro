import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowRight, HelpCircle, Heart, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface StageProps {
  onNext: () => void;
}

interface CosmicStar {
  id: number;
  label: string;
  emoji: string;
  description: string;
  top: string;
  left: string;
}

const COSMIC_DREAMS: CosmicStar[] = [
  {
    id: 1,
    label: "A Casinha dos Sonhos",
    emoji: "🏡",
    description: "Nossa casinha aconchegante, cheia de plantas na varanda e canecas engraçadas combinando no armário da cozinha.",
    top: "30%",
    left: "15%"
  },
  {
    id: 2,
    label: "Adotar Dois Gatinhos",
    emoji: "🐱",
    description: "Chamar os dois gatinhos brincalhões que vão bagunçar a nossa sala de estar e ronronar no nosso casaco no frio.",
    top: "15%",
    left: "50%"
  },
  {
    id: 3,
    label: "Passaportes Cheios",
    emoji: "✈️",
    description: "Pegar aviões longos e explorar cantos misteriosos do planeta, de mãos dadas, rindo de piadas bobas em hotéis engraçados.",
    top: "45%",
    left: "80%"
  },
  {
    id: 4,
    label: "Envelhecer Sorrindo",
    emoji: "👵👴",
    description: "Olhar para trás daqui a muitos anos e ver que a gente cumpriu a maior meta de todas: ser incrivelmente feliz juntos.",
    top: "75%",
    left: "45%"
  }
];

export const StageGalaxy: React.FC<StageProps> = ({ onNext }) => {
  const [visitedStarIds, setVisitedStarIds] = useState<number[]>([]);
  const [hoveredStar, setHoveredStar] = useState<CosmicStar | null>(null);

  const handleStarClick = (star: CosmicStar) => {
    if (!visitedStarIds.includes(star.id)) {
      setVisitedStarIds(prev => [...prev, star.id]);
      toast.success(`Estrela "${star.label}" conectada! 🌌`, {
        icon: star.emoji,
        style: {
          border: '3px solid #ff7b89',
          borderRadius: '16px',
          fontFamily: 'Fredoka, sans-serif'
        }
      });
    }
  };

  const isCompleted = visitedStarIds.length === COSMIC_DREAMS.length;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#070714] text-white overflow-y-auto py-12 px-4 select-none flex flex-col justify-between" id="stage-galaxy">
      {/* Glittering sky ambient simulation clouds */}
      <div className="absolute inset-0 bg-[#0c0a21] opacity-65 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Title info bar */}
      <div className="z-10 text-center max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/20 border-2 border-violet-400 rounded-full text-violet-300 text-[10px] font-black uppercase tracking-widest font-mono shadow-[2px_2px_0px_#000]">
          🌌 ETAPA 08 — NOSSO FUTURO
        </span>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-violet-200 mt-2 font-sans" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          Estética: Dream Universe
        </h2>
        <p className="text-[11px] font-black text-violet-400 uppercase tracking-widest mt-1">
          Trace nossa constelação! Clique nas estrelas numeradas sequencialmente para costurar nossos sonhos cósmicos.
        </p>
      </div>

      {/* Galaxy Map Box */}
      <div className="relative w-full max-w-3xl mx-auto my-auto h-[380px] z-10 border-4 border-violet-950 bg-black/60 rounded-3xl p-6 overflow-hidden shadow-[8px_8px_0px_0px_rgba(74,59,59,0.3)]">
        
        {/* Draw dynamic lines connecting stars */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {COSMIC_DREAMS.map((star, index) => {
            if (index === 0) return null;
            const prevStar = COSMIC_DREAMS[index - 1];
            const hasLine = visitedStarIds.includes(star.id) && visitedStarIds.includes(prevStar.id);

            return (
              <motion.line
                key={index}
                x1={prevStar.left}
                y1={prevStar.top}
                x2={star.left}
                y2={star.top}
                stroke={hasLine ? "#a78bfa" : "rgba(255,255,255,0.06)"}
                strokeWidth={hasLine ? 3.5 : 1}
                className={hasLine ? "animate-pulse" : ""}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: hasLine ? 1 : 0 }}
                transition={{ duration: 0.8 }}
              />
            );
          })}
        </svg>

        {/* Floating Galaxy Nebulae style effect */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-violet-650/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 right-1/4 w-48 h-48 bg-pink-650/10 rounded-full blur-2xl pointer-events-none" />

        {/* Stars Nodes Rendering */}
        {COSMIC_DREAMS.map((star) => {
          const isVisited = visitedStarIds.includes(star.id);
          
          return (
            <div
              key={star.id}
              style={{
                top: star.top,
                left: star.left
              }}
              className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
            >
              <button
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                className={`w-11 h-11 rounded-full border-2 border-black flex items-center justify-center transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                  isVisited 
                    ? 'bg-violet-400 text-black animate-pulse' 
                    : 'bg-slate-900 border-white/20 text-white hover:border-violet-400'
                }`}
              >
                <Star className={`w-5 h-5 ${isVisited ? 'fill-black' : ''}`} />
              </button>

              <span className="text-[9px] font-mono font-black uppercase text-violet-300 mt-1.5 block tracking-widest bg-black/50 px-1.5 py-0.5 rounded border border-violet-900/30">
                {star.emoji} {star.label}
              </span>
            </div>
          );
        })}

        {/* Dream detail descriptions drawer inside gravity field */}
        <AnimatePresence>
          {hoveredStar && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-4 right-4 bg-slate-950/95 border-2 border-violet-500/50 p-4 rounded-xl text-center z-30"
            >
              <span className="text-[8px] font-mono font-black uppercase text-violet-400 tracking-widest">PROJEÇÃO COSMICA</span>
              <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 uppercase tracking-wide">
                {hoveredStar.emoji} {hoveredStar.label}
              </h4>
              <p className="text-[11px] text-violet-200 mt-1 max-w-xl mx-auto leading-relaxed">
                "{hoveredStar.description}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button to proceed to Crystal Palace */}
      <div className="z-10 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          disabled={!isCompleted}
          className={`inline-flex items-center gap-3 px-8 py-3.5 border-2 border-black font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-[4px_4px_0px_#7c3aed] transition-all cursor-pointer ${
            isCompleted 
              ? 'bg-violet-100 hover:bg-white text-black active:translate-y-1' 
              : 'bg-stone-900 text-stone-600 border-stone-800 shadow-none cursor-not-allowed opacity-40'
          }`}
          onClick={onNext}
        >
          {isCompleted ? 'A GRANDE REVELAÇÃO 💎' : 'CONECTE TODAS AS ESTRELAS'} <ArrowRight className="w-4 h-4 text-pink-400" />
        </motion.button>
      </div>
    </div>
  );
};
