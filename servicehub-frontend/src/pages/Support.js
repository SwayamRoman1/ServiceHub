import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Support = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      // list current user's tickets
      const res = await API.get("/grievances/mine");
      setMine(res.data || []);
    } catch (e) {
      setErr(
        e?.response?.data?.message || "Failed to load your support tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    try {
      await API.post("/grievances", { title, description });
      setTitle("");
      setDescription("");
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <section className="section">
        <h1>Support</h1>
        <p className="muted">Please log in to contact support.</p>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="shell-inner">
        <h1 className="hd-1">Support</h1>
        <p className="muted" style={{ marginTop: 4 }}>
          Raise a ticket and our team will get back ASAP.
        </p>

        {/* Form */}
        <div className="card" style={{ marginTop: 14 }}>
          <form onSubmit={submit} className="form-grid">
            {err && <div className="alert error">{err}</div>}
            <div className="form-row">
              <label>Subject</label>
              <input
                className="input input-lg"
                placeholder="Short summary (e.g., Payment issue for booking)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <label>Description</label>
              <textarea
                className="input"
                rows={5}
                placeholder="Describe your issue in detail…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div
              className="form-actions"
              style={{ justifyContent: "flex-end" }}
            >
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                className="btn-primary btn-elevated"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send to Support"}
              </button>
            </div>
          </form>
        </div>

        {/* My tickets */}
        <h2 className="hd-2" style={{ marginTop: 18 }}>
          Your tickets
        </h2>
        {loading ? (
          <div className="muted">Loading…</div>
        ) : mine.length === 0 ? (
          <div className="muted">No tickets yet.</div>
        ) : (
          <div className="grid grid-2" style={{ marginTop: 12 }}>
            {mine.map((g) => (
              <div key={g._id} className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <h3 className="svc-title" style={{ margin: 0 }}>
                    {g.title}
                  </h3>
                  <span
                    className="badge"
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: 999,
                      padding: "4px 10px",
                      fontSize: 12,
                    }}
                  >
                    {g.status}
                  </span>
                </div>
                <p className="body-text" style={{ marginTop: 6 }}>
                  {g.description}
                </p>
                <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>
                  {new Date(g.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Support;
