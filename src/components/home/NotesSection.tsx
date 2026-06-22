import React from 'react';
import { motion } from 'motion/react';
import { Shuffle, Sparkle, Heart, Compass, Lock, Pin } from 'lucide-react';

interface NotesSectionProps {
  handleRandomMessage: () => void;
  randomLoveMessage: string | null;
  setRandomLoveMessage: (msg: string | null) => void;
  activeNote: number | null;
  setActiveNote: (id: number | null) => void;
}

export function NotesSection({ 
  handleRandomMessage, 
  randomLoveMessage, 
  setRandomLoveMessage, 
  activeNote, 
  setActiveNote 
}: NotesSectionProps) {
  
  const staticNotes = [
    {
      id: 1,
      title: 'Cuidado',
      color: 'bg-rose-400',
      accent: 'text-black',
      icon: Sparkle,
      date: '2024 Archive',
      text: '"Prometo escutar as tuas músicas prediletas e preparar aquele café cremoso do seu jeitinho favorito."'
    },
    {
      id: 2,
      title: 'Compromisso',
      color: 'bg-amber-400',
      accent: 'text-black',
      icon: Heart,
      date: 'Eterno',
      text: '"Sei que nem tudo é perfeito, mas prometo lutar todos os dias para dar a você o melhor suporte do mundo."'
    },
    {
      id: 3,
      title: 'Aventura',
      color: 'bg-cyan-400',
      accent: 'text-black',
      icon: Compass,
      date: 'Global',
      text: '"Mais paradas doces, sorvetes de chocolate belga e caminhadas longas sem rumo por ruas ensolaradas."'
    },
    {
      id: 4,
      title: 'Confiança',
      color: 'bg-emerald-400',
      accent: 'text-black',
      icon: Lock,
      date: 'Privado',
      text: '"Este é o nosso porto seguro, altamente encriptado contra a chatice. Um relicário do amor sincero."'
    }
  ];

  return (
    <section className="space-y-16 pt-24 border-t-[4px] border-black max-w-7xl mx-auto select-none relative">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-10">
        <div className="space-y-6">
          <motion.span 
             initial={{ opacity: 0, x: -10 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="font-sans text-[11px] uppercase font-black tracking-[0.3em] text-black flex items-center gap-4 bg-amber-400 border-[3px] border-black w-fit px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_#000]"
          >
            <Pin className="w-5 h-5 fill-white" strokeWidth={3} />
            Mural Interativo
          </motion.span>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-black leading-none uppercase">
            Bilhetes <br/> <span className="bg-white px-3 border-[4px] border-black inline-block mt-2">Doces</span>
          </h2>
          <p className="font-sans text-xl text-black/60 font-bold max-w-2xl leading-tight">
            Pequenas promessas adormecidas que ganham vida a cada vez que você recorda o quanto é especial.
          </p>
        </div>
        
        <button 
          onClick={handleRandomMessage}
          className="group font-sans text-xs font-black uppercase tracking-widest text-black py-6 px-12 bg-white border-[4px] border-black hover:bg-stone-50 transition-all rounded-3xl shadow-[8px_8px_0px_0px_#000] flex items-center gap-4 w-fit hover:-translate-y-1 active:translate-y-1 active:shadow-none"
        >
          <Shuffle className="w-6 h-6 text-black group-hover:rotate-180 transition-transform duration-700" strokeWidth={3} />
          Sorteio de Carinho
        </button>
      </div>

      {/* Drawing Overlay */}
      {randomLoveMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white border-[6px] border-black p-12 md:p-16 rounded-[4rem] shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative z-40 max-w-2xl mx-auto text-left my-12 group overflow-hidden"
        >
          <button 
            className="absolute top-8 right-8 text-black hover:scale-110 transition-transform text-4xl font-black" 
            onClick={() => setRandomLoveMessage(null)}
          >
            &times;
          </button>
          
          <div className="text-center space-y-10 relative z-10">
            <span className="text-7xl block animate-bounce">✨</span>
            <div className="bg-stone-100 p-12 rounded-[3.5rem] border-[4px] border-black shadow-[8px_8px_0px_0px_#000]">
              <p className="font-sans text-2xl md:text-3xl text-black font-black leading-tight tracking-tighter uppercase">
                "{randomLoveMessage}"
              </p>
            </div>
            <div className="text-[12px] uppercase tracking-[0.4em] font-black text-black/30 pt-6">Assinado: O seu grande amor</div>
          </div>
        </motion.div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pt-4">
        {staticNotes.map((note) => (
          <motion.div 
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => setActiveNote(note.id)}
            onMouseLeave={() => setActiveNote(null)}
            className={`${note.color} border-[4px] border-black p-10 shadow-[10px_10px_0px_0px_#000] hover:-translate-y-3 transition-all duration-500 relative rounded-[2.5rem] group cursor-pointer flex flex-col h-full`}
          >
            <div className="flex justify-between items-center pb-8 border-b-[3px] border-black/10">
              <span className="font-sans text-[11px] font-black text-black uppercase tracking-widest leading-none">
                {note.title}
              </span>
              <note.icon 
                className={`w-7 h-7 ${note.accent} transition-all duration-500 ${
                  activeNote === note.id ? 'scale-125' : 'opacity-40'
                }`}
                strokeWidth={3} 
              />
            </div>

            <div className="flex-1 py-10">
              <p className="font-sans text-xl text-black font-black leading-tight tracking-tighter uppercase">
                {note.text}
              </p>
            </div>

            <div className="pt-8 mt-auto flex items-center justify-between border-t-[3px] border-black/10">
              <div className="font-sans text-[11px] font-black text-black/30 uppercase tracking-widest">
                {note.date}
              </div>
              <div className="w-4 h-4 rounded-full bg-black border-[2.5px] border-white group-hover:bg-amber-400 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
