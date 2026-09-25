import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api";

function DonorManagementPage() {

    const [donors, setDonors] = useState([]);
    const [search, setSearch] = useState("");
    const [bloodGroup, setBloodGroup] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // =========================================================
    // FETCH DONORS
    // =========================================================

    const fetchDonors = async () => {

        try {

            setLoading(true);
            setMessage("");

            const data =
                await apiFetch("/api/donor-management");

            setDonors(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(error);

            setMessage(
                error.message ||
                "Unable to load donors."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchDonors();
    }, []);

    // =========================================================
    // FILTER DONORS
    // =========================================================

    const filteredDonors = useMemo(() => {

        const term =
            search.trim().toLowerCase();

        return donors.filter((donor) => {

            const name =
                donor.name ||
                donor.fullName ||
                "";

            const donorBloodGroup =
                donor.bloodGroup ||
                "";

            const phone =
                donor.phone ||
                donor.phoneNumber ||
                "";

            const email =
                donor.email ||
                "";

            const nic =
                donor.nic ||
                donor.nicNumber ||
                "";

            const donorStatus =
                donor.status ||
                "";

            const matchesSearch =
                !term ||
                name.toLowerCase().includes(term) ||
                donorBloodGroup
                    .toLowerCase()
                    .includes(term) ||
                phone
                    .toLowerCase()
                    .includes(term) ||
                email
                    .toLowerCase()
                    .includes(term) ||
                nic
                    .toLowerCase()
                    .includes(term);

            const matchesBloodGroup =
                bloodGroup === "ALL" ||
                donorBloodGroup === bloodGroup;

            const matchesStatus =
                statusFilter === "ALL" ||
                donorStatus === statusFilter;

            return (
                matchesSearch &&
                matchesBloodGroup &&
                matchesStatus
            );
        });

    }, [
        donors,
        search,
        bloodGroup,
        statusFilter
    ]);

    // =========================================================
    // STATISTICS
    // =========================================================

    const totalDonors =
        donors.length;

    const activeDonors =
        donors.filter(
            donor => donor.status === "ACTIVE"
        ).length;

    const pendingDonors =
        donors.filter(
            donor => donor.status === "PENDING"
        ).length;

    const inactiveDonors =
        donors.filter(
            donor => donor.status === "INACTIVE"
        ).length;

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return date;
        }

        return parsed.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    // =========================================================
    // BLOOD GROUP
    // =========================================================

    const formatBloodGroup = (group) => {

        if (!group) {
            return "—";
        }

        return group
            .replace("_POSITIVE", "+")
            .replace("_NEGATIVE", "-")
            .replace("POSITIVE", "+")
            .replace("NEGATIVE", "-");
    };

    // =========================================================
    // BLOOD GROUP COLOR
    // =========================================================

    const getBloodClass = (group) => {

        if (!group) {
            return "blood-default";
        }

        if (group.startsWith("AB")) {
            return "blood-ab";
        }

        if (group.startsWith("A")) {
            return "blood-a";
        }

        if (group.startsWith("B")) {
            return "blood-b";
        }

        if (group.startsWith("O")) {
            return "blood-o";
        }

        return "blood-default";
    };

    // =========================================================
    // STATUS
    // =========================================================

    const getStatusClass = (status) => {

        if (status === "ACTIVE") {
            return "status-active";
        }

        if (status === "PENDING") {
            return "status-pending";
        }

        if (status === "INACTIVE") {
            return "status-inactive";
        }

        return "status-default";
    };

    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const clearFilters = () => {

        setSearch("");
        setBloodGroup("ALL");
        setStatusFilter("ALL");

    };

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <>
            <style>{styles}</style>

            <div className="donor-page">

                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="donor-header">

                    <div className="header-left">

                        <div className="header-icon">
                            👥
                        </div>

                        <div>

                            <h1>
                                Donor Management
                            </h1>

                            <p>
                                Manage registered donors,
                                donor information and
                                approval records.
                            </p>

                        </div>

                    </div>


                    <div className="admin-card">

                        <div className="admin-avatar">
                            {
                                (
                                    localStorage.getItem(
                                        "fullName"
                                    ) || "A"
                                )
                                    .charAt(0)
                                    .toUpperCase()
                            }
                        </div>

                        <div>

                            <strong>
                                System Administrator
                            </strong>

                            <span>
                                ADMIN
                            </span>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {message && (

                    <div className="message">

                        <span>
                            !
                        </span>

                        {message}

                        <button
                            onClick={() =>
                                setMessage("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="stats-grid">

                    <StatCard
                        icon="👥"
                        label="Total Donors"
                        value={totalDonors}
                        color="purple"
                    />

                    <StatCard
                        icon="✓"
                        label="Active Donors"
                        value={activeDonors}
                        color="green"
                    />

                    <StatCard
                        icon="⏳"
                        label="Pending"
                        value={pendingDonors}
                        color="orange"
                    />

                    <StatCard
                        icon="○"
                        label="Inactive"
                        value={inactiveDonors}
                        color="red"
                    />

                </div>


                {/* =================================================
                    DONOR CARD
                ================================================= */}

                <section className="donor-card">

                    {/* HEADER */}

                    <div className="card-header">

                        <div>

                            <h2>
                                Registered Donors
                            </h2>

                            <p>
                                {filteredDonors.length}{" "}
                                donor
                                {filteredDonors.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                displayed
                            </p>

                        </div>

                        <button
                            className="refresh-btn"
                            onClick={fetchDonors}
                            disabled={loading}
                        >

                            {loading
                                ? "⟳ Loading..."
                                : "↻ Refresh"}

                        </button>

                    </div>


                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    <div className="filter-bar">

                        <div className="search-box">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search by name, blood group, phone, email or NIC..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            {search && (

                                <button
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    ×
                                </button>

                            )}

                        </div>


                        <div className="filter-select">

                            <span>
                                🩸
                            </span>

                            <select
                                value={bloodGroup}
                                onChange={(e) =>
                                    setBloodGroup(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="ALL">
                                    All Blood Groups
                                </option>

                                <option value="A_POSITIVE">
                                    A+
                                </option>

                                <option value="A_NEGATIVE">
                                    A-
                                </option>

                                <option value="B_POSITIVE">
                                    B+
                                </option>

                                <option value="B_NEGATIVE">
                                    B-
                                </option>

                                <option value="AB_POSITIVE">
                                    AB+
                                </option>

                                <option value="AB_NEGATIVE">
                                    AB-
                                </option>

                                <option value="O_POSITIVE">
                                    O+
                                </option>

                                <option value="O_NEGATIVE">
                                    O-
                                </option>

                            </select>

                        </div>


                        <div className="filter-select">

                            <span>
                                ●
                            </span>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="ALL">
                                    All Status
                                </option>

                                <option value="ACTIVE">
                                    Active
                                </option>

                                <option value="PENDING">
                                    Pending
                                </option>

                                <option value="INACTIVE">
                                    Inactive
                                </option>

                            </select>

                        </div>


                        {(search ||
                            bloodGroup !== "ALL" ||
                            statusFilter !== "ALL") && (

                            <button
                                className="clear-btn"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        )}

                    </div>


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>DONOR</th>
                                    <th>BLOOD GROUP</th>
                                    <th>GENDER</th>
                                    <th>DATE OF BIRTH</th>
                                    <th>CONTACT</th>
                                    <th>EMAIL</th>
                                    <th>NIC</th>
                                    <th>STATUS</th>
                                    <th>APPROVED</th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredDonors.length > 0 ? (

                                    filteredDonors.map(
                                        (donor) => {

                                            const name =
                                                donor.name ||
                                                donor.fullName ||
                                                "Unknown Donor";

                                            const group =
                                                donor.bloodGroup ||
                                                "";

                                            return (

                                                <tr
                                                    key={
                                                        donor.donorId
                                                    }
                                                >

                                                    {/* DONOR */}

                                                    <td>

                                                        <div className="donor-info">

                                                            <div className="donor-avatar">

                                                                {name
                                                                    .charAt(0)
                                                                    .toUpperCase()}

                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {name}
                                                                </strong>

                                                                <small>
                                                                    Donor ID #
                                                                    {
                                                                        donor.donorId
                                                                    }
                                                                </small>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* BLOOD */}

                                                    <td>

                                                        <span
                                                            className={
                                                                `blood-badge ${getBloodClass(group)}`
                                                            }
                                                        >

                                                            🩸{" "}

                                                            {formatBloodGroup(
                                                                group
                                                            )}

                                                        </span>

                                                    </td>


                                                    {/* GENDER */}

                                                    <td>

                                                        <span className="gender">

                                                            {donor.gender === "MALE"
                                                                ? "♂"
                                                                : donor.gender === "FEMALE"
                                                                ? "♀"
                                                                : "•"}

                                                            {" "}

                                                            {donor.gender ||
                                                                "—"}

                                                        </span>

                                                    </td>


                                                    {/* DOB */}

                                                    <td>

                                                        <span className="normal-text">

                                                            {formatDate(
                                                                donor.dob
                                                            )}

                                                        </span>

                                                    </td>


                                                    {/* PHONE */}

                                                    <td>

                                                        <div className="contact-cell">

                                                            <span>
                                                                ☎
                                                            </span>

                                                            {
                                                                donor.phone ||
                                                                donor.phoneNumber ||
                                                                "—"
                                                            }

                                                        </div>

                                                    </td>


                                                    {/* EMAIL */}

                                                    <td>

                                                        <span className="email">

                                                            {
                                                                donor.email ||
                                                                "—"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* NIC */}

                                                    <td>

                                                        <span className="nic">

                                                            {
                                                                donor.nic ||
                                                                donor.nicNumber ||
                                                                "—"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        <span
                                                            className={
                                                                `status-badge ${getStatusClass(
                                                                    donor.status
                                                                )}`
                                                            }
                                                        >

                                                            <span className="status-dot" />

                                                            {
                                                                donor.status ||
                                                                "UNKNOWN"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* APPROVED */}

                                                    <td>

                                                        <span className="approved-date">

                                                            {formatDate(
                                                                donor.approvedAt
                                                            )}

                                                        </span>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            className="empty-state"
                                        >

                                            <div>
                                                👤
                                            </div>

                                            <strong>
                                                No donors found
                                            </strong>

                                            <span>
                                                Try changing
                                                your search
                                                or filters.
                                            </span>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </div>
        </>
    );
}


// =============================================================
// STAT CARD
// =============================================================

function StatCard({
    icon,
    label,
    value,
    color
}) {

    return (

        <div
            className={`stat-card stat-${color}`}
        >

            <div className="stat-icon">
                {icon}
            </div>

            <div>

                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

        </div>
    );
}


// =============================================================
// CSS
// =============================================================

const styles = `

* {
    box-sizing: border-box;
}


/* =========================================================
   PAGE
========================================================= */

.donor-page {

    min-height: 100vh;

    padding: 32px 36px 55px;

    background:
        linear-gradient(
            135deg,
            #f4f6ff 0%,
            #e9edff 50%,
            #f7f8ff 100%
        );

    font-family:
        "Segoe UI",
        Arial,
        sans-serif;

    color: #172033;
}


/* =========================================================
   HEADER
========================================================= */

.donor-header {

    max-width: 1550px;

    margin: 0 auto 26px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 24px;
}

.header-left {

    display: flex;

    align-items: center;

    gap: 18px;
}

.header-icon {

    width: 68px;
    height: 68px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 17px;

    background:
        linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
        );

    color: white;

    font-size: 31px;

    box-shadow:
        0 9px 22px
        rgba(79,70,229,.25);
}

.donor-header h1 {

    margin: 0;

    font-size: 38px;

    font-weight: 800;

    letter-spacing: -.8px;

    color: #172554;
}

.donor-header p {

    margin: 6px 0 0;

    color: #64748b;

    font-size: 16px;
}


/* =========================================================
   ADMIN CARD
========================================================= */

.admin-card {

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 11px 17px;

    background:
        rgba(255,255,255,.9);

    border:
        1px solid #dce2f0;

    border-radius: 13px;

    box-shadow:
        0 6px 20px
        rgba(15,23,42,.06);
}

.admin-avatar {

    width: 45px;
    height: 45px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background:
        linear-gradient(
            135deg,
            #4f46e5,
            #9333ea
        );

    color: white;

    font-size: 19px;

    font-weight: 800;
}

.admin-card strong {

    display: block;

    color: #334155;

    font-size: 14px;
}

.admin-card span {

    display: inline-block;

    margin-top: 5px;

    padding: 4px 8px;

    border-radius: 5px;

    background: #eef2ff;

    color: #4f46e5;

    font-size: 10px;

    font-weight: 800;
}


/* =========================================================
   MESSAGE
========================================================= */

.message {

    max-width: 1550px;

    margin: 0 auto 20px;

    display: flex;

    align-items: center;

    gap: 11px;

    padding: 13px 16px;

    border-radius: 10px;

    background: #fef2f2;

    border:
        1px solid #fecaca;

    color: #b91c1c;

    font-size: 14px;

    font-weight: 600;
}

.message button {

    margin-left: auto;

    border: none;

    background: transparent;

    color: inherit;

    cursor: pointer;

    font-size: 22px;
}


/* =========================================================
   STATISTICS
========================================================= */

.stats-grid {

    max-width: 1550px;

    margin: 0 auto 25px;

    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 17px;
}

.stat-card {

    position: relative;

    display: flex;

    align-items: center;

    gap: 16px;

    min-height: 105px;

    padding: 20px;

    background: white;

    border:
        1px solid #dfe4f0;

    border-radius: 14px;

    box-shadow:
        0 6px 20px
        rgba(15,23,42,.06);

    overflow: hidden;
}

.stat-card::after {

    content: "";

    position: absolute;

    right: -22px;
    bottom: -27px;

    width: 100px;
    height: 100px;

    border-radius: 50%;

    opacity: .08;
}

.stat-icon {

    width: 54px;
    height: 54px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 13px;

    font-size: 23px;
}

.stat-card span {

    display: block;

    color: #64748b;

    font-size: 12px;

    font-weight: 800;

    text-transform: uppercase;

    letter-spacing: .04em;
}

.stat-card strong {

    display: block;

    margin-top: 5px;

    font-size: 32px;

    line-height: 1;

    font-weight: 800;
}


/* COLORS */

.stat-purple .stat-icon {
    background: #eef2ff;
    color: #4f46e5;
}

.stat-purple strong {
    color: #4f46e5;
}

.stat-purple::after {
    background: #4f46e5;
}

.stat-green .stat-icon {
    background: #f0fdf4;
    color: #16a34a;
}

.stat-green strong {
    color: #16a34a;
}

.stat-green::after {
    background: #16a34a;
}

.stat-orange .stat-icon {
    background: #fff7ed;
    color: #ea580c;
}

.stat-orange strong {
    color: #ea580c;
}

.stat-orange::after {
    background: #ea580c;
}

.stat-red .stat-icon {
    background: #fff1f2;
    color: #e11d48;
}

.stat-red strong {
    color: #e11d48;
}

.stat-red::after {
    background: #e11d48;
}


/* =========================================================
   DONOR CARD
========================================================= */

.donor-card {

    max-width: 1550px;

    margin: 0 auto;

    background: white;

    border:
        1px solid #dfe4f0;

    border-radius: 16px;

    box-shadow:
        0 7px 25px
        rgba(15,23,42,.07);

    overflow: hidden;
}


/* =========================================================
   CARD HEADER
========================================================= */

.card-header {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 18px;

    padding: 22px 25px;

    border-bottom:
        1px solid #edf2f7;
}

.card-header h2 {

    margin: 0;

    font-size: 22px;

    color: #1e293b;

    font-weight: 800;
}

.card-header p {

    margin: 5px 0 0;

    color: #94a3b8;

    font-size: 13px;
}

.refresh-btn {

    border: none;

    border-radius: 9px;

    padding: 11px 17px;

    background:
        linear-gradient(
            135deg,
            #4f46e5,
            #6366f1
        );

    color: white;

    font-size: 13px;

    font-weight: 800;

    cursor: pointer;

    box-shadow:
        0 5px 12px
        rgba(79,70,229,.22);

    transition: .2s;
}

.refresh-btn:hover {

    transform: translateY(-1px);
}

.refresh-btn:disabled {

    opacity: .6;

    cursor: not-allowed;
}


/* =========================================================
   FILTER BAR
========================================================= */

.filter-bar {

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 17px 25px;

    background: #fafbff;

    border-bottom:
        1px solid #edf2f7;
}


/* SEARCH */

.search-box {

    flex: 1;

    min-width: 280px;

    height: 47px;

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 0 14px;

    background: white;

    border:
        1px solid #d5ddea;

    border-radius: 9px;

    transition: .2s;
}

.search-box:focus-within {

    border-color: #6366f1;

    box-shadow:
        0 0 0 3px
        rgba(99,102,241,.10);
}

.search-box > span {

    color: #6366f1;

    font-size: 17px;
}

.search-box input {

    flex: 1;

    min-width: 0;

    border: none;

    outline: none;

    background: transparent;

    color: #334155;

    font-size: 14px;
}

.search-box input::placeholder {

    color: #94a3b8;

    font-size: 13px;
}

.search-box button {

    border: none;

    background: transparent;

    color: #94a3b8;

    cursor: pointer;

    font-size: 20px;
}


/* SELECT */

.filter-select {

    width: 190px;

    height: 47px;

    display: flex;

    align-items: center;

    gap: 8px;

    padding: 0 13px;

    background: white;

    border:
        1px solid #d5ddea;

    border-radius: 9px;
}

.filter-select span {

    color: #6366f1;

    font-size: 15px;
}

.filter-select select {

    width: 100%;

    border: none;

    outline: none;

    background: transparent;

    color: #475569;

    font-size: 13px;

    cursor: pointer;
}


/* CLEAR */

.clear-btn {

    height: 47px;

    padding: 0 15px;

    border:
        1px solid #fecdd3;

    border-radius: 9px;

    background: #fff1f2;

    color: #e11d48;

    font-size: 12px;

    font-weight: 800;

    cursor: pointer;
}


/* =========================================================
   TABLE
========================================================= */

.table-wrapper {

    overflow-x: auto;
}

table {

    width: 100%;

    border-collapse: collapse;

    min-width: 1350px;
}

thead {

    background:
        linear-gradient(
            90deg,
            #1e3a8a,
            #3730a3
        );
}

th {

    padding: 17px 16px;

    color: white;

    text-align: left;

    font-size: 12px;

    font-weight: 800;

    letter-spacing: .04em;

    white-space: nowrap;
}

td {

    padding: 17px 16px;

    border-bottom:
        1px solid #e7ebf3;

    color: #475569;

    font-size: 14px;

    white-space: nowrap;
}

tbody tr {

    transition:
        background .18s;
}

tbody tr:hover {

    background: #f7f9ff;
}

tbody tr:last-child td {

    border-bottom: none;
}


/* =========================================================
   DONOR
========================================================= */

.donor-info {

    display: flex;

    align-items: center;

    gap: 12px;
}

.donor-avatar {

    width: 48px;
    height: 48px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 12px;

    background:
        linear-gradient(
            135deg,
            #eef2ff,
            #ede9fe
        );

    color: #4f46e5;

    font-size: 17px;

    font-weight: 800;
}

.donor-info strong {

    display: block;

    color: #172033;

    font-size: 15px;

    font-weight: 800;
}

.donor-info small {

    display: block;

    margin-top: 4px;

    color: #8190a8;

    font-size: 11px;
}


/* =========================================================
   BLOOD GROUP
========================================================= */

.blood-badge {

    display: inline-flex;

    align-items: center;

    gap: 5px;

    padding: 7px 11px;

    border-radius: 8px;

    font-size: 13px;

    font-weight: 800;
}

.blood-a {

    background: #ede9fe;

    color: #6d28d9;
}

.blood-b {

    background: #dbeafe;

    color: #1d4ed8;
}

.blood-ab {

    background: #fce7f3;

    color: #be185d;
}

.blood-o {

    background: #fee2e2;

    color: #dc2626;
}

.blood-default {

    background: #f1f5f9;

    color: #475569;
}


/* =========================================================
   GENDER
========================================================= */

.gender {

    color: #334155;

    font-size: 14px;

    font-weight: 600;
}


/* =========================================================
   GENERAL TEXT
========================================================= */

.normal-text {

    color: #475569;

    font-size: 14px;

    font-weight: 500;
}


/* =========================================================
   CONTACT
========================================================= */

.contact-cell {

    display: flex;

    align-items: center;

    gap: 7px;

    color: #475569;

    font-size: 14px;
}

.contact-cell span {

    color: #6366f1;

    font-size: 15px;
}


/* =========================================================
   EMAIL
========================================================= */

.email {

    color: #475569;

    font-size: 13px;

    font-weight: 500;
}


/* =========================================================
   NIC
========================================================= */

.nic {

    color: #64748b;

    font-size: 12px;

    font-family:
        Consolas,
        monospace;
}


/* =========================================================
   STATUS
========================================================= */

.status-badge {

    display: inline-flex;

    align-items: center;

    gap: 7px;

    padding: 7px 11px;

    border-radius: 20px;

    font-size: 11px;

    font-weight: 800;
}

.status-dot {

    width: 8px;
    height: 8px;

    border-radius: 50%;
}

.status-active {

    background: #dcfce7;

    color: #15803d;
}

.status-active .status-dot {

    background: #16a34a;
}

.status-pending {

    background: #fff7ed;

    color: #c2410c;
}

.status-pending .status-dot {

    background: #f97316;
}

.status-inactive {

    background: #fee2e2;

    color: #b91c1c;
}

.status-inactive .status-dot {

    background: #ef4444;
}

.status-default {

    background: #f1f5f9;

    color: #475569;
}


/* =========================================================
   APPROVED
========================================================= */

.approved-date {

    color: #64748b;

    font-size: 13px;

    font-weight: 500;
}


/* =========================================================
   EMPTY
========================================================= */

.empty-state {

    padding: 70px 20px !important;

    text-align: center;

    color: #94a3b8;
}

.empty-state div {

    font-size: 45px;

    margin-bottom: 12px;
}

.empty-state strong {

    display: block;

    color: #475569;

    font-size: 18px;
}

.empty-state span {

    display: block;

    margin-top: 6px;

    font-size: 13px;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1150px) {

    .stats-grid {

        grid-template-columns:
            repeat(2, 1fr);
    }

    .filter-bar {

        flex-wrap: wrap;
    }

    .search-box {

        flex-basis: 100%;
    }
}


@media (max-width: 750px) {

    .donor-page {

        padding:
            22px 15px 40px;
    }

    .donor-header {

        align-items: flex-start;

        flex-direction: column;
    }

    .donor-header h1 {

        font-size: 31px;
    }

    .donor-header p {

        font-size: 14px;
    }

    .admin-card {

        width: 100%;
    }

    .stats-grid {

        grid-template-columns:
            1fr 1fr;
    }

    .card-header {

        align-items: flex-start;

        flex-direction: column;
    }

    .refresh-btn {

        width: 100%;
    }

    .filter-select {

        flex: 1;

        min-width: 170px;
    }

    .clear-btn {

        width: 100%;
    }
}


@media (max-width: 480px) {

    .stats-grid {

        grid-template-columns: 1fr;
    }

    .donor-header h1 {

        font-size: 27px;
    }

    .filter-bar {

        flex-direction: column;
    }

    .search-box,
    .filter-select,
    .clear-btn {

        width: 100%;

        flex-basis: auto;
    }
}

`;

export default DonorManagementPage;