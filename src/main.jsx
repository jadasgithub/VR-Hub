import "@axon-enterprise/styles/dist/base.css";
import "@axon-enterprise/styles/dist/theme.css";
import "./vr-hub.css";
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { AppProvider, LinkContext } from "@axon-enterprise/spark";
import App from "./App";

if (!window.__) window.__ = (s) => s;

const THEME_KEY = "vr-hub-theme";
const LAYER_KEY = "vr-hub-layer";

function Root() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || "light";
    } catch {
      return "light";
    }
  });

  const [layer, setLayer] = useState(() => {
    try {
      return localStorage.getItem(LAYER_KEY) || "spark";
    } catch {
      return "spark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(LAYER_KEY, layer);
    } catch {}
  }, [layer]);

  const isInternalLink = (to) => typeof to === "string" && to.startsWith("/");

  return (
    <MemoryRouter>
      <LinkContext.Provider value={{ isInternalLink }}>
        <AppProvider
          theme={theme}
          usageContext="station"
          systemStyle="standard"
          appElement="#root"
        >
          <App
            theme={theme}
            onToggleTheme={() =>
              setTheme((t) => (t === "light" ? "dark" : "light"))
            }
            layer={layer}
            onToggleLayer={() =>
              setLayer((l) => (l === "spark" ? "vision" : "spark"))
            }
          />
        </AppProvider>
      </LinkContext.Provider>
    </MemoryRouter>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
