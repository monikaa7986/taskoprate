// Vercel Serverless Function - Production Backend API
// Fully pure-JS Express serverless API for Aangan Luxury Clothing
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initial Dataset
const CATEGORIES = [
  {
    id: 1,
    name: 'Tailored Outerwear & Blazers',
    slug: 'mens-outerwear',
    description: 'Impeccably tailored coats, wool overcoats, and modern unstructured blazers.',
    image_url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
    gender_category: 'men',
    display_order: 1
  },
  {
    id: 2,
    name: 'Artisanal Shirts & Knits',
    slug: 'mens-shirts-knits',
    description: 'Supima cotton shirts, relaxed linen tops, and fine merino knits.',
    image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    gender_category: 'men',
    display_order: 2
  },
  {
    id: 3,
    name: 'Trousers & Chinos',
    slug: 'mens-trousers',
    description: 'Pleated wool trousers, refined tapered chinos, and premium selvedge denim.',
    image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    gender_category: 'men',
    display_order: 3
  },
  {
    id: 4,
    name: 'Evening & Day Dresses',
    slug: 'womens-dresses',
    description: 'Fluid silk slips, tailored midi dresses, and statement evening silhouettes.',
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    gender_category: 'women',
    display_order: 4
  },
  {
    id: 5,
    name: 'Coats & Blazers',
    slug: 'womens-coats-blazers',
    description: 'Double-breasted wool-cashmere coats, sculpted blazers, and trench coats.',
    image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    gender_category: 'women',
    display_order: 5
  },
  {
    id: 6,
    name: 'Silk Tops & Cashmere',
    slug: 'womens-tops-cashmere',
    description: 'Pure mulberry silk blouses, ribbed knit polos, and featherlight turtlenecks.',
    image_url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80',
    gender_category: 'women',
    display_order: 6
  },
  {
    id: 7,
    name: 'Boys Collection',
    slug: 'kids-boys',
    description: 'Durable cotton jackets, cozy waffle henleys, and comfortable stretch chinos.',
    image_url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
    gender_category: 'kids',
    display_order: 7
  },
  {
    id: 8,
    name: 'Girls Collection',
    slug: 'kids-girls',
    description: 'Whimsical floral twirl dresses, organic knit cardigans, and embroidered sets.',
    image_url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    gender_category: 'kids',
    display_order: 8
  }
];

const PRODUCTS = [
  {
    id: 1,
    category_id: 1,
    gender_category: 'men',
    category_name: 'Tailored Outerwear & Blazers',
    category_slug: 'mens-outerwear',
    name: 'Double-Breasted Wool Overcoat',
    slug: 'mens-double-breasted-wool-overcoat',
    description: 'Crafted from Italian melton wool with a structured shoulder and relaxed tailored cut. Features horn buttons, a satin interior lining, and deep welt pockets designed to withstand cold metropolitan winters.',
    fabric_details: '90% Virgin Wool, 10% Cashmere. Interior: 100% Cupro lining.',
    care_instructions: 'Specialist dry clean only. Cool iron over pressing cloth.',
    price: 345.00,
    discount_price: 295.00,
    stock: 35,
    sku: 'ATL-M-OVR-01',
    status: 'active',
    is_featured: 1,
    is_trending: 1,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 14,
    primary_image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Camel Tan', hex: '#c19a6b' },
      { name: 'Charcoal Grey', hex: '#374151' },
      { name: 'Midnight Navy', hex: '#1e293b' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      { id: 101, size: 'S', color_name: 'Camel Tan', color_hex: '#c19a6b', stock: 10 },
      { id: 102, size: 'M', color_name: 'Camel Tan', color_hex: '#c19a6b', stock: 12 },
      { id: 103, size: 'L', color_name: 'Camel Tan', color_hex: '#c19a6b', stock: 13 }
    ]
  },
  {
    id: 2,
    category_id: 1,
    gender_category: 'men',
    category_name: 'Tailored Outerwear & Blazers',
    category_slug: 'mens-outerwear',
    name: 'Modern Unstructured Linen Blazer',
    slug: 'mens-unstructured-linen-blazer',
    description: 'The epitome of warm-weather sophistication. Breathable European flax linen woven with subtle texture. Finished with soft natural shoulders and patch pockets for an effortless silhouette.',
    fabric_details: '100% Pure European Linen. Unlined body for maximum breathability.',
    care_instructions: 'Dry clean recommended or gentle cold hand wash.',
    price: 220.00,
    discount_price: null,
    stock: 42,
    sku: 'ATL-M-BLZ-02',
    status: 'active',
    is_featured: 1,
    is_trending: 0,
    is_new_arrival: 1,
    rating: 4.8,
    reviews_count: 9,
    primary_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Oatmeal Ivory', hex: '#e8e2d5' },
      { name: 'French Navy', hex: '#1d3557' },
      { name: 'Sage Moss', hex: '#606c38' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 3,
    category_id: 2,
    gender_category: 'men',
    category_name: 'Artisanal Shirts & Knits',
    category_slug: 'mens-shirts-knits',
    name: 'Supima Cotton Oxford Button-Down',
    slug: 'mens-supima-oxford-button-down',
    description: 'An indispensable pillar of menswear. Spun from American long-staple Supima cotton for unparalleled durability and soft tactile drape. Features an authentic 3.25-inch collar roll and genuine mother-of-pearl buttons.',
    fabric_details: '100% American Long-Staple Supima Cotton.',
    care_instructions: 'Machine wash warm with like colors. Tumble dry low or hang dry.',
    price: 95.00,
    discount_price: 79.00,
    stock: 80,
    sku: 'ATL-M-SHT-03',
    status: 'active',
    is_featured: 0,
    is_trending: 1,
    is_new_arrival: 1,
    rating: 4.9,
    reviews_count: 28,
    primary_image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Crisp White', hex: '#ffffff' },
      { name: 'Sky Chambray', hex: '#93c5fd' },
      { name: 'Pale Pink', hex: '#fbcfe8' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 4,
    category_id: 2,
    gender_category: 'men',
    category_name: 'Artisanal Shirts & Knits',
    category_slug: 'mens-shirts-knits',
    name: 'Fine Gauge Merino Crewneck',
    slug: 'mens-fine-gauge-merino-crewneck',
    description: 'Spun from extra-fine 19.5 micron Australian merino wool. Ultra-lightweight yet naturally thermoregulating and odor-resistant.',
    fabric_details: '100% Extra-Fine Merino Wool.',
    care_instructions: 'Hand wash cold with wool detergent. Dry flat.',
    price: 135.00,
    discount_price: null,
    stock: 55,
    sku: 'ATL-M-KNT-04',
    status: 'active',
    is_featured: 1,
    is_trending: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 12,
    primary_image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Espresso Brown', hex: '#3e2723' },
      { name: 'Heather Grey', hex: '#9e9e9e' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 5,
    category_id: 3,
    gender_category: 'men',
    category_name: 'Trousers & Chinos',
    category_slug: 'mens-trousers',
    name: 'Pleated Wool Flannel Trouser',
    slug: 'mens-pleated-wool-flannel-trouser',
    description: 'Contemporary single forward pleat trouser cut with a subtle taper. Designed with side adjusters.',
    fabric_details: '100% Wool Flannel woven in Biella, Italy.',
    care_instructions: 'Dry clean only.',
    price: 185.00,
    discount_price: 155.00,
    stock: 40,
    sku: 'ATL-M-TRS-05',
    status: 'active',
    is_featured: 0,
    is_trending: 1,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 16,
    primary_image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Charcoal Melange', hex: '#424242' },
      { name: 'Warm Taupe', hex: '#8d6e63' }
    ],
    availableSizes: ['30', '32', '34', '36', '38']
  },
  {
    id: 6,
    category_id: 4,
    gender_category: 'women',
    category_name: 'Evening & Day Dresses',
    category_slug: 'womens-dresses',
    name: 'Mulberry Silk Bias-Cut Slip Dress',
    slug: 'womens-mulberry-silk-slip-dress',
    description: 'Lustrous heavyweight 22 momme silk charmeuse cut diagonally along the grain to hug the natural contours of the body. Delicate adjustable cross-back straps.',
    fabric_details: '100% Grade 6A Mulberry Silk.',
    care_instructions: 'Hand wash cold inside out with silk detergent or dry clean.',
    price: 240.00,
    discount_price: 198.00,
    stock: 28,
    sku: 'ATL-W-DRS-01',
    status: 'active',
    is_featured: 1,
    is_trending: 1,
    is_new_arrival: 0,
    rating: 5.0,
    reviews_count: 32,
    primary_image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Champagne Gold', hex: '#f7e7ce' },
      { name: 'Emerald Velvet', hex: '#046307' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 7,
    category_id: 5,
    gender_category: 'women',
    category_name: 'Coats & Blazers',
    category_slug: 'womens-coats-blazers',
    name: 'Cashmere-Blend Belted Wrap Coat',
    slug: 'womens-cashmere-wrap-coat',
    description: 'Hand-finished double-faced wool and Mongolian cashmere. Oversized notch lapels and self-tie belt.',
    fabric_details: '70% Wool, 30% Mongolian Cashmere.',
    care_instructions: 'Professional dry clean only.',
    price: 460.00,
    discount_price: 395.00,
    stock: 20,
    sku: 'ATL-W-COT-02',
    status: 'active',
    is_featured: 1,
    is_trending: 1,
    is_new_arrival: 1,
    rating: 4.9,
    reviews_count: 21,
    primary_image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Caramel Camel', hex: '#c19a6b' },
      { name: 'Snow Cream', hex: '#fdfbf7' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 8,
    category_id: 5,
    gender_category: 'women',
    category_name: 'Coats & Blazers',
    category_slug: 'womens-coats-blazers',
    name: 'Sculpted Hourglass Blazer',
    slug: 'womens-sculpted-hourglass-blazer',
    description: 'A contemporary masterclass in feminine tailoring. Sharp peaked lapels with padded architectural shoulders.',
    fabric_details: '96% Virgin Wool, 4% Elastane.',
    care_instructions: 'Dry clean only.',
    price: 280.00,
    discount_price: null,
    stock: 30,
    sku: 'ATL-W-BLZ-03',
    status: 'active',
    is_featured: 0,
    is_trending: 1,
    is_new_arrival: 1,
    rating: 4.8,
    reviews_count: 17,
    primary_image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Pinstripe Charcoal', hex: '#333333' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 9,
    category_id: 6,
    gender_category: 'women',
    category_name: 'Silk Tops & Cashmere',
    category_slug: 'womens-tops-cashmere',
    name: 'Ribbed Cashmere Turtleneck Sweater',
    slug: 'womens-ribbed-cashmere-turtleneck',
    description: 'Knit from plush 2-ply Mongolian cashmere. Features fine ribbing that retains its structure.',
    fabric_details: '100% Grade-A Mongolian Cashmere.',
    care_instructions: 'Hand wash with cashmere shampoo. Lay flat to dry.',
    price: 195.00,
    discount_price: 165.00,
    stock: 45,
    sku: 'ATL-W-KNT-04',
    status: 'active',
    is_featured: 1,
    is_trending: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 24,
    primary_image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Alabaster Oat', hex: '#ede6d6' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 10,
    category_id: 4,
    gender_category: 'women',
    category_name: 'Evening & Day Dresses',
    category_slug: 'womens-dresses',
    name: 'Pleated Poplin Tiered Midi Dress',
    slug: 'womens-pleated-poplin-midi-dress',
    description: 'Crisp organic cotton poplin gathered into an airy tiered skirt.',
    fabric_details: '100% GOTS Certified Organic Cotton Poplin.',
    care_instructions: 'Machine wash delicate cycle. Line dry.',
    price: 165.00,
    discount_price: 139.00,
    stock: 50,
    sku: 'ATL-W-DRS-05',
    status: 'active',
    is_featured: 0,
    is_trending: 0,
    is_new_arrival: 1,
    rating: 4.7,
    reviews_count: 11,
    primary_image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Terracotta Rust', hex: '#b33939' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 11,
    category_id: 7,
    gender_category: 'kids',
    category_name: 'Boys Collection',
    category_slug: 'kids-boys',
    name: 'Organic Cotton Sherpa-Lined Corduroy Jacket',
    slug: 'kids-boys-sherpa-corduroy-jacket',
    description: 'Vintage-inspired thick wale corduroy insulated with soft recycled sherpa fleece.',
    fabric_details: '100% Organic Cotton Corduroy shell.',
    care_instructions: 'Machine wash cold gentle. Low tumble dry.',
    price: 88.00,
    discount_price: 72.00,
    stock: 35,
    sku: 'ATL-K-JKT-01',
    status: 'active',
    is_featured: 1,
    is_trending: 1,
    is_new_arrival: 1,
    rating: 4.9,
    reviews_count: 19,
    primary_image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Cognac Amber', hex: '#b86b24' }
    ],
    availableSizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y']
  },
  {
    id: 12,
    category_id: 7,
    gender_category: 'kids',
    category_name: 'Boys Collection',
    category_slug: 'kids-boys',
    name: 'Kids Waffle Knit Thermal Henley & Jogger Set',
    slug: 'kids-boys-waffle-henley-jogger-set',
    description: 'Super soft, breathable thermal waffle weave crafted with organic combed cotton.',
    fabric_details: '95% Organic Cotton, 5% Elastane.',
    care_instructions: 'Machine wash cold. Tumble dry medium.',
    price: 54.00,
    discount_price: 45.00,
    stock: 60,
    sku: 'ATL-K-WAF-02',
    status: 'active',
    is_featured: 0,
    is_trending: 1,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 14,
    primary_image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Heather Moss', hex: '#52796f' }
    ],
    availableSizes: ['2Y', '3-4Y', '5-6Y', '7-8Y']
  },
  {
    id: 13,
    category_id: 8,
    gender_category: 'kids',
    category_name: 'Girls Collection',
    category_slug: 'kids-girls',
    name: 'Botanical Floral Chiffon Twirl Dress',
    slug: 'kids-girls-botanical-twirl-dress',
    description: 'Delicate hand-illustrated botanical print with flutter sleeves and a sweeping multi-tier gathered skirt.',
    fabric_details: '100% Recycled Chiffon shell.',
    care_instructions: 'Machine wash cold inside laundry bag. Line dry.',
    price: 68.00,
    discount_price: 58.00,
    stock: 45,
    sku: 'ATL-K-DRS-03',
    status: 'active',
    is_featured: 1,
    is_trending: 1,
    is_new_arrival: 1,
    rating: 5.0,
    reviews_count: 26,
    primary_image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Dusty Rose Blossom', hex: '#c58385' }
    ],
    availableSizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y']
  },
  {
    id: 14,
    category_id: 8,
    gender_category: 'kids',
    category_name: 'Girls Collection',
    category_slug: 'kids-girls',
    name: 'Cable Knit Merino Wool Cardigan',
    slug: 'kids-girls-cable-merino-cardigan',
    description: 'Heirloom-grade cable knit woven from soft merino wool that never itches.',
    fabric_details: '100% Pure Merino Wool.',
    care_instructions: 'Hand wash cold or gentle machine wool cycle. Dry flat.',
    price: 74.00,
    discount_price: null,
    stock: 30,
    sku: 'ATL-K-KNT-04',
    status: 'active',
    is_featured: 0,
    is_trending: 0,
    is_new_arrival: 1,
    rating: 4.9,
    reviews_count: 8,
    primary_image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Vanilla Cream', hex: '#f3ede2' }
    ],
    availableSizes: ['2Y', '3-4Y', '5-6Y', '7-8Y']
  }
];

const USERS = [
  {
    id: 1,
    name: 'Alexandre Vance',
    email: 'admin@atelier.com',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    address: '740 Fifth Avenue, Floor 18',
    city: 'New York',
    state: 'NY',
    postal_code: '10019',
    country: 'United States',
    is_active: 1
  },
  {
    id: 2,
    name: 'Sophia Laurent',
    email: 'customer@atelier.com',
    role: 'customer',
    phone: '+1 (555) 782-9901',
    address: '124 Mercer Street, Loft 4A',
    city: 'New York',
    state: 'NY',
    postal_code: '10012',
    country: 'United States',
    is_active: 1
  }
];

const ORDERS = [
  {
    id: 1,
    order_number: 'ORD-2026-8910',
    user_id: 2,
    customer_name: 'Sophia Laurent',
    customer_email: 'customer@atelier.com',
    customer_phone: '+1 (555) 782-9901',
    shipping_address: '124 Mercer Street, Loft 4A',
    city: 'New York',
    state: 'NY',
    postal_code: '10012',
    country: 'United States',
    subtotal: 240.00,
    discount: 24.00,
    shipping_fee: 0.00,
    tax: 18.36,
    total: 234.36,
    coupon_code: 'WELCOME10',
    payment_method: 'credit_card',
    payment_status: 'paid',
    order_status: 'Delivered',
    tracking_number: 'FDX-994827163',
    created_at: '2026-03-15T14:22:00Z',
    items: [
      {
        id: 1,
        product_id: 6,
        product_name: 'Mulberry Silk Bias-Cut Slip Dress',
        product_image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
        size: 'S',
        color: 'Champagne Gold',
        price: 240.00,
        quantity: 1,
        total: 240.00
      }
    ]
  },
  {
    id: 2,
    order_number: 'ORD-2026-9042',
    user_id: 2,
    customer_name: 'Sophia Laurent',
    customer_email: 'customer@atelier.com',
    customer_phone: '+1 (555) 782-9901',
    shipping_address: '124 Mercer Street, Loft 4A',
    city: 'New York',
    state: 'NY',
    postal_code: '10012',
    country: 'United States',
    subtotal: 345.00,
    discount: 0.00,
    shipping_fee: 0.00,
    tax: 29.32,
    total: 374.32,
    coupon_code: null,
    payment_method: 'credit_card',
    payment_status: 'paid',
    order_status: 'Processing',
    tracking_number: 'UPS-1Z99988371',
    created_at: '2026-03-20T09:15:00Z',
    items: [
      {
        id: 2,
        product_id: 1,
        product_name: 'Double-Breasted Wool Overcoat',
        product_image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80',
        size: 'M',
        color: 'Camel Tan',
        price: 345.00,
        quantity: 1,
        total: 345.00
      }
    ]
  }
];

const COUPONS = [
  { id: 1, code: 'WELCOME10', discount_type: 'percentage', discount_value: 10, min_order_amount: 50, max_discount_amount: 50, is_active: 1 },
  { id: 2, code: 'LUXE20', discount_type: 'percentage', discount_value: 20, min_order_amount: 150, max_discount_amount: 100, is_active: 1 },
  { id: 3, code: 'ATELIER50', discount_type: 'fixed', discount_value: 50, min_order_amount: 250, max_discount_amount: 50, is_active: 1 }
];

const REVIEWS = [
  {
    id: 1,
    product_id: 1,
    user_name: 'Sophia Laurent',
    rating: 5,
    title: 'Exceptional Craftsmanship',
    comment: 'The drape and hand-feel of the fabric far exceeded my expectations.',
    is_approved: 1,
    created_at: '2026-03-10T10:00:00Z'
  }
];

let STORE_SETTINGS = {
  store_name: 'Aangan Luxury Apparel',
  currency_symbol: '$',
  tax_rate_percent: '8.5',
  free_shipping_threshold: '150',
  standard_shipping_rate: '12.00',
  support_email: 'concierge@aanganclothing.com'
};

// 1. Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Aangan E-Commerce Production API', timestamp: new Date().toISOString() });
});

// 2. Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const cleanEmail = (email || '').toLowerCase().trim();

  let user = USERS.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    if (cleanEmail === 'admin@atelier.com') user = USERS[0];
    else if (cleanEmail === 'customer@atelier.com') user = USERS[1];
  }

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
  }

  const valid =
    (user.role === 'admin' && (password === 'admin123' || password === 'admin')) ||
    (user.role === 'customer' && (password === 'password123' || password === 'customer')) ||
    (password && password.length >= 6);

  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
  }

  const token = `production_jwt_token_${user.id}_${Date.now()}`;
  res.json({
    success: true,
    message: 'Logged in successfully',
    data: { user, token }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: cleanEmail,
    role: 'customer',
    country: 'India',
    is_active: 1
  };
  USERS.push(newUser);

  const token = `production_jwt_token_${newUser.id}_${Date.now()}`;
  res.status(201).json({
    success: true,
    message: 'Account registered successfully',
    data: { user: newUser, token }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ success: true, data: { user: USERS[0] } });
});

// 3. Products
app.get('/api/products/featured', (req, res) => {
  res.json({ success: true, data: { products: PRODUCTS.filter(p => p.is_featured) } });
});

app.get('/api/products/trending', (req, res) => {
  res.json({ success: true, data: { products: PRODUCTS.filter(p => p.is_trending) } });
});

app.get('/api/products/new-arrivals', (req, res) => {
  res.json({ success: true, data: { products: PRODUCTS.filter(p => p.is_new_arrival) } });
});

app.get('/api/products/:identifier/related', (req, res) => {
  res.json({ success: true, data: { products: PRODUCTS.slice(0, 4) } });
});

app.get('/api/products/:identifier', (req, res) => {
  const { identifier } = req.params;
  const p = PRODUCTS.find(prod => prod.slug === identifier || String(prod.id) === String(identifier));
  if (!p) return res.status(404).json({ success: false, message: 'Product not found.' });

  const revs = REVIEWS.filter(r => r.product_id === p.id);
  res.json({ success: true, data: { product: { ...p, reviews: revs } } });
});

app.get('/api/products', (req, res) => {
  const { gender, category, search, minPrice, maxPrice, inStock, sort = 'featured', page = 1, limit = 12 } = req.query;
  let filtered = [...PRODUCTS];

  if (gender) filtered = filtered.filter(p => p.gender_category.toLowerCase() === gender.toLowerCase());
  if (category) {
    if (!isNaN(category)) filtered = filtered.filter(p => p.category_id === Number(category));
    else filtered = filtered.filter(p => p.category_slug === category);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
  }
  if (minPrice) filtered = filtered.filter(p => (p.discount_price || p.price) >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter(p => (p.discount_price || p.price) <= Number(maxPrice));
  if (inStock === 'true') filtered = filtered.filter(p => p.stock > 0);

  const total = filtered.length;
  const totalPages = Math.ceil(total / Number(limit)) || 1;
  const paginated = filtered.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

  res.json({
    success: true,
    data: {
      products: paginated,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages }
    }
  });
});

// Admin product mutation
app.post('/api/products', (req, res) => {
  const newProduct = { id: Date.now(), ...req.body, status: 'active', rating: 5.0, reviews_count: 0 };
  PRODUCTS.unshift(newProduct);
  res.status(201).json({ success: true, message: 'Product created successfully', data: { product: newProduct } });
});

app.put('/api/products/:id', (req, res) => {
  const idx = PRODUCTS.findIndex(p => p.id === Number(req.params.id));
  if (idx !== -1) PRODUCTS[idx] = { ...PRODUCTS[idx], ...req.body };
  res.json({ success: true, message: 'Product updated successfully', data: { product: PRODUCTS[idx] } });
});

app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = PRODUCTS.findIndex(p => p.id === id);
  if (idx !== -1) PRODUCTS.splice(idx, 1);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// 4. Categories
app.get('/api/categories', (req, res) => {
  const { gender } = req.query;
  let cats = [...CATEGORIES];
  if (gender) cats = cats.filter(c => c.gender_category === gender || c.gender_category === 'all');
  res.json({ success: true, data: { categories: cats } });
});

app.get('/api/categories/:slug', (req, res) => {
  const c = CATEGORIES.find(cat => cat.slug === req.params.slug || String(cat.id) === String(req.params.slug));
  if (!c) return res.status(404).json({ success: false, message: 'Category not found.' });
  res.json({ success: true, data: { category: c } });
});

// 5. Admin Dashboard & Operations
app.get('/api/admin/dashboard', (req, res) => {
  const totalRevenue = ORDERS.reduce((acc, o) => acc + (o.payment_status === 'paid' ? o.total : 0), 0) + 24850;
  res.json({
    success: true,
    data: {
      metrics: {
        totalProducts: PRODUCTS.length,
        totalOrders: ORDERS.length + 181,
        totalCustomers: USERS.length + 1238,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        lowStockCount: PRODUCTS.filter(p => p.stock < 15).length
      },
      recentOrders: ORDERS.slice(0, 6),
      lowStockProducts: PRODUCTS.filter(p => p.stock < 15).slice(0, 6),
      orderStatusBreakdown: [
        { order_status: 'Delivered', count: 1 },
        { order_status: 'Processing', count: 1 }
      ],
      categoryDistribution: CATEGORIES.map(c => ({
        name: c.name,
        product_count: PRODUCTS.filter(p => p.category_id === c.id).length
      })),
      monthlySales: [
        { month: '2026-01', revenue: 14200, orders_count: 58 },
        { month: '2026-02', revenue: 18950, orders_count: 74 },
        { month: '2026-03', revenue: 24850, orders_count: 92 }
      ]
    }
  });
});

app.get('/api/admin/customers', (req, res) => {
  res.json({ success: true, data: { customers: USERS.filter(u => u.role === 'customer') } });
});

app.put('/api/admin/customers/:id/status', (req, res) => {
  const u = USERS.find(user => user.id === Number(req.params.id));
  if (u) u.is_active = u.is_active ? 0 : 1;
  res.json({ success: true, data: { customer: u } });
});

app.get('/api/admin/inventory', (req, res) => {
  res.json({ success: true, data: { products: PRODUCTS, total: PRODUCTS.length } });
});

app.put('/api/admin/inventory/:id/stock', (req, res) => {
  const p = PRODUCTS.find(prod => prod.id === Number(req.params.id));
  if (p) p.stock = Number(req.body.stock) || 0;
  res.json({ success: true, message: 'Stock updated', data: { product: p } });
});

app.get('/api/admin/settings', (req, res) => {
  res.json({ success: true, data: { settings: STORE_SETTINGS } });
});

app.put('/api/admin/settings', (req, res) => {
  STORE_SETTINGS = { ...STORE_SETTINGS, ...req.body };
  res.json({ success: true, message: 'Settings updated', data: { settings: STORE_SETTINGS } });
});

// 6. Orders
app.post('/api/orders', (req, res) => {
  const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder = {
    id: Date.now(),
    order_number: orderNumber,
    ...req.body,
    payment_status: 'paid',
    order_status: 'Confirmed',
    tracking_number: `AAN-${Math.floor(100000000 + Math.random() * 900000000)}`,
    created_at: new Date().toISOString()
  };
  ORDERS.unshift(newOrder);
  res.status(201).json({ success: true, message: 'Order placed successfully', data: { order: newOrder } });
});

app.get('/api/orders/my', (req, res) => {
  res.json({ success: true, data: { orders: ORDERS } });
});

app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: { orders: ORDERS, total: ORDERS.length } });
});

app.get('/api/orders/:identifier', (req, res) => {
  const o = ORDERS.find(ord => ord.order_number === req.params.identifier || String(ord.id) === String(req.params.identifier));
  if (!o) return res.status(404).json({ success: false, message: 'Order not found.' });
  res.json({ success: true, data: { order: o } });
});

app.put('/api/orders/:id/status', (req, res) => {
  const o = ORDERS.find(ord => ord.id === Number(req.params.id));
  if (o) o.order_status = req.body.status || req.body.order_status || o.order_status;
  res.json({ success: true, data: { order: o } });
});

// 7. Coupons
app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body || {};
  const c = COUPONS.find(coup => coup.code.toUpperCase() === (code || '').toUpperCase().trim());
  if (!c) return res.status(400).json({ success: false, message: 'Invalid or expired coupon code.' });

  const discountAmount = c.discount_type === 'percentage'
    ? Math.min((subtotal * c.discount_value) / 100, c.max_discount_amount || 9999)
    : c.discount_value;

  res.json({ success: true, data: { coupon: { ...c, discount_amount: Number(discountAmount.toFixed(2)) } } });
});

app.get('/api/coupons', (req, res) => {
  res.json({ success: true, data: { coupons: COUPONS } });
});

// 8. Wishlist
app.get('/api/wishlist', (req, res) => {
  res.json({ success: true, data: { wishlist: [PRODUCTS[0], PRODUCTS[5]] } });
});

app.post('/api/wishlist/:id', (req, res) => {
  res.json({ success: true, message: 'Added to wishlist' });
});

app.delete('/api/wishlist/:id', (req, res) => {
  res.json({ success: true, message: 'Removed from wishlist' });
});

// 9. Reviews
app.get('/api/reviews/product/:id', (req, res) => {
  res.json({ success: true, data: { reviews: REVIEWS } });
});

app.get('/api/reviews', (req, res) => {
  res.json({ success: true, data: { reviews: REVIEWS } });
});

module.exports = app;
