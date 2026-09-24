const db = require('../config/db');

// @desc    Get all categories with product count
// @route   GET /api/categories
const getCategories = (req, res) => {
  try {
    const { gender } = req.query;
    let query = `
      SELECT c.*, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.status = 'active'
    `;
    const params = [];

    if (gender) {
      query += ` WHERE c.gender_category = ? OR c.gender_category = 'all'`;
      params.push(gender.toLowerCase());
    }

    query += ` GROUP BY c.id ORDER BY c.display_order ASC, c.name ASC`;

    const categories = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving categories.' });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
const getCategoryBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const category = db.prepare(`
      SELECT c.*, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.status = 'active'
      WHERE c.slug = ?
      GROUP BY c.id
    `).get(slug);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving category.' });
  }
};

// @desc    Admin: Create category
// @route   POST /api/categories
const createCategory = (req, res) => {
  try {
    const { name, description, image_url, gender_category = 'all', display_order = 0 } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const result = db.prepare(`
      INSERT INTO categories (name, slug, description, image_url, gender_category, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, slug, description || '', image_url || '', gender_category, display_order);

    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category: newCategory }
    });
  } catch (error) {
    console.error('createCategory error:', error);
    res.status(500).json({ success: false, message: 'Server error creating category: ' + error.message });
  }
};

// @desc    Admin: Update category
// @route   PUT /api/categories/:id
const updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, gender_category, display_order } = req.body;

    const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    db.prepare(`
      UPDATE categories
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          image_url = COALESCE(?, image_url),
          gender_category = COALESCE(?, gender_category),
          display_order = COALESCE(?, display_order)
      WHERE id = ?
    `).run(
      name || null,
      description !== undefined ? description : null,
      image_url !== undefined ? image_url : null,
      gender_category || null,
      display_order !== undefined ? display_order : null,
      id
    );

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category: updated }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating category.' });
  }
};

// @desc    Admin: Delete category
// @route   DELETE /api/categories/:id
const deleteCategory = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id, name FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);

    res.json({
      success: true,
      message: `Category "${existing.name}" deleted successfully.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting category.' });
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
