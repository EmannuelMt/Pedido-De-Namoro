import { Key, Copy, Plus, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export function APIKeysTab() {
  const [keys] = useState([
    { id: '1', name: 'Produção Primária', key: 'pk_live_51Mabc...', prefix: 'pk_live', created: '10/05/2026', lastUsed: 'Hoje, 14:30', active: true },
    { id: '2', name: 'Sandbox Desenvolvimento', key: 'sk_test_89Xyz...', prefix: 'sk_test', created: '15/05/2026', lastUsed: 'Há 2 dias', active: true },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a]">
        <div>
          <h2 className="text-4xl font-black italic">Chaves de API</h2>
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Integração do sistema com serviços externos</p>
        </div>
        <button className="bg-[#1a1a1a] text-white border-2 border-black px-6 py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#e84e4e] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Gerar Nova Chave
        </button>
      </div>

      <div className="bg-[#e84e4e]/10 border-2 border-[#e84e4e] p-4 flex gap-4 items-start">
         <AlertTriangle className="w-6 h-6 text-[#e84e4e] shrink-0" />
         <div>
            <h4 className="font-black text-[#e84e4e]">Aviso de Segurança</h4>
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#e84e4e]/80 mt-1">Nunca compartilhe suas chaves secretas (sk_live). Elas dão acesso total à sua conta. Utilize as chaves restritas sempre que possível.</p>
         </div>
      </div>

      <div className="space-y-4">
         {keys.map((k) => (
           <div key={k.id} className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_#1a1a1a] flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-gray-100 border-2 border-black flex items-center justify-center shrink-0">
                    <Key className="w-5 h-5 opacity-60" />
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-lg">{k.name}</h4>
                      <span className="font-sans text-[8px] font-bold uppercase tracking-widest border border-black/20 bg-gray-50 px-2 py-0.5">{k.prefix}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                       <code className="bg-gray-100 border border-black/20 px-3 py-1 font-mono text-sm">{k.key}</code>
                       <button className="p-1.5 hover:bg-gray-100 border border-transparent hover:border-black transition-colors" title="Copiar">
                         <Copy className="w-4 h-4" />
                       </button>
                    </div>
                    
                    <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-40 mt-3">Criado em: {k.created} • Último uso: {k.lastUsed}</p>
                 </div>
              </div>

              <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity justify-end">
                 <button className="bg-white text-black border-2 border-black px-4 py-2 font-black uppercase text-[10px] hover:bg-gray-100 transition-colors">
                   Rolar Chave
                 </button>
                 <button className="bg-white text-[#e84e4e] border-2 border-black px-4 py-2 hover:bg-[#e84e4e] hover:text-white transition-colors" title="Excluir">
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
