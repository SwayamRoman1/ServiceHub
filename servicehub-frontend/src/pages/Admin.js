import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "./Dashboard.css";

const Admin = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [grievances, setGrievances] = useState([]);

  const load = async () => {
    const s = await API.get("/admin/stats");
    setStats(s.data);
    const u = await API.get("/admin/users");
    setUsers(u.data);
    const sv = await API.get("/admin/services");
    setServices(sv.data);
    const p = await API.get("/admin/providers");
    setProviders(p.data);
    const b = await API.get("/admin/bookings");
    setBookings(b.data);
    const g = await API.get("/admin/grievances");
    setGrievances(g.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="dashboard">
      <h1>Admin</h1>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers ?? "-"}</p>
        </div>
        <div className="summary-card">
          <h3>Total Providers</h3>
          <p>{stats.totalProviders ?? "-"}</p>
        </div>
        <div className="summary-card">
          <h3>Total Services</h3>
          <p>{stats.totalServices ?? "-"}</p>
        </div>
        <div className="summary-card">
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings ?? "-"}</p>
        </div>
      </div>

      <h2>Users</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Providers</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Services</th>
            <th>Experience</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr key={p._id}>
              <td>{p.user?.name}</td>
              <td>{p.services?.length || 0}</td>
              <td>{p.experience}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Services</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Price</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.provider}</td>
              <td>{s.price}</td>
              <td>{s.category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Bookings</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Service</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.user?.name}</td>
              <td>{b.service?.name}</td>
              <td>
                <span className={`status-badge status-${b.status}`}>
                  {b.status}
                </span>
              </td>
              <td>{new Date(b.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Grievances</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {grievances.map((g) => (
            <tr key={g._id}>
              <td>{g.user?.name}</td>
              <td>{g.title}</td>
              <td>{g.status}</td>
              <td>{new Date(g.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
