/**
 * @fileoverview Blog Listing Page - SEO-Optimized Content Platform
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiTag,
  FiArrowRight,
  FiArrowLeft,
  FiChevronDown,
  FiX,
  FiEye,
  FiMessageSquare
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import BlogService from '../../services/blog-service';

/**
 * Blog Page Component
 * @function BlogPage
 * @returns {JSX.Element} Blog page component
 */
export default function BlogPage() {
  const { toggleTheme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [popularBlogs, setPopularBlogs] = useState([]);

  // Load blogs from API
  useEffect(() => {
    loadBlogs();
    loadCategories();
    loadPopularBlogs();
  }, [currentPage, selectedCategory, searchQuery]);

  /**
   * Load published blogs
   */
  const loadBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      };

      const response = await BlogService.getPublishedBlogs(params);
      setBlogs(response.data.blogs);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('[Blog] Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load categories
   */
  const loadCategories = async () => {
    try {
      const response = await BlogService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('[Blog] Error loading categories:', error);
    }
  };

  /**
   * Load popular blogs
   */
  const loadPopularBlogs = async () => {
    try {
      const response = await BlogService.getPopularBlogs(3);
      setPopularBlogs(response.data);
    } catch (error) {
      console.error('[Blog] Error loading popular blogs:', error);
    }
  };

  /**
   * Handle search
   */
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  /**
   * Handle category filter
   */
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  /**
   * Format date helper
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter blogs based on search and category
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || blog.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Get featured blog
  const featuredBlog = blogs.find(blog => blog.featured);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
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

  return (
    <>
      <Head>
        <title>Technical Blog | Professional Developer</title>
        <meta name="description" content="Technical articles, tutorials, and insights about web development, React, Node.js, and modern programming practices." />
        <meta name="keywords" content="technical blog, web development, react, nodejs, programming, tutorials" />
        <meta property="og:title" content="Technical Blog | Professional Developer" />
        <meta property="og:description" content="Technical articles and insights about modern web development." />
        <meta property="og:type" content="website" />
      </Head>

      <div 
        id="blog-platform-main-container"
        className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      >
        
        {/* Header */}
        <header 
          id="blog-platform-header-navigation"
          className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-gray-800/95"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-8">
                <Link 
                  href="/"
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">Back to Home</span>
                  <span className="text-xs font-medium sm:hidden">Home</span>
                </Link>

                <div className="flex items-center space-x-2">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    <span className="hidden sm:inline">Technical </span>Blog
                  </h1>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                    {blogs.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  href="/terminal"
                  className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:inline"
                >
                  Terminal
                </Link>
                <Link
                  href="/portfolio"
                  className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:inline"
                >
                  Portfolio
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
                  aria-label="Toggle theme"
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
                Technical <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Insights</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
                Deep dives into web development, programming best practices, and technology insights.
                Learn from real-world experiences and practical solutions.
              </motion.p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16"
            >
              <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                {/* Search Bar */}
                <div className="w-full relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    id="blog-content-search-input-field"
                    type="text"
                    placeholder="Search articles, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  />
                </div>

                {/* Category Filter - Horizontal scroll on mobile */}
                <div className="w-full overflow-x-auto">
                  <div className="flex items-center space-x-1 sm:space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 min-w-max sm:min-w-0">
                    <FiFilter className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                    <div className="flex space-x-1">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                            selectedCategory === category
                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Info */}
              <div className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base px-4 sm:px-0">
                {searchQuery || selectedCategory !== 'all' ? (
                  <p>
                    Found {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''}
                    {searchQuery && ` for "${searchQuery}"`}
                    {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                  </p>
                ) : (
                  <p>Showing all {blogs.length} articles</p>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Blog */}
        {featuredBlog && (!searchQuery && selectedCategory === 'all') && (
          <section className="px-4 sm:px-6 mb-8 sm:mb-12 lg:mb-16">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-0.5 sm:p-1 shadow-2xl"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 xl:p-12">
                  <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
                    <div className="order-2 lg:order-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                        <span className="px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs sm:text-sm font-medium rounded-full w-fit">
                          Featured Article
                        </span>
                        <span className="px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm rounded-full w-fit">
                          {featuredBlog.categories[0] || 'General'}
                        </span>
                      </div>
                      
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
                        {featuredBlog.title}
                      </h2>
                      
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                        {featuredBlog.excerpt}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <FiUser className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">
                            {featuredBlog.author && featuredBlog.author.firstName && featuredBlog.author.lastName
                              ? `${featuredBlog.author.firstName} ${featuredBlog.author.lastName}`.trim()
                              : 'Professional Developer'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{new Date(featuredBlog.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <FiClock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{featuredBlog.readTime} min read</span>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredBlog.slug}`}
                        className="inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        Read Full Article
                        <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                      </Link>
                    </div>

                    <div className="relative order-1 lg:order-2">
                      <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <div className="text-white text-3xl sm:text-4xl lg:text-6xl opacity-50">📝</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="px-4 sm:px-6 pb-12 sm:pb-16">
          <div className="max-w-7xl mx-auto">
            {filteredBlogs.length > 0 ? (
              <motion.div
                id="blog-posts-display-grid-container"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              >
                {filteredBlogs.map((blog, index) => (
                  <motion.article
                    key={blog._id}
                    variants={fadeInUp}
                    className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                  >
                    {/* Blog Image */}
                    <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <div className="text-white text-2xl sm:text-3xl lg:text-4xl opacity-50">
                        {blog.categories.includes('react') ? '⚛️' : 
                         blog.categories.includes('nodejs') ? '🟢' :
                         blog.categories.includes('mongodb') ? '🗄️' : '💻'}
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-4 sm:p-5 lg:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-3">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded w-fit">
                          {blog.categories[0] || 'General'}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-xs">
                          <FiClock className="w-3 h-3 flex-shrink-0" />
                          <span>{blog.readTime} min read</span>
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight line-clamp-2">
                        <Link 
                          href={`/blog/${blog.slug}`}
                          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          {blog.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                        {blog.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded truncate"
                          >
                            #{tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-500 text-xs rounded">
                            +{blog.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Blog Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors flex items-center space-x-1 flex-shrink-0"
                        >
                          <span>Read</span>
                          <FiArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  No articles found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Try adjusting your search terms or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Stay Updated
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-4 sm:px-0">
                Get notified when new articles are published. No spam, unsubscribe anytime.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col gap-3 sm:gap-4 max-w-md mx-auto px-4 sm:px-0">
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base">
                  Subscribe
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
              <div className="text-gray-600 dark:text-gray-400 text-sm text-center sm:text-left">
                © 2025 Professional Developer. All rights reserved.
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <Link
                  href="/terminal"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Terminal Mode
                </Link>
                <Link
                  href="/portfolio"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Portfolio
                </Link>
                <Link
                  href="/#contact"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}