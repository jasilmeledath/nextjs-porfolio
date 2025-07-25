/**
 * @fileoverview Authentication Service - API calls for user authentication
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import axios from 'axios';

/**
 * API Base URL
 * @constant {string} API_BASE_URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Create axios instance with default configuration
 * @constant {axios.AxiosInstance} apiClient
 */
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Authentication Service Class
 * @class AuthService
 */
class AuthService {
  constructor() {
    this.interceptors = [];
  }

  /**
   * Set up axios interceptors for token management
   * @function setupInterceptors
   * @param {Function} getToken - Function to get current token
   * @param {Function} onUnauthorized - Function to call on unauthorized
   * @returns {number} Interceptor ID
   */
  setupInterceptors(getToken, onUnauthorized) {
    // Request interceptor to add auth token
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          onUnauthorized();
        }
        return Promise.reject(error);
      }
    );

    this.interceptors.push(requestInterceptor, responseInterceptor);
    return requestInterceptor;
  }

  /**
   * Remove axios interceptors
   * @function removeInterceptors
   * @param {number} interceptorId - Interceptor ID to remove
   */
  removeInterceptors(interceptorId) {
    if (interceptorId) {
      apiClient.interceptors.request.eject(interceptorId);
    }
  }

  /**
   * Login user with email and password
   * @async
   * @function login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response
   * @throws {Error} When login fails
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      return {
        success: true,
        user: response.data.data.user,
        token: response.data.data.token,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Login error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        error: error.response?.data?.error || null,
      };
    }
  }

  /**
   * Logout current user
   * @async
   * @function logout
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    try {
      const response = await apiClient.post('/auth/logout');
      
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if logout fails on server, we consider it successful on client
      return {
        success: true,
        message: 'Logged out successfully',
      };
    }
  }

  /**
   * Verify authentication token
   * @async
   * @function verifyToken
   * @returns {Promise<Object>} User data
   * @throws {Error} When token verification fails
   */
  async verifyToken() {
    try {
      const response = await apiClient.get('/auth/verify');
      
      return response.data.data.user;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error('Token verification failed');
    }
  }

  /**
   * Refresh authentication token
   * @async
   * @function refreshToken
   * @returns {Promise<Object>} New token data
   * @throws {Error} When token refresh fails
   */
  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh');
      
      return {
        success: true,
        token: response.data.data.token,
        user: response.data.data.user,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Update user profile
   * @async
   * @function updateProfile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Update response
   */
  async updateProfile(userData) {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      
      return {
        success: true,
        user: response.data.data.user,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Profile update error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
        error: error.response?.data?.error || null,
      };
    }
  }

  /**
   * Change user password
   * @async
   * @function changePassword
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Change password response
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Password change error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Password change failed',
        error: error.response?.data?.error || null,
      };
    }
  }

  /**
   * Request password reset
   * @async
   * @function requestPasswordReset
   * @param {string} email - User email
   * @returns {Promise<Object>} Password reset response
   */
  async requestPasswordReset(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', {
        email,
      });
      
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset request failed',
        error: error.response?.data?.error || null,
      };
    }
  }

  /**
   * Reset password with token
   * @async
   * @function resetPassword
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password reset response
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
      
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Password reset error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
        error: error.response?.data?.error || null,
      };
    }
  }

  /**
   * Get user permissions
   * @async
   * @function getPermissions
   * @returns {Promise<Array>} User permissions
   */
  async getPermissions() {
    try {
      const response = await apiClient.get('/auth/permissions');
      
      return response.data.data.permissions;
    } catch (error) {
      console.error('Get permissions error:', error);
      return [];
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;