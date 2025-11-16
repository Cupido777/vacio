import { supabase } from './supabase';

// Cache simple para optimizar requests repetidos
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Helper para manejar cache
const withCache = (key, fn, duration = CACHE_DURATION) => {
  const now = Date.now();
  const cached = cache.get(key);
  
  if (cached && (now - cached.timestamp) < duration) {
    return Promise.resolve(cached.data);
  }
  
  return fn().then(data => {
    cache.set(key, { data, timestamp: now });
    return data;
  });
};

// Helper para limpiar cache específico
const invalidateCache = (pattern) => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

export const patrimonialService = {
  // ===== OPERACIONES BÁSICAS DE AUDIO =====
  
  async uploadAudio(file, metadata) {
    try {
      // Validaciones del archivo
      if (!file || !(file instanceof File)) {
        throw new Error('Archivo inválido');
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB límite
        throw new Error('El archivo es demasiado grande (máximo 50MB)');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `patrimonial_audios/${fileName}`;

      // Subir archivo a storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('patrimonial_audios')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Preparar metadatos completos
      const completeMetadata = {
        ...metadata,
        audio_url: uploadData.path,
        file_size: file.size,
        file_type: file.type,
        duration: metadata.duration || null,
        audio_quality: metadata.audio_quality || 'standard',
        status: 'pending_review',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Guardar metadatos en base de datos
      const { data, error } = await supabase
        .from('patrimonial_audios')
        .insert([completeMetadata])
        .select()
        .single();

      if (error) throw error;

      // Invalidar cache relacionado
      invalidateCache('heritages');
      invalidateCache('audios');

      return { 
        data: { 
          ...data, 
          public_url: supabase.storage.from('patrimonial_audios').getPublicUrl(uploadData.path).data.publicUrl 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error en uploadAudio:', error);
      return { data: null, error };
    }
  },

  async getAudios(filters = {}) {
    const cacheKey = `audios_${JSON.stringify(filters)}`;
    
    return withCache(cacheKey, async () => {
      try {
        let query = supabase
          .from('patrimonial_audios')
          .select('*')
          .order('created_at', { ascending: false });

        // Aplicar filtros
        if (filters.cultural_manifestation) {
          query = query.eq('cultural_manifestation', filters.cultural_manifestation);
        }
        
        if (filters.neighborhood) {
          query = query.eq('neighborhood', filters.neighborhood);
        }

        if (filters.status) {
          query = query.eq('status', filters.status);
        }

        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,author.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Enriquecer datos con URLs públicas
        const enrichedData = data.map(audio => ({
          ...audio,
          public_url: supabase.storage.from('patrimonial_audios').getPublicUrl(audio.audio_url).data.publicUrl,
          file_size_mb: audio.file_size ? (audio.file_size / (1024 * 1024)).toFixed(2) : null
        }));

        return { data: enrichedData, error: null };
      } catch (error) {
        console.error('Error en getAudios:', error);
        return { data: null, error };
      }
    });
  },

  // ===== OPERACIONES DE PATRIMONIO CULTURAL =====

  async createHeritage(heritageData) {
    try {
      const completeData = {
        ...heritageData,
        status: heritageData.status || 'active',
        recognition_level: heritageData.recognition_level || 'local',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('cultural_heritages')
        .insert([completeData])
        .select()
        .single();

      if (error) throw error;

      // Invalidar cache
      invalidateCache('heritages');

      return { data, error: null };
    } catch (error) {
      console.error('Error en createHeritage:', error);
      return { data: null, error };
    }
  },

  async getHeritages(filters = {}) {
    const cacheKey = `heritages_${JSON.stringify(filters)}`;
    
    return withCache(cacheKey, async () => {
      try {
        let query = supabase
          .from('cultural_heritages')
          .select(`
            *,
            patrimonial_audios(count),
            heritage_images(count)
          `)
          .order('created_at', { ascending: false });

        // Aplicar filtros avanzados
        if (filters.heritage_type) {
          query = query.eq('heritage_type', filters.heritage_type);
        }
        
        if (filters.neighborhood) {
          query = query.eq('neighborhood', filters.neighborhood);
        }

        if (filters.status) {
          query = query.eq('status', filters.status);
        }

        if (filters.recognition_level) {
          query = query.eq('recognition_level', filters.recognition_level);
        }

        if (filters.time_period) {
          query = query.eq('time_period', filters.time_period);
        }

        if (filters.century) {
          query = query.eq('century', filters.century);
        }

        if (filters.search) {
          query = query.or(`
            title.ilike.%${filters.search}%,
            description.ilike.%${filters.search}%,
            cultural_manifestation.ilike.%${filters.search}%,
            neighborhood.ilike.%${filters.search}%
          `);
        }

        // Filtros geoespaciales (para mapa)
        if (filters.include_coordinates) {
          query = query.not('latitude', 'is', null).not('longitude', 'is', null);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Enriquecer datos para timeline y mapa
        const enrichedData = data.map(heritage => ({
          ...heritage,
          audio_count: heritage.patrimonial_audios?.[0]?.count || 0,
          photo_count: heritage.heritage_images?.[0]?.count || 0,
          video_count: heritage.video_count || 0,
          practitioners_count: heritage.practitioners_count || 0,
          // Datos calculados para visualizaciones
          timeline_data: {
            period: heritage.time_period,
            century: heritage.century,
            origin_year: heritage.origin_year
          },
          map_data: {
            coordinates: heritage.latitude && heritage.longitude 
              ? { lat: heritage.latitude, lng: heritage.longitude }
              : null,
            neighborhood: heritage.neighborhood
          }
        }));

        return { data: enrichedData, error: null };
      } catch (error) {
        console.error('Error en getHeritages:', error);
        return { data: null, error };
      }
    });
  },

  async getHeritageById(heritageId) {
    const cacheKey = `heritage_${heritageId}`;
    
    return withCache(cacheKey, async () => {
      try {
        const { data, error } = await supabase
          .from('cultural_heritages')
          .select(`
            *,
            patrimonial_audios(*),
            heritage_images(*),
            heritage_documents(*)
          `)
          .eq('id', heritageId)
          .single();

        if (error) throw error;

        // Enriquecer con URLs públicas
        const enrichedData = {
          ...data,
          audios: data.patrimonial_audios?.map(audio => ({
            ...audio,
            public_url: supabase.storage.from('patrimonial_audios').getPublicUrl(audio.audio_url).data.publicUrl
          })) || [],
          images: data.heritage_images?.map(image => ({
            ...image,
            public_url: supabase.storage.from('heritage_images').getPublicUrl(image.image_url).data.publicUrl
          })) || [],
          documents: data.heritage_documents?.map(doc => ({
            ...doc,
            public_url: supabase.storage.from('heritage_documents').getPublicUrl(doc.document_url).data.publicUrl
          })) || []
        };

        return { data: enrichedData, error: null };
      } catch (error) {
        console.error('Error en getHeritageById:', error);
        return { data: null, error };
      }
    });
  },

  async updateHeritage(heritageId, updates) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('cultural_heritages')
        .update(updateData)
        .eq('id', heritageId)
        .select()
        .single();

      if (error) throw error;

      // Invalidar cache relacionado
      invalidateCache('heritages');
      invalidateCache(`heritage_${heritageId}`);

      return { data, error: null };
    } catch (error) {
      console.error('Error en updateHeritage:', error);
      return { data: null, error };
    }
  },

  // ===== ESTADÍSTICAS Y ANALÍTICAS =====

  async getHeritageStats() {
    const cacheKey = 'heritage_stats';
    
    return withCache(cacheKey, async () => {
      try {
        // Obtener conteos por tipo
        const { data: typeCounts, error: typeError } = await supabase
          .from('cultural_heritages')
          .select('heritage_type')
          .eq('status', 'active');

        if (typeError) throw typeError;

        // Obtener conteos por barrio
        const { data: neighborhoodCounts, error: neighborhoodError } = await supabase
          .from('cultural_heritages')
          .select('neighborhood')
          .eq('status', 'active');

        if (neighborhoodError) throw neighborhoodError;

        // Obtener total de audios
        const { count: audioCount, error: audioError } = await supabase
          .from('patrimonial_audios')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        if (audioError) throw audioError;

        // Procesar estadísticas
        const stats = {
          total_heritages: typeCounts?.length || 0,
          by_type: typeCounts?.reduce((acc, item) => {
            acc[item.heritage_type] = (acc[item.heritage_type] || 0) + 1;
            return acc;
          }, {}) || {},
          by_neighborhood: neighborhoodCounts?.reduce((acc, item) => {
            if (item.neighborhood) {
              acc[item.neighborhood] = (acc[item.neighborhood] || 0) + 1;
            }
            return acc;
          }, {}) || {},
          total_audios: audioCount || 0,
          endangered_count: typeCounts?.filter(item => item.status === 'endangered').length || 0,
          timestamp: new Date().toISOString()
        };

        return { data: stats, error: null };
      } catch (error) {
        console.error('Error en getHeritageStats:', error);
        return { data: null, error };
      }
    }, 2 * 60 * 1000); // 2 minutos para estadísticas
  },

  async getTimelineData() {
    const cacheKey = 'timeline_data';
    
    return withCache(cacheKey, async () => {
      try {
        const { data, error } = await supabase
          .from('cultural_heritages')
          .select('id, title, heritage_type, origin_year, time_period, century, neighborhood')
          .not('origin_year', 'is', null)
          .order('origin_year', { ascending: true });

        if (error) throw error;

        // Agrupar por períodos históricos
        const timelineData = {
          periods: {
            preColombian: data.filter(item => (item.origin_year || 0) < 1500),
            colonial: data.filter(item => (item.origin_year || 0) >= 1500 && (item.origin_year || 0) < 1810),
            independence: data.filter(item => (item.origin_year || 0) >= 1810 && (item.origin_year || 0) < 1821),
            republic: data.filter(item => (item.origin_year || 0) >= 1821 && (item.origin_year || 0) < 1900),
            modern: data.filter(item => (item.origin_year || 0) >= 1900 && (item.origin_year || 0) < 2000),
            contemporary: data.filter(item => (item.origin_year || 0) >= 2000)
          },
          centuries: data.reduce((acc, item) => {
            const century = Math.floor((item.origin_year || 1900) / 100) * 100;
            const centuryKey = `s${century.toString().slice(-2)}`;
            
            if (!acc[centuryKey]) {
              acc[centuryKey] = [];
            }
            acc[centuryKey].push(item);
            return acc;
          }, {}),
          timeRange: {
            min: Math.min(...data.map(item => item.origin_year || 1900).filter(Boolean)),
            max: Math.max(...data.map(item => item.origin_year || new Date().getFullYear()).filter(Boolean))
          }
        };

        return { data: timelineData, error: null };
      } catch (error) {
        console.error('Error en getTimelineData:', error);
        return { data: null, error };
      }
    });
  },

  // ===== OPERACIONES DE BÚSQUEDA AVANZADA =====

  async searchHeritage(query, filters = {}) {
    try {
      let searchQuery = supabase
        .from('cultural_heritages')
        .select('*')
        .textSearch('search_vector', query, {
          type: 'websearch',
          config: 'spanish'
        });

      // Aplicar filtros adicionales
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          searchQuery = searchQuery.eq(key, filters[key]);
        }
      });

      const { data, error } = await searchQuery.limit(50);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error en searchHeritage:', error);
      return { data: null, error };
    }
  },

  // ===== OPERACIONES GEOESPACIALES =====

  async getHeritageByLocation(lat, lng, radiusKm = 10) {
    try {
      // Nota: Esto requiere la extensión PostGIS en Supabase
      const { data, error } = await supabase
        .rpc('heritages_near_location', {
          p_lat: lat,
          p_lng: lng,
          p_radius: radiusKm
        });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error en getHeritageByLocation:', error);
      // Fallback a filtro por barrio si no hay PostGIS
      return this.getHeritages({ include_coordinates: true });
    }
  },

  // ===== GESTIÓN DE MULTIMEDIA =====

  async uploadHeritageImage(heritageId, file, metadata = {}) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${heritageId}_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `heritage_images/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('heritage_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('heritage_images')
        .insert([{
          heritage_id: heritageId,
          image_url: uploadData.path,
          ...metadata,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Invalidar cache
      invalidateCache(`heritage_${heritageId}`);

      return { 
        data: {
          ...data,
          public_url: supabase.storage.from('heritage_images').getPublicUrl(uploadData.path).data.publicUrl
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error en uploadHeritageImage:', error);
      return { data: null, error };
    }
  },

  // ===== UTILIDADES Y MANTENIMIENTO =====

  async cleanupCache() {
    cache.clear();
    return { data: { message: 'Cache limpiado exitosamente' }, error: null };
  },

  async getServiceStatus() {
    try {
      // Verificar conexión a base de datos
      const { data: dbData, error: dbError } = await supabase
        .from('cultural_heritages')
        .select('count', { count: 'exact', head: true });

      // Verificar conexión a storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('patrimonial_audios')
        .list('', { limit: 1 });

      const status = {
        database: dbError ? 'error' : 'healthy',
        storage: storageError ? 'error' : 'healthy',
        cache: {
          size: cache.size,
          keys: Array.from(cache.keys())
        },
        timestamp: new Date().toISOString()
      };

      return { data: status, error: null };
    } catch (error) {
      console.error('Error en getServiceStatus:', error);
      return { data: null, error };
    }
  }
};

// Exportar utilidades de cache para desarrollo
export const cacheUtils = {
  getCacheSize: () => cache.size,
  getCacheKeys: () => Array.from(cache.keys()),
  clearCache: () => cache.clear(),
  invalidatePattern: (pattern) => invalidateCache(pattern)
};
