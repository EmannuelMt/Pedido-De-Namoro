import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause,
  Heart, 
  Music as MusicIcon, 
  Clock, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  X,
  Volume2,
  ListMusic,
  Check,
  Search,
  AlertCircle,
  Calendar,
  Image as ImageIcon,
  Smile,
  Compass,
  Award,
  ChevronRight,
  ChevronLeft,
  Flame,
  Moon,
  Wind,
  Gift,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/auth';
import { toast } from 'sonner';

// Custom design colors
// --background: #FFF5E8;
// --primary: #D9828B;
// --secondary: #F4C97B;
// --accent: #9BB7D4;
// --surface: #FFFFFF;
// --text: #4A3A32;

interface Song {
  id: string;
  title: string;
  artist: string;
  feeling: string;
  spotifyUrl: string;
  spotifyTrackId: string;
  mood: '😊 Feliz' | '🌙 Calmo' | '❤️ Romântico' | '🎉 Festa' | '😢 Saudade';
  playlistGroup: 'Nossa primeira música' | 'Dias felizes' | 'Viagens' | 'Noites especiais' | 'Futuro' | 'Favoritas';
  memoryDate?: string;
  memoryImage?: string;
  lyrics?: string[]; // array of subtitles
  likes?: number;
  addedBy?: string;
  createdAt?: any;
}

const PRESET_SONGS: Song[] = [
  { 
    id: 'preset-yellow',
    title: 'Yellow', 
    artist: 'Coldplay', 
    feeling: 'Essa música lembra o dia em que nos vimos pessoalmente pela primeira vez. O tempo parou e tudo parecia amarelo e quente.', 
    spotifyUrl: 'https://open.spotify.com/track/3ee8J1FBNG7uS65qNu0SRq',
    spotifyTrackId: '3ee8J1FBNG7uS65qNu0SRq',
    mood: '❤️ Romântico',
    playlistGroup: 'Nossa primeira música',
    memoryDate: '12/04/2025',
    memoryImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400',
    likes: 42,
    lyrics: [
      "Look at the stars, look how they shine for you...",
      "And everything you do, yeah they were all yellow.",
      "I came along, I wrote a song for you...",
      "And all the things you do, and it was called Yellow."
    ]
  },
  { 
    id: 'preset-perfect',
    title: 'Perfect', 
    artist: 'Ed Sheeran', 
    feeling: 'Dançando abraçadinhos no meio da sala à meia-noite, rindo baixinho iluminados apenas pelas luzes piscantes.', 
    spotifyUrl: 'https://open.spotify.com/track/0afhq8XCg94m1z7G8o870Y',
    spotifyTrackId: '0afhq8XCg94m1z7G8o870Y',
    mood: '❤️ Romântico',
    playlistGroup: 'Noites especiais',
    memoryDate: '24/12/2025',
    memoryImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400',
    likes: 56,
    lyrics: [
      "I found a love for me...",
      "Darling, just dive right in and follow my lead.",
      "Well, I found a girl, beautiful and sweet...",
      "I never knew you were the someone waiting for me."
    ]
  },
  { 
    id: 'preset-lover',
    title: 'Lover', 
    artist: 'Taylor Swift', 
    feeling: 'Definitivamente a nossa trilha sonora para domingos preguiçosos fazendo panquecas juntos e planejando nossa casinha.', 
    spotifyUrl: 'https://open.spotify.com/track/1FSliS6YvbyInYv66SpE99',
    spotifyTrackId: '1FSliS6YvbyInYv66SpE99',
    mood: '😊 Feliz',
    playlistGroup: 'Dias felizes',
    memoryDate: '08/03/2026',
    memoryImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400',
    likes: 38,
    lyrics: [
      "We can leave the Christmas lights up 'til January...",
      "This is our place, we make the rules.",
      "And I'm highly suspicious that everyone who sees you wants you...",
      "Can I go where you go? Can we always be this close?"
    ]
  },
  { 
    id: 'preset-partilhar',
    title: 'Partilhar', 
    artist: 'Rubel, ANAVITÓRIA', 
    feeling: 'Sei que o mundo é meio caótico, mas quando essa música toca e você sorri pra mim, sinto que posso enfrentar qualquer coisa.', 
    spotifyUrl: 'https://open.spotify.com/track/2ZsnLpmsW6Z9n24NbyasG0',
    spotifyTrackId: '2ZsnLpmsW6Z9n24NbyasG0',
    mood: '🌙 Calmo',
    playlistGroup: 'Favoritas',
    memoryDate: '15/05/2026',
    memoryImage: 'https://images.unsplash.com/photo-1469571486090-6d99df4b44de?q=80&w=400',
    likes: 49,
    lyrics: [
      "Quero partilhar, quero partilhar...",
      "A vida boa com você.",
      "Seja na terra, seja no mar...",
      "Eu amo amar você."
    ]
  },
  {
    id: 'preset-dreams',
    title: 'Dreams',
    artist: 'The Cranberries',
    feeling: 'Tocando bem alto no rádio do carro com as janelas abertas, o vento bagunçando seu cabelo na nossa primeira viagem à praia.',
    spotifyUrl: 'https://open.spotify.com/track/4S0g9uSivvYV5fX6Y8vT46',
    spotifyTrackId: '4S0g9uSivvYV5fX6Y8vT46',
    mood: '🎉 Festa',
    playlistGroup: 'Viagens',
    memoryDate: '21/01/2026',
    memoryImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400',
    likes: 27,
    lyrics: [
      "Oh, my life is changing everyday, in every possible way...",
      "And oh, my dreams, it's never quite as it seems...",
      "Cause you're a dream to me."
    ]
  },
  {
    id: 'preset-as-as',
    title: 'As It Was',
    artist: 'Harry Styles',
    feeling: 'Dançando loucamente pela cozinha usando colheres de pau como microfones enquanto jantávamos tarde na sexta-feira.',
    spotifyUrl: 'https://open.spotify.com/track/4D77gA6Cj7A7bWfK92u0SR',
    spotifyTrackId: '4D77gA6Cj7A7bWfK92u0SR',
    mood: '🎉 Festa',
    playlistGroup: 'Dias felizes',
    memoryDate: '10/06/2026',
    memoryImage: 'https://images.unsplash.com/photo-1530101121876-7486fe951379?q=80&w=400',
    likes: 31,
    lyrics: [
      "Holdin' me back, gravity's holdin' me back...",
      "You know it's not the same as it was.",
      "In this world, it's just us..."
    ]
  },
  {
    id: 'preset-sweater-weather',
    title: 'Sweater Weather',
    artist: 'The Neighbourhood',
    feeling: 'Nos dias cinzentos e frios de outono, dividindo a mesma coberta grossa assistindo filmes e abraçados bem apertados.',
    spotifyUrl: 'https://open.spotify.com/track/2tUb6mR0P6Sg6as667ph60',
    spotifyTrackId: '2tUb6mR0P6Sg6as667ph60',
    mood: '😢 Saudade',
    playlistGroup: 'Futuro',
    memoryDate: '01/06/2026',
    memoryImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400',
    likes: 45,
    lyrics: [
      "And now let me hold both your hands in the holes of my sweater...",
      "Cause it's too cold, it's too cold...",
      "It's too cold for you here."
    ]
  }
];

export function Musicas() {
  const { user } = useAuthStore();
  
  // Real-time songs list from DB
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(PRESET_SONGS[0]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  
  // Customization Frames for Player
  const [playerFrame, setPlayerFrame] = useState<'cartoon' | 'anime' | 'nature' | 'dark'>('cartoon');
  
  // Interactive filters
  const [selectedMood, setSelectedMood] = useState<'Todos' | '😊 Feliz' | '🌙 Calmo' | '❤️ Romântico' | '🎉 Festa' | '😢 Saudade'>('Todos');
  const [selectedPlaylistGroup, setSelectedPlaylistGroup] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Custom Song creation modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newFeeling, setNewFeeling] = useState('');
  const [newSpotifyUrl, setNewSpotifyUrl] = useState('');
  const [newMood, setNewMood] = useState<'😊 Feliz' | '🌙 Calmo' | '❤️ Romântico' | '🎉 Festa' | '😢 Saudade'>('😊 Feliz');
  const [newGroup, setNewGroup] = useState<'Nossa primeira música' | 'Dias felizes' | 'Viagens' | 'Noites especiais' | 'Futuro' | 'Favoritas'>('Dias felizes');
  const [newMemoryDate, setNewMemoryDate] = useState(new Date().toLocaleDateString('pt-BR'));
  const [newMemoryImg, setNewMemoryImg] = useState('');
  const [newLyricsStr, setNewLyricsStr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sparkle stars array for player reacting to beat
  const [beatParticles, setBeatParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  // Sound Visualizer hearts and flowers
  const [visualizerParticles, setVisualizerParticles] = useState<{ id: number; type: 'heart' | 'star' | 'flower'; x: number; scale: number; speed: number }[]>([]);

  // Sync lyrics intervals
  useEffect(() => {
    let interval: any;
    if (isPlaying && selectedSong?.lyrics && selectedSong.lyrics.length > 0) {
      interval = setInterval(() => {
        setCurrentLyricIndex((prev) => (prev + 1) % (selectedSong.lyrics?.length || 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedSong]);

  // Handle active music rotation beat sparkles
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        // Add random floating musical bubbles/sparkles around the rotating CD vinyl
        const newParticle = {
          id: Math.random(),
          x: Math.floor(Math.random() * 80) + 10,
          y: Math.floor(Math.random() * 80) + 10,
          size: Math.floor(Math.random() * 16) + 12,
          delay: Math.random() * 2
        };
        setBeatParticles(prev => [...prev.slice(-15), newParticle]);

        // Add dynamic bottom visualizer bubbles
        const newVisualObj = {
          id: Math.random(),
          type: (['heart', 'star', 'flower'][Math.floor(Math.random() * 3)]) as any,
          x: Math.floor(Math.random() * 100),
          scale: Math.random() * 0.6 + 0.6,
          speed: Math.random() * 3 + 2
        };
        setVisualizerParticles(prev => [...prev.slice(-25), newVisualObj]);
      }, 1200);
    } else {
      setBeatParticles([]);
      setVisualizerParticles([]);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Fetch playlist items in real-time from Firestore db
  useEffect(() => {
    const q = query(collection(db, 'songs'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const loaded: Song[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loaded.push({
            id: docSnap.id,
            title: data.title || '',
            artist: data.artist || '',
            feeling: data.feeling || '',
            spotifyUrl: data.spotifyUrl || '',
            spotifyTrackId: data.spotifyTrackId || '',
            mood: data.mood || '❤️ Romântico',
            playlistGroup: data.playlistGroup || 'Dias felizes',
            memoryDate: data.memoryDate || '',
            memoryImage: data.memoryImage || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400',
            likes: data.likes || 0,
            lyrics: data.lyrics || ["Carregando melodias do coração do casal..."],
            addedBy: data.addedBy || 'Portal',
            createdAt: data.createdAt
          });
        });

        // Set state combined with presets for beautiful default populated showcase
        if (loaded.length > 0) {
          // Remove duplicates if same track ID is in presets
          const dbsAndPresets = [...loaded];
          PRESET_SONGS.forEach(p => {
            if (!dbsAndPresets.some(d => d.spotifyTrackId === p.spotifyTrackId)) {
              dbsAndPresets.push(p);
            }
          });
          setSongs(dbsAndPresets);
        } else {
          setSongs(PRESET_SONGS);
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Firestore songs error (using presets safely):", error);
        setSongs(PRESET_SONGS);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Parse static tracks helper
  const extractSpotifyTrackId = (url: string): string | null => {
    if (!url) return null;
    const trimmed = url.trim();
    if (trimmed.startsWith('spotify:track:')) {
      return trimmed.split(':')[2] || null;
    }
    const match = trimmed.match(/\/track\/([a-zA-Z0-9]{22})/);
    return match ? match[1] : null;
  };

  // Add custom song
  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Por favor, faça login para sintonizar músicas.');
      return;
    }

    const trackId = extractSpotifyTrackId(newSpotifyUrl);
    if (!trackId) {
      toast.error('Insira um link válido de música do Spotify!');
      return;
    }

    if (!newTitle.trim() || !newArtist.trim()) {
      toast.error('Preencha título e artista!');
      return;
    }

    const lyricsArr = newLyricsStr 
      ? newLyricsStr.split('\n').filter(l => l.trim().length > 0)
      : [
          "Melodia suave tocando...", 
          "Letras do amor escritas no diário...", 
          "Momento inesquecível gravado no tempo."
        ];

    try {
      setSubmitting(true);
      const newSongDoc = {
        title: newTitle.trim(),
        artist: newArtist.trim(),
        feeling: newFeeling.trim() || 'Uma música linda que faz lembrar a união especial do casal.',
        spotifyUrl: newSpotifyUrl.trim(),
        spotifyTrackId: trackId,
        mood: newMood,
        playlistGroup: newGroup,
        memoryDate: newMemoryDate || new Date().toLocaleDateString('pt-BR'),
        memoryImage: newMemoryImg.trim() || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400',
        likes: 1,
        lyrics: lyricsArr,
        addedBy: user.displayName || user.email || 'Parceiro(a)',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'songs'), newSongDoc);
      toast.success('Sua lembrança musical foi sintonizada com sucesso no player! 💿✨');

      // Reset state
      setNewTitle('');
      setNewArtist('');
      setNewFeeling('');
      setNewSpotifyUrl('');
      setNewLyricsStr('');
      setNewMemoryImg('');
      setIsAddOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar música.');
    } finally {
      setSubmitting(false);
    }
  };

  // Upvote heart count for a track
  const handleLikeSong = async (songId: string, currentLikes: number = 0) => {
    try {
      if (songId.startsWith('preset-')) {
        // Just increment local state values temporarily for presets
        setSongs(prev => prev.map(s => s.id === songId ? { ...s, likes: (s.likes || 0) + 1 } : s));
        if (selectedSong?.id === songId) {
          setSelectedSong(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
        }
        toast.success('Amor enviado para esta música! ❤️');
        return;
      }

      const songRef = doc(db, 'songs', songId);
      await updateDoc(songRef, { likes: currentLikes + 1 });
      toast.success('Seu amor por esta melodia foi registrado! ❤️');
    } catch {
      toast.error('Erro ao reagir.');
    }
  };

  // Delete custom track
  const handleDeleteSong = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id.startsWith('preset-')) {
      toast.error('Presets originais do reino não podem ser excluídos!');
      return;
    }

    if (!window.confirm('Quer mesmo remover este registro musical da nossa história? 🥺')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'songs', id));
      toast.success('Música removida das memórias.');
      if (selectedSong?.id === id) {
        setSelectedSong(PRESET_SONGS[0]);
      }
    } catch {
      toast.error('Erro ao deletar do Firestore.');
    }
  };

  // Combined song dynamic filtering
  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchMood = selectedMood === 'Todos' || song.mood === selectedMood;
      const matchGroup = selectedPlaylistGroup === 'Todos' || song.playlistGroup === selectedPlaylistGroup;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch = q === '' ||
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        song.feeling.toLowerCase().includes(q);

      return matchMood && matchGroup && matchSearch;
    });
  }, [songs, selectedMood, selectedPlaylistGroup, searchQuery]);

  // Achievements & Game trophies metrics status list
  const achievements = useMemo(() => {
    const totalCount = songs.length;
    const hasGroupCreated = songs.some(s => s.playlistGroup !== 'Dias felizes');

    return [
      {
        id: 'first_play',
        title: '🎵 Primeiro Play',
        description: 'Dê start no vinil mágico para evocar memórias.',
        unlocked: isPlaying,
        progress: isPlaying ? '1/1' : '0/1'
      },
      {
        id: 'saved_songs',
        title: '💿 Acumulador de Hits',
        description: 'Ter pelo menos 5 músicas em sintonia no portal.',
        unlocked: totalCount >= 5,
        progress: `${Math.min(totalCount, 5)}/5`
      },
      {
        id: 'our_song',
        title: '❤️ Nossa Música',
        description: 'Dar likes em músicas especiais compartilhadas.',
        unlocked: true,
        progress: 'Completo'
      },
      {
        id: 'playlist_masters',
        title: '🌎 Construtor de Playlist',
        description: 'Ter músicas salvas em categorias diferentes.',
        unlocked: hasGroupCreated,
        progress: hasGroupCreated ? '1/1' : '0/1'
      }
    ];
  }, [songs, isPlaying]);

  // Playlist group options
  const GROUP_LIST = [
    'Todos',
    'Nossa primeira música',
    'Dias felizes',
    'Viagens',
    'Noites especiais',
    'Futuro',
    'Favoritas'
  ];

  // Mood filters list
  const MOODS_LIST = [
    { name: 'Todos', color: 'bg-stone-100 hover:bg-stone-200 text-stone-800' },
    { name: '😊 Feliz', color: 'bg-[#FFF9EA] border-[#F4C97B] text-[#916E37]' },
    { name: '🌙 Calmo', color: 'bg-[#F2F7FD] border-[#9BB7D4] text-[#4A6482]' },
    { name: '❤️ Romântico', color: 'bg-[#FFF1F2] border-[#D9828B] text-[#C1545F]' },
    { name: '🎉 Festa', color: 'bg-[#FAF5FF] border-[#D8B4FE] text-[#7E22CE]' },
    { name: '😢 Saudade', color: 'bg-[#FFF7ED] border-[#FDBA74] text-[#C2410C]' }
  ] as const;

  // Next Track Queue calculation
  const nextUpQueue = useMemo(() => {
    if (!selectedSong) return [];
    const currentIndex = songs.findIndex(s => s.spotifyTrackId === selectedSong.spotifyTrackId);
    if (currentIndex === -1) return songs.slice(0, 3);
    
    // Grab up to 3 next songs wrapping around
    const queue: Song[] = [];
    for (let i = 1; i <= 3; i++) {
      const idx = (currentIndex + i) % songs.length;
      if (songs[idx] && songs[idx].id !== selectedSong.id) {
        queue.push(songs[idx]);
      }
    }
    return queue;
  }, [songs, selectedSong]);

  // Render player theme framing depending on select frame style
  const getPlayerFrameStyle = () => {
    switch (playerFrame) {
      case 'cartoon':
        return 'border-[8px] border-black bg-[#fcf9f2] shadow-[20px_20px_0_0_#F4C97B] rounded-[4rem]';
      case 'anime':
        return 'border-[8px] border-black bg-indigo-950 text-white shadow-[20px_20px_0_0_#a855f7] rounded-[4rem]';
      case 'nature':
        return 'border-[8px] border-black bg-stone-50 shadow-[20px_20px_0_0_#4ade80] rounded-[4rem]';
      case 'dark':
        return 'border-[8px] border-black bg-stone-900 text-zinc-100 shadow-[20px_20px_0_0_#000] rounded-[4rem]';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-black p-4 sm:p-8 lg:p-12 font-sans transition-all duration-300 relative overflow-hidden pb-40">
      
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
      </div>

      {/* Floating Visualizer objects when playing (hearts/stars flowing) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence>
          {visualizerParticles.map((pt) => (
            <motion.div
              key={pt.id}
              initial={{ y: '105vh', x: `${pt.x}vw`, opacity: 0, scale: pt.scale }}
              animate={{ y: '-10vh', opacity: [0, 0.7, 0.7, 0], rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: pt.speed, ease: 'linear' }}
              className="absolute text-xl select-none"
            >
              {pt.type === 'heart' && '❤️'}
              {pt.type === 'star' && '✨'}
              {pt.type === 'flower' && '🌸'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

        <div className="w-full space-y-12 relative z-10">
        
        {/* Hero Section */}
        <section className="bg-white border-[6px] border-black p-10 md:p-14 lg:p-20 rounded-[4rem] shadow-[24px_24px_0px_0px_#000] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:rotate-45">
            <MusicIcon className="w-[400px] h-[400px] text-black" />
          </div>

          <div className="space-y-6 max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-3 bg-rose-400 border-[3px] border-black px-5 py-2 rounded-full shadow-[4px_4px_0px_0px_#000] rotate-1">
              <Sparkles className="w-5 h-5 text-black" />
              <span className="text-xs font-black uppercase tracking-widest text-black">Sinfonia do Amor</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-black uppercase italic tracking-tighter leading-none">
              Nossa Trilha <br /> <span className="text-rose-400">Sonora</span>
            </h1>
            
            <p className="text-lg md:text-xl font-black uppercase text-black/40 leading-tight max-w-2xl">
              Descubra a trilha sonora mágica da nossa jornada! Entre na sintonia do vinil, navegue por nossas memórias secretas e sinta cada batida.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="bg-[#4ade80] border-[4px] border-black px-8 py-4 rounded-2xl shadow-[8px_8px_0px_0px_#000] flex items-center gap-4">
                <div className="bg-white border-[3px] border-black p-2 rounded-xl">
                  <MusicIcon className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-black/40">Nosso Acervo</div>
                  <div className="text-2xl font-black text-black leading-none">{songs.length} Músicas</div>
                </div>
              </div>

              {user && (
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="bg-black text-white hover:bg-rose-400 hover:text-black border-[4px] border-black px-10 py-6 rounded-2xl text-sm font-black uppercase italic tracking-[0.2em] transition-all shadow-[10px_10px_0px_0px_#e84e4e] hover:-translate-y-2 active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  + Adicionar Música
                </button>
              )}
            </div>
          </div>

          <div className="relative w-full xl:w-1/3 aspect-square max-w-[400px] hidden xl:block">
            <div className="absolute inset-0 bg-rose-400 border-[6px] border-black rounded-[3rem] rotate-3 shadow-[15px_15px_0px_0px_#000]" />
            <div className="absolute inset-0 bg-white border-[6px] border-black rounded-[3rem] flex items-center justify-center -rotate-3 overflow-hidden border-dashed border-opacity-50">
               <img 
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600" 
                className="w-full h-full object-cover"
                alt="Music vibe"
              />
            </div>
          </div>
        </section>

        {/* Styles bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-[3px] bg-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 italic">Estilos do Player</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {[
              { id: 'cartoon', label: '🎈 Cartoon', color: 'bg-amber-400' },
              { id: 'anime', label: '✨ Anime', color: 'bg-purple-400' },
              { id: 'nature', label: '🍃 Nature', color: 'bg-emerald-400' },
              { id: 'dark', label: '🌙 Dark', color: 'bg-stone-900 text-white' }
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setPlayerFrame(style.id as any)}
                className={`px-5 py-2.5 border-[3px] border-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none hover:-translate-y-1 cursor-pointer ${
                  playerFrame === style.id ? `${style.color} -rotate-2` : 'bg-white text-black'
                } ${style.color && playerFrame === style.id ? '' : 'hover:bg-rose-50'}`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN GRID COLLABS LAYOUTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: HEARBEAT MAGIC VINYL PLAYER (CD CONTROLLER) */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-10">
            
            <div className={`p-10 ${getPlayerFrameStyle()} transition-all duration-500`}>
              
              {/* Header inside player frame option */}
              <div className="flex justify-between items-center border-b-[4px] border-black/10 pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-red-500 border-[2px] border-black animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                    On Air: {playerFrame.toUpperCase()} STYLE
                  </span>
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-[#F4C97B] text-black border-[3px] border-black text-[10px] px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:-translate-y-1 transition-all shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  {isPlaying ? 'PAUSAR' : 'REPRODUZIR'}
                </button>
              </div>

              {/* ROTATING MAGIC VINYL RECORD DISK */}
              <div className="my-12 relative flex flex-col items-center justify-center">
                
                {/* Visual reactive beat circles behind the vinyl disk */}
                <div className={`absolute w-72 h-72 rounded-full bg-rose-400/10 border-[3px] border-dashed border-rose-400/40 transition-all duration-500 ${
                  isPlaying ? 'scale-110 rotate-45' : 'scale-90'
                }`} />

                {/* Rotating floating particles inside visual record */}
                {beatParticles.map((pt) => (
                  <motion.div
                    key={pt.id}
                    initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    animate={{ scale: [0, 1.3, 1], opacity: [0, 0.8, 0], x: (pt.x - 50) * 2, y: (pt.y - 50) * -2 }}
                    transition={{ duration: 2.2, ease: 'easeOut' }}
                    className="absolute text-xl font-black text-rose-500 opacity-0 pointer-events-none select-none z-20"
                  >
                    🎵
                  </motion.div>
                ))}

                {/* Actual CD physical representation wrapping rotation element */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <motion.div 
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={isPlaying ? { repeat: Infinity, duration: 8, ease: 'linear' } : { duration: 0.5 }}
                    className="w-full h-full bg-black border-[6px] border-black rounded-full shadow-[0px_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden"
                  >
                    {/* Vinyl Groove circle rings */}
                    <div className="absolute inset-4 border border-white/5 rounded-full" />
                    <div className="absolute inset-8 border border-white/5 rounded-full" />
                    <div className="absolute inset-12 border border-white/5 rounded-full" />
                    <div className="absolute inset-16 border border-white/5 rounded-full" />

                    {/* Highly polished colorful music label */}
                    <div className={`w-28 h-28 border-[4px] border-black rounded-full flex flex-col items-center justify-center text-center relative p-2 ${
                      playerFrame === 'dark' ? 'bg-amber-400' : 'bg-rose-400'
                    }`}>
                      <Heart className="w-6 h-6 text-black fill-black animate-pulse" />
                      <span className="text-[7px] font-black text-black uppercase tracking-widest mt-1">
                        SINTONIA S2
                      </span>
                      <span className="text-[6px] font-black text-black uppercase tracking-tighter truncate max-w-[90px] mt-0.5">
                        {selectedSong?.title || 'No sound'}
                      </span>
                    </div>

                    {/* High gloss reflections on record surface */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
                    
                    {/* Center spindle hole */}
                    <div className="absolute w-4 h-4 bg-[#fcf9f2] border-[3px] border-black rounded-full z-20" />
                  </motion.div>

                  {/* Stylized play turntable arm needles */}
                  <motion.div 
                    animate={isPlaying ? { rotate: 22 } : { rotate: -15 }}
                    transition={{ type: 'spring', stiffness: 80 }}
                    className="absolute top-1.5 right-[-2px] origin-top-right w-20 h-32 pointer-events-none z-10"
                  >
                    <svg className="w-full h-full text-black drop-shadow-md" viewBox="0 0 100 200" fill="none">
                      <path d="M90,10 L30,40 L45,150 L65,165" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                      <circle cx="90" cy="10" r="14" fill="#1a1a1a" stroke="#000" strokeWidth="4" />
                      <rect x="58" y="155" width="16" height="22" rx="4" fill="#e11d48" stroke="#000" strokeWidth="3" />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* SONG METADATA DESCRIPTION BLOCK */}
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <span className="bg-[#4ade80] text-black border-[3px] border-black text-[10px] font-black uppercase px-4 py-1 rounded-xl shadow-[4px_4px_0px_0px_#000] rotate-1">
                    {selectedSong?.mood || '❤️ Romântico'}
                  </span>
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-black line-clamp-1 mt-2">
                  {selectedSong?.title || 'Nenhuma música'}
                </h3>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-black/40 block">
                  {selectedSong?.artist || 'Silêncio no Reino'}
                </p>
              </div>

              {/* INTERACTIVE COMPANION SUBTITLE BAR (Lyrics Synced) */}
              <div className="mt-8 p-6 bg-black border-[4px] border-black rounded-[2rem] text-center relative overflow-hidden min-h-[80px] flex items-center justify-center shadow-[8px_8px_0px_0px_#e84e4e]">
                <div className="absolute left-4 top-4 text-emerald-400">
                  <Volume2 className="w-5 h-5 animate-bounce" />
                </div>
                <p className="font-black italic text-sm text-white tracking-tight px-8 select-none leading-tight">
                  "{selectedSong?.lyrics?.[currentLyricIndex] || 'Nenhuma letra disponível.'}"
                </p>
              </div>

              {/* PLAYER CD PANEL CONTROL BUTTONS */}
              <div className="flex items-center justify-center gap-6 mt-10">
                <button
                  onClick={() => {
                    const currentIndex = songs.findIndex(s => s.id === selectedSong?.id);
                    if (currentIndex > 0) setSelectedSong(songs[currentIndex - 1]);
                    else setSelectedSong(songs[songs.length - 1]);
                    setIsPlaying(true);
                  }}
                  className="p-4 bg-white border-[4px] border-black rounded-3xl hover:bg-rose-50 transition-all shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  <ChevronLeft className="w-8 h-8 text-black stroke-[4px]" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-rose-400 p-8 border-[4px] border-black rounded-full hover:scale-105 transition-all shadow-[8px_8px_0_0_#000] active:translate-y-2 active:shadow-none cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-black fill-black stroke-[4px]" />
                  ) : (
                    <Play className="w-10 h-10 text-black fill-black stroke-[4px] translate-x-1" />
                  )}
                </button>

                <button
                  onClick={() => {
                    const currentIndex = songs.findIndex(s => s.id === selectedSong?.id);
                    if (currentIndex < songs.length - 1) setSelectedSong(songs[currentIndex + 1]);
                    else setSelectedSong(songs[0]);
                    setIsPlaying(true);
                  }}
                  className="p-4 bg-white border-[4px] border-black rounded-3xl hover:bg-rose-50 transition-all shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  <ChevronRight className="w-8 h-8 text-black stroke-[4px]" />
                </button>
              </div>

              {/* SPOTIFY LIVE INTEGRATION FOOTER IFRAME */}
              {selectedSong?.spotifyTrackId && (
                <div className="mt-10 pt-8 border-t-[4px] border-black/10">
                  <div className="bg-white border-[4px] border-black p-2 rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_#000] min-h-[152px]">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${selectedSong.spotifyTrackId}`}
                      width="100%"
                      height="152"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-2xl bg-black min-h-[152px]"
                    ></iframe>
                  </div>
                  <div className="flex justify-between items-center px-2 mt-4 text-[10px] font-black text-black uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Spotify Stream Live
                    </span>
                    <a
                      href={selectedSong.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-rose-500 flex items-center gap-1 transition-colors italic"
                    >
                      Abrir App <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* UPCOMING QUEUE (SISTEMA DE FILA) */}
            <div className="bg-white border-[4px] border-black p-8 rounded-[3rem] shadow-[12px_12px_0_0_#000] space-y-6">
              <div className="flex items-center gap-3 border-b-[3px] border-black/5 pb-4">
                <div className="w-3 h-3 bg-rose-400 border-[2px] border-black rounded-full" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 italic">
                  Próximos na Fila
                </h4>
              </div>
              <div className="space-y-4">
                {nextUpQueue.length === 0 ? (
                  <p className="text-xs text-black/30 font-black uppercase italic tracking-widest text-center py-4">Fila Vazia</p>
                ) : (
                  nextUpQueue.map((item, idx) => (
                    <div
                      key={`queue-${item.id}-${idx}`}
                      onClick={() => {
                        setSelectedSong(item);
                        setIsPlaying(true);
                      }}
                      className="group flex items-center gap-4 p-4 bg-[#fcf9f2] hover:bg-white border-[3px] border-black rounded-2xl cursor-pointer transition-all shadow-[4px_4px_0_0_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none"
                    >
                      <span className="text-[10px] font-black text-rose-500 bg-white border-[2px] border-black px-2 py-1 rounded-lg">
                        0{idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-black uppercase italic tracking-tighter truncate leading-none">{item.title}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black/30 truncate mt-1">{item.artist}</p>
                      </div>
                      <span className="text-[8px] font-black uppercase px-2 py-1 bg-white border-[2px] border-black rounded-lg text-black">
                        {item.mood.split(' ')[1] || item.mood}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STORIES PLAYLISTS, HISTORY TIMELINE, MOODBANDS & ACHIEVEMENTS */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-10">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. INTERACTIVE SYSTEM OF MOODS (FILTRO DE HUMOR) */}
              <div className="bg-white border-[4px] border-black p-8 rounded-[3rem] shadow-[12px_12px_0_0_#F4C97B] space-y-6">
                <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] block italic">
                  ⚓ Filtro por Humor
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MOODS_LIST.map((mood) => {
                    const isSelected = selectedMood === mood.name;
                    return (
                      <button
                        key={mood.name}
                        onClick={() => setSelectedMood(mood.name)}
                        className={`px-4 py-3 border-[3px] border-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none shrink-0 cursor-pointer ${
                          isSelected 
                            ? 'bg-black text-white' 
                            : 'bg-white text-black hover:bg-rose-50'
                        }`}
                      >
                        {mood.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PLAYLIST CLUSTERS SELECTOR */}
              <div className="bg-white border-[4px] border-black p-8 rounded-[3rem] shadow-[12px_12px_0_0_#9BB7D4] space-y-6 overflow-hidden">
                <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] block italic">
                  📁 Categorias Musicais
                </span>
                <div className="flex flex-wrap gap-2">
                  {GROUP_LIST.map((g) => {
                    const isSelected = selectedPlaylistGroup === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setSelectedPlaylistGroup(g)}
                        className={`px-4 py-2 border-[3px] border-black rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-400 text-black shadow-[4px_4px_0_0_#000]'
                            : 'bg-white text-black hover:bg-rose-50'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* MÚSICA + MEMÓRIA POPULATED HISTORICAL TIMELINE */}
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white border-[4px] border-black p-6 rounded-[2.5rem] shadow-[10px_10px_0px_0px_#000]">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-black flex items-center gap-4">
                  <Flame className="w-8 h-8 text-rose-500" />
                  Trilha do Amor <span className="text-rose-500">({filteredSongs.length})</span>
                </h3>
                
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-12 h-[4px] bg-black" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 italic">Timeline</span>
                </div>
              </div>

              {filteredSongs.length === 0 ? (
                <div className="bg-white border-[5px] border-black rounded-[4rem] p-20 text-center shadow-[20px_20px_0_0_#000]">
                  <div className="w-24 h-24 bg-rose-100 border-[4px] border-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0_0_#000]">
                    <HelpCircle className="w-12 h-12 text-black" />
                  </div>
                  <h4 className="text-2xl font-black text-black uppercase italic">Vazio Cósmico</h4>
                  <p className="text-sm font-black uppercase tracking-widest text-black/40 mt-4 max-w-md mx-auto leading-relaxed">
                    Nenhuma música encontrada nestes parâmetros. Adicione novos tons à nossa história!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                  {filteredSongs.map((song) => {
                    const isActive = selectedSong?.id === song.id;
                    return (
                      <div
                        key={song.id}
                        onClick={() => {
                          setSelectedSong(song);
                          setIsPlaying(true);
                          setCurrentLyricIndex(0);
                        }}
                        className={`bg-white border-[5px] rounded-[3rem] p-8 flex flex-col justify-between transition-all duration-500 cursor-pointer relative overflow-hidden group select-none shadow-[12px_12px_0_0_#000] ${
                          isActive 
                            ? 'border-rose-400 scale-[1.02] shadow-[16px_16px_0_0_#e84e4e]' 
                            : 'border-black hover:-translate-y-2 hover:shadow-[18px_18px_0_0_#000]'
                        }`}
                      >
                        {/* Image preview sticker */}
                        <div className="absolute -top-4 -right-4 w-28 h-28 opacity-10 group-hover:opacity-20 transition-all duration-700 -rotate-12 group-hover:rotate-6">
                          {song.memoryImage && (
                            <img src={song.memoryImage} className="w-full h-full object-cover rounded-[2rem] border-[4px] border-black" referrerPolicy="no-referrer" />
                          )}
                        </div>

                        <div className="space-y-6 relative z-10">
                          <div className="flex items-center gap-3">
                            <span className="bg-amber-400 border-[3px] border-black px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000] rotate-2">
                              {song.mood.split(' ')[1] || song.mood}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 italic">
                              {song.playlistGroup}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-2xl font-black uppercase italic tracking-tighter text-black leading-none group-hover:text-rose-500 transition-colors">
                              {song.title}
                            </h4>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                              {song.artist}
                            </p>
                          </div>

                          <div className="flex flex-col gap-3">
                            {song.memoryDate && (
                              <div className="bg-[#fcf9f2] border-[3px] border-black px-4 py-2 rounded-xl flex items-center gap-3 w-fit shadow-[3px_3px_0_0_#000]">
                                <Calendar className="w-4 h-4 text-rose-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-black">
                                  {song.memoryDate}
                                </span>
                              </div>
                            )}
                            <p className="text-xs font-black uppercase italic text-black/60 leading-tight line-clamp-3">
                              &ldquo;{song.feeling}&rdquo;
                            </p>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t-[3px] border-black/5 flex items-center justify-between gap-4 relative z-10">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeSong(song.id, song.likes);
                              }}
                              className="flex items-center gap-2 bg-rose-400 border-[3px] border-black px-4 py-2 rounded-xl shadow-[4px_4px_0_0_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                            >
                              <Heart className="w-4 h-4 text-black fill-black" />
                              <span className="text-xs font-black text-black">{song.likes || 0}</span>
                            </button>

                            {/* Delete custom elements */}
                            {!song.id.startsWith('preset-') && user && (
                              <button
                                onClick={(e) => handleDeleteSong(song.id, e)}
                                className="p-2 bg-white border-[3px] border-black rounded-xl text-black hover:bg-rose-50 hover:text-rose-500 transition-all shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none cursor-pointer"
                                title="Deletar registro"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* GAME TROPHIES AND ACHIEVEMENT BADGES (CONQUISTAS) */}
            <div className="bg-white border-[5px] border-black p-10 rounded-[3.5rem] shadow-[18px_18px_0_0_#000] space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-[4px] border-black/5 pb-8">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter text-black flex items-center gap-4">
                    <Award className="w-10 h-10 text-amber-400" />
                    Conquistas Musicais
                  </h3>
                  <p className="text-xs font-black uppercase tracking-widest text-black/40 leading-relaxed max-w-lg">
                    Sintonize o coração de vocês dois e destrave medalhas lendárias ouvindo as memórias!
                  </p>
                </div>

                <div className="bg-amber-400 border-[3px] border-black px-6 py-2 rounded-xl shadow-[4px_4px_0_0_#000] rotate-2">
                   <div className="text-[10px] font-black uppercase tracking-widest text-black">Progresso Geral</div>
                   <div className="text-2xl font-black text-black leading-none">
                     {achievements.filter(a => a.unlocked).length}/{achievements.length}
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((item) => (
                  <div
                    key={item.id}
                    className={`p-6 rounded-[2rem] border-[4.5px] border-black flex flex-col justify-between space-y-4 select-none relative overflow-hidden transition-all duration-300 ${
                      item.unlocked 
                        ? 'bg-emerald-400 shadow-[8px_8px_0_0_#000] -rotate-1' 
                        : 'bg-white opacity-60 shadow-[8px_8px_0_0_#000]'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-black uppercase italic tracking-tighter text-black">
                          {item.title}
                        </h4>
                        <div className={`px-3 py-1 border-[3px] border-black rounded-lg text-xs font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000] ${
                          item.unlocked ? 'bg-white text-black' : 'bg-stone-100 text-black/30'
                        }`}>
                          {item.unlocked ? '✓' : '!'}
                        </div>
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-black/50 leading-relaxed italic">
                        &ldquo;{item.description}&rdquo;
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-black/30 border-t-[3px] border-black/5 pt-4">
                      <span>Progresso: {item.progress}</span>
                      <span className="text-black">{item.unlocked ? 'CONCLUÍDO' : 'PENDENTE'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* POPUP: ADD CUSTOM MUSICAL RECORD FORM */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999] overflow-y-auto backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: -5 }}
              className="bg-white border-[6px] border-black rounded-[4rem] p-10 md:p-14 max-w-2xl w-full shadow-[24px_24px_0px_0px_#e84e4e] relative my-12"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsAddOpen(false)}
                className="absolute top-8 right-8 p-4 bg-rose-400 border-[4px] border-black rounded-2xl cursor-pointer hover:rotate-90 transition-all shadow-[4px_4px_0_0_#000]"
              >
                <X className="w-6 h-6 text-black stroke-[3px]" />
              </button>

              <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 bg-rose-400 border-[4px] border-black rounded-[1.5rem] flex items-center justify-center shadow-[10px_10px_0_0_#000] -rotate-3">
                  <MusicIcon className="w-10 h-10 text-black" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-black uppercase italic tracking-tighter">Sintonizar Melodia</h3>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/30 mt-2">Transforme som em memória eterna</p>
                </div>
              </div>

              <form onSubmit={handleAddSong} className="space-y-8">
                
                {/* Spotify Link */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">
                    Link do Spotify
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://open.spotify.com/track/..."
                    value={newSpotifyUrl}
                    onChange={(e) => {
                      setNewSpotifyUrl(e.target.value);
                      
                      // Pull helper
                      const tid = extractSpotifyTrackId(e.target.value);
                      if (tid && !newTitle) {
                        toast.info('Link do Spotify detectado!');
                      }
                    }}
                    className="w-full px-8 py-5 bg-[#fcf9f2] border-[4px] border-black rounded-[2rem] text-sm font-black text-black outline-none focus:bg-rose-50 shadow-[6px_6px_0_0_#000] focus:translate-y-1 focus:shadow-none transition-all placeholder:text-black/10"
                  />
                  <span className="text-[9px] text-black/30 font-black uppercase tracking-widest block ml-4">
                    Clique em Compartilhar {`->`} Copiar Link da Música.
                  </span>
                </div>

                {/* Name and Artist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Música</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Perfect"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-8 py-5 bg-[#fcf9f2] border-[4px] border-black rounded-[2rem] text-sm font-black text-black outline-none focus:bg-rose-50 shadow-[6px_6px_0_0_#000] focus:translate-y-1 focus:shadow-none transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Artista</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Ed Sheeran"
                      value={newArtist}
                      onChange={(e) => setNewArtist(e.target.value)}
                      className="w-full px-8 py-5 bg-[#fcf9f2] border-[4px] border-black rounded-[2rem] text-sm font-black text-black outline-none focus:bg-rose-50 shadow-[6px_6px_0_0_#000] focus:translate-y-1 focus:shadow-none transition-all"
                    />
                  </div>
                </div>

                {/* Mood and Group Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Humor</label>
                    <select
                      value={newMood}
                      onChange={(e) => setNewMood(e.target.value as any)}
                      className="w-full px-8 py-5 bg-[#fcf9f2] border-[4px] border-black rounded-[2rem] text-sm font-black uppercase text-black appearance-none shadow-[6px_6px_0_0_#000] cursor-pointer"
                    >
                      <option value="😊 Feliz">😊 Feliz</option>
                      <option value="🌙 Calmo">🌙 Calmo</option>
                      <option value="❤️ Romântico">❤️ Romântico</option>
                      <option value="🎉 Festa">🎉 Festa</option>
                      <option value="😢 Saudade">😢 Saudade</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Data Histórica</label>
                    <input
                      type="text"
                      required
                      placeholder="12/04/2026"
                      value={newMemoryDate}
                      onChange={(e) => setNewMemoryDate(e.target.value)}
                      className="w-full px-8 py-5 bg-[#fcf9f2] border-[4px] border-black rounded-[2rem] text-sm font-black text-black outline-none shadow-[6px_6px_0_0_#000]"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Relato de Amor</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Em que momento ouvimos essa música?"
                    value={newFeeling}
                    onChange={(e) => setNewFeeling(e.target.value)}
                    className="w-full px-8 py-5 bg-[#fcf9f2] border-[4px] border-black rounded-[2.5rem] text-sm font-black text-black outline-none shadow-[6px_6px_0_0_#000] italic"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-8 bg-black text-white hover:bg-rose-400 hover:text-black border-[5px] border-black rounded-[2.5rem] font-black uppercase italic text-lg tracking-[0.3em] transition-all shadow-[15px_15px_0_0_#e84e4e] hover:-translate-y-2 active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  {submitting ? 'SINCRONIZANDO...' : 'Sintonizar Agora ✓'}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
