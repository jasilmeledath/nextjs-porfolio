/**
 * @fileoverview Personal Information Form Component
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFileText, 
  FiUpload, 
  FiCamera, 
  FiX,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';
import PortfolioManagementService from '../../services/portfolio-management-service';
import { FormFooter } from './common';

/**
 * Personal Information Form Component
 * @function PersonalInfoForm
 * @returns {JSX.Element} Personal info form component
 */
export default function PersonalInfoForm() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    description: ''
  });

  // File states
  const [avatar, setAvatar] = useState(null);
  const [resume, setResume] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [existingAvatar, setExistingAvatar] = useState(null);
  const [existingResume, setExistingResume] = useState(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  // Refs
  const avatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Load existing data on component mount
  useEffect(() => {
    loadPersonalInfo();
  }, []);

  /**
   * Load existing personal information
   */
  const loadPersonalInfo = async () => {
    try {
      setLoading(true);
      console.log('[PersonalInfoForm] Loading personal information...');
      
      const response = await PortfolioManagementService.getPersonalInfo();
      console.log('[PersonalInfoForm] Personal info response:', response);
      
      if (response.success) {
        // Check if we have actual data (not just a success message)
        if (response.data && typeof response.data === 'object') {
          const data = response.data;
          console.log('[PersonalInfoForm] Setting form data from response:', data);
          
          // Update form data with existing values
          setFormData({
            name: data.name || '',
            title: data.title || '',
            location: data.location || '',
            email: data.email || '',
            phone: data.phone || '',
            description: data.description || ''
          });
          
          // Set avatar if available
          if (data.avatar) {
            console.log('[PersonalInfoForm] Setting existing avatar:', data.avatar);
            setExistingAvatar(data.avatar);
            setAvatarPreview(data.avatar);
          }
          
          // Set resume if available
          if (data.resumeUrl) {
            console.log('[PersonalInfoForm] Setting existing resume:', data.resumeUrl);
            setExistingResume(data.resumeUrl);
          }
          
          showMessage('success', 'Personal information loaded successfully');
        } else {
          console.log('[PersonalInfoForm] No existing personal information found');
          showMessage('info', 'No existing personal information found. Please fill in your details.');
        }
      } else {
        console.warn('[PersonalInfoForm] Failed to load personal information:', response);
        showMessage('error', 'Failed to load personal information');
      }
    } catch (error) {
      console.error('[PersonalInfoForm] Load error:', error);
      showMessage('error', 'Failed to load personal information: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

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
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handle avatar file selection
   * @param {Event} e - File input change event
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

    setAvatar(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle resume file selection
   * @param {Event} e - File input change event
   */
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = PortfolioManagementService.validateFile(
      file, 
      ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], 
      10 * 1024 * 1024 // 10MB
    );

    if (!validation.isValid) {
      showMessage('error', validation.error);
      return;
    }

    setResume(file);
    showMessage('success', `Resume selected: ${file.name}`);
  };

  /**
   * Remove avatar
   */
  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(existingAvatar);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  /**
   * Remove resume
   */
  const removeResume = () => {
    setResume(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
    showMessage('success', 'Resume removed');
  };

  /**
   * Validate form data
   * @returns {boolean} Is form valid
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission - Called from FormFooter component
   */
  const handleSubmit = async () => {
    console.log('[PersonalInfoForm] Save function called from FormFooter');
    
    // Safety check - prevent multiple submissions
    if (saving) {
      console.log('[PersonalInfoForm] Submission already in progress, ignoring');
      return;
    }
    
    // Set saving state immediately to prevent double-clicks
    setSaving(true);
    
    // Validate form
    const isValid = validateForm();
    console.log('[PersonalInfoForm] Validation result:', { isValid, errors });
    
    if (!isValid) {
      showMessage('error', 'Please fill in all required fields and fix any errors');
      // Scroll to first error field
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      setSaving(false);
      return;
    }

    try {
      console.log('[PersonalInfoForm] Processing submission...');
      
      // Always simulate a delay in development mode for better UX testing
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Make the API call
      console.log('[PersonalInfoForm] Making API call to save personal information');
      const response = await PortfolioManagementService.upsertPersonalInfo(
        formData,
        avatar,
        resume
      );

      console.log('[PersonalInfoForm] Response received:', response);

      // Process successful response
      if (response && response.success) {
        showMessage('success', 'Personal information saved successfully!');
        
        // Update existing data
        if (response.data && response.data.avatar) {
          setExistingAvatar(response.data.avatar);
        }
        if (response.data && response.data.resumeUrl) {
          setExistingResume(response.data.resumeUrl);
        }
        
        // Clear file inputs
        setAvatar(null);
        setResume(null);
        if (avatarInputRef.current) avatarInputRef.current.value = '';
        if (resumeInputRef.current) resumeInputRef.current.value = '';
      } else {
        // Handle error response
        const errorMsg = (response && response.message) ? response.message : 'Failed to save personal information';
        showMessage('error', errorMsg);
        console.error('[PersonalInfoForm] API returned error:', errorMsg);
      }
    } catch (error) {
      // Handle exceptions
      console.error('[PersonalInfoForm] Exception during save:', error);
      showMessage('error', error.message || 'An unexpected error occurred while saving');
    } finally {
      // Always reset saving state
      setSaving(false);
    }
  };

  /**
   * Show message to user
   * @param {string} type - Message type (success, error, info)
   * @param {string} text - Message text
   */
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        <span className="ml-3 text-green-400 font-mono">Loading personal information...</span>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="mb-8">
        <h2 className="text-2xl font-mono font-bold text-green-400 mb-2">
          Personal Information
        </h2>
        <p className="text-green-600 font-mono text-sm">
          Manage your personal details and professional information
        </p>
      </motion.div>

      {/* Message Display */}
      {message.text && (
        <motion.div
          variants={fadeInUp}
          className={`mb-6 p-4 rounded-lg border flex items-center ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : message.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
          }`}
        >
          {message.type === 'success' && <FiCheck className="w-5 h-5 mr-3" />}
          {message.type === 'error' && <FiAlertCircle className="w-5 h-5 mr-3" />}
          <span className="font-mono text-sm">{message.text}</span>
        </motion.div>
      )}

      <form 
        onSubmit={(e) => e.preventDefault()} 
        className="space-y-8"
      >
        {/* Avatar Upload Section */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-green-400 mb-4 flex items-center">
            <FiCamera className="w-5 h-5 mr-3" />
            Profile Photo
          </h3>
          
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar Preview */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-green-500/30 overflow-hidden bg-gray-800">
                {avatarPreview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      fill
                      sizes="96px"
                      style={{ objectFit: 'cover' }}
                      unoptimized={avatarPreview.startsWith('blob:')}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiUser className="w-8 h-8 text-green-600" />
                  </div>
                )}
              </div>
              {avatar && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <FiX className="w-3 h-3" />
                </button>
              )}
            </div>
            
            {/* Upload Controls */}
            <div className="flex-1">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="flex items-center px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg text-green-300 font-mono text-sm transition-all duration-300"
              >
                <FiUpload className="w-4 h-4 mr-2" />
                {avatar ? 'Change Photo' : 'Upload Photo'}
              </button>
              <p className="text-green-700 font-mono text-xs mt-2">
                JPG, PNG, or WebP. Max 5MB.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-green-400 mb-6 flex items-center">
            <FiUser className="w-5 h-5 mr-3" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                  errors.name ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.name}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Professional Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                  errors.title ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                }`}
                placeholder="e.g., Full Stack Developer"
              />
              {errors.title && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.title}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Location *
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                    errors.location ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                  }`}
                  placeholder="City, Country"
                />
              </div>
              {errors.location && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.location}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                    errors.email ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                    errors.phone ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-green-400 mb-4 flex items-center">
            <FiFileText className="w-5 h-5 mr-3" />
            Professional Description
          </h3>
          
          <div>
            <label className="block text-sm font-mono font-medium text-green-300 mb-2">
              About Yourself *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 resize-none ${
                errors.description ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
              }`}
              placeholder="Write a brief description about yourself, your skills, and your professional experience..."
            />
            <div className="flex justify-between items-center mt-2">
              {errors.description && (
                <p className="text-red-400 text-xs font-mono">{errors.description}</p>
              )}
              <div className="text-green-700 font-mono text-xs ml-auto">
                {formData.description.length}/2000
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resume Upload */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-green-400 mb-4 flex items-center">
            <FiFileText className="w-5 h-5 mr-3" />
            Resume/CV
          </h3>
          
          <div className="space-y-4">
            {/* Current Resume */}
            {existingResume && (
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center">
                  <FiFileText className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-green-300 font-mono text-sm">Current Resume</span>
                </div>
                <a
                  href={existingResume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 font-mono text-sm underline"
                >
                  View
                </a>
              </div>
            )}
            
            {/* Upload New Resume */}
            <div className="flex items-center space-x-4">
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className="flex items-center px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg text-green-300 font-mono text-sm transition-all duration-300"
              >
                <FiUpload className="w-4 h-4 mr-2" />
                {resume ? 'Change Resume' : existingResume ? 'Update Resume' : 'Upload Resume'}
              </button>
              
              {resume && (
                <div className="flex items-center space-x-2">
                  <span className="text-green-300 font-mono text-sm">{resume.name}</span>
                  <button
                    type="button"
                    onClick={removeResume}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-green-700 font-mono text-xs">
              PDF, DOC, or DOCX format. Max 10MB.
            </p>
          </div>
        </motion.div>

        {/* Form Footer with Save Button */}
        <FormFooter 
          onSave={() => {
            console.log('[PersonalInfoForm] FormFooter onSave prop called');
            console.log('[PersonalInfoForm] handleSubmit function:', typeof handleSubmit, handleSubmit);
            handleSubmit();
          }} 
          saving={saving} 
          buttonText="Save Information"
        />

      </form>
    </motion.div>
  );
}
