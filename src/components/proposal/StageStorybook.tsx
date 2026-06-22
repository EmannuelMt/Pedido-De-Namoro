import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface StageProps {
  onNext: () => void;
}

const PAGES_DATA = [
  {
    title: "O Era Uma Vez...",
    emoji: "🏰",
    text: "Era uma vez, em um canto aconchegante do universo, duas almas curiosas que caminhavam sem saber que suas estradas um dia se cruzariam. Cada uma vivia no seu próprio ritmo, sob o mesmo céu azul estrelado.",
    bg: "#fbf6ec",
    art: "✨📖🎨"
  },
  {
    title: "A Faísca Inesperada",
    emoji: "⚡",
    text: "O destino adora pregar peças e de repente... Click! Um encontro casual, um olhar diferente, ou talvez apenas uma piada boba compartilhada. Foi quando a nossa história começou a ser rascunhada a lápis.",
    bg: "#fff6f6",
    art: "🌸💌💫"
  },
  {
    title: "O Começo de Tudo",
    emoji: "🌱",
    text: "E assim abrimos o primeiro capítulo deste lindo livro que estamos escrevendo lado a lado. Cada risada, cada áudio longo e cada conversa virou um parágrafo eterno na nossa história.",
    bg: "#f0f9f6",
    art: "🧸🎒🌷"
  }
];

export const StageStorybook: React.FC<StageProps> = ({ onNext }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < PAGES_DATA.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onNext();
    }
  };

  const page = PAGES_DATA[currentPage];

  return (
    <div className="absolute inset-0 w-full h-full bg-[#f6eee3] overflow-y-auto py-12 px-4 select-none flex flex-col justify-between" id="stage-storybook">
      {/* Floating Sparkles decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4a373_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

      <div className="z-10 text-center max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border-2 border-black rounded-full text-amber-700 text-[10px] font-black uppercase tracking-widest font-mono shadow-[2px_2px_0px_#000]">
          📖 ETAPA 01 — O COMEÇO
        </span>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-amber-900 mt-2 font-sans">
          Estética: Storybook Adventure
        </h2>
      </div>

      {/* Book Container with 3D shadow and dual page cartoon look */}
      <div className="w-full max-w-4xl mx-auto my-auto z-10 px-2 sm:px-6">
        <div className="relative bg-[#faf7f2] border-[4px] border-[#4A3B3B] rounded-3xl p-5 sm:p-10 shadow-[8px_8px_0px_0px_rgba(74,59,59,1)] min-h-[380px] flex flex-col justify-between overflow-hidden">
          
          {/* Book Spine Center division line for realistic look */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-r from-black/5 via-black/15 to-transparent border-r-2 border-[#4A3B3B]/10" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, rotateY: 45, x: currentPage > 0 ? 50 : -50 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: -45, x: currentPage > 0 ? -50 : 50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-grow"
            >
              {/* Left Side: Art illustration & Big Emoji */}
              <div 
                className="flex flex-col items-center justify-center p-6 border-4 border-[#4A3B3B] rounded-2xl aspect-[4/3] sm:aspect-auto sm:min-h-[260px] text-center shadow-[4px_4px_0px_#4A3B3B]"
                style={{ backgroundColor: page.bg }}
              >
                <div className="text-6xl mb-4 filter drop-shadow-[2px_4px_0px_rgba(0,0,0,0.15)] animate-bounce">{page.emoji}</div>
                <div className="text-4xl select-none mb-3">{page.art}</div>
                <div className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mt-1">
                  Página {currentPage + 1} de {PAGES_DATA.length}
                </div>
              </div>

              {/* Right Side: Narrative text */}
              <div className="flex flex-col justify-center space-y-4 px-2 md:pl-6 text-left">
                <span className="text-[10px] font-black text-[#e84e4e] uppercase tracking-widest block">Capítulo I</span>
                <h3 
                  className="text-2xl sm:text-3xl font-black text-[#4A3B3B] leading-tight"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  {page.title}
                </h3>
                <p className="text-stone-700 text-sm sm:text-base font-medium leading-relaxed font-serif italic">
                  &ldquo;{page.text}&rdquo;
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Book Navigation controls */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-[#4A3B3B]/15 flex items-center justify-between z-15">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`px-4 py-2 border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000] ${
                currentPage === 0
                  ? 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400 border-stone-200 shadow-none'
                  : 'bg-white hover:bg-stone-50 text-black active:translate-y-0.5'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar
            </button>

            {/* Read / page turning indicators */}
            <div className="flex gap-1.5">
              {PAGES_DATA.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-full border-2 border-black ${
                    i === currentPage ? 'bg-[#e84e4e]' : 'bg-white'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextPage}
              className="px-5 py-2.5 bg-[#e84e4e] hover:bg-rose-500 text-white border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer"
            >
              {currentPage === PAGES_DATA.length - 1 ? 'Iniciar chat ✨' : 'Próxima'} 
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Narrative audio helper */}
      <div className="z-10 text-center text-xs text-stone-500 font-bold uppercase tracking-wider">
        Arraste ou clique abaixo para explorar a linha do tempo
      </div>
    </div>
  );
};
