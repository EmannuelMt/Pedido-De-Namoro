import { useState } from 'react';
import { History, Search, Calendar, Filter, Sparkles, Heart, Trophy, FileText, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

export function AtividadeTab() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [activities, setActivities] = useState([
    { id: 1, type: "quiz", user: "Emanuel", desc: "Desbloqueou a conquista ⭐ 'Primeira Vitória' com pontuação máxima no Quiz do Casal.", date: "Hoje, 09:30", category: "jogos", icon: Trophy, color: "text-amber-500 bg-amber-50" },
    { id: 3, type: "media", user: "Emanuel", desc: "Adicionou 5 novas fotografias no álbum colaborativo 'Viagem à Praia'.", date: "15 Jun, 16:40", category: "midias", icon: Heart, color: "text-red-500 bg-red-50" },
    { id: 4, type: "security", user: "Priscila", desc: "Realizou login através de um novo dispositivo móvel (iPhone 14 Pro).", date: "14 Jun, 11:23", category: "seguranca", icon: Smartphone, color: "text-zinc-600 bg-stone-100" },
    { id: 5, type: "profile", user: "Emanuel", desc: "Atualizou o avatar de perfil com foto recente em formato alta definição.", date: "12 Jun, 15:10", category: "perfil", icon: FileText, color: "text-blue-500 bg-blue-50" },
    { id: 6, type: "quiz", user: "Priscila", desc: "Completou o 'Quiz de Compatibilidade de Almas' registrando 98% de harmonia.", date: "10 Jun, 19:40", category: "jogos", icon: Trophy, color: "text-yellow-500 bg-yellow-50" },
  ]);

  const filteredActivities = activities.filter(act => {
    const matchesFilter = activeFilter === 'all' || act.category === activeFilter;
    const matchesSearch = act.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          act.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleClearHistory = () => {
    setActivities([]);
    toast.success("Histórico de atividades limpo localmente!");
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title block */}
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">⏳ Histórico de Atividade</h3>
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Monitore as ações, conquistas e alterações realizadas no portal do casal</p>
        </div>
        
        {activities.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="px-4 py-2 bg-stone-100 hover:bg-neutral-200 border-2 border-black text-xs font-sans font-bold uppercase tracking-widest text-[#1a1a1a] transition-colors"
          >
            Limpar Registro
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_#1a1a1a]">
          <h4 className="font-black text-lg italic border-b-2 border-black pb-4 mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filtrar</span>
          </h4>
          
          <div className="flex flex-col gap-2">
            {[
              { id: 'all', label: 'Tudo' },
              { id: 'jogos', label: 'Jogos & Quiz' },
              { id: 'midias', label: 'Fotos & Álbuns' },
              { id: 'seguranca', label: 'Segurança' },
              { id: 'perfil', label: 'Perfil' },
            ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveFilter(btn.id)}
                  className={`w-full text-left px-4 py-3 font-sans font-bold uppercase text-[10px] tracking-widest border transition-all ${activeFilter === btn.id ? 'bg-[#e84e4e] text-white border-black' : 'bg-stone-50 hover:bg-neutral-100 text-[#1a1a1a] border-black/10'}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="mt-6 border-t border-black/10 pt-6">
              <span className="text-[9px] font-sans font-black uppercase tracking-widest opacity-60 block mb-2">Buscar Atividade</span>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="DIGITE..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-black/15 focus:border-[#e84e4e] py-2 pl-9 pr-3 text-xs outline-none uppercase font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline block */}
        <div className="lg:col-span-3">
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a]">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-16">
                <History className="w-12 h-12 text-stone-300 mx-auto mb-4 animate-pulse" />
                <h5 className="font-black text-lg text-stone-800">Nenhum evento localizado</h5>
                <p className="font-sans text-[9px] font-bold uppercase tracking-widest opacity-50 mt-1">Tente trocar os filtros aplicados na lateral</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-black ml-4 pl-8 py-2 space-y-10">
                {filteredActivities.map((act) => (
                  <div key={act.id} className="relative group">
                    {/* Circle icon on line */}
                    <div className={`absolute -left-[45px] top-1 w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-white group-hover:scale-110 transition-transform ${act.color}`}>
                      <act.icon className="w-4 h-4" />
                    </div>

                    <div className="border-2 border-black p-5 bg-stone-50/50 hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-2 mb-3">
                        <span className="text-xs font-black uppercase text-[#e84e4e] tracking-tight">{act.user}</span>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-stone-400">
                          <Calendar className="w-3 h-3" />
                          <span>{act.date}</span>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed text-stone-700 font-sans font-medium">
                        {act.desc}
                      </p>

                      <span className="inline-block mt-3 px-2 py-0.5 border border-black text-[8px] font-mono font-black uppercase bg-white">
                        {act.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
