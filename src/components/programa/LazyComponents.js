import React, { lazy, Suspense } from 'react';
import { LoadingSpinner, SkeletonList } from '../common/LoadingStates';

// Lazy imports para componentes pesados
export const TalleresPresenciales = lazy(() => import('./TalleresPresenciales'));
export const ModulosPedagogicos = lazy(() => import('./ModulosPedagogicos'));
export const CertificacionSeguimiento = lazy(() => import('./CertificacionSeguimiento'));
export const InscripcionMasiva = lazy(() => import('./InscripcionMasiva'));

// Wrapper con Suspense para lazy components
export const withLazyLoading = (Component, fallback = null) => {
  return (props) => (
    <Suspense fallback={fallback || <LoadingSpinner text="Cargando módulo..." />}>
      <Component {...props} />
    </Suspense>
  );
};

// Componentes específicos con sus loaders
export const LazyTalleres = withLazyLoading(TalleresPresenciales, <SkeletonList count={3} type="module" />);
export const LazyModulos = withLazyLoading(ModulosPedagogicos, <SkeletonList count={4} type="module" />);
export const LazyCertificaciones = withLazyLoading(CertificacionSeguimiento, <SkeletonList count={2} type="stats" />);
export const LazyInscripcion = withLazyLoading(InscripcionMasiva, <SkeletonList count={1} type="default" />);
