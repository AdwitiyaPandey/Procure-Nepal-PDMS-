import React, { useState } from "react";

const sampleApplications = [
  {
    id: 1,
    name: "Ramesh Bhandari",
    shop: "Everest Electronics",
    email: "ramesh@example.com",
    phone: "+977-98XXXXXXXX",
    submittedAt: "2025-12-09",
    status: "pending",
    note: "Wants to sell electronics and accessories",
  },
  {
    id: 2,
    name: "Sita Tamang",
    shop: "Kathmandu Handicrafts",
    email: "sita@example.com",
    phone: "+977-98YYYYYYYY",
    submittedAt: "2025-12-10",
    status: "approved",
    note: "Handmade goods, 5 years experience",
  },
  {
    id: 3,
    name: "Bishal Rai",
    shop: "Bishal's Boutique",
    email: "bishal@example.com",
    phone: "+977-98ZZZZZZZZ",
    submittedAt: "2025-12-11",
    status: "rejected",
    note: "Missing business license",
  },
];

export default function SellerApplications({ initial = sampleApplications }) {
  const [apps, setApps] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [note, setNote] = useState("");

  function openConfirm(app, type) {
    setSelected(app);
    setActionType(type);
    setNote("");
    setShowConfirm(true);
  }

  function closeConfirm() {
    setSelected(null);
    setActionType(null);
    setNote("");
    setShowConfirm(false);
  }

  function applyAction() {
    if (!selected || !actionType) return;
    setApps((prev) =>
      prev.map((a) =>
        a.id === selected.id
          ? {
              ...a,
              status: actionType === "approve" ? "approved" : "rejected",
              adminNote:
                note ||
                (actionType === "approve"
                  ? "Approved by admin"
                  : "Rejected by admin"),
            }
          : a
      )
    );
    closeConfirm();
  }

  const filtered = apps.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.shop.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.phone.toLowerCase().includes(q)
    );
  });

const styles = {
  container: {
    maxWidth: "960px",
    margin: "40px auto",
    padding: "28px",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  input: {
    padding: "10px 14px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
  },

  select: {
    padding: "10px 14px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
    backgroundColor: "#fff",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    backgroundColor: "#fff",
  },

  th: {
    padding: "14px 10px",
    fontSize: "13px",
    color: "#374151",
    fontWeight: "600",
    borderBottom: "2px solid #e5e7eb",
  },

  td: {
    padding: "14px 10px",
    fontSize: "14px",
    color: "#4b5563",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  },

  button: {
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },

  approveBtn: {
    backgroundColor: "#22c55e",
    color: "#ffffff",
  },

  rejectBtn: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
  },

  cancelBtn: {
    backgroundColor: "#f9fafb",
    color: "#111827",
    border: "1px solid #d1d5db",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 40,
  },

  modalContent: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    zIndex: 50,
    maxWidth: "520px",
    width: "90%",
    overflow: "hidden",
  },

  modalBody: {
    padding: "28px",
  },

  avatar: {
    height: "44px",
    width: "44px",
    borderRadius: "50%",
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "700",
  },

  status: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: "#e5e7eb",
    color: "#374151",
  },
};


  function StatusBadge({ status }) {
    let style = { ...styles.status };
    if (status === "approved") style = { ...style, backgroundColor: "#bbf7d0", color: "#166534" };
    else if (status === "rejected") style = { ...style, backgroundColor: "#fecaca", color: "#991b1b" };
    else style = { ...style, backgroundColor: "#fef3c7", color: "#78350f" };
    return <span style={style}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "600" }}>Seller Applications</h1>
          <p style={{ fontSize: "14px", color: "#666" }}>Review, approve or reject seller applications.</p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search name, shop or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ ...styles.input, width: "250px" }}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.select}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </header>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Seller</th>
            <th style={styles.th}>Contact</th>
            <th style={styles.th}>Submitted</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} style={{ ...styles.td, textAlign: "center", color: "#999" }}>
                No applications found.
              </td>
            </tr>
          )}
          {filtered.map((app) => (
            <tr key={app.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={styles.td}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={styles.avatar}>{app.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
                  <div>
                    <div style={{ fontWeight: "500" }}>{app.name}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>{app.shop}</div>
                    {app.adminNote && <div style={{ fontSize: "10px", color: "#999" }}>Note: {app.adminNote}</div>}
                  </div>
                </div>
              </td>
              <td style={styles.td}>
                <div>{app.email}</div>
                <div style={{ fontSize: "12px", color: "#999" }}>{app.phone}</div>
              </td>
              <td style={styles.td}>{app.submittedAt}</td>
              <td style={styles.td}>
                <StatusBadge status={app.status} />
              </td>
              <td style={styles.td}>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => openConfirm(app, "approve")}
                    disabled={app.status === "approved"}
                    style={{
                      ...styles.button,
                      ...(app.status === "approved"
                        ? { backgroundColor: "#bbf7d0", color: "#166534", cursor: "not-allowed" }
                        : { backgroundColor: "#16a34a", color: "#fff" }),
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openConfirm(app, "reject")}
                    disabled={app.status === "rejected"}
                    style={{
                      ...styles.button,
                      ...(app.status === "rejected"
                        ? { backgroundColor: "#fecaca", color: "#991b1b", cursor: "not-allowed" }
                        : { backgroundColor: "#dc2626", color: "#fff" }),
                    }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => alert(JSON.stringify(app, null, 2))}
                    style={{ ...styles.button, backgroundColor: "#f3f4f6", color: "#111", border: "1px solid #ccc" }}
                  >
                    Details
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showConfirm && selected && (
        <div>
          <div style={styles.modalOverlay} onClick={closeConfirm}></div>
          <div style={styles.modalContent}>
            <div style={styles.modalBody}>
              <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                {actionType === "approve" ? "Approve" : "Reject"} seller application
              </h3>
              <p style={{ fontSize: "14px", color: "#555", marginTop: "8px" }}>
                Seller: <strong>{selected.name}</strong>
              </p>
              <p style={{ fontSize: "14px", color: "#555" }}>
                Shop: <strong>{selected.shop}</strong>
              </p>
              <label style={{ display: "block", marginTop: "16px", fontSize: "14px", color: "#555" }}>
                Admin note (optional)
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: "100%", marginTop: "4px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  rows={3}
                />
              </label>
              <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button onClick={closeConfirm} style={{ ...styles.button, ...styles.cancelBtn }}>
                  Cancel
                </button>
                <button
                  onClick={applyAction}
                  style={{
                    ...styles.button,
                    backgroundColor: actionType === "approve" ? "#16a34a" : "#dc2626",
                    color: "#fff",
                  }}
                >
                  {actionType === "approve" ? "Confirm Approve" : "Confirm Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

