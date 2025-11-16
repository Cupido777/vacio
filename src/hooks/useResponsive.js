import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowSize({ width, height: window.innerHeight });

      // Determinar tipo de dispositivo
      if (width < 768) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';

  return {
    windowSize,
    deviceType,
    isMobile,
    isTablet,
    isDesktop
  };
};

// Componente responsive wrapper
export const ResponsiveContainer = ({ 
  children, 
  mobileClassName = '', 
  tabletClassName = '', 
  desktopClassName = '' 
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const getClassName = () => {
    if (isMobile) return mobileClassName;
    if (isTablet) return tabletClassName;
    return desktopClassName;
  };

  return (
    <div className={getClassName()}>
      {children}
    </div>
  );
};
