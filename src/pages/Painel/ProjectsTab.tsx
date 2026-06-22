import { Plus, Folder, Clock, MoreVertical, LayoutGrid, List } from 'lucide-react';

export function ProjectsTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-4xl font-black italic">Meus Projetos</h2>
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Gerencie seus portfólios e experiências</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
           <button className="bg-[#e84e4e] text-white border-2 border-black px-6 py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#1a1a1a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
             <Plus className="w-4 h-4" /> Novo Projeto
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
           { name: "Galeria de Casamento", status: "Ativo", date: "Atualizado ontem", color: "#e84e4e" },
           { name: "App Financeiro", status: "Desenvolvimento", date: "Atualizado há 3 dias", color: "#3b82f6" },
           { name: "Blog Pessoal", status: "Concluído", date: "Atualizado há 1 semana", color: "#22c55e" },
           { name: "Painel SaaS", status: "Pausado", date: "Atualizado há 1 mês", color: "#f59e0b" },
        ].map((proj, i) => (
          <div key={i} className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_#1a1a1a] flex flex-col justify-between group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_#1a1a1a] transition-all">
             <div>
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 border-2 border-black flex items-center justify-center" style={{ backgroundColor: proj.color }}>
                      <Folder className="w-5 h-5 text-white" />
                   </div>
                   <button className="p-1 hover:bg-gray-100 border border-transparent hover:border-black transition-colors">
                     <MoreVertical className="w-4 h-4" />
                   </button>
                </div>
                <h3 className="font-black text-xl mb-1 truncate">{proj.name}</h3>
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {proj.date}
                </p>
             </div>
             
             <div className="mt-8 pt-4 border-t-2 border-black/10 flex justify-between items-center">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-1 border border-black/20 bg-gray-50">
                  {proj.status}
                </span>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-black bg-gray-200" />
                  <div className="w-6 h-6 rounded-full border-2 border-black bg-gray-300" />
                </div>
             </div>
          </div>
        ))}
        
        {/* Empty State / Add New */}
        <button className="border-4 border-dashed border-black/20 p-6 flex flex-col items-center justify-center gap-4 text-[#1a1a1a]/40 hover:text-[#1a1a1a] hover:border-black hover:bg-white transition-all min-h-[200px]">
           <Plus className="w-10 h-10" />
           <span className="font-black uppercase tracking-widest text-sm">Criar Novo Projeto</span>
        </button>
      </div>
    </div>
  );
}
