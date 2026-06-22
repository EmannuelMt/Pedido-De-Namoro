import React from 'react';
import { 
  Heart, 
  Camera, 
  Sparkles, 
  Film, 
  ChevronRight,
  Star,
  Lock,
  Smile,
  Compass,
  Gift,
  Search,
  X
} from 'lucide-react';
import { Memory } from '../../types';

interface GallerySidebarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  memories: Memory[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function GallerySidebar({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  memories,
  searchQuery,
  setSearchQuery
}: GallerySidebarProps) {
  
  const getCategoryIcon = (cat: string) => {
    if (cat.includes('❤️')) return <Heart className="w-4 h-4" />;
    if (cat.includes('🌸')) return <Sparkles className="w-4 h-4" />;
    if (cat.includes('✈️')) return <Compass className="w-4 h-4" />;
    if (cat.includes('🎂')) return <Gift className="w-4 h-4" />;
    if (cat.includes('😂')) return <Smile className="w-4 h-4" />;
    if (cat.includes('📷')) return <Camera className="w-4 h-4" />;
    if (cat.includes('⭐')) return <Star className="w-4 h-4" />;
    if (cat.includes('🔒')) return <Lock className="w-4 h-4" />;
    return <Film className="w-4 h-4" />;
  };

  const getCategoryCount = (cat: string) => {
    return memories.filter(m => {
      if (cat === 'Todos') return m.category !== '🔒 Privadas';
      if (cat === '⭐ Favoritas') return (m.likes || 0) >= 10;
      return m.category === cat;
    }).length;
  };

  return (
    <div className="space-y-12">
      {/* Search Module - Neobrutalist Search */}
      <div className="bg-white border-[5px] border-black p-6 rounded-[2rem] shadow-[10px_10px_0px_0px_#000] group focus-within:-translate-y-2 transition-all">
        <div className="flex items-center gap-5">
          <Search className="w-8 h-8 text-black group-focus-within:text-[#ff90e8] transition-colors" strokeWidth={4} />
          <input 
            type="text" 
            placeholder="PROCURAR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none font-black text-xs uppercase tracking-[0.3em] placeholder:text-black/10 flex-1 pt-1"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="bg-[#fcf9f2] p-2 rounded-xl border-[3px] border-black hover:bg-[#ff90e8] transition-all cursor-pointer">
              <X className="w-5 h-5" strokeWidth={5} />
            </button>
          )}
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white border-[5px] border-black p-10 rounded-[3.5rem] shadow-[15px_15px_0px_0px_#000]">
        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-black/20 mb-10 flex items-center gap-4 pl-1">
          <div className="w-4 h-4 bg-rose-500 rounded-full animate-ping" />
          Categorias
        </h4>

        <div className="flex flex-col gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = getCategoryCount(cat);
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center justify-between p-6 rounded-2xl border-[4px] border-black font-black uppercase tracking-[0.1em] text-[10px] transition-all group cursor-pointer active:translate-y-1 active:shadow-none ${
                  isSelected 
                    ? 'bg-[#ff90e8] text-black shadow-[6px_6px_0px_0px_#000] -translate-y-1' 
                    : 'bg-[#fcf9f2] text-black/60 hover:bg-white hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`transition-transform group-hover:scale-125 ${isSelected ? 'text-black' : 'text-black/40'}`}>
                    {getCategoryIcon(cat)}
                  </div>
                  <span className="truncate max-w-[140px] text-left leading-none">{cat === 'Todos' ? 'Tudo' : cat}</span>
                </div>
                <span className={`px-3 py-1 border-[3px] border-black rounded-xl font-black text-[9px] ${isSelected ? 'bg-white text-black shadow-[3px_3px_0px_0px_#000]' : 'bg-black/5 text-black/20'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secret Hint - Neobrutalist Tooltip Card */}
      <div className="bg-black border-[5px] border-black p-10 rounded-[2.5rem] shadow-[12px_12px_0px_0px_#ff90e8] relative overflow-hidden group">
        <div className="absolute -bottom-4 -right-4 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
          <Lock className="w-24 h-24 text-white" strokeWidth={1} />
        </div>
        <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ff90e8] mb-4 flex items-center gap-2">
           <Lock className="w-3 h-3" /> Protocolo de Acesso
        </h5>
        <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-white/40">
          A pasta <span className="text-white underline decoration-[#ff90e8] decoration-[3px] underline-offset-4">Privada</span> necessita do código <span className="text-[#ff90e8] bg-white/10 px-2 py-0.5 rounded">1234</span> para ser revelada.
        </p>
      </div>
    </div>
  );
}
