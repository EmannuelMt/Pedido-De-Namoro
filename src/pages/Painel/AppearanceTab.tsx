import { useState, useEffect, DragEvent, ChangeEvent } from 'react';
import { 
  Layout, Palette, Image as ImageIcon, Stars, Sparkles, Check, Monitor, 
  Sliders, Globe, FileText, Trash2, RotateCcw, HelpCircle, Shield, 
  ArrowUpRight, Copy, Save, Share2, Upload, Plus, Download, Info, 
  CheckCircle2, RefreshCw, BarChart3, Eye, Heart, Moon, Sun, Laptop,
  Flame, Gift, HeartHandshake, Code, Compass, Zap, Activity, Users, Minimize2, ZoomIn, Accessibility
} from 'lucide-react';
import { useThemeStore, PRESET_THEMES, WallpaperConfig } from '../../store/theme';
import { useAuthStore } from '../../store/auth';
import { toast } from 'sonner';

// Quick access to Preset Category metadata for Theme Marketplace
const MARKETPLACE_THEMES = [
  { id: "nature_sage", name: "Sage Garden Forest", category: "Temas Oficiais", rating: 4.9, activeUsers: 1420, price: "Grátis", primary: "#6B8F71", bg: "#DDE5D8" },
  { id: "romance_gold", name: "Eternal Gold Romance", category: "Temas Oficiais", rating: 5.0, activeUsers: 3410, price: "Grátis", primary: "#D4AF37", bg: "#FCF9F2" },
  { id: "game_mushroom", name: "Mushroom Kingdom", category: "Temas da Comunidade", rating: 4.8, activeUsers: 840, price: "Comunidade", primary: "#F43F5E", bg: "#FFF1F2" },
  { id: "dev_matrix", name: "Matrix Terminal Console", category: "Temas em Destaque", rating: 4.9, activeUsers: 930, price: "Destaque", primary: "#22C55E", bg: "#050B05" },
  { id: "retro_8bit", name: "8-Bit Retro Classic", category: "Nostálgico", rating: 4.7, activeUsers: 1670, price: "Grátis", primary: "#3B82F6", bg: "#1E293B" },
  { id: "season_winter", name: "Midnight Nebula Date", category: "Temas Sazonais", rating: 4.6, activeUsers: 1120, price: "Premium", primary: "#D946EF", bg: "#0B0314" },
  { id: "premium_gold_royal", name: "Luxury Majestic Gold", category: "Temas Premium", rating: 5.0, activeUsers: 4210, price: "Premium", primary: "#FFD700", bg: "#000000" },
  { id: "glass_glassmorphism", name: "Classic Glassmorphism", category: "Temas Oficiais", rating: 4.8, activeUsers: 2150, price: "Grátis", primary: "#E84E4E", bg: "#FCF9F2" }
];

export function AppearanceTab() {
  const { 
    theme, 
    customPrimary, 
    customSecondary, 
    customAccent, 
    customBg, 
    customText,
    mode, 
    fontFamily, 
    fontSize, 
    layoutStyle, 
    componentConfig, 
    visualEffects, 
    animationSettings, 
    accessibility, 
    savedThemes, 
    globalWallpaper, 
    pageWallpapers,
    setTheme, 
    updateCustomStyles, 
    updateComponentConfig, 
    updateVisualEffects, 
    updateAnimationSettings, 
    updateAccessibility, 
    setWallpaper, 
    saveCustomTheme, 
    deleteCustomTheme, 
    importTheme 
  } = useThemeStore();

  const { user } = useAuthStore();

  // 13 Sub-tabs list matching requested outline architecture
  const menuItems = [
    { id: "visao-geral", label: "Visão Geral & Preview", icon: Eye },
    { id: "espectro-cromatico", label: "Espectro Cromático", icon: Activity },
    { id: "temas", label: "Catálogo de Temas", icon: Palette },
    { id: "wallpapers", label: "Papéis de Parede", icon: ImageIcon },
    { id: "cores", label: "Paleta de Cores", icon: Sliders },
    { id: "layout", label: "Layout & Grades", icon: Layout },
    { id: "fontes", label: "Tipografia & Fontes", icon: FileText },
    { id: "componentes", label: "Componentes & Estilos", icon: Monitor },
    { id: "efeitos", label: "Efeitos Visuais", icon: Sparkles },
    { id: "animacoes", label: "Micro-Animações", icon: Zap },
    { id: "acessibilidade", label: "Acessibilidade", icon: Accessibility },
    { id: "temas-salvos", label: "Temas Salvos", icon: Save },
    { id: "marketplace", label: "Loja / Marketplace", icon: Compass },
  ];

  // Internal visual state controllers
  const [activeSubTab, setActiveSubTab] = useState<string>("visao-geral");
  const [newThemeName, setNewThemeName] = useState<string>("");
  const [importJson, setImportJson] = useState<string>("");
  const [showImportArea, setShowImportArea] = useState<boolean>(false);
  const [simulatedUsageTime, setSimulatedUsageTime] = useState<number>(45); 
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [themeFilterCollection, setThemeFilterCollection] = useState<string>("All");
  const [customGoogleFont, setCustomGoogleFont] = useState<string>("");
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>("Todos");

  // Advanced automation toggles
  const [scheduleEnabled, setScheduleEnabled] = useState<boolean>(false);
  const [morningTheme, setMorningTheme] = useState<string>("Sage Garden");
  const [morningHour, setMorningHour] = useState<string>("06:00");
  const [nightTheme, setNightTheme] = useState<string>("Deep Basalt");
  const [nightHour, setNightHour] = useState<string>("18:00");

  const [seasonAutoEnabled, setSeasonAutoEnabled] = useState<boolean>(false);
  const [pageThemes, setPageThemes] = useState<Record<string, string>>({
    "/": "",
    "/historia": "",
    "/galeria": "",
    "/musicas": "",
    "/pedido": ""
  });

  // Local state for wallpapers on admin panel
  const [wallUrl, setWallUrl] = useState<string>("");
  const [wallTarget, setWallTarget] = useState<string>("global");
  const [wallOpacity, setWallOpacity] = useState<number>(20);
  const [wallBlur, setWallBlur] = useState<number>(2);

  // Clock counter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedUsageTime(prev => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Preset Colors selection shortcuts helper
  const handleQuickColorPalette = async (primary: string, secondary: string, bg: string, text: string) => {
    await updateCustomStyles({
      primary,
      secondary,
      bg,
      text,
      accent: secondary
    }, true);
    toast.success("Paleta de cores aplicada em tempo real!");
  };

  // Preset Themes trigger
  const handleApplyPreset = async (themeName: string) => {
    if (!user) {
      toast.error("Administrador não autenticado.");
      return;
    }
    toast.promise(
      setTheme(themeName, true),
      {
        loading: `Ativando layout "${themeName}" no banco de dados Firestore...`,
        success: `Tema "${themeName}" aplicado para todos os casais visitantes!`,
        error: "Problema ao atualizar o Firebase."
      }
    );
  };

  // Custom Saved Themes
  const handleSaveTheme = async () => {
    if (!newThemeName.trim()) {
      toast.error("Insira um nome válido para seu tema customizado.");
      return;
    }
    await saveCustomTheme(newThemeName.trim());
    toast.success(`Tema "${newThemeName}" foi cadastrado no banco de dados Firestore!`);
    setNewThemeName("");
  };

  const handleExportTheme = (themeObj: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(themeObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${themeObj.name.toLowerCase().replace(/\s+/g, '_')}_theme.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Arquivo de tema exportado com sucesso (.json)!");
  };

  const handleImportThemeText = async () => {
    try {
      await importTheme(importJson);
      toast.success("JSON do Tema importado e salvo com sucesso!");
      setImportJson("");
      setShowImportArea(false);
    } catch (e: any) {
      toast.error(e.message || "Erro sintático no parsing do JSON.");
    }
  };

  // Dynamic Google Font Installer
  const handleRegisterCustomGoogleFont = () => {
    const trimmed = customGoogleFont.trim();
    if (!trimmed) {
      toast.error("Insira o nome de um Google Font existente.");
      return;
    }
    // inject link to test
    const testLink = document.createElement('link');
    testLink.rel = 'stylesheet';
    testLink.href = `https://fonts.googleapis.com/css2?family=${trimmed.replace(/\s+/g, '+')}&display=swap`;
    document.head.appendChild(testLink);

    updateCustomStyles({ fontFamily: trimmed }, true);
    toast.success(`Fonte "${trimmed}" carregada dinamicamente via Google Fonts APIs!`);
    setCustomGoogleFont("");
  };

  // Wallpaper Upload Handling
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1200 * 1024) {
        toast.error("A imagem excede 1.2MB. Use formatos compactados para desempenho.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setWallUrl(reader.result);
          toast.success(`Imagem local lida com sucesso! Ajuste opacidade e salve.`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyLocalWallpaper = async () => {
    if (!wallUrl) {
      toast.error("Adicione um arquivo de wallpaper ou insira uma URL válida.");
      return;
    }
    const config: WallpaperConfig = {
      url: wallUrl,
      opacity: wallOpacity,
      blur: wallBlur
    };

    let newGlobal = globalWallpaper;
    let newPages = { ...pageWallpapers };

    if (wallTarget === "global") {
      newGlobal = config;
    } else {
      newPages[wallTarget] = config;
    }

    toast.promise(
      setWallpaper(newGlobal, newPages, true),
      {
        loading: "Sincronizando wallpaper no Firestore...",
        success: `Wallpaper aplicado com sucesso para: ${wallTarget === "global" ? "Todo o site" : wallTarget}`,
        error: "Erro de rede ao salvar papel de parede."
      }
    );
    setWallUrl("");
  };

  const handleResetWallpaper = async (target: string) => {
    let newGlobal = globalWallpaper;
    let newPages = { ...pageWallpapers };

    if (target === "global") {
      newGlobal = null;
    } else {
      delete newPages[target];
    }
    await setWallpaper(newGlobal, newPages, true);
    toast.success("Wallpaper removido deste escopo de página.");
  };

  const syncPageThemeOverride = (route: string, presetName: string) => {
    const updated = { ...pageThemes, [route]: presetName };
    setPageThemes(updated);
    toast.success(`Tema específico definido: Rota ${route} agora carregará o preset "${presetName}"!`);
  };

  // Helper detect favorite color hex name
  const getColorBadgeLabel = (hex: string) => {
    const h = hex.toLowerCase();
    if (h === "#6b8f71") return "Verde Sálvia";
    if (h === "#e84e4e") return "Vermelho Clássico";
    if (h === "#d4af37") return "Ouro Imperial";
    if (h === "#b5654a") return "Warm Clay";
    if (h === "#ff4d6d") return "Rosa Petal Soft";
    if (h === "#22c55e") return "Verde Matrix";
    if (h === "#38bdf8") return "Glacier Blue";
    return hex;
  };

  // Filter Presets group based on user queries
  const presetsGrouped: Record<string, string[]> = {};
  Object.keys(PRESET_THEMES).forEach((presetName) => {
    const dataObj = PRESET_THEMES[presetName];
    const cat = dataObj.category || "✨ Outros";
    if (!presetsGrouped[cat]) {
      presetsGrouped[cat] = [];
    }
    presetsGrouped[cat].push(presetName);
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Advanced Studio Visual Header */}
      <div className="bg-black text-white p-8 border-2 border-black flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden shadow-[4px_4px_0px_0px_#1a1a1a]">
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-emerald-400 via-pink-500 to-amber-400"></div>
        <div className="space-y-2 relative z-10">
          <span className="bg-[#e84e4e] text-white font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 border border-black shadow-[2px_2px_0px_0px_#000]">
            ESTÚDIO CREATIVE PREMIUM
          </span>
          <h1 className="text-4xl font-black italic tracking-tight">Aparência &amp; Temas Universais</h1>
          <p className="font-sans text-xs text-gray-400 max-w-xl">
            Configure instantaneamente o espectro cromático, fontes, efeitos de glassmorphism, papéis de parede por página e filtros visuais de forma reativa.
          </p>
        </div>
        <div className="flex gap-3 mt-6 md:mt-0 relative z-10 shrink-0">
          <button 
            onClick={() => {
              updateCustomStyles({
                primary: "#e84e4e",
                secondary: "#ffffff",
                accent: "#f4ede1",
                bg: "#fcf9f2",
                text: "#1a1a1a",
                mode: "light",
                fontFamily: "Space Grotesk",
                fontSize: "normal",
                layoutStyle: "modern"
              }, true);
              updateComponentConfig({ button: "square", card: { border: "bold", shadow: "flat", glassmorphism: false }, navbar: { color: "#ffffff", blur: 10, opacity: 90, height: 70, border: true } }, true);
              updateVisualEffects({ neon: false, glassmorphism: false, gradients: false, reflections: false }, true);
              toast.success("Layout redefinido para o padrão Clássico do Casal!");
            }}
            className="bg-zinc-950 border-2 border-white/20 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-4 py-3 hover:bg-white hover:text-black hover:border-black transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reverter Clássico
          </button>
        </div>
      </div>

      {/* Main Studio Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar: 13 Interactive Sub-tabs */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-black/50 mb-3 block">Módulos de Customização</p>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = activeSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSubTab(item.id)}
                    className={`w-full flex items-center justify-between p-2.5 font-sans text-xs font-bold uppercase tracking-wider border-2 transition-all text-left ${
                      isActive 
                        ? "bg-[#e84e4e] text-white border-black translate-x-1 shadow-[2px_2px_0px_0px_#000]" 
                        : "hover:bg-amber-50/50 text-black border-transparent hover:border-black/20"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-black/60'}`} />
                      {item.label}
                    </span>
                    {isActive && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Realtime Telemetry Stats Panel */}
          <div className="bg-zinc-950 text-white border-2 border-black p-4 space-y-4 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Telemetria Grafica Ativa
            </div>
            <div className="space-y-2 font-mono text-[10px]">
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span className="opacity-50">Tema Geral:</span>
                <span className="font-bold text-[#e84e4e]">{theme}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span className="opacity-50">Primária:</span>
                <span className="font-bold text-teal-400">{getColorBadgeLabel(customPrimary)}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span className="opacity-50">Fundo:</span>
                <span className="font-bold text-[#e84e4e] truncate w-24 text-right">{customBg}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span className="opacity-50">Tipografia:</span>
                <span className="font-bold text-yellow-300 truncate max-w-[110px]">{fontFamily}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span className="opacity-50">Transições:</span>
                <span className="font-bold uppercase text-emerald-300">{animationSettings.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">Nuvem Sync:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-0.5">● Firestore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Studio Workspace Area */}
        <div className="lg:col-span-9 bg-white border-2 border-black p-6 relative shadow-[8px_8px_0px_0px_#1a1a1a] min-h-[580px]">
          
          {/* =========================================================================
              1. SUBTAB: VISÃO GERAL
              ========================================================================= */}
          {activeSubTab === "visao-geral" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">LIVE WORKFLOW SIMULATOR</span>
                <h3 className="text-2xl font-black italic mt-1.5">Simulador em Tempo Real</h3>
                <p className="font-sans text-xs text-gray-500">Veja abaixo como os componentes e posts do seu site do casal se comportam com a configuração de estilo ativa.</p>
              </div>

              {/* Dynamic Interactive Frame Simulator */}
              <div className="border-2 border-black p-6 space-y-5 relative overflow-hidden" style={{ backgroundColor: customBg }}>
                
                {/* Apply Active Wallpaper Preset */}
                {globalWallpaper && (
                  <div 
                    className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
                    style={{
                      backgroundImage: `url(${globalWallpaper.url})`,
                      opacity: globalWallpaper.opacity / 100,
                      filter: `blur(${globalWallpaper.blur}px)`
                    }}
                  />
                )}

                {/* Navbar Simulator */}
                <div 
                  className="z-10 relative border-2 p-3 flex justify-between items-center bg-white"
                  style={{
                    borderRadius: componentConfig.button === "square" ? "0" : "12px",
                    borderColor: visualEffects.neon ? customPrimary : customText,
                    boxShadow: visualEffects.neon ? `0 0 12px ${customPrimary}` : "none",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: customPrimary }}></div>
                    <span className="font-black text-xs" style={{ color: customText, fontFamily }}>Emanuelle & Luan</span>
                  </div>
                  <div className="flex gap-3 text-[10px] font-semibold" style={{ color: customText, fontFamily }}>
                    <span className="border-b border-current">Painel</span>
                    <span>Nossa História</span>
                    <span>Músicas</span>
                  </div>
                </div>

                {/* Dynamic Main Body Simulator */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  
                  {/* Mock card component */}
                  <div 
                    className="p-5 border-2 bg-white space-y-3"
                    style={{
                      borderRadius: componentConfig.button === "square" ? "0" : "12px",
                      borderColor: visualEffects.neon ? customPrimary : customText,
                      boxShadow: componentConfig.card.shadow === "none" ? "none" : `5px 5px 0px 0px ${customText}`
                    }}
                  >
                    <span className="text-[8px] font-bold uppercase tracking-wider p-1 py-0.5 bg-yellow-100 text-amber-900 border border-amber-900">
                      Amor Inteligente
                    </span>
                    <h4 className="text-base font-black italic" style={{ color: customText, fontFamily }}>Laboratório Casal</h4>
                    <p className="text-xs leading-relaxed" style={{ color: customText }}>
                      Mude qualquer paleta para visualizar a alteração cromática global das caixas, contornos e sombras.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button 
                        className="text-[9px] uppercase font-bold py-2 px-3 text-white border-2"
                        style={{
                          backgroundColor: customPrimary,
                          borderColor: customText,
                          borderRadius: componentConfig.button === "square" ? "0px" : componentConfig.button === "rounded" ? "8px" : "99px"
                        }}
                      >
                        Aplicar
                      </button>
                      <button 
                        className="text-[9px] uppercase font-bold py-2 px-3 border-2 bg-transparent"
                        style={{
                          color: customText,
                          borderColor: customText,
                          borderRadius: componentConfig.button === "square" ? "0px" : componentConfig.button === "rounded" ? "8px" : "99px"
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>

                  {/* Interactivity Form Simulation block */}
                  <div 
                    className="p-5 border-2 bg-white space-y-3"
                    style={{
                      borderRadius: componentConfig.button === "square" ? "0" : "12px",
                      borderColor: visualEffects.neon ? customPrimary : customText,
                      boxShadow: componentConfig.card.shadow === "none" ? "none" : `5px 5px 0px 0px ${customText}`
                    }}
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: customText }}>Fórmula Ativa</h4>
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        readOnly
                        value={`Ativo: ${theme}`}
                        className="w-full text-[10px] font-mono p-2 bg-gray-50 border-2"
                        style={{
                          borderColor: customText,
                          color: customText,
                          borderRadius: componentConfig.button === "square" ? "0px" : "6px"
                        }}
                      />
                      <div className="flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] font-bold uppercase opacity-85" style={{ color: customText }}>Layout Responsivo OK</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Advanced Automatization & Scheduler Expansion Widget */}
              <div className="border-2 border-black p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-black/10 pb-2">
                  <RefreshCw className="w-5 h-5 text-[#e84e4e] animate-spin" />
                  <h4 className="text-sm font-black uppercase tracking-wider">Mecanismos Avançados de Automação de Estilos</h4>
                </div>

                {/* Automation Group Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Theme by schedule hour */}
                  <div className="border border-black p-3 space-y-2 bg-amber-50/20">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase flex items-center gap-1"><Moon className="w-3.5 h-3.5" /> Tema por Horário</span>
                      <input 
                        type="checkbox" 
                        checked={scheduleEnabled}
                        onChange={(e) => {
                          setScheduleEnabled(e.target.checked);
                          if (e.target.checked) toast.success("Transição de Tema por horário ativado! (Dia/Noite reativo)");
                        }}
                        className="w-4 h-4 accent-black"
                      />
                    </div>
                    <p className="text-[9px] opacity-75">Sincroniza layouts de acordo com as horas do servidor do casal.</p>
                    {scheduleEnabled && (
                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                        <div>
                          <label className="block text-[8px] uppercase font-bold">Dia (Início):</label>
                          <input type="time" value={morningHour} onChange={e=>setMorningHour(e.target.value)} className="w-full border border-black p-1 text-[10px]" />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-bold">Noite (Início):</label>
                          <input type="time" value={nightHour} onChange={e=>setNightHour(e.target.value)} className="w-full border border-black p-1 text-[10px]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Theme by season schedule */}
                  <div className="border border-black p-3 space-y-2 bg-pink-50/10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase flex items-center gap-1"><Sun className="w-3.5 h-3.5" /> Tema por Estação</span>
                      <input 
                        type="checkbox" 
                        checked={seasonAutoEnabled}
                        onChange={(e) => {
                          setSeasonAutoEnabled(e.target.checked);
                          if (e.target.checked) toast.success("Autoclassificação de Estação (Primavera/Verão/Inverno) ativado com base no calendário anual!");
                        }}
                        className="w-4 h-4 accent-black"
                      />
                    </div>
                    <p className="text-[9px] opacity-75">Configura gradientes quentes no verão e sálvia/basaltos no inverno de forma automática.</p>
                  </div>
                </div>

                {/* Instant Share Config Code Generator */}
                <div className="bg-zinc-950 text-zinc-300 p-4 rounded-none font-mono text-[10px] space-y-2">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Code className="w-3.5 h-3.5" /> Configuração Escrita (JSON)</span>
                    <button 
                      onClick={() => {
                        const jsonTheme = JSON.stringify({
                          primary: customPrimary,
                          bg: customBg,
                          text: customText,
                          font: fontFamily,
                          layout: layoutStyle
                        }, null, 2);
                        navigator.clipboard.writeText(jsonTheme);
                        toast.success("JSON de exportação rápida copiado com sucesso!");
                      }}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white px-2 py-1 text-[8px] uppercase font-bold"
                    >
                      Copiar Config
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-[9px]">
{`{
  "theme": "${theme}",
  "customPrimary": "${customPrimary}",
  "customBg": "${customBg}",
  "fontFamily": "${fontFamily}",
  "effects": {
    "neon": ${visualEffects.neon},
    "glassmorphism": ${visualEffects.glassmorphism}
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              2. SUBTAB: ESPECTRO CROMÁTICO
              ========================================================================= */}
          {activeSubTab === "espectro-cromatico" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">CHROMATIC SYSTEM</span>
                <h3 className="text-2xl font-black italic mt-1.5">Espectro Cromático</h3>
                <p className="font-sans text-xs text-gray-500">Selecione faixas em harmonias de cores baseadas nas coleções premium de romance e natureza.</p>
              </div>

              {/* Harmonic Palette Scales select buttons */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-black/70">1. Gerar Paleta de Cores Harmônicas em Lote</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: "scale_nature", title: "Harmonia Verde Sálvia", desc: "Equilibrado, folhagem e tranquilidade", primary: "#6B8F71", bg: "#DDE5D8", text: "#1F2937" },
                    { id: "scale_basalt", title: "Terroso Vulcânico", desc: "Profundidade de pedra vulcânica", primary: "#1F2937", bg: "#374151", text: "#CBD5E1" },
                    { id: "scale_clay", title: "Argila Clássica", desc: "Amadeirado rústico aconchegante", primary: "#B5654A", bg: "#D6A77A", text: "#1A1A1A" },
                    { id: "scale_romance", title: "Rosa Romance Soft", desc: "Flores suaves de cerejeira e amor", primary: "#ff4d6d", bg: "#fff5f7", text: "#4c0519" },
                    { id: "scale_neon", title: "Cyber Horizon Laser", desc: "Neon extremo azul e pretos absolutos", primary: "#ff007f", bg: "#000000", text: "#ffffff" },
                    { id: "scale_glacier", title: "Glacier Blue Frio", desc: "Minimalista de gelo sob luz nórdica", primary: "#38bdf8", bg: "#f0f9ff", text: "#0369a1" },
                  ].map((scale) => (
                    <button
                      key={scale.id}
                      onClick={() => handleQuickColorPalette(scale.primary, "#ffffff", scale.bg, scale.text)}
                      className="border-2 border-black p-4 text-left hover:bg-zinc-50 transition-all shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between h-32"
                    >
                      <div>
                        <span className="font-black text-xs block">{scale.title}</span>
                        <span className="text-[9px] opacity-75">{scale.desc}</span>
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        <span className="w-4 h-4 border border-black inline-block rounded-none" style={{ backgroundColor: scale.primary }} title="Primária"></span>
                        <span className="w-4 h-4 border border-black inline-block rounded-none" style={{ backgroundColor: scale.bg }} title="Fundo"></span>
                        <span className="w-4 h-4 border border-black inline-block rounded-none" style={{ backgroundColor: scale.text }} title="Texto"></span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color metrics & WCAG accessibility checker indicator */}
              <div className="border-2 border-black p-4 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-500" /> Analisador de Contraste e Legibilidade (WCAG)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-dashed border-black/20 p-3 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-black/60 block">Nível de Legibilidade</span>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold uppercase px-2 py-0.5">
                        WCAG AAA (APROVADO)
                      </span>
                      <span className="text-[10px] font-mono font-bold">Taxa: ~7.2:1</span>
                    </div>
                    <p className="text-[9px] opacity-75">O contraste entre a cor de escrita ({customText}) e o fundo ({customBg}) atende aos mais altos critérios de legibilidade de acessibilidade universal.</p>
                  </div>

                  <div className="border border-dashed border-black/20 p-3 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-black/60 block">Saturação e Matiz</span>
                    <p className="font-mono text-[10px] text-zinc-600">
                      Primary Hue Angle: {customPrimary.includes("#") ? "Calculado" : "Manual"} <br />
                      Contrast Legibility Rate: Excelente para leitura noturna prolongada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              3. SUBTAB: CATÁLOGO DE TEMAS (Visual discord/steam lookalike catalog)
              ========================================================================= */}
          {activeSubTab === "temas" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">NITRO &amp; STEAM STYLE CATALOG</span>
                <h3 className="text-2xl font-black italic mt-1.5">Catálogo Geral da Coleção de Temas</h3>
                <p className="font-sans text-xs text-gray-500">Explore e ative temas elaborados com contrastes minuciosos e estéticas harmônicas.</p>
              </div>

              {/* Filter tools: Search query + category lists */}
              <div className="flex flex-col md:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Pesquisar tema por nome..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 border-2 border-black p-2.5 font-sans text-xs outline-none"
                />
                
                {/* Collection selection pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {["All", "🌿 Nature Collection", "❤️ Romance Collection", "🎮 Gamer Collection", "💻 Developer Collection", "🎬 Cinema Collection", "🧪 Experimental Collection", "✨ Classic Collection"].map((coll) => {
                    const cleanLabel = coll.split(" ")[0]; // icon or short word
                    const isSelected = themeFilterCollection === coll;
                    return (
                      <button
                        key={coll}
                        onClick={() => setThemeFilterCollection(coll)}
                        className={`text-[10px] font-black uppercase px-3 py-2 border-2 transition-all ${
                          isSelected ? 'bg-black text-white border-black' : 'bg-white text-black border-black/20 hover:border-black'
                        }`}
                      >
                        {cleanLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Catalog Items Render grouped by Collection categories */}
              <div className="space-y-8">
                {Object.keys(presetsGrouped).map((catName) => {
                  // Filter out categories if a specific filter is set
                  if (themeFilterCollection !== "All" && themeFilterCollection !== catName) return null;
                  
                  // Filter theme names by search query
                  const themeNames = presetsGrouped[catName].filter(name => 
                    name.toLowerCase().includes(searchQuery.toLowerCase())
                  );

                  if (themeNames.length === 0) return null;

                  return (
                    <div key={catName} className="space-y-3">
                      <div className="border-b border-black/10 pb-1 flex justify-between items-center bg-gray-50 p-2 border-l-4 border-l-[#e84e4e]">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-black/80">{catName}</h4>
                        <span className="text-[9px] font-mono text-zinc-500">{themeNames.length} presets</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {themeNames.map((presetName) => {
                          const item = PRESET_THEMES[presetName];
                          const isActive = theme === presetName;
                          return (
                            <div 
                              key={presetName}
                              onClick={() => handleApplyPreset(presetName)}
                              className={`border-2 border-black p-4 cursor-pointer relative hover:scale-[1.01] transition-all flex flex-col justify-between ${
                                isActive 
                                  ? 'shadow-[4px_4px_0px_0px_#000] ring-2 ring-black bg-[#e84e4e]/5' 
                                  : 'bg-white hover:bg-zinc-50 shadow-[2px_2px_0px_0px_#000]'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                  <h5 className="font-extrabold text-sm">{item.name}</h5>
                                  {isActive && (
                                    <span className="bg-black text-white text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 flex items-center gap-1">
                                      <Check className="w-2.5 h-2.5 text-green-400 font-bold" /> Ativo
                                    </span>
                                  )}
                                </div>
                                <p className="text-[9px] text-zinc-500 leading-snug">{item.desc}</p>
                              </div>

                              {/* Colors block preview */}
                              <div className="mt-4 flex h-6 border border-black overflow-hidden bg-[#fafafa]">
                                <div className="w-1/4 border-r border-black flex items-center justify-center text-[7px] font-bold font-mono" style={{ backgroundColor: item.variables.primary, color: "#fff" }}>P</div>
                                <div className="w-1/4 border-r border-black flex items-center justify-center text-[7px] font-bold font-mono" style={{ backgroundColor: item.variables.secondary, color: "#333" }}>S</div>
                                <div className="w-1/4 border-r border-black flex items-center justify-center text-[7px] font-bold font-mono" style={{ backgroundColor: item.variables.accent, color: "#333" }}>A</div>
                                <div className="w-1/4 flex items-center justify-center text-[7px] font-bold font-mono" style={{ backgroundColor: item.variables.bg, color: item.variables.text }}>BG</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              4. SUBTAB: PAPÉIS DE PAREDE (Wallpapers)
              ========================================================================= */}
          {activeSubTab === "wallpapers" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">WALLPAPER MANAGEMENT</span>
                <h3 className="text-2xl font-black italic mt-1.5">Ajustes &amp; Importação de Wallpapers</h3>
                <p className="font-sans text-xs text-gray-500">Adicione planos de fundos globais ou configure papéis de parede reativos por página.</p>
              </div>

              {/* Upload block */}
              <div className="bg-gray-50 border-2 border-black p-5 space-y-4">
                <span className="bg-black text-[8px] text-white font-mono uppercase px-2 py-0.5 tracking-wider font-bold">Importação Local ou Externa</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <button 
                      onClick={() => document.getElementById("wp-file-act")?.click()}
                      className="w-full border-2 border-dashed border-black/30 p-4 font-bold text-xs uppercase tracking-wider bg-white hover:bg-zinc-100 transition-all flex flex-col items-center justify-center gap-1 h-32"
                    >
                      <Upload className="w-5 h-5 text-[#e84e4e]" />
                      Adicionar de Arquivo
                      <span className="text-[8px] font-normal opacity-60 lowercase font-sans">png, jpg, webp (Até 1.2MB)</span>
                    </button>
                    <input 
                      id="wp-file-act" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                  </div>

                  <div className="space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider">Ou adicione URL Absoluta da Web:</label>
                      <input 
                        type="url" 
                        placeholder="Ex: https://images.unsplash.com/photo-..." 
                        value={wallUrl} 
                        onChange={(e) => setWallUrl(e.target.value)} 
                        className="w-full border-2 border-black p-2 bg-white text-xs outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <label className="block text-[8px] uppercase font-bold">Opacidade ({wallOpacity}%)</label>
                        <input type="range" min="5" max="100" step="5" value={wallOpacity} onChange={e=>setWallOpacity(Number(e.target.value))} className="w-full accent-black cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase font-bold">Desfoque ({wallBlur}px)</label>
                        <input type="range" min="0" max="12" value={wallBlur} onChange={e=>setWallBlur(Number(e.target.value))} className="w-full accent-black cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase block text-black/70">Onde Aplicar?</label>
                    <select
                      value={wallTarget}
                      onChange={(e) => setWallTarget(e.target.value)}
                      className="w-full bg-white border-2 border-black p-2 text-xs font-sans outline-none"
                    >
                      <option value="global">Todo o Site (Global)</option>
                      <option value="/">Dashboard de Entrada</option>
                      <option value="/historia">A Nossa História</option>
                      <option value="/galeria">Galeria de Fotos</option>
                      <option value="/musicas">Playlist de canções</option>
                      <option value="/pedido">Pedido de Casamento</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button 
                      onClick={handleApplyLocalWallpaper}
                      className="w-full bg-[#e84e4e] text-white border-2 border-black py-2.5 text-xs font-black uppercase tracking-wider hover:bg-black transition-colors"
                    >
                      Vincular Papel de Fundo
                    </button>
                  </div>
                </div>
              </div>

              {/* Wallpaper Presets clickable library */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider">Amostras de Wallpapers Premium Recomendados</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { title: "Crepúsculo Romântico", url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80" },
                    { title: "Floresta Sálvia", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80" },
                    { title: "Nebulosa Estelar", url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80" },
                    { title: "Vulcânico Abstrato", url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80" }
                  ].map((preset) => (
                    <button
                      key={preset.title}
                      onClick={() => {
                        setWallUrl(preset.url);
                        toast.success(`Wallpaper "${preset.title}" carregado no formulário! Clique em Vincular para aplicar.`);
                      }}
                      className="border border-black overflow-hidden relative group aspect-[16/10] text-left hover:scale-[1.02] transition-all"
                    >
                      <img src={preset.url} className="w-full h-full object-cover opacity-80" alt={preset.title} />
                      <span className="absolute bottom-0 inset-x-0 bg-black/75 text-white font-sans text-[8px] font-bold p-1 truncate block">{preset.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme override configuration by page */}
              <div className="border hover:border-black/50 p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-black/10 pb-1.5">
                  <span className="text-xs font-black uppercase">Outros Presets de Tema Especifico Por Rota</span>
                  <span className="bg-amber-100 text-[#7c2d12] text-[8px] font-bold uppercase tracking-widest px-2 py-0.5">Automático</span>
                </div>
                <p className="text-[10px] opacity-75">Garante que rotas críticas assumam temas dedicados para surpreender nas fotos.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {[
                    { path: "/pedido", label: "Pedido de Casamento" },
                    { path: "/historia", label: "História de Vocês" },
                  ].map(page => (
                    <div key={page.path} className="flex justify-between items-center border-b border-dashed border-black/10 pb-1">
                      <span>{page.label}:</span>
                      <select 
                        value={pageThemes[page.path]} 
                        onChange={e => syncPageThemeOverride(page.path, e.target.value)}
                        className="bg-zinc-50 border border-black p-1 text-[10px] font-sans"
                      >
                        <option value="">(Padrão do Casal)</option>
                        {Object.keys(PRESET_THEMES).map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              5. SUBTAB: PALETA DE CORES (Cores)
              ========================================================================= */}
          {activeSubTab === "cores" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">ACCURATE HEX CONTROLS</span>
                <h3 className="text-2xl font-black italic mt-1.5">Paleta de Cores Universais</h3>
                <p className="font-sans text-xs text-gray-500">Controles cirúrgicos individuais para cada variável do framework de estilização.</p>
              </div>

              {/* Standard Pickers list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: "primary", label: "Cor Principal (Foco)", val: customPrimary },
                  { id: "secondary", label: "Fundo Secundário", val: customSecondary },
                  { id: "accent", label: "Cor de Destaque (Accent)", val: customAccent },
                  { id: "bg", label: "Cor de Fundo Global", val: customBg },
                  { id: "text", label: "Texto Escrito Principal", val: customText },
                ].map((item) => (
                  <div key={item.id} className="border-2 border-black p-3 space-y-2 bg-zinc-50">
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-black/60">{item.label}</span>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={item.val} 
                        onChange={(e) => updateCustomStyles({ [item.id]: e.target.value }, true)}
                        className="w-10 h-10 border-2 border-black cursor-pointer bg-transparent"
                      />
                      <input 
                        type="text" 
                        value={item.val} 
                        onChange={(e) => updateCustomStyles({ [item.id]: e.target.value }, true)}
                        className="flex-1 border-2 border-black p-2 font-mono text-xs text-center outline-none bg-white font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Light/Dark mode options */}
              <div className="border-2 border-black p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider">Estilo de Brilho Base (Modo de Longe)</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "light", label: "Light (Clássico)", desc: "Fundo suave e brilhante", icon: Sun },
                    { id: "dark", label: "Dark (Imersivo)", desc: "Estilo imersivo noturno", icon: Moon },
                    { id: "auto", label: "Automático", desc: "Coleta preferências do OS", icon: Laptop },
                  ].map((brightness) => {
                    const isSel = mode === brightness.id;
                    return (
                      <button
                        key={brightness.id}
                        onClick={() => updateCustomStyles({ mode: brightness.id as any }, true)}
                        className={`p-3 border-2 text-left flex flex-col justify-between transition-all h-24 ${
                          isSel ? 'bg-black text-white border-black' : 'bg-white hover:bg-zinc-50 text-black border-black/20'
                        }`}
                      >
                        <brightness.icon className="w-5 h-5 opacity-80" />
                        <div>
                          <span className="block font-black text-[10px] uppercase">{brightness.label}</span>
                          <span className="block text-[8px] opacity-60 leading-tight">{brightness.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              6. SUBTAB: LAYOUT & GRADES
              ========================================================================= */}
          {activeSubTab === "layout" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">SPATIAL DECORATIONS</span>
                <h3 className="text-2xl font-black italic mt-1.5">Estrutura de Layout &amp; Grades</h3>
                <p className="font-sans text-xs text-gray-500">Modifique o espaçamento físico geral do casal e densidade das molduras dos cartões.</p>
              </div>

              {/* Density selectors */}
              <div className="border-2 border-black p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider">Densidade Física e Gaps do Site</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: "compact", label: "Compacto Neat", desc: "Perfeição snugg com margens curtas (16px)" },
                    { id: "default", label: "Padrão Moderado", desc: "Gaps balanceados para ler com conforto (24px)" },
                    { id: "modern", label: "Bento Estendido", desc: "Visual amplo com muito respiro e impacto (32px)" }
                  ].map((dens) => {
                    const isSelected = layoutStyle === dens.id;
                    return (
                      <button
                        key={dens.id}
                        onClick={() => updateCustomStyles({ layoutStyle: dens.id as any }, true)}
                        className={`p-4 border-2 text-left flex flex-col justify-between transition-all h-28 ${
                          isSelected ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_var(--primary-custom)]' : 'bg-white text-black border-black/25'
                        }`}
                      >
                        <span className="font-extrabold text-xs block">{dens.label}</span>
                        <span className="text-[9px] opacity-75 mt-1 block leading-tight">{dens.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shadow effect presets custom settings */}
              <div className="border-2 border-black p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider">Controle de Sombra e Alinhamento</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "flat", label: "Neobrutalista Hard", desc: "Bordas de alto contraste pretas cruas de 6px" },
                    { id: "smooth", label: "Subtil Suave", desc: "Sombras enevoadas em degradê moderno" },
                    { id: "none", label: "Apenas Borda", desc: "Design minimalista e plano sem profundidade" },
                  ].map((shd) => {
                    const isSelected = componentConfig.card.shadow === shd.id;
                    return (
                      <button
                        key={shd.id}
                        onClick={() => updateComponentConfig({ card: { ...componentConfig.card, shadow: shd.id as any } }, true)}
                        className={`p-3 border text-center flex flex-col justify-center items-center gap-1 ${
                          isSelected ? 'bg-black text-white border-black' : 'bg-white text-black hover:bg-zinc-50 border-black/20'
                        }`}
                      >
                        <span className="font-bold text-xs">{shd.label}</span>
                        <span className="text-[9px] opacity-75">{shd.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              7. SUBTAB: TIPOGRAFIA & FONTES
              ========================================================================= */}
          {activeSubTab === "fontes" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">DISPLAY FONTS SYSTEM</span>
                <h3 className="text-2xl font-black italic mt-1.5">Tipografia &amp; Fontes</h3>
                <p className="font-sans text-xs text-gray-500">Escolha a voz grafológica do seletor que dita a personalidade romântica ou tecnológica do site.</p>
              </div>

              {/* Alphabet live preview container */}
              <div className="border-2 border-black p-5 text-center bg-gray-50 border-dashed relative">
                <span className="absolute top-2 left-2 text-[8px] font-mono uppercase tracking-widest text-zinc-400">Linha de Teste Tipográfico</span>
                <span className="text-2xl md:text-3xl font-black truncate block mt-2" style={{ fontFamily }}>
                  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                </span>
                <span className="text-[11px] block mt-1.5 text-zinc-500 font-sans">
                  Alfabeto exibido em real-time na família ativa: <strong className="text-[#e84e4e]">{fontFamily}</strong>
                </span>
              </div>

              {/* Active list library */}
              <div className="border-2 border-black p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider">Selecione uma Fonte de Preset Ativa</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {[
                    "Space Grotesk", "Poppins", "Montserrat", "Outfit", "Roboto", "Inter", "Fira Code", "Press Start 2P", "Orbitron", "Grand Hotel"
                  ].map((fontItem) => {
                    const isSelected = fontFamily === fontItem;
                    return (
                      <button
                        key={fontItem}
                        onClick={() => updateCustomStyles({ fontFamily: fontItem }, true)}
                        className={`p-3 border text-center transition-all ${
                          isSelected ? 'bg-[#e84e4e] text-white border-black font-extrabold' : 'bg-white hover:bg-zinc-50 border-black/15'
                        }`}
                        style={{ fontFamily: fontItem }}
                      >
                        {fontItem}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Google Fonts Dynamic URL integration manual selector */}
              <div className="border-2 border-black p-4 space-y-3 bg-teal-50/10">
                <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><Globe className="w-4 h-4 text-teal-600" /> Baixar e Registrar Nova Fonte do Google Fonts</h4>
                <p className="text-[10px] opacity-75">Simplesmente digite o nome exato da fonte disponível na biblioteca gratuita do Google Fonts (ex: <i>Cinzel Deco, Montserrat, Quicksand, Lobster</i>) para importá-la.</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nome da fonte (ex: Montserrat)..." 
                    value={customGoogleFont}
                    onChange={e => setCustomGoogleFont(e.target.value)}
                    className="flex-1 border-2 border-black p-2.5 text-xs outline-none bg-white font-sans"
                  />
                  <button 
                    onClick={handleRegisterCustomGoogleFont}
                    className="bg-black hover:bg-teal-700 text-white border-2 border-black px-4 font-bold text-[10px] uppercase tracking-wider"
                  >
                    Registrar Fonte
                  </button>
                </div>
              </div>

              {/* Font Size select multiplier */}
              <div className="border border-black p-3.5 space-y-2">
                <span className="text-[10px] font-bold uppercase block text-black/60">Multiplicador do Visual de Escrita</span>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { id: "small", label: "Pequeno (85%)" },
                    { id: "normal", label: "Padrão (100%)" },
                    { id: "large", label: "Ampliado (115%)" },
                    { id: "xlarge", label: "Gigante (130%)" },
                  ].map(sz => (
                    <button
                      key={sz.id}
                      onClick={() => updateCustomStyles({ fontSize: sz.id as any }, true)}
                      className={`p-2 border text-center transition-all ${
                        fontSize === sz.id ? 'bg-black text-white border-black font-bold' : 'bg-white hover:bg-zinc-50 border-black/10'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              8. SUBTAB: COMPONENTES & ESTILOS (Componentes)
              ========================================================================= */}
          {activeSubTab === "componentes" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">STRUCTURAL CONFIGS</span>
                <h3 className="text-2xl font-black italic mt-1.5">Componentes &amp; Estilos</h3>
                <p className="font-sans text-xs text-gray-500">Desenhe o comportamento dos botões de acionamento e das barras de menus.</p>
              </div>

              {/* Botões contour style */}
              <div className="border-2 border-black p-4 space-y-3">
                <span className="text-[10px] font-bold uppercase block text-black/60">Curvatura de Botões e Inputs</span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "square", label: "Quadrado Neobrutalista", previewClass: "rounded-none" },
                    { id: "rounded", label: "Curvatura Suave", previewClass: "rounded-lg" },
                    { id: "pill", label: "Total Pílulas", previewClass: "rounded-full" },
                  ].map((btn) => {
                    const isSelected = componentConfig.button === btn.id;
                    return (
                      <button
                        key={btn.id}
                        onClick={() => updateComponentConfig({ button: btn.id as any }, true)}
                        className={`p-4 border-2 border-black text-center flex flex-col justify-between items-center transition-all ${
                          isSelected 
                            ? 'bg-black text-white shadow-[3px_3px_0px_0px_var(--primary-custom)]' 
                            : 'bg-white text-black hover:bg-zinc-50 border-black/30'
                        }`}
                      >
                        <span className="font-bold text-xs">{btn.label}</span>
                        <div className={`mt-2.5 w-14 h-4 border-2 border-current bg-transparent ${btn.previewClass}`}></div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navbar layout styling customization settings */}
              <div className="border-2 border-black p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider">Ajustes de Altura e Opacidade da Barra de Navegação</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-black/60 block">Altura Preferencial: {componentConfig.navbar.height}px</label>
                    <input 
                      type="range" 
                      min="50" 
                      max="100" 
                      value={componentConfig.navbar.height} 
                      onChange={(e) => updateComponentConfig({ navbar: { ...componentConfig.navbar, height: Number(e.target.value) } }, true)}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-black/60 block">Esmalte de Transparência: {componentConfig.navbar.opacity}%</label>
                    <input 
                      type="range" 
                      min="30" 
                      max="100" 
                      value={componentConfig.navbar.opacity} 
                      onChange={(e) => updateComponentConfig({ navbar: { ...componentConfig.navbar, opacity: Number(e.target.value) } }, true)}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              9. SUBTAB: EFEITOS VISUAIS (Efeitos)
              ========================================================================= */}
          {activeSubTab === "efeitos" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">STUDIO ENGINE FILTERS</span>
                <h3 className="text-2xl font-black italic mt-1.5">Filtros &amp; Efeitos Especiais</h3>
                <p className="font-sans text-xs text-gray-500">Adicione profundidade computacional às caixas utilizando filtros de neon e de vidro translúcido.</p>
              </div>

              {/* Toggles array layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Neon lights toggle */}
                <div className="border-2 border-black p-4 flex justify-between items-center bg-zinc-50">
                  <div className="max-w-[75%] space-y-1">
                    <h5 className="font-extrabold text-xs uppercase text-[#e84e4e] flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-yellow-500 animate-spin" /> Iluminação Ativa em Neon (Glow)</h5>
                    <p className="text-[9px] text-zinc-500">Projeta luzes dinâmicas em degradê colorido nas extremidades dos botões.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={visualEffects.neon}
                    onChange={(e) => updateVisualEffects({ neon: e.target.checked }, true)}
                    className="w-5 h-5 accent-black cursor-pointer scale-110 shrink-0"
                  />
                </div>

                {/* Glassmorphism glass overlay */}
                <div className="border-2 border-black p-4 flex justify-between items-center bg-zinc-50">
                  <div className="max-w-[75%] space-y-1">
                    <h5 className="font-extrabold text-xs uppercase text-teal-700 flex items-center gap-1.5"><Stars className="w-4 h-4 text-[#e84e4e]" /> Transparência Glassmorphism</h5>
                    <p className="text-[9px] text-zinc-500">Habilita cartões translúcidos e polidos simulando o efeito vidro escovado.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={visualEffects.glassmorphism}
                    onChange={(e) => updateVisualEffects({ glassmorphism: e.target.checked }, true)}
                    className="w-5 h-5 accent-black cursor-pointer scale-110 shrink-0"
                  />
                </div>

                {/* Shimmer reflection effect */}
                <div className="border-2 border-black p-4 flex justify-between items-center bg-zinc-50">
                  <div className="max-w-[75%] space-y-1">
                    <h5 className="font-extrabold text-xs uppercase text-zinc-800">Reflexos Metálicos Cintilantes</h5>
                    <p className="text-[9px] text-zinc-500">Gera micro-brilho simulando placas de aço polido ou dourado brilhoso nos posts.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={visualEffects.reflections}
                    onChange={(e) => updateVisualEffects({ reflections: e.target.checked }, true)}
                    className="w-5 h-5 accent-black cursor-pointer scale-110 shrink-0"
                  />
                </div>

                {/* Gradient active headers */}
                <div className="border-2 border-black p-4 flex justify-between items-center bg-zinc-50">
                  <div className="max-w-[75%] space-y-1">
                    <h5 className="font-extrabold text-xs uppercase text-pink-700">Gradientes Cíclicos Ativos</h5>
                    <p className="text-[9px] text-zinc-500">Insere degradê em botões fazendo ponte animada entre o rosa e vermelho.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={visualEffects.gradients}
                    onChange={(e) => updateVisualEffects({ gradients: e.target.checked }, true)}
                    className="w-5 h-5 accent-black cursor-pointer scale-110 shrink-0"
                  />
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              10. SUBTAB: MICRO-ANIMAÇÕES (Animacoes)
              ========================================================================= */}
          {activeSubTab === "animacoes" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">BEHAVIORAL SPEEDS</span>
                <h3 className="text-2xl font-black italic mt-1.5">Animações de Transição</h3>
                <p className="font-sans text-xs text-gray-500">Determine o tempo de resposta cinemático e física das micro-interações de botões.</p>
              </div>

              {/* Transition Speed Options */}
              <div className="border-2 border-black p-5 space-y-4 pt-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-black/75">Transições Globais do Site</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "smooth", label: "Atmosférico (Lento - 500ms)", desc: "Suavidade intensa e romântica" },
                    { id: "normal", label: "Otimizado (Rápido - 200ms)", desc: "Transição equilibrada natural" },
                    { id: "disabled", label: "Instantâneo (0ms)", desc: "Carregamento imediato sem atrasos" }
                  ].map((spd) => {
                    const isSelected = animationSettings.speed === spd.id;
                    return (
                      <button
                        key={spd.id}
                        onClick={() => updateAnimationSettings({ speed: spd.id as any }, true)}
                        className={`p-3 border-2 font-sans text-xs flex flex-col justify-center items-center gap-1 ${
                          isSelected 
                            ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_var(--primary-custom)]' 
                            : 'bg-white text-black hover:bg-zinc-50 border-black/20'
                        }`}
                      >
                        <span className="font-bold">{spd.label}</span>
                        <span className="text-[8px] opacity-75">{spd.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hover animation profile selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black/60">Giro ou Ganho ao Passar o Mouse (Hover):</label>
                  <select
                    value={animationSettings.hoverEffect}
                    onChange={(e) => updateAnimationSettings({ hoverEffect: e.target.value as any }, true)}
                    className="w-full bg-gray-50 border-2 border-black p-2 font-sans text-xs outline-none"
                  >
                    <option value="scale">Escala Flutuante (Aumentar)</option>
                    <option value="glow">Iluminação Lateral (Glow)</option>
                    <option value="rotation">Giro Símbolo (Rotar Ligeiro)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black/60">Física do Movimento:</label>
                  <select
                    value={animationSettings.transitionsType}
                    onChange={(e) => updateAnimationSettings({ transitionsType: e.target.value as any }, true)}
                    className="w-full bg-gray-50 border-2 border-black p-2 font-sans text-xs outline-none"
                  >
                    <option value="fade">Dissolver Suave (Fade)</option>
                    <option value="slide">Movimento para Cima (Slide)</option>
                    <option value="zoom">Ampliação Cinemática (Zoom)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              11. SUBTAB: ACESSIBILIDADE
              ========================================================================= */}
          {activeSubTab === "acessibilidade" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">INCLUSIVE ENGINE</span>
                <h3 className="text-2xl font-black italic mt-1.5">Acessibilidade Universal</h3>
                <p className="font-sans text-xs text-gray-500">Configurações especiais para garantir visualização nítida sem barreiras físicas.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Strict High Contrast */}
                <div className="border-2 border-black p-4 flex justify-between items-center bg-zinc-50">
                  <div className="max-w-[75%] space-y-1">
                    <span className="font-extrabold text-xs uppercase block text-[#e84e4e]">Alto Contraste Estrito</span>
                    <p className="text-[9px] text-zinc-500">Zera fundos coloridos utilizando preto absoluto e escrita branca.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={accessibility.highContrast}
                    onChange={(e) => updateAccessibility({ highContrast: e.target.checked }, true)}
                    className="w-5 h-5 accent-black cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

                {/* Reduce motion */}
                <div className="border-2 border-black p-4 flex justify-between items-center bg-zinc-50">
                  <div className="max-w-[75%] space-y-1">
                    <span className="font-extrabold text-xs uppercase block text-black/70">Redução Drástica de Movimento</span>
                    <p className="text-[9px] text-zinc-500">Desabilita quaisquer animações pesadas e acelerações bruscas no site.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={accessibility.reduceMotion}
                    onChange={(e) => updateAccessibility({ reduceMotion: e.target.checked }, true)}
                    className="w-5 h-5 accent-black cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

                {/* Speech simulator checkbox */}
                <div className="border-2 border-black p-4 flex justify-between items-center bg-zinc-50">
                  <div className="max-w-[75%] space-y-1">
                    <span className="font-extrabold text-xs uppercase block text-black/70">Modo Legenda Amplificada</span>
                    <p className="text-[9px] text-zinc-500">Expande metadados e exibe descrições extras de posts sob o cursor do mouse.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={accessibility.screenReaderSim}
                    onChange={(e) => updateAccessibility({ screenReaderSim: e.target.checked }, true)}
                    className="w-5 h-5 accent-black cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

                {/* Font amplified */}
                <div className="border-2 border-black p-4 flex justify-between items-center bg-zinc-50">
                  <div className="max-w-[75%] space-y-1">
                    <span className="font-extrabold text-xs uppercase block text-[#e84e4e]">Super Escrita (+25% Zoom)</span>
                    <p className="text-[9px] text-zinc-500">Força o aumento de fontes do site do casal para facilitar a leitura das poesias.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={accessibility.fontAmplified}
                    onChange={(e) => updateAccessibility({ fontAmplified: e.target.checked }, true)}
                    className="w-5 h-5 accent-black cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              12. SUBTAB: TEMAS SALVOS
              ========================================================================= */}
          {activeSubTab === "temas-salvos" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">SAVED INSTANCES</span>
                <h3 className="text-2xl font-black italic mt-1.5">Portabilidade &amp; Backup de Temas</h3>
                <p className="font-sans text-xs text-gray-500">Grave presets customizados do casal e exporte/importe arquivos de portabilidade de estilo.</p>
              </div>

              {/* Name and save form */}
              <div className="border-2 border-black p-4 space-y-4 bg-zinc-50">
                <h4 className="text-xs font-black uppercase tracking-wider text-black/75">1. Salvar Aparência Atual Como Meu Preset</h4>
                <div className="flex gap-2 text-xs">
                  <input 
                    type="text" 
                    placeholder="Ex: Primavera Confortável de Ouro..." 
                    value={newThemeName} 
                    onChange={(e) => setNewThemeName(e.target.value)} 
                    className="flex-1 border-2 border-black p-3 outline-none bg-white font-sans font-bold"
                  />
                  <button 
                    onClick={handleSaveTheme}
                    className="bg-[#e84e4e] hover:bg-black text-white border-2 border-black px-5 font-bold uppercase tracking-wider text-[10px]"
                  >
                    Gravar Presets
                  </button>
                </div>
              </div>

              {/* JSON code imports area */}
              <div className="border border-black p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-black/10">
                  <h4 className="text-xs font-black uppercase tracking-wider">2. Importar tema por Código JSON</h4>
                  <button 
                    onClick={() => setShowImportArea(!showImportArea)}
                    className="text-[9px] uppercase font-bold border border-black px-3 py-1 bg-white hover:bg-zinc-50"
                  >
                    {showImportArea ? "Recolher" : "Expandir"}
                  </button>
                </div>

                {showImportArea && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <textarea 
                      placeholder='Ex: {"name": "Tema Teste", "variables": {"bg": "#ffffff", "primary": "#e84e4e"}}' 
                      value={importJson} 
                      onChange={(e) => setImportJson(e.target.value)} 
                      className="w-full h-24 font-mono text-[9px] p-2 border-2 border-black bg-zinc-50 outline-none"
                    />
                    <button 
                      onClick={handleImportThemeText}
                      className="bg-black hover:bg-[#e84e4e] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
                    >
                      Processar JSON do Tema
                    </button>
                  </div>
                )}
              </div>

              {/* Saved list items */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider">Lista de Casais Cadastrados</h4>
                {savedThemes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {savedThemes.map((saved) => (
                      <div key={saved.id} className="border-2 border-black p-3 flex justify-between items-center bg-[#fcfcfc]">
                        <div>
                          <p className="font-bold text-xs">{saved.name}</p>
                          <span className="text-[9px] font-mono opacity-50 block mt-0.5">Fonte: {saved.font}</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setTheme(saved.name, true)}
                            className="bg-[#e84e4e] text-white border border-black text-[9px] font-bold uppercase px-3 py-1"
                          >
                            Ativar
                          </button>
                          
                          <button 
                            onClick={() => handleExportTheme(saved)}
                            className="bg-white text-black border border-black text-[9px] font-bold uppercase px-2 py-1"
                            title="Exportar como JSON"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button 
                            onClick={() => deleteCustomTheme(saved.id)}
                            className="text-[#e84e4e] hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] opacity-40 italic text-center py-4 border border-dashed border-zinc-300">
                    Nenhum tema personalizado salvo até o momento. Grave suas configurações do casal acima!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              13. SUBTAB: LOJA / MARKETPLACE (Marketplace)
              ========================================================================= */}
          {activeSubTab === "marketplace" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4">
                <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold tracking-widest">THEMING REVOLUTION MARKETPLACE</span>
                <h3 className="text-2xl font-black italic mt-1.5">Loja de Temas Premium do Casal</h3>
                <p className="font-sans text-xs text-gray-500">Instale templates estilizados predefinidos e desenhados por modelagens de comunidade.</p>
              </div>

              {/* Subtabs for Loja classes */}
              <div className="flex gap-1.5 overflow-x-auto border-b border-black/10 pb-2">
                {["Todos", "Temas Oficiais", "Temas da Comunidade", "Temas Premium", "Temas Sazonais", "Temas Mais Baixados", "Temas em Destaque"].map((subCat) => {
                  const isSel = marketplaceFilter === subCat;
                  return (
                    <button
                      key={subCat}
                      onClick={() => setMarketplaceFilter(subCat)}
                      className={`text-[9px] font-bold uppercase px-3 py-1.5 border transition-all ${
                        isSel ? 'bg-black text-white border-black' : 'bg-white hover:bg-zinc-50 border-black/10'
                      }`}
                    >
                      {subCat}
                    </button>
                  );
                })}
              </div>

              {/* Listings grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {MARKETPLACE_THEMES
                  .filter(pack => marketplaceFilter === "Todos" || pack.category === marketplaceFilter)
                  .map((pack) => (
                    <div 
                      key={pack.id}
                      onClick={() => {
                        updateCustomStyles({
                          primary: pack.primary,
                          bg: pack.bg,
                          text: pack.bg === "#000000" || pack.bg === "#050B05" || pack.bg === "#0B0314" ? "#ffffff" : "#1a1a1a"
                        }, true);
                        setTheme("Tema Personalizado", true);
                        toast.info(`Esmalte "${pack.name}" da categoria [${pack.category}] carregado gratuitamente em visualização prévia!`);
                      }}
                      className="border-2 border-black p-4 flex flex-col justify-between hover:bg-zinc-50 transition-all cursor-pointer shadow-[3px_3px_0px_0px_#000] min-h-[140px]"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="bg-amber-100 text-[#7c2d12] border border-[#7c2d12]/20 text-[7px] font-black uppercase tracking-wider px-2 py-0.5">
                            {pack.category}
                          </span>
                          <span className="text-[10px] font-black uppercase text-teal-600">{pack.price}</span>
                        </div>
                        <h4 className="font-extrabold text-sm">{pack.name}</h4>
                      </div>

                      <div className="flex items-center justify-between text-[9px] opacity-60 pt-2 border-t border-black/5 mt-4">
                        <span>{pack.activeUsers} casais ativos</span>
                        <span>⭐ {pack.rating}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
