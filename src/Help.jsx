import { useState } from "react";
import { LaunchIcon, MagicStarsIcon, FileTypeDocumentIcon } from "@axon-enterprise/icon";

const releaseNotes = [
  {
    version: "v26.2.0",
    date: "Mar 3, 2026",
    items: [
      { tag: "New",         text: __("CET: Human Trafficking — trainees identify trafficking indicators and coordinate with investigators during a domestic violence response") },
      { tag: "New",         text: __("Rifle VR Controller (VRM4R) — practice rifle-based skills in Tactical Clearance, Handgun Targets, Rifle Targets, and Rifle Transitions") },
      { tag: "New",         text: __("VRM4R optics support — compatible with VR optics for realistic sight alignment") },
      { tag: "Improvement", text: __("VR Rifle now accepted as a valid input in Handgun Targets with no changes to UX or learning objectives") },
      { tag: "Improvement", text: __("Mandatory firmware update enforced on launch — headsets and controllers must be updated to latest version before training can begin") },
      { tag: "Fix",         text: __("Fixed headset not entering passthrough mode when stepping outside the virtual boundary") },
    ],
  },
  {
    version: "v26.1.0",
    date: "Jan 20, 2026",
    items: [
      { tag: "New",         text: __("vRBT Corrections scenarios — use-of-force training designed for institutional environments with de-escalation and proportional response focus") },
      { tag: "New",         text: __("UNPC 2.5 — updated use-of-force decision-making content") },
      { tag: "Improvement", text: __("Improved controller firmware compatibility across VIVE Focus 3 and Focus Vision headsets") },
    ],
  },
];

const faqItems = [
  {
    id: "faq-1",
    title: __("The headset menu is loaded way out of view — how do I re-center it?"),
    content: __("Look straight ahead at a neutral point in the room, then hold the headset's recenter button (or select Re-center from the quick menu). This resets the virtual horizon to match your current head position. If the issue persists after recentering, remove and reseat the headset."),
  },
  {
    id: "faq-2",
    title: __("How do I pair a controller with the headset?"),
    content: __("From the headset home menu, go to Settings → Controllers and select Pair New Controller. Hold the controller's power button until the LED blinks rapidly, then confirm pairing in the headset. If the controller doesn't appear, ensure it's charged and within 1–2 feet of the headset during pairing."),
  },
  {
    id: "faq-3",
    title: __("How do I connect the headset to Wi-Fi?"),
    content: __("From the headset home menu, go to Settings → Wi-Fi and select your network. The headset must be connected before launching Simulator Training or vRBT. If the network doesn't appear, move closer to the access point or have your IT team verify that the VR headset MAC address is allowlisted."),
  },
  {
    id: "faq-4",
    title: __("My content download is stuck at 0% — how do I fix it?"),
    content: __("First confirm the headset has an active Wi-Fi connection and sufficient storage. From ArborXR, force-sync the device. If the download remains stuck, restart the headset and try again. Downloads can stall if the headset entered sleep mode mid-download — disable auto-sleep during large updates."),
  },
  {
    id: "faq-5",
    title: __("My handgun controller is blinking red — what does that mean?"),
    content: __("A red blinking LED typically indicates low battery. Place the controller on its charger and wait until the LED turns solid before use. If it blinks red immediately after charging, the controller may need a firmware update — go to Settings → Controller Firmware in the headset to check."),
  },
  {
    id: "faq-6",
    title: __("How do I push content to headsets?"),
    content: __("Navigate to Content Management from the VR Training home. Select the content or playlist you want to distribute, choose your target devices or groups, and click Push Content. Devices must be online and synced with ArborXR to receive the push."),
  },
  {
    id: "faq-7",
    title: __("How do I exit or restart a scenario mid-session?"),
    content: __("Press the menu button on the controller to open the in-scenario pause menu. From there you can Resume, Restart, or Exit to the home library. If the controller is unresponsive, remove the headset briefly — the scenario will pause automatically when the headset detects it's been removed."),
  },
  {
    id: "faq-8",
    title: __("How do I get out of kiosk mode?"),
    content: __("Kiosk mode locks the headset to a single app for unattended use. To exit, open the ArborXR admin panel from your tablet or browser, select the device, and disable kiosk mode. You can also exit locally by holding the power button for 10 seconds, though this will restart the headset."),
  },
  {
    id: "faq-9",
    title: __("My AAR results aren't showing up after a session — what's wrong?"),
    content: __("AAR data uploads when the headset is connected to Wi-Fi at the end of a session. If results are missing, check that the headset was online when the session ended and that the trainee completed the scenario rather than force-quitting. Reports can take a few minutes to appear. If logs are still missing after 15 minutes, contact support."),
  },
  {
    id: "faq-10",
    title: __("How much space does each officer need for a VR session?"),
    content: __("Axon recommends a minimum 6.5 ft × 6.5 ft (2m × 2m) clear area per headset. Set up a guardian boundary during first use so the system alerts trainees before they reach a wall or obstacle. For group sessions, stagger headsets to avoid accidental contact between trainees."),
  },
];

const quickLinks = [
  {
    Icon: FileTypeDocumentIcon,
    title: __("VR Documentation"),
    description: __("Full VR product docs, setup guides, and admin reference"),
    action: { label: __("Open Docs"), href: "https://my.axon.com/s/Axon-VR-training" },
  },
  {
    Icon: MagicStarsIcon,
    title: __("Axon Assist"),
    description: __("AI chatbot trained on all VR docs and release notes"),
    action: { label: __("Open Axon Assist"), onClick: () => window.__openAxonAssist?.() },
  },
  {
    Icon: LaunchIcon,
    title: __("Axon Community"),
    description: __("Join discussions, share feedback, and connect with other agencies"),
  },
];

export default function Help() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="vr-sub-page">

      <p className="vr-body">{__("Access release notes, documentation links, and Axon Assist for VR training support.")}</p>

      <div className="vr-playlist-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {quickLinks.map((link, i) => (
          <div key={i} className="vr-panel">
            <div className="vr-panel-body">
              <div className="vr-stack vr-stack--s">
                <div className="vr-row vr-row--gap-s">
                  <link.Icon style={{ width: 18, height: 18, color: "var(--vr-muted)" }} />
                  <span className="vr-body-sm">{link.title}</span>
                </div>
                <p className="vr-caption">{link.description}</p>
                {link.action && (
                  link.action.href
                    ? <a href={link.action.href} target="_blank" rel="noreferrer" className="vr-btn-secondary" style={{ alignSelf: "flex-start", textDecoration: "none" }}><LaunchIcon style={{ width: 13, height: 13 }} />{link.action.label}</a>
                    : <button className="vr-btn-secondary" style={{ alignSelf: "flex-start" }} onClick={link.action.onClick}><MagicStarsIcon style={{ width: 13, height: 13 }} />{link.action.label}</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="vr-panel">
        <div className="vr-panel-header">
          <p className="vr-panel-title">{__("Release Notes")}</p>
          <span className="vr-stamp-green">{__("Latest")}</span>
        </div>
        <div className="vr-panel-body" style={{ padding: "0 20px" }}>
          {releaseNotes.map((r, i) => (
            <div key={i} className="vr-list-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
              <div className="vr-row vr-row--gap-s">
                <span className="vr-body-sm" style={{ fontWeight: 600 }}>{r.version}</span>
                <span className="vr-stamp-blue">{r.date}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
                {r.items.map((item, j) => (
                  <div key={j} className="vr-row vr-row--gap-s" style={{ alignItems: "flex-start" }}>
                    <span className={item.tag === "New" ? "vr-stamp-green" : item.tag === "Fix" ? "vr-stamp-orange" : "vr-stamp-blue"} style={{ flexShrink: 0, marginTop: 1 }}>{item.tag}</span>
                    <span className="vr-caption">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ padding: "12px 0 4px" }}>
            <a
              href="https://www.axon.com/help/release-notes/vr-training.htm"
              target="_blank"
              rel="noreferrer"
              className="vr-btn-secondary"
              style={{ textDecoration: "none" }}
            >
              <LaunchIcon style={{ width: 13, height: 13 }} />
              {__("View all release notes")}
            </a>
          </div>
        </div>
      </div>

      <div className="vr-panel">
        <div className="vr-panel-header">
          <p className="vr-panel-title">{__("Frequently Asked Questions")}</p>
        </div>
        <div className="vr-panel-body" style={{ padding: "0 20px" }}>
          <div className="vr-accordion">
            {faqItems.map(faq => (
              <div key={faq.id} className="vr-accordion-item">
                <button
                  className="vr-accordion-trigger"
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                >
                  {faq.title}
                  <span className={`vr-accordion-chevron${openId === faq.id ? " vr-accordion-chevron--open" : ""}`}>▾</span>
                </button>
                {openId === faq.id && (
                  <div className="vr-accordion-body">{faq.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
