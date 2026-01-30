import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "../css/dashboard.css";

export default function SupplierDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: null
  });

  const headers = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }), []);

  const fetchData = useCallback(() => {
    axios.get("/api/supplier/products", { headers })
      .then(res => setProducts(res.data));

    axios.get("/api/supplier/orders", { headers })
      .then(res => setOrders(res.data));
  }, [headers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addProduct = () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    formData.append('category', form.category);
    if (form.image) {
      formData.append('image', form.image);
    }

    axios.post(
      "/api/supplier/product",
      formData,
      { 
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then((response) => {
      console.log('Product added successfully:', response.data);
      fetchData();
      setForm({ name: "", price: "", stock: "", category: "", image: null });
    }).catch((error) => {
      console.error('Error adding product:', error);
    });
  };

  return (
    <div className="dashboard">
      <h2>Supplier Dashboard</h2>

      {/* Add Product */}
      <div className="card">
        <h3>Add Product</h3>
        <input placeholder="Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Price" value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Stock" value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })} />
        <input placeholder="Category" value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })} />
        <input type="file" accept="image/*" 
          onChange={e => setForm({ ...form, image: e.target.files[0] })} />
        <button onClick={addProduct}>Add</button>
      </div>

      {/* My Products */}
      <div className="card">
        <h3>My Products</h3>
        {products.map(p => (
          <div key={p.id} className="product-item">
            {p.image && <img src={`/uploads/${p.image}`} alt={p.name} className="product-image" />}
            <p>{p.name} — Rs {p.price} (Stock: {p.stock})</p>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div className="card">
        <h3>Orders</h3>
        {orders.map(o => (
          <p key={o.id}>
            {o.buyer_name} ordered {o.product_name} (Qty {o.quantity})
          </p>
        ))}
      </div>
    </div>
  );
}
