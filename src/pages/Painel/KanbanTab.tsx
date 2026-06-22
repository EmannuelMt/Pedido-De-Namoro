import { Plus, GripVertical, MoreHorizontal } from 'lucide-react';

const KANBAN_COLS = [
  { id: 'backlog', title: 'Backlog', color: '#64748b' },
  { id: 'todo', title: 'A Fazer', color: '#1a1a1a' },
  { id: 'progress', title: 'Em Andamento', color: '#e84e4e' },
  { id: 'done', title: 'Concluído', color: '#22c55e' }
];

const TASKS = [
  { id: 1, col: 'backlog', title: 'Sistema de Badges' },
  { id: 2, col: 'todo', title: 'Criar novas molduras' },
  { id: 3, col: 'progress', title: 'Temas Premium' },
  { id: 4, col: 'done', title: 'Login com Google' },
  { id: 5, col: 'done', title: 'Dashboard Base' },
];

export function KanbanTab() {
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end border-b-2 border-black pb-4">
        <div>
          <h2 className="text-4xl font-black italic">Quadro Kanban</h2>
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Organize suas metas e sprints</p>
        </div>
        <button className="bg-[#1a1a1a] text-white border-2 border-black px-4 py-2 font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_#e84e4e] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-2">
          <Plus className="w-3 h-3" /> Nova Tarefa
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {KANBAN_COLS.map(col => (
          <div key={col.id} className="w-80 shrink-0 flex flex-col">
             {/* Column Header */}
             <div className="bg-white border-2 border-black p-3 mb-4 flex justify-between items-center shadow-[4px_4px_0px_0px_#1a1a1a]">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 border border-black" style={{ backgroundColor: col.color }} />
                 <h3 className="font-black uppercase text-sm tracking-wider">{col.title}</h3>
               </div>
               <span className="font-sans text-[10px] font-bold bg-gray-100 px-2 py-0.5 border border-black/20">
                 {TASKS.filter(t => t.col === col.id).length}
               </span>
             </div>

             {/* Tasks List */}
             <div className="flex-1 space-y-4">
                {TASKS.filter(t => t.col === col.id).map(task => (
                   <div key={task.id} className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#1a1a1a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_#e84e4e] transition-all cursor-pointer group">
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-black/20 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm leading-snug">{task.title}</h4>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="w-6 h-6 rounded-full border border-black bg-yellow-100 flex items-center justify-center text-[8px] font-black">L</div>
                            <button className="text-black/20 hover:text-black">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                   </div>
                ))}
                
                {/* Add task to column */}
                <button className="w-full py-3 border-2 border-dashed border-black/20 text-black/40 font-sans font-bold text-[10px] uppercase tracking-widest hover:border-black hover:bg-white hover:text-black transition-all">
                   + Adicionar Cartão
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
