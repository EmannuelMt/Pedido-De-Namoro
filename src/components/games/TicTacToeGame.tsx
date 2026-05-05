import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, Heart, X as XIcon, Circle, Trophy } from 'lucide-react';

interface TicTacToeProps {
  onFinish?: (stats: any) => void;
}

type Player = 'X' | 'O' | null;

export const TicTacToeGame: React.FC<TicTacToeProps> = ({ onFinish }) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (!squares.includes(null)) return { winner: 'Draw', line: null };
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const result = checkWinner(newBoard);
    if (result) {
        setWinner(result.winner);
        setWinningLine(result.line);
        if (onFinish) {
          onFinish({ winner: result.winner, board: newBoard });
        }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto luxury-card p-10 md:p-16 relative overflow-hidden flex flex-col justify-center items-center">
      
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tighter italic mb-4">
          Jogo da <span className="text-glow text-[var(--primary)]">Velha</span>
        </h2>
        <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
          O clássico. {isXNext ? 'Sua vez (Romântico x)' : 'Vez do(a) crush (Aconchegante o)'}
        </p>
      </div>

      <div className="relative w-full max-w-[400px] aspect-square mx-auto mb-16">
         {/* Grid lines */}
         <div className="absolute inset-x-0 h-[2px] bg-white/10 top-1/3 -translate-y-1/2" />
         <div className="absolute inset-x-0 h-[2px] bg-white/10 top-2/3 -translate-y-1/2" />
         <div className="absolute inset-y-0 w-[2px] bg-white/10 left-1/3 -translate-x-1/2" />
         <div className="absolute inset-y-0 w-[2px] bg-white/10 left-2/3 -translate-x-1/2" />

         <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-4 p-4 relative z-10">
           {board.map((cell, idx) => {
             const isWinningCell = winningLine?.includes(idx);
             return (
               <motion.button
                 key={idx}
                 whileHover={{ scale: cell || winner ? 1 : 1.1 }}
                 whileTap={{ scale: cell || winner ? 1 : 0.9 }}
                 onClick={() => handleClick(idx)}
                 className={`w-full h-full flex items-center justify-center rounded-2xl transition-all ${
                   isWinningCell ? 'bg-[var(--primary)]/20 shadow-[0_0_20px_var(--primary-glow)]' : 'hover:bg-white/5'
                 }`}
                 disabled={!!cell || !!winner}
               >
                 <AnimatePresence>
                   {cell === 'X' && (
                     <motion.div
                       initial={{ scale: 0, rotate: -45 }}
                       animate={{ scale: 1, rotate: 0 }}
                       className="text-white filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                     >
                       <XIcon size={64} strokeWidth={1.5} />
                     </motion.div>
                   )}
                   {cell === 'O' && (
                     <motion.div
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       className="text-[var(--primary)] filter drop-shadow-[0_0_15px_var(--primary-glow)]"
                     >
                       <Circle size={56} strokeWidth={2} />
                     </motion.div>
                   )}
                 </AnimatePresence>
               </motion.button>
             );
           })}
         </div>

         {/* Winner Overlay for aesthetic */}
         <AnimatePresence>
           {winner && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center backdrop-blur-sm rounded-3xl"
             >
                <motion.div 
                  initial={{ scale: 0.5, y: 50 }} 
                  animate={{ scale: 1, y: 0 }} 
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="bg-black/80 border border-white/10 px-10 py-8 rounded-[3rem] shadow-extreme flex flex-col items-center"
                >
                   {winner === 'Draw' ? (
                      <>
                        <Heart size={48} className="text-rose-500 mb-4 opacity-50" />
                        <span className="text-3xl font-serif italic text-white">Deu Velha!</span>
                        <span className="text-white/40 text-sm mt-2 font-mono uppercase tracking-widest">Amo vocês dois igual</span>
                      </>
                   ) : (
                      <>
                        <Trophy size={48} className="text-[var(--primary)] mb-4 drop-shadow-[0_0_20px_var(--primary-glow)]" />
                        <span className="text-5xl font-serif italic text-white flex gap-4 items-center">
                           {winner === 'X' ? <XIcon size={40} /> : <Circle size={40} className="text-[var(--primary)]" />}
                           Venceu
                        </span>
                      </>
                   )}
                </motion.div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="px-10 py-5 bg-white text-black rounded-full font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:bg-[var(--primary)] hover:text-white"
            >
              <RefreshCcw size={16} /> Jogar Novamente
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
