/**
 * @fileoverview Reusable Theme Toggle Component
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { motion } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import { COMMON_IDS } from "../../constants/component-ids"

/**
 * Theme Toggle Button Component
 * @function ThemeToggle
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @returns {JSX.Element} Theme toggle button
 */
export default function ThemeToggle({ className = '', size = 'md' }) {
  const { toggleTheme, isDark, mounted } = useTheme()

  // Size variants
  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-lg',
    lg: 'p-4 text-xl'
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl opacity-0 ${className}`}>
        <div className="w-5 h-5" />
      </div>
    )
  }

  return (
    <motion.button
      id={COMMON_IDS.THEME_TOGGLE_BUTTON}
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${sizeClasses[size]} 
        rounded-2xl backdrop-blur-sm border transition-all duration-300
        ${isDark
          ? "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600/50"
          : "bg-white/50 border-slate-200/50 text-slate-600 hover:bg-white/80 hover:border-slate-300/50 shadow-sm"
        }
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div 
        animate={{ rotate: isDark ? 180 : 0 }} 
        transition={{ duration: 0.5 }}
      >
        {isDark ? "☀️" : "🌙"}
      </motion.div>
    </motion.button>
  )
}