import React from 'react';
import { Link } from 'react-router-dom';

const ExhibitionCard = ({ exhibition, currentUser }) => {
  const getStatusBadge = (status, type) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Borrador' },
      active: { color: 'bg-green-100 text-green-800', label: 'Activa' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Completada' }
    };

    const typeConfig = {
      virtual: { color: 'bg-purple-100 text-purple-800', label: 'Virtual' },
      physical: { color: 'bg-orange-100 text-orange-800', label: 'Presencial' },
      hybrid: { color: 'bg-indigo-100 text-indigo-800', label: 'Híbrida' }
    };

    return (
      <div className="flex flex-wrap gap-1 mb-2">
        <span className={`${baseClasses} ${statusConfig[status]?.color}`}>
          {statusConfig[status]?.label}
        </span>
        <span className={`${baseClasses} ${typeConfig[type]?.color}`}>
          {typeConfig[type]?.label}
        </span>
      </div>
    );
  };

  const getDateInfo = (startDate, endDate) => {
    if (!startDate) return 'Fechas por definir';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    const today = new Date();
    
    const formatDate = (date) => {
      return date.toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    };

    if (end) {
      if (today < start) {
        return `Inicia ${formatDate(start)}`;
      } else if (today > end) {
        return `Finalizó ${formatDate(end)}`;
      } else {
        return `Hasta ${formatDate(end)}`;
      }
    } else {
      return `Desde ${formatDate(start)}`;
    }
  };

  const getArtworksCountText = (count) => {
    if (!count || count === 0) return 'Sin obras';
    return `${count} ${count === 1 ? 'obra' : 'obras'}`;
  };

  const getFeaturedImage = () => {
    if (exhibition.featured_image) {
      return exhibition.featured_image;
    }
    
    // Imagen por defecto basada en el tipo de exposición
    const defaultImages = {
      virtual: '/images/virtual-gallery.jpg',
      physical: '/images/physical-exhibition.jpg', 
      hybrid: '/images/hybrid-exhibition.jpg'
    };
    
    return defaultImages[exhibition.type] || defaultImages.virtual;
  };

  const isCurator = currentUser?.id === exhibition.curator_id;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Imagen destacada */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img 
          src={getFeaturedImage()}
          alt={exhibition.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/images/default-exhibition.jpg';
          }}
        />
        
        {/* Overlay con información rápida */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end">
          <div className="w-full p-4 bg-gradient-to-t from-black via-black/70 to-transparent text-white">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium">
                {getArtworksCountText(exhibition.exhibition_artworks?.[0]?.count)}
              </span>
              <div className="flex space-x-1">
                {exhibition.virtual_url && (
                  <span className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
                    🌐 Virtual
                  </span>
                )}
                {exhibition.location && (
                  <span className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
                    📍 Presencial
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6">
        {/* Badges de estado y tipo */}
        {getStatusBadge(exhibition.status, exhibition.type)}

        {/* Título y descripción */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-cartagena-yellow transition-colors">
          {exhibition.title}
        </h3>
        
        {exhibition.description && (
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
            {exhibition.description}
          </p>
        )}

        {/* Información de fechas y ubicación */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{getDateInfo(exhibition.start_date, exhibition.end_date)}</span>
          </div>

          {exhibition.location && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="line-clamp-1">{exhibition.location}</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Link
            to={`/galeria/${exhibition.id}`}
            className="inline-flex items-center px-4 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:ring-offset-2 transition-colors text-sm font-medium"
          >
            {exhibition.status === 'active' ? 'Visitar Exposición' : 'Ver Detalles'}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          {isCurator && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cartagena-blue text-white">
              Curador
            </span>
          )}
        </div>

        {/* Información adicional para administradores */}
        {currentUser && (isCurator || currentUser.user_metadata?.role === 'admin') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Creada: {new Date(exhibition.created_at).toLocaleDateString('es-CO')}</span>
              {exhibition.exhibition_artworks?.[0]?.count > 0 && (
                <span>{exhibition.exhibition_artworks[0].count} obras</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExhibitionCard;
