import Card from "../../components/common/Card";
import Label from "../../components/common/Label";

/**
 * Climate Alerts screen — weather warnings, crop vulnerability, and alert history.
 *
 * @returns {JSX.Element}
 */
export default function ClimateScreen() {
  const alerts = [
    {
      type: "Heatwave",
      district: "Nashik",
      sev: "critical",
      farms: 14,
      msg: "Max temp 42°C forecast Fri–Sun. Wheat in flowering stage faces 40% yield loss.",
    },
    {
      type: "Heavy Rain",
      district: "Pune",
      sev: "warning",
      farms: 8,
      msg: "60mm rainfall Thursday. Harvest-ready onion crops at risk of field rotting.",
    },
    {
      type: "Pest Outbreak",
      district: "Solapur",
      sev: "critical",
      farms: 23,
      msg: "Cotton bollworm cluster detected across 23 adjacent farms. Spray within 48h.",
    },
  ];

  const vuln = [
    { crop: "Wheat", stage: "Flowering", risk: 85 },
    { crop: "Cotton", stage: "Boll Dev.", risk: 72 },
    { crop: "Onion", stage: "Harvest", risk: 65 },
    { crop: "Rice", stage: "Grain Fill", risk: 38 },
    { crop: "Sugarcane", stage: "Vegetative", risk: 20 },
  ];

  const hist = [
    ["June 3", "Frost Risk", "Nagpur"],
    ["May 28", "Locust Warning", "Solapur"],
    ["May 19", "Drought Watch", "Aurangabad"],
    ["May 11", "Hailstorm", "Nashik"],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ color: "var(--color-label)", fontSize: 11 }}>
        Auto-refreshed daily 6 AM · Open-Meteo + NASA FIRMS
      </div>

      {/* Alert cards */}
      {alerts.map((a, i) => {
        const isCrit = a.sev === "critical";
        return (
          <div
            key={i}
            style={{
              background: isCrit ? "#150505" : "#140c00",
              border: `1px solid ${isCrit ? "#7f1d1d" : "#92400e"}`,
              borderRadius: 14,
              padding: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: isCrit ? "#7f1d1d" : "#92400e",
                  color: "#fff",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {a.sev}
              </span>
              <span
                style={{
                  color: "#f1f5f4",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {a.type}
              </span>
              <span
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: 12,
                  marginLeft: "auto",
                }}
              >
                {a.district}
              </span>
            </div>
            <div
              style={{
                color: "var(--color-text-primary)",
                fontSize: 13,
                lineHeight: 1.65,
                marginBottom: 10,
              }}
            >
              {a.msg}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: 11,
                }}
              >
                🌾 {a.farms} farms
              </span>
              <span
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: 11,
                }}
              >
                📱 SMS sent
              </span>
              <button
                style={{
                  marginLeft: "auto",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-elevated)",
                  color: "#6ee7b7",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Notify ATMA →
              </button>
            </div>
          </div>
        );
      })}

      {/* Crop Vulnerability Index */}
      <Card>
        <Label>Crop Vulnerability Index</Label>
        {vuln.map((v) => (
          <div
            key={v.crop}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 9,
            }}
          >
            <div
              style={{
                width: 56,
                color: "var(--color-text-muted)",
                fontSize: 11,
              }}
            >
              {v.crop}
            </div>
            <div
              style={{
                width: 58,
                color: "var(--color-text-dim)",
                fontSize: 10,
              }}
            >
              {v.stage}
            </div>
            <div
              style={{
                flex: 1,
                height: 16,
                background: "var(--bg-primary)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${v.risk}%`,
                  background:
                    v.risk > 70
                      ? "#ef4444"
                      : v.risk > 50
                        ? "#f59e0b"
                        : "#10b981",
                  borderRadius: 4,
                  transition: "width 0.8s",
                }}
              />
            </div>
            <div
              style={{
                width: 30,
                color: "var(--color-text-primary)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {v.risk}%
            </div>
          </div>
        ))}
      </Card>

      {/* Alert History */}
      <Card>
        <Label>Alert History · Last 30 Days</Label>
        {hist.map(([d, t, dist]) => (
          <div
            key={d}
            style={{
              display: "flex",
              gap: 10,
              paddingBottom: 8,
              marginBottom: 8,
              borderBottom: "1px solid var(--bg-primary)",
            }}
          >
            <span
              style={{
                color: "var(--color-text-dim)",
                fontSize: 11,
                width: 50,
                flexShrink: 0,
              }}
            >
              {d}
            </span>
            <span
              style={{
                color: "var(--color-text-muted)",
                fontSize: 12,
                flex: 1,
              }}
            >
              {t} · {dist}
            </span>
            <span
              style={{
                color: "var(--color-healthy)",
                fontSize: 11,
              }}
            >
              ✓
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}
