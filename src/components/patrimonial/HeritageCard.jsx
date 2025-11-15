import React from 'react';
import { Link } from 'react-router-dom';

const HeritageCard = ({ heritage, currentUser }) => {
  const getTypeBadge = (heritageType) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    const typeConfig = {
      musical: { color: 'bg-purple-100 text-purple-800', label: '🎵 Musical', icon: '🎵' },
      dance: { color: 'bg-orange-100 text-orange-800', label: '💃 Danza', icon: '💃' },
      culinary: { color: 'bg-red-100 text-red-800', label: '🍲 Culinario', icon: '🍲' },
      craft: { color: 'bg-amber-100 text-amber-800', label: '🛠️ Artesanal', icon: '🛠️' },
      oral: { color: 'bg-blue-100 text-blue-800', label: '📖 Tradición Oral', icon: '📖' },
      ritual: { color: 'bg-green-100 text-green-800', label: '🕯️ Ritual', icon: '🕯️' }
    };

    const config = typeConfig[heritageType] || { color: 'bg-gray-100 text-gray-800', label: heritageType, icon: '🏛️' };
    
    return (
      <span className={`${baseClasses} ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Activo' },
      endangered: { color: 'bg-red-100 text-red-800', label: 'En Riesgo' },
      preserved: { color: 'bg-blue-100 text-blue-800', label: 'Preservado' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`${baseClasses} ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getFeaturedImage = () => {
    if (heritage.featured_image) {
      return heritage.featured_image;
    }
    
    // Imagen por defecto basada en el tipo de patrimonio
    const defaultImages = {
      musical: '/images/musical-heritage.jpg',
      dance: '/images/dance-heritage.jpg',
      culinary: '/images/culinary-heritage.jpg',
      craft: '/images/craft-heritage.jpg',
      oral: '/images/oral-heritage.jpg',
      ritual: '/images/ritual-heritage.jpg'
    };
    
    return defaultImages[heritage.heritage_type] || '/images/default-heritage.jpg';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no registrada';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLocationInfo = () => {
    if (heritage.neighborhood && heritage.city) {
      return `${heritage.neighborhood}, ${heritage.city}`;
    }
    return heritage.neighborhood || heritage.city || 'Ubicación no especificada';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Imagen destacada */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img 
          src={getFeaturedImage()}
          alt={heritage.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/images/default-heritage.jpg';
          }}
        />
        
        {/* Overlay con información rápida */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end">
          <div className="w-full p-4 bg-gradient-to-t from-black via-black/70 to-transparent text-white">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium">
                {heritage.cultural_manifestation}
              </span>
              <div className="flex space-x-1">
                {heritage.recognition_level && (
                  <span className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
                    {heritage.recognition_level === 'national' ? '🇨🇴 Nacional' : 
                     heritage.recognition_level === 'regional' ? '🏙️ Regional' : '🏘️ Local'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6">
        {/* Badges de tipo y estado */}
        <div className="flex flex-wrap gap-2 mb-3">
          {getTypeBadge(heritage.heritage_type)}
          {getStatusBadge(heritage.status)}
        </div>

        {/* Título y descripción */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-cartagena-yellow transition-colors">
          {heritage.title}
        </h3>
        
        {heritage.description && (
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
            {heritage.description}
          </p>
        )}

        {/* Información del patrimonio */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          {/* Ubicación */}
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="line-clamp-1">{getLocationInfo()}</span>
          </div>

          {/* Fecha de registro */}
          {heritage.registration_date && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>Registrado: {formatDate(heritage.registration_date)}</span>
            </div>
          )}

          {/* Practicantes */}
          {heritage.practitioners_count > 0 && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span>{heritage.practitioners_count} practicantes</span>
            </div>
          )}
        </div>

        {/* Elementos multimedia */}
        {(heritage.audio_count > 0 || heritage.video_count > 0 || heritage.photo_count > 0) && (
          <div className="flex space-x-4 mb-4 text-xs text-gray-500">
            {heritage.audio_count > 0 && (
              <span className="flex items-center">
                <span className="mr-1">🎵</span>
                {heritage.audio_count} audio{heritage.audio_count !== 1 ? 's' : ''}
              </span>
            )}
            {heritage.video_count > 0 && (
              <span className="flex items-center">
                <span className="mr-1">🎬</span>
                {heritage.video_count} video{heritage.video_count !== 1 ? 's' : ''}
              </span>
            )}
            {heritage.photo_count > 0 && (
              <span className="flex items-center">
                <span className="mr-1">📷</span>
                {heritage.photo_count} foto{heritage.photo_count !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Link
            to={`/patrimonio/${heritage.id}`}
            className="inline-flex items-center px-4 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:ring-offset-2 transition-colors text-sm font-medium"
          >
            Explorar Patrimonio
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          {/* Indicador de urgencia para patrimonios en riesgo */}
          {heritage.status === 'endangered' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
              ⚠️ En Riesgo
            </span>
          )}
        </div>

        {/* Información adicional para investigadores */}
        {currentUser && currentUser.user_metadata?.role === 'researcher' && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-500">
              <span>ID: {heritage.id}</span>
              <span>Registro: {formatDate(heritage.created_at)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeritageCard;
