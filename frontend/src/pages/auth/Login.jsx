// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/auth.css"; // Make sure the path to your CSS is correct

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      alert(`Logged in as ${data.role}`);
      navigate(data.role === "buyer" ? "/buyer" : "/supplier");
    } else {
      alert(data.error || "An error occurred.");
    }
  };

  return (
    <div className="auth-page">
      {/* --- Left Side --- */}
      <div className="auth-left">
        <div className="auth-left-text">
          <h2>Source & trade with trust</h2>
          <p>Sign in and easily connect with verified suppliers</p>
        </div>
      </div>

      {/* --- Right Side (with your form) --- */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Sign In</h2>
          <p>Access your account</p>

          <form className="auth-form" onSubmit={submit}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign In</button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
