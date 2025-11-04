import React from "react";
import { useTheme } from "../context/ThemeContext";
import "./ServiceCard.css";

const ServiceCard = ({ service, isProvider = false }) => {
  const { theme } = useTheme();

  return (
    <div className={`service-card ${theme}`}>
      <div className="service-image">
        <img
          src={service.image?.url || "/placeholder.png"} // fallback image
          alt={service.name || service.user?.name || "Service"}
        />
      </div>
      <div className="service-info">
        <h3>{service.name || service.user?.name || "Unnamed Service"}</h3>
        {service.rating && (
          <div className="service-rating">
            <span>⭐ {service.rating.toFixed(1)}</span>
          </div>
        )}
        <p>{service.description || "No description available"}</p>
        {isProvider && <p className="provider-label">Provider</p>}
      </div>
    </div>
  );
};

export default ServiceCard;
