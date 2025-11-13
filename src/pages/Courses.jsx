import React, { useState, useEffect } from 'react';
import { Play, Clock, Users, BookOpen, ArrowLeft, Star, CheckCircle } from 'lucide-react';

// Datos de ejemplo para cursos - En producción vendrían de Firebase
const sampleCourses = [
  {
    id: 1,
    title: 'Producción Musical Digital Básica',
    instructor: 'María González',
    instructorBio: 'Productora musical con 10 años de experiencia en ritmos tradicionales',
    duration: '8 semanas',
    students: 45,
    level: 'Principiante',
    rating: 4.8,
    image: '/api/placeholder/400/250',
    description: 'Aprende las bases de la producción musical usando herramientas digitales modernas mientras respetamos nuestras raíces sonoras.',
    objectives: [
      'Comprender los fundamentos de la producción musical digital',
      'Manejar software de audio profesional (DAW)',
      'Crear tus primeras composiciones',
      'Mezclar y masterizar pistas básicas'
    ],
    modules: [
      {
        title: 'Introducción a DAWs',
        duration: '2 horas',
        lessons: ['Qué es un DAW', 'Interfaz básica', 'Configuración inicial']
      },
      {
        title: 'Teoría musical aplicada',
        duration: '3 horas', 
        lessons: ['Escalas básicas', 'Ritmo y tempo', 'Armonía simple']
      },
      {
        title: 'Grabación y edición',
        duration: '4 horas',
        lessons: ['Técnicas de grabación', 'Edición de audio', 'Plugins básicos']
      },
      {
        title: 'Mezcla y masterización',
        duration: '3 horas',
        lessons: ['Balance de pistas', 'Uso de efectos', 'Exportación final']
      }
    ],
    requirements: ['Computadora con internet', 'Audífonos', 'Pasión por la música'],
    price: 'Gratuito'
  },
  {
    id: 2,
    title: 'Ritmos Tradicionales Cartageneros',
    instructor: 'Carlos "El Tamborero" Pérez',
    instructorBio: 'Músico tradicional especializado en ritmos afrocaribeños',
    duration: '6 semanas', 
    students: 32,
    level: 'Intermedio',
    rating: 4.9,
    image: '/api/placeholder/400/250',
    description: 'Explora los ritmos ancestrales de la región Caribe colombiana y su evolución en la música contemporánea.',
    objectives: [
      'Identificar los ritmos tradicionales de Cartagena',
      'Ejecutar patrones rítmicos básicos',
      'Comprender la historia cultural detrás de cada ritmo',
      'Fusionar tradición con sonidos modernos'
    ],
    modules: [
      {
        title: 'Historia de la cumbia',
        duration: '2 horas',
        lessons: ['Orígenes africanos e indígenas', 'Evolución en el Caribe', 'La cumbia en Cartagena']
      },
      {
        title: 'Patrones del bullerengue',
        duration: '3 horas',
        lessons: ['Ritmo base', 'Variaciones tradicionales', 'Cantos y respondones']
      },
      {
        title: 'Instrumentación tradicional',
        duration: '3 horas',
        lessons: ['Tambores alegre y llamador', 'Maracas y guache', 'Gaitas y flautas']
      },
      {
        title: 'Fusión con ritmos modernos',
        duration: '2 horas',
        lessons: ['Bullerengue electrónico', 'Cumbia digital', 'Champeta criolla']
      }
    ],
    requirements: ['Interés en música tradicional', 'Disposición para practicar', 'Respeto por las raíces culturales'],
    price: 'Gratuito'
  },
  {
    id: 3,
    title: 'Champeta: De lo Ancestral a lo Urbano',
    instructor: 'DJ Kamba',
    instructorBio: 'Pionero de la champeta moderna y rescate de sonidos africanos',
    duration: '5 semanas',
    students: 28,
    level: 'Principiante',
    rating: 4.7,
    image: '/api/placeholder/400/250',
    description: 'Descubre la evolución de la champeta desde sus raíces africanas hasta su expresión urbana contemporánea.',
    objectives: [
      'Comprender la historia de la champeta',
      'Diferenciar los subgéneros champeteros',
      'Crear mezclas básicas',
      'Aprender sobre los picós y la cultura sonora'
    ],
    modules: [
      {
        title: 'Raíces africanas',
        duration: '2 horas',
        lessons: ['Música soukous', 'Influencias congoleñas', 'Llegada a Cartagena']
      },
      {
        title: 'Evolución criolla',
        duration: '3 horas',
        lessons: ['Champeta criolla', 'Fusión con otros ritmos', 'Los picós tradicionales']
      },
      {
        title: 'Champeta urbana',
        duration: '3 horas',
        lessons: ['Influencia del dancehall', 'Producción digital', 'Artistas representativos']
      },
      {
        title: 'Creación de mezclas',
        duration: '2 horas',
        lessons: ['Selección musical', 'Transiciones básicas', 'Uso de software']
      }
    ],
    requirements: ['Gusto por la música caribeña', 'Software de audio básico', 'Creatividad'],
    price: 'Gratuito'
  }
];

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Simular carga de datos
  useEffect(() => {
    // En producción, aquí harías una llamada a Firebase
    console.log('Cargando cursos...');
  }, []);

  const handleEnroll = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      alert('¡Te has inscrito exitosamente al curso!');
    }
  };

  const isEnrolled = (courseId) => enrolledCourses.includes(courseId);

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-colonial-sand">
        <div className="container mx-auto px-4 py-8">
          {/* Header del curso */}
          <button 
            onClick={() => setSelectedCourse(null)}
            className="mb-6 flex items-center text-colonial-blue hover:text-colonial-coral transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a todos los cursos
          </button>
          
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Banner del curso */}
            <div className="h-64 bg-gradient-to-r from-colonial-blue to-colonial-coral relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-traditional mb-2">{selectedCourse.title}</h1>
                <p className="text-xl opacity-90">{selectedCourse.description}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar de información */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-colonial-sand rounded-xl p-6">
                    <div className="text-3xl font-caribbean text-colonial-blue font-bold mb-2">
                      {selectedCourse.price}
                    </div>
                    <button 
                      onClick={() => handleEnroll(selectedCourse.id)}
                      disabled={isEnrolled(selectedCourse.id)}
                      className={`w-full py-3 px-4 rounded-lg font-caribbean font-semibold transition-all duration-200 ${
                        isEnrolled(selectedCourse.id)
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-colonial-yellow text-colonial-blue hover:bg-colonial-yellow/90'
                      }`}
                    >
                      {isEnrolled(selectedCourse.id) ? '✓ Inscrito' : 'Inscribirse al Curso'}
                    </button>
                    
                    <div className="mt-6 space-y-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Duración:</span>
                        <span className="font-semibold">{selectedCourse.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Nivel:</span>
                        <span className="font-semibold">{selectedCourse.level}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Estudiantes:</span>
                        <span className="font-semibold">{selectedCourse.students}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-semibold flex items-center">
                          <Star className="h-4 w-4 text-colonial-yellow fill-current mr-1" />
                          {selectedCourse.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información del instructor */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-caribbean font-semibold text-colonial-blue mb-3">
                      Sobre el instructor
                    </h3>
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-colonial-blue rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedCourse.instructor.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold">{selectedCourse.instructor}</div>
                        <div className="text-xs text-gray-500">{selectedCourse.instructorBio}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="lg:col-span-3">
                  {/* Pestañas de navegación */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8">
                      {['overview', 'curriculum', 'requirements'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                            activeTab === tab
                              ? 'border-colonial-yellow text-colonial-blue'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab === 'overview' ? 'Descripción' : 
                           tab === 'curriculum' ? 'Contenido' : 'Requisitos'}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Contenido de las pestañas */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-caribbean text-colonial-blue mb-4">
                          Lo que aprenderás
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {selectedCourse.objectives.map((objective, index) => (
                            <div key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-colonial-yellow mr-3 mt-0.5 flex-shrink-0" />
                              <span>{objective}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'curriculum' && (
                    <div className="space-y-4">
                      {selectedCourse.modules.map((module, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                              <h4 className="font-caribfamily font-semibold text-colonial-blue">
                                Módulo {index + 1}: {module.title}
                              </h4>
                              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                                {module.duration}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <ul className="space-y-2">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <li key={lessonIndex} className="flex items-center text-gray-700">
                                  <Play className="h-4 w-4 text-colonial-yellow mr-3 flex-shrink-0" />
                                  {lesson}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'requirements' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-caribbean text-colonial-blue mb-4">
                        Requisitos para este curso
                      </h3>
                      <ul className="space-y-3">
                        {selectedCourse.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-colonial-yellow rounded-full mr-3"></div>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-colonial-sand">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-traditional text-colonial-blue mb-4">
            Formación Artística Digital
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre nuestros cursos especializados que fusionan la tradición cultural de Cartagena 
            con las herramientas digitales modernas
          </p>
        </div>

        {/* Grid de Cursos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sampleCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
              onClick={() => setSelectedCourse(course)}
            >
              {/* Imagen del curso */}
              <div className="h-48 bg-gradient-to-r from-colonial-blue to-colonial-coral relative">
                <div className="absolute top-4 right-4 bg-colonial-yellow text-colonial-blue px-3 py-1 rounded-full text-sm font-caribbean font-semibold">
                  {course.price}
                </div>
              </div>
              
              {/* Contenido de la tarjeta */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-colonial-sand text-colonial-blue px-3 py-1 rounded-full text-xs font-medium">
                    {course.level}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 text-colonial-yellow fill-current mr-1" />
                    {course.rating}
                  </div>
                </div>
                
                <h3 className="text-xl font-caribbean font-semibold text-colonial-blue mb-3 leading-tight">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students} estudiantes
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-colonial-blue rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{course.instructor}</span>
                  </div>
                  <button className="bg-colonial-yellow text-colonial-blue px-4 py-2 rounded-lg font-caribbean font-semibold hover:bg-colonial-yellow/90 transition-colors duration-200 text-sm">
                    Ver Curso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-colonial-blue to-colonial-dark-blue text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-traditional mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="mb-6 opacity-90 max-w-2xl mx-auto">
            Próximamente agregaremos más cursos especializados en producción musical, 
            patrimonio cultural y tecnología digital.
          </p>
          <button className="bg-colonial-yellow text-colonial-blue px-8 py-3 rounded-lg font-caribbean font-semibold hover:bg-white transition-colors duration-200">
            Recibir Notificaciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default Courses;
