import React, { useState, useEffect } from 'react';
import { communityService } from '../../services/communityService';

const CommunityChallenges = ({ currentUser }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participating, setParticipating] = useState({});

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const { data, error } = await communityService.getActiveChallenges();
      
      if (error) throw error;
      setChallenges(data || []);
    } catch (err) {
      console.error('Error cargando retos:', err);
      setError('Error al cargar los retos culturales');
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async (challengeId) => {
    if (!currentUser) {
      alert('Debes iniciar sesión para participar en retos');
      return;
    }

    try {
      setParticipating(prev => ({ ...prev, [challengeId]: true }));
      
      // Simular participación (en una implementación real, esto guardaría en la base de datos)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('¡Te has unido al reto! Ahora puedes publicar tu creación usando la etiqueta del reto.');
      
      setParticipating(prev => ({ ...prev, [challengeId]: false }));
      
    } catch (err) {
      console.error('Error participando en reto:', err);
      setParticipating(prev => ({ ...prev, [challengeId]: false }));
      alert('Error al unirse al reto');
    }
  };

  const formatDeadline = (dateString) => {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Finalizado';
    if (diffDays === 0) return 'Hoy finaliza';
    if (diffDays === 1) return '1 día restante';
    return `${diffDays} días restantes`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Retos Culturales</h2>
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cartagena-yellow to-yellow-500 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">🎯 Retos Culturales Activos</h2>
        <p className="text-yellow-100 mt-1">
          Participa y muestra tu talento artístico
        </p>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {challenges.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay retos activos en este momento
            </h3>
            <p className="text-gray-600">
              Pronto anunciaremos nuevos retos culturales para la comunidad
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-cartagena-yellow transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {challenge.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      challenge.participants > 20 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      👥 {challenge.participants} participantes
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className={formatDeadline(challenge.deadline).includes('Finalizado') ? 'text-red-600 font-semibold' : ''}>
                        {formatDeadline(challenge.deadline)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-cartagena-blue font-semibold">
                        Premio: {challenge.prize}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleParticipate(challenge.id)}
                    disabled={participating[challenge.id] || formatDeadline(challenge.deadline).includes('Finalizado')}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      formatDeadline(challenge.deadline).includes('Finalizado')
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : participating[challenge.id]
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-cartagena-yellow text-white hover:bg-yellow-600 hover:shadow-md'
                    }`}
                  >
                    {formatDeadline(challenge.deadline).includes('Finalizado')
                      ? 'Finalizado'
                      : participating[challenge.id]
                      ? 'Uniéndose...'
                      : '¡Participar!'
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-blue-600 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">
                ¿Cómo participar en los retos?
              </h4>
              <ul className="mt-1 text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Haz clic en "Participar" en el reto que te interese</li>
                <li>Crea una publicación relacionada con el tema del reto</li>
                <li>Usa las etiquetas sugeridas en tu publicación</li>
                <li>¡Comparte tu talento con la comunidad!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChallenges;
