import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [duplicates, setDuplicates] = useState([]);
  const [sexual, setSexual] = useState([]);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || localStorage.getItem("role") !== "admin") {
      navigate('/login');
      return;
    }

    fetch('/api/admin/reports/duplicates', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setDuplicates).catch(console.error);

    fetch('/api/admin/reports/sexual', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setSexual).catch(console.error);
  }, [navigate]);

  const doBan = async () => {
    if (!userId) return alert('Enter userId');
    const token = localStorage.getItem("token");
    const res = await fetch('/api/admin/ban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    alert(data.message || 'Done');
  };

  const doFlag = async () => {
    if (!userId) return alert('Enter userId');
    const token = localStorage.getItem("token");
    const res = await fetch('/api/admin/flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    alert(data.message || 'Done');
  };

  return (
    <div className="admin-dashboard" style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      <section style={{ marginBottom: 20 }}>
        <h3>Duplicate Items</h3>
        {duplicates.length === 0 && <p>No duplicate items found.</p>}
        <ul>
          {duplicates.map(d => (
            <li key={d.name}>{d.name} — count: {d.count} — ids: {d.ids}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3>Sexual / Adult Items</h3>
        {sexual.length === 0 && <p>No items flagged by keyword.</p>}
        <ul>
          {sexual.map(p => (
            <li key={p.id}>{p.name} — category: {p.category} — id: {p.id}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Ban / Flag User</h3>
        <p>Enter user ID to ban or flag (use database user id)</p>
        <input placeholder="user id" value={userId} onChange={e => setUserId(e.target.value)} />
        <div style={{ marginTop: 8 }}>
          <button onClick={doBan}>Ban User</button>
          <button onClick={doFlag} style={{ marginLeft: 8 }}>Flag User</button>
        </div>
      </section>
    </div>
  );
}
