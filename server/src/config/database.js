/**
 * @fileoverview Database Configuration and Connection Management
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const { DatabaseError } = require('../errors/custom-errors');

/**
 * Database Configuration Options
 * @constant {Object} DB_CONFIG
 */
const DB_CONFIG = {
    // Performance options
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    
    // Retry options
    retryWrites: true,
    retryReads: true,
    
    // Heartbeat options
    heartbeatFrequencyMS: 10000, // Send a heartbeat every 10 seconds
    
    // Auto index management (disable in production for better performance)
    autoIndex: process.env.NODE_ENV !== 'production'
};

/**
 * Database connection instance
 * @type {mongoose.Connection}
 */
let dbConnection = null;

/**
 * Connects to MongoDB database
 * @async
 * @function connectToDatabase
 * @param {string} connectionString - MongoDB connection string
 * @returns {Promise<mongoose.Connection>} Database connection instance
 * @throws {DatabaseError} When connection fails
 */
const connectToDatabase = async (connectionString = process.env.MONGODB_URI) => {
    try {
        // Use default connection string if not provided
        if (!connectionString) {
            console.log('⚠️ No MongoDB connection string provided, using default: mongodb://localhost:27017/portfolio-dev');
            connectionString = 'mongodb://localhost:27017/portfolio-dev';
        }

        // If already connected, return existing connection
        if (dbConnection && mongoose.connection.readyState === 1) {
            console.log('📊 Using existing database connection');
            return dbConnection;
        }

        // Connect to MongoDB with detailed logging
        console.log(`📊 Connecting to MongoDB at: ${connectionString.split('@').pop()}`);
        console.log('📊 Connection options:', JSON.stringify(DB_CONFIG, null, 2));
        
        await mongoose.connect(connectionString, DB_CONFIG);
        
        dbConnection = mongoose.connection;
        
        console.log(`📊 Connected to MongoDB database: ${dbConnection.name}`);
        console.log(`📊 MongoDB version: ${await mongoose.connection.db.admin().serverInfo().then(info => info.version)}`);
        console.log('📊 Available collections:');
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.forEach(collection => console.log(`   - ${collection.name}`));
        
        // Connection event listeners
        dbConnection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
            console.log(`📊 Database: ${dbConnection.name}`);
            console.log(`🌐 Host: ${dbConnection.host}:${dbConnection.port}`);
        });

        dbConnection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
            throw new DatabaseError(
                `Database connection error: ${error.message}`,
                'CONNECTION_ERROR',
                'DB_001'
            );
        });

        dbConnection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

        dbConnection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

        // Graceful shutdown handling
        process.on('SIGINT', async () => {
            try {
                await disconnectFromDatabase();
                process.exit(0);
            } catch (error) {
                console.error('Error during graceful shutdown:', error);
                process.exit(1);
            }
        });

        return dbConnection;

    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        
        if (error instanceof DatabaseError) {
            throw error;
        }
        
        throw new DatabaseError(
            `Failed to connect to database: ${error.message}`,
            'CONNECTION_FAILED',
            'DB_001'
        );
    }
};

/**
 * Disconnects from MongoDB database
 * @async
 * @function disconnectFromDatabase
 * @returns {Promise<void>}
 * @throws {DatabaseError} When disconnection fails
 */
const disconnectFromDatabase = async () => {
    try {
        if (dbConnection && mongoose.connection.readyState !== 0) {
            console.log('📊 Closing database connection...');
            await mongoose.connection.close();
            dbConnection = null;
            console.log('✅ Database connection closed successfully');
        }
    } catch (error) {
        console.error('❌ Error closing database connection:', error);
        throw new DatabaseError(
            `Failed to close database connection: ${error.message}`,
            'DISCONNECTION_FAILED',
            'DB_002'
        );
    }
};

/**
 * Gets current database connection status
 * @function getConnectionStatus
 * @returns {Object} Connection status information
 */
const getConnectionStatus = () => {
    const readyState = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    return {
        status: states[readyState] || 'unknown',
        readyState,
        host: mongoose.connection.host || null,
        port: mongoose.connection.port || null,
        name: mongoose.connection.name || null
    };
};

/**
 * Checks if database is connected
 * @function isDatabaseConnected
 * @returns {boolean} True if connected, false otherwise
 */
const isDatabaseConnected = () => {
    return mongoose.connection.readyState === 1;
};

/**
 * Creates database indexes for optimization
 * @async
 * @function createDatabaseIndexes
 * @returns {Promise<void>}
 */
const createDatabaseIndexes = async () => {
    try {
        if (!isDatabaseConnected()) {
            throw new DatabaseError(
                'Database must be connected to create indexes',
                'INDEX_CREATION',
                'DB_003'
            );
        }

        console.log('📊 Creating database indexes...');
        
        // Note: Specific indexes will be created in individual model files
        // This function can be used for any global indexes if needed
        
        console.log('✅ Database indexes created successfully');
        
    } catch (error) {
        console.error('❌ Error creating database indexes:', error);
        throw new DatabaseError(
            `Failed to create database indexes: ${error.message}`,
            'INDEX_CREATION_FAILED',
            'DB_003'
        );
    }
};

module.exports = {
    connectToDatabase,
    disconnectFromDatabase,
    getConnectionStatus,
    isDatabaseConnected,
    createDatabaseIndexes,
    DB_CONFIG
};