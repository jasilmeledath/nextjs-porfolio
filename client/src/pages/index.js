/**
 * @fileoverview Landing Page - Minimal Professional Interface
 * @author jasilmeledath@gmail.com
 * @created 2025-01-27
 * @lastModified 2025-08-01
 * @version 2.0.0
 * @description Mobile-first minimalistic landing page with clean professional design
 */

"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import Link from "next/link"
import { motion } from "framer-motion"
import { Terminal, Briefcase, FileText, Moon, Sun } from "lucide-react"
import { FiCode, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi"

export default function LandingPage() {
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [activeCard, setActiveCard] = useState(null)

  // Client-side hydration fix
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Theme management
  const toggleTheme = useCallback(() => {
    const newMode = !isDark
    setIsDark(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  // Initialize theme
  useEffect(() => {
    if (!isClient) return
    
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [isClient])

  // Navigation handler
  const navigate = useCallback((path) => {
    router.push(path)
  }, [router])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      y: -4,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <>
      <Head>
        <title>Jasil Meledath - Full Stack Developer</title>
        <meta
          name="description"
          content="Full Stack Developer specializing in modern web technologies. Explore my portfolio, read technical articles, or experience interactive development tools."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className={`min-h-screen transition-colors duration-500 ${
        isClient && isDark 
          ? 'bg-slate-900 text-white' 
          : 'bg-white text-slate-900'
      }`}>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="container-responsive py-6">
            <div className="flex items-center justify-between">
              {/* Brand */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-semibold text-lg tracking-tight"
              >
                jasilmeledath.me
              </motion.div>

              {/* Theme Toggle */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                onClick={toggleTheme}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                  isClient && isDark 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/10 border-black/20 text-black hover:bg-black/20'
                }`}
              >
                <div className="text-xl">{isClient && isDark ? "☀️" : "🌙"}</div>
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="relative">
          <div className="container-responsive">
            {/* Hero Section */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="py-16 sm:py-24 lg:py-32"
            >
              <div className="max-w-4xl">
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-8"
                >
                  Welcome to my
                  <br />
                  <span className={`${
                    isClient && isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Digital Universe
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className={`text-lg sm:text-xl max-w-2xl mb-12 leading-relaxed ${
                    isClient && isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Building modern web applications with clean code, thoughtful design, 
                  and scalable architecture.
                </motion.p>

                {/* Mode Selection Cards */}
                <motion.div
                  variants={containerVariants}
                  className="grid gap-6 sm:gap-8 max-w-3xl"
                >
                  {/* Developer Mode */}
                  <motion.button
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => navigate('/terminal')}
                    onHoverStart={() => setActiveCard('terminal')}
                    onHoverEnd={() => setActiveCard(null)}
                    className={`group p-6 sm:p-8 rounded-2xl border transition-all duration-300 text-left w-full ${
                      isClient && isDark
                        ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                        : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className={`p-3 sm:p-4 rounded-xl ${
                        isClient && isDark ? 'bg-slate-700' : 'bg-slate-100'
                      } group-hover:scale-110 transition-transform duration-300`}>
                        <Terminal size={24} className="text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                          Developer Mode
                        </h3>
                        <p className={`text-sm sm:text-base ${
                          isClient && isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Interactive terminal experience with command-line navigation
                        </p>
                      </div>
                    </div>
                  </motion.button>

                  {/* Portfolio Mode */}
                  <motion.button
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => navigate('/portfolio')}
                    onHoverStart={() => setActiveCard('portfolio')}
                    onHoverEnd={() => setActiveCard(null)}
                    className={`group p-6 sm:p-8 rounded-2xl border transition-all duration-300 text-left w-full ${
                      isClient && isDark
                        ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                        : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className={`p-3 sm:p-4 rounded-xl ${
                        isClient && isDark ? 'bg-slate-700' : 'bg-slate-100'
                      } group-hover:scale-110 transition-transform duration-300`}>
                        <Briefcase size={24} className="text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                          Portfolio
                        </h3>
                        <p className={`text-sm sm:text-base ${
                          isClient && isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Professional showcase of projects, skills, and experience
                        </p>
                      </div>
                    </div>
                  </motion.button>

                  {/* Blog Mode */}
                  <motion.button
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => navigate('/blog')}
                    onHoverStart={() => setActiveCard('blog')}
                    onHoverEnd={() => setActiveCard(null)}
                    className={`group p-6 sm:p-8 rounded-2xl border transition-all duration-300 text-left w-full ${
                      isClient && isDark
                        ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                        : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className={`p-3 sm:p-4 rounded-xl ${
                        isClient && isDark ? 'bg-slate-700' : 'bg-slate-100'
                      } group-hover:scale-110 transition-transform duration-300`}>
                        <FileText size={24} className="text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                          Technical Blog
                        </h3>
                        <p className={`text-sm sm:text-base ${
                          isClient && isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          In-depth articles on development, architecture, and technology
                        </p>
                      </div>
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </motion.section>

            {/* Enhanced Minimalistic Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700"
            >
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
                      Full-stack developer crafting modern web experiences and sharing insights through technical content.
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

                  {/* Services - Desktop Only */}
                  <div className="hidden lg:block">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm sm:text-base">
                      Services
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <span className="text-slate-600 dark:text-slate-300 text-sm">
                          Web Development
                        </span>
                      </li>
                      <li>
                        <span className="text-slate-600 dark:text-slate-300 text-sm">
                          Full-Stack Solutions
                        </span>
                      </li>
                      <li>
                        <span className="text-slate-600 dark:text-slate-300 text-sm">
                          Technical Consulting
                        </span>
                      </li>
                      <li>
                        <span className="text-slate-600 dark:text-slate-300 text-sm">
                          Code Review
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Mobile Quick Links */}
                <div className="sm:hidden mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-center space-x-6">
                    <Link href="/portfolio" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                      Portfolio
                    </Link>
                    <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                      Blog
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
                      © 2025 jasilmeledath.me • Made with ❤️ using Next.js
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
            </motion.footer>
          </div>
        </main>
      </div>
    </>
  )
}
