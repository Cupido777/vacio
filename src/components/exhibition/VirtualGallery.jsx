import React, { useState, useRef, useEffect } from 'react';
import ArtworkModal from './ArtworkModal';

const VirtualGallery = ({ exhibition, artworks, currentUser, onArtworkUpdate }) => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const galleryRef = useRef(null);

  const galleryConfig = {
    wallColor: '#f8f4e9',
    floorColor: '#e5e7eb',
    artworkSize: { width: 200, height: 150 },
    spacing: 50
  };

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetView = () => {
    setZoomLevel(1);
  };

  // Distribución simplificada de obras
  const getArtworkPositions = () => {
    if (!artworks || artworks.length === 0) return [];

    return artworks.map((artwork, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const x = (col - 1.5) * (galleryConfig.artworkSize.width + galleryConfig.spacing);
      const y = (row - 1) * (galleryConfig.artworkSize.height + galleryConfig.spacing);
      
      return {
        artwork,
        position: { x, y }
      };
    });
  };

  const artworkPositions = getArtworkPositions();

  // Navegación por teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleResetView();
          break;
        case 'Escape':
          handleCloseModal();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Controles de la galería */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Acercar (+)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Alejar (-)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
          <button
            onClick={handleResetView}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Restablecer vista (0)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg text-center">
          <span className="text-xs font-medium text-gray-700">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>
      </div>

      {/* Información de la exposición */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">{exhibition?.title}</h2>
        <p className="text-sm text-gray-600 mb-2">
          {artworks?.length || 0} obras en exhibición
        </p>
      </div>

      {/* Galería virtual - Versión simplificada y compatible */}
      <div 
        ref={galleryRef}
        className="relative w-full h-full"
        style={{ 
          transform: `scale(${zoomLevel})`,
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Grid de obras */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
          {artworkPositions.map(({ artwork }) => (
            <div
              key={artwork.id}
              className="cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => handleArtworkClick(artwork)}
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-yellow-400 hover:border-yellow-500 transition-colors duration-300">
                {artwork.media_type === 'image' && artwork.media_url ? (
                  <img
                    src={artwork.media_url}
                    alt={artwork.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/images/default-artwork.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                    <div className="text-center p-4">
                      <div className="text-2xl mb-2">
                        {artwork.media_type === 'audio' ? '🎵' : 
                         artwork.media_type === 'video' ? '🎬' : '📄'}
                      </div>
                      <p className="text-xs text-gray-600 font-medium line-clamp-2">
                        {artwork.title}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Overlay de información */}
                <div className="p-3 bg-white">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {artwork.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {artwork.author_name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instrucciones de navegación */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs p-3 rounded-lg backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <span>🖱️ Clic en obras para detalles</span>
          <span>•</span>
          <span>🔍 +/- para zoom</span>
        </div>
      </div>

      {/* Modal de detalles de obra */}
      <ArtworkModal
        artwork={selectedArtwork}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentUser={currentUser}
        onArtworkUpdate={onArtworkUpdate}
      />

      {/* Estado vacío */}
      {(!artworks || artworks.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
          <div className="text-center text-white p-8">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-bold mb-2">Galería Vacía</h3>
            <p className="text-gray-300 max-w-md">
              Esta exposición no tiene obras agregadas aún.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualGallery;
