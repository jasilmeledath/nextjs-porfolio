/**
 * @fileoverview Error Boundary Component for Production Stability
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @version 1.0.0
 * @description Catches JavaScript errors anywhere in the component tree and prevents app crashes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw, FiHome, FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

/**
 * Error Boundary Class Component
 * @class ErrorBoundary
 * @extends {React.Component}
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  /**
   * Static method to update state when an error occurs
   * @param {Error} error - The error that was thrown
   * @returns {Object} New state object
   */
  static getDerivedStateFromError(error) {
    // Update state to show error UI
    return {
      hasError: true,
      errorId: Date.now() + Math.random()
    };
  }

  /**
   * Lifecycle method called when error is caught
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Information about where the error was thrown
   */
  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', {
      error: error,
      errorInfo: errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Server'
    });

    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Report to error tracking service (if available)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  /**
   * Reset error boundary state
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  }

  /**
   * Reload the current page
   */
  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  /**
   * Navigate to home page
   */
  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onReset={this.handleReset}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
          fallbackComponent={this.props.fallback}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Error Display Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Error display UI
 */
const ErrorDisplay = ({ 
  error, 
  errorInfo, 
  errorId, 
  onReset, 
  onReload, 
  onGoHome,
  fallbackComponent 
}) => {
  const { isDark } = useTheme();

  // If a custom fallback component is provided, use it
  if (fallbackComponent) {
    if (typeof fallbackComponent === 'function') {
      return fallbackComponent({ error, errorInfo, onReset, onReload, onGoHome });
    }
    return fallbackComponent;
  }

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-md w-full text-center p-8 rounded-2xl border ${
          isDark 
            ? 'bg-red-500/10 border-red-500/20' 
            : 'bg-red-50 border-red-200'
        }`}
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isDark ? 'bg-red-500/20' : 'bg-red-100'
          }`}
        >
          <FiAlertTriangle className={`w-8 h-8 ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`} />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-8"
        >
          <h2 className={`text-xl font-bold ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`}>
            Something went wrong
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage.
          </p>

          {/* Development Error Details */}
          {isDevelopment && error && (
            <details className={`mt-4 p-4 rounded-lg text-left text-xs ${
              isDark ? 'bg-black/50 text-gray-300' : 'bg-white text-gray-700'
            }`}>
              <summary className="cursor-pointer font-medium mb-2">
                Technical Details (Development Mode)
              </summary>
              <div className="space-y-2">
                <div>
                  <strong>Error:</strong> {error.toString()}
                </div>
                {errorInfo && errorInfo.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs mt-1 opacity-75">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
                <div className="opacity-50">
                  <strong>Error ID:</strong> {errorId}
                </div>
              </div>
            </details>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={onReset}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <button
            onClick={onReload}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <button
            onClick={onGoHome}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <FiHome className="w-4 h-4" />
            <span>Go Home</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

/**
 * Hook for using Error Boundary in functional components
 * @returns {Function} Error boundary wrapper function
 */
export const useErrorBoundary = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

/**
 * Higher-Order Component for wrapping components with error boundary
 * @param {React.Component} Component - Component to wrap
 * @param {Object} errorBoundaryProps - Props for error boundary
 * @returns {React.Component} Wrapped component
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

ErrorBoundary.displayName = 'ErrorBoundary';

export default ErrorBoundary;