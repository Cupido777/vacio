import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import CreatePost from '../components/community/CreatePost';
import PostFeed from '../components/community/PostFeed';
import CommunityChallenges from '../components/community/CommunityChallenges';

const Community = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [filters, setFilters] = useState({
    tags: [],
    search: ''
  });

  // Verificar autenticación al cargar la página
  useEffect(() => {
    checkUser();
    
    // Escuchar cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setCurrentUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error verificando usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePostCreated = () => {
    // El PostFeed se actualizará automáticamente a través de props
    setActiveTab('feed');
  };

  const popularTags = [
    'Música', 'Arte', 'Patrimonio', 'Cumbia', 'Bullerengue', 
    'Champeta', 'Fotografía', 'Cartagena', 'Tradición'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cartagena-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cartagena-yellow to-yellow-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Comunidad Cultural
            </h1>
            <p className="text-xl md:text-2xl text-yellow-100 max-w-3xl mx-auto mb-8">
              Conecta, comparte y crea con artistas y amantes del patrimonio de Cartagena
            </p>
            
            {/* Stats de la comunidad */}
            <div className="flex justify-center space-x-8 text-yellow-100">
              <div className="text-center">
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm">Artistas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm">Creaciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm">Retos Activos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar izquierdo */}
          <div className="lg:w-1/4 space-y-6">
            {/* Tarjeta de usuario */}
            {currentUser ? (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-cartagena-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">
                    {currentUser.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
                     currentUser.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Usuario'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">Miembro de la comunidad</p>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-500 text-xl">👤</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Únete a la Comunidad
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Inicia sesión para compartir tus creaciones y conectar con otros artistas
                </p>
                <a
                  href="/auth"
                  className="block w-full px-4 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Iniciar Sesión
                </a>
              </div>
            )}

            {/* Filtros rápidos */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filtros Rápidos</h3>
              
              {/* Búsqueda */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Palabras clave..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
                />
              </div>

              {/* Etiquetas populares */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiquetas Populares
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleFilterChange({ 
                        tags: filters.tags.includes(tag) 
                          ? filters.tags.filter(t => t !== tag)
                          : [...filters.tags, tag]
                      })}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-cartagena-blue text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                
                {/* Limpiar filtros */}
                {(filters.tags.length > 0 || filters.search) && (
                  <button
                    onClick={() => setFilters({ tags: [], search: '' })}
                    className="w-full mt-3 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpiar Filtros
                  </button>
                )}
              </div>
            </div>

            {/* Información de la comunidad */}
            <div className="bg-cartagena-blue text-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold mb-3">💡 Guía de la Comunidad</h3>
              <ul className="text-sm space-y-2 text-blue-100">
                <li>• Respeta todas las creaciones artísticas</li>
                <li>• Da crédito cuando compartas obras de otros</li>
                <li>• Usa etiquetas relevantes</li>
                <li>• Participa en retos culturales</li>
                <li>• Reporta contenido inapropiado</li>
              </ul>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:w-3/4 space-y-8">
            {/* Navegación por pestañas */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('feed')}
                    className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'feed'
                        ? 'border-cartagena-yellow text-cartagena-yellow'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📝 Feed de la Comunidad
                  </button>
                  <button
                    onClick={() => setActiveTab('challenges')}
                    className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'challenges'
                        ? 'border-cartagena-yellow text-cartagena-yellow'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🎯 Retos Culturales
                  </button>
                </nav>
              </div>

              {/* Contenido de las pestañas */}
              <div className="p-6">
                {activeTab === 'feed' ? (
                  <div className="space-y-8">
                    {/* Crear publicación */}
                    <CreatePost 
                      currentUser={currentUser}
                      onPostCreated={handlePostCreated}
                    />

                    {/* Feed de publicaciones */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Publicaciones Recientes
                      </h2>
                      <PostFeed 
                        currentUser={currentUser}
                        filters={filters}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Retos Culturales Activos
                    </h2>
                    <p className="text-gray-600">
                      Participa en nuestros retos culturales y muestra tu talento artístico. 
                      Los mejores trabajos serán destacados en nuestra galería comunitaria.
                    </p>
                    <CommunityChallenges currentUser={currentUser} />
                  </div>
                )}
              </div>
            </div>

            {/* Sección de estadísticas (solo en feed) */}
            {activeTab === 'feed' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🌟 Comunidad en Crecimiento
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-cartagena-blue">150+</div>
                    <div className="text-sm text-gray-600">Artistas</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">324</div>
                    <div className="text-sm text-gray-600">Publicaciones</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">1.2K</div>
                    <div className="text-sm text-gray-600">Interacciones</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-gray-600">Retos Completados</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer de la comunidad */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold mb-2">
            Comunidad Cultural de Cartagena
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Un espacio para preservar, compartir y celebrar el patrimonio vivo de nuestra ciudad. 
            Juntos construimos la cultura del mañana.
          </p>
          <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-400">
            <a href="/about" className="hover:text-white transition-colors">Acerca de</a>
            <a href="/guidelines" className="hover:text-white transition-colors">Normas</a>
            <a href="/contact" className="hover:text-white transition-colors">Contacto</a>
            <a href="/help" className="hover:text-white transition-colors">Ayuda</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
