import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import TopMarquee from './components/TopMarquee';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
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
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <ScrollToTop />
            {/* Marquee sits above the sticky navbar */}
            <TopMarquee />
            <Navbar />
            <div className="page-content">
              <Routes>
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
              </Routes>
            </div>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
