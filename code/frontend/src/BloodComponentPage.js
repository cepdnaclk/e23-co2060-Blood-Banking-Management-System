import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { apiFetch } from "./api";

function BloodComponentPage() {
  const [components, setComponents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);

  const [form, setForm] = useState({
    donationId: "",
    componentType: "",
    quantity: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // ==========================================================
  // FETCH COMPONENTS
  // ==========================================================

  const fetchComponents = useCallback(async () => {
    try {
      const data = await apiFetch("/api/components");

      setComponents(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Component loading error:",
        err
      );

      setComponents([]);

      setError(
        err.message ||
        "Unable to load blood components."
      );
    }
  }, []);

  // ==========================================================
  // FETCH DONATIONS
  // ==========================================================

  const fetchDonations = useCallback(async () => {
    try {
      const data =
        await apiFetch("/api/donations");

      setDonations(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Donation loading error:",
        err
      );

      setDonations([]);
    }
  }, []);

  // ==========================================================
  // FETCH DONORS
  // ==========================================================

  const fetchDonors = useCallback(async () => {
    try {
      const data =
        await apiFetch(
          "/api/donor-management"
        );

      setDonors(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Donor loading error:",
        err
      );

      setDonors([]);
    }
  }, []);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  const loadData = useCallback(
    async () => {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchComponents(),
        fetchDonations(),
        fetchDonors()
      ]);

      setLoading(false);
    },
    [
      fetchComponents,
      fetchDonations,
      fetchDonors
    ]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ==========================================================
  // GET DONATION
  // ==========================================================

  const getDonation = useCallback(
    (donationId) => {
      if (!donationId) {
        return null;
      }

      return (
        donations.find(
          (donation) =>
            String(
              donation.donationId
            ) === String(donationId)
        ) || null
      );
    },
    [donations]
  );

  // ==========================================================
  // GET DONOR
  // ==========================================================

  const getDonor = useCallback(
    (donation) => {
      if (!donation) {
        return null;
      }

      if (donation.donor) {
        return donation.donor;
      }

      const donorId =
        donation.donorId ??
        donation.donor?.donorId;

      if (!donorId) {
        return null;
      }

      return (
        donors.find(
          (donor) =>
            String(
              donor.donorId
            ) === String(donorId)
        ) || null
      );
    },
    [donors]
  );

  // ==========================================================
  // DONOR NAME
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
  // BLOOD GROUP
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
  // FORM CHANGE
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
  // RESET
  // ==========================================================

  const resetForm = () => {
    setForm({
      donationId: "",
      componentType: "",
      quantity: ""
    });

    setMessage("");
    setError("");
  };

  // ==========================================================
  // SELECTED DONATION
  // ==========================================================

  const selectedDonation =
    getDonation(
      form.donationId
    );

  const selectedDonor =
    getDonor(
      selectedDonation
    );

  // ==========================================================
  // CREATE COMPONENT
  // ==========================================================

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (!form.donationId) {
      setError(
        "Please select a donation."
      );
      return;
    }

    if (!form.componentType) {
      setError(
        "Please select a component type."
      );
      return;
    }

    if (
      form.quantity === "" ||
      Number(form.quantity) <= 0
    ) {
      setError(
        "Quantity must be greater than 0."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        donation: {
          donationId:
            Number(form.donationId)
        },

        componentType:
          form.componentType,

        quantity:
          Number(form.quantity)
      };

      await apiFetch(
        "/api/components",
        {
          method: "POST",
          body: JSON.stringify(payload)
        }
      );

      setMessage(
        "Blood component created successfully."
      );

      resetForm();

      await fetchComponents();

    } catch (err) {
      console.error(
        "Create component error:",
        err
      );

      setError(
        err.message ||
        "Unable to create blood component."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredComponents =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return components;
      }

      return components.filter(
        (component) => {
          const donationId =
            component.donation?.donationId ??
            component.donationId ??
            "";

          const donation =
            getDonation(donationId);

          const donor =
            getDonor(donation);

          const donorName =
            getDonorName(donor);

          const bloodGroup =
            getBloodGroup(donor);

          const type =
            component.componentType ??
            "";

          return (
            String(
              component.componentId
            )
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

            type
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }, [
      components,
      search,
      getDonation,
      getDonor
    ]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalComponents =
    components.length;



  const rbcCount =
    components.filter(
      (component) =>
        component.componentType === "RBC"
    ).length;

  const plasmaCount =
    components.filter(
      (component) =>
        component.componentType === "PLASMA"
    ).length;

  const plateletCount =
    components.filter(
      (component) =>
        component.componentType ===
        "PLATELETS"
    ).length;

  // ==========================================================
  // COMPONENT TYPE DISPLAY
  // ==========================================================

  const getComponentLabel = (type) => {
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

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="component-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .component-page {
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

        .component-header {
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
            rgba(130,15,25,.18);
        }

        .component-header-left {
          display: flex;

          align-items: center;

          gap: 18px;
        }

        .component-header-icon {
          width: 60px;
          height: 60px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 16px;

          background:
            rgba(255,255,255,.14);

          border:
            1px solid
            rgba(255,255,255,.18);

          font-size: 30px;
        }

        .component-breadcrumb {
          margin-bottom: 5px;

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 1.6px;

          opacity: .72;
        }

        .component-breadcrumb span {
          margin: 0 7px;
        }

        .component-header h1 {
          margin: 0;

          font-size: 29px;

          font-weight: 750;
        }

        .component-header p {
          margin: 6px 0 0;

          font-size: 13px;

          opacity: .82;
        }

        .component-module-badge {
          display: flex;

          align-items: center;

          gap: 8px;

          padding: 9px 13px;

          border-radius: 999px;

          background:
            rgba(255,255,255,.12);

          font-size: 11px;

          font-weight: 700;
        }

        .component-live-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #86efac;
        }

        /* ==================================================
           ALERT
           ================================================== */

        .component-alert {
          display: flex;

          align-items: center;

          gap: 12px;

          padding: 14px 16px;

          margin-bottom: 20px;

          border-radius: 12px;

          border: 1px solid;
        }

        .component-success {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #047857;
        }

        .component-error {
          background: #fef2f2;
          border-color: #fecaca;
          color: #b91c1c;
        }

        .component-alert-icon {
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

        .component-alert strong {
          display: block;

          font-size: 12px;
        }

        .component-alert p {
          margin: 3px 0 0;

          font-size: 12px;
        }

        .component-alert button {
          margin-left: auto;

          border: none;

          background: transparent;

          color: currentColor;

          font-size: 21px;

          cursor: pointer;
        }

        /* ==================================================
           STATISTICS
           ================================================== */

        .component-stats {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0,1fr));

          gap: 16px;

          margin-bottom: 24px;
        }

        .component-stat {
          padding: 20px;

          background: white;

          border:
            1px solid #e5e9ef;

          border-radius: 15px;

          box-shadow:
            0 4px 16px
            rgba(15,23,42,.04);

          transition: .2s;
        }

        .component-stat:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 9px 25px
            rgba(15,23,42,.08);
        }

        .component-stat-top {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-bottom: 12px;
        }

        .component-stat-icon {
          width: 40px;
          height: 40px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-size: 17px;

          font-weight: 800;
        }

        .component-red {
          background: #fff1f2;
          color: #dc2626;
        }

        .component-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .component-yellow {
          background: #fffbeb;
          color: #d97706;
        }

        .component-purple {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .component-stat-label {
          color: #94a3b8;

          font-size: 9px;

          font-weight: 800;

          letter-spacing: .8px;
        }

        .component-stat-number {
          color: #172033;

          font-size: 28px;

          font-weight: 800;
        }

        .component-stat-desc {
          margin-top: 5px;

          color: #94a3b8;

          font-size: 10px;
        }

        /* ==================================================
           CARD
           ================================================== */

        .component-card {
          margin-bottom: 24px;

          background: white;

          border:
            1px solid #e5e9ef;

          border-radius: 17px;

          box-shadow:
            0 4px 18px
            rgba(15,23,42,.04);

          overflow: hidden;
        }

        .component-form {
          padding: 27px;
        }

        .component-section-title {
          display: flex;

          align-items: center;

          gap: 13px;
        }

        .component-section-icon {
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

        .component-section-title h2 {
          margin: 0;

          font-size: 17px;

          font-weight: 750;
        }

        .component-section-title p {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 11px;
        }

        .component-line {
          height: 1px;

          margin: 22px 0;

          background: #eef1f5;
        }

        /* ==================================================
           FORM
           ================================================== */

        .component-form-grid {
          display: grid;

          grid-template-columns:
            1.4fr 1fr 1fr;

          gap: 18px;
        }

        .component-field label {
          display: block;

          margin-bottom: 7px;

          color: #334155;

          font-size: 12px;

          font-weight: 700;
        }

        .component-required {
          color: #dc2626;

          margin-left: 3px;
        }

        .component-field select,
        .component-field input {
          width: 100%;

          height: 44px;

          padding: 0 13px;

          border:
            1px solid #dce2e9;

          border-radius: 9px;

          background: white;

          color: #172033;

          font-family: inherit;

          font-size: 12px;

          outline: none;

          transition: .2s;
        }

        .component-field select:focus,
        .component-field input:focus {
          border-color: #dc2626;

          box-shadow:
            0 0 0 3px
            rgba(220,38,38,.08);
        }

        .component-field small {
          display: block;

          margin-top: 5px;

          color: #94a3b8;

          font-size: 10px;
        }

        /* ==================================================
           SELECTED DONOR
           ================================================== */

        .component-selected-donor {
          display: flex;

          align-items: center;

          gap: 14px;

          margin-top: 18px;

          padding: 15px;

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

        .component-donor-avatar {
          width: 46px;
          height: 46px;

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

        .component-donor-info {
          flex: 1;
        }

        .component-donor-name {
          color: #172033;

          font-size: 14px;

          font-weight: 750;
        }

        .component-donor-meta {
          display: flex;

          flex-wrap: wrap;

          gap: 7px;

          margin-top: 6px;
        }

        .component-meta {
          padding: 5px 9px;

          border-radius: 6px;

          font-size: 9px;

          font-weight: 750;
        }

        .component-meta-id {
          background: #eff6ff;
          color: #2563eb;
        }

        .component-meta-blood {
          background: #fff1f2;
          color: #dc2626;
        }

        .component-meta-donation {
          background: #f5f3ff;
          color: #7c3aed;
        }

        /* ==================================================
           COMPONENT PREVIEW
           ================================================== */

        .component-preview {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-top: 18px;

          padding: 13px 15px;

          border-radius: 10px;

          background: #f8fafc;

          border:
            1px solid #eef1f5;
        }

        .component-preview-icon {
          width: 35px;
          height: 35px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 9px;

          font-size: 16px;
        }

        .preview-rbc {
          background: #fff1f2;
          color: #dc2626;
        }

        .preview-plasma {
          background: #eff6ff;
          color: #2563eb;
        }

        .preview-platelets {
          background: #fffbeb;
          color: #d97706;
        }

        .component-preview-text strong {
          display: block;

          color: #334155;

          font-size: 11px;
        }

        .component-preview-text span {
          color: #94a3b8;

          font-size: 10px;
        }

        /* ==================================================
           BUTTONS
           ================================================== */

        .component-form-footer {
          display: flex;

          justify-content: flex-end;

          gap: 9px;

          margin-top: 22px;

          padding-top: 20px;

          border-top:
            1px solid #eef1f5;
        }

        .component-btn {
          height: 41px;

          padding: 0 17px;

          border-radius: 9px;

          font-family: inherit;

          font-size: 12px;

          font-weight: 750;

          cursor: pointer;

          transition: .2s;
        }

        .component-clear {
          border:
            1px solid #dce2e9;

          background: white;

          color: #64748b;
        }

        .component-clear:hover {
          background: #f8fafc;
        }

        .component-create {
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

        .component-create:hover {
          transform:
            translateY(-1px);
        }

        .component-btn:disabled {
          opacity: .55;

          cursor: not-allowed;
        }

        /* ==================================================
           RECORDS HEADER
           ================================================== */

        .component-record-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 25px 27px 18px;
        }

        .component-record-count {
          padding: 7px 11px;

          border-radius: 8px;

          background: #f1f5f9;

          color: #475569;

          font-size: 10px;

          font-weight: 750;
        }

        .component-toolbar {
          display: flex;

          gap: 10px;

          padding:
            0 27px 18px;
        }

        .component-search {
          flex: 1;

          height: 41px;

          padding: 0 14px;

          border:
            1px solid #dce2e9;

          border-radius: 9px;

          background: #f8fafc;

          color: #172033;

          font-family: inherit;

          font-size: 12px;

          outline: none;
        }

        .component-search:focus {
          background: white;

          border-color: #dc2626;

          box-shadow:
            0 0 0 3px
            rgba(220,38,38,.07);
        }

        .component-refresh {
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

        /* ==================================================
           TABLE
           ================================================== */

        .component-table-wrapper {
          overflow-x: auto;
        }

        .component-table {
          width: 100%;

          min-width: 1050px;

          border-collapse: collapse;
        }

        .component-table th {
          padding:
            13px 15px;

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

        .component-table td {
          padding:
            14px 15px;

          border-bottom:
            1px solid #f0f2f5;

          color: #475569;

          font-size: 11px;
        }

        .component-table tbody tr {
          transition: .15s;
        }

        .component-table tbody tr:hover {
          background: #fffafa;
        }

        .component-id {
          color: #172033;

          font-weight: 800;
        }

        .component-donation-id {
          color: #2563eb;

          font-weight: 750;
        }

        .component-table-donor {
          display: flex;

          align-items: center;

          gap: 9px;
        }

        .component-small-avatar {
          width: 31px;
          height: 31px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background: #fff1f2;

          color: #c51f2a;

          font-size: 11px;

          font-weight: 800;
        }

        .component-table-donor-name {
          color: #334155;

          font-weight: 700;
        }

        .component-blood-badge {
          display: inline-flex;

          align-items: center;

          padding: 5px 9px;

          border-radius: 6px;

          background: #fff1f2;

          color: #dc2626;

          font-size: 9px;

          font-weight: 800;
        }

        /* ==================================================
           TYPE BADGES
           ================================================== */

        .component-type-badge {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 6px 10px;

          border-radius: 999px;

          font-size: 9px;

          font-weight: 800;
        }

        .type-rbc {
          background: #fff1f2;
          color: #dc2626;
        }

        .type-plasma {
          background: #eff6ff;
          color: #2563eb;
        }

        .type-platelets {
          background: #fffbeb;
          color: #b45309;
        }

        .type-other {
          background: #f1f5f9;
          color: #475569;
        }

        .component-quantity {
          color: #172033;

          font-weight: 800;
        }

        .component-unit {
          margin-left: 4px;

          color: #94a3b8;

          font-size: 9px;
        }

        .component-expiry {
          color: #64748b;

          font-size: 10px;
        }

        /* ==================================================
           EMPTY
           ================================================== */

        .component-empty {
          min-height: 230px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          color: #94a3b8;
        }

        .component-empty-icon {
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

        .component-empty h3 {
          margin:
            12px 0 4px;

          color: #334155;

          font-size: 14px;
        }

        .component-empty p {
          margin: 0;

          font-size: 11px;
        }

        .component-spinner {
          width: 30px;
          height: 30px;

          border:
            3px solid #fee2e2;

          border-top-color:
            #c51f2a;

          border-radius: 50%;

          animation:
            component-spin
            .8s linear infinite;
        }

        @keyframes component-spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        /* ==================================================
           RESPONSIVE
           ================================================== */

        @media (max-width: 1100px) {

          .component-stats {
            grid-template-columns:
              repeat(2,1fr);
          }

          .component-form-grid {
            grid-template-columns:
              1fr 1fr;
          }

        }

        @media (max-width: 800px) {

          .component-page {
            padding: 18px;
          }

          .component-header {
            align-items: flex-start;

            flex-direction: column;
          }

          .component-module-badge {
            display: none;
          }

          .component-form-grid {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 600px) {

          .component-page {
            padding: 12px;
          }

          .component-stats {
            grid-template-columns: 1fr;
          }

          .component-header h1 {
            font-size: 23px;
          }

          .component-form {
            padding: 20px;
          }

          .component-toolbar {
            flex-direction: column;
          }

          .component-refresh {
            width: 100%;
          }

          .component-form-footer {
            flex-direction: column;
          }

          .component-btn {
            width: 100%;
          }

        }

      `}</style>


      {/* ====================================================
          HEADER
          ==================================================== */}

      <div className="component-header">

        <div className="component-header-left">

          <div className="component-header-icon">
            🩸
          </div>

          <div>

            <div className="component-breadcrumb">
              BLOOD BANK
              <span>/</span>
              PROCESSING
            </div>

            <h1>
              Blood Components
            </h1>

            <p>
              Separate and manage blood
              components from donations.
            </p>

          </div>

        </div>

        <div className="component-module-badge">

          <span className="component-live-dot"></span>

          Component Module

        </div>

      </div>


      {/* ====================================================
          ALERTS
          ==================================================== */}

      {message && (

        <div className="
          component-alert
          component-success
        ">

          <div className="component-alert-icon">
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
          component-alert
          component-error
        ">

          <div className="component-alert-icon">
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

      <div className="component-stats">

        <div className="component-stat">

          <div className="component-stat-top">

            <div className="
              component-stat-icon
              component-red
            ">
              🩸
            </div>

            <span className="component-stat-label">
              TOTAL COMPONENTS
            </span>

          </div>

          <div className="component-stat-number">
            {totalComponents}
          </div>

          <div className="component-stat-desc">
            Processed blood components
          </div>

        </div>


        <div className="component-stat">

          <div className="component-stat-top">

            <div className="
              component-stat-icon
              component-blue
            ">
              R
            </div>

            <span className="component-stat-label">
              RBC
            </span>

          </div>

          <div className="component-stat-number">
            {rbcCount}
          </div>

          <div className="component-stat-desc">
            Red blood cell units
          </div>

        </div>


        <div className="component-stat">

          <div className="component-stat-top">

            <div className="
              component-stat-icon
              component-yellow
            ">
              P
            </div>

            <span className="component-stat-label">
              PLASMA
            </span>

          </div>

          <div className="component-stat-number">
            {plasmaCount}
          </div>

          <div className="component-stat-desc">
            Plasma components
          </div>

        </div>


        <div className="component-stat">

          <div className="component-stat-top">

            <div className="
              component-stat-icon
              component-purple
            ">
              U
            </div>

            <span className="component-stat-label">
              PLATELETS
            </span>

          </div>

          <div className="component-stat-number">
            {plateletCount}
          </div>

          <div className="component-stat-desc">
            Platelet components
          </div>

        </div>

      </div>


      {/* ====================================================
          CREATE COMPONENT
          ==================================================== */}

      <div className="
        component-card
        component-form
      ">

        <div className="component-section-title">

          <div className="component-section-icon">
            +
          </div>

          <div>

            <h2>
              Create Blood Component
            </h2>

            <p>
              Select a donation and record
              the separated blood component.
            </p>

          </div>

        </div>

        <div className="component-line"></div>


        <div className="component-form-grid">

          {/* DONATION */}

          <div className="component-field">

            <label>
              Donation
              <span className="component-required">
                *
              </span>
            </label>

            <select
              name="donationId"
              value={form.donationId}
              onChange={handleChange}
            >

              <option value="">
                Select donation
              </option>

              {donations.map(
                (donation) => {

                  const donor =
                    getDonor(
                      donation
                    );

                  return (

                    <option
                      key={
                        donation.donationId
                      }
                      value={
                        donation.donationId
                      }
                    >

                      Donation #
                      {donation.donationId}
                      {" — "}
                      {getDonorName(
                        donor
                      )}
                      {" — "}
                      {getBloodGroup(
                        donor
                      )}

                    </option>

                  );
                }
              )}

            </select>

            <small>
              Select the source donation.
            </small>

          </div>


          {/* TYPE */}

          <div className="component-field">

            <label>
              Component Type
              <span className="component-required">
                *
              </span>
            </label>

            <select
              name="componentType"
              value={
                form.componentType
              }
              onChange={handleChange}
            >

              <option value="">
                Select type
              </option>

              <option value="RBC">
                🩸 Red Blood Cells
              </option>

              <option value="PLASMA">
                💧 Plasma
              </option>

              <option value="PLATELETS">
                🟡 Platelets
              </option>

              <option value="CRYOPRECIPITATE">
                ❄ Cryoprecipitate
              </option>

              <option value="WHOLE_BLOOD">
                🩸 Whole Blood
              </option>

            </select>

            <small>
              Select the separated component.
            </small>

          </div>


          {/* QUANTITY */}

          <div className="component-field">

            <label>
              Quantity
              <span className="component-required">
                *
              </span>
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              name="quantity"
              value={
                form.quantity
              }
              onChange={handleChange}
              placeholder="e.g. 200"
            />

            <small>
              Enter the collected quantity.
            </small>

          </div>

        </div>


        {/* SELECTED DONOR */}

        {selectedDonation && (

          <div className="
            component-selected-donor
          ">

            <div className="
              component-donor-avatar
            ">

              {getDonorName(
                selectedDonor
              )
                .charAt(0)
                .toUpperCase()}

            </div>

            <div className="
              component-donor-info
            ">

              <div className="
                component-donor-name
              ">

                {getDonorName(
                  selectedDonor
                )}

              </div>

              <div className="
                component-donor-meta
              ">

                <span className="
                  component-meta
                  component-meta-id
                ">
                  Donor #
                  {selectedDonor?.donorId ??
                    selectedDonation?.donorId ??
                    "-"}
                </span>

                <span className="
                  component-meta
                  component-meta-blood
                ">
                  🩸
                  {" "}
                  {getBloodGroup(
                    selectedDonor
                  )}
                </span>

                <span className="
                  component-meta
                  component-meta-donation
                ">
                  Donation #
                  {selectedDonation.donationId}
                </span>

              </div>

            </div>

          </div>

        )}


        {/* COMPONENT PREVIEW */}

        {form.componentType && (

          <div className="component-preview">

            <div
              className={`
                component-preview-icon
                ${
                  form.componentType === "RBC"
                    ? "preview-rbc"
                    : form.componentType ===
                      "PLASMA"
                    ? "preview-plasma"
                    : "preview-platelets"
                }
              `}
            >
              {form.componentType === "RBC"
                ? "🩸"
                : form.componentType ===
                  "PLASMA"
                ? "💧"
                : "🟡"}
            </div>

            <div className="
              component-preview-text
            ">

              <strong>
                {getComponentLabel(
                  form.componentType
                )}
              </strong>

              <span>
                Quantity:
                {" "}
                {form.quantity || "0"}
              </span>

            </div>

          </div>

        )}


        {/* BUTTONS */}

        <div className="
          component-form-footer
        ">

          <button
            className="
              component-btn
              component-clear
            "
            onClick={resetForm}
            disabled={saving}
          >
            Clear
          </button>

          <button
            className="
              component-btn
              component-create
            "
            onClick={handleSubmit}
            disabled={saving}
          >

            {saving
              ? "Creating..."
              : "＋ Create Component"}

          </button>

        </div>

      </div>


      {/* ====================================================
          RECORDS
          ==================================================== */}

      <div className="component-card">

        <div className="
          component-record-header
        ">

          <div className="
            component-section-title
          ">

            <div
              className="
                component-section-icon
              "
              style={{
                background: "#eff6ff",
                color: "#2563eb"
              }}
            >
              ☷
            </div>

            <div>

              <h2>
                Blood Component Records
              </h2>

              <p>
                View processed components
                and donor information.
              </p>

            </div>

          </div>

          <div className="
            component-record-count
          ">
            {filteredComponents.length}
            {" "}records
          </div>

        </div>


        {/* SEARCH */}

        <div className="
          component-toolbar
        ">

          <input
            className="
              component-search
            "
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="
              Search component, donation,
              donor name or blood group...
            "
          />

          <button
            className="
              component-refresh
            "
            onClick={loadData}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="
            component-empty
          ">

            <div className="
              component-spinner
            "></div>

            <h3>
              Loading components...
            </h3>

            <p>
              Please wait.
            </p>

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          filteredComponents.length === 0 && (

            <div className="
              component-empty
            ">

              <div className="
                component-empty-icon
              ">
                🩸
              </div>

              <h3>
                No components found
              </h3>

              <p>
                Create a blood component
                to see it here.
              </p>

            </div>

          )}


        {/* TABLE */}

        {!loading &&
          filteredComponents.length > 0 && (

            <div className="
              component-table-wrapper
            ">

              <table className="
                component-table
              ">

                <thead>

                  <tr>

                    <th>
                      Component
                    </th>

                    <th>
                      Donation
                    </th>

                    <th>
                      Donor
                    </th>

                    <th>
                      Blood Group
                    </th>

                    <th>
                      Component Type
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Expiry Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredComponents.map(
                    (component) => {

                      const donationId =
                        component.donation?.donationId ??
                        component.donationId ??
                        "";

                      const donation =
                        getDonation(
                          donationId
                        );

                      const donor =
                        getDonor(
                          donation
                        );

                      const type =
                        component.componentType;

                      let typeClass =
                        "type-other";

                      if (
                        type === "RBC"
                      ) {
                        typeClass =
                          "type-rbc";
                      }

                      if (
                        type === "PLASMA"
                      ) {
                        typeClass =
                          "type-plasma";
                      }

                      if (
                        type === "PLATELETS"
                      ) {
                        typeClass =
                          "type-platelets";
                      }

                      return (

                        <tr
                          key={
                            component.componentId
                          }
                        >

                          {/* COMPONENT */}

                          <td>

                            <span className="
                              component-id
                            ">

                              #
                              {
                                component.componentId
                              }

                            </span>

                          </td>


                          {/* DONATION */}

                          <td>

                            <span className="
                              component-donation-id
                            ">

                              #
                              {donationId || "-"}

                            </span>

                          </td>


                          {/* DONOR */}

                          <td>

                            <div className="
                              component-table-donor
                            ">

                              <div className="
                                component-small-avatar
                              ">

                                {getDonorName(
                                  donor
                                )
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <span className="
                                component-table-donor-name
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
                              component-blood-badge
                            ">

                              🩸
                              {" "}
                              {getBloodGroup(
                                donor
                              )}

                            </span>

                          </td>


                          {/* TYPE */}

                          <td>

                            <span
                              className={`
                                component-type-badge
                                ${typeClass}
                              `}
                            >

                              {type === "RBC"
                                ? "🩸"
                                : type === "PLASMA"
                                ? "💧"
                                : type ===
                                  "PLATELETS"
                                ? "🟡"
                                : "•"}

                              {getComponentLabel(
                                type
                              )}

                            </span>

                          </td>


                          {/* QUANTITY */}

                          <td>

                            <span className="
                              component-quantity
                            ">

                              {Number(
                                component.quantity ||
                                0
                              ).toFixed(2)}

                            </span>

                            <span className="
                              component-unit
                            ">
                              units
                            </span>

                          </td>


                          {/* EXPIRY */}

                          <td>

                            <span className="
                              component-expiry
                            ">

                              {
                                component.expiryDate ||
                                "-"
                              }

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

export default BloodComponentPage;