import React from 'react'
import { Heart, Copyright } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-colonial-dark-blue text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="flex items-center justify-center text-sm mb-2">
            Hecho con <Heart className="h-4 w-4 mx-1 text-colonial-coral fill-current" /> para el patrimonio de Cartagena
          </p>
          <p className="flex items-center justify-center text-xs opacity-90">
            <Copyright className="h-3 w-3 mr-1" />
            {new Date().getFullYear()} ODAM-App - Instituto de Patrimonio y Cultura de Cartagena
          </p>
          <div className="mt-3 text-xs opacity-75">
            <p>Plataforma de Formación Artística Digital</p>
            <p className="mt-1">Rescate de Tradiciones - Patrimonio Vivo</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
