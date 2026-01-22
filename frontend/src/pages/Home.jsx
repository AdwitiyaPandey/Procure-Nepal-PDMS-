import "../css/landing.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="landing">
      
      {/* Navbar */}
      <nav className="landing-nav">
        <h1>B2B Market</h1>
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h2>Connect Buyers & Suppliers Easily</h2>
          <p>
            A simple B2B platform where suppliers showcase products
            and buyers place bulk orders with confidence.
          </p>

          <div className="hero-buttons">
            <Link to="/register">
              <button className="primary-btn">Get Started</button>
            </Link>
            <Link to="/login">
              <button className="secondary-btn">Login</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature-card">
          <h3>For Buyers</h3>
          <p>Find trusted suppliers and place bulk orders easily.</p>
        </div>

        <div className="feature-card">
          <h3>For Suppliers</h3>
          <p>List products, manage orders, and grow your business.</p>
        </div>

        <div className="feature-card">
          <h3>Secure Platform</h3>
          <p>Authentication, role-based access, and secure data.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © 2026 B2B Market. All rights reserved.
      </footer>
    </div>
  );
}
