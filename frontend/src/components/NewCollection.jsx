import { Link } from 'react-router-dom';
import './NewCollection.css';

const NewCollection = () => {
  return (
    <div className="nc-split">
      {/* Left: image grid */}
      <div className="nc-left">
        <div className="nc-heading-wrap">
          <h2 className="nc-heading">New<br />Collections</h2>
          <div className="nc-heading-line" />
        </div>
        <div className="nc-grid">
          <div className="nc-grid-tall">
            <img src="https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0406.jpg?v=1746681350" alt="Collection 1" loading="lazy" />
          </div>
          <div className="nc-grid-right">
            <img src="https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0474.jpg?v=1746682016" alt="Collection 2" loading="lazy" />
            <img src="https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0504.jpg?v=1746682207" alt="Collection 3" loading="lazy" />
          </div>
          <div className="nc-grid-bottom">
            <img src="https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0310.jpg?v=1746680630" alt="Collection 4" loading="lazy" />
            <div className="nc-grid-accent" />
            <img src="https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0519.jpg?v=1746680500" alt="Collection 5" loading="lazy" />
          </div>
        </div>
        <div className="nc-side-label">N E W &nbsp; C O L L E C T I O N</div>
      </div>

      {/* Right: text */}
      <div className="nc-right">
        <span className="nc-tag">NEW COLLECTION</span>
        <h3 className="nc-title">Discover the<br />Latest Trends</h3>
        <p className="nc-desc">
          Welcome to the New Collection at Manroz! Our carefully curated
          selection brings you the best in Indian fashion. From elegant
          co-ord sets to stunning lehengas, each piece reflects a unique
          fusion of tradition and modernity. Whether you're attending a
          wedding or looking for a casual yet stylish outfit, our collection
          has something for everyone. Dive into the latest styles and
          elevate your wardrobe today!
        </p>
        <Link to="/shop" className="nc-btn">
          SHOP NOW
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default NewCollection;