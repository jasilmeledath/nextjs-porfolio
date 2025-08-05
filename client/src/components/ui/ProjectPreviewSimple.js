/**
 * @fileoverview Simplified Project Preview Modal Component - For Debugging
 */

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Github, Calendar, Users } from "lucide-react"
import { getProjectMainImage } from '../../utils/image-utils'
import MarkdownRenderer from './MarkdownRenderer'
import EnhancedImage from './EnhancedImage'

export default function ProjectPreview({ project, isOpen, onClose, isDark }) {

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, onClose])

  if (!project) {
    return null;
  }


  const modalVariants = {
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
        type: "spring",
        stiffness: 300,
        damping: 30,
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
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

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
            className={`relative w-full max-w-2xl max-h-[95vh] flex flex-col rounded-3xl shadow-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-gray-900/95 to-black/95 border border-white/10' 
                : 'bg-gradient-to-br from-white/95 to-gray-50/95 border border-black/10'
            } backdrop-blur-xl overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {project.title?.charAt(0) || 'P'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className={`text-2xl font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {project.title || 'Untitled Project'}
                    </h2>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {project.description || 'No description available'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-colors ${
                    isDark 
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                      : 'hover:bg-black/10 text-gray-600 hover:text-black'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Project Image */}
              {getProjectMainImage(project) !== "/placeholder.svg" && (
                <div className="mb-6">
                  <EnhancedImage
                    src={getProjectMainImage(project)}
                    alt={project.title}
                    className="w-full h-64 object-cover rounded-xl"
                    showErrorState={false}
                  />
                </div>
              )}

              {/* Project Details */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className={`text-lg font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    About This Project
                  </h3>
                  {project.longDescription ? (
                    <MarkdownRenderer 
                      content={project.longDescription}
                      isDark={isDark}
                      className="text-sm leading-relaxed"
                      compact={true}
                    />
                  ) : (
                    <p className={`text-sm leading-relaxed ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {project.description || 'No detailed description available.'}
                    </p>
                  )}
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <h3 className={`text-lg font-bold mb-3 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            isDark 
                              ? 'bg-white/10 text-white' 
                              : 'bg-black/10 text-black'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-6 border-t border-white/10">
              <div className="flex gap-3">
                {project.liveUrl && (
                  <button
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </button>
                )}
                {project.githubUrl && (
                  <button
                    onClick={() => window.open(project.githubUrl, '_blank')}
                    className={`flex-1 flex items-center justify-center px-4 py-3 backdrop-blur-sm border font-bold rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                        : 'bg-black/10 hover:bg-black/20 border-black/20 text-black'
                    }`}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Code
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
