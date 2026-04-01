import { useState, useEffect } from "react";
import {
  LogoAxonIcon,
  VRIcon,
  HomeIcon,
  CarPoliceIcon,
  AdminIcon,
  ThemeIcon,
  SearchIcon,
  SettingsIcon,
  MagicStarsIcon,
  MenuIcon,
} from "@axon-enterprise/icon";

import HubLanding from "./HubLanding";
import AfterActionReviews from "./AfterActionReviews";
import Insights from "./Insights";
import CMS from "./CMS";
import Playlists from "./Playlists";
import Configure from "./Configure";
import Help from "./Help";
import AxonAssist from "./AxonAssist";

const pages = {
  hub:       { label: __("VR Training"),          component: HubLanding },
  aar:       { label: __("After Action Reviews"), component: AfterActionReviews },
  cms:       { label: __("Content Management"),    component: CMS },
  playlists: { label: __("Playlists"),            component: Playlists },
  configure: { label: __("Configure Training"),   component: Configure },
  insights:  { label: __("Insights"),             component: Insights },
  help:      { label: __("Help & Resources"),     component: Help },
};

function NavDots({ expanded }) {
  return (
    <span className="vr-nav-dots">
      <span className="vr-nav-dot vr-nav-dot--active" />
      <span className="vr-nav-dot vr-nav-dot--inactive" />
    </span>
  );
}

export default function App({ theme, onToggleTheme, layer, onToggleLayer }) {
  const [currentPage, setCurrentPage] = useState("hub");
  const [navExpanded, setNavExpanded] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const PageComponent = pages[currentPage].component;
  const isSubPage = currentPage !== "hub";

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileNavOpen(false);
  };

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => { if (e.matches) setMobileNavOpen(false); };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <div className="vr-shell" data-theme={theme} data-layer={layer}>
      {/* ── 3px accent bar (matches ruby-slippers) ── */}
      <div className="vr-accent-bar" />

      {/* ── Mobile overlay backdrop ── */}
      {mobileNavOpen && (
        <div className="vr-overlay" onClick={() => setMobileNavOpen(false)} />
      )}

      {/* ── Sidebar navigation ── */}
      <nav className={`vr-nav${navExpanded ? " vr-nav--expanded" : ""}${mobileNavOpen ? " vr-nav--mobile-open" : ""}`} aria-label={__("Main navigation")}>
        <div className="vr-nav-logo">
          <LogoAxonIcon />
        </div>

        <div className="vr-nav-body">
          <button className="vr-nav-item" onClick={() => {}}>
            <HomeIcon style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span className="vr-nav-label">{__("Evidence")}</span>
          </button>

          <div className="vr-nav-divider" />

          <button
            className="vr-nav-item vr-nav-item--active"
            onClick={() => navigateTo("hub")}
          >
            <VRIcon style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span className="vr-nav-label">{__("VR Training")}</span>
          </button>

          <button className="vr-nav-item" onClick={() => {}}>
            <CarPoliceIcon style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span className="vr-nav-label">{__("Fleet")}</span>
          </button>

          <button className="vr-nav-item" onClick={() => {}}>
            <AdminIcon style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span className="vr-nav-label">{__("Admin")}</span>
          </button>
        </div>

        <div className="vr-nav-footer">
          <button className="vr-nav-item" onClick={() => {}}>
            <SettingsIcon style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span className="vr-nav-label">{__("Settings")}</span>
          </button>
          <button className="vr-nav-item vr-nav-avatar-item" onClick={() => {}}>
            <span className="vr-nav-avatar">JW</span>
            <span className="vr-nav-label">Jada Williams</span>
          </button>
        </div>

        <div className="vr-nav-expand-row">
          <button
            className="vr-nav-expand"
            onClick={() => setNavExpanded(v => !v)}
            aria-label={navExpanded ? __("Collapse navigation") : __("Expand navigation")}
          >
            <NavDots expanded={navExpanded} />
          </button>
        </div>

        <div className="vr-nav-layer-row">
          <button
            className={`vr-layer-toggle${layer === "vision" ? " vr-layer-toggle--vision" : ""}`}
            onClick={onToggleLayer}
            aria-label={layer === "vision" ? __("Switch to Spark base") : __("Switch to Vision")}
          >
            <span className="vr-layer-toggle-dot" />
            <span className="vr-nav-label vr-layer-toggle-label">
              {layer === "vision" ? __("VISION") : __("SPARK BASE")}
            </span>
          </button>
        </div>
      </nav>

      {/* ── Main column ── */}
      <div className="vr-main">

        {/* Top bar */}
        <header className="vr-topbar">
          <div className="vr-topbar-left">
            <button
              className="vr-hamburger"
              onClick={() => setMobileNavOpen(v => !v)}
              aria-label={__("Toggle navigation")}
            >
              <MenuIcon style={{ width: 20, height: 20 }} />
            </button>
            {isSubPage ? (
              <>
                <button
                  className="vr-topbar-back"
                  onClick={() => navigateTo("hub")}
                >
                  ← {__("VR Training")}
                </button>
                <span className="vr-topbar-sep">/</span>
                <span className="vr-topbar-title">{pages[currentPage].label}</span>
              </>
            ) : (
              <>
                <span className="vr-topbar-title">{__("VR Training")}</span>
                <span className="vr-topbar-stamp">{__("VR Training")}</span>
              </>
            )}
          </div>
          <div className="vr-topbar-right">
            <button className="vr-topbar-icon-btn" aria-label={__("Axon Assist")} onClick={() => window.__openAxonAssist?.()}>
              <MagicStarsIcon style={{ width: 18, height: 18 }} />
            </button>
            <button className="vr-topbar-icon-btn" aria-label={theme === "dark" ? __("Switch to light mode") : __("Switch to dark mode")} onClick={onToggleTheme}>
              <ThemeIcon style={{ width: 18, height: 18 }} />
            </button>
            <button className="vr-topbar-icon-btn" aria-label={__("Search")}>
              <SearchIcon style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </header>

        {/* Scrollable page content */}
        <div className="vr-content">
          <PageComponent onNavigate={navigateTo} theme={theme} />
        </div>
      </div>

      <AxonAssist />
    </div>
  );
}
