import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-solid">
      <div className="shell-inner footer-modern">
        {/* Top row: brand + quick links */}
        <div className="row" style={{ paddingTop: 6, paddingBottom: 6 }}>
          <div className="brand" aria-label="ServiceHub">
            <span className="brand-pill" aria-hidden>
              SH
            </span>
            ServiceHub
          </div>

          <div className="footer-links">
            <NavLink to="/services" className="foot-link">
              Services
            </NavLink>
            <NavLink to="/bookings" className="foot-link">
              Bookings
            </NavLink>
            <NavLink to="/support" className="foot-link">
              Support
            </NavLink>
            <NavLink to="/about" className="foot-link">
              About
            </NavLink>
            <NavLink to="/privacy" className="foot-link">
              Privacy
            </NavLink>
            <NavLink to="/terms" className="foot-link">
              Terms
            </NavLink>
          </div>
        </div>

        {/* Bottom row: copyright + small links */}
        <div className="row" style={{ paddingTop: 6, paddingBottom: 6 }}>
          <div className="muted">
            © {new Date().getFullYear()} ServiceHub • All rights reserved
          </div>
          <div className="footer-links">
            <NavLink to="/privacy" className="foot-link">
              Privacy
            </NavLink>
            <NavLink to="/terms" className="foot-link">
              Terms
            </NavLink>
            <NavLink to="/support" className="foot-link">
              Help
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
