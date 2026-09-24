const db = require('../config/db');

// @desc    Create new order (Customer checkout)
// @route   POST /api/orders
const createOrder = (req, res) => {
  const createOrderTx = db.transaction((data, userId) => {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      state,
      postal_code,
      country = 'United States',
      items,
      coupon_code,
      payment_method = 'credit_card',
      notes
    } = data;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Order must contain at least one item.');
    }

    if (!customer_name || !customer_email || !shipping_address || !city || !postal_code) {
      throw new Error('Please fill in all required shipping address fields.');
    }

    // 1. Calculate subtotal directly from database products to ensure security
    let subtotal = 0;
    const validatedItems = [];

    const getProduct = db.prepare('SELECT id, name, price, discount_price, stock FROM products WHERE id = ?');
    const getProductImg = db.prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC LIMIT 1');

    for (const item of items) {
      const product = getProduct.get(item.product_id);
      if (!product) {
        throw new Error(`Product with ID ${item.product_id} no longer exists.`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} available.`);
      }

      const unitPrice = product.discount_price !== null ? product.discount_price : product.price;
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      const imgRow = getProductImg.get(product.id);
      const imageUrl = imgRow ? imgRow.image_url : (item.product_image || null);

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image: imageUrl,
        size: item.size || 'M',
        color: item.color || 'Standard',
        price: unitPrice,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // 2. Validate coupon if provided
    let discount = 0;
    let couponApplied = null;

    if (coupon_code && coupon_code.trim()) {
      const coupon = db.prepare(`
        SELECT * FROM coupons 
        WHERE code = ? AND is_active = 1
      `).get(coupon_code.trim().toUpperCase());

      if (coupon) {
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
          // expired, ignore
        } else if (subtotal < coupon.min_order_amount) {
          // minimum not met, ignore
        } else {
          couponApplied = coupon.code;
          if (coupon.discount_type === 'percentage') {
            discount = (subtotal * coupon.discount_value) / 100;
            if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
              discount = coupon.max_discount_amount;
            }
          } else {
            discount = coupon.discount_value;
          }
          // Increment coupon usage
          db.prepare('UPDATE coupons SET usage_count = usage_count + 1 WHERE id = ?').run(coupon.id);
        }
      }
    }

    // 3. Shipping fee & Tax calculation
    const shippingThreshold = 150.00;
    const shippingFee = (subtotal - discount) >= shippingThreshold ? 0.00 : 12.00;
    const taxRate = 0.085; // 8.5%
    const tax = Number(((subtotal - discount) * taxRate).toFixed(2));
    const total = Number(((subtotal - discount) + shippingFee + tax).toFixed(2));

    // 4. Generate Order Number
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-2026-${randomHex}`;

    // 5. Insert Order
    const insertOrderStmt = db.prepare(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, city, state, postal_code, country,
        subtotal, discount, shipping_fee, tax, total,
        coupon_code, payment_method, payment_status, order_status, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)
    `);

    const orderResult = insertOrderStmt.run(
      orderNumber,
      userId || null,
      customer_name.trim(),
      customer_email.trim().toLowerCase(),
      customer_phone || '',
      shipping_address.trim(),
      city.trim(),
      state || '',
      postal_code.trim(),
      country,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      couponApplied,
      payment_method,
      'paid',
      notes || ''
    );

    const orderId = orderResult.lastInsertRowid;

    // 6. Insert Order Items & decrement product stock
    const insertItemStmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, product_image, size, color, price, quantity, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const decStockStmt = db.prepare('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?');
    const decVariantStock = db.prepare('UPDATE product_variants SET stock = MAX(0, stock - ?) WHERE product_id = ? AND size = ?');

    for (const vItem of validatedItems) {
      insertItemStmt.run(
        orderId,
        vItem.product_id,
        vItem.product_name,
        vItem.product_image,
        vItem.size,
        vItem.color,
        vItem.price,
        vItem.quantity,
        vItem.total
      );

      // Decrement stock
      decStockStmt.run(vItem.quantity, vItem.product_id);
      decVariantStock.run(vItem.quantity, vItem.product_id, vItem.size);
    }

    return {
      orderId,
      orderNumber,
      total,
      subtotal,
      discount,
      shippingFee,
      tax,
      items: validatedItems
    };
  });

  try {
    const userId = req.user ? req.user.id : null;
    const result = createOrderTx(req.body, userId);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: {
        order: result
      }
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(400).json({ success: false, message: error.message || 'Error processing order.' });
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/my
const getMyOrders = (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.user.id);

    const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');

    const ordersWithItems = orders.map(order => ({
      ...order,
      items: getItems.all(order.id)
    }));

    res.json({
      success: true,
      data: { orders: ordersWithItems }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving orders.' });
  }
};

// @desc    Get order by ID or Order Number
// @route   GET /api/orders/:identifier
const getOrderById = (req, res) => {
  try {
    const { identifier } = req.params;
    let order;

    if (!isNaN(identifier)) {
      order = db.prepare('SELECT * FROM orders WHERE id = ?').get(identifier);
    } else {
      order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(identifier);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Verify ownership if not admin
    if (req.user && req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this order.' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

    res.json({
      success: true,
      data: {
        order: {
          ...order,
          items
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving order details.' });
  }
};

// --- ADMIN ORDER ACTIONS ---

// @desc    Admin: Get all orders
// @route   GET /api/orders
const getAllOrders = (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    let query = `SELECT * FROM orders WHERE 1=1`;
    const params = [];

    if (status && status !== 'all') {
      query += ` AND order_status = ?`;
      params.push(status);
    }

    if (search && search.trim()) {
      const s = `%${search.trim()}%`;
      query += ` AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ?)`;
      params.push(s, s, s);
    }

    query += ` ORDER BY created_at DESC`;

    const countQuery = `SELECT COUNT(*) AS total FROM (${query})`;
    const countRow = db.prepare(countQuery).get(...params);
    const total = countRow ? countRow.total : 0;

    const offset = (Number(page) - 1) * Number(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), offset);

    const rows = db.prepare(query).all(...params);
    const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');

    const orders = rows.map(ord => ({
      ...ord,
      items: getItems.all(ord.id)
    }));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('getAllOrders error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving orders.' });
  }
};

// @desc    Admin: Update order status & tracking
// @route   PUT /api/orders/:id/status
const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, tracking_number } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    db.prepare(`
      UPDATE orders
      SET order_status = ?,
          tracking_number = COALESCE(?, tracking_number),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(order_status, tracking_number || null, id);

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

    res.json({
      success: true,
      message: `Order status updated to "${order_status}".`,
      data: { order: updated }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating order status.' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
