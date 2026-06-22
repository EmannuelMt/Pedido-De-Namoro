import { Image as ImageIcon, Video, Crop, Sparkles, Box, Scissors, Upload } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { useRef, useState, ChangeEvent } from 'react';

export function IconsBannersTab() {
  const { user, profile, updateAvatar, updateBanner } = useAuthStore();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingBanner, setLoadingBanner] = useState(false);

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("No context"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setLoadingAvatar(true);
      const file = e.target.files[0];
      const base64 = await resizeImage(file, 500, 500); // Max 500x500 for avatar
      await updateAvatar(base64);
    } catch (err) {
      console.error("Failed to update avatar", err);
      alert("Falha ao atualizar avatar.");
    } finally {
      setLoadingAvatar(false);
    }
  };

  const handleBannerChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setLoadingBanner(true);
      const file = e.target.files[0];
      const base64 = await resizeImage(file, 1920, 1080); // Max 1920x1080 for banner
      await updateBanner(base64);
    } catch (err) {
      console.error("Failed to update banner", err);
      alert("Falha ao atualizar banner.");
    } finally {
      setLoadingBanner(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Avatar Section */}
      <section>
        <div className="mb-6 border-b-2 border-black pb-2">
          <h2 className="text-3xl font-black italic">Avatar & Molduras</h2>
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Sua identidade principal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_#1a1a1a]">
              <h3 className="font-black text-xl mb-4">Avatar Atual</h3>
              <div className="flex flex-col items-center gap-4">
                 <div className="w-32 h-32 bg-gray-200 border-4 border-black relative overflow-hidden">
                    {user?.photoURL ? (
                       <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                       <div className="absolute inset-0 flex items-center justify-center bg-yellow-100">
                          <span className="text-4xl font-black">{user?.displayName?.[0] || 'U'}</span>
                       </div>
                    )}
                    {loadingAvatar && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                         <span className="text-white font-black text-xs animate-pulse">SALVANDO...</span>
                      </div>
                    )}
                 </div>
                 <div className="flex gap-2">
                    <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={handleAvatarChange} />
                    <button onClick={() => avatarInputRef.current?.click()} disabled={loadingAvatar} className="bg-black text-white font-sans text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:-translate-y-1 transition-transform border-2 border-black disabled:opacity-50">
                       <Upload className="w-4 h-4 inline-block mr-1" /> Alterar
                    </button>
                    <button className="bg-white text-black font-sans text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:-translate-y-1 transition-transform border-2 border-black">
                       <Crop className="w-4 h-4 inline-block mr-1" /> Editar
                    </button>
                 </div>
                 <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2">PNG, JPG ou GIF até 5MB</p>
              </div>
           </div>

           <div className="bg-[#e84e4e] border-2 border-black p-6 shadow-[8px_8px_0px_0px_#1a1a1a] text-white">
              <h3 className="font-black text-xl mb-4">Molduras Equipadas</h3>
              <div className="grid grid-cols-3 gap-4">
                 <div className="aspect-square bg-gradient-to-tr from-yellow-400 to-yellow-600 border-2 border-black flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_#1a1a1a] hover:scale-105 transition-transform">
                    <span className="text-2xl font-black text-black">A</span>
                 </div>
                 <div className="aspect-square bg-gradient-to-tr from-cyan-400 to-blue-600 border-2 border-black flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_#1a1a1a] hover:scale-105 transition-transform">
                    <span className="text-2xl font-black text-white">B</span>
                 </div>
                 <div className="aspect-square bg-white border-2 border-black border-dashed flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors">
                    <Box className="w-6 h-6 text-white" />
                 </div>
              </div>
              <button className="w-full mt-6 bg-white text-black border-2 border-black px-4 py-3 font-black uppercase text-xs hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_#1a1a1a]">
                 Comprar Molduras
              </button>
           </div>
        </div>
      </section>

      {/* Banner Section */}
      <section>
        <div className="mb-6 flex justify-between items-end border-b-2 border-black pb-2">
          <div>
            <h2 className="text-3xl font-black italic">Banner do Perfil</h2>
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Cobertura do seu universo</p>
          </div>
        </div>

        <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a]">
           <input type="file" accept="image/*" className="hidden" ref={bannerInputRef} onChange={handleBannerChange} />
           <div 
             className="w-full h-64 sm:h-80 bg-zinc-950 border-2 border-black relative mb-6 overflow-hidden flex items-center justify-center group cursor-pointer hover:bg-zinc-900 transition-colors"
             onClick={() => bannerInputRef.current?.click()}
           >
              {profile?.banner ? (
                 <img src={profile.banner} alt="Banner" className="absolute inset-0 w-full h-full object-cover object-center z-10" />
              ) : (
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
              )}
              
              {loadingBanner && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <span className="text-white font-black text-lg animate-pulse">SALVANDO...</span>
                 </div>
              )}

              <div className="absolute z-10 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 inset-0 justify-center">
                 <ImageIcon className="w-8 h-8 text-white" />
                 <span className="font-black uppercase tracking-widest text-sm bg-white text-black px-4 py-1 border-2 border-black">Alterar Banner</span>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => bannerInputRef.current?.click()} className="bg-gray-100 border-2 border-black py-4 flex flex-col items-center gap-2 hover:bg-[#e84e4e] hover:text-white transition-colors">
                 <ImageIcon className="w-5 h-5" />
                 <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Imagem</span>
              </button>
              <button className="bg-gray-100 border-2 border-black py-4 flex flex-col items-center gap-2 hover:bg-[#e84e4e] hover:text-white transition-colors">
                 <Video className="w-5 h-5" />
                 <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Vídeo</span>
              </button>
              <button className="bg-gray-100 border-2 border-black py-4 flex flex-col items-center gap-2 hover:bg-[#e84e4e] hover:text-white transition-colors relative overflow-hidden">
                 <Sparkles className="w-5 h-5" />
                 <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Animado</span>
                 <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[8px] font-black uppercase px-2 py-0.5 border-b-2 border-l-2 border-black">PRO</div>
              </button>
              <button className="bg-gray-100 border-2 border-black py-4 flex flex-col items-center gap-2 hover:bg-[#e84e4e] hover:text-white transition-colors">
                 <Scissors className="w-5 h-5" />
                 <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Editor</span>
              </button>
           </div>
           <p className="font-sans text-[10px] font-bold text-center uppercase tracking-widest opacity-40 mt-4">Tamanho Recomendado: 1920x500 • Máx 10MB</p>
        </div>
      </section>

      {/* Badges Section */}
      <section className="bg-blue-50 border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a]">
         <div className="mb-6 border-b-2 border-black pb-2 border-opacity-20">
            <h2 className="text-3xl font-black italic">Suas Badges</h2>
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Medalhas do seu perfil</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
             <div className="bg-white border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_#1a1a1a] flex items-center gap-2 hover:-translate-y-1 transition-transform cursor-pointer">
                <span className="text-xl">👑</span>
                <div>
                   <h4 className="font-black text-sm uppercase">Fundador</h4>
                   <p className="font-sans text-[8px] font-bold uppercase tracking-widest opacity-60">Equipada</p>
                </div>
             </div>
             
             <div className="bg-white border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_#1a1a1a] flex items-center gap-2 hover:-translate-y-1 transition-transform cursor-pointer">
                <span className="text-xl">💎</span>
                <div>
                   <h4 className="font-black text-sm uppercase">Premium</h4>
                   <p className="font-sans text-[8px] font-bold uppercase tracking-widest opacity-60">Equipada</p>
                </div>
             </div>

             <div className="bg-white border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_#1a1a1a] flex items-center gap-2 hover:-translate-y-1 transition-transform cursor-pointer opacity-50 grayscale hover:grayscale-0 hover:opacity-100">
                <span className="text-xl">❤️</span>
                <div>
                   <h4 className="font-black text-sm uppercase">Casal Verificado</h4>
                   <p className="font-sans text-[8px] font-bold uppercase tracking-widest opacity-60">Clique para equipar</p>
                </div>
             </div>
          </div>
      </section>

    </div>
  );
}
