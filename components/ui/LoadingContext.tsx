'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Loader from './hexLoading';
import { useTheme } from './ThemeContext';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isInitialLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, isInitialLoading }}>
      {(isLoading || isInitialLoading) && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{ 
            opacity: isInitialLoading ? 1 : 0.9,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          <div className="transform scale-150">
            <Loader />
          </div>
          {isInitialLoading && (
            <div className="absolute bottom-10 left-0 right-0 text-center">
              <p className={`text-lg font-medium animate-pulse transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Loading BrainWave Trivia...
              </p>
            </div>
          )}
        </div>
      )}
      <div style={{ 
        opacity: isLoading || isInitialLoading ? 0 : 1,
        transition: 'opacity 0.3s ease-in-out'
      }}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}; 