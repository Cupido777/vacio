import React, { createContext, useContext, useState } from 'react';

const AppUpdateContext = createContext();

export const useAppUpdate = () => {
  const context = useContext(AppUpdateContext);
  if (!context) {
    throw new Error('useAppUpdate debe usarse dentro de AppUpdateProvider');
  }
  return context;
};

export const AppUpdateProvider = ({ children }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkForUpdates = () => {
    // Lógica para verificar actualizaciones
    console.log('Verificando actualizaciones...');
  };

  const value = {
    updateAvailable,
    setUpdateAvailable,
    checkForUpdates
  };

  return (
    <AppUpdateContext.Provider value={value}>
      {children}
    </AppUpdateContext.Provider>
  );
};
