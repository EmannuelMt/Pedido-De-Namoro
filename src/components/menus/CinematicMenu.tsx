import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Palette, Compass, Music, LogOut, ArrowRight, X } from 'lucide-react';
import { AudioSettings } from '../AudioSettings';

export const CinematicMenu = ({
  user, userData, THEMES, themeMode, layoutMode,
  handleThemeChange, handleLayoutChange,
  audioManager, handleLogout, 
  updateUserSettings, setView
}: any) => {
  const [activeTab, setActiveTab] = useState<'none' | 'perfil' | 'temas' | 'layouts' | 'sons'>('none');
  const [editingName, setEditingName] = useState('');

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center text-white">
         <h1 className="text-4xl font-serif mb-4 tracking-widest uppercase">Acesso Necessário</h1>
         <p className="text-white/50 mb-8 max-w-md text-center">Inicie sua sessão para configurar a experiência do filme.</p>
         <button onClick={() => setView('login')} className="px-8 py-4 bg-white text-black uppercase tracking-widest font-bold text-xs flex items-center gap-4 hover:scale-105 transition-transform">
           Entrar <ArrowRight size={16} />
         </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl text-white overflow-hidden flex flex-col">
       {/* Background glow base on theme */}
       <div 
         className="absolute inset-0 opacity-10 pointer-events-none transition-colors duration-1000" 
         style={{ background: `radial-gradient(circle at 50% 0%, ${THEMES[themeMode]?.primary || '#fff'} 0%, transparent 70%)` }} 
       />

       {/* Header / Close */}
       <div className="p-8 flex justify-between items-center relative z-10">
          <p className="font-serif italic text-2xl opacity-60">Configurações</p>
          <button onClick={() => setView('home')} className="p-4 hover:bg-white/10 rounded-full transition-colors flex gap-2 items-center">
             <span className="uppercase text-xs tracking-widest opacity-50">voltar</span>
             <X size={24} />
          </button>
       </div>

       <div className="flex-1 flex flex-col md:flex-row h-full">
          {/* Menu Sidebar */}
          <div className="w-full md:w-1/3 border-r border-white/5 p-8 flex flex-col justify-center gap-8 relative z-10">
             {[
               { id: 'perfil', label: 'Personagem Principal' },
               { id: 'temas', label: 'Direção de Arte' },
               { id: 'layouts', label: 'Enquadramento' },
               { id: 'sons', label: 'Trilha Sonora' },
             ].map((tab, idx) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-left text-3xl md:text-5xl font-serif tracking-tight transition-all duration-500 group flex items-center gap-6 ${activeTab === tab.id ? 'text-white scale-105' : 'text-white/30 hover:text-white/70 hover:translate-x-4'}`}
                >
                   {activeTab === tab.id && <motion.div layoutId="cinema-menu-dot" className="w-2 h-2 rounded-full bg-white" />}
                   {tab.label}
                </motion.button>
             ))}
             
             <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={handleLogout}
                className="mt-16 text-left text-rose-500/50 hover:text-rose-500 font-serif text-2xl uppercase tracking-widest transition-colors flex items-center gap-4"
             >
                <LogOut size={20} /> Encerrar Sessão
             </motion.button>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-2/3 p-8 md:p-16 relative z-10 overflow-y-auto">
             <AnimatePresence mode="wait">
                {activeTab === 'none' && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="h-full flex items-center justify-center"
                   >
                      <h2 className="text-[10vw] font-serif text-white/5 italic select-none">Menu</h2>
                   </motion.div>
                )}

                {activeTab === 'perfil' && (
                   <motion.div
                     key="perfil"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ duration: 0.5, ease: "easeOut" }}
                     className="max-w-2xl"
                   >
                      <p className="uppercase tracking-[0.4em] text-xs text-white/50 mb-12">Ator em cena</p>
                      <div className="flex items-center gap-12 mb-12">
                         <img src={userData?.photoURL || user?.photoURL} alt="Avatar" className="w-48 h-48 rounded-full border border-white/20 grayscale hover:grayscale-0 transition-all duration-1000 object-cover" />
                         <div>
                            <h2 className="text-6xl font-serif mb-4">{userData?.displayName || user?.displayName}</h2>
                            <p className="text-white/50 font-serif italic text-xl">{userData?.bio || "A história está apenas começando."}</p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <p className="text-white/30 text-sm">Atualizar Nome em Cena</p>
                         <div className="flex gap-4">
                            <input 
                              value={editingName} 
                              onChange={(e) => setEditingName(e.target.value)} 
                              placeholder="Novo nome" 
                              className="bg-transparent border-b border-white/20 w-full px-4 py-2 outline-none focus:border-white transition-colors font-serif text-2xl"
                            />
                            <button 
                              onClick={() => {
                                 if(editingName) updateUserSettings(user.uid, { displayName: editingName });
                              }}
                              className="px-8 py-2 bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs font-bold"
                            >
                               Corte (Salvar)
                            </button>
                         </div>
                      </div>
                   </motion.div>
                )}

                {activeTab === 'temas' && (
                   <motion.div
                     key="temas"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="max-w-4xl"
                   >
                      <p className="uppercase tracking-[0.4em] text-xs text-white/50 mb-12">Paleta de Cores do Filme</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {(Object.keys(THEMES) as any[]).map(mode => (
                           <button
                             key={mode}
                             onClick={() => handleThemeChange(mode)}
                             className={`p-8 text-left transition-all border ${themeMode === mode ? 'border-white bg-white/10 scale-105' : 'border-white/10 hover:border-white/50 bg-black/40'}`}
                             style={{
                               boxShadow: themeMode === mode ? `0 0 50px ${THEMES[mode].primary}40` : 'none'
                             }}
                           >
                              <div className="flex items-center gap-4 mb-4">
                                 <div className="w-8 h-8 rounded-full" style={{ backgroundColor: THEMES[mode].primary }} />
                                 <span className="font-serif text-2xl">{THEMES[mode].label}</span>
                              </div>
                              <p className="text-white/40text-xs uppercase tracking-widest opacity-60">Categoria: {THEMES[mode].category}</p>
                           </button>
                         ))}
                      </div>
                   </motion.div>
                )}

                {activeTab === 'layouts' && (
                   <motion.div
                     key="layouts"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="max-w-4xl"
                   >
                      <p className="uppercase tracking-[0.4em] text-xs text-white/50 mb-12">Roteiro Visual</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {['auto', 'cinema-scroll', 'romantic-center', 'timeline-story', 'game-hud', 'dev-terminal', 'holographic-ui', 'zen-minimal'].map(mode => (
                           <button
                             key={mode}
                             onClick={() => handleLayoutChange(mode)}
                             className={`p-6 text-left transition-all border ${layoutMode === mode ? 'border-white bg-white/10 scale-105' : 'border-white/10 hover:border-white/50 bg-black/40'}`}
                           >
                              <span className="font-serif text-xl">{mode}</span>
                           </button>
                         ))}
                      </div>
                   </motion.div>
                )}

                {activeTab === 'sons' && (
                   <motion.div
                     key="sons"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="max-w-2xl"
                   >
                      <p className="uppercase tracking-[0.4em] text-xs text-white/50 mb-12">Trilha Sonora Original</p>
                      <div className="bg-black/50 p-8 border border-white/10 rounded-2xl mb-8">
                         <AudioSettings />
                      </div>
                      
                      <p className="uppercase tracking-[0.4em] text-xs text-white/50 mb-6">Presets de Áudio</p>
                      <div className="grid grid-cols-2 gap-4">
                         {['minimalist', 'romantic', 'nature', 'retro_gamer', 'sci_fi_tech'].map(preset => (
                           <button 
                             key={preset}
                             onClick={() => audioManager.setSettings({ theme: preset as any })}
                             className={`p-4 border text-left uppercase tracking-widest text-xs font-bold transition-all ${
                               audioManager.getSettings().theme === preset ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/50'
                             }`}
                           >
                              {preset.replace('_', ' ')}
                           </button>
                         ))}
                      </div>
                   </motion.div>
                )}

             </AnimatePresence>
          </div>
       </div>
    </div>
  );
};
