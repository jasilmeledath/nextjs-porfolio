/**
 * @fileoverview Subscription Routes - API endpoints for newsletter subscription
 * @author jasilmeledath@gmail.com
 * @created 2025-08-03
 * @version 1.0.0
 */

const express = require('express');
const SubscriptionController = require('../controllers/subscription-controller');
const { authenticate, authorize } = require('../middleware/auth-middleware');

const router = express.Router();

/**
 * Public routes (no authentication required)
 */

// Subscribe to newsletter
router.post('/subscribe', SubscriptionController.subscribe);

// Confirm subscription
router.get('/confirm/:token', SubscriptionController.confirmSubscription);

// Unsubscribe from newsletter
router.post('/unsubscribe/:token', SubscriptionController.unsubscribe);

// Update subscriber preferences (with token)
router.put('/preferences/:token', SubscriptionController.updatePreferences);

/**
 * Admin routes (authentication + authorization required)
 */

// Get all subscribers
router.get('/', 
  authenticate, 
  authorize(['analytics:view']), 
  SubscriptionController.getSubscribers
);

// Get subscription statistics
router.get('/stats', 
  authenticate, 
  authorize(['analytics:view']), 
  SubscriptionController.getSubscriptionStats
);

// Send newsletter to subscribers
router.post('/send-newsletter', 
  authenticate, 
  authorize(['blog:write']), 
  SubscriptionController.sendNewsletter
);

module.exports = router;
