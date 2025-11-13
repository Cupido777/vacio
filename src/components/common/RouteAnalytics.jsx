import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteAnalytics = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log(`Página visitada: ${location.pathname}`);
    
    // En producción, aquí iría el código de Google Analytics
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
};

export default RouteAnalytics;
