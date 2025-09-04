// Test to verify middleware is working on different routes
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testMiddleware() {
  console.log('🧪 Testing Middleware on Different Routes...\n');

  // Test auth/me route (should be protected)
  console.log('1. Testing /auth/me route (should be protected)...');
  try {
    await axios.get(`${BASE_URL}/auth/me`);
    console.log('❌ FAIL: /auth/me should be protected');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ PASS: /auth/me correctly protected');
    } else {
      console.log('❌ FAIL: Unexpected error with /auth/me');
      console.log('   Status:', error.response?.status);
    }
  }

  // Test cart route (should be protected)
  console.log('\n2. Testing /cart route (should be protected)...');
  try {
    await axios.get(`${BASE_URL}/cart`);
    console.log('❌ FAIL: /cart should be protected');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ PASS: /cart correctly protected');
    } else {
      console.log('❌ FAIL: Unexpected error with /cart');
      console.log('   Status:', error.response?.status);
    }
  }

  // Test public route (should work)
  console.log('\n3. Testing public route (should work)...');
  try {
    const response = await axios.get(`${BASE_URL}/`);
    if (response.status === 200) {
      console.log('✅ PASS: Public route works correctly');
    } else {
      console.log('❌ FAIL: Public route not working');
    }
  } catch (error) {
    console.log('❌ FAIL: Public route failed');
    console.log('   Error:', error.message);
  }

  console.log('\n🔍 Middleware test completed');
}

testMiddleware();
