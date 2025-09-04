const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: Object,
  shipping: {
    method: { type: String, default: 'standard' },
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    shippingCost: { type: Number, default: 0 }
  },
  discount: Number,
  payment: String,
  status: { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'] },
  statusHistory: [{
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'] },
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number // Store price at time of order
    }
  ],
  total: Number,
  cancellation: {
    isCancelled: { type: Boolean, default: false },
    reason: String,
    requestedAt: Date,
    processedAt: Date,
    refundAmount: Number,
    refundStatus: { type: String, enum: ['pending', 'processed', 'failed'] }
  },
  return: {
    isReturned: { type: Boolean, default: false },
    reason: String,
    requestedAt: Date,
    approvedAt: Date,
    receivedAt: Date,
    refundAmount: Number,
    refundStatus: { type: String, enum: ['pending', 'processed', 'failed'] },
    returnTrackingNumber: String
  },
  notes: [{
    content: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false } // For admin internal notes
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update statusHistory when status changes
OrderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Order status changed to ${this.status}`
    });
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
