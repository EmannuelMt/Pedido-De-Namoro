import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/auth';
import { Award, Lock, Check, Sparkles, Flame, Shield, Coins } from 'lucide-react';
import toast from 'react-hot-toast';

interface TitleItem {
  id: string;
  name: string;
  rarity: 'comum' | 'raro' | 'epico' | 'lendario';
  description: string;
  cost: number;
}

const ALL_TITLES: TitleItem[] = [
  { id: 'dev_fullstack', name: 'Desenvolvedor Fullstack', rarity: 'comum', description: 'O criador de mundos e domador de bugs.', cost: 0 },
  { id: 'founding_prime', name: 'Fundador Prime', rarity: 'raro', description: 'Membro original de alto escalão desde o dia zero.', cost: 150 },
  { id: 'noble_explorer', name: 'Explorador Imortal', rarity: 'raro', description: 'Aqueles que vasculham os mistérios do diário.', cost: 200 },
  { id: 'cosmic_collector', name: 'Colecionador Cósmico', rarity: 'epico', description: 'Obcecado em obter cada artefato visual já criado.', cost: 400 },
  { id: 'platinum_lover', name: 'Apaixonado Platina', rarity: 'epico', description: 'Provando que o amor pode sim ser platinado.', cost: 450 },
  { id: 'soul_hacker', name: 'Hacker de Almas', rarity: 'lendario', description: 'Ignorando portas lógicas para se conectar diretamente ao coração.', cost: 600 },
  { id: 'mythic_lover', name: 'Amante Lendário', rarity: 'lendario', description: 'Dupla lendária de romances escritos nas estrelas.', cost: 800 },
];

export function TitulosTab() {
  const { profile, updateProfileFields, addHeartPoints } = useAuthStore();
  
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Fallbacks for profile values
  const points = profile?.heartPoints ?? 200;
  const equippedTitle = profile?.selectedTitle || 'Desenvolvedor Fullstack';
  const unlockedTitles = useMemo(() => {
    return profile?.unlockedTitles || ['Desenvolvedor Fullstack', 'Fundador'];
  }, [profile?.unlockedTitles]);

  const handleEquip = async (titleName: string) => {
    try {
      setLoadingId(titleName);
      await updateProfileFields({ selectedTitle: titleName, cargo: titleName });
      toast.success(`Título "${titleName}" equipado com sucesso!`);
    } catch {
      toast.error('Ocorreu um erro ao equipar este título.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnlock = async (title: TitleItem) => {
    if (points < title.cost) {
      toast.error('Saldo de corações insuficiente!');
      return;
    }

    try {
      setLoadingId(title.id);
      const newUnlocked = [...unlockedTitles, title.name];
      await updateProfileFields({
        unlockedTitles: newUnlocked,
        heartPoints: points - title.cost
      });
      toast.success(`Título "${title.name}" desbloqueado com sucesso! 🎉`);
    } catch {
      toast.error('Ocorreu um erro ao comprar este título.');
    } finally {
      setLoadingId(null);
    }
  };

  const getRarityBadgeColor = (rarity: TitleItem['rarity']) => {
    switch (rarity) {
      case 'lendario': return 'bg-amber-500 text-black';
      case 'epico': return 'bg-purple-600 text-white';
      case 'raro': return 'bg-blue-600 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#e84e4e] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> MMO TITLE MANAGER
            </span>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">🏷️ Títulos de Identidade</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Escolha um título honorário para exibir abaixo de seu nome no cabeçalho do perfil e em todo o espaço do casal.
          </p>
        </div>

        {/* Current title info card */}
        <div className="flex items-center gap-3 bg-white border-2 border-black p-3.5 shadow-[4px_4px_0px_#1a1a1a] rounded">
          <div className="bg-[#ffb703] p-2.5 border border-black rounded text-black">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Equipado Atualmente</div>
            <div className="text-sm font-black text-rose-600 flex items-center gap-1">{equippedTitle}</div>
          </div>
        </div>
      </div>

      {/* Grid of titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ALL_TITLES.map((title) => {
          const isUnlocked = unlockedTitles.includes(title.name) || title.cost === 0;
          const isEquipped = equippedTitle === title.name;

          return (
            <div 
              key={title.id}
              className={`bg-white border-4 border-black p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${
                isEquipped 
                  ? 'shadow-[6px_6px_0px_0px_rgba(232,78,78,1)] bg-rose-50/20 translate-y-[-2px]' 
                  : isUnlocked 
                    ? 'shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
                    : 'shadow-[4px_4px_0px_rgba(0,0,0,0.5)] grayscale opacity-80'
              }`}
            >
              {/* Card top */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-lg font-black text-black leading-tight flex items-center gap-1.5 uppercase font-sans">
                    {title.name}
                  </h4>
                  <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-black ${getRarityBadgeColor(title.rarity)}`}>
                    {title.rarity}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed min-h-[40px]">
                  {title.description}
                </p>
              </div>

              {/* Card bottom controller */}
              <div className="mt-5 pt-4 border-t border-dashed border-gray-200 flex items-center justify-between gap-4">
                {isUnlocked ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-sans text-xs font-bold leading-none">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Unlocked
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-rose-500 font-mono text-sm font-black">
                    <Coins className="w-4 h-4 text-[#ffb703] stroke-[2]" /> {title.cost} 💖
                  </div>
                )}

                {isEquipped ? (
                  <span className="bg-rose-500 text-white font-sans text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    Equipado
                  </span>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handleEquip(title.name)}
                    disabled={loadingId !== null}
                    className="bg-black text-white hover:bg-[#e84e4e] font-sans text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-transform"
                  >
                    {loadingId === title.name ? 'Processando' : 'Equipar Título'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnlock(title)}
                    disabled={loadingId !== null}
                    className="bg-amber-300 hover:bg-amber-400 text-black font-sans text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-transform flex items-center gap-1"
                  >
                    <Lock className="w-3.5 h-3.5" /> Adquirir
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
