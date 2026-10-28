import { useState, useEffect } from 'react';
import './HomeSection.css';

const API = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';

const FALLBACK_ITEMS = [
  { text: '🔥 MEGA SALE — Flat 50% Off Sitewide', highlight: true },
  { text: 'Free Shipping Above ₹2,000' },
  { text: '50% OFF — Limited Time Only', highlight: true },
  { text: 'Easy 7-Day Returns' },
  { text: 'Shop Now Before Stock Runs Out' },
  { text: '50% OFF on All Products', highlight: true },
  { text: 'Premium Ethnic Wear by Manroz' },
  { text: '🔥 MEGA SALE — Flat 50% Off Sitewide', highlight: true },
  { text: 'New Festive Collection — 50% Off', highlight: true },
];

const TopMarquee = () => {
  const [items, setItems] = useState(FALLBACK_ITEMS);

  useEffect(() => {
    fetch(`${API}/api/admin/announcements/active`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.map((a) => ({
            text: a.linkLabel ? `${a.text}  ${a.linkLabel}` : a.text,
            highlight: true,
            link: a.link || null,
            bgColor: a.bgColor,
            textColor: a.textColor,
          })));
        }
      })
      .catch(() => {}); // silently fall back to hardcoded
  }, []);

  const doubled = [...items, ...items];

  return (
    <div className="hs-marquee-bar" role="marquee" aria-label="Promotional announcements">
      <div className="hs-marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="hs-marquee-item">
            <span className="hs-marquee-star">✦</span>
            {item.link ? (
              <a
                href={item.link}
                className={item.highlight ? 'hs-marquee-highlight' : ''}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {item.text}
              </a>
            ) : (
              <span className={item.highlight ? 'hs-marquee-highlight' : ''}>
                {item.text}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopMarquee;
