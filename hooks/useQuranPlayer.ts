import { useState, useRef, useEffect } from 'react';
import { Surah, Reciter } from '@/data/quranData';
import { logger } from '@/lib/logger';

export const useQuranPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [currentReciter, setCurrentReciter] = useState<Reciter | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setIsLoading(false);
    });
    
    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });
    
    return () => {
      audio.pause();
      audio.remove();
    };
  }, []);

  const loadSurah = async (surah: Surah, reciter: Reciter) => {
    if (!audioRef.current) {
      logger.error('Audio element not initialized');
      setError('Audio player not ready. Please refresh the page.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setCurrentSurah(surah);
    setCurrentReciter(reciter);
    setProgress(0);
    
    // Pause any currently playing audio
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    try {
      // Format surah number with leading zeros (001, 002, etc.)
      const surahNumber = surah.number.toString().padStart(3, '0');
      
      logger.info(`Loading Surah ${surahNumber} with reciter ${reciter.name}`);
      
      // Build the edge function URL with proper project reference
      const functionUrl = `https://enevjiodbmngnkwkwuud.supabase.co/functions/v1/quran-audio-proxy?surah=${surahNumber}&reciter=${encodeURIComponent(reciter.subdirectory)}`;
      
      logger.info('Fetching audio through proxy:', functionUrl);
      
      // Reset audio element completely
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      
      // Set new source
      audioRef.current.src = functionUrl;
      
      // Set preload for better mobile performance
      audioRef.current.preload = 'metadata';
      
      // Wait for audio to be ready
      await new Promise((resolve, reject) => {
        const audio = audioRef.current!;
        let timeoutId: number;
        
        const handleCanPlay = () => {
          logger.info('Audio loaded successfully and ready to play');
          cleanup();
          resolve(true);
        };
        
        const handleError = (e: Event) => {
          const error = (e.target as HTMLAudioElement).error;
          logger.error('Audio loading error:', {
            code: error?.code,
            message: error?.message,
          });
          cleanup();
          
          // Provide helpful error messages based on error code
          let errorMessage = 'Failed to load audio';
          if (error?.code === 2) {
            errorMessage = 'Network error - please check your internet connection';
          } else if (error?.code === 4) {
            errorMessage = 'Audio format not supported on this device';
          }
          
          reject(new Error(errorMessage));
        };
        
        const cleanup = () => {
          clearTimeout(timeoutId);
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
        };
        
        audio.addEventListener('canplay', handleCanPlay, { once: true });
        audio.addEventListener('error', handleError, { once: true });
        
        audio.load();
        
        // Timeout after 45 seconds (longer for mobile/slower connections)
        timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error('Audio loading timeout - please check your internet connection and try again'));
        }, 45000) as unknown as number;
      });
      
      setIsLoading(false);
      logger.info('Audio ready to play - user can now press play');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load audio';
      logger.error('Load surah error:', err);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const play = async () => {
    if (!audioRef.current || !currentSurah) {
      logger.warn('Cannot play: audio not ready');
      setError('Please select a Surah to play');
      return;
    }
    
    setUserInteracted(true);
    
    try {
      // Mobile browsers require user interaction - this should now work
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        logger.info('Playback started');
      }
    } catch (err) {
      logger.error('Play error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to play audio';
      
      // Provide helpful mobile-specific error messages
      if (errorMsg.includes('NotAllowedError') || errorMsg.includes('user interaction')) {
        setError('Please tap the play button to start audio playback');
      } else {
        setError('Failed to play audio. Please check your connection and try again.');
      }
      setIsPlaying(false);
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
    logger.info('Playback paused');
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const changeVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = clampedVolume;
    setVolume(clampedVolume);
  };

  return {
    isPlaying,
    currentSurah,
    currentReciter,
    progress,
    duration,
    volume,
    isLoading,
    error,
    userInteracted,
    loadSurah,
    togglePlayPause,
    seek,
    changeVolume,
  };
};
