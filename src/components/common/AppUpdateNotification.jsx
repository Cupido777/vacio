import React from 'react';
import { RefreshCw } from 'lucide-react';

const AppUpdateNotification = () => {
  return (
    <div className="bg-colonial-yellow text-colonial-blue px-4 py-3 text-center font-caribbean font-semibold sticky top-0 z-50 hidden">
      <div className="container mx-auto flex items-center justify-between">
        <span className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Nueva versión disponible
        </span>
        <button className="bg-colonial-blue text-white px-4 py-1 rounded-lg hover:bg-colonial-dark-blue transition-colors text-sm font-semibold">
          Actualizar
        </button>
      </div>
    </div>
  );
};

export default AppUpdateNotification;
