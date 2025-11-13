import { createClient } from '@supabase/supabase-js'

let supabase;

try {
  const supabaseUrl = 'https://afjwjixzqjeygjldxvgf.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmandqaXh6cWpleWdqbGR4dmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5ODUxNzEsImV4cCI6MjA3ODU2MTE3MX0.gnKk-Ncc25QUeKX972WwOkfm5x1Tc9ZUbgUVFNqO38w'
  
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Supabase configurado correctamente')
} catch (error) {
  console.error('❌ Error configurando Supabase:', error)
  // Crea un cliente vacío para evitar el crash
  supabase = { 
    from: () => ({ select: () => ({ data: [], error: null }) })
  }
}

export { supabase }
