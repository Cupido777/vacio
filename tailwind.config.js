/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'colonial': {
          'yellow': '#D4AF37',
          'blue': '#1E3A8A',
          'sand': '#F8F4E9',
          'coral': '#E76F51',
          'terracotta': '#B56357',
          'dark-blue': '#1E2A5E',
          'light-yellow': '#E8C766',
          'dark-yellow': '#B8941F'
        }
      },
      fontFamily: {
        'caribbean': ['Montserrat', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Ubuntu', 'sans-serif'],
        'traditional': ['Playfair Display', 'Georgia', 'Cambria', 'Times New Roman', 'serif']
      },
      backgroundImage: {
        'cultural-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23d4af37\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'cartagena-texture': "linear-gradient(rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.1)), url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23d4af37\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')"
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
        '4xl': '2560px'
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xl': '1.75rem',
        '4xl': '2.5rem',
        '5xl': '3.25rem',
        '6xl': '4rem'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '200': '50rem',
        '100': '25rem'
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      },
      opacity: {
        '15': '0.15',
        '85': '0.85'
      },
      // 3D Transform utilities
      perspective: {
        '1000': '1000px',
        '500': '500px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
        'flat': 'flat',
      },
      backfaceVisibility: {
        'visible': 'visible',
        'hidden': 'hidden',
      },
      translate: {
        'z-200': '200px',
        'z-500': '500px',
        'z--200': '-200px',
      },
      rotate: {
        'y-90': '90deg',
        'y-180': '180deg',
        'y--90': '-90deg',
      }
    },
  },
  plugins: [
    function({ addUtilities, addVariant }) {
      // Cross-browser compatible utilities
      const newUtilities = {
        '.backface-visible': {
          'backface-visibility': 'visible',
          '-webkit-backface-visibility': 'visible',
          '-moz-backface-visibility': 'visible'
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
          '-webkit-backface-visibility': 'hidden',
          '-moz-backface-visibility': 'hidden'
        },
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d',
          '-webkit-transform-style': 'preserve-3d',
          '-moz-transform-style': 'preserve-3d'
        },
        '.transform-style-flat': {
          'transform-style': 'flat',
          '-webkit-transform-style': 'flat',
          '-moz-transform-style': 'flat'
        },
        '.perspective-1000': {
          'perspective': '1000px',
          '-webkit-perspective': '1000px',
          '-moz-perspective': '1000px'
        },
        '.perspective-500': {
          'perspective': '500px',
          '-webkit-perspective': '500px',
          '-moz-perspective': '500px'
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#D4AF37 #F8F4E9'
        },
        '.scrollbar-thin::-webkit-scrollbar': {
          width: '8px'
        },
        '.scrollbar-thin::-webkit-scrollbar-track': {
          background: '#F8F4E9',
          borderRadius: '4px'
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb': {
          background: '#D4AF37',
          borderRadius: '4px'
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
          background: '#B8941F'
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none'
        }
      }
      addUtilities(newUtilities)

      // Pseudo-class variants for better cross-browser support
      addVariant('hocus', ['&:hover', '&:focus'])
      addVariant('group-hocus', ['.group:hover &', '.group:focus &'])
      addVariant('supports-grid', '@supports (display: grid)')
      addVariant('supports-flex', '@supports (display: flex)')
      addVariant('supports-3d', '@supports (transform-style: preserve-3d)')
    }
  ],
  // Safelist for dynamic classes
  safelist: [
    'animate-fade-in-up',
    'animate-slide-in-right', 
    'animate-scale-in',
    'animate-float-3d',
    'animate-gallery-enter',
    'animation-delay-100',
    'animation-delay-200',
    'animation-delay-300',
    'perspective-1000',
    'perspective-500',
    'transform-style-preserve-3d',
    'backface-visible',
    'backface-hidden',
    'xs:flex',
    'xs:grid',
    'print:hidden'
  ],
  // Future proofing
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: false,
    relativeContentPathsByDefault: false
  }
}
