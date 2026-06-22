import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/auth';
import { 
  Shield, 
  Lock, 
  Check, 
  Sparkles, 
  Star, 
  Award, 
  Zap, 
  Coins, 
  X, 
  Calendar, 
  Flame, 
  Compass, 
  Trophy,
  History,
  Unlock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BadgeItem {
  id: string;
  name: string;
  emoji: string;
  rarity: 'comum' | 'raro' | 'epico' | 'lendario';
  description: string;
  lore: string;
  cost: number;
  lockCondition?: string; // Ex: "[Nome da Missão] (Nível X)"
}

const ALL_BADGES: BadgeItem[] = [
  { 
    id: 'founder', 
    name: 'Fundador Prime', 
    emoji: '👑', 
    rarity: 'lendario', 
    description: 'Membro original presente desde os primórdios do diário sintonizado.', 
    lore: 'Esta insígnia eterna coroa os pioneiros que plantaram as primeiras memórias no diário. Ela representa a disciplina e o amor guardados no alicerce de nossa história.', 
    cost: 0 
  },
  { 
    id: 'premium', 
    name: 'Premium Star', 
    emoji: '💎', 
    rarity: 'epico', 
    description: 'Acesso completo e irrestrito ao Theme Engine e auras dinâmicas.', 
    lore: 'Concedida aos portadores da centelha criativa universal. Aqueles que exploram cada tonalidade sem barreiras ou limites e dão vida às suas ideias.', 
    cost: 0 
  },
  { 
    id: 'verified_couple', 
    name: 'Casal Verificado', 
    emoji: '❤️', 
    rarity: 'epico', 
    description: 'Status oficial que homologa o companheirismo e carinho eterno.', 
    lore: 'Uma insígnia sagrada concedida à dupla que sintonizou suas almas em uma mesma frequência. Simboliza uma aliança inabalável através de cada palavra registrada no Consto.', 
    cost: 100 
  },
  { 
    id: 'gamer_pro', 
    name: 'Gamer Pro', 
    emoji: '👾', 
    rarity: 'raro', 
    description: 'Jogador de paixão cooperativa envolvido em desafios sintonizados.', 
    lore: 'Aos guardiões dos controles e entusiastas da cooperação mútua. Esta honraria celebra horas de diversão, conquistas e batalhas virtuais lado a lado.', 
    cost: 150 
  },
  { 
    id: 'code_ninja', 
    name: 'Code Ninja', 
    emoji: '🚀', 
    rarity: 'raro', 
    description: 'Sintonizador de algoritmos capaz de moldar novas realidades digitais.', 
    lore: 'Aos guerreiros das linhas de código que moldaram este universo digital. Uma homenagem aos que domaram os compiladores e injetaram vida em cada elemento interativo.', 
    cost: 200 
  },
  { 
    id: 'heart_master', 
    name: 'Mestre dos Mimos', 
    emoji: '🍬', 
    rarity: 'lendario', 
    description: 'Consumidor incondicional de afeto, sintonias e mimos diários.', 
    lore: 'Um tributo à consistência incondicional. Concedida apenas aos corações mais dedicados que nunca esquecem de expressar afeto e carinho diários através de sintonias.', 
    cost: 300 
  },
  { 
    id: 'mestre_diario', 
    name: 'Mestre Cronista', 
    emoji: '📜', 
    rarity: 'lendario', 
    description: 'Insígnia de prestígio supremo para escritores do amor com fidelidade total.', 
    lore: 'Esta insígnia é concedida apenas aos que completaram 30 dias de escrita ininterrupta. Ela representa a disciplina e o amor guardados nas páginas do Consto.', 
    cost: 350 
  },
  {
    id: 'chama_eterna',
    name: 'Chama Eterna',
    emoji: '🔥',
    rarity: 'lendario',
    description: 'Chama indelével de carinho mantido em intensidade diária máxima.',
    lore: 'Nascida do fogo ardente da cumplicidade diária, esta honraria atesta que nenhuma tempestade é capaz de apagar o brilho das histórias escritas sob o luar sintonizado.',
    cost: 0,
    lockCondition: 'Chama do Diário (Nível 5)'
  },
  {
    id: 'explorador_astral',
    name: 'Explorador Astral',
    emoji: '🌌',
    rarity: 'epico',
    description: 'Conquistador de dimensões estelares, temas raros e constelações celestes.',
    lore: 'Uma insígnia estelar dedicada a todos os namorados e parceiros que cruzaram constelações de afeto em busca da harmonia ideal do universo sintonizado.',
    cost: 0,
    lockCondition: 'Sintonia Celestial (Nível 3)'
  },
  {
    id: 'alchemist_grand',
    name: 'Alquimista do Amor',
    emoji: '🧪',
    rarity: 'raro',
    description: 'Especialista em mesclar cores, auras e emoções nos mínimos detalhes.',
    lore: 'Esta insígnia homenageia a maestria de quem sabe converter pequenos gestos e palavras diárias de escrita fina em autêntico ouro sentimental.',
    cost: 0,
    lockCondition: 'Theme Alchemist (Nível 2)'
  }
];

export function BadgesTab() {
  const { profile, updateProfileFields } = useAuthStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedDetailBadge, setSelectedDetailBadge] = useState<BadgeItem | null>(null);

  // Fallbacks
  const points = profile?.heartPoints ?? 200;
  const selectedBadges = useMemo(() => profile?.selectedBadges || ['founder', 'premium'], [profile?.selectedBadges]);
  const unlockedBadges = useMemo(() => profile?.unlockedBadges || ['founder', 'premium', 'verified_couple'], [profile?.unlockedBadges]);

  const handleToggleEquip = async (badgeId: string) => {
    let updated = [...selectedBadges];
    const isEquipped = updated.includes(badgeId);

    if (isEquipped) {
      updated = updated.filter(id => id !== badgeId);
      toast.success('Badge oculta do perfil!');
    } else {
      if (updated.length >= 3) {
        toast.error('Você só pode equipar até 3 badges simultaneamente!');
        return;
      }
      updated.push(badgeId);
      toast.success('Badge equipada com sucesso!');
    }

    try {
      setLoadingId(badgeId);
      await updateProfileFields({ selectedBadges: updated });
    } catch {
      toast.error('Ocorreu um erro ao atualizar suas badges.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnlock = async (badge: BadgeItem) => {
    if (points < badge.cost) {
      toast.error('Corações insuficientes para adquirir esta badge!');
      return;
    }

    try {
      setLoadingId(badge.id);
      const newUnlocked = [...unlockedBadges, badge.id];
      await updateProfileFields({
        unlockedBadges: newUnlocked,
        heartPoints: points - badge.cost
      });
      toast.success(`Badge "${badge.name}" adquirida com sucesso! 🎉`);
    } catch {
      toast.error('Erro ao comprar badge.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleSimulateUnlockChallenge = async (badge: BadgeItem) => {
    if (!badge.lockCondition) return;
    try {
      setLoadingId(badge.id);
      const newUnlocked = [...unlockedBadges, badge.id];
      await updateProfileFields({
        unlockedBadges: newUnlocked
      });
      toast.success(`Conquista Alcançada! Desbloqueou "${badge.name}" 🎉`);
      // Update selected detail to refresh info
      setSelectedDetailBadge(badge);
    } catch {
      toast.error('Erro ao simular missão.');
    } finally {
      setLoadingId(null);
    }
  };

  const getRarityBadgeColor = (rarity: BadgeItem['rarity']) => {
    switch (rarity) {
      case 'lendario': return 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 border-amber-600 text-black shadow-lg shadow-amber-400/20 font-black';
      case 'epico': return 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-800 text-white shadow-md shadow-purple-500/10 font-bold';
      case 'raro': return 'bg-gradient-to-r from-blue-500 to-indigo-600 border-indigo-700 text-white shadow-sm font-semibold';
      default: return 'bg-zinc-100 border-zinc-300 text-zinc-700 font-medium';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col border-b-2 border-black pb-6 gap-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#e84e4e] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> CENTRO DE COMANDO DE IDENTIDADE
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Award className="w-9 h-9 text-black shrink-0" />
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">Medalhas e Badges</h2>
        </div>
        <p className="text-sm font-medium text-stone-600 mt-1 max-w-3xl leading-relaxed">
          Sua Vitrine de Glória: Exiba as marcas da sua jornada. Desbloqueie conquistas históricas, demonstre sua maestria no diário e selecione suas 3 badges favoritas para compor a sua insígnia oficial.
        </p>
      </div>

      {/* 🌟 Vitrine Section: Three Slots Representation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black uppercase italic flex items-center gap-2 text-stone-900">
            <Star className="w-5 h-5 text-amber-500 fill-amber-300 animate-pulse" /> Vitrine de Glória (Sua Assinatura)
          </h3>
          <span className="text-[10px] font-mono font-black uppercase text-stone-500 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full shadow-xs">
            {selectedBadges.length} / 3 Equipadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[0, 1, 2].map((idx) => {
            const badgeId = selectedBadges[idx];
            const badge = ALL_BADGES.find(b => b.id === badgeId);

            if (badge) {
              return (
                <div 
                  key={badge.id}
                  onClick={() => setSelectedDetailBadge(badge)}
                  className="bg-gradient-to-br from-amber-50/50 via-white to-amber-50/10 border-4 border-black p-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(245,158,11,1)] relative hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="absolute top-2.5 right-2.5 flex gap-1">
                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 animate-pulse">
                      🌟 Vitrine
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-3 py-2">
                    <span className="text-5xl p-2 bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl border-2 border-black/10 shadow-sm transition-transform duration-300 group-hover:scale-110">
                      {badge.emoji}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-black leading-tight uppercase">
                        {badge.name}
                      </h4>
                      <span className={`inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${getRarityBadgeColor(badge.rarity)}`}>
                        {badge.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 italic leading-relaxed line-clamp-2">
                      "{badge.description}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-stone-200 flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black text-stone-400">Slot #{idx + 1}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEquip(badge.id);
                      }}
                      className="bg-stone-50 hover:bg-rose-500 hover:text-white hover:border-black text-stone-600 font-sans text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 border border-stone-300 rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all active:translate-y-0"
                    >
                      Ocultar do Perfil
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={idx}
                className="bg-stone-50/80 border-4 border-dashed border-stone-300 hover:border-amber-400 hover:bg-amber-50/10 p-5 rounded-2xl flex flex-col items-center justify-center text-center min-h-[190px] transition-all group"
              >
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-stone-300 group-hover:border-amber-400 group-hover:bg-amber-100/50 flex items-center justify-center text-stone-400 group-hover:text-amber-500 transition-all mb-3">
                  <Award className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1 max-w-[210px]">
                  <p className="text-xs font-black text-stone-700 leading-tight uppercase">
                    Espaço Disponível
                  </p>
                  <p className="text-[10px] text-stone-400 leading-relaxed font-medium">
                    Equipe uma badge para exibir seu prestígio.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🛡️ Full Inventory / Badges selection */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-black uppercase italic flex items-center gap-2 text-stone-900 border-t border-dashed border-stone-300 pt-6">
          <Shield className="w-5 h-5 text-stone-800" /> Inventário Geral de Conquistas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_BADGES.map((badge) => {
            const hasLock = !!badge.lockCondition;
            const isUnlocked = unlockedBadges.includes(badge.id) || (badge.cost === 0 && !hasLock);
            const isEquipped = selectedBadges.includes(badge.id);

            return (
              <div 
                key={badge.id}
                onClick={() => setSelectedDetailBadge(badge)}
                className={`bg-white border-4 border-black p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 relative cursor-pointer group ${
                  isEquipped 
                    ? 'shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] bg-blue-50/5 hover:-translate-y-1' 
                    : isUnlocked 
                      ? 'shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
                      : 'shadow-[4px_4px_0px_rgba(0,0,0,0.5)] bg-stone-100/60 grayscale opacity-85 hover:-translate-y-0.5'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-1.5 bg-stone-50 border-2 border-black/5 rounded-xl group-hover:scale-105 transition-transform duration-200 shadow-sm shrink-0">
                        {badge.emoji}
                      </span>
                      <h4 className="text-base font-black text-black leading-tight uppercase font-sans">
                        {badge.name}
                      </h4>
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${getRarityBadgeColor(badge.rarity)} shrink-0`}>
                      {badge.rarity}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed min-h-[44px] font-medium">
                    {badge.description}
                  </p>

                  {/* Level Lock details */}
                  {!isUnlocked && hasLock && (
                    <div className="bg-red-50/50 border border-red-200 text-red-700 text-[10px] font-black uppercase px-2.5 py-1.5 rounded flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> Conquista necessária: {badge.lockCondition}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-dashed border-stone-100 flex items-center justify-between gap-3" onClick={e => e.stopPropagation()}>
                  {isUnlocked ? (
                    <span className="text-[10px] uppercase font-black text-emerald-500 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Desbloqueada
                    </span>
                  ) : hasLock ? (
                    <span className="text-[10px] uppercase font-black text-rose-500 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Bloqueada
                    </span>
                  ) : (
                    <div className="text-xs font-black text-rose-500 font-mono flex items-center gap-0.5">
                      <Coins className="w-4 h-4 text-[#ffb703] stroke-[2]" /> {badge.cost} 💖
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedDetailBadge(badge)}
                      className="bg-stone-50 hover:bg-stone-100 border border-stone-300 text-stone-800 text-[10px] uppercase font-black tracking-wider px-2 py-1.5 rounded"
                    >
                      História
                    </button>
                    {isEquipped ? (
                      <button
                        onClick={() => handleToggleEquip(badge.id)}
                        disabled={loadingId !== null}
                        className="bg-rose-500 text-white font-sans text-[9px] font-black uppercase tracking-wider px-3 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.2"
                      >
                        Ocultar
                      </button>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handleToggleEquip(badge.id)}
                        disabled={loadingId !== null}
                        className="bg-black hover:bg-amber-400 hover:text-black text-white font-sans text-[9px] font-black uppercase tracking-wider px-3 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-transform"
                      >
                        Equipar no Perfil
                      </button>
                    ) : hasLock ? (
                      <button
                        onClick={() => setSelectedDetailBadge(badge)}
                        className="bg-stone-100 text-stone-500 hover:bg-stone-200 font-sans text-[9px] font-black uppercase tracking-wider px-3 py-2 border-2 border-dashed border-stone-400 rounded-lg active:translate-y-0.5 transition-transform"
                      >
                        Bloqueada
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnlock(badge)}
                        disabled={loadingId !== null}
                        className="bg-amber-300 hover:bg-amber-400 text-black font-sans text-[9px] font-black uppercase tracking-wider px-3 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-transform flex items-center gap-1"
                      >
                        <Lock className="w-3.5 h-3.5 animate-pulse" /> Adquirir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📋 Log de Conquistas / Narrative Backdrop Panel */}
      {selectedDetailBadge && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-250"
          onClick={() => setSelectedDetailBadge(null)}
        >
          <div 
            className="bg-white border-4 border-black rounded-2xl w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header / Banner */}
            <div className="bg-stone-50 border-b-2 border-black p-5 relative">
              <button 
                onClick={() => setSelectedDetailBadge(null)}
                className="absolute top-4 right-4 text-stone-500 hover:text-black border-2 border-black p-1.5 bg-white hover:bg-stone-100 rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2.5 bg-white border-2 border-black rounded-xl shadow-sm">
                  {selectedDetailBadge.emoji}
                </span>
                <div>
                  <h4 className="text-lg font-black text-black leading-tight uppercase font-sans">
                    {selectedDetailBadge.name}
                  </h4>
                  <div className="flex gap-2 items-center mt-1">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${getRarityBadgeColor(selectedDetailBadge.rarity)}`}>
                      {selectedDetailBadge.rarity}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono font-black uppercase">INSÍGNIA DE PRESTÍGIO</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content / Narrative Storytelling */}
            <div className="p-6 space-y-5">
              <div className="bg-amber-50/30 border-2 border-dashed border-amber-300 p-4 rounded-xl text-center space-y-2">
                <div className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-500" /> Registro de Lore & Magistério
                </div>
                <p className="text-sm italic font-serif text-stone-700 leading-relaxed px-2">
                  "{selectedDetailBadge.lore}"
                </p>
              </div>

              {/* Conquista details info block */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-stone-500 shrink-0" />
                  <div>
                    <div className="text-[8.5px] font-mono uppercase text-stone-400 font-black">Data de Obtenção</div>
                    <div className="text-[11px] font-black text-stone-800">
                      {unlockedBadges.includes(selectedDetailBadge.id) || (selectedDetailBadge.cost === 0 && !selectedDetailBadge.lockCondition)
                        ? 'Conquistado em 20 de Junho de 2026'
                        : 'Ainda Não Conquistado'}
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-orange-500 shrink-0" />
                  <div>
                    <div className="text-[8.5px] font-mono uppercase text-stone-400 font-black">Raridade Oficial</div>
                    <div className="text-[11px] font-black text-stone-800 uppercase">
                      {selectedDetailBadge.rarity === 'lendario' ? 'Prestígio Supremo' : 'Orgulho Recíproco'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirement indicator if locked */}
              {selectedDetailBadge.lockCondition && !unlockedBadges.includes(selectedDetailBadge.id) && (
                <div className="bg-rose-50 border-2 border-dashed border-rose-300 p-3.5 rounded-lg text-rose-900 text-xs font-semibold flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-rose-800">
                    <Lock className="w-3.5 h-3.5" /> Requisito de Progresso
                  </div>
                  <span>Conquista necessária: <strong className="font-black underline">{selectedDetailBadge.lockCondition}</strong></span>
                </div>
              )}

              <p className="text-xs text-stone-500 leading-relaxed">
                Esta insígnia é concedida para eternizar as conquistas históricas do seu relacionamento e diário. Equipe-a em sua Vitrine de Glórias para customizar a sua assinatura no perfil visível.
              </p>
            </div>

            {/* Action Bar */}
            <div className="bg-stone-50 border-t-2 border-black p-4 flex items-center justify-between">
              {unlockedBadges.includes(selectedDetailBadge.id) || (selectedDetailBadge.cost === 0 && !selectedDetailBadge.lockCondition) ? (
                <div className="text-[10px] uppercase font-black text-emerald-500 flex items-center gap-1">
                  <Check className="w-4 h-4 stroke-[3]" /> Conquistada
                </div>
              ) : selectedDetailBadge.lockCondition ? (
                <div className="text-[10px] uppercase font-black text-rose-500 flex items-center gap-1">
                  <Lock className="w-4 h-4" /> Bloqueada por Nível
                </div>
              ) : (
                <div className="text-sm font-black text-orange-500 font-mono flex items-center gap-1 bg-white px-2.5 py-1 border border-black rounded shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  Custo: {selectedDetailBadge.cost} 💖
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDetailBadge(null)}
                  className="bg-white hover:bg-stone-100 text-black font-sans text-[10px] font-black uppercase tracking-wider px-4 py-2 border border-stone-300 rounded-lg shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                >
                  Fechar
                </button>

                {unlockedBadges.includes(selectedDetailBadge.id) || (selectedDetailBadge.cost === 0 && !selectedDetailBadge.lockCondition) ? (
                  <button
                    onClick={() => {
                      handleToggleEquip(selectedDetailBadge.id);
                    }}
                    className={`font-sans text-[10px] font-black uppercase tracking-wider px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-colors ${
                      selectedBadges.includes(selectedDetailBadge.id)
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-black text-white hover:bg-amber-400 hover:text-black'
                    }`}
                  >
                    {selectedBadges.includes(selectedDetailBadge.id) ? 'Ocultar do Perfil' : 'Definir como Favorita'}
                  </button>
                ) : selectedDetailBadge.lockCondition ? (
                  <button
                    onClick={() => handleSimulateUnlockChallenge(selectedDetailBadge)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-sans text-[10px] font-black uppercase tracking-wider px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 transition-colors"
                  >
                    <Unlock className="w-3.5 h-3.5" /> Simular Desbloqueio
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnlock(selectedDetailBadge)}
                    className="bg-amber-300 hover:bg-amber-400 text-black font-sans text-[10px] font-black uppercase tracking-wider px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 animate-bounce" /> Adquirir Badge
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
