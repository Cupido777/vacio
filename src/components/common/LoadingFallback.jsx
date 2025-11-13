import React from 'react';

const LoadingFallback = React.memo(({ message = 'Cargando...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mb-4"></div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
});

LoadingFallback.displayName = 'LoadingFallback';

export default LoadingFallback;
