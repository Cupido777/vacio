export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    'tailwindcss': {},
    'autoprefixer': {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie <= 11',
        'not op_mini all',
        'not kaios <= 2.5',
        'not baidu <= 7.12',
        'maintained node versions'
      ],
      grid: 'autoplace',
      flexbox: 'no-2009',
      remove: false
    },
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': false, // Desactivado porque tailwindcss/nesting lo maneja
        'custom-media-queries': true,
        'media-query-ranges': true,
        'custom-properties': {
          preserve: true,
          fallback: true
        },
        'color-function': true,
        'lab-function': true,
        'font-format-keywords': true,
        'hexadecimal-alpha-notation': true,
        'system-ui-font-family': true
      },
      enableClientSidePolyfills: false
    },
    'postcss-flexbugs-fixes': {},
    'postcss-gap-properties': {},
    'postcss-logical': {
      dir: 'ltr'
    },
    'postcss-dir-pseudo-class': {
      dir: 'ltr'
    },
    ...(process.env.NODE_ENV === 'production' ? {
      'cssnano': {
        preset: ['default', {
          discardComments: {
            removeAll: true
          },
          normalizeWhitespace: false,
          colormin: true,
          convertValues: true,
          discardUnused: false,
          mergeIdents: false,
          reduceIdents: false,
          zindex: false
        }]
      }
    } : {})
  }
}
