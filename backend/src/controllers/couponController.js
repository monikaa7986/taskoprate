const db = require('../config/db');

// @desc    Validate a promo code for checkout
// @route   POST /api/coupons/validate
const validateCoupon = (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
    }

    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(code.trim().toUpperCase());
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive promotional code.' });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ success: false, message: 'This promo code has expired.' });
    }

    const orderSubtotal = Number(subtotal) || 0;
    if (orderSubtotal < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum subtotal of $${coupon.min_order_amount}.`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (orderSubtotal * coupon.discount_value) / 100;
      if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
        discount = coupon.max_discount_amount;
      }
    } else {
      discount = Math.min(orderSubtotal, coupon.discount_value);
    }

    discount = Number(discount.toFixed(2));

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" applied! You saved $${discount}.`,
      data: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error validating coupon.' });
  }
};

// @desc    Admin: Get all coupons
// @route   GET /api/coupons
const getAllCoupons = (req, res) => {
  try {
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all();
    res.json({ success: true, data: { coupons } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving coupons.' });
  }
};

// @desc    Admin: Create coupon
// @route   POST /api/coupons
const createCoupon = (req, res) => {
  try {
    const { code, description, discount_type, discount_value, min_order_amount, max_discount_amount, expires_at, usage_limit } = req.body;

    if (!code || !discount_value) {
      return res.status(400).json({ success: false, message: 'Coupon code and discount value are required.' });
    }

    const existing = db.prepare('SELECT id FROM coupons WHERE code = ?').get(code.trim().toUpperCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'A coupon with this code already exists.' });
    }

    const result = db.prepare(`
      INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, expires_at, usage_limit, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      code.trim().toUpperCase(),
      description || '',
      discount_type || 'percentage',
      Number(discount_value),
      Number(min_order_amount) || 0,
      max_discount_amount ? Number(max_discount_amount) : null,
      expires_at || null,
      Number(usage_limit) || 100
    );

    const newCoupon = db.prepare('SELECT * FROM coupons WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: { coupon: newCoupon }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating coupon.' });
  }
};

// @desc    Admin: Update coupon
// @route   PUT /api/coupons/:id
const updateCoupon = (req, res) => {
  try {
    const { id } = req.params;
    const { description, discount_value, min_order_amount, max_discount_amount, is_active } = req.body;

    db.prepare(`
      UPDATE coupons
      SET description = COALESCE(?, description),
          discount_value = COALESCE(?, discount_value),
          min_order_amount = COALESCE(?, min_order_amount),
          max_discount_amount = ?,
          is_active = COALESCE(?, is_active)
      WHERE id = ?
    `).run(
      description !== undefined ? description : null,
      discount_value !== undefined ? Number(discount_value) : null,
      min_order_amount !== undefined ? Number(min_order_amount) : null,
      max_discount_amount !== undefined ? (max_discount_amount ? Number(max_discount_amount) : null) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM coupons WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: { coupon: updated }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating coupon.' });
  }
};

// @desc    Admin: Delete coupon
// @route   DELETE /api/coupons/:id
const deleteCoupon = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM coupons WHERE id = ?').run(id);
    res.json({ success: true, message: 'Coupon deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting coupon.' });
  }
};

module.exports = {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
