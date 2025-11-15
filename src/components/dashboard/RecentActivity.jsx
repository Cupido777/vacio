import React from 'react';

const RecentActivity = ({ activities }) => {
  const recentActivities = activities || [
    {
      id: 1,
      user: 'María González',
      action: 'creó la exposición',
      target: 'Arte Colonial Cartagenero',
      time: 'Hace 5 minutos',
      type: 'exhibition_created',
      avatar: '👩'
    },
    {
      id: 2,
      user: 'Carlos Rodríguez',
      action: 'subió una nueva obra',
      target: 'Paisaje Caribe',
      time: 'Hace 15 minutos',
      type: 'artwork_uploaded',
      avatar: '👨'
    },
    {
      id: 3,
      user: 'Ana Martínez',
      action: 'comentó en',
      target: 'Exposición Virtual 2024',
      time: 'Hace 30 minutos',
      type: 'comment_added',
      avatar: '👩'
    },
    {
      id: 4,
      user: 'Sistema',
      action: 'exportó reporte',
      target: 'Métricas Mensuales',
      time: 'Hace 1 hora',
      type: 'report_generated',
      avatar: '🤖'
    },
    {
      id: 5,
      user: 'Pedro López',
      action: 'actualizó el perfil de',
      target: 'Galería Central',
      time: 'Hace 2 horas',
      type: 'profile_updated',
      avatar: '👨'
    }
  ];

  const getActivityColor = (type) => {
    const colors = {
      exhibition_created: 'bg-green-100 text-green-800',
      artwork_uploaded: 'bg-blue-100 text-blue-800',
      comment_added: 'bg-purple-100 text-purple-800',
      report_generated: 'bg-gray-100 text-gray-800',
      profile_updated: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getActivityIcon = (type) => {
    const icons = {
      exhibition_created: '🎨',
      artwork_uploaded: '🖼️',
      comment_added: '💬',
      report_generated: '📊',
      profile_updated: '⚙️'
    };
    return icons[type] || '📝';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
        <button className="text-sm text-colonial-yellow hover:text-colonial-dark-yellow font-medium">
          Ver todo
        </button>
      </div>

      <div className="space-y-4">
        {recentActivities.map(activity => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.type)}`}>
              {activity.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span>
                <span className="text-gray-600"> {activity.action} </span>
                <span className="font-medium text-colonial-dark-blue">{activity.target}</span>
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">{activity.time}</span>
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getActivityColor(activity.type)}`}>
                  <span>{getActivityIcon(activity.type)}</span>
                  <span className="capitalize">{activity.type.replace('_', ' ')}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de actividad */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">24</div>
            <div className="text-sm text-gray-500">Actividades hoy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">89%</div>
            <div className="text-sm text-gray-500">Usuarios activos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
