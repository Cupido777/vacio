import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { programaFormacionService } from '../../services/programaFormacionService';
import {
  BookOpen,
  Play,
  Pause,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  Download,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
  FileText,
  Video,
  Link as LinkIcon
} from 'lucide-react';

const ModulosPedagogicos = ({ programaId, modo = 'admin' }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [modulos, setModulos] = useState([]);
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
  const [vistaActiva, setVistaActiva] = useState('lista');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [progresoJoven, setProgresoJoven] = useState({});
  const [recursoActivo, setRecursoActivo] = useState(null);

  // Estados para formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    orden: 1,
    duracion_estimada: 4,
    objetivos_aprendizaje: [''],
    recursos: {
      videos: [],
      documentos: [],
      enlaces: [],
      actividades: []
    },
    criterios_evaluacion: ['']
  });

  useEffect(() => {
    if (programaId) {
      cargarModulos();
      if (modo === 'estudiante' && currentUser) {
        cargarProgresoJoven();
      }
    }
  }, [programaId, currentUser, modo]);

  const cargarModulos = async () => {
    try {
      setLoading(true);
      const modulosData = await programaFormacionService.getModulosByPrograma(programaId);
      setModulos(modulosData);
    } catch (error) {
      console.error('Error cargando módulos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarProgresoJoven = async () => {
    try {
      const progresoData = {};
      for (const modulo of modulos) {
        const progreso = await programaFormacionService.getProgresoModulo(currentUser.id, modulo.id);
        progresoData[modulo.id] = progreso;
      }
      setProgresoJoven(progresoData);
    } catch (error) {
      console.error('Error cargando progreso:', error);
    }
  };

  const crearModulo = async (e) => {
    e.preventDefault();
    try {
      // En una implementación real, esto llamaría al servicio
      const nuevoModulo = {
        id: `modulo-${Date.now()}`,
        ...formData,
        programa_id: programaId,
        estado_modulo: 'activo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setModulos(prev => [...prev, nuevoModulo].sort((a, b) => a.orden - b.orden));
      setMostrarFormulario(false);
      resetFormulario();
      
      alert('Módulo creado exitosamente');
    } catch (error) {
      console.error('Error creando módulo:', error);
      alert('Error al crear el módulo');
    }
  };

  const resetFormulario = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      orden: modulos.length + 1,
      duracion_estimada: 4,
      objetivos_aprendizaje: [''],
      recursos: {
        videos: [],
        documentos: [],
        enlaces: [],
        actividades: []
      },
      criterios_evaluacion: ['']
    });
  };

  const marcarRecursoCompletado = async (moduloId, tipoRecurso, recursoId) => {
    if (modo !== 'estudiante' || !currentUser) return;

    try {
      await programaFormacionService.marcarActividadCompletada(currentUser.id, moduloId, `${tipoRecurso}-${recursoId}`);
      
      // Actualizar progreso local
      setProgresoJoven(prev => ({
        ...prev,
        [moduloId]: {
          ...prev[moduloId],
          actividades_completadas: [
            ...(prev[moduloId]?.actividades_completadas || []),
            `${tipoRecurso}-${recursoId}`
          ]
        }
      }));

      // Recargar progreso
      cargarProgresoJoven();
    } catch (error) {
      console.error('Error marcando recurso completado:', error);
    }
  };

  const esRecursoCompletado = (moduloId, tipoRecurso, recursoId) => {
    return progresoJoven[moduloId]?.actividades_completadas?.includes(`${tipoRecurso}-${recursoId}`);
  };

  const CardModuloEstudiante = ({ modulo }) => {
    const progreso = progresoJoven[modulo.id] || {};
    const porcentaje = progreso.progreso_percent || 0;
    const completado = progreso.completado || false;

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-colonial-blue">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-caribbean text-xl text-gray-900">
                Módulo {modulo.orden}: {modulo.titulo}
              </h3>
              {completado && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {modulo.descripcion}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{modulo.duracion_estimada}h</span>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso del módulo</span>
            <span>{porcentaje}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${
                completado ? 'bg-green-500' : 'bg-colonial-yellow'
              }`}
              style={{ width: `${porcentaje}%` }}
            ></div>
          </div>
        </div>

        {/* Objetivos de Aprendizaje */}
        {modulo.objetivos_aprendizaje && modulo.objetivos_aprendizaje.length > 0 && (
          <div className="mb-4">
            <h4 className="font-caribbean text-gray-700 mb-2">Objetivos de aprendizaje:</h4>
            <ul className="space-y-1">
              {modulo.objetivos_aprendizaje.map((objetivo, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {objetivo}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recursos del Módulo */}
        <div className="space-y-3">
          {/* Videos */}
          {modulo.recursos?.videos?.length > 0 && (
            <div>
              <h5 className="font-caribbean text-gray-700 mb-2 flex items-center">
                <Video className="h-4 w-4 mr-2" />
                Videos ({modulo.recursos.videos.length})
              </h5>
              <div className="space-y-2">
                {modulo.recursos.videos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setRecursoActivo({ tipo: 'video', url: video.url })}
                        className="flex items-center space-x-2 text-colonial-blue hover:text-blue-700 transition-colors"
                      >
                        <Play className="h-4 w-4" />
                        <span className="text-sm">{video.titulo}</span>
                      </button>
                    </div>
                    <button
                      onClick={() => marcarRecursoCompletado(modulo.id, 'video', index)}
                      className={`p-1 rounded ${
                        esRecursoCompletado(modulo.id, 'video', index) 
                          ? 'text-green-500' 
                          : 'text-gray-400 hover:text-green-500'
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documentos */}
          {modulo.recursos?.documentos?.length > 0 && (
            <div>
              <h5 className="font-caribbean text-gray-700 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Documentos ({modulo.recursos.documentos.length})
              </h5>
              <div className="space-y-2">
                {modulo.recursos.documentos.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{doc.titulo}</span>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-colonial-blue hover:text-blue-700 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                    <button
                      onClick={() => marcarRecursoCompletado(modulo.id, 'documento', index)}
                      className={`p-1 rounded ${
                        esRecursoCompletado(modulo.id, 'documento', index) 
                          ? 'text-green-500' 
                          : 'text-gray-400 hover:text-green-500'
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enlaces */}
          {modulo.recursos?.enlaces?.length > 0 && (
            <div>
              <h5 className="font-caribbean text-gray-700 mb-2 flex items-center">
                <LinkIcon className="h-4 w-4 mr-2" />
                Enlaces de interés ({modulo.recursos.enlaces.length})
              </h5>
              <div className="space-y-2">
                {modulo.recursos.enlaces.map((enlace, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <LinkIcon className="h-4 w-4 text-gray-500" />
                      <a 
                        href={enlace.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-colonial-blue hover:text-blue-700 transition-colors text-sm"
                      >
                        {enlace.titulo}
                      </a>
                    </div>
                    <button
                      onClick={() => marcarRecursoCompletado(modulo.id, 'enlace', index)}
                      className={`p-1 rounded ${
                        esRecursoCompletado(modulo.id, 'enlace', index) 
                          ? 'text-green-500' 
                          : 'text-gray-400 hover:text-green-500'
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botón de Acción */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setModuloSeleccionado(modulo);
              setVistaActiva('detalle');
            }}
            className="w-full bg-colonial-blue text-white py-3 rounded-lg font-caribbean hover:bg-blue-700 transition-colors"
          >
            {completado ? 'Revisar Contenido' : 'Continuar Aprendiendo'}
          </button>
        </div>
      </div>
    );
  };

  const CardModuloAdmin = ({ modulo }) => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-colonial-blue">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-colonial-blue text-white px-3 py-1 rounded-full text-sm font-caribbean">
                Módulo {modulo.orden}
              </span>
              <h3 className="font-caribbean text-xl text-gray-900">
                {modulo.titulo}
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {modulo.descripcion}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{modulo.duracion_estimada}h</span>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-traditional text-blue-600">
              {modulo.recursos?.videos?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Videos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-traditional text-green-600">
              {modulo.recursos?.documentos?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Documentos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-traditional text-yellow-600">
              {modulo.recursos?.actividades?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Actividades</div>
          </div>
        </div>

        {/* Objetivos de Aprendizaje */}
        {modulo.objetivos_aprendizaje && modulo.objetivos_aprendizaje.length > 0 && (
          <div className="mb-4">
            <h4 className="font-caribbean text-gray-700 mb-2 text-sm">Objetivos:</h4>
            <ul className="space-y-1">
              {modulo.objetivos_aprendizaje.slice(0, 2).map((objetivo, index) => (
                <li key={index} className="text-sm text-gray-600 line-clamp-1">
                  • {objetivo}
                </li>
              ))}
              {modulo.objetivos_aprendizaje.length > 2 && (
                <li className="text-sm text-gray-500">
                  +{modulo.objetivos_aprendizaje.length - 2} más...
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Acciones */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setModuloSeleccionado(modulo);
              setVistaActiva('detalle');
            }}
            className="flex items-center text-colonial-blue hover:text-blue-700 transition-colors font-caribbean"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </button>
          <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Edit className="h-4 w-4" />
            </button>
            <button className="text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VistaDetalleModulo = ({ modulo }) => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-traditional text-2xl text-colonial-blue mb-2">
              Módulo {modulo.orden}: {modulo.titulo}
            </h2>
            <p className="text-gray-600">{modulo.descripcion}</p>
          </div>
          <button 
            onClick={() => setVistaActiva('lista')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-caribbean hover:bg-gray-700 transition-colors"
          >
            Volver
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Objetivos */}
            <div>
              <h3 className="font-caribbean text-lg text-gray-900 mb-3">Objetivos de Aprendizaje</h3>
              <ul className="space-y-2">
                {modulo.objetivos_aprendizaje?.map((objetivo, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    {objetivo}
                  </li>
                ))}
              </ul>
            </div>

            {/* Criterios de Evaluación */}
            {modulo.criterios_evaluacion && modulo.criterios_evaluacion.length > 0 && (
              <div>
                <h3 className="font-caribbean text-lg text-gray-900 mb-3">Criterios de Evaluación</h3>
                <ul className="space-y-2">
                  {modulo.criterios_evaluacion.map((criterio, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <BarChart3 className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      {criterio}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Metadatos */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-caribbean text-blue-900 mb-2">Información del Módulo</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Duración:</span>
                  <span className="text-blue-900">{modulo.duracion_estimada} horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Orden:</span>
                  <span className="text-blue-900">{modulo.orden}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Estado:</span>
                  <span className="text-blue-900 capitalize">{modulo.estado_modulo}</span>
                </div>
              </div>
            </div>

            {/* Recursos Summary */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-caribbean text-green-900 mb-2">Recursos</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Videos:</span>
                  <span className="text-green-900">{modulo.recursos?.videos?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Documentos:</span>
                  <span className="text-green-900">{modulo.recursos?.documentos?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Enlaces:</span>
                  <span className="text-green-900">{modulo.recursos?.enlaces?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Actividades:</span>
                  <span className="text-green-900">{modulo.recursos?.actividades?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FormularioModulo = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="font-traditional text-2xl text-colonial-blue mb-6">
        Crear Nuevo Módulo
      </h3>

      <form onSubmit={crearModulo} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-caribbean text-gray-700 mb-2">
              Título del Módulo *
            </label>
            <input
              type="text"
              required
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
              placeholder="Ej: Introducción al Patrimonio Cultural"
            />
          </div>

          <div>
            <label className="block text-sm font-caribbean text-gray-700 mb-2">
              Orden en el Programa *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.orden}
              onChange={(e) => setFormData(prev => ({ ...prev, orden: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-caribbean text-gray-700 mb-2">
              Duración Estimada (horas) *
            </label>
            <input
              type="number"
              required
              min="1"
              max="20"
              value={formData.duracion_estimada}
              onChange={(e) => setFormData(prev => ({ ...prev, duracion_estimada: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-caribbean text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              required
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
              placeholder="Describe el contenido y propósito de este módulo..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setMostrarFormulario(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-caribbean hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-colonial-yellow text-colonial-blue rounded-lg font-caribbean hover:bg-yellow-500 transition-colors"
          >
            Crear Módulo
          </button>
        </div>
      </form>
    </div>
  );

  if (vistaActiva === 'detalle' && moduloSeleccionado) {
    return <VistaDetalleModulo modulo={moduloSeleccionado} />;
  }

  if (mostrarFormulario) {
    return <FormularioModulo />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="font-traditional text-3xl text-colonial-blue mb-2">
            {modo === 'estudiante' ? 'Mis Módulos de Aprendizaje' : 'Módulos Pedagógicos'}
          </h2>
          <p className="text-gray-600">
            {modo === 'estudiante' 
              ? 'Sigue tu progreso y completa los recursos de aprendizaje' 
              : 'Gestión de contenidos y recursos educativos del programa'
            }
          </p>
        </div>
        
        {modo === 'admin' && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="flex items-center bg-colonial-yellow text-colonial-blue px-6 py-2 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors mt-4 md:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Módulo
          </button>
        )}
      </div>

      {/* Lista de Módulos */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-300 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {modulos.length > 0 ? (
            modulos.map(modulo => (
              modo === 'estudiante' 
                ? <CardModuloEstudiante key={modulo.id} modulo={modulo} />
                : <CardModuloAdmin key={modulo.id} modulo={modulo} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-traditional text-xl text-gray-700 mb-2">
                {modo === 'estudiante' ? 'No hay módulos asignados' : 'No hay módulos creados'}
              </h3>
              <p className="text-gray-600 mb-6">
                {modo === 'estudiante' 
                  ? 'Los módulos estarán disponibles una vez que te inscribas en un programa.' 
                  : 'Comienza creando el primer módulo para el programa.'
                }
              </p>
              {modo === 'admin' && (
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="bg-colonial-yellow text-colonial-blue px-6 py-3 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Módulo
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModulosPedagogicos;
