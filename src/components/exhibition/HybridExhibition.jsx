import React, { useState, useEffect } from 'react';
import VirtualGallery from './VirtualGallery';
import PhysicalExhibition from './PhysicalExhibition';
import ExhibitionSync from './ExhibitionSync';

const HybridExhibition = ({ exhibition, currentUser, onExhibitionUpdate }) => {
  const [activeTab, setActiveTab] = useState('hybrid');
  const [syncStatus, setSyncStatus] = useState('synced');
  const [physicalArtworks, setPhysicalArtworks] = useState([]);
  const [virtualArtworks, setVirtualArtworks] = useState([]);
  const [visitorCount, setVisitorCount] = useState({ physical: 0, virtual: 0 });
  const [realTimeData, setRealTimeData] = useState({
    physical_visitors: 0,
    virtual_visitors: 0,
    popular_artworks: [],
    engagement_metrics: {}
  });

  // Separar obras por tipo de exposición
  useEffect(() => {
    if (exhibition?.artworks) {
      const physical = exhibition.artworks.filter(artwork => 
        artwork.exhibition_type === 'physical' || artwork.exhibition_type === 'hybrid'
      );
      const virtual = exhibition.artworks.filter(artwork => 
        artwork.exhibition_type === 'virtual' || artwork.exhibition_type === 'hybrid'
      );
      
      setPhysicalArtworks(physical);
      setVirtualArtworks(virtual);
    }
  }, [exhibition?.artworks]);

  // Simular datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular fluctuación de visitantes
      setVisitorCount(prev => ({
        physical: Math.max(0, prev.physical + Math.floor(Math.random() * 3 - 1)),
        virtual: Math.max(0, prev.virtual + Math.floor(Math.random() * 5 - 2))
      }));

      // Simular métricas de engagement
      setRealTimeData(prev => ({
        physical_visitors: visitorCount.physical,
        virtual_visitors: visitorCount.virtual,
        popular_artworks: exhibition?.artworks
          ?.slice(0, 3)
          ?.map(artwork => ({
            ...artwork,
            views: Math.floor(Math.random() * 100),
            engagement: Math.floor(Math.random() * 100)
          })) || [],
        engagement_metrics: {
          avg_time_spent: `${Math.floor(Math.random() * 10) + 5}min`,
          interaction_rate: `${Math.floor(Math.random() * 30) + 20}%`,
          conversion_rate: `${Math.floor(Math.random() * 10) + 5}%`
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [exhibition?.artworks, visitorCount]);

  const handleArtworkUpdate = (updatedArtwork) => {
    if (onExhibitionUpdate) {
      onExhibitionUpdate({
        ...exhibition,
        artworks: exhibition.artworks.map(artwork =>
          artwork.id === updatedArtwork.id ? updatedArtwork : artwork
        )
      });
    }
  };

  const handleSyncStatusChange = (status) => {
    setSyncStatus(status);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'virtual':
        return (
          <div className="h-full">
            <VirtualGallery
              exhibition={exhibition}
              artworks={virtualArtworks}
              currentUser={currentUser}
              onArtworkUpdate={handleArtworkUpdate}
            />
          </div>
        );

      case 'physical':
        return (
          <div className="h-full">
            <PhysicalExhibition
              exhibition={exhibition}
              artworks={physicalArtworks}
              currentUser={currentUser}
              onArtworkUpdate={handleArtworkUpdate}
            />
          </div>
        );

      case 'hybrid':
      default:
        return (
          <div className="h-full flex flex-col lg:flex-row">
            {/* Panel de control híbrido */}
            <div className="lg:w-1/4 p-4 bg-white border-r border-gray-200">
              <ExhibitionSync
                exhibition={exhibition}
                physicalArtworks={physicalArtworks}
                virtualArtworks={virtualArtworks}
                currentUser={currentUser}
                onSyncStatusChange={handleSyncStatusChange}
              />
              
              {/* Métricas en tiempo real */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Métricas en Tiempo Real</h3>
                
                {/* Contadores de visitantes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-900">Presencial</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700 mt-1">
                      {realTimeData.physical_visitors}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-purple-900">Virtual</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700 mt-1">
                      {realTimeData.virtual_visitors}
                    </p>
                  </div>
                </div>

                {/* Obras populares */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Obras Populares</h4>
                  <div className="space-y-2">
                    {realTimeData.popular_artworks.map((artwork, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <span className="w-6 h-6 bg-cartagena-yellow rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </span>
                        <span className="flex-1 truncate">{artwork.title}</span>
                        <span className="text-gray-500">{artwork.views} vistas</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Métricas de engagement */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-green-900 mb-2">Engagement</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Tiempo promedio:</span>
                      <span className="font-medium">{realTimeData.engagement_metrics.avg_time_spent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasa de interacción:</span>
                      <span className="font-medium">{realTimeData.engagement_metrics.interaction_rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasa de conversión:</span>
                      <span className="font-medium">{realTimeData.engagement_metrics.conversion_rate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vistas divididas */}
            <div className="lg:w-3/4 flex flex-col h-full">
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                {/* Vista Virtual */}
                <div className="bg-gray-900 rounded-xl overflow-hidden relative">
                  <div className="absolute top-2 left-2 z-10 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    Virtual
                  </div>
                  <VirtualGallery
                    exhibition={exhibition}
                    artworks={virtualArtworks}
                    currentUser={currentUser}
                    onArtworkUpdate={handleArtworkUpdate}
                  />
                </div>

                {/* Vista Presencial */}
                <div className="bg-white rounded-xl overflow-hidden relative border border-gray-200">
                  <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Presencial
                  </div>
                  <PhysicalExhibition
                    exhibition={exhibition}
                    artworks={physicalArtworks}
                    currentUser={currentUser}
                    onArtworkUpdate={handleArtworkUpdate}
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!exhibition) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Exposición no encontrada</h3>
          <p className="text-gray-600">Selecciona una exposición para ver los detalles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 rounded-xl">
      {/* Header de la exposición */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{exhibition.title}</h1>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                syncStatus === 'synced' 
                  ? 'bg-green-100 text-green-800' 
                  : syncStatus === 'syncing'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {syncStatus === 'synced' ? '✅ Sincronizado' : 
                 syncStatus === 'syncing' ? '🔄 Sincronizando' : '❌ Desincronizado'}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{exhibition.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>📍 {exhibition.physical_location || 'Ubicación no especificada'}</span>
              <span>🌐 {exhibition.virtual_url ? 'URL Virtual Disponible' : 'Solo presencial'}</span>
              <span>🕒 {exhibition.duration || 'Duración no especificada'}</span>
            </div>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            {/* Botones de acción */}
            <button className="px-4 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium">
              Gestionar Exposición
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          {[
            { id: 'hybrid', name: 'Vista Híbrida', icon: '🔄' },
            { id: 'virtual', name: 'Solo Virtual', icon: '💻' },
            { id: 'physical', name: 'Solo Presencial', icon: '🏛️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-cartagena-yellow text-cartagena-yellow'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default HybridExhibition;
