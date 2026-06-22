import { Settings, Image as ImageIcon, Sparkles, Crown } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

export function ProfileHeader() {
  const { user, profile } = useAuthStore();
  
  return (
    <div className="mb-12">
      {/* Banner Area */}
      <div className="w-full h-64 md:h-[350px] bg-zinc-950 border-2 border-black relative shadow-[4px_4px_0px_0px_#1a1a1a] mb-12 flex items-center justify-center overflow-hidden">
        {profile?.banner ? (
          <img src={profile.banner} alt="Banner" className="absolute inset-0 w-full h-full object-cover object-center z-10" />
        ) : (
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        )}
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white border-2 border-black p-2 hover:bg-[#e84e4e] hover:text-white transition-colors shadow-[2px_2px_0px_0px_#1a1a1a]">
            <ImageIcon className="w-4 h-4" />
          </button>
          <button className="bg-white border-2 border-black p-2 hover:bg-[#e84e4e] hover:text-white transition-colors shadow-[2px_2px_0px_0px_#1a1a1a]">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar Area (Positioned overlapping the banner) */}
        <div className="absolute -bottom-10 left-8 md:left-12 flex items-end">
          <div className="relative">
            {/* Avatar Frame - "Prata/Dourada" representation */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-none z-0 border-2 border-black" />
            
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white border-2 border-black flex items-center justify-center relative z-10 overflow-hidden shadow-[4px_4px_0px_0px_#1a1a1a]">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black">{user?.displayName?.charAt(0) || 'U'}</span>
              )}
            </div>
            
            {/* Badge Indicator overlapping avatar frame */}
            <div className="absolute -bottom-2 -right-2 z-20 bg-[#e84e4e] border-2 border-black w-8 h-8 flex items-center justify-center shadow-[2px_2px_0px_0px_#1a1a1a]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* User Info & Badges */}
      <div className="px-8 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-4">
        <div>
          <h1 className="text-4xl font-black italic mb-2 tracking-tighter">{user?.displayName || 'Usuário Desconhecido'}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-widest bg-yellow-100 border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_#1a1a1a]">
              <Crown className="w-3 h-3" /> Fundador
            </span>
            <span className="inline-flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-widest bg-pink-100 border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_#1a1a1a]">
              Casal Verificado
            </span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button className="bg-white border-2 border-black px-6 py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#1a1a1a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
            Nosso Universo ✨
          </button>
        </div>
      </div>
    </div>
  );
}
