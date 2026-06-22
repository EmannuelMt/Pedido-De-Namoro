import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useNotificationsStore } from '../store/notifications';
import { 
  Heart, 
  Home, 
  BookOpen, 
  Image as ImageIcon, 
  Music, 
  DiscAlbum, 
  LogIn, 
  Menu, 
  X, 
  Rocket, 
  LayoutDashboard, 
  Camera, 
  Users, 
  Github, 
  Instagram, 
  MessageSquare, 
  Youtube, 
  Globe,
  Headphones, 
  CheckCircle, 
  Smartphone, 
  Shield, 
  Search, 
  Mic, 
  MicOff, 
  Bell, 
  ChevronDown, 
  Star, 
  Sparkles, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Award,
  Clock,
  Volume2,
  Gamepad2,
  Wrench,
  Zap,
  User
} from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast as sonnerToast } from 'sonner';
import { LoadingScreen } from './LoadingScreen';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import toast from 'react-hot-toast';

interface SearchItem {
  id: string;
  type: 'moment' | 'photo' | 'album' | 'music' | 'story';
  title: string;
  tags: string[];
  url: string;
  icon: string;
}

const SEARCH_DATABASE: SearchItem[] = [
  // Moments
  { id: 'm1', type: 'moment', title: 'Primeiro Encontro', tags: ['encontro', 'primeiro', 'café', 'amor', 'romance'], url: '/historia', icon: '❤️' },
  { id: 'm2', type: 'moment', title: 'Cinema no Fim de Semana', tags: ['cinema', 'filme', 'pipoca', 'shopping'], url: '/historia', icon: '🎬' },
  { id: 'm3', type: 'moment', title: 'Viagem dos Sonhos', tags: ['viagem', 'aeroporto', 'hotel', 'montanha'], url: '/historia', icon: '✈️' },
  
  // Photos
  { id: 'p1', type: 'photo', title: 'Tarde na Praia', tags: ['praia', 'sol', 'mar', 'verão', 'foto'], url: '/galeria', icon: '📸' },
  { id: 'p2', type: 'photo', title: 'Festa de Aniversário', tags: ['aniversário', 'bolo', 'festa', 'família'], url: '/galeria', icon: '🎂' },
  { id: 'p3', type: 'photo', title: 'Passeio no Parque', tags: ['passeio', 'parque', 'piquenique', 'natureza'], url: '/galeria', icon: '🌳' },
  
  // Albums
  { id: 'a1', type: 'album', title: 'Álbum Lembranças 2025', tags: ['2025', 'ano', 'retrospectiva', 'fotos'], url: '/albuns', icon: '📂' },
  { id: 'a2', type: 'album', title: 'Álbum Viagens de Verão', tags: ['viagens', 'férias', 'estrada', 'praia'], url: '/galeria', icon: '🎒' },
  { id: 'a3', type: 'album', title: 'Álbum Datas Especiais', tags: ['datas especiais', 'aniversário namoro', 'natal'], url: '/galeria', icon: '🗓️' },
  
  // Songs
  { id: 's1', type: 'music', title: 'Perfect — Ed Sheeran', tags: ['perfect', 'ed sheeran', 'romântica', 'música', 'dança'], url: '/musicas', icon: '🎵' },
  { id: 's2', type: 'music', title: 'Photograph — Ed Sheeran', tags: ['photograph', 'sheeran', 'fotos', 'nostalgia'], url: '/musicas', icon: '🎶' }
];

export function RootLayout() {
  const { user, profile, loading: authLoading, updateProfileFields } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isPainel = location.pathname.startsWith('/painel');

  // Dynamic days counter from '2024-01-01'
  const daysTogether = useMemo(() => {
    const startDate = new Date('2024-01-01');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  // Search Logic
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Dropdown States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Notifications State Manager using real-time store
  const { 
    notifications: dbNotifications, 
    markAsRead: dbMarkAsRead, 
    markAllAsRead: dbMarkAllAsRead,
    clearAll: dbClearAll
  } = useNotificationsStore();

  const activeNotificationsCount = useMemo(() => {
    return dbNotifications.filter(n => !n.readed).length;
  }, [dbNotifications]);

  // Favorites Mock Data
  const [favorites, setFavorites] = useState({
    photos: ['Nossa Tarde na Praia 🏖️', 'Piquenique no Parque 🧺', 'Aniversário Juntos 🍰'],
    songs: ['Perfect — Ed Sheeran 🎵', 'Photograph — Ed Sheeran 🎶', 'A Thousand Years 🎻'],
    stories: ['Primeiro Encontro no Café ☕', 'Cinema sob as Estrelas 🍿'],
    moments: ['Noite Romântica no Chalé 🏠']
  });

  // Intelligent Scroll State
  const [scrolled, setScrolled] = useState(false);

  // Search Suggester algorithm
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SEARCH_DATABASE.filter(item => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q)) ||
        item.type.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Track Scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard Shortcuts (GitHub Style)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsFavoritesOpen(false);
        setIsUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click Outside to Close Dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
      if (favoritesRef.current && !favoritesRef.current.contains(target)) {
        setIsFavoritesOpen(false);
      }
      if (userRef.current && !userRef.current.contains(target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (authLoading) {
    return <LoadingScreen />;
  }

  // Voice Speech Recognition
  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Busca por voz não é suportada neste navegador.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        sonnerToast.info("🎙️ Ouvindo... Diga o que deseja pesquisar!");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Erro no reconhecimento de voz.");
      };

      recognition.onresult = (event: any) => {
        const speechToText = event.results[0][0].transcript;
        setSearchQuery(speechToText);
        setIsSearchOpen(true);
        sonnerToast.success(`Buscando por: "${speechToText}"`);
      };

      recognition.start();
    } catch (e) {
      console.error("Speech Recognition failed to instantiate:", e);
      toast.error("Erro ao iniciar reconhecimento de voz.");
    }
  };

  // Persists the changed custom Status inside Firestore Profile!
  const handleStatusChange = async (newStatus: 'online' | 'idle' | 'dnd' | 'invisible') => {
    try {
      await updateProfileFields({ status: newStatus });
      toast.success(`Status atualizado para: ${
        newStatus === 'online' ? '🟢 Online' : 
        newStatus === 'idle' ? '🌙 Ausente' : 
        newStatus === 'dnd' ? '🔴 Ocupado' : '⚫ Invisível'
      }!`);
    } catch {
      toast.error("Erro ao salvar status.");
    }
  };

  // Marks all notifications as read at once
  const markAllNotificationsAsRead = () => {
    dbMarkAllAsRead();
  };

  // Toggle single notification status
  const toggleNotificationRead = (id: string) => {
    dbMarkAsRead(id);
  };

  // Handle Log Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Sessão encerrada com sucesso!");
      navigate('/login');
    } catch {
      toast.error("Erro ao sair.");
    }
  };

  const navLinks = [
    { to: "/", icon: Home, label: "Início" },
    { to: "/historia", icon: BookOpen, label: "História" },
    { to: "/galeria", icon: ImageIcon, label: "Galeria" },
    { to: "/albuns", icon: DiscAlbum, label: "Álbuns" },
    { to: "/musicas", icon: Music, label: "Músicas" },
    { to: "/jogos", icon: Gamepad2, label: "Jogos" },
    { to: "/pedido", icon: Heart, label: "Pedido", highlight: true },
  ];

  // Helper status icon & tags representation
  const statusDetails = {
    online: { label: 'Online', color: 'bg-purple-500', icon: '🟢' },
    idle: { label: 'Ausente', color: 'bg-purple-400', icon: '🌙' },
    dnd: { label: 'Ocupado', color: 'bg-purple-700', icon: '🔴' },
    invisible: { label: 'Invisível', color: 'bg-slate-400', icon: '⚫' }
  };

  const userStatus = profile?.status || 'online';
  const activeStatus = statusDetails[userStatus];

  if (location.pathname === '/login' || location.pathname === '/pedido') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#1a1a1a] flex flex-col font-serif selection:bg-purple-500/30 relative overflow-hidden">
      {/* Decorative blurred background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none z-0"></div>
      
      <Toaster theme="light" position="bottom-center" />
      
      {/* Intelligent, Animated Premium Sticky Header Wrapper */}
      <div 
        id="sticky_header_container"
        className="sticky top-0 z-50 w-full flex flex-col transition-all duration-300 pointer-events-auto"
      >
        {/* Love Ticker Banner / Custom Status Bar */}
        <div className="bg-black text-white text-[9px] md:text-[10px] py-1.5 px-4 flex justify-between items-center font-sans tracking-widest font-black uppercase select-none shadow-sm relative z-50">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
            <span>DIÁRIO DO CASAL • JUNTOS HÁ <span className="text-pink-500 font-black">{daysTogether} DIAS</span> E CONTANDO! 💕</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 font-black text-neutral-300">
            <div className="flex items-center gap-1">
              SINTONIA HOJE: <span className="text-purple-400 font-extrabold">{95 + ((daysTogether + 3) % 6)}%</span> ⚡
            </div>
            <div className="text-neutral-400 border-l border-neutral-800 pl-3 lowercase">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
        </div>

        {/* Intelligent, Animated Premium Header Navbar */}
        <div className="w-full transition-all duration-500 relative z-50">
          <nav 
            id="main_navbar_principal"
            className={cn(
              "transition-all duration-300 w-full relative z-40 bg-[#fcf9f2] border-b-[4px] border-black shadow-[0_8px_0px_0px_rgba(0,0,0,1)]",
              scrolled 
                ? "h-[76px]" 
                : "h-[88px]"
            )}
          >
            <div className="w-full h-full flex items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* LOGO: Left side - ❤️ Ohimesama with unique custom stamp */}
            <Link to="/" id="logo_header_home" className="flex items-center gap-4 group shrink-0 select-none">
              <div className="relative flex items-center justify-center w-12 h-12">
                {/* Main round heart stamp */}
                <div className="relative w-12 h-12 rounded-full border-[3px] border-black bg-pink-400 flex items-center justify-center text-black scale-100 group-hover:scale-105 group-hover:-rotate-12 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 hover:-translate-y-1">
                  <Heart className="w-6 h-6 fill-black text-black" strokeWidth={3} />
                  {/* Playful mini crown badge floating above */}
                  <span className="absolute -top-3 -right-2 text-[14px] rotate-[15deg] select-none group-hover:scale-110 transition-transform bg-white border-2 border-black rounded-full w-6 h-6 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    👑
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col justify-center translate-y-0.5">
                <span className="font-sans font-black text-[22px] tracking-tighter text-black uppercase block leading-none" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                  OHIMESAMA
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="font-sans text-[10px] uppercase font-black tracking-[0.2em] text-black/60 leading-none">
                    Sempre Juntos
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-600 border border-black" />
                  <span className="font-sans text-[10px] uppercase font-black text-purple-600 tracking-widest">
                    EST. 2024
                  </span>
                </div>
              </div>
            </Link>

            {/* DESKTOP NAV BAR LINKS: Center Area */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-3">
              <div className="flex items-center bg-[#fcf9f2] p-1.5 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] gap-1">
                {navLinks.filter(l => !l.highlight).map((link) => {
                  const isActive = location.pathname === link.to;
                  const LinkIcon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      id={`nav_link_${link.label.toLowerCase()}`}
                      to={link.to}
                      className={cn(
                        "font-sans text-[11px] uppercase tracking-widest font-black transition-all duration-300 relative py-2.5 px-4 rounded-xl flex items-center gap-2 group select-none hover:-translate-y-0.5",
                        isActive 
                          ? "text-black bg-purple-300 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-[1.02]" 
                          : "text-black/70 hover:bg-gray-200 border-[2px] border-transparent"
                      )}
                    >
                      <LinkIcon className={cn("w-4 h-4 shrink-0 transition-transform duration-300 relative z-10", isActive ? "text-black" : "text-black/50 group-hover:scale-110", isActive && "fill-black/10")} strokeWidth={isActive ? 3 : 2.5} />
                      <span className="relative z-10 mt-[1px]">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {navLinks.find(l => l.highlight) && (() => {
                const highlightLink = navLinks.find(l => l.highlight)!;
                const isActive = location.pathname === highlightLink.to;
                return (
                  <Link
                    id="nav_link_pedido_destaque"
                    to={highlightLink.to}
                    className={cn(
                      "font-sans text-[12px] uppercase tracking-widest font-black transition-all duration-300 py-3 px-6 rounded-2xl flex items-center gap-2 group select-none hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black",
                      isActive
                        ? "text-black bg-stone-200 border-black shadow-[inset_0px_4px_0px_0px_rgba(0,0,0,0.1)]"
                        : "text-black bg-purple-300 hover:bg-purple-600 hover:text-white"
                    )}
                  >
                    <Heart className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "fill-black/20 text-black" : "fill-white/80 text-white group-hover:text-black group-hover:fill-black/30 animate-pulse")} strokeWidth={3} />
                    <span>{highlightLink.label}</span>
                  </Link>
                );
              })()}
            </div>

            {/* RIGHT SIDE UTILITIES BLOCK: Search, Bells, Favorites, Avatar profile dropdown */}
            <div className="flex items-center gap-3 md:gap-4">
              
              {/* 🔍 Global Search box */}
              <div ref={searchContainerRef} className="relative z-20">
                <div className="hidden md:flex items-center bg-[#fcf9f2] border-[3px] border-black py-2.5 px-4 rounded-xl max-w-[190px] lg:max-w-[260px] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 focus-within:-translate-y-1 focus-within:shadow-[4px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
                  <Search size={16} strokeWidth={3} className="text-black shrink-0 mr-2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="PESQUISAR..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    className="w-full bg-transparent font-sans text-[12px] focus:outline-none placeholder:text-black/30 font-black tracking-widest text-black uppercase"
                  />
                  
                  {/* Voice search button */}
                  <button 
                    id="search_voice_btn"
                    onClick={startVoiceSearch}
                    type="button"
                    className={cn("p-1.5 transition-colors rounded-lg hover:bg-gray-200 ml-1 shrink-0 border-2 border-transparent hover:border-black active:scale-95", isListening ? "text-purple-500 animate-pulse bg-purple-100 border-purple-500" : "text-black")}
                    title="Pesquisar por voz"
                  >
                    {isListening ? <MicOff size={14} strokeWidth={3} /> : <Mic size={14} strokeWidth={3} />}
                  </button>

                  <kbd className="hidden lg:flex items-center justify-center ml-1.5 bg-gray-100 px-2 py-0.5 rounded border-2 border-black text-[10px] font-black text-black pointer-events-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    /
                  </kbd>
                </div>

                {/* Mobile quick search trigger */}
                <button 
                  id="search_mobile_trigger"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="block md:hidden p-2.5 text-black hover:bg-gray-200 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 active:scale-95 bg-[#fcf9f2]"
                >
                  <Search size={18} strokeWidth={3} />
                </button>

              {/* Real-time search suggestions overlay */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="absolute right-0 mt-3 w-[290px] sm:w-[350px] bg-white border-[4px] border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-30 rounded-[20px] overflow-hidden"
                  >
                    <div className="flex justify-between items-center border-b-[4px] border-black p-4 bg-lime-300">
                      <span className="font-sans font-black uppercase text-[12px] tracking-widest text-black">SUGESTÕES EM TEMPO REAL</span>
                      <span className="font-sans text-[10px] bg-white px-2 py-1 border-[2px] border-black rounded font-black text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">ESC</span>
                    </div>

                    {/* Mobile Search input inside Suggestions */}
                    <div className="flex md:hidden items-center bg-white border-b-[4px] border-black p-3">
                      <input 
                        type="text" 
                        placeholder="MOMENTO, FOTO, MÚSICA..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent font-sans text-xs focus:outline-none font-black tracking-widest uppercase text-black"
                      />
                      <button onClick={startVoiceSearch} className="p-2 border-[2px] border-black rounded-lg bg-gray-100 hover:bg-lime-300 transition-colors">
                        <Mic size={16} className="text-black" strokeWidth={3} />
                      </button>
                    </div>

                    <div className="p-4 bg-white min-h-[200px]">
                    {searchQuery.trim() === '' ? (
                      <div className="space-y-4">
                        <p className="font-sans font-bold text-[11px] text-black/60 uppercase tracking-widest">DIGITE ALGO COMO "PRAIA", "VIAGEM" OU "PERFECT" PARA TESTAR...</p>
                        
                        {/* Tags recommendations */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-sans font-black uppercase tracking-wider text-black">TENDÊNCIAS:</span>
                          <div className="flex flex-wrap gap-2">
                            {['praia', 'primeiro', '2025', 'itinerário', 'aniversário', 'romance', 'safari'].map(tag => (
                              <button 
                                key={tag} 
                                onClick={() => setSearchQuery(tag)}
                                className="font-sans text-[10px] font-black px-2 py-1 text-black bg-[#fcf9f2] border-[2px] border-black hover:bg-lime-300 transition-all rounded uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : suggestions.length === 0 ? (
                      <div className="text-center py-8 font-sans font-black uppercase text-xl text-black/40">NENHUM RESULTADO 👀</div>
                    ) : (
                      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                        {suggestions.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              navigate(item.url);
                              setIsSearchOpen(false);
                            }}
                            className="flex items-center gap-3 p-3 border-[3px] border-transparent hover:border-black hover:bg-yellow-100 rounded-xl transition-all cursor-pointer group shadow-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <span className="text-2xl shrink-0 group-hover:scale-125 transition-transform">{item.icon}</span>
                            <div className="flex-1">
                              <h5 className="font-sans font-black text-[13px] text-black uppercase">{item.title}</h5>
                              <span className="font-sans text-[9px] uppercase font-black text-black bg-[#ff90e8] px-2 py-0.5 mt-1 border-[2px] border-black rounded inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{item.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 🔔 Notifications Bell Icon */}
            <div ref={notificationsRef} className="relative">
              <button
                id="notifications_bell"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsFavoritesOpen(false);
                  setIsUserDropdownOpen(false);
                }}
                className="w-10 h-10 flex items-center justify-center bg-purple-400 hover:bg-purple-500 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] relative group"
                aria-label="Notificações"
              >
                <Bell size={18} strokeWidth={2.5} className="group-hover:animate-[wiggle_1s_ease-in-out_infinite]" />
                {activeNotificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-[10px] font-sans font-black flex items-center justify-center rounded-full border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {activeNotificationsCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-5 w-[300px] md:w-[350px] bg-[#fcf9f2] border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden rounded-[24px]"
                  >
                    <div className="flex items-center justify-between p-4 border-b-[4px] border-black bg-purple-600 text-white">
                      <span className="font-sans font-black text-[12px] tracking-widest text-white uppercase">🔔 NOTIFICAÇÕES</span>
                      <button 
                        onClick={() => dbClearAll()}
                        className="font-sans text-[10px] font-black uppercase text-black bg-white px-2 py-1 rounded border-2 border-black hover:bg-pink-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                      >
                        LIMPAR
                      </button>
                    </div>

                    <div className="divide-y-[3px] divide-black max-h-[290px] overflow-y-auto bg-white custom-scrollbar-layout">
                      {dbNotifications.length === 0 ? (
                        <div className="p-8 text-center text-stone-500 font-sans text-xs uppercase font-black">
                          Nenhuma notificação 📭
                        </div>
                      ) : (
                        dbNotifications.map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => toggleNotificationRead(item.id)}
                            className={cn(
                              "p-4 transition-all text-left cursor-pointer relative hover:bg-yellow-50 flex gap-3 items-start group",
                              !item.readed ? "bg-[#ff90e8]/20" : "opacity-90"
                            )}
                          >
                            {!item.readed && (
                              <div className="absolute left-0 top-0 bottom-0 w-2 bg-purple-600 border-r-2 border-black" />
                            )}
                            <div className="flex-1 space-y-1 mt-0.5">
                              <p className={cn("font-sans text-[11px] leading-snug tracking-wide uppercase", !item.readed ? "text-black font-black" : "text-black/70 font-bold")}>
                                {item.title}: {item.message}
                              </p>
                              <span className="font-sans font-black text-[9px] uppercase text-black/50 tracking-wider flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full border-2 border-black bg-white"/> 
                                {item.createdAt instanceof Date ? item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Agora'}
                              </span>
                            </div>
                            {!item.readed && (
                              <span className="w-3 h-3 rounded-full bg-yellow-300 border-[2px] border-black shrink-0 mt-1.5 group-hover:scale-125 transition-transform" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-4 bg-[#fcf9f2] text-center border-t-[4px] border-black">
                      <button 
                        onClick={markAllNotificationsAsRead}
                        className="font-sans text-[11px] font-black uppercase tracking-widest text-black hover:text-purple-600 transition-colors flex items-center justify-center gap-2 w-full"
                      >
                        MARCAR TODAS COMO LIDAS
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ❤️ Favorites dropdown */}
            <div ref={favoritesRef} className="relative">
              <button
                id="favorites_toggle_btn"
                onClick={() => {
                  setIsFavoritesOpen(!isFavoritesOpen);
                  setIsNotificationsOpen(false);
                  setIsUserDropdownOpen(false);
                }}
                className="w-10 h-10 flex items-center justify-center bg-pink-100 hover:bg-pink-200 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] group"
                aria-label="Meus Favoritos"
              >
                <Heart size={18} strokeWidth={2.5} className="fill-pink-500 text-black group-hover:scale-110 transition-transform" />
              </button>

              <AnimatePresence>
                {isFavoritesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-5 w-[320px] bg-[#fcf9f2] border-[4px] border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[24px] z-40 overflow-hidden"
                  >
                    <div className="border-b-[4px] border-black p-4 bg-pink-500">
                      <h4 className="font-sans font-black uppercase text-[12px] text-white tracking-widest flex items-center gap-2">
                        <Heart size={14} className="text-white fill-white" strokeWidth={3} /> FAVORITOS DO UNIVERSO
                      </h4>
                      <p className="font-sans text-[10px] uppercase font-bold text-white/70 mt-1">SEUS MOMENTOS E MÍDIAS CURTIDOS AQUI</p>
                    </div>

                    {/* Favorites Categories Accordions */}
                    <div className="space-y-4 max-h-[300px] overflow-y-auto p-4 bg-white custom-scrollbar">
                      
                      {/* Photos favorites */}
                      <div className="space-y-3">
                        <span className="font-sans text-[10px] font-black uppercase tracking-wider text-black bg-pink-300 border-[2px] border-black px-2 py-1 rounded-lg block w-fit shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative z-10">
                          📸 FOTOS FAVORITAS
                        </span>
                        <div className="space-y-2 pl-2 border-l-[3px] border-dashed border-black/20 ml-2">
                          {favorites.photos.map((p, i) => (
                            <Link key={i} to="/galeria" onClick={() => setIsFavoritesOpen(false)} className="flex items-center gap-2 font-sans text-[11px] uppercase font-bold text-black hover:text-purple-600 py-1 transition-colors group">
                              <span className="w-2 h-2 rounded-full border-2 border-black bg-white group-hover:bg-[#ff90e8] transition-colors shrink-0" /> {p}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Songs favorites */}
                      <div className="space-y-3 pt-4 border-t-[3px] border-dashed border-black/10">
                        <span className="font-sans text-[10px] font-black uppercase tracking-wider text-black bg-purple-400 border-[2px] border-black px-2 py-1 rounded-lg block w-fit shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative z-10">
                          🎵 MÚSICAS FAVORITAS
                        </span>
                        <div className="space-y-2 pl-2 border-l-[3px] border-dashed border-black/20 ml-2">
                          {favorites.songs.map((s, i) => (
                            <Link key={i} to="/musicas" onClick={() => setIsFavoritesOpen(false)} className="flex items-center gap-2 font-sans text-[11px] uppercase font-bold text-black hover:text-purple-600 py-1 transition-colors group">
                              <span className="w-2 h-2 rounded-full border-2 border-black bg-white group-hover:bg-purple-400 transition-colors shrink-0" /> {s}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Stories favorites */}
                      <div className="space-y-3 pt-4 border-t-[3px] border-dashed border-black/10">
                        <span className="font-sans text-[10px] font-black uppercase tracking-wider text-black bg-purple-300 border-[2px] border-black px-2 py-1 rounded-lg block w-fit shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative z-10">
                          📖 HISTÓRIAS FAVORITAS
                        </span>
                        <div className="space-y-2 pl-2 border-l-[3px] border-dashed border-black/20 ml-2">
                          {favorites.stories.map((st, i) => (
                            <Link key={i} to="/historia" onClick={() => setIsFavoritesOpen(false)} className="flex items-center gap-2 font-sans text-[11px] uppercase font-bold text-black hover:text-purple-600 py-1 transition-colors group">
                              <span className="w-2 h-2 rounded-full border-2 border-black bg-white group-hover:bg-purple-300 transition-colors shrink-0" /> {st}
                            </Link>
                          ))}
                        </div>
                      </div>

                    </div>

                    <div className="p-4 text-center border-t-[4px] border-black bg-[#fcf9f2]">
                      <Link 
                        to="/painel?tab=favoritos" 
                        onClick={() => setIsFavoritesOpen(false)}
                        className="font-sans text-[11px] font-black uppercase text-black hover:text-purple-600 flex items-center justify-center gap-2 transition-colors w-full"
                      >
                        VER TODOS FAVORITOS <Award size={14} strokeWidth={3} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 👤 AVATAR dropdown: Premium Hybrid visual design with frames & status */}
            {user ? (
              <div ref={userRef} className="relative mr-2 lg:mr-3">
                <button
                  id="avatar_dropdown_trigger"
                  onClick={() => {
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                    setIsNotificationsOpen(false);
                    setIsFavoritesOpen(false);
                  }}
                  className="relative flex items-center justify-center shrink-0 w-11 h-11 focus:outline-none hover:-translate-y-1 transition-transform border-[3px] border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] p-0.5"
                >
                  <img 
                     src={profile?.avatar || user?.photoURL || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200'}
                    alt="P"
                    className="w-full h-full rounded-full object-cover bg-stone-100"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200';
                    }}
                  />
                  {/* Real-time status indicator badge */}
                  <span className={cn(
                    "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10",
                    activeStatus.color
                  )} />
                </button>

                {/* Avatar Dropdown Card */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, type: "spring", bounce: 0.4 }}
                      className="absolute right-0 mt-5 w-[280px] md:w-[340px] bg-[#fcf9f2] border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden rounded-[32px]"
                    >
                      {/* Premium Banner Background (Discord style) */}
                      <div 
                        className="h-[100px] w-full relative border-b-[4px] border-black bg-cover bg-center overflow-hidden"
                        style={profile?.banner ? { backgroundImage: `url(${profile.banner})` } : { backgroundImage: 'linear-gradient(45deg, #a855f7, #7c3aed, #6d28d9)' }}
                      >
                        {/* Subtle grain overlay */}
                        <div className="absolute inset-0 bg-black/10 opacity-30 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                        
                        {/* Elite User badge overlay */}
                        <div className="absolute right-4 top-4 bg-white border-[3px] border-black text-black font-sans text-[11px] font-black uppercase px-3 py-1.5 tracking-wider rounded-xl flex items-center gap-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform cursor-default rotate-3">
                          <span className="text-[14px]">👑</span> PREMIUM
                        </div>
                      </div>

                      {/* Profile details block */}
                      <div className="px-6 pb-6 pt-2 relative select-none mt-2">
                        
                        {/* Shifting AvatarWithFrame on top of banner */}
                        <div className="absolute -top-16 left-6 h-[84px] w-[84px] border-[4px] border-black bg-white rounded-full z-10 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                          <img
                            src={profile?.avatar || user.photoURL || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200'}
                            alt="Avatar"
                            className="w-full h-full object-cover select-none pointer-events-none rounded-full"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Align info below avatar offset */}
                        <div className="pl-[96px] space-y-0.5 mt-2">
                          <h4 className="font-sans font-black text-[20px] uppercase tracking-tighter text-black truncate" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                            {profile?.displayName || user.displayName || 'Nosso Membro'}
                          </h4>
                          
                          {/* Active User Status display badge */}
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className={cn("w-3 h-3 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]", activeStatus.color)} />
                            <span className="font-sans text-[11px] font-black text-black/60 uppercase tracking-widest">{activeStatus.label}</span>
                          </div>
                        </div>

                        {/* Status selector popover selector. Interactive status choice! */}
                        <div className="mt-8 bg-white border-[3px] border-black p-4 rounded-2xl space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                          <span className="font-sans text-[12px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                            <Zap size={16} className="text-yellow-500 fill-yellow-500" strokeWidth={3} /> Seu Status
                          </span>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { id: 'online', label: 'Online', icon: '🟢', color: 'bg-green-100 hover:bg-green-200 text-green-900 border-green-300' },
                              { id: 'idle', label: 'Ausente', icon: '🌙', color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-300' },
                              { id: 'dnd', label: 'Ocupado', icon: '🔴', color: 'bg-red-100 hover:bg-red-200 text-red-900 border-red-300' },
                              { id: 'invisible', label: 'Invisível', icon: '⚫', color: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300' }
                            ].map((statOption) => (
                              <button
                                key={statOption.id}
                                onClick={() => handleStatusChange(statOption.id as any)}
                                className={cn(
                                  "font-sans font-black text-[10px] uppercase tracking-wider py-2 border-2 transition-transform pl-2 flex items-center gap-1.5 rounded-xl border-black active:translate-y-0.5 active:shadow-none hover:-translate-y-0.5 cursor-pointer",
                                  userStatus === statOption.id 
                                    ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(139,92,246,1)] border-purple-500" 
                                    : cn("shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]", statOption.color)
                                )}
                              >
                                <span>{statOption.icon}</span> {statOption.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dropdown Menu links list */}
                        <div className="mt-8 space-y-4">
                          {/* Account Section */}
                          <div className="bg-white border-[3px] border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <h5 className="px-4 py-3 bg-blue-400 border-b-[3px] border-black text-[12px] font-black uppercase text-black tracking-widest flex items-center gap-2">
                                <User size={16} strokeWidth={3} className="text-black" /> Sua Conta
                            </h5>
                            <div className="p-2 space-y-1 bg-white">
                              {[
                                { label: "Meu Perfil", icon: <User size={18} strokeWidth={2.5}/>, to: "/painel?tab=geral" },
                                { label: "Favoritos", icon: <Heart size={18} strokeWidth={2.5}/>, to: "/painel?tab=favoritos" },
                                { label: "Aparência", icon: <Sparkles size={18} strokeWidth={2.5}/>, to: "/painel?tab=aparencia" },
                                { label: "Configurações", icon: <Settings size={18} strokeWidth={2.5}/>, to: "/painel" }
                              ].map((item) => (
                                <Link
                                  key={item.to}
                                  to={item.to}
                                  onClick={() => setIsUserDropdownOpen(false)}
                                  className="font-sans text-[12px] font-black uppercase tracking-wider py-3 text-black hover:bg-blue-100 px-4 flex items-center gap-3 transition-colors rounded-xl hover:translate-x-1 duration-200"
                                >
                                  <span className="text-black">{item.icon}</span>
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Log Out button */}
                        <div className="mt-5 pt-3">
                          <button
                            id="signout_navbar_btn"
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              handleSignOut();
                            }}
                            className="w-full flex items-center justify-center gap-2 font-sans font-black text-[12px] uppercase tracking-widest py-3.5 rounded-2xl bg-purple-300 border-[3px] border-black text-black hover:bg-purple-600 hover:text-white transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 group"
                          >
                            <LogOut size={18} strokeWidth={3} className="text-black group-hover:text-white" /> Sair da Conta
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/login" 
                id="login_header_btn" 
                className="font-sans text-[11px] font-bold uppercase tracking-widest bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-purple-600 dark:hover:bg-purple-400 py-2 px-6 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
            </div>

            {/* Mobile menu drawer burger. Displayed on tablet and smaller screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-800 dark:text-neutral-200 hover:text-purple-500 dark:hover:text-purple-400 transition-colors relative z-30"
              aria-label="Toggle Menu Mobile"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu Layer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-[80px] left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border-b border-neutral-200 dark:border-neutral-800 z-40 shadow-2xl rounded-b-3xl"
          >
            <div className="px-6 pt-6 pb-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block text-[13px] font-sans uppercase font-extrabold tracking-widest flex items-center gap-4 transition-all py-2 px-3 rounded-xl",
                    link.highlight 
                      ? "text-purple-600 bg-purple-50 dark:bg-purple-500/10" 
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                >
                  <link.icon className={cn("w-5 h-5", link.highlight ? "fill-purple-500/20" : "")} />
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Link 
                  to="/painel" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block text-[13px] font-sans uppercase font-extrabold tracking-widest text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-4 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 py-2 px-3 transition-colors rounded-xl"
                >
                  <LayoutDashboard className="w-5 h-5" /> Painel
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block text-[13px] font-sans uppercase font-extrabold tracking-widest text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-4 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 py-2 px-3 transition-colors rounded-xl"
                >
                  <LogIn className="w-5 h-5" /> Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main page canvas content wrapper */}
      <main className={cn(
        "flex-1 w-full relative z-10",
        isPainel || location.pathname === "/albuns" || location.pathname === "/musicas" || location.pathname === "/galeria" || location.pathname === "/historia" ? "max-w-none px-0 py-0" : (location.pathname === "/" ? "max-w-none px-0 pt-0 pb-12" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8")
      )}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (Cartoon Style) */}
      <div id="mobile_instagram_bottom_bar" className="md:hidden fixed bottom-0 left-0 right-0 bg-[#fcf9f2] border-t-[4px] border-black z-50 px-4 py-3 flex justify-between items-center shadow-[0_-8px_0px_0px_rgba(0,0,0,1)] pb-safe">
        {[
          { to: "/", icon: Home, label: "Início", color: "text-purple-600" },
          { to: "/historia", icon: BookOpen, label: "História", color: "text-purple-400" },
          { to: "/galeria", icon: ImageIcon, label: "Galeria", color: "text-pink-500" },
          { to: "/musicas", icon: Music, label: "Músicas", color: "text-purple-500" },
        ].map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link 
              key={item.to} 
              to={item.to} 
              className={cn(
                "flex flex-col items-center p-1.5 focus:outline-none transition-transform duration-200 active:translate-y-1",
                isActive ? "scale-110" : "grayscale hover:grayscale-0 hover:-translate-y-1"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white",
                isActive ? "bg-purple-200" : ""
              )}>
                <item.icon className={cn("w-5 h-5", isActive ? "text-black" : item.color)} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-sans font-black uppercase tracking-widest mt-1.5 text-black">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Mobile Quick Favorite Trigger */}
        <button 
          onClick={() => {
            setIsSearchOpen(true);
            setSearchQuery('');
          }}
          className="flex flex-col items-center p-1.5 focus:outline-none transition-transform duration-200 active:translate-y-1 hover:-translate-y-1 grayscale hover:grayscale-0"
        >
          <div className="p-1.5 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" strokeWidth={3} />
          </div>
          <span className="text-[10px] font-sans font-black uppercase tracking-widest mt-1.5 text-black">Amei</span>
        </button>

        {/* Profile / Painel tab */}
        <Link 
          to="/painel" 
          className={cn(
            "flex flex-col items-center p-1.5 focus:outline-none transition-transform duration-200 active:translate-y-1",
            location.pathname.startsWith('/painel') ? "scale-110" : "hover:-translate-y-1 grayscale hover:grayscale-0"
          )}
        >
          <div className={cn(
            "flex items-center justify-center p-1 rounded-full border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white w-10 h-10 shrink-0",
            location.pathname.startsWith('/painel') ? "bg-purple-300" : ""
          )}>
            <div className="w-full h-full rounded-full overflow-hidden border-[2px] border-black">
              <img 
                src={profile?.avatar || user?.photoURL || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200'}
                alt="P"
                className="w-full h-full object-cover bg-stone-100"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200';
                }}
              />
            </div>
          </div>
          <span className="text-[10px] font-sans font-black uppercase tracking-widest mt-1.5 text-black">Perfil</span>
        </Link>
      </div>

      {/* 🚀 Redesigned Modern & Natural Footer */}
      <footer className="relative mt-auto border-t-[4px] border-black bg-[var(--bg-custom)] text-[var(--text-custom)] overflow-hidden transition-colors duration-300">
        {/* Subtle Decorative Gradient / Grain Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_50%)] from-purple-500"></div>
        
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
            
            {/* 1. Brand Section (Large) */}
            <div className="lg:col-span-5 space-y-8">
              <Link to="/" className="inline-flex items-center gap-4 group">
                <div className="w-16 h-16 bg-white border-[4px] border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000] group-hover:-translate-y-1 group-hover:rotate-3 transition-all duration-300">
                  <Heart size={32} className="text-rose-500 fill-rose-500" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <h2 className="font-sans font-black text-2xl md:text-3xl tracking-tighter uppercase leading-none">
                    OHIMESAMA
                  </h2>
                  <span className="font-sans text-[10px] uppercase font-black tracking-[0.3em] opacity-50 mt-1">Eternal Memories Portal</span>
                </div>
              </Link>
              
              <p className="font-sans font-bold text-sm md:text-base leading-relaxed opacity-70 max-w-md">
                Eternizando cada batida, cada riso e cada momento. O seu refúgio digital para celebrar o que realmente importa: vocês.
              </p>

              <div className="flex items-center gap-4 pt-4">
                {[Instagram, Youtube, MessageSquare, Globe].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-xl border-[3px] border-black bg-white flex items-center justify-center text-black shadow-[3px_3px_0px_0px_#000] hover:-translate-y-1 hover:bg-stone-50 transition-all active:translate-y-0 active:shadow-none">
                    <Icon size={18} strokeWidth={3} />
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Quick Links Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              
              {/* Site Column */}
              <div className="space-y-6">
                <h4 className="font-sans font-black text-xs uppercase tracking-[0.2em] opacity-40">Plataforma</h4>
                <ul className="space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="font-sans text-sm font-black uppercase hover:text-rose-500 transition-colors flex items-center gap-2 group">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-custom)] scale-0 group-hover:scale-100 transition-transform"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Account Column */}
              <div className="space-y-6">
                <h4 className="font-sans font-black text-xs uppercase tracking-[0.2em] opacity-40">Acesso</h4>
                <ul className="space-y-4">
                  <li><Link to="/painel" className="font-sans text-sm font-black uppercase hover:text-indigo-500 transition-colors">Painel de Controle</Link></li>
                  <li><Link to="/painel?tab=perfil" className="font-sans text-sm font-black uppercase hover:text-indigo-500 transition-colors">Configurações</Link></li>
                  <li><Link to="/login" className="font-sans text-sm font-black uppercase hover:text-indigo-500 transition-colors">Minha Conta</Link></li>
                  <li><Link to="/jogos" className="font-sans text-sm font-black uppercase hover:text-indigo-500 transition-colors">Jogos & Diversão</Link></li>
                </ul>
              </div>

              {/* Info Column */}
              <div className="space-y-6">
                <h4 className="font-sans font-black text-xs uppercase tracking-[0.2em] opacity-40">Ajuda</h4>
                <ul className="space-y-4">
                  <li><button className="font-sans text-sm font-black uppercase hover:text-emerald-500 transition-colors">Suporte</button></li>
                  <li><button className="font-sans text-sm font-black uppercase hover:text-emerald-500 transition-colors">Feedback</button></li>
                  <li><button className="font-sans text-sm font-black uppercase hover:text-emerald-500 transition-colors">Privacidade</button></li>
                  <li><button className="font-sans text-sm font-black uppercase hover:text-emerald-500 transition-colors">Termos de Uso</button></li>
                </ul>
              </div>

            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-20 pt-8 border-t-[3px] border-black/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="font-sans text-[11px] font-black uppercase tracking-widest opacity-60">
                © 2026 OHIMESAMA PORTAL • ALL RIGHTS RESERVED
              </p>
              <div className="flex items-center gap-2 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                <span className="text-[10px] font-sans font-bold uppercase tracking-tighter">Crafted with</span>
                <Heart size={10} className="fill-[var(--text-custom)]" />
                <span className="text-[10px] font-sans font-bold uppercase tracking-tighter">for emannuel & partner</span>
              </div>
            </div>

            {/* Language/Region Mock */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 border-[2px] border-black rounded-xl bg-white flex items-center gap-2 font-sans text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000] text-black">
                <Globe size={12} strokeWidth={3} /> PT-BR
              </div>
              <div className="px-4 py-2 border-[2px] border-black rounded-xl bg-white flex items-center gap-2 font-sans text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000] text-black">
                UTC -03:00
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Color Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400"></div>
      </footer>
    </div>
  );
}
