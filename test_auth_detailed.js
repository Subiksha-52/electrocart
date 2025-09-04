// Detailed test to verify authentication middleware
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuthDetailed() {
  console.log('🔍 Detailed Authentication Middleware Test...\n');

  // Test with invalid token
  console.log('1. Testing with invalid token...');
  try {
    await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: 'Bearer invalid_token_here' }
    });
    console.log('❌ FAIL: Should have been denied access with invalid token');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ PASS: Correctly denied access with invalid token');
      console.log('   Error:', error.response.data);
    } else {
      console.log('❌ FAIL: Unexpected error with invalid token');
      console.log('   Status:', error.response?.status);
      console.log('   Data:', error.response?.data);
    }
  }

  // Test with malformed token
  console.log('\n2. Testing with malformed token...');
  try {
    await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: 'Bearer malformed' }
    });
    console.log('❌ FAIL: Should have been denied access with malformed token');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ PASS: Correctly denied access with malformed token');
      console.log('   Error:', error.response.data);
    } else {
      console.log('❌ FAIL: Unexpected error with malformed token');
      console.log('   Status:', error.response?.status);
      console.log('   Data:', error.response?.data);
    }
  }

  // Test without any authorization header
  console.log('\n3. Testing without any authorization header...');
  try {
    await axios.get(`${BASE_URL}/cart`);
    console.log('❌ FAIL: Should have been denied access without authorization header');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ PASS: Correctly denied access without authorization header');
      console.log('   Error:', error.response.data);
    } else {
      console.log('❌ FAIL: Unexpected error without authorization header');
      console.log('   Status:', error.response?.status);
      console.log('   Data:', error.response?.data);
    }
  }

  console.log('\n🔍 Test completed. Checking if middleware is properly applied...');
}

// Run the test
testAuthDetailed();
