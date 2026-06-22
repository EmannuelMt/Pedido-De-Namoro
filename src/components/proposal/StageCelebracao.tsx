import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Confetti from 'react-confetti';
import { Heart, Calendar, Clock, Image as ImageIcon, Camera, Upload, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { useNavigate } from 'react-router-dom';

interface TimeCounter {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const StageCelebracao: React.FC = () => {
  const { profile, updateProfileFields } = useAuthStore();
  const navigate = useNavigate();

  // Load state from profile fields or set smart defaults
  const [anniversaryDate, setAnniversaryDate] = useState<string>(
    profile?.localizacao || '2026-06-18' // We will repurpose metadata fields if standard profile doesn't have custom ones, or store directly. Let's send in updateProfileFields!
  );
  
  const [couplePhoto, setCouplePhoto] = useState<string | undefined>(
    profile?.banner || undefined // Repurposing banner or saving custom key
  );

  const [counter, setCounter] = useState<TimeCounter>({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isSaved, setIsSaved] = useState(false);

  // Sync window size for Confetti canvas size
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save changes to Firestore
  const saveCompletedProposal = async (dateStr: string, photoStr?: string) => {
    setIsSaved(true);
    try {
      await updateProfileFields({
        localizacao: dateStr, // Safe standard fields or dynamic fields in setDoc
        banner: photoStr || profile?.banner || "",
        cargo: "Parceiro do Coração",
        bio: "Vivendo uma linda jornada no Cantinho do Universo ❤️"
      });
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      console.error(e);
      setIsSaved(false);
    }
  };

  // Drag and drop photo upload
  const handlePhotoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCouplePhoto(reader.result);
        saveCompletedProposal(anniversaryDate, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setAnniversaryDate(newDate);
    saveCompletedProposal(newDate, couplePhoto);
  };

  // Dynamic ticking counter
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const start = new Date(anniversaryDate + 'T00:00:00');
      
      let diffMs = now.getTime() - start.getTime();
      if (isNaN(diffMs) || diffMs < 0) {
        setCounter({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Calculation of detailed dates breakdown
      const diffSecs = Math.floor(diffMs / 1000) % 60;
      const diffMins = Math.floor(diffMs / (1000 * 60)) % 60;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
      
      // Approximate Years/Months/Days calculation securely
      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();

      if (days < 0) {
        months--;
        const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += previousMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      setCounter({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours: diffHrs,
        minutes: diffMins,
        seconds: diffSecs
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  return (
    <div className="absolute inset-0 w-full h-full min-h-screen bg-[#fffcf5] overflow-y-auto py-12 px-4 select-none flex flex-col justify-between z-10">
      
      {/* Heavy celebration rainbow confetti bursts */}
      <Confetti 
        width={windowSize.width} 
        height={windowSize.height} 
        numberOfPieces={350} 
        recycle={true}
        colors={['#f43f5e', '#ec4899', '#f59e0b', '#fb923c', '#e11d48']}
      />

      <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Header element */}
      <div className="max-w-4xl mx-auto text-center z-10 space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.25, 1], rotate: [0, -10, 360] }}
          transition={{ duration: 1.2 }}
          className="w-20 h-20 bg-rose-500 border-3 border-black rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000]"
        >
          <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
        </motion.div>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-150 border-2 border-black rounded-full text-rose-600 text-[10px] font-black uppercase tracking-widest font-mono shadow-[2px_2px_0px_#000]">
            💍 COMPROMISSO FIRMADO
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#1a1a1a] tracking-tight">
            Pedido Aceito! ❤️
          </h1>
          <p className="text-base md:text-xl font-serif italic text-stone-600 max-w-xl mx-auto">
            "Agora a nossa linda história ganhou o seu capítulo definitivo e oficial."
          </p>
        </div>
      </div>

      {/* Main Grid: Counter & Custom Couple Photo Upload */}
      <div className="w-full max-w-5xl mx-auto z-10 grid grid-cols-1 md:grid-cols-2 gap-8 my-auto py-8 px-4 items-center">
        
        {/* Left pane: Counter box */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border-3 border-black p-6 rounded-[28px] shadow-[6px_6px_0px_#000] space-y-6"
        >
          <div className="flex justify-between items-center pb-4 border-b-2 border-dashed border-stone-200">
            <span className="text-xs font-mono font-black text-stone-800 uppercase tracking-widest flex items-center gap-1.5">
              <Clock size={15} className="text-rose-500" /> CONTADOR DO AMOR
            </span>
            <span className="text-[10px] font-mono text-stone-400">Tempo correndo...</span>
          </div>

          {/* Time digits view */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { value: counter.years, label: 'anos' },
              { value: counter.months, label: 'meses' },
              { value: counter.days, label: 'dias' },
              { value: counter.hours, label: 'horas' },
              { value: counter.minutes, label: 'min' },
              { value: counter.seconds, label: 'seg' }
            ].map((unit, idx) => (
              <div key={idx} className="bg-stone-50 border-2 border-black p-3.5 rounded-2xl shadow-[2px_2px_0px_#000] relative overflow-hidden group">
                <span className="text-2xl md:text-3xl font-black text-stone-900 block font-mono">{String(unit.value).padStart(2, '0')}</span>
                <span className="text-[9px] text-[#e84e4e] font-mono font-black uppercase tracking-wider block mt-1">{unit.label}</span>
              </div>
            ))}
          </div>

          {/* Date Selector input setting */}
          <div className="bg-amber-50 border-2 border-black p-4 rounded-2xl space-y-3 shadow-inner">
            <label className="text-[10px] font-mono font-black text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={13} /> Data de Início da nossa união:
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={anniversaryDate}
                onChange={handleInputChange}
                className="w-full bg-white border-2 border-black px-4 py-2 text-xs font-mono font-black uppercase rounded-xl shadow-[2px_2px_0px_#000] outline-none cursor-pointer hover:bg-stone-50 text-stone-900"
              />
              <button 
                onClick={() => saveCompletedProposal(anniversaryDate, couplePhoto)}
                className="bg-stone-900 text-white border-2 border-black px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wide flex items-center gap-1 hover:bg-black active:translate-y-0.5 shadow-[2px_2px_0px_#000]"
              >
                {isSaved ? <Check size={12} className="text-green-400 stroke-[3px]" /> : 'Salvar'}
              </button>
            </div>
            <span className="text-[9px] text-stone-400 font-sans block">Define a data para os cálculos cronológicos.</span>
          </div>
        </motion.div>

        {/* Right pane: Couple Photo Frame */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border-3 border-black p-5 pb-8 rounded-sm shadow-[8px_8px_0px_#000] rotate-2 max-w-sm mx-auto w-full group relative hover:rotate-0 transition-transform"
        >
          {/* Couple Photo Drag Drop Area */}
          <div 
            className="w-full aspect-square border-2 border-black bg-stone-100 relative overflow-hidden group/img"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handlePhotoUpload(file);
            }}
          >
            {couplePhoto ? (
              <img 
                src={couplePhoto} 
                alt="Primeira foto do casal" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-500 bg-gradient-to-tr from-rose-100 via-stone-50 to-amber-100">
                <ImageIcon className="w-12 h-12 stroke-[1.2] text-[#e84e4e] mb-2" />
                <h4 className="text-sm font-black text-stone-800 uppercase tracking-tight">Primeira Foto do Casal</h4>
                <p className="text-[10px] text-stone-400 font-sans mt-1 leading-normal max-w-[180px]">Arraste uma foto linda de vocês aqui ou clique para selecionar</p>
              </div>
            )}

            {/* Custom file input overlay trigger */}
            <label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-200">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(file);
                }} 
              />
              <Upload size={24} className="text-white mb-2" />
              <span className="text-white text-[9px] font-black uppercase tracking-widest bg-black/70 px-2.5 py-1 rounded inline-block">ATUALIZAR FOTO</span>
            </label>
          </div>

          {/* Bottom frame caption text */}
          <div className="mt-5 text-center space-y-1 relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-500 border border-black text-white text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              NOSSO BRILHO 🌟
            </span>
            <p className="text-xl font-handwriting italic font-serif text-stone-950 pt-2.5 select-none leading-none">
              "Para sempre, do nosso jeitinho."
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom final trigger redirect button */}
      <div className="z-10 text-center select-none mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-3 px-10 py-5 bg-stone-900 hover:bg-stone-800 text-white border-2 border-black font-black uppercase text-[12px] tracking-widest rounded-2xl shadow-[6px_6px_0px_#e84e4e] hover:shadow-[3px_3px_0px_#e84e4e] hover:translate-y-[3px] hover:translate-x-[3px] transition-all cursor-pointer animate-pulse"
        >
          ENTRAR NO CANTINHO DO UNIVERSO <ArrowRight className="w-4 h-4 text-rose-500" />
        </motion.button>
      </div>
    </div>
  );
};
