import { create } from 'zustand';

export type BuilderStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface SetupData {
  partner: {
    name: string;
    nickname: string;
    specialDate: string;
    symbol: string;
  };
  emotionalData: {
    food: string;
    games: string;
    places: string;
    hobbies: string;
    dreams: string;
    movies: string;
    series: string;
    animes: string;
    happyMoments: string;
  };
  story: {
    howWeMet: string;
    firstDate: string;
    emotionalText: string;
  };
  proposal: {
    music: string;
    cinematicMode: boolean;
    finalText: string;
  };
  access: {
    type: 'password' | 'secretQuestion' | 'location' | 'timer' | 'none';
    password?: string;
    secretQuestion?: string;
    accessAnswer?: string;
    geolocation?: string;
    releaseDate?: string;
  };
  themeConfig: {
    type: 'preset' | 'custom' | 'ai';
    presetKey: string;
    customColors: {
      primary: string;
      bg: string;
      bgAlt: string;
      text: string;
      accent: string;
    };
    customStyle: {
      particles: string;
      fontStyle: string; // 'serif' | 'sans' | 'mono' | 'handwriting'
    };
  };
  quizzes: { question: string; options: string[]; answer: number; wrongMsg: string; rightMsg: string }[];
  theme: string;
}

interface BuilderStore {
  currentStep: BuilderStep;
  setStep: (step: BuilderStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  data: SetupData;
  updateData: (partial: Partial<SetupData>) => void;
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(8, state.currentStep + 1) as BuilderStep })),
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) as BuilderStep })),
  
  data: {
    partner: {
      name: '',
      nickname: '',
      specialDate: '',
      symbol: '💖'
    },
    emotionalData: {
      food: '',
      games: '',
      places: '',
      hobbies: '',
      dreams: '',
      movies: '',
      series: '',
      animes: '',
      happyMoments: ''
    },
    story: {
      howWeMet: '',
      firstDate: '',
      emotionalText: ''
    },
    proposal: {
      music: '',
      cinematicMode: false,
      finalText: ''
    },
    access: {
      type: 'none'
    },
    themeConfig: {
      type: 'preset',
      presetKey: 'luxury_classic',
      customColors: {
        primary: '#FF007F',
        bg: '#111111',
        bgAlt: '#000000',
        text: '#FFFFFF',
        accent: '#00FFFF'
      },
      customStyle: {
        particles: 'stars',
        fontStyle: 'serif'
      }
    },
    quizzes: [],
    theme: 'luxury_classic',
  },
  updateData: (partial) => set((state) => ({ 
    data: { 
      ...state.data, 
      ...partial,
      partner: { ...state.data.partner, ...partial.partner },
      emotionalData: { ...state.data.emotionalData, ...partial.emotionalData },
      story: { ...state.data.story, ...partial.story },
      proposal: { ...state.data.proposal, ...partial.proposal },
      access: { ...state.data.access, ...partial.access },
      themeConfig: { ...state.data.themeConfig, ...partial.themeConfig }
    } 
  })),
}));
