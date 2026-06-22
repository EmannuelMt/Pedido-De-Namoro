import React from 'react';
import { LucideIcon, Lock, Sparkles, ChevronRight } from 'lucide-react';

interface HistoryChapterCardProps {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'amber' | 'rose' | 'emerald' | 'sky' | 'purple' | 'stone';
  isLocked?: boolean;
  count: number;
  unit: string;
  onClick: () => void;
  isRelic?: boolean;
}

export function HistoryChapterCard({ 
  number, 
  title, 
  description, 
  icon: Icon, 
  color, 
  isLocked, 
  count, 
  unit, 
  onClick,
  isRelic
}: HistoryChapterCardProps) {
  
  const getColorClasses = () => {
    switch (color) {
      case 'amber': return 'bg-amber-400 text-black border-black shadow-[3px_3px_0px_0px_#000]';
      case 'rose': return 'bg-rose-400 text-black border-black shadow-[3px_3px_0px_0px_#000]';
      case 'emerald': return 'bg-emerald-400 text-black border-black shadow-[3px_3px_0px_0px_#000]';
      case 'sky': return 'bg-cyan-400 text-black border-black shadow-[3px_3px_0px_0px_#000]';
      case 'purple': return 'bg-indigo-400 text-white border-black shadow-[3px_3px_0px_0px_#000]';
      default: return 'bg-stone-100 text-black/40 border-black shadow-[3px_3px_0px_0px_#000]';
    }
  };

  const getButtonClasses = () => {
    switch (color) {
      case 'amber': return 'bg-amber-400 hover:bg-amber-300 text-black';
      case 'rose': return 'bg-rose-400 hover:bg-rose-300 text-black';
      case 'emerald': return 'bg-emerald-400 hover:bg-emerald-300 text-black';
      case 'sky': return 'bg-cyan-400 hover:bg-cyan-300 text-black';
      case 'purple': return 'bg-indigo-400 hover:bg-indigo-300 text-white';
      default: return 'bg-black text-white';
    }
  };

  return (
    <div className={`bg-white border-[5px] border-black p-8 rounded-[3.5rem] shadow-[10px_10px_0px_0px_#000] flex flex-col justify-between transition-all hover:-translate-y-3 hover:shadow-[15px_15px_0px_0px_#000] group relative overflow-hidden ${isRelic ? 'bg-[#fcf9f2]' : ''}`}>
      {isRelic && (
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Sparkles className="w-24 h-24 text-black animate-pulse" />
        </div>
      )}
      
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <span className={`px-4 py-2 border-[2.5px] border-black rounded-xl text-[10px] font-black uppercase tracking-widest ${getColorClasses()}`}>
            Capítulo {number}
          </span>
          {isLocked ? (
            <div className="bg-stone-200 p-2.5 rounded-xl border-[2.5px] border-black">
              <Lock className="w-5 h-5 text-black/30" strokeWidth={3} />
            </div>
          ) : (
             <div className="bg-[#ff90e8] p-2.5 rounded-xl border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000]">
               <Sparkles className="w-5 h-5 text-black animate-pulse" strokeWidth={3} />
             </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none flex items-center gap-3 text-black">
            <Icon className={`w-8 h-8 ${isLocked ? 'text-stone-300' : 'text-black'}`} strokeWidth={3} />
            {title}
          </h3>
          <p className="text-black/60 font-bold text-sm leading-tight uppercase tracking-tight">
            {description}
          </p>
        </div>

        <div className="bg-stone-100 border-[3px] border-black p-4 rounded-2xl flex items-center justify-between shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[11px] font-black uppercase tracking-widest text-black/30">{unit}</span>
          <span className="text-xl font-black italic text-black">{count}</span>
        </div>
      </div>

      <button 
        onClick={onClick}
        disabled={isLocked}
        className={`mt-10 w-full border-[4px] border-black py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-4 cursor-pointer group/btn disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 ${getButtonClasses()}`}
      >
        {isLocked ? 'Bloqueado 🔒' : (
          <>
            Abrir Memórias <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" strokeWidth={4} />
          </>
        )}
      </button>
    </div>
  );
}
