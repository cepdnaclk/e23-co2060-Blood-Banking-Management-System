
import React from "react";
import { useNavigate } from "react-router-dom";
import roleConfig from "./roleConfig";

function Sidebar() {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "").trim().toUpperCase();
  const access = roleConfig[role] || [];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>BBMS</h2>

      {access.includes("dashboard") && (
        <p style={styles.menu} onClick={() => navigate("/dashboard")}>Dashboard</p>
      )}

      {access.includes("users") && (
        <p style={styles.menu} onClick={() => navigate("/users")}>User Management</p>
      )}

      {access.includes("hospitals") && (
        <p style={styles.menu} onClick={() => navigate("/hospitals")}>Hospital Management</p>
      )}

      {access.includes("donorManagement") && (
        <p style={styles.menu} onClick={() => navigate("/donors")}>Donor Management</p>
      )}

      {access.includes("donorApproval") && (
        <p style={styles.menu} onClick={() => navigate("/donor-approval")}>Donor Approval</p>
      )}

      {access.includes("screening") && (
        <p style={styles.menu} onClick={() => navigate("/screening")}>Donor Screening</p>
      )}

      {access.includes("donation") && (
        <p style={styles.menu} onClick={() => navigate("/donations")}>Donation</p>
      )}

      {access.includes("bloodTesting") && (
        <p style={styles.menu} onClick={() => navigate("/blood-tests")}>Blood Testing</p>
      )}

      {access.includes("bloodComponents") && (
        <p style={styles.menu} onClick={() => navigate("/blood-components")}>Blood Components</p>
      )}

      {access.includes("inventory") && (
        <p style={styles.menu} onClick={() => navigate("/inventory")}>Inventory</p>
      )}

      {access.includes("bloodRequests") && (
        <p style={styles.menu} onClick={() => navigate("/blood-requests")}>Blood Requests</p>
      )}

      {access.includes("bloodIssue") && (
        <p style={styles.menu} onClick={() => navigate("/blood-issue")}>Blood Issue</p>

      )}

      {access.includes("bloodRequests") && (
        <p onClick={() => navigate("/blood-requests")}>
        Blood Requests
        </p>
      )}

      {access.includes("alerts") && (
        <p style={styles.menu}>Alerts (Coming Soon)</p>
      )}

      {access.includes("audit") && (
        <p style={styles.menu}>Audit Logs (Coming Soon)</p>
      )}

      {access.includes("reports") && (
        <p style={styles.menu}>Reports (Coming Soon)</p>
      )}

      <button
        style={styles.logout}
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    backgroundColor: "#1e1e2f",
    color: "white",
    padding: "20px",
    height: "100vh"
  },
  logo: { marginBottom: "20px" },
  menu: {
    padding: "10px",
    cursor: "pointer"
  },
  logout: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};

export default Sidebar;