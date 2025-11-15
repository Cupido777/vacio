import React from 'react';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total de Exposiciones',
      value: stats.total_exhibitions || 0,
      change: '+12%',
      trend: 'up',
      icon: '🎨',
      color: 'blue'
    },
    {
      title: 'Usuarios Activos',
      value: stats.active_users || 0,
      change: '+5%',
      trend: 'up',
      icon: '👥',
      color: 'green'
    },
    {
      title: 'Obras Publicadas',
      value: stats.total_artworks || 0,
      change: '+18%',
      trend: 'up',
      icon: '🖼️',
      color: 'purple'
    },
    {
      title: 'Ingresos Mensuales',
      value: `$${stats.monthly_revenue || 0}`,
      change: '+8%',
      trend: 'up',
      icon: '💰',
      color: 'yellow'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      yellow: 'bg-colonial-light-yellow/20 text-colonial-dark-yellow border-colonial-yellow/30'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${getColorClasses(stat.color)}`}>
              {stat.icon}
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{stat.change}</span>
              <svg className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {stat.trend === 'up' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                )}
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
          <p className="text-sm text-gray-600">{stat.title}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
