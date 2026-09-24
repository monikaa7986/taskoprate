const bcrypt = require('bcryptjs');
const db = require('../src/config/db');

async function seedDatabase() {
  console.log('--- Starting Database Seeding ---');

  // Clear existing data in reverse order of foreign key dependencies
  db.exec(`
    DELETE FROM wishlist;
    DELETE FROM reviews;
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM coupons;
    DELETE FROM product_variants;
    DELETE FROM product_images;
    DELETE FROM products;
    DELETE FROM categories;
    DELETE FROM users;
    DELETE FROM store_settings;
  `);

  // 1. Store Settings
  const insertSetting = db.prepare(`INSERT INTO store_settings (setting_key, setting_value) VALUES (?, ?)`);
  insertSetting.run('store_name', 'ATELIER & CO.');
  insertSetting.run('store_tagline', 'Contemporary Elegance & Timeless Wardrobe Essentials');
  insertSetting.run('currency_symbol', '$');
  insertSetting.run('tax_rate_percent', '8.5');
  insertSetting.run('free_shipping_threshold', '150');
  insertSetting.run('standard_shipping_rate', '12.00');
  insertSetting.run('support_email', 'concierge@atelierclothing.com');
  insertSetting.run('support_phone', '+1 (800) 492-8350');

  // 2. Users
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);
  const customerPasswordHash = bcrypt.hashSync('password123', salt);

  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, phone, address, city, state, postal_code, country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const adminResult = insertUser.run(
    'Alexandre Vance',
    'admin@atelier.com',
    adminPasswordHash,
    'admin',
    '+1 (555) 019-2834',
    '740 Fifth Avenue, Floor 18',
    'New York',
    'NY',
    '10019',
    'United States'
  );

  const customerResult = insertUser.run(
    'Sophia Laurent',
    'customer@atelier.com',
    customerPasswordHash,
    'customer',
    '+1 (555) 782-9901',
    '124 Mercer Street, Loft 4A',
    'New York',
    'NY',
    '10012',
    'United States'
  );

  const customer2Result = insertUser.run(
    'Marcus Sterling',
    'marcus@example.com',
    customerPasswordHash,
    'customer',
    '+1 (555) 438-2199',
    '88 Commonwealth Ave',
    'Boston',
    'MA',
    '02116',
    'United States'
  );

  // 3. Categories
  const insertCat = db.prepare(`
    INSERT INTO categories (name, slug, description, image_url, gender_category, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const catMenJackets = insertCat.run(
    'Tailored Outerwear & Blazers',
    'mens-outerwear',
    'Impeccably tailored coats, wool overcoats, and modern unstructured blazers.',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
    'men',
    1
  ).lastInsertRowid;

  const catMenShirts = insertCat.run(
    'Artisanal Shirts & Knits',
    'mens-shirts-knits',
    'Supima cotton shirts, relaxed linen tops, and fine merino knits.',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    'men',
    2
  ).lastInsertRowid;

  const catMenTrousers = insertCat.run(
    'Trousers & Chinos',
    'mens-trousers',
    'Pleated wool trousers, refined tapered chinos, and premium selvedge denim.',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    'men',
    3
  ).lastInsertRowid;

  const catWomenDresses = insertCat.run(
    'Evening & Day Dresses',
    'womens-dresses',
    'Fluid silk slips, tailored midi dresses, and statement evening silhouettes.',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    'women',
    4
  ).lastInsertRowid;

  const catWomenCoats = insertCat.run(
    'Coats & Blazers',
    'womens-coats-blazers',
    'Double-breasted wool-cashmere coats, sculpted blazers, and trench coats.',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    'women',
    5
  ).lastInsertRowid;

  const catWomenTops = insertCat.run(
    'Silk Tops & Cashmere',
    'womens-tops-cashmere',
    'Pure mulberry silk blouses, ribbed knit polos, and featherlight turtlenecks.',
    'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80',
    'women',
    6
  ).lastInsertRowid;

  const catKidsBoys = insertCat.run(
    'Boys Collection',
    'kids-boys',
    'Durable cotton jackets, cozy waffle henleys, and comfortable stretch chinos.',
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
    'kids',
    7
  ).lastInsertRowid;

  const catKidsGirls = insertCat.run(
    'Girls Collection',
    'kids-girls',
    'Whimsical floral twirl dresses, organic knit cardigans, and embroidered sets.',
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    'kids',
    8
  ).lastInsertRowid;

  // 4. Products
  const insertProduct = db.prepare(`
    INSERT INTO products (
      category_id, gender_category, name, slug, description,
      fabric_details, care_instructions, price, discount_price, stock,
      sku, status, is_featured, is_trending, is_new_arrival, rating, reviews_count
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertImage = db.prepare(`
    INSERT INTO product_images (product_id, image_url, is_primary, display_order)
    VALUES (?, ?, ?, ?)
  `);

  const insertVariant = db.prepare(`
    INSERT INTO product_variants (product_id, size, color_name, color_hex, stock, sku)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertReview = db.prepare(`
    INSERT INTO reviews (product_id, user_id, user_name, rating, title, comment, is_approved)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Product Data Definitions
  const productsData = [
    // --- MEN'S PRODUCTS ---
    {
      category_id: catMenJackets,
      gender: 'men',
      name: 'Double-Breasted Wool Overcoat',
      slug: 'mens-double-breasted-wool-overcoat',
      description: 'Crafted from Italian melton wool with a structured shoulder and relaxed tailored cut. Features horn buttons, a satin interior lining, and deep welt pockets designed to withstand cold metropolitan winters.',
      fabric: '90% Virgin Wool, 10% Cashmere. Interior: 100% Cupro lining.',
      care: 'Specialist dry clean only. Cool iron over pressing cloth.',
      price: 345.00,
      discount_price: 295.00,
      stock: 35,
      sku: 'ATL-M-OVR-01',
      featured: 1,
      trending: 1,
      new_arrival: 0,
      rating: 4.9,
      reviews_count: 14,
      images: [
        'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Camel Tan', hex: '#c19a6b' },
        { name: 'Charcoal Grey', hex: '#374151' },
        { name: 'Midnight Navy', hex: '#1e293b' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      category_id: catMenJackets,
      gender: 'men',
      name: 'Modern Unstructured Linen Blazer',
      slug: 'mens-unstructured-linen-blazer',
      description: 'The epitome of warm-weather sophistication. Breathable European flax linen woven with subtle texture. Finished with soft natural shoulders and patch pockets for an effortless silhouette.',
      fabric: '100% Pure European Linen. Unlined body for maximum breathability.',
      care: 'Dry clean recommended or gentle cold hand wash.',
      price: 220.00,
      discount_price: null,
      stock: 42,
      sku: 'ATL-M-BLZ-02',
      featured: 1,
      trending: 0,
      new_arrival: 1,
      rating: 4.8,
      reviews_count: 9,
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Oatmeal Ivory', hex: '#e8e2d5' },
        { name: 'French Navy', hex: '#1d3557' },
        { name: 'Sage Moss', hex: '#606c38' }
      ],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      category_id: catMenShirts,
      gender: 'men',
      name: 'Supima Cotton Oxford Button-Down',
      slug: 'mens-supima-oxford-button-down',
      description: 'An indispensable pillar of menswear. Spun from American long-staple Supima cotton for unparalleled durability and soft tactile drape. Features an authentic 3.25-inch collar roll and genuine mother-of-pearl buttons.',
      fabric: '100% American Long-Staple Supima Cotton.',
      care: 'Machine wash warm with like colors. Tumble dry low or hang dry.',
      price: 95.00,
      discount_price: 79.00,
      stock: 80,
      sku: 'ATL-M-SHT-03',
      featured: 0,
      trending: 1,
      new_arrival: 1,
      rating: 4.9,
      reviews_count: 28,
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Crisp White', hex: '#ffffff' },
        { name: 'Sky Chambray', hex: '#93c5fd' },
        { name: 'Pale Pink', hex: '#fbcfe8' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    {
      category_id: catMenShirts,
      gender: 'men',
      name: 'Fine Gauge Merino Crewneck',
      slug: 'mens-fine-gauge-merino-crewneck',
      description: 'Spun from extra-fine 19.5 micron Australian merino wool. Ultra-lightweight yet naturally thermoregulating and odor-resistant. Wear next-to-skin or layered over a collared shirt.',
      fabric: '100% Extra-Fine Merino Wool.',
      care: 'Hand wash cold with wool detergent. Dry flat.',
      price: 135.00,
      discount_price: null,
      stock: 55,
      sku: 'ATL-M-KNT-04',
      featured: 1,
      trending: 0,
      new_arrival: 0,
      rating: 4.7,
      reviews_count: 12,
      images: [
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Espresso Brown', hex: '#3e2723' },
        { name: 'Heather Grey', hex: '#9e9e9e' },
        { name: 'Forest Green', hex: '#2e7d32' }
      ],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      category_id: catMenTrousers,
      gender: 'men',
      name: 'Pleated Wool Flannel Trouser',
      slug: 'mens-pleated-wool-flannel-trouser',
      description: 'Contemporary single forward pleat trouser cut with a subtle taper. Designed with side adjusters to eliminate the need for a belt, delivering an uninterrupted waistline.',
      fabric: '100% Wool Flannel woven in Biella, Italy.',
      care: 'Dry clean only.',
      price: 185.00,
      discount_price: 155.00,
      stock: 40,
      sku: 'ATL-M-TRS-05',
      featured: 0,
      trending: 1,
      new_arrival: 0,
      rating: 4.8,
      reviews_count: 16,
      images: [
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Charcoal Melange', hex: '#424242' },
        { name: 'Warm Taupe', hex: '#8d6e63' },
        { name: 'Dark Navy', hex: '#0d1b2a' }
      ],
      sizes: ['30', '32', '34', '36', '38']
    },

    // --- WOMEN'S PRODUCTS ---
    {
      category_id: catWomenDresses,
      gender: 'women',
      name: 'Mulberry Silk Bias-Cut Slip Dress',
      slug: 'womens-mulberry-silk-slip-dress',
      description: 'Lustrous heavyweight 22 momme silk charmeuse cut diagonally along the grain to hug the natural contours of the body. Delicate adjustable cross-back straps and a soft cowl neckline.',
      fabric: '100% Grade 6A Mulberry Silk.',
      care: 'Hand wash cold inside out with silk detergent or dry clean.',
      price: 240.00,
      discount_price: 198.00,
      stock: 28,
      sku: 'ATL-W-DRS-01',
      featured: 1,
      trending: 1,
      new_arrival: 0,
      rating: 5.0,
      reviews_count: 32,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Champagne Gold', hex: '#f7e7ce' },
        { name: 'Emerald Velvet', hex: '#046307' },
        { name: 'Onyx Black', hex: '#111111' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    {
      category_id: catWomenCoats,
      gender: 'women',
      name: 'Cashmere-Blend Belted Wrap Coat',
      slug: 'womens-cashmere-wrap-coat',
      description: 'Hand-finished double-faced wool and Mongolian cashmere. Oversized notch lapels, generous patch pockets, and a self-tie sash belt that defines the waist with regal grace.',
      fabric: '70% Wool, 30% Mongolian Cashmere.',
      care: 'Professional dry clean only.',
      price: 460.00,
      discount_price: 395.00,
      stock: 20,
      sku: 'ATL-W-COT-02',
      featured: 1,
      trending: 1,
      new_arrival: 1,
      rating: 4.9,
      reviews_count: 21,
      images: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Caramel Camel', hex: '#c19a6b' },
        { name: 'Snow Cream', hex: '#fdfbf7' },
        { name: 'Midnight Charcoal', hex: '#262626' }
      ],
      sizes: ['XS', 'S', 'M', 'L']
    },
    {
      category_id: catWomenCoats,
      gender: 'women',
      name: 'Sculpted Hourglass Blazer',
      slug: 'womens-sculpted-hourglass-blazer',
      description: 'A contemporary masterclass in feminine tailoring. Sharp peaked lapels with padded architectural shoulders and an engineered cinch at the natural waist.',
      fabric: '96% Virgin Wool, 4% Elastane. Lining: 100% Cupro.',
      care: 'Dry clean only.',
      price: 280.00,
      discount_price: null,
      stock: 30,
      sku: 'ATL-W-BLZ-03',
      featured: 0,
      trending: 1,
      new_arrival: 1,
      rating: 4.8,
      reviews_count: 17,
      images: [
        'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Pinstripe Charcoal', hex: '#333333' },
        { name: 'Pristine Chalk', hex: '#f5f5f5' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    {
      category_id: catWomenTops,
      gender: 'women',
      name: 'Ribbed Cashmere Turtleneck Sweater',
      slug: 'womens-ribbed-cashmere-turtleneck',
      description: 'Knit from plush 2-ply Mongolian cashmere. Features fine ribbing that retains its structure, a relaxed foldable collar, and elongated cuffs with thumbhole accents.',
      fabric: '100% Grade-A Mongolian Cashmere.',
      care: 'Hand wash with cashmere shampoo. Lay flat to dry.',
      price: 195.00,
      discount_price: 165.00,
      stock: 45,
      sku: 'ATL-W-KNT-04',
      featured: 1,
      trending: 0,
      new_arrival: 0,
      rating: 4.9,
      reviews_count: 24,
      images: [
        'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Alabaster Oat', hex: '#ede6d6' },
        { name: 'Burgundy Wine', hex: '#581845' },
        { name: 'Heather Smoke', hex: '#757575' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    {
      category_id: catWomenDresses,
      gender: 'women',
      name: 'Pleated Poplin Tiered Midi Dress',
      slug: 'womens-pleated-poplin-midi-dress',
      description: 'Crisp organic cotton poplin gathered into an airy tiered skirt. Styled with a square neckline, smocked back panel for a flexible fit, and hidden side seam pockets.',
      fabric: '100% GOTS Certified Organic Cotton Poplin.',
      care: 'Machine wash delicate cycle. Line dry.',
      price: 165.00,
      discount_price: 139.00,
      stock: 50,
      sku: 'ATL-W-DRS-05',
      featured: 0,
      trending: 0,
      new_arrival: 1,
      rating: 4.7,
      reviews_count: 11,
      images: [
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Terracotta Rust', hex: '#b33939' },
        { name: 'French Sky', hex: '#70a1ff' },
        { name: 'Garden Olive', hex: '#535c68' }
      ],
      sizes: ['XS', 'S', 'M', 'L']
    },

    // --- KIDS' PRODUCTS ---
    {
      category_id: catKidsBoys,
      gender: 'kids',
      name: 'Organic Cotton Sherpa-Lined Corduroy Jacket',
      slug: 'kids-boys-sherpa-corduroy-jacket',
      description: 'Vintage-inspired thick wale corduroy insulated with soft recycled sherpa fleece. Features antique brass snap closures engineered for small hands, reinforced elbow patches, and dual chest pockets.',
      fabric: '100% Organic Cotton Corduroy shell, 100% Recycled Poly Sherpa lining.',
      care: 'Machine wash cold gentle. Low tumble dry.',
      price: 88.00,
      discount_price: 72.00,
      stock: 35,
      sku: 'ATL-K-JKT-01',
      featured: 1,
      trending: 1,
      new_arrival: 1,
      rating: 4.9,
      reviews_count: 19,
      images: [
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Cognac Amber', hex: '#b86b24' },
        { name: 'Deep Forest', hex: '#1b4332' }
      ],
      sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y']
    },
    {
      category_id: catKidsBoys,
      gender: 'kids',
      name: 'Kids Waffle Knit Thermal Henley & Jogger Set',
      slug: 'kids-boys-waffle-henley-jogger-set',
      description: 'Super soft, breathable thermal waffle weave crafted with organic combed cotton. Elasticized drawstring waist for easy movement and play-ready durability.',
      fabric: '95% Organic Cotton, 5% Elastane.',
      care: 'Machine wash cold. Tumble dry medium.',
      price: 54.00,
      discount_price: 45.00,
      stock: 60,
      sku: 'ATL-K-WAF-02',
      featured: 0,
      trending: 1,
      new_arrival: 0,
      rating: 4.8,
      reviews_count: 14,
      images: [
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Heather Moss', hex: '#52796f' },
        { name: 'Oatmeal Heather', hex: '#d8cfbc' },
        { name: 'Slate Blue', hex: '#4682b4' }
      ],
      sizes: ['2Y', '3-4Y', '5-6Y', '7-8Y', '9-10Y']
    },
    {
      category_id: catKidsGirls,
      gender: 'kids',
      name: 'Botanical Floral Chiffon Twirl Dress',
      slug: 'kids-girls-botanical-twirl-dress',
      description: 'Delicate hand-illustrated botanical print with flutter sleeves and a sweeping multi-tier gathered skirt designed for celebratory spins. Fully lined with 100% breathable organic batiste.',
      fabric: '100% Recycled Chiffon shell; 100% Organic Cotton lining.',
      care: 'Machine wash cold inside laundry bag. Line dry.',
      price: 68.00,
      discount_price: 58.00,
      stock: 45,
      sku: 'ATL-K-DRS-03',
      featured: 1,
      trending: 1,
      new_arrival: 1,
      rating: 5.0,
      reviews_count: 26,
      images: [
        'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Dusty Rose Blossom', hex: '#c58385' },
        { name: 'Lemon Verbena', hex: '#f0e68c' }
      ],
      sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y']
    },
    {
      category_id: catKidsGirls,
      gender: 'kids',
      name: 'Cable Knit Merino Wool Cardigan',
      slug: 'kids-girls-cable-merino-cardigan',
      description: 'Heirloom-grade cable knit woven from soft merino wool that never itches. Decorated with genuine wooden buttons and ribbed scalloped trims.',
      fabric: '100% Pure Merino Wool (Hypoallergenic & Non-Scratch).',
      care: 'Hand wash cold or gentle machine wool cycle. Dry flat.',
      price: 74.00,
      discount_price: null,
      stock: 30,
      sku: 'ATL-K-KNT-04',
      featured: 0,
      trending: 0,
      new_arrival: 1,
      rating: 4.9,
      reviews_count: 8,
      images: [
        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Vanilla Cream', hex: '#f3ede2' },
        { name: 'Lilac Mist', hex: '#c8b6ff' }
      ],
      sizes: ['2Y', '3-4Y', '5-6Y', '7-8Y']
    }
  ];

  // Insert all products, images, variants, and reviews
  for (const item of productsData) {
    const pResult = insertProduct.run(
      item.category_id,
      item.gender,
      item.name,
      item.slug,
      item.description,
      item.fabric,
      item.care,
      item.price,
      item.discount_price,
      item.stock,
      item.sku,
      'active',
      item.featured,
      item.trending,
      item.new_arrival,
      item.rating,
      item.reviews_count
    );
    const productId = pResult.lastInsertRowid;

    // Images
    item.images.forEach((imgUrl, idx) => {
      insertImage.run(productId, imgUrl, idx === 0 ? 1 : 0, idx);
    });

    // Variants (matrix of sizes and colors)
    for (const color of item.colors) {
      for (const size of item.sizes) {
        insertVariant.run(
          productId,
          size,
          color.name,
          color.hex,
          Math.floor(item.stock / (item.colors.length * item.sizes.length)) + 2,
          `${item.sku}-${size}-${color.name.substring(0, 3).toUpperCase()}`
        );
      }
    }

    // Seed realistic reviews
    insertReview.run(
      productId,
      customerResult.lastInsertRowid,
      'Sophia Laurent',
      5,
      'Exceptional Craftsmanship',
      'The drape and hand-feel of the fabric far exceeded my expectations. The fit is true to size and arrived beautifully packaged.',
      1
    );

    insertReview.run(
      productId,
      customer2Result.lastInsertRowid,
      'Marcus Sterling',
      item.rating >= 4.8 ? 5 : 4,
      'Timeless and versatile',
      'Wore this for an evening gallery opening and received non-stop compliments. Outstanding attention to detail in the seams and stitching.',
      1
    );
  }

  // 5. Coupons
  const insertCoupon = db.prepare(`
    INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertCoupon.run('WELCOME10', 'Welcome 10% discount on your first order', 'percentage', 10, 50, 50, 1);
  insertCoupon.run('LUXE20', '20% discount on orders over $150', 'percentage', 20, 150, 100, 1);
  insertCoupon.run('ATELIER50', '$50 flat reduction on orders over $250', 'fixed', 50, 250, 50, 1);

  // 6. Realistic Seed Orders
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      order_number, user_id, customer_name, customer_email, customer_phone,
      shipping_address, city, state, postal_code, country,
      subtotal, discount, shipping_fee, tax, total,
      coupon_code, payment_method, payment_status, order_status, tracking_number
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, product_image, size, color, price, quantity, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Order 1: Delivered
  const order1 = insertOrder.run(
    'ORD-2026-8910',
    customerResult.lastInsertRowid,
    'Sophia Laurent',
    'customer@atelier.com',
    '+1 (555) 782-9901',
    '124 Mercer Street, Loft 4A',
    'New York',
    'NY',
    '10012',
    'United States',
    240.00,
    24.00,
    0.00,
    18.36,
    234.36,
    'WELCOME10',
    'credit_card',
    'paid',
    'Delivered',
    'FDX-994827163'
  ).lastInsertRowid;

  insertOrderItem.run(
    order1,
    6,
    'Mulberry Silk Bias-Cut Slip Dress',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
    'S',
    'Champagne Gold',
    240.00,
    1,
    240.00
  );

  // Order 2: Processing
  const order2 = insertOrder.run(
    'ORD-2026-9042',
    customerResult.lastInsertRowid,
    'Sophia Laurent',
    'customer@atelier.com',
    '+1 (555) 782-9901',
    '124 Mercer Street, Loft 4A',
    'New York',
    'NY',
    '10012',
    'United States',
    345.00,
    0.00,
    0.00,
    29.32,
    374.32,
    null,
    'credit_card',
    'paid',
    'Processing',
    'UPS-1Z99988371'
  ).lastInsertRowid;

  insertOrderItem.run(
    order2,
    1,
    'Double-Breasted Wool Overcoat',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80',
    'M',
    'Camel Tan',
    345.00,
    1,
    345.00
  );

  // Order 3: Shipped
  const order3 = insertOrder.run(
    'ORD-2026-9118',
    customer2Result.lastInsertRowid,
    'Marcus Sterling',
    'marcus@example.com',
    '+1 (555) 438-2199',
    '88 Commonwealth Ave',
    'Boston',
    'MA',
    '02116',
    'United States',
    280.00,
    50.00,
    0.00,
    19.55,
    249.55,
    'ATELIER50',
    'credit_card',
    'paid',
    'Shipped',
    'DHL-883726190'
  ).lastInsertRowid;

  insertOrderItem.run(
    order3,
    3,
    'Supima Cotton Oxford Button-Down',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
    'L',
    'Crisp White',
    95.00,
    1,
    95.00
  );

  insertOrderItem.run(
    order3,
    5,
    'Pleated Wool Flannel Trouser',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80',
    '34',
    'Charcoal Melange',
    185.00,
    1,
    185.00
  );

  // 7. Wishlist Seed
  const insertWishlist = db.prepare(`INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)`);
  insertWishlist.run(customerResult.lastInsertRowid, 1);
  insertWishlist.run(customerResult.lastInsertRowid, 7);

  console.log('✅ Database seeded successfully with:');
  console.log('   - 3 Users (Admin: admin@atelier.com / admin123, Customers: customer@atelier.com, marcus@example.com)');
  console.log('   - 8 Categories (Men, Women, Kids)');
  console.log('   - 14 Products with high-resolution fashion photography & variants');
  console.log('   - 3 Active Coupons (WELCOME10, LUXE20, ATELIER50)');
  console.log('   - 3 Seed Orders with Order Items & Tracking numbers');
  console.log('   - Store settings & Customer reviews');
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('--- Database Seeding Complete ---');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database seeding error:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
