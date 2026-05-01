import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DonationPage() {
  const navigate = useNavigate();

  // 🔒 ROLE
  const role = (localStorage.getItem("role") || "").trim().toUpperCase();

  // ✅ STATES
  const [donations, setDonations] = useState([]);

  const [form, setForm] = useState({
    donorId: "",
    screeningId: "",
    unitsCollected: "",
    remarks: ""
  });

  const [editingId, setEditingId] = useState(null);

  // 🔥 FETCH DATA
  const fetchDonations = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/donations");
      const data = await res.json();
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // 🔒 ROLE CHECK
  if (!["ADMIN", "HOSPITAL_STAFF"].includes(role)) {
    return <h2 style={{ padding: "20px" }}>Access Denied ❌</h2>;
  }

  // 🔥 CREATE / UPDATE
  const handleSubmit = async () => {
    if (!form.donorId || !form.screeningId || !form.unitsCollected) {
      alert("Fill all required fields");
      return;
    }

    try {
      let res;

      if (editingId) {
        res = await fetch(
          `http://localhost:8080/api/donations/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              unitsCollected: Number(form.unitsCollected),
              remarks: form.remarks,
              donationStatus: "COMPLETED"
            })
          }
        );
      } else {
        res = await fetch(
          `http://localhost:8080/api/donations/${form.donorId}/${form.screeningId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              unitsCollected: Number(form.unitsCollected),
              remarks: form.remarks
            })
          }
        );
      }

      if (!res.ok) {
        const error = await res.text();
        alert(error);
        return;
      }

      setForm({
        donorId: "",
        screeningId: "",
        unitsCollected: "",
        remarks: ""
      });

      setEditingId(null);
      fetchDonations();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this donation?")) return;

    await fetch(`http://localhost:8080/api/donations/${id}`, {
      method: "DELETE"
    });

    fetchDonations();
  };

  return (
    <div className="donation-container">

      {/* Back Button */}
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="donation-card">
        <h2>Donation Management</h2>

        {/* FORM */}
        <div className="donation-form">

          <input
            placeholder="Donor ID"
            value={form.donorId}
            onChange={(e) =>
              setForm({ ...form, donorId: e.target.value })
            }
          />

          <input
            placeholder="Screening ID"
            value={form.screeningId}
            onChange={(e) =>
              setForm({ ...form, screeningId: e.target.value })
            }
          />

          <input
            placeholder="Units Collected"
            value={form.unitsCollected}
            onChange={(e) =>
              setForm({ ...form, unitsCollected: e.target.value })
            }
          />

          <input
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) =>
              setForm({ ...form, remarks: e.target.value })
            }
          />

          <div className="form-buttons">
            <button className="save-btn" onClick={handleSubmit}>
              {editingId ? "Update Donation" : "Add Donation"}
            </button>

            {editingId && (
              <button
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);

                  setForm({
                    donorId: "",
                    screeningId: "",
                    unitsCollected: "",
                    remarks: ""
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <table className="donation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Donor</th>
              <th>Screening</th>
              <th>Units</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {donations.length > 0 ? (
              donations.map((d) => (
                <tr key={d.donationId}>
                  <td>{d.donationId}</td>
                  <td>{d.donorId}</td>
                  <td>{d.screeningId}</td>
                  <td>{d.unitsCollected}</td>

                  <td>
                    <span
                      className={
                        d.donationStatus === "COMPLETED"
                          ? "status-complete"
                          : "status-pending"
                      }
                    >
                      {d.donationStatus}
                    </span>
                  </td>

                  <td>{d.remarks}</td>

                  <td>
                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() => {
                          setForm({
                            donorId: d.donorId,
                            screeningId: d.screeningId,
                            unitsCollected: d.unitsCollected,
                            remarks: d.remarks
                          });

                          setEditingId(d.donationId);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(d.donationId)}
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No donations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CSS */}
      <style>{`
        .donation-container {
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
          margin-bottom: 20px;
        }

        .back-btn:hover {
          background: #0d47a1;
        }

        .donation-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .donation-card h2 {
          margin-bottom: 20px;
          color: #333;
        }

        .donation-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .donation-form input {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
        }

        .donation-form input:focus {
          border-color: #1976d2;
        }

        .form-buttons {
          display: flex;
          gap: 10px;
          grid-column: 1 / -1;
        }

        .save-btn {
          background: #2e7d32;
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
        }

        .save-btn:hover {
          background: #1b5e20;
        }

        .cancel-btn {
          background: #d32f2f;
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
        }

        .cancel-btn:hover {
          background: #b71c1c;
        }

        .donation-table {
          width: 100%;
          border-collapse: collapse;
        }

        .donation-table th {
          background: #1976d2;
          color: white;
          padding: 14px;
        }

        .donation-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
          text-align: center;
        }

        .donation-table tr:hover {
          background: #f9f9f9;
        }

        .status-complete {
          color: green;
          font-weight: bold;
        }

        .status-pending {
          color: orange;
          font-weight: bold;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .edit-btn {
          background: #1976d2;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        .edit-btn:hover {
          background: #0d47a1;
        }

        .delete-btn {
          background: #d32f2f;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        .delete-btn:hover {
          background: #b71c1c;
        }

        .no-data {
          padding: 20px;
          color: #777;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

export default DonationPage;