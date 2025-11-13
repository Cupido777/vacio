import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Loader, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';

// Image optimization configuration
const IMAGE_CONFIG = {
  // Supported formats with fallbacks
  formats: ['webp', 'avif', 'jpg', 'png', 'jpeg'],
  
  // Quality settings
  qualities: {
    high: 0.8,
    medium: 0.6,
    low: 0.4
  },
  
  // Breakpoints for responsive images
  breakpoints: {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  },
  
  // Default sizes attribute
  defaultSizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  
  // Lazy loading threshold
  lazyThreshold: 0.1,
  
  // Maximum file size (50MB)
  maxFileSize: 50 * 1024 * 1024,
  
  // Allowed MIME types
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml'
  ]
};

// Error boundary for image loading
class ImageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ImageOptimizer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="image-error-fallback flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <span className="text-sm text-gray-600 text-center">
            No se pudo cargar la imagen
          </span>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for image preloading
const useImagePreloader = () => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [loadingImages, setLoadingImages] = useState(new Set());
  const [errors, setErrors] = useState(new Map());

  const preloadImage = useCallback((src) => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve(src);
        return;
      }

      if (loadingImages.has(src)) {
        // Already loading, wait for it
        const checkInterval = setInterval(() => {
          if (loadedImages.has(src)) {
            clearInterval(checkInterval);
            resolve(src);
          }
          if (errors.has(src)) {
            clearInterval(checkInterval);
            reject(errors.get(src));
          }
        }, 50);
        return;
      }

      setLoadingImages(prev => new Set(prev).add(src));

      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(src));
        setLoadingImages(prev => {
          const next = new Set(prev);
          next.delete(src);
          return next;
        });
        resolve(src);
      };
      
      img.onerror = (error) => {
        setErrors(prev => new Map(prev).set(src, error));
        setLoadingImages(prev => {
          const next = new Set(prev);
          next.delete(src);
          return next;
        });
        reject(error);
      };
      
      img.src = src;
    });
  }, [loadedImages, loadingImages, errors]);

  const isImageLoaded = useCallback((src) => loadedImages.has(src), [loadedImages]);
  const isImageLoading = useCallback((src) => loadingImages.has(src), [loadingImages]);
  const getImageError = useCallback((src) => errors.get(src), [errors]);

  return {
    preloadImage,
    isImageLoaded,
    isImageLoading,
    getImageError
  };
};

// Main ImageOptimizer component
const ImageOptimizer = React.memo(({
  src,
  alt = '',
  width,
  height,
  sizes = IMAGE_CONFIG.defaultSizes,
  quality = 'medium',
  priority = false,
  lazy = true,
  className = '',
  style = {},
  onLoad,
  onError,
  fallbackSrc = '/images/placeholder-cultural.jpg',
  placeholder = 'blur',
  blurDataURL,
  objectFit = 'cover',
  objectPosition = 'center',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const { preloadImage, isImageLoaded } = useImagePreloader();

  // Generate optimized srcSet
  const generateSrcSet = useCallback((baseSrc, baseWidth, baseHeight) => {
    if (!baseSrc || !baseWidth) return '';
    
    const { breakpoints, qualities } = IMAGE_CONFIG;
    const srcSet = [];
    
    Object.values(breakpoints).forEach(breakpoint => {
      if (breakpoint <= baseWidth) {
        const ratio = breakpoint / baseWidth;
        const calculatedHeight = Math.round(baseHeight * ratio);
        
        // WebP version
        srcSet.push(
          `${baseSrc}?w=${breakpoint}&h=${calculatedHeight}&q=${qualities[quality]}&format=webp ${breakpoint}w`
        );
        
        // AVIF version
        srcSet.push(
          `${baseSrc}?w=${breakpoint}&h=${calculatedHeight}&q=${qualities[quality]}&format=avif ${breakpoint}w`
        );
        
        // Fallback version
        srcSet.push(
          `${baseSrc}?w=${breakpoint}&h=${calculatedHeight}&q=${qualities[quality]} ${breakpoint}w`
        );
      }
    });
    
    return srcSet.join(', ');
  }, [quality]);

  // Intersection Observer for lazy loading
  React.useEffect(() => {
    if (!lazy || priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: IMAGE_CONFIG.lazyThreshold,
        rootMargin: '50px 0px 50px 0px'
      }
    );

    observer.observe(imgRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, priority]);

  // Preload image when in view
  React.useEffect(() => {
    if (isInView && src) {
      preloadImage(src).catch(error => {
        console.warn('Failed to preload image:', src, error);
        setHasError(true);
      });
    }
  }, [isInView, src, preloadImage]);

  const handleLoad = useCallback((event) => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.(event);
  }, [onLoad]);

  const handleError = useCallback((event) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(event);
  }, [onError]);

  // Generate optimized image props
  const optimizedProps = useMemo(() => {
    const baseProps = {
      ref: imgRef,
      alt,
      className: `image-optimizer ${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
      style: {
        objectFit,
        objectPosition,
        ...style
      },
      onLoad: handleLoad,
      onError: handleError,
      ...props
    };

    if (hasError) {
      return {
        ...baseProps,
        src: fallbackSrc,
        className: `${baseProps.className} image-error`
      };
    }

    if (!isInView) {
      return {
        ...baseProps,
        src: blurDataURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjhGNEU5Ii8+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dyYWQpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCIgeTI9IjEwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRjhGNEU5IiBvZmZzZXQ9IjAiLz4KPHN0b3Agc3RvcC1jb2xvcj0iI0U4QzM2NiIgb2Zmc2V0PSIwLjUiLz4KPHN0b3Agc3RvcC1jb2xvcj0iI0Q0QUYzNyIgb2Zmc2V0PSIxIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+'
      };
    }

    const srcSet = generateSrcSet(src, width, height);
    const optimizedProps = {
      ...baseProps,
      src,
      width,
      height,
      loading: lazy && !priority ? 'lazy' : 'eager',
      decoding: 'async',
      fetchPriority: priority ? 'high' : 'auto'
    };

    if (srcSet) {
      optimizedProps.srcSet = srcSet;
      optimizedProps.sizes = sizes;
    }

    return optimizedProps;
  }, [
    src,
    alt,
    width,
    height,
    sizes,
    className,
    style,
    objectFit,
    objectPosition,
    hasError,
    isInView,
    isLoading,
    lazy,
    priority,
    fallbackSrc,
    blurDataURL,
    generateSrcSet,
    handleLoad,
    handleError,
    props
  ]);

  return (
    <ImageErrorBoundary fallback={
      <div className="image-error-boundary flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
        <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
        <span className="text-sm text-gray-600">Error cargando imagen</span>
      </div>
    }>
      <div className="image-optimizer-container relative inline-block">
        {/* Loading indicator */}
        {isLoading && isInView && (
          <div className="image-loading-indicator absolute inset-0 flex items-center justify-center bg-colonial-sand bg-opacity-50 z-10">
            <Loader className="h-6 w-6 text-colonial-yellow animate-spin" />
          </div>
        )}
        
        {/* Error indicator */}
        {hasError && (
          <div className="image-error-indicator absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-50 z-20">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
        )}
        
        {/* Success indicator (for debugging) */}
        {!isLoading && !hasError && process.env.NODE_ENV === 'development' && (
          <div className="image-success-indicator absolute top-1 right-1 z-30">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
        
        <img {...optimizedProps} />
      </div>
    </ImageErrorBoundary>
  );
});

// Higher Order Component for image optimization
export const withImageOptimization = (WrappedComponent) => {
  return React.memo((props) => {
    const imageOptimizerProps = {
      imageOptimizer: {
        preload: useImagePreloader().preloadImage,
        generateSrcSet,
        config: IMAGE_CONFIG
      }
    };

    return <WrappedComponent {...props} {...imageOptimizerProps} />;
  });
};

// Utility functions for image optimization
export const generateBlurDataURL = (width = 100, height = 100) => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#F8F4E9"/>
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#grad)"/>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F8F4E9" offset="0"/>
          <stop stop-color="#E8C366" offset="0.5"/>
          <stop stop-color="#D4AF37" offset="1"/>
        </linearGradient>
      </defs>
    </svg>
  `)}`;
};

export const validateImageFile = (file) => {
  if (!file) return { isValid: false, error: 'No file provided' };
  
  if (file.size > IMAGE_CONFIG.maxFileSize) {
    return { 
      isValid: false, 
      error: `File size exceeds maximum allowed size of ${IMAGE_CONFIG.maxFileSize / 1024 / 1024}MB` 
    };
  }
  
  if (!IMAGE_CONFIG.allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `File type ${file.type} is not supported` 
    };
  }
  
  return { isValid: true, error: null };
};

export const compressImage = async (file, quality = 'medium') => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/webp' }));
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/webp',
        IMAGE_CONFIG.qualities[quality]
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
};

// Display name for debugging
ImageOptimizer.displayName = 'ImageOptimizer';

export default ImageOptimizer;
