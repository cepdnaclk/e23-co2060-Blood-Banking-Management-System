import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import { apiFetch } from "./api";

function AuditLogPage() {
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    /*
     * Load audit logs
     *
     * useCallback prevents the function from being recreated
     * unnecessarily and allows it to be safely used inside useEffect.
     */
    const loadLogs = useCallback(async () => {
        try {
            setLoading(true);

            const data = await apiFetch("/api/audit-logs");

            setLogs(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (err) {
            console.error("Audit log error:", err);

            if (
                err?.message?.includes("401") ||
                err?.message?.includes("403")
            ) {
                localStorage.clear();
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    /*
     * Load audit logs when the page opens.
     */
    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    /*
     * Return colors based on the audit action.
     */
    const getActionColor = (action) => {
        const value = (action || "").toUpperCase();

        if (
            value.includes("DELETE") ||
            value.includes("REJECT")
        ) {
            return {
                color: "#dc2626",
                bg: "#fef2f2",
            };
        }

        if (
            value.includes("CREATE") ||
            value.includes("ADD")
        ) {
            return {
                color: "#16a34a",
                bg: "#f0fdf4",
            };
        }

        if (
            value.includes("UPDATE") ||
            value.includes("EDIT")
        ) {
            return {
                color: "#4f46e5",
                bg: "#eef2ff",
            };
        }

        if (value.includes("APPROVE")) {
            return {
                color: "#0891b2",
                bg: "#ecfeff",
            };
        }

        return {
            color: "#64748b",
            bg: "#f8fafc",
        };
    };

    /*
     * Format date and time.
     */
    const formatDate = (value) => {
        if (!value) {
            return "-";
        }

        try {
            return new Date(value).toLocaleString();
        } catch {
            return value;
        }
    };

    return (
        <>
            <style>{`
                .audit-page {
                    min-height: 100vh;
                    display: flex;
                    background:
                        radial-gradient(
                            circle at 90% 5%,
                            rgba(99,102,241,.08),
                            transparent 25%
                        ),
                        #f8fafc;
                    font-family:
                        "DM Sans",
                        "Segoe UI",
                        sans-serif;
                }

                .audit-main {
                    flex: 1;
                    min-width: 0;
                    overflow-y: auto;
                }

                .audit-content {
                    max-width: 1600px;
                    margin: auto;
                    padding: 35px 38px;
                }

                .audit-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 28px;
                }

                .audit-title {
                    margin: 0;
                    color: #0f172a;
                    font-size: 33px;
                    font-weight: 800;
                }

                .audit-subtitle {
                    margin-top: 7px;
                    color: #64748b;
                    font-size: 14px;
                }

                .audit-refresh {
                    border: none;
                    padding: 10px 15px;
                    border-radius: 9px;
                    background: #eef2ff;
                    color: #4f46e5;
                    font-weight: 700;
                    cursor: pointer;
                }

                .audit-summary {
                    display: grid;
                    grid-template-columns:
                        repeat(3, 1fr);
                    gap: 17px;
                    margin-bottom: 20px;
                }

                .audit-summary-card {
                    padding: 20px;
                    background: white;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    box-shadow:
                        0 5px 20px
                        rgba(15,23,42,.05);
                }

                .audit-summary-label {
                    color: #64748b;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .audit-summary-value {
                    margin-top: 5px;
                    font-size: 28px;
                    font-weight: 800;
                }

                .audit-table-container {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 19px;
                    box-shadow:
                        0 5px 20px
                        rgba(15,23,42,.05);
                    overflow: hidden;
                }

                .audit-table-header {
                    padding: 22px 25px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .audit-table-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 800;
                    color: #0f172a;
                }

                .audit-count {
                    color: #64748b;
                    font-size: 12px;
                }

                .audit-scroll {
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 900px;
                }

                th {
                    padding: 14px 18px;
                    text-align: left;
                    background: #f8fafc;
                    color: #64748b;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: .06em;
                    border-bottom: 1px solid #e2e8f0;
                }

                td {
                    padding: 16px 18px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #334155;
                    font-size: 12px;
                }

                tbody tr {
                    transition: .15s ease;
                }

                tbody tr:hover {
                    background: #f8fafc;
                }

                .action-badge {
                    display: inline-block;
                    padding: 5px 9px;
                    border-radius: 7px;
                    font-size: 10px;
                    font-weight: 800;
                }

                .entity-badge {
                    padding: 5px 8px;
                    border-radius: 6px;
                    background: #f1f5f9;
                    color: #475569;
                    font-size: 10px;
                    font-weight: 700;
                }

                .description {
                    max-width: 350px;
                    color: #64748b;
                    line-height: 1.5;
                }

                .date {
                    white-space: nowrap;
                    color: #64748b;
                    font-size: 11px;
                }

                .empty-audit {
                    padding: 70px;
                    text-align: center;
                    color: #94a3b8;
                }

                @media (max-width: 800px) {
                    .audit-content {
                        padding: 22px;
                    }

                    .audit-header {
                        align-items: flex-start;
                        flex-direction: column;
                        gap: 15px;
                    }

                    .audit-summary {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="audit-page">

                <Sidebar />

                <main className="audit-main">

                    <div className="audit-content">

                        {/* HEADER */}
                        <div className="audit-header">

                            <div>
                                <h1 className="audit-title">
                                    ◷ Audit Logs
                                </h1>

                                <p className="audit-subtitle">
                                    Track important activities
                                    performed within BBMS.
                                </p>
                            </div>

                            <button
                                className="audit-refresh"
                                onClick={loadLogs}
                            >
                                ↻ Refresh
                            </button>

                        </div>

                        {/* SUMMARY */}
                        <div className="audit-summary">

                            <div className="audit-summary-card">

                                <div className="audit-summary-label">
                                    Total Activities
                                </div>

                                <div
                                    className="audit-summary-value"
                                    style={{
                                        color: "#4f46e5",
                                    }}
                                >
                                    {logs.length}
                                </div>

                            </div>

                            <div className="audit-summary-card">

                                <div className="audit-summary-label">
                                    Create Actions
                                </div>

                                <div
                                    className="audit-summary-value"
                                    style={{
                                        color: "#16a34a",
                                    }}
                                >
                                    {
                                        logs.filter(
                                            (log) =>
                                                (
                                                    log.action || ""
                                                )
                                                    .toUpperCase()
                                                    .includes("CREATE")
                                        ).length
                                    }
                                </div>

                            </div>

                            <div className="audit-summary-card">

                                <div className="audit-summary-label">
                                    Update Actions
                                </div>

                                <div
                                    className="audit-summary-value"
                                    style={{
                                        color: "#9333ea",
                                    }}
                                >
                                    {
                                        logs.filter(
                                            (log) =>
                                                (
                                                    log.action || ""
                                                )
                                                    .toUpperCase()
                                                    .includes("UPDATE")
                                        ).length
                                    }
                                </div>

                            </div>

                        </div>

                        {/* TABLE */}
                        <div className="audit-table-container">

                            <div className="audit-table-header">

                                <h2 className="audit-table-title">
                                    Activity History
                                </h2>

                                <span className="audit-count">
                                    {logs.length} records
                                </span>

                            </div>

                            <div className="audit-scroll">

                                {loading ? (

                                    <div className="empty-audit">
                                        Loading audit logs...
                                    </div>

                                ) : logs.length === 0 ? (

                                    <div className="empty-audit">

                                        <div
                                            style={{
                                                fontSize: 45,
                                                marginBottom: 10,
                                            }}
                                        >
                                            📋
                                        </div>

                                        No audit records
                                        available.

                                    </div>

                                ) : (

                                    <table>

                                        <thead>

                                            <tr>

                                                <th>
                                                    Date & Time
                                                </th>

                                                <th>
                                                    User ID
                                                </th>

                                                <th>
                                                    Action
                                                </th>

                                                <th>
                                                    Entity
                                                </th>

                                                <th>
                                                    Entity ID
                                                </th>

                                                <th>
                                                    Description
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {logs.map((log) => {

                                                const actionStyle =
                                                    getActionColor(
                                                        log.action
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            log.auditLogId
                                                        }
                                                    >

                                                        <td className="date">
                                                            {formatDate(
                                                                log.createdAt
                                                            )}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                #
                                                                {
                                                                    log.userId ??
                                                                    "-"
                                                                }
                                                            </strong>
                                                        </td>

                                                        <td>

                                                            <span
                                                                className="action-badge"
                                                                style={{
                                                                    color:
                                                                        actionStyle.color,
                                                                    background:
                                                                        actionStyle.bg,
                                                                }}
                                                            >
                                                                {
                                                                    log.action
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <span className="entity-badge">
                                                                {
                                                                    log.entityType
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>
                                                            #
                                                            {
                                                                log.entityId ??
                                                                "-"
                                                            }
                                                        </td>

                                                        <td className="description">
                                                            {
                                                                log.description ||
                                                                "-"
                                                            }
                                                        </td>

                                                    </tr>
                                                );
                                            })}

                                        </tbody>

                                    </table>

                                )}

                            </div>

                        </div>

                    </div>

                </main>

            </div>
        </>
    );
}

export default AuditLogPage;