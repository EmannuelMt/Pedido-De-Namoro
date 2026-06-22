import { useState, DragEvent, ChangeEvent } from 'react';
import { Upload, Image as ImageIcon, Trash2, Monitor, Check, RotateCcw, Sliders, Globe, FileText, Sparkles, HelpCircle } from 'lucide-react';
import { useThemeStore, WallpaperConfig } from '../../store/theme';
import { useAuthStore } from '../../store/auth';
import { toast } from 'sonner';

const PRESET_WALLPAPERS = [
  {
    name: "Starry Love",
    desc: "Céu estrelado com tons de romance",
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Sakura Blossom",
    desc: "Cerejeiras e romance japonês suave",
    url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Aesthetic Sunset",
    desc: "Nuvens e degradês ao por do sol",
    url: "https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Minimalist Hearts",
    desc: "Arte minimalista com formas românticas",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80"
  }
];

const PAGES_LIST = [
  { path: "global", label: "Todo o site (Global)" },
  { path: "/", label: "Página Inicial (Início)" },
  { path: "/historia", label: "História" },
  { path: "/galeria", label: "Galeria" },
  { path: "/albuns", label: "Álbuns" },
  { path: "/musicas", label: "Músicas" },
  { path: "/pedido", label: "Pedido Oficial" },
  { path: "/painel", label: "Painel do Casal" }
];

export function WallpapersTab() {
  const { globalWallpaper, pageWallpapers, setWallpaper } = useThemeStore();
  const { user } = useAuthStore();

  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [selectedTarget, setSelectedTarget] = useState<string>("global");
  const [opacity, setOpacity] = useState<number>(15);
  const [blur, setBlur] = useState<number>(4);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // File Upload helper
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem.");
      return;
    }
    
    // Check file size limit (keep it reasonable for firestore, e.g. < 900KB)
    if (file.size > 900 * 1024) {
      toast.error("Para melhor performance, use imagens de até 900KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedUrl(reader.result);
        toast.success(`Imagem local "${file.name}" importada com sucesso! Ajuste as configurações abaixo.`);
      }
    };
    reader.onerror = () => {
      toast.error("Falha ao ler arquivo de imagem.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Submit and apply config
  const handleApplyWallpaper = async () => {
    if (!user) {
      toast.error("Você precisa estar autenticado para realizar esta ação.");
      return;
    }

    if (!selectedUrl) {
      toast.error("Por favor, selecione uma imagem de preset, insira um link ou envie uma imagem local.");
      return;
    }

    const config: WallpaperConfig = {
      url: selectedUrl,
      opacity,
      blur
    };

    let newGlobal = globalWallpaper;
    let newPages = { ...pageWallpapers };

    if (selectedTarget === "global") {
      newGlobal = config;
    } else {
      newPages[selectedTarget] = config;
    }

    toast.promise(
      setWallpaper(newGlobal, newPages, true),
      {
        loading: 'Salvando configurações no Firebase...',
        success: 'Papel de parede aplicado e sincronizado com sucesso!',
        error: 'Erro ao persistir papel de parede.'
      }
    );

    // Reset URL builder after applying
    setSelectedUrl("");
  };

  // Quick remove wallpaper config
  const handleRemoveWallpaper = async (target: string) => {
    if (!user) {
      toast.error("Acesso restrito para administradores autenticados.");
      return;
    }

    let newGlobal = globalWallpaper;
    let newPages = { ...pageWallpapers };

    if (target === "global") {
      newGlobal = null;
    } else {
      delete newPages[target];
    }

    toast.promise(
      setWallpaper(newGlobal, newPages, true),
      {
        loading: 'Atualizando remoção no Firebase...',
        success: 'Papel de parede removido!',
        error: 'Erro ao deletar papel de parede.'
      }
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Dynamic visual simulator */}
      <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_var(--primary-custom)]">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-black italic flex items-center gap-2">
            <Monitor className="w-8 h-8 text-[#e84e4e]" /> Papel de Parede do Universo
          </h2>
          <p className="font-sans text-xs font-bold uppercase tracking-widest opacity-60 mt-2">
            Gerencie e crie planos de fundo para o site todo ou para cantinhos específicos do amor
          </p>
        </div>

        {/* Action Layout builder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* Form controls: 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Import image */}
            <div className="border-2 border-black p-6 space-y-4">
              <span className="bg-black text-[9px] text-white font-bold uppercase px-2 py-1 tracking-widest">Passo 1: Enviar ou Escolher Papel de Parede</span>
              
              {/* Local input drag and drop area */}
              <div 
                className={`border-2 border-dashed border-black/40 p-6 text-center cursor-pointer transition-colors ${dragActive ? 'bg-amber-50/50 border-[#e84e4e]' : 'hover:bg-gray-50'}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input 
                  id="file-input" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                <Upload className="w-8 h-8 mx-auto mb-2 text-black/40" />
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">Importar Imagem Localmente</p>
                <p className="text-[10px] opacity-60 mt-1">Arraste e solte o arquivo ou toque para procurar (.png, .jpg, .webp)</p>
              </div>

              {/* URL Direct text field input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-widest opacity-60">Instalar link direto de imagem:</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Cole um link de imagem (ex: Unsplash, Imgur)"
                    value={selectedUrl.startsWith("data:") ? "[Imagem Local Importada]" : selectedUrl}
                    onChange={(e) => setSelectedUrl(e.target.value)}
                    className="flex-1 bg-gray-100 border-2 border-black p-3 font-sans text-xs outline-none focus:border-[#e84e4e]"
                  />
                  {selectedUrl && (
                    <button 
                      onClick={() => setSelectedUrl("")}
                      className="border-2 border-black px-3 hover:bg-black hover:text-white transition-colors"
                      title="Clear Selection"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>

              {/* Preset selection library */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Ou escolha um de nossos presets românticos:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_WALLPAPERS.map((preset, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedUrl(preset.url)}
                      className={`relative aspect-[16/9] border-2 border-black cursor-pointer overflow-hidden group ${selectedUrl === preset.url ? 'ring-2 ring-black' : ''}`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-[9px] font-black uppercase text-center p-1">{preset.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Choose Page Target */}
            <div className="border-2 border-black p-6 space-y-4">
              <span className="bg-black text-[9px] text-white font-bold uppercase px-2 py-1 tracking-widest">Passo 2: Definir Destino</span>
              
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-widest opacity-60">Em qual local este wallpaper será exibido?</label>
                <select
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full bg-gray-100 border-2 border-black p-3 font-sans text-xs outline-none focus:border-[#e84e4e]"
                >
                  {PAGES_LIST.map((page) => (
                    <option key={page.path} value={page.path}>{page.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Aesthetic Controls Slider (opacity, blur) */}
            <div className="border-2 border-black p-6 space-y-6">
              <span className="bg-black text-[9px] text-white font-bold uppercase px-2 py-1 tracking-widest">Passo 3: Ajustes Estéticos</span>
              
              {/* Opacity */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Sliders className="w-4 h-4" /> Opacidade da imagem</span>
                  <span className="text-amber-600">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <p className="text-[10px] text-black/50">Dica: Opacidade recomendada entre 10% e 30% para melhor leitura do site.</p>
              </div>

              {/* Blur */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> Nível de Desfoque (Blur)</span>
                  <span className="text-amber-600">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <p className="text-[10px] text-black/50">Dica: Um pouco de blur impede que a imagem chame mais atenção do que os textos.</p>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex gap-4">
              <button
                onClick={handleApplyWallpaper}
                className="flex-1 bg-[#e84e4e] text-white border-2 border-black py-4 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#1a1a1a] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[3px_3px_0px_0px_#1a1a1a] transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Aplicar e Salvar no Banco
              </button>
            </div>
          </div>

          {/* Simulated Mobile Device Preview Frame: 5 cols */}
          <div className="lg:col-span-5 h-[500px] border-2 border-black flex flex-col relative overflow-hidden bg-white shadow-[4px_4px_0px_0px_#1a1a1a]">
            
            {/* Simulation Outer frame bar */}
            <div className="bg-black text-white px-4 py-2 flex items-center justify-between text-xs tracking-widest uppercase font-bold">
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-lime-400" /> Simulador de Background</span>
              <span className="text-[9px] text-gray-400 font-mono">NossoEspaco.app</span>
            </div>

            {/* Inner Content Simulator */}
            <div className="flex-1 p-6 relative overflow-hidden flex flex-col justify-between" style={{ backgroundColor: '#fcf9f2' }}>
              
              {/* Simulated active wallpaper back-render */}
              {selectedUrl && (
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all"
                  style={{
                    backgroundImage: `url(${selectedUrl})`,
                    opacity: opacity / 100,
                    filter: `blur(${blur}px)`,
                  }}
                />
              )}

              {/* Header mockup */}
              <div className="relative z-10 border-b border-black/10 pb-3 flex justify-between items-center">
                <div className="w-6 h-6 rounded-full bg-[#e84e4e] flex items-center justify-center text-white font-bold text-[8px]">E+L</div>
                <div className="flex gap-2">
                  <div className="w-6 h-1.5 bg-black/20 rounded"></div>
                  <div className="w-6 h-1.5 bg-black/20 rounded"></div>
                </div>
              </div>

              {/* Text content mockup to visualize readability */}
              <div className="relative z-10 space-y-4 my-auto text-center py-4 bg-white/70 backdrop-blur-sm border-2 border-black p-4 shadow-[2px_2px_0px_0px_#000]">
                <h4 className="font-serif text-lg font-black text-black">A Nossa História de Amor</h4>
                <p className="font-serif text-xs text-black/80 leading-relaxed">
                  "No primeiro dia em que nos vimos, o universo conspirou ao nosso favor..."
                </p>
                <button className="bg-[#e84e4e] text-white font-bold uppercase text-[8px] px-3 py-1.5 border border-black shadow-[1px_1px_0px_0px_#000]">
                  Ver Galeria Completa
                </button>
              </div>

              {/* Page label simulator indicator */}
              <div className="relative z-10 text-center font-sans text-[9px] font-black uppercase tracking-wider text-black bg-white/90 border border-black py-1 px-2 mx-auto">
                {selectedTarget === "global" 
                  ? "Visualização Geral (Global)" 
                  : `Visualização da Página: ${PAGES_LIST.find(p => p.path === selectedTarget)?.label}`
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library of Installed Wallpapers */}
      <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a]">
        <div className="mb-6">
          <h3 className="text-3xl font-black italic">Papéis de Parede Ativos</h3>
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Configurados no momento para o casal e visitantes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Global Item */}
          <div className="border-2 border-black p-4 flex flex-col justify-between hover:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_#1a1a1a]">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="bg-black text-[8px] text-white font-bold uppercase px-2 py-0.5 tracking-wider flex items-center gap-1">
                  <Globe className="w-3 h-3 text-sky-400" /> Geral / Global
                </span>
                {globalWallpaper && (
                  <button 
                    onClick={() => handleRemoveWallpaper("global")}
                    className="text-black/50 hover:text-red-650 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="aspect-[16/9] border border-black bg-gray-100 flex items-center justify-center relative overflow-hidden mb-3">
                {globalWallpaper ? (
                  <>
                    <img src={globalWallpaper.url} alt="Global" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white p-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider">Ajustes ativos:</p>
                        <p className="text-[9px] font-mono opacity-80">Opacidade: {globalWallpaper.opacity}% | Blur: {globalWallpaper.blur}px</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-[#1a1a1a]/40 p-4">
                    <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                    <p className="font-sans text-[9px] font-bold uppercase tracking-wider">Sem plano de fundo global</p>
                  </div>
                )}
              </div>
            </div>
            {globalWallpaper && (
              <button 
                onClick={() => {
                  setSelectedUrl(globalWallpaper.url);
                  setOpacity(globalWallpaper.opacity);
                  setBlur(globalWallpaper.blur);
                  setSelectedTarget("global");
                  toast.info("Configuração carregada nos controles editores!");
                }}
                className="w-full border-2 border-black py-2 font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                Editar Ajustes
              </button>
            )}
          </div>

          {/* Page Specific Items */}
          {PAGES_LIST.filter(p => p.path !== "global").map((pageItem) => {
            const hasWallpaper = pageWallpapers[pageItem.path];
            return (
              <div key={pageItem.path} className="border-2 border-black p-4 flex flex-col justify-between hover:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_#1a1a1a]">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-amber-100 text-[8px] text-amber-900 border border-amber-900 font-bold uppercase px-2 py-0.5 tracking-wider flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {pageItem.label}
                    </span>
                    {hasWallpaper && (
                      <button 
                        onClick={() => handleRemoveWallpaper(pageItem.path)}
                        className="text-black/50 hover:text-red-650 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="aspect-[16/9] border border-black bg-gray-100 flex items-center justify-center relative overflow-hidden mb-3">
                    {hasWallpaper ? (
                      <>
                        <img src={hasWallpaper.url} alt={pageItem.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="text-center text-white p-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider">Ajustes ativos:</p>
                            <p className="text-[9px] font-mono opacity-80">Opacidade: {hasWallpaper.opacity}% | Blur: {hasWallpaper.blur}px</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-[#1a1a1a]/40 p-4">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                        <p className="font-sans text-[9px] font-bold uppercase tracking-wider">Herdando Global</p>
                      </div>
                    )}
                  </div>
                </div>
                {hasWallpaper && (
                  <button 
                    onClick={() => {
                      setSelectedUrl(hasWallpaper.url);
                      setOpacity(hasWallpaper.opacity);
                      setBlur(hasWallpaper.blur);
                      setSelectedTarget(pageItem.path);
                      toast.info(`Configurações de "${pageItem.label}" carregadas no editor!`);
                    }}
                    className="w-full border-2 border-black py-2 font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                  >
                    Editar Ajustes
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Guide details */}
      <section className="bg-[#fcf9f2] border-2 border-black p-6 flex flex-col md:flex-row items-center gap-6">
        <HelpCircle className="w-12 h-12 text-[#e84e4e]" />
        <div className="space-y-1">
          <h4 className="font-black text-xl">Como funciona o Plano de Fundo?</h4>
          <p className="font-serif text-sm leading-relaxed max-w-3xl">
            Seus papéis de parede são aplicados utilizando propriedades nativas do CSS montadas diretamente no layout principal. O papel de parede Global cobre todas as rotas que não tiverem um papel de parede personalizado. Quando você define um papel de parede para a página "História", por exemplo, os visitantes verão aquela imagem apenas lá, mantendo a experiência estética perfeita e legível.
          </p>
        </div>
      </section>
    </div>
  );
}
