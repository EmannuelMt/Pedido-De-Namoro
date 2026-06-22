import React, { useState, useRef, ChangeEvent } from 'react';
import { useAuthStore } from '../../store/auth';
import { ImageIcon, Laptop, Tablet, Smartphone, Upload, Camera, HelpCircle, Check, Coins } from 'lucide-react';
import toast from 'react-hot-toast';

interface CustomBanner {
  id: string;
  name: string;
  url: string;
  rarity: 'comum' | 'raro' | 'epico' | 'lendario';
}

const PRESET_BANNERS: CustomBanner[] = [
  { id: 'organic_field', name: 'Jardim Botânico', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200', rarity: 'raro' },
  { id: 'stars_midnight', name: 'Obsidian Deep Space', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200', rarity: 'epico' },
  { id: 'sakura_blossoms', name: 'Sakura Autumn Wind', url: 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=1200', rarity: 'epico' },
  { id: 'wood_cozy', name: 'Cabana Cozy Retro', url: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1200', rarity: 'lendario' }
];

export function BannersTab() {
  const { profile, updateBanner } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const bannerUrl = profile?.banner || '';

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
            reject(new Error("No canvas context"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setLoading(true);
        const file = e.target.files[0];
        const base64 = await resizeImage(file, 1920, 1080);
        await updateBanner(base64);
        toast.success('Sua capa exclusiva foi equipada com sucesso! 🖼️');
      } catch {
        toast.error('Erro ao salvar sua foto da capa.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApplyPreset = async (preset: CustomBanner) => {
    try {
      setLoading(true);
      await updateBanner(preset.url);
      toast.success(`Capa "${preset.name}" sintonizada!`);
    } catch {
      toast.error('Erro ao carregar wallpaper preset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#e84e4e] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> PROFILE COVERS
            </span>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">🖼️ Capas e Banners de Perfil</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Escolha ornamentos grandiosos para adornar o background de sua central de perfil. Você pode enviar arquivos de seu dispositivo ou selecionar de nossa biblioteca gamer.
          </p>
        </div>
      </div>

      {/* Device preview mockup controls */}
      <div className="bg-stone-900 border-4 border-black p-5 rounded-3xl text-white shadow-[6px_6px_0px_#1a1a1a] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-amber-300">🖥️ Simulador de Aparelhos</span>
          <div className="flex gap-2">
            {[
              { id: 'desktop', icon: Laptop, text: 'Desktop' },
              { id: 'tablet', icon: Tablet, text: 'Tablet' },
              { id: 'mobile', icon: Smartphone, text: 'Mobile' }
            ].map(dev => (
              <button
                key={dev.id}
                onClick={() => setPreviewDevice(dev.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded border transition-all ${
                  previewDevice === dev.id 
                    ? 'bg-white text-black border-white' 
                    : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
                }`}
              >
                <dev.icon size={12} />
                {dev.text}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic mockup frame rendering based on device */}
        <div className="flex items-center justify-center p-3 sm:p-5 bg-stone-950 rounded-2xl border-2 border-stone-800 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3c3c3c_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="w-full relative z-10 transition-all duration-300" style={{ maxWidth: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '500px' : '260px' }}>
            <div className={`border-4 border-black bg-stone-900 rounded-2xl overflow-hidden relative shadow-2xl transition-all ${
              previewDevice === 'mobile' ? 'aspect-[9/16]' : previewDevice === 'tablet' ? 'aspect-[4/3]' : 'h-40 md:h-52'
            }`}>
              
              {/* Wallpaper image inside frame */}
              {bannerUrl ? (
                <img src={bannerUrl} alt="Banner inside mockup" className="absolute inset-0 w-full h-full object-cover z-0 select-nonepointer-events-none" />
              ) : (
                <div className="absolute inset-0 bg-stone-850 flex items-center justify-center z-0">
                  <span className="text-xs font-mono text-stone-500">Sem Capa Equipada</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent z-10" />

              {/* Mockup Profile text overlays */}
              <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 border-2 border-black rounded-xl" />
                <div>
                  <div className="w-16 h-3 bg-white/90 rounded" />
                  <div className="w-24 h-2 bg-stone-400 border border-stone-800 rounded mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Pre-made and preset options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Custom banner box */}
        <div className="bg-white border-4 border-black p-6 rounded-3xl flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_#1a1a1a] min-h-[220px]">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          <div className="w-14 h-14 bg-rose-50 border-2 border-black rounded-2xl flex items-center justify-center text-rose-500 mb-4 hover:scale-105 transition-transform">
            <Upload className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h4 className="text-base font-black text-black uppercase tracking-tight">Arquivar Capa Customizada</h4>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            PNG ou JPG em proporção widescreen 16:9 recomendada (ex: 1920x540).
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="mt-4 bg-black text-white hover:bg-[#e84e4e] font-sans text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-transform"
          >
            {loading ? 'Processando...' : 'Fazer Upload'}
          </button>
        </div>

        {/* Existing preset skins */}
        {PRESET_BANNERS.map(preset => (
          <div 
            key={preset.id}
            className="bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
          >
            <div className="h-24 relative overflow-hidden border-b-4 border-black">
              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
              <span className="absolute top-2 right-2 text-[8px] bg-black text-white border border-stone-800 font-extrabold uppercase px-2 py-0.5 rounded">
                [{preset.rarity}]
              </span>
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div>
                <h5 className="font-black text-xs uppercase tracking-wide truncate max-w-[140px]">{preset.name}</h5>
                <p className="text-[10px] text-gray-400">Preset oficial gratuito</p>
              </div>
              <button
                onClick={() => handleApplyPreset(preset)}
                disabled={loading}
                className="bg-emerald-300 hover:bg-emerald-400 text-black text-[9px] font-black uppercase tracking-wider px-3 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-transform shrink-0"
              >
                Aplicar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
