import { Product, Category, StoreSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-watches',
    name: 'Watches',
    slug: 'watches',
    description: 'Precision timepieces and next-gen smart chronographs.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    order: 1,
    productCount: 4
  },
  {
    id: 'cat-shoes',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Performance sneakers, athletic footwear, and luxury kicks.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    order: 2,
    productCount: 3
  },
  {
    id: 'cat-bags',
    name: 'Bags',
    slug: 'bags',
    description: 'Minimalist backpacks, cyber carry-ons, and luxury leather.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    order: 3,
    productCount: 3
  },
  {
    id: 'cat-gadgets',
    name: 'Gadgets',
    slug: 'gadgets',
    description: 'Cutting-edge tech, magnetic chargers, and smart peripherals.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    order: 4,
    productCount: 4
  },
  {
    id: 'cat-fashion-accessories',
    name: 'Fashion Accessories',
    slug: 'fashion-accessories',
    description: 'Designer eyewear, minimalist wallets, and premium jewelry.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    order: 5,
    productCount: 3
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Studio-grade audio gear, smart displays, and cyber audio.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    order: 6,
    productCount: 3
  },
  {
    id: 'cat-lifestyle',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Modern workspace essentials, ambient lamps, and wellness tech.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    order: 7,
    productCount: 3
  },
  {
    id: 'cat-other',
    name: 'Other Products',
    slug: 'other-products',
    description: 'Unique concept items and limited-edition releases.',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    order: 8,
    productCount: 2
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-watch-01',
    name: 'AeroChron Titanium Smartwatch',
    slug: 'aerochron-titanium-smartwatch',
    shortDescription: 'Aerospace-grade titanium casing with dual sapphire AMOLED glass.',
    description: 'The AeroChron Titanium Smartwatch represents the pinnacle of NextGen wearable engineering. Forged from grade-5 titanium with a 1.43-inch ultra-bright sapphire AMOLED display, it offers 14-day battery endurance, comprehensive biometric health tracking, ECG monitoring, and independent GPS telemetry. Water resistant to 100 meters.',
    price: 18999,
    salePrice: 15499,
    category: 'Watches',
    categorySlug: 'watches',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    featured: true,
    trending: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 142,
    specs: {
      'Case Material': 'Grade 5 Aerospace Titanium',
      'Display': '1.43-inch Retina AMOLED, 1000 nits',
      'Battery Life': 'Up to 14 Days Normal Usage',
      'Water Resistance': '10 ATM (100 meters)',
      'Sensors': 'Optical HR, SpO2, Skin Temp, Dual GPS'
    },
    published: true,
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-10-15T12:00:00Z'
  },
  {
    id: 'prod-watch-02',
    name: 'Vortex Midnight Ceramic Automatic',
    slug: 'vortex-midnight-ceramic-automatic',
    shortDescription: 'Deep matte black ceramic skeleton automatic with 80-hour power reserve.',
    description: 'Precision mechanical horology reimagined for the modern collector. The Vortex Midnight features a matte micro-blasted black ceramic case housing an exposed skeletonized 28,800 vph automatic movement with ruthenium finish and an 80-hour power reserve.',
    price: 28499,
    salePrice: 24999,
    category: 'Watches',
    categorySlug: 'watches',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 7,
    featured: true,
    trending: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 89,
    specs: {
      'Movement': 'Self-winding Calibre NX-80 Skeleton',
      'Power Reserve': '80 Hours',
      'Case Diameter': '41mm',
      'Crystal': 'Double Anti-Reflective Sapphire'
    },
    published: true,
    createdAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-10-12T12:00:00Z'
  },
  {
    id: 'prod-shoe-01',
    name: 'HyperPulse Zero-G Athletic Runners',
    slug: 'hyperpulse-zero-g-runners',
    shortDescription: 'Supercritical nitrogen-infused foam sole with carbon propulsion plate.',
    description: 'Engineered for speed and supreme comfort. The HyperPulse Zero-G runner features a supercritical nitrogen-infused dual-density foam core paired with an anatomically curved carbon-fiber propulsion plate. The breathable engineered monofilament mesh upper wraps your foot like a second skin.',
    price: 9999,
    salePrice: 7999,
    category: 'Shoes',
    categorySlug: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    featured: true,
    trending: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 312,
    specs: {
      'Sole Tech': 'Nitrogen Supercritical Foam + Carbon Plate',
      'Drop': '8mm Heel-to-Toe',
      'Weight': '210 grams (US 9)',
      'Upper': 'Monofilament Engineered Matrix Mesh'
    },
    published: true,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-10-15T12:00:00Z'
  },
  {
    id: 'prod-shoe-02',
    name: 'Phantom Cyber Mid-Top Sneakers',
    slug: 'phantom-cyber-mid-top-sneakers',
    shortDescription: 'Monochrome techwear mid-top sneakers with magnetic FIDLOCK buckle.',
    description: 'Streetwear meets futuristic utility. The Phantom Cyber sneaker incorporates waterproof Cordura fabric, reflective 3M neon accents, Vibram MegaGrip outsoles, and German FIDLOCK magnetic quick-release closure.',
    price: 8499,
    salePrice: 6999,
    category: 'Shoes',
    categorySlug: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    featured: false,
    trending: true,
    isNewArrival: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 76,
    specs: {
      'Outsole': 'Vibram MegaGrip All-Weather Compound',
      'Closure': 'FIDLOCK V-Buckle magnetic',
      'Waterproofing': 'Cordura 500D with DWR finish'
    },
    published: true,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-10-05T12:00:00Z'
  },
  {
    id: 'prod-bag-01',
    name: 'Apex Modular Waterproof Cyberpack 28L',
    slug: 'apex-modular-waterproof-cyberpack-28l',
    shortDescription: 'Ultra-durable X-Pac sailcloth backpack with magnetic laptop sling.',
    description: 'Designed for daily commuters and digital nomads. Fabricated from indestructible dimension-polyant X-Pac sailcloth, the Apex pack features weather-sealed YKK AquaGuard zippers, a suspended 16-inch fleece laptop cradle, expandable side storage, and modular MOLLE attachments.',
    price: 11499,
    salePrice: 8999,
    category: 'Bags',
    categorySlug: 'bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    featured: true,
    trending: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 94,
    specs: {
      'Capacity': '28 Liters expandable to 32L',
      'Material': 'VX-21 Dimension-Polyant X-Pac',
      'Zippers': 'YKK AquaGuard Waterproof',
      'Laptop Compartment': 'Suspended up to 16-inch MacBook Pro'
    },
    published: true,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-10-14T12:00:00Z'
  },
  {
    id: 'prod-gadget-01',
    name: 'SonicNova ANC Studio Pro Headphones',
    slug: 'sonicnova-anc-studio-pro-headphones',
    shortDescription: 'Custom 45mm beryllium drivers with hybrid active noise cancellation.',
    description: 'Immerse yourself into pure sonic detail. Featuring custom-tuned 45mm beryllium acoustic drivers, quad-mic adaptive hybrid noise cancellation (-42dB), LDAC high-res wireless codec, and ultra-plush memory foam magnetic ear cushions with 50-hour playback.',
    price: 14999,
    salePrice: 11999,
    category: 'Gadgets',
    categorySlug: 'gadgets',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 22,
    featured: true,
    trending: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 215,
    specs: {
      'Acoustic Driver': '45mm Beryllium Diaphragm',
      'Noise Cancellation': 'Hybrid ANC up to -42dB',
      'Battery Playtime': '50 Hours (ANC on)',
      'Audio Codecs': 'LDAC, aptX Adaptive, AAC, SBC'
    },
    published: true,
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-10-15T12:00:00Z'
  },
  {
    id: 'prod-gadget-02',
    name: 'MagCharge 3-in-1 Foldable Travel Dock',
    slug: 'magcharge-3-in-1-foldable-dock',
    shortDescription: 'Billet aluminum MagSafe station for phone, watch, and wireless earbuds.',
    description: 'Precision CNC-machined from solid aircraft-grade aluminum. Powers your smartphone at 15W Qi2 fast charging speeds while concurrently charging your smartwatch and audio buds. Folds completely flat into a sleek pocket-sized travel tile.',
    price: 4999,
    salePrice: 3899,
    category: 'Gadgets',
    categorySlug: 'gadgets',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    featured: false,
    trending: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 168,
    specs: {
      'Wireless Output': '15W Qi2 + 5W Watch + 5W Earbuds',
      'Input Port': 'USB-C (PD 3.0 30W+ recommended)',
      'Material': 'Anodized Billet Aluminum',
      'Dimensions': '85 x 65 x 18 mm (folded)'
    },
    published: true,
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'prod-fashion-01',
    name: 'Kore Polarized Obsidian Sunglasses',
    slug: 'kore-polarized-obsidian-sunglasses',
    shortDescription: 'Japanese Mazzucchelli acetate frames with Zeiss polarized UV400 lenses.',
    description: 'Crafted with hand-polished Italian and Japanese Mazzucchelli acetate, five-barrel German OBE hinges, and Carl Zeiss polarized nylon lenses offering 100% UVA/UVB shield with anti-reflective interior coating.',
    price: 5499,
    salePrice: 4299,
    category: 'Fashion Accessories',
    categorySlug: 'fashion-accessories',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 20,
    featured: true,
    trending: false,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 63,
    specs: {
      'Frame': 'Handcrafted Mazzucchelli M49 Bio-Acetate',
      'Lenses': 'Carl Zeiss Vision Polarized Grey',
      'Protection': '100% UV400 Protection (Cat 3)'
    },
    published: true,
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-10-11T12:00:00Z'
  },
  {
    id: 'prod-elec-01',
    name: 'AuraSphere Spatial Ambient Smart Speaker',
    slug: 'aurasphere-spatial-ambient-smart-speaker',
    shortDescription: '360-degree acoustic dispersion with reactive RGB audio reactive halo.',
    description: 'The centerpiece for next-generation interiors. Delivering 80W of room-filling omnidirectional Hi-Fi sound with dual passive bass radiators, Dolby Atmos spatialization, and an ambient programmable fluid LED halo that pulses to your frequency.',
    price: 16499,
    salePrice: 13999,
    category: 'Electronics',
    categorySlug: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 16,
    featured: true,
    trending: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 122,
    specs: {
      'Amplifier Power': '80 Watts Class-D Tri-Amp',
      'Connectivity': 'Wi-Fi 6, AirPlay 2, Spotify Connect, Bluetooth 5.4',
      'Acoustic Range': '38Hz - 22,000Hz'
    },
    published: true,
    createdAt: '2026-09-22T10:00:00Z',
    updatedAt: '2026-10-15T12:00:00Z'
  },
  {
    id: 'prod-life-01',
    name: 'Lumina Levitation Magnetic Desk Lamp',
    slug: 'lumina-levitation-magnetic-desk-lamp',
    shortDescription: 'Zero-gravity floating illumination with induction touch dimmer.',
    description: 'An architectural statement piece. Utilizing patented magnetic suspension technology, the LED light module floats effortlessly in mid-air while receiving power wirelessly through magnetic induction.',
    price: 7499,
    salePrice: 5999,
    category: 'Lifestyle',
    categorySlug: 'lifestyle',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 19,
    featured: false,
    trending: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 88,
    specs: {
      'Levitation Height': '15-18mm air gap',
      'LED Temperature': 'Warm 2700K - Cool 5000K Stepless',
      'Power Consumption': '12W Energy-Efficient'
    },
    published: true,
    createdAt: '2026-09-28T10:00:00Z',
    updatedAt: '2026-10-12T12:00:00Z'
  },
  {
    id: 'prod-watch-03',
    name: 'Horizon Minimalist Solar Chrono',
    slug: 'horizon-minimalist-solar-chrono',
    shortDescription: 'Ultra-thin solar-powered chronograph with sapphire crystal and mesh strap.',
    description: 'Harness the light around you. The Horizon Solar Chronograph converts natural and artificial light into kinetic electrical energy, guaranteeing continuous operation without battery replacements. Encased in surgical 316L stainless steel.',
    price: 12999,
    salePrice: 10499,
    category: 'Watches',
    categorySlug: 'watches',
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    featured: false,
    trending: false,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 41,
    specs: {
      'Movement': 'Solar Calibre EcoDrive Q7',
      'Case Thickness': '8.2mm Ultra-Slim',
      'Strap': 'Quick-release Milanese Stainless Mesh'
    },
    published: true,
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-14T12:00:00Z'
  },
  {
    id: 'prod-other-01',
    name: 'Monolith Billet Mechanical Keyboard',
    slug: 'monolith-billet-mechanical-keyboard',
    shortDescription: 'Gasket-mounted 75% hot-swappable keyboard with rotary encoder knob.',
    description: 'Sculpted from a single block of 6063 aerospace aluminum with precision CNC milling. Gasket-mounted brass plate, factory-lubed linear switches, sound dampening PORON foam layers, and customizable OLED status display.',
    price: 16999,
    salePrice: 14499,
    category: 'Other Products',
    categorySlug: 'other-products',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    featured: true,
    trending: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 156,
    specs: {
      'Layout': '75% Compact with Brass Knob',
      'Mounting': 'Isolated Silicone Gasket Mount',
      'Connectivity': 'Tri-mode: 2.4Ghz, BT 5.1, Type-C USB'
    },
    published: true,
    createdAt: '2026-08-30T10:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'FNP Store',
  marketplaceConcept: 'NextGen Market',
  tagline: 'Your Next Generation Marketplace.',
  secondaryTagline: 'Discover More. Shop Smarter.',
  currency: 'INR',
  currencySymbol: '₹',
  contactEmail: 'support@fnpstore.market',
  contactPhone: '+91 98765 43210',
  contactAddress: 'Cyber Hub, DLF Phase 2, Gurugram, HR 122002, India',
  shippingFee: 149,
  freeShippingThreshold: 2999,
  enableCod: true,
  enableOnlinePayment: true,
  announcementText: '⚡ NEXTGEN LAUNCH: Flat 15% OFF on first order with code NEXTGEN15 • Free Express Shipping on orders over ₹2,999!',
  showAnnouncement: true,
  banners: [
    {
      id: 'banner-01',
      title: 'NextGen Timepieces & Chronographs',
      subtitle: 'Aerospace-Grade Titanium & Mechanical Precision. Now Live.',
      buttonText: 'Shop Watches',
      link: '/category/watches',
      badge: 'LIMITED EDITIONS',
      bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      active: true
    },
    {
      id: 'banner-02',
      title: 'Studio Grade Audio & Cyber Gadgets',
      subtitle: 'Spatial acoustics, beryllium drivers & magnetic fast docks.',
      buttonText: 'Explore Gadgets',
      link: '/category/gadgets',
      badge: 'AUDIO INNOVATION',
      bgGradient: 'from-violet-950 via-zinc-900 to-slate-900',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      active: true
    }
  ]
};
