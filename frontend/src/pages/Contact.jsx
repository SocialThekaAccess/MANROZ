import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Will integrate with backend later
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="contact-page section">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you</p>
      </div>

      <div className="contact-layout">
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <div>
              <h4>Email Us</h4>
              <a href="mailto:support@manroz.in">support@manroz.in</a>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📱</span>
            <div>
              <h4>WhatsApp</h4>
              <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">+91 99999 99999</a>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🕐</span>
            <div>
              <h4>Working Hours</h4>
              <p>Mon–Sat: 10am – 7pm IST</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🔄</span>
            <div>
              <h4>Returns</h4>
              <p>7-day easy return policy</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {sent && (
            <div className="contact-success">
              ✅ Message sent! We'll get back to you within 24 hours.
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="c-name">Name</label>
              <input
                id="c-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="c-email">Email</label>
              <input
                id="c-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="c-subject">Subject</label>
            <input
              id="c-subject"
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Order query / Return / Other"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="c-message">Message</label>
            <textarea
              id="c-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us how we can help..."
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
};

export default Contact;
