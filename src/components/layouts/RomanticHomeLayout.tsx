import { motion, useScroll, useTransform } from 'motion/react';
import { 
  Heart, 
  Music, 
  ImageIcon, 
  MessageCircle, 
  Gamepad2, 
  ArrowRight, 
  Clock, 
  Star, 
  Sparkles,
  Camera,
  PlayCircle,
  Hash
} from 'lucide-react';
import { TimeTogether } from '../SharedComponents';
import { MagneticButton } from '../UXComponents';
import { useRef } from 'react';

const SectionHeader = ({ title, subtitle, description, icon: Icon }: any) => (
  <div className="mb-16 md:mb-24 flex flex-col md:flex-row gap-8 items-start justify-between">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="max-w-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
          <Icon size={18} />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--text-muted)]">{subtitle}</span>
      </div>
      <h2 className="text-4xl sm:text-5xl md:text-7xl font-editorial italic text-[var(--text)] leading-tight mb-8">
        {title}
      </h2>
      <p className="text-[var(--text-muted)] font-plex text-lg leading-relaxed max-w-xl">
        {description}
      </p>
    </motion.div>
    <div className="w-full md:w-auto flex md:flex-col items-end gap-2 group">
      <div className="h-[1px] w-24 bg-[var(--text)]/10 group-hover:w-32 transition-all transition-all" />
      <span className="font-mono text-[8px] text-[var(--text-muted)] uppercase tracking-[0.4em]">Capítulo do Amor</span>
    </div>
  </div>
);export const RomanticHomeLayout = ({ themeMode, user, setView, GALLERY_DATA, PLAYLIST_DATA, SHARED_GAMES, LETTERS_DATA, ALBUMS_DATA, universeData }: any) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const settings = universeData?.settings;
  const emoData = settings?.emotionalData;
  const partnerName = settings?.partner?.name || "Alma Gêmea";
  const specialDate = settings?.partner?.specialDate || new Date().toISOString();

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full bg-[var(--bg)] overflow-x-hidden">
      {/* 1. SECTION: HERO PORTAL */}
      <section className="relative h-[120vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black to-transparent opacity-60 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary-glow),transparent_80%)]" />
          <div className="absolute inset-0 backdrop-blur-2xl md:backdrop-blur-[140px]" />
          
          {/* Floating Aesthetic Elements */}
          <motion.div 
            animate={{ 
              y: [0, -40, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 border border-[var(--primary)]/10 rounded-full blur-xl hidden sm:block"
          />
          <motion.div 
            animate={{ 
              y: [0, 50, 0],
              x: [0, 30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] border border-[var(--primary)]/5 rounded-full blur-2xl hidden md:block"
          />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            <div className="inline-flex items-center gap-6 px-10 py-4 glass-card rounded-full border border-[var(--text)]/5 shadow-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-[0.8em]">Alma Gêmea Conectada</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            </div>
            
            <h1 className="text-7xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-editorial italic text-[var(--text)] leading-[0.8] tracking-tighter">
              NOSSO <br/>
              <span className="text-[var(--primary)] drop-shadow-[0_0_30px_var(--primary-glow)]">DESTINO.</span>
            </h1>

            <div className="flex flex-col items-center gap-12 pt-12 border-t border-[var(--text)]/5">
              <p className="text-[var(--text-muted)] font-serif italic text-xl sm:text-3xl max-w-3xl leading-relaxed">
                "Onde a nossa história transcende o tempo e se torna <span className="text-[var(--text)] italic">eterna</span>."
              </p>
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-px h-32 bg-gradient-to-b from-[var(--primary)] to-transparent" 
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SECTION: CHRONOS (Staggered Story) */}
      <section className="py-40 px-8 sm:px-16 md:px-32 max-w-[1920px] mx-auto space-y-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <SectionHeader 
              icon={Clock}
              subtitle="O Fluxo do Tempo" 
              title="Sincronia Milimétrica" 
              description="Contamos cada segundo não por obrigação, mas por privilégio. Cada batida do relógio é um sussurro do nosso compromisso."
            />
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="luxury-glass p-12 sm:p-20 rounded-[4rem] text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-transparent opacity-20" />
              <TimeTogether startDate={new Date(specialDate)} />
              <MagneticButton>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('historia')}
                  className="mt-16 px-16 py-7 bg-[var(--text)] text-[var(--bg)] rounded-full font-bold text-[10px] uppercase tracking-[0.5em] hover:bg-[var(--primary)] hover:text-white transition-all shadow-3xl"
                >
                  Folhear Linha do Tempo
                </motion.button>
              </MagneticButton>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 space-y-12">
            <div className="aspect-[3/4] rounded-[5rem] overflow-hidden border border-white/5 relative group bg-[var(--text)]/5 flex items-center justify-center">
               {universeData?.settings?.gallery?.[0] ? (
                 <img src={universeData.settings.gallery[0]} className="w-full h-full object-cover grayscale transition-all duration-[3s] group-hover:grayscale-0 group-hover:scale-110" alt="Momentos" />
               ) : (
                 <ImageIcon className="text-[var(--text)]/20 w-16 h-16" />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent flex flex-col justify-end p-12">
                  <p className="text-[var(--text-muted)] font-mono text-[9px] uppercase tracking-widest mb-2">Registro de Alma</p>
                  <p className="text-[var(--text)] font-serif text-2xl italic leading-tight">"A melhor parte de mim é você."</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: THE GALLLERY (Asymmetric Grid) */}
      <section className="py-40 px-8 sm:px-16 md:px-32 max-w-[1920px] mx-auto space-y-24 relative z-10">
        <SectionHeader 
          icon={Camera}
          subtitle="Acervo Sagrado" 
          title="Nossa Luz em Pixels" 
          description="A cura visual das nossas aventuras. De sorrisos bobos a paisagens que tiraram o fôlego, tudo está guardado aqui."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
           <MemoryCard 
              icon={<ImageIcon />} 
              label="Visual Vault" 
              count={GALLERY_DATA?.length || 0} 
              desc="Galeria Completa"
              onClick={() => setView('galeria')}
              className="md:col-span-2 aspect-[2/1] sm:aspect-[2.5/1]"
              color="primary"
            />
            <motion.div 
              whileHover={{ y: -10 }}
              className="glass-card p-12 flex flex-col justify-center items-center text-center gap-8 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 relative overflow-hidden group shadow-md"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <Camera size={56} className="text-[var(--primary)] drop-shadow-sm mb-2" />
               <div className="relative z-10">
                  <p className="text-white dark:text-[var(--text)] font-editorial italic text-3xl mb-4 leading-none">Capturando o Agora</p>
                  <p className="text-white/60 dark:text-[var(--text-muted)] text-[10px] sm:text-xs font-sans font-medium uppercase tracking-[0.3em]">Cada álbum é um portal para um sentimento.</p>
               </div>
            </motion.div>
        </div>

        {/* Staggered Albums */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 pt-16">
           {ALBUMS_DATA?.slice(0, 3).map((album: any, i: number) => (
             <motion.button
               key={album.id}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
               onClick={() => setView('albuns')}
               className={`glass-card p-12 flex flex-col justify-between aspect-[3/4] text-left group border border-white/10 hover:border-[var(--primary)]/40 transition-all duration-700 shadow-xl hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)] relative overflow-hidden ${i === 1 ? 'lg:-translate-y-24' : ''}`}
             >
               <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 to-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-5 transition-all duration-1000 group-hover:scale-150 rotate-12">
                 <Camera size={120} />
               </div>

               <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/50 group-hover:bg-[var(--primary)]/10 group-hover:border-[var(--primary)]/30 group-hover:text-[var(--primary)] transition-all duration-700 transform group-hover:rotate-[15deg] shadow-sm relative z-10">
                 <Sparkles size={28} />
               </div>
               <div className="relative z-10 w-full">
                 <span className="text-[10px] font-sans font-semibold text-[var(--primary)] uppercase tracking-[0.5em] mb-6 block leading-none opacity-80">Capítulo {(i+1).toString().padStart(2, '0')}</span>
                 <h4 className="text-4xl text-white font-editorial italic leading-tight mb-6 group-hover:text-glow-premium transition-all duration-700 relative drop-shadow-md">
                    {album.title}
                 </h4>
                 <div className="h-[2px] w-12 group-hover:w-full bg-gradient-to-r from-[var(--primary)] to-transparent transition-all duration-1000 mb-8 opacity-50 group-hover:opacity-100" />
                 <p className="text-white/50 text-[10px] sm:text-xs font-sans font-medium tracking-[0.3em] uppercase">{album.photos?.length || 0} Fragmentos</p>
               </div>
             </motion.button>
           ))}
        </div>
      </section>

      {/* 4. SECTION: THE VIBE (Music & Games) */}
      <section className="py-40 bg-[var(--bg-alt)] shadow-[0_-20px_100px_rgba(0,0,0,0.1)] rounded-[5rem] sm:rounded-[10rem] mx-4 sm:mx-8 -mb-32 relative z-20">
         <div className="px-8 sm:px-16 md:px-32 max-w-[1920px] mx-auto py-32 lg:py-40 space-y-32">
            <div className="flex flex-col lg:flex-row gap-24 items-center">
               <div className="lg:w-1/2 space-y-12">
                  <div className="flex items-center gap-6">
                     <PlayCircle size={48} className="text-[var(--text)] drop-shadow-md" />
                     <h2 className="text-6xl sm:text-8xl lg:text-9xl font-editorial italic text-[var(--text)] tracking-tight leading-[0.9] drop-shadow-xl">Sinfonia <br/>Privada.</h2>
                  </div>
                  <p className="text-[var(--text-muted)] font-sans font-light text-xl sm:text-3xl leading-relaxed max-w-2xl drop-shadow-sm">
                    Porque certas músicas só fazem sentido quando ouvidas com você. Nossa playlist é o diário sonoro da nossa cumplicidade.
                  </p>
                  <button 
                    onClick={() => setView('playlist')}
                    className="group flex items-center gap-8 text-[var(--text)] pt-8"
                  >
                     <div className="w-20 h-20 bg-gradient-to-br from-[var(--text)] to-[var(--text-muted)] rounded-full flex items-center justify-center text-[var(--bg)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(var(--text),0.3)] transition-all duration-500 shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Music className="relative z-10" />
                     </div>
                     <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.4em] drop-shadow-sm">Explorar Frequência</span>
                  </button>
               </div>

               <div className="lg:w-1/2 w-full grid grid-cols-2 gap-8 lg:gap-12">
                  <div className="aspect-[4/5] bg-[var(--text)]/10 rounded-[3rem] sm:rounded-[4rem] overflow-hidden group shadow-2xl relative flex items-center justify-center">
                     <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/50 via-transparent to-transparent z-10 opacity-60" />
                     {universeData?.settings?.gallery?.[0] ? (
                       <img src={universeData.settings.gallery[0]} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" alt="Music Vibe" />
                     ) : (
                       <Music className="text-[var(--text)]/20 w-12 h-12 relative z-10" />
                     )}
                  </div>
                  <div className="aspect-[4/5] bg-[var(--text)] rounded-[3rem] sm:rounded-[4rem] p-10 md:p-14 flex flex-col justify-between group overflow-hidden relative shadow-2xl mt-12 sm:mt-20">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-1000 rotate-12">
                        <Music size={180} className="text-[var(--bg)]" />
                     </div>
                     <span className="text-[var(--bg)]/50 font-sans font-semibold text-[10px] sm:text-xs uppercase tracking-[0.3em] relative z-10">Playlist Status</span>
                     <div className="space-y-4 relative z-10">
                       <p className="text-[var(--bg)] font-editorial italic text-4xl sm:text-5xl leading-tight">Mais de {PLAYLIST_DATA?.length || 0} canções sintonizadas.</p>
                       <div className="w-12 h-[2px] bg-[var(--bg)]/20" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. SECTION: BENTO GRID (Deep Connection) */}
      <section className="py-40 px-8 sm:px-16 md:px-32 max-w-[1920px] mx-auto">
        <SectionHeader 
          icon={Sparkles}
          subtitle="Anatomia do Amor" 
          title="Nossa DNA Espelhado" 
          description="Os pequenos detalhes que compõem a nossa grande história. Uma análise poética do que nos torna únicos."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-8 h-auto md:h-[800px] xl:h-[900px] pt-12">
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="md:col-span-2 md:row-span-2 glass-card rounded-[4rem] xl:rounded-[5rem] p-12 xl:p-16 border border-white/5 flex flex-col justify-between relative overflow-hidden group shadow-2xl hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.15)] transition-all duration-700 bg-black/40 backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 flex items-center justify-center text-[var(--primary)] mb-10 group-hover:bg-[var(--primary)]/20 transition-colors duration-700 shadow-sm">
                <Heart size={36} className="drop-shadow-md" />
              </div>
              <h3 className="text-6xl md:text-8xl font-editorial italic text-white leading-[0.9] mb-8 drop-shadow-xl group-hover:text-glow-premium transition-all duration-700">Compatibilidade <br/><span className="text-[var(--primary)]">Cósmica.</span></h3>
              <p className="text-white/60 text-2xl font-sans font-light leading-relaxed max-w-md drop-shadow-sm">99.9% de precisão emocional em todos os testes de campo realizados até hoje.</p>
            </div>
            
            <div className="relative z-10 flex items-end justify-between mt-12 w-full">
              <div className="space-y-4">
                <p className="text-white/30 font-sans font-medium text-[10px] md:text-xs uppercase tracking-[0.4em]">Frequência Ativa</p>
                <p className="text-white font-sans font-light text-3xl">432Hz</p>
              </div>
              <ArrowRight className="text-white/20 group-hover:text-white transition-all duration-500 transform group-hover:translate-x-6" size={48} />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="md:col-span-2 md:row-span-1 glass-card rounded-[4rem] p-12 lg:p-14 border border-white/5 flex flex-col sm:flex-row items-center sm:gap-12 relative overflow-hidden group shadow-xl bg-black/20"
          >
            <div className="shrink-0 w-32 h-32 lg:w-48 lg:h-48 rounded-full border-4 border-white/10 overflow-hidden mb-8 sm:mb-0 group-hover:border-[var(--primary)]/40 transition-colors duration-700 shadow-2xl relative z-10 flex items-center justify-center bg-black/40">
               {universeData?.settings?.gallery?.[0] ? (
                 <img src={universeData.settings.gallery[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] scale-110 group-hover:scale-100" />
               ) : (
                 <ImageIcon className="text-white/20 w-12 h-12" />
               )}
            </div>
            <div className="relative z-10 text-center sm:text-left">
              <span className="text-[var(--primary)] font-sans font-semibold text-[10px] uppercase tracking-[0.5em] mb-4 block drop-shadow-md">Legado</span>
              <h4 className="text-4xl lg:text-5xl font-editorial italic text-white mb-4 leading-tight drop-shadow-md">Memórias Atípicas.</h4>
              <p className="text-white/50 font-sans font-light text-xl">Momentos que só nós entendemos.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="md:col-span-1 md:row-span-1 glass-card rounded-[4rem] p-10 lg:p-12 border border-white/5 flex flex-col justify-center items-center text-center gap-6 group shadow-lg bg-black/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <Star size={40} className="text-yellow-500/50 group-hover:text-yellow-400 group-hover:scale-125 transition-all duration-700 relative z-10 drop-shadow-md" />
            <div className="relative z-10">
              <p className="text-white font-editorial italic text-5xl mb-2 drop-shadow-md">∞</p>
              <p className="text-white/40 font-sans font-medium text-[9px] uppercase tracking-widest leading-relaxed max-w-[100px] mx-auto">Risadas Compartilhadas</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="md:col-span-1 md:row-span-1 glass-card border border-white/5 bg-gradient-to-br from-white/5 to-transparent rounded-[4rem] p-10 lg:p-12 flex flex-col justify-center items-center text-center gap-6 group shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <Clock size={40} className="text-blue-500/50 group-hover:text-blue-400 group-hover:rotate-45 transition-all duration-700 relative z-10 drop-shadow-md" />
            <div className="relative z-10">
              <p className="text-white font-editorial italic text-4xl mb-2 tracking-wide drop-shadow-md">ETRNL</p>
              <p className="text-white/40 font-sans font-medium text-[9px] uppercase tracking-widest leading-relaxed max-w-[100px] mx-auto">Time Spans</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. SECTION: PLAYGROUND (Games) */}
      <section className="pt-64 pb-40 px-8 sm:px-16 md:px-32 max-w-[1920px] mx-auto relative z-10">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-center">
            <div className="order-2 lg:order-1 relative">
               <div className="absolute inset-0 bg-[var(--primary)]/5 blur-3xl rounded-full scale-75 -z-10" />
               <MemoryCard 
                icon={<Gamepad2 />} 
                label="Universo Lúdico" 
                count={SHARED_GAMES?.length || 0} 
                desc="Nossos Jogos"
                onClick={() => setView('jogos')}
                className="aspect-square sm:aspect-video lg:aspect-[4/3] rounded-[4rem] sm:rounded-[5rem] shadow-2xl glass-card border-white/10"
                color="primary"
              />
            </div>
            <div className="space-y-12 order-1 lg:order-2">
               <SectionHeader 
                icon={Star}
                subtitle="Divertimento" 
                title="Arena de Conexão" 
                description="Onde o tempo é suspenso por risadas e desafios compartilhados. Porque amor também é saber perder (e ganhar) juntos."
              />
              <div className="flex flex-wrap gap-12 lg:gap-16 pt-8">
                 <div className="space-y-4">
                    <p className="text-white font-editorial italic text-6xl drop-shadow-md">99.9%</p>
                    <p className="text-white/30 font-sans font-medium text-[10px] uppercase tracking-[0.3em] leading-none">Status de Sincronia</p>
                 </div>
                 <div className="space-y-4">
                    <p className="text-white font-editorial italic text-6xl drop-shadow-md">∞ </p>
                    <p className="text-white/30 font-sans font-medium text-[10px] uppercase tracking-[0.3em] leading-none">Diversão Restante</p>
                 </div>
              </div>
            </div>
         </div>
      </section>

      {/* FINAL CALL TO ACTION (Refined) */}
      <section className="py-80 px-8 text-center relative overflow-hidden z-10">
        <div className="absolute inset-x-0 bottom-0 top-[30%] bg-[radial-gradient(circle_at_50%_100%,var(--primary-glow),transparent_60%)] opacity-30 -z-10" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 space-y-20 max-w-7xl mx-auto"
        >
          <div className="flex flex-col items-center justify-center gap-10">
             <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <Heart size={48} className="text-[var(--primary)] animate-[pulse_3s_ease-in-out_infinite] drop-shadow-[0_0_15px_var(--primary)] relative z-10" />
             </div>
             <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent opacity-50" />
          </div>
          
          <h2 className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[14rem] font-editorial italic text-[var(--text)] flex flex-col leading-[0.8] tracking-tighter drop-shadow-2xl">
            <span>Para sempre,</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--text)] via-[var(--text)] to-[var(--primary)]/70 pb-4">o nosso infinito.</span>
          </h2>

          <div className="pt-24 flex justify-center">
            <button 
              onClick={() => setView('pedido')}
              className="px-24 py-8 sm:py-10 bg-[var(--text)] text-[var(--bg)] rounded-full font-sans font-bold text-[10px] sm:text-xs uppercase tracking-[0.6em] sm:tracking-[0.8em] hover:bg-gradient-to-r hover:from-[var(--primary)] hover:to-[var(--primary)]/80 hover:text-white transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_40px_80px_rgba(var(--primary-rgb),0.3)] active:scale-95 group relative overflow-hidden flex items-center justify-center min-w-[300px]"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="relative z-10 flex items-center">Surpresa <ArrowRight className="inline-block ml-6 group-hover:translate-x-4 transition-transform duration-500" size={16} /></span>
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

const MemoryCard = ({ icon, label, count, desc, onClick, className = "", color = "primary" }: any) => {
  return (
    <motion.button
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`luxury-card p-12 text-left group relative overflow-hidden flex flex-col justify-between ${className}`}
    >
      <div className={`w-16 h-16 bg-[var(--text)]/5 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 transform group-hover:rotate-12 group-hover:bg-[var(--primary)] text-[var(--primary)] group-hover:text-white`}>
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="h-[1px] w-8 bg-[var(--text)]/10 group-hover:w-12 transition-all" />
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-[0.4em]">{label}</span>
        </div>
        <h4 className="text-3xl font-serif text-[var(--text)] italic leading-none mb-3">{desc}</h4>
        <div className="flex items-center justify-between">
          <p className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-widest">{count} Registros</p>
          <ArrowRight size={18} className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
        </div>
      </div>
    </motion.button>
  );
};


