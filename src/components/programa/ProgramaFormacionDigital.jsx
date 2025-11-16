import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { programaFormacionService } from '../../services/programaFormacionService';
import {
  Users,
  BookOpen,
  Calendar,
  Award,
  Download,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  QrCode,
  BarChart3,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ProgramaFormacionDigital = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [programa, setPrograma] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [vistaActiva, setVistaActiva] = useState('general');

  useEffect(() => {
    cargarPrograma();
  }, [currentUser]);

  const cargarPrograma = async () => {
    try {
      setLoading(true);
      
      const programas = await programaFormacionService.getProgramasActivos();
      const programaActivo = programas[0];
      
      if (!programaActivo) {
        setLoading(false);
        return;
      }

      setPrograma(programaActivo);

      const [inscripcionesData, estadisticasData] = await Promise.all([
        programaFormacionService.getInscripcionesByPrograma(programaActivo.id),
        programaFormacionService.getEstadisticasPrograma(programaActivo.id)
      ]);

      setInscripciones(inscripcionesData);
      setEstadisticas(estadisticasData);

    } catch (error) {
      console.error('Error cargando programa:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar inscripciones
  const inscripcionesFiltradas = inscripciones.filter(inscripcion => {
    const coincideEstado = filtroEstado === 'todos' || inscripcion.estado_inscripcion === filtroEstado;
    
    const coincideBusqueda = busqueda === '' || 
      inscripcion.user?.user_metadata?.full_name?.toLowerCase().includes(busqueda.toLowerCase()) ||
      inscripcion.user?.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      inscripcion.datos_contacto?.barrio?.toLowerCase().includes(busqueda.toLowerCase());

    return coincideEstado && coincideBusqueda;
  });

  const CardEstadistica = ({ icon: Icon, titulo, valor, subtitulo, color = 'blue', tendencia }) => (
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
      {tendencia && (
        <div className={`flex items-center mt-2 text-xs ${
          tendencia > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className="h-3 w-3 mr-1" />
          {tendencia > 0 ? '+' : ''}{tendencia}%
        </div>
      )}
    </div>
  );

  const EstadoBadge = ({ estado }) => {
    const config = {
      activo: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      completado: { color: 'bg-blue-100 text-blue-800', icon: Award },
      retirado: { color: 'bg-red-100 text-red-800', icon: XCircle },
      suspendido: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };

    const { color, icon: Icon } = config[estado] || config.activo;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {estado}
      </span>
    );
  };

  const generarReporteExcel = () => {
    // Simular descarga de reporte
    const datos = inscripcionesFiltradas.map(inscripcion => ({
      'Nombre': inscripcion.user?.user_metadata?.full_name || 'N/A',
      'Email': inscripcion.user?.email,
      'Teléfono': inscripcion.datos_contacto?.telefono || 'N/A',
      'Barrio': inscripcion.datos_contacto?.barrio || 'N/A',
      'Edad': inscripcion.datos_contacto?.edad || 'N/A',
      'Estado': inscripcion.estado_inscripcion,
      'Fecha Inscripción': new Date(inscripcion.fecha_inscripcion).toLocaleDateString()
    }));

    console.log('Generando reporte Excel:', datos);
    alert('Reporte generado para descarga');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-colonial-sand py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!programa) {
    return (
      <div className="min-h-screen bg-colonial-sand py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="font-traditional text-2xl text-gray-700 mb-2">
              No hay programas activos
            </h2>
            <p className="text-gray-600">
              No se encontraron programas de formación activos.
            </p>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h1 className="font-traditional text-3xl text-colonial-blue mb-2">
                Programa de Formación Digital
              </h1>
              <p className="text-gray-600 max-w-2xl">
                {programa.nombre} • Gestión de {estadisticas?.totalInscritos || 0} jóvenes inscritos
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button 
                onClick={generarReporteExcel}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-caribbean hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </button>
              <button className="flex items-center bg-colonial-yellow text-colonial-blue px-4 py-2 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Taller
              </button>
            </div>
          </div>

          {/* Navegación */}
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-inner">
            {[
              { id: 'general', label: 'Visión General', icon: BarChart3 },
              { id: 'jovenes', label: 'Jóvenes', icon: Users },
              { id: 'modulos', label: 'Módulos', icon: BookOpen },
              { id: 'talleres', label: 'Talleres', icon: Calendar },
              { id: 'certificaciones', label: 'Certificaciones', icon: Award }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setVistaActiva(item.id)}
                  className={`flex items-center px-4 py-2 rounded-md font-caribbean transition-colors ${
                    vistaActiva === item.id
                      ? 'bg-colonial-blue text-white shadow-md'
                      : 'text-gray-600 hover:text-colonial-blue hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Estadísticas Principales */}
        {vistaActiva === 'general' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <CardEstadistica 
                icon={Users}
                titulo="Total Inscritos"
                valor={estadisticas?.totalInscritos || 0}
                subtitulo={`${estadisticas?.activos || 0} activos`}
                color="blue"
              />
              
              <CardEstadistica 
                icon={UserCheck}
                titulo="Completados"
                valor={estadisticas?.completados || 0}
                subtitulo={`${Math.round((estadisticas?.completados / estadisticas?.totalInscritos) * 100) || 0}% del total`}
                color="green"
              />
              
              <CardEstadistica 
                icon={Award}
                titulo="Certificados"
                valor={estadisticas?.certificadosEmitidos || 0}
                subtitulo="Certificaciones emitidas"
                color="yellow"
              />
              
              <CardEstadistica 
                icon={TrendingUp}
                titulo="Progreso Promedio"
                valor={`${estadisticas?.promedioProgreso || 0}%`}
                subtitulo="Avance general"
                color="purple"
              />
            </div>

            {/* Gráficos de Progreso (Placeholder) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="font-caribbean text-lg text-gray-900 mb-4">
                  Distribución por Estado
                </h3>
                <div className="space-y-3">
                  {[
                    { estado: 'activo', count: estadisticas?.activos || 0, color: 'bg-green-500' },
                    { estado: 'completado', count: estadisticas?.completados || 0, color: 'bg-blue-500' },
                    { estado: 'retirado', count: 0, color: 'bg-red-500' },
                    { estado: 'suspendido', count: 0, color: 'bg-yellow-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                        <span className="font-caribbean text-gray-700 capitalize">
                          {item.estado}
                        </span>
                      </div>
                      <span className="text-gray-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="font-caribbean text-lg text-gray-900 mb-4">
                  Progreso por Módulos
                </h3>
                <div className="space-y-4">
                  {[
                    { modulo: 'Patrimonio Cultural', progreso: 85 },
                    { modulo: 'Herramientas Digitales', progreso: 60 },
                    { modulo: 'Gestión de Proyectos', progreso: 45 }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{item.modulo}</span>
                        <span>{item.progreso}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-colonial-yellow h-2 rounded-full"
                          style={{ width: `${item.progreso}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Vista de Jóvenes */}
        {vistaActiva === 'jovenes' && (
          <div className="bg-white rounded-xl shadow-lg">
            {/* Filtros y Búsqueda */}
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar jóvenes..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="activo">Activos</option>
                    <option value="completado">Completados</option>
                    <option value="retirado">Retirados</option>
                    <option value="suspendido">Suspendidos</option>
                  </select>
                </div>
                
                <div className="text-sm text-gray-600">
                  {inscripcionesFiltradas.length} de {inscripciones.length} jóvenes
                </div>
              </div>
            </div>

            {/* Tabla de Jóvenes */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-caribbean text-gray-500 uppercase tracking-wider">
                      Joven
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-caribbean text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-caribbean text-gray-500 uppercase tracking-wider">
                      Barrio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-caribbean text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-caribbean text-gray-500 uppercase tracking-wider">
                      Fecha Inscripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-caribbean text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inscripcionesFiltradas.map((inscripcion) => (
                    <tr key={inscripcion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-caribbean text-gray-900">
                            {inscripcion.user?.user_metadata?.full_name || 'Nombre no disponible'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {inscripcion.user?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {inscripcion.datos_contacto?.telefono || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Edad: {inscripcion.datos_contacto?.edad || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inscripcion.datos_contacto?.barrio || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <EstadoBadge estado={inscripcion.estado_inscripcion} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(inscripcion.fecha_inscripcion).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="text-colonial-blue hover:text-blue-700 transition-colors"
                            title="Ver progreso"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {inscripcionesFiltradas.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No se encontraron jóvenes con los filtros aplicados.</p>
              </div>
            )}
          </div>
        )}

        {/* Otras vistas (Placeholder) */}
        {vistaActiva === 'modulos' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-traditional text-xl text-gray-700 mb-2">
              Gestión de Módulos
            </h3>
            <p className="text-gray-600">
              Vista en desarrollo - Próximamente
            </p>
          </div>
        )}

        {vistaActiva === 'talleres' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-traditional text-xl text-gray-700 mb-2">
              Gestión de Talleres
            </h3>
            <p className="text-gray-600">
              Vista en desarrollo - Próximamente
            </p>
          </div>
        )}

        {vistaActiva === 'certificaciones' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-traditional text-xl text-gray-700 mb-2">
              Gestión de Certificaciones
            </h3>
            <p className="text-gray-600">
              Vista en desarrollo - Próximamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramaFormacionDigital;
