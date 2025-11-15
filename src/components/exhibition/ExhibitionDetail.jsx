import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import exhibitionService from '../../services/exhibitionService';
import HybridExhibition from './HybridExhibition';
import ArtworkModal from './ArtworkModal';

const ExhibitionDetail = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadExhibition();
  }, [id]);

  const loadExhibition = async () => {
    try {
      const data = await exhibitionService.getExhibitionById(id);
      setExhibition(data);
    } catch (error) {
      console.error('Error loading exhibition:', error);
      navigate('/galeria');
    } finally {
      setLoading(false);
    }
  };

  const handleArtworkUpdate = (updatedArtwork) => {
    setExhibition(prev => ({
      ...prev,
      artworks: prev.artworks.map(artwork => 
        artwork.id === updatedArtwork.id ? updatedArtwork : artwork
      )
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-colonial-sand pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-colonial-yellow"></div>
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="min-h-screen bg-colonial-sand pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Exposición no encontrada</h2>
          <button 
            onClick={() => navigate('/galeria')}
            className="text-colonial-yellow hover:text-colonial-dark-yellow"
          >
            Volver a la galería
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-colonial-sand pt-20">
      {/* Header de la exposición */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <button 
                onClick={() => navigate('/galeria')}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Volver a galería</span>
              </button>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{exhibition.title}</h1>
              <p className="text-gray-600 mb-4">{exhibition.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <span>🎨</span>
                  <span>{exhibition.artworks?.length || 0} obras</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>👤</span>
                  <span>Curador: {exhibition.curator_name}</span>
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  exhibition.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : exhibition.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {exhibition.status}
                </span>
              </div>
            </div>

            {currentUser?.id === exhibition.curator_id && (
              <div className="mt-4 lg:mt-0 flex space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Editar
                </button>
                <button className="px-4 py-2 bg-colonial-yellow text-white rounded-lg hover:bg-colonial-dark-yellow transition-colors">
                  Gestionar Obras
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Galería híbrida */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HybridExhibition
          exhibition={exhibition}
          currentUser={currentUser}
          onArtworkUpdate={handleArtworkUpdate}
        />
      </div>

      {/* Modal de obra */}
      <ArtworkModal
        artwork={selectedArtwork}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedArtwork(null);
        }}
        currentUser={currentUser}
        onArtworkUpdate={handleArtworkUpdate}
      />
    </div>
  );
};

export default ExhibitionDetail;
