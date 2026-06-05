import React, { useEffect, useRef } from 'react';
import './ModernLandingLayout.css';
import { PlayCircle, Image as ImageIcon, Music, Heart, MessageSquare, Gamepad2, Star, Settings, ArrowRight, Sparkles, Compass, Fingerprint, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

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
      
      {/* Immersive Background Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[150px]" />
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] px-4"
      >
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center text-center w-full max-w-5xl">
          <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/60 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
            <Sparkles size={14} className="text-rose-400" /> 
            <span>Conexão Digital Estabelecida</span>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="relative mb-6">
            <span className="sr-only">Nosso Amor</span>
            <div className="text-[12vw] md:text-[8vw] font-bold leading-none tracking-tighter flex flex-col items-center relative z-10">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">Nosso</span>
              <span className="font-serif italic text-rose-200/90 ml-12 md:ml-24 mt-[-2%]">Amor</span>
            </div>
            {/* Background glowing text */}
            <div className="absolute top-0 left-0 w-full h-full text-[12vw] md:text-[8vw] font-bold leading-none tracking-tighter flex flex-col items-center blur-2xl opacity-30 pointer-events-none select-none">
              <span className="text-white">Nosso</span>
              <span className="font-serif italic text-rose-500 ml-12 md:ml-24 mt-[-2%]">Amor</span>
            </div>
          </motion.h1>

          <motion.p variants={fadeUp} className="font-light text-xl md:text-2xl opacity-70 leading-relaxed max-w-2xl mt-4">
              Uma plataforma exclusiva para documentar, celebrar e eternizar nossa história.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-16 flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <button onClick={() => setView('historia')} className="group relative px-8 py-4 bg-white text-black rounded-full font-medium overflow-hidden w-full sm:w-auto shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] transition-all duration-500">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-rose-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-center gap-3">
                <Heart size={18} className="text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform duration-500" /> 
                <span>Explorar Jornada</span>
              </div>
            </button>
            <button onClick={() => setView('pedido')} className="group px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 hover:border-white/40 transition-all duration-500 flex items-center justify-center gap-3 w-full sm:w-auto">
              <Star size={18} className="text-indigo-300 group-hover:rotate-180 transition-transform duration-700" /> 
              <span>Surpresa Especial</span>
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50"
        >
          <span className="text-[10px] uppercase tracking-widest font-mono">Descubra</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </motion.section>

      <section className="relative z-10 pb-32">
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


