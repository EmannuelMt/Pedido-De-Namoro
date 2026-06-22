import fs from 'fs';

const tsContent = `import { ThemeConfig } from '../types';

export const THEMES: ThemeConfig[] = [
  // 🌿 NATUREZA (mapped to Espiritual)
  {
    id: 'nature_mystic_forest',
    name: 'Mystic Forest',
    category: 'Espiritual',
    colors: { primary: '#556B2F', secondary: '#E6D8C3', accent: '#6B8E23', text: '#6D4C41', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'aura-flow',
    animationsEnabled: true,
    activeEffects: ['floating-leaves'],
    fontFamily: 'Inter',
    premium: false
  },
  {
    id: 'nature_sage_garden',
    name: 'Sage Garden',
    category: 'Espiritual',
    colors: { primary: '#A8BBA3', secondary: '#F4EFE6', accent: '#C8A97E', text: '#5D6B5D', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'aura-flow',
    animationsEnabled: true,
    activeEffects: ['gentle-sway'],
    fontFamily: 'Inter',
    premium: false
  },
  {
    id: 'nature_aurora_valley',
    name: 'Aurora Valley',
    category: 'Espiritual',
    colors: { primary: '#7E9BAE', secondary: '#F5F5F3', accent: '#8AA399', text: '#C7C2B8', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'aura-flow',
    animationsEnabled: true,
    activeEffects: ['aurora-glow'],
    fontFamily: 'Inter',
    premium: false
  },

  // 💖 ROMANCE
  {
    id: 'romance_petal_soft',
    name: 'Petal Soft',
    category: 'Romance',
    colors: { primary: '#D8B4A0', secondary: '#F5ECE2', accent: '#A67B5B', text: '#9B6A6C', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'romantic-center',
    animationsEnabled: true,
    activeEffects: ['petal-fall'],
    fontFamily: 'Playfair Display',
    premium: false
  },
  {
    id: 'romance_moonlight_date',
    name: 'Moonlight Date',
    category: 'Romance',
    colors: { primary: '#4B5A68', secondary: '#E8DFD2', accent: '#D9D5CF', text: '#5A4A42', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'romantic-center',
    animationsEnabled: true,
    activeEffects: ['moonlight-glow'],
    fontFamily: 'Playfair Display',
    premium: false
  },
  {
    id: 'romance_crimson_passion',
    name: 'Crimson Passion',
    category: 'Romance',
    colors: { primary: '#7A3B3B', secondary: '#F3E9DC', accent: '#A67C52', text: '#4A3428', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'romantic-center',
    animationsEnabled: true,
    activeEffects: ['soft-glow'],
    fontFamily: 'Playfair Display',
    premium: false
  },

  // 🎮 GAMER 
  {
    id: 'gamer_kingdom_adventure',
    name: 'Kingdom Adventure',
    category: 'Gamer',
    colors: { primary: '#7A9E5E', secondary: '#F5E7C8', accent: '#C8A25A', text: '#8B6B4A', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'game-hud',
    animationsEnabled: true,
    activeEffects: ['map-pan'],
    fontFamily: 'Outfit',
    premium: false
  },
  {
    id: 'gamer_ancient_quest',
    name: 'Ancient Quest',
    category: 'Gamer',
    colors: { primary: '#7B5E45', secondary: '#E8DCC5', accent: '#B8944D', text: '#7A756D', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'quest-board',
    animationsEnabled: true,
    activeEffects: ['dust-motes'],
    fontFamily: 'Outfit',
    premium: false
  },
  {
    id: 'gamer_woodland_hero',
    name: 'Woodland Hero',
    category: 'Gamer',
    colors: { primary: '#556B2F', secondary: '#E6D8C3', accent: '#8F9779', text: '#6D4C41', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'inventory-ui',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Outfit',
    premium: false
  },

  // 💻 DEV
  {
    id: 'dev_code_midnight',
    name: 'Code Midnight',
    category: 'Dev',
    colors: { primary: '#1F1F1F', secondary: '#D8D1C5', accent: '#7D8A73', text: '#2E2E2E', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'dev-terminal',
    animationsEnabled: true,
    activeEffects: ['blinking-cursor'],
    fontFamily: 'Fira Code',
    premium: false
  },
  {
    id: 'dev_terminal_classic',
    name: 'Terminal Classic',
    category: 'Dev',
    colors: { primary: '#181818', secondary: '#D2C6B2', accent: '#75826C', text: '#3D3D3D', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'code-editor',
    animationsEnabled: true,
    activeEffects: ['terminal-text'],
    fontFamily: 'Fira Code',
    premium: false
  },
  {
    id: 'dev_paper_code',
    name: 'Paper Code',
    category: 'Dev',
    colors: { primary: '#F5F0E8', secondary: '#8B6B4A', accent: '#5C6B73', text: '#3C3C3C', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'dashboard-modular',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Fira Code',
    premium: false
  },

  // 🏰 RPG
  {
    id: 'rpg_forgotten_kingdom',
    name: 'Forgotten Kingdom',
    category: 'RPG',
    colors: { primary: '#C8A25A', secondary: '#E8DCC5', accent: '#7B5E45', text: '#4B5A68', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'quest-book',
    animationsEnabled: true,
    activeEffects: ['parchment-glow'],
    fontFamily: 'Cinzel',
    premium: false
  },
  {
    id: 'rpg_dragon_chronicle',
    name: 'Dragon Chronicle',
    category: 'RPG',
    colors: { primary: '#8B3A3A', secondary: '#F5E7C8', accent: '#B8944D', text: '#7A756D', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'guild-panel',
    animationsEnabled: true,
    activeEffects: ['ember-fall'],
    fontFamily: 'Cinzel',
    premium: false
  },
  {
    id: 'rpg_elven_woods',
    name: 'Elven Woods',
    category: 'RPG',
    colors: { primary: '#6B8E23', secondary: '#F5ECE2', accent: '#556B2F', text: '#C8A97E', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'adventure-map',
    animationsEnabled: true,
    activeEffects: ['magical-sparkles'],
    fontFamily: 'Cinzel',
    premium: false
  },

  // 🎭 TEATRO
  {
    id: 'theater_shakespeare_hall',
    name: 'Shakespeare Hall',
    category: 'Teatro',
    colors: { primary: '#7A3B3B', secondary: '#FFFFF0', accent: '#C8A25A', text: '#4A3428', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'stage-layout',
    animationsEnabled: true,
    activeEffects: ['spotlight'],
    fontFamily: 'Playfair Display',
    premium: false
  },
  {
    id: 'theater_grand_opera',
    name: 'Grand Opera',
    category: 'Teatro',
    colors: { primary: '#1C3144', secondary: '#F5F5DC', accent: '#B8944D', text: '#3E2723', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'curtain-reveal',
    animationsEnabled: true,
    activeEffects: ['curtain-open'],
    fontFamily: 'Playfair Display',
    premium: false
  },
  {
    id: 'theater_velvet_curtain',
    name: 'Velvet Curtain',
    category: 'Teatro',
    colors: { primary: '#8B0000', secondary: '#FFFDD0', accent: '#D4AF37', text: '#3E2723', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'spotlight-focus',
    animationsEnabled: true,
    activeEffects: ['spotlight'],
    fontFamily: 'Playfair Display',
    premium: false
  },

  // 🎬 CINEMATICO
  {
    id: 'cinema_golden_age',
    name: 'Golden Age',
    category: 'Cinemático',
    colors: { primary: '#D4AF37', secondary: '#FFFFF0', accent: '#8B6B4A', text: '#4A3428', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'cinema-scroll',
    animationsEnabled: true,
    activeEffects: ['film-grain'],
    fontFamily: 'Montserrat',
    premium: false
  },
  {
    id: 'cinema_autumn_drama',
    name: 'Autumn Drama',
    category: 'Cinemático',
    colors: { primary: '#A0522D', secondary: '#F5F5DC', accent: '#8B4513', text: '#FFFDD0', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'movie-scene',
    animationsEnabled: true,
    activeEffects: ['fade-suave'],
    fontFamily: 'Montserrat',
    premium: false
  },
  {
    id: 'cinema_paris_story',
    name: 'Paris Story',
    category: 'Cinemático',
    colors: { primary: '#708090', secondary: '#F5F5DC', accent: '#696969', text: '#4A3428', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'fullscreen-focus',
    animationsEnabled: true,
    activeEffects: ['sepia-filter'],
    fontFamily: 'Playfair Display',
    premium: false
  },

  // 📚 CARTOON / HQ
  {
    id: 'cartoon_sunday_comics',
    name: 'Sunday Comics',
    category: 'Cartoon',
    colors: { primary: '#Fdfbf7', secondary: '#F5E7C8', accent: '#CD5C5C', text: '#1A1A1A', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'comic-grid',
    animationsEnabled: true,
    activeEffects: ['halftone'],
    fontFamily: 'Space Grotesk',
    premium: false
  },
  {
    id: 'cartoon_sketch_book',
    name: 'Sketch Book',
    category: 'Cartoon',
    colors: { primary: '#FFFFFF', secondary: '#DEB887', accent: '#B0C4DE', text: '#36454F', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'speech-bubble',
    animationsEnabled: true,
    activeEffects: ['pencil-sketch'],
    fontFamily: 'Space Grotesk',
    premium: false
  },
  {
    id: 'cartoon_watercolor_tales',
    name: 'Watercolor Tales',
    category: 'Cartoon',
    colors: { primary: '#ADD8E6', secondary: '#FFFDD0', accent: '#FFB6C1', text: '#20B2AA', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'toon-panel',
    animationsEnabled: true,
    activeEffects: ['watercolor-bleed'],
    fontFamily: 'Space Grotesk',
    premium: false
  },

  // 🍥 ANIME / MANGA
  {
    id: 'anime_studio_spring',
    name: 'Studio Spring',
    category: 'Anime',
    colors: { primary: '#7CFC00', secondary: '#FFFDD0', accent: '#87CEEB', text: '#8B4513', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'anime-panel',
    animationsEnabled: true,
    activeEffects: ['spring-breeze'],
    fontFamily: 'Outfit',
    premium: false
  },
  {
    id: 'anime_sakura_memories',
    name: 'Sakura Memories',
    category: 'Anime',
    colors: { primary: '#FFB7C5', secondary: '#FFFDD0', accent: '#90EE90', text: '#D2B48C', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'visual-novel',
    animationsEnabled: true,
    activeEffects: ['sakura-leaves'],
    fontFamily: 'Outfit',
    premium: false
  },
  {
    id: 'anime_mountain_spirit',
    name: 'Mountain Spirit',
    category: 'Anime',
    colors: { primary: '#4682B4', secondary: '#F5F5F5', accent: '#556B2F', text: '#708090', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'manga-reader',
    animationsEnabled: true,
    activeEffects: ['mist'],
    fontFamily: 'Outfit',
    premium: false
  },

  // 🎨 ANIMACAO
  {
    id: 'animation_storybook',
    name: 'Storybook',
    category: 'Animação',
    colors: { primary: '#F5DEB3', secondary: '#ADD8E6', accent: '#228B22', text: '#8B4513', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'storybook-layout',
    animationsEnabled: true,
    activeEffects: ['page-turn'],
    fontFamily: 'Playfair Display',
    premium: false
  },
  {
    id: 'animation_dream_painter',
    name: 'Dream Painter',
    category: 'Animação',
    colors: { primary: '#87CEFA', secondary: '#FFFDD0', accent: '#FFC0CB', text: '#778899', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'motion-canvas',
    animationsEnabled: true,
    activeEffects: ['paint-reveal'],
    fontFamily: 'Outfit',
    premium: false
  },

  // 🍂 SAZONAIS
  {
    id: 'season_spring',
    name: 'Primavera',
    category: 'Sazonais',
    colors: { primary: '#98FB98', secondary: '#FFFDD0', accent: '#FF69B4', text: '#D2B48C', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'standard',
    animationsEnabled: true,
    activeEffects: ['blossom-fall'],
    fontFamily: 'Outfit',
    premium: false
  },
  {
    id: 'season_summer',
    name: 'Verão',
    category: 'Sazonais',
    colors: { primary: '#F4A460', secondary: '#FFFFFF', accent: '#20B2AA', text: '#008080', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'standard',
    animationsEnabled: true,
    activeEffects: ['heat-waves'],
    fontFamily: 'Outfit',
    premium: false
  },
  {
    id: 'season_autumn',
    name: 'Outono',
    category: 'Sazonais',
    colors: { primary: '#D2691E', secondary: '#FFFDD0', accent: '#DAA520', text: '#8B4513', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'standard',
    animationsEnabled: true,
    activeEffects: ['leaf-fall'],
    fontFamily: 'Playfair Display',
    premium: false
  },
  {
    id: 'season_winter',
    name: 'Inverno',
    category: 'Sazonais',
    colors: { primary: '#B0C4DE', secondary: '#FFFAFA', accent: '#87CEFA', text: '#708090', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'standard',
    animationsEnabled: true,
    activeEffects: ['snow-fall'],
    fontFamily: 'Outfit',
    premium: false
  },
  {
    id: 'season_christmas',
    name: 'Natal',
    category: 'Sazonais',
    colors: { primary: '#228B22', secondary: '#FFFDD0', accent: '#8B0000', text: '#DAA520', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'standard',
    animationsEnabled: true,
    activeEffects: ['snow-fall', 'twinkle-lights'],
    fontFamily: 'Playfair Display',
    premium: false
  },
  {
    id: 'season_halloween',
    name: 'Halloween',
    category: 'Sazonais',
    colors: { primary: '#FF8C00', secondary: '#F5DEB3', accent: '#654321', text: '#696969', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'standard',
    animationsEnabled: true,
    activeEffects: ['fog', 'spooky-eyes'],
    fontFamily: 'Space Grotesk',
    premium: false
  },
  {
    id: 'season_new_year',
    name: 'Ano Novo',
    category: 'Sazonais',
    colors: { primary: '#F5DEB3', secondary: '#F8F8FF', accent: '#A9A9A9', text: '#696969', cardBg: '#F8F5F0', bodyBg: '#EDE5D8' },
    layout: 'standard',
    animationsEnabled: true,
    activeEffects: ['fireworks'],
    fontFamily: 'Playfair Display',
    premium: false
  }
];

export const PRESET_THEMES = THEMES;
`;

fs.writeFileSync('src/data/themes.ts', tsContent);
