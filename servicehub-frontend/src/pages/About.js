import React from "react";
import { Button } from "../components/UI";

const About = () => {
  return (
    <>
      {/* Hero (glass over gradient) */}
      <section className="section">
        <div className="about-hero">
          <div className="about-hero-gradient" />
          <div className="about-hero-card card">
            <h1>About ServiceHub</h1>
            <p className="muted">
              We connect people with trusted providers—quickly, safely, and with
              transparent pricing. Book services with confidence and support
              skilled professionals near you.
            </p>
            <div className="about-hero-cta">
              <Button
                variant="primary"
                onClick={() => (window.location.href = "/services")}
              >
                Explore services
              </Button>
              <Button
                variant="ghost"
                onClick={() => (window.location.href = "/signup")}
              >
                Become a provider
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <h2>What makes us different</h2>
        <div className="grid grid-3 mt-3">
          <div className="about-feature card">
            <div className="about-icon">✅</div>
            <h3>Verified providers</h3>
            <p className="muted">
              Every provider is identity-checked and reviewed, so you can book
              with peace of mind.
            </p>
          </div>
          <div className="about-feature card">
            <div className="about-icon">🧭</div>
            <h3>Transparent pricing</h3>
            <p className="muted">
              Clear prices and inclusions before you book—no surprises after the
              job.
            </p>
          </div>
          <div className="about-feature card">
            <div className="about-icon">💬</div>
            <h3>Direct chat</h3>
            <p className="muted">
              Message providers to align on details, timing, and custom
              requests.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <h2>Our values</h2>
        <div className="grid grid-2 mt-3">
          <div className="about-value card">
            <h3>Trust first</h3>
            <p className="muted">
              Trust is the foundation of every booking, from discovery to
              completion.
            </p>
          </div>
          <div className="about-value card">
            <h3>Design with empathy</h3>
            <p className="muted">
              We craft simple, accessible experiences—fast, clear, and
              delightful.
            </p>
          </div>
          <div className="about-value card">
            <h3>Fair growth</h3>
            <p className="muted">
              We help providers grow their business sustainably with the tools
              they need.
            </p>
          </div>
          <div className="about-value card">
            <h3>Relentless reliability</h3>
            <p className="muted">
              Performance, stability, and support are non-negotiable for us.
            </p>
          </div>
        </div>
      </section>

      {/* CTA stripe */}
      <section className="section">
        <div className="about-cta card">
          <div>
            <h2 style={{ margin: "0 0 6px" }}>Ready to get started?</h2>
            <div className="muted">
              Create an account in minutes and book your first service today.
            </div>
          </div>
          <div className="about-cta-actions">
            <Button
              variant="secondary"
              onClick={() => (window.location.href = "/signup")}
            >
              Create account
            </Button>
            <Button
              variant="ghost"
              onClick={() => (window.location.href = "/privacy")}
            >
              Read our privacy policy
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
