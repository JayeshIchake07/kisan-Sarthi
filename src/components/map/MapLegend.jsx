/**
 * NDVI color legend for the satellite map.
 * @returns {JSX.Element}
 */
export default function MapLegend() {
  const items = [
    ["#10b981", "Healthy >0.4"],
    ["#f59e0b", "Mild 0.2–0.4"],
    ["#ef4444", "Severe <0.2"],
  ];

  return (
    <div style={{ padding: "8px 12px", display: "flex", gap: 12, flexWrap: "wrap" }}>
      {items.map(([c, l]) => (
        <span
          key={l}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 10,
            color: "var(--color-text-dim)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: c,
              display: "inline-block",
            }}
          />
          {l}
        </span>
      ))}
    </div>
  );
}
