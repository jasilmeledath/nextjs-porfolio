/**
 * @fileoverview Enhanced Image Component with Error Handling
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-08-05
 * @version 1.0.0
 */

import { useState, useCallback } from 'react';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';

/**
 * Enhanced Image Component with Fallback Support
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - CSS classes
 * @param {string} props.fallbackSrc - Fallback image URL
 * @param {boolean} props.showErrorState - Show error state instead of fallback
 * @param {Function} props.onError - Error callback
 * @param {Function} props.onLoad - Load callback
 * @returns {JSX.Element} Enhanced image component
 */
export default function EnhancedImage({
  src,
  alt = '',
  className = '',
  fallbackSrc = '/placeholder.svg',
  showErrorState = false,
  onError,
  onLoad,
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = useCallback((e) => {
    setImageError(true);
    setIsLoading(false);
    if (onError) {
      onError(e);
    }
  }, [onError]);

  const handleImageLoad = useCallback((e) => {
    setIsLoading(false);
    if (onLoad) {
      onLoad(e);
    }
  }, [onLoad]);

  // Check if the source is a known broken URL
  const isBrokenUrl = src && (
    src.includes('railway.app/uploads/') || 
    src.includes('herokuapp.com/uploads/') ||
    src.includes('404') ||
    !src.trim()
  );

  // If we know the URL is broken, show placeholder immediately
  if (isBrokenUrl || imageError) {
    if (showErrorState) {
      return (
        <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
          <div className="text-center p-4">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Image unavailable</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <div className="text-center p-4">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
        {...props}
      />
    </div>
  );
}
