import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/global.css';

console.log('🚀 ODAM-App: Iniciando aplicación...');

// Preload critical resources
const preloadCriticalResources = () => {
  console.log('📦 Precargando recursos críticos...');
  try {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap';
    fontLink.as = 'style';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);

    // DNS prefetch for external domains
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = 'https://fonts.googleapis.com';
    document.head.appendChild(dnsPrefetch);

    const dnsPrefetch2 = document.createElement('link');
    dnsPrefetch2.rel = 'dns-prefetch';
    dnsPrefetch2.href = 'https://fonts.gstatic.com';
    document.head.appendChild(dnsPrefetch2);

    console.log('✅ Recursos críticos precargados');
  } catch (error) {
    console.warn('⚠️ Error en preload de recursos:', error);
  }
};

// Execute preload before React initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', preloadCriticalResources);
} else {
  preloadCriticalResources();
}

// Performance monitoring
const observePerformance = () => {
  if ('performance' in window) {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    if (navigationTiming) {
      console.debug('📊 Performance Metrics:', {
        domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.navigationStart,
        loadComplete: navigationTiming.loadEventEnd - navigationTiming.navigationStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      });
    }
  }
};

// Error handling for React initialization
const initializeApp = () => {
  try {
    console.log('🔍 Buscando contenedor root...');
    const container = document.getElementById('root');
    
    if (!container) {
      throw new Error('Root container not found');
    }

    console.log('✅ Root container encontrado');
    console.log('⚛️ Inicializando React...');

    const root = ReactDOM.createRoot(container);
    
    console.log('🎨 Renderizando aplicación...');

    root.render(
      <React.StrictMode>
        <ErrorBoundary 
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-colonial-sand">
              <div className="text-center p-8">
                <h1 className="text-2xl font-traditional text-colonial-blue mb-4">
                  Error Inicializando la Aplicación
                </h1>
                <p className="text-red-600 mb-4 text-sm">
                  Revisa la consola del navegador (F12) para detalles del error
                </p>
                <button 
                  onClick={() => {
                    console.clear();
                    window.location.reload();
                  }}
                  className="bg-colonial-yellow text-colonial-blue px-6 py-3 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors"
                >
                  Recargar Aplicación
                </button>
              </div>
            </div>
          }
        >
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );

    console.log('✅ Aplicación renderizada exitosamente');

    // Observe performance after render
    setTimeout(observePerformance, 1000);

  } catch (error) {
    console.error('❌ Failed to initialize React application:', error);
    
    // Fallback UI for critical initialization errors
    const container = document.getElementById('root');
    if (container) {
      container.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #F8F4E9; font-family: system-ui;">
          <div style="text-align: center; padding: 2rem; max-width: 500px;">
            <h1 style="font-size: 1.5rem; color: #DC2626; margin-bottom: 1rem;">
              ❌ Error Crítico - ODAM-App
            </h1>
            <div style="background: #FEE2E2; border: 1px solid #FECACA; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; text-align: left;">
              <strong style="color: #DC2626;">Error:</strong>
              <div style="color: #7F1D1D; font-family: monospace; font-size: 0.875rem; margin-top: 0.5rem;">
                ${error.toString()}
              </div>
            </div>
            <p style="color: #4A5568; margin-bottom: 1.5rem;">
              Abre las herramientas de desarrollo (F12) y revisa la pestaña Console para más información.
            </p>
            <button 
              onclick="window.location.reload()" 
              style="background: #D4AF37; color: #1A202C; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600; margin: 0.25rem;"
            >
              Recargar Página
            </button>
            <button 
              onclick="console.clear(); window.location.reload()" 
              style="background: #E5E7EB; color: #374151; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600; margin: 0.25rem;"
            >
              Limpiar y Recargar
            </button>
          </div>
        </div>
      `;
    }
  }
};

// Initialize app with error handling
console.log('🎯 Inicializando aplicación...');
initializeApp();

// Service Worker registration for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('Service Worker registration failed:', error);
    });
  });
}

// Export for potential testing
export default initializeApp;
