import React from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar, Camera, Music } from 'lucide-react';

interface TimeTogether {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountersSectionProps {
  timeTogether: TimeTogether;
  daysTogether: number;
}

export function CountersSection({ timeTogether, daysTogether }: CountersSectionProps) {
  return (
    <section className="relative space-y-12 select-none">
      
      {/* Principal Active Counter */}
      <div className="bg-white border-[5px] border-black p-8 md:p-12 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
        <div className="absolute -right-16 -top-16 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-1000">
          <Heart className="w-96 h-96 text-rose-500 fill-current animate-pulse" />
        </div>

        <div className="flex flex-col xl:flex-row items-center justify-between gap-12 relative z-10">
          <div className="text-center xl:text-left space-y-6 max-w-xl">
            <span className="font-sans text-[11px] uppercase font-black tracking-[0.2em] text-black inline-flex items-center gap-3 bg-[#ff90e8] border-[3px] border-black px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
              <span className="w-3 h-3 bg-white border-[2px] border-black rounded-full animate-pulse" />
              Contador do Amor
            </span>
            <h2 className="font-sans font-black text-5xl md:text-6xl lg:text-7xl tracking-tighter text-black leading-[0.95] uppercase">
              Cada Segundo <br/> <span className="bg-amber-400 px-3 border-[4px] border-black inline-block mt-2">é Eterno</span>
            </h2>
            <p className="font-sans font-bold text-lg text-black/60 leading-tight max-w-md">
              A nossa jornada é medida em batidas de coração e planos que se tornam realidade.
            </p>
          </div>

          {/* Digital Grid Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 w-full xl:w-auto">
            {[
              { label: 'Anos', val: timeTogether.years, bgColor: 'bg-rose-400' },
              { label: 'Meses', val: timeTogether.months, bgColor: 'bg-amber-400' },
              { label: 'Dias', val: timeTogether.days, bgColor: 'bg-emerald-400' },
              { label: 'Horas', val: timeTogether.hours, bgColor: 'bg-cyan-400' },
              { label: 'Minutos', val: timeTogether.minutes, bgColor: 'bg-indigo-400' },
              { label: 'Segundos', val: timeTogether.seconds, highlight: true, bgColor: 'bg-rose-500' }
            ].map((unit, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-3xl flex flex-col items-center justify-center relative transition-all duration-500 border-[4px] border-black ${
                  unit.highlight 
                    ? `${unit.bgColor} text-white shadow-[8px_8px_0px_0px_#000] lg:scale-110 z-20` 
                    : `bg-white text-black hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1`
                }`}
              >
                <span className="font-sans font-black text-5xl md:text-6xl tracking-tighter block tabular-nums leading-none">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className={`font-sans text-[10px] uppercase tracking-widest font-black mt-4 block leading-none px-4 py-2 rounded-xl border-[2.5px] border-black ${
                  unit.highlight ? 'bg-white text-black' : `${unit.bgColor} text-black`
                }`}>
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* History Bento */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border-[4px] border-black p-8 space-y-8 shadow-[8px_8px_0px_0px_#000] hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] group"
        >
          <div className="flex justify-between items-center">
            <span className="font-sans text-[11px] uppercase font-black tracking-widest text-black bg-rose-400 border-[2.5px] border-black px-4 py-2 rounded-xl">História</span>
            <Calendar className="w-8 h-8 text-black group-hover:scale-110 transition-transform" strokeWidth={3} />
          </div>
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter text-black tabular-nums">{daysTogether}</span>
              <span className="text-black/40 font-black uppercase text-[12px] tracking-widest">Dias</span>
            </div>
            <p className="font-sans text-lg font-black text-black/70 leading-none uppercase tracking-tight">De pura conexão</p>
          </div>
          <div className="space-y-4">
             <div className="w-full bg-black h-4 rounded-full border-[3px] border-black p-1">
                <div className="bg-rose-400 h-full rounded-full" style={{ width: '100.00%' }}></div>
             </div>
             <div className="flex justify-between text-[11px] font-black uppercase text-black tracking-widest">
              <span>Fidelidade</span>
              <span>Infinita</span>
            </div>
          </div>
        </motion.div>
        
        {/* Moments Bento */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-amber-400 border-[4px] border-black p-8 space-y-8 shadow-[8px_8px_0px_0px_#000] hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] group"
        >
          <div className="flex justify-between items-center">
            <span className="font-sans text-[11px] uppercase font-black tracking-widest text-black bg-white border-[2.5px] border-black px-4 py-2 rounded-xl">Fotos</span>
            <Camera className="w-8 h-8 text-black group-hover:rotate-12 transition-transform" strokeWidth={3} />
          </div>
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter text-black tabular-nums">150+</span>
              <span className="text-black/40 font-black uppercase text-[12px] tracking-widest">Registros</span>
            </div>
            <p className="font-sans text-lg font-black text-black/70 leading-none uppercase tracking-tight">Memórias Vivas</p>
          </div>
          <div className="space-y-4">
             <div className="w-full bg-black h-4 rounded-full border-[3px] border-black p-1">
                <div className="bg-white h-full rounded-full" style={{ width: '85%' }}></div>
             </div>
             <div className="flex justify-between text-[11px] font-black uppercase text-black tracking-widest">
              <span>Capacidade</span>
              <span>∞ TB</span>
            </div>
          </div>
        </motion.div>

        {/* Music Bento */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-indigo-400 border-[4px] border-black p-8 space-y-8 shadow-[8px_8px_0px_0px_#000] hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] group"
        >
          <div className="flex justify-between items-center">
            <span className="font-sans text-[11px] uppercase font-black tracking-widest text-black bg-white border-[2.5px] border-black px-4 py-2 rounded-xl">Sync</span>
            <Music className="w-8 h-8 text-black group-hover:translate-x-1 transition-transform" strokeWidth={3} />
          </div>
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter text-black tabular-nums">50+</span>
              <span className="text-black/40 font-black uppercase text-[12px] tracking-widest">Tracks</span>
            </div>
            <p className="font-sans text-lg font-black text-black/70 leading-none uppercase tracking-tight">Vibrações Compartilhadas</p>
          </div>
          <div className="space-y-4">
             <div className="w-full bg-black h-4 rounded-full border-[3px] border-black p-1">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '100.00%' }}></div>
             </div>
             <div className="flex justify-between text-[11px] font-black uppercase text-black tracking-widest">
              <span>Qualidade</span>
              <span>Ultra HD</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
