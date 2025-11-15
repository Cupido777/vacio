import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ currentUser }) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Crear Exposición',
      description: 'Nueva exposición virtual o presencial',
      icon: '🎨',
      color: 'bg-colonial-yellow',
      action: () => navigate('/create-exhibition'),
      permissions: ['admin', 'curator']
    },
    {
      title: 'Gestionar Usuarios',
      description: 'Administrar roles y permisos',
      icon: '👥',
      color: 'bg-colonial-blue',
      action: () => navigate('/admin/users'),
      permissions: ['admin']
    },
    {
      title: 'Subir Obras',
      description: 'Agregar nuevas obras de arte',
      icon: '🖼️',
      color: 'bg-colonial-coral',
      action: () => navigate('/upload-artwork'),
      permissions: ['admin', 'curator']
    },
    {
      title: 'Ver Reportes',
      description: 'Reportes de analítica y métricas',
      icon: '📊',
      color: 'bg-colonial-terracotta',
      action: () => navigate('/admin/reports'),
      permissions: ['admin', 'curator']
    },
    {
      title: 'Configuración',
      description: 'Ajustes de la plataforma',
      icon: '⚙️',
      color: 'bg-gray-600',
      action: () => navigate('/admin/settings'),
      permissions: ['admin']
    },
    {
      title: 'Soporte',
      description: 'Centro de ayuda y soporte',
      icon: '💬',
      color: 'bg-green-500',
      action: () => navigate('/support'),
      permissions: ['admin', 'curator', 'user']
    }
  ];

  const hasPermission = (permissions) => {
    if (!currentUser) return false;
    if (permissions.includes('user')) return true;
    if (currentUser.is_admin && permissions.includes('admin')) return true;
    if (currentUser.is_curator && permissions.includes('curator')) return true;
    return false;
  };

  const filteredActions = actions.filter(action => hasPermission(action.permissions));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
      <div className="space-y-3">
        {filteredActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-colonial-yellow hover:bg-colonial-sand/50 transition-all duration-200 group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${action.color} group-hover:scale-110 transition-transform`}>
              <span className="text-lg">{action.icon}</span>
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900 group-hover:text-colonial-dark-yellow transition-colors">
                {action.title}
              </div>
              <div className="text-sm text-gray-500">{action.description}</div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-colonial-yellow transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
