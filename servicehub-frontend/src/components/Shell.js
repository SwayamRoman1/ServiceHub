// src/components/Shell.js
import React, { useEffect } from "react";

const ScrollToTop = () => {
  useEffect(() => {
    const onHash = () => window.scrollTo({ top: 0, behavior: "instant" });
    onHash();
    return () => {};
  }, []);
  return null;
};

const Shell = ({ header, footer, children }) => {
  return (
    <div className="app-shell">
      {/* Sticky glass header */}
      <header className="header-glass">
        <div className="shell-inner">{header}</div>
      </header>

      {/* Main content area, centered with max-width */}
      <main className="shell-inner" role="main">
        <ScrollToTop />
        {children}
      </main>

      {/* Solid footer */}
      <footer className="footer-solid">
        <div className="shell-inner">{footer}</div>
      </footer>
    </div>
  );
};

export default Shell;
