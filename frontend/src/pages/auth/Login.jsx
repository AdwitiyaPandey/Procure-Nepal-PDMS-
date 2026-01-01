// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/auth.css"; // Make sure the path to your CSS is correct

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      let res, data;
      if (isAdmin) {
        res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });
        data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", "admin");
          alert("Logged in as admin");
          navigate("/admin");
          return;
        } else {
          alert(data.message || "Admin login failed");
          return;
        }
      }

      res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert(`Logged in as ${data.role}`);
        navigate(data.role === "buyer" ? "/buyer" : "/supplier");
      } else {
        alert(data.error || "An error occurred.");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                id="admin-checkbox"
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
              <label htmlFor="admin-checkbox">Admin login</label>
            </div>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
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
