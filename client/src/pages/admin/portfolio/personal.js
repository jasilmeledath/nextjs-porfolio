/**
 * @fileoverview Personal Information Management Page
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import PersonalInfoForm from '../../../components/admin/PersonalInfoForm';

export default function PersonalInfoPage() {
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
          <p className="text-green-400 font-mono">Loading personal information...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Personal Information - Portfolio Management</title>
        <meta name="description" content="Manage personal information and profile details" />
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
                  PERSONAL_INFO
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
          >
            <PersonalInfoForm />
          </motion.div>
        </main>
      </div>
    </>
  );
}

PersonalInfoPage.requireAuth = true;
