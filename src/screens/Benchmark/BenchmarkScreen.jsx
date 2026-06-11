import { useState } from "react";
import { D } from "../../data/seedData";
import { DISTRICTS } from "../../data/districts";
import { generateImprovementTips } from "../../services/advisoryService";
import Card from "../../components/common/Card";
import Label from "../../components/common/Label";
import Ring from "../../components/common/Ring";

/**
 * Benchmark screen — farmer performance ranking against district peers.
 * Shows search, score ring, district bar chart, and AI improvement tips.
 *
 * @returns {JSX.Element}
 */
export default function BenchmarkScreen() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(D.plots[2]);
  const [show, setShow] = useState(false);
  const [tips, setTips] = useState("");
  const [busy, setBusy] = useState(false);

  const results =
    q.length > 1
      ? D.plots
          .filter(
            (p) =>
              p.farmer.toLowerCase().includes(q.toLowerCase()) ||
              p.district.toLowerCase().includes(q.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const dp = D.plots.filter((p) => p.district === sel.district);
  const avg = (dp.reduce((a, b) => a + b.ndvi, 0) / dp.length).toFixed(2);
  const rank =
    [...dp].sort((a, b) => b.ndvi - a.ndvi).findIndex((p) => p.id === sel.id) +
    1;
  const pct = Math.round(((dp.length - rank) / dp.length) * 100);
  const score = Math.min(100, Math.round(sel.ndvi * 150));

  const distAvgs = DISTRICTS.map((d) => {
    const ps = D.plots.filter((p) => p.district === d.name);
    return {
      name: d.name,
      avg: ps.reduce((a, b) => a + b.ndvi, 0) / ps.length,
    };
  });
  const maxAvg = Math.max(...distAvgs.map((d) => d.avg));

  async function getTips() {
    setBusy(true);
    try {
      const t = await generateImprovementTips(sel, avg, rank, dp.length);
      setTips(t);
    } catch {
      setTips("Could not generate tips.");
    }
    setBusy(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Search */}
      <div style={{ position: "relative" }}>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setShow(true);
          }}
          placeholder="Search farmer or district…"
          style={{
            width: "100%",
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: 12,
            padding: "11px 14px",
            color: "var(--color-text-bright)",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {show && results.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              borderRadius: 12,
              zIndex: 30,
              overflow: "hidden",
              marginTop: 4,
            }}
          >
            {results.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSel(p);
                  setQ("");
                  setShow(false);
                  setTips("");
                }}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--bg-primary)",
                  color: "var(--color-text-primary)",
                  fontSize: 13,
                }}
              >
                {p.farmer} — {p.crop}, {p.district}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Score card */}
      <Card style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <Ring score={score} size={80} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: "var(--color-text-bright)",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {sel.farmer}
          </div>
          <div
            style={{
              color: "var(--color-text-muted)",
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {sel.crop} · {sel.district}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            {[
              ["#" + rank, "Rank"],
              [pct + "th", "Percentile"],
              [avg, "Dist. avg"],
            ].map(([v, l]) => (
              <div key={l}>
                <div
                  style={{
                    color: "var(--color-healthy)",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    color: "var(--color-label)",
                    fontSize: 10,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* District NDVI bar chart */}
      <Card>
        <Label>Average NDVI by District</Label>
        {distAvgs.map((d) => (
          <div
            key={d.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 70,
                color: "var(--color-text-muted)",
                fontSize: 11,
                textAlign: "right",
              }}
            >
              {d.name}
            </div>
            <div
              style={{
                flex: 1,
                height: 18,
                background: "var(--bg-primary)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(d.avg / maxAvg) * 100}%`,
                  background:
                    d.name === sel.district
                      ? "var(--color-healthy)"
                      : "var(--border-elevated)",
                  borderRadius: 4,
                  transition: "width 0.8s",
                }}
              />
            </div>
            <div
              style={{
                width: 30,
                color:
                  d.name === sel.district
                    ? "var(--color-healthy)"
                    : "var(--color-label)",
                fontSize: 11,
                fontWeight: d.name === sel.district ? 700 : 400,
              }}
            >
              {d.avg.toFixed(2)}
            </div>
          </div>
        ))}
      </Card>

      {/* AI Tips */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Label>AI Improvement Tips</Label>
          <button
            onClick={getTips}
            disabled={busy}
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-card)",
              color: "#6ee7b7",
              borderRadius: 8,
              padding: "5px 12px",
              fontSize: 12,
              cursor: "pointer",
              marginTop: -10,
            }}
          >
            {busy ? "Thinking…" : "✦ Get Tips"}
          </button>
        </div>
        {tips ? (
          <div
            style={{
              color: "var(--color-text-secondary)",
              fontSize: 13,
              lineHeight: 1.8,
              whiteSpace: "pre-line",
            }}
          >
            {tips}
          </div>
        ) : (
          <div
            style={{
              color: "var(--color-text-dim)",
              fontSize: 13,
              fontStyle: "italic",
            }}
          >
            Tap "Get Tips" for AI-personalised advice for {sel.farmer}
          </div>
        )}
      </Card>
    </div>
  );
}
