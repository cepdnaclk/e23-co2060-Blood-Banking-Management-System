import React, { useEffect, useState } from "react";

function HospitalPage() {
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    contactNumber: ""
  });

  // 🔹 Fetch hospitals
  const fetchHospitals = async () => {
    const res = await fetch("http://localhost:8080/api/hospitals");
    const data = await res.json();
    setHospitals(data);
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // 🔹 Add hospital
  const addHospital = async () => {
    await fetch("http://localhost:8080/api/hospitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ name: "", location: "", contactNumber: "" });
    fetchHospitals();
  };

  // 🔹 Delete
  const deleteHospital = async (id) => {
    await fetch(`http://localhost:8080/api/hospitals/${id}`, {
      method: "DELETE"
    });
    fetchHospitals();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>🏥 Hospital Management</h2>

        {/* FORM CARD */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Add Hospital</h3>

          <div style={styles.form}>
            <input
              placeholder="Hospital Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={styles.input}
            />

            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              style={styles.input}
            />

            <input
              placeholder="Contact Number"
              value={form.contactNumber}
              onChange={(e) =>
                setForm({ ...form, contactNumber: e.target.value })
              }
              style={styles.input}
            />

            <button onClick={addHospital} style={styles.addBtn}>
              + Add Hospital
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {hospitals.length > 0 ? (
                hospitals.map((h) => (
                  <tr key={h.hospitalId} style={styles.tr}>
                    <td style={styles.td}>{h.hospitalId}</td>
                    <td style={styles.td}>{h.name}</td>
                    <td style={styles.td}>{h.location}</td>
                    <td style={styles.td}>{h.contactNumber}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => deleteHospital(h.hospitalId)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.noData}>
                    No hospitals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f9",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif"
  },

  container: {
    maxWidth: "1000px",
    margin: "0 auto"
  },

  title: {
    textAlign: "center",
    fontSize: "34px",
    color: "#0d47a1",
    marginBottom: "25px"
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "25px"
  },

  cardTitle: {
    marginBottom: "15px",
    color: "#333"
  },

  form: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap"
  },

  input: {
    flex: "1 1 250px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none"
  },

  addBtn: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px"
  },

  tableCard: {
    background: "#fff",
    borderRadius: "14px",
    overflowX: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    background: "#0d47a1",
    color: "#fff",
    padding: "14px",
    textAlign: "left"
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee"
  },

  tr: {
    transition: "0.2s"
  },

  deleteBtn: {
    background: "#d32f2f",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#777"
  }
};

export default HospitalPage;