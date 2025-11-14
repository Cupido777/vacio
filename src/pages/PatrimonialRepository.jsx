import React, { useState, useEffect } from 'react';
import { patrimonialService } from '../services/patrimonialService';
import AudioUploader from '../components/patrimonial/AudioUploader';

const PatrimonialRepository = () => {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    cultural_manifestation: '',
    neighborhood: '',
    search: ''
  });

  // Cargar audios al montar el componente y cuando cambien los filtros
  useEffect(() => {
    loadAudios();
  }, [filters]);

  const loadAudios = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await patrimonialService.getAudios(filters);
      
      if (error) throw error;
      setAudios(data || []);
    } catch (err) {
      console.error('Error cargando audios:', err);
      setError('Error al cargar los audios patrimoniales');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAudioUpload = async (file, metadata) => {
    try {
      setError(null);
      const { data, error } = await patrimonialService.uploadAudio(file, metadata);
      
      if (error) throw error;
      
      // Recargar la lista después de subir
      await loadAudios();
      return { success: true, data };
    } catch (err) {
      console.error('Error subiendo audio:', err);
      setError('Error al subir el audio');
      return { success: false, error: err };
    }
  };

  const handleSearch = (e) => {
    handleFilterChange('search', e.target.value);
  };

  // Filtrar audios por búsqueda local (ya que el servicio no tiene búsqueda)
  const filteredAudios = audios.filter(audio => {
    if (!filters.search) return true;
    
    const searchTerm = filters.search.toLowerCase();
    return (
      audio.title?.toLowerCase().includes(searchTerm) ||
      audio.description?.toLowerCase().includes(searchTerm) ||
      audio.author?.toLowerCase().includes(searchTerm) ||
      audio.neighborhood?.toLowerCase().includes(searchTerm)
    );
  });

  // Obtener opciones únicas para filtros
  const culturalManifestations = [...new Set(audios.map(audio => audio.cultural_manifestation).filter(Boolean))];
  const neighborhoods = [...new Set(audios.map(audio => audio.neighborhood).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-cartagena-yellow mb-4">
            Repositorio Patrimonial Sonoro
          </h1>
          <p className="text-xl text-cartagena-blue max-w-3xl mx-auto">
            Preserva y explora las tradiciones musicales vivas de Cartagena de Indias
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Título, autor, descripción..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
              />
            </div>

            {/* Filtro por manifestación cultural */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manifestación Cultural
              </label>
              <select
                value={filters.cultural_manifestation}
                onChange={(e) => handleFilterChange('cultural_manifestation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
              >
                <option value="">Todas</option>
                {culturalManifestations.map(manifestation => (
                  <option key={manifestation} value={manifestation}>
                    {manifestation}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por barrio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barrio
              </label>
              <select
                value={filters.neighborhood}
                onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
              >
                <option value="">Todos</option>
                {neighborhoods.map(neighborhood => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>

            {/* Contador de resultados */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                {filteredAudios.length} {filteredAudios.length === 1 ? 'audio' : 'audios'} encontrados
              </div>
            </div>
          </div>
        </div>

        {/* Componente de Subida */}
        <div className="mb-8">
          <AudioUploader onUpload={handleAudioUpload} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cartagena-yellow"></div>
          </div>
        )}

        {/* Grid de Audios */}
        {!loading && filteredAudios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredAudios.map((audio) => (
              <div key={audio.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  {/* Header de la tarjeta */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {audio.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cartagena-blue text-white">
                      {audio.cultural_manifestation}
                    </span>
                  </div>

                  {/* Información del audio */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {audio.author}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {audio.neighborhood}
                    </div>
                    {audio.recording_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(audio.recording_date).toLocaleDateString('es-CO')}
                      </div>
                    )}
                  </div>

                  {/* Descripción */}
                  {audio.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {audio.description}
                    </p>
                  )}

                  {/* Reproductor de audio básico */}
                  <div className="mt-4">
                    <audio
                      controls
                      className="w-full h-8"
                      src={`${supabase.storage.from('patrimonial_audios').getPublicUrl(audio.audio_url).data.publicUrl}`}
                    >
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </div>

                  {/* Derechos */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{audio.rights_type}</span>
                      <span>{new Date(audio.created_at).toLocaleDateString('es-CO')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado vacío */}
        {!loading && filteredAudios.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {audios.length === 0 ? 'El repositorio está vacío' : 'No se encontraron resultados'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {audios.length === 0 
                ? 'Sé el primero en contribuir al patrimonio sonoro de Cartagena subiendo una grabación.'
                : 'Prueba con otros filtros o términos de búsqueda.'
              }
            </p>
            {audios.length === 0 && (
              <button
                onClick={() => document.querySelector('details')?.setAttribute('open', 'true')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cartagena-yellow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cartagena-yellow"
              >
                Subir primera grabación
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatrimonialRepository;
