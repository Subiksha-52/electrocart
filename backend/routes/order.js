const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendOrderCancellation,
  sendReturnRequest
} = require('../services/emailService');

// Utility function to generate tracking number
function generateTrackingNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TRK${timestamp}${random}`;
}

// Utility function to calculate estimated delivery
function calculateEstimatedDelivery() {
  const now = new Date();
  // Standard delivery: 3-5 business days
  const deliveryDays = Math.floor(Math.random() * 3) + 3; // 3-5 days
  now.setDate(now.getDate() + deliveryDays);
  return now;
}

// Place order (protected)
router.post('/', auth, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.user.id, // Add userId from authenticated user
      shipping: {
        ...req.body.shipping,
        trackingNumber: generateTrackingNumber(),
        estimatedDelivery: calculateEstimatedDelivery(),
        carrier: 'Standard Shipping'
      }
    };
    const order = new Order(orderData);
    await order.save();

    // Populate product details for response
    await order.populate('items.product');

    // Send order confirmation email
    try {
      const user = await User.findById(req.user.id);
      if (user && user.email) {
        await sendOrderConfirmation(user.email, order);
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (protected - admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate('items.product')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (err) {
    console.error('Get all orders error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get orders for a specific user (protected)
router.get('/user', auth, async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Verify that the authenticated user is requesting their own orders
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const orders = await Order.find({ userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get order tracking details by order ID (protected)
router.get('/:orderId/tracking', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const trackingInfo = {
      orderId: order._id,
      status: order.status,
      statusHistory: order.statusHistory,
      shipping: order.shipping,
      items: order.items,
      createdAt: order.createdAt,
      estimatedDelivery: order.shipping.estimatedDelivery
    };

    res.json(trackingInfo);
  } catch (err) {
    console.error('Get tracking error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update order status (admin only)
router.put('/:orderId/status', auth, admin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update status - the pre-save middleware will handle statusHistory
    order.status = status;
    if (note) {
      order.notes.push({
        content: note,
        createdBy: req.user.id,
        isInternal: true
      });
    }

    await order.save();
    await order.populate('items.product');

    // Send status update email to customer
    try {
      const user = await User.findById(order.userId);
      if (user && user.email) {
        await sendOrderStatusUpdate(user.email, order, status);
      }
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the status update if email fails
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Cancel order (protected)
router.post('/:orderId/cancel', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if order can be cancelled
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        error: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order cancellation details
    order.status = 'cancelled';
    order.cancellation = {
      isCancelled: true,
      reason: reason || 'Customer requested cancellation',
      requestedAt: new Date(),
      refundStatus: 'pending'
    };

    await order.save();

    // Send cancellation confirmation email
    try {
      const user = await User.findById(order.userId);
      if (user && user.email) {
        await sendOrderCancellation(user.email, order);
      }
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Request return (protected)
router.post('/:orderId/return', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason, returnTrackingNumber } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if order can be returned
    if (order.status !== 'delivered') {
      return res.status(400).json({
        error: 'Only delivered orders can be returned'
      });
    }

    // Update order return details
    order.return = {
      isReturned: true,
      reason: reason || 'Customer requested return',
      requestedAt: new Date(),
      refundStatus: 'pending',
      returnTrackingNumber
    };

    await order.save();

    res.json({
      message: 'Return request submitted successfully',
      order
    });
  } catch (err) {
    console.error('Return request error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get order history/timeline (protected)
router.get('/:orderId/history', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const history = [
      {
        status: 'Order Placed',
        timestamp: order.createdAt,
        description: 'Your order has been successfully placed'
      },
      ...order.statusHistory.map(item => ({
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        timestamp: item.timestamp,
        description: item.note || `Order status changed to ${item.status}`
      }))
    ];

    res.json({
      orderId: order._id,
      history: history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    });
  } catch (err) {
    console.error('Get order history error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
