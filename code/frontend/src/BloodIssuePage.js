import React, { useEffect, useState } from "react";

function BloodIssuePage() {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    const res = await fetch("http://localhost:8080/api/issues");
    const data = await res.json();
    setIssues(data);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🩸 Blood Issue History</h2>

      <table style={table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Request</th>
            <th>Blood</th>
            <th>Component</th>
            <th>Quantity</th>
            <th>Hospital</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {issues.map((i) => (
            <tr key={i.issueId}>
              <td>{i.issueId}</td>
              <td>{i.requestId}</td>
              <td>{i.bloodGroup}</td>
              <td>{i.componentType}</td>
              <td>{i.quantity}</td>
              <td>{i.hospitalName}</td>
              <td>{i.issueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BloodIssuePage;

const table = {
  width: "100%",
  borderCollapse: "collapse"
};