export interface AvatarFrame {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  className: string;
  borderColor?: string;
  glowColor?: string;
  animation?: string;
}

export const AVATAR_FRAMES: AvatarFrame[] = [
  {
    id: 'none',
    name: 'Sem Moldura',
    rarity: 'common',
    className: ''
  },
  {
    id: 'basic_white',
    name: 'Borda Cartoon',
    rarity: 'common',
    className: 'ring-[6px] ring-white shadow-[0_0_0_4px_rgba(0,0,0,1)]'
  },
  {
    id: 'neon_pink',
    name: 'Neon Love',
    rarity: 'rare',
    className: 'ring-[6px] ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)] animate-pulse'
  },
  {
    id: 'cyber_cyan',
    name: 'Cyberpunk',
    rarity: 'rare',
    className: 'ring-[6px] ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.7)]'
  },
  {
    id: 'gold_royal',
    name: 'Realeza',
    rarity: 'epic',
    className: 'ring-[8px] ring-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.5)] border-[2px] border-black'
  },
  {
    id: 'dark_chaos',
    name: 'Caos Escuro',
    rarity: 'epic',
    className: 'ring-[8px] ring-black shadow-[0_0_20px_rgba(0,0,0,0.8)] outline outline-2 outline-white'
  },
  {
    id: 'multi_rainbow',
    name: 'Multiverso',
    rarity: 'legendary',
    className: 'ring-[10px] ring-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-[length:200%_200%] animate-gradient shadow-[0_0_30px_rgba(168,85,247,0.6)]'
  }
];
