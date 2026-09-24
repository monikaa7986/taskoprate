// Initial High-Fidelity Dataset for Aangan / Atelier Luxury E-Commerce
// Enables 100% full functionality in production/standalone deployments (e.g., Vercel)

export const INITIAL_CATEGORIES = [
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

export const INITIAL_PRODUCTS = [
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
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 201, size: 'M', color_name: 'Oatmeal Ivory', color_hex: '#e8e2d5', stock: 15 },
      { id: 202, size: 'L', color_name: 'French Navy', color_hex: '#1d3557', stock: 15 }
    ]
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
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      { id: 301, size: 'M', color_name: 'Crisp White', color_hex: '#ffffff', stock: 25 },
      { id: 302, size: 'L', color_name: 'Sky Chambray', color_hex: '#93c5fd', stock: 25 }
    ]
  },
  {
    id: 4,
    category_id: 2,
    gender_category: 'men',
    category_name: 'Artisanal Shirts & Knits',
    category_slug: 'mens-shirts-knits',
    name: 'Fine Gauge Merino Crewneck',
    slug: 'mens-fine-gauge-merino-crewneck',
    description: 'Spun from extra-fine 19.5 micron Australian merino wool. Ultra-lightweight yet naturally thermoregulating and odor-resistant. Wear next-to-skin or layered over a collared shirt.',
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
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Espresso Brown', hex: '#3e2723' },
      { name: 'Heather Grey', hex: '#9e9e9e' },
      { name: 'Forest Green', hex: '#2e7d32' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 401, size: 'M', color_name: 'Espresso Brown', color_hex: '#3e2723', stock: 18 }
    ]
  },
  {
    id: 5,
    category_id: 3,
    gender_category: 'men',
    category_name: 'Trousers & Chinos',
    category_slug: 'mens-trousers',
    name: 'Pleated Wool Flannel Trouser',
    slug: 'mens-pleated-wool-flannel-trouser',
    description: 'Contemporary single forward pleat trouser cut with a subtle taper. Designed with side adjusters to eliminate the need for a belt, delivering an uninterrupted waistline.',
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
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Charcoal Melange', hex: '#424242' },
      { name: 'Warm Taupe', hex: '#8d6e63' },
      { name: 'Dark Navy', hex: '#0d1b2a' }
    ],
    availableSizes: ['30', '32', '34', '36', '38'],
    variants: [
      { id: 501, size: '32', color_name: 'Charcoal Melange', color_hex: '#424242', stock: 15 }
    ]
  },
  {
    id: 6,
    category_id: 4,
    gender_category: 'women',
    category_name: 'Evening & Day Dresses',
    category_slug: 'womens-dresses',
    name: 'Mulberry Silk Bias-Cut Slip Dress',
    slug: 'womens-mulberry-silk-slip-dress',
    description: 'Lustrous heavyweight 22 momme silk charmeuse cut diagonally along the grain to hug the natural contours of the body. Delicate adjustable cross-back straps and a soft cowl neckline.',
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
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Champagne Gold', hex: '#f7e7ce' },
      { name: 'Emerald Velvet', hex: '#046307' },
      { name: 'Onyx Black', hex: '#111111' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    variants: [
      { id: 601, size: 'S', color_name: 'Champagne Gold', color_hex: '#f7e7ce', stock: 10 }
    ]
  },
  {
    id: 7,
    category_id: 5,
    gender_category: 'women',
    category_name: 'Coats & Blazers',
    category_slug: 'womens-coats-blazers',
    name: 'Cashmere-Blend Belted Wrap Coat',
    slug: 'womens-cashmere-wrap-coat',
    description: 'Hand-finished double-faced wool and Mongolian cashmere. Oversized notch lapels, generous patch pockets, and a self-tie sash belt that defines the waist with regal grace.',
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
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Caramel Camel', hex: '#c19a6b' },
      { name: 'Snow Cream', hex: '#fdfbf7' },
      { name: 'Midnight Charcoal', hex: '#262626' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L'],
    variants: [
      { id: 701, size: 'M', color_name: 'Caramel Camel', color_hex: '#c19a6b', stock: 8 }
    ]
  },
  {
    id: 8,
    category_id: 5,
    gender_category: 'women',
    category_name: 'Coats & Blazers',
    category_slug: 'womens-coats-blazers',
    name: 'Sculpted Hourglass Blazer',
    slug: 'womens-sculpted-hourglass-blazer',
    description: 'A contemporary masterclass in feminine tailoring. Sharp peaked lapels with padded architectural shoulders and an engineered cinch at the natural waist.',
    fabric_details: '96% Virgin Wool, 4% Elastane. Lining: 100% Cupro.',
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
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Pinstripe Charcoal', hex: '#333333' },
      { name: 'Pristine Chalk', hex: '#f5f5f5' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    variants: [
      { id: 801, size: 'M', color_name: 'Pinstripe Charcoal', color_hex: '#333333', stock: 12 }
    ]
  },
  {
    id: 9,
    category_id: 6,
    gender_category: 'women',
    category_name: 'Silk Tops & Cashmere',
    category_slug: 'womens-tops-cashmere',
    name: 'Ribbed Cashmere Turtleneck Sweater',
    slug: 'womens-ribbed-cashmere-turtleneck',
    description: 'Knit from plush 2-ply Mongolian cashmere. Features fine ribbing that retains its structure, a relaxed foldable collar, and elongated cuffs with thumbhole accents.',
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
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Alabaster Oat', hex: '#ede6d6' },
      { name: 'Burgundy Wine', hex: '#581845' },
      { name: 'Heather Smoke', hex: '#757575' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    variants: [
      { id: 901, size: 'S', color_name: 'Alabaster Oat', color_hex: '#ede6d6', stock: 15 }
    ]
  },
  {
    id: 10,
    category_id: 4,
    gender_category: 'women',
    category_name: 'Evening & Day Dresses',
    category_slug: 'womens-dresses',
    name: 'Pleated Poplin Tiered Midi Dress',
    slug: 'womens-pleated-poplin-midi-dress',
    description: 'Crisp organic cotton poplin gathered into an airy tiered skirt. Styled with a square neckline, smocked back panel for a flexible fit, and hidden side seam pockets.',
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
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Terracotta Rust', hex: '#b33939' },
      { name: 'French Sky', hex: '#70a1ff' },
      { name: 'Garden Olive', hex: '#535c68' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L'],
    variants: [
      { id: 1001, size: 'M', color_name: 'Terracotta Rust', color_hex: '#b33939', stock: 20 }
    ]
  },
  {
    id: 11,
    category_id: 7,
    gender_category: 'kids',
    category_name: 'Boys Collection',
    category_slug: 'kids-boys',
    name: 'Organic Cotton Sherpa-Lined Corduroy Jacket',
    slug: 'kids-boys-sherpa-corduroy-jacket',
    description: 'Vintage-inspired thick wale corduroy insulated with soft recycled sherpa fleece. Features antique brass snap closures engineered for small hands, reinforced elbow patches, and dual chest pockets.',
    fabric_details: '100% Organic Cotton Corduroy shell, 100% Recycled Poly Sherpa lining.',
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
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Cognac Amber', hex: '#b86b24' },
      { name: 'Deep Forest', hex: '#1b4332' }
    ],
    availableSizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'],
    variants: [
      { id: 1101, size: '5-6Y', color_name: 'Cognac Amber', color_hex: '#b86b24', stock: 12 }
    ]
  },
  {
    id: 12,
    category_id: 7,
    gender_category: 'kids',
    category_name: 'Boys Collection',
    category_slug: 'kids-boys',
    name: 'Kids Waffle Knit Thermal Henley & Jogger Set',
    slug: 'kids-boys-waffle-henley-jogger-set',
    description: 'Super soft, breathable thermal waffle weave crafted with organic combed cotton. Elasticized drawstring waist for easy movement and play-ready durability.',
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
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Heather Moss', hex: '#52796f' },
      { name: 'Oatmeal Heather', hex: '#d8cfbc' },
      { name: 'Slate Blue', hex: '#4682b4' }
    ],
    availableSizes: ['2Y', '3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    variants: [
      { id: 1201, size: '5-6Y', color_name: 'Heather Moss', color_hex: '#52796f', stock: 15 }
    ]
  },
  {
    id: 13,
    category_id: 8,
    gender_category: 'kids',
    category_name: 'Girls Collection',
    category_slug: 'kids-girls',
    name: 'Botanical Floral Chiffon Twirl Dress',
    slug: 'kids-girls-botanical-twirl-dress',
    description: 'Delicate hand-illustrated botanical print with flutter sleeves and a sweeping multi-tier gathered skirt designed for celebratory spins. Fully lined with 100% breathable organic batiste.',
    fabric_details: '100% Recycled Chiffon shell; 100% Organic Cotton lining.',
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
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Dusty Rose Blossom', hex: '#c58385' },
      { name: 'Lemon Verbena', hex: '#f0e68c' }
    ],
    availableSizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'],
    variants: [
      { id: 1301, size: '5-6Y', color_name: 'Dusty Rose Blossom', color_hex: '#c58385', stock: 15 }
    ]
  },
  {
    id: 14,
    category_id: 8,
    gender_category: 'kids',
    category_name: 'Girls Collection',
    category_slug: 'kids-girls',
    name: 'Cable Knit Merino Wool Cardigan',
    slug: 'kids-girls-cable-merino-cardigan',
    description: 'Heirloom-grade cable knit woven from soft merino wool that never itches. Decorated with genuine wooden buttons and ribbed scalloped trims.',
    fabric_details: '100% Pure Merino Wool (Hypoallergenic & Non-Scratch).',
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
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80'
    ],
    availableColors: [
      { name: 'Vanilla Cream', hex: '#f3ede2' },
      { name: 'Lilac Mist', hex: '#c8b6ff' }
    ],
    availableSizes: ['2Y', '3-4Y', '5-6Y', '7-8Y'],
    variants: [
      { id: 1401, size: '3-4Y', color_name: 'Vanilla Cream', color_hex: '#f3ede2', stock: 10 }
    ]
  }
];

export const INITIAL_USERS = [
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
    is_active: 1,
    created_at: '2026-01-10T10:00:00Z'
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
    is_active: 1,
    created_at: '2026-02-14T11:30:00Z'
  },
  {
    id: 3,
    name: 'Marcus Sterling',
    email: 'marcus@example.com',
    role: 'customer',
    phone: '+1 (555) 438-2199',
    address: '88 Commonwealth Ave',
    city: 'Boston',
    state: 'MA',
    postal_code: '02116',
    country: 'United States',
    is_active: 1,
    created_at: '2026-03-01T15:20:00Z'
  }
];

export const INITIAL_COUPONS = [
  {
    id: 1,
    code: 'WELCOME10',
    description: 'Welcome 10% discount on your first order',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 50,
    max_discount_amount: 50,
    is_active: 1
  },
  {
    id: 2,
    code: 'LUXE20',
    description: '20% discount on orders over $150',
    discount_type: 'percentage',
    discount_value: 20,
    min_order_amount: 150,
    max_discount_amount: 100,
    is_active: 1
  },
  {
    id: 3,
    code: 'ATELIER50',
    description: '$50 flat reduction on orders over $250',
    discount_type: 'fixed',
    discount_value: 50,
    min_order_amount: 250,
    max_discount_amount: 50,
    is_active: 1
  }
];

export const INITIAL_ORDERS = [
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
  },
  {
    id: 3,
    order_number: 'ORD-2026-9118',
    user_id: 3,
    customer_name: 'Marcus Sterling',
    customer_email: 'marcus@example.com',
    customer_phone: '+1 (555) 438-2199',
    shipping_address: '88 Commonwealth Ave',
    city: 'Boston',
    state: 'MA',
    postal_code: '02116',
    country: 'United States',
    subtotal: 280.00,
    discount: 50.00,
    shipping_fee: 0.00,
    tax: 19.55,
    total: 249.55,
    coupon_code: 'ATELIER50',
    payment_method: 'credit_card',
    payment_status: 'paid',
    order_status: 'Shipped',
    tracking_number: 'DHL-883726190',
    created_at: '2026-03-22T16:45:00Z',
    items: [
      {
        id: 3,
        product_id: 3,
        product_name: 'Supima Cotton Oxford Button-Down',
        product_image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
        size: 'L',
        color: 'Crisp White',
        price: 95.00,
        quantity: 1,
        total: 95.00
      },
      {
        id: 4,
        product_id: 5,
        product_name: 'Pleated Wool Flannel Trouser',
        product_image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80',
        size: '34',
        color: 'Charcoal Melange',
        price: 185.00,
        quantity: 1,
        total: 185.00
      }
    ]
  }
];

export const INITIAL_SETTINGS = {
  store_name: 'Aangan Luxury Apparel',
  store_tagline: 'Contemporary Elegance & Timeless Wardrobe Essentials',
  currency_symbol: '$',
  tax_rate_percent: '8.5',
  free_shipping_threshold: '150',
  standard_shipping_rate: '12.00',
  support_email: 'concierge@aanganclothing.com',
  support_phone: '+1 (800) 492-8350'
};
