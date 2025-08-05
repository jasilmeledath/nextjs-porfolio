/**
 * Test script to verify Cloudinary configuration
 */

require('dotenv').config();
const { cloudinary } = require('./src/config/cloudinary');

async function testCloudinaryConnection() {
  try {
    console.log('🧪 Testing Cloudinary connection...');
    console.log('📋 Configuration:');
    console.log('  Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('  API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('  API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
    
    // Test connection by getting account details
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('📊 Account status:', result.status);
    
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('💡 Please check your CLOUDINARY_API_KEY in .env file');
    } else if (error.message.includes('Invalid cloud name')) {
      console.log('💡 Please check your CLOUDINARY_CLOUD_NAME in .env file');
    } else if (error.message.includes('Invalid API secret')) {
      console.log('💡 Please check your CLOUDINARY_API_SECRET in .env file');
    }
  }
}

testCloudinaryConnection();
