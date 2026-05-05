export type SoundTheme = 'modern' | 'retro' | 'organic' | 'sci_fi' | 'romantic' | 'nature' | 'sci_fi_tech' | 'retro_gamer' | 'cinema';
export type SoundAction = 'click' | 'success' | 'error' | 'toggle' | 'slider' | 'feedback' | 'win' | 'lose' | 'data_sync';

interface AudioSettings {
  enabled: boolean;
  theme: SoundTheme;
  volume: number;
  autoSync: boolean;
}

export const defaultAudioSettings: AudioSettings = {
  enabled: true,
  theme: 'modern',
  volume: 0.5,
  autoSync: true,
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private settings: AudioSettings = { ...defaultAudioSettings };
  private ambienceNode: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private currentAmbienceTheme: SoundTheme | null = null;

  constructor() {
    this.loadSettings();
  }

  public getSettings() {
    return this.settings;
  }

  public setSettings(newSettings: Partial<AudioSettings>) {
    const themeChanged = newSettings.theme && newSettings.theme !== this.settings.theme;
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();

    if (themeChanged && this.settings.enabled) {
      this.updateAmbience();
    }
  }

  private loadSettings() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('audioSettings');
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (err) {
      console.error('Failed to load audio settings', err);
    }
  }

  private saveSettings() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('audioSettings', JSON.stringify(this.settings));
    } catch (err) {
      console.error('Failed to save audio settings', err);
    }
  }

  private getContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public stopAmbience() {
    if (this.ambienceNode) {
      this.ambienceNode.gain.setTargetAtTime(0, this.ctx?.currentTime || 0, 0.1);
      setTimeout(() => {
        if (this.ambienceNode) {
          this.ambienceNode.disconnect();
          this.ambienceNode = null;
          this.currentAmbienceTheme = null;
        }
      }, 200);
    }
  }

  public stopAll() {
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.oscillators = [];
    if (this.ambienceNode) {
      this.ambienceNode.gain.setTargetAtTime(0, this.ctx?.currentTime || 0, 0.1);
      setTimeout(() => {
        if (this.ambienceNode) {
          this.ambienceNode.disconnect();
          this.ambienceNode = null;
          this.currentAmbienceTheme = null;
        }
      }, 200);
    }
  }

  private updateAmbience() {
    if (!this.settings.enabled) {
      this.stopAll();
      return;
    }
    this.playAmbience(this.settings.theme);
  }

  public playAmbience(theme: SoundTheme) {
    if (this.currentAmbienceTheme === theme) return;
    this.stopAll();
    
    const context = this.getContext();
    if (!context) return;
    this.currentAmbienceTheme = theme;
    this.ambienceNode = context.createGain();
    this.ambienceNode.connect(context.destination);
    this.ambienceNode.gain.setValueAtTime(0, context.currentTime);
    this.ambienceNode.gain.linearRampToValueAtTime(this.settings.volume * 0.15, context.currentTime + 2);

    const now = context.currentTime;

    switch (theme) {
      case 'nature':
      case 'organic':
        // Wind/Water simulation using noise
        this.createWindEffect(context, this.ambienceNode);
        break;
      case 'romantic':
        // Soft constant pads
        this.createPadEffect(context, this.ambienceNode, [261.63, 329.63, 392.00]); // C major triad soft
        break;
      case 'sci_fi_tech':
      case 'sci_fi':
        // Electronic hum
        this.createHumEffect(context, this.ambienceNode);
        break;
      case 'retro_gamer':
      case 'retro':
        // Arpeggiated 8-bit background
        this.create8BitArp(context, this.ambienceNode);
        break;
      case 'cinema':
        // Film projector sound simulation
        this.createProjectorEffect(context, this.ambienceNode);
        break;
    }
  }

  private createWindEffect(ctx: AudioContext, dest: AudioNode) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(200, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(dest);

    lfo.start();
    noise.start();
    this.oscillators.push(lfo as any); // Track LFO
  }

  private createHumEffect(ctx: AudioContext, dest: AudioNode) {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, ctx.currentTime);
    osc.connect(filter);
    filter.connect(dest);
    osc.start();
    this.oscillators.push(osc);
  }

  private createPadEffect(ctx: AudioContext, dest: AudioNode, freqs: number[]) {
    freqs.forEach(f => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.connect(g);
      g.connect(dest);
      osc.start();
      this.oscillators.push(osc);
    });
  }

  private create8BitArp(ctx: AudioContext, dest: AudioNode) {
    const osc = ctx.createOscillator();
    osc.type = 'square';
    const freqs = [440, 523.25, 659.25, 783.99]; // A, C, E, G
    let i = 0;
    const interval = setInterval(() => {
      if (this.currentAmbienceTheme !== 'retro_gamer' && this.currentAmbienceTheme !== 'retro') {
        clearInterval(interval);
        return;
      }
      osc.frequency.setTargetAtTime(freqs[i % freqs.length], ctx.currentTime, 0.05);
      i++;
    }, 200);
    osc.connect(dest);
    osc.start();
    this.oscillators.push(osc);
  }

  private createProjectorEffect(ctx: AudioContext, dest: AudioNode) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(20, ctx.currentTime);
    const g = ctx.createGain();
    const lfo = ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(4, ctx.currentTime);
    lfo.connect(g.gain);
    osc.connect(g);
    g.connect(dest);
    osc.start();
    lfo.start();
    this.oscillators.push(osc, lfo);
  }

  public playSound(action: SoundAction = 'click', previewTheme?: SoundTheme, previewVolume?: number) {
    if (typeof window === 'undefined') return;
    if (!this.settings.enabled && previewVolume === undefined) return;
    
    const context = this.getContext();
    if (!context) return;
    
    const theme = previewTheme || this.settings.theme;
    const volume = previewVolume ?? this.settings.volume;
    const now = context.currentTime;

    const playTone = (type: OscillatorType, freq: number | number[], duration: number, vol = volume) => {
      const osc = context.createOscillator();
      const gainNode = context.createGain();
      osc.type = type;
      osc.connect(gainNode);
      gainNode.connect(context.destination);
      
      gainNode.gain.setValueAtTime(0, now);
      
      if (Array.isArray(freq)) {
         osc.frequency.setValueAtTime(freq[0], now);
         if (freq.length > 1) {
            osc.frequency.exponentialRampToValueAtTime(freq[1], now + duration * 0.5);
         }
      } else {
        osc.frequency.setValueAtTime(freq, now);
      }
      
      gainNode.gain.linearRampToValueAtTime(vol * 0.5, now + duration * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
      
      osc.start(now);
      osc.stop(now + duration);
    };

    const playSequence = (type: OscillatorType, freqs: {f: number, t: number, vol?: number}[], duration: number) => {
        const osc = context.createOscillator();
        const gainNode = context.createGain();
        osc.type = type;
        osc.connect(gainNode);
        gainNode.connect(context.destination);
        gainNode.gain.setValueAtTime(0, now);
        
        freqs.forEach(fq => {
            osc.frequency.setValueAtTime(fq.f, now + fq.t);
            gainNode.gain.setValueAtTime(fq.vol ?? volume, now + fq.t);
        });
        
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        osc.start(now);
        osc.stop(now + duration);
    }

    // --- Specialized Themes implementation ---
    switch (theme) {
      case 'nature':
      case 'organic':
        if (action === 'click') playTone('sine', [400, 200], 0.1, volume);
        if (action === 'error') playTone('triangle', 100, 0.3, volume * 1.5);
        if (action === 'success' || action === 'feedback') {
            // Wind Shimmer
            for(let i=0; i<3; i++) {
                playTone('sine', [800 + i*400, 1200 + i*400], 1.2, volume * 0.2);
            }
        }
        break;
      case 'romantic':
        if (action === 'click') {
             // Paper/Pen sound (noise burst)
             const filter = context.createBiquadFilter();
             filter.type = 'lowpass';
             filter.frequency.setValueAtTime(1000, now);
             const noise = context.createBufferSource();
             const buffer = context.createBuffer(1, context.sampleRate * 0.05, context.sampleRate);
             for(let i=0; i<buffer.length; i++) buffer.getChannelData(0)[i] = Math.random() * 2 - 1;
             noise.buffer = buffer;
             const g = context.createGain();
             g.gain.setValueAtTime(volume * 0.5, now);
             g.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
             noise.connect(filter);
             filter.connect(g);
             g.connect(context.destination);
             noise.start(now);
        }
        if (action === 'error') playTone('sine', [200, 150], 0.3, volume * 1.2);
        if (action === 'success' || action === 'feedback' || action === 'data_sync') {
             // Sweet Chimes
             [880, 1108, 1318, 1760].forEach((f, i) => {
                 playTone('sine', f, 1.0, volume * (0.3 - i*0.05));
             });
        }
        break;
      case 'sci_fi_tech':
      case 'sci_fi':
        if (action === 'click') playTone('square', [1200, 1000], 0.04, volume * 0.3); // Mech Keyboard
        if (action === 'error') playTone('sawtooth', [400, 200], 0.2, volume * 0.6);
        if (action === 'success' || action === 'data_sync') {
            // Fast data transmission pulses
            for(let i=0; i<5; i++) {
                playTone('sawtooth', 2000 + i*200, 0.05, volume * 0.2);
            }
        }
        break;
      case 'retro_gamer':
      case 'retro':
        if (action === 'click') playTone('square', [600, 800], 0.08, volume * 0.4); // Blip
        if (action === 'error') playTone('sawtooth', [200, 100], 0.3, volume * 0.5);
        if (action === 'win') playSequence('square', [{f: 523.25, t: 0}, {f: 659.25, t: 0.1}, {f: 783.99, t: 0.2}, {f: 1046.50, t: 0.3}], 0.6);
        if (action === 'lose') {
             // Sad trombone
             playTone('sawtooth', [440, 330], 0.4, volume);
             setTimeout(() => playTone('sawtooth', [330, 220], 0.6, volume), 400);
        }
        if (action === 'success' || action === 'feedback') playTone('square', [800, 1200], 0.2, volume);
        break;
      case 'cinema':
        if (action === 'click') playTone('triangle', [100, 50], 0.05, volume); // Clapperboard-ish
        if (action === 'error') playTone('sawtooth', [150, 100], 0.5, volume);
        if (action === 'success' || action === 'feedback') {
            // BRAAM
            const osc = context.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 1.5);
            const f = context.createBiquadFilter();
            f.type = 'lowpass';
            f.frequency.setValueAtTime(400, now);
            f.frequency.exponentialRampToValueAtTime(100, now + 1.5);
            const g = context.createGain();
            g.gain.setValueAtTime(volume * 2, now);
            g.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
            osc.connect(f);
            f.connect(g);
            g.connect(context.destination);
            osc.start(now);
            osc.stop(now + 2.0);
        }
        break;
      default:
        // Modern/Default
        if (action === 'click') playTone('sine', [800, 300], 0.05, volume * 0.8);
        if (action === 'success') playSequence('sine', [{f: 600, t: 0}, {f: 900, t: 0.1}], 0.4);
        break;
    }
  }

  public getThemeByVisualTheme(visualTheme: string): SoundTheme {
    const map: Record<string, SoundTheme> = {
      // Nature
      sage_garden: 'nature', deep_basalt: 'nature', warm_clay: 'nature', morning_mist: 'nature',
      forest: 'nature', sand: 'nature', matcha: 'nature', volcano: 'nature', glacier: 'nature',
      // Romance
      petal_soft: 'romantic', eternal_gold: 'romantic', moonlight_date: 'romantic', sweet_velvet: 'romantic',
      cherry: 'romantic', lavender: 'romantic', sunset: 'romantic',
      // Cinema
      golden_age: 'cinema', technicolor: 'cinema', directors_cut: 'cinema', scifi_odyssey: 'cinema',
      ocean: 'cinema', gold: 'cinema', paper: 'cinema',
      // Gamer
      mushroom_kingdom: 'retro_gamer', spike_planted: 'retro_gamer', global_offensive: 'retro_gamer', arcade_classic: 'retro_gamer', blue_blur: 'retro_gamer',
      '8bit': 'retro_gamer', cyberpunk: 'retro_gamer',
      // Dev
      code_midnight: 'sci_fi_tech', transita_tech: 'sci_fi_tech', matrix_terminal: 'sci_fi_tech', compiler_light: 'sci_fi_tech',
      midnight: 'sci_fi_tech', blueprint: 'sci_fi_tech', glass: 'sci_fi_tech', luxury: 'sci_fi_tech'
    };
    return map[visualTheme] || 'modern';
  }
}

export const audioManager = new AudioManager();
