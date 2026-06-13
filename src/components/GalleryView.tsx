import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { Plus, X, Camera, ImageIcon, Filter, User as UserIcon, FileText, Type, Trash2, ArrowLeft } from 'lucide-react';
import { audioManager } from '../lib/audioManager';
import './GalleryView.css';

export interface Moment {
  id: string;
  url: string;
  title?: string;
  caption?: string;
  category?: string;
  author?: string;
  authorId?: string;
  createdAt?: any;
}

const DEFAULT_MOMENTS = [
    {
        id: 'def-1',
        url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=80',
        title: 'Ethereal Form',
        caption: 'Captured in the gentle light of early morning, this piece explores the boundaries between reality and abstraction.',
        category: 'Collection',
        author: 'Elena Varas'
    },
    {
        id: 'def-2',
        url: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=800&q=80',
        title: 'Geometric Silence',
        caption: 'A study in precision and balance. By stripping away organic chaos, the artist reveals the quiet mathematical purity that underlies nature.',
        category: 'Collection',
        author: 'Marcus Thorne'
    },
    {
        id: 'def-3',
        url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        title: 'Fading Horizons',
        caption: 'The horizon line serves as a metaphor for the future—always visible yet forever out of reach.',
        category: 'Collection',
        author: 'Isabella Rossi'
    },
    {
        id: 'def-4',
        url: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=800&q=80',
        title: 'The Void',
        caption: 'A minimalist approach challenging the viewer to find meaning in emptiness.',
        category: 'Collection',
        author: 'Unknown'
    }
];

export const GalleryView = ({ 
  moments, 
  user,
  onAddMoment,
  onDeleteMoment,
  onNavigate 
}: { 
  moments: Moment[];
  user: any;
  onAddMoment: (v: any) => void;
  onDeleteMoment: (id: string) => void;
  onNavigate: (v: any) => void;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newMoment, setNewMoment] = useState({
    url: '',
    title: '',
    caption: '',
    category: 'Viagem',
    author: user?.displayName || 'Anônimo'
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({ current: 0, target: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  const formCategories = ['Viagem', 'Aniversário', 'Cotidiano', 'Surpresa', 'Outros'];

  const displayMoments = moments.length > 0 ? moments : DEFAULT_MOMENTS as Moment[];

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    if (!containerRef.current) return;
    
    // Set custom body classes that might be needed temporarily if we wanted it on body, 
    // but the gallery class on the wrapper is safer.

    const CONFIG = {
        slideCount: displayMoments.length,
        spacingX: 45,
        pWidth: 14,
        pHeight: 18,
        camZ: 30,
        wallAngleY: -0.25,
        snapDelay: 300,
        lerpSpeed: 0.05
    };

    const totalGalleryWidth = CONFIG.slideCount * CONFIG.spacingX;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7f5);
    scene.fog = new THREE.Fog(0xf7f7f5, 10, 110); 

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, CONFIG.camZ);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear container before appending to avoid duplicates in React strict mode
    while(containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const galleryGroup = new THREE.Group();
    scene.add(galleryGroup);

    const textureLoader = new THREE.TextureLoader();
    const planeGeo = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);

    const paintingGroups: THREE.Group[] = [];

    // Fallback texture logic in case an image fails to load
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 512;
    fallbackCanvas.height = 512;
    const ctx = fallbackCanvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#999';
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Image Missing', 256, 256);
    }
    const fallbackTexture = new THREE.CanvasTexture(fallbackCanvas);

    for(let i=0; i<CONFIG.slideCount; i++) {
        const group = new THREE.Group();
        group.position.set(i * CONFIG.spacingX, 0, 0);
        
        // Handle texture loading safely
        let texture = fallbackTexture;
        try {
            if (displayMoments[i]?.url) {
                texture = textureLoader.load(displayMoments[i].url, undefined, undefined, () => {
                    // on error keep fallback
                });
            }
        } catch(e) {}

        // Basic settings for texture cover
        texture.center.set(0.5, 0.5);

        const mat = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(planeGeo, mat);
        const edges = new THREE.EdgesGeometry(planeGeo);
        const outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x222222 }));

        const shadowGeo = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.15 });
        const shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.position.set(0.8, -0.8, -0.5); 

        const lineZ = -1;
        const lineLen = CONFIG.spacingX;
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-lineLen/2, 14, lineZ), new THREE.Vector3(lineLen/2, 14, lineZ),
            new THREE.Vector3(-lineLen/2, -14, lineZ), new THREE.Vector3(lineLen/2, -14, lineZ)
        ]);
        const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0xdddddd }));

        group.add(shadow);
        group.add(mesh);
        group.add(outline);
        group.add(lines);
        
        galleryGroup.add(group);
        paintingGroups.push(group);
    }

    galleryGroup.rotation.y = CONFIG.wallAngleY;
    galleryGroup.position.x = 8; 

    let snapTimer: any = null;
    let mouse = { x: 0, y: 0 };
    let frameId: number;

    const snapToNearest = () => {
        let sc = scrollRef.current;
        const index = Math.round(sc.target / CONFIG.spacingX);
        sc.target = index * CONFIG.spacingX;
    };

    const handleWheel = (e: WheelEvent) => {
        scrollRef.current.target += e.deltaY * 0.1;            
        if(snapTimer) clearTimeout(snapTimer);
        snapTimer = setTimeout(snapToNearest, CONFIG.snapDelay);
    };

    let touchStart = 0;
    const handleTouchStart = (e: TouchEvent) => {
        touchStart = e.touches[0].clientX;
        if(snapTimer) clearTimeout(snapTimer);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        const diff = touchStart - e.touches[0].clientX;
        scrollRef.current.target += diff * 0.6;
        touchStart = e.touches[0].clientX;
        if(snapTimer) clearTimeout(snapTimer);
    };

    const handleTouchEnd = () => {
        snapToNearest();
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const updateUIState = (scrollX: number) => {
        if (CONFIG.slideCount === 0) return;
        const rawIndex = Math.round(scrollX / CONFIG.spacingX);            
        const safeIndex = ((rawIndex % CONFIG.slideCount) + CONFIG.slideCount) % CONFIG.slideCount;     
        // React state update might be too frequent if done every frame without care, 
        // but setState batches. Doing it in animation loop can be slightly heavy.
        // We'll use a direct DOM reference update for perf, or a ref.
        setActiveIndex(safeIndex);
    };

    let lastSafeIndex = -1;

    const animate = () => {
        frameId = requestAnimationFrame(animate);
        let sc = scrollRef.current;
        sc.current += (sc.target - sc.current) * CONFIG.lerpSpeed;
        
        const xMove = sc.current * Math.cos(CONFIG.wallAngleY);
        const zMove = sc.current * Math.sin(CONFIG.wallAngleY);
        
        camera.position.x = xMove;
        camera.position.z = CONFIG.camZ - zMove;
        
        paintingGroups.forEach((group, i) => {
            const originalX = i * CONFIG.spacingX;
            const distFromCam = sc.current - originalX;
            const shift = Math.round(distFromCam / totalGalleryWidth) * totalGalleryWidth;
            group.position.x = originalX + shift;
        });
        
        camera.rotation.x = mouse.y * 0.05; 
        camera.rotation.y = -mouse.x * 0.05;
        
        if (CONFIG.slideCount > 0) {
            const rawIndex = Math.round(sc.current / CONFIG.spacingX);            
            const safeIndex = ((rawIndex % CONFIG.slideCount) + CONFIG.slideCount) % CONFIG.slideCount;     
            if (safeIndex !== lastSafeIndex) {
                 lastSafeIndex = safeIndex;
                 setActiveIndex(safeIndex);
            }
        }
        
        renderer.render(scene, camera);
    };

    animate();

    return () => {
        document.body.style.overflow = '';
        cancelAnimationFrame(frameId);
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        
        renderer.dispose();
        // Clear children
        if (containerRef.current) {
            while(containerRef.current.firstChild) {
              containerRef.current.removeChild(containerRef.current.firstChild);
            }
        }
    };
  }, [displayMoments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMoment.url || !newMoment.title) return;
    
    audioManager.playSound('data_sync');
    onAddMoment({
      ...newMoment,
      authorId: user?.uid
    });
    setNewMoment({ url: '', title: '', caption: '', category: 'Viagem', author: user?.displayName || 'Anônimo' });
    setIsAdding(false);
  };

  return (
    <div className="gallery-body">
      
      {/* 3D Canvas */}
      <div id="canvas-container" ref={containerRef}></div>
      
      {/* Cinematic/Camera Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[45] mix-blend-overlay opacity-30">
        <div className="absolute top-0 bottom-0 left-8 border-l border-black/10" />
        <div className="absolute top-0 bottom-0 right-8 border-r border-black/10" />
        <div className="absolute top-8 left-0 right-0 border-t border-black/10" />
        <div className="absolute bottom-8 left-0 right-0 border-b border-black/10" />
        
        {/* Camera corners */}
        <div className="absolute top-12 left-12 w-8 h-8 border-t-2 border-l-2 border-black/80" />
        <div className="absolute top-12 right-12 w-8 h-8 border-t-2 border-r-2 border-black/80" />
        <div className="absolute bottom-12 left-12 w-8 h-8 border-b-2 border-l-2 border-black/80" />
        <div className="absolute bottom-12 right-12 w-8 h-8 border-b-2 border-r-2 border-black/80" />
        
        {/* Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-20">
           <div className="w-12 h-[1px] bg-black absolute" />
           <div className="h-12 w-[1px] bg-black absolute" />
           <div className="w-4 h-4 rounded-full border border-black absolute" />
        </div>
      </div>

      <div className="fixed bottom-10 left-12 z-[50] pointer-events-none font-mono text-[10px] tracking-[0.3em] uppercase text-black/40 rotate-180" style={{ writingMode: 'vertical-rl' }}>
         REC—{new Date().getFullYear()} // MEMORY_BANK
      </div>

      <div className="fixed top-12 right-16 z-[50] pointer-events-none font-mono text-[9px] tracking-widest text-black/50 text-right">
         <div className="flex items-center gap-2 justify-end mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="opacity-70">LIVE</span>
         </div>
         <p className="opacity-50">ARCHIVE.SYS v2.0</p>
         <p className="opacity-50">LAT: {activeIndex.toString().padStart(3, '0')}</p>
      </div>

      {/* Top Navbar overlapping the 3D gallery somewhat (or just custom floating buttons) */}
      <div className="fixed top-12 left-12 z-[50] pointer-events-auto">
          {/* Back button */}
          <button 
            onClick={() => onNavigate('home')}
            className="w-12 h-12 bg-white/60 backdrop-blur-xl rounded-full flex items-center justify-center text-[#111] hover:bg-black hover:text-[#f7f7f5] transition-all duration-300 shadow-xl group border border-black/10 hover:border-transparent"
          >
             <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-12 right-12 z-[50] pointer-events-auto">
          <button 
            onClick={() => setIsAdding(true)}
            className="w-14 h-14 bg-[#111] hover:bg-black text-[#f7f7f5] hover:scale-110 active:scale-95 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-white/10 group overflow-hidden"
          >
             <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 rounded-full" />
             <Plus size={22} className="group-hover:rotate-180 transition-transform duration-700 relative z-10" />
          </button>
      </div>

      <div className="gallery-logo">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          Nossos<br/>
          <span className="italic font-light">Momentos</span>
        </motion.div>
      </div>

      {/* UI Overlay */}
      <div id="ui-layer">
          {displayMoments.map((moment, i) => (
             <div 
               key={moment.id || `moment-${i}`} 
               id={`slide-${i}`}
               className={`slide-content ${activeIndex === i ? 'active' : ''}`}
             >
                <div className="overflow-hidden mb-4">
                   <motion.div 
                     initial={{ x: '-100%' }}
                     whileInView={{ x: '0%' }}
                     transition={{ duration: 0.8, ease: "circOut" }}
                     className="catalogue-number inline-block border-b-2 border-black/80 pb-1"
                   >
                       C—{(i + 1).toString().padStart(2, '0')} // {moment.category || 'Collection'}
                   </motion.div>
                </div>
                
                {/* Splitting title in two if there is a space for dramatic effect, or just replacing spaces with breaks */}
                <h1 dangerouslySetInnerHTML={{ __html: (moment.title || '').replace(' ', '<br/>') }} className="tracking-tight" />

                <div className="gallery-description bg-white/40 backdrop-blur-sm p-5 border-l-2 border-black/20 rounded-r-2xl shadow-sm">
                    {moment.caption || 'Sem descrição.'}
                </div>
                <div className="meta-grid">
                    <span className="meta-label flex items-center gap-2"><UserIcon size={12}/> Autor</span> 
                    <span className="meta-value font-medium">{moment.author || 'Desconhecido'}</span>
                    
                    <span className="meta-label flex items-center gap-2"><Camera size={12}/> Ano</span> 
                    <span className="meta-value font-mono text-sm">{new Date(moment.createdAt || Date.now()).getFullYear()}</span>
                    
                    <span className="meta-label">Ação</span> 
                    <span className="meta-value">
                        {onDeleteMoment && (
                            <button 
                              className="text-red-900/60 hover:text-red-600 flex items-center gap-2 text-xs font-mono uppercase tracking-widest mt-1 group transition-colors"
                              onClick={() => {
                                  if (window.confirm('Tem certeza que deseja apagar essa lembrança?')) {
                                      onDeleteMoment(moment.id);
                                  }
                              }}
                            >
                                <Trash2 size={14} className="group-hover:scale-110 transition-transform" /> 
                                <span className="group-hover:underline decoration-red-300 underline-offset-4">Apagar</span>
                            </button>
                        )}
                    </span>
                </div>
             </div>
          ))}
      </div>

      <div className="scroll-hint group flex flex-col items-center gap-2">
         <span className="group-hover:tracking-[0.5em] transition-all duration-500">Deslize para explorar</span>
         <div className="w-[1px] h-8 bg-gradient-to-b from-black/50 to-transparent" />
      </div>


      {/* Modal Add Moment */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               onClick={() => setIsAdding(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#f7f7f5] rounded-[2rem] p-8 md:p-12 max-w-2xl w-full z-10 shadow-2xl relative border border-black/10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex justify-center items-center text-black/60 transition-colors"
                type="button"
              >
                  <X size={20} />
              </button>

              <h3 className="text-4xl font-serif italic text-black mb-8 tracking-tight">
                Novo Momento
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2 relative">
                        <label className="text-black/50 font-mono text-[10px] uppercase tracking-widest ml-1">Imagem (URL ou Upload) *</label>
                        <div className="flex gap-2">
                           <input
                              type="url"
                              value={newMoment.url.startsWith('data:image') ? '' : newMoment.url}
                              onChange={e => setNewMoment({...newMoment, url: e.target.value})}
                              className="flex-1 bg-white border border-black/10 rounded-xl px-4 py-3 text-black text-sm outline-none focus:border-black/50 transition-colors"
                              placeholder="https://..."
                           />
                           <label className="w-12 flex-shrink-0 bg-black/5 hover:bg-black/10 rounded-xl flex items-center justify-center cursor-pointer transition-colors border border-black/10">
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const img = new Image();
                                      img.onload = () => {
                                        const canvas = document.createElement('canvas');
                                        let width = img.width;
                                        let height = img.height;
                                        const MAX_SIZE = 800; // Resize to max 800px

                                        if (width > height) {
                                          if (width > MAX_SIZE) {
                                            height *= MAX_SIZE / width;
                                            width = MAX_SIZE;
                                          }
                                        } else {
                                          if (height > MAX_SIZE) {
                                            width *= MAX_SIZE / height;
                                            height = MAX_SIZE;
                                          }
                                        }

                                        canvas.width = width;
                                        canvas.height = height;
                                        const ctx = canvas.getContext('2d');
                                        if (ctx) {
                                          ctx.drawImage(img, 0, 0, width, height);
                                          // Compass to JPEG and 0.7 quality to keep size small for Firestore (< 1MB)
                                          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                                          setNewMoment({...newMoment, url: dataUrl});
                                        }
                                      };
                                      img.src = event.target?.result as string;
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <Camera size={18} className="text-black/60" />
                           </label>
                        </div>
                        {newMoment.url.startsWith('data:image') && (
                           <div className="text-[10px] text-emerald-600 font-mono flex items-center mt-1">
                               <input type="checkbox" checked readOnly className="mr-1" /> Imagem carregada
                           </div>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-black/50 font-mono text-[10px] uppercase tracking-widest ml-1">Título *</label>
                        <input
                           type="text"
                           value={newMoment.title}
                           onChange={e => setNewMoment({...newMoment, title: e.target.value})}
                           className="w-full bg-white border border-black/10 rounded-xl px-5 py-4 text-black text-sm font-serif italic outline-none focus:border-black/50 transition-colors"
                           placeholder="Ex: Tarde em Paris..."
                           required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-black/50 font-mono text-[10px] uppercase tracking-widest ml-1">Autor</label>
                        <input
                           type="text"
                           value={newMoment.author}
                           onChange={e => setNewMoment({...newMoment, author: e.target.value})}
                           className="w-full bg-white border border-black/10 rounded-xl px-5 py-4 text-black text-sm outline-none focus:border-black/50 transition-colors"
                           placeholder="Autor..."
                        />
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col justify-between">
                     <div className="space-y-2">
                        <label className="text-black/50 font-mono text-[10px] uppercase tracking-widest ml-1">Categoria</label>
                        <select
                           value={newMoment.category}
                           onChange={e => setNewMoment({...newMoment, category: e.target.value})}
                           className="w-full bg-white border border-black/10 rounded-xl px-5 py-4 text-black text-sm outline-none focus:border-black/50 transition-colors"
                        >
                           {formCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                     </div>

                     <div className="space-y-2 flex-1">
                        <label className="text-black/50 font-mono text-[10px] uppercase tracking-widest ml-1">Descrição</label>
                        <textarea
                           value={newMoment.caption}
                           onChange={e => setNewMoment({...newMoment, caption: e.target.value})}
                           className="w-full bg-white border border-black/10 rounded-xl px-5 py-4 text-black text-sm font-serif italic min-h-[100px] outline-none focus:border-black/50 transition-colors resize-none"
                           placeholder="Sua reflexão..."
                        />
                     </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                       type="submit"
                       className="px-10 py-4 bg-black text-white hover:bg-black/90 rounded-full font-serif italic text-sm transition-all shadow-xl"
                    >
                       Salvar na Galeria
                    </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

