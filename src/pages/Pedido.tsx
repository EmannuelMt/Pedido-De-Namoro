import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft, 
  Cloud, 
  Music, 
  Home, 
  Plane, 
  Gamepad2, 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX, 
  Star, 
  Compass, 
  Key, 
  DoorOpen, 
  MapPin, 
  Trees, 
  BookMarked,
  Layers,
  Sparkle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// 6 beautiful chapters + intro + checkout/celebracao
type StageID = 'intro' | 'cap1_inicio' | 'cap2_encontros' | 'cap3_jardim' | 'cap4_frequencia' | 'cap5_sonhos' | 'cap6_pedido' | 'celebracao';

interface ChapterMeta {
  id: StageID;
  title: string;
  emoji: string;
  themeName: string;
}

export function Pedido() {
  const { user, profile, updateProfileFields } = useAuthStore();
  const navigate = useNavigate();

  const [currentStage, setCurrentStage] = useState<StageID>('intro');
  const [unlockedStages, setUnlockedStages] = useState<StageID[]>(['intro', 'cap1_inicio']);
  
  // Soundtrack audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const synthIntervalRef = useRef<any>(null);

  // CHAPTER 1: Pages data (Book layout)
  const [cap1Page, setCap1Page] = useState(0);
  const cap1Pages = [
    {
      title: "O Era Uma Vez...",
      emoji: "🏰",
      date: "O Primeiro Olhar",
      text: "Era uma vez, em um canto acolhegante do universo, duas almas curiosas que caminhavam sem saber que suas estradas um dia se cruzariam. Cada uma vivia no seu próprio ritmo, sob o mesmo céu estrelado com uma batida no peito que sussurrava: 'ainda há mais'.",
      art: "✨📖🎨",
      accent: "from-amber-100 to-amber-50"
    },
    {
      title: "A Faísca Inesperada",
      emoji: "⚡",
      date: "Sintonia Instantânea",
      text: "O destino adora pregar peças e de repente... Click! Um encontro casual, um olhar diferente, ou talvez apenas uma piada boba compartilhada. Foi o momento mágico onde percebemos que o mundo era mais colorido do que lembrávamos.",
      art: "🌸💌💫",
      accent: "from-pink-100 to-pink-50"
    },
    {
      title: "O Começo de Tudo",
      emoji: "🌱",
      date: "O Primeiro Acorde",
      text: "E assim abrimos o primeiro capítulo deste lindo livro que estamos escrevendo lado a lado. Cada risada, cada áudio longo no meio da noite e cada plano bobo viraram páginas indestrutíveis guardadas no fundo da nossa alma.",
      art: "🧸🎒🌷",
      accent: "from-emerald-100 to-emerald-50"
    }
  ];

  // CHAPTER 2: Cloud map nodes clicked state
  const [clickedClouds, setClickedClouds] = useState<string[]>([]);
  const cloudsData = [
    { id: 'ola', label: 'Primeiro Olá ☁️', text: 'Tudo começou com uma mensagem simples, mas que carregava o peso de uma constelação inteira. Uma conversa que fluiu como água e nos fez perder a hora.', emoji: '💬', color: 'from-sky-100 to-sky-200' },
    { id: 'risada', label: 'Primeira Risada ☁️', text: 'Aquele riso gostoso compartilhado pela primeira vez, quebrando qualquer gelo e mostrando que a gente se entendia até no silêncio.', emoji: '🤭', color: 'from-pink-100 to-pink-200' },
    { id: 'presente', label: 'Primeiro Presente ☁️', text: 'Pequenos mimos, gestos e o carinho artesanal que diz: "lembrei de você ao ver isso". O maior presente de todos sempre foi o seu tempo.', emoji: '🎁', color: 'from-amber-100 to-amber-200' },
    { id: 'encontro', label: 'Primeiro Encontro ☁️', text: 'O frio na barriga inevitável, o abraço apertado onde o tempo congelou de uma vez por todas, decretando que não queríamos mais nos soltar.', emoji: '✨', color: 'from-purple-100 to-purple-200' }
  ];

  // CHAPTER 3: Garden blooming flower seeds
  const [bloomedFlowers, setBloomedFlowers] = useState<string[]>([]);
  const gardenFlowers = [
    { id: 'janeiro', name: 'Rosa de Janeiro 🌹', text: 'Floresceu quando descobrimos que nosso primeiro dia juntos era eterno.', photo: 'https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?q=80&w=600&auto=format&fit=crop' },
    { id: 'fe', name: 'Girassol da Sorte 🌻', text: 'Representa a nossa fé inabalável de que cada amanhã seria mais doce.', photo: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop' },
    { id: 'passao', name: 'Tulipa da Paixão 🌷', text: 'Para celebrar os toques carinhosos, beijos doces e segurar de mãos fofas.', photo: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop' },
    { id: 'estrela', name: 'Estrela Lilás ⭐', text: 'O brilho mágico que guia nossos planos sob a lua nas noites frias.', photo: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop' }
  ];

  // CHAPTER 4: Musical Frequencies
  const [currentFreq, setCurrentFreq] = useState<'celestial' | 'aconchego' | 'sintonia'>('celestial');
  const frequencies = [
    { id: 'celestial', name: '📻 Onda Celestial', desc: 'Melodia leve de piano acústico que embala sonhos de contos de fada.', bg: 'bg-[#f6eee3] text-amber-950', border: 'border-amber-400', notes: [293.66, 369.99, 440.00, 587.33] },
    { id: 'aconchego', name: '📻 Abraço Quente', desc: 'Sintonia lo-fi bouncy e aconchegante para as manhãs de chuva.', bg: 'bg-[#fff0f3] text-rose-950', border: 'border-pink-300', notes: [329.63, 392.00, 493.88, 659.25] },
    { id: 'sintonia', name: '📻 Universo Cósmico', desc: 'Sinfonia imersiva e profunda de harpas de cristal para sintonizar corações.', bg: 'bg-[#e0f2fe] text-blue-950', border: 'border-sky-300', notes: [261.63, 349.23, 392.00, 523.25] }
  ];

  // CHAPTER 5: Dream regions
  const [exploredDreams, setExploredDreams] = useState<string[]>([]);
  const [activeDreamId, setActiveDreamId] = useState<string | null>(null);
  const dreamRegions = [
    { id: 'casa', name: '🏡 Nosso Cantinho', tittle: 'Nossa Casinha dos Sonhos', desc: 'Ter uma sala aconchegante com canecos combinando, um sofá gigante cheio de almofadas macias para rir até tarde e plantar flores fofas no parapeito da janela.', detail: 'Lá teremos quadros rústicos com nossas fotos, um cantinho para ler nossos livros favoritos e o aroma de bolo quentinho saindo do forno todo domingo à tarde.' },
    { id: 'viagem', name: '✈️ Nossas Viagens', tittle: 'Passaporte Cheio de Carinho', desc: 'Viajar sem destino, carimbar o passaporte em dezenas de países e colecionar fotos rindo em cada monumento histórico ou praia esquecida.', detail: 'Pegar estradas desconhecidas jogando jogos de adivinhação, ver o nascer do sol nas montanhas e deitar na areia quente sentindo a brisa leve do mar.' },
    { id: 'jogos', name: '🎮 Coop & Carinho', tittle: 'Nossos Jogos Favoritos', desc: 'Madrugadas rindo jogando coop, salvando mundos na TV e disputando partidas animadas por bobeira valendo massagem nas costas.', detail: 'Montar setups confortáveis com iluminação quente, lanchinhos caseiros no meio da noite e comemorar pulando juntos a cada chefe derrotado.' },
    { id: 'pet', name: '🐱 Nosso Futuro Pet', tittle: 'Patas e Abraços Fofos', desc: 'Ter gatinhos fofos ronronando pela sala de estar ou um cachorrinho brincalhão correndo atrás de bolinhas pela grama úmida.', detail: 'Dar nomes fofos inspirados em comidas ou desenhos, comprar brinquedos divertidos e passar horas vendo eles dormindo abraçados nas nossas pernas.' },
    { id: 'projetos', name: '📚 Nosso Futuro', tittle: 'Evolução e União Máxima', desc: 'Apoiar cada conquista sua, comemorar diplomas e construir uma carreira de mãos dadas, sendo o fã número um em cada palestra e projeto.', detail: 'Ajudar a estudar, dar massagens relaxantes nos dias exaustivos e celebrar juntos as vitórias profissionais abrindo uma bebida fofinha no jantar.' }
  ];

  // CHAPTER 6: Interactive Key and Lock
  const [isKeyInserted, setIsKeyInserted] = useState(false);
  const [isKeyRotating, setIsKeyRotating] = useState(false);
  const [isPortalUnlocked, setIsPortalUnlocked] = useState(false);

  const chapters: ChapterMeta[] = [
    { id: 'cap1_inicio', title: 'O Início', emoji: '📖', themeName: 'Livro Mágico' },
    { id: 'cap2_encontros', title: 'Os Encontros', emoji: '☁️', themeName: 'Cidade das Nuvens' },
    { id: 'cap3_jardim', title: 'O Jardim', emoji: '🌸', themeName: 'Jardim de Memórias' },
    { id: 'cap4_frequencia', title: 'Sintonia', emoji: '🎵', themeName: 'Universo Musical' },
    { id: 'cap5_sonhos', title: 'Os Sonhos', emoji: '🌎', themeName: 'Mundo Ideal' },
    { id: 'cap6_pedido', title: 'O Pedido', emoji: '❤️', themeName: 'Grand Finalle' }
  ];

  const currentSong = currentStage === 'cap4_frequencia' 
    ? frequencies.find(f => f.id === currentFreq)?.name || '📻 Frequência Ativa'
    : currentStage === 'cap1_inicio' ? 'Capítulo Um (Acoustic Folk Synth)'
    : currentStage === 'cap2_encontros' ? 'Cidade Celeste (Fluffy Cloud Bells)'
    : currentStage === 'cap3_jardim' ? 'Florescer da Alma (Garden Harp)'
    : currentStage === 'cap5_sonhos' ? 'Mundo Encantado (RPG Chiptune Chord)'
    : currentStage === 'cap6_pedido' ? 'Grande Melodia Cósmica (Final Symphony)'
    : 'Era uma vez... (Intro Chime)';

  const moveToStage = (next: StageID) => {
    setCurrentStage(next);
    if (!unlockedStages.includes(next)) {
      setUnlockedStages(prev => [...prev, next]);
    }
  };

  // Web Audio Synth to create genuine retro cozy ambient music
  useEffect(() => {
    if (!isPlayingAudio) {
      stopSynth();
      return;
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (!gainNodeRef.current) {
        gainNodeRef.current = ctx.createGain();
        gainNodeRef.current.connect(ctx.destination);
      }
      gainNodeRef.current.gain.setValueAtTime(volume, ctx.currentTime);

      startSynth(ctx, gainNodeRef.current, currentStage);
    } catch (e) {
      console.warn("Audio context suspended/blocked: ", e);
    }

    return () => stopSynth();
  }, [isPlayingAudio, currentStage, currentFreq, volume]);

  const stopSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  const startSynth = (ctx: AudioContext, gain: GainNode, stage: StageID) => {
    stopSynth();

    let notes = [261.63, 329.63, 392.00, 523.25]; // default
    let waveType: OscillatorType = 'sine';
    let tempo = 2800;

    if (stage === 'intro') {
      notes = [261.63, 329.63, 440.00, 523.25];
      waveType = 'sine';
      tempo = 3500;
    } else if (stage === 'cap1_inicio') {
      notes = [293.66, 369.99, 440.00, 587.33];
      waveType = 'triangle';
      tempo = 2400;
    } else if (stage === 'cap2_encontros') {
      notes = [329.63, 392.00, 493.88, 659.25];
      waveType = 'sine';
      tempo = 2000;
    } else if (stage === 'cap3_jardim') {
      notes = [261.63, 349.23, 392.00, 523.25];
      waveType = 'sine';
      tempo = 3200;
    } else if (stage === 'cap4_frequencia') {
      const activeF = frequencies.find(f => f.id === currentFreq);
      notes = activeF ? activeF.notes : [261.63, 329.63, 392.00, 523.25];
      waveType = 'sine';
      tempo = 2200;
    } else if (stage === 'cap5_sonhos') {
      notes = [220.00, 261.63, 329.63, 440.00];
      waveType = 'triangle';
      tempo = 2500;
    } else if (stage === 'cap6_pedido' || stage === 'celebracao') {
      notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25];
      waveType = 'triangle';
      tempo = 2900;
    }

    const playAmbientNote = () => {
      const now = ctx.currentTime;
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const nodeGain = ctx.createGain();

        osc.type = waveType;
        // slightly offset for rich warm lofi vibrato/chorus simulation
        osc.frequency.setValueAtTime(freq + (index * 1.5 - 2), now + (index * 0.15));

        nodeGain.gain.setValueAtTime(0, now);
        nodeGain.gain.linearRampToValueAtTime(0.06, now + 1.0);
        nodeGain.gain.exponentialRampToValueAtTime(0.0001, now + (tempo / 1000) - 0.2);

        osc.connect(nodeGain);
        nodeGain.connect(gain);

        osc.start(now + (index * 0.1));
        osc.stop(now + (tempo / 1000));
      });
    };

    playAmbientNote();
    synthIntervalRef.current = setInterval(playAmbientNote, tempo);
  };

  const handleDragUnlock = () => {
    setIsKeyInserted(true);
    setIsKeyRotating(true);
    toast.success("Inserindo a chave do amor... 🗝️", { duration: 1500 });
    
    setTimeout(() => {
      setIsPortalUnlocked(true);
      toast.success("O portal está se abrindo! 🚪✨", { duration: 2000 });
      setTimeout(() => {
        moveToStage('celebracao');
      }, 1500);
    }, 1500);
  };

  // Registers the sweet "YES" into Firebase profile and updates the status to celebracao
  const saveProposalAcceptance = async () => {
    try {
      if (user) {
        const currentPoints = profile?.heartPoints || 0;
        await updateProfileFields({
          status: 'online',
          heartPoints: currentPoints + 999,
          bio: "Oficialmente vivendo no Reino de Consto Himesama! ❤️",
          cargo: "Princesa do Reino"
        });
        toast.success("União consagrada com sucesso no Reino! Ganhaste 999 Pontos de Coração! ❤️", { duration: 4000 });
      }
    } catch {
      toast.error("Salvado com amor localmente!");
    }
  };

  useEffect(() => {
    if (currentStage === 'celebracao') {
      saveProposalAcceptance();
    }
  }, [currentStage]);

  const toggleCloudClick = (id: string) => {
    if (!clickedClouds.includes(id)) {
      setClickedClouds(p => [...p, id]);
      toast.success(`Nuvem de lembrança desbloqueada! ☁️`, { icon: '✨' });
    }
  };

  const toggleGardenBloom = (id: string) => {
    if (!bloomedFlowers.includes(id)) {
      setBloomedFlowers(p => [...p, id]);
      toast.success(`A semente começou a florescer! 🌸✨`, { icon: '🌱' });
    }
  };

  const toggleDreamExplored = (id: string) => {
    if (!exploredDreams.includes(id)) {
      setExploredDreams(p => [...p, id]);
    }
    setActiveDreamId(id);
  };

  return (
    <div className="absolute inset-0 w-full h-full min-h-screen bg-[#FFF8F0] select-none overflow-hidden flex flex-col justify-between font-sans text-[#4A3B3B]" id="pedido-unified-experience">
      <Toaster position="top-center" />
      
      {/* 🎬 INTRO SCREEN (TELA DE ENTRADA CINEMATOGRÁFICA) */}
      <AnimatePresence mode="wait">
        {currentStage === 'intro' && (
          <motion.div 
            key="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-stone-950 flex flex-col items-center justify-center p-6 text-center select-none z-50 text-white overflow-hidden"
          >
            {/* Cinematic Background magical deep sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-[#2A0845] opacity-80 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(ellipse_at_center,rgba(255,123,137,0.15),transparent_60%)] pointer-events-none" />
            
            {/* Cosmic Floating Twinkling gold Stars */}
            <div className="absolute w-[2px] h-[2px] bg-white rounded-full top-1/4 left-1/4 animate-ping" />
            <div className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full top-1/3 right-1/4 animate-pulse delay-500" />
            <div className="absolute w-1 h-1 bg-white rounded-full bottom-1/4 left-1/3 animate-pulse delay-200" />
            <div className="absolute w-1.5 h-1.5 bg-pink-300 rounded-full bottom-1/3 right-1/3 animate-ping delay-1000" />

            <div className="max-w-2xl px-4 space-y-12 relative z-10">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 1.5 } }
                }}
                className="space-y-8"
              >
                <motion.h4 
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 1.2 } }
                  }}
                  className="text-stone-300 font-sans tracking-[0.2em] uppercase text-xs font-black select-none"
                >
                  🏰 Consto Himesama presents
                </motion.h4>

                <motion.h1 
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 2, ease: "easeOut" } }
                  }}
                  className="font-serif italic font-normal text-3xl sm:text-5xl text-amber-100 tracking-wide select-none leading-relaxed"
                >
                  &ldquo;Era uma vez...&rdquo;
                </motion.h1>

                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 2 } }
                  }}
                  className="text-stone-400 font-sans text-sm sm:text-base leading-relaxed max-w-md mx-auto"
                >
                  duas pessoas que ainda não sabiam que estavam escrevendo a mesma história de amor.
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4.5, duration: 1 }}
                className="pt-6"
              >
                <button
                  onClick={() => {
                    setIsPlayingAudio(true);
                    moveToStage('cap1_inicio');
                  }}
                  className="relative group bg-[#FF7B89] hover:bg-[#ff90e8] text-white font-sans text-xs uppercase tracking-[0.15em] font-black py-4 px-10 rounded-2xl border-2 border-white shadow-[0_8px_0_#FFF] transition-all hover:translate-y-1 active:translate-y-2 active:shadow-none cursor-pointer"
                >
                  Abrir O Livro Mágico ✨
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 MAIN COHESIVE INTERACTIVE COMPONENT STRUCTURE */}
      {currentStage !== 'intro' && (
        <>
          {/* Header Progress Indicator & Animated Map */}
          <div className="bg-white border-b-[4px] border-[#4A3B3B] p-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none relative z-40">
            {/* Crown Heart Identity Tag */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-400 border-[3px] border-[#4A3B3B] shadow-[2px_2px_0px_#4A3B3B] flex items-center justify-center text-lg">
                👑
              </div>
              <div className="text-left font-sans">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-black leading-none">Minha Princesa</span>
                <span className="text-sm font-black uppercase text-[#4A3B3B] leading-none tracking-tight">Consto Himesama</span>
              </div>
            </div>

            {/* Micro Cinematic Chapters Map Nav */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 justify-center">
              {chapters.map((ch, idx) => {
                const isUnlocked = unlockedStages.includes(ch.id);
                const isActive = currentStage === ch.id;

                return (
                  <div key={ch.id} className="flex items-center shrink-0">
                    <button
                      disabled={!isUnlocked}
                      onClick={() => setCurrentStage(ch.id)}
                      className={`w-8 h-8 rounded-full border-2 border-[#4A3B3B] flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_#4A3B3B] transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                        isActive 
                          ? 'bg-[#FF7B89] text-white animate-pulse' 
                          : isUnlocked 
                          ? 'bg-amber-100 text-[#4A3B3B]' 
                          : 'bg-stone-100 text-stone-300 border-stone-200 shadow-none cursor-not-allowed'
                      }`}
                      title={`${ch.title} (${ch.themeName})`}
                    >
                      {ch.emoji}
                    </button>
                    {idx < chapters.length - 1 && (
                      <span className={`w-3 sm:w-6 h-0.5 border-t-2 border-[#4A3B3B] ${
                        isUnlocked && unlockedStages.includes(chapters[idx+1].id) ? 'border-solid' : 'border-dashed opacity-30'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Synth Engine Status Display */}
            <div className="flex items-center gap-1">
              <div className="bg-amber-50 border-2 border-[#4A3B3B] rounded-xl px-3 py-1 text-[10px] uppercase font-black tracking-wider text-amber-900 flex items-center gap-1.5 shadow-[2px_2px_0px_#4A3B3B]">
                <Music size={11} className="animate-spin text-[#FF7B89]" style={{ animationDuration: '4s' }} />
                <span className="max-w-[140px] truncate">{currentSong}</span>
              </div>
            </div>
          </div>

          {/* CHAPTER AREA VIEWPORTS WITH UNIFIED HAND-DRAWN MOOD DESIGN */}
          <div className="flex-grow w-full relative overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
            {/* Magical Paper Floating Stars Overlay for Cartoon Ambiance */}
            <div className="absolute inset-0 bg-[#FFF8F0] opacity-50 pointer-events-none" style={{ backgroundImage: `radial-gradient(#8a7373 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

            <AnimatePresence mode="wait">
              {/* CAPÍTULO I: O INÍCIO (Livro Mágico) */}
              {currentStage === 'cap1_inicio' && (
                <motion.div
                  key="chap1"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-4xl z-10"
                >
                  <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-amber-100 border-[2px] border-[#4A3B3B] rounded-full text-amber-800 text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#4A3B3B]">
                      📖 CAPÍTULO I — O INÍCIO
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#4A3B3B] mt-2 tracking-tight">O Livro das Nossas Memórias</h2>
                  </div>

                  <div className="relative bg-white border-[4px] border-[#4A3B3B] rounded-[32px] p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(74,59,59,1)] min-h-[385px] flex flex-col justify-between overflow-hidden">
                    {/* Spine line to give a real storybook feeling */}
                    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-r from-black/5 via-black/10 to-transparent text-transparent select-none z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-grow">
                      {/* Left: Cute Illustration Card */}
                      <div className={`p-6 border-[3px] border-[#4A3B3B] rounded-2xl aspect-square flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_#4A3B3B] bg-gradient-to-tr ${cap1Pages[cap1Page].accent}`}>
                        <span className="text-6xl mb-4 select-none filter drop-shadow-[2px_3px_0px_rgba(0,0,0,0.1)] hover:scale-110 transition-transform">{cap1Pages[cap1Page].emoji}</span>
                        <div className="text-3xl tracking-widest select-none mb-3">{cap1Pages[cap1Page].art}</div>
                        <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Página {cap1Page + 1} de {cap1Pages.length}</span>
                      </div>

                      {/* Right: Rich Narrative Text */}
                      <div className="text-left flex flex-col justify-center space-y-4 md:pl-4">
                        <span className="text-[10px] font-black text-[#FF7B89] uppercase tracking-wider block">{cap1Pages[cap1Page].date}</span>
                        <h3 className="text-2xl font-black text-[#4A3B3B] leading-none">{cap1Pages[cap1Page].title}</h3>
                        <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-serif italic text-justify">
                          &ldquo;{cap1Pages[cap1Page].text}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Book controls */}
                    <div className="mt-8 pt-6 border-t-[3px] border-[#4A3B3B]/10 border-dashed flex items-center justify-between">
                      <button
                        onClick={() => cap1Page > 0 && setCap1Page(cap1Page - 1)}
                        disabled={cap1Page === 0}
                        className={`px-4 py-2 border-2 border-[#4A3B3B] rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shadow-[2px_2px_0px_#4A3B3B] ${
                          cap1Page === 0 ? 'opacity-30 cursor-not-allowed shadow-none' : 'bg-white hover:bg-stone-50 text-[#4A3B3B] active:translate-y-0.5'
                        }`}
                      >
                        <ArrowLeft size={12} /> Voltar
                      </button>

                      <div className="flex gap-1.5">
                        {cap1Pages.map((_, i) => (
                          <div key={i} className={`w-2.5 h-2.5 rounded-full border-2 border-[#4A3B3B] transition-colors ${i === cap1Page ? 'bg-[#FF7B89]' : 'bg-white'}`} />
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (cap1Page < cap1Pages.length - 1) {
                            setCap1Page(cap1Page + 1);
                          } else {
                            moveToStage('cap2_encontros');
                          }
                        }}
                        className="px-5 py-2.5 bg-[#FF7B89] text-white border-2 border-[#4A3B3B] rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shadow-[2px_2px_0px_#4A3B3B] active:translate-y-0.5 cursor-pointer"
                      >
                        {cap1Page === cap1Pages.length - 1 ? 'Seguir Viagem ☁️' : 'Próxima'} <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CAPÍTULO II: OS ENCONTROS (Cidade das Nuvens) */}
              {currentStage === 'cap2_encontros' && (
                <motion.div
                  key="chap2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full max-w-4xl z-10"
                >
                  <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-sky-100 border-[2px] border-[#4A3B3B] rounded-full text-sky-800 text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#4A3B3B]">
                      ☁️ CAPÍTULO II — OS ENCONTROS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#4A3B3B] mt-2 tracking-tight">O Mapa Celestial da Cidade das Nuvens</h2>
                    <p className="text-stone-500 text-xs mt-1">Toque em cada uma das nuvens flutuantes para revelar momentos que o vento congelou.</p>
                  </div>

                  {/* Cartoon Map sky platform */}
                  <div className="relative bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 border-[4px] border-[#4A3B3B] rounded-[32px] p-6 sm:p-10 shadow-[8px_8px_0_0_rgba(74,59,59,1)] min-h-[460px] flex flex-col justify-between overflow-hidden">
                    {/* Clouds visualizer node array */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-auto relative z-10">
                      {cloudsData.map((node) => {
                        const clicked = clickedClouds.includes(node.id);
                        return (
                          <motion.button
                            key={node.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleCloudClick(node.id)}
                            className={`p-6 border-[3px] border-[#4A3B3B] rounded-2xl flex flex-col items-center justify-center text-center shadow-[4px_4px_0_#4A3B3B] bg-gradient-to-b cursor-pointer transition-all ${
                              clicked ? 'from-white to-blue-50 border-[#4a3b3b]' : 'from-stone-50 to-stone-100'
                            }`}
                          >
                            <span className="text-4xl mb-3 select-none filter drop-shadow-[2.5px_2.5px_0px_rgba(0,0,0,0.1)]">{node.emoji}</span>
                            <span className={`text-[11px] font-black uppercase tracking-wider ${clicked ? 'text-[#FF7B89]' : 'text-stone-400'}`}>
                              {node.label}
                            </span>
                            {clicked && (
                              <span className="mt-2 text-[8px] bg-green-200 border border-[#4A3B3B] px-1.5 py-0.5 rounded font-black text-green-900 uppercase">Lido</span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Explorable Bubble detail drawer below node select */}
                    <div className="mt-8 bg-[#FFFFFA] border-[3px] border-[#4A3B3B] p-5 rounded-2xl min-h-[120px] text-left relative z-10 shadow-[4px_4px_0_#4A3B3B]">
                      <h4 className="text-sm font-black uppercase tracking-wider text-[#4A3B3B] border-b-2 border-dashed border-[#4A3B3B]/10 pb-2 flex items-center gap-1.5">
                        <Cloud className="text-sky-400 animate-pulse" size={16} /> Lembrança Selecionada
                      </h4>
                      <div className="text-sm text-stone-700 mt-3 font-medium italic">
                        {clickedClouds.length === 0 ? (
                          <p className="text-stone-400">Clique em qualquer nuvem acima para começar a relembrar nossos marcos mais doces...</p>
                        ) : (
                          <p>
                            {cloudsData.find(c => c.id === clickedClouds[clickedClouds.length - 1])?.text}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stage controller footer and unlock */}
                    <div className="mt-8 pt-6 border-t-[3px] border-[#4A3B3B]/10 border-dashed flex justify-between items-center z-10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-950">
                        Nuvens abertas: {clickedClouds.length} de {cloudsData.length}
                      </span>

                      <button
                        onClick={() => moveToStage('cap3_jardim')}
                        disabled={clickedClouds.length < cloudsData.length}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 border-[#4A3B3B] flex items-center gap-1.5 shadow-[2px_2px_0px_#4A3B3B] transition-all cursor-pointer ${
                          clickedClouds.length < cloudsData.length
                            ? 'bg-stone-100 text-stone-300 border-stone-200 shadow-none cursor-not-allowed'
                            : 'bg-emerald-400 hover:bg-emerald-500 text-white active:translate-y-0.5'
                        }`}
                      >
                        Entrar no Jardim 🌸 <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CAPÍTULO III: JARDIM DAS MEMÓRIAS (Flowers seed bloom trigger) */}
              {currentStage === 'cap3_jardim' && (
                <motion.div
                  key="chap3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-4xl z-10"
                >
                  <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-pink-100 border-[2px] border-[#4A3B3B] rounded-full text-pink-800 text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#4A3B3B]">
                      🌸 CAPÍTULO III — MEMÓRIAS JARDIM
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#4A3B3B] mt-2 tracking-tight">O Jardim do Nosso Sentimento</h2>
                    <p className="text-stone-500 text-xs mt-1">Toque em cada canteiro fértil para semear, regar e ver florescer recordações lindas.</p>
                  </div>

                  <div className="relative bg-gradient-to-b from-[#e6f4ea] via-emerald-50 to-[#FAF0E6] border-[4px] border-[#4A3B3B] rounded-[32px] p-6 sm:p-10 shadow-[8px_8px_0_0_rgba(74,59,59,1)] min-h-[460px] flex flex-col justify-between overflow-hidden">
                    
                    {/* Flower garden grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-auto relative z-10">
                      {gardenFlowers.map((flower) => {
                        const isBloomed = bloomedFlowers.includes(flower.id);
                        return (
                          <motion.div
                            key={flower.id}
                            whileHover={{ y: -5 }}
                            onClick={() => toggleGardenBloom(flower.id)}
                            className={`p-4 border-[3px] border-[#4A3B3B] rounded-[24px] bg-white text-center shadow-[4px_4px_0_#4A3B3B] cursor-pointer transition-all flex flex-col items-center justify-between min-h-[185px] ${
                              isBloomed ? 'border-[#FF7B89] bg-pink-50/50' : 'hover:bg-emerald-50'
                            }`}
                          >
                            <div className="h-24 w-full relative overflow-hidden rounded-xl border-2 border-[#4A3B3B]/10 bg-stone-50 flex items-center justify-center">
                              {isBloomed ? (
                                <img src={flower.photo} alt={flower.name} className="w-full h-full object-cover animate-fade-in" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="text-3xl animate-bounce">🌱</div>
                              )}
                            </div>

                            <span className="text-[10px] font-black uppercase text-[#4A3B3B] mt-2 block tracking-tight truncate max-w-full">
                              {flower.name}
                            </span>
                            
                            <span className={`text-[8px] px-2 py-0.5 rounded-full border border-[#4A3B3B]/20 font-black tracking-widest mt-1 ${
                              isBloomed ? 'bg-pink-100 text-[#FF7B89]' : 'bg-stone-100 text-stone-400'
                            }`}>
                              {isBloomed ? 'FLORESCIDO' : 'SEMENTE'}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Live diary description card */}
                    <div className="mt-8 bg-white border-[3px] border-[#4A3B3B] p-5 rounded-2xl text-left relative z-10 shadow-[4px_4px_0_#4A3B3B]">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#4A3B3B] border-b-2 border-dashed border-[#4A3B3B]/10 pb-2 flex items-center gap-1.5">
                        <Sparkle className="text-[#FF7B89] animate-spin" size={14} style={{ animationDuration: '4s' }} /> Diário de Cultivo
                      </h4>
                      <p className="text-sm text-stone-700 mt-2 font-medium italic">
                        {bloomedFlowers.length === 0 ? (
                          <span className="text-stone-400">Ajude nosso jardim a florescer clicando nas sementes de recordação acima...</span>
                        ) : (
                          <span>
                            {gardenFlowers.find(f => f.id === bloomedFlowers[bloomedFlowers.length - 1])?.text}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Garden status controls */}
                    <div className="mt-8 pt-6 border-t-[3px] border-[#4A3B3B]/10 border-dashed flex justify-between items-center z-10">
                      <span className="text-[10px] font-black uppercase text-emerald-900">
                        Flores cultivadas: {bloomedFlowers.length} de {gardenFlowers.length}
                      </span>

                      <button
                        onClick={() => moveToStage('cap4_frequencia')}
                        disabled={bloomedFlowers.length < gardenFlowers.length}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 border-[#4A3B3B] flex items-center gap-1.5 shadow-[2px_2px_0px_#4A3B3B] transition-all cursor-pointer ${
                          bloomedFlowers.length < gardenFlowers.length
                            ? 'bg-stone-100 text-stone-300 border-stone-200 shadow-none cursor-not-allowed'
                            : 'bg-emerald-400 hover:bg-emerald-500 text-white active:translate-y-0.5'
                        }`}
                      >
                        Sintonizar Frequência 🎵 <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CAPÍTULO IV: NOSSA FREQUÊNCIA (Musical / Sound reactive concept) */}
              {currentStage === 'cap4_frequencia' && (
                <motion.div
                  key="chap4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full max-w-4xl z-10"
                >
                  <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-rose-100 border-[2px] border-[#4A3B3B] rounded-full text-rose-800 text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#4A3B3B]">
                      🎵 CAPÍTULO IV — NOSSA FREQUÊNCIA
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#4A3B3B] mt-2 tracking-tight">O Sintonizador de Corações</h2>
                    <p className="text-stone-500 text-xs mt-1">Conecte-se na nossa vibração e ouça a melodia do nosso amor alternando entre canais.</p>
                  </div>

                  <div className="relative bg-[#1A1A1A] border-[4px] border-[#4A3B3B] rounded-[32px] p-6 sm:p-10 shadow-[8px_8px_0_0_rgba(72,50,50,1)] min-h-[460px] flex flex-col justify-between overflow-hidden text-stone-100">
                    {/* Visualizer sound responsive design background */}
                    <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,rgba(255,123,137,0.12),transparent_70%) pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-grow relative z-10">
                      {/* Left side: Spinning Vinyl record deck */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-44 h-44 rounded-full bg-stone-950 border-[6px] border-[#4A3B3B] shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
                          {/* Inner Vinyl Groove texture lines */}
                          <div className="absolute inset-2 rounded-full border border-dashed border-stone-800 opacity-60" />
                          <div className="absolute inset-6 rounded-full border border-stone-800 opacity-40" />
                          <div className="absolute inset-10 rounded-full border border-dashed border-stone-800 opacity-50" />

                          {/* Center core label */}
                          <motion.div
                            animate={isPlayingAudio ? { rotate: 360 } : {}}
                            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                            className="w-18 h-18 rounded-full bg-[#FF7B89] border-4 border-stone-900 opacity-95 flex items-center justify-center text-center p-2 shadow-inner"
                          >
                            <Heart size={14} className="text-white fill-white animate-pulse" />
                          </motion.div>
                        </div>
                        <span className="text-[10px] font-black uppercase text-[#FF7B89] mt-4 tracking-wider">
                          {isPlayingAudio ? 'TOCANDO AGORA 💽' : 'DECK CONGELADO 🔕'}
                        </span>
                      </div>

                      {/* Right side: Interacting spectrum waves and frequency selectors */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">Escolha uma Frequência</span>
                        <div className="flex flex-col gap-3">
                          {frequencies.map((freq) => {
                            const isSelected = currentFreq === freq.id;
                            return (
                              <button
                                key={freq.id}
                                onClick={() => {
                                  setCurrentFreq(freq.id as any);
                                  setIsPlayingAudio(true);
                                  toast.success(`Frequência ajustada para ${freq.name}! 📻`);
                                }}
                                className={`p-4 border-[3px] border-[#4A3B3B] rounded-2xl flex flex-col text-left transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-amber-400 text-stone-950 shadow-[3px_3px_0_#4A3B3B] scale-[1.01]' 
                                    : 'bg-stone-800 text-stone-400 shadow-none hover:bg-stone-750'
                                }`}
                              >
                                <span className="font-sans font-black text-xs uppercase leading-none tracking-wide">{freq.name}</span>
                                <span className={`text-[10px] mt-1.5 font-sans leading-relaxed ${isSelected ? 'text-stone-900 font-bold' : 'text-stone-500'}`}>{freq.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Integrated footer logic */}
                    <div className="mt-8 pt-6 border-t-[3px] border-stone-800 border-dashed flex justify-between items-center z-10">
                      <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider">
                        Sintonia Atual de Corações: 99.9%
                      </span>

                      <button
                        onClick={() => moveToStage('cap5_sonhos')}
                        className="px-6 py-2.5 bg-[#FF7B89] text-white border-2 border-[#4A3B3B] rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#4A3B3B] hover:bg-rose-500 transition-all cursor-pointer active:translate-y-0.5"
                      >
                        Nossos Sonhos 🌎 <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CAPÍTULO V: O MUNDO QUE EU SONHO (Cozy RPG map regions) */}
              {currentStage === 'cap5_sonhos' && (
                <motion.div
                  key="chap5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-4xl z-10"
                >
                  <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-yellow-100 border-[2px] border-[#4A3B3B] rounded-full text-yellow-800 text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#4A3B3B]">
                      🌎 CAPÍTULO V — O MUNDO SECRETO
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#4A3B3B] mt-2 tracking-tight">O Reino que Desenhamos Juntos</h2>
                    <p className="text-stone-500 text-xs mt-1">Nossos sonhos não são apenas ideias: são destinos que vamos conquistar passo a passo.</p>
                  </div>

                  <div className="relative bg-gradient-to-tr from-yellow-100 via-amber-50 to-orange-100 border-[4px] border-[#4A3B3B] rounded-[32px] p-6 sm:p-10 shadow-[8px_8px_0_0_rgba(74,59,59,1)] min-h-[460px] flex flex-col justify-between overflow-hidden">
                    
                    {/* Whimsical Land cluster grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 my-auto relative z-10">
                      {dreamRegions.map((dream) => {
                        const isExplored = exploredDreams.includes(dream.id);
                        const isActive = activeDreamId === dream.id;

                        return (
                          <motion.button
                            key={dream.id}
                            whileHover={{ y: -4 }}
                            onClick={() => toggleDreamExplored(dream.id)}
                            className={`p-4 border-[3px] border-[#4A3B3B] rounded-[22px] bg-white flex flex-col items-center justify-center text-center shadow-[4px_4px_0_#4A3B3B] cursor-pointer transition-all ${
                              isActive
                                ? 'bg-amber-300 scale-[1.02] border-[#e84e4e]'
                                : isExplored 
                                ? 'bg-amber-50' 
                                : 'hover:bg-yellow-50/50'
                            }`}
                          >
                            <span className="text-4xl mb-2.5 filter drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">{dream.name.split(' ')[0]}</span>
                            <span className="text-[10px] font-black text-[#4A3B3B] uppercase tracking-wider leading-none">
                              {dream.name.substring(3)}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Dream Drawer Details Modal/Vessel */}
                    <div className="mt-8 bg-amber-50 border-[3px] border-[#4A3B3B] p-5 rounded-2xl min-h-[120px] text-left relative z-10 shadow-[4px_4px_0_#4A3B3B]">
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 border-b-2 border-dashed border-[#4A3B3B]/10 pb-2 flex items-center gap-1.5">
                        <Compass className="text-amber-600 animate-spin" size={14} style={{ animationDuration: '6s' }} /> Detalhes da Nossa Jornada
                      </h4>
                      <div className="mt-2 text-sm leading-relaxed text-amber-950">
                        {activeDreamId === null ? (
                          <p className="text-amber-800/60 italic font-medium">Explore as ilhas do nosso futuro clicando em cada botão acima...</p>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block">
                              {dreamRegions.find(d => d.id === activeDreamId)?.tittle}
                            </span>
                            <p className="font-bold">{dreamRegions.find(d => d.id === activeDreamId)?.desc}</p>
                            <p className="text-[#4D3F3F] text-xs pt-1 border-t border-dashed border-[#4A3B3B]/10 mt-1 italic leading-relaxed">
                              &ldquo;{dreamRegions.find(d => d.id === activeDreamId)?.detail}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Explore footer */}
                    <div className="mt-8 pt-6 border-t-[3px] border-[#4A3B3B]/10 border-dashed flex justify-between items-center z-10">
                      <span className="text-[10px] font-black uppercase text-amber-900">
                        Regiões desbravadas: {exploredDreams.length} de {dreamRegions.length}
                      </span>

                      <button
                        onClick={() => moveToStage('cap6_pedido')}
                        disabled={exploredDreams.length < dreamRegions.length}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 border-[#4A3B3B] flex items-center gap-1.5 shadow-[2px_2px_0px_#4A3B3B] transition-all cursor-pointer ${
                          exploredDreams.length < dreamRegions.length
                            ? 'bg-stone-100 text-stone-300 border-stone-200 shadow-none cursor-not-allowed'
                            : 'bg-[#FF7B89] hover:bg-rose-500 text-white active:translate-y-0.5'
                        }`}
                      >
                        O Grande Final ✨ <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CAPÍTULO VI: O GRANDE FINAL (Cinematic Lock & Key transition) */}
              {currentStage === 'cap6_pedido' && (
                <motion.div
                  key="chap6"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full max-w-2xl z-10 text-center space-y-8"
                >
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 border-[2px] border-[#e84e4e] rounded-full text-[#e84e4e] text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#e84e4e] animate-bounce">
                      ✨ O GRANDE FINAL
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black text-[#4A3B3B] tracking-tight font-serif leading-tight">
                      Depois de tudo isso...
                    </h3>
                    <p className="text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
                      De cada início escrito no livro, de cada risada no céu de nuvens, de cada flor cultivada com paciência e amor, e de cada sonho que juramos realizar...
                    </p>
                  </div>

                  {/* Elegant Golden Locks Frame with Key Interactive Box */}
                  <div className="bg-white border-[4px] border-[#4A3B3B] rounded-[36px] p-8 sm:p-12 shadow-[8px_8px_0_0_rgba(74,59,59,1)] space-y-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#ff7b89_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

                    <div className="text-2xl sm:text-3xl font-black text-[#FF7B89] tracking-tight animate-pulse uppercase">
                      Quer namorar comigo?
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
                      {/* Interactive Key & Lock container */}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider mb-2 block">1. A Chave do Amor</span>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleDragUnlock}
                          disabled={isPortalUnlocked}
                          className={`w-16 h-16 rounded-2xl border-[3px] border-[#4A3B3B] flex items-center justify-center text-stone-900 shadow-[3px_3px_0_#4A3B3B] transition-all cursor-pointer ${
                            isKeyInserted ? 'bg-amber-100' : 'bg-yellow-300 hover:bg-yellow-400'
                          }`}
                        >
                          <Key size={32} className={`text-stone-900 ${isKeyRotating ? 'animate-spin' : ''}`} />
                        </motion.button>
                        <span className="text-[10px] font-bold text-stone-500 mt-2 block">Clique para usar</span>
                      </div>

                      {/* Bridge Line */}
                      <div className="hidden sm:block w-16 h-1 border-t-4 border-dashed border-[#4A3B3B] opacity-60" />

                      {/* Magical Lock Portal */}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider mb-2 block">2. Fechadura do Destino</span>
                        <div className={`w-16 h-16 rounded-2xl border-[3px] border-[#4A3B3B] flex items-center justify-center text-stone-900 shadow-[3px_3px_0_#4A3B3B] ${
                          isPortalUnlocked ? 'bg-green-100 border-[#FF7B89]' : 'bg-stone-50'
                        }`}>
                          {isPortalUnlocked ? (
                            <Unlock size={32} className="text-green-600 animate-pulse" />
                          ) : (
                            <Lock size={32} className="text-stone-400" />
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-stone-500 mt-2 block">
                          {isPortalUnlocked ? 'Destravado' : 'Bloqueado'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-stone-500 max-w-sm mx-auto italic">
                      "Para abrir as portas do nosso reino e selar nosso amor eterno no livro místico."
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CELEBRAÇÃO SCREEN: O REINO DO CASAL HERO PORTAL */}
              {currentStage === 'celebracao' && (
                <motion.div
                  key="celebracao-stage"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full max-w-2xl z-10 text-center space-y-6"
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-yellow-100 border-[3px] border-[#4A3B3B] rounded-full text-amber-800 text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0_#4A3B3B] animate-bounce">
                      ✨ SIM! CONSAGRADO ❤️
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black text-[#4A3B3B] mt-4 tracking-tighter uppercase leading-none font-sans">
                      Nosso Reino Começa Agora!
                    </h1>
                    <p className="text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
                      Nosso romance foi consagrado com sucesso sob as estrelas. O livro das nossas lembranças está oficialmente aberto para sempre.
                    </p>
                  </div>

                  <div className="bg-white border-[4px] border-[#e84e4e] rounded-[36px] p-8 sm:p-12 shadow-[8px_8px_0_0_rgba(232,78,78,1)] text-center relative overflow-hidden">
                    {/* Glowing gate icon decoration */}
                    <div className="w-24 h-24 rounded-full bg-pink-100 border-4 border-[#e84e4e] shadow-[4px_4px_0_#4A3B3B] flex items-center justify-center mx-auto mb-6 hover:scale-105 transition-all">
                      <DoorOpen size={48} className="text-[#FF7B89] animate-pulse" />
                    </div>

                    <p className="text-md sm:text-lg text-stone-700 font-bold max-w-md mx-auto leading-relaxed italic">
                      "Que cada novo dia ao seu lado seja uma página repleta de carinho, felicidade e risadas gostosas. Bem-vinda ao nosso mundo, minha Himesama!"
                    </p>

                    <div className="pt-8">
                      <button
                        onClick={() => navigate('/painel')}
                        className="py-4.5 px-8 bg-emerald-400 text-white font-sans text-xs uppercase tracking-[0.15em] font-black rounded-3xl border-[3px] border-[#4A3B3B] shadow-[0_8px_0_#4A3B3B] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all cursor-pointer"
                      >
                        Entrar no Nosso Mundo 🦄
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Soundtrack floating quick controls panel */}
          <div className="fixed bottom-4 right-4 z-50 bg-stone-900 border-2 border-[#4A3B3B] text-white p-3 rounded-2xl shadow-[4px_4px_0_#4A3B3B] flex items-center gap-3">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`p-2 rounded-xl border-2 border-black transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isPlayingAudio ? 'bg-rose-500 text-white' : 'bg-stone-800 text-stone-400'
              }`}
              title={isPlayingAudio ? 'Mudar para mudo' : 'Ativar som'}
            >
              {isPlayingAudio ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
            <div className="flex flex-col text-left font-sans">
              <span className="text-[8px] font-black uppercase text-stone-400 tracking-wider leading-none">Música de Fundo</span>
              <span className="text-[10px] font-black text-white max-w-[125px] truncate mt-1 leading-tight block">
                {isPlayingAudio ? currentSong : 'Som Mutado'}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
