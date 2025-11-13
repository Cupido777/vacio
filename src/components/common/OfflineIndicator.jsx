import React from 'react';
import { WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  return (
    <div className="bg-colonial-coral text-white px-4 py-3 text-center font-caribbean font-semibold sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-center">
        <WifiOff className="h-4 w-4 mr-2" />
        <span>Estás trabajando sin conexión - Algunas funciones pueden no estar disponibles</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
