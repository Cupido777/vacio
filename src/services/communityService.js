import { supabase } from '../supabaseClient';

export const communityService = {
  // ===== POSTS =====
  async createPost(postData) {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([postData])
      .select()
      .single();
    
    return { data, error };
  },

  async getPosts(filters = {}) {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        post_comments(count),
        post_likes(count)
      `)
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

  async getPostById(postId) {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        post_comments(*),
        post_likes(*)
      `)
      .eq('id', postId)
      .single();

    return { data, error };
  },

  // ===== COMMENTS =====
  async createComment(commentData) {
    const { data, error } = await supabase
      .from('post_comments')
      .insert([commentData])
      .select()
      .single();

    // Actualizar contador de comentarios
    if (!error) {
      await this.updateCommentsCount(commentData.post_id);
    }

    return { data, error };
  },

  async getCommentsByPost(postId) {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    return { data, error };
  },

  // ===== LIKES =====
  async toggleLike(postId, userId) {
    // Verificar si ya existe like
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Quitar like
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id);
      
      if (!error) {
        await this.updateLikesCount(postId, -1);
      }
      return { liked: false, error };
    } else {
      // Agregar like
      const { data, error } = await supabase
        .from('post_likes')
        .insert([{ post_id: postId, user_id: userId }])
        .select()
        .single();
      
      if (!error) {
        await this.updateLikesCount(postId, 1);
      }
      return { liked: true, data, error };
    }
  },

  async getPostLikes(postId) {
    const { data, error } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId);

    return { data, error };
  },

  // ===== UTILITIES =====
  async updateLikesCount(postId, change) {
    const { data: post } = await supabase
      .from('community_posts')
      .select('likes_count')
      .eq('id', postId)
      .single();

    if (post) {
      const newCount = Math.max(0, (post.likes_count || 0) + change);
      await supabase
        .from('community_posts')
        .update({ likes_count: newCount })
        .eq('id', postId);
    }
  },

  async updateCommentsCount(postId) {
    const { count, error } = await supabase
      .from('post_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (!error) {
      await supabase
        .from('community_posts')
        .update({ comments_count: count })
        .eq('id', postId);
    }
  },

  // ===== CHALLENGES =====
  async getActiveChallenges() {
    // Retos culturales activos (puedes expandir esto después)
    const challenges = [
      {
        id: 1,
        title: "Reto de Cumbia Moderna",
        description: "Reinterpreta una cumbia tradicional con elementos contemporáneos",
        deadline: "2024-12-31",
        participants: 15,
        prize: "Participación en festival cultural"
      },
      {
        id: 2, 
        title: "Fotografía Patrimonial",
        description: "Captura la esencia del patrimonio vivo de Cartagena",
        deadline: "2024-11-30",
        participants: 23,
        prize: "Exposición en galería local"
      }
    ];

    return { data: challenges, error: null };
  }
};
