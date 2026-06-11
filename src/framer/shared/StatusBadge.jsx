import { motion } from 'framer-motion';
import { statusColor, statusBgColor } from './colors';
import { typography } from './typography';

/**
 * Animated status badge with optional pulse for critical states.
 */
export default function StatusBadge({ status, label, size = 'md', pulsing = false }) {
  const color = statusColor(status);
  const bg = statusBgColor(status);
  const displayLabel = label || status;

  const sizeMap = {
    sm: { fontSize: typography.xs, padding: '2px 8px', dotSize: 6 },
    md: { fontSize: typography.sm, padding: '4px 12px', dotSize: 8 },
    lg: { fontSize: typography.base, padding: '6px 16px', dotSize: 10 },
  };
  const s = sizeMap[size];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: s.padding,
        borderRadius: '9999px',
        background: bg,
        border: `1px solid ${color}33`,
        fontSize: s.fontSize,
        fontWeight: typography.medium,
        color,
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
        fontFamily: typography.fontFamily,
      }}
    >
      <motion.span
        animate={
          pulsing
            ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }
            : {}
        }
        transition={pulsing ? { duration: 2, repeat: Infinity } : {}}
        style={{
          width: s.dotSize,
          height: s.dotSize,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      />
      {displayLabel}
    </motion.span>
  );
}
