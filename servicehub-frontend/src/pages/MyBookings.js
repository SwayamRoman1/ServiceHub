import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/UI";

const MyBookings = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings/me");
      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) load();
  }, [user]);

  const cancel = async (id) => {
    if (!window.confirm("Cancel booking?")) return;
    try {
      await API.put(`/bookings/${id}/status`, { status: "cancelled" });
      load();
    } catch {
      alert("Failed to cancel");
    }
  };

  if (!user) return <section className="section">Please login.</section>;

  return (
    <section className="section">
      <h1>My bookings</h1>
      {loading ? (
        <div className="muted">Loading…</div>
      ) : items.length === 0 ? (
        <div className="muted">No bookings yet.</div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b._id}>
                  <td>{b.service?.name}</td>
                  <td>
                    <span className={`badge ${b.status}`}>{b.status}</span>
                  </td>
                  <td>{new Date(b.createdAt).toLocaleString()}</td>
                  <td style={{ textAlign: "right" }}>
                    {b.status === "pending" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => cancel(b._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MyBookings;
