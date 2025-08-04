/**
 * @fileoverview Authentication Context Provider for Admin Panel
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

/**
 * Authentication Context
 * @type {React.Context}
 */
const AuthContext = createContext();

/**
 * Authentication Provider Component
 * @function AuthProvider
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Auth provider
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  /**
   * API base URL
   */
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  /**
   * Checks if user is authenticated on app initialization
   * @async
   * @function checkAuth
   */
  const checkAuth = async () => {
    try {
      let token = Cookies.get('auth_token');
      
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      // For development, set the admin token and then verify it normally
      if (process.env.NODE_ENV === 'development' && !token) {
        // Set the real admin token for development
        const devToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzgwZjkzMTRlOThhMmM5Yjk1YWE3IiwiZW1haWwiOiJqYXNpbG1lbGVkYXRoQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbInBvcnRmb2xpbzpyZWFkIiwicG9ydGZvbGlvOndyaXRlIiwiYmxvZzpyZWFkIiwiYmxvZzp3cml0ZSIsImJsb2c6ZGVsZXRlIiwiY29tbWVudHM6bW9kZXJhdGUiLCJtZWRpYTp1cGxvYWQiLCJtZWRpYTpkZWxldGUiLCJhbmFseXRpY3M6dmlldyIsInNldHRpbmdzOm1hbmFnZSIsInVzZXJzOm1hbmFnZSJdLCJpYXQiOjE3NTM1NDI0NDUsImV4cCI6MTc1NjEzNDQ0NSwiYXVkIjoicG9ydGZvbGlvLWZyb250ZW5kIiwiaXNzIjoicG9ydGZvbGlvLWFwaSJ9.xDHDfDwnHQ9JYgCHrpSXzps1aFXNHo6IkS7aoOPV5ZE';
        
        Cookies.set('auth_token', devToken, {
          expires: 7,
          secure: false,
          sameSite: 'strict'
        });
        
        token = devToken;
      }

      // Verify token with backend
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          ...data.data.user,
          isAdmin: data.data.user.role === 'admin'
        });
      } else {
        // Token is invalid, remove it
        Cookies.remove('auth_token');
        setUser(null);
      }
    } catch (error) {
      console.error('[Auth] Token verification failed:', error);
      Cookies.remove('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  /**
   * Logs in a user
   * @async
   * @function login
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to remember the user
   * @returns {Promise<Object>} Login result
   */
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      
      // For development, allow admin@portfolio.com with any password
      if (process.env.NODE_ENV === 'development' && email === 'admin@portfolio.com') {
        const mockUser = {
          id: 1,
          email: 'admin@portfolio.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isAdmin: true,
          permissions: ['portfolio:write', 'blog:write', 'blog:delete', 'comments:moderate', 'media:upload', 'analytics:view', 'settings:manage']
        };
        
        setUser(mockUser);
        
        // Set mock auth token
        Cookies.set('auth_token', 'mock-admin-token', {
          expires: rememberMe ? 30 : 7,
          secure: false,
          sameSite: 'strict'
        });
        
        return { success: true, user: mockUser };
      }
      
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const userData = {
          ...data.data.user,
          isAdmin: data.data.user.role === 'admin'
        };
        
        setUser(userData);
        
        // Set auth token in cookie
        Cookies.set('auth_token', data.data.token, {
          expires: rememberMe ? 30 : 7, // 30 days if remember me, otherwise 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        return { success: true, user: userData };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('[Auth] Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out the current user
   * @async
   * @function logout
   */
  const logout = async () => {
    try {
      const token = Cookies.get('auth_token');
      
      if (token && process.env.NODE_ENV !== 'development') {
        // Call logout endpoint to invalidate server-side session
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('[Auth] Logout error:', error);
    } finally {
      // Clear client-side state regardless of server response
      setUser(null);
      Cookies.remove('auth_token');
    }
  };

  /**
   * Updates user profile data
   * @async
   * @function updateProfile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Update result
   */
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const token = Cookies.get('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setUser({
          ...data.data.user,
          isAdmin: data.data.user.role === 'admin'
        });
        return { success: true };
      } else {
        throw new Error(data.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('[Auth] Profile update failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Changes user password
   * @async
   * @function changePassword
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Change result
   */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      const token = Cookies.get('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        return { success: true };
      } else {
        throw new Error(data.message || 'Password change failed');
      }
    } catch (error) {
      console.error('[Auth] Password change failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Checks if user has required permissions
   * @function hasPermission
   * @param {string|Array} permission - Permission(s) to check
   * @returns {boolean} Whether user has permission
   */
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    
    if (Array.isArray(permission)) {
      return permission.some(p => user.permissions.includes(p));
    }
    
    return user.permissions.includes(permission);
  };

  /**
   * Checks if user is admin
   * @function isAdminUser
   * @returns {boolean} Whether user is admin
   */
  const isAdminUser = () => {
    return user && (user.role === 'admin' || user.isAdmin);
  };

  // Initialize authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const contextValue = {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
    isAdmin: isAdminUser(),
    login,
    logout,
    updateProfile,
    changePassword,
    hasPermission,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 * @function useAuth
 * @returns {Object} Authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
