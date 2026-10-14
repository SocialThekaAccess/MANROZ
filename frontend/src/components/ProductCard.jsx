import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const ProductCardInner = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const isSoldOut = product.status === 'soldout' || product.variants.every((v) => v.inventory === 0);

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (isSoldOut) return;
    const defaultSize = product.variants[0]?.size || 'XL';
    addToCart(product, defaultSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className={`product-card ${isSoldOut ? 'product-card-soldout' : ''}`}>
      <Link to={`/product/${product.handle}`} className="product-card-img-wrap">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x500/f5f0eb/333?text=MANROZ';
          }}
        />
        {/* Badges */}
        {isSoldOut ? (
          <span className="badge-soldout">Sold Out</span>
        ) : discount > 0 && (
          <span className="badge-discount">{discount}% OFF</span>
        )}

        {/* Quick add — only if in stock */}
        {!isSoldOut && (
          <div className="product-card-overlay">
            <button className="btn-quick-add" onClick={handleQuickAdd}>
              {added ? '✓ Added!' : 'Quick Add'}
            </button>
          </div>
        )}
      </Link>

      <div className="product-card-info">
        <Link to={`/product/${product.handle}`}>
          <h3 className="product-card-title">{product.title}</h3>
        </Link>
        <div className="product-card-price">
          <span className="price-current">₹{product.basePrice.toLocaleString('en-IN')}</span>
          {product.compareAtPrice && (
            <span className="price-compare">₹{product.compareAtPrice.toLocaleString('en-IN')}</span>
          )}
          {isSoldOut && <span className="price-soldout-label">Sold Out</span>}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => (
  <ProductCardInner product={product} />
);

export default ProductCard;
