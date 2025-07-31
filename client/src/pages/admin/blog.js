/**
 * @fileoverview Admin Blog Management Page - Cyber Themed
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiClock,
  FiUser,
  FiTrendingUp,
  FiMessageSquare,
  FiTag,
  FiCalendar,
  FiArrowLeft,
  FiMoreVertical,
  FiSettings,
  FiRefreshCw,
  FiExternalLink
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import BlogService from '../../services/blog-service';

/**
 * Admin Blog Management Page Component
 * @function AdminBlogPage
 * @returns {JSX.Element} Admin blog management component
 */
export default function AdminBlogPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  
  // State management
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [blogStats, setBlogStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalViews: 0
  });

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

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  // Load blogs and stats
  useEffect(() => {
    if (isAuthenticated) {
      loadBlogs();
      loadBlogStats();
    }
  }, [isAuthenticated, currentPage, filterStatus, filterCategory, searchTerm]);

  /**
   * Load blogs from API
   */
  const loadBlogs = async () => {
    try {
      setBlogsLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterCategory !== 'all' && { category: filterCategory }),
        ...(searchTerm && { search: searchTerm })
      };

      const response = await BlogService.getAllBlogs(params);
      setBlogs(response.data.blogs);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('[AdminBlog] Error loading blogs:', error);
    } finally {
      setBlogsLoading(false);
    }
  };

  /**
   * Load blog statistics
   */
  const loadBlogStats = async () => {
    try {
      const response = await BlogService.getBlogStats();
      setBlogStats(response.data);
    } catch (error) {
      console.error('[AdminBlog] Error loading stats:', error);
    }
  };

  /**
   * Handle blog deletion
   * @param {string} blogId - Blog ID to delete
   */
  const handleDeleteBlog = async (blogId) => {
    // Create a custom toast confirmation
    const result = await new Promise((resolve) => {
      const toastId = toast((t) => (
        <div className="flex flex-col space-y-3">
          <div className="text-sm font-semibold text-red-400">
            Delete Blog Post
          </div>
          <div className="text-xs text-gray-300">
            Are you sure you want to delete this blog? This action cannot be undone.
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
        style: {
          background: '#1a1a1a',
          border: '1px solid #ef4444',
          borderRadius: '8px',
        }
      });
    });

    if (!result) return;

    try {
      await BlogService.deleteBlog(blogId);
      loadBlogs(); // Reload blogs
      loadBlogStats(); // Reload stats
    } catch (error) {
      console.error('[AdminBlog] Error deleting blog:', error);
      toast.error('Failed to delete blog. Please try again.');
    }
  };

  /**
   * Handle blog status toggle
   * @param {string} blogId - Blog ID
   * @param {string} newStatus - New status
   */
  const handleStatusToggle = async (blogId, newStatus) => {
    try {
      await BlogService.toggleBlogStatus(blogId, newStatus);
      loadBlogs(); // Reload blogs
      loadBlogStats(); // Reload stats
    } catch (error) {
      console.error('[AdminBlog] Error updating status:', error);
      alert('Failed to update blog status. Please try again.');
    }
  };

  /**
   * Handle search
   * @param {string} term - Search term
   */
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page
  };

  /**
   * Handle filter change
   * @param {string} type - Filter type
   * @param {string} value - Filter value
   */
  const handleFilterChange = (type, value) => {
    if (type === 'status') {
      setFilterStatus(value);
    } else if (type === 'category') {
      setFilterCategory(value);
    }
    setCurrentPage(1); // Reset to first page
  };

  /**
   * Get status badge color
   * @param {string} status - Blog status
   * @returns {string} CSS classes
   */
  const getStatusBadge = (status) => {
    const statusClasses = {
      published: 'bg-green-500/20 text-green-400 border-green-500/40',
      draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      archived: 'bg-gray-500/20 text-gray-400 border-gray-500/40'
    };
    return statusClasses[status] || statusClasses.draft;
  };

  /**
   * Format date
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <title>ADMIN_CORE - Blog Management</title>
        <meta name="description" content="Blog content management system" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div 
        id="admin-blog-management-layout"
        className="min-h-screen bg-black relative overflow-hidden"
      >
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

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 lg:mb-8"
          >
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Link 
                  href="/admin/dashboard"
                  className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300 transition-all duration-300 flex-shrink-0"
                >
                  <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-green-400 tracking-wider truncate">
                    CONTENT_HUB
                  </h1>
                  <p className="text-green-600 font-mono text-xs sm:text-sm mt-1">
                    Blog Management System
                  </p>
                </div>
              </div>
              <Link 
                href="/admin/blog/create"
                className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/40 hover:border-green-500/60 rounded-lg text-green-300 hover:text-green-200 font-mono font-medium transition-all duration-300 group text-sm sm:text-base"
              >
                <FiPlus className="w-4 h-4 group-hover:animate-pulse flex-shrink-0" />
                <span>CREATE_POST</span>
              </Link>
            </div>

            {/* Stats Cards */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              {[
                { label: 'Total Posts', value: blogStats.totalBlogs, icon: FiEdit3, color: 'blue' },
                { label: 'Published', value: blogStats.publishedBlogs, icon: FiEye, color: 'green' },
                { label: 'Drafts', value: blogStats.draftBlogs, icon: FiClock, color: 'yellow' },
                { label: 'Total Views', value: blogStats.totalViews.toLocaleString(), icon: FiTrendingUp, color: 'purple' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                const colorClasses = {
                  blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
                  green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
                  yellow: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400',
                  purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400'
                };

                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className={`bg-gradient-to-br ${colorClasses[stat.color]} backdrop-blur-xl rounded-lg border p-4 transition-all duration-300 hover:scale-105`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-mono opacity-60">{stat.label.toUpperCase()}</span>
                    </div>
                    <div className="text-xl font-mono font-bold">{stat.value}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-4 sm:p-6 mb-6"
          >
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="relative flex-1 max-w-full lg:max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-green-500/20 rounded-lg text-green-300 placeholder-green-600 font-mono focus:outline-none focus:border-green-500/40 transition-colors text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2.5 bg-black/40 border border-green-500/20 rounded-lg text-green-300 font-mono focus:outline-none focus:border-green-500/40 transition-colors text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  onClick={() => loadBlogs()}
                  className="p-2.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded-lg text-green-400 hover:text-green-300 transition-all duration-300"
                  title="Refresh"
                >
                  <FiRefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Blog List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 overflow-hidden"
          >
            {blogsLoading ? (
              <div className="p-8 text-center">
                <div className="text-green-400 font-mono">LOADING_CONTENT...</div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="p-8 text-center">
                <FiEdit3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <div className="text-green-400 font-mono mb-2">NO_CONTENT_FOUND</div>
                <div className="text-green-600 font-mono text-sm">Create your first blog post</div>
              </div>
            ) : (
              <>
                {/* Desktop Table View - Hidden on mobile */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/40 border-b border-green-500/20">
                      <tr>
                        <th className="text-left p-4 text-green-400 font-mono text-sm font-medium">TITLE</th>
                        <th className="text-left p-4 text-green-400 font-mono text-sm font-medium">STATUS</th>
                        <th className="text-left p-4 text-green-400 font-mono text-sm font-medium">VIEWS</th>
                        <th className="text-left p-4 text-green-400 font-mono text-sm font-medium">DATE</th>
                        <th className="text-right p-4 text-green-400 font-mono text-sm font-medium">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((blog) => (
                        <motion.tr
                          key={blog._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-green-500/10 hover:bg-green-500/5 transition-colors group"
                        >
                          <td className="p-4 max-w-xs">
                            <div className="flex flex-col">
                              <h3 className="text-green-300 font-mono font-medium group-hover:text-green-200 transition-colors line-clamp-2 leading-tight">
                                {blog.title}
                              </h3>
                              <p className="text-green-600 font-mono text-xs mt-1 line-clamp-2 leading-relaxed">
                                {blog.excerpt}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-mono border ${getStatusBadge(blog.status)}`}>
                              {blog.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-green-400 font-mono text-sm">
                              {blog.views.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-green-600 font-mono text-xs">
                              {formatDate(blog.createdAt)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end space-x-2">
                              {/* Preview Button */}
                              {blog.status === 'published' && (
                                <Link 
                                  href={`/blog/${blog.slug}`}
                                  target="_blank"
                                  className="p-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded text-purple-400 hover:text-purple-300 transition-all duration-300"
                                  title="Preview Blog"
                                >
                                  <FiExternalLink className="w-3 h-3" />
                                </Link>
                              )}
                              
                              {/* Edit Button */}
                              <Link 
                                href={`/admin/blog/edit/${blog._id}`}
                                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded text-blue-400 hover:text-blue-300 transition-all duration-300"
                                title="Edit Blog"
                              >
                                <FiEdit3 className="w-3 h-3" />
                              </Link>
                              
                              {/* Publish/Unpublish Button */}
                              <button
                                onClick={() => handleStatusToggle(blog._id, blog.status === 'published' ? 'draft' : 'published')}
                                className={`p-2 rounded border transition-all duration-300 ${
                                  blog.status === 'published' 
                                    ? 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20 hover:border-yellow-500/40 text-yellow-400 hover:text-yellow-300'
                                    : 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300'
                                }`}
                                title={blog.status === 'published' ? 'Unpublish Blog' : 'Publish Blog'}
                              >
                                {blog.status === 'published' ? <FiEyeOff className="w-3 h-3" /> : <FiEye className="w-3 h-3" />}
                              </button>
                              
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteBlog(blog._id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded text-red-400 hover:text-red-300 transition-all duration-300"
                                title="Delete Blog"
                              >
                                <FiTrash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View - Visible on mobile and tablet */}
                <div className="lg:hidden space-y-4 p-4">
                  {blogs.map((blog) => (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-black/30 border border-green-500/20 rounded-lg p-4 hover:bg-green-500/5 transition-all duration-300"
                    >
                      {/* Blog Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0 mr-3">
                          <h3 className="text-green-300 font-mono font-medium text-sm sm:text-base leading-tight mb-2">
                            {blog.title}
                          </h3>
                          <p className="text-green-600 font-mono text-xs leading-relaxed line-clamp-3">
                            {blog.excerpt}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-mono border whitespace-nowrap ${getStatusBadge(blog.status)}`}>
                          {blog.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Blog Meta */}
                      <div className="flex items-center justify-between text-xs font-mono mb-4">
                        <div className="flex items-center space-x-4 text-green-600">
                          <div className="flex items-center space-x-1">
                            <FiTrendingUp className="w-3 h-3" />
                            <span>{blog.views} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="w-3 h-3" />
                            <span>{formatDate(blog.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end space-x-2">
                        {/* Preview Button */}
                        {blog.status === 'published' && (
                          <Link 
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="flex items-center space-x-1 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded text-purple-400 hover:text-purple-300 transition-all duration-300 text-xs font-mono"
                          >
                            <FiExternalLink className="w-3 h-3" />
                            <span className="hidden sm:inline">Preview</span>
                          </Link>
                        )}
                        
                        {/* Edit Button */}
                        <Link 
                          href={`/admin/blog/edit/${blog._id}`}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded text-blue-400 hover:text-blue-300 transition-all duration-300 text-xs font-mono"
                        >
                          <FiEdit3 className="w-3 h-3" />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>
                        
                        {/* Publish/Unpublish Button */}
                        <button
                          onClick={() => handleStatusToggle(blog._id, blog.status === 'published' ? 'draft' : 'published')}
                          className={`flex items-center space-x-1 px-3 py-2 rounded border transition-all duration-300 text-xs font-mono ${
                            blog.status === 'published' 
                              ? 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20 hover:border-yellow-500/40 text-yellow-400 hover:text-yellow-300'
                              : 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300'
                          }`}
                        >
                          {blog.status === 'published' ? <FiEyeOff className="w-3 h-3" /> : <FiEye className="w-3 h-3" />}
                          <span className="hidden sm:inline">{blog.status === 'published' ? 'Hide' : 'Publish'}</span>
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded text-red-400 hover:text-red-300 transition-all duration-300 text-xs font-mono"
                        >
                          <FiTrash2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {!blogsLoading && blogs.length > 0 && totalPages > 1 && (
              <div className="p-4 border-t border-green-500/20 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <div className="text-green-600 font-mono text-sm text-center sm:text-left">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded text-green-400 hover:text-green-300 font-mono text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="hidden sm:flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded font-mono text-sm transition-all duration-300 ${
                            currentPage === pageNum
                              ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                              : 'bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded text-green-400 hover:text-green-300 font-mono text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}

/**
 * Require authentication for this page
 */
AdminBlogPage.requireAuth = true;
