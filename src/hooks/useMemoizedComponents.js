import React, { useMemo, memo } from 'react';

// Componente memoizado para listas
export const MemoizedStudentCard = memo(({ student, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow border">
      <h4 className="font-caribbean text-gray-900">{student.name}</h4>
      {/* ... resto del componente */}
    </div>
  );
});

MemoizedStudentCard.displayName = 'MemoizedStudentCard';

// Hook para datos memoizados
export const useMemoizedData = (data, transformFn, dependencies = []) => {
  return useMemo(() => {
    if (!data) return null;
    return transformFn ? transformFn(data) : data;
  }, [data, ...dependencies]);
};

// Hook para filtros optimizados
export const useOptimizedFilter = (items, filterFn, dependencies = []) => {
  return useMemo(() => {
    if (!items || !filterFn) return items;
    return items.filter(filterFn);
  }, [items, ...dependencies]);
};
