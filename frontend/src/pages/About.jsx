import { Link } from 'react-router-dom';

const About = () => {
  return (
    <main className="about-page">
      <section className="about-hero">
        <h1>Our Story</h1>
        <p>Born from a passion for timeless Indian fashion</p>
      </section>

      <section className="about-content section">
        <div className="about-grid">
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              Manroz is a premium women's ethnic and western wear brand dedicated to celebrating
              the modern Indian woman. We believe every woman deserves to feel confident,
              beautiful, and comfortable in what she wears.
            </p>
            <p>
              From intricately embroidered lehengas to elegant coord sets, each piece in our
              collection is crafted with care using premium fabrics and thoughtful design.
              We blend traditional craftsmanship with contemporary silhouettes to create
              outfits that are both timeless and trendy.
            </p>
            <p>
              Based in India, we ship across the country, bringing luxury ethnic wear
              directly to your doorstep.
            </p>
            <Link to="/shop" className="btn-primary">
              Explore Collection
            </Link>
          </div>
          <div className="about-values">
            <div className="value-card">
              <span>🧵</span>
              <h4>Quality Craftsmanship</h4>
              <p>Every piece is carefully crafted using premium fabrics and skilled embroidery.</p>
            </div>
            <div className="value-card">
              <span>💫</span>
              <h4>Unique Designs</h4>
              <p>Our designs blend tradition with modern trends for a look that's truly yours.</p>
            </div>
            <div className="value-card">
              <span>🤝</span>
              <h4>Customer First</h4>
              <p>We're committed to providing the best shopping experience from browse to delivery.</p>
            </div>
            <div className="value-card">
              <span>🌿</span>
              <h4>Conscious Fashion</h4>
              <p>We support ethical practices and responsible sourcing in everything we do.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
