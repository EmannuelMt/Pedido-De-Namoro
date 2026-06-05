import React, { useEffect, useRef, useState } from 'react';
import './PedidoView.css';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Star } from 'lucide-react';

const IMAGE_SRCS = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1522673607200-1c4b9cdb480f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1518621736915-f46fb0172e29?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800"
];

const FACE_NAMES = [
  "O COMEÇO",
  "O SORRISO",
  "A PARCERIA",
  "O FUTURO",
  "A CERTEZA",
  "O PEDIDO"
];

export const PedidoView = ({ onAccept }: any) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const hudPctRef = useRef<HTMLDivElement>(null);
  const progFillRef = useRef<HTMLDivElement>(null);
  const sceneNameRef = useRef<HTMLDivElement>(null);
  const captionNumRef = useRef<HTMLDivElement>(null);
  const captionNameRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !cubeRef.current) return;

    const N = 6;
    const SWAP_RADIUS = 3;

    function buildStops(n: number) {
      const base = [
        { rx: 90, ry: 0 },
        { rx: 0, ry: 0 },
        { rx: 0, ry: -90 },
        { rx: 0, ry: -180 },
        { rx: 0, ry: -270 },
        { rx: -90, ry: -360 }
      ];
      return base.slice(0, Math.min(n, 6));
    }
    const STOPS = buildStops(N);
    const stopIndex = (s: number) => Math.min(N - 1, Math.floor(s * (N - 1)));
    
    function faceAtStop(i: number) {
      if (i < 6) return i;
      return 1 + ((i - 2) % 4);
    }

    const faces = Array.from(cubeRef.current.querySelectorAll('.face')) as HTMLElement[];
    const sections = Array.from(container.querySelectorAll('section')) as HTMLElement[];
    const sceneDots = Array.from(stripRef.current?.querySelectorAll('.scene-dot') || []) as HTMLElement[];
    
    const faceImgIdx = new Array(6).fill(-1);
    let currentStop = -1;
    let lastFaceIdx = -1;

    // Load initial images
    function setFaceImageRaw(faceIdx: number, imgIdx: number) {
      if (faceImgIdx[faceIdx] === imgIdx) return;
      faceImgIdx[faceIdx] = imgIdx;
      const face = faces[faceIdx];
      if (!face) return;
      let img = face.querySelector('img');
      if (!img) {
        img = new Image();
        face.appendChild(img);
      }
      img.src = IMAGE_SRCS[imgIdx];
      img.alt = FACE_NAMES[imgIdx] || '';
    }

    // pre-fill the first sequence
    for (let i = 0; i < N; i++) {
       setFaceImageRaw(i, i);
    }

    function checkImageSwaps(s: number) {
      const base = stopIndex(s);
      for (let offset = -SWAP_RADIUS; offset <= SWAP_RADIUS; offset++) {
        if (offset === 0) continue;
        const si = base + offset;
        if (si < 0 || si >= N) continue;
        setFaceImageRaw(faceAtStop(si), si);
      }
    }

    let sectionTops: number[] = [];
    const buildSectionTops = () => {
      sectionTops = sections.map(s => {
        // relative to container scroll top
        return s.offsetTop;
      });
    };

    let maxScroll = 1;
    let lastScrollHeight = 0;
    const resize = () => {
      const h = container.scrollHeight;
      const vh = container.clientHeight;
      if (h === lastScrollHeight) return;
      lastScrollHeight = h;
      maxScroll = Math.max(1, h - vh);
      buildSectionTops();
    };

    const sectionIndexFromScroll = (y: number) => {
      const mid = y + container.clientHeight * 0.5;
      let idx = 0;
      for (let i = 0; i < sectionTops.length; i++) {
        if (mid >= sectionTops[i]) idx = i;
      }
      return Math.min(idx, N - 1);
    };

    const updateHUD = (s: number) => {
      const p = Math.round(s * 100);
      const y = container.scrollTop;
      const si = sectionIndexFromScroll(y);
      currentStop = si;
      
      if (hudPctRef.current) hudPctRef.current.textContent = String(p).padStart(3, "0") + "%";
      if (progFillRef.current) progFillRef.current.style.width = `${p}%`;
      
      if (si !== lastFaceIdx) {
        lastFaceIdx = si;
        const name = FACE_NAMES[si] || "";
        if (sceneNameRef.current) sceneNameRef.current.textContent = name;
        if (captionNumRef.current) captionNumRef.current.textContent = String(si + 1).padStart(2, "0");
        if (captionNameRef.current) captionNameRef.current.textContent = name;
        sceneDots.forEach((d, i) => d.classList.toggle("active", i === si));
      }
    };

    const easeIO = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    const setCubeTransform = (s: number) => {
      const t = s * (N - 1);
      const i = Math.min(Math.floor(t), N - 2);
      const f = easeIO(t - i);
      const a = STOPS[i];
      const b = STOPS[i + 1];
      const rx = a.rx + (b.rx - a.rx) * f;
      const ry = a.ry + (b.ry - a.ry) * f;
      if (cubeRef.current) cubeRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    resize();

    let tgt = 0;
    let smooth = 0;
    let velocity = 0;
    const ease = 0.1;

    const onScroll = () => {
      tgt = maxScroll > 0 ? container.scrollTop / maxScroll : 0;
      tgt = Math.max(0, Math.min(1, tgt));
    };

    container.addEventListener("scroll", onScroll, { passive: true });

    // Wheel takeover for smooth scroll effect
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const linePx = 16;
      const pagePx = container.clientHeight * 0.9;
      const delta = e.deltaMode === 1 ? e.deltaY * linePx : e.deltaMode === 2 ? e.deltaY * pagePx : e.deltaY;
      if (Math.abs(delta) < 5) return;
      velocity += delta;
      velocity = Math.max(-600, Math.min(600, velocity));
    };
    container.addEventListener("wheel", onWheel, { passive: false });

    // Intersection observers for revealing text
    const revealEls = Array.from(container.querySelectorAll(".tag, h1, h2, .body-text, .stat-row, .cta, .cta-back, .cta-primary, .decline-btn, .h-line")) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, root: container }
    );
    revealEls.forEach((el) => io.observe(el));

    let lastNow = performance.now();
    let frameId: number;

    const frame = (now: number) => {
      frameId = requestAnimationFrame(frame);
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;

      velocity *= Math.pow(0.9, dt * 60);
      if (Math.abs(velocity) < 0.01) velocity = 0;

      if (Math.abs(velocity) > 0.2) {
        const next = Math.max(0, Math.min(container.scrollTop + velocity * ease, maxScroll));
        container.scrollTop = next;
        tgt = next / maxScroll;
      }

      smooth += (tgt - smooth) * (1 - Math.exp(-dt * 8));
      smooth = Math.max(0, Math.min(1, smooth));

      updateHUD(smooth);
      checkImageSwaps(smooth);
      setCubeTransform(smooth);
    };

    frameId = requestAnimationFrame(frame);
    
    // Smooth Anchor Scroll manually added for anchor clicks
    const handleAnchorClick = (e: Event) => {
        const anchor = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
        if (!anchor || !anchor.startsWith('#s')) return;
        e.preventDefault();
        const target = container.querySelector(anchor) as HTMLElement;
        if (target) {
           velocity = 0;
           container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        }
    };
    const ctas = container.querySelectorAll('a[href^="#s"]');
    ctas.forEach(a => a.addEventListener('click', handleAnchorClick));

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("wheel", onWheel);
      io.disconnect();
      ctas.forEach(a => a.removeEventListener('click', handleAnchorClick));
    };
  }, []);

  const handleDecline = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const x = Math.random() * (window.innerWidth - btn.offsetWidth);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight);
    btn.style.position = 'fixed';
    btn.style.left = `${Math.max(10, x)}px`;
    btn.style.top = `${Math.max(10, y)}px`;
  };

  const onAcceptInternal = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#f43f5e', '#ec4899', '#db2777'] });
    setTimeout(() => {
      if(onAccept) onAccept();
    }, 4000);
  };

  return (
    <div id="pedido-view-root" data-theme={theme}>
      <div id="scene">
        <div id="cube" ref={cubeRef}>
          <div className="face" data-face="top" data-i="0"><span className="face-ph">TOP</span></div>
          <div className="face" data-face="front" data-i="1"><span className="face-ph">FRONT</span></div>
          <div className="face" data-face="right" data-i="2"><span className="face-ph">RIGHT</span></div>
          <div className="face" data-face="back" data-i="3"><span className="face-ph">BACK</span></div>
          <div className="face" data-face="left" data-i="4"><span className="face-ph">LEFT</span></div>
          <div className="face" data-face="bottom" data-i="5"><span className="face-ph">BOTTOM</span></div>
        </div>
      </div>

      <div id="hud">
        <div id="hud_pct" ref={hudPctRef}>000%</div>
        <div className="progress-bar">
          <div className="progress-fill" id="prog_fill" ref={progFillRef}></div>
        </div>
        <div className="scene-label" id="scene_name" ref={sceneNameRef}>O COMEÇO</div>
      </div>

      <button id="theme_toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Toggle light/dark mode">
        <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      </button>

      <div id="scene_strip" ref={stripRef}>
        <a href="#s0" className="scene-dot active"></a>
        <a href="#s1" className="scene-dot"></a>
        <a href="#s2" className="scene-dot"></a>
        <a href="#s3" className="scene-dot"></a>
        <a href="#s4" className="scene-dot"></a>
        <a href="#s5" className="scene-dot"></a>
      </div>

      <div id="face_caption">
        <div id="face_caption_num" ref={captionNumRef}>01</div>
        <div id="face_caption_name" ref={captionNameRef}>O COMEÇO</div>
      </div>

      <div id="scroll_content" ref={scrollContainerRef} style={{ height: '100%', overflowY: 'auto' }}>

        <section id="s0">
          <div className="text-card">
            <div className="tag flex-tag">
              <Sparkles size={14} className="tag-icon" />
              00 — O COMEÇO
            </div>
            <h1>NOSSA<br/>HISTÓRIA</h1>
            <p className="body-text">
              Tudo começou com um olhar. Um instante que mudou tudo. Tudo ganhou mais cor e sentido. E hoje, olhando para trás, percebo que foi o momento mais perfeito da minha vida. Role para descobrir.
            </p>
            <div className="cta-row">
              <a className="cta" href="#s1">
                Entrar
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 6h10M6 1l5 5-5 5" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section id="s1">
          <div className="text-card right">
            <div className="h-line"></div>
            <div className="tag flex-tag">
              <Star size={14} className="tag-icon" />
              01 — O SORRISO
            </div>
            <h2>LUZ<br/>NO<br/>CAMINHO</h2>
            <p className="body-text">
              O seu sorriso iluminou os meus dias. E foi ali, logo no começo, que eu percebi o quão especial e incrível você era para mim. Um sorriso que me traz paz.
            </p>
            <div className="cta-row">
              <a className="cta-back" href="#s0">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 6H1M6 11L1 6l5-5" />
                </svg>
                Voltar
              </a>
              <a className="cta" href="#s2">
                Virar
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 6h10M6 1l5 5-5 5" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section id="s2">
          <div className="text-card">
            <div className="h-line"></div>
            <div className="tag flex-tag">
              <Heart size={14} className="tag-icon" />
              02 — A PARCERIA
            </div>
            <h2>DOIS<br/>EM<br/>UM</h2>
            <p className="body-text">
              As conversas longas, as risadas espontâneas e até mesmo os silêncios confortáveis. Tudo flui perfeitamente, como uma dança onde nenhum de nós precisa forçar os passos.
            </p>
            <div className="cta-row">
              <a className="cta-back" href="#s1">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 6H1M6 11L1 6l5-5" />
                </svg>
                Voltar
              </a>
              <a className="cta" href="#s3">
                Virar
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 6h10M6 1l5 5-5 5" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section id="s3">
          <div className="text-card right">
            <div className="h-line"></div>
            <div className="tag flex-tag">
              <Star size={14} className="tag-icon" />
              03 — O FUTURO
            </div>
            <h2>PLANOS<br/>E<br/>SONHOS</h2>
            <p className="body-text">
              Quando olho para a frente, é com você que imagino cada nova conquista. Construir histórias, viajar, colecionar momentos felizes e dividir as melhores partes dessa aventura chamada vida.
            </p>
            <div className="cta-row">
              <a className="cta-back" href="#s2">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 6H1M6 11L1 6l5-5" />
                </svg>
                Voltar
              </a>
              <a className="cta" href="#s4">
                Virar
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 6h10M6 1l5 5-5 5" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section id="s4">
          <div className="text-card">
            <div className="h-line"></div>
            <div className="tag flex-tag">
              <Sparkles size={14} className="tag-icon" />
              04 — A CERTEZA
            </div>
            <h2>SEM<br/>NENHUMA<br/>DÚVIDA</h2>
            <p className="body-text">
              Em cada momento juntos, em cada desafio superado, eu tive a confirmação que meu coração já sentia. Você é meu abrigo, minha melhor escolha. E eu não quero soltar a sua mão jamais.
            </p>
            <div className="cta-row">
              <a className="cta-back" href="#s3">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 6H1M6 11L1 6l5-5" />
                </svg>
                Voltar
              </a>
              <a className="cta" href="#s5">
                O Grande Feito
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 6h10M6 1l5 5-5 5" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section id="s5">
          <div className="text-card right">
            <div className="h-line"></div>
            <div className="tag flex-tag">
              <Heart size={14} className="tag-icon" fill="currentColor" />
              05 — O MOMENTO
            </div>
            <h2>QUER<br/>NAMORAR<br/>COMIGO?</h2>
            <p className="body-text">
              Nossos caminhos se cruzaram de forma perfeita. E é por isso que, olhando nos seus olhos, eu pergunto: aceita ser a minha parceira de vida e começar este novo e lindo capítulo ao meu lado?
            </p>
            <div className="cta-row" style={{ marginTop: '2.5rem', gap: '1rem' }}>
              <button className="cta-primary" onClick={onAcceptInternal}>
                Sim, eu aceito!
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 6h10M6 1l5 5-5 5" />
                </svg>
              </button>
              <button onMouseEnter={handleDecline} className="decline-btn" style={{ position: 'relative', zIndex: 50 }}>
                Acho que não
              </button>
            </div>
            <div className="cta-row" style={{ marginTop: '1rem' }}>
              <a className="cta-back" href="#s4" style={{ fontSize: '0.65rem' }}>
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 6H1M6 11L1 6l5-5" />
                </svg>
                Voltar um pouco
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

