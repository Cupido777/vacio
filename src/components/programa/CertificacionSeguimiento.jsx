import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { programaFormacionService } from '../../services/programaFormacionService';
import {
  Award,
  Download,
  Eye,
  Search,
  Filter,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Users,
  TrendingUp,
  FileText,
  Mail,
  QrCode,
  Shield
} from 'lucide-react';

const CertificacionSeguimiento = ({ programaId, modo = 'admin' }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [certificaciones, setCertificaciones] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);
  const [vistaActiva, setVistaActiva] = useState('certificaciones');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [certificadoSeleccionado, setCertificadoSeleccionado] = useState(null);
  const [mostrarGenerador, setMostrarGenerador] = useState(false);

  useEffect(() => {
    if (programaId) {
      cargarDatos();
    }
  }, [programaId]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      if (modo === 'estudiante' && currentUser) {
        // Cargar certificación del estudiante actual
        const certificacion = await programaFormacionService.getCertificadoByJoven(currentUser.id, programaId);
        if (certificacion) {
          setCertificaciones([certificacion]);
        }
        
        // Cargar seguimientos del estudiante
        // Esto sería una nueva función en el servicio
        const seguimientosData = []; // Placeholder
        setSeguimientos(seguimientosData);
      } else {
        // Cargar todas las certificaciones (admin)
        // Esto requeriría una nueva función en el servicio
        const certificacionesData = []; // Placeholder con datos de ejemplo
        setCertificaciones(certificacionesData);
        
        // Cargar seguimientos generales
        const seguimientosData = []; // Placeholder
        setSeguimientos(seguimientosData);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarCertificado = async (jovenId) => {
    try {
      const certificado = await programaFormacionService.generarCertificado(jovenId, programaId);
      setCertificaciones(prev => [certificado, ...prev]);
      alert('Certificado generado exitosamente');
    } catch (error) {
      console.error('Error generando certificado:', error);
      alert(error.message || 'Error al generar certificado');
    }
  };

  const verificarCertificado = (codigo) => {
    // En una implementación real, esto verificaría contra la base de datos
    const certificado = certificaciones.find(c => c.codigo_certificado === codigo);
    return certificado;
  };

  const exportarReporte = (tipo) => {
    // Simular exportación de reportes
    console.log(`Exportando reporte ${tipo}`);
    alert(`Reporte ${tipo} generado para descarga`);
  };

  const CardCertificadoEstudiante = ({ certificado }) => {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gold-500 relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-yellow-50 opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-200 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10 text-center">
          {/* Encabezado */}
          <div className="flex justify-center mb-6">
            <div className="bg-colonial-blue p-4 rounded-full">
              <Award className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Título */}
          <h2 className="font-traditional text-3xl text-colonial-blue mb-2">
            Certificado de Finalización
          </h2>
          <p className="text-gray-600 mb-6">
            Se otorga el presente certificado a
          </p>

          {/* Nombre del Estudiante */}
          <div className="border-b-2 border-colonial-blue pb-4 mb-6">
            <h3 className="font-traditional text-2xl text-gray-900 mb-2">
              {currentUser?.user_metadata?.full_name || 'Nombre del Estudiante'}
            </h3>
            <p className="text-gray-600">
              Por haber completado satisfactoriamente el programa
            </p>
          </div>

          {/* Detalles del Programa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
            <div>
              <strong>Programa:</strong><br />
              {certificado.programa?.nombre || 'Formación Digital para Jóvenes Creativos'}
            </div>
            <div>
              <strong>Fecha de Emisión:</strong><br />
              {new Date(certificado.fecha_emision).toLocaleDateString('es-ES')}
            </div>
          </div>

          {/* Código de Verificación */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Código de verificación:</p>
            <p className="font-mono text-lg text-colonial-blue">
              {certificado.codigo_certificado}
            </p>
          </div>

          {/* Acciones */}
          <div className="flex justify-center space-x-4">
            <button className="flex items-center bg-colonial-blue text-white px-6 py-3 rounded-lg font-caribbean hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </button>
            <button className="flex items-center border border-colonial-blue text-colonial-blue px-6 py-3 rounded-lg font-caribbean hover:bg-blue-50 transition-colors">
              <Share className="h-4 w-4 mr-2" />
              Compartir
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CardCertificadoAdmin = ({ certificado }) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-green-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-caribbean text-lg text-gray-900 mb-2">
              {certificado.joven_nombre || 'Estudiante'}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              {certificado.programa_nombre || 'Programa de Formación'}
            </p>
            <p className="text-xs text-gray-500">
              Emitido: {new Date(certificado.fecha_emision).toLocaleDateString('es-ES')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-600 font-caribbean">Activo</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Código:</span>
            <p className="font-mono text-gray-900">{certificado.codigo_certificado}</p>
          </div>
          <div>
            <span className="text-gray-500">Vence:</span>
            <p className="text-gray-900">
              {certificado.fecha_vencimiento 
                ? new Date(certificado.fecha_vencimiento).toLocaleDateString('es-ES')
                : 'No vence'
              }
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            onClick={() => setCertificadoSeleccionado(certificado)}
            className="flex items-center text-colonial-blue hover:text-blue-700 transition-colors text-sm font-caribbean"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </button>
          <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Download className="h-4 w-4" />
            </button>
            <button className="text-gray-400 hover:text-red-600 transition-colors">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CardSeguimiento = ({ seguimiento }) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-caribbean text-lg text-gray-900 mb-2">
              {seguimiento.joven_nombre || 'Estudiante'}
            </h3>
            <p className="text-sm text-gray-600">
              Seguimiento del {new Date(seguimiento.fecha_seguimiento).toLocaleDateString('es-ES')}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            seguimiento.satisfaccion_general >= 4 
              ? 'bg-green-100 text-green-800'
              : seguimiento.satisfaccion_general >= 3
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            Satisfacción: {seguimiento.satisfaccion_general}/5
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <span className="text-sm font-caribbean text-gray-700">Situación laboral:</span>
            <p className="text-sm text-gray-600">{seguimiento.empleabilidad_actual || 'No especificada'}</p>
          </div>
          
          {seguimiento.proyectos_emprendimiento?.length > 0 && (
            <div>
              <span className="text-sm font-caribbean text-gray-700">Proyectos:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {seguimiento.proyectos_emprendimiento.slice(0, 3).map((proyecto, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {proyecto}
                  </span>
                ))}
                {seguimiento.proyectos_emprendimiento.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    +{seguimiento.proyectos_emprendimiento.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {seguimiento.logros_destacados && (
            <div>
              <span className="text-sm font-caribbean text-gray-700">Logros:</span>
              <p className="text-sm text-gray-600 line-clamp-2">{seguimiento.logros_destacados}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button className="text-colonial-blue hover:text-blue-700 transition-colors text-sm font-caribbean">
            Ver Detalles Completos
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const VistaDetalleCertificado = ({ certificado }) => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-traditional text-2xl text-colonial-blue mb-2">
              Detalles del Certificado
            </h2>
            <p className="text-gray-600">Información completa del certificado emitido</p>
          </div>
          <button 
            onClick={() => setCertificadoSeleccionado(null)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-caribbean hover:bg-gray-700 transition-colors"
          >
            Volver
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información Principal */}
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-caribbean text-blue-900 mb-3">Información del Certificado</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Código:</span>
                  <span className="text-blue-900 font-mono">{certificado.codigo_certificado}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Fecha de Emisión:</span>
                  <span className="text-blue-900">
                    {new Date(certificado.fecha_emision).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Fecha de Vencimiento:</span>
                  <span className="text-blue-900">
                    {certificado.fecha_vencimiento 
                      ? new Date(certificado.fecha_vencimiento).toLocaleDateString('es-ES')
                      : 'No vence'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Estado:</span>
                  <span className="text-blue-900 capitalize">{certificado.estado}</span>
                </div>
              </div>
            </div>

            {/* Información del Joven */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-caribbean text-green-900 mb-3">Información del Estudiante</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Nombre:</span>
                  <span className="text-green-900">{certificado.joven_nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Email:</span>
                  <span className="text-green-900">{certificado.joven_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Programa:</span>
                  <span className="text-green-900">{certificado.programa_nombre}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Habilidades y Acciones */}
          <div className="space-y-6">
            {/* Habilidades Adquiridas */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-caribbean text-yellow-900 mb-3">Habilidades Adquiridas</h3>
              <div className="flex flex-wrap gap-2">
                {certificado.habilidades_adquiridas?.map((habilidad, index) => (
                  <span
                    key={index}
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs"
                  >
                    {habilidad}
                  </span>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-caribbean text-gray-900 mb-3">Acciones</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center bg-colonial-blue text-white py-2 rounded-lg font-caribbean hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Certificado (PDF)
                </button>
                <button className="w-full flex items-center justify-center border border-colonial-blue text-colonial-blue py-2 rounded-lg font-caribbean hover:bg-blue-50 transition-colors">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar por Email
                </button>
                <button className="w-full flex items-center justify-center border border-gray-300 text-gray-700 py-2 rounded-lg font-caribbean hover:bg-gray-100 transition-colors">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generar Código QR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GeneradorCertificados = () => {
    const [jovenesElegibles, setJovenesElegibles] = useState([]);
    const [jovenSeleccionado, setJovenSeleccionado] = useState('');

    useEffect(() => {
      // Cargar jóvenes elegibles para certificación
      const cargarJovenesElegibles = async () => {
        // Esto sería una nueva función en el servicio
        const jovenesData = []; // Placeholder
        setJovenesElegibles(jovenesData);
      };
      cargarJovenesElegibles();
    }, []);

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="font-traditional text-2xl text-colonial-blue mb-6">
          Generar Nuevo Certificado
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-caribbean text-gray-700 mb-2">
              Seleccionar Estudiante *
            </label>
            <select
              value={jovenSeleccionado}
              onChange={(e) => setJovenSeleccionado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
            >
              <option value="">Selecciona un estudiante</option>
              {jovenesElegibles.map(joven => (
                <option key={joven.id} value={joven.id}>
                  {joven.nombre} - {joven.email}
                </option>
              ))}
            </select>
          </div>

          {jovenSeleccionado && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-caribbean text-green-900 mb-3">Resumen de Elegibilidad</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Progreso del Programa:</span>
                  <span className="text-green-900">100% completado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Proyecto Final:</span>
                  <span className="text-green-900">Entregado y aprobado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Asistencia a Talleres:</span>
                  <span className="text-green-900">85% (Cumple requisitos)</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => setMostrarGenerador(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-caribbean hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => jovenSeleccionado && generarCertificado(jovenSeleccionado)}
              disabled={!jovenSeleccionado}
              className="px-6 py-3 bg-colonial-yellow text-colonial-blue rounded-lg font-caribbean hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generar Certificado
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (certificadoSeleccionado) {
    return <VistaDetalleCertificado certificado={certificadoSeleccionado} />;
  }

  if (mostrarGenerador) {
    return <GeneradorCertificados />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="font-traditional text-3xl text-colonial-blue mb-2">
            {modo === 'estudiante' ? 'Mi Certificación' : 'Certificación y Seguimiento'}
          </h2>
          <p className="text-gray-600">
            {modo === 'estudiante' 
              ? 'Gestiona tu certificado y seguimiento post-formación' 
              : 'Sistema de certificación y seguimiento de egresados'
            }
          </p>
        </div>
        
        {modo === 'admin' && (
          <div className="flex space-x-4 mt-4 md:mt-0">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-colonial-blue focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="expirado">Expirados</option>
              <option value="revocado">Revocados</option>
            </select>
            
            <button
              onClick={() => setMostrarGenerador(true)}
              className="flex items-center bg-colonial-yellow text-colonial-blue px-6 py-2 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors"
            >
              <Award className="h-4 w-4 mr-2" />
              Generar Certificado
            </button>
          </div>
        )}
      </div>

      {/* Navegación */}
      {modo === 'admin' && (
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-inner">
          {[
            { id: 'certificaciones', label: 'Certificaciones', icon: Award },
            { id: 'seguimiento', label: 'Seguimiento', icon: TrendingUp },
            { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 }
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
      )}

      {/* Contenido Principal */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Vista Certificaciones */}
          {(vistaActiva === 'certificaciones' || modo === 'estudiante') && (
            <>
              {certificaciones.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {certificaciones.map(certificado => (
                    modo === 'estudiante' 
                      ? <CardCertificadoEstudiante key={certificado.id} certificado={certificado} />
                      : <CardCertificadoAdmin key={certificado.id} certificado={certificado} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                  <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-traditional text-xl text-gray-700 mb-2">
                    {modo === 'estudiante' 
                      ? 'Aún no tienes certificados' 
                      : 'No hay certificados emitidos'
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {modo === 'estudiante' 
                      ? 'Completa el programa para obtener tu certificado.' 
                      : 'Comienza generando el primer certificado.'
                    }
                  </p>
                  {modo === 'admin' && (
                    <button
                      onClick={() => setMostrarGenerador(true)}
                      className="bg-colonial-yellow text-colonial-blue px-6 py-3 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Generar Primer Certificado
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Vista Seguimiento (Solo Admin) */}
          {vistaActiva === 'seguimiento' && modo === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {seguimientos.length > 0 ? (
                seguimientos.map(seguimiento => (
                  <CardSeguimiento key={seguimiento.id} seguimiento={seguimiento} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-lg">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-traditional text-xl text-gray-700 mb-2">
                    No hay seguimientos registrados
                  </h3>
                  <p className="text-gray-600">
                    Los seguimientos aparecerán una vez que los egresados completen las encuestas.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Vista Estadísticas (Solo Admin) */}
          {vistaActiva === 'estadisticas' && modo === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="text-3xl font-traditional text-blue-600 mb-2">
                  {certificaciones.length}
                </div>
                <div className="text-sm text-gray-600">Certificados Emitidos</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="text-3xl font-traditional text-green-600 mb-2">
                  {certificaciones.filter(c => c.estado === 'activo').length}
                </div>
                <div className="text-sm text-gray-600">Certificados Activos</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="text-3xl font-traditional text-yellow-600 mb-2">
                  {seguimientos.length}
                </div>
                <div className="text-sm text-gray-600">Seguimientos Realizados</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="text-3xl font-traditional text-purple-600 mb-2">
                  {seguimientos.length > 0 
                    ? Math.round(seguimientos.reduce((sum, s) => sum + s.satisfaccion_general, 0) / seguimientos.length) 
                    : 0
                  }/5
                </div>
                <div className="text-sm text-gray-600">Satisfacción Promedio</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificacionSeguimiento;
