const db = require('../config/db');

// Helper to attach images & variants to product list or single product
function attachProductDetails(product) {
  if (!product) return null;

  const images = db.prepare('SELECT id, image_url, is_primary, display_order FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC').all(product.id);
  const variants = db.prepare('SELECT id, size, color_name, color_hex, stock, sku FROM product_variants WHERE product_id = ?').all(product.id);

  // Group sizes and colors
  const availableSizes = [...new Set(variants.map(v => v.size))];
  const availableColors = [];
  const seenColor = new Set();
  for (const v of variants) {
    if (!seenColor.has(v.color_name)) {
      seenColor.add(v.color_name);
      availableColors.push({ name: v.color_name, hex: v.color_hex });
    }
  }

  return {
    ...product,
    primary_image: images.length > 0 ? images[0].image_url : null,
    images: images.map(img => img.image_url),
    variants,
    availableSizes,
    availableColors
  };
}

// @desc    Get products with filters, sorting, search & pagination
// @route   GET /api/products
const getProducts = (req, res) => {
  try {
    const {
      gender,
      category,
      search,
      minPrice,
      maxPrice,
      size,
      color,
      rating,
      inStock,
      sort = 'featured',
      page = 1,
      limit = 12
    } = req.query;

    let query = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) AS primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
    `;
    const params = [];

    // Filter by gender category
    if (gender && ['men', 'women', 'kids'].includes(gender.toLowerCase())) {
      query += ` AND p.gender_category = ?`;
      params.push(gender.toLowerCase());
    }

    // Filter by category slug or id
    if (category) {
      if (!isNaN(category)) {
        query += ` AND p.category_id = ?`;
        params.push(Number(category));
      } else {
        query += ` AND c.slug = ?`;
        params.push(category);
      }
    }

    // Keyword search
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Price filters
    if (minPrice && !isNaN(minPrice)) {
      query += ` AND COALESCE(p.discount_price, p.price) >= ?`;
      params.push(Number(minPrice));
    }
    if (maxPrice && !isNaN(maxPrice)) {
      query += ` AND COALESCE(p.discount_price, p.price) <= ?`;
      params.push(Number(maxPrice));
    }

    // In Stock
    if (inStock === 'true' || inStock === '1') {
      query += ` AND p.stock > 0`;
    }

    // Rating
    if (rating && !isNaN(rating)) {
      query += ` AND p.rating >= ?`;
      params.push(Number(rating));
    }

    // Size filter via variants subquery
    if (size) {
      query += ` AND EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.size = ?)`;
      params.push(size);
    }

    // Color filter via variants subquery
    if (color) {
      query += ` AND EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND LOWER(pv.color_name) = LOWER(?))`;
      params.push(color);
    }

    // Sorting
    switch (sort) {
      case 'newest':
        query += ` ORDER BY p.created_at DESC`;
        break;
      case 'price-asc':
        query += ` ORDER BY COALESCE(p.discount_price, p.price) ASC`;
        break;
      case 'price-desc':
        query += ` ORDER BY COALESCE(p.discount_price, p.price) DESC`;
        break;
      case 'rating':
        query += ` ORDER BY p.rating DESC, p.reviews_count DESC`;
        break;
      case 'featured':
      default:
        query += ` ORDER BY p.is_featured DESC, p.id DESC`;
        break;
    }

    // Count total before pagination
    const countQuery = `SELECT COUNT(*) AS total FROM (${query})`;
    const countRow = db.prepare(countQuery).get(...params);
    const total = countRow ? countRow.total : 0;

    // Apply pagination
    const offset = (Number(page) - 1) * Number(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), offset);

    const rows = db.prepare(query).all(...params);

    // Attach basic variants info for quick card swatch display
    const products = rows.map(p => {
      const variants = db.prepare('SELECT size, color_name, color_hex FROM product_variants WHERE product_id = ?').all(p.id);
      const availableSizes = [...new Set(variants.map(v => v.size))];
      const seenColor = new Set();
      const availableColors = [];
      for (const v of variants) {
        if (!seenColor.has(v.color_name)) {
          seenColor.add(v.color_name);
          availableColors.push({ name: v.color_name, hex: v.color_hex });
        }
      }
      return {
        ...p,
        availableSizes,
        availableColors
      };
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving products.' });
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:identifier
const getProductByIdOrSlug = (req, res) => {
  try {
    const { identifier } = req.params;
    let product;

    if (!isNaN(identifier)) {
      product = db.prepare(`
        SELECT p.*, c.name AS category_name, c.slug AS category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `).get(Number(identifier));
    } else {
      product = db.prepare(`
        SELECT p.*, c.name AS category_name, c.slug AS category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.slug = ?
      `).get(identifier);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const detailed = attachProductDetails(product);

    // Also get reviews
    const reviews = db.prepare(`
      SELECT r.*, u.name AS reviewer_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.is_approved = 1
      ORDER BY r.created_at DESC
    `).all(product.id);

    res.json({
      success: true,
      data: {
        product: {
          ...detailed,
          reviews
        }
      }
    });
  } catch (error) {
    console.error('getProductByIdOrSlug error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving product.' });
  }
};

// @desc    Get Featured Products
// @route   GET /api/products/featured
const getFeaturedProducts = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT p.*, c.name AS category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) AS primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active' AND p.is_featured = 1
      ORDER BY p.id DESC
      LIMIT 8
    `).all();

    res.json({ success: true, data: { products: rows } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving featured products.' });
  }
};

// @desc    Get Trending Products
// @route   GET /api/products/trending
const getTrendingProducts = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT p.*, c.name AS category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) AS primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active' AND p.is_trending = 1
      ORDER BY p.rating DESC, p.reviews_count DESC
      LIMIT 8
    `).all();

    res.json({ success: true, data: { products: rows } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving trending products.' });
  }
};

// @desc    Get New Arrivals
// @route   GET /api/products/new-arrivals
const getNewArrivals = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT p.*, c.name AS category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) AS primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active' AND p.is_new_arrival = 1
      ORDER BY p.created_at DESC
      LIMIT 8
    `).all();

    res.json({ success: true, data: { products: rows } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving new arrivals.' });
  }
};

// @desc    Get Related Products
// @route   GET /api/products/:id/related
const getRelatedProducts = (req, res) => {
  try {
    const { id } = req.params;
    const current = db.prepare('SELECT category_id, gender_category FROM products WHERE id = ?').get(id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const rows = db.prepare(`
      SELECT p.*, c.name AS category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) AS primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active' AND p.id != ? AND (p.category_id = ? OR p.gender_category = ?)
      ORDER BY RANDOM()
      LIMIT 4
    `).all(id, current.category_id, current.gender_category);

    res.json({ success: true, data: { products: rows } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving related products.' });
  }
};

// --- ADMIN PRODUCT ACTIONS ---

// @desc    Admin: Create a new product
// @route   POST /api/products
const createProduct = (req, res) => {
  const insertProductTx = db.transaction((body) => {
    const {
      name,
      description,
      category_id,
      gender_category,
      price,
      discount_price,
      stock = 0,
      sku,
      status = 'active',
      is_featured = 0,
      is_trending = 0,
      is_new_arrival = 0,
      fabric_details,
      care_instructions,
      images = [],
      sizes = [],
      colors = []
    } = body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
    const finalSku = sku || `ATL-${gender_category.charAt(0).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const pResult = db.prepare(`
      INSERT INTO products (
        category_id, gender_category, name, slug, description,
        fabric_details, care_instructions, price, discount_price, stock,
        sku, status, is_featured, is_trending, is_new_arrival, rating, reviews_count
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0)
    `).run(
      category_id || null,
      gender_category || 'men',
      name,
      slug,
      description || '',
      fabric_details || 'Premium sustainable cotton blend',
      care_instructions || 'Machine wash delicate or dry clean',
      Number(price),
      discount_price ? Number(discount_price) : null,
      Number(stock),
      finalSku,
      status,
      is_featured ? 1 : 0,
      is_trending ? 1 : 0,
      is_new_arrival ? 1 : 0
    );

    const productId = pResult.lastInsertRowid;

    // Insert Images
    if (Array.isArray(images) && images.length > 0) {
      const insertImg = db.prepare('INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)');
      images.forEach((url, idx) => {
        if (url && url.trim()) {
          insertImg.run(productId, url.trim(), idx === 0 ? 1 : 0, idx);
        }
      });
    }

    // Insert Variants
    const insertVar = db.prepare('INSERT INTO product_variants (product_id, size, color_name, color_hex, stock, sku) VALUES (?, ?, ?, ?, ?, ?)');
    if (sizes.length > 0 && colors.length > 0) {
      for (const col of colors) {
        const cName = typeof col === 'object' ? col.name : col;
        const cHex = typeof col === 'object' ? col.hex : '#222222';
        for (const sz of sizes) {
          insertVar.run(productId, sz, cName, cHex, Math.floor(stock / (sizes.length * colors.length)) || 5, `${finalSku}-${sz}`);
        }
      }
    } else {
      // Default variant
      insertVar.run(productId, 'M', 'Default', '#111111', stock, `${finalSku}-M`);
    }

    return productId;
  });

  try {
    const { name, price, gender_category } = req.body;
    if (!name || !price || !gender_category) {
      return res.status(400).json({ success: false, message: 'Product name, price, and gender category are required.' });
    }

    const productId = insertProductTx(req.body);
    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: attachProductDetails(newProduct) }
    });
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ success: false, message: 'Server error creating product: ' + error.message });
  }
};

// @desc    Admin: Update product
// @route   PUT /api/products/:id
const updateProduct = (req, res) => {
  const updateProductTx = db.transaction((id, body) => {
    const {
      name,
      description,
      category_id,
      gender_category,
      price,
      discount_price,
      stock,
      sku,
      status,
      is_featured,
      is_trending,
      is_new_arrival,
      fabric_details,
      care_instructions,
      images,
      sizes,
      colors
    } = body;

    db.prepare(`
      UPDATE products
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          category_id = COALESCE(?, category_id),
          gender_category = COALESCE(?, gender_category),
          price = COALESCE(?, price),
          discount_price = ?,
          stock = COALESCE(?, stock),
          sku = COALESCE(?, sku),
          status = COALESCE(?, status),
          is_featured = COALESCE(?, is_featured),
          is_trending = COALESCE(?, is_trending),
          is_new_arrival = COALESCE(?, is_new_arrival),
          fabric_details = COALESCE(?, fabric_details),
          care_instructions = COALESCE(?, care_instructions),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name || null,
      description || null,
      category_id ? Number(category_id) : null,
      gender_category || null,
      price !== undefined ? Number(price) : null,
      discount_price !== undefined ? (discount_price ? Number(discount_price) : null) : null,
      stock !== undefined ? Number(stock) : null,
      sku || null,
      status || null,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      is_trending !== undefined ? (is_trending ? 1 : 0) : null,
      is_new_arrival !== undefined ? (is_new_arrival ? 1 : 0) : null,
      fabric_details || null,
      care_instructions || null,
      id
    );

    // Update images if provided
    if (Array.isArray(images) && images.length > 0) {
      db.prepare('DELETE FROM product_images WHERE product_id = ?').run(id);
      const insertImg = db.prepare('INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)');
      images.forEach((url, idx) => {
        if (url && url.trim()) {
          insertImg.run(id, url.trim(), idx === 0 ? 1 : 0, idx);
        }
      });
    }

    // Update variants if provided
    if (Array.isArray(sizes) && Array.isArray(colors) && sizes.length > 0 && colors.length > 0) {
      db.prepare('DELETE FROM product_variants WHERE product_id = ?').run(id);
      const insertVar = db.prepare('INSERT INTO product_variants (product_id, size, color_name, color_hex, stock, sku) VALUES (?, ?, ?, ?, ?, ?)');
      const currentSku = sku || 'ATL-SKU';
      for (const col of colors) {
        const cName = typeof col === 'object' ? col.name : col;
        const cHex = typeof col === 'object' ? col.hex : '#222222';
        for (const sz of sizes) {
          insertVar.run(id, sz, cName, cHex, 10, `${currentSku}-${sz}`);
        }
      }
    }
  });

  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    updateProductTx(id, req.body);
    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: attachProductDetails(updated) }
    });
  } catch (error) {
    console.error('updateProduct error:', error);
    res.status(500).json({ success: false, message: 'Server error updating product: ' + error.message });
  }
};

// @desc    Admin: Delete product
// @route   DELETE /api/products/:id
const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id, name FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    res.json({
      success: true,
      message: `Product "${existing.name}" deleted successfully.`
    });
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting product.' });
  }
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
