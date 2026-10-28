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
  const [barBg, setBarBg] = useState(null); // null = use CSS default

  useEffect(() => {
    fetch(`${API}/api/admin/announcements/active?position=top`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Use the highest-priority announcement's bgColor for the whole bar
          setBarBg(data[0].bgColor || null);
          setItems(data.map((a) => ({
            text: a.linkLabel ? `${a.text}  ${a.linkLabel}` : a.text,
            highlight: true,
            link: a.link || null,
            bgColor: a.bgColor || null,
            textColor: a.textColor || null,
          })));
        }
      })
      .catch(() => {}); // silently fall back to hardcoded
  }, []);

  const doubled = [...items, ...items];

  return (
    <div
      className="hs-marquee-bar"
      style={barBg ? { background: barBg } : undefined}
      role="marquee"
      aria-label="Promotional announcements"
    >
      <div className="hs-marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="hs-marquee-item"
            style={item.textColor ? { color: item.textColor } : undefined}
          >
            <span className="hs-marquee-star" style={item.textColor ? { color: item.textColor, opacity: 0.5 } : undefined}>✦</span>
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
