/**
 * Modal bottom sheet component with overlay backdrop and slide-up animation.
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the sheet is visible
 * @param {() => void} props.onClose - Close handler
 * @param {string} props.title - Sheet title
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function BottomSheet({ open, onClose, title, children }) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "#00000077",
            zIndex: 40,
          }}
        />
      )}
      <div
        style={{
          position: "fixed",
          left: "50%",
          transform: `translateX(-50%) translateY(${open ? "0" : "100%"})`,
          bottom: 0,
          width: "100%",
          maxWidth: 430,
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border-elevated)",
          borderRadius: "18px 18px 0 0",
          transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
          zIndex: 50,
          maxHeight: "82vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            padding: "10px 16px 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              background: "var(--border-elevated)",
              borderRadius: 2,
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            padding: "8px 16px 10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: "var(--color-text-primary)",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-input)",
              border: "none",
              color: "var(--color-text-muted)",
              borderRadius: 20,
              width: 28,
              height: 28,
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            overflowY: "auto",
            padding: "0 16px 40px",
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
