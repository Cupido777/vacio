import { useState, useEffect, useRef, useCallback } from 'react';

// Hook para fetch optimizado con cancelación
export const useOptimizedFetch = (fetchFn, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const { enabled = true, initialData = null } = options;

  const execute = useCallback(async () => {
    if (!enabled) return;

    // Cancelar request anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn({ signal: abortControllerRef.current.signal });
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        console.error('Fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn, enabled]);

  useEffect(() => {
    execute();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute]);

  return { data, loading, error, refetch: execute };
};

// Hook para virtualización básica (para listas largas)
export const useVirtualizedList = (items, itemHeight, containerRef) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const visibleHeight = container.clientHeight;
      
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.ceil((scrollTop + visibleHeight) / itemHeight);
      
      setVisibleRange({ 
        start: Math.max(0, start - 5), // Buffer antes
        end: Math.min(items.length, end + 5) // Buffer después
      });
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Calcular inicial

    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length, itemHeight, containerRef]);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return { visibleItems, totalHeight, offsetY };
};

// Hook para debounce de búsquedas
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
