import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { patrimonialService } from '../../services/patrimonialService';

// Hook personalizado para intersection observer (optimización)
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

const Timeline = ({ 
  currentUser, 
  initialFilters = {}, 
  onHeritageSelect,
  height = '600px',
  showFilters = true 
}) => {
  const [heritages, setHeritages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    heritage_type: '',
    time_period: '',
    century: '',
    search: '',
    ...initialFilters
  });
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [timelineView, setTimelineView] = useState('centuries'); // 'centuries' | 'decades' | 'events'
  const [visibleItems, setVisibleItems] = useState(new Set());

  // Observers para animaciones lazy
  const [item1Ref, item1Visible] = useIntersectionObserver({ threshold: 0.1 });
  const [item2Ref, item2Visible] = useIntersectionObserver({ threshold: 0.1 });
  const [item3Ref, item3Visible] = useIntersectionObserver({ threshold: 0.1 });

  // Cargar patrimonios para la línea de tiempo
  useEffect(() => {
    loadHeritagesForTimeline();
  }, [filters.heritage_type, filters.time_period, filters.century]);

  const loadHeritagesForTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await patrimonialService.getHeritages({
        heritage_type: filters.heritage_type,
        time_period: filters.time_period,
        century: filters.century,
        include_timeline_data: true
      });
      
      if (error) throw error;
      setHeritages(data || []);
    } catch (err) {
      console.error('Error cargando patrimonios para timeline:', err);
      setError('Error al cargar datos para la línea de tiempo');
    } finally {
      setLoading(false);
    }
  };

  // Procesar datos para la línea de tiempo
  const timelineData = useMemo(() => {
    const periods = {
      preColombian: { name: 'Época Precolombina', start: -1000, end: 1500, color: '#8B5A2B' },
      colonial: { name: 'Período Colonial', start: 1500, end: 1810, color: '#D4AF37' },
      independence: { name: 'Independencia', start: 1810, end: 1821, color: '#FF6B6B' },
      republic: { name: 'Época Republicana', start: 1821, end: 1900, color: '#4ECDC4' },
      modern: { name: 'Siglo XX', start: 1900, end: 2000, color: '#45B7D1' },
      contemporary: { name: 'Época Contemporánea', start: 2000, end: 2030, color: '#96CEB4' }
    };

    // Agrupar patrimonios por período
    const heritagesByPeriod = heritages.reduce((acc, heritage) => {
      const period = heritage.time_period || determinePeriod(heritage.origin_year);
      if (!acc[period]) {
        acc[period] = {
          heritages: [],
          count: 0,
          ...periods[period]
        };
      }
      acc[period].heritages.push(heritage);
      acc[period].count++;
      return acc;
    }, {});

    // Agrupar por siglo para vista detallada
    const heritagesByCentury = heritages.reduce((acc, heritage) => {
      const century = heritage.century || Math.floor((heritage.origin_year || 1900) / 100) * 100;
      const centuryKey = `s${century.toString().slice(-2)}`;
      
      if (!acc[centuryKey]) {
        acc[centuryKey] = {
          century,
          heritages: [],
          count: 0,
          label: `Siglo ${century.toString().slice(0, 2)}`,
          color: getCenturyColor(century)
        };
      }
      acc[centuryKey].heritages.push(heritage);
      acc[centuryKey].count++;
      return acc;
    }, {});

    // Eventos históricos relevantes para Cartagena
    const historicalEvents = [
      { year: 1533, title: 'Fundación de Cartagena', type: 'historical', impact: 'high' },
      { year: 1586, title: 'Fortificaciones iniciadas', type: 'architectural', impact: 'high' },
      { year: 1741, title: 'Asedio de Vernon', type: 'historical', impact: 'medium' },
      { year: 1811, title: 'Independencia de Cartagena', type: 'historical', impact: 'high' },
      { year: 1885, title: 'Abolición esclavitud', type: 'social', impact: 'high' },
      { year: 1984, title: 'Patrimonio UNESCO', type: 'recognition', impact: 'high' }
    ];

    return {
      periods: heritagesByPeriod,
      centuries: heritagesByCentury,
      historicalEvents,
      totalPeriods: Object.keys(heritagesByPeriod).length,
      totalCenturies: Object.keys(heritagesByCentury).length,
      timeRange: {
        min: Math.min(...heritages.map(h => h.origin_year || 1900).filter(Boolean)),
        max: Math.max(...heritages.map(h => h.origin_year || new Date().getFullYear()).filter(Boolean))
      }
    };
  }, [heritages]);

  // Funciones auxiliares
  const determinePeriod = useCallback((year) => {
    if (!year) return 'contemporary';
    if (year < 1500) return 'preColombian';
    if (year < 1810) return 'colonial';
    if (year < 1821) return 'independence';
    if (year < 1900) return 'republic';
    if (year < 2000) return 'modern';
    return 'contemporary';
  }, []);

  const getCenturyColor = useCallback((century) => {
    const colors = {
      16: '#8B5A2B', // Marrón colonial
      17: '#D4AF37', // Dorado español
      18: '#E76F51', // Terracota
      19: '#1E3A8A', // Azul republicano
      20: '#B56357', // Coral moderno
      21: '#96CEB4'  // Verde contemporáneo
    };
    return colors[Math.floor(century / 100)] || '#6B7280';
  }, []);

  // Handlers optimizados
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setSelectedPeriod(null);
  }, []);

  const handlePeriodSelect = useCallback((period) => {
    setSelectedPeriod(period);
  }, []);

  const handleHeritageSelect = useCallback((heritage) => {
    if (onHeritageSelect) {
      onHeritageSelect(heritage);
    }
  }, [onHeritageSelect]);

  const handleTimelineViewChange = useCallback((view) => {
    setTimelineView(view);
    setSelectedPeriod(null);
  }, []);

  // Renderizado de períodos históricos
  const renderHistoricalTimeline = useCallback(() => {
    const periods = Object.entries(timelineData.periods);

    return (
      <div className="relative">
        {/* Línea central */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-cartagena-yellow h-full"></div>
        
        {/* Períodos históricos */}
        <div className="space-y-12 py-8">
          {periods.map(([periodKey, period], index) => {
            const isEven = index % 2 === 0;
            const isSelected = selectedPeriod === periodKey;
            const [itemRef, isVisible] = useIntersectionObserver({ threshold: 0.3 });

            return (
              <div
                key={periodKey}
                ref={itemRef}
                className={`flex items-center justify-between ${
                  isEven ? 'flex-row' : 'flex-row-reverse'
                } transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Contenido del período */}
                <div className={`w-5/12 ${isEven ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div
                    className={`inline-block p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'border-cartagena-yellow bg-yellow-50 scale-105' 
                        : 'border-gray-200 bg-white hover:shadow-xl hover:scale-102'
                    }`}
                    style={{ borderLeftColor: isEven ? period.color : undefined, borderRightColor: !isEven ? period.color : undefined }}
                    onClick={() => handlePeriodSelect(periodKey)}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {period.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {period.start} - {period.end}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-cartagena-blue font-semibold">
                        {period.count} elemento{period.count !== 1 ? 's' : ''}
                      </span>
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: period.color }}
                      ></span>
                    </div>
                  </div>
                </div>

                {/* Punto en la línea */}
                <div className="relative z-10">
                  <div
                    className={`w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-300 ${
                      isSelected ? 'scale-150' : 'hover:scale-125'
                    }`}
                    style={{ backgroundColor: period.color }}
                  ></div>
                  {isSelected && (
                    <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: period.color }}></div>
                  )}
                </div>

                {/* Espacio vacío del otro lado */}
                <div className="w-5/12"></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [timelineData.periods, selectedPeriod, handlePeriodSelect]);

  // Renderizado por siglos
  const renderCenturiesTimeline = useCallback(() => {
    const centuries = Object.entries(timelineData.centuries).sort(([a], [b]) => a.localeCompare(b));

    return (
      <div className="relative py-8">
        {/* Línea de tiempo horizontal */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
        
        <div className="relative flex justify-between items-center">
          {centuries.map(([centuryKey, century], index) => {
            const isSelected = selectedPeriod === centuryKey;
            const position = (index / (centuries.length - 1)) * 100;
            
            return (
              <div
                key={centuryKey}
                className="relative flex flex-col items-center"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              >
                {/* Punto del siglo */}
                <div
                  className={`w-8 h-8 rounded-full border-4 border-white shadow-lg mb-3 cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-150' : 'hover:scale-125'
                  }`}
                  style={{ backgroundColor: century.color }}
                  onClick={() => handlePeriodSelect(centuryKey)}
                >
                  {isSelected && (
                    <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: century.color }}></div>
                  )}
                </div>

                {/* Etiqueta del siglo */}
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {century.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {century.count} patrimonio{century.count !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Línea conectiva */}
                {index < centuries.length - 1 && (
                  <div 
                    className="absolute top-4 left-full w-full h-0.5 bg-gradient-to-r"
                    style={{ 
                      background: `linear-gradient(to right, ${century.color}, ${centuries[index + 1][1].color})` 
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [timelineData.centuries, selectedPeriod, handlePeriodSelect]);

  // Renderizado de eventos históricos
  const renderEventsTimeline = useCallback(() => {
    const events = [...timelineData.historicalEvents].sort((a, b) => a.year - b.year);

    return (
      <div className="relative py-8">
        {/* Línea central */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-full"></div>
        
        <div className="space-y-6">
          {events.map((event, index) => {
            const isEven = index % 2 === 0;
            const [itemRef, isVisible] = useIntersectionObserver({ threshold: 0.2 });

            return (
              <div
                key={`${event.year}-${event.title}`}
                ref={itemRef}
                className={`flex items-center justify-between ${
                  isEven ? 'flex-row' : 'flex-row-reverse'
                } transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : isEven ? 'opacity-0 -translate-x-8' : 'opacity-0 translate-x-8'
                }`}
              >
                {/* Contenido del evento */}
                <div className={`w-5/12 ${isEven ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className={`inline-block p-4 rounded-lg bg-white shadow-md border ${
                    event.impact === 'high' ? 'border-cartagena-yellow' : 'border-gray-200'
                  }`}>
                    <div className="text-sm font-semibold text-cartagena-blue mb-1">
                      {event.year}
                    </div>
                    <div className="text-gray-900 font-medium">
                      {event.title}
                    </div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                      event.type === 'historical' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'architectural' ? 'bg-amber-100 text-amber-800' :
                      event.type === 'social' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {event.type}
                    </div>
                  </div>
                </div>

                {/* Punto del evento */}
                <div className="relative z-10">
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow ${
                      event.impact === 'high' 
                        ? 'bg-cartagena-yellow w-5 h-5' 
                        : event.impact === 'medium'
                        ? 'bg-cartagena-blue'
                        : 'bg-gray-400'
                    }`}
                  ></div>
                </div>

                {/* Espacio vacío del otro lado */}
                <div className="w-5/12"></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [timelineData.historicalEvents]);

  // Renderizado del contenido del período seleccionado
  const renderSelectedPeriodContent = useCallback(() => {
    if (!selectedPeriod) return null;

    const periodData = timelineData.periods[selectedPeriod] || timelineData.centuries[selectedPeriod];
    if (!periodData) return null;

    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {periodData.name || periodData.label}
          </h3>
          <span className="text-sm text-gray-600">
            {periodData.count} elemento{periodData.count !== 1 ? 's' : ''} patrimonial{periodData.count !== 1 ? 'es' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {periodData.heritages.slice(0, 6).map(heritage => (
            <div
              key={heritage.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleHeritageSelect(heritage)}
            >
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {heritage.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {heritage.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{heritage.heritage_type}</span>
                {heritage.origin_year && (
                  <span>{heritage.origin_year}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {periodData.heritages.length > 6 && (
          <div className="text-center mt-4">
            <button className="text-cartagena-yellow hover:text-yellow-600 font-medium text-sm">
              Ver los {periodData.heritages.length - 6} elementos restantes →
            </button>
          </div>
        )}
      </div>
    );
  }, [selectedPeriod, timelineData, handleHeritageSelect]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📅 Línea de Tiempo del Patrimonio
            </h2>
            <p className="text-gray-600">
              Evolución histórica del patrimonio cultural de Cartagena
            </p>
          </div>

          {/* Controles */}
          <div className="flex flex-wrap gap-3">
            <select
              value={timelineView}
              onChange={(e) => handleTimelineViewChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent text-sm"
            >
              <option value="centuries">Períodos Históricos</option>
              <option value="decades">Por Siglos</option>
              <option value="events">Eventos Clave</option>
            </select>

            {showFilters && (
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
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6" style={{ minHeight: height }}>
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cartagena-yellow mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando línea de tiempo...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 text-red-600">
            <div className="text-4xl mb-2">❌</div>
            <p className="mb-4">{error}</p>
            <button
              onClick={loadHeritagesForTimeline}
              className="px-4 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Línea de Tiempo */}
        {!loading && !error && (
          <>
            {timelineView === 'centuries' && renderHistoricalTimeline()}
            {timelineView === 'decades' && renderCenturiesTimeline()}
            {timelineView === 'events' && renderEventsTimeline()}
            
            {renderSelectedPeriodContent()}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
          <div>
            {timelineData.totalPeriods} períodos históricos • {heritages.length} elementos patrimoniales
          </div>
          <div>
            Rango temporal: {timelineData.timeRange.min} - {timelineData.timeRange.max}
          </div>
        </div>
      </div>
    </div>
  );
};

// Animación fade-in para CSS
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default React.memo(Timeline);
