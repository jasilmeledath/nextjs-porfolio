/**
 * @fileoverview Admin Subscription Management Page
 * @author jasilmeledath@gmail.com
 * @created 2025-01-27
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUsers, 
    FiMail, 
    FiSearch, 
    FiFilter, 
    FiDownload, 
    FiTrash2,
    FiSend,
    FiEye,
    FiCalendar,
    FiTrendingUp,
    FiCheckCircle,
    FiXCircle,
    FiClock
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import AdminProtectedRoute from '../../components/admin/AdminProtectedRoute';
import SubscriptionService from '../../services/subscription-service';

const SubscriptionManagement = () => {
    const { isDark } = useTheme();
    const [subscribers, setSubscribers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedSubscribers, setSelectedSubscribers] = useState([]);
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [newsletterData, setNewsletterData] = useState({
        subject: '',
        content: '',
        preheader: ''
    });
    const [sendingNewsletter, setSendingNewsletter] = useState(false);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    useEffect(() => {
        loadData();
    }, [currentPage, filterStatus, searchTerm]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [subscribersRes, analyticsRes] = await Promise.all([
                SubscriptionService.getSubscribers({
                    page: currentPage,
                    limit: 10,
                    status: filterStatus === 'all' ? undefined : filterStatus,
                    search: searchTerm || undefined
                }),
                SubscriptionService.getAnalytics()
            ]);

            setSubscribers(subscribersRes.data.subscribers);
            setTotalPages(subscribersRes.data.totalPages);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error('Failed to load subscription data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubscriber = async (subscriberId) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;

        try {
            await SubscriptionService.deleteSubscriber(subscriberId);
            loadData();
        } catch (error) {
            console.error('Failed to delete subscriber:', error);
            alert('Failed to delete subscriber');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedSubscribers.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscribers?`)) return;

        try {
            await Promise.all(
                selectedSubscribers.map(id => SubscriptionService.deleteSubscriber(id))
            );
            setSelectedSubscribers([]);
            loadData();
        } catch (error) {
            console.error('Failed to delete subscribers:', error);
            alert('Failed to delete some subscribers');
        }
    };

    const handleSendNewsletter = async () => {
        if (!newsletterData.subject || !newsletterData.content) {
            alert('Please fill in subject and content');
            return;
        }

        try {
            setSendingNewsletter(true);
            await SubscriptionService.sendNewsletter(newsletterData);
            setShowNewsletterModal(false);
            setNewsletterData({ subject: '', content: '', preheader: '' });
            alert('Newsletter sent successfully!');
        } catch (error) {
            console.error('Failed to send newsletter:', error);
            alert('Failed to send newsletter');
        } finally {
            setSendingNewsletter(false);
        }
    };

    const toggleSubscriberSelection = (subscriberId) => {
        setSelectedSubscribers(prev => 
            prev.includes(subscriberId) 
                ? prev.filter(id => id !== subscriberId)
                : [...prev, subscriberId]
        );
    };

    const toggleSelectAll = () => {
        setSelectedSubscribers(prev => 
            prev.length === subscribers.length 
                ? [] 
                : subscribers.map(sub => sub._id)
        );
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return <FiCheckCircle className="w-4 h-4 text-green-500" />;
            case 'pending':
                return <FiClock className="w-4 h-4 text-yellow-500" />;
            case 'unsubscribed':
                return <FiXCircle className="w-4 h-4 text-red-500" />;
            default:
                return <FiClock className="w-4 h-4 text-gray-500" />;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading && !analytics) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className="text-center">
                    <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${
                        isDark ? 'border-blue-400' : 'border-blue-600'
                    }`} style={{
                        animationDuration: '1s',
                        animationTimingFunction: 'linear'
                    }}></div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <AdminProtectedRoute>
            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="mb-8"
                    >
                        <motion.h1 
                            variants={fadeInUp}
                            className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}
                        >
                            Newsletter Subscriptions
                        </motion.h1>
                        <motion.p 
                            variants={fadeInUp}
                            className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                            Manage your newsletter subscribers and send campaigns
                        </motion.p>
                    </motion.div>

                    {/* Analytics Cards */}
                    {analytics && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                        >
                            <motion.div variants={fadeInUp} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Subscribers</p>
                                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {analytics.totalSubscribers}
                                        </p>
                                    </div>
                                    <FiUsers className="w-8 h-8 text-blue-500" />
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Subscribers</p>
                                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {analytics.activeSubscribers}
                                        </p>
                                    </div>
                                    <FiCheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>This Month</p>
                                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {analytics.monthlyGrowth}
                                        </p>
                                    </div>
                                    <FiTrendingUp className="w-8 h-8 text-purple-500" />
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Unsubscribe Rate</p>
                                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {analytics.unsubscribeRate}%
                                        </p>
                                    </div>
                                    <FiXCircle className="w-8 h-8 text-red-500" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'} mb-6`}
                    >
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search subscribers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={`pl-10 pr-4 py-2 border rounded-lg ${
                                            isDark 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    />
                                </div>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className={`px-4 py-2 border rounded-lg ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                            : 'bg-white border-gray-300 text-gray-900'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="unsubscribed">Unsubscribed</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowNewsletterModal(true)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                >
                                    <FiSend className="w-4 h-4" />
                                    Send Newsletter
                                </button>

                                {selectedSubscribers.length > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                        Delete ({selectedSubscribers.length})
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Subscribers Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                                                onChange={toggleSelectAll}
                                                className="rounded"
                                            />
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Subscriber
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Status
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Subscribed
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {subscribers.map((subscriber) => (
                                        <tr key={subscriber._id} className={`hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-200`}>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubscribers.includes(subscriber._id)}
                                                    onChange={() => toggleSubscriberSelection(subscriber._id)}
                                                    className="rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {subscriber.firstName || 'Anonymous'}
                                                    </div>
                                                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {subscriber.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(subscriber.status)}
                                                    <span className={`text-sm font-medium capitalize ${
                                                        subscriber.status === 'active' ? 'text-green-600' :
                                                        subscriber.status === 'pending' ? 'text-yellow-600' :
                                                        'text-red-600'
                                                    }`}>
                                                        {subscriber.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {formatDate(subscriber.createdAt)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleDeleteSubscriber(subscriber._id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className={`px-6 py-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === 1 
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === totalPages 
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Newsletter Modal */}
                <AnimatePresence>
                    {showNewsletterModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowNewsletterModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                                        Send Newsletter
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                value={newsletterData.subject}
                                                onChange={(e) => setNewsletterData({...newsletterData, subject: e.target.value})}
                                                className={`w-full px-3 py-2 border rounded-lg ${
                                                    isDark 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="Enter newsletter subject..."
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                                Preheader (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={newsletterData.preheader}
                                                onChange={(e) => setNewsletterData({...newsletterData, preheader: e.target.value})}
                                                className={`w-full px-3 py-2 border rounded-lg ${
                                                    isDark 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="Brief preview text..."
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                                Content
                                            </label>
                                            <textarea
                                                value={newsletterData.content}
                                                onChange={(e) => setNewsletterData({...newsletterData, content: e.target.value})}
                                                rows={8}
                                                className={`w-full px-3 py-2 border rounded-lg ${
                                                    isDark 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="Write your newsletter content here..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            onClick={() => setShowNewsletterModal(false)}
                                            className={`px-4 py-2 rounded-lg ${
                                                isDark 
                                                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                            } transition-colors duration-200`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSendNewsletter}
                                            disabled={sendingNewsletter || !newsletterData.subject || !newsletterData.content}
                                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {sendingNewsletter ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <FiSend className="w-4 h-4" />
                                                    Send Newsletter
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AdminProtectedRoute>
    );
};

export default SubscriptionManagement;
