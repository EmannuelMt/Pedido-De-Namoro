import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  Trash2, 
  Sparkles, 
  MessageCircle, 
  ShoppingBag, 
  Trophy, 
  Gift, 
  Laptop, 
  Send, 
  Sliders, 
  Megaphone,
  CheckCheck,
  ArrowLeft,
  Settings,
  Timer
} from 'lucide-react';
import { useNotificationsStore, NotificationPriority, NotificationCategory } from '../../store/notifications';
import { useAuthStore } from '../../store/auth';
import toast from 'react-hot-toast';

export function NotificacoesTab() {
  const [_, setSearchParams] = useSearchParams();
  const { 
    notifications, 
    preferences, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll, 
    updatePreferences,
    addNotification,
    sendGlobalNotification
  } = useNotificationsStore();

  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState<'all' | NotificationCategory>('all');
  const [mainTab, setMainTab] = useState<'inbox' | 'simulator' | 'preferences'>('inbox');
  
  // Simulation form states
  const [simTitle, setSimTitle] = useState('🌟 Nova Conquista Gamer');
  const [simMessage, setSimMessage] = useState('Você alcançou o nível máximo na coleção PixelRepo!');
  const [simType, setSimType] = useState<NotificationPriority>('medium');
  const [simCategory, setSimCategory] = useState<NotificationCategory>('achievement');
  const [simIcon, setSimIcon] = useState('trophy');

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter(n => {
    if (activeCategory === 'all') return true;
    return n.category === activeCategory;
  });

  const getPriorityColor = (type: NotificationPriority) => {
    switch (type) {
      case 'critical': return 'border-black bg-red-400 text-black';
      case 'high': return 'border-black bg-orange-400 text-black';
      case 'medium': return 'border-black bg-blue-400 text-black';
      default: return 'border-black bg-stone-300 text-black';
    }
  };

  const getPriorityBadge = (type: NotificationPriority) => {
    switch (type) {
      case 'critical':
        return <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-red-500 text-white border-2 border-black font-black shadow-[2px_2px_0px_0px_#000]">CRÍTICO</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-orange-400 text-black border-2 border-black font-black shadow-[2px_2px_0px_0px_#000]">IMPORTANTE</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-blue-400 text-black border-2 border-black font-black shadow-[2px_2px_0px_0px_#000]">AVISO</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-stone-200 text-stone-700 border-2 border-black font-black shadow-[2px_2px_0px_0px_#000]">INFO</span>;
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'system': return <Settings className="w-4 h-4" />;
      case 'social': return <MessageCircle className="w-4 h-4" />;
      case 'store': return <ShoppingBag className="w-4 h-4" />;
      case 'achievement': return <Trophy className="w-4 h-4" />;
      case 'event': return <Gift className="w-4 h-4" />;
      case 'promotion': return <Sparkles className="w-4 h-4" />;
    }
  };

  const currentUnreadCount = notifications.filter(n => !n.readed).length;

  const runSimulation = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para simular notificações!');
      return;
    }
    await addNotification(simTitle, simMessage, simType, simCategory, simIcon);
  };

  const runGlobalPreset = async () => {
    await sendGlobalNotification(
      '📢 Nova Coleção Anime Hype!',
      'Molduras raras de edição limitada inspirada em mangás de sucesso já estão liberadas na Loja.',
      'high',
      'promotion',
      'gift'
    );
  };

  const runPreset = async (presetType: 'social' | 'achievement' | 'store' | 'system') => {
    if (!user) return;
    switch (presetType) {
      case 'social':
        await addNotification('📜 Nova Mensagem', 'Alguém deixou um comentário em sua vitrine.', 'low', 'social', 'message-circle');
        break;
      case 'achievement':
        await addNotification('🏆 Mestre dos Pixels!', 'Você desbloqueou o selo de contribuinte lendário.', 'high', 'achievement', 'trophy');
        break;
      case 'store':
        await addNotification('💎 Créditos', 'Seu resgate de 500 PixelCoins foi processado.', 'medium', 'store', 'sparkles');
        break;
      case 'system':
        await addNotification('🔒 Segurança', 'Detectamos um novo login em um navegador desconhecido.', 'high', 'system', 'shield');
        break;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-20 max-w-[1400px] mx-auto">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#fcf9f2] border-[4px] border-black p-6 md:p-8 rounded-[32px] shadow-[8px_8px_0px_0px_#000]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-pink-500 rounded-full border-[4px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] -rotate-6">
            <Bell className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">
              Central de Avisos
            </h2>
            <p className="font-sans text-xs font-black uppercase tracking-[0.2em] text-stone-500 mt-2">
              Você tem <span className="text-pink-500">{currentUnreadCount}</span> mensagens não lidas no seu portal.
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

      {/* 2. Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 bg-white border-[4px] border-black p-4 rounded-[28px] shadow-[6px_6px_0px_0px_#000]">
        {[
          { id: 'inbox', label: 'Feed Principal', icon: Bell, color: 'bg-amber-300' },
          { id: 'simulator', label: 'Estúdio de Avisos', icon: Megaphone, color: 'bg-emerald-400' },
          { id: 'preferences', label: 'Ajustes de Filtro', icon: Sliders, color: 'bg-purple-400' }
        ].map((tab) => {
          const isSelected = mainTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button 
              key={tab.id}
              onClick={() => setMainTab(tab.id as any)}
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
        {mainTab === 'inbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
              <div className="bg-white border-[4px] border-black p-5 rounded-[28px] shadow-[6px_6px_0px_0px_#000]">
                <h4 className="font-black text-sm uppercase tracking-widest border-b-[3px] border-black pb-3 mb-4 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-pink-500" strokeWidth={3} /> Filtrar Por
                </h4>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'all', label: 'Tudo', icon: Bell, count: notifications.length },
                    { id: 'system', label: 'Sistema', icon: Laptop, count: notifications.filter(n => n.category === 'system').length },
                    { id: 'social', label: 'Rede Social', icon: MessageCircle, count: notifications.filter(n => n.category === 'social').length },
                    { id: 'store', label: 'Loja', icon: ShoppingBag, count: notifications.filter(n => n.category === 'store').length },
                    { id: 'achievement', label: 'Conquistas', icon: Trophy, count: notifications.filter(n => n.category === 'achievement').length },
                    { id: 'event', label: 'Eventos', icon: Gift, count: notifications.filter(n => n.category === 'event').length },
                    { id: 'promotion', label: 'Promoção', icon: Sparkles, count: notifications.filter(n => n.category === 'promotion').length }
                  ].map((categoryItem) => {
                    const isSelected = activeCategory === categoryItem.id;
                    const IconComp = categoryItem.icon;
                    return (
                      <button
                        key={categoryItem.id}
                        onClick={() => setActiveCategory(categoryItem.id as any)}
                        className={`w-full text-left px-4 py-3 border-[3px] rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-between group cursor-pointer ${
                          isSelected 
                            ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_#ec4899]' 
                            : 'bg-[#fcf9f2] text-stone-600 border-black hover:bg-white hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-stone-400 group-hover:text-black'}`} strokeWidth={3} />
                          <span>{categoryItem.label}</span>
                        </div>
                        {categoryItem.count > 0 && (
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-black border-2 border-black ${isSelected ? 'bg-amber-300 text-black' : 'bg-white text-black shadow-[1px_1px_0px_0px_#000]'}`}>
                            {categoryItem.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-9">
              <div className="bg-white border-[4px] border-black p-6 md:p-8 rounded-[32px] shadow-[8px_8px_0px_0px_#000]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-[4px] border-black pb-6 mb-8 gap-4">
                  <div>
                    <h4 className="text-2xl font-black italic uppercase tracking-tighter">Histórico de Atividade</h4>
                    <p className="font-sans text-[10px] font-black uppercase tracking-widest text-pink-500 mt-1">
                      Feed Dinâmico • Atualizado em tempo real
                    </p>
                  </div>
                  {filteredNotifications.length > 0 && (
                    <div className="flex gap-2">
                      <button onClick={markAllAsRead} className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 border-[3px] border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer">
                        <CheckCheck className="w-4 h-4" strokeWidth={3} /> Lidas
                      </button>
                      <button onClick={clearAll} className="flex items-center gap-2 bg-red-400 hover:bg-red-300 border-[3px] border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer">
                        <Trash2 className="w-4 h-4" strokeWidth={3} /> Limpar
                      </button>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-20">
                    <div className="w-12 h-12 rounded-full border-[6px] border-stone-200 border-t-pink-500 animate-spin mx-auto mb-4" />
                    <span className="font-black text-xs uppercase tracking-widest text-stone-500">Sincronizando...</span>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-24 bg-[#fcf9f2] border-[4px] border-dashed border-black/20 rounded-[24px]">
                    <Bell className="w-16 h-16 text-stone-300 mx-auto mb-6" strokeWidth={2.5} />
                    <h5 className="font-black text-xl uppercase italic">Silêncio Total!</h5>
                    <p className="font-sans text-[11px] font-black uppercase tracking-widest text-stone-400 mt-2 max-w-sm mx-auto">
                      Não há novos avisos no momento. Suas notificações aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {filteredNotifications.map((alert) => (
                      <div key={alert.id} className={`relative p-5 border-[4px] border-black transition-all flex items-start gap-4 rounded-[20px] ${alert.readed ? 'bg-stone-50 opacity-60' : 'bg-white shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1'}`}>
                        <div className={`w-12 h-12 border-[3px] border-black rounded-2xl shrink-0 flex items-center justify-center ${getPriorityColor(alert.type)}`}>
                          {getCategoryIcon(alert.category)}
                        </div>
                        <div className="flex-1 pr-12">
                          <div className="flex items-center gap-3">
                            <h4 className="font-black text-sm uppercase tracking-tight">{alert.title}</h4>
                            {!alert.readed && <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-black animate-pulse" />}
                          </div>
                          <p className="text-[12px] text-stone-700 font-sans mt-2.5 font-black uppercase tracking-tight leading-relaxed">{alert.message}</p>
                          <div className="flex items-center gap-4 mt-4">
                            {getPriorityBadge(alert.type)}
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-500 font-black uppercase">
                              <Timer className="w-3 h-3" />
                              {alert.createdAt instanceof Date ? alert.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Agora'}
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          {!alert.readed && (
                            <button onClick={() => markAsRead(alert.id)} className="bg-emerald-400 border-[3px] border-black p-2 rounded-xl shadow-[2px_2px_0px_0px_#000] hover:bg-emerald-300 transition-all cursor-pointer">
                              <Check className="w-4 h-4 text-black" strokeWidth={3} />
                            </button>
                          )}
                          <button onClick={() => deleteNotification(alert.id)} className="bg-white border-[3px] border-black p-2 rounded-xl shadow-[2px_2px_0px_0px_#000] hover:bg-stone-100 transition-all cursor-pointer">
                            <Trash2 className="w-4 h-4 text-stone-500" strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {mainTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-amber-100 border-[4px] border-black p-6 md:p-10 rounded-[32px] shadow-[10px_10px_0px_0px_#000]">
              <h4 className="font-black text-2xl uppercase tracking-tighter border-b-[4px] border-black pb-4 mb-6 italic"><Megaphone className="w-8 h-8 text-pink-500" strokeWidth={3} /> Injetar Eventos</h4>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { id: 'social', label: 'Social', icon: '❤️', color: 'bg-emerald-200' },
                  { id: 'achievement', label: 'Conquista', icon: '🏆', color: 'bg-sky-200' },
                  { id: 'store', label: 'Loja', icon: '🛍️', color: 'bg-purple-200' },
                  { id: 'system', label: 'Segurança', icon: '🔒', color: 'bg-red-200' }
                ].map((p) => (
                  <button key={p.id} onClick={() => runPreset(p.id as any)} className={`border-[4px] border-black p-6 rounded-[24px] shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer ${p.color}`}>
                    <span className="text-4xl block mb-4">{p.icon}</span>
                    <span className="text-[11px] font-black uppercase">{p.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={runGlobalPreset} className="w-full mt-10 bg-indigo-600 text-white border-[4px] border-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer">📢 Sinal Global</button>
            </div>

            <div className="bg-white border-[4px] border-black p-6 md:p-10 rounded-[32px] shadow-[10px_10px_0px_0px_#000]">
              <h4 className="font-black text-2xl uppercase tracking-tighter border-b-[4px] border-black pb-4 mb-6 italic"><Sliders className="w-8 h-8 text-indigo-600" strokeWidth={3} /> Customizar</h4>
              <div className="space-y-6">
                <input type="text" value={simTitle} onChange={e => setSimTitle(e.target.value)} className="w-full border-[3px] border-black p-4 bg-[#fcf9f2] text-xs font-black uppercase rounded-2xl shadow-[4px_4px_0px_0px_#000]" placeholder="Título" />
                <textarea value={simMessage} onChange={e => setSimMessage(e.target.value)} rows={2} className="w-full border-[3px] border-black p-4 bg-[#fcf9f2] text-xs font-black uppercase rounded-2xl shadow-[4px_4px_0px_0px_#000] resize-none" placeholder="Mensagem" />
                <div className="grid grid-cols-2 gap-5">
                  <select value={simCategory} onChange={e => setSimCategory(e.target.value as any)} className="border-[3px] border-black p-4 bg-white text-[10px] font-black uppercase rounded-2xl shadow-[4px_4px_0px_0px_#000]">
                    <option value="system">Sistema</option><option value="social">Social</option><option value="store">Loja</option>
                  </select>
                  <select value={simType} onChange={e => setSimType(e.target.value as any)} className="border-[3px] border-black p-4 bg-white text-[10px] font-black uppercase rounded-2xl shadow-[4px_4px_0px_0px_#000]">
                    <option value="low">Normal</option><option value="critical">Crítico</option>
                  </select>
                </div>
                <button onClick={runSimulation} className="w-full bg-black text-white py-6 rounded-2xl border-[4px] border-black font-black text-xs uppercase shadow-[8px_8px_0px_0px_#ec4899] hover:-translate-y-1 transition-all cursor-pointer">Enviar Pulso</button>
              </div>
            </div>
          </div>
        )}

        {mainTab === 'preferences' && (
          <div className="max-w-3xl mx-auto bg-white border-[4px] border-black p-8 md:p-12 rounded-[40px] shadow-[12px_12px_0px_0px_#000]">
            <h4 className="text-3xl font-black uppercase italic border-b-[4px] border-black pb-8 mb-10"><Sliders className="w-10 h-10 inline mr-4" strokeWidth={3} /> Engrenagens de Filtro</h4>
            <div className="space-y-4">
              {[
                { key: 'system', label: 'Sistema', icon: Laptop, color: 'bg-red-200' },
                { key: 'social', label: 'Social', icon: MessageCircle, color: 'bg-emerald-200' },
                { key: 'store', label: 'Recibos', icon: ShoppingBag, color: 'bg-indigo-200' },
                { key: 'achievements', label: 'Troféus', icon: Trophy, color: 'bg-amber-200' }
              ].map((p) => {
                const isChecked = preferences[p.key as keyof typeof preferences];
                return (
                  <div key={p.key} onClick={() => updatePreferences({ [p.key]: !isChecked })} className={`flex items-center justify-between border-[3px] border-black p-5 rounded-[20px] transition-all cursor-pointer ${isChecked ? 'bg-white' : 'bg-stone-50 opacity-60'}`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 border-[3px] border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000] ${p.color}`}><p.icon className="w-6 h-6" strokeWidth={3} /></div>
                      <span className="text-sm font-black uppercase">{p.label}</span>
                    </div>
                    <div className={`w-14 h-8 border-[3px] border-black rounded-full flex items-center p-1 transition-all ${isChecked ? 'bg-emerald-400 justify-end' : 'bg-stone-200 justify-start'}`}><div className="w-5 h-5 bg-white border-[2px] border-black rounded-full" /></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
