import { Check, Star, Zap, Crown } from 'lucide-react';

export function SubscriptionTab() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Current Plan Overview */}
      <div className="bg-[#1a1a1a] text-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#e84e4e] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <span className="font-sans text-[10px] font-bold bg-[#e84e4e] text-white px-2 py-1 uppercase tracking-widest border border-black mb-4 inline-block">Plano Atual</span>
            <h2 className="text-4xl font-black italic mb-2">Pro Developer</h2>
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60">Renova em 25 de Julho de 2026 • R$ 49,90/mês</p>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 bg-white text-black border-2 border-black px-6 py-3 font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_#e84e4e] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
              Gerenciar Faturamento
            </button>
         </div>
      </div>

      {/* Upgrade Cards */}
      <div>
         <h3 className="text-2xl font-black italic mb-6">Upgrade de Plano</h3>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="bg-white border-2 border-black p-6 opacity-60 grayscale flex flex-col">
               <h4 className="font-black text-xl mb-2">Iniciante</h4>
               <p className="text-3xl font-black italic mb-6">Grátis</p>
               <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest"><Check className="w-4 h-4 text-green-500"/> 2 Projetos</li>
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest"><Check className="w-4 h-4 text-green-500"/> 5 Wallpapers</li>
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest"><Check className="w-4 h-4 text-green-500"/> Avatar Básico</li>
               </ul>
               <button disabled className="w-full bg-gray-200 border-2 border-black px-4 py-3 font-black uppercase text-xs cursor-not-allowed">
                 Seu Plano Base
               </button>
            </div>

            {/* Pro Tier (Current) */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#1a1a1a] flex flex-col relative transform md:-translate-y-4">
               <div className="absolute -top-4 -right-4 bg-[#e84e4e] text-white border-2 border-black px-3 py-1 font-black shadow-[4px_4px_0px_0px_#1a1a1a] rotate-3">
                 ATUAL
               </div>
               
               <div className="pb-4 border-b-2 border-black mb-4">
                 <h4 className="font-black text-xl mb-2 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500 fill-current" /> Pro Developer</h4>
                 <p className="text-3xl font-black italic">R$ 49<span className="text-sm">,90/mês</span></p>
               </div>
               
               <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest"><Check className="w-4 h-4 text-[#e84e4e]"/> Projetos Ilimitados</li>
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest"><Check className="w-4 h-4 text-[#e84e4e]"/> Wallpapers Premium</li>
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest"><Check className="w-4 h-4 text-[#e84e4e]"/> Badges Exclusivas</li>
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest"><Check className="w-4 h-4 text-[#e84e4e]"/> 50GB Armazenamento</li>
               </ul>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-[#f59e0b] border-2 border-black p-6 flex flex-col">
               <div className="pb-4 border-b-2 border-black/20 mb-4">
                 <h4 className="font-black text-xl mb-2 flex items-center gap-2"><Crown className="w-5 h-5 text-black" /> Enterprise</h4>
                 <p className="text-3xl font-black italic">R$ 149<span className="text-sm">,90/mês</span></p>
               </div>
               
               <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-black/80"><Check className="w-4 h-4 text-black"/> Tudo do Pro</li>
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-black/80"><Check className="w-4 h-4 text-black"/> API Keys Ilimitadas</li>
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-black/80"><Check className="w-4 h-4 text-black"/> Organização de Equipe</li>
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-black/80"><Check className="w-4 h-4 text-black"/> Suporte 24/7</li>
                  <li className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-black/80"><Check className="w-4 h-4 text-black"/> Backups Diários</li>
               </ul>
               <button className="w-full bg-black text-white border-2 border-black px-4 py-3 font-black uppercase text-xs hover:bg-[#1a1a1a] shadow-[4px_4px_0px_0px_#ffffff] transition-all">
                 Fazer Upgrade
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
