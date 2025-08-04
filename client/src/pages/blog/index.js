/**
 * @fileoverview Blog Listing Page - Professional Minimalistic Design with Advanced SEO
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-08-02
 * @version 2.0.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
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
  FiMessageSquare,
  FiHeart,
  FiShare2,
  FiBookmark,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiCode
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import BlogService from '../../services/blog-service';
import SubscriptionForm from '../../components/SubscriptionForm';

/**
 * Blog Page Component - Professional Minimalistic Design
 * @function BlogPage
 * @returns {JSX.Element} Redesigned blog page component with advanced SEO
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
  const [loadingMore, setLoadingMore] = useState(false);

  // Optimized animation variants for better performance
  const fadeInUp = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), []);

  const staggerContainer = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.02
      }
    }
  }), []);

  const cardHover = useMemo(() => ({
    rest: { 
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    hover: { 
      y: -4,
      scale: 1.01,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }), []);

  // Load blogs from API on mount
  useEffect(() => {
    loadBlogs(true); // Initial load
    loadCategories();
    loadPopularBlogs();
  }, []);

  /**
   * Load published blogs with optimized pagination
   */
  const loadBlogs = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }
      
      const params = {
        page: reset ? 1 : currentPage,
        limit: 9,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      };

      const response = await BlogService.getPublishedBlogs(params);
      
      if (response?.data?.blogs) {
        if (reset) {
          setBlogs(response.data.blogs);
        } else {
          setBlogs(prev => [...prev, ...response.data.blogs]);
        }
        
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('[Blog] Error loading blogs:', error);
      // Set fallback data to prevent errors
      if (reset) {
        setBlogs([]);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentPage, selectedCategory, searchQuery]);

  /**
   * Load categories with caching
   */
  const loadCategories = useCallback(async () => {
    try {
      const response = await BlogService.getCategories();
      setCategories(['all', ...response.data]);
    } catch (error) {
      console.error('[Blog] Error loading categories:', error);
      setCategories(['all']); // Fallback
    }
  }, []);

  /**
   * Load popular blogs for sidebar/recommendations
   */
  const loadPopularBlogs = useCallback(async () => {
    try {
      const response = await BlogService.getPopularBlogs(3);
      setPopularBlogs(response.data);
    } catch (error) {
      console.error('[Blog] Error loading popular blogs:', error);
    }
  }, []);

  /**
   * Handle search with debouncing
   */
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  /**
   * Handle category filter
   */
  const handleCategoryFilter = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  // Helper functions for data formatting and actions
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const getReadingTime = useCallback((readTime) => {
    return readTime ? `${readTime} min` : '5 min';
  }, []);

  const formatViewCount = useCallback((views) => {
    if (!views) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  }, []);

  const formatNumber = useCallback((num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }, []);

  const loadMoreBlogs = useCallback(async () => {
    if (loadingMore || currentPage >= totalPages) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await BlogService.getPublishedBlogs({
        page: nextPage,
        limit: 9,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      });

      if (response.success && response.data.blogs) {
        setBlogs(prev => [...prev, ...response.data.blogs]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more blogs:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, currentPage, totalPages, selectedCategory, searchQuery]);

  // Load data on mount and when filters change
  useEffect(() => {
    loadBlogs(true); // Reset blogs when filters change
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (currentPage > 1) {
      loadBlogs(); // Load more blogs only when page changes and not first page
    }
  }, [currentPage]);

  useEffect(() => {
    loadCategories();
    loadPopularBlogs();
  }, []);

  // Optimized filtered blogs with memoization
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = !searchQuery || 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        (blog.categories || []).includes(selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  // Get featured blog with memoization
  const featuredBlog = useMemo(() => {
    return blogs.find(blog => blog.featured) || blogs[0];
  }, [blogs]);

  // SEO metadata generation
  const generateSEOData = useMemo(() => {
    const baseTitle = "Technical Blog | Professional Developer Insights";
    const baseDescription = "Discover cutting-edge web development tutorials, programming best practices, and technical insights. Learn React, Node.js, MongoDB, and modern development techniques.";
    
    let title = baseTitle;
    let description = baseDescription;
    
    if (searchQuery) {
      title = `Search: ${searchQuery} | Technical Blog`;
      description = `Search results for "${searchQuery}" - ${filteredBlogs.length} articles found about ${searchQuery}.`;
    } else if (selectedCategory !== 'all') {
      title = `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Articles | Technical Blog`;
      description = `Explore ${selectedCategory} tutorials and insights. In-depth articles about ${selectedCategory} development.`;
    }
    
    return { title, description };
  }, [searchQuery, selectedCategory, filteredBlogs.length]);

  // Structured Data for SEO
  const structuredData = useMemo(() => {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Professional Developer Blog",
      "url": "https://yourdomain.com/blog",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://yourdomain.com/blog?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    };

    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Technical Blog",
      "description": "Professional web development insights and tutorials",
      "url": "https://yourdomain.com/blog",
      "author": {
        "@type": "Person",
        "name": "Professional Developer"
      },
      "blogPost": filteredBlogs.slice(0, 5).map(blog => ({
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.excerpt,
        "url": `https://yourdomain.com/blog/${blog.slug}`,
        "datePublished": blog.publishedAt || blog.createdAt,
        "dateModified": blog.updatedAt || blog.publishedAt || blog.createdAt,
        "author": {
          "@type": "Person",
          "name": blog.author?.firstName && blog.author?.lastName 
            ? `${blog.author.firstName} ${blog.author.lastName}` 
            : "Professional Developer"
        },
        "image": blog.featuredImage?.url || "/placeholder.svg",
        "articleSection": blog.categories?.[0] || "Technology",
        "keywords": blog.tags?.join(", ") || "",
        "wordCount": blog.content?.split(' ').length || 1000,
        "timeRequired": `PT${blog.readTime || 5}M`,
        "interactionStatistic": [
          {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/ReadAction",
            "userInteractionCount": blog.views || 0
          },
          {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/LikeAction", 
            "userInteractionCount": blog.likes || 0
          }
        ]
      }))
    };

    return JSON.stringify([websiteSchema, blogSchema]);
  }, [filteredBlogs]);

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{generateSEOData.title}</title>
        <meta name="title" content={generateSEOData.title} />
        <meta name="description" content={generateSEOData.description} />
        <meta name="keywords" content="technical blog, web development, react, nodejs, programming, tutorials, javascript, typescript, mongodb, next.js" />
        <meta name="author" content="Professional Developer" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://yourdomain.com/blog${searchQuery ? `?search=${searchQuery}` : ''}${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Professional Developer Blog" />
        <meta property="og:title" content={generateSEOData.title} />
        <meta property="og:description" content={generateSEOData.description} />
        <meta property="og:url" content="https://yourdomain.com/blog" />
        <meta property="og:image" content="https://yourdomain.com/blog-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
        <meta name="twitter:creator" content="@yourtwitterhandle" />
        <meta name="twitter:title" content={generateSEOData.title} />
        <meta name="twitter:description" content={generateSEOData.description} />
        <meta name="twitter:image" content="https://yourdomain.com/blog-twitter-image.jpg" />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Font optimization */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <main 
        id="blog-platform-main-container"
        className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        
        {/* Professional Header */}
        <header 
          id="blog-platform-header-navigation"
          className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm"
        >
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-8">
                <Link 
                  href="/"
                  className="flex items-center space-x-1 sm:space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
                >
                  <FiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">Back to Home</span>
                  <span className="text-xs font-medium sm:hidden">Back</span>
                </Link>

                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">B</span>
                    </div>
                    <div>
                      <h1 className="text-sm sm:text-xl font-bold text-slate-900 dark:text-white">
                        Technical Blog
                      </h1>
                      <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block">
                        Professional Insights
                      </p>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    {filteredBlogs.length}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  href="/terminal"
                  className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors hidden md:inline"
                >
                  Terminal
                </Link>
                <Link
                  href="/portfolio"
                  className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:inline"
                >
                  Portfolio
                </Link>
                <motion.button
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 sm:p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/10 border-black/20 text-black hover:bg-black/20'
                  }`}
                  aria-label="Toggle theme"
                >
                  <div className="text-sm sm:text-xl">{isDark ? '☀️' : '🌙'}</div>
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Professional Hero Section */}
        <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center mb-8 sm:mb-12"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
                  Technical 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500"> Insights</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed px-2">
                  Deep dives into web development, programming best practices, and technology insights.
                  <br className="hidden sm:block" />
                  Learn from real-world experiences and practical solutions.
                </p>
              </motion.div>

              {/* Key Statistics */}
              <motion.div variants={fadeInUp} className="flex items-center justify-center space-x-4 sm:space-x-8 mb-6 sm:mb-8">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{blogs.length}+</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{Math.max(categories.length - 1, 0)}+</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {blogs.reduce((acc, blog) => acc + (blog.views || 0), 0) > 1000 
                      ? `${Math.round(blogs.reduce((acc, blog) => acc + (blog.views || 0), 0) / 1000)}k+` 
                      : `${blogs.reduce((acc, blog) => acc + (blog.views || 0), 0) || 0}+`}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Readers</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Search and Filters */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
                {/* Search Bar */}
                <div className="relative mb-4 sm:mb-6">
                  <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    id="blog-content-search-input-field"
                    type="text"
                    placeholder="Search articles, technologies..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200 outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 capitalize ${
                        selectedCategory === category
                          ? 'bg-blue-500 text-white shadow-md transform scale-105'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {category === 'all' ? 'All' : category}
                    </button>
                  ))}
                </div>

                {/* Results Info */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center">
                    {searchQuery || selectedCategory !== 'all' ? (
                      <>
                        Found <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredBlogs.length}</span> article{filteredBlogs.length !== 1 ? 's' : ''}
                        {searchQuery && <> for "<span className="font-medium">{searchQuery}</span>"</>}
                        {selectedCategory !== 'all' && <> in <span className="font-medium capitalize">{selectedCategory}</span></>}
                      </>
                    ) : (
                      <>Showing all <span className="font-semibold text-slate-700 dark:text-slate-300">{blogs.length}</span> articles</>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredBlog && (!searchQuery && selectedCategory === 'all') && (
          <section className="px-3 sm:px-6 py-8 sm:py-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700"
              >
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="p-4 sm:p-6 lg:p-8 xl:p-12">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-medium rounded-full">
                        ⭐ Featured
                      </div>
                      <div className="px-2 sm:px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium rounded-full">
                        {featuredBlog.categories?.[0] || 'Technology'}
                      </div>
                    </div>
                    
                    <h2 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 leading-tight">
                      {featuredBlog.title}
                    </h2>
                    
                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {featuredBlog.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 sm:mb-8">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">
                          {featuredBlog.author?.firstName && featuredBlog.author?.lastName
                            ? `${featuredBlog.author.firstName} ${featuredBlog.author.lastName}`
                            : 'Professional Developer'}
                        </span>
                        <span className="sm:hidden">Author</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{formatDate(featuredBlog.publishedAt || featuredBlog.createdAt)}</span>
                        <span className="sm:hidden">{new Date(featuredBlog.publishedAt || featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <FiClock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{getReadingTime(featuredBlog.readTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{formatViewCount(featuredBlog.views)}</span>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${featuredBlog.slug}`}
                      className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                    >
                      <span className="hidden sm:inline">Read Full Article</span>
                      <span className="sm:hidden">Read Article</span>
                      <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                    </Link>
                  </div>

                  <div className="relative lg:h-full min-h-[300px] bg-gradient-to-br from-blue-500 to-indigo-600">
                    {featuredBlog.featuredImage?.url ? (
                      <img
                        src={featuredBlog.featuredImage.url}
                        alt={featuredBlog.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-white/80">
                          <div className="text-6xl mb-4">📝</div>
                          <p className="text-lg font-medium">Featured Article</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Professional Blog Cards Grid */}
        <section className="px-3 sm:px-6 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              /* Loading Skeleton */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="h-40 sm:h-48 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                    <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
                      <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-5 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBlogs.length > 0 ? (
              <>
                <motion.div
                  id="blog-posts-display-grid-container"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                >
                  {filteredBlogs.map((blog, index) => (
                    <motion.article
                      key={blog._id}
                      variants={fadeInUp}
                      initial="rest"
                      whileHover="hover"
                      className="group cursor-pointer"
                      style={{ willChange: 'transform' }}
                    >
                      <motion.div
                        variants={cardHover}
                        className="h-full bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300"
                      >
                        {/* Featured Image */}
                        <div className="relative aspect-video overflow-hidden">
                          {blog.featuredImage?.url ? (
                            <Image
                              src={blog.featuredImage.url}
                              alt={blog.featuredImage.alt || blog.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              onError={(e) => {
                                console.error(`Image failed to load for blog "${blog.title}":`, {
                                  src: blog.featuredImage.url,
                                  error: e.target.error || 'Unknown error'
                                });
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* Fallback placeholder */}
                          <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ${blog.featuredImage?.url ? 'hidden' : 'flex'}`}>
                              <div className="text-white text-4xl opacity-80">
                                {blog.categories?.includes('react') ? '⚛️' : 
                                 blog.categories?.includes('nodejs') ? '🟢' :
                                 blog.categories?.includes('mongodb') ? '🗄️' : 
                                 blog.categories?.includes('javascript') ? '📄' :
                                 blog.categories?.includes('typescript') ? '🔷' : '💻'}
                              </div>
                            </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                            <span className="px-2 sm:px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium rounded-full">
                              {blog.categories?.[0] || 'Technology'}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 sm:p-4 lg:p-6">
                          <div className="mb-3 sm:mb-4">
                            <Link href={`/blog/${blog.slug}`}>
                              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                                {blog.title}
                              </h3>
                            </Link>
                          </div>

                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 text-sm sm:text-base">
                            {blog.excerpt}
                          </p>

                          {/* Tags */}
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                              {blog.tags.slice(0, 2).map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 sm:py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {blog.tags.length > 2 && (
                                <span className="px-2 py-0.5 sm:py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-500 text-xs font-medium rounded">
                                  +{blog.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Meta Information */}
                          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="flex items-center space-x-1">
                                <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">{formatDate(blog.publishedAt || blog.createdAt)}</span>
                                <span className="sm:hidden">{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FiClock className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{getReadingTime(blog.readTime)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="flex items-center space-x-1">
                                <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{formatViewCount(blog.views)}</span>
                              </div>
                              <Link
                                href={`/blog/${blog.slug}`}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center space-x-1"
                              >
                                <span className="hidden sm:inline">Read</span>
                                <span className="sm:hidden">→</span>
                                <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform hidden sm:inline" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.article>
                  ))}
                </motion.div>

                {/* Load More Button */}
                {currentPage < totalPages && (
                  <div className="text-center mt-8 sm:mt-12">
                    <button
                      onClick={loadMoreBlogs}
                      disabled={loadingMore}
                      className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg sm:rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {loadingMore ? (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span className="hidden sm:inline">Loading...</span>
                          <span className="sm:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Load More Articles</span>
                          <span className="sm:hidden">Load More</span>
                          <FiChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center py-12 sm:py-20 px-4"
              >
                <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 opacity-50">📝</div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
                  No articles found
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                  We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={() => {
                      handleSearch('');
                      handleCategoryFilter('all');
                    }}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg sm:rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                  <Link
                    href="/portfolio"
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg sm:rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 text-sm sm:text-base"
                  >
                    View Portfolio
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        {/* Newsletter Subscription Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-8"
            >
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <SubscriptionForm position="inline" />
            </motion.div>
          </div>
        </section>

        {/* Enhanced Minimalistic Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Brand & Social - Mobile Optimized */}
              <div className="sm:col-span-2 lg:col-span-2">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <FiCode className="text-slate-700 dark:text-slate-300 w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    jasilmeledath.me
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base leading-relaxed">
                  Designing dynamic web experiences and sharing insights with the broader tech world
                </p>
                <div className="flex space-x-3 sm:space-x-4">
                  <a 
                    href="https://github.com/jasilmeledath" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    aria-label="GitHub Profile"
                  >
                    <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a 
                    href="https://linkedin.com/in/jasilmeledath" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    aria-label="LinkedIn Profile"
                  >
                    <FiLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a 
                    href="https://twitter.com/jasilmeledath" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    aria-label="Twitter Profile"
                  >
                    <FiTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links - Mobile Optimized */}
              <div className="hidden sm:block">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">
                  Navigation
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/portfolio" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base">
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/terminal" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base">
                      Terminal
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Categories - Desktop Only */}
              <div className="hidden lg:block">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm sm:text-base">
                  Topics
                </h3>
                <ul className="space-y-2">
                  {categories.filter(cat => cat !== 'all').slice(0, 4).map(category => (
                    <li key={category}>
                      <button
                        onClick={() => handleCategoryFilter(category)}
                        className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left text-sm capitalize"
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile Quick Links */}
            <div className="sm:hidden mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-center space-x-6">
                <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                  Home
                </Link>
                <Link href="/portfolio" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                  Portfolio
                </Link>
                <Link href="/terminal" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                  Terminal
                </Link>
              </div>
            </div>

            {/* Bottom Section - Minimalistic */}
            <div className="border-t border-slate-200 dark:border-slate-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm text-center sm:text-left">
                  © 2025 jasilmeledath.me • Crafted with NextJS & Passion ❤
                </p>
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <a 
                    href="mailto:jasilmeledath@gmail.com" 
                    className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs sm:text-sm transition-colors"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}