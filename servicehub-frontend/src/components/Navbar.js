import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const IconMoon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
      fill="currentColor"
    />
  </svg>
);
const IconSun = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="1.5" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="22.5" y2="12" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
    </g>
  </svg>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doSearch = () => {
    const q = document.getElementById("global-search")?.value || "";
    navigate(`/services?q=${encodeURIComponent(q)}`);
  };

  return (
    <nav className="navbar" aria-label="Primary">
      <Link to="/" className="brand" aria-label="ServiceHub Home">
        <span className="brand-pill">S</span> ServiceHub
      </Link>

      <div className="nav-search" role="search" aria-label="Global search">
        <span aria-hidden="true">🔎</span>
        <input
          id="global-search"
          placeholder="Search services or providers"
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
        />
        <button className="btn-primary btn-sm" onClick={doSearch}>
          Search
        </button>
      </div>

      <div className="nav-actions">
        <NavLink to="/services" className="nav-link">
          Explore
        </NavLink>
        <NavLink to="/about" className="nav-link">
          About
        </NavLink>
        <NavLink to="/privacy" className="nav-link">
          Privacy
        </NavLink>
        <NavLink to="/terms" className="nav-link">
          Terms
        </NavLink>

        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <IconMoon /> : <IconSun />}
        </button>

        {!user ? (
          <>
            <NavLink to="/login" className="btn-outline btn-sm">
              Log in
            </NavLink>
            <NavLink to="/signup" className="btn-primary btn-elevated btn-sm">
              Sign up
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
            {user.role === "user" && (
              <NavLink to="/bookings" className="nav-link">
                My bookings
              </NavLink>
            )}
            {user.role === "admin" && (
              <NavLink to="/admin-panel" className="nav-link">
                Admin
              </NavLink>
            )}
            <button
              className="btn-ghost btn-sm"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
