import React, { useState, useRef } from 'react';
import { communityService } from '../../services/communityService';
import { supabase } from '../../services/supabase';

const CreatePost = ({ currentUser, onPostCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    media_file: null,
    media_type: ''
  });

  const [tagInput, setTagInput] = useState('');

  const tagOptions = [
    'Música', 'Arte', 'Patrimonio', 'Cumbia', 'Bullerengue', 
    'Champeta', 'Danza', 'Fotografía', 'Pintura', 'Escultura',
    'Poesía', 'Teatro', 'Tradición', 'Innovación', 'Cartagena'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = (tag) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileSelect = (file) => {
    const fileType = file.type.split('/')[0]; // 'image', 'audio', 'video'
    
    if (!['image', 'audio', 'video'].includes(fileType)) {
      setError('Tipo de archivo no soportado. Usa imágenes, audio o video.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError('El archivo es demasiado grande (máximo 50MB)');
      return;
    }

    setFormData(prev => ({
      ...prev,
      media_file: file,
      media_type: fileType
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Debes iniciar sesión para crear publicaciones');
      return;
    }

    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      let mediaUrl = null;

      // Subir archivo si existe
      if (formData.media_file) {
        const fileExt = formData.media_file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `community_posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('community_media')
          .upload(filePath, formData.media_file);

        if (uploadError) throw uploadError;

        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from('community_media')
          .getPublicUrl(filePath);

        mediaUrl = urlData.publicUrl;
      }

      // Crear post en la base de datos
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        author_id: currentUser.id,
        author_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Usuario',
        tags: formData.tags,
        media_url: mediaUrl,
        media_type: formData.media_type
      };

      const { data, error } = await communityService.createPost(postData);
      
      if (error) throw error;

      // Limpiar formulario
      setFormData({
        title: '',
        content: '',
        tags: [],
        media_file: null,
        media_type: ''
      });
      setTagInput('');

      // Cerrar modal y notificar
      setIsOpen(false);
      
      if (onPostCreated) {
        onPostCreated();
      }

    } catch (err) {
      console.error('Error creando publicación:', err);
      setError(err.message || 'Error al crear la publicación');
    } finally {
      setSubmitting(false);
    }
  };

  const removeMedia = () => {
    setFormData(prev => ({
      ...prev,
      media_file: null,
      media_type: ''
    }));
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 mb-4">Inicia sesión para crear publicaciones</p>
        <a 
          href="/auth" 
          className="inline-flex items-center px-4 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Iniciar Sesión
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Botón para abrir modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-cartagena-yellow hover:bg-yellow-50 transition-all duration-200 group"
      >
        <div className="text-gray-400 group-hover:text-cartagena-yellow mb-2">
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p className="text-gray-600 group-hover:text-gray-900 font-medium">
          Comparte tu creación con la comunidad
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Música, arte, fotos, pensamientos...
        </p>
      </button>

      {/* Modal de creación */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Crear Publicación</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="¿De qué se trata tu publicación?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent"
                    required
                  />
                </div>

                {/* Contenido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenido
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Comparte tus pensamientos, descripción de tu obra, inspiración..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:border-transparent resize-none"
                  />
                </div>

                {/* Etiquetas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas ({formData.tags.length}/5)
                  </label>
                  
                  {/* Tags seleccionados */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-cartagena-blue text-white"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-red-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Sugerencias de tags */}
                  <div className="flex flex-wrap gap-1">
                    {tagOptions
                      .filter(tag => !formData.tags.includes(tag))
                      .slice(0, 8)
                      .map((tag, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                        >
                          + {tag}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Subida de archivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo multimedia (opcional)
                  </label>
                  
                  {formData.media_file ? (
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 text-sm font-semibold">
                              {formData.media_type.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{formData.media_file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(formData.media_file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeMedia}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-cartagena-yellow hover:bg-yellow-50 cursor-pointer transition-all duration-200"
                    >
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <p className="text-gray-600">Haz clic para subir una imagen, audio o video</p>
                      <p className="text-sm text-gray-500 mt-1">Máximo 50MB</p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                    accept="image/*,audio/*,video/*"
                    className="hidden"
                  />
                </div>

                {/* Mensaje de error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  
                  <button
                    type="submit"
                    disabled={submitting || !formData.title.trim()}
                    className="px-6 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-cartagena-yellow focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Publicando...' : 'Publicar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost;
