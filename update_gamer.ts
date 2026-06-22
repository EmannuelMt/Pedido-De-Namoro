import fs from 'fs';

const fileContent = fs.readFileSync('src/data/themes.ts', 'utf8');

const gamerSection = `// 🎮 GAMER
  {
    id: 'gamer_kingdom_adventure',
    name: 'Kingdom Adventure',
    category: 'Gamer',
    colors: { primary: '#78995F', secondary: '#A67C52', accent: '#C4A15D', text: '#2E2B27', cardBg: '#F4E8D1', bodyBg: '#E8DCC5' },
    layout: 'game-hud',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Cinzel',
    premium: false
  },
  {
    id: 'gamer_dragon_chronicle',
    name: 'Dragon Chronicle',
    category: 'Gamer',
    colors: { primary: '#8D5B4A', secondary: '#A8784A', accent: '#75706A', text: '#2A241F', cardBg: '#ECE3D5', bodyBg: '#DCCDBB' },
    layout: 'quest-board',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Cinzel',
    premium: false
  },
  {
    id: 'gamer_elven_woods',
    name: 'Elven Woods',
    category: 'Gamer',
    colors: { primary: '#6D8A5D', secondary: '#5C7052', accent: '#B08B67', text: '#2C3524', cardBg: '#F0E8DB', bodyBg: '#E0D6C4' },
    layout: 'forest-hud',
    animationsEnabled: true,
    activeEffects: ['floating-leaves'],
    fontFamily: 'Cinzel',
    premium: false
  },
  {
    id: 'gamer_warrior_legacy',
    name: 'Warrior Legacy',
    category: 'Gamer',
    colors: { primary: '#68635D', secondary: '#7C5C46', accent: '#B48A4D', text: '#2D2821', cardBg: '#E8DCC7', bodyBg: '#D8CAB3' },
    layout: 'battle-command',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Cinzel',
    premium: false
  },
  {
    id: 'gamer_campfire_quest',
    name: 'Campfire Quest',
    category: 'Gamer',
    colors: { primary: '#8A6A4D', secondary: '#B97B52', accent: '#6A7F5A', text: '#2A2118', cardBg: '#F1E7D7', bodyBg: '#E3D7C1' },
    layout: 'adventure-journal',
    animationsEnabled: true,
    activeEffects: ['soft-glow'],
    fontFamily: 'Caveat',
    premium: false
  },
  {
    id: 'gamer_cozy_farm',
    name: 'Cozy Farm',
    category: 'Gamer',
    colors: { primary: '#8FA97D', secondary: '#D9C185', accent: '#B28A62', text: '#3D4A32', cardBg: '#F5EEDF', bodyBg: '#E8DECC' },
    layout: 'farm-dashboard',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Quicksand',
    premium: false
  },
  {
    id: 'gamer_explorer_world',
    name: 'Explorer World',
    category: 'Gamer',
    colors: { primary: '#7E9DB5', secondary: '#D6C2A1', accent: '#6F8A5A', text: '#27333B', cardBg: '#EAE0CD', bodyBg: '#DCCCB3' },
    layout: 'world-map',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Cinzel',
    premium: false
  },
  {
    id: 'gamer_ranger_path',
    name: 'Ranger Path',
    category: 'Gamer',
    colors: { primary: '#5D7555', secondary: '#8B6A4F', accent: '#7B7872', text: '#1E261A', cardBg: '#EFE5D5', bodyBg: '#E1D3C0' },
    layout: 'hunter-log',
    animationsEnabled: true,
    activeEffects: ['floating-leaves'],
    fontFamily: 'Cinzel',
    premium: false
  },
  {
    id: 'gamer_ancient_relics',
    name: 'Ancient Relics',
    category: 'Gamer',
    colors: { primary: '#8C8375', secondary: '#D4C3A2', accent: '#A87A4D', text: '#2E2B27', cardBg: '#E6DCC3', bodyBg: '#D8CBB0' },
    layout: 'artifact-vault',
    animationsEnabled: true,
    activeEffects: ['dust-motes'],
    fontFamily: 'Cinzel',
    premium: false
  },
  {
    id: 'gamer_open_world_journey',
    name: 'Open World Journey',
    category: 'Gamer',
    colors: { primary: '#8DAFC2', secondary: '#7A9A69', accent: '#9C7B5B', text: '#2C3A44', cardBg: '#F4EEE3', bodyBg: '#E8DED0' },
    layout: 'open-world-ui',
    animationsEnabled: true,
    activeEffects: ['floating-clouds'],
    fontFamily: 'Cinzel',
    premium: false
  },

  // 💻 DEV`;

const startIndex = fileContent.indexOf('// 🎮 GAMER');
const endIndex = fileContent.indexOf('// 💻 DEV');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = fileContent.substring(0, startIndex) + gamerSection + fileContent.substring(endIndex + '// 💻 DEV'.length);
  fs.writeFileSync('src/data/themes.ts', newContent);
  console.log('Themes updated successfully!');
} else {
  console.log('Could not find markers');
}
