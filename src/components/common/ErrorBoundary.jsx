import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('🔥 ErrorBoundary capturó un error:', error);
    console.error('📋 Component Stack:', errorInfo.componentStack);
    
    // Log adicional para debugging
    if (error.toString().includes('Cannot find') || error.toString().includes('undefined')) {
      console.error('🔍 Posible error de importación o componente faltante');
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-colonial-sand p-4">
          <div className="text-center max-w-md">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              <h2 className="font-bold text-lg mb-2">Error en la aplicación</h2>
              <p className="text-sm mb-2">{this.state.error?.toString()}</p>
              {this.state.errorInfo && (
                <details className="text-xs text-left mt-2">
                  <summary className="cursor-pointer font-medium">Detalles técnicos</summary>
                  <pre className="whitespace-pre-wrap mt-2 bg-red-50 p-2 rounded text-left">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-colonial-yellow text-colonial-blue px-6 py-3 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors"
            >
              Recargar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
