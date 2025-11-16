import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase - Reemplaza con tus credenciales reales
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are not set')
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing')
}

// Crear cliente de Supabase
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    global: {
      headers: {
        'x-application-name': 'odam-app'
      }
    }
  }
)

// Función de verificación de conexión
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('❌ Supabase connection error:', error)
      return { connected: false, error }
    }
    
    console.log('✅ Supabase connected successfully')
    return { connected: true, data }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return { connected: false, error }
  }
}

// Exportación por defecto para compatibilidad
export default supabase
