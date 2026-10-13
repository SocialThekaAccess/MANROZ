import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import products from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { handle } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = products.find((p) => p.handle === handle);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [addedMsg, setAddedMsg] = useState('');
  const [sizeError, setSizeError] = useState(false);

  if (!product) {
    return (
      <main className="not-found">
        <h2>Product not found</h2>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </main>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.status === 'active')
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize);
    setAddedMsg('Added to cart!');
    setTimeout(() => setAddedMsg(''), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize);
    navigate('/cart');
  };

  return (
    <main className="product-detail-page">

      {/* Festive decorative background elements */}
      <div className="pd-festive-bg" aria-hidden="true">
        <div className="pd-glow pd-glow-1" />
        <div className="pd-glow pd-glow-2" />
        <div className="pd-glow pd-glow-3" />
        {/* Corner rangoli */}
        <svg className="pd-corner pd-corner-tl" viewBox="0 0 120 120" fill="none">
          <circle cx="0" cy="0" r="80" stroke="#c9a84c" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.25"/>
          <circle cx="0" cy="0" r="55" stroke="#c9a84c" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.2"/>
          <circle cx="0" cy="0" r="30" stroke="#c9a84c" strokeWidth="0.5" opacity="0.15"/>
          <line x1="0" y1="0" x2="120" y2="0" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2"/>
          <line x1="0" y1="0" x2="0" y2="120" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2"/>
          <line x1="0" y1="0" x2="85" y2="85" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15"/>
          {[0,30,60,90].map(a => (
            <ellipse key={a} cx="40" cy="0" rx="6" ry="3" fill="#c9a84c" opacity="0.18"
              transform={`rotate(${a})`}/>
          ))}
        </svg>
        <svg className="pd-corner pd-corner-tr" viewBox="0 0 120 120" fill="none">
          <circle cx="120" cy="0" r="80" stroke="#c9a84c" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.25"/>
          <circle cx="120" cy="0" r="55" stroke="#c9a84c" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.2"/>
          <circle cx="120" cy="0" r="30" stroke="#c9a84c" strokeWidth="0.5" opacity="0.15"/>
          {[0,30,60,90].map(a => (
            <ellipse key={a} cx="80" cy="0" rx="6" ry="3" fill="#c9a84c" opacity="0.18"
              transform={`rotate(${a} 120 0)`}/>
          ))}
        </svg>
        {/* Floating diyas */}
        <svg className="pd-diya pd-diya-1" viewBox="0 0 40 40">
          <ellipse cx="20" cy="28" rx="14" ry="6" fill="#c9a84c" opacity="0.55"/>
          <ellipse cx="20" cy="26" rx="10" ry="4" fill="#f0c060" opacity="0.6"/>
          <path d="M20 22 Q22 10 20 4 Q18 10 20 22" fill="#FFD700" opacity="0.9"/>
          <ellipse cx="20" cy="22" rx="3" ry="5" fill="#FF8C00" opacity="0.8"/>
        </svg>
        <svg className="pd-diya pd-diya-2" viewBox="0 0 40 40">
          <ellipse cx="20" cy="28" rx="14" ry="6" fill="#c9a84c" opacity="0.45"/>
          <ellipse cx="20" cy="26" rx="10" ry="4" fill="#f0c060" opacity="0.5"/>
          <path d="M20 22 Q22 10 20 4 Q18 10 20 22" fill="#FFD700" opacity="0.8"/>
          <ellipse cx="20" cy="22" rx="3" ry="5" fill="#FF8C00" opacity="0.7"/>
        </svg>
        <svg className="pd-diya pd-diya-3" viewBox="0 0 40 40">
          <ellipse cx="20" cy="28" rx="14" ry="6" fill="#c9a84c" opacity="0.4"/>
          <ellipse cx="20" cy="26" rx="10" ry="4" fill="#f0c060" opacity="0.45"/>
          <path d="M20 22 Q22 10 20 4 Q18 10 20 22" fill="#FFD700" opacity="0.75"/>
          <ellipse cx="20" cy="22" rx="3" ry="5" fill="#FF8C00" opacity="0.65"/>
        </svg>
        {/* Sparkle dots */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`pd-sparkle pd-sparkle-${i+1}`} />
        ))}
      </div>

      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.title}</span>
      </div>

      <div className="product-detail-layout">
        {/* Images */}
        <div className="product-images">
          <div className="product-thumbnails">
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`thumbnail ${selectedImage === i ? 'active' : ''}`}
                onClick={() => setSelectedImage(i)}
              >
                <img
                  src={img}
                  alt={`${product.title} view ${i + 1}`}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/80x100/f5f0eb/333?text=M';
                  }}
                />
              </button>
            ))}
          </div>
          <div className="product-main-image">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x700/f5f0eb/333?text=MANROZ';
              }}
            />
            {discount > 0 && <span className="badge-discount large">{discount}% OFF</span>}
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          <span className="product-category-tag">{product.category}</span>
          <h1 className="product-title">{product.title}</h1>

          <div className="product-price-section">
            <span className="price-current large">₹{product.basePrice.toLocaleString('en-IN')}</span>
            {product.compareAtPrice && (
              <>
                <span className="price-compare large">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
                <span className="price-save">Save ₹{(product.compareAtPrice - product.basePrice).toLocaleString('en-IN')}</span>
              </>
            )}
          </div>

          <p className="product-desc">{product.description}</p>

          {/* Size Selector */}
          <div className="size-section">
            <div className="size-header">
              <h4>Select Size</h4>
            </div>
            <div className="size-options">
              {product.variants.map((v) => (
                <button
                  key={v.size}
                  className={`size-btn ${selectedSize === v.size ? 'active' : ''} ${v.inventory === 0 ? 'sold-out' : ''}`}
                  onClick={() => {
                    if (v.inventory > 0) {
                      setSelectedSize(v.size);
                      setSizeError(false);
                    }
                  }}
                  disabled={v.inventory === 0}
                >
                  {v.size}
                  {v.inventory === 0 && <span className="size-soldout-line"></span>}
                </button>
              ))}
            </div>
            {sizeError && <p className="size-error">Please select a size</p>}
          </div>

          {/* Actions */}
          <div className="product-actions">
            <button className="btn-add-cart" onClick={handleAddToCart}>
              {addedMsg ? addedMsg : 'Add to Cart'}
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          {/* Features */}
          <div className="product-features">
            <div className="feature-item">
              <span>🚚</span> Free shipping on orders above ₹2,000
            </div>
            <div className="feature-item">
              <span>↩️</span> 7-day easy returns
            </div>
            <div className="feature-item">
              <span>🔒</span> Secure payment
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section related-section">
          <div className="section-header">
            <h2>You May Also Like</h2>
          </div>
          <div className="products-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetail;
