/**
 * @fileoverview Test Comments API - Simple test script for comment endpoints
 * @author jasilmeledath@gmail.com
 * @created 2025-01-27
 * @version 1.0.0
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';
const TEST_BLOG_ID = '60f7b3b3b3b3b3b3b3b3b3b3'; // Replace with actual blog ID
const AUTH_TOKEN = 'your-jwt-token-here'; // Replace with actual admin token

// Test data
const testComment = {
  author: {
    name: 'Test User',
    email: 'test@example.com',
    website: 'https://testuser.com'
  },
  content: 'This is a test comment to verify the API is working correctly.',
  parentComment: null
};

/**
 * Test helper function
 * @param {string} testName - Name of the test
 * @param {Function} testFn - Test function
 */
async function runTest(testName, testFn) {
  try {
    console.log(`\n🧪 Testing: ${testName}`);
    console.log('─'.repeat(50));
    
    const result = await testFn();
    
    console.log('✅ PASSED:', testName);
    if (result) {
      console.log('📄 Response:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.log('❌ FAILED:', testName);
    console.log('🚨 Error:', error.message);
    if (error.response?.data) {
      console.log('📄 Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

/**
 * Test 1: Add a comment (Public endpoint)
 */
async function testAddComment() {
  const response = await axios.post(
    `${API_BASE_URL}/comments/blog/${TEST_BLOG_ID}`,
    testComment,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data;
}

/**
 * Test 2: Get blog comments (Public endpoint)
 */
async function testGetBlogComments() {
  const response = await axios.get(
    `${API_BASE_URL}/comments/blog/${TEST_BLOG_ID}?page=1&limit=10`
  );
  
  return response.data;
}

/**
 * Test 3: Get pending comments (Admin endpoint)
 */
async function testGetPendingComments() {
  const response = await axios.get(
    `${API_BASE_URL}/comments/pending?page=1&limit=10`,
    {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    }
  );
  
  return response.data;
}

/**
 * Test 4: Get comment statistics (Admin endpoint)
 */
async function testGetCommentStats() {
  const response = await axios.get(
    `${API_BASE_URL}/comments/stats`,
    {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    }
  );
  
  return response.data;
}

/**
 * Test 5: Health check
 */
async function testHealthCheck() {
  const response = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`);
  return response.data;
}

/**
 * Test 6: API info
 */
async function testApiInfo() {
  const response = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/api`);
  return response.data;
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🚀 Starting Comments API Tests');
  console.log('='.repeat(50));
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Test Blog ID: ${TEST_BLOG_ID}`);
  console.log(`Auth Token: ${AUTH_TOKEN ? 'Provided' : 'Not provided (admin tests will fail)'}`);

  // Test server connectivity first
  await runTest('Server Health Check', testHealthCheck);
  await runTest('API Information', testApiInfo);

  // Test public endpoints
  await runTest('Add Comment (Public)', testAddComment);
  await runTest('Get Blog Comments (Public)', testGetBlogComments);

  // Test admin endpoints (requires auth token)
  if (AUTH_TOKEN && AUTH_TOKEN !== 'your-jwt-token-here') {
    await runTest('Get Pending Comments (Admin)', testGetPendingComments);
    await runTest('Get Comment Statistics (Admin)', testGetCommentStats);
  } else {
    console.log('\n⚠️  Skipping admin tests - No auth token provided');
    console.log('   To test admin endpoints, set AUTH_TOKEN in the script');
  }

  console.log('\n🏁 Tests completed!');
  console.log('='.repeat(50));
}

/**
 * Validation tests
 */
async function testValidation() {
  console.log('\n🔍 Testing Validation');
  console.log('─'.repeat(30));

  // Test empty comment
  await runTest('Empty Comment Validation', async () => {
    try {
      await axios.post(`${API_BASE_URL}/comments/blog/${TEST_BLOG_ID}`, {
        author: { name: '', email: '', website: '' },
        content: ''
      });
    } catch (error) {
      if (error.response?.status === 400) {
        return { validation: 'Working - Empty fields rejected' };
      }
      throw error;
    }
  });

  // Test invalid email
  await runTest('Invalid Email Validation', async () => {
    try {
      await axios.post(`${API_BASE_URL}/comments/blog/${TEST_BLOG_ID}`, {
        author: { name: 'Test', email: 'invalid-email', website: '' },
        content: 'Test content'
      });
    } catch (error) {
      if (error.response?.status === 400) {
        return { validation: 'Working - Invalid email rejected' };
      }
      throw error;
    }
  });

  // Test content too short
  await runTest('Short Content Validation', async () => {
    try {
      await axios.post(`${API_BASE_URL}/comments/blog/${TEST_BLOG_ID}`, {
        author: { name: 'Test', email: 'test@example.com', website: '' },
        content: 'Hi'
      });
    } catch (error) {
      if (error.response?.status === 400) {
        return { validation: 'Working - Short content rejected' };
      }
      throw error;
    }
  });
}

/**
 * Show usage instructions
 */
function showUsage() {
  console.log('\n📋 Usage Instructions:');
  console.log('─'.repeat(30));
  console.log('1. Make sure your server is running on port 8000');
  console.log('2. Replace TEST_BLOG_ID with an actual blog ID from your database');
  console.log('3. For admin tests, replace AUTH_TOKEN with a valid JWT token');
  console.log('4. Run: node test-comments-api.js');
  console.log('\n🔧 To get a blog ID:');
  console.log('   - Check your MongoDB blogs collection');
  console.log('   - Or create a blog post first');
  console.log('\n🔑 To get an auth token:');
  console.log('   - Login through /api/v1/auth/login');
  console.log('   - Copy the token from the response');
}

// Check if we can run tests
if (TEST_BLOG_ID === '60f7b3b3b3b3b3b3b3b3b3b3') {
  console.log('⚠️  Please update TEST_BLOG_ID with a real blog ID from your database');
  showUsage();
} else {
  // Run tests
  runAllTests()
    .then(() => testValidation())
    .catch(error => {
      console.error('🚨 Test runner failed:', error.message);
    });
}

module.exports = {
  runAllTests,
  testValidation,
  showUsage
};