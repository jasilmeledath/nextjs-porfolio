/**
 * @fileoverview Theme Context Provider for Dark/Light Mode Management
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme Context
 * @type {React.Context}
 */
const ThemeContext = createContext();

/**
 * Theme types
 * @constant {Object} THEMES
 */
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

/**
 * Theme Provider Component
 * @function ThemeProvider
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Theme provider
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(THEMES.SYSTEM);
  const [resolvedTheme, setResolvedTheme] = useState(THEMES.LIGHT);
  const [mounted, setMounted] = useState(false);

  /**
   * Updates the document class and localStorage
   * @function updateTheme
   * @param {string} newTheme - New theme value
   */
  const updateTheme = (newTheme) => {
    const root = document.documentElement;
    const isDark = newTheme === THEMES.DARK || 
      (newTheme === THEMES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.toggle('dark', isDark);
    setResolvedTheme(isDark ? THEMES.DARK : THEMES.LIGHT);
    
    if (newTheme === THEMES.SYSTEM) {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', newTheme);
    }
  };

  /**
   * Changes the theme
   * @function changeTheme
   * @param {string} newTheme - New theme to apply
   */
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    updateTheme(newTheme);
  };

  /**
   * Toggles between light and dark themes
   * @function toggleTheme
   */
  const toggleTheme = () => {
    const newTheme = resolvedTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    changeTheme(newTheme);
  };

  /**
   * Gets the system preference
   * @function getSystemTheme
   * @returns {string} System theme preference
   */
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
    }
    return THEMES.LIGHT;
  };

  // Initialize theme on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const initialTheme = savedTheme || THEMES.SYSTEM;
      
      setTheme(initialTheme);
      updateTheme(initialTheme);
      setMounted(true);
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      setTheme(THEMES.SYSTEM);
      updateTheme(THEMES.SYSTEM);
      setMounted(true);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (theme === THEMES.SYSTEM) {
        setResolvedTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  const contextValue = {
    theme,
    resolvedTheme,
    mounted,
    changeTheme,
    toggleTheme,
    getSystemTheme,
    themes: THEMES,
    isDark: resolvedTheme === THEMES.DARK,
    isLight: resolvedTheme === THEMES.LIGHT,
    isSystem: theme === THEMES.SYSTEM,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 * @function useTheme
 * @returns {Object} Theme context value
 * @throws {Error} When used outside ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

export { THEMES };