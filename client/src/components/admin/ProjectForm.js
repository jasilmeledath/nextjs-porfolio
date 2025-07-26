/**
 * @fileoverview Project Form Component - Create/Edit Projects
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
  FiMonitor,
  FiEdit3,
  FiLink,
  FiTrendingUp,
  FiTrello
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
    technologies: [], // Array of {name, category, color}
    liveUrl: '',
    githubUrl: '',
    demoUrl: '',
    caseStudyUrl: '',
    isFeatured: false,
    isActive: true,
    status: 'in-progress',
    stats: {
      users: '0',
      performance: '0%',
      rating: 0,
      uptime: null,
      githubStars: 0,
      deployments: 0
    },
    startDate: '',
    endDate: '',
    teamSize: 1,
    myRole: '',
    challenges: [],
    learnings: [],
    order: 0
  });

  // Projects list state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProject, setEditingProject] = useState(project);
  const [showForm, setShowForm] = useState(!!project);

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
    loadProjects();
  }, []);

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        longDescription: editingProject.longDescription || '',
        technologies: editingProject.technologies || [],
        liveUrl: editingProject.liveUrl || '',
        githubUrl: editingProject.githubUrl || '',
        demoUrl: editingProject.demoUrl || '',
        caseStudyUrl: editingProject.caseStudyUrl || '',
        isFeatured: editingProject.isFeatured || false,
        status: editingProject.status || 'in-progress',
        stats: editingProject.stats || { users: '', performance: '', rating: 0 },
        startDate: editingProject.startDate ? new Date(editingProject.startDate).toISOString().split('T')[0] : '',
        endDate: editingProject.endDate ? new Date(editingProject.endDate).toISOString().split('T')[0] : '',
        teamSize: editingProject.teamSize || 1,
        myRole: editingProject.myRole || '',
        challenges: editingProject.challenges || [],
        learnings: editingProject.learnings || [],
        order: editingProject.order || 0
      });

      // Set existing images
      if (editingProject.images && editingProject.images.length > 0) {
        setImagePreviews(editingProject.images);
      }
      if (editingProject.thumbnailImage) {
        setThumbnailPreview(editingProject.thumbnailImage);
      }
    }
  }, [editingProject]);

  /**
   * Load all projects
   */
  const loadProjects = async () => {
    try {
      setLoading(true);
      console.log('[ProjectForm] Loading projects...');
      
      const response = await PortfolioManagementService.getProjects();
      console.log('[ProjectForm] Projects response:', response);
      
      if (response.success) {
        setProjects(response.message || []);
      } else {
        console.error('[ProjectForm] Failed to load projects:', response.message);
        showMessage('error', 'Failed to load projects');
      }
    } catch (error) {
      console.error('[ProjectForm] Load projects error:', error);
      showMessage('error', 'Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle editing a project
   */
  const handleEditProject = (project) => {
    console.log('[ProjectForm] Edit project button clicked', project);
    setEditingProject(project);
    setShowForm(true);
    resetForm();
  };

  /**
   * Handle creating a new project
   */
  const handleNewProject = () => {
    console.log('[ProjectForm] New project button clicked');
    setEditingProject(null);
    setShowForm(true);
    resetForm();
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
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
      stats: { users: '', performance: '', rating: 0 },
      startDate: '',
      endDate: '',
      teamSize: 1,
      myRole: '',
      challenges: [],
      learnings: [],
      order: 0
    });
    setProjectImages([]);
    setThumbnailImage(null);
    setImagePreviews([]);
    setThumbnailPreview(null);
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  /**
   * Handle deleting a project
   */
  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await PortfolioManagementService.deleteProject(projectId);
      if (response.success) {
        showMessage('success', 'Project deleted successfully');
        loadProjects(); // Reload the list
        if (editingProject && editingProject._id === projectId) {
          setShowForm(false);
          setEditingProject(null);
        }
      }
    } catch (error) {
      console.error('[ProjectForm] Delete error:', error);
      showMessage('error', 'Failed to delete project');
    }
  };

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

    // Required fields validation
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 200) newErrors.title = 'Title must be less than 200 characters';
    
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length > 500) newErrors.description = 'Description must be less than 500 characters';
    
    if (formData.longDescription.length > 5000) newErrors.longDescription = 'Long description must be less than 5000 characters';
    
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    
    // Images validation
    if (!thumbnailImage && !editingProject?.thumbnailImage) newErrors.thumbnailImage = 'Thumbnail image is required';
    if (projectImages.length === 0 && (!editingProject?.images || editingProject.images.length === 0)) {
      newErrors.projectImages = 'At least one project image is required';
    }
    
    // URL validation
    const urlPattern = /^https?:\/\/.+$/;
    if (formData.liveUrl && !urlPattern.test(formData.liveUrl)) newErrors.liveUrl = 'Invalid URL format';
    if (formData.githubUrl && !urlPattern.test(formData.githubUrl)) newErrors.githubUrl = 'Invalid URL format';
    if (formData.demoUrl && !urlPattern.test(formData.demoUrl)) newErrors.demoUrl = 'Invalid URL format';
    if (formData.caseStudyUrl && !urlPattern.test(formData.caseStudyUrl)) newErrors.caseStudyUrl = 'Invalid URL format';
    
    // Additional validations
    if (formData.teamSize < 1) newErrors.teamSize = 'Team size must be at least 1';
    if (formData.myRole && formData.myRole.length > 100) newErrors.myRole = 'Role must be less than 100 characters';
    
    // Stats validation
    if (formData.stats.rating < 0 || formData.stats.rating > 5) newErrors.rating = 'Rating must be between 0 and 5';

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
      if (editingProject) {
        response = await PortfolioManagementService.updateProject(
          editingProject._id,
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
        showMessage('success', `Project ${editingProject ? 'updated' : 'created'} successfully!`);
        
        // Reload projects list
        await loadProjects();
        
        // Hide form and reset
        setTimeout(() => {
          setShowForm(false);
          setEditingProject(null);
          resetForm();
          if (onSuccess) onSuccess(response.data);
        }, 1500);
      }
    } catch (error) {
      console.error('[ProjectForm] Save error:', error);
      showMessage('error', error.message || `Failed to ${editingProject ? 'update' : 'create'} project`);
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
      className="max-w-6xl mx-auto"
    >
      {!showForm ? (
        <>
          {/* Projects List Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-mono font-bold text-green-400 mb-2">
                  Project Management
                </h2>
                <p className="text-green-600 font-mono text-sm">
                  Manage your portfolio projects
                </p>
              </div>
              <button
                onClick={handleNewProject}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-mono font-bold rounded-lg transition-all duration-300 relative z-10 pointer-events-auto"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                New Project
              </button>
            </div>
          </div>

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

          {/* Projects List */}
          <motion.div variants={fadeInUp}>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
                <p className="text-green-600 font-mono">Loading projects...</p>
              </div>
            ) : !Array.isArray(projects) || projects.length === 0 ? (
              <div className="text-center py-12">
                <FiFolder className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-green-600 font-mono text-lg mb-2">No projects yet</p>
                <p className="text-green-700 font-mono text-sm mb-6">Create your first project to get started</p>
                <button
                  onClick={handleNewProject}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-mono font-bold rounded-lg transition-all duration-300 mx-auto relative z-10 pointer-events-auto"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Create Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(projects) && projects.map((proj) => (
                  <div
                    key={proj._id}
                    className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300"
                  >
                    {/* Project Thumbnail */}
                    {proj.thumbnailImage && (
                      <div className="mb-4 relative">
                        <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-800">
                          <Image
                            src={proj.thumbnailImage}
                            alt={proj.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            unoptimized={proj.thumbnailImage.startsWith('blob:')}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Project Info */}
                    <div className="mb-4">
                      <h3 className="text-lg font-mono font-bold text-green-400 mb-2">
                        {proj.title}
                      </h3>
                      <p className="text-green-600 font-mono text-sm mb-3 line-clamp-2">
                        {proj.description}
                      </p>
                      
                      {/* Status Badge */}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-mono font-medium ${
                        proj.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        proj.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
                        proj.status === 'planned' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {proj.status}
                      </span>
                      
                      {proj.isFeatured && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-mono font-medium bg-purple-500/20 text-purple-300">
                          <FiStar className="w-3 h-3 mr-1" />
                          Featured
                        </span>
                      )}
                    </div>
                    
                    {/* Technologies */}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {proj.technologies.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-mono"
                            >
                              {tech.name}
                            </span>
                          ))}
                          {proj.technologies.length > 3 && (
                            <span className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded text-xs font-mono">
                              +{proj.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProject(proj)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-300 font-mono text-sm rounded-lg transition-all duration-300 border border-green-500/20 hover:border-green-500/40 relative z-10 pointer-events-auto"
                      >
                        <FiEdit3 className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj._id)}
                        className="flex items-center justify-center px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-mono text-sm rounded-lg transition-all duration-300 border border-red-500/20 hover:border-red-500/40 relative z-10 pointer-events-auto"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      ) : (
        <>
          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-mono font-bold text-green-400 mb-2">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <p className="text-green-600 font-mono text-sm">
                  {editingProject ? 'Update project information and details' : 'Add a new project to your portfolio'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                  resetForm();
                }}
                className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-mono rounded-lg transition-all duration-300 relative z-10 pointer-events-auto"
              >
                <FiX className="w-4 h-4 mr-2" />
                Close
              </button>
            </div>
          </div>

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

        {/* Technologies Section */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-green-400 mb-6 flex items-center">
            <FiMonitor className="w-5 h-5 mr-3" />
            Technologies
          </h3>
          
          <div className="space-y-6">
            {/* Add Technology */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                  Technology Name
                </label>
                <input
                  type="text"
                  value={newTechnology.name}
                  onChange={(e) => setNewTechnology({ ...newTechnology, name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
                  placeholder="React"
                />
              </div>
              
              <div>
                <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                  Category
                </label>
                <select
                  value={newTechnology.category}
                  onChange={(e) => setNewTechnology({ ...newTechnology, category: e.target.value })}
                  className="w-full px-4 py-2 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addTechnology}
                  className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 font-mono rounded-lg transition-all duration-300 border border-green-500/40 hover:border-green-500/60 relative z-10 pointer-events-auto"
                >
                  <FiPlus className="w-4 h-4 inline mr-2" />
                  Add Tech
                </button>
              </div>
            </div>

            {/* Technologies List */}
            {formData.technologies.length > 0 && (
              <div>
                <h4 className="text-sm font-mono font-medium text-green-300 mb-3">Added Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-mono border border-green-500/40"
                    >
                      {tech.name} ({tech.category})
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="ml-2 text-red-400 hover:text-red-300 relative z-10 pointer-events-auto"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {errors.technologies && (
              <p className="text-red-400 text-xs font-mono">{errors.technologies}</p>
            )}
          </div>
        </motion.div>

        {/* Project URLs Section */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-green-400 mb-6 flex items-center">
            <FiLink className="w-5 h-5 mr-3" />
            Project Links
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live URL */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Live Demo URL
              </label>
              <div className="relative">
                <FiExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4" />
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                    errors.liveUrl ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                  }`}
                  placeholder="https://myproject.com"
                />
              </div>
              {errors.liveUrl && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.liveUrl}</p>
              )}
            </div>

            {/* GitHub URL */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                GitHub Repository
              </label>
              <div className="relative">
                <FiGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4" />
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                    errors.githubUrl ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                  }`}
                  placeholder="https://github.com/username/repo"
                />
              </div>
              {errors.githubUrl && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.githubUrl}</p>
              )}
            </div>

            {/* Demo URL */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Demo/Preview URL
              </label>
              <div className="relative">
                <FiMonitor className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4" />
                <input
                  type="url"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                    errors.demoUrl ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                  }`}
                  placeholder="https://demo.myproject.com"
                />
              </div>
              {errors.demoUrl && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.demoUrl}</p>
              )}
            </div>

            {/* Case Study URL */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Case Study URL
              </label>
              <div className="relative">
                <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4" />
                <input
                  type="url"
                  name="caseStudyUrl"
                  value={formData.caseStudyUrl}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                    errors.caseStudyUrl ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                  }`}
                  placeholder="https://medium.com/@user/case-study"
                />
              </div>
              {errors.caseStudyUrl && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.caseStudyUrl}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Timeline & Team Section */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-green-400 mb-6 flex items-center">
            <FiCalendar className="w-5 h-5 mr-3" />
            Timeline & Team
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                  errors.startDate ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
              />
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Team Size
              </label>
              <div className="relative">
                <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4" />
                <input
                  type="number"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                    errors.teamSize ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                  }`}
                />
              </div>
              {errors.teamSize && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.teamSize}</p>
              )}
            </div>

            {/* My Role */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                My Role
              </label>
              <input
                type="text"
                name="myRole"
                value={formData.myRole}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                  errors.myRole ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                }`}
                placeholder="Full Stack Developer"
              />
              {errors.myRole && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.myRole}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Images Section */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-green-400 mb-6 flex items-center">
            <FiImage className="w-5 h-5 mr-3" />
            Project Images
          </h3>
          
          <div className="space-y-6">
            {/* Thumbnail Image */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Thumbnail Image *
              </label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={thumbnailInputRef}
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-lg transition-all duration-300 flex items-center justify-center relative z-10 pointer-events-auto ${
                      errors.thumbnailImage 
                        ? 'border-red-500 text-red-400' 
                        : 'border-green-500/30 hover:border-green-500/60 text-green-600 hover:text-green-500'
                    }`}
                  >
                    <FiUpload className="w-5 h-5 mr-2" />
                    Choose Thumbnail
                  </button>
                  {errors.thumbnailImage && (
                    <p className="text-red-400 text-xs font-mono mt-1">{errors.thumbnailImage}</p>
                  )}
                </div>
                
                {thumbnailPreview && (
                  <div className="relative">
                    <div className="w-full h-32 rounded-lg overflow-hidden border border-green-500/30 bg-gray-800">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                        unoptimized={thumbnailPreview.startsWith('blob:')}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors relative z-10 pointer-events-auto"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Project Images */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Project Images *
              </label>
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={imagesInputRef}
                    onChange={handleImagesChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imagesInputRef.current?.click()}
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-lg transition-all duration-300 flex items-center justify-center relative z-10 pointer-events-auto ${
                      errors.projectImages
                        ? 'border-red-500 text-red-400'
                        : 'border-green-500/30 hover:border-green-500/60 text-green-600 hover:text-green-500'
                    }`}
                  >
                    <FiUpload className="w-5 h-5 mr-2" />
                    Choose Project Images
                  </button>
                  {errors.projectImages && (
                    <p className="text-red-400 text-xs font-mono mt-1">{errors.projectImages}</p>
                  )}
                </div>
                
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <div className="w-full h-24 rounded-lg overflow-hidden border border-green-500/30 bg-gray-800">
                          <Image
                            src={preview}
                            alt={`Project Preview ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            style={{ objectFit: 'cover' }}
                            unoptimized={preview.startsWith('blob:')}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs relative z-10 pointer-events-auto"
                        >
                          <FiX className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Section */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-green-400 mb-6 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-3" />
            Project Statistics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Users */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Users/Downloads
              </label>
              <input
                type="text"
                value={formData.stats.users}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, users: e.target.value }
                })}
                className="w-full px-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
                placeholder="1,000+"
              />
            </div>

            {/* Performance */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Performance Score
              </label>
              <input
                type="text"
                value={formData.stats.performance}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, performance: e.target.value }
                })}
                className="w-full px-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
                placeholder="95%"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Rating (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.stats.rating}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, rating: parseFloat(e.target.value) || 0 }
                })}
                className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-green-100 font-mono focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
                  errors.rating ? 'border-red-500' : 'border-green-500/30 focus:border-green-500'
                }`}
              />
              {errors.rating && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.rating}</p>
              )}
            </div>

            {/* GitHub Stars */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                GitHub Stars
              </label>
              <input
                type="number"
                min="0"
                value={formData.stats.githubStars}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, githubStars: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
                placeholder="12"
              />
            </div>

            {/* Deployments */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Deployments
              </label>
              <input
                type="number"
                min="0"
                value={formData.stats.deployments}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, deployments: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
                placeholder="5"
              />
            </div>

            {/* Uptime */}
            <div>
              <label className="block text-sm font-mono font-medium text-green-300 mb-2">
                Uptime
              </label>
              <input
                type="text"
                value={formData.stats.uptime || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, uptime: e.target.value || null }
                })}
                className="w-full px-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
                placeholder="99.9%"
              />
            </div>
          </div>
        </motion.div>

        {/* Challenges & Learnings Section */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-green-400 mb-6 flex items-center">
            <FiTrello className="w-5 h-5 mr-3" />
            Challenges & Learnings
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Challenges */}
            <div>
              <h4 className="text-md font-mono font-bold text-green-300 mb-4">Challenges Faced</h4>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                    className="flex-1 px-4 py-2 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
                    placeholder="Describe a challenge..."
                    maxLength="500"
                  />
                  <button
                    type="button"
                    onClick={addChallenge}
                    className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-mono rounded-lg transition-all duration-300 border border-orange-500/40 hover:border-orange-500/60 relative z-10 pointer-events-auto"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                
                {formData.challenges.length > 0 && (
                  <div className="space-y-2">
                    {formData.challenges.map((challenge, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <span className="flex-1 text-sm font-mono text-orange-200">{challenge}</span>
                        <button
                          type="button"
                          onClick={() => removeChallenge(index)}
                          className="text-red-400 hover:text-red-300 relative z-10 pointer-events-auto"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Learnings */}
            <div>
              <h4 className="text-md font-mono font-bold text-green-300 mb-4">Key Learnings</h4>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newLearning}
                    onChange={(e) => setNewLearning(e.target.value)}
                    className="flex-1 px-4 py-2 bg-black/40 border border-green-500/30 rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300"
                    placeholder="Describe a learning..."
                    maxLength="500"
                  />
                  <button
                    type="button"
                    onClick={addLearning}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-mono rounded-lg transition-all duration-300 border border-blue-500/40 hover:border-blue-500/60 relative z-10 pointer-events-auto"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                
                {formData.learnings.length > 0 && (
                  <div className="space-y-2">
                    {formData.learnings.map((learning, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <span className="flex-1 text-sm font-mono text-blue-200">{learning}</span>
                        <button
                          type="button"
                          onClick={() => removeLearning(index)}
                          className="text-red-400 hover:text-red-300 relative z-10 pointer-events-auto"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Continue with remaining sections... */}
        {/* I'll continue with the rest of the form sections in the next part due to length */}
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4" style={{ pointerEvents: 'auto', zIndex: 1000 }}>
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
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-mono font-bold rounded-lg transition-all duration-300 shadow-lg shadow-green-500/20 disabled:shadow-none relative z-50"
            style={{ pointerEvents: 'auto' }}
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
        </div>
      </form>
        </>
      )}
    </motion.div>
  );
}
