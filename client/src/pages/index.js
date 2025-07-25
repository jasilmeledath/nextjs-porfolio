/**
 * @fileoverview Landing Page - Three-Way Navigation Hub
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Terminal, Code, Briefcase, FileText, ChevronDown, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [userPreference, setUserPreference] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef(null)

  // Simple scroll tracking without transform effects
  const { scrollY } = useScroll()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Client-side hydration fix
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Enhanced dark mode toggle functionality
  const toggleDarkMode = () => {
    const newMode = !isDark
    setIsDark(newMode)
    
    // Apply to document class for global theme
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Initialize theme from localStorage - only on client
  useEffect(() => {
    if (!isClient) return
    
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [isClient])

  const trackUserPreference = (mode) => {
    setUserPreference(mode)
    localStorage.setItem("preferred_mode", mode)
  }

  const navigateToMode = (mode, path) => {
    trackUserPreference(mode)
    router.push(path)
  }

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15,
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  const cardVariants = {
    hidden: {
      y: 80,
      opacity: 0,
      scale: 0.9,
      rotateX: 15,
      rotateY: 5,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 1,
      },
    },
    hover: {
      y: -20,
      scale: 1.05,
      rotateX: -5,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  }

  const heroVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  return (
    <>
      <Head>
        <title>Professional Portfolio - Choose Your Experience</title>
        <meta
          name="description"
          content="Experience my portfolio in three unique ways: Developer Mode with terminal interface, Professional Portfolio, or Technical Blog."
        />
      </Head>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
          isClient && isDark 
            ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
            : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        }`}
      >
        {/* Static Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Static geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96">
            <div className={`w-full h-full rounded-full blur-3xl animate-pulse ${
              isClient && isDark 
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20' 
                : 'bg-gradient-to-r from-cyan-300/30 to-blue-300/30'
            }`} />
          </div>

          <div className="absolute top-3/4 right-1/4 w-80 h-80">
            <div className={`w-full h-full rounded-full blur-3xl animate-pulse ${
              isClient && isDark 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
                : 'bg-gradient-to-r from-purple-300/30 to-pink-300/30'
            }`} />
          </div>

          {/* Simple Grid */}
          <div className={`absolute inset-0 bg-[size:50px_50px] ${
            isClient && isDark 
              ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]' 
              : 'bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]'
          } [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]`} />
        </div>

        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 p-6"
        >
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-cyan-400/30 to-purple-600/30 rounded-2xl blur-lg animate-pulse" />
              </div>
              <span className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                isClient && isDark 
                  ? 'from-white to-gray-300' 
                  : 'from-gray-800 to-gray-600'
              }`}>
                Portfolio
              </span>
            </motion.div>

            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className={`relative p-3 rounded-2xl backdrop-blur-md border transition-all duration-300 shadow-lg ${
                isClient && isDark 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-black/10 border-black/20 text-black hover:bg-black/20'
              }`}
            >
              <div className="text-xl">{isClient && isDark ? "☀️" : "🌙"}</div>
            </motion.button>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="relative z-10 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={containerVariants}
              className="text-center mb-32"
            >
              <motion.div variants={heroVariants} className="relative">
                <motion.h1 className={`text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight ${
                  isClient && isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  <motion.span
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="block"
                  >
                    Welcome to My
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent relative"
                  >
                    Digital Universe
                    <motion.div
                      className="absolute -inset-8 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 blur-2xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </motion.span>
                </motion.h1>

                <motion.p
                  variants={heroVariants}
                  className={`text-xl md:text-2xl mb-16 max-w-4xl mx-auto leading-relaxed ${
                    isClient && isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Choose your adventure through my professional journey.
                  <br />
                  Each pathway reveals unique insights into my world of development.
                </motion.p>

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="flex flex-col items-center mt-20"
                >
                  <p className={`mb-4 font-medium ${isClient && isDark ? 'text-gray-400' : 'text-gray-500'}`}>Choose your path</p>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className={`p-3 rounded-full backdrop-blur-sm border ${
                      isClient && isDark 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-black/10 border-black/20'
                    }`}
                  >
                    <ChevronDown className={`w-6 h-6 ${isClient && isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Mode Selection Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
              {/* Developer Mode Card */}
              <motion.div variants={cardVariants} whileHover="hover" className="group relative perspective-1000">
                <div className={`relative backdrop-blur-xl rounded-3xl p-8 border shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 overflow-hidden transform-gpu ${
                  isClient && isDark 
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20' 
                    : 'bg-gradient-to-br from-black/5 to-black/2 border-black/10'
                }`}>
                  {/* 3D Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Code pattern background */}
                  <div className="absolute top-0 right-0 w-40 h-40 opacity-5 group-hover:opacity-20 transition-opacity duration-500">
                    <div className="text-xs font-mono leading-tight text-cyan-400 transform rotate-12">
                      {"<div>\n  <code>\n    magic\n  </code>\n</div>"}
                    </div>
                  </div>

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotateY: 10 }}
                      className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-cyan-500/50 transition-all duration-300"
                    >
                      <Terminal className="w-10 h-10 text-white" />
                    </motion.div>

                    <h3 className={`text-3xl font-bold mb-6 group-hover:text-cyan-400 transition-colors duration-300 ${
                      isClient && isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Developer Mode
                    </h3>

                    <p className={`mb-8 leading-relaxed text-lg ${
                      isClient && isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Experience an interactive terminal interface with syntax highlighting, auto-completion, and
                      realistic command-line navigation.
                    </p>

                    <div className="space-y-4 mb-8">
                      {[
                        "Interactive terminal emulator",
                        "Syntax highlighting & completion",
                        "Real-time command feedback",
                      ].map((feature, index) => (
                        <motion.div
                          key={feature}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                          <span className={`font-medium ${isClient && isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      onClick={() => navigateToMode("developer", "/terminal")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 relative overflow-hidden group/btn"
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <Terminal className="w-5 h-5" />
                        <span>Launch Terminal</span>
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Portfolio Mode Card */}
              <motion.div variants={cardVariants} whileHover="hover" className="group relative perspective-1000">
                <div className={`relative backdrop-blur-xl rounded-3xl p-8 border shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 overflow-hidden transform-gpu ${
                  isClient && isDark 
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20' 
                    : 'bg-gradient-to-br from-black/5 to-black/2 border-black/10'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotateY: -10 }}
                      className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-300"
                    >
                      <Briefcase className="w-10 h-10 text-white" />
                    </motion.div>

                    <h3 className={`text-3xl font-bold mb-6 group-hover:text-blue-400 transition-colors duration-300 ${
                      isClient && isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Professional Portfolio
                    </h3>

                    <p className={`mb-8 leading-relaxed text-lg ${
                      isClient && isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      A sleek showcase featuring 3D animations, interactive project demos, and comprehensive skill
                      matrices for professional connections.
                    </p>

                    <div className="space-y-4 mb-8">
                      {["3D animated backgrounds", "Interactive project showcase", "Professional presentation"].map(
                        (feature, index) => (
                          <motion.div
                            key={feature}
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            <span className={`font-medium ${isClient && isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                          </motion.div>
                        ),
                      )}
                    </div>

                    <motion.button
                      onClick={() => navigateToMode("visitor", "/portfolio")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/50 relative overflow-hidden group/btn"
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <Briefcase className="w-5 h-5" />
                        <span>View Portfolio</span>
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Blog Mode Card */}
              <motion.div variants={cardVariants} whileHover="hover" className="group relative perspective-1000">
                <div className={`relative backdrop-blur-xl rounded-3xl p-8 border shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 overflow-hidden transform-gpu ${
                  isClient && isDark 
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20' 
                    : 'bg-gradient-to-br from-black/5 to-black/2 border-black/10'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotateY: 10 }}
                      className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300"
                    >
                      <FileText className="w-10 h-10 text-white" />
                    </motion.div>

                    <h3 className={`text-3xl font-bold mb-6 group-hover:text-purple-400 transition-colors duration-300 ${
                      isClient && isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Technical Blog
                    </h3>

                    <p className={`mb-8 leading-relaxed text-lg ${
                      isClient && isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Deep-dive articles with syntax highlighting, interactive demos, and comprehensive tutorials on
                      cutting-edge technologies.
                    </p>

                    <div className="space-y-4 mb-8">
                      {["Syntax-highlighted code snippets", "Interactive comment system", "SEO-optimized content"].map(
                        (feature, index) => (
                          <motion.div
                            key={feature}
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                            <span className={`font-medium ${isClient && isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                          </motion.div>
                        ),
                      )}
                    </div>

                    <motion.button
                      onClick={() => navigateToMode("blog", "/blog")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50 relative overflow-hidden group/btn"
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Read Articles</span>
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Access Links */}
            <motion.div variants={containerVariants} className="text-center">
              <motion.p variants={cardVariants} className={`mb-8 text-lg ${isClient && isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Looking for something specific?
              </motion.p>
              <motion.div variants={cardVariants} className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/admin/login"
                  className={`px-6 py-3 transition-colors duration-200 rounded-xl backdrop-blur-sm border ${
                    isClient && isDark 
                      ? 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10' 
                      : 'text-gray-600 hover:text-gray-900 bg-black/5 hover:bg-black/10 border-black/10'
                  }`}
                >
                  Admin Access
                </Link>
                <Link
                  href="/portfolio#contact"
                  className={`px-6 py-3 transition-colors duration-200 rounded-xl backdrop-blur-sm border ${
                    isClient && isDark 
                      ? 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10' 
                      : 'text-gray-600 hover:text-gray-900 bg-black/5 hover:bg-black/10 border-black/10'
                  }`}
                >
                  Contact Me
                </Link>
                <Link
                  href="/portfolio#resume"
                  className={`px-6 py-3 transition-colors duration-200 rounded-xl backdrop-blur-sm border ${
                    isClient && isDark 
                      ? 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10' 
                      : 'text-gray-600 hover:text-gray-900 bg-black/5 hover:bg-black/10 border-black/10'
                  }`}
                >
                  Download Resume
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </motion.div>
    </>
  )
}
