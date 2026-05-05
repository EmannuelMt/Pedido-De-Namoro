import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Sparkles, User, Settings, LogOut, ArrowRight } from 'lucide-react';

export const DevMenu = ({ 
  user, userData, themeMode, THEMES, layoutMode,
  handleThemeChange, handleLayoutChange,
  handleLogout, updateUserSettings, setView
}: any) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'temas' | 'layouts' | 'suporte'>('perfil');
  const [editingName, setEditingName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 overflow-y-auto">
       <div className="max-w-4xl mx-auto border border-green-500/20 rounded shadow-[0_0_30px_rgba(34,197,94,0.1)] relative">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b border-green-500/20 bg-green-500/5">
             <Terminal size={20} />
             <span className="text-xs font-bold tracking-widest uppercase">/root/system/preferences.sh</span>
          </div>

          <div className="flex flex-col md:flex-row">
             {/* Sidebar */}
             <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-green-500/20 p-4 space-y-1">
                <p className="text-green-500/50 text-[10px] uppercase mb-4 tracking-widest">Available Commands</p>
                {[
                  { id: 'perfil', label: './profile.sh' },
                  { id: 'temas', label: './themes.sh' },
                  { id: 'layouts', label: './layouts.sh' },
                  { id: 'suporte', label: './system_status.sh' }
                ].map(cmd => (
                   <button
                     key={cmd.id}
                     onClick={() => setActiveTab(cmd.id as any)}
                     className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        activeTab === cmd.id ? 'bg-green-500 text-black font-bold' : 'hover:bg-green-500/10'
                     }`}
                   >
                      &gt; {cmd.label}
                   </button>
                ))}

                <button
                   onClick={() => setView('home')}
                   className="w-full text-left px-4 py-2 mt-8 text-sm hover:bg-green-500/10 text-green-500/50 flex items-center gap-2"
                >
                   &gt; cd ..
                </button>
             </div>

             {/* Content */}
             <div className="flex-1 p-6 md:p-12 min-h-[500px]">
                <AnimatePresence mode="wait">
                   <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="space-y-8"
                   >
                      <p className="text-green-500/50 text-xs">Executing {activeTab}.sh...</p>
                      
                      {activeTab === 'perfil' && (
                         <div className="space-y-8">
                            <div className="space-y-2">
                               <p className="font-bold text-xl uppercase">Output: User Information</p>
                               <div className="p-4 border border-green-500/20 bg-green-500/5 space-y-4">
                                  <div className="flex justify-between">
                                     <span className="opacity-50">DISPLAY_NAME=</span>
                                     <span>"{userData?.displayName || user?.displayName || 'Explorador'}"</span>
                                  </div>
                                  <div className="flex justify-between">
                                     <span className="opacity-50">UID=</span>
                                     <span className="text-[10px]">{user?.uid}</span>
                                  </div>
                                  <div className="flex justify-between">
                                     <span className="opacity-50">SYNC_STATUS=</span>
                                     <span className="text-green-300">CONNECTED</span>
                                  </div>
                               </div>
                            </div>

                            {!isEditing ? (
                               <button onClick={() => { setIsEditing(true); setEditingName(userData?.displayName || user?.displayName || ''); }} className="px-6 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors">
                                  ./edit_profile
                               </button>
                            ) : (
                               <div className="space-y-4 p-4 border border-green-500/50">
                                  <p>&gt; Enter new DISPLAY_NAME:</p>
                                  <input 
                                     value={editingName} 
                                     onChange={(e) => setEditingName(e.target.value)} 
                                     className="bg-transparent border-b border-green-500 outline-none text-green-300 w-full"
                                     autoFocus
                                  />
                                  <div className="flex gap-4">
                                     <button 
                                        onClick={async () => {
                                           await updateUserSettings(user.uid, { displayName: editingName });
                                           setIsEditing(false);
                                        }}
                                        className="px-4 py-1 bg-green-500 text-black font-bold"
                                     >
                                        [Save]
                                     </button>
                                     <button onClick={() => setIsEditing(false)} className="px-4 py-1 border border-green-500/30 text-green-500/50">[Cancel]</button>
                                  </div>
                               </div>
                            )}
                         </div>
                      )}

                      {activeTab === 'temas' && (
                         <div className="space-y-6">
                            <p className="font-bold text-xl uppercase">Output: Themes Configuration</p>
                            <p>CURRENT_THEME="{themeMode}"</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               {(Object.keys(THEMES) as any[]).map(mode => (
                                 <button
                                   key={mode}
                                   onClick={() => handleThemeChange(mode)}
                                   className={`p-3 text-left border ${themeMode === mode ? 'border-green-500 bg-green-500/20' : 'border-green-500/20 hover:border-green-500/50 text-green-500/70'}`}
                                 >
                                    [{themeMode === mode ? 'x' : ' '}] {mode}
                                 </button>
                               ))}
                            </div>
                         </div>
                      )}

                      {activeTab === 'layouts' && (
                         <div className="space-y-6">
                            <p className="font-bold text-xl uppercase">Output: UI Architecture</p>
                            <p>CURRENT_LAYOUT="{layoutMode}"</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               {['auto', 'dev-terminal', 'romantic-center', 'timeline-story', 'game-hud', 'holographic-ui', 'zen-minimal'].map(mode => (
                                 <button
                                   key={mode}
                                   onClick={() => handleLayoutChange(mode)}
                                   className={`p-3 text-left border ${layoutMode === mode ? 'border-green-500 bg-green-500/20' : 'border-green-500/20 hover:border-green-500/50 text-green-500/70'}`}
                                 >
                                    [{layoutMode === mode ? 'x' : ' '}] {mode}
                                 </button>
                               ))}
                            </div>
                         </div>
                      )}

                      {activeTab === 'suporte' && (
                         <div className="space-y-8">
                            <div className="p-6 border border-red-500/30 bg-red-500/5 text-red-400 space-y-4">
                               <p className="font-bold flex items-center gap-2"><Shield size={16} /> SYSTEM_SECURITY_WARNING</p>
                               <p className="text-xs">Unauthorized access will be terminated. Proceed with caution.</p>
                               
                               <button 
                                 onClick={handleLogout}
                                 className="mt-4 px-6 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors"
                               >
                                  rm -rf /session (Logout)
                               </button>
                            </div>
                         </div>
                      )}

                   </motion.div>
                </AnimatePresence>
             </div>
          </div>
       </div>
    </div>
  );
};
