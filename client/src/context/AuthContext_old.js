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
import toast from 'react-hot-toast';

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
      const token = Cookies.get('auth_token');
      
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
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
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
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
   * @returns {Promise<Object>} Login result
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await authService.login(email, password);
      
      if (response.success) {
        setUser(response.user);
        
        // Set auth token in cookie
        Cookies.set('auth_token', response.token, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        toast.success('Login successful!');
        
        // Redirect to admin dashboard
        router.push('/admin/dashboard');
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
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
      // Call logout endpoint to invalidate server-side session
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear client-side state regardless of server response
      setUser(null);
      Cookies.remove('auth_token');
      
      toast.success('Logged out successfully');
      
      // Redirect to login page
      router.push('/admin/login');
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
      
      const response = await authService.updateProfile(userData);
      
      if (response.success) {
        setUser(response.user);
        toast.success('Profile updated successfully!');
        return { success: true };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
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
      
      const response = await authService.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        toast.success('Password changed successfully!');
        return { success: true };
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Password change failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
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
   * @function isAdmin
   * @returns {boolean} Whether user is admin
   */
  const isAdmin = () => {
    return user && (user.role === 'admin' || user.isAdmin);
  };

  // Initialize authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Set up axios interceptors for automatic token refresh
  useEffect(() => {
    if (!initialized) return;

    const requestInterceptor = authService.setupInterceptors(
      () => Cookies.get('auth_token'),
      () => logout()
    );

    return () => {
      if (requestInterceptor) {
        authService.removeInterceptors(requestInterceptor);
      }
    };
  }, [initialized]);

  const contextValue = {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    login,
    logout,
    updateProfile,
    changePassword,
    hasPermission,
    checkAuth,
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
 * @returns {Object} Auth context value
 * @throws {Error} When used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}