import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, ArrowLeft, Trophy, Heart } from 'lucide-react';

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
  "https://images.unsplash.com/photo-1518199266791-739d6ffecf0b?w=400",
  "https://images.unsplash.com/photo-1502602720212-49a05591f18d?w=400",
  "https://images.unsplash.com/photo-1516589174184-c6858b16ecb0?w=400",
  "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=400",
  "https://images.unsplash.com/photo-1511285560929-d832140d709d?w=400",
];

export const MemoryGame = ({ photos = [], onFinish }: { photos?: string[], onFinish?: (stats: any) => void }) => {
  const [cards, setCards] = useState<{ id: number, url: string, isFlipped: boolean, isMatched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [photos]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setGameTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const initializeGame = () => {
    const gameImages = (photos.length >= 6 ? photos.slice(0, 6) : [...photos, ...DEFAULT_IMAGES].slice(0, 6));
    const pairImages = [...gameImages, ...gameImages];
    const shuffled = pairImages
      .sort(() => Math.random() - 0.5)
      .map((url, index) => ({
        id: index,
        url,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameTime(0);
    setIsActive(true);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isMatched || cards[id].isFlipped) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].url === cards[second].url) {
        setMatches(m => m + 1);
        const matchedCards = [...newCards];
        matchedCards[first].isMatched = true;
        matchedCards[second].isMatched = true;
        setCards(matchedCards);
        setFlippedCards([]);
        
        if (matches + 1 === cards.length / 2) {
          setIsActive(false);
          if (onFinish) {
            onFinish({ game: 'Memory', moves: moves + 1, time: gameTime });
          }
        }
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap justify-between items-center gap-6">
        <div className="flex gap-8">
          <div className="text-left">
             <p className="text-white/30 font-mono text-[9px] uppercase tracking-widest">Movimentos</p>
             <p className="text-3xl font-serif text-white italic">{moves}</p>
          </div>
          <div className="text-left">
             <p className="text-white/30 font-mono text-[9px] uppercase tracking-widest">Tempo</p>
             <p className="text-3xl font-serif text-white italic">{gameTime}s</p>
          </div>
        </div>
        <button 
          onClick={initializeGame}
          className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all border border-white/5"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(card.id)}
            className="aspect-square relative cursor-pointer group"
          >
            <div className={`w-full h-full rounded-2xl md:rounded-3xl transition-all duration-500 preserve-3d ${card.isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Back of card */}
              <div className="absolute inset-0 bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center backface-hidden">
                <Heart size={24} className="text-[var(--primary)] opacity-20 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
              </div>
              
              {/* Front of card */}
              <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden rotate-y-180 backface-hidden shadow-2xl">
                <img src={card.url} className="w-full h-full object-cover" alt="Memory Card" />
                {card.isMatched && (
                  <div className="absolute inset-0 bg-[var(--primary)]/20 backdrop-blur-[2px] flex items-center justify-center">
                    <Trophy size={40} className="text-white drop-shadow-xl" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {matches === cards.length / 2 && cards.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 luxury-glass rounded-[4rem] border border-[var(--primary)]/30 text-center space-y-6"
          >
             <h3 className="text-5xl font-serif italic text-white">Sintonia Plena!</h3>
             <p className="text-white/40 font-serif italic text-xl">Nossas memórias são o nosso maior tesouro.</p>
             <div className="flex justify-center gap-8 pt-4">
                <div className="text-left">
                   <p className="text-[var(--primary)] font-mono text-[9px] uppercase tracking-widest">Eficiência</p>
                   <p className="text-3xl text-white font-serif">{Math.round(((cards.length / 2) / moves) * 100)}%</p>
                </div>
                <div className="text-left">
                   <p className="text-[var(--primary)] font-mono text-[9px] uppercase tracking-widest">Velocidade</p>
                   <p className="text-3xl text-white font-serif">{gameTime}s</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
