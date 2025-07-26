/**
 * @fileoverview Enhanced Project Preview Modal Component
 * @author Professional Developer <dev@portfolio.com>
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
} from "lucide-react"

export default function ProjectPreview({ project, isOpen, onClose, isDark }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Reset image index when project changes
  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0)
      setIsImageLoading(true)
      setActiveTab('overview')
    }
  }, [project])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && project?.images?.length > 1) {
        setCurrentImageIndex((prev) => 
          prev === 0 ? project.images.length - 1 : prev - 1
        )
      } else if (e.key === 'ArrowRight' && project?.images?.length > 1) {
        setCurrentImageIndex((prev) => 
          prev === project.images.length - 1 ? 0 : prev + 1
        )
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, onClose, project])

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

  if (!project) return null

  // Prepare images array (fallback to single image if images array doesn't exist)
  const images = project.images || [project.image || project.thumbnailImage || "/placeholder.svg"]
  const currentImage = images[currentImageIndex] || "/placeholder.svg"

  // Get current status configuration
  const currentStatus = statusConfig[project.status] || statusConfig['in-progress']

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full max-w-7xl max-h-[95vh] flex flex-col rounded-3xl shadow-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-gray-900/95 to-black/95 border border-white/20' 
                : 'bg-gradient-to-br from-white/95 to-gray-50/95 border border-black/20'
            } backdrop-blur-xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 p-3 sm:p-4 md:p-6 border-b backdrop-blur-xl bg-inherit rounded-t-3xl">
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex items-start space-x-2 sm:space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const IconComponent = categoryIcons[project.category?.toLowerCase()] || Globe
                      return <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1 sm:mb-2">
                      <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold truncate ${
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

                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/20 text-white' 
                        : 'bg-black/10 hover:bg-black/20 text-black'
                    }`}
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/20 text-white' 
                        : 'bg-black/10 hover:bg-black/20 text-black'
                    }`}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center mt-4 sm:mt-6 overflow-x-auto scrollbar-hide">
                <div className="flex space-x-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg sm:rounded-xl min-w-max">
                  {tabConfig.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center px-2 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        activeTab === id
                          ? isDark
                            ? 'bg-white/20 text-white shadow-lg'
                            : 'bg-white text-gray-900 shadow-lg'
                          : isDark
                            ? 'text-gray-400 hover:text-white hover:bg-white/10'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-black/10'
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{label}</span>
                      <span className="sm:hidden">{label.slice(0, 4)}</span>
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
                  className="p-3 sm:p-4 md:p-6"
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                      {/* Image Gallery */}
                      <div className="relative">
                        <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img
                            src={currentImage}
                            alt={`${project.title} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                            onLoad={() => setIsImageLoading(false)}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg"
                              setIsImageLoading(false)
                            }}
                          />
                          
                          {isImageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                            </div>
                          )}

                          {/* Image Navigation */}
                          {images.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                              >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                              >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>

                              {/* Image Indicators */}
                              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2">
                                {images.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                                      index === currentImageIndex 
                                        ? 'bg-white' 
                                        : 'bg-white/50 hover:bg-white/75'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Project Description */}
                      <div className="space-y-3 sm:space-y-4 md:space-y-6">
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          About This Project
                        </h3>
                        
                        {/* Main Description */}
                        <div className={`prose prose-sm sm:prose-base lg:prose-lg max-w-none ${
                          isDark ? 'prose-invert' : ''
                        }`}>
                          <div className={`text-sm sm:text-base leading-relaxed space-y-3 sm:space-y-4 ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {project.longDescription ? (
                              // Render long description with proper paragraph breaks
                              project.longDescription.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="mb-3 sm:mb-4">
                                  {paragraph.trim()}
                                </p>
                              ))
                            ) : (
                              <p className="mb-3 sm:mb-4">
                                {project.description}
                              </p>
                            )}
                          </div>
                          
                          {/* My Role Section */}
                          {project.myRole && (
                            <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl border-l-4 border-cyan-400 bg-cyan-500/10">
                              <h4 className={`text-base sm:text-lg font-semibold mb-2 flex items-center ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-cyan-400" />
                                My Role
                              </h4>
                              <p className={`text-sm sm:text-base ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {project.myRole}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className={`p-3 sm:p-4 rounded-xl text-center ${
                          isDark ? 'bg-white/5' : 'bg-black/5'
                        }`}>
                          <div className="flex items-center justify-center mb-2">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                          </div>
                          <div className={`font-bold text-base sm:text-lg ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.stats?.rating || '4.8'}
                          </div>
                          <div className={`text-xs sm:text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Rating
                          </div>
                        </div>

                        <div className={`p-3 sm:p-4 rounded-xl text-center ${
                          isDark ? 'bg-white/5' : 'bg-black/5'
                        }`}>
                          <div className="flex items-center justify-center mb-2">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                          </div>
                          <div className={`font-bold text-base sm:text-lg ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.stats?.users || '1.2k'}
                          </div>
                          <div className={`text-xs sm:text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Users
                          </div>
                        </div>

                        <div className={`p-3 sm:p-4 rounded-xl text-center ${
                          isDark ? 'bg-white/5' : 'bg-black/5'
                        }`}>
                          <div className="flex items-center justify-center mb-2">
                            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                          </div>
                          <div className={`font-bold text-base sm:text-lg ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.stats?.performance || '98%'}
                          </div>
                          <div className={`text-xs sm:text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Performance
                          </div>
                        </div>

                        <div className={`p-3 sm:p-4 rounded-xl text-center ${
                          isDark ? 'bg-white/5' : 'bg-black/5'
                        }`}>
                          <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                          </div>
                          <div className={`font-bold text-base sm:text-lg ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.stats?.uptime || '99.9%'}
                          </div>
                          <div className={`text-xs sm:text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Uptime
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                      {/* Project Timeline */}
                      <div>
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-cyan-400" />
                          Project Timeline
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          <div className={`p-3 sm:p-4 rounded-xl ${
                            isDark ? 'bg-white/5' : 'bg-black/5'
                          }`}>
                            <div className="flex items-center mb-2">
                              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2" />
                              <span className={`text-sm sm:text-base font-semibold ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                Start Date
                              </span>
                            </div>
                            <p className={`text-sm sm:text-base ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {formatDate(project.startDate)}
                            </p>
                          </div>
                          
                          <div className={`p-3 sm:p-4 rounded-xl ${
                            isDark ? 'bg-white/5' : 'bg-black/5'
                          }`}>
                            <div className="flex items-center mb-2">
                              <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2" />
                              <span className={`text-sm sm:text-base font-semibold ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                Duration
                              </span>
                            </div>
                            <p className={`text-sm sm:text-base ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {getProjectDuration(project.startDate, project.endDate)}
                            </p>
                          </div>
                          
                          <div className={`p-3 sm:p-4 rounded-xl ${
                            isDark ? 'bg-white/5' : 'bg-black/5'
                          }`}>
                            <div className="flex items-center mb-2">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-2" />
                              <span className={`text-sm sm:text-base font-semibold ${
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
                          <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-center ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-400" />
                            Technical Challenges
                          </h3>
                          <div className="space-y-3 sm:space-y-4">
                            {project.challenges.map((challenge, index) => (
                              <div key={index} className={`p-3 sm:p-4 rounded-xl border-l-4 border-red-400 ${
                                isDark ? 'bg-red-500/10' : 'bg-red-50'
                              }`}>
                                <div className={`text-sm sm:text-base leading-relaxed ${
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
                          <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-center ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-400" />
                            Key Learnings
                          </h3>
                          <div className="space-y-3 sm:space-y-4">
                            {project.learnings.map((learning, index) => (
                              <div key={index} className={`p-3 sm:p-4 rounded-xl border-l-4 border-blue-400 ${
                                isDark ? 'bg-blue-500/10' : 'bg-blue-50'
                              }`}>
                                <div className={`text-sm sm:text-base leading-relaxed ${
                                  isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {learning}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      {project.features && project.features.length > 0 && (
                        <div>
                          <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-center ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            <Layers className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-400" />
                            Key Features
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {project.features.map((feature, index) => (
                              <div key={index} className={`p-3 sm:p-4 rounded-xl flex items-start space-x-3 ${
                                isDark ? 'bg-white/5' : 'bg-black/5'
                              }`}>
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                                <div className={`text-sm sm:text-base ${
                                  isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  {feature}
                                </div>
                              </div>
                            ))}
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
                                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base font-semibold border ${
                                        isDark 
                                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-300' 
                                          : 'bg-gradient-to-r from-cyan-100 to-blue-100 border-cyan-400/30 text-cyan-700'
                                      }`}
                                      style={{
                                        backgroundColor: tech.color ? `${tech.color}20` : undefined,
                                        borderColor: tech.color ? `${tech.color}40` : undefined,
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
                            <h4 className={`text-lg font-semibold mb-4 ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              Links & Resources
                            </h4>
                            <div className="space-y-3">
                              {project.liveUrl && (
                                <div className="flex items-center justify-between">
                                  <span className={`${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    Live Demo
                                  </span>
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </div>
                              )}
                              {project.githubUrl && (
                                <div className="flex items-center justify-between">
                                  <span className={`${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    Source Code
                                  </span>
                                  <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors"
                                  >
                                    <Github className="w-4 h-4" />
                                  </a>
                                </div>
                              )}
                              {project.caseStudyUrl && (
                                <div className="flex items-center justify-between">
                                  <span className={`${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    Case Study
                                  </span>
                                  <a
                                    href={project.caseStudyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                  >
                                    <BookOpen className="w-4 h-4" />
                                  </a>
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

            {/* Footer Actions */}
            <div className="sticky bottom-0 z-10 p-4 md:p-6 border-t backdrop-blur-xl bg-inherit">
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
                >
                  <Play className="w-5 h-5 mr-2" />
                  View Live Demo
                </motion.a>

                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 flex items-center justify-center px-6 py-3 font-bold rounded-xl transition-all duration-300 border ${
                    isDark 
                      ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                      : 'bg-black/10 hover:bg-black/20 border-black/20 text-black'
                  }`}
                >
                  <Github className="w-5 h-5 mr-2" />
                  View Source Code
                </motion.a>

                {project.caseStudyUrl && (
                  <motion.a
                    href={project.caseStudyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center px-6 py-3 font-bold rounded-xl transition-all duration-300 border ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                        : 'bg-black/10 hover:bg-black/20 border-black/20 text-black'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Case Study
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
