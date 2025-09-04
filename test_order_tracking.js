const axios = require('axios');

async function testOrderTracking() {
  const baseURL = 'http://localhost:5000/api';

  console.log('🧪 Testing Order Tracking Functionality...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const healthCheck = await axios.get(`${baseURL}/`);
    console.log('✅ Server is running:', healthCheck.data);

    // Test 2: Test order tracking endpoint (without auth - should fail)
    console.log('\n2. Testing order tracking without auth...');
    try {
      await axios.get(`${baseURL}/orders/test123/tracking`);
      console.log('❌ Should have failed without auth');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly requires authentication');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    // Test 3: Test user orders endpoint (without auth - should fail)
    console.log('\n3. Testing user orders without auth...');
    try {
      await axios.get(`${baseURL}/orders/user`);
      console.log('❌ Should have failed without auth');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly requires authentication');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    console.log('\n🎉 Order tracking API tests completed!');
    console.log('\n📝 To test with authentication:');
    console.log('1. Login to get a token');
    console.log('2. Use the token in Authorization header: Bearer <token>');
    console.log('3. Test GET /api/orders/user to get user orders');
    console.log('4. Test GET /api/orders/{orderId}/tracking to track specific order');

  } catch (error) {
    console.log('❌ Server not running or connection failed');
    console.log('Make sure to start the backend server: cd backend && npm start');
  }
}

testOrderTracking().catch(console.error);
