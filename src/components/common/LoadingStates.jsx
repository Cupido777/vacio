import React from 'react';
import { Loader, BookOpen, Users, Calendar, Award } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Cargando...' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader className={`${sizes[size]} text-colonial-blue animate-spin mb-3`} />
      <p className="text-gray-600 text-sm font-caribbean">{text}</p>
    </div>
  );
};

export const SkeletonCard = ({ type = 'default' }) => {
  const configs = {
    default: 'h-32 rounded-lg',
    module: 'h-48 rounded-xl',
    student: 'h-40 rounded-lg',
    stats: 'h-32 rounded-xl'
  };

  return (
    <div className={`bg-gray-200 animate-pulse ${configs[type]}`}></div>
  );
};

export const SkeletonList = ({ count = 3, type = 'default' }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} type={type} />
      ))}
    </div>
  );
};

export const LoadingSection = ({ icon: Icon = BookOpen, title = "Cargando contenido" }) => (
  <div className="text-center py-12 bg-white rounded-xl shadow-lg">
    <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
    <h3 className="font-traditional text-xl text-gray-700 mb-2">{title}</h3>
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-colonial-blue"></div>
    </div>
  </div>
);
