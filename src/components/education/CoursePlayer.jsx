import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { educationService } from '../../services/educationService';

const CoursePlayer = ({ courseId, currentUser, onProgressUpdate }) => {
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizResults, setQuizResults] = useState({});

  // Cargar curso y progreso
  useEffect(() => {
    loadCourseData();
  }, [courseId, currentUser]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const [courseData, userProgress] = await Promise.all([
        educationService.getCourseById(courseId),
        educationService.getUserProgress(currentUser.id, courseId)
      ]);
      
      setCourse(courseData);
      setProgress(userProgress.progress || 0);
      setCurrentLesson(userProgress.currentLesson || 0);
    } catch (err) {
      setError('Error al cargar el curso');
      console.error('Error loading course:', err);
    } finally {
      setLoading(false);
    }
  };

  // Navegación entre lecciones
  const navigateToLesson = useCallback(async (lessonIndex) => {
    if (lessonIndex >= 0 && lessonIndex < course.lessons.length) {
      setCurrentLesson(lessonIndex);
      
      // Actualizar progreso si es una nueva lección
      if (lessonIndex > progress) {
        const newProgress = Math.max(progress, lessonIndex + 1);
        setProgress(newProgress);
        
        await educationService.updateUserProgress(currentUser.id, courseId, {
          currentLesson: lessonIndex,
          progress: newProgress
        });
        
        if (onProgressUpdate) {
          onProgressUpdate(newProgress);
        }
      }
    }
  }, [course, progress, currentUser, courseId, onProgressUpdate]);

  // Manejar completado de lección
  const handleLessonComplete = useCallback(async () => {
    const nextLesson = currentLesson + 1;
    const newProgress = Math.max(progress, nextLesson);
    
    setProgress(newProgress);
    
    await educationService.updateUserProgress(currentUser.id, courseId, {
      currentLesson: nextLesson < course.lessons.length ? nextLesson : currentLesson,
      progress: newProgress,
      completed: newProgress >= course.lessons.length
    });

    if (onProgressUpdate) {
      onProgressUpdate(newProgress);
    }
  }, [currentLesson, progress, course, currentUser, courseId, onProgressUpdate]);

  // Manejar resultados de quiz
  const handleQuizComplete = useCallback(async (quizId, score, answers) => {
    setQuizResults(prev => ({
      ...prev,
      [quizId]: { score, answers, completed: true }
    }));

    await educationService.saveQuizResult(currentUser.id, courseId, quizId, {
      score,
      answers,
      completedAt: new Date().toISOString()
    });
  }, [currentUser, courseId]);

  // Lección actual memoizada
  const currentLessonData = useMemo(() => {
    return course?.lessons?.[currentLesson] || null;
  }, [course, currentLesson]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cartagena-yellow"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <div className="text-4xl mb-2">❌</div>
        <p>{error}</p>
        <button 
          onClick={loadCourseData}
          className="mt-4 px-4 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-8 text-gray-600">
        <div className="text-4xl mb-2">📚</div>
        <p>Curso no encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header del Curso */}
      <div className="bg-gradient-to-r from-cartagena-blue to-cartagena-yellow p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="opacity-90">{course.description}</p>
          </div>
          <div className="mt-4 lg:mt-0 text-right">
            <div className="text-sm opacity-80">Progreso</div>
            <div className="text-xl font-bold">
              {Math.round((progress / course.lessons.length) * 100)}%
            </div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4 w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${(progress / course.lessons.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar de Navegación */}
        <div className="lg:w-1/4 bg-gray-50 border-r border-gray-200">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Contenido del Curso</h3>
            <nav className="space-y-2">
              {course.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => navigateToLesson(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    index === currentLesson
                      ? 'bg-cartagena-yellow text-white shadow-md'
                      : index <= progress
                      ? 'bg-white text-gray-700 hover:bg-gray-100 border border-green-200'
                      : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === currentLesson
                          ? 'bg-white text-cartagena-yellow'
                          : index < progress
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {index < progress ? '✓' : index + 1}
                      </div>
                      <span className="font-medium">{lesson.title}</span>
                    </div>
                    {lesson.duration && (
                      <span className="text-xs opacity-70">
                        {lesson.duration}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="lg:w-3/4">
          {currentLessonData && (
            <div className="p-6">
              {/* Header de lección */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Lección {currentLesson + 1}: {currentLessonData.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {currentLessonData.duration && (
                      <span>⏱️ {currentLessonData.duration}</span>
                    )}
                    {currentLessonData.difficulty && (
                      <span>📊 {currentLessonData.difficulty}</span>
                    )}
                    <span>🎯 {progress}/{course.lessons.length} completadas</span>
                  </div>
                </div>
                
                <button
                  onClick={handleLessonComplete}
                  disabled={currentLesson >= progress}
                  className="px-6 py-2 bg-cartagena-yellow text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {currentLesson < progress ? '✓ Completada' : 'Marcar como Completada'}
                </button>
              </div>

              {/* Contenido de la lección */}
              <div className="prose max-w-none mb-8">
                {currentLessonData.content && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentLessonData.content }}
                  />
                )}
                
                {currentLessonData.videoUrl && (
                  <div className="my-6">
                    <video
                      controls
                      className="w-full rounded-lg shadow-md"
                      src={currentLessonData.videoUrl}
                    >
                      Tu navegador no soporta el elemento de video.
                    </video>
                  </div>
                )}

                {currentLessonData.audioUrl && (
                  <div className="my-6">
                    <audio
                      controls
                      className="w-full"
                      src={currentLessonData.audioUrl}
                    >
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </div>
                )}
              </div>

              {/* Quiz integrado */}
              {currentLessonData.quiz && (
                <div className="mt-8 border-t pt-6">
                  <QuizComponent
                    quiz={currentLessonData.quiz}
                    onComplete={(score, answers) => 
                      handleQuizComplete(currentLessonData.quiz.id, score, answers)
                    }
                    previousResults={quizResults[currentLessonData.quiz.id]}
                  />
                </div>
              )}

              {/* Navegación entre lecciones */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={() => navigateToLesson(currentLesson - 1)}
                  disabled={currentLesson === 0}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Anterior
                </button>
                
                <button
                  onClick={() => navigateToLesson(currentLesson + 1)}
                  disabled={currentLesson >= course.lessons.length - 1}
                  className="px-6 py-2 bg-cartagena-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CoursePlayer);
