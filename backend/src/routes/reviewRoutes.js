const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  addReview,
  getAllReviews,
  toggleApproveReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect, adminOnly, optionalAuth } = require('../middleware/authMiddleware');

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', optionalAuth, addReview);

// Admin-only review moderation
router.get('/', protect, adminOnly, getAllReviews);
router.put('/:id/approve', protect, adminOnly, toggleApproveReview);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
