import './HomeSection.css';

const marqueeItems = [
  { text: '🔥 MEGA SALE — Flat 50% Off Sitewide', highlight: true },
  { text: 'Free Shipping Above ₹2,000' },
  { text: '50% OFF — Limited Time Only', highlight: true },
  { text: 'Easy 7-Day Returns' },
  { text: '🔥 MEGA SALE — Flat 50% Off Sitewide', highlight: true },
  { text: 'Shop Now Before Stock Runs Out' },
  { text: '50% OFF on All Products', highlight: true },
  { text: 'Premium Ethnic Wear by Manroz' },
  { text: '🔥 MEGA SALE — Flat 50% Off Sitewide', highlight: true },
  { text: 'New Festive Collection — 50% Off', highlight: true },
];

const TopMarquee = () => {
  return (
    <div className="hs-marquee-bar" role="marquee" aria-label="Promotional announcements">
      <div className="hs-marquee-track">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={i} className="hs-marquee-item">
            <span className="hs-marquee-star">✦</span>
            <span className={item.highlight ? 'hs-marquee-highlight' : ''}>
              {item.text}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopMarquee;
