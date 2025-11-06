// src/components/StickyCTA.js
import React from "react";

export default function StickyCTA({
  primaryLabel = "Book Now",
  primaryOnClick = () => {},
  secondaryLabel = "Request Quote",
  secondaryOnClick = () => {},
  hidden = false,
}) {
  if (hidden) return null;

  return (
    <>
      <div className="sticky-cta" role="region" aria-label="Actions">
        <button className="btn-primary sticky-cta-btn" onClick={primaryOnClick}>
          {primaryLabel}
        </button>
        <button className="btn-ghost sticky-cta-btn" onClick={secondaryOnClick}>
          {secondaryLabel}
        </button>
      </div>
      <div className="sticky-cta-spacer" />
    </>
  );
}
