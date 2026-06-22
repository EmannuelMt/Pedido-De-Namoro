import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuthStore } from '../../store/auth';
import toast from 'react-hot-toast';
import { LoadingScreen } from '../../components/LoadingScreen';
import { AVATAR_FRAMES } from '../../data/frames';
import { TITLES_LIST } from '../../data/titles';

import { 
  User, 
  Shield, 
  Bell, 
  History, 
  HelpCircle,
  CreditCard,
  Building,
  LogOut,
  ChevronRight,
  Menu,
  X,
  MapPin,
  Calendar,
  Camera,
  ArrowLeft,
  Heart,
  LayoutDashboard,
  Coins,
  Mail,
  Zap,
  Gift,
  Award
} from 'lucide-react';

// Import our actual tabs
import { DashboardTab } from './DashboardTab';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';
import { SubscriptionTab } from './SubscriptionTab';
import { NotificacoesTab } from './NotificacoesTab';
import { AtividadeTab } from './AtividadeTab';

export function Painel() {
  const { user, profile, loading, updateAvatar, updateBanner, addHeartPoints, updateProfileFields } = useAuthStore();
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(urlTab || 'geral'); // Defaults to "geral" to match user settings mockup

  const [claimCooldown, setClaimCooldown] = useState<string>('');
  const [canClaim, setCanClaim] = useState<boolean>(true);
  const [isClaimingPoints, setIsClaimingPoints] = useState<boolean>(false);

  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!profile?.lastClaimDate) {
        setCanClaim(true);
        setClaimCooldown('');
        return;
      }
      
      const lastClaimTime = new Date(profile.lastClaimDate).getTime();
      const nextClaimTime = lastClaimTime + 8 * 60 * 60 * 1000; // 8 hours claim cooldown
      const now = Date.now();
      const diff = nextClaimTime - now;
      
      if (diff <= 0) {
        setCanClaim(true);
        setClaimCooldown('');
      } else {
        setCanClaim(false);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setClaimCooldown(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [profile?.lastClaimDate]);

  const handleSidebarClaim = async () => {
    try {
      setIsClaimingPoints(true);
      const reward = 150;
      await addHeartPoints(reward);
      const nowISO = new Date().toISOString();
      await updateProfileFields({
        lastClaimDate: nowISO,
        heartPoints: (profile?.heartPoints ?? 200) + reward
      });
      toast.success(`Mimos coletados! +${reward} 💖! Balanço atualizado!`);
    } catch {
      toast.error('Erro ao reivindicar seus pontos.');
    } finally {
      setIsClaimingPoints(false);
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [updatingBanner, setUpdatingBanner] = useState(false);
  const navigate = useNavigate();
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Sessão encerrada!");
      navigate('/login');
    } catch (error) {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  // Image resize helper
  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("No canvas context"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUpdatingAvatar(true);
        const file = e.target.files[0];
        const base64 = await resizeImage(file, 400, 400);
        await updateAvatar(base64);
        toast.success("Foto de perfil atualizada!");
      } catch (error) {
        toast.error("Erro ao atualizar foto de perfil.");
      } finally {
        setUpdatingAvatar(false);
      }
    }
  };

  const handleBannerUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUpdatingBanner(true);
        const file = e.target.files[0];
        const base64 = await resizeImage(file, 1600, 900);
        await updateBanner(base64);
        toast.success("Banner de perfil atualizado!");
      } catch (error) {
        toast.error("Erro ao atualizar banner de perfil.");
      } finally {
        setUpdatingBanner(false);
      }
    }
  };

  // Restructured groups matching the mock user settings menu categorizations
  const navSidebarGroups = [
    {
      group: 'PESSOAL',
      items: [
        { id: 'geral', label: 'Geral', icon: User },
        { id: 'seguranca', label: 'Segurança', icon: Shield },
        { id: 'notificacoes', label: 'Notificações', icon: Bell },
        { id: 'atividade', label: 'Atividade', icon: History },
        { id: 'favoritos', label: 'Favoritos', icon: Heart }
      ]
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'geral':
      case 'perfil':
        return <ProfileTab />;
      case 'seguranca':
        return <SecurityTab />;
      case 'notificacoes':
        return <NotificacoesTab />;
      case 'atividade':
        return <AtividadeTab />;
      case 'favoritos':
        return (
          <div className="text-center py-16 px-4 space-y-4">
            <div className="w-14 h-14 bg-rose-100 border-[3px] border-black text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#1a1a1a] hover:-rotate-6 transition-transform">
              <Heart size={24} strokeWidth={3} className="fill-rose-500" />
            </div>
            <h3 className="text-black font-black text-lg uppercase tracking-tight">Meus Favoritos</h3>
            <p className="font-sans font-bold text-xs text-zinc-600 max-w-xs mx-auto leading-relaxed">
              Aqui você encontra todos os seus momentos, fotos e músicas favoritas salvas. (Em breve!)
            </p>
          </div>
        );
      default:
        return <ProfileTab />;
    }
  };

  const SidebarContent = () => {
    return (
      <div className="flex flex-col h-full bg-white border-[4px] border-black rounded-[24px] overflow-hidden select-none shadow-[6px_6px_0px_0px_#1a1a1a]">
        
        {/* Claim Reward Widget integrated nicely inside sidebar top */}
        <div className="p-4 border-b-[4px] border-black bg-yellow-50">
          <div className="bg-[#fcf9f2] border-[3px] border-black p-3 rounded-xl flex flex-col justify-between gap-2 shadow-[4px_4px_0px_0px_#1a1a1a]">
            <div className="flex items-center gap-1.5 justify-between">
              <span className="text-[10px] font-black uppercase text-[#e84e4e] tracking-wider flex items-center gap-1">
                <Gift size={12} className="text-[#e84e4e] shrink-0" strokeWidth={3} /> Mimos Diários
              </span>
              <span className="text-[11px] font-mono font-black text-black">
                {profile?.heartPoints ?? 200} 💖
              </span>
            </div>
            
            {canClaim ? (
              <button
                onClick={handleSidebarClaim}
                disabled={isClaimingPoints}
                className="w-full bg-[#e84e4e] hover:bg-red-650 active:translate-y-0.5 text-white text-[10px] font-black uppercase tracking-widest py-2.5 px-2 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_0px_#1a1a1a] transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                Coletar +150
              </button>
            ) : (
              <div className="text-center bg-white py-2 rounded-lg border-[2px] border-black">
                <span className="block text-[8px] font-sans font-black text-zinc-500 uppercase tracking-widest leading-none">
                  Próximo em:
                </span>
                <span className="block text-[10px] font-mono font-bold text-black mt-0.5">
                  {claimCooldown}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="p-3 flex-1 overflow-y-auto space-y-5 bg-white">
          {navSidebarGroups.map((group, groupIndex) => {
            return (
              <div key={groupIndex} className="space-y-1">
                {/* Category label */}
                <h4 className="text-[10px] font-extrabold text-[#7c7c8c] tracking-[0.2em] px-3.5 uppercase select-none mb-1.5 font-sans">
                  {group.group}
                </h4>
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all border-[2.5px] text-xs font-black uppercase tracking-wider relative select-none ${
                          isSelected 
                            ? 'bg-[#e84e4e] text-white border-black shadow-[2px_2px_0px_0px_#1a1a1a]' 
                            : 'bg-transparent text-zinc-700 border-transparent hover:text-black hover:bg-yellow-50 focus:bg-yellow-50 outline-none'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon size={15} strokeWidth={isSelected ? 3 : 2} className={isSelected ? 'text-white' : 'text-zinc-500'} />
                          <span>{item.label}</span>
                        </div>
                        
                        {isSelected && (
                          <ChevronRight size={12} strokeWidth={3} className="text-white" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>
        
        {/* Sair da Conta button inside sidebar bottom */}
        <div className="p-3 border-t-[4px] border-black bg-rose-50">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-black uppercase tracking-widest text-[#e84e4e] border-[3px] border-black bg-white hover:bg-rose-100 active:translate-y-0.5 rounded-xl shadow-[2px_2px_0px_0px_#1a1a1a] active:shadow-[1px_1px_0px_0px_#1a1a1a] transition-all cursor-pointer"
          >
            <LogOut size={14} strokeWidth={3} />
            Sair da Conta
          </button>
        </div>
      </div>
    );
  };

  const defaultComicBanner = 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1200';
  const customBanner = profile?.banner || defaultComicBanner;

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-black pb-16 font-sans pt-0 select-none">
      
      {/* 1. HERO COMIC COVER BANNER SECTION - Increased height to show more of the photo */}
      <div className="w-full h-[500px] md:h-[700px] lg:h-[850px] bg-sky-200 relative border-b-[4px] border-black">
        
        {/* Back Button (Voltar ao inicio) */}
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 left-6 z-40 px-4 py-2 bg-white hover:bg-yellow-50 border-[3px] border-black text-black rounded-xl shadow-[4px_4px_0px_0px_#1a1a1a] active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#1a1a1a] transition-all font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={13} strokeWidth={3} />
          <span>Voltar</span>
        </button>

        {/* Banner Graphic Layer */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={customBanner} 
            alt="Profile Cover Banner" 
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none" 
          />
          {/* Saturated cinematic overlay filter to enrich the visual depths */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-95" />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        {/* Change Cover Button */}
        <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
        <button 
          onClick={() => bannerInputRef.current?.click()} 
          disabled={updatingBanner}
          className="absolute top-6 right-6 z-40 px-4 py-2 bg-white hover:bg-yellow-50 border-[3px] border-black text-black rounded-xl shadow-[4px_4px_0px_0px_#1a1a1a] active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#1a1a1a] transition-all font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Camera size={13} strokeWidth={3} />
          <span>{updatingBanner ? 'Processando...' : 'Alterar Capa'}</span>
        </button>
      </div>

      {/* 2. OVERLAPPING PROFILE SECTION HEADER */}
      {!(activeTab === 'notificacoes' || activeTab === 'seguranca') && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 absolute relative -mt-20 md:-mt-24 z-20">
          <div className="flex flex-col md:flex-row gap-5 md:items-end">
            
            {/* Avatar Profile Picture with real glowing accent */}
            <div className="relative shrink-0 flex items-center justify-center select-none">
              {/* Rigid bold black shadow */}
              <div className="absolute inset-0 rounded-[32px] bg-black translate-x-1.5 translate-y-1.5" />
              
              <div className={`w-24 h-24 md:w-32 md:h-32 object-cover relative rounded-[28px] border-[4px] border-black bg-white z-10 overflow-hidden ${
                AVATAR_FRAMES.find(f => f.id === (profile?.selectedFrame || 'none'))?.className || ''
              }`}>
                <img 
                  src={profile?.avatar || user.photoURL || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300'} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              <button 
                onClick={() => avatarInputRef.current?.click()} 
                disabled={updatingAvatar}
                className="absolute bottom-0 right-0 p-2 text-[#fcf9f2] rounded-full shadow-[2px_2px_0px_0px_#1a1a1a] bg-[#e84e4e] hover:bg-red-650 border-[3px] border-black disabled:opacity-50 z-20 transition-all cursor-pointer hover:scale-105 active:translate-y-0.5"
              >
                <Camera size={13} strokeWidth={3} />
              </button>
            </div>

            {/* User Text Details */}
            <div className="flex-1 min-w-0 space-y-1.5 md:mb-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight font-sans">
                  {profile?.displayName || user.displayName || 'Emannuel Matos'}
                </h1>
                
                {profile?.selectedTitle && profile?.selectedTitle !== 'none' && (
                  <span className={`text-[11px] md:text-xs mt-1 block ${TITLES_LIST.find(t => t.id === profile.selectedTitle)?.className || 'text-zinc-500 font-bold'}`}>
                    « {TITLES_LIST.find(t => t.id === profile.selectedTitle)?.name || profile.selectedTitle} »
                  </span>
                )}
                
                {/* Playful cartoon badge */}
                <span className="inline-flex items-center gap-1 bg-[#e84e4e] border-[2.5px] border-black text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-[2px_2px_0px_0px_#1a1a1a] select-none rotate-2">
                  {profile?.cargo || 'Senior Software Engineer'}
                </span>
              </div>

              {/* Meta statistics rows (Email, City, Registry) */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-zinc-700 text-[11px] font-bold pt-1 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 truncate max-w-xs">
                  <Mail size={12} className="text-zinc-500 shrink-0" strokeWidth={2.5} />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-zinc-500 shrink-0" strokeWidth={2.5} />
                  {profile?.localizacao || 'São Paulo, Brasil'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-zinc-500 shrink-0" strokeWidth={2.5} />
                  Membro desde 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CORE TWO COLUMN NAVIGATION GRID */}
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-8 ${(activeTab === 'notificacoes' || activeTab === 'seguranca') ? 'mt-0' : 'mt-12'}`}>
        
        {/* Mobile Header Menu Trigger */}
        <div className="md:hidden flex items-center justify-between mb-4 p-4 border-[3px] border-black bg-white rounded-2xl shadow-[4px_4px_0px_0px_#1a1a1a]">
          <div className="text-xs font-black uppercase tracking-widest text-black">Menu do Perfil</div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="p-2 border-[3.5px] border-black rounded-xl bg-[#e84e4e] hover:bg-red-650 text-white transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1a1a1a]"
          >
            <Menu size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Dashboard Panels Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Column A: Desktop Sidebar */}
          {!(activeTab === 'notificacoes' || activeTab === 'seguranca') && (
            <div className="hidden md:block w-64 sticky top-6 flex-shrink-0">
              <SidebarContent />
            </div>
          )}

          {/* Column B: Active Tab Screen Body */}
          <div className="flex-1 min-w-0 w-full">
            {/* Beautiful, pristine cartoon paper container */}
            <div className={`bg-white border-[4px] border-black rounded-[32px] p-6 min-h-[500px] shadow-[8px_8px_0px_0px_#1a1a1a] ${(activeTab === 'notificacoes' || activeTab === 'seguranca') ? 'md:p-0 border-none shadow-none bg-transparent' : 'md:p-8'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* 4. MOBILE DRAWER SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="w-[80vw] h-full flex flex-col shadow-xl bg-[#fcf9f2] border-l-[4px] border-black"
          >
            <div className="p-4 flex justify-between items-center border-b-[4px] border-black bg-yellow-300">
              <span className="text-[11px] font-black uppercase tracking-widest text-black">Opções de Conta</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-1.5 border-[2.5px] border-black rounded-lg bg-white text-black cursor-pointer shadow-[2px_2px_0px_0px_#1a1a1a] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#1a1a1a]"
              >
                <X size={15} strokeWidth={3} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-white p-4">
              <SidebarContent />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
