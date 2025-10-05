vvconst axios = require('axios');

async function testDashboardAPIs() {
  const baseURL = 'http://localhost:5000/api';

  console.log('🔍 Testing Dashboard API Endpoints...\n');

  try {
    // Test public endpoints first
    console.log('📦 Testing public endpoints...');

    const productsRes = await axios.get(`${baseURL}/products`);
    console.log('✅ /api/products: OK');

    const categoriesRes = await axios.get(`${baseURL}/categories`);
    console.log('✅ /api/categories: OK');

    // Test protected endpoints (will fail without token)
    console.log('\n🔐 Testing protected endpoints without token...');

    try {
      await axios.get(`${baseURL}/users/stats`);
    } catch (err) {
      console.log('❌ /api/users/stats (no token):', err.response?.status, err.response?.data?.msg || err.message);
    }

    try {
      await axios.get(`${baseURL}/orders`);
    } catch (err) {
      console.log('❌ /api/orders (no token):', err.response?.status, err.response?.data?.msg || err.message);
    }

    // Test with invalid token
    console.log('\n🔐 Testing protected endpoints with invalid token...');
    const config = {
      headers: {
        Authorization: 'Bearer invalid_token_here'
      }
    };

    try {
      await axios.get(`${baseURL}/users/stats`, config);
    } catch (err) {
      console.log('❌ /api/users/stats (invalid token):', err.response?.status, err.response?.data?.msg || err.message);
    }

    try {
      await axios.get(`${baseURL}/orders`, config);
    } catch (err) {
      console.log('❌ /api/orders (invalid token):', err.response?.status, err.response?.data?.msg || err.message);
    }

  } catch (err) {
    console.error('❌ General error:', err.message);
  }
}

testDashboardAPIs();
