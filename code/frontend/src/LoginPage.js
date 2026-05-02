import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./bg.jpg";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      // ❌ Login failed
      if (!res.ok || !data.userId) {
        setMessage(data.message || "Invalid credentials ❌");
        return;
      }

      // ✅ Login success
      setMessage("Login Success ✅");

      // 🔥 Store user + role
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("role", data.role.trim().toUpperCase());

      // 🔥 Redirect to ONE dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setMessage("Server error ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Blood Bank Login</h2>

        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          style={styles.input}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        {message && <p style={styles.message}>{message}</p>}
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
    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  },

  card: {
    background: "rgba(255,255,255,0.9)",
    padding: "40px",
    borderRadius: "12px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
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
    border: "1px solid #ccc"
  },

  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  },

  message: {
    marginTop: "15px",
    fontWeight: "bold"
  }
};

export default LoginPage;