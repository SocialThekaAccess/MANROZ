const ReturnPolicy = () => {
  return (
    <main className="policy-page">
      <div className="policy-inner">
        <h1 className="policy-title">Return & Refund Policy</h1>
        <p className="policy-updated">Last updated: October 2026</p>

        <section className="policy-section">
          <h2>Overview</h2>
          <p>
            Our refund and returns policy lasts <strong>7 days</strong>. If 7 days have passed since your
            purchase, we can't offer you a full refund or exchange.
          </p>
          <p>
            To be eligible for a return, your item must be unused and in the same condition that you
            received it. It must also be in the original packaging.
          </p>
          <p>
            Several types of goods are exempt from being returned. Perishable goods such as food, flowers,
            newspapers or magazines cannot be returned. We also do not accept products that are intimate or
            sanitary goods, hazardous materials, or flammable liquids or gases.
          </p>
        </section>

        <section className="policy-section">
          <h2>Additional Non-Returnable Items</h2>
          <ul className="policy-list">
            <li>Gift cards</li>
            <li>Downloadable software products</li>
            <li>Some health and personal care items</li>
          </ul>
          <p style={{marginTop: '12px'}}>
            To complete your return, we require a receipt or proof of purchase. Please do not send your
            purchase back to the manufacturer.
          </p>
        </section>

        <section className="policy-section">
          <h2>Partial Refunds</h2>
          <p>There are certain situations where only partial refunds are granted:</p>
          <ul className="policy-list">
            <li>Book with obvious signs of use</li>
            <li>CD, DVD, VHS tape, software, video game, cassette tape, or vinyl record that has been opened</li>
            <li>Any item not in its original condition, is damaged or missing parts for reasons not due to our error</li>
            <li>Any item that is returned more than 7 days after delivery</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Refunds</h2>
          <p>
            Once your return is received and inspected, we will send you an email to notify you that we
            have received your returned item. We will also notify you of the approval or rejection of your
            refund.
          </p>
          <p>
            If you are approved, then your refund will be processed, and a credit will automatically be
            applied to your credit card or original method of payment, within <strong>7 days</strong>.
          </p>
        </section>

        <section className="policy-section">
          <h2>Late or Missing Refunds</h2>
          <p>If you haven't received a refund yet, please follow these steps:</p>
          <ul className="policy-list">
            <li>First check your bank account again</li>
            <li>Then contact your credit card company — it may take some time before your refund is officially posted</li>
            <li>Next, contact your bank — there is often some processing time before a refund is posted</li>
            <li>If you've done all of this and still have not received your refund, please contact us at <a href="mailto:info@manroz.com" className="policy-email">info@manroz.com</a></li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Sale Items</h2>
          <p>
            Only regular-priced items may be refunded. <strong>Sale items cannot be refunded.</strong>
          </p>
        </section>

        <section className="policy-section">
          <h2>Exchanges</h2>
          <p>
            We only replace items if they are defective or damaged. If you need to exchange it for the
            same item, send us an email at{' '}
            <a href="mailto:info@manroz.com" className="policy-email">info@manroz.com</a> and send your
            item to <strong>Patiala, India</strong>.
          </p>
        </section>

        <section className="policy-section">
          <h2>Gifts</h2>
          <p>
            If the item was marked as a gift when purchased and shipped directly to you, you'll receive a
            gift credit for the value of your return. Once the returned item is received, a gift
            certificate will be mailed to you.
          </p>
          <p>
            If the item wasn't marked as a gift when purchased, or the gift giver had the order shipped to
            themselves to give to you later, we will send a refund to the gift giver and they will find
            out about your return.
          </p>
        </section>

        <section className="policy-section">
          <h2>Shipping Returns</h2>
          <p>
            To return your product, you should mail your product to <strong>Patiala, India</strong>.
          </p>
          <p>
            You will be responsible for paying for your own shipping costs for returning your item.
            Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will
            be deducted from your refund.
          </p>
          <p>
            Depending on where you live, the time it may take for your exchanged product to reach you may
            vary. If you are returning more expensive items, you may consider using a trackable shipping
            service or purchasing shipping insurance. We don't guarantee that we will receive your returned
            item.
          </p>
        </section>

        <section className="policy-section">
          <h2>Need Help?</h2>
          <p>
            Contact us at{' '}
            <a href="mailto:info@manroz.com" className="policy-email">info@manroz.com</a> for questions
            related to refunds and returns.
          </p>
        </section>
      </div>
    </main>
  );
};

export default ReturnPolicy;
