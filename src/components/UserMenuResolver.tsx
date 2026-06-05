import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  User, Palette, Music, Settings, LayoutTemplate, 
  Bell, Shield, LogOut, Sparkles, ChevronRight,
  Camera, ArrowLeft, Trash2, Sliders, Activity,
  Hexagon, Lock, Fingerprint, Zap, Globe, CheckCircle2,
  Volume2, Maximize, Cpu, Wifi, Eye, UploadCloud
} from 'lucide-react';
import { AudioSettings } from './AudioSettings';

const formatId = (id: string) => id.substring(0, 8).toUpperCase() + '-' + id.substring(8, 12).toUpperCase();

export const UserMenuResolver = (props: any) => {
  const { 
    user, userData, THEMES, themeMode, layoutMode, 
    handleThemeChange, handleLayoutChange,
    updateUserSettings, handleLogout, setView,
    audioManager, experienceMode, setExperienceMode,
    setIsDeleteAccountOpen
  } = props;

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'experience' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [editingBio, setEditingBio] = useState('');
  const [editingPhoto, setEditingPhoto] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Image File Handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem excede o limite de 5MB para otimização do núcleo.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isEditing) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isEditing && e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const [notifConfig, setNotifConfig] = useState(() => {
    const saved = localStorage.getItem('notificationConfig');
    return saved ? JSON.parse(saved) : { enabled: true, sound: true, email: false };
  });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (audioManager) audioManager.playSound('interaction');
  }, [activeTab, audioManager]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({ 
      x: (clientX / innerWidth) - 0.5, 
      y: (clientY / innerHeight) - 0.5 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black text-white relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="text-center space-y-6 relative z-10 w-full max-w-md p-10 border border-white/10 rounded-3xl backdrop-blur-md bg-white/5">
          <Shield size={48} className="mx-auto text-white/30" />
          <div>
            <h2 className="text-3xl font-serif tracking-tight mb-2">Acesso Negado</h2>
            <p className="text-white/50 text-sm font-mono uppercase tracking-widest">Autenticação Requerida</p>
          </div>
          <button 
            onClick={() => setView('login')}
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-neutral-200 transition-all"
          >
            Validar Identidade
          </button>
          <button onClick={() => setView('home')} className="mt-4 text-white/30 hover:text-white text-[10px] uppercase font-mono tracking-widest transition-colors w-full py-4">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'profile', label: 'Matriz Pessoal', icon: User, num: '01', desc: 'Identidade e Biografia' },
    { id: 'appearance', label: 'Estética', icon: Palette, num: '02', desc: 'Sintaxe Visual e Temas' },
    { id: 'experience', label: 'Simbio-Motor', icon: Sliders, num: '03', desc: 'Áudio e Desempenho' },
    { id: 'security', label: 'Protocolos', icon: Shield, num: '04', desc: 'Segurança e Expurgo' }
  ] as const;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    if (updateUserSettings) {
      await updateUserSettings(user.uid, { 
        displayName: editingName, 
        bio: editingBio, 
        photoURL: editingPhoto 
      });
    }
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      if (audioManager) audioManager.playSound('success');
    }, 600);
  };

  const toggleNotif = (key: string) => {
    const newCfg = { ...notifConfig, [key]: !notifConfig[key] };
    setNotifConfig(newCfg);
    localStorage.setItem('notificationConfig', JSON.stringify(newCfg));
    window.dispatchEvent(new CustomEvent('notificationConfigChanged', { detail: newCfg }));
    if (audioManager) audioManager.playSound('click');
  };

  const displayName = userData?.displayName || user.displayName || 'Usuário Não-Mapeado';
  const displayPhoto = userData?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
  const displayBio = userData?.bio || 'Sem manifestação orgânica nos registros. Uma entidade silenciosa flutuando pelo espaço digital.';

  return (
    <div 
      className="min-h-screen bg-black text-neutral-200 font-sans relative overflow-x-hidden selection:bg-[var(--primary)] selection:text-white"
      onMouseMove={handleMouseMove}
    >
      {/* --- CINEMATIC BACKGROUND IMMERSION --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] contrast-150 mix-blend-overlay z-20" />
        {/* Massive background typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center opacity-[0.02] z-0 select-none">
          <span className="font-serif italic text-[30vw] whitespace-nowrap leading-none text-white blur-[2px]">NEXUS</span>
        </div>
        {/* Dynamic gradient orbs responding to mouse */}
        <motion.div 
          animate={{ x: mousePos.x * -100, y: mousePos.y * -100 }}
          transition={{ type: "spring", stiffness: 20, damping: 30 }}
          className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[var(--primary)] opacity-[0.05] blur-[100px] z-10" 
        />
        <motion.div 
          animate={{ x: mousePos.x * 100, y: mousePos.y * 100 }}
          transition={{ type: "spring", stiffness: 15, damping: 40 }}
          className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-white opacity-[0.03] blur-[120px] z-10" 
        />
        {/* Grid floor */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_top,black,transparent)] z-10 [transform:rotateX(60deg)_scale(2)] origin-bottom pointer-events-none opacity-30" />
      </div>

      {/* --- TOP HUD --- */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-start pointer-events-none mix-blend-difference">
        <button 
          onClick={() => {
            if (audioManager) audioManager.playSound('interaction');
            setView('home');
          }} 
          className="flex flex-col gap-1 items-start pointer-events-auto group"
        >
          <div className="flex items-center gap-2 text-white opacity-60 group-hover:opacity-100 transition-opacity">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-500 cubic-bezier(0.23,1,0.32,1)" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Encerrar Modos de Sistema</span>
          </div>
          <div className="w-0 h-px bg-white group-hover:w-full transition-all duration-700 cubic-bezier(0.23,1,0.32,1)" />
        </button>

        <div className="flex flex-col items-end gap-1 text-right  pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50">Core: Online</span>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </div>
          <span className="text-[8px] font-mono tracking-widest text-[var(--primary)]">{new Date().toISOString().split('T')[0]}</span>
        </div>
      </header>

      {/* --- MAIN ARCHITECTURE --- */}
      <div className="relative z-10 min-h-screen flex flex-col md:flex-row w-full selection:bg-white/20">
        
        {/* LEFT COLUMN: NAVIGATION BINDER */}
        <nav className="w-full md:w-[400px] shrink-0 md:h-screen md:sticky md:top-0 border-r border-white-[0.02] flex flex-col pt-32 px-8 pb-12">
          
          <div className="mb-20">
            <h1 className="text-6xl font-serif italic text-white leading-none tracking-tighter mix-blend-difference">
              O<br/>Sintético
            </h1>
            <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 border-l border-[var(--primary)] pl-4">
              Interface Pessoal<br/>UID: {user.uid.substring(0,6)}
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full relative">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="group relative flex items-start text-left w-full focus:outline-none"
                >
                  <div className={`mr-6 font-mono text-[10px] mt-1 transition-all duration-500 ${isActive ? 'text-[var(--primary)] opacity-100' : 'text-white/20 group-hover:text-white/50'}`}>
                    {tab.num}
                  </div>
                  
                  <div className="flex-1 relative">
                    <h3 className={`text-2xl transition-all duration-500 font-light tracking-tight mb-2 ${isActive ? 'text-white translate-x-2' : 'text-white/40 group-hover:text-white/80 group-hover:translate-x-1'}`}>
                      {tab.label}
                    </h3>
                    <p className={`text-[10px] font-mono uppercase tracking-widest transition-all duration-500 ${isActive ? 'text-white/60 opacity-100 translate-x-2' : 'text-[var(--primary)]/0 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:text-[var(--primary)]/50 group-hover:translate-x-1'}`}>
                      {tab.desc}
                    </p>
                    
                    {/* Active Line Indicator */}
                    <div className={`absolute -left-6 top-1/2 -translate-y-1/2 w-0.5 bg-white transition-all duration-500 ${isActive ? 'h-8 opacity-100' : 'h-0 opacity-0 group-hover:h-4 group-hover:opacity-30'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-12 flex justify-between items-end opacity-30 mix-blend-difference pointer-events-none">
             <Hexagon size={40} strokeWidth={1} />
             <div className="text-right">
               <span className="block text-[8px] font-mono uppercase tracking-[0.5em]">System Build</span>
               <span className="block text-[8px] font-mono tracking-widest font-bold">V-4.0.99</span>
             </div>
          </div>
        </nav>

        {/* RIGHT COLUMN: CONTENT CANVAS */}
        <main className="flex-1 min-w-0 md:h-screen md:overflow-y-auto custom-scrollbar p-6 md:p-16 lg:p-24 relative scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -40, filter: 'blur(10px)', transition: { duration: 0.2 } }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto pb-32"
            >
              
              {/* === PROFILE TAB === */}
              {activeTab === 'profile' && (
                <div className="space-y-16">
                  
                  {/* Identity Header */}
                  <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="relative group perspective-1000 shrink-0">
                      <motion.div 
                        style={{ rotateY: mousePos.x * -30, rotateX: mousePos.y * 30 }}
                        className={`w-48 h-64 md:w-64 md:h-80 rounded-[2rem] overflow-hidden bg-[#111] border transition-all duration-300 relative transform-style-3d object-cover ${
                          isDragging ? 'border-[var(--primary)] shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)] scale-105' : 'border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]'
                        } ${isEditing ? 'cursor-pointer hover:border-[var(--primary)] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)]' : ''}`}
                        onClick={() => { if(isEditing) fileInputRef.current?.click(); }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                         <img src={isEditing && editingPhoto ? editingPhoto : displayPhoto} alt="User" className={`w-full h-full object-cover filter transition-all duration-500 mix-blend-luminosity ${isEditing ? 'saturate-100 contrast-100 opacity-100' : 'contrast-125 saturate-50 opacity-80'}`} />
                         
                         {/* Upload Overlay while editing */}
                         <AnimatePresence>
                           {isEditing && (
                             <motion.div 
                               inherit={false}
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               exit={{ opacity: 0 }}
                               className={`absolute inset-0 flex flex-col items-center justify-center p-6 gap-3 backdrop-blur-sm z-30 transition-all ${isDragging ? 'bg-[var(--primary)]/20' : 'bg-black/60 hover:bg-black/40'}`}
                             >
                               <UploadCloud size={32} className={`transition-all ${isDragging ? 'text-[var(--primary)] animate-bounce scale-125' : 'text-white/80 scale-100'}`} />
                               <span className="text-[9px] text-center font-mono uppercase tracking-[0.2em] text-white/90">
                                 {isDragging ? 'Processar Input' : 'Substituir Sinal (Local)'}
                               </span>
                             </motion.div>
                           )}
                         </AnimatePresence>

                         {/* Scanline */}
                         <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
                         <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
                         
                         {!isEditing && (
                           <div className="absolute bottom-6 left-6 right-6 z-20">
                             <div className="text-[8px] font-mono uppercase tracking-[0.3em] text-[var(--primary)] mb-1">Status Vital</div>
                             <div className="h-px w-full bg-white/20 relative overflow-hidden">
                               <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="absolute top-0 left-0 w-1/3 h-full bg-[var(--primary)]" />
                             </div>
                           </div>
                         )}
                      </motion.div>
                      
                      {!isEditing && (
                        <button 
                          onClick={() => {
                            setEditingName(displayName);
                            setEditingBio(displayBio);
                            setEditingPhoto(displayPhoto);
                            setIsEditing(true);
                          }}
                          className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                        >
                          <Settings size={16} />
                        </button>
                      )}
                    </div>

                    <div className="flex-1 pt-4">
                      {!isEditing ? (
                        <>
                          <div className="flex items-center gap-3 mb-4 opacity-50">
                            <Fingerprint size={16} className="text-[var(--primary)]" />
                            <span className="text-[10px] font-mono tracking-[0.4em] uppercase">Registro Ativo</span>
                          </div>
                          <h2 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter leading-none mb-6">
                            {displayName}
                          </h2>
                          <p className="text-white/40 font-mono text-xs uppercase tracking-widest break-all mb-12">
                            {user.email} <span className="opacity-50">/// {user.uid}</span>
                          </p>

                          <div className="mt-12 group/bio relative">
                            <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--primary)]/50 to-transparent" />
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-6">Manifesto Orgânico</h4>
                            <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed max-w-2xl">
                              "{displayBio}"
                            </p>
                          </div>
                        </>
                      ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-12 backdrop-blur-md">
                          <h3 className="text-2xl font-serif italic mb-8 border-b border-white/10 pb-4">Reconstrução Pessoal</h3>
                          
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50 block">Designação (Nome)</label>
                              <input 
                                value={editingName} 
                                onChange={(e) => setEditingName(e.target.value)} 
                                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-2xl text-white focus:border-[var(--primary)] outline-none transition-all placeholder:text-white/20 font-light" 
                                placeholder="Seu nome..."
                              />
                            </div>
                            
                            <div className="space-y-3">
                              <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50 block">Assinatura Visual (URL Ou Local)</label>
                              <div className="flex gap-4 items-center">
                                <input 
                                  value={editingPhoto} 
                                  onChange={(e) => setEditingPhoto(e.target.value)} 
                                  className="flex-1 bg-transparent border-b border-white/20 px-0 py-3 text-sm text-white/80 font-mono focus:border-[var(--primary)] outline-none transition-all placeholder:text-white/20" 
                                  placeholder="https://... ou faça upload"
                                />
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="shrink-0 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/10 text-[10px] font-mono uppercase tracking-widest transition-all flex items-center gap-2 text-white shadow-lg"
                                >
                                  <UploadCloud size={14} /> Local
                                </button>
                                <input 
                                  type="file" 
                                  ref={fileInputRef} 
                                  onChange={handleFileSelect} 
                                  accept="image/*" 
                                  className="hidden" 
                                />
                              </div>
                            </div>

                            <div className="space-y-3 pt-4">
                              <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50 block">Manifesto Orgânico (Biografia)</label>
                              <textarea 
                                value={editingBio} 
                                onChange={(e) => setEditingBio(e.target.value)} 
                                className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-5 text-white/80 focus:border-[var(--primary)] outline-none transition-all min-h-[160px] resize-y text-lg font-light leading-relaxed scrollbar-hide" 
                              />
                            </div>

                            <div className="flex flex-wrap gap-4 pt-6">
                              <button onClick={handleSaveProfile} disabled={isSaving} className="px-10 py-5 bg-white text-black rounded-full text-[10px] font-mono uppercase tracking-widest font-bold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                                {isSaving ? <LoaderSpinner /> : <>Aplicar Simetria <Settings size={12} /></>}
                              </button>
                              <button onClick={() => setIsEditing(false)} disabled={isSaving} className="px-10 py-5 bg-transparent border border-white/20 hover:border-white text-white rounded-full text-[10px] font-mono uppercase tracking-widest font-bold transition-all">
                                Abortar
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Blocks */}
                  {!isEditing && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                      {[
                        { title: 'Conexão', value: 'Estável', icon: Wifi, color: 'text-green-500' },
                        { title: 'Privilégios', value: 'Criador', icon: Shield, color: 'text-white' },
                        { title: 'Frequência', value: '432 Hz', icon: Activity, color: 'text-[var(--primary)]' },
                        { title: 'Módulos', value: 'Ativos', icon: Cpu, color: 'text-blue-500' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col justify-between aspect-square group hover:bg-white/[0.05] transition-colors relative overflow-hidden">
                          <stat.icon size={20} className={`${stat.color} opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
                          <div>
                            <p className="text-[20px] text-white font-light mb-1">{stat.value}</p>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-white/30">{stat.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* === APPEARANCE TAB === */}
              {activeTab === 'appearance' && (
                <div className="space-y-24">
                  
                  {/* Themes Gallery - Spatial Layout */}
                  <div className="relative">
                    <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-8">
                       <div>
                         <h2 className="text-4xl font-serif italic text-white mb-2">Espectro Cromático</h2>
                         <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Modulação de Identidade Visual</p>
                       </div>
                       <Palette size={32} className="text-[var(--primary)] opacity-50" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(Object.keys(THEMES) as any[]).map((mode) => {
                        const theme = THEMES[mode];
                        const isActive = themeMode === mode;
                        return (
                          <button
                            key={mode}
                            onClick={() => {
                              handleThemeChange(mode);
                              if (audioManager) audioManager.playSound('click');
                            }}
                            className={`group h-64 p-8 rounded-[2rem] text-left transition-all duration-700 relative overflow-hidden flex flex-col justify-end ${
                              isActive 
                                ? 'bg-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20' 
                                : 'bg-black border border-white/5 hover:border-white/20'
                            }`}
                          >
                            {/* Abstract gradient art for each theme */}
                            <div className="absolute inset-0 opacity-[0.15] group-hover:opacity-30 transition-opacity duration-1000"
                                 style={{
                                   background: `linear-gradient(135deg, ${theme.primary} 0%, transparent 100%), radial-gradient(circle at top right, ${theme.secondary || 'white'} 0%, transparent 60%)`
                                 }}
                            />
                            
                            {isActive && (
                              <div className="absolute inset-0 border-2 border-[var(--primary)]/30 rounded-[2rem] shadow-[inset_0_0_20px_rgba(var(--primary-rgb),0.2)]" />
                            )}

                            <div className="absolute top-8 left-8 flex gap-2">
                              <div className="w-8 h-8 rounded-full shadow-2xl" style={{ backgroundColor: theme.primary }} />
                              {theme.secondary && (
                                <div className="w-8 h-8 rounded-full shadow-2xl -ml-4 mix-blend-screen" style={{ backgroundColor: theme.secondary || 'black' }} />
                              )}
                            </div>
                            
                            <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                              <h3 className={`text-2xl font-light tracking-tight mb-2 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{theme.label}</h3>
                              <div className="flex justify-between items-center w-full">
                                <span className={`text-[9px] font-mono uppercase tracking-[0.2em] ${isActive ? 'text-[var(--primary)]' : 'text-white/30'}`}>{theme.category}</span>
                                {isActive && <CheckCircle2 size={16} className="text-white" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Layout Structures */}
                  <div>
                    <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-8">
                       <div>
                         <h2 className="text-4xl font-serif italic text-white mb-2">Engenharia Espacial</h2>
                         <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Arquitetura de Navegação Subjacente</p>
                       </div>
                       <LayoutTemplate size={32} className="text-white opacity-30" />
                    </div>

                    <div className="flex flex-col gap-6">
                      {[
                        { id: 'romantic-center', label: 'Eixo Clássico', desc: 'Centralização absoluta. Estabilidade e clareza. Foco direto na manifestação do conteúdo.' },
                        { id: 'timeline-story', label: 'Artéria Narrativa', desc: 'Scroll contínuo. Conecta os módulos em um cordão umbilical vertical imersivo.' },
                        { id: 'game-hud', label: 'HUD Modular', desc: 'Display tático agressivo. Multitarefa visual com alta densidade paramétrica.' },
                        { id: 'zen-minimal', label: 'Vácuo Estético', desc: 'Subtração severa. Ausência cria presença. Recomendado para concentração extrema.' }
                      ].map((layout, idx) => {
                        const isActive = layoutMode === layout.id;
                        return (
                          <button
                            key={layout.id}
                            onClick={() => {
                              handleLayoutChange(layout.id as any);
                              if (audioManager) audioManager.playSound('click');
                            }}
                            className={`group flex flex-col md:flex-row items-start md:items-center p-8 md:p-12 rounded-[2rem] transition-all duration-700 relative overflow-hidden border ${
                              isActive 
                                ? 'bg-white text-black border-white' 
                                : 'bg-transparent border-white/10 hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="flex-1 pr-12 relative z-10 text-left">
                              <h4 className={`text-3xl font-light tracking-tight mb-4 ${isActive ? 'text-black' : 'text-white'}`}>{layout.label}</h4>
                              <p className={`text-sm md:text-base font-light leading-relaxed max-w-xl ${isActive ? 'text-black/70' : 'text-white/40'}`}>
                                {layout.desc}
                              </p>
                            </div>
                            
                            <div className={`mt-8 md:mt-0 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity ${isActive ? 'text-black opacity-100' : 'text-[var(--primary)]'}`}>
                              <span className="font-mono text-6xl font-light">0{idx+1}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* === SENSORY / EXPERIENCE TAB === */}
              {activeTab === 'experience' && (
                <div className="space-y-24">
                  
                  {/* Audio Engine */}
                  <div>
                    <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-8">
                       <div>
                         <h2 className="text-4xl font-serif italic text-white mb-2">Motor Acústico</h2>
                         <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Modulação de Ondas e Frequências</p>
                       </div>
                       <Music size={32} className="text-white opacity-30" />
                    </div>

                    <div className="bg-black border border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--primary)]/10 to-transparent pointer-events-none" />
                      <div className="relative z-10">
                        <AudioSettings />
                      </div>
                    </div>
                  </div>

                  {/* GPU Compute */}
                  <div>
                    <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-8">
                       <div>
                         <h2 className="text-4xl font-serif italic text-white mb-2">Física Quantizada</h2>
                         <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Limites de Renderização GPU</p>
                       </div>
                       <Activity size={32} className="text-[var(--primary)] opacity-50" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {[
                         { id: 'light', label: 'Econômico', desc: 'Máximo FPS. Culling agressivo de efeitos e partículas desativadas.' },
                         { id: 'immersive', label: 'Equilíbrio', desc: 'Motor visual estável com efeitos de iluminação passiva ativos.' },
                         { id: 'cinematic', label: 'Overclock', desc: 'Renderização brutal. Blur de alta fidelidade e fluidos ativados.' }
                       ].map(mode => {
                         const isActive = experienceMode === mode.id;
                         return (
                           <button 
                             key={mode.id}
                             onClick={() => {
                               setExperienceMode(mode.id);
                               localStorage.setItem('experienceMode', mode.id);
                               if (audioManager) audioManager.playSound('click');
                             }}
                             className={`group flex flex-col p-8 rounded-[2rem] border transition-all duration-500 h-[280px] justify-between relative overflow-hidden ${
                               isActive 
                                 ? 'bg-[var(--primary)]/5 border-[var(--primary)]/50' 
                                 : 'bg-white/[0.01] border-white/10 hover:border-white/30'
                             }`}
                           >
                             {isActive && (
                               <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[var(--primary)]/20 to-transparent pointer-events-none" />
                             )}
                             <div className="relative z-10 text-left">
                               <p className={`text-2xl font-light mb-4 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>{mode.label}</p>
                               <p className={`text-sm leading-relaxed ${isActive ? 'text-white/80' : 'text-white/30 group-hover:text-white/60'}`}>{mode.desc}</p>
                             </div>
                             <div className="flex justify-between items-end w-full relative z-10">
                               <span className="text-[10px] font-mono tracking-widest uppercase text-white/20">Modo de Vídeo</span>
                               <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${isActive ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-white/10'}`}>
                                 {isActive ? <Maximize size={16} className="text-[var(--primary)]" /> : <Settings size={16} className="text-white/30" />}
                               </div>
                             </div>
                           </button>
                         );
                       })}
                    </div>
                  </div>

                </div>
              )}

              {/* === SECURITY / PROTOCOLS TAB === */}
              {activeTab === 'security' && (
                <div className="space-y-24">
                  
                  {/* Notifications Settings */}
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                       <div className="p-3 bg-white/5 rounded-full border border-white/10 text-[var(--primary)]">
                         <Bell size={24} />
                       </div>
                       <div>
                         <h2 className="text-2xl font-light text-white tracking-tight">Notificações</h2>
                         <p className="text-sm text-white/50 mt-1 font-light">Gerencie suas preferências de alertas e comunicação</p>
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { key: 'enabled', title: 'Exibir Pop-ups (HUD)', desc: 'Mostra notificações em tempo real na tela principal.' },
                        { key: 'sound', title: 'Efeitos Sonoros', desc: 'Sons sutis para mensagens, alertas e sucessos.' },
                        { key: 'email', title: 'Avisos por E-mail', desc: 'Receba resumos de notificações quando estiver offline.' }
                      ].map(cfg => (
                        <button 
                          key={cfg.key}
                          onClick={() => toggleNotif(cfg.key)} 
                          className="w-full flex items-center justify-between p-5 md:p-6 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 transition-all text-left group"
                        >
                          <div>
                            <p className="text-base text-white/90 group-hover:text-white transition-colors">{cfg.title}</p>
                            <p className="text-xs text-white/40 mt-1 font-light">{cfg.desc}</p>
                          </div>
                          
                          <div className={`w-12 h-6 shrink-0 rounded-full cursor-pointer relative transition-colors duration-300 ${
                            notifConfig[cfg.key as keyof typeof notifConfig] 
                              ? 'bg-[var(--primary)] text-white' 
                              : 'bg-white/10'
                          }`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                              notifConfig[cfg.key as keyof typeof notifConfig] 
                                ? 'left-7' 
                                : 'left-1 opacity-50'
                            }`} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Destructive Actions */}
                  <div>
                    <div className="flex items-end justify-between mb-12 border-b border-rose-500/20 pb-8">
                       <div>
                         <h2 className="text-4xl font-serif italic text-rose-500 mb-2">Zona Crítica</h2>
                         <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Protocolos de Encerramento Opressivos</p>
                       </div>
                       <Shield size={32} className="text-rose-500 opacity-50" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button 
                        onClick={() => {
                          if (audioManager) audioManager.playSound('interaction');
                          handleLogout();
                        }}
                        className="flex flex-col justify-between p-10 h-[280px] bg-black hover:bg-[#111] rounded-[2.5rem] border border-white/10 hover:border-white/30 transition-all text-white group/btn"
                      >
                        <LogOut size={32} className="text-white/30 group-hover/btn:text-white transition-colors" />
                        <div className="text-left">
                           <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">Hibernação Voluntária</span>
                           <span className="text-2xl font-light tracking-tight block">Desconectar Acesso</span>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => setIsDeleteAccountOpen(true)}
                        className="flex flex-col justify-between p-10 h-[280px] bg-rose-500/5 hover:bg-rose-500/10 rounded-[2.5rem] border border-rose-500/20 hover:border-rose-500/40 transition-all text-rose-500 group/btn"
                      >
                        <Trash2 size={32} className="opacity-50 group-hover/btn:opacity-100 group-hover/btn:-rotate-12 transition-all" />
                        <div className="text-left">
                           <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-rose-500/40 mb-3">Destruição Atômica</span>
                           <span className="text-2xl font-light tracking-tight block">Expurgar Registro Digital</span>
                        </div>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

function LoaderSpinner() {
  return (
    <div className="w-4 h-4 border-[1.5px] border-black/20 border-t-black rounded-full animate-spin" />
  );
}
