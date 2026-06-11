import { useState } from "react";
import { D } from "../../data/seedData";
import { CROPS, CROP_COLORS } from "../../data/crops";
import { FPO_NAMES } from "../../data/fpos";
import Card from "../../components/common/Card";
import Label from "../../components/common/Label";

/**
 * FPO Dashboard screen — overview for Farmer Producer Organisations.
 * Shows farm health stats, crop distribution, and input order tracking.
 *
 * @returns {JSX.Element}
 */
export default function FPOScreen() {
  const [fi, setFi] = useState(0);
  const fid = fi + 1;
  const fp = D.plots.filter((p) => p.fpoId === fid);
  const h = fp.filter((p) => p.stress === "healthy").length;
  const m = fp.filter((p) => p.stress === "mild").length;
  const s = fp.filter((p) => p.stress === "severe").length;

  const orders = [
    {
      id: 1,
      farmer: "Ramesh Patil",
      item: "DAP Fertilizer 50kg",
      status: "Delivered",
      scolor: "#10b981",
    },
    {
      id: 2,
      farmer: "Sunita Bhosale",
      item: "Coragen 150ml",
      status: "In Transit",
      scolor: "#60a5fa",
    },
    {
      id: 3,
      farmer: "Vijay More",
      item: "Drip Irrigation Kit",
      status: "Processing",
      scolor: "#f59e0b",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* FPO selector tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {FPO_NAMES.map((n, i) => (
          <button
            key={i}
            onClick={() => setFi(i)}
            style={{
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              whiteSpace: "nowrap",
              background: fi === i ? "#059669" : "var(--bg-card)",
              color: fi === i ? "#fff" : "var(--color-text-muted)",
              flexShrink: 0,
            }}
          >
            {n.replace(" FPO", "")}
          </button>
        ))}
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {[
          [fp.length, "Total Farms", "🌾", "var(--color-text-primary)"],
          [h, "Healthy", "✅", "#10b981"],
          [m + s, "Need Attention", "⚠️", "#f59e0b"],
          [s, "Critical", "🚨", "#ef4444"],
        ].map(([v, l, ic, c]) => (
          <Card key={l} style={{ border: `1px solid ${c}22` }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{ic}</div>
            <div
              style={{
                color: c,
                fontSize: 26,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {v}
            </div>
            <div
              style={{
                color: "var(--color-label)",
                fontSize: 11,
                marginTop: 4,
              }}
            >
              {l}
            </div>
          </Card>
        ))}
      </div>

      {/* Crop distribution */}
      <Card>
        <Label>Crop Distribution</Label>
        {CROPS.map((crop) => {
          const cnt = fp.filter((p) => p.crop === crop).length;
          const pct = fp.length ? (cnt / fp.length) * 100 : 0;
          return (
            <div
              key={crop}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 62,
                  color: "var(--color-text-muted)",
                  fontSize: 11,
                  textAlign: "right",
                }}
              >
                {crop}
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
                    width: `${pct}%`,
                    background: CROP_COLORS[crop],
                    borderRadius: 4,
                    transition: "width 0.8s",
                  }}
                />
              </div>
              <div
                style={{
                  width: 18,
                  color: "var(--color-text-muted)",
                  fontSize: 11,
                }}
              >
                {cnt}
              </div>
            </div>
          );
        })}
      </Card>

      {/* Recent input orders */}
      <Card>
        <Label>Recent Input Orders</Label>
        {orders.map((o) => (
          <div
            key={o.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingBottom: 10,
              marginBottom: 10,
              borderBottom: "1px solid var(--bg-primary)",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: 13,
                }}
              >
                {o.item}
              </div>
              <div
                style={{
                  color: "var(--color-label)",
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                {o.farmer}
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: 20,
                background: o.scolor + "20",
                color: o.scolor,
                fontWeight: 700,
              }}
            >
              {o.status}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}
