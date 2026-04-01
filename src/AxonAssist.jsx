import { useState } from "react";
import { MagicStarsIcon, CloseIcon } from "@axon-enterprise/icon";

export default function AxonAssist() {
  const [open, setOpen] = useState(false);

  // Allow other components to open Axon Assist via a custom event
  if (typeof window !== "undefined") {
    window.__openAxonAssist = () => setOpen(true);
  }
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: __("Hi! I'm Axon Assist. I can help you find answers across all VR Hub documentation, release notes, training guides, and more. What do you need?"),
    },
  ]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [
      ...m,
      { role: "user", text: input },
      { role: "assistant", text: __("Thanks for your question! I'm searching the VR documentation for an answer. (This is a prototype — real responses would come from the Axon knowledge base.)") },
    ]);
    setInput("");
  };

  return (
    <>
      {open && (
        <div className="vr-assist-panel">
          <div className="vr-assist-header">
            <div className="vr-assist-header-left">
              <MagicStarsIcon style={{ width: 18, height: 18 }} />
              {__("Axon Assist")}
              <span className="vr-stamp-blue" style={{ background: "rgba(107,193,255,0.2)", color: "#6bc1ff" }}>{__("VR Docs")}</span>
            </div>
            <button className="vr-assist-close" onClick={() => setOpen(false)}>
              <CloseIcon style={{ width: 16, height: 16 }} />
            </button>
          </div>

          <div className="vr-assist-messages">
            {messages.map((m, i) => (
              <div key={i} className={`vr-assist-bubble vr-assist-bubble--${m.role === "user" ? "user" : "bot"}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="vr-assist-input-row">
            <input
              className="vr-assist-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder={__("Ask about VR training...")}
            />
            <button className="vr-assist-send" onClick={send}>
              <MagicStarsIcon style={{ width: 16, height: 16 }} />
            </button>
          </div>
          <div className="vr-assist-footer">
            {__("Powered by Axon Assist · Searches all VR documentation")}
          </div>
        </div>
      )}

      <button className="vr-assist-fab" onClick={() => setOpen(v => !v)} aria-label={__("Axon Assist")}>
        {open
          ? <CloseIcon style={{ width: 20, height: 20 }} />
          : <MagicStarsIcon style={{ width: 20, height: 20 }} />
        }
      </button>
    </>
  );
}
