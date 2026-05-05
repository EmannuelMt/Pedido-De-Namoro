import React from 'react';
import { Terminal, Database, Code, Cpu, HardDrive } from 'lucide-react';

export const DevHomeLayout = ({ setView, GALLERY_DATA, SHARED_GAMES, ALBUMS_DATA }: any) => {
  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--primary)] font-mono p-4 sm:p-8 selection:bg-[var(--primary)] selection:text-black">
      <div className="w-full max-w-6xl mx-auto border border-[var(--primary)]/30 rounded-lg overflow-hidden bg-black/50 backdrop-blur shadow-[0_0_50px_rgba(0,0,0,0.5)]">
         
         {/* Terminal Header */}
         <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--primary)]/30 bg-[var(--primary)]/10">
            <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/80" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
               <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#a8a8a8]">root@universe: ~/core_memories</p>
            <Terminal size={14} className="text-[#a8a8a8]" />
         </div>

         <div className="p-8 sm:p-12">
            <div className="mb-12">
               <pre className="text-xs sm:text-sm md:text-base leading-tight mb-6 font-bold text-[var(--text)] drop-shadow-[0_0_10px_var(--primary-glow)] truncate">
{`
  ____   ____  _   _  ____ 
 / ___| / __ \\| | | ||  _ \\
| |    | |  | | | | || |_) |
| |___ | |__| | |_| ||  __/ 
 \\____| \\____/ \\___/ |_|    v3.0.1
`}
               </pre>
               <p className="text-sm opacity-80 mb-2">{'>'} Initializing emotional core module...</p>
               <p className="text-sm opacity-80 mb-2">{'>'} Loading shared dependencies: {ALBUMS_DATA?.length || 0} packages found.</p>
               <p className="text-sm text-green-400 mb-8">{'>'} Connection established successfully. Uptime: ∞</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               {/* Left Column: Stats */}
               <div className="border border-[var(--primary)]/30 p-6 space-y-4">
                  <h3 className="text-white text-lg font-bold border-b border-[var(--primary)]/30 pb-2 mb-4 flex items-center gap-3">
                     <Database size={18} /> System Resources
                  </h3>
                  <div className="flex justify-between items-center text-sm">
                     <span>Photos.log</span>
                     <span className="text-white">[{GALLERY_DATA?.length || 0} files]</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span>Games.exe</span>
                     <span className="text-white">[{SHARED_GAMES?.length || 0} binaries]</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span>Albums.tar.gz</span>
                     <span className="text-white">[{ALBUMS_DATA?.length || 0} archives]</span>
                  </div>
               </div>

               {/* Right Column: Execution */}
               <div className="border border-[var(--primary)]/30 p-6">
                  <h3 className="text-white text-lg font-bold border-b border-[var(--primary)]/30 pb-2 mb-4 flex items-center gap-3">
                     <Code size={18} /> Executable Scripts
                  </h3>
                  <div className="space-y-3">
                     <button onClick={() => setView('historia')} className="w-full text-left p-3 bg-[var(--primary)]/10 hover:bg-[var(--primary)] hover:text-black transition-colors text-sm flex justify-between">
                        <span>./run_history.sh</span> <span className="opacity-50">Execute</span>
                     </button>
                     <button onClick={() => setView('galeria')} className="w-full text-left p-3 bg-[var(--primary)]/10 hover:bg-[var(--primary)] hover:text-black transition-colors text-sm flex justify-between">
                        <span>cat ./gallery/*</span> <span className="opacity-50">Read</span>
                     </button>
                     <button onClick={() => setView('jogos')} className="w-full text-left p-3 bg-[var(--primary)]/10 hover:bg-[var(--primary)] hover:text-black transition-colors text-sm flex justify-between">
                        <span>make play</span> <span className="opacity-50">Build</span>
                     </button>
                  </div>
               </div>
            </div>

            {/* Bottom Special Script */}
            <div className="w-full border border-yellow-500/50 bg-yellow-500/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <Cpu size={32} className="text-yellow-500" />
                  <div>
                     <p className="text-yellow-500 font-bold mb-1">sudo ./deploy_surprise.sh</p>
                     <p className="text-xs text-yellow-500/70">Requires elevated privileges to access future prediction algorithm.</p>
                  </div>
               </div>
               <button onClick={() => setView('pedido')} className="px-6 py-3 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold text-sm transition-colors uppercase">
                  Execute [Y/n]
               </button>
            </div>

         </div>
      </div>
    </div>
  );
};
