import React, { useState, useEffect } from 'react';
import { Settings, Shield, Database, Users, AlertTriangle, LogOut } from 'lucide-react';

// Security roles and permissions
const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  VIEWER: 'viewer'
};

const PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['read', 'write', 'delete', 'manage_users'],
  [USER_ROLES.MODERATOR]: ['read', 'write'],
  [USER_ROLES.VIEWER]: ['read']
};

const useAdminSecurity = () => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [securityLog, setSecurityLog] = useState([]);

  const logSecurityEvent = (event, severity = 'info') => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      userAgent: navigator.userAgent
    };
    
    setSecurityLog(prev => [logEntry, ...prev.slice(0, 99)]); // Keep last 100 entries
    
    if (severity === 'error') {
      console.error('Security Event:', event);
    }
  };

  const hasPermission = (permission) => {
    return userRole && PERMISSIONS[userRole]?.includes(permission);
  };

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      const role = localStorage.getItem('user_role');
      
      if (token && role && Object.values(USER_ROLES).includes(role)) {
        setUserRole(role);
        setIsAuthenticated(true);
        logSecurityEvent('User authenticated successfully', 'info');
      } else {
        logSecurityEvent('Unauthorized access attempt', 'warn');
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_role');
    setUserRole(null);
    setIsAuthenticated(false);
    logSecurityEvent('User logged out', 'info');
  };

  return {
    userRole,
    isAuthenticated,
    hasPermission,
    securityLog,
    logSecurityEvent,
    logout
  };
};

const Admin = () => {
  const { 
    isAuthenticated, 
    userRole, 
    hasPermission, 
    securityLog, 
    logout 
  } = useAdminSecurity();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-colonial-sand py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-caribbean text-gray-700 mb-4">
              Acceso No Autorizado
            </h2>
            <p className="text-gray-600 mb-6">
              Debes iniciar sesión para acceder al panel administrativo.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-colonial-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ir a Inicio de Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-colonial-sand py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-traditional text-colonial-blue">
            Panel Administrativo
          </h1>
          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-colonial-coral mx-auto mb-4" />
            <h2 className="text-2xl font-caribbean text-gray-700 mb-2">
              Área Administrativa
            </h2>
            <p className="text-gray-600">
              Rol actual: <span className="font-semibold capitalize">{userRole}</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {hasPermission('read') && (
              <div className="bg-colonial-sand rounded-xl p-6 text-center">
                <Database className="h-8 w-8 text-colonial-blue mx-auto mb-3" />
                <h3 className="font-caribbean font-semibold text-colonial-blue mb-2">
                  Gestión de Contenido
                </h3>
                <p className="text-gray-600 text-sm">Cursos, patrimonio, galería</p>
              </div>
            )}

            {hasPermission('manage_users') && (
              <div className="bg-colonial-sand rounded-xl p-6 text-center">
                <Users className="h-8 w-8 text-colonial-coral mx-auto mb-3" />
                <h3 className="font-caribbean font-semibold text-colonial-blue mb-2">
                  Gestión de Usuarios
                </h3>
                <p className="text-gray-600 text-sm">Usuarios, permisos, roles</p>
              </div>
            )}

            {hasPermission('write') && (
              <div className="bg-colonial-sand rounded-xl p-6 text-center">
                <Settings className="h-8 w-8 text-colonial-terracotta mx-auto mb-3" />
                <h3 className="font-caribbean font-semibold text-colonial-blue mb-2">
                  Configuración
                </h3>
                <p className="text-gray-600 text-sm">Ajustes del sistema</p>
              </div>
            )}
          </div>

          {/* Security Log */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-caribbean text-gray-700 mb-4">
              Registro de Seguridad
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              {securityLog.slice(0, 10).map((log, index) => (
                <div key={index} className="text-sm text-gray-600 border-b border-gray-200 py-2 last:border-b-0">
                  <span className={`font-mono text-xs ${
                    log.severity === 'error' ? 'text-red-500' : 
                    log.severity === 'warn' ? 'text-yellow-500' : 'text-gray-500'
                  }`}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {' - '}
                  {log.event}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
