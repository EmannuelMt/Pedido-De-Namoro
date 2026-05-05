import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Music } from 'lucide-react';
import { audioManager, SoundTheme, defaultAudioSettings } from '../lib/audioManager';
import { motion } from 'motion/react';

export const AudioSettings: React.FC = () => {
  const [settings, setSettings] = useState(defaultAudioSettings);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setSettings(audioManager.getSettings());
  }, []);

  const handleToggle = () => {
    const newEnabled = !settings.enabled;
    setSettings(prev => ({ ...prev, enabled: newEnabled }));
    audioManager.setSettings({ enabled: newEnabled });
    if (newEnabled) {
      audioManager.playAmbience(settings.theme);
      audioManager.playSound('success', settings.theme, settings.volume);
    } else {
      audioManager.stopAll();
    }
  };

  const handleAutoSyncToggle = () => {
    const newAutoSync = !settings.autoSync;
    setSettings(prev => ({ ...prev, autoSync: newAutoSync }));
    audioManager.setSettings({ autoSync: newAutoSync });
    audioManager.playSound('toggle', settings.theme, settings.volume);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setSettings(prev => ({ ...prev, volume: newVolume }));
    audioManager.setSettings({ volume: newVolume });
  };

  const handleVolumeChangeComplete = () => {
    audioManager.playSound('slider', settings.theme, settings.volume);
  };

  const handleThemeChange = (theme: SoundTheme) => {
    setSettings(prev => ({ ...prev, theme: theme, autoSync: false }));
    audioManager.setSettings({ theme: theme, autoSync: false });
    handlePreview(theme);
  };

  const handlePreview = (theme?: SoundTheme) => {
    setIsPlaying(true);
    audioManager.playSound('feedback', theme || settings.theme, settings.volume);
    setTimeout(() => setIsPlaying(false), 500);
  };

  const themes: { value: SoundTheme, label: string }[] = [
    { value: 'nature', label: '🌿 Natureza' },
    { value: 'romantic', label: '💖 Romântico' },
    { value: 'sci_fi_tech', label: '💻 Dev / Sci-Fi' },
    { value: 'retro_gamer', label: '🎮 Retrô Gamer' },
    { value: 'cinema', label: '🎞️ Cinema' },
    { value: 'modern', label: '✨ Minimal' },
  ];

  return (
    <div className="luxury-card p-6 rounded-3xl border border-white/5 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/50 transition-colors">
            <Music size={18} className={settings.enabled ? "text-[var(--primary)]" : ""} />
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">Sintonia Sonora v3.0</p>
            <p className="text-white/30 text-[10px] italic">Experiência multissensorial ativa</p>
          </div>
        </div>
        <button 
          onClick={handleToggle}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${settings.enabled ? 'bg-[var(--primary)]' : 'bg-white/10'}`}
        >
          <motion.div 
            className="absolute top-1 bottom-1 w-4 bg-white rounded-full shadow-md"
            animate={{ left: settings.enabled ? 'calc(100% - 1.25rem)' : '0.25rem' }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      {settings.enabled && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6 pt-4 border-t border-white/5"
        >
          {/* Auto Sync Toggle */}
          <div className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                <Music size={14} />
              </div>
              <div>
                <p className="text-white text-[11px] font-medium font-mono uppercase tracking-wider">Sincronia Automática</p>
                <p className="text-white/30 text-[8px]">Acompanha o tema visual</p>
              </div>
            </div>
            <button 
              onClick={handleAutoSyncToggle}
              className={`relative w-8 h-4 rounded-full transition-colors duration-300 ${settings.autoSync ? 'bg-[var(--primary)]' : 'bg-white/10'}`}
            >
              <motion.div 
                className="absolute top-0.5 bottom-0.5 w-3 bg-white rounded-full shadow-md"
                animate={{ left: settings.autoSync ? 'calc(100% - 0.9rem)' : '0.1rem' }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-white/50">
              <span className="flex items-center gap-2"><VolumeX size={14}/></span>
              <span className="flex items-center gap-2"><Volume2 size={14}/></span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={settings.volume}
              onChange={handleVolumeChange}
              onMouseUp={handleVolumeChangeComplete}
              onTouchEnd={handleVolumeChangeComplete}
              className="w-full h-1 bg-white/10 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer accent-[var(--primary)]"
            />
          </div>

          {/* Theme Selector */}
          <div className="space-y-3">
             <div className="flex items-center justify-between text-xs text-white/50 mb-2">
               <span>Padrão Sonoro</span>
               <div className="relative">
                 <button 
                   onClick={() => handlePreview()} 
                   className={`p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center z-10 relative ${isPlaying ? 'text-[var(--primary)] scale-110' : ''}`}
                   title="Testar Som Atual"
                 >
                   <Play size={12} className={isPlaying ? 'fill-current' : ''} />
                 </button>
                 {isPlaying && (
                   <>
                     <motion.div 
                       initial={{ opacity: 0.5, scale: 1 }}
                       animate={{ opacity: 0, scale: 2 }}
                       transition={{ duration: 0.5 }}
                       className="absolute inset-0 rounded-full border border-[var(--primary)] pointer-events-none"
                     />
                     <motion.div 
                       initial={{ opacity: 0.5, scale: 1 }}
                       animate={{ opacity: 0, scale: 2.5 }}
                       transition={{ duration: 0.5, delay: 0.1 }}
                       className="absolute inset-0 rounded-full border border-[var(--primary)] pointer-events-none"
                     />
                   </>
                 )}
               </div>
             </div>
             <div className="grid grid-cols-2 gap-2">
               {themes.map((t) => (
                 <button
                   key={t.value}
                   onClick={() => handleThemeChange(t.value)}
                   className={`px-3 py-2 text-[11px] rounded-xl border transition-all flex items-center justify-center ${settings.theme === t.value ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-white' : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10'}`}
                 >
                   {t.label}
                 </button>
               ))}
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
