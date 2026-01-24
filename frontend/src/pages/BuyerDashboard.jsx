import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../css/dashboard.css";

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchProducts = useCallback(() => {
    axios.get("/api/buyer/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      params: { search, category }
    }).then(res => setProducts(res.data));
  }, [search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="dashboard">
      <h2>Buyer Dashboard</h2>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option>All</option>
          <option>Construction</option>
          <option>Furniture</option>
          <option>Electronics</option>
        </select>

        <button onClick={fetchProducts}>Search</button>
      </div>

      {/* Products */}
      <div className="product-grid">
        {products.length === 0 && (
          <p>No products found</p>
        )}

        {products.map(p => (
          <div className="product-card" key={p.id}>
            <h3>{p.name}</h3>
            <p className="supplier">Supplier: {p.supplier_name}</p>
            <p className="price">Rs {p.price}</p>
            <p className="category">{p.category}</p>

            <button>Request Quote</button>
          </div>
        ))}
      </div>
    </div>
  );
}
