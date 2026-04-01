import { useState, useMemo } from "react";
import { SearchIcon } from "@axon-enterprise/icon";

/* ─── Scenario catalog ──────────────────────────────────────── */
const scenarioCatalog = [
  { id:"s1",  name:"Traffic Stop I: Sovereign Citizen", app:"vRBT",              topic:"Traffic Stops",  duration:"12 min", desc:"A routine stop escalates when the driver claims not to be subject to traffic law.",                              tags:["sovereign citizen","verbal de-escalation"],    weapons:["taser","handgun"] },
  { id:"s2",  name:"Traffic Stop II: DUI Stop",         app:"vRBT",              topic:"Traffic Stops",  duration:"10 min", desc:"Identify and manage a visibly impaired driver while ensuring officer and public safety.",                      tags:["DUI","sobriety check","officer safety"],       weapons:["taser","handgun"] },
  { id:"s3",  name:"Traffic Stop III: High Risk",       app:"vRBT",              topic:"Traffic Stops",  duration:"14 min", desc:"A felony stop requires proper positioning, commands, and force readiness under pressure.",                      tags:["felony stop","officer safety"],                weapons:["taser","handgun","rifle"] },
  { id:"s4",  name:"Domestic Disturbance I",            app:"vRBT",              topic:"Use of Force",   duration:"15 min", desc:"A noise complaint escalates into a domestic dispute requiring force threshold decisions.",                     tags:["force threshold","de-escalation"],             weapons:["taser","handgun"] },
  { id:"s5",  name:"Domestic Disturbance II",           app:"vRBT",              topic:"Use of Force",   duration:"16 min", desc:"A return visit to a volatile household — prior history complicates the encounter.",                           tags:["use of force","scene management"],             weapons:["taser","handgun"] },
  { id:"s6",  name:"Bar Altercation",                   app:"vRBT",              topic:"Use of Force",   duration:"11 min", desc:"Manage multiple intoxicated individuals in a fight — identify the aggressor without over-escalating.",         tags:["crowd management","aggressor ID"],             weapons:["taser","handgun"] },
  { id:"s7",  name:"Armed Suspect — Vehicle Stop",      app:"vRBT",              topic:"Use of Force",   duration:"18 min", desc:"A traffic stop turns dangerous when the driver is confirmed armed with a concealed weapon.",                   tags:["armed suspect","lethal force decision"],        weapons:["taser","handgun","rifle"] },
  { id:"s8",  name:"Noise Complaint",                   app:"Verbal Skills",     topic:"De-escalation",  duration:"8 min",  desc:"A neighbor dispute over noise — resolve verbally before the situation becomes physical.",                      tags:["conflict resolution","patrol basics"],         weapons:["taser"] },
  { id:"s9",  name:"Mental Health Crisis",              app:"Verbal Skills",     topic:"De-escalation",  duration:"12 min", desc:"An individual in a psychotic episode requires crisis intervention without escalating to force.",                tags:["crisis intervention","active listening"],      weapons:["taser"] },
  { id:"s10", name:"Excited Delirium Response",         app:"Verbal Skills",     topic:"De-escalation",  duration:"10 min", desc:"Manage an individual showing signs of excited delirium while coordinating with incoming EMS.",                tags:["excited delirium","EMS coordination"],         weapons:["taser"] },
  { id:"s11", name:"Room Clearing",                     app:"Tactical Clearance",topic:"Tactical",       duration:"20 min", desc:"Clear an unknown structure with limited information, making split-second threat assessments.",                 tags:["threat ID","team communication"],              weapons:["taser","handgun","rifle"] },
  { id:"s12", name:"Building Search",                   app:"Tactical Clearance",topic:"Tactical",       duration:"22 min", desc:"Methodically search a multi-room building for a reported armed suspect — no backup en route.",               tags:["armed suspect","search pattern"],              weapons:["taser","handgun","rifle"] },
  { id:"s13", name:"Active Shooter Response",           app:"Tactical Clearance",topic:"Tactical",       duration:"25 min", desc:"First responder to an active shooter — neutralize the threat and guide civilians to safety.",                  tags:["active shooter","civilian protection"],        weapons:["taser","handgun","rifle"] },
  { id:"s14", name:"Human Trafficking Recognition",     app:"CET",               topic:"Specialized",    duration:"20 min", desc:"Identify trafficking indicators during a routine call and interview potential victims without re-traumatizing.", tags:["trauma-informed","victim interview"],          weapons:["taser"] },
  { id:"s15", name:"Domestic Violence Response",        app:"CET",               topic:"Specialized",    duration:"18 min", desc:"Navigate a DV scene with a reluctant victim, an escalating suspect, and mandatory reporting obligations.",    tags:["victim advocacy","evidence collection"],       weapons:["taser"] },
  { id:"s16", name:"Handgun Targets",                   app:"Range Skills",      topic:"Range",          duration:"15 min", desc:"Standard qualification-style practice focusing on draw speed, accuracy, and target transitions.",              tags:["marksmanship","qualification"],                weapons:["handgun"] },
  { id:"s17", name:"Rifle Targets",                     app:"Range Skills",      topic:"Range",          duration:"15 min", desc:"Rifle-specific scenarios at varying distances and positions, ending with a qualification run.",                 tags:["marksmanship","rifle quals"],                  weapons:["rifle"] },
  { id:"s18", name:"Rifle Transitions",                 app:"Range Skills",      topic:"Range",          duration:"12 min", desc:"Practice transitioning from rifle to sidearm under simulated stress — speed and retention tested.",            tags:["weapon transition","muscle memory"],           weapons:["handgun","rifle"] },
];

const topics  = ["All","Use of Force","De-escalation","Traffic Stops","Tactical","Specialized","Range"];
const weapons = [
  { key:"taser",   label:"Taser" },
  { key:"handgun", label:"Handgun" },
  { key:"rifle",   label:"Rifle" },
];

const appStamp = {
  "vRBT":               "vr-stamp-blue",
  "Verbal Skills":      "vr-stamp-green",
  "Tactical Clearance": "vr-stamp-orange",
  "CET":                "vr-stamp-blue",
  "Range Skills":       "vr-stamp-blue",
};

/* ─── Saved playlists ───────────────────────────────────────── */
const savedPlaylists = [
  { id:"p1", name:"Patrol Team — March",  scenarios:["s1","s4","s8"],    assignType:"everyone",   assignLabel:"Everyone",       status:"Active", completed:11, total:18 },
  { id:"p2", name:"Tactical Unit — Q1",   scenarios:["s11","s12","s13"], assignType:"group",      assignLabel:"Tactical Team",  status:"Active", completed:6,  total:8  },
  { id:"p3", name:"Rookie Onboarding",    scenarios:["s4","s8","s1"],    assignType:"individual", assignLabel:"4 officers",     status:"Active", completed:2,  total:4  },
  { id:"p4", name:"Community Policing",   scenarios:["s9","s15"],        assignType:"group",      assignLabel:"Community Unit", status:"Draft",  completed:0,  total:0  },
];

/* ─── Completion roster ─────────────────────────────────────── */
const completionRoster = [
  { officer:"Carter, James",    playlistId:"p1", completedDate:"Mar 20, 2026" },
  { officer:"Hollis, Derek",    playlistId:"p1", completedDate:"Mar 19, 2026" },
  { officer:"Kim, Alex",        playlistId:"p1", completedDate:null },
  { officer:"Nair, Priya",      playlistId:"p1", completedDate:"Mar 18, 2026" },
  { officer:"Reed, Taylor",     playlistId:"p1", completedDate:null },
  { officer:"Santos, Maria",    playlistId:"p1", completedDate:"Mar 17, 2026" },
  { officer:"Torres, Miguel",   playlistId:"p1", completedDate:null },
  { officer:"Washington, Dana", playlistId:"p1", completedDate:"Mar 21, 2026" },
  { officer:"Adams, Jordan",    playlistId:"p1", completedDate:"Mar 20, 2026" },
  { officer:"Barnes, Chris",    playlistId:"p1", completedDate:"Mar 19, 2026" },
  { officer:"Chen, Wei",        playlistId:"p1", completedDate:"Mar 22, 2026" },
  { officer:"Davis, Morgan",    playlistId:"p1", completedDate:null },
  { officer:"Evans, Robin",     playlistId:"p1", completedDate:"Mar 21, 2026" },
  { officer:"Foster, Ryan",     playlistId:"p2", completedDate:"Mar 15, 2026" },
  { officer:"Grant, Marcus",    playlistId:"p2", completedDate:"Mar 14, 2026" },
  { officer:"Hayes, Jordan",    playlistId:"p2", completedDate:null },
  { officer:"Ingram, Devon",    playlistId:"p2", completedDate:"Mar 13, 2026" },
  { officer:"Jones, Alex",      playlistId:"p3", completedDate:"Mar 21, 2026" },
  { officer:"King, Sam",        playlistId:"p3", completedDate:null },
  { officer:"Lopez, Maria",     playlistId:"p3", completedDate:null },
  { officer:"Martin, Chris",    playlistId:"p3", completedDate:"Mar 20, 2026" },
];

const groups   = ["Patrol Division","Tactical Team","Traffic Unit","Community Unit","Training Division"];
const officers = ["Santos, Maria","Carter, James","Nair, Priya","Hollis, Derek","Reed, Taylor","Kim, Alex","Torres, Miguel","Washington, Dana"];

/* ─── Component ─────────────────────────────────────────────── */
export default function Playlists() {

  /* tab */
  const [activeTab, setActiveTab]         = useState("new");

  /* builder */
  const [playlistName, setPlaylistName]   = useState("New Playlist");
  const [slots, setSlots]                 = useState([null, null, null]);
  const [assignType, setAssignType]       = useState("everyone");
  const [assignGroup, setAssignGroup]     = useState("Patrol Division");
  const [selOfficers, setSelOfficers]     = useState([]);
  const [assigned, setAssigned]           = useState(false);
  const [activeSavedId, setActiveSavedId] = useState(null);

  /* catalog filters */
  const [searchQ, setSearchQ]             = useState("");
  const [topicF, setTopicF]               = useState("All");
  const [weaponF, setWeaponF]             = useState(null);

  /* saved tab */
  const [savedQ, setSavedQ]               = useState("");

  /* completion */
  const [cPlaylistId, setCPlaylistId]     = useState("p1");
  const [officerQ, setOfficerQ]           = useState("");

  /* ── helpers ── */
  const getSc = id => scenarioCatalog.find(s => s.id === id);

  const filledSlots  = slots.filter(Boolean);
  const totalMinutes = filledSlots.map(getSc).filter(Boolean).reduce((n, s) => n + parseInt(s.duration), 0);

  /* catalog filter */
  const filteredCatalog = useMemo(() => {
    const q = searchQ.toLowerCase();
    return scenarioCatalog.filter(s => {
      const matchTopic  = topicF === "All" || s.topic === topicF;
      const matchWeapon = !weaponF || s.weapons.includes(weaponF);
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.app.toLowerCase().includes(q) || s.topic.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q)) || s.desc.toLowerCase().includes(q);
      return matchTopic && matchWeapon && matchSearch;
    });
  }, [searchQ, topicF, weaponF]);

  /* saved filter */
  const filteredSaved = useMemo(() => {
    const q = savedQ.toLowerCase();
    if (!q) return savedPlaylists;
    return savedPlaylists.filter(p => p.name.toLowerCase().includes(q) || p.assignLabel.toLowerCase().includes(q));
  }, [savedQ]);

  /* completion roster filter */
  const cPlaylist    = savedPlaylists.find(p => p.id === cPlaylistId) || savedPlaylists[0];
  const filteredRoster = useMemo(() => {
    const rows = completionRoster.filter(r => r.playlistId === cPlaylistId);
    const q    = officerQ.toLowerCase();
    const filt = q ? rows.filter(r => r.officer.toLowerCase().includes(q)) : rows;
    // not started first, then alphabetical
    return [...filt].sort((a, b) => {
      if (!a.completedDate && b.completedDate)  return -1;
      if (a.completedDate  && !b.completedDate) return 1;
      return a.officer.localeCompare(b.officer);
    });
  }, [cPlaylistId, officerQ]);

  const cDone  = filteredRoster.filter(r => r.completedDate).length;
  const cTotal = filteredRoster.length;

  /* ── actions ── */
  const addToSlot = (scenarioId) => {
    const idx = slots.indexOf(null);
    if (idx === -1) return;
    const next = [...slots];
    next[idx] = scenarioId;
    setSlots(next);
  };

  const removeSlot = (i) => {
    const next = [...slots];
    next[i] = null;
    setSlots(next);
  };

  const loadSaved = (p) => {
    setActiveSavedId(p.id);
    setPlaylistName(p.name);
    setSlots([p.scenarios[0] ?? null, p.scenarios[1] ?? null, p.scenarios[2] ?? null]);
    setAssignType(p.assignType);
    setAssignGroup(p.assignType === "group" ? p.assignLabel : "Patrol Division");
    setSelOfficers([]);
    setAssigned(false);
    setActiveTab("new");
  };

  const newPlaylist = () => {
    setActiveSavedId(null);
    setPlaylistName("New Playlist");
    setSlots([null, null, null]);
    setAssignType("everyone");
    setAssignGroup("Patrol Division");
    setSelOfficers([]);
    setAssigned(false);
  };

  const toggleOfficer = (name) =>
    setSelOfficers(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  const handleAssign = () => {
    if (filledSlots.length === 0) return;
    setAssigned(true);
    setTimeout(() => setAssigned(false), 4000);
  };

  /* ── render ── */
  return (
    <div className="vr-sub-page">

      {/* header */}
      <div className="vr-sub-header">
        <p className="vr-body">
          {__("Build playlists from VR scenarios and assign them to your team. Officers see their assigned content the next time they scan their QR code on any headset.")}
        </p>
        <button className="vr-btn-secondary" onClick={newPlaylist}>
          {__("+ New Playlist")}
        </button>
      </div>

      {/* ── two-column layout ── */}
      <div className="vr-playlists-layout">

        {/* CATALOG */}
        <div className="vr-catalog-pane">

          {/* filters */}
          <div className="vr-catalog-filters">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span className="vr-section-label" style={{ margin:0 }}>{__("Scenario Catalog")}</span>
              <span className="vr-caption">{filteredCatalog.length} of {scenarioCatalog.length} scenarios</span>
            </div>

            {/* search */}
            <div className="vr-catalog-search-bar">
              <SearchIcon style={{ width:14, height:14, color:"var(--vr-dim)", flexShrink:0 }} />
              <input
                className="vr-catalog-search-input"
                placeholder={__("Search by topic, scenario name, or training goal…")}
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
              />
            </div>

            {/* topic chips */}
            <div className="vr-catalog-filter-row">
              <span className="vr-catalog-filter-label">{__("Topic")}</span>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {topics.map(t => (
                  <button key={t} className={`vr-topic-chip${topicF === t ? " vr-topic-chip--active" : ""}`} onClick={() => setTopicF(t)}>{t}</button>
                ))}
              </div>
            </div>

            {/* weapon chips */}
            <div className="vr-catalog-filter-row">
              <span className="vr-catalog-filter-label">{__("Equipment")}</span>
              <div style={{ display:"flex", gap:5 }}>
                {weapons.map(w => (
                  <button
                    key={w.key}
                    className={`vr-weapon-chip vr-weapon-chip--${w.key}${weaponF === w.key ? " vr-weapon-chip--active" : ""}`}
                    onClick={() => setWeaponF(weaponF === w.key ? null : w.key)}
                  >{w.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* scenario list */}
          <div className="vr-scenario-list">
            {filteredCatalog.length === 0 && (
              <p className="vr-caption" style={{ padding:"20px 18px", color:"var(--vr-dim)" }}>
                No scenarios match your search.
              </p>
            )}
            {filteredCatalog.map(s => {
              const isAdded = slots.includes(s.id);
              const canAdd  = !isAdded && slots.includes(null);
              return (
                <div key={s.id} className={`vr-scenario-row${isAdded ? " vr-scenario-row--added" : ""}`}>
                  <div className="vr-scenario-row-left">
                    <span className="vr-scenario-name">{s.name}</span>
                    <span className="vr-scenario-desc">{s.desc}</span>
                    <div className="vr-scenario-tags">
                      <span className={appStamp[s.app] || "vr-stamp-blue"}>{s.app}</span>
                      <span className="vr-stamp" style={{ background:"rgba(54,57,61,0.07)", color:"var(--vr-dim)" }}>{s.topic}</span>
                      {s.tags.map(t => (
                        <span key={t} className="vr-stamp" style={{ background:"rgba(54,57,61,0.06)", color:"var(--vr-dim)", fontSize:10 }}>{t}</span>
                      ))}
                      <span className="vr-tag-divider" />
                      {s.weapons.map(w => (
                        <span key={w} className={`vr-weapon-badge vr-weapon-badge--${w}`}>
                          {w === "taser" ? "Taser" : w === "handgun" ? "Handgun" : "Rifle"}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="vr-scenario-row-right">
                    <span className="vr-caption">{s.duration}</span>
                    <button
                      className={`vr-add-pill${isAdded ? " vr-add-pill--added" : ""}`}
                      onClick={() => canAdd && addToSlot(s.id)}
                      disabled={isAdded || !canAdd}
                    >
                      {isAdded ? "✓ Added" : slots.includes(null) ? "+ Add" : "Full"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BUILDER TRAY */}
        <div className="vr-builder-tray">

          {/* tabs */}
          <div className="vr-tray-tabs">
            <button className={`vr-tray-tab${activeTab === "new" ? " vr-tray-tab--active" : ""}`} onClick={() => setActiveTab("new")}>
              {__("New Playlist")}
            </button>
            <button className={`vr-tray-tab${activeTab === "saved" ? " vr-tray-tab--active" : ""}`} onClick={() => setActiveTab("saved")}>
              {__("Saved")} ({savedPlaylists.length})
            </button>
          </div>

          {/* ── NEW tab ── */}
          {activeTab === "new" && (
            <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
              <div className="vr-tray-name-section">
                <div className="vr-tray-field-label">{__("Playlist name")}</div>
                <input
                  className="vr-tray-name-input"
                  value={playlistName}
                  onChange={e => setPlaylistName(e.target.value)}
                />
                {filledSlots.length > 0 && (
                  <div className="vr-tray-meta">{filledSlots.length} scenario{filledSlots.length !== 1 ? "s" : ""} · {totalMinutes} min</div>
                )}
              </div>

              <div className="vr-tray-body">

                {/* slots */}
                <div>
                  <div className="vr-tray-section-label">{__("Scenarios")}</div>
                  {slots.map((id, i) => {
                    const sc = id ? getSc(id) : null;
                    return (
                      <div key={i} className={`vr-slot${sc ? " vr-slot--filled" : " vr-slot--empty"}`}>
                        <span className="vr-slot-num" style={{ opacity: sc ? 1 : 0.4 }}>{i + 1}</span>
                        {sc ? (
                          <>
                            <div className="vr-slot-content">
                              <div className="vr-slot-name">{sc.name}</div>
                              <div className="vr-slot-sub">
                                <span className={appStamp[sc.app] || "vr-stamp-blue"} style={{ fontSize:9, padding:"1px 5px" }}>{sc.app}</span>
                                <span>{sc.duration}</span>
                              </div>
                            </div>
                            <button className="vr-slot-remove" onClick={() => removeSlot(i)} aria-label="Remove">✕</button>
                          </>
                        ) : (
                          <span className="vr-slot-add-label">{__("Pick from catalog ←")}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* assignment + button together */}
                <div>
                  <div className="vr-tray-section-label">{__("Assign to")}</div>

                  <div className="vr-assign-toggle">
                    {[["everyone","Everyone"],["group","Group"],["individual","Individual"]].map(([val, lbl]) => (
                      <button key={val} className={`vr-assign-btn${assignType === val ? " vr-assign-btn--active" : ""}`} onClick={() => setAssignType(val)}>
                        {lbl}
                      </button>
                    ))}
                  </div>

                  {assignType === "everyone" && (
                    <p className="vr-caption" style={{ marginTop:8 }}>
                      {__("All officers in your agency will see this when they log in on any headset.")}
                    </p>
                  )}

                  {assignType === "group" && (
                    <div className="vr-assign-expanded">
                      <span className="vr-assign-expanded-label">{__("Select group")}</span>
                      <div className="vr-group-chips">
                        {groups.map(g => (
                          <button key={g} className={`vr-group-chip${assignGroup === g ? " vr-group-chip--active" : ""}`} onClick={() => setAssignGroup(g)}>{g}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {assignType === "individual" && (
                    <div className="vr-assign-expanded">
                      <span className="vr-assign-expanded-label">
                        {__("Select officers")}
                        {selOfficers.length > 0 && <span style={{ marginLeft:6, color:"var(--vr-info)", fontWeight:600 }}>{selOfficers.length} selected</span>}
                      </span>
                      <div className="vr-group-chips">
                        {officers.map(name => (
                          <button key={name} className={`vr-group-chip${selOfficers.includes(name) ? " vr-group-chip--active" : ""}`} onClick={() => toggleOfficer(name)}>{name}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assign button sits right here, immediately after assignment picks */}
                  <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:8 }}>
                    {assigned && (
                      <div className="vr-assign-success">
                        ✓ Playlist assigned — officers will see it the next time they log in on any headset
                      </div>
                    )}
                    <button
                      className="vr-btn-primary"
                      style={{ width:"100%", justifyContent:"center" }}
                      onClick={handleAssign}
                      disabled={filledSlots.length === 0}
                    >
                      {__("Assign Playlist")}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ── SAVED tab ── */}
          {activeTab === "saved" && (
            <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
              <div className="vr-saved-search">
                <div className="vr-tray-field-label" style={{ marginBottom:5 }}>{__("Find a playlist")}</div>
                <div className="vr-catalog-search-bar">
                  <SearchIcon style={{ width:13, height:13, color:"var(--vr-dim)", flexShrink:0 }} />
                  <input
                    className="vr-catalog-search-input"
                    placeholder={__("Search by name or assignment…")}
                    value={savedQ}
                    onChange={e => setSavedQ(e.target.value)}
                  />
                </div>
              </div>
              <div className="vr-saved-list">
                {filteredSaved.length === 0 && (
                  <p className="vr-caption" style={{ padding:"16px", color:"var(--vr-dim)" }}>No playlists match.</p>
                )}
                {filteredSaved.map(p => (
                  <button key={p.id} className={`vr-saved-item${activeSavedId === p.id ? " vr-saved-item--active" : ""}`} onClick={() => loadSaved(p)}>
                    <div className="vr-saved-item-left">
                      <span className="vr-saved-item-name">{p.name}</span>
                      <span className="vr-saved-item-meta">
                        {p.scenarios.length} scenarios · {p.assignType === "everyone" ? "Everyone" : p.assignType === "group" ? `Group: ${p.assignLabel}` : p.assignLabel}
                        {p.status === "Active" && p.total > 0 && <> · <span style={{ color:"var(--vr-info)" }}>{p.completed}/{p.total} completed</span></>}
                      </span>
                    </div>
                    <span className={p.status === "Active" ? "vr-status-dot vr-status-dot--active" : "vr-status-dot vr-status-dot--draft"} />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── COMPLETION ── */}
      <div className="vr-completion-section">

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <p className="vr-panel-title" style={{ margin:0 }}>{__("Completion")}</p>
          {cTotal > 0 && (
            <>
              <div className="vr-progress-bar">
                <div className="vr-progress-fill" style={{ width:`${Math.round((cDone / cTotal) * 100)}%` }} />
              </div>
              <span className="vr-caption">{cDone} of {cTotal} completed</span>
            </>
          )}
        </div>

        {/* dual search */}
        <div style={{ display:"flex", gap:14 }}>
          <div className="vr-completion-field">
            <span className="vr-field-label">{__("Playlist")}</span>
            <select className="vr-field-select" value={cPlaylistId} onChange={e => { setCPlaylistId(e.target.value); setOfficerQ(""); }}>
              {savedPlaylists.filter(p => p.status === "Active").map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="vr-completion-field">
            <span className="vr-field-label">{__("Search officer")}</span>
            <div className="vr-catalog-search-bar" style={{ background:"var(--vr-bg)" }}>
              <SearchIcon style={{ width:13, height:13, color:"var(--vr-dim)", flexShrink:0 }} />
              <input
                className="vr-catalog-search-input"
                placeholder={__("Last name, first name…")}
                value={officerQ}
                onChange={e => setOfficerQ(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* roster */}
        <div className="vr-roster-table">
          <div className="vr-roster-head">
            <span className="vr-roster-head-cell">{__("Officer")}</span>
            <span className="vr-roster-head-cell">{__("Playlist")}</span>
            <span className="vr-roster-head-cell">{__("Completed on")}</span>
            <span className="vr-roster-head-cell">{__("Status")}</span>
          </div>
          {filteredRoster.length === 0 && (
            <p className="vr-caption" style={{ padding:"16px 18px", color:"var(--vr-dim)" }}>No officers match.</p>
          )}
          {filteredRoster.map((r, i) => (
            <div key={i} className={`vr-roster-row${!r.completedDate ? " vr-roster-row--pending" : ""}`}>
              <span className="vr-roster-name">{r.officer}</span>
              <span className="vr-roster-playlist">{cPlaylist.name}</span>
              <span className="vr-roster-date">{r.completedDate || "—"}</span>
              <span className={`vr-roster-status${r.completedDate ? " vr-roster-status--done" : " vr-roster-status--pending"}`}>
                {r.completedDate ? "✓ Completed" : "Not started"}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
