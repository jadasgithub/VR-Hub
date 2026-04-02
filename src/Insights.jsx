import { useState } from "react";

// ── Mock data ─────────────────────────────────────────────────────────────────

const QUARTERLY_TREND = [
  { q: "Q2 '25", min: 78 },
  { q: "Q3 '25", min: 124 },
  { q: "Q4 '25", min: 318 },
  { q: "Q1 '26", min: 412 },
];

const SKILLS = [
  {
    id: "probe",
    label: "Probe Placement Quality",
    metric: "probe separation",
    fieldOutcome: 74,
    fieldBenchmark: 68,
    peerLabel: "Above 61 peers",
    trainingMin: 186,
    trainingPercentile: 52,
    outcomePercentile: 84,
    modules: [
      { name: "Distance",      min: 92, benchmark: 9,  percentile: 30, gap: false },
      { name: "Movement",      min: 8,  benchmark: 4,  percentile: 13, gap: true  },
      { name: "Alt Positions", min: 76, benchmark: 50, percentile: 88, gap: false },
      { name: "Broken Circuit",min: 10, benchmark: 8,  percentile: 42, gap: false },
    ],
    researchNote: "Agencies above the training median tend to show 2.6 pp better probe separation in the field.",
    quarterlyTrend: [62, 66, 70, 74],
  },
  {
    id: "deployment",
    label: "Deployment Effectiveness",
    metric: "effectiveness rate",
    fieldOutcome: 84,
    fieldBenchmark: 77,
    peerLabel: "Above 58 peers · 80% org threshold",
    trainingMin: 243,
    trainingPercentile: 58,
    outcomePercentile: 72,
    modules: [
      { name: "Traffic Stop",   min: 85, benchmark: 60, percentile: 72, gap: false },
      { name: "Domestic",       min: 68, benchmark: 70, percentile: 48, gap: true  },
      { name: "Building Clear", min: 54, benchmark: 52, percentile: 55, gap: false },
      { name: "Barrier Pen.",   min: 36, benchmark: 40, percentile: 39, gap: false },
    ],
    researchNote: "80% is the org threshold. Agencies near or above the training median show consistently higher deployment success.",
    quarterlyTrend: [77, 80, 82, 84],
  },
  {
    id: "incapacitation",
    label: "Incapacitation Achievement",
    metric: "NMI rate",
    fieldOutcome: 68,
    fieldBenchmark: 72,
    peerLabel: "Below peer median · −4 pp gap",
    trainingMin: 148,
    trainingPercentile: 18,
    outcomePercentile: 28,
    modules: [
      { name: "Clothing",      min: 42, benchmark: 55, percentile: 28, gap: true  },
      { name: "Broken Circuit",min: 10, benchmark: 18, percentile: 22, gap: true  },
      { name: "Distance",      min: 92, benchmark: 70, percentile: 88, gap: false },
      { name: "Movement",      min: 4,  benchmark: 10, percentile: 12, gap: true  },
    ],
    researchNote: "Incapacitation is downstream of placement and influenced by situational factors. Largest gap skill for this agency.",
    quarterlyTrend: [65, 64, 66, 68],
  },
];

// ── Ordinal suffix helper ─────────────────────────────────────────────────────

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ── SVG chart components ──────────────────────────────────────────────────────

function QuarterlyBars({ data }) {
  const maxVal = Math.max(...data.map(d => d.min));
  const barW = 38, gap = 14, barAreaH = 60, topPad = 18;
  const totalW = data.length * (barW + gap) - gap;
  const svgW = totalW + 20;
  const svgH = topPad + barAreaH + 28;
  const offsetX = 10;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} style={{ display: "block" }}>
      {data.map((d, i) => {
        const barH = Math.max(4, (d.min / maxVal) * barAreaH);
        const x = offsetX + i * (barW + gap);
        const y = topPad + barAreaH - barH;
        const isLatest = i === data.length - 1;
        return (
          <g key={d.q}>
            <rect
              x={x} y={y} width={barW} height={barH} rx={4}
              style={{ fill: isLatest ? "var(--color-axon-accent)" : "var(--color-axon-border-hover)" }}
            />
            <text x={x + barW / 2} y={svgH - 2} textAnchor="middle"
              fontSize={9} style={{ fill: "var(--vr-dim)" }}>{d.q}</text>
            {isLatest && (
              <text x={x + barW / 2} y={y - 5} textAnchor="middle"
                fontSize={10} fontWeight="700" style={{ fill: "var(--vr-text)" }}>{d.min}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function PercentileLadder({ trainingPercentile, outcomePercentile }) {
  const barW = 50, colGap = 40;
  const svgW = barW * 2 + colGap + 40;
  const barAreaH = 120;
  const svgH = barAreaH + 40;
  const col1X = 10, col2X = col1X + barW + colGap;
  const trainBarH = Math.max(6, (trainingPercentile / 100) * barAreaH);
  const outcomeBarH = Math.max(6, (outcomePercentile / 100) * barAreaH);
  const trainY = barAreaH - trainBarH;
  const outcomeY = barAreaH - outcomeBarH;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} style={{ display: "block" }}>
      {/* Training bar */}
      <rect x={col1X} y={trainY} width={barW} height={trainBarH} rx={4}
        style={{ fill: "var(--color-axon-border-hover)" }} />
      <text x={col1X + barW / 2} y={trainY - 14} textAnchor="middle"
        fontSize={12} fontWeight="700" style={{ fill: "var(--vr-text)" }}>{ordinal(trainingPercentile)}</text>
      <text x={col1X + barW / 2} y={trainY - 4} textAnchor="middle"
        fontSize={9} style={{ fill: "var(--vr-dim)" }}>percentile</text>

      {/* Outcome bar */}
      <rect x={col2X} y={outcomeY} width={barW} height={outcomeBarH} rx={4}
        style={{ fill: "var(--color-axon-accent)" }} />
      <text x={col2X + barW / 2} y={outcomeY - 14} textAnchor="middle"
        fontSize={12} fontWeight="700" style={{ fill: "var(--vr-text)" }}>{ordinal(outcomePercentile)}</text>
      <text x={col2X + barW / 2} y={outcomeY - 4} textAnchor="middle"
        fontSize={9} style={{ fill: "var(--vr-dim)" }}>percentile</text>

      {/* Bottom labels */}
      <text x={col1X + barW / 2} y={barAreaH + 16} textAnchor="middle"
        fontSize={10} style={{ fill: "var(--vr-dim)" }}>Training</text>
      <text x={col1X + barW / 2} y={barAreaH + 28} textAnchor="middle"
        fontSize={10} style={{ fill: "var(--vr-dim)" }}>Investment</text>
      <text x={col2X + barW / 2} y={barAreaH + 16} textAnchor="middle"
        fontSize={10} style={{ fill: "var(--vr-dim)" }}>Field</text>
      <text x={col2X + barW / 2} y={barAreaH + 28} textAnchor="middle"
        fontSize={10} style={{ fill: "var(--vr-dim)" }}>Outcome</text>
    </svg>
  );
}

function ModuleBar({ min, benchmark, isGap }) {
  const scale = 200;
  const maxMin = 120;
  const wBar = Math.min((min / maxMin) * scale, scale);
  const wBench = Math.min((benchmark / maxMin) * scale, scale);
  return (
    <div style={{ position: "relative", height: 16, width: scale, flexShrink: 0 }}>
      <div style={{
        position: "absolute", left: 0, top: 3,
        width: wBar, height: 10, borderRadius: 3,
        background: isGap ? "var(--color-axon-accent)" : "var(--color-axon-border-hover)",
      }} />
      <div style={{
        position: "absolute", left: wBench - 1, top: 0,
        width: 2, height: 16, borderRadius: 1,
        background: "var(--vr-dim)",
      }} />
    </div>
  );
}

function Sparkline({ values }) {
  const w = 140, h = 40;
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - 4 - ((v - minV) / range) * (h - 8);
    return `${x},${y}`;
  }).join(" ");
  const [lastX, lastY] = pts.split(" ").pop().split(",");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none"
        style={{ stroke: "var(--color-axon-accent)" }}
        strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r={3}
        style={{ fill: "var(--color-axon-accent)" }} />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Insights() {
  const [hasTrend, setHasTrend] = useState(true);
  const [activeSkill, setActiveSkill] = useState("probe");
  const skill = SKILLS.find(s => s.id === activeSkill);

  return (
    <div className="vr-sub-page">

      {/* ── Header + TREND toggle ── */}
      <div className="vr-sub-header">
        <div className="vr-col">
          <p className="vr-body" style={{ fontWeight: 600 }}>
            {__("Is Your VR Training Translating to the Field?")}
          </p>
          <span className="vr-caption">Metro City Police Department · Trainer View · March 2026</span>
        </div>
        <div style={{ display: "flex", background: "var(--vr-bg-deeper)", borderRadius: 10, padding: 3, gap: 3, flexShrink: 0 }}>
          <button
            onClick={() => setHasTrend(true)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "none",
              background: hasTrend ? "var(--vr-surface)" : "transparent",
              color: hasTrend ? "var(--vr-text)" : "var(--vr-dim)",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: hasTrend ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
              transition: "all 0.12s ease",
            }}
          >
            VR + TREND
          </button>
          <button
            onClick={() => setHasTrend(false)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "none",
              background: !hasTrend ? "var(--vr-surface)" : "transparent",
              color: !hasTrend ? "var(--vr-text)" : "var(--vr-dim)",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: !hasTrend ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
              transition: "all 0.12s ease",
            }}
          >
            VR Only
          </button>
        </div>
      </div>

      {/* ══ SECTION 1: Investment ══════════════════════════════════════════════ */}

      <div>
        <p className="vr-section-label" style={{ marginBottom: 4 }}>
          {__("How Much Are You Investing in Training?")}
        </p>
        <p className="vr-caption">
          {__("Your agency's practice volume, consistency, and where you stand relative to peers.")}
        </p>
      </div>

      <div className="vr-kpi-grid">

        {/* Agency practice minutes */}
        <div className="vr-kpi-card" style={{ textAlign: "left", padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="vr-caption" style={{ textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
            Practice Minutes (12 mo)
          </div>
          <div>
            <span className="vr-kpi-value">412</span>
            <span className="vr-caption" style={{ marginLeft: 6 }}>avg / officer</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ height: 6, background: "var(--vr-border)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: "58%", height: "100%", background: "var(--color-axon-accent)", borderRadius: 3 }} />
            </div>
            <div className="vr-caption">58th percentile vs. peer agencies</div>
          </div>
        </div>

        {/* Officers active */}
        <div className="vr-kpi-card" style={{ textAlign: "left", padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="vr-caption" style={{ textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
            Active Officers · 30 days
          </div>
          <div>
            <span className="vr-kpi-value">43</span>
            <span className="vr-caption" style={{ marginLeft: 6 }}>of 51 officers</span>
          </div>
          <span className="vr-stamp-green" style={{ alignSelf: "flex-start" }}>84% participation</span>
        </div>

        {/* Quarterly trend */}
        <div className="vr-kpi-card" style={{ textAlign: "left", padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="vr-caption" style={{ textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
            Quarterly Practice Trend
          </div>
          <QuarterlyBars data={QUARTERLY_TREND} />
        </div>

        {/* Per-officer rate */}
        <div className="vr-kpi-card" style={{ textAlign: "left", padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="vr-caption" style={{ textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
            Per-Officer Rate
          </div>
          <div>
            <span className="vr-kpi-value">3.4</span>
            <span className="vr-caption" style={{ marginLeft: 6 }}>min / officer</span>
          </div>
          <div className="vr-caption">51 officers · 284 sessions</div>
        </div>

      </div>

      {/* ══ SECTION 2: Skills ════════════════════════════════════════════════ */}

      <div style={{ marginTop: 8 }}>
        <p className="vr-section-label" style={{ marginBottom: 0 }}>
          {__("What Skills Is That Training Building?")}
        </p>
      </div>

      {/* Skill selector tabs */}
      <div style={{ display: "flex", gap: 10 }}>
        {SKILLS.map(s => {
          const isActive = activeSkill === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSkill(s.id)}
              style={{
                flex: 1,
                padding: "11px 14px",
                borderRadius: 10,
                border: "1px solid",
                borderColor: isActive ? "var(--vr-text)" : "var(--vr-border-hover)",
                background: isActive ? "var(--vr-text)" : "var(--vr-surface)",
                color: isActive ? "var(--vr-surface)" : "var(--vr-muted)",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.12s ease",
                textAlign: "center",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Skill drill-down panel */}
      <div className="vr-panel">
        <div className="vr-panel-header">
          <p className="vr-panel-title">{skill.label}</p>
          <span className="vr-stamp-blue">Example</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

          {/* Left: training side */}
          <div style={{ padding: "20px 24px", borderRight: "1px solid var(--vr-border-light)" }}>

            {/* Field outcome */}
            <div style={{ marginBottom: 20 }}>
              <div className="vr-caption" style={{
                textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600,
                marginBottom: 8,
              }}>
                Field Outcome
              </div>
              {hasTrend ? (
                <div style={{
                  background: "var(--color-axon-accent-dim)",
                  borderRadius: 10, padding: "14px 16px",
                }}>
                  <div style={{ fontSize: 30, fontWeight: 700, color: "var(--vr-text)", lineHeight: 1.1 }}>
                    {skill.fieldOutcome}%
                    <span className="vr-caption" style={{ marginLeft: 8 }}>agency {skill.metric}</span>
                  </div>
                  <div className="vr-caption" style={{ marginTop: 6 }}>
                    Peer benchmark: {skill.fieldBenchmark}% · {skill.peerLabel}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: "var(--vr-bg-deeper)", borderRadius: 10, padding: "14px 16px",
                  border: "1px dashed var(--vr-border-hover)",
                }}>
                  <div className="vr-body-sm" style={{ color: "var(--vr-dim)" }}>—</div>
                  <div className="vr-caption" style={{ marginTop: 4 }}>Requires TREND connection</div>
                </div>
              )}
            </div>

            {/* Training investment */}
            <div style={{ marginBottom: 20 }}>
              <div className="vr-caption" style={{ textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: 8 }}>
                Training Investment
              </div>
              <div style={{ background: "var(--vr-bg-deeper)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "var(--vr-text)", lineHeight: 1.1 }}>
                  {skill.trainingMin}
                  <span className="vr-caption" style={{ marginLeft: 8 }}>agency avg min/officer</span>
                </div>
                <div className="vr-caption" style={{ marginTop: 6 }}>
                  {ordinal(skill.trainingPercentile)} percentile vs. peer agencies · At peer median
                </div>
              </div>
            </div>

            {/* Module breakdown */}
            <div>
              <div className="vr-caption" style={{ textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: 10 }}>
                Modules That Build This Skill · Agency Avg
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {skill.modules.map((m, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "9px 10px",
                    borderRadius: 8,
                    background: m.gap ? "rgba(254,198,46,0.10)" : "transparent",
                  }}>
                    <span className="vr-body-sm" style={{ fontWeight: m.gap ? 700 : 400, minWidth: 100, flexShrink: 0 }}>
                      {m.name}
                    </span>
                    <ModuleBar min={m.min} benchmark={m.benchmark} isGap={m.gap} />
                    <div style={{ textAlign: "right", minWidth: 76, flexShrink: 0 }}>
                      <div className="vr-caption">{m.min} min</div>
                      <div className="vr-caption" style={{
                        color: "var(--vr-dim)",
                        fontWeight: m.gap ? 700 : 400,
                      }}>
                        {ordinal(m.percentile)} percentile
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 8, borderRadius: 2, background: "var(--color-axon-border-hover)" }} />
                  <span className="vr-caption">Your agency</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 2, height: 14, borderRadius: 1, background: "var(--vr-dim)" }} />
                  <span className="vr-caption">Peer benchmark</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 8, borderRadius: 2, background: "var(--color-axon-accent)" }} />
                  <span className="vr-caption">Biggest opportunity</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: outcome / TREND upsell */}
          <div style={{ padding: "20px 24px" }}>
            {hasTrend ? (
              <>
                <div className="vr-caption" style={{ textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: 6 }}>
                  Is Your Agency's Training Translating?
                </div>
                <p className="vr-caption" style={{ marginBottom: 20 }}>
                  How your agency ranks vs. peer agencies in training investment and field outcomes
                </p>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                  <PercentileLadder
                    trainingPercentile={skill.trainingPercentile}
                    outcomePercentile={skill.outcomePercentile}
                  />
                </div>
                <div style={{
                  background: "rgba(254,198,46,0.10)",
                  border: "1px solid rgba(254,198,46,0.28)",
                  borderRadius: 10,
                  padding: "12px 14px",
                }}>
                  <span className="vr-caption">
                    Associated finding: {skill.researchNote}
                  </span>
                </div>
              </>
            ) : (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "100%", minHeight: 240,
                textAlign: "center", gap: 12, padding: "0 20px",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "var(--vr-bg-deeper)",
                  border: "1px dashed var(--vr-border-hover)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: "var(--vr-dim)",
                }}>
                  —
                </div>
                <p className="vr-body" style={{ fontWeight: 600, margin: 0 }}>
                  {__("Connect TREND to unlock outcome data")}
                </p>
                <p className="vr-caption" style={{ maxWidth: 280 }}>
                  {__("See how your training investment translates to field performance with peer percentile comparisons.")}
                </p>
                <button className="vr-btn-primary" style={{ marginTop: 4 }}>
                  {__("Learn About TREND")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ SECTION 3: Opportunities ════════════════════════════════════════ */}

      <div style={{ marginTop: 8 }}>
        <p className="vr-section-label" style={{ marginBottom: 4 }}>
          {__("Where Are Your Biggest Opportunities?")}
        </p>
        <p className="vr-caption">
          {__("A clear picture of which skills are strong, which need attention, and what's trending.")}
        </p>
      </div>

      {hasTrend ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Skill status matrix */}
          <div className="vr-panel">
            <div className="vr-panel-header">
              <p className="vr-panel-title">{__("Skill Status Matrix")}</p>
            </div>
            <div style={{ padding: "0 20px" }}>

              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 60px 72px 72px",
                gap: 8, padding: "10px 0",
                borderBottom: "1px solid var(--vr-border-light)",
              }}>
                {["Skill", "Training", "Field", "Benchmark", "vs. Bench"].map(h => (
                  <span key={h} className="vr-caption" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Skill rows */}
              {SKILLS.map(s => {
                const delta = s.fieldOutcome - s.fieldBenchmark;
                const pos = delta >= 0;
                return (
                  <div key={s.id} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 90px 60px 72px 72px",
                    gap: 8, padding: "14px 0",
                    borderBottom: "1px solid var(--vr-border-light)",
                    alignItems: "center",
                  }}>
                    <span className="vr-body-sm" style={{ fontWeight: 600 }}>{s.label}</span>
                    <span className="vr-caption">{ordinal(s.trainingPercentile)} percentile</span>
                    <span className="vr-body-sm" style={{ fontWeight: 700 }}>{s.fieldOutcome}%</span>
                    <span className="vr-caption">{s.fieldBenchmark}%</span>
                    <span className={pos ? "vr-stamp-green" : "vr-stamp-red"}>
                      {pos ? "▲" : "▼"} {Math.abs(delta)} pp
                    </span>
                  </div>
                );
              })}

              {/* Data callouts */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 0" }}>
                <div style={{ background: "rgba(254,198,46,0.10)", borderRadius: 8, padding: "10px 12px" }}>
                  <span className="vr-caption">
                    <strong>Biggest gap:</strong> Incapacitation Achievement — 68% vs. 72% benchmark (−4 pp)
                  </span>
                </div>
                <div style={{ background: "rgba(46,94,24,0.08)", borderRadius: 8, padding: "10px 12px" }}>
                  <span className="vr-caption">
                    <strong>Strongest:</strong> Deployment Effectiveness — 84% vs. 77% benchmark (+7 pp)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quarterly outcome sparklines */}
          <div className="vr-panel">
            <div className="vr-panel-header">
              <p className="vr-panel-title">{__("Quarterly Outcome Trends")}</p>
            </div>
            <div style={{ padding: "0 20px" }}>
              {SKILLS.map((s, i) => {
                const last = s.quarterlyTrend[s.quarterlyTrend.length - 1];
                const prev = s.quarterlyTrend[s.quarterlyTrend.length - 2];
                const delta = last - prev;
                const pos = delta >= 0;
                return (
                  <div key={s.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 0",
                    borderBottom: i < SKILLS.length - 1 ? "1px solid var(--vr-border-light)" : "none",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div className="vr-body-sm" style={{ marginBottom: 8 }}>{s.label}</div>
                      <Sparkline values={s.quarterlyTrend} />
                    </div>
                    <div style={{ textAlign: "right", marginLeft: 20, flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--vr-text)", lineHeight: 1 }}>{last}%</div>
                      <span className={pos ? "vr-stamp-green" : "vr-stamp-red"} style={{ marginTop: 4, display: "inline-flex" }}>
                        {pos ? "▲" : "▼"} +{Math.abs(delta)} pp
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        <div className="vr-panel">
          <div className="vr-panel-body" style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center", padding: "44px 24px", gap: 12,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "var(--vr-bg-deeper)",
              border: "1px dashed var(--vr-border-hover)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: "var(--vr-dim)",
            }}>
              —
            </div>
            <p className="vr-body" style={{ fontWeight: 600, margin: 0 }}>
              {__("Connect TREND to see your biggest opportunities")}
            </p>
            <p className="vr-caption" style={{ maxWidth: 380, margin: 0 }}>
              {__("The skill status matrix and outcome trends require TREND data. Training benchmarks are available now — outcome benchmarks unlock when you connect TREND.")}
            </p>
            <button className="vr-btn-primary" style={{ marginTop: 8 }}>
              {__("Learn About TREND")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
