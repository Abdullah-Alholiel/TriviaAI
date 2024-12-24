'use client';

import { useCallback } from 'react';
import { useLoading } from '@/components/ui/LoadingContext';

export function useLoadingCallback<T extends (...args: unknown[]) => Promise<unknown>>(
  callback: T
): T {
  const { setIsLoading } = useLoading();

  return useCallback(
    async (...args: Parameters<T>) => {
      setIsLoading(true);
      try {
        return await callback(...args);
      } finally {
        setIsLoading(false);
      }
    },
    [callback, setIsLoading]
  ) as T;
}

export default useLoadingCallback; 