import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Music, 
  Image as ImageIcon, 
  Mail, 
  BookOpen, 
  Clock, 
  Play, 
  Pause, 
  Calendar, 
  Award, 
  Trophy, 
  Gamepad2, 
  Trash2, 
  Plus, 
  MapPin, 
  CheckSquare, 
  Lock, 
  Unlock, 
  Volume2, 
  Sparkles, 
  Star, 
  Coins, 
  MessageCircle, 
  Check, 
  ArrowRight,
  Palette,
  Compass,
  Map,
  Smile,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../../store/auth';
import toast from 'react-hot-toast';

// Dynamic Subtabs of the private couples network
type SubtabID = 
  | 'inicio' 
  | 'perfil' 
  | 'timeline' 
  | 'fotos' 
  | 'cartas' 
  | 'playlist' 
  | 'calendario' 
  | 'conquistas' 
  | 'jogos' 
  | 'metas' 
  | 'capsula' 
  | 'memorias' 
  | 'lugares' 
  | 'loja';

export function DashboardTab() {
  const { profile, addHeartPoints, updateProfileFields } = useAuthStore();
  
  // Real active dynamic subtab within our beautiful ecosystem
  const [activeSubtab, setActiveSubtab] = useState<SubtabID>('inicio');

  // 1. Time Calculation together since custom Date
  // Example starting anniversary: October 12, 2024
  const startDate = new Date('2024-10-12T19:00:00');
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    months: 0,
    years: 0
  });

  useEffect(() => {
    const updateTicker = () => {
      const now = new Date();
      const diffMs = now.getTime() - startDate.getTime();

      const seconds = Math.floor((diffMs / 1000) % 60);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      const totalMonths = Math.floor(days / 30.4375);
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;

      setTimeTogether({ days, hours, minutes, seconds, months, years });
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Profile do Casal details
  const [nicknames, setNicknames] = useState({ him: 'Emannuel 🤴', her: 'Princesa Hime 👸' });
  const [favorites, setFavorites] = useState({
    food: 'Lamen & Pizza Doce 🍕🍜',
    movie: 'A Viagem de Chihiro 🏮🐉',
    song: 'Perfect (Ed Sheeran) 🎻🎵',
    destination: 'Gramado no Inverno ❄️⛷️'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // 3. Linha do Tempo (Interactive map milestones)
  const [timeline, setTimeline] = useState([
    { year: '2024', date: '12 Out', title: 'Primeiro "Olá" 💬', desc: 'Sintonia instantânea pelo chat que levou horas sem cansar.' },
    { year: '2024', date: '18 Out', title: 'Primeiro Encontro 😍', desc: 'Frio na barriga, abraço apertado e o cheiro doce no ar.' },
    { year: '2024', date: '01 Nov', title: 'Primeira Viagem Juntos 🌊', desc: 'Sentados na areia sob um céu estrelado escutando as ondas do mar.' },
    { year: '2025', date: '15 Fev', title: 'O Pedido de Namoro 💍', desc: 'O portal encantado que transformou nossas rotinas em um sonho vivo.' }
  ]);
  const [newTimeline, setNewTimeline] = useState({ date: '', title: '', desc: '' });

  // 4. Album de Fotos (With internal hearts, liking and custom uploads)
  const [photos, setPhotos] = useState([
    { id: 1, title: 'Assistindo Ghibli juntinhos', category: 'Favoritas', url: 'https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?q=80&w=400&auto=format&fit=crop', likes: 12, comments: ['Coisa mais fofa do mundo!', 'Que dia inesquecível'] },
    { id: 2, title: 'Comendo Lamen na chuva', category: 'Momentos engraçados', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop', likes: 8, comments: ['Ficamos encharcados, mas valeu a pena!'] },
    { id: 3, title: 'No alto do mirante', category: 'Viagens', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&auto=format&fit=crop', likes: 15, comments: ['A vista era linda, mas você era mais'] }
  ]);
  const [photoFilter, setPhotoFilter] = useState<'Todas' | 'Favoritas' | 'Viagens' | 'Momentos engraçados'>('Todas');
  const [newCommentText, setNewCommentText] = useState<{ [id: number]: string }>({});

  const handleLikePhoto = (id: number) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    toast.success('Você curtiu esta memória! ❤️', { duration: 1000 });
  };

  const handleAddComment = (id: number) => {
    const text = newCommentText[id];
    if (!text?.trim()) return;
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, comments: [...p.comments, text] } : p));
    setNewCommentText(prev => ({ ...prev, [id]: '' }));
    toast.success('Comentário guardado no álbum! 💬');
  };

  // 5. Letter creator (Interactive letters with lock dates)
  const [letters, setLetters] = useState([
    { id: 1, type: 'Romântica', title: 'Minha Razão de Sorrir', author: 'Emannuel', status: 'ready', text: 'Você mudou minha vida por completo. Cada detalhe seu, desde o riso tímido até as conversas profundas na madrugada, me fazem ter certeza absoluta de que fomos feitos um para o outro.', date: '12 Out 2024' },
    { id: 2, type: 'Surpresa', title: 'Leia em um dia difícil', author: 'Emannuel', status: 'ready', text: 'Se as coisas estiverem cinzas hoje, feche os olhos e lembre de quando segurei sua mão. Todo obstáculo é temporário quando temos o nosso mundo como abrigo.', date: '05 Jan 2025' },
    { id: 3, type: 'Programada', title: 'Nossa Cápsula de 1 Ano', author: 'Emannuel', status: 'locked', text: 'Se você está lendo isso, comemoramos 1 ano juntos! Conseguimos viajar para Gramado? Continuamos viciados nos mesmos jogos? Amo-te infinitamente.', date: '12 Out 2026' }
  ]);
  const [newLetterForm, setNewLetterForm] = useState({ title: '', text: '', type: 'Romântica', lockType: 'none' });
  const [selectedLetter, setSelectedLetter] = useState<any | null>(null);

  const handleCreateLetter = () => {
    if (!newLetterForm.title || !newLetterForm.text) {
      toast.error('Preencha o título e o texto da sua cartinha fofa!');
      return;
    }
    const isLocked = newLetterForm.lockType !== 'none';
    const cleanLetter = {
      id: letters.length + 1,
      type: newLetterForm.type,
      title: newLetterForm.title,
      author: 'Emannuel',
      status: isLocked ? 'locked' : 'ready',
      text: newLetterForm.text,
      date: isLocked ? 'Bloqueada temporariamente 🔒' : 'Liberada hoje ✨'
    };
    setLetters([cleanLetter, ...letters]);
    toast.success('Cartinha lacrada e enviada com sucesso! 💌');
    setNewLetterForm({ title: '', text: '', type: 'Romântica', lockType: 'none' });
  };

  // 6. Playlist (Couples musical list with feedback & Spotify links)
  const [playlist, setPlaylist] = useState([
    { id: 1, song: 'Perfect', artist: 'Ed Sheeran', category: 'Nossa Música', lyric: '"Baby, I\'m dancing in the dark, with you between my arms..."', comment: 'Lembra nosso primeiro jantar romântico.' },
    { id: 2, song: 'Yellow', artist: 'Coldplay', category: 'Românticas', lyric: '"Look at the stars, look how they shine for you..."', comment: 'Sempre me lembra do brilho dos teus olhos.' },
    { id: 3, song: 'Fly Me to the Moon', artist: 'Frank Sinatra', category: 'Viagens', lyric: '"Fly me to the moon, let me play among the stars..."', comment: 'Tocando no rádio do carro rumo à serra.' }
  ]);
  const [newSongForm, setNewSongForm] = useState({ song: '', artist: '', lyric: '', comment: '' });

  const handleAddSong = () => {
    if (!newSongForm.song || !newSongForm.artist) return;
    setPlaylist([...playlist, { id: playlist.length + 1, ...newSongForm, category: 'Nossa Música' }]);
    setNewSongForm({ song: '', artist: '', lyric: '', comment: '' });
    toast.success('Música sintonizada na nossa rádio! 📻');
  };

  // 7. Calendário (Dates & custom events countdowns)
  const [events, setEvents] = useState([
    { id: 1, title: 'Nosso Mesversário', date: '2026-07-12', emoji: '🎉', type: 'Mesversário' },
    { id: 2, title: 'Viagem de Férias', date: '2026-08-20', emoji: '✈️', type: 'Viagem' },
    { id: 3, title: 'Aniversário da Princesa', date: '2026-10-31', emoji: '👑', type: 'Aniversário' }
  ]);
  const [newEventDate, setNewEventDate] = useState({ title: '', date: '', emoji: '💝' });

  const handleAddEvent = () => {
    if (!newEventDate.title || !newEventDate.date) return;
    setEvents([...events, { id: events.length + 1, ...newEventDate, type: 'Encontro' }]);
    setNewEventDate({ title: '', date: '', emoji: '💝' });
    toast.success('Compromisso de amor adicionado na agenda! 📅');
  };

  // 8. Achievements (Steam style with real claims)
  const [achievements, setAchievements] = useState([
    { id: 'primeira_foto', title: 'Primeiro Frame Eterno 📸', desc: 'Fez o upload da primeira foto no álbum do casal.', unlocked: true, reward: 100, claimed: true },
    { id: '100_dias', title: '100 Dias Segurando sua Mão 🤝', desc: 'Alcançou a marca de 100 dias oficiais de união.', unlocked: true, reward: 250, claimed: false },
    { id: 'cartas_50', title: 'Escriba do Amor 🖋️', desc: 'Escreveu mais de 10 cartinhas ou metas juntos.', unlocked: false, reward: 300, claimed: false },
    { id: 'quiz_perfeito', title: 'Sintonia de Alma Copas 🧠', desc: 'Respondeu perfeitamente todo o quiz do casal.', unlocked: false, reward: 200, claimed: false }
  ]);

  const handleClaimAchievementReward = async (id: string, reward: number) => {
    setAchievements(prev => prev.map(ac => ac.id === id ? { ...ac, claimed: true } : ac));
    await addHeartPoints(reward);
    toast.success(`Prêmio coletado! +${reward} 💖 adicionados ao teu cofre!`);
  };

  // 9. Romantic Minigames (Quiz / Memory Game)
  // GAME A: QUIZ
  const quizQuestions = [
    { q: 'Qual foi o local de nosso primeiro encontro físico?', options: ['Cinema no Shopping', 'Restaurante de Sushi', 'Parque Linear', 'Cafeteria Rústica'], correct: 1 },
    { q: 'Qual a comida favorita que ela vive pedindo no final de semana?', options: ['Hambúrguer Gourmet', 'Rodízio de Lamen/Pizza', 'Barca de Temaki', 'Massa Italiana'], correct: 1 },
    { q: 'Quem dorme mais rápido assistindo a um filme à noite?', options: ['Emannuel', 'Ela (A Princesa)', 'Os dois juntos em 5 minutos', 'Ninguém dorme'], correct: 2 }
  ];
  const [currentQuizQ, setCurrentQuizQ] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleQuizAnswer = (idx: number) => {
    if (idx === quizQuestions[currentQuizQ].correct) {
      setQuizScore(prev => prev + 1);
      toast.success('Resposta Perfeita! Sintonia excelente! 🎉');
    } else {
      toast.error('Ué! Quem sabe no próximo jantar... 🤭');
    }

    if (currentQuizQ < quizQuestions.length - 1) {
      setCurrentQuizQ(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // Unlock achievement if perfect score
      if (quizScore + (idx === quizQuestions[currentQuizQ].correct ? 1 : 0) === quizQuestions.length) {
        setAchievements(prev => prev.map(ac => ac.id === 'quiz_perfeito' ? { ...ac, unlocked: true } : ac));
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuizQ(0);
    setQuizScore(0);
    setQuizFinished(false);
  };

  // GAME B: MEMORY MATCH
  const memoryIcons = ['💖', '🍕', '✈️', '💍', '🧸', '🌸', '🍿', '🔑'];
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const initMemoryGame = () => {
    const doubled = [...memoryIcons, ...memoryIcons];
    const shuffled = doubled
      .map((icon, idx) => ({ id: idx, icon, isFlipped: false }))
      .sort(() => Math.random() - 0.5);
    setMemoryCards(shuffled);
    setSelectedCards([]);
    setMatchedCards([]);
    setMemoryMoves(0);
  };

  useEffect(() => {
    if (activeSubtab === 'jogos') {
      initMemoryGame();
    }
  }, [activeSubtab]);

  const handleCardClick = (idx: number) => {
    if (selectedCards.length === 2 || matchedCards.includes(idx) || selectedCards.includes(idx)) return;

    const newSelected = [...selectedCards, idx];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMemoryMoves(p => p + 1);
      const first = memoryCards[newSelected[0]];
      const second = memoryCards[newSelected[1]];

      if (first.icon === second.icon) {
        setMatchedCards(prev => [...prev, newSelected[0], newSelected[1]]);
        setSelectedCards([]);
        toast.success('Par combinado! 💞', { duration: 1000 });
      } else {
        setTimeout(() => setSelectedCards([]), 1100);
      }
    }
  };

  // 10. Metas Compartilhadas (Couple interactive goals)
  const [goals, setGoals] = useState([
    { id: 1, title: 'Completar o Diário de Fotos do Casal', category: 'Diário', progress: 85, completed: false },
    { id: 2, title: 'Assistir a toda a Coleção Studio Ghibli', category: 'Entretenimento', progress: 40, completed: false },
    { id: 3, title: 'Juntar R$ 2.500 para nossa viagem de fim de ano', category: 'Economias', progress: 65, completed: false }
  ]);
  const [newGoalTitle, setNewGoalTitle] = useState('');

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;
    setGoals([...goals, { id: goals.length + 1, title: newGoalTitle, category: 'União', progress: 0, completed: false }]);
    setNewGoalTitle('');
    toast.success('Nova meta de vida adicionada! Foco juntos! 🎯');
  };

  const handleProgressChange = (id: number, val: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, progress: val, completed: val === 100 } : g));
  };

  // 11. Capsule of Time (Select unlocked duration)
  const [capsules, setCapsules] = useState([
    { id: 1, title: 'Nossos planos de carreira', author: 'Emannuel', duration: '6 Meses', unlockDate: '2026-12-25', isLocked: true }
  ]);
  const [capsuleForm, setCapsuleForm] = useState({ title: '', quote: '', years: '1' });

  const handleLockCapsule = () => {
    if (!capsuleForm.title) return;
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + parseInt(capsuleForm.years) * 12);
    const newCap = {
      id: capsules.length + 1,
      title: capsuleForm.title,
      author: 'Emannuel',
      duration: `${capsuleForm.years} Ano(s)`,
      unlockDate: futureDate.toISOString().split('T')[0],
      isLocked: true
    };
    setCapsules([...capsules, newCap]);
    setCapsuleForm({ title: '', quote: '', years: '1' });
    toast.success('🔒 Sua Cápsula do Tempo acaba de ser selada criogenicamente no Reino!');
  };

  // 12. Mapped coordinates (Adventure logs)
  const [places, setPlaces] = useState([
    { id: 1, label: 'Primeiro Beijo 😘', coord: 'Cabine Traseira do Cinema', detail: 'Estávamos tímidos até que a luz diminuiu.' },
    { id: 2, label: 'Nosso Restaurante Preferido 🍕', coord: 'Pizzaria rústica com luz quente', detail: 'Onde pedimos borda recheada doce.' },
    { id: 3, label: 'Parque das Conversas longas 🌳', coord: 'Banco sob o salgueiro chorão', detail: 'Passamos quatro horas seguidas apenas rindo.' }
  ]);
  const [newPlace, setNewPlace] = useState({ label: '', coord: '', detail: '' });

  const handleAddPlace = () => {
    if (!newPlace.label || !newPlace.coord) return;
    setPlaces([...places, { id: places.length + 1, ...newPlace }]);
    setNewPlace({ label: '', coord: '', detail: '' });
    toast.success('Ponto turístico do nosso amor mapeado! 📍');
  };

  const handleCollectDailyBonus = async () => {
    await addHeartPoints(180);
    toast.success('Mimo cósmico resgatado! +180 Corações colocados no cofre! 💖✨');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-3xl p-2 md:p-4 font-sans text-[#4A3B3B]">
      
      {/* Dynamic Theme Banner status card */}
      <div className="relative bg-white border-[3px] border-[#4A3B3B] shadow-[6px_6px_0px_#4A3B3B] rounded-[32px] p-6 sm:p-8 overflow-hidden transition-all duration-350 bg-gradient-to-br from-[#FFF8F0] via-[#FFEADB] to-[#FFF3E3]">
        {/* Sparkly decorative floating icons */}
        <div className="absolute right-6 top-6 animate-pulse select-none text-2xl opacity-40">✨</div>
        <div className="absolute left-6 bottom-6 animate-spin select-none text-xl opacity-20" style={{ animationDuration: '8s' }}>🌹</div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-black text-[#FF7B89] block hover:scale-105 transition-transform">
              🏰 Portal Mágico Ativo
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-1 select-none">
              Nosso Reino Encantado
            </h1>
            <p className="font-serif italic text-sm md:text-base opacity-90 mt-1 max-w-lg">
              Um abrigo privado e interativo de amor, sintonias, metas e lembranças indestrutíveis.
            </p>
          </div>

          <button
            onClick={handleCollectDailyBonus}
            className="shrink-0 bg-stone-900 text-white hover:bg-[#FF7B89] font-sans text-[11px] font-black uppercase tracking-widest py-3 px-6 rounded-2xl border-2 border-black shadow-[4px_4px_0_#4A3B3B] transition-transform active:translate-y-1 active:shadow-none cursor-pointer flex items-center gap-2"
          >
            <Coins size={14} className="text-amber-300 animate-bounce" /> Coletar Love Coins (+180 💖)
          </button>
        </div>

        {/* Live dynamic couples clock widget */}
        <div className="mt-8 border-t-2 border-dashed border-[#4A3B3B]/10 pt-6">
          <div className="text-center bg-white/70 backdrop-blur-sm border-[3px] border-[#4A3B3B] p-5 rounded-2xl shadow-[4px_4px_0_#4A3B3B] max-w-xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7B89] block mb-2">💘 Nosso Tempo de União Eternizado</span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[
                { label: 'Anos', val: timeTogether.years },
                { label: 'Meses', val: timeTogether.months },
                { label: 'Dias', val: timeTogether.days },
                { label: 'Horas', val: timeTogether.hours },
                { label: 'Minutos', val: timeTogether.minutes },
                { label: 'Segundos', val: timeTogether.seconds }
              ].map((t, idx) => (
                <div key={idx} className="bg-white border-2 border-[#4A3B3B] p-2 rounded-xl text-center shadow-[2px_2px_0_#4A3B3B]">
                  <span className="block text-xl sm:text-2xl font-black font-mono tracking-tight leading-none text-[#FF7B89]">{t.val}</span>
                  <span className="block text-[8px] font-sans font-black uppercase tracking-widest text-stone-500 mt-1">{t.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] font-sans font-medium uppercase tracking-wider text-stone-500 mt-3 italic">
              Desde 12 de Outubro de 2024 às 19:00 — Nosso maior capítulo começou aqui.
            </p>
          </div>
        </div>
      </div>

      {/* INNER COHESIVE COUPLE SUBTAB DRAWER SELECTOR */}
      <div className="flex flex-wrap items-center gap-2 justify-center py-3 bg-[#fcf9f2] border-[3px] border-[#4A3B3B] rounded-[24px] px-3 shadow-[4px_4px_0px_0px_#4A3B3B]">
        {[
          { id: 'inicio', label: 'Início', emoji: '🏠' },
          { id: 'perfil', label: 'Estatísticas & Vibe', emoji: '👤' },
          { id: 'timeline', label: 'Jornada', emoji: '⏳' },
          { id: 'fotos', label: 'Álbum', emoji: '📸' },
          { id: 'cartas', label: 'Cartas', emoji: '💌' },
          { id: 'playlist', label: 'Sintonia', emoji: '🎵' },
          { id: 'calendario', label: 'Agenda', emoji: '📅' },
          { id: 'conquistas', label: 'Troféus', emoji: '🏆' },
          { id: 'jogos', label: 'Mini-Jogos', emoji: '🎮' },
          { id: 'metas', label: 'Nossas Metas', emoji: '🎯' },
          { id: 'capsula', label: 'Cápsula', emoji: '🔒' },
          { id: 'lugares', label: 'Mapa', emoji: '📍' }
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => {
              setActiveSubtab(sub.id as SubtabID);
            }}
            className={`px-3.5 py-2 border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[2px_2px_0_#000] cursor-pointer hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_#000] ${
              activeSubtab === sub.id 
                ? 'bg-[#FF7B89] text-white' 
                : 'bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>{sub.emoji}</span>
            <span>{sub.label}</span>
          </button>
        ))}
      </div>

      {/* ACTIVE SUBTAB PORTAL AREA */}
      <div className="mt-4 transition-all duration-350">
        <AnimatePresence mode="wait">
          
          {/* SUBTAB 1: INÍCIO / HUB */}
          {activeSubtab === 'inicio' && (
            <motion.div
              key="subtab_inicio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Quick statistics counter cards */}
              {[
                { label: 'Fotos Guardadas', val: photos.length, icon: ImageIcon, color: 'bg-purple-100', text: 'text-purple-900' },
                { label: 'Cartinhas Escritas', val: letters.length, icon: Mail, color: 'bg-amber-100', text: 'text-amber-900' },
                { label: 'Melodias Compartilhadas', val: playlist.length, icon: Music, color: 'bg-sky-100', text: 'text-sky-900' },
                { label: 'Conquistas Desbloqueadas', val: achievements.filter(a => a.unlocked).length, icon: Award, color: 'bg-emerald-100', text: 'text-emerald-950' },
                { label: 'Objetivos em Progresso', val: goals.filter(g => !g.completed).length, icon: Trophy, color: 'bg-indigo-100', text: 'text-indigo-950' },
                { label: 'Lugares Memorizados', val: places.length, icon: MapPin, color: 'bg-pink-100', text: 'text-pink-900' }
              ].map((ct, idx) => (
                <div key={idx} className={`border-2 border-[#4A3B3B] p-5 rounded-2xl bg-white shadow-[4px_4px_0_#4A3B3B] flex items-center justify-between`}>
                  <div className="space-y-1">
                    <span className="block text-2xl font-black text-[#4A3B3B]">{ct.val}</span>
                    <span className="block text-[8px] font-sans font-black uppercase tracking-wider text-stone-500">{ct.label}</span>
                  </div>
                  <div className={`w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center ${ct.color} ${ct.text}`}>
                    <ct.icon size={18} />
                  </div>
                </div>
              ))}

              {/* Live interactive Widget row: Today's music & Mini letter note */}
              <div className="md:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-600 border-3 border-[#4A3B3B] rounded-3xl p-6 text-white shadow-[6px_6px_0_#4A3B3B] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute right-[-15px] bottom-[-15px] select-none text-7xl opacity-10">📻</div>
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#FFF] block bg-white/20 px-3 py-1 rounded-full w-fit">
                    Estação de Rádio Sintonizada
                  </span>
                  <h3 className="text-2xl font-black text-white italic">&ldquo;Princesa, vamos jogar?&rdquo;</h3>
                  <p className="text-xs text-white/90 font-serif">Acesse o submenu de <span className="underline font-bold">Mini-Jogos</span> para treinar nossa sintonia no Quiz ou Jogo da Memória!</p>
                </div>
                <button
                  onClick={() => setActiveSubtab('jogos')}
                  className="bg-white text-emerald-950 font-sans text-[10px] font-black uppercase tracking-widest py-3.5 px-6 rounded-2xl border-2 border-black shadow-[3px_3px_0_#000] hover:translate-y-0.5 active:translate-y-1 cursor-pointer shrink-0"
                >
                  Abrir Arcade 🎮
                </button>
              </div>

              {/* Heart Points Wallet Widget */}
              <div className="bg-stone-900 border-3 border-[#4A3B3B] p-6 rounded-3xl text-white shadow-[6px_6px_0_#4A3B3B] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block mb-1">💖 Teu Cofre Real</span>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-mono font-black">{profile?.heartPoints ?? 200}</span>
                    <span className="text-xl">Love Coins 💖</span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2">Você ganha Love Coins e Mimos ao interagir, completar metas de casal ou jogar mini-jogos!</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBTAB 2: PERFIL DO CASAL */}
          {activeSubtab === 'perfil' && (
            <motion.div
              key="subtab_perfil"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_#4A3B3B] space-y-6"
            >
              <div className="flex justify-between items-center border-b-2 border-dashed border-[#4A3B3B]/10 pb-4">
                <div>
                  <h3 className="text-xl font-black">Nossa Identidade & Sintonia</h3>
                  <p className="text-stone-500 text-xs">Pequenos detalhes fofos sobre nós guardados em silício.</p>
                </div>
                <button
                  onClick={() => {
                    if (isEditingProfile) {
                      toast.success('Mimos de perfil gravados com carinho!');
                    }
                    setIsEditingProfile(!isEditingProfile);
                  }}
                  className="px-4 py-2 border-2 border-black text-[10px] font-black uppercase tracking-wider rounded-xl bg-amber-50 hover:bg-amber-100 shadow-[2px_2px_0_#000] active:translate-y-0.5 cursor-pointer"
                >
                  {isEditingProfile ? 'Salvar Alterações 💾' : 'Editar Fofuras 🖋️'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Side A: Nicknames & dates */}
                <div className="space-y-4 bg-amber-50/50 p-4 border-2 border-[#4A3B3B] rounded-2xl shadow-[2px_2px_0_#4A3B3B]">
                  <h4 className="text-xs font-black uppercase text-[#FF7B89] tracking-wider mb-2">Apelidos do Amor</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider opacity-60">Como ele a chama:</span>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={nicknames.her}
                          onChange={e => setNicknames({ ...nicknames, her: e.target.value })}
                          className="w-full bg-white border border-[#4A3B3B] px-3 py-1.5 rounded-xl text-xs font-bold"
                        />
                      ) : (
                        <span className="block text-sm font-black">{nicknames.her}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider opacity-60">Como ela o chama:</span>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={nicknames.him}
                          onChange={e => setNicknames({ ...nicknames, him: e.target.value })}
                          className="w-full bg-white border border-[#4A3B3B] px-3 py-1.5 rounded-xl text-xs font-bold"
                        />
                      ) : (
                        <span className="block text-sm font-black">{nicknames.him}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-dashed border-[#4A3B3B]/10 pt-4 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="opacity-60 uppercase font-black text-[9px]">Data de Início:</span>
                      <span className="font-bold">12 de Outubro de 2024</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="opacity-60 uppercase font-black text-[9px]">Enlace Oficial no Reino:</span>
                      <span className="font-bold text-teal-800 bg-teal-100 px-20 py-0.5 rounded-full text-[9px] font-black uppercase">Consagrado</span>
                    </div>
                  </div>
                </div>

                {/* Side B: Favorites selection */}
                <div className="space-y-4 bg-sky-50/50 p-4 border-2 border-[#4A3B3B] rounded-2xl shadow-[2px_2px_0_#4A3B3B]">
                  <h4 className="text-xs font-black uppercase text-sky-800 tracking-wider mb-2">Favoritos Oficiais do Casal</h4>

                  <div className="space-y-3">
                    {[
                      { label: 'Rolê / Prato do final de semana:', key: 'food', icon: '🍕' },
                      { label: 'Filme/Série mais amado:', key: 'movie', icon: '🏮' },
                      { label: 'Trilha sonora que embala:', key: 'song', icon: '🎵' },
                      { label: 'Destino dos nossos sonhos:', key: 'destination', icon: '✈|' }
                    ].map((fav, i) => (
                      <div key={i} className="flex justify-between items-center gap-4 text-xs">
                        <span className="opacity-60 text-[9px] uppercase font-black truncate">{fav.label}</span>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={(favorites as any)[fav.key]}
                            onChange={e => setFavorites({ ...favorites, [fav.key]: e.target.value })}
                            className="bg-white border border-[#4A3B3B] px-2.5 py-1 rounded text-xs font-medium w-1/2"
                          />
                        ) : (
                          <span className="font-black text-right truncate">{(favorites as any)[fav.key]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBTAB 3: JORNADA / TIMELINE */}
          {activeSubtab === 'timeline' && (
            <motion.div
              key="subtab_timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_#4A3B3B] space-y-6"
            >
              <div className="border-b-2 border-dashed border-[#4A3B3B]/10 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black">Nossa Estrada dos Sonhos</h3>
                  <p className="text-stone-500 text-xs">Adicione novos marcos fofos em nossa linha do tempo interativa.</p>
                </div>
              </div>

              {/* Add new milestone */}
              <div className="bg-stone-50 border-2 border-black rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black opacity-65">Data / Época</span>
                  <input
                    type="text"
                    placeholder="Ex: 25 Dez 2024"
                    value={newTimeline.date}
                    onChange={e => setNewTimeline({ ...newTimeline, date: e.target.value })}
                    className="w-full bg-white border border-black p-2 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-[10px] uppercase font-black opacity-65">Título da Memória</span>
                  <input
                    type="text"
                    placeholder="Ex: Primeira Pizza"
                    value={newTimeline.title}
                    onChange={e => setNewTimeline({ ...newTimeline, title: e.target.value })}
                    className="w-full bg-white border border-black p-2 rounded-xl text-xs font-bold"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newTimeline.date || !newTimeline.title) return;
                    setTimeline([...timeline, { year: '2025', desc: 'Gravado com carinho no mapa.', ...newTimeline }]);
                    setNewTimeline({ date: '', title: '', desc: '' });
                    toast.success('Marco histórico inserido! Estela cadente brilhando! ✨');
                  }}
                  className="bg-[#FF7B89] text-white font-sans text-[10px] font-black uppercase tracking-widest py-3 px-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]"
                >
                  Registrar Marco 💍
                </button>
              </div>

              {/* Vertical timeline line list */}
              <div className="relative pl-6 sm:pl-8 border-l-3 border-[#FF7B89] space-y-8 mt-6">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative group">
                    {/* Glowing outer circle node */}
                    <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-white border-3 border-[#FF7B89] flex items-center justify-center shadow-[2px_2px_0_#000] z-10 transition-transform group-hover:scale-125">
                      <Heart size={10} className="text-[#FF7B89] fill-[#FF7B89]" />
                    </div>

                    <div className="bg-stone-50/70 hover:bg-stone-50 border-2 border-[#4A3B3B] p-4 rounded-2xl shadow-[3px_3px_0_#4A3B3B] transition-transform hover:-translate-y-1">
                      <span className="px-2 py-0.5 bg-yellow-100 border border-[#4A3B3B] rounded-full text-[9px] font-black text-amber-900 uppercase">
                        {item.date}
                      </span>
                      <h4 className="text-base font-black mt-2">{item.title}</h4>
                      <p className="text-xs text-stone-600 font-serif italic mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SUBTAB 4: ÁLBUM DE FOTOS */}
          {activeSubtab === 'fotos' && (
            <motion.div
              key="subtab_fotos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_#4A3B3B] space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-dashed border-[#4A3B3B]/10 pb-4">
                <div>
                  <h3 className="text-xl font-black">Álbum Vivo Ilustrado</h3>
                  <p className="text-stone-500 text-xs">Cure e eternize fotos curtindo e comentando.</p>
                </div>

                <div className="flex gap-1.5">
                  {['Todas', 'Favoritas', 'Viagens', 'Momentos engraçados'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setPhotoFilter(tab as any)}
                      className={`px-3 py-1.5 border border-black rounded-lg text-[9px] font-black uppercase tracking-wider ${
                        photoFilter === tab ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Polaroid grid display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {photos
                  .filter(p => photoFilter === 'Todas' || p.category === photoFilter)
                  .map((photo) => (
                    <div key={photo.id} className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0_#000] flex flex-col justify-between">
                      <div className="w-full aspect-square border-2 border-black rounded-xl overflow-hidden bg-stone-100 relative group">
                        <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-black">{photo.category}</div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <h4 className="font-sans font-black text-xs uppercase text-[#4A3B3B] truncate">{photo.title}</h4>
                        <div className="flex items-center justify-between text-xs border-y border-stone-100 py-2">
                          <button
                            onClick={() => handleLikePhoto(photo.id)}
                            className="flex items-center gap-1.5 text-[#FF7B89] hover:scale-105 transition-transform"
                          >
                            <Heart size={14} className="fill-[#FF7B89]" /> <span>{photo.likes} Likes</span>
                          </button>
                          <span className="text-[9px] text-stone-400 font-bold uppercase">{photo.comments.length} Comentários</span>
                        </div>

                        {/* Visual commentary lists */}
                        <div className="bg-stone-50 rounded-xl p-2.5 space-y-2 max-h-[85px] overflow-y-auto text-left">
                          {photo.comments.map((cm, ci) => (
                            <p key={ci} className="text-[9px] text-stone-600 leading-normal border-b border-dashed border-stone-200/50 pb-1 italic">
                              🤝 "{cm}"
                            </p>
                          ))}
                        </div>

                        {/* Comment form */}
                        <div className="flex gap-1 pt-1">
                          <input
                            type="text"
                            placeholder="Adicione carinho..."
                            value={newCommentText[photo.id] || ''}
                            onChange={e => setNewCommentText({ ...newCommentText, [photo.id]: e.target.value })}
                            className="w-full bg-stone-50 border border-black/15 px-2 py-1 rounded text-[10px]"
                          />
                          <button
                            onClick={() => handleAddComment(photo.id)}
                            className="bg-stone-900 text-white border border-black px-2.5 text-[9px] font-black uppercase rounded"
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SUBTAB 5: CARTAS ROMÂNTICAS */}
          {activeSubtab === 'cartas' && (
            <motion.div
              key="subtab_cartas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_#4A3B3B] space-y-6"
            >
              <div className="border-b-2 border-dashed border-[#4A3B3B]/10 pb-4">
                <h3 className="text-xl font-black">Lâminas & Cartas Românticas 💌</h3>
                <p className="text-stone-500 text-xs">Mensagens lacradas e mensagens de carinho recém escritas.</p>
              </div>

              {/* Create new letter form section */}
              <div className="bg-amber-50/50 border-2 border-dashed border-amber-900/30 p-4 rounded-2xl flex flex-col gap-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <Mail size={14} className="animate-pulse" /> Lacrar Nova Cartinha Romântica
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Título da carta... (Ex: Meu Porto Seguro)"
                    value={newLetterForm.title}
                    onChange={e => setNewLetterForm({ ...newLetterForm, title: e.target.value })}
                    className="bg-white border border-[#4A3B3B] p-2.5 rounded-xl text-xs font-bold sm:col-span-2"
                  />
                  <select
                    value={newLetterForm.type}
                    onChange={e => setNewLetterForm({ ...newLetterForm, type: e.target.value })}
                    className="bg-white border border-[#4A3B3B] p-2.5 rounded-xl text-xs font-bold"
                  >
                    <option value="Romântica">Carta Romântica</option>
                    <option value="Surpresa">Carta de Surpresa</option>
                    <option value="Programada">Carta Programada (🔒 Trancada)</option>
                    <option value="Aniversário">Para meu Aniversário</option>
                  </select>
                </div>

                <textarea
                  placeholder="Escreva com toda a sua alma e sentimentos aqui. Este texto será guardado perfeitamente..."
                  value={newLetterForm.text}
                  onChange={e => setNewLetterForm({ ...newLetterForm, text: e.target.value })}
                  className="bg-white border border-[#4A3B3B] p-3 rounded-xl text-xs font-medium h-24"
                />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-amber-950">
                    <span className="opacity-70 text-[10px] uppercase font-bold">Bloqueio Provisório:</span>
                    <select
                      value={newLetterForm.lockType}
                      onChange={e => setNewLetterForm({ ...newLetterForm, lockType: e.target.value })}
                      className="bg-white/80 border border-[#4A3B3B] px-2 py-1 rounded text-[10px]"
                    >
                      <option value="none">Nenhum (Disponível agora ✨)</option>
                      <option value="locked">Até o Aniversário de Namoro 🔒</option>
                    </select>
                  </div>
                  <button
                    onClick={handleCreateLetter}
                    className="bg-[#FF7B89] hover:bg-rose-500 text-white px-5 py-3 border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_#000] cursor-pointer"
                  >
                    Lacrar Cartinha 💌
                  </button>
                </div>
              </div>

              {/* Envelope Display grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {letters.map((lett) => {
                  const isLocked = lett.status === 'locked';
                  return (
                    <div
                      key={lett.id}
                      onClick={() => {
                        if (isLocked) {
                          toast.error('Este envelope possui um selo cósmico e está trancado até a comemoração oficial! 🔒');
                        } else {
                          setSelectedLetter(lett);
                        }
                      }}
                      className={`p-4 border-2 border-black rounded-2xl flex items-center justify-between shadow-[3px_3px_0_#000] cursor-pointer transition-transform hover:-translate-y-1 ${
                        isLocked ? 'bg-stone-100 opacity-60' : 'bg-white hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="space-y-1.5 text-left max-w-[85%]">
                        <span className="text-[8px] bg-amber-100 border border-black/10 px-2 py-0.5 rounded-full uppercase font-black tracking-widest block w-fit text-amber-950">
                          {lett.type}
                        </span>
                        <h4 className="font-black text-xs text-[#4A3B3B] truncate">{lett.title}</h4>
                        <p className="text-[9px] text-[#FF7B89] font-black">{lett.date}</p>
                      </div>
                      <div className="text-xl">
                        {isLocked ? <Lock size={16} className="text-[#FF7B89]" /> : '✉️'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Envelope Detail Drawer Layer */}
              {selectedLetter && (
                <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#FFFDF9] border-[4px] border-black p-6 sm:p-8 rounded-[32px] max-w-lg w-full text-center shadow-[8px_8px_0_#000] space-y-6 animate-in zoom-in-95 duration-230 relative overflow-hidden">
                    <div className="absolute right-[-15px] top-[-15px] opacity-10 rotate-12 select-none text-9xl">💌</div>
                    
                    <div className="space-y-2 relative z-10 text-left">
                      <span className="text-[9px] bg-red-100 border border-[#E84E4E]/30 text-[#E84E4E] px-3 py-1 rounded-full uppercase font-black w-fit block">
                        💌 Envelope Romântico Aberto
                      </span>
                      <h3 className="text-2xl font-black text-[#4A3B3B]">{selectedLetter.title}</h3>
                      <p className="text-[10px] text-stone-400 uppercase font-black">Escrito por {selectedLetter.author} — {selectedLetter.date}</p>
                    </div>

                    <div className="bg-stone-50 text-stone-800 p-5 rounded-2xl border-2 border-dashed border-[#4A3B3B]/10 max-h-[190px] overflow-y-auto text-justify font-serif italic text-sm leading-relaxed">
                      &ldquo;{selectedLetter.text}&rdquo;
                    </div>

                    <button
                      onClick={() => setSelectedLetter(null)}
                      className="w-full bg-stone-900 text-white hover:bg-[#FF7B89] py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 border-black"
                    >
                      Fechar Envelope 🤍
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SUBTAB 6: PLAYLIST */}
          {activeSubtab === 'playlist' && (
            <motion.div
              key="subtab_playlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_#4A3B3B] space-y-6"
            >
              <div className="border-b-2 border-dashed border-[#4A3B3B]/10 pb-4">
                <h3 className="text-xl font-black">Nossa Rádio de Sintonia 🎵</h3>
                <p className="text-stone-500 text-xs">Músicas oficiais que sintonizam nossos sentimentos mais puros.</p>
              </div>

              {/* Add sound form */}
              <div className="bg-stone-50 border-2 border-black rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black opacity-65">Nome do Som</span>
                  <input
                    type="text"
                    value={newSongForm.song}
                    onChange={e => setNewSongForm({ ...newSongForm, song: e.target.value })}
                    className="w-full bg-white border border-black p-2 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black opacity-65">Artista / Cantor</span>
                  <input
                    type="text"
                    value={newSongForm.artist}
                    onChange={e => setNewSongForm({ ...newSongForm, artist: e.target.value })}
                    className="w-full bg-white border border-black p-2 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black opacity-65">Trecho Favorito</span>
                  <input
                    type="text"
                    placeholder="Ex: I'm dancing in the dark..."
                    value={newSongForm.lyric}
                    onChange={e => setNewSongForm({ ...newSongForm, lyric: e.target.value })}
                    className="w-full bg-white border border-black p-2 rounded-xl text-xs font-bold"
                  />
                </div>
                <button
                  onClick={handleAddSong}
                  className="bg-stone-900 hover:bg-[#FF7B89] text-white font-sans text-[10px] font-black uppercase tracking-widest py-3 px-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000] cursor-pointer"
                >
                  Adicionar à Playlist
                </button>
              </div>

              <div className="space-y-4 pt-2">
                {playlist.map((track) => (
                  <div
                    key={track.id}
                    className="p-4 border-2 border-black rounded-2xl bg-stone-50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[2px_2px_0_#000] text-left hover:bg-pink-50/50 transition-colors"
                  >
                    <div className="flex gap-4 items-center flex-1">
                      <div className="w-12 h-12 rounded-full border-2 border-black bg-stone-900 flex items-center justify-center text-white text-lg animate-spin" style={{ animationDuration: '6s' }}>
                        💿
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] bg-amber-100 border border-black/10 text-amber-950 px-2 py-0.5 rounded uppercase font-black w-fit block">
                          {track.category}
                        </span>
                        <h4 className="font-black text-sm text-[#4A3B3B] leading-none">{track.song}</h4>
                        <p className="text-xs text-stone-400 font-bold">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex-1 text-sm bg-white border border-stone-100 p-2.5 rounded-xl font-serif italic text-justify text-stone-600">
                      {track.lyric}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SUBTAB 7: CALENDÁRIO */}
          {activeSubtab === 'calendario' && (
            <motion.div
              key="subtab_calendario"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_#4A3B3B] space-y-6"
            >
              <div className="border-b-2 border-dashed border-[#4A3B3B]/10 pb-4">
                <h3 className="text-xl font-black">Agenda do Casal 📅</h3>
                <p className="text-stone-500 text-xs">Acompanhe contagens regressivas cruciais de aniversários e viagens.</p>
              </div>

              {/* Add event */}
              <div className="bg-stone-50 border-2 border-black rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black opacity-65">Título do Encontro/Meta</span>
                  <input
                    type="text"
                    placeholder="Ex: Jantar de Bodas"
                    value={newEventDate.title}
                    onChange={e => setNewEventDate({ ...newEventDate, title: e.target.value })}
                    className="w-full bg-white border border-black p-2 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black opacity-65">Data Selecionada</span>
                  <input
                    type="date"
                    value={newEventDate.date}
                    onChange={e => setNewEventDate({ ...newEventDate, date: e.target.value })}
                    className="w-full bg-white border border-black p-2 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black opacity-65">Ícone Emoji</span>
                  <select
                    value={newEventDate.emoji}
                    onChange={e => setNewEventDate({ ...newEventDate, emoji: e.target.value })}
                    className="w-full bg-white border border-black p-2 rounded-xl text-xs font-bold"
                  >
                    <option value="💝">💝 Coração</option>
                    <option value="✈️">✈️ Avião</option>
                    <option value="🍿">🍿 Cinema</option>
                    <option value="🎉">🎉 Festa</option>
                    <option value="🍕">🍕 Pizza</option>
                  </select>
                </div>
                <button
                  onClick={handleAddEvent}
                  className="bg-stone-900 text-white font-sans text-[10px] font-black uppercase tracking-widest py-3 px-4 border-2 border-black rounded-xl shadow-[2px_2px_0_#000] cursor-pointer"
                >
                  Agendar Evento
                </button>
              </div>

              {/* Event array */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {events.map((evt) => {
                  const evDate = new Date(evt.date);
                  const today = new Date();
                  const timeDiff = evDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                  return (
                    <div key={evt.id} className="p-4 border-2 border-black rounded-2xl bg-stone-50 flex flex-col justify-between shadow-[2px_2px_0_#000]">
                      <div className="flex gap-2.5 items-center">
                        <span className="text-3xl filter drop-shadow-[1.5px_1.5px_0_rgba(0,0,0,0.15)]">{evt.emoji}</span>
                        <div className="text-left">
                          <span className="text-[8px] bg-pink-100 border border-[#FF7B89]/20 text-[#FF7B89] px-2 py-0.5 rounded font-black uppercase inline-block">
                            {evt.type}
                          </span>
                          <h4 className="font-black text-xs block leading-tight mt-1">{evt.title}</h4>
                        </div>
                      </div>

                      <div className="border-t border-dashed border-[#4A3B3B]/10 mt-4 pt-3 flex justify-between items-center bg-white border border-black/5 rounded-xl p-2">
                        <span className="text-[10px] text-stone-400 font-bold uppercase">{evt.date}</span>
                        <span className="font-mono text-[10px] font-black uppercase tracking-tight text-teal-850">
                          {diffDays > 0 ? `Faltam ${diffDays} dias ⏳` : 'Comemorado! 🎉'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SUBTAB 8: CONQUISTAS COMINAS STYLE */}
          {activeSubtab === 'conquistas' && (
            <motion.div
              key="subtab_conquistas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_#4A3B3B] space-y-6"
            >
              <div className="border-b-2 border-dashed border-[#4A3B3B]/10 pb-4">
                <h3 className="text-xl font-black">Medalhas de Conquista Estilo Steam 🏆</h3>
                <p className="text-stone-500 text-xs">Suas ações diárias no portal liberam medalhas que fornecem Love Coins!</p>
              </div>

              <div className="space-y-4">
                {achievements.map((ac) => (
                  <div
                    key={ac.id}
                    className={`p-4 border-2 border-black rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[2px_2px_0_#000] text-left transition-all ${
                      ac.unlocked ? 'bg-amber-50/20' : 'bg-stone-50/50 opacity-60'
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-xl shadow-[2px_2px_0_#000] ${
                        ac.unlocked ? 'bg-yellow-100' : 'bg-stone-200'
                      }`}>
                        {ac.unlocked ? '🏆' : '🔒'}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-[#4A3B3B]">{ac.title}</h4>
                        <p className="text-xs text-stone-400 font-medium">{ac.desc}</p>
                      </div>
                    </div>

                    <div className="bg-white border border-stone-200 p-2.5 rounded-xl text-center shadow-inner shrink-0 leading-none">
                      <span className="text-[8px] font-black uppercase text-stone-400 block mb-1">Recompensa</span>
                      <span className="font-mono font-black text-sm text-[#FF7B89]">{ac.reward} 💖</span>
                      
                      {ac.unlocked ? (
                        ac.claimed ? (
                          <span className="block text-[8px] text-green-800 bg-green-100 border border-green-300 px-1.5 py-0.5 rounded font-black mt-2">REIVINDICADO</span>
                        ) : (
                          <button
                            onClick={() => handleClaimAchievementReward(ac.id, ac.reward)}
                            className="block bg-yellow-400 hover:bg-yellow-300 text-stone-950 font-black text-[8px] uppercase tracking-wider py-1.5 px-2 border border-black rounded mt-1.5"
                          >
                            Resgatar Mimo
                          </button>
                        )
                      ) : (
                        <span className="block text-[8px] text-stone-400 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded font-black mt-2">BLOQUEADO</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SUBTAB 9: JOGOS DO AMOR (QUIZ & MEMORY GAME) */}
          {activeSubtab === 'jogos' && (
            <motion.div
              key="subtab_jogos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Game A: Sintonia Quiz block */}
              <div className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 shadow-[6px_6px_0_#4A3B3B] space-y-4">
                <div className="border-b-2 border-dashed border-[#4A3B3B]/10 pb-4">
                  <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-1.5">
                    <Gamepad2 className="text-[#FF7B89] animate-spin" size={16} style={{ animationDuration: '6s' }} /> 1. Nosso Sintonia Quiz
                  </h3>
                  <p className="text-stone-500 text-[10px]">Descubra quem conhece mais o outro!</p>
                </div>

                {!quizFinished ? (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border-2 border-[#4A3B3B] p-4 rounded-xl text-left">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7B89] block mb-1">
                        Pergunta {currentQuizQ + 1} de {quizQuestions.length}
                      </span>
                      <h4 className="text-sm font-black text-stone-850 leading-relaxed">
                        {quizQuestions[currentQuizQ].q}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {quizQuestions[currentQuizQ].options.map((opt, oidx) => (
                        <button
                          key={oidx}
                          onClick={() => handleQuizAnswer(oidx)}
                          className="w-full text-left p-3.5 border-2 border-black rounded-xl text-xs font-bold bg-white hover:bg-[#FF7B89] hover:text-white transition-colors"
                        >
                          {oidx + 1}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-500/30 space-y-4">
                    <span className="text-5xl">🏆</span>
                    <h4 className="text-base font-black">Sintonia do Quiz Concluída!</h4>
                    <p className="font-mono text-sm font-black">Seu Placar de Sintonia: {quizScore} / {quizQuestions.length}</p>
                    <p className="text-xs text-stone-500 italic max-w-sm mx-auto">Se você acertou tudo, corre na aba de troféus para ver sua medalha de sintonia! 🎉</p>
                    <button
                      onClick={restartQuiz}
                      className="bg-stone-900 text-white font-sans text-[10px] font-black uppercase tracking-widest py-2.5 px-4 rounded-xl border"
                    >
                      Jogar Novamente
                    </button>
                  </div>
                )}
              </div>

              {/* Game B: Memória de Copas */}
              <div className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 shadow-[6px_6px_0_#4A3B3B] space-y-4">
                <div className="border-b-2 border-dashed border-[#4A3B3B]/10 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-1.5">
                      💍 2. Jogo das Recordações
                    </h3>
                    <p className="text-stone-500 text-[10px]">Ordene os sentimentos combinando emojis.</p>
                  </div>
                  <button
                    onClick={initMemoryGame}
                    className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-amber-100 hover:bg-amber-200 border border-black rounded"
                  >
                    Resetar
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2.5 select-none">
                  {memoryCards.map((card, cidx) => {
                    const isFlipped = selectedCards.includes(cidx) || matchedCards.includes(cidx);
                    return (
                      <div
                        key={cidx}
                        onClick={() => handleCardClick(cidx)}
                        className={`aspect-square border-2 border-black rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all ${
                          isFlipped ? 'bg-pink-100 shadow-none' : 'bg-stone-900 hover:bg-[#FF7B89]'
                        }`}
                      >
                        {isFlipped ? card.icon : '❓'}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 text-center text-[10px] uppercase font-black tracking-wider text-stone-400">
                  Jogadas Realizadas: {memoryMoves} — Combinadas: {matchedCards.length / 2} de {memoryIcons.length}
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBTAB 10: METAS COMPARTILHADAS */}
          {activeSubtab === 'metas' && (
            <motion.div
              key="subtab_metas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_#4A3B3B] space-y-6"
            >
              <div className="border-b-2 border-dashed border-[#4A3B3B]/10 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black">Nossos Projetos de Vida Juntos 🎯</h3>
                  <p className="text-stone-500 text-xs">Mensure o progresso e adicione marcos do futuro.</p>
                </div>
              </div>

              {/* Add meta text */}
              <div className="bg-stone-50 border-2 border-black p-4 rounded-xl flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Juntar dinheiro para o noivado"
                  value={newGoalTitle}
                  onChange={e => setNewGoalTitle(e.target.value)}
                  className="bg-white border border-black p-2.5 rounded-xl text-xs font-bold w-full"
                />
                <button
                  onClick={handleAddGoal}
                  className="bg-[#FF7B89] text-white font-sans text-[10px] font-black uppercase py-3.5 px-6 border-2 border-black rounded-xl"
                >
                  Registrar
                </button>
              </div>

              {/* Goal bars list */}
              <div className="space-y-6 pt-2">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-4 border-2 border-black rounded-2xl bg-stone-50 text-left space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-sky-100 border border-black/10 text-sky-950 px-20 py-0.5 rounded font-black uppercase text-[8px]">
                        {goal.category}
                      </span>
                      <span className="font-mono text-[10px] font-black text-[#FF7B89]">{goal.progress}% Concluído</span>
                    </div>

                    <h4 className="font-black text-sm text-[#4A3B3B]">{goal.title}</h4>

                    <div className="w-full bg-stone-200 rounded-full h-3.5 relative overflow-hidden border border-black/20">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full transition-all duration-350"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>

                    {/* Interactive slider */}
                    <div className="flex items-center gap-2 pt-2 text-[10px]">
                      <span className="text-stone-400">Ajustar Progresso:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={e => handleProgressChange(goal.id, parseInt(e.target.value))}
                        className="w-1/3 accent-[#FF7B89]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SUBTAB 11: TIME CAPSULE vault */}
          {activeSubtab === 'capsula' && (
            <motion.div
              key="subtab_capsula"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_#4A3B3B] space-y-6"
            >
              <div className="border-b-2 border-dashed border-[#4A3B3B]/10 pb-4">
                <h3 className="text-xl font-black">Cápsula Criogênica do Amor 🔒</h3>
                <p className="text-stone-500 text-xs">Mensagens guardadas no vácuo do tempo, bloqueadas até datas selecionadas.</p>
              </div>

              <div className="bg-[#1C1625] text-[#D6C5E3] p-5 rounded-2xl border-2 border-[#D6C5E3]/20 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <h4 className="font-sans font-black text-sm uppercase text-amber-300">Criar Nova Cápsula Selada</h4>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Identificação da Cápsula..."
                      value={capsuleForm.title}
                      onChange={e => setCapsuleForm({ ...capsuleForm, title: e.target.value })}
                      className="w-full bg-[#2A2335] text-white border border-[#D6C5E3]/20 p-2.5 rounded-xl text-xs"
                    />

                    <textarea
                      placeholder="Digite mensagens secretas, planos profissionais ou cartas para o aniversário..."
                      value={capsuleForm.quote}
                      onChange={e => setCapsuleForm({ ...capsuleForm, quote: e.target.value })}
                      className="w-full bg-[#2A2335] text-white border border-[#D6C5E3]/20 p-2.5 rounded-xl text-xs h-20"
                    />

                    <div className="flex justify-between items-center gap-4 text-xs">
                      <span>Período de Bloqueio:</span>
                      <select
                        value={capsuleForm.years}
                        onChange={e => setCapsuleForm({ ...capsuleForm, years: e.target.value })}
                        className="bg-[#2A2335] text-white border p-1 rounded"
                      >
                        <option value="1">1 Ano (🔒 Bloqueio Médio)</option>
                        <option value="5">5 Anos (🔒 Bloqueio Extremo)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleLockCapsule}
                      className="w-full bg-[#A855F7] text-white hover:bg-purple-600 border border-black p-2 rounded-xl text-xs font-black uppercase tracking-widest transition-transform hover:scale-105"
                    >
                      Salar e Selar Cápsula 🔒
                    </button>
                  </div>
                </div>

                <div className="bg-[#2D233A] p-4 border border-[#A855F7]/30 rounded-xl space-y-4 text-left">
                  <span className="text-[10px] font-black uppercase text-amber-300 block">Cápsulas Trancadas no Vácuo:</span>
                  {capsules.map((cap) => (
                    <div key={cap.id} className="p-3 border border-stone-800 rounded bg-[#1C1625]/80 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-xs text-white leading-none">{cap.title}</h4>
                        <span className="text-[8px] text-[#A855F7] font-black uppercase mt-1 block">Até: {cap.unlockDate}</span>
                      </div>
                      <Lock size={14} className="text-[#A855F7] animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBTAB 12: MAPA DE LUGARES */}
          {activeSubtab === 'lugares' && (
            <motion.div
              key="subtab_lugares"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-3 border-[#4A3B3B] rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_#4A3B3B] space-y-6"
            >
              <div className="border-b-2 border-dashed border-[#4A3B3B]/10 pb-4">
                <h3 className="text-xl font-black">Nosso Mapa de Coordenadas Românticas 📍</h3>
                <p className="text-stone-500 text-xs">Pontos turísticos, restaurantes e cantos marcantes que nos abrigaram.</p>
              </div>

              {/* Add custom pointer */}
              <div className="bg-stone-50 border-2 border-black p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] uppercase font-black opacity-65">Nome do Ponto</span>
                  <input
                    type="text"
                    placeholder="Ex: Primeira Pizza de Chocolate"
                    value={newPlace.label}
                    onChange={e => setNewPlace({ ...newPlace, label: e.target.value })}
                    className="w-full bg-white border border-black p-2 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[10px] uppercase font-black opacity-65">Endereço/Coordenada</span>
                  <input
                    type="text"
                    placeholder="Ex: Cabine do Cinema"
                    value={newPlace.coord}
                    onChange={e => setNewPlace({ ...newPlace, coord: e.target.value })}
                    className="w-full bg-white border border-black p-2 rounded-xl text-xs font-bold"
                  />
                </div>
                <button
                  onClick={handleAddPlace}
                  className="bg-stone-900 text-white font-sans text-[10px] font-black uppercase py-3 border-2 border-black rounded-xl"
                >
                  Registrar Coordenada
                </button>
              </div>

              <div className="space-y-4">
                {places.map((pl) => (
                  <div key={pl.id} className="p-4 border-2 border-black rounded-2xl bg-[#FFFFFA] flex gap-4 text-left shadow-[2px_2px_0_#000]">
                    <div className="w-10 h-10 rounded-full border-2 border-black bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#4A3B3B]">{pl.label}</h4>
                      <p className="text-[10px] text-stone-400 font-bold uppercase mt-0.5">{pl.coord}</p>
                      {pl.detail && <p className="text-xs text-stone-600 mt-2 font-serif italic">"{pl.detail}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
