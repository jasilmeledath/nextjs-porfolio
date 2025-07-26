/**
 * @fileoverview Portfolio Page - Professional Visitor Mode
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import Head from "next/head"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import {
  ArrowLeft,
  Download,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  MapPin,
  Code,
  Database,
  Server,
  Smartphone,
  Zap,
  Globe,
  Terminal,
  FileText,
} from "lucide-react"
import { usePortfolioData } from "../hooks/usePortfolioData"
import HangingIDCard from "../components/ui/HangingIDCard"
import ProjectPreview from "../components/ui/ProjectPreview"

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState("hero")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isDark, setIsDark] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isProjectPreviewOpen, setIsProjectPreviewOpen] = useState(false)
  const containerRef = useRef(null)

  // Load portfolio data from backend
  const { portfolioData, loading, error } = usePortfolioData()
  const { personalInfo, socialLinks, skills, projects, experience } = portfolioData

  // Debug log for projects
  useEffect(() => {
    if (projects.length > 0) {
      console.log('Projects loaded:', projects.length);
      console.log('First project image:', projects[0]?.image);
    }
  }, [projects]);

  // Enhanced scroll animations
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, -100])
  const y2 = useTransform(scrollY, [0, 500], [0, -50])
  const rotateX = useTransform(scrollY, [0, 500], [0, 5])

  // Mouse tracking for 3D effects
  const springConfig = { stiffness: 150, damping: 15 }
  const mouseX = useSpring(0, springConfig)
  const mouseY = useSpring(0, springConfig)

  // Transform values for 3D animations
  const mouseTransformX1 = useTransform(mouseX, [-20, 20], [-100, 100])
  const mouseTransformY1 = useTransform(mouseY, [-20, 20], [-100, 100])
  const mouseRotateX1 = useTransform(mouseY, [-20, 20], [10, -10])
  const mouseRotateY1 = useTransform(mouseX, [-20, 20], [-10, 10])
  
  const mouseTransformX2 = useTransform(mouseX, [-20, 20], [50, -50])
  const mouseTransformY2 = useTransform(mouseY, [-20, 20], [50, -50])
  const mouseRotateX2 = useTransform(mouseY, [-20, 20], [-10, 10])
  const mouseRotateY2 = useTransform(mouseX, [-20, 20], [10, -10])
  
  const heroRotateY = useTransform(mouseX, [-20, 20], [-10, 10])
  const heroRotateX = useTransform(mouseY, [-20, 20], [5, -5])

  // Optimized mouse move handler
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
      setMousePosition({ x, y })
      mouseX.set(x)
      mouseY.set(y)
    }
  }, [mouseX, mouseY])

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  // Enhanced dark mode toggle functionality
  const toggleDarkMode = useCallback(() => {
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
  }, [isDark])

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

  // Memoized animation variants for better performance
  const fadeInUp = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: 40, 
      scale: 0.98,
      filter: "blur(2px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.25, 0.25, 1],
        opacity: { duration: 0.4 },
        y: { duration: 0.6 },
        scale: { duration: 0.6 },
        filter: { duration: 0.4 }
      },
    },
  }), [])

  const staggerContainer = useMemo(() => ({
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.05,
        duration: 0.1,
      },
    },
  }), [])

  const cardHover = useMemo(() => ({
    rest: { 
      scale: 1, 
      rotateY: 0, 
      z: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    hover: {
      scale: 1.03,
      rotateY: 3,
      z: 30,
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 25,
        duration: 0.3
      },
    },
  }), [])

  // Memoized helper function to render description paragraphs
  const renderDescription = useCallback((description) => {
    if (!description || description.trim() === '') {
      return <p className="text-base leading-relaxed">Welcome to my portfolio</p>;
    }

    const cleanDescription = description.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    let paragraphs = cleanDescription.split(/\n\n+/).filter(p => p.trim());
    
    if (paragraphs.length <= 1) {
      paragraphs = cleanDescription.split(/\n/).filter(p => p.trim());
    }
    
    if (paragraphs.length <= 1) {
      return <p className="text-base leading-relaxed">{description.trim()}</p>;
    }

    return paragraphs.map((paragraph, index) => (
      <p key={index} className="text-base leading-relaxed">
        {paragraph.trim()}
      </p>
    ));
  }, [])

  // Memoized social links to prevent re-renders
  const socialLinksData = useMemo(() => [
    { icon: Github, href: "https://github.com", color: "hover:text-gray-300" },
    { icon: Linkedin, href: "https://linkedin.com", color: "hover:text-blue-400" },
    { icon: Twitter, href: "https://twitter.com", color: "hover:text-cyan-400" },
    { icon: Globe, href: "https://website.com", color: "hover:text-green-400" },
  ], [])

  // Memoized navigation items
  const navItems = useMemo(() => ["About", "Skills", "Projects", "Contact"], [])

  // Memoized category icons mapping
  const categoryIcons = useMemo(() => ({
    frontend: Smartphone,
    backend: Server,
    tools: Database,
    design: Code,
  }), [])

  // Memoized category labels
  const categoryLabels = useMemo(() => ({
    frontend: "Frontend",
    backend: "Backend", 
    tools: "Tools & DevOps",
    design: "Design"
  }), [])

  // Memoized floating tech icons
  const techIcons = useMemo(() => ["⚛️", "🚀", "💻", "🔧", "⚡", "🎯", "🌟"], [])

  // Memoized loading state check
  const shouldShowLoading = useMemo(() => 
    loading && (!personalInfo.name || personalInfo.name === ''), 
    [loading, personalInfo.name]
  )

  // Memoized error state check  
  const shouldShowError = useMemo(() => 
    error && (!personalInfo.name || personalInfo.name === ''), 
    [error, personalInfo.name]
  )

  // Project preview handlers
  const openProjectPreview = useCallback((project) => {
    setSelectedProject(project)
    setIsProjectPreviewOpen(true)
    document.body.style.overflow = 'hidden' // Prevent background scroll
  }, [])

  const closeProjectPreview = useCallback(() => {
    setIsProjectPreviewOpen(false)
    setSelectedProject(null)
    document.body.style.overflow = 'unset' // Restore scroll
  }, [])

  // Client-side hydration fix
  useEffect(() => {
    setIsClient(true)
    
    // Cleanup function to reset body overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Loading state - only show if we're still loading and don't have data
  if (shouldShowLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-lg font-mono">Loading portfolio...</p>
          <p className="text-white/50 text-sm mt-2">If this takes too long, we'll show default content</p>
        </div>
      </div>
    )
  }

  // Error state - only show if there's an error AND no data
  if (shouldShowError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl mb-2">Unable to load portfolio</h2>
          <p className="text-white/70 mb-4">{error}</p>
          <p className="text-white/50 text-sm mb-4">Showing default content instead</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Professional Portfolio | Full Stack Developer</title>
        <meta
          name="description"
          content="Professional portfolio showcasing full-stack development skills, projects, and experience."
        />
        <style jsx global>{`
          * {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          
          [data-framer-motion] {
            will-change: transform, opacity;
          }
          
          .motion-reduce {
            animation: none !important;
            transition: none !important;
          }
          
          .gradient-bg-dark {
            background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
          }
          
          .gradient-bg-light {
            background: linear-gradient(135deg, #dbeafe 0%, #faf5ff 50%, #fce7f3 100%);
          }
        `}</style>
      </Head>

      <div
        ref={containerRef}
        className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
          isClient && isDark 
            ? 'gradient-bg-dark' 
            : 'gradient-bg-light'
        }`}
      >
        {/* Enhanced 3D Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Animated geometric shapes */}
          <motion.div
            style={{
              x: mouseTransformX1,
              y: mouseTransformY1,
              rotateX: mouseRotateX1,
              rotateY: mouseRotateY1,
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 opacity-30"
          >
            <div className={`w-full h-full rounded-full blur-3xl animate-pulse ${
              isDark 
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20' 
                : 'bg-gradient-to-r from-cyan-300/30 to-blue-300/30'
            }`} />
          </motion.div>

          <motion.div
            style={{
              x: mouseTransformX2,
              y: mouseTransformY2,
              rotateX: mouseRotateX2,
              rotateY: mouseRotateY2,
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-30"
          >
            <div className={`w-full h-full rounded-full blur-3xl animate-pulse ${
              isDark 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
                : 'bg-gradient-to-r from-purple-300/30 to-pink-300/30'
            }`} />
          </motion.div>

          {/* 3D Grid */}
          <motion.div
            style={{ rotateX }}
            className={`absolute inset-0 bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] ${
              isDark 
                ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]'
                : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'
            }`}
          />

          {/* Floating tech icons - Only render on client to prevent hydration mismatch */}
          {isClient && [...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${(i * 7.3) % 100}%`,
                top: `${(i * 11.2) % 100}%`,
              }}
              animate={{
                y: [-30, 30, -30],
                x: [-20, 20, -20],
                rotate: [0, 360, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              {techIcons[i % 7]}
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          isDark 
            ? 'bg-black/20 border-white/10' 
            : 'bg-white/20 border-black/10'
        }`}>
          <div className="max-w-7xl mx-auto px-6 py-4 relative">
            {/* Loading indicator */}
            {loading && (
              <div className="absolute top-2 right-4">
                <div className="flex items-center space-x-2 text-xs text-cyan-400">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>Syncing data...</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className={`flex items-center space-x-3 transition-colors group ${
                  isDark 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Home</span>
              </Link>

              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`transition-colors font-medium relative group ${
                      isDark 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                  </a>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={toggleDarkMode}
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
          </div>
        </nav>

        {/* Hero Section */}
        <section id="about" className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
              {/* Left Content */}
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6 md:space-y-8">
                <motion.div variants={fadeInUp}>
                  <motion.h1
                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                    style={{
                      textShadow: isDark 
                        ? "0 0 30px rgba(59, 130, 246, 0.5)" 
                        : "0 0 30px rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    {personalInfo.name}
                  </motion.h1>
                  <motion.h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold mb-6 md:mb-8 leading-tight">
                    {personalInfo.title}
                  </motion.h2>
                  <div className={`text-base md:text-lg leading-relaxed space-y-3 md:space-y-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {renderDescription(personalInfo.description)}
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className={`flex items-center space-x-2 md:space-x-3 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm md:text-lg">{personalInfo.location}</span>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl md:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 text-sm md:text-base"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Download Resume
                  </motion.button>
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 backdrop-blur-sm border font-bold rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                        : 'bg-black/10 hover:bg-black/20 border-black/20 text-black'
                    }`}
                  >
                    <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Get In Touch
                  </motion.a>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex items-center space-x-3 md:space-x-4">
                  {socialLinksData.map(({ icon: Icon, href, color }, index) => (
                    <motion.a
                      key={index}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, y: -3 }}
                      className={`p-3 md:p-4 bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl text-gray-400 ${color} transition-all duration-300 border border-white/10 hover:border-white/30`}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Half - ID Card positioned in middle, aligned with name */}
              <div className="hidden lg:flex justify-center items-start relative">
                {/* Invisible Hanging Point - Maintains structure without visual element */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 opacity-0 pointer-events-none">
                  <div className="w-4 h-4" />
                </div>

                {/* ID Card Container - Scrollable with page, centered vertically */}
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                  className="relative pt-8" // Padding to maintain spacing
                  style={{ 
                    marginTop: '0px' // Align with the name level
                  }}
                >
                  <HangingIDCard 
                    personalInfo={personalInfo}
                    isDark={isDark}
                    physicsConfig={{
                      gravity: 0.3,
                      damping: 0.96,
                      springStrength: 0.025,
                      maxSwingAngle: 25,
                      stringLength: 80, // String connects to hanging point above
                      attachmentPoint: 'pinned-top'
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 md:py-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="text-center mb-12 md:mb-20"
            >
              <motion.h2 
                variants={fadeInUp} 
                className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Technical Expertise
              </motion.h2>
              <motion.p 
                variants={fadeInUp} 
                className={`text-base md:text-xl max-w-3xl mx-auto px-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Cutting-edge technologies and frameworks I use to build exceptional digital experiences
              </motion.p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {Object.entries(skills).map(([category, skillList], categoryIndex) => (
                <motion.div
                  key={category}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="relative group"
                >
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    variants={cardHover}
                    className={`backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 ${
                      isDark 
                        ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20' 
                        : 'bg-gradient-to-br from-black/5 to-black/2 border-black/10'
                    }`}
                  >
                    <div className="flex items-center mb-4 md:mb-8">
                      <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                        {(() => {
                          const IconComponent = categoryIcons[category]
                          return IconComponent ? <IconComponent className="w-4 h-4 md:w-6 md:h-6 text-white" /> : null
                        })()}
                      </div>
                      <h3 className={`text-lg md:text-2xl font-bold capitalize ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      {skillList.map((skill, index) => (
                        <motion.div 
                          key={skill.name}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          whileHover={{ 
                            scale: 1.02, 
                            y: -2,
                            transition: { duration: 0.2, ease: "easeOut" }
                          }}
                          transition={{ 
                            delay: index * 0.05,
                            duration: 0.4,
                            ease: [0.25, 0.25, 0.25, 1]
                          }}
                          className="relative group/skill"
                        >
                          <div className={`backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4 border hover:border-cyan-400/50 transition-all duration-300 cursor-pointer ${
                            isDark 
                              ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/10' 
                              : 'bg-gradient-to-br from-black/5 to-black/2 border-black/10'
                          }`}>
                            <div className="flex flex-col items-center text-center space-y-1 md:space-y-3">
                              <motion.div 
                                className="text-xl md:text-3xl group-hover/skill:scale-110 transition-transform duration-200"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                              >
                                {skill.icon}
                              </motion.div>
                              <div>
                                <div className={`font-semibold text-xs md:text-sm group-hover/skill:text-cyan-400 transition-colors leading-tight ${
                                  isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {skill.name}
                                </div>
                              </div>
                            </div>
                            
                            {/* Floating level indicator */}
                            <motion.div
                              className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300"
                              initial={{ scale: 0 }}
                              whileHover={{ scale: 1 }}
                            >
                              {skill.level}%
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 md:py-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="text-center mb-12 md:mb-20"
            >
              <motion.h2 
                variants={fadeInUp} 
                className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Featured Projects
              </motion.h2>
              <motion.p 
                variants={fadeInUp} 
                className={`text-base md:text-xl max-w-3xl mx-auto px-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Showcasing innovative solutions and cutting-edge implementations
              </motion.p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    variants={cardHover}
                    onClick={() => openProjectPreview(project)}
                    className={`backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden border shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 cursor-pointer ${
                      isDark 
                        ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20' 
                        : 'bg-gradient-to-br from-black/5 to-black/2 border-black/10'
                    }`}
                  >
                    {/* Project Image */}
                    <div className="relative h-40 md:h-48 overflow-hidden">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.src = "/placeholder.svg";
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', project.image);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-2 md:top-4 right-2 md:right-4 flex space-x-2">
                        <div className="px-2 py-1 md:px-3 md:py-1 bg-green-500/90 text-white text-xs font-bold rounded-full">
                          ⭐ {project.stats.rating}
                        </div>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-4 md:p-6">
                      <h3 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-cyan-400 transition-colors leading-tight ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {project.title}
                      </h3>
                      <p className={`mb-3 md:mb-4 text-xs md:text-sm leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {project.description?.length > 120 
                          ? `${project.description.slice(0, 120)}...` 
                          : project.description}
                      </p>

                      {/* Stats */}
                      <div className={`flex justify-between text-xs mb-3 md:mb-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <span>👥 {project.stats.users}</span>
                        <span>⚡ {project.stats.performance}</span>
                        <span>📈 Active</span>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1 md:gap-2 mb-4 md:mb-6">
                        {project.tech.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className={`px-2 py-1 md:px-3 md:py-1 text-xs rounded-full border ${
                              isDark 
                                ? 'bg-white/10 text-gray-300 border-white/20' 
                                : 'bg-black/10 text-gray-600 border-black/20'
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className={`px-2 py-1 md:px-3 md:py-1 text-xs rounded-full border ${
                            isDark 
                              ? 'bg-white/10 text-gray-400 border-white/20' 
                              : 'bg-black/10 text-gray-500 border-black/20'
                          }`}>
                            +{project.tech.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Project Links */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <motion.a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold text-xs md:text-sm transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            <span className="hidden sm:inline">Live Demo</span>
                            <span className="sm:hidden">Demo</span>
                          </motion.a>
                          <motion.a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center text-gray-400 hover:text-white font-semibold text-xs md:text-sm transition-colors"
                          >
                            <Github className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            <span className="hidden sm:inline">Code</span>
                            <span className="sm:hidden">Code</span>
                          </motion.a>
                        </div>
                        
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation()
                            openProjectPreview(project)
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg text-xs md:text-sm transition-all duration-300"
                        >
                          Details
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-20 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="text-center mb-12 md:mb-16"
            >
              <motion.h2 
                variants={fadeInUp} 
                className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Let's Create Something Amazing
              </motion.h2>
              <motion.p 
                variants={fadeInUp} 
                className={`text-base md:text-xl px-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Ready to bring your ideas to life? Let's discuss your next project.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className={`backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border shadow-2xl ${
                isDark 
                  ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20' 
                  : 'bg-gradient-to-br from-black/5 to-black/2 border-black/10'
              }`}
            >
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-4 md:space-y-6">
                  <h3 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Get In Touch</h3>

                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                        <p className={`font-semibold text-sm md:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{personalInfo.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                        <p className={`font-semibold text-sm md:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{personalInfo.location}</p>
                      </div>
                    </div>
                  </div>

                  <motion.a
                    href={`mailto:${personalInfo.email}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl md:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 text-sm md:text-base"
                  >
                    <Mail className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    Send Message
                  </motion.a>
                </div>

                <div>
                  <h3 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Alternative Experiences</h3>
                  <div className="space-y-3 md:space-y-4">
                    <Link
                      href="/terminal"
                      className={`block p-3 md:p-4 rounded-xl md:rounded-2xl transition-colors group ${
                        isDark 
                          ? 'bg-white/5 hover:bg-white/10' 
                          : 'bg-black/5 hover:bg-black/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Terminal className="w-4 h-4 md:w-6 md:h-6 text-white" />
                        </div>
                        <div>
                          <h4 className={`font-bold group-hover:text-green-400 transition-colors text-sm md:text-base ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            Developer Mode
                          </h4>
                          <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Interactive terminal interface</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/blog"
                      className={`block p-3 md:p-4 rounded-xl md:rounded-2xl transition-colors group ${
                        isDark 
                          ? 'bg-white/5 hover:bg-white/10' 
                          : 'bg-black/5 hover:bg-black/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 md:w-6 md:h-6 text-white" />
                        </div>
                        <div>
                          <h4 className={`font-bold group-hover:text-purple-400 transition-colors text-sm md:text-base ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            Technical Blog
                          </h4>
                          <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Articles & insights</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project Preview Modal */}
        <ProjectPreview
          project={selectedProject}
          isOpen={isProjectPreviewOpen}
          onClose={closeProjectPreview}
          isDark={isDark}
        />

        {/* Footer */}
        <footer className={`py-6 md:py-8 px-4 md:px-6 border-t ${
          isDark ? 'border-white/10' : 'border-black/10'
        }`}>
          <div className="max-w-7xl mx-auto text-center">
            <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>© 2025 Jasil Meledath. Built with Next.js, Framer Motion, and ❤️</p>
          </div>
        </footer>
      </div>
    </>
  )
}
