import { Link } from 'react-router-dom';
import festiveBanner from '../assets/FestiveSeasonSale.png';
import './HomeSection.css';

const bottomItems = [
  'Flat 50% Off — Karwachauth Sale is On',
  'Shop Now & Save Big',
  'Flat 50% Off — Karwachauth Sale is On',
  'New Collection Dropped',
  'Flat 50% Off — Karwachauth Sale is On',
  'Free Shipping on ₹2000+',
  'Flat 50% Off — Karwachauth Sale is On',
  'Exclusive Festive Styles',
];

const HomeSection = () => {
  return (
    <>
      {/* Festive Sale Banner */}
      <div className="hs-festive-banner">
        <img
          src={festiveBanner}
          alt="Festive Season Sale — Flat 50% Off"
          className="hs-festive-img"
          loading="eager"
        />
      </div>

      {/* Bottom Marquee */}
      <div className="hs-bottom-marquee">
        <div className="hs-bottom-track">
          {[...bottomItems, ...bottomItems].map((text, i) => (
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
