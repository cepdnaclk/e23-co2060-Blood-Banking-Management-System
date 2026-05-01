import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ScreeningPage() {
  const navigate = useNavigate();

  const [screenings, setScreenings] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    donorId: "",
    hemoglobin: "",
    weight: "",
    bloodPressure: "",
    temperature: "",
    pulseRate: "",
    medicalHistory: "",
    notes: ""
  });

  const fetchScreenings = async () => {
    const res = await fetch("http://localhost:8080/api/screenings");
    const data = await res.json();
    setScreenings(data);
  };

  useEffect(() => {
    fetchScreenings();
  }, []);

  const resetForm = () => {
    setForm({
      donorId: "",
      hemoglobin: "",
      weight: "",
      bloodPressure: "",
      temperature: "",
      pulseRate: "",
      medicalHistory: "",
      notes: ""
    });
    setEditingId(null);
  };

  // ✅ CREATE / UPDATE
  const addScreening = async () => {
    setError("");
    setMessage("");

    if (!form.donorId || !form.hemoglobin || !form.weight) {
      setError("Donor ID, Hemoglobin, and Weight are required.");
      return;
    }

    const url = editingId
      ? `http://localhost:8080/api/screenings/${editingId}`
      : `http://localhost:8080/api/screenings/${form.donorId}`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hemoglobin: Number(form.hemoglobin),
          weight: Number(form.weight),
          bloodPressure: form.bloodPressure,
          temperature: Number(form.temperature),
          pulseRate: Number(form.pulseRate),
          medicalHistory: form.medicalHistory,
          remarks: form.notes
        })
      });

      const text = await res.text();

      if (!res.ok) {
        setError(text);
        return;
      }

      setMessage(editingId ? "Updated successfully!" : "Added successfully!");
      resetForm();
      fetchScreenings();

    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  // ✅ DELETE
  const deleteScreening = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    await fetch(`http://localhost:8080/api/screenings/${id}`, {
      method: "DELETE"
    });

    fetchScreenings();
  };

  return (
    <div className="container">

      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <div className="card">
        <h2>🩸 Donor Screening</h2>

        {/* Messages */}
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        {/* FORM */}
        <div className="form">

          <input
            placeholder="Donor ID"
            value={form.donorId}
            disabled={editingId}
            onChange={(e) =>
              setForm({ ...form, donorId: e.target.value })
            }
          />

          <input
            placeholder="Hemoglobin (g/dL)"
            value={form.hemoglobin}
            onChange={(e) =>
              setForm({ ...form, hemoglobin: e.target.value })
            }
          />

          <input
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={(e) =>
              setForm({ ...form, weight: e.target.value })
            }
          />

          <input
            placeholder="Blood Pressure (e.g. 120/80)"
            value={form.bloodPressure}
            onChange={(e) =>
              setForm({ ...form, bloodPressure: e.target.value })
            }
          />

          <input
            placeholder="Temperature (°C)"
            value={form.temperature}
            onChange={(e) =>
              setForm({ ...form, temperature: e.target.value })
            }
          />

          <input
            placeholder="Pulse Rate"
            value={form.pulseRate}
            onChange={(e) =>
              setForm({ ...form, pulseRate: e.target.value })
            }
          />

          <textarea
            placeholder="Medical History"
            value={form.medicalHistory}
            onChange={(e) =>
              setForm({ ...form, medicalHistory: e.target.value })
            }
          />

          <textarea
            placeholder="Notes / Remarks"
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />

          <div className="buttons">
            <button className="save" onClick={addScreening}>
              {editingId ? "Update" : "Save"}
            </button>

            {editingId && (
              <button className="cancel" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Donor</th>
              <th>HB</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {screenings.map((s) => (
              <tr key={s.screeningId}>
                <td>{s.screeningId}</td>
                <td>{s.donor?.donorId}</td>
                <td>{s.hemoglobin}</td>
                <td>{s.weight}</td>

                <td className={s.eligibilityStatus === "ELIGIBLE" ? "ok" : "bad"}>
                  {s.eligibilityStatus}
                </td>

                <td>
                  <button
                    className="edit"
                    onClick={() => {
                      setEditingId(s.screeningId);
                      setForm({
                        donorId: s.donor?.donorId,
                        hemoglobin: s.hemoglobin,
                        weight: s.weight,
                        bloodPressure: s.bloodPressure,
                        temperature: s.temperature,
                        pulseRate: s.pulseRate,
                        medicalHistory: s.medicalHistory,
                        notes: s.remarks
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteScreening(s.screeningId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CSS */}
      <style>{`
        .container {
          padding: 30px;
          background: #f4f6f9;
          min-height: 100vh;
        }

        .card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        h2 { margin-bottom: 10px; }

        .form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        input, textarea {
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        textarea { grid-column: span 2; }

        .buttons {
          grid-column: span 2;
          display: flex;
          gap: 10px;
        }

        .save { background: green; color: white; }
        .cancel { background: gray; color: white; }

        .edit { background: #1976d2; color: white; }
        .delete { background: red; color: white; }

        button {
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          text-align: center;
        }

        th { background: #1976d2; color: white; }

        .ok { color: green; font-weight: bold; }
        .bad { color: red; font-weight: bold; }

        .success { color: green; }
        .error { color: red; }

        .back-btn {
          margin-bottom: 15px;
          padding: 8px 14px;
          background: #1976d2;
          color: white;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}

export default ScreeningPage;