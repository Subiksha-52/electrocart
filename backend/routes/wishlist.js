const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

// Get wishlist for user
router.get('/', async (req, res) => {
  const userId = "64b7c2e1f1a2b3c4d5e6f7a8"; // Hardcoded user ID for testing
  const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
  res.json(wishlist || { user: userId, products: [] });
});

// Add to wishlist
router.post('/add', async (req, res) => {
  const userId = "64b7c2e1f1a2b3c4d5e6f7a8"; // Hardcoded user ID for testing
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = new Wishlist({ user: userId, products: [] });
  if (!wishlist.products.includes(productId)) wishlist.products.push(productId);
  await wishlist.save();
  res.json(wishlist);
});

// Remove from wishlist
router.post('/remove', async (req, res) => {
  const userId = "64b7c2e1f1a2b3c4d5e6f7a8"; // Hardcoded user ID for testing
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: userId });
  if (wishlist) {
    wishlist.products = wishlist.products.filter(p => !p.equals(productId));
    await wishlist.save();
  }
  res.json(wishlist);
});

module.exports = router;
