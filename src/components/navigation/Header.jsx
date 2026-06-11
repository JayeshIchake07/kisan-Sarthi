import { TITLES } from "../../utils/constants";

/**
 * App header with Kisan Sarthi branding, live badge, and current screen title.
 *
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab ID
 * @returns {JSX.Element}
 */
export default function Header({ activeTab }) {
  return (
    <div
      style={{
        background: "var(--bg-primary)",
        padding: "8px 14px 0",
        borderBottom: "1px solid var(--bg-card)",
      }}
    >
      {/* Top row: logo + live badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg,#059669,#047857)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🛰️
          </div>
          <div>
            <div
              style={{
                color: "var(--color-text-bright)",
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: -0.5,
              }}
            >
              Kisan Sarthi
            </div>
            <div
              style={{
                color: "var(--color-text-dim)",
                fontSize: 10,
                marginTop: 1,
              }}
            >
              Satellite Crop Intelligence
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-healthy)",
            }}
          />
          <span style={{ color: "var(--color-text-dim)", fontSize: 11 }}>
            Maharashtra · Live
          </span>
        </div>
      </div>

      {/* Screen title bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 10,
        }}
      >
        <span
          style={{
            color: "var(--color-text-secondary)",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {TITLES[activeTab]}
        </span>
        <span style={{ color: "var(--color-text-dim)", fontSize: 11 }}>
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
