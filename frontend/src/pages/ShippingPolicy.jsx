const ShippingPolicy = () => {
  return (
    <main className="policy-page">
      <div className="policy-inner">
        <h1 className="policy-title">Shipping Policy</h1>
        <p className="policy-updated">Thank you for shopping at Manroz.com</p>

        <p className="policy-intro">
          This Shipping Policy outlines our shipping process and procedures for all orders placed on
          <strong> www.manroz.com</strong>.
        </p>

        <section className="policy-section">
          <h2>Shipping Partner</h2>
          <p>
            We use <strong>Ship Rocket</strong> as our delivery partner to ensure efficient and reliable
            shipping of your orders. Ship Rocket is a trusted logistics service provider known for its
            quality shipping services.
          </p>
        </section>

        <section className="policy-section">
          <h2>Shipping Rates</h2>
          <p>
            Shipping rates are calculated based on the weight of your order, the destination address, and
            the shipping method selected at checkout. You will be able to view the shipping charges before
            completing your purchase.
          </p>
        </section>

        <section className="policy-section">
          <h2>Delivery Time</h2>
          <p>
            Delivery times may vary depending on your location and the shipping method chosen. Once your
            order has been shipped, you will receive a tracking number via email to track the status of
            your delivery.
          </p>
        </section>

        <section className="policy-section">
          <h2>Order Processing</h2>
          <p>
            Orders are typically shipped within <strong>3 to 5 business days</strong> from the date of
            purchase. Please note that orders are not shipped or delivered on weekends or holidays.
          </p>
        </section>

        <section className="policy-section">
          <h2>Shipping Restrictions</h2>
          <p>
            We currently ship <strong>only within India</strong>. We do not ship to PO boxes or APO/FPO
            addresses.
          </p>
        </section>

        <section className="policy-section">
          <h2>Order Tracking</h2>
          <p>
            Once your order has been shipped, you will receive a shipping confirmation email with a
            tracking number. You can track the status of your delivery by entering the tracking number on
            the Ship Rocket website.
          </p>
        </section>

        <section className="policy-section">
          <h2>Lost or Damaged Shipments</h2>
          <p>
            In the rare event that your order is lost or damaged during transit, please contact us at{' '}
            <a href="mailto:info@manroz.com" className="policy-email">info@manroz.com</a>. We will work
            with Ship Rocket to resolve the issue and ensure that you receive a satisfactory resolution.
          </p>
        </section>

        <section className="policy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions or concerns about our shipping policy, please contact us at{' '}
            <a href="mailto:info@manroz.com" className="policy-email">info@manroz.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
};

export default ShippingPolicy;
