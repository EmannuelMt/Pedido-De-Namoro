import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Palette, Compass, Music, Shield, Settings, EyeOff, ShieldCheck, Lock, LogOut, Trash2, LifeBuoy, Info, Sparkles, Target, Library, MessageCircle, ArrowRight } from 'lucide-react';
import { AudioSettings } from '../AudioSettings';

export const RomanticMenu = ({ 
  user, userData, THEMES, themeMode, layoutMode, 
  handleThemeChange, handleLayoutChange,
  albums, userLetters, playlist, 
  setThemeFilter, themeFilter, 
  experienceMode, setExperienceMode,
  proposalMode, setProposalMode,
  audioManager, handleLogout, 
  setIsDeleteAccountOpen,
  updateUserSettings, setView
}: any) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'temas' | 'layouts' | 'sons' | 'notificacoes' | 'suporte'>('perfil');
  const [editingName, setEditingName] = useState('');
  const [editingPhoto, setEditingPhoto] = useState('');
  const [editingBio, setEditingBio] = useState('');
  const [isEditingProfileQuick, setIsEditingProfileQuick] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Local state for notification config
  const [notifConfig, setNotifConfig] = useState(() => {
    const saved = localStorage.getItem('notificationConfig');
    return saved ? JSON.parse(saved) : { enabled: true, sound: true, duration: 5000 };
  });

  const updateNotifConfig = async (newConfig: any) => {
    setNotifConfig(newConfig);
    localStorage.setItem('notificationConfig', JSON.stringify(newConfig));
    window.dispatchEvent(new CustomEvent('notificationConfigChanged', { detail: newConfig }));
    if (user && updateUserSettings) {
      await updateUserSettings(user.uid, { notificationConfig: newConfig });
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-8 max-w-7xl mx-auto w-full luxury-glass relative overflow-hidden">
       {user ? (
          <div className="flex flex-col lg:flex-row gap-10 sm:gap-16 min-h-[70vh]">
            {/* Sidebar Navigation */}
            <div className="lg:w-80 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none">
              {[
                { id: 'perfil', label: 'Universo Pessoal', icon: <User size={20} />, desc: 'Identidade & Marcos' },
                { id: 'temas', label: 'Aura do Universo', icon: <Palette size={20} />, desc: 'Personalização Visual' },
                { id: 'layouts', label: 'Arquitetura', icon: <Compass size={20} />, desc: 'Sistema de Layouts' },
                { id: 'sons', label: 'Sintonia Sonora', icon: <Music size={20} />, desc: 'Imersão Auditiva' },
                { id: 'notificacoes', label: 'Notificações', icon: <MessageCircle size={20} />, desc: 'Alertas & Eventos' },
                { id: 'suporte', label: 'Segurança & Suporte', icon: <Shield size={20} />, desc: 'Tech & Proteção' }
              ].map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-5 px-6 py-5 rounded-[2rem] transition-all text-left group whitespace-nowrap lg:whitespace-normal ${
                    activeTab === tab.id 
                      ? 'bg-[var(--primary)] text-[var(--bg)] shadow-2xl shadow-[var(--primary)]/20 scale-[1.02]' 
                      : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text)]'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/5'} transition-colors`}>
                    {tab.icon}
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-bold text-sm leading-none mb-1">{tab.label}</p>
                    <p className={`text-[9px] font-mono uppercase tracking-widest ${activeTab === tab.id ? 'text-[var(--bg)]/60' : 'text-[var(--text-muted)] opacity-40'}`}>
                      {tab.desc}
                    </p>
                  </div>
                </button>
              ))}
              
              <div className="hidden lg:block mt-auto pt-12 px-6 border-t border-white/5">
                 <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Sintonizado v3.0</p>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {activeTab === 'perfil' && (
                  <motion.div
                    key="perfil"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    {/* Profile Identity Card */}
                    <div className="p-10 sm:p-14 luxury-glass rounded-[4rem] border border-white/5 relative overflow-hidden group shadow-3xl">
                      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--primary)]/10 to-transparent pointer-events-none" />
                      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="relative group shrink-0">
                           <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl transition-transform duration-700 group-hover:rotate-3 group-hover:scale-105">
                             <img 
                               src={userData?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                               alt="Avatar" 
                               className="w-full h-full object-cover"
                             />
                           </div>
                           <div className="absolute -bottom-4 -right-4 bg-[var(--primary)] p-4 rounded-2xl shadow-xl">
                              <Sparkles size={18} className="text-[var(--bg)]" />
                           </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                           <h2 className="text-4xl sm:text-6xl font-serif text-[var(--text)] tracking-tighter mb-4 leading-none">
                             {userData?.displayName || user.displayName || 'Explorador'}
                           </h2>
                           <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                              <span className="px-5 py-2 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-full text-[10px] uppercase font-mono tracking-widest text-[var(--primary)]">Sincronizado</span>
                           </div>
                           <p className="text-[var(--text)]/60 font-serif italic text-xl leading-relaxed max-w-xl">
                             {userData?.bio || "Duas órbitas em um só sistema. Explorando o infinito da nossa conexão."}
                           </p>
                        </div>

                        <button 
                          onClick={() => {
                            setEditingName(userData?.displayName || user.displayName || '');
                            setEditingPhoto(userData?.photoURL || user.photoURL || '');
                            setEditingBio(userData?.bio || '');
                            setIsEditingProfileQuick(true);
                          }}
                          className="px-12 py-7 bg-[var(--text)] text-[var(--bg)] rounded-full font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-[var(--primary)] hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-4 group"
                        >
                          Editar Perfil <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                      </div>

                      {isEditingProfileQuick && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 luxury-glass backdrop-blur-2xl p-10 flex flex-col justify-center">
                           <div className="space-y-6 max-w-xl mx-auto w-full">
                              <div className="space-y-4">
                                 <input value={editingName} onChange={(e) => setEditingName(e.target.value)} placeholder="Seu nome" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-[var(--primary)] transition-all font-serif italic text-xl" />
                                 <input value={editingPhoto} onChange={(e) => setEditingPhoto(e.target.value)} placeholder="URL da Foto" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-[var(--primary)] transition-all font-mono text-[10px]" />
                                 <textarea value={editingBio} onChange={(e) => setEditingBio(e.target.value)} placeholder="Sua bio..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-[var(--primary)] transition-all font-serif italic min-h-[100px]" />
                              </div>
                              <div className="flex gap-4">
                                 <button onClick={async () => {
                                   setIsUpdatingProfile(true);
                                   await updateUserSettings(user.uid, { displayName: editingName, photoURL: editingPhoto, bio: editingBio });
                                   setIsUpdatingProfile(false);
                                   setIsEditingProfileQuick(false);
                                 }} className="flex-1 py-5 bg-[var(--primary)] text-[var(--bg)] rounded-xl font-bold text-[10px] uppercase tracking-widest">
                                   {isUpdatingProfile ? 'Salvando...' : 'Salvar Alterações'}
                                 </button>
                                 <button onClick={() => setIsEditingProfileQuick(false)} className="px-8 py-5 bg-white/5 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest border border-white/10">Cancelar</button>
                              </div>
                           </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Dashboard Marcos */}
                    <div className="space-y-10">
                       <div className="flex items-center gap-6 px-4">
                          <Target size={22} className="text-[var(--primary)]" />
                          <h3 className="text-3xl font-serif text-[var(--text)] italic">Dashboard de Marcos</h3>
                          <div className="h-px flex-1 bg-white/10" />
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                          {[
                            { icon: <Library />, label: "Nossos Marcos", value: albums?.length || 0 },
                            { icon: <MessageCircle />, label: "Entradas no Diário", value: userLetters?.length || 0 },
                            { icon: <Music />, label: "Sintonias Sonora", value: playlist?.length || 0 },
                          ].map((stat, i) => (
                            <div key={i} className="luxury-glass p-12 rounded-[4rem] border border-white/5 flex flex-col items-center text-center group hover:border-[var(--primary)]/30 transition-all hover:-translate-y-2">
                               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-all transform group-hover:rotate-12 mb-8 shadow-inner">
                                 {stat.icon}
                               </div>
                               <p className="text-[var(--text-muted)] font-mono text-[9px] uppercase tracking-[0.4em] mb-2">{stat.label}</p>
                               <p className="text-[var(--text)] font-serif text-6xl tracking-tighter">{stat.value}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                  </motion.div>
                )}

                 {activeTab === 'temas' && (
                  <motion.div
                    key="temas"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
 
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                        <div className="flex items-center gap-6">
                           <Palette size={22} className="text-[var(--primary)]" />
                           <h3 className="text-3xl font-serif text-[var(--text)] italic">Aura do Universo</h3>
                        </div>
                        <div className="px-6 py-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full">
                           <p className="text-[var(--primary)] font-mono text-[9px] uppercase tracking-widest">Ativo: {THEMES[themeMode]?.label || 'Aura Padrão'}</p>
                        </div>
                     </div>

                     {/* Theme Filters */}
                     <div className="flex flex-wrap gap-3 pb-2 px-4 scrollbar-none overflow-x-auto">
                       {[
                          {id: 'all', label: 'Todos'}, 
                          {id: 'nature', label: '🌿 Natureza'}, 
                          {id: 'romance', label: '💖 Romance'}, 
                          {id: 'cinema', label: '🎞️ Cinema'}, 
                          {id: 'gamer', label: '🎮 Gamer'},
                          {id: 'dev', label: '💻 Dev'}
                        ].map(filter => (
                         <button
                           key={filter.id}
                           onClick={() => setThemeFilter(filter.id as any)}
                           className={`px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${themeFilter === filter.id ? 'bg-[var(--primary)] text-[var(--bg)] shadow-xl shadow-[var(--primary)]/20 scale-105' : 'bg-white/5 text-[var(--text-muted)] border border-white/5 hover:border-[var(--primary)]/30'}`}
                         >
                           {filter.label}
                         </button>
                       ))}
                     </div>

                     {/* Theme Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 px-4">
                        {(Object.keys(THEMES) as any[]).filter(mode => {
                           if (themeFilter === 'all') return mode !== 'luxury' && mode !== 'glass';
                           return THEMES[mode].category === themeFilter;
                        }).map((mode) => {
                           const theme = THEMES[mode];
                           const isActive = themeMode === mode;
                           return (
                             <button
                               key={mode}
                               onClick={() => handleThemeChange(mode)}
                               className={`relative group p-8 rounded-[3.5rem] border transition-all duration-700 text-left overflow-hidden ${
                                 isActive ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-2xl scale-[1.02]' : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10'
                               }`}
                             >
                               <div className="relative z-10 flex flex-col h-full justify-between gap-10">
                                  <div className="flex items-center justify-between">
                                     <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner" style={{ backgroundColor: `${theme.primary}20` }}>
                                        <Palette size={20} style={{ color: theme.primary }} />
                                     </div>
                                     {isActive && (
                                       <div className="h-3 w-3 rounded-full bg-[var(--primary)] shadow-[0_0_15px_var(--primary)] animate-pulse" />
                                     )}
                                  </div>
                                  <div>
                                     <h4 className="text-[var(--text)] font-serif text-2xl mb-1 group-hover:text-[var(--primary)] transition-colors italic leading-none">{theme.label}</h4>
                                     <p className="text-[var(--text-muted)] text-[8px] font-mono uppercase tracking-[0.3em] opacity-40">Preset Estético {theme.category}</p>
                                  </div>
                               </div>
                             </button>
                           );
                        })}
                     </div>
                 {/* UX Configurations */}
                 <div className="space-y-8 mt-16 px-4">
                   <div className="flex items-center gap-6 mb-4 px-2">
                      <Sparkles size={22} className="text-[var(--primary)]" />
                      <h3 className="text-3xl font-serif text-[var(--text)] italic">Protocolos de Experiência</h3>
                      <div className="h-px flex-1 bg-white/10" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                      {[
                         { label: "Animações Exclusivas", desc: "Efeitos cinematográficos v3.0", active: true },
                         { label: "Estilos de Cards", desc: "Glassmorphism adaptativo profundo", active: true },
                         { label: "Física de Partículas", desc: "Ambiente vivo e responsivo", active: true },
                         { label: "Foco Contemplativo", desc: "Redução de ruído visual periférico", active: false }
                       ].map((cfg, i) => (
                         <div key={i} className="flex items-center justify-between p-8 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/[0.08] transition-all">
                            <div className="text-left space-y-1">
                               <p className="text-white font-bold text-xs uppercase tracking-widest">{cfg.label}</p>
                               <p className="text-[var(--text-muted)] text-[10px] italic opacity-60 leading-tight">{cfg.desc}</p>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${cfg.active ? 'bg-[var(--primary)]' : 'bg-white/10'}`}>
                               <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${cfg.active ? 'left-7' : 'left-1'}`} />
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'layouts' && (
                <motion.div
                  key="layouts"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                      <div className="flex items-center gap-6">
                         <Compass size={22} className="text-[var(--primary)]" />
                         <h3 className="text-3xl font-serif text-[var(--text)] italic">Arquitetura de Layout</h3>
                      </div>
                      <div className="px-6 py-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full">
                         <p className="text-[var(--primary)] font-mono text-[9px] uppercase tracking-widest">Ativo: {layoutMode}</p>
                      </div>
                   </div>
                   <p className="text-[var(--text-muted)] font-mono text-xs uppercase tracking-widest px-4">
                     Defina como o universo é estruturado estruturalmente, independentemente da paleta de cores.
                   </p>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                      {[
                        { id: 'auto', label: 'Automático', desc: 'Vinculado ao tema atual' },
                        { id: 'romantic-center', label: 'Romântico (Central)', desc: 'Tudo centralizado, foco emocional, CTA forte.' },
                        { id: 'timeline-story', label: 'Storytelling', desc: 'Scroll guiado, emoção crescente, contando história.' },
                        { id: 'game-hud', label: 'Gamer HUD', desc: 'Microinterações rápidas, estatísticas, missões.' },
                        { id: 'dev-terminal', label: 'Dev Terminal', desc: 'Fonte monospace, console roots, execução.' },
                        { id: 'cinema-scroll', label: 'Cinema Scroll', desc: 'Scroll horizontal, cards grandes, estilo Netflix.' },
                        { id: 'zen-minimal', label: 'Zen Minimal', desc: 'Leitura confortável, visual sereno.' },
                        { id: 'holographic-ui', label: 'Interface Holográfica', desc: 'Glass, neon, painéis flutuantes estilo Sci-fi.' },
                        { id: 'premium-showcase', label: 'Premium Showcase', desc: 'Elegância, grid estilo revista editorial.' }
                      ].map(layout => (
                         <motion.button
                           key={layout.id}
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={() => handleLayoutChange(layout.id as any)}
                           className={`p-6 rounded-3xl text-left border transition-all ${
                             layoutMode === layout.id
                               ? 'bg-[var(--primary)] text-[var(--bg)] border-transparent shadow-[0_0_30px_var(--primary-glow)] scale-[1.02]'
                               : 'bg-white/5 border-white/10 hover:border-[var(--primary)]/50 text-[var(--text)]'
                           }`}
                         >
                           <div className="flex items-center gap-4 mb-3">
                             <div className={`p-3 rounded-full ${layoutMode === layout.id ? 'bg-[var(--bg)] text-[var(--primary)]' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                                <Compass />
                             </div>
                             <div className="font-bold text-lg">{layout.label}</div>
                           </div>
                           <p className={`text-sm ${layoutMode === layout.id ? 'text-[var(--bg)]/70' : 'text-[var(--text-muted)]'}`}>
                              {layout.desc}
                           </p>
                         </motion.button>
                      ))}
                   </div>

                   <div className="mt-12 p-4">
                     <h4 className="text-xl font-bold mb-4 font-serif italic text-[var(--text)]">Intensidade da Experiência</h4>
                     <div className="flex gap-4 p-2 bg-white/5 rounded-full w-max border border-white/10">
                        {['light', 'immersive', 'cinematic'].map(mode => (
                          <button
                            key={mode}
                            onClick={() => {
                                setExperienceMode(mode as any);
                                localStorage.setItem('experienceMode', mode);
                            }}
                            className={`px-6 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all ${
                              experienceMode === mode ? 'bg-[var(--primary)] text-[var(--bg)] font-bold' : 'text-[var(--text-muted)] hover:text-white'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                     </div>
                   </div>

                   <div className="mt-12 p-4">
                     <h4 className="text-xl font-bold mb-4 font-serif italic text-[var(--text)]">Estilo do Pedido</h4>
                     <div className="flex flex-wrap gap-4">
                        {[
                          { id: 'auto', label: 'Automático' },
                          { id: 'emotional', label: 'Emocional' },
                          { id: 'interactive', label: 'Interativo (Game)' },
                          { id: 'cinematic', label: 'Cinemático' },
                          { id: 'playful', label: 'Terminal / Dev' },
                          { id: 'minimal', label: 'Minimalista' },
                          { id: 'dramatic', label: 'Dramático' }
                        ].map(mode => (
                          <button
                            key={mode.id}
                            onClick={() => {
                                setProposalMode(mode.id as any);
                                localStorage.setItem('proposalMode', mode.id);
                            }}
                            className={`px-6 py-2 rounded-full font-mono text-xs uppercase tracking-widest border transition-all ${
                              proposalMode === mode.id ? 'bg-[var(--primary)] text-[var(--bg)] font-bold border-transparent' : 'bg-white/5 border-white/10 text-[var(--text-muted)] hover:border-[var(--primary)]/50 hover:text-white'
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                     </div>
                   </div>
                </motion.div>
              )}

                {activeTab === 'sons' && (
                  <motion.div
                    key="sons"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                     <div className="flex items-center gap-6 px-4">
                       <Music size={22} className="text-[var(--primary)]" />
                       <h3 className="text-3xl font-serif text-[var(--text)] italic">Sintonia Sonora</h3>
                       <div className="h-px flex-1 bg-white/10" />
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4">
                        <div className="p-12 luxury-glass rounded-[4.5rem] border border-white/5 space-y-12">
                           <div className="space-y-6">
                              <h4 className="text-2xl font-serif text-white italic">Imersão Auditiva</h4>
                              <p className="text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-widest opacity-40">Amplitude e Sintonia de Frequência</p>
                              <AudioSettings />
                           </div>

                           <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-[var(--primary)]/30 transition-all">
                              <div className="flex items-center gap-5">
                                 <div className="p-4 bg-[var(--primary)]/10 rounded-2xl text-[var(--primary)] shadow-lg">
                                   <Music size={20} />
                                 </div>
                                 <div className="text-left">
                                    <p className="text-xs font-bold text-white uppercase tracking-widest leading-none">Sincronia Harmônica</p>
                                    <p className="text-[var(--text-muted)] text-[10px] italic mt-1">Sons adaptativos baseados na Aura</p>
                                 </div>
                              </div>
                              <button 
                                 onClick={() => audioManager.setSettings({ autoSync: !audioManager.getSettings().autoSync })}
                                 className={`w-14 h-7 rounded-full relative transition-all ${audioManager.getSettings().autoSync ? 'bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/30' : 'bg-white/10'}`}
                              >
                                 <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${audioManager.getSettings().autoSync ? 'left-8' : 'left-1'}`} />
                              </button>
                           </div>
                        </div>

                        <div className="p-12 luxury-glass rounded-[4.5rem] border border-white/5 space-y-10">
                           <h4 className="text-2xl font-serif text-white italic">Atmosferas Disponíveis</h4>
                           <div className="grid grid-cols-1 gap-4">
                              {[
                                { id: 'minimalist', label: 'Minimalista' },
                                { id: 'romantic', label: 'Piano Romântico' },
                                { id: 'nature', label: 'Natureza Viva' },
                                { id: 'retro_gamer', label: '8-Bit Nostalgia' },
                                { id: 'sci_fi_tech', label: 'Futurista Sci-Fi' }
                              ].map(preset => (
                                <button 
                                  key={preset.id}
                                  onClick={() => audioManager.setSettings({ theme: preset.id as any })}
                                  className={`p-7 rounded-[2.5rem] border text-left transition-all group ${audioManager.getSettings().theme === preset.id ? 'bg-[var(--primary)] text-[var(--bg)] border-transparent shadow-xl scale-[1.02]' : 'bg-white/[0.03] text-white/40 border-white/5 hover:bg-white/10 hover:text-white'}`}
                                >
                                   <span className="font-bold text-[11px] uppercase tracking-[0.3em] ml-4 transition-all group-hover:ml-6">{preset.label}</span>
                                </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'notificacoes' && (
                  <motion.div
                    key="notificacoes"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                     <div className="flex items-center gap-6 px-4">
                       <MessageCircle size={22} className="text-[var(--primary)]" />
                       <h3 className="text-3xl font-serif text-[var(--text)] italic">Notificações & Eventos</h3>
                       <div className="h-px flex-1 bg-white/10" />
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4">
                        <div className="p-12 luxury-glass rounded-[4.5rem] border border-white/5 space-y-10">
                           <h4 className="text-2xl font-serif text-white italic">Preferências de Alerta</h4>
                           <div className="space-y-4">
                              <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-[var(--primary)]/30 transition-all">
                                 <div className="flex items-center gap-5">
                                    <div className="p-4 bg-[var(--primary)]/10 rounded-2xl text-[var(--primary)] shadow-lg">
                                      <MessageCircle size={20} />
                                    </div>
                                    <div className="text-left">
                                       <p className="text-xs font-bold text-white uppercase tracking-widest leading-none">Exibir Alertas</p>
                                       <p className="text-[var(--text-muted)] text-[10px] italic mt-1">Mostrar notificações na tela</p>
                                    </div>
                                 </div>
                                 <button 
                                    onClick={() => updateNotifConfig({ ...notifConfig, enabled: !notifConfig.enabled })}
                                    className={`w-14 h-7 rounded-full relative transition-all ${notifConfig.enabled ? 'bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/30' : 'bg-white/10'}`}
                                 >
                                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${notifConfig.enabled ? 'left-8' : 'left-1'}`} />
                                 </button>
                              </div>

                              <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-[var(--primary)]/30 transition-all">
                                 <div className="flex items-center gap-5">
                                    <div className="p-4 bg-[var(--primary)]/10 rounded-2xl text-[var(--primary)] shadow-lg">
                                      <Music size={20} />
                                    </div>
                                    <div className="text-left">
                                       <p className="text-xs font-bold text-white uppercase tracking-widest leading-none">Sons de Alerta</p>
                                       <p className="text-[var(--text-muted)] text-[10px] italic mt-1">Tocar efeitos sonoros</p>
                                    </div>
                                 </div>
                                 <button 
                                    onClick={() => updateNotifConfig({ ...notifConfig, sound: !notifConfig.sound })}
                                    className={`w-14 h-7 rounded-full relative transition-all ${notifConfig.sound ? 'bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/30' : 'bg-white/10'}`}
                                 >
                                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${notifConfig.sound ? 'left-8' : 'left-1'}`} />
                                 </button>
                              </div>
                           </div>
                        </div>

                        <div className="p-12 luxury-glass rounded-[4.5rem] border border-white/5 space-y-10">
                           <h4 className="text-2xl font-serif text-white italic">Duração na Tela</h4>
                           <div className="space-y-4">
                              {[
                                { id: 3000, label: '3 Segundos' },
                                { id: 5000, label: '5 Segundos' },
                                { id: 10000, label: '10 Segundos' }
                              ].map(duration => (
                                <button 
                                  key={duration.id}
                                  onClick={() => updateNotifConfig({ ...notifConfig, duration: duration.id })}
                                  className={`w-full p-7 rounded-[2.5rem] border text-left transition-all group ${notifConfig.duration === duration.id ? 'bg-[var(--primary)] text-[var(--bg)] border-transparent shadow-xl scale-[1.02]' : 'bg-white/[0.03] text-white/40 border-white/5 hover:bg-white/10 hover:text-white'}`}
                                >
                                   <span className="font-bold text-[11px] uppercase tracking-[0.3em] ml-4 transition-all group-hover:ml-6">{duration.label}</span>
                                </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'suporte' && (
                  <motion.div
                    key="suporte"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                     <div className="flex items-center gap-6 px-4">
                       <Shield size={22} className="text-[var(--primary)]" />
                       <h3 className="text-3xl font-serif text-[var(--text)] italic">Segurança & Suporte</h3>
                       <div className="h-px flex-1 bg-white/10" />
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4">
                        <div className="space-y-10">
                           <div className="p-12 luxury-glass rounded-[4rem] border border-white/5 space-y-10">
                              <h4 className="text-2xl font-serif text-white italic">Aura Protegida</h4>
                              <div className="space-y-5">
                                 {[
                                   { icon: <Lock size={20} />, label: "Criptografia v3.0", desc: "Segurança de grau militar", active: true },
                                   { icon: <EyeOff size={20} />, label: "Aura Furtiva", desc: "Ocultar trilhas digitais", active: false },
                                   { icon: <ShieldCheck size={20} />, label: "Sessão Confiável", desc: "Monitoramento de integridade", active: true }
                                 ].map((sec, i) => (
                                   <div key={i} className="flex items-center justify-between p-7 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-all">
                                      <div className="flex items-center gap-5 text-left">
                                         <div className="p-3 bg-[var(--primary)]/10 rounded-xl text-[var(--primary)]">{sec.icon}</div>
                                         <div>
                                            <p className="text-xs font-bold text-white uppercase tracking-widest leading-none">{sec.label}</p>
                                            <p className="text-[var(--text-muted)] text-[10px] italic opacity-40 mt-1">{sec.desc}</p>
                                         </div>
                                      </div>
                                      <div className={`w-12 h-6 rounded-full relative transition-all ${sec.active ? 'bg-[var(--primary)] shadow-md' : 'bg-white/10'}`}>
                                         <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${sec.active ? 'left-7' : 'left-1'}`} />
                                      </div>
                                   </div>
                                 ))}
                              </div>
                           </div>

                           <div className="flex flex-col sm:flex-row gap-6">
                             <button 
                               onClick={handleLogout}
                               className="flex-1 py-10 bg-white/5 hover:bg-white/10 text-white rounded-[3rem] border border-white/10 flex items-center justify-center gap-6 font-bold text-[10px] uppercase tracking-[0.6em] transition-all group"
                             >
                                Sair do Portal <LogOut size={18} className="group-hover:translate-x-3 transition-transform" />
                             </button>
                             <button 
                               onClick={() => setIsDeleteAccountOpen(true)}
                               className="p-10 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-[3rem] border border-rose-500/20 transition-all group"
                               title="Auto-Destruição"
                             >
                                <Trash2 size={24} className="group-hover:rotate-12 transition-transform" />
                             </button>
                           </div>
                        </div>

                        <div className="p-12 luxury-glass rounded-[4.5rem] border border-white/5 flex flex-col justify-between">
                           <div className="space-y-8">
                              <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-[var(--primary)] shadow-inner">
                                 <LifeBuoy size={40} />
                              </div>
                              <div className="text-left space-y-4">
                                 <h4 className="text-4xl font-serif text-white italic leading-tight">Suporte à Essência</h4>
                                 <p className="text-[var(--text-muted)] text-[13px] leading-relaxed italic opacity-60">
                                    Se houver alguma instabilidade na sua experiência ou se sentir que a sintonia foi perdida, entre em contato. Este portal é um ecossistema em constante evolução.
                                 </p>
                              </div>
                              <button className="w-full py-6 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 rounded-3xl font-bold text-[10px] uppercase tracking-[0.5em] hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-all shadow-lg active:scale-95">
                                 Sintonizar Suporte
                              </button>
                           </div>
                           
                           <div className="pt-12 border-t border-white/5 flex items-center justify-between">
                              <div className="text-left">
                                 <p className="text-white font-serif text-2xl italic leading-none">Essência v3.0.0</p>
                                 <p className="text-[var(--text-muted)] font-mono text-[9px] uppercase tracking-[0.4em] mt-3 opacity-40">Universo Alpha Stable</p>
                              </div>
                              <div className="flex gap-4">
                                 <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"><Settings size={20} /></button>
                                 <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"><Info size={20} /></button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
     ) : (
         <div className="text-center py-24 min-h-[60vh] flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-10 text-white/20">
              <Lock size={40} />
            </div>
            <h3 className="text-4xl font-serif text-white mb-6 tracking-tighter">Acesso Negado</h3>
            <p className="text-white/40 font-serif italic text-xl mb-12 max-w-md mx-auto">Você precisa estar conectada para acessar esta dimensão privada do nosso amor.</p>
            <button 
              onClick={() => setView('login')}
              className="px-16 py-8 bg-white text-black rounded-[2.5rem] font-bold text-[10px] uppercase tracking-widest shadow-3xl hover:bg-rose-500 hover:text-white transition-all flex items-center gap-4"
            >
              Identificar-se <ArrowRight size={16} />
            </button>
         </div>
      )}
    </div>
  );
};
