import { create } from 'zustand';

// Detailed structures for full customization matching User request
export interface ThemeDefinition {
  name: string;
  desc: string;
  hex1: string; // Background
  hex2: string; // Accent
  variables: {
    bg: string;
    text: string;
    primary: string;
    primaryHover: string;
    border: string;
    secondary?: string;
    accent?: string;
    textMuted?: string;
  };
  font?: string;
  fontSize?: string;
  layout?: string;
  buttonStyle?: string;
  glassmorphism?: boolean;
  neon?: boolean;
  gradients?: boolean;
  category?: string;
}

export interface WallpaperConfig {
  url: string;
  opacity: number;
  blur: number;
  target?: string;
}

export interface ComponentStyleConfig {
  navbar: {
    color: string;
    blur: number;
    opacity: number;
    height: number;
    border: boolean;
  };
  sidebar: {
    color: string;
    width: number;
    iconStyle: string; // "minimal" | "colored" | "bordered"
  };
  card: {
    shadow: string; // "none" | "flat" | "neon" | "retro"
    border: string; // "none" | "thin" | "bold"
    glassmorphism: boolean;
  };
  button: "square" | "rounded" | "pill";
}

// Default Presets as requested by user
export const PRESET_THEMES: Record<string, ThemeDefinition> = {
  // --- Dark Mode Collection ---
  "Midnight Obsidian": {
    name: "Midnight Obsidian",
    desc: "Preto total com sutis acentos de obsidiana",
    category: "🌙 Dark Mode Collection",
    hex1: "#000000",
    hex2: "#27272A",
    variables: {
      bg: "#050505",
      text: "#FAFAFA",
      primary: "#27272A",
      primaryHover: "#3F3F46",
      border: "#18181B",
      secondary: "#09090B",
      accent: "#3F3F46",
      textMuted: "#A1A1AA"
    },
    font: "Inter",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "rounded"
  },
  "Cyber Neon": {
    name: "Cyber Neon",
    desc: "Tema escuro com linhas e luzes neon cyberpunk",
    category: "🌙 Dark Mode Collection",
    hex1: "#0F172A",
    hex2: "#06B6D4",
    variables: {
      bg: "#020617",
      text: "#F8FAFC",
      primary: "#06B6D4",
      primaryHover: "#0891B2",
      border: "#0EA5E9",
      secondary: "#0F172A",
      accent: "#6366F1",
      textMuted: "#94A3B8"
    },
    font: "Space Grotesk",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "square",
    neon: true
  },
  "Dracula Night": {
    name: "Dracula Night",
    desc: "Cores de drácula adoradas por desenvolvedores",
    category: "🌙 Dark Mode Collection",
    hex1: "#282A36",
    hex2: "#FF79C6",
    variables: {
      bg: "#282A36",
      text: "#F8F8F2",
      primary: "#FF79C6",
      primaryHover: "#FF92DF",
      border: "#6272A4",
      secondary: "#44475A",
      accent: "#BD93F9",
      textMuted: "#6272A4"
    },
    font: "Fira Code",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "rounded"
  },
  "Dark Velvet": {
    name: "Dark Velvet",
    desc: "Tom vermelho escuro aveludado da realeza",
    category: "🌙 Dark Mode Collection",
    hex1: "#2B0B14",
    hex2: "#E11D48",
    variables: {
      bg: "#1A050B",
      text: "#FFF1F2",
      primary: "#E11D48",
      primaryHover: "#BE123C",
      border: "#4C1D2A",
      secondary: "#2B0B14",
      accent: "#F43F5E",
      textMuted: "#FDA4AF"
    },
    font: "Playfair Display",
    fontSize: "normal",
    layout: "default",
    buttonStyle: "pill"
  },
  "Cosmic Void": {
    name: "Cosmic Void",
    desc: "Roxo profundo sem bordas visíveis, fundo do cosmos",
    category: "🌙 Dark Mode Collection",
    hex1: "#0B051A",
    hex2: "#8B5CF6",
    variables: {
      bg: "#05020B",
      text: "#EEEEEE",
      primary: "#8B5CF6",
      primaryHover: "#7C3AED",
      border: "#1B103A",
      secondary: "#0B051A",
      accent: "#A78BFA",
      textMuted: "#6D5C96"
    },
    font: "Outfit",
    fontSize: "normal",
    layout: "compact",
    buttonStyle: "rounded"
  },

  // --- Nature Collection ---
  "Sage Garden": {
    name: "Sage Garden",
    desc: "Visual calmo e elegante de jardim de sálvia",
    category: "🌿 Nature Collection",
    hex1: "#6B8F71",
    hex2: "#DDE5D8",
    variables: {
      bg: "#F4F7F4",
      text: "#2D3A2F",
      primary: "#6B8F71",
      primaryHover: "#557259",
      border: "#6B8F71",
      secondary: "#DDE5D8",
      accent: "#A4C3A2",
      textMuted: "#557259"
    },
    font: "Space Grotesk",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "rounded"
  },
  "Deep Basalt": {
    name: "Deep Basalt",
    desc: "Pedra vulcânica e escura profunda",
    category: "🌿 Nature Collection",
    hex1: "#1F2937",
    hex2: "#6B7280",
    variables: {
      bg: "#111827",
      text: "#F3F4F6",
      primary: "#1F2937",
      primaryHover: "#374151",
      border: "#6B7280",
      secondary: "#1F2937",
      accent: "#374151",
      textMuted: "#9CA3AF"
    },
    font: "Inter",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "square"
  },
  "Warm Clay": {
    name: "Warm Clay",
    desc: "Tom terroso sofisticado e acolhedor",
    category: "🌿 Nature Collection",
    hex1: "#B5654A",
    hex2: "#D6A77A",
    variables: {
      bg: "#FDFBF7",
      text: "#3D271D",
      primary: "#B5654A",
      primaryHover: "#96513A",
      border: "#B5654A",
      secondary: "#D6A77A",
      accent: "#F4D6B0",
      textMuted: "#8C5C4A"
    },
    font: "Outfit",
    fontSize: "normal",
    layout: "default",
    buttonStyle: "rounded"
  },
  "Morning Mist": {
    name: "Morning Mist",
    desc: "Minimalista, suave como neblina matinal",
    category: "🌿 Nature Collection",
    hex1: "#CBD5E1",
    hex2: "#94A3B8",
    variables: {
      bg: "#F8FAFC",
      text: "#1E293B",
      primary: "#CBD5E1",
      primaryHover: "#94A3B8",
      border: "#94A3B8",
      secondary: "#E2E8F0",
      accent: "#E2E8F0",
      textMuted: "#64748B"
    },
    font: "Inter",
    fontSize: "normal",
    layout: "default",
    buttonStyle: "rounded"
  },
  "Arctic Glacier": {
    name: "Arctic Glacier",
    desc: "Frio, fresco, cristalino e tecnológico",
    category: "🌿 Nature Collection",
    hex1: "#38BDF8",
    hex2: "#0EA5E9",
    variables: {
      bg: "#F0F9FF",
      text: "#0369A1",
      primary: "#38BDF8",
      primaryHover: "#0EA5E9",
      border: "#0ea5e9",
      secondary: "#E0F2FE",
      accent: "#BAE6FD",
      textMuted: "#0284C7"
    },
    font: "Outfit",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "pill"
  },
  "Deep Ocean": {
    name: "Deep Ocean",
    desc: "Profundo e misterioso como o fundo do oceano",
    category: "🌿 Nature Collection",
    hex1: "#0F172A",
    hex2: "#3B82F6",
    variables: {
      bg: "#0B0F19",
      text: "#F8FAFC",
      primary: "#3B82F6",
      primaryHover: "#2563EB",
      border: "#1E3A8A",
      secondary: "#1E3A8A",
      accent: "#1E293B",
      textMuted: "#94A3B8"
    },
    font: "Inter",
    fontSize: "normal",
    layout: "default",
    buttonStyle: "rounded"
  },
  "Aurora Borealis": {
    name: "Aurora Borealis",
    desc: "Mistura estonteante de verde cósmico e roxo",
    category: "🌿 Nature Collection",
    hex1: "#14B8A6",
    hex2: "#8B5CF6",
    variables: {
      bg: "#080614",
      text: "#E0F2FE",
      primary: "#14B8A6",
      primaryHover: "#0D9488",
      border: "#8B5CF6",
      secondary: "#1E1A34",
      accent: "#22C55E",
      textMuted: "#A78BFA"
    },
    font: "Space Grotesk",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "rounded",
    neon: true
  },

  // --- Romance Collection ---
  "Petal Soft": {
    name: "Petal Soft",
    desc: "Delicado toque de pétalas rosadas",
    category: "❤️ Romance Collection",
    hex1: "#F9A8D4",
    hex2: "#EC4899",
    variables: {
      bg: "#FFF5F7",
      text: "#4D0E1D",
      primary: "#F9A8D4",
      primaryHover: "#EC4899",
      border: "#F9A8D4",
      secondary: "#FCE7F3",
      accent: "#FBCFE8",
      textMuted: "#C2410C"
    },
    font: "Poppins",
    fontSize: "normal",
    layout: "default",
    buttonStyle: "pill"
  },
  "Eternal Gold": {
    name: "Eternal Gold",
    desc: "Tema premium ouro real e preto de luxo",
    category: "❤️ Romance Collection",
    hex1: "#FFD700",
    hex2: "#1E1E1E",
    variables: {
      bg: "#111111",
      text: "#FFFEEF",
      primary: "#FFD700",
      primaryHover: "#FFB800",
      border: "#FFD700",
      secondary: "#1E1E1E",
      accent: "#FFB800",
      textMuted: "#A8A29E"
    },
    font: "Space Grotesk",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "square",
    neon: true
  },
  "Moonlight Date": {
    name: "Moonlight Date",
    desc: "Elegante jantar à luz da lua",
    category: "❤️ Romance Collection",
    hex1: "#1E293B",
    hex2: "#F8FAFC",
    variables: {
      bg: "#0F172A",
      text: "#F8FAFC",
      primary: "#1E293B",
      primaryHover: "#475569",
      border: "#F8FAFC",
      secondary: "#334155",
      accent: "#475569",
      textMuted: "#94A3B8"
    },
    font: "Poppins",
    fontSize: "normal",
    layout: "default",
    buttonStyle: "rounded"
  },
  "Sweet Velvet": {
    name: "Sweet Velvet",
    desc: "Veludo doce de cores profundas e quentes",
    category: "❤️ Romance Collection",
    hex1: "#9D174D",
    hex2: "#DB2777",
    variables: {
      bg: "#FCF0F5",
      text: "#500724",
      primary: "#9D174D",
      primaryHover: "#DB2777",
      border: "#9D174D",
      secondary: "#FBCFE8",
      accent: "#F472B6",
      textMuted: "#BE185D"
    },
    font: "Poppins",
    fontSize: "normal",
    layout: "default",
    buttonStyle: "rounded"
  },
  "Cosmic Nebula": {
    name: "Cosmic Nebula",
    desc: "Incandescente poeira cósmica roxa e rosa",
    category: "❤️ Romance Collection",
    hex1: "#7C3AED",
    hex2: "#C084FC",
    variables: {
      bg: "#0B001A",
      text: "#F5F2F9",
      primary: "#7C3AED",
      primaryHover: "#C084FC",
      border: "#7C3AED",
      secondary: "#1E1B4B",
      accent: "#C084FC",
      textMuted: "#A78BFA"
    },
    font: "Outfit",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "pill",
    neon: true
  },
  "Luxury Classic": {
    name: "Luxury Classic",
    desc: "Clássico suntuoso de preto e dourado fosco",
    category: "❤️ Romance Collection",
    hex1: "#C9A227",
    hex2: "#111827",
    variables: {
      bg: "#0A0D14",
      text: "#FFFDF0",
      primary: "#C9A227",
      primaryHover: "#F5E6A5",
      border: "#C9A227",
      secondary: "#111827",
      accent: "#374151",
      textMuted: "#9CA3AF"
    },
    font: "Space Grotesk",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "square"
  },

  // --- Gamer Collection ---
  "Mushroom Kingdom": {
    name: "Mushroom Kingdom",
    desc: "Aventura retro divertida nas cores clássicas",
    category: "🎮 Gamer Collection",
    hex1: "#FF2E2E",
    hex2: "#ECC94B",
    variables: {
      bg: "#FFFDF5",
      text: "#1A202C",
      primary: "#FF2E2E",
      primaryHover: "#FF0000",
      border: "#1A202C",
      secondary: "#3182CE",
      accent: "#ECC94B",
      textMuted: "#718096"
    },
    font: "Press Start 2P",
    fontSize: "normal",
    layout: "compact",
    buttonStyle: "square"
  },
  "Spike Planted": {
    name: "Spike Planted",
    desc: "Visual neon tático inspirado em FPS",
    category: "🎮 Gamer Collection",
    hex1: "#FF003C",
    hex2: "#202024",
    variables: {
      bg: "#121214",
      text: "#FFFFFF",
      primary: "#FF003C",
      primaryHover: "#CC0030",
      border: "#FF003C",
      secondary: "#202024",
      accent: "#3E3E42",
      textMuted: "#8E8E93"
    },
    font: "Orbitron",
    fontSize: "normal",
    layout: "compact",
    buttonStyle: "square",
    neon: true
  },
  "Global Offensive": {
    name: "Global Offensive",
    desc: "Estilo militar com detalhes laranja neon",
    category: "🎮 Gamer Collection",
    hex1: "#FF9800",
    hex2: "#263238",
    variables: {
      bg: "#1B1E22",
      text: "#ECEFF1",
      primary: "#FF9800",
      primaryHover: "#F57C00",
      border: "#455A64",
      secondary: "#263238",
      accent: "#37474F",
      textMuted: "#90A4AE"
    },
    font: "Inter",
    fontSize: "normal",
    layout: "compact",
    buttonStyle: "square"
  },
  "Arcade Classic": {
    name: "Arcade Classic",
    desc: "O feeling das velhas arcades dos anos 80",
    category: "🎮 Gamer Collection",
    hex1: "#9D4EDD",
    hex2: "#FFEB3B",
    variables: {
      bg: "#000000",
      text: "#00FFFF",
      primary: "#9D4EDD",
      primaryHover: "#7B2CBF",
      border: "#00FFFF",
      secondary: "#1A0933",
      accent: "#FFEB3B",
      textMuted: "#B5179E"
    },
    font: "Press Start 2P",
    fontSize: "normal",
    layout: "compact",
    buttonStyle: "square",
    neon: true
  },
  "Cyberpunk Neo": {
    name: "Cyberpunk Neo",
    desc: "Futurista saturado de luzes neon",
    category: "🎮 Gamer Collection",
    hex1: "#FF007F",
    hex2: "#00FFFF",
    variables: {
      bg: "#000000",
      text: "#00FFFF",
      primary: "#FF007F",
      primaryHover: "#CC0066",
      border: "#00FFFF",
      secondary: "#111111",
      accent: "#FF007F",
      textMuted: "#FFFFFF"
    },
    font: "Orbitron",
    fontSize: "normal",
    layout: "compact",
    buttonStyle: "square",
    neon: true
  },
  "8-Bit Retro": {
    name: "8-Bit Retro",
    desc: "Estética pura de fósforo verde clássico",
    category: "🎮 Gamer Collection",
    hex1: "#00FF41",
    hex2: "#000000",
    variables: {
      bg: "#080F08",
      text: "#00FF41",
      primary: "#00FF41",
      primaryHover: "#00CC33",
      border: "#00FF41",
      secondary: "#020402",
      accent: "#00FF41",
      textMuted: "#009922"
    },
    font: "Press Start 2P",
    fontSize: "normal",
    layout: "compact",
    buttonStyle: "square",
    neon: true
  },

  // --- Developer Collection ---
  "Code Midnight": {
    name: "Code Midnight",
    desc: "Visual aconchegante inspirado no GitHub",
    category: "💻 Developer Collection",
    hex1: "#0D1117",
    hex2: "#58A6FF",
    variables: {
      bg: "#0D1117",
      text: "#C9D1D9",
      primary: "#58A6FF",
      primaryHover: "#1F6FEB",
      border: "#30363D",
      secondary: "#161B22",
      accent: "#21262D",
      textMuted: "#8B949E"
    },
    font: "Fira Code",
    fontSize: "normal",
    layout: "compact",
    buttonStyle: "rounded"
  },
  "Transita Tech": {
    name: "Transita Tech",
    desc: "Ciano neon e roxo profundo moderno",
    category: "💻 Developer Collection",
    hex1: "#06B6D4",
    hex2: "#8B5CF6",
    variables: {
      bg: "#0B0F19",
      text: "#E2E8F0",
      primary: "#06B6D4",
      primaryHover: "#0891B2",
      border: "#8B5CF6",
      secondary: "#111827",
      accent: "#8B5CF6",
      textMuted: "#94A3B8"
    },
    font: "Fira Code",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "rounded"
  },
  "Matrix Terminal": {
    name: "Matrix Terminal",
    desc: "Desça na toca do coelho com o código terminal",
    category: "💻 Developer Collection",
    hex1: "#00FF41",
    hex2: "#000000",
    variables: {
      bg: "#000000",
      text: "#00FF41",
      primary: "#00FF41",
      primaryHover: "#00CC33",
      border: "#00FF41",
      secondary: "#050505",
      accent: "#00FF41",
      textMuted: "#008F11"
    },
    font: "Fira Code",
    fontSize: "normal",
    layout: "compact",
    buttonStyle: "square",
    neon: true
  },
  "Compiler Light": {
    name: "Compiler Light",
    desc: "Tema claro de alto contraste e foco",
    category: "💻 Developer Collection",
    hex1: "#FFFFFF",
    hex2: "#2563EB",
    variables: {
      bg: "#FFFFFF",
      text: "#1F2937",
      primary: "#2563EB",
      primaryHover: "#1D4ED8",
      border: "#D1D5DB",
      secondary: "#F3F4F6",
      accent: "#E5E7EB",
      textMuted: "#6B7280"
    },
    font: "Fira Code",
    fontSize: "normal",
    layout: "default",
    buttonStyle: "rounded"
  },
  "Draft Blueprint": {
    name: "Draft Blueprint",
    desc: "Projetando em azul técnico clássico",
    category: "💻 Developer Collection",
    hex1: "#1E40AF",
    hex2: "#DBEAFE",
    variables: {
      bg: "#102A6B",
      text: "#FFFFFF",
      primary: "#DBEAFE",
      primaryHover: "#BFDBFE",
      border: "#60A5FA",
      secondary: "#1E40AF",
      accent: "#2563EB",
      textMuted: "#93C5FD"
    },
    font: "Fira Code",
    fontSize: "normal",
    layout: "default",
    buttonStyle: "square"
  },

  // --- Cinema Collection ---
  "Golden Age": {
    name: "Golden Age",
    desc: "A era de ouro do cinema em dourado e marfim",
    category: "🎬 Cinema Collection",
    hex1: "#D4AF37",
    hex2: "#0A0A0C",
    variables: {
      bg: "#0A0A0C",
      text: "#FDFBF7",
      primary: "#D4AF37",
      primaryHover: "#AA8C2C",
      border: "#D4AF37",
      secondary: "#16161A",
      accent: "#FFFFF0",
      textMuted: "#7E7E8A"
    },
    font: "Playfair Display",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "square"
  },
  "Technicolor": {
    name: "Technicolor",
    desc: "Estilo retro nostálgico de cores vibrantes",
    category: "🎬 Cinema Collection",
    hex1: "#D2143A",
    hex2: "#1D55A5",
    variables: {
      bg: "#FAF9F6",
      text: "#1C1C1C",
      primary: "#D2143A",
      primaryHover: "#9E0E2A",
      border: "#1D55A5",
      secondary: "#1D55A5",
      accent: "#E9B824",
      textMuted: "#5F5F5F"
    },
    font: "Playfair Display",
    fontSize: "normal",
    layout: "default",
    buttonStyle: "rounded"
  },
  "Director's Cut": {
    name: "Director's Cut",
    desc: "Alto contraste cru e sofisticado",
    category: "🎬 Cinema Collection",
    hex1: "#1A1A1A",
    hex2: "#FFFFFF",
    variables: {
      bg: "#050505",
      text: "#F5F5F5",
      primary: "#1A1A1A",
      primaryHover: "#2A2A2A",
      border: "#FFFFFF",
      secondary: "#111111",
      accent: "#333333",
      textMuted: "#7F7F7F"
    },
    font: "Playfair Display",
    fontSize: "normal",
    layout: "compact",
    buttonStyle: "square"
  },
  "Noir Film": {
    name: "Noir Film",
    desc: "Estilo misterioso em escalas cinzas clássicas",
    category: "🎬 Cinema Collection",
    hex1: "#FFFFFF",
    hex2: "#181818",
    variables: {
      bg: "#181818",
      text: "#E5E5E5",
      primary: "#FFFFFF",
      primaryHover: "#CCCCCC",
      border: "#E5E5E5",
      secondary: "#262626",
      accent: "#404040",
      textMuted: "#A3A3A3"
    },
    font: "Playfair Display",
    fontSize: "normal",
    layout: "default",
    buttonStyle: "square"
  },

  // --- Experimental Collection ---
  "Glitch Reality": {
    name: "Glitch Reality",
    desc: "Realidade distorcida em ciano e magenta",
    category: "🧪 Experimental Collection",
    hex1: "#FF00F5",
    hex2: "#00FFFF",
    variables: {
      bg: "#000000",
      text: "#00FFFF",
      primary: "#FF00F5",
      primaryHover: "#CC00C4",
      border: "#00FFFF",
      secondary: "#050505",
      accent: "#FF00F5",
      textMuted: "#FFFFFF"
    },
    font: "Orbitron",
    fontSize: "normal",
    layout: "compact",
    buttonStyle: "square",
    neon: true
  },
  "Neural Drift": {
    name: "Neural Drift",
    desc: "Inteligência artificial e redes elétricas",
    category: "🧪 Experimental Collection",
    hex1: "#6366F1",
    hex2: "#10B981",
    variables: {
      bg: "#03000A",
      text: "#F1ECF9",
      primary: "#6366F1",
      primaryHover: "#4F46E5",
      border: "#10B981",
      secondary: "#0F172A",
      accent: "#3B82F6",
      textMuted: "#818CF8"
    },
    font: "Orbitron",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "rounded",
    neon: true
  },

  // --- Classic Collection ---
  "Glassmorphism": {
    name: "Glassmorphism",
    desc: "Efeito translúcido ultrafino e premium",
    category: "✨ Classic Collection",
    hex1: "#FCF9F2",
    hex2: "#E84E4E",
    variables: {
      bg: "#FCF9F2",
      text: "#1A1A1A",
      primary: "#E84E4E",
      primaryHover: "#C93D3D",
      border: "#1A1A1A",
      secondary: "#FFFFFF",
      accent: "#F4EDE1",
      textMuted: "#666666"
    },
    font: "Space Grotesk",
    fontSize: "normal",
    layout: "modern",
    buttonStyle: "rounded",
    glassmorphism: true
  }
};

export interface SavedUserTheme {
  id: string;
  name: string;
  variables: ThemeDefinition["variables"];
  font: string;
  fontSize: string;
  layout: string;
  mode: string;
  animations: string;
}

interface ThemeState {
  theme: string;
  loading: boolean;
  
  // Custom Styles
  customPrimary: string;
  customSecondary: string;
  customAccent: string;
  customBg: string;
  customText: string;
  
  // Display & Fonts
  mode: "light" | "dark" | "auto";
  fontFamily: string;
  fontSize: "small" | "normal" | "large" | "xlarge";
  layoutStyle: "compact" | "default" | "modern";
  
  // Custom Controls config
  componentConfig: ComponentStyleConfig;
  visualEffects: {
    glassmorphism: boolean;
    neon: boolean;
    gradients: boolean;
    reflections: boolean;
  };
  animationSettings: {
    speed: "smooth" | "normal" | "fast" | "disabled";
    hoverEffect: "scale" | "glow" | "elevation" | "rotation";
    transitionsType: "fade" | "slide" | "zoom";
  };
  accessibility: {
    highContrast: boolean;
    reduceMotion: boolean;
    screenReaderSim: boolean;
    fontAmplified: boolean;
  };

  // Saved theme instances
  savedThemes: SavedUserTheme[];
  activeWallpaper: WallpaperConfig | null;
  globalWallpaper: WallpaperConfig | null;
  pageWallpapers: Record<string, WallpaperConfig>;
  
  // Actions
  setTheme: (themeName: string, saveToDb?: boolean) => Promise<void>;
  updateCustomStyles: (updates: Partial<{
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    text: string;
    mode: "light" | "dark" | "auto";
    fontFamily: string;
    fontSize: "small" | "normal" | "large" | "xlarge";
    layoutStyle: "compact" | "default" | "modern";
  }>, saveToDb?: boolean) => Promise<void>;
  
  updateComponentConfig: (cfg: Partial<ComponentStyleConfig>, saveToDb?: boolean) => Promise<void>;
  updateVisualEffects: (cfg: Partial<ThemeState["visualEffects"]>, saveToDb?: boolean) => Promise<void>;
  updateAnimationSettings: (cfg: Partial<ThemeState["animationSettings"]>, saveToDb?: boolean) => Promise<void>;
  updateAccessibility: (cfg: Partial<ThemeState["accessibility"]>, saveToDb?: boolean) => Promise<void>;
  
  setWallpaper: (globalWallpaper: WallpaperConfig | null, pageWallpapers: Record<string, WallpaperConfig>, saveToDb?: boolean) => Promise<void>;
  
  // Custom Theme functions
  saveCustomTheme: (name: string) => Promise<void>;
  deleteCustomTheme: (id: string) => Promise<void>;
  importTheme: (jsonStr: string) => Promise<void>;
  
  loadTheme: () => Promise<void>;
  applyStylesToDOM: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'Artistic Flair',
  loading: true,
  
  // Active custom overrides
  customPrimary: "#e84e4e",
  customSecondary: "#ffffff",
  customAccent: "#f4ede1",
  customBg: "#fcf9f2",
  customText: "#1a1a1a",
  
  mode: "light",
  fontFamily: "Space Grotesk",
  fontSize: "normal",
  layoutStyle: "modern",
  
  componentConfig: {
    navbar: { color: "#ffffff", blur: 10, opacity: 90, height: 70, border: true },
    sidebar: { color: "#1a1a1a", width: 280, iconStyle: "minimal" },
    card: { shadow: "flat", border: "bold", glassmorphism: false },
    button: "square"
  },
  
  visualEffects: {
    glassmorphism: false,
    neon: false,
    gradients: false,
    reflections: false
  },
  
  animationSettings: {
    speed: "normal",
    hoverEffect: "scale",
    transitionsType: "fade"
  },
  
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    screenReaderSim: false,
    fontAmplified: false
  },

  savedThemes: [],
  activeWallpaper: null,
  globalWallpaper: null,
  pageWallpapers: {},

  setTheme: async (themeName, saveToDb = false) => {
    const preset = PRESET_THEMES[themeName];
    if (preset) {
      set({
        theme: themeName,
        customPrimary: preset.variables.primary,
        customSecondary: preset.variables.secondary || "#ffffff",
        customAccent: preset.variables.accent || "#fcf9f2",
        customBg: preset.variables.bg,
        customText: preset.variables.text,
        fontFamily: preset.font || "Space Grotesk",
        layoutStyle: (preset.layout as any) || "modern",
        visualEffects: {
          glassmorphism: !!preset.glassmorphism,
          neon: !!preset.neon,
          gradients: !!preset.gradients,
          reflections: false
        },
        componentConfig: {
          ...get().componentConfig,
          button: (preset.buttonStyle as any) || "square"
        }
      });
    } else {
      // Check saved user themes
      const customTheme = get().savedThemes.find(t => t.name === themeName);
      if (customTheme) {
        set({
          theme: themeName,
          customPrimary: customTheme.variables.primary,
          customSecondary: customTheme.variables.secondary || "#ffffff",
          customAccent: customTheme.variables.accent || "#fcf9f2",
          customBg: customTheme.variables.bg,
          customText: customTheme.variables.text,
          fontFamily: customTheme.font || "Space Grotesk",
          fontSize: customTheme.fontSize as any || "normal",
          layoutStyle: customTheme.layout as any || "modern",
          mode: customTheme.mode as any || "light",
        });
      }
    }

    get().applyStylesToDOM();

    if (saveToDb) {
      try {
        const { db, auth } = await import('../lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        if (auth.currentUser) {
          await setDoc(doc(db, "settings", "appearance_config"), {
            theme: get().theme,
            customPrimary: get().customPrimary,
            customSecondary: get().customSecondary,
            customAccent: get().customAccent,
            customBg: get().customBg,
            customText: get().customText,
            mode: get().mode,
            fontFamily: get().fontFamily,
            fontSize: get().fontSize,
            layoutStyle: get().layoutStyle,
            componentConfig: get().componentConfig,
            visualEffects: get().visualEffects,
            animationSettings: get().animationSettings,
            accessibility: get().accessibility,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (e) {
        console.error("Erro ao salvar tema no Firestore:", e);
      }
    }
  },

  updateCustomStyles: async (updates, saveToDb = false) => {
    set((state) => ({
      theme: "Tema Personalizado",
      customPrimary: updates.primary !== undefined ? updates.primary : state.customPrimary,
      customSecondary: updates.secondary !== undefined ? updates.secondary : state.customSecondary,
      customAccent: updates.accent !== undefined ? updates.accent : state.customAccent,
      customBg: updates.bg !== undefined ? updates.bg : state.customBg,
      customText: updates.text !== undefined ? updates.text : state.customText,
      mode: updates.mode !== undefined ? updates.mode : state.mode,
      fontFamily: updates.fontFamily !== undefined ? updates.fontFamily : state.fontFamily,
      fontSize: updates.fontSize !== undefined ? updates.fontSize : state.fontSize,
      layoutStyle: updates.layoutStyle !== undefined ? updates.layoutStyle : state.layoutStyle,
    }));

    get().applyStylesToDOM();

    if (saveToDb) {
      try {
        const { db, auth } = await import('../lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        if (auth.currentUser) {
          await setDoc(doc(db, "settings", "appearance_config"), {
            theme: "Tema Personalizado",
            customPrimary: get().customPrimary,
            customSecondary: get().customSecondary,
            customAccent: get().customAccent,
            customBg: get().customBg,
            customText: get().customText,
            mode: get().mode,
            fontFamily: get().fontFamily,
            fontSize: get().fontSize,
            layoutStyle: get().layoutStyle,
            componentConfig: get().componentConfig,
            visualEffects: get().visualEffects,
            animationSettings: get().animationSettings,
            accessibility: get().accessibility,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (e) {
        console.error("Erro ao sincronizar customizer no Firestore:", e);
      }
    }
  },

  updateComponentConfig: async (cfg, saveToDb = false) => {
    set((state) => ({
      componentConfig: {
        ...state.componentConfig,
        ...cfg
      }
    }));
    get().applyStylesToDOM();

    if (saveToDb) {
      try {
        const { db, auth } = await import('../lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        if (auth.currentUser) {
          await setDoc(doc(db, "settings", "appearance_config"), {
            componentConfig: get().componentConfig,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (e) {
        console.error("Erro ao salvar config de componentes:", e);
      }
    }
  },

  updateVisualEffects: async (cfg, saveToDb = false) => {
    set((state) => ({
      visualEffects: {
        ...state.visualEffects,
        ...cfg
      }
    }));
    get().applyStylesToDOM();

    if (saveToDb) {
      try {
        const { db, auth } = await import('../lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        if (auth.currentUser) {
          await setDoc(doc(db, "settings", "appearance_config"), {
            visualEffects: get().visualEffects,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (e) {
        console.error("Erro ao salvar efeitos visuais:", e);
      }
    }
  },

  updateAnimationSettings: async (cfg, saveToDb = false) => {
    set((state) => ({
      animationSettings: {
        ...state.animationSettings,
        ...cfg
      }
    }));
    get().applyStylesToDOM();

    if (saveToDb) {
      try {
        const { db, auth } = await import('../lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        if (auth.currentUser) {
          await setDoc(doc(db, "settings", "appearance_config"), {
            animationSettings: get().animationSettings,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (e) {
        console.error("Erro ao salvar config de animações:", e);
      }
    }
  },

  updateAccessibility: async (cfg, saveToDb = false) => {
    set((state) => ({
      accessibility: {
        ...state.accessibility,
        ...cfg
      }
    }));
    get().applyStylesToDOM();

    if (saveToDb) {
      try {
        const { db, auth } = await import('../lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        if (auth.currentUser) {
          await setDoc(doc(db, "settings", "appearance_config"), {
            accessibility: get().accessibility,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (e) {
        console.error("Erro ao salvar de acessibilidade:", e);
      }
    }
  },

  setWallpaper: async (globalWallpaper, pageWallpapers, saveToDb = false) => {
    set({ globalWallpaper, pageWallpapers });

    if (saveToDb) {
      try {
        const { db, auth } = await import('../lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        if (auth.currentUser) {
          await setDoc(doc(db, "settings", "wallpaper"), {
            globalWallpaper,
            pageWallpapers,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (e) {
        console.error("Erro ao salvar papel de parede no Firestore:", e);
      }
    }
  },

  saveCustomTheme: async (name) => {
    try {
      const newTheme: SavedUserTheme = {
        id: "theme_" + Date.now(),
        name,
        variables: {
          bg: get().customBg,
          text: get().customText,
          primary: get().customPrimary,
          primaryHover: get().customPrimary + "cc",
          border: get().visualEffects.neon ? get().customPrimary : get().customText,
          secondary: get().customSecondary,
          accent: get().customAccent,
        },
        font: get().fontFamily,
        fontSize: get().fontSize,
        layout: get().layoutStyle,
        mode: get().mode,
        animations: get().animationSettings.speed
      };

      const updatedSaved = [...get().savedThemes, newTheme];
      set({ savedThemes: updatedSaved, theme: name });

      const { db, auth } = await import('../lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      if (auth.currentUser) {
        await setDoc(doc(db, "settings", "saved_themes"), {
          themes: updatedSaved,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error("Erro ao cadastrar tema personalizado:", e);
    }
  },

  deleteCustomTheme: async (id) => {
    try {
      const updatedSaved = get().savedThemes.filter(t => t.id !== id);
      set({ savedThemes: updatedSaved });

      const { db, auth } = await import('../lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      if (auth.currentUser) {
        await setDoc(doc(db, "settings", "saved_themes"), {
          themes: updatedSaved,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error("Erro ao deletar tema do banco de dados:", e);
    }
  },

  importTheme: async (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.name && parsed.variables) {
        const newTheme: SavedUserTheme = {
          id: "theme_imported_" + Date.now(),
          name: parsed.name,
          variables: {
            bg: parsed.variables.bg || "#ffffff",
            text: parsed.variables.text || "#1a1a1a",
            primary: parsed.variables.primary || "#e84e4e",
            primaryHover: parsed.variables.primaryHover || "#c93d3d",
            border: parsed.variables.border || "#1a1a1a",
            secondary: parsed.variables.secondary || "#ffffff",
            accent: parsed.variables.accent || "#f4ede1",
          },
          font: parsed.font || "Space Grotesk",
          fontSize: parsed.fontSize || "normal",
          layout: parsed.layout || "modern",
          mode: parsed.mode || "light",
          animations: parsed.animations || "normal"
        };
        const updatedSaved = [...get().savedThemes, newTheme];
        set({ savedThemes: updatedSaved });

        const { db, auth } = await import('../lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        if (auth.currentUser) {
          await setDoc(doc(db, "settings", "saved_themes"), {
            themes: updatedSaved,
            updatedAt: new Date().toISOString()
          });
        }
      } else {
        throw new Error("Formato inválido de JSON de Tema.");
      }
    } catch (e: any) {
      throw new Error(e.message || "Falha no parse do arquivo de tema.");
    }
  },

  loadTheme: async () => {
    try {
      const { db } = await import('../lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      
      const [appearanceSnap, wallpaperSnap, savedThemesSnap] = await Promise.all([
        getDoc(doc(db, "settings", "appearance_config")),
        getDoc(doc(db, "settings", "wallpaper")),
        getDoc(doc(db, "settings", "saved_themes"))
      ]);
      
      if (savedThemesSnap.exists()) {
        set({ savedThemes: savedThemesSnap.data().themes || [] });
      }

      if (appearanceSnap.exists()) {
        const data = appearanceSnap.data();
        set({
          theme: data.theme || "Artistic Flair",
          customPrimary: data.customPrimary || "#e84e4e",
          customSecondary: data.customSecondary || "#ffffff",
          customAccent: data.customAccent || "#f4ede1",
          customBg: data.customBg || "#fcf9f2",
          customText: data.customText || "#1a1a1a",
          mode: data.mode || "light",
          fontFamily: data.fontFamily || "Space Grotesk",
          fontSize: data.fontSize || "normal",
          layoutStyle: data.layoutStyle || "modern",
          componentConfig: data.componentConfig ? { ...get().componentConfig, ...data.componentConfig } : get().componentConfig,
          visualEffects: data.visualEffects ? { ...get().visualEffects, ...data.visualEffects } : get().visualEffects,
          animationSettings: data.animationSettings ? { ...get().animationSettings, ...data.animationSettings } : get().animationSettings,
          accessibility: data.accessibility ? { ...get().accessibility, ...data.accessibility } : get().accessibility
        });
      }

      if (wallpaperSnap.exists()) {
        const wpData = wallpaperSnap.data();
        set({
          globalWallpaper: wpData.globalWallpaper || null,
          pageWallpapers: wpData.pageWallpapers || {}
        });
      }

      get().applyStylesToDOM();
    } catch (e) {
      console.error("Erro ao carregar tema/papel de parede do Firestore:", e);
      get().applyStylesToDOM();
    } finally {
      set({ loading: false });
    }
  },

  applyStylesToDOM: () => {
    const { 
      theme,
      customPrimary, 
      customSecondary, 
      customAccent, 
      customBg, 
      customText, 
      mode, 
      fontFamily, 
      fontSize, 
      layoutStyle,
      componentConfig,
      visualEffects,
      animationSettings,
      accessibility
    } = get();

    // 1. Detect Auto mode
    let appliedMode = mode;
    if (mode === "auto") {
      const isDarkOS = window.matchMedia('(prefers-color-scheme: dark)').matches;
      appliedMode = isDarkOS ? "dark" : "light";
    }

    // 2. Select variables based on highContrast or normal mode
    const bg = accessibility.highContrast 
      ? (appliedMode === "dark" ? "#000000" : "#ffffff") 
      : customBg;
    const text = accessibility.highContrast 
      ? (appliedMode === "dark" ? "#ffffff" : "#000000") 
      : customText;
    const primary = accessibility.highContrast 
      ? (appliedMode === "dark" ? "#00ffff" : "#ff0055") 
      : customPrimary;
    const border = visualEffects.neon ? primary : text;

    // Apply basic CSS properties
    document.documentElement.style.setProperty('--bg-custom', bg);
    document.documentElement.style.setProperty('--text-custom', text);
    document.documentElement.style.setProperty('--primary-custom', primary);
    document.documentElement.style.setProperty('--primary-hover', primary + "dc");
    document.documentElement.style.setProperty('--border-custom', border);

    // High fidelity global classes injections via dynamic <style> injection
    let styleContainer = document.getElementById('custom-theme-live-css');
    if (!styleContainer) {
      styleContainer = document.createElement('style');
      styleContainer.id = 'custom-theme-live-css';
      document.head.appendChild(styleContainer);
    }

    // Border Radius controls based on button customization
    let btnRadius = "0px";
    if (componentConfig.button === "rounded") btnRadius = "10px";
    if (componentConfig.button === "pill") btnRadius = "30px";

    // Space controls based on layout
    let globalPadding = "2rem";
    let globalGap = "1.5rem";
    if (layoutStyle === "compact") {
      globalPadding = "1rem";
      globalGap = "0.75rem";
    } else if (layoutStyle === "modern") {
      globalPadding = "3rem";
      globalGap = "2rem";
    }

    // Font size factor override
    let fontFactor = "1rem";
    if (fontSize === "small" || accessibility.fontAmplified) fontFactor = "0.85rem";
    if (fontSize === "large") fontFactor = "1.15rem";
    if (fontSize === "xlarge") fontFactor = "1.3rem";
    if (accessibility.fontAmplified) fontFactor = "1.25rem"; // Accessibility zoom

    // Built stylesheet content
    const styleContent = `
      body, html, .bg-\\[\\#fcf9f2\\], .bg-\\[\\#FCF9F2\\] {
        font-family: '${fontFamily}', sans-serif !important;
        font-size: ${fontFactor};
        background-color: ${bg} !important;
        color: ${text} !important;
      }
      
      /* Apply background & borders systematically */
      .bg-white, .bg-gray-50 {
        background-color: ${appliedMode === "dark" ? customSecondary : (theme === "Artistic Flair" || theme === "Tema Personalizado" ? '#ffffff' : customBg)} !important;
        color: ${text} !important;
      }
      
      .bg-gray-100 {
        background-color: ${customAccent} !important;
      }

      ${appliedMode === "dark" ? `
        .bg-\\[\\#1a1a1a\\] {
          background-color: ${customSecondary} !important;
        }
      ` : ''}
      
      /* Color selections adjustments */
      .text-\\[\\#1a1a1a\\], .text-gray-900 {
        color: ${text} !important;
      }
      .border-black, .border-2, .border {
        border-color: ${border} !important;
      }

      /* Custom Glassmorphism overlay style on cards */
      ${visualEffects.glassmorphism || componentConfig.card.glassmorphism ? `
        .bg-white, .card, .bg-gray-50 {
          background-color: rgba(from ${bg} r g b / 0.7) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }
      ` : ''}

      /* Custom Neon lights glow */
      ${visualEffects.neon ? `
        .bg-white, .card, button, .border-2 {
          box-shadow: 0 0 10px ${primary}33, inset 0 0 5px ${primary}11 !important;
          text-shadow: 0 0 4px ${primary}44 !important;
        }
      ` : ''}

      /* Transitions speeds adjustments */
      ${animationSettings.speed === "fast" ? `
        *, .transition, .transition-all {
          transition-duration: 100ms !important;
        }
      ` : animationSettings.speed === "smooth" ? `
        *, .transition, .transition-all {
          transition-duration: 500ms !important;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
      ` : animationSettings.speed === "disabled" ? `
        *, .transition, .transition-all {
          transition: none !important;
          animation: none !important;
        }
      ` : ''}

      /* Layout spaces overrides */
      .p-8, .p-6, .p-10 {
        padding: ${globalPadding} !important;
      }
      .gap-6, .space-y-6, .gap-8 {
        gap: ${globalGap} !important;
      }

      /* Override buttons radius strictly */
      button, .btn, .rounded-md, .rounded-full, .rounded-lg {
        border-radius: ${btnRadius} !important;
      }

      /* Dynamic hover actions interactive scale or glow effects */
      ${animationSettings.hoverEffect === "scale" ? `
        button:hover, .hover\\:-translate-y-1:hover {
          transform: scale(1.03) !important;
        }
      ` : animationSettings.hoverEffect === "rotation" ? `
        button:hover {
          transform: rotate(1deg) scale(1.02) !important;
        }
      ` : animationSettings.hoverEffect === "glow" ? `
        button:hover, .card:hover {
          box-shadow: 0 0 16px ${primary}cc !important;
        }
      ` : ''}
    `;

    styleContainer.textContent = styleContent;

    // Load External Google Font dynamically if needed
    let fontLink = document.getElementById('custom-theme-font-link');
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = 'custom-theme-font-link';
      fontLink.setAttribute('rel', 'stylesheet');
      document.head.appendChild(fontLink);
    }
    const safeFontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;500;700;900&display=swap`;
    fontLink.setAttribute('href', safeFontUrl);
  }
}));
