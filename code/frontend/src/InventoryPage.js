import React, { useEffect, useState } from "react";

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchInventory = async () => {
    try {
      const url = filter
        ? `http://localhost:8080/api/inventory/group/${filter}`
        : "http://localhost:8080/api/inventory";

      const res = await fetch(url);
      const data = await res.json();

      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  return (
    <div style={container}>
      <h2 style={title}>📦 Inventory Management</h2>

      {/* FILTER */}
      <div style={filterBox}>
        <select
          style={input}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Blood Groups</option>
          <option value="A+">A+</option>
          <option value="B+">B+</option>
          <option value="O+">O+</option>
          <option value="AB+">AB+</option>
          <option value="A-">A-</option>
          <option value="B-">B-</option>
          <option value="O-">O-</option>
          <option value="AB-">AB-</option>
        </select>

        <button style={btn} onClick={() => fetchInventory()}>
          Filter
        </button>

        <button style={resetBtn} onClick={() => setFilter("")}>
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div style={card}>
        <table style={table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Component ID</th>
              <th>Donation ID</th>
              <th>Blood Group</th>
              <th>Component</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>

          <tbody>
            {inventory.length > 0 ? (
              inventory.map((i) => (
                <tr key={i.inventoryId} style={row}>
                  <td>{i.inventoryId}</td>
                  <td>{i.componentId}</td>
                  <td>{i.donationId}</td>
                  <td>{i.bloodGroup}</td>
                  <td>
                    <span style={typeBadge(i.componentType)}>
                      {i.componentType}
                    </span>
                  </td>
                  <td style={qtyStyle(i.quantity)}>{i.quantity}</td>
                  <td>
                    <span style={statusBadge(i.stockStatus)}>
                      {i.stockStatus || "UNKNOWN"}
                    </span>
                  </td>
                  <td>{i.storageLocation || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={noData}>
                  No inventory available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryPage;

//////////////////////////////////////////////////
// 🎨 STYLES
//////////////////////////////////////////////////

const container = {
  padding: "30px",
  background: "#f5f7fb",
  minHeight: "100vh"
};

const title = {
  fontSize: "28px",
  marginBottom: "20px"
};

const filterBox = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px"
};

const input = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const btn = {
  background: "#1890ff",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer"
};

const resetBtn = {
  background: "#6c757d",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer"
};

const card = {
  background: "#fff",
  padding: "20px",
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

//////////////////////////////////////////////////
// 🎨 BADGES
//////////////////////////////////////////////////

const typeBadge = (type) => ({
  background:
    type === "RBC"
      ? "#ff4d4f"
      : type === "PLASMA"
      ? "#1890ff"
      : type === "PLATELETS"
      ? "#faad14"
      : "#999",
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px"
});

const statusBadge = (status) => ({
  background:
    status === "AVAILABLE"
      ? "#52c41a"
      : status === "LOW_STOCK"
      ? "#faad14"
      : status === "OUT_OF_STOCK"
      ? "#ff4d4f"
      : "#999",
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px"
});

const qtyStyle = (qty) => ({
  fontWeight: "bold",
  color: qty <= 5 ? "#ff4d4f" : "#000"
});