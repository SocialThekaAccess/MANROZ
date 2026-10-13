import { useState, useEffect } from 'react';

import hc1 from '../assets/HappyCustomers/HappyCustomers1.png';
import hc2 from '../assets/HappyCustomers/HappyCustomers2.png';
import hc3 from '../assets/HappyCustomers/HappyCustomers3.jpg';
import hc4 from '../assets/HappyCustomers/HappyCustomers4.jpg';
import hc5 from '../assets/HappyCustomers/HappyCustomers5.jpg';
import hc6 from '../assets/HappyCustomers/HappyCustomers6.jpg';
import hc7 from '../assets/HappyCustomers/HappyCustomers7.jpg';
import hc8 from '../assets/HappyCustomers/HappyCustomers8.jpg';

const customers = [
  { id: 1, img: hc1, name: 'Priya S.',  rating: 5, text: 'Absolutely loved the quality! The fabric feels so premium and the fit was perfect. Will definitely order again.' },
  { id: 2, img: hc2, name: 'Sneha R.',  rating: 5, text: 'Got so many compliments at the wedding! The coord set is gorgeous and the delivery was super fast.' },
  { id: 3, img: hc3, name: 'Anjali M.', rating: 5, text: 'Manroz never disappoints. The embroidery work is so detailed. Looked absolutely stunning!' },
  { id: 4, img: hc4, name: 'Divya K.',  rating: 5, text: 'Perfect for festive occasions. The color is exactly as shown and the packaging was beautiful too!' },
  { id: 5, img: hc5, name: 'Pooja T.',  rating: 5, text: 'Best ethnic wear brand I have shopped from. The lehenga quality is unmatched at this price.' },
  { id: 6, img: hc6, name: 'Meera N.', rating: 5, text: 'Wore this to a family function and everyone kept asking where I got it from. Love Manroz!' },
  { id: 7, img: hc7, name: 'Ritu B.',   rating: 5, text: 'Super comfortable and so pretty! The stitching quality is amazing. Highly recommended.' },
  { id: 8, img: hc8, name: 'Kavya P.', rating: 5, text: "The photos don't do justice — it looks even better in person! Ordering 2 more outfits soon." },
];

const Stars = () => (
  <div className="hc-stars">
    {[1,2,3,4,5].map(i => (
      <svg key={i} viewBox="0 0 24 24" fill="#FFB800" width="14" height="14">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
);

/* Single card — same markup used in both rows */
const Card = ({ c, onClick }) => (
  <div className="hc-card" onClick={() => onClick(c)}>
    <div className="hc-img-wrap">
      <img src={c.img} alt={c.name} className="hc-img" draggable={false}/>
      <span className="hc-verified">✓ Verified</span>
    </div>
    <div className="hc-content">
      <Stars />
      <p className="hc-review">"{c.text}"</p>
      <div className="hc-footer">
        <div className="hc-avatar">{c.name[0]}</div>
        <span className="hc-name">{c.name}</span>
        <span className="hc-badge">Manroz Customer</span>
      </div>
    </div>
  </div>
);

const HappyCustomers = () => {
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  // Two rows — row 2 scrolls in opposite direction for premium feel
  const row1 = [...customers, ...customers]; // doubled for seamless loop
  const row2 = [...customers].reverse();
  row2.push(...row2.slice()); // double

  return (
    <section className="hc-section">

      {/* ── Header ── */}
      <div className="hc-header">
        <span className="hc-tag">✦ Real People, Real Style ✦</span>
        <h2>Happy Customers</h2>
        <p>Our community loves Manroz — see for yourself</p>
        <div className="hc-aggregate">
          <Stars />
          <span className="hc-agg-text">4.9 / 5 &nbsp;·&nbsp; <strong>500+ Happy Customers</strong></span>
        </div>
      </div>

      {/* ── Row 1 — left scroll ── */}
      <div className="hc-belt-wrap">
        <div className="hc-belt hc-belt-left">
          {row1.map((c, i) => <Card key={i} c={c} onClick={setLightbox} />)}
        </div>
      </div>

      {/* ── Row 2 — right scroll (opposite) ── */}
      <div className="hc-belt-wrap" style={{ marginTop: '20px' }}>
        <div className="hc-belt hc-belt-right">
          {row2.map((c, i) => <Card key={i} c={c} onClick={setLightbox} />)}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="hc-lightbox" onClick={() => setLightbox(null)}>
          <button className="hc-lb-close">✕</button>
          <img
            src={lightbox.img}
            alt={lightbox.name}
            className="hc-lb-img"
            onClick={e => e.stopPropagation()}
          />
          <p className="hc-lb-name">{lightbox.name} · Manroz Customer</p>
        </div>
      )}
    </section>
  );
};

export default HappyCustomers;
