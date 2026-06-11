import { useRef, useEffect, useCallback } from "react";
import { DISTRICTS } from "../../data/districts";
import { ndviColor } from "../../utils/ndviUtils";
import { geoToPixel, calcBounds } from "../../utils/mapUtils";

const PAD = 28;

/**
 * Interactive canvas map rendering farm plots with NDVI color coding.
 * Features animated pulse zones for severe stress clusters and click-to-select.
 *
 * @param {Object} props
 * @param {import("../../data/seedData").Plot[]} props.plots - Plots to render
 * @param {number|null} props.selId - Currently selected plot ID
 * @param {(id: number|null) => void} props.onSelect - Selection callback
 * @returns {JSX.Element}
 */
export default function CanvasMap({ plots, selId, onSelect }) {
  const ref = useRef(null);
  const raf = useRef(0);
  const tick = useRef(0);

  const bounds = calcBounds(plots);

  const toXY = useCallback(
    (lat, lon, W, H) => geoToPixel(lat, lon, W, H, bounds, PAD),
    [bounds.minLat, bounds.maxLat, bounds.minLon, bounds.maxLon]
  );

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function draw() {
      tick.current++;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#060f09";
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = "#0d1f11";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        ctx.beginPath();
        ctx.moveTo(PAD + (i * (W - PAD * 2)) / 5, PAD);
        ctx.lineTo(PAD + (i * (W - PAD * 2)) / 5, H - PAD);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(PAD, PAD + (i * (H - PAD * 2)) / 5);
        ctx.lineTo(W - PAD, PAD + (i * (H - PAD * 2)) / 5);
        ctx.stroke();
      }

      // District labels
      ctx.textAlign = "center";
      ctx.font = "9px Inter,sans-serif";
      DISTRICTS.forEach((d) => {
        const { x, y } = toXY(d.lat, d.lon, W, H);
        ctx.fillStyle = "#0f2016";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1e4030";
        ctx.fillText(d.name.slice(0, 3).toUpperCase(), x, y + 3);
      });

      // Severe pulse zone (Nashik cluster)
      const sev = plots.filter(
        (p) => p.stress === "severe" && p.district === "Nashik"
      );
      if (sev.length >= 2) {
        const cx =
          sev.reduce((a, p) => a + toXY(p.lat, p.lon, W, H).x, 0) /
          sev.length;
        const cy =
          sev.reduce((a, p) => a + toXY(p.lat, p.lon, W, H).y, 0) /
          sev.length;
        const pulse = (Math.sin(tick.current * 0.04) + 1) / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 30 + pulse * 12, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239,68,68,${0.15 + pulse * 0.2})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Plot dots
      plots.forEach((p) => {
        const { x, y } = toXY(p.lat, p.lon, W, H);
        const col = ndviColor(p.ndvi);
        const isSel = p.id === selId;

        // Severe stress pulse
        if (p.stress === "severe") {
          const pulse = (Math.sin(tick.current * 0.06) + 1) / 2;
          ctx.beginPath();
          ctx.arc(x, y, 10 + pulse * 7, 0, Math.PI * 2);
          ctx.strokeStyle = col + "44";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Selection ring
        if (isSel) {
          ctx.beginPath();
          ctx.arc(x, y, 16, 0, Math.PI * 2);
          ctx.strokeStyle = "#ffffff44";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Main dot
        ctx.beginPath();
        ctx.arc(x, y, isSel ? 9 : 6, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();

        // Center highlight for selected
        if (isSel) {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
        }
      });

      raf.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf.current);
  }, [plots, selId, toXY]);

  function handleClick(e) {
    const canvas = ref.current;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    let best = null;
    let bd = 18;

    plots.forEach((p) => {
      const { x, y } = toXY(p.lat, p.lon, canvas.width, canvas.height);
      const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
      if (dist < bd) {
        bd = dist;
        best = p;
      }
    });

    onSelect(best ? (best.id === selId ? null : best.id) : null);
  }

  return (
    <canvas
      ref={ref}
      width={560}
      height={290}
      onClick={handleClick}
      style={{
        width: "100%",
        height: "auto",
        cursor: "crosshair",
        display: "block",
      }}
    />
  );
}
