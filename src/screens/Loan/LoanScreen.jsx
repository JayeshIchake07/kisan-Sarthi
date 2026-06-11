import { useState } from "react";
import { D } from "../../data/seedData";
import { ndviColor } from "../../utils/ndviUtils";
import { getLoanScore } from "../../services/scoringService";
import Card from "../../components/common/Card";
import Label from "../../components/common/Label";
import Ring from "../../components/common/Ring";
import Spark from "../../components/common/Spark";

/**
 * Loan Score screen — satellite-based creditworthiness assessment.
 * Banks use this composite score to evaluate crop loan applications.
 *
 * @returns {JSX.Element}
 */
export default function LoanScreen() {
  const [pid, setPid] = useState("");
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);

  async function search() {
    const id = parseInt(pid);
    if (!id || id < 1 || id > 20) return;
    setBusy(true);
    try {
      const scoreData = await getLoanScore(id);
      setRes(scoreData);
    } catch {
      setRes(null);
    }
    setBusy(false);
  }

  const rc = res
    ? res.score >= 75
      ? "#10b981"
      : res.score >= 50
        ? "#f59e0b"
        : "#ef4444"
    : "#10b981";

  const rec = res
    ? res.score >= 75
      ? "Recommend loan up to ₹75,000 at 8% interest."
      : res.score >= 50
        ? "Recommend loan up to ₹40,000 at 10% interest."
        : res.score >= 30
          ? "Recommend loan up to ₹15,000 with crop insurance required."
          : "Recommend agricultural support before loan approval."
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Search card */}
      <Card>
        <Label>Satellite-Based Crop Health Score</Label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={pid}
            onChange={(e) => setPid(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Enter Plot ID  (1–20)"
            type="number"
            style={{
              flex: 1,
              background: "var(--bg-primary)",
              border: "1px solid var(--border-card)",
              borderRadius: 10,
              padding: "11px 13px",
              color: "var(--color-text-bright)",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            onClick={search}
            disabled={busy || !pid}
            style={{
              background: "#059669",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "11px 18px",
              fontSize: 14,
              cursor: "pointer",
              opacity: busy || !pid ? 0.6 : 1,
              fontWeight: 700,
            }}
          >
            {busy ? "…" : "Score"}
          </button>
        </div>
        <div
          style={{
            color: "var(--color-text-dim)",
            fontSize: 11,
            marginTop: 8,
          }}
        >
          Try: 1, 4, 7, 12, 18 · Used by banks for crop loan approval
        </div>
      </Card>

      {/* Results */}
      {res && (
        <>
          {/* Score overview */}
          <Card
            style={{
              display: "flex",
              gap: 14,
              alignItems: "center",
              border: `1px solid ${rc}33`,
            }}
          >
            <Ring score={res.score} size={90} />
            <div>
              <div
                style={{
                  color: "var(--color-text-bright)",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {res.plot?.farmer}
              </div>
              <div
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {res.plot?.crop} · {res.plot?.district}
              </div>
              <div
                style={{
                  color: rc,
                  fontWeight: 700,
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                {res.score >= 75
                  ? "✓ Creditworthy"
                  : res.score >= 50
                    ? "△ Moderate Risk"
                    : "✗ High Risk"}
              </div>
            </div>
          </Card>

          {/* Sub-score breakdown */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}
          >
            {[
              ["Consistency", res.con, "40% weight"],
              ["Health", res.hlt, "40% weight"],
              ["Trend", res.trn, "20% weight"],
            ].map(([l, v, w]) => (
              <Card key={l} style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: ndviColor(v / 150),
                    fontWeight: 700,
                    fontSize: 22,
                    lineHeight: 1,
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    color: "var(--color-text-primary)",
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  {l}
                </div>
                <div
                  style={{
                    color: "var(--color-text-dim)",
                    fontSize: 10,
                    marginTop: 2,
                  }}
                >
                  {w}
                </div>
              </Card>
            ))}
          </div>

          {/* Bank recommendation */}
          <Card style={{ border: `1px solid ${rc}33` }}>
            <Label>Bank Recommendation</Label>
            <div
              style={{
                color: "var(--color-text-primary)",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              {rec}
            </div>
          </Card>

          {/* NDVI sparkline */}
          <Card>
            <Label>NDVI History · 6 Months</Label>
            <Spark data={D.hist[parseInt(pid)]} color={rc} h={68} />
          </Card>
        </>
      )}
    </div>
  );
}
