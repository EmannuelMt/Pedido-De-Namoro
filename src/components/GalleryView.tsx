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
      
      {/* Top Navbar overlapping the 3D gallery somewhat (or just custom floating buttons) */}
      <div className="fixed top-8 left-8 right-8 flex justify-between items-center z-[50] pointer-events-auto">
          {/* Back button */}
          <button 
            onClick={() => onNavigate('home')}
            className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#111] hover:bg-black hover:text-white transition-all shadow-md group border border-black/10"
          >
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-12 right-12 z-[50] pointer-events-auto">
          <button 
            onClick={() => setIsAdding(true)}
            className="w-16 h-16 bg-[#111] hover:bg-[#333] text-[#f7f7f5] hover:scale-105 active:scale-95 rounded-full flex items-center justify-center transition-all shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-white/5 group"
          >
             <Plus size={24} className="group-hover:rotate-90 transition-transform" />
          </button>
      </div>

      <div className="gallery-logo">Nossos<br/>Momentos</div>

      {/* UI Overlay */}
      <div id="ui-layer">
          {displayMoments.map((moment, i) => (
             <div 
               key={moment.id || `moment-${i}`} 
               id={`slide-${i}`}
               className={`slide-content ${activeIndex === i ? 'active' : ''}`}
             >
                <span className="catalogue-number">{(i + 1).toString().padStart(2, '0')} / {moment.category || 'Collection'}</span>
                
                {/* Splitting title in two if there is a space for dramatic effect, or just replacing spaces with breaks */}
                <h1 dangerouslySetInnerHTML={{ __html: (moment.title || '').replace(' ', '<br/>') }} />

                <div className="gallery-description">
                    {moment.caption || 'Sem descrição.'}
                </div>
                <div className="meta-grid">
                    <span className="meta-label">Autor</span> <span className="meta-value">{moment.author || 'Desconhecido'}</span>
                    <span className="meta-label">Ano</span> <span className="meta-value">{new Date(moment.createdAt || Date.now()).getFullYear()}</span>
                    <span className="meta-label">Ação</span> 
                    <span className="meta-value">
                        {onDeleteMoment && (
                            <button 
                              className="text-red-600 hover:text-red-800 flex items-center gap-2 text-sm mt-1"
                              onClick={() => {
                                  if (window.confirm('Tem certeza que deseja apagar essa lembrança?')) {
                                      onDeleteMoment(moment.id);
                                  }
                              }}
                            >
                                <Trash2 size={16} /> Apagar
                            </button>
                        )}
                    </span>
                </div>
             </div>
          ))}
      </div>

      <div className="scroll-hint">Deslize para explorar</div>


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
                    <div className="space-y-2">
                        <label className="text-black/50 font-mono text-[10px] uppercase tracking-widest ml-1">URL da Imagem *</label>
                        <input
                           type="url"
                           value={newMoment.url}
                           onChange={e => setNewMoment({...newMoment, url: e.target.value})}
                           className="w-full bg-white border border-black/10 rounded-xl px-5 py-4 text-black text-sm outline-none focus:border-black/50 transition-colors"
                           placeholder="https://..."
                           required
                        />
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

