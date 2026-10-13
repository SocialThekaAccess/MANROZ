import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/* ── Popup component ── */
const ProductHoverPopup = ({ product, rect, onClose }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(0);
  const [fading, setFading] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const intervalRef = useRef(null);

  const images = product.images.slice(0, 6);
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;
  const isSoldOut = product.status === 'soldout';

  // Auto cycle with crossfade
  const goNext = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setCurrentImg(i => (i + 1) % images.length);
      setFading(false);
    }, 350);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(goNext, 1600);
    return () => clearInterval(intervalRef.current);
  }, [goNext]);

  // Calculate fixed position — centered over the hovered card
  const pw = 300;
  const ph = 460;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Center popup over the card
  let left = rect.left + (rect.width - pw) / 2;
  let top  = rect.top  + (rect.height - ph) / 2;

  // Clamp to viewport
  if (left + pw > vw - 16) left = vw - pw - 16;
  if (left < 16) left = 16;
  if (top + ph > vh - 16) top = vh - ph - 16;
  if (top < 16) top = 16;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, selectedSize || product.variants[0]?.size || 'M');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    addToCart(product, selectedSize || product.variants[0]?.size || 'M');
    onClose();
    navigate('/cart');
  };

  return (
    <div
      className="php-popup"
      style={{ position: 'fixed', top, left, width: pw, zIndex: 9999 }}
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={onClose}
    >
      {/* Slideshow */}
      <Link to={`/product/${product.handle}`} className="php-img-wrap" onClick={onClose}>
        <img
          key={currentImg}
          src={images[currentImg]}
          alt={product.title}
          className={`php-img ${fading ? 'php-fade-out' : 'php-fade-in'}`}
          onError={e => { e.target.src = 'https://placehold.co/300x380/f0ebe4/333?text=M'; }}
        />
        {isSoldOut && <span className="php-badge-soldout">Sold Out</span>}
        {!isSoldOut && discount > 0 && <span className="php-badge-off">{discount}% OFF</span>}
        {images.length > 1 && (
          <div className="php-dots">
            {images.map((_, i) => <span key={i} className={`php-dot ${i === currentImg ? 'active' : ''}`} />)}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="php-info">
        <Link to={`/product/${product.handle}`} onClick={onClose}>
          <h3 className="php-title">{product.title}</h3>
        </Link>
        <div className="php-prices">
          <span className="php-price">₹{product.basePrice.toLocaleString('en-IN')}</span>
          {product.compareAtPrice && <span className="php-compare">₹{product.compareAtPrice.toLocaleString('en-IN')}</span>}
          {discount > 0 && <span className="php-save">-{discount}%</span>}
        </div>

        {!isSoldOut && (
          <div className="php-sizes">
            {product.variants.map(v => (
              <button
                key={v.size}
                className={`php-size ${selectedSize === v.size ? 'active' : ''} ${v.inventory === 0 ? 'out' : ''}`}
                onClick={e => { e.stopPropagation(); if (v.inventory > 0) setSelectedSize(v.size); }}
                disabled={v.inventory === 0}
              >{v.size}</button>
            ))}
          </div>
        )}

        {isSoldOut ? (
          <p className="php-soldout-msg">Currently Unavailable</p>
        ) : (
          <div className="php-actions">
            <button className="php-btn-add" onClick={handleAdd}>{added ? '✓ Added!' : 'Add to Cart'}</button>
            <button className="php-btn-buy" onClick={handleBuy}>Buy Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── HOC wrapper ── */
export const WithHoverPopup = ({ product, children }) => {
  const [rect, setRect] = useState(null);
  const timerRef = useRef(null);
  const anchorRef = useRef(null);

  const onEnter = () => {
    timerRef.current = setTimeout(() => {
      if (anchorRef.current) {
        setRect(anchorRef.current.getBoundingClientRect());
      }
    }, 1400);
  };

  const onLeave = () => {
    clearTimeout(timerRef.current);
    // small delay so mouse can move to popup
    setTimeout(() => setRect(null), 80);
  };

  return (
    <div
      ref={anchorRef}
      className="php-anchor"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
      {rect && (
        <ProductHoverPopup
          product={product}
          rect={rect}
          onClose={() => setRect(null)}
        />
      )}
    </div>
  );
};

export default ProductHoverPopup;
