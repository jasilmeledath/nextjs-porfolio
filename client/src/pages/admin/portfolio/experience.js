/**
 * @fileoverview Experience Management Page
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  FiArrowLeft, 
  FiBriefcase, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSave, 
  FiX, 
  FiCheck,
  FiAlertCircle,
  FiCalendar,
  FiMapPin,
  FiExternalLink,
  FiUpload,
  FiImage
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import PortfolioManagementService from '../../../services/portfolio-management-service';

export default function ExperiencePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // State management
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    location: '',
    companyUrl: '',
    technologies: [],
    achievements: [],
    order: 0
  });
  const [errors, setErrors] = useState({});
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [newTechnology, setNewTechnology] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  // File input ref
  const logoInputRef = useRef(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  // Load experiences on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadExperiences();
    }
  }, [isAuthenticated]);

  /**
   * Load all experiences
   */
  const loadExperiences = async () => {
    try {
      setIsLoading(true);
      console.log('[ExperiencePage] Loading experiences...');
      
      const response = await PortfolioManagementService.getExperience();
      console.log('[ExperiencePage] Experiences response:', response);
      
      if (response.success) {
        setExperiences(response.message || []);
      } else {
        console.error('[ExperiencePage] Failed to load experiences:', response.message);
        showMessage('error', 'Failed to load experiences');
      }
    } catch (error) {
      console.error('[ExperiencePage] Load experiences error:', error);
      showMessage('error', 'Error loading experiences');
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
      [name]: type === 'checkbox' ? checked : 
              name === 'order' ? parseInt(value) || 0 : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handle company logo upload
   */
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      const validation = PortfolioManagementService.validateFile(
        file, 
        ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], 
        5 * 1024 * 1024 // 5MB
      );
      
      if (!validation.isValid) {
        showMessage('error', validation.error);
        return;
      }
      
      setCompanyLogo(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  /**
   * Remove company logo
   */
  const removeLogo = () => {
    setCompanyLogo(null);
    setLogoPreview(editingExperience?.companyLogo || null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  /**
   * Add technology
   */
  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  /**
   * Remove technology
   */
  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  /**
   * Add achievement
   */
  const addAchievement = () => {
    if (newAchievement.trim() && !formData.achievements.includes(newAchievement.trim())) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  /**
   * Remove achievement
   */
  const removeAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    // Validate end date if not current
    if (!formData.isCurrent && !formData.endDate) {
      newErrors.endDate = 'End date is required for past positions';
    }
    
    // Validate company URL format if provided
    if (formData.companyUrl && !formData.companyUrl.match(/^https?:\/\/.+$/)) {
      newErrors.companyUrl = 'Please enter a valid URL (http:// or https://)';
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
      showMessage('error', 'Please fix the errors above');
      return;
    }

    try {
      setIsLoading(true);
      
      let response;
      if (editingExperience) {
        console.log('[ExperiencePage] Updating experience:', editingExperience.id, formData);
        response = await PortfolioManagementService.updateExperience(
          editingExperience.id, 
          formData, 
          companyLogo
        );
      } else {
        console.log('[ExperiencePage] Creating experience:', formData);
        response = await PortfolioManagementService.createExperience(formData, companyLogo);
      }
      
      if (response.success) {
        showMessage('success', editingExperience ? 'Experience updated successfully!' : 'Experience created successfully!');
        resetForm();
        loadExperiences();
      } else {
        console.error('[ExperiencePage] Save experience error:', response);
        showMessage('error', response.message || 'Failed to save experience');
      }
    } catch (error) {
      console.error('[ExperiencePage] Submit error:', error);
      showMessage('error', 'Error saving experience');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle editing an experience
   */
  const handleEditExperience = (experience) => {
    console.log('[ExperiencePage] Edit experience button clicked', experience);
    setEditingExperience(experience);
    setFormData({
      company: experience.company || '',
      position: experience.position || '',
      description: experience.description || '',
      startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
      endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
      isCurrent: experience.isCurrent || false,
      location: experience.location || '',
      companyUrl: experience.companyUrl || '',
      technologies: experience.technologies || [],
      achievements: experience.achievements || [],
      order: experience.order || 0
    });
    
    // Set existing logo
    if (experience.companyLogo) {
      setLogoPreview(experience.companyLogo);
    }
    
    setShowForm(true);
    setErrors({});
  };

  /**
   * Handle creating a new experience
   */
  const handleNewExperience = () => {
    console.log('[ExperiencePage] New experience button clicked');
    setEditingExperience(null);
    resetForm();
    setShowForm(true);
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      location: '',
      companyUrl: '',
      technologies: [],
      achievements: [],
      order: 0
    });
    setEditingExperience(null);
    setShowForm(false);
    setErrors({});
    setCompanyLogo(null);
    setLogoPreview(null);
    setNewTechnology('');
    setNewAchievement('');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  /**
   * Handle deleting an experience
   */
  const handleDeleteExperience = async (experienceId) => {
    if (!confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await PortfolioManagementService.deleteExperience(experienceId);
      if (response.success) {
        showMessage('success', 'Experience deleted successfully');
        loadExperiences();
        if (editingExperience && editingExperience.id === experienceId) {
          resetForm();
        }
      }
    } catch (error) {
      console.error('[ExperiencePage] Delete error:', error);
      showMessage('error', 'Failed to delete experience');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const goBackToPortfolio = () => {
    router.push('/admin/portfolio');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 font-mono">Loading experience management...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Experience Management - Portfolio Management</title>
        <meta name="description" content="Manage work experience and career history" />
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
                  EXPERIENCE_MANAGEMENT
                </h1>
              </div>
              
              <button
                onClick={handleNewExperience}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-mono font-bold rounded-lg transition-all duration-300"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                NEW_EXPERIENCE
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
          {/* Experience Timeline */}
          {!showForm && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {experiences.length === 0 ? (
                <motion.div
                  variants={fadeInUp}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8 text-center"
                >
                  <FiBriefcase className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-mono font-bold text-purple-400 mb-2">
                    NO_EXPERIENCE_FOUND
                  </h3>
                  <p className="text-purple-600 font-mono text-sm mb-4">
                    No work experience added yet. Add your first experience to get started!
                  </p>
                  <button
                    onClick={handleNewExperience}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-mono font-bold rounded-lg transition-all duration-300 mx-auto"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Experience
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {experiences.map((experience, index) => (
                    <motion.div
                      key={experience.id}
                      variants={fadeInUp}
                      className="relative"
                    >
                      {/* Timeline Line */}
                      {index < experiences.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-purple-500/50 to-transparent"></div>
                      )}
                      
                      {/* Experience Card */}
                      <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 ml-12 relative">
                        {/* Timeline Dot */}
                        <div className="absolute -left-12 top-6 w-3 h-3 bg-purple-500 rounded-full border-2 border-black shadow-lg"></div>
                        
                        {/* Experience Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            {/* Company Logo */}
                            {experience.companyLogo && (
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                <Image
                                  src={experience.companyLogo}
                                  alt={`${experience.company} logo`}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                  unoptimized={experience.companyLogo.startsWith('blob:')}
                                />
                              </div>
                            )}
                            
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-mono font-bold text-purple-400">
                                  {experience.position}
                                </h3>
                                {experience.isCurrent && (
                                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-mono rounded-full">
                                    CURRENT
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center text-purple-600 font-mono text-sm mb-1">
                                {experience.companyUrl ? (
                                  <a
                                    href={experience.companyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center hover:text-purple-400 transition-colors"
                                  >
                                    {experience.company}
                                    <FiExternalLink className="w-3 h-3 ml-1" />
                                  </a>
                                ) : (
                                  <span>{experience.company}</span>
                                )}
                              </div>
                              
                              <div className="flex items-center text-purple-700 font-mono text-xs space-x-4">
                                <div className="flex items-center">
                                  <FiCalendar className="w-3 h-3 mr-1" />
                                  {formatDate(experience.startDate)} - {
                                    experience.isCurrent ? 'Present' : formatDate(experience.endDate)
                                  }
                                </div>
                                <div className="flex items-center">
                                  <FiMapPin className="w-3 h-3 mr-1" />
                                  {experience.location}
                                </div>
                                {experience.duration && (
                                  <span>({experience.duration})</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditExperience(experience)}
                              className="p-2 text-purple-600 hover:text-purple-400 transition-colors"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteExperience(experience.id)}
                              className="p-2 text-red-600 hover:text-red-400 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-purple-300 font-mono text-sm mb-4 leading-relaxed">
                          {experience.description}
                        </p>

                        {/* Technologies */}
                        {experience.technologies && experience.technologies.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-purple-400 font-mono text-xs font-bold mb-2">TECHNOLOGIES:</h4>
                            <div className="flex flex-wrap gap-2">
                              {experience.technologies.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-mono rounded-full"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Achievements */}
                        {experience.achievements && experience.achievements.length > 0 && (
                          <div>
                            <h4 className="text-purple-400 font-mono text-xs font-bold mb-2">KEY ACHIEVEMENTS:</h4>
                            <ul className="space-y-1">
                              {experience.achievements.map((achievement, achIndex) => (
                                <li
                                  key={achIndex}
                                  className="text-purple-300 font-mono text-xs flex items-start"
                                >
                                  <span className="text-purple-500 mr-2">▸</span>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Experience Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-mono font-bold text-purple-400">
                  {editingExperience ? 'EDIT_EXPERIENCE' : 'CREATE_EXPERIENCE'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 text-purple-600 hover:text-purple-400 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-purple-400 font-mono text-sm mb-2">
                      COMPANY_NAME *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-purple-300 placeholder-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 ${
                        errors.company ? 'border-red-500/50' : 'border-purple-500/30'
                      }`}
                      placeholder="Apple Inc., Google, Microsoft..."
                    />
                    {errors.company && (
                      <p className="text-red-400 text-xs font-mono mt-1">{errors.company}</p>
                    )}
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-purple-400 font-mono text-sm mb-2">
                      POSITION *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-purple-300 placeholder-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 ${
                        errors.position ? 'border-red-500/50' : 'border-purple-500/30'
                      }`}
                      placeholder="Senior Software Engineer, Product Manager..."
                    />
                    {errors.position && (
                      <p className="text-red-400 text-xs font-mono mt-1">{errors.position}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-purple-400 font-mono text-sm mb-2">
                      LOCATION *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-purple-300 placeholder-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 ${
                        errors.location ? 'border-red-500/50' : 'border-purple-500/30'
                      }`}
                      placeholder="San Francisco, CA / Remote"
                    />
                    {errors.location && (
                      <p className="text-red-400 text-xs font-mono mt-1">{errors.location}</p>
                    )}
                  </div>

                  {/* Company URL */}
                  <div>
                    <label className="block text-purple-400 font-mono text-sm mb-2">
                      COMPANY_URL
                    </label>
                    <input
                      type="url"
                      name="companyUrl"
                      value={formData.companyUrl}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-purple-300 placeholder-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 ${
                        errors.companyUrl ? 'border-red-500/50' : 'border-purple-500/30'
                      }`}
                      placeholder="https://company.com"
                    />
                    {errors.companyUrl && (
                      <p className="text-red-400 text-xs font-mono mt-1">{errors.companyUrl}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-purple-400 font-mono text-sm mb-2">
                    DESCRIPTION *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-purple-300 placeholder-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 resize-none ${
                      errors.description ? 'border-red-500/50' : 'border-purple-500/30'
                    }`}
                    placeholder="Describe your role, responsibilities, and impact..."
                  />
                  {errors.description && (
                    <p className="text-red-400 text-xs font-mono mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Dates and Current Position */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Start Date */}
                  <div>
                    <label className="block text-purple-400 font-mono text-sm mb-2">
                      START_DATE *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 ${
                        errors.startDate ? 'border-red-500/50' : 'border-purple-500/30'
                      }`}
                    />
                    {errors.startDate && (
                      <p className="text-red-400 text-xs font-mono mt-1">{errors.startDate}</p>
                    )}
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-purple-400 font-mono text-sm mb-2">
                      END_DATE {!formData.isCurrent && '*'}
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      disabled={formData.isCurrent}
                      className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 ${
                        errors.endDate ? 'border-red-500/50' : 'border-purple-500/30'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="text-red-400 text-xs font-mono mt-1">{errors.endDate}</p>
                    )}
                  </div>

                  {/* Current Position Toggle */}
                  <div className="flex items-center justify-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isCurrent"
                        checked={formData.isCurrent}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        formData.isCurrent ? 'bg-purple-500' : 'bg-gray-600'
                      }`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                          formData.isCurrent ? 'translate-x-6' : 'translate-x-0'
                        }`}></div>
                      </div>
                      <span className="ml-3 text-purple-400 font-mono text-sm">
                        CURRENT_POSITION
                      </span>
                    </label>
                  </div>
                </div>

                {/* Company Logo Upload */}
                <div>
                  <label className="block text-purple-400 font-mono text-sm mb-2">
                    COMPANY_LOGO
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center px-4 py-2 bg-gray-800 border border-purple-500/30 text-purple-400 font-mono text-sm rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FiUpload className="w-4 h-4 mr-2" />
                      Choose Logo
                    </button>
                    
                    {logoPreview && (
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800">
                          <Image
                            src={logoPreview}
                            alt="Company logo preview"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized={logoPreview.startsWith('blob:')}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="p-1 text-red-600 hover:text-red-400 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <p className="text-purple-700 font-mono text-xs mt-1">
                    Supported: JPG, PNG, WebP (max 5MB)
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-purple-400 font-mono text-sm mb-2">
                    TECHNOLOGIES
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      className="flex-1 px-4 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg font-mono text-purple-300 placeholder-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      placeholder="React, Node.js, Python..."
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="px-4 py-2 bg-purple-500/20 text-purple-400 font-mono text-sm rounded-lg hover:bg-purple-500/30 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {formData.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-mono rounded-full"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechnology(index)}
                            className="ml-2 text-purple-600 hover:text-purple-400 transition-colors"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-purple-400 font-mono text-sm mb-2">
                    KEY_ACHIEVEMENTS
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                      className="flex-1 px-4 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg font-mono text-purple-300 placeholder-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      placeholder="Improved performance by 50%, Led team of 5..."
                    />
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="px-4 py-2 bg-purple-500/20 text-purple-400 font-mono text-sm rounded-lg hover:bg-purple-500/30 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {formData.achievements.length > 0 && (
                    <div className="space-y-2">
                      {formData.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-2 p-3 bg-purple-500/10 rounded-lg"
                        >
                          <span className="text-purple-500 mt-1">▸</span>
                          <span className="flex-1 text-purple-300 font-mono text-sm">
                            {achievement}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAchievement(index)}
                            className="text-purple-600 hover:text-purple-400 transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Display Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-400 font-mono text-sm mb-2">
                      DISPLAY_ORDER
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg font-mono text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-purple-500/20">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-purple-500/30 text-purple-400 font-mono rounded-lg hover:bg-purple-500/10 transition-all duration-300"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-mono font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        SAVING...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4 mr-2" />
                        {editingExperience ? 'UPDATE_EXPERIENCE' : 'CREATE_EXPERIENCE'}
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

ExperiencePage.requireAuth = true;
