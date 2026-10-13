import './HomeSection.css';

const marqueeItems = [
  { text: 'Flat 50% Off on Karwachauth', highlight: true },
  { text: 'Free Shipping Above ₹2,000' },
  { text: 'Easy 7-Day Returns' },
  { text: 'Flat 50% Off on Karwachauth', highlight: true },
  { text: 'Limited Stock — Shop Fast' },
  { text: 'Premium Ethnic Wear by Manroz' },
  { text: 'Flat 50% Off on Karwachauth', highlight: true },
  { text: 'New Festive Collection is Live' },
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
