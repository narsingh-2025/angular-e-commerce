require('dotenv').config();
const mongoose  = require('mongoose');
const Category  = require('./models/Category');
const Product   = require('./models/Product');
const BulkOrder = require('./models/BulkOrder');

const categories = [
  { name: 'Stationery', slug: 'stationery', icon: '✏️', color: '#8b5cf6', description: 'Office and school stationery supplies', sortOrder: 1,
    subcategories: [{ name: 'Pens & Pencils', slug: 'pens-pencils' }, { name: 'Notebooks', slug: 'notebooks' }, { name: 'Files & Folders', slug: 'files-folders' }, { name: 'Art Supplies', slug: 'art-supplies' }] },
  { name: 'Clothing', slug: 'clothing', icon: '👔', color: '#ec4899', description: 'Men, women and children clothing', sortOrder: 2,
    subcategories: [{ name: 'Men\'s Wear', slug: 'mens-wear' }, { name: 'Women\'s Wear', slug: 'womens-wear' }, { name: 'Kids Wear', slug: 'kids-wear' }, { name: 'Uniforms', slug: 'uniforms' }] },
  { name: 'Food Grains', slug: 'food-grains', icon: '🌾', color: '#f59e0b', description: 'Rice, wheat, pulses and cereals', sortOrder: 3,
    subcategories: [{ name: 'Rice', slug: 'rice' }, { name: 'Wheat & Flour', slug: 'wheat-flour' }, { name: 'Pulses & Lentils', slug: 'pulses-lentils' }, { name: 'Cereals', slug: 'cereals' }] },
  { name: 'Vegetables', slug: 'vegetables', icon: '🥦', color: '#10b981', description: 'Fresh and wholesale vegetables', sortOrder: 4,
    subcategories: [{ name: 'Leafy Greens', slug: 'leafy-greens' }, { name: 'Root Vegetables', slug: 'root-vegetables' }, { name: 'Gourds', slug: 'gourds' }, { name: 'Exotic Vegetables', slug: 'exotic-vegetables' }] },
  { name: 'Electronics', slug: 'electronics', icon: '💻', color: '#3b82f6', description: 'Gadgets and electronic devices', sortOrder: 5,
    subcategories: [{ name: 'Computers', slug: 'computers' }, { name: 'Mobile Accessories', slug: 'mobile-accessories' }, { name: 'Audio', slug: 'audio' }, { name: 'Smart Devices', slug: 'smart-devices' }] },
  { name: 'Kitchen & Home', slug: 'kitchen-home', icon: '🏠', color: '#ef4444', description: 'Kitchen tools, cookware and home essentials', sortOrder: 6,
    subcategories: [{ name: 'Cookware', slug: 'cookware' }, { name: 'Storage', slug: 'storage' }, { name: 'Cleaning', slug: 'cleaning' }, { name: 'Decor', slug: 'decor' }] },
];

const productData = (catMap) => [
  // Stationery
  { name: 'Premium Ball Pen (Box of 50)', description: 'Smooth writing blue/black ball pens, ideal for offices and schools.', price: 299, category: catMap['stationery'], subcategory: 'Pens & Pencils', unit: 'box', stock: 500, minOrderQty: 10, isFeatured: true, bulkPricing: [{ minQty: 50, price: 249 }, { minQty: 100, price: 199 }], tags: ['pen', 'stationery', 'office'] },
  { name: 'A4 Ruled Notebook (Pack of 12)', description: '200-page ruled notebooks, hard cover, premium quality paper.', price: 480, category: catMap['stationery'], subcategory: 'Notebooks', unit: 'pack', stock: 300, minOrderQty: 5, isFeatured: true, bulkPricing: [{ minQty: 25, price: 420 }, { minQty: 50, price: 380 }], tags: ['notebook', 'stationery'] },
  { name: 'Plastic File Folders (Pack of 100)', description: 'A4 size transparent plastic document folders with button closure.', price: 650, category: catMap['stationery'], subcategory: 'Files & Folders', unit: 'pack', stock: 200, minOrderQty: 2, bulkPricing: [{ minQty: 10, price: 590 }], tags: ['folder', 'file', 'stationery'] },
  { name: 'Whiteboard Markers Set', description: 'Assorted color whiteboard markers, chisel tip, pack of 10.', price: 180, category: catMap['stationery'], subcategory: 'Art Supplies', unit: 'set', stock: 400, minOrderQty: 5, tags: ['marker', 'whiteboard'] },

  // Clothing
  { name: 'Men\'s Cotton Formal Shirt', description: 'Full-sleeve formal shirt in premium cotton, available in white, blue, grey.', price: 850, category: catMap['clothing'], subcategory: 'Men\'s Wear', unit: 'piece', stock: 250, minOrderQty: 10, isFeatured: true, bulkPricing: [{ minQty: 50, price: 720 }, { minQty: 100, price: 650 }], tags: ['shirt', 'formal', 'men'] },
  { name: 'Women\'s Salwar Kameez Set', description: 'Cotton blend salwar kameez with dupatta, multiple colors available.', price: 1200, category: catMap['clothing'], subcategory: 'Women\'s Wear', unit: 'set', stock: 180, minOrderQty: 5, isFeatured: true, bulkPricing: [{ minQty: 25, price: 1050 }, { minQty: 50, price: 950 }], tags: ['salwar', 'women', 'ethnic'] },
  { name: 'School Uniform Set (Kids)', description: 'Cotton school uniform shirt + pant set for kids, sizes 4–14 years.', price: 680, category: catMap['clothing'], subcategory: 'Kids Wear', unit: 'set', stock: 400, minOrderQty: 20, bulkPricing: [{ minQty: 50, price: 580 }, { minQty: 100, price: 520 }], tags: ['uniform', 'school', 'kids'] },
  { name: 'Corporate Polo T-Shirt', description: 'Custom embroidered logo polo t-shirt for corporate gifting and uniforms.', price: 550, category: catMap['clothing'], subcategory: 'Uniforms', unit: 'piece', stock: 500, minOrderQty: 50, bulkPricing: [{ minQty: 100, price: 480 }, { minQty: 500, price: 420 }], tags: ['polo', 'corporate', 'uniform'] },

  // Food Grains
  { name: 'Basmati Rice Premium (50 kg)', description: 'Long grain aged basmati rice, fragrant and fluffy. Ideal for restaurants.', price: 3200, category: catMap['food-grains'], subcategory: 'Rice', unit: 'bag', stock: 150, minOrderQty: 5, isFeatured: true, bulkPricing: [{ minQty: 10, price: 2950 }, { minQty: 25, price: 2750 }], tags: ['rice', 'basmati', 'grains'] },
  { name: 'Whole Wheat Flour (Atta) 50 kg', description: 'Stone-ground whole wheat flour, high fiber, suitable for chapati and bread.', price: 1850, category: catMap['food-grains'], subcategory: 'Wheat & Flour', unit: 'bag', stock: 200, minOrderQty: 5, isFeatured: true, bulkPricing: [{ minQty: 20, price: 1650 }, { minQty: 50, price: 1500 }], tags: ['wheat', 'atta', 'flour'] },
  { name: 'Yellow Moong Dal (25 kg)', description: 'Split yellow moong lentils, clean and sorted. High protein content.', price: 2400, category: catMap['food-grains'], subcategory: 'Pulses & Lentils', unit: 'bag', stock: 120, minOrderQty: 2, bulkPricing: [{ minQty: 10, price: 2200 }, { minQty: 25, price: 2050 }], tags: ['moong', 'dal', 'pulses'] },
  { name: 'Chana Dal (25 kg)', description: 'Bengal gram split lentils, premium grade, low moisture content.', price: 2100, category: catMap['food-grains'], subcategory: 'Pulses & Lentils', unit: 'bag', stock: 160, minOrderQty: 2, bulkPricing: [{ minQty: 10, price: 1950 }], tags: ['chana', 'dal', 'pulses'] },

  // Vegetables
  { name: 'Fresh Tomatoes (5 kg)', description: 'Farm-fresh red tomatoes, medium size, ideal for restaurants and retail.', price: 120, category: catMap['vegetables'], subcategory: 'Root Vegetables', unit: 'kg', stock: 800, minOrderQty: 10, isFeatured: true, bulkPricing: [{ minQty: 50, price: 100 }, { minQty: 100, price: 85 }], tags: ['tomato', 'vegetable', 'fresh'] },
  { name: 'Onions (25 kg)', description: 'Red onions, dry outer skin, pungent flavor. Bulk wholesale price.', price: 580, category: catMap['vegetables'], subcategory: 'Root Vegetables', unit: 'bag', stock: 600, minOrderQty: 5, isFeatured: true, bulkPricing: [{ minQty: 20, price: 520 }, { minQty: 50, price: 470 }], tags: ['onion', 'vegetable'] },
  { name: 'Fresh Spinach (1 kg bundle)', description: 'Tender leafy spinach, freshly harvested, rich in iron.', price: 45, category: catMap['vegetables'], subcategory: 'Leafy Greens', unit: 'bundle', stock: 300, minOrderQty: 20, bulkPricing: [{ minQty: 100, price: 35 }], tags: ['spinach', 'greens', 'vegetable'] },
  { name: 'Potatoes (25 kg)', description: 'White potatoes, good size, low sprout, long shelf life. Ideal for chips.', price: 480, category: catMap['vegetables'], subcategory: 'Root Vegetables', unit: 'bag', stock: 700, minOrderQty: 5, bulkPricing: [{ minQty: 20, price: 430 }, { minQty: 50, price: 390 }], tags: ['potato', 'vegetable'] },

  // Electronics
  { name: 'Wireless Headphones', description: 'Noise-cancelling Bluetooth headphones, 30hr battery life.', price: 2499, category: catMap['electronics'], subcategory: 'Audio', unit: 'piece', stock: 80, minOrderQty: 1, isFeatured: true, bulkPricing: [{ minQty: 10, price: 2200 }], tags: ['headphones', 'bluetooth', 'audio'] },
  { name: 'Mechanical Keyboard RGB', description: 'USB mechanical keyboard with RGB backlight, Cherry MX Blue switches.', price: 3499, category: catMap['electronics'], subcategory: 'Computers', unit: 'piece', stock: 60, minOrderQty: 1, bulkPricing: [{ minQty: 5, price: 3200 }], tags: ['keyboard', 'mechanical', 'computer'] },
  { name: 'USB-C Hub 7-in-1', description: 'USB-C hub with HDMI, USB 3.0 x3, SD card, PD charging.', price: 1299, category: catMap['electronics'], subcategory: 'Computers', unit: 'piece', stock: 120, minOrderQty: 1, bulkPricing: [{ minQty: 10, price: 1100 }], tags: ['usb hub', 'accessories'] },

  // Kitchen & Home
  { name: 'Stainless Steel Water Bottle 1L', description: 'Double-wall insulated bottle, keeps hot/cold 24 hours.', price: 450, category: catMap['kitchen-home'], subcategory: 'Storage', unit: 'piece', stock: 350, minOrderQty: 10, isFeatured: true, bulkPricing: [{ minQty: 50, price: 380 }, { minQty: 100, price: 340 }], tags: ['bottle', 'kitchen', 'steel'] },
  { name: 'Non-stick Cookware Set (5 pcs)', description: 'Granite-coated non-stick pots and pans set with glass lids.', price: 2200, category: catMap['kitchen-home'], subcategory: 'Cookware', unit: 'set', stock: 90, minOrderQty: 2, bulkPricing: [{ minQty: 10, price: 1950 }], tags: ['cookware', 'kitchen', 'nonstick'] },
  { name: 'Mop & Bucket Cleaning Set', description: 'Spin mop with wringer bucket, microfiber head, 360° rotation.', price: 680, category: catMap['kitchen-home'], subcategory: 'Cleaning', unit: 'set', stock: 200, minOrderQty: 5, bulkPricing: [{ minQty: 20, price: 580 }], tags: ['mop', 'cleaning', 'home'] },
];

const sampleInquiries = [
  { name: 'Rajesh Kumar', email: 'rajesh@schoolsupply.com', phone: '9876543210', company: 'School Supply Co.', category: 'Stationery', items: [{ productName: 'Premium Ball Pen (Box of 50)', quantity: 200, unit: 'box' }, { productName: 'A4 Ruled Notebook', quantity: 500, unit: 'pack' }], message: 'We need monthly supply of stationery for 10 schools. Please quote bulk pricing.', status: 'pending' },
  { name: 'Priya Sharma', email: 'priya@clothhub.in', phone: '9812345678', company: 'Cloth Hub India', category: 'Clothing', items: [{ productName: 'Corporate Polo T-Shirt', quantity: 1000, unit: 'piece' }, { productName: 'School Uniform Set', quantity: 500, unit: 'set' }], message: 'Looking for uniform supplier for corporate clients. Need delivery in 3 weeks.', status: 'contacted' },
  { name: 'Mohammed Farooq', email: 'farooq@grainsmart.com', phone: '9765432109', company: 'GrainSmart Traders', category: 'Food Grains', items: [{ productName: 'Basmati Rice Premium', quantity: 100, unit: 'bag' }, { productName: 'Whole Wheat Flour', quantity: 50, unit: 'bag' }], message: 'We supply to 50 restaurants in the city. Need weekly restocking.', status: 'quoted' },
  { name: 'Sunita Patel', email: 'sunita@freshmart.com', phone: '9654321098', company: 'FreshMart Retail', category: 'Vegetables', items: [{ productName: 'Onions', quantity: 500, unit: 'bag' }, { productName: 'Potatoes', quantity: 300, unit: 'bag' }], message: 'Running a chain of 5 supermarkets. Need daily fresh vegetable deliveries.', status: 'pending' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Clearing old data...');
  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), BulkOrder.deleteMany({})]);

  console.log('Seeding categories...');
  const insertedCats = await Category.insertMany(categories);
  const catMap = {};
  insertedCats.forEach(c => { catMap[c.slug] = c._id; });

  console.log('Seeding products...');
  await Product.insertMany(productData(catMap));

  console.log('Seeding bulk order inquiries...');
  await BulkOrder.insertMany(sampleInquiries);

  console.log('✅ Seed complete!', insertedCats.length, 'categories,', productData(catMap).length, 'products, 4 inquiries.');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
