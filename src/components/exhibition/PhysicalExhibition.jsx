import React, { useState } from 'react';
import ArtworkModal from './ArtworkModal';

const PhysicalExhibition = ({ exhibition, artworks, currentUser, onArtworkUpdate }) => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
  };

  // Simular distribución en sala física
  const getExhibitionLayout = () => {
    if (!artworks || artworks.length === 0) return [];

    return artworks.map((artwork, index) => ({
      ...artwork,
      position: {
        x: (index % 4) * 25, // 4 columnas
        y: Math.floor(index / 4) * 30 // Filas automáticas
      },
      room: Math.floor(index / 8) + 1 // Cambiar de sala cada 8 obras
    }));
  };

  const layout = getExhibitionLayout();
  const rooms = [...new Set(layout.map(item => item.room))];

  return (
    <div className="w-full h-full bg-gray-50 rounded-xl p-6 overflow-auto">
      {/* Header de la exposición física */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {exhibition?.title} - Exhibición Presencial
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{exhibition?.physical_location || 'Ubicación no especificada'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{exhibition?.schedule || 'Horario no especificado'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Capacidad: {exhibition?.capacity || 'No especificada'}</span>
          </div>
        </div>
      </div>

      {/* Mapa de salas */}
      <div className="space-y-8">
        {rooms.map(room => (
          <div key={room} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-6 h-6 bg-cartagena-yellow text-white rounded-full flex items-center justify-center text-sm mr-2">
                {room}
              </span>
              Sala {room}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {layout
                .filter(item => item.room === room)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-cartagena-yellow transition-colors cursor-pointer group"
                    onClick={() => handleArtworkClick(item)}
                  >
                    {/* Imagen de la obra */}
                    <div className="aspect-square bg-white rounded-lg overflow-hidden mb-3 border border-gray-200">
                      {item.media_type === 'image' && item.media_url ? (
                        <img
                          src={item.media_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <div className="text-center">
                            <div className="text-2xl mb-1">
                              {item.media_type === 'audio' ? '🎵' : 
                               item.media_type === 'video' ? '🎬' : '📄'}
                            </div>
                            <p className="text-xs text-gray-500">No disponible</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Información de la obra */}
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-cartagena-yellow transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500">{item.author_name}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Año: {item.creation_year}</span>
                        <span>{item.dimensions}</span>
                      </div>
                    </div>

                    {/* Etiqueta de posición */}
                    <div className="mt-2 text-xs text-gray-400 text-center">
                      Posición: {String.fromCharCode(65 + Math.floor(item.position.x / 25))}
                      {Math.floor(item.position.y / 30) + 1}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {artworks.length === 0 && (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sala Vacía
            </h3>
            <p className="text-gray-600 max-w-sm">
              No hay obras asignadas a la exhibición presencial.
              {currentUser?.id === exhibition?.curator_id && (
                <span className="block mt-1 text-sm">
                  Como curador, puedes agregar obras desde el panel de gestión.
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
            💡
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Visita Presencial</h4>
            <p className="text-sm text-blue-700">
              Esta exhibición está disponible para visita presencial. 
              Las obras están organizadas en salas temáticas. 
              Consulta en recepción el mapa detallado de la exposición.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      <ArtworkModal
        artwork={selectedArtwork}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentUser={currentUser}
        onArtworkUpdate={onArtworkUpdate}
      />
    </div>
  );
};

export default PhysicalExhibition;
