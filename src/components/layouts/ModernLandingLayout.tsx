import React, { useEffect, useRef, useState } from 'react';
import './ModernLandingLayout.css';
import { PlayCircle, Image as ImageIcon, Music, Heart, MessageSquare, Gamepad2, Star, Settings, ArrowRight, Sparkles, Compass, Fingerprint, ChevronDown, Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

export const ModernLandingLayout = ({ setView, universeData, PLAYLIST_DATA, GALLERY_DATA, ALBUMS_DATA, SHARED_GAMES }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, 50]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div ref={containerRef} className="modern-landing-wrapper bg-[#0a0a0a] text-[#f7f7f5] font-sans relative overflow-x-hidden selection:bg-rose-500/30">
      
      {/* Immersive Background Ambient for dark sections */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[150px]" />
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY, fontFamily: "'Poppins', sans-serif" }}
        className="relative z-10 pt-32 pb-32 md:pt-44 md:pb-44 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-white bg-cover bg-center bg-no-repeat text-slate-800 text-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-b-[3rem] sm:rounded-b-[5rem] overflow-hidden"
      >
        <div className="flex flex-col-reverse gap-10 md:flex-row px-4 md:px-16 lg:px-24 xl:px-32 mt-12 md:mt-24 items-center"> 
            <div className="max-md:text-center flex-1">
                <h5 className="text-4xl md:text-5xl lg:text-6xl/[76px] font-semibold max-w-xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#6D8FE4] text-transparent bg-clip-text">
                    Construindo momentos inesquecíveis juntos
                </h5>

                <p className="text-sm md:text-base max-w-lg mx-auto md:mx-0 mt-6 text-slate-600 leading-relaxed">
                    Uma plataforma exclusiva para documentar, celebrar e eternizar nossa história. Cada clique é uma nova lembrança sendo revivida com amor e carinho.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-8">
                    <button onClick={() => setView('historia')} className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium active:scale-95 transition-all shadow-xl shadow-indigo-600/30 w-full sm:w-auto" type="button">
                        Nossa História
                    </button>
                    <button onClick={() => setView('galeria')} className="px-6 py-3.5 rounded-xl bg-white text-slate-700 border border-slate-200 flex justify-center items-center gap-2 hover:bg-slate-50 hover:border-indigo-200 active:scale-95 transition-all font-medium shadow-sm w-full sm:w-auto" type="button">
                        <Sparkles size={18} className="text-indigo-500" />
                        <span>Ver Álbuns</span>
                    </button>
                </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-[4/5] sm:aspect-square overflow-hidden rounded-[2rem] shadow-2xl rotate-2 hover:rotate-1 transition-all duration-700">
                  <img className="absolute inset-0 w-full h-full object-cover" src={universeData?.settings?.gallery?.[4] || universeData?.settings?.gallery?.[0] || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200"} alt="Hero" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
      </motion.section>

      <section className="relative z-10 pb-32 pt-16">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-150px" }} variants={fadeUp}
          className="max-w-[90vw] md:max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] relative aspect-[16/9] md:aspect-[21/9] flex items-center justify-center bg-black group cursor-pointer" 
          onClick={() => setView('playlist')}
        >
            {universeData?.settings?.gallery?.[0] ? (
              <img src={universeData.settings.gallery[0]} alt="Nossa Memória" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-[1.03] group-hover:opacity-80 transition-all duration-1000" />
            ) : (
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-rose-500/20 group-hover:scale-[1.03] transition-transform duration-1000" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
            
            <button className="relative z-10 w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]">
               <PlayCircle size={40} className="ml-2" />
            </button>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div>
                <p className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2">Trilha Sonora</p>
                <p className="text-2xl font-serif italic text-white flex items-center gap-3">
                  <Music size={20} className="opacity-80" /> Nossa Sintonia
                </p>
              </div>
              <div className="hidden md:flex gap-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-1 bg-white/60 rounded-full animate-pulse" style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
        </motion.div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 md:gap-8 justify-between">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="w-full md:w-1/3 flex flex-col justify-center">
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-white/50 w-fit">
              <Fingerprint size={12} className="text-indigo-400" /> Ecossistema
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-light tracking-tight mb-6 leading-tight">
              Tudo em <br/><span className="font-serif italic text-indigo-200">um só lugar.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg opacity-60 leading-relaxed mb-8">
              Arquivamos nossas memórias, fotos e sentimentos em um sistema impulsionado pela nossa conexão. Feito para nós.
            </motion.p>
            <motion.button variants={fadeUp} onClick={() => setView('galeria')} className="flex items-center gap-3 text-white/80 hover:text-white pb-2 border-b border-white/20 hover:border-white/60 transition-all w-fit group">
              Abrir Galeria <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>

          <div className="w-full md:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="group cursor-pointer" onClick={() => setView('albuns')}>
              <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 h-full flex flex-col hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-white/5 flex items-center justify-center mb-16 group-hover:scale-110 transition-transform duration-500">
                  <ImageIcon size={24} className="text-purple-300" />
                </div>
                <h3 className="text-2xl font-medium mb-3">Álbuns & Fotos</h3>
                <p className="opacity-50 leading-relaxed font-light mt-auto">Coleção visual de {GALLERY_DATA?.length || 0} momentos preservados.</p>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} transition={{ delay: 0.1 }} className="group cursor-pointer" onClick={() => setView('cartas')}>
              <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 h-full flex flex-col hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/10 to-transparent border border-white/5 flex items-center justify-center mb-16 group-hover:scale-110 transition-transform duration-500">
                  <MessageSquare size={24} className="text-rose-300" />
                </div>
                <h3 className="text-2xl font-medium mb-3">Cartas de Amor</h3>
                <p className="opacity-50 leading-relaxed font-light mt-auto">Declarações atemporais criptografadas em nossos corações.</p>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="group cursor-pointer sm:col-span-2" onClick={() => setView('jogos')}>
              <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-[2rem] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 hover:border-white/20 transition-all duration-500">
                <div>
                  <h3 className="text-2xl font-medium mb-3 flex items-center gap-3">
                    <Gamepad2 size={24} className="text-emerald-400" /> Experiências
                  </h3>
                  <p className="opacity-50 leading-relaxed font-light max-w-md">Divirta-se com {SHARED_GAMES?.length || 0} dinâmicas interativas criadas para nos aproximar ainda mais.</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowRight size={20} className="group-hover:-rotate-45 transition-transform" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 relative z-10 border-t border-white/5 mt-16 bg-gradient-to-b from-transparent to-black">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
            <Heart size={32} className="text-rose-500 fill-rose-500/20" />
          </div>
          <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight">
            Nossa história não acaba aqui. <br/>
            <span className="font-serif italic text-white/50">Ela está apenas começando.</span>
          </h2>
          <p className="text-xl opacity-60 max-w-2xl mx-auto mb-16 leading-relaxed">
            Cada clique é uma memória. Cada visualização é um abraço. Continue explorando nosso universo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
            <button onClick={() => setView('historia')} className="px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
               Ver Linha do Tempo
            </button>
            <button className="px-10 py-5 rounded-full border border-white/20 text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-3">
               <Settings size={20} className="opacity-50" /> Configurações
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
};


