/**
 * @fileoverview Loading Context Provider for Global Loading State Management
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @version 1.0.0
 * @description Centralized loading state management with debouncing and error handling
 */

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Loading Context
 * @type {React.Context}
 */
const LoadingContext = createContext();

/**
 * Loading types for different operations
 */
export const LOADING_TYPES = {
  PAGE: 'page',
  API: 'api',
  FORM: 'form',
  IMAGE: 'image',
  FILE: 'file',
  DATA: 'data'
};

/**
 * Loading Context Provider
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Loading provider component
 */
export function LoadingProvider({ children }) {
  // Loading states for different operations
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  
  // Refs for debouncing and cleanup
  const timeoutRefs = useRef({});
  const mountedRef = useRef(true);
  
  // Router - only use on client side
  const [router, setRouter] = useState(null);
  
  useEffect(() => {
    // Dynamically import and use router only on client side
    if (typeof window !== 'undefined') {
      import('next/router').then(({ useRouter }) => {
        // Note: This is a workaround for SSR. In practice, we'll handle router events differently
      });
    }
  }, []);

  /**
   * Set loading state for a specific operation
   * @param {string} key - Loading operation key
   * @param {boolean} isLoading - Loading state
   * @param {Object} options - Loading options
   */
  const setLoading = useCallback((key, isLoading, options = {}) => {
    if (!mountedRef.current) return;

    const { 
      debounce = 0, 
      type = LOADING_TYPES.API,
      message = '',
      progress = null 
    } = options;

    // Clear existing timeout for this key
    if (timeoutRefs.current[key]) {
      clearTimeout(timeoutRefs.current[key]);
      delete timeoutRefs.current[key];
    }

    const updateState = () => {
      if (!mountedRef.current) return;
      
      setLoadingStates(prev => {
        const newState = { ...prev };
        
        if (isLoading) {
          newState[key] = {
            loading: true,
            type,
            message,
            progress,
            timestamp: Date.now()
          };
        } else {
          delete newState[key];
        }
        
        return newState;
      });
    };

    if (debounce > 0 && isLoading) {
      // Debounce showing loader to prevent flicker
      timeoutRefs.current[key] = setTimeout(updateState, debounce);
    } else if (!isLoading && debounce > 0) {
      // Immediate hide, but debounced show
      updateState();
    } else {
      // Immediate update
      updateState();
    }
  }, []);

  /**
   * Check if a specific operation is loading
   * @param {string} key - Loading operation key
   * @returns {boolean} Loading state
   */
  const isLoading = useCallback((key) => {
    return Boolean(loadingStates[key]?.loading);
  }, [loadingStates]);

  /**
   * Get loading state details for a specific operation
   * @param {string} key - Loading operation key
   * @returns {Object|null} Loading state details
   */
  const getLoadingState = useCallback((key) => {
    return loadingStates[key] || null;
  }, [loadingStates]);

  /**
   * Clear all loading states
   */
  const clearAllLoading = useCallback(() => {
    if (!mountedRef.current) return;
    
    // Clear all timeouts
    Object.values(timeoutRefs.current).forEach(clearTimeout);
    timeoutRefs.current = {};
    
    setLoadingStates({});
    setGlobalLoading(false);
  }, []);

  /**
   * Set global loading state (for full-page operations)
   * @param {boolean} isLoading - Loading state
   * @param {string} message - Loading message
   */
  const setGlobalLoadingState = useCallback((isLoading, message = '') => {
    if (!mountedRef.current) return;
    
    setGlobalLoading(isLoading);
    if (isLoading) {
      setLoading('global', true, { 
        type: LOADING_TYPES.PAGE, 
        message,
        debounce: 100 
      });
    } else {
      setLoading('global', false);
    }
  }, [setLoading]);

  /**
   * Wrap an async operation with loading state
   * @param {string} key - Loading operation key
   * @param {Function} operation - Async operation
   * @param {Object} options - Loading options
   * @returns {Promise} Operation result
   */
  const withLoading = useCallback(async (key, operation, options = {}) => {
    try {
      setLoading(key, true, options);
      const result = await operation();
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  /**
   * Update progress for a loading operation
   * @param {string} key - Loading operation key
   * @param {number} progress - Progress value (0-100)
   */
  const updateProgress = useCallback((key, progress) => {
    if (!mountedRef.current) return;
    
    setLoadingStates(prev => {
      if (!prev[key]) return prev;
      
      return {
        ...prev,
        [key]: {
          ...prev[key],
          progress: Math.max(0, Math.min(100, progress))
        }
      };
    });
  }, []);

  // Router loading events
  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      setRouteLoading(true);
      setGlobalLoadingState(true, 'Loading page...');
    };

    const handleRouteChangeComplete = () => {
      setRouteLoading(false);
      setGlobalLoadingState(false);
    };

    const handleRouteChangeError = () => {
      setRouteLoading(false);
      setGlobalLoadingState(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.events, setGlobalLoadingState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      Object.values(timeoutRefs.current).forEach(clearTimeout);
    };
  }, []);

  // Check if any loading is active
  const hasActiveLoading = Object.keys(loadingStates).length > 0;
  const hasApiLoading = Object.values(loadingStates).some(state => 
    state.type === LOADING_TYPES.API
  );

  const contextValue = {
    // Loading states
    loadingStates,
    globalLoading,
    routeLoading,
    hasActiveLoading,
    hasApiLoading,

    // Loading operations
    setLoading,
    isLoading,
    getLoadingState,
    clearAllLoading,
    setGlobalLoadingState,
    withLoading,
    updateProgress,

    // Loading types
    LOADING_TYPES
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}

/**
 * Hook to use loading context
 * @returns {Object} Loading context value
 * @throws {Error} When used outside LoadingProvider
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  
  return context;
}

/**
 * Custom hook for managing component loading state
 * @param {string} key - Unique key for the component
 * @returns {Object} Component loading utilities
 */
export function useComponentLoading(key) {
  const { setLoading, isLoading, getLoadingState, updateProgress, withLoading } = useLoading();
  
  return {
    loading: isLoading(key),
    loadingState: getLoadingState(key),
    setLoading: (loading, options) => setLoading(key, loading, options),
    updateProgress: (progress) => updateProgress(key, progress),
    withLoading: (operation, options) => withLoading(key, operation, options)
  };
}

export default LoadingContext;