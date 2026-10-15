const PrivacyPolicy = () => {
  return (
    <main className="policy-page">
      <div className="policy-inner">
        <h1 className="policy-title">Privacy Policy</h1>
        <p className="policy-updated">Last updated: October 2026</p>

        <p className="policy-intro">
          This Privacy Policy governs the manner in which Manroz collects, uses, maintains, and discloses
          information gathered from users ("Users") of the <strong>www.manroz.com</strong> website ("Site").
          This Privacy Policy applies to the Site and all products and services offered by Manroz.
        </p>

        <section className="policy-section">
          <h2>Personal Identification Information</h2>
          <p>
            Manroz may collect personal identification information from Users in various ways, such as when
            Users visit our Site, register on the Site, subscribe to our newsletter, or engage in other
            activities, services, features, or resources available on our Site. Users may be asked for
            details like their name, email address, mailing address, phone number, and payment information.
          </p>
        </section>

        <section className="policy-section">
          <h2>Anonymous Site Visits</h2>
          <p>
            Users may browse the Site anonymously. We only collect personal information when Users willingly
            provide it. However, declining to provide certain personal details may prevent Users from
            engaging in specific Site-related activities.
          </p>
        </section>

        <section className="policy-section">
          <h2>Non-Personal Identification Information</h2>
          <p>
            We may collect non-personal identification information about Users whenever they interact with
            our Site. This information may include the browser type, computer type, and technical details
            about Users' means of connection to our Site, such as the operating system and the Internet
            service provider used.
          </p>
        </section>

        <section className="policy-section">
          <h2>How We Use Collected Information</h2>
          <p>Manroz collects and uses personal information for the following purposes:</p>
          <ul className="policy-list">
            <li>
              <strong>To Improve Customer Service:</strong> Your information helps us to respond more
              efficiently to customer service requests and support needs.
            </li>
            <li>
              <strong>To Personalize User Experience:</strong> We may use information in an aggregated form
              to understand how our Users as a group utilize the services and resources on our Site.
            </li>
            <li>
              <strong>To Improve Our Site:</strong> Feedback and information we receive from Users allow us
              to enhance our website offerings.
            </li>
            <li>
              <strong>To Process Transactions:</strong> We use the information provided by Users to process
              orders and deliver services. We do not share this information with outside parties except as
              necessary to provide the service.
            </li>
            <li>
              <strong>To Send Relevant Information:</strong> We may use the email address Users provide for
              order processing to send updates about their order and respond to inquiries. If Users opt-in
              to receive marketing emails, we may send occasional updates on company news, products, or
              services of interest. Users can unsubscribe from marketing emails at any time by following the
              unsubscribe link included at the bottom of each email.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>How We Protect Your Information</h2>
          <p>
            We adopt appropriate data collection, storage, and processing practices to protect against
            unauthorized access, alteration, disclosure, or destruction of personal information, usernames,
            passwords, transaction information, and data stored on our Site. Sensitive data exchanged
            between the Site and Users occurs over an encrypted SSL-secured communication channel,
            safeguarded by digital signatures.
          </p>
        </section>

        <section className="policy-section">
          <h2>Sharing of Personal Information</h2>
          <p>
            Manroz does not sell, trade, or rent Users' personal identification information to others. We
            may share generic aggregated demographic information, which is not linked to any personal
            identification details, with our business partners, trusted affiliates, and advertisers for the
            purposes outlined above. Occasionally, we may use third-party service providers to assist in
            our operations, such as sending newsletters. We only share Users' information with third parties
            for these limited purposes, and only with their consent.
          </p>
        </section>

        <section className="policy-section">
          <h2>Updates to this Privacy Policy</h2>
          <p>
            Manroz has the right to update this Privacy Policy at any time. When we update it, we will
            revise the updated date at the bottom of this page. We encourage Users to frequently check this
            page for any changes to stay informed about how we protect the personal information we collect.
            By using this Site, Users acknowledge and accept their responsibility to review this Privacy
            Policy periodically to stay aware of any modifications.
          </p>
        </section>

        <section className="policy-section">
          <h2>Acceptance of Terms</h2>
          <p>
            By using this Site, you signify your acceptance of this Privacy Policy. If you do not agree
            with this policy, please refrain from using our Site. Continued use of the Site following any
            changes to this policy will be considered as your acceptance of those changes.
          </p>
        </section>

        <section className="policy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, our practices, or your interactions with
            this Site, please contact us at:
          </p>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:official.manroz@gmail.com" className="policy-email">
              official.manroz@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
