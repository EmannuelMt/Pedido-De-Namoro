import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useMotionValue,
} from "motion/react";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Music,
  Heart,
  Cloud,
  LockOpen,
  Star,
  X,
} from "lucide-react";
import { PageLayout } from "../App";

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  details: string;
  icon: any;
  image?: string;
  side: "left" | "right";
  locked?: boolean;
  music?: string;
  location?: string;
  emotion?: string;
  weather?: string;
  hiddenMessage?: string;
}

const ParticlesReveal = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
      {[...Array(30)].map((_, i) => {
        const xDir = (Math.random() - 0.5) * 100;
        const yDir = (Math.random() - 0.5) * 100;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            initial={{ opacity: 1, scale: 0, x: "-50%", y: "-50%" }}
            whileInView={{
              opacity: [0, 1, 0],
              scale: [0, Math.random() * 2 + 1, 0],
              x: `calc(-50% + ${xDir}px)`,
              y: `calc(-50% + ${yDir}px)`,
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 1.5 + Math.random() * 1.5,
              ease: "easeOut",
              delay: Math.random() * 0.5,
            }}
          />
        );
      })}
    </div>
  );
};

export const TimelineView = ({
  timelineData,
  onNavigate,
}: {
  timelineData: TimelineItem[];
  onNavigate: (v: any) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSecret, setSelectedSecret] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001,
  });

  // Calculate days together
  const startDate = new Date("2023-06-14");
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <PageLayout
      title="Nossa"
      subtitle="Jornada"
      description="Uma constelação de momentos que formam a nossa história."
      onNavigate={onNavigate}
      currentView="historia"
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl mx-auto px-4 py-32 overflow-hidden"
      >
        {/* Animated Wavy Constellation Background */}
        <div className="absolute inset-0 pointer-events-none hidden md:block z-0">
          <svg
            className="w-full h-[calc(100%-400px)] absolute top-0"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
            fill="none"
          >
            <motion.path
              d="M 50 0 C 65 15, 30 30, 50 50 C 70 70, 35 85, 50 100"
              stroke="white"
              strokeOpacity="0.03"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d="M 50 0 C 65 15, 30 30, 50 50 C 70 70, 35 85, 50 100"
              stroke="url(#glow)"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength }}
            />
            <defs>
              <linearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.05" />
                <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Minimal Time Navigation Decorator */}
        <div className="fixed left-6 md:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-16 z-40 pointer-events-none opacity-50 mix-blend-screen">
          <div className="absolute top-0 bottom-0 w-[1px] bg-white/10" />
          <motion.div 
            className="absolute top-0 bottom-0 w-[1px] bg-[var(--primary)]" 
            style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
          />
          <motion.div 
            className="absolute top-0 bottom-0 w-[3px] bg-[var(--primary)] blur-[4px]" 
            style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
          />
          {timelineData.map((item, i) => (
             <div key={i} className="flex relative items-center justify-center">
                <div className="absolute left-6 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 whitespace-nowrap">{item.year.split(/[, ]+/).pop()}</div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 z-10" />
             </div>
          ))}
          <div className="flex relative items-center justify-center">
             <div className="w-2 h-2 rounded-full border border-[var(--primary)] bg-black z-10" />
          </div>
        </div>

        <div className="space-y-48 md:space-y-64 relative z-10 pt-20">
          {timelineData.map((item, idx) => (
            <TimelineNode
              key={idx}
              item={item}
              idx={idx}
              onOpenSecret={() => setSelectedSecret(item.hiddenMessage || null)}
            />
          ))}
        </div>

        {/* Closing Action */}
        <div className="mt-64 pt-32 flex flex-col items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full max-w-2xl bg-black/40 backdrop-blur-2xl border border-white/10 p-16 rounded-[3rem] text-center mb-16 relative overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,0.5)]"
          >
            {/* Pulsing glow line open path */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-32 bg-gradient-to-b from-transparent to-[var(--primary)] pointer-events-none opacity-50" />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary)]/10 to-transparent pointer-events-none"
            />
            
            <Heart size={32} className="mx-auto mb-8 text-[var(--primary)] animate-pulse" />

            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight relative z-10">
              A história continua...
            </h2>
            <p className="text-lg text-white/60 max-w-md mx-auto mb-10 relative z-10 leading-relaxed">
              O caminho está aberto. Novas constelações ainda serão formadas por nós na estrada do tempo.
            </p>
            
            <div className="flex justify-center mb-10 relative z-10">
              <div className="flex flex-col items-center group/counter cursor-default">
                <motion.span 
                  className="text-7xl font-editorial italic text-white drop-shadow-[0_0_20px_var(--primary)] transition-all duration-500 group-hover/counter:scale-110"
                >
                  {diffDays}
                </motion.span>
                <span className="text-[10px] font-sans tracking-[0.4em] uppercase mt-4 text-[var(--primary)]">
                  Dias Brilhando Juntos
                </span>
              </div>
            </div>

            {/* Path pointing downward forever */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-32 bg-gradient-to-t from-transparent to-[var(--primary)] pointer-events-none opacity-50" />
          </motion.div>

          <button
            onClick={() => onNavigate("galeria")}
            className="group relative px-12 py-5 bg-white text-black font-medium rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_var(--primary)] transition-all duration-700 z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold">
              Explorar Galeria Inteira{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-2 transition-transform"
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedSecret && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedSecret(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: -20, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, rotateX: 10, rotateY: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#fdfaf3] border border-[#d3c0a5] p-10 md:p-14 rounded-sm shadow-[0_20px_80px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(139,69,19,0.08)] overflow-hidden"
            >
              {/* Old paper texture effect via pseudo elements */}
              <div 
                className="absolute inset-0 opacity-[0.25] mix-blend-multiply pointer-events-none" 
                style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} 
              />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#d3c0a5]/30 rounded-full blur-[40px] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#d3c0a5]/20 rounded-full blur-[40px] pointer-events-none" />
              
              <button
                onClick={() => setSelectedSecret(null)}
                className="absolute top-6 right-6 text-[#8b4513]/40 hover:text-[#8b4513] transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="relative z-10 flex flex-col items-center text-center mt-2">
                <div className="w-14 h-14 rounded-full border border-[#d3c0a5] flex items-center justify-center mb-6 shadow-inner bg-[#f5ead5]/50">
                  <Star size={18} className="text-[#8b4513]" />
                </div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#8b4513]/60 mb-8 font-semibold">Memória Encriptada</h4>
                <p 
                  className="font-editorial italic text-2xl md:text-3xl text-[#3e2723] leading-[1.6] mb-10 text-balance" 
                  style={{ textShadow: "1px 1px 0 rgba(255,255,255,0.7)"}}
                >
                  "{selectedSecret}"
                </p>
                <div className="w-16 h-px bg-[#8b4513]/20 mb-6" />
                <span className="text-[10px] uppercase tracking-widest text-[#8b4513]/40 font-mono">Confidencial</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

const TimelineNode: React.FC<{
  item: TimelineItem;
  idx: number;
  onOpenSecret: () => void;
}> = ({
  item,
  idx,
  onOpenSecret,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / width - 0.5;
    const yPct = y / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const { scrollYProgress } = useScroll({
    target: nodeRef,
    offset: ["start 90%", "end center"],
  });

  const nodeScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.5, 1.2, 1],
  );
  const nodeOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 1]);

  return (
    <motion.div
      ref={nodeRef}
      className={`relative flex flex-col md:flex-row items-center gap-12 lg:gap-20 ${item.side === "right" ? "md:flex-row-reverse" : ""} group perspective-1000`}
    >
      {/* Huge Background Year Outline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`absolute top-1/2 -translate-y-1/2 ${item.side === "left" ? "right-0" : "left-0"} text-[25vw] md:text-[18vw] font-editorial italic font-bold text-transparent pointer-events-none z-0 selection:bg-transparent`}
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.03)" }}
      >
        {item.year.split(/[, ]+/).pop()}
      </motion.div>

      {/* Cinematic Star Node */}
      <motion.div
        style={{ scale: nodeScale, opacity: nodeOpacity }}
        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,1)] z-20 hidden md:block"
      >
        <div className="absolute inset-0 rounded-full bg-[var(--primary)] animate-ping opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-[var(--primary)] opacity-30 animate-[spin_10s_linear_infinite] border-dashed" />
      </motion.div>

      {/* Connection Line to Content */}
      <div
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-[calc(25%-1rem)] h-[2px] bg-gradient-to-r ${item.side === "left" ? "right-[50%] from-transparent to-[var(--primary)]/40" : "left-[50%] from-[var(--primary)]/40 to-transparent"} z-0 group-hover:opacity-100 opacity-30 transition-opacity duration-700`}
      />

      {/* Main Image Card - Particles Dissolve Entrance */}
      <div className="w-full md:w-1/2 relative z-10" style={{ perspective: 1000 }}>
        <motion.div
           onMouseMove={handleMouseMove}
           onMouseLeave={handleMouseLeave}
           style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, filter: "blur(20px) brightness(2)", scale: 1.1 }}
          whileInView={{ opacity: 1, filter: "blur(0px) brightness(1)", scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] md:aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] transition-all duration-1000"
        >
          <ParticlesReveal />
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out brightness-75 group-hover:brightness-100"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
              {item.icon}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80 pointer-events-none" style={{ transform: "translateZ(20px)" }} />

          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none" style={{ transform: "translateZ(30px)" }}>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ height: 4 }}
                  whileInView={{ height: Math.random() * 20 + 8 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 0.5 + Math.random(),
                    delay: i * 0.1,
                  }}
                  className="w-1 bg-white/80 rounded-full shadow-[0_0_10px_white]"
                />
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--primary)] font-mono font-bold drop-shadow-md">
              Constelação 0{idx + 1}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Content Side */}
      <div
        className={`w-full md:w-1/2 flex flex-col justify-center ${item.side === "right" ? "items-start md:text-left" : "items-end md:text-right"} relative z-10 pt-8 md:pt-0`}
      >
        <motion.div
          initial={{ opacity: 0, x: item.side === "left" ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl w-full text-center md:text-left md:items-start"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: item.side === "left" ? "flex-end" : "flex-start",
          }}
        >
          <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 backdrop-blur-md mb-6 hover:bg-[var(--primary)]/10 transition-colors cursor-default">
            <MapPin size={12} className="text-[var(--primary)]" />
            <span className="text-[var(--primary)] font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] font-semibold">
              {item.year}
            </span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`text-5xl md:text-6xl lg:text-7xl font-editorial text-white tracking-tight italic mb-6 leading-[1.1] ${item.side === "left" ? "text-right" : "text-left"}`}
          >
            {item.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className={`text-white/70 font-light text-lg md:text-xl leading-relaxed mb-10 ${item.side === "left" ? "text-right" : "text-left"}`}
          >
            "{item.desc}"<br />
            <br />
            <span className="text-white/50 text-base">{item.details}</span>
          </motion.p>

          {/* Micro Details Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className={`flex flex-wrap gap-3 w-full mb-10 justify-center ${item.side === "left" ? "md:justify-end" : "md:justify-start"}`}
          >
            {item.music && (
              <div className="flex items-center gap-2 text-white/60 bg-white/[0.03] border border-white/10 px-4 py-2.5 rounded-2xl text-[11px] uppercase tracking-wider backdrop-blur-sm">
                <Music size={14} className="text-[var(--primary)]" />{" "}
                {item.music}
              </div>
            )}
            {item.location && (
              <div className="flex items-center gap-2 text-white/60 bg-white/[0.03] border border-white/10 px-4 py-2.5 rounded-2xl text-[11px] uppercase tracking-wider backdrop-blur-sm">
                <MapPin size={14} className="text-[var(--primary)]" />{" "}
                {item.location}
              </div>
            )}
            {item.emotion && (
              <div className="flex items-center gap-2 text-white/60 bg-white/[0.03] border border-white/10 px-4 py-2.5 rounded-2xl text-[11px] uppercase tracking-wider backdrop-blur-sm">
                <Heart size={14} className="text-[var(--primary)]" />{" "}
                {item.emotion}
              </div>
            )}
            {item.weather && (
              <div className="flex items-center gap-2 text-white/60 bg-white/[0.03] border border-white/10 px-4 py-2.5 rounded-2xl text-[11px] uppercase tracking-wider backdrop-blur-sm">
                <Cloud size={14} className="text-[var(--primary)]" />{" "}
                {item.weather}
              </div>
            )}
          </motion.div>

          {/* Secret Message */}
          {item.hiddenMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.2 }}
              className={`w-full flex justify-center ${item.side === "left" ? "md:justify-end" : "md:justify-start"}`}
            >
              <button
                onClick={onOpenSecret}
                className="relative overflow-hidden flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-white font-medium bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary)]/5 border border-[var(--primary)]/40 rounded-full px-8 py-4 hover:scale-[1.05] transition-all group shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_var(--primary)] duration-500"
              >
                <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                <div className="absolute inset-0 bg-[var(--primary)]/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-1000" />
                <Star size={16} className="text-[var(--primary)] group-hover:animate-[spin_3s_linear_infinite] relative z-10" />{" "}
                <span className="relative z-10 transition-colors duration-500 text-white/90 group-hover:text-white drop-shadow-md">Revelar Memória Oculta</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

