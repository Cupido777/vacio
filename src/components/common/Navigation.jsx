import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Book, Music, Users, Image, Settings } from 'lucide-react'

const Navigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/cursos', icon: Book, label: 'Cursos' },
    { path: '/patrimonio', icon: Music, label: 'Patrimonio' },
    { path: '/comunidad', icon: Users, label: 'Comunidad' },
    { path: '/galeria', icon: Image, label: 'Galería' },
    { path: '/admin', icon: Settings, label: 'Admin' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg md:relative md:shadow-none">
      <div className="container mx-auto px-2">
        <div className="flex justify-around md:justify-start md:space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 md:flex-row md:space-x-2 md:px-4 md:py-3 transition-all duration-200 ${
                  isActive 
                    ? 'text-colonial-yellow bg-colonial-sand md:bg-colonial-yellow md:text-white md:rounded-lg' 
                    : 'text-gray-600 hover:text-colonial-blue'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 md:h-4 md:w-4" />
                <span className="text-xs mt-1 md:mt-0 md:text-sm">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
