import React, { useState } from 'react'
import { MessageCircle, Heart, Share, Users, Image, Music, Send } from 'lucide-react'

const Community = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Ana María',
      avatar: 'AM',
      content: 'Acabo de terminar mi primera composición fusionando bullerengue con ritmos electrónicos. ¡Pronto la comparto!',
      likes: 12,
      comments: 3,
      time: '2h',
      liked: false
    },
    {
      id: 2,
      user: 'Carlos Rodríguez',
      avatar: 'CR',
      content: '¿Alguien interesado en formar un colectivo de música tradicional? Busco tamboreros y cantadoras.',
      likes: 8,
      comments: 5,
      time: '5h',
      liked: false
    }
  ])

  const [newPost, setNewPost] = useState('')

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked
          }
        : post
    ))
  }

  const handleSubmitPost = (e) => {
    e.preventDefault()
    if (!newPost.trim()) return

    const post = {
      id: posts.length + 1,
      user: 'Tú',
      avatar: 'TU',
      content: newPost,
      likes: 0,
      comments: 0,
      time: 'Ahora',
      liked: false
    }

    setPosts([post, ...posts])
    setNewPost('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-traditional text-colonial-blue text-center mb-2">
        Comunidad ODAM
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        Conecta, colabora y comparte con artistas y creadores de Cartagena
      </p>

      {/* Estadísticas de comunidad */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <Users className="h-8 w-8 text-colonial-blue mx-auto mb-2" />
          <div className="text-2xl font-caribbean text-colonial-blue">150</div>
          <div className="text-xs text-gray-600">Miembros</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <MessageCircle className="h-8 w-8 text-colonial-coral mx-auto mb-2" />
          <div className="text-2xl font-caribbean text-colonial-coral">45</div>
          <div className="text-xs text-gray-600">Discusiones</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <Heart className="h-8 w-8 text-colonial-yellow mx-auto mb-2" />
          <div className="text-2xl font-caribbean text-colonial-yellow">320</div>
          <div className="text-xs text-gray-600">Interacciones</div>
        </div>
      </div>

      {/* Crear publicación */}
      <form onSubmit={handleSubmitPost} className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-100">
        <textarea 
          placeholder="Comparte tus ideas, proyectos o preguntas con la comunidad..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-colonial-yellow focus:border-transparent"
          rows="3"
        />
        <div className="flex justify-between items-center mt-3">
          <div className="flex space-x-2">
            <button type="button" className="text-gray-400 hover:text-colonial-blue transition-colors duration-200">
              <Image className="h-5 w-5" />
            </button>
            <button type="button" className="text-gray-400 hover:text-colonial-coral transition-colors duration-200">
              <Music className="h-5 w-5" />
            </button>
          </div>
          <button 
            type="submit"
            disabled={!newPost.trim()}
            className="bg-colonial-yellow text-colonial-blue px-6 py-2 rounded-lg font-caribbean font-semibold hover:bg-colonial-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="h-4 w-4 inline mr-2" />
            Publicar
          </button>
        </div>
      </form>

      {/* Lista de publicaciones */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-colonial-blue rounded-full flex items-center justify-center text-white font-caribbean font-semibold">
                {post.avatar}
              </div>
              <div className="ml-3">
                <div className="font-caribbean font-semibold text-colonial-blue">{post.user}</div>
                <div className="text-xs text-gray-500">{post.time}</div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-1 transition-colors duration-200 ${
                    post.liked ? 'text-colonial-coral' : 'hover:text-colonial-coral'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-colonial-blue transition-colors duration-200">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </button>
              </div>
              <button className="hover:text-colonial-yellow transition-colors duration-200">
                <Share className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Community
