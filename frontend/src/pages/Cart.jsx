import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = totalPrice >= 2000 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛍️</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet</p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1 className="cart-title">Shopping Cart</h1>
      <p className="cart-count">{items.length} item{items.length !== 1 ? 's' : ''}</p>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="cart-item">
              <div className="cart-item-img">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/100x120/f5f0eb/333?text=M';
                  }}
                />
              </div>
              <div className="cart-item-info">
                <Link to={`/product/${item.handle}`}>
                  <h3>{item.title}</h3>
                </Link>
                <p className="cart-item-size">Size: {item.size}</p>
                <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-control">
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-subtotal">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id, item.size)}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="free-shipping">FREE</span> : `₹${shipping}`}</span>
          </div>
          {shipping > 0 && (
            <p className="free-shipping-msg">
              Add ₹{(2000 - totalPrice).toLocaleString('en-IN')} more for free shipping
            </p>
          )}
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
          <button className="btn-checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <Link to="/shop" className="btn-continue-shopping">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Cart;
