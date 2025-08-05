/**
 * @fileoverview Enhanced Minimalistic Page Loader Component
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @version 2.0.0
 * @description Professional page loading with minimalistic brand-consistent design
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useTheme } from '../../context/ThemeContext';
import Loader, { LOADER_VARIANTS, LOADER_SIZES } from './Loader';

/**
 * Enhanced Minimalistic Page Loader
 * @param {Object} props - Component props
 * @param {boolean} props.show - Show/hide loader
 * @param {string} props.message - Loading message
 * @returns {JSX.Element|null} Page loader component
 */
export default function PageLoader({ show = false, message = 'Loading...' }) {
  const { isDark } = useTheme();

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isDark ? 'bg-black/95' : 'bg-white/95'
        }`}
        style={{ backdropFilter: 'blur(10px)' }}
      >
        <div className="text-center">
          {/* Single clean spinner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${
              isDark 
                ? 'border-green-400' 
                : 'border-gray-800'
            }`}
            style={{
              animationDuration: '1s',
              animationTimingFunction: 'linear'
            }}
          />
          
          {/* Simple message */}
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {message}
            </motion.p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Router Page Loader - automatically shows during route transitions
 * @returns {JSX.Element|null} Router page loader
 */
export function RouterPageLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  useEffect(() => {
    const handleStart = (url) => {
      // Set contextual loading messages
      if (url.includes('/portfolio')) {
        setLoadingMessage('Loading Portfolio...');
      } else if (url.includes('/blog')) {
        setLoadingMessage('Loading Blog...');
      } else if (url.includes('/admin')) {
        setLoadingMessage('Loading Admin...');
      } else {
        setLoadingMessage('Loading...');
      }
      setLoading(true);
    };

    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return <PageLoader show={loading} message={loadingMessage} />;
}