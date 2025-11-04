import React from "react";
import "./ProviderCard.css";

const ProviderCard = ({ provider }) => {
  return (
    <div className="provider-card">
      <img
        src={provider.user?.image || "/default-avatar.png"}
        alt={provider.user?.name || "Provider"}
        className="provider-image"
      />
      <div className="card-content">
        <h3>{provider.user?.name || "Unknown Provider"}</h3>
        <p>{provider.services?.length || 0} services</p>
        <div className="rating">
          ★★★★☆ {/* Replace with dynamic rating if available */}
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
