import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const AudioContext = createContext();

// Custom hook for audio context with error boundary
export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('❌ useAudio se usó fuera del AudioProvider');
    }
    return {
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
      audioTracks: [],
      togglePlay: () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('AudioContext no disponible');
        }
      },
      seekTo: () => {},
      setAudioVolume: () => {}
    };
  }
  return context;
}

// Audio validation utilities
const validateAudioUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const allowedProtocols = ['https:', 'http:', 'data:'];
  const allowedExtensions = ['.wav', '.mp3', '.ogg', '.m4a', '.aac'];
  
  try {
    const urlObj = new URL(url, window.location.origin);
    if (!allowedProtocols.includes(urlObj.protocol)) return false;
    
    const extension = urlObj.pathname.toLowerCase().substring(urlObj.pathname.lastIndexOf('.'));
    return allowedExtensions.includes(extension);
  } catch {
    return url.startsWith('/audio/') || url.startsWith('./audio/');
  }
};

const sanitizeTrackData = (track) => {
  if (!track || typeof track !== 'object') return null;
  
  const sanitized = {
    id: Number(track.id) || Date.now(),
    title: String(track.title || 'Sin título').substring(0, 100),
    artist: String(track.artist || 'Artista desconocido').substring(0, 100),
    genre: String(track.genre || 'Tradicional').substring(0, 50),
    audioUrl: validateAudioUrl(track.audioUrl) ? track.audioUrl : '',
    duration: String(track.duration || '0:00'),
    likes: Math.max(0, Number(track.likes) || 0),
    description: String(track.description || '').substring(0, 200)
  };
  
  return sanitized.audioUrl ? sanitized : null;
};

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState(null);

  // Datos de audio sanitizados y validados
  const audioTracks = React.useMemo(() => [
    sanitizeTrackData({
      id: 1,
      title: 'Bullerengue Sentao',
      artist: 'Cantadoras de La Boquilla',
      genre: 'Bullerengue',
      audioUrl: '/audio/bullerengue-sample.wav',
      duration: '4:20',
      likes: 12,
      description: 'Bullerengue tradicional con tambores y cantos'
    })
  ].filter(Boolean), []);

  // Safe audio operations
  const safeAudioOperation = useCallback((operation) => {
    try {
      if (!audioRef.current) {
        throw new Error('Audio element not initialized');
      }
      return operation(audioRef.current);
    } catch (err) {
      console.error('Audio operation failed:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // Función para pausar el track - DECLARADA ANTES de ser usada
  const pauseTrack = useCallback(() => {
    safeAudioOperation(audio => {
      console.log('⏸️ Pausando audio');
      audio.pause();
    });
    setIsPlaying(false);
  }, [safeAudioOperation]);

  // Función para reproducir track - DECLARADA ANTES de ser usada
  const playTrack = useCallback(async (track) => {
    try {
      if (!track) throw new Error('No track provided');
      
      const sanitizedTrack = sanitizeTrackData(track);
      if (!sanitizedTrack) throw new Error('Invalid track data');

      console.log('🎵 Intentando reproducir track:', sanitizedTrack.title);
      
      // Validar URL de audio antes de proceder
      if (!validateAudioUrl(sanitizedTrack.audioUrl)) {
        throw new Error('Invalid audio URL format');
      }

      // Si ya está reproduciendo el mismo track, pausar
      if (currentTrack?.id === sanitizedTrack.id && isPlaying) {
        console.log('⏸️ Pausando track actual');
        pauseTrack();
        return;
      }

      // Si es un track diferente, cambiar la fuente
      if (currentTrack?.id !== sanitizedTrack.id) {
        console.log('🔄 Cambiando a nuevo track');
        
        await safeAudioOperation(audio => {
          audio.pause();
          audio.currentTime = 0;
        });

        setCurrentTrack(sanitizedTrack);
        
        await safeAudioOperation(audio => {
          audio.src = sanitizedTrack.audioUrl;
        });

        console.log('📁 Cargando audio:', sanitizedTrack.audioUrl);
        
        // Esperar a que el audio se cargue con timeout
        await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Audio loading timeout'));
          }, 10000); // 10 second timeout

          const handleLoad = () => {
            clearTimeout(timeoutId);
            audioRef.current.removeEventListener('canplaythrough', handleLoad);
            audioRef.current.removeEventListener('error', handleError);
            console.log('✅ Audio cargado correctamente');
            resolve();
          };
          
          const handleError = (e) => {
            clearTimeout(timeoutId);
            audioRef.current.removeEventListener('canplaythrough', handleLoad);
            audioRef.current.removeEventListener('error', handleError);
            console.error('❌ Error cargando audio:', e);
            reject(new Error(`Audio load failed: ${e.message}`));
          };
          
          audioRef.current.addEventListener('canplaythrough', handleLoad);
          audioRef.current.addEventListener('error', handleError);
          audioRef.current.load();
        });
      }

      // Reproducir el audio con verificación de estado
      console.log('▶️ Iniciando reproducción...');
      await safeAudioOperation(audio => audio.play());
      setIsPlaying(true);
      setError(null);
      console.log('🔊 Audio reproduciéndose correctamente');

    } catch (error) {
      console.error('❌ Error al reproducir:', error);
      setIsPlaying(false);
      setError(error.message);
    }
  }, [currentTrack?.id, isPlaying, pauseTrack, safeAudioOperation]);

  // Inicializar el elemento de audio con cleanup seguro
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('🎵 Inicializando AudioContext...');
    
    try {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
      audioRef.current.volume = volume;
      audioRef.current.crossOrigin = 'anonymous';

      const audio = audioRef.current;
      const eventHandlers = [];

      const addSafeEventListener = (event, handler) => {
        audio.addEventListener(event, handler);
        eventHandlers.push({ event, handler });
      };

      addSafeEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      addSafeEventListener('loadedmetadata', () => {
        if (isFinite(audio.duration)) {
          setDuration(audio.duration);
        }
      });
      addSafeEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      addSafeEventListener('canplay', () => {
        setError(null);
      });
      addSafeEventListener('error', (e) => {
        console.error('❌ Error de audio:', audio.error);
        setError(`Error de audio: ${audio.error?.message || 'Unknown error'}`);
        setIsPlaying(false);
      });

      return () => {
        console.log('🧹 Limpiando AudioContext...');
        eventHandlers.forEach(({ event, handler }) => {
          audio.removeEventListener(event, handler);
        });
        
        safeAudioOperation(audio => {
          audio.pause();
          audio.src = '';
          audio.load();
        });
      };
    } catch (err) {
      console.error('Failed to initialize audio context:', err);
      setError('Failed to initialize audio');
    }
  }, [safeAudioOperation, volume]);

  // Efecto para volumen con validación
  useEffect(() => {
    const safeVolume = Math.max(0, Math.min(1, volume));
    setVolume(safeVolume);
    
    safeAudioOperation(audio => {
      audio.volume = safeVolume;
    });
  }, [volume, safeAudioOperation]);

  const togglePlay = useCallback((track) => {
    if (!track) {
      console.warn('No track provided to togglePlay');
      return;
    }

    const sanitizedTrack = sanitizeTrackData(track);
    if (!sanitizedTrack) {
      setError('Invalid track data');
      return;
    }

    console.log('🔄 togglePlay llamado con track:', sanitizedTrack.title);
    
    if (isPlaying && currentTrack?.id === sanitizedTrack.id) {
      pauseTrack();
    } else {
      playTrack(sanitizedTrack);
    }
  }, [isPlaying, currentTrack?.id, pauseTrack, playTrack]);

  const seekTo = useCallback((time) => {
    const safeTime = Math.max(0, Math.min(duration, Number(time) || 0));
    safeAudioOperation(audio => {
      audio.currentTime = safeTime;
    });
    setCurrentTime(safeTime);
  }, [duration, safeAudioOperation]);

  const setAudioVolume = useCallback((newVolume) => {
    const safeVolume = Math.max(0, Math.min(1, Number(newVolume) || 0.7));
    setVolume(safeVolume);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = React.useMemo(() => ({
    // Estado
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    audioTracks,
    error,
    
    // Acciones
    playTrack,
    pauseTrack,
    togglePlay,
    seekTo,
    setAudioVolume,
    clearError
  }), [
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    audioTracks,
    error,
    playTrack,
    pauseTrack,
    togglePlay,
    seekTo,
    setAudioVolume,
    clearError
  ]);

  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 AudioContext proporcionado con valor:', value);
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}
