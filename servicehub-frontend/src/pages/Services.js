import React, { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/UI";

const Services = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [q, setQ] = useState(
    new URLSearchParams(window.location.search).get("q") || ""
  );
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/services");
        setServices(res.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      services.filter((s) => s.name?.toLowerCase().includes(q.toLowerCase())),
    [services, q]
  );

  const book = async (serviceId) => {
    if (!user) return alert("Please login to book.");
    if (user.role !== "user") return alert("Only user accounts can book.");
    try {
      setBusyId(serviceId);
      await API.post("/bookings", {
        serviceId,
        scheduledAt: scheduledAt || undefined,
      });
      alert("Booked successfully!");
      setScheduledAt("");
    } catch (e) {
      alert(e?.response?.data?.message || "Booking failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="section">
      <div className="flex items-center gap-3">
        <h1 className="mb-0">Explore services</h1>
        <div
          style={{ marginLeft: "auto", width: 360, maxWidth: "100%" }}
          className="nav-search"
        >
          <input
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn-ghost" onClick={() => setQ("")}>
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <div className="muted mt-3">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="muted mt-3">No services found.</div>
      ) : (
        <div className="grid grid-4 mt-3">
          {filtered.map((s) => (
            <div key={s._id} className="card">
              <h3 style={{ margin: 0 }}>{s.name}</h3>
              <div className="muted">{s.category || "General"}</div>
              <div className="mt-2">{s.description || "No description."}</div>
              <div className="mt-3" style={{ fontWeight: 800 }}>
                {s.price != null ? `₹${s.price}` : "Price on request"}
              </div>

              {user?.role === "user" && (
                <div className="mt-3">
                  <label className="muted" style={{ fontSize: 12 }}>
                    Schedule (optional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="mt-2"
                  />
                  <div className="flex gap-3 mt-3">
                    <Button
                      variant="primary"
                      onClick={() => book(s._id)}
                      loading={busyId === s._id}
                    >
                      {busyId === s._id ? "Booking…" : "Book"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        (window.location.href = `/chat/${s.provider?.user}`)
                      }
                    >
                      Ask provider
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Services;
