import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in email and password.");
      return;
    }
    setSubmitting(true);
    try {
      const user = await login(email, password);
      // Redirect intent (e.g., from a ProtectedRoute) or default
      const next =
        location.state?.from ||
        (user.role === "provider" || user.role === "admin"
          ? "/dashboard"
          : "/services");
      navigate(next, { replace: true });
    } catch (err) {
      setError(
        typeof err === "string" ? err : "Login failed. Check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section">
      <div className="auth-panel">
        <div className="card auth-card">
          <h1>Welcome back</h1>
          <p className="muted" style={{ marginTop: -6 }}>
            Sign in to continue
          </p>

          <form className="form-grid" onSubmit={handleLogin} noValidate>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-row">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="icon-btn ghost small pw-toggle"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  title={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error ? <div className="form-error">{error}</div> : null}

            <div className="form-actions">
              <button
                className="btn-primary btn-elevated"
                disabled={submitting}
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
              <Link to="/signup" className="btn-outline">
                Create account
              </Link>
            </div>
          </form>

          <div className="form-subtext">
            <Link to="/privacy" className="link-soft">
              Privacy
            </Link>
            <span aria-hidden="true">•</span>
            <Link to="/terms" className="link-soft">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
