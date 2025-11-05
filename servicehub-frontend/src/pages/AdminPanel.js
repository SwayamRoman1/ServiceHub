import React, { useEffect, useState } from "react";
import API from "../api/axios";

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [grievances, setGrievances] = useState([]);

  const load = async () => {
    try {
      const [s, g] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/grievances"),
      ]);
      setStats(s.data);
      setGrievances(g.data || []);
    } catch (e) {
      alert("Admin endpoints not reachable");
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resolve = async (id) => {
    try {
      await API.put(`/grievances/${id}`, { status: "resolved" });
      load();
    } catch {
      alert("Failed to update");
    }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await API.delete(`/grievances/${id}`);
      load();
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <section className="section">
      <h1>Admin</h1>

      {!stats ? (
        <div className="muted">Loading…</div>
      ) : (
        <div className="grid grid-4">
          <div className="card">
            <div className="muted">Users</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>{stats.users}</div>
          </div>
          <div className="card">
            <div className="muted">Providers</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>
              {stats.providers}
            </div>
          </div>
          <div className="card">
            <div className="muted">Services</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>
              {stats.services}
            </div>
          </div>
          <div className="card">
            <div className="muted">Bookings</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>
              {stats.bookings}
            </div>
          </div>
        </div>
      )}

      <h2 style={{ marginTop: 24 }}>Support tickets</h2>
      {grievances.length === 0 ? (
        <div className="muted">No tickets.</div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Title</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {grievances.map((g) => (
                <tr key={g._id}>
                  <td>{g.user?.name || g.user}</td>
                  <td>{g.title}</td>
                  <td>{g.status}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    {g.status !== "resolved" && (
                      <button
                        className="btn-primary"
                        onClick={() => resolve(g._id)}
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      className="btn-danger"
                      onClick={() => remove(g._id)}
                    >
                      Delete
                    </button>
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

export default AdminPanel;
