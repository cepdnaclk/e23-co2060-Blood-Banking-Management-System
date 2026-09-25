import React, { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";

import { apiFetch } from "./api";



function ReportPage() {

    const navigate = useNavigate();



    const [report, setReport] = useState(null);

    const [inventory, setInventory] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");



    const loadReport = useCallback(async () => {

        try {

            setLoading(true);

            setError("");



            const [reportData, inventoryData] = await Promise.all([

                apiFetch("/api/reports"),

                apiFetch("/api/inventory")

            ]);



            setReport(reportData);



            setInventory(

                Array.isArray(inventoryData)

                    ? inventoryData

                    : []

            );

        } catch (err) {

            console.error("Report loading error:", err);



            if (

                err?.message?.includes("401") ||

                err?.message?.includes("403")

            ) {

                localStorage.clear();

                navigate("/login");

                return;

            }



            setError(

                "Unable to load report information. Please check the backend connection."

            );

        } finally {

            setLoading(false);

        }

    }, [navigate]);



    useEffect(() => {

        loadReport();

    }, [loadReport]);



    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <>

                <style>{reportStyles}</style>



                <div className="report-loading">

                    <div className="spinner"></div>

                    <span>Loading reports...</span>

                </div>

            </>

        );

    }



    /* =====================================================
       DATA
    ===================================================== */

    const data = report || {};



    /* =====================================================
       DONORS
    ===================================================== */

    const totalDonors = Number(

        data.totalDonors || 0

    );



    const activeDonors = Number(

        data.activeDonors || 0

    );



    const donorRate =

        totalDonors > 0

            ? Math.round(

                  (activeDonors / totalDonors) * 100

              )

            : 0;



    /* =====================================================
       DONATIONS
    ===================================================== */

    const totalDonations = Number(

        data.totalDonations || 0

    );



    const completedDonations = Number(

        data.completedDonations || 0

    );



    const remainingDonations = Math.max(

        totalDonations - completedDonations,

        0

    );



    const donationRate =

        totalDonations > 0

            ? Math.round(

                  (completedDonations /

                      totalDonations) *

                      100

              )

            : 0;



    /* =====================================================
       BLOOD TESTS
    ===================================================== */

    const totalBloodTests = Number(

        data.totalBloodTests || 0

    );



    const safeTests = Number(

        data.safeBloodTests || 0

    );



    const unsafeTests = Number(

        data.unsafeBloodTests || 0

    );



    const pendingTests = Number(

        data.pendingBloodTests || 0

    );



    const safeRate =

        totalBloodTests > 0

            ? Math.round(

                  (safeTests / totalBloodTests) * 100

              )

            : 0;



    /* =====================================================
       REQUESTS
    ===================================================== */

    const totalRequests = Number(

        data.totalRequests || 0

    );



    const pendingRequests = Number(

        data.pendingRequests || 0

    );



    const approvedRequests = Number(

        data.approvedRequests || 0

    );



    const rejectedRequests = Number(

        data.rejectedRequests || 0

    );



    /* =====================================================
       INVENTORY
    ===================================================== */

    const bloodGroups = [

        "A+",

        "A-",

        "B+",

        "B-",

        "O+",

        "O-",

        "AB+",

        "AB-"

    ];



    const inventoryByGroup = bloodGroups.map(

        (group) => {

            const quantity = inventory

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

                group,

                quantity

            };

        }

    );



    const maxStock = Math.max(

        ...inventoryByGroup.map(

            (item) => item.quantity

        ),

        1

    );



    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <>

            <style>{reportStyles}</style>



            <div className="report-page">



                <Sidebar />



                <main className="report-main">



                    <div className="report-content">



                        {/* =================================================
                           HEADER
                        ================================================= */}



                        <div className="report-header">



                            <div>

                                <h1 className="report-title">

                                    📊 Reports & Analytics

                                </h1>



                                <p className="report-subtitle">

                                    Detailed analysis of blood bank

                                    operations and performance.

                                </p>

                            </div>



                            <div className="report-actions">



                                <button

                                    className="btn refresh-btn"

                                    onClick={loadReport}

                                >

                                    ↻ Refresh

                                </button>



                                <button

                                    className="btn print-btn"

                                    onClick={() =>

                                        window.print()

                                    }

                                >

                                    🖨 Print Report

                                </button>



                            </div>



                        </div>



                        {/* =================================================
                           ERROR
                        ================================================= */}



                        {error && (

                            <div className="error-box">

                                ⚠️ {error}

                            </div>

                        )}



                        {/* =================================================
                           REPORT INFORMATION
                        ================================================= */}



                        <div className="info-bar">



                            <div>

                                <span className="info-label">

                                    REPORT PERIOD

                                </span>



                                <span className="info-value">

                                    All Time

                                </span>

                            </div>



                            <div className="data-source">

                                Data source:{" "}

                                <strong>BBMS</strong>

                            </div>



                        </div>



                        {/* =================================================
                           DONOR ANALYSIS
                        ================================================= */}



                        <section className="section">



                            <div className="section-heading">



                                <div>

                                    <h2>

                                        👥 Donor Analysis

                                    </h2>



                                    <p>

                                        Current donor activity

                                        and participation.

                                    </p>

                                </div>



                            </div>



                            <div className="donor-grid">



                                {/* TOTAL DONORS */}



                                <div className="donor-card blue">



                                    <div className="card-top">

                                        👥

                                    </div>



                                    <div className="card-label">

                                        Total Donors

                                    </div>



                                    <div className="card-value">

                                        {totalDonors}

                                    </div>



                                    <div className="card-description">

                                        Registered donors

                                    </div>



                                </div>



                                {/* ACTIVE DONORS */}



                                <div className="donor-card green">



                                    <div className="card-top">

                                        ✓

                                    </div>



                                    <div className="card-label">

                                        Active Donors

                                    </div>



                                    <div className="card-value">

                                        {activeDonors}

                                    </div>



                                    <div className="card-description">

                                        Currently active

                                    </div>



                                </div>



                                {/* ACTIVITY RATE */}



                                <div className="donor-card purple">



                                    <div className="card-top">

                                        ↗

                                    </div>



                                    <div className="card-label">

                                        Activity Rate

                                    </div>



                                    <div className="card-value">

                                        {donorRate}%

                                    </div>



                                    <div className="progress">

                                        <div

                                            className="progress-fill purple-fill"

                                            style={{

                                                width:

                                                    `${Math.min(

                                                        donorRate,

                                                        100

                                                    )}%`

                                            }}

                                        />

                                    </div>



                                </div>



                            </div>



                        </section>



                        {/* =================================================
                           DONATION + BLOOD TEST
                        ================================================= */}



                        <div className="two-column">



                            {/* DONATION */}



                            <section className="panel">



                                <div className="panel-heading">



                                    <div>

                                        <h2>

                                            🩸 Donation Performance

                                        </h2>



                                        <p>

                                            Donation completion

                                            and processing status.

                                        </p>

                                    </div>



                                    <span className="badge blue-badge">

                                        DONATIONS

                                    </span>



                                </div>



                                <div className="donation-layout">



                                    <div className="completion-section">



                                        <span className="small-label">

                                            COMPLETION RATE

                                        </span>



                                        <div className="completion-number">

                                            {donationRate}%

                                        </div>



                                        <div className="progress">

                                            <div

                                                className="progress-fill red-fill"

                                                style={{

                                                    width:

                                                        `${donationRate}%`

                                                }}

                                            />

                                        </div>



                                    </div>



                                    <div className="mini-grid">



                                        <MiniStat

                                            value={

                                                totalDonations

                                            }

                                            label="Total"

                                            color="#e11d48"

                                        />



                                        <MiniStat

                                            value={

                                                completedDonations

                                            }

                                            label="Completed"

                                            color="#16a34a"

                                        />



                                        <MiniStat

                                            value={

                                                remainingDonations

                                            }

                                            label="Remaining"

                                            color="#f97316"

                                        />



                                    </div>



                                </div>



                            </section>



                            {/* BLOOD TEST */}



                            <section className="panel">



                                <div className="panel-heading">



                                    <div>

                                        <h2>

                                            🧪 Blood Test Safety

                                        </h2>



                                        <p>

                                            Safety testing

                                            distribution.

                                        </p>

                                    </div>



                                    <span className="badge red-badge">

                                        SAFETY

                                    </span>



                                </div>



                                <div className="test-list">



                                    <TestRow

                                        label="Safe"

                                        value={

                                            safeTests

                                        }

                                        rowClass="safe-row"

                                        dotClass="safe-dot"

                                        color="#16a34a"

                                    />



                                    <TestRow

                                        label="Unsafe"

                                        value={

                                            unsafeTests

                                        }

                                        rowClass="unsafe-row"

                                        dotClass="unsafe-dot"

                                        color="#e11d48"

                                    />



                                    <TestRow

                                        label="Pending"

                                        value={

                                            pendingTests

                                        }

                                        rowClass="pending-row"

                                        dotClass="pending-dot"

                                        color="#f97316"

                                    />



                                </div>



                                <div className="safety-rate">

                                    Safety rate:

                                    <strong>

                                        {" "}

                                        {safeRate}%

                                    </strong>

                                </div>



                            </section>



                        </div>



                        {/* =================================================
                           REQUESTS + INVENTORY
                        ================================================= */}



                        <div className="two-column">



                            {/* REQUEST ANALYSIS */}



                            <section className="panel">



                                <div className="panel-heading">



                                    <div>

                                        <h2>

                                            🏥 Request Analysis

                                        </h2>



                                        <p>

                                            Hospital blood request

                                            status.

                                        </p>

                                    </div>



                                    <span className="badge orange-badge">

                                        REQUESTS

                                    </span>



                                </div>



                                <div className="request-list">



                                    <RequestRow

                                        label="Pending"

                                        value={

                                            pendingRequests

                                        }

                                        total={

                                            totalRequests

                                        }

                                        color="#f97316"

                                    />



                                    <RequestRow

                                        label="Approved"

                                        value={

                                            approvedRequests

                                        }

                                        total={

                                            totalRequests

                                        }

                                        color="#16a34a"

                                    />



                                    <RequestRow

                                        label="Rejected"

                                        value={

                                            rejectedRequests

                                        }

                                        total={

                                            totalRequests

                                        }

                                        color="#e11d48"

                                    />



                                </div>



                                <div className="request-total">

                                    Total requests:

                                    <strong>

                                        {" "}

                                        {totalRequests}

                                    </strong>

                                </div>



                            </section>



                            {/* INVENTORY */}



                            <section className="panel">



                                <div className="panel-heading">



                                    <div>

                                        <h2>

                                            🩸 Blood Inventory

                                        </h2>



                                        <p>

                                            Available stock by

                                            blood group.

                                        </p>

                                    </div>



                                    <span className="badge green-badge">

                                        STOCK

                                    </span>



                                </div>



                                <table className="inventory-table">



                                    <thead>

                                        <tr>

                                            <th>

                                                Group

                                            </th>



                                            <th>

                                                Quantity

                                            </th>



                                            <th>

                                                Level

                                            </th>

                                        </tr>

                                    </thead>



                                    <tbody>



                                        {inventoryByGroup.map(

                                            (item) => {



                                                const percentage =

                                                    Math.round(

                                                        (

                                                            item.quantity /

                                                            maxStock

                                                        ) *

                                                        100

                                                    );



                                                return (

                                                    <tr

                                                        key={

                                                            item.group

                                                        }

                                                    >



                                                        <td>

                                                            <span className="blood-badge">

                                                                {

                                                                    item.group

                                                                }

                                                            </span>

                                                        </td>



                                                        <td>

                                                            <strong>

                                                                {

                                                                    item.quantity

                                                                }

                                                            </strong>

                                                            {" "}

                                                            units

                                                        </td>



                                                        <td>



                                                            <div className="stock-container">



                                                                <div className="stock-track">



                                                                    <div

                                                                        className="stock-fill"

                                                                        style={{

                                                                            width:

                                                                                `${percentage}%`

                                                                        }}

                                                                    />



                                                                </div>



                                                                <span className="percentage">

                                                                    {

                                                                        percentage

                                                                    }%

                                                                </span>



                                                            </div>



                                                        </td>



                                                    </tr>

                                                );

                                            }

                                        )}



                                    </tbody>



                                </table>



                            </section>



                        </div>



                        {/* =================================================
                           SYSTEM HEALTH
                        ================================================= */}



                        <section className="section">



                            <div className="section-heading">



                                <div>

                                    <h2>

                                        ⚡ System Health

                                    </h2>



                                    <p>

                                        Current operational

                                        indicators.

                                    </p>

                                </div>



                            </div>



                            <div className="health-grid">



                                <HealthCard

                                    icon="👥"

                                    label="Active Donors"

                                    value={

                                        activeDonors

                                    }

                                    color="#16a34a"

                                />



                                <HealthCard

                                    icon="🩸"

                                    label="Blood Stock"

                                    value={

                                        data.totalInventoryQuantity ||

                                        0

                                    }

                                    color="#e11d48"

                                />



                                <HealthCard

                                    icon="📦"

                                    label="Components"

                                    value={

                                        data.totalComponents ||

                                        0

                                    }

                                    color="#0284c7"

                                />



                                <HealthCard

                                    icon="🧪"

                                    label="Safe Tests"

                                    value={

                                        safeTests

                                    }

                                    color="#16a34a"

                                />



                                <HealthCard

                                    icon="🚨"

                                    label="Active Alerts"

                                    value={

                                        data.activeAlerts ||

                                        0

                                    }

                                    color="#f97316"

                                />



                                <HealthCard

                                    icon="🏥"

                                    label="Pending Requests"

                                    value={

                                        pendingRequests

                                    }

                                    color="#ca8a04"

                                />



                            </div>



                        </section>



                    </div>



                </main>



            </div>

        </>

    );

}





/* =========================================================
   MINI STAT
========================================================= */



function MiniStat({

    value,

    label,

    color

}) {

    return (

        <div className="mini-stat">



            <div

                className="mini-number"

                style={{ color }}

            >

                {value}

            </div>



            <div className="mini-label">

                {label}

            </div>



        </div>

    );

}





/* =========================================================
   TEST ROW
========================================================= */



function TestRow({

    label,

    value,

    rowClass,

    dotClass,

    color

}) {

    return (

        <div className={`test-row ${rowClass}`}>



            <div className="test-left">



                <span

                    className={`dot ${dotClass}`}

                />



                <span className="test-name">

                    {label}

                </span>



            </div>



            <strong

                style={{ color }}

            >

                {value}

            </strong>



        </div>

    );

}





/* =========================================================
   REQUEST ROW
========================================================= */



function RequestRow({

    label,

    value,

    total,

    color

}) {



    const percentage =

        total > 0

            ? Math.round(

                  (value / total) * 100

              )

            : 0;



    return (

        <div className="request-row">



            <span className="request-label">

                {label}

            </span>



            <div className="request-track">



                <div

                    className="request-fill"

                    style={{

                        width:

                            `${percentage}%`,

                        background:

                            color

                    }}

                />



            </div>



            <span

                className="request-number"

                style={{

                    color

                }}

            >

                {value}

            </span>



        </div>

    );

}





/* =========================================================
   HEALTH CARD
========================================================= */



function HealthCard({

    icon,

    label,

    value,

    color

}) {

    return (

        <div className="health-card">



            <div className="health-icon">

                {icon}

            </div>



            <div className="health-label">

                {label}

            </div>



            <div

                className="health-value"

                style={{ color }}

            >

                {value ?? 0}

            </div>



        </div>

    );

}





/* =========================================================
   CSS
========================================================= */



const reportStyles = `



* {

    box-sizing: border-box;

}



.report-page {

    min-height: 100vh;



    display: flex;



    background:

        linear-gradient(

            135deg,

            #f8fafc,

            #eef2ff,

            #f8fafc

        );



    color: #172033;



    font-family:

        "Segoe UI",

        Arial,

        sans-serif;

}



.report-main {

    flex: 1;



    min-width: 0;



    overflow-y: auto;

}



.report-content {

    max-width: 1450px;



    margin: auto;



    padding: 30px 38px 45px;

}





/* ==============================

   HEADER

============================== */



.report-header {

    display: flex;



    align-items: center;



    justify-content: space-between;



    gap: 20px;



    margin-bottom: 24px;

}



.report-title {

    margin: 0;



    font-size: 32px;



    font-weight: 800;



    letter-spacing: -1px;



    color: #18223a;

}



.report-subtitle {

    margin: 6px 0 0;



    color: #64748b;



    font-size: 13px;

}



.report-actions {

    display: flex;



    gap: 9px;

}



.btn {

    border: none;



    border-radius: 9px;



    padding: 10px 15px;



    font-size: 12px;



    font-weight: 700;



    cursor: pointer;



    transition: .2s;

}



.btn:hover {

    transform: translateY(-1px);

}



.refresh-btn {

    background: #eef2ff;



    color: #4f46e5;

}



.print-btn {

    background: #4f46e5;



    color: white;



    box-shadow:

        0 5px 14px

        rgba(79,70,229,.2);

}





/* ==============================

   INFO BAR

============================== */



.info-bar {

    display: flex;



    align-items: center;



    justify-content: space-between;



    background: white;



    border: 1px solid #e2e8f0;



    border-radius: 13px;



    padding: 15px 18px;



    margin-bottom: 26px;



    box-shadow:

        0 4px 15px

        rgba(15,23,42,.04);

}



.info-bar > div:first-child {

    display: flex;



    align-items: center;



    gap: 12px;

}



.info-label {

    color: #64748b;



    font-size: 10px;



    font-weight: 800;



    letter-spacing: .06em;

}



.info-value {

    padding: 7px 11px;



    border-radius: 7px;



    background: #f8fafc;



    color: #334155;



    font-size: 11px;



    font-weight: 700;

}



.data-source {

    color: #94a3b8;



    font-size: 10px;

}



.data-source strong {

    color: #4f46e5;

}





/* ==============================

   SECTION

============================== */



.section {

    margin-bottom: 22px;

}



.section-heading {

    margin-bottom: 11px;

}



.section-heading h2 {

    margin: 0;



    color: #172033;



    font-size: 18px;



    font-weight: 800;

}



.section-heading p {

    margin: 4px 0 0;



    color: #94a3b8;



    font-size: 11px;

}





/* ==============================

   DONOR CARDS

============================== */



.donor-grid {

    display: grid;



    grid-template-columns:

        repeat(3, 1fr);



    gap: 13px;

}



.donor-card {

    position: relative;



    min-height: 130px;



    padding: 17px 19px;



    background: white;



    border:

        1px solid #e2e8f0;



    border-radius: 14px;



    box-shadow:

        0 4px 15px

        rgba(15,23,42,.04);



    overflow: hidden;

}



.donor-card::before {

    content: "";



    position: absolute;



    top: 0;

    left: 0;

    right: 0;



    height: 3px;

}



.donor-card.blue::before {

    background: #4f46e5;

}



.donor-card.green::before {

    background: #16a34a;

}



.donor-card.purple::before {

    background: #9333ea;

}



.card-top {

    display: flex;



    align-items: center;

    justify-content: center;



    width: 34px;

    height: 34px;



    border-radius: 9px;



    background: #eef2ff;



    color: #4f46e5;



    font-size: 17px;



    margin-bottom: 11px;

}



.green .card-top {

    background: #f0fdf4;

    color: #16a34a;

}



.purple .card-top {

    background: #faf5ff;

    color: #9333ea;

}



.card-label {

    color: #64748b;



    font-size: 9px;



    font-weight: 800;



    text-transform: uppercase;

}



.card-value {

    margin-top: 4px;



    font-size: 29px;



    line-height: 1;



    font-weight: 800;

}



.blue .card-value {

    color: #4f46e5;

}



.green .card-value {

    color: #16a34a;

}



.purple .card-value {

    color: #9333ea;

}



.card-description {

    margin-top: 6px;



    color: #94a3b8;



    font-size: 10px;

}



.progress {

    height: 7px;



    margin-top: 11px;



    background: #f1f5f9;



    border-radius: 20px;



    overflow: hidden;

}



.progress-fill {

    height: 100%;



    border-radius: 20px;

}



.purple-fill {

    background:

        linear-gradient(

            90deg,

            #9333ea,

            #c084fc

        );

}



.red-fill {

    background:

        linear-gradient(

            90deg,

            #e11d48,

            #fb7185

        );

}





/* ==============================

   TWO COLUMN

============================== */



.two-column {

    display: grid;



    grid-template-columns:

        1fr 1fr;



    gap: 17px;



    margin-bottom: 17px;

}



.panel {

    background: white;



    border:

        1px solid #e2e8f0;



    border-radius: 14px;



    padding: 20px;



    box-shadow:

        0 4px 15px

        rgba(15,23,42,.04);

}



.panel-heading {

    display: flex;



    align-items: flex-start;



    justify-content: space-between;



    gap: 15px;



    margin-bottom: 18px;

}



.panel-heading h2 {

    margin: 0;



    color: #172033;



    font-size: 17px;



    font-weight: 800;

}



.panel-heading p {

    margin: 4px 0 0;



    color: #94a3b8;



    font-size: 10px;

}



.badge {

    padding: 5px 8px;



    border-radius: 6px;



    font-size: 8px;



    font-weight: 800;

}



.blue-badge {

    background: #eef2ff;



    color: #4f46e5;

}



.red-badge {

    background: #fff1f2;



    color: #e11d48;

}



.orange-badge {

    background: #fff7ed;



    color: #ea580c;

}



.green-badge {

    background: #f0fdf4;



    color: #15803d;

}





/* ==============================

   DONATION

============================== */



.donation-layout {

    display: grid;



    grid-template-columns:

        1fr 1fr;



    gap: 20px;



    align-items: center;

}



.small-label {

    color: #64748b;



    font-size: 9px;



    font-weight: 800;



    text-transform: uppercase;

}



.completion-number {

    margin-top: 5px;



    color: #e11d48;



    font-size: 40px;



    font-weight: 800;

}



.mini-grid {

    display: grid;



    grid-template-columns:

        repeat(3, 1fr);



    gap: 7px;

}



.mini-stat {

    padding: 12px 6px;



    border-radius: 9px;



    background: #f8fafc;



    text-align: center;

}



.mini-number {

    font-size: 19px;



    font-weight: 800;

}



.mini-label {

    margin-top: 3px;



    color: #64748b;



    font-size: 8px;



    font-weight: 800;



    text-transform: uppercase;

}





/* ==============================

   TESTS

============================== */



.test-list {

    display: flex;



    flex-direction: column;



    gap: 8px;

}



.test-row {

    display: flex;



    align-items: center;



    justify-content: space-between;



    padding: 11px 13px;



    border-radius: 8px;



    font-size: 11px;

}



.test-left {

    display: flex;



    align-items: center;



    gap: 9px;

}



.dot {

    width: 8px;

    height: 8px;



    border-radius: 50%;

}



.safe-row {

    background: #f0fdf4;

}



.unsafe-row {

    background: #fff1f2;

}



.pending-row {

    background: #fff7ed;

}



.safe-dot {

    background: #16a34a;

}



.unsafe-dot {

    background: #e11d48;

}



.pending-dot {

    background: #f97316;

}



.test-name {

    color: #475569;



    font-weight: 700;

}



.safety-rate {

    margin-top: 10px;



    color: #64748b;



    font-size: 10px;

}



.safety-rate strong {

    color: #16a34a;

}





/* ==============================

   REQUESTS

============================== */



.request-list {

    display: flex;



    flex-direction: column;



    gap: 15px;

}



.request-row {

    display: grid;



    grid-template-columns:

        70px 1fr 30px;



    align-items: center;



    gap: 9px;

}



.request-label {

    color: #475569;



    font-size: 10px;



    font-weight: 700;

}



.request-track {

    height: 7px;



    background: #f1f5f9;



    border-radius: 20px;



    overflow: hidden;

}



.request-fill {

    height: 100%;



    border-radius: 20px;

}



.request-number {

    text-align: right;



    font-size: 10px;



    font-weight: 800;

}



.request-total {

    margin-top: 17px;



    padding: 10px;



    border-radius: 8px;



    background: #f8fafc;



    color: #64748b;



    font-size: 10px;

}



.request-total strong {

    color: #172033;

}





/* ==============================

   INVENTORY

============================== */



.inventory-table {

    width: 100%;



    border-collapse: collapse;

}



.inventory-table th {

    padding: 7px 5px;



    text-align: left;



    color: #94a3b8;



    font-size: 8px;



    font-weight: 800;



    text-transform: uppercase;



    border-bottom:

        1px solid #e2e8f0;

}



.inventory-table td {

    padding: 7px 5px;



    border-bottom:

        1px solid #f1f5f9;



    color: #475569;



    font-size: 10px;

}



.inventory-table tr:last-child td {

    border-bottom: none;

}



.blood-badge {

    display: inline-flex;



    align-items: center;

    justify-content: center;



    min-width: 31px;



    padding: 4px 5px;



    border-radius: 5px;



    background: #fff1f2;



    color: #e11d48;



    font-size: 8px;



    font-weight: 800;

}



.stock-container {

    display: flex;



    align-items: center;



    gap: 6px;

}



.stock-track {

    flex: 1;



    height: 5px;



    background: #f1f5f9;



    border-radius: 20px;



    overflow: hidden;

}



.stock-fill {

    height: 100%;



    background:

        linear-gradient(

            90deg,

            #e11d48,

            #fb7185

        );



    border-radius: 20px;

}



.percentage {

    width: 25px;



    color: #64748b;



    font-size: 8px;

}





/* ==============================

   HEALTH

============================== */



.health-grid {

    display: grid;



    grid-template-columns:

        repeat(6, 1fr);



    gap: 9px;

}



.health-card {

    background: white;



    border:

        1px solid #e2e8f0;



    border-radius: 10px;



    padding: 13px;



    box-shadow:

        0 3px 12px

        rgba(15,23,42,.03);

}



.health-icon {

    font-size: 17px;

}



.health-label {

    margin-top: 7px;



    color: #64748b;



    font-size: 8px;



    font-weight: 800;



    text-transform: uppercase;

}



.health-value {

    margin-top: 3px;



    font-size: 19px;



    font-weight: 800;

}





/* ==============================

   ERROR

============================== */



.error-box {

    padding: 12px 14px;



    margin-bottom: 18px;



    background: #fef2f2;



    border: 1px solid #fecaca;



    border-radius: 8px;



    color: #991b1b;



    font-size: 11px;

}





/* ==============================

   LOADING

============================== */



.report-loading {

    min-height: 100vh;



    display: flex;



    align-items: center;



    justify-content: center;



    gap: 10px;



    color: #64748b;



    font-size: 14px;

}



.spinner {

    width: 22px;

    height: 22px;



    border:

        3px solid #e2e8f0;



    border-top-color: #4f46e5;



    border-radius: 50%;



    animation:

        spin .7s linear infinite;

}



@keyframes spin {

    to {

        transform: rotate(360deg);

    }

}





/* ==============================

   RESPONSIVE

============================== */



@media(max-width:1100px) {



    .health-grid {

        grid-template-columns:

            repeat(3, 1fr);

    }

}



@media(max-width:850px) {



    .report-content {

        padding: 25px 20px;

    }



    .report-header {

        flex-direction: column;



        align-items: flex-start;

    }



    .donor-grid {

        grid-template-columns: 1fr;

    }



    .two-column {

        grid-template-columns: 1fr;

    }



    .health-grid {

        grid-template-columns:

            repeat(2, 1fr);

    }

}



@media(max-width:500px) {



    .report-title {

        font-size: 26px;

    }



    .report-actions {

        width: 100%;

    }



    .btn {

        flex: 1;

    }



    .donation-layout {

        grid-template-columns: 1fr;

    }



    .health-grid {

        grid-template-columns: 1fr;

    }



    .info-bar {

        align-items: flex-start;



        flex-direction: column;



        gap: 10px;

    }

}





/* ==============================

   PRINT

============================== */



@media print {



    .report-actions,

    .info-bar {

        display: none !important;

    }



    .report-page {

        background: white;

    }



    .report-content {

        padding: 10px;

    }

}



`;



export default ReportPage;