import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Calendar, 
  MapPin, 
  Music, 
  Sparkles,
  Heart,
  MessageCircle,
  ImageIcon,
  Plus,
  Trash2,
  Lock,
  Smile,
  Compass,
  Gift,
  Star as StarIcon,
  Search,
  User,
  Image as ImageIconLucide,
  Wand2
} from 'lucide-react';
import { Moment } from '../../types';

// Reuse Emotions from main page for consistency
const EMOTIONS = [
  { sub: '😊', label: 'Feliz', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  { sub: '❤️', label: 'Amor', bg: 'bg-purple-100 text-purple-700 border-purple-200 animate-pulse' },
  { sub: '😂', label: 'Engraçado', bg: 'bg-stone-50 text-stone-700 border-stone-200' },
  { sub: '🥹', label: 'Especial', bg: 'bg-violet-50 text-violet-700 border-violet-200' },
  { sub: '🌟', label: 'Inesquecível', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
];

interface ChapterModalProps {
  chapterId: number;
  onClose: () => void;
  moments: Moment[];
  onAddMoment: () => void;
  onDeleteMoment: (id: string, e: React.MouseEvent) => void;
  onLikeMoment: (id: string, e: React.MouseEvent) => void;
  bookPage: number;
  setBookPage: (p: number) => void;
}

export function ChapterOverlay({
  chapterId,
  onClose,
  moments,
  onAddMoment,
  onDeleteMoment,
  onLikeMoment,
  bookPage,
  setBookPage
}: ChapterModalProps) {
  
  const filteredMoments = moments.filter(m => m.chapterId === chapterId);

  // Layout selection based on Chapter ID
  const renderContent = () => {
    switch (chapterId) {
      case 1: return <StorybookView moments={filteredMoments} page={bookPage} setPage={setBookPage} onDelete={onDeleteMoment} onLike={onLikeMoment} onAdd={onAddMoment} />;
      case 2: return <ChatlogView moments={filteredMoments} onDelete={onDeleteMoment} onAdd={onAddMoment} />;
      case 3: return <PolaroidView moments={filteredMoments} onDelete={onDeleteMoment} onAdd={onAddMoment} />;
      case 4: return <TimelineTreeView moments={filteredMoments} onDelete={onDeleteMoment} onAdd={onAddMoment} />;
      case 5: return <ConstellationView moments={filteredMoments} onDelete={onDeleteMoment} onAdd={onAddMoment} />;
      default: return null;
    }
  };

  const getChapterTitle = () => {
    switch (chapterId) {
      case 1: return "O Começo de Tudo";
      case 2: return "Primeiras Conversas";
      case 3: return "Álbum de Polaroids";
      case 4: return "Nossa Linha do Tempo";
      case 5: return "Céu de Sonhos";
      default: return "Memórias Guardadas";
    }
  };

  const getChapterThemeColor = () => {
    switch (chapterId) {
      case 1: return "bg-indigo-400 text-white";
      case 2: return "bg-rose-400 text-black";
      case 3: return "bg-amber-400 text-black";
      case 4: return "bg-emerald-400 text-black";
      case 5: return "bg-cyan-400 text-black";
      default: return "bg-stone-50 text-black";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-stone-900/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 30 }}
        className="bg-white border-[6px] border-black rounded-[4rem] shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col relative"
      >
        {/* Modal Header */}
        <div className={`${getChapterThemeColor()} border-b-[6px] border-black p-8 md:p-10 flex items-center justify-between gap-6`}>
           <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white border-[4px] border-black rounded-[2rem] flex items-center justify-center shadow-[6px_6px_0px_0px_#000] rotate-3 shrink-0">
                 <BookOpen className="w-10 h-10 text-black" strokeWidth={3} />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">{getChapterTitle()}</h2>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
                   <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Fragmento #{chapterId}</span>
                </div>
              </div>
           </div>
           
           <button 
             onClick={onClose}
             className="bg-black text-white p-4 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-[6px_6px_0px_0px_#ff90e8] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
           >
             <X className="w-10 h-10" strokeWidth={4} />
           </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- SUB-VIEWS FOR EACH CHAPTER ---

function StorybookView({ moments, page, setPage, onDelete, onLike, onAdd }: any) {
  if (moments.length === 0) return <EmptyState onAdd={onAdd} text="Nenhuma página escrita neste livro..." />;
  
  const current = moments[page] || moments[0];
  
  return (
    <div className="h-full flex flex-col md:flex-row divide-y-4 md:divide-y-0 md:divide-x-4 divide-black/10">
      {/* Left Page: Illustration/Image */}
      <div className="md:w-[45%] p-8 bg-stone-50 flex flex-col justify-center gap-8 overflow-y-auto">
        <div className="aspect-[4/5] border-[4px] border-black rounded-[32px] overflow-hidden shadow-[12px_12px_0px_0px_#000] relative rotate-1 group">
           {current.image ? (
             <img src={current.image} className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-700 hover:scale-110" alt="Memory" referrerPolicy="no-referrer" />
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50 text-amber-200">
                <ImageIconLucide className="w-20 h-20" strokeWidth={1} />
                <span className="text-[10px] font-black uppercase tracking-widest mt-2">Sem Captura Visual</span>
             </div>
           )}
           <div className="absolute top-6 left-6 -rotate-6">
              <span className="bg-white border-2 border-black px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">
                {current.emotion} SCENE
              </span>
           </div>
        </div>
        
        <div className="space-y-4 px-4 font-serif italic text-stone-500 text-center">
           <p className="text-xl font-bold leading-tight">"{current.title}"</p>
        </div>
      </div>

      {/* Right Page: Text/Action */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-between gap-12 overflow-y-auto bg-white">
        <div className="space-y-10">
          <div className="space-y-4 relative">
            <div className="absolute -left-10 top-0 text-7xl text-purple-100 select-none opacity-50">“</div>
            <p className="text-lg md:text-2xl font-bold leading-relaxed text-stone-700 italic relative z-10">
              {current.description}
            </p>
            <div className="flex flex-wrap gap-6 pt-6">
               <div className="flex items-center gap-2 bg-purple-50 border-2 border-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#000]">
                  <Calendar className="w-4 h-4 text-purple-500" /> {current.date}
               </div>
               <div className="flex items-center gap-2 bg-purple-50 border-2 border-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#000]">
                  <MapPin className="w-4 h-4 text-purple-500" /> {current.location}
               </div>
            </div>
          </div>

          <div className="bg-stone-50 border-[3px] border-black p-6 rounded-[24px] shadow-[6px_6px_0px_0px_#000] rotate-1">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xl border-[3px] border-white shadow-lg">
                  {current.emotion}
               </div>
               <div>
                  <span className="block text-[9px] font-black uppercase tracking-widest text-stone-400 mb-0.5">Filiação Sentimental</span>
                  <p className="text-xs font-black uppercase">{EMOTIONS.find(e => e.sub === current.emotion)?.label || 'AMOR ETERNO'}</p>
               </div>
             </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-8 border-t-[3px] border-black/5">
          <div className="flex items-center gap-4">
             <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-4 bg-stone-100 border-[3px] border-black rounded-2xl hover:bg-white disabled:opacity-30 transition-all cursor-pointer">
                <ChevronLeft className="w-6 h-6" strokeWidth={4} />
             </button>
             <div className="text-[11px] font-black uppercase tracking-widest text-stone-400">PÁG {page + 1} / {moments.length}</div>
             <button onClick={() => setPage(Math.min(moments.length - 1, page + 1))} disabled={page >= moments.length - 1} className="p-4 bg-stone-100 border-[3px] border-black rounded-2xl hover:bg-white disabled:opacity-30 transition-all cursor-pointer">
                <ChevronRight className="w-6 h-6" strokeWidth={4} />
             </button>
          </div>
          
          <button onClick={(e) => onDelete(current.id, e)} className="p-3 text-stone-300 hover:text-rose-500 transition-colors">
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatlogView({ moments, onDelete, onAdd }: any) {
  if (moments.length === 0) return <EmptyState onAdd={onAdd} text="Nenhuma conversa eternizada..." />;
  return (
    <div className="h-full bg-[#f8f9fa] flex flex-col p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full space-y-12 pb-20">
        {moments.map((m: any) => (
          <div key={m.id} className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="h-[2px] flex-1 bg-black/10" />
               <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 bg-stone-100 px-3 py-1 border-2 border-black rounded-lg">💬 {m.date}</span>
               <div className="h-[2px] flex-1 bg-black/10" />
            </div>
            
            <div className="space-y-4">
              {m.chatLines?.map((chat: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: chat.sender === 'Voce' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className={`flex ${chat.sender === 'Voce' ? 'justify-end' : 'justify-start'}`}
                >
                   <div className={`max-w-[80%] p-5 border-[3px] border-black rounded-[24px] shadow-[4px_4px_0px_0px_#000] font-bold text-sm ${chat.sender === 'Voce' ? 'bg-purple-500 text-white rounded-tr-none' : 'bg-white text-black rounded-tl-none'}`}>
                      <div className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-2">{chat.sender === 'Voce' ? '🤴 Você' : '👸 Himesama'}</div>
                      <p className="leading-relaxed">{chat.text}</p>
                   </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
               <button onClick={(e) => onDelete(m.id, e)} className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:underline">Apagar Fragmento de Conversa</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-10">
         <button onClick={onAdd} className="bg-rose-500 text-white border-[4px] border-black px-8 py-4 rounded-full font-black uppercase italic shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-3">
           <Plus className="w-5 h-5" strokeWidth={4} /> Nova Fala do Coração
         </button>
      </div>
    </div>
  );
}

function PolaroidView({ moments, onDelete, onAdd }: any) {
  if (moments.length === 0) return <EmptyState onAdd={onAdd} text="O álbum está pedindo por fotos..." />;
  return (
    <div className="h-full bg-[#fcf9f2] p-8 md:p-12 overflow-y-auto">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pb-24">
         {moments.map((m: any, i: number) => (
           <motion.div 
             key={m.id}
             initial={{ rotate: i % 2 === 0 ? 2 : -2, scale: 0.9, opacity: 0 }}
             animate={{ rotate: i % 2 === 0 ? 1 : -1, scale: 1, opacity: 1 }}
             className="bg-white border-[4px] border-black p-5 rounded-lg shadow-[10px_10px_0px_0px_#000] space-y-5 group cursor-pointer hover:-translate-y-4 hover:rotate-0 transition-all duration-500"
           >
              <div className="aspect-square bg-stone-100 border-[3px] border-black rounded-sm overflow-hidden relative">
                {m.image ? (
                   <img src={m.image} className="w-full h-full object-cover grayscale-50 group-hover:grayscale-0 transition-all duration-700" alt="Moment" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-200"><ImageIcon className="w-16 h-16" /></div>
                )}
                <div className="absolute bottom-4 right-4 bg-white/90 border-2 border-black px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter">POLAROID FRAME</div>
              </div>
              <div className="space-y-2">
                 <h4 className="font-black italic uppercase text-lg leading-none truncate">{m.title}</h4>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#D88A9A]">
                    <span>📅 {m.date}</span>
                    <button onClick={(e) => onDelete(m.id, e)} className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                 </div>
              </div>
           </motion.div>
         ))}
       </div>
       <div className="fixed bottom-12 right-12 z-10">
         <button onClick={onAdd} className="bg-emerald-400 border-[4px] border-black p-6 rounded-full shadow-[8px_8px_0px_0px_#000] hover:-translate-y-2 hover:rotate-12 transition-all">
           <Plus className="w-8 h-8" strokeWidth={4} />
         </button>
       </div>
    </div>
  );
}

function TimelineTreeView({ moments, onDelete, onAdd }: any) {
  if (moments.length === 0) return <EmptyState onAdd={onAdd} text="Nenhuma semente plantada ainda..." />;
  return (
    <div className="h-full bg-sky-50/30 p-8 md:p-20 overflow-y-auto">
      <div className="max-w-4xl mx-auto relative border-l-[6px] border-black border-dashed pb-20 pl-12 space-y-20">
        {moments.map((m: any, i: number) => (
          <motion.div 
            key={m.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            {/* Timeline Connector Knot */}
            <div className="absolute -left-[54px] top-6 w-10 h-10 bg-white border-[4px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000] z-10">
               <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping" />
            </div>
            
            <div className="bg-white border-[4px] border-black p-10 rounded-[40px] shadow-[12px_12px_0px_0px_#000] space-y-6 relative group overflow-hidden">
               <div className="absolute top-0 right-0 py-6 px-10 bg-purple-100 border-l-[4px] border-b-[4px] border-black rounded-bl-[40px] text-[10px] font-black uppercase tracking-widest -translate-y-2 group-hover:translate-y-0 transition-transform">
                  FOLHA DE MEMÓRIA #{i+1}
               </div>
               
               <div className="space-y-2 pt-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500">EVENTO CRONOLÓGICO</div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic">{m.title}</h3>
                  <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-stone-400">
                     <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {m.date}</span>
                     <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {m.location}</span>
                  </div>
               </div>
               
               <p className="text-stone-600 font-bold leading-relaxed text-lg border-l-4 border-purple-200 pl-6 py-2">
                 "{m.description}"
               </p>

               <div className="flex justify-end pt-4">
                  <button onClick={(e) => onDelete(m.id, e)} className="text-stone-300 hover:text-red-500 transition-colors flex items-center gap-2 text-[10px] font-black uppercase">
                     Apagar Registro <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
        
        <div className="flex justify-center pt-10">
           <button onClick={onAdd} className="bg-black text-white border-[3px] border-white ring-[4px] ring-black px-10 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl">
             + Adicionar Marco na Linha
           </button>
        </div>
      </div>
    </div>
  );
}

function ConstellationView({ moments, onDelete, onAdd }: any) {
  if (moments.length === 0) return <EmptyState onAdd={onAdd} text="O céu está esperando por nossos desejos..." />;
  return (
    <div className="h-full bg-stone-950 p-8 md:p-16 overflow-y-auto relative">
      {/* Stars Background Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-32 max-w-5xl mx-auto relative z-10">
        {moments.map((m: any, i: number) => (
          <motion.div 
            key={m.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="group bg-white p-1 border-[4px] border-black rounded-[48px] shadow-[12px_12px_0px_0px_#8b5cf6] hover:-translate-y-2 transition-all duration-500"
          >
             <div className="bg-stone-900 m-2 rounded-[40px] p-8 border-[4px] border-black overflow-hidden relative">
                {/* Constellation Glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[60px] group-hover:bg-purple-500/40 transition-colors" />
                
                <div className="relative space-y-6">
                  <div className="flex justify-between items-start">
                     <span className="bg-purple-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0px_0px_#000] rotate-2 animate-pulse">
                        SINAL DO AMANHÃ
                     </span>
                     <button onClick={(e) => onDelete(m.id, e)} className="text-white/10 group-hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="space-y-4">
                     <h3 className="text-3xl font-black text-white italic tracking-tighter leading-none">{m.title}</h3>
                     <p className="text-purple-100/60 font-bold leading-relaxed text-sm">
                       "{m.description}"
                     </p>
                  </div>

                  <div className="pt-6 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] font-black uppercase tracking-widest">
                        <Sparkles className="w-4 h-4 fill-emerald-400" /> STATUS: SONHANDO
                     </div>
                     <span className="text-white/50 font-black text-[9px] uppercase tracking-tighter italic">PREVISÃO: {m.date}</span>
                  </div>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
      
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm px-6">
         <button onClick={onAdd} className="w-full bg-white text-black border-[5px] border-black px-10 py-6 rounded-[32px] font-black uppercase tracking-[0.4em] italic shadow-[12px_12px_0px_0px_#A8C49A] hover:-translate-y-2 active:translate-y-0 active:shadow-none transition-all">
           PROJETAR SONHO ✨
         </button>
      </div>
    </div>
  );
}

function EmptyState({ onAdd, text }: { onAdd: () => void, text: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-stone-50">
       <div className="w-32 h-32 bg-white border-[4px] border-black rounded-[48px] shadow-[10px_10px_0px_0px_#000] flex items-center justify-center -rotate-12 animate-bounce">
          <Wand2 className="w-16 h-16 text-stone-200" strokeWidth={1} />
       </div>
       <div className="space-y-2">
         <h4 className="text-2xl font-black uppercase italic tracking-tighter">{text}</h4>
         <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Pegue sua caneta mágica e comece o registro!</p>
       </div>
       <button onClick={onAdd} className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_#rose-500] hover:scale-105 active:scale-95 transition-all cursor-pointer">
         + Criar Nova Recordação
       </button>
    </div>
  );
}

interface NewMomentModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string; setTitle: (v: string) => void;
  date: string; setDate: (v: string) => void;
  desc: string; setDesc: (v: string) => void;
  loc: string; setLoc: (v: string) => void;
  music: string; setMusic: (v: string) => void;
  image: string; setImage: (v: string) => void;
  emotion: string; setEmotion: (v: string) => void;
  isPrivate: boolean; setIsPrivate: (v: boolean) => void;
  targetChapter: number; setTargetChapter: (v: number) => void;
  chatInputs: any[]; setChatInputs: (v: any[]) => void;
}

export function NewMomentOverlay({
  onClose,
  onSubmit,
  title, setTitle,
  date, setDate,
  desc, setDesc,
  loc, setLoc,
  music, setMusic,
  image, setImage,
  emotion, setEmotion,
  isPrivate, setIsPrivate,
  targetChapter, setTargetChapter,
  chatInputs, setChatInputs
}: NewMomentModalProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-white border-[6px] border-black rounded-[48px] shadow-[16px_16px_0px_0px_#8b5cf6] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative"
      >
        <div className="bg-black border-b-[6px] border-black p-10 flex items-center justify-between gap-6">
           <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-[#ff90e8] rounded-[2rem] border-[4px] border-white flex items-center justify-center shadow-[6px_6px_0px_0px_#fff/20] rotate-3">
                 <Plus className="w-10 h-10 text-black" strokeWidth={5} />
              </div>
              <div>
                <h2 className="text-4xl font-black uppercase text-white tracking-tighter italic leading-none">Novas Crônicas</h2>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mt-2">Dê vida a mais um fragmento da nossa eternidade</p>
              </div>
           </div>
           <button onClick={onClose} className="text-white hover:rotate-90 transition-all p-3 hover:text-[#ff90e8]"><X className="w-10 h-10" strokeWidth={4} /></button>
        </div>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-12 space-y-16 bg-[#fcf9f2]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30 pl-1">Título da Recordação</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="EX: O DIA DO GUARDA-CHUVA..." className="w-full border-[4px] border-black p-5 bg-white text-sm font-black uppercase rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all" />
               </div>
               <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30 pl-1">Data Mágica</label>
                  <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="DD/MM/AAAA" className="w-full border-[4px] border-black p-5 bg-white text-sm font-black uppercase rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] outline-none" />
               </div>
               <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30 pl-1">Destino Literário</label>
                  <select value={targetChapter} onChange={e => setTargetChapter(parseInt(e.target.value))} className="w-full border-[4px] border-black p-5 bg-white text-sm font-black uppercase rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] outline-none appearance-none cursor-pointer">
                     <option value={1}>Cap 01: Livro do Começo</option>
                     <option value={2}>Cap 02: Log de Conversas</option>
                     <option value={3}>Cap 03: Álbum de Polaroids</option>
                     <option value={4}>Cap 04: Linha do Tempo</option>
                     <option value={5}>Cap 05: Céu de Sonhos</option>
                  </select>
               </div>
               <div className="space-y-5">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30 pl-1">Vibe Dominante</label>
                  <div className="grid grid-cols-5 gap-4">
                    {EMOTIONS.map(e => (
                      <button key={e.sub} type="button" onClick={() => setEmotion(e.sub)} className={`p-5 border-[4px] border-black rounded-2xl text-2xl transition-all hover:scale-105 ${emotion === e.sub ? 'bg-[#ff90e8] shadow-[4px_4px_0px_0px_#000] -translate-y-1' : 'bg-white grayscale opacity-50'}`}>
                        {e.sub}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30 pl-1">Onde aconteceu?</label>
                  <input type="text" value={loc} onChange={e => setLoc(e.target.value)} placeholder="NOSSO LUGAR ESPECIAL..." className="w-full border-[4px] border-black p-5 bg-white text-sm font-black uppercase rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] outline-none" />
               </div>
               <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30 pl-1">Capa (URL Imagem)</label>
                  <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." className="w-full border-[4px] border-black p-5 bg-white text-sm font-mono rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] outline-none" />
               </div>
               <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30 pl-1">Musica do Momento</label>
                  <input type="text" value={music} onChange={e => setMusic(e.target.value)} placeholder="NOME DA MÚSICA..." className="w-full border-[4px] border-black p-5 bg-white text-sm font-black uppercase rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] outline-none" />
               </div>
               <div className="flex items-center gap-5 py-6 bg-[#ff90e8]/10 border-[4px] border-black px-8 rounded-[2rem] mt-6 group select-none cursor-pointer active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_#000]">
                  <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} className="w-7 h-7 border-[4px] border-black rounded-lg bg-white checked:bg-black transition-colors" id="privateCofre" />
                  <label htmlFor="privateCofre" className="text-[11px] font-black uppercase tracking-[0.2em] leading-none cursor-pointer">Guardar no Cofre Privado</label>
               </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30 pl-1">A Narrativa (Conte tudo!)</label>
              <textarea rows={5} value={desc} onChange={e => setDesc(e.target.value)} placeholder="CONTE COM RICOS DETALHES TUDO O QUE SE PASSAVA NO SEU CORAÇÃO..." className="w-full border-[5px] border-black p-8 bg-white text-sm font-black uppercase rounded-[3rem] shadow-[10px_10px_0px_0px_#000] outline-none focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all resize-none" />
            </div>

            {targetChapter === 2 && (
              <div className="bg-cyan-100 border-[5px] border-black p-10 rounded-[3.5rem] shadow-[12px_12px_0px_0px_#000] space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-3xl font-black uppercase italic tracking-tighter">Script da Conversa</h4>
                  <button type="button" onClick={() => setChatInputs([...chatInputs, { sender: 'Voce', text: '' }])} className="bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:-translate-y-1 transition-transform">+ Nova Fala</button>
                </div>
                <div className="space-y-6 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                   {chatInputs.map((chat, idx) => (
                     <div key={idx} className="flex gap-4 items-center">
                        <select value={chat.sender} onChange={e => {
                          const updated = [...chatInputs];
                          updated[idx].sender = e.target.value as any;
                          setChatInputs(updated);
                        }} className="border-[3px] border-black bg-white rounded-2xl px-4 py-3 font-black text-[10px] uppercase outline-none shadow-[3px_3px_0px_0px_#000]">
                          <option value="Voce">🤴 Voce</option>
                          <option value="Himesama">👸 Ela</option>
                        </select>
                        <input type="text" value={chat.text} onChange={e => {
                           const updated = [...chatInputs];
                           updated[idx].text = e.target.value;
                           setChatInputs(updated);
                        }} placeholder="O que foi dito..." className="flex-1 border-[3px] border-black bg-white rounded-2xl p-4 font-bold text-sm outline-none shadow-[3px_3px_0px_0px_#000]" />
                        <button type="button" onClick={() => setChatInputs(chatInputs.filter((_, i) => i !== idx))} className="text-black/20 hover:text-red-500 transition-colors p-2"><Trash2 className="w-6 h-6" /></button>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>

          <footer className="pt-12 flex flex-col sm:flex-row gap-6">
            <button type="button" onClick={onClose} className="px-10 py-6 border-[4px] border-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-stone-100 transition-all cursor-pointer">Desistir</button>
            <button type="submit" className="flex-1 bg-emerald-400 text-black border-[4px] border-black py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] shadow-[12px_12px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_#000] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-4 cursor-pointer">
               Publicar Eternidade ❤️
            </button>
          </footer>
        </form>
      </motion.div>
    </motion.div>
  );
}

interface CinemaModeProps {
  moments: Moment[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function HistoryCinemaMode({ moments, currentIndex, onClose, onNext, onPrev }: CinemaModeProps) {
  const current = moments[currentIndex];
  if (!current) return null;

  return (
     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat" />
        
        <div className="relative z-10 flex items-center justify-between p-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-400 border-[3px] border-white rounded-2xl flex items-center justify-center animate-pulse">
                 <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-white text-xl font-black uppercase italic tracking-tighter">Cine História Imperial</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Recordando {currentIndex + 1} de {moments.length}</p>
              </div>
           </div>
           <button onClick={onClose} className="text-white hover:text-amber-400 p-3 bg-white/5 rounded-full"><X className="w-8 h-8" strokeWidth={4} /></button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
           <AnimatePresence mode="wait">
             <motion.div key={current.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.8 }} className="w-full max-w-5xl aspect-video relative group border-[8px] border-white/5 rounded-[48px] overflow-hidden shadow-2xl">
                {current.image ? (
                   <img src={current.image} className="w-full h-full object-cover" alt="Cinema" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-stone-900 flex items-center justify-center"><ImageIconLucide className="w-24 h-24 text-stone-800" /></div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pt-32">
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <span className="bg-amber-400 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">CAPÍTULO 0{current.chapterId}</span>
                         <span className="text-white/50 bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 uppercase tracking-widest">{current.emotion} MOOD</span>
                      </div>
                      <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">{current.title}</h3>
                      <p className="text-lg md:text-2xl text-white/80 font-bold leading-relaxed max-w-4xl italic">"{current.description}"</p>
                      <div className="flex items-center gap-8 text-[12px] font-black uppercase tracking-widest text-stone-500">
                         <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-400" /> {current.date}</span>
                         <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> {current.location}</span>
                      </div>
                   </div>
                </div>
             </motion.div>
           </AnimatePresence>

           <div className="absolute inset-x-12 flex justify-between pointer-events-none">
              <button onClick={onPrev} className="pointer-events-auto p-6 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all group active:scale-95"><ChevronLeft className="w-10 h-10 group-hover:-translate-x-2 transition-transform" strokeWidth={4} /></button>
              <button onClick={onNext} className="pointer-events-auto p-6 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all group active:scale-95"><ChevronRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" strokeWidth={4} /></button>
           </div>
        </div>
     </motion.div>
  );
}
