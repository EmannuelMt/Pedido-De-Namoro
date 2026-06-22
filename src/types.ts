export interface Game {
  id: string;
  name: string;
  description: string;
  category: 'casal' | 'quiz' | 'sorte' | 'arcade' | 'memorias' | 'desafios';
  thumbnail: string;
}

export interface GameScore {
  id?: string;
  userId: string;
  userName: string;
  gameId: string;
  score: number;
  createdAt: Date | any;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number; // in Love Coins / Heart Points
}

export interface UserAchievement {
  id?: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date | any;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // index of the correct option
  explanation?: string;
}

export interface CustomQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  createdBy: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed?: boolean;
}

// ... existing interfaces ...

export interface TruthOrDareItem {
  type: 'truth' | 'dare';
  category: 'romantico' | 'divertido' | 'casal' | 'aleatorio';
  text: string;
}

// Theme Types
export type ThemeCategory = 
  | 'Classic'
  | 'Gamer' 
  | 'Dev' 
  | 'Dark' 
  | 'Romance' 
  | 'RPG'
  | 'Teatro'
  | 'Cinemático' 
  | 'Cartoon' 
  | 'Anime'
  | 'Animação'
  | 'Espiritual'
  | 'Corporativo'
  | 'Experimental'
  | 'Musical'
  | 'Viagem'
  | 'Sazonais';

export type LayoutType = 
  // Classic
  | 'classic-dashboard' | 'premium-sidebar' | 'elegant-center'
  // Gamer
  | 'game-hud' | 'quest-board' | 'forest-hud' | 'battle-command' | 'adventure-journal' | 'farm-dashboard' | 'world-map' | 'hunter-log' | 'artifact-vault' | 'open-world-ui'
  // Dev
  | 'dev-terminal' | 'code-editor' | 'dashboard-modular'
  // Dark
  | 'dark-focus' | 'floating-dark' | 'shadow-layout'
  // Romance
  | 'romantic-center' | 'love-story' | 'timeline-story'
  // RPG
  | 'quest-book' | 'guild-panel' | 'inventory-layout' | 'adventure-map'
  // Teatro
  | 'stage-layout' | 'curtain-reveal' | 'spotlight-focus'
  // Cinematico
  | 'cinema-scroll' | 'fullscreen-focus' | 'movie-scene'
  // Cartoon
  | 'comic-grid' | 'speech-bubble' | 'toon-panel' | 'sketch-board' | 'playful-grid' | 'crayon-canvas' | 'comic-panels' | 'forest-story' | 'floating-town' | 'watercolor-flow' | 'cozy-home'
  // Anime
  | 'anime-panel' | 'manga-reader' | 'visual-novel'
  // Animacao
  | 'storybook-layout' | 'animated-scroll' | 'motion-canvas'
  // Espiritual
  | 'aura-flow' | 'energy-pulse' | 'ritual-circle'
  // Corporativo
  | 'dashboard-pro' | 'analytics-grid' | 'kanban-flow' | 'enterprise-board' | 'document-manager' | 'eco-dashboard' | 'city-grid' | 'finance-panel' | 'premium-board' | 'classic-office'
  // Experimental
  | 'glitch-grid' | 'interactive-chaos' | 'liquid-layout'
  // Musical
  | 'wave-layout' | 'rhythm-flow' | 'audio-visual'
  // Viagem
  | 'travel-diary' | 'map-explorer' | 'memory-route'
  | 'standard' 
  | 'gaming' 
  | 'terminal' 
  | 'cinematic' 
  | 'romantic' 
  | 'cartoon' 
  | 'theater'
  | 'animation'
  | 'rpg'
  | 'anime';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  cardBg: string;
  bodyBg: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  category: ThemeCategory;
  layout: LayoutType;
  sidebar?: string;
  notifications?: string;
  proposalStyle?: string;
  sounds?: string;
  animations?: string;
  
  colors: ThemeColors;
  components?: any; // To allow specific component styling configs later
  specialEvents?: any;
  
  animationsEnabled: boolean;
  activeEffects: string[];
  fontFamily: string;
  backgroundImage?: string;
  soundUrl?: string;
  premium: boolean;
  createdAt?: string;
  isCustom?: boolean;
  buttonLabel?: string;
  description?: string;
}

export interface ThemeLabels {
  home: {
    title: string;
    subtitle: string;
    description: string;
    buttonBack: string;
    buttonConfig: string;
    photoLabel: string;
    loveButton: string;
    counterTitle: string;
    counterBadge: string;
  };
  navigation: {
    inicio: string;
    historia: string;
    galeria: string;
    albuns: string;
    musicas: string;
    jogos: string;
    pedido: string;
  };
}

export interface Comment {
  author: string;
  text: string;
  timestamp: string;
}

export interface ChatLine {
  sender: 'Voce' | 'Himesama';
  text: string;
}

export interface Moment {
  id: string;
  chapterId: number;
  title: string;
  date: string;
  description: string;
  location: string;
  music?: string;
  image: string | null;
  emotion: string;
  isPrivate: boolean;
  chatLines?: ChatLine[];
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  location: string;
  feeling: string;
  story: string;
  songTitle?: string;
  songUrl?: string;
  category: '❤️ Nossos Momentos' | '🌸 Datas Especiais' | '✈️ Viagens' | '🎂 Comemorações' | '😂 Momentos Engraçados' | '📷 Fotos Aleatórias' | '🔒 Privadas';
  theme: 'cartoon' | 'romance' | 'anime' | 'nature' | 'vintage';
  imageUrl: string;
  likes?: number;
  comments?: Comment[];
  addedBy?: string;
  createdAt?: any;
}

export interface Album {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImage: string;
  category: 'Viagem' | 'Aniversário' | 'Passeio' | 'Família' | 'Namoro' | 'Datas Especiais' | 'Aleatório';
  privacy: 'Público' | 'Privado' | 'Somente Convidados';
  createdAt: Date | any;
  updatedAt: Date | any;
}
