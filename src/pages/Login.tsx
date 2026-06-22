import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Github,
  Chrome,
  Music,
  Shapes,
  Star,
  Zap,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingScreen } from '../components/LoadingScreen';
import { useTheme } from '../context/ThemeContext';

// Romantic system statements for the custom starting sync screen
const MEMORY_PHRASES = [
  'Iniciando sistema de recordações...',
  'Sincronizando olhares e risos...',
  'Calculando batidas em uníssono...',
  'Carregando segredos eternos...',
  'Ajustando algoritmo de aconchego...',
  'Abrindo cofre das piadas internas...',
  'Sintonizando trilha sonora...',
  'Preparando dengo infinito para você...'
];

export function Login() {
  const { theme: globalTheme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Experience states
  const [isLoadingMemories, setIsLoadingMemories] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  // 1. Mouse move for subtle parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth - 0.5) * 20,
      y: (clientY / window.innerHeight - 0.5) * 20,
    });
  };

  // 2. Audio Control
  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.15;
    }

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
      toast.info('Trilha sonora em standby 🔘');
    } else {
      audioRef.current.play()
        .then(() => {
          setIsMusicPlaying(true);
          toast.success('Atmosfera romântica ativada 🎵✨');
        })
        .catch(() => toast.error('Toque em qualquer lugar para liberar o áudio!'));
    }
  };

  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  // 3. Auth Handlers
  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Acesso concedido pelo Universo! ❤️');
      navigate('/');
    } catch (err: any) {
      toast.error('O portal recusou a entrada via Google.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Campos obrigatórios faltando!');
    
    setIsLoading(true);
    try {
      if (isSignUp) {
        if (!name) throw new Error('Diga seu nome!');
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success(`Bem-vindo(a) ao nosso universo, ${name}!`);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Sincronização estabelecida com sucesso!');
      }
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Falha na conexão de corações.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Memory Cards Data
  const memories = useMemo(() => [
    { id: 1, img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=300', tag: 'Aventura', rot: '-rotate-3' },
    { id: 2, img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=300', tag: 'Risos', rot: 'rotate-6' },
    { id: 3, img: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=300', tag: 'Nós', rot: '-rotate-6' },
  ], []);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-full h-full bg-[#fcf9f2] selection:bg-pink-200 selection:text-pink-900 overflow-y-auto overflow-x-hidden font-sans"
    >
      <AnimatePresence>
        {isLoadingMemories && (
          <LoadingScreen onFinished={() => setIsLoadingMemories(false)} />
        )}
      </AnimatePresence>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: mousePos.x * -0.5, y: mousePos.y * -0.5 }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: mousePos.x * 0.8, y: mousePos.y * 0.8 }}
          className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-pink-200/40 rounded-full blur-[100px]" 
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent opacity-60" />
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
        
        {/* Audio Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMusic}
            className="w-12 h-12 bg-white border-[4px] border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#000] cursor-pointer"
          >
            {isMusicPlaying ? (
              <Volume2 size={20} strokeWidth={3} className="text-pink-500 animate-pulse" />
            ) : (
              <VolumeX size={20} strokeWidth={3} className="text-stone-400" />
            )}
          </motion.button>
        </div>

        <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Visual Experience */}
          <div className="hidden lg:flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="inline-block bg-yellow-300 border-[4px] border-black px-6 py-2 rounded-xl shadow-[6px_6px_0px_#000] -rotate-2 mb-6">
                <h1 className="text-2xl font-black uppercase tracking-tighter italic">Cofre de Memórias</h1>
              </div>
              <p className="text-lg font-bold text-stone-800 max-w-sm leading-tight uppercase tracking-tight">
                Onde cada <span className="text-pink-500">flash</span> é um universo de <span className="text-purple-600">sentidos</span> que guardamos só para nós.
              </p>
            </motion.div>

            <div className="relative h-[400px] w-full">
              {memories.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.8, y: 50, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotate: idx === 0 ? -3 : idx === 1 ? 6 : -6 }}
                  transition={{ delay: 0.8 + idx * 0.2, duration: 0.6, type: 'spring' }}
                  whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                  className={`absolute bg-white border-[4px] border-black p-3 rounded-2xl shadow-[8px_8px_0px_#000] cursor-pointer transition-shadow hover:shadow-[12px_12px_0px_#000]`}
                  style={{ 
                    left: `${idx * 25}%`, 
                    top: `${idx * 15}%`,
                    width: '260px' 
                  }}
                >
                  <div className="aspect-[4/5] bg-stone-100 border-[3px] border-black rounded-lg overflow-hidden relative group">
                    <img src={m.img} alt="Memória" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <div className="bg-white border-2 border-black rounded-full p-1 shadow-[2px_2px_0px_#000]">
                        <Heart size={10} className="fill-pink-500 text-pink-500" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">{m.tag}</span>
                    <span className="text-[10px] font-mono font-black border-2 border-black px-1.5 rounded-md">∞</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex gap-4 items-center">
              {[
                { icon: <Shapes size={18} />, label: 'Multiverse' },
                { icon: <Star size={18} />, label: 'Eternity' },
                { icon: <Zap size={18} />, label: 'Energy' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-stone-100 border-[2px] border-black px-3 py-1.5 rounded-full">
                  <span className="text-pink-500">{item.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-[450px] relative">
              {/* Decorative background shapes */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 border-[4px] border-black rounded-full shadow-[6px_6px_0px_#000] -z-10 hidden md:block" />
              <div className="absolute -bottom-6 -left-12 w-24 h-24 bg-yellow-400 border-[4px] border-black rounded-2xl shadow-[6px_6px_0px_#000] rotate-12 -z-10 hidden md:block" />

              <div className="bg-white border-[6px] border-black rounded-[40px] p-8 md:p-12 shadow-[12px_12px_0px_#000] relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 border-l-[4px] border-b-[4px] border-black rounded-bl-[40px] flex items-center justify-center">
                  <Sparkles size={32} className="text-pink-500 animate-bounce" strokeWidth={2.5} />
                </div>

                <header className="mb-10 pt-2">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 mb-2 text-pink-500"
                  >
                    <Music size={14} className="animate-spin-slow" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] font-mono">Nosso Ritmo Perfeito</span>
                  </motion.div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                    Universo <br />
                    <span className="text-purple-600">de Nós</span>
                  </h2>
                </header>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <AnimatePresence mode="wait">
                    {isSignUp && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-2"
                      >
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-black transition-colors">
                            <User size={18} strokeWidth={3} />
                          </div>
                          <input
                            type="text"
                            placeholder="SUA ALCUNHA ESPECIAL"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-[#fcf9f2] border-[4px] border-black py-4 pl-12 pr-4 rounded-2xl font-black text-xs uppercase tracking-widest placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all shadow-[4px_4px_0px_#000]"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2 group">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-black transition-colors">
                        <Mail size={18} strokeWidth={3} />
                      </div>
                      <input
                        type="email"
                        placeholder="E-MAIL COMPARTILHADO"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-[#fcf9f2] border-[4px] border-black py-4 pl-12 pr-4 rounded-2xl font-black text-xs uppercase tracking-widest placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all shadow-[4px_4px_0px_#000]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-black transition-colors">
                        <Lock size={18} strokeWidth={3} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="CHAVE DE ACESSO SECRETA"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-[#fcf9f2] border-[4px] border-black py-4 pl-12 pr-12 rounded-2xl font-black text-xs uppercase tracking-widest placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all shadow-[4px_4px_0px_#000]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={18} strokeWidth={3} /> : <Eye size={18} strokeWidth={3} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest pt-1 px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 border-[3px] border-black rounded-md appearance-none checked:bg-pink-500 checked:border-black transition-colors relative cursor-pointer" 
                      />
                      <Check className={`absolute w-3.5 h-3.5 text-white pointer-events-none transition-opacity ml-[3px] ${rememberMe ? 'opacity-100' : 'opacity-0'}`} strokeWidth={6} />
                      <span className="group-hover:text-pink-600 transition-colors text-black">Conectar Auto</span>
                    </label>
                    <button type="button" className="text-stone-400 hover:text-black transition-colors">Forgot Access?</button>
                  </div>

                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-black text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-[8px_8px_0px_#ff90e8] hover:shadow-[4px_4px_0px_#ff90e8] border-[4px] border-black transition-all cursor-pointer flex items-center justify-center gap-3 active:translate-y-1"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{isSignUp ? 'Criar Universo' : 'Sincronizar'}</span>
                          <ArrowRight size={20} strokeWidth={4} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>

                <div className="my-8 flex items-center gap-4">
                  <div className="h-[2px] flex-1 bg-black/10" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Social Login</span>
                  <div className="h-[2px] flex-1 bg-black/10" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <Chrome size={20} className="text-google-blue" />, label: 'Google', action: handleGoogleAuth },
                    { icon: <Github size={20} />, label: 'Github', action: () => toast.info('Github indisponível no momento.') }
                  ].map((social, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={social.action}
                      type="button"
                      className="flex items-center justify-center gap-2 bg-white border-[3px] border-black py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                    >
                      {social.icon} <span className="text-black">{social.label}</span>
                    </motion.button>
                  ))}
                </div>

                <footer className="mt-10 text-center">
                  <p className="text-[11px] font-bold text-stone-800 tracking-tight uppercase">
                    {isSignUp ? 'Já tem sua chave?' : 'Novo por aqui?'}
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="ml-2 text-pink-500 font-black hover:underline cursor-pointer"
                    >
                      {isSignUp ? 'Fazer Entrar' : 'Criar Registro'}
                    </button>
                  </p>
                </footer>
              </div>

              {/* Watermark */}
              <div className="text-center mt-6 flex flex-col items-center gap-1">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">OHIMESAMA OS v4.0</span>
                <Heart size={12} className="text-pink-500 animate-pulse fill-pink-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* Scroll indicator for mobile */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden pointer-events-none"
      >
        <div className="w-6 h-10 border-[3px] border-black rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-black rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
