import React, { useState, useEffect } from 'react';
import { communityService } from '../../services/communityService';

const LikeButton = ({ postId, currentUser, initialLikes, onLike, isLiking }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes || 0);

  // Verificar si el usuario actual ya dio like
  useEffect(() => {
    const checkUserLike = async () => {
      if (!currentUser) return;
      
      try {
        const { data } = await communityService.getPostLikes(postId);
        const userLike = data?.find(like => like.user_id === currentUser.id);
        setIsLiked(!!userLike);
      } catch (error) {
        console.error('Error verificando like:', error);
      }
    };

    checkUserLike();
  }, [postId, currentUser]);

  const handleLikeClick = async () => {
    if (isLiking) return;

    // Optimistic update
    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(previousIsLiked ? likesCount - 1 : likesCount + 1);

    try {
      await onLike();
    } catch (error) {
      // Revertir en caso de error
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={isLiking}
      className={`flex items-center space-x-1 transition-all duration-200 ${
        isLiked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-600 hover:text-red-500'
      } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg 
        className={`w-5 h-5 transition-transform duration-200 ${isLiked ? 'scale-110 fill-current' : 'fill-none'}`}
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={isLiked ? 0 : 2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      <span className="font-medium">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
