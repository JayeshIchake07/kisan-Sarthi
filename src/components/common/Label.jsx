/**
 * Section label with uppercase styling for card headers.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function Label({ children }) {
  return (
    <div
      style={{
        color: "var(--color-label)",
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}
