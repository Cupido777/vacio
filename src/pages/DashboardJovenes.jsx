import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { programaFormacionService } from '../services/programaFormacionService';
import { 
  BookOpen, 
  Users, 
  Award, 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  MapPin,
  FileText,
  Star
} from 'lucide-react';

const DashboardJovenes = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [programa, setPrograma] = useState(null);
  const [inscripcion, setInscripcion] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);

  useEffect(() => {
    cargarDashboard();
  }, [currentUser]);

  const cargarDashboard = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Obtener programa activo
      const programas = await programaFormacionService.getProgramasActivos();
      const programaActivo = programas[0];
      
      if (!programaActivo) {
        setLoading(false);
        return;
      }

      setPrograma(programaActivo);

      // Cargar datos en paralelo
      const [
        inscripcionData,
        progresoData,
        modulosData,
        talleresData,
        estadisticasData
      ] = await Promise.all([
        programaFormacionService.getInscripcionByUser(programaActivo.id, currentUser.id),
        programaFormacionService.getProgresoGeneralJoven(currentUser.id, programaActivo.id),
        programaFormacionService.getModulosByPrograma(programaActivo.id),
        programaFormacionService.getTalleresByPrograma(programaActivo.id),
        programaFormacionService.getEstadisticasPrograma(programaActivo.id)
      ]);

      setInscripcion(inscripcionData);
      setProgreso(progresoData);
      setModulos(modulosData);
      setTalleres(talleresData);
      setEstadisticas(estadisticasData);

    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const CardEstadistica = ({ icon: Icon, titulo, valor, subtitulo, color = 'blue' }) => (
    <div className={`bg-white rounded-xl p-6 shadow-lg border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-caribbean text-gray-600">{titulo}</p>
          <p className="text-2xl font-traditional text-gray-900 mt-1">{valor}</p>
          {subtitulo && (
            <p className="text-xs text-gray-500 mt-1">{subtitulo}</p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ProgresoModulo = ({ modulo, progresoModulo }) => {
    const porcentaje = progresoModulo?.progreso_percent || 0;
    const completado = progresoModulo?.completado || false;
    
    return (
      <div className="bg-white rounded-lg p-4 shadow border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-caribbean text-gray-900">{modulo.titulo}</h4>
          {completado ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Clock className="h-5 w-5 text-yellow-500" />
          )}
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full ${completado ? 'bg-green-500' : 'bg-colonial-yellow'}`}
            style={{ width: `${porcentaje}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-600">
          <span>{porcentaje}% completado</span>
          <span>{modulo.duracion_estimada}h</span>
        </div>
        
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {modulo.descripcion}
        </p>
      </div>
    );
  };

  const CardTaller = ({ taller }) => {
    const fecha = new Date(taller.fecha_taller);
    const ahora = new Date();
    const haPasado = fecha < ahora;
    
    return (
      <div className={`bg-white rounded-lg p-4 shadow border ${haPasado ? 'opacity-75' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-caribbean text-gray-900 flex-1">{taller.titulo}</h4>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            haPasado ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'
          }`}>
            {haPasado ? 'Completado' : 'Próximo'}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Calendar className="h-4 w-4 mr-2" />
          {fecha.toLocaleDateString('es-ES', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {taller.ubicacion}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Clock className="h-4 w-4 mr-2" />
          {taller.duracion_horas} horas
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-colonial-sand py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!programa || !inscripcion) {
    return (
      <div className="min-h-screen bg-colonial-sand py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="font-traditional text-2xl text-gray-700 mb-2">
              No estás inscrito en ningún programa activo
            </h2>
            <p className="text-gray-600 mb-6">
              Actualmente no participas en ningún programa de formación.
            </p>
            <button className="bg-colonial-yellow text-colonial-blue px-6 py-3 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors">
              Explorar Programas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-colonial-sand py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-traditional text-3xl text-colonial-blue mb-2">
            Mi Formación Digital
          </h1>
          <p className="text-gray-600">
            {programa.nombre} • {programa.descripcion}
          </p>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CardEstadistica 
            icon={TrendingUp}
            titulo="Progreso General"
            valor={`${progreso?.progresoGeneral || 0}%`}
            subtitulo={`${progreso?.modulosCompletados || 0}/${progreso?.totalModulos || 0} módulos`}
            color="green"
          />
          
          <CardEstadistica 
            icon={BookOpen}
            titulo="Módulos Completados"
            valor={progreso?.modulosCompletados || 0}
            subtitulo={`de ${progreso?.totalModulos || 0} total`}
            color="blue"
          />
          
          <CardEstadistica 
            icon={Users}
            titulo="Asistencia Talleres"
            valor={`${progreso?.progresoAsistencia || 0}%`}
            subtitulo={`${progreso?.talleresAsistidos || 0}/${progreso?.totalTalleres || 0} talleres`}
            color="yellow"
          />
          
          <CardEstadistica 
            icon={Award}
            titulo="Certificación"
            valor={progreso?.progresoGeneral >= 80 ? "Disponible" : "En progreso"}
            subtitulo={progreso?.progresoGeneral >= 80 ? "¡Listo para certificar!" : "Continúa aprendiendo"}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Módulos de Aprendizaje */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-traditional text-2xl text-colonial-blue">
                Módulos de Aprendizaje
              </h2>
              <span className="text-sm text-gray-600">
                {progreso?.modulosCompletados || 0} de {modulos.length} completados
              </span>
            </div>
            
            <div className="space-y-4">
              {modulos.map(async (modulo) => {
                const progresoModulo = await programaFormacionService.getProgresoModulo(
                  currentUser.id, 
                  modulo.id
                );
                
                return (
                  <ProgresoModulo 
                    key={modulo.id}
                    modulo={modulo}
                    progresoModulo={progresoModulo}
                  />
                );
              })}
            </div>
          </div>

          {/* Talleres y Actividades */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-traditional text-2xl text-colonial-blue">
                Talleres Presenciales
              </h2>
              <span className="text-sm text-gray-600">
                {talleres.filter(t => new Date(t.fecha_taller) < new Date()).length} de {talleres.length} realizados
              </span>
            </div>
            
            <div className="space-y-4">
              {talleres.slice(0, 5).map(taller => (
                <CardTaller key={taller.id} taller={taller} />
              ))}
              
              {talleres.length > 5 && (
                <button className="w-full text-center py-3 text-colonial-blue font-caribbean hover:bg-white rounded-lg border-2 border-dashed border-gray-300 transition-colors">
                  Ver todos los talleres ({talleres.length})
                </button>
              )}
            </div>

            {/* Proyecto Final */}
            <div className="mt-8">
              <h3 className="font-traditional text-xl text-colonial-blue mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Proyecto Final
              </h3>
              
              <div className="bg-white rounded-lg p-6 shadow border">
                {progreso?.tieneProyecto ? (
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h4 className="font-caribbean text-gray-900 mb-2">Proyecto Entregado</h4>
                    <p className="text-gray-600 text-sm">
                      Tu proyecto final ha sido enviado para evaluación.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                    <h4 className="font-caribbean text-gray-900 mb-2">Proyecto Pendiente</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Comienza a trabajar en tu proyecto final para completar el programa.
                    </p>
                    <button className="bg-colonial-yellow text-colonial-blue px-6 py-2 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors">
                      Crear Proyecto
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Habilidades Adquiridas */}
        {progreso?.habilidadesAdquiridas?.length > 0 && (
          <div className="mt-8">
            <h3 className="font-traditional text-2xl text-colonial-blue mb-4">
              Habilidades Adquiridas
            </h3>
            <div className="flex flex-wrap gap-2">
              {progreso.habilidadesAdquiridas.map((habilidad, index) => (
                <span 
                  key={index}
                  className="bg-colonial-blue text-white px-4 py-2 rounded-full text-sm font-caribbean"
                >
                  {habilidad}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardJovenes;
