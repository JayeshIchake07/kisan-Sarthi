/**
 * Circular score ring SVG component used for loan scoring and benchmarking.
 *
 * @param {Object} props
 * @param {number} props.score - Score value (0–100)
 * @param {number} [props.size=80] - SVG size in pixels
 * @returns {JSX.Element}
 */
export default function Ring({ score, size = 80 }) {
  const col =
    score >= 75 ? "var(--color-healthy)" : score >= 50 ? "var(--color-mild)" : "var(--color-severe)";
  const r = 32;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      style={{ flexShrink: 0 }}
    >
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="var(--bg-input)"
        strokeWidth="8"
      />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke={col}
        strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
      />
      <text
        x="40"
        y="46"
        textAnchor="middle"
        fill={col}
        fontSize="18"
        fontWeight="700"
      >
        {score}
      </text>
    </svg>
  );
}
