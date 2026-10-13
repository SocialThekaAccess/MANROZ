import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { WithHoverPopup } from './ProductHoverPopup';

// fake like counts for realism
const fakeLikes = [1243, 892, 2108, 567, 1876, 743, 1392, 488];

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? '#ff3366' : 'none'} stroke={filled ? '#ff3366' : 'currentColor'} strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const BookmarkIcon = ({ saved }) => (
  <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const InstaCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const baseLikes = fakeLikes[index % fakeLikes.length];
  const likeCount = liked ? baseLikes + 1 : baseLikes;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;

  // Double tap to like
  const lastTap = { t: 0 };
  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.t < 300) {
      setLiked(true);
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 900);
    }
    lastTap.t = now;
  }, []);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const size = product.variants[0]?.size || 'M';
    addToCart(product, size);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 1500);
  };

  return (
    <WithHoverPopup product={product}>
      <div className="ig-card">
      {/* ── Header ── */}
      <div className="ig-header">
        <div className="ig-avatar">
          <span>M</span>
        </div>
        <div className="ig-meta">
          <span className="ig-username">manroz.official</span>
          <span className="ig-location">New Arrival ✦</span>
        </div>
        <button className="ig-more" aria-label="More options">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* ── Image ── */}
      <Link to={`/product/${product.handle}`} className="ig-img-wrap" onClick={handleDoubleTap}>
        <img
          src={product.images[activeImg]}
          alt={product.title}
          className="ig-img"
          onError={(e) => { e.target.src = 'https://placehold.co/400x400/f0ebe4/333?text=MANROZ'; }}
        />

        {/* Dot nav if multiple images */}
        {product.images.length > 1 && (
          <div className="ig-img-dots">
            {product.images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                className={`ig-img-dot ${i === activeImg ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveImg(i); }}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Nav arrows */}
        {product.images.length > 1 && (
          <>
            {activeImg > 0 && (
              <button className="ig-nav ig-nav-prev"
                onClick={(e) => { e.preventDefault(); setActiveImg(i => i - 1); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            )}
            {activeImg < product.images.length - 1 && (
              <button className="ig-nav ig-nav-next"
                onClick={(e) => { e.preventDefault(); setActiveImg(i => i + 1); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            )}
          </>
        )}

        {/* Discount tag */}
        {discount > 0 && (
          <span className="ig-discount-tag">{discount}% OFF</span>
        )}

        {/* Double-tap heart burst */}
        {heartBurst && (
          <div className="ig-heart-burst" aria-hidden="true">
            <HeartIcon filled />
          </div>
        )}

        {/* Quick Add overlay */}
        <div className="ig-quick-overlay">
          <button className="ig-quick-btn" onClick={handleQuickAdd}>
            {addedMsg ? '✓ Added!' : '+ Quick Add'}
          </button>
        </div>
      </Link>

      {/* ── Actions ── */}
      <div className="ig-actions">
        <div className="ig-actions-left">
          <button
            className={`ig-action-btn ig-like-btn ${liked ? 'liked' : ''}`}
            onClick={() => setLiked(l => !l)}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <HeartIcon filled={liked} />
          </button>
          <button className="ig-action-btn" aria-label="Share">
            <ShareIcon />
          </button>
        </div>
        <button
          className={`ig-action-btn ig-save-btn ${saved ? 'saved' : ''}`}
          onClick={() => setSaved(s => !s)}
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          <BookmarkIcon saved={saved} />
        </button>
      </div>

      {/* ── Likes ── */}
      <div className="ig-likes">
        {likeCount.toLocaleString('en-IN')} likes
      </div>

      {/* ── Caption ── */}
      <div className="ig-caption">
        <span className="ig-cap-user">manroz.official</span>
        <span className="ig-cap-text"> {product.title} ✨</span>
        <span className="ig-cap-tags"> #manroz #ethnicwear #fashion #ootd #newarrival</span>
      </div>

      {/* ── Price Row ── */}
      <div className="ig-price-row">
        <div className="ig-prices">
          <span className="ig-price">₹{product.basePrice.toLocaleString('en-IN')}</span>
          {product.compareAtPrice && (
            <span className="ig-compare">₹{product.compareAtPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
        <Link to={`/product/${product.handle}`} className="ig-shop-btn">
          Shop Now →
        </Link>
      </div>
    </div>
    </WithHoverPopup>
  );
};

const InstaGrid = ({ products }) => {
  // Double for seamless infinite loop
  const loopItems = [...products, ...products];

  return (
    <section className="ig-section">
      <div className="ig-section-header">
        <div className="ig-title-wrap">
          <svg className="ig-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
          </svg>
          <div>
            <h2>New Arrivals</h2>
            <p>Fresh styles just dropped</p>
          </div>
        </div>
        <a
          href="https://instagram.com/manroz.official"
          target="_blank"
          rel="noreferrer"
          className="ig-follow-btn"
        >
          Follow @manroz
        </a>
      </div>

      {/* Infinite scroll belt */}
      <div className="ig-belt-wrap">
        <div className="ig-belt">
          {loopItems.map((p, i) => (
            <InstaCard key={`${p.id}-${i}`} product={p} index={i % products.length} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstaGrid;
