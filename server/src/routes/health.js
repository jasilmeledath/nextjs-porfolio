/**
 * @fileoverview Health Check Routes
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @version 1.0.0
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**
 * Health check endpoint
 * @route GET /api/v1/health
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Basic system health
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'unknown'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    };

    // If database is not connected, return 503
    if (dbStatus !== 'connected') {
      return res.status(503).json({
        ...health,
        status: 'error',
        message: 'Database connection failed'
      });
    }

    res.status(200).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Readiness check endpoint
 * @route GET /api/v1/health/ready
 * @access Public
 */
router.get('/ready', async (req, res) => {
  try {
    // More comprehensive readiness check
    const checks = {
      database: mongoose.connection.readyState === 1,
      memory: process.memoryUsage().heapUsed < (512 * 1024 * 1024), // Less than 512MB
      uptime: process.uptime() > 10 // At least 10 seconds uptime
    };

    const allChecksPass = Object.values(checks).every(check => check === true);

    if (allChecksPass) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        checks
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Readiness check failed'
    });
  }
});

module.exports = router;