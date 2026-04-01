const mockTopScenarios = [
  { name: "Traffic Stop — Armed Subject",         runs: 38, avgScore: "89%", trend: "+4%" },
  { name: "Domestic Disturbance",                 runs: 27, avgScore: "84%", trend: "+2%" },
  { name: "De-escalation: Mental Health Crisis",  runs: 24, avgScore: "91%", trend: "+7%" },
  { name: "Building Clearing",                    runs: 19, avgScore: "78%", trend: "-1%" },
  { name: "Active Threat — School",               runs: 14, avgScore: "82%", trend: "+3%" },
];

export default function Insights() {
  return (
    <div className="vr-sub-page">

      <div className="vr-sub-header">
        <p className="vr-body">
          {__("Training trends, activity data, and performance analytics connected to TREND for agency-wide visibility.")}
        </p>
        <span className="vr-stamp-blue">{__("Analytics")}</span>
      </div>

      <div className="vr-kpi-grid">
        {[
          { value: "↑ 12%", label: __("Training activity") },
          { value: "34",    label: __("Active officers") },
          { value: "6",     label: __("Scenarios run") },
          { value: "91%",   label: __("Completion rate") },
        ].map(k => (
          <div key={k.label} className="vr-kpi-card">
            <div className="vr-kpi-value">{k.value}</div>
            <div className="vr-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="vr-panel">
        <div className="vr-panel-header">
          <p className="vr-panel-title">{__("Training Activity Over Time")}</p>
          <span className="vr-stamp-blue">{__("Last 30 days")}</span>
        </div>
        <div className="vr-panel-body">
          <p className="vr-caption">{__("Weekly session counts — connected to TREND data. Chart visualization coming soon.")}</p>
        </div>
      </div>

      <div className="vr-panel">
        <div className="vr-panel-header">
          <p className="vr-panel-title">{__("Top Scenarios")}</p>
          <span className="vr-stamp-blue">{__("5 scenarios")}</span>
        </div>
        <div className="vr-panel-body" style={{ padding: "0 20px" }}>
          {mockTopScenarios.map((s, i) => (
            <div key={i} className="vr-list-row">
              <span className="vr-body-sm">{s.name}</span>
              <div className="vr-row vr-row--gap-l">
                <span className="vr-caption">{s.runs} {__("runs")}</span>
                <span className="vr-body-sm">{s.avgScore}</span>
                <span className={s.trend.startsWith("+") ? "vr-stamp-green" : "vr-stamp-red"}>{s.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="vr-panel">
        <div className="vr-panel-header">
          <p className="vr-panel-title">{__("Officer Performance Summary")}</p>
        </div>
        <div className="vr-panel-body">
          <p className="vr-caption">{__("Officer-level performance breakdown — connect to TREND data for detailed analytics")}</p>
        </div>
      </div>

    </div>
  );
}
