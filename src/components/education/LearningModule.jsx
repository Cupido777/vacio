import React, { useState, useEffect, useMemo } from 'react';
import { educationService } from '../../services/educationService';

const LearningModule = ({ moduleId, currentUser, onModuleComplete }) => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    loadModuleData();
  }, [moduleId]);

  const loadModuleData = async () => {
    try {
      setLoading(true);
      const [moduleData, progressData] = await Promise.all([
        educationService.getModuleById(moduleId),
        educationService.getModuleProgress(currentUser.id, moduleId)
      ]);
      setModule(moduleData);
      setUserProgress(progressData);
    } catch (error) {
      console.error('Error loading module:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceComplete = async (resourceId) => {
    const updatedProgress = await educationService.markResourceComplete(
      currentUser.id, 
      moduleId, 
      resourceId
    );
    setUserProgress(updatedProgress);
    
    // Verificar si el módulo está completo
    if (updatedProgress.completedResources === module.resources.length) {
      onModuleComplete?.(moduleId);
    }
  };

  const progressPercentage = useMemo(() => {
    if (!module) return 0;
    return Math.round((userProgress.completedResources / module.resources.length) * 100);
  }, [module, userProgress]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>;
  }

  if (!module) {
    return <div>Módulo no encontrado</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header del Módulo */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm opacity-80">Módulo {module.order}</span>
            <h1 className="text-2xl font-bold mt-1">{module.title}</h1>
            <p className="opacity-90 mt-2">{module.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{progressPercentage}%</div>
            <div className="text-sm opacity-80">Completado</div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4 w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Navegación de pestañas */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'content', name: 'Contenido', icon: '📚' },
            { id: 'resources', name: 'Recursos', icon: '📎' },
            { id: 'activities', name: 'Actividades', icon: '🎯' },
            { id: 'discussion', name: 'Foro', icon: '💬' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-cartagena-yellow text-cartagena-yellow'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="p-6">
        {activeTab === 'content' && (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: module.content }} />
            
            {/* Lista de lecciones */}
            <div className="mt-8 space-y-4">
              {module.lessons?.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-cartagena-yellow text-white rounded-full flex items-center justify-center font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                    <p className="text-sm text-gray-600">{lesson.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{lesson.duration}</span>
                    <div className="mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        userProgress.completedLessons?.includes(lesson.id)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {userProgress.completedLessons?.includes(lesson.id) ? 'Completada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {module.resources?.map(resource => (
              <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{resource.type === 'pdf' ? '📄' : 
                                           resource.type === 'video' ? '🎬' : 
                                           resource.type === 'audio' ? '🎵' : '🔗'}</span>
                  <button
                    onClick={() => handleResourceComplete(resource.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      userProgress.completedResourcesList?.includes(resource.id)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-cartagena-yellow hover:text-white'
                    }`}
                  >
                    {userProgress.completedResourcesList?.includes(resource.id) ? '✓ Completado' : 'Marcar'}
                  </button>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cartagena-blue hover:text-blue-700 text-sm font-medium"
                >
                  Ver recurso →
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-6">
            {module.activities?.map(activity => (
              <div key={activity.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    activity.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {activity.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Instrucciones:</h4>
                  <p className="text-sm text-gray-700">{activity.instructions}</p>
                </div>
                {activity.expectedOutcome && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Resultado esperado:</h4>
                    <p className="text-sm text-blue-700">{activity.expectedOutcome}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'discussion' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Foro de Discusión</h3>
              <p className="text-blue-700 text-sm">
                Comparte tus dudas, experiencias y reflexiones sobre este módulo con la comunidad.
              </p>
            </div>
            
            {/* Aquí integrarías un componente de comentarios */}
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💬</div>
              <p>Sistema de foro en desarrollo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningModule;
