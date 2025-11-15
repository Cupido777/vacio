import React, { useState, useEffect } from 'react';

const ExhibitionSync = ({ 
  exhibition, 
  physicalArtworks, 
  virtualArtworks, 
  currentUser,
  onSyncStatusChange 
}) => {
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSync, setLastSync] = useState(new Date());
  const [syncProgress, setSyncProgress] = useState(100);

  // Calcular métricas de sincronización
  const syncMetrics = {
    totalArtworks: exhibition?.artworks?.length || 0,
    physicalOnly: physicalArtworks.filter(artwork => 
      !virtualArtworks.some(v => v.id === artwork.id)
    ).length,
    virtualOnly: virtualArtworks.filter(artwork => 
      !physicalArtworks.some(p => p.id === artwork.id)
    ).length,
    both: physicalArtworks.filter(artwork => 
      virtualArtworks.some(v => v.id === artwork.id)
    ).length
  };

  useEffect(() => {
    // Simular cambios de estado de sincronización
    if (syncMetrics.physicalOnly > 0 || syncMetrics.virtualOnly > 0) {
      setSyncStatus('out-of-sync');
      onSyncStatusChange('out-of-sync');
    } else {
      setSyncStatus('synced');
      onSyncStatusChange('synced');
    }
  }, [syncMetrics, onSyncStatusChange]);

  const handleSync = async () => {
    setSyncStatus('syncing');
    setSyncProgress(0);
    onSyncStatusChange('syncing');

    // Simular proceso de sincronización
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSyncProgress(i);
    }

    setSyncStatus('synced');
    setLastSync(new Date());
    onSyncStatusChange('synced');
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'synced': return 'bg-green-100 text-green-800 border-green-200';
      case 'syncing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out-of-sync': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'synced': return '✅';
      case 'syncing': return '🔄';
      case 'out-of-sync': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">🔄</span>
        Sincronización Híbrida
      </h3>

      {/* Estado de sincronización */}
      <div className={`border rounded-lg p-3 mb-4 ${getStatusColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon()}</span>
            <div>
              <p className="font-medium">
                {syncStatus === 'synced' && 'Completamente sincronizado'}
                {syncStatus === 'syncing' && 'Sincronizando...'}
                {syncStatus === 'out-of-sync' && 'Requiere sincronización'}
              </p>
              <p className="text-sm opacity-80">
                Última sync: {lastSync.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          {syncStatus === 'out-of-sync' && (
            <button
              onClick={handleSync}
              className="bg-cartagena-yellow text-white px-3 py-1 rounded text-sm font-medium hover:bg-yellow-600 transition-colors"
            >
              Sincronizar
            </button>
          )}
        </div>

        {/* Barra de progreso */}
        {syncStatus === 'syncing' && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-cartagena-yellow h-2 rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1">
              {syncProgress}% completado
            </p>
          </div>
        )}
      </div>

      {/* Métricas de sincronización */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-blue-50 p-2 rounded text-center">
          <div className="text-lg font-bold text-blue-700">{syncMetrics.both}</div>
          <div className="text-blue-600">En ambos</div>
        </div>
        <div className="bg-green-50 p-2 rounded text-center">
          <div className="text-lg font-bold text-green-700">{syncMetrics.physicalOnly}</div>
          <div className="text-green-600">Solo físico</div>
        </div>
        <div className="bg-purple-50 p-2 rounded text-center">
          <div className="text-lg font-bold text-purple-700">{syncMetrics.virtualOnly}</div>
          <div className="text-purple-600">Solo virtual</div>
        </div>
        <div className="bg-gray-50 p-2 rounded text-center">
          <div className="text-lg font-bold text-gray-700">{syncMetrics.totalArtworks}</div>
          <div className="text-gray-600">Total obras</div>
        </div>
      </div>

      {/* Recomendaciones */}
      {(syncMetrics.physicalOnly > 0 || syncMetrics.virtualOnly > 0) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 text-sm mb-1">Recomendaciones</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            {syncMetrics.physicalOnly > 0 && (
              <li>• {syncMetrics.physicalOnly} obras solo en exhibición física</li>
            )}
            {syncMetrics.virtualOnly > 0 && (
              <li>• {syncMetrics.virtualOnly} obras solo en exhibición virtual</li>
            )}
            <li>• Considera sincronizar para una experiencia unificada</li>
          </ul>
        </div>
      )}

      {/* Información para curadores */}
      {currentUser?.id === exhibition?.curator_id && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 text-sm mb-1">Panel del Curador</h4>
          <p className="text-xs text-blue-700">
            Como curador, puedes gestionar la distribución de obras entre 
            las modalidades física y virtual desde el panel de administración.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExhibitionSync;
