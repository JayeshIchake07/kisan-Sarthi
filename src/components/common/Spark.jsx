import { useRef, useEffect } from "react";

/**
 * Canvas-based sparkline chart for NDVI history visualization.
 *
 * @param {Object} props
 * @param {Array<{ndvi: number}>} props.data - Array of NDVI data points
 * @param {string} [props.color="#10b981"] - Stroke color
 * @param {number} [props.h=50] - Canvas height in pixels
 * @returns {JSX.Element}
 */
export default function Spark({ data, color = "#10b981", h = 50 }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c || !data?.length) return;

    const ctx = c.getContext("2d");
    const W = c.width;
    const H = c.height;
    ctx.clearRect(0, 0, W, H);

    const vals = data.map((d) => d.ndvi);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const tx = (i) => (i / (vals.length - 1)) * W;
    const ty = (v) => H - 4 - ((v - min) / (max - min || 0.01)) * (H - 8);

    // Stroke line
    ctx.beginPath();
    vals.forEach((v, i) =>
      i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v))
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.stroke();

    // Fill area under curve
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = color + "25";
    ctx.fill();
  }, [data, color]);

  return (
    <canvas
      ref={ref}
      width={400}
      height={h}
      style={{ width: "100%", height: h, display: "block" }}
    />
  );
}
