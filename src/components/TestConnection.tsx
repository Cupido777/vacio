// src/components/TestConnection.tsx
import React, { useEffect, useState } from 'react'
import { supabaseService } from '../lib/supabase'

export const TestConnection: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([])
  const [audio, setAudio] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Testear conexión a cursos
        const coursesData = await supabaseService.getAllCourses()
        if (coursesData.data) setCourses(coursesData.data)

        // Testear conexión a audio patrimonial
        const audioData = await supabaseService.getAudioHeritage()
        if (audioData.data) setAudio(audioData.data)

        setLoading(false)
      } catch (error) {
        console.error('Error de conexión:', error)
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  if (loading) {
    return (
      <div className="p-8 bg-green-50 rounded-lg">
        <h2 className="text-xl font-bold text-green-800">🔄 Probando conexión a Supabase...</h2>
      </div>
    )
  }

  return (
    <div className="p-8 bg-green-50 rounded-lg border border-green-200">
      <h2 className="text-2xl font-bold text-green-800 mb-4">✅ ¡Conexión Exitosa!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-green-700 mb-2">📚 Cursos Cargados:</h3>
          <ul className="list-disc list-inside">
            {courses.map(course => (
              <li key={course.id} className="text-green-600">{course.title}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-green-700 mb-2">🎵 Audio Patrimonial:</h3>
          <ul className="list-disc list-inside">
            {audio.map(item => (
              <li key={item.id} className="text-green-600">{item.title}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-100 rounded">
        <p className="text-green-700">
          <strong>Base de datos:</strong> {courses.length} cursos, {audio.length} archivos de audio
        </p>
      </div>
    </div>
  )
}
