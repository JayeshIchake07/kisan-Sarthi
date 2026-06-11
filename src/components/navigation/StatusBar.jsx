/**
 * Fake iOS-style status bar for the mobile app shell.
 * @returns {JSX.Element}
 */
export default function StatusBar() {
  return (
    <div
      style={{
        background: "var(--bg-statusbar)",
        padding: "10px 18px 6px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span style={{ color: "var(--color-text-dim)", fontSize: 12, fontWeight: 600 }}>
        9:41
      </span>
      <span style={{ color: "var(--color-text-dim)", fontSize: 11 }}>
        ●●●● WiFi 🔋
      </span>
    </div>
  );
}
