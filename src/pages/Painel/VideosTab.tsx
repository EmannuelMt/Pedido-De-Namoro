import { useState, useEffect, FormEvent } from 'react';
import { Video, Plus, Trash2, Play, Search, Film, Sparkles, Youtube } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface VideoItem {
  id: string;
  title: string;
  url: string;
  category: string;
  date?: string;
  createdAt?: any;
}

const PRESET_CREATIVE_VIDEOS = [
  { title: "Nossa Música Tema - Perfect", category: "Nossa Trilha", url: "https://www.youtube.com/embed/2Vv-BfVoq4g" },
  { title: "Momento Fofo no Parque", category: "Vlogs", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
];

export function VideosTab() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeWatchUrl, setActiveWatchUrl] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Nossa Trilha');
  const [loadingAdd, setLoadingAdd] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const videoRef = collection(db, 'videos');
      const q = query(videoRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list: VideoItem[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as VideoItem);
      });
      setVideos(list);
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
      // Fallback
      try {
        const snapshot = await getDocs(collection(db, 'videos'));
        const list: VideoItem[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as VideoItem);
        });
        setVideos(list);
      } catch (err) {
        toast.error("Erro ao buscar vídeos do casal.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Helper to extract embed code from standard YouTube URL
  const getEmbedUrl = (rawUrl: string) => {
    if (rawUrl.includes("embed/")) return rawUrl;
    
    // Check watch?v= format
    const watchMatch = rawUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    return rawUrl;
  };

  const addVideo = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      toast.error("Título e Link do vídeo são obrigatórios.");
      return;
    }

    try {
      setLoadingAdd(true);
      const embedUrl = getEmbedUrl(url);

      const payload = {
        title,
        url: embedUrl,
        category,
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'videos'), payload);
      toast.success("Vídeo adicionado com absoluto sucesso!");
      setTitle('');
      setUrl('');
      setIsAdding(false);
      fetchVideos();
    } catch (error) {
      toast.error("Erro ao publicar vídeo.");
    } finally {
      setLoadingAdd(false);
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm("Deseja deletar este vídeo de suas memórias?")) return;
    try {
      await deleteDoc(doc(db, 'videos', id));
      toast.success("Vídeo removido!");
      if (activeWatchUrl === id) setActiveWatchUrl(null);
      fetchVideos();
    } catch (error) {
      toast.error("Erro ao deletar vídeo.");
    }
  };

  const preseedVideos = async () => {
    try {
      setLoadingAdd(true);
      for (const item of PRESET_CREATIVE_VIDEOS) {
        await addDoc(collection(db, 'videos'), {
          ...item,
          date: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp()
        });
      }
      toast.success("Vídeos sugeridos gerados!");
      fetchVideos();
    } catch (error) {
      toast.error("Erro ao carregar vídeos mock.");
    } finally {
      setLoadingAdd(false);
    }
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header and Add buttons */}
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">🎥 Nossos Vídeos & Clipes</h3>
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Guarde videoclipes de músicas de vocês, links do tiktok ou vlogs de recordação</p>
        </div>

        <div className="flex gap-2">
          {videos.length === 0 && !loading && (
            <button
              onClick={preseedVideos}
              className="px-4 py-2 bg-stone-100 hover:bg-neutral-200 border-2 border-black font-sans font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Exemplos Fofos
            </button>
          )}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-5 py-2 bg-[#e84e4e] text-white hover:bg-[#1a1a1a] border-2 border-black font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            {isAdding ? "Fechar" : "Adicionar Vídeo"}
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={addVideo} className="bg-white border-2 border-black p-8 shadow-[10px_10px_0px_0px_#1a1a1a] space-y-6 max-w-2xl mx-auto">
          <h4 className="font-black text-2xl italic border-b-2 border-black pb-4">Nova Lembrança Audiovisual</h4>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Título do Vídeo *</label>
              <input
                type="text"
                required
                placeholder="EX: NOSSO VLOG NA SERRA"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-50 border-2 border-black font-sans font-bold uppercase text-xs tracking-wider p-3 outline-none focus:border-[#e84e4e]"
              />
            </div>

            <div>
              <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Link do Vídeo (YouTube ou TikTok) *</label>
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-stone-50 border-2 border-black text-xs font-mono p-3 outline-none focus:border-[#e84e4e]"
              />
              <span className="text-[9px] text-stone-400 mt-1 block">Aceitamos links normais do YouTube ou formato de incorporação direta.</span>
            </div>

            <div>
              <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Categoria de Amor</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-50 border-2 border-black font-sans font-bold uppercase text-xs p-3 outline-none"
              >
                <option value="Nossa Trilha">Nossa Trilha (Música)</option>
                <option value="Vlogs">Vlogs Compartilhados</option>
                <option value="Tiktoks engraçados">Tiktoks Engraçados</option>
                <option value="Momentos únicos">Momentos Únicos</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingAdd}
            className="w-full bg-[#1a1a1a] text-white border-2 border-black p-3.5 font-black uppercase tracking-widest text-xs hover:bg-[#e84e4e] transition-colors shadow-[4px_4px_0px_0px_rgba(232,78,78,1)] hover:shadow-none"
          >
            {loadingAdd ? "SALVANDO VÍDEO..." : "SALVAR VÍDEO"}
          </button>
        </form>
      )}

      {/* Active Watch Iframe Player Box (when selected) */}
      {activeWatchUrl && (
        <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_#1a1a1a] max-w-4xl mx-auto">
          <div className="aspect-video w-full bg-black border border-black relative">
            <iframe 
              src={activeWatchUrl} 
              className="w-full h-full"
              title="Romantic Video Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              <h4 className="font-black text-lg">Cinema do Casal</h4>
              <p className="text-[10px] font-mono text-stone-400">Tocando agora...</p>
            </div>
            <button 
              onClick={() => setActiveWatchUrl(null)}
              className="text-xs font-sans font-bold uppercase tracking-widest bg-stone-100 hover:bg-[#e84e4e] hover:text-white px-4 py-2 border border-black transition-colors"
            >
              Fechar Player
            </button>
          </div>
        </div>
      )}

      {/* Filter Options */}
      <div className="bg-white border-2 border-black p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex gap-2">
          <span className="text-xs font-sans font-black uppercase bg-black text-white px-3 py-1.5 border border-black flex items-center gap-1">
            <Film className="w-3.5 h-3.5" />
            VÍDEOTESTE
          </span>
        </div>

        <div className="relative w-full md:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="BUSCAR VÍDEO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-stone-50 border-2 border-black focus:border-[#e84e4e] pl-9 pr-3 py-1.5 outline-none font-mono text-xs font-bold uppercase w-full"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white border-2 border-black shadow-[8px_8px_0px_0px_#1a1a1a]">
          <div className="w-10 h-10 border-4 border-[#e84e4e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h5 className="font-sans font-black text-xs uppercase tracking-widest">Carregando seus vídeos...</h5>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="bg-white border-2 border-black p-16 text-center shadow-[8px_8px_0px_0px_#1a1a1a]">
          <Video className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h5 className="font-black text-lg">Sem vídeos na videoteca</h5>
          <p className="font-sans text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1">Crie um novo vídeo ou clique em Exemplos Fofos!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((vid) => (
            <div 
              key={vid.id}
              className="border-2 border-black bg-white group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div 
                className="aspect-video relative border-b-2 border-black overflow-hidden bg-black flex items-center justify-center cursor-pointer"
                onClick={() => setActiveWatchUrl(vid.url)}
              >
                {/* Simulated Thumbnail */}
                <div className="absolute inset-0 bg-stone-900 flex flex-col items-center justify-center p-4 text-center">
                  <Youtube className="w-10 h-10 text-red-500 mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[10px] text-zinc-400 uppercase font-bold text-center leading-tight">{vid.title}</span>
                </div>
                
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-white/60 bg-white/10 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="bg-[#e84e4e] text-white text-[8px] font-mono font-black uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {vid.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex justify-between items-center bg-stone-50/50">
                <div className="min-w-0 pr-4">
                  <h4 className="font-black text-sm uppercase truncate leading-tight">{vid.title}</h4>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-stone-400 mt-1">
                    <Film className="w-3 h-3" />
                    <span>{vid.category}</span>
                  </div>
                </div>

                <button 
                  onClick={() => deleteVideo(vid.id)}
                  className="p-2 border border-black bg-white hover:bg-red-50 hover:text-[#e84e4e] font-sans font-bold transition-all text-xs active:scale-95 shrink-0"
                  title="Apagar Vídeo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
