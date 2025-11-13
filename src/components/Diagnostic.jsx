import React from 'react';

const Diagnostic = () => {
  console.log('🔍 DIAGNÓSTICO INICIADO');

  // Verificar elementos críticos
  const checks = [
    { name: 'Root container', check: () => !!document.getElementById('root') },
    { name: 'React global', check: () => !!window.React },
    { name: 'CSS cargado', check: () => !!document.querySelector('style, link[rel="stylesheet"]') },
    { name: 'Body visible', check: () => document.body.style.display !== 'none' },
  ];

  checks.forEach(check => {
    const result = check.check();
    console.log(`${result ? '✅' : '❌'} ${check.name}: ${result}`);
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🎯 DIAGNÓSTICO ODAM-App</h1>
        
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <h3>🔍 Verificaciones:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {checks.map((check, index) => (
              <li key={index} style={{ margin: '10px 0' }}>
                {check.check() ? '✅' : '❌'} {check.name}
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={() => {
            console.clear();
            console.log('🔄 Reiniciando diagnóstico...');
            window.location.reload();
          }}
          style={{
            background: '#D4AF37',
            color: '#1A202C',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          🔄 Reiniciar
        </button>

        <button 
          onClick={() => {
            // Forzar error para ver stack trace
            try {
              throw new Error('Error de prueba para ver stack trace');
            } catch (e) {
              console.error('🧪 Error de prueba:', e);
            }
          }}
          style={{
            background: '#10B981',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          🧪 Test Error
        </button>
      </div>
    </div>
  );
};

export default Diagnostic;
