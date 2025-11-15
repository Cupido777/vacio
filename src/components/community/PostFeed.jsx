import React, { useState, useEffect } from 'react';
import { communityService } from '../../services/communityService';
import PostCard from './PostCard';

const PostFeed = ({ currentUser, filters = {} }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Cargar posts al montar el componente o cuando cambien los filtros
  useEffect(() => {
    loadPosts(true); // reset = true
  }, [filters]);

  const loadPosts = async (reset = false) => {
    if (reset) {
      setPage(0);
      setHasMore(true);
    }

    try {
      if (reset) {
        setLoading(true);
      }

      setError(null);
      const { data, error } = await communityService.getPosts({
        ...filters,
        page: reset ? 0 : page
      });
      
      if (error) throw error;

      if (reset) {
        setPosts(data || []);
      } else {
        setPosts(prev => [...prev, ...(data || [])]);
      }

      // Simular paginación - en una implementación real, el backend debería indicar si hay más páginas
      setHasMore(data && data.length >= 10); // Asumiendo 10 posts por página

      if (!reset) {
        setPage(prev => prev + 1);
      }

    } catch (err) {
      console.error('Error cargando posts:', err);
      setError('Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadPosts(false);
    }
  };

  const handlePostUpdate = () => {
    // Recargar posts cuando haya interacciones (likes, comentarios)
    loadPosts(true);
  };

  const handlePostCreated = () => {
    // Recargar posts cuando se cree uno nuevo
    loadPosts(true);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-6">
        {/* Skeletons de carga */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="flex space-x-4 mt-4 pt-4 border-t border-gray-200">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={() => loadPosts(true)}
            className="mt-2 text-sm text-red-800 underline hover:text-red-900"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Lista de posts */}
      {posts.length > 0 ? (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onUpdate={handlePostUpdate}
              />
            ))}
          </div>

          {/* Botón de cargar más */}
          {hasMore && (
            <div className="flex justify-center pt-6">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cartagena-yellow"></div>
                    <span>Cargando...</span>
                  </div>
                ) : (
                  'Cargar más publicaciones'
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Estado vacío */
        <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No hay publicaciones aún
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {Object.keys(filters).length > 0 
              ? 'No se encontraron publicaciones con los filtros aplicados.'
              : 'Sé el primero en compartir tu creación artística con la comunidad.'
            }
          </p>
          {Object.keys(filters).length > 0 && (
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Indicador de carga para paginación */}
      {loading && posts.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cartagena-yellow"></div>
        </div>
      )}
    </div>
  );
};

export default PostFeed;
