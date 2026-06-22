import fs from 'fs';

const tsContent = `import { FrameConfig } from "../types";

export interface FrameCustomization {
  color: string;
  thickness: 'thin' | 'medium' | 'thick';
  effect: 'none' | 'glow' | 'pulse' | 'rotate' | 'float' | 'sparkles';
  transparency: number;
}

export type ProfileFrame = FrameConfig & {
  description: string;
  price?: number;
  animated?: boolean;
};

export const FRAMES_CATALOG: ProfileFrame[] = [
  // === ROMANCE ===
  {
    id: 'frame_petal',
    name: 'Pétalas Delicadas',
    rarity: 'Incomum',
    category: 'Romance',
    borderStyle: 'border-[#D8B4A0] bg-[#F5ECE2]/10',
    glowColor: '#D8B4A0',
    description: 'Bordas circulares em tom de rosa chá com uma aura de paixão suave.',
    price: 150
  },
  {
    id: 'frame_love_letter',
    name: 'Carta Antiga',
    rarity: 'Rara',
    category: 'Romance',
    borderStyle: 'border-[#A67B5B] bg-[#F5ECE2]/20',
    glowColor: '#A67B5B',
    description: 'Moldura fina lembrando as dobras de uma carta selada com carinho.',
    price: 250
  },
  {
    id: 'frame_velvet',
    name: 'Veludo Vermelho',
    rarity: 'Épica',
    category: 'Romance',
    borderStyle: 'border-[#7A3B3B] bg-[#7A3B3B]/10',
    glowColor: '#7A3B3B',
    animation: 'pulse',
    description: 'Um vermelho intenso natural, como veludo ou vinho antigo.',
    price: 350,
    animated: true
  },

  // === NATUREZA (Espiritual) ===
  {
    id: 'frame_oak',
    name: 'Madeira Acácia',
    rarity: 'Incomum',
    category: 'Espiritual',
    borderStyle: 'border-[#6D4C41] bg-[#EDE5D8]/10',
    glowColor: '#6D4C41',
    description: 'Moldura rústica feita com tons naturais de madeira fresca.',
    price: 150
  },
  {
    id: 'frame_sage',
    name: 'Folhas de Sálvia',
    rarity: 'Rara',
    category: 'Espiritual',
    borderStyle: 'border-[#A8BBA3] bg-[#E6D8C3]/20',
    glowColor: '#A8BBA3',
    description: 'Um toque verde suave que remete à jardinagem e campos floridos.',
    price: 250
  },
  {
    id: 'frame_aurora_stone',
    name: 'Pedra Filosofal',
    rarity: 'Épica',
    category: 'Espiritual',
    borderStyle: 'border-[#7E9BAE] bg-[#C7C2B8]/20',
    glowColor: '#7E9BAE',
    animation: 'float',
    particles: true,
    description: 'Mineral místico que flutua levemente em águas serenas.',
    price: 400,
    animated: true
  },

  // === CINEMATICO ===
  {
    id: 'frame_film_roll',
    name: 'Película Antiga',
    rarity: 'Incomum',
    category: 'Cinemático',
    borderStyle: 'border-[#1A1A1A] bg-[#000000]/10',
    glowColor: '#333333',
    description: 'Uma borda monocromática limpa evocando filmes de outras décadas.',
    price: 100
  },
  {
    id: 'frame_director',
    name: 'A Cadeira do Diretor',
    rarity: 'Rara',
    category: 'Cinemático',
    borderStyle: 'border-[#D4AF37] bg-[#D4AF37]/10',
    glowColor: '#D4AF37',
    description: 'Bordas de ouro fosco para um visual elegante de premiações de cinema.',
    price: 300
  },

  // === RPG & TEATRO ===
  {
    id: 'frame_leather_tome',
    name: 'Capa de Couro',
    rarity: 'Incomum',
    category: 'RPG',
    borderStyle: 'border-[#5A4A42] bg-[#E8DCC5]/10',
    glowColor: '#5A4A42',
    description: 'Costura espessa imitando um grimório antigo ou tomo de memórias.',
    price: 200
  },
  {
    id: 'frame_gala',
    name: 'Espetáculo',
    rarity: 'Épica',
    category: 'Teatro',
    borderStyle: 'border-[#D4AF37] bg-[#8B0000]/10',
    glowColor: '#8B0000',
    animation: 'pulse',
    description: 'A união entre o bordô do tapete vermelho e o ouro fosco do palco de gala.',
    price: 400,
    animated: true
  },

  // === CARTOON & ANIMACAO ===
  {
    id: 'frame_inked',
    name: 'Borda a Nanquim',
    rarity: 'Rara',
    category: 'Cartoon',
    borderStyle: 'border-[#1A1A1A] bg-[#F5E7C8]/10',
    glowColor: '#1A1A1A',
    description: 'Traço feito à mão, com aspecto de tinta nanquim artesanal.',
    price: 250
  },
  {
    id: 'frame_watercolor_edge',
    name: 'Borda Aquarela',
    rarity: 'Épica',
    category: 'Animação',
    borderStyle: 'border-[#7E9BAE] bg-[#ADD8E6]/20',
    glowColor: '#ADD8E6',
    animation: 'float',
    description: 'Cantos suaves que parecem tinta d\\'água em movimento sobre o papel.',
    price: 350,
    animated: true
  }
];
`;

fs.writeFileSync('src/data/frames.ts', tsContent);
