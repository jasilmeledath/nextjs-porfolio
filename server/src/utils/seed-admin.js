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
    
    console.log('✅ MongoDB connected successfully');
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
    console.log('🔄 Checking for existing admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:', {
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
    
    console.log('🔄 Creating admin user...');
    
    const adminUser = new User(adminData);
    await adminUser.save();
    
    console.log('✅ Admin user created successfully:', {
      email: adminUser.email,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      role: adminUser.role,
      permissions: adminUser.permissions
    });
    
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!\n');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    if (error.code === 11000) {
      console.log('ℹ️  Admin user with this email already exists');
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
    console.log('🔄 Updating admin user permissions...');
    
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
    
    console.log(`✅ Updated ${result.modifiedCount} admin user(s) with full permissions`);
    
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
      console.log('ℹ️  No admin users found');
      return;
    }
    
    console.log('\n📋 Current Admin Users:');
    adminUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive ? '✅' : '❌'}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log(`   Last Login: ${user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}`);
      console.log(`   Permissions: ${user.permissions.length} permissions`);
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
        console.log('\n🔧 Admin User Management Tool\n');
        console.log('Available commands:');
        console.log('  create              - Create a new admin user');
        console.log('  update-permissions  - Update admin user permissions');
        console.log('  info               - Show admin user information');
        console.log('\nUsage:');
        console.log('  node src/utils/seed-admin.js create');
        console.log('  node src/utils/seed-admin.js info');
        console.log('\nEnvironment Variables (optional):');
        console.log('  ADMIN_EMAIL        - Admin email (default: admin@portfolio.com)');
        console.log('  ADMIN_PASSWORD     - Admin password (default: Admin123!@#)');
        console.log('  ADMIN_FIRST_NAME   - Admin first name (default: Admin)');
        console.log('  ADMIN_LAST_NAME    - Admin last name (default: User)');
        break;
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
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