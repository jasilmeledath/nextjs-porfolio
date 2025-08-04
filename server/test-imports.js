// Test file to verify all imports work correctly
console.log('Testing imports...');

try {
  console.log('Current working directory:', process.cwd());
  console.log('__dirname:', __dirname);
  
  // Test User model import
  const User = require('./src/models/User');
  console.log('✅ User model imported successfully');
  
  // Test other models
  const Blog = require('./src/models/Blog');
  console.log('✅ Blog model imported successfully');
  
  const Subscriber = require('./src/models/Subscriber');
  console.log('✅ Subscriber model imported successfully');
  
  console.log('✅ All imports successful!');
  process.exit(0);
} catch (error) {
  console.error('❌ Import error:', error.message);
  console.error('Error code:', error.code);
  console.error('Stack:', error.stack);
  process.exit(1);
}