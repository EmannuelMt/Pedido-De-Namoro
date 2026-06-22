import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCheck, Play, ArrowRight, RotateCcw } from 'lucide-react';

interface StageProps {
  onNext: () => void;
}

interface Message {
  sender: 'me' | 'you';
  text: string;
  time: string;
}

const CONVERSATION: Message[] = [
  { sender: 'me', text: 'Oi! Tudo bem? Achei seu perfil super legal por aqui... 😊', time: '14:20' },
  { sender: 'you', text: 'Oieee! Tudo sim, e com você? Muito obrigada pelo elogio! Que fofo! 🌸', time: '14:22' },
  { sender: 'me', text: 'Tudo ótimo também! Estava reparando aqui... você também gosta de animes e lofi?', time: '14:23' },
  { sender: 'you', text: 'Simmm! Copo de café, fone de ouvido ouvindo Lofi de tarde é o meu paraíso portátil! ☕🎧', time: '14:25' },
  { sender: 'me', text: 'Nossa, acabei de achar a minha pessoa favorita do universo inteiro agora mesmo! Hahaha', time: '14:26' },
  { sender: 'you', text: 'Hahaha paraaa bobo! Mas admito que já adorei o seu humor. Conta mais... 👀❤️', time: '14:28' }
];

export const StageChat: React.FC<StageProps> = ({ onNext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on updates
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (currentIndex < CONVERSATION.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, CONVERSATION[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const handleReplay = () => {
    setMessages([]);
    setCurrentIndex(0);
    setIsTyping(false);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#f1f3f9] overflow-y-auto py-12 px-4 select-none flex flex-col justify-between" id="stage-chat">
      <div className="absolute inset-0 bg-[#e5e9f0]/40 bg-[radial-gradient(#a3be8c_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

      {/* Header Info */}
      <div className="z-10 text-center max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#88c0d0]/20 border-2 border-black rounded-full text-sky-800 text-[10px] font-black uppercase tracking-widest font-mono shadow-[2px_2px_0px_#000]">
          💬 ETAPA 02 — PRIMEIRA CONVERSA
        </span>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-800 mt-2 font-sans">
          Estética: Chat Memories
        </h2>
      </div>

      {/* Smartphone mockup */}
      <div className="w-full max-w-md mx-auto my-auto z-10 px-1">
        <div className="border-[4px] border-black bg-white rounded-[32px] overflow-hidden shadow-[8px_8px_0px_#2e2e2e] flex flex-col h-[460px]">
          
          {/* Phone Top Notch bar */}
          <div className="bg-[#2e2e2e] text-white/90 text-[10px] px-6 py-2.5 flex justify-between items-center font-mono border-b-2 border-black">
            <span>{messages[messages.length - 1]?.time || '14:20'}</span>
            <div className="w-16 h-4 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1" />
            <div className="flex gap-1 items-center">
              <span>LTE</span>
              <div className="w-5 h-2.5 border border-white rounded-sm p-0.5"><div className="w-full h-full bg-green-400 rounded-sm" /></div>
            </div>
          </div>

          {/* Chat User Header */}
          <div className="bg-[#eceff4] border-b-[3px] border-black p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border-2 border-black bg-[#ff7b89] flex items-center justify-center text-md shadow-[1px_1px_0px_#000]">
                🌸
              </div>
              <div>
                <div className="text-xs font-black uppercase text-slate-800 leading-none">Minha Pessoa Favorita</div>
                <div className="text-[9px] font-bold text-green-500 uppercase tracking-widest mt-0.5">Online e Digitando...</div>
              </div>
            </div>
            
            <button 
              onClick={handleReplay} 
              className="p-1.5 border-2 border-black rounded-lg hover:bg-slate-200 text-slate-700 hover:text-black transition-colors"
              title="Reiniciar chat"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Messages view body */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-[#f8fafc] max-h-[320px] scrollbar-thin">
            <AnimatePresence>
              {messages.map((msg, index) => {
                const isMe = msg.sender === 'me';
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl border-2 border-black px-3.5 py-2 text-[12px] font-sans font-semibold shadow-[2px_2px_0px_rgba(0,0,0,0.15)] leading-relaxed ${
                      isMe 
                        ? 'bg-[#e5e9f0] text-black rounded-tr-none' 
                        : 'bg-[#ffccd5] text-black rounded-tl-none'
                    }`}>
                      <p>{msg.text}</p>
                      <div className="text-[8px] font-mono opacity-60 text-right mt-1 flex items-center justify-end gap-1 select-none">
                        <span>{msg.time}</span>
                        {isMe && <CheckCheck size={10} className="text-blue-500" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#ffccd5] border-2 border-black rounded-2xl rounded-tl-none px-4 py-2 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Fake chat input bottom tray */}
          <div className="bg-white border-t-2 border-black p-3.5 flex gap-2 items-center">
            <div className="flex-grow bg-slate-100 border-2 border-black px-3.5 py-2 rounded-xl text-xs text-stone-400 text-left select-none">
              Início da nossa sintonia...
            </div>
            <button className="p-2.5 bg-cyan-400 hover:bg-cyan-500 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-transform">
              <Send size={14} className="text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Button to go to Polaroid Gallery */}
      <div className="z-10 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-black text-white border-2 border-black font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-[4px_4px_0px_#ffccd5] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          DESBRAVAR MURAL DE FOTOS <ArrowRight className="w-4 h-4 text-rose-300" />
        </motion.button>
      </div>
    </div>
  );
};
