import { useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, ms: number, fn: (v: T) => void) {
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => fn(value), ms);
    
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [value, ms, fn]);
}