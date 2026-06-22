import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Film, 
  Lock,
  Camera,
  Heart
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/auth';
import { toast } from 'sonner';

// Types
import { Memory, Comment } from '../types';
import { PRESET_MEMORIES } from '../data/galleryPresets';

// Components
import { GalleryHeader } from '../components/gallery/GalleryHeader';
import { GallerySidebar } from '../components/gallery/GallerySidebar';
import { GalleryCard } from '../components/gallery/GalleryCard';
import { GalleryDetailView, GalleryUploadModal } from '../components/gallery/GalleryModals';
import { GalleryCinema } from '../components/gallery/GalleryCinema';

const CATEGORIES_LIST = [
  'Todos',
  '❤️ Nossos Momentos',
  '🌸 Datas Especiais',
  '✈️ Viagens',
  '🎂 Comemorações',
  '😂 Momentos Engraçados',
  '📷 Fotos Aleatórias',
  '⭐ Favoritas',
  '🔒 Privadas'
] as const;

export function Galeria() {
  const { user } = useAuthStore();
  
  // Data State
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interaction State
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isVaultLocked, setIsVaultLocked] = useState(true);
  const [vaultPassword, setVaultPassword] = useState('');
  
  // Cinema Mode State
  const [filmMode, setFilmMode] = useState(false);
  const [filmIndex, setFilmIndex] = useState(0);
  const [filmPlaying, setFilmPlaying] = useState(false);
  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toLocaleDateString('pt-BR'));
  const [newLocation, setNewLocation] = useState('');
  const [newFeeling, setNewFeeling] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Memory['category']>('❤️ Nossos Momentos');
  const [newTheme, setNewTheme] = useState<Memory['theme']>('cartoon');
  const [useCustomUrl, setUseCustomUrl] = useState(true);
  const [inputUrl, setInputUrl] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Comment Form State (Inside Detail View)
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  // 1. Fetch Data
  useEffect(() => {
    const q = query(collection(db, 'photos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: Memory[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loaded.push({
          id: docSnap.id,
          title: data.title || '',
          date: data.date || '',
          location: data.location || '',
          feeling: data.feeling || '',
          story: data.story || '',
          songTitle: data.songTitle || '',
          category: data.category || '❤️ Nossos Momentos',
          theme: data.theme || 'cartoon',
          imageUrl: data.imageUrl || '',
          likes: data.likes || 0,
          comments: data.comments || [],
          addedBy: data.addedBy || 'Anônimo',
          createdAt: data.createdAt
        });
      });

      const merged = [...loaded];
      PRESET_MEMORIES.forEach(p => {
        if (!merged.some(m => m.id === p.id)) merged.push(p);
      });
      setMemories(merged);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Cinema Logic
  useEffect(() => {
    if (filmMode && filmPlaying) {
      slideshowTimerRef.current = setInterval(() => {
        setFilmIndex((prev) => (prev + 1) % filteredMemories.length);
      }, 6000);
    } else if (slideshowTimerRef.current) {
      clearInterval(slideshowTimerRef.current);
    }
    return () => { if (slideshowTimerRef.current) clearInterval(slideshowTimerRef.current); };
  }, [filmMode, filmPlaying, filmIndex]);

  // 3. Handlers
  const handleLike = async (id: string, currentLikes: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id.startsWith('preset-')) {
      setMemories(prev => prev.map(m => m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m));
      toast.success('Amor enviado! ❤️');
      return;
    }
    try {
      const ref = doc(db, 'photos', id);
      await updateDoc(ref, { likes: currentLikes + 1 });
      toast.success('Lembrança curtida! ❤️');
    } catch {
      toast.error('Erro ao curtir.');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id.startsWith('preset-')) {
      toast.error('Lembranças fixas não podem ser removidas! 📜');
      return;
    }
    if (!window.confirm('Excluir este momento para sempre? 🥺')) return;
    try {
      await deleteDoc(doc(db, 'photos', id));
      toast.success('Removido do álbum.');
    } catch {
      toast.error('Erro ao excluir.');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMemory || !newCommentText.trim()) return;

    const comment: Comment = {
      author: commentAuthor.trim() || user?.displayName || 'Amor',
      text: newCommentText.trim(),
      timestamp: new Date().toLocaleDateString('pt-BR')
    };

    const updatedComments = [...(activeMemory.comments || []), comment];

    // Optimistic update
    setMemories(prev => prev.map(m => m.id === activeMemory.id ? { ...m, comments: updatedComments } : m));
    setActiveMemory({ ...activeMemory, comments: updatedComments });
    setNewCommentText('');
    toast.success('Reação adicionada! 💌');

    if (!activeMemory.id.startsWith('preset-')) {
      await updateDoc(doc(db, 'photos', activeMemory.id), { comments: updatedComments });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImg = useCustomUrl ? inputUrl : fileBase64;
    if (!finalImg || !newTitle) {
      toast.error('Preencha os campos obrigatórios!');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'photos'), {
        title: newTitle,
        date: newDate,
        location: newLocation,
        feeling: newFeeling,
        story: newStory,
        songTitle: newSongTitle,
        category: newCategory,
        theme: newTheme,
        imageUrl: finalImg,
        likes: 1,
        comments: [],
        addedBy: user?.displayName || user?.email || 'Visitante',
        createdAt: serverTimestamp()
      });
      toast.success('Semente plantada no jardim! 🌱');
      setIsUploadOpen(false);
      // Reset form
      setNewTitle(''); setInputUrl(''); setFileBase64('');
    } catch {
      toast.error('Erro no plantio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFileBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUnlockVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (['1234', 'amor', 'love'].includes(vaultPassword.toLowerCase().trim())) {
      setIsVaultLocked(false);
      toast.success('Cofre destrancado! ✨');
    } else {
      toast.error('Senha incorreta.');
      setVaultPassword('');
    }
  };

  // 4. Filtering
  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      if (selectedCategory === 'Todos' && m.category === '🔒 Privadas') return false;
      if (selectedCategory === '⭐ Favoritas' && (m.likes || 0) < 10) return false;
      if (selectedCategory !== 'Todos' && selectedCategory !== '⭐ Favoritas' && m.category !== selectedCategory) return false;
      
      const q = searchQuery.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.story.toLowerCase().includes(q) || m.location.toLowerCase().includes(q);
    });
  }, [memories, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fcf9f2] pb-32 select-none">
      
      {/* Cinematic Background Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
      </div>

      <div className="w-full px-6 md:px-12 lg:px-24 pt-12 md:pt-24 space-y-24 relative z-10">
        
        <GalleryHeader memories={memories} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pt-8">
          <div className="flex flex-wrap gap-6">
             <button 
               onClick={() => {
                 if (filteredMemories.length === 0) return toast.error('Sem fotos para o cinema!');
                 setFilmMode(true);
                 setFilmPlaying(true);
               }}
               className="bg-[#000] text-white border-[5px] border-black px-10 py-5 rounded-[2rem] font-black uppercase italic text-sm tracking-[0.2em] shadow-[10px_10px_0px_0px_#4ade80] hover:-translate-y-2 transition-all flex items-center gap-4 cursor-pointer group"
             >
               <Film className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Cine Reel
             </button>
             {user && (
               <button 
                 onClick={() => setIsUploadOpen(true)}
                 className="bg-[#ff90e8] text-black border-[5px] border-black px-10 py-5 rounded-[2rem] font-black uppercase italic text-sm tracking-[0.2em] shadow-[10px_10px_0px_0px_#000] hover:-translate-y-2 active:translate-y-1 transition-all flex items-center gap-4 cursor-pointer group"
               >
                 <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" strokeWidth={5} /> Registrar
               </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <aside className="lg:col-span-3 lg:sticky lg:top-12">
            <GallerySidebar 
              categories={[...CATEGORIES_LIST]}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              memories={memories}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </aside>

          <main className="lg:col-span-9 space-y-12">
            {selectedCategory === '🔒 Privadas' && isVaultLocked ? (
              <div className="bg-white border-[6px] border-black p-12 md:p-24 rounded-[4rem] shadow-[24px_24px_0px_0px_#000] text-center space-y-10 max-w-3xl mx-auto rotate-1">
                <div className="w-32 h-32 bg-[#ff90e8] border-[5px] border-black rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[10px_10px_0px_0px_#000] -rotate-6 animate-bounce">
                  <Lock className="w-16 h-16 text-black" strokeWidth={4} />
                </div>
                <div className="space-y-4">
                   <h2 className="text-5xl font-black uppercase italic tracking-tighter">Cofre de Segredos</h2>
                   <p className="text-black/40 font-black uppercase text-xs tracking-[0.3em] max-w-sm mx-auto">Nossos segredos e momentos íntimos guardados sob chave. Insira o código da eternidade:</p>
                </div>
                <form onSubmit={handleUnlockVault} className="space-y-8 max-w-sm mx-auto">
                   <input 
                     type="password" 
                     placeholder="****"
                     value={vaultPassword}
                     onChange={e => setVaultPassword(e.target.value)}
                     className="w-full border-[5px] border-black p-8 rounded-[2rem] text-center text-4xl font-black tracking-[1em] focus:scale-105 transition-all outline-none bg-[#fcf9f2] shadow-[8px_8px_0px_0px_#000]"
                   />
                   <button type="submit" className="w-full bg-black text-white py-8 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-[12px_12px_0px_0px_#ff90e8] hover:-translate-y-2 transition-all cursor-pointer">
                     Ver Segredos ❤️
                   </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                {filteredMemories.length === 0 ? (
                  <div className="col-span-full py-32 text-center space-y-8 bg-white border-[5px] border-black rounded-[4rem] shadow-[15px_15px_0px_0px_rgba(0,0,0,0.05)] border-dashed">
                    <Camera className="w-24 h-24 text-black/10 mx-auto" strokeWidth={1} />
                    <p className="font-black uppercase text-sm text-black/20 tracking-[0.4em] italic">Nenhum rastro de amor por aqui...</p>
                  </div>
                ) : (
                  filteredMemories.map((m, i) => (
                    <GalleryCard 
                      key={m.id} 
                      memory={m} 
                      idx={i} 
                      onClick={setActiveMemory}
                      onLike={handleLike}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {activeMemory && (
          <GalleryDetailView 
            memory={activeMemory}
            onClose={() => setActiveMemory(null)}
            onLike={handleLike}
            onAddComment={handleAddComment}
            newCommentText={newCommentText}
            setNewCommentText={setNewCommentText}
            commentAuthor={commentAuthor}
            setCommentAuthor={setCommentAuthor}
            user={user}
          />
        )}

        {isUploadOpen && (
          <GalleryUploadModal 
            onClose={() => setIsUploadOpen(false)}
            onSubmit={handleUpload}
            title={newTitle} setTitle={setNewTitle}
            date={newDate} setDate={setNewDate}
            location={newLocation} setLocation={setNewLocation}
            feeling={newFeeling} setFeeling={setNewFeeling}
            story={newStory} setStory={setNewStory}
            category={newCategory} setCategory={setNewCategory}
            theme={newTheme} setTheme={setNewTheme}
            useCustomUrl={useCustomUrl} setUseCustomUrl={setUseCustomUrl}
            inputUrl={inputUrl} setInputUrl={setInputUrl}
            fileBase64={fileBase64}
            onFileChange={handleFileChange}
            submitting={submitting}
          />
        )}

        {filmMode && (
          <GalleryCinema 
            memories={filteredMemories}
            currentIndex={filmIndex}
            isPlaying={filmPlaying}
            onClose={() => setFilmMode(false)}
            onNext={() => setFilmIndex(p => (p + 1) % filteredMemories.length)}
            onPrev={() => setFilmIndex(p => (p - 1 + filteredMemories.length) % filteredMemories.length)}
            onTogglePlay={() => setFilmPlaying(!filmPlaying)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-10 right-10 z-50">
        <div className="bg-purple-600 text-white p-4 rounded-full border-[4px] border-black shadow-[6px_6px_0px_0px_#000] -rotate-12 animate-bounce">
          <Heart className="w-8 h-8 fill-white" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
