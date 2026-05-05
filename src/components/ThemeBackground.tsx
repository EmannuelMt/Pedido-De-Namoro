import React from 'react';
import { motion } from 'motion/react';
import { Heart, Stars, CloudLightning, Sparkles } from 'lucide-react';

interface ThemeBackgroundProps {
  themeMode: string;
  THEMES?: any;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ themeMode, THEMES }) => {
  const currentTheme = THEMES && THEMES[themeMode] ? THEMES[themeMode] : null;
  const category = currentTheme?.category || 'romance';
  const intensity = currentTheme?.intensity || 'balanced';

  const isNature = category === 'nature';
  const isRomance = category === 'romance';
  const isCinema = category === 'cinema' || category === 'classic';
  const isGamer = category === 'gamer' || category === 'music';
  const isDev = category === 'dev' || category === 'corporate';
  const isSpiritual = category === 'spiritual';
  const isExperimental = category === 'experimental';
  const isEmotion = category === 'emotion';

  const particleCountMultiplier = intensity === 'immersive' ? 2 : intensity === 'soft' ? 0.5 : 1;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base Night Layer */}
      {(!isNature || themeMode === 'ocean' || themeMode === 'lavender' || themeMode === 'glacier') && themeMode !== 'paper' && themeMode !== '8bit' && !isDev && <div className="night" />}
      
      {/* Dynamic Ambient Layer per Theme Style */}
      {(themeMode === 'aurora' || themeMode === 'nebula' || themeMode === 'nova' || themeMode === 'etheric') && (
        <div className="absolute inset-0 opacity-40 mix-blend-screen transition-opacity duration-1000">
           <div className="absolute inset-0" style={{
              background: `radial-gradient(circle at 50% 50%, var(--primary-glow) 0%, transparent 60%)`,
              animation: 'pulse 10s infinite alternate'
           }} />
           <motion.div 
             animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
             transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
             className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-30"
           >
             <div className="absolute inset-0" style={{ background: 'var(--primary-gradient)', filter: 'blur(100px)', borderRadius: '50%' }} />
           </motion.div>
        </div>
      )}

      {/* Floating Particles depending on Theme Category */}
      {isRomance && (
        <div className="absolute inset-0 z-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`romance-orb-${i}`}
              initial={{ y: "110%", x: Math.random() * 100 + "%", opacity: 0.1 }}
              animate={{ y: "-10%", opacity: [0.1, 0.4, 0.1], x: (Math.random() * 100) + (Math.random() * 20 - 10) + "%" }}
              transition={{ duration: 15 + Math.random() * 20, repeat: Infinity, ease: "linear", delay: Math.random() * -10 }}
              className="absolute text-[var(--primary)]"
            >
              <Heart size={4 + Math.random() * 12} fill="currentColor" />
            </motion.div>
          ))}
        </div>
      )}

      {isNature && (
        <div className="flowers opacity-80" data-theme-group="natural">
          <div className="flower flower--1">
            <div className="flower__leafs flower__leafs--1">
              <div className="flower__leaf flower__leaf--1"></div><div className="flower__leaf flower__leaf--2"></div>
              <div className="flower__leaf flower__leaf--3"></div><div className="flower__leaf flower__leaf--4"></div>
              <div className="flower__white-circle"></div>
              <div className="flower__light flower__light--1"></div><div className="flower__light flower__light--2"></div>
              <div className="flower__light flower__light--3"></div><div className="flower__light flower__light--4"></div>
              <div className="flower__light flower__light--5"></div><div className="flower__light flower__light--6"></div>
              <div className="flower__light flower__light--7"></div><div className="flower__light flower__light--8"></div>
            </div>
            <div className="flower__line">
              <div className="flower__line__leaf flower__line__leaf--1"></div><div className="flower__line__leaf flower__line__leaf--2"></div>
              <div className="flower__line__leaf flower__line__leaf--3"></div><div className="flower__line__leaf flower__line__leaf--4"></div>
              <div className="flower__line__leaf flower__line__leaf--5"></div><div className="flower__line__leaf flower__line__leaf--6"></div>
            </div>
          </div>

          <div className="flower flower--2">
             <div className="flower__leafs flower__leafs--2">
              <div className="flower__leaf flower__leaf--1"></div><div className="flower__leaf flower__leaf--2"></div>
              <div className="flower__leaf flower__leaf--3"></div><div className="flower__leaf flower__leaf--4"></div>
              <div className="flower__white-circle"></div>
            </div>
            <div className="flower__line">
              <div className="flower__line__leaf flower__line__leaf--1"></div><div className="flower__line__leaf flower__line__leaf--2"></div>
            </div>
          </div>

          <div className="flower flower--3">
            <div className="flower__leafs flower__leafs--3">
              <div className="flower__leaf flower__leaf--1"></div><div className="flower__leaf flower__leaf--2"></div>
              <div className="flower__leaf flower__leaf--3"></div><div className="flower__leaf flower__leaf--4"></div>
              <div className="flower__white-circle"></div>
            </div>
            <div className="flower__line">
              <div className="flower__line__leaf flower__line__leaf--1"></div><div className="flower__line__leaf flower__line__leaf--2"></div>
            </div>
          </div>
          
          {/* Nature petals falling like sakura or leaves */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
             {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`petal-${i}`}
                  initial={{ y: "-10%", x: Math.random() * 100 + "%", opacity: 0.6, rotate: 0 }}
                  animate={{ y: "110%", x: (Math.random() * 100) + (Math.random() * 40 - 20) + "%", rotate: 720 }}
                  transition={{ duration: 15 + Math.random() * 20, repeat: Infinity, ease: "linear", delay: Math.random() * -10 }}
                  className="absolute text-[var(--primary)] mix-blend-screen"
                >
                  <div style={{ width: '8px', height: '12px', borderRadius: '50% 0 50% 0', background: 'currentColor', boxShadow: '0 0 10px var(--primary-glow)' }} />
                </motion.div>
             ))}
          </div>
        </div>
      )}

      {/* Abstract Floating Objects - Active in Romance/Cinema themes */}
      {(isRomance || isCinema || themeMode === 'midnight' || themeMode === 'luxury') && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`firefly-${i}`}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                scale: 0, opacity: 0 
              }}
              animate={{ 
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{ 
                duration: 20 + Math.random() * 20, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
              className="absolute mix-blend-screen"
            >
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[var(--primaryLight)] blur-[1px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-8 md:h-8 rounded-full bg-[var(--primary)] opacity-30 blur-md" />
            </motion.div>
          ))}
        </div>
      )}
      {/* Emotion Effects - Blurry Light Orbs */}
      {isEmotion && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(Math.floor(12 * particleCountMultiplier))].map((_, i) => (
            <motion.div
              key={`emotion-orb-${i}`}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                scale: Math.random() * 2 + 1, opacity: 0 
              }}
              animate={{ 
                x: (Math.random() * 100) + "%",
                y: (Math.random() * 100) + "%",
                opacity: [0, 0.4, 0]
              }}
              transition={{ 
                duration: 15 + Math.random() * 15, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
              className="absolute mix-blend-screen"
            >
              <div className="w-32 h-32 md:w-64 md:h-64 rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Spiritual Effects - Ascending Energy */}
      {isSpiritual && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
          {[...Array(Math.floor(20 * particleCountMultiplier))].map((_, i) => (
            <motion.div
              key={`spiritual-energy-${i}`}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: "120%", 
                opacity: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: "-20%", 
                opacity: [0, 0.8, 0],
              }}
              transition={{ 
                duration: 10 + Math.random() * 20, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 10
              }}
              className="absolute"
            >
               <div className="w-1 h-32 bg-gradient-to-t from-[var(--primaryLight)] to-transparent rounded-full opacity-30" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Gamer Effects - Floating Pixels */}
      {isGamer && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`pixel-${i}`}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: "110%", 
                opacity: 0,
                scale: Math.random() * 2 + 1
              }}
              animate={{ 
                y: "-10%", 
                opacity: [0, 0.5, 0],
                rotate: [0, 90, 180, 270, 360]
              }}
              transition={{ 
                duration: 5 + Math.random() * 10, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute w-2 h-2 bg-[var(--primary)] mix-blend-screen"
            />
          ))}
        </div>
      )}

      {/* Dev Effects - Digital Matrix Streams */}
      {isDev && (
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden font-mono text-[8px] flex justify-around">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`stream-${i}`}
              initial={{ y: "-100%" }}
              animate={{ y: "100%" }}
              transition={{ 
                duration: 8 + Math.random() * 15, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 8
              }}
              className="text-[var(--primary)] flex flex-col items-center"
            >
              {[...Array(40)].map((_, j) => (
                <span key={j}>{Math.round(Math.random())}</span>
              ))}
            </motion.div>
          ))}
        </div>
      )}

      {/* Specific Effects Container */}
      {themeMode === 'volcano' && (
        <div className="absolute inset-0 z-10 overflow-hidden mix-blend-screen opacity-40">
           {[...Array(30)].map((_, i) => (
              <motion.div
                key={`ember-${i}`}
                initial={{ y: '100%', x: Math.random() * 100 + "%", scale: Math.random() }}
                animate={{ y: '-10%', x: (Math.random() * 100) + (Math.random() * 20 - 10) + "%" }}
                transition={{ duration: 5 + Math.random() * 10, repeat: Infinity, ease: 'linear' }}
                className="absolute"
              >
                <div style={{ width: 4 + Math.random() * 6 + 'px', height: 4 + Math.random() * 6 + 'px', backgroundColor: '#f97316', borderRadius: '50%', boxShadow: '0 0 10px #ef4444' }} />
              </motion.div>
           ))}
        </div>
      )}

      {themeMode === 'blueprint' && (
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      )}

      {themeMode === 'cyberpunk' && (
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay opacity-30" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 211, 238, 0.1) 2px, rgba(34, 211, 238, 0.1) 4px)' }} />
      )}

      {themeMode === '8bit' && (
        <div className="absolute inset-0 z-0 opacity-40">
           {[...Array(20)].map((_, i) => (
             <motion.div
                key={`star-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1 + Math.random() * 2, repeat: Infinity, ease: 'linear' }}
                className="absolute bg-white"
                style={{ width: '4px', height: '4px', left: Math.random() * 100 + '%', top: Math.random() * 100 + '%' }}
             />
           ))}
        </div>
      )}

      {themeMode === 'glass' && (
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute inset-0 opacity-80" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #000000 100%)' }} />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 opacity-60 mix-blend-screen"
          >
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(232, 121, 249, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(167, 139, 250, 0.3) 0%, transparent 50%)', filter: 'blur(80px)' }} />
          </motion.div>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[60px]" />
        </div>
      )}

      {themeMode === 'paper' && (
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      )}

      {themeMode === 'glacier' && (
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-100/40 blur-[120px] rounded-full mix-blend-overlay pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[80%] h-[80%] bg-sky-200/40 blur-[120px] rounded-full mix-blend-overlay pointer-events-none" />
        </div>
      )}

      {themeMode === 'etheric' && (
         <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      )}
    </div>
  );
};
