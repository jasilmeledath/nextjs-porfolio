/**
 * @fileoverview Admin Dashboard Main Page - Cyber Themed
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 2.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiUser, 
  FiFileText, 
  FiMessageSquare, 
  FiImage, 
  FiBarChart2, 
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiEye,
  FiEdit3,
  FiUsers,
  FiTrendingUp,
  FiClock,
  FiActivity,
  FiShield
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

/**
 * Admin Dashboard Main Page Component
 * @function AdminDashboardPage
 * @returns {JSX.Element} Admin dashboard component
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading } = useAuth();
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalViews: 12547,
    blogPosts: 23,
    pendingComments: 5,
    recentActivity: []
  });

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

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('[Dashboard] Logout error:', error);
    }
  };

  /**
   * Toggle sidebar visibility
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Navigate to section
   * @param {string} section - Section to navigate to
   */
  const navigateToSection = (section) => {
    setActiveSection(section);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'System Overview', icon: FiHome },
    { id: 'portfolio', label: 'Portfolio Mgmt', icon: FiUser },
    { id: 'blog', label: 'Content Hub', icon: FiFileText },
    { id: 'comments', label: 'Moderation', icon: FiMessageSquare },
    { id: 'media', label: 'Media Vault', icon: FiImage },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
    { id: 'settings', label: 'Config', icon: FiSettings }
  ];

  // Stats cards data
  const statsCards = [
    {
      id: 'total-views',
      title: 'Traffic Nodes',
      value: dashboardStats.totalViews.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: FiEye,
      color: 'blue'
    },
    {
      id: 'blog-posts',
      title: 'Content Blocks',
      value: dashboardStats.blogPosts,
      change: '+3',
      changeType: 'positive',
      icon: FiFileText,
      color: 'green'
    },
    {
      id: 'pending-comments',
      title: 'Queue Status',
      value: dashboardStats.pendingComments,
      change: '+2',
      changeType: 'neutral',
      icon: FiMessageSquare,
      color: 'yellow'
    },
    {
      id: 'recent-activity',
      title: 'Active Sessions',
      value: '3',
      change: '0',
      changeType: 'neutral',
      icon: FiActivity,
      color: 'purple'
    }
  ];

  // Recent activity mock data
  const recentActivities = [
    {
      id: 1,
      type: 'blog',
      action: 'Content_Upload_Complete',
      title: 'Next.js Implementation Guide',
      time: '02:47:33',
      icon: FiEdit3
    },
    {
      id: 2,
      type: 'comment',
      action: 'New_Message_Received',
      title: 'React Security Best Practices',
      time: '04:12:15',
      icon: FiMessageSquare
    },
    {
      id: 3,
      type: 'view',
      action: 'Metric_Threshold_Exceeded',
      title: '10K Views Milestone Reached',
      time: '24:00:00',
      icon: FiTrendingUp
    },
    {
      id: 4,
      type: 'user',
      action: 'Profile_Data_Modified',
      title: 'Administrator Credentials Updated',
      time: '48:00:00',
      icon: FiUser
    }
  ];

  return (
    <>
      <Head>
        <title>ADMIN_CORE - System Dashboard</title>
        <meta name="description" content="Secure administrative interface for portfolio management" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div 
        id="admin-main-dashboard-layout-container"
        className="min-h-screen bg-black relative overflow-hidden"
      >
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
          {[...Array(20)].map((_, i) => (
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

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm"></div>
          </div>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/95 backdrop-blur-xl border-r border-green-500/20 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div 
            id="admin-dashboard-sidebar-navigation-menu"
            className="flex flex-col h-full"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-green-500/30 relative">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border border-green-400 rounded bg-green-400/10 flex items-center justify-center">
                  <span className="text-green-400 text-sm font-mono font-bold">⚡</span>
                </div>
                <div>
                  <h1 className="text-lg font-mono font-bold text-green-400 tracking-wider">
                    ADMIN_CORE
                  </h1>
                  <div className="text-xs text-green-600 font-mono opacity-60">
                    v2.1.0_SECURE
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    id={`admin-nav-${item.id}-link`}
                    onClick={() => navigateToSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-mono font-medium rounded-lg transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? 'bg-green-500/20 text-green-300 border border-green-500/40 shadow-lg shadow-green-500/20'
                        : 'text-green-600 hover:text-green-300 hover:bg-green-500/10 border border-transparent hover:border-green-500/20'
                    }`}
                  >
                    {/* Animated background for active state */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent animate-pulse"></div>
                    )}
                    
                    <div className="relative flex items-center w-full">
                      {Icon && <Icon className="w-5 h-5 mr-3" />}
                      <span className="tracking-wide">{item.label}</span>
                      
                      {/* Status indicator */}
                      <div className={`ml-auto w-2 h-2 rounded-full transition-colors ${
                        isActive ? 'bg-green-400 animate-pulse' : 'bg-green-800'
                      }`}></div>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-green-500/30 bg-black/40">
              <div 
                id="admin-user-profile-dropdown-menu"
                className="flex items-center mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center relative">
                  <span className="text-black text-sm font-mono font-bold">
                    {user?.name?.[0] || 'A'}
                  </span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-mono font-medium text-green-300">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-green-600 font-mono tracking-wide">
                    ROOT_ACCESS
                  </p>
                </div>
                <div className="text-xs text-green-500 font-mono">
                  ONLINE
                </div>
              </div>
              <button
                id="admin-logout-session-button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-mono font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-500/50 group"
              >
                <FiLogOut className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                <span className="tracking-wide">TERMINATE_SESSION</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Top Header */}
          <header 
            id="admin-dashboard-header-navigation-bar"
            className="bg-black/95 backdrop-blur-xl border-b border-green-500/30 shadow-lg shadow-green-500/10"
          >
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
                >
                  <FiMenu className="w-5 h-5" />
                </button>
                <div className="ml-4 lg:ml-0 flex items-center space-x-4">
                  <h1 className="text-xl sm:text-2xl font-mono font-bold text-green-400 capitalize tracking-wider">
                    {activeSection === 'dashboard' ? 'SYSTEM_OVERVIEW' : `${activeSection.toUpperCase()}_MODULE`}
                  </h1>
                  <div className="hidden sm:flex items-center space-x-2 text-green-600 font-mono text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>ACTIVE</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 sm:space-x-6">
                <div className="hidden md:flex items-center space-x-4 text-sm text-green-600 font-mono">
                  <div className="flex items-center space-x-2">
                    <FiClock className="w-4 h-4" />
                    <span className="hidden lg:inline">UPTIME: </span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-mono text-xs">SECURE</span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 relative">
            {activeSection === 'dashboard' && (
              <motion.div
                id="admin-dashboard-overview-main-container"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6 lg:space-y-8"
              >
                {/* Statistics Cards */}
                <motion.div 
                  id="admin-dashboard-statistics-cards-grid"
                  variants={fadeInUp}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6"
                >
                  {statsCards.map((card) => {
                    const Icon = card.icon;
                    const colorClasses = {
                      blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
                      green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
                      yellow: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
                      purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
                    };
                    
                    const iconColorClasses = {
                      blue: 'text-blue-400',
                      green: 'text-green-400',
                      yellow: 'text-yellow-400',
                      purple: 'text-purple-400'
                    };
                    
                    return (
                      <motion.div
                        key={card.id}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        id={`admin-stats-${card.id.replace('-', '-')}-card`}
                        className={`bg-gradient-to-br ${colorClasses[card.color]} backdrop-blur-xl rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 relative overflow-hidden group`}
                      >
                        {/* Animated border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        <div className="relative flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-green-600 font-mono text-xs uppercase tracking-wider mb-2">
                              {card.title}
                            </p>
                            <p className={`text-2xl sm:text-3xl font-mono font-bold ${iconColorClasses[card.color]} mb-1 truncate`}>
                              {card.value}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-mono ${
                                card.changeType === 'positive' ? 'text-green-400' : 
                                card.changeType === 'negative' ? 'text-red-400' : 'text-yellow-400'
                              }`}>
                                {card.change}
                              </span>
                              <span className="text-green-700 font-mono text-xs hidden sm:inline">
                                vs last period
                              </span>
                            </div>
                          </div>
                          <div className={`p-2 sm:p-3 rounded-lg bg-black/40 ${iconColorClasses[card.color]} flex-shrink-0 ml-2`}>
                            {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Recent Activity Section */}
                <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Recent Activity Feed */}
                  <div 
                    id="admin-stats-recent-activity-card"
                    className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-lg p-4 sm:p-6"
                  >
                    <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 border-b border-green-500/20">
                      <h3 className="text-base sm:text-lg font-mono font-bold text-green-400 tracking-wide">
                        ACTIVITY_LOG
                      </h3>
                      <div className="flex items-center space-x-2 text-green-600 font-mono text-xs">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                      {recentActivities.map((activity) => {
                        const Icon = activity.icon;
                        const typeColors = {
                          blog: 'text-blue-400 bg-blue-500/20',
                          comment: 'text-yellow-400 bg-yellow-500/20',
                          view: 'text-green-400 bg-green-500/20',
                          user: 'text-purple-400 bg-purple-500/20'
                        };
                        
                        return (
                          <div 
                            key={activity.id} 
                            className="flex items-start space-x-3 sm:space-x-4 p-3 rounded-lg bg-black/20 border border-green-500/10 hover:border-green-500/30 transition-all duration-300 group"
                          >
                            <div className={`p-2 rounded-lg ${typeColors[activity.type]} group-hover:scale-110 transition-transform flex-shrink-0`}>
                              {Icon && <Icon className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-mono text-green-300 font-medium">
                                {activity.action}
                              </p>
                              <p className="text-xs text-green-600 mt-1 truncate">
                                {activity.title}
                              </p>
                              <p className="text-xs text-green-700 font-mono mt-2 flex items-center">
                                <FiClock className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span>{activity.time}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-lg p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 border-b border-green-500/20">
                      <h3 className="text-base sm:text-lg font-mono font-bold text-green-400 tracking-wide">
                        QUICK_ACCESS
                      </h3>
                      <div className="text-green-600 font-mono text-xs">
                        [4] MODULES
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigateToSection('blog')}
                        className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-left text-sm font-mono font-medium text-green-300 hover:text-green-200 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-all duration-300 border border-green-500/20 hover:border-green-500/40 group"
                      >
                        <div className="flex items-center min-w-0">
                          <FiEdit3 className="w-4 h-4 sm:w-5 sm:h-5 mr-3 group-hover:animate-pulse flex-shrink-0" />
                          <span className="truncate">CREATE_POST</span>
                        </div>
                        <span className="text-green-600 text-xs ml-2">&gt;</span>
                      </button>
                      <button
                        onClick={() => navigateToSection('portfolio')}
                        className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-left text-sm font-mono font-medium text-green-300 hover:text-green-200 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-all duration-300 border border-green-500/20 hover:border-green-500/40 group"
                      >
                        <div className="flex items-center min-w-0">
                          <FiUser className="w-4 h-4 sm:w-5 sm:h-5 mr-3 group-hover:animate-pulse flex-shrink-0" />
                          <span className="truncate">UPDATE_PROFILE</span>
                        </div>
                        <span className="text-green-600 text-xs ml-2">&gt;</span>
                      </button>
                      <button
                        onClick={() => navigateToSection('comments')}
                        className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-left text-sm font-mono font-medium text-green-300 hover:text-green-200 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-all duration-300 border border-green-500/20 hover:border-green-500/40 group"
                      >
                        <div className="flex items-center min-w-0">
                          <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-3 group-hover:animate-pulse flex-shrink-0" />
                          <span className="truncate">MODERATE_FEED</span>
                        </div>
                        <span className="text-green-600 text-xs ml-2">&gt;</span>
                      </button>
                      <button
                        onClick={() => navigateToSection('analytics')}
                        className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-left text-sm font-mono font-medium text-green-300 hover:text-green-200 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-all duration-300 border border-green-500/20 hover:border-green-500/40 group"
                      >
                        <div className="flex items-center min-w-0">
                          <FiBarChart2 className="w-4 h-4 sm:w-5 sm:h-5 mr-3 group-hover:animate-pulse flex-shrink-0" />
                          <span className="truncate">VIEW_ANALYTICS</span>
                        </div>
                        <span className="text-green-600 text-xs ml-2">&gt;</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Other sections placeholder */}
            {activeSection !== 'dashboard' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-lg p-6 sm:p-8 text-center"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
                  <FiShield className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mb-4 sm:mb-0 sm:mr-4" />
                  <h2 className="text-xl sm:text-2xl font-mono font-bold text-green-400 capitalize tracking-wider">
                    {activeSection.toUpperCase()}_MODULE
                  </h2>
                </div>
                <p className="text-green-600 font-mono text-sm sm:text-base">
                  Module interface under development...
                </p>
                <div className="mt-6 flex items-center justify-center space-x-2 text-green-700 font-mono text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Status: PENDING_IMPLEMENTATION</span>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 65, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 65, 0.5);
        }
      `}</style>
    </>
  );
}

/**
 * Require authentication for this page
 */
AdminDashboardPage.requireAuth = true;
