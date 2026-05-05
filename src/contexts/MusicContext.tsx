import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { audioManager } from '../lib/audioManager';

export type LyricLine = {
  time: number;
  text: string;
};

export type TrackSource = 'local' | 'spotify' | 'youtube';

export type Track = {
  id: string;
  title: string;
  artist: string;
  source: TrackSource;
  audioUrl?: string;
  embedUrl?: string;
  lyrics?: LyricLine[];
  themeReactive?: boolean;
};

interface MusicContextType {

  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  setVolume: (v: number) => void;
  seek: (time: number) => void;
  playlist: Track[];
  setPlaylist: (tracks: Track[]) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  currentLyric: string | null;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentLyric, setCurrentLyric] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    
    const audio = audioRef.current;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (currentTrack?.lyrics) {
      // Find the current lyric
      const lyric = currentTrack.lyrics.slice().reverse().find(l => l.time <= currentTime);
      setCurrentLyric(lyric ? lyric.text : null);
    } else {
      setCurrentLyric(null);
    }
  }, [currentTime, currentTrack]);

  const playTrack = (track: Track) => {
    if (!audioRef.current) return;
    
    // Pause current if switching to embed or switching tracks
    if (currentTrack?.id !== track.id) {
      audioRef.current.pause();
      setIsPlaying(false);
      
      setCurrentTrack(track);
      
      if (track.source === 'local' && track.audioUrl) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.load();
      } else {
        // Embed type, we don't play local audio
        audioRef.current.src = '';
      }
    }
    
    if (track.source === 'local') {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log('Audio playback prevented', e));
    } else {
      setIsPlaying(true); // For embeds, we consider it 'playing' in the UI state
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (currentTrack.source !== 'local') {
       setIsPlaying(!isPlaying);
       audioManager.playSound('toggle');
       return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log('Audio playback prevented', e));
    }
    audioManager.playSound('toggle');
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const nextTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    const idx = playlist.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % playlist.length;
    playTrack(playlist[nextIdx]);
  };

  const prevTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    const idx = playlist.findIndex(t => t.id === currentTrack.id);
    const prevIdx = idx === 0 ? playlist.length - 1 : idx - 1;
    playTrack(playlist[prevIdx]);
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      playTrack,
      togglePlayPause,
      setVolume,
      seek,
      playlist,
      setPlaylist,
      nextTrack,
      prevTrack,
      currentLyric
    }}>
      {children}
    </MusicContext.Provider>
  );
};
