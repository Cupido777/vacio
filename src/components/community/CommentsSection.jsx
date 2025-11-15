import React, { useState, useEffect } from 'react';
import { communityService } from '../../services/communityService';

const CommentsSection = ({ postId, currentUser, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  // Cargar comentarios al montar el componente
  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await communityService.getCommentsByPost(postId);
      
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error cargando comentarios:', err);
      setError('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    if (!currentUser) {
      alert('Debes iniciar sesión para comentar');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const commentData = {
        post_id: postId,
        author_id: currentUser.id,
        author_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Usuario',
        content: newComment.trim()
      };

      const { data, error } = await communityService.createComment(commentData);
      
      if (error) throw error;

      // Actualizar lista de comentarios
      setComments(prev => [...prev, data]);
      setNewComment('');

      // Notificar al componente padre
      if (onCommentAdded) {
        onCommentAdded();
      }

    } catch (err) {
      console.error('Error enviando comentario:', err);
      setError('Error al enviar el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} d`;
    
    return date.toLocaleDateString('es-CO');
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cartagena-yellow"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      {/* Header de comentarios */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Comentarios ({comments.length})
        </h3>
      </div>

      {/* Formulario de nuevo comentario */}
      {currentUser && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-cartagena-blue rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {currentUser.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
                   currentUser.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent resize-none"
                disabled={submitting}
              />
              
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  {newComment.length}/500 caracteres
                </div>
                
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              {error}
            </div>
          )}
        </form>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No hay comentarios aún</p>
            {!currentUser && (
              <p className="text-sm mt-1">Inicia sesión para ser el primero en comentar</p>
            )}
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-cartagena-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {comment.author_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 text-sm">
                      {comment.author_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
                
                {/* Acciones del comentario */}
                <div className="flex items-center space-x-4 mt-1 ml-3">
                  <button className="text-xs text-gray-500 hover:text-cartagena-blue transition-colors">
                    Responder
                  </button>
                  
                  {currentUser?.id === comment.author_id && (
                    <button className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mensaje para usuarios no autenticados */}
      {!currentUser && comments.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            💡 <a href="/auth" className="underline font-semibold">Inicia sesión</a> para unirte a la conversación
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
