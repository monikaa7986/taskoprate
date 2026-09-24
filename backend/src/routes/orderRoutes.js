const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly, optionalAuth } = require('../middleware/authMiddleware');

// Customer endpoints
router.post('/', optionalAuth, createOrder);
router.get('/my', protect, getMyOrders);

// Admin-only list
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// Order details by ID / Order Number
router.get('/:identifier', optionalAuth, getOrderById);

module.exports = router;
