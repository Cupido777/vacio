import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ExhibitionCard from '../exhibition/ExhibitionCard';
import ExhibitionFilters from '../exhibition/ExhibitionFilters';
import exhibitionService from '../../services/exhibitionService';

const Gallery = ({ currentUser }) => {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: '',
    sortBy: 'newest'
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Cargar exposiciones al montar el componente
  useEffect(() => {
    loadExhibitions();
  }, [filters]);

  const loadExhibitions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await exhibitionService.getExhibitions(filters);
      setExhibitions(data.exhibitions || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading exhibitions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Exposiciones filtradas y ordenadas
  const filteredExhibitions = useMemo(() => {
    let filtered = [...exhibitions];

    // Aplicar filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(exhibition =>
        exhibition.title.toLowerCase().includes(searchLower) ||
        exhibition.description.toLowerCase().includes(searchLower) ||
        exhibition.curator_name.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar ordenamiento
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [exhibitions, filters]);

  const handleExhibitionClick = (exhibitionId) => {
    navigate(`/exhibition/${exhibitionId}`);
  };

  const handleCreateExhibition = () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para crear una exposición');
      return;
    }
    navigate('/create-exhibition');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRefresh = () => {
    loadExhibitions();
  };

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const total = exhibitions.length;
    const virtual = exhibitions.filter(e => e.exhibition_type === 'virtual').length;
    const physical = exhibitions.filter(e => e.exhibition_type === 'physical').length;
    const hybrid = exhibitions.filter(e => e.exhibition_type === 'hybrid').length;
    const active = exhibitions.filter(e => e.status === 'active').length;

    return { total, virtual, physical, hybrid, active };
  }, [exhibitions]);

  if (loading && exhibitions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Galería de Exposiciones
              </h1>
              <p className="text-gray-600 max-w-2xl">
                Descubre exposiciones de arte virtuales, presenciales e híbridas 
                de artistas emergentes y consolidados.
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              {/* Botón de actualizar */}
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Actualizar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              {/* Selector de vista */}
              <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-cartagena-yellow text-white' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Vista de cuadrícula"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-cartagena-yellow text-white' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Vista de lista"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Botón crear exposición */}
              {currentUser && (
                <button
                  onClick={handleCreateExhibition}
                  className="bg-cartagena-yellow text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Crear Exposición</span>
                </button>
              )}
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{stats.virtual}</div>
              <div className="text-sm text-gray-500">Virtuales</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{stats.physical}</div>
              <div className="text-sm text-gray-500">Presenciales</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">{stats.hybrid}</div>
              <div className="text-sm text-gray-500">Híbridas</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-cartagena-yellow">{stats.active}</div>
              <div className="text-sm text-gray-500">Activas</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <ExhibitionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            currentUser={currentUser}
          />
        </div>

        {/* Contenido de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* Grid de exposiciones */}
        {filteredExhibitions.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredExhibitions.map(exhibition => (
              <ExhibitionCard
                key={exhibition.id}
                exhibition={exhibition}
                viewMode={viewMode}
                onClick={() => handleExhibitionClick(exhibition.id)}
                currentUser={currentUser}
              />
            ))}
          </div>
        ) : (
          // Estado vacío
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron exposiciones
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {filters.search 
                ? `No hay resultados para "${filters.search}". Intenta con otros términos.`
                : 'No hay exposiciones disponibles con los filtros seleccionados.'
              }
            </p>
            {(filters.search || filters.type !== 'all' || filters.status !== 'all') && (
              <button
                onClick={() => setFilters({
                  type: 'all',
                  status: 'all',
                  search: '',
                  sortBy: 'newest'
                })}
                className="bg-cartagena-yellow text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Loading adicional para nuevas cargas */}
        {loading && exhibitions.length > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-cartagena-yellow border-t-transparent"></div>
              <span>Cargando más exposiciones...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
