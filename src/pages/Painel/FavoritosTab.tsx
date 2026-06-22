import { useState } from 'react';
import { Heart, Music, Image as ImageIcon, MessageCircle, Star, Sparkles, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export function FavoritosTab() {
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'photos' | 'quotes'>('all');

  const [favorites, setFavorites] = useState([
    { id: 1, category: 'songs', title: "Photograph", subtitle: "Ed Sheeran", extra: "Tocou no nosso primeiro encontro!", icon: Music, color: "bg-red-50 text-red-500" },
    { id: 2, category: 'songs', title: "Perfect", subtitle: "Ed Sheeran", extra: "Nossa dança na sala", icon: Music, color: "bg-indigo-50 text-indigo-500" },
    { id: 3, category: 'quotes', title: "Te amo não apenas pelo que você é, mas pelo que sou quando estou com você.", subtitle: "Elizabeth Barrett", extra: "Frase gravada no anel virtual", icon: MessageCircle, color: "bg-amber-50 text-amber-500" },
    { id: 4, category: 'photos', title: "Pôr do Sol Mágico", subtitle: "Viagem à Praia", extra: "Dezembro de 2024", icon: ImageIcon, color: "bg-emerald-50 text-emerald-500" },
    { id: 5, category: 'photos', title: "Selfie Engraçada no Café", subtitle: "Tarde de Sábado", extra: "Março de 2025", icon: ImageIcon, color: "bg-pink-50 text-pink-500" },
    { id: 6, category: 'quotes', title: "Você é o meu hoje e todos os meus amanhãs.", subtitle: "Emanuel", extra: "Bilhete deixado na cabeceira", icon: MessageCircle, color: "bg-purple-50 text-purple-500" },
  ]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    toast.success("Item removido dos favoritos!");
  };

  const filteredFavs = activeTab === 'all' 
    ? favorites 
    : favorites.filter(f => f.category === activeTab);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title block */}
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a]">
        <h3 className="text-3xl font-black italic tracking-tighter">❤️ Itens Favoritados</h3>
        <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Todos os momentos, músicas e memórias que receberam o seu selo especial de amor</p>
      </div>

      {/* Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b-2 border-black">
        {[
          { id: 'all', label: 'Todos os Favoritos', icon: Star },
          { id: 'songs', label: 'Músicas', icon: Music },
          { id: 'photos', label: 'Imagens', icon: ImageIcon },
          { id: 'quotes', label: 'Frases & Bilhetes', icon: MessageCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3 font-sans font-bold uppercase text-xs tracking-widest border-2 border-black transition-all ${activeTab === tab.id ? 'bg-[#e84e4e] text-white' : 'bg-white text-[#1a1a1a] hover:bg-neutral-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {filteredFavs.length === 0 ? (
        <div className="bg-white border-2 border-black p-12 text-center shadow-[8px_8px_0px_0px_#1a1a1a]">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4 animate-pulse" />
          <h5 className="font-black text-lg">Sem itens por enquanto</h5>
          <p className="font-sans text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1">Clique no botão ❤️ de músicas ou fotos no portal para trazê-los para cá</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFavs.map((fav) => (
            <div 
              key={fav.id} 
              className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 border border-black flex items-center justify-center ${fav.color}`}>
                    <fav.icon className="w-5 h-5" />
                  </div>
                  <button 
                    onClick={() => toggleFavorite(fav.id)}
                    className="p-1.5 border border-black bg-stone-50 text-[#e84e4e] hover:bg-[#e84e4e] hover:text-white transition-all transform active:scale-90"
                    title="Desfavoritar"
                  >
                    <Heart className="w-4 h-4 fill-[#e84e4e] hover:fill-white" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-black uppercase text-stone-400 tracking-widest">{fav.category}</span>
                  <p className="font-sans font-black text-sm uppercase leading-tight">{fav.title}</p>
                  <p className="font-serif italic text-xs text-stone-500">{fav.subtitle}</p>
                </div>
              </div>

              {fav.extra && (
                <div className="mt-6 pt-4 border-t border-black/10 bg-slate-50/50 p-3 flex items-start gap-2 border border-black/5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-[10px] text-stone-600 font-sans italic leading-tight">{fav.extra}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
