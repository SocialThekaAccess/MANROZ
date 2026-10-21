import { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    q: 'Where is Manroz located?',
    a: 'Manroz is based in Punjab, India, with a primary office at D-151, Second Floor, Phase-8, Industrial Area, Sector 73, Sahibzada Ajit Singh Nagar, Punjab 160071.',
  },
  {
    q: 'What products does Manroz offer?',
    a: 'We offer a wide range of women\'s fashion, including co-ord sets, lehengas, cotton suits, georgette suits, kurti sets, and Punjabi Juitis.',
  },
  {
    q: 'Do you offer customization?',
    a: 'Currently, we do not offer customization services. However, our collection includes a wide range of sizes and styles to suit various preferences.',
  },
  {
    q: 'How do I determine my size?',
    a: 'Each product page includes a detailed size chart to help you choose the right fit. You can refer to this for accurate measurements in inches.',
  },
  {
    q: 'How do I place an order?',
    a: 'Browse the product, select your size, and click "Add to Cart." Once ready, proceed to checkout and follow the instructions for payment and delivery.',
  },
  {
    q: 'How do I apply a promo code?',
    a: 'Enter the promo code during checkout, in the "Promo Code" section, before completing your purchase.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept major credit/debit cards, net banking, UPI, and popular e-wallets like Paytm, Mobikwik, and JioMoney.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Yes, your payment information is processed securely through a trusted payment gateway. We do not store any card details on our servers.',
  },
  {
    q: 'What are the shipping charges?',
    a: 'Shipping within India is based on the weight of the order and the destination. You can view the final shipping charges during checkout.',
  },
  {
    q: 'Do you offer express delivery?',
    a: 'Yes, express shipping is available for an additional fee. Please check availability at checkout.',
  },
  {
    q: 'What is the estimated delivery time?',
    a: 'Standard delivery usually takes 5-7 business days, depending on your location. You will receive tracking details to monitor your delivery.',
  },
  {
    q: 'Can I change my delivery address after placing an order?',
    a: 'Once the order is processed, changing the address may not be possible. Please contact customer service immediately for any changes.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns for unused and undamaged products within 7 days of delivery. Please ensure the product is in its original condition with tags and packaging.',
  },
  {
    q: 'How do I request a return or exchange?',
    a: 'To initiate a return or exchange, contact us at info@manroz.com with your order details. Once approved, send the item back to our warehouse in Patiala, India.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Yes, you can cancel your order within 24 hours of placing it by emailing us at info@manroz.com.',
  },
  {
    q: 'How will I receive my refund?',
    a: 'Refunds will be processed via your original payment method within 7-10 business days after approval.',
  },
  {
    q: 'How do I return a product?',
    a: 'Mail your product to our address in Patiala, India. You will be responsible for paying for the return shipping.',
  },
  {
    q: 'Can I track my return shipment?',
    a: 'Yes, we recommend using a trackable shipping service when returning products to ensure we receive them.',
  },
];

const FAQItem = ({ faq, isOpen, onClick }) => (
  <div className={`faq-item ${isOpen ? 'open' : ''}`}>
    <button className="faq-question" onClick={onClick}>
      <span className="faq-icon">?</span>
      <span>{faq.q}</span>
      <svg className="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
    <div className="faq-answer">
      <p>{faq.a}</p>
    </div>
  </div>
);

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <main className="faq-page">
      <div className="faq-inner">
        <div className="faq-header">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">Everything you need to know about Manroz</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIdx === i}
              onClick={() => toggle(i)}
            />
          ))}
        </div>

        <div className="faq-contact">
          <p>Still have questions?</p>
          <a href="mailto:info@manroz.com" className="faq-contact-btn">
            Contact Us — info@manroz.com
          </a>
        </div>
      </div>
    </main>
  );
};

export default FAQ;
