import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(true);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "ADMIN",
        status: "ACTIVE",
        hospitalId: ""
    });

    const role = (
        localStorage.getItem("role") || ""
    ).trim().toUpperCase();

    // =========================================================
    // FETCH USERS
    // =========================================================

    const fetchUsers = async () => {
        try {
            const data = await apiFetch("/api/users");

            setUsers(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            console.error(err);
            setMessage(
                err.message || "Unable to load users."
            );
        }
    };

    // =========================================================
    // FETCH HOSPITALS
    // =========================================================

    const fetchHospitals = async () => {
        try {
            const data = await apiFetch("/api/hospitals");

            setHospitals(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            console.error(err);
            setMessage(
                err.message || "Unable to load hospitals."
            );
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchUsers();
        fetchHospitals();
    }, []);

    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // =========================================================
    // ADD USER
    // =========================================================

    const addUser = async () => {
        setMessage("");

        if (
            !form.fullName ||
            !form.email ||
            !form.password
        ) {
            setMessage(
                "Please fill in all required fields."
            );
            return;
        }

        if (
            (
                form.role === "HOSPITAL_STAFF" ||
                form.role === "RECEPTION_STAFF"
            ) &&
            !form.hospitalId
        ) {
            setMessage(
                "Please select a hospital for this role."
            );
            return;
        }

        try {
            setLoading(true);

            await apiFetch("/api/users", {
                method: "POST",
                body: JSON.stringify({
                    ...form,
                    hospitalId: form.hospitalId
                        ? Number(form.hospitalId)
                        : null
                })
            });

            setMessage(
                "User added successfully."
            );

            setForm({
                fullName: "",
                email: "",
                password: "",
                role: "ADMIN",
                status: "ACTIVE",
                hospitalId: ""
            });

            await fetchUsers();

        } catch (err) {
            console.error(err);

            setMessage(
                err.message ||
                "Unable to add user."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // DELETE USER
    // =========================================================

    const deleteUser = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            await apiFetch(
                `/api/users/${id}`,
                {
                    method: "DELETE"
                }
            );

            setMessage(
                "User deleted successfully."
            );

            await fetchUsers();

        } catch (err) {
            console.error(err);

            setMessage(
                err.message ||
                "Unable to delete user."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredUsers = useMemo(() => {
        const term = search
            .trim()
            .toLowerCase();

        if (!term) {
            return users;
        }

        return users.filter((user) => {
            const name = user.fullName || "";
            const email = user.email || "";
            const userRole = user.role || "";

            return (
                name.toLowerCase().includes(term) ||
                email.toLowerCase().includes(term) ||
                userRole.toLowerCase().includes(term)
            );
        });
    }, [users, search]);

    // =========================================================
    // STATISTICS
    // =========================================================

    const totalUsers = users.length;

    const activeUsers = users.filter(
        (user) => user.status === "ACTIVE"
    ).length;

    const hospitalStaff = users.filter(
        (user) => user.role === "HOSPITAL_STAFF"
    ).length;

    const labStaff = users.filter(
        (user) => user.role === "LAB_STAFF"
    ).length;

    // =========================================================
    // HOSPITAL NAME
    // =========================================================

    const getHospitalName = (hospitalId) => {
        if (!hospitalId) {
            return "Not Assigned";
        }

        const hospital = hospitals.find(
            (h) =>
                Number(h.hospitalId) ===
                Number(hospitalId)
        );

        if (!hospital) {
            return "Not Assigned";
        }

        return (
            hospital.hospitalName ||
            hospital.name ||
            "Hospital"
        );
    };

    // =========================================================
    // ROLE STYLE
    // =========================================================

    const getRoleClass = (userRole) => {
        switch (userRole) {
            case "ADMIN":
                return "role-admin";

            case "LAB_STAFF":
                return "role-lab";

            case "HOSPITAL_STAFF":
                return "role-hospital";

            case "RECEPTION_STAFF":
                return "role-reception";

            default:
                return "role-default";
        }
    };

    // =========================================================
    // RETURN
    // =========================================================

    return (
        <>
            <style>{styles}</style>

            <div className="users-page">

                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="users-header">

                    <div className="header-left">

                        <div className="header-icon">
                            👥
                        </div>

                        <div>
                            <h1>
                                User Management
                            </h1>

                            <p>
                                Manage BBMS system users
                                and staff accounts
                            </p>
                        </div>

                    </div>

                    <div className="admin-card">

                        <div className="admin-avatar">
                            {(
                                localStorage.getItem(
                                    "fullName"
                                ) || "A"
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                System Administrator
                            </strong>

                            <span>
                                {role || "ADMIN"}
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
                        icon="👥"
                        label="Total Users"
                        value={totalUsers}
                        color="purple"
                    />

                    <StatCard
                        icon="✓"
                        label="Active Users"
                        value={activeUsers}
                        color="green"
                    />

                    <StatCard
                        icon="🏥"
                        label="Hospital Staff"
                        value={hospitalStaff}
                        color="blue"
                    />

                    <StatCard
                        icon="🧪"
                        label="Lab Staff"
                        value={labStaff}
                        color="orange"
                    />

                </div>

                {/* =================================================
                    ADD USER
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
                                    Add New User
                                </h2>

                                <p>
                                    Create a new staff account
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

                                {/* FULL NAME */}

                                <div className="field">

                                    <label>
                                        Full Name
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            👤
                                        </span>

                                        <input
                                            name="fullName"
                                            placeholder="Enter full name"
                                            value={
                                                form.fullName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>

                                {/* EMAIL */}

                                <div className="field">

                                    <label>
                                        Email Address
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            ✉
                                        </span>

                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter email address"
                                            value={
                                                form.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>

                                {/* PASSWORD */}

                                <div className="field">

                                    <label>
                                        Password
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            🔒
                                        </span>

                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Enter password"
                                            value={
                                                form.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>

                                {/* ROLE */}

                                <div className="field">

                                    <label>
                                        User Role
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            🛡
                                        </span>

                                        <select
                                            name="role"
                                            value={
                                                form.role
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >

                                            <option value="ADMIN">
                                                Administrator
                                            </option>

                                            <option value="LAB_STAFF">
                                                Laboratory Staff
                                            </option>

                                            <option value="HOSPITAL_STAFF">
                                                Hospital Staff
                                            </option>

                                            <option value="RECEPTION_STAFF">
                                                Reception Staff
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                {/* STATUS */}

                                <div className="field">

                                    <label>
                                        Account Status
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            ●
                                        </span>

                                        <select
                                            name="status"
                                            value={
                                                form.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >

                                            <option value="ACTIVE">
                                                Active
                                            </option>

                                            <option value="INACTIVE">
                                                Inactive
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                {/* HOSPITAL */}

                                <div className="field">

                                    <label>
                                        Hospital{" "}
                                        <small>
                                            {(
                                                form.role ===
                                                "HOSPITAL_STAFF" ||
                                                form.role ===
                                                "RECEPTION_STAFF"
                                            )
                                                ? "Required"
                                                : "Optional"}
                                        </small>
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            🏥
                                        </span>

                                        <select
                                            name="hospitalId"
                                            value={
                                                form.hospitalId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                form.role !==
                                                    "HOSPITAL_STAFF" &&
                                                form.role !==
                                                    "RECEPTION_STAFF"
                                            }
                                        >

                                            <option value="">
                                                Select Hospital
                                            </option>

                                            {hospitals.map(
                                                (hospital) => (
                                                    <option
                                                        key={
                                                            hospital.hospitalId
                                                        }
                                                        value={
                                                            hospital.hospitalId
                                                        }
                                                    >
                                                        {
                                                            hospital.hospitalName ||
                                                            hospital.name
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>

                            </div>

                            {/* FORM FOOTER */}

                            <div className="form-footer">

                                <span>
                                    🔐 Passwords are securely
                                    encrypted by the backend.
                                </span>

                                <button
                                    className="add-user-btn"
                                    onClick={addUser}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating..."
                                        : "＋ Create User"}
                                </button>

                            </div>

                        </div>
                    )}

                </section>

                {/* =================================================
                    USERS TABLE
                ================================================= */}

                <section className="users-card">

                    <div className="table-header">

                        <div>

                            <h2>
                                System Users
                            </h2>

                            <p>
                                {filteredUsers.length}{" "}
                                user
                                {filteredUsers.length !== 1
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
                                placeholder="Search users..."
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

                    <div className="table-scroll">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        USER
                                    </th>

                                    <th>
                                        EMAIL
                                    </th>

                                    <th>
                                        ROLE
                                    </th>

                                    <th>
                                        STATUS
                                    </th>

                                    <th>
                                        HOSPITAL
                                    </th>

                                    <th className="action-header">
                                        ACTION
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredUsers.length > 0 ? (

                                    filteredUsers.map(
                                        (user) => (

                                            <tr
                                                key={
                                                    user.userId
                                                }
                                            >

                                                {/* USER */}

                                                <td>

                                                    <div className="user-cell">

                                                        <div className="user-avatar">

                                                            {(
                                                                user.fullName ||
                                                                "U"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    user.fullName
                                                                }
                                                            </strong>

                                                            <small>
                                                                ID #
                                                                {
                                                                    user.userId
                                                                }
                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* EMAIL */}

                                                <td>

                                                    <span className="email-text">
                                                        {
                                                            user.email
                                                        }
                                                    </span>

                                                </td>

                                                {/* ROLE */}

                                                <td>

                                                    <span
                                                        className={`role-badge ${getRoleClass(
                                                            user.role
                                                        )}`}
                                                    >

                                                        <span>
                                                            {user.role ===
                                                            "ADMIN"
                                                                ? "👑"
                                                                : user.role ===
                                                                  "LAB_STAFF"
                                                                ? "🧪"
                                                                : user.role ===
                                                                  "HOSPITAL_STAFF"
                                                                ? "🏥"
                                                                : "🎫"}
                                                        </span>

                                                        {
                                                            user.role
                                                        }

                                                    </span>

                                                </td>

                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={
                                                            user.status ===
                                                            "ACTIVE"
                                                                ? "status active"
                                                                : "status inactive"
                                                        }
                                                    >

                                                        <span className="status-dot" />

                                                        {
                                                            user.status
                                                        }

                                                    </span>

                                                </td>

                                                {/* HOSPITAL */}

                                                <td>

                                                    <div className="hospital-cell">

                                                        {user.hospitalId
                                                            ? "🏥"
                                                            : "—"}

                                                        <span>
                                                            {
                                                                getHospitalName(
                                                                    user.hospitalId
                                                                )
                                                            }
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* ACTION */}

                                                <td>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            deleteUser(
                                                                user.userId
                                                            )
                                                        }
                                                    >
                                                        🗑 Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="empty-state"
                                        >

                                            <div>
                                                🔎
                                            </div>

                                            <strong>
                                                No users found
                                            </strong>

                                            <span>
                                                Try a different
                                                search term.
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
// STYLES
// =============================================================

const styles = `

* {
    box-sizing: border-box;
}


/* =========================================================
   PAGE
========================================================= */

.users-page {

    min-height: 100vh;

    padding: 30px 34px 45px;

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

.users-header {

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

    font-size: 29px;

    box-shadow:
        0 8px 20px
        rgba(79,70,229,.25);
}

.users-header h1 {

    margin: 0;

    font-size: 35px;

    font-weight: 800;

    letter-spacing: -.8px;

    color: #172554;
}

.users-header p {

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

    background: rgba(255,255,255,.85);

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

    font-size: 22px;
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
.users-card {

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

.field label small {

    color: #94a3b8;

    font-size: 10px;

    font-weight: 500;
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

.input-wrapper input,
.input-wrapper select {

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

.input-wrapper select {

    cursor: pointer;
}

.input-wrapper select:disabled {

    color: #94a3b8;

    cursor: not-allowed;
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

.add-user-btn {

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

.add-user-btn:hover {

    transform: translateY(-1px);

    box-shadow:
        0 7px 16px
        rgba(79,70,229,.27);
}

.add-user-btn:disabled {

    opacity: .6;

    cursor: not-allowed;

    transform: none;
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
   TABLE
========================================================= */

.table-scroll {

    overflow-x: auto;
}

table {

    width: 100%;

    border-collapse: collapse;

    min-width: 1000px;
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

    padding: 14px 18px;

    text-align: left;

    color: white;

    font-size: 11px;

    font-weight: 800;

    letter-spacing: .04em;
}

.action-header {

    text-align: center;
}

td {

    padding: 15px 18px;

    border-bottom:
        1px solid #edf2f7;

    color: #475569;

    font-size: 12px;
}

tbody tr {

    transition:
        background .15s;
}

tbody tr:hover {

    background: #f8faff;
}

tbody tr:last-child td {

    border-bottom: none;
}


/* =========================================================
   USER
========================================================= */

.user-cell {

    display: flex;

    align-items: center;

    gap: 11px;
}

.user-avatar {

    width: 39px;
    height: 39px;

    display: flex;

    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    border-radius: 9px;

    background:
        linear-gradient(
            135deg,
            #eef2ff,
            #ede9fe
        );

    color: #4f46e5;

    font-size: 14px;

    font-weight: 800;
}

.user-cell strong {

    display: block;

    color: #334155;

    font-size: 12px;
}

.user-cell small {

    display: block;

    margin-top: 3px;

    color: #94a3b8;

    font-size: 9px;
}

.email-text {

    color: #64748b;

    font-size: 12px;
}


/* =========================================================
   ROLE BADGES
========================================================= */

.role-badge {

    display: inline-flex;

    align-items: center;

    gap: 5px;

    padding: 6px 9px;

    border-radius: 6px;

    font-size: 10px;

    font-weight: 800;

    white-space: nowrap;
}

.role-admin {

    background: #eef2ff;

    color: #4338ca;
}

.role-lab {

    background: #fff7ed;

    color: #c2410c;
}

.role-hospital {

    background: #eff6ff;

    color: #0369a1;
}

.role-reception {

    background: #fdf2f8;

    color: #be185d;
}

.role-default {

    background: #f1f5f9;

    color: #475569;
}


/* =========================================================
   STATUS
========================================================= */

.status {

    display: inline-flex;

    align-items: center;

    gap: 6px;

    padding: 6px 9px;

    border-radius: 20px;

    font-size: 10px;

    font-weight: 800;
}

.status-dot {

    width: 7px;
    height: 7px;

    border-radius: 50%;
}

.status.active {

    background: #dcfce7;

    color: #15803d;
}

.status.active .status-dot {

    background: #16a34a;
}

.status.inactive {

    background: #fee2e2;

    color: #b91c1c;
}

.status.inactive .status-dot {

    background: #ef4444;
}


/* =========================================================
   HOSPITAL
========================================================= */

.hospital-cell {

    display: flex;

    align-items: center;

    gap: 7px;

    color: #64748b;

    font-size: 11px;
}


/* =========================================================
   DELETE
========================================================= */

.delete-btn {

    display: block;

    margin: auto;

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

    padding: 50px 20px !important;

    text-align: center;

    color: #94a3b8;
}

.empty-state div {

    font-size: 32px;

    margin-bottom: 8px;
}

.empty-state strong {

    display: block;

    color: #475569;

    font-size: 14px;
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

    .form-grid {

        grid-template-columns:
            repeat(2, 1fr);
    }

    .stats-grid {

        grid-template-columns:
            repeat(2, 1fr);
    }
}


@media (max-width: 750px) {

    .users-page {

        padding:
            20px 14px 35px;
    }

    .users-header {

        align-items: flex-start;

        flex-direction: column;
    }

    .users-header h1 {

        font-size: 29px;
    }

    .admin-card {

        width: 100%;
    }

    .form-grid {

        grid-template-columns: 1fr;
    }

    .stats-grid {

        grid-template-columns:
            1fr 1fr;
    }

    .table-header {

        align-items: flex-start;

        flex-direction: column;
    }

    .search-box {

        width: 100%;
    }

    .form-footer {

        align-items: flex-start;

        flex-direction: column;
    }

    .add-user-btn {

        width: 100%;
    }
}


@media (max-width: 450px) {

    .stats-grid {

        grid-template-columns: 1fr;
    }

    .users-header h1 {

        font-size: 25px;
    }
}


/* =========================================================
   PRINT
========================================================= */

@media print {

    .users-page {

        background: white;

        padding: 10px;
    }

    .form-card,
    .stats-grid,
    .message,
    .search-box,
    .delete-btn,
    .admin-card {

        display: none !important;
    }

    .users-card {

        box-shadow: none;

        border: 1px solid #ddd;
    }
}

`;

export default UserManagement;