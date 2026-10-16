# FNP Store — NextGen Market

> **"Your Next Generation Marketplace. Discover More. Shop Smarter."**

FNP Store is a complete, production-oriented e-commerce platform built around the **NextGen Market** brand concept. Engineered with a high-end dark cyberpunk/futuristic aesthetic, it blends deep charcoal/black backgrounds with violet and purple gradients, luminous accent nodes, glassmorphic cards, and rigorous server-grade validation.

---

## 💎 1. Visual & Brand Identity

- **Store Name**: FNP Store
- **Marketplace Concept**: NextGen Market
- **Brand Abbreviation**: FNP
- **Primary Tagline**: *"Your Next Generation Marketplace."*
- **Secondary Tagline**: *"Discover More. Shop Smarter."*
- **Theme**: Premium dark aesthetic (`#0B0B0F` background, `#12121A` surface cards, violet `#8B5CF6`, purple `#A855F7`, and cyan accent glow `#06B6D4`).
- **Logo**: Custom geometric vector mark featuring a faceted isometric portal and integrated glowing cyan energy node with modern Plus Jakarta Sans typography.

---

## 🛠️ 2. Technology Stack

- **Frontend Core**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 5
- **Styling**: Tailwind CSS with custom glassmorphism utilities & glow filters
- **Routing**: React Router DOM v6
- **Database**: Cloud Firestore (with automated local mock engine fallback for zero-configuration testing)
- **Authentication**: Firebase Authentication (Email/Password, password reset, customer profiles)
- **File Storage**: Firebase Storage (product galleries, banners, user avatars)
- **Icons**: Lucide Icons
- **Analytics Charts**: Recharts (admin sales metrics & category depth charts)
- **Celebration Effects**: Canvas Confetti

---

## 🌟 3. Architecture & Features

### 🛍️ Public Storefront
1. **Homepage (`/`)**:
   - Dynamic offer announcement bar.
   - High-tech hero section with interactive 3D/glow showcase.
   - Featured categories grid (Watches, Shoes, Bags, Gadgets, Fashion Accessories, Electronics, Lifestyle, Other Products).
   - Real-time Trending gear, New arrivals, and Best sellers.
   - Dynamic promotional banners managed from the Admin Dashboard.
   - Value guarantees (Express Delivery, Authentic Guaranteed, Hassle-free returns, 24/7 Concierge).
   - Newsletter subscription form.
2. **Shop Catalog (`/shop`)**:
   - Working search by product name and description.
   - Category filtering & Price range slider (up to ₹50,000+).
   - "In Stock Only" availability toggle.
   - Multi-mode sorting (Newest, Price: Low-to-High, Price: High-to-Low, Highest Rated).
   - Pagination and instant filter reset.
3. **Category Views (`/categories`, `/category/:slug`)**:
   - Dedicated visual collection banners with real-time product counts.
4. **Product Details (`/product/:slug`)**:
   - Multi-image gallery with high-res zoom & thumbnail switcher.
   - Real-time stock status (In Stock, Low Stock alert, Out of Stock lock).
   - Quantity selector bounded by inventory stock limits.
   - "Add to Cart" and instant "Buy Now" flow.
   - Wishlist toggle.
   - Comprehensive technical specifications table.
   - Related products from the same category.
5. **Persistent Shopping Cart (`/cart`)**:
   - Persistent across refreshes.
   - Free shipping progress bar (Unlocks free express shipping above ₹2,999).
   - Promo code validation engine (`NEXTGEN15` for 15% off, `FNP500` for ₹500 off, `VIP20` for 20% off).
   - Real-time subtotal, shipping charge, discount, and grand total.
6. **Checkout Flow (`/checkout`)**:
   - Customer information, full shipping address (street, city, state, postal code, notes).
   - Payment method toggle: **Cash on Delivery (COD)** and **Online Payment (UPI/Cards/NetBanking)**.
   - **Trusted Server-Grade Price & Stock Verification**: The order process fetches current catalog data, recalculates verified prices, validates available inventory, deducts purchased stock atomically, and logs the order.

### 👤 Customer Account Area
- `/login`, `/register`, `/forgot-password`: Firebase Authentication flows with validation.
- `/account`: Profile editor (name, phone, address).
- `/account/orders`: Chronological order history with fulfillment status pills.
- `/account/orders/:id`: Full order tracking timeline (Placed -> Processing -> Dispatched -> Delivered), carrier tracking AWB number, line item breakdown, and printable invoice.
- `/account/wishlist`: Saved products grid with quick add-to-cart.

### 🛡️ Admin Dashboard (`/admin`)
- **Access Authorization**:
  - Protected route requiring administrative clearance.
  - Authorized admin master security password: `866319` (elevates session and grants administrative control).
- **Overview (`/admin`)**:
  - Live Total Orders, Total Products, Customer Accounts, Pending Orders, Low Stock Alerts.
  - Total Verified Revenue in INR (`₹`).
  - Interactive Recharts Revenue Area Chart & Category Distribution Bar Chart.
  - Recent orders and low-stock monitor.
- **Product Management (`/admin/products`)**:
  - Add, edit, delete products.
  - Manage multiple image URLs.
  - Set regular and sale prices.
  - Set stock count, category, and tech specs.
  - Mark products as Trending, Featured, New Arrival, Best Seller.
  - Toggle live publishing (Live vs Draft).
- **Category Management (`/admin/categories`)**:
  - Create, edit, reorder (up/down rank), and delete categories.
- **Order Fulfillment (`/admin/orders`)**:
  - Search and filter orders by customer, status, or order ID.
  - Update fulfillment status (`pending`, `processing`, `shipped`, `delivered`, `cancelled`).
  - Update payment status (`pending`, `paid`, `refunded`).
  - Attach logistics carrier and tracking AWB number.
- **Customer Directory (`/admin/customers`)**:
  - Customer lifetime spend and order history summary.
- **Customer Messages (`/admin/messages`)**:
  - Support inquiries with read/unread flags and direct email reply.
- **Store Settings (`/admin/settings`)**:
  - Store name, primary/secondary taglines.
  - Shipping fees and free shipping threshold.
  - Cash on Delivery toggle.
  - Currency settings (INR `₹`).
  - Announcement bar banner text and toggle.
  - Promotional banners editor.

---

## 🔒 4. Security Rules

### Firestore Security (`firestore.rules`)
- Restricts write access for `products`, `categories`, `storeSettings`, `coupons` to authenticated administrators only.
- Customers can only read and write their own private data in `users/{userId}` and `orders/{orderId}`.
- Contact messages can be created by visitors but read/managed exclusively by administrators.

### Storage Security (`storage.rules`)
- Restricts uploads to administrators.
- Limits image uploads to valid image MIME types and maximum file size (5MB for products, 10MB for banners).

---

## 🚀 5. Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation
```bash
# Clone or navigate to the project directory
cd linebus

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

### Building for Production
```bash
npm run build
npm run preview
```

### Seeding Initial Data
Open `/admin` (enter master authorization password `866319`), then click the **"Seed Sample Catalog"** button in the sidebar. This will instantly populate 12+ rich NextGen products, 8 categories, and initial store banners!

---

## 📄 License
MIT License. Developed for FNP Store — NextGen Market.
