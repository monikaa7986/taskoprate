const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getCustomers,
  toggleCustomerStatus,
  getInventory,
  updateStock,
  getSettings,
  updateSettings
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require admin authentication
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/customers', getCustomers);
router.put('/customers/:id/status', toggleCustomerStatus);
router.get('/inventory', getInventory);
router.put('/inventory/:id/stock', updateStock);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
