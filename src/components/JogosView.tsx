import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, ArrowRight, Star, Trophy, Users, Heart, Plus, X, Camera, Sparkles, Trash2, ArrowLeft, Brain, Cpu, MessageCircle, Shield, Compass, Mail } from 'lucide-react';
import { PageLayout } from '../App';
import { MemoryGame } from './games/MemoryGame';
import { CoupleQuiz } from './games/CoupleQuiz';
import { WordSearch } from './games/WordSearch';
import { Battleship } from './games/Battleship';

import { TruthOrDareGame } from './games/TruthOrDareGame';
import { TicTacToeGame } from './games/TicTacToeGame';
import { StopGame } from './games/StopGame';
import { DailyFortuneGame } from './games/DailyFortuneGame';
import { CoupleMissionsGame } from './games/CoupleMissionsGame';
import { RelationshipJourneyGame } from './games/RelationshipJourneyGame';
import { FutureLettersGame } from './games/FutureLettersGame';

const CATEGORIES = [
  { id: 'memory', title: 'Memória Afetiva', icon: <Brain size={24} /> },
  { id: 'social', title: 'Interação Diária', icon: <Users size={24} /> },
  { id: 'exploration', title: 'Exploração do Universo', icon: <Compass size={24} /> },
  { id: 'casual', title: 'Casual e Conhecimento', icon: <Star size={24} /> },
  { id: 'strategy', title: 'Estratégia e Competição', icon: <Shield size={24} /> }
];

export const JogosView = ({ setView, user, partnerUid, gallery = [], sharedGames = [], onAddGame, onDeleteGame, onSaveDiary }: any) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('memory');
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [newGame, setNewGame] = useState({ title: '', desc: '', image: '' });

  const INTERNAL_GAMES = [
    { 
      id: 'memory', 
      categoryId: 'memory',
      title: "Memória Afetiva", 
      desc: "Reencontre nossos momentos nas cartas do tempo.", 
      icon: <Brain size={24} />,
      component: <MemoryGame photos={gallery.map((p: any) => p.url)} onFinish={(stats) => handleGameFinish('Memória Afetiva', stats)} />
    },
    { 
      id: 'quiz', 
      categoryId: 'casual',
      title: "Quiz do Casal", 
      desc: "Quanto você realmente sabe sobre nossa jornada?", 
      icon: <MessageCircle size={24} />,
      component: <CoupleQuiz onFinish={(stats) => handleGameFinish('Quiz do Casal', stats)} />
    },
    { 
      id: 'truth', 
      categoryId: 'social',
      title: "Verdade ou Desafio", 
      desc: "Revelações e dinâmicas divertidas para sair da rotina.", 
      icon: <Shield size={24} />,
      component: <TruthOrDareGame onFinish={(stats) => handleGameFinish('Verdade ou Desafio', stats)} />
    },
    { 
      id: 'stop', 
      categoryId: 'casual',
      title: "Stop do Casal", 
      desc: "A clássica Adedonha com as nossas categorias exclusivas.", 
      icon: <Star size={24} />,
      component: <StopGame onFinish={(stats) => handleGameFinish('Stop do Casal', stats)} />
    },
    { 
      id: 'tictactoe', 
      categoryId: 'casual',
      title: "Jogo da Velha", 
      desc: "O clássico atemporal com um toque de afeto.", 
      icon: <Gamepad2 size={24} />,
      component: <TicTacToeGame onFinish={(stats) => handleGameFinish('Jogo da Velha', stats)} />
    },
    { 
      id: 'words', 
      categoryId: 'casual',
      title: "Busca de Aura", 
      desc: "Caça-palavras com os termos do nosso universo.", 
      icon: <Sparkles size={24} />,
      component: <WordSearch onFinish={(stats) => handleGameFinish('Busca de Aura', stats)} />
    },
    { 
      id: 'battleship', 
      categoryId: 'strategy',
      title: "Marés Cruzadas", 
      desc: "Duelo estratégico em tempo real (Engineering Beta).", 
      icon: <Cpu size={24} />,
      component: <Battleship user={user} partnerUid={partnerUid} />
    },
    {
      id: 'fortune',
      categoryId: 'exploration',
      title: "Sorte do Dia",
      desc: "Consulte o universo e receba uma mini interação diária.",
      icon: <Sparkles size={24} />,
      component: <DailyFortuneGame onFinish={(stats) => handleGameFinish('Sorte do Dia', stats)} />
    },
    {
      id: 'missions',
      categoryId: 'social',
      title: "Missões do Casal",
      desc: "Desafios diários para manter a chama acesa.",
      icon: <Heart size={24} />,
      component: <CoupleMissionsGame onFinish={(stats) => handleGameFinish('Missões do Casal', stats)} />
    },
    {
      id: 'journey',
      categoryId: 'exploration',
      title: "Jornada do Relacionamento",
      desc: "Explore um mundo onde suas decisões moldam o destino.",
      icon: <Compass size={24} />,
      component: <RelationshipJourneyGame onFinish={(stats) => handleGameFinish('Jornada do Relacionamento', stats)} />
    },
    {
      id: 'future',
      categoryId: 'exploration',
      title: "Cartas do Futuro",
      desc: "Eternize uma mensagem para abrirem depois de anos.",
      icon: <Mail size={24} />,
      component: <FutureLettersGame onFinish={(stats) => handleGameFinish('Cartas do Futuro', stats)} />
    }
  ];

  const handleGameFinish = async (gameName: string, stats: any) => {
    console.log(`Finished ${gameName} with stats:`, stats);
    if (onSaveDiary) {
      await onSaveDiary({
        title: `Vitória no ${gameName}!`,
        content: `Acabamos de completar o jogo ${gameName}! Estatísticas: ${JSON.stringify(stats)}. Mais uma memória para o nosso universo.`,
        game: gameName,
        stats: stats
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGame.title && newGame.image) {
      onAddGame(newGame);
      setNewGame({ title: '', desc: '', image: '' });
      setIsAddingGame(false);
    }
  };

  if (activeGame) {
    const game = INTERNAL_GAMES.find(g => g.id === activeGame);
    return (
      <PageLayout title={game?.title} subtitle="Premium" onNavigate={setView} currentView={`jogos > ${game?.title}`}>
        <div className="w-full max-w-5xl mx-auto px-4 py-20 min-h-screen">
          <button 
            onClick={() => setActiveGame(null)}
            className="flex items-center gap-4 text-white/40 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest mb-20 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Voltar ao Átrio
          </button>
          {game?.component}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Level Up no" 
      subtitle="Amor" 
      description="Nossas dimensões de lazer. Onde a competição é secundária e o afeto é o prêmio final."
      onNavigate={setView}
      currentView="jogos"
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-20">
        
        {/* Section 1: Multi-Interative Games */}
        <div className="mb-48 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
             <div className="max-w-xl">
                <div className="flex items-center gap-4 mb-8">
                  <Gamepad2 size={16} className="text-[var(--primary)] animate-pulse" />
                  <span className="text-[var(--primary)] font-sans text-[11px] font-semibold uppercase tracking-[0.4em] opacity-80 decoration-[var(--primary)] underline-offset-4 line-through">Dimensões Jogáveis</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-editorial text-white tracking-tighter italic leading-[0.9] text-glow-premium drop-shadow-2xl">Aura do <br /><span className="text-[var(--primary)]/90 drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]">Labirinto.</span></h2>
             </div>
             <div className="flex items-center gap-4 text-white/50 font-sans font-medium text-[10px] md:text-xs uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 rounded-full shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent pointer-events-none" />
                <Cpu size={14} className="text-[var(--primary)] animate-pulse relative z-10" />
                <span className="relative z-10">Integração em Tempo Real</span>
             </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-4 mb-16 px-2 py-2 glass-card rounded-full w-fit">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative flex items-center justify-center px-8 py-3.5 rounded-full font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-500 overflow-hidden ${
                  activeCategory === category.id
                    ? 'text-[var(--bg)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]'
                    : 'text-white/50 hover:text-white/90'
                }`}
              >
                {activeCategory === category.id && (
                  <motion.div 
                    layoutId="activeCategoryBg"
                    className="absolute inset-0 bg-[var(--primary)] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {category.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14"
            >
              {INTERNAL_GAMES.filter(g => g.categoryId === activeCategory).map((game: any) => (
                <motion.button
                  key={game.id}
                  whileHover={{ y: -12, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveGame(game.id)}
                  className="luxury-card p-12 md:p-16 text-left group relative overflow-hidden flex flex-col justify-between min-h-[450px] shadow-xl hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)]"
                >
                  <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:opacity-10 transition-all duration-1000 group-hover:scale-125 rotate-12 drop-shadow-[0_0_15px_var(--primary)]">
                     {game.icon}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/50 mb-12 shadow-sm group-hover:bg-[var(--primary)]/10 group-hover:border-[var(--primary)]/30 group-hover:text-[var(--primary)] transition-all duration-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--primary)]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative z-10">{game.icon}</div>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-editorial text-white italic tracking-tight leading-tight mb-6 group-hover:text-glow-premium transition-all duration-700 drop-shadow-md">
                      {game.title}
                    </h3>
                    
                    <p className="text-white/50 font-sans font-light text-xl md:text-2xl leading-relaxed max-w-md drop-shadow-sm flex-grow">
                      "{game.desc}"
                    </p>
                  </div>

                  <div className="relative z-10 pt-12 flex items-center gap-4 text-[var(--primary)] font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                     Explorar Dimensão <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Section 3: Hall of Fame (Achievements) */}
        <div className="mb-48">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
             <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Star size={18} className="text-[var(--primary)]" />
                  <span className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-[0.5em] opacity-80">Reconhecimento</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-serif text-white tracking-tighter italic leading-none">Galeria de <br /><span className="text-glow">Vezes.</span></h2>
             </div>
             
             <div className="flex items-center gap-6">
                <div className="text-right">
                   <p className="text-white/20 font-mono text-[9px] uppercase tracking-widest mb-1">Status Global</p>
                   <p className="text-[var(--primary)] font-serif italic text-2xl">Lendário</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-[var(--primary)]/30 flex items-center justify-center text-[var(--primary)] animate-pulse">
                   <Trophy size={20} />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { id: 'quiz_master', title: 'Mestre do Quiz', desc: 'Acertou 100% das perguntas sobre nós.', icon: <MessageCircle /> },
              { id: 'memory_pro', title: 'Mestre da Memória', desc: 'Resgatou lembranças em tempo recorde.', icon: <Brain /> },
              { id: 'waves_commander', title: 'Comandante de Marés', desc: 'Derrotou o oponente em Batalha Naval.', icon: <Shield /> },
              { id: 'sintonia_alpha', title: 'Sintonia Alpha', desc: 'Cinco partidas seguidas sem erros.', icon: <Heart /> },
            ].map((badge, idx) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="luxury-glass p-8 rounded-[3rem] border border-white/5 text-center group cursor-help relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500">
                  {badge.icon}
                </div>
                <h4 className="text-xl font-serif italic text-white mb-2">{badge.title}</h4>
                <p className="text-[10px] font-serif text-white/30 italic leading-snug">{badge.desc}</p>
                
                {/* Achievement Glow */}
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[var(--primary)] blur-2xl opacity-20" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 4: Shared Adventures */}
        <div className="mb-48">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
             <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy size={18} className="text-[var(--primary)]" />
                  <span className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-[0.5em] opacity-80">Capítulo 02</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-serif text-white tracking-tighter italic leading-none">Mundos <br /><span className="text-glow">Vividos.</span></h2>
             </div>
             
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setIsAddingGame(true)}
               className="px-10 py-6 bg-white text-black rounded-full font-mono text-[10px] uppercase tracking-[0.4em] font-bold shadow-4xl hover:bg-[var(--primary)] hover:text-white transition-all flex items-center gap-4"
             >
               <Plus size={16} /> Expandir Universo
             </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sharedGames.map((game: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[600px] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none" />
                <img src={game.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0" alt={game.title} />
                
                {onDeleteGame && game.id && (
                  <button 
                    onClick={() => onDeleteGame(game.id)}
                    className="absolute top-8 right-8 z-30 opacity-0 group-hover:opacity-100 p-4 text-white/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all"
                  >
                    <Trash2 size={24} />
                  </button>
                )}

                <div className="absolute inset-0 z-20 p-12 flex flex-col justify-end pointer-events-none">
                   <div className="translate-y-12 group-hover:translate-y-0 transition-transform duration-700 pointer-events-auto">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-8 h-[1px] bg-[var(--primary)]" />
                         <span className="text-[var(--primary)] font-mono text-[9px] uppercase tracking-[0.5em]">Relatório de Missão</span>
                      </div>
                      <h4 className="text-4xl md:text-5xl font-serif italic text-white mb-6 group-hover:text-glow transition-all">{game.title}</h4>
                      <p className="text-white/40 font-serif italic text-xl leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                         "{game.desc}"
                      </p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-40 text-center">
           <motion.div
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="relative inline-block"
           >
              <div className="absolute inset-0 bg-[var(--primary)] blur-[150px] opacity-10 animate-pulse" />
              <div className="relative luxury-glass p-20 rounded-[5rem] border border-white/5 shadow-extreme group overflow-hidden">
                 <Heart size={100} className="text-[var(--primary)] mx-auto mb-10 group-hover:scale-125 transition-transform duration-1000" />
                 <h2 className="text-5xl md:text-8xl font-serif italic text-white tracking-tighter leading-none mb-12 relative z-10">
                   Vencendo <br />
                   <span className="text-[var(--primary)] text-glow">Juntos.</span>
                 </h2>
                 
                 <p className="text-white/40 font-serif text-2xl italic max-w-xl mx-auto mb-16 relative z-10 leading-relaxed">
                   "Não importa o quão difícil seja o boss final, contanto que meu player 2 seja você."
                 </p>

                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setView('home')}
                   className="relative px-12 py-6 bg-white text-black rounded-full font-mono text-[10px] uppercase tracking-[0.5em] font-bold shadow-4xl hover:bg-[var(--primary)] hover:text-white transition-all z-10 flex items-center gap-6 mx-auto"
                 >
                   Fim da Partida <ArrowRight size={16} />
                 </motion.button>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Add Game Modal */}
      <AnimatePresence>
        {isAddingGame && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingGame(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative z-10 w-full max-w-2xl luxury-glass border border-white/5 rounded-[4rem] p-12 md:p-20 shadow-extreme"
            >
              <button 
                onClick={() => setIsAddingGame(false)}
                className="absolute top-10 right-10 text-white/20 hover:text-rose-500 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-12 text-left">
                <span className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-[0.8em] mb-6 block">Cartografando Memórias</span>
                <h3 className="text-5xl font-serif italic text-white leading-none">Novo Jogo</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4 text-left">
                  <label className="text-white/30 font-mono text-[9px] uppercase tracking-widest pl-4">Título do Jogo</label>
                  <input 
                    required 
                    value={newGame.title}
                    onChange={(e) => setNewGame({...newGame, title: e.target.value})}
                    placeholder="Ex: League of Legends"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] px-8 py-6 text-white text-xl focus:border-[var(--primary)] outline-none transition-all placeholder:text-white/5" 
                  />
                </div>
                <div className="space-y-4 text-left">
                  <label className="text-white/30 font-mono text-[9px] uppercase tracking-widest pl-4">Descrição Curta</label>
                  <input 
                    required 
                    value={newGame.desc}
                    onChange={(e) => setNewGame({...newGame, desc: e.target.value})}
                    placeholder="O que jogamos juntos..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] px-8 py-6 text-white text-xl focus:border-[var(--primary)] outline-none transition-all placeholder:text-white/5" 
                  />
                </div>
                <div className="space-y-4 text-left">
                  <label className="text-white/30 font-mono text-[9px] uppercase tracking-widest pl-4">Capa do Jogo (URL)</label>
                  <div className="relative">
                    <input 
                      required 
                      value={newGame.image}
                      onChange={(e) => setNewGame({...newGame, image: e.target.value})}
                      placeholder="Cole a URL da imagem aqui..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] px-8 py-6 text-white text-xl pr-16 focus:border-[var(--primary)] outline-none transition-all placeholder:text-white/5" 
                    />
                    <Camera className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[var(--primary)] py-8 rounded-[2rem] text-white font-bold text-xs uppercase tracking-[0.5em] shadow-extreme hover:scale-[1.02] active:scale-98 transition-all">
                  Sincronizar Universo
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};
