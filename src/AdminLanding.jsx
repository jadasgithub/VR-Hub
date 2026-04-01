import { ChevronRightIcon, DevicesIcon } from "@axon-enterprise/icon";

export default function AdminLanding({ onNavigate }) {
  return (
    <div className="vr-page">

      <div className="vr-page-header">
        <div>
          <h1 className="vr-page-title">{__("Evidence.com Admin Site")}</h1>
          <p className="vr-page-subtitle">
            {__("Pretend you have just navigated to the section of Admin for Device management and select the VR Device Management Dashboard")}
          </p>
        </div>
      </div>

      <div className="vr-grid">
        <button
          className="vr-card"
          onClick={() => onNavigate("fleet")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="vr-icon-box" style={{ flexShrink: 0 }}>
              <DevicesIcon style={{ width: 20, height: 20 }} />
            </div>
            <p className="vr-card-title">{__("VR Device Management Dashboard")}</p>
          </div>

          <p className="vr-card-desc">{__("Monitor device health, ROM and firmware compliance, storage, and scheduled updates across your VR fleet.")}</p>

          <div className="vr-card-footer">
            <span className="vr-tag">{__("Devices")}</span>
            <ChevronRightIcon style={{ width: 14, height: 14, color: "var(--vr-dim)" }} />
          </div>
        </button>
      </div>

    </div>
  );
}
