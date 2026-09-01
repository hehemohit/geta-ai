import { useState, useEffect } from 'react';

/**
 * useDebounce — Custom hook to debounce fast-changing values (such as search queries).
 * @param {any} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default: 350ms)
 * @returns {any} debouncedValue
 */
export const useDebounce = (value, delay = 350) => {
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

export default useDebounce;
