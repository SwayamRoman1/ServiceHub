import React from "react";

const Privacy = () => {
  return (
    <section className="section">
      <div className="policy-container card">
        <h1>Privacy Policy</h1>
        <p className="muted" style={{ marginTop: -6 }}>
          Your privacy matters. This policy explains what we collect and how we
          use it.
        </p>

        <div className="policy-toc">
          <a href="#data-we-collect">1. Data we collect</a>
          <a href="#how-we-use">2. How we use data</a>
          <a href="#sharing">3. Sharing</a>
          <a href="#security">4. Security</a>
          <a href="#choices">5. Your choices</a>
          <a href="#contact">6. Contact</a>
        </div>

        <div className="policy-block" id="data-we-collect">
          <h2>1. Data we collect</h2>
          <ul>
            <li>Account details: name, email, role, and profile info.</li>
            <li>Usage data: pages visited, actions, device info.</li>
            <li>Booking and provider interactions you initiate.</li>
          </ul>
        </div>

        <div className="policy-block" id="how-we-use">
          <h2>2. How we use data</h2>
          <ul>
            <li>Operate and improve ServiceHub functionality.</li>
            <li>Facilitate bookings, messaging, and support.</li>
            <li>Prevent abuse and ensure platform security.</li>
          </ul>
        </div>

        <div className="policy-block" id="sharing">
          <h2>3. Sharing</h2>
          <p>
            We share data with providers when you book or message them. We may
            use trusted processors for analytics or infrastructure—never selling
            your data.
          </p>
        </div>

        <div className="policy-block" id="security">
          <h2>4. Security</h2>
          <p>
            We use modern security practices. No method is perfect; report
            concerns to support.
          </p>
        </div>

        <div className="policy-block" id="choices">
          <h2>5. Your choices</h2>
          <ul>
            <li>
              Update or delete your account data in your profile or via support.
            </li>
            <li>Control marketing preferences from emails or settings.</li>
          </ul>
        </div>

        <div className="policy-block" id="contact">
          <h2>6. Contact</h2>
          <p>
            Questions? Email{" "}
            <a className="link-soft" href="mailto:support@servicehub.local">
              support@servicehub.local
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
