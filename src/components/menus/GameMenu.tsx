import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, User, Palette, Compass, Music, LogOut, ArrowRight, ShieldAlert, Zap } from 'lucide-react';
import { AudioSettings } from '../AudioSettings';

export const GameMenu = ({
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
      <div className="fixed inset-0 z-[100] bg-[#0a0a1a] flex flex-col items-center justify-center text-blue-400 font-mono">
         <ShieldAlert size={64} className="mb-8 text-rose-500 animate-pulse" />
         <h1 className="text-4xl mb-4 tracking-widest uppercase text-rose-500">ACCESS DENIED</h1>
         <p className="text-blue-500/50 mb-8 max-w-md text-center">PLAYER 1 NOT FOUND. PLEASE INSERT COIN (LOGIN).</p>
         <button onClick={() => setView('login')} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-widest font-bold text-xs flex items-center gap-4 transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-95 border-2 border-blue-400">
           PRESS START <ArrowRight size={16} />
         </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-blue-100 font-mono p-4 md:p-8 flex items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0a0a1a] to-[#0a0a1a]">
      {/* HUD scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+Cjwvc3ZnPg==')] opacity-50 mix-blend-overlay" />
      
      <div className="absolute top-4 right-4 flex gap-4">
         <button onClick={() => setView('home')} className="px-6 py-2 bg-blue-950/50 border-2 border-blue-500/50 text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-all uppercase text-xs tracking-widest">
            X FECHAR MENU
         </button>
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 relative z-10">
         {/* Left Side: Navigation HUD */}
         <div className="w-full md:w-1/3 space-y-4">
            <div className="bg-blue-950/30 border-2 border-blue-500/30 p-6 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative">
               <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-400" />
               <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-400" />
               
               <p className="text-blue-500 font-bold mb-6 flex items-center gap-2"><Settings size={18} /> SETTINGS MODULE</p>
               
               <div className="space-y-2">
                  {[
                    { id: 'perfil', label: 'PLAYER STATS', icon: User },
                    { id: 'temas', label: 'WORLD THEME', icon: Palette },
                    { id: 'layouts', label: 'UI ARCHITECTURE', icon: Compass },
                    { id: 'sons', label: 'AUDIO SYSTEM', icon: Music },
                  ].map(tab => (
                     <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id as any)}
                       className={`w-full flex items-center gap-4 p-4 border-2 transition-all ${
                         activeTab === tab.id 
                           ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] translate-x-2' 
                           : 'bg-blue-950/40 border-blue-800/50 text-blue-400 hover:border-blue-500 hover:bg-blue-900/50'
                       }`}
                     >
                        <tab.icon size={20} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                        <span className="font-bold tracking-widest text-sm">{tab.label}</span>
                     </button>
                  ))}
               </div>

               <div className="mt-12 pt-6 border-t-2 border-blue-800/30">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest font-bold text-xs"
                  >
                     <LogOut size={16} /> QUIT GAME
                  </button>
               </div>
            </div>
         </div>

         {/* Right Side: Content Screen */}
         <div className="w-full md:w-2/3 bg-blue-950/20 border-2 border-blue-500/20 p-8 relative min-h-[500px]">
            {/* Screen corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500" />

            <AnimatePresence mode="wait">
               {activeTab === 'perfil' && (
                  <motion.div
                    key="perfil"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex flex-col"
                  >
                     <div className="flex items-start gap-8 mb-8 border-b-2 border-blue-800/30 pb-8">
                        <div className="relative">
                           <div className="w-32 h-32 border-4 border-blue-500 bg-blue-950/50 p-1">
                              <img src={userData?.photoURL || user?.photoURL} alt="Avatar" className="w-full h-full object-cover grayscale opacity-80" />
                           </div>
                           <div className="absolute -bottom-3 -right-3 bg-blue-600 px-2 py-1 text-[10px] font-bold border border-blue-400">LVL 99</div>
                        </div>
                        <div className="flex-1">
                           <h2 className="text-4xl text-white font-bold mb-2 uppercase tracking-wider">{userData?.displayName || user?.displayName}</h2>
                           <p className="text-blue-400 mb-4">{userData?.bio || "NO BIO REGISTERED"}</p>
                           <div className="flex gap-4">
                              <div className="bg-blue-950/50 px-4 py-2 border border-blue-800 flex items-center gap-2">
                                <Zap size={14} className="text-yellow-400" /> <span className="text-yellow-400">SYNC: 100%</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex-1">
                        {!isEditing ? (
                           <button onClick={() => { setIsEditing(true); setEditingName(userData?.displayName || user?.displayName || ''); }} className="px-6 py-3 border-2 border-blue-500 hover:bg-blue-600 hover:text-white transition-colors uppercase font-bold tracking-widest text-sm flex items-center gap-2">
                              EDIT CHARACTER <ArrowRight size={16} />
                           </button>
                        ) : (
                           <div className="bg-blue-900/20 p-6 border-2 border-blue-500/50 max-w-sm">
                              <p className="mb-2 text-blue-400 text-xs">NEW ALIAS:</p>
                              <input 
                                 value={editingName} 
                                 onChange={(e) => setEditingName(e.target.value)} 
                                 className="w-full bg-blue-950 border-2 border-blue-500 text-white p-3 mb-4 outline-none focus:bg-blue-900 transition-colors"
                              />
                              <div className="flex gap-2">
                                 <button 
                                    onClick={async () => {
                                       await updateUserSettings(user.uid, { displayName: editingName });
                                       setIsEditing(false);
                                    }}
                                    className="flex-1 bg-blue-600 text-white font-bold py-2 border-2 border-blue-400"
                                 >
                                    CONFIRM
                                 </button>
                                 <button onClick={() => setIsEditing(false)} className="flex-1 bg-transparent border-2 border-blue-500/50 text-blue-400 font-bold py-2 hover:bg-blue-900/50">CANCEL</button>
                              </div>
                           </div>
                        )}
                     </div>
                  </motion.div>
               )}

               {activeTab === 'temas' && (
                  <motion.div
                    key="temas"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                     <h3 className="text-xl text-blue-400 font-bold mb-6 border-l-4 border-blue-500 pl-4 uppercase">Select World Theme</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(Object.keys(THEMES) as any[]).map(mode => (
                           <button
                             key={mode}
                             onClick={() => handleThemeChange(mode)}
                             className={`p-4 border-2 text-left transition-all relative overflow-hidden group ${
                               themeMode === mode 
                                 ? 'border-blue-400 bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                                 : 'border-blue-900 bg-blue-950/50 text-blue-300 hover:border-blue-500'
                             }`}
                           >
                              {themeMode === mode && <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />}
                              <div className="relative z-10 flex items-center justify-between">
                                 <span className="font-bold tracking-wider">{THEMES[mode].label}</span>
                                 <div className="w-4 h-4 rounded-full" style={{ backgroundColor: THEMES[mode].primary }} />
                              </div>
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
                  >
                     <h3 className="text-xl text-blue-400 font-bold mb-6 border-l-4 border-blue-500 pl-4 uppercase">UI Architecture HUD</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['auto', 'game-hud', 'dev-terminal', 'holographic-ui', 'cinema-scroll', 'romantic-center', 'timeline-story', 'zen-minimal'].map(mode => (
                           <button
                             key={mode}
                             onClick={() => handleLayoutChange(mode)}
                             className={`p-4 border-2 text-left transition-all uppercase font-bold text-xs tracking-widest ${
                               layoutMode === mode 
                                 ? 'border-blue-400 bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                                 : 'border-blue-900 bg-blue-950/50 text-blue-300 hover:border-blue-500 hover:pl-6'
                             }`}
                           >
                              &gt; {mode.replace('-', ' ')}
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
                  >
                     <h3 className="text-xl text-blue-400 font-bold mb-6 border-l-4 border-blue-500 pl-4 uppercase">Audio Matrix</h3>
                     <div className="bg-blue-950/40 p-6 border-2 border-blue-900 mb-8 max-w-xl">
                        <AudioSettings />
                     </div>
                     
                     <h3 className="text-xl text-blue-400 font-bold mb-6 border-l-4 border-blue-500 pl-4 uppercase mt-8">BGM Presets</h3>
                     <div className="grid grid-cols-2 gap-4 max-w-xl">
                         {['minimalist', 'romantic', 'nature', 'retro_gamer', 'sci_fi_tech'].map(preset => (
                           <button 
                             key={preset}
                             onClick={() => audioManager.setSettings({ theme: preset as any })}
                             className={`p-4 border-2 text-center uppercase tracking-widest text-xs font-bold transition-all ${
                               audioManager.getSettings().theme === preset 
                                 ? 'bg-blue-500 text-white border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                                 : 'bg-blue-950/30 text-blue-400 border-blue-800 hover:bg-blue-900/50 hover:border-blue-500'
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
