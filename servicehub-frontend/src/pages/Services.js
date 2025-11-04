import React, { useEffect, useState } from "react";
import API from "../api/axios";
import ServiceCard from "../components/ServiceCard";
import { useTheme } from "../context/ThemeContext";
import "./Services.css";

const Services = () => {
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get("/services");
        setServices(res.data || []);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`services-page ${theme}`}>
      <section className="services-hero">
        <h1>All Services</h1>
        <input
          type="text"
          className="services-search"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </section>

      <section className="services-list">
        {loading ? (
          <p className="empty-msg">Loading services...</p>
        ) : filteredServices.length > 0 ? (
          <div className="services-grid">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={{
                  ...service,
                  image: service.image ?? "/placeholder.png",
                  description:
                    service.description ?? "No description available",
                  price: service.price ?? "N/A",
                }}
              />
            ))}
          </div>
        ) : (
          <p className="empty-msg">No services found.</p>
        )}
      </section>
    </div>
  );
};

export default Services;
