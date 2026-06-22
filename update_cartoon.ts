import fs from 'fs';

const fileContent = fs.readFileSync('src/data/themes.ts', 'utf8');

const cartoonSection = `// 📚 CARTOON
  {
    id: 'cartoon_storybook_adventure',
    name: 'Storybook Adventure',
    category: 'Cartoon',
    colors: { primary: '#8A6A4A', secondary: '#F6F1E7', accent: '#8FB9D4', text: '#3E342B', cardBg: '#F6F1E7', bodyBg: '#E8DFD2' },
    layout: 'storybook-layout',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Comic Neue',
    premium: false
  },
  {
    id: 'cartoon_sketch_world',
    name: 'Sketch World',
    category: 'Cartoon',
    colors: { primary: '#4A4A4A', secondary: '#FAFAF8', accent: '#7C99B4', text: '#2A241E', cardBg: '#FAFAF8', bodyBg: '#E8DED0' },
    layout: 'sketch-board',
    animationsEnabled: true,
    activeEffects: ['pencil-sketch'],
    fontFamily: 'Caveat',
    premium: false
  },
  {
    id: 'cartoon_balloon_town',
    name: 'Balloon Town',
    category: 'Cartoon',
    colors: { primary: '#A8CFE6', secondary: '#F8F3EA', accent: '#BFD8B8', text: '#6B5B4B', cardBg: '#F8F3EA', bodyBg: '#EFD9A7' },
    layout: 'playful-grid',
    animationsEnabled: true,
    activeEffects: ['floating-clouds'],
    fontFamily: 'Quicksand',
    premium: false
  },
  {
    id: 'cartoon_crayon_dreams',
    name: 'Crayon Dreams',
    category: 'Cartoon',
    colors: { primary: '#C97B63', secondary: '#F7F0E6', accent: '#88A878', text: '#6B5B4B', cardBg: '#F7F0E6', bodyBg: '#EADCCB' },
    layout: 'crayon-canvas',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Comic Neue',
    premium: false
  },
  {
    id: 'cartoon_sunday_comics',
    name: 'Sunday Comics',
    category: 'Cartoon',
    colors: { primary: '#B55A4A', secondary: '#E8DFC8', accent: '#5F7D95', text: '#2E2E2E', cardBg: '#E8DFC8', bodyBg: '#D6C4A1' },
    layout: 'comic-panels',
    animationsEnabled: true,
    activeEffects: ['halftone'],
    fontFamily: 'Bangers',
    premium: false
  },
  {
    id: 'cartoon_woodland_cartoon',
    name: 'Woodland Cartoon',
    category: 'Cartoon',
    colors: { primary: '#78916C', secondary: '#F2E8D8', accent: '#B08A63', text: '#3E342B', cardBg: '#F2E8D8', bodyBg: '#D6C4A1' },
    layout: 'forest-story',
    animationsEnabled: true,
    activeEffects: ['floating-leaves'],
    fontFamily: 'Quicksand',
    premium: false
  },
  {
    id: 'cartoon_cloud_village',
    name: 'Cloud Village',
    category: 'Cartoon',
    colors: { primary: '#A4C4DA', secondary: '#F6F6F4', accent: '#D8D8D0', text: '#6B5B4B', cardBg: '#F6F6F4', bodyBg: '#E8DED0' },
    layout: 'floating-town',
    animationsEnabled: true,
    activeEffects: ['floating-clouds'],
    fontFamily: 'Quicksand',
    premium: false
  },
  {
    id: 'cartoon_toon_theater',
    name: 'Toon Theater',
    category: 'Cartoon',
    colors: { primary: '#9E5648', secondary: '#F2E6D4', accent: '#C6A16A', text: '#5A463A', cardBg: '#F2E6D4', bodyBg: '#D6C4A1' },
    layout: 'stage-layout',
    animationsEnabled: true,
    activeEffects: ['curtain-open'],
    fontFamily: 'Bangers',
    premium: false
  },
  {
    id: 'cartoon_watercolor_tales',
    name: 'Watercolor Tales',
    category: 'Cartoon',
    colors: { primary: '#A6C4D8', secondary: '#F6F1E7', accent: '#A9C3A0', text: '#6B5B4B', cardBg: '#F6F1E7', bodyBg: '#E8DFD2' },
    layout: 'watercolor-flow',
    animationsEnabled: true,
    activeEffects: ['watercolor-bleed'],
    fontFamily: 'Caveat',
    premium: false
  },
  {
    id: 'cartoon_cozy_home',
    name: 'Cozy Cartoon',
    category: 'Cartoon',
    colors: { primary: '#8D6B4F', secondary: '#EADCCB', accent: '#97A78A', text: '#3E342B', cardBg: '#EADCCB', bodyBg: '#D6C4A1' },
    layout: 'cozy-home',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Quicksand',
    premium: false
  },

  // 🍥 ANIME / MANGA`;

const startIndex = fileContent.indexOf('// 📚 CARTOON / HQ');
const endIndex = fileContent.indexOf('// 🍥 ANIME / MANGA');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = fileContent.substring(0, startIndex) + cartoonSection + fileContent.substring(endIndex + '// 🍥 ANIME / MANGA'.length);
  fs.writeFileSync('src/data/themes.ts', newContent);
  console.log('Themes updated successfully!');
} else {
  console.log('Could not find markers');
}
