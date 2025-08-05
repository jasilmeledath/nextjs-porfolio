/**
 * @fileoverview Admin Portfolio Management Page - Cyber Themed
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiClock,
  FiUser,
  FiTrendingUp,
  FiMessageSquare,
  FiTag,
  FiCalendar,
  FiArrowLeft,
  FiMoreVertical,
  FiSettings,
  FiRefreshCw,
  FiExternalLink,
  FiFolder,
  FiImage,
  FiCode,
  FiBriefcase,
  FiLink,
  FiStar,
  FiAward,
  FiTarget,
  FiDownload
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import PortfolioManagementService from '../../services/portfolio-management-service';
import ResumeManager from '../../components/admin/ResumeManager';

/**
 * Admin Portfolio Management Page Component
 * @function AdminPortfolioPage
 * @returns {JSX.Element} Admin portfolio management component
 */
export default function AdminPortfolioPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  
  // State management
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Portfolio management tabs
  const portfolioTabs = [
    { id: 'personal', label: 'Personal Info', icon: FiUser, route: '/admin/portfolio/personal' },
    { id: 'projects', label: 'Projects', icon: FiFolder, route: '/admin/portfolio/projects' },
    { id: 'skills', label: 'Skills', icon: FiCode, route: '/admin/portfolio/skills' },
    { id: 'experience', label: 'Experience', icon: FiBriefcase, route: '/admin/portfolio/experience' },
    { id: 'social', label: 'Social Links', icon: FiLink, route: '/admin/portfolio/social' }
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  // Load portfolio data
  useEffect(() => {
    if (isAuthenticated) {
      loadPortfolioData();
    }
  }, [isAuthenticated]);

  /**
   * Load portfolio data
   */
  const loadPortfolioData = async () => {
    try {
      setPortfolioLoading(true);
      
      // Get both complete portfolio data and statistics
      const [statsResponse, portfolioResponse] = await Promise.all([
        PortfolioManagementService.getPortfolioStats(),
        PortfolioManagementService.getCompletePortfolio()
      ]);
      
      if (statsResponse.success && portfolioResponse.success) {
        // Merge statistics with portfolio data
        setPortfolioData({
          ...portfolioResponse.data,
          stats: statsResponse.data
        });
      } else {
        toast.error('Failed to load portfolio data');
      }
    } catch (error) {
      console.error('[Portfolio] Error loading portfolio data:', error);
      toast.error('Failed to load portfolio data');
    } finally {
      setPortfolioLoading(false);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPortfolioData();
    setIsRefreshing(false);
    toast.success('Portfolio data refreshed');
  };

  /**
   * Navigate to portfolio section
   */
  const navigateToSection = (sectionId) => {
    const section = portfolioTabs.find(tab => tab.id === sectionId);
    if (section) {
      router.push(section.route);
    }
  };

  /**
   * Go back to dashboard
   */
  const goBackToDashboard = () => {
    router.push('/admin/dashboard');
  };

  // Loading state - clean, minimalistic professional loader
  if (loading || portfolioLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent border-green-400 rounded-full animate-spin mx-auto mb-4" style={{
            animationDuration: '1s',
            animationTimingFunction: 'linear'
          }}></div>
          <p className="text-green-300 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Portfolio Management - Admin Dashboard</title>
        <meta name="description" content="Manage portfolio content and information" />
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

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-green-500/30 shadow-lg shadow-green-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={goBackToDashboard}
                  className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors group"
                >
                  <FiArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="font-mono text-sm">DASHBOARD</span>
                </button>
                <div className="w-px h-6 bg-green-500/30"></div>
                <h1 className="text-xl sm:text-2xl font-mono font-bold text-green-400 tracking-wider">
                  PORTFOLIO_MANAGEMENT
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-mono text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg border border-green-500/30 hover:border-green-500/50 transition-all duration-300 disabled:opacity-50"
                >
                  <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">REFRESH</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Portfolio Management Tabs */}
            <motion.div variants={fadeInUp}>
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-mono font-bold text-green-400 tracking-wide">
                    PORTFOLIO_MODULES
                  </h2>
                  <div className="text-green-600 font-mono text-xs">
                    [{portfolioTabs.length}] SECTIONS
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {portfolioTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => navigateToSection(tab.id)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex flex-col items-center p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-500/30 transition-colors">
                          <Icon className="w-6 h-6 text-green-400 group-hover:animate-pulse" />
                        </div>
                        <span className="text-sm font-mono font-medium text-green-300 group-hover:text-green-200 text-center">
                          {tab.label}
                        </span>
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 group-hover:bg-green-400 transition-colors"></div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Portfolio Statistics */}
            <motion.div variants={fadeInUp}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl border border-blue-500/30 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <FiFolder className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-xs font-mono text-blue-600">PROJECTS</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-blue-400 mb-2">
                    {portfolioData?.stats?.projects || 0}
                  </div>
                  <div className="text-xs text-blue-600 font-mono">
                    Active Projects
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl border border-green-500/30 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <FiCode className="w-6 h-6 text-green-400" />
                    </div>
                    <span className="text-xs font-mono text-green-600">SKILLS</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-green-400 mb-2">
                    {portfolioData?.stats?.skills || 0}
                  </div>
                  <div className="text-xs text-green-600 font-mono">
                    Technical Skills
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl border border-purple-500/30 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <FiBriefcase className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-xs font-mono text-purple-600">EXPERIENCE</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-purple-400 mb-2">
                    {portfolioData?.stats?.experience || 0}
                  </div>
                  <div className="text-xs text-purple-600 font-mono">
                    Work Experience
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl border border-yellow-500/30 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <FiLink className="w-6 h-6 text-yellow-400" />
                    </div>
                    <span className="text-xs font-mono text-yellow-600">SOCIAL</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-yellow-400 mb-2">
                    {portfolioData?.stats?.socialLinks || 0}
                  </div>
                  <div className="text-xs text-yellow-600 font-mono">
                    Social Links
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeInUp}>
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-mono font-bold text-green-400 tracking-wide">
                    QUICK_ACTIONS
                  </h3>
                  <div className="text-green-600 font-mono text-xs">
                    READY
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link href="/admin/portfolio/personal">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300 cursor-pointer group"
                    >
                      <FiUser className="w-5 h-5 text-green-400 group-hover:animate-pulse" />
                      <div>
                        <div className="text-sm font-mono font-medium text-green-300">
                          Update Personal Info
                        </div>
                        <div className="text-xs text-green-600">
                          Edit profile details
                        </div>
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/admin/portfolio/projects">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 cursor-pointer group"
                    >
                      <FiFolder className="w-5 h-5 text-blue-400 group-hover:animate-pulse" />
                      <div>
                        <div className="text-sm font-mono font-medium text-blue-300">
                          Manage Projects
                        </div>
                        <div className="text-xs text-blue-600">
                          Add/edit projects
                        </div>
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/admin/portfolio/skills">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer group"
                    >
                      <FiCode className="w-5 h-5 text-purple-400 group-hover:animate-pulse" />
                      <div>
                        <div className="text-sm font-mono font-medium text-purple-300">
                          Update Skills
                        </div>
                        <div className="text-xs text-purple-600">
                          Manage skill set
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Resume Manager */}
            <motion.div variants={fadeInUp}>
              <ResumeManager />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  );
}

/**
 * Require authentication for this page
 */
AdminPortfolioPage.requireAuth = true;
