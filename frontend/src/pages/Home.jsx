import { Link } from 'react-router-dom';
import products from '../data/products';
import ProductCard from '../components/ProductCard';
import VideoCarousel from '../components/VideoCarousel';
import HomeSection from '../components/HomeSection';
import InstaGrid from '../components/InstaGrid';
import HappyCustomers from '../components/HappyCustomers';

const featured = products.filter((p) => p.featured && p.status !== 'archived').slice(0, 4);

const categories = [
  {
    name: 'Lehenga',
    label: 'Lehengas',
    subtitle: 'Wedding & Festive',
    image: products.find((p) => p.category === 'Lehenga')?.images[0],
    count: products.filter((p) => p.category === 'Lehenga').length,
    size: 'large', // takes more space
  },
  {
    name: 'Coord Set',
    label: 'Coord Sets',
    subtitle: 'Casual & Semi-formal',
    image: products.find((p) => p.category === 'Coord Set')?.images[1],
    count: products.filter((p) => p.category === 'Coord Set').length,
    size: 'medium',
  },
  {
    name: 'Suit',
    label: 'Suits',
    subtitle: 'Elegant & Timeless',
    image: products.find((p) => p.category === 'Suit')?.images[0],
    count: products.filter((p) => p.category === 'Suit').length,
    size: 'medium',
  },
];

const Home = () => {
  return (
    <main>
      {/* Festive Sale Banner + Marquee — TOP */}
      <HomeSection />

      {/* Watch & Buy Video Carousel — right after HomeSection */}
      <VideoCarousel />

      {/* Categories */}
      <section className="cat-section">
        <div className="cat-header">
          <h2>Shop by Category</h2>
          <p>Find your perfect style</p>
        </div>
        <div className="cat-grid">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.name}`}
              className={`cat-card cat-${cat.size}`}
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="cat-img"
                onError={(e) => {
                  e.target.src = `https://placehold.co/600x800/1a1a1a/fff?text=${cat.label}`;
                }}
              />
              <div className="cat-overlay" />
              <div className="cat-content">
                <span className="cat-subtitle">{cat.subtitle}</span>
                <h3 className="cat-title">{cat.label}</h3>
                <span className="cat-count">{cat.count} Styles</span>
                <span className="cat-cta">
                  Explore
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section products-section">
        <div className="section-header">
          <h2>Featured Collection</h2>
          <p>Handpicked pieces for you</p>
        </div>
        <div className="products-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
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
