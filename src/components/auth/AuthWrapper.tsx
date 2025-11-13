// src/components/auth/AuthWrapper.tsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { CulturalKYC } from './CulturalKYC'
import { MainDashboard } from '../dashboard/MainDashboard'

export const AuthWrapper: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sesión activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await checkProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    setProfile(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-700">Cargando plataforma cultural...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario, mostrar login
  if (!user) {
    return <LoginScreen />
  }

  // Si hay usuario pero no completó KYC
  if (!profile) {
    return <CulturalKYC />
  }

  // Usuario autenticado con perfil completo
  return <MainDashboard profile={profile} />
}

// Componente de Login temporal
const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error
      alert('¡Cuenta creada! Completa tu perfil cultural.')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            🎵 ODAM-App
          </h1>
          <p className="text-amber-600">
            Plataforma Cultural de Cartagena
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ¿No tienes cuenta? Regístrate aquí
          </button>
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-700 text-center">
            <strong>Demo:</strong> Usa cualquier email y contraseña para probar
          </p>
        </div>
      </div>
    </div>
  )
}
