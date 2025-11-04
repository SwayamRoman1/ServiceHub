import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./Footer.css";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="footer" data-theme={theme}>
      <div className="footer-container">
        <div className="footer-left">
          <Link to="/" className="footer-logo">
            ServiceHub
          </Link>
          <p className="footer-tagline">
            Connecting you with trusted service providers.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ServiceHub. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
