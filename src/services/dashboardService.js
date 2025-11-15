import api from './api';

class DashboardService {
  // Obtener estadísticas del dashboard
  async getStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      // Simular datos para desarrollo
      return {
        total_exhibitions: 24,
        active_users: 156,
        total_artworks: 342,
        monthly_revenue: 12500,
        analytics: [
          { name: 'Lun', visitas: 400, interacciones: 240 },
          { name: 'Mar', visitas: 300, interacciones: 139 },
          { name: 'Mié', visitas: 200, interacciones: 980 },
          { name: 'Jue', visitas: 278, interacciones: 390 },
          { name: 'Vie', visitas: 189, interacciones: 480 },
          { name: 'Sáb', visitas: 239, interacciones: 380 },
          { name: 'Dom', visitas: 349, interacciones: 430 },
        ]
      };
    }
  }

  // Obtener actividad reciente
  async getRecentActivity() {
    try {
      const response = await api.get('/dashboard/activity');
      return response.data;
    } catch (error) {
      // Simular datos para desarrollo
      return [
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
        }
      ];
    }
  }

  // Obtener lista de usuarios
  async getUsers() {
    try {
      const response = await api.get('/dashboard/users');
      return response.data;
    } catch (error) {
      // Simular datos para desarrollo
      return {
        users: [
          {
            id: 1,
            name: 'Ana Martínez',
            email: 'ana@example.com',
            role: 'admin',
            status: 'active',
            created_at: '2024-01-15'
          },
          {
            id: 2,
            name: 'Carlos López',
            email: 'carlos@example.com',
            role: 'curator',
            status: 'active',
            created_at: '2024-01-20'
          },
          {
            id: 3,
            name: 'María García',
            email: 'maria@example.com',
            role: 'artist',
            status: 'active',
            created_at: '2024-02-01'
          },
          {
            id: 4,
            name: 'Pedro Rodríguez',
            email: 'pedro@example.com',
            role: 'user',
            status: 'inactive',
            created_at: '2024-02-05'
          }
        ]
      };
    }
  }

  // Actualizar rol de usuario
  async updateUserRole(userId, newRole) {
    try {
      const response = await api.put(`/dashboard/users/${userId}/role`, { role: newRole });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Actualizar estado de usuario
  async updateUserStatus(userId, newStatus) {
    try {
      const response = await api.put(`/dashboard/users/${userId}/status`, { status: newStatus });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener reportes
  async getReports(type = 'monthly') {
    try {
      const response = await api.get(`/dashboard/reports?type=${type}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Manejo de errores
  handleError(error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error del servidor');
    } else if (error.request) {
      throw new Error('Error de conexión. Por favor verifica tu conexión a internet.');
    } else {
      throw new Error('Error inesperado. Por favor intenta nuevamente.');
    }
  }
}

export default new DashboardService();
