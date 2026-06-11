import { TABS } from "../../utils/constants";

/**
 * Fixed bottom navigation bar with 7 tabs.
 *
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab ID
 * @param {(tabId: string) => void} props.onTabChange - Tab switch handler
 * @returns {JSX.Element}
 */
export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        background: "var(--bg-statusbar)",
        borderTop: "1px solid var(--bg-card)",
        display: "flex",
        zIndex: 100,
      }}
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onTabChange(t.id)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px 2px 20px",
          }}
        >
          <span
            style={{
              fontSize: 20,
              lineHeight: 1,
              filter:
                activeTab === t.id
                  ? "none"
                  : "grayscale(100%) opacity(0.3)",
              transition: "filter 0.18s",
            }}
          >
            {t.icon}
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: activeTab === t.id ? 700 : 400,
              color:
                activeTab === t.id
                  ? "var(--color-healthy)"
                  : "var(--color-text-dim)",
              transition: "color 0.18s",
            }}
          >
            {t.label}
          </span>
          {activeTab === t.id && (
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "var(--color-healthy)",
                marginTop: 1,
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
