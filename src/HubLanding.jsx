import {
  ReviewIcon,
  DevicesIcon,
  PlaylistAddIcon,
  SettingsIcon,
  AnalyticsIcon,
  HelpOutlineIcon,
  QrCodeIcon,
  ChevronRightIcon,
} from "@axon-enterprise/icon";

const cards = [
  {
    id: "cms",
    icon: DevicesIcon,
    title: __("Content Management"),
    description: __("Push VR content and playlists to headset devices across your fleet."),
    tag: __("Content"),
  },
  {
    id: "playlists",
    icon: PlaylistAddIcon,
    title: __("Playlists"),
    description: __("Build training playlists from VR scenarios. Push assembled playlists to headsets via Content Management."),
    tag: __("Playlists"),
  },
  {
    id: "configure",
    icon: SettingsIcon,
    title: __("Configure Training"),
    description: __("Customize scenarios: Range Skills, vRBT, Prompt to Scenario, T3 Builder."),
    tag: __("Configure"),
  },
  {
    id: "aar",
    icon: ReviewIcon,
    title: __("After Action Reviews"),
    description: __("Review completed VR sessions, performance outcomes, and access coaching feedback."),
    tag: __("Reviews"),
  },
  {
    id: "insights",
    icon: AnalyticsIcon,
    title: __("Insights"),
    description: __("Training trends, activity data, and performance analytics connected to TREND."),
    tag: __("Analytics"),
  },
  {
    id: "help",
    icon: HelpOutlineIcon,
    title: __("Help & Resources"),
    description: __("Release notes, documentation links, and Axon Assist AI chatbot for VR support."),
    tag: __("Support"),
  },
];

export default function HubLanding({ onNavigate }) {
  return (
    <div className="vr-page">

      {/* ── Page header ── */}
      <div className="vr-page-header">
        <div>
          <h1 className="vr-page-title">{__("VR Training")}</h1>
          <p className="vr-page-subtitle">
            {__("Manage VR training content, review performance, configure scenarios, and track outcomes across your agency.")}
          </p>
        </div>
        <div className="vr-qr-section">
          <p className="vr-caption" style={{ textAlign: 'center' }}>
            {__("Scan to sign in on any VR headset using your personal ID")}
          </p>
          <button className="vr-btn-primary" style={{ justifyContent: 'center' }}>
            <QrCodeIcon style={{ width: 15, height: 15 }} />
            {__("Get My QR Code")}
          </button>
        </div>
      </div>

      {/* ── Section label ── */}
      <p className="vr-section-label">{__("Jump to a section")}</p>

      {/* ── Card grid ── */}
      <div className="vr-grid">
        {cards.map((card) => (
          <button
            key={card.id}
            className="vr-card"
            onClick={() => onNavigate(card.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="vr-icon-box" style={{ flexShrink: 0 }}>
                <card.icon style={{ width: 20, height: 20 }} />
              </div>
              <p className="vr-card-title">{card.title}</p>
            </div>

            <p className="vr-card-desc">{card.description}</p>

            <div className="vr-card-footer">
              <span className="vr-tag">{card.tag}</span>
              <ChevronRightIcon style={{ width: 14, height: 14, color: 'var(--vr-dim)' }} />
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
