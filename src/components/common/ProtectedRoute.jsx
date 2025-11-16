import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from './LoadingStates';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  fallbackPath = '/login',
  showLoading = true 
}) => {
  const { currentUser, loading } = useAuth();

  // Mostrar loading mientras se verifica autenticación
  if (loading && showLoading) {
    return <LoadingSpinner text="Verificando acceso..." />;
  }

  // Si no está autenticado, redirigir al login
  if (!currentUser) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && currentUser.user_metadata?.role) {
    const userRole = currentUser.user_metadata.role;
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(userRole)
      : userRole === requiredRole;

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Usuario autenticado y con permisos, renderizar children
  return children;
};

export default ProtectedRoute;

// Componente para rutas públicas (evitar que usuarios logueados accedan a login/register)
export const PublicRoute = ({ children, fallbackPath = '/' }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Cargando..." />;
  }

  // Si ya está autenticado, redirigir al dashboard
  if (currentUser) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};
