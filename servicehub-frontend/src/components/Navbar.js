import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const go = (path) => navigate(path);

  return (
    <header className="header-glass">
      <div className="shell-inner navbar">
        {/* Brand */}
        <div
          className="brand nav-link"
          role="button"
          tabIndex={0}
          onClick={() => go("/")}
          onKeyDown={(e) => e.key === "Enter" && go("/")}
        >
          <span className="brand-pill" aria-hidden>
            SH
          </span>
          ServiceHub
        </div>

        {/* Search */}
        <div className="nav-search">
          <span className="muted" aria-hidden>
            🔍
          </span>
          <input placeholder="Search services…" />
        </div>

        {/* Nav actions */}
        <nav className="nav-actions">
          <NavLink
            to="/services"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Services
          </NavLink>
          <NavLink
            to="/bookings"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Bookings
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Support
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            About
          </NavLink>

          {/* Simple Theme Toggle */}
          <button
            type="button"
            className="icon-btn"
            title="Toggle light/dark mode"
            onClick={toggleTheme}
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>

          {user ? (
            <>
              {(user.role === "provider" || user.role === "admin") && (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => go("/dashboard")}
                >
                  Dashboard
                </button>
              )}
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  logout();
                  go("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-outline"
                onClick={() => go("/login")}
              >
                Log in
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => go("/signup")}
              >
                Sign up
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
