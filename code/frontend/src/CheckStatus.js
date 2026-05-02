import React, { useState } from "react";
import bg from "./bg.jpg";

function CheckStatus() {
  const [nic, setNic] = useState("");
  const [status, setStatus] = useState("");

  const checkStatus = async () => {
    if (!nic) {
      alert("Enter NIC");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/public/donors/status/${nic}`
      );

      const data = await res.text();
      setStatus(data);
    } catch (err) {
      setStatus("ERROR");
    }
  };

  // 🎨 STATUS COLOR + LABEL
  const getStatusStyle = () => {
    switch (status) {
      case "ACTIVE":
        return { color: "green", text: "✅ Approved" };

      case "REJECTED":
        return { color: "red", text: "❌ Rejected" };

      case "PENDING_VERIFICATION":
        return { color: "orange", text: "⏳ Pending Verification" };

      case "NOT_REGISTERED":
        return { color: "gray", text: "⚠ Not Registered" };

      default:
        return { color: "black", text: status };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Check Donor Status</h2>

        <input
          style={styles.input}
          placeholder="Enter NIC"
          value={nic}
          onChange={(e) => setNic(e.target.value)}
        />

        <button style={styles.button} onClick={checkStatus}>
          Check Status
        </button>

        {status && (
          <div style={styles.resultBox}>
            <h3 style={{ color: statusStyle.color }}>
              {statusStyle.text}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  },

  card: {
    background: "rgba(255,255,255,0.95)",
    padding: "35px",
    borderRadius: "12px",
    textAlign: "center",
    width: "350px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
  },

  title: {
    marginBottom: "20px",
    color: "#b71c1c"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },

  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ff6f00",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  },

  resultBox: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5"
  }
};

export default CheckStatus;