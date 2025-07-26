/**
 * @fileoverview Admin Blog Create Page - Cyber Themed
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft,
  FiSave,
  FiEye,
  FiUpload,
  FiImage,
  FiTag,
  FiCalendar,
  FiUser,
  FiEdit3,
  FiBookOpen,
  FiGlobe,
  FiLock
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import BlogService from '../../../services/blog-service';

/**
 * Admin Blog Create Page Component
 * @function AdminBlogCreatePage
 * @returns {JSX.Element} Admin blog create component
 */
export default function AdminBlogCreatePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: {
      url: '',
      alt: '',
      caption: ''
    },
    categories: [],
    tags: [],
    status: 'draft',
    featured: false,
    sticky: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});

  // Available categories and tags
  const availableCategories = [
    'technology',
    'web-development',
    'javascript',
    'react',
    'nextjs',
    'nodejs',
    'mongodb',
    'tutorial',
    'tips',
    'career',
    'personal',
    'general'
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = BlogService.generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  // Auto-generate SEO fields
  useEffect(() => {
    if (formData.title && !formData.seo.metaTitle) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaTitle: formData.title.substring(0, 60)
        }
      }));
    }
  }, [formData.title]);

  useEffect(() => {
    if (formData.excerpt && !formData.seo.metaDescription) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaDescription: formData.excerpt.substring(0, 160)
        }
      }));
    }
  }, [formData.excerpt]);

  /**
   * Handle form input changes
   * @param {Event} e - Input event
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Handle category selection
   * @param {string} category - Category to toggle
   */
  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  /**
   * Handle tag input
   * @param {Event} e - Input event
   */
  const handleTagInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = e.target.value.trim().toLowerCase();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        e.target.value = '';
      }
    }
  };

  /**
   * Remove tag
   * @param {string} tagToRemove - Tag to remove
   */
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Validate form data
   * @returns {boolean} Is form valid
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length < 20) {
      newErrors.excerpt = 'Excerpt must be at least 20 characters';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form event
   * @param {string} action - Submit action (save-draft or publish)
   */
  const handleSubmit = async (e, action = 'save-draft') => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        status: action === 'publish' ? 'published' : 'draft'
      };

      const response = await BlogService.createBlog(submitData);
      
      // Redirect to blog list with success message
      router.push('/admin/blog?success=created');
    } catch (error) {
      console.error('[BlogCreate] Error creating blog:', error);
      // Error is already handled by BlogService with toast notification
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono">LOADING_MODULE...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>ADMIN_CORE - Create Blog Post</title>
        <meta name="description" content="Create new blog post" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div 
        id="admin-blog-create-layout"
        className="min-h-screen bg-black relative overflow-hidden"
      >
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 lg:mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <Link 
                  href="/admin/blog"
                  className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300 transition-all duration-300"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-mono font-bold text-green-400 tracking-wider">
                    CREATE_POST
                  </h1>
                  <p className="text-green-600 font-mono text-sm mt-1">
                    New Blog Content Entry
                  </p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-lg text-blue-400 hover:text-blue-300 font-mono text-sm transition-all duration-300"
                >
                  <FiEye className="w-4 h-4" />
                  <span className="hidden sm:inline">PREVIEW</span>
                </button>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
                >
                  <label className="block text-green-400 font-mono text-sm font-medium mb-3">
                    TITLE *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter blog post title..."
                    className="w-full p-3 bg-black/40 border border-green-500/20 rounded-lg text-green-300 placeholder-green-600 font-mono focus:outline-none focus:border-green-500/40 transition-colors"
                  />
                  {errors.title && (
                    <p className="text-red-400 font-mono text-xs mt-2">{errors.title}</p>
                  )}
                </motion.div>

                {/* Slug */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
                >
                  <label className="block text-green-400 font-mono text-sm font-medium mb-3">
                    SLUG *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="url-friendly-slug"
                    className="w-full p-3 bg-black/40 border border-green-500/20 rounded-lg text-green-300 placeholder-green-600 font-mono focus:outline-none focus:border-green-500/40 transition-colors"
                  />
                  {errors.slug && (
                    <p className="text-red-400 font-mono text-xs mt-2">{errors.slug}</p>
                  )}
                </motion.div>

                {/* Content */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
                >
                  <label className="block text-green-400 font-mono text-sm font-medium mb-3">
                    CONTENT *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your blog content here..."
                    rows={15}
                    className="w-full p-3 bg-black/40 border border-green-500/20 rounded-lg text-green-300 placeholder-green-600 font-mono focus:outline-none focus:border-green-500/40 transition-colors resize-vertical"
                  />
                  {errors.content && (
                    <p className="text-red-400 font-mono text-xs mt-2">{errors.content}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-green-600 font-mono text-xs">
                      Word count: {formData.content.split(/\s+/).filter(word => word.length > 0).length}
                    </span>
                    <span className="text-green-600 font-mono text-xs">
                      Read time: {BlogService.calculateReadingTime(formData.content)} min
                    </span>
                  </div>
                </motion.div>

                {/* Excerpt */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
                >
                  <label className="block text-green-400 font-mono text-sm font-medium mb-3">
                    EXCERPT *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief description of the blog post..."
                    rows={3}
                    maxLength={300}
                    className="w-full p-3 bg-black/40 border border-green-500/20 rounded-lg text-green-300 placeholder-green-600 font-mono focus:outline-none focus:border-green-500/40 transition-colors resize-vertical"
                  />
                  {errors.excerpt && (
                    <p className="text-red-400 font-mono text-xs mt-2">{errors.excerpt}</p>
                  )}
                  <div className="text-right mt-2">
                    <span className="text-green-600 font-mono text-xs">
                      {formData.excerpt.length}/300
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publish Settings */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
                >
                  <h3 className="text-green-400 font-mono text-sm font-medium mb-4">PUBLISH_SETTINGS</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="w-4 h-4 bg-black border border-green-500/20 rounded focus:ring-green-500/40"
                      />
                      <label htmlFor="featured" className="text-green-300 font-mono text-sm">
                        Featured Post
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="sticky"
                        name="sticky"
                        checked={formData.sticky}
                        onChange={handleInputChange}
                        className="w-4 h-4 bg-black border border-green-500/20 rounded focus:ring-green-500/40"
                      />
                      <label htmlFor="sticky" className="text-green-300 font-mono text-sm">
                        Sticky Post
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 mt-6">
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e, 'save-draft')}
                      disabled={isSubmitting}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-500/40 rounded-lg text-yellow-400 hover:text-yellow-300 font-mono font-medium transition-all duration-300 disabled:opacity-50"
                    >
                      <FiSave className="w-4 h-4" />
                      <span>SAVE_DRAFT</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e, 'publish')}
                      disabled={isSubmitting}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded-lg text-green-400 hover:text-green-300 font-mono font-medium transition-all duration-300 disabled:opacity-50"
                    >
                      <FiGlobe className="w-4 h-4" />
                      <span>PUBLISH_NOW</span>
                    </button>
                  </div>
                </motion.div>

                {/* Categories */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
                >
                  <h3 className="text-green-400 font-mono text-sm font-medium mb-4">CATEGORIES *</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {availableCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-3 py-2 rounded-lg font-mono text-xs transition-all duration-300 ${
                          formData.categories.includes(category)
                            ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                            : 'bg-black/40 text-green-600 border border-green-500/20 hover:border-green-500/40'
                        }`}
                      >
                        {category.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  {errors.categories && (
                    <p className="text-red-400 font-mono text-xs mt-2">{errors.categories}</p>
                  )}
                </motion.div>

                {/* Tags */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
                >
                  <h3 className="text-green-400 font-mono text-sm font-medium mb-4">TAGS</h3>
                  <input
                    type="text"
                    placeholder="Type tag and press Enter..."
                    onKeyDown={handleTagInput}
                    className="w-full p-2 bg-black/40 border border-green-500/20 rounded-lg text-green-300 placeholder-green-600 font-mono text-sm focus:outline-none focus:border-green-500/40 transition-colors"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-2 px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded font-mono text-xs"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Featured Image */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6"
                >
                  <h3 className="text-green-400 font-mono text-sm font-medium mb-4">FEATURED_IMAGE</h3>
                  <input
                    type="url"
                    name="featuredImage.url"
                    value={formData.featuredImage.url}
                    onChange={handleInputChange}
                    placeholder="Image URL..."
                    className="w-full p-2 bg-black/40 border border-green-500/20 rounded-lg text-green-300 placeholder-green-600 font-mono text-sm focus:outline-none focus:border-green-500/40 transition-colors mb-3"
                  />
                  <input
                    type="text"
                    name="featuredImage.alt"
                    value={formData.featuredImage.alt}
                    onChange={handleInputChange}
                    placeholder="Alt text..."
                    className="w-full p-2 bg-black/40 border border-green-500/20 rounded-lg text-green-300 placeholder-green-600 font-mono text-sm focus:outline-none focus:border-green-500/40 transition-colors"
                  />
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

/**
 * Require authentication for this page
 */
AdminBlogCreatePage.requireAuth = true;
