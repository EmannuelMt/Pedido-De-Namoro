import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/auth';
import { Trophy, Gift, Check, Flame, Star, Compass, HelpCircle, Layers, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface ThematicSet {
  id: string;
  name: string;
  category: 'Gamer' | 'Dev' | 'Romance' | 'Anime' | 'Cinema' | 'Eventos';
  badge: string;
  description: string;
  items: { name: string; owned: boolean }[];
  bonusPoints: number;
}

export function ColecoesTab() {
  const { profile, addHeartPoints, updateProfileFields } = useAuthStore();
  
  // Storage key for claimed sets so users can't abuse the claims
  const claimedKeysKey = useMemo(() => `claimed_sets_${profile?.username || 'user'}`, [profile?.username]);
  const [claimedKeys, setClaimedKeys] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(claimedKeysKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveClaimed = (newClaimed: string[]) => {
    setClaimedKeys(newClaimed);
    localStorage.setItem(claimedKeysKey, JSON.stringify(newClaimed));
  };

  // Fallbacks for profile checkouts
  const unlockedTitles = useMemo(() => profile?.unlockedTitles || ['Desenvolvedor Fullstack', 'Fundador'], [profile?.unlockedTitles]);
  const unlockedEffects = useMemo(() => profile?.unlockedEffects || ['none', 'soft_glow'], [profile?.unlockedEffects]);

  // Construct sets with real logic to verify unlock statuses
  const sets: ThematicSet[] = useMemo(() => {
    return [
      {
        id: 'gamer_set',
        name: 'Set do Casal Gamer',
        category: 'Gamer',
        badge: '👾',
        description: 'Vença a campanha principal equipando decorações digitais de pixel e setups clássicos.',
        bonusPoints: 200,
        items: [
          { name: 'Tema Gamer Floresta', owned: true }, // presets always owned
          { name: 'Brilho Suave Efeito', owned: unlockedEffects.includes('soft_glow') },
          { name: 'Título Explorador', owned: unlockedTitles.includes('Explorador Imortal') }
        ]
      },
      {
        id: 'dev_set',
        name: 'Set Universo Developer',
        category: 'Dev',
        badge: '💻',
        description: 'Seja o arquiteto do seu próprio diário compilando setups em monospace.',
        bonusPoints: 250,
        items: [
          { name: 'Tema Dev Slate', owned: true },
          { name: 'Título Desenvolvedor Fullstack', owned: unlockedTitles.includes('Desenvolvedor Fullstack') },
          { name: 'Efeito Matrix Rain', owned: unlockedEffects.includes('floating_leaves') }
        ]
      },
      {
        id: 'romance_set',
        name: 'Alcançando Amante Divino',
        category: 'Romance',
        badge: '💖',
        description: 'Coleção fofa com corações elegantes e pétalas de rosas românticas.',
        bonusPoints: 300,
        items: [
          { name: 'Tema Pétalas Romance', owned: true },
          { name: 'Efeito Love Flutuante', owned: unlockedEffects.includes('floating_hearts') },
          { name: 'Título Apaixonado Platina', owned: unlockedTitles.includes('Apaixonado Platina') }
        ]
      },
      {
        id: 'anime_set',
        name: 'Estação de Cerejeiras Kyoto',
        category: 'Anime',
        badge: '🌸',
        description: 'O amor que floresce no cenário oriental clássico do diário sintonizado.',
        bonusPoints: 400,
        items: [
          { name: 'Tema Sakura Dream', owned: true },
          { name: 'Efeito Sakura Kyoto Wind', owned: unlockedEffects.includes('sakura') },
          { name: 'Título Amante Lendário', owned: unlockedTitles.includes('Amante Lendário') }
        ]
      },
      {
        id: 'event_set',
        name: 'Set Neve de Inverno',
        category: 'Eventos',
        badge: '❄️',
        description: 'As decorações geladas e festivas das recordações frias de natal.',
        bonusPoints: 500,
        items: [
          { name: 'Tema diário de Inverno', owned: true },
          { name: 'Efeito Nevasca Estelar', owned: unlockedEffects.includes('winter_snow') },
          { name: 'Título Fundador Prime', owned: unlockedTitles.includes('Fundador Prime') }
        ]
      }
    ];
  }, [unlockedTitles, unlockedEffects]);

  // Global percentages
  const progressReport = useMemo(() => {
    let totalItems = 0;
    let ownedItems = 0;
    sets.forEach(s => {
      s.items.forEach(i => {
        totalItems++;
        if (i.owned) ownedItems++;
      });
    });
    const percent = totalItems > 0 ? Math.round((ownedItems * 100) / totalItems) : 0;
    return {
      percent,
      total: totalItems,
      owned: ownedItems
    };
  }, [sets]);

  const handleClaimBonus = async (set: ThematicSet) => {
    const totalOwned = set.items.filter(i => i.owned).length;
    if (totalOwned < set.items.length) {
      toast.error('Você precisa obter todos os itens do conjunto antes de reivindicar o prêmio!');
      return;
    }

    if (claimedKeys.includes(set.id)) {
      toast.error('Conjunto já reivindicado!');
      return;
    }

    try {
      await addHeartPoints(set.bonusPoints);
      const updatedClaims = [...claimedKeys, set.id];
      saveClaimed(updatedClaims);
      toast.success(`Parabéns! Conjunto concluído! +${set.bonusPoints} 💖 adicionados de forma segura!`);
    } catch {
      toast.error('Erro ao processar resgate.');
    }
  };

  const getCategoryColor = (category: ThematicSet['category']) => {
    switch (category) {
      case 'Gamer': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Dev': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'Romance': return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'Anime': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Cinema': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#e84e4e] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> COLLECTION ARCHITECT
            </span>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">🏆 Conquistas de Conjuntos</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Complete conjuntos temáticos desbloqueando itens de aparência correlacionados e resgate grandes bônus de corações no cofre.
          </p>
        </div>

        {/* Global Progress Radial indicator card */}
        <div className="flex items-center gap-3 bg-white border-2 border-black p-3.5 shadow-[4px_4px_0px_#1a1a1a] rounded">
          <div className="bg-amber-100 p-2 border border-black rounded text-amber-600">
            <Trophy className="w-5 h-5 fill-amber-400 text-amber-600" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Conclusão Total</div>
            <div className="text-sm font-black text-black">
              {progressReport.percent}% ({progressReport.owned}/{progressReport.total})
            </div>
          </div>
        </div>
      </div>

      {/* Hero progress bar */}
      <div className="bg-stone-900 border-4 border-black p-6 rounded-3xl text-white shadow-[6px_6px_0px_#ffb703]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-300" /> Progression level
          </span>
          <span className="font-mono text-sm font-black text-white">{progressReport.percent}% COMPILADO</span>
        </div>
        <div className="w-full bg-stone-800 rounded-full h-4 border-2 border-black overflow-hidden relative">
          <div 
            className="bg-gradient-to-r from-amber-400 to-rose-500 h-full transition-all duration-500"
            style={{ width: `${progressReport.percent}%` }}
          />
        </div>
        <p className="text-[11px] text-stone-300 font-sans mt-3">
          Tanto molduras raras quanto títulos e auras contam para o progresso do seu conjunto. Reivindique os prêmios conforme preenche sua bolsa virtual!
        </p>
      </div>

      {/* Sets display grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sets.map((set) => {
          const totalOwned = set.items.filter(i => i.owned).length;
          const setTotal = set.items.length;
          const setPercent = Math.round((totalOwned * 100) / setTotal);
          const isCompleted = totalOwned === setTotal;
          const isClaimed = claimedKeys.includes(set.id);

          return (
            <div 
              key={set.id}
              className={`bg-white border-4 border-black p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 shadow-[6px_6px_0px_#1a1a1a] relative overflow-hidden ${
                isCompleted ? 'bg-amber-50/10' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Visual Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{set.badge}</span>
                    <div>
                      <h4 className="text-lg font-black text-black leading-tight flex items-center gap-1.5 uppercase font-sans">
                        {set.name}
                      </h4>
                      <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 mt-1 rounded border ${getCategoryColor(set.category)}`}>
                        {set.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Small radial info */}
                  <span className="font-mono text-sm font-extrabold text-stone-600">
                    {totalOwned}/{setTotal}
                  </span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed min-h-[38px]">
                  {set.description}
                </p>

                {/* Items checklist */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                  <span className="block text-[9px] font-black uppercase text-gray-400 tracking-wider">REQUISITOS DO CONJUNTO:</span>
                  {set.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-sans">
                      <span className={`font-bold ${item.owned ? 'text-stone-800' : 'text-stone-400 text-opacity-80'}`}>
                        {item.name}
                      </span>
                      {item.owned ? (
                        <span className="text-emerald-500 flex items-center gap-0.5 font-black text-[10px]">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> OWNED
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px] italic">Locked</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between gap-4">
                <span className="text-xs font-black text-black flex items-center gap-1">
                  <Gift className="w-4 h-4 text-rose-500" /> Bônus: +{set.bonusPoints} 💖
                </span>

                {isClaimed ? (
                  <span className="bg-emerald-100 text-emerald-800 font-sans text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-emerald-300 rounded-xl flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" /> Reivindicado
                  </span>
                ) : isCompleted ? (
                  <button
                    onClick={() => handleClaimBonus(set)}
                    className="bg-amber-300 hover:bg-amber-400 text-black font-sans text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-transform"
                  >
                    Resgatar Recompensa
                  </button>
                ) : (
                  <span className="text-stone-400 font-sans text-[10px] font-black uppercase tracking-wide bg-stone-100 px-3.5 py-2 rounded-lg border border-stone-200">
                    Incompleto ({setPercent}%)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
