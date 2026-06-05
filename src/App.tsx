import { ThemeBackground } from './components/ThemeBackground';
import { AudioSettings } from './components/AudioSettings';
import { audioManager } from './lib/audioManager';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGoogle, db } from './lib/firebase';
import { 
  addItem, 
  deleteItem,
  saveUserProfile, 
  subscribeToCollection,
  updateUserSettings,
  subscribeToDocument,
  sendNotification,
  markNotificationAsRead,
  getPartnerUid,
  deleteUserAccount,
  OperationType
} from './lib/firestore';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp, 
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { 
  Typewriter, 
  TimeTogether, 
  StarBackground
} from './components/SharedComponents';
import { Cursor } from './components/Cursor';
import { HomeLayoutResolver, LayoutType } from './components/layouts/HomeLayoutResolver';
import { ToastProvider, Breadcrumbs, ViewSkeleton, useToast } from './components/UXComponents';
import { PedidoView } from './components/PedidoView';
import { JogosView } from './components/JogosView';
import { SuccessView } from './components/SuccessView';
import { JournalView } from './components/JournalView';
import { TimelineView } from './components/TimelineView';
import { FutureView } from './components/FutureView';
import { QuizView } from './components/QuizView';
import { GalleryView } from './components/GalleryView';
import { PlaylistView } from './components/PlaylistView';
import { Footer } from './components/Footer';
import { FooterLayoutWrapper } from './components/FooterLayoutWrapper';
import { CookieConsent } from './components/CookieConsent';
import { NotFoundView } from './components/NotFoundView';
import { Navbar } from './components/Navbar';
import { NotificationButton } from './components/NotificationButton';
import { UserMenuResolver } from './components/UserMenuResolver';
import { GlobalMusicPlayer } from './components/GlobalMusicPlayer';
import { ProposalWizard } from './components/builder/ProposalWizard';
import { SetupData } from './store/useBuilderStore';
import { CustomProposalView } from './components/pedido/CustomProposalView';
import Loader from './components/Loader';
import { UniverseEmptyState } from './components/UniverseEmptyState';
import { 
  Heart, 
  Home,
  Music, 
  HeartHandshake, 
  Flower, 
  Flower2, 
  Sprout, 
  Calendar, 
  Image as ImageIcon, 
  MessageCircle, 
  CheckCircle2, 
  Compass, 
  Target,
  Lock,
  Pause,
  Play,
  SkipForward,
  SkipBack,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Camera,
  Gamepad2,
  Library,
  Coffee,
  MapPin,
  Star,
  Stars,
  Plus,
  ArrowLeft,
  X,
  User as UserIcon,
  LogOut,
  Settings,
  Bell,
  Menu,
  ArrowRight,
  Clock,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  Facebook,
  Linkedin,
  Twitter,
  Search,
  Palette,
  List,
  Shield,
  Info,
  LifeBuoy,
  Trash2,
  Eye,
  EyeOff,
  Film,
  Terminal,
  Leaf
} from 'lucide-react';

// --- Theme Management ---
type ThemeCategory = 
  | 'nature' | 'romance' | 'cinema' | 'gamer' | 'dev' 
  | 'special' | 'spiritual' | 'emotion' | 'corporate' 
  | 'experimental' | 'music' | 'classic' | 'travel';



interface PaletteColors {
  label: string;
  category: ThemeCategory;
  primary: string;
  primaryLight: string;
  primaryGlow: string;
  primaryGradient?: string;
  bg: string;
  bgAlt: string;
  text: string;
  textMuted: string;
  border: string;
  glass: string;
  cardStyle: string;
  animationStyle: string;
  accent: string;
  intensity?: 'soft' | 'balanced' | 'immersive';
}


export type ThemeMode = 
  | 'sage_garden' | 'deep_basalt' | 'warm_clay' | 'morning_mist' | 'arctic_glacier' | 'deep_ocean' | 'aurora_borealis'
  | 'petal_soft' | 'eternal_gold' | 'moonlight_date' | 'sweet_velvet' | 'cosmic_nebula' | 'luxury_classic'
  | 'mushroom_kingdom' | 'spike_planted' | 'global_offensive' | 'arcade_classic' | 'cyberpunk_neo' | '8bit_retro'
  | 'code_midnight' | 'transita_tech' | 'matrix_terminal' | 'compiler_light' | 'draft_blueprint'
  | 'golden_age_cinema' | 'technicolor' | 'directors_cut' | 'noir_film'
  | 'glitch_reality' | 'glassmorphism' | 'neural_drift';

export const THEMES: Record<ThemeMode, PaletteColors> = {
  // --- NATUREZA ---
  sage_garden: { label: 'Sage Garden', category: 'nature', primary: '#7D8E7E', primaryLight: '#9DAF9E', primaryGlow: 'rgba(125, 142, 126, 0.4)', bg: '#F1F1E6', bgAlt: '#E8E8DD', text: '#2A302A', textMuted: 'rgba(42, 48, 42, 0.5)', border: 'rgba(125, 142, 126, 0.2)', glass: 'rgba(255, 255, 255, 0.4)', cardStyle: 'border-sage-200 bg-white/40', animationStyle: 'animate-float', accent: '#5F6C5F' },
  deep_basalt: { label: 'Deep Basalt', category: 'nature', primary: '#2B2B2B', primaryLight: '#4B4B4B', primaryGlow: 'rgba(43, 43, 43, 0.4)', bg: '#1A1A1A', bgAlt: '#111111', text: '#EAEAEA', textMuted: 'rgba(234, 234, 234, 0.5)', border: 'rgba(43, 43, 43, 0.4)', glass: 'rgba(0, 0, 0, 0.6)', cardStyle: 'border-white/10 bg-black/40', animationStyle: 'animate-pulse-subtle', accent: '#111111' },
  warm_clay: { label: 'Warm Clay', category: 'nature', primary: '#B87352', primaryLight: '#D89372', primaryGlow: 'rgba(184, 115, 82, 0.4)', bg: '#E8D5C4', bgAlt: '#DFC5B2', text: '#3E271C', textMuted: 'rgba(62, 39, 28, 0.6)', border: 'rgba(184, 115, 82, 0.2)', glass: 'rgba(255, 255, 255, 0.3)', cardStyle: 'rounded-[25px] border-clay-200 bg-white/30', animationStyle: 'animate-pulse-slow', accent: '#8B573D' },
  morning_mist: { label: 'Morning Mist', category: 'nature', primary: '#D1D9E0', primaryLight: '#E8EEF2', primaryGlow: 'rgba(209, 217, 224, 0.5)', bg: '#FFFFFF', bgAlt: '#F5F7F9', text: '#4A5560', textMuted: 'rgba(74, 85, 96, 0.5)', border: 'rgba(209, 217, 224, 0.3)', glass: 'rgba(255, 255, 255, 0.6)', cardStyle: 'backdrop-blur-[20px] bg-white/40 border-white/40', animationStyle: 'animate-float', accent: '#8FA0B0' },
  arctic_glacier: { label: 'Arctic Glacier', category: 'nature', primary: '#E0F7FA', primaryLight: '#B2EBF2', primaryGlow: 'rgba(224, 247, 250, 0.5)', bg: '#006064', bgAlt: '#004D40', text: '#E0F7FA', textMuted: 'rgba(224, 247, 250, 0.7)', border: 'rgba(224, 247, 250, 0.2)', glass: 'rgba(0, 96, 100, 0.4)', cardStyle: 'border-cyan-200/40 bg-cyan-900/30 backdrop-blur-md', animationStyle: 'animate-pulse-subtle', accent: '#00BCD4' },
  deep_ocean: { label: 'Deep Ocean', category: 'nature', primary: '#005F73', primaryLight: '#0A9396', primaryGlow: 'rgba(0, 95, 115, 0.5)', bg: '#001219', bgAlt: '#000A0D', text: '#E9D8A6', textMuted: 'rgba(233, 216, 166, 0.5)', border: 'rgba(0, 95, 115, 0.3)', glass: 'rgba(0, 18, 25, 0.6)', cardStyle: 'border-cyan-800/40 bg-[#001219]/60', animationStyle: 'animate-float', accent: '#94D2BD' },
  aurora_borealis: { label: 'Aurora Borealis', category: 'nature', primary: '#0B3D91', primaryLight: '#00FFAB', primaryGlow: 'rgba(11, 61, 145, 0.6)', bg: '#000000', bgAlt: '#0A0A0A', text: '#00FFAB', textMuted: 'rgba(0, 255, 171, 0.5)', border: 'rgba(11, 61, 145, 0.5)', glass: 'rgba(11, 61, 145, 0.2)', cardStyle: 'border-[#0B3D91] bg-black/50', animationStyle: 'animate-pulse-slow', accent: '#FF00FF' },

  // --- ROMANCE ---
  petal_soft: { label: 'Petal Soft', category: 'romance', primary: '#F06292', primaryLight: '#F48FB1', primaryGlow: 'rgba(240, 98, 146, 0.4)', bg: '#FCE4EC', bgAlt: '#F8BBD0', text: '#880E4F', textMuted: 'rgba(136, 14, 79, 0.5)', border: 'rgba(240, 98, 146, 0.2)', glass: 'rgba(252, 228, 236, 0.6)', cardStyle: 'border-pink-200 bg-white/40', animationStyle: 'animate-float', accent: '#C2185B' },
  eternal_gold: { label: 'Eternal Gold', category: 'romance', primary: '#D4AF37', primaryLight: '#F3E5AB', primaryGlow: 'rgba(212, 175, 55, 0.4)', bg: '#000000', bgAlt: '#0A0A0A', text: '#D4AF37', textMuted: 'rgba(212, 175, 55, 0.6)', border: 'rgba(212, 175, 55, 0.3)', glass: 'rgba(0, 0, 0, 0.6)', cardStyle: 'border-[#D4AF37]/30 bg-black/80', animationStyle: 'animate-pulse-subtle', accent: '#FFFEE0' },
  moonlight_date: { label: 'Moonlight Date', category: 'romance', primary: '#1A237E', primaryLight: '#C5CAE9', primaryGlow: 'rgba(197, 202, 233, 0.6)', bg: '#1A237E', bgAlt: '#121858', text: '#C5CAE9', textMuted: 'rgba(232, 234, 246, 0.5)', border: 'rgba(197, 202, 233, 0.2)', glass: 'rgba(26, 35, 126, 0.5)', cardStyle: 'border-indigo-300/20 bg-[#1A237E]/40', animationStyle: 'animate-pulse-slow', accent: '#3F51B5' },
  sweet_velvet: { label: 'Sweet Velvet', category: 'romance', primary: '#880E4F', primaryLight: '#C2185B', primaryGlow: 'rgba(136, 14, 79, 0.4)', bg: '#4A0E0E', bgAlt: '#3A0B0B', text: '#FFCDD2', textMuted: 'rgba(255, 205, 210, 0.5)', border: 'rgba(136, 14, 79, 0.3)', glass: 'rgba(74, 14, 14, 0.5)', cardStyle: 'border-rose-900 bg-[#4A0E0E]/60 texture-grain', animationStyle: 'animate-pulse-subtle', accent: '#E91E63' },
  cosmic_nebula: { label: 'Cosmic Nebula', category: 'romance', primary: '#FF007F', primaryLight: '#FF3399', primaryGlow: 'rgba(255, 0, 127, 0.5)', bg: '#2D004B', bgAlt: '#1A002B', text: '#FCE4EC', textMuted: 'rgba(252, 228, 236, 0.6)', border: 'rgba(255, 0, 127, 0.3)', glass: 'rgba(45, 0, 75, 0.6)', cardStyle: 'border-pink-500/20 bg-[#2D004B]/60', animationStyle: 'animate-float', accent: '#9C27B0' },
  luxury_classic: { label: 'Luxury Classic', category: 'romance', primary: '#C0C0C0', primaryLight: '#E0E0E0', primaryGlow: 'rgba(192, 192, 192, 0.4)', bg: '#1B1B1B', bgAlt: '#111111', text: '#F5F5F5', textMuted: 'rgba(245, 245, 245, 0.5)', border: 'rgba(192, 192, 192, 0.2)', glass: 'rgba(27, 27, 27, 0.7)', cardStyle: 'border-gray-500/30 bg-[#1B1B1B]/80 font-serif', animationStyle: 'animate-pulse-subtle', accent: '#FFFFFF' },

  // --- GAMER ---
  mushroom_kingdom: { label: 'Mushroom Kingdom', category: 'gamer', primary: '#E91E63', primaryLight: '#2196F3', primaryGlow: 'rgba(33, 150, 243, 0.5)', bg: '#E91E63', bgAlt: '#C2185B', text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.6)', border: 'rgba(33, 150, 243, 0.4)', glass: 'rgba(233, 30, 99, 0.8)', cardStyle: 'border-4 border-blue-400 bg-pink-600 rounded-[20px] shadow-[0_10px_0_#1976D2]', animationStyle: 'animate-float', accent: '#2196F3' },
  spike_planted: { label: 'Spike Planted', category: 'gamer', primary: '#FA4454', primaryLight: '#FF7380', primaryGlow: 'rgba(250, 68, 84, 0.5)', bg: '#0F1923', bgAlt: '#080E14', text: '#ECE8E1', textMuted: 'rgba(236, 232, 225, 0.5)', border: 'rgba(250, 68, 84, 0.3)', glass: 'rgba(15, 25, 35, 0.6)', cardStyle: 'border-2 border-rose-500/50 bg-[#0F1923]/80 rounded-none', animationStyle: 'animate-pulse-subtle', accent: '#00FFC2' },
  global_offensive: { label: 'Global Offensive', category: 'gamer', primary: '#4B5320', primaryLight: '#D2B48C', primaryGlow: 'rgba(210, 180, 140, 0.4)', bg: '#4B5320', bgAlt: '#3A4018', text: '#F5F5DC', textMuted: 'rgba(245, 245, 220, 0.5)', border: 'rgba(210, 180, 140, 0.3)', glass: 'rgba(75, 83, 32, 0.8)', cardStyle: 'border-4 border-[#D2B48C] bg-[#4B5320] font-mono', animationStyle: 'animate-pulse-slow', accent: '#D2B48C' },
  arcade_classic: { label: 'Arcade Classic', category: 'gamer', primary: '#FFFF00', primaryLight: '#FFFF66', primaryGlow: 'rgba(255, 255, 0, 0.6)', bg: '#000000', bgAlt: '#111111', text: '#FFFF00', textMuted: 'rgba(255, 255, 0, 0.6)', border: '#FFFF00', glass: '#000000', cardStyle: 'border-4 border-yellow-400 bg-black font-mono', animationStyle: 'animate-pulse-subtle', accent: '#FF00FF' },
  cyberpunk_neo: { label: 'Cyberpunk Neo', category: 'gamer', primary: '#FF00FF', primaryLight: '#FF66FF', primaryGlow: 'rgba(255, 0, 255, 0.6)', bg: '#120458', bgAlt: '#0B0236', text: '#00FFFF', textMuted: 'rgba(0, 255, 255, 0.6)', border: 'rgba(255, 0, 255, 0.5)', glass: 'rgba(18, 4, 88, 0.7)', cardStyle: 'border-2 border-fuchsia-500 bg-[#120458]/80 shadow-[0_0_15px_#FF00FF]', animationStyle: 'animate-pulse-slow', accent: '#00FFFF' },
  '8bit_retro': { label: '8-Bit Retro', category: 'gamer', primary: '#00FF00', primaryLight: '#66FF66', primaryGlow: 'rgba(0, 255, 0, 0.5)', bg: '#202020', bgAlt: '#111111', text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.5)', border: '#00FF00', glass: '#202020', cardStyle: 'border-4 border-green-500 bg-[#202020] font-mono', animationStyle: 'animate-pulse-subtle', accent: '#FF0000' },

  // --- DEV ---
  code_midnight: { label: 'Code Midnight', category: 'dev', primary: '#58A6FF', primaryLight: '#79C0FF', primaryGlow: 'rgba(88, 166, 255, 0.4)', bg: '#0D1117', bgAlt: '#010409', text: '#C9D1D9', textMuted: 'rgba(139, 148, 158, 0.8)', border: 'rgba(48, 54, 61, 1)', glass: 'rgba(13, 17, 23, 0.8)', cardStyle: 'border border-[#30363D] bg-[#0D1117] rounded-md font-mono', animationStyle: 'animate-pulse-subtle', accent: '#238636' },
  transita_tech: { label: 'Transita Tech', category: 'dev', primary: '#28A745', primaryLight: '#34D058', primaryGlow: 'rgba(40, 167, 69, 0.4)', bg: '#F8F9FA', bgAlt: '#E9ECEF', text: '#212529', textMuted: 'rgba(33, 37, 41, 0.6)', border: 'rgba(0, 0, 0, 0.1)', glass: 'rgba(248, 249, 250, 0.9)', cardStyle: 'border border-gray-200 bg-white rounded-lg shadow-sm', animationStyle: 'animate-float', accent: '#0366D6' },
  matrix_terminal: { label: 'Matrix Terminal', category: 'dev', primary: '#00FF41', primaryLight: '#00FF41', primaryGlow: 'rgba(0, 255, 65, 0.5)', bg: '#000000', bgAlt: '#000000', text: '#00FF41', textMuted: 'rgba(0, 255, 65, 0.6)', border: '#00FF41', glass: '#000000', cardStyle: 'border border-[#00FF41] bg-black font-mono', animationStyle: 'animate-pulse-slow', accent: '#008F11' },
  compiler_light: { label: 'Compiler Light', category: 'dev', primary: '#D73A49', primaryLight: '#EA4A5A', primaryGlow: 'rgba(215, 58, 73, 0.3)', bg: '#FFFFFF', bgAlt: '#F6F8FA', text: '#24292E', textMuted: 'rgba(36, 41, 46, 0.6)', border: 'rgba(0, 0, 0, 0.1)', glass: 'rgba(255, 255, 255, 0.9)', cardStyle: 'border border-gray-200 bg-white rounded-sm', animationStyle: 'animate-pulse-subtle', accent: '#005CC5' },
  draft_blueprint: { label: 'Draft Blueprint', category: 'dev', primary: '#FFFFFF', primaryLight: '#FFFFFF', primaryGlow: 'rgba(255, 255, 255, 0.4)', bg: '#003366', bgAlt: '#002244', text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.6)', border: 'rgba(255, 255, 255, 0.3)', glass: 'rgba(0, 51, 102, 0.8)', cardStyle: 'border border-white/40 bg-[#003366] font-mono', animationStyle: 'animate-pulse-subtle', accent: '#66B2FF' },

  // --- CINEMA ---
  golden_age_cinema: { label: 'Golden Age', category: 'cinema', primary: '#FFFFFF', primaryLight: '#FFFFFF', primaryGlow: 'rgba(255, 255, 255, 0.5)', bg: '#111111', bgAlt: '#000000', text: '#EAEAEA', textMuted: 'rgba(234, 234, 234, 0.5)', border: 'rgba(255, 255, 255, 0.2)', glass: 'rgba(17, 17, 17, 0.8)', cardStyle: 'border-2 border-white/20 bg-[#111111] grayscale', animationStyle: 'animate-pulse-slow', accent: '#888888' },
  technicolor: { label: 'Technicolor', category: 'cinema', primary: '#FF0054', primaryLight: '#FF5400', primaryGlow: 'rgba(255, 0, 84, 0.6)', bg: '#1A1A1A', bgAlt: '#0F0F0F', text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.6)', border: 'rgba(255, 0, 84, 0.4)', glass: 'rgba(26, 26, 26, 0.7)', cardStyle: 'shadow-[0_10px_30px_rgba(255,0,84,0.3)] saturate-150', animationStyle: 'animate-float', accent: '#FFBD00' },
  directors_cut: { label: "Director's Cut", category: 'cinema', primary: '#E50914', primaryLight: '#F40612', primaryGlow: 'rgba(229, 9, 20, 0.5)', bg: '#141414', bgAlt: '#000000', text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.6)', border: 'rgba(229, 9, 20, 0.3)', glass: 'rgba(20, 20, 20, 0.8)', cardStyle: 'border-b-4 border-red-600 bg-[#141414]', animationStyle: 'animate-pulse-subtle', accent: '#808080' },
  noir_film: { label: 'Noir Film', category: 'cinema', primary: '#D3D3D3', primaryLight: '#FFFFFF', primaryGlow: 'rgba(211, 211, 211, 0.3)', bg: '#0A0A0A', bgAlt: '#000000', text: '#DDDDDD', textMuted: 'rgba(221, 221, 221, 0.4)', border: 'rgba(211, 211, 211, 0.2)', glass: 'rgba(10, 10, 10, 0.9)', cardStyle: 'shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 bg-black', animationStyle: 'animate-pulse-slow', accent: '#FFFFFF' },

  // --- SPECIAL ---
  glitch_reality: { label: 'Glitch Reality', category: 'experimental', primary: '#00FFFF', primaryLight: '#FF00FF', primaryGlow: 'rgba(0, 255, 255, 0.5)', bg: '#0A0A0C', bgAlt: '#050506', text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.6)', border: 'rgba(0, 255, 255, 0.5)', glass: 'rgba(10, 10, 12, 0.8)', cardStyle: 'hover:skew-x-2 border border-cyan-500 bg-black', animationStyle: 'animate-pulse-fast', accent: '#FF00FF' },
  glassmorphism: { label: 'Glassmorphism', category: 'classic', primary: '#FFFFFF', primaryLight: '#FFFFFF', primaryGlow: 'rgba(255, 255, 255, 0.3)', bg: '#000000', bgAlt: '#050505', text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.7)', border: 'rgba(255, 255, 255, 0.2)', glass: 'rgba(255, 255, 255, 0.1)', cardStyle: 'backdrop-blur-3xl bg-white/5 border border-white/20', animationStyle: 'animate-float', accent: '#E0E0E0' },
  neural_drift: { label: 'Neural Drift', category: 'experimental', primary: '#9D4EDD', primaryLight: '#C77DFF', primaryGlow: 'rgba(157, 78, 221, 0.5)', bg: '#10002B', bgAlt: '#240046', text: '#E0AAFF', textMuted: 'rgba(224, 170, 255, 0.6)', border: 'rgba(157, 78, 221, 0.3)', glass: 'rgba(16, 0, 43, 0.7)', cardStyle: 'rounded-[3rem] border border-purple-500/30 bg-[#10002B]/60', animationStyle: 'animate-pulse-slow', accent: '#5A189A' }
};

// --- Types ---
type View = 'landing' | 'login' | 'home' | 'historia' | 'galeria' | 'albuns' | 'jogos' | 'playlist' | 'cartas' | 'quiz' | 'futuro' | 'pedido' | 'sucesso' | 'perfil' | 'notfound';

interface Album {
  id: string | number;
  title: string;
  desc: string;
  cover: string;
  photos: string[];
  color: string;
}

interface FirebaseLetter {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: any;
}

// --- Data ---
const TIMELINE_DATA = [
  { 
    year: "14 de Junho, 2023", 
    title: "Primeiro Encontro", 
    desc: "Aquele momento que mudou o ritmo de tudo.", 
    details: "Foi quando percebi que o universo tinha planos maiores para nós. Nossos olhares se cruzaram e o tempo pareceu parar.", 
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800", 
    icon: <Sparkles className="text-white" />, 
    side: 'left' as const,
    music: "505 - Arctic Monkeys",
    location: "Praça Central",
    emotion: "Felicidade Pura",
    weather: "Tarde Ensolarada",
    hiddenMessage: "Eu estava tão nervoso naquele dia que quase derrubei o café, mas seu sorriso me acalmou instantaneamente."
  },
  { 
    year: "12 de Agosto, 2023", 
    title: "Nosso Primeiro Passeio", 
    desc: "Conversas que pareciam não ter fim.", 
    details: "Caminhamos sem rumo, descobrindo que nossas almas falavam a mesma língua, mesmo nos momentos de silêncio.", 
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800", 
    icon: <MessageCircle className="text-white" />, 
    side: 'right' as const,
    music: "Yellow - Coldplay",
    location: "Parque da Cidade",
    emotion: "Conexão Profunda",
    weather: "Fim de Tarde Dourado"
  },
  { 
    year: "05 de Novembro, 2023", 
    title: "A Primeira Foto", 
    desc: "O registro de um sentimento.", 
    details: "Estávamos rindo tanto que a foto saiu tremida, mas é a minha preferida. É a confirmação de que tudo o que sentíamos era real e palpável.", 
    image: "https://images.unsplash.com/photo-1502602720212-49a05591f18d?w=800", 
    icon: <MapPin className="text-white" />, 
    side: 'left' as const,
    music: "Perfect - Ed Sheeran",
    location: "Mirante",
    emotion: "Gratidão",
    weather: "Noite Estrelada",
    hiddenMessage: "Eu guardei essa foto na carteira desde aquele dia. Toda vez que olho para ela, lembro do motivo de sempre sorrir."
  },
  { 
    year: "Hoje", 
    title: "Nossa Sintonia", 
    desc: "Cada dia que passa, a certeza só aumenta.", 
    details: "Construindo nosso próprio universo juntos, em meio ao caos do mundo. E a jornada está apenas começando.", 
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800", 
    icon: <Heart className="text-white" />, 
    side: 'right' as const,
    music: "Lover - Taylor Swift",
    location: "Nosso Lar",
    emotion: "Amor Eterno",
    weather: "Clima Bom",
  },
];

const GALLERY_DATA = [
  { id: 1, category: "Viagens", url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800", caption: "Nossa primeira fuga do mundo." },
  { id: 2, category: "Momentos", url: "https://images.unsplash.com/photo-1518199266791-739d6ffecf0b?w=800", caption: "Onde tudo faz sentido." },
  { id: 3, category: "Viagens", url: "https://images.unsplash.com/photo-1502602720212-49a05591f18d?w=800", caption: "Luzes que nos guiaram." },
  { id: 4, category: "Momentos", url: "https://images.unsplash.com/photo-1516589174184-c6858b16ecb0?w=800", caption: "Nossas risadas bobas." },
  { id: 5, category: "Dia a Dia", url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800", caption: "O seu sorriso é luz." },
  { id: 6, category: "Dia a Dia", url: "https://images.unsplash.com/photo-1511285560929-d832140d709d?w=800", caption: "Cada café é especial." },
];

const ALBUMS_DATA: Album[] = [
  { 
    id: 1, 
    title: "Nossas Aventuras", 
    desc: "Explorando o mundo, um passo de cada vez.", 
    cover: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
    photos: [
       "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
       "https://images.unsplash.com/photo-1518199266791-739d6ffecf0b?w=800"
    ],
    color: "rose"
  },
  { 
    id: 2, 
    title: "Madrugadas", 
    desc: "Conversas que mudaram o meu mundo.", 
    cover: "https://images.unsplash.com/photo-1505300602322-934335436667?w=800",
    photos: [
       "https://images.unsplash.com/photo-1505300602322-934335436667?w=800"
    ],
    color: "purple"
  },
];

const PLAYLIST_DATA = [
  {
    id: 1,
    name: "Amanhecer",
    artist: "BK'",
    reason: "Esperança e superação no cotidiano.",
    spotify: "https://open.spotify.com/intl-pt/track/2RUTvhNHo2DEECnumWFG0o",
    lyrics: `Amanheceu na KGL, hah

Se o filme é ruim, ninguém espera a cena pós-crédito
Não correu o jogo todo, vai correr nos acréscimos
Esperou te cobrar pra nunca mais errar
Esperou jogarem no mar pra aprender a nadar
O monte nem começou e tá perto de acabar
Mas não é porque ainda não voou que não vai decolar
Não é porque amanheceu que a guerra vai parar
Não é porque não me escondi que vocês vão me achar
Só de sentir o vento bater, eu já me sinto vivo
Só de ver o Sol nascer, eu já me sinto vivo
Mas ama a noite igual morcego, é só rasante fino
É perigoso, eu não sou Batman, mas também trago armas no meu cinto
O sorriso da família me ilumina
Mas não vou negar, as luzes me seduzem ainda
E o brilho das armas, joias brabas, notas, gatas, glórias
Deus permita eu viver pra sempre

Já deixei minha peça de canto
Já pedi pra todos os santos
Amanhecer na casa de campo
Ouvindo Djavan
Correndo atrás de ti feito um cigano

Já deixei minha peça de canto
Já pedi pra todos os santos
Amanhecer na casa de campo
Ouvindo Djavan
Correndo atrás de ti feito um cigano

Fingir, por um segundo, que tá tudo ótimo
Os canceladores não querem que eu seja o próximo
Fingir, por um segundo, que a minha mente não é uma bomba-relógio
Lembrar que eu faço por amor, até na força do ódio
Yeah, vida louca não me domina
Que eu não vou me pôr em risco na próxima esquina
Me livrei da guerra mesmo sendo o maior vício
Mas, se na porta for ela, ainda estou pronto igual no início
Não é tentar, nem desistir, é só deixar fluir
Igual o sangue nas minhas veias e o mar batendo na areia
Impossível de controlar, igual essa moça
É a natureza das coisas

E, no final, meu sonho é igual
Família, churrasco no quintal
Ver meu time na final
Agradecendo a vida longe dos funeral
E fé pra isso

Já deixei minha peça de canto
Já pedi pra todos os santos
Amanhecer na casa de campo
Ouvindo Djavan
Correndo atrás de ti feito um cigano

Já deixei minha peça de canto
Já pedi pra todos os santos
Amanhecer na casa de campo
Ouvindo Djavan
Correndo atrás de ti feito um cigano

Já deixei minha peça de canto
Já pedi pra todos os santos
Amanhecer na casa de campo
Ouvindo Djavan
Correndo atrás de ti feito um cigano.`,
    meaning: "Em “Amanhecer”, BK' utiliza metáforas marcantes para abordar o amadurecimento diante das dificuldades. O amanhecer simboliza não apenas um novo dia, mas a esperança de recomeço e superação, mesmo reconhecendo que “não é porque amanheceu que a guerra vai parar”. Assim, a música se destaca como um relato honesto de quem valoriza a luz e a simplicidade do dia, mantendo a fé e a gratidão mesmo diante dos desafios."
  },
  {
    id: 2,
    name: "Planos",
    artist: "BK' (part. Luccas Carlos)",
    reason: "Cotidiano e cumplicidade.",
    spotify: "https://open.spotify.com/intl-pt/track/303J745tAnV9W0G9v0G9v0",
    lyrics: `Quando vi você chegar
Quando vi você chegar (ahn), você

Eu arrumei toda a casa
Joguei fora as lembranças que não servem mais pra nada (yeah-yeah-yeah-yeah)
Me livrei de toda sujeira
Aparecendo poeira, a gente dá uma espanada (yeah)
Huh, como é bom te olhar nos olhos
Planejar o futuro (aham)
Planejar os nossos (aham)
(Uh) sem pensar nos próximos episódios
Vivemos num infinita-metragem, baby
Você fala pra eu nunca te esquecer, mas olha só pra você
Huh, como me esquecer de você?
Não quero promessas, eu quero viver
E poder contar com você a grana que nóis tiver
Te olhando deitada na cama, e o Sol adora seu corpo
Da janela do quarto, eu me sinto iluminado, abençoado (yeah-yeah-yeah-yeah)
Tirando fotos suas e o coração dividido entre a real e a do retrato (oh), baby

Tenho você por perto, nunca me senti tão completo (yeah-yeah-yeah-yeah)
Nunca me senti tão seguro, perco o medo do fim do mundo
Tenho você por perto (por perto), me sinto caminhando certo (ahn-ahn-ahn)
Eu, que nem de tantos acertos, não errei em te ter no peito (não, não, não, não)

Você é tão gostosa que eu nem sofro em olhar você de costas indo embora (não, não)
Eu amo o jeito que você se veste
Eu amo o jeito que tu tira o que tu veste, baby, baby
Eu gosto tanto de ti, mó sensação que eu não preciso mentir, é
Talvez não menti tanto, nas suas pernas meditando (uh-uh-uh)
Esqueça o que eu falei sobre mentir, tava brincando (uh-ahn)
Podemos fazer todas as estrelas caírem
Com que todos se curvem (ó)
Os que tá em volta sumirem
En diante, nada será como antes, então vamos voar alto (é)
Vejo que tu cansou de rasante e, com razão, pra não se arrasar
Temos que ter sorte até em jogo de azar (ahn)
Já que cansou desse ritmo uniforme
Então, na melhor forma
Hoje vai trabalhar pra mim, tu pelada é teu uniforme
Deixa a ambição fluir, não precisa medir terreno (não)
Se queremos algo, qual o Mediterrâneo (ahn)
Não importa os meios, temos todos os direitos (ahn)
Quando a gente dá a mão, temos o mundo nas mãos

Papo é de que é o melhor, esse é o fim das suas dúvidas (uh-huh)
Papo é um mundo melhor, então só aceitar as dádivas, ahn
Ver você com sorriso igual das divas (uh)
Não tenha medo, essa vai ser a melhor das vidas, baby

Tenho você por perto, nunca me senti tão completo (ê)
Nunca me senti tão seguro, perco o medo do fim do mundo
Tenho você por perto (yeah), me sinto caminhando certo (yeah)
Eu, que nem de tantos acertos (não, uh), não errei em te ter no peito (não, uh)

Tenho você por perto (por perto), nunca me senti tão completo (tão completo)
Nunca me senti tão seguro, perco o medo do fim do mundo (yeah)
Tenho você por perto (por perto), me sinto caminhando certo (caminhando certo)
Eu, que nem de tantos acertos, não errei em te ter no peito (ê-ê-ê-ê)`,
    meaning: "\"Planos\" transforma situações simples do dia a dia em símbolos de renovação emocional. A letra valoriza a construção de planos a dois sem depender de promessas vazias, focando no presente e na intimidade do casal. É uma celebração do amor de maneira realista, leve e otimista."
  },
  {
    id: 3,
    name: "Bloco dos Apaixonados",
    artist: "Sotam (part. Carla Sol)",
    reason: "Celebração do amor coletivo.",
    spotify: "https://open.spotify.com/intl-pt/track/7pZ0Z0Z0Z0Z0Z0Z0Z0Z0Z0",
    lyrics: `Olá, como que tá?
Senti saudades e tive que ligar pra ti
Te vi em lugares que eu nem te vi passar
Mas consegui sentir você pensando em mim

A sensação de ver o vento me abraçar
E o coração bater mais forte em te ouvir
Já deu a hora de você voltar pra casa
Eu sei que não tem nada novo por aí

O que nós tem é tão bom, assim
Pra mim fingir, deixar de lado
A gente vem de um montão de risos
E carinhos, sim, são raros

Eu não quero só uma noite apenas
Quero que os dias tenham seus retratos
Vamos andar sem rumo por aí
No bloco dos apaixonados

O que nós tem é tão bom, assim
Pra mim fingir, deixar de lado
A gente vem de um montão de risos
E carinhos, sim, são raros

Eu não quero só uma noite apenas
Quero que os dias tenham seus retratos
Vamos andar sem rumo por aí
No bloco dos apaixonados`,
    meaning: "Destaca-se por transformar sentimentos de saudade e desejo em uma experiência coletiva e festiva. O 'bloco' representa um espaço simbólico onde o amor é vivido de forma intensa e aberta, sugerindo que os sentimentos devem ser celebrados publicamente e no dia a dia."
  },
  {
    id: 4,
    name: "CURA",
    artist: "Sotam",
    reason: "Carnaval, saudade e reconciliação.",
    spotify: "https://open.spotify.com/intl-pt/track/5u0w9u0w9u0w9u0w9u0w",
    lyrics: `A música “Cura”, de Sotam, propõe uma abordagem diferente do carnaval, tradicionalmente visto como sinônimo de festa e liberdade. Aqui, o carnaval é usado como metáfora para a saudade e o desejo de reconciliação. O refrão mostra que o reencontro amoroso é visto como um remédio para a dor da distância, reforçando a ideia de que o amor pode restaurar e curar.`,
    meaning: "Cura propõe uma abordagem diferente do carnaval, usando-o como metáfora para a saudade e o desejo de reconciliação. O reencontro amoroso é visto como um remédio para a dor da distância, reforçando a ideia de que o amor pode restaurar e curar."
  },
  {
    id: 5,
    name: "Nosso Carnaval",
    artist: "Sotam (part. Budah)",
    reason: "Memórias e saudade.",
    spotify: "https://open.spotify.com/intl-pt/track/4j6C6kY6kY6kY6kY6kY6",
    lyrics: `Quando eu lembro de você
Do nosso carnaval

Quando eu te conheci
Pareceu tudo natural

Nós dois juntos era flor
Em um dia de Sol
Meu amor de verão
Eu não queria seu final

E a saudade bate
Quando chega tarde
E eu não vejo você
Nossos momentos são detalhes
Como as fotos que ninguém vai ver

Junto das frases que eu guardei pra mim
Pensei em dizer
Mas não falei
Se eu te encontrar de novo
Eu deixo de ser tão assim`,
    meaning: "Retrata um romance marcado pela intensidade e brevidade típica dos amores de carnaval. A comparação do relacionamento com 'uma flor em um dia de Sol' destaca tanto a beleza quanto a fragilidade desse sentimento."
  },
  {
    id: 6,
    name: "Samba in Paris",
    artist: "Baco Exu do Blues (part. Gloria Groove)",
    reason: "Romance cosmopolita e fusão cultural.",
    spotify: "https://open.spotify.com/intl-pt/track/6AtYAtYAtYAtYAtY",
    lyrics: `Drinks, lingeries, Gucci
Mainha ou mon chéri
Fiz um samba em Paris
Só pra te ver dançar

Tudo você taca o foda-se
Tentam controlar você
Mas você é demais pra esses caras

Nosso amor é lindo de se ver
Meu azeite de dendê
Mais bonito que os corredores do Louvre

Ne me quitte pas, não vou mais te deixar partir`,
    meaning: "Transforma Paris em um símbolo da intensidade e sofisticação do relacionamento. Mistura referências do cotidiano brasileiro com elementos de luxo europeu, celebrando um amor moderno e sem fronteiras."
  },
  {
    id: 7,
    name: "Lisboa",
    artist: "ANAVITÓRIA (part. Lenine)",
    reason: "Desejo e proximidade.",
    spotify: "https://open.spotify.com/intl-pt/track/2RUTvhNHo2DEECnumWFG0o",
    lyrics: `Eu vejo tua cara e teu querer perverso
A gente fica bem aqui no chão da sala
Eu te queria a vida toda, te confesso
Por mim, a gente nem precisa mais da estrada

Eu vejo você longe, quero você perto
Fica na minha sombra, eu posso ser teu rastro
Não quero tu na linha, Vivo, morto ou Claro
Eu quero tu na minha boca

Diga pra mim que é real
Que eu te prometo meu melhor
Fala pra mim o que eu quero ouvir
Que tu sentiu o que eu senti`,
    meaning: "Explora o desejo de uma conexão amorosa verdadeira e presencial. A letra destaca a necessidade de proximidade física e a dor da distância, buscando um amor vivido sem reservas."
  },
  {
    id: 8,
    name: "The Summoning",
    artist: "Sleep Token",
    reason: "Desejo e espiritualidade.",
    spotify: "https://open.spotify.com/intl-pt/track/6UqSOnH7F8tX7mS7v6X8jS",
    lyrics: `I've got a river running right into you
I've got a blood trail, red in the blue
Something you say or something you do
A taste of the divine

Raise me up again
Take me past the edge
I want to see the other side

Oh, and my love
Did I mistake you for a sign from God?
Or are you really here to cast me off?
Or maybe just to turn me on`,
    meaning: "Explora a tensão entre desejo carnal e busca espiritual. Questiona se a pessoa amada representa uma experiência transcendental ou apenas uma forte tentação física, usando metáforas intensas de entrega."
  },
  {
    id: 9,
    name: "Provider",
    artist: "Sleep Token",
    reason: "Relações de poder e entrega.",
    spotify: "https://open.spotify.com/intl-pt/track/2RUTvhNHo2DEECnumWFG0o",
    lyrics: `I wanna be your provider
Garner you with silk like a spider
Roll or die, you bet, I'm a rider
Your outer shell, your secret insider

I wanna be your provider
Your guiding hand, your final decider
That bit of fuel to your fire, stoke your desire
Just let me know that you're mine`,
    meaning: "Aborda a tensão entre o desejo de proteger e a necessidade de controlar. A metáfora da aranha ilustra como o cuidado pode se transformar em possessividade, construindo um retrato íntimo de vulnerabilidade e domínio."
  },
  {
    id: 10,
    name: "Seu",
    artist: "Sant",
    reason: "O amor multifacetado e transformador.",
    spotify: "https://open.spotify.com/intl-pt/track/303J745tAnV9W0G9v0G9v0",
    lyrics: `Quero ser o Sol no céu da sua boca
Dividir lençol e te fazer garota
Tipo a primeira vez
Numa conversa boba

Quero ser seu erro, seu aluno
Quero ser seu rumo, seu atalho
Quero ser seu rei, ser o seu trono
Quero ser seu todo, seu retalho

Vamo’ fugir desse apocalipse
Vamo’ fazer dessa noite indiscutível
Cantar que o amor è ponte indestrutível
Quero ser pra sempre, ‘mermo que impossível
Seu`,
    meaning: "Coloca o amor no centro da narrativa como celebração e força vital. Revela a disposição de se adaptar e pertencer completamente ao universo da pessoa amada, vendo o amor como uma ponte sólida."
  },
  {
    id: 11,
    name: "Falei Pra Ela",
    artist: "Sant (part. Tiê)",
    reason: "Encontros e incertezas.",
    spotify: "https://open.spotify.com/intl-pt/track/7pZ0Z0Z0Z0Z0Z0Z0Z0Z0Z0",
    lyrics: `Pode ser viagem
Destino incerto
Ou será que me consertou?
Mundo tão deserto
Pode ser miragem
Ou será que é um mar de amor?

Ela é
Brisa da manhã
Vou fazer o café
Trouxe croissant
Ela me deu um chá
E eu dormi na van
Como eu cheguei em casa
Ela é um talismã`,
    meaning: "Transforma um encontro casual em uma busca por conexão verdadeira. Equilibra leveza e intimidade, sugerindo que vale a pena se arriscar para descobrir o que a vida reserva."
  },
  {
    id: 12,
    name: "Volto Logo",
    artist: "Sant (part. Malu)",
    reason: "Afeto cotidiano e saudade.",
    spotify: "https://open.spotify.com/intl-pt/track/5u0w9u0w9u0w9u0w9u0w",
    lyrics: `Assim que puder, eu te ligo
Pra avisar que cheguei bem
Pra te dizer que volto logo
Já tô com saudade também

Quem diria, né?
Nunca iria nem imaginaria
Mas sem tua companhia, nada seria
O dia a dia é o que forma a família

Um abraço apertado parece magia`,
    meaning: "Retrata a intimidade do cotidiano e como a saudade fortalece o vínculo. Mostra que pequenos gestos e a comunicação constante são essenciais para manter a proximidade, mesmo à distância."
  },
  {
    id: 13,
    name: "Procuro Alguém",
    artist: "Djonga",
    reason: "Paternidade e afeto.",
    spotify: "https://open.spotify.com/intl-pt/track/4j6C6kY6kY6kY6kY6kY6",
    lyrics: `Procuro alguém que me faça chorar de novo
Que me faça lembrar como sou imperfeito
Um relógio que faça meu tempo parar
Alguém que não repita nada do que eu tenha feito

Ioiô, sinônimo de amor

Tô por aí fazendo pontes pra quem nem conheço
Não quero que isso crie um muro entre eu e você
Eu te ensino a dar passos, me ensina a caminhar
É que se a gente não anda junto tem risco de se perder`,
    meaning: "Transforma a experiência da paternidade em uma homenagem à filha. Aborda a vulnerabilidade e o aprendizado mútuo, reconhecendo o amor como uma força que ensina a enxergar o mundo com simplicidade."
  }
];

const LETTERS_DATA = [
  { id: 1, title: "Carta que nunca enviei", content: "Algum dia ela vai ser escrita... mas saiba que cada palavra já está no meu coração." },
  { id: 2, title: "Coisas que admiro em você", content: "Sua força, seu olhar, sua forma de ver o mundo. Você é luz pura." },
  { id: 3, title: "Quando senti saudade", content: "Foi num domingo à tarde, lembrando do seu cheiro e do seu abraço." },
  { id: 4, title: "Se eu fosse corajoso", content: "Eu diria tudo o que sinto em voz alta, sem gaguejar." },
];

const QUIZ_QUESTIONS = [
  { q: "Quem demora mais para responder?", options: ["Eu", "Você", "Empate técnico"], correct: 2 },
  { q: "Quem é mais teimoso?", options: ["Eu", "Você", "Impossível decidir"], correct: 1 },
  { q: "Quem surtaria primeiro num apocalipse?", options: ["Eu", "Você", "Nós dois rindo"], correct: 0 },
  { q: "Onde seria nossa viagem ideal?", options: ["Praia deserta", "Montanha nevada", "Cidade histórica"], correct: 0 },
];

const FUTURE_CARDS = [
  { title: "Viagem Juntos", desc: "Explorar o mundo de mãos dadas.", icon: <Compass />, color: "rose" },
  { title: "Cozinhar Juntos", desc: "Derrubar farinha e rir do desastre.", icon: <Coffee />, color: "purple" },
  { title: "Assistir Chuva", desc: "No sofá, cobertos, apenas nós.", icon: <Sparkles />, color: "blue" },
  { title: "Envelhecer Rindo", desc: "Contando as mesmas histórias bobas.", icon: <Heart />, color: "emerald" },
];

const SHARED_GAMES = [
  { title: "Minecraft", desc: "Construindo castelos e memórias bloco a bloco.", image: "https://images.unsplash.com/photo-1605339396515-418590c446a9?q=80&w=2069&auto=format&fit=crop" },
  { title: "It Takes Two", desc: "A colaboração perfeita em forma de jogo.", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2071&auto=format&fit=crop" },
  { title: "Stardew Valley", desc: "Nossa fazenda, nosso ritmo, nosso mundo.", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" },
  { title: "Valorant", desc: "Adrenalina pura, mas sempre do mesmo lado.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" },
];

const GAMES_DATA = [
  { id: 'tic-tac-toe', title: "Duelo de Afetos", desc: "O clássico Jogo da Velha, reinventado com amor.", icon: <Gamepad2 /> },
  { id: 'quiz', title: "Quiz de Sincronia", desc: "Quanto você realmente sabe sobre nós?", icon: <Sparkles /> },
];

// --- Components ---
const TimelineItem = ({ item, index, isLast }: { item: any, index: number, isLast: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className={`relative flex items-center justify-between mb-24 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
  >
    <div className={`w-[45%] ${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
      <span className="text-[var(--primary)] font-mono text-xs uppercase tracking-[0.4em] mb-4 block">{item.date}</span>
      <h3 className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-tight leading-tight">{item.title}</h3>
      <p className="text-white/40 font-serif italic text-xl leading-relaxed">{item.desc}</p>
    </div>

    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center h-full">
      <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white shadow-[0_0_30px_var(--primary-glow)] z-10 p-4">
        {item.icon}
      </div>
      {!isLast && (
        <div className="w-[2px] grow bg-gradient-to-b from-[var(--primary)] to-transparent mt-4" />
      )}
    </div>

    <div className="w-[45%]" />
  </motion.div>
);

const HistoryHero = () => (
  <div className="mb-24 text-center max-w-4xl mx-auto">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-24 h-24 bg-[var(--primary)]/10 rounded-[2.5rem] flex items-center justify-center text-[var(--primary)] mx-auto mb-10 border border-[var(--primary)]/20"
    >
      <Calendar size={32} />
    </motion.div>
    <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter mb-8 leading-tight">
      Nossa <span className="text-[var(--primary)] italic font-light">Eterna</span> Estrada.
    </h1>
    <p className="text-white/40 font-serif italic text-2xl leading-relaxed max-w-2xl mx-auto text-glow-luxury">
      Cada quilômetro percorrido, cada pôr do sol compartilhado e cada desafio superado. Esta é a cronologia do nosso amor.
    </p>
    <div className="mt-12 flex justify-center gap-12">
      <div className="text-center">
        <p className="text-white font-serif text-3xl italic tracking-tighter">500+</p>
        <p className="text-[var(--primary)] opacity-60 font-mono text-[8px] uppercase tracking-widest mt-1">Dias de Sorrisos</p>
      </div>
      <div className="w-[1px] h-12 bg-white/10" />
      <div className="text-center">
        <p className="text-white font-serif text-3xl italic tracking-tighter">∞</p>
        <p className="text-[var(--primary)] opacity-60 font-mono text-[8px] uppercase tracking-widest mt-1">Planos Futuros</p>
      </div>
    </div>
  </div>
);

const GalleryHero = () => (
  <div className="mb-24 text-left border-l-4 border-[var(--primary)] pl-12 py-4">
    <div className="flex items-center gap-4 mb-6">
      <span className="w-12 h-[1px] bg-[var(--primary)]/30" />
      <span className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-[0.8em]">Arquivo do Coração</span>
    </div>
    <h1 className="text-7xl md:text-9xl font-serif text-white tracking-tighter leading-none mb-10">
      Memórias <br/><span className="text-[var(--primary)] italic font-light">Estáticas</span>.
    </h1>
    <p className="text-white/30 font-serif italic text-2xl max-w-xl leading-snug">
      Onde o tempo resolveu parar para nos contemplar. Uma galeria de instantes que nunca perderão o brilho.
    </p>
  </div>
);



const AlbumsHero = () => {
  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden rounded-[3.5rem] mb-20 shadow-2xl">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1505300602322-934335436667?w=1600" 
          alt="Albums Hero" 
          className="w-full h-full object-cover grayscale-[0.5] opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>
      
      <div className="relative z-10 text-center px-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="glass-card px-8 py-3 rounded-full inline-block border border-white/20 mb-8"
        >
          <span className="text-white font-mono text-[10px] uppercase tracking-[0.5em]">Curadoria de Afeto</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif text-white tracking-tighter"
        >
          Nossos <span className="text-rose-500 italic">Álbuns</span>
        </motion.h1>
      </div>
    </div>
  );
};

const AlbumDetailView = ({ album, onBack, onAddPhoto }: { album: Album, onBack: () => void, onAddPhoto: (url: string) => void }) => {
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newPhotoUrl.trim()) {
      onAddPhoto(newPhotoUrl);
      setNewPhotoUrl('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar aos Álbuns
      </button>

      <div className="flex flex-col md:flex-row gap-12 mb-20 items-center md:items-start">
        <div className="w-64 h-84 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 shrink-0 transform -rotate-3 transition-transform hover:rotate-0">
          <img src={album.cover} className="w-full h-full object-cover" alt={album.title} />
        </div>
        <div className="text-center md:text-left pt-6">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 underline decoration-[var(--primary)]/30 underline-offset-8">{album.title}</h2>
          <p className="text-white/40 font-serif italic text-xl max-w-xl mb-10 leading-relaxed text-glow-luxury">{album.desc}</p>
          
          <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto md:mx-0">
             <input 
               type="text" 
               placeholder="Link da imagem..." 
               value={newPhotoUrl}
               onChange={(e) => setNewPhotoUrl(e.target.value)}
               className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[var(--primary)] transition-all"
             />
             <button 
               type="submit"
               className="bg-[var(--primary)] p-4 rounded-2xl text-white hover:opacity-80 transition-all shadow-xl shadow-[var(--primary-glow)]"
             >
               <Plus size={24} />
             </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {album.photos.map((url, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="aspect-square rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl group relative"
          >
            <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt="Memory" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
               <Sparkles className="text-white/40" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
const GallerySection = ({ title, desc, items }: { title: string, desc: string, items: typeof GALLERY_DATA }) => {
  return (
    <div className="mb-32">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="text-left">
          <h3 className="text-4xl font-serif text-white mb-2">{title}</h3>
          <p className="text-white/40 font-serif italic text-lg">{desc}</p>
        </div>
        <div className="h-[1px] flex-1 bg-white/5 mx-12 hidden md:block" />
        <span className="text-[var(--primary)] opacity-60 font-mono text-[10px] uppercase tracking-[0.4em]">{items.length} Memórias</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative group aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 luxury-card"
          >
            <img 
              src={item.url} 
              alt={item.caption}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col justify-end text-left translate-y-4 group-hover:translate-y-0 transition-all duration-700">
              <p className="text-2xl font-serif text-white leading-tight mb-4 group-hover:text-glow transition-all">{item.caption}</p>
              <div className="w-12 h-1 bg-[var(--primary)] group-hover:w-full transition-all duration-1000" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const TreeItem = ({ item, index, isLast }: { item: any, index: number, isLast: boolean, key?: any }) => (
  <TimelineItem item={item} index={index} isLast={isLast} />
);

const PixelHeartLoader = () => {
  const pixels = [
    // Row 1
    null, null, 'pink', 'pink', 'pink', null, null, null, 'pink', 'pink', 'pink', null, null,
    // Row 2
    null, 'pink', 'pink', 'pink', 'pink', 'pink', null, 'pink', 'pink', 'pink', 'pink', 'pink', null,
    // Row 3
    null, 'pink', 'soft-pink', 'soft-pink', 'soft-pink', 'pink', null, 'pink', 'soft-pink', 'soft-pink', 'soft-pink', 'pink', null,
    // Row 4
    null, 'pink', 'soft-pink', 'soft-pink', 'white', 'white', 'soft-pink', 'pink', 'soft-pink', 'white', 'white', 'soft-pink', 'soft-pink',
    // Row 5
    'pink', 'pink', 'soft-pink', 'white', 'white', 'white', 'white', 'soft-pink', 'white', 'white', 'white', 'white', 'soft-pink',
    // Row 6
    'pink', 'pink', 'soft-pink', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'soft-pink',
    // Row 7
    null, 'pink', 'soft-pink', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'soft-pink', 'pink', null,
    // Row 8
    null, null, 'pink', 'soft-pink', 'white', 'white', 'white', 'white', 'white', 'soft-pink', 'pink', null, null,
    // Row 9
    null, null, null, 'pink', 'soft-pink', 'white', 'white', 'white', 'soft-pink', 'pink', null, null, null,
    // Row 10
    null, null, null, null, 'pink', 'soft-pink', 'white', 'soft-pink', 'pink', null, null, null, null,
    // Row 11
    null, null, null, null, null, 'pink', 'soft-pink', 'pink', null, null, null, null, null,
  ];

  return (
    <div className="inline-grid grid-cols-[repeat(13,10px)] grid-rows-[repeat(11,10px)] md:grid-cols-[repeat(13,15px)] md:grid-rows-[repeat(11,15px)] gap-px p-5 animate-[heartbeat_2s_infinite_ease-in-out]">
      {pixels.map((type, i) => (
        <div
          key={i}
          className={`w-full h-full transition-all duration-300 ${
            type === 'pink' ? 'animate-[pinkPulse_2.5s_infinite_ease-in-out]' :
            type === 'soft-pink' ? 'animate-[softPinkPulse_2.2s_infinite_ease-in-out]' :
            type === 'white' ? 'animate-[whitePulse_2.8s_infinite_ease-in-out]' :
            'bg-transparent'
          }`}
        />
      ))}
    </div>
  );
};

const YouPedidoIcon = ({ size = 64, className = "" }: { size?: number, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    {/* Galactic Aura */}
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.3, 0.1]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-rose-500 blur-[40px] rounded-full" 
      style={{ width: size * 1.8, height: size * 1.8 }} 
    />
    
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10"
    >
      {/* Background Glow */}
      <circle cx="50" cy="50" r="45" fill="black" fillOpacity="0.8" />
      
      {/* Outer Orbit */}
      <motion.circle 
        cx="50" cy="50" r="44" 
        stroke="white" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 8"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Main Heart */}
      <motion.path 
        d="M50 78L45.4 73.8C29 59.2 18.2 49.6 18.2 37.8C18.2 28.2 25.8 20.6 35.4 20.6C40.8 20.6 46 23.2 50 27.3C54 23.2 59.2 20.6 64.6 20.6C74.2 20.6 81.8 28.2 81.8 37.8C81.8 49.6 71 59.2 54.6 73.8L50 78Z" 
        fill="url(#iconGradient)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="filter drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]"
      />
      
      {/* Digital Circuit Lines within Heart */}
      <motion.g 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        stroke="white" strokeWidth="0.8" strokeLinecap="round"
      >
        <path d="M35 35h30" />
        <path d="M40 45h20" />
        <path d="M48 30v40" />
        <circle cx="50" cy="30" r="1.5" fill="white" />
        <circle cx="50" cy="70" r="1.5" fill="white" />
      </motion.g>
      
      {/* Galactic Stars */}
      {[...Array(8)].map((_, i) => (
        <motion.circle 
          key={i}
          cx={20 + Math.random() * 60} 
          cy={20 + Math.random() * 50} 
          r={0.6 + Math.random() * 0.4} 
          fill="white" 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}
      
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#7c3aed" /> 
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const LoginPage = ({ onLogin, loading }: { onLogin: () => void, loading: boolean }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Preencha e-mail e senha.');
      return;
    }
    setAuthLoading(true);
    setErrorMsg('');
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      let msg = err.message;
      if (err.code === 'auth/invalid-credential') msg = 'Credenciais inválidas.';
      else if (err.code === 'auth/email-already-in-use') msg = 'E-mail já está em uso.';
      else if (err.code === 'auth/weak-password') msg = 'A senha deve ter pelo menos 6 caracteres.';
      setErrorMsg(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-[var(--bg)] overflow-hidden items-center justify-center font-sans">
      {/* Background Noise & Lighting */}
      <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[var(--primary)]/10 rounded-[100%] mix-blend-screen filter blur-[150px] pointer-events-none animate-pulse hidden md:block" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-rose-500/10 rounded-[100%] mix-blend-screen filter blur-[150px] pointer-events-none hidden md:block" />
      
      {/* Aesthetic Background Typography */}
      <div className="absolute left-[10%] top-[20%] text-white/[0.02] font-editorial text-[20vw] leading-none select-none z-0 rotate-12 pointer-events-none italic">
         Amor
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between p-6 sm:p-12 gap-12 lg:gap-24 h-full md:h-auto md:min-h-0">
        
        {/* Left Side: Elegant Presentation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full flex flex-col justify-center items-center lg:items-start text-center lg:text-left mt-12 lg:mt-0 relative"
        >
          <div className="relative w-full max-w-[320px] lg:max-w-md aspect-[4/5] rounded-[3rem] overflow-hidden group shadow-2xl mx-auto lg:mx-0">
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
            <motion.video 
              autoPlay
              loop
              muted
              playsInline
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              src="https://videos.pexels.com/video-files/3192257/3192257-hd_1920_1080_25fps.mp4" 
              className="w-full h-full object-cover grayscale brightness-90 contrast-125 mix-blend-luminosity transform origin-center pointer-events-none"
            />
            {/* Content over image */}
            <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 z-20 pr-6">
              <Heart size={32} className="text-[var(--primary)] mb-4 lg:mb-6 animate-pulse drop-shadow-[0_0_15px_var(--primary-glow)]" fill="currentColor" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tighter leading-[0.9] mb-4 drop-shadow-xl italic">
                Início <br /> Eterno.
              </h1>
              <p className="text-white/60 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest max-w-[200px] leading-relaxed drop-shadow-md">
                Para além do tempo, nossa jornada floresce.
              </p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-6 right-6 z-20">
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-[0.5em] rotate-90 origin-right block">SYS_INIT</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Professional Login Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="w-full max-w-[400px] pb-12 lg:pb-0 perspective-1000"
        >
          {/* Card Wrapper */}
          <div className="relative group">
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--primary)]/20 to-white/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {/* Main Card */}
            <div className="relative bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-hidden">
              {/* Internal subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col">
                <div className="mb-8 text-center flex flex-col items-center">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/10">
                      <Lock size={24} className="text-white/60" />
                   </div>
                   <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2 tracking-tight">Acesso Portal</h2>
                   <p className="text-white/40 text-[9px] font-mono uppercase tracking-widest">
                     {isRegister ? 'Criar nova conexão' : 'Bem-vindo de volta'}
                   </p>
                </div>

                <div className="w-full space-y-5">
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                     <div className="space-y-2">
                        <label htmlFor="emailInput" className="text-white/40 font-mono text-[9px] uppercase tracking-widest ml-2 block">Identificação (E-mail)</label>
                        <input
                           id="emailInput"
                           type="email"
                           value={email}
                           onChange={e => setEmail(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white/80 text-xs font-mono tracking-wider shadow-inner outline-none focus:border-[var(--primary)]/50 transition-colors"
                           placeholder="jornada@amor.com"
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <label htmlFor="passwordInput" className="text-white/40 font-mono text-[9px] uppercase tracking-widest ml-2 block">Chave de Acesso (Senha)</label>
                        <input
                           id="passwordInput"
                           type="password"
                           value={password}
                           onChange={e => setPassword(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white/80 text-xs font-mono tracking-wider shadow-inner outline-none focus:border-[var(--primary)]/50 transition-colors"
                           placeholder="••••••••"
                           required
                        />
                     </div>
                     
                     {errorMsg && (
                       <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-400 text-[10px] uppercase font-mono tracking-wider text-center mt-2">
                         {errorMsg}
                       </motion.p>
                     )}

                     <button 
                       type="submit"
                       disabled={authLoading}
                       className="w-full bg-white/10 hover:bg-white/20 text-white active:scale-[0.98] transition-all rounded-2xl py-3.5 px-6 font-medium text-xs font-mono uppercase tracking-widest relative overflow-hidden flex items-center justify-center gap-3 mt-4"
                     >
                        {authLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isRegister ? 'Registrar-se' : 'Entrar com Senha'}
                     </button>
                  </form>

                  <div className="flex items-center gap-4 py-2 opacity-40">
                     <div className="h-px bg-white/20 flex-1" />
                     <span className="text-white/80 text-[10px] font-mono lowercase tracking-wider">ou</span>
                     <div className="h-px bg-white/20 flex-1" />
                  </div>

                  {/* Google Login Button */}
                  <button 
                    onClick={onLogin}
                    disabled={loading || authLoading}
                    className="w-full bg-gradient-to-r from-[var(--primary)] to-rose-400 text-white hover:brightness-110 active:scale-[0.98] transition-all rounded-2xl py-3.5 px-6 font-medium text-xs font-mono uppercase tracking-widest relative overflow-hidden shadow-[0_0_20px_var(--primary-glow)] flex items-center justify-center gap-3 group"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <div className="relative flex items-center gap-3">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Conectando...</span>
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" className="w-5 h-5 bg-white rounded-full p-1 shadow-lg" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          <span>Sintonizar via Google</span>
                        </>
                      )}
                    </div>
                  </button>

                  <div className="text-center mt-6 pt-2">
                     <button 
                       onClick={() => setIsRegister(!isRegister)}
                       className="text-white/40 hover:text-white transition-colors text-[9px] font-mono tracking-widest uppercase border-b border-transparent hover:border-white/40 pb-1"
                     >
                        {isRegister ? 'Já possuo uma chave (Login)' : 'Criar nova chave de acesso (Registrar)'}
                     </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Soft shadow under card */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/40 blur-xl rounded-[100%]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
const UserMenu = ({ 
  user, 
  onLogout, 
  onNavigate,
  onEditProfile,
  onShowNotifications
}: { 
  user: User | null, 
  onLogin: () => void, 
  onLogout: () => void, 
  onNavigate: (v: View) => void,
  onEditProfile: () => void,
  onShowNotifications: () => void
}) => {
  return (
    <div className="relative">
      {user ? (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('perfil')}
          className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pr-5 pl-1 py-1 transition-all group shadow-xl"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[var(--primary)] transition-colors">
            <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt={user.displayName || ''} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-start pr-2">
            <span className="text-white/80 font-mono text-[9px] uppercase tracking-widest font-bold group-hover:text-white transition-colors leading-none mb-1">
              {user.displayName?.split(' ')[0] || 'Usuário'}
            </span>
            <span className="text-white/20 font-mono text-[7px] uppercase tracking-tight leading-none italic">Explorador</span>
          </div>
        </motion.button>
      ) : (
        <button 
          onClick={() => onNavigate('login')}
          className="flex items-center gap-4 bg-white text-black hover:bg-[var(--primary)] hover:text-white px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] transition-all shadow-2xl"
        >
          <UserIcon size={14} /> Acessar Portal
        </button>
      )}
    </div>
  );
};
export const PageLayout = ({ children, title, subtitle, description, onNavigate, currentView }: { children: React.ReactNode, title?: string, subtitle?: string, description?: string, onNavigate?: (v: any) => void, currentView?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-7xl px-4 sm:px-8 py-20 sm:py-24 mx-auto min-h-[100dvh]"
    >
      {onNavigate && currentView && (
        <div className="mb-14">
          <Breadcrumbs currentView={currentView} onNavigate={onNavigate} />
        </div>
      )}
      {(title || subtitle || description) && (
        <div className="mb-20 space-y-6 relative">
          {subtitle && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-[1px] bg-gradient-to-r from-[var(--primary)] to-transparent" />
              <span className="text-[11px] font-sans font-medium text-[var(--primary)] uppercase tracking-[0.4em] drop-shadow-md">{subtitle}</span>
            </motion.div>
          )}
          {title && (
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-editorial italic text-white leading-[1.1] text-glow-premium drop-shadow-2xl">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-white/60 font-sans text-xl md:text-2xl max-w-3xl leading-relaxed mt-10 font-light drop-shadow-lg">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="relative z-20">
        {children}
      </div>
    </motion.div>
  );
};



const MathematicalHeart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let i = 0;
    const scale = 12;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 20;

    const heartX = (k: number) => 15 * Math.pow(Math.sin(k), 3);
    const heartY = (k: number) => -(12 * Math.cos(k) - 5 * Math.cos(2 * k) - 2 * Math.cos(3 * k) - Math.cos(4 * k));

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#f43f5e';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 15;
    ctx.shadowColor = ctx.strokeStyle;

    const draw = () => {
      if (i > 2 * Math.PI) {
        // Pulse sequence on completion
        return;
      }

      ctx.beginPath();
      const prevX = centerX + heartX(i - 0.05) * scale;
      const prevY = centerY + heartY(i - 0.05) * scale;
      const x = centerX + heartX(i) * scale;
      const y = centerY + heartY(i) * scale;
      
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();

      i += 0.04;
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className="max-w-full h-auto drop-shadow-[0_0_20px_rgba(255,105,180,0.6)]"
      />
    </div>
  );
};

interface MusicTrack {
  id: number | string;
  name: string;
  artist: string;
  reason: string;
  spotify: string;
  lyrics: string;
}

interface MusicTrackCardProps {
  track: MusicTrack;
  index: number;
  key?: any;
}

const VinylRecord = ({ size = 128, className = "" }: { size?: number, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg width={size} height={size} viewBox="0 0 128 128" className="duration-500 border-4 rounded-full shadow-2xl border-white/5 border-spacing-5 animate-[spin_8s_linear_infinite] transition-all">
      <rect width={128} height={128} fill="#050202" />
      <circle cx={20} cy={20} r={2} fill="white" opacity="0.3" />
      <circle cx={40} cy={30} r={2} fill="white" opacity="0.3" />
      <circle cx={60} cy={10} r={2} fill="white" opacity="0.3" />
      <circle cx={80} cy={40} r={2} fill="white" opacity="0.3" />
      <circle cx={100} cy={20} r={2} fill="white" opacity="0.3" />
      <circle cx={120} cy={50} r={2} fill="white" opacity="0.3" />
      <circle cx={90} cy={30} r={10} fill="white" fillOpacity="0.1" />
      <circle cx={90} cy={30} r={8} fill="white" opacity="0.2" />
      <path d="M0 128 Q32 64 64 128 T128 128" fill="var(--primary)" fillOpacity="0.1" stroke="black" strokeWidth={1} />
      <path d="M0 128 Q32 48 64 128 T128 128" fill="var(--primary-light)" fillOpacity="0.05" stroke="black" strokeWidth={1} />
      <path d="M0 128 Q32 32 64 128 T128 128" fill="var(--primary)" fillOpacity="0.08" stroke="black" strokeWidth={1} />
    </svg>
    <div className="absolute z-10 w-1/4 h-1/4 bg-white border-4 rounded-full shadow-sm border-white/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
  </div>
);

const MusicTrackCard = ({ track, index }: MusicTrackCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col items-center group/he select-none w-full max-w-4xl mx-auto mb-20">
      {/* Vinyl Record that slides down */}
      <div className="relative z-0 h-44 -mb-10 transition-all duration-700 ease-[0.16, 1, 0.3, 1] group-hover/he:h-0 group-hover/he:-mb-24 opacity-100 group-hover/he:opacity-0">
        <VinylRecord size={180} />
      </div>

      {/* Main Card */}
      <div className="z-30 flex flex-col w-full min-h-[160px] transition-all duration-700 ease-[0.16, 1, 0.3, 1] luxury-glass border border-white/5 rounded-[3rem] shadow-3xl group-hover/he:min-h-[450px] overflow-hidden p-8 md:p-12 relative">
        <div className="flex flex-col md:flex-row w-full gap-8 md:gap-12">
          {/* Mini Record on Hover */}
          <div className="relative flex items-center justify-center w-32 h-32 md:w-48 md:h-48 group-hover/he:-mt-16 group-hover/he:-ml-16 opacity-0 group-hover/he:opacity-100 transition-all duration-700 ease-out shrink-0">
             <VinylRecord size={160} />
          </div>

          <div className="flex flex-col justify-center flex-1 -ml-0 md:group-hover/he:-ml-12 transition-all duration-700 delay-100">
            <div className="flex items-center gap-4 mb-4">
               <span className="text-[var(--primary)] font-mono text-xs opacity-50">#0{index + 1}</span>
               <div className="h-px flex-1 bg-white/5" />
            </div>
            <h4 className="text-4xl md:text-6xl font-editorial italic text-white group-hover:text-[var(--primary)] transition-colors duration-500">{track.name}</h4>
            <p className="text-[var(--text-muted)] font-mono text-xs uppercase tracking-[0.4em] mt-2 opacity-60">{track.artist}</p>
            
            {/* Extended content on hover */}
            <div className="opacity-0 group-hover/he:opacity-100 transition-opacity duration-700 delay-300 mt-8 space-y-6">
               <p className="text-white/40 italic font-serif text-xl leading-relaxed">
                 "{track.reason}"
               </p>
               <div className="h-px w-24 bg-[var(--primary)]/30" />
               <div className="max-h-40 overflow-y-auto custom-scrollbar pr-4">
                  <p className="text-white/20 text-sm whitespace-pre-line font-mono leading-loose tracking-tight">
                    {track.lyrics}
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Player Controls - Only visible/expanded on hover */}
        <div className="mt-12 space-y-8 opacity-0 group-hover/he:opacity-100 transition-opacity duration-1000 delay-500">
          {/* Progress Bar */}
          <div className="flex flex-row items-center gap-6">
            <span className="text-[10px] text-white/20 font-mono">0:00</span>
            <input 
              type="range" 
              min={0} 
              max={100} 
              defaultValue={45} 
              className="flex-grow h-[2px] bg-white/10 rounded-full appearance-none accent-[var(--primary)] cursor-pointer" 
            />
            <span className="text-[10px] text-white/20 font-mono">3:45</span>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-10">
              <button className="text-white/20 hover:text-[var(--primary)] transition-colors">
                <Music size={18} />
              </button>
              <button className="text-white/20 hover:text-white transition-colors">
                <SkipBack size={24} />
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20 hover:scale-110 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>

              <button className="text-white/20 hover:text-white transition-colors">
                <SkipForward size={24} />
              </button>
            </div>

            <div className="flex items-center gap-6">
               <motion.a
                  href={track.spotify}
                  target="_blank"
                  rel="no-referrer"
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-3 bg-[#1DB954]/10 border border-[#1DB954]/20 text-[#1DB954] rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-3"
               >
                  <Play size={12} fill="currentColor" /> Spotify
               </motion.a>
               <button className="text-white/20 hover:text-white transition-colors">
                 <List size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Shadow/Background behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-[var(--primary)]/5 blur-[120px] -z-10 rounded-full opacity-0 group-hover/he:opacity-100 transition-opacity duration-1000" />
    </div>
  );
};


const NotificationsDropdown = ({ notifications, onClose, onMarkAsRead }: { notifications: any[], onClose: () => void, onMarkAsRead: (id: string) => void }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute top-[3.5rem] right-0 z-[110] w-[calc(100vw-2rem)] md:w-[380px] flex flex-col font-sans origin-top-right"
    >
      <div className="bg-neutral-900/95 border border-white/10 backdrop-blur-3xl rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.05] before:to-transparent before:pointer-events-none">
        
        <div className="relative z-10 p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h3 className="text-[15px] font-medium tracking-tight text-white flex items-center gap-2">
              <Bell size={16} className="text-[var(--primary)]" />
              Notificações
            </h3>
            {unreadCount > 0 && (
              <p className="text-[10px] font-mono text-[var(--primary)] uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                {unreadCount} Novas interações
              </p>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/20 transition-all">
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[50vh] custom-scrollbar bg-black/20 p-2 relative z-10">
          {notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-white/30">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <CheckCircle2 size={20} className="opacity-40" />
              </div>
              <p className="font-medium text-sm text-white/50">Você está em dia</p>
              <p className="text-xs mt-1 text-white/30">Nenhuma notificação no momento</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).map((n) => (
                <div 
                  key={n.id}
                  onClick={() => onMarkAsRead(n.id)}
                  className={`group relative p-3.5 rounded-2xl transition-all cursor-pointer flex gap-4 ${
                    n.read 
                    ? 'hover:bg-white/5 text-white/50' 
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {!n.read && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-6 bg-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)] rounded-r-full" />
                  )}
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    n.read ? 'bg-white/5 text-white/30' : 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  }`}>
                    {n.type === 'photo' ? <ImageIcon size={16} /> :
                     n.type === 'letter' ? <MessageCircle size={16} /> :
                     n.type === 'game' ? <Target size={16} /> :
                     <Bell size={16} />}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className={`text-sm mb-0.5 truncate ${!n.read ? 'font-medium text-white' : 'font-normal text-white/70'}`}>{n.title}</p>
                    <p className="text-xs opacity-60 line-clamp-2 leading-relaxed">{n.message}</p>
                    {n.createdAt && (
                      <p className="text-[10px] opacity-40 mt-2.5 flex items-center gap-1.5">
                        <Clock size={10} />
                        {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Agora'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="relative z-10 p-3 border-t border-white/10 bg-white/[0.02]">
            <button 
              className="w-full py-3 rounded-xl text-xs text-white/70 hover:text-white font-medium transition-all hover:bg-white/10 flex items-center justify-center gap-2"
              onClick={() => {
                notifications.forEach(n => !n.read && onMarkAsRead(n.id));
              }}
            >
              <CheckCircle2 size={14} /> Marcar todas como lidas
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

import { useMusic } from './contexts/MusicContext';

function AppInternal() {
  const { isPlaying: isGlobalMusicPlaying } = useMusic();
  const [view, setViewInternal] = useState<View>('login');
  const [showWizard, setShowWizard] = useState(false);

  const [invitedProposal, setInvitedProposal] = useState<SetupData | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteId = params.get('invite');
    if (inviteId) {
      import('./lib/firebase').then(({ db }) => {
        import('firebase/firestore').then(({ doc, getDoc }) => {
          getDoc(doc(db, 'proposals', inviteId)).then((snap) => {
            if (snap.exists()) {
              const data = snap.data();
              if (data.settings) {
                setInvitedProposal(data.settings as SetupData);
                setThemeMode(data.settings.theme || 'luxury_classic');
                setView('custom_proposal' as any);
              }
            }
          });
        });
      });
    }
  }, []);

  const setView = useCallback((newView: View | 'custom_proposal') => {
    audioManager.playSound('click');
    setViewInternal(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [universeData, setUniverseData] = useState<any>(null);
  const [isUniverseLoading, setIsUniverseLoading] = useState(true);
  const [partnerUid, setPartnerUid] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode');
    return (saved && THEMES[saved as ThemeMode]) ? (saved as ThemeMode) : 'luxury_classic';
  });
  const [layoutMode, setLayoutMode] = useState<LayoutType>(() => {
    const saved = localStorage.getItem('layoutMode');
    return (saved as LayoutType) || 'auto';
  });
  const [proposalMode, setProposalMode] = useState<any>(() => {
    const saved = localStorage.getItem('proposalMode');
    return (saved as any) || 'auto';
  });
  const [experienceMode, setExperienceMode] = useState<'light' | 'immersive' | 'cinematic'>(() => {
    const saved = localStorage.getItem('experienceMode');
    return (saved as any) || 'immersive';
  });

  useEffect(() => {
    if (user) {
      getPartnerUid(user.uid).then(uid => setPartnerUid(uid));
    } else {
      setPartnerUid(null);
    }
  }, [user]);

  const { addToast } = useToast();

  const addMusicTrack = async (music: any) => {
    await addItem('playlist', music);
    if (user) {
      const partnerUid = await getPartnerUid(user.uid);
      if (partnerUid) {
        await sendNotification(
          partnerUid,
          "Nova música na nossa playlist! 🎵",
          `${user.displayName || 'Seu amor'} adicionou "${music.name}" à nossa trilha sonora.`,
          'info'
        );
      }
    }
    addToast('Música adicionada com sucesso!', 'love');
  };

  const handleDeleteMusic = async (trackId: string) => {
    try {
      await deleteItem('playlist', trackId);
      addToast('Música removida da playlist.', 'success');
    } catch (error) {
      addToast('Erro ao remover música. Apenas o autor pode excluí-la.', 'error');
    }
  };

  const handleToggleFavoriteMusic = async (trackId: string, currentlyLiked: boolean) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'playlist', trackId), {
        likedBy: currentlyLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
      addToast(currentlyLiked ? 'Removido dos favoritos' : 'Adicionado aos favoritos', 'info');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteLetter = async (letterId: string | number) => {
    try {
      await deleteItem('letters', String(letterId));
      addToast('Carta apagada com sucesso.', 'success');
    } catch (error) {
      addToast('Erro ao apagar carta. Apenas o autor pode excluí-la.', 'error');
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    try {
      await deleteItem('sharedGames', gameId);
      addToast('Jogo removido da nossa biblioteca.', 'success');
    } catch (error) {
      addToast('Erro ao remover jogo.', 'error');
    }
  };

  const handleDeleteMoment = async (momentId: string) => {
    try {
      await deleteItem('gallery', momentId);
      addToast('Lembrança apagada do universo.', 'success');
    } catch (error) {
      addToast('Erro ao apagar lembrança.', 'error');
    }
  };

  const addSharedGame = async (game: { title: string, desc: string, image: string }) => {
    await addItem('sharedGames', game);
    addToast('Nova memória desbloqueada', 'unlock');
    if (user) {
      const partnerUid = await getPartnerUid(user.uid);
      if (partnerUid) {
        await sendNotification(
          partnerUid,
          "Novo universo desbloqueado! 🎮",
          `${user.displayName || 'Seu amor'} adicionou um novo jogo para jogarmos: ${game.title}.`,
          'game'
        );
      }
    }
  };

  const addGalleryPhoto = async (photo: any) => {
    await addItem('gallery', photo);
    addToast('Um novo momento foi guardado', 'love');
    if (user) {
      const partnerUid = await getPartnerUid(user.uid);
      if (partnerUid) {
        await sendNotification(
          partnerUid,
          "Nova Foto na Galeria! 📸",
          `${user.displayName || 'Seu amor'} acabou de adicionar uma nova lembrança.`,
          'photo'
        );
      }
    }
  };

  const addPhotoToAlbum = async (albumId: string | number, photoUrl: string) => {
    const album = albums.find(a => a.id === albumId);
    if (album && typeof albumId === 'string') {
      await updateDoc(doc(db, 'albums', albumId), {
        photos: [...(album.photos || []), photoUrl]
      });

      if (user) {
        const partnerUid = await getPartnerUid(user.uid);
        if (partnerUid) {
          await sendNotification(
            partnerUid,
            "Nova foto no álbum! 📖",
            `${user.displayName || 'Seu amor'} adicionou uma nova lembrança no álbum "${album.title}".`,
            'photo'
          );
        }
      }
    } else {
      // For static/local albums, fallback to local state if needed (though we want to migrate all)
      setAlbums(albums.map(a => 
        a.id === albumId ? { ...a, photos: [...a.photos, photoUrl] } : a
      ));
    }
  };

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    localStorage.setItem('themeCategory', THEMES[themeMode]?.category || 'romance');
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { themeMode, category: THEMES[themeMode]?.category || 'romance' } }));
    if (user) {
      updateUserSettings(user.uid, { themeMode });
    }
  }, [themeMode, user]);

  useEffect(() => {
    localStorage.setItem('layoutMode', layoutMode);
    document.documentElement.setAttribute('data-layout', layoutMode);
    document.body.setAttribute('data-layout', layoutMode);
    window.dispatchEvent(new CustomEvent('layoutChanged', { detail: layoutMode }));
  }, [layoutMode]);

  useEffect(() => {
    // Navigation sound feedback
    if (view !== 'login') {
      audioManager.playSound('click');
    }
  }, [view]);

  useEffect(() => {
    // Activate audio context and ambience on first interaction
    const handleFirstInteraction = () => {
      const settings = audioManager.getSettings();
      if (settings.enabled) {
        audioManager.playAmbience(settings.theme);
      }
      window.removeEventListener('mousedown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    
    window.addEventListener('mousedown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    
    return () => {
      window.removeEventListener('mousedown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);



  useEffect(() => {
    // React to global music player state to avoid overlapping audio
    if (isGlobalMusicPlaying) {
      audioManager.stopAmbience();
    } else {
      const settings = audioManager.getSettings();
      if (settings.enabled) {
        audioManager.playAmbience(settings.theme);
      }
    }
  }, [isGlobalMusicPlaying]);

  useEffect(() => {
    const root = document.documentElement;
    let theme = THEMES[themeMode] || THEMES.luxury_classic;
    
    // Check if we have Custom/AI Theme Config overriding the base preset
    const themeConfig = universeData?.settings?.themeConfig;
    let activeDataTheme = themeMode;
    
    if (themeConfig && typeof themeConfig === 'object') {
      if (themeConfig.type === 'preset' && themeConfig.presetKey) {
         activeDataTheme = themeConfig.presetKey as ThemeMode;
         theme = THEMES[activeDataTheme] || THEMES.luxury_classic;
      }
    }
    
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-gradient', theme.primaryGradient || theme.primary);
    root.style.setProperty('--primary-light', theme.primaryLight);
    root.style.setProperty('--primary-glow', theme.primaryGlow);
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--bg-alt', theme.bgAlt);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--glass', theme.glass);
    root.style.setProperty('--accent', theme.accent);
    
    // Override with custom colors if custom or AI
    if (themeConfig && (themeConfig.type === 'custom' || themeConfig.type === 'ai')) {
      const colors = themeConfig.customColors;
      if (colors?.primary) root.style.setProperty('--primary', colors.primary);
      if (colors?.bg) root.style.setProperty('--bg', colors.bg);
      if (colors?.bgAlt) root.style.setProperty('--bg-alt', colors.bgAlt);
      if (colors?.text) root.style.setProperty('--text', colors.text);
    }
    
    // Override Typography font style
    if (themeConfig?.customStyle?.fontStyle) {
      root.style.setProperty('--theme-font-heading', `var(--font-${themeConfig.customStyle.fontStyle})`);
    } else {
      root.style.removeProperty('--theme-font-heading');
    }

    // Applying unique card styles as a data attribute can be helpful for global CSS targeting
    root.setAttribute('data-theme', activeDataTheme);
    document.body.setAttribute('data-theme', activeDataTheme);

    // Auto Sync Audio
    const audioSettings = audioManager.getSettings();
    if (audioSettings.autoSync && audioSettings.enabled) {
      const audioTheme = audioManager.getThemeByVisualTheme(themeMode);
      if (audioTheme !== audioSettings.theme) {
        audioManager.setSettings({ theme: audioTheme });
        // Play simple feedback when auto-sync happens
        audioManager.playSound('feedback');
      }
    }
  }, [themeMode]);
  const [authReady, setAuthReady] = useState(false);
  const [userLetters, setUserLetters] = useState<FirebaseLetter[]>([]);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [sharedGames, setSharedGames] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [secrets, setSecrets] = useState<any[]>([]);

  const handleAddSecret = async (secret: any) => {
    await addItem('secrets', { ...secret, createdAt: new Date(), authorName: user?.displayName || 'Anônimo' });
    addToast('Status: success - new_memory_saved()', 'system');
  };
  const [isWritingLetter, setIsWritingLetter] = useState(false);
  const [newLetter, setNewLetter] = useState({ title: '', content: '' });
  const [isSavingLetter, setIsSavingLetter] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Início', icon: <Compass size={18} /> },
    { id: 'historia', label: 'História', icon: <Calendar size={18} /> },
    { id: 'galeria', label: 'Memórias', icon: <ImageIcon size={18} /> },
    { id: 'albuns', label: 'Álbuns', icon: <Library size={18} /> },
    { id: 'jogos', label: 'Jogos', icon: <Gamepad2 size={18} /> },
    { id: 'quiz', label: 'Quiz', icon: <Star size={18} /> },
    { id: 'playlist', label: 'Playlist', icon: <Music size={18} /> },
    { id: 'cartas', label: 'Cartas', icon: <MessageCircle size={18} /> },
    { id: 'futuro', label: 'Futuro', icon: <Compass size={18} /> },
    { id: 'pedido', label: 'Pedido', icon: <Heart size={18} /> },
    { id: 'perfil', label: 'Universo', icon: <UserIcon size={18} /> },
  ];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('button, a, [role="button"], input[type="range"]');
      if (target) {
        // Only trigger if not previewing inside AudioSettings. We don't want double sounds. Wait, if it plays, it just plays the base config. We should be careful not to double play if it's the audio settings play button itself. But Web Audio API is overlapping anyway, so it's not terrible. I'll just skip the audio manager play if the button has a specific class or we can just ignore it. Actually, `audioManager.playSound()` is perfectly fine.
        // I will add a tiny visual feedback too? User asked for visual feedback.
        // Wait, the user asked for visual feedback specifically when testing the sound. But I already implemented that! (scale-110 and color change on play).
        
        // Exclude the input range sliders from triggering click sound on drag release to not overlap with the preview
        if (target.tagName.toLowerCase() !== 'input') {
            audioManager.playSound();
        }
      }
    };
    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
      if (u) {
        saveUserProfile(u);
        setView(prev => prev === 'login' ? 'home' : prev);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserLetters([]);
      setPlaylist([]);
      setSharedGames([]);
      setGallery([]);
      return;
    }

    const unsubLetters = subscribeToCollection('letters', setUserLetters);
    const unsubPlaylist = subscribeToCollection('playlist', setPlaylist);
    const unsubGames = subscribeToCollection('sharedGames', setSharedGames);
    const unsubGallery = subscribeToCollection('gallery', setGallery);
    const unsubSecrets = subscribeToCollection('secrets', (data) => {
      // Sort secrets by newest first
      const sorted = data.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setSecrets(sorted);
    });
    const unsubUser = subscribeToDocument('users', user.uid, (data) => {
      setUserData(data);
      if (data?.themeMode && THEMES[data.themeMode as ThemeMode]) {
        setThemeMode(data.themeMode);
      }
      if (data?.layoutMode) {
        setLayoutMode(data.layoutMode);
      }
      if (data?.notificationConfig) {
        localStorage.setItem('notificationConfig', JSON.stringify(data.notificationConfig));
        window.dispatchEvent(new CustomEvent('notificationConfigChanged', { detail: data.notificationConfig }));
      }
    });

    const unsubUniverse = subscribeToDocument('universes', user.uid, (data) => {
      setUniverseData(data);
      setIsUniverseLoading(false);
    });

    const unsubAlbums = subscribeToCollection('albums', (albumList) => {
      // Merge with initial ALBUMS_DATA if they don't exist yet, or just use Firestore
      // For now, let's treat Firestore as the source of truth for dynamic albums
      setAlbums(albumList.length > 0 ? albumList : ALBUMS_DATA);
    });

    const unsubNotifications = subscribeToCollection('notifications', setNotifications, [
      where('userId', '==', user.uid)
    ]);

    return () => {
      unsubLetters();
      unsubPlaylist();
      unsubGames();
      unsubGallery();
      unsubSecrets();
      unsubUser();
      unsubUniverse();
      unsubAlbums();
      unsubNotifications();
    };
  }, [user]);

  const handleSaveLetter = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newLetter.title || !newLetter.content) return;

    setIsSavingLetter(true);
    try {
      await addItem('letters', {
        title: newLetter.title,
        content: newLetter.content
      });
      const partnerUid = await getPartnerUid(user.uid);
      if (partnerUid) {
        await sendNotification(
          partnerUid,
          "Você recebeu uma carta! ✉️",
          `${user.displayName || 'Seu amor'} escreveu algo especial para você.`,
          'letter'
        );
      }
      addToast('Sua confissão foi eternizada 💌', 'love');
      setNewLetter({ title: '', content: '' });
      setIsWritingLetter(false);
    } catch (error) {
      console.error("Error saving letter:", error);
      alert("Erro ao salvar carta. Tente novamente.");
    } finally {
      setIsSavingLetter(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      setView('home');
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/unauthorized-domain') {
        const hostname = window.location.hostname;
        alert(`Erro: Domínio não autorizado. 

Para corrigir, siga estes passos:
1. Acesse o Console do Firebase (https://console.firebase.google.com/)
2. Vá em Autenticação > Configurações > Domínios Autorizados
3. Adicione o domínio: ${hostname}

Isso permitirá que o login funcione neste ambiente.`);
      } else {
        alert("Erro ao entrar: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setView('login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const [albums, setAlbums] = useState<Album[]>(ALBUMS_DATA);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | number | null>(null);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  
  const selectedAlbum = albums.find(a => a.id === selectedAlbumId);

  const addAlbum = async (title: string, desc: string, cover: string) => {
    const newAlbumData = {
       title,
       desc,
       cover,
       photos: [cover],
       color: ['rose', 'purple', 'emerald', 'blue'][Math.floor(Math.random() * 4)]
    };
    await addItem('albums', newAlbumData);
    if (user) {
      const partnerUid = await getPartnerUid(user.uid);
      if (partnerUid) {
        await sendNotification(
          partnerUid,
          "Um novo álbum foi criado! 📖",
          `${user.displayName || 'Seu amor'} criou o álbum "${title}". Vamos enchê-lo de memórias?`,
          'info'
        );
      }
    }
    setIsCreatingAlbum(false);
  };

  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ url: '', caption: '', category: 'Momentos' });
  const [isAddingMusic, setIsAddingMusic] = useState(false);
  const [newMusic, setNewMusic] = useState({ name: '', artist: '', spotify: '', reason: '', lyrics: '' });
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0, rotate: 0 });
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [unlockedSecrets, setUnlockedSecrets] = useState<string[]>([]);
  const [themeFilter, setThemeFilter] = useState<'all' | 'nature' | 'romance' | 'cinema' | 'gamer' | 'dev'>('all');
  const [activeTab, setActiveTab] = useState<'perfil' | 'temas' | 'layouts' | 'sons' | 'suporte'>('perfil');
  const [editingName, setEditingName] = useState('');
  const [editingBio, setEditingBio] = useState('');
  const [editingPhoto, setEditingPhoto] = useState('');
  const [isEditingProfileQuick, setIsEditingProfileQuick] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  
  const knownNotificationIds = useRef<Set<string>>(new Set());
  const isReadyToPlaySound = useRef(false);

  useEffect(() => {
    if (!initialLoading) {
      // After initial loading is done, allow sounds after a small delay to avoid bulk load playing sound
      const t = setTimeout(() => {
        isReadyToPlaySound.current = true;
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [initialLoading]);

  useEffect(() => {
    const currentIds = new Set(notifications.map(n => n.id));
    
    if (!isReadyToPlaySound.current) {
      knownNotificationIds.current = currentIds;
      return;
    }

    const hasNewUnread = notifications.some(n => !n.read && !knownNotificationIds.current.has(n.id));

    if (hasNewUnread) {
      if (typeof window !== 'undefined') {
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.volume = 0.5;
          audio.play().catch(e => console.log('Audio error:', e));
        } catch (e) {
          console.error(e);
        }
      }
    }

    knownNotificationIds.current = currentIds;
  }, [notifications]);
  
  // Game State
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diags
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);

  const handleSquareClick = (i: number) => {
    if (winner || board[i]) return;
    const nextBoard = board.slice();
    nextBoard[i] = isXNext ? 'X' : 'O';
    setBoard(nextBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setInitialLoading(false), 1200);
          return 100;
        }
        return prev + 1.2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const unlockSecret = (key: string) => {
    if (!unlockedSecrets.includes(key)) {
      setUnlockedSecrets(prev => [...prev, key]);
    }
  };

  const handleSim = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAccepted(true);
      setView('sucesso');
    }, 3000);
  };

  const handleLayoutChange = async (mode: LayoutType) => {
    setLayoutMode(mode);
    localStorage.setItem('layoutMode', mode);
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { layoutMode: mode });
      } catch (err) {
        console.error('Error saving layout:', err);
      }
    }
  };

  const handleThemeChange = async (mode: ThemeMode) => {
    setThemeMode(mode);
    
    // Auto-sync sound preset v3.0.0
    const theme = THEMES[mode];
    if (theme && audioManager.getSettings().autoSync) {
      const soundMapping: Record<string, string> = {
        nature: 'nature',
        romance: 'romantic',
        cinema: 'cinema',
        gamer: 'retro_gamer',
        dev: 'sci_fi_tech'
      };
      const soundTheme = soundMapping[theme.category];
      if (soundTheme) {
        audioManager.setSettings({ theme: soundTheme as any });
      }
    }

    if (user) {
      await updateUserSettings(user.uid, { themeMode: mode });
    }
  };

  const Confetti = () => {
    const particles = 100;
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[200]">
        {[...Array(particles)].map((_, i) => {
          const size = Math.random() * 10 + 5;
          const color = ["#ff0055", "#00ffcc", "#ffcc00", "#ff88dd", "#ffffff", "#f43f5e"][Math.floor(Math.random() * 6)];
          const shape = Math.random() > 0.5 ? 'circle' : 'square';
          const isHeart = Math.random() > 0.8;

          return (
            <motion.div
              key={`confetti-${i}`}
              initial={{ 
                top: "40%", 
                left: "50%",
                opacity: 0,
                scale: 0,
                rotate: 0,
                x: 0,
                y: 0
              }}
              animate={{ 
                top: [null, `${Math.random() * 120 - 10}%`],
                left: [null, `${Math.random() * 120 - 10}%`],
                opacity: [0, 1, 1, 0],
                scale: [0, Math.random() * 1.5 + 0.5, 0],
                rotate: Math.random() * 1000,
              }}
              transition={{ 
                duration: 4 + Math.random() * 4, 
                repeat: Infinity, 
                ease: "easeOut",
                delay: Math.random() * 5
              }}
              className="absolute"
            >
              {isHeart ? (
                <Heart 
                  size={size + 5} 
                  fill={color} 
                  className="text-transparent" 
                  style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' }}
                />
              ) : (
                <div 
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    borderRadius: shape === 'circle' ? '50%' : '2px',
                    boxShadow: `0 0 10px ${color}44`
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const moveButton = useCallback(() => {
    if (!containerRef.current) return;
    
    // Small delay before moving to make it feel more "reactive" but hard to catch
    setTimeout(() => {
      const container = containerRef.current!.getBoundingClientRect();
      const padding = 120; // Increased padding to keep it visible
      
      // Calculate a position that isn't too close to the current one or the edges
      const newX = Math.random() * (container.width - padding * 2) - (container.width / 2 - padding);
      const newY = Math.random() * (container.height - padding * 2) - (container.height / 2 - padding);
      
      // Random rotation to make it feel more erratic
      const randomRotation = (Math.random() - 0.5) * 45;
      
      setNoButtonPos({ x: newX, y: newY, rotate: randomRotation });
    }, 150);
  }, []);

  const { scrollYProgress: globalScrollProgress } = useScroll();
  const progressScaleX = useSpring(globalScrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col bg-[var(--bg)] selection:bg-[var(--primary)]/30 selection:text-[var(--primary)] noise-overlay"
      id="root-container"
    >
      {/* Global Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--primary)] z-[2000] origin-left shadow-[0_0_15px_var(--primary-glow)]"
        style={{ scaleX: progressScaleX }}
      />

      <FooterLayoutWrapper 
        footerContent={!['login', 'pedido', 'sucesso', 'galeria'].includes(view) ? <Footer setView={setView} /> : null}
      >
        <AnimatePresence>
        {!initialLoading && !['landing', 'login', 'pedido', 'sucesso', 'galeria'].includes(view) && (
          <Navbar 
            currentView={view} 
            onNavigate={setView}
          >
            {/* Right: Actions Cluster */}
            <div className="flex items-center gap-4 pointer-events-auto">
              {/* Notification Bell */}
              <div className="relative">
                <NotificationButton 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
                  hasUnread={notifications.some(n => !n.read)}
                />

                <AnimatePresence>
                  {isNotificationOpen && (
                    <NotificationsDropdown 
                      notifications={notifications} 
                      onClose={() => setIsNotificationOpen(false)} 
                      onMarkAsRead={markNotificationAsRead}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Builder Toggle removed per request */}

              {/* User Menu Trigger */}
              <UserMenu 
                user={user} 
                onLogin={handleLogin} 
                onLogout={handleLogout} 
                onNavigate={setView}
                onShowNotifications={() => setIsNotificationOpen(true)}
                onEditProfile={() => {
                  setEditingName(user?.displayName || '');
                  setEditingPhoto(user?.photoURL || '');
                  setEditingBio((user as any)?.bio || '');
                  setIsEditingProfileQuick(true);
                }}
              />
            </div>
          </Navbar>
        )}
      </AnimatePresence>

      <main className={`relative w-full flex-1 flex flex-col items-center min-h-screen ${(!['landing', 'login', 'pedido', 'sucesso'].includes(view) && !initialLoading) ? 'pt-16 md:pt-20 pb-24 md:pb-0' : ''}`}>

      {/* Theme System Background */}
      <ThemeBackground themeMode={themeMode} THEMES={THEMES} universeData={universeData} />

      <AnimatePresence mode="wait">
        {initialLoading ? (
          <motion.div
            key="initial-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg)]"
          >
            <div className="absolute inset-0 opacity-20">
               {[...Array(30)].map((_, i) => (
                 <motion.div 
                   key={i} 
                   animate={{ 
                     opacity: [0.1, 0.5, 0.1],
                     scale: [1, 1.2, 1] 
                   }}
                   transition={{ 
                     duration: 3 + Math.random() * 4, 
                     repeat: Infinity,
                     delay: Math.random() * 5
                   }}
                   className="absolute bg-white rounded-full"
                   style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     width: `${Math.random() * 2 + 1}px`,
                     height: `${Math.random() * 2 + 1}px`,
                   }}
                 />
               ))}
            </div>
            
            <div className="relative z-[110] text-center flex flex-col items-center">
              <Loader />
              <motion.p 
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white/40 font-serif italic text-xl mt-8 tracking-widest"
              >
                Sintonizando Nossa Jornada...
              </motion.p>
              <div className="w-48 h-1 bg-white/5 rounded-full mx-auto overflow-hidden border border-white/10 mt-6 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  className="h-full bg-gradient-to-r from-[var(--primary)] via-white to-[var(--primary)] bg-[length:200%_auto] animate-gradient shadow-[0_0_20px_var(--primary-glow)]"
                />
              </div>
            </div>
          </motion.div>
        ) : view === 'login' ? (
          <LoginPage onLogin={handleLogin} loading={loading} />
        ) : view === ('custom_proposal' as any) && invitedProposal ? (
          <CustomProposalView data={invitedProposal} onAccept={() => setView('sucesso')} />
        ) : view === 'sucesso' ? (
          <SuccessView setView={setView} />
        ) : view === 'home' ? (
          <HomeLayoutResolver 
            themeMode={themeMode}
            layoutMode={layoutMode}
            experienceMode={experienceMode}
            THEMES={THEMES}
            universeData={universeData}
            user={user} 
            setView={setView} 
            GALLERY_DATA={gallery} 
            PLAYLIST_DATA={playlist} 
            SHARED_GAMES={sharedGames} 
            LETTERS_DATA={userLetters} 
            ALBUMS_DATA={albums} 
          />
        ) : view === 'home_backup' ? (
          <motion.div
             key="home"
             initial="hidden"
             animate="visible"
             exit="exit"
             variants={{
               hidden: { opacity: 0 },
               visible: { 
                 opacity: 1,
                 transition: { staggerChildren: 0.1, delayChildren: 0.2 }
               },
               exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
             }}
             className="relative z-10 w-full max-w-7xl px-6 py-24"
          >
            {/* Header with Presence Indicator */}
            <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="text-left"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span className="text-rose-400 font-mono text-[10px] uppercase tracking-[0.6em]">Conectados na mesma frequência</span>
                </div>
                <h1 className="text-6xl md:text-9xl font-serif text-white tracking-tighter leading-none">
                  Olá, <span className="text-rose-500 italic lowercase">{user?.displayName?.split(' ')[0] || 'vida'}</span>.
                </h1>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="glass-card px-8 py-4 rounded-3xl border border-white/5 flex items-center gap-6"
              >
                <div className="text-right">
                  <p className="text-white/20 font-mono text-[8px] uppercase tracking-widest">Cidade do Amor</p>
                  <p className="text-white font-serif text-xs italic">Onde quer que você esteja</p>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="flex items-center gap-3">
                  <Sparkles size={16} className="text-rose-500" />
                  <span className="text-white font-mono text-xs">24°C de afeto</span>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              {/* Main Hero Card */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 }
                }}
                className="md:col-span-8 lg:col-span-9 glass-card rounded-[4rem] p-12 md:p-16 border border-white/10 flex flex-col lg:flex-row items-center gap-12 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent relative overflow-hidden group min-h-[500px]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(244,63,94,0.1),transparent_70%)]" />
                <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none rotate-12 scale-150">
                  <Heart size={300} className="fill-white" />
                </div>
                
                <div className="relative group shrink-0">
                  <div className="w-48 h-48 md:w-72 md:h-72 rounded-[4rem] overflow-hidden border-4 border-rose-500/30 shadow-2xl transition-all duration-700 group-hover:rotate-3 group-hover:scale-105">
                    <img src="https://images.unsplash.com/photo-1518199266791-739d6ffecf0b?w=800" alt="Nós" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-125" />
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-6 -right-6 bg-rose-600 p-6 rounded-[2.5rem] shadow-2xl shadow-rose-600/40 border-8 border-[var(--bg)]"
                  >
                    <Heart size={32} className="text-white fill-white" />
                  </motion.div>
                </div>

                <div className="text-center lg:text-left flex-1 relative z-10">
                  <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tighter leading-[0.9] inline-block">
                    O Nosso <br/>
                    <span className="text-rose-500 italic relative">
                      You Pedido
                      <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-500/30" />
                      </svg>
                    </span> Particular
                  </h2>
                  <p className="text-white/40 font-serif italic text-2xl max-w-md leading-relaxed mb-10">
                    Sincronizados pelo destino, mantidos pelo amor. Este é o nosso porto seguro na imensidão do mundo.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <button 
                      onClick={() => setView('historia')}
                      className="px-10 py-5 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl shadow-white/10"
                    >
                      Ver Nossa Estrada
                    </button>
                    <button 
                      onClick={() => setView('pedido')}
                      className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 backdrop-blur-md"
                    >
                      Uma Surpresa
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Sidebar: Time Together */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 }
                }}
                className="md:col-span-4 lg:col-span-3 glass-card rounded-[4rem] p-10 border border-white/10 flex flex-col items-center justify-center bg-white/[0.02] relative group overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10 w-full">
                  <TimeTogether startDate={new Date('2023-01-01')} />
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 w-full text-center">
                  <p className="text-white/20 font-mono text-[9px] uppercase tracking-widest">Próximo Marco</p>
                  <p className="text-white/60 font-serif italic mt-2">Nosso aniversário em breve</p>
                </div>
              </motion.div>

              {/* Grid of Interaction Blocks */}
              <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { id: 'galeria', label: 'Memórias', icon: <ImageIcon size={22} />, desc: 'Instantâneos de amor', color: 'rose', bg: 'bg-rose-500/5' },
                  { id: 'playlist', label: 'Músicas', icon: <Music size={22} />, desc: 'Nossos acordes', color: 'emerald', bg: 'bg-emerald-500/5' },
                  { id: 'jogos', label: 'Diversão', icon: <Gamepad2 size={22} />, desc: 'Jogar juntos', color: 'blue', bg: 'bg-blue-500/5' },
                  { id: 'cartas', label: 'Cartas', icon: <MessageCircle size={22} />, desc: 'Palavras sinceras', color: 'amber', bg: 'bg-amber-500/5' },
                ].map((item, i) => (
                  <motion.button
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    onClick={() => setView(item.id as View)}
                    className={`p-10 glass-card rounded-[3.5rem] border border-white/5 hover:border-rose-500/30 transition-all text-left group relative overflow-hidden flex flex-col h-full bg-white/[0.01]`}
                  >
                    <div className={`mb-8 relative z-10 w-16 h-16 rounded-3xl ${item.bg} flex items-center justify-center text-white/40 group-hover:bg-rose-500 group-hover:text-white transition-all duration-700 group-hover:rotate-6`}>
                      {item.icon}
                    </div>
                    <div className="mt-auto relative z-10">
                      <span className="text-white font-mono text-[10px] uppercase tracking-[0.4em] transition-colors mb-2 block">{item.label}</span>
                      <span className="text-white/40 text-sm italic font-serif leading-tight group-hover:text-white/60 transition-colors">{item.desc}</span>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={20} className="text-rose-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>

              {/* Full Width Quote / Feature */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="md:col-span-12 glass-card rounded-[4rem] p-12 md:p-20 border border-white/10 relative overflow-hidden group mt-6"
              >
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-all duration-1000 scale-150">
                  <Star size={300} className="text-white fill-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-transparent to-transparent" />
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
                   <div className="space-y-8 max-w-4xl text-center lg:text-left">
                     <div className="flex items-center gap-4 justify-center lg:justify-start">
                       <div className="w-12 h-[1px] bg-rose-500" />
                       <p className="text-rose-400 font-mono text-[10px] uppercase tracking-[0.8em]">Cápsula Atemporal</p>
                     </div>
                     <h3 className="text-5xl md:text-7xl font-serif text-white italic leading-[1.1] tracking-tight">
                       "Em todos os universos possíveis, eu escolheria te amar em todos eles."
                     </h3>
                     <div className="flex items-center gap-4 justify-center lg:justify-start text-white/30 italic font-serif text-2xl">
                       <span className="w-2 h-2 rounded-full bg-rose-500/50" />
                       Para sempre, nós dois.
                     </div>
                   </div>
                   
                   <div className="shrink-0 flex flex-col gap-6 w-full lg:w-auto">
                     <motion.button 
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setView('quiz')}
                       className="px-16 py-8 bg-rose-600 text-white rounded-[2.5rem] font-bold text-xs uppercase tracking-widest shadow-2xl shadow-rose-600/30 hover:bg-rose-500 transition-all flex items-center justify-center gap-4 group/btn"
                     >
                        Testar Nossa Sincronia <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                      </motion.button>
                      <p className="text-center font-mono text-[9px] uppercase tracking-[0.4em] text-white/20">A vida é uma obra de arte com você</p>
                    </div>
                 </div>
              </motion.div>
            </div>
          </motion.div>
        ) : view === 'historia' ? (
          <TimelineView timelineData={TIMELINE_DATA} onNavigate={setView} />
        ) : view === 'galeria' ? (
          <GalleryView 
            moments={gallery} 
            user={user}
            onAddMoment={addGalleryPhoto} 
            onDeleteMoment={handleDeleteMoment}
            onNavigate={setView}
          />
        ) : view === 'albuns' ? (
          <motion.div
             key="albuns"
             initial="hidden"
             animate="visible"
             exit="exit"
             variants={{
               hidden: { opacity: 0 },
               visible: { 
                 opacity: 1,
                 transition: { staggerChildren: 0.1 }
               },
               exit: { opacity: 0, y: -20 }
             }}
             className="relative z-10 w-full max-w-7xl px-6 py-24"
          >
            {selectedAlbum ? (
              <AlbumDetailView 
                album={selectedAlbum} 
                onBack={() => setSelectedAlbumId(null)}
                onAddPhoto={(url) => addPhotoToAlbum(selectedAlbum.id, url)}
              />
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
                   <div className="text-left">
                      <div className="flex items-center gap-3 mb-6">
                        <Library size={16} className="text-[var(--primary)]" />
                        <span className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-[0.6em] opacity-80">Coleções Curadas</span>
                      </div>
                      <h2 className="text-6xl md:text-9xl font-serif text-white tracking-tighter leading-none">Nossos <br/><span className="text-[var(--primary)] italic font-light text-glow">Álbuns</span>.</h2>
                   </div>
                   <div className="flex flex-col items-end gap-6">
                      <p className="text-white/20 font-serif text-xl italic text-right max-w-xs">Capítulos da nossa história, <br/>organizados com carinho.</p>
                      <button 
                         onClick={() => setIsCreatingAlbum(true)}
                         className="flex items-center gap-4 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-mono uppercase tracking-widest text-white transition-all group"
                       >
                         <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Novo Álbum
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                   {albums.map((album, i) => (
                     <motion.div
                       key={album.id}
                       variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                       whileHover={{ y: -15 }}
                       onClick={() => setSelectedAlbumId(album.id)}
                       className="relative group cursor-pointer"
                     >
                        <div className="relative aspect-[3/4.5] overflow-hidden rounded-[4rem] border-8 border-white/5 shadow-3xl bg-black luxury-card">
                           <img 
                             src={album.cover} 
                             alt={album.title} 
                             className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0 opacity-40 group-hover:opacity-100"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                           <div className="absolute top-10 right-10 luxury-card px-6 py-3 rounded-full border border-white/10 text-white font-mono text-[10px] uppercase tracking-widest z-10">
                             {album.photos.length} fotos
                           </div>
                           
                           <div className="absolute inset-x-0 bottom-0 p-12 flex flex-col justify-end text-left z-10">
                              <h3 className="text-4xl font-serif text-white mb-3 group-hover:text-[var(--primary)] group-hover:text-glow transition-all">{album.title}</h3>
                              <p className="text-white/30 font-serif italic text-lg leading-snug group-hover:text-white/60 transition-colors">{album.desc}</p>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                </div>
              </>
            )}

            {/* Create Album Modal */}
            <AnimatePresence>
              {isCreatingAlbum && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                >
                  <motion.div 
                     initial={{ scale: 0.9, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     className="glass-card w-full max-w-lg p-12 rounded-[3.5rem] border border-white/10 relative"
                  >
                    <button 
                      onClick={() => setIsCreatingAlbum(false)}
                      className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                    
                    <h3 className="text-3xl font-serif text-white mb-8">Novo Álbum</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      addAlbum(
                        formData.get('title') as string,
                        formData.get('desc') as string,
                        formData.get('cover') as string
                      );
                    }} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-white/40 font-mono text-[10px] uppercase tracking-widest pl-2">Título</label>
                        <input name="title" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-rose-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/40 font-mono text-[10px] uppercase tracking-widest pl-2">Descrição</label>
                        <input name="desc" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-rose-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/40 font-mono text-[10px] uppercase tracking-widest pl-2">Capa (URL)</label>
                        <input name="cover" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-rose-500 outline-none transition-all" />
                      </div>
                      <button type="submit" className="w-full bg-rose-600 py-5 rounded-2xl text-white font-bold hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20 mt-4">
                        Criar Álbum
                      </button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-32 text-center">
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 onClick={() => setView('quiz')}
                 className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all group font-bold tracking-tight"
               >
                 Continuar para o Quiz <Sparkles size={18} className="inline ml-3 text-rose-400" />
               </motion.button>
            </div>
          </motion.div>
        ) : view === 'jogos' ? (
          <JogosView 
            setView={setView} 
            user={user}
            partnerUid={partnerUid}
            gallery={gallery}
            onAddGame={addSharedGame}
            onDeleteGame={handleDeleteGame}
            onSaveDiary={async (entry: any) => {
              await addItem('letters', {
                ...entry,
                type: 'achievement',
                isSystem: true
              });
              addToast('Conquista salva no diário do coração!', 'unlock');
              const partner = await getPartnerUid(user?.uid || '');
              if (partner) {
                sendNotification(partner, entry.title, "Uma nova conquista foi registrada no diário!", "game");
              }
            }}
          />
        ) : view === 'jogos_backup' ? (
          <motion.div
             key="jogos"
             initial="hidden"
             animate="visible"
             exit="exit"
             variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                },
                exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
             }}
             className="relative z-10 w-full max-w-7xl px-8 py-24 mx-auto"
          >
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
               <motion.div 
                 variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
                 className="text-left"
               >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-[1px] bg-rose-500/30" />
                    <Gamepad2 size={18} className="text-rose-500" />
                    <span className="text-rose-400 font-mono text-[10px] uppercase tracking-[1em]">Playground do Afeto</span>
                  </div>
                  <h2 className="text-7xl md:text-9xl font-serif text-white tracking-tighter leading-[0.9] mb-4">
                    Nossos <br/><span className="text-rose-500 italic font-light drop-shadow-[0_0_20px_rgba(244,63,94,0.2)]">Jogos.</span>
                  </h2>
               </motion.div>
               <motion.div 
                 variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }}
                 className="text-right hidden md:block max-w-md pb-6"
               >
                  <p className="text-white/30 font-serif text-3xl italic tracking-tight leading-relaxed">
                    Porque crescer não significa parar de brincar <br/>um com o outro no campo da vida.
                  </p>
               </motion.div>
            </div>

            {/* Interaction Section: Jogos de Casal */}
            <div className="mb-48">
               <div className="flex items-center gap-4 mb-16">
                  <span className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em]">01 // Interações Ativas</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                 {/* Tic Tac Toe Board */}
                 <motion.div 
                   variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                   className="lg:col-span-7 luxury-glass rounded-[5rem] p-12 md:p-20 border border-white/10 shadow-3xl relative overflow-hidden group"
                 >
                    <div className="absolute inset-0 bg-rose-500/[0.02] group-hover:bg-rose-500/[0.04] transition-all duration-1000" />
                    
                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 relative z-10 gap-12">
                       <div className="text-center md:text-left">
                         <h3 className="text-4xl md:text-5xl font-serif text-white text-glow mb-6 tracking-tight">Duelo de <span className="text-rose-500 italic">Afetos</span></h3>
                         <div className="flex items-center gap-4 justify-center md:justify-start">
                           {winner ? (
                             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="px-8 py-3 bg-rose-500 rounded-full text-white font-bold text-[10px] uppercase tracking-widest shadow-3xl shadow-rose-600/40">
                               {winner === 'X' ? 'Você venceu! ❤️' : 'Eu venci! ❤️'}
                             </motion.div>
                           ) : isDraw ? (
                             <div className="px-8 py-3 luxury-glass border border-white/10 rounded-full text-white font-bold text-[10px] uppercase tracking-widest">Empate!</div>
                           ) : (
                             <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-8 py-3 rounded-full">
                               <div className={`w-3 h-3 rounded-full animate-pulse ${isXNext ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_15px_#10b981]'}`} />
                               <span className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">Turno: {isXNext ? 'Você (X)' : 'Eu (O)'}</span>
                             </div>
                           )}
                         </div>
                       </div>
                       
                       {(winner || isDraw) && (
                         <motion.button 
                           initial={{ opacity: 0, scale: 0.8 }} 
                           animate={{ opacity: 1, scale: 1 }}
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={resetGame}
                           className="px-10 py-5 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 shadow-3xl group"
                         >
                           Reset <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                         </motion.button>
                       )}
                    </div>

                    <div className="grid grid-cols-3 gap-6 max-w-[450px] mx-auto aspect-square relative z-10">
                       {board.map((cell, i) => (
                         <motion.button
                           key={i}
                           whileHover={{ backgroundColor: "rgba(255,255,255,0.06)", scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={() => handleSquareClick(i)}
                           className={`bg-white/[0.02] border rounded-[3.5rem] flex items-center justify-center text-7xl font-serif shadow-inner transition-all duration-700 relative overflow-hidden group/cell
                             ${winner || isDraw ? 'cursor-default' : 'cursor-pointer hover:border-rose-500/40'}
                             ${cell === 'X' ? 'text-rose-500 border-rose-500/30' : cell === 'O' ? 'text-emerald-400 border-emerald-500/30' : 'border-white/5'}
                           `}
                         >
                            <AnimatePresence mode="wait">
                              {cell && (
                                <motion.span
                                  key={cell}
                                  initial={{ scale: 0, rotate: -90, filter: "blur(20px)" }}
                                  animate={{ scale: 1, rotate: 0, filter: "blur(0px)" }}
                                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                  className={cell === 'X' ? 'drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]'}
                                >
                                  {cell}
                                </motion.span>
                              )}
                            </AnimatePresence>
                         </motion.button>
                       ))}
                    </div>
                 </motion.div>

                 {/* Side Cards: Additional Interactive Games */}
                 <div className="lg:col-span-5 flex flex-col gap-10">
                    <motion.div 
                      variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }}
                      className="luxury-glass p-12 rounded-[5rem] border border-white/5 relative overflow-hidden group h-full flex flex-col justify-center"
                    >
                       <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                       <div className="w-20 h-20 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:bg-rose-500 transition-all duration-700 shadow-inner group-hover:shadow-rose-600/40 relative z-10">
                          <Sparkles className="text-rose-400 group-hover:text-white" size={32} />
                       </div>
                       <h4 className="text-4xl font-serif text-white mb-6 tracking-tight relative z-10">Quiz de <span className="text-rose-500 italic">Sincronia</span></h4>
                       <p className="text-white/30 text-xl font-serif italic mb-10 leading-relaxed relative z-10 group-hover:text-white/60 transition-colors">Avaliaremos o quão profundo é o nosso conhecimento mútuo.</p>
                       <button 
                         onClick={() => setView('quiz')}
                         className="px-12 py-5 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-[0.4em] self-start shadow-3xl hover:bg-rose-600 hover:text-white transition-all relative z-10"
                       >
                         Iniciar Desafio
                       </button>
                    </motion.div>

                    <motion.div 
                      variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }}
                      className="luxury-glass p-12 rounded-[5rem] border border-white/5 relative overflow-hidden group h-full flex flex-col justify-center"
                    >
                       <div className="w-16 h-1 w-16 bg-white/[0.03] rounded-full mb-10" />
                       <h4 className="text-3xl font-serif text-white mb-6">Próxima Fase</h4>
                       <p className="text-white/20 text-lg font-serif italic mb-10">
                         Cada conversa, cada risada e cada jogo é um nível a mais desbloqueado no nosso império.
                       </p>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "95%" }}
                            transition={{ duration: 3, delay: 1 }}
                            className="h-full bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                          />
                       </div>
                    </motion.div>
                 </div>
               </div>
            </div>

            {/* Shared Games Section: Jogos que Jogamos Juntos */}
            <div className="mb-32">
               <div className="flex items-center gap-4 mb-16">
                  <span className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em]">02 // Universos Compartilhados</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {SHARED_GAMES.map((game, i) => (
                    <motion.div
                      key={i}
                      variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                      whileHover={{ y: -15 }}
                      className="group relative h-[500px] rounded-[4rem] overflow-hidden shadow-3xl"
                    >
                       <div className="absolute inset-0 bg-black/60 z-10 group-hover:bg-black/20 transition-all duration-1000" />
                       <img 
                         src={game.image} 
                         alt={game.title} 
                         className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]"
                       />
                       
                       <div className="absolute inset-0 z-20 p-12 flex flex-col justify-end">
                          <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                             <h4 className="text-4xl font-serif text-white mb-4 drop-shadow-2xl">{game.title}</h4>
                             <div className="h-[1px] w-12 bg-rose-500 mb-6 group-hover:w-full transition-all duration-1000" />
                             <p className="text-white/50 font-serif italic text-xl group-hover:text-white transition-colors duration-700 opacity-0 group-hover:opacity-100">
                               {game.desc}
                             </p>
                          </div>
                       </div>

                       <div className="absolute top-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center">
                             <Star className="text-white animate-pulse" size={20} />
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            <div className="text-center mt-48">
               <motion.button 
                 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                 whileHover={{ scale: 1.05 }}
                 onClick={() => setView('quiz')}
                 className="px-24 py-10 luxury-glass text-white border border-rose-500/20 font-bold rounded-[3rem] text-xs uppercase tracking-[0.5em] hover:bg-rose-600 hover:border-rose-500 hover:text-white transition-all shadow-3xl group"
               >
                 Continuar Jornada <ArrowRight size={24} className="inline ml-6 group-hover:translate-x-3 transition-transform text-rose-500" />
               </motion.button>
            </div>
          </motion.div>
        ) : view === 'quiz' ? (
          <QuizView questions={QUIZ_QUESTIONS} onNavigate={setView} />
        ) : view === 'playlist' ? (
          <PlaylistView 
            playlist={playlist} 
            user={user}
            onAddMusic={() => setIsAddingMusic(true)} 
            onNavigate={setView}
            onDeleteMusic={handleDeleteMusic}
            onToggleFavorite={handleToggleFavoriteMusic}
          />
        ) : view === 'cartas' ? (
          <JournalView 
            userLetters={userLetters} 
            onWriteAction={() => setIsWritingLetter(true)} 
            onNavigate={setView}
            onDeleteLetter={handleDeleteLetter}
          />
        ) : view === 'futuro' ? (
          <FutureView 
            secrets={secrets} 
            onAddSecret={handleAddSecret} 
            onNavigate={setView}
          />
        ) : loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-[300] bg-[var(--bg)] inset-0 fixed flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="relative mb-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-[var(--primary)]/10 blur-[80px] rounded-full scale-[1.5] animate-pulse" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-4rem] border border-[var(--primary)]/10 rounded-full border-dashed"
              />
              <PixelHeartLoader />
            </div>
            
            <h2 className="text-5xl md:text-8xl font-serif text-white mb-10 italic tracking-tighter font-light text-glow">
              Sincronizando mundos...
            </h2>
            <p className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-[1em] mb-16 animate-pulse">Tecendo fios de eternidade</p>
            
            <div className="w-80 h-[2px] bg-white/5 relative overflow-hidden rounded-full shadow-[0_0_20px_rgba(255,255,255,0.05)] pt-0">
               <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "100%" }}
                 transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent shadow-[0_0_30px_var(--primary-glow)]"
               />
            </div>
          </motion.div>
        ) : view === 'pedido' ? (
          <PedidoView 
            onAccept={() => setView('home')} 
            themeMode={themeMode}
            THEMES={THEMES}
            proposalMode={proposalMode}
          />
        ) : view === 'pedido_backup' ? (
          <motion.div
             key="pedido"
             initial="hidden"
             animate="visible"
             exit="exit"
             variants={{
               hidden: { opacity: 0 },
               visible: { 
                 opacity: 1,
                 transition: { staggerChildren: 0.2, delayChildren: 0.5 }
               },
               exit: { opacity: 0, scale: 0.98, transition: { duration: 0.8 } }
             }}
             className="relative z-10 w-full max-w-7xl px-8 py-24 text-center flex flex-col items-center justify-center min-h-[90vh] mx-auto"
          >
             {/* Background Decoration */}
             <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none hidden md:block">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-rose-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
             </div>

             <motion.div 
               variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
               className="mb-16"
             >
                <div className="flex items-center gap-8 justify-center mb-8">
                  <motion.div 
                    animate={{ width: [0, 80, 60] }}
                    className="h-[1px] bg-rose-500/30" 
                  />
                  <span className="text-rose-400 font-mono text-[10px] uppercase tracking-[1.2em] font-light">A Convergência de Dois Destinos</span>
                  <motion.div 
                    animate={{ width: [0, 80, 60] }}
                    className="h-[1px] bg-rose-500/30" 
                  />
                </div>
             </motion.div>

             <motion.div
                variants={{ hidden: { opacity: 0, scale: 0.5, rotate: -10 }, visible: { opacity: 1, scale: 1, rotate: 0 } }}
                transition={{ type: "spring", damping: 15 }}
                className="mb-48 relative"
             >
                <div className="absolute inset-0 bg-rose-500 blur-[180px] opacity-30 animate-pulse scale-150 hidden md:block" />
                
                {/* Rotating Text Ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-8rem] flex items-center justify-center pointer-events-none"
                >
                  <svg viewBox="0 0 300 300" className="w-[300px] h-[300px] opacity-20">
                    <path id="circlePath" d="M 150, 150 m -120, 0 a 120,120 0 0,1 240,0 a 120,120 0 0,1 -240,0" fill="transparent" />
                    <text className="fill-white font-mono text-[10px] uppercase tracking-[0.5em]">
                      <textPath href="#circlePath">
                        Amor Eterno • Singularidade • Nosso Destino • Infinito • 
                      </textPath>
                    </text>
                  </svg>
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [0, -30, 0],
                    scale: [1, 1.05, 1],
                    filter: ["drop-shadow(0 0 20px rgba(244,63,94,0.3))", "drop-shadow(0 0 50px rgba(244,63,94,0.6))", "drop-shadow(0 0 20px rgba(244,63,94,0.3))"]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <PixelHeartLoader />
                </motion.div>
             </motion.div>

             <motion.div className="max-w-6xl mx-auto relative z-10">
               <motion.p 
                 variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                 className="text-white/50 font-serif italic text-3xl md:text-4xl mb-20 leading-relaxed tracking-tight max-w-4xl mx-auto"
               >
                 Cruzamos oceanos de pixels, construímos álbuns de luz pura e <br/>
                 fundimos nossas essências em uma <span className="text-white/80">única e eterna batida.</span>
               </motion.p>
               
               <motion.div
                 variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                 className="relative mb-40"
               >
                 <motion.h1 
                   className="text-8xl md:text-[14rem] lg:text-[18rem] font-serif text-white tracking-tighter leading-[0.75] font-light drop-shadow-4xl"
                 >
                   Aceita <br />
                   <span className="italic text-rose-500 font-light drop-shadow-[0_0_50px_rgba(244,63,94,0.5)]">fazer morada</span> <br />
                   em mim?
                 </motion.h1>
                 
                 {/* Decorative Accent */}
                 <motion.div 
                   animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="absolute -top-12 -right-8 text-rose-500/20 pointer-events-none"
                 >
                    <Sparkles size={120} />
                 </motion.div>
               </motion.div>
             </motion.div>

             <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full max-w-6xl px-8 relative z-10 mx-auto">
                {["Sim, Eternamente ❤️", "Toda Minha Vida ❤️"].map((opt, i) => (
                  <motion.button
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ scale: 1.08, y: -15, boxShadow: i === 0 ? "0 50px 120px var(--primary-glow)" : "0 50px 120px rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleSim}
                    className={`group relative w-full md:w-auto px-28 py-14 rounded-full font-bold text-2xl md:text-3xl uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-8 overflow-hidden shadow-4xl ${
                      i === 0 
                      ? 'bg-[var(--primary)] text-white border border-[var(--primary-light)]/50' 
                      : 'luxury-glass border border-white/20 text-white backdrop-blur-2xl'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10 group-hover:scale-110 transition-transform duration-700 drop-shadow-xl">{opt}</span>
                  </motion.button>
                ))}
             </div>
             
             <motion.div 
               variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
               className="mt-48 text-white/10 text-[11px] font-mono tracking-[1.2em] uppercase flex items-center gap-8"
             >
               <div className="w-12 h-[1px] bg-white/10" />
               <div className="flex items-center gap-4">
                 <Lock size={14} className="opacity-30" />
                 <span>Protocolo de União Vitalício</span>
                 <Lock size={14} className="opacity-30" />
               </div>
               <div className="w-12 h-[1px] bg-white/10" />
             </motion.div>
          </motion.div>
        ) : view === 'perfil' ? (
          <UserMenuResolver 
            user={user}
            userData={userData}
            THEMES={THEMES}
            themeMode={themeMode}
            layoutMode={layoutMode}
            handleThemeChange={handleThemeChange}
            handleLayoutChange={handleLayoutChange}
            albums={albums}
            userLetters={userLetters}
            playlist={playlist}
            setThemeFilter={setThemeFilter}
            themeFilter={themeFilter}
            experienceMode={experienceMode}
            setExperienceMode={setExperienceMode}
            proposalMode={proposalMode}
            setProposalMode={setProposalMode}
            audioManager={audioManager}
            handleLogout={handleLogout}
            setIsDeleteAccountOpen={setIsDeleteAccountOpen}
            updateUserSettings={updateUserSettings}
            setView={setView}
          />
        ) : (
          <NotFoundView setView={setView} />
        )}
      </AnimatePresence>

      {/* Modals wrappers */}

      {/* Writing Letter Modal */}
      <AnimatePresence>
        {isWritingLetter && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-black/60 border border-white/10 rounded-[3.5rem] overflow-hidden flex flex-col h-[85vh] shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <div className="p-6 sm:p-12 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-white/[0.03] to-transparent">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center border border-[var(--primary)]/20 shadow-lg shadow-[var(--primary)]/5">
                    <MessageCircle size={20} className="text-[var(--primary)] sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-3xl font-editorial italic text-white leading-none">Abrir o Coração</h2>
                    <span className="text-[8px] sm:text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] mt-2 block">Derrame suas palavras aqui...</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsWritingLetter(false)}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md border border-white/5"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveLetter} className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-12 space-y-6 sm:space-y-10">
                <div className="space-y-2">
                  <label className="text-white/30 font-mono text-[8px] sm:text-[10px] uppercase tracking-widest ml-4 sm:ml-6">Título da Carta</label>
                  <input 
                    type="text"
                    required
                    value={newLetter.title}
                    onChange={(e) => setNewLetter({ ...newLetter, title: e.target.value })}
                    placeholder="Dê um nome a este sentimento..."
                    className="w-full h-12 sm:h-16 px-6 sm:px-8 bg-white/[0.03] border border-white/10 rounded-full text-white text-sm sm:text-base placeholder-white/20 focus:border-[var(--primary)]/50 focus:bg-white/[0.05] outline-none transition-all font-serif italic"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/30 font-mono text-[8px] sm:text-[10px] uppercase tracking-widest ml-4 sm:ml-6">Sua Mensagem</label>
                  <textarea 
                    required
                    value={newLetter.content}
                    onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                    placeholder="Querida..."
                    rows={4}
                    className="w-full px-6 sm:px-8 py-6 sm:py-8 bg-white/[0.03] border border-white/10 rounded-[1.5rem] sm:rounded-[3rem] text-white text-sm sm:text-base placeholder-white/20 focus:border-[var(--primary)]/50 focus:bg-white/[0.05] outline-none transition-all font-serif italic resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSavingLetter}
                  className="w-full py-6 bg-white text-black rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:bg-[var(--primary)] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-2xl"
                >
                  {isSavingLetter ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Sparkles size={20} />
                  )}
                  {isSavingLetter ? 'Salvando...' : 'Salvar Carta'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation */}
      <AnimatePresence>
        {isDeleteAccountOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg luxury-glass border border-white/10 rounded-[3rem] p-12 text-center"
            >
              <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-rose-500 border border-rose-500/20">
                <Trash2 size={40} />
              </div>
              <h2 className="text-3xl font-serif text-white mb-4 italic">Encerrar Nossa Jornada?</h2>
              <p className="text-white/40 font-serif italic text-lg mb-10 leading-relaxed">
                Esta ação é irreversível. Todos os nossos álbuns, cartas e sintonias serão perdidos para sempre no vácuo do universo. Você tem certeza?
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={async () => {
                    if (user) {
                      await deleteUserAccount(user.uid);
                      handleLogout();
                      setIsDeleteAccountOpen(false);
                    }
                  }}
                  className="w-full py-6 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold uppercase tracking-[0.4em] transition-all shadow-xl shadow-rose-900/40"
                >
                  Sim, Apagar Tudo
                </button>
                <button 
                  onClick={() => setIsDeleteAccountOpen(false)}
                  className="w-full py-6 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold uppercase tracking-[0.4em] transition-all"
                >
                  Não, Ficaremos Bem
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </main>
      </FooterLayoutWrapper>

      {/* Cookie Consent System */}
      <CookieConsent />

      {/* Global Music Player that persists across views */}
      <GlobalMusicPlayer themeMode={themeMode} />
      
      {/* SaaS Builder Overlay */}
      <AnimatePresence>
        {showWizard && (
          <ProposalWizard onClose={() => setShowWizard(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Cursor />
      <AppInternal />
    </ToastProvider>
  );
}
