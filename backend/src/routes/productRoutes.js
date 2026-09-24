const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductByIdOrSlug,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Specific public endpoints before parameterized routes
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id/related', getRelatedProducts);

// General list & single product
router.get('/', getProducts);
router.get('/:identifier', getProductByIdOrSlug);

// Admin-only endpoints
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
