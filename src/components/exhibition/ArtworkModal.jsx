import React, { useState, useEffect } from 'react';
import { communityService } from '../../services/communityService';

const ArtworkModal = ({ artwork, isOpen, onClose, currentUser, onArtworkUpdate }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [localArtwork, setLocalArtwork] = useState(artwork);
  const [activeTab, setActiveTab] = useState('details');

  // Actualizar artwork local cuando cambia el prop
  useEffect(() => {
    setLocalArtwork(artwork);
  }, [artwork]);

  if (!isOpen || !localArtwork) return null;

  const handleLike = async () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    try {
      setIsLiking(true);
      const { error } = await communityService.toggleLike(localArtwork.id, currentUser.id);
      
      if (error) throw error;
      
      // Actualizar contador localmente
      setLocalArtwork(prev => ({
        ...prev,
        likes_count: prev.likes_count + (prev.user_has_liked ? -1 : 1),
        user_has_liked: !prev.user_has_liked
      }));

      if (onArtworkUpdate) {
        onArtworkUpdate();
      }
    } catch (error) {
      console.error('Error al dar like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMediaElement = () => {
    if (!localArtwork.media_url) return null;

    switch (localArtwork.media_type) {
      case 'image':
        return (
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={localArtwork.media_url} 
              alt={localArtwork.title}
              className="w-full h-full object-contain"
            />
          </div>
        );
      
      case 'audio':
        return (
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">🎵</div>
              <h4 className="font-semibold text-gray-900">{localArtwork.title}</h4>
            </div>
            <audio 
              controls 
              className="w-full"
              src={localArtwork.media_url}
            >
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        );
      
      case 'video':
        return (
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <video 
              controls 
              className="w-full max-h-96"
              src={localArtwork.media_url}
            >
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-gray-600">Contenido no visualizable</p>
          </div>
        );
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-8">
              {localArtwork.title}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Por {localArtwork.author_name || 'Usuario'}</span>
              <span>•</span>
              <span>{formatDate(localArtwork.created_at)}</span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Columna izquierda - Media */}
            <div className="space-y-4">
              {getMediaElement()}
              
              {/* Stats rápidos */}
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex items-center space-x-1 transition-colors ${
                    localArtwork.user_has_liked 
                      ? 'text-red-500' 
                      : 'text-gray-600 hover:text-red-500'
                  } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg 
                    className={`w-5 h-5 ${localArtwork.user_has_liked ? 'fill-current' : 'fill-none'}`}
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={localArtwork.user_has_liked ? 0 : 2} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  <span>{localArtwork.likes_count || 0}</span>
                </button>
                
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{localArtwork.comments_count || 0}</span>
                </div>
              </div>
            </div>

            {/* Columna derecha - Información */}
            <div className="space-y-6">
              {/* Navegación por pestañas */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px space-x-8">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'details'
                        ? 'border-cartagena-yellow text-cartagena-yellow'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Detalles
                  </button>
                  <button
                    onClick={() => setActiveTab('context')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'context'
                        ? 'border-cartagena-yellow text-cartagena-yellow'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Contexto
                  </button>
                </nav>
              </div>

              {/* Contenido de pestañas */}
              <div className="space-y-4">
                {activeTab === 'details' && (
                  <>
                    {/* Descripción */}
                    {localArtwork.content && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                        <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                          {localArtwork.content}
                        </p>
                      </div>
                    )}

                    {/* Metadatos */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {localArtwork.tags && localArtwork.tags.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Etiquetas</h4>
                          <div className="flex flex-wrap gap-1">
                            {localArtwork.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {localArtwork.media_type && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Tipo</h4>
                          <span className="text-gray-600 capitalize">{localArtwork.media_type}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'context' && (
                  <div className="space-y-4">
                    {/* Información del artista */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Sobre el Artista</h3>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-cartagena-blue rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {localArtwork.author_name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{localArtwork.author_name || 'Usuario'}</p>
                          <p className="text-sm text-gray-600">Miembro de la comunidad</p>
                        </div>
                      </div>
                    </div>

                    {/* Información técnica */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Información Técnica</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Publicado:</span>
                          <p className="text-gray-900">{formatDate(localArtwork.created_at)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Tipo de obra:</span>
                          <p className="text-gray-900 capitalize">{localArtwork.media_type || 'Contenido'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    localArtwork.user_has_liked
                      ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg 
                    className={`w-4 h-4 ${localArtwork.user_has_liked ? 'fill-current' : 'fill-none'}`}
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={localArtwork.user_has_liked ? 0 : 2} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  <span>{localArtwork.user_has_liked ? 'Quitar Like' : 'Dar Like'}</span>
                </button>

                <button className="flex-1 px-4 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600 transition-colors">
                  Compartir Obra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkModal;
