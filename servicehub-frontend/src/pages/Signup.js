import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please complete all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await signup(form.name, form.email, form.password, form.role);
      navigate("/login");
    } catch (err) {
      setError(typeof err === "string" ? err : "Signup failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section">
      <div className="auth-panel">
        <div className="card auth-card">
          <h1>Create your account</h1>
          <p className="muted" style={{ marginTop: -6 }}>
            It takes less than a minute
          </p>

          <form className="form-grid" onSubmit={handleSignup} noValidate>
            <div className="form-row">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                className="input"
                placeholder="Your full name"
                value={form.name}
                onChange={onChange("name")}
                autoComplete="name"
              />
            </div>

            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={onChange("email")}
                autoComplete="email"
              />
            </div>

            <div className="form-row">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                className="input"
                value={form.role}
                onChange={onChange("role")}
              >
                <option value="user">User</option>
                <option value="provider">Provider</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className="input"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={onChange("password")}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="icon-btn ghost small pw-toggle"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="confirm">Confirm password</label>
              <div className="password-wrap">
                <input
                  id="confirm"
                  type={showPw2 ? "text" : "password"}
                  className="input"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={onChange("confirm")}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="icon-btn ghost small pw-toggle"
                  onClick={() => setShowPw2((s) => !s)}
                  aria-label={showPw2 ? "Hide password" : "Show password"}
                >
                  {showPw2 ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error ? <div className="form-error">{error}</div> : null}

            <div className="form-actions">
              <button
                className="btn-primary btn-elevated"
                disabled={submitting}
              >
                {submitting ? "Creating…" : "Create account"}
              </button>
              <Link to="/login" className="btn-outline">
                I already have an account
              </Link>
            </div>
          </form>

          <div className="form-subtext">
            By signing up you agree to our{" "}
            <Link to="/terms" className="link-soft">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="link-soft">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
