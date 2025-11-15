import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import ExhibitionOverview from './ExhibitionOverview';
import UserManagement from './UserManagement';
import AnalyticsChart from './AnalyticsChart';
import dashboardService from '../../services/dashboardService';

const Dashboard = ({ currentUser }) => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.is_admin && !currentUser?.is_curator) {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [currentUser, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivity()
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-colonial-sand pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-colonial-sand pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Panel Administrativo
              </h1>
              <p className="text-gray-600">
                Gestiona exposiciones, usuarios y analítica de la plataforma
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <button
                onClick={loadDashboardData}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Actualizar</span>
              </button>
              <div className="text-sm text-gray-500">
                Última actualización: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'overview', name: 'Resumen', icon: '📊' },
              { id: 'exhibitions', name: 'Exposiciones', icon: '🎨' },
              { id: 'users', name: 'Usuarios', icon: '👥' },
              { id: 'analytics', name: 'Analítica', icon: '📈' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-colonial-yellow text-colonial-yellow'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de pestañas */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <>
              {/* Estadísticas rápidas */}
              <DashboardStats stats={stats} />

              {/* Grid principal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Gráfico principal */}
                <div className="lg:col-span-2">
                  <AnalyticsChart data={stats.analytics} />
                </div>

                {/* Acciones rápidas */}
                <div>
                  <QuickActions currentUser={currentUser} />
                </div>
              </div>

              {/* Actividad reciente y resumen de exposiciones */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentActivity activities={recentActivity} />
                <ExhibitionOverview />
              </div>
            </>
          )}

          {activeTab === 'exhibitions' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Gestión de Exposiciones</h2>
              {/* Aquí irá el componente de gestión de exposiciones */}
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🎨</div>
                <p>Módulo de gestión de exposiciones en desarrollo</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <UserManagement currentUser={currentUser} />
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Analítica Detallada</h2>
              {/* Aquí irá el componente de analítica avanzada */}
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📈</div>
                <p>Módulo de analítica avanzada en desarrollo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
