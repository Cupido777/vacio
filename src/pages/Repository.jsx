import React, { useState } from 'react';
import { useAudio } from '../contexts/AudioContext';
import AudioPlayer from '../components/AudioPlayer';
import { Play, Download, Search, Filter, Music } from 'lucide-react';

const Repository = () => {
  const { audioTracks } = useAudio();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const genres = ['Cumbia', 'Bullerengue', 'Champeta', 'Porro', 'Mapalé', 'Vallenato'];

  const filteredData = audioTracks.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedGenre === '' || item.genre === selectedGenre)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-traditional text-colonial-blue text-center mb-2">
        Patrimonio Sonoro
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        Repositorio digital de ritmos, cantos y tradiciones musicales de Cartagena
      </p>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar en el patrimonio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-colonial-yellow"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-colonial-yellow appearance-none"
            >
              <option value="">Todos los géneros</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reproductor principal */}
      {filteredData.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-traditional text-colonial-blue mb-4 text-center">
            Reproductor de Audio - Bullerengue
          </h2>
          <div className="max-w-2xl mx-auto">
            <AudioPlayer track={filteredData[0]} />
          </div>
        </div>
      )}

      {/* Grid de tarjetas de audio */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-40 bg-gradient-to-r from-colonial-blue to-colonial-coral relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-4 left-4 bg-colonial-yellow text-colonial-blue px-3 py-1 rounded-full text-sm font-caribbean font-semibold">
                {item.genre}
              </div>
              <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full">
                <Music className="h-6 w-6" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-caribbean font-semibold text-colonial-blue mb-2 text-lg">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{item.description}</p>
              
              <div className="space-y-2 text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                  <Music className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span>{item.artist} • {item.duration}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs bg-colonial-sand text-colonial-blue px-2 py-1 rounded font-medium">
                  WAV
                </span>
                <button 
                  className="text-colonial-blue hover:text-colonial-coral transition-colors duration-200"
                  title="Descargar"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron resultados para tu búsqueda.</p>
        </div>
      )}

      {/* Información de depuración */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-caribbean text-colonial-blue mb-2">Información de Depuración:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Archivo de audio: <code>public/audio/bullerengue-sample.wav</code></li>
          <li>• Formato: WAV (compatible universal)</li>
          <li>• Estado del reproductor: Centralizado en AudioContext</li>
          <li>• Verifica la consola del navegador (F12) para logs detallados</li>
        </ul>
      </div>
    </div>
  );
};

export default Repository;
