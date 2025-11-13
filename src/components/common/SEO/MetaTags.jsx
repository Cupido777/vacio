import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Componente MetaTags optimizado para SEO y compatibilidad total
 * Maneja metatags dinámicos, Open Graph, Twitter Cards y structured data
 */
const MetaTags = ({ 
  title = 'ODAM-App - Plataforma Cultural Digital | Patrimonio Sonoro de Cartagena - IPCC',
  description = 'Plataforma oficial del IPCC para formación artística digital y preservación del patrimonio sonoro vivo de Cartagena. Cursos especializados, repositorio patrimonial y comunidad creativa.',
  keywords = 'patrimonio cultural cartagena, música tradicional, formación artística digital, cumbia, bullerengue, champeta, IPCC, odam-app, cultura cartagenera',
  image = '/images/og-default.jpg',
  url = 'https://appodam.com',
  type = 'website',
  canonical = 'https://appodam.com',
  locale = 'es_CO',
  siteName = 'ODAM-App - Plataforma Cultural Digital',
  twitterHandle = '@ipccartagena',
  noindex = false,
  nofollow = false,
  structuredData = null
}) => {
  // Validación y sanitización de inputs
  const safeTitle = String(title || '').substring(0, 70);
  const safeDescription = String(description || '').substring(0, 160);
  const safeKeywords = String(keywords || '').substring(0, 255);
  const safeUrl = String(url || '').replace(/[<>]/g, '');
  const safeCanonical = String(canonical || '').replace(/[<>]/g, '');
  const safeImage = String(image || '').replace(/[<>]/g, '');
  
  // Robots meta tag
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-snippet:-1',
    'max-image-preview:large',
    'max-video-preview:-1'
  ].join(', ');

  // Structured data por defecto para ODAM-App
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'CulturalOrganization'],
    'name': siteName,
    'url': safeUrl,
    'logo': `${safeUrl}/icons/icon-192x192.png`,
    'description': safeDescription,
    'foundingOrganization': {
      '@type': 'GovernmentOrganization',
      'name': 'Instituto de Patrimonio y Cultura de Cartagena (IPCC)',
      'url': 'https://ipcc.gov.co'
    },
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Cartagena',
      'addressRegion': 'Bolívar',
      'addressCountry': 'CO'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'customer service',
      'email': 'info@ipcc.gov.co',
      'availableLanguage': ['es', 'en']
    },
    'sameAs': [
      'https://www.facebook.com/ipccartagena',
      'https://www.instagram.com/ipccartagena',
      'https://twitter.com/ipccartagena'
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Codificación y viewport */}
      <html lang="es" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      
      {/* Meta tags básicos */}
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} />
      <meta name="keywords" content={safeKeywords} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={safeCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={safeUrl} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image" content={safeImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={safeImage} />
      
      {/* Información adicional de SEO */}
      <meta name="author" content="Instituto de Patrimonio y Cultura de Cartagena - IPCC" />
      <meta name="copyright" content="IPCC Cartagena" />
      <meta name="language" content="ES" />
      <meta name="geo.region" content="CO-BOL" />
      <meta name="geo.placename" content="Cartagena de Indias" />
      <meta name="geo.position" content="10.3910;-75.4794" />
      <meta name="ICBM" content="10.3910, -75.4794" />
      
      {/* PWA y temas */}
      <meta name="theme-color" content="#D4AF37" />
      <meta name="msapplication-TileColor" content="#D4AF37" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="ODAM-App" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Preconexiones para performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      
      {/* Favicons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
    </Helmet>
  );
};

// Componentes específicos preconfigurados para diferentes páginas

export const HomeMetaTags = (props) => (
  <MetaTags
    title="ODAM-App - Plataforma Cultural Digital | Patrimonio Sonoro de Cartagena"
    description="Plataforma oficial del IPCC para formación artística digital y preservación del patrimonio sonoro vivo de Cartagena. Cursos especializados en música tradicional."
    keywords="patrimonio cultural, música cartagenera, bullerengue, cumbia, champeta, formación musical, IPCC Cartagena"
    {...props}
  />
);

export const CoursesMetaTags = (props) => (
  <MetaTags
    title="Cursos de Formación Artística - ODAM-App | IPCC Cartagena"
    description="Cursos especializados en producción musical digital con enfoque en patrimonios sonoros cartageneros. Aprende bullerengue, cumbia y champeta."
    keywords="cursos música, formación artística, producción musical, talleres culturales, educación musical digital"
    {...props}
  />
);

export const HeritageMetaTags = (props) => (
  <MetaTags
    title="Repositorio Patrimonial - Tradiciones Musicales de Cartagena | ODAM-App"
    description="Archivo digital de ritmos tradicionales cartageneros: cumbia, bullerengue, champeta. Documentación y preservación del patrimonio sonoro."
    keywords="patrimonio sonoro, música tradicional, archivo musical, bullerengue sentao, cumbia cartagenera"
    {...props}
  />
);

export const CommunityMetaTags = (props) => (
  <MetaTags
    title="Comunidad Creativa - Artistas y Gestores Culturales | ODAM-App"
    description="Red de artistas, gestores culturales y portadores de tradición de Cartagena. Conecta con la comunidad cultural local."
    keywords="comunidad artística, gestores culturales, artistas cartagena, red cultural, creadores locales"
    {...props}
  />
);

export const GalleryMetaTags = (props) => (
  <MetaTags
    title="Galería de Creaciones Culturales - ODAM-App | IPCC"
    description="Exposición digital de obras fusionando tradición e innovación. Galería de creaciones artísticas de la comunidad ODAM-App."
    keywords="galería cultural, obras artísticas, exposiciones digitales, creaciones musicales, arte cartagenero"
    {...props}
  />
);

// Hook para uso programático de meta tags
export const useMetaTags = () => {
  const updateMetaTags = React.useCallback((updates) => {
    const helmet = document.querySelector('head');
    if (!helmet) return;

    // Actualizar título
    if (updates.title) {
      const titleTag = document.querySelector('title');
      if (titleTag) {
        titleTag.textContent = updates.title;
      }
    }

    // Actualizar descripción
    if (updates.description) {
      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) {
        descTag.setAttribute('content', updates.description);
      }
      
      const ogDescTag = document.querySelector('meta[property="og:description"]');
      if (ogDescTag) {
        ogDescTag.setAttribute('content', updates.description);
      }
    }
  }, []);

  return { updateMetaTags };
};

// Prop Types para mejor desarrollo
MetaTags.defaultProps = {
  title: 'ODAM-App - Plataforma Cultural Digital | Patrimonio Sonoro de Cartagena - IPCC',
  description: 'Plataforma oficial del IPCC para formación artística digital y preservación del patrimonio sonoro vivo de Cartagena.',
  keywords: 'patrimonio cultural cartagena, música tradicional, formación artística digital, cumbia, bullerengue, champeta, IPCC',
  image: '/images/og-default.jpg',
  url: 'https://appodam.com',
  type: 'website',
  canonical: 'https://appodam.com',
  locale: 'es_CO',
  siteName: 'ODAM-App - Plataforma Cultural Digital',
  twitterHandle: '@ipccartagena',
  noindex: false,
  nofollow: false,
  structuredData: null
};

export default React.memo(MetaTags);
