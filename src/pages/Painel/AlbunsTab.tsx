import { useState, useEffect, FormEvent } from 'react';
import { BookOpen, Plus, Trash2, Calendar, FileText, Search, Star, Sparkles } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface AlbumItem {
  id: string;
  title: string;
  date: string;
  category: string;
  coverUrl?: string;
  createdAt?: any;
}

const PRESET_CREATIVE_ALBUMS = [
  { title: "Nossa Primeira Viagem", category: "Viagens", coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop", date: "2024-05-15" },
  { title: "Encontros de Domingo", category: "Namoro", coverUrl: "https://images.unsplash.com/photo-1494972308805-463bc619b34e?q=80&w=600&auto=format&fit=crop", date: "2024-11-20" },
  { title: "Aniversários Juntos", category: "Datas Especiais", coverUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop", date: "2025-02-14" },
];

export function AlbunsTab() {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Viagens');
  const [coverUrl, setCoverUrl] = useState('');
  const [loadingAdd, setLoadingAdd] = useState(false);

  // Filters/Searches
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const albumsRef = collection(db, 'albums');
      const q = query(albumsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list: AlbumItem[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as AlbumItem);
      });
      setAlbums(list);
    } catch (error) {
      console.error("Erro ao carregar álbuns:", error);
      // Fallback if index is not ready yet
      try {
        const snapshot = await getDocs(collection(db, 'albums'));
        const list: AlbumItem[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as AlbumItem);
        });
        setAlbums(list);
      } catch (err) {
        toast.error("Erro ao buscar álbuns.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const addAlbum = async (e: FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("O título do álbum é obrigatório.");
      return;
    }

    try {
      setLoadingAdd(true);
      const payload = {
        title,
        date: date || new Date().toISOString().split('T')[0],
        category,
        coverUrl: coverUrl || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'albums'), payload);
      toast.success("Álbum criado!");
      setTitle('');
      setDate('');
      setCoverUrl('');
      setIsAdding(false);
      fetchAlbums();
    } catch (error) {
      toast.error("Erro ao criar álbum.");
    } finally {
      setLoadingAdd(false);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (!confirm("Deseja deletar este álbum? As fotos vinculadas precisarão ser reagrupadas.")) return;
    try {
      await deleteDoc(doc(db, 'albums', id));
      toast.success("Álbum removido!");
      fetchAlbums();
    } catch (error) {
      toast.error("Erro ao remover álbum.");
    }
  };

  const preseedAlbums = async () => {
    try {
      setLoadingAdd(true);
      for (const item of PRESET_CREATIVE_ALBUMS) {
        await addDoc(collection(db, 'albums'), {
          ...item,
          createdAt: serverTimestamp()
        });
      }
      toast.success("Álbuns sugeridos gerados!");
      fetchAlbums();
    } catch (error) {
      toast.error("Erro ao pré-carregar álbuns.");
    } finally {
      setLoadingAdd(false);
    }
  };

  const filters = ['Todos', 'Viagens', 'Datas Especiais', 'Namoro', 'Eventos'];

  const filteredAlbums = albums.filter(a => {
    const matchesFilter = activeFilter === 'Todos' || a.category.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title block */}
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">📚 Gerenciador de Álbuns</h3>
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Crie pastas para agrupar as fotos de cada data e viagem espacial juntas</p>
        </div>

        <div className="flex gap-2">
          {albums.length === 0 && !loading && (
            <button
              onClick={preseedAlbums}
              className="px-4 py-2 bg-stone-100 hover:bg-neutral-200 border-2 border-black font-sans font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Criar Iniciais
            </button>
          )}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-5 py-2 bg-[#e84e4e] text-white hover:bg-[#1a1a1a] border-2 border-black font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            {isAdding ? "Fechar" : "Criar Álbum"}
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={addAlbum} className="bg-white border-2 border-black p-8 shadow-[10px_10px_0px_0px_#1a1a1a] space-y-6 max-w-2xl mx-auto">
          <h4 className="font-black text-2xl italic border-b-2 border-black pb-4">Novo Álbum de Memórias</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Título do Álbum *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: VIAGEM PARA O RIO DE JANEIRO"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-black font-sans font-bold uppercase text-xs tracking-wider p-3 outline-none focus:border-[#e84e4e]"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-black font-sans font-bold uppercase text-xs p-3 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-black font-sans font-bold uppercase text-xs p-3 outline-none"
                >
                  <option value="Viagens">Viagens</option>
                  <option value="Namoro">Namoro</option>
                  <option value="Datas Especiais">Datas Especiais</option>
                  <option value="Eventos">Eventos</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Capa do Álbum (Imagem URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-black text-xs font-mono p-3 outline-none focus:border-[#e84e4e]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingAdd}
            className="w-full bg-[#1a1a1a] text-white border-2 border-black p-3.5 font-black uppercase tracking-widest text-xs hover:bg-[#e84e4e] transition-colors shadow-[4px_4px_0px_0px_rgba(232,78,78,1)] hover:shadow-none"
          >
            {loadingAdd ? "CRIANDO..." : "PUBLICAR ÁLBUM"}
          </button>
        </form>
      )}

      {/* Filter Options */}
      <div className="bg-white border-2 border-black p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex gap-2 overflow-x-auto py-1">
          {filters.map((fil) => (
            <button
              key={fil}
              onClick={() => setActiveFilter(fil)}
              className={`px-3 py-1.5 border-2 text-[10px] font-sans font-black uppercase tracking-widest transition-all ${activeFilter === fil ? 'bg-[#1a1a1a] text-white border-black' : 'bg-white hover:bg-neutral-50 border-black/15'}`}
            >
              {fil}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="BUSCAR ÁLBUM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-stone-50 border-2 border-black focus:border-[#e84e4e] pl-9 pr-3 py-1.5 outline-none font-mono text-xs font-bold uppercase w-full md:w-60"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white border-2 border-black shadow-[8px_8px_0px_0px_#1a1a1a]">
          <div className="w-10 h-10 border-4 border-[#e84e4e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h5 className="font-sans font-black text-xs uppercase tracking-widest">Carregando seus álbuns...</h5>
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="bg-white border-2 border-black p-16 text-center shadow-[8px_8px_0px_0px_#1a1a1a]">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h5 className="font-black text-lg">Sem álbuns localizados</h5>
          <p className="font-sans text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1">Crie um novo álbum ou limpe os filtros!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAlbums.map((album) => (
            <div 
              key={album.id}
              className="border-2 border-black bg-white group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="aspect-video relative border-b-2 border-black overflow-hidden bg-neutral-100">
                <img 
                  src={album.coverUrl || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop"} 
                  alt={album.title} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="bg-black text-white text-[8px] font-mono font-black uppercase px-2 py-0.5 border border-white/20 shadow-[2px_2px_0px_0px_rgba(232,78,78,1)]">
                    {album.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex justify-between items-center bg-stone-50/50">
                <div className="min-w-0 pr-4">
                  <h4 className="font-black text-sm uppercase truncate leading-tight">{album.title}</h4>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-stone-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{album.date}</span>
                  </div>
                </div>

                <button 
                  onClick={() => deleteAlbum(album.id)}
                  className="p-2 border border-black bg-white hover:bg-red-50 hover:text-[#e84e4e] font-sans font-bold transition-all text-xs active:scale-95 shrink-0"
                  title="Apagar Álbum"
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
