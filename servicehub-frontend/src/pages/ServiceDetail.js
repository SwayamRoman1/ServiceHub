// src/pages/ServiceDetail.js
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const nicePrice = (svc) => {
  if (typeof svc.price === "number") return `₹${svc.price}`;
  if (typeof svc.priceMin === "number" && typeof svc.priceMax === "number") {
    return `₹${svc.priceMin} – ₹${svc.priceMax}`;
  }
  if (typeof svc.priceMin === "number") return `From ₹${svc.priceMin}`;
  return "Ask for quote";
};

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingBusy, setBookingBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let on = true;
    const load = async () => {
      try {
        const res = await API.get(`/services/${id}`);
        if (!on) return;
        setService(res.data);
      } catch (e) {
        console.error("Error fetching service", e);
        setError("Unable to load this service right now.");
      } finally {
        if (on) setLoading(false);
      }
    };
    load();
    return () => {
      on = false;
    };
  }, [id]);

  const priceText = useMemo(
    () => (service ? nicePrice(service) : ""),
    [service]
  );

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "user") {
      alert("Please login as a customer to book.");
      return;
    }
    try {
      setBookingBusy(true);
      const res = await API.post("/dashboard/book-service", {
        serviceId: service._id,
        // optionally scheduledAt: new Date()
      });
      alert("Booked! Check your bookings page.");
      navigate("/bookings");
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to book this service.");
    } finally {
      setBookingBusy(false);
    }
  };

  if (loading) return <div className="section shell-inner">Loading…</div>;
  if (error) return <div className="section shell-inner">{error}</div>;
  if (!service) return null;

  return (
    <div className="section shell-inner">
      <div className="card svc-detail-card">
        <div className="svc-meta-row">
          <span className="eyebrow">{service.category || "Service"}</span>
          {service.availableToday && (
            <span className="badge-soft">Available Today</span>
          )}
        </div>

        <div className="svc-hero">
          <img
            src={service.image?.url || "https://picsum.photos/1200/600"}
            alt={service.name}
          />
        </div>

        <h1 className="hd-1">{service.name}</h1>
        <div className="lead">{service.location || "Location on request"}</div>

        <div className="rule" />

        <div className="svc-block rhythmic">
          <h2 className="hd-2">Overview</h2>
          <p className="body-text">
            {service.description || "No description provided."}
          </p>
        </div>

        <div className="svc-block">
          <h2 className="hd-2">Details</h2>
          <ul className="svc-ul">
            <li>Rating: {Number(service.rating || 0).toFixed(1)} ⭐</li>
            <li>Price: {priceText}</li>
            <li>Category: {service.category || "—"}</li>
          </ul>
        </div>

        <div className="svc-cta-desktop">
          <button
            className="btn-primary btn-elevated"
            onClick={handleBook}
            disabled={bookingBusy}
          >
            {bookingBusy ? "Booking…" : "Book Now"}
          </button>
          <button className="btn-outline" onClick={() => window.history.back()}>
            Back
          </button>
        </div>
      </div>

      {/* spacer so sticky bar doesn’t overlap content on mobile */}
      <div className="sticky-cta-spacer" />
      <div className="sticky-cta">
        <button
          className="btn-ghost sticky-cta-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {priceText || "Details"}
        </button>
        <button
          className="btn-primary sticky-cta-btn btn-elevated"
          onClick={handleBook}
          disabled={bookingBusy}
        >
          {bookingBusy ? "Booking…" : "Book Now"}
        </button>
      </div>
    </div>
  );
};

export default ServiceDetail;
