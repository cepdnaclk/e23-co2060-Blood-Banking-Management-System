import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api";

function HospitalPage() {
    const [hospitals, setHospitals] = useState([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(true);

    const [form, setForm] = useState({
        hospitalName: "",
        location: "",
        contactNumber: ""
    });

    // =========================================================
    // LOAD HOSPITALS
    // =========================================================

    const fetchHospitals = async () => {
        try {
            const data = await apiFetch("/api/hospitals");

            setHospitals(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.error(error);

            setMessage(
                error.message ||
                "Unable to load hospitals."
            );
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

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
    // ADD HOSPITAL
    // =========================================================

    const addHospital = async () => {
        setMessage("");

        if (
            !form.hospitalName.trim() ||
            !form.location.trim() ||
            !form.contactNumber.trim()
        ) {
            setMessage(
                "Please fill in all hospital details."
            );
            return;
        }

        try {
            setLoading(true);

            await apiFetch("/api/hospitals", {
                method: "POST",
                body: JSON.stringify({
                    hospitalName:
                        form.hospitalName.trim(),

                    location:
                        form.location.trim(),

                    contactNumber:
                        form.contactNumber.trim()
                })
            });

            setMessage(
                "Hospital added successfully."
            );

            setForm({
                hospitalName: "",
                location: "",
                contactNumber: ""
            });

            await fetchHospitals();

        } catch (error) {
            console.error(error);

            setMessage(
                error.message ||
                "Unable to add hospital."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // DELETE HOSPITAL
    // =========================================================

    const deleteHospital = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this hospital?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            await apiFetch(
                `/api/hospitals/${id}`,
                {
                    method: "DELETE"
                }
            );

            setMessage(
                "Hospital deleted successfully."
            );

            await fetchHospitals();

        } catch (error) {
            console.error(error);

            setMessage(
                error.message ||
                "Unable to delete hospital."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredHospitals = useMemo(() => {
        const term = search
            .trim()
            .toLowerCase();

        if (!term) {
            return hospitals;
        }

        return hospitals.filter((hospital) => {

            const name =
                hospital.hospitalName || "";

            const location =
                hospital.location || "";

            const contact =
                hospital.contactNumber || "";

            return (
                name.toLowerCase().includes(term) ||
                location.toLowerCase().includes(term) ||
                contact.toLowerCase().includes(term)
            );
        });

    }, [hospitals, search]);

    // =========================================================
    // STATISTICS
    // =========================================================

    const totalHospitals =
        hospitals.length;

    const locations = new Set(
        hospitals
            .map((hospital) =>
                hospital.location
            )
            .filter(Boolean)
    ).size;

    const hospitalsWithContact =
        hospitals.filter(
            (hospital) =>
                hospital.contactNumber
        ).length;

    const visibleHospitals =
        filteredHospitals.length;

    // =========================================================
    // RETURN
    // =========================================================

    return (
        <>
            <style>{styles}</style>

            <div className="hospital-page">

                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="hospital-header">

                    <div className="header-left">

                        <div className="header-icon">
                            🏥
                        </div>

                        <div>

                            <h1>
                                Hospital Management
                            </h1>

                            <p>
                                Manage hospitals and
                                healthcare facilities
                                connected to BBMS.
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
                    MESSAGE
                ================================================= */}

                {message && (

                    <div
                        className={`message ${
                            message
                                .toLowerCase()
                                .includes("success")
                                ? "message-success"
                                : "message-error"
                        }`}
                    >

                        <span>
                            {message
                                .toLowerCase()
                                .includes("success")
                                ? "✓"
                                : "!"}
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
                        icon="🏥"
                        label="Total Hospitals"
                        value={totalHospitals}
                        color="purple"
                    />

                    <StatCard
                        icon="📍"
                        label="Locations"
                        value={locations}
                        color="blue"
                    />

                    <StatCard
                        icon="☎️"
                        label="Contact Available"
                        value={hospitalsWithContact}
                        color="green"
                    />

                    <StatCard
                        icon="🔎"
                        label="Currently Showing"
                        value={visibleHospitals}
                        color="orange"
                    />

                </div>

                {/* =================================================
                    ADD HOSPITAL
                ================================================= */}

                <section className="form-card">

                    <div
                        className="section-header"
                        onClick={() =>
                            setShowForm(!showForm)
                        }
                    >

                        <div className="section-title">

                            <div className="section-icon">
                                ＋
                            </div>

                            <div>

                                <h2>
                                    Add New Hospital
                                </h2>

                                <p>
                                    Register a healthcare
                                    facility in BBMS
                                </p>

                            </div>

                        </div>

                        <button
                            className="collapse-btn"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >
                            {showForm ? "−" : "+"}
                        </button>

                    </div>

                    {showForm && (

                        <div className="form-body">

                            <div className="form-grid">

                                {/* HOSPITAL NAME */}

                                <div className="field">

                                    <label>
                                        Hospital Name
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            🏥
                                        </span>

                                        <input
                                            type="text"
                                            name="hospitalName"
                                            value={
                                                form.hospitalName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter hospital name"
                                        />

                                    </div>

                                </div>

                                {/* LOCATION */}

                                <div className="field">

                                    <label>
                                        Location
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            📍
                                        </span>

                                        <input
                                            type="text"
                                            name="location"
                                            value={
                                                form.location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter city / location"
                                        />

                                    </div>

                                </div>

                                {/* CONTACT */}

                                <div className="field">

                                    <label>
                                        Contact Number
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            ☎️
                                        </span>

                                        <input
                                            type="text"
                                            name="contactNumber"
                                            value={
                                                form.contactNumber
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter contact number"
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="form-footer">

                                <span>
                                    🏥 Hospital information
                                    is stored securely in
                                    the BBMS database.
                                </span>

                                <button
                                    className="add-hospital-btn"
                                    onClick={
                                        addHospital
                                    }
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Adding..."
                                        : "＋ Add Hospital"}

                                </button>

                            </div>

                        </div>

                    )}

                </section>

                {/* =================================================
                    HOSPITAL LIST
                ================================================= */}

                <section className="hospitals-card">

                    <div className="table-header">

                        <div>

                            <h2>
                                Registered Hospitals
                            </h2>

                            <p>
                                {filteredHospitals.length}{" "}
                                hospital
                                {filteredHospitals.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                displayed
                            </p>

                        </div>

                        <div className="search-box">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search hospitals..."
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

                    </div>

                    <div className="hospital-list">

                        {filteredHospitals.length > 0 ? (

                            filteredHospitals.map(
                                (hospital) => (

                                    <div
                                        className="hospital-row"
                                        key={
                                            hospital.hospitalId
                                        }
                                    >

                                        {/* HOSPITAL INFO */}

                                        <div className="hospital-main">

                                            <div className="hospital-avatar">
                                                🏥
                                            </div>

                                            <div>

                                                <h3>
                                                    {
                                                        hospital.hospitalName
                                                    }
                                                </h3>

                                                <span>
                                                    Hospital ID #
                                                    {
                                                        hospital.hospitalId
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                        {/* LOCATION */}

                                        <div className="hospital-info">

                                            <small>
                                                LOCATION
                                            </small>

                                            <strong>
                                                📍{" "}
                                                {
                                                    hospital.location
                                                }
                                            </strong>

                                        </div>

                                        {/* CONTACT */}

                                        <div className="hospital-info">

                                            <small>
                                                CONTACT
                                            </small>

                                            <strong>
                                                ☎️{" "}
                                                {
                                                    hospital.contactNumber ||
                                                    "Not Available"
                                                }
                                            </strong>

                                        </div>

                                        {/* STATUS */}

                                        <div className="hospital-status">

                                            <span className="status-badge">
                                                <span className="status-dot" />
                                                REGISTERED
                                            </span>

                                        </div>

                                        {/* DELETE */}

                                        <div className="hospital-action">

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteHospital(
                                                        hospital.hospitalId
                                                    )
                                                }
                                            >
                                                🗑 Delete
                                            </button>

                                        </div>

                                    </div>

                                )
                            )

                        ) : (

                            <div className="empty-state">

                                <div>
                                    🏥
                                </div>

                                <strong>
                                    No hospitals found
                                </strong>

                                <span>
                                    Try another search
                                    term or add a new
                                    hospital.
                                </span>

                            </div>

                        )}

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
// STYLES
// =============================================================

const styles = `

* {
    box-sizing: border-box;
}


/* =========================================================
   PAGE
========================================================= */

.hospital-page {

    min-height: 100vh;

    padding: 30px 34px 50px;

    background:
        linear-gradient(
            135deg,
            #f4f6ff 0%,
            #e9edff 50%,
            #f5f7ff 100%
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

.hospital-header {

    max-width: 1450px;

    margin: 0 auto 24px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 20px;
}

.header-left {

    display: flex;

    align-items: center;

    gap: 16px;
}

.header-icon {

    width: 62px;
    height: 62px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 16px;

    background:
        linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
        );

    color: white;

    font-size: 28px;

    box-shadow:
        0 8px 20px
        rgba(79,70,229,.25);
}

.hospital-header h1 {

    margin: 0;

    font-size: 35px;

    font-weight: 800;

    letter-spacing: -.8px;

    color: #172554;
}

.hospital-header p {

    margin: 5px 0 0;

    color: #64748b;

    font-size: 14px;
}


/* =========================================================
   ADMIN CARD
========================================================= */

.admin-card {

    display: flex;

    align-items: center;

    gap: 11px;

    padding: 10px 15px;

    background:
        rgba(255,255,255,.88);

    border:
        1px solid #dce2f0;

    border-radius: 12px;

    box-shadow:
        0 5px 18px
        rgba(15,23,42,.06);
}

.admin-avatar {

    width: 42px;
    height: 42px;

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

    font-size: 17px;

    font-weight: 800;
}

.admin-card strong {

    display: block;

    color: #334155;

    font-size: 13px;
}

.admin-card span {

    display: inline-block;

    margin-top: 4px;

    padding: 3px 7px;

    border-radius: 4px;

    background: #eef2ff;

    color: #4f46e5;

    font-size: 9px;

    font-weight: 800;
}


/* =========================================================
   MESSAGE
========================================================= */

.message {

    max-width: 1450px;

    margin:
        0 auto 18px;

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 12px 15px;

    border-radius: 9px;

    font-size: 13px;

    font-weight: 600;
}

.message-success {

    background: #f0fdf4;

    border:
        1px solid #bbf7d0;

    color: #15803d;
}

.message-error {

    background: #fef2f2;

    border:
        1px solid #fecaca;

    color: #b91c1c;
}

.message button {

    margin-left: auto;

    border: none;

    background: transparent;

    color: inherit;

    cursor: pointer;

    font-size: 20px;
}


/* =========================================================
   STATISTICS
========================================================= */

.stats-grid {

    max-width: 1450px;

    margin:
        0 auto 22px;

    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 15px;
}

.stat-card {

    position: relative;

    display: flex;

    align-items: center;

    gap: 14px;

    padding: 18px;

    min-height: 92px;

    background: white;

    border:
        1px solid #dfe4f0;

    border-radius: 13px;

    box-shadow:
        0 5px 18px
        rgba(15,23,42,.05);

    overflow: hidden;
}

.stat-card::after {

    content: "";

    position: absolute;

    right: -20px;
    bottom: -25px;

    width: 90px;
    height: 90px;

    border-radius: 50%;

    opacity: .08;
}

.stat-icon {

    width: 48px;
    height: 48px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 12px;

    font-size: 21px;
}

.stat-card span {

    display: block;

    color: #64748b;

    font-size: 11px;

    font-weight: 800;

    text-transform: uppercase;

    letter-spacing: .04em;
}

.stat-card strong {

    display: block;

    margin-top: 4px;

    font-size: 29px;

    line-height: 1;
}


/* STAT COLORS */

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

.stat-blue .stat-icon {
    background: #eff6ff;
    color: #0284c7;
}

.stat-blue strong {
    color: #0284c7;
}

.stat-blue::after {
    background: #0284c7;
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


/* =========================================================
   CARDS
========================================================= */

.form-card,
.hospitals-card {

    max-width: 1450px;

    margin:
        0 auto 20px;

    background: white;

    border:
        1px solid #dfe4f0;

    border-radius: 15px;

    box-shadow:
        0 6px 22px
        rgba(15,23,42,.06);

    overflow: hidden;
}


/* =========================================================
   SECTION HEADER
========================================================= */

.section-header {

    display: flex;

    align-items: center;

    justify-content: space-between;

    padding: 17px 22px;

    border-bottom:
        1px solid #e7ebf3;

    cursor: pointer;
}

.section-title {

    display: flex;

    align-items: center;

    gap: 12px;
}

.section-icon {

    width: 40px;
    height: 40px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 9px;

    background: #eef2ff;

    color: #4f46e5;

    font-size: 21px;

    font-weight: 700;
}

.section-header h2 {

    margin: 0;

    font-size: 19px;

    color: #1e293b;
}

.section-header p {

    margin: 4px 0 0;

    color: #94a3b8;

    font-size: 11px;
}

.collapse-btn {

    width: 31px;
    height: 31px;

    border: none;

    border-radius: 7px;

    background: #f1f5f9;

    color: #64748b;

    font-size: 19px;

    cursor: pointer;
}


/* =========================================================
   FORM
========================================================= */

.form-body {

    padding: 21px 22px;
}

.form-grid {

    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 17px;
}

.field label {

    display: block;

    margin-bottom: 7px;

    color: #334155;

    font-size: 12px;

    font-weight: 800;
}

.input-wrapper {

    height: 47px;

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 0 12px;

    background: #f8fafc;

    border:
        1px solid #d5ddea;

    border-radius: 8px;

    transition: .2s;
}

.input-wrapper:focus-within {

    background: white;

    border-color: #6366f1;

    box-shadow:
        0 0 0 3px
        rgba(99,102,241,.08);
}

.input-wrapper > span {

    width: 20px;

    color: #7c83a4;

    text-align: center;

    font-size: 16px;
}

.input-wrapper input {

    width: 100%;

    height: 100%;

    border: none;

    outline: none;

    background: transparent;

    color: #334155;

    font-size: 14px;
}

.input-wrapper input::placeholder {

    color: #a0aec0;

    font-size: 13px;
}


/* =========================================================
   FORM FOOTER
========================================================= */

.form-footer {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;

    margin-top: 19px;

    padding-top: 16px;

    border-top:
        1px solid #edf2f7;
}

.form-footer span {

    color: #94a3b8;

    font-size: 10px;
}

.add-hospital-btn {

    border: none;

    border-radius: 8px;

    padding: 12px 20px;

    background:
        linear-gradient(
            135deg,
            #4f46e5,
            #6366f1
        );

    color: white;

    font-size: 12px;

    font-weight: 800;

    cursor: pointer;

    box-shadow:
        0 5px 13px
        rgba(79,70,229,.2);

    transition: .2s;
}

.add-hospital-btn:hover {

    transform: translateY(-1px);

    box-shadow:
        0 7px 16px
        rgba(79,70,229,.27);
}

.add-hospital-btn:disabled {

    opacity: .6;

    cursor: not-allowed;
}


/* =========================================================
   TABLE HEADER
========================================================= */

.table-header {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;

    padding: 19px 22px;

    border-bottom:
        1px solid #edf2f7;
}

.table-header h2 {

    margin: 0;

    font-size: 19px;

    color: #1e293b;
}

.table-header p {

    margin: 4px 0 0;

    color: #94a3b8;

    font-size: 11px;
}


/* =========================================================
   SEARCH
========================================================= */

.search-box {

    width: 270px;

    height: 42px;

    display: flex;

    align-items: center;

    gap: 8px;

    padding: 0 11px;

    background: #f8fafc;

    border:
        1px solid #d5ddea;

    border-radius: 8px;
}

.search-box > span {

    color: #94a3b8;

    font-size: 15px;
}

.search-box input {

    flex: 1;

    min-width: 0;

    border: none;

    outline: none;

    background: transparent;

    color: #334155;

    font-size: 13px;
}

.search-box input::placeholder {

    color: #a0aec0;

    font-size: 12px;
}

.search-box button {

    border: none;

    background: transparent;

    color: #94a3b8;

    cursor: pointer;

    font-size: 18px;
}


/* =========================================================
   HOSPITAL LIST
========================================================= */

.hospital-list {

    width: 100%;
}

.hospital-row {

    display: grid;

    grid-template-columns:
        2.1fr
        1.2fr
        1.3fr
        1fr
        110px;

    align-items: center;

    gap: 20px;

    padding: 17px 22px;

    border-bottom:
        1px solid #edf2f7;

    transition:
        background .2s,
        transform .2s;
}

.hospital-row:hover {

    background: #f8faff;
}

.hospital-row:last-child {

    border-bottom: none;
}


/* =========================================================
   HOSPITAL MAIN
========================================================= */

.hospital-main {

    display: flex;

    align-items: center;

    gap: 12px;
}

.hospital-avatar {

    width: 47px;
    height: 47px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 12px;

    background:
        linear-gradient(
            135deg,
            #eef2ff,
            #e0e7ff
        );

    font-size: 22px;
}

.hospital-main h3 {

    margin: 0;

    color: #1e293b;

    font-size: 14px;

    font-weight: 800;
}

.hospital-main span {

    display: block;

    margin-top: 4px;

    color: #94a3b8;

    font-size: 10px;
}


/* =========================================================
   HOSPITAL INFO
========================================================= */

.hospital-info small {

    display: block;

    margin-bottom: 5px;

    color: #94a3b8;

    font-size: 9px;

    font-weight: 800;

    letter-spacing: .06em;
}

.hospital-info strong {

    color: #475569;

    font-size: 12px;

    font-weight: 600;
}


/* =========================================================
   STATUS
========================================================= */

.status-badge {

    display: inline-flex;

    align-items: center;

    gap: 6px;

    padding: 7px 10px;

    border-radius: 20px;

    background: #dcfce7;

    color: #15803d;

    font-size: 9px;

    font-weight: 800;
}

.status-dot {

    width: 7px;
    height: 7px;

    border-radius: 50%;

    background: #16a34a;
}


/* =========================================================
   DELETE
========================================================= */

.hospital-action {

    display: flex;

    justify-content: flex-end;
}

.delete-btn {

    border: none;

    border-radius: 7px;

    padding: 8px 12px;

    background: #fff1f2;

    color: #e11d48;

    font-size: 10px;

    font-weight: 800;

    cursor: pointer;

    transition: .2s;
}

.delete-btn:hover {

    background: #e11d48;

    color: white;

    transform: translateY(-1px);
}


/* =========================================================
   EMPTY
========================================================= */

.empty-state {

    padding: 55px 20px;

    text-align: center;

    color: #94a3b8;
}

.empty-state div {

    font-size: 40px;

    margin-bottom: 9px;
}

.empty-state strong {

    display: block;

    color: #475569;

    font-size: 15px;
}

.empty-state span {

    display: block;

    margin-top: 5px;

    font-size: 11px;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {

    .stats-grid {

        grid-template-columns:
            repeat(2, 1fr);
    }

    .form-grid {

        grid-template-columns:
            repeat(2, 1fr);
    }

    .hospital-row {

        grid-template-columns:
            1.8fr
            1fr
            1fr
            100px;

    }

    .hospital-status {

        display: none;
    }
}


@media (max-width: 750px) {

    .hospital-page {

        padding:
            20px 14px 35px;
    }

    .hospital-header {

        align-items: flex-start;

        flex-direction: column;
    }

    .hospital-header h1 {

        font-size: 29px;
    }

    .admin-card {

        width: 100%;
    }

    .stats-grid {

        grid-template-columns:
            1fr 1fr;
    }

    .form-grid {

        grid-template-columns: 1fr;
    }

    .form-footer {

        align-items: flex-start;

        flex-direction: column;
    }

    .add-hospital-btn {

        width: 100%;
    }

    .table-header {

        align-items: flex-start;

        flex-direction: column;
    }

    .search-box {

        width: 100%;
    }

    .hospital-row {

        grid-template-columns: 1fr;

        gap: 14px;
    }

    .hospital-action {

        justify-content: flex-start;
    }

    .hospital-status {

        display: block;
    }

    .delete-btn {

        width: 100%;
    }
}


@media (max-width: 450px) {

    .stats-grid {

        grid-template-columns: 1fr;
    }

    .hospital-header h1 {

        font-size: 25px;
    }
}

`;

export default HospitalPage;