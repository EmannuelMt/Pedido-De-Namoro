import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

export const Typewriter = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  return (
    <motion.span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: delay + i * 0.1,
            ease: "easeInOut",
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const TimeTogether = ({ startDate }: { startDate: Date }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const diff = now.getTime() - startDate.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;

  return (
    <div className="flex flex-col items-center md:items-start gap-8 md:gap-12 w-full">
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
        <div className="flex flex-col items-center md:items-start">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[8rem] sm:text-[12rem] md:text-[16rem] font-editorial italic leading-none text-white tracking-tighter"
          >
            {months}
          </motion.span>
          <span className="micro-label opacity-40 uppercase tracking-[0.4em] md:ml-4">Meses</span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[8rem] sm:text-[12rem] md:text-[16rem] font-editorial italic leading-none text-[var(--primary)] tracking-tighter"
          >
            {remainingDays}
          </motion.span>
          <span className="micro-label opacity-40 uppercase tracking-[0.4em] md:ml-4">Dias</span>
        </div>
      </div>
      <p className="text-white/20 font-serif italic text-xl md:text-2xl tracking-wide text-center md:text-left">
        & contando cada batida do nosso coração...
      </p>
    </div>
  );
};

export const StarBackground = () => {
  const starsCount = 100;
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-[var(--bg)]" />
      {[...Array(starsCount)].map((_, i) => (
        <motion.div
           key={i}
           initial={{ opacity: Math.random(), scale: Math.random() }}
           animate={{ 
             opacity: [0.2, 0.6, 0.2],
             scale: [0.8, 1.2, 0.8]
           }}
           transition={{ 
             duration: 3 + Math.random() * 4, 
             repeat: Infinity,
             delay: Math.random() * 5
           }}
           className="absolute bg-white rounded-full"
           style={{
             top: `${Math.random() * 100}%`,
             left: `${Math.random() * 100}%`,
             width: `${Math.random() * 2}px`,
             height: `${Math.random() * 2}px`,
           }}
        />
      ))}
    </div>
  );
};

export const MathematicalHeart = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-20">
      <svg viewBox="0 0 400 400" className="w-full h-full text-[var(--primary)]/10 fill-none stroke-[0.5]">
        <motion.path
          d="M200,100 C200,100 250,50 300,100 C350,150 200,300 200,300 C200,300 50,150 100,100 C150,50 200,100 200,100"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        {[...Array(5)].map((_, i) => (
          <motion.circle
            key={i}
            r={10 + i * 40}
            cx="200"
            cy="200"
            stroke="currentColor"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 5, delay: i, repeat: Infinity }}
          />
        ))}
      </svg>
    </div>
  );
};

export const PixelHeartLoader = () => {
  return (
    <div className="relative">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 flex items-center justify-center bg-[var(--primary)]/10 rounded-3xl"
      >
        <Heart className="text-[var(--primary)] fill-[var(--primary)]" size={32} />
      </motion.div>
      <div className="absolute inset-0 bg-[var(--primary)]/20 blur-xl animate-pulse" />
    </div>
  );
};
