import { Link } from 'react-router-dom';
import collectionVideo from '../assets/ManrozVideo.mp4';
import './Collections.css';

const categories = [
  {
    name: 'Coord Sets',
    tag: 'STYLE IN SYNC',
    desc: 'Matching sets that do the work for you',
    link: '/shop?category=Coord Set',
    img: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/11_48e64862-a50c-47c1-87a7-807f3018872e.png?v=1746678982',
  },
  {
    name: 'Suits',
    tag: 'TRADITION WITH A TWIST',
    desc: 'Vibrant prints meet minimal silhouettes',
    link: '/shop?category=Suit',
    img: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0474.jpg?v=1746682016',
  },
  {
    name: 'Lehengas',
    tag: 'FESTIVE GLAMOUR',
    desc: 'Turn heads at every celebration',
    link: '/shop?category=Lehenga',
    img: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A9984.jpg?v=1746678488',
  },
  {
    name: 'Cotton',
    tag: 'EFFORTLESS COMFORT',
    desc: 'Breathable fabrics, all-day confidence',
    link: '/shop?category=Cotton',
    img: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0413.jpg?v=1746681418',
  },
];

const Collections = () => {
  return (
    <main className="col-page">

      {/* ── Cinematic Video Hero ── */}
      <section className="col-hero">
        <video
          className="col-hero-video"
          src={collectionVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="col-hero-overlay">
          <div className="col-hero-content">
            <p className="col-hero-eyebrow">
              <span className="col-eyebrow-line" />
              M A N R O Z
              <span className="col-eyebrow-line" />
            </p>
            <h1 className="col-hero-title">
              The <em>Collection</em>
            </h1>
            <p className="col-hero-sub">Handpicked styles for every occasion</p>
            <Link to="/shop" className="col-hero-cta">
              <span>Explore All</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
          <div className="col-scroll-hint">
            <span>Scroll</span>
            <div className="col-scroll-line" />
          </div>
        </div>
      </section>

      {/* ── Intro strip ── */}
      <div className="col-intro">
        <div className="col-intro-inner">
          <span className="col-intro-tag">OUR STORY</span>
          <h2>Dressed for Every Chapter</h2>
          <p>From festive nights to everyday ease — Manroz brings you fashion that moves with you.</p>
        </div>
      </div>

      {/* ── Category grid ── */}
      <section className="col-bento">
        <div className="col-bento-head">
          <span className="col-intro-tag">SHOP BY CATEGORY</span>
          <h2>Curated <em>For You</em></h2>
        </div>

        <div className="col-bento-grid">
          {categories.map((c, i) => (
            <Link key={c.name} to={c.link} className={`col-bento-card col-card-${i + 1}`}>
              <img src={c.img} alt={c.name} loading="lazy" />
              <div className="col-bento-overlay" />
              <span className="col-bento-index">0{i + 1}</span>
              <span className="col-bento-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" /><polyline points="8 7 17 7 17 16" />
                </svg>
              </span>
              <div className="col-bento-info">
                <span className="col-bento-tag">{c.tag}</span>
                <h3 className="col-bento-name">{c.name}</h3>
                <p className="col-bento-desc">{c.desc}</p>
                <span className="col-bento-btn">Shop Now</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="col-stats">
        {[
          { num: '500+', label: 'Styles Available' },
          { num: '10K+', label: 'Happy Customers' },
          { num: '100%', label: 'Authentic Fabric' },
          { num: '7-Day', label: 'Easy Returns' },
        ].map(s => (
          <div key={s.label} className="col-stat">
            <span className="col-stat-num">{s.num}</span>
            <span className="col-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Dark CTA ── */}
      <section className="col-cta-dark">
        <div className="col-cta-dark-inner">
          <span className="col-cta-eyebrow">NEW ARRIVALS EVERY WEEK</span>
          <h2>Your Next Favourite<br /><em>Look Is Waiting</em></h2>
          <Link to="/shop" className="col-cta-dark-btn">
            Shop All Collections
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </section>

    </main>
  );
};

export default Collections;