import { useState, useCallback, useRef } from "react";
import { FileUploadIcon, SyncIcon } from "@axon-enterprise/icon";

// ── STATIC DATA ──────────────────────────────────────────────────
const DEVICE_STORAGE_GB = 128;
const DOT_COLORS = { ready: "var(--vr-positive)", loading: "var(--vr-info)", failed: "var(--vr-alert)", offline: "var(--vr-dim)" };

const APP_MODULE_LIBRARY = {
  "Simulator Training": [
    { name: "Range Skills", size: 1.8 }, { name: "Validation Course", size: 2.1 },
    { name: "vRBT", size: 1.4 },         { name: "Tactical Clearance", size: 1.6 },
  ],
  "Community Engagement Training": [
    { name: "Hard of Hearing", size: 0.4 },         { name: "Domestic Violence", size: 0.8 },
    { name: "Mental Health Crisis", size: 0.6 },    { name: "Autism Awareness", size: 0.5 },
    { name: "Active Bystander", size: 0.7 },        { name: "De-escalation Basics", size: 0.5 },
    { name: "Cultural Competency", size: 0.4 },     { name: "Youth Interactions", size: 0.6 },
    { name: "Elder Care Response", size: 0.5 },     { name: "Substance Abuse", size: 0.7 },
    { name: "Homelessness Outreach", size: 0.4 },   { name: "Trauma-Informed Policing", size: 0.6 },
    { name: "LGBTQ+ Interactions", size: 0.5 },     { name: "Immigration Response", size: 0.5 },
    { name: "Language Barriers", size: 0.4 },       { name: "Victim-Centered Approach", size: 0.6 },
    { name: "Crisis Negotiation Intro", size: 0.8 },{ name: "Non-Verbal Communication", size: 0.4 },
    { name: "School Resource Officer", size: 0.7 }, { name: "Domestic Dispute Response", size: 0.8 },
    { name: "Child Abuse Indicators", size: 0.5 },  { name: "Community Partnership", size: 0.3 },
  ],
  "Verbal Skills": [
    { name: "Contact & Cover", size: 0.5 },   { name: "Persuasion Tactics", size: 0.6 },
    { name: "Interview Techniques", size: 0.7 }, { name: "Statement Analysis", size: 0.5 },
    { name: "Witness Management", size: 0.5 }, { name: "Crisis Communication", size: 0.8 },
  ],
  "vRBT Live Action": [
    { name: "Urban Patrol", size: 2.2 },     { name: "Domestic Call", size: 1.9 },
    { name: "Traffic Stop", size: 1.7 },     { name: "Bar Fight", size: 2.0 },
    { name: "Mental Health Call", size: 1.8 },{ name: "Active Shooter", size: 2.1 },
    { name: "Foot Pursuit", size: 1.8 },     { name: "Vehicle Stop", size: 1.7 },
    { name: "Crowd Control", size: 2.0 },    { name: "Robbery Response", size: 1.9 },
    { name: "Building Search", size: 2.2 },  { name: "Warrant Service", size: 2.0 },
    { name: "School Threat", size: 1.9 },    { name: "Hostage Situation", size: 2.1 },
    { name: "Gang Encounter", size: 1.8 },   { name: "Night Ops", size: 1.4 },
  ],
  "TASER Arena": [
    { name: "Basic Deployment", size: 0.9 },              { name: "Scenario A: Aggressive Subject", size: 1.1 },
    { name: "Scenario B: Vehicle Stop", size: 1.0 },      { name: "Scenario C: Domestic", size: 1.0 },
    { name: "Certification Course", size: 1.2 },
  ],
};

const INIT_DEVS = {
  "H-01": { type:"headset", serial:"VX4F-2A3B", status:"ready",   apps:[{ name:"Simulator Training",            modules:["Range Skills","Validation Course"] }], sync:"2h ago",  send:1 },
  "H-02": { type:"headset", serial:"VX4F-3C1D", status:"ready",   apps:[{ name:"Simulator Training",            modules:["Range Skills","Validation Course"] }], sync:"2h ago",  send:1 },
  "H-03": { type:"headset", serial:"VX4F-7E9A", status:"ready",   apps:[{ name:"Simulator Training",            modules:["Range Skills","Validation Course"] }], sync:"2h ago",  send:1 },
  "H-04": { type:"headset", serial:"VX4F-8B2F", status:"ready",   apps:[{ name:"Simulator Training",            modules:["Range Skills","Validation Course"] }], sync:"2h ago",  send:1 },
  "H-05": { type:"headset", serial:"VX4F-1D5C", status:"ready",   apps:[{ name:"Simulator Training",            modules:["Range Skills","Validation Course"] }], sync:"3h ago",  send:1 },
  "H-06": { type:"headset", serial:"VX4F-6F0E", status:"ready",   apps:[{ name:"Simulator Training",            modules:["Range Skills","Validation Course"] }], sync:"3h ago",  send:1 },
  "H-07": { type:"headset", serial:"VX4F-9A4G", status:"failed",  apps:[],                                                                                         sync:"4m ago",  send:1 },
  "H-08": { type:"headset", serial:"VX4F-2H7B", status:"ready",   apps:[{ name:"Simulator Training",            modules:["Range Skills","Validation Course"] }], sync:"2h ago",  send:1 },
  "H-09": { type:"headset", serial:"VX4F-5K3J", status:"ready",   apps:[{ name:"Simulator Training",            modules:["Range Skills","Validation Course"] }], sync:"2h ago",  send:1 },
  "H-10": { type:"headset", serial:"VX4F-0L8M", status:"offline", apps:[],                                                                                         sync:"1d ago",  send:1 },
  "H-11": { type:"headset", serial:"VX4F-4N2P", status:"ready",   apps:[{ name:"vRBT Live Action",              modules:["Urban Patrol","Domestic Call","Traffic Stop"] }], sync:"5h ago",  send:null },
  "H-12": { type:"headset", serial:"VX4F-7Q1R", status:"ready",   apps:[{ name:"vRBT Live Action",              modules:["Urban Patrol","Domestic Call","Traffic Stop"] }], sync:"5h ago",  send:null },
  "H-13": { type:"headset", serial:"VX4F-3S6T", status:"offline", apps:[],                                                                                         sync:"2d ago",  send:null },
  "H-14": { type:"headset", serial:"VX4F-8U0V", status:"ready",   apps:[{ name:"vRBT Live Action",              modules:["Urban Patrol","Bar Fight"] }],           sync:"5h ago",  send:null },
  "H-15": { type:"headset", serial:"VX4F-1W5X", status:"ready",   apps:[{ name:"vRBT Live Action",              modules:["Active Shooter","Foot Pursuit"] }],      sync:"5h ago",  send:null },
  "H-16": { type:"headset", serial:"VX4F-9Y2Z", status:"ready",   apps:[{ name:"TASER Arena",                   modules:["Basic Deployment","Certification Course"] }], sync:"1h ago",  send:null },
  "H-17": { type:"headset", serial:"VX4F-6A8B", status:"ready",   apps:[{ name:"TASER Arena",                   modules:["Basic Deployment","Certification Course"] }], sync:"1h ago",  send:null },
  "H-18": { type:"headset", serial:"VX4F-2C4D", status:"ready",   apps:[{ name:"TASER Arena",                   modules:["Scenario A: Aggressive Subject"] }],    sync:"1h ago",  send:null },
  "H-19": { type:"headset", serial:"VX4F-7E1F", status:"ready",   apps:[{ name:"Simulator Training", modules:["Tactical Clearance"] }, { name:"TASER Arena", modules:["Basic Deployment"] }], sync:"1h ago", send:null },
  "H-20": { type:"headset", serial:"VX4F-3G9H", status:"ready",   apps:[{ name:"Simulator Training", modules:["Range Skills"] }, { name:"vRBT Live Action", modules:["Urban Patrol"] }],     sync:"1h ago", send:null },
  "T-01": { type:"tablet",  serial:"TX2B-5A1C", status:"ready",   apps:[{ name:"Community Engagement Training", modules:["Hard of Hearing","Domestic Violence","Mental Health Crisis"] }], sync:"30m ago", send:2 },
  "T-02": { type:"tablet",  serial:"TX2B-8D3E", status:"ready",   apps:[{ name:"Community Engagement Training", modules:["Hard of Hearing","Domestic Violence"] }],   sync:"30m ago", send:2 },
};

const INIT_SEND_DEVICES = {
  1: ["H-01","H-02","H-03","H-04","H-05","H-06","H-07","H-08","H-09","H-10"],
  2: ["T-01","T-02"],
};

const INIT_APPS = {
  1: [{ id: "ab1-1", appName: "Simulator Training" }],
  2: [{ id: "ab2-1", appName: "Community Engagement Training" }],
};

const INIT_SELECTIONS = {
  "ab1-1": new Set(["Range Skills", "Validation Course"]),
  "ab2-1": new Set(),
};

// ── HELPERS ──────────────────────────────────────────────────────
function getModuleMeta(appName, selections) {
  const mods = APP_MODULE_LIBRARY[appName] || [];
  const sel = selections || new Set();
  const totalSize = [...sel].reduce((acc, n) => {
    const m = mods.find(x => x.name === n);
    return acc + (m ? m.size : 0);
  }, 0);
  return { count: sel.size, total: mods.length, size: totalSize };
}

function buildSendSummary(sendId, sendDevices, sendApps) {
  const devs = sendDevices[sendId] || [];
  const apps = sendApps[sendId] || [];
  const appLabel = apps.length === 0 ? "No apps"
    : apps.length === 1 ? apps[0].appName.split(" ").slice(0, 2).join(" ")
    : `${apps.length} apps`;
  const devLabel = devs.length <= 4 ? devs.join(", ")
    : `${devs[0]}–${devs[devs.length - 1]}`;
  return `${appLabel} → ${devLabel}`;
}

// ── MAIN COMPONENT ────────────────────────────────────────────────
export default function CMS({ onNavigate }) {
  const [groupName, setGroupName]       = useState("Monday Morning Use of Force Training");
  const [openSends, setOpenSends]       = useState(new Set([1]));
  const [sendDevices, setSendDevices]   = useState(INIT_SEND_DEVICES);
  const [sendApps, setSendApps]         = useState(INIT_APPS);
  const [selections, setSelections]     = useState(INIT_SELECTIONS);
  const [selectingSend, setSelectingSend] = useState(null);
  const [devs, setDevs]                 = useState(INIT_DEVS);
  const [selectedDev, setSelectedDev]   = useState(null);
  const [filter, setFilter]             = useState("all");
  const [activePicker, setActivePicker] = useState(null); // { blockId, appName, sendId }
  const [pickerQuery, setPickerQuery]   = useState("");
  const [pushState, setPushState]       = useState({}); // sendId → { status: 'idle'|'pushing'|'done', rows: [], summary: '' }
  const [sendCounter, setSendCounter]   = useState(2);
  const [appCounter, setAppCounter]     = useState(10);
  const [addingApp, setAddingApp]       = useState(null); // sendId currently showing app picker

  // ── Send card toggle ──
  const toggleSend = (id) =>
    setOpenSends(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // ── Device selection mode ──
  const startSelecting = (sn) => setSelectingSend(sn);
  const doneSelecting  = () => setSelectingSend(null);

  const toggleInSend = (id, sn) => {
    setSendDevices(prev => {
      const arr = [...(prev[sn] || [])];
      const i = arr.indexOf(id);
      if (i > -1) { arr.splice(i, 1); }
      else { arr.push(id); }
      return { ...prev, [sn]: arr };
    });
    setDevs(prev => {
      const d = { ...prev[id] };
      const arr = sendDevices[sn] || [];
      d.send = arr.includes(id) ? null : sn; // will be fixed on next render via sendDevices
      return { ...prev, [id]: d };
    });
  };

  const getSend = useCallback((id) => {
    for (const [s, arr] of Object.entries(sendDevices)) {
      if (arr.includes(id)) return parseInt(s);
    }
    return null;
  }, [sendDevices]);

  // ── Picker ──
  const openPicker = (blockId, appName, sendId) => {
    setActivePicker({ blockId, appName, sendId });
    setPickerQuery("");
  };
  const closePicker = () => setActivePicker(null);

  const toggleModule = (blockId, moduleName, checked) => {
    setSelections(prev => {
      const s = new Set(prev[blockId] || []);
      checked ? s.add(moduleName) : s.delete(moduleName);
      return { ...prev, [blockId]: s };
    });
  };

  const pickerSelectAll = () => {
    if (!activePicker) return;
    const { blockId, appName } = activePicker;
    const mods = (APP_MODULE_LIBRARY[appName] || []).filter(m =>
      !pickerQuery || m.name.toLowerCase().includes(pickerQuery.toLowerCase())
    );
    setSelections(prev => {
      const s = new Set(prev[blockId] || []);
      mods.forEach(m => s.add(m.name));
      return { ...prev, [blockId]: s };
    });
  };

  const pickerClearAll = () => {
    if (!activePicker) return;
    const { blockId, appName } = activePicker;
    const mods = (APP_MODULE_LIBRARY[appName] || []).filter(m =>
      !pickerQuery || m.name.toLowerCase().includes(pickerQuery.toLowerCase())
    );
    setSelections(prev => {
      const s = new Set(prev[blockId] || []);
      mods.forEach(m => s.delete(m.name));
      return { ...prev, [blockId]: s };
    });
  };

  // ── App blocks ──
  const removeApp = (blockId, sendId) => {
    setSendApps(prev => ({ ...prev, [sendId]: (prev[sendId] || []).filter(a => a.id !== blockId) }));
    setSelections(prev => { const n = { ...prev }; delete n[blockId]; return n; });
    if (activePicker?.blockId === blockId) closePicker();
  };

  const confirmAddApp = (sendId, appName) => {
    const blockId = `ab${sendId}-${appCounter + 1}`;
    setAppCounter(c => c + 1);
    setSendApps(prev => ({ ...prev, [sendId]: [...(prev[sendId] || []), { id: blockId, appName }] }));
    setSelections(prev => ({ ...prev, [blockId]: new Set() }));
    setAddingApp(null);
  };

  // ── Push simulation ──
  const pushSend = (sn) => {
    const dList = sendDevices[sn] || [];
    const online = dList.filter(id => devs[id]?.status !== "offline");
    const willFail = sn === 1 ? ["H-07"] : [];

    // Set devices to loading
    setDevs(prev => {
      const n = { ...prev };
      online.forEach(id => { n[id] = { ...n[id], status: "loading" }; });
      return n;
    });

    const rows = dList.map(id => ({
      id,
      offline: devs[id]?.status === "offline",
      fail: willFail.includes(id),
      pct: devs[id]?.status === "offline" ? 0 : 4,
      done: false,
    }));

    setPushState(prev => ({ ...prev, [sn]: { status: "pushing", rows, summary: "" } }));

    let tick = 0;
    const timer = setInterval(() => {
      tick++;
      setPushState(prev => {
        const state = prev[sn];
        if (!state) return prev;
        const updated = state.rows.map(r => {
          if (r.offline || r.done) return r;
          const pct = r.fail ? Math.min(tick * 7, 20) : Math.min(tick * 13, 100);
          return { ...r, pct };
        });
        return { ...prev, [sn]: { ...state, rows: updated } };
      });

      if (tick >= 8) {
        clearInterval(timer);
        setDevs(prev => {
          const n = { ...prev };
          online.forEach(id => {
            if (willFail.includes(id)) { n[id] = { ...n[id], status: "failed" }; }
            else { n[id] = { ...n[id], status: "ready", sync: "just now" }; }
          });
          return n;
        });
        const fc = willFail.filter(id => online.includes(id)).length;
        const rc = online.length - fc;
        const summary = fc
          ? `${rc} of ${online.length} ready — ${fc} failed`
          : `✓ All ${online.length} devices ready`;
        setPushState(prev => {
          const state = prev[sn];
          if (!state) return prev;
          const done = state.rows.map(r => ({ ...r, pct: r.fail ? 20 : (r.offline ? 0 : 100), done: true }));
          return { ...prev, [sn]: { status: "done", rows: done, summary, hasFail: fc > 0, failId: willFail[0] } };
        });
      }
    }, 200);
  };

  const repushDev = (id) => {
    setDevs(prev => ({ ...prev, [id]: { ...prev[id], status: "loading" } }));
    let p = 8;
    const t = setInterval(() => {
      p = Math.min(p + 16, 100);
      if (p >= 100) {
        clearInterval(t);
        setDevs(prev => ({
          ...prev,
          [id]: { ...prev[id], status: "ready", sync: "just now",
            apps: [{ name: "Simulator Training", modules: ["Range Skills", "Validation Course"] }] }
        }));
      }
    }, 160);
  };

  // ── Fleet filter ──
  const allDevEntries = Object.entries(devs);
  const headsets = allDevEntries.filter(([, d]) => d.type === "headset");
  const tablets  = allDevEntries.filter(([, d]) => d.type === "tablet");
  const passFilter = (d) => {
    if (filter === "headsets") return d.type === "headset";
    if (filter === "tablets")  return d.type === "tablet";
    if (filter === "failed")   return d.status === "failed";
    return true;
  };

  const counts = {
    ready:   allDevEntries.filter(([,d]) => d.status === "ready").length,
    offline: allDevEntries.filter(([,d]) => d.status === "offline").length,
    failed:  allDevEntries.filter(([,d]) => d.status === "failed").length,
    loading: allDevEntries.filter(([,d]) => d.status === "loading").length,
  };

  // ── Picker data ──
  const pickerMods = activePicker
    ? (APP_MODULE_LIBRARY[activePicker.appName] || []).filter(m =>
        !pickerQuery || m.name.toLowerCase().includes(pickerQuery.toLowerCase()))
    : [];
  const pickerSel = activePicker ? (selections[activePicker.blockId] || new Set()) : new Set();
  const pickerTotalGB = [...pickerSel].reduce((acc, n) => {
    const m = (APP_MODULE_LIBRARY[activePicker?.appName] || []).find(x => x.name === n);
    return acc + (m ? m.size : 0);
  }, 0);
  const storagePct = Math.min((pickerTotalGB / DEVICE_STORAGE_GB) * 100, 100);
  const storageClass = storagePct > 90 ? "vr-storage-fill--over" : storagePct > 70 ? "vr-storage-fill--warn" : "";
  const storageUsedClass = storagePct > 90 ? "vr-storage-used--over" : storagePct > 70 ? "vr-storage-used--warn" : "";

  // ── Render device tile ──
  const renderTile = (id, d) => {
    if (!passFilter(d)) return null;
    const sendNum = getSend(id);
    const inCurrentSend = selectingSend !== null && (sendDevices[selectingSend] || []).includes(id);
    const inOtherSend = selectingSend !== null && sendNum !== null && sendNum !== selectingSend;
    const shortSerial = d.serial ? d.serial.split("-")[1] : "";
    let cls = `vr-tile vr-tile--${d.status}`;
    if (id === selectedDev) cls += " vr-tile--sel";
    if (inCurrentSend && selectingSend !== null) cls += " vr-tile--in-send";
    if (inOtherSend) cls += " vr-tile--unavail";

    const handleClick = () => {
      if (selectingSend !== null) { toggleInSend(id, selectingSend); return; }
      setSelectedDev(id);
    };

    return (
      <div key={id} className={cls} onClick={handleClick}>
        <div className="vr-tile-status-dot" style={{ background: DOT_COLORS[d.status] }} />
        {sendNum && <div className={`vr-tile-badge${sendNum === 2 ? " vr-tile-badge--s2" : ""}`}>{sendNum}</div>}
        <div className="vr-tile-icon">{d.type === "tablet" ? "📱" : "🥽"}</div>
        <div className="vr-tile-name">{id}</div>
        <div className="vr-tile-serial">{shortSerial}</div>
      </div>
    );
  };

  // ── Device detail ──
  const selDev = selectedDev ? devs[selectedDev] : null;

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Page header */}
      <div style={{ background: "var(--vr-surface)", borderBottom: "1px solid var(--vr-border)", padding: "11px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--vr-text)", margin: 0 }}>{__("Content Management")}</p>
          <p style={{ fontSize: 12, color: "var(--vr-dim)", margin: "2px 0 0" }}>{__("Choose devices, select content, and push to your fleet")}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="vr-btn-secondary" style={{ fontSize: 12, padding: "5px 12px" }}>{__("View History")}</button>
          <button className="vr-btn-primary" style={{ fontSize: 12, padding: "5px 12px" }}>+ {__("New Push Group")}</button>
        </div>
      </div>

    <div className="vr-cms" style={{ flex: 1 }}>

      {/* ── LEFT: PUSH GROUP BUILDER ── */}
      <div className="vr-cms-left">

        {/* Module picker — swaps in when an app block is tapped */}
        <div className={`vr-cms-picker${activePicker ? " vr-cms-picker--vis" : ""}`}>
          <div className="vr-picker-header">
            <button className="vr-picker-back" onClick={closePicker}>
              ← {__("Push Group Builder")}
            </button>
            <p className="vr-picker-app-name">{activePicker?.appName}</p>
            <p className="vr-picker-send-label">{__("Send")} {activePicker?.sendId}</p>
          </div>

          <div className="vr-picker-search-wrap">
            <span className="vr-picker-search-icon">🔍</span>
            <input
              className="vr-picker-search"
              type="text"
              placeholder={__("Search modules…")}
              value={pickerQuery}
              onChange={e => setPickerQuery(e.target.value)}
            />
          </div>

          <div className="vr-picker-bulk-row">
            <button className="vr-picker-bulk-btn" onClick={pickerSelectAll}>{__("Select All")}</button>
            <span style={{ color: "var(--vr-border-hover)" }}>·</span>
            <button className="vr-picker-bulk-btn" onClick={pickerClearAll}>{__("Clear All")}</button>
            <span className="vr-picker-count">
              {pickerSel.size} {__("of")} {(APP_MODULE_LIBRARY[activePicker?.appName] || []).length} {__("modules")}
            </span>
          </div>

          <div className="vr-picker-list">
            {pickerMods.length === 0
              ? <p className="vr-picker-no-results">{__("No modules match")}</p>
              : pickerMods.map(m => (
                  <div key={m.name} className="vr-picker-module-row"
                    onClick={() => toggleModule(activePicker.blockId, m.name, !pickerSel.has(m.name))}>
                    <input
                      type="checkbox"
                      checked={pickerSel.has(m.name)}
                      onChange={e => toggleModule(activePicker.blockId, m.name, e.target.checked)}
                      onClick={e => e.stopPropagation()}
                    />
                    <span className="vr-picker-module-label">{m.name}</span>
                    <span className="vr-picker-module-size">{m.size.toFixed(1)} GB</span>
                  </div>
                ))
            }
          </div>

          <div className="vr-picker-footer">
            <button className="vr-push-btn" style={{ marginBottom: 10 }} onClick={closePicker}>
              ✓ {__("Done")}
            </button>
            <div className="vr-storage-track">
              <div className={`vr-storage-fill ${storageClass}`} style={{ width: `${storagePct}%` }} />
            </div>
            <div className="vr-storage-labels">
              <span className={`vr-storage-used ${storageUsedClass}`}>{pickerTotalGB.toFixed(1)} GB {__("selected")}</span>
              <span>{__("of")} {DEVICE_STORAGE_GB} GB</span>
            </div>
          </div>
        </div>

        {/* Builder view — hidden when picker open */}
        <div className="vr-cms-builder" style={{ display: activePicker ? "none" : "flex" }}>
          <div className="vr-cms-col-header">
            <p className="vr-cms-col-title">{__("Push Group Builder")}</p>
          </div>
          <div className="vr-cms-scroll">

            {/* Push group name */}
            <div style={{ marginBottom: 14 }}>
              <p className="vr-send-field-label" style={{ marginBottom: 6 }}>{__("Push Group Name")}</p>
              <input
                className="vr-cms-name-input"
                type="text"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
              />
            </div>

            {/* Send cards */}
            {[1, 2].map(sn => {
              const isOpen = openSends.has(sn);
              const apps   = sendApps[sn] || [];
              const devList = sendDevices[sn] || [];
              const ps     = pushState[sn];

              return (
                <div key={sn} className={`vr-send-card${selectingSend === sn ? " vr-send-card--selecting" : ""}`}>
                  <div className="vr-send-card-header" onClick={() => toggleSend(sn)}>
                    <div>
                      <p className="vr-send-num">{__("Send")} {sn}</p>
                      <p className="vr-send-summary">
                        {buildSendSummary(sn, sendDevices, sendApps)}
                      </p>
                    </div>
                    <span className={`vr-send-chevron${isOpen ? " vr-send-chevron--open" : ""}`}>▾</span>
                  </div>

                  {isOpen && (
                    <div className="vr-send-body">

                      {/* Devices */}
                      <div className="vr-send-field">
                        <p className="vr-send-field-label">
                          {__("Devices")}
                          <span style={{ color: "var(--vr-dim)", fontWeight: 400, fontSize: 10, marginLeft: 6 }}>
                            — {devList.length} {__("selected")}
                          </span>
                        </p>
                        <div className="vr-chip-row" style={{ marginTop: 5 }}>
                          {devList.map(id => {
                            const st = devs[id]?.status;
                            const cls = st === "failed" ? "vr-chip vr-chip--fail"
                              : sn === 2 ? "vr-chip vr-chip--s2" : "vr-chip";
                            return (
                              <span key={id} className={cls} onClick={() => setSelectedDev(id)}>
                                {id}
                              </span>
                            );
                          })}
                        </div>
                        <div style={{ marginTop: 7 }}>
                          <button
                            className={`vr-btn-secondary${selectingSend === sn ? " vr-btn-editing" : ""}`}
                            style={{ fontSize: 12, padding: "5px 10px" }}
                            onClick={() => selectingSend === sn ? doneSelecting() : startSelecting(sn)}
                          >
                            {selectingSend === sn ? `✓ ${__("Done Editing")}` : `✎ ${__("Edit Devices")}`}
                          </button>
                        </div>
                      </div>

                      {/* Apps */}
                      <div className="vr-send-field">
                        <p className="vr-send-field-label">{__("Apps")}</p>
                        {apps.map(({ id: blockId, appName }) => {
                          const meta = getModuleMeta(appName, selections[blockId]);
                          const isActive = activePicker?.blockId === blockId;
                          const metaStr = meta.count === 0
                            ? `0 ${__("of")} ${meta.total} ${__("selected")}`
                            : `${meta.count} ${__("of")} ${meta.total} · ${meta.size.toFixed(1)} GB`;
                          return (
                            <div key={blockId} className="vr-app-block">
                              <div
                                className={`vr-app-block-row${isActive ? " vr-app-block-row--active" : ""}`}
                                onClick={() => openPicker(blockId, appName, sn)}
                              >
                                <span className={`vr-app-block-icon${isActive ? " vr-app-block-icon--active" : ""}`}>
                                  {isActive ? "◆" : "◈"}
                                </span>
                                <span className="vr-app-block-name">{appName}</span>
                                <span className={`vr-app-block-meta${meta.count > 0 ? " vr-app-block-meta--set" : ""}`}>
                                  {metaStr}
                                </span>
                                <button className="vr-app-block-remove" onClick={e => { e.stopPropagation(); removeApp(blockId, sn); }}>✕</button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Add app */}
                        {addingApp === sn ? (
                          <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                            <select
                              id={`app-select-${sn}`}
                              style={{ flex: 1, padding: "7px 10px", border: "1.5px solid var(--vr-info)", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "var(--vr-text)", background: "var(--vr-surface)", outline: "none", fontFamily: "inherit" }}
                            >
                              <option value="" disabled selected>{__("Select an app…")}</option>
                              {Object.keys(APP_MODULE_LIBRARY)
                                .filter(a => !apps.find(b => b.appName === a))
                                .map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <button className="vr-btn-primary" style={{ padding: "7px 12px", fontSize: 12 }}
                              onClick={() => {
                                const sel = document.getElementById(`app-select-${sn}`);
                                if (sel?.value) confirmAddApp(sn, sel.value);
                              }}>
                              {__("Add")}
                            </button>
                            <button className="vr-btn-ghost" style={{ padding: "7px 10px", fontSize: 12 }}
                              onClick={() => setAddingApp(null)}>✕</button>
                          </div>
                        ) : (
                          <button className="vr-add-dashed" style={{ marginTop: 4 }} onClick={() => setAddingApp(sn)}>
                            ＋ {__("Add App")}
                          </button>
                        )}
                      </div>

                      {/* Push */}
                      <div className="vr-push-area">
                        {(!ps || ps.status === "idle") && (
                          <button className={`vr-push-btn${sn === 2 ? " vr-push-btn--s2" : ""}`} onClick={() => pushSend(sn)}>
                            <FileUploadIcon style={{ width: 15, height: 15 }} />
                            {__("Push to")} {devList.filter(id => devs[id]?.type === "headset").length > 0
                              ? `${devList.filter(id => devs[id]?.status !== "offline").length} ${__("headsets")}`
                              : `${devList.length} ${__("tablets")}`}
                          </button>
                        )}
                        {ps && (ps.status === "pushing" || ps.status === "done") && (
                          <>
                            <div className="vr-progress-list">
                              {ps.rows.map(r => (
                                <div key={r.id} className="vr-progress-row">
                                  <span className="vr-prog-name">{r.id}</span>
                                  <div className="vr-prog-track">
                                    <div
                                      className={`vr-prog-fill${r.offline ? " vr-prog-fill--fail" : r.fail && r.done ? " vr-prog-fill--fail" : r.done && !r.fail ? " vr-prog-fill--done" : " vr-prog-fill--loading"}`}
                                      style={{ width: `${r.pct}%` }}
                                    />
                                  </div>
                                  <span className="vr-prog-status">
                                    {r.offline ? <span className="vr-prog-fail">{__("Offline")}</span>
                                      : r.done && r.fail ? <span className="vr-prog-fail">{__("Failed")}</span>
                                      : r.done ? <span className="vr-prog-ok">✓</span>
                                      : <span className="vr-prog-ld">{r.pct}%</span>}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {ps.status === "done" && (
                              <div className={`vr-push-result${ps.hasFail ? " vr-push-result--fail" : ""}`}>
                                <span style={ps.hasFail ? {} : { color: "var(--vr-positive)", fontWeight: 600 }}>
                                  {ps.summary}
                                </span>
                                {ps.hasFail && ps.failId && (
                                  <button className="vr-repush-link" onClick={() => repushDev(ps.failId)}>
                                    {__("Re-push")} {ps.failId}
                                  </button>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}

            <button className="vr-add-send-btn">＋ {__("Add Send")}</button>
          </div>
        </div>
      </div>

      {/* ── RIGHT: FLEET ── */}
      <div className="vr-cms-right">
        <div className="vr-cms-col-header">
          <p className="vr-cms-col-title">{__("Fleet")}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {selectingSend !== null && (
              <span style={{ fontSize: 12, color: "var(--vr-info)", fontWeight: 500 }}>
                {__("Editing Send")} {selectingSend}
              </span>
            )}
            <button className="vr-btn-ghost" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => onNavigate("fleet")}>
              {__("Device Management")} →
            </button>
          </div>
        </div>

        {/* Status topbar */}
        <div className="vr-fleet-topbar">
          <div className="vr-fleet-status-pill">
            <div className="vr-fleet-dot vr-fleet-dot--ready" />
            <span>{counts.ready} {__("ready")}</span>
          </div>
          {counts.loading > 0 && (
            <div className="vr-fleet-status-pill">
              <div className="vr-fleet-dot vr-fleet-dot--loading" />
              <span>{counts.loading} {__("loading")}</span>
            </div>
          )}
          <div className="vr-fleet-status-pill">
            <div className="vr-fleet-dot vr-fleet-dot--offline" />
            <span>{counts.offline} {__("offline")}</span>
          </div>
          <div className="vr-fleet-status-pill">
            <div className="vr-fleet-dot vr-fleet-dot--failed" />
            <span>{counts.failed} {__("failed")}</span>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <button className="vr-btn-ghost" style={{ fontSize: 12, padding: "5px 10px" }}>
              <SyncIcon style={{ width: 13, height: 13 }} /> {__("Refresh")}
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="vr-fleet-filters">
          {[["all", `${__("All")} (${allDevEntries.length})`], ["headsets", `${__("Headsets")} (${headsets.length})`], ["tablets", `${__("Tablets")} (${tablets.length})`], ["failed", `${__("Failed")} (${counts.failed})`]].map(([f, label]) => (
            <button key={f} className={`vr-fleet-filter-btn${filter === f ? " vr-fleet-filter-btn--active" : ""}`}
              onClick={() => setFilter(f)}>
              {label}
            </button>
          ))}
        </div>

        {/* Master / detail split */}
        <div className="vr-fleet-body">

          {/* Grid */}
          <div className="vr-fleet-grid-area">
            {selectingSend !== null && (
              <div className="vr-selecting-banner vr-selecting-banner--vis">
                <div className="vr-selecting-banner-dot" />
                <span>{__("Editing Send")} {selectingSend} — {__("tap tiles to add or remove")}</span>
              </div>
            )}
            <div>
              <p className="vr-fleet-section-label" style={{ display: filter === "tablets" ? "none" : "block" }}>{__("Headsets")}</p>
              <div className="vr-device-grid" style={{ display: filter === "tablets" ? "none" : "grid" }}>
                {headsets.map(([id, d]) => renderTile(id, d))}
              </div>
            </div>
            <div>
              <p className="vr-fleet-section-label" style={{ display: filter === "headsets" || filter === "failed" ? "none" : "block" }}>{__("Tablets")}</p>
              <div className="vr-device-grid" style={{ display: filter === "headsets" || filter === "failed" ? "none" : "grid" }}>
                {tablets.map(([id, d]) => renderTile(id, d))}
              </div>
            </div>
          </div>

          {/* Detail panel */}
          <div className="vr-fleet-detail">
            {!selDev ? (
              <div className="vr-detail-placeholder">
                <div className="vr-detail-placeholder-icon">🥽</div>
                <p className="vr-detail-placeholder-text">{__("Select a device to view its status and content")}</p>
              </div>
            ) : (
              <>
                <div className="vr-detail-content vr-detail-content--vis">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                    <div>
                      <p className="vr-detail-dname">{selectedDev}</p>
                      <p className="vr-detail-serial">{selDev.serial}</p>
                      <p className="vr-detail-dtype">{selDev.type.charAt(0).toUpperCase() + selDev.type.slice(1)}</p>
                    </div>
                    <button className="vr-detail-close" onClick={() => setSelectedDev(null)}>✕</button>
                  </div>

                  <div className="vr-detail-section">
                    <p className="vr-section-label">{__("Status")}</p>
                    <span className={`vr-stamp-${selDev.status === "ready" ? "green" : selDev.status === "failed" ? "red" : selDev.status === "loading" ? "blue" : ""}`}
                      style={selDev.status === "offline" ? { background: "rgba(54,57,61,0.07)", color: "var(--vr-dim)" } : {}}>
                      {selDev.status.charAt(0).toUpperCase() + selDev.status.slice(1)}
                    </span>
                  </div>

                  <div className="vr-detail-section">
                    <p className="vr-section-label">{__("Apps on Device")}</p>
                    {selDev.apps && selDev.apps.length > 0
                      ? selDev.apps.map((app, i) => (
                          <div key={i} className="vr-detail-app-row">
                            <p className="vr-detail-app-name">{app.name}</p>
                            <div className="vr-detail-modules">
                              {app.modules?.length > 0
                                ? app.modules.map(m => <span key={m} className="vr-detail-mod-tag">{m}</span>)
                                : <span className="vr-caption" style={{ fontStyle: "italic" }}>{__("App only")}</span>}
                            </div>
                          </div>
                        ))
                      : <span className="vr-caption" style={{ fontStyle: "italic" }}>{__("No apps loaded")}</span>
                    }
                  </div>

                  <div className="vr-detail-section">
                    <p className="vr-section-label">{__("Last Sync")}</p>
                    <p className="vr-detail-sync">{selDev.sync}</p>
                  </div>
                </div>

                {selDev.status === "failed" && (
                  <div className="vr-detail-footer vr-detail-footer--vis">
                    <button className="vr-push-btn" style={{ background: "var(--vr-alert)" }}
                      onClick={() => repushDev(selectedDev)}>
                      ↑ {__("Re-push to")} {selectedDev}
                    </button>
                  </div>
                )}
                {selDev.status === "offline" && (
                  <div className="vr-detail-footer vr-detail-footer--vis">
                    <p className="vr-caption" style={{ textAlign: "center", padding: "4px 0" }}>{__("Device is offline")}</p>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
    </div>
  );
}
