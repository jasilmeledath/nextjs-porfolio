/**
 * API Configuration Utilities
 * Handles dynamic API URL resolution for different environments
 */

/**
 * Get the appropriate API base URL based on the current environment
 * @returns {string} The API base URL
 */
export const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    
    // If accessing via Cloudflare tunnel, use relative API calls
    if (currentOrigin.includes('.trycloudflare.com')) {
      // For Cloudflare tunnels, we need to proxy API calls through the same tunnel
      // This assumes you'll set up a proxy in next.config.js
      return `${currentOrigin}/api/proxy`;
    }
    
    // For other tunnels (ngrok, localtunnel, etc.)
    if (currentOrigin.includes('.ngrok.io') || 
        currentOrigin.includes('.loca.lt') ||
        currentOrigin.includes('.netlify.app') ||
        currentOrigin.includes('.vercel.app')) {
      return `${currentOrigin}/api/proxy`;
    }
  }
  
  // Default to environment variable or localhost
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return baseUrl.includes('/api/v1') ? baseUrl : `${baseUrl}/api/v1`;
};

/**
 * Get the server base URL for file uploads and static assets
 * @returns {string} The server base URL
 */
export const getServerBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    
    // For tunnels, use the proxy route
    if (currentOrigin.includes('.trycloudflare.com') ||
        currentOrigin.includes('.ngrok.io') ||
        currentOrigin.includes('.loca.lt')) {
      return `${currentOrigin}/api`;
    }
  }
  
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';
};

/**
 * Check if we're running in a tunneled environment
 * @returns {boolean} True if running through a tunnel
 */
export const isTunneledEnvironment = () => {
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    return currentOrigin.includes('.trycloudflare.com') ||
           currentOrigin.includes('.ngrok.io') ||
           currentOrigin.includes('.loca.lt');
  }
  return false;
};
