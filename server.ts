import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Security Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// --------------------------------------------------------------------------
// Rate Limiter: 10 requests / minute per client on sensitive endpoints
// --------------------------------------------------------------------------
interface RateRecord {
  timestamps: number[];
  violationCount: number;
}
const rateLimitStore = new Map<string, RateRecord>();

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter(t => now - t < 60000);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(ip);
    }
  }
}, 300000);

const sensitiveRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10;

  let record = rateLimitStore.get(clientIp);
  if (!record) {
    record = { timestamps: [], violationCount: 0 };
    rateLimitStore.set(clientIp, record);
  }

  // Filter within window
  record.timestamps = record.timestamps.filter(t => now - t < windowMs);

  if (record.timestamps.length >= maxRequests) {
    record.violationCount += 1;
    const retryAfter = Math.ceil((record.timestamps[0] + windowMs - now) / 1000);
    console.warn(`[SECURITY] Rate limit exceeded by ${clientIp} on ${req.method} ${req.path}. Count: ${record.timestamps.length}`);
    res.setHeader('Retry-After', retryAfter > 0 ? retryAfter : 60);
    return res.status(429).json({
      error: 'Rate limit exceeded (10 req/min). Please try again shortly.',
      retryAfterSeconds: retryAfter > 0 ? retryAfter : 60
    });
  }

  record.timestamps.push(now);
  next();
};

// --------------------------------------------------------------------------
// Store Database & Persistence
// --------------------------------------------------------------------------
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const initialData = {
  settings: {
    brandNameEn: 'Shree Bherunath Jewellers',
    brandNameHi: 'श्री भेरूनाथ ज्वेलर्स',
    taglineEn: 'Timeless Tradition. Exceptional Elegance.',
    taglineHi: 'परंपरा की खूबसूरती, आभूषणों की चमक।',
    logoText: 'SBJ',
    category: 'Gold & Silver Jewellery',
    whatsappNumber: '918850032920', // Configurable WhatsApp click-to-chat
    phone: '+91 88500 32920',
    addressEn: 'Shree Bherunath Jewellers, Near Kankroli Bus Stand, Kankroli, Rajsamand, Rajasthan 313324, India',
    addressHi: 'श्री भेरूनाथ ज्वेलर्स, कांकरोली बस स्टैंड के पास, कांकरोली, राजसमंद, राजस्थान ३१३३२४, भारत',
    instagramUrl: 'https://www.instagram.com/s_b_j_silver_hub?srtk=bGhmc3V0ajI1NTF4',
    mapsUrl: 'https://maps.google.com/?q=Shree+Bherunath+Jewellers+Near+Kankroli+Bus+Stand+Rajsamand+Rajasthan',
    openingHoursEn: 'Mon – Sat: 10:30 AM – 8:30 PM | Sunday: 11:00 AM – 6:00 PM',
    openingHoursHi: 'सोम – शनि: सुबह 10:30 – रात 8:30 | रविवार: सुबह 11:00 – शाम 6:00',
    liveRatesEnabled: true,
    gold24kRate: 78500, // INR per 10g
    gold22kRate: 72000, // INR per 10g
    silverRate: 94000,  // INR per 1kg
    ratesSource: 'IBJA (India Bullion and Jewellers Association) benchmark',
    ratesLastUpdated: new Date().toISOString()
  },
  admin: {
    // Salted hash for initial password 'sbj-royal-2026'
    salt: 'e9b28f731c4e',
    passwordHash: crypto.scryptSync('sbj-royal-2026', 'e9b28f731c4e', 64).toString('hex')
  },
  auditLogs: [
    {
      timestamp: new Date().toISOString(),
      action: 'SYSTEM_INIT',
      details: 'Store database initialized with authentic gold and silver jewellery collections.'
    }
  ],
  products: [
    {
      id: 'sbj-001',
      nameEn: 'Royal Kundan & Polki Antique Choker Set',
      nameHi: 'शाही कुंदन एवं पोलकी एंटीक चोकर सेट',
      category: 'Bridal Jewellery',
      materialEn: '22K Gold (916 BIS Hallmarked) with Natural Uncut Polki & Emerald Beads',
      materialHi: '22 कैरेट सोना (916 बीआईएस हॉलमार्क) प्राकृतिक पोलकी व पन्ना मोतियों सहित',
      purity: '22K (916 BIS Hallmarked)',
      weight: '68.4 g',
      dimensions: 'Choker width: 3.2 cm; Matching earrings: 5.5 cm',
      price: null, // Price on Request
      availability: 'Made to Order',
      isFeatured: true,
      image: '/products/choker-set.svg',
      descriptionEn: 'An opulent royal Rajputana choker crafted with hand-set polki uncut stones, traditional meenakari enameling on the reverse, and clusters of natural emerald drops.',
      descriptionHi: 'राजपूताना विरासत से प्रेरित भव्य चोकर, जिसमें कुशल कारीगरों द्वारा जड़े गए अनकट पोलकी, पीछे सुंदर मीनाकारी और पन्ना मोतियों की खूबसूरत लड़ियाँ शामिल हैं।'
    },
    {
      id: 'sbj-002',
      nameEn: 'Heritage Kasu Mala Lakshmi Long Necklace',
      nameHi: 'विरासत कासु माला महालक्ष्मी लंबा हार',
      category: 'Necklaces',
      materialEn: '22K Yellow Gold (916 BIS Hallmarked)',
      materialHi: '22 कैरेट पीला सोना (916 बीआईएस हॉलमार्क)',
      purity: '22K (916 BIS Hallmarked)',
      weight: '52.1 g',
      dimensions: 'Length: 26 inches (Adjustable dori)',
      price: null, // Price on Request
      availability: 'In Stock',
      isFeatured: true,
      image: '/products/kasu-mala.svg',
      descriptionEn: 'Traditional temple coin necklace embossed with Goddess Lakshmi motifs, representing prosperity and divine auspiciousness for festive and wedding ceremonies.',
      descriptionHi: 'मां लक्ष्मी की नक्काशीदार मुद्राओं से सुसज्जित पारंपरिक कासु माला, जो समृद्धि, सौभाग्य और भारतीय परंपरा का प्रतीक है।'
    },
    {
      id: 'sbj-003',
      nameEn: 'Handcrafted Antique Gold Kada Bangles (Pair)',
      nameHi: 'हस्तनिर्मित प्राचीन सोने के कड़े (जोड़ी)',
      category: 'Bangles',
      materialEn: '22K Gold (916 BIS Hallmarked) with Antique Patina',
      materialHi: '22 कैरेट सोना (916 हॉलमार्क) विंटेज फिनिश',
      purity: '22K (916 BIS Hallmarked)',
      weight: '44.8 g',
      dimensions: 'Size: 2-6 (Custom sizing available)',
      price: null,
      availability: 'In Stock',
      isFeatured: true,
      image: '/products/gold-kadas.svg',
      descriptionEn: 'Substantial solid gold kadas featuring intricate floral repoussé carving, screw lock mechanism, and timeless antique finish.',
      descriptionHi: 'पारंपरिक फूलों की नक्काशी और मजबूत स्क्रू लॉक के साथ तैयार किए गए 22 कैरेट सोने के कंगन।'
    },
    {
      id: 'sbj-004',
      nameEn: '925 Sterling Silver Royal Bridal Payal & Bichhiya Set',
      nameHi: '९२५ शुद्ध चांदी की शाही दुल्हन पायल एवं बिछिया सेट',
      category: 'Silver Jewellery',
      materialEn: '92.5% Pure Sterling Silver with Anti-Tarnish Coating',
      materialHi: '92.5% शुद्ध स्टर्लिंग चांदी (एंटी-टार्निश पॉलिश)',
      purity: '92.5% Sterling Silver',
      weight: '160 g',
      dimensions: 'Length: 10.5 inches with adjustable hooks',
      price: 18500, // Verified price in INR
      availability: 'In Stock',
      isFeatured: true,
      image: '/products/silver-payal.svg',
      descriptionEn: 'Magnificent bridal silver anklets with musical ghungroo bells and filigree craftsmanship, accompanied by intricately designed toe rings.',
      descriptionHi: 'मधुर घुंघरुओं और महीन जालीदार काम से सुसज्जित शुद्ध चांदी की दुल्हन पायल व मैचिंग बिछिया सेट।'
    },
    {
      id: 'sbj-005',
      nameEn: 'Authentic 925 Pure Silver Pooja Aarti Thali Set (7 Pieces)',
      nameHi: 'शुद्ध चांदी का पूजा आरती थाली सेट (७ वस्तुएं)',
      category: 'Silver Jewellery',
      materialEn: '925 Fine Sterling Silver with Bureau of Indian Standards Silver Hallmark',
      materialHi: '925 फाइन स्टर्लिंग चांदी, बीआईएस हॉलमार्क युक्त',
      purity: '92.5% Fine Silver',
      weight: '320 g',
      dimensions: 'Thali Diameter: 9 inches',
      price: 36000, // Verified price in INR
      availability: 'In Stock',
      isFeatured: false,
      image: '/products/pooja-thali.svg',
      descriptionEn: 'Sacred silverware ensemble comprising embossed floral thali, five-wick deepak, bell, kumkum containers, and panchpatra for devout rituals.',
      descriptionHi: 'शुभ प्रसंगों और दैनिक पूजा हेतु शुद्ध चांदी की थाली, पंचमुखी दीपक, घंटी, रोली-चावल पात्र और आचमन पंचपात्र।'
    },
    {
      id: 'sbj-006',
      nameEn: 'Traditional Rajasthani Aad & Borla Maang Tikka',
      nameHi: 'पारंपरिक राजस्थानी आड़ एवं बोरला मांग टीका',
      category: 'Traditional Jewellery',
      materialEn: '22K Gold (916 BIS Hallmarked) with Hand-cut Stones',
      materialHi: '22 कैरेट सोना (916 हॉलमार्क) हस्त-तराशे रत्नों सहित',
      purity: '22K (916 BIS Hallmarked)',
      weight: '48.2 g',
      dimensions: 'Aad width: 14 cm; Borla diameter: 2.2 cm',
      price: null,
      availability: 'Made to Order',
      isFeatured: true,
      image: '/products/jadau-pendant.svg',
      descriptionEn: 'The pride of Rajasthani royalty, this rigid crescent choker (Aad) is paired with a spherical gem-studded Borla for an unforgettable traditional bride.',
      descriptionHi: 'मेवाड़ और मारवाड़ की राजसी पहचान — सुनहरी नक्काशीदार आड़ और मोतियों से सज्जित पारंपरिक बोरला।'
    },
    {
      id: 'sbj-007',
      nameEn: 'Classic Solitaire Diamond & 18K Yellow Gold Ring',
      nameHi: 'क्लासिक सॉलिटेयर हीरा एवं १८ कैरेट गोल्ड अंगूठी',
      category: 'Rings',
      materialEn: '18K Yellow Gold (750 BIS Hallmarked) with VVS-EF Certified Diamond',
      materialHi: '18 कैरेट सोना (750 हॉलमार्क) एवं VVS-EF प्रमाणित हीरा',
      purity: '18K (750 Hallmarked)',
      weight: '4.8 g (Diamond: 0.70 ct)',
      dimensions: 'Size: 14 (Can be resized)',
      price: null,
      availability: 'In Stock',
      isFeatured: true,
      image: '/products/diamond-ring.svg',
      descriptionEn: 'Timeless engagement solitaire featuring an exceptional precision-cut diamond secured in a 6-prong gold crown.',
      descriptionHi: 'विशेष चमक और परिशुद्धता के साथ तैयार की गई शानदार सॉलिटेयर हीरे की सोने की अंगूठी।'
    },
    {
      id: 'sbj-008',
      nameEn: '22K Gold Traditional Peacock Jhumka Earrings',
      nameHi: '२२ कैरेट सोने के पारंपरिक मयूर झुमके',
      category: 'Earrings',
      materialEn: '22K Yellow Gold (916 BIS Hallmarked)',
      materialHi: '22 कैरेट पीला सोना (916 बीआईएस हॉलमार्क)',
      purity: '22K (916 BIS Hallmarked)',
      weight: '19.6 g',
      dimensions: 'Drop Length: 4.8 cm',
      price: null,
      availability: 'In Stock',
      isFeatured: true,
      image: '/products/gold-jhumkas.svg',
      descriptionEn: 'Graceful three-tier bell jhumkas crowned with detailed peacock filigree and delicate gold droplet fringes.',
      descriptionHi: 'मयूर आकृति और बारीक जालीदार घंटी वाले पारंपरिक झुमके जो कानों को शाही सुंदरता प्रदान करते हैं।'
    }
  ]
};

function loadStoreData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading store data, resetting to initial:', err);
    return initialData;
  }
}

function saveStoreData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving store data:', err);
    return false;
  }
}

// In-memory active session tokens for admin
const activeSessions = new Map<string, { expires: number; username: string }>();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing authentication token' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || session.expires < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: session expired or invalid' });
  }

  // Extend session on activity (1 hour)
  session.expires = Date.now() + 3600000;
  next();
};

// --------------------------------------------------------------------------
// Public API Routes
// --------------------------------------------------------------------------

// Store settings (Public)
app.get('/api/settings', (req: Request, res: Response) => {
  const data = loadStoreData();
  const { admin, auditLogs, ...publicData } = data;
  res.json(publicData.settings);
});

// Products catalog (Public)
app.get('/api/products', (req: Request, res: Response) => {
  const data = loadStoreData();
  const category = req.query.category as string;
  const search = (req.query.search as string || '').toLowerCase().trim();

  let products = data.products || [];

  if (category && category !== 'All' && category !== 'सभी') {
    products = products.filter((p: any) => p.category === category);
  }

  if (search) {
    products = products.filter((p: any) =>
      p.nameEn.toLowerCase().includes(search) ||
      p.nameHi.includes(search) ||
      p.category.toLowerCase().includes(search) ||
      (p.purity && p.purity.toLowerCase().includes(search))
    );
  }

  res.json(products);
});

// Single product (Public)
app.get('/api/products/:id', (req: Request, res: Response) => {
  const data = loadStoreData();
  const product = data.products.find((p: any) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Live bullion benchmark rates (Public)
app.get('/api/rates', (req: Request, res: Response) => {
  const data = loadStoreData();
  const s = data.settings;
  res.json({
    enabled: s.liveRatesEnabled,
    gold24k: s.gold24kRate,
    gold22k: s.gold22kRate,
    silver1kg: s.silverRate,
    source: s.ratesSource,
    lastUpdated: s.ratesLastUpdated,
    disclaimerEn: 'Daily benchmark rates are indicative and exclusive of making charges, GST (3%), stone weights, and local hallmarking fees. Final product prices depend on purity, verified weight, and craftsmanship.',
    disclaimerHi: 'दैनिक मानक दरें सांकेतिक हैं और इनमें निर्माण शुल्क (मेकिंग चार्ज), जीएसटी (३%), रत्नों का वजन और स्थानीय हॉलमार्किंग शुल्क शामिल नहीं हैं। अंतिम आभूषण की कीमत शुद्धता, वजन और कारीगरी पर निर्भर करती है।'
  });
});

// Contact Form Submission (Rate limited)
app.post('/api/contact', sensitiveRateLimiter, (req: Request, res: Response) => {
  const { name, phone, email, message, productInterest } = req.body;

  // Basic validation & sanitization
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Please provide a valid full name.' });
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
    return res.status(400).json({ error: 'Please provide a valid phone number.' });
  }

  const cleanName = name.trim().slice(0, 100);
  const cleanPhone = phone.trim().slice(0, 20);
  const cleanEmail = email ? String(email).trim().slice(0, 100) : '';
  const cleanMessage = message ? String(message).trim().slice(0, 1000) : '';
  const cleanProduct = productInterest ? String(productInterest).trim().slice(0, 150) : '';

  const data = loadStoreData();
  const newLog = {
    timestamp: new Date().toISOString(),
    action: 'CONTACT_ENQUIRY',
    details: `Customer enquiry received from ${cleanName} (${cleanPhone}). Interested in: ${cleanProduct || 'General inquiry'}`
  };

  data.auditLogs.unshift(newLog);
  // Keep last 100 audit entries
  if (data.auditLogs.length > 100) data.auditLogs.pop();
  saveStoreData(data);

  res.json({
    success: true,
    messageEn: 'Thank you for reaching out to Shree Bherunath Jewellers. We have received your enquiry and our family representative will connect with you promptly.',
    messageHi: 'श्री भेरूनाथ ज्वेलर्स से संपर्क करने के लिए धन्यवाद। आपका संदेश प्राप्त हो गया है और हमारे प्रतिनिधि आपसे शीघ्र संपर्क करेंगे।'
  });
});

// --------------------------------------------------------------------------
// Admin Authentication & Endpoints
// --------------------------------------------------------------------------

// Admin Login (Rate limited)
app.post('/api/admin/login', sensitiveRateLimiter, (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password required' });
  }

  const data = loadStoreData();
  const salt = data.admin?.salt || 'e9b28f731c4e';
  const expectedHash = data.admin?.passwordHash;

  const derivedHash = crypto.scryptSync(password, salt, 64).toString('hex');

  // Constant-time comparison
  const isValid = crypto.timingSafeEqual(
    Buffer.from(derivedHash, 'hex'),
    Buffer.from(expectedHash, 'hex')
  );

  if (!isValid) {
    console.warn(`[SECURITY] Failed admin login attempt at ${new Date().toISOString()}`);
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  // Issue random session token
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, {
    username: 'admin',
    expires: Date.now() + 3600000 // 1 hour
  });

  data.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'ADMIN_LOGIN',
    details: 'Admin logged in successfully.'
  });
  saveStoreData(data);

  res.json({ token, expires: 3600 });
});

// Admin Verify Token
app.get('/api/admin/verify', authMiddleware, (req: Request, res: Response) => {
  res.json({ valid: true, user: 'admin' });
});

// Admin Logout
app.post('/api/admin/logout', authMiddleware, (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) activeSessions.delete(token);
  res.json({ success: true });
});

// Admin: Update Store Settings
app.put('/api/admin/settings', authMiddleware, sensitiveRateLimiter, (req: Request, res: Response) => {
  const updates = req.body;
  const data = loadStoreData();

  data.settings = {
    ...data.settings,
    ...updates,
    ratesLastUpdated: updates.gold24kRate || updates.gold22kRate || updates.silverRate
      ? new Date().toISOString()
      : data.settings.ratesLastUpdated
  };

  data.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'SETTINGS_UPDATE',
    details: 'Store contact details, rates, or business configuration updated.'
  });
  saveStoreData(data);

  res.json({ success: true, settings: data.settings });
});

// Admin: Add Product
app.post('/api/admin/products', authMiddleware, sensitiveRateLimiter, (req: Request, res: Response) => {
  const newProduct = req.body;
  if (!newProduct.nameEn || !newProduct.category) {
    return res.status(400).json({ error: 'Product name and category are required' });
  }

  const data = loadStoreData();
  const id = 'sbj-' + Date.now().toString(36);
  const created = {
    id,
    nameEn: String(newProduct.nameEn).trim(),
    nameHi: String(newProduct.nameHi || newProduct.nameEn).trim(),
    category: newProduct.category,
    materialEn: newProduct.materialEn || '22K Gold (916 BIS Hallmarked)',
    materialHi: newProduct.materialHi || '22 कैरेट सोना (916 हॉलमार्क)',
    purity: newProduct.purity || '22K (916 BIS Hallmarked)',
    weight: newProduct.weight || 'N/A',
    dimensions: newProduct.dimensions || '',
    price: newProduct.price ? parseFloat(newProduct.price) : null,
    availability: newProduct.availability || 'In Stock',
    isFeatured: Boolean(newProduct.isFeatured),
    image: newProduct.image || '/sbj-logo.jpg',
    descriptionEn: newProduct.descriptionEn || '',
    descriptionHi: newProduct.descriptionHi || ''
  };

  data.products.unshift(created);
  data.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'PRODUCT_CREATE',
    details: `Created product "${created.nameEn}" (${created.id})`
  });
  saveStoreData(data);

  res.status(201).json(created);
});

// Admin: Update Product
app.put('/api/admin/products/:id', authMiddleware, sensitiveRateLimiter, (req: Request, res: Response) => {
  const id = req.params.id;
  const updates = req.body;
  const data = loadStoreData();

  const index = data.products.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  data.products[index] = {
    ...data.products[index],
    ...updates,
    id // keep original ID immutable
  };

  data.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'PRODUCT_UPDATE',
    details: `Updated product "${data.products[index].nameEn}" (${id})`
  });
  saveStoreData(data);

  res.json(data.products[index]);
});

// Admin: Delete Product
app.delete('/api/admin/products/:id', authMiddleware, sensitiveRateLimiter, (req: Request, res: Response) => {
  const id = req.params.id;
  const data = loadStoreData();

  const index = data.products.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const removed = data.products.splice(index, 1)[0];
  data.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'PRODUCT_DELETE',
    details: `Deleted product "${removed.nameEn}" (${id})`
  });
  saveStoreData(data);

  res.json({ success: true, removedId: id });
});

// Admin: Upload Product Image directly from device
app.post('/api/admin/upload-image', authMiddleware, sensitiveRateLimiter, (req: Request, res: Response) => {
  try {
    const { filename, dataUrl } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Missing image data' });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image data payload' });
    }

    const mimeType = matches[1].toLowerCase();
    const base64Data = matches[2];

    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedMime.includes(mimeType)) {
      return res.status(400).json({ error: 'Only JPEG, PNG, or WebP images are permitted' });
    }

    let extension = '.jpg';
    if (mimeType.includes('png')) extension = '.png';
    else if (mimeType.includes('webp')) extension = '.webp';

    const safeBaseName = (filename || 'jewellery_ornament')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueFileName = `${Date.now()}_${safeBaseName}${extension}`;
    const uploadsDir = path.join(__dirname, 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const targetPath = path.join(uploadsDir, uniqueFileName);
    fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));

    const data = loadStoreData();
    data.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'IMAGE_UPLOAD',
      details: `Admin uploaded new authentic jewellery photograph: /uploads/${uniqueFileName}`
    });
    saveStoreData(data);

    res.json({ success: true, url: `/uploads/${uniqueFileName}` });
  } catch (err: any) {
    console.error('Upload handling error:', err);
    res.status(500).json({ error: 'Internal error processing and storing image' });
  }
});

// Admin: Update Password
app.put('/api/admin/change-password', authMiddleware, sensitiveRateLimiter, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const data = loadStoreData();
  const salt = data.admin?.salt || 'e9b28f731c4e';
  const derivedCurrent = crypto.scryptSync(currentPassword, salt, 64).toString('hex');

  if (!crypto.timingSafeEqual(Buffer.from(derivedCurrent, 'hex'), Buffer.from(data.admin.passwordHash, 'hex'))) {
    return res.status(401).json({ error: 'Current password does not match.' });
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = crypto.scryptSync(newPassword, newSalt, 64).toString('hex');

  data.admin = { salt: newSalt, passwordHash: newHash };
  data.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'PASSWORD_CHANGE',
    details: 'Admin access password changed successfully.'
  });
  saveStoreData(data);

  res.json({ success: true, message: 'Password updated successfully' });
});

// Admin: Audit Logs
app.get('/api/admin/audit-logs', authMiddleware, (req: Request, res: Response) => {
  const data = loadStoreData();
  res.json(data.auditLogs || []);
});

// --------------------------------------------------------------------------
// XML Sitemap & Robots.txt for SEO
// --------------------------------------------------------------------------
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const data = loadStoreData();

  const staticUrls = [
    '',
    '/collections',
    '/about',
    '/contact',
    '/rates',
    '/legal/privacy',
    '/legal/terms',
    '/legal/cookie-policy',
    '/legal/refund-policy',
    '/legal/accessibility'
  ];

  const productUrls = (data.products || []).map((p: any) => `/product/${p.id}`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(u => `  <url>
    <loc>${baseUrl}${u}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
${productUrls.map((u: string) => `  <url>
    <loc>${baseUrl}${u}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/robots.txt', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${protocol}://${host}/sitemap.xml
`);
});

// --------------------------------------------------------------------------
// Vite integration (Dev vs Prod)
// --------------------------------------------------------------------------
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SBJ SERVER] Shree Bherunath Jewellers running at http://0.0.0.0:${PORT} (Mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
