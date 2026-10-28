import { useState, useEffect } from 'react';
import festiveBanner from '../assets/FestiveSeasonSale.png';
import './HomeSection.css';

const API = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';

const BOTTOM_FALLBACK = [
  '🔥 MEGA SALE — Flat 50% Off Everything',
  'Free Shipping on ₹2000+',
  '🔥 50% OFF — Shop Now',
  'Limited Stock — Hurry Up!',
  '🔥 MEGA SALE — Flat 50% Off Everything',
  'Easy 7-Day Returns',
  '🔥 50% OFF All Products',
  'New Festive Collection is Live',
  '🔥 MEGA SALE — Flat 50% Off Everything',
  "Grab Your Favourite Before It's Gone",
];

const HomeSection = () => {
  const [bottomItems, setBottomItems] = useState(BOTTOM_FALLBACK);

  useEffect(() => {
    fetch(`${API}/api/admin/announcements/active?position=bottom`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBottomItems(data.map((a) => (a.linkLabel ? `${a.text}  ${a.linkLabel}` : a.text)));
        }
      })
      .catch(() => {}); // silently fall back to hardcoded
  }, []);

  const doubled = [...bottomItems, ...bottomItems];

  return (
    <>
      {/* Single Banner */}
      <div className="hs-festive-banner">
        <img
          src={festiveBanner}
          alt="Festive Season Sale — Flat 50% Off"
          className="hs-festive-img hs-banner-active"
          loading="eager"
        />
      </div>

      {/* Bottom Marquee */}
      <div className="hs-bottom-marquee">
        <div className="hs-bottom-track">
          {doubled.map((text, i) => (
            <span key={i} className="hs-bottom-item">
              <span className="hs-bottom-dot" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomeSection;
