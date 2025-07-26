/**
 * @fileoverview Experience Management Page
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';

export default function ExperiencePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  const goBackToPortfolio = () => {
    router.push('/admin/portfolio');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 font-mono">Loading experience management...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Experience Management - Portfolio Management</title>
        <meta name="description" content="Manage work experience and career history" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-green-500/30 shadow-lg shadow-green-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={goBackToPortfolio}
                  className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors group"
                >
                  <FiArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="font-mono text-sm">PORTFOLIO</span>
                </button>
                <div className="w-px h-6 bg-green-500/30"></div>
                <h1 className="text-xl sm:text-2xl font-mono font-bold text-green-400 tracking-wider">
                  EXPERIENCE_MANAGEMENT
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Coming Soon Placeholder */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-lg p-8 text-center">
              <div className="flex flex-col items-center mb-6">
                <FiBriefcase className="w-16 h-16 text-purple-400 mb-4" />
                <h2 className="text-2xl font-mono font-bold text-purple-400 tracking-wider">
                  EXPERIENCE_MODULE
                </h2>
              </div>
              <p className="text-purple-600 font-mono text-lg mb-6">
                Experience management interface under development...
              </p>
              <div className="flex items-center justify-center space-x-2 text-purple-700 font-mono text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Status: PENDING_IMPLEMENTATION</span>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}

ExperiencePage.requireAuth = true;
