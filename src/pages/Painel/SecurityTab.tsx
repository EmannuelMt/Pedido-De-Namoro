import { useState } from 'react';
import { 
  Shield, 
  Key, 
  AlertTriangle, 
  Monitor, 
  CheckCircle2, 
  Lock, 
  Fingerprint, 
  Globe, 
  History,
  Smartphone,
  ArrowLeft
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export function SecurityTab() {
  const [activeTab, setActiveTab] = useState<'password' | 'mfa' | 'sessions'>('password');
  const [_, setSearchParams] = useSearchParams();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-20 max-w-[1400px] mx-auto">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#fcf9f2] border-[4px] border-black p-6 md:p-8 rounded-[32px] shadow-[8px_8px_0px_0px_#000]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-400 rounded-full border-[4px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] rotate-3">
            <Shield className="w-8 h-8 text-black" strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">
              Quarteto de Defesa
            </h2>
            <p className="font-sans text-xs font-black uppercase tracking-[0.2em] text-stone-500 mt-2">
              Sua conta está <span className="text-emerald-500">Protegida</span> • Último login: Hoje em São Paulo
            </p>
          </div>
        </div>

        <div className="flex gap-3 shrink-0">
          <button 
            onClick={() => setSearchParams({ tab: 'geral' })}
            className="flex items-center gap-2 bg-white hover:bg-stone-50 border-[3px] border-black px-5 py-3 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
            Voltar ao Painel
          </button>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 bg-white border-[4px] border-black p-4 rounded-[28px] shadow-[6px_6px_0px_0px_#000]">
        {[
          { id: 'password', label: 'Segurança & Senha', icon: Lock, color: 'bg-rose-300' },
          { id: 'mfa', label: 'Validadores 2FA', icon: Fingerprint, color: 'bg-indigo-300' },
          { id: 'sessions', label: 'Monitor de Sessões', icon: Globe, color: 'bg-sky-300' }
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[140px] px-6 py-4 border-[3px] border-black rounded-2xl transition-all font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#1a1a1a] cursor-pointer ${
                isSelected 
                  ? `${tab.color} translate-y-0.5 shadow-none` 
                  : 'bg-stone-50 text-stone-600 hover:bg-white hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#1a1a1a]'
              }`}
            >
              <IconComp className="w-4 h-4" strokeWidth={3} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 3. Content Area */}
      <div className="pt-4">
        {/* VIEW 1: PASSWORD */}
        {activeTab === 'password' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="bg-white border-[4px] border-black p-6 md:p-10 rounded-[32px] shadow-[10px_10px_0px_0px_#000]">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter border-b-[4px] border-black pb-4 mb-8 flex items-center gap-3">
                  <Key className="w-8 h-8 text-[#e84e4e]" strokeWidth={3} /> Alteração de Chave
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] block pl-1 text-stone-400">Senha Vigente</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full border-[3px] border-black p-4 bg-[#fcf9f2] text-xs font-black uppercase rounded-2xl shadow-[4px_4px_0px_0px_#000] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none outline-none transition-all placeholder:text-stone-300" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] block pl-1 text-stone-400">Nova Sequência</label>
                      <input 
                        type="password" 
                        placeholder="MÍN. 8 CHARS" 
                        className="w-full border-[3px] border-black p-4 bg-[#fcf9f2] text-xs font-black uppercase rounded-2xl shadow-[4px_4px_0px_0px_#000] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none outline-none transition-all placeholder:text-stone-300" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] block pl-1 text-stone-400">Repetir Sequência</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full border-[3px] border-black p-4 bg-[#fcf9f2] text-xs font-black uppercase rounded-2xl shadow-[4px_4px_0px_0px_#000] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none outline-none transition-all placeholder:text-stone-300" 
                      />
                    </div>
                  </div>

                  <button className="mt-6 w-full bg-emerald-400 text-black border-[4px] border-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 cursor-pointer transition-all">
                    <CheckCircle2 size={20} strokeWidth={3} />
                    Validar Novo Token
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-8">
              <div className="bg-amber-100 border-[4px] border-black p-8 rounded-[32px] shadow-[8px_8px_0px_0px_#000] -rotate-1">
                <h4 className="font-black text-sm uppercase tracking-widest border-b-[3px] border-black pb-3 mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" /> Protocolos
                </h4>
                <div className="space-y-5">
                  {[
                    { label: "Robustez", desc: "Use no mínimo 12 caracteres mistos" },
                    { id: 2, label: "Complexidade", desc: "Integre símbolos e números aleatórios" },
                    { id: 3, label: "Frequência", desc: "Mude sua chave a cada ciclo de 6 meses" }
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-mono text-[10px] font-black">{i+1}</div>
                      <div>
                        <span className="block text-[11px] font-black uppercase tracking-tight text-black">{tip.label}</span>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mt-0.5">{tip.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: MFA */}
        {activeTab === 'mfa' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-stone-900 border-[4px] border-black p-8 md:p-12 rounded-[40px] shadow-[12px_12px_0px_0px_#000] text-center">
              <div className="w-24 h-24 bg-indigo-500 rounded-3xl border-[4px] border-black flex items-center justify-center shadow-[6px_6px_0px_0px_#e84e4e] mx-auto mb-10 rotate-6 relative">
                <Fingerprint className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic leading-none mb-6">
                Rede de Autenticação
              </h3>
              
              <p className="font-sans text-[12px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Adicione uma armadura extra ao seu portal. Exigiremos um código gerado pelo seu app de confiança em cada novo acesso externo.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {[
                  { 
                    label: "App Autenticador", 
                    desc: "Google, Microsoft ou Authy.", 
                    icon: Smartphone, 
                    badge: "Elite", 
                    active: true,
                    color: "bg-indigo-500"
                  },
                  { 
                    label: "Sinal SMS", 
                    desc: "Receba via rede telefônica.", 
                    icon: History, 
                    badge: "Breve", 
                    active: false,
                    color: "bg-stone-500"
                  }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className={`bg-white/5 border-[3px] border-white/10 p-8 rounded-[32px] flex flex-col gap-6 transition-all ${item.active ? 'hover:bg-white/10 hover:border-white/30' : 'opacity-40 grayscale cursor-not-allowed'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 ${item.color} rounded-2xl border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]`}>
                        <item.icon className="w-7 h-7 text-white" strokeWidth={3} />
                      </div>
                      <span className={`px-3 py-1 border-2 border-black rounded-lg text-[9px] font-black uppercase ${item.active ? 'bg-emerald-400 text-black' : 'bg-stone-700 text-stone-300'}`}>
                        {item.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xl uppercase tracking-tighter italic">{item.label}</h4>
                      <p className="font-sans text-[10px] font-black uppercase tracking-widest text-white/30 mt-2">{item.desc}</p>
                    </div>
                    <button 
                      disabled={!item.active}
                      className={`w-full py-4 rounded-2xl border-[3px] border-black font-black uppercase text-[11px] tracking-widest transition-all ${item.active ? 'bg-white text-black shadow-[4px_4px_0px_0px_#e84e4e] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#e84e4e]' : 'bg-stone-800 text-stone-500'}`}
                    >
                      {item.active ? 'Inicializar Link' : 'Em Desenvolvimento'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SESSIONS */}
        {activeTab === 'sessions' && (
          <div className="bg-white border-[4px] border-black p-6 md:p-10 rounded-[32px] shadow-[10px_10px_0px_0px_#000]">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b-[4px] border-black pb-8 gap-6">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-sky-400 rounded-2xl border-[4px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] -rotate-3">
                     <Monitor className="w-8 h-8 text-black" strokeWidth={3} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Radar de Acesso</h3>
                      <p className="font-sans text-[10px] font-black uppercase tracking-widest text-stone-400 mt-2">Dispositivos logados agora em sua rede</p>
                   </div>
                </div>
                <button className="bg-white hover:bg-[#e84e4e] hover:text-white border-[3px] border-black rounded-2xl px-6 py-4 font-black uppercase text-[11px] tracking-widest shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer">
                  Desconectar Todos
                </button>
             </div>

             <div className="space-y-6">
                {[
                  { dev: "Workstation M2 Max", location: "São Paulo, Brasil", ip: "192.168.1.100", active: true, icon: Monitor, color: "bg-purple-300" },
                  { dev: "Dispositivo Mobile v14", location: "São Paulo, Brasil", ip: "172.20.10.2", active: false, icon: Smartphone, color: "bg-emerald-300" },
                  { dev: "Terminal Windows 11", location: "Curitiba, Brasil", ip: "187.42.110.45", active: false, icon: Monitor, color: "bg-rose-300" },
                ].map((sess, i) => (
                  <div key={i} className="p-6 bg-[#fcf9f2] border-[4px] border-black rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all group">
                     <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className={`w-14 h-14 ${sess.color} rounded-2xl border-[3px] border-black flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_#000] group-hover:rotate-6 transition-transform`}>
                           <sess.icon className="w-7 h-7 text-black" strokeWidth={3} />
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                             <h4 className="font-black uppercase text-lg tracking-tight italic">{sess.dev}</h4>
                             {sess.active && (
                               <span className="bg-emerald-400 text-black text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000]">Live</span>
                             )}
                           </div>
                           <p className="font-sans text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mt-1">{sess.location} • {sess.ip}</p>
                        </div>
                     </div>
                     {!sess.active && (
                       <button className="w-full md:w-auto text-[10px] font-black uppercase tracking-widest bg-white hover:bg-[#e84e4e] hover:text-white border-[3px] border-black rounded-xl px-6 py-3 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer">
                         Expulsar
                       </button>
                     )}
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
