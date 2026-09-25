import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

const DONATION_API = "https://backend-production-b77da.up.railway.app/api/donations";

const getToday = () =>
  new Date().toISOString().split("T")[0];

const EMPTY_FORM = {
  donorId: "",
  screeningId: "",
  donationDate: getToday(),
  unitsCollected: "",
  donationStatus: "COMPLETED",
  remarks: ""
};

function DonationPage() {

  const [donations, setDonations] = useState([]);

  const [form, setForm] = useState({
    ...EMPTY_FORM
  });

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // ==========================================================
  // AUTH
  // ==========================================================

  const getHeaders = useCallback(() => {

    const token =
      localStorage.getItem("token");

    return {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization:
              `Bearer ${token}`
          }
        : {})
    };

  }, []);

  // ==========================================================
  // LOAD DONATIONS
  // ==========================================================

  const loadDonations = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await fetch(
          DONATION_API,
          {
            method: "GET",
            headers: getHeaders()
          }
        );

      if (response.status === 401) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      if (response.status === 403) {
        throw new Error(
          "You do not have permission to view donations."
        );
      }

      if (!response.ok) {

        const text =
          await response.text();

        throw new Error(
          text ||
          `Unable to load donations. HTTP ${response.status}`
        );
      }

      const data =
        await response.json();

      setDonations(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Load donations:",
        err
      );

      setError(
        err.message ||
        "Unable to load donations."
      );

    } finally {

      setLoading(false);

    }

  }, [getHeaders]);

  useEffect(() => {

    loadDonations();

  }, [loadDonations]);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setMessage("");
    setError("");

  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {

    setForm({
      ...EMPTY_FORM,
      donationDate: getToday()
    });

    setEditingId(null);

    setMessage("");
    setError("");

  };

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validateForm = () => {

    if (!form.donorId) {
      return "Donor ID is required.";
    }

    if (
      !/^\d+$/.test(
        String(form.donorId)
      )
    ) {
      return "Donor ID must be a valid number.";
    }

    if (!form.screeningId) {
      return "Screening ID is required.";
    }

    if (
      !/^\d+$/.test(
        String(form.screeningId)
      )
    ) {
      return "Screening ID must be a valid number.";
    }

    if (!form.donationDate) {
      return "Donation date is required.";
    }

    if (
      form.unitsCollected === "" ||
      Number(form.unitsCollected) <= 0
    ) {
      return "Units collected must be greater than 0.";
    }

    return "";
  };

  // ==========================================================
  // ADD / UPDATE DONATION
  // ==========================================================

  const saveDonation = async () => {

    setError("");
    setMessage("");

    const validationError =
      validateForm();

    if (validationError) {

      setError(
        validationError
      );

      return;
    }

    try {

      setSaving(true);

      const body = {

        donationDate:
          form.donationDate,

        unitsCollected:
          Number(
            form.unitsCollected
          ),

        donationStatus:
          form.donationStatus,

        remarks:
          form.remarks.trim()

      };

      let url;

      let method;

      // ------------------------------------------------------
      // UPDATE
      // ------------------------------------------------------

      if (editingId) {

        url =
          `${DONATION_API}/${editingId}`;

        method = "PUT";

      }

      // ------------------------------------------------------
      // CREATE
      // ------------------------------------------------------

      else {

        const donorId =
          Number(form.donorId);

        const screeningId =
          Number(form.screeningId);

        url =
          `${DONATION_API}/${donorId}/${screeningId}`;

        method = "POST";

      }

      const response =
        await fetch(
          url,
          {
            method,
            headers: getHeaders(),
            body: JSON.stringify(body)
          }
        );

      const responseText =
        await response.text();

      if (response.status === 401) {

        throw new Error(
          "Session expired. Please login again."
        );

      }

      if (response.status === 403) {

        throw new Error(
          "You do not have permission to perform this action."
        );

      }

      if (!response.ok) {

        throw new Error(
          responseText ||
          "Unable to save donation."
        );

      }

      setMessage(
        editingId
          ? "Donation updated successfully."
          : "Donation recorded successfully."
      );

      setForm({
        ...EMPTY_FORM,
        donationDate: getToday()
      });

      setEditingId(null);

      await loadDonations();

    } catch (err) {

      console.error(
        "Save donation:",
        err
      );

      setError(
        err.message ||
        "Unable to save donation."
      );

    } finally {

      setSaving(false);

    }

  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const editDonation = (donation) => {

    const donorId =
      donation.donorId ??
      donation.donor?.donorId ??
      "";

    const screeningId =
      donation.screeningId ??
      donation.screening?.screeningId ??
      "";

    setEditingId(
      donation.donationId
    );

    setForm({

      donorId:
        String(donorId),

      screeningId:
        String(screeningId),

      donationDate:
        donation.donationDate ||
        getToday(),

      unitsCollected:
        donation.unitsCollected ??
        "",

      donationStatus:
        donation.donationStatus ||
        "COMPLETED",

      remarks:
        donation.remarks ||
        ""

    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const deleteDonation = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this donation?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setError("");
      setMessage("");

      const response =
        await fetch(
          `${DONATION_API}/${id}`,
          {
            method: "DELETE",
            headers: getHeaders()
          }
        );

      const responseText =
        await response.text();

      if (response.status === 401) {

        throw new Error(
          "Session expired. Please login again."
        );

      }

      if (response.status === 403) {

        throw new Error(
          "You do not have permission to delete donations."
        );

      }

      if (!response.ok) {

        throw new Error(
          responseText ||
          "Unable to delete donation."
        );

      }

      setMessage(
        "Donation deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await loadDonations();

    } catch (err) {

      console.error(
        "Delete donation:",
        err
      );

      setError(
        err.message ||
        "Unable to delete donation."
      );

    }

  };

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredDonations =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return donations;
      }

      return donations.filter(
        (donation) => {

          const donorId =
            donation.donorId ??
            donation.donor?.donorId ??
            "";

          const screeningId =
            donation.screeningId ??
            donation.screening?.screeningId ??
            "";

          const status =
            donation.donationStatus ??
            "";

          const remarks =
            donation.remarks ??
            "";

          const date =
            donation.donationDate ??
            "";

          return (

            String(
              donation.donationId
            )
              .toLowerCase()
              .includes(query)

            ||

            String(donorId)
              .toLowerCase()
              .includes(query)

            ||

            String(screeningId)
              .toLowerCase()
              .includes(query)

            ||

            String(status)
              .toLowerCase()
              .includes(query)

            ||

            String(date)
              .toLowerCase()
              .includes(query)

            ||

            String(remarks)
              .toLowerCase()
              .includes(query)

          );

        }
      );

    }, [
      donations,
      search
    ]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalDonations =
    donations.length;

  const completedDonations =
    donations.filter(
      (donation) =>
        donation.donationStatus ===
        "COMPLETED"
    ).length;

  const pendingDonations =
    donations.filter(
      (donation) =>
        donation.donationStatus ===
        "PENDING"
    ).length;

  const totalUnits =
    donations.reduce(
      (total, donation) =>
        total +
        Number(
          donation.unitsCollected || 0
        ),
      0
    );

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <>

      <style>{`

        * {
          box-sizing: border-box;
        }

        .donation-page {
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

        /* ================= HEADER ================= */

        .donation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 30px;
          margin-bottom: 24px;
          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              #8f1018,
              #c51f2a,
              #e13943
            );

          color: white;

          box-shadow:
            0 12px 30px
            rgba(139, 16, 24, 0.18);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .header-icon {
          width: 60px;
          height: 60px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 16px;

          background:
            rgba(255,255,255,0.15);

          border:
            1px solid
            rgba(255,255,255,0.18);
        }

        .header-icon span {
          font-size: 36px;
          font-weight: 300;
        }

        .header-breadcrumb {
          margin-bottom: 5px;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 1.7px;

          opacity: 0.75;
        }

        .header-breadcrumb span {
          margin: 0 7px;
        }

        .donation-header h1 {
          margin: 0;

          font-size: 29px;
          font-weight: 750;
        }

        .donation-header p {
          margin: 6px 0 0;

          font-size: 13px;

          opacity: 0.82;
        }

        .header-badge {
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

        .live-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #86efac;
        }

        /* ================= NOTIFICATION ================= */

        .notification {
          display: flex;
          align-items: center;
          gap: 12px;

          padding: 14px 16px;
          margin-bottom: 20px;

          border-radius: 12px;
          border: 1px solid;
        }

        .notification.success {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #047857;
        }

        .notification.error {
          background: #fef2f2;
          border-color: #fecaca;
          color: #b91c1c;
        }

        .notification-icon {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 50%;

          background: currentColor;
          color: white;

          font-weight: 800;
        }

        .notification strong {
          display: block;
          font-size: 12px;
        }

        .notification p {
          margin: 3px 0 0;
          font-size: 12px;
        }

        .notification button {
          margin-left: auto;

          border: none;
          background: transparent;

          color: currentColor;

          font-size: 21px;
          cursor: pointer;
        }

        /* ================= STATISTICS ================= */

        .statistics-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 16px;

          margin-bottom: 24px;
        }

        .stat-card {
          padding: 20px;

          background: white;

          border: 1px solid #e5e9ef;

          border-radius: 15px;

          box-shadow:
            0 4px 16px
            rgba(15,23,42,0.04);

          transition: 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);

          box-shadow:
            0 9px 25px
            rgba(15,23,42,0.08);
        }

        .stat-top {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 13px;
        }

        .stat-icon {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-size: 10px;
          font-weight: 800;
        }

        .stat-red {
          background: #fff1f2;
          color: #dc2626;
        }

        .stat-green {
          background: #ecfdf5;
          color: #059669;
        }

        .stat-orange {
          background: #fff7ed;
          color: #ea580c;
        }

        .stat-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .stat-label {
          color: #94a3b8;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.8px;
        }

        .stat-value {
          color: #172033;

          font-size: 28px;
          font-weight: 800;
        }

        .stat-description {
          margin-top: 5px;

          color: #94a3b8;

          font-size: 10px;
        }

        /* ================= CARD ================= */

        .content-card {
          margin-bottom: 24px;

          background: white;

          border: 1px solid #e5e9ef;

          border-radius: 17px;

          box-shadow:
            0 4px 18px
            rgba(15,23,42,0.04);

          overflow: hidden;
        }

        .form-card {
          padding: 27px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .section-icon {
          width: 44px;
          height: 44px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background: #fff1f2;
          color: #c51f2a;

          font-size: 21px;
          font-weight: 700;
        }

        .section-title h2 {
          margin: 0;

          color: #172033;

          font-size: 17px;
          font-weight: 750;
        }

        .section-title p {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 11px;
        }

        .editing-badge {
          padding: 7px 11px;

          border-radius: 8px;

          background: #fff7ed;
          color: #c2410c;

          font-size: 10px;
          font-weight: 750;
        }

        .section-line {
          height: 1px;

          margin: 22px 0;

          background: #eef1f5;
        }

        /* ================= FORM ================= */

        .form-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0,1fr));

          gap: 20px;
        }

        .form-field.full {
          grid-column: 1 / -1;
        }

        .form-field label {
          display: block;

          margin-bottom: 7px;

          color: #334155;

          font-size: 12px;
          font-weight: 700;
        }

        .form-field label span {
          color: #dc2626;
          margin-left: 3px;
        }

        .field-wrapper {
          position: relative;
        }

        .field-prefix {
          position: absolute;

          left: 14px;
          top: 50%;

          transform:
            translateY(-50%);

          z-index: 2;

          color: #94a3b8;

          font-size: 9px;
          font-weight: 800;

          pointer-events: none;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;

          border:
            1px solid #dce2e9;

          border-radius: 9px;

          background: white;

          color: #172033;

          font-family: inherit;

          font-size: 13px;

          outline: none;

          transition: 0.2s;
        }

        .form-field input,
        .form-field select {
          height: 43px;

          padding:
            0 13px 0 42px;
        }

        .form-field textarea {
          padding: 12px 13px;

          min-height: 90px;

          resize: vertical;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #dc2626;

          box-shadow:
            0 0 0 3px
            rgba(220,38,38,0.08);
        }

        .form-field input:disabled {
          background: #f8fafc;
          color: #64748b;
        }

        .form-field small {
          display: block;

          margin-top: 5px;

          color: #a0aab8;

          font-size: 10px;
        }

        /* ================= FORM FOOTER ================= */

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 24px;
          padding-top: 19px;

          border-top:
            1px solid #eef1f5;
        }

        .required-note {
          color: #94a3b8;
          font-size: 10px;
        }

        .required-note span {
          color: #dc2626;
        }

        .form-buttons {
          display: flex;
          gap: 9px;
        }

        .btn {
          height: 41px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          padding: 0 17px;

          border-radius: 9px;

          font-family: inherit;

          font-size: 12px;
          font-weight: 750;

          cursor: pointer;

          transition: 0.2s;
        }

        .btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .btn-secondary {
          border:
            1px solid #dce2e9;

          background: white;

          color: #64748b;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f8fafc;
        }

        .btn-primary {
          border: none;

          background:
            linear-gradient(
              135deg,
              #c51f2a,
              #9f1018
            );

          color: white;

          box-shadow:
            0 5px 13px
            rgba(159,16,24,0.2);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);

          box-shadow:
            0 8px 18px
            rgba(159,16,24,0.25);
        }

        /* ================= RECORDS ================= */

        .records-top {
          display: flex;

          align-items: center;
          justify-content: space-between;

          padding: 25px 27px 18px;
        }

        .records-count {
          padding: 7px 11px;

          border-radius: 8px;

          background: #f1f5f9;

          color: #475569;

          font-size: 10px;
          font-weight: 750;
        }

        .toolbar {
          display: flex;

          gap: 10px;

          padding:
            0 27px 18px;
        }

        .search-box {
          position: relative;

          flex: 1;
        }

        .search-box input {
          width: 100%;
          height: 41px;

          padding:
            0 38px;

          border:
            1px solid #dce2e9;

          border-radius: 9px;

          background: #f8fafc;

          color: #172033;

          font-family: inherit;

          font-size: 12px;

          outline: none;
        }

        .search-box input:focus {
          background: white;

          border-color: #dc2626;

          box-shadow:
            0 0 0 3px
            rgba(220,38,38,0.07);
        }

        .search-icon {
          position: absolute;

          left: 13px;
          top: 50%;

          transform:
            translateY(-50%);

          color: #94a3b8;

          font-size: 19px;
        }

        .clear-search {
          position: absolute;

          right: 10px;
          top: 50%;

          transform:
            translateY(-50%);

          border: none;

          background: transparent;

          color: #94a3b8;

          font-size: 18px;

          cursor: pointer;
        }

        .refresh-btn {
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

        .refresh-btn:hover {
          background: #f8fafc;
        }

        /* ================= TABLE ================= */

        .table-container {
          width: 100%;

          overflow-x: auto;
        }

        .donation-table {
          width: 100%;

          min-width: 950px;

          border-collapse:
            collapse;
        }

        .donation-table thead {
          background: #f8fafc;
        }

        .donation-table th {
          padding:
            12px 17px;

          border-top:
            1px solid #eef1f5;

          border-bottom:
            1px solid #e8edf2;

          color: #718096;

          text-align: left;

          font-size: 9px;
          font-weight: 850;

          text-transform: uppercase;

          letter-spacing: 0.65px;
        }

        .donation-table td {
          padding:
            14px 17px;

          border-bottom:
            1px solid #f0f2f5;

          color: #475569;

          font-size: 12px;
        }

        .donation-table tbody tr {
          transition: 0.15s;
        }

        .donation-table tbody tr:hover {
          background: #fffafa;
        }

        .donation-id {
          display: flex;

          align-items: center;

          gap: 9px;
        }

        .row-icon {
          width: 31px;
          height: 31px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background: #fff1f2;

          color: #dc2626;

          font-size: 16px;
        }

        .donation-id strong {
          display: block;

          color: #1e293b;

          font-size: 12px;
        }

        .donation-id small {
          display: block;

          margin-top: 2px;

          color: #a0aab8;

          font-size: 9px;
        }

        .id-pill {
          display: inline-flex;

          padding: 5px 9px;

          border-radius: 6px;

          font-size: 10px;

          font-weight: 750;
        }

        .donor-pill {
          background: #eff6ff;
          color: #2563eb;
        }

        .screening-pill {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .units-cell strong {
          color: #1e293b;
          font-size: 13px;
        }

        .units-cell span {
          margin-left: 4px;

          color: #94a3b8;

          font-size: 9px;
        }

        .status-pill {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 6px 9px;

          border-radius: 999px;

          font-size: 9px;
          font-weight: 800;
        }

        .status-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: currentColor;
        }

        .status-completed {
          background: #ecfdf5;
          color: #047857;
        }

        .status-pending {
          background: #fff7ed;
          color: #c2410c;
        }

        .status-cancelled {
          background: #fef2f2;
          color: #b91c1c;
        }

        .remarks-cell {
          max-width: 150px;

          overflow: hidden;

          white-space: nowrap;

          text-overflow: ellipsis;

          color: #64748b;

          font-size: 10px;
        }

        .actions {
          display: flex;

          gap: 6px;
        }

        .table-btn {
          width: 31px;
          height: 31px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 7px;

          background: white;

          font-size: 14px;

          cursor: pointer;

          transition: 0.15s;
        }

        .edit-btn {
          border:
            1px solid #bfdbfe;

          color: #2563eb;
        }

        .edit-btn:hover {
          background: #eff6ff;
        }

        .delete-btn {
          border:
            1px solid #fecaca;

          color: #dc2626;
        }

        .delete-btn:hover {
          background: #fef2f2;
        }

        /* ================= EMPTY / LOADING ================= */

        .table-state {
          min-height: 250px;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          border-top:
            1px solid #eef1f5;
        }

        .table-state h3 {
          margin: 12px 0 4px;

          color: #334155;

          font-size: 14px;
        }

        .table-state p {
          margin: 0;

          color: #94a3b8;

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
            donation-spin
            0.8s
            linear
            infinite;
        }

        @keyframes donation-spin {

          to {
            transform:
              rotate(360deg);
          }

        }

        .empty-icon {
          width: 54px;
          height: 54px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #fff1f2;

          color: #c51f2a;

          font-size: 27px;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1100px) {

          .statistics-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 800px) {

          .donation-page {
            padding: 18px;
          }

          .donation-header {
            align-items: flex-start;

            flex-direction: column;
          }

          .header-badge {
            display: none;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-field.full {
            grid-column: auto;
          }

          .form-footer {
            align-items: stretch;

            flex-direction: column;
          }

          .records-top {
            align-items: flex-start;

            flex-direction: column;

            gap: 12px;
          }

        }

        @media (max-width: 600px) {

          .statistics-grid {
            grid-template-columns: 1fr;
          }

          .donation-page {
            padding: 12px;
          }

          .donation-header {
            padding: 22px;
          }

          .donation-header h1 {
            font-size: 23px;
          }

          .form-card {
            padding: 20px;
          }

          .toolbar {
            flex-direction: column;

            padding:
              0 20px 18px;
          }

          .refresh-btn {
            width: 100%;
          }

          .form-buttons {
            width: 100%;
          }

          .btn {
            flex: 1;
          }

        }

      `}</style>

      <div className="donation-page">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="donation-header">

          <div className="header-left">

            <div className="header-icon">
              <span>+</span>
            </div>

            <div>

              <div className="header-breadcrumb">
                BLOOD BANK
                <span>/</span>
                DONATIONS
              </div>

              <h1>
                Donation Management
              </h1>

              <p>
                Record, monitor and manage
                blood donations.
              </p>

            </div>

          </div>

          <div className="header-badge">

            <span className="live-dot"></span>

            Donation Module

          </div>

        </div>

        {/* ==================================================
            SUCCESS
            ================================================== */}

        {message && (

          <div className="notification success">

            <div className="notification-icon">
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
              type="button"
              onClick={() =>
                setMessage("")
              }
            >
              ×
            </button>

          </div>

        )}

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (

          <div className="notification error">

            <div className="notification-icon">
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
              type="button"
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>

          </div>

        )}

        {/* ==================================================
            STATISTICS
            ================================================== */}

        <div className="statistics-grid">

          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon stat-red">
                +
              </div>

              <span className="stat-label">
                TOTAL DONATIONS
              </span>

            </div>

            <div className="stat-value">
              {totalDonations}
            </div>

            <div className="stat-description">
              All recorded donations
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon stat-green">
                ✓
              </div>

              <span className="stat-label">
                COMPLETED
              </span>

            </div>

            <div className="stat-value">
              {completedDonations}
            </div>

            <div className="stat-description">
              Successfully completed
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon stat-orange">
                ◷
              </div>

              <span className="stat-label">
                PENDING
              </span>

            </div>

            <div className="stat-value">
              {pendingDonations}
            </div>

            <div className="stat-description">
              Awaiting completion
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon stat-blue">
                ML
              </div>

              <span className="stat-label">
                UNITS COLLECTED
              </span>

            </div>

            <div className="stat-value">
              {totalUnits.toFixed(0)}
            </div>

            <div className="stat-description">
              Total collected units
            </div>

          </div>

        </div>

        {/* ==================================================
            FORM
            ================================================== */}

        <div className="content-card form-card">

          <div className="section-header">

            <div className="section-title">

              <div className="section-icon">
                {editingId ? "✎" : "+"}
              </div>

              <div>

                <h2>
                  {editingId
                    ? "Edit Donation"
                    : "Record New Donation"}
                </h2>

                <p>
                  Enter the donor and
                  donation information.
                </p>

              </div>

            </div>

            {editingId && (

              <div className="editing-badge">

                Editing Donation #
                {editingId}

              </div>

            )}

          </div>

          <div className="section-line"></div>

          <div className="form-grid">

            {/* DONOR ID */}

            <div className="form-field">

              <label>
                Donor ID
                <span>*</span>
              </label>

              <div className="field-wrapper">

                <div className="field-prefix">
                  ID
                </div>

                <input
                  type="number"
                  min="1"
                  name="donorId"
                  value={form.donorId}
                  onChange={handleChange}
                  placeholder="Enter donor ID"
                  disabled={!!editingId}
                />

              </div>

              <small>
                Enter the registered donor ID.
              </small>

            </div>


            {/* SCREENING ID */}

            <div className="form-field">

              <label>
                Screening ID
                <span>*</span>
              </label>

              <div className="field-wrapper">

                <div
                  className="field-prefix"
                  style={{
                    color: "#7c3aed"
                  }}
                >
                  S
                </div>

                <input
                  type="number"
                  min="1"
                  name="screeningId"
                  value={form.screeningId}
                  onChange={handleChange}
                  placeholder="Enter screening ID"
                  disabled={!!editingId}
                />

              </div>

              <small>
                Screening must be ELIGIBLE.
              </small>

            </div>


            {/* DATE */}

            <div className="form-field">

              <label>
                Donation Date
                <span>*</span>
              </label>

              <div className="field-wrapper">

                <div className="field-prefix">
                  ◷
                </div>

                <input
                  type="date"
                  name="donationDate"
                  value={form.donationDate}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* UNITS */}

            <div className="form-field">

              <label>
                Units Collected
                <span>*</span>
              </label>

              <div className="field-wrapper">

                <div
                  className="field-prefix"
                  style={{
                    color: "#2563eb"
                  }}
                >
                  ML
                </div>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  name="unitsCollected"
                  value={form.unitsCollected}
                  onChange={handleChange}
                  placeholder="e.g. 450"
                />

              </div>

              <small>
                Enter the amount collected.
              </small>

            </div>


            {/* STATUS */}

            <div className="form-field">

              <label>
                Donation Status
                <span>*</span>
              </label>

              <div className="field-wrapper">

                <div className="field-prefix">
                  ●
                </div>

                <select
                  name="donationStatus"
                  value={form.donationStatus}
                  onChange={handleChange}
                >

                  <option value="COMPLETED">
                    COMPLETED
                  </option>

                  <option value="PENDING">
                    PENDING
                  </option>

                  <option value="CANCELLED">
                    CANCELLED
                  </option>

                </select>

              </div>

            </div>


            {/* REMARKS */}

            <div className="form-field full">

              <label>
                Remarks
              </label>

              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Add any additional notes about this donation..."
                rows="3"
              />

            </div>

          </div>

          <div className="form-footer">

            <div className="required-note">
              <span>*</span>
              Required fields
            </div>

            <div className="form-buttons">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={saving}
              >
                ↺
                Clear
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={saveDonation}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Donation"
                  : "Record Donation"}

                {!saving && " →"}

              </button>

            </div>

          </div>

        </div>

        {/* ==================================================
            RECORDS
            ================================================== */}

        <div className="content-card">

          <div className="records-top">

            <div className="section-title">

              <div
                className="section-icon"
                style={{
                  background: "#eff6ff",
                  color: "#2563eb"
                }}
              >
                ☷
              </div>

              <div>

                <h2>
                  Donation Records
                </h2>

                <p>
                  View and manage all recorded donations.
                </p>

              </div>

            </div>

            <div className="records-count">
              {filteredDonations.length}
              {" "}records
            </div>

          </div>


          {/* TOOLBAR */}

          <div className="toolbar">

            <div className="search-box">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by donation ID, donor ID, screening ID..."
              />

              {search && (

                <button
                  type="button"
                  className="clear-search"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  ×
                </button>

              )}

            </div>

            <button
              type="button"
              className="refresh-btn"
              onClick={loadDonations}
              disabled={loading}
            >
              ↻ Refresh
            </button>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="table-state">

              <div className="spinner"></div>

              <h3>
                Loading donations...
              </h3>

              <p>
                Please wait.
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            filteredDonations.length === 0 && (

              <div className="table-state">

                <div className="empty-icon">
                  +
                </div>

                <h3>
                  No donations found
                </h3>

                <p>
                  {search
                    ? "Try a different search."
                    : "No donation records available."}
                </p>

              </div>

            )}


          {/* TABLE */}

          {!loading &&
            filteredDonations.length > 0 && (

              <div className="table-container">

                <table className="donation-table">

                  <thead>

                    <tr>

                      <th>
                        Donation
                      </th>

                      <th>
                        Donor ID
                      </th>

                      <th>
                        Screening ID
                      </th>

                      <th>
                        Date
                      </th>

                      <th>
                        Units Collected
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Remarks
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredDonations.map(
                      (donation) => {

                        const donorId =
                          donation.donorId ??
                          donation.donor?.donorId ??
                          "-";

                        const screeningId =
                          donation.screeningId ??
                          donation.screening?.screeningId ??
                          "-";

                        const status =
                          donation.donationStatus ||
                          "UNKNOWN";

                        const statusClass =
                          String(status)
                            .toLowerCase();

                        return (

                          <tr
                            key={
                              donation.donationId
                            }
                          >

                            <td>

                              <div className="donation-id">

                                <div className="row-icon">
                                  +
                                </div>

                                <div>

                                  <strong>
                                    #
                                    {
                                      donation.donationId
                                    }
                                  </strong>

                                  <small>
                                    Donation
                                  </small>

                                </div>

                              </div>

                            </td>


                            <td>

                              <span
                                className="
                                  id-pill
                                  donor-pill
                                "
                              >
                                #{donorId}
                              </span>

                            </td>


                            <td>

                              <span
                                className="
                                  id-pill
                                  screening-pill
                                "
                              >
                                #{screeningId}
                              </span>

                            </td>


                            <td>

                              {donation.donationDate ||
                                "-"}

                            </td>


                            <td>

                              <div className="units-cell">

                                <strong>
                                  {Number(
                                    donation.unitsCollected ||
                                    0
                                  ).toFixed(0)}
                                </strong>

                                <span>
                                  units
                                </span>

                              </div>

                            </td>


                            <td>

                              <span
                                className={
                                  `status-pill status-${statusClass}`
                                }
                              >

                                <span className="status-dot"></span>

                                {status}

                              </span>

                            </td>


                            <td>

                              <div
                                className="remarks-cell"
                                title={
                                  donation.remarks ||
                                  ""
                                }
                              >
                                {donation.remarks ||
                                  "No remarks"}
                              </div>

                            </td>


                            <td>

                              <div className="actions">

                                <button
                                  type="button"
                                  className="
                                    table-btn
                                    edit-btn
                                  "
                                  onClick={() =>
                                    editDonation(
                                      donation
                                    )
                                  }
                                  title="Edit"
                                >
                                  ✎
                                </button>

                                <button
                                  type="button"
                                  className="
                                    table-btn
                                    delete-btn
                                  "
                                  onClick={() =>
                                    deleteDonation(
                                      donation.donationId
                                    )
                                  }
                                  title="Delete"
                                >
                                  ×
                                </button>

                              </div>

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

    </>
  );
}

export default DonationPage;
