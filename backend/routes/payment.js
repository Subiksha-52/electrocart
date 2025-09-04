// backend/routes/payment.js
const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: 'rzp_test_7ALd8ndNWkk7vu',
  key_secret: 'qfXln0bCfVRJwDEa7FADi8Tl'
});

// Create payment order - requires authentication
router.post('/create-order', auth, async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    payment_capture: 1
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;
