import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, ShieldAlert, Award, Star, Heart, ArrowRight } from 'lucide-react';

interface StageProps {
  onNext: () => void;
}

interface AchievementBadge {
  title: string;
  emoji: string;
  description: string;
  category: string;
  color: string;
}

const BADGES: AchievementBadge[] = [
  {
    title: "Leitor Encantado",
    emoji: "📖",
    description: "Abriu as portas do nosso livro da vida e releu as primeiras páginas fofas.",
    category: "História",
    color: "bg-orange-100 text-orange-700"
  },
  {
    title: "Sintonia no Chat",
    emoji: "💬",
    description: "Reassistiu as conversas inocentes de quando estávamos começando a nos apaixonar.",
    category: "Diálogo",
    color: "bg-sky-100 text-sky-700"
  },
  {
    title: "Muralista de Lembranças",
    emoji: "📷",
    description: "Espalhou e organizou com carinho a nossa galeria perfeita de polaroid.",
    category: "Nostalgia",
    color: "bg-purple-100 text-purple-700"
  },
  {
    title: "Floricultor do Coração",
    emoji: "🌸",
    description: "Regou cada flor para extrair a essência das nossas melhores risadas sinceras.",
    category: "Sentimentos",
    color: "bg-pink-100 text-[#e84e4e]"
  },
  {
    title: "Mestre do Ritmo",
    emoji: "🎵",
    description: "Reproduziu o disco de vinil com as faixas eternizadas da nossa sintonia.",
    category: "Áudio",
    color: "bg-yellow-100 text-yellow-700"
  },
  {
    title: "Herói de Fliperama",
    emoji: "🎮",
    description: "Superou as rodadas do Quiz Love e sacramentou a pontuação máxima de cumplicidade.",
    category: "Desafios",
    color: "bg-rose-100 text-rose-700"
  },
  {
    title: "Cartógrafo Lendário",
    emoji: "🗺️",
    description: "Navegou pelo mapa RPG revelando segredos de medos, planos e sonhos.",
    category: "Mundo",
    color: "bg-teal-100 text-teal-700"
  },
  {
    title: "Arquiteto Astral",
    emoji: "🌌",
    description: "Costurou os pontos estelares consolidando a nossa constelação intocável.",
    category: "Futuro",
    color: "bg-indigo-100 text-indigo-700"
  }
];

export const StageCrystal: React.FC<StageProps> = ({ onNext }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#f3e8ff] overflow-y-auto py-12 px-4 select-none flex flex-col justify-between" id="stage-crystal">
      {/* Sparkles background effect */}
      <div className="absolute inset-0 bg-[#edd8fc]/50 bg-[radial-gradient(#b800ff_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

      {/* Header bar */}
      <div className="z-10 text-center max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-200/50 border-2 border-purple-650 rounded-full text-purple-700 text-[10px] font-black uppercase tracking-widest font-mono shadow-[2px_2px_0px_#000]">
          💎 ETAPA 09 — A GRANDE REVELAÇÃO
        </span>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-purple-900 mt-2 font-sans">
          Estética: Crystal Palace
        </h2>
        <p className="text-[11px] font-black text-purple-800 uppercase tracking-widest mt-1">
          Recapitulando a caminhada! Veja as conquistas memoráveis que vocês alcançaram até aqui.
        </p>
      </div>

      {/* Majestic Achievement Showcase Grid Shelf */}
      <div className="w-full max-w-4xl mx-auto my-auto z-10 p-5 sm:p-8 bg-white border-[4px] border-black rounded-[28px] shadow-[8px_8px_0px_#4A3B3B] space-y-6">
        
        <div className="pb-4 border-b-2 border-dashed border-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600 animate-bounce" />
            <h3 className="text-md sm:text-lg font-black uppercase tracking-tight text-slate-900">
              Prateleira de Conquistas Celestiais
            </h3>
          </div>
          <span className="text-[10px] font-mono font-black text-purple-500 uppercase tracking-widest">
            🏆 8/8 COMPLETOS
          </span>
        </div>

        {/* 4x2 or responsive grid layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-h-[290px] overflow-y-auto scrollbar-thin p-1">
          {BADGES.map((badge, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-purple-50/50 border-2 border-black rounded-2xl p-3 flex flex-col justify-between space-y-1 text-left relative overflow-hidden shadow-[2px_2px_0px_#000]"
            >
              <div className="flex justify-between items-start">
                <span className="text-2xl">{badge.emoji}</span>
                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border border-black/10 ${badge.color}`}>
                  {badge.category}
                </span>
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-slate-800 tracking-tight leading-tight mt-1.5">
                  {badge.title}
                </h4>
                <p className="text-[9px] text-stone-500 font-medium leading-tight mt-0.5 mt-1 line-clamp-2">
                  {badge.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic summarizing message to build up emotion */}
        <div className="text-center rounded-xl bg-purple-50 border-2 border-black p-3 text-xs font-serif italic text-purple-950 font-semibold">
          &ldquo;Tudo conquistado outrora pavimenta o presente. Agora que relemos cada passo, resta o maior e mais precioso de todos os capítulos...&rdquo; ✨❤️
        </div>
      </div>

      {/* Trigger forward button */}
      <div className="z-10 text-center">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNext}
          className="inline-flex items-center gap-3 px-10 py-4 bg-purple-650 hover:bg-purple-800 text-white border-2 border-black font-black uppercase text-[12px] tracking-widest rounded-2xl shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all cursor-pointer animate-pulse"
        >
          O PEDIDO OFICIAL ❤️ <ArrowRight className="w-4 h-4 text-pink-300 animate-bounce" />
        </motion.button>
      </div>
    </div>
  );
};
