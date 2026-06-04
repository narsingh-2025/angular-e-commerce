require('dotenv').config();
const mongoose  = require('mongoose');
const Category  = require('./models/Category');
const Product   = require('./models/Product');
const BulkOrder = require('./models/BulkOrder');
const Farmer    = require('./models/Farmer');
const Review    = require('./models/Review');

const categories = [
  { name: 'Stationery', slug: 'stationery', icon: '✏️', color: '#8b5cf6', description: 'Office and school stationery', sortOrder: 1,
    subcategories: [{ name: 'Pens & Pencils', slug: 'pens-pencils' }, { name: 'Notebooks', slug: 'notebooks' }, { name: 'Files & Folders', slug: 'files-folders' }, { name: 'Art Supplies', slug: 'art-supplies' }] },
  { name: 'Clothing', slug: 'clothing', icon: '👔', color: '#ec4899', description: 'Men, women and kids clothing', sortOrder: 2,
    subcategories: [{ name: "Men's Wear", slug: 'mens-wear' }, { name: "Women's Wear", slug: 'womens-wear' }, { name: 'Kids Wear', slug: 'kids-wear' }, { name: 'Uniforms', slug: 'uniforms' }] },
  { name: 'Food Grains', slug: 'food-grains', icon: '🌾', color: '#f59e0b', description: 'Rice, wheat, pulses and cereals', sortOrder: 3,
    subcategories: [{ name: 'Rice', slug: 'rice' }, { name: 'Wheat & Flour', slug: 'wheat-flour' }, { name: 'Pulses & Lentils', slug: 'pulses-lentils' }, { name: 'Cereals', slug: 'cereals' }] },
  { name: 'Vegetables', slug: 'vegetables', icon: '🥦', color: '#10b981', description: 'Fresh farm vegetables', sortOrder: 4,
    subcategories: [{ name: 'Leafy Greens', slug: 'leafy-greens' }, { name: 'Root Vegetables', slug: 'root-vegetables' }, { name: 'Gourds', slug: 'gourds' }, { name: 'Exotic Vegetables', slug: 'exotic-vegetables' }] },
  { name: 'Electronics', slug: 'electronics', icon: '💻', color: '#3b82f6', description: 'Gadgets and devices', sortOrder: 5,
    subcategories: [{ name: 'Computers', slug: 'computers' }, { name: 'Mobile Accessories', slug: 'mobile-accessories' }, { name: 'Audio', slug: 'audio' }, { name: 'Smart Devices', slug: 'smart-devices' }] },
  { name: 'Kitchen & Home', slug: 'kitchen-home', icon: '🏠', color: '#ef4444', description: 'Kitchen and home essentials', sortOrder: 6,
    subcategories: [{ name: 'Cookware', slug: 'cookware' }, { name: 'Storage', slug: 'storage' }, { name: 'Cleaning', slug: 'cleaning' }, { name: 'Decor', slug: 'decor' }] },
];

const farmerData = [
  { name: 'Rajendra Patidar', farmName: 'Patidar Organic Farm', phone: '9876543210', email: 'rajendra@farm.in', location: 'Indore, Madhya Pradesh', state: 'Madhya Pradesh', description: 'Third-generation farmer specializing in organic wheat and pulses. All produce is chemical-free and naturally irrigated from the Narmada canal.', coverColor: '#f59e0b', specialities: ['Organic Wheat', 'Moong Dal', 'Chana Dal'], certifications: ['FSSAI', 'Organic India'], isOrganic: true, isVerified: true, yearsActive: 22, rating: 4.8 },
  { name: 'Sunita Devi', farmName: 'Green Valley Vegetables', phone: '9765432109', email: 'sunita@greenvalley.in', location: 'Nashik, Maharashtra', state: 'Maharashtra', description: 'Running a 15-acre vegetable farm with drip irrigation. Supplies fresh tomatoes, onions and greens to markets across Mumbai and Pune.', coverColor: '#10b981', specialities: ['Tomatoes', 'Onions', 'Leafy Greens'], certifications: ['FSSAI'], isOrganic: false, isVerified: true, yearsActive: 12, rating: 4.6 },
  { name: 'Mohammed Farooq', farmName: 'Farooq Rice Mill & Farm', phone: '9654321098', email: 'farooq@ricemill.in', location: 'Karnal, Haryana', state: 'Haryana', description: 'Premium basmati rice grower from the rice bowl of India — Karnal. Aged rice stored in climate-controlled silos for authentic fragrance.', coverColor: '#f59e0b', specialities: ['Basmati Rice', 'Brown Rice', 'Broken Rice'], certifications: ['APEDA', 'FSSAI', 'Export Quality'], isOrganic: false, isVerified: true, yearsActive: 35, rating: 4.9 },
  { name: 'Kavitha Reddy', farmName: 'Reddy Organic Gardens', phone: '9543210987', email: 'kavitha@organicgarden.in', location: 'Coimbatore, Tamil Nadu', state: 'Tamil Nadu', description: 'Certified organic vegetable and herb farm. Grows exotic vegetables and traditional Tamil varieties using ancient Varagu and Kuthiraivali methods.', coverColor: '#10b981', specialities: ['Organic Vegetables', 'Herbs', 'Exotic Greens'], certifications: ['Organic India', 'FSSAI', 'PGS India'], isOrganic: true, isVerified: true, yearsActive: 8, rating: 4.7 },
  { name: 'Gurpreet Singh', farmName: 'Punjab Golden Fields', phone: '9432109876', email: 'gurpreet@goldenfields.in', location: 'Ludhiana, Punjab', state: 'Punjab', description: 'Large-scale wheat and mustard farming in the golden fields of Punjab. Supplying quality grain to mills and traders across North India.', coverColor: '#f59e0b', specialities: ['Wheat', 'Mustard', 'Barley'], certifications: ['FSSAI'], isOrganic: false, isVerified: false, yearsActive: 18, rating: 4.4 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Clearing data...');
  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), BulkOrder.deleteMany({}), Farmer.deleteMany({}), Review.deleteMany({})]);

  console.log('Seeding categories...');
  const cats = await Category.insertMany(categories);
  const C = Object.fromEntries(cats.map(c => [c.slug, c._id]));

  console.log('Seeding farmers...');
  const farmers = await Farmer.insertMany(farmerData);
  const F = { patidar: farmers[0]._id, sunita: farmers[1]._id, farooq: farmers[2]._id, kavitha: farmers[3]._id, gurpreet: farmers[4]._id };

  console.log('Seeding products...');
  const products = await Product.insertMany([
    // Stationery
    { name: 'Premium Ball Pen (Box 50)', description: 'Smooth writing blue/black pens, office grade.', price: 299, category: C['stationery'], subcategory: 'Pens & Pencils', unit: 'box', stock: 500, minOrderQty: 10, isFeatured: true, bulkPricing: [{ minQty: 50, price: 249 }, { minQty: 100, price: 199 }], tags: ['pen', 'office'], avgRating: 4.2, reviewCount: 14 },
    { name: 'A4 Ruled Notebooks (Pack 12)', description: '200-page hard cover ruled notebooks.', price: 480, category: C['stationery'], subcategory: 'Notebooks', unit: 'pack', stock: 300, minOrderQty: 5, isFeatured: true, bulkPricing: [{ minQty: 25, price: 420 }], tags: ['notebook'], avgRating: 4.5, reviewCount: 22 },
    { name: 'Whiteboard Markers Set (10)', description: 'Assorted colors, chisel tip.', price: 180, category: C['stationery'], subcategory: 'Art Supplies', unit: 'set', stock: 400, minOrderQty: 5, tags: ['marker', 'whiteboard'], avgRating: 4.0, reviewCount: 8 },
    { name: 'A4 Plastic Folders (100 pcs)', description: 'Transparent document folders.', price: 650, category: C['stationery'], subcategory: 'Files & Folders', unit: 'pack', stock: 200, minOrderQty: 2, tags: ['folder', 'office'], avgRating: 3.8, reviewCount: 5 },
    // Clothing
    { name: "Men's Cotton Formal Shirt", description: 'Premium cotton, sizes S-XXL, white/blue/grey.', price: 850, category: C['clothing'], subcategory: "Men's Wear", unit: 'piece', stock: 250, minOrderQty: 10, isFeatured: true, bulkPricing: [{ minQty: 50, price: 720 }, { minQty: 100, price: 650 }], tags: ['shirt', 'formal', 'men'], avgRating: 4.3, reviewCount: 31 },
    { name: "Women's Salwar Kameez Set", description: 'Cotton blend with dupatta, multiple colors.', price: 1200, category: C['clothing'], subcategory: "Women's Wear", unit: 'set', stock: 180, minOrderQty: 5, isFeatured: true, bulkPricing: [{ minQty: 25, price: 1050 }], tags: ['salwar', 'women', 'ethnic'], avgRating: 4.6, reviewCount: 45 },
    { name: 'School Uniform Set (Kids)', description: 'Cotton shirt + pant, sizes 4–14 years.', price: 680, category: C['clothing'], subcategory: 'Kids Wear', unit: 'set', stock: 400, minOrderQty: 20, bulkPricing: [{ minQty: 50, price: 580 }, { minQty: 100, price: 520 }], tags: ['uniform', 'school', 'kids'], avgRating: 4.1, reviewCount: 18 },
    { name: 'Corporate Polo T-Shirt', description: 'Embroidered logo polo for uniforms.', price: 550, category: C['clothing'], subcategory: 'Uniforms', unit: 'piece', stock: 500, minOrderQty: 50, bulkPricing: [{ minQty: 100, price: 480 }, { minQty: 500, price: 420 }], tags: ['polo', 'corporate'], avgRating: 4.4, reviewCount: 12 },
    // Food Grains — linked to farmers
    { name: 'Basmati Rice Premium (50 kg)', description: 'Long grain aged basmati, fragrant and fluffy. Directly from Karnal, Haryana.', price: 3200, category: C['food-grains'], subcategory: 'Rice', unit: 'bag', stock: 150, minOrderQty: 2, isFeatured: true, farmer: F.farooq, isOrganic: false, farmLocation: 'Karnal, Haryana', harvestSeason: 'Oct–Nov', bulkPricing: [{ minQty: 10, price: 2950 }, { minQty: 25, price: 2750 }], tags: ['rice', 'basmati'], avgRating: 4.9, reviewCount: 67 },
    { name: 'Organic Whole Wheat (50 kg)', description: 'Stone-ground organic wheat from Punjab. High fiber, no pesticides.', price: 2200, category: C['food-grains'], subcategory: 'Wheat & Flour', unit: 'bag', stock: 200, minOrderQty: 2, isFeatured: true, farmer: F.gurpreet, isOrganic: true, farmLocation: 'Ludhiana, Punjab', harvestSeason: 'Mar–Apr', bulkPricing: [{ minQty: 10, price: 1950 }, { minQty: 25, price: 1800 }], tags: ['wheat', 'organic'], avgRating: 4.7, reviewCount: 43 },
    { name: 'Organic Moong Dal (25 kg)', description: 'Split yellow moong from Madhya Pradesh. Certified organic.', price: 2800, category: C['food-grains'], subcategory: 'Pulses & Lentils', unit: 'bag', stock: 120, minOrderQty: 2, farmer: F.patidar, isOrganic: true, farmLocation: 'Indore, MP', harvestSeason: 'Sep–Oct', bulkPricing: [{ minQty: 10, price: 2600 }], tags: ['moong', 'dal', 'organic'], avgRating: 4.8, reviewCount: 29 },
    { name: 'Chana Dal (25 kg)', description: 'Bengal gram split lentils, premium grade.', price: 2100, category: C['food-grains'], subcategory: 'Pulses & Lentils', unit: 'bag', stock: 160, minOrderQty: 2, farmer: F.patidar, farmLocation: 'Indore, MP', bulkPricing: [{ minQty: 10, price: 1950 }], tags: ['chana', 'dal'], avgRating: 4.4, reviewCount: 21 },
    // Vegetables — linked to farmers
    { name: 'Fresh Tomatoes (5 kg)', description: 'Farm-fresh red tomatoes from Nashik. Delivered within 24 hrs.', price: 120, category: C['vegetables'], subcategory: 'Root Vegetables', unit: 'kg', stock: 800, minOrderQty: 5, isFeatured: true, farmer: F.sunita, farmLocation: 'Nashik, Maharashtra', harvestSeason: 'Year-round', bulkPricing: [{ minQty: 50, price: 100 }, { minQty: 100, price: 85 }], tags: ['tomato', 'fresh'], avgRating: 4.5, reviewCount: 38 },
    { name: 'Red Onions (25 kg)', description: 'Dry outer skin, strong flavor. Nashik\'s finest.', price: 580, category: C['vegetables'], subcategory: 'Root Vegetables', unit: 'bag', stock: 600, minOrderQty: 5, isFeatured: true, farmer: F.sunita, farmLocation: 'Nashik, Maharashtra', harvestSeason: 'Dec–May', bulkPricing: [{ minQty: 20, price: 520 }, { minQty: 50, price: 470 }], tags: ['onion'], avgRating: 4.3, reviewCount: 52 },
    { name: 'Organic Spinach (1 kg bundle)', description: 'Tender spinach, chemical-free, from Tamil Nadu organic farm.', price: 55, category: C['vegetables'], subcategory: 'Leafy Greens', unit: 'bundle', stock: 300, minOrderQty: 10, farmer: F.kavitha, isOrganic: true, farmLocation: 'Coimbatore, TN', tags: ['spinach', 'organic', 'greens'], avgRating: 4.6, reviewCount: 14 },
    { name: 'Potatoes (25 kg)', description: 'White potatoes, good size, low sprout, long shelf life.', price: 480, category: C['vegetables'], subcategory: 'Root Vegetables', unit: 'bag', stock: 700, minOrderQty: 5, farmer: F.sunita, farmLocation: 'Nashik, Maharashtra', bulkPricing: [{ minQty: 20, price: 430 }, { minQty: 50, price: 390 }], tags: ['potato'], avgRating: 4.1, reviewCount: 27 },
    // Electronics
    { name: 'Wireless Headphones', description: 'Noise-cancelling Bluetooth, 30hr battery.', price: 2499, category: C['electronics'], subcategory: 'Audio', unit: 'piece', stock: 80, minOrderQty: 1, isFeatured: true, bulkPricing: [{ minQty: 10, price: 2200 }], tags: ['headphones', 'bluetooth'], avgRating: 4.3, reviewCount: 19 },
    { name: 'Mechanical Keyboard RGB', description: 'USB mechanical keyboard, Cherry MX Blue switches.', price: 3499, category: C['electronics'], subcategory: 'Computers', unit: 'piece', stock: 60, minOrderQty: 1, bulkPricing: [{ minQty: 5, price: 3200 }], tags: ['keyboard', 'mechanical'], avgRating: 4.5, reviewCount: 11 },
    { name: 'USB-C Hub 7-in-1', description: 'HDMI, USB 3.0 x3, SD card, PD charging.', price: 1299, category: C['electronics'], subcategory: 'Computers', unit: 'piece', stock: 120, minOrderQty: 1, tags: ['usb hub', 'accessories'], avgRating: 4.2, reviewCount: 7 },
    // Kitchen
    { name: 'Steel Water Bottle 1L', description: 'Double-wall insulated, hot/cold 24 hrs.', price: 450, category: C['kitchen-home'], subcategory: 'Storage', unit: 'piece', stock: 350, minOrderQty: 10, isFeatured: true, bulkPricing: [{ minQty: 50, price: 380 }, { minQty: 100, price: 340 }], tags: ['bottle', 'steel'], avgRating: 4.4, reviewCount: 33 },
    { name: 'Non-stick Cookware Set (5 pcs)', description: 'Granite-coated non-stick set with glass lids.', price: 2200, category: C['kitchen-home'], subcategory: 'Cookware', unit: 'set', stock: 90, minOrderQty: 2, bulkPricing: [{ minQty: 10, price: 1950 }], tags: ['cookware', 'nonstick'], avgRating: 4.0, reviewCount: 16 },
    { name: 'Spin Mop & Bucket Set', description: 'Microfiber 360° spin mop with wringer bucket.', price: 680, category: C['kitchen-home'], subcategory: 'Cleaning', unit: 'set', stock: 200, minOrderQty: 5, tags: ['mop', 'cleaning'], avgRating: 3.9, reviewCount: 9 },
  ]);

  // Seed reviews for featured products
  const reviewTemplates = [
    { name: 'Ankit Sharma', email: 'ankit@gmail.com', rating: 5, title: 'Excellent quality!', comment: 'Got exactly what was described. Delivery was fast and packaging was great.' },
    { name: 'Priya Mehta', email: 'priya@gmail.com', rating: 4, title: 'Good product', comment: 'Quality is good, would have given 5 stars if the packaging was better.' },
    { name: 'Rahul Gupta', email: 'rahul@gmail.com', rating: 5, title: 'Best in class', comment: 'Been buying from here for 6 months. Always fresh and quality is consistent.' },
    { name: 'Sunita Rao', email: 'sunita@gmail.com', rating: 4, title: 'Value for money', comment: 'Competitive pricing and good quality. Will order again for sure.' },
    { name: 'Deepak Joshi', email: 'deepak@gmail.com', rating: 3, title: 'Decent product', comment: 'Average quality. Expected better based on the description.' },
  ];

  const featuredProducts = products.filter(p => p.isFeatured);
  const reviewPromises = [];
  featuredProducts.forEach(p => {
    reviewTemplates.slice(0, 3).forEach(t => {
      reviewPromises.push(new Review({ product: p._id, ...t, verified: true }).save());
    });
  });
  await Promise.all(reviewPromises);

  console.log('Seeding bulk inquiries...');
  await BulkOrder.insertMany([
    { name: 'Rajesh Kumar', email: 'rajesh@schools.com', phone: '9876543210', company: 'School Supply Co.', category: 'Stationery', items: [{ productName: 'Ball Pen Box 50', quantity: 200, unit: 'box' }], message: 'Monthly supply for 10 schools. Quote bulk pricing.', status: 'pending' },
    { name: 'Priya Sharma', email: 'priya@clothhub.in', phone: '9812345678', company: 'Cloth Hub India', category: 'Clothing', items: [{ productName: 'Corporate Polo T-Shirt', quantity: 1000, unit: 'piece' }], message: 'Uniform supplier for corporate clients. 3-week delivery.', status: 'contacted' },
    { name: 'Farooq Traders', email: 'farooq@grainsmart.com', phone: '9765432109', company: 'GrainSmart', category: 'Food Grains', items: [{ productName: 'Basmati Rice', quantity: 100, unit: 'bag' }], message: 'Supply to 50 restaurants. Weekly restocking needed.', status: 'quoted' },
    { name: 'FreshMart Retail', email: 'sunita@freshmart.com', phone: '9654321098', company: 'FreshMart', category: 'Vegetables', items: [{ productName: 'Onions 25kg', quantity: 500, unit: 'bag' }], message: '5 supermarkets. Daily fresh vegetable deliveries.', status: 'pending' },
  ]);

  console.log(`✅ Seed complete! ${cats.length} cats, ${products.length} products, ${farmers.length} farmers, ${reviewPromises.length} reviews.`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
