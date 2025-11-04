// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // load user from localStorage if exists
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      const token = res.data.token;
      const userData = res.data.user;

      // save token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // update state
      setUser(userData);
      return userData;
    } catch (err) {
      throw err.response?.data?.error || "Login failed";
    } finally {
      setLoading(false);
    }
  };

  // signup function
  const signup = async (name, email, password, role = "user") => {
    setLoading(true);
    try {
      await API.post("/auth/signup", { name, email, password, role });
    } catch (err) {
      throw err.response?.data?.error || "Signup failed";
    } finally {
      setLoading(false);
    }
  };

  // logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
