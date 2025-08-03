/**
 * @fileoverview Express Application Configuration
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Import constants and utilities
const { HTTP_STATUS } = require('./constants/http-status');
const { API_RESPONSE_STATUS, API_MESSAGES } = require('./constants/api-response');

// Import middleware
const errorHandler = require('./middleware/error-handler');
const notFoundHandler = require('./middleware/not-found-handler');

// Import routes
const authRoutes = require('./routes/auth-routes');
const blogRoutes = require('./routes/blog-routes');
const commentsRoutes = require('./routes/comments-routes');
const portfolioRoutes = require('./routes/portfolio-routes');
const portfolioManagementRoutes = require('./routes/portfolio-management-routes');
const subscriptionRoutes = require('./routes/subscription-routes');
// const adminRoutes = require('./routes/admin-routes');

/**
 * Creates and configures Express application
 * @function createApp
 * @returns {express.Application} Configured Express app
 */
const createApp = () => {
    const app = express();

    // Trust proxy for accurate client IP addresses
    app.set('trust proxy', 1);

    // Security Middleware
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https:"],
                scriptSrc: ["'self'"],
                connectSrc: ["'self'"],
                frameSrc: ["'self'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        crossOriginEmbedderPolicy: false
    }));

    // CORS Configuration
    const corsOptions = {
        origin: function (origin, callback) {
            // In development mode, allow any origin for mobile testing
            if (process.env.NODE_ENV === 'development') {
                return callback(null, true);
            }

            const allowedOrigins = [
                'http://localhost:3000', // Next.js development
                'http://localhost:3001', // Alternative development port
                'https://yourportfolio.vercel.app', // Production domain
                process.env.FRONTEND_URL
            ].filter(Boolean);

            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);
            
            // Allow local network IPs (for mobile phone access)
            if (origin) {
                const localNetworkPatterns = [
                    /^http:\/\/localhost:\d+$/,
                    /^http:\/\/127\.0\.0\.1:\d+$/,
                    /^http:\/\/192\.168\.\d+\.\d+:\d+$/,  // Most common local network
                    /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,   // Another common local network
                    /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:\d+$/, // Docker/container range
                    /^https:\/\/.*\.vercel\.app$/,        // Vercel deployments
                    /^https:\/\/.*\.netlify\.app$/,       // Netlify deployments
                    /^https:\/\/.*\.herokuapp\.com$/,     // Heroku deployments
                    /^https:\/\/.*\.trycloudflare\.com$/, // Cloudflare tunnels
                    /^https:\/\/.*\.ngrok\.io$/,          // Ngrok tunnels
                    /^https:\/\/.*\.loca\.lt$/            // Localtunnel
                ];

                const isLocalNetwork = localNetworkPatterns.some(pattern => pattern.test(origin));
                if (isLocalNetwork) {
                    return callback(null, true);
                }
            }
            
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log(`CORS: Blocked origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
    };
    app.use(cors(corsOptions));

    // Rate Limiting
    const limiter = rateLimit({
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
        message: {
            status: API_RESPONSE_STATUS.ERROR,
            message: API_MESSAGES.RATE_LIMIT_EXCEEDED,
            error: {
                code: 'RL_001',
                details: 'Too many requests from this IP, please try again later.'
            }
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        // Skip rate limiting for localhost/development
        skip: (req) => {
            return process.env.NODE_ENV === 'development' || 
                   req.ip === '127.0.0.1' || 
                   req.ip === '::1' || 
                   req.ip === '::ffff:127.0.0.1';
        }
    });
    app.use('/api/', limiter);

    // Body parsing middleware
    app.use(express.json({ 
        limit: '10mb',
        verify: (req, res, buf) => {
            req.rawBody = buf;
        }
    }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression middleware
    app.use(compression());

    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());

    // HTTP request logger
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined'));
    }

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(HTTP_STATUS.SUCCESS).json({
            status: API_RESPONSE_STATUS.SUCCESS,
            message: 'Server is running',
            data: {
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
                version: process.env.npm_package_version || '1.0.0'
            }
        });
    });

    // API Routes
    app.use('/api/v1', (req, res, next) => {
        // API version middleware
        res.set('API-Version', 'v1');
        next();
    });

    // Mount routes
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/blogs', blogRoutes);
    app.use('/api/v1/comments', commentsRoutes);
    app.use('/api/v1/portfolio', portfolioRoutes);
    app.use('/api/v1/portfolio-management', portfolioManagementRoutes);
    app.use('/api/v1/subscriptions', subscriptionRoutes);
    // app.use('/api/v1/admin', adminRoutes);

    // Static file serving for uploads with CORS headers
    app.use('/uploads', (req, res, next) => {
        // Add CORS headers for static files
        const origin = req.headers.origin;
        
        // In development mode, allow any origin for mobile testing
        if (process.env.NODE_ENV === 'development') {
            res.setHeader('Access-Control-Allow-Origin', origin || '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            next();
            return;
        }

        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001', 
            'https://yourportfolio.vercel.app',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        // Check for local network patterns (same as main CORS config)
        let isAllowed = false;
        if (!origin || allowedOrigins.includes(origin)) {
            isAllowed = true;
        } else if (origin) {
            const localNetworkPatterns = [
                /^http:\/\/localhost:\d+$/,
                /^http:\/\/127\.0\.0\.1:\d+$/,
                /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
                /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
                /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:\d+$/,
                /^https:\/\/.*\.vercel\.app$/,
                /^https:\/\/.*\.netlify\.app$/,
                /^https:\/\/.*\.herokuapp\.com$/,
                /^https:\/\/.*\.trycloudflare\.com$/,
                /^https:\/\/.*\.ngrok\.io$/,
                /^https:\/\/.*\.loca\.lt$/
            ];
            isAllowed = localNetworkPatterns.some(pattern => pattern.test(origin));
        }
        
        // More permissive CORS for image requests
        if (isAllowed) {
            res.setHeader('Access-Control-Allow-Origin', origin || '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        }
        
        // Set cache headers for images
        if (req.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        }
        
        next();
    }, express.static('uploads', {
        maxAge: '1d',
        etag: true,
        setHeaders: (res, path, stat) => {
            // Additional headers for images
            if (path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            }
        }
    }));

    // Static file serving for public assets
    app.use('/public', express.static('public', {
        maxAge: '7d',
        etag: true
    }));

    // Catch-all route for API documentation or frontend serving
    app.get('/api', (req, res) => {
        res.status(HTTP_STATUS.SUCCESS).json({
            status: API_RESPONSE_STATUS.SUCCESS,
            message: 'Portfolio API v1.0.0',
            data: {
                version: '1.0.0',
                endpoints: {
                    auth: '/api/v1/auth',
                    portfolio: '/api/v1/portfolio',
                    blog: '/api/v1/blogs',
                    comments: '/api/v1/comments',
                    admin: '/api/v1/admin'
                },
                documentation: '/api/docs',
                health: '/health'
            }
        });
    });

    // 404 handler for undefined routes
    app.use(notFoundHandler);

    // Global error handling middleware (must be last)
    app.use(errorHandler);

    return app;
};

module.exports = createApp;