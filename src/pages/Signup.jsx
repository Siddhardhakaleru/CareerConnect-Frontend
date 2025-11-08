import React, { useState } from "react";
import API from "../api";
import "./Auth.css"; // same CSS file as login

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", form);

      // Store token + name for auto login
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.user.name);

      window.location.href = "/";
    } catch (err) {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Your Account 🚀</h2>
        <p className="subtitle">Join Connect Career and start networking</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit">Sign Up</button>
        </form>

        <p className="switch-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
