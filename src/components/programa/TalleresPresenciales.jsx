import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { programaFormacionService } from '../../services/programaFormacionService';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  QrCode,
  Download,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  UserCheck,
  BarChart3,
  Search,
  Filter
} from 'lucide-react';

const TalleresPresenciales = ({ programaId }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [talleres, setTalleres] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [vistaActiva, setVistaActiva] = useState('lista');
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Estados para formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_taller: '',
    duracion_horas: 3,
    ubicacion: '',
    capacidad_maxima: 30,
    materiales_necesarios: []
  });

  useEffect(() => {
    if (programaId) {
      cargarTalleres();
    }
  }, [programaId]);

  const cargarTalleres = async () => {
    try {
      setLoading(true);
      const talleresData = await programaFormacionService.getTalleresByPrograma(programaId);
      setTalleres(talleresData);
    } catch (error) {
      console.error('Error cargando talleres:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarAsistencias = async (tallerId) => {
    try {
      // En una implementación real, esto vendría del servicio
      const asistenciasData = []; // Placeholder
      setAsistencias(asistenciasData);
    } catch (error) {
      console.error('Error cargando asistencias:', error);
    }
  };

  const generarCodigoQR = (tallerId) => {
    // En una implementación real, esto generaría un QR único
    const codigoQR = `ODAM-TALLER-${tallerId}-${Date.now()}`;
    return codigoQR;
  };

  const crearTaller = async (e) => {
    e.preventDefault();
    try {
      const qrCode = generarCodigoQR('nuevo');
      const tallerData = {
        ...formData,
        programa_id: programaId,
        qr_code: qrCode,
        estado_taller: 'programado'
      };

      // En una implementación real, esto llamaría al servicio
      console.log('Creando taller:', tallerData);
      
      // Simular creación exitosa
      const nuevoTaller = {
        id: `taller-${Date.now()}`,
        ...tallerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setTalleres(prev => [nuevoTaller, ...prev]);
      setMostrarFormulario(false);
      resetFormulario();
      
      alert('Taller creado exitosamente');
    } catch (error) {
      console.error('Error creando taller:', error);
      alert('Error al crear el taller');
    }
  };

  const resetFormulario = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      fecha_taller: '',
      duracion_horas: 3,
      ubicacion: '',
      capacidad_maxima: 30,
      materiales_necesarios: []
    });
  };

  const talleresFiltrados = talleres.filter(taller => {
    if (filtroEstado === 'todos') return true;
    return taller.estado_taller === filtroEstado;
  });

  const EstadoBadge = ({ estado }) => {
    const config = {
      programado: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      en_curso: { color: 'bg-yellow-100 text-yellow-800', icon: UserCheck },
      completado: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelado: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const { color, icon: Icon } = config[estado] || config.programado;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {estado.replace('_', ' ')}
      </span>
    );
  };

  const CardTaller = ({ taller }) => {
    const fecha = new Date(taller.fecha_taller);
    const ahora = new Date();
    const haPasado = fecha < ahora;
    const esHoy = fecha.toDateString() === ahora.toDateString();

    return (
      <div className={`bg-white rounded-lg p-6 shadow-lg border-l-4 ${
        haPasado ? 'border-gray-400' : 
        esHoy ? 'border-green-500' : 'border-blue-500'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-caribbean text-xl text-gray-900 mb-2">
              {taller.titulo}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              {taller.descripcion}
            </p>
          </div>
          <div className="flex space-x-2 ml-4">
            <EstadoBadge estado={taller.estado_taller} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
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
            <Clock className="h-4 w-4 mr-2" />
            {taller.duracion_horas} horas
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {taller.ubicacion}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            Capacidad: {taller.capacidad_maxima} personas
          </div>
        </div>

        {taller.materiales_necesarios && taller.materiales_necesarios.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-caribbean text-gray-700 mb-2">Materiales necesarios:</p>
            <div className="flex flex-wrap gap-2">
              {taller.materiales_necesarios.map((material, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setTallerSeleccionado(taller);
                setVistaActiva('qr');
              }}
              className="flex items-center bg-colonial-blue text-white px-4 py-2 rounded-lg font-caribbean hover:bg-blue-700 transition-colors text-sm"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Código QR
            </button>
            
            <button
              onClick={() => {
                setTallerSeleccionado(taller);
                setVistaActiva('asistencia');
                cargarAsistencias(taller.id);
              }}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-caribbean hover:bg-green-700 transition-colors text-sm"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Asistencia
            </button>
          </div>

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

  const VistaQR = ({ taller }) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${taller.qr_code}`;

    return (
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <h3 className="font-traditional text-2xl text-colonial-blue mb-2">
            Código QR del Taller
          </h3>
          <p className="text-gray-600 mb-6">{taller.titulo}</p>
          
          <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 inline-block mb-6">
            <img 
              src={qrUrl} 
              alt={`Código QR para ${taller.titulo}`}
              className="w-64 h-64 mx-auto"
            />
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <p><strong>Código:</strong> {taller.qr_code}</p>
            <p><strong>Fecha:</strong> {new Date(taller.fecha_taller).toLocaleDateString('es-ES')}</p>
            <p><strong>Ubicación:</strong> {taller.ubicacion}</p>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button className="flex items-center bg-colonial-yellow text-colonial-blue px-6 py-3 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Descargar QR
            </button>
            <button 
              onClick={() => setVistaActiva('lista')}
              className="flex items-center bg-gray-600 text-white px-6 py-3 rounded-lg font-caribbean hover:bg-gray-700 transition-colors"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VistaAsistencia = ({ taller }) => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-traditional text-2xl text-colonial-blue mb-2">
              Control de Asistencia
            </h3>
            <p className="text-gray-600">{taller.titulo}</p>
          </div>
          <button 
            onClick={() => setVistaActiva('lista')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-caribbean hover:bg-gray-700 transition-colors"
          >
            Volver
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-traditional text-blue-600 mb-1">
              {asistencias.filter(a => a.asistio).length}
            </div>
            <div className="text-sm text-blue-700">Asistentes</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-traditional text-green-600 mb-1">
              {Math.round((asistencias.filter(a => a.asistio).length / taller.capacidad_maxima) * 100)}%
            </div>
            <div className="text-sm text-green-700">Ocupación</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-2xl font-traditional text-yellow-600 mb-1">
              {taller.capacidad_maxima - asistencias.filter(a => a.asistio).length}
            </div>
            <div className="text-sm text-yellow-700">Cupos libres</div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-caribbean text-gray-500 uppercase">
                  Joven
                </th>
                <th className="px-6 py-3 text-left text-xs font-caribbean text-gray-500 uppercase">
                  Asistió
                </th>
                <th className="px-6 py-3 text-left text-xs font-caribbean text-gray-500 uppercase">
                  Hora Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-caribbean text-gray-500 uppercase">
                  Método
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {asistencias.length > 0 ? (
                asistencias.map((asistencia) => (
                  <tr key={asistencia.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asistencia.joven_nombre || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {asistencia.asistio ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asistencia.hora_registro ? 
                        new Date(asistencia.hora_registro).toLocaleTimeString('es-ES') : 
                        'No registrado'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {asistencia.metodo_registro || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p>No hay datos de asistencia registrados</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const FormularioTaller = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="font-traditional text-2xl text-colonial-blue mb-6">
        Crear Nuevo Taller
      </h3>

      <form onSubmit={crearTaller} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-caribbean text-gray-700 mb-2">
              Título del Taller *
            </label>
            <input
              type="text"
              required
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
              placeholder="Ej: Introducción a la Producción Musical"
            />
          </div>

          <div>
            <label className="block text-sm font-caribbean text-gray-700 mb-2">
              Fecha y Hora *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.fecha_taller}
              onChange={(e) => setFormData(prev => ({ ...prev, fecha_taller: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-caribbean text-gray-700 mb-2">
              Duración (horas) *
            </label>
            <input
              type="number"
              required
              min="1"
              max="8"
              value={formData.duracion_horas}
              onChange={(e) => setFormData(prev => ({ ...prev, duracion_horas: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-caribbean text-gray-700 mb-2">
              Capacidad Máxima *
            </label>
            <input
              type="number"
              required
              min="1"
              max="100"
              value={formData.capacidad_maxima}
              onChange={(e) => setFormData(prev => ({ ...prev, capacidad_maxima: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-caribbean text-gray-700 mb-2">
              Ubicación *
            </label>
            <input
              type="text"
              required
              value={formData.ubicacion}
              onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
              placeholder="Ej: Centro Cultural IPCC, Cartagena"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-caribbean text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
              placeholder="Describe los objetivos y contenido del taller..."
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
            Crear Taller
          </button>
        </div>
      </form>
    </div>
  );

  if (vistaActiva === 'qr' && tallerSeleccionado) {
    return <VistaQR taller={tallerSeleccionado} />;
  }

  if (vistaActiva === 'asistencia' && tallerSeleccionado) {
    return <VistaAsistencia taller={tallerSeleccionado} />;
  }

  if (mostrarFormulario) {
    return <FormularioTaller />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="font-traditional text-3xl text-colonial-blue mb-2">
            Talleres Presenciales
          </h2>
          <p className="text-gray-600">
            Gestión de talleres y control de asistencia con código QR
          </p>
        </div>
        
        <div className="flex space-x-4 mt-4 md:mt-0">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
          >
            <option value="todos">Todos los talleres</option>
            <option value="programado">Programados</option>
            <option value="en_curso">En curso</option>
            <option value="completado">Completados</option>
            <option value="cancelado">Cancelados</option>
          </select>
          
          <button
            onClick={() => setMostrarFormulario(true)}
            className="flex items-center bg-colonial-yellow text-colonial-blue px-6 py-2 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Taller
          </button>
        </div>
      </div>

      {/* Lista de Talleres */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {talleresFiltrados.length > 0 ? (
            talleresFiltrados.map(taller => (
              <CardTaller key={taller.id} taller={taller} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-traditional text-xl text-gray-700 mb-2">
                No hay talleres programados
              </h3>
              <p className="text-gray-600 mb-6">
                Comienza creando el primer taller para el programa.
              </p>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="bg-colonial-yellow text-colonial-blue px-6 py-3 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Taller
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TalleresPresenciales;
