// src/components/ServiceCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

const numberOrDash = (n) =>
  typeof n === "number" ? n.toFixed(1) : n ? String(n) : "—";

const money = (n) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      })
    : n || "—";

export default function ServiceCard({ service }) {
  const navigate = useNavigate();

  const rating = numberOrDash(service?.rating);
  const priceRange =
    service?.priceMin || service?.priceMax
      ? `${money(service.priceMin || "—")} – ${money(service.priceMax || "—")}`
      : service?.price
      ? money(service.price)
      : "Price on request";
  const location =
    service?.location ||
    service?.city ||
    service?.user?.city ||
    service?.provider?.user?.city ||
    "—";

  const initial = service?.user?.name?.[0] || service?.name?.[0] || "S";

  return (
    <article
      className="svc-card card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/services/${service._id}`)}
      onKeyDown={(e) =>
        e.key === "Enter" && navigate(`/services/${service._id}`)
      }
      aria-label={`${service?.name || "Service"} - Tap to view details`}
    >
      <div className="svc-thumb">
        <img
          src={service?.image?.url || "/placeholder.png"}
          alt={service?.name || "Service cover"}
          loading="lazy"
        />
        <div className="svc-avatar" aria-hidden="true">
          {initial}
        </div>
      </div>

      <div className="svc-body">
        <h3 className="svc-title">{service?.name || "Unnamed Service"}</h3>
        <p className="svc-desc">
          {service?.description || "No description available."}
        </p>

        {/* Standardized info row */}
        <div className="svc-info-row" aria-label="Key information">
          <span>⭐ {rating}</span>
          <span>₹ {priceRange}</span>
          <span>📍 {location}</span>
        </div>
      </div>
    </article>
  );
}
