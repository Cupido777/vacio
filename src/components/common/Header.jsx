import React from 'react';
import { Music, MapPin } from 'lucide-react';

const Header = () => {
  return (
    <header 
      role="banner" 
      className="bg-colonial-blue text-white shadow-lg sticky top-0 z-40"
      itemScope 
      itemType="https://schema.org/Organization"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="bg-colonial-yellow p-2 rounded-full shadow-md"
              role="img"
              aria-label="Logo ODAM-App - Icono musical representando el patrimonio sonoro"
            >
              <Music className="h-6 w-6 text-colonial-blue" aria-hidden="true" />
            </div>
            <div itemScope itemType="https://schema.org/Organization">
              <h1 className="text-xl font-caribbean font-bold tracking-tight" itemProp="name">
                ODAM-App
              </h1>
              <p className="text-xs opacity-90 flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                <span itemProp="location">Patrimonio Vivo de Cartagena</span>
              </p>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <p className="text-sm font-caribbean font-semibold" itemProp="legalName">
              IPCC Cartagena
            </p>
            <p className="text-xs opacity-90" itemProp="description">
              Plataforma Cultural Digital
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
