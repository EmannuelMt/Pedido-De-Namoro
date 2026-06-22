export interface UserTitle {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  className: string;
}

export const TITLES_LIST: UserTitle[] = [
  {
    id: 'none',
    name: 'Sem Título',
    rarity: 'common',
    className: 'text-zinc-500 font-bold'
  },
  {
    id: 'pioneer',
    name: 'Pioneiro do Reino',
    rarity: 'rare',
    className: 'text-blue-500 font-black'
  },
  {
    id: 'dev_full',
    name: 'Desenvolvedor Fullstack',
    rarity: 'legendary',
    className: 'text-purple-600 font-black italic underline'
  },
  {
    id: 'founder',
    name: 'Fundador',
    rarity: 'mythic',
    className: 'text-rose-600 font-black uppercase tracking-widest'
  },
  {
    id: 'adventurer',
    name: 'Aventureiro Nato',
    rarity: 'common',
    className: 'text-green-600 font-bold'
  },
  {
    id: 'night_owl',
    name: 'Coruja da Noite',
    rarity: 'rare',
    className: 'text-indigo-600 font-black'
  },
  {
    id: 'collector',
    name: 'Colecionador de Relíquias',
    rarity: 'epic',
    className: 'text-amber-600 font-black drop-shadow-sm'
  }
];
