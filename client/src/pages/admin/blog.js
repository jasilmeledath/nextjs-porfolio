/**
 * @fileoverview Admin Blog Management Page - Cyber Themed
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
  FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import BlogService from '../../services/blog-service';
import ResponsiveDebugger from '../../components/ui/ResponsiveDebugger';

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
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      await BlogService.deleteBlog(blogId);
      loadBlogs(); // Reload blogs
      loadBlogStats(); // Reload stats
    } catch (error) {
      console.error('[AdminBlog] Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <Link 
                  href="/admin/dashboard"
                  className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300 transition-all duration-300"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-mono font-bold text-green-400 tracking-wider">
                    CONTENT_HUB
                  </h1>
                  <p className="text-green-600 font-mono text-sm mt-1">
                    Blog Management System
                  </p>
                </div>
              </div>
              <Link 
                href="/admin/blog/create"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/40 hover:border-green-500/60 rounded-lg text-green-300 hover:text-green-200 font-mono font-medium transition-all duration-300 group"
              >
                <FiPlus className="w-4 h-4 group-hover:animate-pulse" />
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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/40 border border-green-500/20 rounded-lg text-green-300 placeholder-green-600 font-mono focus:outline-none focus:border-green-500/40 transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-3 py-2 bg-black/40 border border-green-500/20 rounded-lg text-green-300 font-mono focus:outline-none focus:border-green-500/40 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  onClick={() => loadBlogs()}
                  className="p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded-lg text-green-400 hover:text-green-300 transition-all duration-300"
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/40 border-b border-green-500/20">
                    <tr>
                      <th className="text-left p-4 text-green-400 font-mono text-sm font-medium">TITLE</th>
                      <th className="text-left p-4 text-green-400 font-mono text-sm font-medium hidden sm:table-cell">STATUS</th>
                      <th className="text-left p-4 text-green-400 font-mono text-sm font-medium hidden md:table-cell">VIEWS</th>
                      <th className="text-left p-4 text-green-400 font-mono text-sm font-medium hidden lg:table-cell">DATE</th>
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
                        <td className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-green-300 font-mono font-medium truncate group-hover:text-green-200 transition-colors">
                                {blog.title}
                              </h3>
                              <p className="text-green-600 font-mono text-xs mt-1 truncate">
                                {blog.excerpt}
                              </p>
                              <div className="flex items-center space-x-2 mt-2 sm:hidden">
                                <span className={`px-2 py-1 rounded text-xs font-mono border ${getStatusBadge(blog.status)}`}>
                                  {blog.status.toUpperCase()}
                                </span>
                                <span className="text-green-600 font-mono text-xs">
                                  {blog.views} views
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className={`px-2 py-1 rounded text-xs font-mono border ${getStatusBadge(blog.status)}`}>
                            {blog.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="text-green-400 font-mono text-sm">
                            {blog.views.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="text-green-600 font-mono text-xs">
                            {formatDate(blog.createdAt)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Link 
                              href={`/admin/blog/edit/${blog._id}`}
                              className="p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded text-blue-400 hover:text-blue-300 transition-all duration-300"
                            >
                              <FiEdit3 className="w-3 h-3" />
                            </Link>
                            
                            <button
                              onClick={() => handleStatusToggle(blog._id, blog.status === 'published' ? 'draft' : 'published')}
                              className={`p-2 rounded border transition-all duration-300 ${
                                blog.status === 'published' 
                                  ? 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20 hover:border-yellow-500/40 text-yellow-400 hover:text-yellow-300'
                                  : 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300'
                              }`}
                            >
                              {blog.status === 'published' ? <FiEyeOff className="w-3 h-3" /> : <FiEye className="w-3 h-3" />}
                            </button>
                            
                            <button
                              onClick={() => handleDeleteBlog(blog._id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded text-red-400 hover:text-red-300 transition-all duration-300"
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
            )}

            {/* Pagination */}
            {!blogsLoading && blogs.length > 0 && totalPages > 1 && (
              <div className="p-4 border-t border-green-500/20 flex items-center justify-between">
                <div className="text-green-600 font-mono text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded text-green-400 hover:text-green-300 font-mono text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded text-green-400 hover:text-green-300 font-mono text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Responsive Debugger - Development Only */}
        <ResponsiveDebugger />
      </div>
    </>
  );
}

/**
 * Require authentication for this page
 */
AdminBlogPage.requireAuth = true;
