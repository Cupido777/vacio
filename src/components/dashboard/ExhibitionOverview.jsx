import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exhibitionService } from '../../services/exhibitionService';
const ExhibitionOverview = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    try {
      const data = await exhibitionService.getExhibitions({ limit: 5 });
      setExhibitions(data.exhibitions || []);
    } catch (error) {
      console.error('Error loading exhibitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.draft;
  };

  const getTypeIcon = (type) => {
    const icons = {
      virtual: '💻',
      physical: '🏛️',
      hybrid: '🔄'
    };
    return icons[type] || '🎨';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Exposiciones Recientes</h3>
        <button 
          onClick={() => navigate('/admin/exhibitions')}
          className="text-sm text-colonial-yellow hover:text-colonial-dark-yellow font-medium"
        >
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {exhibitions.length > 0 ? (
          exhibitions.map(exhibition => (
            <div
              key={exhibition.id}
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-colonial-yellow hover:bg-colonial-sand/30 transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/exhibition/${exhibition.id}`)}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                {getTypeIcon(exhibition.exhibition_type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{exhibition.title}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exhibition.status)}`}>
                    {exhibition.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {exhibition.artworks_count || 0} obras
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {exhibition.visitors_count || 0}
                </div>
                <div className="text-xs text-gray-500">visitantes</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎨</div>
            <p>No hay exposiciones recientes</p>
          </div>
        )}
      </div>

      {/* Métricas rápidas */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {exhibitions.filter(e => e.status === 'active').length}
            </div>
            <div className="text-xs text-gray-500">Activas</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {exhibitions.filter(e => e.exhibition_type === 'virtual').length}
            </div>
            <div className="text-xs text-gray-500">Virtuales</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {exhibitions.reduce((total, e) => total + (e.visitors_count || 0), 0)}
            </div>
            <div className="text-xs text-gray-500">Total visitas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionOverview;
