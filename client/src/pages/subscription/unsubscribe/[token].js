/**
 * @fileoverview Unsubscribe Page
 * @author jasilmeledath@gmail.com
 * @created 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiArrowLeft, FiMail, FiHeart } from 'react-icons/fi';
import { useTheme } from '../../../context/ThemeContext';
import SubscriptionService from '../../../services/subscription-service';

export default function Unsubscribe() {
    const router = useRouter();
    const { token } = router.query;
    const { isDark } = useTheme();
    
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) return;

        const handleUnsubscribe = async () => {
            try {
                const response = await SubscriptionService.unsubscribe(token);
                setStatus('success');
                setMessage(response.message || 'You have been successfully unsubscribed.');
                
                // Remove subscription status from localStorage
                localStorage.removeItem('userSubscribed');
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Failed to unsubscribe. The link may be expired or invalid.');
            }
        };

        handleUnsubscribe();
    }, [token]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };

    return (
        <>
            <Head>
                <title>Unsubscribe - Jasil Meledath</title>
                <meta name="description" content="Unsubscribe from newsletter" />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center px-4`}>
                <div className="max-w-md w-full">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
                                   rounded-xl shadow-lg border p-8 text-center`}
                    >
                        {status === 'loading' && (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                                />
                                <h1 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Processing Unsubscribe...
                                </h1>
                                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Please wait while we process your request.
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <motion.div
                                    variants={scaleIn}
                                    className="w-16 h-16 mx-auto mb-4 text-orange-500"
                                >
                                    <FiCheckCircle className="w-full h-full" />
                                </motion.div>
                                <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Successfully Unsubscribed
                                </h1>
                                <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {message}
                                </p>
                                <p className={`mb-6 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                    You'll no longer receive newsletter emails from us. We're sorry to see you go! 
                                    You can always subscribe again if you change your mind.
                                </p>
                                <div className="space-y-3">
                                    <Link
                                        href="/blog"
                                        className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                                                 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                                    >
                                        Continue Reading Blog
                                    </Link>
                                    <Link
                                        href="/"
                                        className={`block w-full ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}
                                                 font-medium py-3 px-6 rounded-lg transition-all duration-200`}
                                    >
                                        Back to Home
                                    </Link>
                                </div>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <motion.div
                                    variants={scaleIn}
                                    className="w-16 h-16 mx-auto mb-4 text-red-500"
                                >
                                    <FiXCircle className="w-full h-full" />
                                </motion.div>
                                <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Unsubscribe Failed
                                </h1>
                                <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {message}
                                </p>
                                <div className="space-y-3">
                                    <Link
                                        href="/blog"
                                        className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                                                 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                                    >
                                        Visit Blog
                                    </Link>
                                    <Link
                                        href="/"
                                        className={`block w-full ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}
                                                 font-medium py-3 px-6 rounded-lg transition-all duration-200`}
                                    >
                                        Back to Home
                                    </Link>
                                </div>
                            </>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} flex items-center justify-center gap-1`}>
                                <FiMail className="w-3 h-3" />
                                Questions? Contact jasilmeledath@gmail.com
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mt-6"
                    >
                        <Link
                            href="/blog"
                            className={`inline-flex items-center gap-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} 
                                       font-medium transition-colors duration-200`}
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </Link>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
