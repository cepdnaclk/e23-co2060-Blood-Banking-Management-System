import React from "react";
import { useNavigate } from "react-router-dom";
import bg from "./bg.jpg";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.title}>Blood Bank Management System</h1>
          <p style={styles.subtitle}>Donate Blood, Save Lives ❤️</p>

          <button
            style={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login (Admin / Staff)
          </button>

          <button
            style={styles.registerBtn}
            onClick={() => navigate("/register")}
          >
            Register as Donor
          </button>

          <button
            style={styles.statusBtn}
            onClick={() => navigate("/status")}
          >
            Check Donor Status
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  // 🔥 DARK OVERLAY (makes text readable)
  overlay: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },

  card: {
    background: "rgba(255,255,255,0.95)",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    width: "420px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
  },

  title: {
    marginBottom: "10px",
    color: "#b71c1c",
    fontSize: "28px"
  },

  subtitle: {
    marginBottom: "25px",
    color: "#555"
  },

  loginBtn: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  },

  registerBtn: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    backgroundColor: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  },

  statusBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#f57c00",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default HomePage;