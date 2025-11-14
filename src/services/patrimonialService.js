import { supabase } from '../supabaseClient';

export const patrimonialService = {
  // Subir audio con metadatos
  async uploadAudio(file, metadata) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('patrimonial_audios')
      .upload(`audios/${file.name}`, file);

    if (uploadError) throw uploadError;

    // Guardar metadatos en base de datos
    const { data, error } = await supabase
      .from('patrimonial_audios')
      .insert([{ ...metadata, audio_url: uploadData.path }]);

    return { data, error };
  },

  // Obtener audios con filtros
  async getAudios(filters = {}) {
    let query = supabase.from('patrimonial_audios').select('*');
    
    if (filters.cultural_manifestation) {
      query = query.eq('cultural_manifestation', filters.cultural_manifestation);
    }
    
    if (filters.neighborhood) {
      query = query.eq('neighborhood', filters.neighborhood);
    }

    const { data, error } = await query;
    return { data, error };
  }
}
