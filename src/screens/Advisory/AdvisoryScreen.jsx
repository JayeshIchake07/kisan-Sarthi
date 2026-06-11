import { useState } from "react";
import { D } from "../../data/seedData";
import { ndviColor } from "../../utils/ndviUtils";
import { generateBatchAdvisory } from "../../services/advisoryService";

/**
 * Advisory screen — batch advisory generation for stressed farms.
 * Lists all non-healthy farms with expand/collapse, AI generation, and SMS actions.
 *
 * @returns {JSX.Element}
 */
export default function AdvisoryScreen() {
  const stressed = D.plots.filter((p) => p.stress !== "healthy");
  const [items, setItems] = useState(
    stressed.map((p) => ({ ...p, status: "pending", text: "" }))
  );
  const [exp, setExp] = useState(null);
  const [busy, setBusy] = useState({});

  async function gen(id) {
    const p = items.find((x) => x.id === id);
    if (!p) return;
    setBusy((b) => ({ ...b, [id]: true }));
    try {
      const t = await generateBatchAdvisory(p);
      setItems((prev) =>
        prev.map((x) =>
          x.id === id ? { ...x, text: t, status: "sent" } : x
        )
      );
      setExp(id);
    } catch {
      setItems((prev) =>
        prev.map((x) =>
          x.id === id ? { ...x, status: "failed" } : x
        )
      );
    }
    setBusy((b) => ({ ...b, [id]: false }));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Header with generate-all */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
          {items.length} farms need attention
        </span>
        <button
          onClick={() =>
            items
              .filter((i) => !i.text && !busy[i.id])
              .forEach((i) => gen(i.id))
          }
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-elevated)",
            color: "#6ee7b7",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Generate All
        </button>
      </div>

      {/* Farm list */}
      {[...items]
        .sort((a, b) => (a.stress === "severe" ? -1 : 1))
        .map((item) => {
          const sc =
            item.status === "sent"
              ? "#10b981"
              : item.status === "failed"
                ? "#ef4444"
                : "#f59e0b";

          return (
            <div
              key={item.id}
              style={{
                background: "var(--bg-card)",
                border: `1px solid ${item.stress === "severe" ? "#7f1d1d" : "#78350f"}44`,
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              {/* Collapsed row */}
              <div
                onClick={() => setExp(exp === item.id ? null : item.id)}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "12px 14px",
                  cursor: "pointer",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: ndviColor(item.ndvi) + "25",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: ndviColor(item.ndvi),
                    flexShrink: 0,
                  }}
                >
                  {item.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: "var(--color-text-bright)",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {item.farmer}
                  </div>
                  <div
                    style={{
                      color: "var(--color-label)",
                      fontSize: 11,
                      marginTop: 1,
                    }}
                  >
                    {item.crop} · {item.district} · {item.ndvi}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: sc + "20",
                      color: sc,
                      fontWeight: 700,
                    }}
                  >
                    {item.status === "sent"
                      ? "✓ Sent"
                      : item.status === "failed"
                        ? "✗ Failed"
                        : "Pending"}
                  </span>
                  <span
                    style={{ color: "var(--color-text-dim)", fontSize: 11 }}
                  >
                    {exp === item.id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expanded detail */}
              {exp === item.id && (
                <div
                  style={{
                    borderTop: "1px solid var(--bg-input)",
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {item.text ? (
                    <div
                      style={{
                        background: "var(--bg-primary)",
                        borderRadius: 10,
                        padding: 12,
                        color: "var(--color-text-secondary)",
                        fontSize: 13,
                        lineHeight: 1.75,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {item.text}
                    </div>
                  ) : (
                    <div
                      style={{
                        color: "var(--color-text-dim)",
                        fontSize: 13,
                        fontStyle: "italic",
                      }}
                    >
                      No advisory yet.
                    </div>
                  )}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={() => gen(item.id)}
                      disabled={busy[item.id]}
                      style={{
                        background: "#059669",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "10px",
                        fontSize: 13,
                        cursor: "pointer",
                        opacity: busy[item.id] ? 0.6 : 1,
                        fontWeight: 600,
                      }}
                    >
                      {busy[item.id]
                        ? "⏳ Generating…"
                        : "✦ Generate & SMS"}
                    </button>
                    <button
                      style={{
                        background: "var(--bg-input)",
                        color: "#6ee7b7",
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 13px",
                        cursor: "pointer",
                      }}
                    >
                      📞
                    </button>
                    <button
                      style={{
                        background: "var(--bg-input)",
                        color: "#6ee7b7",
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 13px",
                        cursor: "pointer",
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                  <div
                    style={{
                      color: "var(--color-text-dim)",
                      fontSize: 11,
                    }}
                  >
                    📱 +91{item.phone} ·{" "}
                    {item.lang === "mr" ? "Marathi" : "Hindi"}
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
