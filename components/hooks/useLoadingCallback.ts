'use client';

import { useCallback } from 'react';
import { useLoading } from '../ui/LoadingContext';

export function useLoadingCallback<T extends any[]>(
  callback: (...args: T) => Promise<void>,
  delay: number = 0
) {
  const { setIsLoading } = useLoading();

  return useCallback(async (...args: T) => {
    setIsLoading(true);
    try {
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      await callback(...args);
    } finally {
      setIsLoading(false);
    }
  }, [callback, delay, setIsLoading]);
} 