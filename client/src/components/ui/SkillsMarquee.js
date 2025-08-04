/**
 * @fileoverview Skills Marquee Component - Enhanced multi-line horizontal scrolling with touch support
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-08-02
 * @lastModified 2025-08-02
 * @version 2.0.0
 */

"use client"

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// React Icons Dynamic Imports
const getIconComponent = (iconLibrary, iconIdentifier) => {
  try {
    switch (iconLibrary) {
      case 'react-icons/si':
        return require('react-icons/si')[iconIdentifier];
      case 'react-icons/fa':
        return require('react-icons/fa')[iconIdentifier];
      case 'react-icons/di':
        return require('react-icons/di')[iconIdentifier];
      case 'react-icons/bs':
        return require('react-icons/bs')[iconIdentifier];
      case 'react-icons/ai':
        return require('react-icons/ai')[iconIdentifier];
      default:
        return null;
    }
  } catch (error) {
    console.warn(`[SkillsMarquee] Failed to load icon: ${iconLibrary}/${iconIdentifier}`, error);
    return null;
  }
};

// Auto-fix for broken logoIdentifiers (temporary solution)
const getAutoFixedIconIdentifier = (skillName) => {
  const fixes = {
    'PHP': 'SiPhp',
    'Php': 'SiPhp',
    'Firebase': 'SiFirebase',
    'Photoshop': 'SiAdobephotoshop',
    'Adobe Photoshop': 'SiAdobephotoshop',
    'Illustrator': 'SiAdobeillustrator',
    'Adobe Illustrator': 'SiAdobeillustrator',
    'Adobe XD': 'SiAdobexd',
    'Vercel': 'SiVercel',
    'Blender': 'SiBlender',
    'Autodesk Maya': 'SiAutodesk',
    'Maya': 'SiAutodesk'
  };
  return fixes[skillName] || null;
};

// Default fallback icon component
const DefaultIcon = ({ className }) => (
  <div className={`${className} bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
    ?
  </div>
);

const SkillsMarquee = ({ 
  skills = {}, 
  isDark = true, 
  speed = 3, // Very slow and smooth speed for better readability
  pauseOnHover = true,
  direction = 'left',
  rows = 2, // Number of marquee rows
  enableTouch = true, // Enable touch/drag interactions
  mobileOptimized = true // Mobile-specific optimizations
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [touchVelocity, setTouchVelocity] = useState(0);
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const dragX = useMotionValue(0);
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Process skills by category - each category gets its own row
  const processedSkills = useMemo(() => {
    if (!skills || typeof skills !== 'object') return [];
    
    // Debug: Log the raw skills data received
    
    const categoryRows = [];
    const categories = Object.entries(skills);
    
    // Filter out empty categories
    const validCategories = categories.filter(([category, skillList]) => 
      Array.isArray(skillList) && skillList.length > 0
    );
    
    if (validCategories.length === 0) return [];
    
    // Show ALL categories, not limited by rows prop
    validCategories.forEach(([category, skillList]) => {
      
      const processedSkillList = skillList.map((skill, index) => {
        // Debug: Log each skill's icon fields
          icon: skill.icon,
          logoIdentifier: skill.logoIdentifier,
          logoLibrary: skill.logoLibrary,
          color: skill.color
        });
        
        return {
          ...skill,
          id: `${category}-${index}`,
          category
        };
      });
      
      categoryRows.push({
        category,
        skills: processedSkillList
      });
    });
    
    return categoryRows;
  }, [skills]);

  // Mobile-optimized sizing - Reduced size for both mobile and desktop
  const sizing = useMemo(() => {
    const categoryCount = processedSkills.length;
    if (isMobile) {
      return {
        iconSize: 'w-6 h-6', // Smaller for mobile
        iconInner: 'w-4 h-4',
        textSize: 'text-xs',
        spacing: 'space-x-2 mx-2',
        rowHeight: 'h-12',
        containerHeight: categoryCount === 1 ? 'h-16' : categoryCount === 2 ? 'h-32' : categoryCount === 3 ? 'h-48' : 'h-64'
      };
    } else {
      return {
        iconSize: 'w-8 h-8', // Reduced from w-12 h-12
        iconInner: 'w-5 h-5', // Reduced from w-7 h-7
        textSize: 'text-sm',
        spacing: 'space-x-3 mx-4', // Reduced spacing
        rowHeight: 'h-16', // Reduced from h-24
        containerHeight: categoryCount === 1 ? 'h-20' : categoryCount === 2 ? 'h-40' : categoryCount === 3 ? 'h-60' : 'h-80'
      };
    }
  }, [isMobile, processedSkills]);

  // Touch handling with momentum and infinite scrolling
  const handleDragStart = () => {
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    
    // Calculate velocity for momentum scrolling
    const velocity = info.velocity.x;
    setTouchVelocity(velocity);
    
    // Resume animation after a brief delay to show momentum effect
    setTimeout(() => {
      if (!pauseOnHover) {
        setIsPaused(false);
      }
      setTouchVelocity(0);
    }, 500);
  };

  // Don't render on server to avoid hydration issues
  if (!isClient) {
    return (
      <div className={`w-full ${sizing.containerHeight} rounded-lg animate-pulse ${
        isDark ? 'bg-gray-800/20' : 'bg-gray-200/20'
      }`} />
    );
  }

  if (processedSkills.length === 0) {
    return (
      <div className={`w-full ${sizing.containerHeight} rounded-lg border-2 border-dashed flex items-center justify-center ${
        isDark ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'
      }`}>
        <span className={`${sizing.textSize} font-medium`}>No skills to display</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden ${sizing.containerHeight}`}
      style={{ margin: 0, padding: 0 }}
    >
      {/* Natural fade-out gradients - perfectly aligned to edges */}
      <div className={`absolute left-0 top-0 bottom-0 ${isMobile ? 'w-8' : 'w-12'} z-10 pointer-events-none ${
        isDark 
          ? 'bg-gradient-to-r from-gray-900 via-gray-900/60 via-gray-900/20 to-transparent' 
          : 'bg-gradient-to-r from-white via-white/70 via-white/30 to-transparent'
      }`} />
      <div className={`absolute right-0 top-0 bottom-0 ${isMobile ? 'w-8' : 'w-12'} z-10 pointer-events-none ${
        isDark 
          ? 'bg-gradient-to-l from-gray-900 via-gray-900/60 via-gray-900/20 to-transparent' 
          : 'bg-gradient-to-l from-white via-white/70 via-white/30 to-transparent'
      }`} />

      {/* Multi-row Marquee Container - One row per category */}
      <div className="flex flex-col justify-center h-full py-1">
        {processedSkills.map((categoryData, rowIndex) => (
          <MarqueeRow
            key={categoryData.category}
            skills={categoryData.skills}
            category={categoryData.category}
            isDark={isDark}
            speed={speed}
            direction={rowIndex % 2 === 0 ? direction : direction === 'left' ? 'right' : 'left'}
            isPaused={isPaused}
            sizing={sizing}
            enableTouch={enableTouch}
            touchVelocity={touchVelocity}
            isDragging={isDragging}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onHover={() => pauseOnHover && setIsPaused(true)}
            onLeave={() => pauseOnHover && !isDragging && setIsPaused(false)}
          />
        ))}
      </div>


    </div>
  );
};

// Individual Marquee Row Component for each category
const MarqueeRow = ({
  skills,
  category,
  isDark,
  speed,
  direction,
  isPaused,
  sizing,
  enableTouch,
  touchVelocity,
  isDragging,
  onDragStart,
  onDragEnd,
  onHover,
  onLeave
}) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const animationRef = useRef();
  const lastUpdateTime = useRef(Date.now());
  const touchStartTime = useRef(null);
  
  // Create infinite loop with optimized copies for performance
  const duplicatedSkills = useMemo(() => {
    if (!skills || skills.length === 0) return [];
    
    // Create exactly 3 copies for seamless infinite scroll
    return [...skills, ...skills, ...skills];
  }, [skills]);

  // Calculate animation parameters for seamless loop - fixed for no glitch
  const skillWidth = sizing.iconSize.includes('w-6') ? 80 : sizing.iconSize.includes('w-8') ? 100 : 120;
  const singleSetWidth = skills.length * skillWidth;
  
  // Animation duration for one complete set (seamless loop) - Very slow and smooth
  const animationDuration = singleSetWidth / (speed * 3); // Increased duration for ultra-smooth slow animation

  // Touch interaction handlers
  const handleTouchDragStart = (event, info) => {
    touchStartTime.current = Date.now();
    onDragStart();
  };

  const handleTouchDrag = (event, info) => {
    if (!enableTouch) return;
    // Drag handling is now managed by Framer Motion's built-in drag system
  };

  const handleTouchDragEnd = (event, info) => {
    const dragDuration = Date.now() - (touchStartTime.current || Date.now());
    const dragDistance = Math.abs(info.offset.x);
    
    // Smooth transition back to normal animation - no manual offset needed
    setTimeout(() => {
      // Animation will naturally resume
    }, 100);
    
    onDragEnd(event, info);
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${sizing.rowHeight} py-1`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <motion.div
        className="flex items-center"
        animate={{
          x: direction === 'left' ? [-singleSetWidth, 0] : [0, -singleSetWidth]
        }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        drag={enableTouch ? "x" : false}
        dragConstraints={{ left: -singleSetWidth * 0.5, right: singleSetWidth * 0.5 }}
        dragElastic={0.02}
        dragMomentum={false}
        onDragStart={handleTouchDragStart}
        onDrag={handleTouchDrag}
        onDragEnd={handleTouchDragEnd}
        whileDrag={{
          cursor: 'grabbing',
          scale: 0.99,
        }}
        style={{
          width: 'fit-content',
          animationPlayState: isPaused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {duplicatedSkills.map((skill, index) => {
          // Try to get React icon - with auto-fix for broken logoIdentifiers
          let logoIdentifier = skill.logoIdentifier;
          let logoLibrary = skill.logoLibrary;
          
          // Auto-fix broken logoIdentifiers
          if (!logoIdentifier && skill.name) {
            logoIdentifier = getAutoFixedIconIdentifier(skill.name);
            if (logoIdentifier) {
            }
          }
          
          const IconComponent = logoIdentifier && logoLibrary 
            ? getIconComponent(logoLibrary, logoIdentifier)
            : null;

          // Debug: Log icon resolution for each skill
          if (index < 3) { // Only log first few to avoid spam
              logoIdentifier: logoIdentifier,
              logoLibrary: logoLibrary,
              icon: skill.icon,
              IconComponent: IconComponent ? 'Found' : 'Not found',
              willUseReactIcon: !!IconComponent,
              autoFixed: logoIdentifier !== skill.logoIdentifier
            });
          }

          return (
            <motion.div
              key={`${skill.id}-${index}`}
              className={`flex items-center ${sizing.spacing} flex-shrink-0 group cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                // Add touch-friendly styling
                touchAction: enableTouch ? 'pan-x' : 'auto',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
              }}
            >
              {/* Skill Icon */}
              <div className={`${sizing.iconSize} rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                isDark 
                  ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20' 
                  : 'bg-gradient-to-br from-black/5 to-black/2 border border-black/10'
              }`}>
                {IconComponent ? (
                  <IconComponent 
                    className={`${sizing.iconInner} transition-transform duration-300 group-hover:scale-110`}
                    style={{ 
                      color: skill.color || (isDark ? '#ffffff' : '#374151') 
                    }}
                  />
                ) : (
                  <span className="text-lg transition-all duration-300">
                    {skill.icon || '🔧'}
                  </span>
                )}
              </div>

              {/* Skill Name */}
              <div className="flex flex-col">
                <span className={`font-semibold ${sizing.textSize} whitespace-nowrap transition-colors duration-300 group-hover:text-cyan-400 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {skill.name}
                </span>
                
                {/* Level indicator for desktop */}
                {!sizing.iconSize.includes('w-8') && skill.level && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`w-12 h-0.5 rounded-full mt-1 ${
                      isDark ? 'bg-white/20' : 'bg-black/20'
                    }`}>
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SkillsMarquee;
