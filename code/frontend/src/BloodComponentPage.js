import React, { useEffect, useState } from "react";

function BloodComponentPage() {
  const [components, setComponents] = useState([]);
  const [form, setForm] = useState({
    donationId: "",
    componentType: "",
    quantity: ""
  });

  // 🔥 FETCH COMPONENTS
  const fetchComponents = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/components");
      const data = await res.json();
      setComponents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  // 🔥 CREATE COMPONENT
  const handleSubmit = async () => {
    if (!form.donationId || !form.componentType || !form.quantity) {
      alert("All fields required");
      return;
    }

    const payload = {
      donation: { donationId: Number(form.donationId) },
      componentType: form.componentType,
      quantity: parseFloat(form.quantity)
    };

    try {
      const res = await fetch("http://localhost:8080/api/components", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const msg = await res.text();
      alert(msg);

      setForm({
        donationId: "",
        componentType: "",
        quantity: ""
      });

      fetchComponents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>🩸 Blood Components</h2>

      {/* FORM */}
      <div style={card}>
        <input
          style={input}
          type="number"
          placeholder="Donation ID"
          value={form.donationId}
          onChange={(e) =>
            setForm({ ...form, donationId: e.target.value })
          }
        />

        <select
          style={input}
          value={form.componentType}
          onChange={(e) =>
            setForm({ ...form, componentType: e.target.value })
          }
        >
          <option value="">Select Type</option>
          <option value="RBC">🧪 RBC</option>
          <option value="PLASMA">💧 Plasma</option>
          <option value="PLATELETS">🟡 Platelets</option>
        </select>

        <input
          style={input}
          type="number"
          step="0.1"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
        />

        <button style={button} onClick={handleSubmit}>
          ➕ Create
        </button>
      </div>

      {/* TABLE */}
      <div style={tableCard}>
        <table style={table}>
          <thead>
            <tr>
              <th>Component_ID</th>
              <th>Donation_ID</th>
              <th>Blood Group</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
            </tr>
          </thead>

          <tbody>
            {components.length > 0 ? (
              components.map((c) => (
                <tr key={c.componentId} style={row}>
                  <td>{c.componentId}</td>

                  {/* ✅ FIXED */}
                  <td>
                    {c.donation?.donationId
                      ? `${c.donation.donationId}`
                      : "N/A"}
                  </td>

                  {/* ✅ NICE FORMAT */}
                  <td>
                    {c.bloodGroup
                      ?.replace("_POSITIVE", "+")
                      .replace("_NEGATIVE", "-")}
                  </td>

                  <td>
                    <span style={getTypeStyle(c.componentType)}>
                      {c.componentType}
                    </span>
                  </td>

                  <td>{c.quantity}</td>
                  <td>{c.expiryDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={noData}>
                  No components found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BloodComponentPage;

// ================= STYLES =================

const container = {
  padding: "30px",
  background: "#f5f7fb",
  minHeight: "100vh"
};

const title = {
  marginBottom: "20px",
  fontSize: "26px"
};

const card = {
  display: "flex",
  gap: "12px",
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  marginBottom: "20px"
};

const input = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const button = {
  background: "#4f6ef7",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer"
};

const tableCard = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const table = {
  width: "100%",
  borderCollapse: "collapse"
};

const row = {
  borderBottom: "1px solid #eee",
  textAlign: "center"
};

const noData = {
  textAlign: "center",
  padding: "20px",
  color: "#999"
};

// 🎨 TYPE COLORS
const getTypeStyle = (type) => {
  switch (type) {
    case "RBC":
      return badge("#ff4d4f");
    case "PLASMA":
      return badge("#1890ff");
    case "PLATELETS":
      return badge("#faad14");
    default:
      return badge("#999");
  }
};

const badge = (color) => ({
  background: color,
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px"
});