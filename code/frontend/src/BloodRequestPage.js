import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api/requests";

export default function BloodRequestPage() {
  const [requests, setRequests] = useState([]);

  const [form, setForm] = useState({
    hospitalId: "",
    requestedBy: "",
    patientName: "",
    bloodGroup: "",
    componentType: "",
    unitsRequired: "",
    urgencyLevel: "",
    remarks: ""
  });

  // ================= FETCH =================
  const fetchRequests = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ================= CREATE =================
  const handleSubmit = async () => {
    if (!form.hospitalId || !form.patientName || !form.bloodGroup) {
      alert("Fill required fields");
      return;
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hospitalId: Number(form.hospitalId),
          requestedBy: Number(form.requestedBy),
          unitsRequired: Number(form.unitsRequired)
        })
      });

      const msg = await res.text();
      alert(msg);

      setForm({
        hospitalId: "",
        requestedBy: "",
        patientName: "",
        bloodGroup: "",
        componentType: "",
        unitsRequired: "",
        urgencyLevel: "",
        remarks: ""
      });

      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= APPROVE =================
  const approve = async (id) => {
    await fetch(`${API}/${id}/approve`, { method: "PUT" });
    fetchRequests();
  };

  // ================= REJECT =================
  const reject = async (id) => {
    await fetch(`${API}/${id}/reject`, { method: "PUT" });
    fetchRequests();
  };

  // ================= STATUS STYLE =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return badge("#28a745");
      case "REJECTED":
        return badge("#dc3545");
      default:
        return badge("#ffc107", "#000");
    }
  };

  const badge = (bg, color = "#fff") => ({
    background: bg,
    color: color,
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    display: "inline-block",
    minWidth: "80px",
    textAlign: "center"
  });

  return (
    <div style={container}>
      <h2 style={title}>🏥 Blood Requests</h2>

      {/* ================= FORM ================= */}
      <div style={formCard}>
        <input
          style={input}
          placeholder="Hospital ID"
          value={form.hospitalId}
          onChange={(e) =>
            setForm({ ...form, hospitalId: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="Requested By"
          value={form.requestedBy}
          onChange={(e) =>
            setForm({ ...form, requestedBy: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="Patient Name"
          value={form.patientName}
          onChange={(e) =>
            setForm({ ...form, patientName: e.target.value })
          }
        />

        <select
          style={input}
          value={form.bloodGroup}
          onChange={(e) =>
            setForm({ ...form, bloodGroup: e.target.value })
          }
        >
          <option value="">Blood Group</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
            (bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            )
          )}
        </select>

        <select
          style={input}
          value={form.componentType}
          onChange={(e) =>
            setForm({ ...form, componentType: e.target.value })
          }
        >
          <option value="">Component</option>
          <option value="RBC">RBC</option>
          <option value="PLASMA">PLASMA</option>
          <option value="PLATELETS">PLATELETS</option>
        </select>

        <input
          style={input}
          type="number"
          placeholder="Units"
          value={form.unitsRequired}
          onChange={(e) =>
            setForm({ ...form, unitsRequired: e.target.value })
          }
        />

        <select
          style={input}
          value={form.urgencyLevel}
          onChange={(e) =>
            setForm({ ...form, urgencyLevel: e.target.value })
          }
        >
          <option value="">Urgency</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="EMERGENCY">EMERGENCY</option>
        </select>

        <input
          style={input}
          placeholder="Remarks"
          value={form.remarks}
          onChange={(e) =>
            setForm({ ...form, remarks: e.target.value })
          }
        />

        <button style={button} onClick={handleSubmit}>
          ➕ Submit
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div style={tableCard}>
        <table style={table}>
          <thead style={thead}>
            <tr>
              <th>ID</th>
              <th>Hospital</th>
              <th>Patient</th>
              <th>Blood</th>
              <th>Component</th>
              <th>Units</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.length > 0 ? (
              requests.map((r) => (
                <tr key={r.requestId} style={row}>
                  <td>{r.requestId}</td>
                  <td>{r.hospitalId}</td>
                  <td>{r.patientName}</td>
                  <td>{r.bloodGroup}</td>
                  <td>{r.componentType}</td>
                  <td>{r.unitsRequired}</td>
                  <td>{r.urgencyLevel}</td>

                  <td>
                    <span style={getStatusStyle(r.requestStatus)}>
                      {r.requestStatus}
                    </span>
                  </td>

                  <td>
                    {r.requestStatus === "PENDING" && (
                      <div style={actionBox}>
                        <button
                          style={approveBtn}
                          onClick={() => approve(r.requestId)}
                        >
                          ✔
                        </button>
                        <button
                          style={rejectBtn}
                          onClick={() => reject(r.requestId)}
                        >
                          ✖
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={noData}>
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////
// 🎨 STYLES
//////////////////////////////////////////////////

const container = {
  padding: "30px",
  background: "#f5f7fb",
  minHeight: "100vh"
};

const title = {
  marginBottom: "20px"
};

const formCard = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const input = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const button = {
  background: "#4f6ef7",
  color: "#fff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer"
};

const tableCard = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "center"
};

const thead = {
  background: "#1f4ea3",
  color: "#fff"
};

const row = {
  borderBottom: "1px solid #eee"
};

const actionBox = {
  display: "flex",
  justifyContent: "center",
  gap: "6px"
};

const approveBtn = {
  background: "#28a745",
  color: "#fff",
  border: "none",
  padding: "5px 8px",
  borderRadius: "6px",
  cursor: "pointer"
};

const rejectBtn = {
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "5px 8px",
  borderRadius: "6px",
  cursor: "pointer"
};

const noData = {
  padding: "20px",
  color: "#999",
  textAlign: "center"
};