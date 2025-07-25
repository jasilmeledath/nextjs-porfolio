/**
 * @fileoverview MongoDB Connection Test Utility
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Test MongoDB connection
 * @async
 * @function testConnection
 * @returns {Promise<boolean>} Connection success status
 */
const testConnection = async () => {
    try {
        console.log('🧪 Testing MongoDB connection...');
        
        const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-dev';
        console.log(`📡 Connecting to: ${connectionString}`);
        
        // Simple connection configuration for testing
        const testConfig = {
            maxPoolSize: 1,
            serverSelectionTimeoutMS: 3000,
            socketTimeoutMS: 3000
        };
        
        await mongoose.connect(connectionString, testConfig);
        
        console.log('✅ MongoDB connection successful!');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
        
        // Close the test connection
        await mongoose.disconnect();
        console.log('🔌 Test connection closed');
        
        return true;
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Tips to fix this issue:');
            console.log('   1. Make sure MongoDB is installed and running');
            console.log('   2. Start MongoDB with: brew services start mongodb/brew/mongodb-community');
            console.log('   3. Or install MongoDB: brew install mongodb/brew/mongodb-community');
            console.log('   4. Check if MongoDB is running: brew services list | grep mongodb');
        }
        
        return false;
    }
};

// Run test if called directly
if (require.main === module) {
    testConnection().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { testConnection };
