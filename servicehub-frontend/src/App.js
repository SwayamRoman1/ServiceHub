import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Shell from "./components/Shell";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute"; // uses your existing component

import "./styles/index.css";

/* ---------- Code-split pages ---------- */
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const About = lazy(() => import("./pages/About"));
const Support = lazy(() => import("./pages/Support"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const Chat = lazy(() => import("./pages/Chat"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

/* ---------- Nice fallback loader ---------- */
function Loader() {
  return (
    <div className="section shell-inner" style={{ padding: "48px 0" }}>
      <div className="card" style={{ textAlign: "center" }}>
        <div
          aria-label="Loading"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "3px solid var(--line)",
            borderTopColor: "var(--brand)",
            margin: "10px auto 14px",
            animation: "spin .9s linear infinite",
          }}
        />
        <div className="muted">Loading…</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ---------- Scroll to top on route change ---------- */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // instant for now (can be smooth if you prefer)
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

/* ---------- Not Found ---------- */
function NotFound() {
  return (
    <div className="section shell-inner">
      <div className="card" style={{ textAlign: "center" }}>
        <h1 className="hd-1">Page not found</h1>
        <p className="muted">The page you’re looking for doesn’t exist.</p>
        <div style={{ marginTop: 10 }}>
          <a className="btn-primary" href="/">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Shell header={<Navbar />} footer={<Footer />}>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Auth required (any signed-in user) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:otherUserId"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />

            {/* Admin only */}
            <Route
              path="/admin-panel"
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Shell>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
