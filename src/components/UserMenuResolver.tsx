import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Palette, Music, Settings, LayoutTemplate, 
  Bell, Shield, LogOut, Camera, ArrowLeft, Trash2, Sliders, Activity,
  Globe, CheckCircle2, ChevronRight, UploadCloud, MapPin, Calendar, Mail
} from 'lucide-react';
import { AudioSettings } from './AudioSettings';
import { updateProfile } from 'firebase/auth';

const formatId = (id: string) => id.substring(0, 8).toUpperCase() + '-' + id.substring(8, 12).toUpperCase();

export const UserMenuResolver = (props: any) => {
  const { 
    user, userData, THEMES, themeMode, layoutMode, 
    handleThemeChange, handleLayoutChange,
    updateUserSettings, handleLogout, setView,
    audioManager, experienceMode, setExperienceMode,
    setIsDeleteAccountOpen
  } = props;

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'experience' | 'security' | 'notifications' | 'activity'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [editingBio, setEditingBio] = useState('');
  const [editingPhoto, setEditingPhoto] = useState('');
  const [editingBanner, setEditingBanner] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  // Image File Handling
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const processFile = async (file: File, type: 'photo' | 'banner') => {
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem excede o limite de 2MB. Use uma imagem menor.");
      return;
    }
    
    try {
      if (type === 'photo') setIsUploadingPhoto(true);
      if (type === 'banner') setIsUploadingBanner(true);

      const base64DataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            // Resize to max 800px width/height to fit in Firestore safely
            const MAX_SIZE = type === 'banner' ? 800 : 300;

            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              // Use lower quality for banner to save space
              const dataUrl = canvas.toDataURL('image/jpeg', type === 'banner' ? 0.4 : 0.6);
              resolve(dataUrl);
            } else {
              reject(new Error("Failed to get canvas context"));
            }
          };
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });

      if (type === 'photo') setEditingPhoto(base64DataUrl);
      if (type === 'banner') setEditingBanner(base64DataUrl);
      
      if (!isEditing) {
         await handleQuickSave(type === 'photo' ? { photoURL: base64DataUrl } : { bannerURL: base64DataUrl }, 'Perfil');
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Erro ao processar a imagem.");
    } finally {
      if (type === 'photo') setIsUploadingPhoto(false);
      if (type === 'banner') setIsUploadingBanner(false);
    }
  };

  const handleQuickSave = async (updates: any, sectionName?: string) => {
    if (updateUserSettings) {
      await updateUserSettings(user.uid, updates);
      if (user && (updates.displayName || updates.photoURL)) {
         try {
            await updateProfile(user, {
               displayName: updates.displayName || user.displayName,
               photoURL: updates.photoURL || user.photoURL
            });
         } catch (e) {
            console.error("Auth profile update error:", e);
         }
      }
      showToast(`${sectionName || 'Configuração'} atualizada com sucesso`);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (updateUserSettings) {
        await updateUserSettings(user.uid, { 
          displayName: editingName, 
          bio: editingBio, 
          photoURL: editingPhoto,
          bannerURL: editingBanner
        });
      }
      if (user) {
        await updateProfile(user, {
          displayName: editingName,
          photoURL: editingPhoto || user.photoURL
        });
      }
      setTimeout(() => {
        setIsSaving(false);
        setIsEditing(false);
        if (audioManager) audioManager.playSound('success');
        showToast('Perfil atualizado com sucesso');
      }, 600);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      showToast('Erro ao atualizar perfil');
    }
  };

  const [notifConfig, setNotifConfig] = useState(() => {
    const saved = localStorage.getItem('notificationConfig');
    return saved ? JSON.parse(saved) : { enabled: true, sound: true, email: false };
  });

  useEffect(() => {
    if (audioManager) audioManager.playSound('interaction');
  }, [activeTab, audioManager]);

  const toggleNotif = (key: string) => {
    const newCfg = { ...notifConfig, [key]: !notifConfig[key] };
    setNotifConfig(newCfg);
    localStorage.setItem('notificationConfig', JSON.stringify(newCfg));
    window.dispatchEvent(new CustomEvent('notificationConfigChanged', { detail: newCfg }));
    if (audioManager) audioManager.playSound('click');
    if (updateUserSettings) {
      updateUserSettings(user.uid, { notificationConfig: newCfg });
      showToast('Notificações atualizadas com sucesso');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
         <p>Autenticação Requerida</p>
         <button onClick={() => setView('login')}>Validar Identidade</button>
      </div>
    );
  }

  const displayName = userData?.displayName || user.displayName || 'Usuário Não-Mapeado';
  const displayPhoto = userData?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
  const displayBio = userData?.bio || 'Membro do sistema digital centralizado.';
  const displayBanner = userData?.bannerURL || editingBanner || 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2671&auto=format&fit=crop';
  const joinDate = user.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : '2024';

  return (
    <div className="min-h-screen w-full relative z-50 bg-[#0a0a0a] text-neutral-200 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar Simulation */}
      <header className="w-full bg-[#050505] border-b border-white/5 px-6 py-4 flex justify-between items-center z-50 relative">
        <div className="flex items-center gap-8">
           <button 
             onClick={() => {
               if (audioManager) audioManager.playSound('interaction');
               setView('home');
             }} 
             className="flex items-center gap-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors border border-white/5"
           >
             <ArrowLeft size={16} />
             <span className="text-xs font-semibold uppercase tracking-wider">Voltar ao Início</span>
           </button>
        </div>
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <img src={displayPhoto} alt="" className="w-full h-full object-cover" />
           </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <div className="relative w-full h-[250px] md:h-[350px] bg-neutral-900 overflow-hidden group">
         {(isUploadingBanner || isEditing) && editingBanner ? (
            <img src={editingBanner} alt="Banner Preview" className={`w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 ${isUploadingBanner ? 'opacity-50 grayscale' : 'opacity-80'}`} />
         ) : (
            <img src={displayBanner} alt="Banner" className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" />
         )}
         
         <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
         
         {isUploadingBanner && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20">
             <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3"></div>
             <span className="text-xs font-mono text-indigo-300 uppercase tracking-widest">Processando...</span>
           </div>
         )}
         
         <button 
            disabled={isUploadingBanner}
            onClick={() => bannerInputRef.current?.click()}
            className="absolute top-6 right-6 md:top-8 md:right-8 bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white/80 hover:text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100 shadow-xl disabled:opacity-50"
         >
            <Camera size={16} />
            <span className="hidden sm:inline">Alterar Capa</span>
         </button>
         <input type="file" ref={bannerInputRef} onChange={(e) => { if(e.target.files?.[0]) processFile(e.target.files[0], 'banner') }} accept="image/*" className="hidden" />
      </div>

      {/* Profile Info Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 -mt-20 md:-mt-24 mb-16">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
           
           {/* Avatar Square */}
           <div className="relative group shrink-0">
             <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl overflow-hidden bg-black border-4 border-[#0a0a0a] shadow-2xl relative">
                {(isUploadingPhoto || isEditing) && editingPhoto ? (
                  <img src={editingPhoto} alt="User Preview" className={`w-full h-full object-cover ${isUploadingPhoto ? 'opacity-50 grayscale' : ''}`} />
                ) : (
                  <img src={displayPhoto} alt="User Settings" className="w-full h-full object-cover" />
                )}
                
                {isUploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
                    <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                  </div>
                )}
             </div>
             <button 
                disabled={isUploadingPhoto}
                onClick={() => photoInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-indigo-600 hover:bg-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg border-[3px] border-[#0a0a0a] transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
             >
                <Camera size={18} />
             </button>
             <input type="file" ref={photoInputRef} onChange={(e) => { if(e.target.files?.[0]) processFile(e.target.files[0], 'photo') }} accept="image/*" className="hidden" />
           </div>

           {/* User Meta */}
           <div className="flex-1 text-center md:text-left mb-2 md:mb-6">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2 flex-wrap">
                 <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{displayName}</h1>
                 <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full shrink-0">
                   Administrador Master
                 </span>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-sm text-neutral-400">
                 <div className="flex items-center gap-1.5"><Mail size={14} className="opacity-70"/> {user.email}</div>
                 <div className="flex items-center gap-1.5"><MapPin size={14} className="opacity-70"/> São Paulo, Brasil</div>
                 <div className="flex items-center gap-1.5"><Calendar size={14} className="opacity-70"/> Membro desde {joinDate}</div>
              </div>
           </div>

           {/* Stats Cards */}
           <div className="flex gap-4 mb-2 md:mb-6 shrink-0 w-full sm:w-auto justify-center">
              <div className="bg-[#111] border border-white/5 rounded-2xl p-4 min-w-[110px] text-center shadow-lg">
                 <div className="text-2xl font-bold text-white mb-1">142</div>
                 <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Projetos</div>
              </div>
              <div className="bg-[#111] border border-white/5 rounded-2xl p-4 min-w-[110px] text-center shadow-lg">
                 <div className="text-2xl font-bold text-white mb-1">89%</div>
                 <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Eficiência</div>
              </div>
           </div>

        </div>
      </div>

      {/* Main Content Split */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 pb-32">
         
         {/* LEFT SIDEBAR NAVBAR */}
         <aside className="space-y-8">
            <div>
               <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 pl-3">Pessoal</h3>
               <nav className="space-y-1">
                 <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                    <div className="flex items-center gap-3"><User size={16} /> Geral</div>
                    {activeTab === 'profile' && <ChevronRight size={14} className="opacity-50" />}
                 </button>
                 <button onClick={() => setActiveTab('security')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                    <div className="flex items-center gap-3"><Shield size={16} /> Segurança</div>
                    {activeTab === 'security' && <ChevronRight size={14} className="opacity-50" />}
                 </button>
                 <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'notifications' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                    <div className="flex items-center gap-3"><Bell size={16} /> Notificações</div>
                    {activeTab === 'notifications' && <ChevronRight size={14} className="opacity-50" />}
                 </button>
                 <button onClick={() => setActiveTab('activity')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'activity' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                    <div className="flex items-center gap-3"><Activity size={16} /> Atividade</div>
                    {activeTab === 'activity' && <ChevronRight size={14} className="opacity-50" />}
                 </button>
               </nav>
            </div>

            <div>
               <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 pl-3">Sistemas Vitais</h3>
               <nav className="space-y-1">
                 <button onClick={() => setActiveTab('appearance')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'appearance' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                    <div className="flex items-center gap-3"><Palette size={16} /> Aparência</div>
                    {activeTab === 'appearance' && <ChevronRight size={14} className="opacity-50" />}
                 </button>
                 <button onClick={() => setActiveTab('experience')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'experience' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                    <div className="flex items-center gap-3"><Sliders size={16} /> Configurações Visuais</div>
                    {activeTab === 'experience' && <ChevronRight size={14} className="opacity-50" />}
                 </button>
                 <button onClick={() => { setIsDeleteAccountOpen(true) }} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-neutral-400 hover:text-rose-500 hover:bg-rose-500/5 border border-transparent mt-4">
                    <div className="flex items-center gap-3"><Trash2 size={16} /> Excluir Conta</div>
                 </button>
                 <button onClick={() => handleLogout()} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent">
                    <div className="flex items-center gap-3"><LogOut size={16} /> Sair do Sistema</div>
                 </button>
               </nav>
            </div>
         </aside>

         {/* RIGHT CONTENT AREA */}
         <main className="w-full">
            <AnimatePresence mode="wait">
               <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
               >
                  {/* === GERAL TAB === */}
                  {activeTab === 'profile' && (
                     <div className="space-y-6">
                        {/* Perfil Principal Block */}
                        <div className="bg-[#111] border border-white/5 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 shadow-xl">
                           <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                              <div className="flex items-center gap-3">
                                 <User className="text-indigo-400" size={24} />
                                 <h2 className="text-xl font-bold text-white">Perfil Principal</h2>
                              </div>
                              {!isEditing ? (
                                <button onClick={() => {
                                  setEditingName(displayName);
                                  setEditingBio(displayBio);
                                  setEditingPhoto(displayPhoto);
                                  setEditingBanner(displayBanner);
                                  setIsEditing(true);
                                }} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
                                  Editar Perfil
                                </button>
                              ) : (
                                <div className="flex gap-2">
                                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-transparent text-neutral-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
                                    Cancelar
                                  </button>
                                  <button onClick={handleSaveProfile} disabled={isSaving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
                                    {isSaving ? 'Salvando...' : 'Salvar'}
                                  </button>
                                </div>
                              )}
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                              <div className="space-y-2">
                                 <label className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
                                   <User size={14}/> Nome de Exibição
                                 </label>
                                 {isEditing ? (
                                   <input value={editingName} onChange={e => setEditingName(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors" />
                                 ) : (
                                   <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-white">{displayName}</div>
                                 )}
                              </div>
                              <div className="space-y-2">
                                 <label className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
                                   <Mail size={14}/> E-mail
                                 </label>
                                 <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-neutral-500 cursor-not-allowed">
                                   {user.email}
                                 </div>
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                 <label className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
                                   <User size={14}/> Biografia
                                 </label>
                                 {isEditing ? (
                                   <textarea value={editingBio} onChange={e => setEditingBio(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors min-h-[100px] resize-y" />
                                 ) : (
                                   <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-white min-h-[100px]">{displayBio}</div>
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* Preferências do Sistema */}
                        <div className="bg-[#111] border border-white/5 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 shadow-xl">
                           <div className="mb-8 pb-4 border-b border-white/5">
                              <h2 className="text-xl font-bold text-white mb-2">Preferências Orgânicas</h2>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                 <div>
                                   <h4 className="text-sm font-medium text-white mb-1">Tema do Sistema</h4>
                                   <p className="text-xs text-neutral-500">Escolha entre Claro ou Escuro.</p>
                                 </div>
                                 <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500 text-white">
                                   <option value="escuro">Escuro</option>
                                   <option value="claro">Claro</option>
                                 </select>
                              </div>
                              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                 <div>
                                   <h4 className="text-sm font-medium text-white mb-1">Layout Compacto</h4>
                                   <p className="text-xs text-neutral-500">Reduzir espaçamentos na interface.</p>
                                 </div>
                                 <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-[#0a0a0a]" />
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* === SEGURANÇA TAB === */}
                  {activeTab === 'security' && (
                     <div className="space-y-6">
                        <div className="bg-[#111] border border-white/5 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 shadow-xl">
                           <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                              <Shield className="text-indigo-400" size={24} />
                              <h2 className="text-xl font-bold text-white">Segurança e Acesso</h2>
                           </div>
                           <div className="text-neutral-400 text-sm">
                             Sua conta está integrada via processo seguro de SSO OAuth. As credenciais são gerenciadas diretamente por um fornecedor de identidade autorizado.
                           </div>
                        </div>
                     </div>
                  )}

                  {/* === NOTIFICAÇÕES TAB === */}
                  {activeTab === 'notifications' && (
                     <div className="space-y-6">
                        <div className="bg-[#111] border border-white/5 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 shadow-xl">
                           <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                              <Bell className="text-indigo-400" size={24} />
                              <h2 className="text-xl font-bold text-white">Notificações HUD</h2>
                           </div>

                           <div className="space-y-4">
                             {[
                               { key: 'enabled', title: 'Exibir Pop-ups (HUD)', desc: 'Mostra notificações em tempo real na tela principal.' },
                               { key: 'sound', title: 'Efeitos Sonoros', desc: 'Sons sutis para mensagens, alertas e sucessos.' },
                               { key: 'email', title: 'Avisos por E-mail', desc: 'Receba resumos de notificações quando estiver offline.' }
                             ].map(cfg => (
                               <button 
                                 key={cfg.key}
                                 onClick={() => toggleNotif(cfg.key)} 
                                 className="w-full flex items-center justify-between p-5 bg-[#0a0a0a] hover:bg-white/[0.04] rounded-xl border border-white/5 transition-all text-left group"
                               >
                                 <div>
                                   <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">{cfg.title}</p>
                                   <p className="text-xs text-neutral-500 mt-1">{cfg.desc}</p>
                                 </div>
                                 <div className={`w-10 h-5 shrink-0 rounded-full cursor-pointer relative transition-colors duration-300 ${
                                   notifConfig[cfg.key as keyof typeof notifConfig] 
                                     ? 'bg-indigo-500 text-white' 
                                     : 'bg-white/10'
                                 }`}>
                                   <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                                     notifConfig[cfg.key as keyof typeof notifConfig] 
                                       ? 'left-[22px]' 
                                       : 'left-0.5 opacity-50'
                                   }`} />
                                 </div>
                               </button>
                             ))}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* === ATIVIDADE TAB === */}
                  {activeTab === 'activity' && (
                     <div className="space-y-6">
                        <div className="bg-[#111] border border-white/5 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 shadow-xl">
                           <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                              <Activity className="text-indigo-400" size={24} />
                              <h2 className="text-xl font-bold text-white">Registro de Atividades</h2>
                           </div>
                           <div className="text-neutral-400 text-sm">
                             Última conexão orgânica hoje em: {new Date().toLocaleTimeString('pt-BR')}
                             <br/><br/>
                             Nenhum aviso incomum detectado pelo nosso rastreador vitalício.
                           </div>
                        </div>
                     </div>
                  )}

                  {/* === APARÊNCIA TAB === */}
                  {activeTab === 'appearance' && (
                     <div className="space-y-6">
                        <div className="bg-[#111] border border-white/5 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 shadow-xl">
                           <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                              <Palette className="text-indigo-400" size={24} />
                              <h2 className="text-xl font-bold text-white">Espectro Cromático</h2>
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
                                     if (updateUserSettings) {
                                       updateUserSettings(user.uid, { themeMode: mode });
                                       showToast('Tema atualizado com sucesso');
                                     }
                                     if (audioManager) audioManager.playSound('click');
                                   }}
                                   className={`p-6 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-end min-h-[160px] ${
                                     isActive 
                                       ? 'bg-white/5 border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                                       : 'bg-[#0a0a0a] border border-white/5 hover:border-white/20'
                                   }`}
                                 >
                                   <div className="absolute top-4 left-4 flex gap-2">
                                     <div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: theme.primary }} />
                                     {theme.secondary && (
                                       <div className="w-6 h-6 rounded-full shadow-lg -ml-3 mix-blend-screen" style={{ backgroundColor: theme.secondary || 'black' }} />
                                     )}
                                   </div>
                                   <div className="relative z-10 w-full mt-10">
                                     <h3 className={`text-lg font-bold mb-1 ${isActive ? 'text-white' : 'text-neutral-300'}`}>{theme.label}</h3>
                                     <div className="flex justify-between items-center w-full">
                                       <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">{theme.category}</span>
                                       {isActive && <CheckCircle2 size={14} className="text-indigo-400" />}
                                     </div>
                                   </div>
                                 </button>
                               );
                             })}
                           </div>

                           <div className="mt-12 mb-6 pb-4 border-b border-white/5">
                             <h2 className="text-xl font-bold text-white">Engenharia Espacial</h2>
                           </div>
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                             {[
                               { id: 'romantic-center', label: 'Eixo Clássico', desc: 'Centralização absoluta.' },
                               { id: 'timeline-story', label: 'Artéria Narrativa', desc: 'Scroll contínuo.' },
                               { id: 'game-hud', label: 'HUD Modular', desc: 'Display tático agressivo.' },
                               { id: 'zen-minimal', label: 'Vácuo Estético', desc: 'Subtração severa.' }
                             ].map((layout, idx) => {
                               const isActive = layoutMode === layout.id;
                               return (
                                 <button
                                   key={layout.id}
                                   onClick={() => {
                                     handleLayoutChange(layout.id as any);
                                     if (updateUserSettings) {
                                       updateUserSettings(user.uid, { layoutMode: layout.id });
                                       showToast('Layout atualizado com sucesso');
                                     }
                                     if (audioManager) audioManager.playSound('click');
                                   }}
                                   className={`p-5 rounded-2xl transition-all border text-left flex justify-between items-center ${
                                     isActive 
                                       ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' 
                                       : 'bg-[#0a0a0a] border-white/5 hover:border-white/20 text-neutral-300'
                                   }`}
                                 >
                                    <div>
                                       <h4 className="text-base font-bold mb-1">{layout.label}</h4>
                                       <p className="text-xs text-neutral-500 font-medium">{layout.desc}</p>
                                    </div>
                                    {isActive && <CheckCircle2 size={16} />}
                                 </button>
                               );
                             })}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* === EXPERIÊNCIA/SOUND TAB === */}
                  {activeTab === 'experience' && (
                     <div className="space-y-6">
                        <div className="bg-[#111] border border-white/5 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 shadow-xl">
                           <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                              <Music className="text-indigo-400" size={24} />
                              <h2 className="text-xl font-bold text-white">Motor Acústico</h2>
                           </div>
                           <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/5">
                             <AudioSettings />
                           </div>

                           <div className="mt-12 mb-6 pb-4 border-b border-white/5">
                             <h2 className="text-xl font-bold text-white">Renderização</h2>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { id: 'light', label: 'Econômico', desc: 'Máximo FPS e culling agressivo.' },
                                { id: 'immersive', label: 'Equilíbrio', desc: 'Visual estável com luz passiva.' },
                                { id: 'cinematic', label: 'Overclock', desc: 'Renderização brutal e fluida.' }
                              ].map(mode => {
                                const isActive = experienceMode === mode.id;
                                return (
                                  <button 
                                    key={mode.id}
                                    onClick={() => {
                                      setExperienceMode(mode.id);
                                      localStorage.setItem('experienceMode', mode.id);
                                      if (updateUserSettings) {
                                        updateUserSettings(user.uid, { experienceMode: mode.id });
                                        showToast('Renderização atualizada com sucesso');
                                      }
                                      if (audioManager) audioManager.playSound('click');
                                    }}
                                    className={`p-5 rounded-2xl transition-all border text-left ${
                                      isActive 
                                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                                        : 'bg-[#0a0a0a] border-white/5 hover:border-white/20 text-neutral-300'
                                    }`}
                                  >
                                    <h4 className="text-sm font-bold mb-2">{mode.label}</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed font-medium">{mode.desc}</p>
                                  </button>
                                );
                              })}
                           </div>
                        </div>
                     </div>
                  )}
               </motion.div>
            </AnimatePresence>
         </main>

      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-[#111] border border-indigo-500/30 shadow-[0_10px_40px_rgba(99,102,241,0.15)] rounded-full px-6 py-3 flex items-center gap-3 backdrop-blur-md"
          >
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-sm font-medium text-white">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
