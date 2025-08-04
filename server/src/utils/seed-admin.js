/**
 * @fileoverview Admin User Seeder
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

/**
 * Connect to MongoDB
 * @async
 * @function connectDB
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Create admin user
 * @async
 * @function createAdminUser
 */
const createAdminUser = async () => {
  try {
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
        email: existingAdmin.email,
        firstName: existingAdmin.firstName,
        lastName: existingAdmin.lastName,
        createdAt: existingAdmin.createdAt
      });
      return;
    }
    
    // Create admin user with environment variables or defaults
    const adminData = {
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123!@#',
      firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
      lastName: process.env.ADMIN_LAST_NAME || 'User',
      role: 'admin',
      isActive: true,
      permissions: [
        'portfolio:read',
        'portfolio:write',
        'blog:read',
        'blog:write',
        'blog:delete',
        'comments:moderate',
        'media:upload',
        'media:delete',
        'analytics:view',
        'settings:manage',
        'users:manage'
      ]
    };
    
    
    const adminUser = new User(adminData);
    await adminUser.save();
    
      email: adminUser.email,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      role: adminUser.role,
      permissions: adminUser.permissions
    });
    
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    if (error.code === 11000) {
    } else if (error.name === 'ValidationError') {
      console.error('❌ Validation error:', error.message);
    } else {
      throw error;
    }
  }
};

/**
 * Update existing admin user permissions
 * @async
 * @function updateAdminPermissions
 */
const updateAdminPermissions = async () => {
  try {
    
    const allPermissions = [
      'portfolio:read',
      'portfolio:write',
      'blog:read',
      'blog:write',
      'blog:delete',
      'comments:moderate',
      'media:upload',
      'media:delete',
      'analytics:view',
      'settings:manage',
      'users:manage'
    ];
    
    const result = await User.updateMany(
      { role: 'admin' },
      { $set: { permissions: allPermissions } }
    );
    
    
  } catch (error) {
    console.error('❌ Error updating admin permissions:', error);
    throw error;
  }
};

/**
 * Show admin user info
 * @async
 * @function showAdminInfo
 */
const showAdminInfo = async () => {
  try {
    const adminUsers = await User.find({ role: 'admin' }).select('-password');
    
    if (adminUsers.length === 0) {
      return;
    }
    
    adminUsers.forEach((user, index) => {
    });
    
  } catch (error) {
    console.error('❌ Error fetching admin info:', error);
    throw error;
  }
};

/**
 * Main execution function
 * @async
 * @function main
 */
const main = async () => {
  try {
    await connectDB();
    
    const command = process.argv[2];
    
    switch (command) {
      case 'create':
        await createAdminUser();
        break;
        
      case 'update-permissions':
        await updateAdminPermissions();
        break;
        
      case 'info':
        await showAdminInfo();
        break;
        
      default:
        break;
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createAdminUser,
  updateAdminPermissions,
  showAdminInfo
};