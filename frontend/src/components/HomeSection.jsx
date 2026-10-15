import festiveBanner from '../assets/FestiveSeasonSale.png';
import './HomeSection.css';

const bottomItems = [
  '🔥 MEGA SALE — Flat 50% Off Everything',
  'Free Shipping on ₹2000+',
  '🔥 50% OFF — Shop Now',
  'Limited Stock — Hurry Up!',
  '🔥 MEGA SALE — Flat 50% Off Everything',
  'Easy 7-Day Returns',
  '🔥 50% OFF All Products',
  'New Festive Collection is Live',
  '🔥 MEGA SALE — Flat 50% Off Everything',
  'Grab Your Favourite Before It\'s Gone',
];

const HomeSection = () => {
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
