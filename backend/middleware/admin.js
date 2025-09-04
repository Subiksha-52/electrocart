const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    // First check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        msg: 'Authentication required',
        error: 'AUTH_REQUIRED'
      });
    }

    // Check if user has admin role (you can modify this based on your User model)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // For now, we'll assume admin check based on email or a role field
    // You can modify this logic based on your admin user identification
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    const isAdmin = adminEmails.includes(user.email) || user.role === 'admin';

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        msg: 'Admin access required',
        error: 'ADMIN_ACCESS_DENIED'
      });
    }

    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(500).json({
      success: false,
      msg: 'Server error during admin check',
      error: 'ADMIN_CHECK_ERROR'
    });
  }
};
