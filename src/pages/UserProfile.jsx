import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Award, BookOpen, Shield, Edit3, Save, X } from 'lucide-react';

// Validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '').trim();
};

const useUserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('idle');

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = () => {
      const storedData = localStorage.getItem('user_profile');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setUserData(parsed);
          setEditForm(parsed);
        } catch {
          // If stored data is invalid, use default
          setDefaultData();
        }
      } else {
        setDefaultData();
      }
    };

    const setDefaultData = () => {
      const defaultData = {
        name: 'Usuario Demo',
        email: 'usuario@ejemplo.com',
        role: 'Estudiante de producción musical',
        joinDate: 'Noviembre 2024',
        completedCourses: 3,
        achievements: ['Primer Curso Completado', 'Patrimonio Básico'],
        bio: 'Apasionado por la música tradicional de Cartagena.'
      };
      setUserData(defaultData);
      setEditForm(defaultData);
    };

    fetchUserData();
  }, []);

  const validateForm = (formData) => {
    const newErrors = {};

    if (!validateName(formData.name)) {
      newErrors.name = 'El nombre debe tener entre 2 y 50 caracteres';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'La biografía no puede exceder 500 caracteres';
    }

    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validateForm(editForm);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaveStatus('saving');
    
    try {
      // Sanitize all inputs
      const sanitizedData = {
        ...editForm,
        name: sanitizeInput(editForm.name),
        email: sanitizeInput(editForm.email),
        bio: editForm.bio ? sanitizeInput(editForm.bio) : '',
        role: sanitizeInput(editForm.role)
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(sanitizedData);
      localStorage.setItem('user_profile', JSON.stringify(sanitizedData));
      setIsEditing(false);
      setErrors({});
      setSaveStatus('success');
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setEditForm(userData);
    setIsEditing(false);
    setErrors({});
    setSaveStatus('idle');
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return {
    userData,
    isEditing,
    editForm,
    errors,
    saveStatus,
    setIsEditing,
    handleSave,
    handleCancel,
    handleInputChange
  };
};

const UserProfile = () => {
  const {
    userData,
    isEditing,
    editForm,
    errors,
    saveStatus,
    setIsEditing,
    handleSave,
    handleCancel,
    handleInputChange
  } = useUserProfile();

  if (!userData) {
    return (
      <div className="min-h-screen bg-colonial-sand py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-colonial-yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-colonial-sand py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-traditional text-colonial-blue">
              Mi Perfil
            </h1>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-colonial-yellow text-colonial-blue px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Editar Perfil</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saveStatus === 'saving' ? 'Guardando...' : 'Guardar'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-colonial-blue rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {userData.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              </div>
              
              {isEditing ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full p-2 border rounded-lg ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre completo"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                  
                  <input
                    type="text"
                    value={editForm.role || ''}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                    placeholder="Rol o ocupación"
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-caribbean font-semibold text-colonial-blue">
                    {userData.name}
                  </h2>
                  <p className="text-gray-600">{userData.role}</p>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {saveStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-700 text-sm">Perfil actualizado correctamente</p>
              </div>
            )}

            {saveStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">Error al guardar el perfil. Intenta nuevamente.</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3 p-4 bg-colonial-sand rounded-lg">
                <Mail className="h-5 w-5 text-colonial-blue" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Email</p>
                  {isEditing ? (
                    <>
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full p-2 border rounded-lg ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </>
                  ) : (
                    <p className="font-semibold">{userData.email}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-colonial-sand rounded-lg">
                <Calendar className="h-5 w-5 text-colonial-blue" />
                <div>
                  <p className="text-sm text-gray-600">Miembro desde</p>
                  <p className="font-semibold">{userData.joinDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-colonial-sand rounded-lg">
                <BookOpen className="h-5 w-5 text-colonial-blue" />
                <div>
                  <p className="text-sm text-gray-600">Cursos Completados</p>
                  <p className="font-semibold">{userData.completedCourses || 0}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-colonial-sand rounded-lg">
                <Award className="h-5 w-5 text-colonial-blue" />
                <div>
                  <p className="text-sm text-gray-600">Logros</p>
                  <p className="font-semibold">{userData.achievements?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-caribbean text-gray-700 mb-4">Biografía</h3>
              {isEditing ? (
                <div>
                  <textarea
                    value={editForm.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className={`w-full p-3 border rounded-lg h-32 resize-none ${
                      errors.bio ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Cuéntanos sobre tu interés en la cultura de Cartagena..."
                    maxLength={500}
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    {editForm.bio?.length || 0}/500 caracteres
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {userData.bio || 'No hay biografía disponible.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
