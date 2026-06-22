import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/auth';
import { FRAMES_CATALOG, RARITY_DETAILS, ProfileFrame, FrameCustomization } from '../../data/frames';
import { AvatarWithFrame } from '../../components/AvatarWithFrame';
import { 
  Heart, 
  Sparkles, 
  Trophy, 
  ShoppingBag, 
  Check, 
  Lock, 
  Palette, 
  Sliders, 
  Search, 
  Filter, 
  Share2, 
  Award, 
  Calendar, 
  Layers, 
  Coins, 
  Star, 
  BadgeCheck, 
  Plus, 
  Info,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export function MoldurasTab() {
  const { 
    user, 
    profile, 
    equipFrame, 
    updateFrameCustomization, 
    toggleFavoriteFrame, 
    unlockFrame, 
    addHeartPoints 
  } = useAuthStore();

  const [activeCatalogTab, setActiveCatalogTab] = useState<'inventory' | 'shop' | 'collections'>('inventory');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Daily rewards simulation
  const [claiming, setClaiming] = useState(false);

  // Fallback defaults for customization
  const frameCustom = useMemo(() => {
    return profile?.frameCustomization || {
      color: '#e84e4e',
      thickness: 'medium',
      effect: 'none',
      transparency: 0
    };
  }, [profile?.frameCustomization]);

  // Current Equipped Frame
  const equippedFrame = useMemo(() => {
    return FRAMES_CATALOG.find(f => f.id === profile?.avatarFrame) || null;
  }, [profile?.avatarFrame]);

  // Unlocked list
  const unlockedIds = useMemo(() => {
    return profile?.unlockedFrames || ['bq_boas_vindas'];
  }, [profile?.unlockedFrames]);

  // Favorites list
  const favoriteIds = useMemo(() => {
    return profile?.favoriteFrames || [];
  }, [profile?.favoriteFrames]);

  // Point count
  const points = profile?.heartPoints ?? 200;

  // Custom presets for Color Picker
  const COLOR_PRESETS = [
    { name: 'Amor Rosa', hex: '#e84e4e' },
    { name: 'Ciano Ciber', hex: '#06b6d4' },
    { name: 'Púrpura Neon', hex: '#a855f7' },
    { name: 'Ouro Imperial', hex: '#eab308' },
    { name: 'Verde Matriz', hex: '#22c55e' },
    { name: 'Esmeralda', hex: '#10b981' },
    { name: 'Azul Elétrico', hex: '#3b82f6' },
    { name: 'Rosa Choque', hex: '#ec4899' },
    { name: 'Cinza Platina', hex: '#64748b' },
    { name: 'Executivo Black', hex: '#1e293b' }
  ];

  // Grouped Collections definitions
  const COLLECTIONS_DEFS = [
    {
      id: 'first_date',
      name: '❤️ First Date Collection',
      description: 'Celebre as primeiras faíscas da paixão.',
      frameIds: ['coracoes', 'love_letter', 'bq_boas_vindas', 'tulipas']
    },
    {
      id: 'engagement',
      name: '💍 Engagement Collection',
      description: 'Símbolos divinos do compromisso definitivo.',
      frameIds: ['aliancas', 'alianca_💍', 'bq_love_verified']
    },
    {
      id: 'romantic',
      name: '🌹 Romantic Collection',
      description: 'Estilo clássico da poesia e buquês florais.',
      frameIds: ['rosas', 'laco_vermelho', 'casal_love', 'part_coracoes', 'alma_gemea']
    },
    {
      id: 'developer',
      name: '💻 Developer Collection',
      description: 'Código, compilações e segredos do backend.',
      frameIds: ['dev_react', 'dev_node', 'dev_js', 'dev_ts', 'dev_terminal', 'dev_matrix']
    },
    {
      id: 'gamer',
      name: '🎮 Gamer Collection',
      description: 'Consoles clássicos, conquistas e luzes RGB.',
      frameIds: ['gamer_cyberpunk', 'gamer_pixel', 'gamer_rpg', 'gamer_arcade', 'gamer_levelup']
    },
    {
      id: 'pixelrepo',
      name: '👾 PixelRepo Retro Collect',
      description: 'Molduras de pixel art pixel-perfect inspiradas no PixelRepo.',
      frameIds: [
        'pixel_slime', 
        'pixel_potion_hp', 
        'pixel_potion_mp', 
        'pixel_shield_wood', 
        'pixel_magic_scroll', 
        'pixel_heart_hud', 
        'pixel_crystal_socket', 
        'pixel_cyber_hacker'
      ]
    },
    {
      id: 'galaxy',
      name: '🌌 Galaxy Collection',
      description: 'Constelações infinitas e poeira estelar cósmica.',
      frameIds: ['p_galaxy', 'p_nebula', 'p_hologram', 'part_estrelas']
    },
    {
      id: 'legendary',
      name: '👑 Legendary Collection',
      description: 'O topo da distinção e prestígio no site.',
      frameIds: ['p_gold_crown', 'p_legendary', 'p_crystal', 'aura_dourada', 'bq_veterano']
    }
  ];

  // Categories list
  const CATEGORIES = [
    { id: 'todos', label: 'Todos' },
    { id: 'PixelRepo', label: 'PixelRepo 👾' },
    { id: 'basicas', label: 'Básicas' },
    { id: 'romance', label: 'Romance' },
    { id: 'dev', label: 'Dev' },
    { id: 'gamer', label: 'Gamer' },
    { id: 'tecnologia', label: 'Tecnologia' },
    { id: 'empresarial', label: 'Corporativo' },
    { id: 'animadas', label: 'Animadas' },
    { id: 'casal', label: 'Casal' },
    { id: 'conquistas', label: 'Conquistas' },
    { id: 'premium', label: 'Premium' }
  ];

  // Filtering frames catalog
  const filteredCatalog = useMemo(() => {
    return FRAMES_CATALOG.filter(frame => {
      // Category Filter (Case Insensitive)
      if (selectedCategoryId !== 'todos' && frame.category.toLowerCase() !== selectedCategoryId.toLowerCase()) {
        return false;
      }

      // Tab Specific Filtering
      if (activeCatalogTab === 'inventory') {
        const isUnlocked = unlockedIds.includes(frame.id);
        if (!isUnlocked) return false;
      } else if (activeCatalogTab === 'shop') {
        const isUnlocked = unlockedIds.includes(frame.id);
        // Only show purchaseable/locked/all items in shop, but highlight unlocked ones
      }

      // Search query filtering
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          frame.name.toLowerCase().includes(q) ||
          frame.description.toLowerCase().includes(q) ||
          frame.rarity.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [activeCatalogTab, selectedCategoryId, searchQuery, unlockedIds]);

  // Handle Equipping
  const handleEquip = async (frameId: string | null) => {
    try {
      await equipFrame(frameId);
      if (frameId) {
        const fName = FRAMES_CATALOG.find(f => f.id === frameId)?.name;
        toast.success(`Moldura "${fName}" equipada com sucesso!`);
      } else {
        toast.success(`Removida moldura do avatar.`);
      }
    } catch {
      toast.error('Erro ao equipar moldura.');
    }
  };

  // Handle Unlocking/Purchase
  const handleBuy = async (frame: ProfileFrame) => {
    if (unlockedIds.includes(frame.id)) {
      handleEquip(frame.id);
      return;
    }

    const price = frame.price ?? 0;
    if (points < price) {
      toast.error(`Pontos insuficientes! São necessários ${price} 💖.`);
      return;
    }

    try {
      const success = await unlockFrame(frame.id, price);
      if (success) {
        toast.success(`Parabéns! Moldura "${frame.name}" desbloqueada!`);
      } else {
        toast.error('Erro ao realizar compra.');
      }
    } catch {
      toast.error('Erro ao processar transação.');
    }
  };

  // Simulated Daily Reward Claiming
  const handleClaimPoints = async () => {
    setClaiming(true);
    try {
      const reward = 150; // Claim 150 points
      await addHeartPoints(reward);
      toast.success(`Mimo recebido! +${reward} 💖 adicionados à carteira!`);
    } catch {
      toast.error('Erro ao resgatar pontos.');
    } finally {
      setClaiming(false);
    }
  };

  // Handle Share Feature
  const handleShare = () => {
    const shareText = `Olha a minha moldura premium "${equippedFrame?.name || 'Padrão'}" no meu perfil do Nosso Espaço! 💖✨`;
    navigator.clipboard.writeText(window.location.origin + '/painel');
    toast.success('Link do perfil copiado para compartilhar! 🚀');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Tab Header Banner */}
      <div className="bg-gradient-to-r from-[#e84e4e] via-rose-500 to-pink-500 border-2 border-black p-6 md:p-8 text-white relative shadow-[6px_6px_0px_0px_#1a1a1a] overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic">Coleção de Molduras</h2>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-white/90">
              Personalize seu retrato com molduras animadas, conquistas e cosméticos interativos 
            </p>
          </div>
          
          {/* Heart Points Indicator */}
          <div className="flex items-center gap-4 bg-black/25 border-2 border-white/20 p-4 md:px-6 rounded-none backdrop-blur-sm self-start md:self-auto group">
            <div className="p-2.5 bg-[#e84e4e] rounded-full border border-white animate-pulse">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase font-black tracking-widest opacity-75 text-pink-200">Saldo Corações</p>
              <span className="text-2xl font-black">{points} 💖</span>
            </div>
            <button 
              onClick={handleClaimPoints} 
              disabled={claiming}
              className="ml-4 bg-white text-[#e84e4e] font-sans font-bold uppercase text-[9px] tracking-wider px-3 py-2 border border-black hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Claims diário (+150)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: REAL-TIME PREVIEW & PERSONALIZATION */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Real-Time Preview Card */}
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_#1a1a1a] flex flex-col items-center justify-center text-center relative overflow-hidden group">
            {/* Rarity label watermark */}
            {equippedFrame && (
              <span className="absolute top-4 left-4 font-mono text-[9px] font-bold uppercase border border-black/20 bg-gray-100 text-gray-600 px-2.5 py-0.8 rounded-sm">
                Raridade: {equippedFrame.rarity}
              </span>
            )}

            <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 font-sans text-[9px] font-bold px-2 py-0.5 border border-emerald-300 uppercase tracking-widest">
              Preview Real
            </span>

            {/* Simulated Live Avatar Rendering */}
            <div className="my-8 relative">
              <AvatarWithFrame 
                src={user?.photoURL || undefined}
                partnerSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200" // Simulated matching partner photo
                frameId={profile?.avatarFrame}
                customization={frameCustom}
                size="xl"
              />
            </div>

            <div className="space-y-1.5 w-full mt-2">
              <h3 className="font-black text-xl uppercase tracking-tight text-[#1a1a1a]">
                {equippedFrame ? equippedFrame.name : 'Nenhuma Equipada'}
              </h3>
              <p className="font-serif text-xs text-gray-500 max-w-xs mx-auto italic min-h-[32px]">
                {equippedFrame ? equippedFrame.description : 'Sua foto de perfil sem cosméticos adicionais. Escolha uma abaixo.'}
              </p>
            </div>

            {/* Quick Share / Reset Actions */}
            <div className="w-full grid grid-cols-2 gap-3 mt-6 border-t border-black/10 pt-4">
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 font-sans font-bold text-xs uppercase tracking-wider py-2.5 bg-gray-100 border border-black hover:bg-black hover:text-white transition-all text-[#1a1a1a]"
              >
                <Share2 size={14} /> Compartilhar
              </button>
              <button 
                onClick={() => handleEquip(null)}
                disabled={!profile?.avatarFrame}
                className="flex items-center justify-center gap-2 font-sans font-bold text-xs uppercase tracking-wider py-2.5 bg-rose-50 border border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white disabled:opacity-40 disabled:hover:bg-rose-50 disabled:hover:text-rose-600 transition-all"
              >
                Remover Frame
              </button>
            </div>
          </div>

          {/* Frame Customization Customizing Editor */}
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_#1a1a1a] space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tight italic flex items-center gap-2 border-b border-black/10 pb-3">
              <Sliders className="w-5 h-5 text-[#e84e4e]" />
              Editor de Molduras
            </h3>

            {/* Thickness Control */}
            <div className="space-y-2">
              <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/70 block">
                Espessura da Borda
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['thin', 'medium', 'thick'] as const).map((wt) => (
                  <button
                    key={wt}
                    type="button"
                    onClick={() => updateFrameCustomization({ thickness: wt })}
                    className={`font-sans font-bold text-[10px] py-2 border border-black uppercase tracking-wider transition-colors ${
                      frameCustom.thickness === wt 
                        ? 'bg-[#1a1a1a] text-white' 
                        : 'bg-white text-[#1a1a1a] hover:bg-gray-100'
                    }`}
                  >
                    {wt === 'thin' ? 'Fina' : wt === 'medium' ? 'Média' : 'Grossa'}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Effects Control */}
            <div className="space-y-2">
              <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/70 block">
                Efeito Especial
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'none', label: 'Nenhum' },
                  { id: 'glow', label: 'Glow' },
                  { id: 'pulse', label: 'Pulsar' },
                  { id: 'rotate', label: 'Girar' },
                  { id: 'float', label: 'Flutuar' }
                ].map((eff) => (
                  <button
                    key={eff.id}
                    type="button"
                    onClick={() => updateFrameCustomization({ effect: eff.id as any })}
                    className={`font-sans font-bold text-[9px] py-2 border border-black uppercase tracking-widest transition-colors ${
                      frameCustom.effect === eff.id 
                        ? 'bg-[#e84e4e] text-white' 
                        : 'bg-white text-[#1a1a1a] hover:bg-gray-100'
                    }`}
                  >
                    {eff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transparency Control Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/75">
                <span>Transparência</span>
                <span>{frameCustom.transparency}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="80" 
                step="10"
                value={frameCustom.transparency}
                onChange={(e) => updateFrameCustomization({ transparency: parseInt(e.target.value) })}
                className="w-full accent-[#e84e4e]" 
              />
              <div className="flex justify-between text-[8px] font-sans font-bold uppercase text-gray-400">
                <span>Sólido</span>
                <span>Médio (40%)</span>
                <span>Invisível (80%)</span>
              </div>
            </div>

            {/* Color Presets Picker */}
            <div className="space-y-3">
              <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/70 block">
                Cor Personalizada (Color Picker)
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => updateFrameCustomization({ color: preset.hex })}
                    className={`w-7 h-7 rounded-sm border-2 transition-transform hover:scale-110 ${
                      frameCustom.color === preset.hex ? 'border-black scale-105 shadow-sm' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    title={preset.name}
                  />
                ))}
                
                {/* Custom Hex input */}
                <div className="flex items-center border border-black rounded-none overflow-hidden pl-2 bg-gray-50 max-w-[120px]">
                  <span className="text-gray-400 text-xs font-mono">#</span>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={frameCustom.color?.replace('#', '') || ''}
                    onChange={(e) => updateFrameCustomization({ color: `#${e.target.value}` })}
                    className="w-full bg-transparent font-mono text-[9px] font-black uppercase text-[#1a1a1a] p-1.5 focus:outline-none"
                    placeholder="FFFFFF"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: MAIN INVENTORY, MARKETPLACE, COLLECTIONS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section Navigation Tabs */}
          <div className="flex border-b-2 border-black">
            {[
              { id: 'inventory', label: 'Minhas Molduras', icon: Award },
              { id: 'shop', label: 'Mercado de Molduras 🛍️', icon: ShoppingBag },
              { id: 'collections', label: 'Coleções Especiais 🏆', icon: Layers }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCatalogTab(tab.id as any);
                  setSearchQuery('');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-sans font-bold uppercase text-[10px] md:text-sm tracking-wider border-2 border-b-0 border-transparent transition-all ${
                  activeCatalogTab === tab.id 
                    ? 'border-black border-t-4 border-t-[#e84e4e] bg-white text-black translate-y-[2px]' 
                    : 'text-gray-500 hover:text-black hover:bg-gray-100/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Render Inventory & Shop lists */}
          {activeCatalogTab !== 'collections' ? (
            <div className="space-y-4">
              
              {/* Filter controls segment */}
              <div className="bg-white border-2 border-black p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:-max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar molduras..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full font-sans text-xs bg-gray-50 border border-black py-2.5 pl-9 pr-4 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#e84e4e]"
                  />
                </div>

                {/* Horizontal Category Pill selector */}
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
                  <span className="text-[10px] font-sans font-black uppercase text-[#1a1a1a]/60 flex items-center gap-1.5 whitespace-nowrap">
                    <Filter size={11} /> Categoria:
                  </span>
                  <select 
                    value={selectedCategoryId} 
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="bg-white border border-black font-sans text-xs p-2 text-[#1a1a1a] focus:outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid with lists of profile cards */}
              {filteredCatalog.length === 0 ? (
                <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_#1a1a1a]">
                  <div className="w-16 h-16 bg-gray-100 border border-dashed border-black mx-auto flex items-center justify-center rounded-none mb-4">
                    <Search className="w-6 h-6 text-gray-400 animate-pulse" />
                  </div>
                  <h4 className="font-sans font-black uppercase text-sm text-gray-700">Nenhuma moldura encontrada</h4>
                  <p className="font-serif text-xs text-gray-400 mt-1">Efetue login, reivindique corações gratuitos ou altere seus termos de busca!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredCatalog.map((frame) => {
                    const isUnlocked = unlockedIds.includes(frame.id);
                    const isEquipped = profile?.avatarFrame === frame.id;
                    const isFavorited = favoriteIds.includes(frame.id);
                    const rarityDetail = RARITY_DETAILS[frame.rarity] || RARITY_DETAILS.comum;

                    return (
                      <div 
                        key={frame.id}
                        onClick={() => {
                          if (isUnlocked) {
                            handleEquip(isEquipped ? null : frame.id);
                          } else {
                            handleBuy(frame);
                          }
                        }}
                        className={`bg-white border-2 border-black p-4 flex flex-col justify-between hover:translate-y-[-2px] transition-all cursor-pointer relative ${
                          isEquipped ? 'ring-2 ring-[#e84e4e] ring-offset-2' : ''
                        } shadow-[4px_4px_0px_0px_#1a1a1a] hover:shadow-[6px_6px_0px_0px_#e84e4e] duration-250`}
                      >
                        
                        {/* Frame Category Header */}
                        <div className="flex justify-between items-start gap-3">
                          <div className="space-y-1">
                            <span className={`inline-block font-mono text-[8px] font-black uppercase border border-black/20 px-1.5 py-0.2 rounded-sm ${rarityDetail.bg} ${rarityDetail.text}`}>
                              {rarityDetail.label}
                            </span>
                            <h4 className="font-sans font-black text-sm uppercase text-[#1a1a1a]">
                              {frame.name}
                            </h4>
                          </div>

                          {/* Mini Avatar render */}
                          <div className="scale-65 origin-top-right">
                            <AvatarWithFrame 
                              src={user?.photoURL || undefined}
                              frameId={frame.id}
                              customization={frameCustom}
                              size="sm"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="font-serif text-xs text-gray-500 mt-2 min-h-[48px] line-clamp-3">
                          {frame.description}
                        </p>

                        {/* Cost & Favorite Action Section */}
                        <div className="flex items-center justify-between border-t border-black/10 pt-3 mt-4">
                          
                          {/* Unlocked / Locked costs display */}
                          <div className="flex items-center gap-1.5">
                            {isUnlocked ? (
                              <span className="flex items-center gap-1 font-sans text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-sm">
                                <Check size={10} /> Adquirido
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 font-sans text-xs font-black text-[#e84e4e]">
                                <Coins size={12} className="text-amber-500" /> {frame.price ?? 0} 💖
                              </span>
                            )}
                            
                            {frame.animated && (
                              <span className="font-sans text-[8px] font-bold uppercase tracking-widest bg-cyan-50 border border-cyan-150 text-cyan-600 px-1 rounded-sm">
                                Animativa
                              </span>
                            )}
                          </div>

                          {/* Favorite button and status check */}
                          <div className="flex items-center gap-2">
                            {isUnlocked && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavoriteFrame(frame.id);
                                }}
                                className={`p-1.5 border border-black text-[#1a1a1a] hover:bg-rose-50 transition-colors ${
                                  isFavorited ? 'bg-rose-100 border-red-500 text-[#e84e4e]' : 'bg-white'
                                }`}
                                title="Favoritar Moldura"
                              >
                                <Star size={11} className={isFavorited ? 'fill-red-500 text-red-500' : ''} />
                              </button>
                            )}

                            {isUnlocked ? (
                              <button
                                type="button"
                                className={`font-sans font-bold uppercase text-[9px] px-3 py-1.5 border border-black transition-colors ${
                                  isEquipped 
                                    ? 'bg-rose-600 text-white border-rose-600' 
                                    : 'bg-white text-black hover:bg-gray-100'
                                }`}
                              >
                                {isEquipped ? 'Equipada' : 'Equipar'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="font-sans font-bold uppercase text-[9px] px-3 py-1.5 bg-black text-white hover:bg-[#e84e4e] hover:text-white transition-all border border-black"
                              >
                                Comprar
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            
            // COLLECTIONS SPECIAL LIST TABS
            <div className="space-y-6">
              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#1a1a1a]">
                <h3 className="text-xl font-black uppercase tracking-tight italic flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-[#e84e4e]" />
                  Coleções Temáticas Exclusivas
                </h3>
                <p className="font-serif text-xs text-gray-500">
                  Desbloqueie molduras das mesmas coleções para preencher seu álbum de memórias e provar sua dedicação!
                </p>
              </div>

              {COLLECTIONS_DEFS.map((col) => {
                // Calculate progress
                const unlockedInCollection = col.frameIds.filter(id => unlockedIds.includes(id)).length;
                const progressPct = Math.round((unlockedInCollection / col.frameIds.length) * 100);

                return (
                  <div key={col.id} className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_0px_#1a1a1a]" >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/10 pb-4 mb-4">
                      <div>
                        <h4 className="font-sans font-black text-base uppercase tracking-tight text-[#1a1a1a]">
                          {col.name}
                        </h4>
                        <p className="font-serif text-xs text-gray-400 mt-0.5">{col.description}</p>
                      </div>

                      {/* Progress Badge */}
                      <div className="flex items-center gap-2 bg-pink-50 border border-rose-200 px-3 py-1.5 font-sans font-black uppercase text-xs text-rose-600">
                        <span>Progresso:</span>
                        <span>{unlockedInCollection} / {col.frameIds.length}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-gray-100 border border-black mb-4 overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-[#e84e4e] transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Miniature representation list in collection */}
                    <div className="flex flex-wrap gap-4 pt-1">
                      {col.frameIds.map((frameId) => {
                        const frame = FRAMES_CATALOG.find(f => f.id === frameId);
                        if (!frame) return null;

                        const isUnlocked = unlockedIds.includes(frameId);
                        const isEquipped = profile?.avatarFrame === frameId;

                        return (
                          <div 
                            key={frameId}
                            onClick={() => {
                              if (isUnlocked) {
                                handleEquip(isEquipped ? null : frameId);
                              } else {
                                handleBuy(frame);
                              }
                            }}
                            className={`flex flex-col items-center p-2.5 border-2 hover:border-black transition-all cursor-pointer w-[95px] relative group ${
                              isUnlocked ? 'border-dashed border-gray-300' : 'border-dashed border-red-200 bg-red-50/20'
                            }`}
                          >
                            <AvatarWithFrame 
                              src={user?.photoURL || undefined}
                              frameId={frameId}
                              customization={frameCustom}
                              size="xs"
                            />
                            
                            <span className="font-sans text-[8px] font-bold text-center uppercase tracking-wider text-gray-700 mt-2 truncate w-full group-hover:text-[#e84e4e]">
                              {frame.name.split(' ')[0]}
                            </span>
                            
                            {!isUnlocked && (
                              <div className="absolute top-1 right-1 bg-black text-white p-0.5 scale-75 border border-black">
                                <Lock size={8} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
