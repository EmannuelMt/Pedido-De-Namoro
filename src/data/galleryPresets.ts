import { Memory } from '../types';

export const PRESET_MEMORIES: Memory[] = [
  {
    id: 'preset-1',
    title: 'Piquenique no Jardim',
    date: '12/10/2025',
    location: 'Parque do Ibirapuera, SP',
    feeling: 'Paz absoluta e sintonia perfeita compartilhando risadas.',
    story: 'A gente comprou pão artesanal, colheu morangos doces e passou a tarde deitados na grama conversando sobre viagens no tempo enquanto o vento brincava de rolar com nossa toalha quadriculada vermelha.',
    songTitle: 'Partilhar - Rubel & ANAVITÓRIA',
    category: '❤️ Nossos Momentos',
    theme: 'nature',
    likes: 42,
    comments: [
      { author: 'Amor', text: 'Eu ainda lembro do gosto da canela no bolo que levamos! 🧁', timestamp: '12/10/2025' },
      { author: 'Lindo(a)', text: 'Essa tarde mudou tudo pra mim...', timestamp: '13/10/2025' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1464998857633-50e59fbf2fe6?q=80&w=600'
  },
  {
    id: 'preset-2',
    title: 'Primeiro Olhar de Café',
    date: '12/04/2025',
    location: 'Cafeteria Jardim Secreto',
    feeling: 'Ansiedade boa, riso frouxo e a caneca de capuccino flutuando.',
    story: 'Nossas canecas quase se chocaram na canela do armário. Eu gaguejei ao pedir desculpas pela distração, e quando você deu aquele risinho de canto, percebi que todo o resto do salão ficou desfocado no fundo.',
    songTitle: 'Yellow - Coldplay',
    category: '🌸 Datas Especiais',
    theme: 'vintage',
    likes: 58,
    comments: [
      { author: 'Gatinho(a)', text: 'Você ficou muito vermelho(a) na hora, foi a coisa mais fofa! 😂', timestamp: '12/04/2025' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600'
  },
  {
    id: 'preset-3',
    title: 'Pé na Estrada e Mar de Frente',
    date: '21/01/2026',
    location: 'Rodovia dos Tamoios, SP',
    feeling: 'Liberdade sem limites cantando no talo do rádio.',
    story: 'As janelas estavam totalmente abaixadas, o ar salgado bagunçando seus cabelos e nossa playlist favorita estourando no falante do painel. A gente parou num mirante só para aplaudir o sol de fim de tarde tocar a água.',
    songTitle: 'Dreams - The Cranberries',
    category: '✈️ Viagens',
    theme: 'cartoon',
    likes: 31,
    comments: [
      { author: 'Explorador(a)', text: 'Com certeza a nossa trilha sonora definitiva! 🌴🚗', timestamp: '22/01/2026' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=600'
  },
  {
    id: 'preset-4',
    title: 'A Promessa sob as Velas',
    date: '12/05/2025',
    location: 'Colina das Estrelas, SP',
    feeling: 'Coração transbordando amor e o maior SIM de nossas vidas.',
    story: 'Eu rascunhei um origami secreto em formato de lírio roxo, tremendo de frio (e pavor!). Quando você abriu a cartinha e leu o pedido, as luzes da cidade lá no vale pareciam estrelas aplaudindo nosso pacto eterno de carinho.',
    songTitle: 'Perfect - Ed Sheeran',
    category: '🎂 Comemorações',
    theme: 'romance',
    likes: 67,
    comments: [
      { author: 'Himesama', text: 'Eu diria SIM mais um milhão de vezes sem hesitar...', timestamp: '12/05/2025' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600'
  }
];
