import React, { useEffect, useState } from "react";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "ADMIN",
    status: "ACTIVE",
    hospitalId: ""
  });

  const role = (localStorage.getItem("role") || "").toUpperCase();

  // ✅ FETCH USERS
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:8080/api/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  // ✅ FETCH HOSPITALS
  const fetchHospitals = async () => {
    const res = await fetch("http://localhost:8080/api/hospitals");
    const data = await res.json();
    setHospitals(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchHospitals();
  }, []);

  // 🔹 HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 ADD USER
  const addUser = async () => {
    setMessage("");

    if (!form.fullName || !form.email || !form.password) {
      setMessage("All fields required ❌");
      return;
    }

    if (
      (form.role === "HOSPITAL_STAFF" ||
        form.role === "RECEPTION_STAFF") &&
      !form.hospitalId
    ) {
      setMessage("Please select hospital ❌");
      return;
    }

    const res = await fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.text();

    if (!res.ok) {
      setMessage(data);
    } else {
      setMessage("User added successfully ✅");

      setForm({
        fullName: "",
        email: "",
        password: "",
        role: "ADMIN",
        status: "ACTIVE",
        hospitalId: ""
      });

      fetchUsers();
    }
  };

  // 🔹 DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`http://localhost:8080/api/users/${id}`, {
      method: "DELETE"
    });

    fetchUsers();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>👨‍💼 User Management</h2>

        <p style={styles.role}>
          Logged in as: <strong>{role}</strong>
        </p>

        {/* 🔥 MESSAGE */}
        {message && <div style={styles.message}>{message}</div>}

        {/* 🔹 FORM */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Add New User</h3>

          <div style={styles.form}>
            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="HOSPITAL_STAFF">HOSPITAL_STAFF</option>
              <option value="LAB_STAFF">LAB_STAFF</option>
              <option value="RECEPTION_STAFF">RECEPTION_STAFF</option>
            </select>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            {/* 🔥 HOSPITAL DROPDOWN */}
            {(form.role === "HOSPITAL_STAFF" ||
              form.role === "RECEPTION_STAFF") && (
              <select
                name="hospitalId"
                value={form.hospitalId}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Hospital</option>

                {hospitals.map((h) => (
                  <option key={h.hospitalId} value={h.hospitalId}>
                    {h.name}
                  </option>
                ))}
              </select>
            )}

            <button onClick={addUser} style={styles.addBtn}>
              Add User
            </button>
          </div>
        </div>

        {/* 🔹 TABLE */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Hospital</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((u) => {
                  const hospital = hospitals.find(
                    (h) => h.hospitalId === u.hospitalId
                  );

                  return (
                    <tr key={u.userId} style={styles.tr}>
                      <td style={styles.td}>{u.userId}</td>
                      <td style={styles.td}>{u.fullName}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>{u.role}</td>
                      <td style={styles.td}>
                        <span
                          style={
                            u.status === "ACTIVE"
                              ? styles.activeStatus
                              : styles.inactiveStatus
                          }
                        >
                          {u.status}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {hospital ? hospital.name : "N/A"}
                      </td>

                      <td style={styles.td}>
                        <button
                          onClick={() => deleteUser(u.userId)}
                          style={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={styles.noData}>
                    No users found
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

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f9",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif"
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto"
  },

  title: {
    textAlign: "center",
    color: "#1e3a8a",
    marginBottom: "10px",
    fontSize: "34px"
  },

  role: {
    textAlign: "center",
    color: "#555",
    marginBottom: "25px"
  },

  message: {
    background: "#e3f2fd",
    color: "#1565c0",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: "bold"
  },

  formCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "30px"
  },

  formTitle: {
    marginBottom: "20px",
    color: "#333"
  },

  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px"
  },

  input: {
    flex: "1 1 250px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none"
  },

  select: {
    flex: "1 1 220px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    background: "#fff"
  },

  addBtn: {
    background: "#2e7d32",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px"
  },

  tableContainer: {
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
    background: "#1e3a8a",
    color: "white",
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

  activeStatus: {
    background: "#c8e6c9",
    color: "#2e7d32",
    padding: "5px 10px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "13px"
  },

  inactiveStatus: {
    background: "#ffcdd2",
    color: "#c62828",
    padding: "5px 10px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "13px"
  },

  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#777"
  }
};

export default UserManagement;