// src/pages/Register.jsx
import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  const handleSwitchToLogin = () => {
    // Navegar a login
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-colonial-sand py-8">
      <div className="container mx-auto px-4">
        <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
      </div>
    </div>
  );
};

export default Register;
