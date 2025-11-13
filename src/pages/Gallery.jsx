import React from 'react';
import { Image, Music2, Play, Download } from 'lucide-react';

const GalleryPage = () => {
  const artworks = [
    {
      id: 1,
      title: 'Fusión Digital Cumbia',
      artist: 'Ana Rodríguez',
      type: 'Composición',
      description: 'Mezcla de cumbia tradicional con sintetizadores modernos',
      image: '/api/placeholder/400/300'
    },
    {
      id: 2,
      title: 'Ritmos Ancestrales Remix',
      artist: 'Carlos López',
      type: 'Producción',
      description: 'Reinterpretación de bullerengue con beats electrónicos',
      image: '/api/placeholder/400/300'
    },
    {
      id: 3,
      title: 'Champeta Urbana',
      artist: 'DJ Kamba',
      type: 'Mix',
      description: 'Fusión de champeta criolla con sonidos urbanos',
      image: '/api/placeholder/400/300'
    }
  ];

  return (
    <div className="min-h-screen bg-colonial-sand py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-traditional text-colonial-blue text-center mb-8">
          Galería Digital
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-r from-colonial-blue to-colonial-coral relative">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                <div className="absolute top-4 left-4 bg-colonial-yellow text-colonial-blue px-3 py-1 rounded-full text-sm font-caribbean font-semibold">
                  {artwork.type}
                </div>
                <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-colonial-yellow hover:text-colonial-blue transition-all duration-300 shadow-lg">
                  <Play className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <h3 className="font-caribbean font-semibold text-xl text-colonial-blue mb-2">
                  {artwork.title}
                </h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Por <span className="text-colonial-coral font-semibold">{artwork.artist}</span>
                </p>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {artwork.description}
                </p>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-colonial-blue text-white py-2 rounded-lg font-caribbean font-semibold hover:bg-colonial-dark-blue transition-colors duration-200 text-sm">
                    Escuchar
                  </button>
                  <button className="px-3 bg-colonial-sand text-colonial-blue rounded-lg hover:bg-colonial-yellow transition-colors duration-200">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
