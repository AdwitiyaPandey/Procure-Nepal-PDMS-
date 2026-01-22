// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/auth.css"; // Make sure the path to your CSS is correct

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert("Registered successfully");
      navigate("/login");
    } else {
      const data = await res.json();
      alert(data.error || "An error occurred.");
    }
  };

  return (
    <div className="auth-page">
      {/* --- Left Side (same as login) --- */}
      <div className="auth-left">
        <div className="auth-left-text">
          <h2>Source & trade with trust</h2>
          <p>Sign in and easily connect with verified suppliers</p>
        </div>
      </div>

      {/* --- Right Side (with your form) --- */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Create an Account</h2>
          <p>Start your journey with us</p>

          <form className="auth-form" onSubmit={submit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={handleFormChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleFormChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleFormChange}
            />
            <select name="role" value={form.role} onChange={handleFormChange}>
              <option value="buyer">I am a Buyer</option>
              <option value="supplier">I am a Supplier</option>
            </select>
            <button type="submit">Register</button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
