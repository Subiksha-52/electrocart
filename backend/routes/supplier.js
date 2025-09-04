const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

// Add supplier
router.post('/', async (req, res) => {
  const supplier = new Supplier(req.body);
  await supplier.save();
  res.status(201).json(supplier);
});

// List suppliers
router.get('/', async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
});

module.exports = router;
