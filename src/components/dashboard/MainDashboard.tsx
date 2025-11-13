// src/components/dashboard/MainDashboard.tsx
import React from 'react'
import { Profile } from '../../lib/supabase'
import { CourseGrid } from '../courses/CourseGrid'
import { AudioHeritage } from '../audio/AudioHeritage'

interface MainDashboardProps {
  profile: Profile
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ profile }) => {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-900 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🎵 ODAM-App</h1>
            <p className="text-amber-200">Plataforma Cultural de Cartagena</p>
          </div>
          <div className="text-right">
            <p className="font-medium">¡Hola, {profile.full_name}!</p>
            <p className="text-amber-300 text-sm">{profile.neighborhood}</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {/* Bienvenida */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            Bienvenido a la Plataforma Cultural
          </h2>
          <p className="text-amber-700">
            Explora cursos, descubre patrimonio sonoro y únete a la comunidad cultural de Cartagena.
          </p>
        </section>

        {/* Cursos Destacados */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-amber-800">Cursos Destacados</h3>
            <button className="text-amber-600 hover:text-amber-700 font-medium">
              Ver todos →
            </button>
          </div>
          <CourseGrid />
        </section>

        {/* Audio Patrimonial */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-amber-800">Patrimonio Sonoro</h3>
            <button className="text-amber-600 hover:text-amber-700 font-medium">
              Explorar archivo →
            </button>
          </div>
          <AudioHeritage />
        </section>
      </div>
    </div>
  )
}
