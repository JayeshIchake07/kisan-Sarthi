import { useState } from "react";
import { D } from "../../data/seedData";
import { ndviColor, ndviLabel } from "../../utils/ndviUtils";
import { generateAdvisory } from "../../services/advisoryService";
import Card from "../../components/common/Card";
import Label from "../../components/common/Label";
import Spark from "../../components/common/Spark";
import BottomSheet from "../../components/common/BottomSheet";
import CanvasMap from "../../components/map/CanvasMap";
import MapLegend from "../../components/map/MapLegend";

/**
 * Satellite map screen — primary dashboard view.
 * Shows NDVI stress overview, interactive canvas map, and farm detail bottom sheet.
 *
 * @returns {JSX.Element}
 */
export default function SatelliteMapScreen() {
  const [filter, setFilter] = useState("all");
  const [selId, setSelId] = useState(null);
  const [open, setOpen] = useState(false);
  const [advisory, setAdvisory] = useState("");
  const [loading, setLoading] = useState(false);

  const plots =
    filter === "all"
      ? D.plots
      : D.plots.filter((p) => p.stress === filter);

  const sel = D.plots.find((p) => p.id === selId);

  const stats = {
    h: D.plots.filter((p) => p.stress === "healthy").length,
    m: D.plots.filter((p) => p.stress === "mild").length,
    s: D.plots.filter((p) => p.stress === "severe").length,
  };

  function pick(id) {
    setSelId(id);
    setAdvisory("");
    if (id) setOpen(true);
  }

  async function getAdvisory() {
    if (!sel) return;
    setLoading(true);
    try {
      const t = await generateAdvisory(sel);
      setAdvisory(t);
    } catch {
      setAdvisory("Network error. Check connectivity.");
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Heatwave Alert */}
      <div
        style={{
          background: "#1c0e00",
          border: "1px solid #92400e",
          borderRadius: 12,
          padding: "10px 14px",
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
        <div>
          <div style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700 }}>
            Heatwave Alert · Nashik District
          </div>
          <div style={{ color: "#d97706aa", fontSize: 11, marginTop: 2 }}>
            42°C forecast Friday–Sunday. 14 farms at risk during wheat
            flowering.
          </div>
        </div>
      </div>

      {/* Stats filter buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          ["🟢", stats.h, "Healthy", "#10b981"],
          ["🟡", stats.m, "Mild", "#f59e0b"],
          ["🔴", stats.s, "Severe", "#ef4444"],
        ].map(([e, n, l, c]) => (
          <button
            key={l}
            onClick={() =>
              setFilter(
                filter === l.toLowerCase() ? "all" : l.toLowerCase()
              )
            }
            style={{
              background:
                filter === l.toLowerCase() ? c + "22" : "var(--bg-card)",
              border: `1px solid ${c}${filter === l.toLowerCase() ? "66" : "22"}`,
              borderRadius: 12,
              padding: "10px 6px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                color: c,
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {n}
            </div>
            <div style={{ color: c + "aa", fontSize: 10, marginTop: 3 }}>
              {l}
            </div>
          </button>
        ))}
      </div>

      {/* Map Card */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "8px 12px 8px",
            background: "var(--bg-primary)",
            borderBottom: "1px solid var(--bg-input)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: "var(--color-text-dim)",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Sentinel-2 · NDVI Live
          </span>
          <span style={{ color: "var(--color-text-dim)", fontSize: 10 }}>
            10m · 5-day revisit
          </span>
        </div>
        <CanvasMap plots={plots} selId={selId} onSelect={pick} />
        <MapLegend />
      </Card>

      <div
        style={{
          color: "var(--color-text-dim)",
          fontSize: 11,
          textAlign: "center",
        }}
      >
        Tap any dot to inspect a farm
      </div>

      {/* Farm detail bottom sheet */}
      <BottomSheet
        open={open && !!sel}
        onClose={() => setOpen(false)}
        title={sel?.farmer || ""}
      >
        {sel && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Quick stats grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[
                [sel.crop, "Crop"],
                [`${sel.acres} ac`, "Area"],
                [sel.district, "District"],
                [`${sel.sowDays}d ago`, "Sown"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  style={{
                    background: "var(--bg-primary)",
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      color: "var(--color-text-bright)",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {v}
                  </div>
                  <div
                    style={{
                      color: "var(--color-label)",
                      fontSize: 11,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>

            {/* NDVI + NDWI indicators */}
            <Card style={{ padding: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <span
                    style={{
                      color: ndviColor(sel.ndvi),
                      fontWeight: 700,
                      fontSize: 24,
                    }}
                  >
                    {sel.ndvi}
                  </span>
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: 12,
                    }}
                  >
                    {" "}
                    NDVI · {ndviLabel(sel.ndvi)}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      color:
                        sel.ndwi < 0.1 ? "#ef4444" : "#10b981",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {sel.ndwi}
                  </span>
                  <div
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: 11,
                    }}
                  >
                    {sel.ndwi < 0.1 ? "⚠ Irrigate now" : "✓ Water OK"}
                  </div>
                </div>
              </div>
              <Spark data={D.hist[sel.id]} color={ndviColor(sel.ndvi)} h={54} />
              <div
                style={{
                  color: "var(--color-text-dim)",
                  fontSize: 10,
                  marginTop: 4,
                }}
              >
                NDVI history · 180 days
              </div>
            </Card>

            {/* AI Advisory button */}
            <button
              onClick={getAdvisory}
              disabled={loading}
              style={{
                background: loading ? "var(--bg-input)" : "#059669",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "13px",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? "default" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {loading
                ? "⏳ Generating AI Advisory…"
                : "✦ Get AI Advisory"}
            </button>

            {/* Advisory text */}
            {advisory && (
              <Card>
                <Label>
                  AI Advisory · {sel.lang === "mr" ? "Marathi" : "Hindi"}
                </Label>
                <div
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: 13,
                    lineHeight: 1.75,
                    whiteSpace: "pre-line",
                  }}
                >
                  {advisory}
                </div>
              </Card>
            )}

            {/* Action buttons */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <button
                style={{
                  background: "var(--bg-input)",
                  color: "#6ee7b7",
                  border: "1px solid var(--border-elevated)",
                  borderRadius: 10,
                  padding: "11px",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                📱 SMS
              </button>
              <button
                style={{
                  background: "var(--bg-input)",
                  color: "#6ee7b7",
                  border: "1px solid var(--border-elevated)",
                  borderRadius: 10,
                  padding: "11px",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                📞 Voice
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
