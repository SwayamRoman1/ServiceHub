import React, { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/UI";

const Home = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, p] = await Promise.all([
          API.get("/services"),
          API.get("/providers"),
        ]);
        setServices(s.data || []);
        setProviders(p.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredServices = useMemo(
    () =>
      services.filter((s) => s.name?.toLowerCase().includes(q.toLowerCase())),
    [services, q]
  );
  const filteredProviders = useMemo(
    () =>
      providers.filter((p) =>
        p.user?.name?.toLowerCase().includes(q.toLowerCase())
      ),
    [providers, q]
  );

  return (
    <>
      <section className="section">
        <div
          className="card"
          style={{
            padding: "22px 22px 26px",
            animation: "pop var(--normal) var(--ease)",
          }}
        >
          <h1 style={{ margin: 0 }}>Book trusted services</h1>
          <p className="muted" style={{ margin: "4px 0 12px" }}>
            {user
              ? `Welcome back, ${user.name}.`
              : "Verified providers • Clear pricing • Easy booking"}
          </p>
          <div className="nav-search" style={{ maxWidth: 620 }}>
            <input
              placeholder="Try 'Plumber', 'Cleaning', 'AC repair'…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={() =>
                (window.location.href = `/services?q=${encodeURIComponent(q)}`)
              }
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Popular services</h2>
        {loading ? (
          <div className="muted">Loading…</div>
        ) : filteredServices.length === 0 ? (
          <div className="muted">No services found</div>
        ) : (
          <div className="grid grid-4 mt-3">
            {filteredServices.slice(0, 8).map((s) => (
              <div key={s._id} className="card">
                <h3 style={{ margin: 0 }}>{s.name}</h3>
                <div className="muted">{s.category || "General"}</div>
                <div className="mt-2">{s.description || "No description."}</div>
                <div className="mt-3" style={{ fontWeight: 800 }}>
                  {s.price != null ? `₹${s.price}` : "Price on request"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Top providers</h2>
        {loading ? (
          <div className="muted">Loading…</div>
        ) : filteredProviders.length === 0 ? (
          <div className="muted">No providers found</div>
        ) : (
          <div className="grid grid-4 mt-3">
            {filteredProviders.slice(0, 8).map((p) => (
              <div key={p._id} className="card">
                <h3 style={{ margin: 0 }}>{p.user?.name}</h3>
                <div className="muted">{p.services?.length || 0} services</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
