/**
 * @fileoverview Server Entry Point
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

// Load environment variables
require('dotenv').config();

const createApp = require('./src/app');
const { connectToDatabase } = require('./src/config/database');

/**
 * Server Configuration
 * @constant {Object} SERVER_CONFIG
 */
const SERVER_CONFIG = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || 'localhost'
};

/**
 * Starts the server with error handling
 * @async
 * @function startServer
 * @returns {Promise<void>}
 */
const startServer = async () => {
    try {
        console.log('🚀 Starting Portfolio Server...');
        console.log(`📊 Environment: ${SERVER_CONFIG.NODE_ENV}`);
        
        // Connect to database (required for saving data)
        try {
            console.log('📊 Attempting to connect to MongoDB...');
            await connectToDatabase();
            console.log('✅ MongoDB connection successful!');
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            console.error('❌ Cannot start server without database connection');
            process.exit(1);
        }
        
        // Create Express app
        const app = createApp();
        
        // Start server
        const server = app.listen(SERVER_CONFIG.PORT, () => {
            console.log('✅ Server started successfully!');
            console.log(`🌐 Server running on: http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}`);
            console.log(`📡 API endpoints: http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}/api`);
            console.log(`❤️  Health check: http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}/health`);
            console.log('---------------------------------------------------');
        });

        // Graceful shutdown handling
        const gracefulShutdown = (signal) => {
            console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
            
            server.close(async (err) => {
                if (err) {
                    console.error('❌ Error during server shutdown:', err);
                    process.exit(1);
                }
                
                try {
                    // Close database connection
                    const { disconnectFromDatabase } = require('./src/config/database');
                    await disconnectFromDatabase();
                    
                    console.log('✅ Graceful shutdown completed');
                    process.exit(0);
                } catch (error) {
                    console.error('❌ Error during graceful shutdown:', error);
                    process.exit(1);
                }
            });
            
            // Force shutdown if graceful shutdown takes too long
            setTimeout(() => {
                console.error('⚠️ Forceful shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.error('💥 Uncaught Exception:', error);
            console.error('Stack:', error.stack);
            gracefulShutdown('uncaughtException');
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            console.error('💥 Unhandled Rejection at:', promise);
            console.error('Reason:', reason);
            gracefulShutdown('unhandledRejection');
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        console.error('Stack:', error.stack);
        
        // Exit with error code
        process.exit(1);
    }
};

// Start the server if this file is run directly
if (require.main === module) {
    startServer();
}

module.exports = { startServer, SERVER_CONFIG };