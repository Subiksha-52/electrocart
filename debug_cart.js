// Debug script to understand cart route behavior
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function debugCart() {
  console.log('🔍 Debugging Cart Route...\n');

  try {
    // Test cart route without auth
    console.log('1. Testing GET /cart without authentication...');
    const response = await axios.get(`${BASE_URL}/cart`);
    console.log('   Status:', response.status);
    console.log('   Data:', JSON.stringify(response.data, null, 2));
    
    // Test what user ID is being used
    console.log('\n2. Checking what user data is returned...');
    if (response.data.items && response.data.items.length > 0) {
      console.log('   First item user reference:', response.data.items[0].product);
    }
    
    // Test with auth header but invalid token
    console.log('\n3. Testing with invalid token...');
    try {
      await axios.get(`${BASE_URL}/cart`, {
        headers: { Authorization: 'Bearer invalid_token_123' }
      });
    } catch (error) {
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

debugCart();
