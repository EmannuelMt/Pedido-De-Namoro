import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Briefcase, 
  Phone, 
  Key, 
  Sparkles, 
  Check, 
  Building,
  Gamepad2,
  FileText,
  MessageSquare,
  Bookmark,
  Zap,
  Globe,
  Palette,
  Award
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

import { AVATAR_FRAMES } from '../../data/frames';
import { TITLES_LIST } from '../../data/titles';

export function ProfileTab() {
  const { user, profile, updateProfileFields } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [savingPersonal, setSavingPersonal] = useState(false);

  const handleFrameChange = async (frameId: string) => {
    try {
      await updateProfileFields({ selectedFrame: frameId });
      toast.success('Moldura atualizada com sucesso! ✨');
    } catch (error) {
      toast.error('Erro ao trocar moldura.');
    }
  };

  const handleTitleChange = async (titleId: string) => {
    try {
      await updateProfileFields({ selectedTitle: titleId });
      toast.success('Título atualizado com sucesso! ✨');
    } catch (error) {
      toast.error('Erro ao trocar título.');
    }
  };

  // Form states matching user profile data
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    cargo: '',
    empresa: '',
    localizacao: '',
    telefone: '',
    nicknameRpg: '',
    codigoSecreto: '',
    website: '',
    bio: ''
  });

  // Sync state with store profile on load or profile change
  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || user?.displayName || '',
        username: profile.username || '',
        cargo: profile.cargo || '',
        empresa: profile.empresa || '',
        localizacao: profile.localizacao || '',
        telefone: profile.telefone || '',
        nicknameRpg: profile.nicknameRpg || '',
        codigoSecreto: profile.codigoSecreto || '',
        website: profile.website || '',
        bio: profile.bio || ''
      });
    }
  }, [profile, user]);

  const handleChange = (key: string, val: string) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  // Submit Personal form
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPersonal(true);
    
    const fieldsToSave = {
      displayName: formData.displayName,
      username: formData.username,
      cargo: formData.cargo,
      empresa: formData.empresa,
      localizacao: formData.localizacao,
      telefone: formData.telefone,
      nicknameRpg: formData.nicknameRpg,
      codigoSecreto: formData.codigoSecreto,
      website: formData.website,
      bio: formData.bio
    };

    try {
      await updateProfileFields(fieldsToSave);
      toast.success('Alterações salvas com sucesso! ✨');
    } catch {
      toast.error('Erro ao salvar as configurações.');
    } finally {
      setSavingPersonal(false);
    }
  };

  const currentAvatar = profile?.avatar || user?.photoURL || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-350">
      
      {/* 1. CARTOON SPEEB ALL REPLACEMENTS FOR COMPATIBILITY */}
      <div className="relative bg-white border-[4px] border-black p-6 rounded-[24px] shadow-[8px_8px_0px_0px_#1a1a1a] overflow-hidden transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#1a1a1a]">
        
        {/* Playful dotted mesh top header */}
        <div className="absolute inset-x-0 top-0 h-4 bg-[#e84e4e] border-b-[4px] border-black select-none" />
        
        <div className="mt-4 flex flex-col md:flex-row items-center gap-6 relative z-10">
          
          {/* Avatar frame area */}
          <div className="relative shrink-0 select-none">
            {/* Round shadow stamp */}
            <div className="absolute inset-0 rounded-full bg-[#1a1a1a] translate-x-1.5 translate-y-1.5" />
            <div className={`w-16 h-16 rounded-full overflow-hidden border-[3px] border-black relative z-10 bg-white ${
              AVATAR_FRAMES.find(f => f.id === (profile?.selectedFrame || 'none'))?.className || ''
            }`}>
              <img 
                src={currentAvatar} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Dialogue balloon speaking tip */}
          <div className="flex-1 min-w-0 relative">
            
            {/* The Cartoon Speech Bubble */}
            <div className="relative bg-white border-[3px] border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_#1a1a1a]">
              {/* Triangle tip pointed towards the avatar */}
              <div className="absolute left-1/2 -top-3 md:left-[-11px] md:top-1/2 md:-translate-y-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-black lg:border-b-transparent lg:border-r-black lg:border-r-[10px] lg:border-t-[10px] lg:border-t-transparent lg:border-b-[10px]" />
              
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-sans font-black text-sm uppercase text-black tracking-tight">
                  {formData.displayName || 'Manoel Matos'}
                </span>
                <span className="px-2 py-0.5 bg-[#e84e4e] border-[2px] border-black text-white rounded text-[9px] font-black tracking-widest uppercase select-none leading-none rotate-2">
                  {formData.empresa || 'COMPANY'}
                </span>
              </div>
              
              <div className="mb-2">
                {profile?.selectedTitle && profile?.selectedTitle !== 'none' && (
                  <span className={`text-[10px] ${TITLES_LIST.find(t => t.id === profile.selectedTitle)?.className || 'text-zinc-500 font-bold'}`}>
                    « {TITLES_LIST.find(t => t.id === profile.selectedTitle)?.name || profile.selectedTitle} »
                  </span>
                )}
              </div>
              
              <p className="font-sans font-bold text-xs text-zinc-600 truncate">
                <span className="text-[#e84e4e] font-semibold">@{formData.username || 'username'}</span>
                {formData.cargo && <span className="text-zinc-500"> • {formData.cargo}</span>}
              </p>

              {/* Dotted sketch design on the right */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden sm:block">
                <span className="text-xl">💥</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. PROFILE EDITING PANEL ("Perfil Principal") */}
      <div className="bg-white border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_#1a1a1a]">
        <form onSubmit={handleSavePersonal} className="space-y-6">
          
          {/* Header row modeled like a comic cover header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-[4px] border-black pb-5 gap-4">
            <div className="flex items-center gap-3">
              {/* Logo stamp for the panel */}
              <div className="w-10 h-10 bg-[#e84e4e] border-[3px] border-black rounded-xl flex items-center justify-center text-white shadow-[4px_4px_0px_0px_#1a1a1a] -rotate-3 hover:rotate-3 transition-transform">
                <User size={18} strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-black text-base md:text-lg font-black uppercase tracking-tight font-sans">
                  Perfil Principal
                </h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Opções do Universo Cartoon</p>
              </div>
            </div>
            
            {/* Cartoon styled submit button */}
            <button 
              type="submit" 
              disabled={savingPersonal}
              className="bg-[#e84e4e] hover:bg-red-600 active:translate-y-0.5 active:shadow-[2px_2px_0px_#1a1a1a] text-white text-xs font-black uppercase tracking-widest py-3 px-6 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_#1a1a1a] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check size={14} strokeWidth={3} />
              <span>{savingPersonal ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}</span>
            </button>
          </div>

          {/* Form fields styled like notebook pages with thick borders and solid backgrounds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            
            {/* NOME COMPLETO */}
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-1 bg-yellow-300 border-[2px] border-black text-black font-sans font-black text-[10px] uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_0px_#1a1a1a]">
                Nome Completo
              </span>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.displayName} 
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  placeholder="Nome Completo"
                  className="w-full bg-white border-[3px] border-black rounded-xl py-3 px-4 text-black outline-none transition-all font-sans font-bold text-xs shadow-inner focus:bg-yellow-50/20" 
                />
              </div>
            </div>

            {/* USERNAME */}
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-1 bg-sky-300 border-[2px] border-black text-black font-sans font-black text-[10px] uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_0px_#1a1a1a]">
                Username
              </span>
              <div className="relative flex items-center">
                <span className="absolute left-4 font-sans text-xs font-black text-zinc-500">@</span>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="username"
                  className="w-full bg-white border-[3px] border-black rounded-xl py-3 pl-8 pr-4 text-black outline-none transition-all font-sans font-bold text-xs shadow-inner focus:bg-sky-50/20" 
                />
              </div>
            </div>

            {/* EMPRESA */}
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-1 bg-purple-300 border-[2px] border-black text-black font-sans font-black text-[10px] uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_0px_#1a1a1a]">
                Empresa
              </span>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.empresa} 
                  onChange={(e) => handleChange('empresa', e.target.value)}
                  placeholder="Nome da Empresa"
                  className="w-full bg-white border-[3px] border-black rounded-xl py-3 px-4 text-black outline-none transition-all font-sans font-bold text-xs shadow-inner focus:bg-purple-50/20" 
                />
              </div>
            </div>

            {/* CARGO */}
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-1 bg-pink-300 border-[2px] border-black text-black font-sans font-black text-[10px] uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_0px_#1a1a1a]">
                Cargo / Função
              </span>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.cargo} 
                  onChange={(e) => handleChange('cargo', e.target.value)}
                  placeholder="Senior Software Engineer"
                  className="w-full bg-white border-[3px] border-black rounded-xl py-3 px-4 text-black outline-none transition-all font-sans font-bold text-xs shadow-inner focus:bg-pink-50/20" 
                />
              </div>
            </div>

            {/* TELEFONE */}
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-1 bg-orange-300 border-[2px] border-black text-black font-sans font-black text-[10px] uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_0px_#1a1a1a]">
                Telefone
              </span>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.telefone} 
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="+55 11 99999-9999"
                  className="w-full bg-white border-[3px] border-black rounded-xl py-3 px-4 text-black outline-none transition-all font-sans font-bold text-xs shadow-inner focus:bg-orange-50/20" 
                />
              </div>
            </div>

            {/* CIDADE */}
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-1 bg-lime-300 border-[2px] border-black text-black font-sans font-black text-[10px] uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_0px_#1a1a1a]">
                Localização
              </span>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.localizacao} 
                  onChange={(e) => handleChange('localizacao', e.target.value)}
                  placeholder="São Paulo, Brasil"
                  className="w-full bg-white border-[3px] border-black rounded-xl py-3 px-4 text-black outline-none transition-all font-sans font-bold text-xs shadow-inner focus:bg-lime-50/20" 
                />
              </div>
            </div>

            {/* NICKNAME RPG */}
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-1 bg-amber-400 border-[2px] border-black text-black font-sans font-black text-[10px] uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_0px_#1a1a1a]">
                Nickname RPG
              </span>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.nicknameRpg} 
                  onChange={(e) => handleChange('nicknameRpg', e.target.value)}
                  placeholder="ex: DarkAdventurer"
                  className="w-full bg-white border-[3px] border-black rounded-xl py-3 px-4 text-black outline-none transition-all font-sans font-bold text-xs shadow-inner focus:bg-amber-50/20" 
                />
              </div>
            </div>

            {/* CÓDIGO SECRETO */}
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-1 bg-rose-300 border-[2px] border-black text-black font-sans font-black text-[10px] uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_0px_#1a1a1a]">
                Código Secreto
              </span>
              <div className="relative">
                <input 
                  type="password" 
                  value={formData.codigoSecreto} 
                  onChange={(e) => handleChange('codigoSecreto', e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full bg-white border-[3px] border-black rounded-xl py-3 px-4 text-black outline-none transition-all font-sans font-bold text-xs shadow-inner focus:bg-rose-50/20" 
                />
              </div>
            </div>

          </div>
          
        </form>
      </div>

      {/* 3. THEME SELECTION PANEL */}
      <div className="bg-white border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_#1a1a1a]">
        <div className="flex items-center gap-3 border-b-[4px] border-black pb-5 mb-6">
          <div className="w-10 h-10 bg-black border-[3px] border-black rounded-xl flex items-center justify-center text-white shadow-[4px_4px_0px_0px_#8b5cf6] rotate-3 hover:-rotate-3 transition-transform">
            <Palette size={18} strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-black text-base md:text-lg font-black uppercase tracking-tight font-sans">
              Personalização Visual
            </h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Escolha a atmosfera do seu universo</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { id: 'universe', label: 'Universo', icon: '🌌', colors: ['bg-[#8b5cf6]', 'bg-[#ec4899]'] },
            { id: 'classic', label: 'Clássico', icon: '🎨', colors: ['bg-[#e84e4e]', 'bg-[#ff90e8]'] },
            { id: 'midnight', label: 'Meia-Noite', icon: '🌙', colors: ['bg-[#a855f7]', 'bg-[#f472b6]'] },
            { id: 'ocean', label: 'Oceano', icon: '🌊', colors: ['bg-[#0ea5e9]', 'bg-[#8b5cf6]'] },
            { id: 'sunset', label: 'Ocaso', icon: '🌇', colors: ['bg-[#f97316]', 'bg-[#fbbf24]'] },
            { id: 'forest', label: 'Floresta', icon: '🌲', colors: ['bg-[#22c55e]', 'bg-[#84cc16]'] },
            { id: 'glitch', label: 'Matrix', icon: '👾', colors: ['bg-[#00ff41]', 'bg-[#ff003c]'] },
            { id: 'vintage', label: 'Vintage', icon: '📜', colors: ['bg-[#d97706]', 'bg-[#8b5cf6]'] },
            { id: 'nebula', label: 'Nébula', icon: '☄️', colors: ['bg-[#c026d3]', 'bg-[#22d3ee]'] },
            { id: 'noir-violet', label: 'Noir Violet', icon: '🔮', colors: ['bg-[#6d597a]', 'bg-[#161a1d]'] },
            { id: 'sakura-night', label: 'Sakura Night', icon: '🌸', colors: ['bg-[#b5838d]', 'bg-[#2b2d42]'] },
            { id: 'crimson-ash', label: 'Crimson Ash', icon: '👹', colors: ['bg-[#a4161a]', 'bg-[#0b090a]'] },
            { id: 'arctic-night', label: 'Arctic Night', icon: '❄️', colors: ['bg-[#457b9d]', 'bg-[#1d3557]'] },
          ].map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => {
                setTheme(themeOption.id as any);
                toast.success(`Tema ${themeOption.label} aplicado! ✨`);
              }}
              className={`relative overflow-hidden group border-[3px] border-black rounded-2xl p-4 transition-all hover:-translate-y-1 ${
                theme === themeOption.id 
                  ? 'bg-yellow-50 shadow-[4px_4px_0px_0px_#000] ring-4 ring-black/10' 
                  : 'bg-white hover:shadow-[4px_4px_0px_0px_#000]'
              }`}
            >
              <div className="flex flex-col items-center gap-3 relative z-10">
                <span className="text-3xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                  {themeOption.icon}
                </span>
                <span className="font-sans font-black text-[10px] uppercase tracking-widest text-black">
                  {themeOption.label}
                </span>
                <div className="flex gap-1">
                  {themeOption.colors.map((c, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full border-2 border-black ${c}`} />
                  ))}
                </div>
              </div>
              
              {theme === themeOption.id && (
                <div className="absolute top-2 right-2 bg-black rounded-full p-1 border-2 border-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <Check size={8} className="text-white" strokeWidth={5} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. AVATAR FRAMES SELECTION PANEL */}
      <div className="bg-white border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_#1a1a1a]">
        <div className="flex items-center gap-3 border-b-[4px] border-black pb-5 mb-6">
          <div className="w-10 h-10 bg-pink-100 border-[3px] border-black rounded-xl flex items-center justify-center text-pink-600 shadow-[4px_4px_0px_0px_#1a1a1a] -rotate-2 hover:rotate-2 transition-transform">
            <User size={18} strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-black text-base md:text-lg font-black uppercase tracking-tight font-sans">
              Molduras de Avatar
            </h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Destaque sua identidade visual</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {AVATAR_FRAMES.map((frame) => (
            <button
              key={frame.id}
              onClick={() => handleFrameChange(frame.id)}
              className={`relative group border-[3px] border-black rounded-2xl p-4 transition-all hover:-translate-y-1 ${
                profile?.selectedFrame === frame.id 
                  ? 'bg-pink-50 shadow-[4px_4px_0px_0px_#000] ring-4 ring-pink-500/10' 
                  : 'bg-white hover:shadow-[4px_4px_0px_0px_#000]'
              }`}
            >
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div className="relative w-12 h-12">
                   <div className={`w-full h-full rounded-full overflow-hidden border-2 border-black bg-stone-100 ${frame.className}`}>
                      <img 
                        src={currentAvatar} 
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                   </div>
                </div>
                <span className="font-sans font-black text-[9px] uppercase tracking-tighter text-black text-center h-4 flex items-center">
                  {frame.name}
                </span>
                <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-black ${
                  frame.rarity === 'common' ? 'bg-stone-100 text-stone-500' :
                  frame.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                  frame.rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                  'bg-yellow-100 text-yellow-600 shadow-[1px_1px_0px_#000]'
                }`}>
                  {frame.rarity}
                </span>
              </div>
              
              {profile?.selectedFrame === frame.id && (
                <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1 border-2 border-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <Check size={8} className="text-white" strokeWidth={5} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 5. TITLES SELECTION PANEL */}
      <div className="bg-white border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_#1a1a1a]">
        <div className="flex items-center gap-3 border-b-[4px] border-black pb-5 mb-6">
          <div className="w-10 h-10 bg-indigo-100 border-[3px] border-black rounded-xl flex items-center justify-center text-indigo-600 shadow-[4px_4px_0px_0px_#1a1a1a] rotate-1 hover:-rotate-1 transition-transform">
            <Award size={18} strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-black text-base md:text-lg font-black uppercase tracking-tight font-sans">
              Meus Títulos
            </h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Desbloqueie e equipe títulos raros</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TITLES_LIST.map((title) => {
            const isUnlocked = profile?.unlockedTitles?.includes(title.id);
            const isSelected = profile?.selectedTitle === title.id;

            return (
              <button
                key={title.id}
                disabled={!isUnlocked}
                onClick={() => handleTitleChange(title.id)}
                className={`relative group border-[3px] border-black rounded-2xl p-4 transition-all flex flex-col items-center gap-2 ${
                  isSelected 
                    ? 'bg-indigo-50 shadow-[4px_4px_0px_0px_#000] ring-4 ring-indigo-500/10 -translate-y-1' 
                    : isUnlocked 
                      ? 'bg-white hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1' 
                      : 'bg-zinc-100 grayscale opacity-70 cursor-not-allowed'
                }`}
              >
                <span className={`text-sm tracking-tight text-center ${title.className}`}>
                  « {title.name} »
                </span>
                
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border-[1.5px] border-black ${
                    title.rarity === 'common' ? 'bg-stone-200 text-stone-600' :
                    title.rarity === 'rare' ? 'bg-blue-200 text-blue-700' :
                    title.rarity === 'epic' ? 'bg-purple-200 text-purple-700' :
                    title.rarity === 'legendary' ? 'bg-orange-200 text-orange-700 shadow-[1px_1px_0px_#000]' :
                    'bg-rose-200 text-rose-700 shadow-[2px_2px_0px_#000]'
                  }`}>
                    {title.rarity}
                  </span>
                  
                  {!isUnlocked && (
                    <span className="text-[8px] font-black uppercase text-zinc-400">Bloqueado</span>
                  )}
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 bg-indigo-600 rounded-full p-1 border-2 border-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <Check size={8} className="text-white" strokeWidth={5} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
