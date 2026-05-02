import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminApproval() {
  const [donors, setDonors] = useState([]);
  const navigate = useNavigate();

  // ✅ Get role
  const role = localStorage.getItem("role") || "HOSPITAL_STAFF";

  // ✅ Allowed roles
  const allowedRoles = ["ADMIN", "HOSPITAL_STAFF", "RECEPTION_STAFF"];

  // 🔥 Fetch pending donors
  const fetchDonors = async () => {
    if (!allowedRoles.includes(role)) {
      alert("Access Denied");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/admin/donors/pending",
        {
          headers: { role: role }
        }
      );

      if (!res.ok) {
        alert("Access Denied");
        return;
      }

      const data = await res.json();
      setDonors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching donors:", err);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // 🔥 Approve donor
  const approveDonor = async (id) => {
    try {
      await fetch(
        `http://localhost:8080/api/admin/donors/approve/${id}`,
        {
          method: "PUT",
          headers: { role: role }
        }
      );

      fetchDonors();
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  // 🔥 Reject donor
  const rejectDonor = async (id) => {
    const reason = prompt("Enter rejection reason:");

    if (!reason) return;

    try {
      await fetch(
        `http://localhost:8080/api/admin/donors/reject/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            role: role
          },
          body: JSON.stringify(reason)
        }
      );

      fetchDonors();
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  return (
    <div className="approval-container">
      {/* ✅ Back Button */}
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="approval-card">
        <h2>Donor Approval</h2>

        <p className="role-text">
          Logged in as: <strong>{role}</strong>
        </p>

        <table className="donor-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>NIC</th>
              <th>Blood Group</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {donors.length > 0 ? (
              donors.map((d) => (
                <tr key={d.donorId}>
                  <td>{d.donorId}</td>
                  <td>{d.fullName}</td>
                  <td>{d.nic}</td>
                  <td>{d.bloodGroup}</td>
                  <td>{d.phone}</td>

                  <td>
                    {allowedRoles.includes(role) ? (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() => approveDonor(d.donorId)}
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => rejectDonor(d.donorId)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>No Access</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No pending donors
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ CSS */}
      <style>{`
        .approval-container {
          min-height: 100vh;
          background: #f4f6f9;
          padding: 30px;
          font-family: Arial, sans-serif;
        }

        .back-btn {
          background: #1976d2;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 20px;
          transition: 0.3s;
        }

        .back-btn:hover {
          background: #0d47a1;
        }

        .approval-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .approval-card h2 {
          margin-bottom: 10px;
          color: #333;
        }

        .role-text {
          color: #666;
          margin-bottom: 20px;
        }

        .donor-table {
          width: 100%;
          border-collapse: collapse;
          overflow: hidden;
          border-radius: 10px;
        }

        .donor-table thead {
          background: #1976d2;
          color: white;
        }

        .donor-table th,
        .donor-table td {
          padding: 14px;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }

        .donor-table tbody tr:hover {
          background: #f9f9f9;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .approve-btn {
          background: #2e7d32;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }

        .approve-btn:hover {
          background: #1b5e20;
        }

        .reject-btn {
          background: #d32f2f;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }

        .reject-btn:hover {
          background: #b71c1c;
        }

        .no-data {
          padding: 20px;
          color: #777;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .donor-table {
            font-size: 12px;
          }

          .approve-btn,
          .reject-btn {
            padding: 6px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminApproval;