import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/* ── Popup — fixed position below the card ── */
const ProductHoverPopup = ({ product, anchorRect, onClose }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const popupRef = useRef(null);

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;
  const isSoldOut = product.status === 'soldout' || product.variants.every(v => v.inventory === 0);

  // Position: fixed — show above card if not enough space below
  const popupHeight = 160; // approximate
  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const showAbove = spaceBelow < popupHeight + 16;

  const style = {
    position: 'fixed',
    left: anchorRect.left,
    width: anchorRect.width,
    zIndex: 9999,
    top: showAbove ? anchorRect.top - popupHeight : anchorRect.bottom,
    bottom: 'auto',
  };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize || product.variants[0]?.size || 'M');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize || product.variants[0]?.size || 'M');
    onClose();
    navigate('/cart');
  };

  return (
    <div
      ref={popupRef}
      className="php-drawer"
      style={style}
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseLeave={onClose}
    >
      {/* Prices */}
      <div className="php-prices">
        <span className="php-price">₹{product.basePrice.toLocaleString('en-IN')}</span>
        {product.compareAtPrice && (
          <span className="php-compare">₹{product.compareAtPrice.toLocaleString('en-IN')}</span>
        )}
        {discount > 0 && <span className="php-save">-{discount}%</span>}
      </div>

      {/* Sizes */}
      {!isSoldOut && (
        <div className="php-sizes">
          {product.variants.map(v => (
            <button
              key={v.size}
              className={`php-size ${selectedSize === v.size ? 'active' : ''} ${v.inventory === 0 ? 'out' : ''}`}
              onClick={e => { e.preventDefault(); e.stopPropagation(); if (v.inventory > 0) setSelectedSize(v.size); }}
              disabled={v.inventory === 0}
            >{v.size}</button>
          ))}
        </div>
      )}

      {/* Actions */}
      {isSoldOut ? (
        <p className="php-soldout-msg">Currently Unavailable</p>
      ) : (
        <div className="php-actions">
          <button className="php-btn-add" onClick={handleAdd}>
            {added ? '✓ Added!' : 'Add to Cart'}
          </button>
          <button className="php-btn-buy" onClick={handleBuy}>Buy Now</button>
        </div>
      )}
    </div>
  );
};

/* ── HOC wrapper ── */
export const WithHoverPopup = ({ product, children }) => {
  const [anchorRect, setAnchorRect] = useState(null);
  const timerRef = useRef(null);
  const anchorRef = useRef(null);

  const onEnter = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (anchorRef.current) {
        setAnchorRect(anchorRef.current.getBoundingClientRect());
      }
    }, 300);
  };

  const onLeave = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAnchorRect(null), 120);
  };

  // Update rect on scroll/resize
  useEffect(() => {
    if (!anchorRect) return;
    const update = () => {
      if (anchorRef.current) setAnchorRect(anchorRef.current.getBoundingClientRect());
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [anchorRect]);

  return (
    <div
      ref={anchorRef}
      className={`php-anchor ${anchorRect ? 'php-open' : ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
      {anchorRect && (
        <ProductHoverPopup
          product={product}
          anchorRect={anchorRect}
          onClose={() => setAnchorRect(null)}
        />
      )}
    </div>
  );
};

export default ProductHoverPopup;
