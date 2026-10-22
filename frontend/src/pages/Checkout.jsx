import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Checkout.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shipping = totalPrice >= 2000 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Razorpay failed to load. Please try again.');
        setLoading(false);
        return;
      }

      // Create order on backend
      const token = JSON.parse(localStorage.getItem('manroz_user'))?.token;
      const { data } = await axios.post(
        `${API_URL}/api/orders/create`,
        {
          items: items.map((item) => ({
            productId: item.id,
            title: item.title,
            image: item.image,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingAddress: address,
          totalAmount: grandTotal,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Manroz',
        description: 'Premium Ethnic Wear',
        image: 'https://manroz.com/favicon.svg',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await axios.post(
              `${API_URL}/api/orders/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: data.dbOrderId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              clearCart();
              navigate('/order-success', {
                state: {
                  orderId: data.dbOrderId,
                  paymentId: response.razorpay_payment_id,
                  amount: grandTotal,
                },
              });
            }
          } catch (err) {
            setError('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: { color: '#8b1a2e' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <main className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">
        {/* Left — Address Form */}
        <div className="checkout-form-wrap">
          <h2 className="checkout-section-title">Delivery Address</h2>
          <form onSubmit={handlePlaceOrder} className="checkout-form">
            <div className="checkout-row">
              <div className="checkout-field">
                <label>Full Name</label>
                <input name="fullName" value={address.fullName} onChange={handleChange}
                  placeholder="Full name" required />
              </div>
              <div className="checkout-field">
                <label>Phone Number</label>
                <input name="phone" value={address.phone} onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX" required maxLength={10} />
              </div>
            </div>

            <div className="checkout-field">
              <label>Address</label>
              <textarea name="address" value={address.address} onChange={handleChange}
                placeholder="House no., Street, Area" required rows={3} />
            </div>

            <div className="checkout-row">
              <div className="checkout-field">
                <label>City</label>
                <input name="city" value={address.city} onChange={handleChange}
                  placeholder="City" required />
              </div>
              <div className="checkout-field">
                <label>State</label>
                <input name="state" value={address.state} onChange={handleChange}
                  placeholder="State" required />
              </div>
            </div>

            <div className="checkout-field" style={{maxWidth: '200px'}}>
              <label>Pincode</label>
              <input name="pincode" value={address.pincode} onChange={handleChange}
                placeholder="110001" required maxLength={6} />
            </div>

            {error && <div className="checkout-error">{error}</div>}

            <button type="submit" className="checkout-pay-btn" disabled={loading}>
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Pay ₹{grandTotal.toLocaleString('en-IN')}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right — Order Summary */}
        <div className="checkout-summary">
          <h2 className="checkout-section-title">Order Summary</h2>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="checkout-item">
                <img src={item.image} alt={item.title}
                  onError={(e) => { e.target.src = 'https://placehold.co/60x75/f5f0eb/333?text=M'; }} />
                <div className="checkout-item-info">
                  <p className="checkout-item-title">{item.title}</p>
                  <p className="checkout-item-size">Size: {item.size} × {item.quantity}</p>
                  <p className="checkout-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="checkout-total-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-tag">FREE</span> : `₹${shipping}`}</span>
            </div>
            <div className="checkout-total-row total">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="checkout-secure">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            100% Secure Payment via Razorpay
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
