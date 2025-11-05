import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shell from "./components/Shell";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Support from "./pages/Support";
import MyBookings from "./pages/MyBookings";
import Chat from "./pages/Chat";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdminPanel from "./pages/AdminPanel";

import "./styles/index.css";

function App() {
  return (
    <Router>
      <Shell header={<Navbar />} footer={<Footer />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/chat/:otherUserId" element={<Chat />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Shell>
    </Router>
  );
}

export default App;
