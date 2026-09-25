import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api";

const API = "/api/requests";

const EMPTY_FORM = {
  hospitalId: "",
  requestedBy: "",
  patientName: "",
  bloodGroup: "",
  componentType: "",
  unitsRequired: "",
  urgencyLevel: "",
  remarks: ""
};

export default function BloodRequestPage() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  // =========================================================
  // FETCH REQUESTS
  // =========================================================

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch(API);

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch requests error:", err);
      setRequests([]);
      setError(err.message || "Unable to load blood requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================================================
  // CREATE REQUEST
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !form.hospitalId ||
      !form.requestedBy ||
      !form.patientName ||
      !form.bloodGroup ||
      !form.componentType ||
      !form.unitsRequired ||
      !form.urgencyLevel
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (Number(form.unitsRequired) <= 0) {
      setError("Units required must be greater than 0.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiFetch(API, {
        method: "POST",
        body: JSON.stringify({
          hospitalId: Number(form.hospitalId),
          requestedBy: Number(form.requestedBy),
          patientName: form.patientName.trim(),
          bloodGroup: form.bloodGroup,
          componentType: form.componentType,
          unitsRequired: Number(form.unitsRequired),
          urgencyLevel: form.urgencyLevel,
          remarks: form.remarks.trim()
        })
      });

      setMessage(
        typeof response === "string"
          ? response
          : "Blood request submitted successfully."
      );

      setForm(EMPTY_FORM);

      await fetchRequests();
    } catch (err) {
      console.error("Create request error:", err);
      setError(err.message || "Unable to create blood request.");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // APPROVE
  // =========================================================

  const approve = async (id) => {
    try {
      setError("");
      setMessage("");

      await apiFetch(`${API}/${id}/approve`, {
        method: "PUT"
      });

      setMessage("Blood request approved successfully.");

      await fetchRequests();
    } catch (err) {
      console.error("Approve error:", err);
      setError(err.message || "Unable to approve request.");
    }
  };

  // =========================================================
  // REJECT
  // =========================================================

  const reject = async (id) => {
    try {
      setError("");
      setMessage("");

      await apiFetch(`${API}/${id}/reject`, {
        method: "PUT"
      });

      setMessage("Blood request rejected.");

      await fetchRequests();
    } catch (err) {
      console.error("Reject error:", err);
      setError(err.message || "Unable to reject request.");
    }
  };

  // =========================================================
  // FILTERING
  // =========================================================

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        String(request.requestId ?? "")
          .toLowerCase()
          .includes(query) ||
        String(request.hospitalId ?? "")
          .toLowerCase()
          .includes(query) ||
        String(request.patientName ?? "")
          .toLowerCase()
          .includes(query) ||
        String(request.bloodGroup ?? "")
          .toLowerCase()
          .includes(query) ||
        String(request.componentType ?? "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        !statusFilter ||
        request.requestStatus === statusFilter;

      const matchesUrgency =
        !urgencyFilter ||
        request.urgencyLevel === urgencyFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesUrgency
      );
    });
  }, [
    requests,
    search,
    statusFilter,
    urgencyFilter
  ]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (r) => r.requestStatus === "PENDING"
  ).length;

  const approvedRequests = requests.filter(
    (r) => r.requestStatus === "APPROVED"
  ).length;

  const emergencyRequests = requests.filter(
    (r) => r.urgencyLevel === "EMERGENCY"
  ).length;

  // =========================================================
  // HELPERS
  // =========================================================

  const bloodGroupClass = (group) => {
    if (!group) return "blood-neutral";

    if (
      group === "A+" ||
      group === "A-"
    ) {
      return "blood-a";
    }

    if (
      group === "B+" ||
      group === "B-"
    ) {
      return "blood-b";
    }

    if (
      group === "AB+" ||
      group === "AB-"
    ) {
      return "blood-ab";
    }

    return "blood-o";
  };

  const componentIcon = (component) => {
    switch (component) {
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

  const componentName = (component) => {
    switch (component) {
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
        return component || "-";
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "status-approved";

      case "REJECTED":
        return "status-rejected";

      default:
        return "status-pending";
    }
  };

  const urgencyClass = (urgency) => {
    switch (urgency) {
      case "EMERGENCY":
        return "urgency-emergency";

      case "HIGH":
        return "urgency-high";

      case "MEDIUM":
        return "urgency-medium";

      default:
        return "urgency-low";
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="blood-request-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .blood-request-page {
          min-height: 100vh;
          padding: 30px;
          background:
            linear-gradient(
              135deg,
              #f5f7fb 0%,
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

        .request-header {
          position: relative;
          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 28px 30px;
          margin-bottom: 24px;

          border-radius: 20px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #641018 0%,
              #991b2b 50%,
              #d52f3c 100%
            );

          box-shadow:
            0 14px 35px
            rgba(110, 20, 30, .20);
        }

        .request-header::before {
          content: "";

          position: absolute;

          width: 240px;
          height: 240px;

          right: -90px;
          top: -110px;

          border-radius: 50%;

          background:
            rgba(255,255,255,.07);
        }

        .request-header::after {
          content: "";

          position: absolute;

          width: 130px;
          height: 130px;

          right: 120px;
          bottom: -100px;

          border-radius: 50%;

          background:
            rgba(255,255,255,.05);
        }

        .request-header-content {
          display: flex;
          align-items: center;
          gap: 18px;

          position: relative;
          z-index: 2;
        }

        .request-header-icon {
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

        .request-breadcrumb {
          margin-bottom: 5px;

          font-size: 10px;
          font-weight: 850;

          letter-spacing: 1.7px;

          opacity: .70;
        }

        .request-breadcrumb span {
          margin: 0 7px;
        }

        .request-header h1 {
          margin: 0;

          font-size: 29px;
          font-weight: 850;
        }

        .request-header p {
          margin: 6px 0 0;

          font-size: 13px;

          opacity: .83;
        }

        .request-live {
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

        .request-live-dot {
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

        .request-alert {
          display: flex;
          align-items: center;
          gap: 11px;

          padding: 13px 15px;

          margin-bottom: 20px;

          border-radius: 11px;

          font-size: 12px;
          font-weight: 600;
        }

        .request-alert-success {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
        }

        .request-alert-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }

        .alert-icon {
          width: 27px;
          height: 27px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: white;

          font-weight: 850;
        }

        .success-icon {
          background: #059669;
        }

        .error-icon {
          background: #dc2626;
        }

        /* =====================================================
           STATISTICS
           ===================================================== */

        .request-stats {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 16px;

          margin-bottom: 24px;
        }

        .request-stat {
          background: white;

          padding: 19px;

          border:
            1px solid #e4e8ef;

          border-radius: 16px;

          box-shadow:
            0 5px 18px
            rgba(15,23,42,.045);

          transition: .2s;
        }

        .request-stat:hover {
          transform: translateY(-2px);

          box-shadow:
            0 10px 25px
            rgba(15,23,42,.08);
        }

        .stat-top {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 11px;
        }

        .stat-icon {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-size: 17px;
        }

        .stat-red {
          background: #fff1f2;
          color: #dc2626;
        }

        .stat-yellow {
          background: #fffbeb;
          color: #d97706;
        }

        .stat-green {
          background: #ecfdf5;
          color: #059669;
        }

        .stat-orange {
          background: #fff7ed;
          color: #ea580c;
        }

        .stat-label {
          color: #94a3b8;

          font-size: 9px;
          font-weight: 850;

          letter-spacing: .7px;
        }

        .stat-number {
          color: #172033;

          font-size: 27px;
          font-weight: 850;
        }

        .stat-description {
          margin-top: 4px;

          color: #94a3b8;

          font-size: 10px;
        }

        /* =====================================================
           FORM CARD
           ===================================================== */

        .request-form-card {
          margin-bottom: 24px;

          background: white;

          border:
            1px solid #e4e8ef;

          border-radius: 18px;

          box-shadow:
            0 6px 22px
            rgba(15,23,42,.05);

          overflow: hidden;
        }

        .form-heading {
          display: flex;
          align-items: center;
          gap: 13px;

          padding: 22px 26px 18px;

          border-bottom:
            1px solid #eef1f5;
        }

        .form-heading-icon {
          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background: #fff1f2;

          color: #c51f2a;

          font-size: 20px;
        }

        .form-heading h2 {
          margin: 0;

          font-size: 17px;
          font-weight: 800;
        }

        .form-heading p {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 11px;
        }

        .request-form {
          padding: 22px 26px 25px;
        }

        .form-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field-wide {
          grid-column: span 2;
        }

        .field label {
          color: #475569;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: .4px;
        }

        .required {
          color: #dc2626;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;

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

        .field input,
        .field select {
          height: 43px;

          padding: 0 13px;
        }

        .field textarea {
          min-height: 90px;

          padding: 12px 13px;

          resize: vertical;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          background: white;

          border-color: #dc2626;

          box-shadow:
            0 0 0 3px
            rgba(220,38,38,.07);
        }

        .form-actions {
          display: flex;
          align-items: center;

          gap: 10px;

          margin-top: 20px;
        }

        .submit-button {
          height: 43px;

          padding: 0 20px;

          border: none;

          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #b91c2c,
              #dc3545
            );

          color: white;

          font-family: inherit;

          font-size: 11px;
          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 6px 14px
            rgba(185,28,44,.18);

          transition: .2s;
        }

        .submit-button:hover {
          transform: translateY(-1px);

          box-shadow:
            0 9px 18px
            rgba(185,28,44,.25);
        }

        .submit-button:disabled {
          opacity: .65;
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

        .clear-button:hover {
          background: #f8fafc;
        }

        /* =====================================================
           TABLE CARD
           ===================================================== */

        .request-table-card {
          background: white;

          border:
            1px solid #e4e8ef;

          border-radius: 18px;

          box-shadow:
            0 6px 22px
            rgba(15,23,42,.05);

          overflow: hidden;
        }

        .table-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 23px 26px 18px;
        }

        .table-heading-left {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .table-heading-icon {
          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background: #eff6ff;

          color: #2563eb;

          font-size: 19px;
        }

        .table-heading h2 {
          margin: 0;

          font-size: 17px;
          font-weight: 800;
        }

        .table-heading p {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 11px;
        }

        .request-count {
          padding: 7px 11px;

          border-radius: 8px;

          background: #f1f5f9;

          color: #475569;

          font-size: 10px;
          font-weight: 800;
        }

        /* =====================================================
           TABLE TOOLBAR
           ===================================================== */

        .table-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;

          padding:
            0 26px 18px;
        }

        .search-wrapper {
          position: relative;

          flex: 1;
        }

        .search-icon {
          position: absolute;

          left: 13px;
          top: 50%;

          transform:
            translateY(-50%);

          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          height: 42px;

          padding:
            0 13px 0 37px;

          border:
            1px solid #dce2e9;

          border-radius: 10px;

          background: #f8fafc;

          font-family: inherit;
          font-size: 12px;

          outline: none;
        }

        .search-input:focus {
          background: white;

          border-color: #2563eb;

          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.07);
        }

        .table-filter {
          height: 42px;

          min-width: 135px;

          padding: 0 12px;

          border:
            1px solid #dce2e9;

          border-radius: 10px;

          background: white;

          color: #475569;

          font-family: inherit;

          font-size: 11px;
          font-weight: 650;

          outline: none;

          cursor: pointer;
        }

        .refresh-button {
          height: 42px;

          padding: 0 14px;

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

        .refresh-button:hover {
          background: #f8fafc;
        }

        /* =====================================================
           TABLE
           ===================================================== */

        .table-scroll {
          overflow-x: auto;
        }

        .request-table {
          width: 100%;

          min-width: 1100px;

          border-collapse: collapse;
        }

        .request-table th {
          padding:
            14px 15px;

          background: #f8fafc;

          border-top:
            1px solid #eef1f5;

          border-bottom:
            1px solid #e8edf2;

          color: #718096;

          text-align: left;

          font-size: 9px;

          font-weight: 850;

          text-transform: uppercase;

          letter-spacing: .65px;
        }

        .request-table td {
          padding: 15px;

          border-bottom:
            1px solid #f0f2f5;

          color: #475569;

          font-size: 11px;

          vertical-align: middle;
        }

        .request-table tbody tr {
          transition: .15s;
        }

        .request-table tbody tr:hover {
          background: #fffafa;
        }

        .request-id {
          color: #172033;
          font-weight: 850;
        }

        .hospital-id {
          display: inline-flex;

          padding: 5px 9px;

          border-radius: 7px;

          background: #eff6ff;

          color: #2563eb;

          font-weight: 800;
        }

        .patient-name {
          color: #172033;
          font-weight: 750;
        }

        .blood-badge {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          min-width: 40px;

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

        .blood-neutral {
          background: #f1f5f9;
          color: #64748b;
        }

        .component-badge {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 6px 10px;

          border-radius: 999px;

          background: #f1f5f9;

          color: #475569;

          font-size: 9px;
          font-weight: 800;
        }

        .units {
          color: #172033;
          font-size: 13px;
          font-weight: 850;
        }

        .units-label {
          margin-left: 4px;

          color: #94a3b8;

          font-size: 9px;
          font-weight: 600;
        }

        /* =====================================================
           URGENCY
           ===================================================== */

        .urgency-badge {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 6px 10px;

          border-radius: 999px;

          font-size: 8px;

          font-weight: 850;
        }

        .urgency-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: currentColor;
        }

        .urgency-low {
          background: #f1f5f9;
          color: #64748b;
        }

        .urgency-medium {
          background: #fffbeb;
          color: #b45309;
        }

        .urgency-high {
          background: #fff7ed;
          color: #c2410c;
        }

        .urgency-emergency {
          background: #fef2f2;
          color: #b91c1c;
        }

        /* =====================================================
           STATUS
           ===================================================== */

        .status-badge {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 6px 10px;

          border-radius: 999px;

          font-size: 8px;

          font-weight: 850;
        }

        .status-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: currentColor;
        }

        .status-approved {
          background: #ecfdf5;
          color: #047857;
        }

        .status-rejected {
          background: #fef2f2;
          color: #b91c1c;
        }

        .status-pending {
          background: #fffbeb;
          color: #b45309;
        }

        /* =====================================================
           ACTIONS
           ===================================================== */

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .approve-button,
        .reject-button {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;

          border-radius: 8px;

          color: white;

          font-size: 12px;
          font-weight: 850;

          cursor: pointer;

          transition: .15s;
        }

        .approve-button {
          background: #059669;
        }

        .approve-button:hover {
          background: #047857;
          transform: translateY(-1px);
        }

        .reject-button {
          background: #dc2626;
        }

        .reject-button:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        .approved-text {
          color: #059669;

          font-size: 10px;
          font-weight: 750;
        }

        .rejected-text {
          color: #dc2626;

          font-size: 10px;
          font-weight: 750;
        }

        .pending-text {
          color: #d97706;

          font-size: 10px;
          font-weight: 700;
        }

        /* =====================================================
           LOADING / EMPTY
           ===================================================== */

        .request-empty {
          min-height: 270px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          color: #94a3b8;
        }

        .empty-icon {
          width: 58px;
          height: 58px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #fff1f2;

          font-size: 25px;
        }

        .request-empty h3 {
          margin:
            13px 0 4px;

          color: #334155;

          font-size: 14px;
        }

        .request-empty p {
          margin: 0;

          font-size: 11px;
        }

        .spinner {
          width: 32px;
          height: 32px;

          border:
            3px solid #fee2e2;

          border-top-color:
            #c51f2a;

          border-radius: 50%;

          animation:
            request-spin
            .8s linear infinite;
        }

        @keyframes request-spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        /* =====================================================
           RESPONSIVE
           ===================================================== */

        @media (max-width: 1100px) {

          .request-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .form-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 750px) {

          .blood-request-page {
            padding: 18px;
          }

          .request-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .request-live {
            display: none;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .field-wide {
            grid-column: span 1;
          }

          .table-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .table-filter,
          .refresh-button {
            width: 100%;
          }

        }

        @media (max-width: 550px) {

          .blood-request-page {
            padding: 12px;
          }

          .request-stats {
            grid-template-columns: 1fr;
          }

          .request-header h1 {
            font-size: 23px;
          }

          .request-header-icon {
            width: 53px;
            height: 53px;
            font-size: 25px;
          }

          .request-form,
          .form-heading {
            padding-left: 18px;
            padding-right: 18px;
          }

          .table-heading,
          .table-toolbar {
            padding-left: 18px;
            padding-right: 18px;
          }

        }

      `}</style>


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="request-header">

        <div className="request-header-content">

          <div className="request-header-icon">
            🏥
          </div>

          <div>

            <div className="request-breadcrumb">
              BLOOD BANK
              <span>/</span>
              HOSPITAL SERVICES
            </div>

            <h1>
              Blood Requests
            </h1>

            <p>
              Create, monitor and process
              hospital blood requests.
            </p>

          </div>

        </div>

        <div className="request-live">

          <span className="request-live-dot"></span>

          Request Management

        </div>

      </div>


      {/* =====================================================
          ALERTS
          ===================================================== */}

      {message && (

        <div className="
          request-alert
          request-alert-success
        ">

          <div className="
            alert-icon
            success-icon
          ">
            ✓
          </div>

          <span>
            {message}
          </span>

        </div>

      )}

      {error && (

        <div className="
          request-alert
          request-alert-error
        ">

          <div className="
            alert-icon
            error-icon
          ">
            !
          </div>

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =====================================================
          STATISTICS
          ===================================================== */}

      <div className="request-stats">

        <div className="request-stat">

          <div className="stat-top">

            <div className="
              stat-icon
              stat-red
            ">
              🏥
            </div>

            <span className="stat-label">
              TOTAL REQUESTS
            </span>

          </div>

          <div className="stat-number">
            {totalRequests}
          </div>

          <div className="stat-description">
            All hospital requests
          </div>

        </div>


        <div className="request-stat">

          <div className="stat-top">

            <div className="
              stat-icon
              stat-yellow
            ">
              ⏳
            </div>

            <span className="stat-label">
              PENDING
            </span>

          </div>

          <div className="stat-number">
            {pendingRequests}
          </div>

          <div className="stat-description">
            Awaiting approval
          </div>

        </div>


        <div className="request-stat">

          <div className="stat-top">

            <div className="
              stat-icon
              stat-green
            ">
              ✓
            </div>

            <span className="stat-label">
              APPROVED
            </span>

          </div>

          <div className="stat-number">
            {approvedRequests}
          </div>

          <div className="stat-description">
            Approved requests
          </div>

        </div>


        <div className="request-stat">

          <div className="stat-top">

            <div className="
              stat-icon
              stat-orange
            ">
              🚨
            </div>

            <span className="stat-label">
              EMERGENCY
            </span>

          </div>

          <div className="stat-number">
            {emergencyRequests}
          </div>

          <div className="stat-description">
            Emergency requests
          </div>

        </div>

      </div>


      {/* =====================================================
          CREATE REQUEST
          ===================================================== */}

      <div className="request-form-card">

        <div className="form-heading">

          <div className="form-heading-icon">
            ➕
          </div>

          <div>

            <h2>
              Create Blood Request
            </h2>

            <p>
              Enter the hospital and patient
              requirements below.
            </p>

          </div>

        </div>


        <form
          className="request-form"
          onSubmit={handleSubmit}
        >

          <div className="form-grid">

            {/* HOSPITAL ID */}

            <div className="field">

              <label>
                Hospital ID
                <span className="required">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                name="hospitalId"
                value={form.hospitalId}
                onChange={handleChange}
                placeholder="Enter hospital ID"
                min="1"
                required
              />

            </div>


            {/* REQUESTED BY */}

            <div className="field">

              <label>
                Requested By
                <span className="required">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                name="requestedBy"
                value={form.requestedBy}
                onChange={handleChange}
                placeholder="Enter user ID"
                min="1"
                required
              />

            </div>


            {/* PATIENT */}

            <div className="field">

              <label>
                Patient Name
                <span className="required">
                  {" "}*
                </span>
              </label>

              <input
                type="text"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
              />

            </div>


            {/* BLOOD GROUP */}

            <div className="field">

              <label>
                Blood Group
                <span className="required">
                  {" "}*
                </span>
              </label>

              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select blood group
                </option>

                <option value="A+">
                  A+
                </option>

                <option value="A-">
                  A-
                </option>

                <option value="B+">
                  B+
                </option>

                <option value="B-">
                  B-
                </option>

                <option value="AB+">
                  AB+
                </option>

                <option value="AB-">
                  AB-
                </option>

                <option value="O+">
                  O+
                </option>

                <option value="O-">
                  O-
                </option>

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


            {/* UNITS */}

            <div className="field">

              <label>
                Units Required
                <span className="required">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                name="unitsRequired"
                value={form.unitsRequired}
                onChange={handleChange}
                placeholder="Number of units"
                min="1"
                step="1"
                required
              />

            </div>


            {/* URGENCY */}

            <div className="field">

              <label>
                Urgency Level
                <span className="required">
                  {" "}*
                </span>
              </label>

              <select
                name="urgencyLevel"
                value={form.urgencyLevel}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select urgency
                </option>

                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>

                <option value="EMERGENCY">
                  🚨 EMERGENCY
                </option>

              </select>

            </div>


            {/* REMARKS */}

            <div className="
              field
              field-wide
            ">

              <label>
                Remarks
              </label>

              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="
                  Enter additional information,
                  patient requirements or notes...
                "
              />

            </div>

          </div>


          {/* FORM BUTTONS */}

          <div className="form-actions">

            <button
              type="submit"
              className="submit-button"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "➕ Submit Blood Request"}
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
          REQUEST RECORDS
          ===================================================== */}

      <div className="request-table-card">

        <div className="table-heading">

          <div className="table-heading-left">

            <div className="table-heading-icon">
              ☷
            </div>

            <div>

              <h2>
                Blood Request Records
              </h2>

              <p>
                Review and process hospital
                blood requirements.
              </p>

            </div>

          </div>

          <div className="request-count">
            {filteredRequests.length}
            {" "}records
          </div>

        </div>


        {/* ===================================================
            FILTERS
            =================================================== */}

        <div className="table-toolbar">

          <div className="search-wrapper">

            <span className="search-icon">
              🔍
            </span>

            <input
              className="search-input"
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="
                Search request, hospital,
                patient or blood group...
              "
            />

          </div>


          <select
            className="table-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option value="">
              All Status
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="REJECTED">
              Rejected
            </option>

          </select>


          <select
            className="table-filter"
            value={urgencyFilter}
            onChange={(e) =>
              setUrgencyFilter(e.target.value)
            }
          >

            <option value="">
              All Urgency
            </option>

            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="EMERGENCY">
              Emergency
            </option>

          </select>


          <button
            className="refresh-button"
            onClick={fetchRequests}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>


        {/* ===================================================
            LOADING
            =================================================== */}

        {loading && (

          <div className="request-empty">

            <div className="spinner"></div>

            <h3>
              Loading requests...
            </h3>

            <p>
              Please wait while records
              are being loaded.
            </p>

          </div>

        )}


        {/* ===================================================
            EMPTY
            =================================================== */}

        {!loading &&
          filteredRequests.length === 0 && (

            <div className="request-empty">

              <div className="empty-icon">
                🏥
              </div>

              <h3>
                No blood requests found
              </h3>

              <p>
                There are no requests matching
                your current filters.
              </p>

            </div>

          )}


        {/* ===================================================
            TABLE
            =================================================== */}

        {!loading &&
          filteredRequests.length > 0 && (

            <div className="table-scroll">

              <table className="request-table">

                <thead>

                  <tr>

                    <th>
                      Request ID
                    </th>

                    <th>
                      Hospital
                    </th>

                    <th>
                      Patient
                    </th>

                    <th>
                      Blood
                    </th>

                    <th>
                      Component
                    </th>

                    <th>
                      Units
                    </th>

                    <th>
                      Urgency
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredRequests.map(
                    (request) => (

                      <tr
                        key={
                          request.requestId
                        }
                      >

                        {/* ID */}

                        <td>

                          <span className="
                            request-id
                          ">
                            #
                            {
                              request.requestId
                            }
                          </span>

                        </td>


                        {/* HOSPITAL */}

                        <td>

                          <span className="
                            hospital-id
                          ">
                            🏥
                            {" "}
                            {request.hospitalId}
                          </span>

                        </td>


                        {/* PATIENT */}

                        <td>

                          <span className="
                            patient-name
                          ">
                            {request.patientName ||
                              "N/A"}
                          </span>

                        </td>


                        {/* BLOOD */}

                        <td>

                          <span
                            className={`
                              blood-badge
                              ${bloodGroupClass(
                                request.bloodGroup
                              )}
                            `}
                          >
                            🩸
                            {" "}
                            {request.bloodGroup ||
                              "-"}
                          </span>

                        </td>


                        {/* COMPONENT */}

                        <td>

                          <span className="
                            component-badge
                          ">

                            {componentIcon(
                              request.componentType
                            )}

                            {
                              componentName(
                                request.componentType
                              )
                            }

                          </span>

                        </td>


                        {/* UNITS */}

                        <td>

                          <span className="units">
                            {
                              request.unitsRequired ??
                              0
                            }
                          </span>

                          <span className="
                            units-label
                          ">
                            units
                          </span>

                        </td>


                        {/* URGENCY */}

                        <td>

                          <span
                            className={`
                              urgency-badge
                              ${urgencyClass(
                                request.urgencyLevel
                              )}
                            `}
                          >

                            <span className="
                              urgency-dot
                            "></span>

                            {
                              request.urgencyLevel ||
                              "N/A"
                            }

                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`
                              status-badge
                              ${statusClass(
                                request.requestStatus
                              )}
                            `}
                          >

                            <span className="
                              status-dot
                            "></span>

                            {
                              request.requestStatus ||
                              "PENDING"
                            }

                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          {role === "ADMIN" &&
                            request.requestStatus ===
                              "PENDING" ? (

                            <div className="
                              action-buttons
                            ">

                              <button
                                className="
                                  approve-button
                                "
                                title="Approve request"
                                onClick={() =>
                                  approve(
                                    request.requestId
                                  )
                                }
                              >
                                ✓
                              </button>

                              <button
                                className="
                                  reject-button
                                "
                                title="Reject request"
                                onClick={() =>
                                  reject(
                                    request.requestId
                                  )
                                }
                              >
                                ×
                              </button>

                            </div>

                          ) : request.requestStatus ===
                            "APPROVED" ? (

                            <span className="
                              approved-text
                            ">
                              ✓ Approved
                            </span>

                          ) : request.requestStatus ===
                            "REJECTED" ? (

                            <span className="
                              rejected-text
                            ">
                              ✕ Rejected
                            </span>

                          ) : (

                            <span className="
                              pending-text
                            ">
                              Awaiting approval
                            </span>

                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

      </div>

    </div>
  );
}