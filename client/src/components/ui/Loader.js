/**
 * @fileoverview Enhanced Minimalistic Loader Component - Production Ready
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @version 2.0.0
 * @description Professional, minimalistic loaders with perfect dark/light mode support
 */

import React, { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// Loader variants
export const LOADER_VARIANTS = {
  SPINNER: 'spinner',
  DOTS: 'dots', 
  PROGRESS: 'progress',
  PULSE: 'pulse'
};

// Loader sizes
export const LOADER_SIZES = {
  SM: 'sm',
  MD: 'md', 
  LG: 'lg'
};

/**
 * Enhanced Minimalistic Loader Component
 * @param {Object} props - Component props
 * @param {boolean} props.show - Controls loader visibility
 * @param {string} props.variant - Loader animation type
 * @param {string} props.size - Loader size
 * @param {string} props.message - Loading message text
 * @param {number} props.progress - Progress value (0-100)
 * @param {boolean} props.inline - Inline display mode
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element|null} Enhanced loader component
 */
const Loader = memo(({
  show = false,
  variant = LOADER_VARIANTS.SPINNER,
  size = LOADER_SIZES.MD,
  message = 'Loading...',
  progress = 0,
  inline = false,
  className = ''
}) => {
  const { isDark } = useTheme();

  // Enhanced theme-aware styling with minimalistic approach
  const theme = useCallback(() => {
    if (isDark) {
      return {
        // Dark mode - Clean green palette matching portfolio
        primary: '#4ade80',         // Green-400
        secondary: '#22c55e',       // Green-500  
        tertiary: '#16a34a',        // Green-600
        text: '#f3f4f6',           // Gray-100 (better contrast)
        textSecondary: '#9ca3af',   // Gray-400
        background: '#000000',      // Pure black
        surface: '#111827',         // Gray-900
        border: 'rgba(74, 222, 128, 0.15)', // Green with opacity
        track: 'transparent',       // Clean transparent track
        accent: '#10b981'          // Emerald-500
      };
    }
    return {
      // Light mode - Clean, professional palette  
      primary: '#1f2937',          // Gray-800
      secondary: '#374151',        // Gray-700
      tertiary: '#4b5563',         // Gray-600
      text: '#1f2937',            // Gray-800 (strong contrast)
      textSecondary: '#6b7280',    // Gray-500
      background: '#ffffff',       // Pure white
      surface: '#f9fafb',         // Gray-50
      border: 'rgba(31, 41, 55, 0.08)', // Gray with opacity
      track: 'transparent',        // Clean transparent track
      accent: '#059669'           // Emerald-600
    };
  }, [isDark]);

  // Refined size configurations
  const sizeConfig = useCallback(() => {
    const configs = {
      [LOADER_SIZES.SM]: {
        spinner: { width: 16, height: 16, borderWidth: 2 },
        dots: { width: 4, height: 4, gap: 4 },
        progress: { height: 2, width: 120 },
        pulse: { width: 20, height: 20 },
        text: 'text-xs',
        spacing: 6
      },
      [LOADER_SIZES.MD]: {
        spinner: { width: 20, height: 20, borderWidth: 2 },
        dots: { width: 5, height: 5, gap: 5 },
        progress: { height: 3, width: 160 },
        pulse: { width: 28, height: 28 },
        text: 'text-sm',
        spacing: 10
      },
      [LOADER_SIZES.LG]: {
        spinner: { width: 24, height: 24, borderWidth: 3 },
        dots: { width: 6, height: 6, gap: 6 },
        progress: { height: 4, width: 200 },
        pulse: { width: 36, height: 36 },
        text: 'text-base',
        spacing: 14
      }
    };
    return configs[size] || configs[LOADER_SIZES.MD];
  }, [size]);

  const colors = theme();
  const config = sizeConfig();

  // Enhanced Spinner with clean, professional design
  const SpinnerLoader = memo(() => (
    <div
      className="relative inline-block"
      style={{
        width: config.spinner.width,
        height: config.spinner.height
      }}
    >
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          border: `${config.spinner.borderWidth}px solid transparent`,
          borderTopColor: colors.primary,
          animationDuration: '1s',
          animationTimingFunction: 'linear'
        }}
      />
    </div>
  ));

  // Enhanced Dots with smooth bounce animation
  const DotsLoader = memo(() => (
    <div 
      className="flex items-center justify-center"
      style={{ gap: config.dots.gap }}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="rounded-full"
          style={{
            width: config.dots.width,
            height: config.dots.height,
            backgroundColor: colors.primary
          }}
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.15,
            ease: [0.4, 0, 0.6, 1]
          }}
        />
      ))}
    </div>
  ));

  // Enhanced Progress with smooth transitions
  const ProgressLoader = memo(() => {
    const progressValue = Math.min(Math.max(progress || 0, 0), 100);
    
    return (
      <div className="flex flex-col items-center" style={{ gap: config.spacing }}>
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: config.progress.width,
            height: config.progress.height,
            backgroundColor: colors.track
          }}
        >
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ backgroundColor: colors.primary }}
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1] 
            }}
          />
        </div>
        {progressValue > 0 && (
          <motion.div
            className={`${config.text} font-mono tracking-wider font-medium`}
            style={{ color: colors.textSecondary }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {progressValue}%
          </motion.div>
        )}
      </div>
    );
  });

  // Enhanced Pulse with concentric rings
  const PulseLoader = memo(() => (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: config.pulse.width,
        height: config.pulse.height
      }}
    >
      {/* Outer ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: config.pulse.width,
          height: config.pulse.height,
          backgroundColor: colors.primary,
          opacity: 0.15
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.15, 0, 0.15]
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: config.pulse.width * 0.65,
          height: config.pulse.height * 0.65,
          backgroundColor: colors.primary,
          opacity: 0.3
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
      
      {/* Inner core */}
      <div
        className="rounded-full"
        style={{
          width: config.pulse.width * 0.25,
          height: config.pulse.height * 0.25,
          backgroundColor: colors.primary
        }}
      />
    </div>
  ));

  // Render appropriate loader variant
  const renderLoader = () => {
    switch (variant) {
      case LOADER_VARIANTS.DOTS:
        return <DotsLoader />;
      case LOADER_VARIANTS.PROGRESS:
        return <ProgressLoader />;
      case LOADER_VARIANTS.PULSE:
        return <PulseLoader />;
      case LOADER_VARIANTS.SPINNER:
      default:
        return <SpinnerLoader />;
    }
  };

  // Don't render if not shown
  if (!show) return null;

  // Inline version for buttons and small spaces
  if (inline) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className={`inline-flex items-center ${className}`}
        style={{ gap: config.spacing }}
        role="status"
        aria-live="polite"
        aria-label={message || "Loading content"}
      >
        {renderLoader()}
        {message && (
          <span
            className={`${config.text} font-medium tracking-wide`}
            style={{ color: colors.textSecondary }}
          >
            {message}
          </span>
        )}
      </motion.div>
    );
  }

  // Full layout version for page loading
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center p-4 ${className}`}
      style={{ gap: config.spacing }}
      role="status"
      aria-live="polite"
      aria-label={message || "Loading content"}
    >
      {renderLoader()}
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.12 }}
          className={`${config.text} font-medium text-center max-w-sm tracking-wide`}
          style={{ color: colors.text }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
});

// Display name for debugging
Loader.displayName = 'Loader';

export default Loader;