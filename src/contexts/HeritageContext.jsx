import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

const HeritageContext = createContext()

// Security constants
const MAX_RECORDS = 1000
const ALLOWED_AUDIO_TYPES = ['audio/wav', 'audio/mpeg', 'audio/ogg', 'audio/mp4']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// Input validation and sanitization
const validateHeritageItem = (item) => {
  if (!item || typeof item !== 'object') {
    throw new Error('Datos del elemento inválidos')
  }

  const sanitized = {
    titulo: String(item.titulo || '').trim().substring(0, 200),
    descripcion: String(item.descripcion || '').trim().substring(0, 1000),
    artista: String(item.artista || '').trim().substring(0, 100),
    genero: String(item.genero || '').trim().substring(0, 50),
    url_audio: String(item.url_audio || '').trim(),
    duracion: String(item.duracion || '0:00'),
    likes: Math.max(0, parseInt(item.likes) || 0),
    fecha_creacion: item.fecha_creacion || new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString()
  }

  // Required fields validation
  if (!sanitized.titulo || sanitized.titulo.length < 1) {
    throw new Error('El título es requerido y debe tener al menos 1 carácter')
  }

  if (!sanitized.url_audio) {
    throw new Error('La URL del audio es requerida')
  }

  // URL validation
  try {
    new URL(sanitized.url_audio)
  } catch {
    throw new Error('Formato de URL de audio inválido')
  }

  return sanitized
}

export function useHeritage() {
  const context = useContext(HeritageContext)
  if (!context) {
    throw new Error('useHeritage debe ser usado dentro de un HeritageProvider')
  }
  return context
}

export function HeritageProvider({ children }) {
  const [audioHeritage, setAudioHeritage] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchAudioHeritage = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('patrimonio_sonoro')
        .select('*')
        .order('fecha_creacion', { ascending: false })
        .limit(MAX_RECORDS)
      
      if (supabaseError) throw supabaseError

      // Validate all data before setting state
      const validatedData = data.map(item => {
        try {
          return validateHeritageItem(item)
        } catch (err) {
          console.warn('Elemento de patrimonio inválido omitido:', err.message)
          return null
        }
      }).filter(Boolean)

      setAudioHeritage(validatedData)
      setLastUpdated(new Date())
      
    } catch (err) {
      console.error("Error cargando patrimonio sonoro: ", err)
      setError(err.message || "Error al cargar el patrimonio sonoro")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAudioHeritage()
  }, [fetchAudioHeritage])

  const addAudioItem = useCallback(async (audioData) => {
    try {
      setError(null)

      // Validate and sanitize input data
      const validatedData = validateHeritageItem(audioData)

      // Additional security checks
      if (validatedData.url_audio.includes('javascript:')) {
        throw new Error('URL de audio inválida: protocolo potencialmente peligroso')
      }

      const { data, error: supabaseError } = await supabase
        .from('patrimonio_sonoro')
        .insert([validatedData])
        .select()

      if (supabaseError) throw supabaseError

      // Update local state optimistically
      if (data && data[0]) {
        setAudioHeritage(prev => [{
          ...data[0]
        }, ...prev])
      }

      setLastUpdated(new Date())
      return data[0]?.id

    } catch (err) {
      console.error("Error agregando elemento de audio: ", err)
      setError(err.message || "Error al agregar el elemento de audio")
      throw err
    }
  }, [])

  const refreshData = useCallback(() => {
    fetchAudioHeritage()
  }, [fetchAudioHeritage])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = React.useMemo(() => ({
    audioHeritage,
    loading,
    error,
    lastUpdated,
    addAudioItem,
    refreshData,
    clearError
  }), [
    audioHeritage,
    loading,
    error,
    lastUpdated,
    addAudioItem,
    refreshData,
    clearError
  ])

  return (
    <HeritageContext.Provider value={value}>
      {children}
    </HeritageContext.Provider>
  )
}
