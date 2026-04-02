import { useState } from "react";
import { FilterOutlineIcon, FileDownloadIcon } from "@axon-enterprise/icon";

const mockSessions = [
  { officer: "Adams, Jordan",     scenario: "Traffic Stop I: Sovereign Citizen",    type: "vRBT",              date: "Mar 22, 2026", status: "Completed"  },
  { officer: "Barnes, Chris",     scenario: "Mental Health Crisis",                 type: "Verbal Skills",     date: "Mar 22, 2026", status: "Completed"  },
  { officer: "Santos, Maria",     scenario: "Traffic Stop I: Sovereign Citizen",    type: "vRBT",              date: "Mar 21, 2026", status: "Completed"  },
  { officer: "Washington, Dana",  scenario: "Domestic Disturbance II",              type: "vRBT",              date: "Mar 21, 2026", status: "Completed"  },
  { officer: "Evans, Robin",      scenario: "Room Clearing",                        type: "Tactical Clearance",date: "Mar 21, 2026", status: "Completed"  },
  { officer: "Chen, Wei",         scenario: "Human Trafficking Recognition",        type: "CET",               date: "Mar 21, 2026", status: "Completed"  },
  { officer: "Foster, Ryan",      scenario: "Building Search",                      type: "Tactical Clearance",date: "Mar 20, 2026", status: "Completed"  },
  { officer: "Carter, James",     scenario: "Domestic Disturbance I",               type: "vRBT",              date: "Mar 20, 2026", status: "Completed"  },
  { officer: "Grant, Marcus",     scenario: "Bar Altercation",                      type: "vRBT",              date: "Mar 20, 2026", status: "Completed"  },
  { officer: "Hayes, Jordan",     scenario: "Active Shooter Response",              type: "Tactical Clearance",date: "Mar 20, 2026", status: "Incomplete" },
  { officer: "Ingram, Devon",     scenario: "Traffic Stop III: High Risk",          type: "vRBT",              date: "Mar 19, 2026", status: "Completed"  },
  { officer: "Hollis, Derek",     scenario: "Noise Complaint",                      type: "Verbal Skills",     date: "Mar 19, 2026", status: "Completed"  },
  { officer: "Jackson, Simone",   scenario: "Domestic Disturbance I",               type: "vRBT",              date: "Mar 19, 2026", status: "Completed"  },
  { officer: "Kim, Alex",         scenario: "Room Clearing",                        type: "Tactical Clearance",date: "Mar 19, 2026", status: "Incomplete" },
  { officer: "Lewis, Morgan",     scenario: "Excited Delirium Response",            type: "Verbal Skills",     date: "Mar 19, 2026", status: "Completed"  },
  { officer: "Martin, Chris",     scenario: "Handgun Targets",                      type: "Range Skills",      date: "Mar 18, 2026", status: "Completed"  },
  { officer: "Nair, Priya",       scenario: "Human Trafficking Recognition",        type: "CET",               date: "Mar 18, 2026", status: "Completed"  },
  { officer: "Okafor, Emeka",     scenario: "Traffic Stop II: DUI Stop",            type: "vRBT",              date: "Mar 18, 2026", status: "Completed"  },
  { officer: "Patel, Anika",      scenario: "Mental Health Crisis",                 type: "Verbal Skills",     date: "Mar 18, 2026", status: "Completed"  },
  { officer: "Quinn, Reese",      scenario: "Armed Suspect — Vehicle Stop",         type: "vRBT",              date: "Mar 18, 2026", status: "Incomplete" },
  { officer: "Reed, Taylor",      scenario: "Bar Altercation",                      type: "vRBT",              date: "Mar 17, 2026", status: "Completed"  },
  { officer: "Silva, Diego",      scenario: "Domestic Violence Response",           type: "CET",               date: "Mar 17, 2026", status: "Completed"  },
  { officer: "Torres, Miguel",    scenario: "Building Search",                      type: "Tactical Clearance",date: "Mar 17, 2026", status: "Completed"  },
  { officer: "Underwood, Blake",  scenario: "Noise Complaint",                      type: "Verbal Skills",     date: "Mar 17, 2026", status: "Completed"  },
  { officer: "Vargas, Elena",     scenario: "Traffic Stop I: Sovereign Citizen",    type: "vRBT",              date: "Mar 17, 2026", status: "Completed"  },
  { officer: "Walker, Sam",       scenario: "Rifle Targets",                        type: "Range Skills",      date: "Mar 16, 2026", status: "Completed"  },
  { officer: "Xavier, Jordan",    scenario: "Active Shooter Response",              type: "Tactical Clearance",date: "Mar 16, 2026", status: "Incomplete" },
  { officer: "Young, Casey",      scenario: "Domestic Disturbance II",              type: "vRBT",              date: "Mar 16, 2026", status: "Completed"  },
  { officer: "Zhang, Wei",        scenario: "Excited Delirium Response",            type: "Verbal Skills",     date: "Mar 16, 2026", status: "Completed"  },
  { officer: "Allen, Marcus",     scenario: "Handgun Targets",                      type: "Range Skills",      date: "Mar 15, 2026", status: "Completed"  },
  { officer: "Baker, Tanya",      scenario: "Traffic Stop III: High Risk",          type: "vRBT",              date: "Mar 15, 2026", status: "Completed"  },
  { officer: "Coleman, Darius",   scenario: "Room Clearing",                        type: "Tactical Clearance",date: "Mar 15, 2026", status: "Completed"  },
  { officer: "Dixon, Paige",      scenario: "Mental Health Crisis",                 type: "Verbal Skills",     date: "Mar 15, 2026", status: "Incomplete" },
  { officer: "Edwards, Marcus",   scenario: "Human Trafficking Recognition",        type: "CET",               date: "Mar 15, 2026", status: "Completed"  },
  { officer: "Fleming, Jade",     scenario: "Domestic Disturbance I",               type: "vRBT",              date: "Mar 14, 2026", status: "Completed"  },
  { officer: "Gomez, Rafael",     scenario: "Traffic Stop II: DUI Stop",            type: "vRBT",              date: "Mar 14, 2026", status: "Completed"  },
  { officer: "Harris, Leona",     scenario: "Bar Altercation",                      type: "vRBT",              date: "Mar 14, 2026", status: "Completed"  },
  { officer: "Ingram, Devon",     scenario: "Rifle Transitions",                    type: "Range Skills",      date: "Mar 14, 2026", status: "Completed"  },
  { officer: "James, Serena",     scenario: "Building Search",                      type: "Tactical Clearance",date: "Mar 14, 2026", status: "Incomplete" },
  { officer: "Knox, Terrell",     scenario: "Noise Complaint",                      type: "Verbal Skills",     date: "Mar 13, 2026", status: "Completed"  },
  { officer: "Lawson, Brianna",   scenario: "Armed Suspect — Vehicle Stop",         type: "vRBT",              date: "Mar 13, 2026", status: "Completed"  },
  { officer: "Mason, Troy",       scenario: "Traffic Stop I: Sovereign Citizen",    type: "vRBT",              date: "Mar 13, 2026", status: "Completed"  },
  { officer: "Nelson, Gabrielle", scenario: "Domestic Violence Response",           type: "CET",               date: "Mar 13, 2026", status: "Completed"  },
  { officer: "Ortega, Felipe",    scenario: "Active Shooter Response",              type: "Tactical Clearance",date: "Mar 12, 2026", status: "Completed"  },
  { officer: "Pierce, Monique",   scenario: "Excited Delirium Response",            type: "Verbal Skills",     date: "Mar 12, 2026", status: "Incomplete" },
  { officer: "Reyes, Carlos",     scenario: "Handgun Targets",                      type: "Range Skills",      date: "Mar 12, 2026", status: "Completed"  },
  { officer: "Stone, Alexis",     scenario: "Domestic Disturbance II",              type: "vRBT",              date: "Mar 12, 2026", status: "Completed"  },
  { officer: "Thomas, Keisha",    scenario: "Traffic Stop III: High Risk",          type: "vRBT",              date: "Mar 11, 2026", status: "Completed"  },
  { officer: "Upton, Miles",      scenario: "Room Clearing",                        type: "Tactical Clearance",date: "Mar 11, 2026", status: "Completed"  },
  { officer: "Vega, Natalia",     scenario: "Mental Health Crisis",                 type: "Verbal Skills",     date: "Mar 11, 2026", status: "Completed"  },
  { officer: "Warren, Devon",     scenario: "Human Trafficking Recognition",        type: "CET",               date: "Mar 11, 2026", status: "Incomplete" },
  { officer: "Xu, Linda",         scenario: "Bar Altercation",                      type: "vRBT",              date: "Mar 10, 2026", status: "Completed"  },
  { officer: "York, Preston",     scenario: "Rifle Targets",                        type: "Range Skills",      date: "Mar 10, 2026", status: "Completed"  },
  { officer: "Zimmerman, Sara",   scenario: "Traffic Stop II: DUI Stop",            type: "vRBT",              date: "Mar 10, 2026", status: "Completed"  },
];

function Checkbox({ checked, indeterminate, onChange }) {
  const active = checked || indeterminate;
  return (
    <div
      onClick={e => { e.stopPropagation(); onChange(); }}
      style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        border: `1.5px solid ${active ? "var(--vr-info)" : "var(--vr-border-hover)"}`,
        background: checked ? "var(--vr-info)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.12s ease",
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {indeterminate && !checked && (
        <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
          <path d="M1 1H7" stroke="var(--vr-info)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

export default function AfterActionReviews() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const allSelected = selected.size === mockSessions.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(mockSessions.map((_, i) => i)));
    }
  }

  function toggleRow(i) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function handleExport() {
    const rows = [...selected].sort((a, b) => a - b).map(i => mockSessions[i]);
    console.log("Exporting", rows.length, "sessions:", rows);
  }

  return (
    <div className="vr-sub-page">

      <div className="vr-sub-header">
        <p className="vr-body">
          {__("Review completed VR training sessions and performance outcomes across your team.")}
        </p>
        <div className="vr-row">
          <button className="vr-btn-secondary" onClick={() => setFilterOpen(v => !v)}>
            <FilterOutlineIcon style={{ width: 15, height: 15 }} />
            {__("Filter")}
          </button>
          <button
            className="vr-btn-secondary"
            onClick={() => {
              console.log("Exporting all", mockSessions.length, "sessions:", mockSessions);
            }}
          >
            <FileDownloadIcon style={{ width: 15, height: 15 }} />
            {__("Export All")}
          </button>
          <button
            className="vr-btn-primary"
            onClick={handleExport}
            disabled={selected.size === 0}
            style={{ opacity: selected.size === 0 ? 0.4 : 1 }}
          >
            <FileDownloadIcon style={{ width: 15, height: 15 }} />
            {selected.size > 0 ? `Export (${selected.size})` : __("Export Selected")}
          </button>
        </div>
      </div>

      <div className="vr-kpi-grid">
        {[
          { value: "284",  label: __("Sessions this month") },
          { value: "87%",  label: __("Avg. completion rate") },
          { value: "51",   label: __("Officers trained") },
          { value: "14m",  label: __("Avg. session time") },
        ].map(k => (
          <div key={k.label} className="vr-kpi-card">
            <div className="vr-kpi-value">{k.value}</div>
            <div className="vr-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {filterOpen && (
        <div className="vr-panel">
          <div className="vr-panel-body">
            <div className="vr-row">
              <span className="vr-caption" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{__("Filters:")}</span>
              {[__("All Officers"), __("Last 30 days"), __("All Scenarios"), __("All Statuses")].map(f => (
                <button key={f} className="vr-btn-ghost">{f}</button>
              ))}
              <button className="vr-btn-ghost" onClick={() => setFilterOpen(false)}>{__("Clear")}</button>
            </div>
          </div>
        </div>
      )}

      <div className="vr-panel">
        <div className="vr-panel-header">
          <p className="vr-panel-title">{__("Recent Sessions")}</p>
          <div className="vr-row" style={{ gap: 12 }}>
            <span className="vr-stamp-blue">
              {selected.size > 0 ? `${selected.size} selected` : __("54 sessions")}
            </span>
            <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
          </div>
        </div>
        <div className="vr-panel-body" style={{ padding: "0 20px", maxHeight: 480, overflowY: "auto" }}>
          {mockSessions.map((s, i) => (
            <div
              key={i}
              className="vr-list-row"
              onClick={() => toggleRow(i)}
              style={{
                background: selected.has(i) ? "var(--color-axon-accent-dim)" : "transparent",
                cursor: "pointer",
                margin: "0 -20px",
                padding: "12px 20px",
              }}
            >
              <div className="vr-row" style={{ gap: 12, flex: 1, minWidth: 0 }}>
                <div className="vr-col">
                  <span className="vr-body-sm">{s.officer}</span>
                  <span className="vr-caption">{s.type}: {s.scenario}</span>
                </div>
              </div>
              <div className="vr-row vr-row--gap-l" style={{ alignItems: "center", flexShrink: 0 }}>
                <span className="vr-caption" style={{ minWidth: 90, textAlign: "right" }}>{s.date}</span>
                <span className={s.status === "Completed" ? "vr-stamp-green" : "vr-stamp-red"} style={{ minWidth: 90, textAlign: "center" }}>{s.status}</span>
                <Checkbox checked={selected.has(i)} onChange={() => toggleRow(i)} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
