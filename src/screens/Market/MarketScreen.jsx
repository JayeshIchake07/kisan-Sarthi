import { useState } from "react";
import { D } from "../../data/seedData";
import { CROPS } from "../../data/crops";
import Card from "../../components/common/Card";

/**
 * Market Prices screen — mandi price comparison across districts.
 *
 * @returns {JSX.Element}
 */
export default function MarketScreen() {
  const [crop, setCrop] = useState("Onion");

  const prices = D.market
    .filter((p) => p.commodity === crop)
    .sort((a, b) => b.price - a.price);

  const best = prices[0]?.price || 0;
  const worst = prices[prices.length - 1]?.price || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Crop filter tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {CROPS.map((c) => (
          <button
            key={c}
            onClick={() => setCrop(c)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              whiteSpace: "nowrap",
              background: crop === c ? "#059669" : "var(--bg-card)",
              color: crop === c ? "#fff" : "var(--color-text-muted)",
              flexShrink: 0,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Best / Worst price cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <div
          style={{
            background: "#041a0d",
            border: "1px solid #065f46",
            borderRadius: 14,
            padding: 14,
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "var(--color-healthy)",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            ₹{best}
          </div>
          <div
            style={{
              color: "var(--color-label)",
              fontSize: 11,
              marginTop: 3,
            }}
          >
            Best Price / quintal
          </div>
        </div>
        <Card style={{ textAlign: "center" }}>
          <div
            style={{
              color: "var(--color-text-primary)",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            ₹{worst}
          </div>
          <div
            style={{
              color: "var(--color-label)",
              fontSize: 11,
              marginTop: 3,
            }}
          >
            Lowest / quintal
          </div>
        </Card>
      </div>

      {/* Mandi price list */}
      {prices.map((p, i) => (
        <div
          key={i}
          style={{
            background: i === 0 ? "#041a0d" : "var(--bg-card)",
            border: `1px solid ${i === 0 ? "#065f46" : "var(--border-card)"}`,
            borderRadius: 14,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: i === 0 ? "#059669" : "var(--bg-input)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: i === 0 ? "#fff" : "var(--color-label)",
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: "var(--color-text-bright)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {p.mandi}
            </div>
            <div
              style={{
                color: "var(--color-label)",
                fontSize: 11,
                marginTop: 2,
              }}
            >
              {p.district}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                color:
                  i === 0
                    ? "var(--color-healthy)"
                    : "var(--color-text-primary)",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              ₹{p.price}
            </div>
            <div
              style={{
                color: "var(--color-label)",
                fontSize: 10,
              }}
            >
              per quintal
            </div>
          </div>
        </div>
      ))}

      <div
        style={{
          color: "var(--color-text-dim)",
          fontSize: 11,
          textAlign: "center",
          paddingBottom: 8,
        }}
      >
        Source: Agmarknet · data.gov.in · Updated daily
      </div>
    </div>
  );
}
