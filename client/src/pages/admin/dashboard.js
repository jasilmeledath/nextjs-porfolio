/**
 * @fileoverview Admin Dashboard Main Page
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
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
  FiBarChart3, 
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiEye,
  FiEdit3,
  FiUsers,
  FiTrendingUp,
  FiClock,
  FiActivity
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

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect in progress)
  if (!isAuthenticated) {
    return null;
  }

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'portfolio', label: 'Portfolio', icon: FiUser },
    { id: 'blog', label: 'Blog Posts', icon: FiFileText },
    { id: 'comments', label: 'Comments', icon: FiMessageSquare },
    { id: 'media', label: 'Media Library', icon: FiImage },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart3 },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  // Stats cards data
  const statsCards = [
    {
      id: 'total-views',
      title: 'Total Page Views',
      value: dashboardStats.totalViews.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: FiEye,
      color: 'blue'
    },
    {
      id: 'blog-posts',
      title: 'Blog Posts',
      value: dashboardStats.blogPosts,
      change: '+3',
      changeType: 'positive',
      icon: FiFileText,
      color: 'green'
    },
    {
      id: 'pending-comments',
      title: 'Pending Comments',
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
      action: 'New blog post published',
      title: 'Getting Started with Next.js',
      time: '2 hours ago',
      icon: FiEdit3
    },
    {
      id: 2,
      type: 'comment',
      action: 'New comment received',
      title: 'On: React Best Practices',
      time: '4 hours ago',
      icon: FiMessageSquare
    },
    {
      id: 3,
      type: 'view',
      action: 'Page view milestone reached',
      title: '10,000 views on portfolio',
      time: '1 day ago',
      icon: FiTrendingUp
    },
    {
      id: 4,
      type: 'user',
      action: 'Profile updated',
      title: 'Personal information modified',
      time: '2 days ago',
      icon: FiUser
    }
  ];

  return (
    <>
      <Head>
        <title>Dashboard - Admin Panel</title>
        <meta name="description" content="Admin dashboard for portfolio management" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div 
        id="admin-main-dashboard-layout-container"
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
      >
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
          </div>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div 
            id="admin-dashboard-sidebar-navigation-menu"
            className="flex flex-col h-full"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    id={`admin-nav-${item.id}-${item.id === 'dashboard' ? 'overview-' : item.id === 'portfolio' ? 'management-' : item.id === 'blog' ? 'content-management-' : item.id === 'comments' ? 'moderation-' : item.id === 'media' ? 'library-management-' : item.id === 'analytics' ? 'dashboard-' : 'system-settings-'}link`}
                    onClick={() => navigateToSection(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div 
                id="admin-user-profile-dropdown-menu"
                className="flex items-center mb-3"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.[0] || 'A'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrator
                  </p>
                </div>
              </div>
              <button
                id="admin-logout-session-button"
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              >
                <FiLogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Top Header */}
          <header 
            id="admin-dashboard-header-navigation-bar"
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiMenu className="w-5 h-5" />
                </button>
                <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-gray-900 dark:text-white capitalize">
                  {activeSection}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {activeSection === 'dashboard' && (
              <motion.div
                id="admin-dashboard-overview-main-container"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Statistics Cards */}
                <motion.div 
                  id="admin-dashboard-statistics-cards-grid"
                  variants={fadeInUp}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {statsCards.map((card) => {
                    const Icon = card.icon;
                    const colorClasses = {
                      blue: 'bg-blue-500',
                      green: 'bg-green-500',
                      yellow: 'bg-yellow-500',
                      purple: 'bg-purple-500'
                    };
                    
                    return (
                      <div
                        key={card.id}
                        id={`admin-stats-${card.id.replace('-', '-')}-card`}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <div className="flex items-center">
                          <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {card.title}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {card.value}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className={`text-sm ${
                            card.changeType === 'positive' 
                              ? 'text-green-600 dark:text-green-400' 
                              : card.changeType === 'negative' 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {card.change} from last month
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity Feed */}
                  <div 
                    id="admin-stats-recent-activity-card"
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Recent Activity
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {recentActivities.map((activity) => {
                          const Icon = activity.icon;
                          return (
                            <div key={activity.id} className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {activity.action}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  <FiClock className="w-3 h-3 inline mr-1" />
                                  {activity.time}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Quick Actions
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        <button
                          onClick={() => navigateToSection('blog')}
                          className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                          <FiEdit3 className="w-5 h-5 mr-3 text-blue-500" />
                          Create New Blog Post
                        </button>
                        <button
                          onClick={() => navigateToSection('portfolio')}
                          className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                          <FiUser className="w-5 h-5 mr-3 text-green-500" />
                          Update Portfolio
                        </button>
                        <button
                          onClick={() => navigateToSection('comments')}
                          className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                          <FiMessageSquare className="w-5 h-5 mr-3 text-yellow-500" />
                          Moderate Comments
                        </button>
                        <button
                          onClick={() => navigateToSection('analytics')}
                          className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                          <FiBarChart3 className="w-5 h-5 mr-3 text-purple-500" />
                          View Analytics
                        </button>
                      </div>
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
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
                  {activeSection} Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeSection} management interface will be implemented here.
                </p>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

/**
 * Require authentication for this page
 */
AdminDashboardPage.requireAuth = true;
