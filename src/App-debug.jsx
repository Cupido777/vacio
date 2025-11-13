import React from 'react';
import './styles/global.css';

function AppDebug() {
  console.log('🔍 AppDebug está renderizando');
  
  return (
    <div style={{ 
      padding: '20px', 
      background: '#D4AF37', 
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'system-ui'
    }}>
      <h1>✅ ODAM-App - DEBUG</h1>
      <p>Si ves esto, React está funcionando correctamente</p>
      <button onClick={() => alert('¡Funciona!')}>
        Probar Click
      </button>
    </div>
  );
}

export default AppDebug;
