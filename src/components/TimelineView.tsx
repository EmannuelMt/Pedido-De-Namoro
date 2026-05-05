import { motion } from 'motion/react';
import { Calendar, Sparkles, ArrowRight, Heart, MapPin, Clock } from 'lucide-react';
import { PageLayout } from '../App';

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  details: string;
  icon: any;
  image?: string;
  side: 'left' | 'right';
  locked?: boolean;
}

export const TimelineView = ({ 
  timelineData, 
  onNavigate 
}: { 
  timelineData: TimelineItem[], 
  onNavigate: (v: any) => void 
}) => {
  return (
    <PageLayout 
      title="Nossa" 
      subtitle="Odisseia" 
      description="Cada passo, cada sorriso e cada lágrima que nos trouxe até o eterno aqui."
      onNavigate={onNavigate}
      currentView="historia"
    >
      <div className="relative w-full max-w-6xl mx-auto px-4 py-20">
        {/* The Cosmic Thread */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--primary)] via-white/5 to-[var(--primary)] hidden md:block" />

        <div className="space-y-48 relative z-10">
          {timelineData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col md:flex-row items-center gap-16 lg:gap-24 ${item.side === 'right' ? 'md:flex-row-reverse' : ''} group`}
            >
              {/* Connector Node */}
              <div className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-black border-[3px] border-[var(--primary)] z-10 hidden md:block group-hover:scale-150 group-hover:shadow-[0_0_20px_var(--primary)] transition-all duration-700">
                 <div className="absolute inset-0 rounded-full bg-[var(--primary)] animate-ping opacity-30" />
              </div>

              {/* Content Panel */}
              <div className="w-full md:w-1/2 flex justify-end">
                <div className={`w-full max-w-2xl luxury-card p-12 md:p-16 border border-white/5 hover:border-[var(--primary)]/40 transition-all duration-1000 ${item.side === 'right' ? 'md:rounded-tr-none' : 'md:rounded-tl-none'}`}>
                   <div className="flex items-center gap-6 mb-10">
                      <span className="text-[var(--primary)] font-sans text-xs md:text-sm uppercase tracking-[0.5em] font-bold drop-shadow-md">{item.year}</span>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--primary)]/20 to-transparent group-hover:from-[var(--primary)]/60 transition-all duration-700" />
                   </div>

                   <h3 className="text-5xl md:text-7xl font-editorial text-white tracking-tight italic leading-[1.1] mb-8 group-hover:text-glow-premium transition-all duration-700">
                     {item.title}
                   </h3>
                   
                   <p className="text-white/60 font-sans font-light text-xl md:text-2xl leading-relaxed mb-12">
                     "{item.desc}"
                   </p>

                   {item.image && (
                     <div className="relative h-72 md:h-96 rounded-[2rem] overflow-hidden mb-10 border border-white/5 group-hover:border-[var(--primary)]/30 transition-all duration-700 shadow-xl">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                     </div>
                   )}

                   <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 text-white/30 font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium">
                        <Clock size={14} className="text-[var(--primary)] animate-pulse" /> Registro {(idx + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white/30 group-hover:text-[var(--primary)] group-hover:bg-[var(--primary)]/10 transition-all duration-500 shadow-inner">
                        {item.icon}
                      </div>
                   </div>
                </div>
              </div>

              {/* Floating Meta */}
              <div className={`w-full md:w-1/2 flex flex-col justify-center ${item.side === 'right' ? 'items-start md:text-left md:pl-12' : 'items-end md:text-right md:pr-12'} opacity-40 group-hover:opacity-100 transition-opacity duration-1000`}>
                 <div className="max-w-sm space-y-6">
                   <div className={`flex items-center gap-4 ${item.side === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
                      <MapPin size={18} className="text-[var(--primary)] drop-shadow-md" />
                      <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold text-white/80">Coordenadas Temporais</span>
                   </div>
                   <p className="font-editorial italic text-2xl md:text-3xl leading-snug text-white/60">
                     A memória é apenas uma forma de viajar no tempo.
                   </p>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Action */}
        <div className="mt-64 flex flex-col items-center">
           <motion.div 
             animate={{ y: [0, 15, 0], opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="w-px h-32 bg-gradient-to-b from-[var(--primary)] to-transparent mb-12"
           />
           <button 
             onClick={() => onNavigate('galeria')}
             className="group relative px-16 py-8 luxury-glass border border-white/5 rounded-full overflow-hidden"
           >
             <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
             <div className="relative flex items-center gap-6 text-white group-hover:text-black transition-colors duration-500 font-bold text-[10px] uppercase tracking-[0.8em]">
               Visualizar Memórias <ArrowRight size={14} className="group-hover:translate-x-4 transition-transform" />
             </div>
           </button>
        </div>
      </div>
    </PageLayout>
  );
};
