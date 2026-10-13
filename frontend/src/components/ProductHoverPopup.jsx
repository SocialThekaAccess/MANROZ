import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductHoverPopup = ({ product, anchorRef, onClose }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(0);
  const [prevImg, setPrevImg] = useState(null);
  const [fading, setFading] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const intervalRef = useRef(null);
  const popupRef = useRef(null);

  const images = product.images.slice(0, 6);
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;
  const isSoldOut = product.status === 'soldout';

  // Auto cycle images with crossfade
  const goToNext = useCallback(() => {
    setPrevImg(currentImg);
    setFading(true);
    setTimeout(() => {
      setCurrentImg(i => (i + 1) % images.length);
      setFading(false);
      setPrevImg(null);
    }, 400);
  }, [currentImg, images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(goToNext, 1800);
    return () => clearInterval(intervalRef.current);
  }, [goToNext, images.length]);

  // Position popup near anchor
  const [pos, setPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (!anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const pw = 300;
    const ph = 480;
    const margin = 12;
    let left = rect.right + margin + window.scrollX;
    let top = rect.top + window.scrollY;
    // overflow right → show left
    if (left + pw > window.innerWidth - 20) {
      left = rect.left - pw - margin + window.scrollX;
    }
    // overflow bottom
    if (top + ph > window.scrollY + window.innerHeight - 20) {
      top = window.scrollY + window.innerHeight - ph - 20;
    }
    setPos({ top, left });
  }, [anchorRef]);

  const handleAdd = (e) => {
    e.stopPropagation();
    const size = selectedSize || product.variants[0]?.size || 'M';
    addToCart(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    const size = selectedSize || product.variants[0]?.size || 'M';
    addToCart(product, size);
    onClose();
    navigate('/cart');
  };

  return (
    <div
      ref={popupRef}
      className="php-popup"
      style={{ top: pos.top, left: pos.left }}
      onMouseLeave={onClose}
    >
      {/* Image slideshow */}
      <Link to={`/product/${product.handle}`} className="php-img-wrap" onClick={onClose}>
        {/* Current image */}
        <img
          key={currentImg}
          src={images[currentImg]}
          alt={product.title}
          className={`php-img php-img-current ${fading ? 'php-img-fade-out' : 'php-img-visible'}`}
          onError={e => { e.target.src = 'https://placehold.co/300x380/f0ebe4/333?text=M'; }}
        />
        {/* Badges */}
        {isSoldOut && <span className="php-badge-soldout">Sold Out</span>}
        {!isSoldOut && discount > 0 && <span className="php-badge-off">{discount}% OFF</span>}
        {/* Dots */}
        {images.length > 1 && (
          <div className="php-dots">
            {images.map((_, i) => (
              <span key={i} className={`php-dot ${i === currentImg ? 'active' : ''}`} />
            ))}
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
                onClick={e => { e.stopPropagation(); if (v.inventory > 0) setSelectedSize(v.size); }}
                disabled={v.inventory === 0}
              >
                {v.size}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        {isSoldOut ? (
          <div className="php-soldout-msg">Currently Unavailable</div>
        ) : (
          <div className="php-actions">
            <button className="php-btn-add" onClick={handleAdd}>
              {added ? '✓ Added!' : 'Add to Cart'}
            </button>
            <button className="php-btn-buy" onClick={handleBuy}>Buy Now</button>
          </div>
        )}
      </div>

      {/* Arrow pointer */}
      <div className="php-arrow" />
    </div>
  );
};

// HOC — wraps any card with hover popup logic
export const WithHoverPopup = ({ product, children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef(null);
  const anchorRef = useRef(null);

  const onEnter = () => {
    timerRef.current = setTimeout(() => setShowPopup(true), 1500);
  };
  const onLeave = () => {
    clearTimeout(timerRef.current);
    setShowPopup(false);
  };

  return (
    <div
      ref={anchorRef}
      className="php-anchor"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
      {showPopup && (
        <ProductHoverPopup
          product={product}
          anchorRef={anchorRef}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default ProductHoverPopup;
