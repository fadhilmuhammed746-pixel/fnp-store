import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './context/AuthContext';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ProtectedCustomerRoute, ProtectedAdminRoute } from './components/common/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryProductsPage } from './pages/CategoryProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

// Auth Pages
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';

// Customer Account Pages
import { AccountPage } from './pages/Account/AccountPage';
import { OrdersPage } from './pages/Account/OrdersPage';
import { OrderDetailPage } from './pages/Account/OrderDetailPage';
import { WishlistPage } from './pages/Account/WishlistPage';

// Static & Information Pages
import { ContactPage } from './pages/Static/ContactPage';
import { FaqPage } from './pages/Static/FaqPage';
import { AboutPage } from './pages/Static/AboutPage';
import { PrivacyPage, TermsPage } from './pages/Static/PrivacyAndTerms';

// Admin Pages
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminProducts } from './pages/Admin/AdminProducts';
import { AdminCategories } from './pages/Admin/AdminCategories';
import { AdminOrders } from './pages/Admin/AdminOrders';
import { AdminCustomers } from './pages/Admin/AdminCustomers';
import { AdminMessages } from './pages/Admin/AdminMessages';
import { AdminSettings } from './pages/Admin/AdminSettings';

// Fallbacks
import { NotFoundPage } from './pages/NotFoundPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';

// Scroll to top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Storefront Wrapper Layout
const StorefrontLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0F] text-slate-100">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <StoreSettingsProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  {/* Public Storefront Routes */}
                  <Route element={<StorefrontLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/category/:slug" element={<CategoryProductsPage />} />
                    <Route path="/product/:slug" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedCustomerRoute>
                          <CheckoutPage />
                        </ProtectedCustomerRoute>
                      }
                    />

                    {/* Auth */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Customer Account Routes (Protected) */}
                    <Route
                      path="/account"
                      element={
                        <ProtectedCustomerRoute>
                          <AccountPage />
                        </ProtectedCustomerRoute>
                      }
                    />
                    <Route
                      path="/account/orders"
                      element={
                        <ProtectedCustomerRoute>
                          <OrdersPage />
                        </ProtectedCustomerRoute>
                      }
                    />
                    <Route
                      path="/account/orders/:id"
                      element={
                        <ProtectedCustomerRoute>
                          <OrderDetailPage />
                        </ProtectedCustomerRoute>
                      }
                    />
                    <Route
                      path="/account/wishlist"
                      element={<WishlistPage />}
                    />

                    {/* Static Informational Pages */}
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/access-denied" element={<AccessDeniedPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  {/* Protected Admin Control Center */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedAdminRoute>
                        <AdminLayout />
                      </ProtectedAdminRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </StoreSettingsProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
