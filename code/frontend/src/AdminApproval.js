import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api";

function AdminApproval() {
    const [donors, setDonors] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =========================================================
    // LOAD PENDING DONORS
    // =========================================================

    const loadPendingDonors = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await apiFetch("/api/admin-donors/pending");

            setDonors(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError(
                err.message || "Unable to load pending donors."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingDonors();
    }, []);

    // =========================================================
    // APPROVE
    // =========================================================

    const approveDonor = async (id) => {
        try {
            setError("");
            setMessage("");

            await apiFetch(`/api/admin-donors/${id}/approve`, {
                method: "PUT"
            });

            setMessage("Donor approved successfully.");

            loadPendingDonors();

        } catch (err) {
            console.error(err);

            setError(
                err.message || "Unable to approve donor."
            );
        }
    };

    // =========================================================
    // REJECT
    // =========================================================

    const rejectDonor = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to reject this donor?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await apiFetch(`/api/admin-donors/${id}/reject`, {
                method: "PUT"
            });

            setMessage("Donor rejected.");

            loadPendingDonors();

        } catch (err) {
            console.error(err);

            setError(
                err.message || "Unable to reject donor."
            );
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredDonors = useMemo(() => {

        const value = search
            .trim()
            .toLowerCase();

        if (!value) {
            return donors;
        }

        return donors.filter((donor) => {

            const name =
                donor.name ||
                donor.fullName ||
                "";

            const nic =
                donor.nic ||
                donor.nicNumber ||
                "";

            const phone =
                donor.phone ||
                donor.phoneNumber ||
                "";

            const bloodGroup =
                donor.bloodGroup ||
                "";

            return (
                name.toLowerCase().includes(value) ||
                nic.toLowerCase().includes(value) ||
                phone.toLowerCase().includes(value) ||
                bloodGroup.toLowerCase().includes(value)
            );
        });

    }, [donors, search]);

    // =========================================================
    // FORMAT BLOOD GROUP
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

        return parsed.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <>
            <style>{styles}</style>

            <div className="approval-page">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="approval-header">

                    <div className="header-title">

                        <div className="title-icon">
                            ✓
                        </div>

                        <div>

                            <h1>
                                Donor Approval
                            </h1>

                            <p>
                                Review and approve donor
                                registrations before they
                                become active.
                            </p>

                        </div>

                    </div>

                    <div className="admin-profile">

                        <div className="profile-avatar">
                            A
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

                </div>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (

                    <div className="success-message">

                        <span className="message-icon">
                            ✓
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


                {error && (

                    <div className="error-message">

                        <span className="message-icon">
                            !
                        </span>

                        {error}

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="stats">

                    <div className="stat-card purple">

                        <div className="stat-icon">
                            👥
                        </div>

                        <div>

                            <span>
                                PENDING DONORS
                            </span>

                            <strong>
                                {donors.length}
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card orange">

                        <div className="stat-icon">
                            ⏳
                        </div>

                        <div>

                            <span>
                                WAITING FOR REVIEW
                            </span>

                            <strong>
                                {donors.length}
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card blue">

                        <div className="stat-icon">
                            🔍
                        </div>

                        <div>

                            <span>
                                DISPLAYED
                            </span>

                            <strong>
                                {filteredDonors.length}
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card green">

                        <div className="stat-icon">
                            ✓
                        </div>

                        <div>

                            <span>
                                STATUS
                            </span>

                            <strong className="ready">
                                READY
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    MAIN CARD
                ================================================= */}

                <div className="approval-card">

                    <div className="card-top">

                        <div>

                            <h2>
                                Pending Donor Registrations
                            </h2>

                            <p>
                                Review donor details carefully
                                before approving.
                            </p>

                        </div>

                        <button
                            className="refresh-button"
                            onClick={loadPendingDonors}
                            disabled={loading}
                        >

                            {loading
                                ? "⟳ Loading..."
                                : "↻ Refresh"}

                        </button>

                    </div>


                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div className="search-area">

                        <div className="search-box">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search by donor name, NIC, phone or blood group..."
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

                        <div className="result-count">

                            {filteredDonors.length}{" "}
                            donor
                            {filteredDonors.length !== 1
                                ? "s"
                                : ""}

                        </div>

                    </div>


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        DONOR
                                    </th>

                                    <th>
                                        NIC
                                    </th>

                                    <th>
                                        BLOOD GROUP
                                    </th>

                                    <th>
                                        GENDER
                                    </th>

                                    <th>
                                        PHONE
                                    </th>

                                    <th>
                                        REGISTERED
                                    </th>

                                    <th>
                                        ACTION
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="loading"
                                        >

                                            <div className="loader">
                                                ⟳
                                            </div>

                                            Loading pending
                                            donors...

                                        </td>

                                    </tr>

                                ) : filteredDonors.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="empty"
                                        >

                                            <div className="empty-icon">
                                                ✓
                                            </div>

                                            <strong>
                                                No Pending Donors
                                            </strong>

                                            <span>
                                                All donor registrations
                                                have been reviewed.
                                            </span>

                                        </td>

                                    </tr>

                                ) : (

                                    filteredDonors.map(
                                        (donor) => {

                                            const name =
                                                donor.name ||
                                                donor.fullName ||
                                                "Unknown";

                                            const initials =
                                                name
                                                    .charAt(0)
                                                    .toUpperCase();

                                            return (

                                                <tr
                                                    key={
                                                        donor.donorId
                                                    }
                                                >

                                                    {/* DONOR */}

                                                    <td>

                                                        <div className="donor">

                                                            <div className="donor-avatar">
                                                                {initials}
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


                                                    {/* BLOOD GROUP */}

                                                    <td>

                                                        <span className="blood">

                                                            🩸{" "}

                                                            {
                                                                formatBloodGroup(
                                                                    donor.bloodGroup
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* GENDER */}

                                                    <td>

                                                        <span className="gender">

                                                            {donor.gender ===
                                                            "MALE"
                                                                ? "♂"
                                                                : donor.gender ===
                                                                  "FEMALE"
                                                                ? "♀"
                                                                : "•"}

                                                            {" "}

                                                            {donor.gender ||
                                                                "—"}

                                                        </span>

                                                    </td>


                                                    {/* PHONE */}

                                                    <td>

                                                        <span className="phone">
                                                            ☎{" "}
                                                            {
                                                                donor.phone ||
                                                                donor.phoneNumber ||
                                                                "—"
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* DATE */}

                                                    <td>

                                                        <span className="date">
                                                            {
                                                                formatDate(
                                                                    donor.createdAt ||
                                                                    donor.registeredAt
                                                                )
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* ACTION */}

                                                    <td>

                                                        <div className="actions">

                                                            <button
                                                                className="approve"
                                                                onClick={() =>
                                                                    approveDonor(
                                                                        donor.donorId
                                                                    )
                                                                }
                                                            >

                                                                ✓ Approve

                                                            </button>


                                                            <button
                                                                className="reject"
                                                                onClick={() =>
                                                                    rejectDonor(
                                                                        donor.donorId
                                                                    )
                                                                }
                                                            >

                                                                × Reject

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        </>
    );
}


// =============================================================
// CSS
// =============================================================

const styles = `

* {
    box-sizing: border-box;
}

.approval-page {

    min-height: 100vh;

    padding: 32px 38px 60px;

    background:
        linear-gradient(
            135deg,
            #f4f6ff,
            #eaf0ff,
            #f8f9ff
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

.approval-header {

    max-width: 1550px;

    margin: 0 auto 25px;

    display: flex;

    justify-content: space-between;

    align-items: center;
}

.header-title {

    display: flex;

    align-items: center;

    gap: 17px;
}

.title-icon {

    width: 64px;
    height: 64px;

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

    font-size: 30px;

    font-weight: 900;

    box-shadow:
        0 10px 25px
        rgba(79,70,229,.25);
}

.header-title h1 {

    margin: 0;

    font-size: 37px;

    font-weight: 800;

    color: #172554;

    letter-spacing: -.7px;
}

.header-title p {

    margin: 6px 0 0;

    font-size: 16px;

    color: #64748b;
}


/* =========================================================
   ADMIN
========================================================= */

.admin-profile {

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 10px 17px;

    background: rgba(255,255,255,.92);

    border:
        1px solid #dce3f1;

    border-radius: 13px;

    box-shadow:
        0 6px 18px
        rgba(15,23,42,.06);
}

.profile-avatar {

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

.admin-profile strong {

    display: block;

    font-size: 14px;

    color: #334155;
}

.admin-profile span {

    display: inline-block;

    margin-top: 4px;

    padding: 3px 8px;

    border-radius: 5px;

    background: #eef2ff;

    color: #4f46e5;

    font-size: 10px;

    font-weight: 800;
}


/* =========================================================
   MESSAGES
========================================================= */

.success-message,
.error-message {

    max-width: 1550px;

    margin: 0 auto 18px;

    padding: 13px 17px;

    border-radius: 10px;

    display: flex;

    align-items: center;

    gap: 10px;

    font-size: 14px;

    font-weight: 600;
}

.success-message {

    background: #f0fdf4;

    border: 1px solid #bbf7d0;

    color: #15803d;
}

.error-message {

    background: #fef2f2;

    border: 1px solid #fecaca;

    color: #b91c1c;
}

.message-icon {

    width: 25px;
    height: 25px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background: rgba(255,255,255,.7);
}

.success-message button,
.error-message button {

    margin-left: auto;

    border: none;

    background: transparent;

    font-size: 21px;

    cursor: pointer;

    color: inherit;
}


/* =========================================================
   STATS
========================================================= */

.stats {

    max-width: 1550px;

    margin: 0 auto 24px;

    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 17px;
}

.stat-card {

    position: relative;

    min-height: 108px;

    padding: 20px;

    display: flex;

    align-items: center;

    gap: 16px;

    overflow: hidden;

    background: white;

    border:
        1px solid #dfe5f1;

    border-radius: 14px;

    box-shadow:
        0 6px 20px
        rgba(15,23,42,.06);
}

.stat-card::after {

    content: "";

    position: absolute;

    right: -25px;
    bottom: -35px;

    width: 115px;
    height: 115px;

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

    border-radius: 14px;

    font-size: 23px;
}

.stat-card span {

    display: block;

    color: #64748b;

    font-size: 11px;

    font-weight: 800;

    letter-spacing: .05em;
}

.stat-card strong {

    display: block;

    margin-top: 6px;

    font-size: 31px;

    line-height: 1;

    font-weight: 800;
}

.purple .stat-icon {
    background: #eef2ff;
    color: #4f46e5;
}

.purple strong {
    color: #4f46e5;
}

.purple::after {
    background: #4f46e5;
}

.orange .stat-icon {
    background: #fff7ed;
    color: #ea580c;
}

.orange strong {
    color: #ea580c;
}

.orange::after {
    background: #ea580c;
}

.blue .stat-icon {
    background: #eff6ff;
    color: #2563eb;
}

.blue strong {
    color: #2563eb;
}

.blue::after {
    background: #2563eb;
}

.green .stat-icon {
    background: #f0fdf4;
    color: #16a34a;
}

.green strong {
    color: #16a34a;
}

.green::after {
    background: #16a34a;
}

.stat-card .ready {

    font-size: 20px;
}


/* =========================================================
   MAIN CARD
========================================================= */

.approval-card {

    max-width: 1550px;

    margin: 0 auto;

    overflow: hidden;

    background: white;

    border:
        1px solid #dfe5f1;

    border-radius: 16px;

    box-shadow:
        0 8px 25px
        rgba(15,23,42,.07);
}


/* =========================================================
   CARD TOP
========================================================= */

.card-top {

    padding: 23px 25px;

    display: flex;

    justify-content: space-between;

    align-items: center;

    border-bottom:
        1px solid #edf1f7;
}

.card-top h2 {

    margin: 0;

    font-size: 22px;

    font-weight: 800;

    color: #1e293b;
}

.card-top p {

    margin: 6px 0 0;

    font-size: 14px;

    color: #94a3b8;
}

.refresh-button {

    border: none;

    padding: 11px 18px;

    border-radius: 9px;

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
        0 5px 14px
        rgba(79,70,229,.22);
}

.refresh-button:disabled {

    opacity: .6;

    cursor: not-allowed;
}


/* =========================================================
   SEARCH
========================================================= */

.search-area {

    padding: 16px 25px;

    display: flex;

    align-items: center;

    gap: 15px;

    background: #fafbff;

    border-bottom:
        1px solid #edf1f7;
}

.search-box {

    flex: 1;

    height: 47px;

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 0 14px;

    background: white;

    border:
        1px solid #d7deeb;

    border-radius: 9px;
}

.search-box:focus-within {

    border-color: #6366f1;

    box-shadow:
        0 0 0 3px
        rgba(99,102,241,.1);
}

.search-box span {

    color: #6366f1;

    font-size: 17px;
}

.search-box input {

    flex: 1;

    border: none;

    outline: none;

    background: transparent;

    font-size: 14px;

    color: #334155;
}

.search-box input::placeholder {

    color: #94a3b8;
}

.search-box button {

    border: none;

    background: transparent;

    color: #94a3b8;

    font-size: 20px;

    cursor: pointer;
}

.result-count {

    padding: 10px 15px;

    border-radius: 8px;

    background: #eef2ff;

    color: #4f46e5;

    font-size: 13px;

    font-weight: 800;
}


/* =========================================================
   TABLE
========================================================= */

.table-container {

    overflow-x: auto;
}

table {

    width: 100%;

    min-width: 1150px;

    border-collapse: collapse;
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

    padding: 17px 18px;

    text-align: left;

    color: white;

    font-size: 12px;

    font-weight: 800;

    letter-spacing: .04em;

    white-space: nowrap;
}

td {

    padding: 17px 18px;

    border-bottom:
        1px solid #e8edf5;

    font-size: 14px;

    color: #475569;

    white-space: nowrap;
}

tbody tr {

    transition: .18s;
}

tbody tr:hover {

    background: #f7f9ff;
}


/* =========================================================
   DONOR
========================================================= */

.donor {

    display: flex;

    align-items: center;

    gap: 12px;
}

.donor-avatar {

    width: 47px;
    height: 47px;

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

.donor strong {

    display: block;

    color: #172033;

    font-size: 15px;

    font-weight: 800;
}

.donor small {

    display: block;

    margin-top: 4px;

    color: #8190a8;

    font-size: 11px;
}


/* =========================================================
   BLOOD
========================================================= */

.blood {

    display: inline-flex;

    align-items: center;

    padding: 7px 11px;

    border-radius: 8px;

    background: #fce7f3;

    color: #be185d;

    font-size: 13px;

    font-weight: 800;
}


/* =========================================================
   OTHER CELLS
========================================================= */

.nic {

    color: #64748b;

    font-family: Consolas, monospace;

    font-size: 12px;
}

.gender {

    color: #334155;

    font-size: 14px;

    font-weight: 600;
}

.phone {

    color: #475569;

    font-size: 14px;
}

.date {

    color: #64748b;

    font-size: 13px;
}


/* =========================================================
   ACTIONS
========================================================= */

.actions {

    display: flex;

    align-items: center;

    gap: 8px;
}

.approve,
.reject {

    border: none;

    padding: 9px 13px;

    border-radius: 8px;

    font-size: 12px;

    font-weight: 800;

    cursor: pointer;

    transition: .18s;
}

.approve {

    background: #dcfce7;

    color: #15803d;
}

.approve:hover {

    background: #bbf7d0;

    transform: translateY(-1px);
}

.reject {

    background: #fee2e2;

    color: #dc2626;
}

.reject:hover {

    background: #fecaca;

    transform: translateY(-1px);
}


/* =========================================================
   EMPTY
========================================================= */

.empty {

    padding: 75px 20px !important;

    text-align: center;

    color: #94a3b8;
}

.empty-icon {

    width: 65px;
    height: 65px;

    margin: 0 auto 15px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background: #dcfce7;

    color: #16a34a;

    font-size: 30px;

    font-weight: 900;
}

.empty strong {

    display: block;

    color: #334155;

    font-size: 19px;
}

.empty span {

    display: block;

    margin-top: 6px;

    font-size: 14px;
}


/* =========================================================
   LOADING
========================================================= */

.loading {

    padding: 70px !important;

    text-align: center;

    color: #64748b;

    font-size: 15px;
}

.loader {

    margin-bottom: 10px;

    color: #4f46e5;

    font-size: 30px;

    animation: spin 1s linear infinite;
}

@keyframes spin {

    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {

    .stats {

        grid-template-columns:
            repeat(2, 1fr);
    }

    .approval-header {

        align-items: flex-start;

        flex-direction: column;
    }

    .admin-profile {

        width: 100%;
    }
}


@media (max-width: 700px) {

    .approval-page {

        padding: 22px 15px 40px;
    }

    .header-title h1 {

        font-size: 30px;
    }

    .header-title p {

        font-size: 14px;
    }

    .stats {

        grid-template-columns: 1fr;
    }

    .card-top {

        align-items: flex-start;

        flex-direction: column;

        gap: 15px;
    }

    .refresh-button {

        width: 100%;
    }

    .search-area {

        align-items: stretch;

        flex-direction: column;
    }

    .result-count {

        text-align: center;
    }
}

`;

export default AdminApproval;