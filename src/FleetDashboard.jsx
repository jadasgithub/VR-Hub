import { useState, useMemo } from "react";
import { SettingsIcon, WarningIcon, CalendarIcon, SyncIcon } from "@axon-enterprise/icon";

// ── MOCK FLEET DATA ─────────────────────────────────────────────
const FLEET_DATA = [
  {
    id: "headset",
    label: "VR Headsets",
    models: ["HTC VIVE Focus 3", "HTC VIVE Vision"],
    total: 20,
    romVersion: "6.1.200.3",
    romCompliance: 78,
    romUpToDate: false,
    firmwareVersion: "2.0.999.580",
    firmwareCompliance: 85,
    romRolloutDays: 12,
    fwRolloutDays: 8,
    storageUsedGB: 86,
    storageTotalGB: 128,
    agencySettings: { autoUpdate: true, updateWindow: "02:00 – 05:00", notifyAdmin: true },
    scheduledUpdate: { rom: "Apr 5, 2026 02:00", firmware: null },
    alerts: { priority: 2, other: 3 },
    devices: [
      { id: "H-01", model: "Focus 3",  serial: "VX4F-2A3B", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "2h ago",  storageUsed: 92,  storageTotal: 128, battery: 87 },
      { id: "H-02", model: "Focus 3",  serial: "VX4F-3C1D", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "2h ago",  storageUsed: 78,  storageTotal: 128, battery: 64 },
      { id: "H-03", model: "Focus 3",  serial: "VX4F-7E9A", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "2h ago",  storageUsed: 105, storageTotal: 128, battery: 92 },
      { id: "H-04", model: "Focus 3",  serial: "VX4F-8B2F", rom: "6.1.200.3",  firmware: "2.0.999.560", status: "pending", lastCheckin: "3h ago",  storageUsed: 64,  storageTotal: 128, battery: 45 },
      { id: "H-05", model: "Focus 3",  serial: "VX4F-1D5C", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "3h ago",  storageUsed: 88,  storageTotal: 128, battery: 78 },
      { id: "H-06", model: "Focus 3",  serial: "VX4F-6F0E", rom: "6.1.200.1",  firmware: "2.0.999.560", status: "outdated",lastCheckin: "1d ago",  storageUsed: 118, storageTotal: 128, battery: 12 },
      { id: "H-07", model: "Focus 3",  serial: "VX4F-9A4G", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "4h ago",  storageUsed: 72,  storageTotal: 128, battery: 55 },
      { id: "H-08", model: "Focus 3",  serial: "VX4F-2H7B", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "2h ago",  storageUsed: 95,  storageTotal: 128, battery: 100 },
      { id: "H-09", model: "Vision", serial: "VX4F-5K3J", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "2h ago",  storageUsed: 45,  storageTotal: 128, battery: 71 },
      { id: "H-10", model: "Vision", serial: "VX4F-0L8M", rom: "6.1.200.1",  firmware: "2.0.999.540", status: "offline", lastCheckin: "3d ago",  storageUsed: 110, storageTotal: 128, battery: 0 },
      { id: "H-11", model: "Vision", serial: "VX4F-4N2P", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "5h ago",  storageUsed: 82,  storageTotal: 128, battery: 33 },
      { id: "H-12", model: "Vision", serial: "VX4F-7Q1R", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "5h ago",  storageUsed: 56,  storageTotal: 128, battery: 89 },
      { id: "H-13", model: "Focus 3",  serial: "VX4F-3S6T", rom: "6.1.200.1",  firmware: "2.0.999.540", status: "offline", lastCheckin: "5d ago",  storageUsed: 120, storageTotal: 128, battery: 0 },
      { id: "H-14", model: "Vision", serial: "VX4F-8U0V", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "1h ago",  storageUsed: 38,  storageTotal: 128, battery: 95 },
      { id: "H-15", model: "Focus 3",  serial: "VX4F-1W5X", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "1h ago",  storageUsed: 91,  storageTotal: 128, battery: 82 },
      { id: "H-16", model: "Focus 3",  serial: "VX4F-9Y2Z", rom: "6.1.200.3",  firmware: "2.0.999.560", status: "pending", lastCheckin: "6h ago",  storageUsed: 67,  storageTotal: 128, battery: 58 },
      { id: "H-17", model: "Vision", serial: "VX4F-6A8B", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "1h ago",  storageUsed: 53,  storageTotal: 128, battery: 76 },
      { id: "H-18", model: "Focus 3",  serial: "VX4F-2C4D", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "1h ago",  storageUsed: 99,  storageTotal: 128, battery: 41 },
      { id: "H-19", model: "Vision", serial: "VX4F-7E1F", rom: "6.1.200.1",  firmware: "2.0.999.560", status: "outdated",lastCheckin: "2d ago",  storageUsed: 114, storageTotal: 128, battery: 8 },
      { id: "H-20", model: "Focus 3",  serial: "VX4F-3G9H", rom: "6.1.200.3",  firmware: "2.0.999.580", status: "current", lastCheckin: "30m ago", storageUsed: 84,  storageTotal: 128, battery: 67 },
    ],
  },
  {
    id: "tablet",
    label: "Tablets",
    models: ["Samsung Galaxy Tab S7", "Samsung Galaxy Tab S9"],
    total: 6,
    romVersion: "4.2.100.1",
    romCompliance: 83,
    romUpToDate: true,
    firmwareVersion: "1.5.320.200",
    firmwareCompliance: 67,
    romRolloutDays: 5,
    fwRolloutDays: 14,
    storageUsedGB: 24,
    storageTotalGB: 64,
    agencySettings: { autoUpdate: true, updateWindow: "02:00 – 05:00", notifyAdmin: true },
    scheduledUpdate: { rom: null, firmware: "Apr 8, 2026 03:00" },
    alerts: { priority: 0, other: 1 },
    devices: [
      { id: "T-01", model: "Tab S9", serial: "TX2B-5A1C", rom: "4.2.100.1", firmware: "1.5.320.200", status: "current", lastCheckin: "30m ago" },
      { id: "T-02", model: "Tab S9", serial: "TX2B-8D3E", rom: "4.2.100.1", firmware: "1.5.320.200", status: "current", lastCheckin: "30m ago" },
      { id: "T-03", model: "Tab S7", serial: "TX2B-1F7G", rom: "4.2.100.1", firmware: "1.5.320.180", status: "pending", lastCheckin: "1h ago" },
      { id: "T-04", model: "Tab S7", serial: "TX2B-4H2J", rom: "4.2.100.1", firmware: "1.5.320.200", status: "current", lastCheckin: "2h ago" },
      { id: "T-05", model: "Tab S9", serial: "TX2B-9K5L", rom: "4.2.100.1", firmware: "1.5.320.200", status: "current", lastCheckin: "1h ago" },
      { id: "T-06", model: "Tab S7", serial: "TX2B-3M8N", rom: "4.2.99.8",  firmware: "1.5.320.160", status: "outdated",lastCheckin: "4d ago" },
    ],
  },
  {
    id: "taser-controller",
    label: "TASER Controllers",
    models: ["VR TASER Controller v2"],
    total: 10,
    romVersion: "3.0.50.2",
    romCompliance: 90,
    romUpToDate: true,
    firmwareVersion: "1.2.110.40",
    firmwareCompliance: 90,
    romRolloutDays: 3,
    fwRolloutDays: 3,
    storageUsedGB: null,
    storageTotalGB: null,
    agencySettings: { autoUpdate: true, updateWindow: "02:00 – 05:00", notifyAdmin: false },
    scheduledUpdate: { rom: null, firmware: null },
    alerts: { priority: 0, other: 0 },
    devices: [
      { id: "TC-01", model: "v2", serial: "TC2A-1A1B", rom: "3.0.50.2", firmware: "1.2.110.40", status: "current",  lastCheckin: "1h ago" },
      { id: "TC-02", model: "v2", serial: "TC2A-2C3D", rom: "3.0.50.2", firmware: "1.2.110.40", status: "current",  lastCheckin: "1h ago" },
      { id: "TC-03", model: "v2", serial: "TC2A-4E5F", rom: "3.0.50.2", firmware: "1.2.110.40", status: "current",  lastCheckin: "2h ago" },
      { id: "TC-04", model: "v2", serial: "TC2A-6G7H", rom: "3.0.50.2", firmware: "1.2.110.40", status: "current",  lastCheckin: "2h ago" },
      { id: "TC-05", model: "v2", serial: "TC2A-8J9K", rom: "3.0.50.2", firmware: "1.2.110.40", status: "current",  lastCheckin: "3h ago" },
      { id: "TC-06", model: "v2", serial: "TC2A-0L1M", rom: "3.0.50.2", firmware: "1.2.110.40", status: "current",  lastCheckin: "3h ago" },
      { id: "TC-07", model: "v2", serial: "TC2A-2N3P", rom: "3.0.50.2", firmware: "1.2.110.40", status: "current",  lastCheckin: "4h ago" },
      { id: "TC-08", model: "v2", serial: "TC2A-4Q5R", rom: "3.0.50.2", firmware: "1.2.110.40", status: "current",  lastCheckin: "4h ago" },
      { id: "TC-09", model: "v2", serial: "TC2A-6S7T", rom: "3.0.50.1", firmware: "1.2.110.38", status: "pending",  lastCheckin: "1d ago" },
      { id: "TC-10", model: "v2", serial: "TC2A-8U9V", rom: "3.0.50.2", firmware: "1.2.110.40", status: "current",  lastCheckin: "5h ago" },
    ],
  },
  {
    id: "handgun-controller",
    label: "Handgun Controllers",
    models: ["VR Handgun Controller v1"],
    total: 10,
    romVersion: "2.1.30.5",
    romCompliance: 70,
    romUpToDate: false,
    firmwareVersion: "1.0.80.12",
    firmwareCompliance: 70,
    romRolloutDays: 18,
    fwRolloutDays: 18,
    storageUsedGB: null,
    storageTotalGB: null,
    agencySettings: { autoUpdate: false, updateWindow: "02:00 – 05:00", notifyAdmin: true },
    scheduledUpdate: { rom: "Apr 10, 2026 02:00", firmware: "Apr 10, 2026 02:00" },
    alerts: { priority: 1, other: 2 },
    devices: [
      { id: "HC-01", model: "v1", serial: "HC1A-1A2B", rom: "2.1.30.5", firmware: "1.0.80.12", status: "current",  lastCheckin: "2h ago" },
      { id: "HC-02", model: "v1", serial: "HC1A-3C4D", rom: "2.1.30.5", firmware: "1.0.80.12", status: "current",  lastCheckin: "2h ago" },
      { id: "HC-03", model: "v1", serial: "HC1A-5E6F", rom: "2.1.30.5", firmware: "1.0.80.12", status: "current",  lastCheckin: "3h ago" },
      { id: "HC-04", model: "v1", serial: "HC1A-7G8H", rom: "2.1.30.3", firmware: "1.0.80.10", status: "outdated", lastCheckin: "3d ago" },
      { id: "HC-05", model: "v1", serial: "HC1A-9J0K", rom: "2.1.30.5", firmware: "1.0.80.12", status: "current",  lastCheckin: "4h ago" },
      { id: "HC-06", model: "v1", serial: "HC1A-1L2M", rom: "2.1.30.5", firmware: "1.0.80.10", status: "pending",  lastCheckin: "1d ago" },
      { id: "HC-07", model: "v1", serial: "HC1A-3N4P", rom: "2.1.30.5", firmware: "1.0.80.12", status: "current",  lastCheckin: "5h ago" },
      { id: "HC-08", model: "v1", serial: "HC1A-5Q6R", rom: "2.1.30.3", firmware: "1.0.80.10", status: "outdated", lastCheckin: "5d ago" },
      { id: "HC-09", model: "v1", serial: "HC1A-7S8T", rom: "2.1.30.5", firmware: "1.0.80.12", status: "current",  lastCheckin: "6h ago" },
      { id: "HC-10", model: "v1", serial: "HC1A-9U0V", rom: "2.1.30.5", firmware: "1.0.80.12", status: "current",  lastCheckin: "1h ago" },
    ],
  },
  {
    id: "rifle-controller",
    label: "Rifle Controllers",
    models: ["VR Rifle Controller v1"],
    total: 5,
    romVersion: "1.4.20.1",
    romCompliance: 80,
    romUpToDate: true,
    firmwareVersion: "1.0.40.8",
    firmwareCompliance: 60,
    romRolloutDays: 10,
    fwRolloutDays: 22,
    storageUsedGB: null,
    storageTotalGB: null,
    agencySettings: { autoUpdate: true, updateWindow: "02:00 – 05:00", notifyAdmin: false },
    scheduledUpdate: { rom: null, firmware: "Apr 12, 2026 03:00" },
    alerts: { priority: 1, other: 1 },
    devices: [
      { id: "RC-01", model: "v1", serial: "RC1A-1A1B", rom: "1.4.20.1", firmware: "1.0.40.8", status: "current",  lastCheckin: "2h ago" },
      { id: "RC-02", model: "v1", serial: "RC1A-2C3D", rom: "1.4.20.1", firmware: "1.0.40.8", status: "current",  lastCheckin: "3h ago" },
      { id: "RC-03", model: "v1", serial: "RC1A-4E5F", rom: "1.4.20.1", firmware: "1.0.40.6", status: "pending",  lastCheckin: "1d ago" },
      { id: "RC-04", model: "v1", serial: "RC1A-6G7H", rom: "1.4.19.8", firmware: "1.0.40.4", status: "outdated", lastCheckin: "4d ago" },
      { id: "RC-05", model: "v1", serial: "RC1A-8J9K", rom: "1.4.20.1", firmware: "1.0.40.8", status: "current",  lastCheckin: "5h ago" },
    ],
  },
];

const STATUS_CLASS = {
  current:  "vr-stamp-green",
  pending:  "vr-stamp-blue",
  outdated: "vr-stamp-red",
  offline:  "vr-stamp-gray",
};

const DOT_COLORS = {
  current:  "var(--vr-positive)",
  pending:  "var(--vr-info)",
  outdated: "var(--vr-alert)",
  offline:  "var(--vr-dim)",
};

// ── SVG Donut helper ────────────────────────────────────────────
function Donut({ pct, label, color, size = 130 }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <div className="vr-donut-card">
      <svg className="vr-donut-svg" viewBox="0 0 120 120" style={{ width: size, height: size }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--vr-border)" strokeWidth="12" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
        />
        <text x="60" y="55" textAnchor="middle" dominantBaseline="central" className="vr-donut-pct">
          {pct}%
        </text>
        <text x="60" y="75" textAnchor="middle" dominantBaseline="central" className="vr-donut-sub">
          {label}
        </text>
      </svg>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────
export default function FleetDashboard() {
  const [selectedType, setSelectedType] = useState("headset");
  const [activeTab, setActiveTab] = useState("inventory");
  const [invFilter, setInvFilter] = useState("all");
  const [invView, setInvView] = useState("list");
  const [invSearch, setInvSearch] = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const fleet = FLEET_DATA.find(f => f.id === selectedType);

  const statusCounts = useMemo(() => {
    const c = { current: 0, pending: 0, outdated: 0, offline: 0 };
    fleet.devices.forEach(d => c[d.status]++);
    return c;
  }, [fleet]);

  const filteredDevices = useMemo(() => {
    let list = invFilter === "all" ? fleet.devices : fleet.devices.filter(d => d.status === invFilter);
    if (invSearch) {
      const q = invSearch.toLowerCase();
      list = list.filter(d =>
        d.id.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        d.serial.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
      );
    }
    if (sortCol) {
      const dir = sortAsc ? 1 : -1;
      list = [...list].sort((a, b) => {
        let va = a[sortCol], vb = b[sortCol];
        if (typeof va === "number") return (va - vb) * dir;
        return String(va).localeCompare(String(vb)) * dir;
      });
    }
    return list;
  }, [fleet, invFilter, invSearch, sortCol, sortAsc]);

  const toggleSort = (col) => {
    if (sortCol === col) setSortAsc(v => !v);
    else { setSortCol(col); setSortAsc(true); }
  };

  const selDev = selectedDevice ? fleet.devices.find(d => d.id === selectedDevice) : null;

  return (
    <div className="vr-sub-page">

      {/* ── Page header ── */}
      <div className="vr-sub-header">
        <div>
          <p className="vr-body">
            {__("Monitor device health, ROM and firmware compliance across your VR fleet.")}
          </p>
          <p className="vr-caption" style={{ marginTop: 4, color: "var(--vr-dim)" }}>
            {__("Last synced:")} {__("2 min ago")}
          </p>
        </div>
        <button className="vr-btn-secondary">
          <SettingsIcon style={{ width: 15, height: 15 }} />
          {__("Dashboard Settings")}
        </button>
      </div>

      {/* ── Two-column layout (matches TASER Program Dashboard) ── */}
      <div className="vr-fleet-layout">

        {/* ── Left sidebar: device + alerts ── */}
        <aside className="vr-fleet-sidebar">
          <div className="vr-fleet-device-header">
            <div className="vr-fleet-device-image">
              {selectedType === "headset" ? (
                <img src="/images/htc-headset.jpg" alt="HTC VIVE Focus 3" className="vr-fleet-device-img" />
              ) : (
                <VRDeviceIcon type={selectedType} />
              )}
            </div>
            <span className="vr-caption" style={{ textAlign: "center" }}>{fleet.models[0]}</span>
            <select
              className="vr-fleet-device-select"
              value={selectedType}
              onChange={e => { setSelectedType(e.target.value); setActiveTab("overview"); }}
            >
              {FLEET_DATA.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="vr-fleet-alerts">
            <p className="vr-fleet-alerts-title">{__("Alerts")}</p>
            <div className="vr-fleet-alert-item">
              <WarningIcon style={{ width: 14, height: 14, color: "var(--vr-alert)" }} />
              <span className="vr-caption">{__("Priority Alerts")}</span>
              <span className="vr-fleet-alert-badge vr-fleet-alert-badge--priority">{fleet.alerts.priority}</span>
            </div>
            <div className="vr-fleet-alert-item">
              <WarningIcon style={{ width: 14, height: 14, color: "var(--vr-dim)" }} />
              <span className="vr-caption">{__("Other Alerts")}</span>
              <span className="vr-fleet-alert-badge">{fleet.alerts.other}</span>
            </div>
          </div>
        </aside>

        {/* ── Right main: tabs + content ── */}
        <div className="vr-fleet-main">

          {/* Tabs */}
          <div className="vr-fleet-tabs">
            <button
              className={`vr-fleet-tab${activeTab === "inventory" ? " vr-fleet-tab--active" : ""}`}
              onClick={() => setActiveTab("inventory")}
            >
              {__("Inventory Summary")}
            </button>
            <button
              className={`vr-fleet-tab${activeTab === "overview" ? " vr-fleet-tab--active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              {__("Program Overview")}
            </button>
          </div>

          {activeTab === "overview" ? (
            <>
              {/* ── Compact stat row ── */}
              <div className="vr-fleet-stats-row">
                <div className="vr-fleet-stat">
                  <span className="vr-fleet-stat-icon">●</span>
                  <span className="vr-body-sm">{__("Devices In Use")}</span>
                  <span className="vr-fleet-stat-val">{fleet.total}</span>
                </div>
                <div className="vr-fleet-stat">
                  <span className="vr-fleet-stat-icon">●</span>
                  <span className="vr-body-sm">{__("Latest ROM")}</span>
                  <span className="vr-fleet-stat-val">{fleet.romVersion}</span>
                </div>
                <div className="vr-fleet-stat">
                  <span className="vr-fleet-stat-icon">●</span>
                  <span className="vr-body-sm">{__("Latest Firmware")}</span>
                  <span className="vr-fleet-stat-val">{fleet.firmwareVersion}</span>
                </div>
              </div>

              {/* ── ROM + Firmware donuts side by side ── */}
              <div className="vr-fleet-donuts-row">
                <div className="vr-fleet-section vr-fleet-section--half">
                  <div className="vr-fleet-section-header">
                    <p className="vr-fleet-section-title">{__("ROM")}</p>
                    <span className={fleet.romUpToDate ? "vr-stamp-green" : "vr-stamp-red"}>
                      {fleet.romUpToDate ? __("Up to Date") : __("Update Available")}
                    </span>
                  </div>
                  <Donut pct={fleet.romCompliance} label={__("devices compliant")} color="var(--vr-positive)" size={120} />
                  <p className="vr-caption" style={{ textAlign: "center", marginTop: 8 }}>~{fleet.romRolloutDays}d {__("remaining")}</p>
                </div>

                <div className="vr-fleet-section vr-fleet-section--half">
                  <div className="vr-fleet-section-header">
                    <p className="vr-fleet-section-title">{__("Firmware")}</p>
                  </div>
                  <Donut pct={fleet.firmwareCompliance} label={__("devices compliant")} color="var(--vr-info)" size={120} />
                  <p className="vr-caption" style={{ textAlign: "center", marginTop: 8 }}>~{fleet.fwRolloutDays}d {__("remaining")}</p>
                </div>
              </div>

              {/* ── Storage (headsets/tablets only) — aggregate only ── */}
              {fleet.storageTotalGB && (() => {
                const totalUsed = fleet.devices.reduce((s, d) => s + (d.storageUsed || 0), 0);
                const totalCap = fleet.devices.reduce((s, d) => s + (d.storageTotal || 0), 0);
                const aggPct = totalCap ? Math.round((totalUsed / totalCap) * 100) : 0;
                return (
                  <div className="vr-fleet-section">
                    <div className="vr-fleet-section-header">
                      <p className="vr-fleet-section-title">{fleet.label} {__("Storage")}</p>
                      <span className="vr-caption">{aggPct}% {__("used")}</span>
                    </div>
                    <div className="vr-fleet-storage">
                      <div className="vr-fleet-storage-bar vr-fleet-storage-bar--agg">
                        <div className="vr-fleet-storage-fill" style={{ width: `${aggPct}%` }} />
                      </div>
                      <div className="vr-fleet-storage-labels">
                        <span className="vr-body-sm">{totalUsed} GB {__("used")}</span>
                        <span className="vr-caption">{totalCap - totalUsed} GB {__("free")} / {totalCap} GB {__("total")}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Scheduled Updates ── */}
              <div className="vr-fleet-section">
                <div className="vr-fleet-section-header">
                  <p className="vr-fleet-section-title">{__("Scheduled Updates")}</p>
                  <button className="vr-btn-secondary vr-btn-sm">
                    <CalendarIcon style={{ width: 14, height: 14 }} />
                    {__("Schedule Update")}
                  </button>
                </div>
                <div className="vr-fleet-schedule-list">
                  <div className="vr-fleet-schedule-item">
                    <span className="vr-body-sm">{__("ROM Update")}</span>
                    <span className={`vr-caption ${fleet.scheduledUpdate.rom ? "" : "vr-fleet-schedule--none"}`}>
                      {fleet.scheduledUpdate.rom || __("No update scheduled")}
                    </span>
                  </div>
                  <div className="vr-fleet-schedule-item">
                    <span className="vr-body-sm">{__("Firmware Update")}</span>
                    <span className={`vr-caption ${fleet.scheduledUpdate.firmware ? "" : "vr-fleet-schedule--none"}`}>
                      {fleet.scheduledUpdate.firmware || __("No update scheduled")}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Agency Settings ── */}
              <div className="vr-fleet-section">
                <div className="vr-fleet-section-header">
                  <p className="vr-fleet-section-title">{__("Agency Settings")}</p>
                  <button className="vr-btn-ghost vr-btn-sm">
                    <SettingsIcon style={{ width: 14, height: 14 }} />
                    {__("Edit")}
                  </button>
                </div>
                <div className="vr-fleet-settings-grid">
                  <div className="vr-fleet-setting">
                    <span className="vr-caption">{__("Auto-Update")}</span>
                    <span className={fleet.agencySettings.autoUpdate ? "vr-stamp-green" : "vr-stamp-red"}>
                      {fleet.agencySettings.autoUpdate ? __("Enabled") : __("Disabled")}
                    </span>
                  </div>
                  <div className="vr-fleet-setting">
                    <span className="vr-caption">{__("Update Window")}</span>
                    <span className="vr-body-sm">{fleet.agencySettings.updateWindow}</span>
                  </div>
                  <div className="vr-fleet-setting">
                    <span className="vr-caption">{__("Notify Admin")}</span>
                    <span className={fleet.agencySettings.notifyAdmin ? "vr-stamp-green" : "vr-stamp-gray"}>
                      {fleet.agencySettings.notifyAdmin ? __("On") : __("Off")}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ── Inventory: status bar + filters + tile grid + detail ── */
            <>
              {/* Status summary bar */}
              <div className="vr-fleet-status-bar">
                <span className="vr-fleet-status-dot" style={{ color: "var(--vr-positive)" }}>● {statusCounts.current} {__("current")}</span>
                <span className="vr-fleet-status-dot" style={{ color: "var(--vr-info)" }}>● {statusCounts.pending} {__("pending")}</span>
                <span className="vr-fleet-status-dot" style={{ color: "var(--vr-alert)" }}>● {statusCounts.outdated} {__("outdated")}</span>
                <span className="vr-fleet-status-dot" style={{ color: "var(--vr-dim)" }}>● {statusCounts.offline} {__("offline")}</span>
                <button className="vr-btn-ghost vr-btn-sm" style={{ marginLeft: "auto" }}>
                  <SyncIcon style={{ width: 14, height: 14 }} />
                  {__("Refresh")}
                </button>
              </div>

              {/* Search + filter tabs + view toggle */}
              <div className="vr-fleet-inv-toolbar">
                <div className="vr-fleet-inv-filters">
                  {[
                    { key: "all", label: __("All"), count: fleet.devices.length },
                    { key: "current", label: __("Current"), count: statusCounts.current },
                    { key: "pending", label: __("Pending"), count: statusCounts.pending },
                    { key: "outdated", label: __("Outdated"), count: statusCounts.outdated },
                    { key: "offline", label: __("Offline"), count: statusCounts.offline },
                  ].map(f => (
                    <button
                      key={f.key}
                      className={`vr-fleet-filter-btn${invFilter === f.key ? " vr-fleet-filter-btn--active" : ""}`}
                      onClick={() => { setInvFilter(f.key); setSelectedDevice(null); }}
                    >
                      {f.label} ({f.count})
                    </button>
                  ))}
                  <input
                    type="text"
                    className="vr-fleet-search-input"
                    placeholder={__("Search devices...")}
                    value={invSearch}
                    onChange={e => { setInvSearch(e.target.value); setSelectedDevice(null); }}
                  />
                </div>
                <div className="vr-fleet-view-toggle">
                  <button
                    className={`vr-fleet-view-btn${invView === "grid" ? " vr-fleet-view-btn--active" : ""}`}
                    onClick={() => { setInvView("grid"); if (!selectedDevice) setSelectedDevice(filteredDevices[0]?.id ?? null); }}
                    aria-label={__("Grid view")}
                    title={__("Grid view")}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
                  </button>
                  <button
                    className={`vr-fleet-view-btn${invView === "list" ? " vr-fleet-view-btn--active" : ""}`}
                    onClick={() => setInvView("list")}
                    aria-label={__("List view")}
                    title={__("List view")}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="3" rx="1"/><rect x="1" y="6.5" width="14" height="3" rx="1"/><rect x="1" y="12" width="14" height="3" rx="1"/></svg>
                  </button>
                </div>
              </div>

              {invView === "grid" ? (
                /* ── Grid view: tile grid + detail split ── */
                <div className={`vr-fleet-inv-split${selDev ? " vr-fleet-inv-split--has-detail" : ""}`}>
                  <div className="vr-fleet-inv-grid-pane">
                    <div className="vr-device-grid">
                      {filteredDevices.map(d => (
                        <div
                          key={d.id}
                          className={`vr-tile vr-tile--${d.status}${selectedDevice === d.id ? " vr-tile--sel" : ""}`}
                          onClick={() => setSelectedDevice(d.id)}
                        >
                          <div className="vr-tile-status-dot" style={{ background: DOT_COLORS[d.status] }} />
                          <div className="vr-tile-icon">{fleet.id === "tablet" ? "📱" : fleet.id === "headset" ? "🥽" : "🎮"}</div>
                          <div className="vr-tile-name">{d.id}</div>
                          <div className="vr-tile-serial">{d.serial.split("-")[1]}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selDev && (
                    <div className="vr-fleet-inv-detail">
                      <div style={{ padding: 16 }}>
                        <div className="vr-fleet-detail-header">
                          <span className="vr-fleet-detail-id">{selDev.id}</span>
                          <span className={STATUS_CLASS[selDev.status]}>
                            {selDev.status.charAt(0).toUpperCase() + selDev.status.slice(1)}
                          </span>
                        </div>

                        <div className="vr-fleet-detail-rows">
                          <div className="vr-fleet-detail-row">
                            <span className="vr-caption">{__("Model")}</span>
                            <span className="vr-body-sm">{selDev.model}</span>
                          </div>
                          <div className="vr-fleet-detail-row">
                            <span className="vr-caption">{__("Serial")}</span>
                            <span className="vr-body-sm" style={{ fontFamily: "monospace" }}>{selDev.serial}</span>
                          </div>
                          <div className="vr-fleet-detail-row">
                            <span className="vr-caption">{__("ROM Version")}</span>
                            <span className="vr-body-sm">{selDev.rom}</span>
                            {selDev.rom !== fleet.romVersion && <span className="vr-stamp-red" style={{ fontSize: 9 }}>{__("Outdated")}</span>}
                          </div>
                          <div className="vr-fleet-detail-row">
                            <span className="vr-caption">{__("Firmware")}</span>
                            <span className="vr-body-sm">{selDev.firmware}</span>
                            {selDev.firmware !== fleet.firmwareVersion && <span className="vr-stamp-red" style={{ fontSize: 9 }}>{__("Outdated")}</span>}
                          </div>
                          <div className="vr-fleet-detail-row">
                            <span className="vr-caption">{__("Last Online")}</span>
                            <span className="vr-body-sm">{selDev.lastCheckin}</span>
                          </div>
                          {selDev.battery != null && (
                            <div className="vr-fleet-detail-row">
                              <span className="vr-caption">{__("Battery")}</span>
                              <span className="vr-body-sm">
                                <span className={`vr-battery-icon${selDev.battery <= 20 ? " vr-battery-icon--low" : ""}`}>
                                  {selDev.battery <= 20 ? "🪫" : "🔋"}
                                </span>
                                {" "}{selDev.battery}%
                              </span>
                            </div>
                          )}
                          {selDev.storageUsed != null && (
                            <div className="vr-fleet-detail-row">
                              <span className="vr-caption">{__("Storage")}</span>
                              <span className="vr-body-sm">{selDev.storageUsed}/{selDev.storageTotal} GB</span>
                            </div>
                          )}
                        </div>

                        <div className="vr-fleet-detail-actions">
                          <button className="vr-btn-secondary vr-btn-sm">{__("Push Update")}</button>
                          <button className="vr-btn-ghost vr-btn-sm">{__("View History")}</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── List view: proper table ── */
                <div className="vr-fleet-list">
                  <table className="vr-fleet-table">
                    <thead>
                      <tr>
                        {[
                          { col: "id", label: __("Device"), cls: "vr-col-device" },
                          { col: "model", label: __("Model"), cls: "vr-col-model" },
                          { col: "serial", label: __("Serial"), cls: "vr-col-serial" },
                          { col: "rom", label: __("ROM"), cls: "vr-col-ver" },
                          { col: "firmware", label: __("Firmware"), cls: "vr-col-ver" },
                          { col: "status", label: __("Status"), cls: "vr-col-status" },
                          { col: "battery", label: __("Battery"), cls: "vr-col-batt" },
                          { col: "storageUsed", label: __("Storage"), cls: "vr-col-storage" },
                          { col: "lastCheckin", label: __("Last Online"), cls: "vr-col-checkin" },
                        ].map(h => (
                          <th key={h.col} className={`${h.cls} vr-fleet-th-sort`} onClick={() => toggleSort(h.col)}>
                            {h.label}
                            {sortCol === h.col && <span className="vr-fleet-sort-arrow">{sortAsc ? " ▲" : " ▼"}</span>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDevices.map(d => (
                        <tr
                          key={d.id}
                          className={selectedDevice === d.id ? "vr-fleet-list-row--sel" : ""}
                          onClick={() => setSelectedDevice(d.id)}
                        >
                          <td className="vr-col-device" style={{ fontWeight: 700 }}>
                            <span className="vr-fleet-list-dot" style={{ background: DOT_COLORS[d.status] }} />
                            {d.id}
                          </td>
                          <td className="vr-col-model">{d.model}</td>
                          <td className="vr-col-serial">{d.serial}</td>
                          <td className="vr-col-ver">
                            {d.rom}
                            {d.rom !== fleet.romVersion && <span className="vr-stamp-red" style={{ fontSize: 9, marginLeft: 4 }}>!</span>}
                          </td>
                          <td className="vr-col-ver">
                            {d.firmware}
                            {d.firmware !== fleet.firmwareVersion && <span className="vr-stamp-red" style={{ fontSize: 9, marginLeft: 4 }}>!</span>}
                          </td>
                          <td className="vr-col-status">
                            <span className={STATUS_CLASS[d.status]}>{d.status.charAt(0).toUpperCase() + d.status.slice(1)}</span>
                          </td>
                          <td className="vr-col-batt">
                            {d.battery != null ? (
                              <span className={d.battery <= 20 ? "vr-fleet-batt--low" : ""}>
                                {d.battery <= 20 ? "🪫" : "🔋"} {d.battery}%
                              </span>
                            ) : "—"}
                          </td>
                          <td className="vr-col-storage">
                            {d.storageUsed != null ? `${d.storageUsed}/${d.storageTotal}` : "—"}
                          </td>
                          <td className="vr-col-checkin">{d.lastCheckin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Simple SVG placeholder icons per device type ────────────────
function VRDeviceIcon({ type }) {
  const color = "var(--vr-dim)";
  if (type === "headset") {
    return (
      <svg viewBox="0 0 80 80" fill="none" style={{ width: "100%", height: "100%" }}>
        <rect x="10" y="25" width="60" height="32" rx="8" stroke={color} strokeWidth="2.5" />
        <circle cx="30" cy="41" r="9" stroke={color} strokeWidth="2" />
        <circle cx="50" cy="41" r="9" stroke={color} strokeWidth="2" />
        <path d="M12 35 Q6 41 12 47" stroke={color} strokeWidth="2" fill="none" />
        <path d="M68 35 Q74 41 68 47" stroke={color} strokeWidth="2" fill="none" />
      </svg>
    );
  }
  if (type === "tablet") {
    return (
      <svg viewBox="0 0 80 80" fill="none" style={{ width: "100%", height: "100%" }}>
        <rect x="18" y="10" width="44" height="60" rx="4" stroke={color} strokeWidth="2.5" />
        <circle cx="40" cy="62" r="3" stroke={color} strokeWidth="1.5" />
        <line x1="28" y1="16" x2="52" y2="16" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "taser-controller") {
    return (
      <svg viewBox="0 0 80 80" fill="none" style={{ width: "100%", height: "100%" }}>
        <rect x="28" y="12" width="24" height="40" rx="4" stroke={color} strokeWidth="2.5" />
        <rect x="32" y="52" width="16" height="18" rx="2" stroke={color} strokeWidth="2" />
        <line x1="36" y1="22" x2="44" y2="22" stroke={color} strokeWidth="2" />
        <circle cx="40" cy="32" r="3" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "handgun-controller") {
    return (
      <svg viewBox="0 0 80 80" fill="none" style={{ width: "100%", height: "100%" }}>
        <path d="M15 35 H55 Q60 35 60 30 V25 Q60 20 55 20 H25 Q20 20 20 25 V35" stroke={color} strokeWidth="2.5" fill="none" />
        <path d="M30 35 V60 Q30 65 35 65 H40 Q45 65 45 60 V35" stroke={color} strokeWidth="2.5" fill="none" />
        <line x1="25" y1="28" x2="55" y2="28" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  // rifle-controller
  return (
    <svg viewBox="0 0 80 80" fill="none" style={{ width: "100%", height: "100%" }}>
      <path d="M8 38 H62 Q66 38 66 34 V30 Q66 26 62 26 H18 Q14 26 14 30 V38" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M36 38 V56 Q36 60 40 60 H44 Q48 60 48 56 V38" stroke={color} strokeWidth="2.5" fill="none" />
      <rect x="62" y="28" width="12" height="8" rx="2" stroke={color} strokeWidth="2" />
      <line x1="18" y1="32" x2="60" y2="32" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
