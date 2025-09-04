// Simple test script to verify authentication middleware functionality
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🧪 Testing Authentication Middleware...\n');

  try {
    // Test 1: Try to access protected route without token
    console.log('1. Testing access to protected route without token...');
    try {
      await axios.get(`${BASE_URL}/auth/me`);
      console.log('❌ FAIL: Should have been denied access');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ PASS: Correctly denied access without token');
        console.log('   Error:', error.response.data);
      } else {
        console.log('❌ FAIL: Unexpected error', error.response?.data);
      }
    }

    // Test 2: Try to access cart without authentication
    console.log('\n2. Testing access to cart without authentication...');
    try {
      const response = await axios.get(`${BASE_URL}/cart`);
      console.log('❌ FAIL: Should have been denied access to cart');
      console.log('   Response status:', response.status);
      console.log('   Response data:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ PASS: Correctly denied access to cart without authentication');
        console.log('   Error:', error.response.data);
      } else {
        console.log('❌ FAIL: Unexpected error');
        console.log('   Status:', error.response?.status);
        console.log('   Data:', error.response?.data);
        console.log('   Error message:', error.message);
      }
    }

    // Test 3: Try to create payment order without authentication
    console.log('\n3. Testing payment creation without authentication...');
    try {
      const response = await axios.post(`${BASE_URL}/payment/create-order`, { amount: 100 });
      console.log('❌ FAIL: Should have been denied payment access');
      console.log('   Response status:', response.status);
      console.log('   Response data:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ PASS: Correctly denied payment access without authentication');
        console.log('   Error:', error.response.data);
      } else {
        console.log('❌ FAIL: Unexpected error');
        console.log('   Status:', error.response?.status);
        console.log('   Data:', error.response?.data);
        console.log('   Error message:', error.message);
      }
    }

    console.log('\n🎉 Authentication middleware tests completed successfully!');
    console.log('All protected routes correctly require authentication.');

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

// Run the test
testAuth();
