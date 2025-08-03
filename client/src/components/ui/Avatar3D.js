/**
 * @fileoverview Professional Avatar Component - Enhanced 3D-style Design
 * @author jasilmeledath@gmail.com
 * @created 2025-08-03  
 * @version 3.1.0
 * @description Professional avatar display with 3D styling and enhanced interactions
 */

"use client"

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { 
  FaBullseye, 
  FaUser, 
  FaCheck, 
  FaCamera, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaStar,
  FaCode 
} from 'react-icons/fa'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

// Professional Avatar Component with 3D styling
const Avatar3D = ({ personalInfo = {}, isDark = true, className = "", physicsConfig = {}, onLoad, onError, onClick }) => {
  const containerRef = useRef(null)
  const avatarRef = useRef(null)
  
  // State management
  const [isClient, setIsClient] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Motion values for 3D-style interactions
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [5, -5]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-5, 5]), { stiffness: 150, damping: 20 })
  const scale = useSpring(1, { stiffness: 200, damping: 20 })

  // Device and client-side detection
  useEffect(() => {
    setIsClient(true)
    
    const checkMobile = () => {
      return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    
    setIsMobile(checkMobile())

    const handleResize = () => {
      setIsMobile(checkMobile())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Image URL normalization utility
  const normalizeImageUrl = useCallback((url) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    if (url.startsWith('/')) return `${window.location.origin}${url}`
    return url
  }, [])

  // Mouse interaction handler
  const handleMouseMove = useCallback((event) => {
    if (!avatarRef.current || isMobile) return

    const rect = avatarRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (event.clientX - centerX) / 2
    const deltaY = (event.clientY - centerY) / 2

    mouseX.set(deltaX)
    mouseY.set(deltaY)
  }, [isMobile, mouseX, mouseY])

  // Hover handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    scale.set(1.05)
  }, [scale])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    scale.set(1)
    mouseX.set(0)
    mouseY.set(0)
  }, [scale, mouseX, mouseY])

  // Dynamic ID generation
  const staticId = useMemo(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    const email = personalInfo?.email || "user@example.com"
    
    try {
      // Generate seeded random ID based on email
      let seed = email.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a
      }, 0)
      
      // Ensure seed is positive
      seed = Math.abs(seed)
      
      for (let i = 0; i < 6; i++) {
        seed = (seed * 9301 + 49297) % 233280
        const index = Math.floor((seed / 233280) * characters.length)
        result += characters[index] || 'A'
      }
      
      return result || 'DEV001'
    } catch (error) {
      return 'DEV001'
    }
  }, [personalInfo?.email])

  // Responsive dimensions - Optimized for mobile
  const dimensions = useMemo(() => {
    const baseWidth = isMobile ? 260 : 320
    const baseHeight = isMobile ? 360 : 480
    
    return {
      avatarWidth: baseWidth,
      avatarHeight: baseHeight,
      imageSize: isMobile ? 120 : 160,
    }
  }, [isMobile])

  // Removed QR pattern generation for cleaner mobile experience

  // Loading state
  if (!isClient) {
    return (
      <div className={`flex justify-center items-center ${className}`} style={{ height: '400px' }}>
        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-2xl" 
             style={{ width: '280px', height: '400px' }} />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex justify-center items-center ${className}`}
      style={{ 
        height: `${dimensions.avatarHeight + 80}px`,
        perspective: '1000px'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Professional 3D Avatar Card */}
      <motion.div
        ref={avatarRef}
        style={{
          rotateX: isHovering && !isMobile ? rotateX : 0,
          rotateY: isHovering && !isMobile ? rotateY : 0,
          scale: scale,
          width: dimensions.avatarWidth,
          height: dimensions.avatarHeight,
        }}
        className="relative cursor-pointer"
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Enhanced 3D Card Body */}
        <div
          className={`relative w-full h-full rounded-2xl overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
              : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
          } shadow-2xl`}
          style={{
            transformStyle: "preserve-3d",
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)
            `,
            backgroundSize: "12px 12px, 8px 8px, 100% 100%",
            boxShadow: `
              0 20px 40px rgba(0,0,0,0.3),
              0 8px 16px rgba(0,0,0,0.2),
              inset 0 1px 2px rgba(255,255,255,0.1),
              inset 0 -1px 2px rgba(0,0,0,0.1)
            `
          }}
        >
          {/* Professional Header */}
          <div
            className={`h-16 relative overflow-hidden ${
              isDark
                ? "bg-gradient-to-r from-slate-600/90 via-slate-700/90 to-slate-800/90"
                : "bg-gradient-to-r from-gray-200/90 via-gray-300/90 to-gray-400/90"
            }`}
            style={{
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.1),
                inset 0 -2px 4px rgba(0,0,0,0.2),
                0 2px 4px rgba(0,0,0,0.1)
              `
            }}
          >
            <div className="flex items-center justify-between h-full px-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                    isDark ? "text-cyan-400" : "text-cyan-600"
                  }`}
                >
                  <FaCode className="text-lg" />
                </div>
                <div>
                  <div className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                    jasilmeledath.dev
                  </div>
                  <div className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Portfolio
                  </div>
                </div>
              </div>
              <div className={`text-right text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                <div className="font-mono font-semibold">ID: {staticId && staticId.length > 0 ? staticId : 'DEV001'}</div>
                <div>2025</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`${isMobile ? "p-3 pb-16" : "p-4 pb-24"} space-y-4`}>
            {/* Professional Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <div
                  className={`${
                    isMobile ? "w-28 h-28" : "w-36 h-36"
                  } rounded-full overflow-hidden shadow-2xl relative ${
                    isDark
                      ? "bg-gradient-to-br from-slate-600/50 to-slate-800/50"
                      : "bg-gradient-to-br from-gray-100/50 to-gray-300/50"
                  }`}
                  style={{
                    border: `3px solid ${isDark ? "#334155" : "#94a3b8"}`,
                    boxShadow: `
                      0 8px 25px rgba(0,0,0,0.3),
                      inset 0 2px 4px rgba(255,255,255,0.1),
                      inset 0 -2px 4px rgba(0,0,0,0.1)
                    `
                  }}
                >
                  {/* Avatar Image */}
                  {normalizeImageUrl(personalInfo?.avatar) && !imageError && (
                    <img
                      src={normalizeImageUrl(personalInfo.avatar)}
                      alt={`${personalInfo?.name || "Professional"} Avatar`}
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        setImageLoaded(true)
                        setImageError(false)
                        onLoad && onLoad()
                      }}
                      onError={() => {
                        setImageError(true)
                        setImageLoaded(false)
                        onError && onError()
                      }}
                      style={{
                        filter: "contrast(1.05) saturate(1.1)",
                        transition: "opacity 0.3s ease-in-out"
                      }}
                    />
                  )}
                  
                  {/* Loading State */}
                  {personalInfo?.avatar && !imageError && !imageLoaded && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center ${
                        isDark ? "bg-slate-700/40" : "bg-gray-100/40"
                      }`}
                    >
                      <AiOutlineLoading3Quarters className={`animate-spin text-2xl ${isDark ? "text-gray-300" : "text-gray-600"}`} />
                    </div>
                  )}
                  
                  {/* Fallback Avatar */}
                  {(!personalInfo?.avatar || imageError) && (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        isDark ? "bg-gradient-to-br from-slate-600 to-slate-700" : "bg-gradient-to-br from-gray-200 to-gray-300"
                      }`}
                    >
                      <FaUser className={`text-4xl filter drop-shadow-sm ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                    </div>
                  )}
                  
                  {/* 3D Gloss Effect */}
                  <div 
                    className="absolute inset-0 rounded-full pointer-events-none opacity-30"
                    style={{
                      background: `
                        linear-gradient(135deg, 
                          rgba(255,255,255,0.6) 0%, 
                          rgba(255,255,255,0.1) 30%,
                          transparent 70%, 
                          rgba(0,0,0,0.1) 100%
                        )
                      `
                    }}
                  />
                </div>
                
                {/* Status Badge */}
                <div 
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                    imageLoaded && !imageError 
                      ? "bg-green-500" 
                      : isDark ? "bg-slate-600" : "bg-gray-400"
                  }`}
                >
                  {imageLoaded && !imageError ? (
                    <FaCheck className="text-white text-xs" />
                  ) : (
                    <FaCamera className="text-white text-xs" />
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information - Optimized for Mobile */}
            <div className="text-center space-y-3">
              {/* Name and Title */}
              <div className="space-y-1">
                <h3 className={`font-bold leading-tight ${
                  isMobile ? "text-lg" : "text-xl"
                } ${isDark ? "text-white" : "text-gray-900"}`}>
                  {personalInfo?.name || "Professional"}
                </h3>
                <p className={`font-semibold ${
                  isMobile ? "text-sm" : "text-base"
                } ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                  {personalInfo?.title || "Full Stack Engineer"}
                </p>
              </div>
              
              {/* Contact Details - Enhanced Mobile Design */}
              <div
                className={`text-sm p-4 mx-2 rounded-xl ${
                  isDark ? "bg-slate-800/50 border border-slate-600/30" : "bg-gray-100/50 border border-gray-300/30"
                }`}
                style={{
                  boxShadow: `
                    inset 0 1px 3px rgba(0,0,0,0.1),
                    0 1px 2px rgba(0,0,0,0.05)
                  `
                }}
              >
                <div className={`flex items-center justify-center space-x-2 mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  <FaMapMarkerAlt className={`${isMobile ? "text-sm" : "text-base"}`} />
                  <span className={`truncate ${isMobile ? "text-sm" : "text-base"}`}>
                    {personalInfo?.location || "Location"}
                  </span>
                </div>
                <div className={`flex items-center justify-center space-x-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  <FaEnvelope className={`${isMobile ? "text-sm" : "text-base"}`} />
                  <span className={`font-mono truncate ${isMobile ? "text-xs" : "text-sm"}`}>
                    {personalInfo?.email || "email@example.com"}
                  </span>
                </div>
              </div>
              
              {/* Professional Status Badge */}
              <div className="flex justify-center">
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold ${
                  isDark ? "bg-green-900/30 text-green-400 border border-green-700/50" : "bg-green-100 text-green-700 border border-green-300"
                }`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Available for Projects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Footer */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-10 flex items-center justify-between px-4 ${
              isDark ? "bg-gradient-to-r from-slate-800/90 to-slate-700/90" : "bg-gradient-to-r from-gray-100/90 to-gray-200/90"
            }`}
            style={{
              borderTop: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`,
              boxShadow: `
                inset 0 1px 2px rgba(255,255,255,0.1),
                0 -1px 2px rgba(0,0,0,0.1)
              `
            }}
          >
            <div className={`text-xs font-mono font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              VERIFIED
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className={`text-xs font-mono font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
                ACTIVE
              </span>
            </div>
          </div>

          {/* Enhanced 3D Effects */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-40"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(255,255,255,0.4) 0%, 
                  rgba(255,255,255,0.1) 25%,
                  transparent 50%, 
                  transparent 75%, 
                  rgba(0,0,0,0.1) 100%
                )
              `
            }}
          />
          
          {/* Ambient Occlusion */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-20"
            style={{
              boxShadow: `
                inset 0 0 20px rgba(0,0,0,0.3),
                inset 0 0 40px rgba(0,0,0,0.1)
              `
            }}
          />
        </div>

        {/* Interactive Elements */}
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0.7)",
              "0 0 0 4px rgba(59, 130, 246, 0)",
              "0 0 0 0 rgba(59, 130, 246, 0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </motion.div>

        <motion.div
          className="absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center shadow-lg text-yellow-500"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaStar className="text-xs" />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Avatar3D
