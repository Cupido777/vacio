// src/pages/Login.jsx
import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const handleSwitchToRegister = () => {
    // Navegar a registro
    window.location.href = '/registro';
  };

  const handleForgotPassword = () => {
    // Navegar a recuperación de contraseña
    window.location.href = '/recuperar-contrasena';
  };

  return (
    <div className="min-h-screen bg-colonial-sand py-8">
      <div className="container mx-auto px-4">
        <LoginForm 
          onSwitchToRegister={handleSwitchToRegister}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    </div>
  );
};

export default Login;
