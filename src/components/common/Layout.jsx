import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Book, Users, Image, Mic, Settings, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';  
import MetaTags from './SEO/MetaTags';
import StructuredData from './SEO/StructuredData';

// ... el resto del código permanece igual
const Layout = ({ children }) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navItems = [
    { path: '/', icon: Music, label: 'Inicio', description: 'Página principal de ODAM-App' },
    { path: '/cursos', icon: Book, label: 'Cursos', description: 'Formación artística digital especializada' },
    { path: '/patrimonio', icon: Mic, label: 'Patrimonio', description: 'Repositorio de tradiciones musicales' },
    { path: '/comunidad', icon: Users, label: 'Comunidad', description: 'Red de artistas y gestores culturales' },
    { path: '/galeria', icon: Image, label: 'Galería', description: 'Exposición digital de obras culturales' },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ODAM-App",
    "url": "https://appodam.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://appodam.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-colonial-sand flex flex-col">
      <MetaTags 
        title="ODAM-App - Plataforma Cultural Digital del IPCC"
        description="Plataforma oficial de formación artística digital y preservación del patrimonio sonoro vivo de Cartagena"
        canonical="https://appodam.com"
      />
      <StructuredData data={structuredData} />
      
      <header role="banner" className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              aria-label="ODAM-App - Ir a página de inicio"
            >
              <div className="bg-colonial-yellow p-2 rounded-lg group-hover:scale-110 transition-transform duration-200" 
                   role="img" 
                   aria-label="Logo ODAM-App - Icono musical">
                <Music className="h-6 w-6 text-colonial-blue" />
              </div>
              <span className="font-traditional text-xl text-colonial-blue">
                ODAM-App
              </span>
            </Link>

            <nav 
              role="navigation" 
              aria-label="Navegación principal"
              className="hidden md:flex items-center space-x-2"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-caribbean font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-colonial-yellow text-colonial-blue shadow-md'
                        : 'text-gray-600 hover:text-colonial-blue hover:bg-colonial-sand'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    title={item.description}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-caribbean font-medium text-gray-600 hover:text-colonial-coral hover:bg-colonial-sand transition-all duration-200"
                title="Panel de administración"
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                <span>Admin</span>
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/perfil"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-caribbean font-medium text-gray-600 hover:text-colonial-blue hover:bg-colonial-sand transition-all duration-200"
                    title="Mi perfil"
                  >
                    <span>Hola, {currentUser.user_metadata?.full_name || currentUser.email}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-caribbean font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    title="Cerrar sesión"
                  >
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-caribbean font-medium text-colonial-blue hover:text-colonial-blue hover:bg-colonial-sand transition-all duration-200"
                    title="Iniciar sesión"
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    <span>Ingresar</span>
                  </Link>
                  <Link
                    to="/registro"
                    className="flex items-center space-x-2 bg-colonial-yellow text-colonial-blue px-4 py-2 rounded-lg font-caribbean font-medium hover:bg-yellow-500 transition-all duration-200"
                    title="Crear cuenta"
                  >
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    <span>Registrarse</span>
                  </Link>
                </div>
              )}
            </div>

            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Abrir menú de navegación"
              aria-expanded="false"
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Abrir menú principal</span>
              <div className="w-6 h-0.5 bg-gray-600 mb-1.5" aria-hidden="true"></div>
              <div className="w-6 h-0.5 bg-gray-600 mb-1.5" aria-hidden="true"></div>
              <div className="w-6 h-0.5 bg-gray-600" aria-hidden="true"></div>
            </button>
          </div>
        </div>
      </header>

      <main role="main" id="main-content" className="flex-grow">
        {children}
      </main>

      <footer 
        role="contentinfo" 
        className="bg-colonial-blue text-white py-8 mt-16"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Music className="h-6 w-6 text-colonial-yellow mr-2" aria-hidden="true" />
              <span className="font-traditional text-xl">ODAM-App</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-colonial-sand/80 mb-2">
                Plataforma de Formación Artística Digital - IPCC Cartagena
              </p>
              <p className="text-sm text-colonial-sand/60">
                © 2024 Instituto de Patrimonio y Cultura de Cartagena. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;