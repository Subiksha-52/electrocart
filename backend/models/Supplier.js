const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: String,
  email: String,
  address: String
});

module.exports = mongoose.model('Supplier', SupplierSchema);
