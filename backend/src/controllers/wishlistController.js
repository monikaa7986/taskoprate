const db = require('../config/db');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
const getWishlist = (req, res) => {
  try {
    const items = db.prepare(`
      SELECT p.*, c.name AS category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) AS primary_image,
        w.created_at AS added_at
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(req.user.id);

    res.json({ success: true, data: { wishlist: items } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving wishlist.' });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
const addToWishlist = (req, res) => {
  try {
    const { productId } = req.params;
    const product = db.prepare('SELECT id, name FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    db.prepare('INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)').run(req.user.id, productId);

    res.json({
      success: true,
      message: `"${product.name}" added to your wishlist.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error adding to wishlist.' });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
const removeFromWishlist = (req, res) => {
  try {
    const { productId } = req.params;
    db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?').run(req.user.id, productId);

    res.json({
      success: true,
      message: 'Item removed from wishlist.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error removing from wishlist.' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
