/**
 * @fileoverview Subscription Service - Frontend API calls
 * @author jasilmeledath@gmail.com
 * @created 2025-01-27
 * @version 1.0.0
 */

import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class SubscriptionService {
    /**
     * Subscribe to newsletter
     * @param {string} email - User email
     * @returns {Promise<Object>} API response
     */
    static async subscribe(email) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Subscription failed');
            }

            return data;
        } catch (error) {
            console.error('Subscription service error:', error);
            throw error;
        }
    }

    /**
     * Confirm subscription
     * @param {string} token - Confirmation token
     * @returns {Promise<Object>} API response
     */
    static async confirmSubscription(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/confirm/${token}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Confirmation failed');
            }

            return data;
        } catch (error) {
            console.error('Confirmation service error:', error);
            throw error;
        }
    }

    /**
     * Unsubscribe from newsletter
     * @param {string} token - Unsubscribe token
     * @returns {Promise<Object>} API response
     */
    static async unsubscribe(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/unsubscribe/${token}`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unsubscribe failed');
            }

            return data;
        } catch (error) {
            console.error('Unsubscribe service error:', error);
            throw error;
        }
    }

    /**
     * Get subscription analytics (Admin only)
     * @returns {Promise<Object>} Analytics data
     */
    static async getAnalytics() {
        try {
            const token = Cookies.get('auth-token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/admin/analytics`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch analytics');
            }

            return data;
        } catch (error) {
            console.error('Analytics service error:', error);
            throw error;
        }
    }

    /**
     * Get all subscribers (Admin only)
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Subscribers data
     */
    static async getSubscribers(options = {}) {
        try {
            const token = Cookies.get('auth-token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const queryParams = new URLSearchParams();
            
            if (options.page) queryParams.append('page', options.page);
            if (options.limit) queryParams.append('limit', options.limit);
            if (options.status) queryParams.append('status', options.status);
            if (options.search) queryParams.append('search', options.search);

            const url = `${API_BASE_URL}/api/v1/subscriptions/admin/subscribers${queryParams.toString() ? `?${queryParams}` : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch subscribers');
            }

            return data;
        } catch (error) {
            console.error('Get subscribers service error:', error);
            throw error;
        }
    }

    /**
     * Send newsletter to all subscribers (Admin only)
     * @param {Object} newsletterData - Newsletter content
     * @returns {Promise<Object>} API response
     */
    static async sendNewsletter(newsletterData) {
        try {
            const token = Cookies.get('auth-token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/admin/send-newsletter`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newsletterData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send newsletter');
            }

            return data;
        } catch (error) {
            console.error('Send newsletter service error:', error);
            throw error;
        }
    }

    /**
     * Delete subscriber (Admin only)
     * @param {string} subscriberId - Subscriber ID
     * @returns {Promise<Object>} API response
     */
    static async deleteSubscriber(subscriberId) {
        try {
            const token = Cookies.get('auth-token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/admin/subscribers/${subscriberId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete subscriber');
            }

            return data;
        } catch (error) {
            console.error('Delete subscriber service error:', error);
            throw error;
        }
    }
}

export default SubscriptionService;
