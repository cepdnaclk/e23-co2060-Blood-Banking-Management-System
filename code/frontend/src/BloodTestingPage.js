import React, { useEffect, useState } from "react";

export default function BloodTestingPage() {
  const [donations, setDonations] = useState([]);
  const [tests, setTests] = useState([]);

  const [form, setForm] = useState({
    donation: { donationId: "" },
    hiv: "PENDING",
    hepatitisB: "PENDING",
    hepatitisC: "PENDING",
    malaria: "PENDING",
    syphilis: "PENDING",
    remarks: ""
  });

  const [overall, setOverall] = useState("PENDING");

  // ================= FETCH DONATIONS =================
  const fetchDonations = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/donations/completed");
      const data = await res.json();
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setDonations([]);
    }
  };

  // ================= FETCH TESTS =================
  const fetchTests = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/blood-tests");
      const data = await res.json();

      if (Array.isArray(data)) {
        setTests(data);
      } else {
        setTests([]);
      }
    } catch (err) {
      console.error(err);
      setTests([]);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchTests();
  }, []);

  // ================= AUTO RESULT =================
  useEffect(() => {
    const values = [
      form.hiv,
      form.hepatitisB,
      form.hepatitisC,
      form.malaria,
      form.syphilis
    ];

    if (values.includes("POSITIVE")) setOverall("UNSAFE");
    else if (values.includes("PENDING")) setOverall("PENDING");
    else setOverall("SAFE");
  }, [form]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.donation.donationId) {
      alert("Donation ID is required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/blood-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg);
        return;
      }

      alert("✅ Test added successfully");

      setForm({
        donation: { donationId: "" },
        hiv: "PENDING",
        hepatitisB: "PENDING",
        hepatitisC: "PENDING",
        malaria: "PENDING",
        syphilis: "PENDING",
        remarks: ""
      });

      setOverall("PENDING");

      fetchTests();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UI =================
  return (
    <div style={container}>
      <h2>🧪 Blood Testing</h2>

      <div style={card}>
        {/* Donation */}
        <select
          value={form.donation.donationId}
          onChange={(e) =>
            setForm({
              ...form,
              donation: { donationId: e.target.value }
            })
          }
          style={input}
        >
          <option value="">Select Donation</option>
          {donations.map((d) => (
            <option key={d.donationId} value={d.donationId}>
              Donation #{d.donationId}
            </option>
          ))}
        </select>

        {/* Tests */}
        <div style={grid}>
          {[
            { key: "hiv", label: "HIV" },
            { key: "hepatitisB", label: "Hepatitis B" },
            { key: "hepatitisC", label: "Hepatitis C" },
            { key: "malaria", label: "Malaria" },
            { key: "syphilis", label: "Syphilis" }
          ].map((t) => (
            <div key={t.key}>
              <label>{t.label}</label>
              <select
                name={t.key}
                value={form[t.key]}
                onChange={handleChange}
                style={input}
              >
                <option value="PENDING">PENDING</option>
                <option value="NEGATIVE">NEGATIVE</option>
                <option value="POSITIVE">POSITIVE</option>
              </select>
            </div>
          ))}
        </div>

        <input
          type="text"
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
          style={input}
        />

        <h3 style={{ color: getColor(overall) }}>
          Overall Result: {overall}
        </h3>

        <button onClick={handleSubmit} style={btn}>
          Add Test
        </button>
      </div>

      {/* TABLE */}
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>TEST_ID</th>
            <th style={th}>Donation_ID</th>
            <th style={th}>HIV</th>
            <th style={th}>Hep B</th>
            <th style={th}>Hep C</th>
            <th style={th}>Malaria</th>
            <th style={th}>Syphilis</th>
            <th style={th}>Overall</th>
          </tr>
        </thead>

        <tbody>
          {tests.length > 0 ? (
            tests.map((t) => (
              <tr key={t.testId}>
                <td style={td}>{t.testId}</td>
                <td style={td}>{t.donation?.donationId}</td>

                <td style={td}><span style={badge(t.hiv)}>{t.hiv}</span></td>
                <td style={td}><span style={badge(t.hepatitisB)}>{t.hepatitisB}</span></td>
                <td style={td}><span style={badge(t.hepatitisC)}>{t.hepatitisC}</span></td>
                <td style={td}><span style={badge(t.malaria)}>{t.malaria}</span></td>
                <td style={td}><span style={badge(t.syphilis)}>{t.syphilis}</span></td>

                <td style={td}>
                  <span style={badge(convertOverall(t.overallResult))}>
                    {t.overallResult}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ================= STYLES =================
const container = { padding: "30px" };

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "10px",
  margin: "10px 0"
};

const input = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%"
};

const btn = {
  marginTop: "10px",
  padding: "10px",
  background: "#ff3b3b",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const th = {
  padding: "12px",
  background: "#f4f6fb",
  borderBottom: "1px solid #ddd"
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee"
};

// ================= BADGE =================
function badge(status) {
  if (status === "NEGATIVE")
    return { background: "#ffe5e5", color: "#d32f2f", padding: "5px 10px", borderRadius: "20px" };

  if (status === "POSITIVE")
    return { background: "#e6f7e6", color: "#2e7d32", padding: "5px 10px", borderRadius: "20px" };

  return { background: "#fff3cd", color: "#ff9800", padding: "5px 10px", borderRadius: "20px" };
}

function convertOverall(status) {
  if (status === "SAFE") return "POSITIVE";
  if (status === "UNSAFE") return "NEGATIVE";
  return "PENDING";
}

function getColor(status) {
  if (status === "SAFE") return "green";
  if (status === "UNSAFE") return "red";
  return "orange";
}