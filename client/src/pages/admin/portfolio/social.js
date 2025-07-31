/**
 * @fileoverview Social Links Management Page
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiLink, FiPlus, FiEdit3, FiTrash2, FiX, FiSave, 
  FiExternalLink, FiGithub, FiLinkedin, FiTwitter, FiInstagram,
  FiGlobe, FiCheck, FiAlertCircle, FiEye, FiEyeOff
} from 'react-icons/fi';
import { FaDribbble } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import PortfolioManagementService from '../../../services/portfolio-management-service';

// Platform configurations
const PLATFORM_CONFIG = {
  github: {
    name: 'GitHub',
    icon: FiGithub,
    color: 'from-gray-600 to-gray-700',
    placeholder: 'https://github.com/username'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: FiLinkedin,
    color: 'from-blue-600 to-blue-700',
    placeholder: 'https://linkedin.com/in/username'
  },
  twitter: {
    name: 'Twitter',
    icon: FiTwitter,
    color: 'from-sky-600 to-sky-700',
    placeholder: 'https://twitter.com/username'
  },
  instagram: {
    name: 'Instagram',
    icon: FiInstagram,
    color: 'from-pink-600 to-pink-700',
    placeholder: 'https://instagram.com/username'
  },
  website: {
    name: 'Website',
    icon: FiGlobe,
    color: 'from-purple-600 to-purple-700',
    placeholder: 'https://yourwebsite.com'
  },
  dribbble: {
    name: 'Dribbble',
    icon: FaDribbble,
    color: 'from-rose-600 to-rose-700',
    placeholder: 'https://dribbble.com/username'
  }
};

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function SocialLinksPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  
  // State management
  const [socialLinks, setSocialLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    username: '',
    isActive: true,
    order: 0
  });
  const [errors, setErrors] = useState({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  // Load social links on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadSocialLinks();
    }
  }, [isAuthenticated]);

  /**
   * Load social links from API
   */
  const loadSocialLinks = async () => {
    try {
      setIsLoading(true);
      const response = await PortfolioManagementService.getSocialLinks();
      
      // Handle different response structures
      let linksData = [];
      if (response && response.data) {
        linksData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        linksData = response;
      }
      
      setSocialLinks(linksData);
    } catch (error) {
      console.error('Failed to load social links:', error);
      showMessage('error', 'Failed to load social links');
      setSocialLinks([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Show message to user
   */
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-extract username from URL
    if (name === 'url' && value) {
      const username = extractUsernameFromUrl(value, formData.platform);
      if (username) {
        setFormData(prev => ({
          ...prev,
          username
        }));
      }
    }
    
    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Extract username from social media URL
   */
  const extractUsernameFromUrl = (url, platform) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      switch (platform) {
        case 'github':
          return path.split('/')[1] || '';
        case 'linkedin':
          const linkedinMatch = path.match(/\/in\/([^\/]+)/);
          return linkedinMatch ? linkedinMatch[1] : '';
        case 'twitter':
          return path.split('/')[1] || '';
        case 'instagram':
          return path.split('/')[1] || '';
        case 'dribbble':
          return path.split('/')[1] || '';
        case 'website':
          return urlObj.hostname.replace('www.', '');
        default:
          return '';
      }
    } catch {
      return '';
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.platform) {
      newErrors.platform = 'Platform is required';
    }
    
    if (!formData.url) {
      newErrors.url = 'URL is required';
    } else if (!/^https?:\/\/.+$/.test(formData.url)) {
      newErrors.url = 'Please enter a valid URL starting with http:// or https://';
    }
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (editingLink) {
        await PortfolioManagementService.updateSocialLink(editingLink.id, formData);
        showMessage('success', 'Social link updated successfully!');
      } else {
        await PortfolioManagementService.createSocialLink(formData);
        showMessage('success', 'Social link created successfully!');
      }
      
      await loadSocialLinks();
      resetForm();
    } catch (error) {
      console.error('Failed to save social link:', error);
      showMessage('error', error.message || 'Failed to save social link');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle new social link
   */
  const handleNewLink = () => {
    resetForm();
    setShowForm(true);
  };

  /**
   * Handle edit social link
   */
  const handleEditLink = (link) => {
    setFormData({
      platform: link.platform,
      url: link.url,
      username: link.username,
      isActive: link.isActive,
      order: link.order
    });
    setEditingLink(link);
    setShowForm(true);
  };

  /**
   * Handle delete social link
   */
  const handleDeleteLink = async (id) => {
    if (!window.confirm('Are you sure you want to delete this social link?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      await PortfolioManagementService.deleteSocialLink(id);
      showMessage('success', 'Social link deleted successfully!');
      await loadSocialLinks();
    } catch (error) {
      console.error('Failed to delete social link:', error);
      showMessage('error', 'Failed to delete social link');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({
      platform: '',
      url: '',
      username: '',
      isActive: true,
      order: 0
    });
    setEditingLink(null);
    setShowForm(false);
    setErrors({});
  };

  /**
   * Get available platforms (excluding already used ones)
   */
  const getAvailablePlatforms = () => {
    if (!Array.isArray(socialLinks)) {
      return Object.keys(PLATFORM_CONFIG);
    }
    
    const usedPlatforms = socialLinks.map(link => link.platform);
    return Object.keys(PLATFORM_CONFIG).filter(platform => 
      !usedPlatforms.includes(platform) || (editingLink && editingLink.platform === platform)
    );
  };

  /**
   * Go back to portfolio management
   */
  const goBackToPortfolio = () => {
    router.push('/admin/portfolio');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-400 font-mono">Loading social links management...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Social Links Management - Portfolio Management</title>
        <meta name="description" content="Manage social media links and online presence" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-black relative overflow-hidden">
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

        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-green-500/30 shadow-lg shadow-green-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={goBackToPortfolio}
                  className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors group"
                >
                  <FiArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="font-mono text-sm">PORTFOLIO</span>
                </button>
                <div className="w-px h-6 bg-green-500/30"></div>
                <h1 className="text-xl sm:text-2xl font-mono font-bold text-green-400 tracking-wider">
                  SOCIAL_LINKS_MANAGEMENT
                </h1>
              </div>
              
              <button
                onClick={handleNewLink}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-mono font-bold rounded-lg transition-all duration-300"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                NEW_LINK
              </button>
            </div>
          </div>
        </header>

        {/* Message Display */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg font-mono text-sm ${
              message.type === 'success' 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            <div className="flex items-center">
              {message.type === 'success' ? (
                <FiCheck className="w-4 h-4 mr-2" />
              ) : (
                <FiAlertCircle className="w-4 h-4 mr-2" />
              )}
              {message.text}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Social Links Grid */}
          {!showForm && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {!Array.isArray(socialLinks) || socialLinks.length === 0 ? (
                <motion.div
                  variants={fadeInUp}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-8 text-center"
                >
                  <FiLink className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-mono font-bold text-yellow-400 mb-2">
                    NO_SOCIAL_LINKS_FOUND
                  </h3>
                  <p className="text-yellow-600 font-mono text-sm mb-4">
                    No social links added yet. Add your first social link to get started!
                  </p>
                  <button
                    onClick={handleNewLink}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-mono font-bold rounded-lg transition-all duration-300 mx-auto"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Social Link
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {socialLinks.map((link) => {
                    const config = PLATFORM_CONFIG[link.platform];
                    const IconComponent = config?.icon || FiLink;
                    
                    return (
                      <motion.div
                        key={link.id}
                        variants={fadeInUp}
                        className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-6 hover:border-yellow-500/40 transition-all duration-300"
                      >
                        {/* Platform Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${config?.color || 'from-gray-600 to-gray-700'}`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-mono font-bold text-yellow-400">
                                {config?.name || link.platform.toUpperCase()}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <span className="text-yellow-600 font-mono text-sm">
                                  @{link.username}
                                </span>
                                {link.isActive ? (
                                  <div className="flex items-center text-green-400 text-xs">
                                    <FiEye className="w-3 h-3 mr-1" />
                                    Active
                                  </div>
                                ) : (
                                  <div className="flex items-center text-red-400 text-xs">
                                    <FiEyeOff className="w-3 h-3 mr-1" />
                                    Hidden
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-yellow-600 hover:text-yellow-400 transition-colors"
                            >
                              <FiExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleEditLink(link)}
                              className="p-2 text-yellow-600 hover:text-yellow-400 transition-colors"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLink(link.id)}
                              className="p-2 text-red-600 hover:text-red-400 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* URL Display */}
                        <div className="bg-gray-900/50 rounded-lg p-3">
                          <p className="text-yellow-300 font-mono text-sm truncate">
                            {link.url}
                          </p>
                        </div>

                        {/* Order Badge */}
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-yellow-700 font-mono text-xs">
                            Order: {link.order}
                          </span>
                          <span className="text-yellow-700 font-mono text-xs">
                            {new Date(link.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Social Link Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-mono font-bold text-yellow-400">
                  {editingLink ? 'EDIT_SOCIAL_LINK' : 'CREATE_SOCIAL_LINK'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 text-yellow-600 hover:text-yellow-400 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Platform Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-yellow-400 font-mono text-sm mb-2">
                      PLATFORM *
                    </label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-300 ${
                        errors.platform ? 'border-red-500/50' : 'border-yellow-500/30'
                      }`}
                    >
                      <option value="">Select Platform</option>
                      {getAvailablePlatforms().map(platform => (
                        <option key={platform} value={platform}>
                          {PLATFORM_CONFIG[platform].name}
                        </option>
                      ))}
                    </select>
                    {errors.platform && (
                      <p className="text-red-400 text-xs font-mono mt-1">{errors.platform}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-yellow-400 font-mono text-sm mb-2">
                      DISPLAY_ORDER
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-yellow-500/30 rounded-lg font-mono text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-300"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-yellow-400 font-mono text-sm mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-yellow-300 placeholder-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-300 ${
                      errors.url ? 'border-red-500/50' : 'border-yellow-500/30'
                    }`}
                    placeholder={formData.platform ? PLATFORM_CONFIG[formData.platform]?.placeholder : 'https://your-profile-url.com'}
                  />
                  {errors.url && (
                    <p className="text-red-400 text-xs font-mono mt-1">{errors.url}</p>
                  )}
                </div>

                {/* Username Input */}
                <div>
                  <label className="block text-yellow-400 font-mono text-sm mb-2">
                    USERNAME *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-yellow-300 placeholder-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-300 ${
                      errors.username ? 'border-red-500/50' : 'border-yellow-500/30'
                    }`}
                    placeholder="your-username"
                  />
                  {errors.username && (
                    <p className="text-red-400 text-xs font-mono mt-1">{errors.username}</p>
                  )}
                  <p className="text-yellow-700 font-mono text-xs mt-1">
                    Username will be auto-extracted from URL if left empty
                  </p>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
                  <div>
                    <label className="text-yellow-400 font-mono text-sm font-bold">
                      VISIBILITY
                    </label>
                    <p className="text-yellow-600 font-mono text-xs">
                      Show this social link on your portfolio
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      formData.isActive ? 'bg-yellow-500' : 'bg-gray-600'
                    }`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        formData.isActive ? 'translate-x-6' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-yellow-500/20">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-yellow-500/30 text-yellow-400 font-mono rounded-lg hover:bg-yellow-500/10 transition-all duration-300"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-mono font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        SAVING...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4 mr-2" />
                        {editingLink ? 'UPDATE_LINK' : 'CREATE_LINK'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
}

SocialLinksPage.requireAuth = true;
