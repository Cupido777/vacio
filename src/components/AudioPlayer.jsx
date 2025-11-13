import React, { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { Play, Pause, Volume2, Download, Heart, Share2, AlertCircle } from 'lucide-react';

const AudioPlayer = ({ track }) => {
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    volume,
    togglePlay, 
    seekTo, 
    setAudioVolume 
  } = useAudio();

  const [debugInfo, setDebugInfo] = useState('');
  const [isCurrentTrack, setIsCurrentTrack] = useState(false);

  useEffect(() => {
    const isCurrent = currentTrack?.id === track.id;
    setIsCurrentTrack(isCurrent);
    console.log(`🎵 Track ${track.id} - Es actual: ${isCurrent}, Reproduciendo: ${isPlaying}`);
  }, [currentTrack, track.id, isPlaying]);

  const handlePlayClick = () => {
    console.log('🟢 BOTÓN PLAY CLICKEADO');
    console.log('📋 Información del track:', track);
    console.log('🎯 Estado actual - isPlaying:', isPlaying, 'currentTrack:', currentTrack);
    
    setDebugInfo(`Click en play - Track: ${track.title}`);
    
    // Verificar si togglePlay existe
    if (typeof togglePlay === 'function') {
      console.log('✅ togglePlay es una función, ejecutando...');
      togglePlay(track);
    } else {
      console.error('❌ togglePlay NO es una función:', togglePlay);
      setDebugInfo('ERROR: togglePlay no es una función');
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setAudioVolume(newVolume);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = track.audioUrl;
    link.download = `${track.title.replace(/\s+/g, '_')}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Verificar si el contexto está disponible
  const context = useAudio();
  console.log('🔍 Contexto de audio:', context);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Información del track */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-caribbean font-semibold text-colonial-blue text-lg mb-1">
            {track.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {track.artist} • <span className="text-colonial-coral font-medium">{track.genre}</span>
          </p>
          <div className="flex items-center space-x-2 text-xs">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              ✅ WAV
            </span>
            <span className={`px-2 py-1 rounded ${
              isCurrentTrack ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isCurrentTrack ? '🔊 Track Actual' : '📁 Disponible'}
            </span>
          </div>
        </div>
        <button className="flex items-center space-x-1 text-gray-400 hover:text-colonial-coral transition-colors">
          <Heart className="h-5 w-5" />
          <span className="text-sm">{track.likes}</span>
        </button>
      </div>

      {/* Panel de depuración */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-yellow-800 font-medium text-sm mb-2">🔧 Panel de Depuración</h4>
        <div className="text-yellow-700 text-xs space-y-1">
          <div><strong>Última acción:</strong> {debugInfo || 'Ninguna'}</div>
          <div><strong>Track ID:</strong> {track.id}</div>
          <div><strong>URL Audio:</strong> {track.audioUrl}</div>
          <div><strong>Es track actual:</strong> {isCurrentTrack ? 'Sí' : 'No'}</div>
          <div><strong>Reproduciendo:</strong> {isPlaying ? 'Sí' : 'No'}</div>
        </div>
      </div>

      {/* Controles principales */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePlayClick}
          className={`p-4 rounded-full transition-all duration-200 shadow-lg ${
            isCurrentTrack && isPlaying 
              ? 'bg-colonial-coral text-white hover:bg-red-500' 
              : 'bg-colonial-yellow text-colonial-blue hover:bg-yellow-400'
          }`}
          style={{ transform: 'scale(1)' }}
        >
          {isCurrentTrack && isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </button>

        {/* Barra de progreso - solo si es el track actual */}
        {isCurrentTrack && (
          <div className="flex-1 mx-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Control de volumen */}
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Información de estado */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-blue-700 text-sm space-y-1">
          <div><strong>Estado del Reproductor:</strong></div>
          <div>• Track: {isCurrentTrack ? 'ACTIVO' : 'INACTIVO'}</div>
          <div>• Reproducción: {isPlaying ? 'EN CURSO' : 'DETENIDO'}</div>
          <div>• Tiempo: {formatTime(currentTime)} / {formatTime(duration)}</div>
          <div>• Volumen: {Math.round(volume * 100)}%</div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <button 
          onClick={handleDownload}
          className="flex items-center space-x-2 text-colonial-blue hover:text-colonial-dark-blue transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium">Descargar</span>
        </button>

        <button className="flex items-center space-x-2 text-gray-600 hover:text-colonial-blue transition-colors">
          <Share2 className="h-4 w-4" />
          <span className="text-sm font-medium">Compartir</span>
        </button>
      </div>

      {/* Instrucciones de prueba */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700 text-sm font-medium">🧪 Para probar:</p>
        <p className="text-green-600 text-xs mt-1">
          1. Haz clic en el botón de play (debería cambiar de color)<br/>
          2. Revisa la consola del navegador (F12)<br/>
          3. Verifica los mensajes de depuración arriba
        </p>
      </div>
    </div>
  );
};

export default AudioPlayer;
