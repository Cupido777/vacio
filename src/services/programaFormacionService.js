import { supabase } from './supabaseClient';

const cache = new Map();
const CACHE_DURATION = {
  SHORT: 2 * 60 * 1000,    // 2 minutos - datos volátiles
  MEDIUM: 10 * 60 * 1000,  // 10 minutos - datos semi-estáticos  
  LONG: 30 * 60 * 1000     // 30 minutos - datos estáticos
};

// Sistema de cache mejorado
const withCache = (key, fn, duration = CACHE_DURATION.MEDIUM, invalidatePatterns = []) => {
  const now = Date.now();
  const cached = cache.get(key);
  
  if (cached && (now - cached.timestamp) < duration) {
    return Promise.resolve(cached.data);
  }
  
  return fn().then(data => {
    cache.set(key, { 
      data, 
      timestamp: now,
      invalidatePatterns 
    });
    return data;
  }).catch(error => {
    // Fallback a cache existente en caso de error
    if (cached) {
      console.warn(`⚠️ Usando cache por error en: ${key}`);
      return cached.data;
    }
    throw error;
  });
};

// Invalidación inteligente de cache
const invalidateRelatedCache = (patterns) => {
  patterns.forEach(pattern => {
    cache.forEach((value, key) => {
      if (value.invalidatePatterns.includes(pattern) || key.includes(pattern)) {
        cache.delete(key);
      }
    });
  });
};

export const programaFormacionService = {
  // ===== PROGRAMAS DE FORMACIÓN =====
  async getProgramasActivos() {
    const cacheKey = 'programas_activos';
    return withCache(cacheKey, async () => {
      try {
        console.log('📡 Fetching programas activos...');
        const { data, error } = await supabase
          .from('programas_formacion')
          .select('*')
          .eq('estado', 'activo')
          .order('fecha_inicio', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('❌ Error getting programas activos:', error);
        throw new Error('No se pudieron cargar los programas activos');
      }
    }, CACHE_DURATION.MEDIUM, ['programa']);
  },

  async getProgramaById(programaId) {
    const cacheKey = `programa_${programaId}`;
    return withCache(cacheKey, async () => {
      try {
        console.log(`📡 Fetching programa ${programaId}...`);
        const { data, error } = await supabase
          .from('programas_formacion')
          .select(`
            *,
            modulos:modulos_pedagogicos(*),
            talleres:talleres_presenciales(*),
            inscripciones:inscripciones_jovenes(count)
          `)
          .eq('id', programaId)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`❌ Error getting programa ${programaId}:`, error);
        throw new Error('No se pudo cargar la información del programa');
      }
    }, CACHE_DURATION.MEDIUM, ['programa', `programa_${programaId}`]);
  },

  // ===== INSCRIPCIONES DE JÓVENES =====
  async inscribirJoven(programaId, userId, datosJoven) {
    try {
      console.log(`📝 Inscribiendo joven ${userId} en programa ${programaId}...`);
      const { data, error } = await supabase
        .from('inscripciones_jovenes')
        .insert([{
          programa_id: programaId,
          user_id: userId,
          datos_contacto: datosJoven.datosContacto,
          emergencia_contacto: datosJoven.emergenciaContacto,
          necesidades_especiales: datosJoven.necesidadesEspeciales,
          aceptado_terminos: true
        }])
        .select(`
          *,
          programa:programas_formacion(*)
        `)
        .single();

      if (error) throw error;

      // Invalidar cache relacionado
      invalidateRelatedCache(['inscripciones', 'programa', 'estadisticas']);
      return data;
    } catch (error) {
      console.error('❌ Error inscribiendo joven:', error);
      throw new Error(error.message || 'No se pudo completar la inscripción');
    }
  },

  async getInscripcionesByPrograma(programaId) {
    const cacheKey = `inscripciones_${programaId}`;
    return withCache(cacheKey, async () => {
      try {
        console.log(`📡 Fetching inscripciones para programa ${programaId}...`);
        const { data, error } = await supabase
          .from('inscripciones_jovenes')
          .select(`
            *,
            user:user_id(
              id,
              email,
              user_metadata
            )
          `)
          .eq('programa_id', programaId)
          .order('fecha_inscripcion', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error(`❌ Error getting inscripciones para programa ${programaId}:`, error);
        throw new Error('No se pudieron cargar las inscripciones');
      }
    }, CACHE_DURATION.SHORT, ['inscripciones']);
  },

  async getInscripcionByUser(programaId, userId) {
    try {
      const { data, error } = await supabase
        .from('inscripciones_jovenes')
        .select('*')
        .eq('programa_id', programaId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('❌ Error getting inscripcion user:', error);
      throw new Error('No se pudo verificar la inscripción');
    }
  },

  // ===== MÓDULOS PEDAGÓGICOS =====
  async getModulosByPrograma(programaId) {
    const cacheKey = `modulos_${programaId}`;
    return withCache(cacheKey, async () => {
      try {
        console.log(`📡 Fetching módulos para programa ${programaId}...`);
        const { data, error } = await supabase
          .from('modulos_pedagogicos')
          .select('*')
          .eq('programa_id', programaId)
          .order('orden', { ascending: true });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error(`❌ Error getting modulos para programa ${programaId}:`, error);
        throw new Error('No se pudieron cargar los módulos');
      }
    }, CACHE_DURATION.MEDIUM, ['modulos']);
  },

  async getModuloById(moduloId) {
    const cacheKey = `modulo_${moduloId}`;
    return withCache(cacheKey, async () => {
      try {
        console.log(`📡 Fetching módulo ${moduloId}...`);
        const { data, error } = await supabase
          .from('modulos_pedagogicos')
          .select('*')
          .eq('id', moduloId)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`❌ Error getting modulo ${moduloId}:`, error);
        throw new Error('No se pudo cargar la información del módulo');
      }
    }, CACHE_DURATION.MEDIUM, ['modulo']);
  },

  // ===== PROGRESO DE MÓDULOS =====
  async getProgresoModulo(jovenId, moduloId) {
    try {
      const { data, error } = await supabase
        .from('progreso_modulos')
        .select('*')
        .eq('joven_id', jovenId)
        .eq('modulo_id', moduloId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || {
        joven_id: jovenId,
        modulo_id: moduloId,
        progreso_percent: 0,
        completado: false,
        actividades_completadas: [],
        evaluacion_final: {
          puntuacion: null,
          comentarios: "",
          fecha_evaluacion: null
        }
      };
    } catch (error) {
      console.error(`❌ Error getting progreso modulo ${moduloId} para joven ${jovenId}:`, error);
      throw new Error('No se pudo cargar el progreso del módulo');
    }
  },

  async updateProgresoModulo(jovenId, moduloId, progresoData) {
    try {
      const { data, error } = await supabase
        .from('progreso_modulos')
        .upsert({
          joven_id: jovenId,
          modulo_id: moduloId,
          ...progresoData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      invalidateRelatedCache([`progreso_joven_${jovenId}`, 'estadisticas']);
      return data;
    } catch (error) {
      console.error(`❌ Error updating progreso modulo ${moduloId}:`, error);
      throw new Error('No se pudo actualizar el progreso');
    }
  },

  async marcarActividadCompletada(jovenId, moduloId, actividadId) {
    try {
      const [progresoActual, modulo] = await Promise.all([
        this.getProgresoModulo(jovenId, moduloId),
        this.getModuloById(moduloId)
      ]);
      
      const actividadesCompletadas = [
        ...(progresoActual.actividades_completadas || []),
        actividadId
      ];

      const actividadesUnicas = [...new Set(actividadesCompletadas)];
      const totalActividades = modulo.recursos?.actividades?.length || 1;
      const progresoPercent = Math.round((actividadesUnicas.length / totalActividades) * 100);
      const completado = progresoPercent >= 100;

      return await this.updateProgresoModulo(jovenId, moduloId, {
        actividades_completadas: actividadesUnicas,
        progreso_percent: progresoPercent,
        completado: completado,
        fecha_completado: completado ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error('❌ Error marcando actividad completada:', error);
      throw new Error('No se pudo marcar la actividad como completada');
    }
  },

  // ===== TALLERES PRESENCIALES =====
  async getTalleresByPrograma(programaId) {
    const cacheKey = `talleres_${programaId}`;
    return withCache(cacheKey, async () => {
      try {
        console.log(`📡 Fetching talleres para programa ${programaId}...`);
        const { data, error } = await supabase
          .from('talleres_presenciales')
          .select('*')
          .eq('programa_id', programaId)
          .order('fecha_taller', { ascending: true });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error(`❌ Error getting talleres para programa ${programaId}:`, error);
        throw new Error('No se pudieron cargar los talleres');
      }
    }, CACHE_DURATION.SHORT, ['talleres']);
  },

  async registrarAsistenciaQR(tallerId, jovenId, qrCode) {
    try {
      // Verificar que el QR sea válido
      const { data: taller, error: tallerError } = await supabase
        .from('talleres_presenciales')
        .select('qr_code, fecha_taller')
        .eq('id', tallerId)
        .single();

      if (tallerError) throw tallerError;

      if (taller.qr_code !== qrCode) {
        throw new Error('Código QR inválido');
      }

      // Verificar que el taller no haya pasado
      const ahora = new Date();
      const fechaTaller = new Date(taller.fecha_taller);
      if (ahora > fechaTaller) {
        throw new Error('El taller ya ha finalizado');
      }

      // Registrar asistencia
      const { data, error } = await supabase
        .from('asistencia_talleres')
        .upsert({
          taller_id: tallerId,
          joven_id: jovenId,
          asistio: true,
          hora_registro: new Date().toISOString(),
          metodo_registro: 'qr'
        })
        .select()
        .single();

      if (error) throw error;
      
      invalidateRelatedCache(['asistencia', 'estadisticas']);
      return data;
    } catch (error) {
      console.error('❌ Error registrando asistencia QR:', error);
      throw new Error(error.message || 'No se pudo registrar la asistencia');
    }
  },

  async getAsistenciaJoven(jovenId, programaId) {
    try {
      const { data, error } = await supabase
        .from('asistencia_talleres')
        .select(`
          *,
          taller:talleres_presenciales(*)
        `)
        .eq('joven_id', jovenId)
        .eq('taller.programa_id', programaId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`❌ Error getting asistencia para joven ${jovenId}:`, error);
      throw new Error('No se pudieron cargar los datos de asistencia');
    }
  },

  // ===== PROYECTOS FINALES =====
  async crearProyectoFinal(jovenId, programaId, proyectoData) {
    try {
      const { data, error } = await supabase
        .from('proyectos_finales')
        .insert([{
          joven_id: jovenId,
          programa_id: programaId,
          titulo: proyectoData.titulo,
          descripcion: proyectoData.descripcion,
          categoria: proyectoData.categoria,
          herramientas_utilizadas: proyectoData.herramientasUtilizadas,
          archivos_adjuntos: proyectoData.archivosAdjuntos || []
        }])
        .select()
        .single();

      if (error) throw error;
      
      invalidateRelatedCache(['proyectos', 'estadisticas']);
      return data;
    } catch (error) {
      console.error('❌ Error creando proyecto final:', error);
      throw new Error('No se pudo crear el proyecto final');
    }
  },

  async getProyectosByJoven(jovenId) {
    try {
      const { data, error } = await supabase
        .from('proyectos_finales')
        .select('*')
        .eq('joven_id', jovenId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`❌ Error getting proyectos para joven ${jovenId}:`, error);
      throw new Error('No se pudieron cargar los proyectos');
    }
  },

  // ===== CERTIFICACIONES =====
  async generarCertificado(jovenId, programaId) {
    try {
      const [progresoModulos, proyectoFinal] = await Promise.all([
        this.getProgresoGeneralJoven(jovenId, programaId),
        this.getProyectosByJoven(jovenId)
      ]);

      if (progresoModulos.progresoGeneral < 100) {
        throw new Error('El joven no ha completado todos los módulos');
      }

      if (!proyectoFinal.length) {
        throw new Error('El joven no tiene proyecto final entregado');
      }

      const codigoCertificado = `CERT-${programaId.slice(0, 8)}-${jovenId.slice(0, 8)}-${Date.now()}`;

      const { data, error } = await supabase
        .from('certificaciones_jovenes')
        .insert([{
          joven_id: jovenId,
          programa_id: programaId,
          codigo_certificado: codigoCertificado,
          proyecto_final_id: proyectoFinal[0].id,
          habilidades_adquiridas: progresoModulos.habilidadesAdquiridas
        }])
        .select(`
          *,
          programa:programas_formacion(*),
          joven:inscripciones_jovenes(
            user:user_id(
              user_metadata
            )
          )
        `)
        .single();

      if (error) throw error;
      
      invalidateRelatedCache(['certificaciones', 'estadisticas']);
      return data;
    } catch (error) {
      console.error('❌ Error generando certificado:', error);
      throw new Error(error.message || 'No se pudo generar el certificado');
    }
  },

  async getCertificadoByJoven(jovenId, programaId) {
    try {
      const { data, error } = await supabase
        .from('certificaciones_jovenes')
        .select(`
          *,
          programa:programas_formacion(*)
        `)
        .eq('joven_id', jovenId)
        .eq('programa_id', programaId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error(`❌ Error getting certificado para joven ${jovenId}:`, error);
      throw new Error('No se pudo cargar la información del certificado');
    }
  },

  // ===== ESTADÍSTICAS Y REPORTES =====
  async getEstadisticasPrograma(programaId) {
    try {
      const [
        { data: inscripciones },
        { data: progresoModulos },
        { data: asistencias },
        { data: certificados }
      ] = await Promise.all([
        supabase
          .from('inscripciones_jovenes')
          .select('id, estado_inscripcion')
          .eq('programa_id', programaId),
        supabase
          .from('progreso_modulos')
          .select('progreso_percent, completado')
          .eq('modulo_id', supabase.from('modulos_pedagogicos').select('id').eq('programa_id', programaId)),
        supabase
          .from('asistencia_talleres')
          .select('asistio')
          .eq('taller_id', supabase.from('talleres_presenciales').select('id').eq('programa_id', programaId)),
        supabase
          .from('certificaciones_jovenes')
          .select('id')
          .eq('programa_id', programaId)
      ]);

      const totalInscritos = inscripciones?.length || 0;
      const activos = inscripciones?.filter(i => i.estado_inscripcion === 'activo').length || 0;
      const promedioProgreso = progresoModulos?.length ? 
        progresoModulos.reduce((sum, p) => sum + p.progreso_percent, 0) / progresoModulos.length : 0;
      const tasaAsistencia = asistencias?.length ? 
        (asistencias.filter(a => a.asistio).length / asistencias.length) * 100 : 0;
      const certificadosEmitidos = certificados?.length || 0;

      return {
        totalInscritos,
        activos,
        promedioProgreso: Math.round(promedioProgreso),
        tasaAsistencia: Math.round(tasaAsistencia),
        certificadosEmitidos,
        completados: progresoModulos?.filter(p => p.completado).length || 0
      };
    } catch (error) {
      console.error(`❌ Error getting estadisticas para programa ${programaId}:`, error);
      throw new Error('No se pudieron cargar las estadísticas');
    }
  },

  async getProgresoGeneralJoven(jovenId, programaId) {
    try {
      const [progresoModulos, asistencias, proyecto] = await Promise.all([
        supabase
          .from('progreso_modulos')
          .select('progreso_percent, completado, modulo_id')
          .eq('joven_id', jovenId)
          .eq('modulo_id', supabase.from('modulos_pedagogicos').select('id').eq('programa_id', programaId)),
        this.getAsistenciaJoven(jovenId, programaId),
        this.getProyectosByJoven(jovenId)
      ]);

      const modulosCompletados = progresoModulos.data?.filter(m => m.completado).length || 0;
      const totalModulos = progresoModulos.data?.length || 1;
      const progresoModulosPercent = Math.round((modulosCompletados / totalModulos) * 100);

      const talleresAsistidos = asistencias.filter(a => a.asistio).length;
      const totalTalleres = asistencias.length || 1;
      const progresoAsistencia = Math.round((talleresAsistidos / totalTalleres) * 100);

      const tieneProyecto = proyecto.length > 0;

      const progresoGeneral = Math.round(
        (progresoModulosPercent * 0.6) + 
        (progresoAsistencia * 0.3) + 
        (tieneProyecto ? 10 : 0)
      );

      return {
        progresoGeneral,
        progresoModulos: progresoModulosPercent,
        progresoAsistencia,
        modulosCompletados,
        totalModulos,
        talleresAsistidos,
        totalTalleres,
        tieneProyecto,
        habilidadesAdquiridas: this.generarHabilidadesAdquiridas(progresoModulos.data || [])
      };
    } catch (error) {
      console.error(`❌ Error getting progreso general para joven ${jovenId}:`, error);
      throw new Error('No se pudo cargar el progreso general');
    }
  },

  // ===== UTILIDADES MEJORADAS =====
  generarHabilidadesAdquiridas(progresoModulos) {
    const habilidades = [];
    const modulosCompletados = progresoModulos.filter(m => m.completado);

    if (modulosCompletados.length > 0) {
      habilidades.push('Gestión de proyectos culturales');
    }
    if (modulosCompletados.length > 1) {
      habilidades.push('Producción de contenido digital');
      habilidades.push('Herramientas de edición multimedia');
    }
    if (modulosCompletados.length > 2) {
      habilidades.push('Preservación del patrimonio cultural');
      habilidades.push('Emprendimiento creativo');
    }

    return habilidades;
  },

  // Precarga datos esenciales para mejor UX
  preloadEssentialData(programaId) {
    const preloads = [
      this.getProgramaById(programaId),
      this.getInscripcionesByPrograma(programaId),
      this.getModulosByPrograma(programaId)
    ];
    return Promise.allSettled(preloads);
  },

  // Limpiar cache específico de usuario
  clearUserCache(userId) {
    invalidateRelatedCache([`progreso_joven_${userId}`, `inscripcion_${userId}`]);
  },

  // Estadísticas del cache (debugging)
  getCacheStats() {
    const now = Date.now();
    let valid = 0, expired = 0;
    
    cache.forEach((value) => {
      if (now - value.timestamp < CACHE_DURATION.MEDIUM) valid++;
      else expired++;
    });
    
    return {
      total: cache.size,
      valid,
      expired,
      hitRate: valid / cache.size
    };
  },

  cleanupCache() {
    const previousSize = cache.size;
    cache.clear();
    console.log(`🧹 Cache limpiado: ${previousSize} entradas eliminadas`);
  }
};
