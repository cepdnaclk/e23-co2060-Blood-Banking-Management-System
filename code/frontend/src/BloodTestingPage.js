import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api";

export default function BloodTestingPage() {
  const [donations, setDonations] = useState([]);
  const [tests, setTests] = useState([]);
  const [donors, setDonors] = useState([]);

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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ==========================================================
  // FETCH DONATIONS
  // ==========================================================

  const fetchDonations = useCallback(async () => {
    try {
      const data = await apiFetch("/api/donations/completed");

      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Donation loading error:", err);
      setDonations([]);
      setError(err.message || "Unable to load donations.");
    }
  }, []);

  // ==========================================================
  // FETCH DONORS
  // ==========================================================

  const fetchDonors = useCallback(async () => {
    try {
      const data = await apiFetch("/api/donor-management");

      setDonors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Donor loading error:", err);
      setDonors([]);
    }
  }, []);

  // ==========================================================
  // FETCH TESTS
  // ==========================================================

  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);

      const data = await apiFetch("/api/blood-tests");

      setTests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Blood test loading error:", err);
      setTests([]);
      setError(err.message || "Unable to load blood tests.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchDonations();
    fetchDonors();
    fetchTests();
  }, [fetchDonations, fetchDonors, fetchTests]);

  // ==========================================================
  // GET DONOR FROM DONATION
  // ==========================================================

  const getDonorForDonation = useCallback(
    (donation) => {
      if (!donation) return null;

      if (donation.donor) {
        return donation.donor;
      }

      const donorId =
        donation.donorId ??
        donation.donor?.donorId;

      if (!donorId) return null;

      return (
        donors.find(
          (donor) =>
            String(donor.donorId) ===
            String(donorId)
        ) || null
      );
    },
    [donors]
  );

  // ==========================================================
  // GET DONOR NAME
  // ==========================================================

  const getDonorName = (donor) => {
    if (!donor) {
      return "Unknown Donor";
    }

    if (donor.name) {
      return donor.name;
    }

    if (donor.fullName) {
      return donor.fullName;
    }

    if (
      donor.firstName ||
      donor.lastName
    ) {
      return [
        donor.firstName,
        donor.lastName
      ]
        .filter(Boolean)
        .join(" ");
    }

    if (donor.donorName) {
      return donor.donorName;
    }

    return "Unknown Donor";
  };

  // ==========================================================
  // GET BLOOD GROUP
  // ==========================================================

  const getBloodGroup = (donor) => {
    if (!donor) {
      return "-";
    }

    return (
      donor.bloodGroup ??
      donor.blood_group ??
      donor.bloodType ??
      "-"
    );
  };

  // ==========================================================
  // AUTO OVERALL RESULT
  // ==========================================================

  useEffect(() => {
    const values = [
      form.hiv,
      form.hepatitisB,
      form.hepatitisC,
      form.malaria,
      form.syphilis
    ];

    if (values.includes("POSITIVE")) {
      setOverall("UNSAFE");
    } else if (values.includes("PENDING")) {
      setOverall("PENDING");
    } else {
      setOverall("SAFE");
    }
  }, [
    form.hiv,
    form.hepatitisB,
    form.hepatitisC,
    form.malaria,
    form.syphilis
  ]);

  // ==========================================================
  // HANDLE CHANGE
  // ==========================================================

  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setMessage("");
    setError("");
  };

  // ==========================================================
  // DONATION CHANGE
  // ==========================================================

  const handleDonationChange = (e) => {
    setForm((previous) => ({
      ...previous,
      donation: {
        donationId: e.target.value
      }
    }));

    setMessage("");
    setError("");
  };

  // ==========================================================
  // RESET
  // ==========================================================

  const resetForm = () => {
    setForm({
      donation: {
        donationId: ""
      },
      hiv: "PENDING",
      hepatitisB: "PENDING",
      hepatitisC: "PENDING",
      malaria: "PENDING",
      syphilis: "PENDING",
      remarks: ""
    });

    setMessage("");
    setError("");
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (!form.donation.donationId) {
      setError("Please select a donation.");
      return;
    }

    try {
      setSaving(true);

      await apiFetch("/api/blood-tests", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setMessage(
        "Blood test recorded successfully."
      );

      resetForm();

      await fetchTests();

    } catch (err) {
      console.error(
        "Blood test submit error:",
        err
      );

      setError(
        err.message ||
        "Unable to add blood test."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // SEARCH TESTS
  // ==========================================================

  const filteredTests = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return tests;
    }

    return tests.filter((test) => {
      const donationId =
        test.donation?.donationId ??
        test.donationId ??
        "";

      const donation =
        donations.find(
          (d) =>
            String(d.donationId) ===
            String(donationId)
        );

      const donor =
        getDonorForDonation(donation);

      const donorName =
        getDonorName(donor);

      const bloodGroup =
        getBloodGroup(donor);

      return (
        String(test.testId)
          .toLowerCase()
          .includes(query) ||

        String(donationId)
          .toLowerCase()
          .includes(query) ||

        donorName
          .toLowerCase()
          .includes(query) ||

        bloodGroup
          .toLowerCase()
          .includes(query) ||

        String(test.overallResult || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [
    tests,
    donations,
    search,
    getDonorForDonation
  ]);

  // ==========================================================
  // SELECTED DONATION
  // ==========================================================

  const selectedDonation =
    donations.find(
      (donation) =>
        String(donation.donationId) ===
        String(
          form.donation.donationId
        )
    );

  const selectedDonor =
    getDonorForDonation(
      selectedDonation
    );

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const safeTests =
    tests.filter(
      (test) =>
        test.overallResult === "SAFE"
    ).length;

  const unsafeTests =
    tests.filter(
      (test) =>
        test.overallResult === "UNSAFE"
    ).length;

  const pendingTests =
    tests.filter(
      (test) =>
        test.overallResult === "PENDING"
    ).length;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="blood-testing-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .blood-testing-page {
          min-height: 100vh;
          padding: 30px;
          background: #f5f7fb;
          color: #172033;
          font-family:
            Inter,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        /* ==================================================
           HEADER
           ================================================== */

        .bt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 28px 30px;
          margin-bottom: 24px;

          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              #6d0b12,
              #a91420 55%,
              #d62e3b
            );

          color: white;

          box-shadow:
            0 12px 30px
            rgba(130, 15, 25, 0.18);
        }

        .bt-header-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .bt-header-icon {
          width: 60px;
          height: 60px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 16px;

          background:
            rgba(255,255,255,0.14);

          border:
            1px solid
            rgba(255,255,255,0.18);

          font-size: 30px;
        }

        .bt-breadcrumb {
          margin-bottom: 5px;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 1.6px;

          opacity: 0.72;
        }

        .bt-breadcrumb span {
          margin: 0 7px;
        }

        .bt-header h1 {
          margin: 0;

          font-size: 29px;
          font-weight: 750;
        }

        .bt-header p {
          margin: 6px 0 0;

          font-size: 13px;

          opacity: 0.82;
        }

        .bt-module-badge {
          display: flex;
          align-items: center;
          gap: 8px;

          padding: 9px 13px;

          border-radius: 999px;

          background:
            rgba(255,255,255,0.12);

          font-size: 11px;
          font-weight: 700;
        }

        .bt-live-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #86efac;
        }

        /* ==================================================
           NOTIFICATIONS
           ================================================== */

        .bt-alert {
          display: flex;
          align-items: center;
          gap: 12px;

          padding: 14px 16px;
          margin-bottom: 20px;

          border-radius: 12px;

          border: 1px solid;
        }

        .bt-alert-success {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #047857;
        }

        .bt-alert-error {
          background: #fef2f2;
          border-color: #fecaca;
          color: #b91c1c;
        }

        .bt-alert-icon {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: currentColor;
          color: white;

          font-weight: 800;
        }

        .bt-alert strong {
          display: block;
          font-size: 12px;
        }

        .bt-alert p {
          margin: 3px 0 0;
          font-size: 12px;
        }

        .bt-alert button {
          margin-left: auto;

          border: none;
          background: transparent;

          color: currentColor;

          font-size: 20px;

          cursor: pointer;
        }

        /* ==================================================
           STATISTICS
           ================================================== */

        .bt-stats {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 16px;

          margin-bottom: 24px;
        }

        .bt-stat {
          padding: 20px;

          background: white;

          border:
            1px solid #e5e9ef;

          border-radius: 15px;

          box-shadow:
            0 4px 16px
            rgba(15,23,42,0.04);
        }

        .bt-stat-top {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 12px;
        }

        .bt-stat-icon {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-size: 16px;
          font-weight: 800;
        }

        .bt-red {
          background: #fff1f2;
          color: #dc2626;
        }

        .bt-green {
          background: #ecfdf5;
          color: #059669;
        }

        .bt-orange {
          background: #fff7ed;
          color: #ea580c;
        }

        .bt-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .bt-stat-label {
          color: #94a3b8;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: .8px;
        }

        .bt-stat-number {
          font-size: 28px;
          font-weight: 800;

          color: #172033;
        }

        .bt-stat-desc {
          margin-top: 5px;

          color: #94a3b8;

          font-size: 10px;
        }

        /* ==================================================
           MAIN CARD
           ================================================== */

        .bt-card {
          margin-bottom: 24px;

          background: white;

          border:
            1px solid #e5e9ef;

          border-radius: 17px;

          box-shadow:
            0 4px 18px
            rgba(15,23,42,0.04);

          overflow: hidden;
        }

        .bt-form-card {
          padding: 27px;
        }

        .bt-section-title {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .bt-section-icon {
          width: 44px;
          height: 44px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background: #fff1f2;
          color: #c51f2a;

          font-size: 21px;
        }

        .bt-section-title h2 {
          margin: 0;

          font-size: 17px;
          font-weight: 750;
        }

        .bt-section-title p {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 11px;
        }

        .bt-line {
          height: 1px;

          margin: 22px 0;

          background: #eef1f5;
        }

        /* ==================================================
           DONATION SELECT
           ================================================== */

        .bt-donation-label {
          display: block;

          margin-bottom: 8px;

          color: #334155;

          font-size: 12px;
          font-weight: 700;
        }

        .bt-required {
          color: #dc2626;
          margin-left: 3px;
        }

        .bt-donation-select {
          width: 100%;
          height: 46px;

          padding: 0 14px;

          border:
            1px solid #dce2e9;

          border-radius: 10px;

          background: #f8fafc;

          color: #172033;

          font-family: inherit;

          font-size: 13px;

          outline: none;

          cursor: pointer;
        }

        .bt-donation-select:focus {
          background: white;

          border-color: #dc2626;

          box-shadow:
            0 0 0 3px
            rgba(220,38,38,.08);
        }

        /* ==================================================
           SELECTED DONOR
           ================================================== */

        .bt-selected-donor {
          display: flex;
          align-items: center;
          gap: 14px;

          margin-top: 14px;

          padding: 14px;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #fff7f7,
              #fff
            );

          border:
            1px solid #fee2e2;
        }

        .bt-donor-avatar {
          width: 45px;
          height: 45px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #c51f2a,
              #8f1018
            );

          color: white;

          font-size: 18px;
          font-weight: 800;
        }

        .bt-donor-info {
          flex: 1;
        }

        .bt-donor-name {
          font-size: 14px;
          font-weight: 750;

          color: #172033;
        }

        .bt-donor-meta {
          display: flex;
          gap: 8px;

          margin-top: 5px;
        }

        .bt-meta-pill {
          padding: 4px 8px;

          border-radius: 6px;

          font-size: 9px;
          font-weight: 750;
        }

        .bt-id-pill {
          background: #eff6ff;
          color: #2563eb;
        }

        .bt-blood-pill {
          background: #fff1f2;
          color: #dc2626;
        }

        /* ==================================================
           TEST GRID
           ================================================== */

        .bt-tests-title {
          margin: 24px 0 12px;

          color: #334155;

          font-size: 12px;
          font-weight: 750;
        }

        .bt-test-grid {
          display: grid;

          grid-template-columns:
            repeat(5, minmax(0,1fr));

          gap: 12px;
        }

        .bt-test-box {
          padding: 15px;

          border:
            1px solid #e5e9ef;

          border-radius: 12px;

          background: #fff;

          transition: .2s;
        }

        .bt-test-box:hover {
          border-color: #fecaca;

          box-shadow:
            0 5px 15px
            rgba(15,23,42,.05);
        }

        .bt-test-box label {
          display: block;

          margin-bottom: 9px;

          color: #334155;

          font-size: 11px;
          font-weight: 750;
        }

        .bt-test-select {
          width: 100%;
          height: 38px;

          padding: 0 8px;

          border:
            1px solid #dce2e9;

          border-radius: 8px;

          font-size: 10px;
          font-weight: 700;

          outline: none;

          cursor: pointer;
        }

        .bt-test-select:focus {
          border-color: #dc2626;
        }

        /* ==================================================
           REMARKS
           ================================================== */

        .bt-remarks {
          width: 100%;

          margin-top: 18px;

          min-height: 80px;

          padding: 12px;

          border:
            1px solid #dce2e9;

          border-radius: 10px;

          font-family: inherit;

          font-size: 12px;

          resize: vertical;

          outline: none;
        }

        .bt-remarks:focus {
          border-color: #dc2626;

          box-shadow:
            0 0 0 3px
            rgba(220,38,38,.08);
        }

        /* ==================================================
           RESULT
           ================================================== */

        .bt-result {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 18px;

          padding: 16px;

          border-radius: 12px;

          border: 1px solid;
        }

        .bt-result-safe {
          background: #ecfdf5;
          border-color: #a7f3d0;
        }

        .bt-result-unsafe {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .bt-result-pending {
          background: #fff7ed;
          border-color: #fed7aa;
        }

        .bt-result-title {
          font-size: 11px;
          color: #64748b;
          font-weight: 700;
        }

        .bt-result-value {
          font-size: 16px;
          font-weight: 850;
        }

        .bt-safe-text {
          color: #047857;
        }

        .bt-unsafe-text {
          color: #b91c1c;
        }

        .bt-pending-text {
          color: #c2410c;
        }

        /* ==================================================
           BUTTONS
           ================================================== */

        .bt-form-footer {
          display: flex;

          justify-content: flex-end;

          gap: 9px;

          margin-top: 20px;
        }

        .bt-btn {
          height: 42px;

          padding: 0 18px;

          border-radius: 9px;

          font-family: inherit;

          font-size: 12px;
          font-weight: 750;

          cursor: pointer;

          transition: .2s;
        }

        .bt-clear {
          border:
            1px solid #dce2e9;

          background: white;

          color: #64748b;
        }

        .bt-clear:hover {
          background: #f8fafc;
        }

        .bt-submit {
          border: none;

          background:
            linear-gradient(
              135deg,
              #c51f2a,
              #95121a
            );

          color: white;

          box-shadow:
            0 5px 14px
            rgba(149,18,26,.2);
        }

        .bt-submit:hover {
          transform: translateY(-1px);
        }

        .bt-btn:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        /* ==================================================
           TABLE
           ================================================== */

        .bt-record-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 25px 27px 18px;
        }

        .bt-record-count {
          padding: 7px 11px;

          border-radius: 8px;

          background: #f1f5f9;

          color: #475569;

          font-size: 10px;
          font-weight: 750;
        }

        .bt-toolbar {
          display: flex;

          gap: 10px;

          padding:
            0 27px 18px;
        }

        .bt-search {
          flex: 1;

          height: 41px;

          padding: 0 14px;

          border:
            1px solid #dce2e9;

          border-radius: 9px;

          background: #f8fafc;

          font-family: inherit;

          font-size: 12px;

          outline: none;
        }

        .bt-search:focus {
          background: white;

          border-color: #dc2626;

          box-shadow:
            0 0 0 3px
            rgba(220,38,38,.07);
        }

        .bt-refresh {
          height: 41px;

          padding: 0 15px;

          border:
            1px solid #dce2e9;

          border-radius: 9px;

          background: white;

          color: #64748b;

          font-family: inherit;

          font-size: 11px;
          font-weight: 700;

          cursor: pointer;
        }

        .bt-table-wrapper {
          overflow-x: auto;
        }

        .bt-table {
          width: 100%;

          min-width: 1100px;

          border-collapse: collapse;
        }

        .bt-table th {
          padding: 13px 15px;

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

          letter-spacing: .6px;
        }

        .bt-table td {
          padding: 14px 15px;

          border-bottom:
            1px solid #f0f2f5;

          color: #475569;

          font-size: 11px;
        }

        .bt-table tbody tr:hover {
          background: #fffafa;
        }

        .bt-test-id {
          font-weight: 800;
          color: #172033;
        }

        .bt-donation-id {
          color: #2563eb;
          font-weight: 750;
        }

        .bt-table-donor {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bt-small-avatar {
          width: 29px;
          height: 29px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background: #fff1f2;
          color: #c51f2a;

          font-size: 11px;
          font-weight: 800;
        }

        .bt-table-donor-name {
          color: #334155;
          font-weight: 700;
        }

        .bt-table-blood {
          display: inline-flex;

          padding: 5px 8px;

          border-radius: 6px;

          background: #fff1f2;

          color: #dc2626;

          font-size: 9px;
          font-weight: 800;
        }

        .bt-status {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 6px 9px;

          border-radius: 999px;

          font-size: 8px;
          font-weight: 800;
        }

        .bt-status-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: currentColor;
        }

        .bt-negative {
          background: #ecfdf5;
          color: #047857;
        }

        .bt-positive {
          background: #fef2f2;
          color: #b91c1c;
        }

        .bt-pending {
          background: #fff7ed;
          color: #c2410c;
        }

        .bt-overall-safe {
          background: #ecfdf5;
          color: #047857;
        }

        .bt-overall-unsafe {
          background: #fef2f2;
          color: #b91c1c;
        }

        /* ==================================================
           EMPTY
           ================================================== */

        .bt-empty {
          min-height: 220px;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          color: #94a3b8;
        }

        .bt-empty-icon {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #fff1f2;

          color: #c51f2a;

          font-size: 23px;
        }

        .bt-empty h3 {
          margin: 12px 0 4px;

          color: #334155;

          font-size: 14px;
        }

        .bt-empty p {
          margin: 0;

          font-size: 11px;
        }

        .bt-spinner {
          width: 30px;
          height: 30px;

          border:
            3px solid #fee2e2;

          border-top-color:
            #c51f2a;

          border-radius: 50%;

          animation:
            bt-spin .8s linear infinite;
        }

        @keyframes bt-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ==================================================
           RESPONSIVE
           ================================================== */

        @media (max-width: 1100px) {

          .bt-test-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .bt-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 800px) {

          .blood-testing-page {
            padding: 18px;
          }

          .bt-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .bt-module-badge {
            display: none;
          }

          .bt-test-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {

          .blood-testing-page {
            padding: 12px;
          }

          .bt-stats {
            grid-template-columns: 1fr;
          }

          .bt-test-grid {
            grid-template-columns: 1fr;
          }

          .bt-header h1 {
            font-size: 23px;
          }

          .bt-form-card {
            padding: 20px;
          }

          .bt-toolbar {
            flex-direction: column;
          }

          .bt-refresh {
            width: 100%;
          }
        }

      `}</style>

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div className="bt-header">

        <div className="bt-header-left">

          <div className="bt-header-icon">
            🧪
          </div>

          <div>

            <div className="bt-breadcrumb">
              BLOOD BANK
              <span>/</span>
              LABORATORY
            </div>

            <h1>
              Blood Testing
            </h1>

            <p>
              Screen donated blood for
              transfusion safety.
            </p>

          </div>

        </div>

        <div className="bt-module-badge">

          <span className="bt-live-dot"></span>

          Laboratory Module

        </div>

      </div>


      {/* ====================================================
          ALERTS
          ==================================================== */}

      {message && (

        <div className="
          bt-alert
          bt-alert-success
        ">

          <div className="bt-alert-icon">
            ✓
          </div>

          <div>

            <strong>
              Success
            </strong>

            <p>
              {message}
            </p>

          </div>

          <button
            onClick={() =>
              setMessage("")
            }
          >
            ×
          </button>

        </div>

      )}

      {error && (

        <div className="
          bt-alert
          bt-alert-error
        ">

          <div className="bt-alert-icon">
            !
          </div>

          <div>

            <strong>
              Error
            </strong>

            <p>
              {error}
            </p>

          </div>

          <button
            onClick={() =>
              setError("")
            }
          >
            ×
          </button>

        </div>

      )}


      {/* ====================================================
          STATISTICS
          ==================================================== */}

      <div className="bt-stats">

        <div className="bt-stat">

          <div className="bt-stat-top">

            <div className="
              bt-stat-icon
              bt-red
            ">
              🧪
            </div>

            <span className="bt-stat-label">
              TOTAL TESTS
            </span>

          </div>

          <div className="bt-stat-number">
            {tests.length}
          </div>

          <div className="bt-stat-desc">
            Blood screening records
          </div>

        </div>


        <div className="bt-stat">

          <div className="bt-stat-top">

            <div className="
              bt-stat-icon
              bt-green
            ">
              ✓
            </div>

            <span className="bt-stat-label">
              SAFE
            </span>

          </div>

          <div className="bt-stat-number">
            {safeTests}
          </div>

          <div className="bt-stat-desc">
            Suitable for processing
          </div>

        </div>


        <div className="bt-stat">

          <div className="bt-stat-top">

            <div className="
              bt-stat-icon
              bt-orange
            ">
              ◷
            </div>

            <span className="bt-stat-label">
              PENDING
            </span>

          </div>

          <div className="bt-stat-number">
            {pendingTests}
          </div>

          <div className="bt-stat-desc">
            Awaiting results
          </div>

        </div>


        <div className="bt-stat">

          <div className="bt-stat-top">

            <div className="
              bt-stat-icon
              bt-blue
            ">
              !
            </div>

            <span className="bt-stat-label">
              UNSAFE
            </span>

          </div>

          <div className="bt-stat-number">
            {unsafeTests}
          </div>

          <div className="bt-stat-desc">
            Positive screening results
          </div>

        </div>

      </div>


      {/* ====================================================
          ADD BLOOD TEST
          ==================================================== */}

      <div className="
        bt-card
        bt-form-card
      ">

        <div className="bt-section-title">

          <div className="bt-section-icon">
            🧪
          </div>

          <div>

            <h2>
              Record Blood Test
            </h2>

            <p>
              Select a completed donation
              and enter laboratory results.
            </p>

          </div>

        </div>

        <div className="bt-line"></div>


        {/* DONATION */}

        <label className="bt-donation-label">

          Donation

          <span className="bt-required">
            *
          </span>

        </label>

        <select
          className="bt-donation-select"
          value={
            form.donation.donationId
          }
          onChange={
            handleDonationChange
          }
        >

          <option value="">
            Select a completed donation
          </option>

          {donations.map((donation) => {

            const donor =
              getDonorForDonation(
                donation
              );

            return (

              <option
                key={donation.donationId}
                value={donation.donationId}
              >

                Donation #
                {donation.donationId}

                {" — "}

                {getDonorName(donor)}

                {" — Blood Group: "}

                {getBloodGroup(donor)}

              </option>

            );

          })}

        </select>


        {/* SELECTED DONOR */}

        {selectedDonation && (

          <div className="bt-selected-donor">

            <div className="bt-donor-avatar">

              {getDonorName(
                selectedDonor
              )
                .charAt(0)
                .toUpperCase()}

            </div>

            <div className="bt-donor-info">

              <div className="bt-donor-name">

                {getDonorName(
                  selectedDonor
                )}

              </div>

              <div className="bt-donor-meta">

                <span className="
                  bt-meta-pill
                  bt-id-pill
                ">
                  Donor #
                  {selectedDonor?.donorId ??
                    selectedDonation?.donorId ??
                    "-"}
                </span>

                <span className="
                  bt-meta-pill
                  bt-blood-pill
                ">
                  🩸
                  {" "}
                  {getBloodGroup(
                    selectedDonor
                  )}
                </span>

                <span className="
                  bt-meta-pill
                  bt-id-pill
                ">
                  Donation #
                  {selectedDonation.donationId}
                </span>

              </div>

            </div>

          </div>

        )}


        {/* TESTS */}

        <div className="bt-tests-title">
          Laboratory Screening Results
        </div>

        <div className="bt-test-grid">

          {[
            {
              key: "hiv",
              label: "HIV"
            },
            {
              key: "hepatitisB",
              label: "Hepatitis B"
            },
            {
              key: "hepatitisC",
              label: "Hepatitis C"
            },
            {
              key: "malaria",
              label: "Malaria"
            },
            {
              key: "syphilis",
              label: "Syphilis"
            }
          ].map((test) => (

            <div
              className="bt-test-box"
              key={test.key}
            >

              <label>
                {test.label}
              </label>

              <select
                className="bt-test-select"
                name={test.key}
                value={form[test.key]}
                onChange={handleChange}
              >

                <option value="PENDING">
                  PENDING
                </option>

                <option value="NEGATIVE">
                  NEGATIVE
                </option>

                <option value="POSITIVE">
                  POSITIVE
                </option>

              </select>

            </div>

          ))}

        </div>


        {/* REMARKS */}

        <textarea
          className="bt-remarks"
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          placeholder="Add laboratory remarks or additional observations..."
        />


        {/* OVERALL */}

        <div
          className={`
            bt-result
            ${
              overall === "SAFE"
                ? "bt-result-safe"
                : overall === "UNSAFE"
                ? "bt-result-unsafe"
                : "bt-result-pending"
            }
          `}
        >

          <div className="bt-result-title">
            AUTOMATIC OVERALL RESULT
          </div>

          <div
            className={`
              bt-result-value
              ${
                overall === "SAFE"
                  ? "bt-safe-text"
                  : overall === "UNSAFE"
                  ? "bt-unsafe-text"
                  : "bt-pending-text"
              }
            `}
          >

            {overall === "SAFE" && "✓ "}
            {overall === "UNSAFE" && "⚠ "}
            {overall === "PENDING" && "◷ "}

            {overall}

          </div>

        </div>


        {/* BUTTONS */}

        <div className="bt-form-footer">

          <button
            className="
              bt-btn
              bt-clear
            "
            onClick={resetForm}
            disabled={saving}
          >
            Clear
          </button>

          <button
            className="
              bt-btn
              bt-submit
            "
            onClick={handleSubmit}
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "✓ Record Blood Test"}

          </button>

        </div>

      </div>


      {/* ====================================================
          RECORDS
          ==================================================== */}

      <div className="bt-card">

        <div className="bt-record-header">

          <div className="bt-section-title">

            <div
              className="bt-section-icon"
              style={{
                background: "#eff6ff",
                color: "#2563eb"
              }}
            >
              ☷
            </div>

            <div>

              <h2>
                Blood Test Records
              </h2>

              <p>
                Review laboratory screening
                results.
              </p>

            </div>

          </div>

          <div className="bt-record-count">
            {filteredTests.length}
            {" "}records
          </div>

        </div>


        {/* SEARCH */}

        <div className="bt-toolbar">

          <input
            className="bt-search"
            type="text"
            placeholder="
              Search by test ID, donation ID,
              donor name or blood group...
            "
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button
            className="bt-refresh"
            onClick={fetchTests}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="bt-empty">

            <div className="bt-spinner"></div>

            <h3>
              Loading blood tests...
            </h3>

            <p>
              Please wait.
            </p>

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          filteredTests.length === 0 && (

            <div className="bt-empty">

              <div className="bt-empty-icon">
                🧪
              </div>

              <h3>
                No blood tests found
              </h3>

              <p>
                Record a blood test to see
                results here.
              </p>

            </div>

          )}


        {/* TABLE */}

        {!loading &&
          filteredTests.length > 0 && (

            <div className="bt-table-wrapper">

              <table className="bt-table">

                <thead>

                  <tr>

                    <th>
                      Test ID
                    </th>

                    <th>
                      Donation ID
                    </th>

                    <th>
                      Donor
                    </th>

                    <th>
                      Blood Group
                    </th>

                    <th>
                      HIV
                    </th>

                    <th>
                      Hep B
                    </th>

                    <th>
                      Hep C
                    </th>

                    <th>
                      Malaria
                    </th>

                    <th>
                      Syphilis
                    </th>

                    <th>
                      Overall
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredTests.map(
                    (test) => {

                      const donationId =
                        test.donation?.donationId ??
                        test.donationId ??
                        "-";

                      const donation =
                        donations.find(
                          (d) =>
                            String(
                              d.donationId
                            ) ===
                            String(
                              donationId
                            )
                        );

                      const donor =
                        getDonorForDonation(
                          donation
                        );

                      return (

                        <tr
                          key={
                            test.testId
                          }
                        >

                          <td>

                            <span className="bt-test-id">
                              #
                              {test.testId}
                            </span>

                          </td>


                          <td>

                            <span className="
                              bt-donation-id
                            ">
                              #
                              {donationId}
                            </span>

                          </td>


                          {/* DONOR NAME */}

                          <td>

                            <div className="
                              bt-table-donor
                            ">

                              <div className="
                                bt-small-avatar
                              ">
                                {getDonorName(
                                  donor
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <span className="
                                bt-table-donor-name
                              ">
                                {getDonorName(
                                  donor
                                )}
                              </span>

                            </div>

                          </td>


                          {/* BLOOD GROUP */}

                          <td>

                            <span className="
                              bt-table-blood
                            ">

                              🩸
                              {" "}
                              {getBloodGroup(
                                donor
                              )}

                            </span>

                          </td>


                          {/* HIV */}

                          <td>
                            <TestBadge
                              value={test.hiv}
                            />
                          </td>


                          {/* HEP B */}

                          <td>
                            <TestBadge
                              value={
                                test.hepatitisB
                              }
                            />
                          </td>


                          {/* HEP C */}

                          <td>
                            <TestBadge
                              value={
                                test.hepatitisC
                              }
                            />
                          </td>


                          {/* MALARIA */}

                          <td>
                            <TestBadge
                              value={
                                test.malaria
                              }
                            />
                          </td>


                          {/* SYPHILIS */}

                          <td>
                            <TestBadge
                              value={
                                test.syphilis
                              }
                            />
                          </td>


                          {/* OVERALL */}

                          <td>

                            <OverallBadge
                              value={
                                test.overallResult
                              }
                            />

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


/* ============================================================
   TEST BADGE
   ============================================================ */

function TestBadge({ value }) {

  const status =
    String(value || "PENDING")
      .toUpperCase();

  let className =
    "bt-status bt-pending";

  if (status === "NEGATIVE") {
    className =
      "bt-status bt-negative";
  }

  if (status === "POSITIVE") {
    className =
      "bt-status bt-positive";
  }

  return (

    <span className={className}>

      <span className="bt-status-dot"></span>

      {status}

    </span>

  );
}


/* ============================================================
   OVERALL BADGE

   SAFE     = green
   UNSAFE   = red
   PENDING  = orange
   ============================================================ */

function OverallBadge({ value }) {

  const status =
    String(value || "PENDING")
      .toUpperCase();

  let className =
    "bt-status bt-pending";

  if (status === "SAFE") {
    className =
      "bt-status bt-overall-safe";
  }

  if (status === "UNSAFE") {
    className =
      "bt-status bt-overall-unsafe";
  }

  return (

    <span className={className}>

      <span className="bt-status-dot"></span>

      {status}

    </span>

  );
}