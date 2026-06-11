/**
 * Reusable card container with dark theme styling.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {React.CSSProperties} [props.style] - Additional inline styles
 * @returns {JSX.Element}
 */
export default function Card({ children, style }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        borderRadius: 14,
        padding: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
