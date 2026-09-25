import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api";

const ISSUE_API = "/api/blood-issues";
const REQUEST_API = "/api/requests";

const EMPTY_FORM = {
  requestId: "",
  componentType: "",
  quantity: ""
};

export default function BloodIssuePage() {
  const [issues, setIssues] = useState([]);
  const [requests, setRequests] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ISSUE HISTORY
  // =========================================================

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);

      const data = await apiFetch(ISSUE_API);

      setIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch blood issues error:", err);
      setIssues([]);
      setError(err.message || "Unable to load blood issue history.");
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // FETCH APPROVED REQUESTS
  // =========================================================

  const fetchRequests = useCallback(async () => {
    try {
      const data = await apiFetch(REQUEST_API);

      const allRequests = Array.isArray(data) ? data : [];

      setRequests(
        allRequests.filter(
          (request) =>
            request.requestStatus === "APPROVED"
        )
      );
    } catch (err) {
      console.error("Fetch requests error:", err);
      setRequests([]);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
    fetchRequests();
  }, [fetchIssues, fetchRequests]);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // =========================================================
  // SELECT REQUEST
  // =========================================================

  const selectedRequest = useMemo(() => {
    return requests.find(
      (request) =>
        String(request.requestId) ===
        String(form.requestId)
    );
  }, [requests, form.requestId]);

  // =========================================================
  // CREATE ISSUE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.requestId) {
      setError("Please select a blood request.");
      return;
    }

    if (!form.componentType) {
      setError("Please select a blood component.");
      return;
    }

    if (
      !form.quantity ||
      Number(form.quantity) <= 0
    ) {
      setError("Quantity must be greater than 0.");
      return;
    }

    if (selectedRequest) {
      const required =
        Number(selectedRequest.unitsRequired || 0);

      if (Number(form.quantity) > required) {
        setError(
          `Quantity cannot exceed the requested ${required} units.`
        );
        return;
      }
    }

    try {
      setSaving(true);

      const payload = {
        requestId: Number(form.requestId),
        componentType: form.componentType,
        quantity: Number(form.quantity)
      };

      console.log("CREATING BLOOD ISSUE:", payload);

      const result = await apiFetch(ISSUE_API, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      console.log("BLOOD ISSUE CREATED:", result);

      setMessage(
        "Blood issued successfully."
      );

      setForm(EMPTY_FORM);

      await fetchIssues();
      await fetchRequests();

    } catch (err) {
      console.error("Create blood issue error:", err);

      setError(
        err.message ||
        "Unable to issue blood."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredIssues = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return issues;
    }

    return issues.filter((issue) => {

      const values = [
        issue.issueId,
        issue.requestId,
        issue.bloodGroup,
        issue.componentType,
        issue.quantity,
        issue.hospitalName,
        issue.issueDate
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [issues, search]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalIssues = issues.length;

  const totalQuantity = issues.reduce(
    (sum, issue) =>
      sum + Number(issue.quantity || 0),
    0
  );

  const emergencyIssues = issues.filter(
    (issue) =>
      issue.urgencyLevel === "EMERGENCY"
  ).length;

  const approvedRequests = requests.length;

  // =========================================================
  // HELPERS
  // =========================================================

  const formatBloodGroup = (group) => {
    if (!group) return "-";

    return String(group)
      .replace("_POSITIVE", "+")
      .replace("_NEGATIVE", "-")
      .replace("POSITIVE", "+")
      .replace("NEGATIVE", "-");
  };

  const componentName = (type) => {
    switch (type) {
      case "RBC":
        return "Red Blood Cells";

      case "PLASMA":
        return "Plasma";

      case "PLATELETS":
        return "Platelets";

      case "CRYOPRECIPITATE":
        return "Cryoprecipitate";

      case "WHOLE_BLOOD":
        return "Whole Blood";

      default:
        return type || "-";
    }
  };

  const componentIcon = (type) => {
    switch (type) {
      case "RBC":
        return "🩸";

      case "PLASMA":
        return "💧";

      case "PLATELETS":
        return "🟡";

      case "CRYOPRECIPITATE":
        return "❄️";

      case "WHOLE_BLOOD":
        return "🩸";

      default:
        return "🧪";
    }
  };

  const componentClass = (type) => {
    switch (type) {
      case "RBC":
        return "component-rbc";

      case "PLASMA":
        return "component-plasma";

      case "PLATELETS":
        return "component-platelets";

      case "CRYOPRECIPITATE":
        return "component-cryo";

      case "WHOLE_BLOOD":
        return "component-whole";

      default:
        return "component-default";
    }
  };

  const bloodClass = (group) => {
    const value = String(group || "");

    if (value.startsWith("A")) {
      return "blood-a";
    }

    if (value.startsWith("B")) {
      return "blood-b";
    }

    if (value.startsWith("AB")) {
      return "blood-ab";
    }

    if (value.startsWith("O")) {
      return "blood-o";
    }

    return "blood-default";
  };

  const getIssueRequestId = (issue) => {
    return (
      issue.requestId ??
      issue.request?.requestId ??
      ""
    );
  };

  const getIssueHospital = (issue) => {
    return (
      issue.hospitalName ??
      issue.hospital?.hospitalName ??
      issue.request?.hospitalName ??
      issue.request?.hospital?.hospitalName ??
      "-"
    );
  };

  const getIssueBloodGroup = (issue) => {
    return (
      issue.bloodGroup ??
      issue.request?.bloodGroup ??
      ""
    );
  };

  const getIssueUrgency = (issue) => {
    return (
      issue.urgencyLevel ??
      issue.request?.urgencyLevel ??
      ""
    );
  };

  const getIssueDate = (issue) => {
    return (
      issue.issueDate ??
      issue.issuedDate ??
      issue.createdAt ??
      "-"
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="blood-issue-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .blood-issue-page {
          min-height: 100vh;

          padding: 30px;

          background:
            linear-gradient(
              135deg,
              #f7f8fc 0%,
              #eef2f7 100%
            );

          font-family:
            Inter,
            "Segoe UI",
            Arial,
            sans-serif;

          color: #172033;
        }

        /* =====================================================
           HEADER
           ===================================================== */

        .issue-header {
          position: relative;

          overflow: hidden;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 28px 30px;

          margin-bottom: 22px;

          border-radius: 20px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #7f101b,
              #b91c2c 55%,
              #e03445
            );

          box-shadow:
            0 15px 35px
            rgba(127,16,27,.20);
        }

        .issue-header::before {
          content: "";

          position: absolute;

          width: 260px;
          height: 260px;

          right: -90px;
          top: -140px;

          border-radius: 50%;

          background:
            rgba(255,255,255,.08);
        }

        .issue-header-content {
          position: relative;
          z-index: 2;

          display: flex;

          align-items: center;

          gap: 17px;
        }

        .issue-header-icon {
          width: 64px;
          height: 64px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 17px;

          background:
            rgba(255,255,255,.14);

          border:
            1px solid
            rgba(255,255,255,.20);

          font-size: 31px;
        }

        .issue-header h1 {
          margin: 0;

          font-size: 29px;

          font-weight: 850;
        }

        .issue-header p {
          margin: 6px 0 0;

          font-size: 13px;

          opacity: .82;
        }

        .issue-live {
          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;

          gap: 8px;

          padding: 9px 13px;

          border-radius: 999px;

          background:
            rgba(255,255,255,.12);

          font-size: 10px;

          font-weight: 800;
        }

        .live-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #86efac;

          box-shadow:
            0 0 0 4px
            rgba(134,239,172,.12);
        }

        /* =====================================================
           ALERTS
           ===================================================== */

        .issue-alert {
          display: flex;

          align-items: center;

          gap: 10px;

          padding: 13px 15px;

          margin-bottom: 20px;

          border-radius: 11px;

          font-size: 12px;

          font-weight: 650;
        }

        .issue-success {
          color: #047857;

          background: #ecfdf5;

          border:
            1px solid #a7f3d0;
        }

        .issue-error {
          color: #b91c1c;

          background: #fef2f2;

          border:
            1px solid #fecaca;
        }

        .alert-circle {
          width: 27px;
          height: 27px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: white;

          font-weight: 850;
        }

        .alert-success-icon {
          background: #059669;
        }

        .alert-error-icon {
          background: #dc2626;
        }

        /* =====================================================
           STATS
           ===================================================== */

        .issue-stats {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 15px;

          margin-bottom: 22px;
        }

        .issue-stat {
          padding: 18px;

          background: white;

          border:
            1px solid #e4e8ef;

          border-radius: 16px;

          box-shadow:
            0 5px 18px
            rgba(15,23,42,.045);

          transition: .2s;
        }

        .issue-stat:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 10px 25px
            rgba(15,23,42,.08);
        }

        .stat-head {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-bottom: 9px;
        }

        .stat-icon {
          width: 40px;
          height: 40px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-size: 18px;
        }

        .red-icon {
          background: #fff1f2;
        }

        .blue-icon {
          background: #eff6ff;
        }

        .orange-icon {
          background: #fff7ed;
        }

        .green-icon {
          background: #ecfdf5;
        }

        .stat-label {
          color: #94a3b8;

          font-size: 9px;

          font-weight: 850;

          letter-spacing: .6px;
        }

        .stat-value {
          font-size: 26px;

          font-weight: 850;
        }

        .stat-description {
          margin-top: 3px;

          color: #94a3b8;

          font-size: 10px;
        }

        /* =====================================================
           FORM
           ===================================================== */

        .issue-form-card {
          margin-bottom: 22px;

          overflow: hidden;

          background: white;

          border:
            1px solid #e4e8ef;

          border-radius: 18px;

          box-shadow:
            0 6px 22px
            rgba(15,23,42,.05);
        }

        .form-title {
          display: flex;

          align-items: center;

          gap: 13px;

          padding: 21px 25px;

          border-bottom:
            1px solid #eef1f5;
        }

        .form-title-icon {
          width: 43px;
          height: 43px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background: #fff1f2;

          font-size: 20px;
        }

        .form-title h2 {
          margin: 0;

          font-size: 17px;

          font-weight: 800;
        }

        .form-title p {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 11px;
        }

        .issue-form {
          padding: 23px 25px;
        }

        .form-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 16px;
        }

        .field {
          display: flex;

          flex-direction: column;

          gap: 7px;
        }

        .field label {
          color: #475569;

          font-size: 10px;

          font-weight: 800;
        }

        .required {
          color: #dc2626;
        }

        .field input,
        .field select {
          width: 100%;

          height: 44px;

          padding: 0 13px;

          border:
            1px solid #dce2e9;

          border-radius: 10px;

          background: #f8fafc;

          color: #172033;

          font-family: inherit;

          font-size: 12px;

          outline: none;

          transition: .2s;
        }

        .field input:focus,
        .field select:focus {
          background: white;

          border-color: #dc2626;

          box-shadow:
            0 0 0 3px
            rgba(220,38,38,.07);
        }

        .request-preview {
          grid-column: span 2;

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 10px;

          padding: 14px;

          border-radius: 11px;

          background: #f8fafc;

          border:
            1px solid #e8edf2;
        }

        .preview-item {
          display: flex;

          flex-direction: column;

          gap: 3px;
        }

        .preview-label {
          color: #94a3b8;

          font-size: 8px;

          font-weight: 800;

          text-transform: uppercase;
        }

        .preview-value {
          color: #334155;

          font-size: 11px;

          font-weight: 800;
        }

        .blood-preview {
          display: inline-flex;

          width: fit-content;

          padding: 4px 8px;

          border-radius: 6px;

          font-size: 10px;

          font-weight: 850;
        }

        .form-buttons {
          display: flex;

          gap: 9px;

          margin-top: 20px;
        }

        .issue-button {
          height: 43px;

          padding: 0 20px;

          border: none;

          border-radius: 10px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #b91c2c,
              #dc3545
            );

          font-family: inherit;

          font-size: 11px;

          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 6px 14px
            rgba(185,28,44,.18);
        }

        .issue-button:hover {
          transform:
            translateY(-1px);
        }

        .issue-button:disabled {
          opacity: .6;

          cursor: not-allowed;

          transform: none;
        }

        .clear-button {
          height: 43px;

          padding: 0 18px;

          border:
            1px solid #dce2e9;

          border-radius: 10px;

          background: white;

          color: #64748b;

          font-family: inherit;

          font-size: 11px;

          font-weight: 750;

          cursor: pointer;
        }

        /* =====================================================
           HISTORY
           ===================================================== */

        .history-card {
          overflow: hidden;

          background: white;

          border:
            1px solid #e4e8ef;

          border-radius: 18px;

          box-shadow:
            0 6px 22px
            rgba(15,23,42,.05);
        }

        .history-heading {
          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 22px 25px 17px;
        }

        .history-heading-left {
          display: flex;

          align-items: center;

          gap: 13px;
        }

        .history-icon {
          width: 43px;
          height: 43px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background: #fff1f2;

          font-size: 20px;
        }

        .history-heading h2 {
          margin: 0;

          font-size: 17px;

          font-weight: 800;
        }

        .history-heading p {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 11px;
        }

        .record-count {
          padding: 7px 11px;

          border-radius: 8px;

          background: #f1f5f9;

          color: #475569;

          font-size: 10px;

          font-weight: 800;
        }

        /* =====================================================
           TOOLBAR
           ===================================================== */

        .history-toolbar {
          display: flex;

          gap: 10px;

          padding:
            0 25px 18px;
        }

        .search-box {
          position: relative;

          flex: 1;
        }

        .search-symbol {
          position: absolute;

          left: 13px;

          top: 50%;

          transform:
            translateY(-50%);

          color: #94a3b8;
        }

        .search-box input {
          width: 100%;

          height: 42px;

          padding:
            0 13px 0 37px;

          border:
            1px solid #dce2e9;

          border-radius: 10px;

          background: #f8fafc;

          font-family: inherit;

          font-size: 11px;

          outline: none;
        }

        .search-box input:focus {
          background: white;

          border-color: #dc2626;
        }

        .refresh-button {
          height: 42px;

          padding: 0 15px;

          border:
            1px solid #dce2e9;

          border-radius: 10px;

          background: white;

          color: #64748b;

          font-family: inherit;

          font-size: 11px;

          font-weight: 750;

          cursor: pointer;
        }

        /* =====================================================
           TABLE
           ===================================================== */

        .table-scroll {
          overflow-x: auto;
        }

        .issue-table {
          width: 100%;

          min-width: 1050px;

          border-collapse: collapse;
        }

        .issue-table th {
          padding:
            14px 15px;

          background: #fafbfc;

          border-top:
            1px solid #eef1f5;

          border-bottom:
            1px solid #e8edf2;

          color: #718096;

          text-align: left;

          font-size: 9px;

          font-weight: 850;

          text-transform: uppercase;

          letter-spacing: .6px;
        }

        .issue-table td {
          padding: 15px;

          border-bottom:
            1px solid #f0f2f5;

          color: #475569;

          font-size: 11px;

          vertical-align: middle;
        }

        .issue-table tbody tr {
          transition: .15s;
        }

        .issue-table tbody tr:hover {
          background: #fffafa;
        }

        .issue-id {
          color: #172033;

          font-weight: 850;
        }

        .request-badge {
          display: inline-flex;

          padding: 5px 9px;

          border-radius: 7px;

          background: #eff6ff;

          color: #2563eb;

          font-weight: 800;

          font-size: 10px;
        }

        .blood-badge {
          display: inline-flex;

          align-items: center;

          gap: 5px;

          padding: 6px 9px;

          border-radius: 7px;

          font-size: 10px;

          font-weight: 850;
        }

        .blood-a {
          background: #fef2f2;

          color: #b91c1c;
        }

        .blood-b {
          background: #fff7ed;

          color: #c2410c;
        }

        .blood-ab {
          background: #faf5ff;

          color: #7e22ce;
        }

        .blood-o {
          background: #eff6ff;

          color: #1d4ed8;
        }

        .blood-default {
          background: #f1f5f9;

          color: #64748b;
        }

        .component-badge {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 6px 10px;

          border-radius: 999px;

          font-size: 9px;

          font-weight: 850;
        }

        .component-rbc {
          background: #fef2f2;

          color: #dc2626;
        }

        .component-plasma {
          background: #eff6ff;

          color: #2563eb;
        }

        .component-platelets {
          background: #fffbeb;

          color: #b45309;
        }

        .component-cryo {
          background: #f0fdfa;

          color: #0f766e;
        }

        .component-whole {
          background: #fff1f2;

          color: #be123c;
        }

        .component-default {
          background: #f1f5f9;

          color: #64748b;
        }

        .quantity {
          color: #172033;

          font-size: 13px;

          font-weight: 850;
        }

        .hospital {
          color: #334155;

          font-weight: 700;
        }

        .date {
          color: #64748b;

          white-space: nowrap;

          font-size: 10px;
        }

        .urgency {
          display: inline-flex;

          padding: 5px 9px;

          border-radius: 999px;

          background: #fff7ed;

          color: #c2410c;

          font-size: 8px;

          font-weight: 850;
        }

        /* =====================================================
           EMPTY
           ===================================================== */

        .empty-state {
          min-height: 260px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          color: #94a3b8;
        }

        .empty-icon {
          width: 60px;
          height: 60px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #fff1f2;

          font-size: 25px;
        }

        .empty-state h3 {
          margin:
            13px 0 4px;

          color: #334155;

          font-size: 14px;
        }

        .empty-state p {
          margin: 0;

          font-size: 11px;
        }

        .spinner {
          width: 32px;
          height: 32px;

          border:
            3px solid #fee2e2;

          border-top-color:
            #dc2626;

          border-radius: 50%;

          animation:
            spin .8s linear infinite;
        }

        @keyframes spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        /* =====================================================
           RESPONSIVE
           ===================================================== */

        @media (max-width: 1000px) {

          .issue-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .form-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .request-preview {
            grid-column: span 2;
          }

        }

        @media (max-width: 650px) {

          .blood-issue-page {
            padding: 15px;
          }

          .issue-header {
            padding: 22px;
          }

          .issue-live {
            display: none;
          }

          .issue-stats {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .request-preview {
            grid-column: span 1;

            grid-template-columns:
              1fr;
          }

          .history-toolbar {
            flex-direction: column;
          }

        }

      `}</style>


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="issue-header">

        <div className="issue-header-content">

          <div className="issue-header-icon">
            🩸
          </div>

          <div>

            <h1>
              Blood Issue Management
            </h1>

            <p>
              Safely issue approved blood requests
              and maintain complete issue history.
            </p>

          </div>

        </div>

        <div className="issue-live">

          <span className="live-dot"></span>

          Blood Issue System

        </div>

      </div>


      {/* =====================================================
          ALERTS
          ===================================================== */}

      {message && (

        <div className="
          issue-alert
          issue-success
        ">

          <span className="
            alert-circle
            alert-success-icon
          ">
            ✓
          </span>

          {message}

        </div>

      )}

      {error && (

        <div className="
          issue-alert
          issue-error
        ">

          <span className="
            alert-circle
            alert-error-icon
          ">
            !
          </span>

          {error}

        </div>

      )}


      {/* =====================================================
          STATISTICS
          ===================================================== */}

      <div className="issue-stats">

        <div className="issue-stat">

          <div className="stat-head">

            <div className="
              stat-icon
              red-icon
            ">
              🩸
            </div>

            <span className="stat-label">
              TOTAL ISSUES
            </span>

          </div>

          <div className="stat-value">
            {totalIssues}
          </div>

          <div className="stat-description">
            Blood issue records
          </div>

        </div>


        <div className="issue-stat">

          <div className="stat-head">

            <div className="
              stat-icon
              blue-icon
            ">
              🧪
            </div>

            <span className="stat-label">
              UNITS ISSUED
            </span>

          </div>

          <div className="stat-value">
            {totalQuantity}
          </div>

          <div className="stat-description">
            Total blood units issued
          </div>

        </div>


        <div className="issue-stat">

          <div className="stat-head">

            <div className="
              stat-icon
              orange-icon
            ">
              🚨
            </div>

            <span className="stat-label">
              EMERGENCY
            </span>

          </div>

          <div className="stat-value">
            {emergencyIssues}
          </div>

          <div className="stat-description">
            Emergency issues
          </div>

        </div>


        <div className="issue-stat">

          <div className="stat-head">

            <div className="
              stat-icon
              green-icon
            ">
              ✓
            </div>

            <span className="stat-label">
              APPROVED REQUESTS
            </span>

          </div>

          <div className="stat-value">
            {approvedRequests}
          </div>

          <div className="stat-description">
            Available for issue
          </div>

        </div>

      </div>


      {/* =====================================================
          ISSUE FORM
          ===================================================== */}

      <div className="issue-form-card">

        <div className="form-title">

          <div className="form-title-icon">
            🩸
          </div>

          <div>

            <h2>
              Issue Blood
            </h2>

            <p>
              Select an approved hospital request
              and enter the issued component.
            </p>

          </div>

        </div>


        <form
          className="issue-form"
          onSubmit={handleSubmit}
        >

          <div className="form-grid">

            {/* REQUEST */}

            <div className="field">

              <label>
                Approved Blood Request
                <span className="required">
                  {" "}*
                </span>
              </label>

              <select
                name="requestId"
                value={form.requestId}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select approved request
                </option>

                {requests.map((request) => (

                  <option
                    key={request.requestId}
                    value={request.requestId}
                  >

                    Request #
                    {request.requestId}

                    {" — "}

                    {request.patientName ||
                      "Patient"}

                    {" — "}

                    {request.bloodGroup ||
                      "Blood"}

                  </option>

                ))}

              </select>

            </div>


            {/* COMPONENT */}

            <div className="field">

              <label>
                Blood Component
                <span className="required">
                  {" "}*
                </span>
              </label>

              <select
                name="componentType"
                value={form.componentType}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select component
                </option>

                <option value="RBC">
                  🩸 RBC
                </option>

                <option value="PLASMA">
                  💧 Plasma
                </option>

                <option value="PLATELETS">
                  🟡 Platelets
                </option>

                <option value="CRYOPRECIPITATE">
                  ❄️ Cryoprecipitate
                </option>

                <option value="WHOLE_BLOOD">
                  🩸 Whole Blood
                </option>

              </select>

            </div>


            {/* QUANTITY */}

            <div className="field">

              <label>
                Quantity
                <span className="required">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Enter units"
                min="1"
                step="1"
                required
              />

            </div>


            {/* REQUEST PREVIEW */}

            {selectedRequest && (

              <div className="request-preview">

                <div className="preview-item">

                  <span className="
                    preview-label
                  ">
                    Patient
                  </span>

                  <span className="
                    preview-value
                  ">
                    {selectedRequest.patientName ||
                      "-"}
                  </span>

                </div>


                <div className="preview-item">

                  <span className="
                    preview-label
                  ">
                    Blood Group
                  </span>

                  <span
                    className={`
                      blood-preview
                      ${bloodClass(
                        selectedRequest.bloodGroup
                      )}
                    `}
                  >
                    🩸
                    {" "}
                    {formatBloodGroup(
                      selectedRequest.bloodGroup
                    )}
                  </span>

                </div>


                <div className="preview-item">

                  <span className="
                    preview-label
                  ">
                    Requested Units
                  </span>

                  <span className="
                    preview-value
                  ">
                    {
                      selectedRequest.unitsRequired ??
                      0
                    }
                    {" "}units
                  </span>

                </div>


                <div className="preview-item">

                  <span className="
                    preview-label
                  ">
                    Hospital
                  </span>

                  <span className="
                    preview-value
                  ">
                    {
                      selectedRequest.hospitalName ??
                      selectedRequest.hospitalId ??
                      "-"
                    }
                  </span>

                </div>


                <div className="preview-item">

                  <span className="
                    preview-label
                  ">
                    Urgency
                  </span>

                  <span className="
                    preview-value
                  ">
                    {selectedRequest.urgencyLevel ||
                      "-"}
                  </span>

                </div>


                <div className="preview-item">

                  <span className="
                    preview-label
                  ">
                    Status
                  </span>

                  <span className="
                    preview-value
                  ">
                    ✓ APPROVED
                  </span>

                </div>

              </div>

            )}

          </div>


          <div className="form-buttons">

            <button
              type="submit"
              className="issue-button"
              disabled={saving}
            >
              {saving
                ? "Issuing..."
                : "🩸 Issue Blood"}
            </button>

            <button
              type="button"
              className="clear-button"
              onClick={() => {
                setForm(EMPTY_FORM);
                setError("");
                setMessage("");
              }}
            >
              Clear
            </button>

          </div>

        </form>

      </div>


      {/* =====================================================
          HISTORY
          ===================================================== */}

      <div className="history-card">

        <div className="history-heading">

          <div className="history-heading-left">

            <div className="history-icon">
              📋
            </div>

            <div>

              <h2>
                Blood Issue History
              </h2>

              <p>
                Complete record of blood issued
                to hospitals and patients.
              </p>

            </div>

          </div>

          <div className="record-count">

            {filteredIssues.length}
            {" "}records

          </div>

        </div>


        {/* SEARCH */}

        <div className="history-toolbar">

          <div className="search-box">

            <span className="search-symbol">
              🔍
            </span>

            <input
              type="text"
              placeholder="
                Search issue, request, blood group,
                hospital or component...
              "
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <button
            className="refresh-button"
            onClick={() => {
              fetchIssues();
              fetchRequests();
            }}
          >
            ↻ Refresh
          </button>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="empty-state">

            <div className="spinner"></div>

            <h3>
              Loading issue history...
            </h3>

            <p>
              Please wait.
            </p>

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          filteredIssues.length === 0 && (

            <div className="empty-state">

              <div className="empty-icon">
                🩸
              </div>

              <h3>
                No blood issues found
              </h3>

              <p>
                Issued blood records will
                appear here.
              </p>

            </div>

          )}


        {/* TABLE */}

        {!loading &&
          filteredIssues.length > 0 && (

            <div className="table-scroll">

              <table className="issue-table">

                <thead>

                  <tr>

                    <th>
                      Issue ID
                    </th>

                    <th>
                      Request
                    </th>

                    <th>
                      Blood
                    </th>

                    <th>
                      Component
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Hospital
                    </th>

                    <th>
                      Urgency
                    </th>

                    <th>
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredIssues.map(
                    (issue) => {

                      const bloodGroup =
                        getIssueBloodGroup(issue);

                      const component =
                        issue.componentType;

                      return (

                        <tr
                          key={issue.issueId}
                        >

                          {/* ID */}

                          <td>

                            <span className="
                              issue-id
                            ">
                              #
                              {issue.issueId}
                            </span>

                          </td>


                          {/* REQUEST */}

                          <td>

                            <span className="
                              request-badge
                            ">
                              #
                              {getIssueRequestId(
                                issue
                              )}
                            </span>

                          </td>


                          {/* BLOOD */}

                          <td>

                            <span
                              className={`
                                blood-badge
                                ${bloodClass(
                                  bloodGroup
                                )}
                              `}
                            >

                              🩸

                              {formatBloodGroup(
                                bloodGroup
                              )}

                            </span>

                          </td>


                          {/* COMPONENT */}

                          <td>

                            <span
                              className={`
                                component-badge
                                ${componentClass(
                                  component
                                )}
                              `}
                            >

                              {componentIcon(
                                component
                              )}

                              {componentName(
                                component
                              )}

                            </span>

                          </td>


                          {/* QUANTITY */}

                          <td>

                            <span className="
                              quantity
                            ">
                              {issue.quantity ?? 0}
                            </span>

                            <span
                              style={{
                                marginLeft: "4px",
                                color: "#94a3b8",
                                fontSize: "9px"
                              }}
                            >
                              units
                            </span>

                          </td>


                          {/* HOSPITAL */}

                          <td>

                            <span className="
                              hospital
                            ">
                              {getIssueHospital(
                                issue
                              )}
                            </span>

                          </td>


                          {/* URGENCY */}

                          <td>

                            {getIssueUrgency(
                              issue
                            ) ? (

                              <span className="
                                urgency
                              ">
                                {getIssueUrgency(
                                  issue
                                )}
                              </span>

                            ) : (
                              "-"
                            )}

                          </td>


                          {/* DATE */}

                          <td>

                            <span className="
                              date
                            ">
                              {getIssueDate(
                                issue
                              )}
                            </span>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

      </div>

    </div>
  );
}