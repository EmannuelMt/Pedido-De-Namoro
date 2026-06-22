import React from 'react';
import { Trophy, CheckCircle2, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  done: boolean;
}

interface HistoryAchievementPanelProps {
  achievements: Achievement[];
}

export function HistoryAchievementPanel({ achievements }: HistoryAchievementPanelProps) {
  const completed = achievements.filter(a => a.done).length;
  const progress = (completed / achievements.length) * 100;

  return (
    <div className="bg-black border-[6px] border-black p-8 md:p-12 rounded-[3.5rem] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700">
        <Trophy className="w-64 h-64 text-white" strokeWidth={3} />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16 border-b-[5px] border-white/5 pb-12 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <Trophy className="w-12 h-12 text-[#ff90e8] animate-bounce" strokeWidth={3} />
             <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Mural de Glórias</h3>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Marcos históricos da nossa cumplicidade</p>
        </div>

        <div className="space-y-4 w-full lg:w-80">
          <div className="flex justify-between items-end">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff90e8]">Level Progress</span>
             <span className="text-3xl font-black text-white italic tracking-tighter">{completed}/{achievements.length}</span>
          </div>
          <div className="h-7 bg-white/10 border-[3.5px] border-white/10 rounded-full overflow-hidden p-1 shadow-inner">
            <div 
              className="h-full bg-[#ff90e8] rounded-full shadow-[0_0_20px_rgba(255,144,232,0.6)] transition-all duration-1000 border border-black/20" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
        {achievements.map((ach) => (
          <div 
            key={ach.id} 
            className={`group p-8 rounded-[2.5rem] border-[4px] flex flex-col items-center text-center transition-all hover:-translate-y-2 ${
              ach.done 
                ? 'bg-[#fcf9f2] border-[#ff90e8] shadow-[8px_8px_0px_0px_#ff90e8]' 
                : 'bg-stone-900 border-white/5 shadow-[8px_8px_0px_0px_#000] opacity-40'
            }`}
          >
            <div className={`text-6xl mb-6 transition-transform group-hover:scale-125 duration-500 ${ach.done ? 'filter-none' : 'grayscale grayscale-opacity-50'}`}>
              {ach.icon}
            </div>
            <div className="space-y-2">
              <span className={`text-lg font-black uppercase italic tracking-tighter block leading-none ${ach.done ? 'text-black' : 'text-stone-600'}`}>
                {ach.title}
              </span>
              <p className="text-[10px] font-black uppercase tracking-tight text-white/30 leading-tight">
                {ach.desc}
              </p>
            </div>
            
            <div className="mt-6 pt-6 border-t-[3px] border-black/5 w-full">
              {ach.done ? (
                <div className="flex items-center justify-center gap-2 text-black font-black text-[9px] uppercase tracking-widest bg-[#ff90e8] px-3 py-1.5 rounded-xl border-[2.5px] border-black shadow-[3px_3px_0px_0px_#000]">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={4} /> Unlocked
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-stone-700 font-black text-[9px] uppercase tracking-widest">
                  <Lock className="w-3.5 h-3.5" strokeWidth={3} /> Locked
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
