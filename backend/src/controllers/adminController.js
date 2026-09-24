const db = require('../config/db');

// @desc    Get dashboard metrics and analytics
// @route   GET /api/admin/dashboard
const getDashboardStats = (req, res) => {
  try {
    const totalProducts = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
    const totalOrders = db.prepare('SELECT COUNT(*) AS count FROM orders').get().count;
    const totalCustomers = db.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'customer'").get().count;
    
    const revenueRow = db.prepare("SELECT SUM(total) AS sum FROM orders WHERE payment_status = 'paid' AND order_status != 'Cancelled'").get();
    const totalRevenue = revenueRow && revenueRow.sum ? Number(revenueRow.sum.toFixed(2)) : 0;

    const lowStockCount = db.prepare('SELECT COUNT(*) AS count FROM products WHERE stock < 15').get().count;

    // Recent orders
    const recentOrders = db.prepare(`
      SELECT id, order_number, customer_name, customer_email, total, order_status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 6
    `).all();

    // Low stock items
    const lowStockProducts = db.prepare(`
      SELECT p.id, p.name, p.sku, p.stock, p.price, c.name AS category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) AS primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock < 15
      ORDER BY p.stock ASC
      LIMIT 6
    `).all();

    // Order status breakdown
    const orderStatusBreakdown = db.prepare(`
      SELECT order_status, COUNT(*) AS count
      FROM orders
      GROUP BY order_status
    `).all();

    // Category distribution
    const categoryDistribution = db.prepare(`
      SELECT c.name, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
    `).all();

    // Monthly revenue simulation/aggregation from orders
    const monthlySales = db.prepare(`
      SELECT strftime('%Y-%m', created_at) AS month, SUM(total) AS revenue, COUNT(id) AS orders_count
      FROM orders
      WHERE order_status != 'Cancelled'
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month ASC
    `).all();

    res.json({
      success: true,
      data: {
        metrics: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalCustomers,
          lowStockCount
        },
        recentOrders,
        lowStockProducts,
        orderStatusBreakdown,
        categoryDistribution,
        monthlySales
      }
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving dashboard analytics.' });
  }
};

// @desc    Admin: Get customers list
// @route   GET /api/admin/customers
const getCustomers = (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT u.id, u.name, u.email, u.phone, u.city, u.state, u.country, u.is_active, u.created_at,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(o.total), 0) AS total_spend
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id AND o.order_status != 'Cancelled'
      WHERE u.role = 'customer'
    `;
    const params = [];

    if (search && search.trim()) {
      const s = `%${search.trim()}%`;
      query += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
      params.push(s, s, s);
    }

    query += ` GROUP BY u.id ORDER BY u.created_at DESC`;

    const customers = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: { customers }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving customers.' });
  }
};

// @desc    Admin: Toggle customer status
// @route   PUT /api/admin/customers/:id/status
const toggleCustomerStatus = (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare("SELECT id, name, is_active FROM users WHERE id = ? AND role = 'customer'").get(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    const newStatus = user.is_active === 1 ? 0 : 1;
    db.prepare('UPDATE users SET is_active = ? WHERE id = ?').run(newStatus, id);

    res.json({
      success: true,
      message: `Customer account ${newStatus === 1 ? 'activated' : 'deactivated'}.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating customer status.' });
  }
};

// @desc    Admin: Get inventory list
// @route   GET /api/admin/inventory
const getInventory = (req, res) => {
  try {
    const { search, lowStockOnly } = req.query;

    let query = `
      SELECT p.id, p.name, p.sku, p.stock, p.price, p.discount_price, p.status, p.gender_category,
        c.name AS category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) AS primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (lowStockOnly === 'true') {
      query += ` AND p.stock < 15`;
    }

    if (search && search.trim()) {
      const s = `%${search.trim()}%`;
      query += ` AND (p.name LIKE ? OR p.sku LIKE ? OR c.name LIKE ?)`;
      params.push(s, s, s);
    }

    query += ` ORDER BY p.stock ASC`;

    const inventory = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: { inventory }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving inventory.' });
  }
};

// @desc    Admin: Quick update stock
// @route   PUT /api/admin/inventory/:id/stock
const updateStock = (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || isNaN(stock) || stock < 0) {
      return res.status(400).json({ success: false, message: 'Valid non-negative stock quantity required.' });
    }

    db.prepare('UPDATE products SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(Number(stock), id);

    res.json({
      success: true,
      message: 'Stock level updated successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating stock.' });
  }
};

// @desc    Admin: Get store settings
// @route   GET /api/admin/settings
const getSettings = (req, res) => {
  try {
    const rows = db.prepare('SELECT setting_key, setting_value FROM store_settings').all();
    const settings = {};
    rows.forEach(r => {
      settings[r.setting_key] = r.setting_value;
    });

    res.json({ success: true, data: { settings } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving settings.' });
  }
};

// @desc    Admin: Update store settings
// @route   PUT /api/admin/settings
const updateSettings = (req, res) => {
  try {
    const updateStmt = db.prepare(`
      INSERT INTO store_settings (setting_key, setting_value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
    `);

    const settingsObj = req.body;
    for (const [key, value] of Object.entries(settingsObj)) {
      updateStmt.run(key, String(value));
    }

    res.json({ success: true, message: 'Store settings updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating settings.' });
  }
};

module.exports = {
  getDashboardStats,
  getCustomers,
  toggleCustomerStatus,
  getInventory,
  updateStock,
  getSettings,
  updateSettings
};
