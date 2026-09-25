import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { apiFetch } from "./api";
import Sidebar from "./Sidebar";

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
    indigo: "#4f46e5",
    indigoLight: "#eef2ff",

    red: "#e11d48",
    redLight: "#fff1f2",

    purple: "#9333ea",
    purpleLight: "#faf5ff",

    blue: "#0284c7",
    blueLight: "#f0f9ff",

    cyan: "#0891b2",
    cyanLight: "#ecfeff",

    green: "#16a34a",
    greenLight: "#f0fdf4",

    orange: "#f97316",
    orangeLight: "#fff7ed",

    yellow: "#ca8a04",
    yellowLight: "#fefce8",

    dark: "#0f172a",
    gray: "#64748b",
    lightGray: "#94a3b8",
};

/* =========================================================
   GLOBAL DASHBOARD STYLES
========================================================= */

const styles = `
@import url(
    'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap'
);

* {
    box-sizing: border-box;
}

/* =========================================================
   PAGE
========================================================= */

.bbms-dashboard {
    min-height: 100vh;

    background:
        radial-gradient(
            circle at 5% 5%,
            rgba(99, 102, 241, 0.10),
            transparent 25%
        ),
        radial-gradient(
            circle at 95% 10%,
            rgba(14, 165, 233, 0.09),
            transparent 25%
        ),
        radial-gradient(
            circle at 80% 90%,
            rgba(236, 72, 153, 0.06),
            transparent 25%
        ),
        linear-gradient(
            135deg,
            #f8fafc 0%,
            #eef2ff 50%,
            #f8fafc 100%
        );

    color: #0f172a;

    font-family:
        "DM Sans",
        "Segoe UI",
        sans-serif;
}

/* =========================================================
   MAIN CONTENT
========================================================= */

.bbms-dashboard-main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
}

.bbms-dashboard-content {
    padding: 34px 38px 45px;

    max-width: 1800px;

    margin: 0 auto;
}

/* =========================================================
   HEADER
========================================================= */

.bbms-dashboard-header {
    display: flex;

    justify-content: space-between;
    align-items: center;

    gap: 25px;

    margin-bottom: 30px;
}

.bbms-header-left {
    min-width: 0;
}

.bbms-welcome {
    font-family: "Syne", sans-serif;

    font-size: 35px;

    font-weight: 800;

    line-height: 1.15;

    margin: 0;

    background:
        linear-gradient(
            90deg,
            #0f172a 0%,
            #4f46e5 55%,
            #7c3aed 100%
        );

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    background-clip: text;
}

.bbms-subtitle {
    margin: 9px 0 0;

    color: #64748b;

    font-size: 14px;

    line-height: 1.6;
}

/* =========================================================
   USER BADGE
========================================================= */

.bbms-user-card {
    display: flex;

    align-items: center;

    gap: 12px;

    padding: 12px 16px;

    min-width: 220px;

    border-radius: 16px;

    background:
        rgba(255, 255, 255, 0.88);

    border:
        1px solid rgba(226, 232, 240, 0.9);

    box-shadow:
        0 8px 25px rgba(15, 23, 42, 0.07);

    backdrop-filter: blur(12px);
}

.bbms-user-avatar {
    width: 44px;
    height: 44px;

    flex-shrink: 0;

    border-radius: 14px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    font-size: 15px;
    font-weight: 800;

    background:
        linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
        );

    box-shadow:
        0 7px 16px rgba(79, 70, 229, 0.25);
}

.bbms-user-details {
    min-width: 0;
}

.bbms-user-name {
    color: #0f172a;

    font-size: 13px;

    font-weight: 700;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
}

.bbms-user-role {
    display: inline-block;

    margin-top: 5px;

    padding: 4px 8px;

    border-radius: 6px;

    background: #eef2ff;

    color: #4f46e5;

    font-size: 9px;

    font-weight: 800;

    letter-spacing: 0.08em;

    text-transform: uppercase;
}

/* =========================================================
   ERROR
========================================================= */

.bbms-error {
    display: flex;

    align-items: center;

    gap: 10px;

    padding: 14px 18px;

    margin-bottom: 22px;

    border-radius: 13px;

    background: #fef2f2;

    border: 1px solid #fecaca;

    color: #991b1b;

    font-size: 13px;

    font-weight: 500;
}

/* =========================================================
   STATISTICS
========================================================= */

.bbms-stats-grid {
    display: grid;

    grid-template-columns:
        repeat(4, minmax(0, 1fr));

    gap: 18px;

    margin-bottom: 20px;
}

.bbms-stat-card {
    position: relative;

    min-height: 176px;

    padding: 22px;

    border-radius: 19px;

    background:
        rgba(255, 255, 255, 0.94);

    border:
        1px solid rgba(226, 232, 240, 0.9);

    box-shadow:
        0 6px 24px rgba(15, 23, 42, 0.055);

    overflow: hidden;

    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;
}

.bbms-stat-card:hover {
    transform: translateY(-6px);

    box-shadow:
        0 18px 35px rgba(15, 23, 42, 0.11);
}

/* Decorative glow */

.bbms-stat-card::after {
    content: "";

    position: absolute;

    width: 110px;
    height: 110px;

    right: -40px;
    bottom: -45px;

    border-radius: 50%;

    opacity: 0.10;
}

.bbms-stat-card.indigo::before,
.bbms-stat-card.red::before,
.bbms-stat-card.purple::before,
.bbms-stat-card.blue::before,
.bbms-stat-card.orange::before,
.bbms-stat-card.yellow::before,
.bbms-stat-card.green::before,
.bbms-stat-card.cyan::before {
    content: "";

    position: absolute;

    top: 0;
    left: 0;
    right: 0;

    height: 5px;
}

/* Card accent colors */

.bbms-stat-card.indigo::before {
    background:
        linear-gradient(
            90deg,
            #4f46e5,
            #818cf8
        );
}

.bbms-stat-card.indigo::after {
    background: #4f46e5;
}

.bbms-stat-card.red::before {
    background:
        linear-gradient(
            90deg,
            #e11d48,
            #fb7185
        );
}

.bbms-stat-card.red::after {
    background: #e11d48;
}

.bbms-stat-card.purple::before {
    background:
        linear-gradient(
            90deg,
            #9333ea,
            #c084fc
        );
}

.bbms-stat-card.purple::after {
    background: #9333ea;
}

.bbms-stat-card.blue::before {
    background:
        linear-gradient(
            90deg,
            #0284c7,
            #38bdf8
        );
}

.bbms-stat-card.blue::after {
    background: #0284c7;
}

.bbms-stat-card.orange::before {
    background:
        linear-gradient(
            90deg,
            #f97316,
            #fb923c
        );
}

.bbms-stat-card.orange::after {
    background: #f97316;
}

.bbms-stat-card.yellow::before {
    background:
        linear-gradient(
            90deg,
            #ca8a04,
            #facc15
        );
}

.bbms-stat-card.yellow::after {
    background: #ca8a04;
}

.bbms-stat-card.green::before {
    background:
        linear-gradient(
            90deg,
            #16a34a,
            #4ade80
        );
}

.bbms-stat-card.green::after {
    background: #16a34a;
}

.bbms-stat-card.cyan::before {
    background:
        linear-gradient(
            90deg,
            #0891b2,
            #22d3ee
        );
}

.bbms-stat-card.cyan::after {
    background: #0891b2;
}

/* =========================================================
   STAT ICON
========================================================= */

.bbms-stat-icon {
    width: 52px;
    height: 52px;

    border-radius: 15px;

    display: flex;

    align-items: center;
    justify-content: center;

    font-size: 24px;

    box-shadow:
        0 7px 15px rgba(15, 23, 42, 0.08);
}

.bbms-stat-label {
    margin-top: 18px;

    color: #64748b;

    font-size: 11px;

    font-weight: 700;

    letter-spacing: 0.06em;

    text-transform: uppercase;
}

.bbms-stat-value {
    margin-top: 5px;

    font-family: "Syne", sans-serif;

    font-size: 34px;

    font-weight: 800;

    line-height: 1;
}

/* =========================================================
   SECTION GRID
========================================================= */

.bbms-dashboard-grid {
    display: grid;

    grid-template-columns:
        minmax(0, 1.4fr)
        minmax(350px, 1fr);

    gap: 20px;

    margin-bottom: 20px;
}

/* =========================================================
   DASHBOARD CARD
========================================================= */

.bbms-panel {
    position: relative;

    background:
        rgba(255, 255, 255, 0.95);

    border:
        1px solid rgba(226, 232, 240, 0.95);

    border-radius: 20px;

    padding: 25px;

    box-shadow:
        0 7px 25px rgba(15, 23, 42, 0.055);

    overflow: hidden;
}

.bbms-panel::before {
    content: "";

    position: absolute;

    top: 0;
    left: 0;
    right: 0;

    height: 4px;

    background:
        linear-gradient(
            90deg,
            #4f46e5,
            #06b6d4
        );
}

.bbms-panel.pink-accent::before {
    background:
        linear-gradient(
            90deg,
            #e11d48,
            #9333ea
        );
}

.bbms-panel.green-accent::before {
    background:
        linear-gradient(
            90deg,
            #16a34a,
            #06b6d4
        );
}

.bbms-panel.orange-accent::before {
    background:
        linear-gradient(
            90deg,
            #f97316,
            #facc15
        );
}

.bbms-panel-header {
    display: flex;

    justify-content: space-between;

    align-items: flex-start;

    gap: 15px;

    margin-bottom: 22px;
}

.bbms-panel-title {
    margin: 0;

    font-family: "Syne", sans-serif;

    color: #0f172a;

    font-size: 18px;

    font-weight: 800;
}

.bbms-panel-description {
    margin: 5px 0 0;

    color: #94a3b8;

    font-size: 12px;
}

/* =========================================================
   PANEL BADGE
========================================================= */

.bbms-panel-badge {
    padding: 6px 10px;

    border-radius: 8px;

    background: #eef2ff;

    color: #4f46e5;

    font-size: 10px;

    font-weight: 700;
}

/* =========================================================
   CHART
========================================================= */

.bbms-chart {
    width: 100%;

    height: 290px;
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

.bbms-tooltip {
    padding: 12px 14px;

    border-radius: 10px;

    background: rgba(15, 23, 42, 0.95);

    color: white;

    box-shadow:
        0 8px 20px rgba(15, 23, 42, 0.18);

    font-size: 12px;
}

.bbms-tooltip-title {
    font-weight: 700;

    margin-bottom: 4px;
}

/* =========================================================
   TEST STATUS
========================================================= */

.bbms-test-summary {
    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 10px;

    margin-top: 8px;
}

.bbms-test-item {
    padding: 11px 9px;

    border-radius: 11px;

    text-align: center;

    border: 1px solid #e2e8f0;
}

.bbms-test-number {
    font-family: "Syne", sans-serif;

    font-size: 20px;

    font-weight: 800;
}

.bbms-test-name {
    margin-top: 3px;

    color: #64748b;

    font-size: 10px;

    font-weight: 600;
}

/* =========================================================
   PROGRESS
========================================================= */

.bbms-progress-list {
    display: flex;

    flex-direction: column;

    gap: 21px;
}

.bbms-progress-row {
    display: flex;

    align-items: center;

    gap: 13px;
}

.bbms-progress-label {
    width: 90px;

    color: #475569;

    font-size: 12px;

    font-weight: 600;
}

.bbms-progress-track {
    flex: 1;

    height: 10px;

    background: #f1f5f9;

    border-radius: 20px;

    overflow: hidden;
}

.bbms-progress-bar {
    height: 100%;

    border-radius: 20px;

    transition:
        width 0.8s ease;
}

.bbms-progress-value {
    width: 45px;

    text-align: right;

    color: #0f172a;

    font-size: 12px;

    font-weight: 800;
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

.bbms-quick-actions {
    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 13px;
}

.bbms-quick-action {
    position: relative;

    padding: 17px;

    border-radius: 14px;

    border:
        1px solid #e2e8f0;

    background:
        linear-gradient(
            135deg,
            #ffffff,
            #f8fafc
        );

    text-align: left;

    cursor: pointer;

    transition:
        transform .2s ease,
        box-shadow .2s ease,
        border-color .2s ease;
}

.bbms-quick-action:hover {
    transform: translateY(-4px);

    border-color: #c7d2fe;

    box-shadow:
        0 10px 22px rgba(79, 70, 229, 0.10);
}

.bbms-quick-icon {
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 11px;

    margin-bottom: 11px;

    font-size: 20px;
}

.bbms-quick-title {
    color: #0f172a;

    font-size: 13px;

    font-weight: 800;
}

.bbms-quick-description {
    margin-top: 4px;

    color: #94a3b8;

    font-size: 10px;
}

/* =========================================================
   BLOOD GROUP LEGEND
========================================================= */

.bbms-blood-legend {
    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 9px;

    margin-top: 3px;
}

.bbms-blood-item {
    padding: 9px;

    border-radius: 10px;

    background: #f8fafc;

    border: 1px solid #e2e8f0;

    text-align: center;
}

.bbms-blood-group {
    font-weight: 800;

    font-size: 12px;
}

.bbms-blood-units {
    margin-top: 3px;

    color: #64748b;

    font-size: 10px;
}

/* =========================================================
   LOADING
========================================================= */

.bbms-loading {
    min-height: 100vh;

    display: flex;

    align-items: center;
    justify-content: center;

    background:
        linear-gradient(
            135deg,
            #f8fafc,
            #eef2ff
        );
}

.bbms-loading-box {
    text-align: center;

    color: #64748b;

    font-size: 14px;
}

.bbms-spinner {
    width: 46px;
    height: 46px;

    margin: 0 auto 15px;

    border-radius: 50%;

    border:
        4px solid #e2e8f0;

    border-top-color: #4f46e5;

    border-right-color: #e11d48;

    animation:
        bbms-spin .8s linear infinite;
}

@keyframes bbms-spin {
    to {
        transform: rotate(360deg);
    }
}

/* =========================================================
   FADE ANIMATION
========================================================= */

.bbms-fade {
    animation:
        bbms-fade-up .45s ease both;
}

@keyframes bbms-fade-up {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1250px) {

    .bbms-stats-grid {
        grid-template-columns:
            repeat(2, minmax(0, 1fr));
    }

    .bbms-dashboard-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 800px) {

    .bbms-dashboard-content {
        padding: 22px 18px 35px;
    }

    .bbms-dashboard-header {
        align-items: flex-start;

        flex-direction: column;
    }

    .bbms-user-card {
        width: 100%;
    }

    .bbms-welcome {
        font-size: 28px;
    }

    .bbms-stats-grid {
        grid-template-columns: 1fr;
    }

    .bbms-blood-legend {
        grid-template-columns:
            repeat(2, 1fr);
    }
}

@media (max-width: 500px) {

    .bbms-quick-actions {
        grid-template-columns: 1fr;
    }

    .bbms-test-summary {
        grid-template-columns: 1fr;
    }
}
`;

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    icon,
    label,
    value,
    color,
    background,
    className,
}) {
    return (
        <div className={`bbms-stat-card ${className} bbms-fade`}>

            <div
                className="bbms-stat-icon"
                style={{
                    color: color,
                    background: background,
                }}
            >
                {icon}
            </div>

            <div className="bbms-stat-label">
                {label}
            </div>

            <div
                className="bbms-stat-value"
                style={{
                    color: color,
                }}
            >
                {value ?? 0}
            </div>

        </div>
    );
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function InventoryTooltip({
    active,
    payload,
    label,
}) {
    if (!active || !payload || !payload.length) {
        return null;
    }

    return (
        <div className="bbms-tooltip">

            <div className="bbms-tooltip-title">
                Blood Group: {label}
            </div>

            <div>
                Available:
                {" "}
                <strong>
                    {payload[0].value}
                </strong>
                {" "}
                units
            </div>

        </div>
    );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {

    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [inventory, setInventory] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    /* =====================================================
       USER
    ===================================================== */

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const role = (
        user?.role ||
        localStorage.getItem("role") ||
        ""
    )
        .trim()
        .toUpperCase();

    /* =====================================================
       LOAD DASHBOARD
    ===================================================== */

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                setError("");

                const [
                    reportData,
                    inventoryData,
                ] = await Promise.all([
                    apiFetch("/api/reports"),
                    apiFetch("/api/inventory"),
                ]);

                setReport(reportData);

                if (Array.isArray(inventoryData)) {

                    setInventory(inventoryData);

                } else {

                    setInventory([]);

                }

            } catch (err) {

                console.error(
                    "Dashboard loading error:",
                    err
                );

                const message =
                    err?.message || "";

                if (
                    message.includes("401") ||
                    message.includes("403")
                ) {

                    localStorage.clear();

                    navigate("/login");

                    return;
                }

                setError(
                    "Unable to load dashboard data. Please check your backend connection."
                );

            } finally {

                setLoading(false);

            }
        };

        loadDashboard();

    }, [navigate]);

    /* =====================================================
       LOGIN CHECK
    ===================================================== */

    if (!user) {

        return (
            <>
                <style>
                    {styles}
                </style>

                <div className="bbms-loading">

                    <div className="bbms-loading-box">

                        Please login first.

                    </div>

                </div>
            </>
        );
    }

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (
            <>
                <style>
                    {styles}
                </style>

                <div className="bbms-loading">

                    <div className="bbms-loading-box">

                        <div className="bbms-spinner" />

                        Loading BBMS Dashboard...

                    </div>

                </div>
            </>
        );
    }

    /* =====================================================
       DATA
    ===================================================== */

    const data = report || {};

    /* =====================================================
       BLOOD GROUPS
    ===================================================== */

    const bloodGroups = [
        "A+",
        "A-",
        "B+",
        "B-",
        "O+",
        "O-",
        "AB+",
        "AB-",
    ];

    const bloodColors = [
        "#4f46e5",
        "#6366f1",
        "#8b5cf6",
        "#a855f7",
        "#e11d48",
        "#f43f5e",
        "#0284c7",
        "#06b6d4",
    ];

    const bloodGroupData =
        bloodGroups.map((group) => {

            const total = inventory
                .filter(
                    (item) =>
                        item.bloodGroup === group
                )
                .reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.quantity || 0
                        ),
                    0
                );

            return {
                name: group,
                units: total,
            };
        });

    /* =====================================================
       BLOOD TEST DATA
    ===================================================== */

    const bloodTestData = [
        {
            name: "Safe",
            value: Number(
                data.safeBloodTests || 0
            ),
        },
        {
            name: "Unsafe",
            value: Number(
                data.unsafeBloodTests || 0
            ),
        },
        {
            name: "Pending",
            value: Number(
                data.pendingBloodTests || 0
            ),
        },
    ];

    const testColors = [
        COLORS.green,
        COLORS.red,
        COLORS.orange,
    ];

    /* =====================================================
       DONATION PROGRESS
    ===================================================== */

    const totalDonations =
        Number(
            data.totalDonations || 0
        );

    const completedDonations =
        Number(
            data.completedDonations || 0
        );

    const donationPercentage =
        totalDonations > 0
            ? Math.round(
                  (completedDonations /
                      totalDonations) *
                      100
              )
            : 0;

    /* =====================================================
       REQUEST PROGRESS
    ===================================================== */

    const totalRequests =
        Number(
            data.totalRequests || 0
        );

    const pendingRequests =
        Number(
            data.pendingRequests || 0
        );

    const processedRequests =
        Math.max(
            totalRequests -
                pendingRequests,
            0
        );

    const requestPercentage =
        totalRequests > 0
            ? Math.round(
                  (processedRequests /
                      totalRequests) *
                      100
              )
            : 0;

    /* =====================================================
       SAFE TEST PERCENTAGE
    ===================================================== */

    const totalBloodTests =
        Number(
            data.totalBloodTests || 0
        );

    const safeBloodTests =
        Number(
            data.safeBloodTests || 0
        );

    const safeTestPercentage =
        totalBloodTests > 0
            ? Math.round(
                  (safeBloodTests /
                      totalBloodTests) *
                      100
              )
            : 0;

    /* =====================================================
       FIRST NAME
    ===================================================== */

    const firstName =
        user?.fullName
            ?.split(" ")[0] ||
        "User";

    const initial =
        firstName
            .charAt(0)
            .toUpperCase();

    /* =====================================================
       RETURN
    ===================================================== */

    return (
        <>
            <style>
                {styles}
            </style>

            <div
                className="bbms-dashboard"
                style={{
                    display: "flex",
                }}
            >

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <Sidebar />

                {/* =================================================
                    MAIN
                ================================================= */}

                <main className="bbms-dashboard-main">

                    <div className="bbms-dashboard-content">

                        {/* =========================================
                            HEADER
                        ========================================= */}

                        <div className="bbms-dashboard-header bbms-fade">

                            <div className="bbms-header-left">

                                <h1 className="bbms-welcome">
                                    Welcome back,{" "}
                                    {firstName} 👋
                                </h1>

                                <p className="bbms-subtitle">
                                    Here's an overview of
                                    your Blood Bank
                                    Management System.
                                </p>

                            </div>

                            <div className="bbms-user-card">

                                <div className="bbms-user-avatar">
                                    {initial}
                                </div>

                                <div className="bbms-user-details">

                                    <div className="bbms-user-name">
                                        {user?.fullName ||
                                            "System User"}
                                    </div>

                                    <span className="bbms-user-role">
                                        {role.replaceAll(
                                            "_",
                                            " "
                                        )}
                                    </span>

                                </div>

                            </div>

                        </div>

                        {/* =========================================
                            ERROR
                        ========================================= */}

                        {error && (

                            <div className="bbms-error">

                                <span>
                                    ⚠️
                                </span>

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}

                        {/* =========================================
                            FIRST ROW
                        ========================================= */}

                        <div className="bbms-stats-grid">

                            <StatCard
                                className="indigo"
                                icon="👥"
                                label="Total Donors"
                                value={
                                    data.totalDonors
                                }
                                color={
                                    COLORS.indigo
                                }
                                background={
                                    COLORS.indigoLight
                                }
                            />

                            <StatCard
                                className="red"
                                icon="🩸"
                                label="Total Donations"
                                value={
                                    data.totalDonations
                                }
                                color={
                                    COLORS.red
                                }
                                background={
                                    COLORS.redLight
                                }
                            />

                            <StatCard
                                className="purple"
                                icon="🧪"
                                label="Blood Tests"
                                value={
                                    data.totalBloodTests
                                }
                                color={
                                    COLORS.purple
                                }
                                background={
                                    COLORS.purpleLight
                                }
                            />

                            <StatCard
                                className="blue"
                                icon="📦"
                                label="Blood Components"
                                value={
                                    data.totalComponents
                                }
                                color={
                                    COLORS.blue
                                }
                                background={
                                    COLORS.blueLight
                                }
                            />

                        </div>

                        {/* =========================================
                            SECOND ROW
                        ========================================= */}

                        <div className="bbms-stats-grid">

                            <StatCard
                                className="orange"
                                icon="🏥"
                                label="Blood Requests"
                                value={
                                    data.totalRequests
                                }
                                color={
                                    COLORS.orange
                                }
                                background={
                                    COLORS.orangeLight
                                }
                            />

                            <StatCard
                                className="yellow"
                                icon="⏳"
                                label="Pending Requests"
                                value={
                                    data.pendingRequests
                                }
                                color={
                                    COLORS.yellow
                                }
                                background={
                                    COLORS.yellowLight
                                }
                            />

                            <StatCard
                                className="red"
                                icon="🚨"
                                label="Active Alerts"
                                value={
                                    data.activeAlerts
                                }
                                color={
                                    COLORS.red
                                }
                                background={
                                    COLORS.redLight
                                }
                            />

                            <StatCard
                                className="green"
                                icon="🩺"
                                label="Available Blood"
                                value={
                                    data.totalInventoryQuantity
                                }
                                color={
                                    COLORS.green
                                }
                                background={
                                    COLORS.greenLight
                                }
                            />

                        </div>

                        {/* =========================================
                            INVENTORY + TEST STATUS
                        ========================================= */}

                        <div className="bbms-dashboard-grid">

                            {/* =====================================
                                INVENTORY
                            ===================================== */}

                            <div className="bbms-panel bbms-fade">

                                <div className="bbms-panel-header">

                                    <div>

                                        <h2 className="bbms-panel-title">
                                            🩸 Blood Inventory
                                        </h2>

                                        <p className="bbms-panel-description">
                                            Current available
                                            quantity by blood
                                            group
                                        </p>

                                    </div>

                                    <span className="bbms-panel-badge">
                                        LIVE STOCK
                                    </span>

                                </div>

                                <div className="bbms-chart">

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={
                                                bloodGroupData
                                            }
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: -20,
                                                bottom: 5,
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#e2e8f0"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fontSize: 12,
                                                    fill: "#64748b",
                                                    fontWeight: 600,
                                                }}
                                            />

                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fontSize: 11,
                                                    fill: "#94a3b8",
                                                }}
                                            />

                                            <Tooltip
                                                content={
                                                    <InventoryTooltip />
                                                }
                                            />

                                            <Bar
                                                dataKey="units"
                                                radius={[
                                                    8,
                                                    8,
                                                    0,
                                                    0,
                                                ]}
                                            >

                                                {bloodGroupData.map(
                                                    (
                                                        entry,
                                                        index
                                                    ) => (

                                                        <Cell
                                                            key={
                                                                entry.name
                                                            }
                                                            fill={
                                                                bloodColors[
                                                                    index
                                                                ]
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Bar>

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>

                                {/* BLOOD LEGEND */}

                                <div className="bbms-blood-legend">

                                    {bloodGroupData.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                className="bbms-blood-item"
                                                key={
                                                    item.name
                                                }
                                            >

                                                <div
                                                    className="bbms-blood-group"
                                                    style={{
                                                        color:
                                                            bloodColors[
                                                                index
                                                            ],
                                                    }}
                                                >
                                                    {item.name}
                                                </div>

                                                <div className="bbms-blood-units">
                                                    {item.units}{" "}
                                                    units
                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                            {/* =====================================
                                BLOOD TEST STATUS
                            ===================================== */}

                            <div className="bbms-panel pink-accent bbms-fade">

                                <div className="bbms-panel-header">

                                    <div>

                                        <h2 className="bbms-panel-title">
                                            🧪 Blood Test Status
                                        </h2>

                                        <p className="bbms-panel-description">
                                            Safety testing
                                            overview
                                        </p>

                                    </div>

                                    <span
                                        className="bbms-panel-badge"
                                        style={{
                                            background:
                                                "#fff1f2",
                                            color:
                                                "#e11d48",
                                        }}
                                    >
                                        SAFETY
                                    </span>

                                </div>

                                <div
                                    style={{
                                        width: "100%",
                                        height: 230,
                                    }}
                                >

                                    <ResponsiveContainer>

                                        <PieChart>

                                            <Pie
                                                data={
                                                    bloodTestData
                                                }
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={
                                                    60
                                                }
                                                outerRadius={
                                                    90
                                                }
                                                paddingAngle={
                                                    5
                                                }
                                                stroke="none"
                                            >

                                                {bloodTestData.map(
                                                    (
                                                        entry,
                                                        index
                                                    ) => (

                                                        <Cell
                                                            key={
                                                                entry.name
                                                            }
                                                            fill={
                                                                testColors[
                                                                    index
                                                                ]
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Pie>

                                            <Tooltip />

                                        </PieChart>

                                    </ResponsiveContainer>

                                </div>

                                <div className="bbms-test-summary">

                                    <div
                                        className="bbms-test-item"
                                        style={{
                                            background:
                                                "#f0fdf4",
                                        }}
                                    >

                                        <div
                                            className="bbms-test-number"
                                            style={{
                                                color:
                                                    COLORS.green,
                                            }}
                                        >
                                            {
                                                data.safeBloodTests ||
                                                0
                                            }
                                        </div>

                                        <div className="bbms-test-name">
                                            🟢 Safe
                                        </div>

                                    </div>

                                    <div
                                        className="bbms-test-item"
                                        style={{
                                            background:
                                                "#fef2f2",
                                        }}
                                    >

                                        <div
                                            className="bbms-test-number"
                                            style={{
                                                color:
                                                    COLORS.red,
                                            }}
                                        >
                                            {
                                                data.unsafeBloodTests ||
                                                0
                                            }
                                        </div>

                                        <div className="bbms-test-name">
                                            🔴 Unsafe
                                        </div>

                                    </div>

                                    <div
                                        className="bbms-test-item"
                                        style={{
                                            background:
                                                "#fff7ed",
                                        }}
                                    >

                                        <div
                                            className="bbms-test-number"
                                            style={{
                                                color:
                                                    COLORS.orange,
                                            }}
                                        >
                                            {
                                                data.pendingBloodTests ||
                                                0
                                            }
                                        </div>

                                        <div className="bbms-test-name">
                                            🟠 Pending
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* =========================================
                            SYSTEM OVERVIEW + QUICK ACTIONS
                        ========================================= */}

                        <div className="bbms-dashboard-grid">

                            {/* =====================================
                                SYSTEM OVERVIEW
                            ===================================== */}

                            <div className="bbms-panel green-accent">

                                <div className="bbms-panel-header">

                                    <div>

                                        <h2 className="bbms-panel-title">
                                            📊 System Overview
                                        </h2>

                                        <p className="bbms-panel-description">
                                            Current operational
                                            progress
                                        </p>

                                    </div>

                                </div>

                                <div className="bbms-progress-list">

                                    {/* DONATIONS */}

                                    <div className="bbms-progress-row">

                                        <span className="bbms-progress-label">
                                            Donations
                                        </span>

                                        <div className="bbms-progress-track">

                                            <div
                                                className="bbms-progress-bar"
                                                style={{
                                                    width: `${donationPercentage}%`,
                                                    background:
                                                        "linear-gradient(90deg, #16a34a, #4ade80)",
                                                }}
                                            />

                                        </div>

                                        <span className="bbms-progress-value">
                                            {
                                                donationPercentage
                                            }
                                            %
                                        </span>

                                    </div>

                                    {/* REQUESTS */}

                                    <div className="bbms-progress-row">

                                        <span className="bbms-progress-label">
                                            Requests
                                        </span>

                                        <div className="bbms-progress-track">

                                            <div
                                                className="bbms-progress-bar"
                                                style={{
                                                    width: `${requestPercentage}%`,
                                                    background:
                                                        "linear-gradient(90deg, #4f46e5, #818cf8)",
                                                }}
                                            />

                                        </div>

                                        <span className="bbms-progress-value">
                                            {
                                                requestPercentage
                                            }
                                            %
                                        </span>

                                    </div>

                                    {/* SAFE TESTS */}

                                    <div className="bbms-progress-row">

                                        <span className="bbms-progress-label">
                                            Safe Tests
                                        </span>

                                        <div className="bbms-progress-track">

                                            <div
                                                className="bbms-progress-bar"
                                                style={{
                                                    width: `${safeTestPercentage}%`,
                                                    background:
                                                        "linear-gradient(90deg, #0891b2, #22d3ee)",
                                                }}
                                            />

                                        </div>

                                        <span className="bbms-progress-value">
                                            {
                                                safeTestPercentage
                                            }
                                            %
                                        </span>

                                    </div>

                                    {/* DONOR ACTIVITY */}

                                    <div className="bbms-progress-row">

                                        <span className="bbms-progress-label">
                                            Donor Activity
                                        </span>

                                        <div className="bbms-progress-track">

                                            <div
                                                className="bbms-progress-bar"
                                                style={{
                                                    width:
                                                        Number(
                                                            data.totalDonors ||
                                                                0
                                                        ) > 0
                                                            ? `${Math.min(
                                                                  100,
                                                                  Math.round(
                                                                      (Number(
                                                                          data.activeDonors ||
                                                                              0
                                                                      ) /
                                                                          Number(
                                                                              data.totalDonors
                                                                          )) *
                                                                          100
                                                                  )
                                                              )}%`
                                                            : "0%",
                                                    background:
                                                        "linear-gradient(90deg, #9333ea, #c084fc)",
                                                }}
                                            />

                                        </div>

                                        <span className="bbms-progress-value">

                                            {Number(
                                                data.totalDonors ||
                                                    0
                                            ) > 0
                                                ? `${Math.round(
                                                      (Number(
                                                          data.activeDonors ||
                                                              0
                                                      ) /
                                                          Number(
                                                              data.totalDonors
                                                          )) *
                                                          100
                                                  )}%`
                                                : "0%"}

                                        </span>

                                    </div>

                                </div>

                            </div>

                            {/* =====================================
                                QUICK ACTIONS
                            ===================================== */}

                            <div className="bbms-panel orange-accent">

                                <div className="bbms-panel-header">

                                    <div>

                                        <h2 className="bbms-panel-title">
                                            ⚡ Quick Actions
                                        </h2>

                                        <p className="bbms-panel-description">
                                            Frequently used
                                            modules
                                        </p>

                                    </div>

                                </div>

                                <div className="bbms-quick-actions">

                                    <button
                                        className="bbms-quick-action"
                                        onClick={() =>
                                            navigate(
                                                "/donors"
                                            )
                                        }
                                    >

                                        <div
                                            className="bbms-quick-icon"
                                            style={{
                                                background:
                                                    "#eef2ff",
                                                color:
                                                    "#4f46e5",
                                            }}
                                        >
                                            👤
                                        </div>

                                        <div className="bbms-quick-title">
                                            Donors
                                        </div>

                                        <div className="bbms-quick-description">
                                            Manage donors
                                        </div>

                                    </button>

                                    <button
                                        className="bbms-quick-action"
                                        onClick={() =>
                                            navigate(
                                                "/inventory"
                                            )
                                        }
                                    >

                                        <div
                                            className="bbms-quick-icon"
                                            style={{
                                                background:
                                                    "#fff1f2",
                                                color:
                                                    "#e11d48",
                                            }}
                                        >
                                            🩸
                                        </div>

                                        <div className="bbms-quick-title">
                                            Inventory
                                        </div>

                                        <div className="bbms-quick-description">
                                            View blood stock
                                        </div>

                                    </button>

                                    <button
                                        className="bbms-quick-action"
                                        onClick={() =>
                                            navigate(
                                                "/blood-requests"
                                            )
                                        }
                                    >

                                        <div
                                            className="bbms-quick-icon"
                                            style={{
                                                background:
                                                    "#fff7ed",
                                                color:
                                                    "#f97316",
                                            }}
                                        >
                                            🏥
                                        </div>

                                        <div className="bbms-quick-title">
                                            Requests
                                        </div>

                                        <div className="bbms-quick-description">
                                            Manage requests
                                        </div>

                                    </button>

                                    <button
                                        className="bbms-quick-action"
                                        onClick={() =>
                                            navigate(
                                                "/reports"
                                            )
                                        }
                                    >

                                        <div
                                            className="bbms-quick-icon"
                                            style={{
                                                background:
                                                    "#faf5ff",
                                                color:
                                                    "#9333ea",
                                            }}
                                        >
                                            📊
                                        </div>

                                        <div className="bbms-quick-title">
                                            Reports
                                        </div>

                                        <div className="bbms-quick-description">
                                            View reports
                                        </div>

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>

            </div>
        </>
    );
}

export default Dashboard;