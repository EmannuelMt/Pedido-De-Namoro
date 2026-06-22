import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  MessageCircle, 
  ImageIcon, 
  Star, 
  Play,
  Plus,
  Smile,
  Heart,
  Compass,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

// Types
import { Moment, Achievement } from '../types';

// Components
import { HistoryHeader } from '../components/history/HistoryHeader';
import { HistoryChapterCard } from '../components/history/HistoryChapterCard';
import { HistoryAchievementPanel } from '../components/history/HistoryAchievementPanel';
import { ChapterOverlay, NewMomentOverlay, HistoryCinemaMode } from '../components/history/HistoryModals';

const DEFAULT_MOMENTS: Moment[] = [
  {
    id: 'm1',
    chapterId: 1,
    title: 'O Primeiro Olhar',
    date: '12/10/2023',
    description: 'Tudo começou em uma tarde chuvosa no balcão da cafeteria. Nossos olhares se cruzaram enquanto ríamos sem querer de um casal que derrubou os casacos.',
    location: 'Café das Artes ☕',
    music: 'Conversas de Outono',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    emotion: '🥹',
    isPrivate: false
  },
  {
    id: 'm2',
    chapterId: 2,
    title: 'Desculpa do Guarda-chuva',
    date: '14/10/2023',
    description: 'Uma conversa desajeitada sobre um guarda-chuva de gatinhos esquecido na mesa que uniu nosso caminho.',
    location: 'Rua das Flores 🌸',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600',
    emotion: '😂',
    isPrivate: false,
    chatLines: [
      { sender: 'Voce', text: 'Ei! Acho que você esqueceu esse guarda-chuva de gatinhos atrás...' },
      { sender: 'Himesama', text: 'Meu Deus! Sim, esqueci! É meu preferido de estimação! 🙀 Obrigada!' },
      { sender: 'Voce', text: 'De nada! Mas agora você me deve indicar um café gostoso sem chuvas.' },
      { sender: 'Himesama', text: 'Hahaha feito! É um encontro então! 😊💖' }
    ]
  },
  {
    id: 'm3',
    chapterId: 3,
    title: 'Primeiro Encontro Real',
    date: '20/10/2023',
    description: 'Passeamos pelo mirante com um vento congelante. Você me abraçou por trás tão forte para se aquecer que esquecemos do frio.',
    location: 'Mirante dos Apaixonados 🌅',
    image: 'https://images.unsplash.com/photo-1494972308805-463bc619b34e?auto=format&fit=crop&q=80&w=600',
    emotion: '❤️',
    isPrivate: false
  },
  {
    id: 'm4',
    chapterId: 4,
    title: 'Amor Que Cresce',
    date: '15/01/2024',
    description: 'Nosso piquenique no jardim botânico. As formigas comeram metade dos bolos, mas as risadas sob o sol compensaram tudo.',
    location: 'Jardim Botânico 🌳',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    emotion: '😊',
    isPrivate: false
  },
  {
    id: 'm5',
    chapterId: 5,
    title: 'Nosso Lar dos Sonhos',
    date: 'Previsão: 2027',
    description: 'Uma casinha calma com floreiras de girassol na janela, uma gatinha dormindo no tapete e muito amor.',
    location: 'Nosso Futuro ✨',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600',
    emotion: '🌟',
    isPrivate: false
  }
];

const EMOTIONS = [
  { sub: '😊', label: 'Feliz', bg: 'bg-emerald-400 text-black border-black shadow-[4px_4px_0px_0px_#000]' },
  { sub: '❤️', label: 'Amor', bg: 'bg-rose-400 text-black border-black shadow-[4px_4px_0px_0px_#000]' },
  { sub: '😂', label: 'Engraçado', bg: 'bg-amber-400 text-black border-black shadow-[4px_4px_0px_0px_#000]' },
  { sub: '🥹', label: 'Especial', bg: 'bg-indigo-400 text-white border-black shadow-[4px_4px_0px_0px_#000]' },
  { sub: '🌟', label: 'Inesquecível', bg: 'bg-cyan-400 text-black border-black shadow-[4px_4px_0px_0px_#000]' }
];

export function Historia() {
  // Data State
  const [moments, setMoments] = useState<Moment[]>(() => {
    const saved = localStorage.getItem('consto_moments');
    return saved ? JSON.parse(saved) : DEFAULT_MOMENTS;
  });

  const [achievements, setAchievements] = useState<any[]>(() => {
    const saved = localStorage.getItem('consto_achievements');
    const defaultAch = [
      { id: 'first_page', title: 'Primeira Página', desc: 'Abriu o primeiro capítulo do nosso livro', icon: '📖', done: false },
      { id: 'love_writer', title: 'Cronista Real', desc: 'Adicionou uma nova memória customizada', icon: '✍️', done: false },
      { id: 'ten_memories', title: 'Lote de Ouro', desc: 'Chegou à marca de 10 memórias registradas', icon: '💎', done: false },
      { id: 'directors_cut', title: 'Cineasta', desc: 'Assistiu ao filme da nossa história', icon: '🎬', done: false },
      { id: 'eternal', title: 'Para Sempre', desc: 'Ativou todos os capítulos da jornada', icon: '💖', done: false }
    ];
    if (saved) {
      const parsed = JSON.parse(saved);
      return defaultAch.map(a => {
        const found = parsed.find((p: any) => p.id === a.id);
        return found ? { ...a, done: found.done } : a;
      });
    }
    return defaultAch;
  });

  // UI State
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('todos');
  const [movieMode, setMovieMode] = useState(false);
  const [movieIndex, setMovieIndex] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [bookPage, setBookPage] = useState(0);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toLocaleDateString('pt-BR'));
  const [newDesc, setNewDesc] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newMusic, setNewMusic] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newEmotion, setNewEmotion] = useState('❤️');
  const [newPrivate, setNewPrivate] = useState(false);
  const [newTargetChapter, setNewTargetChapter] = useState(1);
  const [chatInputs, setChatInputs] = useState<any[]>([{ sender: 'Voce', text: '' }]);

  // Effects
  useEffect(() => {
    localStorage.setItem('consto_moments', JSON.stringify(moments));
    
    // Auto calculate achievements
    const updatedAch = achievements.map(ach => {
      if (ach.id === 'ten_memories' && moments.length >= 10) return { ...ach, done: true };
      const hasAll = [1,2,3,4,5].every(n => moments.some(m => m.chapterId === n));
      if (ach.id === 'eternal' && hasAll) return { ...ach, done: true };
      return ach;
    });
    
    if (JSON.stringify(updatedAch) !== JSON.stringify(achievements)) {
      setAchievements(updatedAch);
      localStorage.setItem('consto_achievements', JSON.stringify(updatedAch));
    }
  }, [moments]);

  // Handlers
  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, done: true } : a);
      localStorage.setItem('consto_achievements', JSON.stringify(updated));
      return updated;
    });
  };

  const handleOpenChapter = (num: number) => {
    setActiveChapter(num);
    setBookPage(0);
    if (num === 1) unlockAchievement('first_page');
  };

  const handleSaveMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) {
      toast.error('Preencha os campos essenciais! ✍️');
      return;
    }

    const newMoment: Moment = {
      id: 'custom_' + Date.now(),
      chapterId: newTargetChapter,
      title: newTitle,
      date: newDate,
      description: newDesc,
      location: newLoc || 'Lugar do Nosso Jeito 📍',
      music: newMusic,
      image: newImage || null,
      emotion: newEmotion,
      isPrivate: newPrivate,
      chatLines: newTargetChapter === 2 ? chatInputs.filter(c => c.text !== '') : undefined
    };

    setMoments(prev => [...prev, newMoment]);
    unlockAchievement('love_writer');
    setAddOpen(false);
    toast.success('Página publicada com sucesso! 📖');
    
    // Reset Form
    setNewTitle(''); setNewDesc(''); setNewLoc(''); setNewMusic(''); setNewImage('');
    setChatInputs([{ sender: 'Voce', text: '' }]);
  };

  const handleDeleteMoment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Esquecer este fragmento de nós para sempre? 🥺')) return;
    setMoments(prev => prev.filter(m => m.id !== id));
    toast.success('Lembrança removida.');
  };

  const handleLikeMoment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMoments(prev => prev.map(m => m.id === id ? { ...m, title: m.title.includes('❤️') ? m.title : m.title + ' ❤️' } : m));
    toast.success('Favoritado! ❤️');
  };

  const filteredMoments = moments.filter(m => selectedEmotion === 'todos' || m.emotion === selectedEmotion);

  return (
    <div className="min-h-screen bg-stone-50 pb-24 relative selection:bg-purple-200">
      
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-32 py-12 relative z-10">
        
        <section>
          <HistoryHeader totalMoments={moments.length} />
        </section>

        {/* Action Bar & Filter Section */}
        <section className="space-y-12 pt-24 border-t-[4px] border-black">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 bg-[#fcf9f2] border-[6px] border-black p-10 md:p-14 rounded-[4rem] shadow-[24px_24px_0px_0px_#000] w-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff90e8]/10 rounded-full blur-[80px] group-hover:bg-[#ff90e8]/20 transition-all pointer-events-none" />
            
            <div className="space-y-8 w-full relative z-10">
              <div className="inline-flex items-center gap-3 bg-amber-400 border-[4px] border-black px-6 py-3 rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] -rotate-1">
                <Smile className="w-8 h-8 text-black" strokeWidth={3} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black">Filtrar Vibrações</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-black italic">
                Pulsos da <br /> <span className="bg-[#ff90e8] px-5 py-2 border-[5px] border-black inline-block mt-3 rotate-1 transform-gpu shadow-[8px_8px_0px_0px_#000]">Memória</span>
              </h2>
              <div className="flex flex-wrap gap-5 pt-4">
                 <button 
                   onClick={() => setSelectedEmotion('todos')} 
                   className={`px-8 py-5 border-[4px] border-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-none cursor-pointer ${selectedEmotion === 'todos' ? 'bg-black text-white shadow-[8px_8px_0px_0px_#ff90e8]' : 'bg-white text-black shadow-[6px_6px_0px_0px_#000]'}`}
                 >
                   Todas ({moments.length})
                 </button>
                 {EMOTIONS.map(e => (
                   <button 
                     key={e.sub} 
                     onClick={() => setSelectedEmotion(e.sub)} 
                     className={`px-8 py-5 border-[4px] border-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-4 hover:-translate-y-1 active:translate-y-1 active:shadow-none cursor-pointer ${selectedEmotion === e.sub ? 'bg-indigo-500 text-white shadow-[8px_8px_0px_0px_#000]' : 'bg-white text-black shadow-[6px_6px_0px_0px_#000]'}`}
                   >
                      <span className="text-2xl">{e.sub}</span> <span>{e.label}</span>
                   </button>
                 ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 shrink-0 w-full lg:w-auto mt-6 lg:mt-0 relative z-10">
               <button 
                 onClick={() => { setMovieMode(true); setMovieIndex(0); unlockAchievement('directors_cut'); }} 
                 className="flex-1 lg:flex-none justify-center bg-cyan-400 text-black border-[5px] border-black px-14 py-10 rounded-[3rem] font-black uppercase italic text-sm tracking-[0.2em] shadow-[12px_12px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-5 cursor-pointer group"
               >
                 <Play className="w-10 h-10 fill-black group-hover:scale-110 transition-transform" strokeWidth={3} /> Cine História
               </button>
               <button 
                 onClick={() => setAddOpen(true)} 
                 className="flex-1 lg:flex-none justify-center bg-black text-white border-[5px] border-black px-14 py-10 rounded-[3rem] font-black uppercase italic text-sm tracking-[0.2em] shadow-[12px_12px_0px_0px_#ff90e8] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_#ff90e8] active:translate-y-1 active:shadow-none transition-all flex items-center gap-5 cursor-pointer group"
               >
                 <Plus className="w-10 h-10 text-[#ff90e8] group-hover:rotate-90 transition-transform" strokeWidth={5} /> Registrar
               </button>
            </div>
          </div>
        </section>

        {/* Chapters Section */}
        <section className="space-y-16 pt-24 border-t-[4px] border-black">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-rose-400 border-[4px] border-black px-6 py-3 rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] rotate-1">
               <BookOpen className="w-8 h-8 text-black" strokeWidth={3} />
               <span className="text-xs font-black uppercase tracking-[0.2em] text-black">Antologia Sagrada</span>
            </div>
            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none text-black italic">
              Os Capítulos <br /> <span className="bg-white px-5 py-2 border-[6px] border-black inline-block mt-4 -rotate-1 transform-gpu shadow-[12px_12px_0px_0px_#000]">Deste Livro</span>
            </h2>
            <p className="font-sans text-2xl text-black/40 font-bold max-w-3xl leading-tight">
              Cada seção guarda fragmentos de uma realidade que construímos tijolo por tijolo, beijo por beijo. Nossa eternidade catalogada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
             <HistoryChapterCard 
                number="01" 
                title="O Despertar" 
                description="Onde as sementes foram plantadas e o sol brilhou primeiro. Nossa gênese."
                icon={BookOpen}
                color="purple"
                count={moments.filter(m => m.chapterId === 1).length}
                unit="Páginas"
                onClick={() => handleOpenChapter(1)}
             />
             <HistoryChapterCard 
                number="02" 
                title="Sussurros" 
                description="Registros de conversas capturadas no tempo. Palavras que nos uniram."
                icon={MessageCircle}
                color="rose"
                count={moments.filter(m => m.chapterId === 2).length}
                unit="Conversas"
                onClick={() => handleOpenChapter(2)}
             />
             <HistoryChapterCard 
                number="03" 
                title="Visões" 
                description="Capturas visuais em formato polaroid. Fragmentos coloridos da realidade."
                icon={ImageIcon}
                color="amber"
                count={moments.filter(m => m.chapterId === 3).length}
                unit="Polaroids"
                onClick={() => handleOpenChapter(3)}
             />
             <HistoryChapterCard 
                number="04" 
                title="A Árvore" 
                description="Linha do tempo suspendida. Cada marco é um novo galho florescendo."
                icon={Compass}
                color="emerald"
                count={moments.filter(m => m.chapterId === 4).length}
                unit="Marcos"
                onClick={() => handleOpenChapter(4)}
             />
             <HistoryChapterCard 
                number="05" 
                title="Destinos" 
                description="O mapa dos nossos sonhos. Para onde o vento nos levará amanhã."
                icon={Star}
                color="sky"
                count={moments.filter(m => m.chapterId === 5).length}
                unit="Desejos"
                onClick={() => handleOpenChapter(5)}
             />
             <HistoryChapterCard 
                number="∞" 
                title="O Templo" 
                description="O capítulo final onde todas as memórias convergem. Para os lendários."
                icon={Heart}
                color="stone"
                count={moments.length}
                unit="Total"
                isLocked={!achievements.find(a => a.id === 'eternal')?.done}
                onClick={() => achievements.find(a => a.id === 'eternal')?.done && handleOpenChapter(6)}
                isRelic
             />
          </div>
        </section>

        {/* Achievement Section */}
        <section className="space-y-16 pt-24 border-t-[4px] border-black">
          <HistoryAchievementPanel achievements={achievements} />
        </section>

        {/* Footer info Section */}
        <section className="pt-24 border-t-[4px] border-black pb-20 text-center">
           <div className="inline-flex items-center gap-4 bg-white border-[4px] border-black px-10 py-5 rounded-3xl shadow-[8px_8px_0px_0px_#000] rotate-1 group hover:-rotate-1 transition-transform">
              <Sparkles className="w-8 h-8 text-amber-500 animate-spin" strokeWidth={3} />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-black italic">Himesama & Consto • Forever Loop</span>
           </div>
        </section>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {activeChapter && (
          <ChapterOverlay 
            chapterId={activeChapter}
            moments={moments}
            onClose={() => setActiveChapter(null)}
            onAddMoment={() => { setActiveChapter(null); setAddOpen(true); }}
            onDeleteMoment={handleDeleteMoment}
            onLikeMoment={handleLikeMoment}
            bookPage={bookPage}
            setBookPage={setBookPage}
          />
        )}

        {addOpen && (
          <NewMomentOverlay 
            onClose={() => setAddOpen(false)}
            onSubmit={handleSaveMoment}
            title={newTitle} setTitle={setNewTitle}
            date={newDate} setDate={setNewDate}
            desc={newDesc} setDesc={setNewDesc}
            loc={newLoc} setLoc={setNewLoc}
            music={newMusic} setMusic={setNewMusic}
            image={newImage} setImage={setNewImage}
            emotion={newEmotion} setEmotion={setNewEmotion}
            isPrivate={newPrivate} setIsPrivate={setNewPrivate}
            targetChapter={newTargetChapter} setTargetChapter={setNewTargetChapter}
            chatInputs={chatInputs} setChatInputs={setChatInputs}
          />
        )}

        {movieMode && (
          <HistoryCinemaMode 
            moments={filteredMoments}
            currentIndex={movieIndex}
            onClose={() => setMovieMode(false)}
            onNext={() => setMovieIndex(p => (p + 1) % filteredMoments.length)}
            onPrev={() => setMovieIndex(p => (p - 1 + filteredMoments.length) % filteredMoments.length)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-12 right-12 z-40">
        <div className="bg-purple-600 text-white p-6 rounded-[32px] border-[5px] border-black shadow-[8px_8px_0px_0px_#000] rotate-12 transition-transform hover:scale-110 cursor-help">
          <BookOpen className="w-10 h-10" strokeWidth={4} />
        </div>
      </div>
    </div>
  );
}
