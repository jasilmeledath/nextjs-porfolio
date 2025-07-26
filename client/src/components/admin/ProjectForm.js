/**
 * @fileoverview Project Form Component - Create/Edit Projects
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFolder, 
  FiType, 
  FiFileText, 
  FiUpload, 
  FiImage, 
  FiSave,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiPlus,
  FiMinus,
  FiCalendar,
  FiStar,
  FiUsers,
  FiGithub,
  FiExternalLink,
  FiMonitor
} from 'react-icons/fi';
import PortfolioManagementService from '../../services/portfolio-management-service';

/**
 * Project Form Component
 * @function ProjectForm
 * @param {Object} props - Component props
 * @param {Object} props.project - Existing project data for editing
 * @param {Function} props.onSuccess - Success callback
 * @param {Function} props.onCancel - Cancel callback
 * @returns {JSX.Element} Project form component
 */
export default function ProjectForm({ project = null, onSuccess, onCancel }) {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    demoUrl: '',
    caseStudyUrl: '',
    isFeatured: false,
    status: 'in-progress',
    stats: {
      users: '',
      performance: '',
      rating: 0
    },
    startDate: '',
    endDate: '',
    teamSize: 1,
    myRole: '',
    challenges: [],
    learnings: [],
    order: 0
  });

  // File states
  const [projectImages, setProjectImages] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Technology management
  const [newTechnology, setNewTechnology] = useState({ name: '', category: 'frontend' });
  const [newChallenge, setNewChallenge] = useState('');
  const [newLearning, setNewLearning] = useState('');

  // UI states
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  // Refs
  const imagesInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // Constants
  const statusOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'planned', label: 'Planned' },
    { value: 'archived', label: 'Archived' }
  ];

  const categoryOptions = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Database' },
    { value: 'devops', label: 'DevOps' },
    { value: 'design', label: 'Design' },
    { value: 'other', label: 'Other' }
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
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Load existing project data
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        longDescription: project.longDescription || '',
        technologies: project.technologies || [],
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        caseStudyUrl: project.caseStudyUrl || '',
        isFeatured: project.isFeatured || false,
        status: project.status || 'in-progress',
        stats: project.stats || { users: '', performance: '', rating: 0 },
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        teamSize: project.teamSize || 1,
        myRole: project.myRole || '',
        challenges: project.challenges || [],
        learnings: project.learnings || [],
        order: project.order || 0
      });

      // Set existing images
      if (project.images && project.images.length > 0) {
        setImagePreviews(project.images);
      }
      if (project.thumbnailImage) {
        setThumbnailPreview(project.thumbnailImage);
      }
    }
  }, [project]);

  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handle project images selection
   * @param {Event} e - File input change event
   */
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate files
    const validFiles = [];
    const previews = [];

    files.forEach(file => {
      const validation = PortfolioManagementService.validateFile(
        file, 
        ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], 
        5 * 1024 * 1024 // 5MB
      );

      if (validation.isValid) {
        validFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target.result);
          if (previews.length === validFiles.length) {
            setImagePreviews(prev => [...prev, ...previews]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        showMessage('error', `${file.name}: ${validation.error}`);
      }
    });

    setProjectImages(prev => [...prev, ...validFiles]);
  };

  /**
   * Handle thumbnail image selection
   * @param {Event} e - File input change event
   */
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = PortfolioManagementService.validateFile(
      file, 
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], 
      5 * 1024 * 1024 // 5MB
    );

    if (!validation.isValid) {
      showMessage('error', validation.error);
      return;
    }

    setThumbnailImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Remove image from previews
   * @param {number} index - Image index to remove
   */
  const removeImage = (index) => {
    setProjectImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Remove thumbnail
   */
  const removeThumbnail = () => {
    setThumbnailImage(null);
    setThumbnailPreview(project?.thumbnailImage || null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  /**
   * Add new technology
   */
  const addTechnology = () => {
    if (!newTechnology.name.trim()) return;
    
    const tech = {
      name: newTechnology.name.trim(),
      category: newTechnology.category,
      color: getCategoryColor(newTechnology.category)
    };
    
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, tech]
    }));
    
    setNewTechnology({ name: '', category: 'frontend' });
  };

  /**
   * Remove technology
   * @param {number} index - Technology index to remove
   */
  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  /**
   * Add new challenge
   */
  const addChallenge = () => {
    if (!newChallenge.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      challenges: [...prev.challenges, newChallenge.trim()]
    }));
    
    setNewChallenge('');
  };

  /**
   * Remove challenge
   * @param {number} index - Challenge index to remove
   */
  const removeChallenge = (index) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index)
    }));
  };

  /**
   * Add new learning
   */
  const addLearning = () => {
    if (!newLearning.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      learnings: [...prev.learnings, newLearning.trim()]
    }));
    
    setNewLearning('');
  };

  /**
   * Remove learning
   * @param {number} index - Learning index to remove
   */
  const removeLearning = (index) => {
    setFormData(prev => ({
      ...prev,
      learnings: prev.learnings.filter((_, i) => i !== index)
    }));
  };

  /**
   * Get color for technology category
   * @param {string} category - Technology category
   * @returns {string} Color hex code
   */
  const getCategoryColor = (category) => {
    const colors = {
      frontend: '#3B82F6',
      backend: '#10B981',
      database: '#F59E0B',
      devops: '#8B5CF6',
      design: '#EC4899',
      other: '#6B7280'
    };
    return colors[category] || colors.other;
  };

  /**
   * Validate form data
   * @returns {boolean} Is form valid
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (formData.technologies.length === 0) newErrors.technologies = 'At least one technology is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showMessage('error', 'Please fix the errors below');
      return;
    }

    try {
      setSaving(true);
      
      let response;
      if (project) {
        response = await PortfolioManagementService.updateProject(
          project.id,
          formData,
          projectImages,
          thumbnailImage
        );
      } else {
        response = await PortfolioManagementService.createProject(
          formData,
          projectImages,
          thumbnailImage
        );
      }

      if (response.success) {
        showMessage('success', `Project ${project ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          if (onSuccess) onSuccess(response.data);
        }, 1000);
      }
    } catch (error) {
      console.error('[ProjectForm] Save error:', error);
      showMessage('error', error.message || `Failed to ${project ? 'update' : 'create'} project`);
    } finally {
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
          {project ? 'Edit Project' : 'Create New Project'}
        </h2>
        <p className="text-green-600 font-mono text-sm">
          {project ? 'Update project information and details' : 'Add a new project to your portfolio'}
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-green-400 mb-6 flex items-center">
            <FiFolder className="w-5 h-5 mr-3" />
            Basic Information
          </h3>
          
          <div className="space-y-6">
            {/* Title & Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                  Project Title *
                </label>
                <div className="relative">
                  <FiType className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                      errors.title ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                    }`}
                    placeholder="AI-Powered E-Commerce Platform"
                  />
                </div>
                {errors.title && (
                  <p className="text-red-400 text-xs font-mono mt-1">{errors.title}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 resize-none ${
                  errors.description ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                }`}
                placeholder="Brief description of your project..."
              />
              <div className="flex justify-between items-center mt-2">
                {errors.description && (
                  <p className="text-red-400 text-xs font-mono">{errors.description}</p>
                )}
                <div className="text-green-700 font-mono text-xs ml-auto">
                  {formData.description.length}/500
                </div>
              </div>
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Detailed Description
              </label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 resize-none"
                placeholder="Detailed description of your project, including features, architecture, and implementation details..."
              />
              <div className="text-green-700 font-mono text-xs mt-2 text-right">
                {formData.longDescription.length}/5000
              </div>
            </div>

            {/* Featured & Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-500 bg-black/40 border-green-500/30 rounded focus:ring-green-500/50"
                />
                <label className="text-sm font-mono font-medium text-green-300 flex items-center">
                  <FiStar className="w-4 h-4 mr-2" />
                  Featured Project
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Continue with remaining sections... */}
        {/* I'll continue with the rest of the form sections in the next part due to length */}
        
        {/* Submit Buttons */}
        <motion.div variants={fadeInUp} className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-mono rounded-lg transition-all duration-300"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-mono font-bold rounded-lg transition-all duration-300 shadow-lg shadow-green-500/20 disabled:shadow-none"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                {project ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                {project ? 'Update Project' : 'Create Project'}
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
