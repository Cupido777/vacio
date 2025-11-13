import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Componente para structured data (Schema.org) optimizado
 */
const StructuredData = ({ data }) => {
  if (!data || typeof data !== 'object') return null;

  try {
    const sanitizedData = JSON.parse(JSON.stringify(data));
    
    return (
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(sanitizedData)}
        </script>
      </Helmet>
    );
  } catch (error) {
    console.error('Error en StructuredData:', error);
    return null;
  }
};

// Structured data predefinidos para ODAM-App

export const OrganizationStructuredData = () => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    'name': 'ODAM-App - Plataforma Cultural Digital',
    'alternateName': 'ODAM-App',
    'url': 'https://appodam.com',
    'logo': 'https://appodam.com/icons/icon-192x192.png',
    'description': 'Plataforma de Formación Artística Digital y Rescate del Patrimonio Sonoro Vivo de Cartagena',
    'foundingOrganization': {
      '@type': 'GovernmentOrganization',
      'name': 'Instituto de Patrimonio y Cultura de Cartagena',
      'url': 'https://ipcc.gov.co'
    },
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Calle de la Cultura',
      'addressLocality': 'Cartagena',
      'addressRegion': 'Bolívar',
      'postalCode': '130001',
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

  return <StructuredData data={data} />;
};

export const BreadcrumbStructuredData = ({ items = [] }) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name || '',
      'item': item.url || ''
    })).filter(item => item.name && item.item)
  };

  return <StructuredData data={data} />;
};

export const CourseStructuredData = ({ course = {} }) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': course.name || 'Curso de Formación Musical',
    'description': course.description || 'Curso especializado en patrimonio sonoro de Cartagena',
    'provider': {
      '@type': 'Organization',
      'name': 'ODAM-App - IPCC Cartagena',
      'sameAs': 'https://appodam.com'
    }
  };

  return <StructuredData data={data} />;
};

export const AudioObjectStructuredData = ({ audio = {} }) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AudioObject',
    'name': audio.title || 'Audio Patrimonial',
    'description': audio.description || 'Grabación de patrimonio sonoro cartagenero',
    'contentUrl': audio.audioUrl || '',
    'duration': audio.duration || 'PT4M20S',
    'genre': audio.genre || 'Traditional Music',
    'author': {
      '@type': 'Organization',
      'name': 'ODAM-App - IPCC Cartagena'
    }
  };

  return <StructuredData data={data} />;
};

export default React.memo(StructuredData);
