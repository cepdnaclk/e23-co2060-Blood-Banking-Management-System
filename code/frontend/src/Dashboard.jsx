import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

/* ─────────────────────────────────────────────────────────────
   Inject global styles once (avoids a separate CSS file)
───────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sidebar-bg:      #0f1117;
    --sidebar-border:  #1e2130;
    --sidebar-hover:   #1a1e2e;
    --sidebar-active:  #232840;
    --accent:          #4f6ef7;
    --accent-light:    #6b85fa;
    --accent-glow:     rgba(79,110,247,.18);
    --danger:          #e05252;

    --surface:         #ffffff;
    --surface-2:       #f7f8fc;
    --border:          #e8eaf2;

    --text-primary:    #111827;
    --text-secondary:  #6b7280;
    --text-muted:      #9ca3af;

    --card-shadow:     0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.07);
    --card-hover:      0 4px 24px rgba(0,0,0,.10);

    --radius:          14px;
    --radius-sm:       8px;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface-2);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
  }

  /* ── Layout ── */
  .bbms-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .bbms-sidebar {
    width: 240px;
    flex-shrink: 0;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--sidebar-border);
    display: flex;
    flex-direction: column;
    padding: 28px 16px 24px;
    gap: 4px;
    overflow-y: auto;
  }

  .bbms-logo {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: .04em;
    color: #fff;
    padding: 0 8px 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .bbms-logo::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-glow);
  }

  .bbms-divider {
    height: 1px;
    background: var(--sidebar-border);
    margin: 8px 8px 12px;
  }

  .bbms-section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #3d4463;
    padding: 4px 12px 6px;
  }

  .bbms-nav-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: transparent;
    color: #8891b4;
    border: none;
    border-radius: var(--radius-sm);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    cursor: pointer;
    transition: background .15s, color .15s;
  }

  .bbms-nav-btn:hover {
    background: var(--sidebar-hover);
    color: #c8d0ee;
  }

  .bbms-nav-btn.active {
    background: var(--sidebar-active);
    color: #fff;
    font-weight: 500;
  }

  .bbms-nav-btn .nav-icon {
    font-size: 16px;
    flex-shrink: 0;
    opacity: .75;
  }

  .bbms-logout {
    margin-top: auto;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: rgba(224,82,82,.1);
    color: #e8a0a0;
    border: 1px solid rgba(224,82,82,.2);
    border-radius: var(--radius-sm);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: background .15s, color .15s;
    margin-top: 16px;
  }

  .bbms-logout:hover {
    background: rgba(224,82,82,.2);
    color: #f5b8b8;
  }

  /* ── Main content ── */
  .bbms-main {
    flex: 1;
    overflow-y: auto;
    padding: 36px 40px;
  }

  /* ── Top bar ── */
  .bbms-topbar {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 32px;
  }

  .bbms-topbar h1 {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.2;
  }

  .bbms-topbar p {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .bbms-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--accent-glow);
    color: var(--accent);
    border: 1px solid rgba(79,110,247,.25);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .04em;
  }

  .bbms-badge::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
  }

  /* ── Stat cards ── */
  .bbms-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 36px;
  }

  .bbms-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    box-shadow: var(--card-shadow);
    transition: box-shadow .2s, transform .2s;
    position: relative;
    overflow: hidden;
  }

  .bbms-card:hover {
    box-shadow: var(--card-hover);
    transform: translateY(-2px);
  }

  .bbms-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: var(--radius) var(--radius) 0 0;
  }

  .bbms-card.blue::after  { background: #4f6ef7; }
  .bbms-card.amber::after { background: #f59e0b; }
  .bbms-card.green::after { background: #22c55e; }
  .bbms-card.rose::after  { background: #f43f5e; }

  .bbms-card-icon {
    font-size: 22px;
    margin-bottom: 14px;
    display: block;
  }

  .bbms-card h3 {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .bbms-card-value {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }

  /* ── Charts section ── */
  .bbms-section-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 16px;
  }

  .bbms-charts {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
  }

  .bbms-chart-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
    box-shadow: var(--card-shadow);
  }

  .bbms-chart-card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 24px;
  }

  /* ── Custom Tooltip ── */
  .custom-tooltip {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    box-shadow: 0 4px 16px rgba(0,0,0,.1);
  }

  /* ── Pie legend ── */
  .pie-legend {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
  }

  .pie-legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .pie-legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .pie-legend-label { flex: 1; }
  .pie-legend-value { font-weight: 600; color: var(--text-primary); }

  /* ── Scrollbar ── */
  .bbms-main::-webkit-scrollbar,
  .bbms-sidebar::-webkit-scrollbar { width: 4px; }
  .bbms-main::-webkit-scrollbar-track,
  .bbms-sidebar::-webkit-scrollbar-track { background: transparent; }
  .bbms-main::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
  .bbms-sidebar::-webkit-scrollbar-thumb { background: #2a2f45; border-radius: 4px; }

  /* ── Fade-in ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp .4s ease both; }
  .fade-up-1 { animation-delay: .05s; }
  .fade-up-2 { animation-delay: .10s; }
  .fade-up-3 { animation-delay: .15s; }
  .fade-up-4 { animation-delay: .20s; }
  .fade-up-5 { animation-delay: .25s; }
`;

function injectStyles(id, css) {
  if (document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}

/* ─────────────────────────────────────────────────────────────
   Custom tooltip for recharts
───────────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <strong>{label}</strong>
      <div style={{ color: "#4f6ef7", marginTop: 4 }}>
        {payload[0].value} units
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Nav button helper
───────────────────────────────────────────────────────────── */
function NavBtn({ icon, label, onClick, active }) {
  return (
    <button
      className={`bbms-nav-btn${active ? " active" : ""}`}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Dashboard
───────────────────────────────────────────────────────────── */
export default function Dashboard() {
  injectStyles("bbms-styles", GLOBAL_CSS);

  const navigate = useNavigate();
  const [data, setData] = useState({ totalDonors: 0, pendingDonors: 0, totalUnits: 0 });

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = (user?.role || "").trim().toUpperCase();

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard")
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!user) return <h2 style={{ padding: 40 }}>Please login first</h2>;

  /* chart data */
  const barData = [
    { name: "A+", units: 10 },
    { name: "B+", units: 5 },
    { name: "O+", units: 15 },
    { name: "AB+", units: 7 },
    { name: "AB-", units: 9 },
  ];

  const activeCount  = Math.max(data.totalDonors - data.pendingDonors, 0);
  const pieData = [
    { name: "Active",  value: activeCount },
    { name: "Pending", value: data.pendingDonors },
  ];
  const PIE_COLORS = ["#4f6ef7", "#f59e0b"];

  return (
    <div className="bbms-layout">

      {/* ── SIDEBAR ── */}
      <aside className="bbms-sidebar">
        <div className="bbms-logo">BBMS</div>

        <NavBtn icon="⊞" label="Dashboard" onClick={() => navigate("/dashboard")} active />

        {(role === "ADMIN" || role === "HOSPITAL_STAFF" || role === "RECEPTION_STAFF") && (
          <>
            <div className="bbms-divider" />
            <div className="bbms-section-label">Operations</div>
            <NavBtn icon="✓" label="Donor Approval" onClick={() => navigate("/donor-approval")} />
          </>
        )}

        {["ADMIN", "HOSPITAL_STAFF", "LAB_STAFF", "RECEPTION_STAFF"].includes(role) && (
        <NavBtn icon="👤" label="Donor Management" onClick={() => navigate("/donors")} />
        )}

        {(role === "ADMIN" || role === "HOSPITAL_STAFF") && (
          <>
            <NavBtn icon="♥" label="Donor Screening" onClick={() => navigate("/screening")} />
            <NavBtn icon="⊕" label="Donation"        onClick={() => navigate("/donations")} />
            <NavBtn icon="◈" label="Blood Issue"      onClick={() => navigate("/blood-issue")} />
          </>
        )}

        {role === "HOSPITAL_STAFF" && (
          <NavBtn icon="⊛" label="Blood Requests" onClick={() => navigate("/blood-requests")} />
        )}

        {role === "ADMIN" && (
          <>
            <div className="bbms-divider" />
            <div className="bbms-section-label">Management</div>
            <NavBtn icon="◉" label="User Management"     onClick={() => navigate("/users")} />
            <NavBtn icon="⊜" label="Hospital Management" onClick={() => navigate("/hospitals")} />
            <NavBtn icon="▦" label="Inventory"           onClick={() => navigate("/inventory")} />
            
          </>
        )}

        {role === "LAB_STAFF" && (
          <>
            <div className="bbms-divider" />
            <div className="bbms-section-label">Laboratory</div>
            <NavBtn icon="⚗" label="Blood Testing"    onClick={() => navigate("/blood-tests")} />
            <NavBtn icon="◫" label="Blood Components" onClick={() => navigate("/blood-components")} />
          </>
        )}

        <button
          className="bbms-logout"
          onClick={() => { localStorage.clear(); navigate("/login"); }}
        >
          ⎋ &nbsp;Logout
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className="bbms-main">

        {/* Top bar */}
        <div className="bbms-topbar fade-up">
          <div>
            <h1>Welcome back, {user.fullName} 👋</h1>
            <p>Here's what's happening across the system today.</p>
          </div>
          <div className="bbms-badge">{role.replace("_", " ")}</div>
        </div>

        {/* Stat cards */}
        {role !== "LAB_STAFF" && (
          <div className="bbms-cards">
            <div className="bbms-card blue fade-up fade-up-1">
              <span className="bbms-card-icon">👥</span>
              <h3>Total Donors</h3>
              <div className="bbms-card-value">{data.totalDonors}</div>
            </div>

            <div className="bbms-card amber fade-up fade-up-2">
              <span className="bbms-card-icon">⏳</span>
              <h3>Pending Donors</h3>
              <div className="bbms-card-value">{data.pendingDonors}</div>
            </div>

            <div className="bbms-card green fade-up fade-up-3">
              <span className="bbms-card-icon">🩸</span>
              <h3>Total Units</h3>
              <div className="bbms-card-value">{data.totalUnits}</div>
            </div>
          </div>
        )}

        {role === "LAB_STAFF" && (
          <div className="bbms-cards">
            <div className="bbms-card green fade-up fade-up-1">
              <span className="bbms-card-icon">🩸</span>
              <h3>Total Units</h3>
              <div className="bbms-card-value">{data.totalUnits}</div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="bbms-section-title fade-up fade-up-4">Analytics</div>

        <div className="bbms-charts fade-up fade-up-5">

          {/* Bar chart */}
          <div className="bbms-chart-card">
            <h3>Blood Inventory by Type</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f5" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(79,110,247,.06)" }} />
                <Bar dataKey="units" fill="#4f6ef7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="bbms-chart-card">
            <h3>Donor Status</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="pie-legend">
              {pieData.map((entry, i) => (
                <div className="pie-legend-item" key={entry.name}>
                  <div className="pie-legend-dot" style={{ background: PIE_COLORS[i] }} />
                  <span className="pie-legend-label">{entry.name}</span>
                  <span className="pie-legend-value">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}