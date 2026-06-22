import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Image as ImageIcon, Plus, Trash2, Calendar, Star, Upload, Search, ListFilter, Sliders } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface PhotoItem {
  id: string;
  albumId?: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  createdAt?: any;
}

const PRESET_CREATIVE_PHOTOS = [
  { title: "Nosso Primeiro Sorvete", category: "namoro", imageUrl: "https://images.unsplash.com/photo-1502462041144-01eabc689881?q=80&w=600&auto=format&fit=crop", date: "2024-03-12" },
  { title: "Vendo as Estrelas na Montanha", category: "viagem", imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop", date: "2024-08-15" },
  { title: "Abraço de Urso no Frio", category: "datas especiais", imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop", date: "2025-01-02" },
];

export function GaleriaTab() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('namoro');
  const [imageUrl, setImageUrl] = useState('');
  const [previewBase64, setPreviewBase64] = useState('');
  const [loadingAdd, setLoadingAdd] = useState(false);

  // Search/Filters
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const photoRef = collection(db, 'photos');
      const q = query(photoRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list: PhotoItem[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as PhotoItem);
      });
      setPhotos(list);
    } catch (error) {
      console.error("Erro ao buscar fotos:", error);
      // Fallback in case orderBy fails due to missing index
      try {
        const snapshot = await getDocs(collection(db, 'photos'));
        const list: PhotoItem[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as PhotoItem);
        });
        setPhotos(list);
      } catch (err) {
        toast.error("Erro ao carregar fotos do portal.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewBase64(base64);
        setImageUrl(base64); // Safe fallback to inline document base64
      };
      reader.readAsDataURL(file);
    }
  };

  const addPhoto = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || (!imageUrl && !previewBase64)) {
      toast.error("Por favor, preencha o título e forneça uma imagem.");
      return;
    }

    try {
      setLoadingAdd(true);
      const finalUrl = previewBase64 || imageUrl;
      const payload = {
        title,
        date: date || new Date().toISOString().split('T')[0],
        category,
        imageUrl: finalUrl,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'photos'), payload);
      toast.success("Foto carregada com absoluto sucesso!");
      setTitle('');
      setDate('');
      setImageUrl('');
      setPreviewBase64('');
      setIsAdding(false);
      fetchPhotos();
    } catch (error) {
      console.error("Erro ao adicionar foto:", error);
      toast.error("Erro ao publicar nova lembrança fotográfica.");
    } finally {
      setLoadingAdd(false);
    }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm("Deseja realmente apagar esta imagem das suas lembranças?")) return;
    try {
      await deleteDoc(doc(db, 'photos', id));
      toast.success("Foto removida permanentemente!");
      fetchPhotos();
    } catch (error) {
      toast.error("Erro ao remover foto do Firestore.");
    }
  };

  const preseedPhotos = async () => {
    try {
      setLoadingAdd(true);
      for (const item of PRESET_CREATIVE_PHOTOS) {
        await addDoc(collection(db, 'photos'), {
          ...item,
          createdAt: serverTimestamp()
        });
      }
      toast.success("Lembranças prévias geradas!");
      fetchPhotos();
    } catch (error) {
      toast.error("Erro ao pré-sinalizar as fotos.");
    } finally {
      setLoadingAdd(false);
    }
  };

  const filters = ['Todos', 'namoro', 'viagem', 'datas especiais', 'selfies', 'engraçadas'];

  const filteredPhotos = photos.filter(p => {
    const matchesFilter = activeFilter === 'Todos' || p.category.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title block */}
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">📸 Galeria Fotográfica Colaborativa</h3>
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Carregue recordações compartilhadas, fotos do casal e enriqueça o portal</p>
        </div>

        <div className="flex gap-2">
          {photos.length === 0 && !loading && (
            <button
              onClick={preseedPhotos}
              className="px-4 py-2 bg-stone-100 hover:bg-neutral-200 border-2 border-black font-sans font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Preencher Fofo
            </button>
          )}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-5 py-2 bg-[#e84e4e] text-white hover:bg-[#1a1a1a] border-2 border-black font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            {isAdding ? "Fechar Painel" : "Adicionar Foto"}
          </button>
        </div>
      </div>

      {/* Add photo card panel */}
      {isAdding && (
        <form onSubmit={addPhoto} className="bg-white border-2 border-black p-8 shadow-[10px_10px_0px_0px_#1a1a1a] space-y-6 max-w-2xl mx-auto">
          <h4 className="font-black text-2xl italic border-b-2 border-black pb-4">Nova Recordação Fotográfica</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Título da Foto *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: NOSSO DIA DE CHUVA"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-black font-sans font-bold uppercase text-xs tracking-wider p-3 outline-none focus:border-[#e84e4e]"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Data do Momento</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-black font-sans font-bold uppercase text-xs p-3 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-black font-sans font-bold uppercase text-xs p-3 outline-none"
                >
                  <option value="namoro">Namoro</option>
                  <option value="viagem">Viagem</option>
                  <option value="datas especiais">Datas Especiais</option>
                  <option value="selfies">Selfies</option>
                  <option value="engraçadas">Engraçadas</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Imagem URL (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewBase64('');
                  }}
                  className="w-full bg-stone-50 border-2 border-black text-xs font-mono p-3 outline-none focus:border-[#e84e4e]"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Ou Escolha arquivo local</label>
                <div className="border-2 border-dashed border-black/30 p-4 text-center cursor-pointer hover:bg-zinc-50 relative">
                  <Upload className="w-6 h-6 mx-auto text-stone-400 mb-2" />
                  <span className="text-[9px] font-sans font-black uppercase tracking-widest">Escolher Imagem (Max 1MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {(previewBase64 || imageUrl) && (
                <div className="border border-black p-2 h-24 flex items-center justify-center bg-stone-50">
                  <img src={previewBase64 || imageUrl} alt="Preview" className="h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingAdd}
            className="w-full bg-[#1a1a1a] text-white border-2 border-black p-3.5 font-black uppercase tracking-widest text-xs hover:bg-[#e84e4e] transition-colors shadow-[4px_4px_0px_0px_rgba(232,78,78,1)] hover:shadow-none"
          >
            {loadingAdd ? "PUBLICANDO..." : "COMPARTILHAR RECORDAÇÃO"}
          </button>
        </form>
      )}

      {/* Filter and Search Layout */}
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
            placeholder="BUSCAR FOTO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-stone-50 border-2 border-black focus:border-[#e84e4e] pl-9 pr-3 py-1.5 outline-none font-mono text-xs font-bold uppercase w-full md:w-60"
          />
        </div>
      </div>

      {/* Grid of Photo Cards */}
      {loading ? (
        <div className="text-center py-20 bg-white border-2 border-black shadow-[8px_8px_0px_0px_#1a1a1a]">
          <div className="w-10 h-10 border-4 border-[#e84e4e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h5 className="font-sans font-black text-xs uppercase tracking-widest">Carregando fotografias do Firebase...</h5>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="bg-white border-2 border-black p-16 text-center shadow-[8px_8px_0px_0px_#1a1a1a]">
          <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h5 className="font-black text-lg">Sem fotos nesta galeria</h5>
          <p className="font-sans text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1">Defina seus filtros ou crie novas fotos acima!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id}
              className="border-2 border-black bg-white group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="aspect-video relative border-b-2 border-black overflow-hidden bg-neutral-100">
                <img 
                  src={photo.imageUrl} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="bg-black text-white text-[8px] font-mono font-black uppercase px-2 py-0.5 border border-white/20 shadow-[2px_2px_0px_0px_rgba(232,78,78,1)]">
                    {photo.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex justify-between items-center bg-stone-50/50">
                <div className="min-w-0 pr-4">
                  <h4 className="font-black text-sm uppercase truncate leading-tight">{photo.title}</h4>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-stone-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{photo.date}</span>
                  </div>
                </div>

                <button 
                  onClick={() => deletePhoto(photo.id)}
                  className="p-2 border border-black bg-white hover:bg-red-50 hover:text-[#e84e4e] font-sans font-bold transition-all text-xs active:scale-95 shrink-0"
                  title="Apagar Memória"
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
