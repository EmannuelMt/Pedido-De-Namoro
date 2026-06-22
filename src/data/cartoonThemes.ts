export interface CartoonTheme {
  id: string;
  name: string;
  inspiration: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    card: string;
  };
  layoutDecoration: string; // Ex: 'Páginas de livro', 'Papel quadriculado', etc.
  effectType: 'clouds' | 'hearts' | 'crayon' | 'leaves' | 'stars' | 'cookies' | 'water' | 'letters';
  emoji: string;
}

export const CARTOON_UNIVERSES: CartoonTheme[] = [
  {
    id: 'storybook',
    name: 'Storybook Adventure',
    inspiration: 'Livros ilustrados e contos clássicos',
    colors: {
      primary: '#8FB9D4',
      secondary: '#7FA36A',
      accent: '#E8DED0',
      background: '#F6F1E7',
      text: '#8A6A4A',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Bordas ornamentadas e páginas de livro',
    effectType: 'letters',
    emoji: '📖'
  },
  {
    id: 'sketch',
    name: 'Sketch World',
    inspiration: 'Cadernos de desenho e croquis',
    colors: {
      primary: '#7C99B4',
      secondary: '#E8DED0',
      accent: '#FAFAF8',
      background: '#FAFAF8',
      text: '#4A4A4A',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Papel quadriculado com rabiscos nas bordas',
    effectType: 'crayon',
    emoji: '✏️'
  },
  {
    id: 'balloon',
    name: 'Balloon Town',
    inspiration: 'Desenhos infantis super fofos',
    colors: {
      primary: '#A8CFE6',
      secondary: '#BFD8B8',
      accent: '#EFD9A7',
      background: '#F8F3EA',
      text: '#445A50',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Cards flutuantes macios e redondos',
    effectType: 'clouds',
    emoji: '🎈'
  },
  {
    id: 'crayon',
    name: 'Crayon Dreams',
    inspiration: 'Giz de cera com traços de afeto',
    colors: {
      primary: '#C97B63',
      secondary: '#8DB5D8',
      accent: '#88A878',
      background: '#F7F0E6',
      text: '#4D3A32',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Textura de papel rústica com contornos irregulares',
    effectType: 'crayon',
    emoji: '🖍️'
  },
  {
    id: 'comics',
    name: 'Sunday Comics',
    inspiration: 'Quadrinhos clássicos e tirinhas',
    colors: {
      primary: '#B55A4A',
      secondary: '#5F7D95',
      accent: '#E8DFC8',
      background: '#FFFDF9',
      text: '#2E2E2E',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Painéis divididos por linhas pretas grossas com onomatopeias',
    effectType: 'stars',
    emoji: '📰'
  },
  {
    id: 'woodland',
    name: 'Woodland Cartoon',
    inspiration: 'Florestas mágicas e acolhedoras',
    colors: {
      primary: '#78916C',
      secondary: '#89AFC6',
      accent: '#B08A63',
      background: '#F2E8D8',
      text: '#3E473A',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Texturas de madeira e rastros florais',
    effectType: 'leaves',
    emoji: '🌳'
  },
  {
    id: 'cloud_village',
    name: 'Cloud Village',
    inspiration: 'Cidades flutuantes nas nuvens',
    colors: {
      primary: '#A4C4DA',
      secondary: '#B49573',
      accent: '#D8D8D0',
      background: '#F6F6F4',
      text: '#3B4D5A',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Camadas suspensas imitando algodão',
    effectType: 'clouds',
    emoji: '☁️'
  },
  {
    id: 'toon_theater',
    name: 'Toon Theater',
    inspiration: 'Palcos e canais clássicos',
    colors: {
      primary: '#9E5648',
      secondary: '#C6A16A',
      accent: '#5A463A',
      background: '#F2E6D4',
      text: '#5A463A',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Cortinas em relevo e iluminação em foco',
    effectType: 'stars',
    emoji: '🎭'
  },
  {
    id: 'watercolor',
    name: 'Watercolor Tales',
    inspiration: 'Arte fluida em aquarela',
    colors: {
      primary: '#A6C4D8',
      secondary: '#A9C3A0',
      accent: '#D8B7AF',
      background: '#F6F1E7',
      text: '#455A6A',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Fundo estilizável artístico com manchas suaves',
    effectType: 'water',
    emoji: '🎨'
  },
  {
    id: 'cozy',
    name: 'Cozy Cartoon',
    inspiration: 'Ambiente caseiro e amizade',
    colors: {
      primary: '#8D6B4F',
      secondary: '#97A78A',
      accent: '#8EA1AF',
      background: '#EADCCB',
      text: '#4A3728',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Cards acolhedores e ambientes confortáveis',
    effectType: 'hearts',
    emoji: '🏡'
  },
  {
    id: 'sunny_farm',
    name: 'Sunny Farm',
    inspiration: 'Fazendas tranquilas e colheitas felizes',
    colors: {
      primary: '#B7C99B',
      secondary: '#9C7B4F',
      accent: '#E9D27A',
      background: '#FFF7E6',
      text: '#4A3D2A',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Cercas ilustradas e fofurice rural',
    effectType: 'leaves',
    emoji: '🌻'
  },
  {
    id: 'train_town',
    name: 'Little Train Town',
    inspiration: 'Maquetes e ferrovias simpáticas',
    colors: {
      primary: '#B04E4E',
      secondary: '#6D8EA3',
      accent: '#7C684E',
      background: '#F4E7C5',
      text: '#4E3A26',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Trilhos decorativos e painéis industriais fofos',
    effectType: 'clouds',
    emoji: '🚂'
  },
  {
    id: 'fairytale',
    name: 'Fairytale Kingdom',
    inspiration: 'Castelos, coroas e pergaminhos',
    colors: {
      primary: '#8A6C91',
      secondary: '#A5B99F',
      accent: '#DCC6A0',
      background: '#F8F3E8',
      text: '#4A344E',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Bordas de realeza e toques heráldicos',
    effectType: 'stars',
    emoji: '🏰'
  },
  {
    id: 'forest_friends',
    name: 'Forest Friends',
    inspiration: 'Animais silvestres e casinhas de tronco',
    colors: {
      primary: '#6B8A5A',
      secondary: '#8CA9B8',
      accent: '#C8A97E',
      background: '#E8DCCB',
      text: '#3D5233',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Folhinhas e marcas de pegadas fofas',
    effectType: 'leaves',
    emoji: '🐻'
  },
  {
    id: 'space_cartoon',
    name: 'Space Cartoon',
    inspiration: 'Cosmos e planetas desenhados à mão',
    colors: {
      primary: '#7E9CB7',
      secondary: '#E8D6A7',
      accent: '#324A5F',
      background: '#EAEEF2',
      text: '#223444',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Estrelas e planetas infantis com traço solto',
    effectType: 'stars',
    emoji: '🚀'
  },
  {
    id: 'toy_box',
    name: 'Toy Box',
    inspiration: 'Baús de memórias e blocos de montar',
    colors: {
      primary: '#D88A6A',
      secondary: '#8EB5D1',
      accent: '#EBCF8D',
      background: '#F8F3EA',
      text: '#5E3E30',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Blocos coloridos empilhados e botões robustos',
    effectType: 'crayon',
    emoji: '🧸'
  },
  {
    id: 'ocean_tales',
    name: 'Ocean Tales',
    inspiration: 'Criaturas submarinas e corais tímidos',
    colors: {
      primary: '#5E93A8',
      secondary: '#A8C9D8',
      accent: '#D9E8E8',
      background: '#F4F0E6',
      text: '#2C4954',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Ondas onduladas nas transições e bolhas leves',
    effectType: 'water',
    emoji: '🌊'
  },
  {
    id: 'cookie_village',
    name: 'Cookie Village',
    inspiration: 'Casas de biscoito e granulado',
    colors: {
      primary: '#B88252',
      secondary: '#E6C9A2',
      accent: '#F5E6CC',
      background: '#FDFBF7',
      text: '#4E321F',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Textura de glacê e bordas amanteigadas',
    effectType: 'cookies',
    emoji: '🍪'
  },
  {
    id: 'happy_carnival',
    name: 'Happy Carnival',
    inspiration: 'Parques mágicos e carrosséis clássicos',
    colors: {
      primary: '#C06B4E',
      secondary: '#88A7A0',
      accent: '#D8B87A',
      background: '#F7F0E2',
      text: '#50281F',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Bandeirinhas flutuantes e cartazes circenses',
    effectType: 'stars',
    emoji: '🎪'
  },
  {
    id: 'moonlight',
    name: 'Moonlight Cartoon',
    inspiration: 'Noites infantis serenas e canções de ninar',
    colors: {
      primary: '#7E8A99',
      secondary: '#A6B5A3',
      accent: '#C9C4B8',
      background: '#F3F0E8',
      text: '#313C47',
      card: '#FFFFFF'
    },
    layoutDecoration: 'Nuvens escuras aconchegantes e constelações amigáveis',
    effectType: 'hearts',
    emoji: '🌙'
  }
];
