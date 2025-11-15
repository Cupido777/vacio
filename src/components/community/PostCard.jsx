import React, { useState } from 'react';
import { communityService } from '../../services/communityService';
import LikeButton from './LikeButton';
import CommentsSection from './CommentsSection';

const PostCard = ({ post, currentUser, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    try {
      setIsLiking(true);
      const { error } = await communityService.toggleLike(post.id, currentUser.id);
      
      if (error) throw error;
      
      // Recargar el post para obtener conteos actualizados
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error al dar like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentAdded = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMediaPreview = () => {
    if (!post.media_url) return null;

    if (post.media_type === 'image') {
      return (
        <div className="mt-4">
          <img 
            src={post.media_url} 
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      );
    }

    if (post.media_type === 'audio') {
      return (
        <div className="mt-4">
          <audio 
            controls 
            className="w-full"
            src={post.media_url}
          >
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
      );
    }

    if (post.media_type === 'video') {
      return (
        <div className="mt-4">
          <video 
            controls 
            className="w-full rounded-lg"
            src={post.media_url}
          >
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header del Post */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cartagena-yellow rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {post.author_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.author_name || 'Usuario'}</h3>
              <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
            </div>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cartagena-blue text-white"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                  +{post.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Contenido del Post */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
          {post.content && (
            <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
          )}
        </div>

        {/* Media Preview */}
        {getMediaPreview()}

        {/* Stats y Acciones */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <LikeButton 
                postId={post.id}
                currentUser={currentUser}
                initialLikes={post.likes_count || 0}
                onLike={handleLike}
                isLiking={isLiking}
              />
            </div>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 hover:text-cartagena-blue transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comments_count || 0}</span>
            </button>
          </div>

          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sección de Comentarios (expandible) */}
      {showComments && (
        <div className="border-t border-gray-200">
          <CommentsSection 
            postId={post.id}
            currentUser={currentUser}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
