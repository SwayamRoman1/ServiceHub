// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <div className="footer-modern">
    <div className="shell-inner">
      <div
        className="row"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: 10,
            alignItems: "center",
            fontWeight: 900,
          }}
        >
          <span className="brand-pill">S</span> ServiceHub
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/about" className="foot-link">
            About
          </Link>
          <Link to="/privacy" className="foot-link">
            Privacy
          </Link>
          <Link to="/terms" className="foot-link">
            Terms
          </Link>
          <a className="foot-link" href="mailto:support@servicehub.local">
            Support
          </a>
        </nav>
      </div>
      <div
        className="row"
        style={{
          color: "var(--ink-2)",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>© {new Date().getFullYear()} ServiceHub</div>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            className="icon-btn"
            style={{ width: 34, height: 34 }}
            href="#"
            aria-label="X / Twitter"
          >
            𝕏
          </a>
          <a
            className="icon-btn"
            style={{ width: 34, height: 34 }}
            href="#"
            aria-label="Instagram"
          >
            ⓘ
          </a>
          <a
            className="icon-btn"
            style={{ width: 34, height: 34 }}
            href="#"
            aria-label="LinkedIn"
          >
            in
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
