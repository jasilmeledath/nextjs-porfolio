import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SubscriptionService from '../services/subscription-service';

const SubscriptionForm = ({ showModal = false, onClose = null, position = 'inline' }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' | 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setMessage('Please enter a valid email address');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await SubscriptionService.subscribe(email.trim());
            
            setMessage('Thank you! Please check your email to confirm your subscription.');
            setMessageType('success');
            setEmail('');
            
            // Close modal after 3 seconds if it's a modal
            if (onClose && position === 'modal') {
                setTimeout(() => {
                    onClose();
                    setMessage('');
                    setMessageType('');
                }, 3000);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setMessage(error.message || 'Subscription failed. Please try again.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const formContent = (
        <div className={`${position === 'modal' ? 'p-6' : 'p-4'} ${position === 'inline' ? 'max-w-md mx-auto' : ''}`}>
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    🚀 Stay in the Loop!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get notified when I publish new articles and share insights from my developer journey.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 placeholder-gray-500 dark:placeholder-gray-400"
                        disabled={isLoading}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                             text-white font-medium py-2 px-4 rounded-lg transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Subscribing...
                        </div>
                    ) : (
                        'Subscribe to Newsletter'
                    )}
                </button>
            </form>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mt-3 p-3 rounded-lg text-sm ${
                            messageType === 'success'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                        }`}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                No spam, unsubscribe at any time.
            </p>
        </div>
    );

    // Modal wrapper
    if (position === 'modal') {
        return (
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                                             transition-colors duration-200 text-xl font-bold"
                                >
                                    ×
                                </button>
                            )}
                            {formContent}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Inline form
    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            {formContent}
        </div>
    );
};

export default SubscriptionForm;
