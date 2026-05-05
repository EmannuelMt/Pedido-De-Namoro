import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, Sparkles, Heart } from 'lucide-react';

const ROMANTIC_WORDS = [
  "AMOR", "SINTONIA", "AURA", "ETERNAL", "MARCO", 
  "ANAPOLIS", "ECOS", "SABRINA", "EMANNUEL", "FUTURO"
];

const GRID_SIZE = 12;

export const WordSearch = ({ onFinish }: { onFinish?: (stats: any) => void }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordsFound, setWordsFound] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ r: number, c: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    generateGrid();
  }, []);

  const generateGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    
    // Place words
    ROMANTIC_WORDS.forEach(word => {
      let placed = false;
      while (!placed) {
        const direction = Math.random() > 0.5 ? 'H' : 'V';
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        
        if (direction === 'H' && col + word.length <= GRID_SIZE) {
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row][col + i] !== '' && newGrid[row][col + i] !== word[i]) {
              canPlace = false; break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) newGrid[row][col + i] = word[i];
            placed = true;
          }
        } else if (direction === 'V' && row + word.length <= GRID_SIZE) {
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row + i][col] !== '' && newGrid[row + i][col] !== word[i]) {
              canPlace = false; break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) newGrid[row + i][col] = word[i];
            placed = true;
          }
        }
      }
    });

    // Fill empty spaces
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
    setGrid(newGrid);
    setWordsFound([]);
  };

  const handleMouseDown = (r: number, c: number) => {
    setIsDragging(true);
    setSelectedCells([{ r, c }]);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isDragging) {
      // Logic for straight lines only
      const start = selectedCells[0];
      if (r === start.r || c === start.c) {
        const newSelection = [];
        const rDir = r === start.r ? 0 : (r > start.r ? 1 : -1);
        const cDir = c === start.c ? 0 : (c > start.c ? 1 : -1);
        
        let currR = start.r;
        let currC = start.c;
        while (currR !== r || currC !== c) {
          newSelection.push({ r: currR, c: currC });
          currR += rDir;
          currC += cDir;
        }
        newSelection.push({ r, c });
        setSelectedCells(newSelection);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const selectedWord = selectedCells.map(cell => grid[cell.r][cell.c]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    if (ROMANTIC_WORDS.includes(selectedWord) && !wordsFound.includes(selectedWord)) {
      setWordsFound([...wordsFound, selectedWord]);
      if (wordsFound.length + 1 === ROMANTIC_WORDS.length && onFinish) {
        onFinish({ game: 'WordSearch', words: wordsFound.length + 1 });
      }
    } else if (ROMANTIC_WORDS.includes(reversedWord) && !wordsFound.includes(reversedWord)) {
       setWordsFound([...wordsFound, reversedWord]);
       if (wordsFound.length + 1 === ROMANTIC_WORDS.length && onFinish) {
         onFinish({ game: 'WordSearch', words: wordsFound.length + 1 });
       }
    }
    setSelectedCells([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <div className="space-y-12">
        <div className="text-left space-y-4">
           <h3 className="text-5xl font-serif italic text-white leading-tight">Busca <br /> <span className="text-[var(--primary)]">Sentimentada.</span></h3>
           <p className="text-white/40 font-serif italic text-xl">Palavras que transcendem o código e definem o nosso universo.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           {ROMANTIC_WORDS.map(word => (
             <div 
               key={word}
               className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                 wordsFound.includes(word) 
                   ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                   : 'bg-white/5 border-white/5 text-white/30'
               }`}
             >
                <span className="font-mono text-[10px] uppercase tracking-widest">{word}</span>
                {wordsFound.includes(word) && <Heart size={12} fill="currentColor" />}
             </div>
           ))}
        </div>

        <button 
          onClick={generateGrid}
          className="w-full py-6 bg-white/5 hover:bg-white/10 text-white rounded-3xl border border-white/10 flex items-center justify-center gap-4 transition-all font-bold text-[10px] uppercase tracking-[0.5em]"
        >
          <RefreshCcw size={14} /> Reembaralhar Destino
        </button>
      </div>

      <div 
        className="luxury-glass p-8 rounded-[3.5rem] border border-white/5 select-none touch-none"
        onMouseLeave={handleMouseUp}
      >
        <div className="grid grid-cols-12 gap-1 touch-none">
          {grid.map((row, r) => row.map((letter, c) => {
            const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
            const isFoundPart = wordsFound.some(word => {
               // This is a simplification. To be accurate we'd need to store found letters coordinates.
               // For now, let's just highlight if the letter exists in any found word.
               // Actually, let's keep it simple: just show success message when all found.
               return false; 
            });

            return (
              <div
                key={`${r}-${c}`}
                onMouseDown={() => handleMouseDown(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                onMouseUp={handleMouseUp}
                className={`aspect-square flex items-center justify-center text-sm font-mono transition-all rounded-lg cursor-crosshair sm:text-lg ${
                  isSelected 
                    ? 'bg-[var(--primary)] text-black font-bold scale-110 shadow-lg shadow-[var(--primary)]/30' 
                    : 'text-white/40 hover:bg-white/10'
                }`}
              >
                {letter}
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
};
