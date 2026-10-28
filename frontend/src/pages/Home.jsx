import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import newCollectionBanner from '../assets/NewCollection.png';
import ProductCard from '../components/ProductCard';
import VideoCarousel from '../components/VideoCarousel';
import HomeSection from '../components/HomeSection';
import NewCollection from '../components/NewCollection';
import InstaGrid from '../components/InstaGrid';
import HappyCustomers from '../components/HappyCustomers';

const featured = products.filter((p) => p.featured && p.status !== 'archived').slice(0, 4);

// Get multiple images per category for hover slideshow
const getCatImages = (prods, cat) => {
  const catProducts = prods.filter((p) => p.category === cat && p.images?.length);
  if (cat === 'Lehenga') {
    const first = catProducts.find((p) => p.featured) || catProducts[0];
    return first ? first.images.slice(0, 6) : [];
  }
  return catProducts.flatMap((p) => p.images.slice(0, 2)).slice(0, 6);
};

// Single category card with auto image cycle
const CatCard = ({ cat }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const timerRef = useRef(null);

  // Preload all images on mount
  useEffect(() => {
    cat.images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [cat.images]);

  // Auto-cycle always running — staggered by startDelay so all 3 cards don't change simultaneously
  const startCycle = (interval) => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setImgIdx(i => (i + 1) % cat.images.length);
    }, interval);
  };

  useEffect(() => {
    const delayTimer = setTimeout(() => startCycle(2200), cat.startDelay || 0);
    return () => {
      clearTimeout(delayTimer);
      clearInterval(timerRef.current);
    };
  }, [cat.images.length]);

  // Hover: speed up; leave: back to normal
  const handleEnter = () => startCycle(700);
  const handleLeave = () => startCycle(2200);

  return (
    <Link
      to={`/shop?category=${cat.name}`}
      className="cat-card-new"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Image */}
      <div className="cat-card-img-wrap">
        {cat.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={cat.label}
            className={`cat-card-img ${i === imgIdx ? 'active' : ''}`}
            loading="eager"
            fetchPriority={i === 0 ? 'high' : 'low'}
            onError={e => { e.target.src = `https://placehold.co/500x650/1a1a1a/fff?text=${cat.label}`; }}
          />
        ))}
        {/* Shimmer bar at bottom */}
        <div className="cat-card-shimmer" />
        {/* Sale badge */}
        <span className="cat-sale-tag">50% OFF</span>
      </div>

      {/* Content overlay */}
      <div className="cat-card-content">
        <span className="cat-card-tag">{cat.tag}</span>
        <h3 className="cat-card-title">{cat.label}</h3>
        <p className="cat-card-sub">{cat.subtitle}</p>
        <div className="cat-card-footer">
          <span className="cat-card-count">{cat.count} Styles</span>
          <span className="cat-card-explore">
            Explore
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
        </div>
      </div>

      {/* Image dots */}
      {cat.images.length > 1 && (
        <div className="cat-card-dots">
          {cat.images.slice(0, 6).map((_, i) => (
            <span key={i} className={`cat-card-dot ${i === imgIdx ? 'active' : ''}`} />
          ))}
        </div>
      )}
    </Link>
  );
};

const Home = () => {
  const { products } = useProducts();

  const featured = products.filter((p) => p.featured && p.status !== 'archived').slice(0, 4);

  const categoryData = [
    {
      name: 'Lehenga',
      label: 'Lehengas',
      subtitle: 'Wedding & Festive',
      tag: 'New Season',
      count: products.filter((p) => p.category === 'Lehenga').length,
      images: getCatImages(products, 'Lehenga'),
      startDelay: 0,
    },
    {
      name: 'Coord Set',
      label: 'Coord Sets',
      subtitle: 'Casual & Semi-formal',
      tag: 'Best Sellers',
      count: products.filter((p) => p.category === 'Coord Set').length,
      images: getCatImages(products, 'Coord Set'),
      startDelay: 800,
    },
    {
      name: 'Suit',
      label: 'Suits',
      subtitle: 'Elegant & Timeless',
      tag: 'Premium',
      count: products.filter((p) => p.category === 'Suit').length,
      images: getCatImages(products, 'Suit'),
      startDelay: 1600,
    },
  ];

  return (
    <main>
      {/* Festive Sale Banner + Marquee — TOP */}
      <HomeSection />

      {/* Watch & Buy Video Carousel — right after HomeSection */}
      <VideoCarousel />

      {/* Categories — Redesigned */}
      <section className="cat-section">
        <div className="cat-header">
          <p>Flat 50% Off on All Styles — Limited Time!</p>
          <h2>Shop by Category</h2>
        </div>
        <div className="cat-grid-new">
          {categoryData.map((cat) => (
            <CatCard key={cat.name} cat={cat} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section products-section">

        {/* New Collection — Split Section */}
        <NewCollection />

        <div className="section-header">
          <h2>Featured Collection</h2>
          <p>🔥 Flat 50% Off — Handpicked pieces for you</p>
        </div>
        <div className="products-grid">
          {featured.map((p) => (
            <ProductCard key={p._id || p.handle} product={p} />
          ))}
        </div>
        <div className="section-footer">
          <Link to="/shop" className="btn-primary">
            View All Products
          </Link>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="brand-strip">
        <div className="brand-strip-inner">
          <div className="brand-feature">
            <span className="brand-icon">✦</span>
            <h4>Premium Quality</h4>
            <p>Handcrafted with finest fabrics</p>
          </div>
          <div className="brand-feature">
            <span className="brand-icon">✦</span>
            <h4>Free Shipping</h4>
            <p>On orders above ₹2,000</p>
          </div>
          <div className="brand-feature">
            <span className="brand-icon">✦</span>
            <h4>Easy Returns</h4>
            <p>7-day hassle-free returns</p>
          </div>
          <div className="brand-feature">
            <span className="brand-icon">✦</span>
            <h4>Secure Payment</h4>
            <p>100% safe & encrypted</p>
          </div>
        </div>
      </section>

      {/* New Arrivals — Instagram Style */}
      <InstaGrid products={products.filter((p) => p.status !== 'archived').slice(4, 12)} />

      {/* Happy Customers */}
      <HappyCustomers />
    </main>
  );
};

export default Home;
