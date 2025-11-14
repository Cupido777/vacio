// Login.jsx debería verse así:
import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const handleSwitchToRegister = () => {
    window.location.href = '/registro';
  };

  const handleForgotPassword = () => {
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
