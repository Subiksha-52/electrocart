// Test to verify which version of the server code is running
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testServerVersion() {
  console.log('🔄 Testing Server Version...\n');

  try {
    // Test if the server responds with the hardcoded user ID behavior
    const response = await axios.get(`${BASE_URL}/cart`);
    
    // Check if the response contains data that would only come from the old version
    // (with hardcoded user ID)
    if (response.data && response.data.items && response.data.items.length > 0) {
      console.log('❌ Server is using OLD version (with hardcoded user ID)');
      console.log('   Items found:', response.data.items.length);
      console.log('   This suggests the authentication middleware is not applied');
    } else {
      console.log('✅ Server is using NEW version (with authentication)');
    }
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Server is using NEW version (authentication required)');
    } else {
      console.log('❓ Unknown server state:', error.message);
    }
  }
}

testServerVersion();
