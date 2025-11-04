import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await API.get("/services");
        setServices(servicesRes.data || []);
        const providersRes = await API.get("/providers");
        setProviders(providersRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredServices = services.filter((service) =>
    service.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredProviders = providers.filter((provider) =>
    provider.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`home-page ${theme}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Find Trusted Services & Providers Near You</h1>
        {user ? (
          <h2>Hi {user.name}, browse top services and providers</h2>
        ) : (
          <>
            <h2>Welcome! Find services or providers near you</h2>
            <p>Create an account or login to book instantly</p>
          </>
        )}

        <input
          type="text"
          placeholder="Search services or providers..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </section>

      {/* Animated Features Section */}
      <section className="features-section">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-card animate-card">
            <h3>Easy Booking</h3>
            <p>Select services and providers and book instantly.</p>
          </div>
          <div className="feature-card animate-card">
            <h3>Trusted Providers</h3>
            <p>All providers are verified to ensure quality service.</p>
          </div>
          <div className="feature-card animate-card">
            <h3>Secure Payments</h3>
            <p>Payments are processed safely and seamlessly.</p>
          </div>
        </div>
      </section>

      {/* Top Services */}
      <section className="top-services">
        <h2>Top Services</h2>
        {loading ? (
          <p>Loading services...</p>
        ) : filteredServices.length > 0 ? (
          <div className="card-grid">
            {filteredServices.map((service) => (
              <div key={service._id} className={`service-card ${theme}`}>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <p>Price: ${service.price}</p>
                <p>Rating: {service.rating} ⭐</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-msg">No services found</p>
        )}
      </section>

      {/* Top Providers */}
      <section className="top-providers">
        <h2>Top Providers</h2>
        {loading ? (
          <p>Loading providers...</p>
        ) : filteredProviders.length > 0 ? (
          <div className="card-grid">
            {filteredProviders.map((provider) => (
              <div key={provider._id} className={`provider-card ${theme}`}>
                <h3>{provider.user.name}</h3>
                <p>{provider.serviceCount} Services</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-msg">No providers found</p>
        )}
      </section>
    </div>
  );
};

export default Home;
