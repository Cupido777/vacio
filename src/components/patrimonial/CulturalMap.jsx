import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { patrimonialService } from '../../services/patrimonialService';

// Coordenadas aproximadas de barrios de Cartagena
const CARTAGENA_NEIGHBORHOODS = {
  'Getsemaní': { lat: 10.4236, lng: -75.5493, color: '#D4AF37' },
  'Centro': { lat: 10.4233, lng: -75.5475, color: '#1E3A8A' },
  'San Diego': { lat: 10.4242, lng: -75.5498, color: '#E76F51' },
  'Bocagrande': { lat: 10.3996, lng: -75.5520, color: '#B56357' },
  'Manga': { lat: 10.4083, lng: -75.5332, color: '#1E2A5E' },
  'Castillo Grande': { lat: 10.3933, lng: -75.5458, color: '#E8C766' },
  'La Boquilla': { lat: 10.4589, lng: -75.5167, color: '#D4AF37' },
  'Tierra Bomba': { lat: 10.3500, lng: -75.5667, color: '#1E3A8A' },
  'Barú': { lat: 10.1833, lng: -75.5833, color: '#E76F51' }
};

const CulturalMap = ({ 
  currentUser, 
  initialFilters = {}, 
  onHeritageSelect,
  height = '500px',
  interactive = true 
}) => {
  const [heritages, setHeritages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    heritage_type: '',
    neighborhood: '',
    ...initialFilters
  });
  const [selectedHeritage, setSelectedHeritage] = useState(null);
  const [mapView, setMapView] = useState('clusters'); // 'clusters' | 'heatmap' | 'points'
  const [zoom, setZoom] = useState(12);
  
  const mapContainerRef = useRef(null);
  const tooltipRef = useRef(null);

  // Cargar patrimonios para el mapa
  useEffect(() => {
    loadHeritagesForMap();
  }, [filters.heritage_type, filters.neighborhood]);

  const loadHeritagesForMap = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await patrimonialService.getHeritages({
        heritage_type: filters.heritage_type,
        neighborhood: filters.neighborhood,
        include_coordinates: true
      });
      
      if (error) throw error;
      setHeritages(data || []);
    } catch (err) {
      console.error('Error cargando patrimonios para mapa:', err);
      setError('Error al cargar datos para el mapa cultural');
    } finally {
      setLoading(false);
    }
  };

  // Datos procesados para el mapa
  const mapData = useMemo(() => {
    const heritageByNeighborhood = heritages.reduce((acc, heritage) => {
      const neighborhood = heritage.neighborhood;
      if (!neighborhood) return acc;
      
      if (!acc[neighborhood]) {
        acc[neighborhood] = {
          count: 0,
          heritages: [],
          coordinates: CARTAGENA_NEIGHBORHOODS[neighborhood] || { lat: 10.3910, lng: -75.4794, color: '#6B7280' },
          types: new Set()
        };
      }
      
      acc[neighborhood].count++;
      acc[neighborhood].heritages.push(heritage);
      acc[neighborhood].types.add(heritage.heritage_type);
      
      return acc;
    }, {});

    // Calcular densidad para heatmap
    const maxCount = Math.max(...Object.values(heritageByNeighborhood).map(n => n.count), 1);
    
    Object.keys(heritageByNeighborhood).forEach(neighborhood => {
      const data = heritageByNeighborhood[neighborhood];
      data.density = data.count / maxCount;
      data.types = Array.from(data.types);
    });

    return {
      heritageByNeighborhood,
      totalNeighborhoods: Object.keys(heritageByNeighborhood).length,
      maxCount
    };
  }, [heritages]);

  // Handler para selección de patrimonio
  const handleHeritageSelect = useCallback((heritage) => {
    setSelectedHeritage(heritage);
    if (onHeritageSelect) {
      onHeritageSelect(heritage);
    }
  }, [onHeritageSelect]);

  // Handler para filtros
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setSelectedHeritage(null);
  }, []);

  // Mover tooltip con el mouse
  const handleMouseMove = useCallback((e, neighborhood, data) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${e.clientX + 15}px`;
      tooltipRef.current.style.top = `${e.clientY - 15}px`;
    }
  }, []);

  // Renderizado del mapa SVG optimizado
  const renderMap = useCallback(() => {
    const neighborhoods = Object.entries(mapData.heritageByNeighborhood);
    
    if (neighborhoods.length === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🗺️</div>
            <p>No hay datos geoespaciales disponibles</p>
          </div>
        </div>
      );
    }

    return (
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full rounded-lg"
        ref={mapContainerRef}
      >
        {/* Fondo del mapa */}
        <rect width="800" height="600" fill="#f8fafc" className="rounded-lg" />
        
        {/* Representación simplificada de Cartagena */}
        <g transform="scale(0.8) translate(80, 60)">
          {/* Área continental */}
          <path
            d="M200,200 Q300,150 400,200 Q500,250 550,300 Q500,350 400,400 Q300,450 200,400 Q150,350 200,300 Z"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          
          {/* Islas */}
          <circle cx="650" cy="250" r="40" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="600" cy="400" r="30" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
          
          {/* Puntos de patrimonio por barrio */}
          {neighborhoods.map(([neighborhood, data]) => {
            const { coordinates, count, types, density } = data;
            
            // Escalar coordenadas al viewBox
            const x = ((coordinates.lng + 75.6) * 1000) % 700 + 50;
            const y = ((10.5 - coordinates.lat) * 1000) % 500 + 50;
            
            const radius = mapView === 'clusters' 
              ? Math.max(15, Math.min(40, count * 5))
              : mapView === 'heatmap'
              ? 20 + (density * 30)
              : 8;

            const fillColor = mapView === 'heatmap'
              ? `rgba(212, 175, 55, ${0.3 + density * 0.7})`
              : coordinates.color;

            const strokeColor = mapView === 'heatmap'
              ? `rgba(212, 175, 55, ${0.8})`
              : '#1E3A8A';

            return (
              <g key={neighborhood} className="transition-all duration-300">
                {/* Punto del barrio */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={mapView === 'clusters' ? 3 : 2}
                  className="cursor-pointer hover:r-6 transition-all duration-200"
                  onClick={() => interactive && handleNeighborhoodClick(neighborhood, data)}
                  onMouseMove={(e) => interactive && handleMouseMove(e, neighborhood, data)}
                  onMouseEnter={() => interactive && setTooltipNeighborhood(neighborhood)}
                  onMouseLeave={() => interactive && setTooltipNeighborhood(null)}
                />
                
                {/* Etiqueta para clusters */}
                {(mapView === 'clusters' && count > 0) && (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-bold pointer-events-none select-none"
                    fill="#1E2A5E"
                  >
                    {count}
                  </text>
                )}
                
                {/* Tooltip en hover */}
                {interactive && (
                  <title>
                    {neighborhood}: {count} elemento{count !== 1 ? 's' : ''} patrimonial{count !== 1 ? 'es' : ''}
                    {types.length > 0 && ` (${types.join(', ')})`}
                  </title>
                )}
              </g>
            );
          })}
          
          {/* Patrimonio seleccionado */}
          {selectedHeritage && selectedHeritage.neighborhood && (
            <g>
              <circle
                cx={((CARTAGENA_NEIGHBORHOODS[selectedHeritage.neighborhood]?.lng || -75.5) + 75.6) * 1000 % 700 + 50}
                cy={((10.5 - (CARTAGENA_NEIGHBORHOODS[selectedHeritage.neighborhood]?.lat || 10.4)) * 1000) % 500 + 50}
                r="12"
                fill="none"
                stroke="#DC2626"
                strokeWidth="3"
                className="animate-pulse"
              />
            </g>
          )}
        </g>
        
        {/* Leyenda del mapa */}
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="160" height="100" fill="white" fillOpacity="0.9" rx="8" />
          <text x="10" y="20" className="text-sm font-semibold" fill="#1E2A5E">
            Leyenda del Mapa
          </text>
          
          {mapView === 'clusters' && (
            <>
              <circle cx="15" y="35" r="6" fill="#D4AF37" />
              <text x="25" y="39" className="text-xs" fill="#4B5563">1-5 elementos</text>
              
              <circle cx="15" y="55" r="10" fill="#1E3A8A" />
              <text x="30" y="59" className="text-xs" fill="#4B5563">6-15 elementos</text>
              
              <circle cx="15" y="75" r="14" fill="#E76F51" />
              <text x="34" y="79" className="text-xs" fill="#4B5563">16+ elementos</text>
            </>
          )}
          
          {mapView === 'heatmap' && (
            <>
              <circle cx="15" y="35" r="8" fill="rgba(212, 175, 55, 0.3)" />
              <text x="25" y="39" className="text-xs" fill="#4B5563">Baja densidad</text>
              
              <circle cx="15" y="55" r="8" fill="rgba(212, 175, 55, 0.6)" />
              <text x="25" y="59" className="text-xs" fill="#4B5563">Media densidad</text>
              
              <circle cx="15" y="75" r="8" fill="rgba(212, 175, 55, 0.9)" />
              <text x="25" y="79" className="text-xs" fill="#4B5563">Alta densidad</text>
            </>
          )}
        </g>
      </svg>
    );
  }, [mapData, mapView, selectedHeritage, interactive, handleMouseMove]);

  // Handlers para interacciones del mapa
  const handleNeighborhoodClick = useCallback((neighborhood, data) => {
    if (data.heritages.length === 1) {
      handleHeritageSelect(data.heritages[0]);
    } else {
      // Podría abrir un modal con la lista de patrimonios del barrio
      console.log(`${data.heritages.length} patrimonios en ${neighborhood}`);
    }
  }, [handleHeritageSelect]);

  const handleMapViewChange = useCallback((view) => {
    setMapView(view);
  }, []);

  const handleZoom = useCallback((direction) => {
    setZoom(prev => Math.max(8, Math.min(16, prev + direction)));
  }, []);

  // Tooltip state
  const [tooltipNeighborhood, setTooltipNeighborhood] = useState(null);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header del Mapa */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🗺️ Mapa Cultural de Cartagena
            </h2>
            <p className="text-gray-600">
              Distribución geográfica del patrimonio cultural inmaterial
            </p>
          </div>
          
          {/* Controles del Mapa */}
          <div className="flex flex-wrap gap-3">
            {/* Selector de vista */}
            <select
              value={mapView}
              onChange={(e) => handleMapViewChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent text-sm"
            >
              <option value="clusters">Agrupado</option>
              <option value="heatmap">Densidad</option>
              <option value="points">Puntos</option>
            </select>

            {/* Filtros rápidos */}
            <select
              value={filters.heritage_type}
              onChange={(e) => handleFilterChange('heritage_type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent text-sm"
            >
              <option value="">Todos los tipos</option>
              <option value="musical">🎵 Musical</option>
              <option value="dance">💃 Danza</option>
              <option value="culinary">🍲 Culinario</option>
              <option value="craft">🛠️ Artesanal</option>
            </select>

            {/* Controles de zoom */}
            {interactive && (
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleZoom(-1)}
                  className="px-3 py-2 bg-white hover:bg-gray-50 border-r border-gray-300 transition-colors"
                  aria-label="Alejar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <button
                  onClick={() => handleZoom(1)}
                  className="px-3 py-2 bg-white hover:bg-gray-50 transition-colors"
                  aria-label="Acercar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor del Mapa */}
      <div className="relative" style={{ height }}>
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cartagena-yellow mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando mapa cultural...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
            <div className="text-center text-red-600">
              <div className="text-4xl mb-2">❌</div>
              <p>{error}</p>
              <button
                onClick={loadHeritagesForMap}
                className="mt-3 px-4 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Mapa */}
        {!loading && !error && renderMap()}

        {/* Tooltip flotante */}
        {interactive && tooltipNeighborhood && mapData.heritageByNeighborhood[tooltipNeighborhood] && (
          <div
            ref={tooltipRef}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs pointer-events-none transition-opacity duration-200"
            style={{ opacity: tooltipNeighborhood ? 1 : 0 }}
          >
            <h4 className="font-semibold text-gray-900 mb-1">
              {tooltipNeighborhood}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {mapData.heritageByNeighborhood[tooltipNeighborhood].count} elemento
              {mapData.heritageByNeighborhood[tooltipNeighborhood].count !== 1 ? 's' : ''} patrimonial
              {mapData.heritageByNeighborhood[tooltipNeighborhood].count !== 1 ? 'es' : ''}
            </p>
            {mapData.heritageByNeighborhood[tooltipNeighborhood].types.length > 0 && (
              <div className="text-xs text-gray-500">
                Tipos: {mapData.heritageByNeighborhood[tooltipNeighborhood].types.join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Información del zoom */}
        {interactive && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-600 border border-gray-200">
            Zoom: {zoom}x
          </div>
        )}
      </div>

      {/* Footer del Mapa */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
          <div>
            Mostrando {mapData.totalNeighborhoods} barrio{mapData.totalNeighborhoods !== 1 ? 's' : ''} con patrimonio cultural
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-cartagena-yellow rounded-full mr-1"></span>
              Patrimonio activo
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-cartagena-blue rounded-full mr-1"></span>
              Patrimonio en riesgo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CulturalMap);
