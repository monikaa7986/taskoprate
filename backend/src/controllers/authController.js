const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwt');

// @desc    Register a new user
// @route   POST /api/auth/register
const register = (req, res) => {
  try {
    const { name, email, password, phone, address, city, state, postal_code } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Insert user
    const insert = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, phone, address, city, state, postal_code)
      VALUES (?, ?, ?, 'customer', ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      name.trim(),
      email.toLowerCase().trim(),
      passwordHash,
      phone || null,
      address || null,
      city || null,
      state || null,
      postal_code || null
    );

    const newUser = db.prepare('SELECT id, name, email, role, phone, address, city, state, postal_code, country, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        user: newUser,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// @desc    Login user / admin
// @route   POST /api/auth/login
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    if (user.is_active === 0) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    // Safe user object
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      postal_code: user.postal_code,
      country: user.country,
      created_at: user.created_at
    };

    const token = generateToken(safeUser);

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
const updateProfile = (req, res) => {
  try {
    const { name, phone, address, city, state, postal_code, country } = req.body;

    const update = db.prepare(`
      UPDATE users
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          city = COALESCE(?, city),
          state = COALESCE(?, state),
          postal_code = COALESCE(?, postal_code),
          country = COALESCE(?, country),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      name ? name.trim() : null,
      phone !== undefined ? phone : null,
      address !== undefined ? address : null,
      city !== undefined ? city : null,
      state !== undefined ? state : null,
      postal_code !== undefined ? postal_code : null,
      country !== undefined ? country : null,
      req.user.id
    );

    const updatedUser = db.prepare('SELECT id, name, email, role, phone, address, city, state, postal_code, country FROM users WHERE id = ?').get(req.user.id);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
