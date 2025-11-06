// src/pages/Services.js
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const priceLabel = (s) => {
  if (typeof s.price === "number") return `₹${s.price}`;
  if (typeof s.priceMin === "number" && typeof s.priceMax === "number")
    return `₹${s.priceMin}–₹${s.priceMax}`;
  if (typeof s.priceMin === "number") return `From ₹${s.priceMin}`;
  return "Ask price";
};

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [onlyToday, setOnlyToday] = useState(false);

  useEffect(() => {
    let on = true;
    const load = async () => {
      try {
        const res = await API.get("/services");
        if (on) setServices(res.data || []);
      } catch (e) {
        console.error("Failed to fetch services:", e);
      } finally {
        if (on) setLoading(false);
      }
    };
    load();
    return () => {
      on = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchQ = q
        ? s.name?.toLowerCase().includes(q.toLowerCase()) ||
          s.location?.toLowerCase().includes(q.toLowerCase())
        : true;
      const matchToday = onlyToday ? !!s.availableToday : true;
      return matchQ && matchToday;
    });
  }, [services, q, onlyToday]);

  if (loading)
    return <div className="section shell-inner">Loading services…</div>;

  return (
    <div className="services-page">
      <div className="shell-inner">
        <section className="services-hero">
          <h1>All Services</h1>
          <div className="srch-row" style={{ gap: 10 }}>
            <input
              className="input input-lg"
              placeholder="Search services or location…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="chip-row">
            <button
              className={`chip ${onlyToday ? "chip-on" : ""}`}
              onClick={() => setOnlyToday((v) => !v)}
            >
              <span className="chip-icon">🕒</span> Available Today
            </button>
          </div>
        </section>

        <section className="services-list">
          {filtered.length ? (
            <div className="services-grid">
              {filtered.map((s) => (
                <div
                  key={s._id}
                  className="card svc-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/service/${s._id}`)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate(`/service/${s._id}`)
                  }
                >
                  <div className="svc-thumb">
                    <img
                      src={s.image?.url || "https://picsum.photos/400/260"}
                      alt={s.name}
                    />
                  </div>
                  <div className="svc-body">
                    <h3 className="svc-title">{s.name}</h3>
                    <p className="svc-desc muted">
                      {s.description || "No description"}
                    </p>
                    <div className="svc-info-row">
                      <span className="badge-soft svc-rating">
                        ⭐ {Number(s.rating || 0).toFixed(1)}
                      </span>
                      <span className="badge-soft svc-price">
                        {priceLabel(s)}
                      </span>
                      <span className="badge-soft svc-location">
                        📍 {s.location || "—"}
                      </span>
                    </div>
                    {s.availableToday && (
                      <span className="svc-tag">Available Today</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted" style={{ textAlign: "center", marginTop: 14 }}>
              No services found.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Services;
