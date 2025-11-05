import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Button, Field, Input, Textarea, Modal } from "../components/UI";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [myServices, setMyServices] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const d = await API.get("/dashboard");
      setStats(d.data || {});
      if (user?.role === "provider") {
        const mine = await API.get("/services/mine");
        setMyServices(mine.data || []);
        const b = await API.get("/bookings/provider");
        setMyBookings(b.data || []);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) load(); /* eslint-disable */
  }, [user]);

  const saveService = async (payload) => {
    setSaving(true);
    try {
      if (payload._id) await API.put(`/services/${payload._id}`, payload);
      else await API.post("/services", payload);
      setOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const removeService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await API.delete(`/services/${id}`);
      await load();
    } catch {
      alert("Delete failed");
    }
  };

  const setStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      await load();
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <section className="section">Loading…</section>;

  return (
    <section className="section">
      <h1 className="mb-0">Dashboard</h1>

      <div className="grid grid-4 mt-3">
        <div className="card">
          <div className="muted">Users</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>
            {stats.totalUsers ?? "-"}
          </div>
        </div>
        <div className="card">
          <div className="muted">Providers</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>
            {stats.totalProviders ?? "-"}
          </div>
        </div>
        <div className="card">
          <div className="muted">Services</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>
            {stats.totalServices ?? "-"}
          </div>
        </div>
        <div className="card">
          <div className="muted">Bookings</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>
            {stats.totalBookings ?? "-"}
          </div>
        </div>
      </div>

      {user?.role === "provider" && (
        <>
          <div className="flex items-center gap-3 mt-6">
            <h2 className="mb-0">Your services</h2>
            <Button
              variant="primary"
              style={{ marginLeft: "auto" }}
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              + Add service
            </Button>
          </div>

          {myServices.length === 0 ? (
            <div className="muted mt-3">No services yet. Add one!</div>
          ) : (
            <div className="grid grid-4 mt-3">
              {myServices.map((s) => (
                <div className="card" key={s._id}>
                  <h3 style={{ margin: 0 }}>{s.name}</h3>
                  <div className="muted">
                    {s.category || "General"} • ₹{s.price ?? 0}
                  </div>
                  <div className="mt-2">
                    {s.description || "No description."}
                  </div>
                  <div className="flex gap-3 mt-3">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditing(s);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => removeService(s._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="mt-6">Bookings for your services</h2>
          {myBookings.length === 0 ? (
            <div className="muted">No bookings yet.</div>
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Scheduled</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.user?.name}</td>
                      <td>{b.service?.name}</td>
                      <td>
                        <span className={`badge ${b.status}`}>{b.status}</span>
                      </td>
                      <td>
                        {b.scheduledAt
                          ? new Date(b.scheduledAt).toLocaleString()
                          : "-"}
                      </td>
                      <td style={{ display: "flex", gap: 8 }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setStatus(b._id, "accepted")}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setStatus(b._id, "completed")}
                        >
                          Complete
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setStatus(b._id, "cancelled")}
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ServiceModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={saveService}
        initial={editing}
        saving={saving}
      />
    </section>
  );
};

const ServiceModal = ({ open, onClose, onSave, initial, saving }) => {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [category, setCategory] = useState(initial?.category || "");

  useEffect(() => {
    if (!open) return;
    setName(initial?.name || "");
    setDescription(initial?.description || "");
    setPrice(initial?.price ?? "");
    setCategory(initial?.category || "");
  }, [open, initial]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit service" : "Add a new service"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={saving}
            onClick={() =>
              onSave({
                _id: initial?._id,
                name,
                description,
                price: Number(price || 0),
                category,
              })
            }
          >
            {initial ? "Update" : "Create"}
          </Button>
        </>
      }
    >
      <div className="form">
        <Field label="Service name">
          <Input
            placeholder="e.g., Deep Cleaning"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>
        <Field label="Description">
          <Textarea
            placeholder="What’s included, duration, etc."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <div className="field-row">
          <Field label="Price (₹)">
            <Input
              type="number"
              placeholder="999"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Field>
          <Field label="Category">
            <Input
              placeholder="Home, Repair, Beauty…"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Field>
        </div>
      </div>
    </Modal>
  );
};

export default Dashboard;
