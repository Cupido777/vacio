import React, { useState, useEffect, useMemo, useCallback } from 'react';
import HeritageCard from './HeritageCard';
import { patrimonialService } from '../../services/patrimonialService';

// Hook personalizado para debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const HeritageList = ({ currentUser, initialFilters = {}, onHeritageSelect }) => {
  const [heritages, setHeritages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    heritage_type: '',
    neighborhood: '',
    status: '',
    recognition_level: '',
    search: '',
    ...initialFilters
  });

  // Debounce para búsqueda (300ms)
  const debouncedSearch = useDebounce(filters.search, 300);

  // Cargar patrimonios con optimización
  useEffect(() => {
    loadHeritages();
  }, [debouncedSearch, filters.heritage_type, filters.neighborhood, filters.status, filters.recognition_level]);

  const loadHeritages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await patrimonialService.getHeritages({
        search: debouncedSearch,
        heritage_type: filters.heritage_type,
        neighborhood: filters.neighborhood,
        status: filters.status,
        recognition_level: filters.recognition_level
      });
      
      if (error) throw error;
      setHeritages(data || []);
    } catch (err) {
      console.error('Error cargando patrimonios:', err);
      setError('Error al cargar el patrimonio cultural');
    } finally {
      setLoading(false);
    }
  };

  // Handler optimizado para filtros
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleSearch = useCallback((e) => {
    handleFilterChange('search', e.target.value);
  }, [handleFilterChange]);

  // Datos memoizados para filtros
  const filterOptions = useMemo(() => {
    const heritageTypes = [...new Set(heritages.map(h => h.heritage_type).filter(Boolean))];
    const neighborhoods = [...new Set(heritages.map(h => h.neighborhood).filter(Boolean))];
    const statuses = [...new Set(heritages.map(h => h.status).filter(Boolean))];
    const recognitionLevels = [...new Set(heritages.map(h => h.recognition_level).filter(Boolean))];

    return {
      heritageTypes,
      neighborhoods,
      statuses,
      recognitionLevels
    };
  }, [heritages]);

  // Patrimonios filtrados memoizados
  const filteredHeritages = useMemo(() => {
    return heritages.filter(heritage => {
      // La búsqueda principal ya se hace en el servidor con debouncedSearch
      // Aquí solo filtros adicionales si son necesarios
      return true;
    });
  }, [heritages]);

  // Estadísticas memoizadas
  const stats = useMemo(() => {
    const total = heritages.length;
    const byType = heritages.reduce((acc, heritage) => {
      acc[heritage.heritage_type] = (acc[heritage.heritage_type] || 0) + 1;
      return acc;
    }, {});
    
    const endangered = heritages.filter(h => h.status === 'endangered').length;
    const withMedia = heritages.filter(h => 
      (h.audio_count || 0) > 0 || 
      (h.video_count || 0) > 0 || 
      (h.photo_count || 0) > 0
    ).length;

    return {
      total,
      byType,
      endangered,
      withMedia,
      percentageWithMedia: total > 0 ? Math.round((withMedia / total) * 100) : 0
    };
  }, [heritages]);

  // Handler para selección de patrimonio
  const handleHeritageSelect = useCallback((heritage) => {
    if (onHeritageSelect) {
      onHeritageSelect(heritage);
    }
  }, [onHeritageSelect]);

  // Renderizado de skeleton loading optimizado
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Búsqueda */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Buscar Patrimonio
            </label>
            <input
              type="text"
              placeholder="Nombre, descripción, ubicación..."
              value={filters.search}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent transition-colors"
              aria-label="Buscar en el patrimonio cultural"
            />
          </div>

          {/* Tipo de Patrimonio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏛️ Tipo
            </label>
            <select
              value={filters.heritage_type}
              onChange={(e) => handleFilterChange('heritage_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent transition-colors"
            >
              <option value="">Todos los tipos</option>
              {filterOptions.heritageTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Barrio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 Barrio
            </label>
            <select
              value={filters.neighborhood}
              onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent transition-colors"
            >
              <option value="">Todos los barrios</option>
              {filterOptions.neighborhoods.map(neighborhood => (
                <option key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent transition-colors"
            >
              <option value="">Todos los estados</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'active' ? '🟢 Activo' : 
                   status === 'endangered' ? '🔴 En Riesgo' : 
                   status === 'preserved' ? '🔵 Preservado' : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros secundarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nivel de Reconocimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏆 Reconocimiento
            </label>
            <select
              value={filters.recognition_level}
              onChange={(e) => handleFilterChange('recognition_level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent transition-colors"
            >
              <option value="">Todos los niveles</option>
              {filterOptions.recognitionLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'national' ? '🇨🇴 Nacional' : 
                   level === 'regional' ? '🏙️ Regional' : 
                   level === 'local' ? '🏘️ Local' : level}
                </option>
              ))}
            </select>
          </div>

          {/* Contador de resultados */}
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-cartagena-blue">{filteredHeritages.length}</span>{" "}
              {filteredHeritages.length === 1 ? 'elemento' : 'elementos'} patrimoniales
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-end justify-end space-x-3">
            <button
              onClick={loadHeritages}
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cartagena-yellow disabled:opacity-50 transition-colors"
              aria-label="Actualizar lista"
            >
              <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      {!loading && heritages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-cartagena-blue">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Patrimonios</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {stats.percentageWithMedia}%
            </div>
            <div className="text-sm text-gray-600">Con Multimedia</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{stats.endangered}</div>
            <div className="text-sm text-gray-600">En Riesgo</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {stats.byType.musical || 0}
            </div>
            <div className="text-sm text-gray-600">Musicales</div>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
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

      {/* Loading State */}
      {loading && renderSkeletons()}

      {/* Grid de Patrimonios */}
      {!loading && filteredHeritages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHeritages.map((heritage) => (
            <HeritageCard
              key={heritage.id}
              heritage={heritage}
              currentUser={currentUser}
              onSelect={handleHeritageSelect}
            />
          ))}
        </div>
      )}

      {/* Estado vacío */}
      {!loading && filteredHeritages.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {heritages.length === 0 ? 'No hay patrimonios registrados' : 'No se encontraron resultados'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {heritages.length === 0 
              ? 'Comienza registrando el primer elemento del patrimonio cultural de Cartagena.'
              : 'Prueba ajustando los filtros o términos de búsqueda.'
            }
          </p>
          {heritages.length === 0 && currentUser && (
            <button
              onClick={() => window.location.href = '/patrimonio/nuevo'}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-cartagena-yellow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cartagena-yellow transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Registrar Primer Patrimonio
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(HeritageList);
