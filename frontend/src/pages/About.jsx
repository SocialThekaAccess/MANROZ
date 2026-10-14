import { Link } from 'react-router-dom';
import aboutBanner from '../assets/Banner3.jpg';

// Category tiles data — images from actual products
const categoryTiles = [
  {
    name: 'Lehengas',
    tag: 'FESTIVE GLAMOUR AWAITS',
    desc: 'Dazzle at every celebration with stunning lehengas.',
    link: '/shop?category=Lehenga',
    img: 'https://res.cloudinary.com/oaaxsftf/image/upload/w_1200,q_auto,f_auto/v1791978022/manroz/products/heavy-black-pink-lehnga/heavy-black-pink-lehnga_4.jpg',
    size: 'large',
  },
  {
    name: 'Coord Sets',
    tag: 'STYLE IN SYNC',
    desc: 'Ready-to-wear matching sets for effortless fashion.',
    link: '/shop?category=Coord Set',
    img: 'https://res.cloudinary.com/oaaxsftf/image/upload/v1791978036/manroz/products/three-piece-pink-festive-coord-set/three-piece-pink-festive-coord-set_1.jpg',
    size: 'small',
  },
  {
    name: 'Suits',
    tag: 'TRADITION WITH A TWIST',
    desc: 'Vibrant and minimal suit sets to elevate your wardrobe.',
    link: '/shop?category=Suit',
    img: 'https://res.cloudinary.com/oaaxsftf/image/upload/v1791978087/manroz/products/blue-heavy-embroided-suit-with-neck-work/blue-heavy-embroided-suit-with-neck-work_1.jpg',
    size: 'small',
  },
];

// About split section image — Dark Blue Print Flowers Coord Set
const ABOUT_IMG = 'https://res.cloudinary.com/oaaxsftf/image/upload/v1791978071/manroz/products/dark-blue-coord-set-with-silver-stones/dark-blue-coord-set-with-silver-stones_1.jpg';

const About = () => {
  return (
    <main className="about-page">

      {/* ── Page Title ── */}
      <div className="ab-page-title">
        <h1 className="ab-hero-title">About <span>Manroz</span></h1>
        <p className="ab-hero-sub">Where tradition meets modern elegance</p>
      </div>

      {/* ── Split: Image + About Text ── */}
      <section className="ab-split">
        <div className="ab-split-img-wrap">
          <div className="ab-split-accent" />
          <img src={ABOUT_IMG} alt="Manroz Collection" className="ab-split-img" />
          <div className="ab-split-label">M A N R O Z</div>
        </div>

        <div className="ab-split-text">
          <h2 className="ab-split-title">Ace Your Fashion Game<br />with Manroz</h2>
          <p>
            The age of Change, Understanding the game of Fashion — We at Manroz specialize in
            providing new fashion trending clothes. In the era of trendy fashion, where everyone
            wants to keep their fashion game strong, We're here to ace your Fashion Game.
          </p>
          <p>
            Inspired by the authenticity and vulnerability of Fashion, Manroz focuses on
            eye-catching details. With intricate pieces to selective minimal designs, our sense
            of collection is completely out of the box — providing quality and a great customer
            experience so that we are remembered every time.
          </p>
          <p>
            Manroz offers a wide range of coord sets, lehengas, and suits for women that
            includes both casual and festive wear. With the upcoming festive and wedding season,
            our collection is designed to make every woman feel confident and beautiful.
          </p>
          <Link to="/shop" className="ab-split-cta">EXPLORE MORE &rsaquo;</Link>
        </div>
      </section>

      {/* ── Category Bento Grid ── */}
      <section className="ab-grid-section">
        <div className="ab-bento">
          {/* Large left card */}
          <Link to={categoryTiles[0].link} className="ab-tile ab-tile-large">
            <img src={categoryTiles[0].img} alt={categoryTiles[0].name} />
            <div className="ab-tile-overlay" />
            <div className="ab-tile-content">
              <span className="ab-tile-tag">{categoryTiles[0].tag}</span>
              <h2 className="ab-tile-name">{categoryTiles[0].name}</h2>
              <p className="ab-tile-desc">{categoryTiles[0].desc}</p>
              <span className="ab-tile-btn">SHOP NOW &rsaquo;</span>
            </div>
          </Link>

          {/* Right column — two stacked cards */}
          <div className="ab-tile-col">
            {categoryTiles.slice(1).map((tile) => (
              <Link key={tile.name} to={tile.link} className="ab-tile ab-tile-small">
                <img src={tile.img} alt={tile.name} />
                <div className="ab-tile-overlay" />
                <div className="ab-tile-content">
                  <span className="ab-tile-tag">{tile.tag}</span>
                  <h2 className="ab-tile-name">{tile.name}</h2>
                  <p className="ab-tile-desc">{tile.desc}</p>
                  <span className="ab-tile-btn">SHOP NOW &rsaquo;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values Strip ── */}
      <section className="ab-values">
        <div className="ab-values-inner">
          <div className="ab-value">
            <div className="ab-value-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h4>Premium Craftsmanship</h4>
            <p>Every piece crafted with finest fabrics & skilled embroidery</p>
          </div>
          <div className="ab-value">
            <div className="ab-value-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h4>Unique Designs</h4>
            <p>Tradition blended with modern trends for a look that's yours</p>
          </div>
          <div className="ab-value">
            <div className="ab-value-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <h4>Customer First</h4>
            <p>Best shopping experience from browse to your doorstep</p>
          </div>
          <div className="ab-value">
            <div className="ab-value-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h4>Conscious Fashion</h4>
            <p>Ethical practices and responsible sourcing in everything</p>
          </div>
        </div>
      </section>

    </main>
  );
};

export default About;