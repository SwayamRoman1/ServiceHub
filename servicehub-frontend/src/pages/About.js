// src/pages/About.js
import React from "react";
import { useTheme } from "../context/ThemeContext";
import "./About.css";

const About = () => {
  const { theme } = useTheme();

  // Features data
  const features = [
    {
      title: "Trusted Community",
      icon: "👥",
      description:
        "Connect with verified providers and a community you can trust for all your service needs.",
    },
    {
      title: "Verified Providers",
      icon: "✅",
      description:
        "All service providers go through a verification process to ensure quality and reliability.",
    },
    {
      title: "24/7 Support",
      icon: "🛠️",
      description:
        "Our support team is available around the clock to resolve any issues or queries.",
    },
  ];

  return (
    <div className={`about-page ${theme}`}>
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About ServiceHub</h1>
        <p>
          ServiceHub connects you with verified service providers quickly and
          safely. Explore services, compare providers, and book with confidence.
        </p>
      </section>

      {/* CSS Wave Separator */}
      <div className="wave-separator"></div>

      {/* Feature Cards */}
      <section className="feature-cards">
        {features.map((feature, idx) => (
          <div key={idx} className="feature-card">
            <i>{feature.icon}</i>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Join ServiceHub Today</h2>
        <p>
          Sign up now to start exploring trusted services and verified providers
          near you.
        </p>
        <button
          onClick={() => (window.location.href = "/signup")}
          aria-label="Sign Up"
        >
          Sign Up
        </button>
      </section>
    </div>
  );
};

export default About;
