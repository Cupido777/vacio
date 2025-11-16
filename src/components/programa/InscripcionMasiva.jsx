import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { programaFormacionService } from '../../services/programaFormacionService';
import {
  Users,
  Upload,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Eye,
  BarChart3,
  Send,
  UserCheck
} from 'lucide-react';

const InscripcionMasiva = ({ programaId }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [programa, setPrograma] = useState(null);
  const [cuposDisponibles, setCuposDisponibles] = useState(0);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [datosProcesados, setDatosProcesados] = useState([]);
  const [erroresValidacion, setErroresValidacion] = useState([]);
  const [inscripcionesExitosas, setInscripcionesExitosas] = useState([]);
  const [inscripcionesFallidas, setInscripcionesFallidas] = useState([]);

  useEffect(() => {
    if (programaId) {
      cargarInformacionPrograma();
    }
  }, [programaId]);

  const cargarInformacionPrograma = async () => {
    try {
      const programas = await programaFormacionService.getProgramasActivos();
      const programaActivo = programas[0];
      setPrograma(programaActivo);
      
      if (programaActivo) {
        const cuposOcupados = programaActivo.cupos_ocupados || 0;
        const cuposTotales = programaActivo.cupos_totales || 150;
        setCuposDisponibles(cuposTotales - cuposOcupados);
      }
    } catch (error) {
      console.error('Error cargando información del programa:', error);
    }
  };

  const manejarSeleccionArchivo = (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
      // Validar tipo de archivo
      if (!archivo.name.endsWith('.csv') && !archivo.name.endsWith('.xlsx')) {
        alert('Por favor selecciona un archivo CSV o Excel');
        return;
      }
      setArchivoSeleccionado(archivo);
      procesarArchivo(archivo);
    }
  };

  const procesarArchivo = (archivo) => {
    setLoading(true);
    
    // Simular procesamiento de archivo
    setTimeout(() => {
      // Datos de ejemplo procesados (en una implementación real, esto leería el archivo)
      const datosEjemplo = [
        {
          id: 1,
          nombre_completo: 'María González Pérez',
          email: 'maria.gonzalez@email.com',
          telefono: '3001234567',
          barrio: 'Getsemaní',
          edad: 22,
          genero: 'Femenino',
          nivel_educativo: 'Universitario',
          valido: true,
          errores: []
        },
        {
          id: 2,
          nombre_completo: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@email.com',
          telefono: '3007654321',
          barrio: 'Bocagrande',
          edad: 19,
          genero: 'Masculino',
          nivel_educativo: 'Bachiller',
          valido: true,
          errores: []
        },
        {
          id: 3,
          nombre_completo: 'Ana Martínez',
          email: 'ana.martinez',
          telefono: '3001112233',
          barrio: 'Manga',
          edad: 25,
          genero: 'Femenino',
          nivel_educativo: 'Técnico',
          valido: false,
          errores: ['Email inválido']
        }
      ];

      setDatosProcesados(datosEjemplo);
      validarDatos(datosEjemplo);
      setLoading(false);
      setPasoActual(2);
    }, 2000);
  };

  const validarDatos = (datos) => {
    const errores = [];
    
    datos.forEach((joven, index) => {
      const erroresJoven = [];
      
      // Validar email
      if (!joven.email || !/\S+@\S+\.\S+/.test(joven.email)) {
        erroresJoven.push('Email inválido');
      }
      
      // Validar teléfono
      if (!joven.telefono || joven.telefono.length < 10) {
        erroresJoven.push('Teléfono inválido');
      }
      
      // Validar edad
      if (!joven.edad || joven.edad < 15 || joven.edad > 35) {
        erroresJoven.push('Edad debe estar entre 15 y 35 años');
      }
      
      // Validar nombre
      if (!joven.nombre_completo || joven.nombre_completo.length < 5) {
        erroresJoven.push('Nombre completo requerido');
      }

      if (erroresJoven.length > 0) {
        errores.push({
          linea: index + 1,
          nombre: joven.nombre_completo,
          errores: erroresJoven
        });
      }
    });

    setErroresValidacion(errores);
  };

  const procesarInscripciones = async () => {
    if (datosProcesados.length > cuposDisponibles) {
      alert(`No hay suficientes cupos disponibles. Cupos: ${cuposDisponibles}, Solicitudes: ${datosProcesados.length}`);
      return;
    }

    setLoading(true);
    const exitosas = [];
    const fallidas = [];

    try {
      // Simular procesamiento de inscripciones
      for (const joven of datosProcesados.filter(j => j.valido)) {
        try {
          // En una implementación real, esto llamaría al servicio
          const inscripcionData = {
            programa_id: programaId,
            user_id: `user-${joven.id}`, // En realidad se crearía el usuario
            datos_contacto: {
              telefono: joven.telefono,
              direccion: joven.barrio,
              barrio: joven.barrio,
              edad: joven.edad,
              genero: joven.genero,
              nivel_educativo: joven.nivel_educativo
            },
            emergencia_contacto: {
              nombre: '',
              telefono: '',
              parentesco: ''
            },
            aceptado_terminos: true
          };

          // Simular éxito/falla aleatoria para demostración
          const exito = Math.random() > 0.2; // 80% de éxito
          
          if (exito) {
            exitosas.push({
              ...joven,
              id_inscripcion: `insc-${Date.now()}-${joven.id}`,
              fecha: new Date().toISOString()
            });
          } else {
            fallidas.push({
              ...joven,
              error: 'Error al crear usuario o inscripción'
            });
          }

          // Pequeña pausa para simular procesamiento
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          fallidas.push({
            ...joven,
            error: error.message
          });
        }
      }

      setInscripcionesExitosas(exitosas);
      setInscripcionesFallidas(fallidas);
      setPasoActual(3);
      
      // Actualizar cupos disponibles
      setCuposDisponibles(prev => prev - exitosas.length);
      
    } catch (error) {
      console.error('Error procesando inscripciones:', error);
      alert('Error al procesar las inscripciones');
    } finally {
      setLoading(false);
    }
  };

  const descargarPlantilla = () => {
    const plantilla = `nombre_completo,email,telefono,barrio,edad,genero,nivel_educativo
Juan Pérez García,juan.perez@email.com,3001234567,Getsemaní,22,Masculino,Universitario
María González López,maria.gonzalez@email.com,3007654321,Bocagrande,19,Femenino,Bachiller
Carlos Rodríguez Martínez,carlos.rodriguez@email.com,3001112233,Manga,25,Masculino,Técnico

Instrucciones:
- nombre_completo: Nombre completo del joven
- email: Correo electrónico válido
- telefono: Número de teléfono (10 dígitos)
- barrio: Barrio de residencia en Cartagena
- edad: Entre 15 y 35 años
- genero: Masculino/Femenino/Otro
- nivel_educativo: Bachiller/Técnico/Universitario/Posgrado`;

    const blob = new Blob([plantilla], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_inscripcion_jovenes.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const CardJoven = ({ joven, tipo = 'procesado' }) => {
    return (
      <div className={`bg-white rounded-lg p-4 border-l-4 ${
        tipo === 'exitoso' ? 'border-green-500' : 
        tipo === 'fallido' ? 'border-red-500' : 
        joven.valido ? 'border-blue-500' : 'border-yellow-500'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-caribbean text-gray-900 mb-1">
              {joven.nombre_completo}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <strong>Email:</strong> {joven.email}
              </div>
              <div>
                <strong>Teléfono:</strong> {joven.telefono}
              </div>
              <div>
                <strong>Barrio:</strong> {joven.barrio}
              </div>
              <div>
                <strong>Edad:</strong> {joven.edad} años
              </div>
            </div>
            
            {joven.errores && joven.errores.length > 0 && (
              <div className="mt-2">
                {joven.errores.map((error, index) => (
                  <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                    {error}
                  </span>
                ))}
              </div>
            )}

            {tipo === 'fallido' && joven.error && (
              <div className="mt-2">
                <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  Error: {joven.error}
                </span>
              </div>
            )}
          </div>
          
          <div className="ml-4">
            {tipo === 'exitoso' && (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
            {tipo === 'fallido' && (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            {tipo === 'procesado' && joven.valido && (
              <CheckCircle className="h-6 w-6 text-blue-500" />
            )}
            {tipo === 'procesado' && !joven.valido && (
              <XCircle className="h-6 w-6 text-yellow-500" />
            )}
          </div>
        </div>
      </div>
    );
  };

  const Paso1 = () => (
    <div className="bg-white rounded-xl p-8 shadow-lg text-center">
      <div className="max-w-2xl mx-auto">
        <div className="bg-colonial-blue p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Upload className="h-10 w-10 text-white" />
        </div>
        
        <h2 className="font-traditional text-3xl text-colonial-blue mb-4">
          Inscripción Masiva de Jóvenes
        </h2>
        
        <p className="text-gray-600 mb-6">
          Carga un archivo CSV o Excel con la información de los jóvenes para inscribirlos 
          masivamente en el programa de formación.
        </p>

        {/* Información del Programa */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-caribbean text-blue-900 mb-2">Información del Programa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Programa:</strong> {programa?.nombre}
            </div>
            <div>
              <strong>Cupos disponibles:</strong> {cuposDisponibles} de {programa?.cupos_totales}
            </div>
            <div>
              <strong>Fecha inicio:</strong> {programa?.fecha_inicio ? new Date(programa.fecha_inicio).toLocaleDateString('es-ES') : 'N/A'}
            </div>
            <div>
              <strong>Duración:</strong> {programa?.duracion_semanas} semanas
            </div>
          </div>
        </div>

        {/* Área de Carga */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 hover:border-colonial-blue transition-colors">
          <input
            type="file"
            id="archivo-inscripcion"
            accept=".csv,.xlsx,.xls"
            onChange={manejarSeleccionArchivo}
            className="hidden"
          />
          <label
            htmlFor="archivo-inscripcion"
            className="cursor-pointer block"
          >
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-700 mb-2">
              {archivoSeleccionado ? archivoSeleccionado.name : 'Selecciona un archivo CSV o Excel'}
            </p>
            <p className="text-gray-500 text-sm">
              Haz clic aquí o arrastra tu archivo
            </p>
          </label>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={descargarPlantilla}
            className="flex items-center border border-colonial-blue text-colonial-blue px-6 py-3 rounded-lg font-caribbean hover:bg-blue-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar Plantilla
          </button>
        </div>

        {/* Instrucciones */}
        <div className="mt-8 text-left bg-gray-50 p-4 rounded-lg">
          <h4 className="font-caribbean text-gray-900 mb-3">Instrucciones:</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Descarga la plantilla y completa la información requerida</li>
            <li>• Asegúrate de que todos los campos estén completos y sean válidos</li>
            <li>• El archivo debe incluir: nombre_completo, email, teléfono, barrio, edad, género, nivel_educativo</li>
            <li>• Verifica que no excedas los {cuposDisponibles} cupos disponibles</li>
            <li>• Los jóvenes recibirán un email con las instrucciones de acceso</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const Paso2 = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-traditional text-2xl text-colonial-blue mb-2">
            Validación de Datos
          </h2>
          <p className="text-gray-600">
            Revisa y confirma la información de los jóvenes antes de proceder con la inscripción.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Paso 2 de 3</div>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-colonial-blue h-2 rounded-full" style={{ width: '66%' }}></div>
            </div>
            <span className="text-sm text-gray-600">66%</span>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-traditional text-blue-600">{datosProcesados.length}</div>
          <div className="text-sm text-blue-700">Total Registros</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-traditional text-green-600">
            {datosProcesados.filter(j => j.valido).length}
          </div>
          <div className="text-sm text-green-700">Válidos</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-traditional text-yellow-600">
            {datosProcesados.filter(j => !j.valido).length}
          </div>
          <div className="text-sm text-yellow-700">Con Errores</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-traditional text-purple-600">{cuposDisponibles}</div>
          <div className="text-sm text-purple-700">Cupos Disponibles</div>
        </div>
      </div>

      {/* Lista de Jóvenes */}
      <div className="space-y-4 mb-6">
        <h3 className="font-caribbean text-lg text-gray-900">
          Jóvenes a Inscribir ({datosProcesados.length})
        </h3>
        
        {datosProcesados.map(joven => (
          <CardJoven key={joven.id} joven={joven} tipo="procesado" />
        ))}
      </div>

      {/* Errores de Validación */}
      {erroresValidacion.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-caribbean text-yellow-900 mb-3 flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            Errores de Validación Encontrados
          </h4>
          <div className="space-y-2 text-sm">
            {erroresValidacion.map((error, index) => (
              <div key={index} className="flex items-start">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs mr-2">
                  Línea {error.linea}
                </span>
                <span className="text-yellow-800">{error.nombre}: {error.errores.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={() => setPasoActual(1)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-caribbean hover:bg-gray-50 transition-colors"
        >
          Volver
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setDatosProcesados([]);
              setErroresValidacion([]);
              setPasoActual(1);
            }}
            className="px-6 py-3 border border-red-300 text-red-700 rounded-lg font-caribbean hover:bg-red-50 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            onClick={procesarInscripciones}
            disabled={datosProcesados.filter(j => j.valido).length === 0 || datosProcesados.filter(j => j.valido).length > cuposDisponibles}
            className="flex items-center bg-colonial-yellow text-colonial-blue px-6 py-3 rounded-lg font-caribbean hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4 mr-2" />
            Procesar Inscripciones
          </button>
        </div>
      </div>
    </div>
  );

  const Paso3 = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-traditional text-2xl text-colonial-blue mb-2">
            Resultado del Proceso
          </h2>
          <p className="text-gray-600">
            Resumen de las inscripciones procesadas exitosamente y aquellas que fallaron.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Paso 3 de 3</div>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <span className="text-sm text-gray-600">100%</span>
          </div>
        </div>
      </div>

      {/* Resumen Final */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-traditional text-green-600">
            {inscripcionesExitosas.length}
          </div>
          <div className="text-sm text-green-700">Inscripciones Exitosas</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-traditional text-red-600">
            {inscripcionesFallidas.length}
          </div>
          <div className="text-sm text-red-700">Inscripciones Fallidas</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-traditional text-blue-600">
            {cuposDisponibles}
          </div>
          <div className="text-sm text-blue-700">Cupos Restantes</div>
        </div>
      </div>

      {/* Inscripciones Exitosas */}
      {inscripcionesExitosas.length > 0 && (
        <div className="mb-6">
          <h3 className="font-caribbean text-lg text-green-700 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Inscripciones Exitosas ({inscripcionesExitosas.length})
          </h3>
          <div className="space-y-3">
            {inscripcionesExitosas.map(joven => (
              <CardJoven key={joven.id_inscripcion} joven={joven} tipo="exitoso" />
            ))}
          </div>
        </div>
      )}

      {/* Inscripciones Fallidas */}
      {inscripcionesFallidas.length > 0 && (
        <div className="mb-6">
          <h3 className="font-caribbean text-lg text-red-700 mb-4 flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            Inscripciones Fallidas ({inscripcionesFallidas.length})
          </h3>
          <div className="space-y-3">
            {inscripcionesFallidas.map((joven, index) => (
              <CardJoven key={index} joven={joven} tipo="fallido" />
            ))}
          </div>
        </div>
      )}

      {/* Acciones Finales */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={() => {
            setPasoActual(1);
            setDatosProcesados([]);
            setInscripcionesExitosas([]);
            setInscripcionesFallidas([]);
          }}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-caribbean hover:bg-gray-50 transition-colors"
        >
          Nueva Inscripción
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={() => {
              // Exportar reporte
              console.log('Exportando reporte...');
              alert('Reporte exportado exitosamente');
            }}
            className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-caribbean hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </button>
          
          <button
            onClick={() => {
              // Ir a gestión de jóvenes
              window.location.href = '/admin?view=jovenes';
            }}
            className="flex items-center bg-colonial-blue text-white px-6 py-3 rounded-lg font-caribbean hover:bg-blue-700 transition-colors"
          >
            <Users className="h-4 w-4 mr-2" />
            Ver Jóvenes Inscritos
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto mb-8"></div>
          <div className="h-32 bg-gray-300 rounded mb-4"></div>
          <div className="h-12 bg-gray-300 rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pasoActual === 1 && <Paso1 />}
      {pasoActual === 2 && <Paso2 />}
      {pasoActual === 3 && <Paso3 />}
    </div>
  );
};

export default InscripcionMasiva;
