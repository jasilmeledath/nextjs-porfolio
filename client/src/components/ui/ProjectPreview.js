/**
 * @fileoverview Enhanced Project Preview Modal Component
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 2.0.0
 */

"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ExternalLink,
  Github,
  Calendar,
  Users,
  Zap,
  Star,
  Code,
  Database,
  Server,
  Smartphone,
  Globe,
  ChevronLeft,
  ChevronRight,
  Play,
  Download,
  Share2,
  Clock,
  Target,
  Award,
  Activity,
  TrendingUp,
  GitBranch,
  Eye,
  BookOpen,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Timer,
  BarChart3,
  FileText,
  Layers,
  Maximize2,
  Minimize2,
  ZoomIn,
  Copy,
  Check,
  Monitor,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Shield,
  Cpu,
  HardDrive,
  Network,
} from "lucide-react"

export default function ProjectPreview({ project, isOpen, onClose, isDark }) {
  // Debug logging to check project data
  useEffect(() => {
    if (project && isOpen) {
    }
  }, [project, isOpen]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copiedText, setCopiedText] = useState('')
  const [showImageThumbnails, setShowImageThumbnails] = useState(false)

  // Reset image index when project changes
  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0)
      setIsImageLoading(true)
      setActiveTab('overview')
      setIsFullscreen(false)
      setCopiedText('')
      // Show thumbnails by default if there are multiple images
      const images = project.images || [project.image || project.thumbnailImage || "/placeholder.svg"]
      setShowImageThumbnails(images.length > 1)
    }
  }, [project])

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          onClose()
        }
      } else if (e.key === 'ArrowLeft' && project?.images?.length > 1) {
        setCurrentImageIndex((prev) => 
          prev === 0 ? project.images.length - 1 : prev - 1
        )
      } else if (e.key === 'ArrowRight' && project?.images?.length > 1) {
        setCurrentImageIndex((prev) => 
          prev === project.images.length - 1 ? 0 : prev + 1
        )
      } else if (e.key === 'f' || e.key === 'F') {
        // Press 'f' to toggle fullscreen
        e.preventDefault()
        setIsFullscreen(prev => !prev)
      } else if (e.key === ' ') {
        // Spacebar to toggle image thumbnails
        e.preventDefault()
        setShowImageThumbnails(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, onClose, project, isFullscreen])

  // Animation variants
  const modalVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.25, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  }), [])

  const backdropVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      backdropFilter: "blur(0px)",
    },
    visible: {
      opacity: 1,
      backdropFilter: "blur(20px)",
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: {
        duration: 0.2,
      },
    },
  }), [])

  // Category icons mapping
  const categoryIcons = useMemo(() => ({
    frontend: Smartphone,
    backend: Server,
    fullstack: Globe,
    mobile: Smartphone,
    web: Globe,
    api: Database,
    desktop: Code,
    database: Database,
    devops: Server,
    design: Code,
  }), [])

  // Status colors and icons
  const statusConfig = useMemo(() => ({
    completed: { 
      color: 'text-green-400', 
      bgColor: 'bg-green-500/20', 
      icon: CheckCircle,
      label: 'Completed'
    },
    'in-progress': { 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-500/20', 
      icon: Activity,
      label: 'In Progress'
    },
    planned: { 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-500/20', 
      icon: Clock,
      label: 'Planned'
    },
    archived: { 
      color: 'text-gray-400', 
      bgColor: 'bg-gray-500/20', 
      icon: AlertCircle,
      label: 'Archived'
    },
  }), [])

  // Tab configuration
  const tabConfig = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'tech', label: 'Tech Stack', icon: Code },
    { id: 'stats', label: 'Analytics', icon: BarChart3 },
  ], [])

  // Format date helper
  const formatDate = useCallback((date) => {
    if (!date) return 'Present'
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }, [])

  // Calculate project duration
  const getProjectDuration = useCallback((startDate, endDate) => {
    if (!startDate) return 'Unknown'
    
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const months = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30))
    
    if (months < 1) return '< 1 month'
    if (months === 1) return '1 month'
    if (months < 12) return `${months} months`
    
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`
    return `${years}y ${remainingMonths}m`
  }, [])

  // Handle image navigation
  const nextImage = useCallback(() => {
    if (project?.images?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      )
    }
  }, [project])

  const prevImage = useCallback(() => {
    if (project?.images?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      )
    }
  }, [project])

  // Handle share functionality
  const handleShare = useCallback(() => {
    if (navigator.share && project) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: project.liveUrl,
      })
    } else if (project) {
      // Fallback to clipboard
      navigator.clipboard.writeText(project.liveUrl)
    }
  }, [project])

  // Handle copy functionality
  const handleCopy = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(''), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }, [])

  // Toggle fullscreen image view
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  // Generate project features from schema data
  const projectFeatures = useMemo(() => {
    const features = []
    
    // Add features based on available data
    if (project?.technologies?.length > 0) {
      features.push(`Built with ${project.technologies.length} modern technologies`)
    }
    if (project?.stats?.users && project.stats.users !== '0') {
      features.push(`Serving ${project.stats.users} active users`)
    }
    if (project?.stats?.performance && project.stats.performance !== '0%') {
      features.push(`${project.stats.performance} performance score`)
    }
    if (project?.githubUrl) {
      features.push('Open source with full documentation')
    }
    if (project?.liveUrl) {
      features.push('Live production deployment')
    }
    if (project?.stats?.uptime && project.stats.uptime !== '0%') {
      features.push(`${project.stats.uptime} uptime reliability`)
    }
    
    return features
  }, [project])

  if (!project) return null

  // Prepare images array (fallback to single image if images array doesn't exist)
  const images = project.images || [project.image || project.thumbnailImage || "/placeholder.svg"]
  const currentImage = images[currentImageIndex] || "/placeholder.svg"

  // Get current status configuration
  const currentStatus = statusConfig[project.status] || statusConfig['in-progress']

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
          />

          {/* Modal - More compact for mobile */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full max-w-6xl max-h-[98vh] sm:max-h-[95vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-gray-900/95 to-black/95 border border-white/10' 
                : 'bg-gradient-to-br from-white/95 to-gray-50/95 border border-black/10'
            } backdrop-blur-xl overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Optimized for mobile */}
            <div className="flex-shrink-0 p-3 sm:p-4 md:p-5 border-b border-white/10 dark:border-white/10 backdrop-blur-xl bg-inherit rounded-t-2xl sm:rounded-t-3xl">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const IconComponent = categoryIcons[project.category?.toLowerCase()] || Globe
                      return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {project.title}
                      </h2>
                      <div className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        currentStatus.color
                      } ${currentStatus.bgColor}`}>
                        <currentStatus.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                        {currentStatus.label}
                      </div>
                    </div>
                    <p className={`text-xs sm:text-sm md:text-base mb-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {project.category || 'Web Application'} • {getProjectDuration(project.startDate, project.endDate)}
                    </p>
                    <div className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </span>
                      {project.teamSize && (
                        <span className="flex items-center">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {project.teamSize} member{project.teamSize > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Close Button - Minimalistic */}
                <div className="flex items-start flex-shrink-0">
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 sm:p-2.5 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' 
                        : 'bg-black/5 hover:bg-black/10 text-gray-500 hover:text-black'
                    }`}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center mt-3 sm:mt-4 overflow-x-auto scrollbar-hide">
                <div className="flex space-x-0.5 sm:space-x-1 bg-black/5 dark:bg-white/5 p-0.5 sm:p-1 rounded-lg min-w-max">
                  {tabConfig.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        activeTab === id
                          ? isDark
                            ? 'bg-white/20 text-white shadow-sm'
                            : 'bg-white text-gray-900 shadow-sm'
                          : isDark
                            ? 'text-gray-400 hover:text-white hover:bg-white/10'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-black/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                      <span className="hidden xs:inline sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 sm:p-3 md:p-4"
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                      {/* Enhanced Image Gallery */}
                      <div className="relative">
                        <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group">
                          <img
                            src={currentImage}
                            alt={`${project.title} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                            onLoad={() => setIsImageLoading(false)}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg"
                              setIsImageLoading(false)
                            }}
                            onClick={toggleFullscreen}
                          />
                          
                          {isImageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                            </div>
                          )}

                          {/* Image Controls Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors">
                            {/* Fullscreen Button */}
                            <button
                              onClick={toggleFullscreen}
                              className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>

                            {/* Image Counter */}
                            {images.length > 1 && (
                              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-black/60 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                {currentImageIndex + 1} / {images.length}
                              </div>
                            )}

                            {/* View Gallery Text */}
                            {images.length > 1 && (
                              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-black/60 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                Gallery
                              </div>
                            )}
                          </div>

                          {/* Image Navigation */}
                          {images.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                              >
                                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                              >
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>

                              {/* Image Indicators */}
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                                {images.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                                      index === currentImageIndex 
                                        ? 'bg-white shadow-lg' 
                                        : 'bg-white/50 hover:bg-white/75'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Image Thumbnails - Show by default when multiple images */}
                        {images.length > 1 && (
                          <div className="mt-2 sm:mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs sm:text-sm font-medium flex items-center ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                Gallery ({images.length})
                              </span>
                              <button
                                onClick={() => setShowImageThumbnails(!showImageThumbnails)}
                                className={`text-xs font-medium px-2 py-0.5 rounded transition-colors ${
                                  showImageThumbnails
                                    ? isDark 
                                      ? 'bg-cyan-500/20 text-cyan-400'
                                      : 'bg-cyan-100 text-cyan-600'
                                    : isDark 
                                      ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10' 
                                      : 'text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50'
                                }`}
                              >
                                {showImageThumbnails ? 'Hide' : 'Show'}
                              </button>
                            </div>
                            <AnimatePresence>
                              {showImageThumbnails && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2"
                                >
                                  {images.map((image, index) => (
                                    <motion.button
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: index * 0.1 }}
                                      onClick={() => setCurrentImageIndex(index)}
                                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                        index === currentImageIndex
                                          ? 'border-cyan-400 shadow-lg shadow-cyan-400/30 scale-105'
                                          : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400/50 hover:scale-105'
                                      }`}
                                    >
                                      <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.src = "/placeholder.svg"
                                        }}
                                      />
                                    </motion.button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Project Description */}
                      <div className="space-y-2 sm:space-y-3 md:space-y-4">
                        <h3 className={`text-base sm:text-lg md:text-xl font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          About This Project
                        </h3>
                        
                        {/* Main Description */}
                        <div className={`prose prose-sm sm:prose-base max-w-none ${
                          isDark ? 'prose-invert' : ''
                        }`}>
                          <div className={`text-sm sm:text-base leading-relaxed space-y-2 sm:space-y-3 ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {project.longDescription ? (
                              // Render long description with proper paragraph breaks
                              project.longDescription.split(/\n\n|\n/).filter(para => para.trim()).map((paragraph, index) => (
                                <p key={index} className="mb-2 sm:mb-3 text-justify">
                                  {paragraph.trim()}
                                </p>
                              ))
                            ) : project.description ? (
                              <p className="mb-2 sm:mb-3 text-justify">
                                {project.description}
                              </p>
                            ) : (
                              <p className={`mb-2 sm:mb-3 text-center italic ${
                                isDark ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                No description available for this project.
                              </p>
                            )}
                          </div>
                          
                          {/* Project Features */}
                          {project.features && project.features.length > 0 && (
                            <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl border-l-4 border-green-400 bg-green-500/10">
                              <h4 className={`text-base sm:text-lg font-semibold mb-3 flex items-center ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                <Layers className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
                                Key Features
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {project.features.map((feature, index) => (
                                  <div key={index} className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                                    <span className={`text-sm ${
                                      isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                      {feature}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* My Role Section */}
                          {project.myRole && (
                            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg border-l-4 border-cyan-400 bg-cyan-500/10">
                              <h4 className={`text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 flex items-center ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-cyan-400" />
                                My Role
                              </h4>
                              <p className={`text-xs sm:text-sm ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {project.myRole}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                        <div className={`p-2.5 sm:p-3 rounded-lg text-center ${
                          isDark ? 'bg-white/5' : 'bg-black/5'
                        }`}>
                          <div className="flex items-center justify-center mb-1 sm:mb-1.5">
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                          </div>
                          <div className={`font-bold text-sm sm:text-base ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.stats?.rating || '4.8'}
                          </div>
                          <div className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Rating
                          </div>
                        </div>

                        <div className={`p-2.5 sm:p-3 rounded-lg text-center ${
                          isDark ? 'bg-white/5' : 'bg-black/5'
                        }`}>
                          <div className="flex items-center justify-center mb-1 sm:mb-1.5">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                          </div>
                          <div className={`font-bold text-sm sm:text-base ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.stats?.users || '1.2k'}
                          </div>
                          <div className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Users
                          </div>
                        </div>

                        <div className={`p-2.5 sm:p-3 rounded-lg text-center ${
                          isDark ? 'bg-white/5' : 'bg-black/5'
                        }`}>
                          <div className="flex items-center justify-center mb-1 sm:mb-1.5">
                            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                          </div>
                          <div className={`font-bold text-sm sm:text-base ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.stats?.performance || '98%'}
                          </div>
                          <div className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Performance
                          </div>
                        </div>

                        <div className={`p-2.5 sm:p-3 rounded-lg text-center ${
                          isDark ? 'bg-white/5' : 'bg-black/5'
                        }`}>
                          <div className="flex items-center justify-center mb-1 sm:mb-1.5">
                            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                          </div>
                          <div className={`font-bold text-sm sm:text-base ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.stats?.uptime || '99.9%'}
                          </div>
                          <div className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Uptime
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                      {/* Project Timeline */}
                      <div>
                        <h3 className={`text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 flex items-center ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-cyan-400" />
                          Project Timeline
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                          <div className={`p-2.5 sm:p-3 rounded-lg ${
                            isDark ? 'bg-white/5' : 'bg-black/5'
                          }`}>
                            <div className="flex items-center mb-1.5">
                              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 mr-1.5" />
                              <span className={`text-xs sm:text-sm font-semibold ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                Start Date
                              </span>
                            </div>
                            <p className={`text-xs sm:text-sm ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {formatDate(project.startDate)}
                            </p>
                          </div>
                          
                          <div className={`p-2.5 sm:p-3 rounded-lg ${
                            isDark ? 'bg-white/5' : 'bg-black/5'
                          }`}>
                            <div className="flex items-center mb-1.5">
                              <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 mr-1.5" />
                              <span className={`text-xs sm:text-sm font-semibold ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                Duration
                              </span>
                            </div>
                            <p className={`text-xs sm:text-sm ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {getProjectDuration(project.startDate, project.endDate)}
                            </p>
                          </div>
                          
                          <div className={`p-2.5 sm:p-3 rounded-lg ${
                            isDark ? 'bg-white/5' : 'bg-black/5'
                          }`}>
                            <div className="flex items-center mb-1.5">
                              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 mr-1.5" />
                              <span className={`text-xs sm:text-sm font-semibold ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                End Date
                              </span>
                            </div>
                            <p className={`text-sm sm:text-base ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {formatDate(project.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Challenges */}
                      {project.challenges && project.challenges.length > 0 && (
                        <div>
                          <h3 className={`text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 flex items-center ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-red-400" />
                            Challenges
                          </h3>
                          <div className="space-y-2 sm:space-y-3">
                            {project.challenges.map((challenge, index) => (
                              <div key={index} className={`p-2.5 sm:p-3 rounded-lg border-l-4 border-red-400 ${
                                isDark ? 'bg-red-500/10' : 'bg-red-50'
                              }`}>
                                <div className={`text-xs sm:text-sm leading-relaxed ${
                                  isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {challenge}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Key Learnings */}
                      {project.learnings && project.learnings.length > 0 && (
                        <div>
                          <h3 className={`text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 flex items-center ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-blue-400" />
                            Key Learnings
                          </h3>
                          <div className="space-y-2 sm:space-y-3">
                            {project.learnings.map((learning, index) => (
                              <div key={index} className={`p-2.5 sm:p-3 rounded-lg border-l-4 border-blue-400 ${
                                isDark ? 'bg-blue-500/10' : 'bg-blue-50'
                              }`}>
                                <div className={`text-xs sm:text-sm leading-relaxed ${
                                  isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {learning}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Enhanced Features */}
                      {projectFeatures.length > 0 && (
                        <div>
                          <h3 className={`text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 flex items-center ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            <Layers className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-purple-400" />
                            Key Features
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {projectFeatures.map((feature, index) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-2.5 sm:p-3 rounded-lg flex items-start space-x-2 border-l-4 border-purple-400 ${
                                  isDark ? 'bg-purple-500/10' : 'bg-purple-50'
                                }`}
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                                <div className={`text-xs sm:text-sm font-medium ${
                                  isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {feature}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Project URLs Section */}
                      {(project.liveUrl || project.githubUrl || project.demoUrl || project.caseStudyUrl) && (
                        <div>
                          <h3 className={`text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 flex items-center ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-green-400" />
                            Quick Links
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {project.liveUrl && (
                              <motion.a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-3 sm:p-4 rounded-xl flex items-center justify-between border-2 transition-all group ${
                                  isDark 
                                    ? 'bg-green-500/10 border-green-400/30 hover:border-green-400/60 hover:bg-green-500/20' 
                                    : 'bg-green-50 border-green-200 hover:border-green-400 hover:bg-green-100'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Monitor className="w-5 h-5 text-green-400" />
                                  <span className={`font-medium ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    Live Demo
                                  </span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              </motion.a>
                            )}

                            {project.githubUrl && (
                              <motion.a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-3 sm:p-4 rounded-xl flex items-center justify-between border-2 transition-all group ${
                                  isDark 
                                    ? 'bg-gray-500/10 border-gray-400/30 hover:border-gray-400/60 hover:bg-gray-500/20' 
                                    : 'bg-gray-50 border-gray-200 hover:border-gray-400 hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Github className="w-5 h-5 text-gray-400" />
                                  <span className={`font-medium ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    Source Code
                                  </span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              </motion.a>
                            )}

                            {project.demoUrl && (
                              <motion.a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-3 sm:p-4 rounded-xl flex items-center justify-between border-2 transition-all group ${
                                  isDark 
                                    ? 'bg-blue-500/10 border-blue-400/30 hover:border-blue-400/60 hover:bg-blue-500/20' 
                                    : 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Play className="w-5 h-5 text-blue-400" />
                                  <span className={`font-medium ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    Demo Video
                                  </span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              </motion.a>
                            )}

                            {project.caseStudyUrl && (
                              <motion.a
                                href={project.caseStudyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-3 sm:p-4 rounded-xl flex items-center justify-between border-2 transition-all group ${
                                  isDark 
                                    ? 'bg-purple-500/10 border-purple-400/30 hover:border-purple-400/60 hover:bg-purple-500/20' 
                                    : 'bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <BookOpen className="w-5 h-5 text-purple-400" />
                                  <span className={`font-medium ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    Case Study
                                  </span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              </motion.a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'tech' && (
                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                      <div>
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          <Code className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-cyan-400" />
                          Technology Stack
                        </h3>
                        
                        {/* Grouped by category */}
                        {project.technologies && project.technologies.length > 0 ? (
                          <div className="space-y-4 sm:space-y-6">
                            {Object.entries(
                              project.technologies.reduce((acc, tech) => {
                                const category = tech.category || 'other'
                                if (!acc[category]) acc[category] = []
                                acc[category].push(tech)
                                return acc
                              }, {})
                            ).map(([category, techs]) => (
                              <div key={category}>
                                <h4 className={`text-base sm:text-lg font-semibold mb-3 capitalize flex items-center ${
                                  isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {(() => {
                                    const IconComponent = categoryIcons[category] || Code
                                    return <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-cyan-400" />
                                  })()}
                                  {category.replace('-', ' ')}
                                </h4>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                  {techs.map((tech, index) => (
                                    <motion.span
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: index * 0.1 }}
                                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base font-semibold border transition-all hover:scale-105 ${
                                        isDark 
                                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-300 hover:border-cyan-400/50' 
                                          : 'bg-gradient-to-r from-cyan-100 to-blue-100 border-cyan-400/30 text-cyan-700 hover:border-cyan-400/50'
                                      }`}
                                      style={{
                                        backgroundColor: tech.color ? `${tech.color}20` : undefined,
                                        borderColor: tech.color ? `${tech.color}40` : undefined,
                                        color: tech.color || undefined
                                      }}
                                    >
                                      {tech.name}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : project.tech ? (
                          <div className="flex flex-wrap gap-3">
                            {project.tech.map((tech, index) => (
                              <motion.span
                                key={tech}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`px-4 py-2 rounded-xl font-semibold border ${
                                  isDark 
                                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-300' 
                                    : 'bg-gradient-to-r from-cyan-100 to-blue-100 border-cyan-400/30 text-cyan-700'
                                }`}
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                        ) : (
                          <p className={`${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            No technology information available.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'stats' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className={`text-xl font-bold mb-6 flex items-center ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          <BarChart3 className="w-6 h-6 mr-2 text-cyan-400" />
                          Project Analytics
                        </h3>
                        
                        {/* Enhanced Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {project.stats?.users && (
                            <div className={`p-6 rounded-xl ${
                              isDark ? 'bg-white/5' : 'bg-black/5'
                            }`}>
                              <div className="flex items-center justify-between mb-4">
                                <Users className="w-8 h-8 text-blue-400" />
                                <TrendingUp className="w-5 h-5 text-green-400" />
                              </div>
                              <div className={`text-2xl font-bold mb-1 ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {project.stats.users}
                              </div>
                              <div className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Active Users
                              </div>
                            </div>
                          )}

                          {project.stats?.performance && (
                            <div className={`p-6 rounded-xl ${
                              isDark ? 'bg-white/5' : 'bg-black/5'
                            }`}>
                              <div className="flex items-center justify-between mb-4">
                                <Zap className="w-8 h-8 text-green-400" />
                                <Activity className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className={`text-2xl font-bold mb-1 ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {project.stats.performance}
                              </div>
                              <div className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Performance Score
                              </div>
                            </div>
                          )}

                          {project.stats?.rating && (
                            <div className={`p-6 rounded-xl ${
                              isDark ? 'bg-white/5' : 'bg-black/5'
                            }`}>
                              <div className="flex items-center justify-between mb-4">
                                <Star className="w-8 h-8 text-yellow-400" />
                                <Award className="w-5 h-5 text-purple-400" />
                              </div>
                              <div className={`text-2xl font-bold mb-1 ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {project.stats.rating}/5
                              </div>
                              <div className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                User Rating
                              </div>
                            </div>
                          )}

                          {project.stats?.githubStars && (
                            <div className={`p-6 rounded-xl ${
                              isDark ? 'bg-white/5' : 'bg-black/5'
                            }`}>
                              <div className="flex items-center justify-between mb-4">
                                <GitBranch className="w-8 h-8 text-purple-400" />
                                <Star className="w-5 h-5 text-yellow-400" />
                              </div>
                              <div className={`text-2xl font-bold mb-1 ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {project.stats.githubStars}
                              </div>
                              <div className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                GitHub Stars
                              </div>
                            </div>
                          )}

                          {project.stats?.deployments && (
                            <div className={`p-6 rounded-xl ${
                              isDark ? 'bg-white/5' : 'bg-black/5'
                            }`}>
                              <div className="flex items-center justify-between mb-4">
                                <Server className="w-8 h-8 text-cyan-400" />
                                <TrendingUp className="w-5 h-5 text-green-400" />
                              </div>
                              <div className={`text-2xl font-bold mb-1 ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {project.stats.deployments}
                              </div>
                              <div className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Deployments
                              </div>
                            </div>
                          )}

                          {project.stats?.uptime && (
                            <div className={`p-6 rounded-xl ${
                              isDark ? 'bg-white/5' : 'bg-black/5'
                            }`}>
                              <div className="flex items-center justify-between mb-4">
                                <Activity className="w-8 h-8 text-green-400" />
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              </div>
                              <div className={`text-2xl font-bold mb-1 ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {project.stats.uptime}
                              </div>
                              <div className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Uptime
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Additional project metadata */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className={`p-6 rounded-xl ${
                            isDark ? 'bg-white/5' : 'bg-black/5'
                          }`}>
                            <h4 className={`text-lg font-semibold mb-4 ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              Project Details
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className={`${
                                  isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  Status
                                </span>
                                <span className={`font-medium ${currentStatus.color}`}>
                                  {currentStatus.label}
                                </span>
                              </div>
                              {project.teamSize && (
                                <div className="flex justify-between">
                                  <span className={`${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    Team Size
                                  </span>
                                  <span className={`font-medium ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {project.teamSize} member{project.teamSize > 1 ? 's' : ''}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className={`${
                                  isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  Duration
                                </span>
                                <span className={`font-medium ${
                                  isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {getProjectDuration(project.startDate, project.endDate)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className={`${
                                  isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  Featured
                                </span>
                                <span className={`font-medium ${
                                  project.isFeatured ? 'text-green-400' : 'text-gray-400'
                                }`}>
                                  {project.isFeatured ? 'Yes' : 'No'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className={`p-6 rounded-xl ${
                            isDark ? 'bg-white/5' : 'bg-black/5'
                          }`}>
                            <h4 className={`text-lg font-semibold mb-4 flex items-center ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              <Network className="w-5 h-5 mr-2 text-cyan-400" />
                              Links & Resources
                            </h4>
                            <div className="space-y-3">
                              {project.liveUrl && (
                                <div className={`p-3 rounded-lg border transition-all group ${
                                  isDark ? 'border-gray-600 hover:border-cyan-400/50' : 'border-gray-200 hover:border-cyan-400/50'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Monitor className="w-4 h-4 text-cyan-400" />
                                      <span className={`text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                      }`}>
                                        Live Demo
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleCopy(project.liveUrl, 'live')}
                                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title="Copy URL"
                                      >
                                        {copiedText === 'live' ? (
                                          <Check className="w-3 h-3 text-green-400" />
                                        ) : (
                                          <Copy className="w-3 h-3 text-gray-400" />
                                        )}
                                      </button>
                                      <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-cyan-400 hover:text-cyan-300 transition-colors"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {project.githubUrl && (
                                <div className={`p-3 rounded-lg border transition-all group ${
                                  isDark ? 'border-gray-600 hover:border-gray-400/50' : 'border-gray-200 hover:border-gray-400/50'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Github className="w-4 h-4 text-gray-400" />
                                      <span className={`text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                      }`}>
                                        Source Code
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleCopy(project.githubUrl, 'github')}
                                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title="Copy URL"
                                      >
                                        {copiedText === 'github' ? (
                                          <Check className="w-3 h-3 text-green-400" />
                                        ) : (
                                          <Copy className="w-3 h-3 text-gray-400" />
                                        )}
                                      </button>
                                      <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-300 transition-colors"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {project.demoUrl && (
                                <div className={`p-3 rounded-lg border transition-all group ${
                                  isDark ? 'border-gray-600 hover:border-blue-400/50' : 'border-gray-200 hover:border-blue-400/50'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Play className="w-4 h-4 text-blue-400" />
                                      <span className={`text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                      }`}>
                                        Demo Video
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleCopy(project.demoUrl, 'demo')}
                                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title="Copy URL"
                                      >
                                        {copiedText === 'demo' ? (
                                          <Check className="w-3 h-3 text-green-400" />
                                        ) : (
                                          <Copy className="w-3 h-3 text-gray-400" />
                                        )}
                                      </button>
                                      <a
                                        href={project.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-400 hover:text-blue-300 transition-colors"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {project.caseStudyUrl && (
                                <div className={`p-3 rounded-lg border transition-all group ${
                                  isDark ? 'border-gray-600 hover:border-purple-400/50' : 'border-gray-200 hover:border-purple-400/50'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <BookOpen className="w-4 h-4 text-purple-400" />
                                      <span className={`text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                      }`}>
                                        Case Study
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleCopy(project.caseStudyUrl, 'case')}
                                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title="Copy URL"
                                      >
                                        {copiedText === 'case' ? (
                                          <Check className="w-3 h-3 text-green-400" />
                                        ) : (
                                          <Copy className="w-3 h-3 text-gray-400" />
                                        )}
                                      </button>
                                      <a
                                        href={project.caseStudyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-400 hover:text-purple-300 transition-colors"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Actions - Minimalistic Design */}
            <div className="sticky bottom-0 z-10 p-3 sm:p-4 border-t backdrop-blur-xl bg-inherit">
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                {/* Primary Action - Live Demo */}
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm sm:text-base font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Play className="w-4 h-4 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    <span className="hidden xs:inline">View Live</span>
                    <span className="xs:hidden">Demo</span>
                  </motion.a>
                )}

                {/* Secondary Actions Container */}
                <div className="flex gap-2 sm:gap-3">
                  {/* GitHub Link */}
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`flex items-center justify-center px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 border ${
                        isDark 
                          ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:border-white/20' 
                          : 'bg-black/5 hover:bg-black/10 border-black/10 text-black hover:border-black/20'
                      }`}
                      title="View Source Code"
                    >
                      <Github className="w-4 h-4 sm:w-4 sm:h-4 sm:mr-1.5" />
                      <span className="hidden sm:inline ml-1">Code</span>
                    </motion.a>
                  )}

                  {/* Case Study Link */}
                  {project.caseStudyUrl && (
                    <motion.a
                      href={project.caseStudyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`flex items-center justify-center px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 border ${
                        isDark 
                          ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:border-white/20' 
                          : 'bg-black/5 hover:bg-black/10 border-black/10 text-black hover:border-black/20'
                      }`}
                      title="Read Case Study"
                    >
                      <BookOpen className="w-4 h-4 sm:w-4 sm:h-4 sm:mr-1.5" />
                      <span className="hidden sm:inline ml-1">Study</span>
                    </motion.a>
                  )}

                  {/* Share Button */}
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex items-center justify-center px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 border ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:border-white/20' 
                        : 'bg-black/5 hover:bg-black/10 border-black/10 text-black hover:border-black/20'
                    }`}
                    title="Share Project"
                  >
                    <Share2 className="w-4 h-4 sm:w-4 sm:h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={toggleFullscreen}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={currentImage}
              alt={`${project.title} - Fullscreen`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Close Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <Minimize2 className="w-6 h-6" />
            </button>

            {/* Image Navigation in Fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image Counter in Fullscreen */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white text-sm rounded-full">
                  {currentImageIndex + 1} of {images.length}
                </div>
              </>
            )}

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/50 text-white text-sm rounded-full">
              <ZoomIn className="w-4 h-4 inline mr-2" />
              Click outside to close
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
