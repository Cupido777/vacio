import { supabase } from './supabaseClient';

const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

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

export const educationService = {
  // ===== CURSOS =====
  async getCourses(filters = {}) {
    const cacheKey = `courses_${JSON.stringify(filters)}`;
    
    return withCache(cacheKey, async () => {
      try {
        let query = supabase
          .from('education_courses')
          .select(`
            *,
            course_modules(count),
            instructor:instructors(*)
          `)
          .eq('status', 'active')
          .order('order', { ascending: true });

        if (filters.category) {
          query = query.eq('category', filters.category);
        }

        if (filters.difficulty) {
          query = query.eq('difficulty', filters.difficulty);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data || [];
      } catch (error) {
        console.error('Error getting courses:', error);
        throw error;
      }
    });
  },

  async getCourseById(courseId) {
    const cacheKey = `course_${courseId}`;
    
    return withCache(cacheKey, async () => {
      try {
        const { data, error } = await supabase
          .from('education_courses')
          .select(`
            *,
            lessons:course_lessons(*),
            instructor:instructors(*),
            modules:course_modules(*)
          `)
          .eq('id', courseId)
          .single();

        if (error) throw error;

        return data;
      } catch (error) {
        console.error('Error getting course:', error);
        throw error;
      }
    });
  },

  // ===== PROGRESO DE USUARIO =====
  async getUserProgress(userId, courseId) {
    try {
      const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || {
        user_id: userId,
        course_id: courseId,
        progress: 0,
        current_lesson: 0,
        completed: false,
        started_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  },

  async updateUserProgress(userId, courseId, progressData) {
    try {
      const { data, error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          ...progressData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Invalidar cache relacionado
      cache.delete(`progress_${userId}_${courseId}`);
      
      return data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },

  // ===== MÓDULOS =====
  async getModuleById(moduleId) {
    const cacheKey = `module_${moduleId}`;
    
    return withCache(cacheKey, async () => {
      try {
        const { data, error } = await supabase
          .from('course_modules')
          .select(`
            *,
            lessons:course_lessons(*),
            resources:module_resources(*),
            activities:module_activities(*)
          `)
          .eq('id', moduleId)
          .single();

        if (error) throw error;

        return data;
      } catch (error) {
        console.error('Error getting module:', error);
        throw error;
      }
    });
  },

  async getModuleProgress(userId, moduleId) {
    try {
      const { data, error } = await supabase
        .from('user_module_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const module = await this.getModuleById(moduleId);
      
      return data || {
        user_id: userId,
        module_id: moduleId,
        completed_resources: 0,
        completed_resources_list: [],
        completed_lessons: [],
        progress: 0
      };
    } catch (error) {
      console.error('Error getting module progress:', error);
      throw error;
    }
  },

  async markResourceComplete(userId, moduleId, resourceId) {
    try {
      // Obtener progreso actual
      const currentProgress = await this.getModuleProgress(userId, moduleId);
      
      const updatedResourcesList = [...new Set([
        ...(currentProgress.completed_resources_list || []),
        resourceId
      ])];

      const completedResources = updatedResourcesList.length;
      const module = await this.getModuleById(moduleId);
      const progress = Math.round((completedResources / module.resources.length) * 100);

      const { data, error } = await supabase
        .from('user_module_progress')
        .upsert({
          user_id: userId,
          module_id: moduleId,
          completed_resources: completedResources,
          completed_resources_list: updatedResourcesList,
          progress: progress,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error marking resource complete:', error);
      throw error;
    }
  },

  // ===== QUIZZES Y EVALUACIONES =====
  async saveQuizResult(userId, courseId, quizId, result) {
    try {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .upsert({
          user_id: userId,
          course_id: courseId,
          quiz_id: quizId,
          score: result.score,
          answers: result.answers,
          completed_at: result.completedAt,
          passed: result.score >= 70 // 70% para aprobar
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  },

  // ===== CERTIFICADOS =====
  async generateCertificate(userId, courseId) {
    try {
      const [course, progress] = await Promise.all([
        this.getCourseById(courseId),
        this.getUserProgress(userId, courseId)
      ]);

      if (!progress.completed) {
        throw new Error('Curso no completado');
      }

      const certificateData = {
        user_id: userId,
        course_id: courseId,
        certificate_number: `CERT-${courseId}-${userId}-${Date.now()}`,
        issue_date: new Date().toISOString(),
        expiration_date: null, // Certificados no expiran
        metadata: {
          course_title: course.title,
          completion_date: progress.updated_at,
          final_score: progress.final_score || 100
        }
      };

      const { data, error } = await supabase
        .from('user_certificates')
        .insert([certificateData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  },

  // ===== ESTADÍSTICAS =====
  async getEducationStats(userId) {
    try {
      const [
        { data: enrolledCourses },
        { data: completedCourses },
        { data: certificates },
        { data: totalProgress }
      ] = await Promise.all([
        supabase
          .from('user_course_progress')
          .select('course_id')
          .eq('user_id', userId),
        supabase
          .from('user_course_progress')
          .select('course_id')
          .eq('user_id', userId)
          .eq('completed', true),
        supabase
          .from('user_certificates')
          .select('id')
          .eq('user_id', userId),
        supabase
          .from('user_course_progress')
          .select('progress')
          .eq('user_id', userId)
      ]);

      const averageProgress = totalProgress?.length 
        ? totalProgress.reduce((sum, p) => sum + p.progress, 0) / totalProgress.length 
        : 0;

      return {
        enrolled_courses: enrolledCourses?.length || 0,
        completed_courses: completedCourses?.length || 0,
        certificates: certificates?.length || 0,
        average_progress: Math.round(averageProgress),
        learning_streak: this.calculateLearningStreak(userId) // Implementar esta función
      };
    } catch (error) {
      console.error('Error getting education stats:', error);
      throw error;
    }
  },

  // ===== UTILIDADES =====
  calculateLearningStreak(userId) {
    // Implementar cálculo de racha de aprendizaje
    return 7; // Ejemplo: 7 días consecutivos
  },

  cleanupCache() {
    cache.clear();
  }
};
