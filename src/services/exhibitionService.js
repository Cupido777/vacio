import { supabase } from './supabase';

export const exhibitionService = {
  // ===== EXPOSICIONES =====
  async createExhibition(exhibitionData) {
    const { data, error } = await supabase
      .from('exhibitions')
      .insert([exhibitionData])
      .select()
      .single();
    
    return { data, error };
  },

  async getExhibitions(filters = {}) {
    let query = supabase
      .from('exhibitions')
      .select(`
        *,
        exhibition_artworks(count),
        exhibition_artworks!inner(
          artwork:community_posts(
            id,
            title,
            content,
            media_url,
            media_type,
            author_name,
            created_at
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async getExhibitionById(exhibitionId) {
    const { data, error } = await supabase
      .from('exhibitions')
      .select(`
        *,
        exhibition_artworks(
          artwork:community_posts(
            *,
            post_likes(count),
            post_comments(count)
          )
        )
      `)
      .eq('id', exhibitionId)
      .single();

    return { data, error };
  },

  // ===== OBRAS EN EXPOSICIÓN =====
  async addArtworkToExhibition(exhibitionId, artworkId) {
    const { data, error } = await supabase
      .from('exhibition_artworks')
      .insert([{ 
        exhibition_id: exhibitionId, 
        artwork_id: artworkId 
      }])
      .select()
      .single();

    return { data, error };
  },

  async removeArtworkFromExhibition(exhibitionId, artworkId) {
    const { error } = await supabase
      .from('exhibition_artworks')
      .delete()
      .eq('exhibition_id', exhibitionId)
      .eq('artwork_id', artworkId);

    return { error };
  },

  async getExhibitionArtworks(exhibitionId) {
    const { data, error } = await supabase
      .from('exhibition_artworks')
      .select(`
        *,
        artwork:community_posts(*)
      `)
      .eq('exhibition_id', exhibitionId);

    return { data, error };
  },

  // ===== OBRAS DISPONIBLES =====
  async getAvailableArtworks(filters = {}) {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        post_likes(count),
        post_comments(count)
      `)
      .eq('media_type', 'image') // Solo imágenes para exposición
      .order('created_at', { ascending: false });

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters.author_id) {
      query = query.eq('author_id', filters.author_id);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // ===== CONFIGURACIÓN GALERÍA VIRTUAL =====
  async saveGalleryLayout(exhibitionId, layoutData) {
    const { data, error } = await supabase
      .from('exhibitions')
      .update({ virtual_layout: layoutData })
      .eq('id', exhibitionId)
      .select()
      .single();

    return { data, error };
  },

  // ===== ESTADÍSTICAS =====
  async getExhibitionStats(exhibitionId) {
    const { data: artworks } = await supabase
      .from('exhibition_artworks')
      .select('artwork_id')
      .eq('exhibition_id', exhibitionId);

    const { data: views } = await supabase
      .from('exhibition_views')
      .select('*')
      .eq('exhibition_id', exhibitionId);

    return {
      total_artworks: artworks?.length || 0,
      total_views: views?.length || 0,
      unique_visitors: new Set(views?.map(v => v.user_id)).size
    };
  }
};
