const db = require('../config/db');

// Helper to recalculate product rating average
function updateProductRatingStats(productId) {
  const stats = db.prepare(`
    SELECT COUNT(*) AS count, AVG(rating) AS avg_rating
    FROM reviews
    WHERE product_id = ? AND is_approved = 1
  `).get(productId);

  const count = stats ? stats.count : 0;
  const avg = stats && stats.avg_rating ? Number(stats.avg_rating.toFixed(1)) : 5.0;

  db.prepare(`
    UPDATE products
    SET rating = ?, reviews_count = ?
    WHERE id = ?
  `).run(avg, count, productId);
}

// @desc    Get approved reviews for a product
// @route   GET /api/reviews/product/:productId
const getProductReviews = (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = db.prepare(`
      SELECT r.*, u.name as reviewer_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.is_approved = 1
      ORDER BY r.created_at DESC
    `).all(productId);

    res.json({ success: true, data: { reviews } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving reviews.' });
  }
};

// @desc    Add review for a product
// @route   POST /api/reviews/product/:productId
const addReview = (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, user_name } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Review comment is required.' });
    }

    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const reviewerName = req.user ? req.user.name : (user_name || 'Anonymous Customer');
    const userId = req.user ? req.user.id : null;

    const result = db.prepare(`
      INSERT INTO reviews (product_id, user_id, user_name, rating, title, comment, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(productId, userId, reviewerName, Number(rating), title || '', comment.trim());

    updateProductRatingStats(productId);

    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
      data: { review: newReview }
    });
  } catch (error) {
    console.error('addReview error:', error);
    res.status(500).json({ success: false, message: 'Server error submitting review.' });
  }
};

// @desc    Admin: Get all reviews
// @route   GET /api/reviews
const getAllReviews = (req, res) => {
  try {
    const reviews = db.prepare(`
      SELECT r.*, p.name AS product_name, p.slug AS product_slug
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
    `).all();

    res.json({ success: true, data: { reviews } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving reviews.' });
  }
};

// @desc    Admin: Toggle approve review
// @route   PUT /api/reviews/:id/approve
const toggleApproveReview = (req, res) => {
  try {
    const { id } = req.params;
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    const newStatus = review.is_approved === 1 ? 0 : 1;
    db.prepare('UPDATE reviews SET is_approved = ? WHERE id = ?').run(newStatus, id);

    updateProductRatingStats(review.product_id);

    res.json({
      success: true,
      message: `Review ${newStatus === 1 ? 'approved' : 'hidden'}.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating review.' });
  }
};

// @desc    Admin: Delete review
// @route   DELETE /api/reviews/:id
const deleteReview = (req, res) => {
  try {
    const { id } = req.params;
    const review = db.prepare('SELECT product_id FROM reviews WHERE id = ?').get(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
    updateProductRatingStats(review.product_id);

    res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting review.' });
  }
};

module.exports = {
  getProductReviews,
  addReview,
  getAllReviews,
  toggleApproveReview,
  deleteReview
};
