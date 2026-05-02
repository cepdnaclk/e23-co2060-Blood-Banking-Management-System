import React, { useEffect, useState } from "react";

export default function DonorManagementPage() {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState("");

  const fetchDonors = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/donor-management");
      const data = await res.json();
      setDonors(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const filteredDonors = donors.filter((d) => {
    const name = d.fullName ? d.fullName.toLowerCase() : "";
    const blood = d.bloodGroup ? d.bloodGroup.toLowerCase() : "";

    return (
      name.includes(search.toLowerCase()) ||
      blood.includes(search.toLowerCase())
    );
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👤 Donor Management</h2>

      {/* Search + Refresh */}
      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search by name or blood group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <button onClick={fetchDonors} style={styles.button}>
          🔄 Refresh
        </button>
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
                <th>Donor Id</th>
              <th>Name</th>
              <th>Address</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Blood Group</th>
              <th>Phone</th>
              <th>Email</th>
              <th>NIC</th>
              <th>Status</th>
              <th>Approved At</th>
            </tr>
          </thead>

          <tbody>
            {filteredDonors.length === 0 ? (
              <tr>
                <td colSpan="10" style={styles.empty}>
                  No donors found 😕
                </td>
              </tr>
            ) : (
              filteredDonors.map((d) => {
                const status = d.status;

                return (
                  <tr
                    key={d.donorId}
                    style={{
                      ...styles.row,
                      ...(status === "ACTIVE" && styles.rowActive),
                      ...(status === "REJECTED" && styles.rowRejected),
                      ...(status === "PENDING_VERIFICATION" &&
                        styles.rowPending),
                    }}
                  >
                    <td>{d.donorId}</td>
                    <td>{d.fullName}</td>
                    <td>{d.address}</td>
                    <td>{d.gender}</td>
                    <td>{d.dob}</td>
                    <td>{d.bloodGroup}</td>
                    <td>{d.phone}</td>
                    <td>{d.email}</td>
                    <td>{d.nic}</td>

                    <td>
                      <span
                        style={{
                          ...styles.status,
                          ...(status === "ACTIVE" && styles.active),
                          ...(status === "REJECTED" && styles.rejected),
                          ...(status === "PENDING_VERIFICATION" &&
                            styles.pending),
                        }}
                      >
                        {status}
                      </span>
                    </td>

                    <td>{d.approvedAt ? d.approvedAt : "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const styles = {
  container: {
    padding: "30px",
    background: "#f4f6fb",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },

  title: {
    marginBottom: "20px",
    fontWeight: "600",
    color: "#1f2937",
  },

  topBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    padding: "10px",
    width: "260px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
  },

  button: {
    padding: "10px 16px",
    background: "linear-gradient(135deg, #4f6ef7, #6b85fa)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },

  tableWrapper: {
    background: "#fff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  row: {
    borderBottom: "1px solid #eee",
    transition: "all 0.2s ease",
  },

  rowActive: {
    background: "#f0fdf4",
  },

  rowRejected: {
    background: "#fef2f2",
  },

  rowPending: {
    background: "#fff7ed",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#888",
  },

  status: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },

  active: {
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #22c55e",
  },

  rejected: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #ef4444",
  },

  pending: {
    background: "#fff7ed",
    color: "#9a3412",
    border: "1px solid #f97316",
  },
};