import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { AudioSettings } from '../AudioSettings';

export const MinimalMenu = ({
  user, userData, THEMES, themeMode, layoutMode,
  handleThemeChange, handleLayoutChange,
  audioManager, handleLogout, 
  updateUserSettings, setView
}: any) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'temas' | 'layouts' | 'sons'>('perfil');
  const [editingName, setEditingName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-8">
         <p className="text-gray-400 mb-8 max-w-sm text-center">É necessário autenticação para acessar as configurações.</p>
         <button onClick={() => setView('login')} className="text-gray-900 border-b border-gray-900 pb-1 flex items-center gap-2 hover:opacity-70 transition-opacity">
           Entrar <ArrowRight size={16} />
         </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800 p-8 md:p-16 lg:p-24 flex flex-col font-sans transition-colors duration-1000">
       
       <header className="flex justify-between items-center mb-16 md:mb-24">
          <h1 className="text-xl tracking-tight font-medium text-gray-900">Configurações</h1>
          <button onClick={() => setView('home')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Voltar</button>
       </header>

       <div className="flex flex-col md:flex-row gap-16 lg:gap-32 flex-1 max-w-6xl mx-auto w-full">
          {/* Nav */}
          <nav className="w-full md:w-64 flex flex-col space-y-6">
             {[
               { id: 'perfil', label: 'Perfil' },
               { id: 'temas', label: 'Aparência' },
               { id: 'layouts', label: 'Layout' },
               { id: 'sons', label: 'Áudio' },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`text-left text-lg md:text-xl transition-all ${
                   activeTab === tab.id ? 'text-gray-900 font-medium translate-x-2' : 'text-gray-400 hover:text-gray-600'
                 }`}
               >
                 {tab.label}
               </button>
             ))}
             
             <div className="mt-16 pt-8 border-t border-gray-200">
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition-colors">
                   Sair
                </button>
             </div>
          </nav>

          {/* Content */}
          <main className="flex-1">
             <AnimatePresence mode="wait">
                {activeTab === 'perfil' && (
                   <motion.div
                     key="perfil"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="max-w-md"
                   >
                      <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-12">Personagem</h2>
                      
                      <div className="flex items-center gap-8 mb-12">
                         <img src={userData?.photoURL || user?.photoURL} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-sm" />
                         <div>
                            <p className="text-2xl font-medium text-gray-900">{userData?.displayName || user?.displayName}</p>
                         </div>
                      </div>

                      {!isEditing ? (
                         <button onClick={() => { setIsEditing(true); setEditingName(userData?.displayName || user?.displayName || ''); }} className="text-sm border-b border-gray-400 pb-1 text-gray-600 hover:text-gray-900 transition-colors">
                            Editar Nome
                         </button>
                      ) : (
                         <div className="space-y-4">
                            <input 
                              value={editingName} 
                              onChange={(e) => setEditingName(e.target.value)} 
                              autoFocus
                              className="w-full text-xl bg-transparent border-b border-gray-300 py-2 outline-none focus:border-gray-900 transition-colors"
                            />
                            <div className="flex gap-4">
                               <button 
                                 onClick={async () => {
                                    await updateUserSettings(user.uid, { displayName: editingName });
                                    setIsEditing(false);
                                 }}
                                 className="px-4 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-800 transition-colors"
                               >
                                  Salvar
                               </button>
                               <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-500 hover:text-gray-900 text-sm transition-colors">Cancelar</button>
                            </div>
                         </div>
                      )}
                   </motion.div>
                )}

                {activeTab === 'temas' && (
                   <motion.div key="temas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-12">Paleta</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                         {(Object.keys(THEMES) as any[]).map(mode => (
                           <button
                             key={mode}
                             onClick={() => handleThemeChange(mode)}
                             className={`p-6 text-left border rounded-xl transition-all ${
                               themeMode === mode ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                             }`}
                           >
                              <div className="w-6 h-6 rounded-full mb-4" style={{ backgroundColor: THEMES[mode].primary }} />
                              <p className="font-medium text-gray-900">{THEMES[mode].label}</p>
                           </button>
                         ))}
                      </div>
                   </motion.div>
                )}

                {activeTab === 'layouts' && (
                   <motion.div key="layouts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-12">Estrutura</h2>
                      <div className="flex flex-col gap-2 max-w-sm">
                         {['auto', 'zen-minimal', 'romantic-center', 'timeline-story', 'cinema-scroll', 'dev-terminal', 'game-hud', 'holographic-ui'].map(mode => (
                           <button
                             key={mode}
                             onClick={() => handleLayoutChange(mode)}
                             className={`px-4 py-3 text-left rounded-lg transition-all ${
                               layoutMode === mode ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:bg-gray-50'
                             }`}
                           >
                              {mode.replace('-', ' ')}
                           </button>
                         ))}
                      </div>
                   </motion.div>
                )}

                {activeTab === 'sons' && (
                   <motion.div key="sons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-md">
                      <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-12">Volume</h2>
                      <div className="mb-16">
                         <AudioSettings />
                      </div>
                      
                      <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-6">Presets</h2>
                      <div className="flex flex-col gap-2">
                         {['minimalist', 'romantic', 'nature', 'retro_gamer', 'sci_fi_tech'].map(preset => (
                           <button 
                             key={preset}
                             onClick={() => audioManager.setSettings({ theme: preset as any })}
                             className={`px-4 py-3 text-left rounded-lg transition-all capitalize ${
                               audioManager.getSettings().theme === preset ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:bg-gray-50'
                             }`}
                           >
                              {preset.replace('_', ' ')}
                           </button>
                         ))}
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </main>
       </div>
    </div>
  );
};
