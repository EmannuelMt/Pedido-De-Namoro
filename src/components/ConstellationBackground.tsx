import React, { useMemo, useRef, useState, useEffect } from 'react';
import { animate, motion, useMotionValue, useSpring, useTransform, MotionValue, useAnimationFrame } from 'motion/react';
// @ts-ignore
import ConstellationWorker from '../workers/constellationWorker?worker';

const useAudioVolumeMotion = () => {
  const volume = useMotionValue(0);
  
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let analyzer: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;
    let frame: number;

    const initAudio = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioContextClass();
        analyzer = audioCtx.createAnalyser();
        analyzer.fftSize = 256;
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyzer);
          dataArray = new Uint8Array(analyzer.frequencyBinCount);
          
          const updateVolume = () => {
            if (analyzer && dataArray) {
              analyzer.getByteFrequencyData(dataArray);
              const sum = dataArray.reduce((a, b: number) => a + b, 0);
              const avg = sum / dataArray.length;
              volume.set(avg / 255); // value between 0.0 and 1.0
            }
            frame = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (err) {
        console.warn('Microphone access denied or audio disabled', err);
      }
    };

    document.addEventListener('click', initAudio, { once: true });
    return () => {
      document.removeEventListener('click', initAudio);
      if (frame) cancelAnimationFrame(frame);
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close();
      }
    };
  }, [volume]);

  return volume;
};

interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  type?: 'star' | 'planet';
  hue?: number;
  twinkleDuration?: number;
}

interface Connection {
  id: string;
  source: Star;
  target: Star;
}

interface Explosion {
  id: string;
  x: number;
  y: number;
}

interface ConstellationBackgroundProps {
  densityMultiplier?: number;
  connectionBrightness?: number;
  enableRotation?: boolean;
}

const StarNode = ({ star, mouseX, mouseY, explosions, audioVolume }: { star: Star, mouseX: MotionValue<number>, mouseY: MotionValue<number>, explosions: Explosion[], audioVolume: MotionValue<number> }) => {
  const dx = useTransform(mouseX, x => x === -1000 ? 10000 : x - star.x);
  const dy = useTransform(mouseY, y => y === -1000 ? 10000 : y - star.y);
  const distance = useTransform([dx, dy], ([x, y]: any) => Math.sqrt(x*x + y*y));
  
  const audioScaleMultiplier = useTransform(audioVolume, [0, 1], [1, 1.8]);
  const audioOpacityMultiplier = useTransform(audioVolume, [0, 1], [1, 1.5]);

  const scaleBase = useTransform(distance, [0, 150], [2.5, 1]);
  const scale = useTransform([scaleBase, audioScaleMultiplier], ([sb, am]: any) => sb * am);
  
  const opacityBase = useTransform(distance, [0, 150], [1, 0.4]);
  const opacity = useTransform([opacityBase, audioOpacityMultiplier], ([ob, am]: any) => Math.min(1, ob * am));
  
  const auraScaleBase = useTransform(distance, [0, 150], [4, 1]);
  const auraScale = useTransform([auraScaleBase, audioScaleMultiplier], ([ab, am]: any) => ab * am);
  
  const auraOpacityBase = useTransform(distance, [0, 100], [0.3, 0]);
  const auraOpacity = useTransform([auraOpacityBase, audioOpacityMultiplier], ([ob, am]: any) => Math.min(1, ob * am));

  // Shockwave state
  const shockwaveX = useSpring(0, { damping: 10, stiffness: 150 });
  const shockwaveY = useSpring(0, { damping: 10, stiffness: 150 });

  useEffect(() => {
    if (explosions.length > 0) {
      const exp = explosions[explosions.length - 1];
      const exDx = star.x - exp.x;
      const exDy = star.y - exp.y;
      const dist = Math.sqrt(exDx*exDx + exDy*exDy);
      if (dist > 0 && dist < 300) {
         // Push away
         const force = (300 - dist) / 300;
         shockwaveX.set((exDx / dist) * force * 40);
         shockwaveY.set((exDy / dist) * force * 40);
         
         // Return to original
         setTimeout(() => {
           shockwaveX.set(0);
           shockwaveY.set(0);
         }, 100);
      }
    }
  }, [explosions, star.x, star.y, shockwaveX, shockwaveY]);

  const parallaxX = useTransform(mouseX, x => x === -1000 ? 0 : (x - star.x) * -0.05);
  const parallaxY = useTransform(mouseY, y => y === -1000 ? 0 : (y - star.y) * -0.05);

  const xTransformCombo = useTransform([shockwaveX, parallaxX], ([sx, px]: any) => sx + (star.type === 'planet' ? px : 0));
  const yTransformCombo = useTransform([shockwaveY, parallaxY], ([sy, py]: any) => sy + (star.type === 'planet' ? py : 0));

  if (star.type === 'planet') {
    const orbitRadius = star.size * 5;
    
    const orbitRotation = useMotionValue(0);
    useAnimationFrame((t) => {
       const speed = 15 + (star.x % 20);
       const angle = (t / (speed * 1000)) * 360; 
       orbitRotation.set(angle);
    });

    return (
      <motion.g className="cursor-pointer" style={{ x: xTransformCombo, y: yTransformCombo, willChange: 'transform' }}>
        {/* Gravitational orbital trail & distinct rings */}
        <motion.circle 
          cx={star.x} cy={star.y} r={orbitRadius} fill="none" stroke={`hsl(${star.hue}, 80%, 70%)`} 
          strokeOpacity={0.15} strokeWidth={0.8} strokeDasharray="3 6" 
        />
        <motion.circle 
          cx={star.x} cy={star.y} r={orbitRadius + 6} fill="none" stroke={`hsl(${star.hue}, 50%, 60%)`} 
          strokeOpacity={0.25} strokeWidth={1.5} strokeDasharray="8 12" 
          animate={{ rotate: 360, originX: `${star.x}px`, originY: `${star.y}px` }} 
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          style={{ willChange: 'transform' }}
        />
        <motion.circle 
          cx={star.x} cy={star.y} r={orbitRadius + 15} fill="none" stroke={`hsl(${star.hue}, 40%, 40%)`} 
          strokeOpacity={0.1} strokeWidth={0.5} strokeDasharray="2 4" 
          animate={{ rotate: -360, originX: `${star.x}px`, originY: `${star.y}px` }} 
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          style={{ willChange: 'transform' }}
        />
        <motion.g style={{ originX: `${star.x}px`, originY: `${star.y}px`, rotate: orbitRotation, willChange: 'transform' }}>
          <motion.g style={{ x: orbitRadius, y: 0 }}>
             <motion.circle 
               cx={star.x} cy={star.y} r={star.size * 3} 
               fill={`hsl(${star.hue}, 80%, 70%)`}
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2 + (star.id.length % 2), repeat: Infinity, ease: "easeInOut" }}
               style={{ filter: 'blur(4px)', willChange: 'transform, opacity' }}
             />
             <motion.circle 
               cx={star.x} cy={star.y} r={star.size * 1.5} 
               fill={`url(#planet-${star.id})`}
               style={{ scale, opacity: 0.9, willChange: 'transform, opacity' }}
             />
             {/* Moons orbiting the planet */}
             <motion.g animate={{ rotate: -720 }} style={{ originX: `${star.x}px`, originY: `${star.y}px` }} transition={{ duration: 8, ease: "linear", repeat: Infinity }}>
               <circle cx={star.x + star.size * 2.5} cy={star.y} r={star.size * 0.3} fill="#FFFFFF" opacity={0.8} />
             </motion.g>
          </motion.g>
        </motion.g>
      </motion.g>
    );
  }

  return (
    <motion.g className="cursor-pointer" style={{ x: xTransformCombo, y: yTransformCombo, willChange: 'transform' }}>
      <motion.circle 
        cx={star.x} 
        cy={star.y} 
        r={star.size * 2.5} 
        fill="#FBCFE8"
        style={{ scale: auraScale, opacity: auraOpacity, willChange: 'transform, opacity' }}
      />
      <motion.g style={{ scale, opacity, willChange: 'transform, opacity' }}>
        <motion.circle 
          cx={star.x} 
          cy={star.y} 
          r={star.size} 
          fill="#FFFFFF"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: star.twinkleDuration || 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>
    </motion.g>
  );
};

const OffscreenConnections = ({ stars, connections, mouseX, mouseY, brightness, diag }: { stars: Star[], connections: Connection[], mouseX: MotionValue<number>, mouseY: MotionValue<number>, brightness: number, diag: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!canvasRef.current || typeof OffscreenCanvas === 'undefined') return;
    
    if (!workerRef.current) {
      workerRef.current = new ConstellationWorker();
      const canvas = canvasRef.current;
      if ('transferControlToOffscreen' in canvas) {
        const offscreen = canvas.transferControlToOffscreen();
        workerRef.current.postMessage({
          type: 'init',
          canvas: offscreen,
          stars,
          connections,
          brightness
        }, [offscreen]);
      }
    }
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    workerRef.current?.postMessage({
      type: 'resize',
      width: diag,
      height: diag
    });
  }, [diag]);

  useEffect(() => {
    workerRef.current?.postMessage({
      type: 'updateData',
      stars,
      connections,
      brightness
    });
  }, [stars, connections, brightness]);

  useAnimationFrame(() => {
    workerRef.current?.postMessage({
      type: 'updateMouse',
      mouseX: mouseX.get(),
      mouseY: mouseY.get()
    });
  });

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

const Supernova = ({ explosion, key }: { explosion: Explosion, key?: string | number }) => {
  const particles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    angle: (i / 24) * Math.PI * 2,
    distance: 40 + Math.random() * 80,
    size: Math.random() * 2 + 1,
    color: ['#FFFFFF', '#FBCFE8', '#F48FB1', '#CE93D8'][Math.floor(Math.random() * 4)]
  }));

  return (
    <g>
      <motion.circle
        cx={explosion.x}
        cy={explosion.y}
        r={2}
        fill="#FFFFFF"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transformOrigin: `${explosion.x}px ${explosion.y}px`, willChange: 'transform, opacity' }}
      />
      {particles.map(p => (
        <motion.circle
          key={p.id}
          cx={explosion.x}
          cy={explosion.y}
          r={p.size}
          fill={p.color}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ 
            opacity: 0, 
            x: Math.cos(p.angle) * p.distance, 
            y: Math.sin(p.angle) * p.distance,
            scale: 0
          }}
          transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
          style={{ willChange: 'transform, opacity' }}
        />
      ))}
    </g>
  );
};

const ClusterLabel = ({ cluster, mouseX, mouseY, key }: { cluster: any, mouseX: MotionValue<number>, mouseY: MotionValue<number>, key?: string | number }) => {
  const dx = useTransform(mouseX, x => x === -1000 ? 10000 : x - cluster.cx);
  const dy = useTransform(mouseY, y => y === -1000 ? 10000 : y - cluster.cy);
  const distance = useTransform([dx, dy], ([x, y]: any) => Math.sqrt(x*x + y*y));
  
  const opacity = useTransform(distance, [0, 150, 250], [0.9, 0.9, 0]);
  const scale = useTransform(distance, [0, 150, 250], [1.1, 1, 0.8]);

  const parallaxX = useTransform(mouseX, x => x === -1000 ? 0 : (x - cluster.cx) * -0.03);
  const parallaxY = useTransform(mouseY, y => y === -1000 ? 0 : (y - cluster.cy) * -0.03);

  return (
    <motion.text
      x={cluster.cx}
      y={cluster.cy - 30}
      fill="#FFFFFF"
      fontSize="12"
      fontWeight="600"
      textAnchor="middle"
      style={{ opacity, scale, x: parallaxX, y: parallaxY, textShadow: "0px 0px 12px rgba(255,255,255,1)" }}
      className="pointer-events-none uppercase tracking-[0.3em]"
    >
      {cluster.name}
    </motion.text>
  );
};

const TrailLine = ({ star, cxLocal, cyLocal, enableRotation }: { star: Star, cxLocal: number, cyLocal: number, enableRotation: boolean }) => {
  if (!enableRotation) return null;
  const dx = star.x - cxLocal;
  const MathCy = star.y - cyLocal;
  const r = Math.sqrt(dx*dx + MathCy*MathCy);
  if (r < 10) return null; 
  
  const tailLen = r * 0.12; 
  const tx = star.x + tailLen * (MathCy / r);
  const ty = star.y - tailLen * (dx / r);

  return (
    <line 
       x1={star.x} y1={star.y}
       x2={tx} y2={ty}
       stroke="#FBCFE8"
       strokeOpacity={0.2}
       strokeWidth={star.size * 0.6}
       strokeLinecap="round"
    />
  );
}

const RealisticNebula = () => {
  const dustParticles = useMemo(() => {
    return Array.from({ length: 400 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none mix-blend-screen opacity-80">
      <div className="absolute inset-0 opacity-40">
        {dustParticles.map(p => (
          <div 
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity
            }}
          />
        ))}
      </div>
      <motion.div 
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-purple-900/40 blur-[120px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 45, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform, opacity' }}
      />
      <motion.div 
        className="absolute bottom-[-30%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-indigo-900/50 blur-[150px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4], rotate: [0, -30, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform, opacity' }}
      />
      <motion.div 
        className="absolute top-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-900/30 blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform, opacity' }}
      />
      <motion.div 
        className="absolute top-[40%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-900/40 blur-[140px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform, opacity' }}
      />
    </div>
  );
};


const DynamicNebulaCanvas = ({ mouseX, mouseY, dimensions }: { mouseX: MotionValue<number>, mouseY: MotionValue<number>, dimensions: { width: number, height: number } }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    const mx = mouseX.get();
    const my = mouseY.get();

    if (mx === -1000) return;

    const rGrd = ctx.createRadialGradient(mx, my, 0, mx, my, Math.max(dimensions.width, dimensions.height) * 0.5);
    rGrd.addColorStop(0, 'rgba(138, 43, 226, 0.4)');
    rGrd.addColorStop(0.3, 'rgba(75, 0, 130, 0.15)');
    rGrd.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = rGrd;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    const rGrd2 = ctx.createRadialGradient(mx - 200, my + 150, 0, mx - 200, my + 150, 400);
    rGrd2.addColorStop(0, 'rgba(0, 150, 255, 0.15)');
    rGrd2.addColorStop(0.6, 'rgba(0, 80, 180, 0.05)');
    rGrd2.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = rGrd2;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
  });

  return (
    <canvas 
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70 blur-[40px] z-0"
    />
  );
};

const RadialFocus = ({ rawMouseX, rawMouseY }: { rawMouseX: MotionValue<number>, rawMouseY: MotionValue<number> }) => {
  const maskImage = useTransform([rawMouseX, rawMouseY], ([x, y]: any) => {
    if (x === -1000) return `radial-gradient(circle at 50% 50%, transparent 100%, black 100%)`; 
    return `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,0) 150px, rgba(0,0,0,1) 400px)`;
  });
  
  return (
    <motion.div 
      className="absolute inset-0 z-10 pointer-events-none backdrop-blur-md"
      style={{ maskImage, WebkitMaskImage: maskImage }}
    />
  );
};

export const ConstellationBackground = ({ densityMultiplier = 1, connectionBrightness = 1, enableRotation = true }: ConstellationBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioVolume = useAudioVolumeMotion();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [supernovaCount, setSupernovaCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const dragX = useMotionValue(0);

  useEffect(() => {
    setPulse(true);
    const timeout = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(timeout);
  }, [densityMultiplier, connectionBrightness]);

  const diag = useMemo(() => Math.ceil(Math.sqrt(dimensions.width**2 + dimensions.height**2) || 0), [dimensions]);

  const rawMouseX = useMotionValue(-1000);
  const rawMouseY = useMotionValue(-1000);
  const rotationVal = useMotionValue(0);

  useEffect(() => {
    let frame: number;
    let baseRotation = 0;
    
    const loop = () => {
      if (enableRotation) {
        // Drag inertia offset
        const dragOffset = dragX.get() * 0.1;
        baseRotation += (0.05 + dragOffset * 0.02);
        rotationVal.set(baseRotation);
        dragX.set(dragX.get() * 0.95); // Damping drag inertia
      }
      frame = requestAnimationFrame(loop);
    };
    
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [enableRotation, dragX, rotationVal]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
        const diagValue = Math.ceil(Math.sqrt(clientWidth**2 + clientHeight**2));
        
        const baseDensity = 12000;
        const targetNumStars = Math.floor((diagValue * diagValue) / (baseDensity / densityMultiplier));
        
        setStars(prevStars => {
          if (prevStars.length === 0 || Math.abs(prevStars.length - targetNumStars) > 20) {
              return Array.from({ length: Math.min(300, targetNumStars) }).map((_, i) => {
                const isPlanet = Math.random() > 0.95;
                return {
                  id: `star-${i}-${Date.now()}`,
                  x: Math.random() * diagValue,
                  y: Math.random() * diagValue,
                  size: isPlanet ? Math.random() * 8 + 6 : Math.random() * 2 + 0.5,
                  type: isPlanet ? 'planet' : 'star',
                  hue: isPlanet ? Math.floor(Math.random() * 360) : undefined
                };
              });
          }
          return prevStars;
        });
      }
    };
    updateDimensions();
    
    const timeoutId = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [densityMultiplier]);

  const { connections, clusters } = useMemo(() => {
    const generatedConnections: Connection[] = [];
    const maxConnectionDist = 200;
    const adj = new Map<string, Star[]>();

    for (let i = 0; i < stars.length; i++) {
      if (stars[i].type === 'planet') continue;
      for (let j = i + 1; j < stars.length; j++) {
        if (stars[j].type === 'planet') continue;
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < maxConnectionDist) {
          generatedConnections.push({
            id: `${stars[i].id}-${stars[j].id}`,
            source: stars[i],
            target: stars[j]
          });
          if (!adj.has(stars[i].id)) adj.set(stars[i].id, []);
          if (!adj.has(stars[j].id)) adj.set(stars[j].id, []);
          adj.get(stars[i].id)!.push(stars[j]);
          adj.get(stars[j].id)!.push(stars[i]);
        }
      }
    }

    const clustersOutput = [];
    const clusterLabelsArray = ["Lumina", "Aether", "Celestia", "Orion's Belt", "Nebula Core", "Nova Cluster", "Void Edge", "Astrum", "Zenith", "Pleiades", "Cassiopeia", "Lyra", "Cygnus", "Vela", "Sirius Cluster"];
    const visited = new Set<string>();
    let labelIdx = 0;

    for (const star of stars) {
      if (visited.has(star.id) || !adj.has(star.id)) continue;
      
      const comp: Star[] = [];
      const q = [star];
      visited.add(star.id);

      while (q.length > 0) {
        const curr = q.shift()!;
        comp.push(curr);
        for (const nb of adj.get(curr.id) || []) {
          if (!visited.has(nb.id)) {
            visited.add(nb.id);
            q.push(nb);
          }
        }
      }

      if (comp.length >= 4) {
        const sumX = comp.reduce((acc, s) => acc + s.x, 0);
        const sumY = comp.reduce((acc, s) => acc + s.y, 0);
        clustersOutput.push({
           id: `cluster-${star.id}`,
           name: clusterLabelsArray[labelIdx % clusterLabelsArray.length],
           cx: sumX / comp.length,
           cy: sumY / comp.length,
           stars: comp
        });
        labelIdx++;
      }
    }

    return { connections: generatedConnections, clusters: clustersOutput };
  }, [stars]);

  const localMouseX = useTransform([rawMouseX, rawMouseY, rotationVal], ([mx, my, rotDeg]: any) => {
     if (mx === -1000) return -1000;
     const cxOuter = dimensions.width / 2;
     const cyOuter = dimensions.height / 2;
     const dx = mx - cxOuter;
     const dy = my - cyOuter;
     const rotRad = (rotDeg * Math.PI) / 180;
     const angle = Math.atan2(dy, dx) - rotRad;
     const r = Math.sqrt(dx*dx + dy*dy);
     
     const cxLocal = diag / 2;
     return cxLocal + r * Math.cos(angle);
  });

  const localMouseY = useTransform([rawMouseX, rawMouseY, rotationVal], ([mx, my, rotDeg]: any) => {
     if (mx === -1000) return -1000;
     const cxOuter = dimensions.width / 2;
     const cyOuter = dimensions.height / 2;
     const dx = mx - cxOuter;
     const dy = my - cyOuter;
     const rotRad = (rotDeg * Math.PI) / 180;
     const angle = Math.atan2(dy, dx) - rotRad;
     const r = Math.sqrt(dx*dx + dy*dy);
     
     const cyLocal = diag / 2;
     return cyLocal + r * Math.sin(angle);
  });

  const smoothMouseX = useSpring(localMouseX, { damping: 30, stiffness: 100 });
  const smoothMouseY = useSpring(localMouseY, { damping: 30, stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      rawMouseX.set(e.clientX - rect.left);
      rawMouseY.set(e.clientY - rect.top);
    }
  };

  const handleMouseLeave = () => {
    rawMouseX.set(-1000);
    rawMouseY.set(-1000);
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const clickRawX = e.clientX - rect.left;
      const clickRawY = e.clientY - rect.top;
      
      const cxOuter = dimensions.width / 2;
      const cyOuter = dimensions.height / 2;
      const dxOuter = clickRawX - cxOuter;
      const dyOuter = clickRawY - cyOuter;
      const rotRad = (rotationVal.get() * Math.PI) / 180;
      const angle = Math.atan2(dyOuter, dxOuter) - rotRad;
      const r = Math.sqrt(dxOuter*dxOuter + dyOuter*dyOuter);
      
      const clickX = diag / 2 + r * Math.cos(angle);
      const clickY = diag / 2 + r * Math.sin(angle);
      
      const isPlanet = Math.random() > 0.8;
      const newStar: Star = {
        id: `click-${Date.now()}`,
        x: clickX,
        y: clickY,
        size: isPlanet ? Math.random() * 8 + 6 : Math.random() * 2 + 2,
        type: isPlanet ? 'planet' : 'star',
        hue: isPlanet ? Math.floor(Math.random() * 360) : undefined
      };
      
      setStars(prev => [...prev.slice(-300), newStar]);
      
      const newExplosion: Explosion = {
        id: `exp-${Date.now()}`,
        x: clickX,
        y: clickY
      };
      setExplosions(prev => [...prev.slice(-10), newExplosion]);
      setSupernovaCount(prev => prev + 1);

      setTimeout(() => {
        setExplosions(prev => prev.filter(exp => exp.id !== newExplosion.id));
      }, 1000);
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden cursor-crosshair active:cursor-grabbing bg-gradient-to-b from-[#05010a] via-[#0a0514] to-[#05010a]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onPan={(e, info) => {
        if (enableRotation) {
           rotationVal.set(rotationVal.get() + info.delta.x * 0.05);
        }
      }}
      onPanEnd={(e, info) => {
        if (enableRotation) {
           dragX.set(info.velocity.x * 0.5);
        }
      }}
    >
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
        {supernovaCount > 0 && (
          <motion.div 
            className="px-4 py-2 rounded-full bg-indigo-900/40 border border-indigo-500/30 backdrop-blur-md text-indigo-200 text-sm font-mono tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            key={supernovaCount}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            SUPERNOVAS GENERATED: {supernovaCount}
          </motion.div>
        )}
      </div>

      <RadialFocus rawMouseX={rawMouseX} rawMouseY={rawMouseY} />
      <RealisticNebula />
      <DynamicNebulaCanvas mouseX={smoothMouseX} mouseY={smoothMouseY} dimensions={dimensions} />
      {diag > 0 && (
        <motion.div 
          style={{ 
            width: diag, 
            height: diag, 
            position: 'absolute', 
            top: '50%', 
            left: '50%',
            x: '-50%', 
            y: '-50%',
            rotate: rotationVal,
            willChange: 'transform'
          }}
        >
          <OffscreenConnections stars={stars} connections={connections} mouseX={smoothMouseX} mouseY={smoothMouseY} brightness={connectionBrightness} diag={diag} />
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
            <defs>
              {stars.filter(s => s.type === 'planet').map(p => (
                <radialGradient key={`grad-${p.id}`} id={`planet-${p.id}`} cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor={`hsl(${p.hue}, 100%, 85%)`} />
                  <stop offset="40%" stopColor={`hsl(${p.hue}, 80%, 55%)`} />
                  <stop offset="85%" stopColor={`hsl(${p.hue}, 80%, 25%)`} />
                  <stop offset="100%" stopColor={`hsl(${p.hue}, 90%, 10%)`} />
                </radialGradient>
              ))}
            </defs>
            {stars.map(star => (
              <React.Fragment key={star.id}>
                <TrailLine star={star} cxLocal={diag/2} cyLocal={diag/2} enableRotation={enableRotation} />
                <StarNode 
                  star={star} 
                  mouseX={smoothMouseX} 
                  mouseY={smoothMouseY} 
                  explosions={explosions}
                  audioVolume={audioVolume}
                />
              </React.Fragment>
            ))}
            {clusters.map(cluster => (
              <ClusterLabel 
                key={cluster.id} 
                cluster={cluster} 
                mouseX={smoothMouseX} 
                mouseY={smoothMouseY} 
              />
            ))}
            {explosions.map(exp => (
              <Supernova key={exp.id} explosion={exp} />
            ))}
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};
