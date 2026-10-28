import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminSales from './pages/admin/AdminSales';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCoupons from './pages/admin/AdminCoupons';
import StoreLayout from './pages/StoreLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Collections from './pages/Collections';
import Contact from './pages/Contact';
import Account from './pages/Account';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import FAQ from './pages/FAQ';
import TermsConditions from './pages/TermsConditions';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* ── Admin routes — no navbar/footer ─────────────────── */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="sales" element={<AdminSales />} />
              <Route path="coupons" element={<AdminCoupons />} />
            </Route>

            {/* ── Store routes — with navbar/footer ───────────────── */}
            <Route element={<StoreLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:handle" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/account" element={<Account />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
