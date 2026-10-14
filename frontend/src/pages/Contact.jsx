import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="ct-page">

      {/* ── Hero ── */}
      <section className="ct-hero">
        <span className="ct-hero-label">MANROZ</span>
        <h1 className="ct-hero-title">Get in Touch</h1>
        <p className="ct-hero-sub">We're here to help — reach out and we'll respond within 24 hours</p>
        <div className="ct-hero-line" />
      </section>

      <div className="ct-body">

        {/* ── Left: Info Cards ── */}
        <aside className="ct-aside">
          <div className="ct-info-card">
            <div className="ct-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <h4>Our Shop</h4>
              <p>D-151, Second Floor, Phase-8, Industrial Area,<br />Sector 73, Sahibzada Ajit Singh Nagar,<br />Punjab 160071</p>
            </div>
          </div>

          <div className="ct-info-card">
            <div className="ct-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.09 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
              </svg>
            </div>
            <div>
              <h4>Phone</h4>
              <a href="tel:+917888735337">+91 78887 35337</a>
            </div>
          </div>

          <div className="ct-info-card">
            <div className="ct-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <h4>Email Us</h4>
              <a href="mailto:info@manroz.com">info@manroz.com</a>
            </div>
          </div>

          <div className="ct-info-card">
            <div className="ct-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <h4>Working Hours</h4>
              <p>Mon – Fri: 9:00 AM to 5:00 PM (IST)</p>
            </div>
          </div>

          {/* Decorative quote */}
          <div className="ct-aside-quote">
            <span className="ct-aside-mark">"</span>
            <p>Every question answered, every look perfected.</p>
          </div>
        </aside>

        {/* ── Right: Form ── */}
        <div className="ct-form-wrap">
          {sent ? (
            <div className="ct-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <h3>Message Sent!</h3>
              <p>We'll get back to you within 24 hours.</p>
              <button className="ct-send-again" onClick={() => setSent(false)}>Send Another</button>
            </div>
          ) : (
            <form className="ct-form" onSubmit={handleSubmit} noValidate>
              <div className="ct-form-header">
                <h2>Send a Message</h2>
                <p>Fill in the details below and we'll get back to you shortly.</p>
              </div>

              <div className="ct-row">
                <div className="ct-field">
                  <label htmlFor="c-name">Full Name</label>
                  <input id="c-name" type="text" name="name" value={form.name}
                    onChange={handleChange} placeholder="Your name" required />
                </div>
                <div className="ct-field">
                  <label htmlFor="c-email">Email Address</label>
                  <input id="c-email" type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="you@example.com" required />
                </div>
              </div>

              <div className="ct-field">
                <label htmlFor="c-subject">Subject</label>
                <input id="c-subject" type="text" name="subject" value={form.subject}
                  onChange={handleChange} placeholder="Order query / Return / Other" required />
              </div>

              <div className="ct-field">
                <label htmlFor="c-message">Message</label>
                <textarea id="c-message" name="message" value={form.message}
                  onChange={handleChange} rows={5}
                  placeholder="Tell us how we can help..." required />
              </div>

              <button type="submit" className="ct-submit">
                Send Message
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>

    </main>
  );
};

export default Contact;
