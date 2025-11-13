import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Users, Image, Mic, Award, ArrowRight, MapPin, Music, Heart } from 'lucide-react';
import MetaTags from '../components/common/SEO/MetaTags';
import StructuredData from '../components/common/SEO/StructuredData';

const Home = () => {
  const features = [
    {
      icon: Book,
      title: 'Formación Artística Digital',
      description: 'Cursos especializados en producción musical con enfoque en patrimonios sonoros cartageneros',
      path: '/cursos',
      color: 'bg-colonial-yellow',
      stats: '150+ Jóvenes Formados'
    },
    {
      icon: Mic,
      title: 'Repositorio Patrimonial',
      description: 'Archivo digital de ritmos tradicionales: cumbia, bullerengue, champeta y más',
      path: '/patrimonio', 
      color: 'bg-colonial-coral',
      stats: '50+ Grabaciones'
    },
    {
      icon: Users,
      title: 'Comunidad Creativa',
      description: 'Red de artistas, gestores culturales y portadores de tradición',
      path: '/comunidad',
      color: 'bg-colonial-blue',
      stats: '200+ Miembros'
    },
    {
      icon: Image,
      title: 'Galería de Creaciones',
      description: 'Exposición digital de obras fusionando tradición e innovación',
      path: '/galeria',
      color: 'bg-colonial-terracotta',
      stats: '100+ Obras'
    }
  ];

  const culturalHeritage = [
    {
      name: 'Cumbia Cartagenera',
      description: 'Fusión de ritmos indígenas, africanos y españoles que define nuestra identidad cultural',
      recordings: '15 grabaciones históricas',
      artists: '8 maestros tradicionales'
    },
    {
      name: 'Bullerengue Sentao', 
      description: 'Expresión ancestral afrocaribeña con tambores y cantos de resistencia',
      recordings: '12 registros documentales',
      artists: '6 cantadoras reconocidas'
    },
    {
      name: 'Champeta Criolla',
      description: 'Evolución contemporánea de ritmos africanos en el contexto urbano',
      recordings: '18 versiones digitalizadas', 
      artists: '10 artistas urbanos'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "ODAM-App - Plataforma Cultural Digital",
    "description": "Plataforma de Formación Artística Digital y Rescate del Patrimonio Sonoro Vivo de Cartagena",
    "url": "https://appodam.com",
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "ODAM-App",
      "description": "Plataforma de formación artística digital del Instituto de Patrimonio y Cultura de Cartagena",
      "educationalProgram": features.map(feature => ({
        "@type": "EducationalOccupationalProgram",
        "name": feature.title,
        "description": feature.description,
        "numberOfParticipants": feature.stats
      }))
    }
  };

  return (
    <div className="min-h-screen bg-colonial-sand">
      <MetaTags 
        title="ODAM-App - Plataforma Cultural Digital | Patrimonio Sonoro de Cartagena"
        description="Plataforma oficial del IPCC para formación artística digital y preservación del patrimonio sonoro vivo de Cartagena. Cursos especializados, repositorio patrimonial y comunidad creativa."
        keywords="patrimonio cultural cartagena, música tradicional, formación artística digital, cumbia, bullerengue, champeta, IPCC"
        canonical="https://appodam.com"
      />
      <StructuredData data={structuredData} />

      {/* Hero Section */}
      <section 
        aria-labelledby="hero-title"
        className="relative bg-gradient-to-br from-colonial-blue via-colonial-dark-blue to-colonial-coral text-white py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20" aria-hidden="true"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div 
              className="bg-colonial-yellow p-4 rounded-full shadow-2xl"
              role="img"
              aria-label="Icono principal de ODAM-App representando la cultura musical"
            >
              <Music className="h-12 w-12 text-colonial-blue" aria-hidden="true" />
            </div>
          </div>
          
          <h1 id="hero-title" className="text-5xl md:text-7xl font-traditional mb-6 leading-tight">
            ODAM-App
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            Plataforma de Formación Artística Digital y Rescate del 
            <span className="text-colonial-yellow font-semibold"> Patrimonio Sonoro Vivo</span> de Cartagena
          </p>
          
          <div 
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto mb-8"
            role="complementary"
            aria-label="Cita inspiradora"
          >
            <p className="text-lg italic">
              "Osklin De Alba Medina - Honrando legados, construyendo futuros"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cursos"
              className="bg-colonial-yellow text-colonial-blue px-8 py-4 rounded-xl font-caribbean font-bold hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
              aria-label="Explorar cursos de formación artística"
            >
              <Book className="h-5 w-5 mr-2" aria-hidden="true" />
              Explorar Cursos
            </Link>
            <Link
              to="/patrimonio"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-caribbean font-bold hover:bg-white hover:text-colonial-blue transition-all duration-300 flex items-center justify-center"
              aria-label="Descubrir el repositorio patrimonial"
            >
              <Mic className="h-5 w-5 mr-2" aria-hidden="true" />
              Descubrir Patrimonio
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        aria-labelledby="stats-heading"
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <h2 id="stats-heading" className="sr-only">Estadísticas de Impacto</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Award, value: '150+', label: 'Jóvenes Formados' },
              { icon: Mic, value: '50+', label: 'Tradiciones Documentadas' },
              { icon: Image, value: '100+', label: 'Obras Creadas' },
              { icon: Users, value: '24/7', label: 'Acceso Digital' }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="transform hover:scale-105 transition-transform duration-200"
                role="figure"
                aria-label={`${stat.value} ${stat.label}`}
              >
                <stat.icon className="h-12 w-12 text-colonial-yellow mx-auto mb-4" aria-hidden="true" />
                <div className="text-3xl font-caribbean font-bold text-colonial-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        aria-labelledby="features-heading"
        className="py-16 bg-colonial-sand"
      >
        <div className="container mx-auto px-4">
          <h2 id="features-heading" className="text-4xl font-traditional text-colonial-blue text-center mb-4">
            Una Plataforma Integral para la Cultura
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-lg">
            Combinamos tecnología de vanguardia con el respeto por las tradiciones ancestrales
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
            {features.map((feature, index) => (
              <article 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100"
                role="listitem"
              >
                <Link to={feature.path} className="block">
                  <div 
                    className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                    aria-hidden="true"
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-caribbean font-semibold text-colonial-blue mb-3 text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs font-semibold text-colonial-blue bg-colonial-sand px-2 py-1 rounded">
                      {feature.stats}
                    </span>
                    <ArrowRight className="h-4 w-4 text-colonial-blue transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        aria-labelledby="cta-heading"
        className="py-20 bg-gradient-to-r from-colonial-blue to-colonial-dark-blue text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-4xl md:text-5xl font-traditional mb-6">
            ¿Listo para Transformar el Patrimonio Cultural？
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Únete a la revolución digital que está preservando y revitalizando las tradiciones musicales de Cartagena
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/cursos"
              className="bg-colonial-yellow text-colonial-blue px-8 py-4 rounded-xl font-caribbean font-bold hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-2xl"
              aria-label="Comenzar mi formación en ODAM-App"
            >
              Comenzar Mi Formación
            </Link>
            <div className="flex items-center text-sm opacity-80">
              <MapPin className="h-4 w-4 mr-1" aria-hidden="true" />
              Cartagena de Indias - Patrimonio de la Humanidad
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <div className="flex items-center text-sm opacity-70">
              <Heart className="h-4 w-4 mr-1 text-colonial-coral" aria-hidden="true" />
              Desarrollado con el apoyo del Instituto de Patrimonio y Cultura de Cartagena
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
