import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { socket } from '../../lib/socket';
import { Target, Shield, Users, ArrowLeft, RefreshCcw, Wifi, WifiOff, Bomb, Anchor } from 'lucide-react';

const GRID_SIZE = 8;
const SHIPS = [
  { name: 'Porta-Aviões', size: 4 },
  { name: 'Encouraçado', size: 3 },
  { name: 'Cruzador', size: 2 },
  { name: 'Submarino', size: 2 },
];

export const Battleship = ({ user, partnerUid }: { user: any, partnerUid: string }) => {
  const [roomId, setRoomId] = useState('');
  const [gameState, setGameState] = useState<'joining' | 'placing' | 'playing' | 'ended'>('joining');
  const [myBoard, setMyBoard] = useState<number[][]>(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
  const [opponentBoard, setOpponentBoard] = useState<number[][]>(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [message, setMessage] = useState('Aguardando o outro comandante...');

  useEffect(() => {
    socket.connect();
    
    const rId = [user.uid, partnerUid].sort().join('-');
    setRoomId(rId);

    socket.emit('join_room', { roomId: rId, userId: user.uid, userName: user.displayName });

    socket.on('room_update', (room) => {
      if (room.players.length === 2) {
        setOpponentConnected(true);
        if (gameState === 'joining') setGameState('placing');
      } else {
        setOpponentConnected(false);
      }
    });

    socket.on('game_event', (action) => {
      handleServerAction(action);
    });

    return () => {
      socket.off('room_update');
      socket.off('game_event');
      socket.disconnect();
    };
  }, []);

  const handleServerAction = (action: any) => {
    switch (action.type) {
      case 'ATTACK':
        if (action.targetId === user.uid) {
           // Someone attacked me
           const { r, c } = action;
           const isHit = myBoard[r][c] === 1;
           const newBoard = [...myBoard];
           newBoard[r][c] = isHit ? 2 : 3; // 2=Hit, 3=Miss
           setMyBoard(newBoard);
           
           // Check if I lost
           const hasShips = newBoard.some(row => row.includes(1));
           
           socket.emit('game_action', { 
             roomId, 
             action: { 
               type: 'ATTACK_RESULT', 
               attackerId: action.attackerId, 
               isHit, 
               r, c,
               isDefeated: !hasShips
             } 
           });
           setIsMyTurn(true);
           setMessage(isHit ? 'Fomos atingidos!' : 'O inimigo errou!');
        }
        break;
      case 'ATTACK_RESULT':
        if (action.attackerId === user.uid) {
           // Result of my attack
           const { r, c, isHit, isDefeated } = action;
           const newOppBoard = [...opponentBoard];
           newOppBoard[r][c] = isHit ? 2 : 3;
           setOpponentBoard(newOppBoard);
           setIsMyTurn(false);
           setMessage(isHit ? 'Alvo sintonizado!' : 'Águas profundas...');
           
           if (isDefeated) {
             setGameState('ended');
             setMessage('Vitória Total: O Universo é nosso!');
           }
        }
        break;
      case 'READY':
        if (action.userId !== user.uid) {
          setMessage('Oponente pronto. Comece o ataque!');
          // Logic to decide who starts (e.g. alphabetical uid)
          const isFirst = user.uid < partnerUid;
          setIsMyTurn(isFirst);
        }
        break;
    }
  };

  const handlePlaceShip = (r: number, c: number) => {
    if (gameState !== 'placing') return;
    const newBoard = [...myBoard];
    // Simple toggle for placement
    if (newBoard[r][c] === 1) newBoard[r][c] = 0;
    else if (newBoard.flat().filter(x => x === 1).length < 10) newBoard[r][c] = 1;
    setMyBoard(newBoard);
  };

  const handleReady = () => {
    if (myBoard.flat().filter(x => x === 1).length < 10) return;
    setGameState('playing');
    socket.emit('game_action', { roomId, action: { type: 'READY', userId: user.uid } });
    setMessage('Procurando sinais de radar...');
  };

  const handleAttack = (r: number, c: number) => {
    if (!isMyTurn || gameState !== 'playing' || opponentBoard[r][c] !== 0) return;
    socket.emit('game_action', { roomId, action: { type: 'ATTACK', attackerId: user.uid, targetId: partnerUid, r, c } });
    setIsMyTurn(false);
    setMessage('Enviando sinal...');
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-left space-y-4">
           <div className="flex items-center gap-3">
              {opponentConnected ? <Wifi size={14} className="text-emerald-500" /> : <WifiOff size={14} className="text-rose-500" />}
              <span className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-[0.5em]">{opponentConnected ? 'Conexão Estável' : 'Aguardando Partner...'}</span>
           </div>
           <h3 className="text-5xl font-serif italic text-white leading-tight">Marés <br /> <span className="text-[var(--primary)]">Sincronizadas.</span></h3>
        </div>

        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-6">
           <div className={`p-4 rounded-2xl ${isMyTurn ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-white/20'}`}>
              <Target size={24} />
           </div>
           <p className="text-white/60 font-serif italic text-xl">{message}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* My Board */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <span className="text-white/30 font-mono text-[9px] uppercase tracking-widest flex items-center gap-2"><Shield size={12} /> Nossa Frota</span>
              {gameState === 'placing' && (
                <span className="text-[var(--primary)] font-mono text-[9px] uppercase tracking-widest">{myBoard.flat().filter(x => x === 1).length} / 10 Pontos</span>
              )}
           </div>
           <div className="grid grid-cols-8 gap-2 bg-white/[0.02] p-6 rounded-[2.5rem] border border-white/5">
              {myBoard.map((row, r) => row.map((cell, c) => (
                <motion.div
                  key={`${r}-${c}`}
                  whileHover={gameState === 'placing' ? { scale: 1.1 } : {}}
                  onClick={() => handlePlaceShip(r, c)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all border ${
                    cell === 1 ? 'bg-[var(--primary)]/40 border-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' :
                    cell === 2 ? 'bg-rose-500 border-rose-600 text-white shadow-lg shadow-rose-500/30' :
                    cell === 3 ? 'bg-white/10 border-white/20 text-white/20' : 'bg-transparent border-white/5'
                  }`}
                >
                  {cell === 2 && <Bomb size={12} />}
                  {cell === 1 && <Anchor size={12} />}
                </motion.div>
              )))}
           </div>
           {gameState === 'placing' && (
             <button 
               onClick={handleReady}
               disabled={myBoard.flat().filter(x => x === 1).length < 10}
               className="w-full py-6 bg-[var(--primary)] text-white rounded-3xl font-bold text-[10px] uppercase tracking-[0.5em] shadow-xl hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all"
             >
               Confirmar Estratégia
             </button>
           )}
        </div>

        {/* Radar (Target Board) */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <span className="text-white/30 font-mono text-[9px] uppercase tracking-widest flex items-center gap-2"><Target size={12} /> Radar Inimigo</span>
              {isMyTurn && <span className="animate-pulse text-emerald-500 font-mono text-[9px] uppercase tracking-widest">Sua Vez</span>}
           </div>
           <div className="grid grid-cols-8 gap-2 bg-white/[0.05] p-6 rounded-[2.5rem] border border-white/10">
              {opponentBoard.map((row, r) => row.map((cell, c) => (
                <motion.div
                  key={`${r}-${c}`}
                  whileHover={isMyTurn && cell === 0 ? { scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
                  onClick={() => handleAttack(r, c)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all border cursor-crosshair ${
                    cell === 2 ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/30 font-bold' :
                    cell === 3 ? 'bg-white/5 border-white/5 text-white/10' : 'bg-white/5 border-white/10'
                  }`}
                >
                  {cell === 2 && 'HIT'}
                  {cell === 3 && 'MISS'}
                </motion.div>
              )))}
           </div>
           {gameState === 'playing' && (
              <p className="text-center text-white/20 font-serif italic">Selecione uma coordenada no radar para disparar um sinal de afeto.</p>
           )}
        </div>
      </div>
    </div>
  );
};
