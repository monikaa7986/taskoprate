import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS
} from './mockData';

// LocalStorage Persistence Helpers
const STORAGE_KEYS = {
  PRODUCTS: 'aangan_mock_products_v1',
  CATEGORIES: 'aangan_mock_categories_v1',
  USERS: 'aangan_mock_users_v1',
  ORDERS: 'aangan_mock_orders_v1',
  COUPONS: 'aangan_mock_coupons_v1',
  SETTINGS: 'aangan_mock_settings_v1',
  WISHLIST: 'aangan_mock_wishlist_v1',
  REVIEWS: 'aangan_mock_reviews_v1',
  CURRENT_USER: 'aangan_current_user_v1'
};

function getStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage set error:', err);
  }
}

// Initial state getters
function getProducts() { return getStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS); }
function setProducts(p) { setStorage(STORAGE_KEYS.PRODUCTS, p); }

function getCategories() { return getStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES); }
function setCategories(c) { setStorage(STORAGE_KEYS.CATEGORIES, c); }

function getUsers() { return getStorage(STORAGE_KEYS.USERS, INITIAL_USERS); }
function setUsers(u) { setStorage(STORAGE_KEYS.USERS, u); }

function getOrders() { return getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS); }
function setOrders(o) { setStorage(STORAGE_KEYS.ORDERS, o); }

function getCoupons() { return getStorage(STORAGE_KEYS.COUPONS, INITIAL_COUPONS); }
function setCoupons(c) { setStorage(STORAGE_KEYS.COUPONS, c); }

function getSettings() { return getStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS); }
function setSettings(s) { setStorage(STORAGE_KEYS.SETTINGS, s); }

function getWishlist() { return getStorage(STORAGE_KEYS.WISHLIST, [1, 7]); }
function setWishlist(w) { setStorage(STORAGE_KEYS.WISHLIST, w); }

function getReviews() {
  return getStorage(STORAGE_KEYS.REVIEWS, [
    {
      id: 1,
      product_id: 1,
      user_id: 2,
      user_name: 'Sophia Laurent',
      rating: 5,
      title: 'Exceptional Craftsmanship',
      comment: 'The drape and hand-feel of the fabric far exceeded my expectations. Arrived beautifully packaged.',
      is_approved: 1,
      created_at: '2026-03-10T10:00:00Z'
    },
    {
      id: 2,
      product_id: 6,
      user_id: 2,
      user_name: 'Sophia Laurent',
      rating: 5,
      title: 'Unbelievably Luxurious Silk',
      comment: 'Pure elegance. The bias cut conforms gracefully and feels incredible against the skin.',
      is_approved: 1,
      created_at: '2026-03-12T12:00:00Z'
    }
  ]);
}
function setReviews(r) { setStorage(STORAGE_KEYS.REVIEWS, r); }

/**
 * Main Mock API Request Interceptor
 * Replicates the Node.js / Express backend with 100% fidelity.
 */
export async function handleMockRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');
  
  let body = {};
  if (options.body) {
    body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
  }

  // Small natural simulated network delay (60ms) for realistic UX
  await new Promise(r => setTimeout(r, 60));

  // -------------------------------------------------------------
  // 1. AUTHENTICATION ENDPOINTS
  // -------------------------------------------------------------
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = body;
    const users = getUsers();
    const cleanEmail = (email || '').toLowerCase().trim();

    // Check default accounts or registered users
    let matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    // If default demo credentials
    if (!matchedUser) {
      if (cleanEmail === 'admin@atelier.com') {
        matchedUser = INITIAL_USERS[0];
      } else if (cleanEmail === 'customer@atelier.com') {
        matchedUser = INITIAL_USERS[1];
      }
    }

    if (!matchedUser) {
      const err = new Error('Invalid email address or password.');
      err.status = 401;
      throw err;
    }

    // Password validation: match 'admin123' or 'password123' or any password for registered accounts
    const isValidPass =
      (matchedUser.role === 'admin' && (password === 'admin123' || password === 'admin')) ||
      (matchedUser.role === 'customer' && (password === 'password123' || password === 'customer')) ||
      (password && password.length >= 6);

    if (!isValidPass) {
      const err = new Error('Invalid email address or password.');
      err.status = 401;
      throw err;
    }

    const token = `atelier_demo_token_${matchedUser.id}_${Date.now()}`;
    const safeUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      phone: matchedUser.phone || '',
      address: matchedUser.address || '',
      city: matchedUser.city || '',
      state: matchedUser.state || '',
      postal_code: matchedUser.postal_code || '',
      country: matchedUser.country || 'India',
      created_at: matchedUser.created_at || new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));

    return {
      success: true,
      message: 'Logged in successfully',
      data: {
        user: safeUser,
        token
      }
    };
  }

  if (path === '/auth/register' && method === 'POST') {
    const { name, email, password, phone, address, city, state, postal_code } = body;
    if (!name || !email || !password) {
      const err = new Error('Please provide name, email, and password.');
      err.status = 400;
      throw err;
    }

    const users = getUsers();
    const cleanEmail = email.toLowerCase().trim();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      const err = new Error('An account with this email address already exists.');
      err.status = 400;
      throw err;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      role: 'customer',
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      postal_code: postal_code || '',
      country: 'India',
      is_active: 1,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    setUsers(users);

    const token = `atelier_demo_token_${newUser.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    return {
      success: true,
      message: 'Account registered successfully',
      data: {
        user: newUser,
        token
      }
    };
  }

  if (path === '/auth/me' && method === 'GET') {
    const currentUser = getStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    return {
      success: true,
      data: { user: currentUser }
    };
  }

  if (path === '/auth/profile' && method === 'PUT') {
    const currentUser = getStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    const updated = { ...currentUser, ...body };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));

    const users = getUsers().map(u => u.id === updated.id ? updated : u);
    setUsers(users);

    return {
      success: true,
      message: 'Profile updated successfully',
      data: { user: updated }
    };
  }

  // -------------------------------------------------------------
  // 2. PRODUCT ENDPOINTS
  // -------------------------------------------------------------
  if (path === '/products/featured' && method === 'GET') {
    const prods = getProducts().filter(p => p.status === 'active' && p.is_featured);
    return {
      success: true,
      data: { products: prods }
    };
  }

  if (path === '/products/trending' && method === 'GET') {
    const prods = getProducts().filter(p => p.status === 'active' && p.is_trending);
    return {
      success: true,
      data: { products: prods }
    };
  }

  if (path === '/products/new-arrivals' && method === 'GET') {
    const prods = getProducts().filter(p => p.status === 'active' && p.is_new_arrival);
    return {
      success: true,
      data: { products: prods }
    };
  }

  // Related products
  const relatedMatch = path.match(/^\/products\/([^/]+)\/related$/);
  if (relatedMatch && method === 'GET') {
    const prodId = Number(relatedMatch[1]);
    const allProds = getProducts().filter(p => p.status === 'active');
    const target = allProds.find(p => p.id === prodId);
    const related = allProds.filter(p => p.id !== prodId && (!target || p.category_id === target.category_id)).slice(0, 4);
    return {
      success: true,
      data: { products: related.length ? related : allProds.slice(0, 4) }
    };
  }

  // Single Product by ID or Slug
  const singleMatch = path.match(/^\/products\/([^/]+)$/);
  if (singleMatch && method === 'GET') {
    const identifier = singleMatch[1];
    const allProds = getProducts();
    const product = allProds.find(p => p.slug === identifier || String(p.id) === String(identifier));

    if (!product) {
      const err = new Error('Product not found.');
      err.status = 404;
      throw err;
    }

    const reviews = getReviews().filter(r => r.product_id === product.id && r.is_approved);
    return {
      success: true,
      data: {
        product: {
          ...product,
          reviews
        }
      }
    };
  }

  // Product Catalog List with Filtering, Search, Sorting & Pagination
  if (path === '/products' && method === 'GET') {
    const gender = params.get('gender');
    const category = params.get('category');
    const search = params.get('search');
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    const inStock = params.get('inStock');
    const sort = params.get('sort') || 'featured';
    const page = Number(params.get('page')) || 1;
    const limit = Number(params.get('limit')) || 12;

    let filtered = getProducts().filter(p => p.status === 'active');

    if (gender && ['men', 'women', 'kids'].includes(gender.toLowerCase())) {
      filtered = filtered.filter(p => p.gender_category.toLowerCase() === gender.toLowerCase());
    }

    if (category) {
      if (!isNaN(category)) {
        filtered = filtered.filter(p => p.category_id === Number(category));
      } else {
        filtered = filtered.filter(p => p.category_slug === category);
      }
    }

    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (p.category_name && p.category_name.toLowerCase().includes(term))
      );
    }

    if (minPrice && !isNaN(minPrice)) {
      filtered = filtered.filter(p => (p.discount_price || p.price) >= Number(minPrice));
    }
    if (maxPrice && !isNaN(maxPrice)) {
      filtered = filtered.filter(p => (p.discount_price || p.price) <= Number(maxPrice));
    }

    if (inStock === 'true' || inStock === '1') {
      filtered = filtered.filter(p => p.stock > 0);
    }

    // Sort
    if (sort === 'price-asc') {
      filtered.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      success: true,
      data: {
        products: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      }
    };
  }

  // Admin Create Product
  if (path === '/products' && method === 'POST') {
    const products = getProducts();
    const newId = Date.now();
    const newProduct = {
      id: newId,
      ...body,
      stock: Number(body.stock) || 10,
      price: Number(body.price) || 99,
      discount_price: body.discount_price ? Number(body.discount_price) : null,
      rating: 5.0,
      reviews_count: 0,
      sku: body.sku || `ATL-NEW-${newId.toString().slice(-4)}`,
      slug: body.slug || (body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      primary_image: body.primary_image || (body.images && body.images[0]) || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80',
      images: body.images?.length ? body.images : ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80'],
      availableColors: body.colors || [{ name: 'Default', hex: '#111111' }],
      availableSizes: body.sizes || ['S', 'M', 'L', 'XL'],
      status: body.status || 'active'
    };

    products.unshift(newProduct);
    setProducts(products);

    return {
      success: true,
      message: 'Product created successfully',
      data: { product: newProduct }
    };
  }

  // Admin Update Product
  if (singleMatch && method === 'PUT') {
    const prodId = Number(singleMatch[1]);
    const products = getProducts();
    const idx = products.findIndex(p => p.id === prodId);

    if (idx === -1) {
      const err = new Error('Product not found.');
      err.status = 404;
      throw err;
    }

    products[idx] = { ...products[idx], ...body };
    setProducts(products);

    return {
      success: true,
      message: 'Product updated successfully',
      data: { product: products[idx] }
    };
  }

  // Admin Delete Product
  if (singleMatch && method === 'DELETE') {
    const prodId = Number(singleMatch[1]);
    const products = getProducts().filter(p => p.id !== prodId);
    setProducts(products);

    return {
      success: true,
      message: 'Product deleted successfully'
    };
  }

  // -------------------------------------------------------------
  // 3. CATEGORY ENDPOINTS
  // -------------------------------------------------------------
  if (path === '/categories' && method === 'GET') {
    const gender = params.get('gender');
    let cats = getCategories();
    if (gender && ['men', 'women', 'kids'].includes(gender.toLowerCase())) {
      cats = cats.filter(c => c.gender_category === gender.toLowerCase() || c.gender_category === 'all');
    }
    return {
      success: true,
      data: { categories: cats }
    };
  }

  const catMatch = path.match(/^\/categories\/([^/]+)$/);
  if (catMatch && method === 'GET') {
    const slug = catMatch[1];
    const cat = getCategories().find(c => c.slug === slug || String(c.id) === String(slug));
    if (!cat) {
      const err = new Error('Category not found.');
      err.status = 404;
      throw err;
    }
    return {
      success: true,
      data: { category: cat }
    };
  }

  if (path === '/categories' && method === 'POST') {
    const cats = getCategories();
    const newCat = {
      id: Date.now(),
      name: body.name,
      slug: body.slug || (body.name || 'cat').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: body.description || '',
      image_url: body.image_url || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
      gender_category: body.gender_category || 'all',
      display_order: cats.length + 1
    };
    cats.push(newCat);
    setCategories(cats);
    return { success: true, message: 'Category created', data: { category: newCat } };
  }

  const catIdMatch = path.match(/^\/categories\/(\d+)$/);
  if (catIdMatch && method === 'PUT') {
    const id = Number(catIdMatch[1]);
    const cats = getCategories();
    const idx = cats.findIndex(c => c.id === id);
    if (idx !== -1) {
      cats[idx] = { ...cats[idx], ...body };
      setCategories(cats);
    }
    return { success: true, message: 'Category updated', data: { category: cats[idx] } };
  }

  if (catIdMatch && method === 'DELETE') {
    const id = Number(catIdMatch[1]);
    const cats = getCategories().filter(c => c.id !== id);
    setCategories(cats);
    return { success: true, message: 'Category deleted' };
  }

  // -------------------------------------------------------------
  // 4. ADMIN DASHBOARD & MANAGEMENT ENDPOINTS
  // -------------------------------------------------------------
  if (path === '/admin/dashboard' && method === 'GET') {
    const products = getProducts();
    const orders = getOrders();
    const users = getUsers();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === 'paid' ? o.total : 0), 0);
    const lowStockProducts = products.filter(p => p.stock < 15).slice(0, 6);

    const orderStatusBreakdown = [
      { order_status: 'Delivered', count: orders.filter(o => o.order_status === 'Delivered').length },
      { order_status: 'Processing', count: orders.filter(o => o.order_status === 'Processing').length },
      { order_status: 'Shipped', count: orders.filter(o => o.order_status === 'Shipped').length },
      { order_status: 'Confirmed', count: orders.filter(o => o.order_status === 'Confirmed').length }
    ];

    const categoryDistribution = getCategories().map(c => ({
      name: c.name,
      product_count: products.filter(p => p.category_id === c.id).length
    }));

    const monthlySales = [
      { month: '2026-01', revenue: 14200, orders_count: 58 },
      { month: '2026-02', revenue: 18950, orders_count: 74 },
      { month: '2026-03', revenue: 24850, orders_count: 92 }
    ];

    return {
      success: true,
      data: {
        metrics: {
          totalProducts: products.length,
          totalOrders: orders.length + 181,
          totalCustomers: users.filter(u => u.role === 'customer').length + 1238,
          totalRevenue: Number((totalRevenue + 24850).toFixed(2)),
          lowStockCount: products.filter(p => p.stock < 15).length
        },
        recentOrders: orders.slice(0, 6),
        lowStockProducts,
        orderStatusBreakdown,
        categoryDistribution,
        monthlySales
      }
    };
  }

  if (path === '/admin/customers' && method === 'GET') {
    const search = params.get('search')?.toLowerCase();
    let customers = getUsers().filter(u => u.role === 'customer');
    if (search) {
      customers = customers.filter(c => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search));
    }
    return {
      success: true,
      data: { customers }
    };
  }

  const custStatusMatch = path.match(/^\/admin\/customers\/(\d+)\/status$/);
  if (custStatusMatch && method === 'PUT') {
    const custId = Number(custStatusMatch[1]);
    const users = getUsers();
    const customer = users.find(u => u.id === custId);
    if (customer) {
      customer.is_active = customer.is_active === 1 ? 0 : 1;
      setUsers(users);
    }
    return {
      success: true,
      data: { customer }
    };
  }

  if (path === '/admin/inventory' && method === 'GET') {
    const products = getProducts();
    return {
      success: true,
      data: { products, total: products.length }
    };
  }

  const invStockMatch = path.match(/^\/admin\/inventory\/(\d+)\/stock$/);
  if (invStockMatch && method === 'PUT') {
    const prodId = Number(invStockMatch[1]);
    const products = getProducts();
    const product = products.find(p => p.id === prodId);
    if (product) {
      product.stock = Number(body.stock) || 0;
      setProducts(products);
    }
    return {
      success: true,
      message: 'Stock updated successfully',
      data: { product }
    };
  }

  if (path === '/admin/settings' && method === 'GET') {
    return {
      success: true,
      data: { settings: getSettings() }
    };
  }

  if (path === '/admin/settings' && method === 'PUT') {
    const updated = { ...getSettings(), ...body };
    setSettings(updated);
    return {
      success: true,
      message: 'Store settings updated successfully',
      data: { settings: updated }
    };
  }

  // -------------------------------------------------------------
  // 5. ORDERS & CHECKOUT ENDPOINTS
  // -------------------------------------------------------------
  if (path === '/orders' && method === 'POST') {
    const orders = getOrders();
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: Date.now(),
      order_number: orderNumber,
      user_id: body.user_id || 2,
      customer_name: body.customer_name || 'Customer Patron',
      customer_email: body.customer_email || 'patron@example.com',
      customer_phone: body.customer_phone || '+1 (555) 000-0000',
      shipping_address: body.shipping_address || 'Suite 4B',
      city: body.city || 'New York',
      state: body.state || 'NY',
      postal_code: body.postal_code || '10001',
      country: body.country || 'India',
      subtotal: Number(body.subtotal) || 0,
      discount: Number(body.discount) || 0,
      shipping_fee: Number(body.shipping_fee) || 0,
      tax: Number(body.tax) || 0,
      total: Number(body.total) || 0,
      coupon_code: body.coupon_code || null,
      payment_method: body.payment_method || 'credit_card',
      payment_status: 'paid',
      order_status: 'Confirmed',
      tracking_number: `AAN-${Math.floor(100000000 + Math.random() * 900000000)}`,
      created_at: new Date().toISOString(),
      items: body.items || []
    };

    orders.unshift(newOrder);
    setOrders(orders);

    return {
      success: true,
      message: 'Order placed successfully',
      data: { order: newOrder }
    };
  }

  if (path === '/orders/my' && method === 'GET') {
    const currentUser = getStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[1]);
    const orders = getOrders().filter(o => o.user_id === currentUser.id || o.customer_email === currentUser.email);
    return {
      success: true,
      data: { orders: orders.length ? orders : getOrders() }
    };
  }

  if (path === '/orders' && method === 'GET') {
    let orders = getOrders();
    const status = params.get('status');
    const search = params.get('search')?.toLowerCase();
    if (status && status !== 'all') {
      orders = orders.filter(o => o.order_status?.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      orders = orders.filter(o =>
        o.order_number?.toLowerCase().includes(search) ||
        o.customer_name?.toLowerCase().includes(search) ||
        o.customer_email?.toLowerCase().includes(search)
      );
    }
    return {
      success: true,
      data: { orders, total: orders.length }
    };
  }

  const orderMatch = path.match(/^\/orders\/([^/]+)$/);
  if (orderMatch && method === 'GET') {
    const identifier = orderMatch[1];
    const order = getOrders().find(o => o.order_number === identifier || String(o.id) === String(identifier));
    if (!order) {
      const err = new Error('Order not found.');
      err.status = 404;
      throw err;
    }
    return {
      success: true,
      data: { order }
    };
  }

  const orderStatusMatch = path.match(/^\/orders\/(\d+)\/status$/);
  if (orderStatusMatch && method === 'PUT') {
    const orderId = Number(orderStatusMatch[1]);
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.order_status = body.order_status || body.status || order.order_status;
      if (body.tracking_number !== undefined) {
        order.tracking_number = body.tracking_number;
      }
      setOrders(orders);
    }
    return {
      success: true,
      data: { order }
    };
  }

  // -------------------------------------------------------------
  // 6. COUPON ENDPOINTS
  // -------------------------------------------------------------
  if (path === '/coupons/validate' && method === 'POST') {
    const { code, subtotal } = body;
    const cleanCode = (code || '').toUpperCase().trim();
    const coupons = getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.is_active);

    if (!coupon) {
      const err = new Error('Invalid or expired coupon code.');
      err.status = 400;
      throw err;
    }

    if (subtotal && subtotal < coupon.min_order_amount) {
      const err = new Error(`Order minimum of $${coupon.min_order_amount} required for this coupon.`);
      err.status = 400;
      throw err;
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (subtotal * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    return {
      success: true,
      data: {
        coupon: {
          ...coupon,
          discount_amount: Number(discountAmount.toFixed(2))
        }
      }
    };
  }

  if (path === '/coupons' && method === 'POST') {
    const coupons = getCoupons();
    const newCoupon = {
      id: Date.now(),
      code: (body.code || 'SALE10').toUpperCase().trim(),
      description: body.description || '',
      discount_type: body.discount_type || 'percentage',
      discount_value: Number(body.discount_value) || 10,
      min_order_amount: Number(body.min_order_amount) || 0,
      max_discount_amount: body.max_discount_amount ? Number(body.max_discount_amount) : null,
      is_active: 1
    };
    coupons.unshift(newCoupon);
    setCoupons(coupons);
    return { success: true, message: 'Coupon created', data: { coupon: newCoupon } };
  }

  const coupIdMatch = path.match(/^\/coupons\/(\d+)$/);
  if (coupIdMatch && method === 'PUT') {
    const id = Number(coupIdMatch[1]);
    const coupons = getCoupons();
    const idx = coupons.findIndex(c => c.id === id);
    if (idx !== -1) {
      coupons[idx] = { ...coupons[idx], ...body };
      setCoupons(coupons);
    }
    return { success: true, message: 'Coupon updated', data: { coupon: coupons[idx] } };
  }

  if (coupIdMatch && method === 'DELETE') {
    const id = Number(coupIdMatch[1]);
    const coupons = getCoupons().filter(c => c.id !== id);
    setCoupons(coupons);
    return { success: true, message: 'Coupon deleted' };
  }

  if (path === '/coupons' && method === 'GET') {
    return {
      success: true,
      data: { coupons: getCoupons() }
    };
  }

  // -------------------------------------------------------------
  // 7. WISHLIST ENDPOINTS
  // -------------------------------------------------------------
  if (path === '/wishlist' && method === 'GET') {
    const list = getWishlist();
    const prods = getProducts().filter(p => list.includes(p.id));
    return {
      success: true,
      data: { wishlist: prods }
    };
  }

  const wishMatch = path.match(/^\/wishlist\/(\d+)$/);
  if (wishMatch && method === 'POST') {
    const prodId = Number(wishMatch[1]);
    const list = getWishlist();
    if (!list.includes(prodId)) {
      list.push(prodId);
      setWishlist(list);
    }
    return {
      success: true,
      message: 'Item added to wishlist'
    };
  }

  if (wishMatch && method === 'DELETE') {
    const prodId = Number(wishMatch[1]);
    const list = getWishlist().filter(id => id !== prodId);
    setWishlist(list);
    return {
      success: true,
      message: 'Item removed from wishlist'
    };
  }

  // -------------------------------------------------------------
  // 8. REVIEWS ENDPOINTS
  // -------------------------------------------------------------
  const revProdMatch = path.match(/^\/reviews\/product\/(\d+)$/);
  if (revProdMatch && method === 'GET') {
    const prodId = Number(revProdMatch[1]);
    const reviews = getReviews().filter(r => r.product_id === prodId && r.is_approved);
    return {
      success: true,
      data: { reviews }
    };
  }

  if (revProdMatch && method === 'POST') {
    const prodId = Number(revProdMatch[1]);
    const reviews = getReviews();
    const newReview = {
      id: Date.now(),
      product_id: prodId,
      user_name: body.user_name || 'Connoisseur',
      rating: Number(body.rating) || 5,
      title: body.title || 'Great Quality',
      comment: body.comment || '',
      is_approved: 1,
      created_at: new Date().toISOString()
    };
    reviews.unshift(newReview);
    setReviews(reviews);

    return {
      success: true,
      message: 'Review submitted successfully',
      data: { review: newReview }
    };
  }

  if (path === '/reviews' && method === 'GET') {
    return {
      success: true,
      data: { reviews: getReviews() }
    };
  }

  const revApproveMatch = path.match(/^\/reviews\/(\d+)\/approve$/);
  if (revApproveMatch && method === 'PUT') {
    const id = Number(revApproveMatch[1]);
    const reviews = getReviews();
    const rev = reviews.find(r => r.id === id);
    if (rev) {
      rev.is_approved = rev.is_approved ? 0 : 1;
      setReviews(reviews);
    }
    return { success: true, data: { review: rev } };
  }

  const revIdMatch = path.match(/^\/reviews\/(\d+)$/);
  if (revIdMatch && method === 'DELETE') {
    const id = Number(revIdMatch[1]);
    const reviews = getReviews().filter(r => r.id !== id);
    setReviews(reviews);
    return { success: true, message: 'Review deleted' };
  }

  // Fallback default response
  return {
    success: true,
    data: {}
  };
}
