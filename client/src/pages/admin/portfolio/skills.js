/**
 * @fileoverview Skills Management Page
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiPlus, 
  FiCode, 
  FiTrash2, 
  FiEdit3, 
  FiSave, 
  FiX, 
  FiCheck,
  FiAlertCircle,
  FiSliders,
  FiBookOpen,
  FiMonitor,
  FiServer,
  FiTool,
  FiPenTool,
  FiMoreHorizontal
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import PortfolioManagementService from '../../../services/portfolio-management-service';
import IconPicker from '../../../components/ui/IconPicker';

export default function SkillsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // State management
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    level: 80,
    icon: '⚛️',
    logoIdentifier: '',
    logoLibrary: 'react-icons/si',
    category: 'frontend',
    yearsOfExperience: 1,
    isActive: true,
    order: 0
  });
  const [errors, setErrors] = useState({});

  // Categories and icons
  const categories = [
    { value: 'all', label: 'All Skills', icon: FiSliders },
    { value: 'frontend', label: 'Frontend', icon: FiMonitor },
    { value: 'backend', label: 'Backend', icon: FiServer },
    { value: 'tools', label: 'Tools', icon: FiTool },
    { value: 'design', label: 'Design', icon: FiPenTool },
    { value: 'other', label: 'Other', icon: FiMoreHorizontal }
  ];

  const commonIcons = [
    '⚛️', '🅰️', '🔷', '💚', '🐍', '☕', '🚀', '🔥', '⚡', '🎨',
    '🛠️', '📱', '💻', '🌐', '📊', '🗃️', '🔒', '🧪', '📈', '🎯'
  ];

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

  // Load skills on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadSkills();
    }
  }, [isAuthenticated]);

  /**
   * Load all skills
   */
  const loadSkills = async () => {
    try {
      setIsLoading(true);
      console.log('[SkillsPage] Loading skills...');
      
      const response = await PortfolioManagementService.getSkills();
      console.log('[SkillsPage] Skills response:', response);
      
      if (response.success) {
        const skillsData = response.message || [];
        console.log('[SkillsPage] Skills data received:', skillsData);
        
        // Log icon fields for each skill
        skillsData.forEach((skill, index) => {
          console.log(`[SkillsPage] Skill ${index + 1} (${skill.name}):`, {
            icon: skill.icon,
            logoIdentifier: skill.logoIdentifier,
            logoLibrary: skill.logoLibrary
          });
        });
        
        setSkills(skillsData);
      } else {
        console.error('[SkillsPage] Failed to load skills:', response.message);
        showMessage('error', 'Failed to load skills');
      }
    } catch (error) {
      console.error('[SkillsPage] Load skills error:', error);
      showMessage('error', 'Error loading skills');
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
              name === 'level' || name === 'yearsOfExperience' || name === 'order' ? 
              parseInt(value) || 0 : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Skill name is required';
    if (formData.level < 0 || formData.level > 100) newErrors.level = 'Level must be between 0-100';
    if (!formData.icon.trim()) newErrors.icon = 'Icon is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.yearsOfExperience < 0) newErrors.yearsOfExperience = 'Years cannot be negative';
    
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
      
      // Log the form data being submitted
      console.log('[SkillsPage] Form data being submitted:', formData);
      console.log('[SkillsPage] Icon fields:', {
        icon: formData.icon,
        logoIdentifier: formData.logoIdentifier,
        logoLibrary: formData.logoLibrary
      });
      
      let response;
      if (editingSkill) {
        console.log('[SkillsPage] Updating skill:', editingSkill.id, formData);
        response = await PortfolioManagementService.updateSkill(editingSkill.id, formData);
      } else {
        console.log('[SkillsPage] Creating skill:', formData);
        response = await PortfolioManagementService.createSkill(formData);
      }
      
      console.log('[SkillsPage] Server response:', response);
      
      if (response.success) {
        showMessage('success', editingSkill ? 'Skill updated successfully!' : 'Skill created successfully!');
        resetForm();
        loadSkills();
      } else {
        console.error('[SkillsPage] Save skill error:', response);
        showMessage('error', response.message || 'Failed to save skill');
      }
    } catch (error) {
      console.error('[SkillsPage] Submit error:', error);
      showMessage('error', 'Error saving skill');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle editing a skill
   */
  const handleEditSkill = (skill) => {
    console.log('[SkillsPage] Edit skill button clicked', skill);
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      level: skill.level || 80,
      icon: skill.icon || '⚛️',
      logoIdentifier: skill.logoIdentifier || '',
      logoLibrary: skill.logoLibrary || 'react-icons/si',
      category: skill.category || 'frontend',
      yearsOfExperience: skill.yearsOfExperience || 1,
      isActive: skill.isActive !== undefined ? skill.isActive : true,
      order: skill.order || 0
    });
    setShowForm(true);
    setErrors({});
  };

  /**
   * Handle creating a new skill
   */
  const handleNewSkill = () => {
    console.log('[SkillsPage] New skill button clicked');
    setEditingSkill(null);
    resetForm();
    setShowForm(true);
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      name: '',
      level: 80,
      icon: '⚛️',
      logoIdentifier: '',
      logoLibrary: 'react-icons/si',
      category: 'frontend',
      yearsOfExperience: 1,
      isActive: true,
      order: 0
    });
    setEditingSkill(null);
    setShowForm(false);
    setErrors({});
    setShowIconPicker(false);
  };

  /**
   * Handle icon selection from icon picker
   */
  const handleIconSelect = (iconData) => {
    console.log('[SkillsPage] Icon selected:', iconData);
    setFormData(prev => ({
      ...prev,
      logoIdentifier: iconData.logoIdentifier,
      logoLibrary: iconData.logoLibrary,
      // Keep the existing emoji icon as fallback, don't replace it
      icon: prev.icon || '⚛️'
    }));
    setShowIconPicker(false);
  };

  /**
   * Get icon component for display
   */
  const getIconComponent = (logoLibrary, logoIdentifier) => {
    if (!logoLibrary || !logoIdentifier) return null;
    
    try {
      switch (logoLibrary) {
        case 'react-icons/si':
          return require('react-icons/si')[logoIdentifier];
        case 'react-icons/fa':
          return require('react-icons/fa')[logoIdentifier];
        case 'react-icons/di':
          return require('react-icons/di')[logoIdentifier];
        case 'react-icons/bs':
          return require('react-icons/bs')[logoIdentifier];
        case 'react-icons/ai':
          return require('react-icons/ai')[logoIdentifier];
        default:
          return null;
      }
    } catch (error) {
      return null;
    }
  };

  /**
   * Handle deleting a skill
   */
  const handleDeleteSkill = async (skillId) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await PortfolioManagementService.deleteSkill(skillId);
      if (response.success) {
        showMessage('success', 'Skill deleted successfully');
        loadSkills();
        if (editingSkill && editingSkill.id === skillId) {
          resetForm();
        }
      }
    } catch (error) {
      console.error('[SkillsPage] Delete error:', error);
      showMessage('error', 'Failed to delete skill');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filter skills by category
   */
  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  /**
   * Get category icon
   */
  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : FiCode;
  };

  const goBackToPortfolio = () => {
    router.push('/admin/portfolio');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 font-mono">Loading skills management...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Skills Management - Portfolio Management</title>
        <meta name="description" content="Manage technical skills and expertise" />
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
                  SKILLS_MANAGEMENT
                </h1>
              </div>
              
              <button
                onClick={handleNewSkill}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-mono font-bold rounded-lg transition-all duration-300"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                NEW_SKILL
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6">
                <h3 className="text-lg font-mono font-bold text-green-400 mb-4">CATEGORIES</h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    const skillCount = category.value === 'all' 
                      ? skills.length 
                      : skills.filter(s => s.category === category.value).length;
                    
                    return (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
                          selectedCategory === category.value
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'text-green-600 hover:text-green-400 hover:bg-green-500/10'
                        }`}
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-4 h-4 mr-2" />
                          {category.label}
                        </div>
                        <span className="text-xs opacity-70">({skillCount})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Skills Grid */}
              {!showForm && (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {filteredSkills.length === 0 ? (
                    <motion.div
                      variants={fadeInUp}
                      className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-8 text-center"
                    >
                      <FiCode className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-mono font-bold text-green-400 mb-2">
                        NO_SKILLS_FOUND
                      </h3>
                      <p className="text-green-600 font-mono text-sm mb-4">
                        {selectedCategory === 'all' 
                          ? 'No skills created yet. Add your first skill to get started!'
                          : `No skills found in ${selectedCategory} category.`
                        }
                      </p>
                      <button
                        onClick={handleNewSkill}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-mono font-bold rounded-lg transition-all duration-300 mx-auto"
                      >
                        <FiPlus className="w-4 h-4 mr-2" />
                        Create Skill
                      </button>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredSkills.map((skill) => (
                        <motion.div
                          key={skill.id}
                          variants={fadeInUp}
                          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300"
                        >
                          {/* Skill Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{skill.icon}</span>
                              <div>
                                <h3 className="text-lg font-mono font-bold text-green-400">
                                  {skill.name}
                                </h3>
                                <div className="flex items-center text-green-600 font-mono text-xs">
                                  {React.createElement(getCategoryIcon(skill.category), { className: "w-3 h-3 mr-1" })}
                                  {skill.category.toUpperCase()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditSkill(skill)}
                                className="p-2 text-green-600 hover:text-green-400 transition-colors"
                              >
                                <FiEdit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="p-2 text-red-600 hover:text-red-400 transition-colors"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Proficiency Level */}
                          <div className="mb-3">
                            <div className="flex justify-between text-green-600 font-mono text-xs mb-1">
                              <span>PROFICIENCY</span>
                              <span>{skill.level}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Experience & Status */}
                          <div className="flex justify-between items-center text-green-600 font-mono text-xs">
                            <span>{skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} exp</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              skill.isActive 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {skill.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Skill Form */}
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-mono font-bold text-green-400">
                      {editingSkill ? 'EDIT_SKILL' : 'CREATE_SKILL'}
                    </h3>
                    <button
                      onClick={resetForm}
                      className="p-2 text-green-600 hover:text-green-400 transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Skill Name */}
                      <div>
                        <label className="block text-green-400 font-mono text-sm mb-2">
                          SKILL_NAME
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-green-300 placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                            errors.name ? 'border-red-500/50' : 'border-green-500/30'
                          }`}
                          placeholder="React, Node.js, Python..."
                        />
                        {errors.name && (
                          <p className="text-red-400 text-xs font-mono mt-1">{errors.name}</p>
                        )}
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-green-400 font-mono text-sm mb-2">
                          CATEGORY
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                            errors.category ? 'border-red-500/50' : 'border-green-500/30'
                          }`}
                        >
                          {categories.slice(1).map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="text-red-400 text-xs font-mono mt-1">{errors.category}</p>
                        )}
                      </div>

                      {/* Enhanced Icon Selection */}
                      <div>
                        <label className="block text-green-400 font-mono text-sm mb-2">
                          SKILL_LOGO
                        </label>
                        
                        {/* Current Icon Preview */}
                        <div className="mb-4 p-4 bg-gray-900/50 border border-green-500/30 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                              {(() => {
                                const IconComponent = getIconComponent(formData.logoLibrary, formData.logoIdentifier);
                                return IconComponent ? (
                                  <IconComponent className="w-6 h-6 text-green-400" />
                                ) : (
                                  <span className="text-xl">{formData.icon}</span>
                                );
                              })()}
                            </div>
                            <div className="flex-1">
                              <div className="text-green-300 font-mono text-sm">
                                {formData.logoIdentifier || 'No logo selected'}
                              </div>
                              <div className="text-green-400/60 font-mono text-xs">
                                {formData.logoLibrary || 'Legacy emoji icon'}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowIconPicker(true)}
                              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 font-mono text-sm transition-all duration-200"
                            >
                              CHOOSE_LOGO
                            </button>
                          </div>
                        </div>

                        {/* Legacy Emoji Icons (fallback) */}
                        <div className="mb-3">
                          <div className="text-green-400/60 font-mono text-xs mb-2">LEGACY_EMOJI_FALLBACK:</div>
                          <div className="grid grid-cols-10 gap-2 mb-2">
                            {commonIcons.map((icon) => (
                              <button
                                key={icon}
                                type="button"
                                onClick={() => setFormData(prev => ({ 
                                  ...prev, 
                                  icon,
                                  logoIdentifier: '', // Clear React icon when selecting emoji
                                  logoLibrary: 'react-icons/si'
                                }))}
                                className={`p-2 text-xl border rounded-lg transition-all duration-200 ${
                                  formData.icon === icon && !formData.logoIdentifier
                                    ? 'border-green-500 bg-green-500/20'
                                    : 'border-green-500/30 hover:border-green-500/50'
                                }`}
                              >
                                {icon}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom Emoji Input */}
                        <input
                          type="text"
                          name="icon"
                          value={formData.icon}
                          onChange={(e) => {
                            handleInputChange(e);
                            // Clear React icon when typing custom emoji
                            if (e.target.value && formData.logoIdentifier) {
                              setFormData(prev => ({ 
                                ...prev, 
                                logoIdentifier: '',
                                logoLibrary: 'react-icons/si'
                              }));
                            }
                          }}
                          className={`w-full px-4 py-2 bg-gray-900/50 border rounded-lg font-mono text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                            errors.icon ? 'border-red-500/50' : 'border-green-500/30'
                          }`}
                          placeholder="Or enter custom emoji (fallback only)"
                        />
                        {errors.icon && (
                          <p className="text-red-400 text-xs font-mono mt-1">{errors.icon}</p>
                        )}
                      </div>

                      {/* Years of Experience */}
                      <div>
                        <label className="block text-green-400 font-mono text-sm mb-2">
                          YEARS_OF_EXPERIENCE
                        </label>
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={formData.yearsOfExperience}
                          onChange={handleInputChange}
                          min="0"
                          max="50"
                          className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                            errors.yearsOfExperience ? 'border-red-500/50' : 'border-green-500/30'
                          }`}
                        />
                        {errors.yearsOfExperience && (
                          <p className="text-red-400 text-xs font-mono mt-1">{errors.yearsOfExperience}</p>
                        )}
                      </div>
                    </div>

                    {/* Proficiency Level */}
                    <div>
                      <label className="block text-green-400 font-mono text-sm mb-2">
                        PROFICIENCY_LEVEL ({formData.level}%)
                      </label>
                      <input
                        type="range"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-green-600 font-mono text-xs mt-1">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Advanced</span>
                        <span>Expert</span>
                      </div>
                      {errors.level && (
                        <p className="text-red-400 text-xs font-mono mt-1">{errors.level}</p>
                      )}
                    </div>

                    {/* Additional Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order */}
                      <div>
                        <label className="block text-green-400 font-mono text-sm mb-2">
                          DISPLAY_ORDER
                        </label>
                        <input
                          type="number"
                          name="order"
                          value={formData.order}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-3 bg-gray-900/50 border border-green-500/30 rounded-lg font-mono text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                          placeholder="0"
                        />
                      </div>

                      {/* Active Status */}
                      <div className="flex items-center justify-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            formData.isActive ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                              formData.isActive ? 'translate-x-6' : 'translate-x-0'
                            }`}></div>
                          </div>
                          <span className="ml-3 text-green-400 font-mono text-sm">
                            {formData.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-green-500/20">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3 border border-green-500/30 text-green-400 font-mono rounded-lg hover:bg-green-500/10 transition-all duration-300"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-mono font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                            SAVING...
                          </>
                        ) : (
                          <>
                            <FiSave className="w-4 h-4 mr-2" />
                            {editingSkill ? 'UPDATE_SKILL' : 'CREATE_SKILL'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </main>

        {/* Icon Picker Modal */}
        <IconPicker
          selectedIcon={formData.logoIdentifier}
          selectedLibrary={formData.logoLibrary}
          onSelect={handleIconSelect}
          isOpen={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          isDark={true}
        />
      </div>
    </>
  );
}

SkillsPage.requireAuth = true;
