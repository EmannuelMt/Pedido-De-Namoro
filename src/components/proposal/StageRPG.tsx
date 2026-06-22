import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, ArrowRight, Shield, Heart, HelpCircle, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

interface StageProps {
  onNext: () => void;
}

interface MapRegion {
  id: 'sonhos' | 'medos' | 'objetivos' | 'planos';
  name: string;
  emoji: string;
  icon: any;
  color: string;
  themeStyle: string;
  description: string;
  narrative: string;
  coords: { top: string; left: string };
}

const RPG_REGIONS: MapRegion[] = [
  {
    id: 'sonhos',
    name: 'Castelo dos Sonhos',
    emoji: '🏰',
    icon: Heart,
    color: '#ECC94B',
    themeStyle: 'bg-yellow-50 border-yellow-500 text-yellow-900',
    description: 'Nossa maior aspiração de vida lado a lado.',
    narrative: 'Meu maior sonho de todos é poder acordar bem cedinho, olhar para o lado e ver seu rostinho calmo descansando. Quero que a gente escreva um livro de aventuras reais pelo mundo, colecionando carimbos no passaporte e memórias na nossa mente.',
    coords: { top: '22%', left: '26%' }
  },
  {
    id: 'medos',
    name: 'Floresta dos Medos',
    emoji: '🌲',
    icon: Shield,
    color: '#4A5568',
    themeStyle: 'bg-slate-50 border-slate-500 text-slate-900',
    description: 'Nossas vulnerabilidades compartilhadas em silêncio.',
    narrative: 'Admito que às vezes tenho medo da distância, ou de não conseguir expressar em palavras todo o amor colossal que tenho dentro de mim. Mas quando ouço sua risada ou recebo sua mensagem, todo esse nevoeiro cinza desaparece na floresta.',
    coords: { top: '35%', left: '72%' }
  },
  {
    id: 'objetivos',
    name: 'Montanha de Objetivos',
    emoji: '⛰️',
    icon: GraduationCap,
    color: '#319795',
    themeStyle: 'bg-teal-50 border-teal-500 text-teal-900',
    description: 'Nossas metas de evolução profissional e individual.',
    narrative: 'Meu objetivo definitivo é apoiar cada vitória sua, comemorando cada diploma, com passos firmes. Quero ser seu porto seguro nas noites cansativas de estudos e seu fã número um em todas as apresentações da sua caminhada.',
    coords: { top: '65%', left: '30%' }
  },
  {
    id: 'planos',
    name: 'Porto de Planos',
    emoji: '⚓',
    icon: Map,
    color: '#3182CE',
    themeStyle: 'bg-blue-50 border-blue-500 text-blue-900',
    description: 'Nossos planos estruturados taticamente para o futuro.',
    narrative: 'Nossos planos incluem comprar um sofá fofo, ter canecas combinando na cozinha, adotar dois gatinhos brincando pela sala de estar e rascunhar o jardim das nossas vidas. É um plano que se renova a cada segundo ao seu lado.',
    coords: { top: '75%', left: '76%' }
  }
];

export const StageRPG: React.FC<StageProps> = ({ onNext }) => {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [activeRegion, setActiveRegion] = useState<MapRegion | null>(null);

  const handleRegionClick = (region: MapRegion) => {
    setActiveRegion(region);
    if (!unlockedIds.includes(region.id)) {
      setUnlockedIds(prev => [...prev, region.id]);
      toast.success(`Região "${region.name}" desbloqueada! 🗺️`, {
        icon: region.emoji,
        style: {
          border: '3px solid #000',
          borderRadius: '16px',
          fontWeight: 'bold',
          fontFamily: 'Fredoka, sans-serif'
        }
      });
    }
  };

  const allUnlocked = unlockedIds.length === RPG_REGIONS.length;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#EBF8FF] overflow-y-auto py-12 px-4 select-none flex flex-col justify-between" id="stage-rpg">
      {/* RPG grid map overlay style */}
      <div className="absolute inset-0 bg-[#E2E8F0]/55 bg-[radial-gradient(#3182ce_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />

      {/* Header text info block */}
      <div className="z-10 text-center max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 border-2 border-blue-600 rounded-full text-blue-700 text-[10px] font-black uppercase tracking-widest font-mono shadow-[2px_2px_0px_#000]">
          🗺️ ETAPA 07 — MEU MUNDO
        </span>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-blue-900 mt-2 font-sans">
          Estética: Fantasy World Map
        </h2>
        <p className="text-[11px] font-black text-blue-800 uppercase tracking-widest mt-1">
          Explore o mapa! Clique em cada região flutuante para revelar e desbravar meu mundo inteiro.
        </p>
      </div>

      {/* Fantasy Map Board Canvas */}
      <div className="relative w-full max-w-3xl mx-auto my-auto h-[385px] z-10 border-4 border-black bg-gradient-to-tr from-teal-50 via-amber-50 to-emerald-50 rounded-3xl p-6 overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,1)]">
        
        {/* Visual path markers between locations to show route connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-current text-dashed text-slate-400 stroke-2" style={{ strokeDasharray: '6 6' }}>
          <path d="M 230 110 Q 380 120 540 145" />
          <path d="M 540 145 Q 490 280 570 295" />
          <path d="M 230 110 Q 240 220 260 255" />
          <path d="M 260 255 Q 420 280 570 295" />
        </svg>

        {/* Dynamic compass rose top right corner */}
        <div className="absolute top-4 right-4 text-center border-2 border-black bg-white rounded-full p-2 h-14 w-14 flex items-center justify-center font-mono font-black text-[9px] shadow-[2px_2px_0px_#000] z-0">
          N<br />🧭<br />S
        </div>

        {/* Map landmarks triggers clickable */}
        {RPG_REGIONS.map((reg) => {
          const isClicked = unlockedIds.includes(reg.id);
          const Icon = reg.icon;

          return (
            <button
              key={reg.id}
              onClick={() => handleRegionClick(reg)}
              style={{
                top: reg.coords.top,
                left: reg.coords.left
              }}
              className="absolute z-25 flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all focus:outline-none"
            >
              {/* Landmark bounce emoji */}
              <div className="text-4xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] animate-bounce" style={{ animationDuration: '3.5s' }}>
                {reg.emoji}
              </div>

              {/* Tag Name labels */}
              <div className={`mt-1.5 border-2 border-black rounded-xl px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-[2px_2px_0px_#000] flex items-center gap-1.5 ${
                isClicked 
                  ? 'bg-emerald-400 text-black' 
                  : 'bg-white text-stone-900 hover:bg-stone-50'
              }`}>
                <Icon size={10} /> {reg.name}
              </div>
            </button>
          );
        })}

        {/* Region content panel inside popups */}
        <AnimatePresence>
          {activeRegion && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`absolute top-4 left-4 bottom-4 w-72 sm:w-80 border-3 border-black p-4 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] z-30 overflow-y-auto flex flex-col justify-between ${activeRegion.themeStyle}`}
            >
              {/* Detailed narrative overview */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b-2 border-black/10 pb-2">
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#2c3e50]/70">
                    Santuário de Exploração
                  </span>
                  <button 
                    onClick={() => setActiveRegion(null)}
                    className="text-[10px] text-red-500 font-bold hover:underline"
                  >
                    Fechar ✕
                  </button>
                </div>

                <div>
                  <h4 className="text-md font-black uppercase tracking-tight flex items-center gap-1.5">
                    {activeRegion.emoji} {activeRegion.name}
                  </h4>
                  <p className="text-[10px] font-bold uppercase opacity-80 mt-0.5">
                    {activeRegion.description}
                  </p>
                </div>

                <p className="text-[11px] font-serif italic leading-relaxed pt-1.5 border-t border-dashed border-black/10 select-text">
                  &ldquo;{activeRegion.narrative}&rdquo;
                </p>
              </div>

              {/* Progress unlocked statistics */}
              <div className="pt-3 border-t border-dashed border-black/15 text-[8px] font-black uppercase tracking-wider text-right">
                Desbloqueio: {unlockedIds.length}/4 Regiões
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer target navigation trigger */}
      <div className="z-10 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          disabled={!allUnlocked}
          onClick={onNext}
          className={`inline-flex items-center gap-3 px-8 py-3.5 border-2 border-black font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-[4px_4px_0px_#3182CE] transition-all cursor-pointer ${
            allUnlocked 
              ? 'bg-[#EBF8FF] hover:bg-white text-black active:translate-y-1' 
              : 'bg-stone-800 text-stone-500 border-stone-700 shadow-none cursor-not-allowed opacity-50'
          }`}
        >
          {allUnlocked ? 'CONSTRUIR CONSTELAÇÕES 🌌' : 'DESBLOQUEIE TODAS AS REGIÕES'} <ArrowRight className="w-4 h-4 text-amber-300" />
        </motion.button>
      </div>
    </div>
  );
};
