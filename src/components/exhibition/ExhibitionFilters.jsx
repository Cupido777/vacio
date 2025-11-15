import React, { useState, useEffect } from 'react';

const ExhibitionFilters = ({ filters, onFiltersChange, stats }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Actualizar filtros locales cuando cambien los props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      type: '',
      dateRange: '',
      search: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return Object.values(localFilters).some(value => 
      value !== '' && value !== null && value !== undefined
    );
  };

  const filterOptions = {
    status: [
      { value: '', label: 'Todos los estados' },
      { value: 'active', label: 'Activas', count: stats?.active || 0 },
      { value: 'upcoming', label: 'Próximas', count: stats?.upcoming || 0 },
      { value: 'completed', label: 'Completadas', count: stats?.completed || 0 },
      { value: 'draft', label: 'Borradores', count: stats?.draft || 0 }
    ],
    type: [
      { value: '', label: 'Todos los tipos' },
      { value: 'virtual', label: 'Virtual', count: stats?.virtual || 0 },
      { value: 'physical', label: 'Presencial', count: stats?.physical || 0 },
      { value: 'hybrid', label: 'Híbrida', count: stats?.hybrid || 0 }
    ],
    dateRange: [
      { value: '', label: 'Todas las fechas' },
      { value: 'current', label: 'En curso' },
      { value: 'upcoming', label: 'Próximas' },
      { value: 'past', label: 'Pasadas' },
      { value: 'this_month', label: 'Este mes' },
      { value: 'this_year', label: 'Este año' }
    ]
  };

  const getFilterBadges = () => {
    const badges = [];
    
    if (localFilters.status) {
      const statusOption = filterOptions.status.find(opt => opt.value === localFilters.status);
      badges.push({
        key: 'status',
        label: `Estado: ${statusOption?.label}`,
        value: localFilters.status
      });
    }
    
    if (localFilters.type) {
      const typeOption = filterOptions.type.find(opt => opt.value === localFilters.type);
      badges.push({
        key: 'type', 
        label: `Tipo: ${typeOption?.label}`,
        value: localFilters.type
      });
    }
    
    if (localFilters.dateRange) {
      const dateOption = filterOptions.dateRange.find(opt => opt.value === localFilters.dateRange);
      badges.push({
        key: 'dateRange',
        label: `Fecha: ${dateOption?.label}`,
        value: localFilters.dateRange
      });
    }
    
    if (localFilters.search) {
      badges.push({
        key: 'search',
        label: `Búsqueda: "${localFilters.search}"`,
        value: localFilters.search
      });
    }

    return badges;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      {/* Header de filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filtrar Exposiciones</h3>
            <p className="text-sm text-gray-600 mt-1">
              Encuentra exposiciones por estado, tipo y fecha
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Contador de resultados */}
            {stats?.total !== undefined && (
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {stats.total} {stats.total === 1 ? 'exposición' : 'exposiciones'}
              </div>
            )}
            
            {/* Botón expandir/contraer */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden flex items-center space-x-1 text-sm text-cartagena-blue hover:text-blue-700 transition-colors"
            >
              <span>{isExpanded ? 'Menos filtros' : 'Más filtros'}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Badges de filtros activos */}
        {hasActiveFilters() && (
          <div className="mt-4 flex flex-wrap gap-2">
            {getFilterBadges().map(badge => (
              <span 
                key={badge.key}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-cartagena-blue text-white"
              >
                {badge.label}
                <button
                  onClick={() => handleFilterChange(badge.key, '')}
                  className="ml-2 hover:text-blue-200 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
            
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Limpiar todos
            </button>
          </div>
        )}
      </div>

      {/* Filtros principales - Siempre visibles en desktop, expandibles en mobile */}
      <div className={`p-6 space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Buscar exposiciones
          </label>
          <input
            type="text"
            placeholder="Título, descripción, ubicación..."
            value={localFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
          />
        </div>

        {/* Filtros en grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Estado
            </label>
            <select
              value={localFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
            >
              {filterOptions.status.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count > 0 ? `(${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎨 Tipo
            </label>
            <select
              value={localFilters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
            >
              {filterOptions.type.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count > 0 ? `(${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Fecha
            </label>
            <select
              value={localFilters.dateRange || ''}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
            >
              {filterOptions.dateRange.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros avanzados (solo cuando está expandido) */}
        {isExpanded && (
          <div className="pt-4 border-t border-gray-200 space-y-4">
            <h4 className="font-medium text-gray-900">Filtros Avanzados</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro por curador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👤 Curador
                </label>
                <select
                  value={localFilters.curator || ''}
                  onChange={(e) => handleFilterChange('curator', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
                >
                  <option value="">Todos los curadores</option>
                  <option value="current_user">Mis exposiciones</option>
                  {/* Aquí se podrían cargar curadores desde la API */}
                </select>
              </div>

              {/* Filtro por ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 Ubicación
                </label>
                <select
                  value={localFilters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
                >
                  <option value="">Todas las ubicaciones</option>
                  <option value="virtual">Solo virtuales</option>
                  <option value="physical">Solo presenciales</option>
                  <option value="cartagena">Cartagena</option>
                  {/* Más ubicaciones se pueden cargar desde la API */}
                </select>
              </div>
            </div>

            {/* Rango de fechas personalizado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha desde
                </label>
                <input
                  type="date"
                  value={localFilters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha hasta
                </label>
                <input
                  type="date"
                  value={localFilters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Acciones de filtros */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-cartagena-blue hover:text-blue-700 transition-colors"
          >
            {isExpanded ? '← Menos opciones' : 'Más opciones de filtro →'}
          </button>

          {hasActiveFilters() && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExhibitionFilters;
