import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Gamepad2, 
  Film, 
  Music, 
  Zap, 
  Sword, 
  Drama,
  Star,
  Clapperboard,
  Waves,
  Ghost,
  Palette,
  Tv,
  Crown,
  Disc,
  Rocket,
  Shield,
  Coffee,
  Lightbulb,
  Sparkles,
  Camera,
  BookOpen
} from 'lucide-react';

export const LoadingScreen: React.FC<{ onFinished?: () => void }> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Exactly 10 stages covering all requested categories
  const popReferences = [
    { text: "COLETANDO MOEDAS NO REINO COGUMELO", icon: <Crown size={120} />, color: "#ff4757", tag: "GAMES", ref: "Mario Bros" },
    { text: "INVOCANDO O DRAGÃO SHENLONG", icon: <Star size={120} />, color: "#ffa502", tag: "ANIME", ref: "Dragon Ball Z" },
    { text: "ATIVANDO O SENTIDO ARANHA", icon: <Zap size={120} />, color: "#2f3542", tag: "HQ/COMICS", ref: "Spider-Man" },
    { text: "FUGINDO PARA O MUNDO INVERTIDO", icon: <Tv size={120} />, color: "#eb4d4b", tag: "SÉRIES", ref: "Stranger Things" },
    { text: "NAVEGANDO POR UMA GALÁXIA DISTANTE", icon: <Rocket size={120} />, color: "#2ed573", tag: "CINEMA", ref: "Star Wars" },
    { text: "SUBINDO AS CORTINAS DO MUSICAL", icon: <Drama size={120} />, color: "#5352ed", tag: "TEATRO", ref: "Broadway" },
    { text: "SINTONIZANDO A SÉTIMA SINFONIA", icon: <Music size={120} />, color: "#3742fa", tag: "MÚSICA", ref: "Beethoven" },
    { text: "DESENHANDO UM MUNDO DE FANTASIA", icon: <Palette size={120} />, color: "#ff7f50", tag: "DESENHOS", ref: "Disney" },
    { text: "ABRINDO O ALMANAQUE DE AVENTURAS", icon: <BookOpen size={120} />, color: "#70a1ff", tag: "LITERATURA", ref: "Harry Potter" },
    { text: "ATIVANDO O PROTOCOLO BEIJO MÁGICO", icon: <Heart size={120} />, color: "#ff6b81", tag: "ROMANCE", ref: "Nós" }
  ];

  useEffect(() => {
    const duration = 6000; // 6 seconds for 10 stages
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Sync index with progress (10 steps)
  useEffect(() => {
    const step = 100 / popReferences.length;
    const nextIdx = Math.min(Math.floor(progress / step), popReferences.length - 1);
    setCurrentIdx(nextIdx);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100 && onFinished) {
      const timeout = setTimeout(onFinished, 800);
      return () => clearTimeout(timeout);
    }
  }, [progress, onFinished]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ 
          opacity: 0, 
          scale: 1.5, 
          filter: "blur(40px)", 
          transition: { duration: 1, ease: "anticipate" } 
        }}
        className="fixed inset-0 z-[9999] bg-[#fdfaf3] flex flex-col items-center justify-center p-0 overflow-hidden select-none font-sans"
      >
        {/* CARTOON HALFTONE BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-multiply">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(#000 15%, transparent 16%)', 
            backgroundSize: '30px 30px' 
          }} />
        </div>

        {/* FLOATING POP STICKERS (DYNAMIC) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {popReferences.map((ref, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, scale: 0 }}
               animate={currentIdx === i ? { 
                 opacity: 0.15, 
                 scale: [1, 1.2, 1],
                 rotate: [0, 5, -5, 0]
               } : { opacity: 0, scale: 0 }}
               className="absolute text-black"
               style={{ 
                 top: `${(i * 15 + 20) % 80}%`, 
                 left: `${(i * 25 + 10) % 90}%`
               }}
             >
                {ref.icon}
             </motion.div>
          ))}
        </div>

        <div className="w-full h-full flex flex-col items-center justify-center gap-12 relative z-10 px-6">
          
          {/* HEADER TAGS */}
          <div className="flex gap-6 mb-8">
             <motion.div 
               animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="bg-[#ff90e8] text-black border-[5px] border-black px-10 py-3 rounded-2xl font-black uppercase text-[14px] tracking-[0.3em] shadow-[10px_10px_0_0_#000]"
             >
                LOADING MEMORIES
             </motion.div>
             <motion.div 
               animate={{ y: [5, -5, 5], rotate: [2, -2, 2] }}
               transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
               className="bg-[#4ade80] text-black border-[5px] border-black px-10 py-3 rounded-2xl font-black uppercase text-[14px] tracking-[0.3em] shadow-[10px_10px_0_0_#000]"
             >
                STAGE {currentIdx + 1}/10
             </motion.div>
          </div>

          <div className="w-full max-w-6xl">
            {/* CARTOON "TV" CONSOLE */}
            <div className="bg-white border-[12px] border-black p-12 md:p-24 rounded-[5rem] md:rounded-[8rem] shadow-[40px_40px_0px_0px_#000] w-full flex flex-col items-center text-center gap-14 overflow-hidden relative">
              
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50" />

              {/* CENTRAL ICON WINDOW */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIdx}
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 2, rotate: 90, opacity: 0 }}
                    className="w-48 h-48 md:w-80 md:h-80 border-[10px] border-black rounded-[4rem] flex items-center justify-center shadow-[24px_24px_0_0_#000] relative z-10 overflow-hidden"
                    style={{ backgroundColor: popReferences[currentIdx].color }}
                  >
                     {/* Static noise texture */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
                    
                    <div className="text-white drop-shadow-[8px_8px_0px_rgba(0,0,0,0.8)] z-20">
                      {React.cloneElement(popReferences[currentIdx].icon as React.ReactElement, { size: 160 })}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* ANIMATED STICKERS */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [12, 15, 12] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute -top-16 -right-16 bg-yellow-400 border-[8px] border-black p-8 rounded-3xl shadow-[12px_12px_0_0_#000] z-30"
                >
                  <Zap className="w-16 h-16 text-black fill-black" strokeWidth={4} />
                </motion.div>
                
                <motion.div 
                  animate={{ scale: [1.2, 1, 1.2], rotate: [-12, -15, -12] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="absolute -bottom-16 -left-16 bg-rose-500 border-[8px] border-black p-8 rounded-full shadow-[12px_12px_0_0_#000] z-30"
                >
                  <Heart className="w-16 h-16 text-white fill-white" />
                </motion.div>
              </div>

              {/* DESCRIPTION SECTION */}
              <div className="flex flex-col items-center gap-10 w-full">
                <div className="bg-black text-white px-8 py-2 rounded-full border-[6px] border-black text-[16px] font-black uppercase tracking-[0.5em] shadow-[6px_6px_0_0_#ff90e8]">
                  {popReferences[currentIdx].tag} SYSTEM
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentIdx}
                    initial={{ y: 50, opacity: 0, skewX: 20 }}
                    animate={{ y: 0, opacity: 1, skewX: 0 }}
                    exit={{ y: -50, opacity: 0, skewX: -20 }}
                    className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] text-black h-40 md:h-56 flex items-center justify-center px-8"
                  >
                    {popReferences[currentIdx].text}
                  </motion.h2>
                </AnimatePresence>

                {/* PROGRESS ENGINE */}
                <div className="w-full max-w-4xl flex flex-col gap-10">
                  <div className="flex justify-between items-end px-6">
                    <span className="text-[16px] font-black text-black/30 uppercase tracking-[1em] italic animate-pulse">
                       Step {currentIdx + 1} of 10
                    </span>
                    <span className="text-7xl md:text-9xl font-black italic text-black tracking-tighter leading-none">
                      {Math.floor(progress)}%
                    </span>
                  </div>
                  
                  {/* HUGE CARTOON PROGRESS BAR */}
                  <div className="h-24 md:h-32 w-full bg-[#fdfaf3] border-[10px] border-black rounded-[4rem] p-4 relative overflow-hidden shadow-[20px_20px_0_0_#000]">
                     <motion.div 
                       className="h-full bg-[#f43f5e] rounded-[2.5rem] flex items-center justify-end pr-10 relative overflow-hidden border-r-[10px] border-black"
                       style={{ width: `${progress}%` }}
                       transition={{ ease: "linear" }}
                     >
                        {/* Huge pattern stripe */}
                        <div className="absolute inset-0 opacity-40 shadow-inner" style={{ 
                          backgroundImage: 'linear-gradient(45deg, white 25%, transparent 25%, transparent 50%, white 50%, white 75%, transparent 75%, transparent)',
                          backgroundSize: '60px 60px'
                        }} />
                        
                        <div className="bg-white border-[6px] border-black p-4 rounded-2xl shadow-[8px_8px_0_0_#000] rotate-12 relative z-10">
                           <Sparkles className="w-12 h-12 text-[#f43f5e] fill-[#f43f5e]" />
                        </div>
                     </motion.div>
                  </div>
                </div>
              </div>

              {/* CARTOON TV KNOBS */}
              <div className="flex gap-10 pt-8 w-full justify-between px-10">
                 <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full border-[8px] border-black bg-stone-200 shadow-[6px_6px_0_0_#000]" />
                    <div className="w-16 h-16 rounded-full border-[8px] border-black bg-stone-200 shadow-[6px_6px_0_0_#000]" />
                 </div>
                 <div className="flex gap-6 items-center">
                    <div className="w-24 h-8 bg-sky-400 border-[6px] border-black rounded-full shadow-[4px_4px_0_0_#000]" />
                    <div className="w-24 h-8 bg-rose-400 border-[6px] border-black rounded-full shadow-[4px_4px_0_0_#000]" />
                 </div>
              </div>
            </div>
          </div>

          {/* STREET STYLE MARQUEE FOOTER */}
          <div className="mt-10 w-[120vw] bg-black border-[10px] border-black py-10 overflow-hidden shadow-[30px_30px_0_0_#fbbf24] -rotate-1 relative">
            <div className="flex gap-32 animate-scroll-x whitespace-nowrap px-16">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-32 items-center">
                  <span className="text-white font-black uppercase italic text-[24px] md:text-[32px] tracking-[0.8em]">
                    GAMES • ANIME • CINEMA • TEATRO • MÚSICA • HQ • SÉRIES • DESENHOS • ROMANCE • ARTE
                  </span>
                  <div className="w-8 h-8 bg-[#4ade80] rounded-full shadow-[0_0_20px_#4ade80]" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* NEO-BRUTALIST DECO ELEMENTS */}
        <div className="absolute top-10 left-10 w-32 h-32 border-t-[15px] border-l-[15px] border-[#4ade80] z-50 pointer-events-none" />
        <div className="absolute top-10 right-10 w-32 h-32 border-t-[15px] border-r-[15px] border-[#ff90e8] z-50 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-32 h-32 border-b-[15px] border-l-[15px] border-[#fbbf24] z-50 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border-b-[15px] border-r-[15px] border-[#f43f5e] z-50 pointer-events-none" />
        
        {/* CRT FILTER NOISE */}
        <div className="absolute inset-0 pointer-events-none z-[500] opacity-[0.08] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.08),rgba(0,255,0,0.04),rgba(0,0,255,0.08))] bg-[length:100%_4px,5px_100%]" />

      </motion.div>
    </AnimatePresence>
  );
};
