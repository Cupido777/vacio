import React, { useState, useRef, useEffect } from 'react';
import ArtworkModal from './ArtworkModal';

const VirtualGallery = ({ exhibition, artworks, currentUser, onArtworkUpdate }) => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('overview');
  const [zoomLevel, setZoomLevel] = useState(1);
  const galleryRef = useRef(null);

  // Configuración de la galería virtual
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
    setCurrentView('overview');
  };

  // Simular distribución de obras en paredes virtuales
  const getArtworkPositions = () => {
    if (!artworks || artworks.length === 0) return [];

    const walls = [
      { id: 1, x: 0, y: 0, width: 800, height: 400, rotation: 0 }, // Pared frontal
      { id: 2, x: -400, y: 0, width: 400, height: 400, rotation: 90 }, // Pared izquierda
      { id: 3, x: 400, y: 0, width: 400, height: 400, rotation: -90 }, // Pared derecha
    ];

    const positions = [];
    let artworkIndex = 0;

    walls.forEach(wall => {
      const artworksPerWall = Math.ceil(artworks.length / walls.length);
      const startIndex = artworkIndex;
      const endIndex = Math.min(startIndex + artworksPerWall, artworks.length);

      for (let i = startIndex; i < endIndex; i++) {
        if (artworkIndex >= artworks.length) break;

        const row = Math.floor((i - startIndex) / 3);
        const col = (i - startIndex) % 3;
        
        const x = wall.x + (col - 1) * (galleryConfig.artworkSize.width + galleryConfig.spacing);
        const y = wall.y + (row - 1) * (galleryConfig.artworkSize.height + galleryConfig.spacing) + 50;

        positions.push({
          artwork: artworks[artworkIndex],
          position: { x, y, z: 0 },
          wall: wall.id,
          rotation: wall.rotation
        });

        artworkIndex++;
      }
    });

    return positions;
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
    <div className="relative w-full h-full bg-gray-900 rounded-xl overflow-hidden">
      {/* Controles de la galería */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        {/* Controles de zoom */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg flex flex-col space-y-1">
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

        {/* Indicador de zoom */}
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
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>🖱️ Haz clic en las obras para ver detalles</span>
        </div>
      </div>

      {/* Galería virtual 3D - VERSIÓN COMPATIBLE */}
      <div 
        ref={galleryRef}
        className="relative w-full h-full transform-style-preserve-3d"
        style={{ 
          transform: `scale(${zoomLevel})`,
          perspective: '1000px'
        }}
      >
        {/* Piso */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-200 h-100"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              ${galleryConfig.floorColor},
              ${galleryConfig.floorColor} 10px,
              #d1d5db 10px,
              #d1d5db 20px
            )`,
            transform: 'rotateX(60deg) translateZ(-200px)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* Paredes */}
        {[1, 2, 3].map(wallId => (
          <div
            key={wallId}
            className="absolute bg-cover bg-center"
            style={{
              width: wallId === 1 ? '800px' : '400px',
              height: '400px',
              background: galleryConfig.wallColor,
              left: wallId === 1 ? '50%' : wallId === 2 ? 'calc(50% - 400px)' : 'calc(50% + 400px)',
              top: '50%',
              transform: `
                translate(-50%, -50%)
                ${wallId === 1 ? 'rotateY(0deg) translateZ(200px)' : ''}
                ${wallId === 2 ? 'rotateY(90deg) translateZ(200px)' : ''}
                ${wallId === 3 ? 'rotateY(-90deg) translateZ(200px)' : ''}
              `,
              transformStyle: 'preserve-3d',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
            }}
          />
        ))}

        {/* Obras de arte posicionadas */}
        {artworkPositions.map(({ artwork, position, wall, rotation }, index) => (
          <div
            key={artwork.id}
            className="absolute cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-20"
            style={{
              left: `calc(50% + ${position.x}px)`,
              top: `calc(50% + ${position.y}px)`,
              width: `${galleryConfig.artworkSize.width}px`,
              height: `${galleryConfig.artworkSize.height}px`,
              transform: `
                translate(-50%, -50%)
                ${wall === 1 ? 'rotateY(0deg) translateZ(202px)' : ''}
                ${wall === 2 ? 'rotateY(90deg) translateZ(202px)' : ''}
                ${wall === 3 ? 'rotateY(-90deg) translateZ(202px)' : ''}
              `,
              transformStyle: 'preserve-3d'
            }}
            onClick={() => handleArtworkClick(artwork)}
          >
            {/* Marco de la obra */}
            <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border-4 border-colonial-yellow hover:border-colonial-light-yellow transition-colors duration-300">
              {artwork.media_type === 'image' && artwork.media_url ? (
                <img
                  src={artwork.media_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/default-artwork.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
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
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-end justify-center">
                <div className="w-full p-2 bg-gradient-to-t from-black via-black/70 to-transparent text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs font-medium text-center line-clamp-1">
                    {artwork.title}
                  </p>
                  <p className="text-xs text-center text-gray-300">
                    {artwork.author_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Placa informativa */}
            <div 
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs p-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
              style={{ zIndex: 30 }}
            >
              {artwork.title}
            </div>
          </div>
        ))}

        {/* Punto de luz/ambiente */}
        <div 
          className="absolute top-1/4 left-1/2 w-100 h-100 rounded-full bg-yellow-200 opacity-20 blur-xl"
          style={{
            transform: 'translate(-50%, -50%) translateZ(500px)',
            transformStyle: 'preserve-3d'
          }}
        />
      </div>

      {/* Instrucciones de navegación */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs p-3 rounded-lg backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <span>🖱️ Clic en obras para detalles</span>
          <span>•</span>
          <span>🔍 +/- para zoom</span>
          <span>•</span>
          <span>🔄 0 para reset</span>
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
              {currentUser?.id === exhibition?.curator_id && (
                <span className="block mt-2">
                  Como curador, puedes agregar obras desde el panel de administración.
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualGallery;
