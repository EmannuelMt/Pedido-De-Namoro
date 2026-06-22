import fs from 'fs';

const fileContent = fs.readFileSync('src/data/themes.ts', 'utf8');

const corporateSection = `// 💼 CORPORATIVO
  {
    id: 'corp_executive_suite',
    name: 'Executive Suite',
    category: 'Corporativo',
    colors: { primary: '#2D2D2D', secondary: '#F7F7F5', accent: '#7A5C45', text: '#2D2D2D', cardBg: '#F7F7F5', bodyBg: '#EFEFEA' },
    layout: 'dashboard-pro',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Inter',
    premium: true
  },
  {
    id: 'corp_analytics_pro',
    name: 'Analytics Pro',
    category: 'Corporativo',
    colors: { primary: '#5D7382', secondary: '#FAFAF8', accent: '#323232', text: '#323232', cardBg: '#FAFAF8', bodyBg: '#EDEDE8' },
    layout: 'analytics-grid',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Inter',
    premium: false
  },
  {
    id: 'corp_business_flow',
    name: 'Business Flow',
    category: 'Corporativo',
    colors: { primary: '#7A634B', secondary: '#EFE7D9', accent: '#595959', text: '#3D3D3D', cardBg: '#F8F6F2', bodyBg: '#EFE7D9' },
    layout: 'kanban-flow',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Inter',
    premium: false
  },
  {
    id: 'corp_legacy_enterprise',
    name: 'Legacy Enterprise',
    category: 'Corporativo',
    colors: { primary: '#44566A', secondary: '#F0E8DB', accent: '#A9835A', text: '#303030', cardBg: '#F0E8DB', bodyBg: '#E8DED0' },
    layout: 'enterprise-board',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Playfair Display',
    premium: true
  },
  {
    id: 'corp_paper_office',
    name: 'Paper Office',
    category: 'Corporativo',
    colors: { primary: '#9A7B5C', secondary: '#F5F0E8', accent: '#404040', text: '#404040', cardBg: '#ECE4D7', bodyBg: '#F5F0E8' },
    layout: 'document-manager',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Lora',
    premium: false
  },
  {
    id: 'corp_eco_business',
    name: 'Eco Business',
    category: 'Corporativo',
    colors: { primary: '#8DA08A', secondary: '#E9E2D4', accent: '#B08968', text: '#4A4A4A', cardBg: '#E9E2D4', bodyBg: '#DFD8CC' },
    layout: 'eco-dashboard',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Inter',
    premium: false
  },
  {
    id: 'corp_urban_executive',
    name: 'Urban Executive',
    category: 'Corporativo',
    colors: { primary: '#3A3A3A', secondary: '#D2D0CA', accent: '#6A513C', text: '#3A3A3A', cardBg: '#F7F7F5', bodyBg: '#D2D0CA' },
    layout: 'city-grid',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Space Grotesk',
    premium: true
  },
  {
    id: 'corp_investor_board',
    name: 'Investor Board',
    category: 'Corporativo',
    colors: { primary: '#5F715B', secondary: '#F2EBDD', accent: '#B58A56', text: '#2F2F2F', cardBg: '#F2EBDD', bodyBg: '#E6DEC9' },
    layout: 'finance-panel',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Inter',
    premium: true
  },
  {
    id: 'corp_signature_premium',
    name: 'Signature Premium',
    category: 'Corporativo',
    colors: { primary: '#654B3D', secondary: '#F5F1EA', accent: '#B49367', text: '#4B4B4B', cardBg: '#F5F1EA', bodyBg: '#EBE5DA' },
    layout: 'premium-board',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Playfair Display',
    premium: true
  },
  {
    id: 'corp_corporate_classic',
    name: 'Corporate Classic',
    category: 'Corporativo',
    colors: { primary: '#5A6C80', secondary: '#E9E0D2', accent: '#8A6A4F', text: '#404040', cardBg: '#E9E0D2', bodyBg: '#DFD5C6' },
    layout: 'classic-office',
    animationsEnabled: true,
    activeEffects: [],
    fontFamily: 'Inter',
    premium: false
  },

  // 🧪 EXPERIMENTAL`;

// Find where to insert
const index = fileContent.lastIndexOf('];');
if (index !== -1) {
  const newContent = fileContent.slice(0, index) + corporateSection + '\\n' + fileContent.slice(index);
  fs.writeFileSync('src/data/themes.ts', newContent);
  console.log('Themes updated successfully!');
} else {
  console.log('Array end not found');
}
