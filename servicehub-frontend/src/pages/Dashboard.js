import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

// ──────────────────────────────
// Service Modal
// ──────────────────────────────
const ServiceModal = ({ show, onClose, onSubmit, service }) => {
  const { theme } = useTheme();
  const [name, setName] = useState(service?.name || "");
  const [description, setDescription] = useState(service?.description || "");
  const [price, setPrice] = useState(service?.price || "");
  const [category, setCategory] = useState(service?.category || "");

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setPrice(service.price);
      setCategory(service.category || "");
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
    }
  }, [service]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      _id: service?._id,
      name,
      description,
      price: Number(price),
      category,
    });
  };

  return (
    <div className="modal-overlay">
      <div className={`modal ${theme}`}>
        <h2>{service ? "Edit Service" : "Add Service"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Service Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <div className="modal-buttons">
            <button type="submit" className="btn-primary">
              {service ? "Update" : "Add"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ──────────────────────────────
// Service Card
// ──────────────────────────────
const ServiceCard = ({ service, onEdit, onDelete, onBook }) => {
  const { theme } = useTheme();
  return (
    <div className={`service-card ${theme}`}>
      <h3>{service?.name}</h3>
      <p>{service?.description}</p>
      <p>Price: ${service?.price}</p>
      <p>Category: {service?.category}</p>

      {onEdit && onDelete && (
        <div className="card-actions">
          <button className="btn-primary" onClick={() => onEdit(service)}>
            Edit
          </button>
          <button className="btn-danger" onClick={() => onDelete(service._id)}>
            Delete
          </button>
        </div>
      )}

      {onBook && (
        <button className="btn-primary" onClick={() => onBook(service._id)}>
          Book Service
        </button>
      )}
    </div>
  );
};

// ──────────────────────────────
// Dashboard Component
// ──────────────────────────────
const Dashboard = () => {
  const { theme } = useTheme();
  const { user, loading } = useAuth();

  const [data, setData] = useState({});
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [fetching, setFetching] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setFetching(true);
      try {
        const res = await API.get("/dashboard");
        setData(res.data || {});
        if (res.data.myServices) setServices(res.data.myServices);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [user]);

  // Add or Update Service
  const handleServiceSubmit = async (serviceData) => {
    try {
      if (serviceData._id) {
        await API.put(`/services/${serviceData._id}`, serviceData);
      } else {
        await API.post("/services", serviceData);
      }
      setModalOpen(false);
      setCurrentService(null);
      const res = await API.get("/dashboard");
      setServices(res.data.myServices || []);
    } catch (err) {
      console.error("Error saving service:", err);
    }
  };

  // Delete Service
  const handleDelete = async (id) => {
    try {
      await API.delete(`/services/${id}`);
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  if (loading || fetching) return <div>Loading dashboard...</div>;

  return (
    <div className={`dashboard ${theme}`}>
      <h1>Welcome, {user?.name || "User"}!</h1>

      {user?.role === "provider" && (
        <>
          <button
            className="btn-primary"
            onClick={() => {
              setCurrentService(null);
              setModalOpen(true);
            }}
          >
            Add New Service
          </button>

          <div className="services-container">
            {services.length === 0 ? (
              <p>No services yet. Add one!</p>
            ) : (
              services.map((srv) => (
                <ServiceCard
                  key={srv._id}
                  service={srv}
                  onEdit={(service) => {
                    setCurrentService(service);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </>
      )}

      {user?.role === "customer" && (
        <div className="available-services">
          <h2>Available Services</h2>
          {data.availableServices?.length ? (
            data.availableServices.map((srv) => (
              <ServiceCard
                key={srv._id}
                service={srv}
                onBook={(id) => alert(`Booked service ${id}`)}
              />
            ))
          ) : (
            <p>No services available right now.</p>
          )}
        </div>
      )}

      <ServiceModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleServiceSubmit}
        service={currentService}
      />
    </div>
  );
};

export default Dashboard;
