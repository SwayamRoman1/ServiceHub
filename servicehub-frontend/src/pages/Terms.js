import React from "react";

const Terms = () => {
  return (
    <section className="section">
      <div className="policy-container card">
        <h1>Terms of Service</h1>
        <p className="muted" style={{ marginTop: -6 }}>
          By using ServiceHub you agree to these terms.
        </p>

        <div className="policy-toc">
          <a href="#eligibility">1. Eligibility</a>
          <a href="#use">2. Acceptable use</a>
          <a href="#bookings">3. Bookings & payments</a>
          <a href="#providers">4. Providers</a>
          <a href="#liability">5. Liability</a>
          <a href="#changes">6. Changes</a>
        </div>

        <div className="policy-block" id="eligibility">
          <h2>1. Eligibility</h2>
          <p>
            You must be legally able to enter into agreements in your
            jurisdiction.
          </p>
        </div>

        <div className="policy-block" id="use">
          <h2>2. Acceptable use</h2>
          <ul>
            <li>No illegal, fraudulent, or abusive activity.</li>
            <li>Do not attempt to disrupt or reverse-engineer the service.</li>
          </ul>
        </div>

        <div className="policy-block" id="bookings">
          <h2>3. Bookings & payments</h2>
          <p>
            Bookings connect customers and providers; payment terms may be
            handled by a third party.
          </p>
        </div>

        <div className="policy-block" id="providers">
          <h2>4. Providers</h2>
          <p>
            Providers must offer accurate listings and fulfill booked services
            in good faith.
          </p>
        </div>

        <div className="policy-block" id="liability">
          <h2>5. Liability</h2>
          <p>
            ServiceHub is not liable for provider performance. Some
            jurisdictions limit these disclaimers.
          </p>
        </div>

        <div className="policy-block" id="changes">
          <h2>6. Changes</h2>
          <p>
            We may update these terms; continued use means acceptance of the
            updated terms.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Terms;
