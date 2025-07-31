/**
 * @fileoverview Admin Authentication Login Page - Cyber Themed
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 2.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

/**
 * Admin Login Page Component
 * @function AdminLoginPage
 * @returns {JSX.Element} Admin login page component
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error('All security fields are required');
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Invalid user identifier format');
      }

      // Attempt login
      await login(formData.email, formData.password, rememberMe);
      
      // Success - redirect handled by useEffect
      
    } catch (err) {
      console.error('[AdminLogin] Authentication error:', err);
      setError(err.message || 'Authentication failed. Access denied.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-green-400 font-mono text-sm">INITIALIZING_SYSTEM...</p>
        </div>
      </div>
    );
  }

  // Don't render if already authenticated (redirect in progress)
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>ADMIN_CORE - Access Terminal</title>
        <meta name="description" content="Secure administrative access portal" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Main Login Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mx-4"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 border-2 border-green-400 rounded-lg bg-green-400/10 flex items-center justify-center relative">
                <span className="text-green-400 text-2xl font-mono font-bold">⚡</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl font-mono font-bold text-green-400 tracking-wider mb-2">
              ADMIN_CORE
            </h1>
            <p className="text-green-600 font-mono text-sm tracking-wide">
              SECURE_ACCESS_TERMINAL
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4 text-green-700 font-mono text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Status: OPERATIONAL</span>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl rounded-xl border border-green-500/30 shadow-2xl shadow-green-500/10 p-8"
          >
            {/* System Info Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-green-500/20">
              <div className="flex items-center space-x-3">
                <FiShield className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-mono text-sm font-medium">
                  AUTHENTICATION_REQUIRED
                </span>
              </div>
              <div className="text-green-600 font-mono text-xs">
                v2.1.0
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center space-x-3"
              >
                <FiAlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-red-400 font-mono text-sm font-medium">
                    ACCESS_DENIED
                  </p>
                  <p className="text-red-500 font-mono text-xs mt-1">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-green-400 font-mono text-sm font-medium mb-3">
                  USER_IDENTIFIER
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="w-5 h-5 text-green-600" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-green-300 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
                    placeholder="admin@system.core"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-green-400 font-mono text-sm font-medium mb-3">
                  ACCESS_KEY
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="w-5 h-5 text-green-600" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-black/40 border border-green-500/30 rounded-lg text-green-300 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
                    placeholder="••••••••••••"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-green-600 hover:text-green-400 transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-black/40 border border-green-500/30 rounded focus:ring-2 focus:ring-green-500/50 text-green-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-green-600 font-mono text-sm group-hover:text-green-400 transition-colors">
                    MAINTAIN_SESSION
                  </span>
                </label>
                <div className="text-green-700 font-mono text-xs">
                  SESSION_TIMEOUT: 7d
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black font-mono font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-green-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-3"></div>
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <>
                      <FiShield className="w-5 h-5 mr-3" />
                      <span>INITIATE_ACCESS</span>
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Footer Info */}
            <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-green-500/20">
              <div className="flex items-center justify-between text-green-700 font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>SECURE_CONNECTION</span>
                </div>
                <div>
                  UPTIME: {new Date().toLocaleTimeString()}
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-green-800 font-mono text-xs">
                  © 2025 ADMIN_CORE v2.1.0 | All systems operational
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Warning Banner */}
          <motion.div
            variants={itemVariants}
            className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <FiAlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-yellow-400 font-mono text-sm font-medium">
                  RESTRICTED_ACCESS
                </p>
                <p className="text-yellow-600 font-mono text-xs mt-1">
                  Unauthorized access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

/**
 * Disable SSR for this page to avoid hydration issues with authentication
 */
AdminLoginPage.getInitialProps = () => {
  return {};
};
