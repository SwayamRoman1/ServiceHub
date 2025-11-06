import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Row = ({ b }) => {
  return (
    <tr>
      <td>{b.service?.name || "-"}</td>
      <td className="muted">
        {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : "-"}
      </td>
      <td>
        <span className={`badge ${b.status || "pending"}`}>{b.status}</span>
      </td>
    </tr>
  );
};

const MyBookings = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      // matches backend: routes/bookings.js -> GET /api/bookings
      const res = await API.get("/bookings");
      setList(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]); // eslint-disable-line

  if (!user) {
    return (
      <section className="section">
        <h1>My Bookings</h1>
        <p className="muted">Please log in to view your bookings.</p>
      </section>
    );
  }

  return (
    <section className="section">
      <h1 className="hd-1">My Bookings</h1>

      <div className="card" style={{ padding: 0, marginTop: 12 }}>
        {err && (
          <div className="alert error" style={{ margin: 12 }}>
            {err}
          </div>
        )}
        {loading ? (
          <div style={{ padding: 14 }} className="muted">
            Loading…
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: 14 }} className="muted">
            No bookings yet.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Scheduled</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <Row key={b._id} b={b} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default MyBookings;
