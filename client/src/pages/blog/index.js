/**
 * @fileoverview Blog Listing Page - SEO-Optimized Content Platform
 * @author Professional Developer <dev@portfolio.com>
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
  FiChevronDown,
  FiX
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

/**
 * Blog Page Component
 * @function BlogPage
 * @returns {JSX.Element} Blog page component
 */
export default function BlogPage() {
  const { toggleTheme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Building Scalable React Applications with Next.js",
      excerpt: "Learn how to build production-ready React applications with Next.js, including server-side rendering, static generation, and performance optimization techniques.",
      content: "Full article content here...",
      slug: "building-scalable-react-nextjs",
      category: "React",
      tags: ["React", "Next.js", "Performance", "SSR"],
      author: "Professional Developer",
      publishDate: "2025-01-20",
      readTime: "8 min read",
      featured: true,
      image: "/api/placeholder/800/400"
    },
    {
      id: 2,
      title: "Node.js Performance Optimization: Best Practices",
      excerpt: "Discover essential techniques for optimizing Node.js applications, from memory management to database queries and caching strategies.",
      content: "Full article content here...",
      slug: "nodejs-performance-optimization",
      category: "Node.js",
      tags: ["Node.js", "Performance", "Backend", "Optimization"],
      author: "Professional Developer",
      publishDate: "2025-01-15",
      readTime: "12 min read",
      featured: true,
      image: "/api/placeholder/800/400"
    },
    {
      id: 3,
      title: "MongoDB Aggregation Pipeline: Advanced Queries",
      excerpt: "Master MongoDB's aggregation framework to perform complex data transformations and analytics queries efficiently.",
      content: "Full article content here...",
      slug: "mongodb-aggregation-pipeline",
      category: "Database",
      tags: ["MongoDB", "Database", "Aggregation", "NoSQL"],
      author: "Professional Developer",
      publishDate: "2025-01-10",
      readTime: "10 min read",
      featured: false,
      image: "/api/placeholder/800/400"
    },
    {
      id: 4,
      title: "Docker for Developers: A Complete Guide",
      excerpt: "From basics to advanced concepts, learn how to use Docker to containerize your applications and streamline your development workflow.",
      content: "Full article content here...",
      slug: "docker-complete-guide",
      category: "DevOps",
      tags: ["Docker", "DevOps", "Containers", "Development"],
      author: "Professional Developer",
      publishDate: "2025-01-05",
      readTime: "15 min read",
      featured: false,
      image: "/api/placeholder/800/400"
    }
  ];

  const categories = ["all", "React", "Node.js", "Database", "DevOps"];

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);

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
        id={BLOG_IDS.MAIN_CONTAINER}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      >
        
        {/* Header */}
        <header 
          id={BLOG_IDS.BLOG_HEADER}
          className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link 
                  href="/"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Home</span>
                </Link>

                <div className="hidden md:flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Technical Blog
                  </h1>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                    {blogPosts.length} articles
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/terminal"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Terminal
                </Link>
                <Link
                  href="/portfolio"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Portfolio
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Technical <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Insights</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Deep dives into web development, programming best practices, and technology insights.
                Learn from real-world experiences and practical solutions.
              </motion.p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-4xl mx-auto mb-16"
            >
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id={BLOG_IDS.BLOG_SEARCH_BAR}
                    type="text"
                    placeholder="Search articles, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                  <Filter className="w-4 h-4 text-gray-400 ml-2" />
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                        selectedCategory === category
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Info */}
              <div className="text-center text-gray-600 dark:text-gray-400">
                {searchQuery || selectedCategory !== 'all' ? (
                  <p>
                    Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                    {searchQuery && ` for "${searchQuery}"`}
                    {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                  </p>
                ) : (
                  <p>Showing all {blogPosts.length} articles</p>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (!searchQuery && selectedCategory === 'all') && (
          <section className="px-6 mb-16">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-1 shadow-2xl"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-medium rounded-full">
                          Featured Article
                        </span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                          {featuredPost.category}
                        </span>
                      </div>
                      
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {featuredPost.title}
                      </h2>
                      
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>

                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(featuredPost.publishDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>

                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <div className="text-white text-6xl opacity-50">📝</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {filteredPosts.length > 0 ? (
              <motion.div
                id={BLOG_IDS.POSTS_GRID}
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    variants={fadeInUp}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
                  >
                    {/* Post Image */}
                    <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <div className="text-white text-4xl opacity-50">
                        {post.category === 'React' ? '⚛️' : 
                         post.category === 'Node.js' ? '🟢' :
                         post.category === 'Database' ? '🗄️' : '🐳'}
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded">
                          {post.category}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Post Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                        >
                          Read more →
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
        <section className="px-6 py-16 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Stay Updated
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Get notified when new articles are published. No spam, unsubscribe anytime.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap">
                  Subscribe
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                © 2025 Professional Developer. All rights reserved.
              </div>
              <div className="flex items-center space-x-6">
                <Link
                  href="/terminal"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Terminal Mode
                </Link>
                <Link
                  href="/portfolio"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Portfolio
                </Link>
                <Link
                  href="/#contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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