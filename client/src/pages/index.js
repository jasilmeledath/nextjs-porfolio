/**
 * @fileoverview Landing Page - Three-Way Navigation Hub
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, User, BookOpen, Code, Briefcase, FileText } from 'lucide-react';

import { LANDING_PAGE_IDS } from '../constants/component-ids';
import { useTheme } from '../context/ThemeContext';

/**
 * Landing Page Component
 * @function LandingPage
 * @returns {JSX.Element} Landing page component
 */
export default function LandingPage() {
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const [userPreference, setUserPreference] = useState(null);

  /**
   * Track user's preferred mode
   * @function trackUserPreference
   * @param {string} mode - Selected mode
   */
  const trackUserPreference = (mode) => {
    setUserPreference(mode);
    localStorage.setItem('preferred_mode', mode);
    
    // Analytics tracking (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'mode_selection', {
        event_category: 'engagement',
        event_label: mode,
        value: 1
      });
    }
  };

  /**
   * Navigate to selected mode
   * @function navigateToMode
   * @param {string} mode - Mode to navigate to
   * @param {string} path - Path to navigate to
   */
  const navigateToMode = (mode, path) => {
    trackUserPreference(mode);
    router.push(path);
  };

  // Load user preference on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('preferred_mode');
    if (savedPreference) {
      setUserPreference(savedPreference);
    }
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const iconVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 }
  };

  return (
    <>
      <Head>
        <title>Professional Portfolio - Choose Your Experience</title>
        <meta name="description" content="Experience my portfolio in three unique ways: Developer Mode with terminal interface, Professional Portfolio, or Technical Blog. Choose your preferred experience." />
        <meta name="keywords" content="portfolio, developer, terminal, blog, professional, full-stack, react, nodejs" />
        <meta property="og:title" content="Professional Portfolio - Choose Your Experience" />
        <meta property="og:description" content="Experience my portfolio in three unique ways: Developer Mode, Professional Portfolio, or Technical Blog." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://yourportfolio.com'} />
      </Head>

      <div 
        id={LANDING_PAGE_IDS.MAIN_CONTAINER}
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300"
      >
        {/* Header */}
        <header className="relative z-10 p-6">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Portfolio</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white/20 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            
            {/* Hero Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center mb-16"
            >
              <motion.h1
                id={LANDING_PAGE_IDS.HERO_TITLE}
                variants={cardVariants}
                className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Welcome to My
                <span className="block text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Digital Space
                </span>
              </motion.h1>

              <motion.p
                id={LANDING_PAGE_IDS.SUBTITLE_DESCRIPTION}
                variants={cardVariants}
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Choose your preferred way to explore my work, skills, and thoughts. 
                Each experience is crafted to showcase different aspects of my professional journey.
              </motion.p>

              {/* User preference indicator */}
              {userPreference && (
                <motion.div
                  id={LANDING_PAGE_IDS.PREFERENCE_TRACKER}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium mb-8"
                >
                  ✨ Last visited: {userPreference} Mode
                </motion.div>
              )}
            </motion.div>

            {/* Mode Selection Grid */}
            <motion.div
              id={LANDING_PAGE_IDS.MODE_SELECTION_GRID}
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8 mb-16"
            >
              
              {/* Developer Mode Card */}
              <motion.div
                id={LANDING_PAGE_IDS.DEVELOPER_CARD}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                className="group relative"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <motion.div
                      id={LANDING_PAGE_IDS.DEVELOPER_ICON}
                      variants={iconVariants}
                      initial="rest"
                      whileHover="hover"
                      className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <Terminal className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 
                      id={LANDING_PAGE_IDS.DEVELOPER_TITLE}
                      className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                      Developer Mode
                    </h3>

                    <p 
                      id={LANDING_PAGE_IDS.DEVELOPER_DESCRIPTION}
                      className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                    >
                      Experience an interactive terminal interface. Perfect for developers who love 
                      command-line interfaces and want to explore my skills through terminal commands.
                    </p>

                    <div className="space-y-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Interactive terminal emulator</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Command-line portfolio navigation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Dark theme optimized</span>
                      </div>
                    </div>

                    <button
                      id={LANDING_PAGE_IDS.DEVELOPER_CTA_BUTTON}
                      onClick={() => navigateToMode('developer', '/terminal')}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Launch Terminal
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Visitor Mode Card */}
              <motion.div
                id={LANDING_PAGE_IDS.VISITOR_CARD}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                className="group relative"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <motion.div
                      id={LANDING_PAGE_IDS.VISITOR_ICON}
                      variants={iconVariants}
                      initial="rest"
                      whileHover="hover"
                      className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <Briefcase className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 
                      id={LANDING_PAGE_IDS.VISITOR_TITLE}
                      className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                      Professional Portfolio
                    </h3>

                    <p 
                      id={LANDING_PAGE_IDS.VISITOR_DESCRIPTION}
                      className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                    >
                      A clean, professional showcase of my work, skills, and experience. 
                      Ideal for recruiters, clients, and professional connections.
                    </p>

                    <div className="space-y-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Professional presentation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Project showcase & skills matrix</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Light theme optimized</span>
                      </div>
                    </div>

                    <button
                      id={LANDING_PAGE_IDS.VISITOR_CTA_BUTTON}
                      onClick={() => navigateToMode('visitor', '/portfolio')}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      View Portfolio
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Blog Mode Card */}
              <motion.div
                id={LANDING_PAGE_IDS.BLOG_CARD}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                className="group relative"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <motion.div
                      id={LANDING_PAGE_IDS.BLOG_ICON}
                      variants={iconVariants}
                      initial="rest"
                      whileHover="hover"
                      className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <FileText className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 
                      id={LANDING_PAGE_IDS.BLOG_TITLE}
                      className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                      Technical Blog
                    </h3>

                    <p 
                      id={LANDING_PAGE_IDS.BLOG_DESCRIPTION}
                      className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                    >
                      Dive into my thoughts on technology, development practices, and industry insights. 
                      SEO-optimized articles with an interactive comment system.
                    </p>

                    <div className="space-y-2 mb-6 text-sm text-gray-500 dark-text-gray-400">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Technical articles & tutorials</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Interactive comments system</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>SEO optimized content</span>
                      </div>
                    </div>

                    <button
                      id={LANDING_PAGE_IDS.BLOG_CTA_BUTTON}
                      onClick={() => navigateToMode('blog', '/blog')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Read Articles
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Access Links */}
            <motion.div
              variants={containerVariants}
              className="text-center"
            >
              <motion.p
                variants={cardVariants}
                className="text-gray-600 dark:text-gray-400 mb-6"
              >
                Looking for something specific?
              </motion.p>
              
              <motion.div
                variants={cardVariants}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link
                  href="/admin/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Admin Access
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link
                  href="/portfolio#contact"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Contact Me
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link
                  href="/portfolio#resume"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Download Resume
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>

        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Analytics tracker */}
        <div id={LANDING_PAGE_IDS.ANALYTICS_TRACKER} className="sr-only">
          Landing page loaded
        </div>
      </div>
    </>
  );
}