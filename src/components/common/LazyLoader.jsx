import React, { Suspense, Component } from 'react';

class LazyLoaderErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LazyLoader Error Boundary caught an error:', error, errorInfo);
    
    // Log to error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      retryCount: prev => prev + 1 
    });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback ? (
        this.props.fallback
      ) : (
        <div className="lazy-loader-error flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-gray-200">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-caribbean text-gray-800 mb-2">
            Error al cargar el componente
          </h3>
          <p className="text-gray-600 text-sm mb-4 max-w-md">
            {this.state.error?.message || 'No se pudo cargar el contenido solicitado.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="bg-colonial-yellow text-colonial-blue px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50"
              disabled={this.state.retryCount >= 3}
            >
              {this.state.retryCount >= 3 ? 'Máximo de reintentos' : 'Reintentar'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Recargar página
            </button>
          </div>
          {this.state.retryCount > 0 && (
            <p className="text-xs text-gray-500 mt-3">
              Reintentos: {this.state.retryCount}/3
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const LazyLoader = ({ 
  component, 
  fallback, 
  onError,
  retryDelay = 1000,
  ...props 
}) => {
  const [LazyComponent, setLazyComponent] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(null);

  const defaultFallback = (
    <div className="lazy-loader-default flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-colonial-yellow mb-4"></div>
      <p className="text-gray-600 text-sm">Cargando contenido...</p>
    </div>
  );

  React.useEffect(() => {
    let isMounted = true;
    let retryTimeout;

    const loadComponent = async (retryCount = 0) => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const loadedComponent = await component();
        
        if (isMounted) {
          setLazyComponent(() => loadedComponent.default || loadedComponent);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error);
          setIsLoading(false);
          
          if (retryCount < 3) {
            retryTimeout = setTimeout(() => {
              loadComponent(retryCount + 1);
            }, retryDelay * (retryCount + 1));
          }
          
          if (onError) {
            onError(error, retryCount);
          }
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [component, retryDelay, onError]);

  if (isLoading) {
    return fallback || defaultFallback;
  }

  if (loadError && !LazyComponent) {
    return (
      <LazyLoaderErrorBoundary fallback={fallback} onError={onError}>
        <div>Error de carga</div>
      </LazyLoaderErrorBoundary>
    );
  }

  if (!LazyComponent) {
    return fallback || defaultFallback;
  }

  return (
    <LazyLoaderErrorBoundary fallback={fallback} onError={onError}>
      <Suspense fallback={fallback || defaultFallback}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyLoaderErrorBoundary>
  );
};

// Higher Order Component for lazy loading with preloading
export const withLazyLoading = (componentImport, options = {}) => {
  return (props) => (
    <LazyLoader 
      component={componentImport} 
      fallback={options.fallback}
      onError={options.onError}
      retryDelay={options.retryDelay}
      {...props}
    />
  );
};

// Preload hook for critical components
export const usePreload = (componentImport) => {
  const [isPreloaded, setIsPreloaded] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const preload = async () => {
      try {
        await componentImport();
        if (isMounted) {
          setIsPreloaded(true);
        }
      } catch (error) {
        console.warn('Preload failed:', error);
      }
    };

    // Preload on idle callback if available
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preload);
    } else {
      setTimeout(preload, 1000);
    }

    return () => {
      isMounted = false;
    };
  }, [componentImport]);

  return isPreloaded;
};

export default React.memo(LazyLoader);
