import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import roleConfig from "./roleConfig";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const role = (localStorage.getItem("role") || "")
        .trim()
        .toUpperCase();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const access = roleConfig[role] || [];

    const firstName =
        user?.fullName?.split(" ")[0] || "User";

    const getInitials = (name) => {
        if (!name) return "U";

        const parts = name.trim().split(" ");

        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };

    const initials = getInitials(user?.fullName);

    const menuItems = {
        main: [
            {
                key: "dashboard",
                label: "Dashboard",
                icon: "⌂",
                path: "/dashboard",
            },
        ],

        management: [
            {
                key: "users",
                label: "User Management",
                icon: "♙",
                path: "/users",
            },
            {
                key: "hospitals",
                label: "Hospital Management",
                icon: "✚",
                path: "/hospitals",
            },
            {
                key: "donorManagement",
                label: "Donor Management",
                icon: "♟",
                path: "/donors",
            },
            {
                key: "donorRegistration",
                label: "Donor Registration",
                icon: "＋",
                path: "/donor-registration",
            },
            {
                key: "donorApproval",
                label: "Donor Approval",
                icon: "✓",
                path: "/donor-approval",
            },
        ],

        bloodOperations: [
            {
                key: "screening",
                label: "Donor Screening",
                icon: "♡",
                path: "/screening",
            },
            {
                key: "donation",
                label: "Donations",
                icon: "♥",
                path: "/donations",
            },
            {
                key: "bloodTesting",
                label: "Blood Testing",
                icon: "⚗",
                path: "/blood-tests",
            },
            {
                key: "bloodComponents",
                label: "Blood Components",
                icon: "◈",
                path: "/blood-components",
            },
            {
                key: "inventory",
                label: "Blood Inventory",
                icon: "▦",
                path: "/inventory",
            },
            {
                key: "bloodRequests",
                label: "Blood Requests",
                icon: "⇄",
                path: "/blood-requests",
            },
            {
                key: "bloodIssue",
                label: "Blood Issue",
                icon: "↗",
                path: "/blood-issue",
            },
        ],

        system: [
            {
                key: "alerts",
                label: "Alerts",
                icon: "!",
                path: "/alerts",
            },
            {
                key: "reports",
                label: "Reports",
                icon: "▥",
                path: "/reports",
            },
            {
                key: "audit",
                label: "Audit Logs",
                icon: "◷",
                path: "/audit-logs",
            },
        ],
    };

    const isActive = (path) => {
        if (path === "/dashboard") {
            return location.pathname === "/dashboard";
        }

        return location.pathname.startsWith(path);
    };

    const renderItem = (item) => {
        if (!access.includes(item.key)) {
            return null;
        }

        const active = isActive(item.path);

        return (
            <button
                key={item.key}
                className={`bbms-menu-item ${
                    active ? "active" : ""
                }`}
                onClick={() => navigate(item.path)}
            >
                <span className="bbms-menu-icon">
                    {item.icon}
                </span>

                <span className="bbms-menu-label">
                    {item.label}
                </span>

                {active && (
                    <span className="bbms-active-dot" />
                )}
            </button>
        );
    };

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            <style>{`
                .bbms-sidebar {
                    width: 270px;
                    min-width: 270px;
                    height: 100vh;

                    display: flex;
                    flex-direction: column;

                    background:
                        linear-gradient(
                            180deg,
                            #101827 0%,
                            #0b1220 100%
                        );

                    color: white;

                    border-right: 1px solid rgba(255,255,255,0.06);

                    box-shadow:
                        8px 0 30px rgba(15,23,42,0.12);

                    position: sticky;
                    top: 0;

                    overflow: hidden;

                    font-family:
                        "DM Sans",
                        "Segoe UI",
                        sans-serif;

                    z-index: 1000;
                }

                /* =========================
                   BRAND
                ========================= */

                .bbms-brand {
                    padding: 25px 21px 20px;

                    display: flex;
                    align-items: center;
                    gap: 13px;

                    border-bottom:
                        1px solid rgba(255,255,255,0.06);
                }

                .bbms-brand-icon {
                    width: 43px;
                    height: 43px;

                    border-radius: 13px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background:
                        linear-gradient(
                            135deg,
                            #ef4444,
                            #b91c1c
                        );

                    box-shadow:
                        0 7px 20px rgba(239,68,68,0.30);

                    font-size: 22px;
                    font-weight: 800;
                }

                .bbms-brand-text {
                    line-height: 1.1;
                }

                .bbms-brand-title {
                    font-size: 21px;
                    font-weight: 800;
                    letter-spacing: 0.04em;
                }

                .bbms-brand-subtitle {
                    margin-top: 4px;

                    color: #718096;

                    font-size: 9px;
                    font-weight: 600;

                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                }

                /* =========================
                   USER PROFILE
                ========================= */

                .bbms-user-card {
                    margin: 18px 14px 12px;

                    padding: 12px;

                    display: flex;
                    align-items: center;

                    gap: 11px;

                    border-radius: 13px;

                    background:
                        rgba(255,255,255,0.045);

                    border:
                        1px solid rgba(255,255,255,0.06);
                }

                .bbms-user-avatar {
                    width: 39px;
                    height: 39px;

                    flex-shrink: 0;

                    border-radius: 50%;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background:
                        linear-gradient(
                            135deg,
                            #4f46e5,
                            #7c3aed
                        );

                    color: white;

                    font-size: 13px;
                    font-weight: 800;

                    box-shadow:
                        0 4px 12px rgba(79,70,229,0.25);
                }

                .bbms-user-info {
                    min-width: 0;
                }

                .bbms-user-name {
                    color: #f8fafc;

                    font-size: 13px;
                    font-weight: 600;

                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .bbms-user-role {
                    display: inline-block;

                    margin-top: 4px;

                    padding: 3px 7px;

                    border-radius: 5px;

                    background: rgba(79,110,247,0.15);

                    color: #8ea4ff;

                    font-size: 8px;
                    font-weight: 700;

                    letter-spacing: 0.07em;

                    text-transform: uppercase;
                }

                /* =========================
                   NAVIGATION
                ========================= */

                .bbms-nav {
                    flex: 1;

                    overflow-y: auto;

                    padding: 5px 12px 15px;
                }

                .bbms-nav::-webkit-scrollbar {
                    width: 4px;
                }

                .bbms-nav::-webkit-scrollbar-track {
                    background: transparent;
                }

                .bbms-nav::-webkit-scrollbar-thumb {
                    background: #26334a;
                    border-radius: 20px;
                }

                .bbms-section {
                    margin-top: 18px;
                }

                .bbms-section:first-child {
                    margin-top: 5px;
                }

                .bbms-section-title {
                    padding:
                        7px 12px 7px;

                    color: #52627a;

                    font-size: 9px;
                    font-weight: 800;

                    letter-spacing: 0.13em;

                    text-transform: uppercase;
                }

                .bbms-menu-item {
                    position: relative;

                    width: 100%;

                    display: flex;
                    align-items: center;

                    gap: 12px;

                    padding: 10px 12px;

                    margin: 3px 0;

                    border: none;
                    border-radius: 10px;

                    background: transparent;

                    color: #8d9ab0;

                    font-family: inherit;

                    font-size: 13px;
                    font-weight: 500;

                    text-align: left;

                    cursor: pointer;

                    transition:
                        background .18s ease,
                        color .18s ease,
                        transform .18s ease;
                }

                .bbms-menu-item:hover {
                    background:
                        rgba(255,255,255,0.055);

                    color: #f1f5f9;

                    transform:
                        translateX(2px);
                }

                .bbms-menu-item.active {
                    background:
                        linear-gradient(
                            90deg,
                            rgba(79,70,229,0.27),
                            rgba(79,70,229,0.08)
                        );

                    color: white;

                    box-shadow:
                        inset 0 0 0 1px
                        rgba(99,102,241,0.10);
                }

                .bbms-menu-icon {
                    width: 24px;
                    height: 24px;

                    flex-shrink: 0;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 7px;

                    color: #75839a;

                    font-size: 15px;

                    transition:
                        background .18s ease,
                        color .18s ease;
                }

                .bbms-menu-item:hover
                .bbms-menu-icon {
                    color: #c7d2fe;
                    background:
                        rgba(99,102,241,0.10);
                }

                .bbms-menu-item.active
                .bbms-menu-icon {
                    color: #a5b4fc;

                    background:
                        rgba(99,102,241,0.15);
                }

                .bbms-menu-label {
                    flex: 1;
                }

                .bbms-active-dot {
                    width: 5px;
                    height: 5px;

                    border-radius: 50%;

                    background: #818cf8;

                    box-shadow:
                        0 0 8px
                        rgba(129,140,248,0.8);
                }

                /* =========================
                   BOTTOM
                ========================= */

                .bbms-sidebar-bottom {
                    padding: 12px 14px 15px;

                    border-top:
                        1px solid rgba(255,255,255,0.06);

                    background:
                        rgba(7,12,22,0.35);
                }

                .bbms-status {
                    display: flex;
                    align-items: center;

                    gap: 8px;

                    padding: 7px 5px 10px;

                    color: #65748a;

                    font-size: 10px;
                }

                .bbms-status-dot {
                    width: 7px;
                    height: 7px;

                    border-radius: 50%;

                    background: #22c55e;

                    box-shadow:
                        0 0 8px
                        rgba(34,197,94,0.65);
                }

                .bbms-logout {
                    width: 100%;

                    display: flex;
                    align-items: center;

                    gap: 10px;

                    padding: 10px 12px;

                    border:
                        1px solid rgba(239,68,68,0.13);

                    border-radius: 10px;

                    background:
                        rgba(239,68,68,0.07);

                    color: #fca5a5;

                    font-family: inherit;

                    font-size: 13px;
                    font-weight: 600;

                    cursor: pointer;

                    transition:
                        background .18s ease,
                        color .18s ease,
                        transform .18s ease;
                }

                .bbms-logout:hover {
                    background:
                        rgba(239,68,68,0.15);

                    color: #fecaca;

                    transform: translateY(-1px);
                }

                .bbms-logout-icon {
                    font-size: 16px;
                }

                /* =========================
                   MOBILE
                ========================= */

                @media (max-width: 900px) {
                    .bbms-sidebar {
                        width: 230px;
                        min-width: 230px;
                    }

                    .bbms-brand-title {
                        font-size: 18px;
                    }

                    .bbms-menu-item {
                        font-size: 12px;
                    }
                }
            `}</style>

            <aside className="bbms-sidebar">

                {/* BRAND */}
                <div className="bbms-brand">

                    <div className="bbms-brand-icon">
                        🩸
                    </div>

                    <div className="bbms-brand-text">
                        <div className="bbms-brand-title">
                            BBMS
                        </div>

                        <div className="bbms-brand-subtitle">
                            Blood Bank Management
                        </div>
                    </div>

                </div>

                {/* USER */}
                <div className="bbms-user-card">

                    <div className="bbms-user-avatar">
                        {initials}
                    </div>

                    <div className="bbms-user-info">

                        <div className="bbms-user-name">
                            {firstName}
                        </div>

                        <span className="bbms-user-role">
                            {role.replaceAll("_", " ")}
                        </span>

                    </div>

                </div>

                {/* NAVIGATION */}
                <nav className="bbms-nav">

                    {/* MAIN */}
                    <div className="bbms-section">

                        <div className="bbms-section-title">
                            Main
                        </div>

                        {menuItems.main.map(renderItem)}

                    </div>

                    {/* MANAGEMENT */}
                    <div className="bbms-section">

                        <div className="bbms-section-title">
                            Management
                        </div>

                        {menuItems.management.map(renderItem)}

                    </div>

                    {/* BLOOD OPERATIONS */}
                    <div className="bbms-section">

                        <div className="bbms-section-title">
                            Blood Operations
                        </div>

                        {menuItems.bloodOperations.map(renderItem)}

                    </div>

                    {/* SYSTEM */}
                    <div className="bbms-section">

                        <div className="bbms-section-title">
                            System
                        </div>

                        {menuItems.system.map(renderItem)}

                    </div>

                </nav>

                {/* BOTTOM */}
                <div className="bbms-sidebar-bottom">

                    <div className="bbms-status">

                        <span className="bbms-status-dot" />

                        System connected

                    </div>

                    <button
                        className="bbms-logout"
                        onClick={logout}
                    >
                        <span className="bbms-logout-icon">
                            ↪
                        </span>

                        <span>
                            Sign Out
                        </span>
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;