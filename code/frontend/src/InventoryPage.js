import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { apiFetch } from "./api";

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH INVENTORY
  // ==========================================================

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const url = filter
        ? `/api/inventory/group/${encodeURIComponent(filter)}`
        : "/api/inventory";

      const data = await apiFetch(url);

      setInventory(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Inventory loading error:",
        err
      );

      setInventory([]);

      setError(
        err.message ||
        "Unable to load inventory."
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredInventory = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return inventory;
    }

    return inventory.filter((item) => {
      return (
        String(
          item.inventoryId ?? ""
        )
          .toLowerCase()
          .includes(query) ||

        String(
          item.componentId ?? ""
        )
          .toLowerCase()
          .includes(query) ||

        String(
          item.donationId ?? ""
        )
          .toLowerCase()
          .includes(query) ||

        String(
          item.bloodGroup ?? ""
        )
          .toLowerCase()
          .includes(query) ||

        String(
          item.componentType ?? ""
        )
          .toLowerCase()
          .includes(query) ||

        String(
          item.stockStatus ?? ""
        )
          .toLowerCase()
          .includes(query) ||

        String(
          item.storageLocation ?? ""
        )
          .toLowerCase()
          .includes(query)
      );
    });
  }, [inventory, search]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalQuantity = inventory.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  const availableCount = inventory.filter(
    (item) =>
      String(item.stockStatus)
        .toUpperCase() === "AVAILABLE"
  ).length;

  const lowStockCount = inventory.filter(
    (item) =>
      String(item.stockStatus)
        .toUpperCase() === "LOW_STOCK"
  ).length;

  const outOfStockCount = inventory.filter(
    (item) =>
      String(item.stockStatus)
        .toUpperCase() === "OUT_OF_STOCK"
  ).length;

  // ==========================================================
  // COMPONENT COUNTS
  // ==========================================================

  const rbcCount = inventory.filter(
    (item) =>
      item.componentType === "RBC"
  ).length;

  const plasmaCount = inventory.filter(
    (item) =>
      item.componentType === "PLASMA"
  ).length;

  const plateletCount = inventory.filter(
    (item) =>
      item.componentType === "PLATELETS"
  ).length;

  // ==========================================================
  // HELPERS
  // ==========================================================

  const formatBloodGroup = (group) => {
    if (!group) return "-";

    return String(group)
      .replace("_POSITIVE", "+")
      .replace("_NEGATIVE", "-");
  };

  const getComponentName = (type) => {
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
        return type || "Unknown";
    }
  };

  const getComponentIcon = (type) => {
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
        return "•";
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="inventory-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .inventory-page {
          min-height: 100vh;

          padding: 30px;

          background:
            linear-gradient(
              135deg,
              #f5f7fb 0%,
              #eef2f7 100%
            );

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

        .inventory-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 28px 30px;

          margin-bottom: 24px;

          border-radius: 20px;

          background:
            linear-gradient(
              135deg,
              #651018 0%,
              #9d1823 55%,
              #d52e3b 100%
            );

          color: white;

          box-shadow:
            0 14px 35px
            rgba(112, 17, 27, .20);

          position: relative;

          overflow: hidden;
        }

        .inventory-header::after {
          content: "";

          position: absolute;

          width: 220px;
          height: 220px;

          right: -70px;
          top: -100px;

          border-radius: 50%;

          background:
            rgba(255,255,255,.07);
        }

        .inventory-header-left {
          display: flex;

          align-items: center;

          gap: 18px;

          position: relative;

          z-index: 1;
        }

        .inventory-header-icon {
          width: 62px;
          height: 62px;

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

          backdrop-filter: blur(5px);
        }

        .inventory-breadcrumb {
          margin-bottom: 5px;

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 1.7px;

          opacity: .70;
        }

        .inventory-breadcrumb span {
          margin: 0 7px;
        }

        .inventory-header h1 {
          margin: 0;

          font-size: 29px;

          font-weight: 800;
        }

        .inventory-header p {
          margin: 6px 0 0;

          font-size: 13px;

          opacity: .82;
        }

        .inventory-live {
          display: flex;

          align-items: center;

          gap: 8px;

          padding: 9px 13px;

          border-radius: 999px;

          background:
            rgba(255,255,255,.12);

          font-size: 10px;

          font-weight: 750;

          position: relative;

          z-index: 2;
        }

        .inventory-live-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #86efac;

          box-shadow:
            0 0 0 4px
            rgba(134,239,172,.12);
        }

        /* ==================================================
           ERROR
           ================================================== */

        .inventory-alert {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-bottom: 20px;

          padding: 14px 16px;

          border-radius: 12px;

          background: #fef2f2;

          border:
            1px solid #fecaca;

          color: #b91c1c;

          font-size: 12px;
        }

        .inventory-alert-icon {
          width: 29px;
          height: 29px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background: #b91c1c;

          color: white;

          font-weight: 800;
        }

        .inventory-alert button {
          margin-left: auto;

          border: none;

          background: transparent;

          color: currentColor;

          font-size: 20px;

          cursor: pointer;
        }

        /* ==================================================
           STAT CARDS
           ================================================== */

        .inventory-stats {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 16px;

          margin-bottom: 24px;
        }

        .inventory-stat {
          background: white;

          border:
            1px solid #e4e8ef;

          border-radius: 16px;

          padding: 19px;

          box-shadow:
            0 5px 18px
            rgba(15,23,42,.045);

          transition: .2s;
        }

        .inventory-stat:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 10px 25px
            rgba(15,23,42,.08);
        }

        .inventory-stat-top {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-bottom: 12px;
        }

        .inventory-stat-icon {
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

        .inventory-stat-label {
          color: #94a3b8;

          font-size: 9px;

          font-weight: 850;

          letter-spacing: .7px;
        }

        .inventory-stat-number {
          color: #172033;

          font-size: 27px;

          font-weight: 850;
        }

        .inventory-stat-desc {
          margin-top: 4px;

          color: #94a3b8;

          font-size: 10px;
        }

        /* ==================================================
           COMPONENT SUMMARY
           ================================================== */

        .inventory-summary {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 14px;

          margin-bottom: 24px;
        }

        .inventory-summary-item {
          display: flex;

          align-items: center;

          gap: 13px;

          padding: 15px;

          background: white;

          border:
            1px solid #e4e8ef;

          border-radius: 13px;
        }

        .inventory-summary-icon {
          width: 39px;
          height: 39px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 10px;

          font-size: 17px;
        }

        .summary-rbc {
          background: #fff1f2;
        }

        .summary-plasma {
          background: #eff6ff;
        }

        .summary-platelets {
          background: #fffbeb;
        }

        .inventory-summary strong {
          display: block;

          color: #334155;

          font-size: 11px;
        }

        .inventory-summary span {
          display: block;

          margin-top: 3px;

          color: #94a3b8;

          font-size: 10px;
        }

        /* ==================================================
           MAIN CARD
           ================================================== */

        .inventory-card {
          background: white;

          border:
            1px solid #e4e8ef;

          border-radius: 18px;

          box-shadow:
            0 6px 22px
            rgba(15,23,42,.05);

          overflow: hidden;
        }

        .inventory-card-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 24px 26px 18px;
        }

        .inventory-title {
          display: flex;

          align-items: center;

          gap: 13px;
        }

        .inventory-title-icon {
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

        .inventory-title h2 {
          margin: 0;

          color: #172033;

          font-size: 17px;

          font-weight: 780;
        }

        .inventory-title p {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 11px;
        }

        .inventory-count {
          padding: 7px 11px;

          border-radius: 8px;

          background: #f1f5f9;

          color: #475569;

          font-size: 10px;

          font-weight: 800;
        }

        /* ==================================================
           TOOLBAR
           ================================================== */

        .inventory-toolbar {
          display: flex;

          align-items: center;

          gap: 10px;

          padding:
            0 26px 19px;
        }

        .inventory-search-wrapper {
          flex: 1;

          position: relative;
        }

        .inventory-search-icon {
          position: absolute;

          left: 13px;

          top: 50%;

          transform:
            translateY(-50%);

          color: #94a3b8;

          font-size: 14px;
        }

        .inventory-search {
          width: 100%;

          height: 42px;

          padding:
            0 13px 0 37px;

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

        .inventory-search:focus {
          background: white;

          border-color: #dc2626;

          box-shadow:
            0 0 0 3px
            rgba(220,38,38,.07);
        }

        .inventory-filter {
          height: 42px;

          min-width: 150px;

          padding: 0 12px;

          border:
            1px solid #dce2e9;

          border-radius: 10px;

          background: white;

          color: #334155;

          font-family: inherit;

          font-size: 11px;

          font-weight: 650;

          outline: none;

          cursor: pointer;
        }

        .inventory-filter:focus {
          border-color: #dc2626;
        }

        .inventory-refresh {
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

          transition: .2s;
        }

        .inventory-refresh:hover {
          background: #f8fafc;

          color: #334155;
        }

        /* ==================================================
           TABLE
           ================================================== */

        .inventory-table-wrapper {
          overflow-x: auto;
        }

        .inventory-table {
          width: 100%;

          min-width: 1050px;

          border-collapse: collapse;
        }

        .inventory-table th {
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

        .inventory-table td {
          padding:
            15px;

          border-bottom:
            1px solid #f0f2f5;

          color: #475569;

          font-size: 11px;

          vertical-align: middle;
        }

        .inventory-table tbody tr {
          transition: .15s;
        }

        .inventory-table tbody tr:hover {
          background: #fffafa;
        }

        /* ==================================================
           IDs
           ================================================== */

        .inventory-id {
          color: #172033;

          font-weight: 850;
        }

        .inventory-component-id {
          color: #7c3aed;

          font-weight: 750;
        }

        .inventory-donation-id {
          color: #2563eb;

          font-weight: 750;
        }

        /* ==================================================
           BLOOD GROUP
           ================================================== */

        .blood-group {
          display: inline-flex;

          align-items: center;

          gap: 5px;

          padding: 6px 10px;

          border-radius: 7px;

          background: #fff1f2;

          color: #c51f2a;

          font-size: 10px;

          font-weight: 850;
        }

        /* ==================================================
           COMPONENT BADGE
           ================================================== */

        .component-badge {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          padding: 6px 10px;

          border-radius: 999px;

          font-size: 9px;

          font-weight: 850;
        }

        .component-rbc {
          background: #fff1f2;

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

        .component-other {
          background: #f1f5f9;

          color: #475569;
        }

        /* ==================================================
           QUANTITY
           ================================================== */

        .quantity-wrapper {
          display: flex;

          align-items: center;

          gap: 7px;
        }

        .quantity-number {
          color: #172033;

          font-size: 13px;

          font-weight: 850;
        }

        .quantity-bar {
          width: 50px;
          height: 5px;

          overflow: hidden;

          border-radius: 99px;

          background: #edf0f4;
        }

        .quantity-bar-fill {
          height: 100%;

          border-radius: 99px;

          background:
            linear-gradient(
              90deg,
              #c51f2a,
              #ef4444
            );
        }

        /* ==================================================
           STATUS
           ================================================== */

        .stock-badge {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 6px 10px;

          border-radius: 999px;

          font-size: 8px;

          font-weight: 850;
        }

        .stock-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: currentColor;
        }

        .stock-available {
          background: #ecfdf5;

          color: #047857;
        }

        .stock-low {
          background: #fff7ed;

          color: #c2410c;
        }

        .stock-out {
          background: #fef2f2;

          color: #b91c1c;
        }

        .stock-unknown {
          background: #f1f5f9;

          color: #64748b;
        }

        /* ==================================================
           LOCATION
           ================================================== */

        .location {
          display: inline-flex;

          align-items: center;

          gap: 5px;

          color: #64748b;

          font-size: 10px;
        }

        /* ==================================================
           EMPTY
           ================================================== */

        .inventory-empty {
          min-height: 260px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          color: #94a3b8;
        }

        .inventory-empty-icon {
          width: 56px;
          height: 56px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background: #fff1f2;

          color: #c51f2a;

          font-size: 25px;
        }

        .inventory-empty h3 {
          margin:
            13px 0 4px;

          color: #334155;

          font-size: 14px;
        }

        .inventory-empty p {
          margin: 0;

          font-size: 11px;
        }

        .inventory-spinner {
          width: 31px;
          height: 31px;

          border:
            3px solid #fee2e2;

          border-top-color:
            #c51f2a;

          border-radius: 50%;

          animation:
            inventory-spin
            .8s linear infinite;
        }

        @keyframes inventory-spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        /* ==================================================
           RESPONSIVE
           ================================================== */

        @media (max-width: 1050px) {

          .inventory-stats {
            grid-template-columns:
              repeat(2,1fr);
          }

          .inventory-summary {
            grid-template-columns:
              1fr;
          }

        }

        @media (max-width: 750px) {

          .inventory-page {
            padding: 18px;
          }

          .inventory-header {
            align-items: flex-start;

            flex-direction: column;
          }

          .inventory-live {
            display: none;
          }

          .inventory-toolbar {
            flex-direction: column;

            align-items: stretch;
          }

          .inventory-filter,
          .inventory-refresh {
            width: 100%;
          }

        }

        @media (max-width: 550px) {

          .inventory-page {
            padding: 12px;
          }

          .inventory-stats {
            grid-template-columns: 1fr;
          }

          .inventory-header h1 {
            font-size: 23px;
          }

          .inventory-header-icon {
            width: 52px;
            height: 52px;

            font-size: 25px;
          }

          .inventory-card-header {
            padding:
              20px 18px 15px;
          }

          .inventory-toolbar {
            padding:
              0 18px 17px;
          }

        }

      `}</style>


      {/* ====================================================
          HEADER
          ==================================================== */}

      <div className="inventory-header">

        <div className="inventory-header-left">

          <div className="inventory-header-icon">
            📦
          </div>

          <div>

            <div className="inventory-breadcrumb">
              BLOOD BANK
              <span>/</span>
              STORAGE
            </div>

            <h1>
              Inventory Management
            </h1>

            <p>
              Monitor blood stock, components
              and storage locations.
            </p>

          </div>

        </div>

        <div className="inventory-live">

          <span className="inventory-live-dot"></span>

          Live Inventory

        </div>

      </div>


      {/* ====================================================
          ERROR
          ==================================================== */}

      {error && (

        <div className="inventory-alert">

          <div className="inventory-alert-icon">
            !
          </div>

          <span>
            {error}
          </span>

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

      <div className="inventory-stats">

        <div className="inventory-stat">

          <div className="inventory-stat-top">

            <div className="
              inventory-stat-icon
              stat-red
            ">
              📦
            </div>

            <span className="
              inventory-stat-label
            ">
              TOTAL STOCK
            </span>

          </div>

          <div className="
            inventory-stat-number
          ">
            {totalQuantity.toFixed(2)}
          </div>

          <div className="
            inventory-stat-desc
          ">
            Total units in inventory
          </div>

        </div>


        <div className="inventory-stat">

          <div className="inventory-stat-top">

            <div className="
              inventory-stat-icon
              stat-green
            ">
              ✓
            </div>

            <span className="
              inventory-stat-label
            ">
              AVAILABLE
            </span>

          </div>

          <div className="
            inventory-stat-number
          ">
            {availableCount}
          </div>

          <div className="
            inventory-stat-desc
          ">
            Stock records available
          </div>

        </div>


        <div className="inventory-stat">

          <div className="inventory-stat-top">

            <div className="
              inventory-stat-icon
              stat-orange
            ">
              !
            </div>

            <span className="
              inventory-stat-label
            ">
              LOW STOCK
            </span>

          </div>

          <div className="
            inventory-stat-number
          ">
            {lowStockCount}
          </div>

          <div className="
            inventory-stat-desc
          ">
            Requires attention
          </div>

        </div>


        <div className="inventory-stat">

          <div className="inventory-stat-top">

            <div className="
              inventory-stat-icon
              stat-blue
            ">
              !
            </div>

            <span className="
              inventory-stat-label
            ">
              OUT OF STOCK
            </span>

          </div>

          <div className="
            inventory-stat-number
          ">
            {outOfStockCount}
          </div>

          <div className="
            inventory-stat-desc
          ">
            Currently unavailable
          </div>

        </div>

      </div>


      {/* ====================================================
          COMPONENT SUMMARY
          ==================================================== */}

      <div className="inventory-summary">

        <div className="
          inventory-summary-item
        ">

          <div className="
            inventory-summary-icon
            summary-rbc
          ">
            🩸
          </div>

          <div>

            <strong>
              Red Blood Cells
            </strong>

            <span>
              {rbcCount} inventory records
            </span>

          </div>

        </div>


        <div className="
          inventory-summary-item
        ">

          <div className="
            inventory-summary-icon
            summary-plasma
          ">
            💧
          </div>

          <div>

            <strong>
              Plasma
            </strong>

            <span>
              {plasmaCount} inventory records
            </span>

          </div>

        </div>


        <div className="
          inventory-summary-item
        ">

          <div className="
            inventory-summary-icon
            summary-platelets
          ">
            🟡
          </div>

          <div>

            <strong>
              Platelets
            </strong>

            <span>
              {plateletCount} inventory records
            </span>

          </div>

        </div>

      </div>


      {/* ====================================================
          INVENTORY RECORDS
          ==================================================== */}

      <div className="inventory-card">

        <div className="
          inventory-card-header
        ">

          <div className="
            inventory-title
          ">

            <div className="
              inventory-title-icon
            ">
              ☷
            </div>

            <div>

              <h2>
                Inventory Records
              </h2>

              <p>
                View and monitor all blood
                stock records.
              </p>

            </div>

          </div>

          <div className="
            inventory-count
          ">
            {filteredInventory.length}
            {" "}records
          </div>

        </div>


        {/* ==================================================
            TOOLBAR
            ================================================== */}

        <div className="
          inventory-toolbar
        ">

          <div className="
            inventory-search-wrapper
          ">

            <span className="
              inventory-search-icon
            ">
              🔍
            </span>

            <input
              className="
                inventory-search
              "
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="
                Search inventory, component,
                donation or location...
              "
            />

          </div>


          <select
            className="
              inventory-filter
            "
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
          >

            <option value="">
              All Blood Groups
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


          <button
            className="
              inventory-refresh
            "
            onClick={fetchInventory}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>


        {/* ==================================================
            LOADING
            ================================================== */}

        {loading && (

          <div className="
            inventory-empty
          ">

            <div className="
              inventory-spinner
            "></div>

            <h3>
              Loading inventory...
            </h3>

            <p>
              Please wait while stock
              records are loaded.
            </p>

          </div>

        )}


        {/* ==================================================
            EMPTY
            ================================================== */}

        {!loading &&
          filteredInventory.length === 0 && (

            <div className="
              inventory-empty
            ">

              <div className="
                inventory-empty-icon
              ">
                📦
              </div>

              <h3>
                No inventory found
              </h3>

              <p>
                No stock records match
                your current filters.
              </p>

            </div>

          )}


        {/* ==================================================
            TABLE
            ================================================== */}

        {!loading &&
          filteredInventory.length > 0 && (

            <div className="
              inventory-table-wrapper
            ">

              <table className="
                inventory-table
              ">

                <thead>

                  <tr>

                    <th>
                      Inventory ID
                    </th>

                    <th>
                      Component ID
                    </th>

                    <th>
                      Donation ID
                    </th>

                    <th>
                      Blood Group
                    </th>

                    <th>
                      Component
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Stock Status
                    </th>

                    <th>
                      Storage Location
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredInventory.map(
                    (item) => {

                      const type =
                        item.componentType;

                      let typeClass =
                        "component-other";

                      if (
                        type === "RBC"
                      ) {
                        typeClass =
                          "component-rbc";
                      }

                      if (
                        type === "PLASMA"
                      ) {
                        typeClass =
                          "component-plasma";
                      }

                      if (
                        type === "PLATELETS"
                      ) {
                        typeClass =
                          "component-platelets";
                      }

                      const status =
                        String(
                          item.stockStatus ||
                          ""
                        ).toUpperCase();

                      let statusClass =
                        "stock-unknown";

                      if (
                        status ===
                        "AVAILABLE"
                      ) {
                        statusClass =
                          "stock-available";
                      }

                      if (
                        status ===
                        "LOW_STOCK"
                      ) {
                        statusClass =
                          "stock-low";
                      }

                      if (
                        status ===
                        "OUT_OF_STOCK"
                      ) {
                        statusClass =
                          "stock-out";
                      }

                      const quantity =
                        Number(
                          item.quantity || 0
                        );

                      const barWidth =
                        Math.min(
                          100,
                          Math.max(
                            5,
                            quantity
                          )
                        );

                      return (

                        <tr
                          key={
                            item.inventoryId
                          }
                        >

                          {/* INVENTORY ID */}

                          <td>

                            <span className="
                              inventory-id
                            ">
                              #
                              {
                                item.inventoryId
                              }
                            </span>

                          </td>


                          {/* COMPONENT ID */}

                          <td>

                            <span className="
                              inventory-component-id
                            ">
                              #
                              {
                                item.componentId ??
                                "-"
                              }
                            </span>

                          </td>


                          {/* DONATION ID */}

                          <td>

                            <span className="
                              inventory-donation-id
                            ">
                              #
                              {
                                item.donationId ??
                                "-"
                              }
                            </span>

                          </td>


                          {/* BLOOD GROUP */}

                          <td>

                            <span className="
                              blood-group
                            ">

                              🩸

                              {" "}

                              {formatBloodGroup(
                                item.bloodGroup
                              )}

                            </span>

                          </td>


                          {/* COMPONENT */}

                          <td>

                            <span
                              className={`
                                component-badge
                                ${typeClass}
                              `}
                            >

                              {getComponentIcon(
                                type
                              )}

                              {getComponentName(
                                type
                              )}

                            </span>

                          </td>


                          {/* QUANTITY */}

                          <td>

                            <div className="
                              quantity-wrapper
                            ">

                              <span className="
                                quantity-number
                              ">
                                {quantity.toFixed(2)}
                              </span>

                              <div className="
                                quantity-bar
                              ">

                                <div
                                  className="
                                    quantity-bar-fill
                                  "
                                  style={{
                                    width:
                                      `${barWidth}%`
                                  }}
                                ></div>

                              </div>

                            </div>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`
                                stock-badge
                                ${statusClass}
                              `}
                            >

                              <span className="
                                stock-dot
                              "></span>

                              {status ||
                                "UNKNOWN"}

                            </span>

                          </td>


                          {/* LOCATION */}

                          <td>

                            <span className="
                              location
                            ">

                              📍

                              {" "}

                              {
                                item.storageLocation ||
                                "Not assigned"
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

export default InventoryPage;