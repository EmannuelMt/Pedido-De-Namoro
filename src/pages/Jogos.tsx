import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Heart, 
  Trophy, 
  Coins, 
  Star, 
  User, 
  Image as ImageIcon, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Shuffle, 
  CheckCircle, 
  Circle, 
  Play, 
  Flame, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Smile, 
  Eye, 
  RefreshCw, 
  Award, 
  Share2, 
  Grid, 
  Dices,
  Brain,
  UserCheck,
  ChevronRight,
  Sparkle,
  Zap,
  Bookmark,
  Check
} from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useNotificationsStore } from '../store/notifications';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';

// Static assets/fallbacks
const FALLBACK_COUPLE_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop', title: 'Piquenique Romântico', date: 'Jul 2024' },
  { url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop', title: 'Abraço de Inverno', date: 'Dez 2024' },
  { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop', title: 'Caminhada de Mãos Dadas', date: 'Set 2024' },
  { url: 'https://images.unsplash.com/photo-1494972308805-463bc619b34e?q=80&w=800&auto=format&fit=crop', title: 'Jantar à Luz de Velas', date: 'Out 2024' },
  { url: 'https://images.unsplash.com/photo-1531747118685-ca3fa6e22f30?q=80&w=800&auto=format&fit=crop', title: 'Olhar do Primeiro Encontro', date: 'Jan 2024' },
  { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop', title: 'Nosso Casamento dos Sonhos', date: 'Mai 2025' }
];

// Quiz database (Default list)
const COUPLE_QUIZ_QUESTIONS = [
  { question: "Qual foi o nosso primeiro filme assistido juntos?", options: ["Como eu era antes de você", "A Culpa é das Estrelas", "Amor e Outras Drogas", "Questão de Tempo"], answer: 3, explanation: "Assistimos na sala aconchegante enrolados sob o edredom!" },
  { question: "Onde foi o nosso primeiro beijo?", options: ["No parque sob as árvores", "No cinema na última fileira", "Na festa de aniversário", "Na porta da sua casa"], answer: 0, explanation: "Foi debaixo daquela copa enorme de árvore, inesquecível!" },
  { question: "Quem tomou a iniciativa de dizer 'eu te amo' primeiro?", options: ["Nós dois dissemos juntos", "Eu, claro!", "Você, romântico assumido!", "Nenhum de nós dois sabe dizer ao certo"], answer: 1, explanation: "A coragem bateu no peito e a frase escapou do coração primeiro!" },
  { question: "Qual é a comida favorita para os nossos dias de chuva?", options: ["Pizza Margherita bem queijuda", "Fondue de Chocolate com frutas", "Sopa e torradas caseiras", "Hambúrguer com batata frita"], answer: 0, explanation: "Nossos domingos chuvosos pedem aquela pizza quentinha!" },
  { question: "Qual a nossa viagem dos sonhos já planejada?", options: ["Chalé nas montanhas frias", "Praia paradisíaca no Nordeste", "Aurora Boreal na Finlândia", "Cafés românticos em Paris"], answer: 2, explanation: "Nosso sonho é observar as luzes do norte sob o céu invernal!" },
  { question: "Qual o presente físico mais inusitado que já trocamos?", options: ["A foto polaroid em miniatura", "A cartinha de 5 metros dobrada", "O chaveiro combinando de coração", "A pelúcia falante super fofa"], answer: 1, explanation: "Aquela carta imensa precisou de um belo rolo de papel de presente!" },
  { question: "Quem é a pessoa mais propensa a dormir durante o filme?", options: ["Ambos de mãos dadas em 5 minutos", "Eu", "Você", "Nenhum, assistimos até os créditos"], answer: 2, explanation: "Mais de 15 minutos de diálogo lento e o soninho bate forte!" },
  { question: "Que música nos define quando cantamos juntos no carro?", options: ["Nossa música especial acústica", "Aquele rock antigo animado", "Música romântica clichê dos anos 80", "Pagode retrô super contagiante"], answer: 0, explanation: "Quando toca a nossa canção, o rádio ganha um coral apaixonado!" },
  { question: "Quem responde as mensagens mais rápido?", options: ["Eu, celular sempre na mão", "Você, super atento", "Nós dois demoramos horas", "Depende muito de quem manda primeiro"], answer: 0, explanation: "Rápido como um raio, a notificação mal surge e já está respondido!" },
  { question: "Onde nos conhecemos pela primeira vez?", options: ["No trabalho/estúdio", "Na faculdade/escola", "Pelas redes sociais", "Através de amigos em comum"], answer: 2, explanation: "Uma curtida despretensiosa que se transformou no maior amor do mundo!" }
];

// Verdade ou Desafio decks
const TRUTH_OR_DARE_DECK = [
  { type: 'truth', category: 'romantico', text: "Se você pudesse reviver um único dia do nosso relacionamento, qual seria?" },
  { type: 'truth', category: 'romantico', text: "Qual foi o primeiro pensamento que você teve ao me ver pela primeira vez?" },
  { type: 'truth', category: 'casal', text: "Qual é a minha pequena mania diária que você secretamente mais adora?" },
  { type: 'truth', category: 'divertido', text: "Qual fantasia ou drama engraçado você já imaginou para o nosso futuro?" },
  { type: 'truth', category: 'aleatorio', text: "Se fossemos uma comida de casal, que prato nós seríamos e por quê?" },
  { type: 'truth', category: 'romantico', text: "Qual é o seu maior sonho para a nossa vida juntos nos próximos 5 anos?" },
  { type: 'truth', category: 'casal', text: "Qual apelido carinhoso nosso mais te faz sorrir internamente?" },
  
  { type: 'dare', category: 'romantico', text: "Dê um beijo demorado de 10 segundos na testa do seu amor e diga algo sincero." },
  { type: 'dare', category: 'divertido', text: "Imite o seu parceiro em uma situação de ciúmes bobo ou quando está com muita fome." },
  { type: 'dare', category: 'casal', text: "Faça uma massagem relaxante de 2 minutos nos ombros do seu amor agora mesmo." },
  { type: 'dare', category: 'aleatorio', text: "Envie um áudio de 15 segundos cantando um trecho da nossa canção favorita." },
  { type: 'dare', category: 'divertido', text: "Faça uma dança romântica dramática sem música por 30 segundos segurando a mão dele(a)." },
  { type: 'dare', category: 'casal', text: "Olhe fixamente nos olhos do seu parceiro por 15 segundos sem rir, e depois dê um selinho." }
];

// Default Achievements
const ALL_ACHIEVEMENTS = [
  { id: 'first_win', name: 'Primeira Vitória', description: 'Complete um minijogo pela primeira vez.', icon: '🏆', reward: 50 },
  { id: 'quiz_master', name: 'Mestre do Quiz', description: 'Acerte pelo menos 80% das perguntas no Quiz do Casal.', icon: '🧠', reward: 100 },
  { id: 'memory_pro', name: 'Cérebro de Elefante', description: 'Complete o Jogo de Memória em menos de 15 jogadas.', icon: '🃏', reward: 120 },
  { id: 'snake_fan', name: 'Alimentando o Amor', description: 'Consiga mais de 10 corações na Serpente do Amor.', icon: '🐍', reward: 150 },
  { id: 'puzzle_builder', name: 'Mestre Construtor', description: 'Consiga completar o Quebra-Cabeça de Fotos com sucesso.', icon: '🧩', reward: 200 },
  { id: 'perfect_couple', name: 'Casal Perfeito', description: 'Complete 3 Desafios Diários para consolidar a união.', icon: '❤️', reward: 250 }
];

export function Jogos() {
  const { user, profile, addHeartPoints } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'casal' | 'arcade' | 'memories' | 'achievements'>('all');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [userPlays, setUserPlays] = useState<number>(0);
  
  // Game states storage
  const [gameStats, setGameStats] = useState({
    quizPlayed: 0,
    gamesWon: 0,
    dailyCompletedCount: 0
  });

  // Daily challanges definitions (changes based on dates or simple state storage)
  const [dailyChallenges, setDailyChallenges] = useState<any[]>([
    { id: 'c1', title: 'Elogio Sincero', description: 'Mande um elogio super carinhoso citando algo único de hoje.', reward: 30, completed: false },
    { id: 'c2', title: 'Compartilhe uma Memória', description: 'Envie uma foto de um momento especial de vocês no WhatsApp ou poste na galeria.', reward: 40, completed: false },
    { id: 'c3', title: 'Sintonize a nossa canção', description: 'Escute a música tema de vocês de olhos fechados lembrando do primeiro dia.', reward: 50, completed: false }
  ]);

  // Load from database if connected
  useEffect(() => {
    fetchScoresAndAchievements();
    loadLocalProgress();
  }, [user]);

  const loadLocalProgress = () => {
    const saved = localStorage.getItem('jogos_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGameStats(parsed.stats || { quizPlayed: 0, gamesWon: 0, dailyCompletedCount: 0 });
        if (parsed.dailyChallenges) {
          setDailyChallenges(parsed.dailyChallenges);
        }
        if (!user && parsed.unlockedAchievements) {
          setUnlockedAchievements(parsed.unlockedAchievements);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const saveLocalProgress = (newStats: any, newDailies = dailyChallenges, newUnlocks = unlockedAchievements) => {
    localStorage.setItem('jogos_progress', JSON.stringify({
      stats: newStats,
      dailyChallenges: newDailies,
      unlockedAchievements: newUnlocks
    }));
  };

  const fetchScoresAndAchievements = async () => {
    if (!user) return;
    try {
      // Fetch leaderboard/scores
      // Temporarily removing orderBy for troubleshooting permission errors
      const qScores = query(collection(db, 'game_scores'), limit(15));
      const snapScores = await getDocs(qScores);
      const scoresList = snapScores.docs.map(d => ({ id: d.id, ...d.data() }));
      setLeaderboard(scoresList);

      // Fetch unlocked achievements
      const qAch = query(collection(db, 'user_achievements'));
      const snapAch = await getDocs(qAch);
      const achs = snapAch.docs
        .filter(d => d.data().userId === user.uid)
        .map(d => d.data().achievementId);
      setUnlockedAchievements(achs);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'game_scores/achievements');
    }
  };

  // Helper trigger score registration
  const recordScore = async (gameId: string, score: number) => {
    const userName = profile?.displayName || user?.displayName || user?.email || 'Nossos Corações';
    const finalScore = Math.round(score);

    // Save locally
    const statsUpdated = {
      ...gameStats,
      gamesWon: gameStats.gamesWon + 1
    };
    setGameStats(statsUpdated);
    saveLocalProgress(statsUpdated);

    if (user) {
      try {
        await addDoc(collection(db, 'game_scores'), {
          userId: user.uid,
          userName: userName,
          gameId: gameId,
          score: finalScore,
          createdAt: serverTimestamp()
        });
        fetchScoresAndAchievements();
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'game_scores');
      }
    }
  };

  // Trigger achievement unlock
  const unlockAchievement = async (achievementId: string) => {
    const achObj = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achObj) return;

    if (unlockedAchievements.includes(achievementId)) return;

    // Award Love Coins (heartPoints)
    await addHeartPoints(achObj.reward);
    toast.success(`Conquista Desbloqueada! +${achObj.reward} Love Coins!`, {
      icon: '🎉',
      duration: 5000
    });

    const updatedUnlocks = [...unlockedAchievements, achievementId];
    setUnlockedAchievements(updatedUnlocks);
    saveLocalProgress(gameStats, dailyChallenges, updatedUnlocks);

    if (user) {
      try {
        await addDoc(collection(db, 'user_achievements'), {
          userId: user.uid,
          achievementId: achievementId,
          unlockedAt: serverTimestamp()
        });

        // Trigger real-time achievement notification
        useNotificationsStore.getState().addNotification(
          `🏆 Conquista: ${achObj.name}`,
          `Você acaba de desbloquear: "${achObj.description}"! +${achObj.reward} Love Coins adicionadas.`,
          'high',
          'achievement',
          'trophy'
        );
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, 'user_achievements');
      }
    }

    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
  };

  const handleCompleteDaily = (id: string, reward: number) => {
    const updated = dailyChallenges.map(challenge => {
      if (challenge.id === id) {
        if (!challenge.completed) {
          addHeartPoints(reward);
          toast.success(`Desafio Diário Concluído! Copiou +${reward} Love Coins!`, {
            icon: '❤️'
          });
          
          const newCompletedCount = gameStats.dailyCompletedCount + 1;
          const updatedStats = { ...gameStats, dailyCompletedCount: newCompletedCount };
          setGameStats(updatedStats);
          
          setTimeout(() => {
            if (newCompletedCount >= 3) {
              unlockAchievement('perfect_couple');
            }
          }, 600);

          return { ...challenge, completed: true };
        }
      }
      return challenge;
    });

    setDailyChallenges(updated);
    saveLocalProgress(gameStats, updated);
  };

  // List of all games with category matching
  const ALL_GAMES = [
    { id: 'quiz', name: 'Quiz do Casal', description: 'Teste seus conhecimentos sobre o namoro, história e preferências dele(a).', category: 'casal', thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop', emoji: '❤️' },
    { id: 'truth_dare', name: 'Verdade ou Desafio', description: 'Sorteie verdades picantes, românticas ou desafios divertidos para apimentar a relação.', category: 'casal', thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop', emoji: '🎲' },
    { id: 'compatibility', name: 'Compatibilidade de Almas', description: 'Veja a afinidade do casal através do algoritmo milenar astrológico.', category: 'casal', thumbnail: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop', emoji: '🌟' },
    { id: 'guess_photo', name: 'Adivinhe a Foto', description: 'Adivinhe qual momento especial de vocês está escondido por trás do forte desfoque!', category: 'memories', thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop', emoji: '📸' },
    { id: 'photo_puzzle', name: 'Puzzle de Fotos Especial', description: 'Desembaralhe os blocos para restaurar aquela selfie inesquecível de vocês.', category: 'memories', thumbnail: 'https://images.unsplash.com/photo-1494972308805-463bc619b34e?q=80&w=600&auto=format&fit=crop', emoji: '🧩' },
    { id: 'tic_tac_toe', name: 'Jogo da Velha', description: 'Clássico tic-tac-toe estilizado com amor. Quem ganha prepara o jantar de hoje!', category: 'arcade', thumbnail: 'https://images.unsplash.com/photo-1531747118685-ca3fa6e22f30?q=80&w=600&auto=format&fit=crop', emoji: '⭕' },
    { id: 'memory', name: 'Cartões da Memória', description: 'Encontre todos os pares dos ícones fofos no menor número de cliques possíveis.', category: 'arcade', thumbnail: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop', emoji: '🃏' },
    { id: 'snake', name: 'Cobra com Amor', description: 'Controle a cobra espacial coletando os corações brilhantes para fazê-la crescer.', category: 'arcade', thumbnail: 'https://images.unsplash.com/photo-1494972308805-463bc619b34e?q=80&w=600&auto=format&fit=crop', emoji: '🐍' }
  ];

  const filteredGames = ALL_GAMES.filter(g => {
    if (activeTab === 'all') return true;
    if (activeTab === 'casal' && g.category === 'casal') return true;
    if (activeTab === 'arcade' && g.category === 'arcade') return true;
    if (activeTab === 'memories' && g.category === 'memories') return true;
    return false;
  });

  return (
    <div id="games_system_container" className="min-h-screen bg-[#fcf9f2] pb-32 select-none relative overflow-x-hidden">
      {/* 🔮 BACKGROUND DECORATION PATTERNS */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 border-[4px] border-black rounded-[4rem] rotate-12 scale-150 blur-3xl bg-amber-200" />
        <div className="absolute top-[40%] right-[-10%] w-96 h-96 border-[8px] border-black rounded-full -rotate-12 bg-rose-200 opacity-30" />
        <div className="absolute bottom-[20%] left-[-5%] w-80 h-80 bg-emerald-100 rounded-[3rem] rotate-45 opacity-40 blur-2xl" />
        
        {/* Geometric Grid Pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '48px 48px', opacity: 0.08 }} />
      </div>

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} style={{ zIndex: 100 }} />}

      <div className="w-full px-0 space-y-24 relative z-10 pb-40">
        
        <div className="w-full px-4 md:px-8 lg:px-10 space-y-24">
          {/* 🚀 JOGOS HERO SECTION */}
          <section className="bg-white border-[6px] border-black p-10 md:p-14 lg:p-20 rounded-[4rem] shadow-[24px_24px_0px_0px_#000] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 lg:gap-20 relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 opacity-10 group-hover:opacity-20 transition-all duration-700 group-hover:rotate-45 group-hover:scale-125">
            <Gamepad2 className="w-[500px] h-[500px] text-black" />
          </div>

          <div className="space-y-10 relative z-10 flex-1">
            <div className="inline-flex items-center gap-4 bg-amber-400 border-[4px] border-black px-8 py-3 rounded-[2rem] shadow-[8px_8px_0px_0px_#000] -rotate-2">
              <Sparkles className="w-6 h-6 text-black animate-pulse" />
              <span className="text-sm font-black text-black uppercase tracking-[0.3em] italic">
                Cofre de Diversão
              </span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic -rotate-1 transform-gpu">
                Central <br /> 
                <span className="bg-[#e84e4e] text-white px-8 py-3 border-[6px] border-black inline-block mt-4 rotate-2 shadow-[12px_12px_0px_0px_#000] relative">
                  De Jogos
                  <div className="absolute -top-6 -right-6 w-16 h-16 bg-amber-400 border-[4px] border-black rounded-2xl flex items-center justify-center -rotate-12 animate-bounce">
                    <Star className="w-8 h-8 text-black fill-black" />
                  </div>
                </span>
              </h1>
            </div>

            <p className="max-w-xl text-black/60 font-black text-xl md:text-2xl leading-tight uppercase tracking-tight italic">
              Divirta-se juntos, desbloqueie conquistas e crie novas memórias neste ambiente interativo exclusivo para o nosso amor.
            </p>
            
            <div className="flex flex-wrap items-center gap-8 pt-6">
              <a 
                href="#secao-jogos"
                className="bg-black text-white border-[6px] border-black px-16 py-8 rounded-[3rem] font-black uppercase italic text-lg tracking-[0.2em] shadow-[14px_14px_0px_0px_#4ade80] hover:-translate-y-2 hover:shadow-[18px_18px_0px_0px_#4ade80] active:translate-y-1 transition-all flex items-center gap-4 cursor-pointer"
              >
                Jogar Agora
              </a>
              <button
                onClick={() => setActiveTab('achievements')}
                className="bg-white text-black border-[6px] border-black px-12 py-8 rounded-[3rem] font-black uppercase italic text-lg tracking-[0.2em] shadow-[12px_12px_0px_0px_#e84e4e] hover:-translate-y-2 active:translate-y-1 transition-all flex items-center gap-4 cursor-pointer"
              >
                Conquistas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-8 shrink-0 w-full xl:w-auto relative z-10">
            {[
              { label: 'Love Coins', value: profile?.heartPoints ?? 200, icon: Coins, color: 'bg-rose-400', unit: '❤️' },
              { label: 'Nível', value: Math.min(99, Math.floor((gameStats.gamesWon * 5 + unlockedAchievements.length * 15 + (profile?.heartPoints ?? 200) / 10) / 10) + 1), icon: Star, color: 'bg-emerald-400', unit: 'LVL' },
              { label: 'Conquistas', value: `${unlockedAchievements.length}/${ALL_ACHIEVEMENTS.length}`, icon: Award, color: 'bg-[#ff90e8]', unit: '' },
            ].map((s, i) => (
              <div key={i} className={`${s.color} border-[4px] border-black p-6 rounded-[2rem] shadow-[8px_8px_0px_0px_#000] flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-pointer ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                <div className="w-14 h-14 bg-white border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                  <s.icon className={`w-8 h-8 text-black ${i === 0 ? 'animate-spin' : ''}`} style={i === 0 ? { animationDuration: '4s' } : {}} strokeWidth={3} />
                </div>
                <div>
                  <div className="text-3xl font-black leading-none">{s.value} {s.unit}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🎯 DESAFIO DIÁRIO */}
        <section className="bg-black text-white border-[6px] border-black p-10 md:p-14 lg:p-20 rounded-[4rem] shadow-[24px_24px_0px_0px_#e84e4e] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] group-hover:bg-red-500/20 transition-all pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 relative z-10 w-full font-sans">
            <div className="space-y-8 lg:max-w-md">
              <div className="inline-flex items-center gap-4 bg-yellow-400 border-[4px] border-black px-8 py-3 rounded-[2rem] shadow-[8px_8px_0px_0px_#000] -rotate-1">
                <Flame size={24} className="text-black fill-black animate-pulse" />
                <span className="text-sm font-black text-black uppercase tracking-[0.3em] italic text-shadow-none">Missões Diárias</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] italic mb-4">
                Desafios <br /> 
                <span className="bg-white text-black px-6 py-2 border-[6px] border-black inline-block mt-4 rotate-1 transform-gpu shadow-[12px_12px_0px_0px_#000]">Do Dia</span>
              </h2>
              <p className="text-white/40 font-black uppercase text-sm tracking-[0.3em] leading-relaxed italic">
                Cumpram essas tarefas românticas juntos para desbloquear <strong className="text-yellow-400">Love Coins</strong> e elevar nosso nível de conexão!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full xl:flex-1">
              {dailyChallenges.map((challenge, idx) => (
                <div 
                  key={challenge.id} 
                  className={`bg-neutral-900 border-[5px] border-black p-10 rounded-[3rem] shadow-[14px_14px_0px_0px_#000] flex flex-col justify-between space-y-8 transition-all hover:-translate-y-4 hover:shadow-[18px_18px_0px_0px_#e84e4e] ${idx % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="bg-yellow-400/10 border-[2px] border-yellow-400/40 px-4 py-1.5 rounded-full">
                        <span className="text-[10px] font-black tracking-[0.2em] text-yellow-400 uppercase">+{challenge.reward} COINS</span>
                      </div>
                      {challenge.completed && (
                        <div className="bg-emerald-400 border-[4px] border-black p-3 rounded-2xl shadow-[6px_6px_0px_0px_#000] -rotate-12 translate-x-4 -translate-y-4">
                          <Check className="w-6 h-6 text-black" strokeWidth={5} />
                        </div>
                      )}
                    </div>
                    <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{challenge.title}</h4>
                    <p className="text-md text-stone-400 font-black uppercase tracking-tight leading-tight italic">{challenge.description}</p>
                  </div>

                  <button
                    onClick={() => handleCompleteDaily(challenge.id, challenge.reward)}
                    disabled={challenge.completed}
                    className={`w-full py-6 border-[4px] border-black rounded-[1.5rem] font-black uppercase text-sm tracking-[0.2em] transition-all shadow-[8px_8px_0px_0px_#000] flex items-center justify-center gap-4 active:translate-y-2 active:shadow-none cursor-pointer ${
                        challenge.completed 
                          ? 'bg-stone-800 text-stone-600 border-stone-700 shadow-none cursor-not-allowed' 
                          : 'bg-yellow-400 hover:bg-white text-black active:translate-y-1'
                      }`}
                  >
                    {challenge.completed ? 'Tarefa Concluída' : 'Marcar como Feito'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>


        </div>

        {/* 🔄 ACTIVE GAME AREA */}
        <AnimatePresence>
          {activeGame && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              id="arena_de_jogo"
              className="border-y-[8px] border-black bg-white overflow-hidden shadow-[0px_32px_0px_0px_rgba(0,0,0,1)] relative z-20 min-h-screen"
            >
            {/* Header banner */}
            <div className="bg-black text-white p-10 md:p-14 flex flex-col md:flex-row justify-between items-center gap-10 border-b-[8px] border-black relative overflow-hidden">
               {/* Animated Background elements for arcade feel */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-emerald-500 rounded-full blur-3xl animate-pulse" />
                 <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-rose-500 rounded-full blur-3xl animate-pulse delay-700" />
              </div>

              <div className="flex items-center gap-10 relative z-10">
                <div className="w-24 h-24 bg-white border-[5px] border-black rounded-[2.5rem] flex items-center justify-center text-6xl shadow-[8px_8px_0px_0px_#ff90e8] rotate-3 hover:rotate-12 transition-transform duration-500">
                  {ALL_GAMES.find(g => g.id === activeGame)?.emoji}
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-white/30 block italic">Arena Arcade Live</span>
                  <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">{ALL_GAMES.find(g => g.id === activeGame)?.name}</h3>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm("Quer mesmo encerrar esta partida incrível?")) {
                    setActiveGame(null);
                  }
                }}
                className="bg-rose-500 text-black border-[5px] border-black px-12 py-6 rounded-[2.5rem] font-black uppercase italic text-sm tracking-[0.2em] shadow-[10px_10px_0px_0px_#fff] hover:-translate-y-2 active:translate-y-1 active:shadow-none transition-all cursor-pointer relative z-10"
              >
                Encerrar Jogo
              </button>
            </div>

            {/* Game Canvas Container */}
            <div className="p-10 md:p-14 lg:p-20 bg-[#fcf9f2] min-h-[600px] flex items-center justify-center">
              <div className="w-full mx-auto">
                {activeGame === 'quiz' && <QuizGame onComplete={(score) => { recordScore('quiz', score); if (score >= 80) unlockAchievement('quiz_master'); unlockAchievement('first_win'); }} addCoins={addHeartPoints} />}
                {activeGame === 'truth_dare' && <TruthDareGame onComplete={() => { recordScore('truth_dare', 10); unlockAchievement('first_win'); }} addCoins={addHeartPoints} />}
                {activeGame === 'compatibility' && <CompatibilityCalculator onComplete={() => { recordScore('compatibility', 20); unlockAchievement('first_win'); }} />}
                {activeGame === 'guess_photo' && <GuessPhotoGame onComplete={(score) => { recordScore('guess_photo', score); unlockAchievement('first_win'); }} addCoins={addHeartPoints} />}
                {activeGame === 'photo_puzzle' && <PhotoPuzzleGame onComplete={() => { recordScore('photo_puzzle', 80); unlockAchievement('puzzle_builder'); unlockAchievement('first_win'); }} addCoins={addHeartPoints} />}
                {activeGame === 'tic_tac_toe' && <TicTacToeGame onComplete={() => { recordScore('tic_tac_toe', 30); unlockAchievement('first_win'); }} addCoins={addHeartPoints} />}
                {activeGame === 'memory' && <MemoryGame onComplete={(pairsMatched, movesUsed) => { recordScore('memory', 100 - movesUsed); unlockAchievement('first_win'); if (movesUsed <= 15) unlockAchievement('memory_pro'); }} addCoins={addHeartPoints} />}
                {activeGame === 'snake' && <LoveSnakeGame onComplete={(score) => { recordScore('snake', score); if (score >= 10) unlockAchievement('snake_fan'); unlockAchievement('first_win'); }} addCoins={addHeartPoints} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full px-4 md:px-8 lg:px-10 space-y-24">
        {/* 📌 CATEGORIES & CARD LIST OF GAMES */}
        <section id="secao-jogos" className="space-y-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 bg-white border-[6px] border-black p-12 md:p-16 rounded-[4rem] shadow-[24px_24px_0px_0px_#000] w-full relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-400/10 rounded-full blur-[100px] group-hover:bg-rose-400/20 transition-all pointer-events-none" />
          
          <div className="space-y-10 w-full relative z-10 flex-1">
            <div className="inline-flex items-center gap-4 bg-rose-400 border-[4px] border-black px-8 py-3 rounded-[2rem] shadow-[8px_8px_0px_0px_#000] -rotate-1">
              <Dices size={28} className="text-black" strokeWidth={3} />
              <span className="text-sm font-black uppercase tracking-[0.3em] text-black italic">Catálogo Arcade</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] text-black italic mb-2">
               Escolha Sua <br /> <span className="bg-white px-6 py-2 border-[6px] border-black inline-block mt-4 rotate-1 transform-gpu shadow-[12px_12px_0px_0px_#000]">Diversão</span>
            </h2>
            <div className="flex flex-wrap gap-4 pt-6">
              {[
                  { id: 'all', label: 'Todos' },
                  { id: 'casal', label: '❤️ Casal' },
                  { id: 'arcade', label: '🎮 Arcade' },
                  { id: 'memories', label: '📸 Memórias' },
                  { id: 'achievements', label: '🏆 Conquistas' }
                ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`px-10 py-6 border-[4px] border-black rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_#4ade80] active:translate-y-1 active:shadow-none cursor-pointer ${activeTab === tab.id ? 'bg-black text-white shadow-[10px_10px_0px_0px_#4ade80]' : 'bg-white text-black shadow-[8px_8px_0px_0px_#000]'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab !== 'achievements' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 pt-8">
            {filteredGames.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30, rotate: idx % 2 === 0 ? 2 : -2 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative p-8 border-[6px] border-black rounded-[3.5rem] transition-all duration-500 hover:-translate-y-6 hover:shadow-[24px_24px_0px_0px_#e84e4e] shadow-[16px_16px_0px_0px_#000] cursor-pointer bg-white flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative Elements */}
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-12 border-[4px] border-black z-20 shadow-[6px_6px_0px_0px_#000] ${idx % 2 === 0 ? 'bg-rose-400 rotate-3' : 'bg-amber-400 -rotate-3'}`} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[150%] bg-rose-400/5 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="relative aspect-square md:aspect-video overflow-hidden border-[5px] border-black rounded-[2rem] mb-8 z-10 group-hover:rotate-1 transition-transform duration-500">
                  <img src={game.thumbnail} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-125" alt={game.name} />
                  <div className="absolute top-6 right-6 bg-white border-[4px] border-black p-3 rounded-2xl shadow-[6px_6px_0px_0px_#000] rotate-12 group-hover:scale-110 transition-transform">
                     <span className="text-3xl">{game.emoji}</span>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                     <div className="bg-black text-white px-4 py-1.5 rounded-xl border-[2px] border-black">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">{game.category} MODE</span>
                     </div>
                     <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#e84e4e] animate-bounce">
                        <Flame className="w-5 h-5 fill-rose-500" /> HOT GAME
                     </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter text-black leading-none group-hover:text-rose-500 transition-colors">{game.name}</h3>
                    <p className="text-black/40 font-black uppercase text-xs tracking-widest italic line-clamp-2 leading-relaxed">{game.description}</p>
                  </div>
                  
                  <div className="pt-8 border-t-[4px] border-black/5 flex items-center justify-between">
                    <button 
                      onClick={() => {
                        setActiveGame(game.id);
                        toast.success(`Iniciando ${game.name}...`, { icon: '🎮' });
                        setTimeout(() => {
                          const element = document.getElementById('arena_de_jogo');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }, 300);
                      }}
                      className="text-sm font-black uppercase italic underline decoration-[4px] underline-offset-[10px] decoration-rose-400 hover:decoration-black transition-all cursor-pointer"
                    >
                      Entrar na Arena &rarr;
                    </button>
                    <div className="w-12 h-12 bg-amber-400 border-[4px] border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000] rotate-12 group-hover:rotate-45 transition-transform duration-500">
                      <Zap className="w-6 h-6 text-black" strokeWidth={4} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* 🏆 ACHIEVEMENTS & LEADERBOARD GRID TAB */
          <div className="space-y-32 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              {/* Achievements Column */}
              <div className="lg:col-span-8 space-y-16">
                <div className="flex items-center gap-8 relative">
                   <div className="absolute -left-12 -top-12 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -z-10" />
                  <div className="w-24 h-24 bg-amber-400 border-[5px] border-black rounded-[2rem] flex items-center justify-center shadow-[10px_10px_0px_0px_#000] -rotate-6 group hover:rotate-6 transition-transform duration-500">
                    <Award className="w-12 h-12 text-black" strokeWidth={4} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-black/30 block italic">Sala das Medalhas</span>
                    <h3 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">Conquistas</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {ALL_ACHIEVEMENTS.map((ach, i) => {
                    const isUnlocked = unlockedAchievements.includes(ach.id);
                    return (
                      <div 
                        key={ach.id} 
                        className={`group relative p-10 border-[6px] border-black rounded-[3.5rem] transition-all duration-500 shadow-[14px_14px_0px_0px_#000] ${
                          isUnlocked 
                            ? 'bg-white hover:-translate-y-4 hover:shadow-[20px_20px_0px_0px_#4ade80]' 
                            : 'bg-stone-100 opacity-50 shadow-none'
                        } ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                      >
                         {/* Unlock Stamp */}
                         {isUnlocked && (
                           <div className="absolute -top-6 -right-6 bg-[#4ade80] border-[4px] border-black p-4 rounded-2xl shadow-[6px_6px_0px_0px_#000] rotate-12 z-20 animate-bounce">
                              <Star className="w-6 h-6 text-black fill-black" />
                           </div>
                         )}

                        <div className="flex items-center gap-8">
                          <div className={`w-20 h-20 border-[4px] border-black rounded-[2rem] flex items-center justify-center text-5xl shadow-[6px_6px_0px_0px_#000] group-hover:scale-110 transition-transform ${isUnlocked ? 'bg-amber-100' : 'bg-stone-200 opacity-50'}`}>
                            {isUnlocked ? ach.icon : <Lock size={32} className="text-black/40" />}
                          </div>
                          <div className="space-y-2 flex-1">
                             <div className="flex items-center gap-4">
                               <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{ach.name}</h4>
                             </div>
                             <p className="text-xs font-black uppercase tracking-widest text-black/40 leading-snug italic">{ach.description}</p>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t-[4px] border-black/5 flex justify-between items-center text-xs font-black uppercase tracking-widest italic leading-none">
                          <span className="text-black/30">Recompensa</span>
                          <span className="text-[#ff90e8] bg-black px-4 py-1.5 rounded-lg border-[2px] border-black shadow-[4px_4px_0px_0px_#ff90e8]">+{ach.reward} HEART COINS</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leaderboard Column */}
              <div className="lg:col-span-4 space-y-16">
                  <div className="flex items-center gap-8 relative">
                    <div className="absolute -right-12 -top-12 w-32 h-32 bg-rose-400/10 rounded-full blur-3xl -z-10" />
                    <div className="w-24 h-24 bg-rose-400 border-[5px] border-black rounded-[2rem] flex items-center justify-center shadow-[10px_10px_0px_0px_#000] rotate-6 group hover:-rotate-6 transition-transform duration-500">
                      <Trophy className="w-12 h-12 text-black" strokeWidth={4} />
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-black uppercase tracking-[0.4em] text-black/30 block italic">Top Jogadores</span>
                      <h3 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">Ranking</h3>
                    </div>
                  </div>

                  <div className="bg-white border-[8px] border-black rounded-[4rem] p-12 shadow-[24px_24px_0px_0px_#000] space-y-10 relative overflow-hidden group">
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-400/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-amber-400/10 transition-all duration-700" />
                    
                    <div className="space-y-6">
                      {leaderboard.length > 0 ? (
                        leaderboard.map((item, idx) => (
                          <div key={idx} className="group flex justify-between items-center bg-[#fcf9f2] border-[4px] border-black p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_#000] hover:-translate-y-2 transition-all hover:shadow-[10px_10px_0px_0px_#4ade80]">
                            <div className="flex items-center gap-6">
                              <span className={`w-12 h-12 flex items-center justify-center font-black text-lg rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] transition-transform group-hover:rotate-12 ${
                                idx === 0 ? 'bg-amber-400 scale-110' : idx === 1 ? 'bg-stone-200' : idx === 2 ? 'bg-rose-200' : 'bg-white'
                              }`}>
                                {idx + 1}
                              </span>
                              <div className="space-y-1">
                                <p className="font-black uppercase text-lg italic tracking-tighter leading-none">{item.userName}</p>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">{item.gameId === 'quiz' ? 'Conhecimento' : 'Arcade Master'}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-black italic text-black leading-none tracking-tighter">
                                {item.score}
                              </p>
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#4ade80] block mt-1">SINTONIA</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-24 text-center space-y-8">
                           <div className="w-32 h-32 bg-stone-50 border-[4px] border-black border-dashed rounded-[3rem] flex items-center justify-center mx-auto relative overflow-hidden">
                             <Trophy size={56} className="text-black/5 animate-pulse" />
                             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-black/5 to-transparent flex items-center justify-center rotate-45" />
                           </div>
                           <div className="space-y-2">
                             <p className="font-black uppercase text-sm tracking-[0.4em] text-black/20 italic">Ainda sem registros</p>
                             <p className="text-xs font-black uppercase tracking-widest text-black/10 italic">Seja o primeiro a pontuar!</p>
                           </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-10 border-t-[4px] border-black/5 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20 animate-pulse">Sintonizando Hall da Fama</p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        )}
      </section>

      </div>
    </div>
  </div>
);
}

/* ==========================================
   1. ❤️ JOGO: QUIZ DO CASAL
   ========================================== */
function QuizGame({ onComplete, addCoins }: { onComplete: (score: number) => void; addCoins: (amount: number) => void }) {
  const [questions, setQuestions] = useState<any[]>(COUPLE_QUIZ_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  
  // Custom quiz builder states
  const [newQuestion, setNewQuestion] = useState('');
  const [newOpts, setNewOpts] = useState(['', '', '', '']);
  const [newAns, setNewAns] = useState(0);

  const startQuiz = (limitSize: number) => {
    // Suffle questions and pick limit
    const shuffled = [...COUPLE_QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, limitSize);
    setQuestions(shuffled);
    setNumQuestions(shuffled.length);
    setQuizStarted(true);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || newOpts.some(o => !o.trim())) {
      toast.error("Complete todos os campos da pergunta antes de salvar!");
      return;
    }
    const customItem = {
      question: newQuestion,
      options: [...newOpts],
      answer: newAns,
      explanation: "Pergunta personalizada criada pelo casal!"
    };
    setQuestions([customItem, ...questions]);
    toast.success("Pergunta personalizada adicionada!");
    setCustomMode(false);
    // clear fields
    setNewQuestion('');
    setNewOpts(['', '', '', '']);
  };

  const handleAnswerSubmit = (optIndex: number) => {
    if (showAnswer) return;
    setSelectedOpt(optIndex);
    setShowAnswer(true);
    let points = 0;
    if (optIndex === questions[currentIdx].answer) {
      points = 10;
      setScore(prev => prev + points);
      addCoins(5); // 5 Love Coins for answering right
      toast.success("Resposta correta! +5 Love Coins!");
    } else {
      toast.error("Ops! Errou!");
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setShowAnswer(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsDone(true);
      const percent = (score / (questions.length * 10)) * 100;
      onComplete(percent);
    }
  };

  if (customMode) {
    return (
      <div className="w-full max-w-lg mx-auto text-left space-y-8">
        <h4 className="text-3xl font-black uppercase text-black italic italic tracking-tighter">Crie sua Pergunta</h4>
        <form onSubmit={handleCreateCustom} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Qual a pergunta?</label>
            <input 
              type="text" 
              placeholder="Ex: Em qual restaurante nós fomos no aniversário de namoro?" 
              value={newQuestion}
              onChange={e => setNewQuestion(e.target.value)}
              className="w-full bg-white border-[4px] border-black p-5 rounded-[1.5rem] font-black shadow-[6px_6px_0px_0px_#000] focus:translate-y-1 focus:shadow-none transition-all outline-none"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Opções de resposta:</label>
            {newOpts.map((opt, oIdx) => (
              <div key={oIdx} className="flex gap-4 items-center">
                <input 
                  type="radio" 
                  name="custom-ans" 
                  checked={newAns === oIdx} 
                  onChange={() => setNewAns(oIdx)} 
                  className="w-6 h-6 accent-rose-500 cursor-pointer" 
                />
                <input 
                  type="text" 
                  placeholder={`Opção ${oIdx + 1}`} 
                  value={opt}
                  onChange={e => {
                    const next = [...newOpts];
                    next[oIdx] = e.target.value;
                    setNewOpts(next);
                  }}
                  className="w-full bg-white border-[3px] border-black p-4 rounded-xl font-black text-sm shadow-[4px_4px_0px_0px_#000]"
                />
              </div>
            ))}
            <span className="text-[10px] font-black uppercase tracking-widest text-black/20 italic">Marque a esquerda para indicar a correta.</span>
          </div>

          <div className="flex gap-6 pt-4">
            <button type="submit" className="bg-[#4ade80] text-black border-[4px] border-black px-8 py-4 rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 active:translate-y-1 transition-all cursor-pointer">Salvar Pergunta</button>
            <button type="button" onClick={() => setCustomMode(false)} className="bg-white text-black border-[4px] border-black px-8 py-4 rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 active:translate-y-1 transition-all cursor-pointer">Cancelar</button>
          </div>
        </form>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-10 py-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 bg-rose-400 border-[3px] border-black px-5 py-2 rounded-xl shadow-[4px_4px_0px_0px_#000] -rotate-1">
             <Brain size={18} className="text-black" />
             <span className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Teste de Sintonia</span>
          </div>
          <h4 className="text-4xl font-black text-black uppercase tracking-tighter italic leading-none">O quanto você conhece <br /> seu amor?</h4>
          <p className="text-black/40 font-black uppercase text-[10px] tracking-widest">Responda corretamente para ganhar Love Coins!</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[
            { id: 10, label: 'Conhecendo Você', emoji: '🌟', color: 'bg-emerald-400', desc: '10 perguntas fáceis' },
            { id: 20, label: 'Sintonia Plena', emoji: '🔥', color: 'bg-amber-400', desc: '20 perguntas médias' },
            { id: 50, label: 'Nível Casamento', emoji: '🧠', color: 'bg-[#ff90e8]', desc: '50 perguntas difíceis' },
            { id: 100, label: 'Desafio Supremo', emoji: '👑', color: 'bg-rose-400', desc: '100 perguntas (Teste Final)' },
          ].map((mode, idx) => (
            <button 
              key={mode.id}
              onClick={() => startQuiz(mode.id)} 
              className={`${mode.color} border-[4px] border-black p-6 rounded-[2rem] shadow-[8px_8px_0px_0px_#000] flex items-center justify-between hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000] active:translate-y-1 transition-all cursor-pointer group ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
            >
              <div className="flex items-center gap-6">
                <span className="text-4xl filter group-hover:scale-125 transition-transform">{mode.emoji}</span>
                <div className="text-left">
                  <span className="font-black text-sm uppercase tracking-widest block">{mode.label}</span>
                  <span className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em]">{mode.desc}</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6" strokeWidth={4} />
            </button>
          ))}
        </div>

        <button
          onClick={() => setCustomMode(true)}
          className="w-full py-5 bg-white border-[4px] border-black text-black text-xs font-black uppercase italic tracking-[0.2em] rounded-[1.5rem] hover:-translate-y-1 transition-all shadow-[6px_6px_0px_0px_#000] cursor-pointer"
        >
          ➕ Criar Pergunta Personalizada
        </button>
      </div>
    );
  }

  if (isDone) {
    const totalPossiblePoints = questions.length * 10;
    const finalPercent = (score / totalPossiblePoints) * 100;
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-10 py-10">
        <div className="relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-400 border-[3px] border-black px-6 py-2 rounded-xl shadow-[4px_4px_0px_0px_#000] font-black uppercase text-xs z-10 -rotate-2">Resultado Final!</div>
          <div className="bg-white border-[6px] border-black p-12 rounded-[3.5rem] shadow-[20px_20px_0px_0px_#000] space-y-6">
             <div className="text-8xl font-black text-black italic tracking-tighter leading-none">{finalPercent.toFixed(0)}%</div>
             <p className="font-black uppercase text-xs tracking-[0.2em] text-[#e84e4e] italic px-4">
              {finalPercent >= 80 ? 'Almas Gêmeas Perfeitas ❤️' : finalPercent >= 50 ? 'Quase lá! Grande Afinidade! ⭐' : 'Que vergonha! Precisam treinar! 💔'}
            </p>
            <div className="bg-[#fcf9f2] border-[3px] border-black p-5 rounded-[1.5rem] text-sm font-black uppercase tracking-tight italic">
              Conquistou <span className="text-emerald-500">{score}</span> pontos de sintonia!
            </div>
          </div>
        </div>

        <button onClick={() => { setQuizStarted(false); setIsDone(false); setCurrentIdx(0); setScore(0); }} className="bg-black text-white border-[4px] border-black px-12 py-6 rounded-[2rem] font-black uppercase italic text-sm tracking-[0.2em] shadow-[10px_10px_0px_0px_#e84e4e] hover:-translate-y-2 active:translate-y-1 transition-all cursor-pointer">
          Jogar Novamente 🔄
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="w-full max-w-xl mx-auto text-left space-y-8">
      <div className="flex justify-between items-end gap-6">
        <div className="space-y-2">
           <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] block italic">Questão {currentIdx + 1} de {questions.length}</span>
           <h4 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter italic leading-tight">{q.question}</h4>
        </div>
        <div className="bg-emerald-400 border-[3px] border-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_#000] shrink-0 rotate-3">
           <span className="text-lg font-black italic">{score} <span className="text-[10px] uppercase">PTS</span></span>
        </div>
      </div>

      <div className="w-full h-5 bg-white border-[4px] border-black rounded-full overflow-hidden shadow-[4px_4px_0px_0px_#000] p-0.5">
        <div className="h-full bg-rose-400 border-[2px] border-black rounded-full transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="grid grid-cols-1 gap-4 pt-4">
        {q.options.map((opt: string, idx: number) => {
          const isSelected = selectedOpt === idx;
          const isCorrect = idx === q.answer;
          const wasSubmitted = showAnswer;

          let btnStyle = "bg-white border-[4px] border-black text-black shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#000]";
          if (wasSubmitted) {
            if (isCorrect) {
              btnStyle = "bg-emerald-400 border-[4px] border-black text-black shadow-[6px_6px_0px_0px_#000] -translate-y-1";
            } else if (isSelected) {
              btnStyle = "bg-rose-400 border-[4px] border-black text-black shadow-[6px_6px_0px_0px_#000] -translate-y-1";
            } else {
              btnStyle = "bg-white border-[4px] border-black text-black/20 opacity-40 shadow-none";
            }
          }

          return (
            <button
              key={idx}
              disabled={wasSubmitted}
              onClick={() => handleAnswerSubmit(idx)}
              className={`p-6 rounded-[1.5rem] transition-all text-left text-sm font-black uppercase italic flex items-center justify-between cursor-pointer active:translate-y-1 ${btnStyle}`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full border-[3px] border-black flex items-center justify-center font-black text-xs shrink-0">{String.fromCharCode(65 + idx)}</span>
                <span>{opt}</span>
              </div>
              {wasSubmitted && isCorrect && <CheckCircle className="w-6 h-6 text-black" strokeWidth={4} />}
              {wasSubmitted && isSelected && !isCorrect && <Circle className="w-6 h-6 text-black" strokeWidth={4} />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="p-8 bg-amber-100 border-[4px] border-black rounded-[2rem] space-y-6 shadow-[10px_10px_0px_0px_#000] mt-8"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white border-[3px] border-black p-2 rounded-xl shadow-[3px_3px_0px_0px_#000]">
                 <Sparkles className="w-5 h-5 text-black animate-pulse" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-black">Curiosidade de Casal</span>
            </div>
            <p className="text-sm font-black uppercase tracking-tight italic leading-snug text-black/60">&ldquo;{q.explanation || 'Este é um momento maravilhoso guardado na nossa jornada.'}&rdquo;</p>
            <button 
              onClick={handleNext}
              className="w-full py-5 bg-black text-white text-xs font-black uppercase italic tracking-[0.2em] rounded-[1.2rem] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_#e84e4e]"
            >
              Seguir para Próxima <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================
   2. 🎲 JOGO: VERDADE OU DESAFIO
   ========================================== */
function TruthDareGame({ onComplete, addCoins }: { onComplete: () => void; addCoins: (amount: number) => void }) {
  const [selectedCat, setSelectedCat] = useState<'romantico' | 'divertido' | 'casal' | 'aleatorio'>('romantico');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [cardFlip, setCardFlip] = useState(false);

  const drawCard = (type: 'truth' | 'dare') => {
    const deck = TRUTH_OR_DARE_DECK.filter(item => item.type === type && (selectedCat === 'aleatorio' || item.category === selectedCat));
    if (deck.length === 0) {
      toast.error("Opa, deck vazio!");
      return;
    }
    const random = deck[Math.floor(Math.random() * deck.length)];
    setCardFlip(false);
    setTimeout(() => {
      setActiveItem(random);
      setCardFlip(true);
      onComplete();
    }, 100);
  };

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-12 py-6">
      <div className="space-y-4">
        <h4 className="text-4xl font-black text-black uppercase tracking-tighter italic">Verdade ou Desafio</h4>
        <p className="text-black/40 font-black uppercase text-[10px] tracking-widest leading-snug">Selecione uma categoria e desafie seu amor!</p>
      </div>

      {/* Categories slider */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { id: 'romantico', label: '💖 Romântico' },
          { id: 'divertido', label: '🤪 Divertido' },
          { id: 'casal', label: '👩‍❤️‍👨 Romance' },
          { id: 'aleatorio', label: '🎲 Surpresa' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { setSelectedCat(item.id as any); setActiveItem(null); }}
            className={`px-5 py-3 border-[3px] border-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none ${
              selectedCat === item.id ? 'bg-rose-400 text-black' : 'bg-white text-black hover:bg-rose-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Playing Board Card */}
      <div className="min-h-[300px] flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {activeItem ? (
            <motion.div
              key={activeItem.text}
              initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className={`w-full max-w-sm p-10 rounded-[3rem] border-[6px] border-black flex flex-col justify-between space-y-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] min-h-[250px] text-left relative overflow-hidden ${
                activeItem.type === 'truth' ? 'bg-[#fcf9f2]' : 'bg-[#ff90e8]'
              }`}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-black/5 rounded-full" />
              
              <div className="space-y-4 relative z-10">
                <div className={`inline-flex items-center gap-3 border-[3px] border-black px-4 py-1.5 rounded-full shadow-[3px_3px_0px_0px_#000] rotate-1 ${
                  activeItem.type === 'truth' ? 'bg-amber-400' : 'bg-white'
                }`}>
                   <span className="text-[10px] font-black uppercase tracking-widest">
                    {activeItem.type === 'truth' ? '🔮 VERDADE' : '🔥 DESAFIO'}
                  </span>
                </div>
                <p className="text-black font-black text-2xl leading-tight uppercase italic tracking-tighter">{activeItem.text}</p>
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                 <div className="text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Complete a tarefa para ganhar recompensas!</div>
                 <button
                  onClick={() => { 
                    addCoins(10); 
                    toast.success("Manda ver! +10 Love Coins!"); 
                    setActiveItem(null); 
                  }}
                  className="w-full py-4 bg-[#4ade80] text-black border-[4px] border-black rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  Concluído! 👍
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="w-full max-w-sm p-12 rounded-[3rem] border-[5px] border-black border-dashed flex flex-col items-center justify-center text-center space-y-6 min-h-[250px] bg-white/50">
              <div className="w-20 h-20 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000] animate-bounce">
                 <span className="text-5xl">🃏</span>
              </div>
              <p className="text-[10px] text-black/20 font-black uppercase tracking-[0.3em] italic">Aguardando sorteio...</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-8 pt-4">
        <button
          onClick={() => drawCard('truth')}
          className="group py-6 bg-amber-400 border-[4px] border-black text-black text-sm font-black uppercase italic tracking-[0.2em] rounded-[2rem] shadow-[10px_10px_0px_0px_#000] hover:-translate-y-2 active:translate-y-1 transition-all cursor-pointer"
        >
          🔮 Tirar Verdade
        </button>
        <button
          onClick={() => drawCard('dare')}
          className="group py-6 bg-rose-400 border-[4px] border-black text-black text-sm font-black uppercase italic tracking-[0.2em] rounded-[2rem] shadow-[10px_10px_0px_0px_#000] hover:-translate-y-2 active:translate-y-1 transition-all cursor-pointer"
        >
          🔥 Tirar Desafio
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   3. 🌟 ALMA GÊMEA: COMPATIBILIDADE ASTRO
   ========================================== */
function CompatibilityCalculator({ onComplete }: { onComplete: () => void }) {
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [loading, setLoading] = useState(false);
  const [affinity, setAffinity] = useState<number | null>(null);

  const calculateCompatibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner1.trim() || !partner2.trim()) {
      toast.error("Insira o nome dos dois parceiros!");
      return;
    }
    setLoading(true);
    // Simple deterministic pseudo-calculation
    setTimeout(() => {
      const together = (partner1.trim() + partner2.trim()).toLowerCase();
      let sum = 0;
      for (let i = 0; i < together.length; i++) {
        sum += together.charCodeAt(i);
      }
      // Return percentage within 85-100 because they're a perfect couple!
      const finalVal = (sum % 16) + 85; 
      setAffinity(finalVal);
      setLoading(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-12">
      <div className="space-y-4">
        <h4 className="text-4xl font-black text-black uppercase tracking-tighter italic">Cálculo de Afinidade</h4>
        <p className="text-black/40 font-black uppercase text-[10px] tracking-widest leading-snug">Descubra a vibração e compatibilidade absoluta de alma de vocês hoje.</p>
      </div>

      <form onSubmit={calculateCompatibility} className="space-y-8 bg-white border-[5px] border-black p-10 rounded-[3rem] shadow-[16px_16px_0px_0px_#000]">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2 text-left">
            <span className="text-[10px] uppercase font-black tracking-widest text-black/40 ml-2">Parceiro 1</span>
            <input 
              required
              type="text" 
              placeholder="Ex: José" 
              value={partner1} 
              onChange={e => setPartner1(e.target.value)}
              className="w-full bg-[#fcf9f2] border-[3px] border-black p-5 rounded-2xl font-black shadow-[4px_4px_0px_0px_#000] focus:translate-y-1 focus:shadow-none transition-all outline-none"
            />
          </div>
          <div className="space-y-2 text-left">
            <span className="text-[10px] uppercase font-black tracking-widest text-black/40 ml-2">Parceiro 2</span>
            <input 
              required
              type="text" 
              placeholder="Ex: Maria" 
              value={partner2} 
              onChange={e => setPartner2(e.target.value)}
              className="w-full bg-[#fcf9f2] border-[3px] border-black p-5 rounded-2xl font-black shadow-[4px_4px_0px_0px_#000] focus:translate-y-1 focus:shadow-none transition-all outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-black text-white text-xs font-black uppercase italic tracking-[0.2em] rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_#e84e4e] hover:-translate-y-1 active:translate-y-1 active:shadow-none"
        >
          {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />}
          {loading ? 'Calculando...' : 'Verificar Sintonia'}
        </button>
      </form>

      <AnimatePresence>
        {affinity && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotate: -3 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="p-10 bg-rose-400 border-[6px] border-black rounded-[3.5rem] space-y-6 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden"
          >
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
            <div className="text-[10px] text-black/40 font-black tracking-[0.3em] uppercase italic relative z-10">Resultado Astrológico</div>

            <div className="relative z-10">
              <h5 className="text-8xl font-black text-black leading-none italic tracking-tighter">{affinity}%</h5>
              <div className="bg-white border-[3px] border-black px-6 py-2 rounded-xl shadow-[4px_4px_0px_0px_#000] inline-block mt-4 rotate-1">
                <p className="text-xs font-black tracking-widest text-black uppercase">Almas Gêmeas Especiais ❤️</p>
              </div>
            </div>

            <p className="text-sm font-black uppercase italic tracking-tight text-white/80 leading-relaxed text-left relative z-10">&ldquo;Compatibilidade divina detectada. Vocês compartilham uma frequência espiritual ideal para superar desafios e criar conexões ultra duradouras.&rdquo;</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================
   4. 📸 JOGO: ADIVINHE A FOTO
   ========================================== */
function GuessPhotoGame({ onComplete, addCoins }: { onComplete: (score: number) => void; addCoins: (amount: number) => void }) {
  const [activePhoto, setActivePhoto] = useState<any | null>(null);
  const [blurLevel, setBlurLevel] = useState(40);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);

  useEffect(() => {
    fetchRandomPhoto();
  }, []);

  const fetchRandomPhoto = () => {
    setBlurLevel(40);
    setResolved(false);
    setSelectedOpt(null);
    setAlreadyAnswered(false);

    const matchRandom = FALLBACK_COUPLE_PHOTOS[Math.floor(Math.random() * FALLBACK_COUPLE_PHOTOS.length)];
    setActivePhoto(matchRandom);

    // Build unique random dates options
    const list = [matchRandom.title];
    while(list.length < 3) {
      const rnd = FALLBACK_COUPLE_PHOTOS[Math.floor(Math.random() * FALLBACK_COUPLE_PHOTOS.length)].title;
      if (!list.includes(rnd)) {
        list.push(rnd);
      }
    }
    setOptions(list.sort(() => 0.5 - Math.random()));
  };

  const handleRevealMore = () => {
    if (blurLevel > 5) {
      setBlurLevel(prev => Math.max(0, prev - 10)); // clear unblur
    }
  };

  const handleSubmitGuess = (opt: string) => {
    if (alreadyAnswered) return;
    setSelectedOpt(opt);
    setAlreadyAnswered(true);
    setResolved(true);
    setBlurLevel(0); // clear blur on submit

    if (opt === activePhoto.title) {
      // Calculate reward based on blur difficulty
      const rewardCoins = Math.round(blurLevel + 10);
      addCoins(rewardCoins);
      toast.success(`Parabéns, acertou! +${rewardCoins} Love Coins!`);
      onComplete(blurLevel + 50); // score multiplier
    } else {
      toast.error(`Ops! Era "${activePhoto.title}"`);
    }
  };

  if (!activePhoto) return <div className="text-center py-20 font-black uppercase text-xs tracking-widest animate-pulse">Revelando Memória...</div>;

  return (
    <div className="w-full max-w-lg mx-auto text-center space-y-10">
      <div className="space-y-4">
        <h4 className="text-4xl font-black text-black uppercase tracking-tighter italic">Onde Estávamos?</h4>
        <p className="text-black/40 font-black uppercase text-[10px] tracking-widest">Adivinhe a foto mais borrada para ganhar mais Love Coins!</p>
      </div>

      <div className="relative overflow-hidden aspect-video border-[6px] border-black rounded-[3rem] bg-stone-100 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] group">
        <img 
          src={activePhoto.url} 
          alt="Adivinhe" 
          style={{ filter: `blur(${blurLevel}px)` }}
          className="w-full h-full object-cover transition-all duration-500 scale-105 group-hover:scale-100" 
        />
        <div className="absolute top-6 right-6 bg-white border-[3px] border-black px-4 py-2 rounded-xl font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_#000] z-10 animate-pulse rotate-3">
          Sintonia: {blurLevel > 0 ? `${blurLevel}PX BLUR` : 'FOCO TOTAL!'}
        </div>
      </div>

      <div className="flex gap-6 justify-center">
        <button
          onClick={handleRevealMore}
          disabled={blurLevel <= 10 || alreadyAnswered}
          className="px-8 py-4 bg-white border-[4px] border-black rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 active:translate-y-1 disabled:opacity-40 disabled:shadow-none transition-all cursor-pointer"
        >
          👁️ Revelar Mais
        </button>
        {resolved && (
          <button
            onClick={fetchRandomPhoto}
            className="px-8 py-4 bg-emerald-400 border-[4px] border-black rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 active:translate-y-1 transition-all cursor-pointer"
          >
            🔄 Próxima Foto
          </button>
        )}
      </div>

      <div className="space-y-4 text-left">
        <span className="text-[10px] uppercase font-black tracking-widest text-black/40 ml-4">Escolha a Opção Correta</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((opt, i) => {
            const isCorrect = opt === activePhoto.title;
            const isChosen = selectedOpt === opt;
            let themeClass = "bg-white border-[4px] border-black shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1";

            if (alreadyAnswered) {
              if (isCorrect) {
                themeClass = "bg-emerald-400 border-[4px] border-black shadow-[6px_6px_0px_0px_#000]";
              } else if (isChosen) {
                themeClass = "bg-rose-400 border-[4px] border-black shadow-[6px_6px_0px_0px_#000]";
              } else {
                themeClass = "bg-white opacity-30 border-[4px] border-black shadow-none";
              }
            }

            return (
              <button
                key={i}
                disabled={alreadyAnswered}
                onClick={() => handleSubmitGuess(opt)}
                className={`p-6 rounded-2xl font-black text-xs uppercase italic tracking-tight transition-all text-center cursor-pointer ${themeClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   5. 🧩 JOGO: PUZZLE DE FOTOS
   ========================================== */
function PhotoPuzzleGame({ onComplete, addCoins }: { onComplete: () => void; addCoins: (amount: number) => void }) {
  const [photo, setPhoto] = useState<any | null>(null);
  const [grid, setGrid] = useState<number[]>([]); // holds indices
  const [win, setWin] = useState(false);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    initPuzzle();
  }, []);

  const initPuzzle = () => {
    // Pick photo
    const random = FALLBACK_COUPLE_PHOTOS[Math.floor(Math.random() * FALLBACK_COUPLE_PHOTOS.length)];
    setPhoto(random);
    setClicks(0);
    setWin(false);

    // Initial solved sequence [0..8]
    // Shuffle ensuring it's not solved.
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    do {
      arr = [...arr].sort(() => 0.5 - Math.random());
    } while (isSolved(arr));
    setGrid(arr);
  };

  const isSolved = (currentGrid: number[]) => {
    for (let i = 0; i < currentGrid.length; i++) {
      if (currentGrid[i] !== i) return false;
    }
    return true;
  };

  const handleTileClick = (index: number) => {
    if (win) return;
    const blankCell = grid.indexOf(8); // empty tile is 8 (the bottom-right sector)
    const rowClick = Math.floor(index / 3);
    const colClick = index % 3;
    const rowBlank = Math.floor(blankCell / 3);
    const colBlank = blankCell % 3;

    const isAdjacent = (Math.abs(rowClick - rowBlank) + Math.abs(colClick - colBlank)) === 1;

    if (isAdjacent) {
      const nextGrid = [...grid];
      nextGrid[blankCell] = grid[index];
      nextGrid[index] = 8;
      setGrid(nextGrid);
      setClicks(prev => prev + 1);

      if (isSolved(nextGrid)) {
        setWin(true);
        addCoins(100);
        toast.success("Puzzle Resolvido! +100 Love Coins!");
        onComplete();
      }
    }
  };

  if (!photo) return <div className="text-center py-20 font-black uppercase text-xs tracking-widest animate-pulse">Criando Desafio...</div>;

  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-10">
      <div className="space-y-4">
        <h4 className="text-4xl font-black text-black uppercase tracking-tighter italic">Puzzle de Fotos</h4>
        <p className="text-black/40 font-black uppercase text-[10px] tracking-widest leading-snug">Ordene as peças deslizantes para recompor nossa memória!</p>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-black rounded-[3rem] overflow-hidden aspect-square border-[6px] border-black relative shadow-[24px_24px_0px_0px_rgba(0,0,0,1)]">
        {grid.map((tileVal, idx) => {
          const isBlank = tileVal === 8;
          const tileRow = Math.floor(tileVal / 3);
          const tileCol = tileVal % 3;

          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              className={`relative overflow-hidden aspect-square border-[2px] border-black/20 rounded-2xl transition-all cursor-pointer ${
                isBlank ? 'bg-zinc-900 border-none opacity-0' : 'bg-white'
              }`}
            >
              {!isBlank && (
                <div 
                  className="absolute w-[300%] h-[300%]"
                  style={{
                    backgroundImage: `url(${photo.url})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${(tileCol * 50)}% ${(tileRow * 50)}%`
                  }}
                />
              )}
              {!isBlank && (
                <div className="absolute top-2 left-2 bg-black/60 text-white rounded-lg text-[8px] w-5 h-5 flex items-center justify-center font-black">
                  {tileVal + 1}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-black/40 px-4 italic">
          <span>{clicks} MOVIMENTOS</span>
          <span className="text-rose-500">Dificuldade: Normal</span>
        </div>
        <button
          onClick={initPuzzle}
          className="w-full py-5 bg-black text-white text-xs font-black uppercase italic tracking-[0.2em] rounded-2xl border-[4px] border-black shadow-[8px_8px_0px_0px_#e84e4e] hover:-translate-y-1 active:translate-y-1 transition-all cursor-pointer"
        >
          🔄 Embaralhar Outra Foto
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   6. ⭕ JOGO: JOGO DA VELHA
   ========================================== */
function TicTacToeGame({ onComplete, addCoins }: { onComplete: () => void; addCoins: (amount: number) => void }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleCellClick = (idx: number) => {
    if (board[idx] || winner) return;

    const nextBoard = [...board];
    nextBoard[idx] = isXNext ? '❤️' : '⭐';
    setBoard(nextBoard);
    setIsXNext(!isXNext);

    const winResult = calculateWinner(nextBoard);
    if (winResult) {
      setWinner(winResult.winner);
      setWinningLine(winResult.line);
      addCoins(20);
      toast.success(`${winResult.winner} Ganhou! +20 Love Coins!`);
      onComplete();
    } else if (nextBoard.every(sq => sq !== null)) {
      setWinner('draw');
      addCoins(5);
      toast.success("Empate! +5 Love Coins!");
      onComplete();
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="w-full max-sm mx-auto text-center space-y-10 py-6">
      <div className="space-y-4">
        <h4 className="text-4xl font-black text-black uppercase tracking-tighter italic">Jogo da Velha</h4>
        <p className="text-black/40 font-black uppercase text-[10px] tracking-widest leading-snug">Disputem no clássico veloz! Quem fechar a fileira ganha!</p>
      </div>

      <div className="flex justify-center items-center gap-6">
        <div className={`px-6 py-3 border-[3px] border-black rounded-2xl font-black uppercase italic text-xs tracking-widest transition-all shadow-[4px_4px_0px_0px_#000] ${isXNext ? 'bg-rose-400 rotate-2' : 'bg-white -rotate-2'}`}>
          Vez de: {isXNext ? '❤️ Coração' : '⭐ Estrela'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-[#fcf9f2] p-6 rounded-[3rem] border-[6px] border-black max-w-[320px] mx-auto aspect-square shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/5 rounded-full blur-2xl" />
        {board.map((cell, idx) => {
          const isWinning = winningLine?.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              className={`aspect-square bg-white hover:bg-[#fcf9f2] rounded-[1.2rem] border-[4px] border-black text-3xl flex items-center justify-center font-black cursor-pointer transition-all shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none ${
                isWinning ? 'bg-emerald-400 -translate-y-1 shadow-[6px_6px_0px_0px_#000]' : ''
              }`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pt-4"
          >
            <div className="bg-amber-100 border-[3px] border-black p-5 rounded-2xl shadow-[6px_6px_0px_0px_#000] inline-block">
               <p className="text-sm font-black uppercase italic tracking-widest text-[#e84e4e]">
                {winner === 'draw' ? 'Empate Romântico! 🤝' : `Vitória de: ${winner}! 🏆`}
              </p>
            </div>
            <button
              onClick={resetGame}
              className="w-full py-5 bg-black text-white text-xs font-black uppercase italic tracking-[0.2em] rounded-2xl border-[4px] border-black shadow-[8px_8px_0px_0px_#e84e4e] hover:-translate-y-1 active:translate-y-1 transition-all cursor-pointer"
            >
              Reiniciar Partida 🔄
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================
   7. 🃏 JOGO: JOGO DA MEMÓRIA
   ========================================== */
const MEMORY_ICONS = ['❤️', '⭐', '💍', '🍫', '🌹', '📸', '🎵', '🧁'];

function MemoryGame({ onComplete, addCoins }: { onComplete: (pairs: number, moves: number) => void; addCoins: (amount: number) => void }) {
  const [deck, setDeck] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initDeck();
  }, []);

  const initDeck = () => {
    const combined = [...MEMORY_ICONS, ...MEMORY_ICONS].sort(() => 0.5 - Math.random());
    setDeck(combined);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleTileClick = (idx: number) => {
    if (flipped.includes(idx) || matched.includes(idx) || flipped.length >= 2) return;

    const nextFlipped = [...flipped, idx];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = nextFlipped;
      if (deck[first] === deck[second]) {
        setTimeout(() => {
          const nextMatched = [...matched, first, second];
          setMatched(nextMatched);
          setFlipped([]);
          addCoins(10); 
          if (nextMatched.length === deck.length) {
            toast.success("Memória Incrível! +50 Love Coins!");
            addCoins(40);
            onComplete(8, moves + 1);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-10 py-6">
      <div className="space-y-4">
        <h4 className="text-4xl font-black text-black uppercase tracking-tighter italic">Jogo da Memória</h4>
        <p className="text-black/40 font-black uppercase text-[10px] tracking-widest leading-snug">Encontre os pares românticos e prove sua conexão mental!</p>
      </div>

      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-black/40 px-4 italic mb-2">
        <span>{moves} JOGADAS</span>
        <span className="text-rose-500">{matched.length / 2} / 8 PARES</span>
      </div>

      <div className="grid grid-cols-4 gap-3 bg-[#fcf9f2] p-5 rounded-[3rem] border-[6px] border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative">
        {deck.map((icon, idx) => {
          const isOpen = flipped.includes(idx) || matched.includes(idx);
          const isMatch = matched.includes(idx);

          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              className={`aspect-square rounded-2xl border-[3px] border-black flex items-center justify-center text-2xl transition-all cursor-pointer shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none ${
                isOpen 
                  ? isMatch 
                    ? 'bg-rose-400 rotate-0' 
                    : 'bg-white shadow-[4px_4px_0px_0px_#000]'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {isOpen ? icon : '?'}
            </button>
          );
        })}
      </div>

      <div className="pt-4">
        <button
          onClick={initDeck}
          className="w-full py-5 bg-black text-white text-xs font-black uppercase italic tracking-[0.2em] rounded-2xl border-[4px] border-black shadow-[8px_8px_0px_0px_#4ade80] hover:-translate-y-1 active:translate-y-1 transition-all cursor-pointer"
        >
          🔄 Recomeçar Jogo
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   8. 🐍 JOGO: LOVE SNAKE
   ========================================== */
function LoveSnakeGame({ onComplete, addCoins }: { onComplete: (score: number) => void; addCoins: (amount: number) => void }) {
  const [snake, setSnake] = useState<[number, number][]>([[10, 10]]);
  const [food, setFood] = useState<[number, number]>([5, 5]);
  const [direction, setDirection] = useState<[number, number]>([0, -1]); 
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameInterval = useRef<any>(null);

  const GRID_SIZE = 20;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      switch (e.key) {
        case 'ArrowUp':
          if (direction[1] !== 1) setDirection([0, -1]);
          break;
        case 'ArrowDown':
          if (direction[1] !== -1) setDirection([0, 1]);
          break;
        case 'ArrowLeft':
          if (direction[0] !== 1) setDirection([-1, 0]);
          break;
        case 'ArrowRight':
          if (direction[0] !== -1) setDirection([1, 0]);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPlaying, gameOver]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameInterval.current = setInterval(moveSnake, 180);
    } else {
      if (gameInterval.current) clearInterval(gameInterval.current);
    }
    return () => {
      if (gameInterval.current) clearInterval(gameInterval.current);
    };
  }, [snake, direction, isPlaying, gameOver]);

  const moveSnake = () => {
    const head = snake[0];
    const newHead: [number, number] = [
      head[0] + direction[0],
      head[1] + direction[1]
    ];

    if (
      newHead[0] < 0 || newHead[0] >= GRID_SIZE ||
      newHead[1] < 0 || newHead[1] >= GRID_SIZE
    ) {
      triggerGameOver();
      return;
    }

    if (snake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
      triggerGameOver();
      return;
    }

    const nextSnake = [newHead, ...snake];

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore(prev => prev + 1);
      addCoins(10);
      toast.success("Coração coletado! +10 Love Coins!");
      generateFood(nextSnake);
    } else {
      nextSnake.pop();
    }

    setSnake(nextSnake);
  };

  const generateFood = (currentSnake: [number, number][]) => {
    let newFood: [number, number];
    do {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE)
      ];
    } while (currentSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));
    setFood(newFood);
  };

  const triggerGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
    toast.error(`Game Over! Você coletou ${score} corações!`);
    onComplete(score);
  };

  const startGame = () => {
    setSnake([[10, 10]]);
    setDirection([0, -1]);
    setScore(0);
    setGameOver(false);
    generateFood([[10, 10]]);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-10 py-6 select-none relative">
       <div className="space-y-4">
        <h4 className="text-4xl font-black text-black uppercase tracking-tighter italic leading-none">Cobra do Amor</h4>
        <div className="flex justify-between items-center bg-black text-white px-6 py-2 rounded-xl shadow-[4px_4px_0px_0px_#ff90e8]">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#4ade80]">Score</span>
          <span className="text-xl font-black italic">{score}</span>
        </div>
      </div>

      <div className="relative w-full aspect-square border-[6px] border-black bg-[#fcf9f2] rounded-[2.5rem] overflow-hidden p-0.5 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] max-w-[320px] mx-auto group">
        <div 
          className="w-full h-full relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {Array(GRID_SIZE * GRID_SIZE).fill(0).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);

            const isHead = snake[0][0] === x && snake[0][1] === y;
            const isBody = snake.slice(1).some(segment => segment[0] === x && segment[1] === y);
            const isFood = food[0] === x && food[1] === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full rounded transition-all duration-100 flex items-center justify-center ${
                  isHead 
                    ? 'bg-black scale-110 z-10' 
                    : isBody 
                      ? 'bg-rose-400 scale-95 opacity-80' 
                      : isFood 
                        ? 'bg-yellow-400 animate-pulse scale-105 z-10' 
                        : 'transparent border-[1px] border-black/5'
                }`}
              >
                {isHead && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                {isFood && <span className="text-[10px]">❤️</span>}
              </div>
            );
          })}
        </div>

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-8 space-y-6 backdrop-blur-sm z-30">
            {gameOver ? (
              <div className="space-y-2">
                <span className="text-5xl text-rose-500">💔</span>
                <p className="font-black text-white uppercase text-2xl italic tracking-tighter">Jogo Encerrado</p>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Corações: <strong>{score}</strong></p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-5xl">🐍</span>
                <p className="font-black text-white uppercase text-2xl italic tracking-tighter">Serpente do Amor</p>
              </div>
            )}
            
            <button
              onClick={startGame}
              className="w-full py-4 bg-[#4ade80] text-black border-[3px] border-black rounded-xl font-black uppercase italic text-xs tracking-widest shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 active:translate-y-1 transition-all cursor-pointer"
            >
              {gameOver ? 'Tentar de Novo' : 'Começar Jogada'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-[180px] mx-auto pt-2">
        <div/>
        <button onClick={() => { if (direction[1] !== 1) setDirection([0, -1]); }} className="bg-white border-[3px] border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none hover:bg-neutral-50 transition-all cursor-pointer">⬆️</button>
        <div/>
        <button onClick={() => { if (direction[0] !== 1) setDirection([-1, 0]); }} className="bg-white border-[3px] border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none hover:bg-neutral-50 transition-all cursor-pointer">⬅️</button>
        <button onClick={() => { if (direction[1] !== -1) setDirection([0, 1]); }} className="bg-white border-[3px] border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none hover:bg-neutral-50 transition-all cursor-pointer">⬇️</button>
        <button onClick={() => { if (direction[0] !== -1) setDirection([1, 0]); }} className="bg-white border-[3px] border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none hover:bg-neutral-50 transition-all cursor-pointer">➡️</button>
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 italic">Guie o amor com as setas!</p>
    </div>
  );
}
