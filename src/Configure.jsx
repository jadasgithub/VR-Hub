import { useState } from "react";
import { SettingsIcon } from "@axon-enterprise/icon";

const configSections = [
  {
    id: "range",
    title: __("Range Skill Configuration"),
    content: __("Define skill parameters for range-based VR training exercises. Set accuracy thresholds, time limits, and scoring rubrics for marksmanship and tactical shooting scenarios."),
  },
  {
    id: "vrbt",
    title: __("vRBT Configuration"),
    content: __("Configure Virtual Reality-Based Training (vRBT) settings including environment variables, scenario difficulty, and deescalation response triggers for use-of-force training."),
  },
  {
    id: "prompt",
    title: __("Prompt to Scenario"),
    content: __("Map conversational prompts and officer decisions to branching scenario outcomes. Define conditional logic that shapes how a scenario evolves based on trainee input."),
  },
  {
    id: "t3",
    title: __("T3 Scenario Builder"),
    stamp: "Coming Soon",
    content: __("Build custom T3 training scenarios from scratch using the scenario editor. Combine environmental assets, NPC behaviors, and decision trees to author new training content."),
  },
];

export default function Configure() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="vr-sub-page">

      <div className="vr-row vr-row--gap-s">
        <SettingsIcon style={{ width: 20, height: 20, color: "var(--vr-dim)" }} />
        <div className="vr-col">
          <p className="vr-page-title">{__("Configure Training")}</p>
          <p className="vr-page-subtitle">
            {__("Customize your VR training scenarios — adjust range skills, vRBT parameters, scenario branching logic, and build new content with the T3 Scenario Builder.")}
          </p>
        </div>
      </div>

      <div className="vr-panel">
        <div className="vr-panel-header">
          <p className="vr-panel-title">{__("Training Configuration")}</p>
        </div>
        <div className="vr-panel-body" style={{ padding: "0 20px" }}>
          <div className="vr-accordion">
            {configSections.map(s => (
              <div key={s.id} className="vr-accordion-item">
                <button
                  className="vr-accordion-trigger"
                  onClick={() => setOpenId(openId === s.id ? null : s.id)}
                >
                  <div className="vr-row vr-row--gap-s">
                    {s.title}
                    {s.stamp && <span className="vr-stamp-orange">{s.stamp}</span>}
                  </div>
                  <span className={`vr-accordion-chevron${openId === s.id ? " vr-accordion-chevron--open" : ""}`}>▾</span>
                </button>
                {openId === s.id && (
                  <div className="vr-accordion-body">{s.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
