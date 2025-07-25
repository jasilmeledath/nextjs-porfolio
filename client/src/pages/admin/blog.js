/**
 * @fileoverview Admin Blog Management Page
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiTag,
  FiBarChart2,
  FiMoreVertical,
  FiSettings
} from 'react-icons/fi';
import { withAdminAuth } from '../../components/admin/AdminProtectedRoute';

/**
 * Admin Blog Management Page Component
 * @function AdminBlogManagement
 * @returns {JSX.Element} Admin blog management component
 */
function AdminBlogManagement() {
  // State management
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Mock data - in real app this would come from API
  const mockPosts = [
    {
      id: 1,
      title: 'Building Scalable React Applications with Next.js',
      slug: 'building-scalable-react-nextjs',
      status: 'published',
      category: 'Web Development',
      tags: ['React', 'Next.js', 'Performance'],
      author: 'Admin',
      publishDate: '2025-01-20',
      lastModified: '2025-01-22',
      views: 1234,
      comments: 12,
      excerpt: 'Learn how to build production-ready React applications...',
      featured: true
    },
    {
      id: 2,
      title: 'React Hooks: Best Practices and Common Pitfalls',
      slug: 'react-hooks-best-practices',
      status: 'published',
      category: 'React',
      tags: ['React', 'Hooks', 'JavaScript'],
      author: 'Admin',
      publishDate: '2025-01-18',
      lastModified: '2025-01-18',
      views: 892,
      comments: 8,
      excerpt: 'Discover the most effective ways to use React Hooks...',
      featured: false
    },
    {
      id: 3,
      title: 'Advanced TypeScript Patterns for Large Applications',
      slug: 'advanced-typescript-patterns',
      status: 'draft',
      category: 'TypeScript',
      tags: ['TypeScript', 'Patterns', 'Architecture'],
      author: 'Admin',
      publishDate: null,
      lastModified: '2025-01-25',
      views: 0,
      comments: 0,
      excerpt: 'Explore advanced TypeScript patterns and techniques...',
      featured: false
    },
    {
      id: 4,
      title: 'MongoDB Performance Optimization Guide',
      slug: 'mongodb-performance-optimization',
      status: 'scheduled',
      category: 'Database',
      tags: ['MongoDB', 'Performance', 'Database'],
      author: 'Admin',
      publishDate: '2025-01-30',
      lastModified: '2025-01-26',
      views: 0,
      comments: 0,
      excerpt: 'Learn how to optimize MongoDB queries and improve performance...',
      featured: false
    }
  ];

  // Load posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setPosts(mockPosts);
        setFilteredPosts(mockPosts);
        setIsLoading(false);
      }, 1000);
    };

    loadPosts();
  }, []);

  // Filter posts based on search and filters
  useEffect(() => {
    let filtered = [...posts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    setFilteredPosts(filtered);
  }, [searchTerm, statusFilter, categoryFilter, posts]);

  /**
   * Handle post selection
   * @param {number} postId - Post ID to toggle
   */
  const togglePostSelection = (postId) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  /**
   * Select all posts
   */
  const selectAllPosts = () => {
    setSelectedPosts(
      selectedPosts.length === filteredPosts.length
        ? []
        : filteredPosts.map(post => post.id)
    );
  };

  /**
   * Handle bulk actions
   * @param {string} action - Action to perform
   */
  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on posts:`, selectedPosts);
    // Implement bulk actions (delete, publish, etc.)
  };

  /**
   * Handle individual post actions
   * @param {string} action - Action to perform
   * @param {number} postId - Post ID
   */
  const handlePostAction = (action, postId) => {
    console.log(`Performing ${action} on post:`, postId);
    // Implement individual actions
  };

  /**
   * Get status badge styling
   * @param {string} status - Post status
   * @returns {string} CSS classes
   */
  const getStatusBadge = (status) => {
    const badges = {
      published: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      draft: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
      scheduled: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
      archived: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
    };
    return badges[status] || badges.draft;
  };

  // Categories for filter
  const categories = ['all', 'Web Development', 'React', 'TypeScript', 'Database', 'Performance'];

  return (
    <>
      <Head>
        <title>Blog Management - Admin Panel</title>
        <meta name="description" content="Manage blog posts and content" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div 
        id="admin-blog-content-management-main-container"
        className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Blog Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Create, edit, and manage your blog posts
                </p>
              </div>
              <button
                id="admin-create-new-blog-post-button"
                onClick={() => handlePostAction('create', null)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                New Post
              </button>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="admin-blog-search-input"
                      type="text"
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    id="admin-blog-posts-status-filter-dropdown"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    id="admin-blog-category-filter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bulk Actions */}
          {selectedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 dark:text-blue-300 font-medium">
                    {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBulkAction('publish')}
                      className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => handleBulkAction('draft')}
                      className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                    >
                      Draft
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Posts Table */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                    onChange={selectAllPosts}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select All
                  </span>
                </div>
              </div>

              {/* Table Content */}
              <div 
                id="admin-blog-posts-management-table"
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                {isLoading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-4">Loading posts...</p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      No posts found matching your criteria.
                    </p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => togglePostSelection(post.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                  {post.title}
                                </h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(post.status)}`}>
                                  {post.status}
                                </span>
                                {post.featured && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
                                    Featured
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {post.excerpt}
                              </p>
                              
                              <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center">
                                  <FiUser className="w-4 h-4 mr-1" />
                                  {post.author}
                                </span>
                                <span className="flex items-center">
                                  <FiCalendar className="w-4 h-4 mr-1" />
                                  {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Not published'}
                                </span>
                                <span className="flex items-center">
                                  <FiBarChart2 className="w-4 h-4 mr-1" />
                                  {post.views} views
                                </span>
                                <span className="flex items-center">
                                  <FiTag className="w-4 h-4 mr-1" />
                                  {post.category}
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mt-2">
                                {post.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handlePostAction('edit', post.id)}
                                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="Edit post"
                              >
                                <FiEdit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handlePostAction('view', post.id)}
                                className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                title="View post"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handlePostAction('delete', post.id)}
                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                title="Delete post"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                title="More options"
                              >
                                <FiMoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Pagination would go here */}
          {filteredPosts.length > 0 && (
            <motion.div variants={itemVariants} className="mt-6 flex justify-center">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  Previous
                </button>
                <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 hover:bg-blue-700">
                  1
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  2
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  Next
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default withAdminAuth(AdminBlogManagement);
